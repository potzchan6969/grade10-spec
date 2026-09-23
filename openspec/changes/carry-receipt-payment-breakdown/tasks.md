## 1. Product record (grade10-spec) (owner: @htonyl)

- [x] 1.1 Update `docs/prds/products/grade10-site/auction/post-bidding.md` so
  the receipt requirement names the four payment-time lines, their ordering,
  zero-floor rule for tolerance-close and overpayment, and immutability after
  refund or reversal. Keep receipt and invoice identifier formats as the
  existing ❓ questions.
  - Verification: `pnpm check:manual` in the registered `grade10-spec` store.

## 2. Contracts and data (grade10) (owner: @htonyl)

- [ ] 2.1 Extend the observed `auctionInvoicePayments` table in
  `packages/grade10-auction/backend/src/db/schema/auctionOrders.ts` with
  `receipt_invoice_total_minor`, `receipt_previous_payments_minor` and
  `receipt_remaining_balance_minor`. Reuse its immutable `amount` for Current
  Payment Received and retain its idempotency and receipt-number uniqueness.
  - Covers: `winner-order-SC-204` through `winner-order-SC-208`.
  - Verification: schema/type checks and migration validation.

- [ ] 2.2 Add the snapshot columns as non-null fields when
  `auctionInvoicePayments` is created or updated. The store has no old payment
  or receipt records, so no backfill or compatibility migration is required.
  Preserve identifiers and do not derive values from post-payment refunds or
  reversals.
  - Verification: schema and migration creation checks, followed by full,
    ordered-partial, tolerance-close, overpayment and refunded/reversed receipt
    cases through the shared payment transaction.

## 3. Payment recording and receipt contracts (grade10)

- [ ] 3.1 In `winnerInvoice.ts`, make the shared invoice payment transaction
  calculate and persist the four receipt-time values under the existing
  per-order lock and idempotency key. Cover full payment, ordered partial
  payment, exact close, tolerance close and confirmed overpayment.
  - Covers: `winner-order-SC-204`, `SC-205`, `SC-206` and `SC-207`.
  - Verification: focused backend checks for each state transition.

- [ ] 3.2 Route card confirmation, confirmed bank-transfer proof and operator
  manual settlement through the shared transaction. Keep method, proof,
  external reference and actor behavior in the existing adapters; verify the
  actual webhook/repository paths before editing them.
  - Covers: the existing card, proof-confirmation and manual-settlement
    scenarios plus `winner-order-SC-204` through `SC-207`.
  - Verification: one focused path check per settlement entry point and
    idempotent replay checks.

- [ ] 3.3 Keep refund and reversal handling append-only with respect to receipt
  snapshots. Do not reissue receipts or mutate earlier or later stored
  previous-payment values.
  - Covers: `winner-order-SC-208`.
  - Verification: refund/reversal regression check over three issued receipts.

## 4. Receipt presentation (grade10)

- [ ] 4.1 Render the stored values in the existing receipt/PDF path in this
  order: Original Invoice Total, Previous Payments, Current Payment Received,
  Remaining Balance Due.
  - Covers: `winner-order-SC-204` through `SC-208`.
  - Verification: focused receipt rendering checks for full, partial,
    tolerance-close, overpayment and refund/reversal cases.

- [ ] 4.2 Keep Winner Order's Partially Paid presentation and receipt links
  unchanged. Do not add a live balance, receipt-ID format, broader receipt PDF
  layout redesign, or post-reversal future-payment behavior to Winner Order;
  the receipt renderer only gains the four required lines.
  - Verification: existing `add-winner-partial-payment` Winner Order checks.
