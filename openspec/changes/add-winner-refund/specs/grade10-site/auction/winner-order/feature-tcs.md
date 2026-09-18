# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-r3

## winner-order-US-10: Winner sees a refunded order as Refunded

**As a** winner whose order Grade10 refunded,
**I want** Winner Order to read Refunded and retain my records,
**so that** I know the order is closed and can still prove what I paid.

### winner-order-US-10-TC1-1: Refunded keeps the invoice and receipts

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
* **Trace:** winner-order-US-10

**Pre-conditions:**

* customer(winner of `<refunded order>`) is on Winner Order.

**Steps:**

1. Read the status, stepper, actions and receipt links.

**Expected Results:**

* The order reads Refunded.
* Pay, address editing and shipment actions are absent.
* The invoice and every existing receipt remain downloadable.
* No refund letter is required by this surface.

## Settled

## Reconciliation

Pending the reconciled requirement pass.

