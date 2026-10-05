**Author:** @constance - 2026-09-14

## Why

A collector can type or paste a custom private maximum with no upper bound on
the bid panel. The auction refuses an amount above the currency's bid ceiling
only once the maximum is sent, so an accidental oversize entry paints in the
field and goes out as a bid the auction then refuses. The JPY bid ceiling,
**150,000,000,000**, is also far beyond any realistic lot price. The success
measure is fewer custom-maximum drafts abandoned or corrected because an
accidental oversize entry painted or was sent.

## What Changes

- Cap the bid panel custom maximum draft at **9,999,999,999** whole major
  units, any listing currency (set and raise share the same field).
- An edit that would exceed the ceiling restores the previous valid draft —
  including empty. Do not clamp to the ceiling; do not add “too large” copy
  in this change.
- Record the rule on `shared/ui/auction-listing` for `ListingAuctionBidCard`.
- Lower the JPY bid ceiling to **10,000,000,000** on
  `grade10-site/auction/bid-increments`, so no maximum the auction accepts
  sits above what the field takes (Q6). USD and HKD stay.

## Non-Goals

- Folding this into `restrict-custom-maximum-to-whole-units` (that change
  stays whole-major only; this change owns the ceiling).
- Currency-specific field ceilings, locale thousand-separator input, or
  changing floor / increment rules.
- Quick-bid preset chips, public or personal bid history, admin, or legacy
  auto/manual bid controls.
- A second, field-sized refusal in auction-service; its currency ceiling
  already refuses (Q4).
- A helper message or error status solely for an over-ceiling refuse.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shared/ui/auction-listing`: Custom maximum entry on the bid panel refuses
  drafts above 9,999,999,999 whole major units by restoring the previous
  valid draft.
- `grade10-site/auction/bid-increments`: the JPY bid ceiling is
  JPY 10,000,000,000.

## Impact

- `openspec/specs/shared/ui/auction-listing/spec.md`
- `@grade10/ui` auction-listing bid money helpers and
  `ListingQuickMaximumBidActions` (composed by `ListingAuctionBidCard`)
- `docs/prds/products/grade10-site/auction/bidding.md#auction-logic` Bid Panel and a
  ceiling decision row
- Storybook `ListingAuctionBidCard` → `CustomMaximumCeiling`
- `grade10`: `AUCTION_BID_CEILINGS.JPY` in `@grade10/auction-contracts`,
  read by auction-service's bid refusal and the lot page's quick bids

## References

- [Listing Page Blocks · Custom Maximum](../../../docs/prds/products/shared/ui/auction-listing.md#custom-maximum)
- [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic) - the bid ceiling per currency

## Follow-on changes

- Optional “amount too large” helper copy if collectors do not understand a
  silent restore.
