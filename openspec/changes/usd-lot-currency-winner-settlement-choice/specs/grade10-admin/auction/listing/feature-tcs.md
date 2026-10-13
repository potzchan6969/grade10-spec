# grade10-admin/auction/listing Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-13, tcs-rules r5
**Out of suite:** grade10-admin-auction-listing-SC-01, grade10-admin-auction-listing-SC-02, grade10-admin-auction-listing-SC-04, grade10-admin-auction-listing-SC-05, grade10-admin-auction-listing-SC-07, grade10-admin-auction-listing-SC-08, grade10-admin-auction-listing-SC-09, grade10-admin-auction-listing-SC-10, grade10-admin-auction-listing-SC-11, grade10-admin-auction-listing-SC-12, grade10-admin-auction-listing-SC-25, grade10-admin-auction-listing-SC-26, grade10-admin-auction-listing-SC-27, grade10-admin-auction-listing-SC-27a, grade10-admin-auction-listing-SC-28, grade10-admin-auction-listing-SC-70, grade10-admin-auction-listing-SC-127, grade10-admin-auction-listing-SC-129, grade10-admin-auction-listing-SC-149, grade10-admin-auction-listing-SC-150, grade10-admin-auction-listing-SC-151, grade10-admin-auction-listing-SC-162, grade10-admin-auction-listing-SC-163

## g10adm.auction-listing.US1: Operator saves an unfinished listing and comes back to it

**As a** auction operator,
**I want** to save a listing before I know every fact about the card,
**so that** I can start from the item in front of me and finish once the rest arrives.

<!-- trace:case id=g10adm.auction-listing.TC-qk8 rev=3 covers=g10adm.auction-listing.SC-r6p -->
### g10adm.auction-listing.US1-TC3: Draft refuses a negative or non-whole starting price

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

<!-- trace:case id=g10adm.auction-listing.TC-uka rev=2 covers=g10adm.auction-listing.SC-a6f -->
### g10adm.auction-listing.US1-TC6: Draft keeps a starting price of 0 apart from an empty one

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
* **Trace:** grade10-admin-auction-listing-US-01

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

---

## g10adm.auction-listing.US3: Operator creates a listing that is ready to sell

**As a** auction operator,
**I want** the listing checked against everything an auction needs at the moment I create it,
**so that** nothing incomplete can reach a bidder.

<!-- trace:case id=g10adm.auction-listing.TC-igg rev=2 covers=g10adm.auction-listing.SC-mmr -->
### g10adm.auction-listing.US3-TC1: Operator creates a filled draft

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

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

<!-- trace:case id=g10adm.auction-listing.TC-8u6 rev=2 covers=g10adm.auction-listing.SC-rj8 -->
### g10adm.auction-listing.US3-TC15: Operator corrects a created listing's starting price

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

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

<!-- trace:case id=g10adm.auction-listing.TC-h7v rev=2 covers=g10adm.auction-listing.SC-rhp -->
### g10adm.auction-listing.US3-TC21: Create accepts a starting price of 0 in USD

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

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

<!-- trace:case id=g10adm.auction-listing.TC-fc7 rev=2 covers=g10adm.auction-listing.SC-hze -->
### g10adm.auction-listing.US3-TC22: API create refuses a negative or non-whole starting price

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_5>` is a draft in USD with every create requirement set and starting price 0 minor units.

**Test data:**

| Starting price sent with create |
| --- |
| -1 minor unit |
| 0.5 minor units |

**Steps:**

1. Send create for `<listing_5>` with the row's starting price.
2. Read the API response for `<listing_5>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads the listing as a draft.
* Step 2 reads starting price 0 minor units USD.

<!-- trace:case id=g10adm.auction-listing.TC-ebb rev=2 covers=g10adm.auction-listing.SC-rfu -->
### g10adm.auction-listing.US3-TC24: Operator lowers a created listing's starting price to 0

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-03

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

<!-- trace:case id=g10adm.auction-listing.TC-g4v rev=2 covers=g10adm.auction-listing.SC-v2q,g10adm.auction-listing.SC-28a -->
### g10adm.auction-listing.US3-TC25: API create with 0 and no currency creates as USD 0

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
* **Trace:** grade10-admin-auction-listing-US-03

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_10>` is a draft with every create requirement set except the starting price, and no currency chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_10>` | A draft, currency not chosen, starting price empty, every other create requirement set |
| Starting price | 0 minor units |

**Steps:**

1. Send create for `<listing_10>` with starting price 0 and no currency.
2. Read the API response for `<listing_10>`.

**Expected Results:**

* Step 1 is accepted.
* Step 2 reads the listing as created.
* Step 2 reads starting price 0 minor units USD.

<!-- trace:case id=g10adm.auction-listing.TC-m53 rev=2 covers=none -->
### g10adm.auction-listing.US3-TC26: Currency change reformats the same minor-unit price

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

---

## g10adm.auction-listing.US9: Operator lists an unsold lot again

**As a** auction operator,
**I want** the stock of a listing that closed with no winner to come back on its own, and a Relist on that listing,
**so that** a card nobody bought goes back on sale without me hunting for its stock.

<!-- trace:case id=g10adm.auction-listing.TC-xzh rev=3 covers=g10adm.auction-listing.SC-t6r,g10adm.auction-listing.SC-5vh,g10adm.auction-listing.SC-le0,g10adm.auction-listing.SC-4ez,g10adm.auction-listing.SC-lc6,g10adm.auction-listing.SC-z9c,g10adm.auction-listing.SC-j1h,g10adm.auction-listing.SC-suv,g10adm.auction-listing.SC-lqj,g10adm.auction-listing.SC-nq1,g10adm.auction-listing.SC-2m4,g10adm.auction-listing.SC-9uj -->
### g10adm.auction-listing.US9-TC3: Relist from the row opens a new draft holding stock on Save

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

---

## g10adm.auction-listing.US74: Operator prices a listing in USD

**As a** auction operator,
**I want** a listing to price in USD with no other currency to choose,
**so that** I do not guess a currency for a lot every collector bids on in one unit.

<!-- trace:case id=g10adm.auction-listing.TC-htj rev=1 covers=g10adm.auction-listing.SC-zzf -->
### g10adm.auction-listing.US74-TC1: The listing form offers no currency and a created listing reads USD

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-auction-listing-US-74

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

<!-- trace:case id=g10adm.auction-listing.TC-e4m rev=1 covers=g10adm.auction-listing.SC-h88,g10adm.auction-listing.SC-2ij -->
### g10adm.auction-listing.US74-TC2: A draft refuses any currency other than USD

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-74

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_21>` is a draft in USD with starting price 100000 minor units.

**Test data:**

| Currency sent | Why this row |
| --- | --- |
| HKD | A retired listing currency |
| JPY | A retired listing currency |
| EUR | A currency the store never held, standing for any other |

**Steps:**

1. Send a draft save for `<listing_21>` with the row's currency.
2. Read the API response for `<listing_21>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads currency USD and starting price 100000 minor units, unchanged.

<!-- trace:case id=g10adm.auction-listing.TC-lej rev=1 covers=g10adm.auction-listing.SC-ja8 -->
### g10adm.auction-listing.US74-TC3: Create refuses any currency other than USD

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-74

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_22>` is a draft in USD with every create requirement set.

**Test data:**

| Currency sent | Why this row |
| --- | --- |
| HKD | A retired listing currency |
| JPY | A retired listing currency |
| EUR | A currency the store never held, standing for any other |

**Steps:**

1. Send create for `<listing_22>` with the row's currency.
2. Read the API response for `<listing_22>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads the listing as a draft in USD, not created.

<!-- trace:case id=g10adm.auction-listing.TC-ctn rev=1 covers=g10adm.auction-listing.SC-et0 -->
### g10adm.auction-listing.US74-TC4: An update of a created listing refuses any currency other than USD

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-auction-listing-US-74

**Pre-conditions:**

* admin(holds the grant to set an auction's prices and window) holds an API session.
* `<listing_23>` is a created listing in USD with starting price 100000 minor units.

**Test data:**

| Currency sent | Why this row |
| --- | --- |
| HKD | A retired listing currency |
| JPY | A retired listing currency |

**Steps:**

1. Send an update for `<listing_23>` with the row's currency.
2. Read the API response for `<listing_23>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 reads currency USD, starting price 100000 minor units and the listing still created.

## Settled

- None this run. Every blind reading either folded into a scenario or went to `decisions.md` `## Raised`.

## Reconciliation

**Run:** QA2 reconciliation 2026-10-13 for change `usd-lot-currency-winner-settlement-choice`, joining QA1's blind cases with Dev's delta scenarios on `grade10-admin-auction-listing-US-74` and the restated `grade10-admin-auction-listing-US-01`, `grade10-admin-auction-listing-US-03` and `grade10-admin-auction-listing-US-09`. Read the change's `proposal.md`, `decisions.md` (Q1 to Q14 and `## Raised`), `tech-design.md`, `tasks.md`, this delta `spec.md` and `user-journeys.md`, the durable `spec.md` and suite, and the PRD pages the proposal links. QA1 had read the frozen anchors, `decisions.md` and the PRD only, and no `## Requirements`. Links are post-hoc: a case is linked to a scenario only where its route and Expected Results assert the scenario's THEN; a link that two cases share between them says so.

| Finding | Disposition |
| --- | --- |
| The form offers no currency control, and a created listing reads USD | **Folded in:** `grade10-admin-auction-listing-SC-159`, asserted by `g10adm.auction-listing.US74-TC1` |
| A create with no currency stores USD | **Folded in:** `grade10-admin-auction-listing-SC-160` and `grade10-admin-auction-listing-SC-125a`, asserted by `g10adm.auction-listing.US3-TC25`. `grade10-admin-auction-listing-SC-125a` keeps its title with its id; the stored currency is USD |
| A draft save refuses a currency other than USD | **Folded in:** `grade10-admin-auction-listing-SC-164` and `grade10-admin-auction-listing-SC-56`, asserted by the HKD, JPY and EUR rows of `g10adm.auction-listing.US74-TC2` |
| A create refuses a currency other than USD | **Folded in:** `grade10-admin-auction-listing-SC-165`, asserted by the API reads of `g10adm.auction-listing.US74-TC3` |
| An update of a created listing refuses HKD and JPY, leaving currency and amounts unchanged | **Added:** QA1 read the draft and the create and not the update. `g10adm.auction-listing.US74-TC4` asserts `grade10-admin-auction-listing-SC-161` |
| A create that names EUR, HKD or JPY is prevented by the form and refused by the API | **Stop and ask the author:** `grade10-admin-auction-listing-SC-57` says the form prevents the request and names currency, while `grade10-admin-auction-listing-SC-159` says the form offers no currency control that can be changed, so no form request can carry another currency. `g10adm.auction-listing.US74-TC3` reads the API clause only and the scenario is not linked. The title of `grade10-admin-auction-listing-SC-165` also reads "on the form and API" while its THEN reads the API only. Raised in `decisions.md`; Q23 settled it on 2026-10-14 (the form has no currency control and the API refuses any currency but USD), and the form clause of `grade10-admin-auction-listing-SC-57` still stands in the delta, for Dev to restate |
| The one-time overwrite sets every HKD and JPY listing to USD with amounts, bids, status and dates unchanged, and leaves a USD listing alone | **Out of suite:** `grade10-admin-auction-listing-SC-162` and `grade10-admin-auction-listing-SC-163` - a migration with no operator surface. Verified by the migration tests of task 4.1 and the count query of task 4.6 in `grade10`, and by the launch check of task 8.1; the walk of task 9.1 reads one overwritten lot on the bid panel |
| Draft, create and update price rules: negative and non-whole refused, 0 kept apart from empty, 0 accepted at create, lowered to 0, corrected | **Folded in:** `grade10-admin-auction-listing-SC-03`, `grade10-admin-auction-listing-SC-124`, `grade10-admin-auction-listing-SC-125`, `grade10-admin-auction-listing-SC-126`, `grade10-admin-auction-listing-SC-128` and `grade10-admin-auction-listing-SC-24`, asserted by `g10adm.auction-listing.US1-TC3`, `US1-TC6`, `US3-TC21`, `US3-TC22`, `US3-TC24` and `US3-TC15`; USD fixtures replace the HKD and JPY ones |
| A filled draft creates, and its bid floor uses the USD schedule | **Folded in:** `grade10-admin-auction-listing-SC-06`, asserted by `g10adm.auction-listing.US3-TC1`. The bid floor clause is read by `g10.auction-bid-increments.US3-TC1`, not here |
| `g10adm.auction-listing.US3-TC26` reformats a price on a currency change | **Kept deprecated:** the form offers no currency choice, so there is no change to reformat; `covers=none` stands |
| `g10adm.auction-listing.US9-TC3` relists with a USD fixture | **Carried:** the case verifies the durable relist requirement, which this change does not alter; the marker keeps its durable `covers` |
| Scenarios the modified blocks restate unchanged: `grade10-admin-auction-listing-SC-01`, `-SC-02`, `-SC-04`, `-SC-05`, `-SC-07` to `-SC-12`, `-SC-25` to `-SC-28`, `-SC-27a`, `-SC-70`, `-SC-127`, `-SC-129`, `-SC-149` to `-SC-151` | **Out of suite:** the durable suite holds the verifying cases, which this change does not alter: `g10adm.auction-listing.TC-mqd`, `TC-27b`, `TC-09o`, `TC-ys7`, `TC-4hw`, `TC-yte`, `TC-xx5`, `TC-78a`, `TC-vtd`, `TC-hdm`, `TC-ofm`, `TC-4sr`, `TC-o5r`, `TC-xt0`, `TC-o8h`, `TC-1h5`, `TC-0q9`, `TC-ow9`, `TC-d11` and `TC-pqm` |
| A durable case this suite does not carry still names an HKD listing: `g10adm.auction-listing.TC-pcd` (`US4-TC15`, automated against an HKD fixture) | **Not folded:** no scenario of this change restates its journey. Its fixture cannot exist once the overwrite runs. It needs a USD restatement at the walk of task 9.4, or `deprecated` with its reason, before the change archives |

**Uncovered anchors:** none for `grade10-admin-auction-listing-US-74`. One scenario clause is unreachable and is held for the author: the form clause of `grade10-admin-auction-listing-SC-57`.
