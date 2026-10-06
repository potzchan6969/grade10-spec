---
title: Invoice and Receipt PDF Blocks
spec: shared/ui/invoice-and-receipt-pdf
order: 20
reviewed: 2026-10-06
---

These blocks are the shared PDF contract for an auction order's invoice and
receipt. They take application-resolved document data and return PDF bytes, so
the preview and product applications consume one renderer without moving
document rules into either application.

## The Blocks

- **InvoicePdf** - the invoice title, issuer mark, document metadata, party
  addresses, lot and charges, payment details when supplied, and issuer block
- **ReceiptPdf** - the receipt title, issuer mark, document metadata, party
  addresses, lot and charges, payment breakdown, optional transfer reference,
  and issuer block

## Ownership

- **The application** resolves the document data, amounts, dates, payment
  rails, and copy, then passes them to the renderer
- 🚧 **GMT+8** — every date on the invoice and the receipt is Hong Kong
  time, labelled GMT+8
- **The block** lays out the supplied content and returns PDF bytes; it does not
  fetch, store, navigate, calculate totals, or import application copy
- **UI design** is waived because this change moves an existing PDF renderer
  into the shared package contract and does not add a reader-facing state or
  layout

::changes{spec="shared/ui/invoice-and-receipt-pdf"}

:::detail{title="Code map" for="engineer"}
- **Exports** - `InvoicePdf` and `ReceiptPdf` in `packages/ui`
- **Preview** - the invoice and receipt stories in `apps/preview` render the
  returned bytes with the PDF preview viewer
:::

:::detail{title="Test cases" for="qa"}
::cases{id="shared/ui/invoice-and-receipt-pdf"}
:::
