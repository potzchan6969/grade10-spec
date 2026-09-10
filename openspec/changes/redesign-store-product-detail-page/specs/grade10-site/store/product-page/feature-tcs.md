# grade10-site/store/product-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-site-store-product-page-US6: Collector reviews a product's catalogue context

**As a** collector,
**I want** a product page to show the product's supplied images, price context,
and item facts,
**so that** I can understand what is available before I decide to buy.

### grade10-site-store-product-page-US6-TC1-1: Product page shows ordered media and price context

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
* The catalogue holds <product_1> with two images in catalogue order, current price <current price>, compare-at price <compare-at price>, and finite quantity <available quantity>.

**Test data:**

| Field | Value |
| --- | --- |
| <product_1> | Product with two catalogue images in a fixed order and a priced variant |
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
* The purchase context says only <available quantity> remain.

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

### grade10-site-store-product-page-US6-TC3-1: Supplied item facts render without invented facts

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
* The catalogue holds <product_3> with product-type, world, and language badges, shipping guidance, pickup location, and SKU, while omitting at least one optional item fact.

**Test data:**

| Field | Value |
| --- | --- |
| <product_3> | Product with supplied product-type, world, and language badges, shipping guidance, pickup location, SKU, and at least one optional item fact omitted |

**Steps:**

1. Navigate to <grade10 product details url for product_3>.
2. Inspect the item facts.

**Expected Results:**

* The page renders the supplied product-type, world, and language badges as non-interactive labels.
* The page renders the supplied shipping guidance, pickup location, and SKU.
* The page omits each optional item fact the catalogue does not supply.

---

## grade10-site-store-product-page-US7: Collector expands the product description in place

**As a** collector,
**I want** to expand and collapse a long product description where it is shown,
**so that** I can read the full description without leaving the product page.

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
* The catalogue holds <product_5> with <selected variant> selected and available, and finite available quantity <available quantity_5>.

**Test data:**

| Field | Value |
| --- | --- |
| <product_5> | Product with a selected available variant and finite available quantity |
| <selected variant> | Variant selected on opening and available for sale |
| <available quantity_5> | 3 |
| <chosen quantity_5> | 2 |

**Steps:**

1. Navigate to <grade10 product details url for product_5>.
2. Inspect the quantity stepper and add control.
3. Change the stepper to <chosen quantity_5>.
4. Activate Add to cart.
5. Inspect the purchase controls while the add is pending.
6. Wait for the add to settle.

**Expected Results:**

* While the add is pending, the stepper and add control are disabled and the action shows its loading state.
* The page remains at <product_5>'s product address.
* After the add settles, the cart records quantity <chosen quantity_5> for <selected variant> and the action reports that the item was added.

---

## grade10-site-store-product-page-US9: Collector meets a product with no variant for sale

**As a** collector,
**I want** a product with no available variant to keep its prices and say that it is sold out,
**so that** I can tell an unavailable product from a broken purchase page.

### grade10-site-store-product-page-US9-TC1-1: Sold-out product keeps prices and disables purchase

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
* The catalogue holds <product_6> whose variants are all unavailable for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product_6> | Product whose variants are all unavailable for sale |

**Steps:**

1. Navigate to <grade10 product details url for product_6>.
2. Inspect every variant's price and availability state.
3. Inspect the purchase action.
4. Check the available controls in the purchase area.

**Expected Results:**

* Every variant remains priced and is marked unavailable as applicable.
* The purchase action is disabled and labelled sold out.
* No control can add <product_6> to the cart.
