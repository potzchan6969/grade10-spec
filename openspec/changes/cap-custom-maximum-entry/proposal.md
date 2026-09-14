**Author:** @constance - 2026-09-14

## Why

A collector can type or paste a custom private maximum with no upper bound on
the bid panel. Values that still parse as safe integers can be committed even
when they are far beyond any realistic lot price, which wastes hold attempts
and confuses the draft. The success measure is fewer custom-maximum drafts
abandoned or corrected because an accidental oversize entry painted or
committed.

## What Changes

- Cap the bid panel custom maximum draft at **9,999,999,999** whole major
  units, any listing currency (set and raise share the same field).
- An edit that would exceed the ceiling restores the previous valid draft —
  including empty. Do not clamp to the ceiling; do not add “too large” copy
  in this change.
- Record the rule on `shared/ui/auction-listing` for `ListingAuctionBidCard`.

## Non-Goals

- Folding this into `restrict-custom-maximum-to-whole-units` (that change
  stays whole-major only; this change owns the ceiling).
- Currency-specific ceilings, locale thousand-separator input, or changing
  floor / increment rules.
- Quick-bid preset chips, public or personal bid history, admin, or legacy
  auto/manual bid controls.
- Server / auction-service refuse of oversize maxima (follow-on if wanted).
- A helper message or error status solely for an over-ceiling refuse.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shared/ui/auction-listing`: Custom maximum entry on the bid panel refuses
  drafts above 9,999,999,999 whole major units by restoring the previous
  valid draft.

## Impact

- `openspec/specs/shared/ui/auction-listing/spec.md`
- `@grade10/ui` auction-listing bid money helpers and
  `ListingQuickMaximumBidActions` (composed by `ListingAuctionBidCard`)
- `docs/prds/products/grade10-site/auction/auto-bidding.md` Bid Panel and a
  ceiling decision row
- Storybook `ListingAuctionBidCard` → `CustomMaximumCeiling`

## References

- [Auto-Bidding · Bid Panel](../../../docs/prds/products/grade10-site/auction/auto-bidding.md#bid-panel)

## Follow-on changes

- Auction-service refuses a committed maximum above the same major-unit
  ceiling.
- Optional “amount too large” helper copy if collectors do not understand a
  silent restore.
