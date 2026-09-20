# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## grade10-site-auction-account-record-US8: Winner revisits a partially paid order

**As a** winner with an order being collected in parts,
**I want** My Auctions to keep the Won row linked to the order,
**so that** I can return to the locked payment record.

### grade10-site-auction-account-record-US8-TC1-1: A partially paid Won row opens Winner Order

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
* **Trace:** grade10-site-auction-account-record-US-08

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

| Finding | Disposition |
| --- | --- |
| The Won row remains linked while collection is partial | **Folded in:** `grade10-site-auction-account-record-SC-62` |
