# grade10-site/store/product-listing Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-listing-US6: Collector takes the last of a card from the listing

**As a** collector,
**I want** a card's quantity to stop where the shop runs out, and to be told
how many are left when it does,
**so that** I buy the number the shop will actually send me rather than
finding out at the order.

<!-- trace:case id=g10.store-product-listing.TC-az7 rev=1 covers=none -->
### grade10-site-store-product-listing-US6-TC1-1: Card's quantity stops at the shop's count

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>` and exposes that count.
* `<card_1>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card the shop has few of and exposes a count for |
| `<low count>` | `3` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_1>`'s quantity past `<low count>`.
3. Open the cart drawer.

**Expected Results:**

* `<card_1>`'s quantity stays at `<low count>`.
* The cart holds `<low count>` of `<card_1>`.

<!-- trace:case id=g10.store-product-listing.TC-k7m rev=1 covers=none -->
### grade10-site-store-product-listing-US6-TC2-1: Card the shop counts nothing for is not capped

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop exposes no count for `<card_3>`.
* `<card_3>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_3>` | A card whose buyable variant the shop exposes no count for |
| `<asked quantity>` | `4` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_3>`'s quantity to `<asked quantity>`.
3. Open the cart drawer.

**Expected Results:**

* `<card_3>`'s quantity rises to `<asked quantity>`.
* The cart holds `<asked quantity>` of `<card_3>`.

<!-- trace:case id=g10.store-product-listing.TC-h5t rev=1 covers=none -->
### grade10-site-store-product-listing-US6-TC3-1: Nearly out is said, well stocked says nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>` and `<full count>` of `<card_2>`, and exposes both counts.
* Both cards are listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card the shop has few of and exposes a count for |
| `<card_2>` | A card the shop has many of and exposes a count for |
| `<low count>` | `3` |
| `<full count>` | `41` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read `<card_1>` and `<card_2>`.

**Expected Results:**

* `<card_1>` says `<low count>` are left.
* `<card_2>` says nothing about what is left.

<!-- trace:case id=g10.store-product-listing.TC-in4 rev=1 covers=none -->
### grade10-site-store-product-listing-US6-TC4-1: Asking for every one there is answered on the card

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-06

**Pre-conditions:**

* The shop has `<full count>` of `<card_2>` and exposes that count.
* `<card_2>` is listed at <grade10 browse listing url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_2>` | A card the shop has many of and exposes a count for |
| `<full count>` | `41` |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Raise `<card_2>`'s quantity to `<full count>`.
3. Raise `<card_2>`'s quantity once more.

**Expected Results:**

* `<card_2>` says `<full count>` are left.
* The quantity does not rise past `<full count>`.

## grade10-site-store-product-listing-US12: Collector signs in to add from the listing

**As a** signed-out collector on the browse listing,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

<!-- trace:case id=g10.store-product-listing.TC-ia6 rev=2 covers=g10.store-product-listing.SC-dhn,g10.store-product-listing.SC-xyt,g10.store-product-listing.SC-9gl -->
### grade10-site-store-product-listing-US12-TC4-2: Sign-in completes a tile add the shop still sells at a count of 0

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
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* customer is signed out, holds a member account, and is on <grade10 browse listing url>.
* <product_1> has one variant, inventory tracked at 0, Continue selling when out of stock on, set up in the staging shop's admin.
* 60 seconds have passed since the setup was saved.
* The member cart is empty.

**Test data:**

| Field | Value |
| --- | --- |
| <product_1> | A card with one variant |

**Steps:**

1. Type <product_1>'s name in the listing search and press Enter.
2. Click the add control on <product_1>'s tile.
3. Complete sign-in in the dialog with the member account.
4. Open the cart drawer.
5. Read <product_1>'s line.

**Expected Results:**

* Step 1: <product_1>'s tile reads available, with no remaining count shown.
* Step 2 opens the sign-in dialog and adds nothing yet.
* Step 3 closes the dialog and leaves the collector on the listing.
* Step 5: the line reads 1, with no adjusted or sold-out marking.

## Reconciliation

**Run:** QA2 on 2026-10-06, in a fresh context after the fifth acceptance
review's update and QA1's blind re-run. Read the anchors, these cases, the
durable US12 scenarios, `decisions.md`, the Product Listing and Product Status
pages and Grade10's tile cart control. US12-TC4-2 folds against SC-46 at its
durable rev 1: the tile arms an add of 1 (Q18), and sign-in completes it for
an item the shop still sells at a count of 0, which product-status SC-03 says
can be added. QA1 changed no case here and raised nothing. Every live case
folds, and no scenario is uncovered or contradicted.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `grade10-site-store-product-listing-US6-TC1-1` | Deprecated with US-06; `grade10-site-commerce-product-status-US2-TC2-2` walks a quantity above the count from the tile | Removed `The browse listing holds a collector to the shop's count` |
| `grade10-site-store-product-listing-US6-TC2-1` | Deprecated with US-06; `grade10-site-commerce-product-status-US2-TC4-2` walks an uncounted item | Removed `The browse listing holds a collector to the shop's count` |
| `grade10-site-store-product-listing-US6-TC3-1` | Deprecated with US-06; `grade10-site-commerce-product-status-US1-TC5-1` asserts no count on the tile | Removed `The browse listing says how many are left when that is news` |
| `grade10-site-store-product-listing-US6-TC4-1` | Deprecated with US-06; no count and no ceiling are both product-status rules | Removed `The browse listing says how many are left when that is news` |
| `grade10-site-store-product-listing-US12-TC4-2` | Folded: the add the tile arms completes after sign-in | SC-46; `grade10-site-commerce-product-status-SC-03` |

| Scenario | Cases |
| --- | --- |
| SC-44 | durable US12-TC1-1, unchanged |
| SC-45 | durable US12-TC2-1, unchanged |
| SC-46 | durable US12-TC3-1, US12-TC4-2 |
| Uncovered | none |
| Contradicted | none |

**Run:** Update on 2026-10-06, from the fifth acceptance review. The tile
has no quantity before its first add, and its first press adds 1, so a
signed-out add from the tile is always 1 (Q18). The delta no longer modifies
`Signed-out Add to cart opens sign-in`; SC-44 to SC-46 stay at their durable
rev 1. US12-TC4 moves to rev 2: it walked an add of 5 the tile cannot set
before its first add. It now walks the add the tile arms, 1 of an item the
shop still sells at a count of 0, which sign-in completes because a count of
0 on an item for sale bounds nothing. Raising the tile past the count is
`grade10-site-commerce-product-status-US2-TC2-2`'s tile row, and a sign-in
add above the count is the product page's US11-TC3-2. QA2 reruns on this
suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the fourth
acceptance review. Read the anchors, these cases, the delta's scenarios,
`tasks.md`, `decisions.md` and the Product Listing page. US12-TC4-1 folds
against SC-46 at rev 2: the member cart holds the 5 asked for, and the open
read reduces the line to the shop's 2, as cart-validation SC-05 states. Every
live case folds, the tables of the earlier QA2 run stand, and nothing was
raised.

**Run:** Update on 2026-10-06, from the fourth acceptance review. SC-46
moved to rev 2: it states the sign-in add of 5 against a count of 2 that the
requirement adds and US12-TC4-1 walks. No case changed. QA2 reruns on this
suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the third
acceptance review, which moved nothing in this capability. Task 2.2 now cites
SC-46 for a sign-in add of 5 against a count of 2, which US12-TC4-1 walks.
Every live case folds, the tables of the earlier QA2 run stand, and nothing
was raised.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the rebase. Read
the anchors, these cases and the durable suite's US12 cases, the delta's
scenarios, `tech-design.md`, `ui-design.md`, `tasks.md`, `decisions.md` and
the Product Listing and Product Status pages. Every live case folds, the four
US6 cases stay deprecated with US-06, and no scenario is uncovered. US12-TC4-1
now asserts the tile's stepper holds 5 with no ceiling. Nothing was raised;
Q6 stays the product manager's.

**Run:** Update on 2026-10-06, from the second acceptance review, after the
change was rebased on main. Each case keeps the `trace:case` id main or the
durable suite gave its number, its `rev` follows its heading, and its
`covers` names every scenario serving its journeys; a deprecated case covers
none. US12-TC4 takes a new id. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, in a fresh context. Read the anchors, these cases
and the durable suite's US12 cases, the delta's scenarios, `tech-design.md`,
`ui-design.md`, `tasks.md`, `decisions.md` and the Product Listing and Product
Status pages. Nothing was raised for this capability; Q6, the listing's order,
stays the product manager's and no case here depends on it.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `grade10-site-store-product-listing-US6-TC1-1` | Deprecated with US-06; `grade10-site-commerce-product-status-US2-TC2-2` walks a quantity above the count from the tile | Removed `The browse listing holds a collector to the shop's count` |
| `grade10-site-store-product-listing-US6-TC2-1` | Deprecated with US-06; `grade10-site-commerce-product-status-US2-TC4-2` walks an uncounted item | Removed `The browse listing holds a collector to the shop's count` |
| `grade10-site-store-product-listing-US6-TC3-1` | Deprecated with US-06; `grade10-site-commerce-product-status-US1-TC5-1` asserts no count on the tile | Removed `The browse listing says how many are left when that is news` |
| `grade10-site-store-product-listing-US6-TC4-1` | Deprecated with US-06; no count and no ceiling are both product-status rules | Removed `The browse listing says how many are left when that is news` |
| `grade10-site-store-product-listing-US12-TC4-1` | Folded: the sign-in add keeps the quantity asked for, and the cart's review answers it | SC-46; `grade10-site-store-cart-validation-SC-05` |

| Scenario | Cases |
| --- | --- |
| SC-44 | durable US12-TC1-1, unchanged |
| SC-45 | durable US12-TC2-1, unchanged |
| SC-46 | durable US12-TC3-1, US12-TC4-1 |
| Uncovered | none |
| Contradicted | none |

**Run:** Update on 2026-10-06, from the acceptance review. The suite holds only
the cases this change touches; the fold keeps every other durable case under
its id. US6-TC1 to US6-TC4 are deprecated with the retired US-06 journey;
`grade10-site-commerce-product-status-US-02` and
`grade10-site-store-cart-validation-US-01` replace them. US12-TC4 is new: a
sign-in add completes at a quantity above the shop's count. The tile rollup, the
missing stock cue and the uncapped quantity are product-status rules, proved by
that suite.

**Run:** Blind feature-TCS pass on 2026-09-24. Read the caller-supplied exact Purpose and Feature set for grade10-site/store/product-listing; openspec/changes/add-store-product-status/proposal.md and decisions.md including Raised; ui-design.md state descriptions without following their scenario references; the product-listing, product-page and product-status change-local user-journeys.md files; docs/prds/products/grade10-site/store/index.md, store/product-page.md, store/product-listing.md, commerce/index.md and commerce/product-status.md; openspec/config.yaml context; the durable product-listing feature suite for case-ID continuity only; docs/governance/specs-to-test-cases.md; and the current-major approved suite corpus (14 actual cases from shared/auth/sign-out and grade10-site/auction/bid-increments).

**Excluded:** Every spec.md file, all requirements and scenarios in openspec/specs/ and openspec/changes/add-store-product-status/specs/, and the archive tree. The Purpose and Feature set came from the caller; no spec file was opened. No scenario reference in ui-design was followed.

**Run:** 2026-10-06, QA1 blind re-run in a fresh context. Read: the capability's Purpose and Feature set, its user-journeys.md, the change's proposal.md, decisions.md with its Raised table, ui-design.md with its Anchor column set aside, the linked PRD pages, openspec/config.yaml's context, this suite above its Reconciliation, its Settled included, and the change's Store domain suite above its Reconciliation. Denied: every Requirements section, the scenarios, tech-design.md, tasks.md, QA2 material and openspec/changes/archive/.
