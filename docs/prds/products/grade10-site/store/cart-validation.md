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

- **Fewer than asked** — a line the shop can fill only in part drops to what
  it can fill, and the collector is told the store changed it; a line never
  grows when more comes back
- **A new price** — a line takes the shop's current price and says it
  changed, a rise as plainly as a fall; that price is the line's from then on
- **Priced from its own read** — checkout prices every line from the read it
  takes, never from an earlier read or a price the browser sends
- **A sold-out line holds checkout** — Proceed to Checkout stays unavailable
  until the collector removes it
- 🚧 **A product that left the shop** — a line whose product left the
  store's channel, or whose variant no longer exists, leaves the cart when it
  opens or when checkout finds it, and one notice names every line removed. A
  variant the shop still lists but does not sell stays in the cart as Sold
  out for the collector to remove
- 🚧 **Every moved line at once** — when the checkout read finds lines that
  moved, the drawer stays open and one notice names each of them with what
  happened to it
- 🚧 **Filled short** — a cart the shop would fill short is refused, naming
  the line and how many the shop would fill; nothing is sold short
- 🚧 **A check that cannot finish** — every affected line reads unchecked,
  its last availability and price and the cart total are replaced with an
  unchecked state, Retry is offered, and checkout stays unavailable until the
  store has a current answer. A cart that has not loaded its lines shows an
  unchecked cart and Retry, naming no line it does not know

:::detail{title="Product decisions" for="pm"}
A collector should learn about a moved cart line while they can still fix it,
not only after asking to pay. The store therefore treats a recorded line as an
intent and the shop's current answer as evidence.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector reopening a cart | Price or stock changed since add | Learns what moved before choosing checkout. |
| Collector checking out | The cart looked valid earlier | Gets a new decision based on the shop's current answer. |
| Collector facing a refusal | The read or shop cannot complete the handoff | Keeps the cart and learns which line or check blocked it. |

**Not in scope.** The Cart Drawer's layout. Browse refresh cadence. Checkout
creation and hosted-checkout lifecycle. Overriding the shop's inventory
policy.

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
