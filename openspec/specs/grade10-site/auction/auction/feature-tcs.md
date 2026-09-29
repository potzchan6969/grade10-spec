# grade10-site/auction/auction Test Cases

**Status:** reopened
**Drafts styled:** 2026-09-29, tcs-rules r4
**Reviewed:** 2026-09-25, tcs-rules r4, lapsed 2026-09-29

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
* **Status:** draft
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
* **Status:** draft
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
* **Status:** draft
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
* **Status:** draft
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

## Settled

- The identity bar is enforced by the storefront before the auction receives a bid.
- A refused high-value bid creates neither an auction bid nor a card hold.
- A brand without an identity store has no identity bar.

## Reconciliation

Run: durable carry for add-account-identity-gate; the feature set, journey and suite were reconciled against the carried requirements.

- **Uncovered anchors:** none.
