# grade10-site/auction/lot-status Test Cases

**Status:** pending-review · 3/7
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector sees whether a lot can still be bid on

**Starting state:**

- Reset the fixture to each case's declared **Pre-conditions** before running it.

**Shared test data:**

- Use each case's declared **Test data**. No case depends on another case's result.

### Route

1. Read external lot status. `g10.auction-lot-status.US1-TC1`
2. Navigate to `<grade10 my auctions url>`. `g10.auction-lot-status.US1-TC2`
3. Read the row for `<lot_1>`. `g10.auction-lot-status.US1-TC2`

## Walk 2: Collector does not find draft or called-off lots in browse or search

**Starting state:**

- Reset the fixture to each case's declared **Pre-conditions** before running it.

**Shared test data:**

- Use each case's declared **Test data**. No case depends on another case's result.

### Route

1. Navigate to `<grade10 auction catalogue url>`. `g10.auction-lot-status.US2-TC1`
2. Read the All auctions list. `g10.auction-lot-status.US2-TC1`
3. Search the catalogue for the title of `<lot>`. `g10.auction-lot-status.US2-TC1`
4. Navigate to `<grade10 my auctions url>`. `g10.auction-lot-status.US2-TC2`
5. Read the list. `g10.auction-lot-status.US2-TC2`
6. Read the API response for the public listing data. `g10.auction-lot-status.US2-TC3`
7. Call the listing off. `g10.auction-lot-status.US2-TC4`
8. Search the catalogue and browse for the listing. `g10.auction-lot-status.US2-TC4`
9. Open `<listing_url>` directly. `g10.auction-lot-status.US2-TC4`
10. Try `<listing_code>` as an address. `g10.auction-lot-status.US2-TC4`

## Walk 3: Bidder sees what happened to a called-off lot

**Starting state:**

- Reset the fixture to each case's declared **Pre-conditions** before running it.

**Shared test data:**

- Use each case's declared **Test data**. No case depends on another case's result.

### Route

1. In customer A's session, navigate to `<grade10 my auctions url>`. `g10.auction-lot-status.US3-TC1`
2. In customer B's session, navigate to `<grade10 my auctions url>`. `g10.auction-lot-status.US3-TC1`

## g10.auction-lot-status.US1: Collector sees whether a lot can still be bid on

**As a** collector,
**I want** every lot to show whether it is Upcoming, Active or Ended,
**so that** I can see at a glance whether I can still bid on it.

`<!-- trace:case id=g10.auction-lot-status.TC-1ik rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->`
### g10.auction-lot-status.US1-TC1: Preparing Shipment maps to Ended

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

**Expected Results:**

* External lot status is Ended.

`<!-- trace:case id=g10.auction-lot-status.TC-bfm rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->`
### g10.auction-lot-status.US1-TC2: Winner sees their order status separately

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

* customer(winner of `<lot_1>`) is signed in.
* The order for `<lot_1>` is awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_1>` | A lot this customer won, order awaiting payment |

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Read the row for `<lot_1>`.

**Expected Results:**

* The lot status is Ended.
* Your Standing shows the order status.

---

## g10.auction-lot-status.US2: Collector does not find draft or called-off lots in browse or search

**As a** collector,
**I want** draft lots and called-off lots absent from browse, search and my watchlist,
**so that** I can use a called-off lot's original address directly without it appearing as an available auction.

`<!-- trace:case id=g10.auction-lot-status.TC-22a rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-w9d,g10.auction-lot-status.SC-3yw -->`
### g10.auction-lot-status.US2-TC1: Hidden lots are not in the catalogue

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lot-status.spec.ts`

**Pre-conditions:**

* `<lot>` is in the state the row names.
* `<lot_5>` ended with no winner.

**Test data:**

| `<lot>` |
| --- |
| A draft lot, never published |
| A published lot an operator called off |

| Field | Value |
| --- | --- |
| `<lot_5>` | A published lot whose bidding ended with no winner |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the All auctions list.
3. Search the catalogue for the title of `<lot>`.

**Expected Results:**

* `<lot>` is not in All auctions.
* Search does not find `<lot>`.
* `<lot_5>` is in All auctions, status Ended.

`<!-- trace:case id=g10.auction-lot-status.TC-wlb rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->`
### g10.auction-lot-status.US2-TC2: Called-off lot leaves the watchlist, unsold lot stays

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

* customer(signed in) watches `<lot_2>` and `<lot_3>`.
* `<lot_2>` ended with no winner.
* `<lot_3>` was called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_2>` | A watched lot whose bidding ended with no winner |
| `<lot_3>` | A watched lot an operator called off |

**Steps:**

1. Navigate to `<grade10 my auctions url>`.
2. Read the list.

**Expected Results:**

* `<lot_3>` is not in the list.
* `<lot_2>` is in the list, status Ended.

`<!-- trace:case id=g10.auction-lot-status.TC-k90 rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->`
### g10.auction-lot-status.US2-TC3: Listing data leaves out called-off lots

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-lot-status-US-02

**Decided by:** `grade10:apps/backend/grade10/auction/test/db/listings/publicSummaries.spec.ts`

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

`<!-- trace:case id=g10.auction-lot-status.TC-7m2 rev=1 covers=g10.auction-lot-status.SC-w9d -->`
### g10.auction-lot-status.US2-TC4: A called-off lot stays reachable at its canonical address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lot-status.spec.ts`

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

## g10.auction-lot-status.US3: Bidder sees what happened to a called-off lot

**As a** bidder,
**I want** a called-off lot I bid on to stay in My Auctions,
**so that** I can see my card was not charged.

`<!-- trace:case id=g10.auction-lot-status.TC-byf rev=2 covers=g10.auction-lot-status.SC-yoe -->`
### g10.auction-lot-status.US3-TC1: Only the bidder still sees a called-off lot

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/lot-status.spec.ts`

**Pre-conditions:**

* customer A and customer B are signed in on separate sessions.
* customer A bid on `<lot_4>`.
* customer B watched `<lot_4>` and did not bid.
* `<lot_4>` was called off.

**Test data:**

| Field | Value |
| --- | --- |
| `<lot_4>` | A lot customer A bid on and customer B watched, then called off |

**Steps:**

1. In customer A's session, navigate to `<grade10 my auctions url>`.
2. In customer B's session, navigate to `<grade10 my auctions url>`.

**Expected Results:**

* Step 1 lists `<lot_4>`, and the row says Your card was not charged.
* Step 1's row names no card hold, release or authorization.
* Step 2 does not list `<lot_4>`.

## Settled

- **Archived fold records — 2026-10-12 suite rewrite** — `grade10-site-auction-lot-status-US1-TC1-1` → `g10.auction-lot-status.US1-TC1`; `grade10-site-auction-lot-status-US1-TC2-1` → `g10.auction-lot-status.US1-TC2`; `grade10-site-auction-lot-status-US2-TC1-1` → `g10.auction-lot-status.US2-TC1`; `grade10-site-auction-lot-status-US2-TC2-1` → `g10.auction-lot-status.US2-TC2`; `grade10-site-auction-lot-status-US2-TC3-1` → `g10.auction-lot-status.US2-TC3`; `grade10-site-auction-lot-status-US2-TC4-1` → `g10.auction-lot-status.US2-TC4`; `grade10-site-auction-lot-status-US3-TC1-1` → `g10.auction-lot-status.US3-TC1`.
