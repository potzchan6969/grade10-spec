# grade10-site/auction/auction Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-auction-US2: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

### grade10-site-auction-auction-US2-TC15-1: First bid at the starting price plus its tier increment is accepted, at the limit

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* `<listing_21>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_21>`) is signed in and on `<listing_21>`.

**Test data:**

| Currency | `<start>` | `<tier increment>` | `<first-bid minimum>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00), positive start | 1000 minor units (HKD 10.00), the HKD 0 tier | 21000 minor units (HKD 210.00) |
| HKD | 0 minor units (HKD 0.00), zero start | 1000 minor units (HKD 10.00), the HKD 0 tier | 1000 minor units (HKD 10.00) |
| USD | 0 minor units (USD 0.00), zero start | 100 minor units (USD 1.00), the USD 0 tier | 100 minor units (USD 1.00) |
| USD | 9900 minor units (USD 99.00), one tier below a boundary | 100 minor units (USD 1.00), the USD 0 tier | 10000 minor units (USD 100.00) |
| USD | 10000 minor units (USD 100.00), exactly on a tier boundary | 500 minor units (USD 5.00), the USD 100 tier | 10500 minor units (USD 105.00) |
| HKD | 80000 minor units (HKD 800.00), exactly on a tier boundary | 4000 minor units (HKD 40.00), the HKD 800 tier | 84000 minor units (HKD 840.00) |
| JPY | 0 minor units (JPY 0), zero start | 100 minor units (JPY 100), the JPY 0 tier | 100 minor units (JPY 100) |
| JPY | 15000 minor units (JPY 15,000), exactly on a tier boundary | 500 minor units (JPY 500), the JPY 15,000 tier | 15500 minor units (JPY 15,500) |

**Steps:**

1. Enter the row's `<first-bid minimum>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* The bid is accepted.
* The minimum it met is `<start>` plus `<tier increment>` = `<first-bid minimum>`.
* The bid count reads 1, and Recent Bids shows the bid as You.

### grade10-site-auction-auction-US2-TC16-1: First bid at the starting price itself is refused, naming the minimum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* `<listing_22>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_22>`) is signed in.

**Test data:**

| Currency | `<start>` | `<first-bid minimum>` | `<bid amount>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 21000 minor units (HKD 210.00) | 20000 minor units (HKD 200.00), exactly the starting price |
| HKD | 20000 minor units (HKD 200.00) | 21000 minor units (HKD 210.00) | 20999 minor units (HKD 209.99), one minor unit below the minimum |
| USD | 50000 minor units (USD 500.00) | 51000 minor units (USD 510.00) | 50000 minor units (USD 500.00), exactly the starting price |
| JPY | 20000 minor units (JPY 20,000) | 20500 minor units (JPY 20,500) | 20000 minor units (JPY 20,000), exactly the starting price |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_22>`.
2. Read the API response.
3. Read `<listing_22>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<first-bid minimum>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

### grade10-site-auction-auction-US2-TC17-1: Start on a tier boundary takes that tier's increment, not the one below

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* `<listing_23>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_23>`) is signed in.

**Test data:**

| Currency | `<start>`, on a tier boundary | `<first-bid minimum>` | `<bid amount>`, the start plus the lower tier's increment |
| --- | --- | --- | --- |
| USD | 10000 minor units (USD 100.00) | 10500 minor units (USD 105.00) | 10100 minor units (USD 101.00) |
| HKD | 80000 minor units (HKD 800.00) | 84000 minor units (HKD 840.00) | 81000 minor units (HKD 810.00) |
| JPY | 15000 minor units (JPY 15,000) | 15500 minor units (JPY 15,500) | 15100 minor units (JPY 15,100) |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_23>`.
2. Read the API response.
3. Read `<listing_23>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<first-bid minimum>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

### grade10-site-auction-auction-US2-TC18-1: Minimum next bid before any bid is the starting price plus its increment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_24>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.

**Test data:**

| Currency | `<start>` | `<tier increment>` | `<first-bid minimum>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 1000 minor units (HKD 10.00) | 21000 minor units (HKD 210.00) |
| HKD | 0 minor units (HKD 0.00) | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| USD | 0 minor units (USD 0.00) | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| USD | 10000 minor units (USD 100.00), on a tier boundary | 500 minor units (USD 5.00) | 10500 minor units (USD 105.00) |
| JPY | 0 minor units (JPY 0) | 100 minor units (JPY 100) | 100 minor units (JPY 100) |

**Steps:**

1. Read `<listing_24>` from the public listing API.
2. Read the API response's minimum next bid.

**Expected Results:**

* The minimum next bid reads `<start>` plus `<tier increment>` = `<first-bid minimum>`.
* It never reads `<start>` itself, and never 0.

## Settled

- The first-bid minimum on a listing with no accepted bid is its starting price plus the increment of the tier that starting price sits in, on every start; a first bid at the starting price itself is refused (decisions Q12).
- A first bid of 0, or of one minor unit, on a 0 start is a non-goal; no case asserts either.
- The price a lone maximum stands at on a 0 start is auto-bidding's case, not this suite's.

## Reconciliation

**Run:** blind feature pass, 2026-09-29. Read: the bundle's `outline.md` (Purpose and Feature set), `durable-user-journeys.md`, `change-user-journeys.md`, `proposal.md`, `decisions.md`, `prd-bidding.md`, `existing-feature-tcs.md` (Reconciliation stripped), `domain-tcs.md` (Reconciliation stripped); `docs/governance/specs-to-test-cases.md`, `docs/governance/tcs-conventions.md`, the `spec-to-tcs` skill, `openspec/config.yaml`; this change's auto-bidding `feature-tcs.md` for shape only, its Reconciliation ignored. Denied: every `## Requirements` section, this change's `spec.md`, `openspec/specs/`, `openspec/changes/archive/` and every other change.

- **Joined:** `grade10-site-auction-auction-US2-TC16-1` decides `grade10-site-auction-auction-SC-62`.
- **Out of suite:** `grade10-site-auction-auction-SC-63` - a 1-minor-unit first bid on a 0 start is walked by `grade10-site-auction-auto-bidding-US1-TC6-1` in this change's auto-bidding suite, which refuses the same amounts through the maximum.
- **Kept, no new scenario:** `grade10-site-auction-auction-US2-TC15-1`, `grade10-site-auction-auction-US2-TC17-1` and `grade10-site-auction-auction-US2-TC18-1` walk the durable rules of `grade10-site/auction/bid-increments` - the tier chosen from the amount being raised, and the published next minimum - at starts the rewritten requirement now reaches. The rules are unchanged; the boundaries are new.
- **Raised, decided by the round:** what quick-bid chip 1x reads before any bid (Q13), and whether `grade10-site-auction-auction-US-02` is the walk for the first-bid rule (Q14). Neither moves a scenario.
- **Level check:** the pass found `grade10-site-auction-e2e-US03-TC01-1` bidding at the starting price; revised in this change's `grade10-site/auction/domain-tcs.md`.
- **Raised, rejected:** none.
- **Uncovered anchors:** none.
