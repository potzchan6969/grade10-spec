**Author:** @jeffffej0909 - 2026-09-10

**Extended by:** @tangconst - 2026-09-15 — Storybook #436 reconciliation (expired ends self-service Pay; progress steps; invoice PDF; My Auctions View order; calm Won rows).

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
- **An operator quotes and sends the invoice.** Shipping & Handling is
  entered by an operator for the confirmed address and may be zero. Insurance
  is optional; once added it must be more than zero. Sending issues the
  invoice, sends the new **invoice-sent** letter, and locks the address.
- **BREAKING — The 7-day deadline starts at send**, not at lot close. An order
  with no invoice has no deadline and never expires.
- **BREAKING — Expiry becomes an invoice status.** Grade10 writes `expired` on
  the invoice when the deadline passes unpaid. The order status **Expired** is
  removed, so the order keeps reading **Pending Payment**.
- **BREAKING — An expired invoice ends self-service card pay.** Winner Order
  hides Pay with card and shows Contact Us in the overdue alert. An operator
  reissues (returns the invoice to `pending` with a new deadline), settles
  manually, or cancels. A deadline that still allowed card pay would not be a
  deadline (Storybook #436; Product decisions on Winner Order).
- **Idle orders are shown, not expired.** The order detail shows how long it
  has waited in its stage; after **72 hours** in either pre-invoice stage the
  order carries an **Overdue** mark for operators. Nothing is automatic — the
  operator chases, prepares the invoice, or cancels. There is no winner-facing
  address-only deadline.
- **Progress presentation.** Winner Order shows five steps — Address → Invoice
  → Payment → Shipped → Completed — as presentation only. Order status keeps
  its eight names; Processing maps under Shipped; Delivered maps to Completed;
  Cancelled and Refunded show no stepper.
- **Invoice PDF.** Once an invoice has been sent, the winner can view and
  download it on Winner Order; hidden before send and when Cancelled.
- **My Auctions entry.** Every Won standing offers View order into that lot’s
  Winner Order; Didn’t win and watch-only do not. Won rows stay calm — status
  badge and View order only; no secondary Won helpers. Didn’t win keeps hold
  being-released / released copy. How to reach Grade10 for an expired invoice
  is on Winner Order only, not on the My Auctions row.
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
- **A Subtotal and a Payment Processing Fee line.** The Subtotal is everything
  the winner owes before the card fee. The fee grosses that subtotal up, using
  the fixed fee and percentage read from the payment provider at the moment the
  invoice is sent, so Grade10 nets the subtotal in full. It is fixed once sent.
- **Manual settlement pays no fee.** Settling by bank transfer, cash or another
  method settles the subtotal, and the fee line is dropped.
- **Unreadable provider fees refuse the send.** No stored rate stands in.
- **Invoice lines are renamed.** Hammer price reads **Winning Bid**, Shipping
  reads **Shipping & Handling**, and Final amount reads **Order Total**, for the
  winner and the operator.
- **Zero and absent lines.** Shipping & Handling of zero reads **Free**; an
  invoice without Insurance shows no Insurance line.
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
  starts at send; the winner pays by card only while `pending`; expired hides
  card Pay and shows Contact Us; five-step progress presentation; invoice PDF
  after send; the receipt names the method.
- `grade10-site/auction/order-status`: invoice status gains `not_issued` and
  `expired`; the condition `address_confirmed` replaces `deadline_elapsed`;
  Awaiting Address and Preparing Invoice are added and Expired is removed;
  expired ends winner card pay while order status stays Pending Payment.
- `grade10-site/auction/notifications-order`: the auction-won letter asks for
  an address; a new invoice-sent letter.
- `grade10-site/auction/account-record`: the winner's projection gains the two
  pre-invoice states and loses Expired; View order on Won; calm Won rows;
  expired contact only on Winner Order; Didn’t win hold copy kept.
- `grade10-admin/auction/post-sale`: quote and send, re-quote, idle time and
  the Overdue mark, cancellation before an invoice, and manual settlement with
  method and proof (including on `expired`).

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | The winner order opens on address confirmation, shows no amount before send, locks the address after send, offers card only while `pending`, hides Pay and shows Contact Us when `expired`, shows five-step progress and invoice PDF after send. My Auctions Won rows offer View order without secondary helpers. |
| `apps/admin/grade10` | Quote and send, re-quote with a deadline choice, idle time and the Overdue mark and filter, cancel before an invoice, manual settlement with proof upload. |
| Auction service | Order creation without an invoice, the `not_issued` status and its transitions, send-anchored deadlines, proof-file storage, card brand and last four on the paid record. |
| Shipping-rate integration | Retired from the invoice flow. |
| Notification service | A new invoice-sent letter; the auction-won letter changes. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. New letter and label copy is catalog work for the engineer. |

**Card brand and last four are new data.** Nothing stores them today; the
engineer confirms the payment provider supplies them.

## Ordering and dependencies

- **The winner journey is archived on this PR.** Its durable `winner-order`,
  `order-status`, and `notifications-order` specs are the base for this
  change's MODIFIED and REMOVED blocks. This change carries every inherited
  scenario it changes, so its later archive does not drop the established
  acceptance record.
- **Two changes rewrite one requirement.** `redesign-my-auctions-table` and
  this change both modify **"A winner reads their own payment and shipment
  state"** in `account-record`. Whichever archives later must carry the
  other's edits.

## Assumptions

- **The payment provider is Stripe**, and its current fixed and percentage
  fees for the invoice's currency can be read at send. The spec says "the
  payment provider"; the engineer confirms the call in the tech design.
- **Grade10 absorbs a fee difference** when the winner's card costs the
  provider more than the quoted rate.
- **The quote covers Shipping & Handling and any Insurance**, and quoting, sending,
  re-quoting, and manual settlement need payment-processing — finance and
  admin — not shipment-processing.
- **Proof files** are 1 to 5 per settlement, each a PDF, JPEG, or PNG of at
  most 10 MB, readable by operators only, and never shown to the winner.
- **Re-quote applies to a `pending` invoice.** An `expired` invoice is reissued, as
  today.
- **3 days is 72 hours** in the current stage.
- **An expired invoice still needs action in the queue.** The row reads
  Pending Payment, shows the invoice's Expired status beside it, and carries
  the needs-action highlight. The winner cannot pay by card until an operator
  reissues.
- **Suspension is unchanged.** `grade10-site/auction/bidder-suspension` fires
  when the deadline passes unpaid — the same moment Grade10 writes `expired`.
- **Buyer’s Premium rate** stays ❓ deferred on the Auction index; this change
  does not fix a rate.

## Follow-on changes

- A suggested shipping figure for the operator's quote, drawn from the
  retired calculator.
- A reminder to a winner who has not yet confirmed an address.

## References

- [Post-Sale Queue · Payment](../../../docs/prds/products/grade10-admin/auction/post-sale.md#payment)
