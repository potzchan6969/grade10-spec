# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## grade10-site-auction-account-record-US9: Won Status shows Setup Overdue and Payment Overdue

**As a** winner scanning My Auctions,
**I want** overdue won lots to read their overdue state in Status,
**so that** I can tell closed self-service from an open window.

### grade10-site-auction-account-record-US9-TC1-1: My Auctions names both overdue states

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-09

**Pre-conditions:**

* customer has one Won order past setup deadline and one unpaid invoice past payment deadline.

**Steps:**

1. Open My Auctions and read the Status column.

**Expected Results:**

* The rows read Setup Overdue and Payment Overdue.
* Each row still offers View order.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| My Auctions uses Status for both overdue outcomes | **Folded in:** `grade10-site-auction-account-record-SC-63` |
