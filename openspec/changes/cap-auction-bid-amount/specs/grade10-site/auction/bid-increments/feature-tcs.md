# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-03, tcs-rules r1

## grade10-site-auction-bid-increments-US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

### grade10-site-auction-bid-increments-US1-TC1-1: First bid clears the starting-price tier

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
An open HKD listing has a 20000-minor-unit starting price and no accepted bid.

**Steps:**

1. Open the listing bid panel.
2. Read the minimum next amount.

**Expected Results:**

* Minimum next amount is 21000 HKD minor units.

### grade10-site-auction-bid-increments-US1-TC2-1: Boundary price takes the higher tier

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
An open USD listing has a current bid of 10000 minor units.

**Steps:**

1. Open the listing bid panel.
2. Read the minimum next amount.

**Expected Results:**

* Minimum next amount is 10500 USD minor units.

### grade10-site-auction-bid-increments-US1-TC3-1: Amount above the minimum is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is 10500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Bid amount | 12000 USD minor units |

**Steps:**

1. Open the listing bid panel.
2. Enter 12000 as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

### grade10-site-auction-bid-increments-US1-TC4-1: Amount below the minimum is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is 10500 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Bid amount | 10499 USD minor units |

**Steps:**

1. Open the listing bid panel.
2. Enter 10499 as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused.
* The refusal names 10500 USD minor units as the minimum.

### grade10-site-auction-bid-increments-US1-TC5-1: Listing publishes the next minimum

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**
An open listing is available in its listing currency.

**Steps:**

1. Open the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is shown in the listing currency.

**Out of suite:**

- `grade10-site-auction-bid-increments-SC-06` — API and operator-form currency refusal is covered by the backend and admin verification lanes.
- `grade10-site-auction-bid-increments-SC-07` — Manual-floor calculation is covered by the backend auction test lane.

## grade10-site-auction-bid-increments-US2: Collector bids up to the currency ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

### grade10-site-auction-bid-increments-US2-TC1-1: Bid equal to the ceiling is accepted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open USD listing whose minimum bid is 999990000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Bid amount | 1000000000 USD minor units |

**Steps:**

1. Open the listing bid panel.
2. Enter 1000000000 as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is accepted.

### grade10-site-auction-bid-increments-US2-TC2-1: Bid above the ceiling is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open HKD listing whose minimum bid is 820000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Bid amount | 8000000001 HKD minor units |

**Steps:**

1. Open the listing bid panel.
2. Enter 8000000001 as the bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused and the refusal names 8000000000 HKD minor units as the ceiling.
* The listing's price and leader are unchanged.

### grade10-site-auction-bid-increments-US2-TC3-1: Auto-bid maximum above the ceiling is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open JPY listing whose minimum bid is 150000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| Maximum | 1500000001 JPY minor units |

**Steps:**

1. Open the listing bid panel.
2. Enter 1500000001 as the auto-bid maximum.
3. Confirm the maximum.

**Expected Results:**

* The maximum is refused and the refusal names 1500000000 JPY minor units as the ceiling.
* No maximum is recorded for the collector.

### grade10-site-auction-bid-increments-US2-TC4-1: Listing at the ceiling takes no further bid

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open USD listing whose current bid is 1000000000 minor units, held by another collector.

**Test data:**

| Field | Value |
| --- | --- |
| Bid amount | Any amount |

**Steps:**

1. Open the listing bid panel.
2. Enter a bid amount.
3. Confirm the bid.

**Expected Results:**

* The bid is refused and the refusal names 1000000000 USD minor units as the ceiling.
