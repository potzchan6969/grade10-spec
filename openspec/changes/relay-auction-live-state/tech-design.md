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
[account-record](specs/grade10-site/auction/account-record/spec.md).

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
- **Holds off** - the bid is judged when placed (Q2)
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
- **Production adapter** - calls the room on `waitUntil`, best effort, and
  does nothing while `auction.realtime` is off
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
  countdown through `ClockProvider`, and `remainingSeconds` rounds up; the app
  hands it the server clock, so the store's blocks and the app read one clock
- **Live queries** - `liveAuctionSocket.ts` holds one ref-counted socket per
  room; each feature's live hook writes frames into the query it already
  reads, and `higherVersion` as `structuralSharing` keeps a racing fetch from
  going back. A `gone` frame re-reads the lot, which then reads called off.
  After 3 failed transports a page polls; a lot still `closing` refetches
  until its result arrives
- **My Auctions** - bidding rows carry `topAmountMinor` and take their phase
  from `liveClock`, so a `closing` lot keeps its standing in Active until the
  close commits

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
| `GET /auction/api/public/live/lot/<listingId>` | WebSocket upgrade; 404 while `auction.realtime` is off; `Origin` and a per-IP limit checked; no database read |
| `GET /auction/api/public/live/catalogue` | the same, for the catalogue room |

- **Payload fields** - listing, summary and Featured payloads add `version`,
  `hasAcceptedBid`, `ledgerTotal`, `extensionSeconds` and
  `extensionCapSeconds`; My Auctions bidding rows add `topAmountMinor`

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
- [Overlap with `allow-zero-starting-price`] → both modify the auction's
  window requirement; whichever is accepted second rebases its block onto
  the first
- [Two switches per environment] → the worker's `auction.realtime` and the
  storefront's `AUCTION_REALTIME` turn on together; either alone degrades to
  polling, never to a wrong state

## Migration Plan

1. **Migration** - `0013_listing_version` applies ahead of the code; the
   column is catalog-only and the applier's `lock_timeout` retry covers the
   brief exclusive lock
2. **Room class alone** - the deploy that introduces `AuctionRoom`, its
   `new_sqlite_classes` migration, `AUCTION_ROOM`, `ROOM_WORK` and
   `LIVE_CONNECT_LIMITER` is a whole `wrangler deploy` carrying no other app,
   because it is a rollback barrier; the close rules ship in it, unflagged
   (Q11)
3. **Flag flip** - `auction.realtime` in
   `apps/backend/grade10/feature-config.ts` and `AUCTION_REALTIME` in
   `apps/frontend/grade10/src/config.ts`, per environment. Rollback turns both
   off: the routes answer 404, writers stop signalling, pages poll
