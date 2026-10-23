# shared/ui/invoice-and-receipt-pdf Test Cases

**Status:** pending-review · 0/39
**Drafts styled:** 2026-10-23, tcs-rules r6

## g10.shared-invoice-and-receipt-pdf.US1: Invoice and Receipt PDF component contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/auction/winner-order`, which composes the block behind the Invoice PDF control and the Receipt PDF control

**As a** customer,
**I want** the Invoice and Receipt PDFs I open from Winner Order to show every line and address Grade10 already committed to, from one shared component,
**so that** the document I read or download matches what the order page told me, however the page that composes it is built.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-i81 rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-ec5 -->
### g10.shared-invoice-and-receipt-pdf.US1-TC81: A supplied note draws directly under the invoice Subtotal

Runs once per row of **Test data**.

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

* `InvoicePdf` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, `<charges>` as the charges, `<summary>` as the summary, `<note>` as the Subtotal note, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_1 | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |

| Row | `<charges>` | `<summary>` | `<note>` |
| --- | --- | --- | --- |
| Card fee | Shipping & Handling `US$10.01` | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` | `Converted from US$131.21 at 1 USD = 7.85 HKD` |
| Free fee | Shipping & Handling `Free`, no Insurance line, no Tax line | Subtotal `HK$951.42`, Payment Processing Fee `Free`, Order Total `HK$951.42` | `Converted from US$121.20 at 1 USD = 7.85 HKD` |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the summary from the Subtotal row down.

**Expected Results:**

* The note reads `<note>` exactly, on the row directly under Subtotal.
* The note is drawn in the colour the issuer email uses, starting at the left edge of the summary's labels.
* Payment Processing Fee follows the note, then Order Total.
* The Subtotal, fee and Order Total rows keep their `<summary>` amounts.
* Order Total is still set off by a rule, with no border around the summary.
* Shipping & Handling is still the only row between the Item Total row and Subtotal.
* No other text on the page names a rate.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-gzu rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-2p2 -->
### g10.shared-invoice-and-receipt-pdf.US1-TC82: A document with no note draws the summary unchanged

Runs once per row of **Test data**.

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

* `<renderer>` is rendered with `<item_usd>` as its only item, `<item_total_usd>` as the Item Total amounts, `<charges_usd>` as the charges, `<summary_usd>` as the summary, the Subtotal note `<note prop>`, and every other required prop supplied; a `ReceiptPdf` also takes `<breakdown_usd>` as the payment breakdown.

**Test data:**

| Field | Value |
| --- | --- |
| item_usd | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_usd | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| charges_usd | Shipping & Handling `US$10.01` |
| summary_usd | Subtotal `US$131.21`, Payment Processing Fee `US$4.50`, Order Total `US$135.71` |
| breakdown_usd | Original Invoice Total `US$135.71`, Previous Payments `US$0.00`, Current Payment Received `US$135.71`, Remaining Balance Due `US$0.00` |

| `<renderer>` | `<note prop>` | Fixture notes |
| --- | --- | --- |
| `InvoicePdf` | Omitted | A USD invoice, which has no note; the baseline for the positions below |
| `InvoicePdf` | Empty string | Supplied but blank |
| `InvoicePdf` | Spaces only, `   ` | Supplied but blank |
| `ReceiptPdf` | Omitted | A USD receipt, which has no note; the baseline for the positions below |
| `ReceiptPdf` | Empty string | Supplied but blank |

**Steps:**

1. Render `<renderer>` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the summary from the Subtotal row down.

**Expected Results:**

* Payment Processing Fee follows the Subtotal row directly, at the spacing of every other summary row.
* No note row and no empty gap sits under Subtotal.
* Subtotal, fee and Order Total keep their `<summary_usd>` amounts.
* Subtotal, fee and Order Total sit at the same positions as in the Omitted row of the same renderer.
* A `ReceiptPdf` draws the four breakdown lines after the summary, unchanged.
* No text on the page names a rate.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-c32 rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-v22 -->
### g10.shared-invoice-and-receipt-pdf.US1-TC83: The note draws as supplied and the block derives none

Runs once per row of **Test data**.

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

* `<renderer>` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<note>` as the Subtotal note, and every other required prop supplied; a `ReceiptPdf` also takes `<breakdown_1>` as the payment breakdown.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_1 | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| charges_1 | Shipping & Handling `US$10.01` |
| summary_1 | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` |
| breakdown_1 | Original Invoice Total `HK$1,068.69`, Previous Payments `HK$0.00`, Current Payment Received `HK$1,068.69`, Remaining Balance Due `HK$0.00` |
| note | `Converted from US$999.00 at 1 USD = 7.00 HKD` (fixed: a figure and a rate that match nothing else on the sheet, where the lines sum to `US$131.21` and the product rate is 7.85) |

| `<renderer>` |
| --- |
| `InvoicePdf` |
| `ReceiptPdf` |

**Steps:**

1. Render `<renderer>` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the note and the Subtotal and Payment Processing Fee rows around it.

**Expected Results:**

* The note reads `<note>` exactly.
* The Subtotal amount is still `HK$1,030.00`, whatever `<note>` says.
* The page draws neither `US$131.21` nor `7.85`.
* No figure on the page is recalculated from the note.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-bfo rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-ec5 -->
### g10.shared-invoice-and-receipt-pdf.US1-TC84: The invoice note is drawn muted against the Subtotal row

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** InvoicePdf export

**Pre-conditions:**

* `InvoicePdf` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<note_1>` as the Subtotal note, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_1 | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| charges_1 | Shipping & Handling `US$10.01` |
| summary_1 | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` |
| note_1 | `Converted from US$131.21 at 1 USD = 7.85 HKD` |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the text colour and size of the Subtotal label and of the note.

**Expected Results:**

* The note's colour is lighter than the Subtotal label's.
* The note is not larger than the Subtotal label.
* The note is not bold.
* The Subtotal label and amount keep the colour of the other summary rows.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-pml rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-iem -->
### g10.shared-invoice-and-receipt-pdf.US1-TC86: An invoice with a note and bank details still fits one A4 page

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

* `InvoicePdf` is rendered with `<item_1>` as its only item whose title fits one line, `<item_total_1>` as the Item Total amounts, `<charges_2>` as the charges, `<summary_2>` as the summary, `<note_2>` as the Subtotal note, `<bank_1>` as the bank details, a Bill To and a Ship To of recipient, address line 1, city line and country each, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_1 | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| charges_2 | Shipping & Handling `US$10.01` and Insurance `US$5.00`, in that order |
| summary_2 | Subtotal `HK$1,069.25`, Payment Processing Fee `Free`, Order Total `HK$1,069.25` |
| note_2 | `Converted from US$136.21 at 1 USD = 7.85 HKD` |
| bank_1 | Bank details for the SWIFT, FPS and HK local transfer rails with a bank reference |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document.
3. Read the page count and page size.
4. Read page 1 from the top.

**Expected Results:**

* The document has exactly one page, sized 595.28x841.89pt (A4).
* The note, the summary and the bank details are on that page.
* The issuer block is on that page, at its foot.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-tk2 rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-zs0 -->
### g10.shared-invoice-and-receipt-pdf.US1-TC87: The invoice note never leaves the Subtotal row at a page end

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

* `InvoicePdf` is rendered once for each count in `<n>`, with `<item_total_n>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<note_1>` as the Subtotal note, no bank details, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| items_fit_plain | The largest count of items for which `InvoicePdf` returns one page with `<note_1>` omitted: render 1, 2, 3, ... items with `<charges_1>` until the page count first reads 2, and take the count before it. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `US$1,000.00`, Buyer's Premium `US$200.00`, Total `US$1,200.00` |
| items_two_note | The smallest count of items for which `InvoicePdf` with `<note_1>` supplied returns two pages and page 2 holds at least three item rows: from `<items_fit_plain>`, add items one at a time. Titled and priced as `<items_fit_plain>` |
| n | Each count from `<items_fit_plain>` to `<items_two_note>`, one render per count, with `<note_1>` supplied, titled and priced as `<items_fit_plain>` |
| item_total_n | Winning Bid `US$9,999.00`, Buyer's Premium `US$1,999.00`, Total `US$11,998.00`, supplied for every count |
| charges_1 | Shipping & Handling `US$10.01` |
| summary_1 | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` |
| note_1 | `Converted from US$131.21 at 1 USD = 7.85 HKD` |

**Steps:**

1. Find `<items_fit_plain>` and `<items_two_note>` by adding items one at a time.
2. Render `InvoicePdf` with the first count in `<n>`.
3. Parse the returned bytes as a PDF document.
4. Find the page of the Item Total row, of the charge rows, of the Subtotal row, of the note, and of the Payment Processing Fee and Order Total lines.
5. Repeat steps 2 to 4 for each other count in `<n>`.

**Expected Results:**

* At every count, the Item Total row, the charge rows, the Subtotal, the note, the fee and Order Total sit on one page.
* The note is never the first line of a page or the last line before a page break.
* The note sits directly under Subtotal, with the fee after it.
* Where the note takes a count over one page, the Item Total row and the whole summary start the next page under the column header.
* No item row is moved over to sit with the summary.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-2g8 rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-53f -->
### g10.shared-invoice-and-receipt-pdf.US1-TC88: A supplied note draws directly under the receipt Subtotal

Runs once per row of **Test data**.

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
* **Trace:** ReceiptPdf export

**Pre-conditions:**

* `ReceiptPdf` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<note_1>` as the Subtotal note, `<breakdown>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_1 | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| charges_1 | Shipping & Handling `US$10.01` |
| summary_1 | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` |
| note_1 | `Converted from US$131.21 at 1 USD = 7.85 HKD` |

| Row | `<breakdown>` |
| --- | --- |
| Full payment | Original Invoice Total `HK$1,068.69`, Previous Payments `HK$0.00`, Current Payment Received `HK$1,068.69`, Remaining Balance Due `HK$0.00` |
| Part payment | Original Invoice Total `HK$1,068.69`, Previous Payments `HK$500.00`, Current Payment Received `HK$300.00`, Remaining Balance Due `HK$268.69` |

**Steps:**

1. Render `ReceiptPdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the summary from the Subtotal row down to the payment breakdown.

**Expected Results:**

* The note reads `<note_1>` exactly, once, on the row directly under Subtotal.
* The note is drawn in the colour the issuer email uses, lighter than the Subtotal label.
* Payment Processing Fee and Order Total follow the note, with the full `<summary_1>` amounts and not the payment.
* The four breakdown lines follow the summary in their fixed order, with the `<breakdown>` amounts.
* The breakdown lines carry no note.
* No other text on the page names a rate.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-k6p rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-bcn -->
### g10.shared-invoice-and-receipt-pdf.US1-TC91: A note wider than the summary wraps under the Subtotal

Runs once per row of **Test data**.

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

* `<renderer>` is rendered with `<item_1>` as its only item, `<item_total_1>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<note>` as the Subtotal note, and every other required prop supplied; a `ReceiptPdf` also takes `<breakdown_1>` as the payment breakdown.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_1 | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| charges_1 | Shipping & Handling `US$10.01` |
| summary_1 | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` |
| breakdown_1 | Original Invoice Total `HK$1,068.69`, Previous Payments `HK$0.00`, Current Payment Received `HK$1,068.69`, Remaining Balance Due `HK$0.00` |
| note | `Converted from US$1,234,567,890.12 at 1 USD = 7.85 HKD` (fixed: wider than the summary on the sheet) |

| `<renderer>` |
| --- |
| `InvoicePdf` |
| `ReceiptPdf` |

**Steps:**

1. Render `<renderer>` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the note and the Subtotal and Payment Processing Fee rows around it.

**Expected Results:**

* The note wraps onto a second line.
* Every line of the note sits inside the summary's width.
* The lines follow one another directly under Subtotal, above Payment Processing Fee, with no overlap.
* The note reads `<note>` whole, once, in order, with no part cut at the margin.
* The Subtotal, fee and Order Total rows keep their `<summary_1>` amounts.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-6a9 rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-iem -->
### g10.shared-invoice-and-receipt-pdf.US1-TC92: A receipt with a note and a transfer reference still fits one A4 page

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

* `ReceiptPdf` is rendered with `<item_1>` as its only item whose title fits one line, `<item_total_1>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<note_1>` as the Subtotal note, `<transfer_reference>` as the transfer reference, `<breakdown_part>` as the payment breakdown, a Bill To and a Ship To of recipient, address line 1, city line and country each, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| item_1 | Title `1999 Pokemon Base Set Charizard PSA 10`, Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| item_total_1 | Winning Bid `US$101.00`, Buyer's Premium `US$20.20`, Total `US$121.20` |
| charges_1 | Shipping & Handling `US$10.01` |
| summary_1 | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` |
| note_1 | `Converted from US$131.21 at 1 USD = 7.85 HKD` |
| breakdown_part | Original Invoice Total `HK$1,068.69`, Previous Payments `HK$500.00`, Current Payment Received `HK$300.00`, Remaining Balance Due `HK$268.69` |
| transfer_reference | `FPS-20261023-0042` |

**Steps:**

1. Render `ReceiptPdf` with the supplied props.
2. Parse the returned bytes as a PDF document.
3. Read the page count and page size.
4. Read page 1 from the top.

**Expected Results:**

* The document has exactly one page, sized 595.28x841.89pt (A4).
* The note, the summary, the Payment section and the four breakdown lines are on that page.
* The issuer block is on that page, at its foot.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-5qy rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-zs0 -->
### g10.shared-invoice-and-receipt-pdf.US1-TC93: The receipt note and payment breakdown stay whole at a page end

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

* `ReceiptPdf` is rendered once for each count in `<m>`, with `<item_total_n>` as the Item Total amounts, `<charges_1>` as the charges, `<summary_1>` as the summary, `<note_1>` as the Subtotal note, `<breakdown_1>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| receipt_items_fit_plain | The largest count of items for which `ReceiptPdf` returns one page with `<note_1>` omitted: render 1, 2, 3, ... items with `<charges_1>` until the page count first reads 2, and take the count before it. Items are titled `Lot 001`, `Lot 002`, ... in order, one line each, each with Winning Bid `US$1,000.00`, Buyer's Premium `US$200.00`, Total `US$1,200.00` |
| receipt_items_two_note | The smallest count of items for which `ReceiptPdf` with `<note_1>` supplied returns two pages and page 2 holds at least three item rows: from `<receipt_items_fit_plain>`, add items one at a time. Titled and priced as `<receipt_items_fit_plain>` |
| m | Each count from `<receipt_items_fit_plain>` to `<receipt_items_two_note>`, one render per count, with `<note_1>` supplied, titled and priced as `<receipt_items_fit_plain>` |
| item_total_n | Winning Bid `US$9,999.00`, Buyer's Premium `US$1,999.00`, Total `US$11,998.00`, supplied for every count |
| charges_1 | Shipping & Handling `US$10.01` |
| summary_1 | Subtotal `HK$1,030.00`, Payment Processing Fee `HK$38.69`, Order Total `HK$1,068.69` |
| note_1 | `Converted from US$131.21 at 1 USD = 7.85 HKD` |
| breakdown_1 | Original Invoice Total `HK$1,068.69`, Previous Payments `HK$0.00`, Current Payment Received `HK$1,068.69`, Remaining Balance Due `HK$0.00` |

**Steps:**

1. Find `<receipt_items_fit_plain>` and `<receipt_items_two_note>` by adding items one at a time.
2. Render `ReceiptPdf` with the first count in `<m>`.
3. Parse the returned bytes as a PDF document.
4. Find the page of the Item Total row, of the charge rows, of the Subtotal row, of the note, of the Payment Processing Fee and Order Total lines, and of each of the four breakdown lines.
5. Repeat steps 2 to 4 for each other count in `<m>`.

**Expected Results:**

* At every count, the Item Total row, the charge rows, the Subtotal, the note, the fee and Order Total sit on one page.
* The note is never the first line of a page or the last line before a page break.
* The note sits directly under Subtotal, with the fee after it.
* At every count, the four breakdown lines sit on one page, none left on the page before.
* Where the note takes a count over one page, the Item Total row and the whole summary start the next page under the column header.
* No item row is moved over to sit with the summary.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-23a rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-a9o,g10.shared-invoice-and-receipt-pdf.SC-g9l,g10.shared-invoice-and-receipt-pdf.SC-kto,g10.shared-invoice-and-receipt-pdf.SC-9et,g10.shared-invoice-and-receipt-pdf.SC-lrt,g10.shared-invoice-and-receipt-pdf.SC-63o,g10.shared-invoice-and-receipt-pdf.SC-8b8,g10.shared-invoice-and-receipt-pdf.SC-8ek,g10.shared-invoice-and-receipt-pdf.SC-cys,g10.shared-invoice-and-receipt-pdf.SC-14c,g10.shared-invoice-and-receipt-pdf.SC-tt8,g10.shared-invoice-and-receipt-pdf.SC-xeu -->
### g10.shared-invoice-and-receipt-pdf.US1-TC4: Insurance line renders only when supplied

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

Runs once per row of **Test data**.

**Pre-conditions:**

* `InvoicePdf` is rendered with every other order-value line supplied, and Insurance set to `<insurance prop>`.

**Test data:**

| `<insurance prop>` | `<insurance line>` |
| --- | --- |
| Supplied | Renders |
| Omitted | Does not render |

**Steps:**

1. Render `InvoicePdf` with `<insurance prop>`.
2. Inspect the order-value lines.

**Expected Results:**

* The Insurance line has this presence: `<insurance line>`.
* Every other order-value line still renders.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-5dx rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-a9o,g10.shared-invoice-and-receipt-pdf.SC-g9l,g10.shared-invoice-and-receipt-pdf.SC-kto,g10.shared-invoice-and-receipt-pdf.SC-9et,g10.shared-invoice-and-receipt-pdf.SC-lrt,g10.shared-invoice-and-receipt-pdf.SC-63o,g10.shared-invoice-and-receipt-pdf.SC-8b8,g10.shared-invoice-and-receipt-pdf.SC-8ek,g10.shared-invoice-and-receipt-pdf.SC-cys,g10.shared-invoice-and-receipt-pdf.SC-14c,g10.shared-invoice-and-receipt-pdf.SC-tt8,g10.shared-invoice-and-receipt-pdf.SC-xeu -->
### g10.shared-invoice-and-receipt-pdf.US1-TC5: Subtotal and Order Total survive Insurance being omitted

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

* `InvoicePdf` is rendered with Insurance omitted and every other order-value line supplied.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the Subtotal and Order Total rows.

**Expected Results:**

* Subtotal renders its supplied content.
* Order Total renders its supplied content.
* Neither row is dropped or reordered by Insurance's absence.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-e2u rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-a9o,g10.shared-invoice-and-receipt-pdf.SC-g9l,g10.shared-invoice-and-receipt-pdf.SC-kto,g10.shared-invoice-and-receipt-pdf.SC-9et,g10.shared-invoice-and-receipt-pdf.SC-lrt,g10.shared-invoice-and-receipt-pdf.SC-63o,g10.shared-invoice-and-receipt-pdf.SC-8b8,g10.shared-invoice-and-receipt-pdf.SC-8ek,g10.shared-invoice-and-receipt-pdf.SC-cys,g10.shared-invoice-and-receipt-pdf.SC-14c,g10.shared-invoice-and-receipt-pdf.SC-tt8,g10.shared-invoice-and-receipt-pdf.SC-xeu -->
### g10.shared-invoice-and-receipt-pdf.US1-TC6: Replaces invoice renders only when given

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

Runs once per row of **Test data**.

**Pre-conditions:**

* `InvoicePdf` is rendered with every other field supplied, and `replacesInvoice` set to `<replaces invoice>`.

**Test data:**

| `<replaces invoice>` | `<replacement line>` |
| --- | --- |
| `{ invoiceId: "IN-LK42301" }` | Renders `Replaces invoice IN-LK42301` |
| Omitted or `null` | Does not render |

**Steps:**

1. Render `InvoicePdf` with `<replaces invoice>`.
2. Inspect the meta rows.

**Expected Results:**

* The replacement line has this outcome: `<replacement line>` and names the prior invoice.
* The prior invoice remains retained; this renderer does not mark it cancelled.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-d2d rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-qqd,g10.shared-invoice-and-receipt-pdf.SC-1uz,g10.shared-invoice-and-receipt-pdf.SC-rzk,g10.shared-invoice-and-receipt-pdf.SC-4tl,g10.shared-invoice-and-receipt-pdf.SC-f0x,g10.shared-invoice-and-receipt-pdf.SC-zks,g10.shared-invoice-and-receipt-pdf.SC-27a,g10.shared-invoice-and-receipt-pdf.SC-5lf,g10.shared-invoice-and-receipt-pdf.SC-03g -->
### g10.shared-invoice-and-receipt-pdf.US1-TC9: Payment breakdown keeps its order at zero values

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

* `ReceiptPdf` is rendered with Previous Payments and Remaining Balance Due each supplied as a zero-reading `ReactNode`, and Original Invoice Total and Current Payment Received supplied as non-zero content, as a single full payment produces.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the payment breakdown.

**Expected Results:**

* All four payment-breakdown lines render; none is omitted for reading zero.
* The order stays Original Invoice Total, Previous Payments, Current Payment Received, Remaining Balance Due.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-tnf rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-qqd,g10.shared-invoice-and-receipt-pdf.SC-1uz,g10.shared-invoice-and-receipt-pdf.SC-rzk,g10.shared-invoice-and-receipt-pdf.SC-4tl,g10.shared-invoice-and-receipt-pdf.SC-f0x,g10.shared-invoice-and-receipt-pdf.SC-zks,g10.shared-invoice-and-receipt-pdf.SC-27a,g10.shared-invoice-and-receipt-pdf.SC-5lf,g10.shared-invoice-and-receipt-pdf.SC-03g -->
### g10.shared-invoice-and-receipt-pdf.US1-TC11: Payment method content renders unchanged across its variants

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
* **Trace:** ReceiptPdf export

Runs once per row of **Test data**.

**Pre-conditions:**

* `ReceiptPdf` is rendered with the payment method meta row set to `<payment method content>`.

**Test data:**

| `<payment method content>` |
| --- |
| Card brand and last four digits |
| Bank Transfer |
| An operator-given description with an external reference |

**Steps:**

1. Render `ReceiptPdf` with `<payment method content>`.
2. Inspect the payment method meta row.

**Expected Results:**

* The payment method row renders `<payment method content>` verbatim, unchanged by which variant it is.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-exm rev=2 covers=g10.shared-invoice-and-receipt-pdf.SC-qqd,g10.shared-invoice-and-receipt-pdf.SC-1uz,g10.shared-invoice-and-receipt-pdf.SC-rzk,g10.shared-invoice-and-receipt-pdf.SC-4tl,g10.shared-invoice-and-receipt-pdf.SC-f0x,g10.shared-invoice-and-receipt-pdf.SC-zks,g10.shared-invoice-and-receipt-pdf.SC-27a,g10.shared-invoice-and-receipt-pdf.SC-5lf,g10.shared-invoice-and-receipt-pdf.SC-03g -->
### g10.shared-invoice-and-receipt-pdf.US1-TC13: Insurance line renders only when given on the receipt

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

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-ege rev=1 covers=none -->
### g10.shared-invoice-and-receipt-pdf.US1-TC17: Tax line renders with its content when supplied

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

* `InvoicePdf` is rendered with `taxLine` supplied as a plain `PdfLineItem` labelled `Tax` with amount `HKD 12.00`.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* The tax line renders immediately before the summary with the supplied label and amount.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-2xh rev=1 covers=none -->
### g10.shared-invoice-and-receipt-pdf.US1-TC18: A null tax line behaves like an omitted tax line

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

Runs once per row of **Test data**.

**Pre-conditions:**

* `InvoicePdf` is rendered with every other order-value line supplied, and `taxLine` set to `<tax line>`.

**Test data:**

| `<tax line>` | `<tax row>` |
| --- | --- |
| Omitted entirely | Does not render |
| `null` | Does not render |

**Steps:**

1. Render `InvoicePdf` with `<tax line>`.
2. Inspect the order-value lines for a tax row.

**Expected Results:**

* The tax row's presence is `<tax row>`.
* Omission and `null` are both treated as absent.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-8hd rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-a9o,g10.shared-invoice-and-receipt-pdf.SC-g9l,g10.shared-invoice-and-receipt-pdf.SC-kto,g10.shared-invoice-and-receipt-pdf.SC-9et,g10.shared-invoice-and-receipt-pdf.SC-lrt,g10.shared-invoice-and-receipt-pdf.SC-63o,g10.shared-invoice-and-receipt-pdf.SC-8b8,g10.shared-invoice-and-receipt-pdf.SC-i50,g10.shared-invoice-and-receipt-pdf.SC-m09,g10.shared-invoice-and-receipt-pdf.SC-8ek,g10.shared-invoice-and-receipt-pdf.SC-cys,g10.shared-invoice-and-receipt-pdf.SC-14c,g10.shared-invoice-and-receipt-pdf.SC-tt8,g10.shared-invoice-and-receipt-pdf.SC-xeu -->
### g10.shared-invoice-and-receipt-pdf.US1-TC21: Tax line behaves the same on invoice and receipt

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

* `ReceiptPdf` is rendered with every other line supplied and `taxLine` omitted or set to `null`.

**Steps:**

1. Render `ReceiptPdf` with the pre-conditions.
2. Inspect the order-value lines.

**Expected Results:**

* No tax line renders on the receipt.
* The optional tax-line omission behavior matches `InvoicePdf`'s.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-elb rev=2 covers=g10.shared-invoice-and-receipt-pdf.SC-i53,g10.shared-invoice-and-receipt-pdf.SC-ca8,g10.shared-invoice-and-receipt-pdf.SC-0s1,g10.shared-invoice-and-receipt-pdf.SC-t8t -->
### g10.shared-invoice-and-receipt-pdf.US1-TC24: A blank amount or item title still renders its row

**Classification:**

* **Severity:** minor
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

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-kbj rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-i53,g10.shared-invoice-and-receipt-pdf.SC-ca8,g10.shared-invoice-and-receipt-pdf.SC-0s1,g10.shared-invoice-and-receipt-pdf.SC-t8t -->
### g10.shared-invoice-and-receipt-pdf.US1-TC26: Re-rendering with new props leaves no stale content

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

* `InvoicePdf` is rendered once, then re-rendered with an entirely new, unrelated set of props for a different invoice.

**Steps:**

1. Render `InvoicePdf` with the first set of props.
2. Re-render it with the second set of props.
3. Inspect the output after the second render.

**Expected Results:**

* The second render shows only the second set of props' content.
* No row from the first render's props persists.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-kil rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-a9o,g10.shared-invoice-and-receipt-pdf.SC-g9l,g10.shared-invoice-and-receipt-pdf.SC-kto,g10.shared-invoice-and-receipt-pdf.SC-9et,g10.shared-invoice-and-receipt-pdf.SC-lrt,g10.shared-invoice-and-receipt-pdf.SC-63o,g10.shared-invoice-and-receipt-pdf.SC-8b8,g10.shared-invoice-and-receipt-pdf.SC-8ek,g10.shared-invoice-and-receipt-pdf.SC-cys,g10.shared-invoice-and-receipt-pdf.SC-14c,g10.shared-invoice-and-receipt-pdf.SC-tt8,g10.shared-invoice-and-receipt-pdf.SC-xeu -->
### g10.shared-invoice-and-receipt-pdf.US1-TC34: The issuer block sits at the foot of the invoice, right-aligned

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

* `InvoicePdf` is rendered with an issuer block and a full order-value section.

**Steps:**

1. Render `InvoicePdf` with the pre-conditions.
2. Inspect the issuer block's position and alignment relative to the other sections.

**Expected Results:**

* The issuer block shows the value given.
* The issuer block renders after every other section in the document.
* The issuer block aligns to the right of the sheet.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-vwh rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-qqd,g10.shared-invoice-and-receipt-pdf.SC-1uz,g10.shared-invoice-and-receipt-pdf.SC-rzk,g10.shared-invoice-and-receipt-pdf.SC-4tl,g10.shared-invoice-and-receipt-pdf.SC-f0x,g10.shared-invoice-and-receipt-pdf.SC-zks,g10.shared-invoice-and-receipt-pdf.SC-27a,g10.shared-invoice-and-receipt-pdf.SC-5lf,g10.shared-invoice-and-receipt-pdf.SC-03g -->
### g10.shared-invoice-and-receipt-pdf.US1-TC35: The issuer block sits at the foot of the receipt, right-aligned

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

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-8la rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-i53,g10.shared-invoice-and-receipt-pdf.SC-2d5,g10.shared-invoice-and-receipt-pdf.SC-ca8,g10.shared-invoice-and-receipt-pdf.SC-0s1,g10.shared-invoice-and-receipt-pdf.SC-t8t,g10.shared-invoice-and-receipt-pdf.SC-1sf -->
### g10.shared-invoice-and-receipt-pdf.US1-TC49: Each document date ends in GMT+8 across a Hong Kong midnight

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** automated
* **Testability:** automation
* **Trace:** Presentation-only contract

**Decided by:** `packages/ui/src/blocks/auction-invoice-and-receipt-pdf/pdf-dates.test.ts`

**Pre-conditions:**

* The machine clock is set to America/New_York.
* `<document>` is rendered with the `<date row>` date supplied as `<date supplied>`, every other prop supplied normally.

**Test data:**

| `<document>` | `<date row>` | `<date supplied>` | `<Hong Kong day>` | `<Hong Kong month>` | `<Hong Kong year>` | `<Hong Kong clock>` | Fixture notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `InvoicePdf` | sent-at | 2026-09-08T16:00:00Z | 9 | September | 2026 | 00:00 | `<date supplied>`: Hong Kong midnight |
| `InvoicePdf` | payment deadline | 2026-09-08T15:59:00Z | 8 | September | 2026 | 23:59 | `<date supplied>`: one minute before Hong Kong midnight |
| `InvoicePdf` | payment deadline | 2026-09-08T16:00:00Z | 9 | September | 2026 | 00:00 | `<date supplied>`: Hong Kong midnight |
| `ReceiptPdf` | date paid | 2026-09-08T16:00:00Z | 9 | September | 2026 | 00:00 | `<date supplied>`: Hong Kong midnight |

**Steps:**

1. Render `<document>` with `<date supplied>`.
2. Read the `<date row>` row.

**Expected Results:**

* The row shows the day `<Hong Kong day>`, the month `<Hong Kong month>` named in English and the year `<Hong Kong year>`, in the renderer's own arrangement, and the clock `<Hong Kong clock>`.
* The row ends in `GMT+8`.
* The row does not contain `HKT`.

### g10.shared-invoice-and-receipt-pdf.US1-TC51: A one-item invoice reads as one row closed by Item Total

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
* No listing title heading and no Description or Amount header appears.
* Step 4: the charges and the summary follow the Item Total row.

### g10.shared-invoice-and-receipt-pdf.US1-TC54: A long item title wraps inside its column

**Classification:**

* **Severity:** minor
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

### g10.shared-invoice-and-receipt-pdf.US1-TC55: A non-Latin item title draws in the supplied face

**Classification:**

* **Severity:** major
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

### g10.shared-invoice-and-receipt-pdf.US1-TC56: A one-item receipt shows its table above the payment breakdown

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
* No listing title heading and no Description or Amount header appears.
* The charge rows and the summary follow, with their supplied amounts.
* The payment breakdown follows the summary: Original Invoice Total, Previous Payments, Current Payment Received, Remaining Balance Due, in that order, with the `<breakdown_1>` amounts.

### g10.shared-invoice-and-receipt-pdf.US1-TC58: Long and non-Latin item titles keep the receipt row layout

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
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

* `ReceiptPdf` is rendered with `<item>` as its only item, `<embedded font>`, and every other required prop supplied.

**Test data:**

| `<item>` | `<embedded font>` | `<expected item row>` |
| --- | --- | --- |
| Title `1999 Pokemon Base Set First Edition Shadowless Holographic Charizard 4/102 Graded PSA 10 Gem Mint From A Single Owner Collection Certified In 2019` (146 characters), Winning Bid `HKD 75,000.00`, Buyer's Premium `HKD 15,000.00`, Total `HKD 90,000.00` | Not supplied | The title wraps onto at least three lines inside the Item column, and the three amounts sit beside its first line |
| Title `1999 寶可夢 初版 噴火龍 PSA 10`, Winning Bid `HKD 30,000.00`, Buyer's Premium `HKD 6,000.00`, Total `HKD 36,000.00` | A font file that carries every character of the title | Every character draws as a glyph of the supplied font, and the three amounts sit in their columns on the title's line |
| Title `ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ` (78 letters, no space), Winning Bid `HKD 50,000.00`, Buyer's Premium `HKD 10,000.00`, Total `HKD 60,000.00` | Not supplied | The title breaks inside the word onto at least two lines, and the three amounts sit beside its first line |

**Steps:**

1. Render `ReceiptPdf` with `<item>` and `<embedded font>`.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the item row and the row under it.

**Expected Results:**

* The item row has this outcome: `<expected item row>`.
* No part of the title crosses into an amount column.
* The Item Total row sits directly under the item row.

### g10.shared-invoice-and-receipt-pdf.US1-TC59: A table at the page limit stays on one page

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
* The last item row, the Item Total row, the summary and the issuer block are all on page 1.
* No two of these overlap.

### g10.shared-invoice-and-receipt-pdf.US1-TC60: One item past the page limit adds a second page

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
* The Item Total row and the summary each appear once across the two pages.

### g10.shared-invoice-and-receipt-pdf.US1-TC64: Item Total, the charges and the summary stay together at a page end

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
* The three summary lines sit together, whole, with no border around them.
* At least one count puts the last item row on page 1 and the Item Total row on page 2.
* On that page 2 the column header, with a divider under it, comes first and the Item Total row follows it, with no item row between them.

### g10.shared-invoice-and-receipt-pdf.US1-TC65: A receipt's totals and payment breakdown stay whole at a page end

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

### g10.shared-invoice-and-receipt-pdf.US1-TC67: A multi-page invoice carries the issuer block once, on the last page

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

### g10.shared-invoice-and-receipt-pdf.US1-TC68: A multi-page receipt carries the issuer block once, on the last page

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

### g10.shared-invoice-and-receipt-pdf.US1-TC69: The block draws every item amount as supplied and computes none

Runs once per row of **Test data**.

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
* **Trace:** Presentation-only contract

**Pre-conditions:**

* `<renderer>` is rendered with two items titled Lot A and Lot B, with amounts `<item 1 amounts>` and `<item 2 amounts>`, and Item Total amounts `<item total amounts>`, and every other required prop supplied.

**Test data:**

| `<renderer>` | `<item 1 amounts>` | `<item 2 amounts>` | `<item total amounts>` | `<cell drawn>` |
| --- | --- | --- | --- | --- |
| `InvoicePdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 120,000.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 1.00` / `HKD 30,000.00` / `HKD 180,000.00` | Item Total row, Winning Bid column: `HKD 1.00` |
| `InvoicePdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 7.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 150,000.00` / `HKD 30,000.00` / `HKD 180,000.00` | Lot A row, Total column: `HKD 7.00` |
| `InvoicePdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 120,000.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 150,000.00` / `HKD 30,000.00` / `180000.5` | Item Total row, Total column: `180000.5` |
| `ReceiptPdf` | `HKD 100,000.00` / `HKD 20,000.00` / `HKD 120,000.00` | `HKD 50,000.00` / `HKD 10,000.00` / `HKD 60,000.00` | `HKD 1.00` / `HKD 30,000.00` / `HKD 180,000.00` | Item Total row, Winning Bid column: `HKD 1.00` |

**Steps:**

1. Render `<renderer>` with the two items with amounts `<item 1 amounts>` and `<item 2 amounts>`, and Item Total amounts `<item total amounts>`.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read the cell described by `<cell drawn>`.
4. Read every other amount cell in the item table.

**Expected Results:**

* The named cell reads exactly the supplied string.
* Every other amount cell reads its own supplied string.
* No cell shows a sum, a difference or a reformatted amount.

### g10.shared-invoice-and-receipt-pdf.US1-TC70: A word wider than the Item column breaks inside the word

**Classification:**

* **Severity:** minor
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

| Field | Value | Fixture notes |
| --- | --- | --- |
| word | ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ | (78 letters, no space, wider than the Item column) |
| item_word | Title `<word>`, Winning Bid `HKD 100,000.00`, Buyer's Premium `HKD 20,000.00`, Total `HKD 120,000.00` | · |
| item_serial | Title `Serial <word> PSA-10`, Winning Bid `HKD 50,000.00`, Buyer's Premium `HKD 10,000.00`, Total `HKD 60,000.00` | · |
| item_total_2 | Winning Bid `HKD 150,000.00`, Buyer's Premium `HKD 30,000.00`, Total `HKD 180,000.00` | · |

**Steps:**

1. Render `InvoicePdf` with the supplied props.
2. Parse the returned bytes as a PDF document and read page 1.
3. Read every line drawn for `<item_word>` and for `<item_serial>`, and the left edge of the Winning Bid column.

**Expected Results:**

* The `<item_word>` title is drawn on more than one line, and every line stops short of the Winning Bid column.
* The `<item_serial>` title is drawn on more than one line, and every line stops short of the Winning Bid column.
* Each item's three amounts are drawn once, on the first line of its title.
* The first line of the `<item_serial>` title starts with `Serial`, and its last line ends with `PSA-10`.

### g10.shared-invoice-and-receipt-pdf.US1-TC75: The issuer block never stands alone on a page

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
* **Trace:** Document shape

**Pre-conditions:**

* `<renderer>` is rendered once for each count in `<n>`, with `<charges_2>` as the charges, `<summary_1>` as the summary, `<item_total_n>` as the Item Total amounts, `<issuer>` as the issuer, no bank details, and, for `ReceiptPdf`, `<breakdown_1>` as the payment breakdown, and every other required prop supplied.

**Test data:**

| Field | Value |
| --- | --- |
| n | Each count of items from 1 to 40, one render per count. Items are titled `Lot 01`, `Lot 02`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00` |
| item_total_n | Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, supplied for every count |
| charges_2 | Shipping & Handling `HKD 80.00` and Insurance `HKD 40.00`, in that order |
| summary_1 | Subtotal `HKD 121,312.00`, Payment Processing Fee `HKD 4,000.00`, Order Total `HKD 125,312.00` |
| breakdown_1 | Original Invoice Total `HKD 125,312.00`, Previous Payments `HKD 0.00`, Current Payment Received `HKD 125,312.00`, Remaining Balance Due `HKD 0.00`, supplied to `ReceiptPdf` only |
| issuer | Name `Issuer Co`, email `billing@example.com`. The name has no wordmark on file, so page 1 also draws it as text at the top right as the issuer mark. The issuer block is found by its email, with the name on the line directly above it |

| `<renderer>` | Fixture notes |
| --- | --- |
| InvoicePdf | one full pass each |
| ReceiptPdf | one full pass each |

**Steps:**

1. Render `<renderer>` with the first count in `<n>`.
2. Parse the returned bytes as a PDF document.
3. Find the page of the issuer email, of the summary and, on a receipt, of each of the four payment breakdown lines, and read every line drawn on the issuer email's page.
4. Repeat steps 1 to 3 for each other count in `<n>`.
5. Repeat steps 1 to 4 for the other renderer.

**Expected Results:**

* At every count, the page that shows the issuer email also shows the summary.
* On a receipt, that page also shows the four payment breakdown lines.
* On that page, no line of another section is drawn at or below the name line of the issuer block, the line directly above the issuer email.
* At least one count of each renderer runs onto a second page.

### g10.shared-invoice-and-receipt-pdf.US1-TC76: The issuer block sits in the same place on every document

Runs once per row of **Test data**.

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
* **Trace:** Document shape

**Pre-conditions:**

* Both documents are rendered with the issuer name `Issuer Co` and email `billing@example.com` (the name has no wordmark on file, so page 1 also draws it as text at the top right; the issuer block is found by its email, with the name on the line directly above it), items titled `Lot 01`, `Lot 02`, ... in order, one line each, each with Winning Bid `HKD 1,000.00`, Buyer's Premium `HKD 200.00`, Total `HKD 1,200.00`, Item Total amounts Winning Bid `HKD 9,999.00`, Buyer's Premium `HKD 1,999.00`, Total `HKD 11,998.00`, and every other required prop supplied.
* Bank details, where the row gives them, are a SWIFT rail (beneficiary `Test Beneficiary Ltd`, SWIFT/BIC `TESTHKHH`, account `000-123456-001`), an FPS rail (FPS ID `1234567`, beneficiary `Test Beneficiary Ltd`), an HK local transfer rail (bank and code `Test Bank 000`, beneficiary `Test Beneficiary Ltd`, account no. `123-456789-001`) and the reference `IN-LK42301`. A transfer reference, where the row gives one, is `TRF-7731`.

**Test data:**

| `<document>` | `<compared document>` |
| --- | --- |
| `InvoicePdf` with one item and bank details | `InvoicePdf` with one item and no bank details |
| `InvoicePdf` with 30 items and no bank details | `InvoicePdf` with one item and no bank details |
| `ReceiptPdf` with 30 items and no transfer reference | `ReceiptPdf` with one item and no transfer reference |
| `ReceiptPdf` with one item and a transfer reference | `ReceiptPdf` with one item and no transfer reference |

**Steps:**

1. Render `<compared document>`.
2. Parse the returned bytes as a PDF document and read the x and y of the issuer email and of the line directly above it on its last page.
3. Render `<document>` with the same issuer.
4. Parse the returned bytes as a PDF document and read the x and y of the issuer email and of the line directly above it on its last page.

**Expected Results:**

* Step 4: the issuer email and the line directly above it sit at the same x and y as in step 2.
* The block sits at the foot of the last page, right-aligned, name above email.

## Settled

- A Subtotal note that is an empty string or spaces only draws nothing and leaves no gap, as an omitted note does; the blank-content rule that keeps a required line's row does not reach an optional note (decisions Q34).
- A note wider than the summary wraps onto further lines inside the summary's width, directly under Subtotal, and the rest of the summary moves down; the render does not fail for it (decisions Q35).
- Muted is the colour the issuer email already uses on the sheet; the note starts at the left edge of the summary's labels on the row under Subtotal, and no case asserts an exact colour token, size or alignment beyond that and a size no larger than the Subtotal label (decisions Q36).
- The block's refusal to draw a character the standard font lacks names an item title only; the note is the application's English catalogue string, which the standard font draws, and no case or rule covers an undrawable note (decisions Q37).

## Reconciliation

**Run:** QA1, blind pass for `convert-hkd-order-at-subtotal`, amendment of 2026-10-23 (decisions Q8 revised, Q33). It read the governance files, the change's proposal, decisions, outlines and journeys, the PRD pages and the durable suites by targeted search inside a stripped bundle, and opened no excluded source and no requirement or scenario text. It wrote 13 draft cases, `US1-TC81` to `US1-TC93`, and raised four rows. It is the run's own statement, not proof.

**Run:** QA2, reconciliation pass for the amendment, 2026-10-23, in a fresh context. It read the governance files (`specs-to-test-cases.md`, `tcs-conventions.md`, the planning-dev QA2 steps), the change's `decisions.md` through Q33, the two spec deltas, `tech-design.md`, `tasks.md`, the durable PDF suite and the winner-order change suite, and wrote no case from a scenario. A case is linked to a scenario when its results assert every outcome the scenario's THEN and ANDs state, from a starting state of the same class and with values from the same partition. It recomputed QA1's fixtures: 13621 minor USD units at 7.85 is 106,924.85 and rounds up to HK$1,069.25, not the HK$1,070.25 QA1 wrote, and a card fee of HK$38.69 goes with a Subtotal of HK$1,030.00 (task 6.1), not HK$38.72. It is a statement, not proof.

**Blind cases**

| Case | Disposition |
| --- | --- |
| `US1-TC81` (`TC-i81`) | Kept over two rows, the second taken from QA1's `TC85`. QA2 added two results the requirement fixes after the Raised rows closed: the issuer email's colour and the left edge of the summary's labels, and that Shipping & Handling stays the only row above Subtotal; it dropped "or a USD sum" from the last result, which the note itself contradicts. Linked: `g10.shared-invoice-and-receipt-pdf.SC1` |
| `US1-TC82` (`TC-gzu`) | Kept, with `TC89` (`TC-u6o`) regrouped into it as its receipt rows: one starting state class, one route, one checking, a different renderer. QA2 added the missing fixture table (QA1 named `<item_usd>`, `<summary_usd>` and the rest without binding them), the empty and spaces-only rows that Q34 now settles, and the result that positions match the Omitted row. Dropped QA1's `null` row: no anchor or requirement states a null note, and the prop is optional text. Linked: `g10.shared-invoice-and-receipt-pdf.SC3` |
| `US1-TC83` (`TC-c32`) | Reshaped. QA1's rows mixed three claims; the wrap row moved to `TC91`, the short-figure row duplicated `TC81`, and the "figure differs" row kept the real rate 7.85, which cannot show a block that builds the rate. It now runs the note `US$999.00 at 7.00` on both renderers, with `TC91` (`TC-k6p`)'s receipt row folded in, and asserts that `US$131.21` and `7.85` appear nowhere. Dropped QA1's "one piece of text" result, which contradicts a wrapped note. Linked: `g10.shared-invoice-and-receipt-pdf.SC5` |
| `US1-TC84` (`TC-bfo`) | Kept. It asserts the relative reading of muted (lighter than the Subtotal label, no larger, not bold). SC1 rev 2 now states no larger than the summary labels and not bold, so the size and weight results are the requirement's, no longer beyond it; the issuer email's colour stays asserted in `TC81`. Linked jointly with `TC81`: `g10.shared-invoice-and-receipt-pdf.SC1` |
| `US1-TC85` (`TC-52z`) | Regrouped into `TC81` as its Free fee row: the block draws the string `Free` as it draws any other, so only the data differed. Dropped; never published. Its Subtotal reproduces: 12120 at 7.85 is HK$951.42 |
| `US1-TC86` (`TC-pml`) | Kept. Trace moved to Document shape, where the durable one-page cases `TC42` and `TC59` sit. QA2 corrected the fixture: Subtotal HK$1,069.25 for lines of US$136.21 and a Free fee, so the bank-transfer invoice with bank details reads a consistent Order Total. Linked jointly with `TC92`: `g10.shared-invoice-and-receipt-pdf.SC6` |
| `US1-TC87` (`TC-tk2`) | Kept; trace moved to Document shape, as the durable `TC64`. Linked: `g10.shared-invoice-and-receipt-pdf.SC7`, jointly with `TC93` for the receipt |
| `US1-TC88` (`TC-2g8`) | Kept, with `TC90` (`TC-53h`) regrouped into it as its Part payment row: a part payment changes the breakdown strings and nothing else the block draws. QA2 added the result that the breakdown lines carry no note and the issuer email's colour. Linked: `g10.shared-invoice-and-receipt-pdf.SC2` |
| `US1-TC89` (`TC-u6o`), `US1-TC90` (`TC-53h`), `US1-TC85` (`TC-52z`) | Dropped as regrouped above; none was published |
| `US1-TC91` (`TC-k6p`) | Reshaped into the wrap case over both renderers on the note `US$1,234,567,890.12`, which is wider than the summary; QA1's `US$1,234,567.89` may fit one line and so could not assert a wrap. The Q35 answer, wrap, replaces QA1's "one piece of text". Linked: `g10.shared-invoice-and-receipt-pdf.SC4` |
| `US1-TC92` (`TC-6a9`) | Kept; trace to Document shape; fee figure aligned with the other fixtures. Linked jointly with `TC86`: `g10.shared-invoice-and-receipt-pdf.SC6` |
| `US1-TC93` (`TC-5qy`) | Kept; trace to Document shape, as the durable `TC65`. QA2 added two results (the note directly under Subtotal, and no item row moved over to sit with the summary), which `TC87` already held. Linked: `g10.shared-invoice-and-receipt-pdf.SC7`, jointly with `TC87` for the invoice |

**Existing durable cases**

QA1 flagged `TC1`, `TC5`, `TC8`, `TC42`, `TC53`, `TC64` and `TC65` as assuming a summary without a note. None asserts a note's absence: each supplies no Subtotal note, and the optional prop leaves what each asserts true. All seven are left `draft` and their content unchanged; `TC5`, `TC64` and `TC65` are re-issued only for the r6 classification below.

- Reclassified for tcs-rules r6: `TC4`, `TC5`, `TC6`, `TC9`, `TC11`, `TC13`, `TC17`, `TC18`, `TC21`, `TC24`, `TC26`, `TC34`, `TC35`, `TC49`, `TC51`, `TC54`, `TC55`, `TC56`, `TC58`, `TC59`, `TC60`, `TC64`, `TC65`, `TC67`, `TC68`, `TC69`, `TC70`, `TC75` and `TC76` are re-issued under their ids and markers with only Severity, Type or Suites changed, because the former values (`normal`, `acceptance`, `release`) are refused once this capability's suite is in the fold. Nothing else about them changed: steps, results, test data, trace, `covers`, `rev`, Status, Automation status and Decided-by are as the durable suite holds them, so the note above about `TC5`, `TC64` and `TC65` still stands for their content
- `TC1`, `TC8` ("every prop supplied") predate the optional note. Their results list the charge and summary lines and none assumes a note is absent; a note row would not contradict them. A person who reads "every prop" as including the note finds it unasserted, which `TC81` and `TC88` assert
- `TC5` (Insurance omitted), `TC53` (charges follow Item Total, three summary lines), `TC42` (one page) and `TC64`, `TC65` (page end) run without a note, and the summary they describe is the summary without one
- The legacy `covers` lists on `TC1`, `TC2` and `TC5` name the same twelve scenarios each, far more than they assert; they include `SC-63o` and `SC-8b8`, whose text the amendment leaves as it was. They are over-claimed and left for `/tcs-review`

**Scenario coverage**

| Scenario | Covered by |
| --- | --- |
| `g10.shared-invoice-and-receipt-pdf.SC1` | `US1-TC81` for the order, the exact text, the colour and the single charge row, one row each for a Card fee and a Free fee, jointly with `US1-TC84` for size and weight |
| `g10.shared-invoice-and-receipt-pdf.SC2` | `US1-TC88`, one row each for a full and a part payment |
| `g10.shared-invoice-and-receipt-pdf.SC3` | `US1-TC82`, five rows over both renderers |
| `g10.shared-invoice-and-receipt-pdf.SC4` | `US1-TC91` |
| `g10.shared-invoice-and-receipt-pdf.SC5` | `US1-TC83`, one row per renderer |
| `g10.shared-invoice-and-receipt-pdf.SC6` | `US1-TC86` for the invoice and `US1-TC92` for the receipt, jointly: the scenario states one outcome for two documents with two starting states, and each case asserts it in full for its document |
| `g10.shared-invoice-and-receipt-pdf.SC7` | `US1-TC87` for the invoice and `US1-TC93` for the receipt, jointly: one outcome for two documents, each case asserting it in full for its document over the counts from the plain fit to the first two-page count with a note, not the scenario's 1 to 40 items; below that window the document is one page by construction |
| `shared-ui-invoice-and-receipt-pdf-SC-3`, `SC-4`, `SC-16`, `SC-17`, `SC-27`, `SC-61`, `SC-77`, `SC-67`, `SC-68` | Restated in the delta with their text unchanged; the durable cases that hold them keep them |

**Uncovered**

- None. The requirement's clause that a summary with its note taller than a page's room is a "cannot fit" refusal has no scenario and no case; it is reported for the spec, not closed here

**Over-claimed**

- `US1-TC86` and `US1-TC92` each assert half of `SC6` and are linked to it jointly, as the table says
- `US1-TC87` and `US1-TC93` each assert `SC7` for one document and are linked jointly
- `US1-TC81` and `US1-TC84` assert `SC1` jointly: order, text, colour and rows in the first, size and weight in the second

**Contradictions between the readings**

- None. QA1's `TC83` result that the note is "on one piece of text" disagrees with the wrap QA1 itself recommended in its second raised row; it is a QA1 inconsistency, settled by Q35 and the requirement, not a disagreement between the readings

**Anchor coverage**

| Anchor | Cases | Scenarios |
| --- | --- | --- |
| Root group InvoicePdf export | `US1-TC81`, `TC82`, `TC84`, `TC91` | SC1, SC3, SC4 covered |
| Root group ReceiptPdf export | `US1-TC88`; the receipt rows of `TC82` and `TC91` trace InvoicePdf export, where SC3 and SC4 are served | SC2 covered |
| Root group Presentation-only contract | `US1-TC83` | SC5 covered |
| Root group Document shape | `US1-TC86`, `TC87`, `TC92`, `TC93` | SC6, SC7 covered |

**Raised**

QA1's four rows close as Q34 to Q37 in `decisions.md`: a blank note, a note wider than the summary, what muted and under the row mean on a sheet, and a character the font cannot draw. None is held.
