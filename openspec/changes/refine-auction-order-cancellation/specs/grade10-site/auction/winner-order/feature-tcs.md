# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-r3

## winner-order-US-13: Winner learns their order was cancelled

**As a** winner whose order an operator cancelled,
**I want** Winner Order to say it was cancelled and when,
**so that** I know the order is closed and how to contact Grade10.

### winner-order-US-13-TC1-1: Cancelled keeps the lot and winning bid visible

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
* **Trace:** winner-order-US-13

**Pre-conditions:**

* customer(winner of `<cancelled order>`) is on Winner Order.

**Steps:**

1. Read the status, lot, winning bid and actions.

**Expected Results:**

* The page says Cancelled on the cancellation date.
* The lot and winning bid remain visible.
* Contact Us is the only action.
* No cancellation reason is shown.

## Settled

## Reconciliation

Pending the reconciled requirement pass.

