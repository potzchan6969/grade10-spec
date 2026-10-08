# UI: items as rows on the invoice and receipt PDFs

## Screens

No Figma frame draws these documents: the PDFs have never had one, and
`decisions.md` Q35 decides none for the item table. The table is built from
the requirements and previewed in Storybook. The Design Override check reads
class strings and style props, not pdf-lib's drawing, so it stops no change to
these documents. The person's review of the rendered PDFs is the design check.

The layout reference is a sample consolidated invoice the person supplied: the
columns Item, Winning Bid, Buyer's Premium and Total, one row per item, a
closing Item Total row, then the charge rows. The store does not keep the
sample, which names a private person.

| Screen | Frame | What is new on it |
| --- | --- | --- |
| Invoice PDF | *none; decisions Q35* | The item table replaces the lot title and the Description and Amount list. |
| Receipt PDF | *none; decisions Q35* | The same item table sits above the payment breakdown. |

## Components

| Export | Change |
| --- | --- |
| `InvoicePdf` | Draws the item table, the Item Total row, the charges under it and the summary, and continues the table on further pages. Its other parts do not change. |
| `ReceiptPdf` | Draws the same item table as `InvoicePdf`, then the payment breakdown. Its other parts do not change. |
| `InvoicePdfData`, `ReceiptPdfData` | Lose the single lot title. Gain the item list and the Item Total amounts. Field names land in `tech-design.md`. |
| `PdfLineItem` | Holds only the charges under the table. Winning Bid and Buyer's Premium leave it for the items. |
| `PdfDocumentCopy` | The Description and Amount labels give way to the table's labels: Item, Winning Bid, Buyer's Premium, Total and Item Total. |

No design-system primitive and no `@grade10/i18n` key changes. Every label
reaches the block through `copy`, and `grade10` supplies the new ones as
interim literals. Work in this store: the block's own stories and
`apps/preview`'s stories each gain a several-item sample and a sample whose
table runs onto a second page.

## States

### Invoice PDF

| State | Shows | Anchor |
| --- | --- | --- |
| One item | One item row, the Item Total row under it, then the charges and the summary | `shared-ui-invoice-and-receipt-pdf-SC-56` |
| Several items | One row per item in the order given, then the Item Total row | `shared-ui-invoice-and-receipt-pdf-SC-57` |
| Long item title | The title wraps inside its column, and the three amounts stay beside its first line | `shared-ui-invoice-and-receipt-pdf-SC-58` |
| Non-Latin item title | The title draws in the embedded face when one is supplied, and the row layout does not move | `shared-ui-invoice-and-receipt-pdf-SC-59` holds the row layout for a title with no spaces. **Out of suite:** the embedded face is the renderer's existing font option, and `packages/grade10-auction/backend/test/services/auctions/invoicePdf.test.ts` in `grade10` draws a Chinese invoice with the embedded fixture face (`draws a Chinese invoice with a font viewers accept`) |
| Charges under the table | Shipping & Handling, Insurance and Tax rows in the order given, then the boxed summary | `shared-ui-invoice-and-receipt-pdf-SC-3` for the charges and the summary, `shared-ui-invoice-and-receipt-pdf-SC-52` for Tax |
| Table past one page | The table continues on the next page under the repeated column header, and no item row splits across two pages | `shared-ui-invoice-and-receipt-pdf-SC-62`, `shared-ui-invoice-and-receipt-pdf-SC-63` |
| Page end after the last item | The Item Total row, the charges, the Tax line and the boxed summary move together to the next page when they do not fit, under the repeated column header, with no item row moved over with them | `shared-ui-invoice-and-receipt-pdf-SC-64` |
| Page end before Bank details | Bank details move whole to the next page when they do not fit below the summary | `shared-ui-invoice-and-receipt-pdf-SC-74` |

### Receipt PDF

| State | Shows | Anchor |
| --- | --- | --- |
| One item | One item row, the Item Total row under it, then the charges, the summary and the payment breakdown | `shared-ui-invoice-and-receipt-pdf-SC-60` |
| Several items | One row per item in the order given, then the Item Total row | `shared-ui-invoice-and-receipt-pdf-SC-57` |
| Table past one page | The table continues on the next page under the repeated column header, and no item row splits across two pages | `shared-ui-invoice-and-receipt-pdf-SC-62`, `shared-ui-invoice-and-receipt-pdf-SC-63` |
| Page end after the last item | The Item Total row, the charges, the Tax line and the boxed summary move together to the next page when they do not fit, under the repeated column header, with no item row moved over with them | `shared-ui-invoice-and-receipt-pdf-SC-64` |
| Page end before the Payment section | The Payment section, with the transfer reference, moves whole to the next page when it does not fit below the summary | `shared-ui-invoice-and-receipt-pdf-SC-75` |
| Page end before the payment breakdown | The four payment breakdown lines move together to the next page when they do not fit | `shared-ui-invoice-and-receipt-pdf-SC-65` |

### Both documents

| State | Shows | Anchor |
| --- | --- | --- |
| Continuation page | The column header with its divider, then item rows. No document title, issuer mark, meta rows, Bill To or Ship To, page number or continuation note | `shared-ui-invoice-and-receipt-pdf-SC-73` |
| Last page | The issuer's name above its email at the foot of the page, right-aligned, in the same place on every document and on no earlier page. It shares its page with the end of the document and never stands alone | `shared-ui-invoice-and-receipt-pdf-SC-66`, `shared-ui-invoice-and-receipt-pdf-SC-76` |
| Wide amount | The amount column widens to its widest amount, and every amount is drawn whole on one line, in the size of the other amounts | `shared-ui-invoice-and-receipt-pdf-SC-72` |
| Refused document | No page is drawn. The call fails with an error and returns no PDF, for an empty item list, a title the standard font cannot draw without an embedded font, or amounts, an item row or an Item Total row with its charges that do not fit | `shared-ui-invoice-and-receipt-pdf-SC-69`, `shared-ui-invoice-and-receipt-pdf-SC-70`, `shared-ui-invoice-and-receipt-pdf-SC-71` |
