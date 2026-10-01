# grade10-site/auction/auction Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4
**Out of suite:** grade10-site-auction-auction-SC-04, grade10-site-auction-auction-SC-08, grade10-site-auction-auction-SC-63, grade10-site-auction-auction-SC-73, grade10-site-auction-auction-SC-75, grade10-site-auction-auction-SC-76, grade10-site-auction-auction-SC-77, grade10-site-auction-auction-SC-79

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

## grade10-site-auction-auction-US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count only once its payment confirms before then,
**so that** nobody wins with a bid that arrived after the close, and a card hold for a bid that did not count is released.

### grade10-site-auction-auction-US11-TC1-1: Payment confirmed before the effective close counts the bid

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A(card linked) is signed in and on the lot page for `<listing_1>`.
* customer B leads `<listing_1>` at `<leader price>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| `<listing_1>` state | `<placed at>` | `<confirm time>` | `<recorded close after>` |
| --- | --- | --- | --- |
| Open, scheduled close 20:00:00 UTC | 19:59:50 UTC | 19:59:58 UTC | 20:00:00 UTC, unchanged |
| Extended bidding, recorded close 20:30:00 UTC, extension duration 1800s (30mins), no cap | 20:29:50 UTC | 20:29:58 UTC | 20:59:58 UTC, `<confirm time>` plus 1800s |

| Field | Value |
| --- | --- |
| `<leader price>` | 480000 minor units, HKD |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<placed at>`.
2. Read the API response for `<listing_1>` after `<confirm time>`.

**Expected Results:**

* The bid is accepted at `<confirm time>`, and customer A leads.
* Highest bid reads `<bid amount>`.
* The recorded close reads `<recorded close after>`.

### grade10-site-auction-auction-US11-TC2-1: Payment confirmed after the effective close loses and releases its hold

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
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A(card linked) is signed in and on the lot page for `<listing_2>`.
* customer B leads `<listing_2>` at `<leader price>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| `<listing_2>` state | `<effective close>` | `<placed at>` | `<confirm time>` |
| --- | --- | --- | --- |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:29:55 UTC | 20:30:01 UTC |
| Open, extension duration 0s | 20:00:00 UTC | 19:59:55 UTC | 20:00:01 UTC |

| Field | Value |
| --- | --- |
| `<leader price>` | 480000 minor units, HKD |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<placed at>`.
2. Wait until `<confirm time>` passes.
3. Read the bid panel.
4. Read customer A's card authorization for `<listing_2>`.

**Expected Results:**

* The bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* Highest bid stays `<leader price>`, and customer B still leads.
* The recorded close stays `<effective close>`.
* customer A's authorization for `<bid amount>` is released.
* `<listing_2>` closes with customer B winning at `<leader price>`.

### grade10-site-auction-auction-US11-TC3-1: Lone first bid still confirming at the scheduled close leaves the lot unsold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* `<listing_3>` is open with no accepted bid.
* customer A(card linked) is signed in and on the lot page for `<listing_3>`.
* customer A's card authorization is held until `<confirm time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An open HKD listing with no bids, scheduled close 20:00:00 UTC, extension duration 1800s (30mins) |
| `<starting price>` | 120000 minor units |
| `<placed at>` | 19:59:55 UTC |
| `<confirm time>` | 20:00:03 UTC, after the scheduled close |

**Steps:**

1. As customer A, place `<starting price>` at `<placed at>`.
2. Wait until `<confirm time>` passes.
3. Read the bid panel and the lot's result.
4. Read customer A's card authorization for `<listing_3>`.

**Expected Results:**

* `<listing_3>` never enters extended bidding.
* The bid panel reads "Your bid did not go through." alone, never "The card was not authorized."
* `<listing_3>` closes unsold at 20:00:00 UTC, reading Ended with No bids.
* customer A's authorization is released.

### grade10-site-auction-auction-US11-TC4-1: With holds off a bid placed in the last second counts

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_4>` is in extended bidding and its recorded close is 20:30:00 UTC.
* customer A(card linked) is signed in and on the lot page for `<listing_4>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap, led by customer B |
| `<bid time>` | 20:29:59 UTC, one second before the recorded close |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |
| `<new close>` | 20:59:59 UTC, `<bid time>` plus 1800s |

**Steps:**

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_4>`.

**Expected Results:**

* The bid is accepted when placed, with no wait for a payment.
* customer A leads and Highest bid reads `<bid amount>`.
* The recorded close reads `<new close>`.

### grade10-site-auction-auction-US11-TC5-1: No bid counts at or after the effective close while the close is unrecorded

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_5>` has scheduled close 20:00:00 UTC and its extension terms are the row's.
* customer B's bid was accepted on `<listing_5>` at `<last accepted>`.
* Settling `<listing_5>` is held back, so its close is not yet recorded at `<bid time>`.
* customer A(card linked) is signed in and can bid on `<listing_5>`.

**Test data:**

| `<extension duration>` | `<extension cap>` | `<last accepted>` | `<effective close>` | `<bid time>` |
| --- | --- | --- | --- | --- |
| 1800s (30mins) | 600s (10mins) | 20:05:00 UTC | 20:10:00 UTC, the cap | 20:10:00 UTC, at the limit |
| 1800s (30mins) | 600s (10mins) | 20:05:00 UTC | 20:10:00 UTC, the cap | 20:10:01 UTC |
| 1800s (30mins) | None | 20:10:00 UTC | 20:40:00 UTC, the recorded close | 20:40:00 UTC, at the limit |
| 1800s (30mins) | None | 20:10:00 UTC | 20:40:00 UTC, the recorded close | 20:40:01 UTC |
| 1800s (30mins) | 0s | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:00.001 UTC, at the limit |
| 1800s (30mins) | 0s | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:01 UTC |
| 0s | None | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:00.001 UTC, at the limit |
| 0s | None | 19:58:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 20:00:01 UTC |

| Field | Value |
| --- | --- |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<bid time>`.
2. Read the API response for `<listing_5>`.
3. Let settling resume.
4. Read the lot's result.

**Expected Results:**

* Step 1 is refused.
* At step 2 no accepted bid is added, the recorded close does not move, and `<listing_5>` is still not recorded closed.
* At step 4 `<listing_5>` is closed with customer B winning.

### grade10-site-auction-auction-US11-TC6-1: Extension cap of 0 closes the lot at its scheduled close

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_6>` is open with one accepted bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_6>` | An open listing, scheduled close 20:00:00 UTC, extension duration 1800s (30mins), extension cap 0s |

**Steps:**

1. Wait for the scheduled close.
2. Read the API response for `<listing_6>`.

**Expected Results:**

* `<listing_6>` never entered extended bidding.
* It is closed at 20:00:00 UTC, with its one bidder winning.

### grade10-site-auction-auction-US11-TC7-1: A due lot is recorded closed at its close, not at the sweep

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** performance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* customer A leads `<listing_7>` and is on its lot page.
* `<listing_7>`'s recorded close is about two minutes away, and no other bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An HKD listing in extended bidding, led by customer A |
| `<sweep interval>` | 300s (5mins) |

**Steps:**

1. Wait for the recorded close.
2. Read the lot's result on customer A's open page.

**Expected Results:**

* The lot's close is recorded before the next sweep, well inside `<sweep interval>`, and its close lag is recorded.
* customer A's page reads Closed with no result, then Won, without a reload.

### grade10-site-auction-auction-US11-TC8-1: A lot whose alarm missed is still settled

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* customer A leads `<listing_8>`, and no other bid will be placed.
* The lot's own alarm is disabled for `<listing_8>`.

**Test data:**

| `<who reaches it>` | `<recorded by>` |
| --- | --- |
| A read of `<listing_8>` more than 2s after its recorded close | Right after that read answers |
| Nobody before the five-minute sweep | The next sweep, at most 300s (5mins) after the recorded close |

**Steps:**

1. Wait for `<listing_8>`'s recorded close.
2. Let `<who reaches it>` reach `<listing_8>`.
3. Read the API response for `<listing_8>`.

**Expected Results:**

* `<listing_8>` is recorded closed `<recorded by>`, with customer A winning.
* Before then, `<listing_8>` takes no bid and reports no result.

### grade10-site-auction-auction-US11-TC9-1: Close rules hold with the live relay flag off

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* The `auction.realtime` flag is off.
* customer B leads `<listing_11>` at `<leader price>`, and its effective close is `<effective close>`.
* customer A(card linked) is signed in and can bid on `<listing_11>`.

**Test data:**

| Bid-time holds | `<placed at>` | `<counts at>` |
| --- | --- | --- |
| On | 20:29:55 UTC | Payment confirms at 20:30:01 UTC |
| Off | 20:30:01 UTC | Placed at 20:30:01 UTC |

| Field | Value |
| --- | --- |
| `<listing_11>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap |
| `<effective close>` | 20:30:00 UTC, the recorded close |
| `<leader price>` | 480000 minor units |
| `<bid amount>` | 505000 minor units, at or above the minimum next bid |

**Steps:**

1. As customer A, place `<bid amount>` at `<placed at>`.
2. Wait until `<counts at>` passes.
3. Read the API response for `<listing_11>`.
4. Wait until `<listing_11>` is recorded closed.
5. Read the API response for `<listing_11>`.

**Expected Results:**

* At step 3 customer A's bid is not accepted, and the recorded close stays `<effective close>`.
* With holds on, customer A's authorization for `<bid amount>` is released.
* At step 5 customer B wins at `<leader price>`.

### grade10-site-auction-auction-US11-TC10-1: Public reads give the close terms and the service's time

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_12>` is in extended bidding.
* No session is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_12>` | An HKD listing, scheduled close 20:00:00 UTC, recorded close 20:25:00 UTC, extension duration 1800s (30mins), extension cap 3600s (60mins) |

**Steps:**

1. Read `<listing_12>` from the public listing API.
2. Read the auction service's time from its public time read.

**Expected Results:**

* Step 1 gives scheduled close 20:00:00 UTC and recorded close 20:25:00 UTC.
* Step 1 gives extension duration 1800s and extension cap 3600s.
* Step 2 gives the auction service's current time, not the caller's.

---

## grade10-site-auction-auction-US12: Bidder keeps a lot open only by moving its price

**As a** bidder,
**I want** extended bidding to restart only when a bid moves the lot's price,
**so that** a leader cannot keep a lot open by raising their own maximum.

### grade10-site-auction-auction-US12-TC1-1: Equal maximum at a higher price extends the lot

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
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_9>` is in extended bidding with its recorded close `<time left before bid>` away.
* customer A leads `<listing_9>` at `<leader price>` with maximum `<user A maximum>`.
* customer B(card linked) is signed in on a separate session, on the lot page for `<listing_9>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_9>` | An HKD listing in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<time left before bid>` | 5 minutes |
| `<leader price>` | 100000 minor units |
| `<user A maximum>` | 200000 minor units |
| `<user B maximum>` | 200000 minor units, equal to `<user A maximum>` |

**Steps:**

1. As customer B, enter `<user B maximum>` in the custom maximum on the bid panel and confirm the bid.
2. Read Highest bid, the leader and Time left.

**Expected Results:**

* Highest bid reads `<user B maximum>`.
* customer A still leads, as the earlier maximum.
* Time left reads `<extension duration>` from customer B's bid.

### grade10-site-auction-auction-US12-TC2-1: Leader raising their own maximum leaves the close where it was

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
* **Trace:** grade10-site-auction-auction-US-12

**Pre-conditions:**

* Bid-time holds are off.
* `<listing_10>` is in extended bidding, its recorded close `<close before raise>`.
* customer A leads `<listing_10>` at `<leader price>` with maximum `<user A maximum>`, and is on its lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | An HKD listing in extended bidding, extension duration 1800s (30mins), no cap |
| `<close before raise>` | 3 minutes after the raise |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<raised maximum>` | 900000 minor units |

**Steps:**

1. Select **Raise**, enter `<raised maximum>` and confirm.
2. Read Your maximum, Highest bid and Time left.
3. Wait until `<close before raise>` with no further bid.
4. Read the lot's result.

**Expected Results:**

* Your maximum reads `<raised maximum>`.
* Highest bid stays `<leader price>`.
* The recorded close stays `<close before raise>`, and Time left keeps counting to it.
* The lot closes at `<close before raise>`, customer A winning at `<leader price>`.

## Settled

- The first-bid minimum on a listing with no accepted bid is its opening price: the starting price, or the lowest increment on a 0 start; one increment above the current bid applies from the second bid (decisions Q19, Q27).
- A first bid of 0, or of one minor unit, on a 0 start is a non-goal; no case asserts either.
- The price a lone maximum stands at on a 0 start is auto-bidding's case, not this suite's.
- A valid bid in an extension case is placed by a bidder who does not lead, so it moves the price and restarts the timer; a leader raising their own maximum moves nothing, and is US12's case (decision Q5).
- Between the effective close and the recorded close, a lot takes no bid and names no result; the public status stays Active until the close is recorded (decision Q3).
- A bid at exactly the scheduled close counts on every listing, extension on or off; with no extension reach the effective close is one millisecond after the scheduled close (decision Q34).

## Reconciliation

**Run:** QA2 rerun, 2026-10-01, for change `relay-auction-live-state`. Joined QA1's blind cases, written from the re-frozen anchors (Purpose, Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` with `## Raised`, and the change's `domain-tcs.md`), with the delta scenarios, `tech-design.md`, `tasks.md` and the built code on `feat/relay-auction-live-state` in grade10, read to settle QA1's raised questions. QA1 was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive. QA2 added two rows to US11-TC5: a bid at exactly a recorded close, and a bid after a close with a cap of 0.

| Finding | Disposition |
| --- | --- |
| US2-TC15: a first bid at the opening price is accepted, never standing at 0 | **Folded in:** `grade10-site-auction-auction-SC-62`; the next minimum after it is asserted by `grade10-site-auction-bid-increments-US1-TC6-1` |
| US2-TC16: a first bid below a positive start is refused, naming the start | **Folded in:** `grade10-site-auction-auction-SC-64` |
| US2-TC17, US2-TC18: the first bid needs the start plus its tier increment | **Rejected:** reversed by Q19 and Q27; both cases are deprecated |
| US11-TC1: a confirm before the effective close counts, extending only in extended bidding | **Folded in:** `grade10-site-auction-auction-SC-69`, `grade10-site-auction-auction-SC-21` |
| US11-TC2: a confirm after the effective close loses, its hold released, "Your bid did not go through." alone | **Folded in:** `grade10-site-auction-auction-SC-67`; the words are `grade10-site-auction-listing-page-SC-39` (Q13) |
| US11-TC3: a lone first bid confirming after the scheduled close leaves the lot unsold | **Folded in:** `grade10-site-auction-auction-SC-68`. QA1's raised question on that bidder's My Auctions row is answered for Your Standing (Didn't win, by the after-close requirement) and for Current bid by Q32 (as on any unsold lot's row), in `grade10-site-auction-account-record-US10-TC4-1` |
| US11-TC4: with holds off a bid in the last second counts when placed | **Folded in:** `grade10-site-auction-auction-SC-86` |
| US11-TC5: no bid counts at or after the effective close while the close is unrecorded | **Folded in:** `grade10-site-auction-auction-SC-05`, `grade10-site-auction-auction-SC-74`, `grade10-site-auction-auction-SC-85`, `grade10-site-auction-auction-SC-87`, `grade10-site-auction-auction-SC-84`; the bid refused while settling is held back is `grade10-site-auction-auction-SC-74`'s refusal answered whatever the close does |
| US11-TC5, rows with a duration or a cap of 0 | **Settled:** Q34 - a bid at exactly the scheduled close counts on every listing, as `grade10-site-auction-auction-SC-83` and rule 2 of the window requirement state; the Effective close term now ends that window one millisecond after the scheduled close, so the anchor stands. The rows' effective close and limit bid moved to 20:00:00.001 UTC; the case stays draft and is no longer blocked |
| US11-TC6: a cap of 0 closes at the scheduled close | **Folded in:** `grade10-site-auction-auction-SC-84` |
| US11-TC7: a due lot is recorded closed at its close, not at the sweep | **Folded in:** `grade10-site-auction-auction-SC-70`; the case keeps a page open, and the alarm with no page open is the room test in task 6.1 |
| US11-TC8: a missed alarm is settled by a read, or by the sweep | **Folded in:** `grade10-site-auction-auction-SC-71`, `grade10-site-auction-auction-SC-72` |
| US11-TC9: the close rules hold with `auction.realtime` off | **Folded in:** `grade10-site-auction-auction-SC-78`. QA1's raised question, whether the lot's alarm still settles a due lot with the flag off, is **Escalated:** Q33. As built, the flag turns the rooms off and their alarms with them (`roomListingEvents` returns no events, and the socket routes answer 404), so a read past the close or the sweep records the close, while Q11 lists the settle rule as unflagged and the flag paragraph says every other requirement holds. Recommended: as built; the flag paragraph and `grade10-site-auction-auction-SC-78` say a read or the sweep records a due close while the flag is off. The case asserts no timing and stays as written |
| US11-TC10: public reads give the close terms and the service's time | **Folded in:** `grade10-site-auction-auction-SC-80`; that the time read is not cached is the route test in task 6.1 |
| US12-TC1: equal maxima at a higher price extend, the earlier keeping the lead | **Folded in:** `grade10-site-auction-auction-SC-82` |
| US12-TC2: a leader's raise leaves the close where it was | **Folded in:** `grade10-site-auction-auction-SC-81` |
| Durable US2-TC7-1 and US2-TC10-1 say "a valid bid" without naming who bids, so under Q5 a leader's own raise would read as extending | **Rejected:** not a contradiction - every accepted bid from a bidder who does not lead moves the price, so the cases verify what they did; they are the reviewer's `actual` cases. Recorded in `## Settled`; `/tcs-review` may pin the bidder in the wording without a version bump. US2-TC8-1's bidder has no earlier bid, so it is unambiguous |
| Q28, quick-bid chip 1x before any bid, has no scenario in this change and no case in its suites | **Escalated:** Q35. The chip rule lives in `shared/ui/auction-listing` ("the current bid plus those multiples"), which this change does not modify. Recommended: a modified `shared/ui/auction-listing` block in this change - before any bid, the chips step from the opening price - with one scenario; it adds a capability, so its QA1 and Dev readings run for that capability |

- **Covered at domain** - `grade10-site-auction-e2e-US07-TC04-1` walks `grade10-site-auction-auction-SC-65` and `grade10-site-auction-auction-SC-66`: a bid in extended bidding moves the card's price and its countdown with the lot page, without a reload
- **Covered at domain** - `grade10-site-auction-e2e-US12-TC02-1` walks `grade10-site-auction-auction-SC-88`: the card shows no result until the close is recorded, then Ended, without a reload
- **Covered at domain** - `grade10-site-auction-e2e-US07-TC03-2` walks `grade10-site-auction-auction-SC-06` with a price-moving auto-bid
- **Out of suite** - `grade10-site-auction-auction-SC-04` and `grade10-site-auction-auction-SC-08`, carried unchanged in the modified block: `grade10-site-auction-bid-increments-US1-TC4-1` and `grade10-site-auction-auto-bidding-US2-TC3-1` walk them
- **Out of suite** - `grade10-site-auction-auction-SC-63`: `grade10-site-auction-bid-increments-US1-TC7-1` refuses a first bid below the lowest increment on a 0 start, and task 11.1's bidding test refuses 1 minor unit on a `USD` 0 start
- **Out of suite** - `grade10-site-auction-auction-SC-73`: two settles racing is task 5.1's `settleIfDue` test; no page can time it
- **Out of suite** - `grade10-site-auction-auction-SC-75`: the version rule is task 3.1's trigger tests and task 7.1's `higherVersion` test
- **Out of suite** - `grade10-site-auction-auction-SC-76` and `grade10-site-auction-auction-SC-77`: `grade10-site-auction-listing-page-US12-TC6-1` and `grade10-site-auction-listing-page-US12-TC3-1` walk them, and task 6.1 asserts the frame contents
- **Out of suite** - `grade10-site-auction-auction-SC-79`: the `gone` frame is task 6.1's room test, and the page's re-read on it task 7.1's
- **Carried** - `grade10-site-auction-auction-SC-07`, `grade10-site-auction-auction-SC-07a`, `grade10-site-auction-auction-SC-07b`, `grade10-site-auction-auction-SC-19`, `grade10-site-auction-auction-SC-20`, `grade10-site-auction-auction-SC-21`, `grade10-site-auction-auction-SC-22`, `grade10-site-auction-auction-SC-23a` and `grade10-site-auction-auction-SC-24` keep the durable cases US2-TC6-1 to US2-TC14-1

**Uncovered anchors:** none. Journeys US-02, US-11 and US-12 each have cases; the `Catalogue`, `Closing a due lot`, `Live relay` and `Public contract` scenarios are folded, covered at domain or out of suite above.

