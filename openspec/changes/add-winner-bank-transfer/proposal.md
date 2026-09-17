**Author:** @jeffffej0909 - 2026-09-16

## Why

A winner can pay an auction invoice only by card, and the card fee grows with
the lot. On a high-value lot that fee is large enough that a winner would
rather transfer the money, but today a transfer happens only when an operator
arranges it by hand, and the deadline keeps running while they wait.

Money that arrives by transfer also has nothing to match on: the winner is
never asked to quote a reference, and nothing records that they sent proof.

**Metric:** self-service settlement rate — invoices paid inside their deadline
without an operator arranging the payment, by card or by bank transfer with
winner-uploaded proof, over invoices sent. **Second signal:** time from proof
upload to an operator's confirmation or return, which is new operator work and
is watched from the first release.

## What Changes

- **BREAKING — The winner may pay by bank transfer.** Card is no longer the
  only method a winner is offered. The card-only rule from
  `revise-auction-winner-invoicing` is reversed.
- **The winner chooses a payment method with the address.** Confirming a
  delivery address also records card or bank transfer. The choice shows a fee
  range Grade10 sets as fixed text; the bank transfer text names no amount.
  Bank transfer is offered only in a currency with bank details set up — HKD
  at launch.
- **BREAKING — Payment Processing Fee is priced by method and never dropped.**
  For card it stays the provider gross-up read at send. For bank transfer the
  operator enters it on every invoice: required, zero or more, no cap, and
  zero reads Free. Manual settlement no longer drops the line.
- **Bank transfer details on the invoice.** An invoice sent for bank transfer
  shows SWIFT, FPS and Hong Kong local bank transfer details instead of card
  Pay, and asks the winner to quote the bank reference, with a Copy Reference
  Code button.
- **Invoice, receipt and payment identifiers.** Invoice ID
  `INV-[YYYYMM]-[LISTING_ID]-[SEQ]`, receipt ID
  `REC-[YYYYMM]-[LISTING_ID]-[SEQ]-P1`, and bank reference
  `[LISTING_ID][SEQ]` (8 or 9 capital letters and digits) on every invoice,
  shown to the winner only on bank transfer. The listing code is `L` and 5
  characters hashed from the listing's id, fixed and unique. The month is Hong
  Kong time; the count starts at `01` and moves on each reissue, and an old
  identifier still finds the order. Receipts show a payment breakdown.
  Operators search the queue by any identifier and read a gapless internal
  audit number the winner never sees. Invoice and receipt PDFs are kept at
  least 7 years.
- **A reissue must change something.** A new reason alone is refused.
- **The winner uploads payment proof, once.** 1 to 5 PDF, JPEG or PNG files of
  up to 10 MB each, behind a confirm step. No further upload is accepted until
  an operator returns the invoice.
- **New invoice status `payment_verifying`, derived as Payment Verifying.**
  Entered on upload. The deadline stops, with the time left recorded; card Pay
  is blocked; the post-sale queue marks the order as needing action; the
  winner's account record shows it.
- **An operator checks the proof.** Confirming settles the invoice, with the
  winner's files as its proof and the operator's own added if they wish.
  Returning it sets the invoice back to `pending` with an external reason the
  winner reads and an internal reason, restarts the deadline with the time
  that was left, and is not offered once the invoice has expired. The prompt
  shows the time left.
- **Operator-recorded settlement stays**, with proof required, and goes
  straight to paid without Payment Verifying.
- **BREAKING — One Reissue action.** Re-quote and expired reissue become one
  action that may change the address, payment method, bank transfer fee,
  Shipping & Handling, Insurance, and the deadline (kept or restarted), always
  with a reason. The invoice log names what changed. The bank transfer fee
  starts from the previous invoice's, or empty after a switch from card.
- **Only an operator changes the payment method after send.** The fee may
  change, so a person prices it.
- **A replaced invoice reads as replaced.** It takes no status of its own and
  is never `cancelled`; Grade10 reads "replaced" from the invoice chain, and
  its PDF says which invoice replaced it.
- **A card invoice paid by transfer is reissued as bank transfer first**, then
  settled. Where the money arrived at the Subtotal, the operator enters a bank
  transfer fee of 0.
- **The receipt goes with the payment-received letter.** The letter shows the
  receipt and attaches it as a PDF in the letter's language, named by its
  receipt ID; proof files never appear. The invoice-sent letter attaches no
  PDF. Folded from `add-auction-winner-receipt` (#466), whose
  `R-<year>-<six digits>` number the `REC-` receipt ID replaces.
- **Letters.** A new proof-not-accepted letter carries the external reason and
  the time left. No letter goes out on upload. Payment reminders and the final
  notice are held while proof is being checked and resume if it is returned.

## Non-Goals

- **Partial payment.** Several payments against one invoice, a shortfall
  tolerance, overpayment, and refunds are a separate change. Until it lands an
  invoice is settled only at its full amount.
- **Automatic matching of a bank statement to an invoice.**
- **Cash or another method offered to the winner.** These stay operator
  settlement only.
- **Bank transfer in USD or JPY.**
- **A proof-received letter.**
- **Changes to suspension.** It fires when a `pending` invoice's deadline
  passes; a Payment Verifying invoice is not `pending` and its deadline is
  stopped, so it never fires there.

## Open Questions

- **Fee range wording** at the method choice — Product.
- **Bank details** for each of the three ways to pay — Finance.
- **FPS and local transfer reference limits** — Finance, from Grade10's
  bank. The bank reference is 8 or 9 capital letters and digits and fits
  SWIFT's 35-character line.
- **Formal tax receipt** — whether a receipt must carry Grade10's company
  details and tax ID — Finance.
- **How the winner asks** for a new address or payment method after send —
  Design, in `ui-design.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/winner-order`: method choice at address confirmation;
  the fee priced by method and never dropped; bank transfer details and the
  invoice ID, bank reference, listing code and internal audit number; the
  one-time proof upload; Payment Verifying and its return, showing the latest
  reason; the receipt ID and breakdown; record keeping; a replaced invoice.
- `grade10-site/auction/order-status`: invoice status gains
  `payment_verifying`; order status gains Payment Verifying; the stopped
  deadline.
- `grade10-site/auction/notifications-order`: the proof-not-accepted letter;
  the receipt shown in and attached to the payment-received letter;
  reminders held while proof is checked.
- `grade10-site/auction/account-record`: the winner's row shows Payment
  Verifying.
- `grade10-admin/auction/post-sale`: the Payment Verifying outcome; the bank
  transfer fee on the quote; confirming and returning proof; one Reissue
  action that must change something; proof on every operator settlement;
  search by listing code, invoice ID or bank reference; the internal audit
  number on the order and the log.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/grade10` | Method choice with the address; bank transfer details, bank reference and Copy Reference Code; invoice and receipt IDs; the receipt breakdown; proof upload and its confirm step; the Payment Verifying state; the returned-proof reason. My Auctions shows Payment Verifying. |
| `apps/admin/grade10` | Bank transfer fee on the quote; the Payment Verifying outcome and filter; confirm and return with two reasons and the time left; one Reissue form; search by listing code, invoice ID or bank reference; internal audit numbers on the order and log. |
| Auction service | The `payment_verifying` status and stopped deadline; method and fee on the order and invoice; winner proof storage; one reissue command; replaced invoices read from the chain; listing codes assigned by publish; invoice IDs, bank references, receipt IDs and the gapless internal audit number; lookup by any identifier; PDF archive kept at least 7 years. |
| Notification service | The proof-not-accepted letter; reminders held while proof is checked. |
| `@grade10/ui`, `@grade10/design-system`, `@grade10/i18n` | No export or token change proposed. New copy is catalog work for the engineer. |

**Winner uploads are new.** Today only operators attach files; the engineer
confirms storage, scanning and access for a winner's upload.

## Ordering and dependencies

- **Three changes rewrite `winner-order`.** `revise-auction-winner-invoicing`
  and `fix-buyer-premium` are active on it, and this change archives after
  both. It supersedes their Payment Processing Fee drop at manual settlement
  (`winner-order-SC-63`, `grade10-admin-auction-post-sale-SC-67`) and their
  separate re-quote and reissue requirements.
- **`account-record`** is also rewritten by `redesign-my-auctions-table`,
  `lot-page-watch-alerts` and `revise-auction-winner-invoicing`; whichever
  archives later carries the others' edits.
- **`close-overdue-address-confirmation`** is in flight on its own branch and
  touches who settles an expired invoice; this change keeps its rule that
  returning proof is not offered once the invoice has expired.

## References

- [Winner Order · Invoice and Settlement](../../../docs/prds/products/grade10-site/auction/winner-order.md#invoice-and-settlement)
- [Post-Sale Queue · Payment](../../../docs/prds/products/grade10-admin/auction/post-sale.md#payment)
- [Auction Order Status](../../../docs/prds/products/grade10-site/auction/order-status.md)
- [Order Notifications](../../../docs/prds/products/grade10-site/auction/notifications-order.md)
- [My Auctions · The Table](../../../docs/prds/products/grade10-site/auction/account-record.md#the-table)
- [Grade10 Invoicing Identifiers](../../../docs/references/grade10-invoicing-identifiers.md)
