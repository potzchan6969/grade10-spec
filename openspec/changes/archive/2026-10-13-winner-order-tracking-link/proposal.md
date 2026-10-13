**Author:** @tangconst - 2026-09-29

Product context: [Post-Bidding · Order Status](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-status).

## Why

Winner Order preview now opens carrier tracking from the tracking number in
Order Progress (Shipped and Delivered) when the operator recorded a tracker
link. The durable record still asks for
carrier name plus a separate link, and only speaks to dispatch — so preview
and the requirement disagree, and Delivered keeping the link is unstated.

**Metric:** on Shipped and Delivered preview stories, the tracking number is
an external link and no Track shipment button appears (target: 100%).

## What Changes

- **Tracking number is the link** — while fulfilment is `fulfilled`, Order
  Progress shows the tracking number as an external link to the carrier
  tracking page (arrow affordance). No separate Track shipment control.
- **No carrier name in that chrome** — Order Progress does not print the
  carrier beside the number.
- **Plain text without a tracker link** — the tracking number is the link only
  when the operator recorded a tracker link; with none it reads as plain text,
  with no carrier name and no Track shipment control
  (`winner-order-SC-276`).
- **Kept after Delivered** — the same link remains once `delivery_confirmed`
  is set (fulfilment stays `fulfilled`).

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order` — Shipping tracker contents and when
  it shows on Winner Order after dispatch and after delivery.

## Impact

- Winner Order preview: Order Progress tracking link on Shipped and Delivered, and plain text with no tracker link.
- Consuming `grade10-site` must match when it wires fulfilment tracking.
- PRD Post-Bidding Shipment line and Tracking link decision row carry 🚧
  this change delivers.
- Does not reopen `winner-payment-proof-feedback` (proof submit only).

## Open Questions

None.

**Archive:** @tangconst after deploy.

## References

- [Post-Bidding · Order Status](../../../docs/prds/products/grade10-site/auction/post-bidding.md#order-status)
