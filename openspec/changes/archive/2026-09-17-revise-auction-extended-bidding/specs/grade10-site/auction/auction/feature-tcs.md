# grade10-site/auction/auction Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-site-auction-auction-US1: Collector browses Auction listings

**As a** collector,
**I want** the catalogue to show Auction listings with money in minor units,
**so that** I am not offered Buy Now and a close with bids is absolute.

### grade10-site-auction-auction-US1-TC1-2: Public listing read exposes the close and extension policy

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
* **Trace:** grade10-site-auction-auction-US-01

**Pre-conditions:**

* `<listing_1>` is published.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_1>` | A published listing with extension duration 1800 seconds and an extension cap of 3600 seconds |

**Steps:**

1. Read the public listing contract for `<listing_1>`.

**Expected Results:**

* It carries the scheduled close, the recorded close, the extension duration and the extension cap.
* It carries no extension window.
* It carries no reserve state.

---

## grade10-site-auction-auction-US2: Collector places a card-backed bid inside the window

**As a** bidder,
**I want** a lot I bid on by its close to stay open until bidding stops,
**so that** a bid placed at the last second can always be answered, up to the lot's cap.

### grade10-site-auction-auction-US2-TC1-2: Bid during extended bidding restarts the timer

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
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
| `<extension duration>` | 1800 seconds |
| `<close before bids>` | 20:30 UTC |
| `<first bid time>` | 20:10 UTC |
| `<second bid time>` | 20:35 UTC |

**Steps:**

1. Submit a valid bid at `<first bid time>`.
2. Read the recorded close.
3. Submit a valid bid at `<second bid time>`.
4. Read the recorded close.

**Expected Results:**

* Step 2 reads `<first bid time>` plus `<extension duration>`.
* Step 4 reads `<second bid time>` plus `<extension duration>`.

### grade10-site-auction-auction-US2-TC2-2: Extension cap holds the timer at the cap

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
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_3>` is in extended bidding and its recorded close is its scheduled close plus `<extension cap>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | A listing in extended bidding whose recorded close already stands at its cap |
| `<extension cap>` | 3600 seconds |

**Steps:**

1. Submit a valid bid.
2. Read the recorded close.
3. Wait until the recorded close passes.

**Expected Results:**

* The bid is accepted and the recorded close is unchanged.
* The listing closes at its scheduled close plus `<extension cap>`.

### grade10-site-auction-auction-US2-TC3-2: Listing's own duration sets how long extended bidding runs

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
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_4>` is open with one accepted bid.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | An open listing, scheduled close `<scheduled close>`, extension duration `<short duration>` |
| `<scheduled close>` | 20:00 UTC |
| `<short duration>` | 300 seconds |

**Steps:**

1. Wait for `<scheduled close>`.
2. Read the recorded close.

**Expected Results:**

* The listing is in extended bidding.
* The recorded close reads `<scheduled close>` plus `<short duration>`.

### grade10-site-auction-auction-US2-TC4-2: Extension off closes the listing at its scheduled close

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
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* `<listing_5>` is open with an accepted bid and extension duration 0.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | An open listing with an accepted bid, extension duration 0 seconds |

**Steps:**

1. Wait for the scheduled close.
2. Read the listing's state and recorded close.

**Expected Results:**

* The listing is closed at its scheduled close.
* It never entered extended bidding.

### grade10-site-auction-auction-US2-TC10-1: Bids by the close decide whether extended bidding starts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
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

* `<listing_6>` is open with scheduled close 20:00 UTC and extension duration 1800 seconds.
* `<listing_6>` holds the row's accepted bids.

**Test data:**

| Accepted bids by 20:00 UTC | Grade10 |
| --- | --- |
| None | Closes the listing at 20:00 UTC |
| One | Recorded close becomes 20:30 UTC; with no further bid the listing closes at 20:30 UTC |

**Steps:**

1. Wait for 20:00 UTC.
2. Read the listing's state and recorded close.
3. Wait until 20:30 UTC with no bid.
4. Read the listing's state.

**Expected Results:**

* Grade10 answers as the row states.

### grade10-site-auction-auction-US2-TC6-1: When a bid lands against the scheduled close

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

* `<listing_7>` is open with no accepted bid, scheduled close 20:00:00 UTC, and extension duration 1800 seconds.

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

### grade10-site-auction-auction-US2-TC7-1: Each listing runs its own timer

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

* `<listing_8>` and `<listing_9>` are both in extended bidding with recorded close 20:30 UTC.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A listing with scheduled close 20:00 UTC, in extended bidding, extension duration 1800 seconds |
| `<listing_9>` | A second listing in the same state as `<listing_8>` |

**Steps:**

1. Submit a valid bid on `<listing_8>` at 20:10 UTC.
2. Read both recorded closes.

**Expected Results:**

* `<listing_8>` reads 20:40 UTC.
* `<listing_9>` still reads 20:30 UTC.

### grade10-site-auction-auction-US2-TC8-1: Collector with no earlier bid bids during extended bidding

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
* **Trace:** grade10-site-auction-auction-US-02

**Pre-conditions:**

* customer(no bid on `<listing_2>`, card saved) is signed in and on `<listing_2>`.
* `<listing_2>` is in extended bidding.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A listing past its scheduled close, in extended bidding, extension duration `<extension duration>`, no cap |
| `<extension duration>` | 1800 seconds |

**Steps:**

1. Submit a bid at the minimum next bid.
2. Read Time left.

**Expected Results:**

* The bid is accepted.
* The close moves to `<extension duration>` after that bid.

### grade10-site-auction-auction-US2-TC9-1: Bid after extended bidding ends is refused

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
