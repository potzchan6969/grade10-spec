# grade10-site/auction/lot-status Test Cases

**Status:** reopened · 0/2
**Drafts styled:** 2026-09-30, tcs-rules r3.0

## grade10-site-auction-lot-status-US2: Collector does not find draft or called-off lots in browse or search

**As a** collector,
**I want** draft lots and called-off lots absent from browse, search and my watchlist,
**so that** I do not mistake an unfinished or withdrawn lot for an available auction.

<!-- trace:case id=g10.auction-lot-status.TC-7m2 rev=4 covers=g10.auction-lot-status.SC-w9d -->
### grade10-site-auction-lot-status-US2-TC4-4: Called-off address disappears without a code-only alternate

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

* customer(signed in) has the lot's `<listing_url>` and `<listing_code>` saved.
* The customer watched the lot before it was called off.
* The lot has been called off and no eligible holder uses its slug.

**Test data:**

| `<listing_code>` | `<listing_url>` |
| --- | --- |
| The lot's allocated code in upper case | Its former full public address |
| The same code in lower case | The same former full public address |

**Steps:**

1. Open the auction catalogue and read its listings.
2. Search the catalogue for the called-off lot's title.
3. Open the customer's watchlist and find the original lot.
4. Open `<listing_url>` directly.
5. Inspect its response body and page.
6. Open `<grade10 auction url>/listings/<listing_code>`.
7. Inspect its response body and page.

**Expected Results:**

* Step 1 does not list the called-off original.
* Step 2 does not find it in search.
* Step 3 does not include it in the watchlist.
* Step 4 returns 404.
* Step 5 shows Page not found with no original-lot data or code.
* Step 6 returns 404 for either code casing.
* Step 7 shows Page not found with no original-lot data or code.
* No alternate called-off page appears.

---

## grade10-site-auction-lot-status-US3: Bidder sees what happened to a called-off lot

**As a** bidder,
**I want** a called-off lot I bid on to stay in My Auctions,
**so that** I can see my card was not charged.

<!-- trace:case id=g10.auction-lot-status.TC-byf rev=3 covers=g10.auction-lot-status.SC-yoe,g10.auction-lot-status.SC-cmh -->
### grade10-site-auction-lot-status-US3-TC1-3: Only the bidder still sees a called-off lot

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
* `<replacement>` is now public at `<lot_4>`'s former address.

**Test data:**

| Field | Value |
| --- | --- |
| <lot_4> | A lot customer A bid on and customer B watched, then called off |
| replacement | A public replacement with a different title using the released slug |

**Steps:**

1. In customer A's session, navigate to <grade10 my auctions url>.
2. Read <lot_4>'s row and history.
3. Inspect the row's lot navigation control.
4. In customer B's session, navigate to <grade10 my auctions url>.

**Expected Results:**

* Step 2 names <lot_4>, not `<replacement>`.
* The row says Your card was not charged.
* Original bids and history remain attached to <lot_4>.
* No card hold, release or authorization appears.
* Step 3 has no link that opens `<replacement>`.
* Step 4 does not list <lot_4>.

---

## Reconciliation

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - All 6 hidden-lot scenarios have complete routes. TC-7m2@4 checks catalogue/search/watchlist removal, former-address 404 and both code-only forms on one route. TC-byf@3 checks the original bidder history/no-charge result and non-bidder absence after replacement reuse. TC-22a and TC-bfm also fully assert unchanged external-status SC12 and SC05. The 6 external-status scenarios are exact durable copies; SC01-SC04 retain inherited coverage debt, distinct from this address change. No status mapping changes.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
