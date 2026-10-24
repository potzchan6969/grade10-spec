# grade10-admin/auction/listing Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-admin-auction-listing-SC-01, grade10-admin-auction-listing-SC-02, grade10-admin-auction-listing-SC-04, grade10-admin-auction-listing-SC-05, grade10-admin-auction-listing-SC-07, grade10-admin-auction-listing-SC-08, grade10-admin-auction-listing-SC-09, grade10-admin-auction-listing-SC-10, grade10-admin-auction-listing-SC-11, grade10-admin-auction-listing-SC-12, grade10-admin-auction-listing-SC-25, grade10-admin-auction-listing-SC-26, grade10-admin-auction-listing-SC-27, grade10-admin-auction-listing-SC-27a, grade10-admin-auction-listing-SC-28, grade10-admin-auction-listing-SC-70, grade10-admin-auction-listing-SC-127, grade10-admin-auction-listing-SC-129, grade10-admin-auction-listing-SC-149, grade10-admin-auction-listing-SC-150, grade10-admin-auction-listing-SC-151, grade10-admin-auction-listing-SC-163

## grade10-admin-auction-listing-US1: Operator saves an unfinished listing and comes back to it

**As a** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

<!-- trace:case id=g10adm.auction-listing.TC-qk8 rev=3 -->
### grade10-admin-auction-listing-US1-TC3-3: Draft refuses a negative or non-whole starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_1>` is a draft in USD with starting price 100000 minor units.

**Test data:**

| Starting price entered | Why refused |
| --- | --- |
| -1 minor unit (-$0.01) | Negative, one minor unit below the 0 boundary |
| 0.5 minor units ($0.005) | Not a whole number of minor units |

**Steps:**

1. Open `<listing_1>`.
2. Replace the starting-price text with the row's amount.
3. Click Save.
4. Reopen `<listing_1>`.
5. Read its starting price and status.

**Expected Results:**

* Step 3 refuses the save.
* Step 5 reads the original price in USD, not empty.
* Step 5 still shows the listing as a draft.

<!-- trace:case id=g10adm.auction-listing.TC-uka rev=2 -->
### grade10-admin-auction-listing-US1-TC6-2: Draft keeps a starting price of 0 apart from an empty one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`, `grade10:apps/frontend/grade10/e2e/tests/auction/auction/opening-price.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_2>` is a draft in USD with a title and no starting price.
* `<listing_3>` is a draft in USD with a title and starting price 100000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_2>` | A draft, currency USD, starting price empty |
| `<listing_3>` | A draft, currency USD, starting price 100000 minor units |
| Starting price | 0 minor units (USD0.00) |

**Steps:**

1. Open `<listing_2>`.
2. Enter a starting price of 0.
3. Save the draft.
4. Reopen `<listing_2>`.
5. Read its starting price.
6. Open `<listing_3>`.
7. Clear its starting price.
8. Save the draft.
9. Reopen `<listing_3>`.
10. Read its starting price.

**Expected Results:**

* Step 3 saves; the listing remains a draft.
* Step 5 reads 0 minor units USD, not empty.
* Step 8 saves; the listing remains a draft.
* Step 10 reads empty, not 0.

## grade10-admin-auction-listing-US3: Operator creates a listing that is ready to sell

**As a** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

<!-- trace:case id=g10adm.auction-listing.TC-igg rev=2 -->
### grade10-admin-auction-listing-US3-TC1-2: Operator creates a filled draft

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(auction operator) is on <grade10 auction admin listings url>.
* A draft has a title, slug `<slug>`, starting price 100000 minor units, minimum increment 5000 minor units, currency USD, a future start, a close after that start, and one JPEG.

**Test data:**

| Field | Value |
| --- | --- |
| `<slug>` | charizard-psa-9 (1 to 64 lower-case hyphenated words) |
| Starting price | 100000 minor units (any whole amount of 0 or more) |
| Minimum increment | 5000 minor units |
| Currency | USD |

**Steps:**

1. Open that draft.
2. Create the listing.
3. Open the public catalogue.

**Expected Results:**

* Step 2 shows the listing as created.
* Step 3 does not list that listing.

<!-- trace:case id=g10adm.auction-listing.TC-8u6 rev=2 -->
### grade10-admin-auction-listing-US3-TC15-2: Operator corrects a created listing's starting price

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* A created listing has starting price 100000 minor units USD.

**Test data:**

| Field | Value |
| --- | --- |
| `<new price>` | 150000 minor units (any whole amount of 0 or more, other than 100000) |
| Currency | USD |

**Steps:**

1. Open that listing.
2. Set the starting price to `<new price>`.
3. Save the listing.
4. Read its starting price and status.

**Expected Results:**

* Step 4 shows `<new price>` USD.
* Step 4 still shows the listing as created.

<!-- trace:case id=g10adm.auction-listing.TC-h7v rev=2 -->
### grade10-admin-auction-listing-US3-TC21-2: Create accepts a starting price of 0 in USD

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`, `grade10:apps/frontend/grade10/e2e/tests/auction/auction/opening-price.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_4>` is a draft in USD with a title, a slug, a start, a close after both the start and now, one image, and the stock hold its draft took, and no starting price.

**Steps:**

1. Open `<listing_4>`.
2. Enter a starting price of 0.
3. Read the starting price's formatted read-back.
4. Create the listing.
5. Reopen `<listing_4>`.
6. Read its starting price.

**Expected Results:**

* Step 3 shows a formatted zero amount in USD, with USD's decimal places, and no error on the field.
* Step 4 shows the listing as created.
* Step 6 reads 0 minor units USD.

<!-- trace:case id=g10adm.auction-listing.TC-ebb rev=2 -->
### grade10-admin-auction-listing-US3-TC24-2: Operator lowers a created listing's starting price to 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_7>` is created and unpublished, currency USD, starting price 1000000 minor units.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_7>` | A created, unpublished listing, currency USD, starting price 1000000 minor units (USD10,000) |
| Starting price | 0 minor units |

**Steps:**

1. Open `<listing_7>`.
2. Set the starting price to 0.
3. Save the listing.
4. Reopen `<listing_7>`.
5. Read its starting price and status.

**Expected Results:**

* Step 3 saves.
* Step 5 reads 0 minor units USD.
* Step 5 reads the listing as created.

<!-- trace:case id=g10adm.auction-listing.TC-m53 rev=2 -->
### grade10-admin-auction-listing-US3-TC26-2: Currency change reformats the same minor-unit price

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

**Deprecated:** the form offers no currency choice, so a currency change no longer exists to reformat a price.

**Pre-conditions:**

* `<listing_13>` is a draft with every create requirement set except the starting price and currency.

**Steps:**

1. Open `<listing_13>`.
2. Select JPY.
3. Enter a starting price of 20.
4. Read the formatted starting price.
5. Select HKD.
6. Read the formatted starting price.

**Expected Results:**

* No currency can be selected: the form offers no currency choice.

## grade10-admin-auction-listing-US9: Operator lists an unsold lot again

**As a** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

<!-- trace:case id=g10adm.auction-listing.TC-xzh rev=3 -->
### grade10-admin-auction-listing-US9-TC3-3: Relist from the row opens a new draft holding stock on Save

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-09

**Pre-conditions:**

* `<listing_3>` closed Unsold with no bids, in no campaign, and its hold is released.
* `<listing_3>` has never been relisted.
* `<product_3>` shows `<available before>` units available.
* admin(holds auction:operate) is on <grade10 auction admin listings url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_3>` | An Unsold listing for `<product_3>` with `No Cert ID`, quantity `<quantity>`, a title, copy, starting price `<price>`, currency USD, a gallery of three items, slug `<slug_3>`, listing code `<code_3>`, extension 600 seconds, a taxonomy category, a start and close, and a history |
| `<product_3>` | The product `<listing_3>` sold nothing of, regular stock without Cert IDs |
| `<quantity>` | 2 units (any quantity from 1 to 500) |
| `<price>` | USD80 (any positive whole amount) |
| `<available before>` | 5 units (at least `<quantity>`) |
| `<available after Save>` | 3 units: `<available before>` minus `<quantity>` |

**Steps:**

1. Click Relist on `<listing_3>`'s row in the Listings table.
2. Read the new draft's form.
3. Read `<product_3>`'s available count on its product page.
4. Set a start and a close on the draft.
5. Click Save.
6. Read `<product_3>`'s available count again.
7. Return to <grade10 auction admin listings url>.
8. Read `<listing_3>`'s row.
9. Open `<listing_3>`.

**Expected Results:**

* Step 2 shows a new draft, not `<listing_3>`.
* Step 2: product `<product_3>`, `No Cert ID`, quantity `<quantity>`, and `<listing_3>`'s title and copy.
* Step 2: starting price `<price>`, currency USD, the same gallery in the same order.
* Step 2: no start or close, no campaign, no bids, no history.
* Step 2: extension, taxonomy and sandbox read as on a new blank draft.
* Step 3 still reads `<available before>`.
* Step 5 saves a draft whose slug is not `<slug_3>` and whose listing code is not `<code_3>`.
* Step 6 reads `<available after Save>`, `<available before>` minus `<quantity>`.
* Step 8: the row still reads Unsold and offers no Relist.
* Step 9: `<listing_3>` still reads Unsold, closed, with its history.

## g10adm.auction-listing.US74: Operator prices a listing in USD

**As a** auction operator,
**I want** a listing to price in USD with no other currency to choose,
**so that** I do not guess a currency for a lot every collector bids on in one unit.

<!-- trace:case id=g10adm.auction-listing.TC-htj rev=1 covers=grade10-admin-auction-listing-SC-159 -->
### g10adm.auction-listing.US74-TC1: The listing form offers no currency and a created listing reads USD

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-74

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/admin/auction/usd-listing.spec.ts`

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) is on <grade10 auction admin listings url>.
* `<listing_20>` is a new blank draft with a title.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_20>` | A new draft with a title and no currency chosen |
| Starting price | 500 minor units (USD5.00; any whole amount of 0 or more) |

**Steps:**

1. Open `<listing_20>`.
2. Look for a currency control beside the starting price.
3. Enter a starting price of 500 minor units.
4. Save the draft.
5. Reopen `<listing_20>`.
6. Read its starting price.

**Expected Results:**

* Step 2: no currency control is offered.
* Step 4: the draft saves.
* Step 6 reads 500 minor units USD.

## Settled

- None this run. Every blind reading either folded into a scenario or went to `decisions.md` `## Raised`.

## Reconciliation

**Run:** Independent QA2, 2026-10-14. Reconciled the QA1 blind cases with the current delta scenarios against the frozen anchors. Read the current PRD, decisions, journeys, delta requirements, technical design and durable baseline.

- **Retained:** All active case IDs, revisions, routes and classifications remain. All 14 active cases are draft.
- **Covered:** `SC-159` by `US74-TC1`; `SC-160` by `US3-TC25`; `SC-164` by `US74-TC2`; `SC-165` and `SC-57` by `US74-TC3`; `SC-161` by `US74-TC4`; `SC-162` by `US74-TC5`. The EUR API row asserts `SC-57`'s refusal and unchanged-draft THEN. The active `SC-57` body asserts API behavior; its historical title and serving-anchor wording also mention the form, but the scenario's THEN does not assert a form refusal.
- **Out of suite:** `SC-163` only. The one-time migration guard verifies the untouched USD row; the operator/API suite does not own that migration behavior. `SC-162` is covered by the migrated HKD and JPY rows and is removed from the old out-of-suite list.
- **QA2 repair:** `US74-TC3` rev2 retains its API create route, adds an explicit complete EUR draft assertion, and covers the API THEN in `SC-57`.
- **Anchors:** US-01, US-03, US-09 and US-74 have active cases.
