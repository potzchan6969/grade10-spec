# grade10-site/auction/bid-increments Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

## grade10-site-auction-bid-increments-US1: Collector places a bid across a price tier

**As a** collector,
**I want** the minimum next bid to scale with the lot's price,
**so that** I can enter an affordable opening bid and a sensible later bid.

### grade10-site-auction-bid-increments-US1-TC8-2: Lot starting at the ceiling takes one first bid there

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-bid-increments-US-01

**Pre-conditions:**

* `<listing_1>` is open in the row's currency, starting price the row's `<ceiling>`, with no accepted bid.
* customer A and customer B are signed in with cards linked, on separate sessions.

**Test data:**

| Currency | `<ceiling>` |
| --- | --- |
| USD | 1000000000 minor units (USD 10,000,000.00) |
| HKD | 8000000000 minor units (HKD 80,000,000.00) |
| JPY | 10000000000 minor units (JPY 10,000,000,000) |

**Steps:**

1. As customer A, submit a bid of `<ceiling>` on `<listing_1>`.
2. Read the API response.
3. As customer B, submit a bid of `<ceiling>` plus the increment at it.
4. Read the API response.
5. Read `<listing_1>`'s current bid, leader and bid count.

**Expected Results:**

* Step 2: customer A's bid is accepted at `<ceiling>`.
* Step 4: customer B's bid is refused, naming the ceiling.
* Step 5: current bid `<ceiling>`, customer A leads, bid count 1.

## grade10-site-auction-bid-increments-US2: Collector bids up to the currency ceiling

**As a** collector,
**I want** Grade10 to refuse an amount above the ceiling and tell me the limit,
**so that** a mistyped bid or maximum never commits me to an amount I cannot settle.

### grade10-site-auction-bid-increments-US2-TC3-2: Auto-bid maximum above the ceiling is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bid-increments-US-02

**Pre-conditions:**
The collector is enrolled on an open JPY listing whose minimum bid is <minimum>.
The maximum is sent to the auction service directly: the bid panel's custom
maximum field refuses any draft above 9,999,999,999, so it cannot carry
<maximum>.

**Test data:**

| minimum | ceiling | maximum |
| --- | ---: | ---: |
| 150000 JPY minor units | 10000000000 | 10000000001 |

**Steps:**

1. As the collector, commit an auto-bid maximum of <maximum> on the listing
   through the auction service's bid procedure.
2. Read the response and the collector's maximums on the listing.

**Expected Results:**

* The maximum is refused and the refusal names <ceiling> as the ceiling.
* No maximum is recorded for the collector.

## Reconciliation

**Run:** Accept-review fix round, 2026-10-05, for change `cap-custom-maximum-entry`, after Q6 lowered the JPY bid ceiling. Read the change's `proposal.md`, `decisions.md` (Q4, Q6), this delta `spec.md` and the durable suite. Not a blind reading: the two cases that name the JPY ceiling are restated against the new value, and QA2 rereads them.

| Finding | Disposition |
| --- | --- |
| The JPY ceiling is 10000000000 minor units, not 150000000000 | **Folded in:** `grade10-site-auction-bid-increments-SC-08`, `grade10-site-auction-bid-increments-SC-10` through `grade10-site-auction-bid-increments-US1-TC8-2` and `grade10-site-auction-bid-increments-US2-TC3-2` |
| The bid panel's custom maximum field refuses any draft above 9,999,999,999, so a JPY maximum above the ceiling cannot be entered there | **Folded in:** `grade10-site-auction-bid-increments-US2-TC3-2` sends the maximum to the auction service directly; the field's own refusal is `shared-ui-auction-listing-SC-39` |
| Unchanged scenarios restated by the modified block - `SC-08`, `SC-09`, `SC-11` | **Out of suite:** the durable suite's existing cases; their USD and HKD values do not move |

**Uncovered anchors:** none for `grade10-site-auction-bid-increments-US-02`.
