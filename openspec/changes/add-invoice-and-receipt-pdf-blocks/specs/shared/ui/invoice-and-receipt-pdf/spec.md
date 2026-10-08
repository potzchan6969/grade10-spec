# shared/ui/invoice-and-receipt-pdf Specification

## Purpose

`InvoicePdf` and `ReceiptPdf` are `@grade10/ui` functions that render an
auction order's Invoice and Receipt as PDF bytes from a plain data object, so
an application shows the same document `winner-order/spec.md` already
requires without maintaining its own copy of the renderer.

**Amendment, 2026-09-24 (`decisions.md` Q18-Q20):** the DOM
`@grade10/design-system`-composed components this Purpose and Feature set
described until now are retired. `grade10` never adopted them — it built and
shipped its own pdf-lib renderer instead, already replacing
`PLACEHOLDER_RECEIPT_PDF` in production — so this capability now specifies
that renderer, moved here rather than rebuilt. Every requirement below
reflects what it actually draws today; `## Feature set` bullets and
requirements this move drops are documented as retired rather than silently
removed, per the amendment note above each one.

**Amendment, 2026-10-08 (`decisions.md` Q31-Q38):** both documents list an
order's items as table rows, each with Winning Bid, Buyer's Premium and Total,
closed by an Item Total row, and a table too long for one page continues on the
next. The lot title heading and the Description/Amount header the Q18-Q20
amendment describes give way to this table. Each invoice still holds one lot.

## Feature set

- InvoicePdf export
  - Title and issuer mark: "Invoice" at the top left, the issuer's wordmark —
    or its name as text, when no mark is on file — at the top right
  - Meta rows: invoice number, sent-at date, payment deadline, payment method
  - Party blocks: Bill To, Ship To
  - Item table: one row per item, each with the item title and its Winning
    Bid, Buyer's Premium and Total, closed by an Item Total row that totals
    each column, then the charges given, an optional supplied Tax line, and a
    boxed Subtotal/Payment Processing Fee/Order Total summary; one item reads
    as one row
  - Bank details: every enabled SWIFT, FPS and HK local transfer rail plus the
    bank reference, a full-width section below the order-value summary, shown
    only on a bank-transfer invoice
  - Issuer block: the issuer's name and email, right-aligned at the foot of
    the sheet
  - Replacement relationship: on a replacement invoice, the supplied prior
    invoice ID appears as `Replaces invoice {id}`, plain text with no link to
    the prior PDF
- ReceiptPdf export
  - Title and issuer mark, matching InvoicePdf's
  - Meta rows: receipt number, the invoice number it pays, date paid,
    payment method, payment reference
  - Party blocks: Bill To, Ship To, matching InvoicePdf's
  - The same item table as InvoicePdf
  - A transfer-reference line, shown only when the payment carries one
  - Payment breakdown: Original Invoice Total, Previous Payments, Current
    Payment Received, Remaining Balance Due, in that fixed order, always
    rendered
  - Issuer block, matching InvoicePdf's
- Party address fields
  - Bill To and Ship To each render as up to seven lines — recipient, company,
    phone, address line 1, address line 2, a combined city/region/postal-code line,
    and country — company, phone, address line 2 and state optional, each line withheld
    rather than blank when not given, and the whole block reading
    "Not recorded" when no address is given at all
- Document shape
  - Each renderer returns A4 pages (595.28×841.89pt): one page when the item
    table, the summary and the rest of the document fit it, and further pages
    when they do not
  - A table that continues on a further page repeats its column header there,
    never splits an item row across two pages, and keeps the Item Total row
    with the summary, and a receipt's payment breakdown lines whole
  - The issuer block sits at the foot of the last page
- Presentation-only contract
  - Every amount arrives as a preformatted string; neither renderer
    computes, sums or reformats a value
  - Every date arrives as a `Date`; the renderer formats that instant once in
    `Asia/Hong_Kong` and labels it `GMT+8`
  - Every label arrives through a `copy` argument; neither renderer imports
    `@grade10/i18n` or hardcodes a label
- Reserved extension slots
  - Retired (`decisions.md` Q19): the manually-settled mark and Superseded
    invoice under InvoicePdf/ReceiptPdf export above — carried no further
    until a concrete requirement resurfaces one. Bank rails, also retired
    under Q19, resurfaced with a concrete requirement and rejoins
    InvoicePdf export above (`decisions.md` Q22), structured rather than
    restored to its pre-retirement opaque shape
  - Retired (`decisions.md` Q19): the manually-settled mark, Superseded
    invoice, and issuer tax details under InvoicePdf/ReceiptPdf export above
    — carried no further until a concrete requirement resurfaces one. Bank
    rails, also retired under Q19, resurfaced with a concrete requirement and
    rejoins InvoicePdf export above (`decisions.md` Q22), structured rather
    than restored to its pre-retirement opaque shape

## ADDED Requirements

### Requirement: InvoicePdf renders its meta rows and party blocks

InvoicePdf's meta rows and party blocks name the invoice, when it was sent,
how it is to be paid, and who it bills and ships to.

**Meta rows** — InvoicePdf SHALL render the invoice number, sent-at date,
payment deadline, and payment method for every invoice, each as its own row.
**Position** — The payment method row SHALL render last, after payment
deadline, never reordering the invoice number, sent-at date, and payment
deadline rows before it. **Party blocks** — InvoicePdf SHALL render Bill To
and Ship To for every invoice, each rendering only its own supplied content.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-a9o rev=2 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-1 - An invoice's meta rows and party blocks all render

**Serves:** InvoicePdf export - the invoice's meta rows all render

- **GIVEN** data for an invoice number, sent-at date, payment deadline,
  payment method, issuer, Bill To, and Ship To
- **WHEN** InvoicePdf renders it
- **THEN** the returned PDF's first page shows every meta row and party block
  given

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-g9l rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-46 - The payment method row appends after payment deadline, never reordering the rows before it

**Serves:** InvoicePdf export - the invoice's meta rows all render

- **GIVEN** distinct, recognizable values for invoice number, sent-at date,
  payment deadline, and payment method
- **WHEN** InvoicePdf renders them
- **THEN** the four meta rows read top to bottom as invoice number, sent-at
  date, payment deadline, then payment method
- **AND** the three original rows keep the order they already had

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-kto rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-19 - Bill To and Ship To never echo each other

**Serves:** InvoicePdf export - Bill To and Ship To each render only their own content

- **GIVEN** a Bill To naming one recipient and a Ship To naming a different
  recipient
- **WHEN** InvoicePdf renders them
- **THEN** Bill To shows its own supplied content
- **AND** Ship To shows its own, distinct, supplied content

### Requirement: Bill To and Ship To render as an address, or "Not recorded" when withheld

Bill To and Ship To each carry a recipient, an optional company, an optional
phone, a street address, an optional locality line, and a country — the same seven-line shape
`addressLines` already draws — or the single line "Not recorded" when no
address is given at all, rather than a block of blank rows.

**Given an address** — InvoicePdf and ReceiptPdf SHALL render recipient,
address line 1, the combined city/region/postal-code line, and country for
every Bill To and every Ship To given as an address. **Company** — InvoicePdf
and ReceiptPdf SHALL render the company line only when given. **Address line
2** — InvoicePdf and ReceiptPdf SHALL render address line 2 only when given.
**Phone** — InvoicePdf and ReceiptPdf SHALL render the phone line when given
and omit it when not given.
**No address given** — InvoicePdf and ReceiptPdf SHALL render the single line
"Not recorded" in place of Bill To or Ship To when no address is given for
it, never a block of blank lines.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-q1g rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-31 - A company address renders every line it is given

**Serves:** Party address fields - every address line renders when supplied

- **GIVEN** a Bill To with a recipient, company, phone, address line 1,
  address line 2, city, region, postal code, and country
- **WHEN** InvoicePdf renders it
- **THEN** every one of those lines is shown

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-1fi rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-32 - A personal address omits the company line

**Serves:** Party address fields - omitted optional lines leave no blank rows

- **GIVEN** a Ship To with no company, phone, or address line 2
- **WHEN** InvoicePdf renders it
- **THEN** no company, phone, or address-line-2 line appears
- **AND** recipient, address line 1, the city/region/postal-code line, and
  country still render

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-jp5 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-33 - No address given renders "Not recorded"

**Serves:** Party address fields - a withheld address renders one line, not a blank block

- **GIVEN** a ReceiptPdf given no address for Ship To
- **WHEN** it renders
- **THEN** the Ship To block shows the single line "Not recorded"
- **AND** no blank address lines appear in its place

### Requirement: InvoicePdf renders a supplied replacement relationship

When an invoice replaces an earlier invoice, `InvoicePdfData` SHALL accept a
`replacesInvoice` value containing the replaced invoice ID. InvoicePdf SHALL
render `Replaces invoice {invoice ID}` as plain text, with no link to the
replaced invoice's PDF. When the relationship is absent, InvoicePdf SHALL
render no replacement row. The relationship does not make the replaced invoice
the current payable invoice.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-9et rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-51 - A replacement invoice names the invoice it replaces

**Serves:** InvoicePdf export - a replacement document retains its prior invoice reference

- **GIVEN** an InvoicePdfData value whose `replacesInvoice` names `IN-LK42301`
- **WHEN** InvoicePdf renders it
- **THEN** the PDF shows `Replaces invoice IN-LK42301`

### Requirement: InvoicePdf and ReceiptPdf render the issuer block at the foot of the sheet, right-aligned

The issuer names who sent the document - not a party the consumer addresses,
so it reads apart from Bill To and Ship To, at the foot of the last page,
right-aligned, following every other section.

**Given** - InvoicePdf and ReceiptPdf SHALL render the issuer's name and
email for every document. **Position** - The issuer block SHALL follow every
other section, SHALL align to the right of the sheet, and SHALL sit at the foot
of the last page of the document. It SHALL be pinned to the bottom edge of that
page, in the same place on every document, wherever the content above it ends.
**Room** - The last page SHALL keep the space the issuer block occupies clear of
every other line, so the block never stands alone on a page of its own.
**Last page only** - InvoicePdf and ReceiptPdf SHALL NOT render the issuer block
on any earlier page of a document of several pages. **Emphasis** - The issuer's
name SHALL render more heavily weighted than its email.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-lrt rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-39 - The issuer block sits at the foot of the invoice, right-aligned

**Serves:** InvoicePdf export - the issuer block renders at the foot of the sheet, right-aligned

- **GIVEN** an issuer name and email
- **WHEN** InvoicePdf renders them
- **THEN** the issuer's name and email both show, name above email
- **AND** the block sits at the bottom of the sheet, right-aligned

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-qqd rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-40 - The issuer block sits at the foot of the receipt, right-aligned

**Serves:** ReceiptPdf export - the issuer block renders at the foot of the sheet, right-aligned

- **GIVEN** an issuer name and email
- **WHEN** ReceiptPdf renders them
- **THEN** the issuer's name and email both show, name above email
- **AND** the block sits at the bottom of the sheet, right-aligned

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-dqr rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-66 - A long document carries the issuer block on its last page only

**Serves:** InvoicePdf export - a long document names its issuer once, at the end

- **GIVEN** an invoice and a receipt, each with 30 items, and an invoice and a
  receipt, each with one item, all with the issuer name `Issuer Co` and the issuer email `support@grade10.com`
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** the last page of each 30-item document shows the issuer's email at
  the foot of the page, right-aligned, with the issuer's name on the line
  directly above it
- **AND** the issuer's email and the name line above it sit at the same x and y
  on that page as on the one-item document of the same kind
- **AND** no earlier page of either 30-item document shows the issuer's email

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-l01 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-76 - The issuer block never takes a page of its own

**Serves:** InvoicePdf export - the issuer block shares its page with the end of the document

- **GIVEN** invoices without bank details and receipts, each with 1 to 40 items,
  each title on one line, the charges Shipping & Handling `HKD 80.00` and
  Insurance `HKD 40.00`, a boxed summary and the issuer email
  `support@grade10.com`
- **WHEN** InvoicePdf and ReceiptPdf render each of them
- **THEN** in every invoice, the page that shows the issuer's email also shows
  the boxed summary, and in every receipt it also shows the four payment
  breakdown lines
- **AND** on that page no line of another section is drawn at or below the name
  line of the issuer block, the line directly above the issuer's email
- **AND** at least one invoice and at least one receipt in the range run onto a
  second page

### Requirement: InvoicePdf and ReceiptPdf render their charges in the order given, ending in a boxed summary

The charges under the item table add what the document charges beyond its
items. Subtotal, Payment Processing Fee, and Order Total are pulled out of the
flat charge list into their own boxed, right-aligned summary regardless of
where the caller placed them in the list; every other charge renders below the
Item Total row and above the summary, in the order the caller gave.

**Order** - InvoicePdf and ReceiptPdf SHALL render every charge that is not
Subtotal, Payment Processing Fee, or Order Total below the Item Total row, in
the order the caller supplied it. **Summary** - InvoicePdf and ReceiptPdf SHALL
render Subtotal and Payment Processing Fee inside a boxed summary below the
other charges, and SHALL render Order Total inside that same summary, set off
by a rule and rendered more heavily weighted than every other line.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-63o rev=2 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-3 - Charges render in the order given, with the summary boxed below them

**Serves:** InvoicePdf export - charges render in the order given, ending in a boxed summary

- **GIVEN** one item and, under it, the charges Shipping & Handling
  `HKD 80.00` and Insurance `HKD 40.00`, followed by Subtotal, Payment
  Processing Fee, and Order Total
- **WHEN** InvoicePdf renders them
- **THEN** the Item Total row comes first, and the two charges appear below it,
  in the order given
- **AND** Subtotal, Payment Processing Fee, and Order Total appear together
  in a boxed summary below them, Order Total set off by a rule

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-8b8 rev=2 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-4 - Omitting a charge does not disturb the others' order

**Serves:** InvoicePdf export - charges render in the order given, ending in a boxed summary

- **GIVEN** every charge from `shared-ui-invoice-and-receipt-pdf-SC-3` except
  Insurance
- **WHEN** InvoicePdf renders them
- **THEN** no Insurance line appears
- **AND** the Shipping & Handling line and the summary keep their given order
  below the Item Total row

### Requirement: InvoicePdf and ReceiptPdf render an optional supplied tax line

`taxLine` is an optional caller-supplied `PdfLineItem` on both data objects.
When present, the renderer SHALL insert it as a charge immediately before the
boxed Subtotal/Payment Processing Fee/Order Total summary. When omitted or
`null`, no Tax row SHALL render. The renderer does not compute, validate or
reformat the tax amount, and the tax line does not define a tax rate,
jurisdiction or formal tax receipt.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-i50 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-52 - A supplied tax line renders on both documents

**Serves:** InvoicePdf export - the optional tax line renders when supplied

- **GIVEN** an invoice and receipt with `taxLine` supplied as a `PdfLineItem`
  labelled `Tax` and an amount of `HKD 12.00`
- **WHEN** InvoicePdf and ReceiptPdf render their data
- **THEN** each document shows the supplied Tax line immediately before the
  boxed summary
- **AND** each document shows the amount exactly as supplied

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-m09 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-53 - An omitted tax line does not render

**Serves:** InvoicePdf export - the optional tax line is omitted when not supplied

- **GIVEN** an invoice and receipt with `taxLine` omitted or set to `null`
- **WHEN** InvoicePdf and ReceiptPdf render their data
- **THEN** neither document shows a Tax line
- **AND** the other charges and boxed summary retain their order

### Requirement: InvoicePdf and ReceiptPdf list the order's items as rows of one table

Both documents list the order's items in one table. A column header heads it,
one row per item follows, and an Item Total row closes it. A document with one
item draws the same table with one row.

**Header** - InvoicePdf and ReceiptPdf SHALL render a header row reading
`copy.itemLabel`, `copy.winningBidLabel`, `copy.buyersPremiumLabel` and
`copy.totalLabel`, followed by a divider, above the first item row.
**Rows** - InvoicePdf and ReceiptPdf SHALL render one row for every item given,
in the order given, each showing the item's title and its Winning Bid, Buyer's
Premium and Total under those headings, whether the document has one item or
many. **Long title** - An item title wider than the Item column SHALL wrap onto
further lines inside that column, and the row's three amounts SHALL sit beside
the first line of the title. A word wider than the column SHALL break inside the
word, so a title with no spaces stays inside the column as well. **Amount
columns** - The Winning Bid, Buyer's Premium and Total columns SHALL each be as
wide as the widest of their heading and their amounts, so no amount wraps,
shrinks or overflows into the column beside it. **Item Total** - InvoicePdf and
ReceiptPdf SHALL close the item rows with one Item Total row, reading
`copy.itemTotalLabel` and the three Item Total amounts under the Winning Bid,
Buyer's Premium and Total columns, on every document including one with a single
item. **No lot heading** - InvoicePdf and ReceiptPdf SHALL NOT render the lot
title as a heading above the table, and SHALL NOT render a Description or Amount
header.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-cnj rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-56 - One item draws one row and its Item Total

**Serves:** InvoicePdf export - an invoice for a single lot reads as a table of one row

- **GIVEN** an invoice with one item titled `2024 TOPPS 50/50 SHOHEI OHTANI #74
  SHOHEI OHTANI SSP PSA-10`, Winning Bid `HKD 2500.00`, Buyer's Premium
  `HKD 500.00` and Total `HKD 3000.00`, and an Item Total of the same three
  amounts, with `copy` labels Item, Winning Bid, Buyer's Premium, Total and
  Item Total
- **WHEN** InvoicePdf renders it
- **THEN** a header row reads Item, Winning Bid, Buyer's Premium and Total from
  left to right, with a divider under it
- **AND** one row below it shows the title with `HKD 2500.00`, `HKD 500.00` and
  `HKD 3000.00` under those columns
- **AND** an Item Total row below that shows `HKD 2500.00`, `HKD 500.00` and
  `HKD 3000.00` under the same columns
- **AND** no lot title heading and no Description or Amount header is drawn

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-lyl rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-57 - Several items draw one row each, in the order given

**Serves:** InvoicePdf export - a document for several items reads as one table

- **GIVEN** an invoice and a receipt, each with three items titled `Lot A`,
  `Lot B` and `Lot C`, with Winning Bids `HKD 100.00`, `HKD 200.00` and
  `HKD 300.00`, Buyer's Premiums `HKD 20.00`, `HKD 40.00` and `HKD 60.00`,
  Totals `HKD 120.00`, `HKD 240.00` and `HKD 360.00`, and an Item Total of
  `HKD 600.00`, `HKD 120.00` and `HKD 720.00`
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** in each document the rows read `Lot A`, `Lot B` and `Lot C` from top
  to bottom, each with its own three amounts on its line
- **AND** in each document the Item Total row follows `Lot C` and shows
  `HKD 600.00`, `HKD 120.00` and `HKD 720.00`

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-kkz rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-58 - A long item title wraps inside its column

**Serves:** InvoicePdf export - a long lot title stays readable in its row

- **GIVEN** two items, the first titled `2024 TOPPS 50/50 SHOHEI OHTANI #74
  SHOHEI OHTANI SSP PSA-10 BLACK LABEL AUTOGRAPHED SERIAL NUMBERED TO TEN` and
  the second titled `Lot B`, each with its three amounts
- **WHEN** InvoicePdf renders them
- **THEN** the first title is drawn on more than one line, and every line stops
  short of the Winning Bid column
- **AND** the first item's three amounts are drawn once, on the title's first
  line
- **AND** `Lot B` starts below the last line of the first title

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-cuo rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-59 - A word wider than the Item column breaks inside the word

**Serves:** InvoicePdf export - a lot title with a very long word, or with no spaces at all such as a Chinese title, stays inside its row

- **GIVEN** two items, the first titled
  `ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ`,
  which has no space, and the second titled
  `Serial ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ PSA-10`,
  each with its three amounts
- **WHEN** InvoicePdf renders them
- **THEN** each title is drawn on more than one line, and every line stops short
  of the Winning Bid column
- **AND** each item's three amounts are drawn once, on the first line of its
  title
- **AND** the second title's first line starts with `Serial` and its last line
  ends with `PSA-10`

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-2s4 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-60 - A receipt draws the same item table above its payment breakdown

**Serves:** ReceiptPdf export - a receipt reads as its items, its charges and what was paid

- **GIVEN** a receipt with one item titled `Lot A`, Winning Bid `HKD 100.00`,
  Buyer's Premium `HKD 20.00` and Total `HKD 120.00`, an Item Total of the same
  three amounts, the charge Shipping & Handling `HKD 80.00`, a boxed summary,
  and the four payment breakdown lines
- **WHEN** ReceiptPdf renders it
- **THEN** from top to bottom it shows the column header, the `Lot A` row, the
  Item Total row, the Shipping & Handling line, the boxed summary, and then the
  four payment breakdown lines

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-fp9 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-72 - A wide amount widens its column and still draws whole

**Serves:** InvoicePdf export - a large amount reads whole in its column

- **GIVEN** an invoice and a receipt, each with two items: `Lot A` with Winning
  Bid `HKD 12,345,678.00`, Buyer's Premium `HKD 2,469,135.60` and Total
  `HKD 14,814,813.60`, and `Lot B` with Winning Bid `HKD 100.00`, Buyer's
  Premium `HKD 20.00` and Total `HKD 120.00`, and an Item Total of
  `HKD 12,345,778.00`, `HKD 2,469,155.60` and `HKD 14,814,933.60`
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** every amount of each table is drawn whole on one line, in the same
  size as the other amounts of that table
- **AND** no amount overlaps another amount or the title beside it
- **AND** the amounts of each column, the Item Total row included, end at one
  right edge

### Requirement: InvoicePdf renders bank details only on a bank-transfer invoice

Grade10 settles a bank-transfer order by wire, while a card order needs no
transfer instructions.

**Given** — InvoicePdf SHALL render a full-width "Bank details" section below
the Subtotal/Payment Processing Fee/Order Total summary when the consumer
supplies `bankRails`. **Withheld** — InvoicePdf SHALL render no such section,
and SHALL reserve no vertical space for it, when `bankRails` is omitted.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-cys rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-47 - A bank-transfer invoice shows its bank details below Order Total

**Serves:** InvoicePdf export - the Bank details section renders where the invoice carries bank rails

- **GIVEN** an InvoicePdfData with `bankRails` supplied
- **WHEN** InvoicePdf renders it
- **THEN** a "Bank details" section appears full width, positioned below the
  order-value summary
- **AND** every other meta row, party block, and the item table with its charges still
  renders

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-14c rev=2 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-48 - A card invoice shows no bank details section, and no gap where it would sit

**Serves:** InvoicePdf export - the Bank details section renders where the invoice carries bank rails

- **GIVEN** an InvoicePdfData with no `bankRails`
- **WHEN** InvoicePdf renders it
- **THEN** no "Bank details" section appears
- **AND** the issuer block sits at the foot of the page, where it sits on every
  invoice, with no blank Bank details section left above it
- **AND** every other meta row, party block, and the item table with its charges still
  renders

### Requirement: InvoicePdf's bank details section names every enabled transfer rail and the bank reference

A winner may quote every enabled SWIFT, FPS, or HK local transfer rail, so the
section gives each supplied rail plus the reference to write on the transfer.

**Given** — InvoicePdf SHALL render, within the Bank details section, every
enabled rail supplied by `bankRails`, with its own headed stacked label/value
lines, and SHALL omit disabled or retired rails. **Reference** — InvoicePdf
SHALL follow the enabled rails with a divider and one line naming
`bankRails.reference`, rendered more heavily weighted than the rest of that
line.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-tt8 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-49 - Bank details lists every enabled rail under its own heading

**Serves:** InvoicePdf export - the Bank details section names every enabled transfer rail

- **GIVEN** a `bankRails` value with `swift` and `fps` enabled and no HK local
  transfer rail
- **WHEN** InvoicePdf renders the Bank details section
- **THEN** a SWIFT rail shows Beneficiary, SWIFT/BIC, and Account/IBAN
- **AND** an FPS rail shows FPS ID and Beneficiary
- **AND** no HK local transfer rail appears

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-xeu rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-50 - Bank details' reference note bolds the quoted reference

**Serves:** InvoicePdf export - the Bank details section names every enabled transfer rail

- **GIVEN** a `bankRails` value with `reference` set to a distinct value
- **WHEN** InvoicePdf renders the Bank details section
- **THEN** a line below the enabled rails' divider names the reference
- **AND** only the reference's own text renders more heavily weighted; the
  rest of the line renders at normal weight

### Requirement: ReceiptPdf renders its meta rows and party blocks

ReceiptPdf's meta rows and party blocks name the receipt, the invoice it
pays, how it was paid, and who it bills and ships to.

**Meta rows** — ReceiptPdf SHALL render the receipt number, the invoice
number it pays, the date paid, and the payment method for every receipt,
each as its own row. **Party blocks** — ReceiptPdf SHALL render Bill To and
Ship To for every receipt, each rendering only its own supplied content.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-rzk rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-7 - A receipt's meta rows and party blocks all render

**Serves:** ReceiptPdf export - the receipt's meta rows and party blocks all render

- **GIVEN** a receipt number, the invoice number it pays, a date paid, a
  payment method, Bill To, and Ship To
- **WHEN** ReceiptPdf renders them
- **THEN** every meta row and party block given is shown

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-4tl rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-20 - Receipt number and the invoice number it pays never conflate

**Serves:** ReceiptPdf export - the receipt number and the invoice number it pays render as distinct rows

- **GIVEN** a receipt number and a different invoice number
- **WHEN** ReceiptPdf renders them
- **THEN** the receipt-number row shows its own content
- **AND** the invoice-number row shows its own, distinct, content

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-f0x rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-29 - A receipt's Bill To and Ship To never echo each other

**Serves:** ReceiptPdf export - Bill To and Ship To each render only their own content

- **GIVEN** a Bill To naming one recipient and a Ship To naming a different
  recipient
- **WHEN** ReceiptPdf renders them
- **THEN** Bill To shows its own supplied content
- **AND** Ship To shows its own, distinct, supplied content

### Requirement: ReceiptPdf renders a recorded provider-reference line only when the payment carries one

A bank-transfer payment may carry the provider reference recorded with that
payment; a card payment does not. This is the recorded payment fact, not the
invoice's bank-payment instruction reference.

**Given** — ReceiptPdf SHALL render a "Payment" section naming the recorded
provider reference when the consumer supplies one. **Withheld** — ReceiptPdf
SHALL render no such section when no provider reference is supplied.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-zks rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-41 - A bank-transfer receipt names its recorded provider reference

**Serves:** ReceiptPdf export - the provider-reference line renders where the payment carries one

- **GIVEN** a recorded provider reference
- **WHEN** ReceiptPdf renders it
- **THEN** the Payment section shows the reference given

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-27a rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-42 - A card-paid receipt shows no provider-reference line

**Serves:** ReceiptPdf export - the provider-reference line renders where the payment carries one

- **GIVEN** no recorded provider reference
- **WHEN** ReceiptPdf renders it
- **THEN** no Payment section appears
- **AND** every other meta row and party block still renders

### Requirement: ReceiptPdf renders the payment breakdown in a fixed order

The payment breakdown tells the winner what the invoice totalled, what it
already carried, what this payment settled, and what is left, on every
receipt.

**Fixed order** — ReceiptPdf SHALL render Original Invoice Total, Previous
Payments, Current Payment Received, and Remaining Balance Due, in that
order. **Always rendered** — ReceiptPdf SHALL render all four lines on every
receipt; none is conditional on being given.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-5lf rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-8 - The payment breakdown renders in one fixed order

**Serves:** ReceiptPdf export - the payment breakdown renders in its fixed order

- **GIVEN** values for Original Invoice Total, Previous Payments, Current
  Payment Received, and Remaining Balance Due
- **WHEN** ReceiptPdf renders them
- **THEN** the four lines appear in that order

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-03g rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-22 - The payment breakdown keeps all four lines when two read zero

**Serves:** ReceiptPdf export - none of the four payment-breakdown lines is conditional on its value

- **GIVEN** a single full payment, where Previous Payments and Remaining
  Balance Due are each a zero-reading string
- **WHEN** ReceiptPdf renders it
- **THEN** all four payment-breakdown lines still appear, in their fixed
  order
- **AND** none is dropped for reading zero

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
Premium. **No label lookup** - InvoicePdf and ReceiptPdf SHALL render every
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

### Requirement: InvoicePdf and ReceiptPdf continue a long item table on further pages

A table too long for one page runs on to the next page. Item rows move whole,
the totals move together, the sections after the table move whole, and every
page keeps its columns labelled.

**Continuation** - When the item rows do not fit on the page the table starts
on, InvoicePdf and ReceiptPdf SHALL continue the table on the next page, in the
order given, and SHALL repeat the column header, with its divider, above the
first row there. **Continuation page** - A continuation page SHALL NOT repeat
the document title, the issuer mark, the meta rows or the Bill To and Ship To
blocks, and no page of the document SHALL carry a page number or a continuation
note. **Whole
rows** - InvoicePdf and ReceiptPdf SHALL NOT split an item row across two pages.
A row that does not fit below the row before it SHALL move whole to the next
page. **Item Total and summary** - InvoicePdf and ReceiptPdf SHALL draw the Item
Total row, the charges under it, the optional Tax line and the boxed summary on
one page. When they do not fit below the last item row, they SHALL all move to
the next page together, under the repeated column header, with no item row moved
over with them. **Bank details** - InvoicePdf SHALL draw the Bank details section
on one page. When it does not fit below the boxed summary, it SHALL move to the
next page whole. **Payment section** - ReceiptPdf SHALL draw its Payment section
on one page. When it does not fit below the boxed summary, it SHALL move to the
next page whole. **Payment breakdown** - ReceiptPdf SHALL draw its four payment
breakdown lines on one page. When they do not fit below the boxed summary, they
SHALL all move to the next page together.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-8hh rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-62 - A long table continues on the next page under the repeated column header

**Serves:** InvoicePdf export - a winner reads a long item table across pages with its columns still labelled

- **GIVEN** an invoice and a receipt, each with 30 items titled `Lot 01` to
  `Lot 30` in that order, every title short enough for one line
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** each document has more than one page, and every page is sized
  595.28×841.89pt
- **AND** the second page opens with the column header reading Item, Winning
  Bid, Buyer's Premium and Total, with a divider under it, followed by the next
  item row in the order given
- **AND** `Lot 01` to `Lot 30` each appear exactly once, in that order from the
  first page to the last

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-l3a rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-73 - A continuation page repeats the column header and nothing else

**Serves:** InvoicePdf export - a continuation page carries the table, not the head of the document

- **GIVEN** an invoice numbered `IN-LK42301` and a receipt numbered
  `RC-CN8HK01P1`, each with the Bill To and Ship To recipient `Chan Tai Man` and
  100 items titled `Lot 001` to `Lot 100`, so each runs to at least three pages,
  in two versions: one with the issuer name `Grade10`, which has a wordmark on
  file, so its wordmark is drawn at the top right of the first page, and one
  with the issuer name `Issuer Co`, which has none, so its name is drawn as text
  at the top right of the first page
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** the second and third page of each of the four documents show the
  column header and item rows
- **AND** no text is drawn above the column header on the second or the third
  page of any of them, so those pages show no document title, no meta row and no
  Bill To or Ship To heading, and the name `Issuer Co` is not drawn above the
  column header on any page after the first
- **AND** the `Grade10` wordmark is drawn on the first page of its two
  documents and on no other page
- **AND** the second and third page of each show neither the document number nor
  `Chan Tai Man`
- **AND** no page of either document shows a page number or a continuation note

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-2rk rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-63 - No item row splits across two pages

**Serves:** InvoicePdf export - a lot's title and amounts are never cut by a page edge

- **GIVEN** invoices and receipts with 1, 2, 3 and so on up to 20 items, each
  titled with text long enough to wrap onto three lines
- **WHEN** InvoicePdf and ReceiptPdf render each of them
- **THEN** in every document, each item's three title lines and its three
  amounts are drawn on one page
- **AND** at least one invoice and at least one receipt in the range run onto a
  second page

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-r2w rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-64 - The Item Total row, the charges and the summary move to the next page together

**Serves:** InvoicePdf export - a winner never reads an Item Total apart from the summary it leads to

- **GIVEN** invoices and receipts with 1 to 40 items, each title on one line,
  the charges Shipping & Handling `HKD 80.00` and Insurance `HKD 40.00`, a
  supplied Tax line `HKD 12.00`, and a boxed summary
- **WHEN** InvoicePdf and ReceiptPdf render each of them
- **THEN** in every document, the Item Total row, both charges, the Tax line and
  the boxed summary are drawn on one page
- **AND** in at least one invoice and at least one receipt that page is the
  second page while the last item row is on the first, and the second page opens
  with the column header followed by the Item Total row, with no item row between
  them

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-hnn rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-74 - Bank details move to the next page whole

**Serves:** InvoicePdf export - a winner never reads bank details cut by a page edge

- **GIVEN** invoices with 1 to 40 items, each title on one line, a boxed
  summary, and bank details with SWIFT, FPS and HK local transfer rails and a
  reference
- **WHEN** InvoicePdf renders each of them
- **THEN** in every invoice, the Bank details heading, all three rails and the
  reference note are drawn on one page
- **AND** in at least one invoice the boxed summary is on one page and the Bank
  details section is on the next

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-y2j rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-75 - A receipt's Payment section moves to the next page whole

**Serves:** ReceiptPdf export - a winner never reads the transfer reference cut by a page edge

- **GIVEN** receipts with 1 to 40 items, each title on one line, a boxed summary,
  and the transfer reference `TRF-7731`
- **WHEN** ReceiptPdf renders each of them
- **THEN** in every receipt, the Payment heading, the transfer reference label
  and `TRF-7731` are drawn on one page
- **AND** in at least one receipt the boxed summary is on one page and the
  Payment section is on the next

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-huz rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-65 - A receipt's four payment breakdown lines move to the next page together

**Serves:** ReceiptPdf export - a winner never reads a payment breakdown cut by a page edge

- **GIVEN** receipts with 1 to 40 items, each title on one line
- **WHEN** ReceiptPdf renders each of them
- **THEN** in every receipt, the four payment breakdown lines are drawn on one
  page, in their fixed order
- **AND** in at least one receipt the boxed summary is on the first page and the
  four lines are on the second

### Requirement: InvoicePdf and ReceiptPdf refuse to render a document they cannot draw whole

A document the renderer cannot draw whole is a fault the caller should hear
about. The call rejects with an error and returns no PDF, rather than a table
with nothing in it, a title drawn as blanks, or an amount that is cut or
shrunk. A caller may supply an embedded font; without one the document draws in
the standard font.

**No items** - InvoicePdf and ReceiptPdf SHALL reject a document given an empty
item list, and the error SHALL say that no items were given. **Undrawable
title** - When no embedded font is supplied, InvoicePdf and ReceiptPdf SHALL
reject a document whose item title holds a character the standard font cannot
draw, and SHALL NOT draw a placeholder in its place. **Cannot fit** - InvoicePdf
and ReceiptPdf SHALL reject a document in which one item row is taller than the
room a page leaves above the issuer block, in which the Item Total row with the
charges and the boxed summary are taller than that room, or in which the three
amount columns leave the Item column too narrow to draw a title. The error SHALL name
which of the three does not fit.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-m0w rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-69 - A document with no items fails to render

**Serves:** InvoicePdf export - an order with nothing to bill is refused, not drawn as an empty table

- **GIVEN** the data of an invoice and of a receipt, each complete except that
  its item list is empty
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** each call rejects with an error and returns no PDF
- **AND** each error says that no items were given

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-5rh rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-70 - A title the standard font cannot draw fails to render without an embedded font

**Serves:** InvoicePdf export - a title in characters the font lacks is refused, not drawn as blanks or boxes

- **GIVEN** the data of an invoice and of a receipt, each with one item titled
  `中8號`, and no embedded font supplied
- **WHEN** InvoicePdf and ReceiptPdf render them
- **THEN** each call rejects with an error and returns no PDF
- **AND** no placeholder glyph is drawn in place of `中` or `號`

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-ae9 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-71 - A document whose rows or amounts cannot fit a page fails to render

**Serves:** InvoicePdf export - a table that cannot be drawn whole is refused, not cut, split or shrunk

- **GIVEN** data for an invoice and for a receipt in three versions, each
  otherwise complete: the first has one item whose three amounts are each a
  string of 60 characters (`HKD ` and 56 digits), the second has one item whose
  title is the word `lot` repeated 2,500 times with a space between, and the
  third has 120 charges between the Item Total row and the boxed summary
- **WHEN** InvoicePdf and ReceiptPdf render each of them
- **THEN** each call rejects with an error and returns no PDF
- **AND** the errors say, in that order, that the amounts, the item row and the
  Item Total row with its charges do not fit

### Requirement: Each renderer produces A4 pages, one page when the content fits

`InvoicePdf` and `ReceiptPdf` each return the bytes of one complete PDF
document made of A4 pages. A document whose content fits one page is one page.

**Page size** - InvoicePdf and ReceiptPdf SHALL each return PDF bytes in which
every page is sized 595.28×841.89pt (A4). **One page when it fits** -
InvoicePdf and ReceiptPdf SHALL each return exactly one page when the item
table, the summary and every other section fit it.

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-oq2 rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-67 - An invoice that fits is one A4 page

**Serves:** Document shape - an ordinary single-lot invoice stays on one sheet

- **GIVEN** invoice data with one item, the charges Shipping & Handling and
  Insurance, a boxed summary, a Bill To and a Ship To of recipient, address
  line 1, city line and country each, and `bankRails` with SWIFT, FPS and HK
  local transfer
- **WHEN** InvoicePdf renders it
- **THEN** the returned bytes parse as a PDF document with exactly one page
- **AND** that page is sized 595.28×841.89pt

<!-- trace:scenario id=g10.shared-invoice-and-receipt-pdf.SC-wyw rev=1 -->
#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-68 - A receipt that fits is one A4 page

**Serves:** Document shape - an ordinary single-lot receipt stays on one sheet

- **GIVEN** receipt data with one item, the charge Shipping & Handling, a boxed
  summary, a transfer reference, the four payment breakdown lines, and a Bill To
  and a Ship To of recipient, address line 1, city line and country each
- **WHEN** ReceiptPdf renders it
- **THEN** the returned bytes parse as a PDF document with exactly one page
- **AND** that page is sized 595.28×841.89pt

## REMOVED Requirements

### Requirement: The lot and charges carry a Description/Amount header

**Reason**: The item table replaces the lot title and the Description and
Amount header (`decisions.md` Q31-Q33). The table's own header names its
columns.

**Migration**: Scenarios shared-ui-invoice-and-receipt-pdf-SC-37 and
shared-ui-invoice-and-receipt-pdf-SC-38 retire with it and are never reissued.
`shared-ui-invoice-and-receipt-pdf-SC-56` and
`shared-ui-invoice-and-receipt-pdf-SC-60` state the header the item table draws
on an invoice and on a receipt.

### Requirement: Each renderer produces one A4 document

**Reason**: A table too long for one page now continues on further pages
(`decisions.md` Q34), so exactly one page is no longer true of every document.

**Migration**: Scenarios shared-ui-invoice-and-receipt-pdf-SC-44 and
shared-ui-invoice-and-receipt-pdf-SC-45 retire with it and are never reissued.
`shared-ui-invoice-and-receipt-pdf-SC-67` and
`shared-ui-invoice-and-receipt-pdf-SC-68` state the one-page case, and
`shared-ui-invoice-and-receipt-pdf-SC-62` states the page size of a longer
document.
