# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-r3

## post-sale-US-09: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record money sent back in Stripe or by bank transfer,
**so that** the order and the lot agree with the refund.

### post-sale-US-09-TC1-1: A refund records the financial facts and closes the order

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<paid order>` has 100000 minor units paid.
* admin(holds refund-processing) is on the order detail.

**Steps:**

1. Record a 60000-minor-unit bank refund with a reason, note, reference, one proof file and return-to-stock selected.

**Expected Results:**

* The refund is accepted and gets the next audit number.
* The order outcome is Refunded and cannot be refunded again.
* The lot returns to stock.
* The refund record names the operator and time.

### post-sale-US-09-TC2-1: A refund cannot return more than was paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** post-sale-US-09

**Pre-conditions:**

* `<partially-paid order>` has 40000 minor units paid.
* admin(holds refund-processing) is on the order detail.

**Steps:**

1. Submit a refund of 40001 minor units.

**Expected Results:**

* The refund is refused and no audit number is consumed.
* The order stays Partially Paid.

## post-sale-US-10: Finance reconciles auction refunds

**As a** finance operator,
**I want** to filter the queue to Refunded and read the full refund record,
**so that** each external refund matches one Grade10 record.

### post-sale-US-10-TC1-1: The queue and order detail expose one refund record

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-10

**Pre-conditions:**

* A Refunded order has a recorded amount, method, reference, reason, proof and audit number.
* admin(holds refund-processing) is on the post-sale queue.

**Steps:**

1. Filter the queue to Refunded.
2. Open the order and invoice log.

**Expected Results:**

* The order appears in the filter.
* The order detail and invoice log show the same complete refund record.

## Settled

## Reconciliation

Pending the reconciled requirement pass.

