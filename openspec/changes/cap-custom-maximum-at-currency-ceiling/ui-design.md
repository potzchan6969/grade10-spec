## Screens

### Lot Bid Card

[CustomMaximumCeiling](?path=/story/auction-listing-listingauctionbidcard--custom-maximum-ceiling) and [Leading](?path=/story/auction-listing-listingauctionbidcard--leading) are the existing layout references. No Figma bid-panel frame exists; the archived predecessor uses these same Storybook surfaces. This change changes their interaction, not their layout.

## Components

| Component | Home | Work |
| --- | --- | --- |
| `ListingAuctionBidCard` | `packages/ui/src/blocks/auction-listing/listing-auction-bid-card.tsx` | Same public export and currency-bearing view |
| `ListingQuickMaximumBidActions` | `packages/ui/src/blocks/auction-listing/listing-quick-maximum-bid-actions.tsx` | Internal field correction and DOM behavior |
| `NumberInput` | `@grade10/design-system` | Existing primitive; no variant or token work |

No new copy key is needed. The site stops rendering the existing maximum-bid message for this refusal; other refusal copy remains consumer-owned. The existing customAmountPlaceholder catalog key is aligned with the already agreed story's `{amount} min.` treatment, following [the owner's correction](https://github.com/9gag/grade10/issues/1008#issuecomment-6076174107). Number formatting stays with the existing field formatter; translations retain the same minimum meaning.

## States

### Lot Bid Card

| State | Shows | Anchor |
| --- | --- | --- |
| Draft at currency ceiling | Currency ceiling in the custom field | `shared-ui-auction-listing-SC-58` |
| Typed append above ceiling | Previous draft, without an extra digit | `shared-ui-auction-listing-SC-39` |
| Oversized paste into empty field | Currency ceiling, without an error message | `shared-ui-auction-listing-SC-40` |
| Oversized replacement of existing draft | Currency ceiling, without an error message | `shared-ui-auction-listing-SC-59` |
| Fractional oversized paste | Currency ceiling after whole-major cleaning | `shared-ui-auction-listing-SC-42` |
| Raise above ceiling | Same corrected field in the raise mode | `shared-ui-auction-listing-SC-43`, `shared-ui-auction-listing-SC-59` |
| Defensive service refusal above ceiling | No maximum-bid message; no automatic retry or field reset | `grade10-site-auction-auction-SC-103` |
