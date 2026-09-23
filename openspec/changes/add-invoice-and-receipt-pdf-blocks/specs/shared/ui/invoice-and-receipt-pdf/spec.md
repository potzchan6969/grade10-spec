# shared/ui/invoice-and-receipt-pdf Specification

## Purpose

`InvoicePdf` and `ReceiptPdf` are presentation-only `@grade10/ui` components
that render an auction order's Invoice and Receipt documents from props
alone, so an application shows the same document `winner-order/spec.md`
already requires without maintaining its own copy.

## Feature set

- InvoicePdf export
  - Meta rows: invoice ID, payment method, sent at, payment deadline
  - Issuer and party blocks: the issuer, Bill To, Ship To
  - Lot and order-value lines: a Description/Amount header and divider, then
    the lot, winning bid, buyer's premium, shipping & handling, insurance
    when given, subtotal, payment processing fee, order total
  - Replaced by, shown only when given
  - Bank rails: a full-width section below the order-value summary, shown
    only on a bank-transfer invoice — not a meta row
- ReceiptPdf export
  - Meta rows: receipt ID, the invoice ID it pays, payment method, the
    manually-settled mark
  - Party blocks: Bill To, Ship To
  - Order-value lines: the same shape as InvoicePdf's, including the
    Description/Amount header
  - Payment breakdown: Original Invoice Total, Previous Payments, Current
    Payment Received, Remaining Balance Due, in that order
  - Superseded invoice, shown only when given
- Party address fields
  - Bill To and Ship To are each a structured address: full name, company
    name when given, address line 1, address line 2 when given, city, state
    when given, postal code, country, phone number
  - Company name, address line 2 and state are the only optional fields,
    matching the address form's own optionality; every other field is
    required
- Reserved extension slots
  - An optional tax line on both documents, rendered only when given
  - An optional issuer tax-details block on ReceiptPdf, rendered only when
    given
- Presentation-only contract
  - Every amount and date arrives as a preformatted `ReactNode`; neither
    component computes, sums or formats a value
  - Every label arrives through a `copy` prop; neither component imports
    `@grade10/i18n`

## ADDED Requirements

### Requirement: InvoicePdf renders its meta rows and party blocks

InvoicePdf's meta rows and party blocks name the invoice, when it was sent,
how it is paid, and who it bills and ships to.

**Meta rows** — InvoicePdf SHALL render the invoice ID, payment method, sent
at, and payment deadline for every invoice. **Party blocks** — InvoicePdf
SHALL render the issuer block, Bill To, and Ship To for every invoice, each
rendering only its own supplied content.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-1 - An invoice's meta rows and party blocks all render
**Serves:** InvoicePdf export - the invoice's meta rows all render

- **GIVEN** an InvoicePdf given an invoice ID, payment method, sent-at date,
  payment deadline, issuer block, Bill To, and Ship To
- **WHEN** it renders
- **THEN** every meta row and party block given is shown

### Requirement: InvoicePdf renders bank rails as a full-width section below the order value

Bank rails — SWIFT, FPS and Hong Kong local transfer details — read as their
own section, the full width of the sheet, below the order-value summary and
Order Total. They are not a meta row: a meta row's label-and-value shape does
not fit a rail-by-rail table, and every invoice's meta rows sit in a narrow
column beside the issuer block.

**Given** — InvoicePdf SHALL render the bank rails section, labelled from
`copy.bankRailsLabel`, only when the consumer supplies `bankRails`.
**Withheld** — InvoicePdf SHALL render no bank rails section when `bankRails`
is not supplied.
**Position** — Where rendered, the bank rails section SHALL follow the
order-value summary and SHALL span the sheet's full content width, not the
meta rows' narrower column.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-18 - A bank-transfer invoice renders its bank rails
**Serves:** InvoicePdf export - the bank rails section renders where a consumer supplies it

- **GIVEN** an InvoicePdf given bank rails
- **WHEN** it renders
- **THEN** the bank rails section shows the value given

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-36 - A card invoice shows no bank rails
**Serves:** InvoicePdf export - a card invoice withholds the bank rails a card carries none of

- **GIVEN** an InvoicePdf given no bank rails
- **WHEN** it renders
- **THEN** no bank rails section appears
- **AND** every other meta row and party block still renders

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-35 - The bank rails section sits below the order value, full width
**Serves:** InvoicePdf export - bank rails render as their own full-width section below the order-value summary

- **GIVEN** an InvoicePdf given bank rails and a full order-value section
- **WHEN** it renders
- **THEN** the bank rails section follows the order-value summary in the
  document
- **AND** it is not nested inside any meta row
- **AND** it spans the same width as the order-value summary, not the
  narrower meta-rows column

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-19 - Bill To and Ship To never echo each other
**Serves:** InvoicePdf export - Bill To and Ship To each render only their own content

- **GIVEN** an InvoicePdf given Bill To content naming one recipient and Ship To
  content naming a different recipient
- **WHEN** it renders
- **THEN** Bill To shows its own supplied content
- **AND** Ship To shows its own, distinct, supplied content

### Requirement: Bill To and Ship To render as structured address fields

Bill To and Ship To each carry a full name, an optional company name, a
street address, an optional locality, a postal code, a country, and a phone
number, matching the address form's own field set and optionality. Both
InvoicePdf and ReceiptPdf render the same structure.

**Fields** — InvoicePdf and ReceiptPdf SHALL render full name, address line
1, city, postal code, country, and phone number for every Bill To and every
Ship To. **Company name** — InvoicePdf and ReceiptPdf SHALL render the
company name only when the consumer supplies it. **Address line 2** —
InvoicePdf and ReceiptPdf SHALL render address line 2 only when the consumer
supplies it. **State** — InvoicePdf and ReceiptPdf SHALL render state only
when the consumer supplies it.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-31 - A company address renders every field it is given
**Serves:** Party address fields - every address field renders when supplied

- **GIVEN** an InvoicePdf given a Bill To with a full name, company name,
  address line 1, address line 2, city, state, postal code, country, and
  phone number
- **WHEN** it renders
- **THEN** every one of those nine fields is shown

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-32 - A personal address omits company name, address line 2 and state
**Serves:** Party address fields - company name, address line 2 and state are the only optional fields

- **GIVEN** an InvoicePdf given a Ship To with no company name, no address
  line 2, and no state
- **WHEN** it renders
- **THEN** no company name, no address line 2, and no state field appear
- **AND** full name, address line 1, city, postal code, country, and phone
  number still render

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-33 - A receipt's company address renders every field it is given
**Serves:** Party address fields - every address field renders when supplied

- **GIVEN** a ReceiptPdf given a Bill To with all nine address fields
- **WHEN** it renders
- **THEN** every one of those nine fields is shown

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-34 - A receipt's personal address omits company name, address line 2 and state
**Serves:** Party address fields - company name, address line 2 and state are the only optional fields

- **GIVEN** a ReceiptPdf given a Ship To with no company name, no address
  line 2, and no state
- **WHEN** it renders
- **THEN** no company name, no address line 2, and no state field appear
- **AND** full name, address line 1, city, postal code, country, and phone
  number still render

### Requirement: InvoicePdf renders the order-value lines in order

The order-value lines total what the invoice charges, in one fixed order
regardless of which optional line is given.

**Fixed order** — InvoicePdf SHALL render the lot, winning bid, buyer's
premium, Shipping & Handling, insurance when given, subtotal, payment
processing fee, and order total, in that order. **Insurance** — InvoicePdf
SHALL render the insurance line only when the consumer supplies it, and SHALL
leave the line out, not blank, when withheld.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-3 - The order-value lines total the invoice in one fixed order
**Serves:** InvoicePdf export - the lot and order-value lines render in their fixed order

- **GIVEN** an InvoicePdf given the lot, winning bid, buyer's premium,
  Shipping & Handling, insurance, subtotal, payment processing fee, and order
  total
- **WHEN** it renders
- **THEN** the eight lines appear in that order

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-4 - An invoice with no insurance skips the line without disturbing the order
**Serves:** InvoicePdf export - the lot and order-value lines render in their fixed order

- **GIVEN** an InvoicePdf given every order-value line except insurance
- **WHEN** it renders
- **THEN** no insurance line appears
- **AND** subtotal, payment processing fee, and order total keep their order

### Requirement: The order-value lines carry a Description/Amount header

Both InvoicePdf and ReceiptPdf head the order-value lines with a two-column
table header, Description and Amount, and a divider — directly above the
line items, naming what the two columns hold before the winning bid and
every line after it appear.

**Header** — InvoicePdf and ReceiptPdf SHALL render a header row reading
`copy.orderValue.descriptionLabel` and `copy.orderValue.amountLabel`,
followed by a divider, immediately above the order-value lines.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-37 - The order-value table header renders above the invoice's line items
**Serves:** InvoicePdf export - the order-value lines render in their fixed order

- **GIVEN** an InvoicePdf given order-value lines
- **WHEN** it renders
- **THEN** a header row shows Description and Amount, immediately above the
  order-value lines
- **AND** a divider separates the header from the first line

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-38 - The order-value table header renders above the receipt's line items
**Serves:** ReceiptPdf export - the order-value lines render in the same fixed order as InvoicePdf's

- **GIVEN** a ReceiptPdf given order-value lines
- **WHEN** it renders
- **THEN** a header row shows Description and Amount, immediately above the
  order-value lines
- **AND** a divider separates the header from the first line

### Requirement: InvoicePdf shows Replaced by only when given

Replaced by names the invoice that replaced this one, and only an invoice a
reissue replaced carries a value for it.

**Given** — InvoicePdf SHALL render `replacedBy` when the consumer supplies
it. **Withheld** — InvoicePdf SHALL render no Replaced by line when
`replacedBy` is not supplied.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-5 - A replaced invoice's PDF names its replacement
**Serves:** InvoicePdf export - Replaced by, shown only when given

- **GIVEN** an InvoicePdf given a `replacedBy` value
- **WHEN** it renders
- **THEN** the Replaced by line shows the value given

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-6 - A current invoice's PDF shows no Replaced by line
**Serves:** InvoicePdf export - Replaced by, shown only when given

- **GIVEN** an InvoicePdf given no `replacedBy` value
- **WHEN** it renders
- **THEN** no Replaced by line appears

### Requirement: ReceiptPdf renders its meta rows and party blocks

ReceiptPdf's meta rows and party blocks name the receipt, the invoice it
pays, how it was paid, and who it bills and ships to.

**Meta rows** — ReceiptPdf SHALL render the receipt ID, the invoice ID it
pays, and the payment method for every receipt, each as its own row. **Party
blocks** — ReceiptPdf SHALL render Bill To and Ship To for every receipt,
each rendering only its own supplied content.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-7 - A receipt's meta rows and party blocks all render
**Serves:** ReceiptPdf export - the receipt's meta rows and party blocks all render

- **GIVEN** a ReceiptPdf given a receipt ID, the invoice ID it pays, a
  payment method, Bill To, and Ship To
- **WHEN** it renders
- **THEN** every meta row and party block given is shown

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-20 - Receipt ID and the invoice ID it pays never conflate
**Serves:** ReceiptPdf export - the receipt ID and the invoice ID it pays render as distinct rows

- **GIVEN** a ReceiptPdf given a receipt ID and a different invoice ID
- **WHEN** it renders
- **THEN** the receipt ID row shows its own content
- **AND** the invoice ID row shows its own, distinct, content

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-29 - A receipt's Bill To and Ship To never echo each other
**Serves:** ReceiptPdf export - Bill To and Ship To each render only their own content

- **GIVEN** a ReceiptPdf given Bill To content naming one recipient and Ship
  To content naming a different recipient
- **WHEN** it renders
- **THEN** Bill To shows its own supplied content
- **AND** Ship To shows its own, distinct, supplied content

### Requirement: ReceiptPdf renders its order-value lines in the same fixed order as InvoicePdf's

The Feature set carries one order-value shape for both documents, since a
receipt itemises the invoice it pays. ReceiptPdf follows the same fixed order
and the same conditional Insurance line InvoicePdf does.

**Fixed order** — ReceiptPdf SHALL render the lot, winning bid, buyer's
premium, Shipping & Handling, insurance when given, subtotal, payment
processing fee, and order total, in that order. **Insurance** — ReceiptPdf
SHALL render the insurance line only when the consumer supplies it, and SHALL
leave the line out, not blank, when withheld.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-21 - A receipt's order-value lines render in the same fixed order, Insurance included or not
**Serves:** ReceiptPdf export - the order-value lines render in the same fixed order as InvoicePdf's

- **GIVEN** a ReceiptPdf given every order-value line except insurance
- **WHEN** it renders
- **THEN** the remaining lines appear in their fixed order
- **AND** no insurance line appears

### Requirement: ReceiptPdf renders the payment breakdown in a fixed order

The payment breakdown tells the winner what the invoice totalled, what it
already carried, what this payment settled, and what is left, on every
receipt.

**Fixed order** — ReceiptPdf SHALL render Original Invoice Total, Previous
Payments, Current Payment Received, and Remaining Balance Due, in that order.
**Always rendered** — ReceiptPdf SHALL render all four lines on every
receipt; none is conditional on being given, unlike Insurance or the reserved
slots.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-8 - The payment breakdown renders in one fixed order
**Serves:** ReceiptPdf export - the payment breakdown renders in its fixed order

- **GIVEN** a ReceiptPdf given values for Original Invoice Total, Previous
  Payments, Current Payment Received, and Remaining Balance Due
- **WHEN** it renders
- **THEN** the four lines appear in that order

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-22 - The payment breakdown keeps all four lines when two read zero
**Serves:** ReceiptPdf export - none of the four payment-breakdown lines is conditional on its value

- **GIVEN** a ReceiptPdf given a single full payment, where Previous Payments
  and Remaining Balance Due are each a zero-reading `ReactNode`
- **WHEN** it renders
- **THEN** all four payment-breakdown lines still appear, in their fixed order
- **AND** none is dropped for reading zero

### Requirement: The manually-settled mark is visually distinguishable when given

The manually-settled mark tells a winner a receipt was recorded by an
operator rather than confirmed by a card charge or a bank-transfer proof.

**Given** — ReceiptPdf SHALL render a mark visually distinguishable from an
unmarked receipt when `manuallySettled` is true. **Withheld** — ReceiptPdf
SHALL render no mark when `manuallySettled` is false or not supplied.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-9 - A manually settled receipt carries a distinguishable mark
**Serves:** ReceiptPdf export - the manually-settled mark stands out from an unmarked receipt

- **GIVEN** a ReceiptPdf given `manuallySettled` as true
- **WHEN** it renders
- **THEN** a mark shows that is visually distinguishable from a receipt
  rendered with `manuallySettled` false

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-10 - A card- or bank-transfer-settled receipt carries no mark
**Serves:** ReceiptPdf export - the manually-settled mark stands out from an unmarked receipt

- **GIVEN** a ReceiptPdf given `manuallySettled` as false
- **WHEN** it renders
- **THEN** no manually-settled mark appears

### Requirement: ReceiptPdf shows Superseded invoice only when given

Superseded invoice points to any invoice an operator-recorded settlement
replaces.

**Given** — ReceiptPdf SHALL render `supersededInvoice` when the consumer
supplies it. **Withheld** — ReceiptPdf SHALL render no Superseded invoice
line when `supersededInvoice` is not supplied.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-11 - A settlement that supersedes an invoice names it
**Serves:** ReceiptPdf export - Superseded invoice, shown only when given

- **GIVEN** a ReceiptPdf given a `supersededInvoice` value
- **WHEN** it renders
- **THEN** the Superseded invoice line shows the value given

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-12 - A receipt with nothing superseded shows no such line
**Serves:** ReceiptPdf export - Superseded invoice, shown only when given

- **GIVEN** a ReceiptPdf given no `supersededInvoice` value
- **WHEN** it renders
- **THEN** no Superseded invoice line appears

### Requirement: The reserved tax-line and issuer-tax-details slots render only when given

The tax line and the issuer tax-details block are reserved for two open
product questions — the tax regime and the formal-receipt question. Until
either is answered, InvoicePdf and ReceiptPdf carry only the slot, with no
shape of its own.

**Tax line** — InvoicePdf and ReceiptPdf SHALL render `taxLine` whenever the
consumer supplies the prop, whether or not its content is empty, and SHALL
render no tax row — not even a blank one — only when the prop itself is not
supplied. **Issuer tax details** — ReceiptPdf SHALL render `issuerTaxDetails`
under the same rule: rendered whenever the prop is supplied, absent only when
it is not. **Independence** — InvoicePdf and ReceiptPdf SHALL render each
reserved slot strictly on its own prop, never on the other slot's presence or
absence.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-13 - A given tax line renders on the invoice
**Serves:** Reserved extension slots - the tax line renders where a consumer supplies one

- **GIVEN** an InvoicePdf given a `taxLine` value
- **WHEN** it renders
- **THEN** the tax line shows the value given, positioned among the
  order-value lines

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-14 - Withholding the tax line changes nothing else
**Serves:** Reserved extension slots - withholding a reserved slot changes nothing else on the document

- **GIVEN** an InvoicePdf and a ReceiptPdf, neither given a `taxLine` value
- **WHEN** each renders
- **THEN** neither shows a tax row, an empty row, or a placeholder in its
  place
- **AND** every other line keeps its position

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-15 - A given issuer tax-details block renders on the receipt
**Serves:** Reserved extension slots - the issuer tax-details block renders where a consumer supplies one

- **GIVEN** a ReceiptPdf given an `issuerTaxDetails` value
- **WHEN** it renders
- **THEN** the issuer tax-details block shows the value given

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-23 - A given tax line renders on the receipt too
**Serves:** Reserved extension slots - the tax line renders where a consumer supplies one

- **GIVEN** a ReceiptPdf given a `taxLine` value
- **WHEN** it renders
- **THEN** the tax line shows the value given, positioned among the
  order-value lines

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-24 - The tax line and the issuer tax-details block render independently
**Serves:** Reserved extension slots - each reserved slot renders strictly on its own prop

- **GIVEN** a ReceiptPdf given an `issuerTaxDetails` value and no `taxLine`
  value
- **WHEN** it renders
- **THEN** the issuer tax-details block shows
- **AND** no tax line appears

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-25 - A tax line supplied as empty content still renders its row
**Serves:** Reserved extension slots - the tax line renders whenever the prop is supplied, whether or not its content is empty

- **GIVEN** an InvoicePdf given a `taxLine` prop holding empty content, as
  distinct from `taxLine` not being supplied at all
- **WHEN** it renders
- **THEN** the tax row appears, with the empty content it was given
- **AND** this differs from the prop not being supplied, under which no row
  appears at all

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-30 - Withholding the issuer tax-details block changes nothing else
**Serves:** Reserved extension slots - withholding a reserved slot changes nothing else on the document

- **GIVEN** a ReceiptPdf given no `issuerTaxDetails` value
- **WHEN** it renders
- **THEN** no issuer tax-details block appears
- **AND** every other block keeps its position

### Requirement: InvoicePdf and ReceiptPdf render only what they are given

Neither component computes, sums, formats, or translates a value; every
amount and date is a `ReactNode` the consumer already formatted, and every
label comes from the `copy` prop.

**No computation** — InvoicePdf and ReceiptPdf SHALL render every amount and
date exactly as the `ReactNode` given, and SHALL derive no rendered value
from another prop. **No label lookup** — InvoicePdf and ReceiptPdf SHALL
render every label from the `copy` prop and SHALL import no message catalog.
This is a type-level guarantee more than an observable one: a consumer
passing a wrong or inconsistent value sees exactly that wrong value rendered,
never a corrected one, because neither component holds the rule that would
let it check or fix it.

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-16 - Order Total renders exactly what is given, not a computed sum
**Serves:** Presentation-only contract - a rendered amount is exactly the value given, never a derived one

- **GIVEN** an InvoicePdf given subtotal, payment processing fee, and order
  total values that would not sum correctly if added together
- **WHEN** it renders
- **THEN** Order Total shows exactly the value given, not the sum of
  subtotal and the fee

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-17 - Every label reads the copy prop, with no catalog fallback
**Serves:** Presentation-only contract - every label comes from the copy prop, not a catalog

- **GIVEN** an InvoicePdf and a ReceiptPdf rendered with a `copy` prop of
  arbitrary strings
- **WHEN** each renders
- **THEN** every label reads the string `copy` gave it
- **AND** no label shows a default `copy` did not supply

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-26 - Rich ReactNode content renders unchanged, not reduced to text
**Serves:** Presentation-only contract - a rendered amount is exactly the value given, never a derived one

- **GIVEN** an InvoicePdf given Order Total as a `ReactNode` carrying markup
  rather than a plain string
- **WHEN** it renders
- **THEN** Order Total shows that markup unchanged
- **AND** no value is stripped down to plain text

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-27 - A required line still renders its row when its content is blank
**Serves:** Presentation-only contract - every amount and date renders exactly as given, never dropped for its content

- **GIVEN** an InvoicePdf given Subtotal as a whitespace-only `ReactNode`,
  with every other required line supplied normally
- **WHEN** it renders
- **THEN** the Subtotal row still renders
- **AND** it is not silently dropped for carrying blank content

#### Scenario: shared-ui-invoice-and-receipt-pdf-SC-28 - Neither component shows a loading or error state
**Serves:** Presentation-only contract - neither component fetches its own data

- **GIVEN** an InvoicePdf and a ReceiptPdf, each given a full set of props
- **WHEN** each renders, with no data fetch made
- **THEN** each shows its content immediately from the props given
- **AND** neither shows a loading state or a fetch-error state
