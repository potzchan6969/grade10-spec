# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## auction-status-US2: Partially Paid status ends self-service Pay for good

**As a** winner or operator,
**I want** an invoice with a recorded payment to read Partially Paid,
**so that** the status says who settles the remaining money.

### auction-status-US2-TC1-1: A recorded payment derives Partially Paid

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has invoice status `partially_paid`, a positive remaining balance, and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The derived status is Partially Paid.
* The remaining balance is not used to derive a different status.

### auction-status-US2-TC2-1: Partially Paid has no self-service deadline

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
* **Trace:** Guards

**Pre-conditions:**

* An auction order is Partially Paid and still has money due.

**Steps:**

1. Attempt winner card Pay, invoice reissue and operator cancellation.

**Expected Results:**

* Winner Pay, reissue and cancellation are refused.
* The order remains Partially Paid.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Partially Paid is derived and removes self-service | **Folded in:** `auction-status-SC-49` and `auction-status-SC-50` |
