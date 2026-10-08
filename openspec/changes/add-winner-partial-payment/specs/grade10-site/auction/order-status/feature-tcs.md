# grade10-site/auction/order-status Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-09-18, tcs-rules r3.0

## auction-status-US7: Partially Paid status ends self-service Pay for good

**As a** winner or operator,
**I want** an invoice with a recorded payment to read Partially Paid,
**so that** the status says who settles the remaining money.

<!-- trace:case id=g10.auction-order-status.TC-jzx rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn,g10.auction-order-status.SC-cgu,g10.auction-order-status.SC-nin,g10.auction-order-status.SC-4ke -->
### auction-status-US7-TC3-1: A recorded payment derives Partially Paid

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

* An auction order has invoice status `partially_paid`, a positive remaining balance, and fulfilment status `unfulfilled`.

**Steps:**

1. Read the derived order status.

**Expected Results:**

* The derived status is Partially Paid.
* The remaining balance is not used to derive a different status.

<!-- trace:case id=g10.auction-order-status.TC-p49 rev=1 covers=g10.auction-order-status.SC-ztl,g10.auction-order-status.SC-wjo,g10.auction-order-status.SC-4yo,g10.auction-order-status.SC-9bm,g10.auction-order-status.SC-soi,g10.auction-order-status.SC-kki,g10.auction-order-status.SC-e1r -->
### auction-status-US7-TC4-1: Partially Paid has no self-service deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Guards

**Pre-conditions:**

* An auction order is Partially Paid and still has money due.

**Steps:**

1. Attempt winner card Pay, invoice reissue and operator cancellation.

**Expected Results:**

* Winner Pay, reissue and cancellation are refused.
* The order remains Partially Paid.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Partially Paid is derived and removes self-service | **Folded in:** `auction-status-SC-49` and `auction-status-SC-50` |
