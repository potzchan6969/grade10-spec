# grade10-site/auction/lot-status Test Cases

**Status:** pending-review · 3/7
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Collector sees whether a listing can still be bid on

**Starting state:**

- The closed listing `<listing_2>` has a winner whose order `<winner_order_1>` derives as Preparing Shipment.
- customer(winner of `<listing_4>`) is signed in.
- The order `<winner_order_2>` for `<listing_4>` is awaiting payment.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-lot-status.US1-TC1 | listing_2 | A closed listing with a winner whose order `<winner_order_1>` derives as Preparing Shipment; bind its identity only |
| g10.auction-lot-status.US1-TC1 | winner_order_1 | The winner order belonging to `<listing_2>`, deriving as Preparing Shipment; bind its identity only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-lot-status.US1-TC2 | listing_4 | A listing this customer won, order awaiting payment; bind its identity only |
| g10.auction-lot-status.US1-TC2 | winner_order_2 | The winner order belonging to `<listing_4>`, awaiting payment; bind its identity only |
| g10.auction-lot-status.US1-TC2 | my auctions url | The My Auctions URL |

### Route

1. Read the external status of `<listing_2>`.
   - External listing status is Ended. g10.auction-lot-status.US1-TC1
2. Navigate to `<my auctions url>`.
3. Read the row for `<listing_4>`.
   - The listing status is Ended. g10.auction-lot-status.US1-TC2
   - Your Standing shows the status of `<winner_order_2>`. g10.auction-lot-status.US1-TC2

## Walk 2: Collector does not find draft or called-off listings in browse or search and adjacent checks

**Starting state:**

- `<listing_6>` has this state: `<listing state>`.
- `<listing_7>` ended with no winner.
- customer(signed in) watches `<listing_8>` and `<listing_9>`.
- `<listing_8>` ended with no winner.
- `<listing_9>` was called off.
- `<listing_10>` ended with no winner, and a collector watches it.
- `<listing_11>` was called off, and that collector watches it.
- customer(signed in) has `<listing_12>`'s `<listing_url>` and `<listing_code>` saved.
- The customer watched `<listing_12>` before it was called off.
- The listing `<listing_12>` has been called off and no eligible holder uses its slug.
- customer A and customer B are signed in on separate sessions.
- customer A bid on `<listing_14>`.
- customer B watched `<listing_14>` and did not bid.
- `<listing_14>` was called off.
- `<listing_15>` is now public at `<listing_14>`'s former address.

**Shared test data:**

| Case | `<listing state>` |
| --- | --- |
| g10.auction-lot-status.US2-TC1 | A draft listing, never published |
| g10.auction-lot-status.US2-TC1 | A published listing an operator called off |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-lot-status.US2-TC1 | listing_7 | A published listing whose bidding ended with no winner; bind its identity only |
| g10.auction-lot-status.US2-TC1 | listing_6 | A listing with state `<listing state>`; bind its identity only |
| g10.auction-lot-status.US2-TC1 | listing title | The seeded title of `<listing_6>`; bind its text only |
| g10.auction-lot-status.US2-TC1 | grade10 auction catalogue url | The Grade10 auction catalogue URL |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-lot-status.US2-TC2 | listing_8 | A watched listing whose bidding ended with no winner; bind its identity only |
| g10.auction-lot-status.US2-TC2 | listing_9 | A watched listing an operator called off; bind its identity only |
| g10.auction-lot-status.US2-TC2 | my auctions url | The My Auctions URL |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-lot-status.US2-TC3 | listing_10 | A watched listing whose bidding ended with no winner; bind its identity only |
| g10.auction-lot-status.US2-TC3 | listing_11 | A watched listing an operator called off; bind its identity only |

| Case | `<listing_code>` | `<listing_url>` |
| --- | --- | --- |
| g10.auction-lot-status.US2-TC4 | `<uppercase code>` | `<former listing url>` |
| g10.auction-lot-status.US2-TC4 | `<lowercase code>` | `<former listing url>` |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-lot-status.US2-TC4 | listing_12 | The original called-off listing watched by this customer, with no eligible holder of its slug; bind its identity only |
| g10.auction-lot-status.US2-TC4 | listing title | The original title of `<listing_12>`; bind its text only |
| g10.auction-lot-status.US2-TC4 | uppercase code | The allocated code of `<listing_12>` in upper case; bind its code only |
| g10.auction-lot-status.US2-TC4 | lowercase code | The same allocated code as `<uppercase code>`, in lower case; bind its code only |
| g10.auction-lot-status.US2-TC4 | former listing url | The former full public address of `<listing_12>`; bind its URL only |
| g10.auction-lot-status.US2-TC4 | grade10 auction url | The Grade10 auction base URL |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-lot-status.US3-TC1 | listing_14 | A listing customer A bid on and customer B watched, then called off; bind its identity only |
| g10.auction-lot-status.US3-TC1 | listing_15 | A public replacement with a different title using the released slug; bind its identity only |
| g10.auction-lot-status.US3-TC1 | my auctions url | The My Auctions URL |

### Route

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the All auctions list.
3. Search the catalogue for `<listing title>`.
   - `<listing_6>` is not in All auctions. g10.auction-lot-status.US2-TC1
   - Search does not find `<listing_6>`. g10.auction-lot-status.US2-TC1
   - `<listing_7>` is in All auctions, status Ended. g10.auction-lot-status.US2-TC1
4. Navigate to `<my auctions url>`.
5. Read the list.
   - `<listing_9>` is not in the list. g10.auction-lot-status.US2-TC2
   - `<listing_8>` is in the list, status Ended. g10.auction-lot-status.US2-TC2
6. Read the API response for the public listing data.
   - `<listing_11>` is not included. g10.auction-lot-status.US2-TC3
   - `<listing_10>` is included, external listing status Ended. g10.auction-lot-status.US2-TC3
7. Open the auction catalogue and read its listings.
   - Step 7 does not list the called-off original. g10.auction-lot-status.US2-TC4
8. Search the catalogue for `<listing title>`.
   - Step 8 does not find it in search. g10.auction-lot-status.US2-TC4
9. Open the customer's watchlist and find `<listing_12>`.
   - Step 9 does not include it in the watchlist. g10.auction-lot-status.US2-TC4
10. Open `<listing_url>` directly.
   - Step 10 returns 404. g10.auction-lot-status.US2-TC4
11. Inspect its response body and page.
   - Step 11 shows Page not found with no original-listing data or code. g10.auction-lot-status.US2-TC4
12. Open `<grade10 auction url>/listings/<listing_code>`.
   - Step 12 returns 404 for either code casing. g10.auction-lot-status.US2-TC4
13. Inspect its response body and page.
   - Step 13 shows Page not found with no original-listing data or code. g10.auction-lot-status.US2-TC4
   - No alternate called-off page appears. g10.auction-lot-status.US2-TC4
14. In customer A's session, navigate to `<my auctions url>`.
15. Read `<listing_14>`'s row and history.
   - Step 15 names `<listing_14>`, not `<listing_15>`. g10.auction-lot-status.US3-TC1
16. Inspect the row's listing navigation control.
   - Step 16 has no link that opens `<listing_15>`. g10.auction-lot-status.US3-TC1
17. In customer B's session, navigate to `<my auctions url>`.
   - The row says Your card was not charged. g10.auction-lot-status.US3-TC1
   - Original bids and history remain attached to `<listing_14>`. g10.auction-lot-status.US3-TC1
   - No card hold, release or authorization appears. g10.auction-lot-status.US3-TC1
   - Step 17 does not list `<listing_14>`. g10.auction-lot-status.US3-TC1

## g10.auction-lot-status.US1: Collector sees whether a listing can still be bid on

**As a** collector,
**I want** every listing to show whether it is Upcoming, Active or Ended,
**so that** I can see at a glance whether I can still bid on it.

<!-- trace:case id=g10.auction-lot-status.TC-1ik rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->
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

* The closed listing `<listing_2>` has a winner whose order `<winner_order_1>` derives as Preparing Shipment.

**Test data:**

| Field | Value |
| --- | --- |
| listing_2 | A closed listing with a winner whose order `<winner_order_1>` derives as Preparing Shipment; bind its identity only |
| winner_order_1 | The winner order belonging to `<listing_2>`, deriving as Preparing Shipment; bind its identity only |

**Steps:**

1. Read the external status of `<listing_2>`.

**Expected Results:**

* External listing status is Ended.

<!-- trace:case id=g10.auction-lot-status.TC-bfm rev=1 covers=g10.auction-lot-status.SC-wpp,g10.auction-lot-status.SC-orm,g10.auction-lot-status.SC-6aa,g10.auction-lot-status.SC-pmn,g10.auction-lot-status.SC-flh,g10.auction-lot-status.SC-eor,g10.auction-lot-status.SC-l6k -->
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

* customer(winner of `<listing_4>`) is signed in.
* The order `<winner_order_2>` for `<listing_4>` is awaiting payment.

**Test data:**

| Field | Value |
| --- | --- |
| listing_4 | A listing this customer won, order awaiting payment; bind its identity only |
| winner_order_2 | The winner order belonging to `<listing_4>`, awaiting payment; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read the row for `<listing_4>`.

**Expected Results:**

* The listing status is Ended.
* Your Standing shows the status of `<winner_order_2>`.

---

## g10.auction-lot-status.US2: Collector does not find draft or called-off listings in browse or search

**As a** collector,
**I want** draft listings and called-off listings absent from browse, search and my watchlist,
**so that** I do not mistake an unfinished or withdrawn listing for an available auction.

<!-- trace:case id=g10.auction-lot-status.TC-22a rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-w9d,g10.auction-lot-status.SC-3yw -->
### g10.auction-lot-status.US2-TC1: Hidden listings are not in the catalogue

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

* `<listing_6>` has this state: `<listing state>`.
* `<listing_7>` ended with no winner.

**Test data:**

| `<listing state>` |
| --- |
| A draft listing, never published |
| A published listing an operator called off |

| Field | Value |
| --- | --- |
| listing_7 | A published listing whose bidding ended with no winner; bind its identity only |
| listing_6 | A listing with state `<listing state>`; bind its identity only |
| listing title | The seeded title of `<listing_6>`; bind its text only |
| grade10 auction catalogue url | The Grade10 auction catalogue URL |

**Steps:**

1. Navigate to `<grade10 auction catalogue url>`.
2. Read the All auctions list.
3. Search the catalogue for `<listing title>`.

**Expected Results:**

* `<listing_6>` is not in All auctions.
* Search does not find `<listing_6>`.
* `<listing_7>` is in All auctions, status Ended.

<!-- trace:case id=g10.auction-lot-status.TC-wlb rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->

### g10.auction-lot-status.US2-TC2: Called-off listing leaves the watchlist, unsold listing stays

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

* customer(signed in) watches `<listing_8>` and `<listing_9>`.
* `<listing_8>` ended with no winner.
* `<listing_9>` was called off.

**Test data:**

| Field | Value |
| --- | --- |
| listing_8 | A watched listing whose bidding ended with no winner; bind its identity only |
| listing_9 | A watched listing an operator called off; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. Navigate to `<my auctions url>`.
2. Read the list.

**Expected Results:**

* `<listing_9>` is not in the list.
* `<listing_8>` is in the list, status Ended.

<!-- trace:case id=g10.auction-lot-status.TC-k90 rev=1 covers=g10.auction-lot-status.SC-me0,g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-cox,g10.auction-lot-status.SC-3yw -->

### g10.auction-lot-status.US2-TC3: Listing data leaves out called-off listings

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

* `<listing_10>` ended with no winner, and a collector watches it.
* `<listing_11>` was called off, and that collector watches it.

**Test data:**

| Field | Value |
| --- | --- |
| listing_10 | A watched listing whose bidding ended with no winner; bind its identity only |
| listing_11 | A watched listing an operator called off; bind its identity only |

**Steps:**

1. Read the API response for the public listing data.

**Expected Results:**

* `<listing_11>` is not included.
* `<listing_10>` is included, external listing status Ended.

<!-- trace:case id=g10.auction-lot-status.TC-7m2 rev=1 covers=g10.auction-lot-status.SC-w9d -->

<!-- trace:case id=g10.auction-lot-status.TC-7m2 rev=4 covers=g10.auction-lot-status.SC-pe2,g10.auction-lot-status.SC-w9d -->
### g10.auction-lot-status.US2-TC4: Called-off address disappears without a code-only alternate

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

* customer(signed in) has `<listing_12>`'s `<listing_url>` and `<listing_code>` saved.
* The customer watched `<listing_12>` before it was called off.
* The listing `<listing_12>` has been called off and no eligible holder uses its slug.

**Test data:**

| `<listing_code>` | `<listing_url>` |
| --- | --- |
| `<uppercase code>` | `<former listing url>` |
| `<lowercase code>` | `<former listing url>` |

| Field | Value |
| --- | --- |
| listing_12 | The original called-off listing watched by this customer, with no eligible holder of its slug; bind its identity only |
| listing title | The original title of `<listing_12>`; bind its text only |
| uppercase code | The allocated code of `<listing_12>` in upper case; bind its code only |
| lowercase code | The same allocated code as `<uppercase code>`, in lower case; bind its code only |
| former listing url | The former full public address of `<listing_12>`; bind its URL only |
| grade10 auction url | The Grade10 auction base URL |

**Steps:**

1. Open the auction catalogue and read its listings.
2. Search the catalogue for `<listing title>`.
3. Open the customer's watchlist and find `<listing_12>`.
4. Open `<listing_url>` directly.
5. Inspect its response body and page.
6. Open `<grade10 auction url>/listings/<listing_code>`.
7. Inspect its response body and page.

**Expected Results:**

* Step 1 does not list the called-off original.
* Step 2 does not find it in search.
* Step 3 does not include it in the watchlist.
* Step 4 returns 404.
* Step 5 shows Page not found with no original-listing data or code.
* Step 6 returns 404 for either code casing.
* Step 7 shows Page not found with no original-listing data or code.
* No alternate called-off page appears.

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
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-lot-status-US-03

**Pre-conditions:**

* customer A and customer B are signed in on separate sessions.
* customer A bid on `<listing_14>`.
* customer B watched `<listing_14>` and did not bid.
* `<listing_14>` was called off.
* `<listing_15>` is now public at `<listing_14>`'s former address.

**Test data:**

| Field | Value |
| --- | --- |
| listing_14 | A listing customer A bid on and customer B watched, then called off; bind its identity only |
| listing_15 | A public replacement with a different title using the released slug; bind its identity only |
| my auctions url | The My Auctions URL |

**Steps:**

1. In customer A's session, navigate to `<my auctions url>`.
2. Read `<listing_14>`'s row and history.
3. Inspect the row's listing navigation control.
4. In customer B's session, navigate to `<my auctions url>`.

**Expected Results:**

* Step 2 names `<listing_14>`, not `<listing_15>`.
* The row says Your card was not charged.
* Original bids and history remain attached to `<listing_14>`.
* No card hold, release or authorization appears.
* Step 3 has no link that opens `<listing_15>`.
* Step 4 does not list `<listing_14>`.

## Settled

- **Archived fold records — 2026-10-12 suite rewrite** — `grade10-site-auction-lot-status-US1-TC1-1` → `g10.auction-lot-status.US1-TC1`; `grade10-site-auction-lot-status-US1-TC2-1` → `g10.auction-lot-status.US1-TC2`; `grade10-site-auction-lot-status-US2-TC1-1` → `g10.auction-lot-status.US2-TC1`; `grade10-site-auction-lot-status-US2-TC2-1` → `g10.auction-lot-status.US2-TC2`; `grade10-site-auction-lot-status-US2-TC3-1` → `g10.auction-lot-status.US2-TC3`; `grade10-site-auction-lot-status-US2-TC4-1` → `g10.auction-lot-status.US2-TC4`; `grade10-site-auction-lot-status-US3-TC1-1` → `g10.auction-lot-status.US3-TC1`.

## Reconciliation

**Run:** QA2, 2026-10-12. QA1 used frozen bundle `02ba99d366a1f619b3df386916067b23a31ec77462132a92d7eddd4bd474713f`. QA2 read both independent readings, all 3 deltas, the complete feature maps, current and durable journeys, durable context, and the linked owner decisions. Case dispositions were recorded before scenario links.

- **Disposition** - All 6 hidden-lot scenarios have complete routes. TC-7m2@4 checks catalogue/search/watchlist removal, former-address 404 and both code-only forms on one route. TC-byf@3 checks the original bidder history/no-charge result and non-bidder absence after replacement reuse. TC-22a and TC-bfm also fully assert unchanged external-status SC12 and SC05. The 6 external-status scenarios are exact durable copies; SC01-SC04 retain inherited coverage debt, distinct from this address change. No status mapping changes.
- **Coverage** - Complete case and scenario dispositions, source locations, anchor coverage and carried baseline findings are in the QA2 handoff. Missing scenario links are explicit gaps, not inferred coverage.
- **Decision** - All called-off original slugs are reusable, including earlier records. The eligible current holder answers; otherwise the address is not found. Codes stay reserved and do not become public routes. Bidder history stays with the original listing. Q1-Q4 are settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
- **Walks** - Feature walks name cases this change does not define, so this delta carries none. The durable walks keep the earlier called-off steps until task 1.3 rewrites them through `/tcs-review`. The revised cases above govern.

**Run:** QA2 repair pass, 2026-10-13, after the re-key to durable case ids and the lot-status Bidder exception repair. Read the 3 deltas, their journeys and the durable site and admin auction suites. Cases were reconciled against the delta scenarios' trace ids; no scenario text shaped a case, and only bodies the pass read were linked.

- **Disposition** - Of 6 hidden-lot scenarios, SC13 and SC09 are linked as before (TC-7m2@4, TC-byf@3). Added: TC-7m2@4 now also links SC07, since step 1 asserts the called-off lot is not in the catalogue. TC-byf@3 also asserts SC14 whole after the repair: the bidder's row keeps the no-charge result, is not replaced, opens no lot at the reused address, and a non-bidder cannot see it. TC-7m2@4 does not link SC08: it has no unsold lot in the watchlist.
- **Coverage** - No uncovered scenario in this delta and no over-claim. Correction to the earlier run: SC01-SC05 and SC12 are covered by durable case TC-bfm, not carried as debt; SC06, SC08 and SC11 are covered by durable US2-TC1 to TC3. This suite does not claim them.
- **Contradictions** - No active case asserts the old outcome; durable US2-TC4 is superseded by TC-7m2@4. The durable Walk 2 steps 7-10 (`still serves the public listing page`) remain until task 1.3.
- **Decision** - None new. Q1-Q4 stay settled.
- **Classification** - New and changed active cases remain draft. No runtime execution or human approval is claimed.
- **Walks** - Unchanged: this delta carries none, and task 1.3 repairs the durable walk through `/tcs-review`.
