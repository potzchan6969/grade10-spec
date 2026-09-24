# shared/ui/invoice-and-receipt-pdf Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-23, tcs-rules r3

## shared-ui-invoice-and-receipt-pdf-US1: Invoice and Receipt PDF component contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/winner-order`, which composes the block behind the Invoice PDF control (`winner-order-SC-57`, `winner-order-SC-109`) and the Receipt PDF control (`winner-order-SC-67`)

**As a** customer,
**I want** the Invoice and Receipt PDFs I open from Winner Order to show every line and address Grade10 already committed to, from one shared component,
**so that** the document I read or download matches what the order page told me, however the page that composes it is built.

### shared-ui-invoice-and-receipt-pdf-US1-TC1-1: Fully supplied invoice renders every meta row and line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with every prop supplied as non-empty content: invoice ID, payment method (card), sent at, payment deadline, bank reference, issuer, Bill To, Ship To, lot, winning bid, buyer's premium, shipping & handling, insurance, subtotal, payment processing fee, order total.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Inspect the meta rows, the issuer and party blocks, and the order-value lines.

**Expected Results:**

* Every meta row renders its supplied content.
* Issuer, Bill To and Ship To each render as a distinct block.
* Every order-value line renders, in the order named.

### shared-ui-invoice-and-receipt-pdf-US1-TC2-1: Card-paid invoice omits bank rails despite a bank reference

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with payment method card, a bank reference supplied, and no bank rails prop supplied.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the meta rows.

**Expected Results:**

* The bank reference renders.
* Bank rails do not render.

### shared-ui-invoice-and-receipt-pdf-US1-TC3-1: Bank-transfer invoice renders bank rails when supplied

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with payment method bank-transfer, a bank reference supplied, and bank rails supplied.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the meta rows.

**Expected Results:**

* The bank reference renders.
* Bank rails render beside it.

### shared-ui-invoice-and-receipt-pdf-US1-TC4-1: Insurance line renders only when supplied

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

Runs once per row of **Test data**.

**Test data:**

| Insurance prop | Insurance line |
| --- | --- |
| Supplied | Renders |
| Omitted | Does not render |

**Pre-conditions:**

* `InvoicePdf` is rendered with every other order-value line supplied, and Insurance set per the row.

**Steps:**

1. Render `InvoicePdf` with the row's Insurance prop.
2. Inspect the order-value lines.

**Expected Results:**

* The Insurance line matches the row's outcome.
* Every other order-value line still renders.

### shared-ui-invoice-and-receipt-pdf-US1-TC5-1: Subtotal and Order Total survive Insurance being omitted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with Insurance omitted and every other order-value line supplied.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the Subtotal and Order Total rows.

**Expected Results:**

* Subtotal renders its supplied content.
* Order Total renders its supplied content.
* Neither row is dropped or reordered by Insurance's absence.

### shared-ui-invoice-and-receipt-pdf-US1-TC6-1: Replaced by renders only when given

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

Runs once per row of **Test data**.

**Test data:**

| Replaced by prop | Replaced by line |
| --- | --- |
| Supplied | Renders |
| Omitted | Does not render |

**Pre-conditions:**

* `InvoicePdf` is rendered with every other line supplied, and Replaced by set per the row.

**Steps:**

1. Render `InvoicePdf` with the row's Replaced by prop.
2. Inspect the meta rows.

**Expected Results:**

* Replaced by matches the row's outcome.

### shared-ui-invoice-and-receipt-pdf-US1-TC7-1: Bill To and Ship To render independently when they differ

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with Bill To content naming one recipient and Ship To content naming a different recipient.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the Bill To and Ship To blocks.

**Expected Results:**

* Bill To renders its own supplied content.
* Ship To renders its own, distinct, supplied content.
* Neither block echoes the other's content.

### shared-ui-invoice-and-receipt-pdf-US1-TC8-1: Fully supplied receipt renders every row in order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with every prop supplied: receipt ID, the invoice ID it pays, payment method, the manually-settled mark, Bill To, Ship To, every order-value line, and all four payment-breakdown lines.

**Steps:**

1. Render `ReceiptPdf` with the supplied props.
2. Inspect the meta rows, party blocks, order-value lines and payment breakdown.

**Expected Results:**

* Every meta row renders its supplied content.
* Bill To and Ship To render as distinct blocks.
* Every order-value line renders.
* The payment breakdown renders Original Invoice Total, then Previous Payments, then Current Payment Received, then Remaining Balance Due, in that order.

### shared-ui-invoice-and-receipt-pdf-US1-TC9-1: Payment breakdown keeps its order at zero values

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with Previous Payments and Remaining Balance Due each supplied as a zero-reading `ReactNode`, and Original Invoice Total and Current Payment Received supplied as non-zero content, as a single full payment produces.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the payment breakdown.

**Expected Results:**

* All four payment-breakdown lines render; none is omitted for reading zero.
* The order stays Original Invoice Total, Previous Payments, Current Payment Received, Remaining Balance Due.

### shared-ui-invoice-and-receipt-pdf-US1-TC10-1: Manually-settled mark renders only for operator-recorded settlements

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** ReceiptPdf export

Runs once per row of **Test data**.

**Test data:**

| Manually-settled prop | Mark |
| --- | --- |
| Supplied (operator-recorded settlement) | Renders, visually distinguishable |
| Omitted (card, or a confirmed bank transfer) | Does not render |

**Pre-conditions:**

* `ReceiptPdf` is rendered with the manually-settled mark prop set per the row.

**Steps:**

1. Render `ReceiptPdf` with the row's prop.
2. Inspect the meta rows for the mark.

**Expected Results:**

* The mark matches the row's outcome.
* When it renders, it is visually distinguishable from an unmarked receipt.

### shared-ui-invoice-and-receipt-pdf-US1-TC11-1: Payment method content renders unchanged across its variants

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

Runs once per row of **Test data**.

**Test data:**

| Payment method content |
| --- |
| Card brand and last four digits |
| Bank Transfer |
| An operator-given description with an external reference |

**Pre-conditions:**

* `ReceiptPdf` is rendered with the payment method meta row set to the row's content.

**Steps:**

1. Render `ReceiptPdf` with the row's payment method content.
2. Inspect the payment method meta row.

**Expected Results:**

* The payment method row renders the row's content verbatim, unchanged by which variant it is.

### shared-ui-invoice-and-receipt-pdf-US1-TC12-1: Superseded invoice renders only when given

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

Runs once per row of **Test data**.

**Test data:**

| Superseded invoice prop | Superseded invoice line |
| --- | --- |
| Supplied | Renders |
| Omitted | Does not render |

**Pre-conditions:**

* `ReceiptPdf` is rendered with every other line supplied, and Superseded invoice set per the row.

**Steps:**

1. Render `ReceiptPdf` with the row's Superseded invoice prop.
2. Inspect the meta rows.

**Expected Results:**

* Superseded invoice matches the row's outcome.

### shared-ui-invoice-and-receipt-pdf-US1-TC13-1: Insurance line renders only when given on the receipt

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with every order-value line supplied except Insurance, which is omitted.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* Every order-value line other than Insurance renders.
* Insurance does not render.
* The remaining lines keep the same shape as `InvoicePdf`'s: Winning Bid, Buyer's Premium, Shipping & Handling, Subtotal, Payment Processing Fee, Order Total.

### shared-ui-invoice-and-receipt-pdf-US1-TC14-1: Receipt ID and invoice ID render as distinct rows

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with a receipt ID and a different invoice ID supplied.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the meta rows.

**Expected Results:**

* The receipt ID row renders its own content.
* The invoice ID row renders its own, distinct, content.
* Neither row is conflated with the other.

### shared-ui-invoice-and-receipt-pdf-US1-TC15-1: Bill To and Ship To render independently on the receipt

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with Bill To content naming one recipient and Ship To content naming a different recipient.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the Bill To and Ship To blocks.

**Expected Results:**

* Bill To renders its own supplied content.
* Ship To renders its own, distinct, supplied content.

### shared-ui-invoice-and-receipt-pdf-US1-TC16-1: Tax line does not render when omitted on the invoice

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reserved extension slots

**Pre-conditions:**

* `InvoicePdf` is rendered with every other line supplied and no tax-line prop supplied.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* No tax line renders.
* Every other order-value line renders unaffected.

### shared-ui-invoice-and-receipt-pdf-US1-TC17-1: Tax line renders with its content when supplied

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reserved extension slots

**Pre-conditions:**

* `InvoicePdf` is rendered with the tax-line prop supplied as a non-empty `ReactNode`.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* The tax line renders the supplied content among the order-value lines.

### shared-ui-invoice-and-receipt-pdf-US1-TC18-1: An empty tax line renders differently from an absent one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reserved extension slots

Runs once per row of **Test data**.

**Test data:**

| Tax-line prop | Tax row |
| --- | --- |
| Omitted entirely (prop never passed) | Does not render |
| Supplied as an empty `ReactNode` | Renders, with blank content |

**Pre-conditions:**

* `InvoicePdf` is rendered with every other order-value line supplied, and the tax-line prop set per the row.

**Steps:**

1. Render `InvoicePdf` with the row's tax-line prop.
2. Inspect the order-value lines for a tax row.

**Expected Results:**

* The tax row's presence matches the row's outcome.
* Omitting the prop and passing it as empty content are not treated the same.

### shared-ui-invoice-and-receipt-pdf-US1-TC19-1: Issuer tax-details block does not render when omitted

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reserved extension slots

**Pre-conditions:**

* `ReceiptPdf` is rendered with every other block supplied and no issuer tax-details prop supplied.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the rendered output for an issuer tax-details block.

**Expected Results:**

* No issuer tax-details block renders.
* Every other block renders unaffected.

### shared-ui-invoice-and-receipt-pdf-US1-TC20-1: Issuer tax-details and tax line render independently

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reserved extension slots

Runs once per row of **Test data**.

**Test data:**

| Tax-line prop | Issuer tax-details prop | Issuer tax-details block |
| --- | --- | --- |
| Omitted | Supplied | Renders |
| Supplied | Omitted | Does not render |
| Supplied | Supplied | Renders |

**Pre-conditions:**

* `ReceiptPdf` is rendered with the tax-line and issuer tax-details props set per the row.

**Steps:**

1. Render `ReceiptPdf` with the row's props.
2. Inspect the output for the tax line and the issuer tax-details block.

**Expected Results:**

* Each slot's presence matches its own prop, independent of the other slot's state.

### shared-ui-invoice-and-receipt-pdf-US1-TC21-1: Tax line behaves the same on invoice and receipt

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Reserved extension slots

**Pre-conditions:**

* `ReceiptPdf` is rendered with every other line supplied and no tax-line prop supplied.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* No tax line renders on the receipt.
* The reserved slot's omitted behaviour matches `InvoicePdf`'s.

### shared-ui-invoice-and-receipt-pdf-US1-TC22-1: Preformatted amount content renders exactly as supplied

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Presentation-only contract

**Pre-conditions:**

* `InvoicePdf` is rendered with Order Total supplied as a `ReactNode` carrying custom markup — a currency symbol and a tooltip wrapper — rather than a plain string.

**Steps:**

1. Render `InvoicePdf` with the pre-condition.
2. Inspect the rendered Order Total row.

**Expected Results:**

* The Order Total row renders the supplied markup unchanged.
* No value is recomputed, reformatted, or stripped down to plain text.

### shared-ui-invoice-and-receipt-pdf-US1-TC23-1: Labels render from the copy prop, not a default

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Presentation-only contract

**Pre-conditions:**

* `InvoicePdf` and `ReceiptPdf` are each rendered with a copy prop naming labels in a non-English locale for every row they show.

**Steps:**

1. Render each component with the pre-conditions.
2. Inspect every rendered label.

**Expected Results:**

* Every label reads the supplied copy prop's text.
* No row falls back to an English or other built-in label.

### shared-ui-invoice-and-receipt-pdf-US1-TC24-1: A whitespace amount still renders its row structure

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Presentation-only contract

**Pre-conditions:**

* `InvoicePdf` is rendered with the Subtotal content supplied as a whitespace-only `ReactNode`, and every other required line supplied normally.

**Steps:**

1. Render `InvoicePdf` with the pre-condition.
2. Inspect the Subtotal row.

**Expected Results:**

* The Subtotal row still renders its label and row structure.
* The row is not silently dropped for carrying whitespace content.

### shared-ui-invoice-and-receipt-pdf-US1-TC25-1: Neither component shows a loading or error state

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Presentation-only contract

**Pre-conditions:**

* `InvoicePdf` and `ReceiptPdf` are each rendered with a full set of props, with no network access available to the test environment.

**Steps:**

1. Render each component with the pre-conditions, network access blocked.
2. Inspect the rendered output.

**Expected Results:**

* Each component renders its content immediately from props.
* Neither shows a loading skeleton or a fetch-error state.

### shared-ui-invoice-and-receipt-pdf-US1-TC26-1: Re-rendering with new props leaves no stale content

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Presentation-only contract

**Pre-conditions:**

* `InvoicePdf` is rendered once, then re-rendered with an entirely new, unrelated set of props for a different invoice.

**Steps:**

1. Render `InvoicePdf` with the first set of props.
2. Re-render it with the second set of props.
3. Inspect the output after the second render.

**Expected Results:**

* The second render shows only the second set of props' content.
* No row from the first render's props persists.

### shared-ui-invoice-and-receipt-pdf-US1-TC27-1: A company address renders every field it is given

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Party address fields

**Pre-conditions:**

* `InvoicePdf` is rendered with a Bill To supplying full name, company name, address line 1, address line 2, city, state, postal code, country, and phone number.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the Bill To block.

**Expected Results:**

* All nine fields render.

### shared-ui-invoice-and-receipt-pdf-US1-TC28-1: A personal address omits company name, address line 2 and state

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Party address fields

**Pre-conditions:**

* `InvoicePdf` is rendered with a Ship To omitting company name, address line 2, and state.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the Ship To block.

**Expected Results:**

* No company name, address line 2, or state field renders.
* Full name, address line 1, city, postal code, country, and phone number still render.

### shared-ui-invoice-and-receipt-pdf-US1-TC29-1: A receipt's company address renders every field it is given

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Party address fields

**Pre-conditions:**

* `ReceiptPdf` is rendered with a Bill To supplying all nine address fields.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the Bill To block.

**Expected Results:**

* All nine fields render.

### shared-ui-invoice-and-receipt-pdf-US1-TC30-1: A receipt's personal address omits company name, address line 2 and state

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Party address fields

**Pre-conditions:**

* `ReceiptPdf` is rendered with a Ship To omitting company name, address line 2, and state.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the Ship To block.

**Expected Results:**

* No company name, address line 2, or state field renders.
* Full name, address line 1, city, postal code, country, and phone number still render.

### shared-ui-invoice-and-receipt-pdf-US1-TC31-1: Bank rails render below the order value, full width, not as a meta row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with bank rails supplied and a full order-value section.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the bank rails section's position and width relative to the meta rows and the order-value summary.

**Expected Results:**

* The bank rails section renders after the order-value summary, not inside the meta rows column.
* The bank rails section spans the same width as the order-value summary.

### shared-ui-invoice-and-receipt-pdf-US1-TC32-1: The order-value table header renders above the invoice's line items

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with a full order-value section.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the order-value lines for a header row and a divider above the first line.

**Expected Results:**

* A header row reads Description and Amount.
* A divider separates the header from the first order-value line.
* The header sits immediately above the order-value lines, not the summary.

### shared-ui-invoice-and-receipt-pdf-US1-TC33-1: The order-value table header renders above the receipt's line items

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with a full order-value section.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the order-value lines for a header row and a divider above the first line.

**Expected Results:**

* A header row reads Description and Amount.
* A divider separates the header from the first order-value line.

### shared-ui-invoice-and-receipt-pdf-US1-TC34-1: The issuer block sits at the foot of the invoice, right-aligned

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with an issuer block and a full order-value section.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the issuer block's position and alignment relative to the other sections.

**Expected Results:**

* The issuer block shows the value given.
* The issuer block renders after every other section in the document.
* The issuer block aligns to the right of the sheet.

### shared-ui-invoice-and-receipt-pdf-US1-TC35-1: The issuer block sits at the foot of the receipt, right-aligned

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with an issuer block and a full order-value section.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the issuer block's position and alignment relative to the other sections.

**Expected Results:**

* The issuer block shows the value given.
* The issuer block renders after every other section in the document.
* The issuer block aligns to the right of the sheet.

### shared-ui-invoice-and-receipt-pdf-US1-TC36-1: A company address renders every line it is given

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Party address fields

**Pre-conditions:**

* A Bill To carrying a recipient, company, address line 1, address line 2, city, region, postal code, and country.

**Steps:**

1. Render InvoicePdf with the pre-conditions.
2. Inspect the Bill To block.

**Expected Results:**

* Every one of those lines is shown.

### shared-ui-invoice-and-receipt-pdf-US1-TC37-1: A personal address omits the company line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Party address fields

**Pre-conditions:**

* A Ship To with no company and no address line 2.

**Steps:**

1. Render InvoicePdf with the pre-conditions.
2. Inspect the Ship To block.

**Expected Results:**

* No company line and no address-line-2 line appear.
* Recipient, address line 1, the city/region/postal-code line, and country still render.

### shared-ui-invoice-and-receipt-pdf-US1-TC38-1: No address given renders "Not recorded"

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Party address fields

**Pre-conditions:**

* A ReceiptPdf given no address for Ship To.

**Steps:**

1. Render ReceiptPdf with the pre-conditions.
2. Inspect the Ship To block.

**Expected Results:**

* The Ship To block shows the single line "Not recorded".
* No blank address lines appear in its place.

### shared-ui-invoice-and-receipt-pdf-US1-TC39-1: A bank-transfer receipt names its transfer reference

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* A ReceiptPdf given a transfer reference.

**Steps:**

1. Render ReceiptPdf with the pre-conditions.
2. Inspect the Payment section.

**Expected Results:**

* The Payment section shows the transfer reference given.

### shared-ui-invoice-and-receipt-pdf-US1-TC40-1: A card-paid receipt shows no transfer-reference line

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* A ReceiptPdf given no transfer reference.

**Steps:**

1. Render ReceiptPdf with the pre-conditions.
2. Inspect the document for a Payment section.

**Expected Results:**

* No Payment section appears.
* Every other meta row and party block still renders.

### shared-ui-invoice-and-receipt-pdf-US1-TC41-1: A date renders fixed to Hong Kong time with its zone name

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Presentation-only contract

**Pre-conditions:**

* A `Date` value, and a machine clock not set to Hong Kong time.

**Steps:**

1. Render InvoicePdf with the pre-conditions.
2. Inspect the sent-at meta row.

**Expected Results:**

* The row shows that instant's Hong Kong calendar date and clock time.
* The row ends in the zone name `HKT`.

### shared-ui-invoice-and-receipt-pdf-US1-TC42-1: Each renderer returns exactly one A4 page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* Valid invoice data, and valid receipt data.

**Steps:**

1. Render InvoicePdf and ReceiptPdf with their respective pre-conditions.
2. Parse the returned bytes as a PDF document.
3. Inspect the page count and page size of each.

**Expected Results:**

* Each returned document has exactly one page.
* Each page is sized 595.28×841.89pt (A4).

### shared-ui-invoice-and-receipt-pdf-US1-TC43-1: An invoice's payment method renders as its own meta row

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with an invoice number, sent-at date, payment
  deadline, payment method, issuer, Bill To, and Ship To.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Inspect the meta rows.

**Expected Results:**

* The payment method renders as its own meta row, alongside invoice number,
  sent-at date, and payment deadline.

### shared-ui-invoice-and-receipt-pdf-US1-TC44-1: The payment method row appends after payment deadline, never reordering the rows before it

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with distinct, recognizable values for invoice
  number, sent-at date, payment deadline, and payment method.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Read the meta rows top to bottom.

**Expected Results:**

* The four meta rows read, top to bottom: invoice number, sent-at date,
  payment deadline, payment method.
* The three original rows keep the order they already had; payment method
  never inserts among them.

## Reconciliation

**Run:** 2026-09-23 · the blind suite (TC1–TC26) and the scenario reading
(SC-1–SC-17) were taken independently from the same outline and reconciled
below. No contradiction: every finding either confirmed a scenario, exposed a
real gap the scenario pass had not written, or was a misreading/duplicate the
existing scenarios already cover.

| Finding | Disposition |
| --- | --- |
| TC1, TC8 (fully supplied document) | Already covered: `SC-1`, `SC-7` |
| TC2, TC3 (bank reference/rails given or withheld together) | Already covered: `SC-1`, `SC-2` |
| TC4 (Insurance conditional) | Already covered: `SC-3`, `SC-4` |
| TC5 (Subtotal/Order Total survive Insurance's absence) | Already covered: `SC-4` |
| TC6 (Replaced by conditional) | Already covered: `SC-5`, `SC-6` |
| TC7 (Bill To/Ship To never echo each other, invoice) | Real gap. **Folded in:** `shared-ui-invoice-and-receipt-pdf-SC-19` |
| TC9 (payment breakdown keeps all four lines at zero values) | Real gap. **Folded in:** `shared-ui-invoice-and-receipt-pdf-SC-22` |
| TC10, TC12 (manually-settled mark; Superseded invoice conditional) | Already covered: `SC-9`, `SC-10`, `SC-11`, `SC-12` |
| TC11 (payment method content renders unchanged across its variants) | **Dropped as redundant:** the general "renders exactly what is given" rule (`SC-16`, `SC-17`) already covers any field, payment method included; no field-specific scenario adds new behavior |
| TC13 (receipt's own order-value lines and Insurance conditional) | Real gap — the scenario pass had written no scenario proving `ReceiptPdf` renders its order-value lines at all. **Folded in as a new requirement:** "ReceiptPdf renders its order-value lines in the same fixed order as InvoicePdf's", scenario `SC-21` |
| TC14 (receipt ID and invoice ID never conflate) | Real gap. **Folded in:** `SC-20` |
| TC15 (Bill To/Ship To never echo each other, receipt) | Real gap. **Folded in:** `SC-29` |
| TC16, TC17 (tax line conditional on the invoice) | Already covered: `SC-13`, `SC-14` |
| TC18 (empty-content tax prop vs the prop never being passed) | Real gap, and a genuine reading nobody had settled: whether "supplied" means the prop key is present or its content is non-empty. Not costly to undo, so **decided by the round rather than paused** — see `decisions.md` Q10. **Folded in:** `SC-25` |
| TC19 (issuer tax-details conditional) | Real gap — `SC-14` only ever tested `taxLine`'s absence, never `issuerTaxDetails`'s. **Folded in:** `SC-30` |
| TC20 (tax line and issuer tax-details render independently) | Real gap. **Folded in:** `SC-24` |
| TC21 (tax line's omitted behaviour matches across both documents) | Already covered: `SC-14` (its GIVEN clause already exercises both `InvoicePdf` and `ReceiptPdf` together) |
| TC22 (rich `ReactNode` markup renders unchanged, not reduced to text) | Real gap — `SC-16` only proved no computation, never that non-string markup survives. **Folded in:** `SC-26` |
| TC23 (labels render from `copy`, non-English content) | Already covered: `SC-17` |
| TC24 (a required line with whitespace-only content still renders its row) | Real gap. **Folded in:** `SC-27` |
| TC25 (neither component shows a loading or error state) | Real gap, and a direct consequence of the "presentation-only, no data fetching" contract every `@grade10/ui` block already carries. **Folded in:** `SC-28` |
| TC26 (re-rendering with new props leaves no stale content) | **Dropped:** a generic React rendering guarantee true of any prop-driven function component, not a rule specific to this capability's export contract |
| Uncovered anchors | None — every `## Feature set` group is served by at least one scenario and walked by at least one case |
| Contradicted readings | None |

**Amendment, 2026-09-23:** the author specified Bill To/Ship To's structured
address fields after group 1 landed — a real product detail the original
readings could not have anchored on, since `billTo`/`shipTo` were still
opaque `ReactNode` at reconciliation time. `SC-31`/`SC-32` and
`TC27`/`TC28` were added directly against the new "Party address fields"
Feature set group, author-reviewed rather than run through a fresh blind
pass, since the addition is narrow and additive to an already-reconciled
capability rather than a new one.

**Amendment, group 2:** `SC-33`/`SC-34` and `TC29`/`TC30` extend the same
"Party address fields" group to `ReceiptPdf`, per the requirement's own
"InvoicePdf and ReceiptPdf SHALL render" wording — the same gap `SC-21`
closed for the order-value lines, caught before drafting rather than at
reconciliation.

**Amendment, post-landing:** the author moved bank rails from a meta row to
its own full-width section below the order-value summary, on seeing the
rendered document (`decisions.md` Q12). `SC-1`/`SC-2` were reworded in place
(same ids, same claims, corrected shape), `SC-18` moved under a new
requirement with it, and `SC-35`/`TC31` were added for the position and
width claims the move itself makes testable.

**Amendment, post-landing:** the author then asked to drop `bankReference`
entirely, redundant once `bankRails` already carries the reference
(`decisions.md` Q13). `SC-2` retired — its remaining claim (no bank rails on
a card invoice, every other row unaffected) folded into a new
`SC-36`; `SC-18` was rewritten to a dedicated "bank rails given" positive
case, since the scenario it previously proved (bank reference independent of
bank rails) no longer has a bank reference to be independent of.

**Amendment, post-landing:** the author asked for a Description/Amount
header and a divider above the order-value lines on both documents,
referencing a screenshot (`decisions.md` Q14). New requirement
"The order-value lines carry a Description/Amount header"
(`SC-37`/`SC-38`, `TC32`/`TC33`) — additive, no existing scenario's claim
changed.

**Amendment, post-landing:** the author asked for the issuer to move to the
bottom right of the sheet, referencing a screenshot (`decisions.md` Q15).
InvoicePdf's issuer moved out of the "Party blocks" SHALL line and into a new
shared requirement, "InvoicePdf and ReceiptPdf render the issuer block at the
foot of the sheet, right-aligned" (`SC-39`/`SC-40`, `TC34`/`TC35`); ReceiptPdf
gained the `issuer` prop it never had, closing the same asymmetry `SC-21` and
`SC-33`/`SC-34` closed for the order-value lines and the address fields —
additive, no existing scenario's claim changed.

**Amendment, post-landing:** the author asked to remove `replacedBy` and
`replacedByLabel` from `InvoicePdf` entirely (`decisions.md` Q16). The
requirement "InvoicePdf shows Replaced by only when given" and its scenarios
`SC-5`/`SC-6` are retired — `TC6`'s "Already covered" disposition above no
longer resolves to a live scenario, the same way `TC2`/`TC3`'s did once
`SC-2` retired under the bank-rails amendment. `winner-order/spec.md`'s
"Every invoice carries an invoice ID and a bank reference" requirement still
requires the invoice PDF to name a replacement (`SC-98`, and a line of
`SC-123`) — left untouched here, since that requirement already carries its
own MODIFIED delta in the open `define-public-auction-identifiers` change;
see `proposal.md`'s Open Questions for the reconciliation this leaves for
whoever lands that change.

**Amendment, 2026-09-24 (`decisions.md` Q18-Q20):** the DOM component this
capability specified is retired, replaced by the pdf-lib renderer `grade10`
already built and ships in production. `spec.md`'s `## Feature set` and
requirements were rewritten to describe what that renderer actually draws,
and this suite gained `TC36`-`TC42` for the behaviour that changed or is new:

- **Retired, no longer resolving to a live scenario** — `TC2`/`TC3` (bank
  rails), `TC10`/`TC12` (manually-settled mark, Superseded invoice),
  `TC16`-`TC20` (the reserved tax-line/issuer-tax-details slots), `TC22`
  (rich `ReactNode` markup — there is no JSX left to carry it, every value is
  now a plain string), and `TC25` (loading/error state — a meaningful claim
  about a React component's render cycle, not about a data-in/bytes-out
  function). None was ever exercised by a real `grade10` consumer; `SC-19`'s
  own retirement of the fields they proved is `decisions.md` Q19.
- **Superseded by new cases** — `TC27`-`TC30` proved the DOM contract's
  nine-field `PartyAddress` (including phone and state, both absent from the
  address shape `grade10`'s renderer actually takes). `TC36`-`TC38` prove
  the six-line shape it draws instead, including the "Not recorded" fallback
  the DOM contract never had, since it required an address rather than
  allowing one to be withheld entirely.
- **New** — `TC39`/`TC40` prove the transfer-reference line, a real
  behaviour `grade10`'s renderer already has that the DOM contract never
  specified. `TC41` proves the Hong Kong-time date formatting the renderer
  does itself — the one value it computes rather than taking preformatted,
  a deliberate asymmetry with money (`spec.md`'s Presentation-only contract).
  `TC42` proves the one fact every other case assumes: each call returns
  exactly one A4 page.
- **Unaffected** — every other live case (`TC1`, `TC4`-`TC9`, `TC11`, `TC13`-
  `TC15`, `TC21`, `TC23`, `TC24`, `TC31`-`TC35`) still resolves to a live
  scenario in the rewritten `spec.md`, under the same or a renumbered
  requirement; none of their claims changed.

This amendment was not run as a fresh blind pass: the round that would have
read the Feature set without sight of the scenarios is the same person who
just wrote both, for a swap already fully decided in `decisions.md`. The
retirements above are a direct, checkable consequence of `spec.md`'s own
diff, not a product judgment this suite is positioned to catch independently.

**Run, 2026-09-24 (`decisions.md` Q21):** `InvoicePdf` gains a `paymentMethod`
meta row, run as a proper two-reading pass rather than an author amendment —
a scenario reading and a test-case reading were taken independently from the
same isolated anchors (the Feature set's updated meta-rows bullet, the
journeys file, `decisions.md` Q21, the linked PRD line, and `tech-design.md`'s
implementation note), neither seeing the other's output or the existing
suite.

| Finding | Disposition |
| --- | --- |
| Payment method renders as a meta row (scenario reading's `SC-1` extension; suite reading's `TC43`) | Agreement. **Folded in:** `SC-1`'s `GIVEN` extended to include payment method; `TC43` added |
| The row appends after payment deadline rather than reordering the existing three (suite reading only — the scenario reading did not write this as a separate claim) | Real gap the suite reading caught alone: `tech-design.md`'s "appends... rather than reordering" is an independently-breakable positional contract, not implied by presence alone. **Folded in:** new requirement clause **Position**, scenario `SC-46`, `TC44` |
| A second scenario/case distinguishing "Card" from "Bank transfer" content | Both readings independently declined this: the value arrives preformatted with no branching on its content, so a second literal string would only re-prove pass-through already exercised once. **Not added** |

No contradiction, no question raised for `decisions.md`'s `## Raised` table
— both readings agreed on scope; the divergence was completeness, not a
product judgment, and resolves by folding the suite reading's extra finding
in.
