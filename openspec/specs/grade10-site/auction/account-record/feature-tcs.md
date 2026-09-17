# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## grade10-site-auction-account-record-US8: Winner opens settlement from My Auctions

**As a** winner,
**I want** every Won row to open Winner Order without helper clutter,
**so that** I can continue settlement without reading contact copy on the table.

### grade10-site-auction-account-record-US8-TC1-1: Won row offers View order

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
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Collector has Won standings across Awaiting Address, Pending Payment, and Refunded.

**Steps:**

1. Open My Auctions.
2. Inspect each Won row.

**Expected Results:**

* Each Won row offers View order into that lot's Winner Order.

### grade10-site-auction-account-record-US8-TC2-1: Didn’t win has no View order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Collector has a Didn’t win row with hold being released.

**Steps:**

1. Open My Auctions.
2. Inspect the Didn’t win row.

**Expected Results:**

* No View order entry to Winner Order.
* Hold being-released copy remains.

### grade10-site-auction-account-record-US8-TC3-1: Expired Won row is calm

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Won listing with invoice `expired`.

**Steps:**

1. Open My Auctions.
2. Read the Won row.

**Expected Results:**

* Standing is Pending Payment.
* View order is present.
* No secondary helper under the standing, including no how-to-reach-Grade10 on the row.

### grade10-site-auction-account-record-US8-TC4-1: Awaiting Address Won row has no confirm-address helper line

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-08

**Pre-conditions:**

* Won listing in Awaiting Address.

**Steps:**

1. Open My Auctions.

**Expected Results:**

* Standing badge and View order only under Won presentation — no “confirm address” detail line.

## Raised

- Exact control label (View order vs Open order) is design copy; suite accepts either clear entry.

## Settled

- Contact for expired payment is Winner Order only (author @tangconst).
- Didn’t win hold copy stays.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suite required View order on every Won | Folded as SC-56 |
| Suite required no View order on Didn’t win | Folded as SC-57 |
| Suite required no row contact / no Won helpers | Folded as SC-22 amend + SC-58 |
| Hold copy retained for Didn’t win | Covered by redesign/durable hold scenarios; not removed here |
