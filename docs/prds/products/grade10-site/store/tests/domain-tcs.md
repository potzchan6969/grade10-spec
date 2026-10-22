# grade10-site/store Test Cases

**Status:** pending-review · 0/4
**Drafts styled:** 2026-10-22, tcs-rules r6

## Ungrouped

### g10.store-dmn.US1: Browse from a collection tile

**As a** customer,
**I want** to browse the collection I choose on the Main Page,
**so that** I can open a product from that collection.

<!-- trace:case id=g10.store-dmn.TC-2fr rev=1 -->
#### g10.store-dmn.US1-TC1: Browse a homepage collection, open a product, then clear the selection

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** [Main Page / Collection grid](../home.md), [Product Listing / Collection entry and URL](../product-listing.md), [Product Details / Card and URL](../product-page.md)

**Pre-conditions:**

* customer is signed out.
* The shop publishes `<chosen collection>`, containing `<collection product>` and excluding `<outside product>`.
* These are the only 2 products in the fixture catalogue. Both products are available. `<outside product>` is newer than `<collection product>`.

**Test data:**

| Field | Value |
| --- | --- |
| chosen collection | A published collection with a known name and handle. |
| collection product | An available product in chosen collection, with a known name, handle and current price. |
| outside product | An available product outside chosen collection, newer than collection product. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Click the tile for `<chosen collection>`.
3. Read the listing name, sort control and product cards.
4. Click the name of `<collection product>`.
5. Use browser Back to return to the collection listing.
6. Dismiss the collection above the grid.

**Expected Results:**

* Step 2 opens `/store/collections?collection=<chosen collection handle>`.
* The listing names `<chosen collection>` and opens on latest product.
* The listing includes `<collection product>` and excludes `<outside product>`.
* Step 4 opens `/store/products/<collection product handle>` with that product's name and price.
* Step 6 removes the collection scope and includes `<outside product>`.

---

### g10.store-dmn.US2: Buy after opening a merchandised product

**As a** customer,
**I want** to open a product before adding it to my cart,
**so that** I can buy the product I chose.

<!-- trace:case id=g10.store-dmn.TC-v5l rev=1 -->
#### g10.store-dmn.US2-TC1: Guests can add homepage products to cart from product details

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** [Main Page / Opens, never sells](../home.md), [Product Details / Buy](../product-page.md#buy), [Cart Drawer / Reviewing the Cart](../cart.md#reviewing-the-cart)

**Pre-conditions:**

* customer is signed out with an empty browser cart.
* The first catalogue collection contains `<available product>`, shown in the Main Page row.
* The test shop can supply 1 unit of `<available product>`.

**Test data:**

| Field | Value |
| --- | --- |
| available product | A published product offered for sale, with a known name and handle. |
| requested quantity | 1 unit; a representative valid purchase, not a stock boundary. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Click the card for `<available product>` in the merchandised row.
3. Set the product quantity to `<requested quantity>`.
4. Click Add to cart on the product page.
5. Read the cart drawer after the add settles.

**Expected Results:**

* Step 2 opens `/store/products/<available product handle>`.
* The product page shows `<available product>` and its purchase controls.
* Step 4 keeps the product page open without requiring sign-in.
* The cart drawer opens with `<available product>` at `<requested quantity>`.
* The cart total updates and the product quantity resets.

<!-- trace:case id=g10.store-dmn.TC-mj0 rev=1 -->
#### g10.store-dmn.US2-TC2: Homepage opens sold-out product details, where Add to cart is unavailable

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
* **Trace:** [Main Page / Opens, never sells](../home.md), [Product Details / Sold out](../product-page.md), [Product Listing / Product Tile](../product-listing.md#product-tile)

**Pre-conditions:**

* The first catalogue collection contains `<sold-out product>`, shown in the Main Page row.
* Every variant of `<sold-out product>` is unavailable for sale.

**Test data:**

| Field | Value |
| --- | --- |
| sold-out product | A published sold-out product with a known name, handle and visible price. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Click the merchandised card for `<sold-out product>`.
3. Read its price, availability and purchase area.
4. Navigate to the whole catalogue at `/store/collections`.
5. Locate `<sold-out product>` in the listing.
6. Try its name and photo as product links.

**Expected Results:**

* Step 2 opens `/store/products/<sold-out product handle>`.
* The product page shows its price and sold-out state.
* The product cannot be added from its product page.
* The listing also marks `<sold-out product>` sold out.
* Step 6 opens no product page from either listing target.

---

### g10.store-dmn.US3: Compare a merchandised price across pages

**As a** customer,
**I want** to see the same product price after leaving the Main Page,
**so that** I can trust the price I followed.

<!-- trace:case id=g10.store-dmn.TC-nuz rev=1 -->
#### g10.store-dmn.US3-TC1: Sale and original prices match on homepage, listing and product details

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
* **Trace:** [Main Page / Card status](../home.md), [Product Listing / Sale](../product-listing.md), [Product Details / Card](../product-page.md), [Discounts / Where Each Shows](../discounts.md#where-each-shows)

**Pre-conditions:**

* The first catalogue collection contains `<sale product>`, shown in the Main Page row.
* The product is available; no automatic discount or code changes its price.

**Test data:**

| Field | Value |
| --- | --- |
| sale product | A published product with a known name and handle. |
| current price | HKD880; a representative positive sale price. |
| compare-at price | HKD1,000; above current price, as the Sale price rule requires. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Read the merchandised card for `<sale product>`.
3. Click that card.
4. Read the product page price.
5. Navigate to the whole catalogue at `/store/collections`.
6. Read the listing card for `<sale product>`.

**Expected Results:**

* Step 2 shows `<current price>` with `<compare-at price>` struck through.
* Step 3 opens the product identified by `<sale product>`.
* Step 4 shows the same current and struck compare-at prices.
* Step 6 shows the same current and struck compare-at prices.
