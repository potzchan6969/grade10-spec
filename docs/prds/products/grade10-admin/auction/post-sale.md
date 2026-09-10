---
title: Post-Sale Queue
spec: grade10-admin/auction/post-sale
audience: operator
order: 13
---

The queue works every winner order from lot close through delivery in one place. Each row wears exactly one derived outcome, the queue filters to one outcome at a time, and Expired and Processing rows carry an extra needs-action treatment. An order opens into its winner, invoice revisions, payment attempts, address snapshots, fulfilment facts, and immutable histories.

| Outcome | When |
| --- | --- |
| Draft · Scheduled · Live · Ending soon | The sale is still the auction's |
| Unsold · Called off | Ended without a payable winner order |
| Pending Payment | The current invoice is payable before its deadline |
| Expired | The current invoice passed its deadline unpaid |
| Processing | Payment is complete and dispatch is not complete |
| Shipped · Delivered | Fulfilment has left Grade10 or has carrier proof |
| Cancelled · Refunded | The order has a recorded terminal outcome |

- 🚧 **Awaiting Address** — the winner has not confirmed an address
- 🚧 **Preparing Invoice** — the address is confirmed and the invoice is ready to quote; needs action
- 🚧 **Overdue** — an order idle 72 hours in either stage is marked and can be filtered; nothing expires on it

## Payment

A winner order reaches paid through one fresh charge or one operator-recorded manual settlement. The winning bid-time hold is released rather than captured, and every failed payment attempt remains in the invoice log. Manual settlement confirms the delivery address, records the amount and external reference, and points at any superseded invoice.

- 🚧 **Payment** — an operator quotes and sends the invoice, may re-quote after send, and records non-card payments with a reference and proof files

## Fulfilment

Shipment is its own grant, deliberately apart from payment: the person who may settle money is not necessarily the person who dispatches cards. Dispatch requires a paid invoice and records the immutable address snapshot; delivery records carrier proof. The winner reads the same facts from [Winner Order](/p/grade10-site/auction/winner-order).

:::detail{title="Product decisions" for="pm"}
The queue is the operator's close-out surface: payment and shipment are
separate jobs, while one listing detail keeps the winner contact, money,
delivery state, and operational trail together.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Payment source | Decided | The queue distinguishes a fresh Stripe charge from manual settlement, and both release the bid-time hold rather than capturing it. | Product and Finance |
| Shipment authority | Decided | Payment and shipment use separate grants; staff may ship, finance may collect, and publishing remains catalogue work. | Operations |
| Shipping model | Decided | Grade10 records the confirmed dispatch snapshot, carrier tracking, fulfilment milestones, and delivery proof. | Operations |
| Operational history | Decided | Invoice and fulfilment logs remain append-only and separate from the compliance audit chain. | Product and Engineering |
:::

## Pending Spec

::next{spec="grade10-admin/auction/post-sale"}
