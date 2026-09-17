---
title: My Auction Orders
spec: grade10-site/auction/auction-orders
order: 31
---

🚧 My Auction Orders lists every auction order the collector has won, one row
per order, resolved from the session and never another collector's. It opens
from the account menu beside My Auctions.

## The List

| Field | What it shows |
| --- | --- |
| Lot | The key image and the title; **View lot** opens the lot's page |
| Auction | The auction the lot sold in |
| Winning bid | The accepted bid that won |
| Status | The order's status — [Auction Order Status](/p/grade10-site/auction/order-status) |
| Next action | One action for what the order needs, opening the order on [Winner Order](/p/grade10-site/auction/winner-order) |

🚧 The action follows the status:

| Order status | Action |
| --- | --- |
| Awaiting Address | Confirm address |
| Pending Payment | Pay Invoice, an expired invoice included |
| Preparing Invoice, Payment Verifying, Processing, Shipped, Delivered, Cancelled, Refunded | View detail |

🚧 Orders waiting on the winner — Awaiting Address and Pending Payment — come
first; the rest follow, newest close first. Nothing on the list records
payment, changes an address or moves a status: the order does.

🚧 An empty list points to My Auctions; a failed read says so and can be
retried.

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
