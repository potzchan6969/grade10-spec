## Screens

### Winner Order — Order Progress (Shipped / Delivered)

Storybook: `My Auctions/Winner Order/Delivery/Shipped` and **Delivered**.

Header **Order Progress**. When fulfilment is `fulfilled` with a tracking
number, the tracking number sits as a secondary Link with an external arrow
trailing icon, opening the carrier tracking URL in a new tab. No Track
shipment button. No carrier name in the header.

**Shipped** — current step Shipped; tracking link present.

**Delivered** — current step Completed; tracking link still present.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Link` | `@grade10/design-system` | Tracking number → carrier URL |
| `Step` / `Stepper` | `@grade10/design-system` | Progress rail |
| Preview `WinnerProgressCard` | `apps/preview` | Assembly — not a published export |

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Shipped with tracking | Tracking number link in Order Progress | `winner-order-SC-251` |
| Delivered with tracking | Same tracking number link | `winner-order-SC-252` |
| No tracking yet | Header title only | **Out of suite:** Preparing Shipment before dispatch |
