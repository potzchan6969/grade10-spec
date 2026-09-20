## Context

The auction service is one worker for every storefront, described in the
application repository's `docs/architecture/auction.md`. A lot is a row in
`auction.auction_listings`, and the row carries one status out of `draft`,
`created`, `published`, `closed`, `settled`, `canceled`, plus `starts_at`,
`scheduled_ends_at` and `ends_at`. The operator queue derives its own outcome
from that row and its clocks in `listingOutcomeExpression`; nothing is stored
for it.

What already holds part of this change:

- **Public projection refuses three statuses** — `PUBLIC_STATUS` in
  `packages/grade10-auction/backend/src/services/listings/publicState.ts` maps
  `draft`, `created` and `canceled` to `null`, and
  `PUBLISHED_LISTING_STATUSES` is derived from that map, so the browse query
  and the projection cannot disagree
- **Calling a lot off rewrites its address** — `adminCancelListing` sets the
  status to `canceled`, renames the slug to `<slug>-cancelled-<id>`, cancels
  every bid and releases the live hold, then purges the listing's cache tags
- **The catalogue already ranks by the three statuses** — `statusRankOf` in
  `repositories/listings.ts` orders Active, Upcoming, Ended from the row and
  the read's clock, mirrored in TypeScript by `catalogueRankOf` for the cursor
- **The bidder's rows come from their own bids** — My Auctions reads Active,
  Won and Didn't win from `bid_bidder_status`, and a called-off lot already
  reaches a bidder there with the released-hold note

What does not hold:

- **The value is nowhere on the wire** — the public shapes carry
  `status: published | closed | settled`, which is the row's vocabulary, and
  every collector page re-derives its own labels from that plus the clocks
- **Watch reads publish hidden lots** — `listMyWatches` publishes
  `OwnListingStatus`, which includes `draft` and `canceled`, and My Auctions'
  Watching section reads `readAccountWatchRows` with no status predicate

## Goals / Non-Goals

**Goals:**

- One derivation of the external lot status, read by the SQL the catalogue
  orders with, by the projections, and by the site
- The same hidden-lot predicate on every collector read, derived from one map
  rather than written out per query
- The bidder exception carried by records that already exist

**Non-Goals:**

- A stored column, a generated column or a view for the external lot status
- The operator queue's outcome, its vocabulary and its filters
- Which pages show the status, and the labels they show it with
- Deleting a watch, a bid or a listing row when a lot is called off

## Decisions

The spec governs the three values, the mapping table, that the value is worked
out rather than saved, and which reads a hidden lot is absent from. These are
the implementation choices under it.

### One pure derivation, in the contracts package

- **Where** — `packages/grade10-auction/contracts/src/schemas.ts`, beside the
  public shapes, as `deriveExternalLotStatus(row, at)`. The precedent is
  `deriveAuctionOrderStatus`, which the backend's order status service already
  wraps
- **Input** — the row facts the value needs: `status`, `startsAt`, `endsAt`,
  and the read's clock. No campaign, no bid, no order
- **Output** — `"upcoming" | "active" | "ended" | null`, where `null` is
  Hidden. A caller that must publish a lot treats `null` the way
  `publicStatus` already treats an unpublishable status: refuse the read
- **Exhaustive over the row vocabulary** — mapped through a
  `satisfies Record<ListingStatus, …>` map, so a seventh listing status fails
  to compile here rather than reaching a collector as itself

The spec's internal lot statuses are the operator's vocabulary. They land on
the row this way:

| Internal lot status | Listing row | External lot status |
| --- | --- | --- |
| Draft | `draft`, or `created` before its publish clock | Hidden |
| Scheduled | `published`, `starts_at` > now | Upcoming |
| Live | `published`, `starts_at` ≤ now < `ends_at` | Active |
| Unsold | `closed` or `settled` with no winner | Ended |
| Called off | `canceled` | Hidden |
| Awaiting Address … Refunded | `closed` or `settled` with a winner | Ended |

- **`created` is Hidden with Draft** — a `created` lot has a slug but has not
  reached `publish_at`, so it is not yet available for bidding, which is what
  the spec's Draft row names. It reads as not found today and keeps doing so
- **Extended bidding needs no arm** — `ends_at` already carries the
  extension, so a lot in extended bidding is `published` with `ends_at` in the
  future, which is Active
- **A lot the close sweep has not reached is Ended** — `published` with
  `ends_at` in the past, the arm `statusRankOf` already has
- **The winner's order is not read** — every post-sale status in the table
  lands on the same `closed`/`settled` row, so the derivation never joins
  `auction_orders`

### The SQL keeps its own copy, pinned by a test

- **Why** — the catalogue orders and pages by the status rank inside Postgres;
  a TypeScript function cannot be the `order by`
- **How** — `statusRankOf` and `statusKeyOf` stay in SQL, and the TypeScript
  derivation is what the cursor and every projection use. A db-lane test walks
  one lot per arm of the table above and asserts the SQL rank and
  `deriveExternalLotStatus` agree
- **Rejected: a stored column** — a saved value is wrong between the clock
  passing and the sweep that would rewrite it, which is the drift the spec's
  "worked out, not saved" rules out
- **Rejected: a generated column or a view** — neither can read the request's
  clock, so Upcoming and Active would still need the `now` comparison at read
  time, and the view would add a second place the hidden predicate is written

### The hidden predicate rides the existing status map

- **Where** — `PUBLISHED_LISTING_STATUSES`, already derived from
  `PUBLIC_STATUS`, becomes derived from the new map instead, so one map states
  which statuses a collector may see and every query takes its list from there
- **Watch reads join it** — `buildListMyWatchesQuery` and
  `readAccountWatchRows` add `inArray(listings.status, …)` from the same list.
  A catalogue read needs no change: it already filters on it
- **Rejected: deleting the watch row on call-off** — a delete is destructive,
  it does not cover Draft, and it puts the rule in the write path where a
  later status would have to remember it. The read predicate covers every
  hidden status at once

### The bidder exception is the bid record

- **What detects it** — `bid_bidder_status` holds a row only for a collector
  who bid on that lot. My Auctions' Active, Won and Didn't win sections read
  from it, so a called-off lot reaches its bidders and nobody else without a
  flag, a column or a second query
- **What stays off it** — the hidden predicate is not added to
  `readAccountStatusRows`. Adding it there would remove the row the spec keeps
- **The note is already built** — a called-off lot maps to Didn't win with
  `hold_released` once the hold row is released, per
  `grade10-site/auction/account-record`; this change adds nothing to it
- **Watching filters unconditionally** — a bidder also holds a watch row, so
  the called-off lot would come back on the Watching list if the filter asked
  whether they bid. It does not: the lot reaches them once, as a bid

### No schema change

No column, index, constraint or migration. The change is a derivation, a read
predicate and a wire field.

## Service Interfaces

Every read below is already there; the columns say what each one gains. `now`
is the read's own clock in all of them.

| Read | Entry point | Behaviour today | This change |
| --- | --- | --- | --- |
| Catalogue page | `public.listings` → `publicListingPage` | hidden statuses already filtered | each summary carries `externalStatus` |
| Campaign page | `public.auction` → `publicListingsOfCampaign` | same filter | same field |
| Lot page | `public.listing` and RPC `readListing` → `publicListingStateBySlug` | `publicStatus` returns `null`, the route answers 404 | same field on the state |
| Sitemap and crawler directory | `readEveryLotId` over `public.listings` | inherits the catalogue filter | no change |
| Watchlist | RPC `listMyWatches` → `buildListMyWatchesQuery` | publishes `draft` and `canceled` rows | hidden rows filtered; `status` becomes the external lot status |
| My Auctions — Watching | `readAccountWatchRows` | no status predicate | hidden rows filtered |
| My Auctions — Active, Won, Didn't win | `readAccountStatusRows` over `bid_bidder_status` | called-off lots reach their bidder | unchanged, deliberately |

Transactions, locks and the money path are untouched: every read above is a
`select`, and the only writer involved is `adminCancelListing`, which already
purges the listing's cache tags in the same request.

**Worked example.** Collector A bids on lot `lst_7`, collector B watches it,
an operator calls it off.

| Row | After the call-off |
| --- | --- |
| `auction_listings` | `status: "canceled"`, `slug: "1966-omega-cancelled-…"` |
| `bids` (A) | `state: "canceled"` |
| `payment_holds` (A) | `state: "released"` |
| `bidder_watches` (A and B) | untouched |
| `bid_bidder_status` (A) | `phase: "completed"`, `standing: "canceled"` |

| Read | A sees | B sees |
| --- | --- | --- |
| `public.listing` at either slug | 404 | 404 |
| `public.listings` | absent | absent |
| Watching | absent | absent |
| Didn't win | `lst_7`, `hold_released` | absent |

## API Contracts

- **Added, anonymous** — `externalStatus: "upcoming" | "active" | "ended"` on
  `publicListingSummary`, `publicListingState` and their procedure twins. Every
  lot these shapes carry has one, because a hidden lot is not in them
- **Breaking, signed in** — `MyWatch.status` and the account record's
  `WatchingItem.listingStatus` carry the external lot status. `OwnListingStatus`
  and `WatchingListingStatus` lose `draft`, `canceled` and `unavailable`, which
  the filter makes unreachable; deleting the variants is what stops a page
  rendering a case that can no longer arrive
- **Unchanged** — `publicStatus` stays on the public shapes. It is the row's
  publish state, which the catalogue's own status filter still names, and
  replacing it is the follow-on design change's

## Risks / Trade-offs

- **[Two copies of the mapping, SQL and TypeScript] → the db-lane test walks
  every arm of the table and fails when the two disagree, the way
  `catalogueRankOf` is already held to `statusRankOf`**
- **[A lot called off while its page sits in the edge cache] → `cancel`
  already purges the listing and list tags in the same request, and the public
  reads carry `max-age=5`, so the stale window is bounded by the TTL rather
  than by the purge arriving**
- **[A collector loses a watched lot with no explanation] → the watch row is
  kept and the bid record still shows a bidder what happened; a watcher who
  never bid is told nothing, which is what the spec decides**
- **[The narrowed watch status breaks a consumer mid-deploy] → the auction
  worker deploys before the site, and the store backend only forwards the
  shape; the site's own build fails on the removed variants rather than
  rendering them**

## Migration Plan

1. Deploy the auction worker: the derivation, the read predicates and the
   added field. Older site bundles ignore the field and keep their own
   derivation.
2. Deploy the site: it reads `externalStatus` and drops the removed watch
   variants.
3. **Rollback** — redeploy the previous worker. Nothing was written, so a
   hidden lot reappearing on a watchlist is the whole of the regression.

## Open Questions

- **Whether the catalogue's status filter should name the three external lot
  statuses** rather than `published`, `closed` and `settled`. It changes no
  read in this change; the follow-on design change decides the labels and the
  filter together.
