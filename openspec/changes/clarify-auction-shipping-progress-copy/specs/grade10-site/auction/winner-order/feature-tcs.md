# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** Order Progress to say Shipping while the lot is packing,
**so that** I do not read the current step as already shipped.

### winner-order-US2-TC55-1: Preparing Shipment pings Shipping with Preparing to ship

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_preparing_shipment>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_preparing_shipment> | A paid order with fulfilment `unfulfilled` |

**Steps:**

1. Read the status badge.
2. Read Order Progress.

**Expected result:**

* Badge reads Preparing Shipment.
* Shipping is the current (progress) progress step — not incomplete.
* Shipping subtext reads Preparing to ship.
* No step is labelled Preparing Shipment.

## Reconciliation

- **Covered:** `winner-order-SC-55` ← `US2-TC55-1`.
- **Raised:** none.
