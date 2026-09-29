# grade10-site/auction/auto-bidding Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r4

## grade10-site-auction-auto-bidding-US1: Collector commits a maximum on an open listing

**As a** collector,
**I want** to commit the most I will pay and raise it later,
**so that** Grade10 bids for me only as far as needed to lead.

### grade10-site-auction-auto-bidding-US1-TC5-1: Lone maximum on a zero start stands at the lowest increment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, with no maximum committed.
* customer is signed in with a card linked and is on that listing's page.

**Test data:**

| Currency | Maximum | Lowest increment | Current bid after |
| --- | --- | --- | --- |
| USD | 100 minor units (USD 1.00), exactly the minimum | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| USD | 50000 minor units (USD 500.00), in the USD 500 tier | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| HKD | 1000 minor units (HKD 10.00), exactly the minimum | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| HKD | 100000 minor units (HKD 1,000.00), in the HKD 800 tier | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| JPY | 100 minor units (JPY 100), exactly the minimum | 100 minor units (JPY 100) | 100 minor units (JPY 100) |
| JPY | 50000 minor units (JPY 50,000), in the JPY 15,000 tier | 100 minor units (JPY 100) | 100 minor units (JPY 100) |

**Steps:**

1. Enter the row's maximum in the custom maximum on the bid panel.
2. Confirm the commitment.
3. Read the current bid and the leader.

**Expected Results:**

* Grade10 accepts the commitment.
* The current bid is 0 plus the currency's lowest increment, the row's current bid after, not 0.
* The current bid is not the increment of the tier the maximum sits in.
* Customer leads.

### grade10-site-auction-auto-bidding-US1-TC6-1: Maximum one minor unit below the minimum on a zero start is refused

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
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, in the row's standing.
* customer B is signed in with a card linked.

**Test data:**

| Currency | Standing | Minimum next bid | Customer B's attempted maximum |
| --- | --- | --- | --- |
| USD | No maximum committed | 100 minor units (USD 1.00) | 99 minor units (USD 0.99) |
| HKD | No maximum committed | 1000 minor units (HKD 10.00) | 999 minor units (HKD 9.99) |
| JPY | No maximum committed | 100 minor units (JPY 100) | 99 minor units (JPY 99) |

**Steps:**

1. As customer B, submit the row's attempted maximum on the listing.
2. Read the API response.
3. Read the listing's current bid, leader and committed maxima.

**Expected Results:**

* Grade10 refuses the commitment, naming the row's minimum next bid.
* No maximum is recorded for customer B.
* The current bid and the leader are as the row's standing gives them.

### grade10-site-auction-auto-bidding-US1-TC7-1: Lone bidder wins a zero-start lot at the lowest increment

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
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* An open listing in the row's currency, starting price 0, extension duration 0, scheduled close 10 minutes ahead.
* customer A committed a maximum of 50000 minor units before the scheduled close, the only maximum on the listing.

**Test data:**

| Currency | Lowest increment | Winning bid |
| --- | --- | --- |
| USD | 100 minor units (USD 1.00) | 100 minor units (USD 1.00) |
| HKD | 1000 minor units (HKD 10.00) | 1000 minor units (HKD 10.00) |
| JPY | 100 minor units (JPY 100) | 100 minor units (JPY 100) |

**Steps:**

1. Wait until the scheduled close passes with no further commitment.
2. Read the listing's state, winner and winning bid.

**Expected Results:**

* The listing is closed.
* Customer A wins.
* The winning bid is 0 plus the currency's lowest increment, the row's winning bid, not 0.

---

## Settled

- A first maximum on a 0 start must reach 0 plus the currency's lowest increment; a first bid of 0 or of one minor unit is a non-goal, and no case asserts either.

## Reconciliation

**Run:** blind feature pass, 2026-09-29. Read: the bundle's `outline.md` (Purpose and Feature set), `durable-user-journeys.md`, `change-user-journeys.md`, `proposal.md`, `decisions.md`, `prd-bidding.md`, `prd-management.md`, `existing-feature-tcs.md` (Reconciliation stripped), `domain-tcs.md` (Reconciliation stripped); `docs/governance/specs-to-test-cases.md`, `docs/governance/tcs-conventions.md`, the `spec-to-tcs` skill, `openspec/config.yaml`; the listing suite of `inventory-auction-media` for shape only. Denied: every `## Requirements` section, this change's `spec.md`, `openspec/specs/`, `openspec/changes/archive/` and every other change.

- **Joined:** `grade10-site-auction-auto-bidding-US1-TC5-1` decides `grade10-site-auction-auto-bidding-SC-30`; `grade10-site-auction-auto-bidding-US1-TC7-1` decides `grade10-site-auction-auto-bidding-SC-31`. Both follow Q4's recommendation, held for the product manager.
- **Kept, no new scenario:** `grade10-site-auction-auto-bidding-US1-TC6-1` walks the durable first-bid minimum of `grade10-site/auction/bid-increments` at a 0 start, and the refusal below it; the rule is unchanged, the boundary new.
- **Dropped at the simpler reading:** a second maximum, a tie at the minimum next bid, and a second bidder's minimum on a 0 start. Once a bid stands, bidding runs the durable two-maximum rule on unchanged code, and the durable suite walks it.
- **Raised, decided by the round:** whether a lone maximum's stand is recorded as that collector's bid (Q10), and whether the bid panel shows a starting price of 0 beside a current bid at the lowest increment (Q11). Neither moves a scenario.
- **Raised, rejected:** none.
- **Uncovered anchors:** none.
