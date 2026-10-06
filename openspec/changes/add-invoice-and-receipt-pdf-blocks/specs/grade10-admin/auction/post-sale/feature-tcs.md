# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## post-sale-US19: Operator records the winner's zone by phone

**As an** operator,
**I want** to record the winner's stated time zone with phone setup,
**so that** an invoice sent after the call carries the right deadline zone.

### post-sale-US19-TC1-1: Phone setup records the winner's time zone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-19

**Pre-conditions:**

* An unconfirmed Setup Overdue order has invoice `not_issued` and an operator holds payment-processing.

**Steps:**

1. Record addresses and the winner's stated `America/Los_Angeles` zone by phone.

**Expected Results:**

* The order stores the zone with the setup facts and retains the phone-record log entry.

### post-sale-US19-TC2-1: Phone setup refuses a missing or invalid zone

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-19

**Pre-conditions:**

* The phone setup addresses are valid.

**Steps:**

1. Submit without a zone, then with `Not/A_Zone`.

**Expected Results:**

* Both submissions are refused and neither confirms the order.

## post-sale-US20: Operator issues an invoice in the winner's zone

**As an** operator,
**I want** the invoice to keep the winner's confirmed time zone at send,
**so that** its deadline and later receipts remain readable in the same zone.

### post-sale-US20-TC1-1: Missing winner zone blocks issue

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-20

**Pre-conditions:**

* A legacy order has confirmed addresses but no winner zone.

**Steps:**

1. Try first send or reissue with an otherwise valid quote.

**Expected Results:**

* No new revision or letter is created; the refusal names the missing zone.

### post-sale-US20-TC2-1: Invoice and receipts use the revision zone

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-20

**Pre-conditions:**

* An order has `America/New_York` as its confirmed zone.

**Steps:**

1. Send the invoice and record a payment.
2. Reissue with a valid quote change and record another payment.
3. Open documents from both revisions.

**Expected Results:**

* Each revision stores `America/New_York`; invoices and receipts use that zone even when the reader's browser zone changes.

### post-sale-US20-TC3-1: Historical documents use labelled Hong Kong time

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-20

**Pre-conditions:**

* A historical revision has no zone snapshot; one document is archived and another has not been rendered.

**Steps:**

1. Open both documents from a browser outside Hong Kong.

**Expected Results:**

* Archived bytes stay unchanged; the newly rendered document labels its dates as Hong Kong time.

### post-sale-US20-TC4-1: An older order records a missing zone before send

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-20

**Pre-conditions:**

* An existing confirmed order has no stored zone; the operator holds payment-processing.

**Steps:**

1. Record the winner's stated `Europe/London` zone with a reason.
2. Attempt to replace it with another zone.

**Expected Results:**

* The first action stores the zone with an invoice-log entry; the replacement is refused and existing invoice documents stay unchanged.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| US19-TC1 (phone zone source) | Covered by `post-sale-SC-300` |
| US19-TC2 (missing or invalid phone zone) | Covered by `post-sale-SC-301` |
| US20-TC1 (issue guard) | Covered by `post-sale-SC-302` |
| US20-TC2 (revision and receipt snapshots) | Covered by `post-sale-SC-303` and `post-sale-SC-304` |
| US20-TC3 (historical rendering) | Covered by `post-sale-SC-305` |
| US20-TC4 (legacy zone record) | Covered by `post-sale-SC-306` |
| Uncovered anchors | None - phone setup, issue and documents each have a case |
| Contradicted readings | None |
