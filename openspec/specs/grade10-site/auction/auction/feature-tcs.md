# grade10-site/auction/auction Test Cases

**Status:** reopened
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** `grade10-site-auction-watchlist-SC-04` — signed-out watch from catalogue cards

## grade10-site-auction-auction-US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

<!-- trace:case id=g10.auction-auction.TC-7os rev=1 covers=g10.auction-auction.SC-ian,g10.auction-auction.SC-fec,g10.auction-auction.SC-djb,g10.auction-auction.SC-kg8 -->
### grade10-site-auction-auction-US1-TC2-1: Public listing read exposes the close and extension policy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_11>` is published.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_11>` | A published listing with extension duration 1800s (30mins) and an extension cap of 3600s (60mins) |

**Steps:**

1. Read the API response for `<listing_11>`.

**Expected Results:**

* It carries the scheduled close, the recorded close, the extension duration and the extension cap.
* It carries no extension window.
* It carries no reserve state.

---

## grade10-site-auction-auction-US2: Collector places a bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

<!-- trace:case id=g10.auction-auction.TC-b19 rev=2 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC5-2: A bid stands when accepted, with nothing held on the card

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer(card linked, no bid on `<listing_25>`) is signed in.
* `<listing_25>` is open inside its window.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_25>` | An open HKD listing taking bids, current bid `<current bid>` |
| `<current bid>` | 480000 minor units (HKD 4,800.00) |
| `<bid amount>` | 505000 minor units (HKD 5,050.00), at or above the minimum next bid |

**Steps:**

1. Submit `<bid amount>` on `<listing_25>`.
2. Read the API response.
3. Read the linked card's activity at the card provider.

**Expected Results:**

* Step 2 accepts the bid in the one answer, by the listing's bid rules, with no wait on the card provider.
* Step 3 shows nothing held or charged on the card for `<listing_25>`.

<!-- trace:case id=g10.auction-auction.TC-rj4 rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC10-1: Bid during extended bidding restarts the timer

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_2>` is in extended bidding and its recorded close is `<close before bids>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |
| `<close before bids>` | 20:30 UTC |
| `<first bid time>` | 20:10 UTC |
| `<second bid time>` | 20:35 UTC |
| `<close after first>` | 20:40 UTC |
| `<close after second>` | 21:05 UTC |

**Steps:**

1. Submit a valid bid at `<first bid time>`.
2. Read the recorded close.
3. Submit a valid bid at `<second bid time>`.
4. Read the recorded close.

**Expected Results:**

* The recorded close reads `<first bid time>` plus `<extension duration>` = `<close after first>`.
* The recorded close reads `<second bid time>` plus `<extension duration>` = `<close after second>`.

<!-- trace:case id=g10.auction-auction.TC-4fd rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC11-1: Extension cap holds the timer at the cap

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_3>` is in extended bidding and its recorded close is its scheduled close plus `<extension cap>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A listing in extended bidding whose recorded close already stands at its cap |
| `<scheduled close>` | 20:00 UTC |
| `<extension cap>` | 3600s (60mins), any cap the listing has already reached |
| `<result>` | 21:00 UTC |

**Steps:**

1. Submit a valid bid.
2. Read the recorded close.
3. Wait until the recorded close passes.

**Expected Results:**

* The bid is accepted.
* The recorded close reads `<scheduled close>` plus `<extension cap>`.
* The listing closes at `<result>`.

<!-- trace:case id=g10.auction-auction.TC-sge rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC12-1: Listing's own duration sets how long extended bidding runs

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_4>` is open with one accepted bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An open listing, scheduled close `<scheduled close>`, extension duration `<short duration>` |
| `<scheduled close>` | 20:00 UTC |
| `<short duration>` | 300s (5mins), any extension duration above 0 |
| `<result>` | 20:05 UTC |

**Steps:**

1. Wait for `<scheduled close>`.
2. Read the recorded close.

**Expected Results:**

* The listing is in extended bidding.
* The recorded close reads `<scheduled close>` plus `<short duration>` = `<result>`.

<!-- trace:case id=g10.auction-auction.TC-o03 rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC13-1: Extension off closes the listing at its scheduled close

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_5>` is open with an accepted bid and extension duration 0.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | An open listing with an accepted bid, extension duration 0s |

**Steps:**

1. Wait for the scheduled close.
2. Read the listing's state and recorded close.

**Expected Results:**

* The listing is closed at its scheduled close.
* It never entered extended bidding.

<!-- trace:case id=g10.auction-auction.TC-ftw rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC14-1: Bids by the close decide whether extended bidding starts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_6>` is open with scheduled close `<scheduled close>` and extension duration 1800s (30mins).
* `<listing_6>` holds the row's `<bids by close>`.

**Test data:**

| `<bids by close>` | `<scheduled close>` | `<extended close>` | `<result>` |
| --- | --- | --- | --- |
| None | 20:00 UTC | — | Closed at 20:00 UTC |
| One | 20:00 UTC | 20:30 UTC | Recorded close is 20:30 UTC; with no further bid, closed at 20:30 UTC |

**Steps:**

1. Wait for `<scheduled close>`.
2. Read the listing's state and recorded close.
3. When the row has `<extended close>`, wait until `<extended close>` with no bid.
4. Read the listing's state.

**Expected Results:**

* The listing reads `<result>`.

<!-- trace:case id=g10.auction-auction.TC-m7f rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC6-1: When a bid lands against the scheduled close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_7>` is open with no accepted bid, scheduled close 20:00:00 UTC, and extension duration 1800s (30mins).

**Test data:**

| `<bid time>` | Recorded close right after the bid |
| --- | --- |
| 19:59:00 UTC | 20:00:00 UTC, unchanged |
| 20:00:00 UTC | 20:30:00 UTC, the listing in extended bidding |

**Steps:**

1. Submit a valid bid at `<bid time>`.
2. Read the recorded close.

**Expected Results:**

* The bid is accepted.
* The recorded close reads as the row states.

<!-- trace:case id=g10.auction-auction.TC-iid rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC7-1: Each listing runs its own timer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_8>` and `<listing_9>` are both in extended bidding with recorded close 20:30 UTC.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A listing with scheduled close 20:00 UTC, in extended bidding, extension duration 1800s (30mins) |
| `<listing_9>` | A second listing in the same state as `<listing_8>` |

**Steps:**

1. Submit a valid bid on `<listing_8>` at 20:10 UTC.
2. Read both recorded closes.

**Expected Results:**

* `<listing_8>` reads 20:40 UTC.
* `<listing_9>` still reads 20:30 UTC.

<!-- trace:case id=g10.auction-auction.TC-q6k rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC8-1: Collector with no earlier bid bids during extended bidding

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer(no bid on `<listing_2>`, card saved) is signed in and on `<listing_2>`.
* `<listing_2>` is in extended bidding.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800s (30mins) |

**Steps:**

1. Submit a bid at the minimum next bid.
2. Read Time left.

**Expected Results:**

* The bid is accepted.
* The close moves to `<extension duration>` after that bid.

<!-- trace:case id=g10.auction-auction.TC-ott rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC9-1: Bid after extended bidding ends is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_10>` entered extended bidding and its recorded close has passed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A listing whose extended bidding timer ran out with no new bid |

**Steps:**

1. Submit a bid at the minimum next bid.
2. Read the listing's bids and recorded close.

**Expected Results:**

* Grade10 refuses the bid.
* No accepted bid is added and the recorded close is unchanged.

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

* `<listing_21>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_21>`) is signed in and on `<listing_21>`.

**Test data:**

| Currency | `<start>` | `<opening price>` | `<next minimum>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00), positive start | 20000 minor units (HKD 200.00), the start itself | 21000 minor units (HKD 210.00) |
| HKD | 500 minor units (HKD 5.00), below the lowest increment | 500 minor units (HKD 5.00), the start itself | 1500 minor units (HKD 15.00) |
| HKD | 0 minor units (HKD 0.00), zero start | 1000 minor units (HKD 10.00), the lowest increment | 2000 minor units (HKD 20.00) |
| USD | 0 minor units (USD 0.00), zero start | 100 minor units (USD 1.00), the lowest increment | 200 minor units (USD 2.00) |
| JPY | 0 minor units (JPY 0), zero start | 100 minor units (JPY 100), the lowest increment | 200 minor units (JPY 200) |

**Steps:**

1. Enter the row's `<opening price>` in the custom maximum on the bid panel.
2. Place the bid.
3. Read Highest bid, the bid count and Recent Bids.
4. Read the minimum next bid.

**Expected Results:**

* The bid is accepted.
* Highest bid reads `<opening price>`, never 0.
* The bid count reads 1, and Recent Bids shows the bid as You.
* Step 4 reads `<next minimum>`, `<opening price>` plus its tier increment.

### grade10-site-auction-auction-US2-TC16-2: First bid below the opening price is refused, naming it

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

* `<listing_22>` is open inside its window, in the row's currency, starting price the row's `<start>`, with no accepted bid.
* customer(card linked, no bid on `<listing_22>`) is signed in.

**Test data:**

| Currency | `<start>` | `<opening price>` | `<bid amount>` |
| --- | --- | --- | --- |
| HKD | 20000 minor units (HKD 200.00) | 20000 minor units (HKD 200.00), the start itself | 19999 minor units (HKD 199.99), one minor unit below |
| USD | 50000 minor units (USD 500.00) | 50000 minor units (USD 500.00), the start itself | 49999 minor units (USD 499.99), one minor unit below |
| JPY | 20000 minor units (JPY 20,000) | 20000 minor units (JPY 20,000), the start itself | 19999 minor units (JPY 19,999), one minor unit below |
| HKD | 0 minor units (HKD 0.00), zero start | 1000 minor units (HKD 10.00), the lowest increment | 999 minor units (HKD 9.99), one minor unit below |
| USD | 0 minor units (USD 0.00), zero start | 100 minor units (USD 1.00), the lowest increment | 99 minor units (USD 0.99), one minor unit below |
| JPY | 0 minor units (JPY 0), zero start | 100 minor units (JPY 100), the lowest increment | 99 minor units (JPY 99), one minor unit below |

**Steps:**

1. Submit a bid of the row's `<bid amount>` on `<listing_22>`.
2. Read the API response.
3. Read `<listing_22>`'s bids and bid count.

**Expected Results:**

* Grade10 refuses the bid, naming `<opening price>` as the minimum.
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

### grade10-site-auction-auction-US2-TC19-1: Two bids at once are judged one after the other

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

* `<listing_26>` is open inside its window, current bid `<current bid>`.
* customer A(card linked) and customer B(card linked) are signed in on separate sessions, neither holding a bid on `<listing_26>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_26>` | An open HKD listing taking bids, led by customer C at `<current bid>` with maximum `<current bid>` |
| `<current bid>` | 480000 minor units (HKD 4,800.00) |
| `<increment>` | 8000 minor units (HKD 80.00), the HK$4,000 tier |
| `<bid A>` | 505000 minor units (HKD 5,050.00) |
| `<bid B>` | 600000 minor units (HKD 6,000.00), above `<bid A>` |

**Steps:**

1. Submit `<bid A>` as customer A and `<bid B>` as customer B on `<listing_26>` at the same moment.
2. Read both API responses.
3. Read `<listing_26>` from the public listing API.

**Expected Results:**

* Each response is one answer: accepted with a standing, or refused.
* customer B leads, and Highest bid reads `<bid A>` plus `<increment>`.
* No lower bid overwrites that Highest bid, whichever response arrived first.

---

## grade10-site-auction-auction-US3: Collector's card hold is released when they are outbid

**As a** bidder,
**I want** one authorization per listing, released when I am outbid,
**so that** a delayed lower hold or a duplicate Stripe event cannot take a second bite.

<!-- trace:case id=g10.auction-auction.TC-tmg rev=1 covers=g10.auction-auction.SC-mrb,g10.auction-auction.SC-uha,g10.auction-auction.SC-8h7,g10.auction-auction.SC-fna,g10.auction-auction.SC-lk6,g10.auction-auction.SC-9io -->
### grade10-site-auction-auction-US3-TC1-1: Outbid authorization is marked for release

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* customer A holds the active authorization for open listing `<listing_1>`.
* customer B is able to bid on `<listing_1>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | An open listing whose current bid is customer A's |
| `<higher bid>` | A valid amount above customer A's current bid |

**Steps:**

1. Submit `<higher bid>` for customer B against `<listing_1>`.
2. Read customer A's authorization state for `<listing_1>`.
3. Read the recorded Stripe release outcome once it arrives.

**Expected Results:**

* Grade10 marks customer A's authorization for asynchronous release.
* Customer A no longer holds an eligible top authorization for `<listing_1>`.
* Grade10 records the Stripe release outcome when it arrives.

<!-- trace:case id=g10.auction-auction.TC-g81 rev=1 covers=g10.auction-auction.SC-mrb,g10.auction-auction.SC-uha,g10.auction-auction.SC-8h7,g10.auction-auction.SC-fna,g10.auction-auction.SC-lk6,g10.auction-auction.SC-9io -->
### grade10-site-auction-auction-US3-TC2-1: Concurrent bids keep the highest valid outcome

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
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* `<listing_1>` is open and both customers read the same current listing state.

**Test data:**

| Field | Value |
| --- | --- |
| `<bid A>` | A valid amount from customer A |
| `<bid B>` | A different valid amount from customer B, above `<bid A>` |

**Steps:**

1. Submit `<bid A>` and `<bid B>` against `<listing_1>` concurrently.
2. Read the listing's recorded bid order and current bid.

**Expected Results:**

* Grade10 records the bid outcomes in one listing order.
* The current bid is the highest valid accepted amount.
* No lower bid overwrites that current bid.

<!-- trace:case id=g10.auction-auction.TC-m5k rev=1 covers=g10.auction-auction.SC-mrb,g10.auction-auction.SC-uha,g10.auction-auction.SC-8h7,g10.auction-auction.SC-fna,g10.auction-auction.SC-lk6,g10.auction-auction.SC-9io -->
### grade10-site-auction-auction-US3-TC3-1: Delayed lower authorization cannot land

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
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* Customer A's card authorization for `<listing_1>` is pending at Stripe.
* Grade10 has accepted customer B's higher valid bid before Stripe confirms it.

**Steps:**

1. Let Stripe confirm customer A's lower authorization.
2. Read the authorization state and the listing's current bid.

**Expected Results:**

* Grade10 releases the lower authorization.
* It does not record that lower bid as accepted.
* The current bid is unchanged.

<!-- trace:case id=g10.auction-auction.TC-9qw rev=1 covers=g10.auction-auction.SC-mrb,g10.auction-auction.SC-uha,g10.auction-auction.SC-8h7,g10.auction-auction.SC-fna,g10.auction-auction.SC-lk6,g10.auction-auction.SC-9io -->
### grade10-site-auction-auction-US3-TC4-1: Invalid or duplicate Stripe event changes nothing twice

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
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* `<listing_1>` has an authorization, release or capture already recorded.

**Test data:**

Runs once per row of **Test data**.

| `<event>` | Grade10 answers |
| --- | --- |
| A webhook whose signature is invalid | rejects the event |
| A webhook whose provider event was already processed | returns the duplicate outcome without another state transition |

**Steps:**

1. Deliver `<event>` to the Stripe webhook endpoint.
2. Read the bid, hold, release, capture, invoice and order state for `<listing_1>`.

**Expected Results:**

* Grade10 answers as the row states.
* No bid, hold, release, capture, invoice or order state is duplicated.

<!-- trace:case id=g10.auction-auction.TC-nna rev=1 covers=g10.auction-auction.SC-mrb,g10.auction-auction.SC-uha,g10.auction-auction.SC-8h7,g10.auction-auction.SC-fna,g10.auction-auction.SC-lk6,g10.auction-auction.SC-9io -->
### grade10-site-auction-auction-US3-TC5-1: Incomplete Stripe configuration fails the operation explicitly

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* Required Stripe configuration is absent, or does not support the authorization or capture action the operation needs.

**Steps:**

1. Attempt an Auction operation that requires Stripe against `<listing_1>`.
2. Read the recorded bids and outcomes for `<listing_1>`.

**Expected Results:**

* Grade10 fails the operation, naming the unavailable capability.
* No bid or fixture-backed outcome is created.

<!-- trace:case id=g10.auction-auction.TC-ghi rev=1 covers=g10.auction-auction.SC-mrb,g10.auction-auction.SC-uha,g10.auction-auction.SC-8h7,g10.auction-auction.SC-fna,g10.auction-auction.SC-lk6,g10.auction-auction.SC-9io -->
### grade10-site-auction-auction-US3-TC6-1: Missed authorization webhook is repaired once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-03

**Pre-conditions:**

* Stripe has confirmed customer A's bid authorization for `<listing_1>`.
* Grade10 has not processed that webhook, and holds the provider reference.

**Steps:**

1. Run scheduled reconciliation over the recorded provider reference.
2. Read the authorization outcome for `<listing_1>`.
3. Run the reconciliation a second time.

**Expected Results:**

* Grade10 reads the authorization outcome from Stripe.
* It applies that outcome exactly once.

---

## grade10-site-auction-auction-US4: Collector meets the identity bar on a high-value bid

**As a** collector bidding the bar or more on a lot,
**I want** to be told at once that a verified identity is needed and where to get one,
**so that** the auction records nothing for a bid it cannot take, and I can verify and bid again before the lot closes.

<!-- trace:case id=g10.auction-auction.TC-zsd rev=2 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-d78,g10.auction-auction.SC-ndj -->
### grade10-site-auction-auction-US4-TC1-2: Verified bidder's bid at the bar is forwarded as any other

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in on `<a verified account>` with `<card>` saved, and is on `<listing_12>`.
* `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified account>` | An account whose standing is `verified` on the day of the bid |
| `<card>` | Visa ending 4242 |
| `<bar>` | 12000000 minor units (HKD 120,000.00), the bar Grade10 sets on a bid |
| `<listing_12>` | A live HKD listing whose minimum next bid is `<bar>` |
| `<bid at the bar>` | 12000000 minor units (HKD 120,000.00), equal to `<bar>` |

**Steps:**

1. Enter `<bid at the bar>` in the bid field and select **Place Bid**.
2. Read Highest bid and the bid count.
3. Read `<card>`'s activity at the card provider.

**Expected Results:**

* The bid is forwarded and accepted as any other - no refusal names a verified identity.
* Highest bid reads `<bid at the bar>`, and the bid count rises by one.
* Step 3 shows nothing held or charged on `<card>`.

<!-- trace:case id=g10.auction-auction.TC-5gi rev=2 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-d78,g10.auction-auction.SC-ndj -->
### grade10-site-auction-auction-US4-TC2-2: Bidder without a verified standing is held at the storefront at and above the bar

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
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in with `<card>` saved on an account whose standing is the one the row names, holds no bid on `<listing_12>`, and is on `<listing_12>`.
* `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Standing | Bid amount | Outcome |
| --- | --- | --- |
| `unverified` | 12000000 minor units (HKD 120,000.00), exactly `<bar>` | Refused; no bid recorded |
| `unverified` | 12500000 minor units (HKD 125,000.00), any bid above `<bar>` | Refused; no bid recorded |
| `expired` | 12000000 minor units (HKD 120,000.00), exactly `<bar>` | Refused; no bid recorded |
| `expired` | 12500000 minor units (HKD 125,000.00), any bid above `<bar>` | Refused; no bid recorded |

| Field | Value |
| --- | --- |
| `<card>` | Visa ending 4242 |
| `<bar>` | 12000000 minor units (HKD 120,000.00), the bar Grade10 sets on a bid |
| `<listing_12>` | A live HKD listing whose minimum next bid is `<bar>` |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read the refusal on the bid form.
3. Reload `<listing_12>` and read Highest bid and the bid count.
4. Navigate to `<my auctions url>` and look for `<listing_12>`.
5. Navigate to `<grade10 bids url>` and look for `<listing_12>`.

**Expected Results:**

* The bid is refused as needing a verified identity, and the refusal says where to verify from the account.
* Highest bid and the bid count are unchanged - the auction records no bid.
* Step 4 shows no row for `<listing_12>`.
* Step 5 shows no entry for `<listing_12>`.

<!-- trace:case id=g10.auction-auction.TC-49i rev=1 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-d78,g10.auction-auction.SC-ndj -->
### grade10-site-auction-auction-US4-TC3-1: Bid below the bar asks nothing of any bidder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in with `<card>` saved on an account whose standing is the one the row names, and is on `<listing_13>`.
* `<listing_13>` is live, inside its window, in HKD, and its minimum next bid is at or below the bid amount the row names.

**Test data:**

| Standing | Bid amount | Outcome |
| --- | --- | --- |
| `unverified` | 505000 minor units (HKD 5,050.00), any bid below `<bar>` | Forwarded as any other; no standing read |
| `expired` | 505000 minor units (HKD 5,050.00), any bid below `<bar>` | Forwarded as any other; no standing read |
| `verified` | 505000 minor units (HKD 5,050.00), any bid below `<bar>` | Forwarded as any other; no standing read |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read Highest bid.
3. Read the calls the run made to the identity store.

**Expected Results:**

* The bid is forwarded and accepted as any other, and Highest bid reads the bid amount the row names.
* No standing was read.

---

## grade10-site-auction-auction-US5: Collector reads the catalogue in one order

**As a** collector,
**I want** All auctions to lead with the lots I can bid on, soonest to close first, and to keep that order as I read on — below Featured when Featured is present, with no category section —,
**so that** what I can still bid on is in front of me and reading further never shows me a lot twice or skips one.

### grade10-site-auction-auction-US5-TC1-1: Open lots lead the catalogue

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists `<listing_14>`, `<listing_15>` and `<listing_16>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | An Active lot whose close is 18:00 UTC |
| `<listing_15>` | An Upcoming lot whose start is 19:00 UTC |
| `<listing_16>` | An Ended lot that closed at 12:00 UTC, before `<listing_14>` closes |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Read the lots in listed order.

**Expected Results:**

* `<listing_14>` is listed before `<listing_15>`.
* `<listing_15>` is listed before `<listing_16>`.

### grade10-site-auction-auction-US5-TC2-1: Each status has its own order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The catalogue lists the six lots in **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_17>` | An Active lot closing at 18:00 UTC |
| `<listing_18>` | An Active lot closing at 19:00 UTC |
| `<listing_19>` | An Upcoming lot starting on 2026-10-01 |
| `<listing_20>` | An Upcoming lot starting on 2026-10-02 |
| `<listing_21>` | An Ended lot that closed on 2026-09-22 |
| `<listing_22>` | An Ended lot that closed on 2026-09-15 |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Read the lots in listed order.

**Expected Results:**

* `<listing_17>` is listed before `<listing_18>`.
* `<listing_19>` is listed before `<listing_20>`.
* `<listing_21>` is listed before `<listing_22>`.

### grade10-site-auction-auction-US5-TC3-1: A tie is settled the same way every read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* `<listing_23>` and `<listing_24>` are both Active and close at the same time.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_23>` | An Active lot closing at 18:00 UTC |
| `<listing_24>` | An Active lot closing at 18:00 UTC, a different lot record from `<listing_23>` |

**Steps:**

1. Read the API response for the Auction catalogue.
2. Read the API response for the Auction catalogue again.

**Expected Results:**

* `<listing_23>` and `<listing_24>` are in the same order both times.

### grade10-site-auction-auction-US5-TC4-1: Paging does not change the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* The Auction catalogue holds more lots than one page lists.

**Steps:**

1. Read the API response one page at a time to the end.
2. Read the API response for the whole catalogue.

**Expected Results:**

* Both readings list the lots in the same order.
* No lot is listed twice.
* No lot is missing.

### grade10-site-auction-auction-US5-TC5-1: Empty Featured leaves All auctions only

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* No complete Featured slot is set.
* At least one lot is visible in All auctions.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the page sections.

**Expected Results:**

* No Featured band is present.
* All auctions is shown with lots in the catalogue resting order.

### grade10-site-auction-auction-US5-TC6-1: Catalogue shows no category chrome

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Featured may be present or absent.

**Steps:**

1. Read the catalogue page for category chrome.

**Expected Results:**

* There is no Categories heading, no category tiles, and no busy filter chrome.
* The only sections are Featured when set, then All auctions.

### grade10-site-auction-auction-US5-TC7-1: Empty All auctions still shows Featured when slots are set

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set.
* No lots are available for All auctions.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the All auctions area.

**Expected Results:**

* Featured still shows the curated slide or slides.
* All auctions shows a message that there are no auctions.

### grade10-site-auction-auction-US5-TC8-1: Featured lots also appear in All auctions resting order

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* At least one complete Featured slot is set for `<featured lot>`.
* `<featured lot>` is among the lots a collector can see.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published lot that fills a complete Featured slot |

**Steps:**

1. Read the Featured band for `<featured lot>`.
2. Read All auctions for `<featured lot>` and the list order.

**Expected Results:**

* `<featured lot>` appears in Featured and again in All auctions.
* All auctions keeps the catalogue resting order below Featured, with no duplicate within the list and no skipped visible lot.

### grade10-site-auction-auction-US5-TC9-1: Catalogue address stays indexable at /auction without category query

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the document canonical and share address.

**Expected Results:**

* Canonical and share address are `/auction` with no category query.

### grade10-site-auction-auction-US5-TC10-1: More All auctions lots load on scroll

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* All auctions holds more lots than the first batch shows.

**Steps:**

1. Read the first batch of All auctions cards.
2. Scroll near the end of the shown lots.
3. Wait for the next batch.

**Expected Results:**

* Step 2 shows Boneyard skeleton cards below the lots already shown, or the next batch lands without pagination controls.
* Step 3 shows additional lots below the first batch.
* Lots from step 1 stay visible.
* The combined list stays in the catalogue resting order.
* No pagination controls appear.

### grade10-site-auction-auction-US5-TC11-1: An Upcoming All auctions card shows no money

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-05

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* An Upcoming lot is among All auctions.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming lot on All auctions |

**Steps:**

1. Find `<upcoming lot>` on All auctions.
2. Read its card for money and countdown.

**Expected Results:**

* The card shows no starting bid and no money amount.
* The card shows Opens in from the served open.

---

## grade10-site-auction-auction-US6: Collector reads Featured on the catalogue

**As a** collector opening `/auction`,
**I want** the operator's Featured slides when any are set — front page image, title,
status, countdown, current bid and Bid Now —,
**so that** the lots the house leads with are what I meet first.

### grade10-site-auction-auction-US6-TC01-1: One Featured slide shows front page image title status countdown bid and Bid Now

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Exactly one complete Featured slot is set for a published Active lot with its front page image.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published Active lot bound to the only complete Featured slot |
| `<front page image>` | The front page image uploaded for that slot |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured band and the single slide.

**Expected Results:**

* Featured band is present with one slide.
* The slide shows `<front page image>` as banner and slab, the lot title, LIVE BIDDING with a live status dot, relative Ends in, the current bid, and Bid Now.

### grade10-site-auction-auction-US6-TC02-1: Current bid rolls when the served amount increases

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured lot>` visible.
* The served current bid for `<featured lot>` is `<bid before>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published Active lot on a complete Featured slide |
| `<bid before>` | The current bid amount shown on the slide |
| `<bid after>` | A **higher** served current bid for the same lot after first paint |

**Steps:**

1. Read the current bid on the Featured slide after first paint.
2. Let the served current bid for `<featured lot>` become `<bid after>`.
3. Read the current bid on the Featured slide.

**Expected Results:**

* Step 1 shows `<bid before>`.
* Step 3 shows `<bid after>` with a rolling number as the amount increases.

### grade10-site-auction-auction-US6-TC03-1: Client countdown uses served close or open by lot status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* One complete Featured slot is set for the row's lot.

**Test data:**

| Lot status | Served time | Countdown |
| --- | --- | --- |
| Active | Served close | Relative Ends in to the served close |
| Upcoming | Served open | Relative Opens in to the served open; UPCOMING with no live status dot; View Auction; no money |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the countdown and status chrome on the Featured slide.

**Expected Results:**

* The countdown matches the row (Ends in or Opens in).
* Upcoming shows UPCOMING with no live status dot and View Auction, and shows no starting bid or money amount.

### grade10-site-auction-auction-US6-TC04-1: Three Featured slides appear in operator order

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
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* Three complete Featured slots are set in operator order `<lot A>`, `<lot B>`, `<lot C>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published Active or Upcoming lot in Featured slot 1 |
| `<lot B>` | Published Active or Upcoming lot in Featured slot 2 |
| `<lot C>` | Published Active or Upcoming lot in Featured slot 3 |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured slides from first to last.

**Expected Results:**

* Featured shows three slides in order `<lot A>`, then `<lot B>`, then `<lot C>`.

### grade10-site-auction-auction-US6-TC05-1: Incomplete Featured slot is not shown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-06

**Pre-conditions:**

* customer is able to open `<grade10 auction catalogue url>`.
* The only Featured slot holds an eligible lot and no front page image, or a front page image and no lot.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read whether a Featured band is present.

**Expected Results:**

* No Featured band is shown.
* All auctions is the catalogue content below the page chrome.

---

## grade10-site-auction-auction-US7: Collector advances Featured slides

**As a** collector on `/auction` with more than one Featured slide,
**I want** to move between slides with the progress control, and on a small
viewport also with stage previous/next or a horizontal swipe,
**so that** I can reach every curated lot without leaving the band.

### grade10-site-auction-auction-US7-TC01-1: Progress advances between two Featured slides

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
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Two complete Featured slots are set for `<lot A>` then `<lot B>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published lot in Featured slot 1 |
| `<lot B>` | Published lot in Featured slot 2 |

**Steps:**

1. Read the visible Featured lot.
2. Activate the progress control to advance to the next slide.
3. Read the visible Featured lot.

**Expected Results:**

* Step 1 shows `<lot A>`.
* Step 3 shows `<lot B>`.
* Progress dots are present for the two slides.

### grade10-site-auction-auction-US7-TC04-1: On a small viewport, stage next advances between two Featured slides

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` at a small viewport (below `md`).
* Two complete Featured slots are set for `<lot A>` then `<lot B>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published lot in Featured slot 1 |
| `<lot B>` | Published lot in Featured slot 2 |

**Steps:**

1. Read the visible Featured lot.
2. Activate stage next on the Featured image.
3. Read the visible Featured lot.

**Expected Results:**

* Step 1 shows `<lot A>`.
* Step 3 shows `<lot B>`.
* The stage image pages horizontally to `<lot B>`.
* Progress dots mark `<lot B>` current.

### grade10-site-auction-auction-US7-TC02-1: Progress reaches every slide when three are set

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Three complete Featured slots are set for `<lot A>`, `<lot B>`, `<lot C>` in that order.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published lot in Featured slot 1 |
| `<lot B>` | Published lot in Featured slot 2 |
| `<lot C>` | Published lot in Featured slot 3 |

**Steps:**

1. Read the visible Featured lot.
2. Advance with the progress control until each remaining slide has been shown.
3. Read each visible Featured lot after each advance.

**Expected Results:**

* The visible lots are `<lot A>`, then `<lot B>`, then `<lot C>` without leaving the Featured band.

### grade10-site-auction-auction-US7-TC03-1: A single Featured slide needs no multi-dot advance

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-07

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>`.
* Exactly one complete Featured slot is set.

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the Featured progress control.

**Expected Results:**

* The single slide is shown.
* There is no multi-dot advance among slides.
* Stage previous/next is not required.

---

## grade10-site-auction-auction-US8: Collector opens a Featured lot

**As a** collector on a Featured slide,
**I want** Bid Now when the lot is Active, or View Auction when it is Upcoming,
to open that lot's details page,
**so that** I land on the lot the catalogue led with.

### grade10-site-auction-auction-US8-TC01-1: Bid Now opens an Active lot details page

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
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<featured lot>` visible.

**Test data:**

| Field | Value |
| --- | --- |
| `<featured lot>` | A published **Active** lot on the visible Featured slide |
| `<lot page url>` | That lot's details page address |

**Steps:**

1. Activate Bid Now on the Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<lot page url>` — the details page for `<featured lot>`.

### grade10-site-auction-auction-US8-TC03-1: View Auction opens an Upcoming lot details page

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
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with a complete Featured slide for `<upcoming lot>` visible.

**Test data:**

| Field | Value |
| --- | --- |
| `<upcoming lot>` | A published Upcoming lot on the visible Featured slide |
| `<lot page url>` | That lot's details page address |

**Steps:**

1. Activate View Auction on the Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<lot page url>` — the details page for `<upcoming lot>`.

### grade10-site-auction-auction-US8-TC02-1: Bid Now on a later Active slide opens that slide's lot

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-08

**Pre-conditions:**

* customer is on `<grade10 auction catalogue url>` with two complete Featured slides for `<lot A>` then `<lot B>`.
* The progress control has advanced so `<lot B>` is visible.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot A>` | Published **Active** lot in Featured slot 1 |
| `<lot B>` | Published **Active** lot in Featured slot 2 |
| `<lot B page url>` | `<lot B>`'s details page address |

**Steps:**

1. Activate Bid Now on the visible Featured slide.
2. Read the page that opens.

**Expected Results:**

* The browser opens `<lot B page url>` — the details page for `<lot B>`, not `<lot A>`.

---

## grade10-site-auction-auction-US9: Collector watches from an All auctions card

**As a** signed-in collector reading All auctions,
**I want** the watch control on a card to watch or unwatch that lot the same way as on the lot page and My Auctions,
**so that** I do not learn a second watch rule on the catalogue.

### grade10-site-auction-auction-US9-TC01-1: Watch on from an All auctions card

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
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in, not watching `<open lot>`) is on `<grade10 auction catalogue url>`.
* `<open lot>` appears on an All auctions card and is not closed.

**Test data:**

| Field | Value |
| --- | --- |
| `<open lot>` | A published Active or Upcoming lot on an All auctions card |

**Steps:**

1. Activate watch on the All auctions card for `<open lot>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open lot>` is watched.

**Expected Results:**

* The card shows the watched state.
* `<open lot>` is watched the same way as from the lot page and My Auctions.

### grade10-site-auction-auction-US9-TC02-1: Watch off from an All auctions card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in, watching `<open lot>`) is on `<grade10 auction catalogue url>`.
* `<open lot>` appears on an All auctions card and is not closed.

**Test data:**

| Field | Value |
| --- | --- |
| `<open lot>` | A published Active or Upcoming lot the collector already watches |

**Steps:**

1. Activate watch off on the All auctions card for `<open lot>`.
2. Read the card's watch state.
3. Open My Auctions and read whether `<open lot>` remains watched.

**Expected Results:**

* The card shows the unwatched state.
* `<open lot>` is no longer watched, same as unwatching from the lot page or My Auctions.

### grade10-site-auction-auction-US9-TC03-1: Closed lot card shows no watch control

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-09

**Pre-conditions:**

* customer(signed in) is on `<grade10 auction catalogue url>`.
* `<closed lot>` appears on an All auctions card.

**Test data:**

| Field | Value |
| --- | --- |
| `<closed lot>` | A closed lot visible in All auctions |

**Steps:**

1. Find the All auctions card for `<closed lot>`.
2. Read whether a watch control is present on that card.

**Expected Results:**

* The closed lot card shows no watch control.

---

## grade10-site-auction-auction-US11: Bidder is held to the close with everyone else

**As a** bidder,
**I want** a lot to stop taking bids at its close for everyone, and a bid to count when it is accepted before then,
**so that** nobody wins with a bid that arrived after the close.

### grade10-site-auction-auction-US11-TC1-1: Payment confirmed before the effective close counts the bid

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
| Open, scheduled close 20:00:00 UTC, extension duration 0s | 19:59:55 UTC | 20:00:00.000 UTC, exactly the scheduled close, at the limit | 20:00:00 UTC, unchanged |

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
* With no further bid, `<listing_1>` closes at `<recorded close after>` with customer A winning.

### grade10-site-auction-auction-US11-TC2-1: Payment confirmed after the effective close loses and releases its hold

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

| `<listing_2>` state | `<recorded close>` | `<effective close>` | `<placed at>` | `<confirm time>` |
| --- | --- | --- | --- | --- |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:30:00 UTC, the recorded close | 20:29:55 UTC | 20:30:01 UTC |
| Extended bidding, extension duration 1800s (30mins), no cap | 20:30:00 UTC | 20:30:00 UTC, the recorded close | 20:29:55 UTC | 20:30:00.000 UTC, exactly the effective close, at the limit |
| Open, extension duration 0s | 20:00:00 UTC | 20:00:00.001 UTC, one millisecond after the scheduled close | 19:59:55 UTC | 20:00:01 UTC |

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
* The recorded close stays `<recorded close>`.
* customer A's authorization for `<bid amount>` is released.
* `<listing_2>` closes with customer B winning at `<leader price>`.

### grade10-site-auction-auction-US11-TC3-1: Lone first bid still confirming at the scheduled close leaves the lot unsold

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

### grade10-site-auction-auction-US11-TC4-1: A bid placed in the last second counts when accepted

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

### grade10-site-auction-auction-US11-TC7-1: A due lot is recorded closed at its close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* customer A leads `<listing_7>`.
* `<listing_7>`'s recorded close is about two minutes away, and no other bid will be placed.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | An HKD listing in extended bidding, led by customer A |
| `<sweep interval>` | 300s (5mins) |

**Steps:**

1. Wait for the recorded close.
2. Read the API response for `<listing_7>`.

**Expected Results:**

* Step 2 reads `<listing_7>` closed, customer A winning, before the next sweep, well inside `<sweep interval>`.

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

### grade10-site-auction-auction-US11-TC9-2: A lot no page has open is recorded closed at its close

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* `<listing_11>` is in the row's state, and no page has it open.
* Nobody reads `<listing_11>` until step 2.

**Test data:**

| `<listing_11>` state | `<close>` | `<result>` |
| --- | --- | --- |
| An HKD listing in extended bidding, led by customer A at `<leader price>`, extension duration 1800s (30mins), no cap | its recorded close | Closed, customer A winning at `<leader price>` |
| An open HKD listing with no accepted bid, extension duration 1800s (30mins) | its scheduled close | Closed unsold, never in extended bidding |

| Field | Value |
| --- | --- |
| `<leader price>` | 480000 minor units |
| `<sweep interval>` | 300s (5mins) |

**Steps:**

1. Wait until 10 seconds past `<close>`.
2. Read the API response for `<listing_11>`.

**Expected Results:**

* `<listing_11>` reads `<result>`, recorded within seconds of `<close>`.
* The close is recorded before the next sweep, well inside `<sweep interval>`.

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
3. One second later, read the public time again.

**Expected Results:**

* Step 1 gives scheduled close 20:00:00 UTC and recorded close 20:25:00 UTC.
* Step 1 gives extension duration 1800s and extension cap 3600s.
* Steps 2 and 3 each give the auction service's time when it answered, not the caller's.
* Step 3's answer is about one second after step 2's, not a cached copy.

### grade10-site-auction-auction-US11-TC11-1: Leader's raise confirmed after the close loses, the earlier lead stands

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
* **Trace:** grade10-site-auction-auction-US-11

**Pre-conditions:**

* Bid-time holds are on.
* customer A leads `<listing_13>` at `<leader price>` with maximum `<user A maximum>`, its authorization held.
* customer A's authorization for `<raised maximum>` is held until `<confirm time>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_13>` | An HKD listing in extended bidding, recorded close 20:30:00 UTC, extension duration 1800s (30mins), no cap |
| `<leader price>` | 530000 minor units |
| `<user A maximum>` | 800000 minor units |
| `<raised maximum>` | 900000 minor units |
| `<placed at>` | 20:29:55 UTC |
| `<confirm time>` | 20:30:01 UTC, after the effective close |

**Steps:**

1. As customer A, raise the maximum to `<raised maximum>` at `<placed at>`.
2. Wait until `<listing_13>` is recorded closed.
3. Read the API response for `<listing_13>`.
4. Read customer A's card authorizations for `<listing_13>`.

**Expected Results:**

* `<listing_13>` closes at 20:30:00 UTC, customer A winning at `<leader price>`.
* customer A's maximum stays `<user A maximum>`.
* The authorization for `<raised maximum>` is released.
* The authorization for `<user A maximum>` is kept.

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

---

## grade10-site-auction-auction-US13: Runner-up takes the lead when the leader's account is erased

**As a** bidder whose maximum is the highest left on a lot,
**I want** to take the lead at a price set by the maxima still standing when the leader's account is erased,
**so that** the lot keeps a leader and I never pay more than the price stood at before.

### grade10-site-auction-auction-US13-TC1-1: Highest maximum left leads, priced from the maxima left

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
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_27>` is open inside its window, with the row's maxima committed in the row's order.
* customer A leads `<listing_27>` at `<price before>`.
* customer A has no unpaid order or open fulfilment, so nothing stops the erasure.
* customer B is signed in on a separate session.

**Test data:**

| customer A maximum | customer B maximum | customer C maximum | `<price before>` | `<price after>` | Leader after |
| --- | --- | --- | --- | --- | --- |
| 200000 minor units (HKD 2,000.00), first | 150000 minor units (HKD 1,500.00) | 120000 minor units (HKD 1,200.00) | 154000 minor units (HKD 1,540.00), customer B's maximum plus 4000 | 124000 minor units (HKD 1,240.00), customer C's maximum plus 4000 | customer B |
| 200000 minor units (HKD 2,000.00), first | 121000 minor units (HKD 1,210.00) | 120000 minor units (HKD 1,200.00) | 125000 minor units (HKD 1,250.00), customer B's maximum plus 4000 | 121000 minor units (HKD 1,210.00), capped at customer B's maximum | customer B |
| 150000 minor units (HKD 1,500.00), first | 150000 minor units (HKD 1,500.00), second | 120000 minor units (HKD 1,200.00) | 150000 minor units (HKD 1,500.00), equal maxima, customer A earlier | 124000 minor units (HKD 1,240.00), customer C's maximum plus 4000 | customer B |

| Field | Value |
| --- | --- |
| `<listing_27>` | An open HKD listing, starting price 20000 minor units (HKD 200.00), scheduled close more than an hour away |
| Increment | 4000 minor units (HKD 40.00), the HK$800 tier, at every maximum above |

**Steps:**

1. Read `<listing_27>` from the public listing API.
2. Erase customer A's account through the account-erasure procedure.
3. Read `<listing_27>` from the public listing API.
4. As customer B, read their own standing on `<listing_27>`.

**Expected Results:**

* Step 1 reads Highest bid `<price before>`, led by customer A.
* Step 3 reads Highest bid `<price after>`, the next maximum left plus one increment, capped at the new leader's maximum.
* Step 3's Highest bid is never above `<price before>`.
* Step 4 reads the row's leader after: customer B leads, with their own maximum unchanged.
* customer A's maxima appear nowhere on `<listing_27>`.

### grade10-site-auction-auction-US13-TC2-1: Erasing the only bidder leaves the lot with no leader

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
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_28>` is open inside its window, and customer A's maximum is its only maximum.
* customer A has no unpaid order or open fulfilment, so nothing stops the erasure.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_28>` | An open HKD listing, starting price 20000 minor units (HKD 200.00), led by customer A alone at the starting price |
| customer A maximum | 200000 minor units (HKD 2,000.00) |

**Steps:**

1. Erase customer A's account through the account-erasure procedure.
2. Read `<listing_28>` from the public listing API.

**Expected Results:**

* `<listing_28>` has no leader and no current bid.
* The next bid must reach 20000 minor units (HKD 200.00), the opening price.
* customer A's maximum appears nowhere on `<listing_28>`.

### grade10-site-auction-auction-US13-TC3-1: Erasing a bidder re-prices the lot from the maxima left, never upward

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
* **Trace:** grade10-site-auction-auction-US-13

**Pre-conditions:**

* `<listing_32>` is open inside its window, with the row's maxima committed in the order given, and Highest bid `<price before>`.
* The erased customer has no unpaid order or open fulfilment, so nothing stops the erasure.

**Test data:**

| Maxima, in the order committed | `<price before>` | Erased | Leader after | `<price after>` |
| --- | --- | --- | --- | --- |
| customer A 20000, customer B 15000, customer C 12000 | 15500 | customer B | customer A | 12500, customer C's maximum plus 500 |
| customer A 20000 raised to 50000 after customer B 19800, customer C 10000 | 20000 | customer C | customer A | 20000, unchanged: customer B's maximum plus 500 is 20300, above `<price before>` |
| customer A 20000, customer B 15000, customer C 11000 | 15500 | customer C | customer A | 15500, unchanged, on the same bid |
| customer A 20000, customer B 15000 | 15500 | customer A | customer B | 10000, the opening price |

| Field | Value |
| --- | --- |
| `<listing_32>` | An open USD listing, opening price 10000 minor units (USD 100.00), scheduled close more than an hour away; every amount above is in USD minor units |
| Increment | 500 minor units (USD 5.00), the USD 100 tier, at every next maximum above |

**Steps:**

1. Read `<listing_32>` from the public listing API, noting its scheduled close.
2. Erase the row's erased customer's account through the account-erasure procedure.
3. Read `<listing_32>` from the public listing API.

**Expected Results:**

* Step 1 reads Highest bid `<price before>`.
* Step 3 reads Highest bid `<price after>`, led by the row's leader after.
* Step 3's Highest bid is never above `<price before>`.
* Step 3's scheduled close is the one noted at step 1.
* The erased customer's maxima appear nowhere on `<listing_32>`.

---

## grade10-site-auction-auction-US14: Bidder reads why a bid was refused, and nothing else moves

**As a** bidder,
**I want** a refused bid to say why on the bid form and to leave no trace anywhere else,
**so that** I never read a bid I did not place as one I did.

### grade10-site-auction-auction-US14-TC1-1: A refused bid says why on the bid form and places nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer(card linked, account in the row's state) is signed in and on the lot page for `<listing_29>`.
* customer holds no bid on `<listing_29>` and does not watch it.
* `<listing_29>` is in the row's lot state.

**Test data:**

| Refused when | Account state | Lot state | Amount entered | The bid form says |
| --- | --- | --- | --- | --- |
| Below the next minimum | In good standing | Open, minimum next bid `<next minimum>` | 512900 minor units (HKD 5,129), one major unit below `<next minimum>` | Minimum bid is, naming `<next minimum>` |
| Above the currency's ceiling | In good standing | Open | 8000000100 minor units (HKD 80,000,001.00), one major unit above the ceiling | Maximum bid is, naming the ceiling, HKD 80,000,000 |
| Bidding suspended on the account | Bidding suspended | Open | `<next minimum>` | Bidding is suspended on this account. Contact Us to resolve it. |
| Account banned from bidding | Banned from bidding | Open | `<next minimum>` | This account cannot bid. |
| After the close | In good standing | Past its effective close, its close not yet recorded, the page's live updates held back | `<next minimum>` | Your bid did not go through. |

| Field | Value |
| --- | --- |
| `<listing_29>` | An HKD listing led by customer B at `<current bid>`, bid count `<bid count>` |
| `<current bid>` | 505000 minor units (HKD 5,050.00) |
| `<next minimum>` | 513000 minor units (HKD 5,130.00), `<current bid>` plus its 8000 increment |
| `<bid count>` | 3 |

**Steps:**

1. Enter the row's amount entered in the custom maximum on the bid panel.
2. Place the bid.
3. Read the bid form.
4. Reload the lot page and read Highest bid, the bid count, Recent Bids and the bid panel's standing.
5. Navigate to `<my auctions url>` and look for `<listing_29>`.
6. Navigate to `<grade10 bids url>` and look for `<listing_29>`.

**Expected Results:**

* Step 3 shows the row's words on the bid form.
* Step 4 reads Highest bid `<current bid>`, bid count `<bid count>`, and Recent Bids as before, with no row for the customer.
* Step 4 shows no Leading or Outbid standing for the customer.
* Step 5 shows no row for `<listing_29>`.
* Step 6 shows no entry for `<listing_29>`.

### grade10-site-auction-auction-US14-TC2-1: A rival's refused bid moves nothing for the leader

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer A leads `<listing_30>` at `<current bid>`, and is signed in on the lot page.
* customer B(card linked, no bid on `<listing_30>`) is signed in on a separate session, on the same lot page.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_30>` | An open HKD listing led by customer A, maximum 800000 minor units (HKD 8,000.00) |
| `<current bid>` | 505000 minor units (HKD 5,050.00) |
| `<below minimum>` | 512900 minor units (HKD 5,129), one major unit below `<current bid>` plus its 8000 increment |

**Steps:**

1. As customer B, enter `<below minimum>` in the custom maximum and place the bid.
2. As customer A, read Highest bid, Recent Bids and the bid panel's standing, without reloading.
3. As customer A, navigate to `<my auctions url>` and read `<listing_30>`'s row.
4. As customer A, read their mailbox for a letter about `<listing_30>` sent after step 1.

**Expected Results:**

* Step 1 is refused on customer B's bid form.
* Step 2 reads Highest bid `<current bid>`, Recent Bids unchanged, and customer A still Leading.
* Step 3's row reads Leading, with Current bid `<current bid>`.
* Step 4 finds no new-bid or outbid letter.

### grade10-site-auction-auction-US14-TC3-1: A bid whose answer is lost reads by the bidder's standing

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
* **Trace:** grade10-site-auction-auction-US-14

**Pre-conditions:**

* customer(card linked) is signed in and on the lot page for `<listing_31>`, holding the row's standing before the bid.
* The network is manipulated to drop the bid at the row's point.

**Test data:**

| Standing before | Bid sent | Dropped | The bid form reads | Standing after |
| --- | --- | --- | --- | --- |
| No bid | A first maximum of `<maximum>` | The answer, after the auction accepts the bid | Placed, Leading with Your maximum `<maximum>` | Leading, Your maximum `<maximum>`, a row on My Auctions |
| No bid | A first maximum of `<maximum>` | The request, before the auction receives it | Could not place this bid. | No bid, no row on My Auctions |
| Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The answer, after the auction accepts the raise | Placed, Leading with Your maximum `<raised maximum>` | Leading, Your maximum `<raised maximum>` |
| Leading, Your maximum `<maximum>` | A raise to `<raised maximum>` | The request, before the auction receives it | Could not place this bid. | Leading, Your maximum `<maximum>` |

| Field | Value |
| --- | --- |
| `<listing_31>` | An open HKD listing with no other bidder, starting price 20000 minor units (HKD 200.00) |
| `<maximum>` | 50000 minor units (HKD 500.00) |
| `<raised maximum>` | 80000 minor units (HKD 800.00) |

**Steps:**

1. Enter the row's bid in the custom maximum on the bid panel.
2. Place the bid.
3. Wait until the bid form settles.
4. Read the bid form.
5. Reload the lot page and read the bid panel's standing.
6. Navigate to `<my auctions url>` and look for `<listing_31>`.

**Expected Results:**

* Step 4 reads the row's words on the bid form, never both placed and refused.
* Step 5 reads the row's standing after.
* Step 6 agrees with the row's standing after.

## Settled

- The identity bar is enforced by the storefront before the auction receives a bid.
- A refused high-value bid creates neither an auction bid nor a card hold.
- A brand without an identity store has no identity bar.
- The first-bid minimum on a listing with no accepted bid is its opening price: the starting price, or the lowest increment on a 0 start; one increment above the current bid applies from the second bid (decisions Q19, Q27).
- A first bid of 0, or of one minor unit, on a 0 start is a non-goal; no case asserts either.
- The price a lone maximum stands at on a 0 start is auto-bidding's case, not this suite's.
- A valid bid in an extension case is placed by a bidder who does not lead, so it moves the price and restarts the timer; a leader raising their own maximum moves nothing, and is US12's case (decision Q5).
- Between the effective close and the recorded close, a lot takes no bid and names no result; the public status stays Active until the close is recorded (decision Q3).
- A bid at exactly the scheduled close counts on every listing, extension on or off; with no extension reach the effective close is one millisecond after the scheduled close (decision Q34).
- Between the effective close and the recorded close, a public read and a live update give the minimum next bid the lot had before its close: the opening price on a lot with no bid, else the current bid plus its tier increment. No bid at it counts, and no page offers it (decision Q3, `grade10-site/auction/bid-increments`).
- Progress advances by the progress control; on a small viewport stage previous/next and horizontal swipe also advance. CarouselProgress auto-play is allowed presentation, not a separate product rule for this change
- One Featured slide need not offer multi-dot advance or stage previous/next; progress may be absent or a single item
- A Featured lot that is no longer Active or Upcoming leaves the public Featured band at read time; the admin slot remains until cleared or replaced
- One lot may not occupy two Featured slots
- Signed-out watch on catalogue cards is owned by `grade10-site/auction/watchlist` (offer sign-in)
- An operator may replace a filled slot in place; clearing first is not required
- A slot missing lot or front page image is incomplete, may be saved in admin, and is not shown on `/auction`
- Nothing is held or charged on a card when a collector bids; no case reads a card authorization, a payment confirmation, an Authorizing state or a bid-time hold switch, and every case that did is deprecated or rewritten here (decisions Q1, Q3, Q5).
- A refused high-value bid creates no auction bid, no My Auctions row and no Bidding History entry.
- A refused attempt writes nothing the bidder reads beyond the bid form; its operational log is the operators' record, has no customer surface, and takes no case in this suite (decisions Q6, Q7).
- The refusal words for no linked card and for another card after the first accepted bid are `grade10-site/auction/bid-payment-method`'s cases; the bar's refusal is US4's; a maximum not above the bidder's own is the domain suite's `grade10-site-auction-e2e-US04-TC03-2`.
- An erasure is run by the account-erasure procedure, which has no console surface, so the erased-leader cases run at the API layer.
- Concurrent bids keep their case under US2, now that US3 is retired: the lot's lock judges each bid against what the one before it committed.
- A first bid whose answer is lost still bookmarks the lot and shows no alerts toast; the retry follow-on change brings the toast back (decisions Q15).
- Re-standing a lot after an erasure writes no letter to its new leader (decisions Q16).

## Reconciliation

Run: durable carry for add-account-identity-gate; the feature set, journey and suite were reconciled against the carried requirements.

- **Uncovered anchors:** none.

**Run:** QA2 rerun, 2026-10-01, for change `relay-auction-live-state`. Joined QA1's blind cases, redrafted from the re-frozen Purpose, Feature set and `user-journeys.md` with no flag, the change's `proposal.md`, `decisions.md` with `## Raised`, the linked pages under `docs/prds/`, the durable suite and the change's `domain-tcs.md`, with this delta's scenarios, `tech-design.md`, `tasks.md` and the built listing read in grade10. QA1 was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the archive.

| Finding | Disposition |
| --- | --- |
| US2-TC15-2: a first bid at the opening price is accepted, in each currency, a start below the lowest increment included | **Folded in:** `grade10-site-auction-auction-SC-62` (Q19). QA2 added the next-minimum step its AND clause asserts |
| US2-TC16-2: a first bid one minor unit below the opening price is refused, naming it | **Folded in:** `grade10-site-auction-auction-SC-64`, `grade10-site-auction-auction-SC-63`; the 0-start rows bid 99 rather than 1, the same partition |
| US2-TC17-1, US2-TC18-1: the first bid must reach the starting price plus its increment | **Rejected:** Q19, Q27 - the first bid meets the opening price; both stay `deprecated` |
| US11-TC1-1: a payment confirmed before the effective close counts, at the scheduled close with extension off included | **Folded in:** `grade10-site-auction-auction-SC-69`, `grade10-site-auction-auction-SC-21`, `grade10-site-auction-auction-SC-83` (Q34). QA2 added the close with customer A winning that SC-83 asserts |
| US11-TC2-1: a payment confirmed at or after the effective close loses, its hold released, "Your bid did not go through." alone | **Folded in:** `grade10-site-auction-auction-SC-67`; the words are `grade10-site-auction-listing-page-SC-45` (Q13) |
| US11-TC3-1: a lone first bid still confirming at the scheduled close leaves the lot unsold | **Folded in:** `grade10-site-auction-auction-SC-68`; Ended with No bids is `grade10-site-auction-listing-page-SC-46` |
| US11-TC4-1: with holds off a bid counts when placed | **Folded in:** `grade10-site-auction-auction-SC-86` |
| US11-TC5-1: no bid counts at or after the effective close, under a cap, no cap, a cap of 0 and extension off, while the close is unrecorded | **Folded in:** `grade10-site-auction-auction-SC-85`, `grade10-site-auction-auction-SC-87`, `grade10-site-auction-auction-SC-74`, `grade10-site-auction-auction-SC-05` (Q14, Q34) |
| US11-TC6-1: a cap of 0 closes the lot at its scheduled close | **Folded in:** `grade10-site-auction-auction-SC-84`; the refused bid after it is TC5-1's cap-0 rows |
| US11-TC7-1: a due lot is recorded closed at its close, and its close lag is read | **Folded in:** `grade10-site-auction-auction-SC-70` for the close. **Rejected** for the lag: it is the proposal's metric, emitted as `auction.close.lag_ms` (`tech-design.md`, task 5.5), not something a collector meets. QA2 dropped the lag step |
| US11-TC8-1: a lot whose alarm missed is settled by a read after it answers, else by the sweep | **Folded in:** `grade10-site-auction-auction-SC-71`, `grade10-site-auction-auction-SC-72` |
| US11-TC9-2: a lot no page has open is recorded closed at its close, sold or unsold | **Folded in:** `grade10-site-auction-auction-SC-70` |
| US11-TC10-1: public reads give the close terms and the service's time | **Folded in:** `grade10-site-auction-auction-SC-80`; the terms are durable `grade10-site-auction-auction-SC-13`. QA2 added the second read SC-80 asserts |
| US11-TC11-1: a leader's raise confirmed after the close loses, its hold released, the earlier lead and hold kept | **Folded in:** `grade10-site-auction-auction-SC-67` and the requirement's Confirms table; the kept hold is durable One hold per bidder |
| US12-TC1-1: equal maxima at a higher price extend | **Folded in:** `grade10-site-auction-auction-SC-82` (Q5) |
| US12-TC2-1: a leader raising their own maximum leaves the close | **Folded in:** `grade10-site-auction-auction-SC-81` (Q5) |
| QA1 raised: between the effective close and the recorded close, what minimum next bid does the public read give? | **Settled by the artifacts:** `grade10-site/auction/bid-increments` takes the minimum from the amount being beaten, whatever the window, and the built read and live frame publish it unchanged; rule 7 and `grade10-site-auction-auction-SC-74` count no bid at it; the lot page shows Closed with its bid controls disabled and My Auctions drops it (`grade10-site-auction-account-record-SC-65`). Written to `## Settled`; no case asserts the raw value |
| `grade10-site-auction-auction-SC-73`: two settles at once close the lot once | **Out of suite:** a race no walk can time; task 5.1's settle tests in grade10 decide it |
| `grade10-site-auction-auction-SC-75`: an older update or read does not replace a newer one | **Out of suite:** a race no walk can time; tasks 3.1 and 7.1, the version triggers and `higherVersion` tests in grade10, decide it |
| `grade10-site-auction-auction-SC-76`, `grade10-site-auction-auction-SC-77`: live updates carry only public facts; a page with no live line catches up by polling | **Out of suite:** `grade10-site-auction-listing-page-US12-TC6-1` and `grade10-site-auction-listing-page-US12-TC3-1` walk them on the lot page; task 6.1's frame tests hold the payload |
| `grade10-site-auction-auction-SC-79`: a lot called off while pages are open leaves them | **Out of suite:** no journey walks a call-off; task 7.1's `gone` frame test and task 6.1's frame tests in grade10 decide it |
| Unchanged window scenarios restated by the modified block - `SC-04`, `SC-07`, `SC-07a`, `SC-07b`, `SC-08`, `SC-19`, `SC-20`, `SC-22`, `SC-23a`, `SC-24` | **Out of suite:** the durable suite's US2-TC5-1 to US2-TC14-1; this change does not alter what they verify |

- **Covered at domain** — `grade10-site-auction-e2e-US07-TC03-2` walks `grade10-site-auction-auction-SC-06`: a price-moving bid in extended bidding restarts the close
- **Covered at domain** — `grade10-site-auction-e2e-US07-TC04-1` walks `grade10-site-auction-auction-SC-65` and `grade10-site-auction-auction-SC-66`: the card moves with a bid and counts to the new close
- **Covered at domain** — `grade10-site-auction-e2e-US12-TC02-1` walks `grade10-site-auction-auction-SC-88`: the card shows its closed state with no result, then the result, without a reload

**Uncovered anchors:** none. `grade10-site-auction-auction-US-02`, `-US-11` and `-US-12` each have their cases, and the `Catalogue`, `Closing a due lot`, `Live relay` and `Public contract` groups are walked here, at domain or by the tests named above.

**Run:** Blind suite from `.round/blind-input` (Purpose/Feature set, journeys, proposal, decisions, ui-design without scenario dispositions, PRD Catalogue/Featured excerpts, existing site feature-tcs with Reconciliation stripped). Denied: `openspec/specs/` requirements, archive, and any `## Requirements`. Scenario pass read `.round/scenario-input` including durable site requirements and tech-design; denied all feature-tcs and blind drafts.

### Raised, folded
- Empty All auctions with Featured still present → `grade10-site-auction-auction-SC-41`
- Catalogue address `/auction` with no category query → `grade10-site-auction-auction-SC-42`
- Featured absent when no complete eligible slide (including Ended-at-read) → `grade10-site-auction-auction-SC-30`
- Incomplete slot not shown → `grade10-admin-auction-featured-SC-02` (site coverage via SC-30)
- Same lot in two slots refused → `grade10-admin-auction-featured-SC-06`
- Replace in place → stated on fill requirement; covered by fill scenarios
- View Auction on Upcoming Featured → `grade10-site-auction-auction-SC-58`
- Bid rolls only on increase after first paint → `grade10-site-auction-auction-SC-32`
- All auctions infinite scroll and load-more skeletons → `grade10-site-auction-auction-SC-59`, `SC-60`
- Upcoming hides money on Featured and All auctions → `grade10-site-auction-auction-SC-33`, `SC-61`

### Raised, rejected
- Auto-advance as a required product behaviour — journey and decisions name collector advance (progress; on small viewports stage previous/next or swipe); auto-play is CarouselProgress presentation only
- Signed-out watch behaviour on All auctions cards — already required by `grade10-site/auction/watchlist`; not restated here

### Uncovered anchors
- **Out of suite:** signed-out watch from catalogue — `grade10-site/auction/watchlist` feature suite (`grade10-site-auction-watchlist-SC-04`)

**Run:** QA2, 2026-10-03. QA1's blind pass read the capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, `proposal.md`, `decisions.md`, the linked pages under `docs/prds/`, and the durable suite and the change's domain draft with `## Reconciliation` stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read QA1's suites, the delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites on main after `my-auctions-without-bid-holds` was accepted, and grade10 main's bidding, history, erasure and refusal-copy code and tests. It is a statement, not proof.

- **Folded in** - `grade10-site-auction-auction-SC-23` by `grade10-site-auction-auction-US2-TC5-2`; `grade10-site-auction-auction-SC-10`, moved to `grade10-site-auction-auction-US-02` with grade10-site-auction-auction-US-03 retired, by `grade10-site-auction-auction-US2-TC19-1`; `grade10-site-auction-auction-SC-86` by `grade10-site-auction-auction-US11-TC4-1`; `grade10-site-auction-auction-SC-16` by `grade10-site-auction-auction-US4-TC2-2`; `grade10-site-auction-auction-SC-89` by the first row of `grade10-site-auction-auction-US14-TC1-1`; `grade10-site-auction-auction-SC-90` by `grade10-site-auction-account-record-US2-TC6-1` and `grade10-site-auction-bidding-history-US1-TC7-1`; `grade10-site-auction-auction-SC-91` by the rows of `grade10-site-auction-auction-US14-TC1-1`, with the card refusals in `grade10-site-auction-bid-payment-method-US1-TC8-1` and `grade10-site-auction-bid-payment-method-US1-TC9-1` and the bar in `grade10-site-auction-auction-US4-TC2-2`; `grade10-site-auction-auction-SC-94` and `grade10-site-auction-auction-SC-95` by `grade10-site-auction-auction-US14-TC3-1`; `grade10-site-auction-auction-SC-96` by `grade10-site-auction-auction-US13-TC1-1`; `grade10-site-auction-auction-SC-101` by `grade10-site-auction-auction-US13-TC2-1`
- **Covered at domain** - `grade10-site-auction-e2e-US04-TC03-2` reads the bid form's words for a maximum not raised, the row of `grade10-site-auction-auction-SC-91` this suite leaves to it
- **Added by QA2** - `grade10-site-auction-auction-US13-TC3-1`, one row each for `grade10-site-auction-auction-SC-97`, `grade10-site-auction-auction-SC-98`, `grade10-site-auction-auction-SC-99` and `grade10-site-auction-auction-SC-100`: erasing a bidder who is not the leader, a leader whose maximum outgrew the price, and one maximum left. It also reads that the scheduled close does not move. No blind case erased anyone but the leader
- **Corrected** - `grade10-site-auction-auction-US13-TC2-1` read only that Highest bid is never above the price before; `grade10-site-auction-auction-SC-101` states no leader and no current bid, with the next bid at the opening price, and the case reads that. `grade10-site-auction-auction-US2-TC19-1` traced the Feature set group Card on file; it traces `grade10-site-auction-auction-US-02`
- **Revised** - `grade10-site-auction-auction-US2-TC5-2`, `grade10-site-auction-auction-US4-TC1-2` and `grade10-site-auction-auction-US4-TC2-2` stop reading a hold, so they move up a revision and back to draft. `grade10-site-auction-auction-US2-TC15-2`, `grade10-site-auction-auction-US2-TC16-2`, `grade10-site-auction-auction-US11-TC4-1`, `grade10-site-auction-auction-US11-TC5-1`, `grade10-site-auction-auction-US12-TC1-1` and `grade10-site-auction-auction-US12-TC2-1` lose the hold switch pre-condition only, a draft restyle with `<v>` kept
- **Deprecated** - every `grade10-site-auction-auction-US3` case, with its journey; `grade10-site-auction-auction-US11-TC1-1`, `grade10-site-auction-auction-US11-TC2-1`, `grade10-site-auction-auction-US11-TC3-1` and `grade10-site-auction-auction-US11-TC11-1`, which read a payment confirming around the close
- **Raised, answered** - Q15: a first bid whose answer is lost still bookmarks the lot, with no alerts toast. Q16: re-standing a lot after an erasure writes no letter to its new leader. Both as grade10 runs, recommended; answers in `## Settled`
- **Settled by the artifacts** - a refused attempt on a lot later sold leaves that collector reading as a non-bidder (Q6); an erasure never moves the close (the erasure requirement's rule 6); the refusal log names the floor or the ceiling the refusal names (the refusal requirement)
- **Out of suite** - `grade10-site-auction-auction-SC-92` and the invalid-amount row, which the bid form checks before sending, and the refusal order of `grade10-site-auction-auction-SC-91`: grade10's `bidRefusalCopy.test.ts` and `usePlaceBid.test.tsx`, since a person cannot make the auction send its own words or several refusals at once. `grade10-site-auction-auction-SC-93`: the operational log has no customer surface; grade10's refusal-log test, task 2.1. `grade10-site-auction-auction-SC-102`: grade10's `eraseBidder.spec.ts`, since the re-stood lot must then reach its close
- **Reworded** - `grade10-site-auction-auction-SC-04` and `grade10-site-auction-auction-SC-08` lose the card authorization from what they assert, "no accepted bid or card authorization" reading "no bid" and "card authorization facts" reading "card facts", with the same meaning; their coverage is as on main
- **Retired** - grade10-site-auction-auction-SC-67, grade10-site-auction-auction-SC-68 and grade10-site-auction-auction-SC-69, a payment confirming around the close, leave "A bid counts when it is accepted" (Q3); grade10-site-auction-auction-SC-09, grade10-site-auction-auction-SC-11, grade10-site-auction-auction-SC-12, grade10-site-auction-auction-SC-14 and grade10-site-auction-auction-SC-15 retire with their removed requirements. No retired id is reissued
- **Contradicted** - none
- **Uncovered anchors** - none. The window and settle scenarios changed only in their hold wording and their Serves lines, and the durable `grade10-site-auction-auction-US2` and `grade10-site-auction-auction-US11` cases still assert them; `grade10-site-auction-auction-SC-73` stays out of suite as main records
