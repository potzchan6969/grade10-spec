# grade10-site/auction/lot-status Test Cases

**Status:** reopened · 3/7
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-site-auction-lot-status-US1: Collector sees whether a lot can still be bid on

**As a** collector,
**I want** a closed lot with a Preparing Shipment order to still read Ended,
**so that** the lot status stays separate from the winner's order status.

<!-- trace:case id=g10.auction-lot-status.TC-1ik rev=1 -->
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

<!-- trace:case id=g10.auction-lot-status.TC-bfm rev=1 -->
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
**so that** I do not mistake an unfinished or withdrawn lot for an available auction.

<!-- trace:case id=g10.auction-lot-status.TC-22a rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2 -->
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

<!-- trace:case id=g10.auction-lot-status.TC-wlb rev=1 covers=g10.auction-lot-status.SC-cox -->
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

<!-- trace:case id=g10.auction-lot-status.TC-k90 rev=1 -->
### grade10-site-auction-lot-status-US2-TC3-1: Listing data leaves out called-off lots

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

<!-- trace:case id=g10.auction-lot-status.TC-7m2 rev=2 -->
### grade10-site-auction-lot-status-US2-TC4-2: Called-off address disappears without a code-only alternate

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

* customer has a published lot's `<listing_url>` and `<listing_code>` saved.
* The lot has been called off and no eligible holder uses its slug.

**Test data:**

| `<listing_code>` | `<listing_url>` |
| --- | --- |
| The lot's allocated code in upper case | Its former full public address |
| The same code in lower case | The same former full public address |

**Steps:**

1. Search the catalogue for the listing.
2. Open `<listing_url>` directly.
3. Open `<grade10 auction url>/listings/<listing_code>`.

**Expected Results:**

* Catalogue and search do not return the listing.
* `<listing_url>` returns 404 with Page not found.
* The listing code does not resolve as an address.
* No alternate called-off page appears.


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

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - TC-22a, TC-wlb and TC-byf fully assert the 4 preserved hidden-lot scenarios. TC-7m2 checks former-address refusal, catalogue/search removal and both code-only forms, but not watchlist removal on that route. SC13 remains uncovered as a whole. The site domain TC-dw9 preserves the original bidder row after reuse, but does not check the non-bidder session after reuse. SC14 remains uncovered as a whole.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.

