# grade10-site/auction/order-status Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## auction-status-US8: Expired invoice keeps Pending Payment without winner card pay

**As a** winner or operator,
**I want** a paid, undispatched order to read Preparing Shipment,
**so that** Status alone shows packing without implying the lot already shipped.

<!-- trace:case id=g10.auction-order-status.TC-sik rev=1 covers=g10.auction-order-status.SC-8qq,g10.auction-order-status.SC-xlj,g10.auction-order-status.SC-f7y,g10.auction-order-status.SC-aj3,g10.auction-order-status.SC-apb,g10.auction-order-status.SC-div,g10.auction-order-status.SC-h5p,g10.auction-order-status.SC-w76,g10.auction-order-status.SC-7zj,g10.auction-order-status.SC-12a,g10.auction-order-status.SC-agq,g10.auction-order-status.SC-kjm,g10.auction-order-status.SC-0sk,g10.auction-order-status.SC-yon,g10.auction-order-status.SC-0dn,g10.auction-order-status.SC-cgu,g10.auction-order-status.SC-nin,g10.auction-order-status.SC-4ke -->
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

**Run:** 2026-10-07, QA2 for `clarify-auction-shipping-progress-copy`, appended to the durable reconciliation; earlier runs stand.

- **Covered:** `auction-status-SC-07` ← `US1-TC7-1`.
- **Raised:** none.
