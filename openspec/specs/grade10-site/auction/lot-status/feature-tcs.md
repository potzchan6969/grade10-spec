# grade10-site/auction/lot-status Test Cases

**Status:** reopened · 2/6
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

## Background

* `<auction url>` is the Grade10 auction catalogue and `<my auctions url>` the signed-in account's My Auctions page; a listing's page opens from its card.

## g10.auction-lot-status.US1: Collector sees whether a listing can still be bid on

**As a** collector,
**I want** every listing to show whether it is Upcoming, Active or Ended,
**so that** I can see at a glance whether I can still bid on it.

<!-- trace:case id=g10.auction-lot-status.TC-3wx rev=1 -->
### g10.auction-lot-status.US1-TC1: Each listing reads the status its schedule and close give it

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

* customer(signed in) watches `<listing>` and is on `<auction url>`.
* `<listing>` is in the state `<listing state>`.

**Test data:**

| `<listing state>` | `<status>` |
| --- | --- |
| Published, its start still ahead | Upcoming |
| Published and open for bids | Active |
| Closed with no winner | Ended |
| Won, its order Preparing Shipment | Ended |

| Field | Value |
| --- | --- |
| `<listing>` | A published listing in `<listing state>` |

**Steps:**

1. Find `<listing>`'s card on `<auction url>`.
2. Open `<listing>`'s page.
3. Open `<my auctions url>` and find `<listing>`.

**Expected Results:**

* Steps 1, 2 and 3 each read `<status>`.

<!-- trace:case id=g10.auction-lot-status.TC-bfm rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->
### g10.auction-lot-status.US1-TC2: A winner reads their order status apart from the listing status

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

* customer(winner of `<listing_4>`) is signed in.
* `<listing_4>`'s order is awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A listing this customer won, its order awaiting payment |

**Steps:**

1. Open `<my auctions url>` and read `<listing_4>`'s row.

**Expected Results:**

* The listing status reads Ended.
* Your Standing reads the order's own status.

---

## g10.auction-lot-status.US2: Collector does not find draft or called-off listings in browse or search

**As a** collector,
**I want** draft listings and called-off listings absent from browse, search and my watchlist,
**so that** I do not mistake an unfinished or withdrawn listing for an available auction.

<!-- trace:case id=g10.auction-lot-status.TC-22a rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-w9d,g10.auction-lot-status.SC-3yw -->
### g10.auction-lot-status.US2-TC1: A hidden listing is not in the catalogue or its search

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lot-status.spec.ts`

**Pre-conditions:**

* `<listing_6>` is in the state `<listing state>`, titled `<listing title>`.
* `<listing_7>` ended with no winner.

**Test data:**

| `<listing state>` |
| --- |
| A draft, never published |
| Published, then called off by an operator |

| Field | Value |
| --- | --- |
| `<listing_6>` | A listing in `<listing state>` |
| `<listing title>` | `<listing_6>`'s title |
| `<listing_7>` | A published listing whose bidding ended with no winner |

**Steps:**

1. Open `<auction url>` and read All auctions.
2. Search the catalogue for `<listing title>`.

**Expected Results:**

* Step 1 does not list `<listing_6>`, and lists `<listing_7>` as Ended.
* Step 2 does not find `<listing_6>`.

<!-- trace:case id=g10.auction-lot-status.TC-wlb rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->
### g10.auction-lot-status.US2-TC2: A called-off listing leaves the watchlist while an unsold one stays

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* customer(signed in) watches `<listing_8>` and `<listing_9>`.
* `<listing_8>` ended with no winner; `<listing_9>` was called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_8>` | A watched listing that ended with no winner |
| `<listing_9>` | A watched listing an operator called off |

**Steps:**

1. Open `<my auctions url>` and read the list.

**Expected Results:**

* `<listing_9>` is not in the list.
* `<listing_8>` is in the list, Ended.

<!-- trace:case id=g10.auction-lot-status.TC-7m2 rev=4 covers=g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-w9d -->
### g10.auction-lot-status.US2-TC4: A called-off listing's address and code show Nothing is here

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Pre-conditions:**

* customer(signed in) watched `<listing_12>` and saved its address and code before it was called off.
* No eligible listing holds `<listing_12>`'s slug.

**Test data:**

| `<code>` |
| --- |
| `<listing_12>`'s code in upper case |
| `<listing_12>`'s code in lower case |

| Field | Value |
| --- | --- |
| `<listing_12>` | A called-off listing this customer watched |
| `<listing title>` | `<listing_12>`'s title |
| `<former address>` | The address `<listing_12>` was published at |

**Steps:**

1. Open `<auction url>`, read its listings and search for `<listing title>`.
2. Open the watchlist and look for `<listing_12>`.
3. Open `<former address>`.
4. Open `<auction url>/listings/<code>`.

**Expected Results:**

* Step 1 neither lists nor finds `<listing_12>`.
* Step 2 does not include it.
* Steps 3 and 4 each show the not-found page titled "Nothing is here", with none of `<listing_12>`'s details or its code.

---

## g10.auction-lot-status.US3: Bidder sees what happened to a called-off listing

**As a** bidder,
**I want** a called-off listing I bid on to stay in My Auctions,
**so that** I can see my card was not charged.

<!-- trace:case id=g10.auction-lot-status.TC-byf rev=3 covers=g10.auction-lot-status.SC-yoe,g10.auction-lot-status.SC-cmh -->
### g10.auction-lot-status.US3-TC1: Only the bidder still sees a called-off listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-03

**Pre-conditions:**

* customer A bid on `<listing_14>`, and customer B watched it without bidding; both are signed in on separate sessions.
* `<listing_14>` was called off, and `<listing_15>` is now public at its former address.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_14>` | A called-off listing customer A bid on and customer B watched |
| `<listing_15>` | A public listing with a different title, at `<listing_14>`'s released address |

**Steps:**

1. As customer A, open `<my auctions url>` and read `<listing_14>`'s row, its history and its links.
2. As customer B, open `<my auctions url>`.

**Expected Results:**

* Step 1's row names `<listing_14>`, not `<listing_15>`, and says Your card was not charged.
* Step 1 keeps the original bids and history with `<listing_14>`, shows no card hold, release or authorization, and links nowhere to `<listing_15>`.
* Step 2 does not list `<listing_14>`.
