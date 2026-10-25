# shared/ui/invoice-and-receipt-pdf Specification

## Feature set

- InvoicePdf export
  - Subtotal note: the Subtotal row may carry a note, drawn muted directly under it when supplied and absent otherwise
- ReceiptPdf export
  - Subtotal note: the Subtotal row may carry a note, drawn muted directly under it when supplied and absent otherwise

## MODIFIED Requirements

### Requirement: InvoicePdf and ReceiptPdf render their charges in the order given, ending in a summary

The charges under the item table add what the document charges beyond its
items. Subtotal, Payment Processing Fee, and Order Total are pulled out of the
flat charge list into their own right-aligned summary regardless of
where the caller placed them in the list; every other charge renders below the
Item Total row and above the summary, in the order the caller gave.

**Order** - InvoicePdf and ReceiptPdf SHALL render every charge that is not
Subtotal, Payment Processing Fee, or Order Total below the Item Total row, in
the order the caller supplied it. **Summary** - InvoicePdf and ReceiptPdf SHALL
render Subtotal and Payment Processing Fee in a summary below the other
charges, with no border drawn around it, and SHALL render Order Total in that
same summary, set off by a rule and rendered more heavily weighted than every
other line. **Subtotal note** - The Subtotal row MAY carry a note the caller
supplies. When it does, InvoicePdf and ReceiptPdf SHALL draw the note directly
under the Subtotal row and above the Payment Processing Fee row, left-aligned
with the summary's labels, in the muted colour of the issuer email, no larger
than the summary labels and not bold, and SHALL wrap it inside the summary's
width when it is wider. The note is part of the summary: it SHALL stay with the
Subtotal row on one page, so that when the document continues over further
pages the note is never separated from the Subtotal row above it, and it adds
no row to the charges. When no note is supplied, or the note is blank, neither document
SHALL draw one or leave a gap where it would sit.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-63o rev=3 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-3 - Charges render in the order given, with the summary below them

**Serves:** InvoicePdf export - charges render in the order given, ending in a summary

- **GIVEN** one item and, under it, the charges Shipping & Handling
  `HKD 80.00` and Insurance `HKD 40.00`, followed by Subtotal, Payment
  Processing Fee, and Order Total
- **WHEN** InvoicePdf renders them
- **THEN** the Item Total row comes first, and the two charges appear below it,
  in the order given
- **AND** Subtotal, Payment Processing Fee, and Order Total appear together
  in a summary below them, with no border around it, Order Total set off by a
  rule

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-8b8 rev=2 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-4 - Omitting a charge does not disturb the others' order

**Serves:** InvoicePdf export - charges render in the order given, ending in a summary

- **GIVEN** every charge from `shared-ui-invoice-and-receipt-pdf-SC-3` except
  Insurance
- **WHEN** InvoicePdf renders them
- **THEN** no Insurance line appears
- **AND** the Shipping & Handling line and the summary keep their given order
  below the Item Total row

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-ec5 rev=2 -->
#### Scenario: g10.shared-invoice-and-receipt-pdf.SC1 - An invoice draws the Subtotal's note directly under it

**Serves:** InvoicePdf export - the Subtotal row may carry a note, drawn muted directly under it

- **GIVEN** one item and the charge Shipping & Handling `US$10.01`, followed by
  Subtotal `HK$1,030.00` carrying the note
  `Converted from US$131.21 at 1 USD = 7.85 HKD`, Payment Processing Fee `Free`
  and Order Total `HK$1,030.00`
- **WHEN** InvoicePdf renders them
- **THEN** the summary reads, from the top, Subtotal, the note, Payment
  Processing Fee and Order Total
- **AND** the note shows exactly as supplied, in the muted colour of the issuer
  email, no larger than the summary labels and not bold, with no other row
  between it and Subtotal
- **AND** the note adds no row above the summary: Shipping & Handling is still
  the only charge under the Item Total row

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-53f rev=1 -->
#### Scenario: g10.shared-invoice-and-receipt-pdf.SC2 - A receipt draws the Subtotal's note directly under it

**Serves:** ReceiptPdf export - the Subtotal row may carry a note, drawn muted directly under it

- **GIVEN** the data of `g10.shared-invoice-and-receipt-pdf.SC1` as a receipt,
  with its four payment breakdown lines
- **WHEN** ReceiptPdf renders it
- **THEN** the summary reads, from the top, Subtotal, the note, Payment
  Processing Fee and Order Total, drawn as on the invoice
- **AND** the payment breakdown draws below the summary and carries no note

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-2p2 rev=1 -->
#### Scenario: g10.shared-invoice-and-receipt-pdf.SC3 - Without a note the summary draws as before

**Serves:** InvoicePdf export - the Subtotal row may carry a note, drawn muted directly under it

- **GIVEN** an invoice and a receipt whose Subtotal row carries no note, one whose
  note is omitted and one whose note is an empty string, with the charges of
  `shared-ui-invoice-and-receipt-pdf-SC-3`
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** neither document draws a note, and Payment Processing Fee sits
  directly under Subtotal with the line spacing of every other summary row
- **AND** the four documents place Subtotal, Payment Processing Fee and Order
  Total at the same positions as a document rendered before the note existed

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-bcn rev=1 -->
#### Scenario: g10.shared-invoice-and-receipt-pdf.SC4 - A note wider than the summary wraps under the Subtotal

**Serves:** InvoicePdf export - the Subtotal row may carry a note, drawn muted directly under it

- **GIVEN** an invoice whose Subtotal note reads
  `Converted from US$1,234,567,890.12 at 1 USD = 7.85 HKD`, wider than the
  summary
- **WHEN** InvoicePdf renders it
- **THEN** the note wraps onto a second line, every line of it inside the
  summary's width and above the Payment Processing Fee row
- **AND** the whole note reads once, in order, with no part cut at the margin

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-zs0 rev=1 -->
#### Scenario: g10.shared-invoice-and-receipt-pdf.SC7 - The note stays with its Subtotal row at a page end

**Serves:** InvoicePdf export - the Subtotal row may carry a note, drawn muted directly under it

- **GIVEN** invoices and receipts with 1 to 40 items, each title on one line, the
  charges of `shared-ui-invoice-and-receipt-pdf-SC-3` and a Subtotal note of
  `Converted from US$131.21 at 1 USD = 7.85 HKD`
- **WHEN** InvoicePdf and ReceiptPdf render each of them
- **THEN** in every document, the Subtotal row and its note are drawn on one page,
  the note directly under the row
- **AND** in at least one invoice and at least one receipt that page is the
  second page while the last item row is on the first
- **AND** no page ends with the Subtotal row and begins with its note

### Requirement: InvoicePdf and ReceiptPdf render only what they are given

Neither renderer computes, sums, formats, or translates a value; every
amount is a string the caller already formatted, and every label comes from
the `copy` argument.

**No computation** - InvoicePdf and ReceiptPdf SHALL render every amount
exactly as the string given, and SHALL derive no rendered value from another
argument. **Item amounts** - Each item's Winning Bid, Buyer's Premium and Total,
and the three Item Total amounts, are amounts under this rule: the Item Total
row SHALL show the strings given, never the sum of the rows above it, and an
item's Total SHALL show the string given, never its Winning Bid plus its Buyer's
Premium. **Subtotal note** - The Subtotal note is text under this rule: both
documents SHALL draw the string given, and SHALL NOT build it from the
Subtotal, a line's amount, a currency or a rate, or add a mark or a label to
it. **No label lookup** - InvoicePdf and ReceiptPdf SHALL render every
label from the `copy` argument and SHALL import no message catalog. **Blank
content** - InvoicePdf and ReceiptPdf SHALL render the row of every required
line and every item given even when its text is blank; a blank item title leaves
the Item cell empty. **Same data, same bytes** - InvoicePdf and ReceiptPdf SHALL
return the same bytes for the same data and options whenever they run, and
neither SHALL embed the time of rendering.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-ca8 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-16 - Order Total renders exactly what is given, not a computed sum

**Serves:** Presentation-only contract - a rendered amount is exactly the value given, never a derived one

- **GIVEN** Subtotal, Payment Processing Fee, and Order Total values that
  would not sum correctly if added together
- **WHEN** InvoicePdf renders them
- **THEN** Order Total shows exactly the value given, not the sum of
  Subtotal and the fee

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-0s1 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-17 - Every label reads the copy argument, with no hardcoded fallback

**Serves:** Presentation-only contract - every label comes from the copy argument, not a hardcoded string

- **GIVEN** a `copy` argument of arbitrary strings
- **WHEN** InvoicePdf and ReceiptPdf each render with it
- **THEN** every label reads the string `copy` gave it
- **AND** no label shows a default `copy` did not supply

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-t8t rev=2 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-27 - A required line still renders its row when its content is blank

**Serves:** Presentation-only contract - every amount renders exactly as given, never dropped for its content

- **GIVEN** Subtotal as a whitespace-only string and an item with an empty
  title, Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00` and Total
  `HKD 120.00`, with every other required line supplied normally
- **WHEN** InvoicePdf renders them
- **THEN** the Subtotal row still renders
- **AND** the item's row still renders, with `HKD 100.00`, `HKD 20.00` and
  `HKD 120.00` under their columns and a blank Item cell
- **AND** neither is silently dropped for carrying blank content

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-1tg rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-61 - Item and Item Total amounts render exactly as given

**Serves:** Presentation-only contract - an item's Total and the Item Total row are never computed from the rows around them

- **GIVEN** two items with Winning Bids `HKD 100.00` and `HKD 200.00`, Buyer's
  Premiums `HKD 20.00` and `HKD 40.00`, and Totals `HKD 121.00` and
  `HKD 241.00`, and an Item Total of `HKD 999.00`, `HKD 888.00` and `HKD 777.00`
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** each row shows its three amounts exactly as given
- **AND** the Item Total row shows `HKD 999.00`, `HKD 888.00` and `HKD 777.00`
- **AND** neither document shows `HKD 300.00`, `HKD 60.00` or `HKD 362.00`, the
  sums of the rows

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-41a rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-77 - The same data renders to the same bytes

**Serves:** Presentation-only contract - a document is drawn from its data alone, never from the clock

- **GIVEN** an invoice and a receipt, each with 30 items titled `Lot 01` to
  `Lot 30`
- **WHEN** each is rendered twice, with the system clock one day later for the
  second render
- **THEN** the two outputs of each document are identical byte for byte

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-v22 rev=1 -->
#### Scenario: g10.shared-invoice-and-receipt-pdf.SC5 - The Subtotal note renders as given, never built

**Serves:** Presentation-only contract - a rendered amount is exactly the value given, never a derived one

- **GIVEN** an invoice and a receipt whose Subtotal reads `HK$1,030.00` and whose
  note reads `Converted from US$999.00 at 1 USD = 7.00 HKD`, a figure and a rate
  that match nothing else on the document
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** each document draws the note exactly as given
- **AND** neither draws `US$131.21`, `7.85` or any other figure derived from
  the amounts on the sheet

### Requirement: Each renderer produces A4 pages, one page when the content fits

`InvoicePdf` and `ReceiptPdf` each return the bytes of one complete PDF
document made of A4 pages. A document whose content fits one page is one page.

**Page size** - InvoicePdf and ReceiptPdf SHALL each return PDF bytes in which
every page is sized 595.28×841.89pt (A4). **One page when it fits** -
InvoicePdf and ReceiptPdf SHALL each return exactly one page when the item
table, the summary with its Subtotal note when one is supplied, and every other
section fit it.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-oq2 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-67 - An invoice that fits is one A4 page

**Serves:** Document shape - an ordinary single-lot invoice stays on one sheet

- **GIVEN** invoice data with one item, the charges Shipping & Handling and
  Insurance, a summary, a Bill To and a Ship To of recipient, address
  line 1, city line and country each, and `bankRails` with SWIFT, FPS and HK
  local transfer
- **WHEN** InvoicePdf renders it
- **THEN** the returned bytes parse as a PDF document with exactly one page
- **AND** that page is sized 595.28×841.89pt

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-wyw rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-68 - A receipt that fits is one A4 page

**Serves:** Document shape - an ordinary single-lot receipt stays on one sheet

- **GIVEN** receipt data with one item, the charge Shipping & Handling, a
  summary, a transfer reference, the four payment breakdown lines, and a Bill To
  and a Ship To of recipient, address line 1, city line and country each
- **WHEN** ReceiptPdf renders it
- **THEN** the returned bytes parse as a PDF document with exactly one page
- **AND** that page is sized 595.28×841.89pt

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-iem rev=1 -->
#### Scenario: g10.shared-invoice-and-receipt-pdf.SC6 - A document with a Subtotal note that fits is one A4 page

**Serves:** Document shape - an ordinary single-lot invoice stays on one sheet

- **GIVEN** the invoice data of `shared-ui-invoice-and-receipt-pdf-SC-67` and the
  receipt data of `shared-ui-invoice-and-receipt-pdf-SC-68`, each with a Subtotal
  note of `Converted from US$131.21 at 1 USD = 7.85 HKD`
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** each returns exactly one page, sized 595.28×841.89pt
- **AND** the note and the Payment Processing Fee row are on that page, and the
  issuer block still sits at its foot
