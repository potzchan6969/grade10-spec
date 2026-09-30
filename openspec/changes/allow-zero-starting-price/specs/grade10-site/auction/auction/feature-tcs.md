# grade10-site/auction/auction Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-auction-US2: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

### grade10-site-auction-auction-US2-TC15-2: First bid at the opening price is accepted

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

| Currency | `<start>` | `<opening price>` |
| --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00), positive start | 20000 minor units (HKD 200.00), the start itself |
| HKD | 500 minor units (HKD 5.00), below the lowest increment | 500 minor units (HKD 5.00), the start itself |
| HKD | 0 minor units (HKD 0.00), zero start | 1000 minor units (HKD 10.00), the lowest increment |
| USD | 0 minor units (USD 0.00), zero start | 100 minor units (USD 1.00), the lowest increment |
| JPY | 0 minor units (JPY 0), zero start | 100 minor units (JPY 100), the lowest increment |

**Steps:**

1. Enter the row's `<opening price>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read Highest bid, the bid count and Recent Bids.

**Expected Results:**

* The bid is accepted.
* Highest bid reads `<opening price>`, never 0.
* The bid count reads 1, and Recent Bids shows the bid as You.

### grade10-site-auction-auction-US2-TC16-2: First bid below a positive starting price is refused, naming it

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

| Currency | `<start>` | `<bid amount>` |
| --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 19999 minor units (HKD 199.99), one minor unit below the start |
| USD | 50000 minor units (USD 500.00) | 49999 minor units (USD 499.99), one minor unit below the start |
| JPY | 20000 minor units (JPY 20,000) | 19999 minor units (JPY 19,999), one minor unit below the start |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_22>`.
2. Read the API response.
3. Read `<listing_22>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<start>` as the minimum.
* No accepted bid is recorded, and the bid count stays 0.

### grade10-site-auction-auction-US2-TC17-1: Start on a tier boundary takes that tier's increment, not the one below

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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
* **Status:** deprecated
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

- The first-bid minimum on a listing with no accepted bid is its opening price: the starting price, or the lowest increment on a 0 start; one increment above the current bid applies from the second bid (decisions Q4, Q12).
- A first bid of 0, or of one minor unit, on a 0 start is a non-goal; no case asserts either.
- The price a lone maximum stands at on a 0 start is auto-bidding's case, not this suite's.

## Reconciliation

**Run:** blind feature pass, 2026-09-29. Read: the bundle's `outline.md` (Purpose and Feature set), `durable-user-journeys.md`, `change-user-journeys.md`, `proposal.md`, `decisions.md`, `prd-bidding.md`, `existing-feature-tcs.md` (Reconciliation stripped), `domain-tcs.md` (Reconciliation stripped); `docs/governance/specs-to-test-cases.md`, `docs/governance/tcs-conventions.md`, the `spec-to-tcs` skill, `openspec/config.yaml`; this change's auto-bidding `feature-tcs.md` for shape only, its Reconciliation ignored. Denied: every `## Requirements` section, this change's `spec.md`, `openspec/specs/`, `openspec/changes/archive/` and every other change.

- **Joined:** `grade10-site-auction-auction-US2-TC15-2` decides `grade10-site-auction-auction-SC-62`; `grade10-site-auction-auction-US2-TC16-2` decides `grade10-site-auction-auction-SC-64`.
- **Out of suite:** `grade10-site-auction-auction-SC-63` - a 1-minor-unit first bid on a 0 start is walked by `grade10-site-auction-auto-bidding-US1-TC6-1` in this change's auto-bidding suite, which refuses the same amounts through the maximum.
- **Revised on Q4's answer:** the pass was written on the round's first call, the starting price plus its increment on every start. The author's answer made the minimum the opening price, so `grade10-site-auction-auction-US2-TC15-1` and `grade10-site-auction-auction-US2-TC16-1` were rewritten as their `-2`, and `grade10-site-auction-auction-US2-TC17-1` (the tier a first bid clears) and `grade10-site-auction-auction-US2-TC18-1` (the published minimum, now `grade10-site/auction/bid-increments`' suite's) are deprecated. Patched, not re-run.
- **Raised, decided by the round:** what quick-bid chip 1x reads before any bid (Q13), and whether `grade10-site-auction-auction-US-02` is the walk for the first-bid rule (Q14). Neither moves a scenario.
- **Level check:** the pass found `grade10-site-auction-e2e-US03-TC01-1` bidding at the starting price, which the opening price keeps; no domain revision.
- **Raised, rejected:** none.
- **Uncovered anchors:** none.
