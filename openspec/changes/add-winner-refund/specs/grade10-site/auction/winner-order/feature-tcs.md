# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## winner-order-US14: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded,
**I want** Winner Order to read Refunded and retain my records,
**so that** I know the order is closed and can still prove what I paid.

### winner-order-US14-TC1-1: Refunded keeps the invoice and receipts

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
* **Trace:** winner-order-US-14

**Pre-conditions:**

* customer(winner of `<refunded order>`) is on Winner Order.

**Steps:**

1. Read the status, stepper, actions and receipt links.

**Expected Results:**

* The order reads Refunded.
* Pay, address editing and shipment actions are absent.
* The invoice and every existing receipt remain downloadable.
* No refund letter is required by this surface.

## winner-order-US15: Winner sees an overpayment returned

**As a** winner who paid more than the order,
**I want** only the difference returned while the order stays in its current status,
**so that** I can see that the sale still stands.

### winner-order-US15-TC1-1: Overpayment leaves the order status unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner of `<overpaid order>`) is on Winner Order.

**Steps:**

1. Read the order status, Order Summary, and refund alert.

**Expected Results:**

* The order keeps its pre-refund status.
* Order Summary keeps the amount that was due.
* The refund alert shows only the difference returned.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Refunded retains issued documents and removes self-service | **Folded in:** `winner-order-SC-140` |
