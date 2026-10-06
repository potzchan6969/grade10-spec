# Integrate Shopify checkout in the frontend

**Author:** @kinisworking - 2026-09-28

## Why

The cart drawer must hand its current basket and accepted tender to the existing
Shopify checkout flow, then show the existing order outcome after hosted payment.
The earlier plan incorrectly required backend intent persistence and new
recovery flows. The product owner narrowed this change to frontend integration,
then added one backend piece on 2026-10-06: a member's cart has to clear the
moment its invoice is paid and never later, and pressing Pay again on the same
cart must not leave two payable invoices. A cart held as lines keyed by member
cannot tell the cart an invoice bought from one built afterwards.

## What changes

- **Drawer** - Use the live basket and accepted tender already answered by the store; call checkout from the drawer.
- **Invoice** - Each new Pay submission calls creation. On the unchanged cart it returns the cart's open invoice; after a cart edit it discards that invoice and creates another.
- **Cart** - A member holds one cart. Paying its invoice clears that cart, lines and tender; a cart changed after Pay, or built after an earlier payment, is kept.
- **Outcomes** - Handle the existing redirect, verification, refusal, settling and failure responses without inventing a backend guarantee.
- **Return** - Use the existing order surfaces and the Shopify confirmation extension's static Grade10 Your Orders link.
- **Validation** - Verify frontend behavior against current contract fixtures and record the existing provider integration in staging when authorized.

## Non-goals

API, provider, webhook and carrier changes. Intent persistence, request replay,
draft search, dispatch recovery and operator bind/cancel flows. Reconciling a
cart edit into an invoice already made.
Public guest checkout, a separate checkout page and new shared UI exports.

## Product record

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)

## Capabilities

### New

None.

### Modified

- `grade10-site/store/checkout` - narrow delivery to frontend consumption of the existing backend and remove the unsupported intent-replay contract.

## Impact

- **Frontend** - Drawer handoff, existing response handling, order return and Shopify confirmation link.
- **Backend** - One active cart per member with its version; an order records the cart and version it was made from; creation returns or replaces the cart's invoice; payment clears only the cart it bought. Staging carts are reset by the migration. Implemented in [Grade10 PR #880](https://github.com/9gag/grade10/pull/880).
- **Compatibility** - Keep PR #653's canonical quote, coupon and order clients and deprecated backend aliases unchanged.
- **Planning** - Preserve acceptance snapshots and the first implementation claim. Retire superseded work explicitly without recycling claimed task addresses.

No domain impact: existing store domain journeys do not trace checkout outcomes.

## Decisions

The product owner's answers settle the amendment: one cart per member; a new Pay
on the unchanged cart returns its open invoice and a Pay after an edit replaces
it; the invoice fixes the purchase; payment clears only the cart it bought.

## Planning Amendment

- **Source** - [Grade10 PR #653](https://github.com/9gag/grade10/pull/653) splits checkout creation from quote, coupon and order reads.
- **Restart** - The earlier QA1, Dev and QA2 readings are superseded because the feature anchors changed. Fresh independent readings use the frontend scope.
- **Cleanup** - The incorrect standalone reference is deleted. Backend intent/recovery specifications and delivery tasks are removed from this amendment.
- **History** - Historical acceptance and implementation records remain intact; this amendment supersedes the contract through the supported acceptance command.
- **Cart header (2026-10-06)** - The captain chose one cart per member over two lighter designs. Q6, Q8, Q15, Q16 and Q17 change and Q20 is added; SC-13, SC-33, SC-35 and SC-36 and their cases follow. A fresh QA2 and accept review run before the amendment is accepted.

## References

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)
