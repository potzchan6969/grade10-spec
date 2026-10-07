# Tasks: Winner Order tracking link

## 0. Ordering (owner: @htonyl)

- [x] 0.1 Accept after `add-winner-order-tax-line`, which owns the `Records the winner keeps` edits; no spec edit here.

## 1. Preview tracking link (grade10-spec) (owner: @htonyl)

- [ ] 1.1 Add Shipped and Delivered story assertions for the tracking link, its carrier URL and new-tab behavior, and the absence of the Track shipment control and carrier name; cover `winner-order-SC-251` and `winner-order-SC-252`.
- [x] 1.2 Update the preview WinnerProgressCard to render the tracking number as the external link in Order Progress and retain it after delivery confirmation; cover `winner-order-SC-251` and `winner-order-SC-252`.
- [ ] 1.3 Run the focused preview story checks, `pnpm run lint`, `pnpm run typecheck`, `pnpm check:manual` and `pnpm run validate:changes winner-order-tracking-link`.
- [ ] 1.4 Walk the Shipped and Delivered preview stories end to end and confirm the correct current step and tracking link in each; cover `winner-order-SC-251` and `winner-order-SC-252`.
- [ ] 1.5 After deployment, remove 🚧 from the Post-Bidding Shipment line and the Tracking link decision row in the PRD.
