# grade10-site/auction/lot-status Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-site-auction-lot-status-US1: Collector sees whether a lot can still be bid on

**As a** collector,
**I want** a closed lot with a Preparing Shipment order to still read Ended,
**so that** the lot status stays separate from the winner's order status.

<!-- trace:case id=g10.auction-lot-status.TC-1ik rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->
### grade10-site-auction-lot-status-US1-TC1-1: Preparing Shipment maps to Ended

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-01

**Pre-conditions:**

* A closed lot with a winner whose order derives as Preparing Shipment.

**Steps:**

1. Read external lot status.

**Expected result:**

* External lot status is Ended.

<!-- trace:case id=g10.auction-lot-status.TC-bfm rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->
### grade10-site-auction-lot-status-US1-TC2-1: Winner sees their order status separately

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-01

**Pre-conditions:**

* customer(winner of <lot_1>) is signed in.
* The order for <lot_1> is awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_1> | A lot this customer won, order awaiting payment |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Read the row for <lot_1>.

**Expected Results:**

* The lot status is Ended.
* Your Standing shows the order status.

---

## grade10-site-auction-lot-status-US2: Collector does not find draft or called-off lots in browse or search

**As a** collector,
**I want** draft lots and called-off lots absent from browse, search and my watchlist,
**so that** I can use a called-off lot's original address directly without it appearing as an available auction.

<!-- trace:case id=g10.auction-lot-status.TC-22a rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-w9d,g10.auction-lot-status.SC-3yw -->
### grade10-site-auction-lot-status-US2-TC1-1: Hidden lots are not in the catalogue

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
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* <lot> is in the state the row names.
* <lot_5> ended with no winner.

**Test data:**

| <lot> |
| --- |
| A draft lot, never published |
| A published lot an operator called off |

| Field | Value |
| --- | --- |
| <lot_5> | A published lot whose bidding ended with no winner |

**Steps:**

1. Navigate to <grade10 auction catalogue url>.
2. Read the All auctions list.
3. Search the catalogue for the title of <lot>.

**Expected Results:**

* <lot> is not in All auctions.
* Search does not find <lot>.
* <lot_5> is in All auctions, status Ended.

<!-- trace:case id=g10.auction-lot-status.TC-wlb rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->
### grade10-site-auction-lot-status-US2-TC2-1: Called-off lot leaves the watchlist, unsold lot stays

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* customer(signed in) watches <lot_2> and <lot_3>.
* <lot_2> ended with no winner.
* <lot_3> was called off.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_2> | A watched lot whose bidding ended with no winner |
| <lot_3> | A watched lot an operator called off |

**Steps:**

1. Navigate to <grade10 my auctions url>.
2. Read the list.

**Expected Results:**

* <lot_3> is not in the list.
* <lot_2> is in the list, status Ended.

<!-- trace:case id=g10.auction-lot-status.TC-k90 rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->
### grade10-site-auction-lot-status-US2-TC3-1: Listing data leaves out called-off lots

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
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* `<lot_2>` ended with no winner, and a collector watches it.
* `<lot_3>` was called off, and that collector watches it.

**Test data:**

| Field | Value |
| --- | --- |
| lot_2 | A watched lot whose bidding ended with no winner |
| lot_3 | A watched lot an operator called off |

**Steps:**

1. Read the API response for the public listing data.

**Expected Results:**

* `<lot_3>` is not included.
* `<lot_2>` is included, external lot status Ended.

<!-- trace:case id=g10.auction-lot-status.TC-7m2 rev=1 covers=g10.auction-lot-status.SC-w9d -->
### grade10-site-auction-lot-status-US2-TC4-1: A called-off lot stays reachable at its canonical address

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
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* A published listing has canonical address `<listing_url>` and code `<listing_code>`.

**Steps:**

1. Call the listing off.
2. Search the catalogue and browse for the listing.
3. Open `<listing_url>` directly.
4. Try `<listing_code>` as an address.

**Expected Results:**

* Catalogue and search do not return the listing.
* `<listing_url>` still serves the public listing page.
* The listing code does not resolve as an address.
* The canonical URL and code remain reserved.

---

## grade10-site-auction-lot-status-US3: Bidder sees what happened to a called-off lot

**As a** bidder,
**I want** a called-off lot I bid on to stay in My Auctions,
**so that** I can see my card was not charged.

<!-- trace:case id=g10.auction-lot-status.TC-byf rev=2 covers=g10.auction-lot-status.SC-yoe -->
### grade10-site-auction-lot-status-US3-TC1-2: Only the bidder still sees a called-off lot

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
* **Trace:** grade10-site-auction-lot-status-US-03

**Pre-conditions:**

* customer A and customer B are signed in on separate sessions.
* customer A bid on <lot_4>.
* customer B watched <lot_4> and did not bid.
* <lot_4> was called off.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_4> | A lot customer A bid on and customer B watched, then called off |

**Steps:**

1. In customer A's session, navigate to <grade10 my auctions url>.
2. In customer B's session, navigate to <grade10 my auctions url>.

**Expected Results:**

* Step 1 lists <lot_4>, and the row says Your card was not charged.
* Step 1's row names no card hold, release or authorization.
* Step 2 does not list <lot_4>.

## Reconciliation

- **Covered:** mapping Preparing Shipment → Ended under
  `grade10-site-auction-lot-status-SC-04`'s requirement ← `US1-TC1-1`.
- **Raised:** none.

**Run:** 2026-10-07, QA2 for `clarify-auction-shipping-progress-copy`, appended to the durable reconciliation; earlier runs stand.

- **Covered:** mapping Preparing Shipment → Ended under
  `grade10-site-auction-lot-status-SC-04`'s requirement ← `US1-TC1-1`.
- **Raised:** none.
