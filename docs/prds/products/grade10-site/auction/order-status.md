---
title: Auction Order Status
spec: grade10-site/auction/order-status
order: 33
---

An auction order has one status, derived from its invoice, address,
fulfilment and delivery facts, that the winner, the operator and the account
record all read. It is separate from the store's order status, even where a
label is shared.

## Statuses

| Status | Meaning |
| --- | --- |
| **Awaiting Address** | The lot has closed, and the winner has not confirmed a delivery address |
| **Preparing Invoice** | The winner has confirmed a delivery address, and an operator has not yet sent an invoice |
| **Pending Payment** | The current invoice is unpaid; an expired invoice keeps this status |
| 🚧 **Payment Verifying** | The winner uploaded payment proof and an operator has not yet checked it; the payment deadline is on hold |
| **Processing** | Payment is complete and dispatch has not finished |
| **Shipped** | Fulfilment has a carrier hand-off and tracking facts |
| **Delivered** | Delivery confirmation includes the carrier's proof |
| **Cancelled** | An operator cancelled the order and returned the lot to available stock |
| **Refunded** | The payment has a recorded refund outcome, only after a paid invoice is refunded; failing to pay is never Refunded |

- 🚧 **Missed address deadline** — the status stays Awaiting Address or
  Preparing Invoice; the winner can no longer confirm or change an address
  until an operator reopens the address form
- **Expired invoice** — the status stays Pending Payment; self-service card
  pay stops, Contact Us lives on Winner Order, and an operator may reissue,
  settle manually or cancel
- **Overdue** — an order may carry an Overdue mark while it waits in either
  pre-invoice state; the mark changes no status

## How It Is Derived

- **Two facts** — the invoice status, written by payment and by an operator,
  and the fulfilment status, written by dispatch alone
- **Read, never written** — the status is derived from those facts at request
  time by one ordered rule chain, so it cannot contradict them
- **Refused combinations** — a lot that must never dispatch before payment is
  stopped at write time, and every move outside the permitted transitions is
  refused
- **Not the store's** — an auction order and a store order share label names
  and share no meaning
- **Who reads it** — the winner on [Winner
  Order](/p/grade10-site/auction/winner-order) and [My
  Auctions](/p/grade10-site/auction/account-record); operators in the
  [Post-Sale Queue](/p/grade10-admin/auction/post-sale)

::cases{id="grade10-site/auction/order-status"}

:::detail{title="Product decisions" for="pm"}
One derived status keeps the buyer, operator, and account record aligned
without creating a second mutable order-state ledger. The source facts remain
available where the reader needs the reason: invoice history, fulfilment
history, delivery proof, and suspension explanation.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Expired keeps Pending Payment | Decided | Invoice `expired` does not create an Expired order status. | Product |
| A missed address deadline keeps its status | Decided | A missed address deadline creates no order status of its own. Awaiting Address and Preparing Invoice both keep reading as they do. | Product (@jeffffej0909) |
| Expired ends winner card pay | Decided | Self-service card pay stops at expiry; operator paths remain. | Product (@tangconst) |
| Cancelled vs Refunded | Decided | Unpaid fail-to-pay ends as Cancelled when an operator cancels; Refunded is paid→refund only. | Product |
:::
