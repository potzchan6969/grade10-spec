## Screens

### Auction listing bid panel

- **Figma** — ❓ No auction listing frame is recorded in the registered design file
- **Capability** — [grade10-site/auction/bid-panel-enrollment](specs/grade10-site/auction/bid-panel-enrollment/spec.md)
- **Review surface** — [bid-panel enrollment stories](../../../packages/ui/src/blocks/auction-listing/listing-bid-enrollment.stories.tsx), [listing preview](../../../apps/preview/src/auction-listing/listing-bid-enrollment.stories.tsx)

## Components

- **Shared listing blocks** — `ListingAuctionCardSidebar`, `ListingAuctionBidCard`, `EnrollmentSetupSheet`, `PaymentMethodRow`, `PaymentMethodEmptyState`
- **Listing support** — `ListingUserBidHistory`
- **Design-system primitives** — `Alert`, `Button`, `Card`, `CheckboxListInput`, `Dialog`, `DialogBody`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `HStack`, `Text`, `VStack`
- **Provider field** — application-owned `PaymentMethodField`; no provider SDK or card data enters `@grade10/ui`
- **Missing exports** — none; all named compound components already exist in `packages/ui/src/blocks/auction-listing/`

## States

| Surface state | Spec scenarios |
| --- | --- |
| `signed-out`: sign-in action, no standing badges, recent bids remain | `grade10-site-auction-bid-panel-enrollment-SC-01`, `grade10-site-auction-bid-panel-enrollment-SC-02`, `shared-ui-auction-listing-SC-20` |
| `setup-first` and `setup-in-progress`: empty linked-card slot, first-link setup, incomplete setup blocks continue, dismissal preserves empty state | `grade10-site-auction-bid-panel-enrollment-SC-03`–`SC-06`, `shared-ui-auction-listing-SC-16`, `shared-ui-auction-listing-SC-19` |
| `setup-editable` and `authorization-editable`: linked card with change, reusable setup copy, prior card shown, attestation pre-checked | `grade10-site-auction-bid-panel-enrollment-SC-07`–`SC-09`, `shared-ui-auction-listing-SC-17`–`SC-18` |
| `authorization-in-progress` and `authorization-failed`: controls locked while pending; inline failure keeps setup interactive | `shared-ui-auction-listing-SC-29`, `shared-ui-auction-listing-SC-28` |
| `enrolled`: linked card remains visible without change; later maximum does not reopen setup; standing appears when supplied | `grade10-site-auction-bid-panel-enrollment-SC-10`, `grade10-site-auction-bid-panel-enrollment-SC-11`, `shared-ui-auction-listing-SC-20`, `shared-ui-auction-listing-SC-21` |
