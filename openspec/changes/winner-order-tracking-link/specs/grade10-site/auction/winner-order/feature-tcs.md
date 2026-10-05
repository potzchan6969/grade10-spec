# grade10-site/auction/winner-order Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r3.0

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** to see where the lot is and open the carrier's tracker,
**so that** I know when to expect delivery without contacting Grade10.

<!-- trace:case id=g10.auction-winner-order.TC-4zy rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0 -->
### winner-order-US2-TC2-1: A dispatched lot shows the tracking number as the carrier link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_shipped>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_shipped> | A paid order dispatched with <tracking number> |

**Steps:**

1. Read Order Progress.
2. Choose <tracking number>.

**Expected result:**

* Order Progress shows <tracking number> as a link.
* No Track shipment button and no carrier name in Order Progress.
* Choosing the link opens the carrier tracking page.

### winner-order-US2-TC12-1: Delivered still shows the tracking number link

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_delivered>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_delivered> | A paid order with fulfilment `fulfilled`, delivery confirmed, and <tracking number> |

**Steps:**

1. Read Order Progress.
2. Choose <tracking number>.

**Expected result:**

* Order Progress still shows <tracking number> as a link.
* Choosing the link opens the carrier tracking page.

## Reconciliation

- **Covered:** `winner-order-SC-251` ← `US2-TC2-1`; `winner-order-SC-252` ←
  `US2-TC9-1`.
- **Raised:** none.
