# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-r3

## After a close

### grade10-site-auction-account-record-US-08-TC1-1: A partially paid Won row opens Winner Order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** After a close

**Pre-conditions:**

* customer owns a Won lot whose order is Partially Paid.

**Steps:**

1. Open My Auctions and read the Won row.
2. Select View order.

**Expected Results:**

* The row status is Partially Paid with its warning treatment.
* View order opens the Partially Paid Winner Order.

## Settled

## Reconciliation

Pending the reconciled requirement pass.

