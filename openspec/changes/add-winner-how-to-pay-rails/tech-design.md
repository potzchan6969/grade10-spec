## Boundaries

The auction invoice owns an immutable `BankPaymentRails` snapshot when it is
sent. It contains SWIFT, FPS, Hong Kong local transfer and the instruction
reference. Winner Order and InvoicePdf read that same snapshot; neither owns
or recomputes rail data. Finance provisions the values before an invoice is
sent.

Each recorded payment owns its provider reference. ReceiptPdf renders that
recorded payment reference when present. It never substitutes the invoice
instruction reference.

## Read Models

- **Winner Order** - Shows Submit Payment Proof and View Bank Details only for
  a pending bank-transfer invoice with no recorded payment. Both controls hide
  for Payment Verifying and Partially Paid.
- **InvoicePdf** - Renders `BankPaymentRails` only for a bank-transfer invoice.
- **ReceiptPdf** - Renders the recorded provider reference only when one was
  recorded for that payment.

## Controls

The amount, rail values and instruction reference are display-only. No Copy
control is rendered. The server refuses card payment on a bank-transfer
invoice and refuses proof submission outside its pending, unpaid state.
