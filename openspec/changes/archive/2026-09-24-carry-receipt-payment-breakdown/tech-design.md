## Shape

Keep receipt-time values on the observed `auctionInvoicePayments` append-only
payment record in
`packages/grade10-auction/backend/src/db/schema/auctionOrders.ts`, introduced
by `add-winner-partial-payment`. Do not create a parallel receipt table.

Reuse the existing immutable payment amount as `Current Payment Received` and
add receipt snapshot columns to that payment/receipt record:

- `receipt_invoice_total_minor`
- `receipt_previous_payments_minor`
- `receipt_remaining_balance_minor`

Each snapshot is stored in the invoice currency and written in the same
transaction that records the payment and issues its receipt. The receipt
identifier remains the existing field and format; this change does not alter
it.

`receipt_remaining_balance_minor` is calculated from the payment state at issue
time and is floored at zero when the invoice is closed as Paid, including a
tolerance close or confirmed overpayment. Refunds and reversals update their
own ledger state only; they never update these receipt columns.

## Boundaries

- `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts` owns the
  observed `auctionInvoicePayments` table, including its unique idempotency
  key, unique receipt number, immutable amount and `createdAt` fields.
- `packages/grade10-auction/backend/src/services/auctions/winnerInvoice.ts`
  owns the shared payment-recording transaction, snapshot calculation,
  idempotency, tolerance close and confirmed-overpayment close.
- Existing card confirmation, bank-transfer proof confirmation and operator
  manual settlement adapters call that shared transaction. They do not each
  calculate receipt lines independently. The exact webhook/repository adapter
  paths must be confirmed during implementation because they are not present
  in this checkout.
- Receipt contracts expose the four stored values. Winner Order continues to
  show only its locked Partially Paid state and receipt links; it does not
  receive a live balance from this change.
- The existing receipt renderer/PDF path consumes the stored values in the
  required order. This change does not alter receipt IDs, invoice IDs, routes
  or document layout.

## Snapshot transaction

For each accepted payment, under the existing per-order lock:

1. Read the immutable invoice total and ordered payments already recorded
   against that invoice.
2. Set `receipt_previous_payments_minor` to the sum of those earlier payments.
3. Use the existing payment amount as Current Payment Received.
4. Determine whether the payment leaves the invoice open, closes it exactly,
   closes it inside the agreed tolerance, or is a confirmed overpayment.
5. Store the snapshot columns and issue the receipt atomically.
6. Make the mutation idempotent on the existing provider event key or operator
   mutation key.

The full-payment, ordered-partial, tolerance-close and confirmed-overpayment
behaviors use this transaction. The three entry paths are card confirmation,
confirmed bank-transfer proof and operator manual settlement.

## Initial schema

There are no existing payment or receipt records to backfill. Add the snapshot
columns as non-null fields when `auctionInvoicePayments` is created or updated.
New payment writes populate all four receipt lines atomically with the payment
record and receipt. No compatibility backfill or historical-data blocker is
required; existing receipt identifiers and PDFs remain unchanged.

## Refund and reversal boundary

Refund and reversal handlers append their own event or ledger record and leave
all receipt snapshots untouched. No receipt is regenerated, and later
receipts' stored previous-payment values are not recomputed.

The change does not define what a future payment may do after a refund or
reversal.
