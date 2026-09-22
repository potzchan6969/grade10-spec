# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## grade10-site-store-product-page-US1: Collector reads a card at its own address

**As a** collector,
**I want** a product address to answer with that card's own page, and to refuse
when the catalogue holds no such card,
**so that** the page I read is the card the address names rather than an empty
product page.

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

### grade10-site-store-product-page-US2-TC1-1: Card opens from the grid at its own address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-02

**Pre-conditions:**
A collector is on the storefront. The catalogue holds <a published card>.

**Steps:**

1. Navigate to <grade10 store url>.
2. Open that card in the grid.

**Expected Results:**

* That card's address is what they are on, showing that card's page.
* The destination renders without a full document load.

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

## grade10-site-store-product-page-US5: Collector takes the last of a grade from its page

**As a** collector,
**I want** the page to stop me at what the shop has of the grade I chose, and
to say how many that is,
**so that** the quantity I take to the cart is one the shop can fill.

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

## grade10-site-store-product-page-US11: Collector signs in to add from the product page

**As a** signed-out collector on a product page,
**I want** Add to cart to open sign-in instead of building a guest cart,
**so that** I only hold lines I can take to members-only checkout.

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
