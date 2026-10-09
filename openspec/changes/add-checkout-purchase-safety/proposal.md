# Support Safe Repeated Checkout in the Store Backend

**Author:** @kinisworking - 2026-10-09

Follows [`add-shopify-checkout-integration`](../add-shopify-checkout-integration/proposal.md), which connects the cart drawer to the current backend and changes no backend code ([Q24](../add-shopify-checkout-integration/decisions.md)).

## Why

The published checkout requirement "A checkout intent is safe to repeat" says one purchase survives a repeated Pay, a reload, a lost answer and a worker stop, with one payable invoice. The current backend creates a new order on every Pay and cancels the member's older open checkout. It has no purchase identity, no dispatch state and no durable retirement record.

## What Changes

- **Invoice reuse** - A repeated Pay for an unchanged purchase returns its existing invoice or order state after a fresh live review.
- **Terminal replay** - A repeated Pay for a settled or closed purchase returns its outcome without a new order.
- **Concurrent Pay** - Requests from two tabs for one cart and tender reach one order and one payable invoice.
- **Dispatch recovery** - A lost provider answer or worker stop recovers the existing invoice; an unclear one waits for an operator.
- **Durable retirement** - A member's line or tender edit records retirement work that survives a crash. A shop review alone records none.

## Non-Goals

- **Frontend** - Drawer and order surfaces are `add-shopify-checkout-integration`; this change adds only what the backend contract needs.

## Product Record

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)

## Capabilities

### Modified

- `grade10-site/store/checkout` - deliver the published "A checkout intent is safe to repeat" requirement.
