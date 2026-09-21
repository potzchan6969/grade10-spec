**Author:** @jeffffej0909 - 2026-09-14

## Why

An operator judging interest in a lot needs the listing's watch count. The
Listings Stats dialog already loads that count on demand with the bidder
count. A Watchers column on the table would show the same number twice and
widen the row for a figure opened only when interest is judged.

**Metric:** none. This is operator tooling; no collector-facing number moves.

## What Changes

- **Watchers in the Listings Stats dialog.** Opening Stats on a listing that
  offers it shows how many collectors watch the lot, across both brands, as
  of that read. A lot nobody watches shows 0. The count names no watcher and
  is not a count of expected bidders.
- **No Watchers column on the Listings table.** The table does not carry the
  count; Stats is the only admin surface for it.
- **Settled on the pages in the same pull request, with nothing to build:**
  - **Admin history filter** — not built.
  - **Preset amounts** — already in `grade10-site/auction/bid-panel-enrollment`.
  - **Buyer's premium** — 20% of the hammer price. The requirement lands in
    `revise-auction-winner-invoicing`, which already modifies Invoice fields.

## Non-Goals

- A watch count a collector can see, or one on the listing's own admin page.
- Sorting or filtering by watchers, or a live-updating count.
- A new grant for the count.
- Changing when Stats is offered on a row.
- The watch limit and send-log retention. They stay ❓.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/listing` — places the watch count in the Listings
  Stats dialog and keeps it off the Listings table.

## Impact

- **Consumer apps:** grade10-admin (Stats dialog is the watch-count surface;
  any Listings-table Watchers column and list-row `watcherCount` enrichment
  come off).
- **Component exports:** none named or changed.
- **Sequencing:** the count is the one `add-auction-watchlist` defines, so
  this change archives after it.

## References

- [Auction Management · Listings](../../../docs/prds/products/grade10-admin/auction/management.md#listings)
