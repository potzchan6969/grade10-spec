# grade10-site/commerce/product-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-site-commerce-product-status-US1: Collector sees whether a card can be bought

**As a** collector,
**I want** the listing tile to report whether any item on the card can be
bought, and the product page and cart to report the same internal sale item,
**so that** the availability I see before adding matches the item in my cart.

### grade10-site-commerce-product-status-US1-TC1-2: Offered item keeps its availability across browse and cart

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify offers the product's internal sale item on the store channel.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read the product tile's availability.
3. Open the product page.
4. Read the one sellable item's availability.
5. Add that item to the cart.
6. Open the cart and read the line's availability.

**Expected Results:**

* The tile reads available.
* The product page reads the internal sale item as available.
* The cart line reads the same sale item as available.

### grade10-site-commerce-product-status-US1-TC2-2: Item Shopify no longer offers is out of stock and keeps its price

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify does not offer the product's internal sale item on the store channel.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read the product tile's availability.
3. Open the product page.
4. Read the internal sale item's price and availability.
5. Look for an add control for that item.

**Expected Results:**

* The tile reads out of stock.
* The product page keeps the item's price and reads it as out of stock.
* No usable add control is offered for the item.

### grade10-site-commerce-product-status-US1-TC3-1: Shop still offering at zero inventory stays available

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify offers the item for sale with an inventory count of zero.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read the product tile's availability.
3. Open the product page and read the item's availability.

**Expected Results:**

* The tile and product page read the item as available.
* The item has the same available treatment as one with positive inventory.

### grade10-site-commerce-product-status-US1-TC4-1: Offered item with no inventory count stays available

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify offers the item for sale and exposes no inventory count.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read the product tile's availability.
3. Open the product page and read the item's availability.

**Expected Results:**

* The tile and product page read the item as available.
* Neither surface derives an out-of-stock answer from the missing count.

### grade10-site-commerce-product-status-US1-TC5-1: Browse surfaces show no count or scarcity cue

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify offers one item with inventory 1 and another with inventory 400.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Compare the two product tiles.
3. Open each product page and read its one sellable item's availability.

**Expected Results:**

* Both tiles show availability without a remaining count or scarcity cue.
* Both product pages show only their item's price and availability.
* The two inventory counts are not shown as product labels.

### grade10-site-commerce-product-status-US1-TC6-2: Listing rolls up variants while the page keeps one item

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify offers one variant of a product and does not offer another.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read the product tile's availability.
3. Open the product page and inspect its sellable item.

**Expected Results:**

* The tile reads available because at least one variant is offered.
* The page shows availability only for its one internal sale item.
* The page offers no shopper-facing variant choice or variant label.

### grade10-site-commerce-product-status-US1-TC7-2: Tile is out of stock only when every variant is unavailable

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify does not offer any variant of the product for sale.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Read the product tile's availability.
3. Open the product page and read the internal sale item's price and availability.
4. Look for an add control.

**Expected Results:**

* The tile reads out of stock.
* The page keeps the internal item's price and reads it as out of stock.
* No usable add control is offered.
* No shopper-facing variant choice or label appears.

### grade10-site-commerce-product-status-US1-TC8-2: Cart reports the same item after Shopify stops offering it

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* The cart holds the product's internal sale item.
* Shopify no longer offers that item, and the listing shows the current catalogue answer.

**Steps:**

1. Navigate to <grade10 browse listing url> and read the tile's availability.
2. Open the product page and read the item's availability.
3. Open the cart and read the line's availability.

**Expected Results:**

* The tile, page and cart line read the same internal item as out of stock.
* The product page keeps the item's price and offers no usable add control.

### grade10-site-commerce-product-status-US1-TC9-2: Unpublished product is absent and its address refuses

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* Shopify has not published the product to the store's sales channel.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Look for the product tile.
3. Navigate to <the unpublished product address>.

**Expected Results:**

* No tile for the unpublished product appears.
* Its address answers 404 with the site's not-found page.

---

## grade10-site-commerce-product-status-US2: Collector asks for more than the shop can fill

**As a** collector,
**I want** the store to tell me when it can fill only part of what I asked
for, and how much,
**so that** a request the shop cannot meet is a stated answer I can act on
rather than a refusal at checkout.

### grade10-site-commerce-product-status-US2-TC1-2: Request at a positive count is fillable

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
* **Trace:** grade10-site-commerce-product-status-US-02

**Pre-conditions:**

* Shopify offers the product's internal sale item with the count in the row.

**Test data:**

| Surface | Count | Requested quantity | Answer |
| --- | ---: | ---: | --- |
| Listing | 1 | 1 | Fillable 1 |
| Product page | 2 | 2 | Fillable 2 |

**Steps:**

1. Open the surface in the row.
2. Request the quantity in the row and add the item.
3. Open the cart and read the line.

**Expected Results:**

* The cart reports the requested quantity as fillable.
* The line is not marked adjusted or out of stock.

### grade10-site-commerce-product-status-US2-TC2-2: Request above a positive count is fillable in part

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
* **Trace:** grade10-site-commerce-product-status-US-02

**Pre-conditions:**

* Shopify offers the product's internal sale item with the count in the row.

**Test data:**

| Surface | Count | Requested quantity | Answer |
| --- | ---: | ---: | --- |
| Listing | 1 | 2 | Fillable in part: 1 |
| Product page | 1 | 2 | Fillable in part: 1 |

**Steps:**

1. Open the surface in the row.
2. Request the quantity in the row and add the item.
3. Open the cart and read the line.

**Expected Results:**

* The cart names the requested quantity as fillable in part.
* The answer names the count Shopify can fill.
* The browse control did not cap the requested quantity.

### grade10-site-commerce-product-status-US2-TC3-2: Request for an unavailable item is not fillable

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
* **Trace:** grade10-site-commerce-product-status-US-02

**Pre-conditions:**

* The cart holds the product's internal sale item.
* Shopify no longer offers the item for sale.

**Steps:**

1. Open the cart.
2. Read the line's answer for the requested quantity.

**Expected Results:**

* The line is not fillable.
* No positive fill quantity is offered.

### grade10-site-commerce-product-status-US2-TC4-2: Zero or missing count does not bound an offered item

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
* **Trace:** grade10-site-commerce-product-status-US-02

**Pre-conditions:**

* Shopify offers the product's internal sale item.

**Test data:**

| Shopify count | Requested quantity | Answer |
| --- | ---: | --- |
| 0 | 5 | Fillable 5 |
| No count exposed | 5 | Fillable 5 |

**Steps:**

1. Open the product page.
2. Request the quantity in the row and add the item.
3. Open the cart and read the line.

**Expected Results:**

* The cart reports all 5 as fillable.
* Neither a zero count nor a missing count limits the request.

## Reconciliation

**Run:** Blind feature-TCS pass on 2026-09-24. Read the caller-supplied exact Purpose and Feature set for grade10-site/commerce/product-status; openspec/changes/add-store-product-status/proposal.md and decisions.md including Raised; ui-design.md state descriptions without following their scenario references; this change-local user-journeys.md; docs/prds/products/grade10-site/store/index.md, store/product-page.md, store/product-listing.md, commerce/index.md and commerce/product-status.md; openspec/config.yaml context; this change-local suite through its cases; docs/governance/specs-to-test-cases.md; and the current-major approved suite corpus (14 actual cases from shared/auth/sign-out and grade10-site/auction/bid-increments). No durable product-status feature suite existed. Retained all 13 case IDs and draft statuses; bumped behavior versions for US1-TC1, TC2, TC6–TC9 and US2-TC1–TC4.

**Excluded:** Every spec.md file, all requirements and scenarios in openspec/specs/ and openspec/changes/add-store-product-status/specs/, and the archive tree. The Purpose and Feature set came from the caller; no spec file was opened. No scenario reference in ui-design was followed.
