# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## auction-status-US3: Payment deadline past reads Payment Overdue

**As a** winner or operator,
**I want** an unpaid invoice past its deadline to read Payment Overdue,
**so that** the status shows self-service Pay has closed.

### auction-status-US3-TC1-1: An expired invoice derives Payment Overdue

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

* An unpaid invoice has stored status `expired` and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The status is Payment Overdue.
* Winner card Pay is unavailable.

## auction-status-US4: Setup deadline past reads Setup Overdue

**As a** winner or operator,
**I want** incomplete setup past its deadline to read Setup Overdue,
**so that** the status shows self-service Confirm has closed.

### auction-status-US4-TC1-1: An incomplete setup derives Setup Overdue

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

* An auction order has no confirmed address, no invoice and a passed address deadline.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The status is Setup Overdue.
* Winner address confirmation is unavailable.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Overdue names are derived from deadline and invoice facts | **Folded in:** `auction-status-SC-52` and `SC-53` |
