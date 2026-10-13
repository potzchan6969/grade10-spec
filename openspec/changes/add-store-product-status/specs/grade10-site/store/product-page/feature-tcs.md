# grade10-site/store/product-page Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-page-US1: Collector reads a card at its own address

**As a** collector,
**I want** a product address to answer with that card's own page, and to refuse
when the catalogue holds no such card,
**so that** the page I read is the card the address names rather than an empty
product page.

<!-- trace:case id=g10.store-product-page.TC-dg4 rev=2 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC1-2: Card answers whole before scripts run

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**

* JavaScript is disabled in the browser.
* <product> is set up in the staging shop's admin as the row says, sold out by the recipe "Sell a card out" where the row says sold out.

**Test data:**

| Row | <product>'s variants | Price in the page | Availability in the page |
| --- | --- | --- | --- |
| First listed sold out | First sold out at <price_a>, second for sale at <price_b> | <price_b> | For sale |
| Every one sold out | Both sold out, first at <price_a>, second at <price_b> | <price_a> | Sold out |

**Steps:**

1. Navigate to <product url>.
2. Read the rendered page.
3. Open the page source.

**Expected Results:**

* Step 1 answers 200 and the card page renders; URL contains <lang>.
* Step 3 carries <product>'s name, its description, and the row's price and availability.
* Step 3 carries neither the other variant's price nor any variant name, and no variant choice.

## grade10-site-store-product-page-US3: Collector adds the product from its page

**As a** collector,
**I want** to choose a quantity and add the product's one sellable item from
its own page,
**so that** I can buy the quantity I chose without leaving the product page.

<!-- trace:case id=g10.store-product-page.TC-y9w rev=2 covers=g10.store-product-page.SC-fpg,g10.store-product-page.SC-b01,g10.store-product-page.SC-y8c,g10.store-product-page.SC-o6j,g10.store-product-page.SC-gvt -->
### grade10-site-store-product-page-US3-TC1-2: Several-variant card adds its first item for sale at the chosen quantity

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-03

**Pre-conditions:**

* customer(member) is signed in with an empty cart.
* <product>'s first listed variant is sold out by the recipe "Sell a card out", applied to that variant only.
* <product>'s second and third listed variants are for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A card with three variants, priced differently |
| <price_b> | The second listed variant's price, for example HKD 70.00 (7000 minor units) |
| Quantity | 3 |

**Steps:**

1. Navigate to <product url>.
2. Read the purchase area.
3. Set the quantity to 3.
4. Click the add control.
5. Open the cart drawer if the add did not open it.
6. Read the lines and the URL.

**Expected Results:**

* Step 2: one price, <price_b>, and no size, option or variant choice or variant name.
* Step 6: one line, 3 of <product> at <price_b>.
* Step 6: the URL is still <product url>.

<!-- trace:case id=g10.store-product-page.TC-whz rev=2 covers=g10.store-product-page.SC-fpg,g10.store-product-page.SC-b01,g10.store-product-page.SC-y8c,g10.store-product-page.SC-o6j,g10.store-product-page.SC-gvt -->
### grade10-site-store-product-page-US3-TC2-2: Single-variant card adds its item

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
* **Trace:** grade10-site-store-product-page-US-03

**Pre-conditions:**

* customer(member) is signed in with an empty cart.
* <product> has one variant, for sale.

**Steps:**

1. Navigate to <product url>.
2. Read the cart in the site header.
3. Click the add control.
4. Read the cart in the site header.
5. Open the cart drawer if the add did not open it.
6. Read the lines and the URL.

**Expected Results:**

* Step 4: the cart in the site header shows 1 item, where step 2 showed none.
* Step 6: one line of <product>, quantity 1.
* Step 6: the URL is still <product url>.

<!-- trace:case id=g10.store-product-page.TC-4xf rev=2 covers=g10.store-product-page.SC-fpg,g10.store-product-page.SC-b01,g10.store-product-page.SC-y8c,g10.store-product-page.SC-o6j,g10.store-product-page.SC-gvt -->
### grade10-site-store-product-page-US3-TC3-2: Adding the same item again keeps one line

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-03

**Pre-conditions:**

* customer(member) is signed in with an empty cart.
* <product> has one variant, for sale, tracked at 10.

**Steps:**

1. Navigate to <product url>.
2. Click the add control at quantity 1.
3. Close the cart drawer if the add opened it.
4. Set the quantity to 2.
5. Click the add control.
6. Open the cart drawer if the add did not open it.
7. Read the lines.

**Expected Results:**

* Step 7: one line of <product>, quantity 3.

---

## grade10-site-store-product-page-US4: Collector meets a product that cannot be bought

**As a** collector,
**I want** a product whose one sellable item cannot be bought to say so where
the buying happens, while keeping its price visible,
**so that** I can tell a sold-out product from a page that failed.

<!-- trace:case id=g10.store-product-page.TC-mgl rev=2 covers=g10.store-product-page.SC-prx,g10.store-product-page.SC-1p0 -->
### grade10-site-store-product-page-US4-TC1-2: Sold-out card keeps its price and cannot be added

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
* **Trace:** grade10-site-store-product-page-US-04

**Pre-conditions:**

* Every variant of <product> is sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A card with two variants, priced differently |
| <price_a> | The first listed variant's price |

**Steps:**

1. Navigate to <product url>.
2. Read the purchase area.

**Expected Results:**

* Step 2: the page reads sold out and shows <price_a>.
* Step 2: nothing that adds <product> can be pressed.

<!-- trace:case id=g10.store-product-page.TC-cdc rev=2 covers=g10.store-product-page.SC-prx,g10.store-product-page.SC-1p0 -->
### grade10-site-store-product-page-US4-TC2-2: Card whose first variant is sold out still reads for sale

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
* **Trace:** grade10-site-store-product-page-US-04

**Pre-conditions:**

* <product>'s first listed variant is sold out by the recipe "Sell a card out", applied to that variant only.
* <product>'s second listed variant is for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A card with two variants, priced differently |
| <price_b> | The second listed variant's price |

**Steps:**

1. Navigate to <product url>.
2. Read the purchase area.

**Expected Results:**

* Step 2: the page reads for sale at <price_b>, and its add control can be pressed.
* Step 2: the sold-out variant is shown neither as a choice nor as sold out.

## grade10-site-store-product-page-US5: Collector takes the last of a grade from its page

**As a** collector,
**I want** the page to stop me at what the shop has of the grade I chose, and
to say how many that is,
**so that** the quantity I take to the cart is one the shop can fill.

<!-- trace:case id=g10.store-product-page.TC-cn0 rev=1 covers=none -->
### grade10-site-store-product-page-US5-TC1-1: Nearly out is said and the quantity stops there

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
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop has `<low count>` of `<card_1>`'s `<low grade>` and exposes that count.
* customer is on `<card_1>`'s product page with `<low grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_1>` | A card with a grade the shop has few of |
| `<low grade>` | The grade of `<card_1>` the shop is nearly out of |
| `<low count>` | `3` |

**Steps:**

1. Read what the page says about how many are left.
2. Raise the quantity past `<low count>`.

**Expected Results:**

* Step 1 says `<low count>` are left.
* The quantity stays at `<low count>`.

<!-- trace:case id=g10.store-product-page.TC-yzw rev=1 covers=none -->
### grade10-site-store-product-page-US5-TC2-1: Grade the shop counts nothing for is not capped

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
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop exposes no count for `<card_2>`'s `<uncounted grade>`.
* customer is on `<card_2>`'s product page with `<uncounted grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_2>` | A card with a grade the shop exposes no count for |
| `<uncounted grade>` | The grade of `<card_2>` the shop exposes no count for |
| `<asked quantity>` | `4` |

**Steps:**

1. Raise the quantity to `<asked quantity>`.

**Expected Results:**

* The quantity rises to `<asked quantity>`.

<!-- trace:case id=g10.store-product-page.TC-sr6 rev=1 covers=none -->
### grade10-site-store-product-page-US5-TC3-1: Choosing another grade brings that grade's ceiling

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
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop has `<scarce count>` of `<card_3>`'s `<scarce grade>` and `<roomy count>` of its `<roomy grade>`, and exposes both counts.
* customer is on `<card_3>`'s product page with `<scarce grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_3>` | A card listing two grades the shop has different counts of |
| `<scarce grade>` | The grade of `<card_3>` the shop has fewest of |
| `<roomy grade>` | The grade of `<card_3>` the shop has most of |
| `<scarce count>` | `2` |
| `<roomy count>` | `10` |

**Steps:**

1. Choose `<roomy grade>`.
2. Raise the quantity to `<roomy count>`.

**Expected Results:**

* The quantity rises to `<roomy count>`.

<!-- trace:case id=g10.store-product-page.TC-ub9 rev=1 covers=none -->
### grade10-site-store-product-page-US5-TC4-1: A well-stocked grade says nothing until every one is asked for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-05

**Pre-conditions:**

* The shop has `<full count>` of `<card_4>`'s `<full grade>` and exposes that count.
* customer is on `<card_4>`'s product page with `<full grade>` chosen.

**Test data:**

| Field | Value |
| --- | --- |
| `<card_4>` | A card with a grade the shop has many of |
| `<full grade>` | The grade of `<card_4>` the shop has many of |
| `<full count>` | `41` |

**Steps:**

1. Read what the page says about how many are left.
2. Raise the quantity to `<full count>`.
3. Raise the quantity once more.

**Expected Results:**

* Step 1 says nothing about how many are left.
* After step 2 the page says `<full count>` are left.
* The quantity does not rise past `<full count>`.

---

## grade10-site-store-product-page-US11: Collector signs in to add from the product page

**As a** signed-out collector on a product page,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

<!-- trace:case id=g10.store-product-page.TC-maa rev=2 covers=g10.store-product-page.SC-za5,g10.store-product-page.SC-eeg,g10.store-product-page.SC-0j7 -->
### grade10-site-store-product-page-US11-TC3-2: Sign-in on the product page completes the add

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out, holds a member account, and is on <product url>.
* <product> has one variant, for sale, set up in the staging shop's admin as the row says.
* The member cart is empty.

**Test data:**

| Row | <product>'s variant in the staging shop's admin | Requested | Line reads |
| --- | --- | --- | --- |
| No count | Track quantity off | 2 | 2, with no adjusted or sold-out marking |
| Above the count | Inventory tracked at 2, not sold when out of stock | 5 | 2, marked adjusted, saying the shop can fill only that many |

**Steps:**

1. Set the quantity to the row's requested quantity.
2. Click the add control.
3. Complete sign-in in the dialog with the member account.
4. Open the cart drawer if the add did not open it.
5. Read <product>'s line.

**Expected Results:**

* Step 1 holds the requested quantity, with no ceiling and no remaining count shown.
* Step 2 opens the sign-in dialog and adds nothing yet.
* Step 3 closes the dialog and leaves the collector on <product url>.
* Step 5: one line of <product>, reading as the row says.

## Settled

- A sold-out item keeps its quantity stepper and a Sold out button, both disabled: nothing that adds it can be pressed.
- A card's structured data carries one offer, for its one item, as the page shows it.

## Reconciliation

**Run:** QA2 on 2026-10-07, in a fresh context after the sixth acceptance
review and QA1's blind re-run. Read the anchors, these cases, the delta's
scenarios, `tech-design.md`, `ui-design.md`, `tasks.md`, `decisions.md`, the
Product Details and Crawlable Pages pages and Grade10's structured data. QA1
added a header read to US3-TC2-2: the cart in the site header counts the add,
which SC-35 states, so the draft keeps rev 2. QA1's question on the card's
structured data lands as Q24: one offer, for the one item, because Crawlable
Pages restates only what the page shows. It is a Crawlable Pages line, which
no requirement states, so no scenario is added; task 2.4 delivers it. Every
live case folds, the tables of the earlier QA2 run stand, and no scenario is
uncovered or contradicted.

| Raised | Disposition |
| --- | --- |
| Does a card's structured data carry one offer for its one item, or one per variant? | Q24, decided: one offer, for the one item; Crawlable Pages carries it as a 🚧 line and task 2.4 fixes Grade10's offer per variant |

**Run:** QA2 on 2026-10-06, in a fresh context after the fifth acceptance
review's update and QA1's blind re-run. Read the anchors, these cases, the
delta's scenarios, `tasks.md`, `decisions.md`, the Product Details and Product
Status pages. QA1 changed no case here and raised nothing. Each case that
reads the cart after a page add opens the drawer only if the add did not, as
Buy opens it. US11-TC3-2 alone walks a sign-in add above the shop's count,
against SC-28 at rev 3. Q19's second line for a card whose one item moved is
product-status SC-18, not a second add of the same item, so SC-36 stands. Every
live case folds, the tables of the earlier QA2 run stand, and no scenario is
uncovered or contradicted.

**Run:** Update on 2026-10-06, from the fifth acceptance review. A case that
reads the cart after a page add opens the drawer only if the add did not open
it, because Buy opens it once the add settles. The listing's US12-TC4 now
walks the 1 the tile arms (Q18), so US11-TC3-2 alone walks a sign-in add above
the shop's count. No case changed what it asserts. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the fourth
acceptance review. Read the anchors, these cases, the delta's scenarios,
`tasks.md`, `decisions.md` and the Product Details page. US11-TC3-2 folds
against SC-28 at rev 3: its Above the count row asks for 5 of an item counted
at 2, the member cart holds 5, and the open read shows 2, adjusted. Settled
now carries Q16. Every live case folds, the tables of the earlier QA2 run
stand, and nothing was raised.

**Run:** Update on 2026-10-06, from the fourth acceptance review. SC-28
moved to rev 3: it states the sign-in add of 5 against a count of 2 that the
requirement adds and US11-TC3-2's Above the count row walks. No case changed.
QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the third
acceptance review. Read the anchors, these cases, the delta's scenarios,
`ui-design.md`, `tasks.md`, `decisions.md`, the Product Details and Product
Status pages and Grade10's purchase panel. US4-TC1-2 folds against SC-11 at
rev 2. Its title now reads that the card cannot be added: "offers nothing to
press" could be read as no button, and the page shows a disabled Sold out
button (Q16). Task 2.2's sign-in add of 5 against a count of 2 is US11-TC3-2's
Above the count row. Every live case folds, the tables of the earlier QA2 run
stand, and nothing was raised.

**Run:** Update on 2026-10-06, from the third acceptance review. The sold-out
requirement now reads that nothing on the page can be pressed to add the
item, as the built page shows a disabled Sold out button (Q16). SC-11 already
said so, and no case changed. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the rebase. Read
the anchors, these cases and the durable suite's US1, US11 and US12 cases, the
delta's scenarios, `tech-design.md`, `ui-design.md`, `tasks.md`,
`decisions.md`, the Product Details, Product Listing and Product Status pages
and the Grade10 cart drawer. Every live case folds and no scenario is
uncovered. The sign-in add at the quantity asked for whatever the shop's
count, which the modified sign-in requirement states, had no case on the page
though the listing's US12-TC4-1 walks it; US11-TC3-2 takes it as its Above the
count row and keeps rev 2, since it is still a draft. Nothing was raised.

**Run:** Update on 2026-10-06, from the second acceptance review, after the
change was rebased on main. Each case keeps the `trace:case` id main or the
durable suite gave its number, its `rev` follows its heading, and its
`covers` names every scenario serving its journeys; a deprecated case covers
none. SC-37, a chosen quantity of 3 added on one line, is new; US3-TC1 now sets 3 and
covers it. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, in a fresh context. Read the anchors, these cases
and the durable suite's US1 and US11 cases, the delta's scenarios,
`tech-design.md`, `ui-design.md`, `tasks.md`, `decisions.md`, the Product
Details page and the `redesign-store-product-detail-page` delta. Nothing was
raised for this capability. US3-TC1 asserted the pending label, the drawer
opening and the stepper reset, which are the redesign's add-in-place rule
(Q5), not this change's; QA2 trims them, and US3-TC1, US3-TC2 and US3-TC3 open
the cart drawer to read it.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `grade10-site-store-product-page-US1-TC1-2` | Folded | SC-01, SC-12 |
| `grade10-site-store-product-page-US3-TC1-2` | Folded; the redesign's pending, drawer and reset steps removed | SC-33, SC-35, SC-37 |
| `grade10-site-store-product-page-US3-TC2-2` | Folded; step 3 opens the cart drawer | SC-34, SC-35 |
| `grade10-site-store-product-page-US3-TC3-2` | Folded; step 3 closes the cart drawer only if the add opened it, and step 6 opens it | SC-36 |
| `grade10-site-store-product-page-US4-TC1-2` | Folded | SC-11 |
| `grade10-site-store-product-page-US4-TC2-2` | Folded | SC-12 |
| `grade10-site-store-product-page-US5-TC1-1` | Deprecated with US-05; `grade10-site-commerce-product-status-US2-TC2-2` walks a quantity above the count from the page | Removed `A card's page holds a collector to the shop's count` |
| `grade10-site-store-product-page-US5-TC2-1` | Deprecated with US-05; `grade10-site-commerce-product-status-US2-TC4-2` walks an uncounted item | Removed `A card's page holds a collector to the shop's count` |
| `grade10-site-store-product-page-US5-TC3-1` | Deprecated with US-05; the page offers no grade to choose | Removed `A card's page holds a collector to the shop's count` |
| `grade10-site-store-product-page-US5-TC4-1` | Deprecated with US-05; `grade10-site-commerce-product-status-US1-TC5-1` asserts no count on the page | Removed `A card's page says how many are left when that is news` |
| `grade10-site-store-product-page-US11-TC3-2` | Folded; its Above the count row walks a sign-in add above the shop's count | SC-28; `grade10-site-store-cart-validation-SC-05` |

| Scenario | Cases |
| --- | --- |
| SC-01 | US1-TC1 |
| SC-02 | durable US1-TC2-1, unchanged |
| SC-11 | US4-TC1 |
| SC-12 | US4-TC2, US1-TC1 |
| SC-26 | durable US11-TC1-1, unchanged |
| SC-27 | durable US11-TC2-1, unchanged |
| SC-28 | US11-TC3 |
| SC-33 | US3-TC1 |
| SC-34 | US3-TC2 |
| SC-35 | US3-TC1, US3-TC2 |
| SC-36 | US3-TC3 |
| SC-37 | US3-TC1 |
| Uncovered | none |
| Contradicted | none |

**Run:** Update on 2026-10-06, from the acceptance review. The suite holds only
the cases this change touches; the fold keeps every other durable case under
its id. US1-TC1, US3-TC1, US3-TC3, US4-TC1 and US4-TC2 are revised under their
durable markers for the one item, and US11-TC3 for the item a sign-in add
completes. US5-TC1 to US5-TC4 are deprecated with the
retired US-05 journey; `grade10-site-commerce-product-status-US-02` and
`grade10-site-store-cart-validation-US-01` replace them. The case for a
quantity above the shop's count moved to the product-status suite.

**Run:** Blind feature-TCS pass on 2026-09-24. Read the caller-supplied exact Purpose and Feature set for grade10-site/store/product-page; openspec/changes/add-store-product-status/proposal.md and decisions.md including Raised; ui-design.md state descriptions without following their scenario references; the product-page and product-listing change-local user-journeys.md files; docs/prds/products/grade10-site/store/index.md, store/product-page.md, store/product-listing.md, commerce/index.md and commerce/product-status.md; openspec/config.yaml context; the durable product-page feature suite for case-ID continuity only; docs/governance/specs-to-test-cases.md; and the current-major approved suite corpus (14 actual cases from shared/auth/sign-out and grade10-site/auction/bid-increments). Product-page US03 and US04 cases use version 2 for one-item, no-choice and no-stock-ceiling behavior.

**Excluded:** Every spec.md file, all requirements and scenarios in openspec/specs/ and openspec/changes/add-store-product-status/specs/, and the archive tree. The Purpose and Feature set came from the caller; no spec file was opened. No scenario reference in ui-design was followed.

**Run:** 2026-10-06, QA1 blind re-run in a fresh context. Read: the capability's Purpose and Feature set, its user-journeys.md, the change's proposal.md, decisions.md with its Raised table, ui-design.md with its Anchor column set aside, the linked PRD pages, openspec/config.yaml's context, this suite above its Reconciliation, its Settled included, and the change's Store domain suite above its Reconciliation. Denied: every Requirements section, the scenarios, tech-design.md, tasks.md, QA2 material and openspec/changes/archive/.
