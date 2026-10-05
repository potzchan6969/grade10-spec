# Tasks: Winner Order tracking link

One group, in this store: the preview is the only surface, and `design_waived`
records that no application-repository group is owed.

## 1. Tracking link on Winner Order (grade10-spec)

- [ ] 1.1 Make `winner-order-SC-251` pass: on the Shipped story, Order Progress shows the tracking number as an external `Link` to the carrier page, with no Track shipment control and no carrier name.
- [ ] 1.2 Make `winner-order-SC-252` pass: on the Delivered story, the same tracking number link remains.
- [ ] 1.3 Assert the link, its `href`, and the absence of Track shipment and the carrier name in the `Shipped` and `Delivered` play functions of `winner-order.delivery.stories.tsx`.
- [ ] 1.4 Update the PRD once the change is deployed: take 🚧 off the Post-Bidding Shipment line and the Tracking link decision row.
- [ ] 1.5 Run `pnpm run lint`, `pnpm run typecheck`, `pnpm check:manual` and `pnpm run validate:changes winner-order-tracking-link` in grade10-spec.
