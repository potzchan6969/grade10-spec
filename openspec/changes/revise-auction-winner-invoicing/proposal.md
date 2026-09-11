**Author:** @jeffffej0909 - 2026-09-10

Product context: [Winner Order](../../../docs/prds/products/grade10-site/auction/winner-order.md),
[Post-Sale Queue](../../../docs/prds/products/grade10-admin/auction/post-sale.md),
[Auction Order Status](../../../docs/prds/products/grade10-site/auction/order-status.md),
[Order Notifications](../../../docs/prds/products/grade10-site/auction/notifications-order.md),
[My Auctions](../../../docs/prds/products/grade10-site/auction/account-record.md).

## Why

A winner's 7 days start running before they can pay. The delivered winner
journey issues the invoice at lot close, priced from the account's default
address with shipping and insurance marked as estimates, and fixes the
deadline at close. A winner with no default address gets an invoice they
cannot pay (`winner-order-SC-02`) while the clock runs anyway
(`winner-order-SC-17`). Shipping a high-value card is priced case by case for
its destination, so the estimate is the number most likely to change — and
every change reissues the invoice.

Money that arrives outside the card leaves no trace of how it arrived. Manual
settlement records only a method and a reference: no proof of the transfer,
and a card receipt that does not say which card paid.

**Metric:** self-service settlement rate — invoices paid by card inside their
7 days, over invoices sent. **Second signal:** time from lot close to invoice
sent, which now includes an operator step and should be watched from the first
release.

## What Changes

- **BREAKING — No invoice at lot close.** A closed lot opens an order in
  **Awaiting Address**. The auction-won letter asks for a delivery address and
  names no amount.
- **Winner confirms an address.** The order moves to **Preparing Invoice**,
  which the post-sale queue shows as needing action. The winner can still
  change the address freely until the invoice is sent.
- **An operator quotes and sends the invoice.** Shipping and insurance are
  entered by an operator for the confirmed address. Sending issues the
  invoice, sends the new **invoice-sent** letter, and locks the address.
- **BREAKING — The 7-day deadline starts at send**, not at lot close. An order
  with no invoice has no deadline and never expires.
- **BREAKING — Expiry becomes an invoice status.** Grade10 writes `expired` on
  the invoice when the deadline passes unpaid. The order status **Expired** is
  removed, so the order keeps reading **Pending Payment**. An expired invoice
  stays payable by card or manual settlement, and an operator's reissue returns
  it to `pending`.
- **Idle orders are shown, not expired.** The order detail shows how long it
  has waited in its stage; after **72 hours** in either stage the order carries
  an **Overdue** mark. Nothing is automatic — the operator chases, prepares
  the invoice, or cancels.
- **BREAKING — Address changes after send go through an operator.** The
  operator re-quotes and reissues, and chooses each time whether to keep the
  current deadline or start a fresh 7 days, with a mandatory reason.
- **BREAKING — The winner pays by card only.** Bank transfer, cash, and any
  other method are an operator's backup and are never offered to the winner.
- **Manual settlement records proof.** The operator records bank transfer,
  cash, or another described method, a reference (required for bank transfer),
  and 1 to 5 proof files. The amount is the current invoice's; a different
  amount needs a re-quote first.
- **Every paid record names its method.** A card receipt shows the brand and
  last four digits; a manual receipt shows the method and reference.
- **The shipping-rate calculator is retired** from the invoice flow.
- **BREAKING — Ending soon is no longer an outcome.** A lot with bidding open
  is Live until it closes; how long it has left is read from its close.

## Non-Goals

- **The catalogue's Ending soon filter and the one-hour reminder.** Neither is
  an outcome, and both stay.
- **Automatic expiry or suspension before an invoice exists.** A winner who
  never confirms an address is never suspended; the operator decides.
- **Notifying operators by email or in-app notice.** The queue is how an
  operator learns an order is ready for a quote.
- **Non-card payment by the winner**, and any winner-side upload.
- **Tax.** The tax line stays reserved for the separate tax change.
- **Changes to hold release, suspension, reinstatement, fulfilment, or
  delivery proof.**
- **A quote-time target beyond the Overdue mark.**

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: the order opens awaiting an address;
  the invoice carries an operator quote; the address locks and the deadline
  starts at send; the winner pays by card only; the receipt names the method.
- `grade10-site/auction/order-status`: invoice status gains `not_issued` and
  `expired`; the condition `address_confirmed` replaces `deadline_elapsed`;
  Awaiting Address and Preparing Invoice are added and Expired is removed.
- `grade10-site/auction/notifications-order`: the auction-won letter asks for
  an address; a new invoice-sent letter.
- `grade10-site/auction/account-record`: the winner's projection gains the two
  pre-invoice states and loses Expired.
- `grade10-admin/auction/post-sale`: quote and send, re-quote, idle time and
  the Overdue mark, cancellation before an invoice, and manual settlement with
  method and proof.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | The winner order opens on address confirmation, shows no amount before send, locks the address after send, and offers card only. The receipt names the method. |
| `apps/admin/grade10` | Quote and send, re-quote with a deadline choice, idle time and the Overdue mark and filter, cancel before an invoice, manual settlement with proof upload. |
| Auction service | Order creation without an invoice, the `not_issued` status and its transitions, send-anchored deadlines, proof-file storage, card brand and last four on the paid record. |
| Shipping-rate integration | Retired from the invoice flow. |
| Notification service | A new invoice-sent letter; the auction-won letter changes. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. New letter and label copy is catalog work for the engineer. |

**Card brand and last four are new data.** Nothing stores them today; the
engineer confirms the payment provider supplies them.

## Ordering and dependencies

- **Depends on archiving `add-auction-winner-journey`.** That change is built
  (37 of 37 tasks) and not archived, so `winner-order`, `order-status`, and
  `notifications-order` are not durable yet. This change's MODIFIED and
  REMOVED blocks are written against its deltas. Strict validation passes
  today, because it does not check a MODIFIED block's target; the fold at
  archive does. This change archives only after that one.
- **Two points for that archive.** Its `post-sale` delta carries `## Purpose`
  and only ADDED blocks against a `post-sale` that is already durable, so the
  archive would keep the older `Listing outcomes` and `Payment states`
  requirements beside the new queue model. It also reuses story ids
  `post-sale-US-01` and `post-sale-US-02`, which the durable journeys already
  give to different stories. The validator passes it; both are semantic.
- **Three changes rewrite one requirement.** `add-auction-winner-journey`,
  `redesign-my-auctions-table`, and this change all modify **"A winner reads
  their own payment and shipment state"** in `account-record`. Whichever
  archives later must carry the others' edits.

## Assumptions

- **The quote covers shipping and insurance**, and quoting, sending,
  re-quoting, and manual settlement need payment-processing — finance and
  admin — not shipment-processing.
- **Proof files** are 1 to 5 per settlement, each a PDF, JPEG, or PNG of at
  most 10 MB, readable by operators only, and never shown to the winner.
- **Re-quote applies to a `pending` invoice.** An `expired` invoice is reissued, as
  today.
- **3 days is 72 hours** in the current stage.
- **An expired invoice still needs action in the queue.** The row reads
  Pending Payment, shows the invoice's Expired status beside it, and carries
  the needs-action highlight.
- **Suspension is unchanged.** `grade10-site/auction/bidder-suspension` fires
  when the deadline passes unpaid — the same moment Grade10 writes `expired`.

## Follow-on changes

- A suggested shipping figure for the operator's quote, drawn from the
  retired calculator.
- A reminder to a winner who has not yet confirmed an address.
