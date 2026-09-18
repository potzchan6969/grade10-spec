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
**I want** only the difference returned below the invoice total,
**so that** I know the sale still stands.

### winner-order-US15-TC1-1: An overpayment keeps the order open

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
* **Trace:** winner-order-US-15

**Pre-conditions:**

* customer(winner of `<overpaid order>`) is on Winner Order after the
  overpayment difference was returned.

**Steps:**

1. Read the order status, invoice lines, returned amount and refund details.

**Expected Results:**

* The order status and invoice lines are unchanged.
* Only the returned difference appears below Order Total.
* The refund details can be opened without exposing operator proof or the full provider reference.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Refunded retains issued documents and removes self-service | **Folded in:** `winner-order-SC-157` |
| An overpayment returns only the difference and keeps the sale open | **Folded in:** `winner-order-SC-155` |
