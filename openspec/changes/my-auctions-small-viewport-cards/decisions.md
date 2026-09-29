## Goals

- Below `md`, My Auctions shows each bookmarked lot as a stacked card with
  identity, current bid, status, email alerts, and Unwatch or View order
  when supplied, with no sideways scroll of the page content.
- The whole card opens the lot or Winner Order via the row `href`; Unwatch
  and Email alerts stay separately tappable.
- From `md`, the five-column table stays as today.
- Bid lots still appear before watch-only; the title badge still counts
  every lot; empty state is unchanged.

## Non-Goals

- Changing Status, bid, Unwatch, or email-alerts product rules.
- Restyling the desktop table beyond hiding it below `md`.
- New public `@grade10/ui` export names for a standalone card.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Horizontal scroll or cards on small viewports? | Stacked cards below `md`; table from `md` - decided with the design | Keep table-only with `overflow-x-auto` on every width |
| Q2 | Which breakpoint switches layout? | `md` (tablet and up keep the table) - decided with the design | Switch at `sm`, or keep cards through `lg` |
| Q3 | New export for the card? | No — compose inside `AuctionRecord` / `AuctionRecordRow` - decided by the round | Export `AuctionRecordCard` as a required surface name |
| Q4 | Card layout SoT? | Figma `AcutionRecordCard` (`7005:1676`) + Storybook Auction Card variants - decided with the design | Keep the first capture-only draft as SoT |
| Q5 | How does the collector open the lot or order on a card? | Whole card is the hit target via `href`; Unwatch and Email alerts stay separate - decided with the design | Title link only, as on the table row |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/auction-record | Does the row alone (outside `AuctionRecord`) need a card variant? | Q3 |
