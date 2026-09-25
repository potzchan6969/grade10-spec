# grade10-site/auction/account-record Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## grade10-site-auction-account-record-US8: Winner opens settlement from My Auctions

**As a** winner,
**I want** every Won row to open Winner Order without helper clutter,
**so that** I can continue settlement without reading contact copy on the table.

<!-- trace:case id=g10.auction-account-record.TC-hc2 rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
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

* Collector has Won standings across Awaiting Setup, Pending Payment, Payment Overdue, and Refunded.

**Steps:**

1. Open My Auctions.
2. Inspect each Won row.

**Expected Results:**

* Each Won row offers View order into that lot's Winner Order.

<!-- trace:case id=g10.auction-account-record.TC-flb rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
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

<!-- trace:case id=g10.auction-account-record.TC-qo0 rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
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

* Standing is Payment Overdue.
* View order is present.
* No secondary helper under the standing, including no how-to-reach-Grade10 on the row.

<!-- trace:case id=g10.auction-account-record.TC-5uz rev=1 covers=g10.auction-account-record.SC-vwk,g10.auction-account-record.SC-e7i,g10.auction-account-record.SC-ewb,g10.auction-account-record.SC-ub6,g10.auction-account-record.SC-w7y,g10.auction-account-record.SC-n3a,g10.auction-account-record.SC-cba,g10.auction-account-record.SC-bge,g10.auction-account-record.SC-h9h,g10.auction-account-record.SC-myi,g10.auction-account-record.SC-w21,g10.auction-account-record.SC-v08,g10.auction-account-record.SC-oug,g10.auction-account-record.SC-93f,g10.auction-account-record.SC-2h8,g10.auction-account-record.SC-ana,g10.auction-account-record.SC-3pi,g10.auction-account-record.SC-91l,g10.auction-account-record.SC-44t,g10.auction-account-record.SC-5y1,g10.auction-account-record.SC-1lv,g10.auction-account-record.SC-pu6,g10.auction-account-record.SC-m3u,g10.auction-account-record.SC-byk,g10.auction-account-record.SC-4sy,g10.auction-account-record.SC-xi1,g10.auction-account-record.SC-91a,g10.auction-account-record.SC-uh6,g10.auction-account-record.SC-ahn,g10.auction-account-record.SC-pnn,g10.auction-account-record.SC-fn7,g10.auction-account-record.SC-skc,g10.auction-account-record.SC-haw,g10.auction-account-record.SC-fgb,g10.auction-account-record.SC-uvr,g10.auction-account-record.SC-dtm,g10.auction-account-record.SC-2e8,g10.auction-account-record.SC-qmd,g10.auction-account-record.SC-ogi,g10.auction-account-record.SC-cu5,g10.auction-account-record.SC-m7p,g10.auction-account-record.SC-20r,g10.auction-account-record.SC-c2n,g10.auction-account-record.SC-1o1,g10.auction-account-record.SC-db4,g10.auction-account-record.SC-baj,g10.auction-account-record.SC-6mu,g10.auction-account-record.SC-7on,g10.auction-account-record.SC-5we,g10.auction-account-record.SC-wqw,g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US8-TC4-1: Awaiting Setup Won row has no confirm-address helper line

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

* Won listing in Awaiting Setup.

**Steps:**

1. Open My Auctions.

**Expected Results:**

* Standing badge and View order only under Won presentation — no “confirm address” detail line.

## Raised

- Exact control label (View order vs Open order) is design copy; suite accepts either clear entry.

## grade10-site-auction-account-record-US9: Won Status shows Setup Overdue and Payment Overdue

**As a** winner scanning My Auctions,
**I want** overdue won lots to read their overdue state in Status,
**so that** I can tell closed self-service from an open window.

<!-- trace:case id=g10.auction-account-record.TC-lit rev=1 covers=g10.auction-account-record.SC-zid -->
### grade10-site-auction-account-record-US9-TC1-1: My Auctions names both overdue states

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-account-record-US-09

**Pre-conditions:**

* Customer has one Won order past the setup deadline and one unpaid invoice past the payment deadline.

**Steps:**

1. Open My Auctions and read the Status column.

**Expected Results:**

* The rows read Setup Overdue and Payment Overdue.
* Each row still offers View order.
* Each row retains the same lot and winning-bid facts as the Won row.

## Settled

- My Auctions carries the mixed standing and order-state values in Status, including Setup Overdue and Payment Overdue.

- Contact for expired payment is Winner Order only (author @tangconst).
- Didn’t win hold copy stays.

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suite required View order on every Won | Folded as SC-56 |
| Suite required no View order on Didn’t win | Folded as SC-57 |
| Suite required no row contact / no Won helpers | Folded as SC-22 amend + SC-58 |
| Hold copy retained for Didn’t win | Covered by redesign/durable hold scenarios; not removed here |
| My Auctions uses Status for both overdue outcomes | Folded as SC-63 |
