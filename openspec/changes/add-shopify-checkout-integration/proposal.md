# Support Cart Header Checkout Integration

**Author:** @kinisworking - 2026-10-07

## Why

The cart drawer already reviews the basket and tender, but Pay still needs to send them through the store's existing checkout request and show its answer. This change connects the drawer to the current backend without changing the backend.

## What Changes

- **Current decision** - Review on open, wait for cart and tender writes, and let the existing checkout request make the Pay decision.
- **Current request** - Send the reviewed lines with their seen prices, the accepted coupon, and positive points or no points field when none are spent.
- **One Pay at a time** - Accept one Pay per drawer and disable its actions while the answer is pending, using `add-store-cart-drawer-ui`'s pending-operation scope. Changes from another tab or session still invalidate older answers.
- **Answers** - Use the existing feedback for refusal, named lines, verification, settling and failure. A lost answer is not retried by itself.
- **Payment return** - Poll the order, read the cart and tender again once it is paid, and keep the static Your Orders link on both Shopify confirmation pages.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

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
- [Cart Pending Operations](../../../docs/prds/products/grade10-site/store/cart.md#pending-operations)
- [Drawer Pending Scope](../add-store-cart-drawer-ui/proposal.md#pending-operations)
- [Technical design](tech-design.md)
- [Delivery tasks](tasks.md)
