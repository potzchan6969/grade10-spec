# UI: Public bid history winner crown and equal-max tip

No new Figma component. Storybook is the layout source of truth. Reuse
Phosphor Crown and Info with existing Badge for You only.

## Screens

| Surface | Storybook (SoT) | Figma |
| --- | --- | --- |
| Lot bid card — closed sold, equal max | `ListingAuctionBidCard` → ClosedSoldEqualMax | — |
| Lot bid card — live equal max tip | `ListingAuctionBidCard` → Default (HISTORY) | — |

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ListingBidHistoryList` | `@grade10/ui` | Primary crown + Info tip |
| `ListingAuctionBidCard` | `@grade10/ui` | Threads `bidHistory.winner` |
| `CrownSimple` | `@phosphor-icons/react` | `size` 12, `weight` fill, `text-primary` |
| `Tooltip` / `Info` | design-system / Phosphor | Icon inherits amount tone |

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Closed sold winning row shows crown | `shared-ui-auction-listing-SC-50` | ClosedSoldEqualMax |
| Equal-max non-leader earlier-leads tip | `shared-ui-auction-listing-SC-51` | ClosedSoldEqualMax / Default |
| Live lot has no crown without `isWinner` | `shared-ui-auction-listing-SC-50` | Default |
| No crown without its name | `shared-ui-auction-listing-SC-54` | ClosedSoldEqualMax with `winner` copy unset |
