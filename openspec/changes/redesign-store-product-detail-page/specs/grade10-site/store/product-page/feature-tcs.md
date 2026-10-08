# grade10-site/store/product-page Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-site-store-product-page-US6: Collector reviews a product's catalogue context

**As a** collector,
**I want** a product page to show the product's supplied images, price context,
and item facts,
**so that** I can understand what is available before I decide to buy.

<!-- trace:case id=g10.store-product-page.TC-otm rev=2 covers=g10.store-product-page.SC-n6k,g10.store-product-page.SC-dd3,g10.store-product-page.SC-h7c -->
### grade10-site-store-product-page-US6-TC1-2: Product page shows ordered media and price context

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
* **Trace:** grade10-site-store-product-page-US-06

**Pre-conditions:**

* customer is on <grade10 store url>.
* The catalogue holds <product_1> with two images in catalogue order, one sellable item, current price <current price>, compare-at price <compare-at price>, and finite quantity <available quantity>.

**Test data:**

| Field | Value |
| --- | --- |
| <product_1> | Product with two catalogue images in a fixed order and one sellable item |
| <current price> | 10500 minor units |
| <compare-at price> | 12300 minor units |
| <available quantity> | 3 |

**Steps:**

1. Navigate to <grade10 product details url for product_1>.
2. Inspect the media gallery.
3. Inspect the purchase context.

**Expected Results:**

* The media gallery renders both images for <product_1> in catalogue order with descriptive alternative text.
* The purchase context shows current price <current price> and greater compare-at price <compare-at price>.
* The purchase context says nothing about how many remain.

<!-- trace:case id=g10.store-product-page.TC-jw5 rev=1 covers=g10.store-product-page.SC-n6k,g10.store-product-page.SC-dd3,g10.store-product-page.SC-h7c -->
### grade10-site-store-product-page-US6-TC2-1: Product without images shows an accessible placeholder

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-06

**Pre-conditions:**

* customer is on <grade10 store url>.
* The catalogue holds <product_2> with no catalogue images.

**Test data:**

| Field | Value |
| --- | --- |
| <product_2> | Product with no catalogue images |

**Steps:**

1. Navigate to <grade10 product details url for product_2>.
2. Inspect the media gallery.

**Expected Results:**

* The media gallery renders one accessible placeholder for <product_2>.
* The media gallery renders no empty image and no image URL made by the page.

<!-- trace:case id=g10.store-product-page.TC-4bp rev=1 covers=g10.store-product-page.SC-n6k,g10.store-product-page.SC-dd3,g10.store-product-page.SC-h7c -->
### grade10-site-store-product-page-US6-TC3-1: Supplied item facts and static fulfilment copy render without invented product metadata

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-06

**Pre-conditions:**

* customer is on <grade10 store url>.
* The catalogue holds <product_3> with product-type, world, and language badges, and SKU, while omitting at least one optional item fact.

**Test data:**

| Field | Value |
| --- | --- |
| <product_3> | Product with supplied product-type, world, and language badges, SKU, and at least one optional item fact omitted |

**Steps:**

1. Navigate to <grade10 product details url for product_3>.
2. Inspect the item facts.

**Expected Results:**

* The page renders the supplied product-type, world, and language badges as non-interactive labels.
* The page renders the static fulfilment copy for every product:
  * Shipping calculated at checkout. Shipping fee
  * Free pick-up at Hong Kong Grade10 Store
* The page renders the supplied SKU below the fulfilment copy.
* The page omits each optional item fact the catalogue does not supply.

---

## grade10-site-store-product-page-US7: Collector expands the product description in place

**As a** collector,
**I want** to expand and collapse a long product description where it is shown,
**so that** I can read the full description without leaving the product page.

<!-- trace:case id=g10.store-product-page.TC-wpt rev=1 covers=g10.store-product-page.SC-yaj -->
### grade10-site-store-product-page-US7-TC1-1: Long description expands and collapses in place

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-07

**Pre-conditions:**

* customer is on <grade10 store url>.
* The catalogue holds <product_4> with a description longer than three lines.

**Test data:**

| Field | Value |
| --- | --- |
| <product_4> | Product with a description longer than three lines |

**Steps:**

1. Navigate to <grade10 product details url for product_4>.
2. Inspect the description and disclosure button.
3. Activate the disclosure button.
4. Inspect the description and button state.
5. Activate the disclosure button again.
6. Inspect the description and current product address.

**Expected Results:**

* The description is collapsed to at most three lines, the disclosure button has `aria-expanded="false"`, and it references the description region with `aria-controls`.
* The full description is visible after step 3, and the button has `aria-expanded="true"` and shows the collapse action.
* The description is collapsed again after step 5, and the page remains at the same product address.

---

## grade10-site-store-product-page-US8: Collector adds a chosen quantity from the product page

**As a** collector,
**I want** to choose a quantity and add it from the product page,
**so that** I can buy the quantity I chose while staying on the product.

<!-- trace:case id=g10.store-product-page.TC-ux8 rev=1 covers=g10.store-product-page.SC-lqp -->
### grade10-site-store-product-page-US8-TC1-1: Chosen quantity adds while the page stays put

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
* **Trace:** grade10-site-store-product-page-US-08

**Pre-conditions:**

* customer is on <grade10 store url>.
* The catalogue holds <product_5> with one sellable item and finite available quantity <available quantity_5>.

**Test data:**

| Field | Value |
| --- | --- |
| <product_5> | Product with one sellable item and finite available quantity |
| <available quantity_5> | 3 |
| <chosen quantity_5> | 2 |

**Steps:**

1. Navigate to <grade10 product details url for product_5>.
2. Inspect the quantity stepper and add control.
3. Change the stepper to <chosen quantity_5>.
4. Activate Add to cart.
5. Inspect the purchase controls while the add is pending.
6. Wait for the add to settle.
7. Inspect the cart drawer and the quantity stepper.

**Expected Results:**

* While the add is pending, the stepper and add control are disabled and the action shows its loading state labelled for adding.
* The page remains at <product_5>'s product address.
* The page offers no size, option or variant choice.
* After the add settles, the cart records quantity <chosen quantity_5> for <product_5>, the cart drawer opens, and the quantity stepper resets to one.
* The page shows no on-page added confirmation.

---

## grade10-site-store-product-page-US9: Collector meets a sold-out product

**As a** collector,
**I want** a product with no available item to keep its price and say that it is sold out,
**so that** I can tell an unavailable product from a broken purchase page.

<!-- trace:case id=g10.store-product-page.TC-aww rev=2 covers=g10.store-product-page.SC-xny -->
### grade10-site-store-product-page-US9-TC1-2: Sold-out product keeps prices and disables purchase

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-09

**Pre-conditions:**

* customer is on <grade10 store url>.
* The catalogue holds <product_6> whose one product item is sold out.

**Test data:**

| Field | Value |
| --- | --- |
| <product_6> | Product whose one item is sold out |

**Steps:**

1. Navigate to <grade10 product details url for product_6>.
2. Inspect the product's price and availability state.
3. Inspect the purchase action.
4. Check the available controls in the purchase area.

**Expected Results:**

* The product remains priced and reads Sold out.
* The purchase action is disabled and reads Sold out.
* No control can add <product_6> to the cart.

## Reconciliation

**Run:** Update on 2026-10-06, from `add-store-product-status`, which this
change rebases onto (`add-store-product-status` decisions Q5). SC-13 moved to
rev 2: the page says nothing about how many remain, as product status
requires. US6-TC1 moved to rev 2 to expect the same. US9-TC1 moved to rev 2:
the item is sold out and reads Sold out, rather than unavailable, which names
a withdrawn cart line. QA2 reruns on this suite.
