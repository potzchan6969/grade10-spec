---
title: Post-Sale Queue
spec: grade10-admin/auction/post-sale
audience: operator
order: 13
---

The queue works every winner order from lot close through delivery in one place. Each row wears exactly one derived outcome, the queue filters to one outcome at a time, and rows waiting on an operator carry an extra needs-action treatment. An order opens into its winner, invoice revisions, payment attempts, address snapshots, fulfilment facts, and immutable histories. Awaiting Address waits on the winner; Preparing Invoice waits on an operator's quote.

| Outcome | When |
| --- | --- |
| Draft · Scheduled · Live | The sale is still the auction's; time left is read from the close |
| Unsold · Called off | Ended without a payable winner order |
| Awaiting Address | The lot closed without a confirmed delivery address |
| Preparing Invoice | The winner confirmed an address, but the operator has not sent an invoice |
| Pending Payment | The invoice is unpaid; an expired invoice keeps this outcome and shows its Expired invoice status |
| 🚧 **Payment Verifying** | The winner uploaded payment proof and waits for an operator to check it |
| Processing | Payment is complete and dispatch is not complete |
| Shipped | The lot has been dispatched and delivery is not confirmed |
| Delivered | Delivery is confirmed |
| Cancelled · Refunded | The order has a recorded terminal outcome |

- **Needs action** - Preparing Invoice, expired Pending Payment, and Processing
- 🚧 **Payment Verifying needs action** - it carries the needs-action treatment until an operator checks the proof
- **Overdue** - a separate mark for an order idle for 72 hours or more in Awaiting Address or Preparing Invoice; it changes no status and never expires the order
- 🚧 **Search** — by listing code, invoice ID or bank reference; a replaced invoice's ID or reference still finds the order
- **Extended bidding: ON** - a lot past its scheduled close and still taking bids carries this label on its row; its outcome does not change

## Payment

The winning bid-time hold is released rather than captured, and every failed payment attempt remains in the invoice log.

The winner confirms a delivery address before an operator quotes the invoice. The operator enters shipping and insurance for that address, sends the invoice, locks the address, and starts the seven-day payment window. A later address change is handled by an operator re-quote with a mandatory reason and a choice to keep or reset the deadline.

What the operator enters and reads on a quote:

- 🚧 **Shipping & Handling** — always entered, and may be zero
- 🚧 **Insurance** — optional, and never zero once added
- 🚧 **Payment method** — the one the winner chose, read on the quote
- 🚧 **Payment Processing Fee** — for card, priced by Grade10 from the payment provider's live fees, not entered, and the send is refused when those fees cannot be read; for bank transfer, entered by the operator on every invoice, zero or more, and the send is refused while it is blank
- 🚧 **Subtotal and Order Total** — both read before sending

A winner order reaches paid through one fresh card payment or one operator-recorded manual settlement. An expired invoice stays payable, and a reissue returns it to pending with a new deadline.

- 🚧 **Reissue** — one action for any change after send: address, payment method, bank transfer fee, shipping, insurance, and the deadline kept or restarted, always with a reason and at least one change; the bank transfer fee starts from the previous invoice's
- 🚧 **Checking proof** — on a Payment Verifying order the operator confirms the payment, with the winner's files as proof and their own added if they wish, or returns the invoice to pending with a reason the winner reads and a reason kept internal; the prompt shows the time left, and returning is not offered once the invoice has expired
- 🚧 **Internal audit number** — every invoice and receipt carries one gapless number, such as `#00010482`, shown on the order and in the invoice log and never to the winner; a replaced invoice keeps its number
- 🚧 **Card invoice paid another way** — by transfer, cash or another method: reissued as bank transfer first, then settled at the new invoice's total; where the money arrived at the Subtotal, the bank transfer fee is 0

Manual settlement is a finance fallback: the operator records bank transfer, cash, or another described method, a reference where required, and one to five private proof files. The winner sees the payment method and reference on the receipt, never the proof files.

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
