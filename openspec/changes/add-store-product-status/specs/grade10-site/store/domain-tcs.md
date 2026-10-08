# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-e2e-US2: Collector adds a product item from its page

**As a** collector,
**I want** to open a card from the Store front door and add its one sellable
item,
**so that** I can buy without returning to the listing.

<!-- trace:case id=g10.store-domain.TC-n5e rev=1 covers=none -->
### grade10-site-store-e2e-US2-TC1-1: Merchandised card adds the chosen variant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-product-page-US-03

**Pre-conditions:**

* <product> is in the merchandised row for the first collection the catalogue lists.
* <product> has more than one variant for sale, including <variant>.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A product in the merchandised row with more than one variant for sale |
| <variant> | An available variant different from the variant selected on opening |

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the card for <product> in the merchandised row.
3. Choose <variant> on the product page.
4. Add the chosen variant to the cart.

**Expected Results:**

* The merchandised row offers no way into the cart.
* Step 2 opens <product>'s own product page.
* The cart holds <variant>, not the variant selected on opening, and the page remains at <product>'s address.

<!-- trace:case id=g10.store-domain.TC-u3b rev=1 covers=g10.store-home.SC-vsc,g10.store-home.SC-mzp,g10.store-home.SC-o29,g10.store-home.SC-4sf,g10.store-home.SC-u8x,g10.store-home.SC-2ex,g10.store-product-page.SC-fpg,g10.store-product-page.SC-b01,g10.store-product-page.SC-y8c,g10.store-product-page.SC-o6j,g10.store-product-page.SC-gvt,g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-e2e-US2-TC2-1: Merchandised card adds its first item for sale

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
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-product-page-US-03, grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in with an empty cart and is on <grade10 store url>.
* <product> is in the merchandised row.
* <product>'s first listed variant is sold out by the recipe "Sell a card out", applied to that variant only.
* <product>'s second listed variant is for sale at <price_b>.

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A merchandised card with two variants, the first sold out and the second for sale |
| <price_b> | The second variant's price, different from the first's, for example HKD 123.00 (12300 minor units) |

**Steps:**

1. Read <product>'s tile in the merchandised row.
2. Click <product>'s tile.
3. Read the purchase area.
4. Click the add control in the purchase area.
5. Open the cart drawer if the add did not open it.
6. Read <product>'s line.

**Expected Results:**

* Step 1: the tile reads available.
* Step 2 opens <product>'s own page.
* Step 3: one price, <price_b>, and no size, option or variant choice.
* Step 6: the line is <product> at <price_b>, quantity 1, with no sold-out, adjusted or unchecked marking.

---

## grade10-site-store-e2e-US3: Collector checks a sold-out product from the front door

**As a** collector,
**I want** a sold-out card in the merchandised row to remain marked sold out
when I open it,
**so that** I can tell a sold-out card from a broken purchase page.

<!-- trace:case id=g10.store-domain.TC-g62 rev=2 covers=g10.store-home.SC-vsc,g10.store-home.SC-mzp,g10.store-home.SC-o29,g10.store-home.SC-4sf,g10.store-home.SC-u8x,g10.store-home.SC-2ex,g10.store-home.SC-00a,g10.store-home.SC-q66,g10.store-product-page.SC-prx,g10.store-product-page.SC-1p0 -->
### grade10-site-store-e2e-US3-TC1-2: Sold-out card keeps its status on the product page

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-home-US-06, grade10-site-store-product-page-US-04

**Pre-conditions:**

* customer is on <grade10 store url>.
* <product> is in the merchandised row.
* Every variant of <product> is sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| <product> | A merchandised card with two variants, both sold out |
| <price_a> | The first listed variant's price, different from the second's |

**Steps:**

1. Read <product>'s tile in the merchandised row.
2. Click <product>'s tile.
3. Read the purchase area.

**Expected Results:**

* Step 1: the tile reads sold out and offers no way into the cart.
* Step 2 opens <product>'s own page.
* Step 3: <price_a> is shown and the page reads sold out.
* Step 3: no variant choice, and nothing that adds <product> can be pressed.

---

## grade10-site-store-e2e-US7: Collector repairs a line that moved at checkout and pays

**As a** collector,
**I want** a line that moved as I checked out named in the cart, and the
repaired cart sent on to Shopify's payment page,
**so that** I pay only for a cart the shop can fill.

<!-- trace:case id=g10.store-domain.TC-hkl rev=1 covers=g10.store-cart-validation.SC-nv7,g10.store-cart-validation.SC-5dk,g10.store-cart-validation.SC-eqa,g10.store-cart-validation.SC-rpy,g10.store-cart-validation.SC-bl4,g10.store-cart-validation.SC-das,g10.store-cart-validation.SC-6ed,g10.store-cart-validation.SC-v8d,g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-vsd,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-e05,g10.store-checkout.SC-g07,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7,g10.store-checkout.SC-8hm -->
### grade10-site-store-e2e-US7-TC1-1: Line sold out at checkout is named, removed, then paid

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
* **Trace:** grade10-site-store-cart-validation-US-02, grade10-site-store-checkout-US-02, grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a> and 1 of <product_b>, both for sale.
* The cart's goods are under HKD 120,000.

**Test data:**

| Field | Value |
| --- | --- |
| <product_a> | A card for sale, at <price_a> |
| <product_b> | Another card for sale |

**Steps:**

1. Open the cart drawer.
2. In the staging shop's admin, set every variant of <product_b> to inventory 0, not sold when out of stock.
3. In the still-open drawer, click Proceed to Checkout.
4. Read the drawer.
5. Click the remove control on <product_b>'s line.
6. Click Proceed to Checkout.
7. Read Shopify's checkout page.

**Expected Results:**

* Step 1: both lines read current, with no marking.
* Step 3 leaves the browser on Grade10.
* Step 4: the drawer names <product_b> as sold out.
* Step 6 opens Shopify's checkout page.
* Step 7: the only line is <product_a> at <price_a>.

## Reconciliation

**Run:** QA2 on 2026-10-07, in a fresh context after an acceptance review
folded the stack in its acceptance order. Read US7-TC1-1, its story header, and
the checkout scenarios serving checkout US-01 and US-02 as the
`add-shopify-checkout-integration` amendment folds them, ahead of this change.
US7-TC1-1's `covers` was drawn from the checkout spec before that amendment: it
drops checkout SC-09, SC-10, SC-11, SC-19, SC-20 and SC-21, which the amendment
retires, and adds SC-33, SC-34, SC-35, SC-37 and SC-38, which serve the two
journeys after it. Its steps and results are unchanged: the press that finds
the sold-out line stays on Grade10, and the press after the repair opens
Shopify's checkout page. Nothing was raised.

**Run:** QA2 on 2026-10-07, in a fresh context after the sixth acceptance
review and QA1's blind re-run. Read this suite's story headers, its cases, the
scenarios they cover at their current revisions, `decisions.md` and the
Product Status, Product Details and Cart Validation pages. US7-TC1-1 now
covers cart-validation SC-29, a variant deleted while the cart was open, which
serves the checkout journey it walks. QA1 changed no case here and raised
nothing; every live case folds.

**Run:** QA2 on 2026-10-06, in a fresh context after the fifth acceptance
review's update and QA1's blind re-run. Read this suite's story headers, its
cases, the scenarios they cover at their current revisions, `decisions.md` and
the Product Status, Product Details and Cart Validation pages. US3-TC1-2
walks the revised US3: a sold-out card told from a broken purchase page.
US2-TC2-1 opens the drawer only if the page add did not. QA1 changed no case
here and raised nothing; every live case folds.

**Run:** Update on 2026-10-06, from the fifth acceptance review. US3 is
revised in its story header, and under `## MODIFIED User journeys` beside
this suite: a sold-out card is told from a broken purchase page, since
unavailable names a withdrawn cart line. US2-TC2-1 step 5 opens the cart
drawer only if the add did not open it, because Product Details' Buy opens it
after a page add. No case changed what it asserts. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the second and
third acceptance reviews. Read this suite's story headers, its cases, the
scenarios they cover at their current revisions, `decisions.md` and the
Product Status, Product Details and Cart Validation pages. US2-TC2-1 walks the
revised US2: the page's one item, no choice, and a line with no marking.
US3-TC1-2 expects that nothing adding the sold-out card can be pressed, as Q16
settles. US7-TC1-1 folds against cart-validation SC-15, SC-17 and SC-18 and
the checkout scenarios it covers. The validator's identical-path warning on
US3-TC1-1 and US3-TC1-2 is one case revised under one marker; the fold clears
it. Nothing was raised.

**Run:** Update on 2026-10-06, from the second acceptance review, after the
change was rebased on main. Each case keeps the `trace:case` id main or the
durable suite gave its number, its `rev` follows its heading, and its
`covers` names every scenario serving its journeys; a deprecated case covers
none. US2 is renamed for the one-item add, revised in its story header and
under `## MODIFIED User journeys` beside this suite, and US2-TC2 keeps
main's id for it; US3-TC1-2 revises the durable US3-TC1-1 under its marker,
so main's US3-TC2-1 draft is not carried; US7-TC1 takes a new id. QA2 reruns
on this suite.

**Run:** QA2 on 2026-10-06. US2-TC2 now opens the cart drawer to read the
line when the add did not open it. US7-TC1 is the path both
`grade10-site/store/cart-validation` and `grade10-site/store/checkout` name for a
line that moved at checkout (Q15). US3-TC1-2 replaces the durable US3-TC1-1 at
the fold.

**Run:** Update on 2026-10-06, from the acceptance review. The suite holds only
the paths this change touches; the fold keeps every other durable path under
its id. US2-TC1 is deprecated, since the page no longer offers a variant
choice, and US2-TC2 walks the one-item add in its place. US3-TC1 is revised for
the one item and the sold-out wording.

**Run:** 2026-09-24 · updated the Store's merchandised product add and sold-out paths to preserve the internal sale identity without a shopper-facing variant choice; unchanged Store paths and cases remain as they were.

**Run:** 2026-10-06, QA1 blind re-run in a fresh context. Read: the Store domain's and the four touched capabilities' user-journeys.md, the change's proposal.md, decisions.md with its Raised table, ui-design.md with its Anchor column set aside, the linked PRD pages, openspec/config.yaml's context, and the change's Store domain suite above its Reconciliation. Denied: every Requirements section, the scenarios, tech-design.md, tasks.md, QA2 material and openspec/changes/archive/. Level check: the Store domain is hit and carries this suite; Commerce has no domain suite and one touched capability; grade10-site has no product suite and the store no platform suite.
