# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## post-sale-US16: Operator records a refund a winner asked Customer Service for

**As an** operator with refund processing,
**I want** to record money sent back in Stripe or by bank transfer,
**so that** the order and the lot agree with the refund.

### post-sale-US16-TC1-1: A refund records the financial facts and closes the order

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
* **Trace:** post-sale-US-16

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

### post-sale-US16-TC2-1: A refund cannot return more than was paid

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
* **Trace:** post-sale-US-16

**Pre-conditions:**

* `<partially-paid order>` has 40000 minor units paid.
* admin(holds refund-processing) is on the order detail.

**Steps:**

1. Submit a refund of 40001 minor units.

**Expected Results:**

* The refund is refused and no audit number is consumed.
* The order stays Partially Paid.

## post-sale-US17: Finance reconciles auction refunds

**As a** finance operator,
**I want** to filter the queue to Refunded and read the full refund record,
**so that** each external refund matches one Grade10 record.

### post-sale-US17-TC1-1: The queue and order detail expose one refund record

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
* **Trace:** post-sale-US-17

**Pre-conditions:**

* A Refunded order has a recorded amount, method, reference, reason, proof and audit number.
* admin(holds refund-processing) is on the post-sale queue.

**Steps:**

1. Filter the queue to Refunded.
2. Open the order and invoice log.

**Expected Results:**

* The order appears in the filter.
* The order detail and invoice log show the same complete refund record.

## post-sale-US08: Operator reconstructs an order's history

**As an** operator deciding whether to reinstate a buyer,
**I want** the existing history to remain available beside refunds,
**so that** the refund record adds to rather than replaces the order history.

### post-sale-US08-TC1-1: Refunds add to the order history

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-08

**Pre-conditions:**

* admin(holds refund-processing) is viewing an order with existing invoice and fulfilment history.

**Steps:**

1. Open the order history after a refund is recorded.

**Expected Results:**

* Existing invoice and fulfilment entries remain available beside the refund record.

## post-sale-US01: Operator works the listing queue by outcome

**As an** auction operator,
**I want** the existing outcome queue to remain available with Refunded added,
**so that** the new filter does not change other outcomes.

### post-sale-US01-TC1-1: Other queue outcomes remain available

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-01

**Pre-conditions:**

* admin(holds refund-processing) is on the post-sale queue with orders in existing outcomes and a Refunded order.

**Steps:**

1. Read the queue outcomes and filter options.

**Expected Results:**

* Existing outcomes remain available and Refunded is an additional outcome.

## Settled

## Reconciliation

| Whether a partial payment is refunded in full or by an operator-entered amount | **Folded in:** `grade10-admin-auction-post-sale-SC-145` and `grade10-admin-auction-post-sale-SC-146` |
| Amount, evidence, stock and audit fields | **Folded in:** `grade10-admin-auction-post-sale-SC-145`, `grade10-admin-auction-post-sale-SC-146` and `grade10-admin-auction-post-sale-SC-147` |
