---
title: My Auction Orders
spec: grade10-site/auction/auction-orders
order: 31
---

🚧 My Auction Orders lists every auction order the collector has won, one row
per order. It opens from the account menu beside My Auctions.

## The List

🚧 Each row carries the lot's key image and title, the auction, the winning
bid, the [order status](/p/grade10-site/auction/order-status), **View lot**,
and one action for what the order needs next:

| Order status | Action |
| --- | --- |
| Awaiting Address | Confirm address |
| Pending Payment | Pay Invoice |
| Preparing Invoice, Processing, Shipped, Delivered, Cancelled, Refunded | View detail |

🚧 Orders waiting on the winner — Awaiting Address and Pending Payment — come
first; the rest follow, newest close first. An expired invoice still reads
Pending Payment and still offers Pay Invoice.

🚧 Every action opens the order on [Winner Order](/p/grade10-site/auction/winner-order).
An empty list points to My Auctions; a failed read says so and can be retried.

:::detail{title="Product decisions" for="pm"}
My Auctions answers "where do I stand?" while bidding. After a win the question
becomes "what do I need to do?", and a table of lots mixed with watches is the
wrong place to answer it. A separate list of orders puts the next step on every
row.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Winner | Won one or more lots | Sees which orders need an address or a payment, and acts in one click. |
| Winner | Has paid | Finds the order again later for its receipt and shipment. |

**Not in scope.** Combined orders across lots, filters or search, and paying
from the list itself.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| A separate page | Decided | Won lots are followed on My Auction Orders. The account menu and each Won row open the order. | Product |
| Order | Decided | Needs action first, then newest close. | Product |
| Tracking link | Decided | Already specified: a fulfilled order shows the carrier, the tracking number and a link to the carrier. | Product |
:::
