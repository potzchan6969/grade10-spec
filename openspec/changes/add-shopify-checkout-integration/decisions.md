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

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | When is the basket read? | The cart drawer continuously reviews current lines and quotes accepted tender; the server rechecks at Pay and refuses changed or failed facts before creating an order | A separate checkout page or treating the drawer quote as server authority |
| Q2 | Which Shopify flow is used? | Use one Shopify Draft Order and its hosted invoice page for each new checkout intent; Shopify owns address, shipping, tax, discount entry and payment | An embedded card form or public Storefront checkout |
| Q3 | Who may start public checkout? | Require a signed-in member; keep typed-email checkout only on the elevated development and staging operator test surface | Public guest checkout or treating a typed email as identity proof |
| Q4 | Where are shipping and tax calculated? | Shopify calculates them after the buyer supplies an address; Grade10 shows an estimate and does not present its subtotal as the final charge | Calculating shipping or tax in Grade10 |
| Q5 | When is the local order written? | Recheck money facts, write the order and lines in one transaction, call Shopify outside it, and record provider references before returning the hosted URL | Calling Shopify inside the transaction or returning before the provider reference is bound |
| Q6 | What makes a repeated Pay safe? | One web order row owns the opaque intent and canonical fingerprint across every status; unchanged requests replay the existing order or terminal outcome, while changed baskets start a new intent | An open-only uniqueness guard or a replacement invoice on retry |
| Q7 | How is payment settled? | Use the guarded transition for verified webhooks, reconciliation and order reads; ignore duplicates and cross-shop events | Trusting only the webhook path |
| Q8 | When is the cart released? | Keep the member cart at Shopify and release paid lines only after the local order reaches `paid` | Clearing the cart when the buyer merely returns from Shopify |
| Q9 | How are carrier rates exposed? | Reuse the configured token-gated, stateless carrier rule and return no rate for unsupported destinations | A stateful callback or a second shipping rule |
| Q10 | Where does confirmation return? | Use a Shopify Thank You and Order status extension with a static Grade10 Your Orders link; do not rely on a purchase-specific deep link or the native Continue shopping action | A per-draft return URL or the native Shopify return destination |
| Q11 | How long does an intent survive a reload? | Keep the same intent key and reviewed fingerprint in the active same-session checkout until the order is terminal; an edit invalidates it | Generating a new key on every reload |
| Q12 | What happens when Shopify refuses a line after draft creation? | Name the line, keep the local order recoverable but unpaid, and let the collector fix the basket and retry | Marking the order paid or silently dropping the line |
| Q13 | What happens when the provider response is lost? | Reuse the local intent and provider read or reference; a request marked dispatched stays recovery-only | Creating another Draft Order |
| Q14 | What happens when the worker stops before the provider call? | A request still marked ready may be claimed again; after dispatch, recovery runs until its deadline and unresolved state becomes `manual_review` until an operator binds or cancels the draft | Retrying creation after dispatch ambiguity |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/store/checkout` | How long does an intent survive a reload? | Q11 |
| `grade10-site/store/checkout` | What happens when Shopify refuses a line after draft creation? | Q12 |
| `grade10-site/store/checkout` | What happens when the provider response is lost? | Q13 |
| `grade10-site/store/checkout` | What happens when the worker stops before the provider call? | Q14 |
| `grade10-site/store/checkout` | Q15: After a basket or tender edit, may a known earlier unpaid invoice remain payable, or must cancellation be verified before the changed purchase starts? | ❓ [Checkout Integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness), Changed purchase; Q15 unanswered, @kinisworking |
| `grade10-site/store/checkout` | Q16: If a member adds quantity to a paid line while at Shopify, does settlement remove only the paid quantity or the entire current line? | ❓ [Checkout Integration readiness](../../../docs/prds/products/grade10-site/store/checkout.md#integration-readiness), Added quantity; Q16 unanswered, @kinisworking |
