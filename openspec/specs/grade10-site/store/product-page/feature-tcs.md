# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-product-page-US1: Collector reads a card at its own address

**As a** collector,
**I want** a product address to answer with that card's own page, and to refuse
when the catalogue holds no such card,
**so that** the page I read is the card the address names rather than an empty
product page.

<!-- trace:case id=g10.store-product-page.TC-dg4 rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC1-1: Card answers whole before scripts run

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
The catalogue holds <a published card>. JavaScript disabled in the browser.

**Steps:**

1. Navigate to <a published card url>.
2. Check the rendered page.
3. Check the page source.

**Expected Results:**

* Response status is 200 and the card page renders.
* URL contains <lang>.
* Page source carries that card's name, description, and a price for every variant it lists.

<!-- trace:case id=g10.store-product-page.TC-2l8 rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC2-1: Two cards answer as two pages

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**
The catalogue holds two cards.

**Steps:**

1. Navigate to <a published card url> and note name, price, title, meta description and `og:url`.
2. Navigate to <a second published card url> and note the same.

**Expected Results:**

* Each response carries its own card's name and price.
* Each response carries its own title, meta description and `og:url`.

<!-- trace:case id=g10.store-product-page.TC-plg rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC3-1: Unknown handle answers 404 with not-found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <a product url naming no card>.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 404.
* The site's not-found surface is shown, not an empty product page.

<!-- trace:case id=g10.store-product-page.TC-bng rev=1 covers=g10.store-product-page.SC-b5k,g10.store-product-page.SC-ok3,g10.store-product-page.SC-f3e,g10.store-product-page.SC-lk8 -->
### grade10-site-store-product-page-US1-TC4-1: Card added to the catalogue answers

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-01

**Pre-conditions:**
The catalogue holds <a newly added card>.

**Steps:**

1. Navigate to <a newly added card url>.

**Expected Results:**

* Response status is 200 and carries that card's page.

---

## grade10-site-store-product-page-US2: Collector opens a card from the storefront

**As a** collector,
**I want** to reach a card's own address from the grid without a page load,
**so that** the card I opened is the one I land on, at an address that answers
on its own.

<!-- trace:case id=g10.store-product-page.TC-3jw rev=2 covers=g10.store-product-page.SC-wo0,g10.store-product-page.SC-21y -->
### grade10-site-store-product-page-US2-TC1-2: Card opens from each storefront grid at its own address

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-product-page-US-02

**Pre-conditions:**

* `<card_1>` is for sale and shows on the listing's first page at rest.
* `<card_2>` is for sale and shows in the front door's row of cards.
* `<card_3>`'s rail shows `<card_4>`, for sale, set by the recipe "Choose picks on a staging-shop card".

**Test data:**

| Start | Card | Control |
| --- | --- | --- |
| `<grade10 browse listing url>` | `<card_1>` | its name |
| `<grade10 browse listing url>` | `<card_1>` | its photo |
| `<grade10 store url>` | `<card_2>` in the front door's row of cards | its name |
| `<card_3>`'s product page | `<card_4>` in the rail under the card | its name |

**Steps:**

1. Navigate to the row's **Start**.
2. Scroll until the row's **Card** shows.
3. Click the row's **Control** on that card.
4. Reload the page.

**Expected Results:**

* Step 3 opens the row's **Card**'s page, at `<lang>/store/products/<handle>` for that card.
* Step 3 renders that page without a full document load.
* Step 4 renders the same card at the same address.

<!-- trace:case id=g10.store-product-page.TC-xjy rev=1 covers=g10.store-product-page.SC-wo0,g10.store-product-page.SC-21y -->
### grade10-site-store-product-page-US2-TC2-1: Sitemap names no unfilled product pattern

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-02

**Pre-conditions:**
None.

**Steps:**

1. Fetch <grade10 sitemap url>.
2. Check every entry.

**Expected Results:**

* Every entry is an address a collector can fetch.
* None of them carries an unfilled parameter.

---

## grade10-site-store-product-page-US3: Collector adds a variant to the cart

**As a** collector,
**I want** to add the variant I chose from the card's own page,
**so that** I can buy the grade I picked without leaving the card or returning
to the grid.

<!-- trace:case id=g10.store-product-page.TC-y9w rev=1 covers=g10.store-product-page.SC-jt1,g10.store-product-page.SC-b7g,g10.store-product-page.SC-qmb,g10.store-product-page.SC-tl5 -->
### grade10-site-store-product-page-US3-TC1-1: Chosen grade is added, not the opening variant

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
A card whose page lists more than one variant for sale.

**Steps:**

1. Navigate to <a multi-variant card url>.
2. Choose a variant that is not the one the page opened with.
3. Add it.

**Expected Results:**

* The cart holds that variant, and not the one the page opened with.
* The collector is still on that card's address.
* What the site says the cart holds has changed to account for it.

<!-- trace:case id=g10.store-product-page.TC-whz rev=1 covers=g10.store-product-page.SC-jt1,g10.store-product-page.SC-b7g,g10.store-product-page.SC-qmb,g10.store-product-page.SC-tl5 -->
### grade10-site-store-product-page-US3-TC2-1: Single-variant card needs no choice

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-03

**Pre-conditions:**
A card whose page lists one variant for sale.

**Steps:**

1. Navigate to <a single-variant card url>.
2. Add it without choosing anything.

**Expected Results:**

* The cart holds that variant.
* The collector is still on that card's address.

<!-- trace:case id=g10.store-product-page.TC-4xf rev=1 covers=g10.store-product-page.SC-jt1,g10.store-product-page.SC-b7g,g10.store-product-page.SC-qmb,g10.store-product-page.SC-tl5 -->
### grade10-site-store-product-page-US3-TC3-1: Same variant twice is one line

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-page-US-03

**Pre-conditions:**
A collector has already added a variant from a card's page.

**Steps:**

1. Navigate to that card's address.
2. Add the same variant again.

**Expected Results:**

* The cart holds the quantity they added, as one line rather than two.

---

## grade10-site-store-product-page-US4: Collector meets a card with nothing for sale

**As a** collector,
**I want** a card that cannot be bought to say so where the buying happens,
still carrying its prices,
**so that** I can tell a card that sold from a page that failed.

<!-- trace:case id=g10.store-product-page.TC-mgl rev=1 covers=g10.store-product-page.SC-prx,g10.store-product-page.SC-1p0 -->
### grade10-site-store-product-page-US4-TC1-1: Sold-out card keeps prices and offers no add

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-04

**Pre-conditions:**
A card the catalogue lists with no variant for sale.

**Steps:**

1. Navigate to <a sold-out card url>.
2. Check the buying area and every listed variant.

**Expected Results:**

* The page says the card cannot be bought.
* Every variant it lists is still priced.
* There is nothing to press that would add it.

<!-- trace:case id=g10.store-product-page.TC-cdc rev=1 covers=g10.store-product-page.SC-prx,g10.store-product-page.SC-1p0 -->
### grade10-site-store-product-page-US4-TC2-1: Mixed availability is said per variant

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-04

**Pre-conditions:**
A card listing one variant for sale and one sold out.

**Steps:**

1. Navigate to <a mixed-availability card url>.
2. Check each variant.
3. Choose the sold-out variant.

**Expected Results:**

* Each variant reads as for sale or sold out on its own.
* Adding is offered for the one for sale.
* Choosing the sold-out one offers no add.

---

## grade10-site-store-product-page-US5: Collector takes the last of a grade from its page

**As a** collector,
**I want** the page to stop me at what the shop has of the grade I chose, and
to say how many that is,
**so that** the quantity I take to the cart is one the shop can fill.

<!-- trace:case id=g10.store-product-page.TC-cn0 rev=1 covers=g10.store-product-page.SC-yw4,g10.store-product-page.SC-1e2,g10.store-product-page.SC-yyk,g10.store-product-page.SC-vkx,g10.store-product-page.SC-hvy,g10.store-product-page.SC-82g -->
### grade10-site-store-product-page-US5-TC1-1: Nearly out is said and the quantity stops there

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
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

<!-- trace:case id=g10.store-product-page.TC-yzw rev=1 covers=g10.store-product-page.SC-yw4,g10.store-product-page.SC-1e2,g10.store-product-page.SC-yyk,g10.store-product-page.SC-vkx,g10.store-product-page.SC-hvy,g10.store-product-page.SC-82g -->
### grade10-site-store-product-page-US5-TC2-1: Grade the shop counts nothing for is not capped

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

<!-- trace:case id=g10.store-product-page.TC-sr6 rev=1 covers=g10.store-product-page.SC-yw4,g10.store-product-page.SC-1e2,g10.store-product-page.SC-yyk,g10.store-product-page.SC-vkx,g10.store-product-page.SC-hvy,g10.store-product-page.SC-82g -->
### grade10-site-store-product-page-US5-TC3-1: Choosing another grade brings that grade's ceiling

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

<!-- trace:case id=g10.store-product-page.TC-ub9 rev=1 covers=g10.store-product-page.SC-yw4,g10.store-product-page.SC-1e2,g10.store-product-page.SC-yyk,g10.store-product-page.SC-vkx,g10.store-product-page.SC-hvy,g10.store-product-page.SC-82g -->
### grade10-site-store-product-page-US5-TC4-1: A well-stocked grade says nothing until every one is asked for

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
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

## grade10-site-store-product-page-US10: Collector opens Store Locator from free pick-up

**As a** collector,
**I want** free pick-up at Hong Kong Grade10 Store on a product page to open
Store Locator,
**so that** I see the same shop's address and hours before I choose pickup.

<!-- trace:case id=g10.store-product-page.TC-ka9 rev=1 covers=g10.store-product-page.SC-21b,g10.store-product-page.SC-res -->
### grade10-site-store-product-page-US10-TC1-1: Free pick-up store name opens Store Locator

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-10

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| `<product>` |
| --- |
| A card with its one item for sale |
| A sold-out card |

**Steps:**

1. Navigate to <grade10 product url> for `<product>`.
2. Find the free pick-up claim on the page.
3. Click the store name in the claim.

**Expected Results:**

* Step 2: the claim names Hong Kong Grade10 Store, and the name is a link.
* Step 3 opens Store Locator in the same tab, the Location & Hours heading showing.

<!-- trace:case id=g10.store-product-page.TC-q55 rev=1 covers=g10.store-product-page.SC-21b,g10.store-product-page.SC-res -->
### grade10-site-store-product-page-US10-TC2-1: Shipping label with no page behind it is not a link

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
* **Trace:** grade10-site-store-product-page-US-10

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A card with its one item for sale |

**Steps:**

1. Navigate to <grade10 product url> for `<product>`.
2. Find Shipping fee in the line Shipping calculated at checkout.
3. Click Shipping fee.
4. Press Tab through the page from the card's name to the footer.

**Expected Results:**

* Step 2: Shipping fee is text, not a link.
* Step 3 leaves the page and its address unchanged, with no `#` added.
* Step 4 stops on the pick-up store name and skips Shipping fee.

---

## grade10-site-store-product-page-US11: Collector signs in to add from the product page

**As a** signed-out collector on a product page,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

<!-- trace:case id=g10.store-product-page.TC-7e1 rev=1 covers=g10.store-product-page.SC-za5,g10.store-product-page.SC-eeg,g10.store-product-page.SC-0j7 -->
### grade10-site-store-product-page-US11-TC1-1: Signed-out Add to cart opens sign-in

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

* customer is signed out and is on <grade10 product url> that offers Add to cart.
* The product is not sold out.

**Steps:**

1. Note the cart line count for that product.
2. Activate Add to cart.
3. Check the dialog and the cart.

**Expected Results:**

* The sign-in dialog opens over the product page.
* No cart gains a line for that product.

<!-- trace:case id=g10.store-product-page.TC-5er rev=1 covers=g10.store-product-page.SC-za5,g10.store-product-page.SC-eeg,g10.store-product-page.SC-0j7 -->
### grade10-site-store-product-page-US11-TC2-1: Dismissing sign-in adds nothing

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-11

**Pre-conditions:**

* customer is signed out and is on <grade10 product url>.
* Sign-in was opened from Add to cart on that page.

**Steps:**

1. Note the cart line count for that product.
2. Dismiss the sign-in dialog without signing in.
3. Check the session and the cart.

**Expected Results:**

* customer remains signed out on the product page.
* The cart is unchanged for that product.

<!-- trace:case id=g10.store-product-page.TC-maa rev=1 covers=g10.store-product-page.SC-za5,g10.store-product-page.SC-eeg,g10.store-product-page.SC-0j7 -->
### grade10-site-store-product-page-US11-TC3-1: Sign-in on the product page completes the add

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

* customer is signed out and is on <grade10 product url>.
* Sign-in was opened from Add to cart for the chosen variant at quantity <qty_1>.
* Sign-in can complete without leaving the product page.

**Test data:**

| Field | Value |
| --- | --- |
| <qty_1> | 1 |

**Steps:**

1. Complete sign-in successfully while remaining on the product page.
2. Check the sign-in dialog and the cart.

**Expected Results:**

* The sign-in dialog is closed.
* The signed-in member cart holds that variant at <qty_1>.

---

## grade10-site-store-product-page-US12: Collector sees why sign-in is asked when adding from the product page

**As a** signed-out collector on a product page,
**I want** the sign-in dialog to say I am signing in to add to cart,
**so that** I know why the shop stopped the add.

<!-- trace:case id=g10.store-product-page.TC-ir3 rev=1 covers=g10.store-product-page.SC-zl0 -->
### grade10-site-store-product-page-US12-TC1-1: Add to cart sign-in title names why

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
* **Trace:** grade10-site-store-product-page-US-12

**Pre-conditions:**

* customer is signed out and is on <grade10 product url> that offers Add to cart.
* The product is not sold out.

**Steps:**

1. Activate Add to cart.
2. Read the sign-in dialog title.

**Expected Results:**

* The dialog title is **Sign In to Add to Cart**.

---

## grade10-site-store-product-page-US13: Collector shares a card and the preview shows it

**As a** collector,
**I want** a product link I pass on to unfurl with the card's own picture, whole,
**so that** whoever receives it sees the card rather than a text-only preview
or one with its edges cut off.

<!-- trace:case id=g10.store-product-page.TC-kzr rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC1-1: Product address unfurls with the card's first catalogue image

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists with two or more images in the shop's own order.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Check the response for `og:image`.

**Expected Results:**

* `og:image` names the card's first catalogue image, not a later one.
* That image is the same photograph the card's own page shows first.

<!-- trace:case id=g10.store-product-page.TC-num rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC2-1: Declared size matches what is actually delivered

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card with at least one image exists.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Read `og:image:width` and `og:image:height`.
3. Fetch the `og:image` URL and measure the delivered image.

**Expected Results:**

* `og:image:width` is `1200` and `og:image:height` is `630`.
* The image actually delivered at that URL is 1200 by 630 pixels.

<!-- trace:case id=g10.store-product-page.TC-05a rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC3-1: Card sits whole inside the box, padded white and never cropped

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists whose first image's own aspect ratio differs from
1200 by 630.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Fetch the `og:image` and inspect the full frame.

**Expected Results:**

* The whole card is visible in the frame — no edge, corner, or label is cut off.
* The leftover space is filled solid white, not a blurred or extended copy of
  the photograph.

<!-- trace:case id=g10.store-product-page.TC-8oe rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC4-1: Card with no catalogue image carries no og:image at all

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists with no image attached.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Check the response for `og:image`.

**Expected Results:**

* No `og:image` tag is present — not an empty value, not a placeholder URL.
* Title, description and `og:url` are unaffected.

<!-- trace:case id=g10.store-product-page.TC-vr6 rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC5-1: Card shape reads wide when a picture is present

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card with at least one image exists.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Read `twitter:card`.

**Expected Results:**

* `twitter:card` is `summary_large_image`.

<!-- trace:case id=g10.store-product-page.TC-fpn rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC6-1: Card shape reads small when no picture is present

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
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
A catalogued card exists with no image attached.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Read `twitter:card`.

**Expected Results:**

* `twitter:card` is `summary`.

<!-- trace:case id=g10.store-product-page.TC-3ch rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC7-1: Alt text names the card, and is absent when the picture is

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-13

**Pre-conditions:**
Two catalogued cards exist: one whose image carries its own alt text, one
whose image carries none.

**Steps:**

1. Navigate to each card's own address with JavaScript disabled.
2. Read `og:image:alt` on each.

**Expected Results:**

* Where the image has its own alt text, `og:image:alt` is that text.
* Where it has none, `og:image:alt` is the card's name.

<!-- trace:case id=g10.store-product-page.TC-6n4 rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC8-1: Two cards each unfurl with their own picture, never the other's

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
Two catalogued cards exist, each with its own distinct first image.

**Steps:**

1. Navigate to card A's address with JavaScript disabled and note `og:image`.
2. Navigate to card B's address with JavaScript disabled and note `og:image`.

**Expected Results:**

* Card A's `og:image` is card A's own first image; card B's is card B's own.
* Neither response's picture, size, or shape declaration leaks into the
  other's.

<!-- trace:case id=g10.store-product-page.TC-21a rev=1 covers=g10.store-product-page.SC-vzq,g10.store-product-page.SC-sia,g10.store-product-page.SC-eji -->
### grade10-site-store-product-page-US13-TC9-1: A small original is enlarged to fill the box

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
A catalogued card exists whose first image's native resolution is smaller
than 1200 by 630 in at least one dimension.

**Steps:**

1. Navigate to <a card's own address> with JavaScript disabled.
2. Fetch the `og:image` and measure the delivered pixel dimensions.

**Expected Results:**

* The delivered image is exactly 1200 by 630, enlarged from its native size
  rather than left smaller inside more padding.

## Settled

* The share picture resolves through the same CDN address as the catalogue
  image rather than a separately generated asset — an implementation
  contract, not an externally observable product behaviour; the unit test's
  job, not this suite's.
- The store name in free pick-up opens Store Locator in the same tab, in the product page's language; only the map, which leaves the site, opens a new tab.
- **A card's page opens at its top** - a navigation to a new entry starts at the top, by the site's navigation rule, so a card opened from the rail low on a page shows from its top; the product page states no rule of its own

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Read: this suite, the change's `domain-tcs.md`, the delta `spec.md` with its scenarios, `tech-design.md`, `decisions.md`, `tasks.md` and the Product Details and Store Locator pages. The blind pass recorded no Run line of its own; its question is the product-page row of `decisions.md`'s `## Raised`. Later QA2 runs, each in a fresh context, rechecked every disposition after the accept review's edits; the last, 2026-10-07, read the same set, the application repository's product view and the stack's claims on this domain's ids.

- **Folded** - `grade10-site-store-product-page-US10-TC1-1` to `grade10-site-store-product-page-SC-25`, a sold-out card as a row because the claim is on every card; `grade10-site-store-product-page-US10-TC2-1` to `grade10-site-store-product-page-SC-38`, now naming the Shipping fee label the scenario names rather than the whole shipping line
- **Raised, answered** - whether the store name opens Store Locator in the same tab (Q20): it does, in the product page's language. `grade10-site-store-product-page-SC-25` now says so, and `grade10-site-store-product-page-US10-TC1-1` gains the same-tab result
- **Settled for now** - Shipping fee drawn plain, like the text around it, once it is not a link (Q22), handed to draw-store-locator-page. `grade10-site-store-product-page-US10-TC2-1` reads text, not a link, as `grade10-site-store-product-page-SC-38` does, and no case asserts the look
- **Renumbered** - the Shipping fee scenario is `grade10-site-store-product-page-SC-38` and the domain journey is `grade10-site-store-e2e-US10`, numbers no other open change claims: `add-store-product-status` holds this capability's scenarios 33 to 37, and `add-account-profile`, accepted before this change, holds the domain's journey 9
- **Covered at domain** - `grade10-site-store-e2e-US10-TC1-1` walks `grade10-site-store-product-page-SC-25`'s language: the address keeps the product page's prefix and the name reads the same on both pages
- **Contradicted** - none
- **Uncovered anchors** - none: `grade10-site-store-product-page-US-10` carries both cases, and both leaves of the Free pick-up group are reached

- **Re-worded** - US2-TC1 opened any published card from the grid by its photo; the requirement now holds only for a card that opens, and names the listing, the front door's row and the rail under a card as the surfaces that say which, so the blind pass made it one row per surface and control, each card for sale (Q12, Q3). Its meaning moved, so it is revision 2
- **Shared with** - `add-store-product-status` carries US2-TC1 at revision 1, the photo press on the grid; the fold refuses that copy once this one lands, so that change rewrites its case against revision 2
- **Raised, settled** - the 2026-10-06 blind pass asked where a card's page starts when it opens without a page load; landed as Q16 from `grade10-site/site/navigation`'s requirement that a new entry starts at the top, which runs on every surface: recorded under Settled, no case and no scenario here, since the site's navigation suite walks it
- **Walked** - `grade10-site-store-product-page-SC-05` by US2-TC1, its four rows the listing's name and photo, the front door's row and the rail
- **Beyond the scenarios** - US2-TC1's step 4 reloads the address it landed on and finds the same card; that an address answers on its own is `grade10-site-store-product-page-SC-01`'s, walked by US1-TC1, and the step stays as this case's check that the address is that card's
- **Out of suite** - which cards open, and from which control, is the surface's rule: a sold-out card on the listing by `grade10-site/store/product-listing`'s US16-TC2, a sold-out card on the front door's row by `grade10-site-store-e2e-US3-TC1-1`
- **Contradicted** - none: where the case and a scenario state the same outcome they agree
- **Carried, not this change's** - `grade10-site-store-product-page-SC-06` and its case US2-TC2 are unchanged on the durable suite
- **QA2, 2026-10-07** - US2-TC1 re-read against `grade10-site-store-product-page-SC-05` at revision 2: nothing contradicted, raised or uncovered, and the case is unchanged
- **Blind** - the 2026-10-06 pass below read this delta's anchors and the rail's page, and rewrote US2-TC1 from the durable case

**Run:** Blind feature pass (QA1) on 2026-10-06 for `activate-listing-tile-by-name`, `grade10-site/store/product-page`. Read the caller's isolated bundle only: the durable Purpose and Feature set and the delta Feature set, the delta `user-journeys.md`, the change's `proposal.md`, `decisions.md` with its Raised table, `ui-design.md` with scenario ids stripped, `openspec/config.yaml` context, the PRD pages `grade10-site/store/product-listing`, `grade10-site/store/product-page` and the Product Tile section of `shared/ui/store-product-listing`, the PRD page `grade10-site/store/cross-sell` for the rail, this suite with its Reconciliation stripped and its Settled, and the change's `domain-tcs.md` with its Reconciliation stripped; plus `docs/governance/specs-to-test-cases.md` and `docs/governance/tcs-conventions.md`. Denied and not opened: every Requirements section, `tech-design.md`, `tasks.md`, the rest of `openspec/specs/` and `openspec/changes/`, the archive, and the application repository.
