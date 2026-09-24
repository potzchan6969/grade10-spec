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

## Feature set

- InvoicePdf export
  - Title and issuer mark: "Invoice" at the top left, the issuer's wordmark —
    or its name as text, when no mark is on file — at the top right
  - Meta rows: invoice number, sent-at date, payment deadline, payment method
  - Party blocks: Bill To, Ship To
  - Lot and charges: a Description/Amount table headed by the lot title, the
    charges given, and a boxed Subtotal/Payment Processing Fee/Order Total
    summary
  - Issuer block: the issuer's name and email, right-aligned at the foot of
    the sheet
- ReceiptPdf export
  - Title and issuer mark, matching InvoicePdf's
  - Meta rows: receipt number, the invoice number it pays, date paid,
    payment method, payment reference
  - Party blocks: Bill To, Ship To, matching InvoicePdf's
  - The same lot-and-charges table as InvoicePdf
  - A transfer-reference line, shown only when the payment carries one
  - Payment breakdown: Original Invoice Total, Previous Payments, Current
    Payment Received, Remaining Balance Due, in that fixed order, always
    rendered
  - A footer line
  - Issuer block, matching InvoicePdf's
- Party address fields
  - Bill To and Ship To each render as up to six lines — recipient, company,
    address line 1, address line 2, a combined city/region/postal-code line,
    and country — every field optional except recipient, each line withheld
    rather than blank when not given, and the whole block reading
    "Not recorded" when no address is given at all
- Document shape
  - Each renderer returns exactly one A4 page (595.28×841.89pt)
- Presentation-only contract
  - Every amount arrives as a preformatted string; neither renderer
    computes, sums or reformats a value
  - Every date arrives as a `Date`; the renderer formats it once, fixed to
    Hong Kong time — the one value it formats itself, since every document
    is issued from Hong Kong regardless of storefront
  - Every label arrives through a `copy` argument; neither renderer imports
    `@grade10/i18n` or hardcodes a label
- Reserved extension slots
  - Retired (`decisions.md` Q19), along with bank rails and the
    manually-settled mark and Superseded invoice under InvoicePdf/ReceiptPdf
    export above — carried no further until a concrete requirement
    resurfaces one

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

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-1 - An invoice's meta rows and party blocks all render

**Serves:** InvoicePdf export - the invoice's meta rows all render

- **GIVEN** data for an invoice number, sent-at date, payment deadline,
  payment method, issuer, Bill To, and Ship To
- **WHEN** InvoicePdf renders it
- **THEN** the returned PDF's one page shows every meta row and party block
  given

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-46 - The payment method row appends after payment deadline, never reordering the rows before it

**Serves:** InvoicePdf export - the invoice's meta rows all render

- **GIVEN** distinct, recognizable values for invoice number, sent-at date,
  payment deadline, and payment method
- **WHEN** InvoicePdf renders them
- **THEN** the four meta rows read top to bottom as invoice number, sent-at
  date, payment deadline, then payment method
- **AND** the three original rows keep the order they already had

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-19 - Bill To and Ship To never echo each other

**Serves:** InvoicePdf export - Bill To and Ship To each render only their own content

- **GIVEN** a Bill To naming one recipient and a Ship To naming a different
  recipient
- **WHEN** InvoicePdf renders them
- **THEN** Bill To shows its own supplied content
- **AND** Ship To shows its own, distinct, supplied content

### Requirement: Bill To and Ship To render as an address, or "Not recorded" when withheld

Bill To and Ship To each carry a recipient, an optional company, a street
address, an optional locality line, and a country — the same six-line shape
`addressLines` already draws — or the single line "Not recorded" when no
address is given at all, rather than a block of blank rows.

**Given an address** — InvoicePdf and ReceiptPdf SHALL render recipient,
address line 1, the combined city/region/postal-code line, and country for
every Bill To and every Ship To given as an address. **Company** — InvoicePdf
and ReceiptPdf SHALL render the company line only when given. **Address line
2** — InvoicePdf and ReceiptPdf SHALL render address line 2 only when given.
**No address given** — InvoicePdf and ReceiptPdf SHALL render the single line
"Not recorded" in place of Bill To or Ship To when no address is given for
it, never a block of blank lines.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-31 - A company address renders every line it is given

**Serves:** Party address fields - every address line renders when supplied

- **GIVEN** a Bill To with a recipient, company, address line 1, address
  line 2, city, region, postal code, and country
- **WHEN** InvoicePdf renders it
- **THEN** every one of those lines is shown

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-32 - A personal address omits the company line

**Serves:** Party address fields - company and address line 2 are the only optional lines

- **GIVEN** a Ship To with no company and no address line 2
- **WHEN** InvoicePdf renders it
- **THEN** no company line and no address-line-2 line appear
- **AND** recipient, address line 1, the city/region/postal-code line, and
  country still render

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-33 - No address given renders "Not recorded"

**Serves:** Party address fields - a withheld address renders one line, not a blank block

- **GIVEN** a ReceiptPdf given no address for Ship To
- **WHEN** it renders
- **THEN** the Ship To block shows the single line "Not recorded"
- **AND** no blank address lines appear in its place

### Requirement: InvoicePdf and ReceiptPdf render the issuer block at the foot of the sheet, right-aligned

The issuer names who sent the document — not a party the consumer addresses,
so it reads apart from Bill To and Ship To, at the foot of the sheet,
right-aligned, following every other section.

**Given** — InvoicePdf and ReceiptPdf SHALL render the issuer's name and
email for every document. **Position** — The issuer block SHALL follow every
other section and SHALL align to the right of the sheet. **Emphasis** — The
issuer's name SHALL render more heavily weighted than its email.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-39 - The issuer block sits at the foot of the invoice, right-aligned

**Serves:** InvoicePdf export - the issuer block renders at the foot of the sheet, right-aligned

- **GIVEN** an issuer name and email
- **WHEN** InvoicePdf renders them
- **THEN** the issuer's name and email both show, name above email
- **AND** the block sits at the bottom of the sheet, right-aligned

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-40 - The issuer block sits at the foot of the receipt, right-aligned

**Serves:** ReceiptPdf export - the issuer block renders at the foot of the sheet, right-aligned

- **GIVEN** an issuer name and email
- **WHEN** ReceiptPdf renders them
- **THEN** the issuer's name and email both show, name above email
- **AND** the block sits at the bottom of the sheet, right-aligned

### Requirement: InvoicePdf and ReceiptPdf render their charges in the order given, ending in a boxed summary

The lot and its charges total what the document charges. Subtotal, Payment
Processing Fee, and Order Total are pulled out of the flat charge list into
their own boxed, right-aligned summary regardless of where the caller placed
them in the list; every other charge renders above it, in the order the
caller gave.

**Order** — InvoicePdf and ReceiptPdf SHALL render every charge that is not
Subtotal, Payment Processing Fee, or Order Total in the order the caller
supplied it. **Summary** — InvoicePdf and ReceiptPdf SHALL render Subtotal
and Payment Processing Fee inside a boxed summary below the other charges,
and SHALL render Order Total inside that same summary, set off by a rule and
rendered more heavily weighted than every other line.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-3 - Charges render in the order given, with the summary boxed below them

**Serves:** InvoicePdf export - charges render in the order given, ending in a boxed summary

- **GIVEN** the lot's charges — winning bid, buyer's premium, shipping &
  handling, insurance — followed by Subtotal, Payment Processing Fee, and
  Order Total
- **WHEN** InvoicePdf renders them
- **THEN** the four charges appear above the summary, in the order given
- **AND** Subtotal, Payment Processing Fee, and Order Total appear together
  in a boxed summary below them, Order Total set off by a rule

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-4 - Omitting a charge does not disturb the others' order

**Serves:** InvoicePdf export - charges render in the order given, ending in a boxed summary

- **GIVEN** every charge from `SC-3` except insurance
- **WHEN** InvoicePdf renders them
- **THEN** no insurance line appears
- **AND** the remaining charges and the summary keep their given order

### Requirement: The lot and charges carry a Description/Amount header

Both InvoicePdf and ReceiptPdf head the charges with a two-column table
header and a divider, directly above the lot title and the first charge.

**Header** — InvoicePdf and ReceiptPdf SHALL render a header row reading
`copy.descriptionLabel` and `copy.amountLabel`, followed by a divider,
immediately above the lot title.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-37 - The charges table header renders above the invoice's lot title

**Serves:** InvoicePdf export - charges render in the order given, ending in a boxed summary

- **GIVEN** a lot title and its charges
- **WHEN** InvoicePdf renders them
- **THEN** a header row shows `copy.descriptionLabel` and `copy.amountLabel`
- **AND** a divider separates the header from the lot title

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-38 - The charges table header renders above the receipt's lot title

**Serves:** ReceiptPdf export - the charges table renders the same shape as InvoicePdf's

- **GIVEN** a lot title and its charges
- **WHEN** ReceiptPdf renders them
- **THEN** a header row shows `copy.descriptionLabel` and `copy.amountLabel`
- **AND** a divider separates the header from the lot title

### Requirement: ReceiptPdf renders its meta rows and party blocks

ReceiptPdf's meta rows and party blocks name the receipt, the invoice it
pays, how it was paid, and who it bills and ships to.

**Meta rows** — ReceiptPdf SHALL render the receipt number, the invoice
number it pays, the date paid, and the payment method for every receipt,
each as its own row. **Party blocks** — ReceiptPdf SHALL render Bill To and
Ship To for every receipt, each rendering only its own supplied content.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-7 - A receipt's meta rows and party blocks all render

**Serves:** ReceiptPdf export - the receipt's meta rows and party blocks all render

- **GIVEN** a receipt number, the invoice number it pays, a date paid, a
  payment method, Bill To, and Ship To
- **WHEN** ReceiptPdf renders them
- **THEN** every meta row and party block given is shown

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-20 - Receipt number and the invoice number it pays never conflate

**Serves:** ReceiptPdf export - the receipt number and the invoice number it pays render as distinct rows

- **GIVEN** a receipt number and a different invoice number
- **WHEN** ReceiptPdf renders them
- **THEN** the receipt-number row shows its own content
- **AND** the invoice-number row shows its own, distinct, content

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-29 - A receipt's Bill To and Ship To never echo each other

**Serves:** ReceiptPdf export - Bill To and Ship To each render only their own content

- **GIVEN** a Bill To naming one recipient and a Ship To naming a different
  recipient
- **WHEN** ReceiptPdf renders them
- **THEN** Bill To shows its own supplied content
- **AND** Ship To shows its own, distinct, supplied content

### Requirement: ReceiptPdf renders a transfer-reference line only when the payment carries one

A bank-transfer payment carries a reference the winner quoted; a card payment
does not.

**Given** — ReceiptPdf SHALL render a "Payment" section naming the transfer
reference when the consumer supplies one. **Withheld** — ReceiptPdf SHALL
render no such section when no transfer reference is supplied.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-41 - A bank-transfer receipt names its transfer reference

**Serves:** ReceiptPdf export - the transfer-reference line renders where the payment carries one

- **GIVEN** a transfer reference
- **WHEN** ReceiptPdf renders it
- **THEN** the Payment section shows the reference given

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-42 - A card-paid receipt shows no transfer-reference line

**Serves:** ReceiptPdf export - the transfer-reference line renders where the payment carries one

- **GIVEN** no transfer reference
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

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-8 - The payment breakdown renders in one fixed order

**Serves:** ReceiptPdf export - the payment breakdown renders in its fixed order

- **GIVEN** values for Original Invoice Total, Previous Payments, Current
  Payment Received, and Remaining Balance Due
- **WHEN** ReceiptPdf renders them
- **THEN** the four lines appear in that order

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-22 - The payment breakdown keeps all four lines when two read zero

**Serves:** ReceiptPdf export - none of the four payment-breakdown lines is conditional on its value

- **GIVEN** a single full payment, where Previous Payments and Remaining
  Balance Due are each a zero-reading string
- **WHEN** ReceiptPdf renders it
- **THEN** all four payment-breakdown lines still appear, in their fixed
  order
- **AND** none is dropped for reading zero

### Requirement: Dates render fixed to Hong Kong time

Every document is issued from Hong Kong, whichever storefront it names, so a
date renders in Hong Kong time regardless of the timezone the caller's clock
runs on.

**Given** — InvoicePdf and ReceiptPdf SHALL render every date as its
Hong Kong calendar date and clock time, with the `HKT` zone name.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-43 - A date renders in Hong Kong time with its zone name

**Serves:** Presentation-only contract - every date renders fixed to Hong Kong time

- **GIVEN** a `Date` value
- **WHEN** InvoicePdf renders it as a meta row
- **THEN** the row shows that instant's Hong Kong calendar date and clock
  time, followed by `HKT`

### Requirement: InvoicePdf and ReceiptPdf render only what they are given

Neither renderer computes, sums, formats, or translates a value; every
amount is a string the caller already formatted, and every label comes from
the `copy` argument.

**No computation** — InvoicePdf and ReceiptPdf SHALL render every amount
exactly as the string given, and SHALL derive no rendered value from another
argument. **No label lookup** — InvoicePdf and ReceiptPdf SHALL render every
label from the `copy` argument and SHALL import no message catalog.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-16 - Order Total renders exactly what is given, not a computed sum

**Serves:** Presentation-only contract - a rendered amount is exactly the value given, never a derived one

- **GIVEN** Subtotal, Payment Processing Fee, and Order Total values that
  would not sum correctly if added together
- **WHEN** InvoicePdf renders them
- **THEN** Order Total shows exactly the value given, not the sum of
  Subtotal and the fee

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-17 - Every label reads the copy argument, with no hardcoded fallback

**Serves:** Presentation-only contract - every label comes from the copy argument, not a hardcoded string

- **GIVEN** a `copy` argument of arbitrary strings
- **WHEN** InvoicePdf and ReceiptPdf each render with it
- **THEN** every label reads the string `copy` gave it
- **AND** no label shows a default `copy` did not supply

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-27 - A required line still renders its row when its content is blank

**Serves:** Presentation-only contract - every amount renders exactly as given, never dropped for its content

- **GIVEN** Subtotal as a whitespace-only string, with every other required
  line supplied normally
- **WHEN** InvoicePdf renders them
- **THEN** the Subtotal row still renders
- **AND** it is not silently dropped for carrying blank content

### Requirement: Each renderer produces one A4 document

`InvoicePdf` and `ReceiptPdf` each return the bytes of one complete PDF
document, sized to one A4 page, regardless of how much or how little content
the caller supplies.

**Given** — InvoicePdf and ReceiptPdf SHALL each return PDF bytes describing
exactly one page, sized 595.28×841.89pt (A4).

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-44 - InvoicePdf returns one A4 page

**Serves:** Document shape - each renderer produces one A4 document

- **GIVEN** any valid invoice data
- **WHEN** InvoicePdf renders it
- **THEN** the returned bytes parse as a PDF document with exactly one page
- **AND** that page is sized 595.28×841.89pt

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-45 - ReceiptPdf returns one A4 page

**Serves:** Document shape - each renderer produces one A4 document

- **GIVEN** any valid receipt data
- **WHEN** ReceiptPdf renders it
- **THEN** the returned bytes parse as a PDF document with exactly one page
- **AND** that page is sized 595.28×841.89pt
