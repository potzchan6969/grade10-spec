**Author:** @constance - 2026-09-29

## Why

On a phone-width My Auctions page, the five-column table forces sideways
scroll to reach current bid, status, email alerts, and Unwatch or View
order. Collectors need every fact and action without panning, and a clear
way to open the lot or Winner Order. Success is a stacked card list below
tablet that keeps the same lots and actions, with the table unchanged from
tablet up.

## What Changes

- Below `md`, `AuctionRecord` shows each bookmarked lot as a stacked card
  with identity, inline current bid, Status when labelled, and a footer for
  email alerts and Unwatch or View order when supplied.
- The whole card opens the row `href` (listing or Winner Order); Unwatch and
  Email alerts stay separately tappable.
- From `md`, keep the existing five-column table.
- Record the rule on `shared/ui/auction-record` and the My Auctions pages
  that compose it.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shared/ui/auction-record`: Small-viewport card list for My Auctions lots;
  whole-card hit target; table from `md`.

## Impact

- `packages/ui` `AuctionRecord` / `AuctionRecordRow`
- Storybook My Auctions / Auction Card, My Auctions / My Auctions, and
  Pages / My Auctions Page
- Figma `AcutionRecordCard` (`7005:1676`)
- `docs/prds/products/shared/ui/auction-record.md`
- `docs/prds/products/grade10-site/auction/bidding.md#my-auctions`

## References

- [Auction Record Blocks](../../../docs/prds/products/shared/ui/auction-record.md)
- [Bidding · My Auctions](../../../docs/prds/products/grade10-site/auction/bidding.md#my-auctions)
- [AcutionRecordCard](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7005-1676)
