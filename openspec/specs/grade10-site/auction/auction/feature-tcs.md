# grade10-site/auction/auction Test Cases

**Status:** reopened
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-10-02
**Drafts styled:** 2026-10-01, tcs-rules r4

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

## grade10-site-auction-auction-US2: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

<!-- trace:case id=g10.auction-auction.TC-b19 rev=1 covers=g10.auction-auction.SC-jsr,g10.auction-auction.SC-5ao,g10.auction-auction.SC-2js,g10.auction-auction.SC-p70,g10.auction-auction.SC-n8w,g10.auction-auction.SC-z62,g10.auction-auction.SC-dnt,g10.auction-auction.SC-a33,g10.auction-auction.SC-cib,g10.auction-auction.SC-z5s,g10.auction-auction.SC-h4d,g10.auction-auction.SC-ch5,g10.auction-auction.SC-bz7,g10.auction-auction.SC-t3k -->
### grade10-site-auction-auction-US2-TC5-1: The default bid path creates no authorization hold

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, release
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* Bid-time authorization holds are disabled.
* A collector is signed in on an open listing with a valid linked card.

**Steps:**

1. Submit a valid bid on the open listing.
2. Read the bid result.

**Expected Results:**

* Grade10 accepts the bid according to the listing's bid rules without waiting for Stripe.

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

* Bid-time authorization holds are disabled.
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

* Bid-time authorization holds are disabled.
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
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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
* **Status:** actual
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
**so that** my card is not held for a bid the auction cannot take, and I can verify and bid again before the lot closes.

<!-- trace:case id=g10.auction-auction.TC-zsd rev=1 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-d78,g10.auction-auction.SC-ndj -->
### grade10-site-auction-auction-US4-TC1-1: Verified bidder's bid at the bar is forwarded as any other

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
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

**Expected Results:**

* The bid is forwarded and accepted as any other — no refusal names a verified identity.
* Highest bid reads `<bid at the bar>`, and one hold for it stands against `<card>`.

<!-- trace:case id=g10.auction-auction.TC-5gi rev=1 covers=g10.auction-auction.SC-uhh,g10.auction-auction.SC-d78,g10.auction-auction.SC-ndj -->
### grade10-site-auction-auction-US4-TC2-1: Bidder without a verified standing is held at the storefront at and above the bar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-auction-US-04

**Pre-conditions:**

* The user is signed in with `<card>` saved on an account whose standing is the one the row names, and is on `<listing_12>`.
* `<listing_12>` is live, inside its window, and its minimum next bid is `<bar>`.

**Test data:**

| Standing | Bid amount | Outcome |
| --- | --- | --- |
| `unverified` | 12000000 minor units (HKD 120,000.00), exactly `<bar>` | Refused; no bid recorded, no hold taken |
| `unverified` | 12500000 minor units (HKD 125,000.00), any bid above `<bar>` | Refused; no bid recorded, no hold taken |
| `expired` | 12000000 minor units (HKD 120,000.00), exactly `<bar>` | Refused; no bid recorded, no hold taken |
| `expired` | 12500000 minor units (HKD 125,000.00), any bid above `<bar>` | Refused; no bid recorded, no hold taken |

**Steps:**

1. Enter the bid amount the row names in the bid field and select **Place Bid**.
2. Read the refusal.
3. Reload `<listing_12>` and read Highest bid and the bid count.

**Expected Results:**

* The bid is refused as needing a verified identity, and the refusal says to verify from the account.
* Highest bid and the bid count are unchanged — the auction records no bid.
* No hold is taken against `<card>`.

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
**I want** the catalogue to lead with the lots I can bid on, soonest to close
first, and to keep that order as I read on,
**so that** what I can still bid on is in front of me and reading further never
shows me a lot twice or skips one.

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

---

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
* **Status:** draft
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
| US11-TC2-1: a payment confirmed at or after the effective close loses, its hold released, "Your bid did not go through." alone | **Folded in:** `grade10-site-auction-auction-SC-67`; the words are `grade10-site-auction-listing-page-SC-39` (Q13) |
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
