# Support Cart Header Checkout Integration

**Author:** @kinisworking - 2026-10-07

## Why

The cart drawer already reviews the basket and tender, but Pay still needs to send them through the store's existing checkout request and show its answer. This change connects the drawer to the current backend without changing the backend.

## What Changes

- **Current decision** - Review on open, wait for cart and tender writes, and let the existing checkout request make the Pay decision.
- **Current request** - Send the reviewed lines with their seen prices, the accepted coupon, and positive points or no points field when none are spent.
- **One Pay at a time** - Accept one Pay per drawer. An answer for an older cart, tender or member opens nothing.
- **Answers** - Use the existing feedback for refusal, named lines, verification, settling and failure. A lost answer is not retried by itself.
- **Payment return** - Poll the order, read the cart and tender again once it is paid, and keep the static Your Orders link on both Shopify confirmation pages.

## Non-Goals

- **Operations** - No deployment, migration execution, production data operation, provider configuration change or real payment in this planning run.
- **Surfaces** - No public guest checkout, standalone checkout page, embedded payment form, new order badge or order-specific Shopify return link.
- **Local workarounds** - No new dependency, duplicate quote/order client, browser-owned invoice authority, local settlement, points hold or variant-based cart deletion.
- **Backend** - No backend, contract, schema or migration change. Invoice reuse, terminal replay, concurrent Pay, dispatch recovery and durable retirement are [`add-checkout-purchase-safety`](../add-checkout-purchase-safety/proposal.md).

## Product Record

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)

## Capabilities

### Modified

- `grade10-site/store/checkout` - add the drawer's Pay integration, one Pay at a time and the paid cart refresh. The published requirement "A checkout intent is safe to repeat" is not modified.

### Preserved Dependencies

- **Cart validation** - Keep separate cart-open and payment decisions and refusal behavior.
- **Order surfaces** - Consume existing customer order-page contracts and status labels; own no edit to the order-status mapping or shared closed status set.
- **Carrier rates** - Preserve the durable checkout carrier requirement and verify its existing backend implementation.

## Impact

- **Applications** - Grade10's drawer and orders; shared store-frontend clients and fixtures; ZZZ and operator adapters remain compatibility consumers.
- **Backend** - None. The merged cart-header backend is used as it is; its guarantees are verified by `add-checkout-purchase-safety`.
- **Shared UI** - Reuse existing drawer, order blocks and translations; no new export or badge.
- **History** - Preserve acceptance snapshots, first implementation baseline, completed tasks and case IDs. New work receives new task addresses; acceptance names the prior fingerprint with `--supersedes`.

No domain impact: the existing Store domain suite traces catalog and till journeys rather than checkout; the new repeat/edit journeys remain within checkout.
No product impact: no product-level composed path changes outside checkout return.
No platform impact: authentication, localization and routing contracts remain unchanged.

## Decisions

On 2026-10-09, @kinisworking kept this change to the frontend and moved the backend guarantees to a separate change ([Q24](decisions.md)). It supersedes the 2026-10-07 instruction for this change. The durable requirements are not weakened.

## References

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)
- [Technical design](tech-design.md)
- [Delivery tasks](tasks.md)
