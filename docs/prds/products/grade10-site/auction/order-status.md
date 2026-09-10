---
title: Auction Order Status
spec: grade10-site/auction/order-status
order: 12
---

Auction Order Status is the single buyer-facing outcome derived from an auction order's invoice, fulfilment, auction, and suspension facts. It is separate from the store's order status, even when a label is shared.

- **Pending Payment** — the current invoice is payable and its deadline has not passed
- **Expired** — the current invoice is still unpaid and its deadline has passed
- **Processing** — payment is complete and dispatch has not finished
- **Shipped** — fulfilment has a carrier hand-off and tracking facts
- **Delivered** — delivery confirmation includes the carrier's proof
- **Cancelled** — an operator cancelled the order and returned the lot to available stock
- **Refunded** — the payment has a recorded refund outcome
- 🚧 **Awaiting Address** — the lot has closed and the winner has not confirmed a delivery address
- 🚧 **Preparing Invoice** — the address is confirmed and Grade10 has not yet sent the invoice
- **Auction outcome** — Draft, Scheduled, Live, Ending soon, Unsold, or Called off when the lot has not produced a payable winner order
- **Needs action** — Expired and Processing receive additional operator attention in the post-sale queue

The status is read from its source facts at request time. The buyer sees it in [Winner Order](/p/grade10-site/auction/winner-order) and [My Auctions](/p/grade10-site/auction/account-record); operators see the same derived outcome in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
One derived status keeps the buyer, operator, and account record aligned without creating a second mutable order-state ledger. The source facts remain available where the reader needs the reason: invoice history, fulfilment history, delivery proof, and suspension explanation.
:::
