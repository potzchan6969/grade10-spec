# Integrate Shopify checkout in the frontend

**Author:** @kinisworking - 2026-09-28

## Why

The cart drawer must hand its current basket and accepted tender to the existing
Shopify checkout flow, then show the existing order outcome after hosted payment.
The earlier plan incorrectly required backend intent persistence and new
recovery flows. The product owner narrowed this change to frontend integration.

## What changes

- **Drawer** - Use the live basket and accepted tender already answered by the store; call checkout from the drawer.
- **Invoice** - Each new Pay submission uses the existing creation flow. Earlier invoices are ignored rather than canceled or reused by the frontend.
- **Outcomes** - Handle the existing redirect, verification, refusal, settling and failure responses without inventing a backend guarantee.
- **Return** - Use the existing order surfaces and the Shopify confirmation extension's static Grade10 Your Orders link.
- **Validation** - Verify frontend behavior against current contract fixtures and record the existing provider integration in staging when authorized.

## Non-goals

Backend, database, API, provider, webhook, carrier and settlement changes.
Intent persistence, request replay, duplicate-invoice prevention, draft search,
dispatch recovery, operator bind/cancel flows and cart-edit reconciliation.
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
- **Backend** - No changes. Existing validation, creation, settlement and cart release are dependencies, not tasks in this plan.
- **Compatibility** - Keep PR #653's canonical quote, coupon and order clients and deprecated backend aliases unchanged.
- **Planning** - Preserve acceptance snapshots and the first implementation claim. Retire superseded work explicitly without recycling claimed task addresses.

No domain impact: existing store domain journeys do not trace checkout outcomes.

## Decisions

The product owner's answers settle the amendment: no backend changes; a new Pay
uses the current creation flow and ignores older invoices; the invoice fixes the
purchase and subsequent cart edits are outside this integration. Existing cart
cleanup is unchanged.

## Planning Amendment

- **Source** - [Grade10 PR #653](https://github.com/9gag/grade10/pull/653) splits checkout creation from quote, coupon and order reads.
- **Restart** - The earlier QA1, Dev and QA2 readings are superseded because the feature anchors changed. Fresh independent readings use the frontend scope.
- **Cleanup** - The incorrect standalone reference is deleted. Backend intent/recovery specifications and delivery tasks are removed from this amendment.
- **History** - Historical acceptance and implementation records remain intact; this amendment supersedes the contract through the supported acceptance command.

## References

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)
