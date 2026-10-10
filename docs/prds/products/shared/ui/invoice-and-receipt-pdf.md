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
  addresses, item table and charges, payment details when supplied, and issuer block
- **ReceiptPdf** - the receipt title, issuer mark, document metadata, party
  addresses, item table and charges, payment breakdown, optional transfer reference,
  and issuer block

## Ownership

- **The application** resolves the document data, amounts, dates, payment
  rails, and copy, then passes them to the renderer
- 🚧 **GMT+8** — every date on the invoice and the receipt is Hong Kong
  time, labelled GMT+8, with the date's words in English whatever language the
  document is written in
- **The block** lays out the supplied content and returns PDF bytes; it does not
  fetch, store, navigate, calculate totals, or import application copy
- 🚧 **UI design** - no Figma frame draws these PDFs. The item table is built
  from the requirements and previewed in Storybook

## On the Page

- 🚧 **Item table** - every invoice and receipt lists its items as rows, each
  with Winning Bid, Buyer's Premium and Total, so a document with several items
  reads as one table
- 🚧 **One item** - a document with one item uses the same table, with one row
- 🚧 **Item Total** - a row under the items totals each column, on every
  document including one with a single item; the application supplies its
  amounts
- 🚧 **Long tables** - items that do not fit one page continue on the next page
  under the repeated column header, an item row never splits across two pages,
  and Item Total and the summary stay together, with a receipt's four payment
  breakdown lines kept whole
- 🚧 **Issuer block** - on a document of several pages it sits at the foot of
  the last page only, with no page numbers or continuation notes
- **Stored PDFs** - an invoice or receipt is stored as drawn when first opened
  and served from that copy after, so one opened before the table ships keeps
  its old layout -
  [Post-Bidding · Receipt Documents](/p/grade10-site/auction/post-bidding#receipt-documents)
- **One lot per invoice** - an order holds one lot, so each document draws one
  item today; combining lots is not part of this table -
  [Post-Bidding · The Invoice](/p/grade10-site/auction/post-bidding#the-invoice)
- 🚧 **A replacement invoice** — names the invoice it replaces as plain
  text, with no link to that invoice's PDF
- 🚧 **Bank details** — an invoice shows only the bank rails that are
  enabled

::changes{spec="shared/ui/invoice-and-receipt-pdf"}

:::detail{title="Code map" for="engineer"}
- **Exports** - `InvoicePdf` and `ReceiptPdf` in `packages/ui`
- **Preview** - the invoice and receipt stories in `apps/preview` render the
  returned bytes with the PDF preview viewer
:::

:::detail{title="Test cases" for="qa"}
::cases{id="shared/ui/invoice-and-receipt-pdf"}
:::
