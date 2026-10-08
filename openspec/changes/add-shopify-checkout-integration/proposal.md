# Support Cart Header Checkout Integration

**Author:** @kinisworking - 2026-10-07

## Why

The cart-header backend gives the store one active cart, saved-invoice reuse, retirement of older invoices after edits and protection for a later cart when payment settles. The frontend integrates those behaviors while retaining every published checkout requirement, including safe repetition and recovery.

## What Changes

- **Current decision** - Review on open and make a fresh server payment decision at Pay, including a repeated Pay for an existing invoice.
- **Purchase identity** - Carry the same purchase across Pay, reload, response loss and terminal replay; use the server's saved invoice or lifecycle answer.
- **Changed cart** - Persist line and tender changes before Pay; ignore stale response effects and refresh orders as older invoices retire.
- **Payment return** - Poll the existing order and re-read the active cart and tender; preserve a later edited or rebuilt cart.
- **Readiness** - Include backend prerequisites for concurrency, provider-dispatch recovery and terminal replay where the branch falls short of the durable contract. Frontend fixtures cannot clear those gates.

## Non-Goals

- **Operations** - No deployment, migration execution, production data operation, provider configuration change or real payment in this planning run.
- **Surfaces** - No public guest checkout, standalone checkout page, embedded payment form, new order badge or order-specific Shopify return link.
- **Local workarounds** - No new dependency, duplicate quote/order client, browser-owned invoice authority, local settlement, points hold or variant-based cart deletion.

## Product Record

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)

## Capabilities

### Modified

- `grade10-site/store/checkout` - retain the complete durable contract and add cart-header integration, current decision on reuse, retirement visibility and conditional cart conversion.

### Preserved Dependencies

- **Cart validation** - Keep separate cart-open and payment decisions and refusal behavior.
- **Order surfaces** - Consume existing customer order-page contracts and status labels; own no edit to the order-status mapping or shared closed status set.
- **Carrier rates** - Preserve the durable checkout carrier requirement and verify its existing backend implementation.

## Impact

- **Applications** - Grade10's drawer and orders; shared store-frontend clients and fixtures; ZZZ and operator adapters remain compatibility consumers.
- **Backend** - Integrate `feature/g10-cart-header-v1` at its final revision and verify remaining durable guarantees before marking the complete integration delivered. Technical design identifies each prerequisite and its evidence.
- **Shared UI** - Reuse existing drawer, order blocks and translations; no new export or badge.
- **History** - Preserve acceptance snapshots, first implementation baseline, completed tasks and case IDs. New work receives new task addresses; acceptance names the prior fingerprint with `--supersedes`.

No domain impact: the existing Store domain suite traces catalog and till journeys rather than checkout; the new repeat/edit journeys remain within checkout.
No product impact: no product-level composed path changes outside checkout return.
No platform impact: authentication, localization and routing contracts remain unchanged.

## Decisions

The product owner's 2026-10-07 instruction is authoritative: "the frontend should be integrated all changes from the backend and the requirements from the specs". It supersedes the pending frontend-only amendment. Unsupported requirements remain required; backend limitations are not accepted product behavior.

## References

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)
- [Technical design](tech-design.md)
- [Delivery tasks](tasks.md)
