## Context

Lot details already toggles watch through `useWatch` → `ListingLotHeader` →
`WatchButton`, and `placeBid` already writes a `bidder_watches` row in the same
transaction as the bid (`recordWatch`). My Auctions already toasts Unwatch with
Undo and per-lot email-alerts copy from `auctionRecord`. Shared UI already
exports `WatchButton` `locked` and optional watch / unwatch confirmation copy
(`shared-ui-auction-record-SC-14`, `SC-15`); `ListingLotHeader` already accepts
`watchLocked` and those toast props.

What is missing is the product wiring: lot-page toast copy, locking Watching
from standing, hiding the control when the lot is closed, and an
account-persisted once-per-lot stamp for the first-bid alerts toast — browser
storage is ruled out by the proposal.

Behaviour:
[`grade10-site/auction/listing-page`](specs/grade10-site/auction/listing-page/spec.md),
[`grade10-site/auction/account-record`](specs/grade10-site/auction/account-record/spec.md),
[`shared/ui/auction-record`](specs/shared/ui/auction-record/spec.md). Screens:
[`ui-design.md`](ui-design.md).

## Goals / Non-Goals

**Goals:**

- Lot-page Watch / Unwatch toasts aligned with My Auctions (alerts on + **View
  My Auctions**; unwatch + Undo).
- Bid standing locks Watching on an open lot; closed lots omit the control.
- First bid that bookmarks a lot announces alerts at most once per
  `(collector, listing)`, stamped on the account and returned on the bid
  outcome so every device stays quiet after.

**Non-Goals:**

- Mail kinds, mute semantics, or the account auction email-alerts master.
- Catalogue watch toasts beyond reusing the same rules later.
- Redesigning My Auctions (`redesign-my-auctions-table`); that change still
  owns refusing Unwatch on bid rows when it folds.

## Decisions

### Spec already governs outcomes; this design picks stamps and who toasts

The deltas name locked Watching, closed-lot absence, watch / unwatch
announcements, and once-per-lot bid alerts on the account. Implementation
chooses the stamp column, the place-bid response bit, and which surface fires
each toast.

### First-bid toast is application-owned; WatchButton stays quiet when locked

`WatchButton` suppresses its confirmation toast while `locked` (`active:
!locked`). A bid that locks Watching therefore cannot announce through the
control. On a successful `placeBid` whose outcome says the bid-alerts toast is
due, `ListingView` calls the design-system `toast()` with the same alerts-on
wording and no toast action required by the bid scenarios (View My Auctions
stays on the no-bid Watch path).

**Rejected — fire the bid toast from `WatchButton` when `watched` flips under
lock.** Locked mode is defined not to announce; bending it couples bid success
to a remount race.

**Rejected — localStorage / session flag for “toast shown”.** The proposal
forbids re-showing after a device switch when the account already recorded it.

### Stamp `bidder_watches.bid_alerts_announced_at` inside the bid transaction

Add a nullable timestamptz on `bidder_watches`. In `placeBid`, after
`recordWatch`:

1. Read the row for `(storefront, userId, listingId)`.
2. If `bid_alerts_announced_at` is null, set it to `now` and set
   `announceBidAlerts: true` on the success payload.
3. Otherwise return `announceBidAlerts: false`.

A second bid, a later page view, and another device all see the stamp. The
watch row already exists for every bookmarked lot (watch or bid), so the stamp
has one home and needs no second table.

**Rejected — a column on `bids`.** The once-per-lot fact outlives any one bid
row and is about the bookmark enrolment, not a particular maximum.

**Rejected — a column on `bidders` (json / array of listing ids).** It duplicates
the watch primary key and cannot join cleanly to fanout or erasure.

**Rejected — announce only when `recordWatch` inserts.** A collector who
watched first then bids still has a null stamp; SC-16 keys off “never shown
the bid-alerts toast”, not “watch row was new”.

### `placeBid` success carries `announceBidAlerts`

Extend the success `data` of `placeBidOutcomeSchema` with
`announceBidAlerts: boolean` (required on success so clients cannot miss it).
No new procedure. Watch / unwatch RPCs stay unchanged; their toasts are driven
by controlled `watched` plus supplied copy on `WatchButton`.

### Lock Watching from existing standing, not a new watch field

`useListingUi` already loads `useMyStanding`. On an open lot, any non-null
standing means a bid stands → `watchLocked` and `watched` forced on. Closed
lots already omit `onWatchToggle`; keep omitting the control entirely
(SC-18) rather than rendering a disabled Watching.

**Rejected — extend `readWatch` / `AuctionWatchState` with `locked`.** Standing
is already authoritative for “has bid”; a second bit would drift from
`useMyStanding`.

### Unwatch while a bid stands stays a UI refusal on the lot page

`unwatchListing` today clears `explicitWatchedAt` when a bid membership exists
and keeps the reminder row. Lot page never calls it while locked. Refusing
Unwatch on My Auctions bid rows remains `redesign-my-auctions-table`'s fold of
the shared requirement — do not double-fold SC-13 style rules here.

### Copy lives in `auctionListing` / reuse `auctionRecord` where identical

Lot-page watch / unwatch toast strings and **View My Auctions** join
`auctionListing` (the lot surface). Align wording with
`auctionRecord.emailAlertsEnabledToast`, `unwatchToastDescription`, and
`undo`. Bid-once toast reuses the alerts-on title; it does not need a second
My Auctions CTA.

## Database Schema

Owning table: `auction.bidder_watches`.

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `bid_alerts_announced_at` | `timestamptz(3)` | yes | null | Set once when placeBid first announces; never cleared on unwatch |

No new indexes. Erasure already deletes watch rows with the bidder.

```
bidders 1──* bidder_watches *──1 listings
                │
                └── bid_alerts_announced_at (derived announcement gate;
                    authoritative for “toast already shown”)
```

## Service Interfaces

### `placeBid` (existing transaction under listing lock)

- **Input** — unchanged.
- **Writes** — existing bid + hold path; `recordWatch`; conditional
  `bid_alerts_announced_at = now` when null.
- **Success output** — existing fields plus `announceBidAlerts: boolean`.
- **Idempotency** — second accepted bid on the same listing returns
  `announceBidAlerts: false` once the stamp is set.
- **Atomicity** — stamp and bid commit together; a refused bid never stamps.

Example: first accepted bid on `L` for collector `U` → watch row created or
kept, `bid_alerts_announced_at` set, `{ announceBidAlerts: true }`. Second
accepted bid → stamp unchanged, `{ announceBidAlerts: false }`.

### Lot page composition (`ListingView`)

- Pass toast copy + `onWatchedToastAction` (navigate My Auctions) /
  `onUnwatchedToastAction` (rewatch) into `ListingLotHeader`.
- `watchLocked` when standing is non-null and the lot is still open.
- On `placeBid` success with `announceBidAlerts`, toast alerts-on and
  invalidate watch + standing queries so Watching locks without a reload.

## API Contracts

- **Additive** — `placeBid` success `data.announceBidAlerts: boolean`.
- Unchanged — `watchListing`, `unwatchListing`, `readWatch`, account-record
  reads.

## Risks / Trade-offs

- **`redesign-my-auctions-table` folds Unwatch-with-bid later** → Mitigation:
  lot page never offers Unwatch while standing exists; archive order in the
  proposal still applies so account-record Unwatch wording does not flip twice.
- **Optimistic watch flip then bid locks Watching** → Mitigation: invalidate
  watch and standing after placeBid; locked Watching forces `watched` on in
  the header even if the watch query lags.
- **Clients built before `announceBidAlerts`** → Mitigation: field is required
  in the success schema; regenerate / typecheck catches callers in this
  monorepo before merge.

## Migration Plan

1. Ship the nullable column (expand).
2. Deploy worker + contracts that write and return `announceBidAlerts`.
3. Deploy frontend that toasts on the flag and wires locked / closed / copy.
4. Rollback: stop reading the flag and omit toasts; column can remain.

## Open Questions

None — stamp home, toast owner, and lock source are settled above.
