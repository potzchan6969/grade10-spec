**Author:** @constance - 2026-09-07

## Why

A collector typing or pasting a custom private maximum can enter fractional
major units (for example HKD cents) even though bid increments and floors are
whole major units. That mismatch produces drafts that look precise but do not
match how Grade10 prices a lot, and it increases abandoned or corrected
commits on the bid panel. The success measure is fewer custom-maximum drafts
that need correcting before Place Bid.

## What Changes

- Restrict the bid panel's custom maximum field to whole major units only
  (set and raise).
- Refuse a typed decimal mark so it never appears in the draft; discard a
  pasted decimal mark and its fraction, leaving the integer major-unit draft
  — no round, no `invalidAmount` solely for having held decimals.
- Record the rule on `shared/ui/auction-listing` for `ListingAuctionBidCard`.

## Non-Goals

- Changing platform money conversion or display rules in
  `shared/money-amounts` (exponents remain; other surfaces may still show
  fractional major units when the amount has them).
- Changing increment schedules, starting prices, or two-maximum resolution.
- Locale decimal commas as an input mark.
- Requiring whole major units on every money field outside this custom
  maximum control.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shared/ui/auction-listing`: Custom maximum entry on the bid panel accepts
  whole major units only.

## Impact

- `openspec/specs/shared/ui/auction-listing/spec.md`
- `@grade10/ui` auction-listing bid money helpers and
  `ListingQuickMaximumBidActions` (composed by `ListingAuctionBidCard`)
- `docs/prds/products/grade10-site/auction/auto-bidding.md` decision row for
  custom maximum entry precision
- Storybook / preview bid panel stories for set and raise

## References

- [Listing Page Blocks · Custom Maximum](../../../docs/prds/products/shared/ui/auction-listing.md#custom-maximum)
