**Author:** @tangconst - 2026-09-30

Product context: [Bidding · Auction Panel](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-panel).

## Why

Public Recent bids on the lot bid panel do not mark who won after close, and
the equal-max tip understates the priority rule. Collectors who tied on
maximum can dispute the outcome when the earlier max leads and no further
bids land.

**Metric:** on closed-sold bid-card stories, the winning public row shows
a primary crown after the amount and a same-price non-leading row exposes
the equal-max tip (target: 100%).

## What Changes

- **Winner crown on closed Recent bids** — when the lot is closed and sold,
  the winning public row shows a small primary crown after the amount
  (consumer sets `isWinner`; accessible name from copy).
- **Equal-max tip** — on a same-price non-leading row, the Info icon matches
  the amount tone and the tooltip reads that when maximums match, the
  earlier one leads.
- Record the contract on `shared/ui/auction-listing` for
  `ListingBidHistoryRow` / `ListingBidHistoryList` / bid-card copy.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/auction-listing` — public bid history winner crown and equal-max
  tip copy.

## Impact

- `@grade10/ui` `ListingBidHistoryList`, `ListingBidHistoryRow`,
  `ListingAuctionBidCard` copy.
- `packages/i18n` `auctionListing` — `bidHistoryWinner`,
  `samePricePriorityTip`.
- Storybook `ListingAuctionBidCard` closed-sold equal-max story.
- Consuming `grade10-site` sets `isWinner` on the winning public row when
  the lot is closed and sold.
- PRD Bidding Auction Panel and Listing Page Blocks Bid History carry 🚧
  this change delivers.

## Open Questions

None.

**Archive:** @tangconst after ship.

## References

- [Bidding · Auction Panel](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-panel)
- [Listing Page Blocks · Bid History](../../../docs/prds/products/shared/ui/auction-listing.md#bid-history)
