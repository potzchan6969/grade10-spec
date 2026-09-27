# grade10-site/auction/bid-increments Test Cases

**Status:** approved
**Reviewed:** 2026-09-22, tcs-rules r3.0

## grade10-site-auction-bid-increments-US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-8e2 rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC1-1: First bid clears the starting-price tier

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
An open HKD listing has starting price <starting price> and no accepted bid.

**Test data:**

| starting price | increment | minimum next amount |
| --- | ---: | ---: |
| 20000 HKD minor units | 1000 | 21000 |

**Steps:**

1. Open the listing bid panel.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is <minimum next amount>.

<!-- trace:case id=g10.auction-bid-increments.TC-0lh rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC2-1: Boundary price takes the higher tier

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
An open USD listing has current public price <current public price>.
The collector is enrolled and can bid.

**Test data:**

| current public price | increment | minimum next amount |
| --- | ---: | ---: |
| 10000 USD minor units | 500 | 10500 |
| 9999 USD minor units | 100 | 10099 |
| 50000 USD minor units | 1000 | 51000 |

**Steps:**

1. Open the listing bid panel.
2. Place a bid of <current public price> plus <increment>.

**Expected Results:**

* The new public price is <minimum next amount>.

<!-- trace:case id=g10.auction-bid-increments.TC-qui rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC3-1: Amount above the minimum is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is <minimum>.

**Test data:**

| minimum | bid amount |
| --- | ---: |
| 10500 USD minor units | 12000 |

**Steps:**

1. Open the listing bid panel.
2. Enter <bid amount> as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

<!-- trace:case id=g10.auction-bid-increments.TC-5ez rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC4-1: Amount below the minimum is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is <minimum>.

**Test data:**

| minimum | bid amount |
| --- | ---: |
| 10500 USD minor units | 10499 |

**Steps:**

1. Open the listing bid panel.
2. Enter <bid amount> as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused.
* The refusal names <minimum> as the minimum.

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t,g10.auction-bid-increments.SC-b2w,g10.auction-bid-increments.SC-ijk -->
### grade10-site-auction-bid-increments-US1-TC5-1: Listing publishes the next minimum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
An open listing is available in <listing currency>.

**Test data:**

| listing currency |
| --- |
| USD |
| HKD |
| JPY |

**Steps:**

1. Open the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is shown in <listing currency>.

**Out of suite:**

- `grade10-site-auction-bid-increments-SC-06` — API and operator-form currency refusal is covered by the backend and admin verification lanes.
- `grade10-site-auction-bid-increments-SC-07` — Manual-floor calculation is covered by the backend auction test lane.

## grade10-site-auction-bid-increments-US2: Collector bids up to the currency ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

<!-- trace:case id=g10.auction-bid-increments.TC-xdy rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC1-1: Bid equal to the ceiling is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is <minimum>.

**Test data:**

| minimum | ceiling | bid amount |
| --- | ---: | ---: |
| 999990000 USD minor units | 1000000000 | 1000000000 |

**Steps:**

1. Open the listing bid panel.
2. Enter <bid amount> as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC2-1: Bid above the ceiling is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open HKD listing whose minimum bid is <minimum>.

**Test data:**

| minimum | ceiling | bid amount |
| --- | ---: | ---: |
| 820000 HKD minor units | 8000000000 | 8000000001 |

**Steps:**

1. Open the listing bid panel.
2. Enter <bid amount> as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused and the refusal names <ceiling> as the ceiling.
* The listing's price and leader are unchanged.

<!-- trace:case id=g10.auction-bid-increments.TC-dfw rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC3-1: Auto-bid maximum above the ceiling is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open JPY listing whose minimum bid is <minimum>.

**Test data:**

| minimum | ceiling | maximum |
| --- | ---: | ---: |
| 150000 JPY minor units | 150000000000 | 150000000001 |

**Steps:**

1. Open the listing bid panel.
2. Enter <maximum> as the auto-bid maximum.
3. Confirm the maximum.

**Expected Results:**

* The maximum is refused and the refusal names <ceiling> as the ceiling.
* No maximum is recorded for the collector.

<!-- trace:case id=g10.auction-bid-increments.TC-dlk rev=1 covers=g10.auction-bid-increments.SC-c1v,g10.auction-bid-increments.SC-hm3,g10.auction-bid-increments.SC-xnb,g10.auction-bid-increments.SC-pd0 -->
### grade10-site-auction-bid-increments-US2-TC4-1: Listing at the ceiling takes no further bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open USD listing whose current bid is <ceiling>, held by another collector.

**Test data:**

| ceiling | bid amount |
| --- | ---: |
| 1000000000 USD minor units | 1000000001 |

**Steps:**

1. Open the listing bid panel.
2. Enter <bid amount> as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused and the refusal names <ceiling> as the ceiling.
