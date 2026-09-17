## Context

The auction service stores both the immutable scheduled close and the current
effective close on `auction_listings`. Published bidding and close sweeps both
serialize on the listing row, while bid, hold, winner, and notification writes
share one Postgres transaction. The existing implementation also stores an
extension window beside the extension duration and uses the window to decide
whether a bid moves `ends_at`.

The public listing projection is edge-cached and is consumed by the site
through the auction contracts package. The admin post-sale queue derives its
outcome from the listing clock and returns the scheduled close. There is no
durable extended-bidding status and no new UI component is required. The
current service and deployment constraints are documented in
[`docs/architecture/auction.md`](../../../docs/architecture/auction.md).

## Goals / Non-Goals

**Goals:**

- Use `scheduled_ends_at` and `ends_at` as the two authoritative clock facts.
- Make the accepted-bid event, rather than a price change, the trigger for
  entering or restarting extended bidding.
- Keep the cap, bid resolution, holds, winner processing, and independent lot
  close behavior on their existing transaction boundaries.
- Expose enough clock data for the site and admin queue to derive the new
  presentation without a new listing status.

**Non-Goals:**

- Add a status, campaign clock, notification event, or new component export.
- Change bid increments, maximum-bid rules, holds, caps, or close-out
  outcomes.
- Decide whether catalogue tiles or My Auctions should show the extended-
  bidding label; that is a later design decision outside this change.

## Decisions

The capability specs govern when bids are accepted, when a lot enters or
restarts extended bidding, and which fields the public and admin contracts
carry. The implementation choices below make those requirements atomic and
compatible with the existing auction architecture.

### One effective close and one scheduled close

- Keep `auction_listings.scheduled_ends_at` as the planned close and
  `auction_listings.ends_at` as the effective close.
- Remove `extension_window_seconds`; `extension_seconds` is the only listing
  setting and keeps its existing integer-seconds representation and `1800`
  default.
- Derive `extendedBidding` as
  `scheduled_ends_at <= now < ends_at` for published queue rows. Do not add a
  status or persist a second boolean that can drift from the clocks.
- Preserve any already-later `ends_at` value for published listings at
  cutover. A listing whose effective close still equals its scheduled close
  adopts the scheduled-close entry rule as soon as the new service is live.

### Accepted bids drive the timer

- Hold the listing row through bid validation, bid acceptance, standing-maxima
  resolution, and the `ends_at` update. Inspect accepted bids in the same
  transaction so a pending or refused bid cannot enter extended bidding.
- Before `scheduled_ends_at`, an accepted bid never moves `ends_at`.
- At the scheduled close, a lot with at least one accepted bid and a positive
  duration enters extended bidding at `scheduled_ends_at + extension_seconds`,
  bounded by the existing cap. A no-bid lot closes at the scheduled close.
- During extended bidding, every newly accepted incoming or automatic bid
  restarts `ends_at` from that bid's transaction time for the full duration,
  subject to the cap. This update is independent of whether the public top
  price changed.
- Bid entry handles the boundary lazily when a close sweep has not run yet:
  an already-bid lot can be accepted after its scheduled close if its
  extension is otherwise live, and the accepted bid starts or restarts its
  timer in the same locked transaction. A lot with no accepted bid cannot be
  opened by a first late bid.
- The close sweep re-reads the locked listing and accepted bids. If it reaches
  the scheduled close before an extension has been recorded, it records the
  initial extension and leaves the listing published; otherwise it performs
  the existing close-out transaction. This makes the exact-close race resolve
  by the existing row lock.

### Keep service and repository boundaries

- Keep timing calculation in the bidding service's extension helper, with an
  input containing the listing clocks, duration, cap, current time, and the
  accepted-bid event. It returns only the monotonic capped effective close.
- Keep listing timing validation and persistence in the listing services and
  repository. Create and draft inputs accept the duration and cap only; draft
  defaults remain compatible with an unconfigured draft, while published
  creation defaults an omitted duration to `1800` seconds.
- Keep public projection mapping in the listing repository and public-state
  service. Add `scheduledEndsAt` and remove the window from both REST and
  procedure contracts.
- Keep the post-sale queue's outcome derivation unchanged. Select the
  effective close in addition to the scheduled close and derive the additive
  queue label from the two clocks.

### Rejected alternatives

- **Keep the window as an unread compatibility column:** rejected because the
  breaking contract and listing model must have one extension setting, and a
  live second setting invites future code to revive the old trigger.
- **Use a new `extended` status:** rejected because the state is fully derived
  from the two close timestamps and a status would require extra transition
  writes and reconciliation.
- **Extend only when the displayed price changes:** rejected because a valid
  accepted automatic or equal-price bid is still a bid during extended
  bidding and must restart the lot timer.
- **Rely only on the five-minute sweep:** rejected because the exact-close
  acceptance boundary and post-close bidding would depend on scheduler
  latency; the locked bid path provides the same rule immediately.

## Database Schema

The existing `auction_listings` row remains authoritative for auction timing.
Accepted bids remain authoritative for whether a lot has entered extended
bidding; `ends_at` is the derived effective close that is persisted after each
accepted-bid or sweep transition.

| Table | Column change | PostgreSQL shape | Authority |
| --- | --- | --- | --- |
| `auction_listings` | Keep `scheduled_ends_at` | existing `timestamptz NOT NULL` | Planned close |
| `auction_listings` | Keep `ends_at` | existing `timestamptz NOT NULL` | Effective close |
| `auction_listings` | Drop `extension_window_seconds` | existing integer column removed | Obsolete trigger |
| `auction_listings` | Keep `extension_seconds` | existing integer `NOT NULL DEFAULT 1800` | Duration |
| `auction_listings` | Keep `extension_cap_seconds` | existing nullable integer | Optional hard stop |

Update the non-negative extension check to cover duration and cap only. Keep
the existing constraint that prevents `ends_at` from exceeding
`scheduled_ends_at + extension_cap_seconds` when a cap is configured. No new
index is needed: due-close selection already uses the effective close, and
queue derivation reads the existing listing row.

```text
auction_listings
  ├── scheduled_ends_at  (immutable planned close)
  ├── ends_at            (persisted effective close)
  ├── extension_seconds  (duration setting)
  └── extension_cap_seconds (optional bound)
          │
          └── accepted auction_bids ──> timer entry/restart evidence
```

The migration drops only the obsolete window column and its references. It
does not rewrite `ends_at`: rows already extended retain their recorded close,
while rows still at their scheduled close are evaluated by the new service.

## Service Interfaces

All mutating processors keep the existing transaction-owned service boundary.
Entrypoints authenticate and normalize input; services lock and apply the
auction rule; repositories perform table reads and writes; the database is
the atomic boundary for listing, bid, hold, winner, and notification changes.

| Processor | Fixed input | Success / refusal | Atomic work |
| --- | --- | --- | --- |
| `placeBidAndConfirm` | listing id, bidder id, amount or maximum, idempotency key, request time | accepted bid outcome with effective close, or the existing typed refusal | lock listing; read accepted bids and maxima; insert/confirm bid; resolve automatic bids; refresh the close when the accepted event is in extended bidding; write holds and standing state |
| `resolveStandingMaxima` | locked listing, incoming accepted bid, current maxima, request time | resolved standing bid result with accepted bid ids and effective close | resolve all automatic responses under the same listing lock; call the timer calculation for each accepted event; save listing once with the final monotonic close |
| `closeDueListings` / `closeOne` | batch limit and current time, then one locked listing | closed, extended, or skipped | re-read the listing; at scheduled close inspect accepted bids and duration; record the initial extension or execute existing winner, hold, and notification close-out writes |
| `createListing` / `updateDraftListing` | listing timing fields including duration and optional cap | persisted listing or typed validation refusal | validate duration/cap pairing and scheduled close; write only the remaining timing columns |
| `getPublicListingState` | listing id and read context | public state with `scheduledEndsAt`, `endsAt`, and optional duration/cap policy | project repository data into the breaking public contract; no derived status is stored |
| `listPostSaleQueue` | queue filters, pagination, current time | queue items with `extendedBidding: boolean` | derive the boolean from the published row's two clocks while preserving the existing outcome/filter query |

For a listing scheduled to close at `20:00`, duration `1800`, and no cap:

| Event | Stored result |
| --- | --- |
| accepted bid at `19:59`; no later bid | `ends_at = 20:30` when the close boundary is processed |
| accepted bid at `20:12` | `ends_at = 20:42` |
| no accepted bid at `20:00` | listing closes at `20:00` |
| cap at `20:20`; accepted bid at `20:12` | `ends_at = 20:20` |

The browser's listing id and authenticated bidder identity remain unchanged
from the current path: the entrypoint passes them to the bidding service,
which enriches the locked listing with its timing and accepted-bid rows before
returning the contract result. Public reads carry the two clock values through
the repository mapper without an authenticated identity.

## API Contracts

The breaking contract removes the extension window and adds the scheduled
close where a public listing is read:

```ts
{
  scheduledEndsAt: string,
  endsAt: string,
  extension?: {
    extensionSeconds: number,
    extensionCapDate: string | null
  }
}
```

Apply the same shape to REST and procedure public listing summaries and state
responses. Admin listing create, draft, update, and mapper payloads remove
`extensionWindowSeconds`; the duration and cap remain. Admin post-sale queue
items add `extendedBidding: boolean` without changing the outcome enum or
filter inputs.

## Risks / Trade-offs

- **Scheduler latency can leave a due listing open briefly.** → The bid path
  performs the same boundary transition under the listing lock, and the
  sweep remains the durable recovery path.
- **A close and a bid can race at the scheduled timestamp.** → Both lock and
  re-read the listing; the transaction that wins the row lock determines
  whether the accepted bid is included before close-out.
- **Dropping the window loses the old per-listing value for rollback.** → Ship
  code that no longer reads it first, retain the migration in version control,
  and verify a database backup before applying the destructive DDL.
- **Site and admin clients can be out of step with the breaking contract.** →
  Update contract schemas, mappers, fixture clients, and both consumers in the
  same release, with package contract tests and build checks before rollout.
- **Edge-cached public reads can show the prior clock briefly.** → Preserve
  the existing cache invalidation path on listing writes and assert the new
  fields in public contract tests; do not introduce a second cache state.

## Migration Plan

1. Land this plan on `grade10-spec` main, then sync the application repository
   to that store before implementation.
2. Add the schema change and generated migration. Deploy the backend code that
   no longer reads or writes `extension_window_seconds` while the old column
   still exists.
3. Apply the migration with the repository's production migration command;
   verify the migration journal, constraints, and representative published
   listings. Confirm that already-later effective closes were unchanged.
4. Deploy the matching public site and admin clients with the breaking
   contracts, listing form, and queue label. Run the auction domain flow and
   the full validation gates.

Rollback is a forward decision after the column drop: the new code can be
rolled back only to another duration-only build. Restoring the former
window-based behavior requires a separately reviewed forward migration that
recreates and backfills the column from an external backup; the old window
values are not retained in the live schema.
