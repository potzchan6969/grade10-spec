## Context

The auction worker (`packages/grade10-auction/backend`, deployed as
`apps/backend/grade10/auction`) runs every lot on Postgres under one listing
row lock. Before this change the five-minute sweep was the only closer, the
late-bid branch on the bid and confirm paths had no upper bound, readers
decided Ended from the stored `ends_at` alone, pages polled, and every
countdown ran on the device's timer and rounded down. The proposal holds the
motivation; the deltas hold the behaviour:
[auction](specs/grade10-site/auction/auction/spec.md),
[listing-page](specs/grade10-site/auction/listing-page/spec.md),
[account-record](specs/grade10-site/auction/account-record/spec.md), and for
the zero starting price folded from `allow-zero-starting-price` (Q15),
[listing](specs/grade10-admin/auction/listing/spec.md),
[auto-bidding](specs/grade10-site/auction/auto-bidding/spec.md) and
[bid-increments](specs/grade10-site/auction/bid-increments/spec.md).

The implementation is built on `feat/relay-auction-live-state` in grade10.
Its plan of record, `docs/temp/auction-realtime-plan.md` there, is overruled
by [Decisions](decisions.md#decisions) on page states: no Closing label and no
new copy.

![How a committed change reaches every open page](assets/live-relay.svg)

## Goals / Non-Goals

**Goals:**

- One row-only clock rule shared by the bid guards, the close, every read and
  the browser
- One idempotent settle with three callers, so a lot closes at its close
- A relay that reads committed state back and decides nothing

**Non-Goals:**

- A fourth public status or any new copy - pages fold the internal `closing`
  phase into the existing Closed state
- Storage in a Durable Object beyond its alarm; push to closed tabs; edge
  caching of snapshot reads

## Decisions

The deltas govern when a bid counts, which bids extend, the late window, who
settles, what pages show and what My Auctions shows. This section records how
that lands.

### One Clock Rule, Twice

- **`liveClock(row, nowMs)` and `nextDeadlineAt`** - in
  `@grade10/auction-contracts` (`contracts/src/liveClock.ts`), row-only, run
  by the worker, the room and the browser
- **`clockSql`** - the same rule as one SQL fragment
  (`services/listings/clockSql.ts`) for catalogue ordering, keyset paging and
  My Auctions; a parity test runs both over one case table
- **Inputs** - S `scheduled_ends_at`, E `ends_at`, and the reach
  R = min(`extension_seconds`, cap) when both are above 0, else 0

| Row | Phase | Takes a bid | Next deadline |
| --- | --- | --- | --- |
| `published`, before `starts_at` | `upcoming` | no | `starts_at` |
| `published`, `starts_at` through S inclusive | `open` | yes | S + 1 ms |
| `published`, E > S, before E | `extended` | yes | E |
| `published`, anything else | `closing` | no | now |
| `closed`, `settled`, or a public `canceled` | `ended` | no | none |

- **`closing` is internal** - `deriveExternalLotStatus` maps `published` to
  Upcoming or Active by `starts_at` alone, so the public status keeps three
  values; the lot page renders `closing` as the existing Closed state with no
  result and its bid controls disabled
- **Writers refine under the lock** - `resolveLocked` asks whether an accepted
  bid exists: with one, R > 0 and now before S + R, the lot is `extended` and
  the settle writes E := S + R; at or past S + R it writes E and closes in the
  same call. This bounds the late window
- **A bid at exactly S counts**, extension on or off
- **Rejected** - a `closing` external status (Q3); readers using
  `hasAcceptedBid`, which would put an `EXISTS` into the keyset cursor

### When a Bid Counts, and Which Bid Extends

- **Holds on** - `placeBid` records a `pending` bid; the hold confirm
  (`promotePendingBid`, inline or by webhook) accepts it under the lock,
  judged by the clock read after the lock. Past the effective close it
  answers `too_late` and releases the hold
- **Holds off** - `placeBid` accepts the bid inside its own locked
  transaction, so it is judged once, when placed, and a close right after it
  never finds it `pending` (Q2). A `pending` bid left from before holds were
  turned off is refused when its promotion lands past the effective close or
  below a price that has moved
- **The close** - marks every still-`pending` bid `lost` and releases its
  hold, so a lone pending first bid at S leaves the lot unsold
- **Extension** - only a bid whose resolution raises the public price sets
  E := its time + `extension_seconds`, capped at S + cap; the maximum
  resolution's `mayExtend` is false when a leader raises their own maximum.
  Equal maxima at a higher price raise it and extend

### Settle: One Function, Three Callers

- **`settleIfDue`** - its own transaction through `withListingLock`, clock
  read after the lock; writes the publish, the first extension, the close, or
  nothing; idempotent
- **Callers, in order** - the lot room's alarm (blocking lock, so it waits
  behind a last-millisecond bid and re-arms); a deferred settle from any read
  that finds a lot `closing` past its deadline (`deferSettle.ts`, after the
  answer, `SKIP LOCKED`, debounced per listing per isolate); the sweep's
  settle loops, whose hits count `auction.sweep.repair`
- **No writer settles inline** - a bid or confirm on a `closing` lot refuses
  with `NOT_BIDDABLE`, because a close can throw and must not fail the bid or
  the Stripe webhook
- **`settleDepsOf(env, events)`** - `{ clock, outbox, inventory, events }`,
  built once for all three callers; a publish's price refresh runs after
  commit. Every committed close records `auction.close.lag_ms`
- **Rejected** - the sweep alone (up to five minutes late); a Queue or
  Workflow timer (cannot move with the deadline and holds no sockets)

### Versions and the Change Signal

- **`version`** on `auction_listings`, raised by triggers (below) and carried
  by every payload holding lot state; a missing one decodes as 0 and every
  client keeps the higher
- **`withListingLock(db, events, id, fn, opts)`** in `src/lock.ts` - the only
  place a listing row is locked; it refuses an open transaction, re-reads the
  version after commit, and calls `events.changed(id, version)` only when it
  rose, the row can reach a room, and a sandbox lot is allowed here
- **`events` is required** on every writer, so a new writer cannot forget to
  signal; `noListingEvents` is the explicit opt-out for tests and fixtures.
  `scripts/checks/check-listing-lock.mjs` refuses a `.for("update")` on
  listings outside `lock.ts`
- **Production adapter** - calls the room on `waitUntil`, best effort
- **Rejected** - writers sending the state (a wrong or out-of-order state);
  `LISTEN`/`NOTIFY` (Hyperdrive carries none, and a held connection keeps
  Neon awake)

### Rooms

- **`AuctionRoom`** - one Durable Object class in
  `src/durables/AuctionRoom/`, one instance per public lot (`lot:<id>/v1`) and
  one for the catalogue (`catalogue/v1`), placed `apac-se` beside Neon; the
  rules live in `room.ts` over ports, and the class holds sockets, the alarm
  and its RPC surface (`changed`, `relay`, `inspect`, `alarm`)
- **Reads through the worker** - `ROOM_WORK`, a self service binding to the
  `AuctionRoomWork` entrypoint (`readLive`, `settle`, `readLiveCatalogue`), so
  every read and settle runs against Postgres in the worker
- **Hibernating sockets** - the only client message is `ping`, answered by
  the auto-response without waking the room
- **Frames** - `hello` with `serverNow` and the whole lot (or every live lot);
  `state` with the whole lot and its `version`; `gone`, then close 4404. No
  frame carries a bidder id, a storefront or anything `public.listing` does
  not already return
- **Alarm** - a cache of the worker's `nextDeadlineAt`, set on every read to
  at least 50 ms out and deleted at `ended`; a thrown settle retries with
  backoff from 2 s to 30 s
- **Rejected** - server-sent events (an open stream keeps a room from
  hibernating); a room per auction (one alarm per lot needs no scheduler)

### Browser Clock and Live Queries

- **Server clock** - `serverNow() = anchor + performance.now() - anchorPerf`;
  3 probes to `/public/time`, the shortest round trip sets the anchor;
  re-probed on reconnect, on becoming visible, on `pageshow`, every 10
  minutes and on a wall-clock jump; a correction under 1 s never raises a
  displayed countdown (`frontend/src/core/live/serverClock.ts`). Until a
  probe answers, the clock runs from the served document's render time at
  the navigation's response start, so it carries on from what was served;
  with neither, it runs on the device clock until a later probe answers
- **One frame loop** - `createFrameClockStore` from `@grade10/ui` drives every
  countdown through `ClockProvider`, and `remainingSeconds` rounds up to whole
  seconds, the last 10 included (Q31); the app hands it the server clock
  (`core/live/liveClock.ts`), so the store's blocks and the app read one clock
- **Live queries** - `liveAuctionSocket.ts` holds one ref-counted socket per
  room; each feature's live hook writes frames into the query it already
  reads, and `higherVersion` as `structuralSharing` keeps a racing fetch from
  going back. A `gone` frame re-reads the lot, which then reads called off.
  After 3 failed transports a page polls; a lot still `closing` refetches
  until its result arrives
- **Own standing follows the version** - `useListingUi` refetches the
  signed-in viewer's standing whenever the lot's `version` rises above the one
  it last saw, so Outbid, the minimum next bid, a hold that confirmed too late
  and the recorded result read from the viewer's own authenticated read (Q12).
  Frames carry no standing. Rejected: a per-viewer frame (a public room would
  have to know who holds each socket)
- **My Auctions** - bidding rows carry `topAmountMinor` and take their phase
  from `liveClock`, so a `closing` lot keeps its standing in Active until the
  close commits

### Refusal Words

- **`auctionListing.bidDidNotGoThrough`** - a key of its own holding each
  locale's existing first sentence of `authorizationProviderFailure`, shown
  alone for a confirm after the close and a bid refused at or after it (Q13).
  `authorizationProviderFailure` keeps its full string where it shows today
- **Where it shows** - `bidRefusalCopy` maps `NOT_BIDDABLE` to it, and the lot
  view shows it when the standing re-read finds the viewer's confirming bid
  `lost` past the close; a card that failed to authorize keeps the full string

### Zero Starting Price

Folded from `allow-zero-starting-price`; built in grade10 #667. Four checks
refused a starting price of 0, and none of them is a database constraint:
`auction_listings.starting_price` is a nullable `bigint` with no check.

| Where | What refused 0 |
| --- | --- |
| `packages/grade10-auction/admin-frontend/.../ListingEditor.tsx` | `priceError` - `amountMinor > 0`, "must be an amount above zero" |
| `packages/grade10-auction/backend/src/trpc/routers/listings.ts` | `startingPrice: positiveInt` on the draft, update and create inputs |
| `packages/grade10-auction/backend/src/services/listings/draft.ts` and `schedule.ts` | `isMinorAmount` from `@grade10/utils/money` - `> 0` |
| `packages/grade10-auction/contracts/src/admin.ts` | the test-bid listing's `startingPrice: positiveMinorUnits`, and `testBids.ts`'s `startingPrice > 0` eligibility |

The read-back already copes: `displayed()` formats any non-null amount
through `formatMinor`, so 0 reads as a zero amount (Q21). Two bidding paths
read the starting price as a price, and both broke at 0: `bidFloor` returned
`startingPrice` before any bid, taking a first maximum of 1 minor unit on a 0
start; `resolveStandingMaxima` stood a lone maximum at `startingPrice`, writing
a bid of 0 that `bids`' `maximum > 0 AND amount > 0` check refuses. `topAmount
= 0` stays the "no bid yet" sentinel read by `bidFloor`, `history.ts`,
`ListingsPanel` and the catalogue card.

1. **One opening-price helper** - `openingPrice(currency, startingPriceMinor)`
   beside `nextBidAmount` in
   `packages/grade10-auction/contracts/src/bidIncrements.ts`: the starting
   price when above 0, else `nextBidAmount(currency, 0)` - 100 `USD`, 1000
   `HKD`, 100 `JPY` (Q19, Q27). `bidFloor`'s no-bid branch,
   `resolveStandingMaxima`'s lone-leader branch and its public record, and the
   demo's `FakeAuctionService` call it; every reader of the published minimum
   goes through `bidFloor`. The published minimum follows accepted state
   alone: the lot page, the cards and live frames pass no pending maximum,
   so a bid still confirming never raises it, as bid-increments' "The
   minimum uses the amount being beaten" and auto-bidding's "Maximum stays
   private" require; only the writer's floor under the lock counts pending
   bids. Rejected: a 0-start case inline in each path;
   storing the opening price on the listing; `nextBidAmount` of the starting
   price for every first bid
2. **A non-negative whole amount for the starting price only** - one local
   check in `services/listings/`, shared by `draft.ts` and `schedule.ts`: a
   safe integer, 0 or more, refused as "starting price must be whole minor
   units, 0 or more" under `INVALID_PRICING`. The tRPC inputs reuse the
   router's `nonNegativeInt` for `startingPrice` only. Rejected: relaxing
   `isMinorAmount`, which every bid, hold and payment amount relies on; a new
   `@grade10/utils/money` helper for two callers; relaxing `positiveInt`
   wholesale
3. **Empty stays null end to end** - the form keeps `null` for an empty field
   and `0` for an entered 0; `priceError` refuses `null` where the price is
   required and accepts `>= 0`. The create input stays non-nullable, so an
   absent or null price fails the schema (Q23). Rejected: decoding an empty
   string to 0 at the edge
4. **Sandbox test bids take a 0 start** - `testBids.ts` drops its
   `startingPrice > 0` eligibility and the contract reuses
   `nonNegativeMinorUnits`; `minimumNextAmount` stays positive because
   `bidFloor` returns the opening price

## Database Schema

Owner: the auction database, schema `auction`; migration
`0013_listing_version.sql`.

| Table | Column | Type | Null | Default |
| --- | --- | --- | --- | --- |
| `auction_listings` | `version` | `bigint` | not null | `0` |

- **`auction_listings_version`** - `BEFORE UPDATE ... FOR EACH ROW WHEN (OLD.*
  IS DISTINCT FROM NEW.*)` sets `NEW.version := OLD.version + 1`
- **`bids_bump_auction_listings_version_on_insert` and `_on_update`** -
  `AFTER INSERT`, and `AFTER UPDATE OF state, amount, maximum` when one of
  them changed, raise the parent listing's version
- **Armed `ENABLE ALWAYS`**, rendered by `listingVersionSql()` through the
  counter-trigger helper in `@grade10/postgres`
- **Authority** - `version` only orders copies of a lot; the lot's state stays
  in its existing columns. No index: reads are by primary key

## Service Interfaces

| Function | Input | Success | Refusal or fault |
| --- | --- | --- | --- |
| `settleIfDue` | `db, SettleDeps, listingId, { skipLocked? }` | `{ published?, extended?, closed?, nextDeadlineAt }` | `null` when missing or skipped; a throw rolls back |
| `withListingLock` | `db, ListingEvents, listingId, fn, { onMissing?, skipLocked? }` | `fn`'s result, then `changed(id, version)` | `LISTING_NOT_FOUND`; a throw on an open transaction |
| `AuctionRoomWork.readLive` | `listingId` | `{ lot, nextDeadlineAt }` | `null` for an unknown, non-public or sandbox lot |
| `AuctionRoomWork.settle` | `listingId` | the same, after `settleIfDue` | a throw, retried by the alarm |

Example - S 20:00:00, `extension_seconds` 1800, no cap, one accepted bid:

| Moment | Who | Writes | `ends_at` after | Signal |
| --- | --- | --- | --- | --- |
| 20:00:00.001 | alarm → `settleIfDue` | first extension | 20:30:00 | `changed` |
| 20:10:00 | price-moving bid | bid rows, `top_amount`, `ends_at` | 20:40:00 | `changed` |
| 20:12:00 | leader raises own maximum | bid `maximum` | 20:40:00 | `changed` |
| 20:40:00 | alarm → `settleIfDue` | close, outcome | 20:40:00 | `changed`; alarm deleted |

## API Contracts

All additive; a browser from the previous deploy keeps working.

| Route | Answer |
| --- | --- |
| `GET /auction/api/public/time` | the worker's clock, `no-store`, no database |
| `GET /auction/api/public/live/lot/<listingId>` | WebSocket upgrade; `Origin` and a per-IP limit checked; no database read |
| `GET /auction/api/public/live/catalogue` | the same, for the catalogue room |

- **Payload fields** - listing, summary and Featured payloads add `version`,
  `hasAcceptedBid`, `ledgerTotal`, `extensionSeconds` and
  `extensionCapSeconds`; My Auctions bidding rows add `topAmountMinor`

The zero starting price widens three admin fields; every client that sent a
valid value still does, and `packages/api-docs/generated/auction.json` is
regenerated.

| Procedure | Field | Before | After |
| --- | --- | --- | --- |
| Listing draft save and update | `startingPrice` | `nullish(positiveInt)` | `nullish(nonNegativeInt)` |
| Listing create | `startingPrice` | `positiveInt` | `nonNegativeInt` |
| Admin test-bid listing read | `startingPrice` | `positiveMinorUnits` | `nonNegativeMinorUnits` |

## Risks / Trade-offs

- [A signal is lost after commit] → the next signal, a reconnect's `hello`, a
  deferred settle or the sweep carries the change; frames are whole state
- [The alarm is lost, or settle throws] → the page stays Closed with no
  result; a read past the deadline settles it, the sweep within five minutes,
  and bids are refused, never accepted late
- [A frame or a fetch arrives out of order] → the lower `version` loses
- [The device clock is wrong or jumps] → countdowns run on
  `performance.now()` plus the probed offset
- [A socket cannot open] → the page polls
- [A deploy restarts every room] → jittered reconnect, one single-flight read
  per room; stored alarms survive
- [A reader treats `startingPrice` as truthy and hides a 0] → a sweep found
  no truthy reads in `packages` or `apps`; the admin and site tests render a
  0 start and assert a zero amount, not "—"
- [A lone leader at 0 writes a zero-amount bid] → `openingPrice` is never 0,
  and `bids`' `amount > 0` check stays as the backstop, so `topAmount = 0`
  still means no bid

## Migration Plan

1. **Migration** - `0013_listing_version` applies ahead of the code; the
   column is catalog-only and the applier's `lock_timeout` retry covers the
   brief exclusive lock
2. **Room class alone** - the deploy that introduces `AuctionRoom`, its
   `new_sqlite_classes` migration, `AUCTION_ROOM`, `ROOM_WORK` and
   `LIVE_CONNECT_LIMITER` is a whole `wrangler deploy` carrying no other app,
   because it is a rollback barrier
3. **Rooms, sockets and the close rules** - ship together with no flag
   (Q11); a rollback is a code revert, which leaves the room class deployed
4. **Zero starting price** - already deployed with grade10 #667, backend
   before the admin frontend, so a form that sends 0 never met a service that
   refuses it. A backend rollback is safe only while no 0-start listing is
   published, since bidding on one needs the new `bidFloor`
