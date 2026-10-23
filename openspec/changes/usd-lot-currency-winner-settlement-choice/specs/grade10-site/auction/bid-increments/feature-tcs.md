# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-site-auction-bid-increments-SC-03, grade10-site-auction-bid-increments-SC-06

## g10.auction-bid-increments.US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

<!-- trace:case id=g10.auction-bid-increments.TC-2ed rev=1 covers=g10.auction-bid-increments.SC-vqb,g10.auction-bid-increments.SC-w8f -->
### g10.auction-bid-increments.US1-TC1: Minimum before any bid is the opening price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing, starting price the row's starting price, with no accepted bid.
* A customer with a linked card is on that listing's page.

**Test data:**

| Starting price | Minimum next amount |
| --- | --- |
| USD0 (fixed boundary) | USD1 (fixed minimum increment) |
| USD280 (range: 10000-49999 minor units) | USD280 (same as starting price) |
| USD100 (fixed tier boundary) | USD100 (same as starting price) |

**Steps:**

1. Open the bid panel on the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum is the row's amount.
* A positive start is its own minimum; a zero start uses the lowest USD increment.

<!-- trace:case id=g10.auction-bid-increments.TC-kyx rev=2 covers=g10.auction-bid-increments.SC-ijk -->
### g10.auction-bid-increments.US1-TC5: Every listing publishes the next minimum in USD

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open listing is available.

**Steps:**

1. Open the listing.
2. Read the minimum next amount.

**Expected Results:**

* The minimum next amount is shown in USD.
* No other currency is shown.

<!-- trace:case id=g10.auction-bid-increments.TC-n6d rev=3 covers=g10.auction-bid-increments.SC-mn9,g10.auction-bid-increments.SC-u6t -->
### g10.auction-bid-increments.US1-TC6: First bid accepts the opening price then advances one tier

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing has no accepted bid, and a customer with a linked card is on its page.

**Test data:**

| Start | First bid | Increment | Next minimum | Higher bid |
| --- | --- | --- | --- | --- |
| USD0 | USD1 (range: 100-9999 minor units) | USD1 (fixed tier increment) | USD2 (derived) | USD2.50 (above the minimum) |
| USD100 (fixed tier boundary) | USD100 (fixed tier boundary) | USD5 (fixed tier increment) | USD105 (derived) | USD120 (above the minimum) |

**Steps:**

1. Enter the row's first bid in the bid field and confirm it.
2. Read the minimum next amount.
3. Enter the row's higher bid and confirm it.
4. Read the highest bid.

**Expected Results:**

* Step 1: the bid is accepted.
* Step 2: the next minimum is the first bid plus the row's increment.
* Step 3: the higher bid is accepted.
* Step 4: the highest bid is the row's higher bid.

<!-- trace:case id=g10.auction-bid-increments.TC-9do rev=3 covers=g10.auction-bid-increments.SC-b2w -->
### g10.auction-bid-increments.US1-TC7: First bid below opening price is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* An open USD listing has no accepted bid, and a customer with a linked card is on its page.

**Test data:**

| Opening price | Bid amount |
| --- | --- |
| USD1 (fixed minimum increment) | USD0.99 (fixed boundary) |
| USD100 (fixed tier boundary) | USD99 (fixed boundary) |
| USD105 (fixed opening price) | USD104.99 (one minor unit below minimum) |

**Steps:**

1. Enter the row's bid amount in the custom maximum field.
2. Confirm the bid.
3. Read the bid panel.

**Expected Results:**

* Step 2: the bid is refused and names the row's opening price as the minimum.
* The listing remains without an accepted bid, and the minimum remains the opening price.

---

## g10.auction-bid-increments.US2: Collector bids up to the ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

<!-- trace:case id=g10.auction-bid-increments.TC-d9d rev=3 covers=g10.auction-bid-increments.SC-hm3 -->
### g10.auction-bid-increments.US2-TC2: Direct bid above USD ceiling is refused without effects

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**

* A live USD listing's minimum next bid is at or below `<ceiling>`; a linked-card customer is on the listing.

**Test data:**

| Field | Value |
| --- | --- |
| `<ceiling>` | USD10,000,000 (fixed configured ceiling) |
| `<over ceiling>` | USD10,000,001 (fixed boundary, one USD over) |

**Steps:**

1. Enter `<over ceiling>` as the custom maximum and confirm.
2. Read the refusal, highest bid, and bid count.
3. Read the customer's My Auctions row.

**Expected Results:**

* The bid is refused and names `<ceiling>` as the maximum.
* Highest bid and bid count are unchanged.
* No row appears for the listing.

---

## g10.auction-bid-increments.US3: Collector bids in USD on every lot

**As a** collector,
**I want** every lot priced and bid in USD with one increment schedule,
**so that** I compare lots and place bids in one unit.

<!-- trace:case id=g10.auction-bid-increments.TC-y0l rev=1 -->
### g10.auction-bid-increments.US3-TC1: Every open lot prices and bids in USD on one schedule

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/bid-increments.spec.ts`

**Pre-conditions:**

* Two open lots have prices in different ranges of the same USD schedule.

**Steps:**

1. Open each lot and read its listed amount and minimum next bid.
2. Read the bid currency accepted by each bid panel.

**Expected Results:**

* Both lots show USD amounts and accept USD bids.
* The minimum next bid follows the same USD schedule on both lots.
* No HKD or JPY bid tier or amount appears.

<!-- trace:case id=g10.auction-bid-increments.TC-sze rev=1 covers=g10.auction-bid-increments.SC-xjw,g10.auction-bid-increments.SC-tke -->
### g10.auction-bid-increments.US3-TC3: A lot that was priced in HKD before the overwrite bids on the USD schedule

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* An open USD listing with an accepted bid of 800000 minor units and no other currency.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Listing | Why this row |
| --- | --- |
| A lot created in USD | The schedule as it always read |
| A lot created in HKD and overwritten to USD, amounts unchanged | A lot that existed before this change |

**Steps:**

1. Open the bid panel on the row's listing.
2. Read the current bid and the minimum next amount.

**Expected Results:**

* The current bid reads USD8,000.00 on both rows.
* The minimum next amount reads USD8,050.00.
* No HKD amount shows.

<!-- trace:case id=g10.auction-bid-increments.TC-pn8 rev=2 covers=g10.auction-bid-increments.SC-ws7 -->
### g10.auction-bid-increments.US3-TC4: Open listing publishes amounts as USD

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-03

**Pre-conditions:**

* An open listing has a starting price, accepted bid and next minimum.

**Steps:**

1. Open the listing and read its price, highest bid and minimum next amount.

**Expected Results:**

* Each amount is shown in USD.
* No other bid currency is shown.

## Settled

- None this run. Every blind reading either folded into a scenario or went to `decisions.md` `## Raised`.

## Reconciliation

**Cases** - All 12 cases remain draft. `TC-2ed@1` covers SC-vqb and SC-w8f; `TC-kyx@2` SC-ijk; `TC-n6d@3` SC-mn9 and SC-u6t; `TC-9do@3` SC-b2w; `TC-4ox@3` SC-c1v and SC-pd0; `TC-d9d@3` SC-hm3; `TC-dfw@3` SC-xnb; `TC-dlk@3` SC-pd0; `TC-y0l@1` remains unlinked; `TC-fdc@1` covers SC-60d, SC-5ea and SC-gq8; `TC-sze@1` SC-xjw and SC-tke; and `TC-pn8@2` SC-ws7. `TC-9do` was repaired in place at rev3 with a USD 104.99 bid against a USD 105.00 opening price and an explicit minimum-price refusal. `TC-fdc` includes an unsupported EUR create attempt as well as HKD and JPY. USD schedule fixtures follow the current tier arithmetic.

**Scenario coverage** - All 16 scenarios are covered by the linked cases. `TC-y0l` remains unlinked because its broader exploratory route has no complete matching scenario; narrower changed requirements are covered elsewhere. Unsupported EUR schedule writes also have admin listing coverage. The durable suite's old JPY maximum row remains an archive reconciliation item, not a current delta gap.

**Feature set** - The change removes the retired USD/HKD/JPY fixed schedules and per-currency ceiling. It retains one USD schedule and a USD 10,000,000 ceiling. No requirement, scenario, journey, case ID or case text changed in this fold.
