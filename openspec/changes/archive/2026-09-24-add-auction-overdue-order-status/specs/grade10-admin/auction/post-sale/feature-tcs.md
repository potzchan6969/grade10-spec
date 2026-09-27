# grade10-admin/auction/post-sale Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## post-sale-US15: Operator filters Setup Overdue and Payment Overdue

**As an** operator,
**I want** Setup Overdue and Payment Overdue as queue outcomes,
**so that** I find deadline-missed orders using the same names as the winner.

### post-sale-US15-TC1-1: The queue uses the two overdue outcomes

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-15

**Pre-conditions:**

* The queue has one order past an incomplete setup deadline and one unpaid invoice past its payment deadline.

**Steps:**

1. Read both rows.
2. Filter to Setup Overdue.
3. Filter to Payment Overdue.

**Expected Results:**

* The rows read Setup Overdue and Payment Overdue.
* Each filter returns only its matching order.

### post-sale-US15-TC2-1: Overdue outcomes do not erase the action context

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** post-sale-US-15

**Pre-conditions:**

* The queue contains a Setup Overdue and a Payment Overdue order.

**Steps:**

1. Read each row's needs-action treatment and open each order.

**Expected Results:**

* The queue uses one outcome per order.
* The order details identify the missed setup or payment deadline and offer Contact Us to the winner rather than a self-service action.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Queue labels preserve the operator action context | **Folded in:** `grade10-admin-auction-post-sale-SC-148` and `SC-149` |
