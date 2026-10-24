# grade10-site/auction/lot-status Test Cases

**Status:** reopened · 2/5
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* A collector sees one lot status: Upcoming before bidding starts, Active while bids are taken, extended bidding included, and Ended after the close, whatever happened to the order. A winner's order status shows apart from it.
* Drafts and called-off lots are hidden from the catalogue, its search and the watchlist; only a collector who bid on a called-off lot still finds it, on My Auctions.

## g10.auction-lot-status.US1: Collector sees whether a listing can still be bid on

**As a** collector,
**I want** every listing to show whether it is Upcoming, Active or Ended,
**so that** I can see at a glance whether I can still bid on it.

<!-- trace:case id=g10.auction-lot-status.TC-3wx rev=1 -->
### g10.auction-lot-status.US1-TC1: Every page reads the same lot status for the lot's moment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-01

**Pre-conditions:**

* customer(signed in) watches `<listing>`, which is `<moment>`.

**Test data:**

| `<moment>` | `<status>` |
| --- | --- |
| published, its start still ahead | Upcoming |
| open for bids | Active |
| past its scheduled close, in extended bidding | Active |
| closed with no winner | Ended |
| won, its order Preparing Shipment | Ended |

**Steps:**

1. Read `<listing>`'s card on `<g10url>/auction`, its page, and its row on My Auctions.

**Expected Results:**

* All three read `<status>`.

<!-- trace:case id=g10.auction-lot-status.TC-bfm rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->
### g10.auction-lot-status.US1-TC2: A winner reads the order status apart from the lot status

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-01

**Pre-conditions:**

* customer(signed in) won `<listing>`, whose order reads Pending Payment.

**Steps:**

1. Open `<listing>`'s page, then My Auctions.

**Expected Results:**

* The page reads Ended; My Auctions reads Won, Pending Payment, never Pending Payment as the lot's status.

---

## g10.auction-lot-status.US2: Collector does not find draft or called-off listings in browse or search

**As a** collector,
**I want** draft listings and called-off listings absent from browse, search and my watchlist,
**so that** I do not mistake an unfinished or withdrawn listing for an available auction.

<!-- trace:case id=g10.auction-lot-status.TC-22a rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-w9d,g10.auction-lot-status.SC-3yw -->
### g10.auction-lot-status.US2-TC1: A draft or called-off lot is nowhere a collector browses, and its address shows nothing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lot-status.spec.ts`

**Pre-conditions:**

* customer(signed in) holds `<listing>`'s former address and code; no other listing has taken its slug; `<listing>` is `<state>`.

**Test data:**

| `<state>` |
| --- |
| a draft, never published |
| called off after customer watched it |

**Steps:**

1. Read `<g10url>/auction` and search it for `<listing>`'s title.
2. Open the watchlist.
3. Open the former address, then `<g10url>/auction/listings/<code>` with the code in upper and in lower case.

**Expected Results:**

* Steps 1 and 2 never list `<listing>`.
* Step 3 shows Nothing is here each time.

<!-- trace:case id=g10.auction-lot-status.TC-wlb rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->
### g10.auction-lot-status.US2-TC2: An unsold lot stays on the watchlist after its close

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* customer(signed in) watches `<listing>`, which closed with no bid.

**Steps:**

1. Open the watchlist.

**Expected Results:**

* `<listing>` is listed, Ended.

---

## g10.auction-lot-status.US3: Bidder sees what happened to a called-off listing

**As a** bidder,
**I want** a called-off listing I bid on to stay in My Auctions,
**so that** I can see my card was not charged.

<!-- trace:case id=g10.auction-lot-status.TC-byf rev=3 covers=g10.auction-lot-status.SC-yoe,g10.auction-lot-status.SC-cmh -->
### g10.auction-lot-status.US3-TC1: Only a collector who bid still finds a called-off lot, on My Auctions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-03

**Pre-conditions:**

* customer A bid on `<listing>` and customer B only watched it; an operator then called it off.

**Steps:**

1. As customer A, open My Auctions.
2. As customer B, open My Auctions and the watchlist.

**Expected Results:**

* Step 1 lists `<listing>`, Didn't win, the card not charged.
* Step 2 lists it nowhere.
