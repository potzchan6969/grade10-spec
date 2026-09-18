# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-18, tcs-r3

## Derived order status

### grade10-site-auction-order-status-SC-01: A refund is terminal after partial collection

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

## Settled

## Reconciliation

Pending the reconciled requirement pass.

