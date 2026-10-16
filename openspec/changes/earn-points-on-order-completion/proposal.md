**Author:** @devin - 2026-10-13

## Why

Points earned at payment reward orders that may still be canceled or refunded
before the collector has anything. Earning at completion pays out for goods
the collector has — the Completed badge, every item fulfilled and paid in
full.

**Metric:** share of earns later clawed back (expected to fall); secondary:
support contacts about missing points (watch).

## What Changes

- **Trigger** — every store order earns when it reaches the Completed badge
  (every item fulfilled and paid in full —
  [Order Status](../../../docs/prds/products/grade10-site/commerce/order-status.md)),
  not when it is paid. The store has no carrier delivery confirmation, so
  completion is the trigger, not delivery
- **Basis** — the net the order has paid at completion, on qualifying goods;
  a refund before completion lowers it
- **Tier** — the member's tier at completion
- **Never completes** — an order canceled or refunded in full before it
  completes earns nothing
- **Till** — a till sale is fulfilled at the counter, so it completes when
  sold; no change for the counter
- **Spending unchanged** — points spent and coupons used are still debited
  when the paid order lands
- **Expiry clock** — the inactivity window counts the earn on its completion
  date
- **Guest orders** — a site guest order never earns, linked or not (owned
  by `add-store-guest-checkout`)

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/loyalty/programme` — the earn's trigger. The durable spec
  never states earn timing — no requirement fixes it at payment (the
  closest, `Grade10's programme`, states rate, basis and expiry only); the
  timing lived in the points page and the implementation. This change makes
  the trigger a requirement
- `grade10-site/commerce/order-status` — read-only dependency: the
  Completed badge definition is read, not changed
- `grade10-site/store/order-detail` — the points-section rule: Points to
  Earn before completion, Points Earned after, absent when the order won't
  earn. Owned by `add-grade10-customer-order-pages`, which this change
  depends on

## Impact

- **Loyalty backend** — earns on the order's completion event (from
  Shopify's fulfilment and payment facts) instead of the paid event
- **Store** — the order event that carries the earn is queued at completion
  rather than at `paid`; refunds before completion lower the basis, refunds
  after claw back as today
- **Cutover** — orders already paid but not yet completed when this ships
  earn when they complete; a per-order once-only earn guard keeps an order
  that earned at payment under the old rule from earning again
- **Consumer** — Order Details omits `loyaltyPoints` when the order won't
  earn (the block already renders no section then): a canceled or fully
  refunded order, a guest order linked after it completed, or a guest order
  with no owner. The section's own heading already reads Points to Earn
  before completion and Points Earned after
- **`@grade10/ui`** — no component change; the workbench copy already says
  "earns points once it's completed"

## References

- [Points · Rules](../../../docs/prds/products/grade10-site/loyalty/points.md#rules)
- [Points · Backend Flow](../../../docs/prds/products/grade10-site/loyalty/points.md#backend-flow)
- [Order Status · Badges](../../../docs/prds/products/grade10-site/commerce/order-status.md#badges)
- [Membership · Purchases Before the Account](../../../docs/prds/products/grade10-site/loyalty/membership.md#purchases-before-the-account)
