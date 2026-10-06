# Tasks: Clarify auction shipping progress copy

One group, in this store: preview and catalogs are the surfaces; `design_waived`
records that no application-repository group is owed beyond a submodule bump.

## 1. Shipping / Preparing Shipment copy (grade10-spec)

- [x] 1.1 Make `winner-order-SC-55` pass: Preparing Shipment marks Shipping current with Preparing to ship subtext, and does not invent a Preparing Shipment step label.
- [x] 1.2 Make `auction-status-SC-07` pass: paid + unfulfilled derives Preparing Shipment.
- [x] 1.3 Update i18n `auctionOrders.status.processing` (en, zh-Hans, zh-Hant, ko), Winner Order / My Auctions preview labels, auction-record fixtures, and story asserts.
- [x] 1.3a Shipped badge uses Badge `default` on Winner Order and My Auctions (same as Preparing Shipment).
- [ ] 1.4 After implementation is verified and before archive, update the PRD: take 🚧 off Under Shipping, Preparing Shipment status row, and the Progress stepper decision.
- [x] 1.5 Run `pnpm run lint`, `pnpm run typecheck`, `pnpm check:manual` and `pnpm run validate:changes clarify-auction-shipping-progress-copy` in grade10-spec.
