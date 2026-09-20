**Author:** @htonyl - 2026-09-11

## Why

A leading collector who wants a quick raise is shown amounts that sit one
dollar above their max, then off-grid from the listing increment. The first
chip is treated as the typed minimum, so a $2,000 max with a $40 increment
offers $2,001 / $2,041 / $2,121 instead of $2,040 / $2,080 / $2,160. The
success measure is that a leader's three chips are exact increment steps on
their max, while a typed raise can still start at max + $1.

## What Changes

- Three quick-bid chips: 1×, 2×, and 4× the listing increment.
- Leader chips add those steps to the committed maximum.
- A collector who does not lead adds them to the current bid.
- A leader's typed minimum stays max + 100 minor units (HKD $1) and is not
  chip 1.

## Non-Goals

- Changing increment schedules or two-maximum resolution.
- Requiring a committed maximum to be an exact increment multiple.
- Changing how a first maximum, an outbid raise, or a custom typed amount is
  accepted on the server.
- Copy, captions, or which chip is selected by default.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shared/ui/auction-listing`: `ListingAuctionBidCard` quick-bid amounts and
  the leader's typed raise floor.

## Impact

- `@grade10/ui` bid-card quick-bid amounts and raise floor.
- `docs/prds/products/grade10-site/auction/bidding.md#auction-logic` Bid Panel and the
  preset-amounts decision.

## References

- [Listing Page Blocks · Custom Maximum](../../../docs/prds/products/shared/ui/auction-listing.md#custom-maximum)
