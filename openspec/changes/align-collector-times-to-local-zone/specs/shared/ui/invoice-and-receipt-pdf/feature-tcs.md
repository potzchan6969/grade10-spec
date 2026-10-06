# shared/ui/invoice-and-receipt-pdf Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-ui-invoice-and-receipt-pdf-US1: Invoice and Receipt PDF component contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/winner-order`, which composes the block behind the Invoice PDF control (`winner-order-SC-57`, `winner-order-SC-109`) and the Receipt PDF control (`winner-order-SC-67`)

**As a** customer,
**I want** the Invoice and Receipt PDFs I open from Winner Order to show every line and address Grade10 already committed to, from one shared component,
**so that** the document I read or download matches what the order page told me, however the page that composes it is built.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-sgk rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-57a -->
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

## Reconciliation

**Run:** QA2, 2026-10-06, for change `align-collector-times-to-local-zone`. Document dates name GMT+8.

| Finding | Disposition |
| --- | --- |
| PDF sent-at ends in GMT+8, not HKT | **Folded in:** `shared-ui-invoice-and-receipt-pdf-SC-43` / US1-TC41-1 |
