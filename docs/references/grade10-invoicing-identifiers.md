# Grade10 Invoicing Identifiers

The owner's requirements for auction invoice, receipt and payment reference
identifiers, as of 2026-09-22. The identifier rules and retention are carried by
the `add-winner-bank-transfer` change on
[Post-Bidding · Winner Order](../prds/products/grade10-site/auction/post-bidding.md#winner-order). Partial
payment is the source for a later change and is not yet specified. Read this
as the shape the product starts from, not as its requirements.

## Goals

- **Market** — an online auction platform for the Hong Kong market
- **Tax compliance** — Hong Kong Inland Revenue Department, Section 51C
- **Privacy** — hide platform-wide trade volume and user activity, while each
  invoice names the auction listing it bills
- **Audit** — a gapless internal record, kept for the IRD's 7-year rule
- **Reconciliation** — a short, hard-to-mistype payment reference for FPS,
  local bank transfer and SWIFT

## Identifiers

| Identifier | Format | Example | Purpose |
| --- | --- | --- | --- |
| **Invoice ID** | `INV-[YYYYMM]-[LISTING_CODE]-[REVISION]` | `INV-202609-L9482A7-01` | One invoice tied to one listing; revision starts at `01` and increments on reissue |
| **Receipt ID** | `REC-[YYYYMM]-[ORDER_ID]-P[n]-R[m]` | `REC-202609-ORD-L9482A7-P1-R1` | One order-based receipt per payment part and revision; refunds and reversals increment `R[m]` |
| **Bank reference** | `[LISTING_CODE][SEQ]` | `L9482A701` | Short text for FPS and bank transfer notes; also written to Stripe metadata |

### Bank Reference

- **Length** — 7 to 9 characters
- **Characters** — capital letters and digits only
- **Not allowed** — hyphens, spaces and other symbols, so no banking app
  rejects or cuts it
- **Copy** — the payment screen shows a prominent **Copy Reference Code**
  button

## Partial Payment

The platform accepts several payments against one order, even when an invoice
is reissued.

1. **Unpaid** — the invoice is issued and nothing is paid
2. **Partially Paid** — some money is received; the payment is logged and a
   receipt is issued for it
3. **Paid** — the balance is settled; a final statement showing zero is issued

Every receipt for a part payment shows:

- **Original Invoice Total** — the amount billed
- **Previous Payments** — the sum of every earlier payment
- **Current Payment Received** — this payment
- **Remaining Balance Due** — what is still owed

## Two Records

- **External** — the listing-linked identifiers above, on PDFs, emails and
  payment screens
- **Internal** — a sequential number that customers never see, for example
  `#00010482`, logging every invoice and receipt in order
- **Retention** — every invoice and receipt PDF is archived and retrievable
  indefinitely for now
