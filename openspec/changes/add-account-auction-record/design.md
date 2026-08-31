## Context

The auction service already owns listings, bids, payment holds, settlements,
fulfilments, and a per-storefront `watches` relation. The store worker resolves
the customer session and reaches that service through the storefront-pinned
entrypoint. See the [account record spec](specs/grade10-auction/account-auction-record/spec.md)
and [shared UI spec](specs/shared-ui/auction-record/spec.md) for the product
contract.

The existing own-list reads are deliberately narrow and ordered by creation
time. They cannot render the record without per-row enrichment, do not retain
an explicit-interest distinction from a bid-created reminder row, and do not
enforce the agreed watch limit.

## Goals / Non-Goals

**Goals:**

- Project the collector record from auction-owned facts in one bounded,
  owner-scoped read.
- Keep an explicit watch distinct from the reminder membership a bid creates.
- Enforce a maximum of 1,000 explicit watches atomically.
- Let the Grade10 storefront render and refresh the record solely through its
  authenticated store API and typed fixtures.

**Non-Goals:**

- Add a second source of truth for bids, outcomes, payment, or fulfilment.
- Change the anonymous auction gateway, ZZZ, or post-sale writes.
- Add a `ui.md` or implement a Figma-directed layout in this planning pass.

## Decisions

### Project one record at the auction boundary

Add a signed-in auction-service read that returns the Watching and Bidding
projections in their independently paged groups. The store router supplies the
session identity and exposes this as an authenticated procedure; the browser
never selects a user or calls the auction worker directly.

The read joins listings, the caller's latest bid, settlement, fulfilment, and
the applicable payment hold. It maps those authoritative rows to collector
states at read time. It returns enough listing identity, clock, currency,
current floor, and refresh status for a row to render without follow-up calls.

Rejected alternative: assembling `myWatches`, `myBids`, standing, and
post-sale calls in the SPA. That produces N+1 reads, risks clock-dependent
states disagreeing, and leaves the browser to reconstruct payment state.

### Preserve one relation but stamp explicit interest

Keep `auction.watches` as the notification/reachability relation already
referenced by bids and deletion. Add an `explicit_watched_at` stamp. A watch
control inserts or restores that stamp; a bid may retain or create the row for
existing reminder behavior but does not set it. Watching-list reads select only
the explicit stamp. Unwatch clears it and deletes the relation only when no
bid/reminder responsibility remains.

Rejected alternative: a second explicit-watch table. It duplicates the same
identity/listing key and creates two retention paths for a collector's
interest. Rejected alternative: treating every bid-created row as a watch.
That makes a bid silently consume the limit and prevents a collector from
removing only their explicit watch.

### Enforce the 1,000-watch ceiling under the write transaction

`watchListing` locks the collector's bidder row, counts explicit watches for
that `(storefront, user_id)`, and inserts/restores the stamp only when the
count is below 1,000. A unique relation key keeps retries idempotent. The
existing listing-row money lock is not taken: this mutation does not alter
money or listing state.

Rejected alternative: count in the browser or before the transaction. Either
allows concurrent requests to exceed the ceiling. Rejected alternative: a
cached counter. It adds repair work to a small bounded relation without making
the constraint stronger.

### Keep collector vocabulary at the projection edge

The repository maps raw bid, hold, settlement, and fulfilment states into a
closed collector-record discriminated union. `captured` and manual collection
both map to `paid`; shipment wins over payment once it starts. A non-winner's
latest hold maps to `releasing` until `released`, never to released early.
The operator vocabulary remains unchanged.

Rejected alternative: exposing database states to the storefront. It would
make operator and Stripe implementation details a customer-facing contract and
would make a bare collector `Paid` impossible.

### Keep shared blocks controlled

`@grade10/ui` owns the named `auction-record` exports and accepts row data,
labels, callbacks, and pending state through props. The Grade10 frontend owns
the React Query lifecycle, undo timeout, route selection, navigation, and all
translated copy. It composes the blocks in a new account-auction-record feature
slice; it does not add product state to `@grade10/ui`.

Rejected alternative: extending the existing listing action directly for every
surface. It keeps the control usable on a listing page but cannot provide the
record frame, lists, and empty/error states as a reusable contract.

## Database Schema

The auction service owns the change. Existing bidder, listing, bid, hold,
settlement, and fulfilment rows remain authoritative; collector row states are
derived and stored nowhere.

| Table | Column | Postgres type | Nullability | Default | Purpose |
| --- | --- | --- | --- | --- | --- |
| `auction.watches` | `explicit_watched_at` | `timestamp with time zone` | nullable | none | The time the collector explicitly watched this listing; null means a bid/reminder-only relation. |

The existing primary key `(storefront, user_id, listing_id)` remains the
idempotency key. Add a partial index on `(storefront, user_id,
explicit_watched_at desc, listing_id desc)` where `explicit_watched_at is not
null`; it serves the owner-scoped Watching order and count. The migration sets
the stamp to `created_at` for existing rows so existing collector watches are
preserved.

```text
bidders (storefront, user_id)
  └─< watches (storefront, user_id, listing_id, explicit_watched_at) >─ listings
                                                           │
listings ─< bids ─< payment_holds                          ├─ settlements
                                                           └─ fulfilments
```

## Service Interfaces

| Processor | Fixed input | Success / refusal | Transaction and data boundary |
| --- | --- | --- | --- |
| `watchListing` | `{ listingId, userId, email, name? }` | `{ watching: true }` or the existing listing/bidder refusal plus `WATCH_LIMIT_REACHED` | Auction service transaction; lock bidder row, validate listing and bidder, count explicit stamps, upsert the relation. The storefront identity is fixed by its entrypoint. |
| `unwatchListing` | `{ listingId, userId }` | `{ watching: false }` | Auction service transaction; clear only `explicit_watched_at`, retaining any bid/reminder responsibility. Repeated calls converge. |
| `readAuctionRecord` | `{ userId, cursors?, limits? }` | bounded owner record or an invalid-cursor refusal | Read-only auction-service query. The router adds `userId` from session; no client field can address another collector. Repository joins enrich once and maps derived states before returning. |

The store tRPC router authenticates each procedure, passes the session id and
identity snapshot only to watch writes, translates known service refusals into
renderable values, and propagates unexpected faults as failures. The frontend
uses the typed procedure client; fixtures implement the same record shapes so
frontend work does not wait on a running worker.

For a successful new watch by Grade10 user `u-42` on listing `l-9`, the
transaction locks bidder `(grade10, u-42)`, finds 999 explicit stamps, and
upserts `(grade10, u-42, l-9, explicit_watched_at=now)`. At 1,000 stamps it
returns `WATCH_LIMIT_REACHED` without changing a row.

## Risks / Trade-offs

- **A historical bid-created row could appear as an explicit watch** → the
  migration uses existing `created_at`, preserving prior watch-list behavior;
  the new writer alone distinguishes future bid-only rows.
- **The record query spans high-cardinality bids** → each group is owner-bound,
  keyset-paged, and uses latest-bid queries/indexes rather than loading bid
  history.
- **A clock-dependent field becomes stale after the read** → the response
  carries its refresh state and the frontend refreshes active groups; failed
  refreshes render the value as not current.
- **Unwatch races a bid** → the bidder-row transaction serializes the explicit
  stamp update, while the bid's listing-row transaction preserves its own
  money invariant; neither operation deletes the other fact.

## Migration Plan

1. Add the nullable stamp and partial index through an expand migration, then
   generate and check the Drizzle migration.
2. Deploy the auction contract and service projection before the store router
   and frontend consume it. The additive read and refusal leave existing
   procedures valid.
3. Deploy the Grade10 store and frontend after the spec submodule bump.
4. Roll back the consumers first if needed; the added column and index are
   harmless to the prior service and are removed only in a later contract
   migration after all deployed code no longer reads them.
