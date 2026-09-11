---
title: Auction Order Status
spec: grade10-site/auction/order-status
order: 12
---

Auction Order Status is the single buyer-facing outcome derived from an auction order's invoice, fulfilment, deadline, and delivery facts. It is separate from the store's order status, even when a label is shared.

- **Pending Payment** — the invoice is issued and unpaid, before its deadline
- **Expired** — the invoice is unpaid after its deadline and can still be paid
- **Processing** — payment is complete and dispatch has not finished
- **Shipped** — fulfilment has a carrier hand-off and tracking facts
- **Delivered** — delivery confirmation includes the carrier's proof
- **Cancelled** — an operator cancelled the order and returned the lot to available stock
- **Refunded** — the payment has a recorded refund outcome

The status is read from its source facts at request time. The buyer sees it in [Winner Order](/p/grade10-site/auction/winner-order) and [My Auctions](/p/grade10-site/auction/account-record); operators see the same derived outcome in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
One derived status keeps the buyer, operator, and account record aligned without creating a second mutable order-state ledger. The source facts remain available where the reader needs the reason: invoice history, fulfilment history, delivery proof, and suspension explanation.
:::
