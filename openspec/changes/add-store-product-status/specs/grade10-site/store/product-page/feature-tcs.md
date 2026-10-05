# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-site-store-product-page-US1: Collector reads a card at its own address

**As a** collector,
**I want** a product address to answer with that card's own page, and to refuse
when the catalogue holds no such card,
**so that** the page I read is the card the address names rather than an empty
product page.

<!-- trace:case id=g10.store-product-page.TC-dg4 rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC1-1: Product address answers with its named card

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
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**

* The catalogue holds <a card> at <its product address>.

**Steps:**

1. Navigate to <its product address>.
2. Read the product name and description.

**Expected Results:**

* The address opens <a card>'s product page.
* The page names the card and shows its description.

<!-- trace:case id=g10.store-product-page.TC-2l8 rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC2-1: Two product addresses answer with their own cards

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**

* The catalogue holds the card and address in each row.

**Test data:**

| Card | Address |
| --- | --- |
| <card A> | <product address A> |
| <card B> | <product address B> |

**Steps:**

1. Navigate to the address in the row.
2. Read the product name.

**Expected Results:**

* The address in each row opens that row's card.

<!-- trace:case id=g10.store-product-page.TC-plg rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC3-1: Unknown product address answers not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**

* The catalogue holds no card at <an unknown product address>.

**Steps:**

1. Navigate to <an unknown product address>.

**Expected Results:**

* The address answers 404 with the site's not-found page.

<!-- trace:case id=g10.store-product-page.TC-bng rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC4-1: Product details are present before scripts run

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
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**

* The catalogue holds <a card> at <its product address>.

**Steps:**

1. Open <its product address> with scripts disabled.
2. Read the product name and description from the page.

**Expected Results:**

* The initial page response contains the card's name and description.

---

## grade10-site-store-product-page-US2: Collector opens a card from the storefront

**As a** collector,
**I want** to reach a card's own address from the grid without a page load,
**so that** the card I opened is the one I land on, at an address that answers
on its own.

<!-- trace:case id=g10.store-product-page.TC-3jw rev=1 covers=g10.store-product-page.SC-wo0,g10.store-product-page.SC-21y -->
### grade10-site-store-product-page-US2-TC1-1: Card image opens its product address in place

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
* **Trace:** grade10-site-store-product-page-US-02

**Pre-conditions:**

* <A card> appears in <grade10 browse listing url>.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Open <a card> from its image.

**Expected Results:**

* <A card>'s product page opens without a full page load.
* The address names <a card>.

### grade10-site-store-product-page-US2-TC3-1: Card name opens the same product address

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
* **Trace:** grade10-site-store-product-page-US-02

**Pre-conditions:**

* <A card> appears in <grade10 browse listing url>.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Open <a card> from its name.

**Expected Results:**

* <A card>'s product page opens.
* The address names <a card>.

---

## grade10-site-store-product-page-US11: Collector signs in to add from the product page

**As a** signed-out collector on a product page,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

<!-- trace:case id=g10.store-product-page.TC-7e1 rev=1 covers=g10.store-product-page.SC-za5,g10.store-product-page.SC-eeg,g10.store-product-page.SC-0j7 -->
### grade10-site-store-product-page-US11-TC1-1: Signed-out add opens sign-in

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
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out on <a product page>.

**Steps:**

1. Activate Add to cart.

**Expected Results:**

* The sign-in dialog opens.
* No guest cart line is created.

<!-- trace:case id=g10.store-product-page.TC-5er rev=1 covers=g10.store-product-page.SC-za5,g10.store-product-page.SC-eeg,g10.store-product-page.SC-0j7 -->
### grade10-site-store-product-page-US11-TC2-1: Dismissing sign-in creates no product line

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out on <a product page> with the sign-in dialog open.

**Steps:**

1. Dismiss the sign-in dialog.
2. Open the cart.

**Expected Results:**

* No product page item is added to the cart.

<!-- trace:case id=g10.store-product-page.TC-maa rev=1 covers=g10.store-product-page.SC-za5,g10.store-product-page.SC-eeg,g10.store-product-page.SC-0j7 -->
### grade10-site-store-product-page-US11-TC3-1: Sign-in completes the product page add

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
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out on <a product page> with the sign-in dialog open.

**Steps:**

1. Complete sign-in.
2. Open the cart.

**Expected Results:**

* The product page item is added after sign-in.

---

## grade10-site-store-product-page-US12: Collector sees why sign-in is asked when adding from the product page

**As a** signed-out collector on a product page,
**I want** the sign-in dialog to say I am signing in to add to cart,
**so that** I know why the shop stopped the add.

<!-- trace:case id=g10.store-product-page.TC-ir3 rev=1 covers=g10.store-product-page.SC-zl0 -->
### grade10-site-store-product-page-US12-TC1-1: Sign-in title names the add

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-12

**Pre-conditions:**

* customer is signed out on <a product page> with the sign-in dialog open.

**Steps:**

1. Read the dialog title.

**Expected Results:**

* The title is Sign In to Add to Cart.

---

## grade10-site-store-product-page-US13: Collector shares a card and the preview shows it

**As a** collector,
**I want** a product link I pass on to unfurl with the card's own picture,
whole,
**so that** whoever receives it sees the card rather than a text-only preview
or one with its edges cut off.

<!-- trace:case id=g10.store-product-page.TC-kzr rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC1-1: Shared address unfurls with the card's first picture

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has a first catalogue picture.

**Steps:**

1. Paste <a card's product address> into <a message composer that unfurls links>.
2. Read the preview.

**Expected Results:**

* The preview shows <a card>'s first catalogue picture.

<!-- trace:case id=g10.store-product-page.TC-num rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC2-1: Preview fits the card whole on white

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has a catalogue picture with visible edges.

**Steps:**

1. Paste <a card's product address> into <a message composer that unfurls links>.
2. Inspect the preview picture.

**Expected Results:**

* The card fits wholly inside the preview box.
* The box is padded white and no card edge is cropped.

<!-- trace:case id=g10.store-product-page.TC-05a rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC3-1: Preview declares the delivered picture size

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has a catalogue picture returned at <the preview size>.

**Steps:**

1. Open <a card's product address>.
2. Read the picture's declared size and the delivered picture size.

**Expected Results:**

* The declared size matches the delivered picture.

<!-- trace:case id=g10.store-product-page.TC-8oe rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC4-1: Card without a picture has no preview image tag

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has no catalogue picture.

**Steps:**

1. Open <a card's product address>.
2. Read its unfurl metadata.

**Expected Results:**

* No preview image tag is present.

<!-- trace:case id=g10.store-product-page.TC-vr6 rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC5-1: Card with a picture declares a wide preview

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has a catalogue picture.

**Steps:**

1. Open <a card's product address>.
2. Read its declared preview shape.

**Expected Results:**

* The declared shape is wide.

<!-- trace:case id=g10.store-product-page.TC-fpn rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC6-1: Card without a picture declares a small preview

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has no catalogue picture.

**Steps:**

1. Open <a card's product address>.
2. Read its declared preview shape.

**Expected Results:**

* The declared shape is small.

### grade10-site-store-product-page-US13-TC10-1: Each shared card address unfurls with its own picture

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <Card A> and <Card B> have different first catalogue pictures.

**Steps:**

1. Paste <Card A's product address> into <a message composer that unfurls links>.
2. Paste <Card B's product address> into the same composer.
3. Compare both previews.

**Expected Results:**

* Each preview shows its own card's first picture.
* Neither preview shows the other card's picture.

### grade10-site-store-product-page-US13-TC11-1: Small original fills the preview box

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has a catalogue picture smaller than the preview box.

**Steps:**

1. Paste <a card's product address> into <a message composer that unfurls links>.
2. Inspect the preview picture.

**Expected Results:**

* The picture is enlarged to fill the preview box.
* The card remains whole.

### grade10-site-store-product-page-US13-TC12-1: Preview opens the card it describes

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**

* <A card> has a first catalogue picture.

**Steps:**

1. Paste <a card's product address> into <a message composer that unfurls links>.
2. Open the preview's product link.

**Expected Results:**

* The address opens <a card>'s product page.

---

## grade10-site-store-product-page-US3: Collector adds the product from its page

**As a** collector,
**I want** to choose a quantity and add the product's one sellable item from
its own page,
**so that** I can buy the quantity I chose without leaving the product page.

### grade10-site-store-product-page-US3-TC4-2: Product page offers one item without a shopper choice

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

* The product has a sellable item with a price and Shopify sale identity.

**Steps:**

1. Open the product page.
2. Inspect the purchase area.

**Expected Results:**

* The page shows the item's price and availability.
* No size, option, variant choice or variant label is shown.

### grade10-site-store-product-page-US3-TC5-2: Requested quantity above the count reaches cart review

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
* **Trace:** grade10-site-store-product-page-US-03

**Pre-conditions:**

* Shopify offers the product's internal sale item with inventory 1.

**Test data:**

| Requested quantity |
| ---: |
| 2 |

**Steps:**

1. Open the product page.
2. Request the quantity in the row.
3. Add the item.
4. Open the cart review.

**Expected Results:**

* The product page accepts the requested quantity without a stock-derived maximum.
* Cart review receives the requested quantity.

<!-- trace:case id=g10.store-product-page.TC-4xf rev=1 covers=g10.store-product-page.SC-jt1,g10.store-product-page.SC-b7g,g10.store-product-page.SC-qmb,g10.store-product-page.SC-tl5 -->
### grade10-site-store-product-page-US3-TC3-1: Adding the same item again keeps one cart line

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
* **Trace:** grade10-site-store-product-page-US-03

**Pre-conditions:**

* The cart already holds the product's internal sale item.

**Steps:**

1. Return to the product page.
2. Add the same item again.
3. Open the cart.

**Expected Results:**

* The cart holds one line for the product's item.

---

## grade10-site-store-product-page-US4: Collector meets a product that cannot be bought

**As a** collector,
**I want** a product whose one sellable item cannot be bought to say so where
the buying happens, while keeping its price visible,
**so that** I can tell a sold-out product from a page that failed.

<!-- trace:case id=g10.store-product-page.TC-mgl rev=2 covers=g10.store-product-page.SC-prx,g10.store-product-page.SC-1p0 -->
### grade10-site-store-product-page-US4-TC1-2: Unavailable item keeps its price and offers no add

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-04

**Pre-conditions:**

* Shopify does not offer the product's internal sale item.

**Steps:**

1. Open the product page.
2. Read the item's price and availability.
3. Look for an add control.

**Expected Results:**

* The item's price remains visible.
* The page says the item is sold out.
* No usable add control is offered.

### grade10-site-store-product-page-US4-TC3-2: Page does not offer another Shopify variant as a choice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-04

**Pre-conditions:**

* The product's internal sale item is unavailable.
* Shopify offers another variant of the product.

**Steps:**

1. Open the product page.
2. Inspect the purchase area.

**Expected Results:**

* The page keeps the internal item's price and sold-out state.
* No shopper-facing choice or label exposes the other variant.

## Reconciliation

**Run:** Implementation update on 2026-09-25. Kept the existing case IDs,
draft statuses and review history. Confirmed US3 and US4 cover the one
sellable item, internal sale identity, no shopper-facing variant choice,
unbounded requested quantity and unavailable-item price retention; the retired
US-05 stock-limit journey remains tombstoned in `user-journeys.md`.

**Run:** Blind feature-TCS pass on 2026-09-24. Read the caller-supplied exact Purpose and Feature set for grade10-site/store/product-page; openspec/changes/add-store-product-status/proposal.md and decisions.md including Raised; ui-design.md state descriptions without following their scenario references; the product-page and product-listing change-local user-journeys.md files; docs/prds/products/grade10-site/store/index.md, store/product-page.md, store/product-listing.md, commerce/index.md and commerce/product-status.md; openspec/config.yaml context; the durable product-page feature suite for case-ID continuity only; docs/governance/specs-to-test-cases.md; and the current-major approved suite corpus (14 actual cases from shared/auth/sign-out and grade10-site/auction/bid-increments). Product-page US03 and US04 cases use version 2 for one-item, no-choice and no-stock-ceiling behavior.

**Excluded:** Every spec.md file, all requirements and scenarios in openspec/specs/ and openspec/changes/add-store-product-status/specs/, and the archive tree. The Purpose and Feature set came from the caller; no spec file was opened. No scenario reference in ui-design was followed.
