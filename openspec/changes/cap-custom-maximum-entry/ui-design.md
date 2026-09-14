# UI: Custom maximum entry ceiling

No Figma frame draws this refuse. Storybook is the layout and interaction
source of truth for the custom maximum field on the lot bid card. Behavior
belongs to the auction-listing delta; this file only maps surfaces and states.

## Screens

| Surface | Storybook (SoT) | Figma |
| --- | --- | --- |
| Lot bid card — custom maximum (set) | [`ListingAuctionBidCard` → CustomMaximumCeiling](?path=/story/auction-listing-listingauctionbidcard--custom-maximum-ceiling) | — (no auction bid-panel frame; see auction index) |
| Lot bid card — raise private maximum | [`ListingAuctionBidCard` → Leading](?path=/story/auction-listing-listingauctionbidcard--leading) | — |

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `ListingAuctionBidCard` | `@grade10/ui` | Composes fields; Storybook coverage |
| `ListingQuickMaximumBidActions` | `@grade10/ui` (internal to the bid card path) | Custom maximum `NumberInput`; set and raise |
| `NumberInput` | `@grade10/design-system` | Existing primitive; no new variant |

### Work in this repo

- Ceiling restore lives on the custom-maximum draft path in `packages/ui`
- No new design-system primitive, variant, or token
- No new public export required beyond helpers already on `@grade10/ui` if
  delivery exposes `CUSTOM_MAXIMUM_MAJOR_CEILING` /
  `sanitizeCustomMaximumDraft`

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Draft at ceiling accepted | `shared-ui-auction-listing-SC-38` | [CustomMaximumCeiling](?path=/story/auction-listing-listingauctionbidcard--custom-maximum-ceiling) — enter `9999999999` |
| Typed digit beyond ceiling restores | `shared-ui-auction-listing-SC-39` | Same story — at ceiling, type one more digit |
| Paste beyond ceiling from empty stays empty | `shared-ui-auction-listing-SC-40` | Clear field, paste `10000000000` |
| Paste beyond ceiling restores prior draft | `shared-ui-auction-listing-SC-41` | Seeded `500`, paste oversize |
| Fractional paste exceeds after whole-major cleaning | `shared-ui-auction-listing-SC-42` | Seeded `500`, paste `10000000000.99` |
| Raise path restores on overshoot | `shared-ui-auction-listing-SC-43` | [Leading](?path=/story/auction-listing-listingauctionbidcard--leading) — same field |
| Over-ceiling refuse has no dedicated error | SC-40 / SC-41 | No new error status; floor / invalidAmount only for existing floor and parse failures |
