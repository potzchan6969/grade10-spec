# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## auction-status-US1: Refund is terminal after partial collection

**As a** winner or operator,
**I want** a refunded order to remain terminal,
**so that** later payment events cannot reopen it.

### auction-status-US1-TC1-1: A refund is terminal after partial collection

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has invoice status `refunded` after partial payment and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The status is Refunded.
* It does not return to Partially Paid or Processing.

### auction-status-US1-TC2-1: An overpayment keeps the existing status

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order has a payment above its invoice total and the difference has been returned.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The order keeps its status from before the overpayment return.
* The status is not Refunded.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Refunded remains terminal after a partial collection | **Folded in:** `auction-status-SC-51` |
| An overpayment does not derive Refunded | **Folded in:** `auction-status-SC-54` |
