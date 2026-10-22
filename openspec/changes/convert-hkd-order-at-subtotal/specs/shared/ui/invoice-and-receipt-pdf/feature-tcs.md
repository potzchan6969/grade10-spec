# shared/ui/invoice-and-receipt-pdf Test Cases

**Status:** pending-review · 0/10
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

QA1 flagged `TC1`, `TC5`, `TC8`, `TC42`, `TC53`, `TC64` and `TC65` as assuming a summary without a note. None asserts a note's absence: each supplies no Subtotal note, and the optional prop leaves what each asserts true. All seven are left `draft`, unchanged, and no re-issue is made.

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
