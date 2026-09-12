---
title: Post-Sale Queue
spec: grade10-admin/auction/post-sale
audience: operator
order: 13
---

The queue works every winner order from lot close through delivery in one place. Each row wears exactly one derived outcome, the queue filters to one outcome at a time, and rows waiting on an operator carry an extra needs-action treatment. An order opens into its winner, invoice revisions, payment attempts, address snapshots, fulfilment facts, and immutable histories.

| Outcome | When |
| --- | --- |
| Draft · Scheduled · Live · Ending soon | The sale is still the auction's; time left is read from the close |
| Unsold · Called off | Ended without a payable winner order |
| Pending Payment | The invoice is unpaid and its deadline has not elapsed |
| Expired | The invoice is unpaid after its deadline |
| Processing | Payment is complete and dispatch is not complete |
| Shipped | The lot has been dispatched and delivery is not confirmed |
| Delivered | Delivery is confirmed |
| Cancelled · Refunded | The order has a recorded terminal outcome |

- **Needs action** — Expired and Processing

## Payment

The winning bid-time hold is released rather than captured, and every failed payment attempt remains in the invoice log.

An operator confirms the delivery address before manual settlement. The amount is recalculated, and the settlement records the address snapshot.

A winner order reaches paid through one fresh card payment or one operator-recorded manual settlement. An expired invoice stays payable, and a reissue returns it to pending with a new deadline.

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
