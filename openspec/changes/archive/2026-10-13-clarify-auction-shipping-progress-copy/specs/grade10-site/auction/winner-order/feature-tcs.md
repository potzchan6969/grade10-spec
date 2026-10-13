# grade10-site/auction/winner-order Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## winner-order-US2: Winner follows a settled lot to delivery

**As a** winner who has paid,
**I want** a receipt PDF that says how I paid, what was paid before it and what
is still owed, a tracker, and proof of what was handed over,
**so that** I can account for a high-value purchase without asking Grade10 for records.

<!-- trace:case id=g10.auction-winner-order.TC-nmg rev=1 covers=g10.auction-winner-order.SC-49p,g10.auction-winner-order.SC-9qq,g10.auction-winner-order.SC-0wc,g10.auction-winner-order.SC-8xb,g10.auction-winner-order.SC-g94,g10.auction-winner-order.SC-vxf,g10.auction-winner-order.SC-kiz,g10.auction-winner-order.SC-fpp,g10.auction-winner-order.SC-aaq,g10.auction-winner-order.SC-ubz,g10.auction-winner-order.SC-58l,g10.auction-winner-order.SC-u1h,g10.auction-winner-order.SC-dzh,g10.auction-winner-order.SC-cdf,g10.auction-winner-order.SC-6b0,g10.auction-winner-order.SC-h7d,g10.auction-winner-order.SC-k4r -->
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
* Badge uses `default`.
* Shipping is the current (progress) progress step — not incomplete.
* Shipping subtext reads Preparing to ship.
* No step is labelled Preparing Shipment.

<!-- trace:case id=g10.auction-winner-order.TC-7j8 rev=2 covers=g10.auction-winner-order.SC-lk0 -->
### winner-order-US2-TC20-2: Shipped keeps Shipping current

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

* customer(winner) is on <winner order url> for <order_shipped>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_shipped> | A paid, fulfilled order with a ship date, a tracking number and a recorded tracker link |

**Steps:**

1. Read the status badge and Order Progress.

**Expected result:**

* Badge reads Shipped and uses `default`.
* Shipping is the current progress step with the day-only ship date.
* The tracking number is the external carrier link.
* Order Progress adds no separate Track shipment control and no separate carrier name.

### winner-order-US2-TC56-1: A shipped order with no tracker link shows the number as plain text

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** winner-order-US-02

**Pre-conditions:**

* customer(winner) is on <winner order url> for <order_shipped_no_link>.

**Test data:**

| Field | Value |
| --- | --- |
| <order_shipped_no_link> | A paid, fulfilled order with a ship date and a tracking number, and no recorded tracker link |

**Steps:**

1. Read Order Progress.

**Expected result:**

* Shipping is the current progress step with the day-only ship date.
* The tracking number reads as plain text, not a link.
* Order Progress shows no carrier name and no Track shipment control.

## Reconciliation

**Run:** 2026-10-07, QA2 for `clarify-auction-shipping-progress-copy`, appended to the durable reconciliation; earlier runs stand.

- **Covered:** `winner-order-SC-55` ← `US2-TC55-1`.
- **Covered:** `winner-order-SC-253` ← `US2-TC20-2` (recorded tracker link) and `US2-TC56-1` (no tracker link).
- **Raised:** none.
