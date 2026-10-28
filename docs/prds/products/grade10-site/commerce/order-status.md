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

The badge reads Shopify's order, payment and fulfilment facts for the order,
and nothing else.

| Badge | Reads as |
| --- | --- |
| Processing | Open and not yet fulfilled, or a combination nothing else claims |
| Shipped | Fulfilled in part, fulfilled and not yet paid in full, or a parcel still with its carrier |
| Completed | Every item fulfilled, paid in full or partly refunded, and every parcel delivered or picked up |
| Canceled | The order was canceled, or its payment voided |
| Refunded | Refunded in full, and the order is not on hold or scheduled |

- **Order of rules** - a cancellation or a void always wins; a refund in
  full comes next, ahead of fulfilment
- **Never blank** - every combination Shopify can report reads as one of the
  five
- **Delivered** - a parcel arrives when its carrier says delivered or picked
  up; one no carrier held - a till sale, a hand delivery, a fulfilment marked
  done with no tracking - arrives as it is handed over. A canceled parcel or
  voided label counts for nothing
- **Staff confirm delivery** - a parcel its carrier never reports delivered,
  lost or returned to sender, keeps the order Shipped until staff mark the
  order delivered on its admin order page, once the customer has it or it is
  settled another way. The mark is set once, names who made it, and no read
  from Shopify clears it. Points still earn at fulfilment
- **Till sales** - a sale at the counter reads through the same rules as a
  web order; where an order was sold never decides its badge
- **Orders covered** - orders Shopify holds. Your Orders lists a web
  checkout once the shop records it
- **No archiving** - the shop does not archive orders, so whether Shopify
  archived an order never decides its badge
- **Partly refunded** - a partial refund leaves the badge where the order's
  progress puts it, Completed included: it usually settles an overpayment or
  one item, and the order goes on

## Updates from Shopify

Both pages read one stored copy of Shopify's facts, so after a reload Your
Orders shows the same badge as Order Details.

| Change in Shopify | Reaches both pages |
| --- | --- |
| Paid in full, refunded or canceled | Within 5 minutes |
| Any other change: fulfilled, returned, or a payment voided or expired | Within the hour, for an order not canceled, placed in the last 90 days |

## Secondary Note

The rule also names one note for each combination the product has
confirmed, such as an order on hold or a partial refund already shipped, and
no note for any other. No surface shows the note in this delivery.

## Pickup

Pickup has no badge of its own in this delivery: Grade10's Shopify data does
not yet tell a pickup order from a shipped one. The shared status pill keeps
its pickup rung for when it does.

:::detail{title="Test cases" for="qa"}
[Test cases · grade10-site/commerce/order-status](https://github.com/9gag/grade10-spec/tree/main/openspec/specs/grade10-site/commerce/order-status)
:::

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
Badges beyond the five, and thresholds a merchant sets.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Order-status contacts | Support contacts about order status per 100 orders, and their share of all Store contacts; partly refunded and held orders watched as their own segment. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Completed | Decided | Every item fulfilled, paid in full and delivered, which is what a collector reads as done. Not archived: the shop does not archive orders, so a rule waiting on it would never show Completed. Waits for delivery since 2026-10-24: Completed beside a parcel still travelling contradicted the delivery steps. A parcel no carrier tracks arrives as it is handed over, so till sales and untracked fulfilments still complete. | Product |
| A carrier that never reports delivery | Decided | Staff mark the order delivered in the store admin; no time limit completes it on its own. A carrier that never scans delivered is rare, and a person who knows the customer has the goods is a better judge than a clock. Decided 2026-10-26. | Product |
| Pickup | Decided | No pickup badge this delivery. The shared pill keeps its pickup rung, since pickup is a confirmed later phase and removing the rung means adding it back. | Product |
| Refund before fulfilment | Decided | A refund in full is reported ahead of shipping progress. A held or scheduled order stays Processing, since it is still being worked on. | Product |
| A partial refund keeps the progress | Decided | A partly refunded order reads Processing, Shipped or Completed as it would paid in full; only a refund in full reads Refunded. A partial refund usually settles an overpayment or one item, so Refunded told a collector whose goods were on their way that the order had stopped. Reverses the earlier rule that any refund reads Refunded. Decided 2026-10-27 with Design. | Product |
| Returns | Decided | Whether items came back can choose a note, never the badge. | Product |
| Till sales | Decided | Read through the same rules as web orders. Where an order was sold is not a fact the badge reads. | Product |
| No generic note | Decided | An order no confirmed note fits shows its badge alone. A badge from the rule is a correct answer; reassurance nobody confirmed is not. | Product |
| No notifications | Decided | This rule names no message. The notification centre owns its own rules. | Product |
| One stored copy | Decided | Both pages read one stored copy of Shopify's facts. Not a Shopify read on every Your Orders load, one read per order listed. | Product |
| Orders covered | Decided | Only orders Shopify holds. The rule reads Shopify's facts alone, so a checkout Shopify never recorded has nothing to read. | Product |
| Note on surfaces | Decided | No surface shows the note in this delivery. No design has a place for it, and the rule still names it for the surface that adds one. | Product |
| Partly refunded | Decided | Your Orders puts an order with past purchases once nothing is left to happen on it: its badge is Completed, Canceled or Refunded. A partly refunded order reads its progress, so it stays with the orders needing attention until it completes, and a held or scheduled order whatever its refund reads Processing, so a collector never finds an order still in progress among finished ones. | Product |
| Source rows | Decided | The [Store Order Status Brief](/references/store-order-status-brief) holds one row per note and each combination a decision settles by name, and the rule is checked against each; a fulfilled order not paid in full reads Shipped, since Completed needs the order paid in full, on common storefront practice. An order fulfilled and paid in full now reads Completed without being archived, and D7 is the product owner's: no surface shows a note this delivery, so the owner's check would change nothing on screen. A canceled order carries the awaiting-refund note only when it took money and none has gone back, and a held order carrying a partial refund carries one note naming both. | Product |
:::
