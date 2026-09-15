# Tech design: align bid panel extended copy

## Summary

Copy-only alignment in this store. Shared `auctionListing` ICU strings drop
`windowMinutes` and describe post-close timer restart by `durationMinutes`.
English helpers and Storybook fixtures pass the new strings into existing
`autoExtendedTooltip` / `timeLeftAutoExtended` slots. No package export or
runtime API change.

## In this store

| Area | Change |
| --- | --- |
| `packages/i18n/messages/shared/*/auctionListing.json` | `autoExtendedTooltip`, `extendedBiddingRules` |
| `packages/ui/.../listing-extension-policy.ts` | `formatAutoExtendedTooltip` / `formatExtendedBiddingRules` |
| `packages/ui/.../listing-auction-bid-card.stories.tsx` | **ExtendedBidding** story; label **Time left (extended)** |
| `apps/preview` auction-listing fixtures and countdown flow | Same label and docs |

## Outside this store

None. Application consumers already pass resolved copy into the bid card.

## Waiver

No application task group. Design waived for Figma: no frame change.
