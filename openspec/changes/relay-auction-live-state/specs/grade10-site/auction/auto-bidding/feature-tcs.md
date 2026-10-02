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
3. Read the current bid, the leader, the bid count and Recent Bids.

**Expected Results:**

* Grade10 accepts the commitment.
* The current bid is 0 plus the currency's lowest increment, the row's current bid after, not 0.
* The current bid is not the increment of the tier the maximum sits in.
* The bid count reads 1, and Recent Bids shows one bid at the row's current bid after.
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

### grade10-site-auction-auto-bidding-US1-TC8-1: Second maximum on a zero start must clear one increment above the opening price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auto-bidding-US-01

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_1>` starts at 0 `HKD`, and customer A's maximum `<user A maximum>` stands alone at `<opening price>`.
* customer B(card linked) is signed in on a separate session, on the lot page for `<listing_1>`.

**Test data:**

| `<user B maximum>` | Outcome |
| --- | --- |
| 1000 minor units (HKD 10.00), the opening price | Refused, naming 2000 minor units (HKD 20.00); current bid stays `<opening price>`, customer A leads |
| 2000 minor units (HKD 20.00), the opening price plus one increment | Accepted; current bid 3000 minor units (HKD 30.00), `<user B maximum>` plus 1000; customer A leads |

| Field | Value |
| --- | --- |
| `<listing_1>` | An open HKD listing, starting price 0, scheduled close more than an hour away |
| `<user A maximum>` | 50000 minor units (HKD 500.00) |
| `<opening price>` | 1000 minor units (HKD 10.00), the lowest HKD increment |

**Steps:**

1. As customer B, enter the row's `<user B maximum>` in the custom maximum on the bid panel.
2. Confirm the commitment.
3. Read the current bid, the leader and Recent Bids.

**Expected Results:**

* Step 2 is the row's outcome.
* Step 3 reads the row's current bid and leader, and `<user A maximum>` appears nowhere.

---

## Settled

- A first maximum on a 0 start must reach 0 plus the currency's lowest increment; a first bid of 0 or of one minor unit is a non-goal, and no case asserts either.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-01 for change `relay-auction-live-state`, joining QA1's blind cases with Dev's delta scenarios on `grade10-site-auction-auto-bidding-US-01`. Read the change's `proposal.md`, `decisions.md` (Q16 to Q30), `tech-design.md`, `tasks.md`, this delta `spec.md`, `user-journeys.md` and `domain-tcs.md`. QA1 had read the frozen anchors only.

| Finding | Disposition |
| --- | --- |
| A lone maximum on a 0 start stands at the lowest increment, in each currency, whatever tier the maximum sits in | **Folded in:** `grade10-site-auction-auto-bidding-SC-30` (Q19) |
| That stand is one public bid: bid count 1, one Recent Bids row | **Folded in:** `grade10-site-auction-auto-bidding-SC-30`, which this run gave the public-record line (Q25) |
| A first maximum one minor unit below the opening price is refused, naming it | **Folded in:** `grade10-site-auction-auction-SC-63` and `grade10-site-auction-bid-increments-SC-12`; a maximum is a bid under the same minimum |
| A lone bidder on a 0 start wins at the lowest increment, never 0 | **Folded in:** `grade10-site-auction-auto-bidding-SC-31` |
| A second maximum must clear the opening price plus one increment, and the price then resolves by the two-maximum rule | **Folded in:** `grade10-site-auction-auto-bidding-SC-30a`, added by this run (Q19); the accepted row follows the requirement's two-maximum resolution |
| Unchanged two-maximum scenarios restated by the modified block - `SC-09` to `SC-18` | **Out of suite:** the durable suite's existing `-US-02` and `-US-03` cases; this change only adds the 0-start sentence |

**Uncovered anchors:** none for `grade10-site-auction-auto-bidding-US-01`.
