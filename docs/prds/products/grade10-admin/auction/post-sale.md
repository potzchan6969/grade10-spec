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
| Processing | Payment is complete and dispatch is not complete |
| Shipped | The lot has been dispatched and delivery is not confirmed |
| Delivered | Delivery is confirmed |
| Cancelled · Refunded | The order has a recorded terminal outcome |

- **Needs action** - Preparing Invoice, expired Pending Payment, and Processing
- **Overdue** - a separate mark for an order idle for 72 hours or more in Awaiting Address or Preparing Invoice; it changes no status and never expires the order
- ❓ **Overdue against the address deadline** - the mark should appear when the 48-hour address deadline passes rather than after 72 hours idle, or a winner is blocked for a day before any operator is told. To be updated once the winner-invoicing change is archived
- **Extended bidding: ON** - a lot past its scheduled close and still taking bids carries this label on its row; its outcome does not change

## Payment

The winning bid-time hold is released rather than captured, and every failed payment attempt remains in the invoice log.

The winner confirms a delivery address before an operator quotes the invoice. The operator enters shipping and insurance for that address, sends the invoice, locks the address, and starts the seven-day payment window. A later address change is handled by an operator re-quote with a mandatory reason and a choice to keep or reset the deadline.

- 🚧 **Reopening the address form** — once the 48-hour address deadline has passed, an operator reopens the form on request, with a mandatory reason, which gives the winner a fresh 48 hours
- 🚧 **Who may reopen** — payment processing, the grant that already covers reissue and manual settlement; a reopen changes no status and may be repeated
- 🚧 **Not on a cancelled order** — cancellation has already returned the lot to stock, so the address form never reopens after it
- 🚧 **Address by telephone** — an operator records the address themselves without reopening the form, and the winner's form stays closed

What the operator enters and reads on a quote:

- 🚧 **Shipping & Handling** — always entered, and may be zero
- 🚧 **Insurance** — optional, and never zero once added
- 🚧 **Payment Processing Fee** — priced by Grade10 from the payment provider's live fees, not entered; the send is refused when those fees cannot be read
- 🚧 **Subtotal and Order Total** — both read before sending

A winner order reaches paid through one fresh card payment or one operator-recorded manual settlement.

- 🚧 **Expired invoice** — the winner can no longer pay it; only an operator settles it here, manually, or reissues it so the winner can pay by card again with a fresh seven days

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
| Who reopens the address form | Decided | The operator, with payment processing and a mandatory reason. A reopen gives a fresh 48 hours and changes no status. | Product and Operations |
| Reopening a cancelled order | Decided | Refused. The lot is back in stock and may already be attracting bids, so an address on it would promise a lot Grade10 no longer holds for that winner. | Product and Operations |
| Operational history | Decided | Invoice and fulfilment logs remain append-only and separate from the compliance audit chain. | Product and Engineering |
:::

## Pending Spec

::next{spec="grade10-admin/auction/post-sale"}
