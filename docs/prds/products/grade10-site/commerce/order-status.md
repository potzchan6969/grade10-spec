---
title: Order Status
spec: grade10-site/commerce/order-status
order: 4
---

Order Status is the one badge every Store surface uses for where an order
stands. [Orders](/p/grade10-site/store/order-history) and
[Order Details](/p/grade10-site/store/order-detail) both derive it from
Shopify's own order, payment, and fulfilment facts, so the two never disagree
about the same order.

## Badges

| Badge | Reads as |
| --- | --- |
| Processing | Open and not yet fulfilled, or a combination nothing else claims |
| Shipped | Fulfilled, in whole or in part |
| Completed | Fulfilled, paid, and archived — not carrier-confirmed delivery |
| Canceled | The order was cancelled, or its payment voided |
| Refunded | Money has moved back to the collector, and the order is not on hold or scheduled |

A cancellation or a void always wins; a refund outranks fulfilment progress
next, so a partially refunded order never shows as Shipped or Completed.
Every combination Shopify can report resolves to one of the five — never a
blank badge.

## Secondary note

A badge may carry one secondary note under it — an order on hold, a scheduled
fulfilment, a partial refund already shipped — read from an identifier the
message catalogs translate, never from copy the mapping writes itself. A note
only appears for a combination the product has confirmed; every other
combination carries its badge alone rather than a guess.

## Not yet

Pickup has no badge of its own this phase — Grade10's Shopify data does not
yet distinguish a pickup order from a shipped one. The shared status pill
keeps its pickup rung ready for when it does.
