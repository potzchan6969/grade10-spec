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
| 🚧 **Payment Verifying** | The winner uploaded payment proof and an operator has not yet checked it; the payment deadline is stopped |
| **Processing** | Payment is complete and dispatch has not happened |
| **Shipped** | The lot has been dispatched, with a carrier and a tracking number |
| **Delivered** | The carrier has confirmed delivery, with its proof |
| **Cancelled** | An operator cancelled the unpaid order and the lot went back to stock |
| **Refunded** | A paid invoice was refunded; failing to pay is never Refunded |

::image{src="assets/diagrams/auction-order-status.svg" alt="An auction order from Awaiting Address through Preparing Invoice, Pending Payment and Processing to Shipped and Delivered, with Payment Verifying beside Pending Payment, and Cancelled and Refunded as its endings"}

## Moves

| From | To | What moves it |
| --- | --- | --- |
| The lot closes | Awaiting Address | Grade10 opens the order |
| Awaiting Address | Preparing Invoice | The winner confirms a delivery address; or an operator records one after the deadline |
| Preparing Invoice | Pending Payment | An operator sends the invoice |
| Pending Payment | Processing | The winner's card payment is confirmed, or an operator settles the invoice manually |
| 🚧 Pending Payment | Payment Verifying | The winner uploads bank transfer proof; the deadline stops |
| 🚧 Payment Verifying | Processing, or Pending Payment | An operator confirms the proof, or returns it and the deadline runs again with the time that was left |
| Processing | Shipped | The warehouse dispatches, with a tracking number |
| Shipped | Delivered | The carrier confirms delivery |
| Any unpaid status | Cancelled | An operator cancels; the lot reopens |
| Any paid status | Refunded | The payment is refunded |

- **Expired invoice** — the status stays Pending Payment; self-service card
  pay stops, Contact Us lives on Winner Order, and an operator reissues,
  settles manually or cancels
- 🚧 **Missed address deadline** — the status stays Awaiting Address or
  Preparing Invoice; the winner can no longer confirm or change an address
  until an operator reopens the form
- 🚧 **A reissued invoice** — replaces the old one, which keeps no status of
  its own; a proof under check never expires
- **Refused** — dispatch before payment, cancelling a dispatched order (it is
  refunded instead), a delivery before dispatch, and any direct write of the
  status

## Invoice Status

The winner reads it as Invoice Status on Winner Order; the operator in the
queue.

| Invoice status | Meaning |
| --- | --- |
| **Not issued** | No invoice has been sent |
| **Pending** | Sent and unpaid, a reissued invoice included |
| 🚧 **Payment Verifying** | Proof uploaded and not yet checked; the deadline is stopped |
| **Expired** | The deadline passed unpaid; winner card pay ends |
| **Paid** | Received in full, by card or recorded by an operator |
| **Cancelled** | Cancelled unpaid; final |
| **Refunded** | Refunded after payment; final |

- **Fulfilment** — unfulfilled until the warehouse dispatches with a tracking
  number; delivery is the carrier's confirmation on a dispatched order, not a
  third state

## How It Is Derived

- **Read, never written** — the status is derived from the invoice status,
  the fulfilment status, and whether the address and the delivery are
  confirmed, by one ordered rule chain, so it cannot contradict them
- **Not the store's** — an auction order and a store order share label names
  and share no meaning
- **Who reads it** — the winner on [Winner
  Order](/p/grade10-site/auction/winner-order) and [My
  Auctions](/p/grade10-site/auction/account-record); operators in the
  [Post-Sale Queue](/p/grade10-admin/auction/post-sale), whose Overdue mark
  is the queue's own and changes no status

::cases{id="grade10-site/auction/order-status"}

:::detail{title="Product decisions" for="pm"}
One derived status keeps the buyer, operator, and account record aligned
without creating a second mutable order-state ledger. The source facts remain
available where the reader needs the reason: invoice history, fulfilment
history, delivery proof, and suspension explanation.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Expired keeps Pending Payment | Decided | An expired invoice does not create an Expired order status. | Product |
| A missed address deadline keeps its status | Decided | A missed address deadline creates no order status of its own. Awaiting Address and Preparing Invoice both keep reading as they do. | Product (@jeffffej0909) |
| Expired ends winner card pay | Decided | Self-service card pay stops at expiry; operator paths remain. | Product (@tangconst) |
| Cancelled vs Refunded | Decided | Unpaid fail-to-pay ends as Cancelled when an operator cancels; Refunded is paid→refund only. | Product |
| Payment Verifying | 🚧 In flight | Proof waiting for an operator has its own name, read by the winner and the operator alike, and stops the payment deadline. | Product (@jeffffej0909) |
:::
