---
title: Auction Order Status
spec: grade10-site/auction/order-status
order: 12
---

Auction Order Status is the single buyer-facing outcome derived from an auction order's invoice, address, fulfilment, and delivery facts. It is separate from the store's order status, even when a label is shared.

- **Awaiting Address** — the lot has closed, but the winner has not confirmed a delivery address
- **Preparing Invoice** — the winner has confirmed a delivery address and an operator has not yet sent an invoice
- **Pending Payment** — the current invoice is unpaid; an expired invoice remains payable and keeps this order status
- **Processing** — payment is complete and dispatch has not finished
- **Shipped** — fulfilment has a carrier hand-off and tracking facts
- **Delivered** — delivery confirmation includes the carrier's proof
- **Cancelled** — an operator cancelled the order and returned the lot to available stock
- **Refunded** — the payment has a recorded refund outcome

The status is read from its source facts at request time. The buyer sees it in [Winner Order](/p/grade10-site/auction/winner-order) and [My Auctions](/p/grade10-site/auction/account-record); operators see the same derived outcome in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale). An order may carry an Overdue mark while it waits in either pre-invoice state; that mark does not change its status.

:::detail{title="Product decisions" for="pm"}
One derived status keeps the buyer, operator, and account record aligned without creating a second mutable order-state ledger. The source facts remain available where the reader needs the reason: invoice history, fulfilment history, delivery proof, and suspension explanation.
:::
