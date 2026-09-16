**Author:** @jeffffej0909 - 2026-09-14

## Why

An operator judging interest in a lot has no screen that shows its watch
count. `add-auction-watchlist` defines the count and leaves its placement
open, so the Watchlist page carried it as ❓. Without it an operator cannot
tell which lots draw attention before they close.

**Metric:** none. This is operator tooling; no collector-facing number moves.

## What Changes

- **Watchers column on the admin Listings table.** Every row shows how many
  collectors watch the lot, across both brands, as of page load. Drafts,
  closed and called-off lots included. A lot nobody watches shows 0.
- **Settled on the pages in the same pull request, with nothing to build:**
  - **Admin history filter** — not built.
  - **Preset amounts** — already in `grade10-site/auction/bid-panel-enrollment`.
  - **Buyer's premium** — 20% of the hammer price. The requirement lands in
    `revise-auction-winner-invoicing`, which already modifies Invoice fields.

## Non-Goals

- A watch count a collector can see, or one on the listing's own admin page.
- Sorting or filtering by watchers, or a live-updating count.
- A new grant for the column.
- The watch limit and send-log retention. They stay ❓.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-admin/auction/listing` — adds the Watchers column to the Listings table.

## Impact

- **Consumer apps:** grade10-admin (Listings table gains a column).
- **Component exports:** none named or changed.
- **Sequencing:** the column reads the count `add-auction-watchlist` defines,
  so this change archives after it.

## References

- [Listing Management · Operator actions](../../../docs/prds/products/grade10-admin/auction/listing.md#operator-actions)
