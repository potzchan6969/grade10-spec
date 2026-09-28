# Decisions

## Goals

- Let an authenticated member pay for the basket that was just reviewed.
- Keep one Grade10 order and one Shopify hosted invoice per checkout intent.
- Recover from provider response loss and missed webhooks without creating a
  second payable invoice.
- Make the staging walk a release gate for the real shop, carrier callback and
  return path.

## Non-goals

- An embedded card form or a payment secret in the storefront.
- Public guest checkout.
- Moving shipping, tax or address collection into Grade10.
- A new commerce provider abstraction or production dependency.
- Production configuration, migration or deployment as part of planning.

## Settled product decisions

### Q1. When is the basket read?

**Decided:** Read every line from the live shop when checkout opens and again
at Pay. A failed, stale or contradictory read blocks payment and names the
line that needs attention.

### Q2. Which Shopify flow is used?

**Decided:** Use one Shopify Draft Order and its hosted invoice page for each
new checkout intent. Shopify owns address, shipping, tax, discount entry and
payment. Grade10 does not embed a payment form.

### Q3. Who may start public checkout?

**Decided:** The public storefront is signed-in-member only. The typed-email
path remains an operator test path in development and staging, behind its
existing elevated/sandbox boundary; a typed email is not public identity
proof.

### Q4. Where are shipping and tax calculated?

**Decided:** Shopify calculates them after the buyer supplies an address. The
store shows an estimate and does not present its subtotal as the final charge.

### Q5. When is the local order written?

**Decided:** The server rechecks money facts, writes the local order and lines
in one transaction, calls Shopify outside that transaction, and records the
provider references before returning the hosted URL.

### Q6. What makes a repeated Pay safe?

**Decided:** The browser carries an opaque checkout-intent key. The server
stores that key with a canonical fingerprint of the reviewed basket and
tender. One web order row owns the key for every status. Repeating an
unchanged open intent returns its existing order/invoice or settling state;
repeating a settled or closed intent returns a terminal replay outcome and
never creates another order. A changed basket or tender starts a new intent.

### Q7. How is payment settled?

**Decided:** A verified Shopify webhook accelerates the guarded transition.
Reconciliation and an order read can repair a missed event through the same
transition. Duplicate or cross-shop events are ignored.

### Q8. When is the cart released?

**Decided:** Keep the member cart while the buyer is at Shopify. Release the
paid lines only after the local order reaches `paid`; returning from the
provider alone does not clear it.

### Q9. How are carrier rates exposed?

**Decided:** Reuse the configured, token-gated, stateless carrier rule and the
same shipping configuration used by the store preview. Unsupported
destinations receive no rate.

### Q10. Where does confirmation return?

**Decided:** A Shopify Thank You and Order status checkout UI extension shows a
static link to Grade10 Your Orders. The matching purchase appears there after
the member returns. A purchase-specific deep link is not required because
Shopify has no per-draft return URL. The native Continue shopping button is not
relied on. The extension is a staging gate, not a new embedded checkout return
API.

## Raised by the blind feature reading

| Question | Decision | Capability |
| --- | --- | --- |
| Q11. How long does an intent survive a reload? | Keep the same intent key and reviewed fingerprint in the active same-session checkout until the order is terminal; an edit invalidates it. | `grade10-site/store/checkout` |
| Q12. What happens when Shopify refuses a line after draft creation? | Name the line, keep the local order recoverable but unpaid, and let the collector fix the basket and retry. | `grade10-site/store/checkout` |
| Q13. What happens when the provider response is lost? | Reuse the local intent and provider read/reference; do not create another Draft Order. A request marked dispatched stays recovery-only. | `grade10-site/store/checkout` |
| Q14. What happens when the worker stops before the provider call? | A request still marked ready may be claimed again. Once dispatch is marked, recovery lookup runs until its deadline; an unresolved result becomes `manual_review` and blocks a new purchase until an operator binds or cancels the provider draft. | `grade10-site/store/checkout` |
