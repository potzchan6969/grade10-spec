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
| 🚧 Completed | Fulfilled, paid and archived - not carrier-confirmed delivery |
| 🚧 Canceled | The order was canceled, or its payment voided |
| 🚧 Refunded | Money has moved back to the collector, and the order is not on hold or scheduled |

- 🚧 **Order of rules** - a cancellation or a void always wins; a refund comes
  next, ahead of fulfilment, so a partly refunded order never shows as Shipped
  or Completed
- 🚧 **Never blank** - every combination Shopify can report reads as one of the
  five
- 🚧 **Till sales** - a sale at the counter reads through the same rules as a
  web order; where an order was sold never decides its badge
- 🚧 **Orders covered** - orders Shopify holds. Your Orders lists a web
  checkout once the shop records it
- 🚧 **Refunded, still shipping** - a partly refunded order still owed items
  reads Refunded and stays with the orders needing attention in
  [Your Orders](/p/grade10-site/store/order-history), which groups by whether
  Shopify still holds the order open

## Updates from Shopify

🚧 Both pages read one stored copy of Shopify's facts, so after a reload Your
Orders shows the same badge as Order Details.

| Change in Shopify | Reaches both pages |
| --- | --- |
| 🚧 Paid in full, refunded or canceled | Within 5 minutes |
| 🚧 Any other change: fulfilled, archived, returned, or a payment voided or expired | Within the hour, for an order Shopify holds open placed in the last 90 days |

- 🚧 **Archived orders** - an order Shopify has archived is read again when
  Shopify reports a payment, refund, cancellation or shipment on it, so
  reopening one reaches the badge only then

## Secondary Note

🚧 The rule also names one note for each combination the product has
confirmed, such as an order on hold or a partial refund already shipped, and
no note for any other. No surface shows the note in this delivery.

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
| Orders covered | Decided | Only orders Shopify holds. The rule reads Shopify's facts alone, so a checkout Shopify never recorded has nothing to read. | Product |
| Note on surfaces | Decided | No surface shows the note in this delivery. No design has a place for it, and the rule still names it for the surface that adds one. | Product |
| Refunded, still shipping | Decided | Your Orders groups by whether Shopify still holds the order open, not by badge, so an order still owed items never looks finished. | Product |
| Archived orders | Decided | The hourly read covers orders Shopify holds open. Reopening is the only change that moves an archived order's badge, and reading every archived order each hour costs more reads than the hour allows. | Product |
| Source rows | Decided | The owner's brief with the confirmed rows behind each note is filed with the references, and the rule is checked against every row. A canceled order carries the awaiting-refund note only when it took money and none has gone back, and a held order carrying a partial refund carries one note naming both. | @jeffffej0909 |
:::
