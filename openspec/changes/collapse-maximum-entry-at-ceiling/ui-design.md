## Screens

### Lot Bid Card

[Leading](?path=/story/auction-bidding-blocks-listingauctionbidcard--leading) and [CustomMaximumCeiling](?path=/story/auction-bidding-blocks-listingauctionbidcard-custom-maximum--custom-maximum-ceiling) are the existing layout references. No Figma bid-panel frame exists; the archived predecessor uses these same Storybook surfaces. This change changes what the raise group renders, not the card's layout: the group's interior collapses to one row, and a clamped chip carries a limit caption.

## Components

| Component | Home | Work |
| --- | --- | --- |
| `ListingAuctionBidCard` | `packages/ui/src/blocks/auction-listing/listing-auction-bid-card.tsx` | Same public export |
| `ListingQuickMaximumBidActions` | `packages/ui/src/blocks/auction-listing/listing-quick-maximum-bid-actions.tsx` | Collapsed status row and clamped chips |
| `Text`, `Button`, `NumberInput`, `Tooltip` | `@grade10/design-system` | Existing primitives; no variant or token work |

Three new copy keys are flagged as work: `maximumAtCeiling` (the limit line under a collector's own maximum), `biddingAtCeiling` (the limit line on a lot nobody can raise on), and `ceilingChip` (the caption on a chip clamped to the ceiling). `packages/i18n` answers each in the four shared locales, and consumers supply them through the existing copy prop.

## States

### Lot Bid Card

| State | Scenario | Anchor |
| --- | --- | --- |
| Maximum at the ceiling | `shared-ui-auction-listing-SC-64` | [MaximumAtCeiling](?path=/story/auction-bidding-blocks-listingauctionbidcard-custom-maximum--maximum-at-ceiling) - `Max: {amount}` with the Info tooltip, then the limit line; no chips, no custom field, no bid action |
| Raise floor above the ceiling | `shared-ui-auction-listing-SC-63` | Same collapsed row - the floor rule, not the maximum's amount, decides |
| Lot at the ceiling, no maximum | `shared-ui-auction-listing-SC-65` | [LotAtCeilingWithoutMaximum](?path=/story/auction-bidding-blocks-listingauctionbidcard-custom-maximum--lot-at-ceiling-without-maximum) - the ceiling amount, then the limit line |
| Collapse under the card setup lock | `shared-ui-auction-listing-SC-66` | The status row outranks the disabled-entry lock; no Link a card button |
| A chip above the ceiling | `shared-ui-auction-listing-SC-61`, `shared-ui-auction-listing-SC-62` | [ChipsClampedAtCeiling](?path=/story/auction-bidding-blocks-listingauctionbidcard-custom-maximum--chips-clamped-at-ceiling) - the chip at the ceiling, captioned as the limit; duplicate amounts merge |
| Legal entry unchanged | `shared-ui-auction-listing-SC-35` | [Leading](?path=/story/auction-bidding-blocks-listingauctionbidcard--leading) - chips below the ceiling keep the stepping and captions already drawn |
