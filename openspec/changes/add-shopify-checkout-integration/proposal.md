# Add Shopify checkout integration

**Author:** @kinisworking - 2026-09-28

## Why

The checkout page already describes the intended handoff to Shopify, but the
store still needs one coherent contract for the live basket read, hosted
payment, pending order, payment recovery and return to Grade10. Without that
contract, a changed line can become a stale payment, a lost provider response
can mint another invoice, and a paid order can remain detached from the
member's cart and order history.

Success is measured by the share of accepted Pay attempts that reach a named
terminal result, normally `paid`, within 60 seconds, with zero duplicate paid
orders for one checkout intent. The existing preventable-refusal baseline is
preserved so the integration can show whether stale basket refusals decrease.

## What changes

- **Current basket** - Re-read every line from the live shop at checkout open
  and at the payment decision; block stale, failed or contradictory reads.
- **Hosted handoff** - Send the reviewed basket to one Shopify Draft Order
  invoice while Grade10 remains the order of record.
- **One intent** - Make a repeated Pay action, same-session reload, terminal
  replay and lost provider response resolve to the same order and invoice.
- **Settlement** - Let verified webhooks accelerate payment, while order
  reads and reconciliation repair missed events and release the member cart
  only after payment.
- **Staging gate** - Prove the real shop, carrier callback, Grade10 Your Orders
  link and payment lifecycle in staging before production enablement.

## Non-goals

The decisions record holds the settled boundaries, including the choice not to
build an embedded card form, not to make the public storefront a guest flow,
and not to move shipping or tax calculation into Grade10.

## Product record

This change updates:

- [store checkout PRD](/docs/prds/products/grade10-site/store/checkout.md)

## Capabilities

### New

- `grade10-site/store/checkout` - the authenticated storefront's live review,
  Shopify handoff, safe repetition, settlement and carrier-rate contract.

### Modified

None.

## Impact

- **Frontend** - Extend the existing checkout and order surfaces with a stable
  checkout intent, live review gating, safe retry outcomes and the signed-in
  boundary.
- **Backend** - Add the intent/idempotency persistence and guarded provider
  lifecycle around the existing order, Shopify, webhook, reconciliation and
  carrier seams.
- **Persistence** - Add nullable checkout-intent identity, the canonical
  reviewed-request fingerprint, provider-dispatch state and recovery deadline
  to web orders, with an all-status index for one intent per member. Legacy
  and non-web orders remain readable.
- **External systems** - Use the existing Shopify adapter, webhook route,
  carrier rule and a Shopify Thank You and Order status extension; staging
  configuration and dashboard setup are release-gated.
- **Packages** - No new production dependency is proposed.

No domain impact: the checkout journeys do not intersect any existing trace
in `grade10-site/store/domain-tcs.md`; checkout owns its payment lifecycle and
carrier cases.

## Open questions

None that change the product contract. Exact Shopify dashboard menu names and
credentials are operational details to verify during the staging walk.

## References

- [Checkout integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness)
