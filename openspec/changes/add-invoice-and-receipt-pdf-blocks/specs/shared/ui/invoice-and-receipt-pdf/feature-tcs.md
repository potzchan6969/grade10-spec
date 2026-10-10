# shared/ui/invoice-and-receipt-pdf Test Cases

**Status:** pending-review · 0/68
**Drafts styled:** 2026-09-23, tcs-rules r3

## shared-ui-invoice-and-receipt-pdf-US1: Invoice and Receipt PDF component contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/winner-order`, which composes the block behind the Invoice PDF control (`winner-order-SC-57`, `winner-order-SC-109`) and the Receipt PDF control (`winner-order-SC-67`)

**As a** customer,
**I want** the Invoice and Receipt PDFs I open from Winner Order to show every line and address Grade10 already committed to, from one shared component,
**so that** the document I read or download matches what the order page told me, however the page that composes it is built.

### shared-ui-invoice-and-receipt-pdf-US1-TC1-2: Fully supplied invoice renders every meta row and line

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

* `InvoicePdf` is rendered with every prop supplied as non-empty content: invoice ID, payment method (card), sent at, payment deadline, issuer, Bill To, Ship To, one item with its title, Winning Bid, Buyer's Premium and Total, the Item Total amounts, shipping & handling, insurance, subtotal, payment processing fee, order total.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Inspect the meta rows, the issuer and party blocks, the item table, and the lines under it.

**Expected Results:**

* Every meta row renders its supplied content.
* Issuer, Bill To and Ship To each render as a distinct block.
* The item row and the Item Total row render, then every charge and summary line, in the order named.

### shared-ui-invoice-and-receipt-pdf-US1-TC2-1: Card-paid invoice omits bank rails despite a bank reference

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

### shared-ui-invoice-and-receipt-pdf-US1-TC6-1: Replaces invoice renders only when given

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

| `replacesInvoice` | Replacement line |
| --- | --- |
| `{ invoiceId: "IN-LK42301" }` | Renders `Replaces invoice IN-LK42301` |
| Omitted or `null` | Does not render |

**Pre-conditions:**

* `InvoicePdf` is rendered with every other field supplied, and `replacesInvoice` set per the row.

**Steps:**

1. Render `InvoicePdf` with the row's `replacesInvoice` value.
2. Inspect the meta rows.

**Expected Results:**

* The replacement line matches the row's outcome and names the prior invoice.
* The prior invoice remains retained; this renderer does not mark it cancelled.

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

* `ReceiptPdf` is rendered with every prop supplied: receipt ID, the invoice ID it pays, payment method, Bill To, Ship To, every order-value line, and all four payment-breakdown lines.

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

### shared-ui-invoice-and-receipt-pdf-US1-TC13-2: Insurance line renders only when given on the receipt

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

* `ReceiptPdf` is rendered with the item table and every charge and summary line supplied except Insurance, which is omitted.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the lines under the item table.

**Expected Results:**

* Every charge and summary line other than Insurance renders.
* Insurance does not render.
* The remaining lines keep the same shape as `InvoicePdf`'s, under the item table: Shipping & Handling, Subtotal, Payment Processing Fee, Order Total.
* Winning Bid and Buyer's Premium appear in the item row only, not as lines under the table.

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
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with every other line supplied and `taxLine` omitted or set to `null`.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with `taxLine` supplied as a plain `PdfLineItem` labelled `Tax` with amount `HKD 12.00`.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* The tax line renders immediately before the boxed summary with the supplied label and amount.

### shared-ui-invoice-and-receipt-pdf-US1-TC18-1: A null tax line behaves like an omitted tax line

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

| `taxLine` | Tax row |
| --- | --- |
| Omitted entirely | Does not render |
| `null` | Does not render |

**Pre-conditions:**

* `InvoicePdf` is rendered with every other order-value line supplied, and `taxLine` set per the row.

**Steps:**

1. Render `InvoicePdf` with the row's `taxLine` value.
2. Inspect the order-value lines for a tax row.

**Expected Results:**

* The tax row's presence matches the row's outcome.
* Omission and `null` are both treated as absent.

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
* **Trace:** InvoicePdf export

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
* **Trace:** InvoicePdf export

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

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-8hd rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-a9o,g10.shared-invoice-and-receipt-pdf.SC-g9l,g10.shared-invoice-and-receipt-pdf.SC-kto,g10.shared-invoice-and-receipt-pdf.SC-9et,g10.shared-invoice-and-receipt-pdf.SC-lrt,g10.shared-invoice-and-receipt-pdf.SC-63o,g10.shared-invoice-and-receipt-pdf.SC-8b8,g10.shared-invoice-and-receipt-pdf.SC-i50,g10.shared-invoice-and-receipt-pdf.SC-m09,g10.shared-invoice-and-receipt-pdf.SC-8ek,g10.shared-invoice-and-receipt-pdf.SC-cys,g10.shared-invoice-and-receipt-pdf.SC-14c,g10.shared-invoice-and-receipt-pdf.SC-tt8,g10.shared-invoice-and-receipt-pdf.SC-xeu -->
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
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with every other line supplied and `taxLine` omitted or set to `null`.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* No tax line renders on the receipt.
* The optional tax-line omission behavior matches `InvoicePdf`'s.

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

* `InvoicePdf` and `ReceiptPdf` are each rendered with a copy prop naming labels in a non-English locale for every row they show, including the item table's column labels and the Item Total label.

**Steps:**

1. Render each component with the pre-conditions.
2. Inspect every rendered label.

**Expected Results:**

* Every label reads the supplied copy prop's text.
* The item table's column header and the Item Total row read the supplied text, not a built-in label.
* No row falls back to an English or other built-in label.

### shared-ui-invoice-and-receipt-pdf-US1-TC24-2: A blank amount or item title still renders its row

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

* `InvoicePdf` is rendered with the Subtotal supplied as a whitespace-only string, `<item_blank>` as its only item, `<item_total_1>` as the Item Total amounts, and every other required line supplied normally.

**Test data:**

| Field | Value |
| --- | --- |
| item_blank | An empty title, Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00`, Total `HKD 120.00` |
| item_total_1 | Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00`, Total `HKD 120.00` |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the Subtotal row.
4. Read the `<item_blank>` row in the item table.

**Expected Results:**

* Step 3: the Subtotal row still renders its label and row structure.
* Step 4: the `<item_blank>` row still renders, with `HKD 100.00`, `HKD 20.00` and `HKD 120.00` under their columns and a blank Item cell.
* Neither the Subtotal row nor the item row is silently dropped for carrying blank content.

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

### shared-ui-invoice-and-receipt-pdf-US1-TC28-1: A personal address omits optional company, phone, address line 2 and state

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

* `InvoicePdf` is rendered with a Ship To omitting company name, phone number, address line 2, and state.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the Ship To block.

**Expected Results:**

* No company name, phone number, address line 2, or state field renders, and no blank line is reserved for them.
* Full name, address line 1, city, postal code, and country still render.

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

### shared-ui-invoice-and-receipt-pdf-US1-TC30-1: A receipt's personal address omits optional company, phone, address line 2 and state

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

* `ReceiptPdf` is rendered with a Ship To omitting company name, phone number, address line 2, and state.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the Ship To block.

**Expected Results:**

* No company name, phone number, address line 2, or state field renders, and no blank line is reserved for them.
* Full name, address line 1, city, postal code, and country still render.

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
* **Status:** deprecated
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
* **Status:** deprecated
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

### shared-ui-invoice-and-receipt-pdf-US1-TC39-1: A bank-transfer receipt names its recorded provider reference

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

* A ReceiptPdf given a recorded provider reference.

**Steps:**

1. Render ReceiptPdf with the pre-conditions.
2. Inspect the Payment section.

**Expected Results:**

* The Payment section shows the recorded provider reference given.

### shared-ui-invoice-and-receipt-pdf-US1-TC40-1: A card-paid receipt shows no provider-reference line

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

* A ReceiptPdf given no recorded provider reference.

**Steps:**

1. Render ReceiptPdf with the pre-conditions.
2. Inspect the document for a Payment section.

**Expected Results:**

* No Payment section appears.
* Every other meta row and party block still renders.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-x92 rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-i53,g10.shared-invoice-and-receipt-pdf.SC-ca8,g10.shared-invoice-and-receipt-pdf.SC-0s1,g10.shared-invoice-and-receipt-pdf.SC-t8t -->
### shared-ui-invoice-and-receipt-pdf-US1-TC41-1: A date renders in Hong Kong as GMT+8

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
* The row ends in `GMT+8`.
* The row does not contain `HKT`.

### shared-ui-invoice-and-receipt-pdf-US1-TC42-2: A document whose content fits returns exactly one A4 page

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

* Valid invoice data with one item whose title fits one line, the charges Shipping & Handling and Insurance, a boxed summary, a Bill To and a Ship To of recipient, address line 1, city line and country each, and bank details for the SWIFT, FPS and HK local transfer rails.
* Valid receipt data with one item whose title fits one line, the charge Shipping & Handling, a boxed summary, a transfer reference, the four payment breakdown lines, and a Bill To and a Ship To of recipient, address line 1, city line and country each.

**Steps:**

1. Render InvoicePdf and ReceiptPdf with their respective pre-conditions.
2. Parse the returned bytes as a PDF document.
3. Inspect the page count and page size of each.
4. Read each page from the top.

**Expected Results:**

* Each returned document has exactly one page.
* Each page is sized 595.28×841.89pt (A4).
* The item table, its Item Total row, the summary and the issuer block are all on that page.
* The invoice's bank details are on its page too.
* The receipt's payment breakdown is on its page too.

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

### shared-ui-invoice-and-receipt-pdf-US1-TC45-1: A bank-transfer invoice shows the Bank details section below Order Total

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

* `InvoicePdf` is rendered with `bankRails` given (`swift` and `reference`
  supplied), alongside every other
  required prop.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Inspect the sheet immediately below the Subtotal/Payment Processing Fee/Order Total summary.

**Expected Results:**

* A full-width "Bank details" section appears directly below the
  order-value summary.
* Every other meta row, party block, the item table and the charges under
  it still render.

### shared-ui-invoice-and-receipt-pdf-US1-TC46-2: A card-paid invoice shows no Bank details section, and no gap where it would sit

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
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with no `bankRails` given (a card-paid invoice), and every other required prop supplied.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read from the boxed summary down to the issuer block.

**Expected Results:**

* No "Bank details" heading, columns, divider, or reference note appear anywhere on the sheet.
* Nothing is drawn between the boxed summary and the issuer block: no empty section, box or rule stands where the section would sit.
* The issuer block sits at the foot of the page, right-aligned, where it sits on every invoice.
* Every other section of the invoice still renders.

### shared-ui-invoice-and-receipt-pdf-US1-TC47-1: Bank details lists only enabled rails under their own headings

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

* `InvoicePdf` is rendered with `bankRails` given: `swift` (beneficiary,
  SWIFT/BIC, account) and `fps` (FPS ID, beneficiary) enabled; no
  `hkLocalTransfer` value is supplied.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Inspect the enabled columns of the Bank details section.

**Expected Results:**

* The SWIFT column shows Beneficiary, SWIFT/BIC, and Account/IBAN as the
  values given.
* The FPS column shows FPS ID and Beneficiary as the values given.
* No HK local transfer heading, details, or empty column appears.

### shared-ui-invoice-and-receipt-pdf-US1-TC48-1: The bank reference note bolds only the reference value

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

* `InvoicePdf` is rendered with `bankRails` given, `reference` set to a
  distinct value.

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Inspect the wrapped note line below the enabled rails' divider.

**Expected Results:**

* The note line names the reference given.
* Only the reference value's own text renders more heavily weighted; the
  rest of the line renders at normal weight.

### shared-ui-invoice-and-receipt-pdf-US1-TC51-1: A one-item invoice reads as one row closed by Item Total

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

* `InvoicePdf` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_total_1 | Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| labels | `Item`, `Winning Bid`, `Buyer's Premium`, `Total` and `Item Total`, supplied through `copy` |

**Steps:**

1. Render `InvoicePdf` with the supplied props and `<labels>`.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the item table from its header down to the row under the item row.
4. Read the lines under that row.

**Expected Results:**

* Step 3: the header row shows Item, Winning Bid, Buyer's Premium and Total, left to right.
* A divider sits directly under the header row, above the item row.
* One item row sits under the header, with the title, Winning Bid, Buyer's Premium and Total of `<item_1>` in their columns.
* No second item row is drawn.
* An Item Total row sits directly under the item row, with the three `<item_total_1>` amounts, one under each amount column.
* No lot title heading and no Description or Amount header appears.
* Step 4: the charges and the boxed summary follow the Item Total row.

### shared-ui-invoice-and-receipt-pdf-US1-TC52-1: Several items read as one row each in the order given

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
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with `<item_1>`, `<item_2>` and `<item_3>` as its items, in that order, `<item_total_3>` as the Item Total amounts, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_2 | The same title as `<item_1>`, Winning Bid `HKD 8,000.00`, Buyer's Premium `HKD 1,600.00`, Total `HKD 9,600.00` |
| item_3 | Title `1996 Magic The Gathering Black Lotus BGS 9.5`, Winning Bid `HKD 50,000.00`, Buyer's Premium `HKD 10,000.00`, Total `HKD 60,000.00` |
| item_total_3 | Winning Bid `HKD 158,000.00`, Buyer's Premium `HKD 31,600.00`, Total `HKD 189,600.00` |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the item table from its header down to the Item Total row.

**Expected Results:**

* Three item rows sit under one header, in the order `<item_1>`, `<item_2>`, `<item_3>`.
* Each row shows its own title, Winning Bid, Buyer's Premium and Total in its own columns.
* `<item_2>` draws as its own row although its title matches `<item_1>`'s.
* One Item Total row follows the last item row, with the three `<item_total_3>` amounts, one under each amount column.
* No other Item Total row and no second header appears on the page.

### shared-ui-invoice-and-receipt-pdf-US1-TC53-1: Charges follow the Item Total row and add no item row

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

* `InvoicePdf` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_total_1 | Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| charges_1 | Shipping & Handling `HKD 800.00`, Insurance `HKD 500.00`, and a supplied Tax line `HKD 12.00`, in that order |
| summary_1 | Subtotal `HKD 121,312.00`, Payment Processing Fee `HKD 4,000.00`, Order Total `HKD 125,312.00` |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read from the Item Total row down to the boxed summary.

**Expected Results:**

* The Shipping & Handling, Insurance and Tax rows follow the Item Total row, in that order, each with its `<charges_1>` amount.
* The boxed summary follows the Tax row and shows Subtotal, Payment Processing Fee and Order Total with the `<summary_1>` amounts.
* Order Total sits inside the same box as the other two lines, set off from them by a rule.
* Winning Bid and Buyer's Premium appear in the item row only, not as charge rows.
* The Item Total row is still the last row of the item table.

### shared-ui-invoice-and-receipt-pdf-US1-TC54-1: A long item title wraps inside its column

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with `<item_1>`, `<item_long>` and `<item_3>` as its items, in that order, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_long | Title `1999 Pokemon Base Set First Edition Shadowless Holographic Charizard 4/102 Graded PSA 10 Gem Mint From A Single Owner Collection Certified In 2019` (146 characters, wrapping to at least three lines in the Item column), Winning Bid `HKD 75,000.00`, Buyer's Premium `HKD 15,000.00`, Total `HKD 90,000.00` |
| item_3 | Title `1996 Magic The Gathering Black Lotus BGS 9.5`, Winning Bid `HKD 50,000.00`, Buyer's Premium `HKD 10,000.00`, Total `HKD 60,000.00` |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the `<item_long>` row and the rows above and below it.

**Expected Results:**

* The `<item_long>` title wraps onto several lines inside the Item column, none of it crossing into an amount column.
* The whole title reads, in order.
* Its Winning Bid, Buyer's Premium and Total sit beside the title's first line.
* The rows above and below keep their own lines, and no line overlaps another.
* The `<item_3>` row starts under the last line of the wrapped title.

### shared-ui-invoice-and-receipt-pdf-US1-TC55-1: A non-Latin item title draws in the supplied face

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with `<item_1>` and `<item_cjk>` as its items, in that order, `<face>` supplied as the embedded font, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_cjk | Title `1999 寶可夢 初版 噴火龍 PSA 10`, Winning Bid `HKD 30,000.00`, Buyer's Premium `HKD 6,000.00`, Total `HKD 36,000.00` |
| face | A font file that carries every character of the `<item_cjk>` title, such as a Traditional Chinese face |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Compare the `<item_cjk>` row with the `<item_1>` row.

**Expected Results:**

* Every character of the `<item_cjk>` title draws as a glyph of `<face>`, with no blank or placeholder box.
* The `<item_cjk>` title sits in the Item column and its amounts in the amount columns.
* The amount columns of the two rows line up.

### shared-ui-invoice-and-receipt-pdf-US1-TC56-1: A one-item receipt shows its table above the payment breakdown

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

* `ReceiptPdf` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<breakdown_1>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_total_1 | Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| charges_1 | Shipping & Handling `HKD 800.00`, Insurance `HKD 500.00`, and a supplied Tax line `HKD 12.00`, in that order |
| summary_1 | Subtotal `HKD 121,312.00`, Payment Processing Fee `HKD 4,000.00`, Order Total `HKD 125,312.00` |
| breakdown_1 | Original Invoice Total `HKD 125,312.00`, Previous Payments `HKD 0.00`, Current Payment Received `HKD 125,312.00`, Remaining Balance Due `HKD 0.00` |

**Steps:**

1. Render `ReceiptPdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read from the item table header down to the foot of the payment breakdown.

**Expected Results:**

* The header row, a divider under it, one `<item_1>` row and the Item Total row with the `<item_total_1>` amounts come first, in that order.
* No lot title heading and no Description or Amount header appears.
* The charge rows and the boxed summary follow, with their supplied amounts.
* The payment breakdown follows the summary: Original Invoice Total, Previous Payments, Current Payment Received, Remaining Balance Due, in that order, with the `<breakdown_1>` amounts.

### shared-ui-invoice-and-receipt-pdf-US1-TC57-1: Several items read as one receipt row each in the order given

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

* `ReceiptPdf` is rendered with `<item_1>`, `<item_2>` and `<item_3>` as its items, in that order, `<item_total_3>` as the Item Total amounts, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_2 | The same title as `<item_1>`, Winning Bid `HKD 8,000.00`, Buyer's Premium `HKD 1,600.00`, Total `HKD 9,600.00` |
| item_3 | Title `1996 Magic The Gathering Black Lotus BGS 9.5`, Winning Bid `HKD 50,000.00`, Buyer's Premium `HKD 10,000.00`, Total `HKD 60,000.00` |
| item_total_3 | Winning Bid `HKD 158,000.00`, Buyer's Premium `HKD 31,600.00`, Total `HKD 189,600.00` |

**Steps:**

1. Render `ReceiptPdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the item table from its header down to the Item Total row.

**Expected Results:**

* Three item rows sit under one header, in the order `<item_1>`, `<item_2>`, `<item_3>`.
* Each row shows its own title, Winning Bid, Buyer's Premium and Total in its own columns.
* `<item_2>` draws as its own row although its title matches `<item_1>`'s.
* One Item Total row follows the last item row, with the three `<item_total_3>` amounts, one under each amount column.
* The column order and labels match the invoice's item table.

### shared-ui-invoice-and-receipt-pdf-US1-TC58-1: Long and non-Latin item titles keep the receipt row layout

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with the row's item as its only item, the row's embedded font, and every other required prop supplied.

**Test data:**

| Item | Embedded font | Item row |
| --- | --- | --- |
| Title `1999 Pokemon Base Set First Edition Shadowless Holographic Charizard 4/102 Graded PSA 10 Gem Mint From A Single Owner Collection Certified In 2019` (146 characters), Winning Bid `HKD 75,000.00`, Buyer's Premium `HKD 15,000.00`, Total `HKD 90,000.00` | Not supplied | The title wraps onto at least three lines inside the Item column, and the three amounts sit beside its first line |
| Title `1999 寶可夢 初版 噴火龍 PSA 10`, Winning Bid `HKD 30,000.00`, Buyer's Premium `HKD 6,000.00`, Total `HKD 36,000.00` | A font file that carries every character of the title | Every character draws as a glyph of the supplied font, and the three amounts sit in their columns on the title's line |
| Title `ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ` (78 letters, no space), Winning Bid `HKD 50,000.00`, Buyer's Premium `HKD 10,000.00`, Total `HKD 60,000.00` | Not supplied | The title breaks inside the word onto at least two lines, and the three amounts sit beside its first line |

**Steps:**

1. Render `ReceiptPdf` with the row's item and embedded font.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the item row and the row under it.

**Expected Results:**

* The item row matches the row's outcome.
* No part of the title crosses into an amount column.
* The Item Total row sits directly under the item row.

### shared-ui-invoice-and-receipt-pdf-US1-TC59-1: A table at the page limit stays on one page

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `InvoicePdf` is rendered with `<items_fit>` items, `<item_total_n>` as the Item Total amounts, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| items_fit | The largest count of items for which `InvoicePdf` returns one page: render 1, 2, 3, ... items until the page count first reads 2, and take the count before it. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |

**Steps:**

1. Find `<items_fit>` by rendering `InvoicePdf` with 1, 2, 3, ... items until it returns two pages.
2. Render `InvoicePdf` with `<items_fit>` items.
3. Parse the returned bytes as a PDF document.
4. Count the pages and read the size of each.
5. Read page 1 from the table header to the foot.

**Expected Results:**

* Step 4 shows one page, sized A4.
* The last item row, the Item Total row, the boxed summary and the issuer block are all on page 1.
* No two of these overlap.

### shared-ui-invoice-and-receipt-pdf-US1-TC60-1: One item past the page limit adds a second page

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `InvoicePdf` is rendered with `<items_over>` items, `<item_total_n>` as the Item Total amounts, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| items_fit | The largest count of items for which `InvoicePdf` returns one page: render 1, 2, 3, ... items until the page count first reads 2, and take the count before it. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| items_over | `<items_fit>` plus 1, titled and priced as `<items_fit>` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |

**Steps:**

1. Find `<items_fit>` by rendering `InvoicePdf` with 1, 2, 3, ... items until it returns two pages.
2. Render `InvoicePdf` with `<items_over>` items.
3. Parse the returned bytes as a PDF document.
4. Count the pages and read the size of each.
5. Read each page from the top.

**Expected Results:**

* Step 4 shows two pages, not three.
* Each page is sized A4.
* The item rows `Lot 001` to `Lot <items_over>` each appear once across the two pages, in order.
* The Item Total row and the boxed summary each appear once across the two pages.

### shared-ui-invoice-and-receipt-pdf-US1-TC61-1: A continuation page repeats the column header

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
* **Trace:** Document shape

**Pre-conditions:**

* `InvoicePdf` is rendered with `<items_two>` items, `<item_total_n>` as the Item Total amounts, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| items_fit | The largest count of items for which `InvoicePdf` returns one page: render 1, 2, 3, ... items until the page count first reads 2, and take the count before it. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| items_two | The smallest count of items for which `InvoicePdf` returns two pages and page 2 holds at least three item rows: from `<items_fit>`, add items one at a time. Titled and priced as `<items_fit>` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |

**Steps:**

1. Find `<items_two>` by adding items to `<items_fit>`, one at a time, until page 2 holds three item rows.
2. Render `InvoicePdf` with `<items_two>` items.
3. Parse the returned bytes as a PDF document.
4. Read page 1 and page 2 from the top.

**Expected Results:**

* Page 1 shows the column header once, above `Lot 001`.
* Page 2 shows the same four column labels, with a divider under them, above its first item row.
* The item rows `Lot 001` to `Lot <items_two>` each appear once across the pages, in order.
* The Item Total row appears once, after `Lot <items_two>`.

### shared-ui-invoice-and-receipt-pdf-US1-TC62-1: Every continuation page of a three-page table repeats the header

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `InvoicePdf` is rendered with `<items_three>` items, `<item_total_n>` as the Item Total amounts, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| items_two | The smallest count of items for which `InvoicePdf` returns two pages and page 2 holds at least three item rows: from the largest count that returns one page, add items one at a time. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| items_three | The smallest count of items for which `InvoicePdf` returns three pages and page 3 holds at least three item rows: from `<items_two>`, add items one at a time. Titled and priced as `<items_two>` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |

**Steps:**

1. Find `<items_three>` by adding items to `<items_two>`, one at a time, until the document has three pages with three item rows on page 3.
2. Render `InvoicePdf` with `<items_three>` items.
3. Parse the returned bytes as a PDF document.
4. Count the pages and read the size of each.
5. Read each page from the top.

**Expected Results:**

* Step 4 shows three pages, each sized A4.
* Pages 2 and 3 each show the column header, with a divider under it, above their first item row.
* The item rows `Lot 001` to `Lot <items_three>` each appear once across the pages, in order.
* The Item Total row appears once, after the last item row.

### shared-ui-invoice-and-receipt-pdf-US1-TC63-1: An item row never splits across a page end

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
* **Trace:** Document shape

**Pre-conditions:**

* `<renderer>` is rendered with `<items_two>` items, the item at each position in `<p>` replaced in turn by `<item_long>`, `<item_total_n>` as the Item Total amounts, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| renderer | `InvoicePdf`, then `ReceiptPdf`, one full pass each |
| items_two | The smallest count of items for which `<renderer>` returns two pages and page 2 holds at least three item rows: from the largest count that returns one page, add items one at a time. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_long | Title `1999 Pokemon Base Set First Edition Shadowless Holographic Charizard 4/102 Graded PSA 10 Gem Mint From A Single Owner Collection Certified In 2019` (146 characters, wrapping to at least three lines in the Item column), Winning Bid `HKD 75,000.00`, Buyer's Premium `HKD 15,000.00`, Total `HKD 90,000.00` |
| p_last | The position of the last item row on page 1 when `<renderer>` renders `<items_two>` items without `<item_long>` |
| p | Each position from `<p_last>` minus 4 to `<p_last>` plus 1, one render per position |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |

**Steps:**

1. Render `<renderer>` with `<items_two>` items and note `<p_last>`.
2. Render `<renderer>` again with `<item_long>` in place of the item at the first position in `<p>`.
3. Parse the returned bytes as a PDF document.
4. Find the page of each title line of `<item_long>` and of its three amounts.
5. Repeat steps 2 to 4 for each other position in `<p>`.
6. Repeat steps 1 to 5 for the other renderer.

**Expected Results:**

* At every position, every title line and the three amounts of `<item_long>` sit on one page.
* A row that does not fit the room left on page 1 starts page 2, under the repeated column header.
* In that case page 1 ends after the row above it, with no line of `<item_long>` beneath.
* The other item rows each appear once across the pages, in order.

### shared-ui-invoice-and-receipt-pdf-US1-TC64-1: Item Total, the charges and the summary stay together at a page end

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `InvoicePdf` is rendered once for each count in `<n>`, with `<item_total_n>` as the Item Total amounts, `<charges_1>` as the charges, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| items_fit | The largest count of items for which `InvoicePdf` returns one page: render 1, 2, 3, ... items with `<charges_1>` until the page count first reads 2, and take the count before it. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| items_two | The smallest count of items for which `InvoicePdf` returns two pages and page 2 holds at least three item rows: from `<items_fit>`, add items one at a time. Titled and priced as `<items_fit>` |
| n | Each count from `<items_fit>` to `<items_two>`, one render per count, titled and priced as `<items_fit>` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| charges_1 | Shipping & Handling `HKD 800.00`, Insurance `HKD 500.00`, and a supplied Tax line `HKD 12.00`, in that order |

**Steps:**

1. Find `<items_fit>` and `<items_two>` by adding items one at a time.
2. Render `InvoicePdf` with the first count in `<n>`.
3. Parse the returned bytes as a PDF document.
4. Find the page of the Item Total row, of the Shipping & Handling, Insurance and Tax rows, and of the Subtotal, Payment Processing Fee and Order Total lines, and read the lines under the column header on each page after the first.
5. Repeat steps 2 to 4 for each other count in `<n>`.

**Expected Results:**

* At every count, the Item Total row, the three charge rows and the three summary lines sit on one page.
* The Item Total row is never the last row on a page with the charges or the summary starting the next.
* The three charge rows keep their order, between the Item Total row and the summary.
* The three summary lines sit inside one box, whole.
* At least one count puts the last item row on page 1 and the Item Total row on page 2.
* On that page 2 the column header, with a divider under it, comes first and the Item Total row follows it, with no item row between them.

### shared-ui-invoice-and-receipt-pdf-US1-TC65-1: A receipt's totals and payment breakdown stay whole at a page end

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `ReceiptPdf` is rendered once for each count in `<m>`, with `<item_total_n>` as the Item Total amounts, `<charges_1>` as the charges, `<breakdown_1>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| receipt_items_fit | The largest count of items for which `ReceiptPdf` returns one page: render 1, 2, 3, ... items with `<charges_1>` until the page count first reads 2, and take the count before it. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| receipt_items_two | The smallest count of items for which `ReceiptPdf` returns two pages and page 2 holds at least three item rows: from `<receipt_items_fit>`, add items one at a time. Titled and priced as `<receipt_items_fit>` |
| m | Each count from `<receipt_items_fit>` to `<receipt_items_two>`, one render per count, titled and priced as `<receipt_items_fit>` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| charges_1 | Shipping & Handling `HKD 800.00`, Insurance `HKD 500.00`, and a supplied Tax line `HKD 12.00`, in that order |
| breakdown_1 | Original Invoice Total `HKD 125,312.00`, Previous Payments `HKD 0.00`, Current Payment Received `HKD 125,312.00`, Remaining Balance Due `HKD 0.00` |

**Steps:**

1. Find `<receipt_items_fit>` and `<receipt_items_two>` by adding items one at a time.
2. Render `ReceiptPdf` with the first count in `<m>`.
3. Parse the returned bytes as a PDF document.
4. Find the page of the Item Total row, of the Shipping & Handling, Insurance and Tax rows, of the Subtotal, Payment Processing Fee and Order Total lines, and of each of the four payment breakdown lines, and read the lines under the column header on each page after the first.
5. Repeat steps 2 to 4 for each other count in `<m>`.

**Expected Results:**

* At every count, the Item Total row, the three charge rows and the three summary lines sit on one page.
* At every count, the four breakdown lines sit on one page, none left on the page before.
* The lines read Original Invoice Total, Previous Payments, Current Payment Received, Remaining Balance Due, in that order, each with its `<breakdown_1>` amount.
* A breakdown that does not fit below the summary starts the next page as four lines, and none stays beside the summary.
* At least one count puts the last item row on page 1 and the Item Total row on page 2.
* On that page 2 the column header, with a divider under it, comes first and the Item Total row follows it, with no item row between them.

### shared-ui-invoice-and-receipt-pdf-US1-TC66-1: A receipt's item table continues on a further page under the header

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
* **Trace:** Document shape

**Pre-conditions:**

* `ReceiptPdf` is rendered with `<receipt_items_two>` items, `<item_total_n>` as the Item Total amounts, `<breakdown_1>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| receipt_items_two | The smallest count of items for which `ReceiptPdf` returns two pages and page 2 holds at least three item rows: from the largest count that returns one page, add items one at a time. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| breakdown_1 | Original Invoice Total `HKD 125,312.00`, Previous Payments `HKD 0.00`, Current Payment Received `HKD 125,312.00`, Remaining Balance Due `HKD 0.00` |

**Steps:**

1. Find `<receipt_items_two>` by adding items one at a time until page 2 holds three item rows.
2. Render `ReceiptPdf` with `<receipt_items_two>` items.
3. Parse the returned bytes as a PDF document.
4. Count the pages and read the size of each.
5. Read page 1 and page 2 from the top.

**Expected Results:**

* Step 4 shows two pages, each sized A4.
* Page 1 shows the column header once, above `Lot 001`.
* Page 2 shows the same four column labels, with a divider under them, above its first item row.
* The item rows `Lot 001` to `Lot <receipt_items_two>` each appear once across the pages, in order.
* The Item Total row appears once, after the last item row, and the payment breakdown follows the summary.

### shared-ui-invoice-and-receipt-pdf-US1-TC67-1: A multi-page invoice carries the issuer block once, on the last page

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
* **Trace:** Document shape

**Pre-conditions:**

* `InvoicePdf` is rendered with `<items_three>` items, `<issuer>` as the issuer, `<item_total_n>` as the Item Total amounts, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| items_three | The smallest count of items for which `InvoicePdf` returns three pages and page 3 holds at least three item rows: from the largest count that returns two pages, add items one at a time. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| issuer | Name `Issuer Co`, email `billing@example.com`. The name has no wordmark on file, so page 1 also draws it as text at the top right as the issuer mark. The issuer block is found by its email, with the name on the line directly above it |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |

**Steps:**

1. Find `<items_three>` by adding items one at a time until the document has three pages with three item rows on page 3.
2. Render `InvoicePdf` with `<items_three>` items.
3. Parse the returned bytes as a PDF document.
4. Search each page for the issuer email.
5. Read the position of the issuer email and of the line directly above it on the last page.

**Expected Results:**

* The issuer email appears once in the document, on page 3.
* Pages 1 and 2 carry no issuer email.
* On page 3 the line directly above the issuer email is the issuer name.
* The issuer block sits at the foot of page 3, right-aligned.

### shared-ui-invoice-and-receipt-pdf-US1-TC68-1: A multi-page receipt carries the issuer block once, on the last page

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
* **Trace:** Document shape

**Pre-conditions:**

* `ReceiptPdf` is rendered with `<receipt_items_two>` items, `<issuer>` as the issuer, `<item_total_n>` as the Item Total amounts, `<breakdown_1>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| receipt_items_two | The smallest count of items for which `ReceiptPdf` returns two pages and page 2 holds at least three item rows: from the largest count that returns one page, add items one at a time. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| issuer | Name `Issuer Co`, email `billing@example.com`. The name has no wordmark on file, so page 1 also draws it as text at the top right as the issuer mark. The issuer block is found by its email, with the name on the line directly above it |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| breakdown_1 | Original Invoice Total `HKD 125,312.00`, Previous Payments `HKD 0.00`, Current Payment Received `HKD 125,312.00`, Remaining Balance Due `HKD 0.00` |

**Steps:**

1. Find `<receipt_items_two>` by adding items one at a time until page 2 holds three item rows.
2. Render `ReceiptPdf` with `<receipt_items_two>` items.
3. Parse the returned bytes as a PDF document.
4. Search each page for the issuer email.
5. Read the position of the issuer email and of the line directly above it on page 2.

**Expected Results:**

* The issuer email appears once in the document, on page 2.
* Page 1 carries no issuer email.
* On page 2 the line directly above the issuer email is the issuer name.
* The issuer block sits at the foot of page 2, right-aligned.

### shared-ui-invoice-and-receipt-pdf-US1-TC69-1: The block draws every item amount as supplied and computes none

Runs once per row of **Test data**.

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
* **Trace:** Presentation-only contract

**Pre-conditions:**

* The row's renderer is rendered with the row's two items and Item Total amounts, and every other required prop supplied.

**Test data:**

| Renderer | Item 1 (title `Lot A`): Winning Bid / Buyer's Premium / Total | Item 2 (title `Lot B`): Winning Bid / Buyer's Premium / Total | Item Total: Winning Bid / Buyer's Premium / Total | Cell drawn |
| --- | --- | --- | --- | --- |
| `InvoicePdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 120,000.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 1.00` / `HKD 30,000.00` / `HKD 180,000.00` | Item Total row, Winning Bid column: `HKD 1.00` |
| `InvoicePdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 7.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 150,000.00` / `HKD 30,000.00` / `HKD 180,000.00` | Lot A row, Total column: `HKD 7.00` |
| `InvoicePdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 120,000.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 150,000.00` / `HKD 30,000.00` / `180000.5` | Item Total row, Total column: `180000.5` |
| `ReceiptPdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 120,000.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 1.00` / `HKD 30,000.00` / `HKD 180,000.00` | Item Total row, Winning Bid column: `HKD 1.00` |

**Steps:**

1. Render the row's renderer with the row's items and Item Total amounts.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the cell the row names.
4. Read every other amount cell in the item table.

**Expected Results:**

* The named cell reads exactly the supplied string.
* Every other amount cell reads its own supplied string.
* No cell shows a sum, a difference or a reformatted amount.

### shared-ui-invoice-and-receipt-pdf-US1-TC70-1: A word wider than the Item column breaks inside the word

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with `<item_word>` and `<item_serial>` as its items, in that order, `<item_total_2>` as the Item Total amounts, no embedded font, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| word | `ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ` (78 letters, no space, wider than the Item column) |
| item_word | Title `<word>`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |
| item_serial | Title `Serial <word> PSA-10`, Winning Bid `HKD 50,000.00`, Buyer's Premium `HKD 10,000.00`, Total `HKD 60,000.00` |
| item_total_2 | Winning Bid `HKD 150,000.00`, Buyer's Premium `HKD 30,000.00`, Total `HKD 180,000.00` |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read every line drawn for `<item_word>` and for `<item_serial>`, and the left edge of the Winning Bid column.

**Expected Results:**

* The `<item_word>` title is drawn on more than one line, and every line stops short of the Winning Bid column.
* The `<item_serial>` title is drawn on more than one line, and every line stops short of the Winning Bid column.
* Each item's three amounts are drawn once, on the first line of its title.
* The first line of the `<item_serial>` title starts with `Serial`, and its last line ends with `PSA-10`.

### shared-ui-invoice-and-receipt-pdf-US1-TC71-1: A wide amount widens its column and still draws whole

**Classification:**

* **Severity:** major
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

* `<renderer>` is rendered with `<item_wide>` and `<item_small>` as its items, in that order, `<item_total_wide>` as the Item Total amounts, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| renderer | `InvoicePdf`, then `ReceiptPdf`, one full pass each |
| item_wide | Title `Lot A`, Winning Bid `HKD 12,345,678.00`, Buyer's Premium `HKD 2,469,135.60`, Total `HKD 14,814,813.60` |
| item_small | Title `Lot B`, Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00`, Total `HKD 120.00` |
| item_total_wide | Winning Bid `HKD 12,345,778.00`, Buyer's Premium `HKD 2,469,155.60`, Total `HKD 14,814,933.60` |

**Steps:**

1. Render `<renderer>` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read every amount of the item table, from the header down to the Item Total row, with its position and size.
4. Repeat steps 1 to 3 for the other renderer.

**Expected Results:**

* Every amount of the table is drawn whole, on one line, in the same size as the other amounts of that table.
* No amount overlaps another amount or the title beside it.
* The amounts of each amount column, the Item Total row included, end at one right edge.

### shared-ui-invoice-and-receipt-pdf-US1-TC72-1: A continuation page repeats the column header and nothing else

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `<renderer>` is rendered with `<items_100>` as its items, `<item_total_100>` as the Item Total amounts, `<recipient>` as the Bill To and Ship To recipient, `<document_number>` as its number, `<issuer>` as the issuer, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| renderer | `InvoicePdf`, then `ReceiptPdf`, a full pass each for each issuer |
| document_number | `IN-LK42301` on the invoice, `RC-CN8HK01P1` on the receipt |
| recipient | `Chan Tai Man` |
| issuer | First `Grade10`, which has a wordmark on file, so page 1 draws the wordmark at the top right; then `Issuer Co`, which has none, so page 1 draws the name as text at the top right; email `billing@example.com` on both |
| items_100 | 100 items titled `Lot 001` to `Lot 100` in that order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_100 | Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` |

**Steps:**

1. Render `<renderer>` with the supplied props.
2. Parse the returned bytes as a PDF document.
3. Read pages 2 and 3 from the top, and list every text drawn above the column header on each; note on which pages the `Grade10` wordmark is drawn.
4. Search every page for a page number or a continuation note.
5. Repeat steps 1 to 4 for the other renderer and for the other issuer.

**Expected Results:**

* Step 3: pages 2 and 3 each show the column header and item rows, so the document runs to at least three pages.
* No text is drawn above the column header on page 2 or page 3, so those pages show no document title, no meta row, and no Bill To or Ship To heading, and `Issuer Co` is not drawn above the column header on any page after the first.
* With `Grade10` as the issuer, the wordmark is drawn on page 1 and on no other page.
* Pages 2 and 3 show neither `<document_number>` nor `<recipient>`.
* Step 4: no page of the document shows a page number or a continuation note.

### shared-ui-invoice-and-receipt-pdf-US1-TC73-1: Bank details move to the next page whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `InvoicePdf` is rendered once for each count in `<n>`, with `<bank_1>` as the bank details, `<summary_1>` as the summary, `<item_total_n>` as the Item Total amounts, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| n | Each count of items from 1 to 40, one render per count. Items are titled `Lot 01`, `Lot 02`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| summary_1 | Subtotal `HKD 121,312.00`, Payment Processing Fee `HKD 4,000.00`, Order Total `HKD 125,312.00` |
| bank_1 | `swift`: beneficiary `Test Beneficiary Ltd`, SWIFT/BIC `TESTHKHH`, account `000-123456-001`. `fps`: FPS ID `1234567`, beneficiary `Test Beneficiary Ltd`. `hkLocalTransfer`: bank and code `Test Bank 000`, beneficiary `Test Beneficiary Ltd`, account no. `123-456789-001`. `reference`: `IN-LK42301` |

**Steps:**

1. Render `InvoicePdf` with the first count in `<n>`.
2. Parse the returned bytes as a PDF document.
3. Find the page of the boxed summary, of the Bank details heading, of each of the three rails and of the reference note.
4. Repeat steps 1 to 3 for each other count in `<n>`.

**Expected Results:**

* At every count, the Bank details heading, the three rails and the reference note sit on one page.
* At least one count puts the boxed summary on one page and the whole Bank details section on the next.
* In that case no part of the section stays beside the summary.

### shared-ui-invoice-and-receipt-pdf-US1-TC74-1: A receipt's Payment section moves to the next page whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Document shape

**Pre-conditions:**

* `ReceiptPdf` is rendered once for each count in `<n>`, with `<transfer_reference>` as the transfer reference, `<summary_1>` as the summary, `<breakdown_1>` as the payment breakdown, `<item_total_n>` as the Item Total amounts, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| n | Each count of items from 1 to 40, one render per count. Items are titled `Lot 01`, `Lot 02`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| summary_1 | Subtotal `HKD 121,312.00`, Payment Processing Fee `HKD 4,000.00`, Order Total `HKD 125,312.00` |
| breakdown_1 | Original Invoice Total `HKD 125,312.00`, Previous Payments `HKD 0.00`, Current Payment Received `HKD 125,312.00`, Remaining Balance Due `HKD 0.00` |
| transfer_reference | `TRF-7731` |

**Steps:**

1. Render `ReceiptPdf` with the first count in `<n>`.
2. Parse the returned bytes as a PDF document.
3. Find the page of the boxed summary, of the Payment heading, of the transfer reference label and of `<transfer_reference>`.
4. Repeat steps 1 to 3 for each other count in `<n>`.

**Expected Results:**

* At every count, the Payment heading, the transfer reference label and `<transfer_reference>` sit on one page.
* At least one count puts the boxed summary on one page and the whole Payment section on the next.
* In that case no part of the section stays beside the summary.

### shared-ui-invoice-and-receipt-pdf-US1-TC75-1: The issuer block never stands alone on a page

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
* **Trace:** Document shape

**Pre-conditions:**

* `<renderer>` is rendered once for each count in `<n>`, with `<charges_2>` as the charges, `<summary_1>` as the summary, `<item_total_n>` as the Item Total amounts, `<issuer>` as the issuer, no bank details, and, for `ReceiptPdf`, `<breakdown_1>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| renderer | `InvoicePdf`, then `ReceiptPdf`, one full pass each |
| n | Each count of items from 1 to 40, one render per count. Items are titled `Lot 01`, `Lot 02`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| charges_2 | Shipping & Handling `HKD 80.00` and Insurance `HKD 40.00`, in that order |
| summary_1 | Subtotal `HKD 121,312.00`, Payment Processing Fee `HKD 4,000.00`, Order Total `HKD 125,312.00` |
| breakdown_1 | Original Invoice Total `HKD 125,312.00`, Previous Payments `HKD 0.00`, Current Payment Received `HKD 125,312.00`, Remaining Balance Due `HKD 0.00`, supplied to `ReceiptPdf` only |
| issuer | Name `Issuer Co`, email `billing@example.com`. The name has no wordmark on file, so page 1 also draws it as text at the top right as the issuer mark. The issuer block is found by its email, with the name on the line directly above it |

**Steps:**

1. Render `<renderer>` with the first count in `<n>`.
2. Parse the returned bytes as a PDF document.
3. Find the page of the issuer email, of the boxed summary and, on a receipt, of each of the four payment breakdown lines, and read every line drawn on the issuer email's page.
4. Repeat steps 1 to 3 for each other count in `<n>`.
5. Repeat steps 1 to 4 for the other renderer.

**Expected Results:**

* At every count, the page that shows the issuer email also shows the boxed summary.
* On a receipt, that page also shows the four payment breakdown lines.
* On that page, no line of another section is drawn at or below the name line of the issuer block, the line directly above the issuer email.
* At least one count of each renderer runs onto a second page.

### shared-ui-invoice-and-receipt-pdf-US1-TC76-1: The issuer block sits in the same place on every document

Runs once per row of **Test data**.

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
* **Trace:** Document shape

**Pre-conditions:**

* Both documents are rendered with the issuer name `Issuer Co` and email `billing@example.com` (the name has no wordmark on file, so page 1 also draws it as text at the top right; the issuer block is found by its email, with the name on the line directly above it), items titled `Lot 01`, `Lot 02`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00`, Item Total amounts Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, and every other required prop supplied.
* Bank details, where the row gives them, are a SWIFT rail (beneficiary `Test Beneficiary Ltd`, SWIFT/BIC `TESTHKHH`, account `000-123456-001`), an FPS rail (FPS ID `1234567`, beneficiary `Test Beneficiary Ltd`), an HK local transfer rail (bank and code `Test Bank 000`, beneficiary `Test Beneficiary Ltd`, account no. `123-456789-001`) and the reference `IN-LK42301`. A transfer reference, where the row gives one, is `TRF-7731`.

**Test data:**

| Document | Compared with |
| --- | --- |
| `InvoicePdf` with one item and bank details | `InvoicePdf` with one item and no bank details |
| `InvoicePdf` with 30 items and no bank details | `InvoicePdf` with one item and no bank details |
| `ReceiptPdf` with 30 items and no transfer reference | `ReceiptPdf` with one item and no transfer reference |
| `ReceiptPdf` with one item and a transfer reference | `ReceiptPdf` with one item and no transfer reference |

**Steps:**

1. Render the row's compared document.
2. Parse the returned bytes as a PDF document and read the x and y of the issuer email and of the line directly above it on its last page.
3. Render the row's document with the same issuer.
4. Parse the returned bytes as a PDF document and read the x and y of the issuer email and of the line directly above it on its last page.

**Expected Results:**

* Step 4: the issuer email and the line directly above it sit at the same x and y as in step 2.
* The block sits at the foot of the last page, right-aligned, name above email.

### shared-ui-invoice-and-receipt-pdf-US1-TC77-1: The same data renders to the same bytes

**Classification:**

* **Severity:** major
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

* `<renderer>` is rendered twice with the same props: `<items_30>` as its items, `<item_total_30>` as the Item Total amounts, and every other required prop supplied. The system clock reads one day later for the second render.

**Test data:**

| Field | Value |
| --- | --- |
| renderer | `InvoicePdf`, then `ReceiptPdf`, one full pass each |
| items_30 | 30 items titled `Lot 01` to `Lot 30` in that order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_30 | Winning Bid `HKD 30,000.00`, Buyer's Premium `HKD 6,000.00`, Total `HKD 36,000.00` |

**Steps:**

1. Render `<renderer>` with the supplied props and keep the returned bytes.
2. Set the system clock one day later.
3. Render `<renderer>` again with the same props and keep the returned bytes.
4. Compare the two byte sequences.
5. Repeat steps 1 to 4 for the other renderer.

**Expected Results:**

* The two outputs of each renderer are identical, byte for byte.

### shared-ui-invoice-and-receipt-pdf-US1-TC78-1: A document with no items fails to render

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `<renderer>` is called with an empty item list, `<item_total_1>` as the Item Total amounts, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| renderer | `InvoicePdf`, then `ReceiptPdf`, one call each |
| item_total_1 | Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00`, Total `HKD 120.00` |

**Steps:**

1. Call `<renderer>` with the supplied props.
2. Read the outcome of the call.
3. Repeat steps 1 and 2 for the other renderer.

**Expected Results:**

* Each call rejects with an error.
* No PDF bytes are returned.
* The error says that no items were given.

### shared-ui-invoice-and-receipt-pdf-US1-TC79-1: A title the standard font cannot draw fails to render

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` and `ReceiptPdf` are each called with the row's title as the only item, with Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00` and Total `HKD 120.00`, the same three amounts as the Item Total, no embedded font, and every other required prop supplied.

**Test data:**

| Item title |
| --- |
| `中8號` (Chinese characters) |
| `Лот 8` (Cyrillic letters) |

**Steps:**

1. Call `InvoicePdf` with the row's title and no embedded font.
2. Read the outcome of the call.
3. Repeat steps 1 and 2 for `ReceiptPdf`.

**Expected Results:**

* Each call rejects with an error.
* No PDF bytes are returned, so no placeholder glyph or box stands in for a character of the title.

### shared-ui-invoice-and-receipt-pdf-US1-TC80-1: A table that cannot fit a page fails to render

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` and `ReceiptPdf` are each called with the row's data, the item's own three amounts as the Item Total, and every other required prop supplied normally.

**Test data:**

| Document data | Part the error names |
| --- | --- |
| One item titled `Lot A` whose Winning Bid, Buyer's Premium and Total are each `HKD 12345678901234567890123456789012345678901234567890123456` (60 characters) | The amounts |
| One item whose title is the word `lot` repeated 2,500 times with a space between, with Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00` and Total `HKD 120.00` | The item row |
| One item titled `Lot A` with Winning Bid `HKD 100.00`, Buyer's Premium `HKD 20.00` and Total `HKD 120.00`, and 120 charges labelled `Charge 001` to `Charge 120`, each `HKD 1.00`, between the Item Total row and the boxed summary | The Item Total row with its charges |

**Steps:**

1. Call `InvoicePdf` with the row's data.
2. Read the outcome of the call.
3. Repeat steps 1 and 2 for `ReceiptPdf`.

**Expected Results:**

* Each call rejects with an error.
* No PDF bytes are returned.
* The error names the part in the row's second column as the one that does not fit.

## Settled

- A continuation page repeats the column header and its divider and nothing else: no document title, no issuer mark, no meta row, no Bill To or Ship To, and no page of the document carries a page number or a continuation note (`add-invoice-and-receipt-pdf-blocks` Q36, Q38).
- A page that holds only the Item Total row, the charges and the summary repeats the column header above them, and no item row is moved over to sit with them (`add-invoice-and-receipt-pdf-blocks` Q38).
- The charges and the Tax line stay with the Item Total row and the summary on one page (`add-invoice-and-receipt-pdf-blocks` Q34, Q38).
- A document given no items is refused: the call fails with an error that says so and returns no PDF. It is not drawn as a header and an Item Total row (`add-invoice-and-receipt-pdf-blocks` Q38).
- A title the standard font cannot draw, with no embedded font supplied, fails the render. No placeholder glyph is drawn and no character is dropped (`add-invoice-and-receipt-pdf-blocks` Q38).
- A document that cannot fit fails the render and the error names which part does not fit: the amount columns, an item row, or the Item Total row with its charges. Nothing is cut, split or shrunk (`add-invoice-and-receipt-pdf-blocks` Q39).
- All three Item Total amounts are required; none may be missing (`add-invoice-and-receipt-pdf-blocks` Q38).
- Bank details and a receipt's Payment section each stay whole across a page end (`add-invoice-and-receipt-pdf-blocks` Q38).
- The issuer block is drawn once, on the last page only, pinned to that page's bottom edge, so it sits in the same place on every document. The last page keeps room for it, so it never takes a page of its own (`add-invoice-and-receipt-pdf-blocks` Q36, Q38).
- A PDF already stored keeps the layout it was stored in. The archive keeps the bytes of the first open, and the first open after this ships draws the table. Nothing is redrawn or purged (`add-invoice-and-receipt-pdf-blocks` Q37).
- A title word wider than the Item column breaks inside the word. It is not shrunk and does not overflow into the amount columns (`add-invoice-and-receipt-pdf-blocks` Q38).
- An amount column widens to its widest amount. An amount is never wrapped, shrunk or cut (`add-invoice-and-receipt-pdf-blocks` Q38).
- A divider stays under the column header on every page that draws the header (`add-invoice-and-receipt-pdf-blocks` Q38).
- An item with a blank title draws its row with its amounts and a blank Item cell. It is not refused and not dropped (`add-invoice-and-receipt-pdf-blocks` Q38).
- The same data renders to the same bytes. The renderer stamps the document's own date and not the time of rendering (`add-invoice-and-receipt-pdf-blocks` Q39).
- Each invoice still holds one lot. The table draws the items the application supplies (`add-invoice-and-receipt-pdf-blocks` Q31).

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
| TC6 (replacement relationship) | Rewritten against `replacesInvoice`; covered by `SC-51` |
| TC7 (Bill To/Ship To never echo each other, invoice) | Real gap. **Folded in:** `shared-ui-invoice-and-receipt-pdf-SC-19` |
| TC9 (payment breakdown keeps all four lines at zero values) | Real gap. **Folded in:** `shared-ui-invoice-and-receipt-pdf-SC-22` |
| TC10, TC12 (manually-settled mark; Superseded invoice conditional) | Already covered: `SC-9`, `SC-10`, `SC-11`, `SC-12` |
| TC11 (payment method content renders unchanged across its variants) | **Dropped as redundant:** the general "renders exactly what is given" rule (`SC-16`, `SC-17`) already covers any field, payment method included; no field-specific scenario adds new behavior |
| TC13 (receipt's own order-value lines and Insurance conditional) | Real gap — the scenario pass had written no scenario proving `ReceiptPdf` renders its order-value lines at all. **Folded in as a new requirement:** "ReceiptPdf renders its order-value lines in the same fixed order as InvoicePdf's", scenario `SC-21` |
| TC14 (receipt ID and invoice ID never conflate) | Real gap. **Folded in:** `SC-20` |
| TC15 (Bill To/Ship To never echo each other, receipt) | Real gap. **Folded in:** `SC-29` |
| TC16, TC17, TC18, TC21 (optional tax line) | Rewritten against the plain `PdfLineItem` contract and `null` omission; covered by the live tax-line requirement |
| TC19, TC20 (issuer tax-details) | Deprecated: `issuerTaxDetails` remains outside the live renderer contract |
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
own MODIFIED delta in the open `define-public-auction-identifiers` change.
The later `replacesInvoice` amendment restores the predecessor reference in
this renderer without reviving `replacedBy`.

**Amendment, 2026-09-24 (`decisions.md` Q18-Q20):** the DOM component this
capability specified is retired, replaced by the pdf-lib renderer `grade10`
already built and ships in production. `spec.md`'s `## Feature set` and
requirements were rewritten to describe what that renderer actually draws,
and this suite gained `TC36`-`TC42` for the behaviour that changed or is new:

- **Retired, no longer resolving to a live scenario** — `TC2`/`TC3` (bank
  rails), `TC10`/`TC12` (manually-settled mark, Superseded invoice),
`TC19`/`TC20` (the retired issuer-tax-details slot), `TC22`
  (rich `ReactNode` markup — there is no JSX left to carry it, every value is
  now a plain string), and `TC25` (loading/error state — a meaningful claim
  about a React component's render cycle, not about a data-in/bytes-out
  function). None was ever exercised by a real `grade10` consumer; `SC-19`'s
  own retirement of the fields they proved is `decisions.md` Q19; `taxLine`
  is restored below because the separate tax change already consumes it.
- **Superseded by new cases** — `TC27`-`TC30` proved the DOM contract's
  nine-field `PartyAddress` (including phone and state, both absent from the
  address shape `grade10`'s renderer actually takes). `TC36`-`TC38` prove
  the six-line shape it draws instead, including the "Not recorded" fallback
  the DOM contract never had, since it required an address rather than
  allowing one to be withheld entirely.
- **New** — `TC39`/`TC40` prove the transfer-reference line, a real
  behaviour `grade10`'s renderer already has that the DOM contract never
  specified. `TC41` proves date formatting in `Asia/Hong_Kong` as `GMT+8` — the
  one value the renderer computes rather than taking preformatted, a
  deliberate asymmetry with money (`spec.md`'s Presentation-only contract).
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

**Run, 2026-09-24 (`decisions.md` Q22):** InvoicePdf gains a conditional
Bank details section (SWIFT/FPS/HK local transfer rails plus the bank
reference), run as a second two-reading pass on the same isolated-anchor
basis as Q21's — the updated Feature set bullet, the journeys file,
`decisions.md` Q22, the linked PRD line, `tech-design.md`'s implementation
note, and the exact mockup, with neither reading seeing the other's output
or the existing suite.

| Finding | Disposition |
| --- | --- |
| The section renders only when `bankRails` is given, mirroring `ReceiptPdf`'s transfer-reference precedent (scenario reading's `SC-47`/`SC-48`; suite reading's `TC45`/`TC46`) | Agreement on the presence/absence split. **Folded in:** `SC-47`, `TC45` (presence + position); `SC-48`, `TC46` (absence) |
| No vertical space is reserved when the section is withheld (suite reading only — the scenario reading's `SC-48` claimed absence but not the gap) | Real gap the suite reading caught alone: a lazy implementation could still reserve the section's height even while skipping its content. **Folded in:** `SC-48`'s `Withheld` clause extended to require no reserved space, and its `THEN`/`AND` to name the issuer block sitting directly after the order-value summary; `TC46` extended the same way |
| The enabled columns' content is its own concern, separate from presence (scenario reading's `SC-49`; suite reading folded this into `TC45` rather than splitting it) | Same substance, different granularity. **Folded in, scenario reading's split kept:** `SC-49`/`TC47`, matching this capability's established one-scenario-per-concern pattern rather than one broad case |
| The reference note's bold interpolation is a distinct rendering mechanic (partial bold within a wrapped line), not covered by presence or column content alone (both readings independently proposed this) | Agreement. **Folded in:** `SC-50`/`TC48` |
| A case per rail (SWIFT-only, FPS-only, …) | The clarified contract permits an enabled subset inside `bankRails`; the live suite covers all rails and a SWIFT/FPS subset without requiring an individual case for every combination |

No contradiction, no question raised for `decisions.md`'s `## Raised` table.

**Clarification, 2026-10-06:** the user confirmed four changes to the live
contract. The replacement case now asserts `Replaces invoice {id}` on the new
invoice; `taxLine` remains an optional plain `PdfLineItem` on InvoicePdf and
ReceiptPdf while `issuerTaxDetails` remains retired; the proposal and
technical design are updated to carry those decisions and the fixed GMT+8
date contract; and this suite's live tax, replacement, bank-rail and date
cases supersede the deprecated DOM-era readings above.

**Clarification, 2026-10-06 (`decisions.md` Q27):** the planning owner declined
the link from the replacement row to the retained prior PDF. The scenario and
cases drafted for that link are not carried: `SC-51` still proves the row
names the prior invoice, and `TC6` still covers it, so no live scenario lost
its case.

**Run:** QA2, 2026-10-08, for change `add-invoice-and-receipt-pdf-blocks`, decisions Q31 to Q37 (items as table rows, the Item Total row and a table that continues on further pages). QA1 read only the ten-file frozen bundle: `## Purpose` and `## Feature set`, `user-journeys.md`, `proposal.md`, `decisions.md` with `## Raised`, `ui-design.md` without its closing dispositions, the linked pages under `docs/prds/`, the reference document, `openspec/config.yaml`'s `context` and this suite without `## Reconciliation`, plus the rulebooks. It was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. Dev read everything except this suite. It read `decisions.md`'s `## Raised` table after its spec was written, and `check:manual` and `accept:preflight` printed a few QA1 case titles to it, so its pass is not wholly independent. QA2 read both readings, the PRD page, the durable spec and suite, `drawIssuer` in the store's `pdf-document.ts` and, read-only, `invoicePdf.test.ts` in `grade10`. It wrote no scenario and changed no Dev artifact. QA1 numbered its 19 new cases `TC49` to `TC67`. The durable suite already holds `TC49` and `TC50`, the date cases of `align-collector-times-to-local-zone`, so QA2 renumbered them `TC51` to `TC69` in order, and no id was reissued. Every new and reworded case is `draft` and `manual`, the two retired cases are `deprecated`, none is `actual`, and the file carries no `**Reviewed:**` line. It is a statement, not proof.

| Case | Disposition |
| --- | --- |
| TC51: a one-item invoice reads as one row closed by Item Total | **Folded in:** `SC-56`. The divider under the header, which `SC-56` states, has no result in the case; it is **Raised** (the divider row of `## Raised`) |
| TC52, TC57: several items read as one row each in the order given, on the invoice and on the receipt | **Folded in:** `SC-57` |
| TC53: charges follow the Item Total row, Winning Bid and Buyer's Premium appear in the item row only | **Folded in:** `SC-3`, `SC-4`, `SC-52`. The last result has no scenario. The renderer cannot tell a Winning Bid charge from another charge (`tech-design.md`), so `grade10`'s mapping test of task 10.1 guards it, and the case keeps it as a claim about the document |
| TC54: a long item title wraps inside its column | **Folded in:** `SC-58` |
| TC55: a non-Latin item title draws in the supplied face | **Folded in part:** `SC-59` holds the layout half with an unspaced Latin title, since the store ships no Chinese face. The glyph half has no scenario and is **Uncovered**: the `ui-design.md` row sends it to `grade10`'s `invoicePdf.test.ts`. Listed under Manual |
| TC56: a one-item receipt shows its table above the payment breakdown | **Folded in:** `SC-60` |
| TC58: long and non-Latin item titles keep the receipt row layout | **Folded in part:** the long-title row by the Long title clause of the item-table requirement, which names both documents, and by `SC-58` for the invoice. The Chinese row has the glyph gap of TC55. Listed under Manual |
| `SC-59`: a title with no spaces breaks inside the Item column | **Uncovered:** no case, and none is added. What a word wider than the column draws is **Raised** (the word row of `## Raised`). Dev's design breaks it at the column edge; the frozen input does not say whether to break, shrink or overflow |
| TC59, TC60: the page limit, and one item past it | **Folded in:** the requirement that a document is one page when it fits and further pages when it does not; `SC-67` and `SC-68` give the one-page side. No scenario names the limit. The no-overlap result rests on the test in task 8.1 that a block's drawn height equals its measured height |
| TC61, TC62, TC66: the column header repeats on every continuation page | **Folded in:** `SC-62` for the second page. The third page rests on the Continuation clause of the requirement, which names no page count |
| TC63: an item row never splits across a page end | **Folded in:** `SC-63`. The case was invoice only; it now runs once per renderer, since the scenario names both |
| TC64: Item Total, the charges and the summary stay together at a page end | **Folded in:** `SC-64`. The readings differed. QA1 kept Item Total with the summary, and Dev's requirement keeps the charges and Tax with them. Q34 settles it: Item Total and the summary stay together, and the charges sit between them. The case now supplies the charges and a Tax line |
| TC65: a receipt's totals and payment breakdown stay whole at a page end | **Folded in:** `SC-65`, and the receipt half of `SC-64`, joined to the same run |
| TC67, TC68: a multi-page document carries the issuer block once, on the last page | **Folded in:** `SC-66`. Both rest on the recommended answer of Q36, which is **Raised** for the product manager. If the answer is every page, these two cases and `SC-66` change |
| TC69: every item amount is drawn as supplied | **Folded in:** `SC-61`, `SC-16` |
| TC1, reworded | **Folded in:** `SC-1`, `SC-3`. Its pre-conditions still list a bank reference, a prop Q13 removed. That predates this amendment and is left |
| TC13, reworded | **Folded in:** `SC-3`, `SC-4`. The requirement names both documents; the scenarios state the invoice |
| TC23, reworded | **Folded in:** `SC-17`, and the labels `SC-56` names |
| TC42, reworded | **Folded in:** `SC-67` and `SC-68`, which replace the retired `SC-44` and `SC-45`. QA1 left bank details out. The scenarios keep all three rails on the one-page invoice and a transfer reference on the receipt, so the pre-conditions now carry both |
| TC45, reworded | **Folded in:** `SC-47` |
| TC32, TC33, deprecated | **Folded in:** retired with the Description and Amount header requirement (`SC-37`, `SC-38`). TC51 and TC56 read the new header |
| TC46 and `SC-48`: the issuer block renders directly after the order-value summary | **Raised:** the sentence stands in both and neither changed. The renderer pins the issuer block to the bottom-right corner, independent of the sections above (`drawIssuer`), Dev's design reserves a band for it on every page, and the Feature set, Q15 and `SC-39` all say foot. On a short document the two readings put it in different places. See the issuer-block row of `## Raised` |
| Q36: the issuer block on the last page only | **Raised** for the product manager, and open on the PRD page. `SC-66`, the Last page only clause, TC67, TC68 and a Feature set bullet rest on the recommended answer |
| Q37: a stored PDF keeps its layout | **No case:** it is the archive's behaviour in `grade10`, not the block's. No scenario here states it, and task 11.1 opens no document stored before the change. **Raised** for the product manager |

**Raised at QA1, and what Dev did with each.** Each row is still open until the author lands it in `decisions.md`; the column says what the readings already hold.

| Raised question | Disposition |
| --- | --- |
| An empty item list | **Raised.** Dev's design draws the header and an Item Total row with nothing between until it is answered, and recommends a refusal to render (`tech-design.md`, Open Questions). No scenario, no case |
| What a continuation page repeats besides the column header | **Raised.** Dev's design draws the title, meta rows and parties on page 1 only; `SC-62` states the header and nothing else |
| A lone Item Total and summary: the header above them, and an item row moving with them | **Raised.** `SC-64` answers both: the header repeats, and no item row has to move |
| Which rows keep with Item Total | **Answered by Q34 and `SC-64`:** the rows between Item Total and the summary cannot sit apart from both. It lands as a Decisions row |
| Bank details across a page end | **Raised.** Dev's design moves the section whole and does not tie it to the summary. No scenario states it |
| The table and summary fit but the issuer block does not | **Raised.** Dev's design reserves the issuer band on every page, so the issuer block never forces a page. No scenario states it |
| The issuer block pinned to the bottom edge or placed after the last content | **Raised.** See the TC46 row above |
| A page number or a continuation note | **Raised.** It lands on Q36, whose recommendation is none |
| A word wider than the Item column | **Raised.** `SC-59` breaks it inside the column |
| A title the standard face cannot draw, with no embedded face | **Answered by the tech design,** with no decision row: failure is not handled, and surfaces as a rejected promise. No scenario states it |
| An amount wider than its column | **Raised.** The design widens the amount column to the widest value and throws when the Item column falls under its minimum. No scenario states it |
| A divider under the column header | **Raised.** `SC-56` and the requirement keep one. No case asserts it |
| An Item Total row missing an amount | **Answered by the tech design,** with no decision row: `PdfItemTotal` holds three required strings. No scenario states it |
| An item with an empty title | **Raised.** The design is silent. `grade10` supplies a title of 1 to 200 characters, or `Auction lot`, so it does not arise from there |
| A receipt's Payment section at a page end (raised at QA2) | **Raised.** Dev's design moves it whole. No scenario states it |

**Rejected:** none. **Contradicted:** none stated opposite for new behaviour; the TC46 and `SC-48` pair above predates this run. **Questions for the author:** the 15 open rows of `## Raised`, Q36 and Q37. Nothing is added to `## Settled` yet: it takes the answers to those rows once they land.

**Uncovered anchors:** none. Every `## Feature set` root group has a case: InvoicePdf export, ReceiptPdf export, Party address fields, Document shape and Presentation-only contract. The retired Reserved extension slots group has none, as before.

**Run:** QA2 re-run, 2026-10-08, for change `add-invoice-and-receipt-pdf-blocks`, after the round decided Q36, Q37 and Q38, the planning owner decided Q39, and Dev repaired `spec.md`, `tech-design.md` and `tasks.md`. The frozen `## Purpose` and `## Feature set` anchors did not change, so QA1 was not re-run and Dev was not restarted; the QA1 cases of the first run stand. QA2 read both readings, `decisions.md` with every `## Raised` row landed, `ui-design.md`, the PRD page, the durable suite and spec, and, read-only, `invoicePdf.test.ts` and `archivedOrRendered` in `grade10`. QA2 wrote TC70 to TC80 after reading the requirements and scenarios, so they are blind-style drafts from the anchors and the decided questions, not blind readings, and each asserts only what a scenario or a requirement clause states. The durable suite's highest case is TC50 and this suite's was TC69, so no id was reissued. Every new and reworded case is `draft` and `manual`, none is `actual`, and the file carries no `**Reviewed:**` line. QA2 changed no Dev artifact and no scenario. This entry supersedes the open Raised, Uncovered and Folded-in-part rows of the first run above. It is a statement, not proof.

| Case | Disposition |
| --- | --- |
| Raised rows, Q36 and Q37 | Every row of `## Raised` has a Landed cell: Q27, Q36 or Q38. Q36 and Q37 were open Decisions rows in the input and are decided too. This run raises nothing, and `## Settled` now carries the answers |
| TC70: a word wider than the Item column breaks inside the word | **Folded in:** `SC-59`, which the first run left uncovered. The receipt side is a third row of TC58, since the Long title clause names both documents. The Chinese half stays with TC55 |
| TC71: a wide amount widens its column and still draws whole | **Folded in:** `SC-72`. It runs once per renderer, as the scenario's GIVEN names both documents |
| TC72: a continuation page repeats the column header and nothing else | **Folded in:** `SC-73`. TC61, TC62 and TC66 assert the header and not what the page leaves out |
| TC73: Bank details move to the next page whole | **Folded in:** `SC-74`. It scans 1 to 40 items, as the scenario does, and asserts the break is reached |
| TC74: a receipt's Payment section moves to the next page whole | **Folded in:** `SC-75`, on the same scan |
| TC75: the issuer block never stands alone on a page | **Folded in:** `SC-76`. It runs once per renderer |
| TC76: the issuer block sits in the same place on every document | **Folded in:** the second THEN of `SC-66` and the foot-of-page claim of `SC-48`. TC34, TC35, TC67 and TC68 do not assert it, and each passes with the block placed after the last content, the option Q38 refused. The rows add what the Position clause implies: an invoice with bank details and a receipt with a transfer reference |
| TC77: the same data renders to the same bytes | **Folded in:** `SC-77` |
| TC78: a document with no items fails to render | **Folded in:** `SC-69` |
| TC79: a title the standard font cannot draw fails to render | **Folded in:** `SC-70`. The second row is another member of the class the rule states |
| TC80: a table that cannot fit a page fails to render | **Folded in:** `SC-71`, one row per part the error names |
| TC24, now `TC24-2` | **Folded in:** `SC-27` rev 2, the blank item title. The Subtotal was a `ReactNode` and is now a string. The new assertion joins the same run, and `<v>` is bumped since the requirement changed what the case verifies |
| TC46, now `TC46-2` | **Folded in:** `SC-48` rev 2 and Q38. The first run raised the pair: TC46 said the issuer block follows the order-value summary directly, and the Feature set, Q15 and `SC-39` said foot. Q38 decided the foot, so the case was the stale reading. It now asserts no Bank details section, nothing drawn between the summary and the block, and the block at the foot. `<v>` is bumped |
| TC51, TC56, TC61, TC62, TC66 | **Folded in:** the divider under the column header, which `SC-56` and `SC-62` state and the Header clause names for both documents. The first run raised it and Q38 settled it. Each case gains the result in place, with `<v>` unchanged since none is published |
| TC64, TC65 | **Folded in:** `SC-64`. A page that holds only the Item Total row and what follows repeats the column header above it, with no item row moved over. TC65 carries the receipt half. The scan asserts the break is reached |
| TC53 | **Folded in:** `SC-3`, the clause that Order Total sits in the box set off by a rule, which no case asserted. It joins the same run |
| TC58 | **Folded in:** the Long title clause, whose long word breaks inside the word. A third row adds an unspaced Latin title on a receipt |
| TC67, TC68 | **Folded in:** `SC-66`. They rested on the recommended answer of Q36, which the round decided |
| TC67, TC68, TC72, TC75, TC76 | **Reworded:** an issuer with no wordmark on file is also drawn as text at the top right of page 1, so the cases find the issuer block by its email and read the name on the line above it. TC72 also asserts that no text sits above the column header on page 2, so a continuation page does not repeat the issuer mark. `SC-66`, `SC-73` and `SC-76` say the same. Every case stays `draft` |
| TC1, TC8 | **Restyled:** the pre-conditions named a bank reference, removed by Q13, and a manually-settled mark, retired by Q19. No result changed |
| TC58, TC69 | **Restyled:** the per-row line moved under the title and the pre-conditions above the test data, as the case format has them |
| Q37: a stored PDF keeps its layout | **No case:** it is the archive's behaviour in `grade10`, not the block's, and no scenario states it. The verifier is `packages/grade10-auction/backend/test/services/auctions/invoicePdf.test.ts` in `grade10` ("returns the archived PDF from the object store on a cache hit"). Neither `tasks.md` nor the PRD page names that test |
| Q38: all three Item Total amounts are required | **No case:** a type rule. `PdfItemTotal` holds three required strings (task 8.2), and a caller that omits one fails the consuming repository's typecheck |
| The glyph half of TC55 and TC58: a Chinese title drawn in the supplied face | **Uncovered, kept Manual:** `SC-70` states the refusal without a face, not the drawing with one, and the store ships no Chinese face. The Manual table names the verifier |
| Requirement clauses with no scenario: Order Total heavier than every other line, and the issuer's name heavier than its email | **Uncovered:** both clauses pre-date this amendment and no scenario states either. QA2 does not edit `spec.md`, and no case is written for a clause no scenario holds. A scenario, or removing the clause, is Dev's call |

**Rejected:** none. **Raised:** none. **Contradicted:** none stated opposite after Q38; the TC46 and `SC-48` pair is settled by it. **Questions for the author:** none.

**Uncovered anchors:** none. Every `## Feature set` root group has a case: InvoicePdf export, ReceiptPdf export, Party address fields, Document shape and Presentation-only contract. The retired Reserved extension slots group has none, as before.

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-invoice-and-receipt-pdf-US1-TC55-1` | A person renders an invoice whose item title is Chinese, with a Traditional Chinese face supplied, and reads that every character draws and the amount columns line up. The store ships no such face, so no store test draws it. `grade10`'s `invoicePdf.test.ts` ("draws a Chinese invoice with a font viewers accept") proves the face embeds, not how the table reads. No walk reaches it yet: task 11.1 opens the lab's several-item and 30-item samples, and the lab holds no Chinese sample |
| `shared-ui-invoice-and-receipt-pdf-US1-TC58-1` | The Chinese row, as for `shared-ui-invoice-and-receipt-pdf-US1-TC55-1`, on a receipt. The long-title row and the unspaced-word row are decided by the tests of task 8.1 |
