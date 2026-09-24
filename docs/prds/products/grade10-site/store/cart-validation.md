---
title: Cart Validation
spec: grade10-site/store/cart-validation
order: 4
---

Cart Validation is the promise behind every cart decision: a held line is only
an intention until the shop answers what it can sell now. The Cart Drawer uses
that answer before presenting current facts, and checkout takes its own answer
before creating an order.

The distinction matters because the two moments do different jobs. Opening the
drawer lets the collector repair a cart early. Checkout makes the final order
decision. Neither answer turns the shop's later acceptance into a guarantee.

🚧 **A check that cannot finish** — name every affected line as unchecked,
replace its last availability and price and the cart total with an unchecked
state, offer a retry, and keep checkout unavailable until the store has a
current answer. If the cart has not loaded its lines, show an unchecked cart
and Retry without naming lines it does not know.
When a product has left the channel, name it in the unavailable-items notice
as it is removed from the cart; keep an out-of-stock line visible for the
collector to remove.
🚧 **Checkout from the cart** — the drawer keeps the cart and names any changed
line, failed check or shop refusal. Only a confirmed cart leaves for Shopify.

:::detail{title="Product decisions" for="pm"}
A collector should learn about a moved cart line while they can still fix it,
not only after asking to pay. The store therefore treats a recorded line as an
intent and the shop's current answer as evidence.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector reopening a cart | Price or stock changed since add | Learns what moved before choosing checkout. |
| Collector checking out | The cart looked valid earlier | Gets a new decision based on the shop's current answer. |
| Collector facing a refusal | The read or shop cannot complete the handoff | Keeps the cart and learns which line or check blocked it. |

**Not in scope.** The Cart Drawer's layout. Browse refresh cadence. Backend
checkout creation and Shopify's hosted-checkout lifecycle. Overriding the
shop's inventory policy.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Preventable checkout refusals | Share of checkout requests refused for a line the open cart had presented as current. The first delivery sets the baseline. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Two read moments | Decided | Cart open is the early warning; checkout is the order decision. An earlier answer never carries the checkout. | Product |
| Shop answer | Decided | Availability is what the shop offers on its channel, not a quantity the storefront derives. | Engineering |
| No stale fallback | Decided | A failed read blocks a current claim and checkout rather than falling back to the line's recorded facts. | Product |
| Distinct outcomes | Decided | Reduced quantity, sold out, withdrawn and repriced are different facts because the collector resolves them differently. | Product |
| Advisory read | Decided | A passing read does not overrule a later shop refusal; the cart remains repairable and the refused line stays named. | Engineering |
:::
