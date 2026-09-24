# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## winner-order-US5: Winner misses the payment deadline

**As a** winner whose invoice deadline has passed unpaid,
**I want** Winner Order to read Payment Overdue with Contact Us,
**so that** I know card Pay has stopped.

### winner-order-US5-TC1-1: Payment Overdue removes Pay

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-05

**Pre-conditions:**

* customer(winner of `<expired invoice>`) is on Winner Order.

**Steps:**

1. Read the status, alert and available actions.

**Expected Results:**

* The page reads Payment Overdue.
* The alert offers Contact Us.
* Pay and the payment deadline are absent.

## winner-order-US7: Winner misses the address deadline

**As a** winner who did not confirm a delivery address in time,
**I want** Winner Order to read Setup Overdue with Contact Us,
**so that** I know self-service setup has stopped.

### winner-order-US7-TC1-1: Setup Overdue removes Confirm

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-07

**Pre-conditions:**

* customer(winner of `<missed-setup order>`) is on Winner Order.

**Steps:**

1. Read the status, alert and address controls.

**Expected Results:**

* The page reads Setup Overdue.
* The alert offers Contact Us.
* Confirm and address editing are absent.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Overdue removes Confirm or Pay and keeps Contact Us | **Folded in:** `winner-order-SC-158` and `SC-159` |
