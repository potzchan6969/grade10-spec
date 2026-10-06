---
title: Order Status
spec: grade10-site/commerce/order-status
order: 4
---

Order Status is the one badge every Store surface uses for where an order
stands. [Your Orders](/p/grade10-site/store/order-history) and
[Order Details](/p/grade10-site/store/order-detail) both take it from one
rule.

## Badges

🚧 The badge reads Shopify's order, payment and fulfilment facts for the order,
and nothing else.

| Badge | Reads as |
| --- | --- |
| 🚧 Processing | Open and not yet fulfilled, or a combination nothing else claims |
| 🚧 Shipped | Fulfilled in part, or fulfilled and not yet paid and archived |
| 🚧 Completed | Fulfilled, paid and archived — not carrier-confirmed delivery |
| 🚧 Canceled | The order was canceled, or its payment voided |
| 🚧 Refunded | Money has moved back to the collector, and the order is not on hold or scheduled |

- 🚧 **Order of rules** — a cancellation or a void always wins; a refund comes
  next, ahead of fulfilment, so a partly refunded order never shows as Shipped
  or Completed
- 🚧 **Never blank** — every combination Shopify can report reads as one of the
  five
- 🚧 **Till sales** — a sale at the counter reads through the same rules as a
  web order; where an order was sold never decides its badge
- ❓ **Orders covered** — whether the badge covers only orders Shopify holds,
  or also a web checkout Shopify never recorded (failed, expired or still
  paying); the product manager confirms
- ❓ **Refunded, still shipping** — whether a partly refunded order with items
  still to ship sits with past purchases in Your Orders, which sorts by badge,
  or with the orders needing attention; the product manager confirms

## Updates from Shopify

🚧 Both pages read one stored copy of Shopify's facts, so after a reload Your
Orders shows the same badge as Order Details.

| Change in Shopify | Reaches both pages |
| --- | --- |
| 🚧 Paid in full, refunded or canceled | Within 5 minutes |
| 🚧 Any other change: fulfilled, archived, returned, or a payment voided or expired | Within the hour, for an order placed in the last 90 days |

- ❓ **Archived orders** — whether a change to an order Shopify already
  archived, such as reopening it, reaches the badge within the hour or only
  when Shopify next reports a payment or a shipment on it; the product manager
  confirms

## Secondary Note

- ❓ **Under the badge** — one note may sit under the badge: an order on hold,
  a scheduled fulfilment, a partial refund already shipped. The product
  manager confirms whether a surface shows it in this delivery; the designer
  draws where it sits
- ❓ **Words** — the message catalogs hold each note's words in every language;
  the rule names only which note
- ❓ **Confirmed only** — a note appears only for a combination the product has
  confirmed; any other order shows its badge alone

## Pickup

🚧 Pickup has no badge of its own in this delivery: Grade10's Shopify data does
not yet tell a pickup order from a shipped one. The shared status pill keeps
its pickup rung for when it does.

:::detail{title="Product decisions" for="pm"}
A collector cannot tell where an order stands when it is partly refunded, held
or voided, and writes to support instead. One rule, read from Shopify's own
facts, gives every surface the same answer.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Has an order in progress | Reads one badge: being prepared, on its way, finished, canceled or refunded. |
| Collector | Has an order partly refunded or put on hold | Learns what happened to it without contacting support. |
| Collector | Checks one order in two places | Sees the same answer in both. |

**Not in scope.** A pickup badge, until Shopify data tells a pickup order
apart. Notifications: the notification centre is a later reader of this rule.
Badges beyond the five, and thresholds a merchant sets. Delivery confirmed by
a carrier.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Order-status contacts | Support contacts about order status per 100 orders, and their share of all Store contacts; partly refunded and held orders watched as their own segment. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Completed | Decided | Fulfilled, paid and archived. Not delivery: the Store holds no carrier confirmation. | Product |
| Pickup | Decided | No pickup badge this delivery. The shared pill keeps its pickup rung, since pickup is a confirmed later phase and removing the rung means adding it back. | Product |
| Refund before fulfilment | Decided | Money going back is reported ahead of shipping progress. A held or scheduled order stays Processing, since it is still being worked on. | Product |
| Returns | Decided | Whether items came back can choose a note, never the badge. The refund already moves the badge; the return only explains it. | Product |
| Till sales | Decided | Read through the same rules as web orders. Where an order was sold is not a fact the badge reads. | Product |
| No generic note | Decided | An order no confirmed note fits shows its badge alone. A badge from the rule is a correct answer; reassurance nobody confirmed is not. | Product |
| No notifications | Decided | This rule names no message. The notification centre owns its own rules. | Product |
| One stored copy | Decided | Both pages read one stored copy of Shopify's facts. Not a Shopify read on every Your Orders load, one read per order listed. | Product |
| Orders covered | ❓ Open | Only orders Shopify holds, or also web checkouts Shopify never recorded. | Product |
| Note on surfaces | ❓ Open | Whether Your Orders and Order Details show the note in this delivery, and where it sits. | Product, Design |
| Refunded, still shipping | ❓ Open | Past purchases by badge, or by whether Shopify still holds the order open. | Product |
| Archived orders | ❓ Open | Whether a change to an order Shopify already archived reaches the badge within the hour, or only when Shopify next reports a payment or a shipment on it. | Product |
| Source rows | ❓ Open | The owner's brief with the confirmed rows behind each note; whether a canceled order that took no money carries the awaiting-refund note; and which note a held order carrying a partial refund carries. | @jeffffej0909 |
:::
