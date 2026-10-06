# grade10-site/auction/order-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## auction-status-US8: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** a paid, undispatched order to read Preparing Shipment,
**so that** Status alone shows packing without implying the lot already shipped.

### auction-status-US8-TC7-1: Paid and undispatched derives Preparing Shipment

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Derived order status

**Pre-conditions:**

* An auction order exists with invoice `paid` and fulfilment `unfulfilled`.

**Steps:**

1. Read derived order status.

**Expected result:**

* Order derives as Preparing Shipment.

## Reconciliation

- **Covered:** `auction-status-SC-07` ← `US1-TC7-1`.
- **Raised:** none.
