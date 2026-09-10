# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-10, tcs-rules r3.0

## grade10-site-store-e2e-US1: Collector enters a collection and opens a product

**As a** collector,
**I want** to move from a collection on the Store front door to a product's
own page,
**so that** I can inspect the card I chose in the catalogue.

### grade10-site-store-e2e-US1-TC1-1: Collection tile leads to its product page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-home-US-02, grade10-site-store-product-listing-US-02, grade10-site-store-product-page-US-02

**Pre-conditions:**

* `<collection>` is listed on the Store front door and holds `<product>`.
* `<product>` is listed in `<collection>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<collection>` | A catalogue collection with at least one product |
| `<product>` | A product listed in `<collection>` |

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the tile for `<collection>`.
3. Check the collection shown as the listing narrowing.
4. Open the card for `<product>`.

**Expected Results:**

* The Store front door renders with `<collection>` as a collection tile.
* The browse listing shows `<collection>` as the narrowing in force.
* Step 4 opens `<product>`'s own product page.

---

## grade10-site-store-e2e-US2: Collector buys a merchandised product from its page

**As a** collector,
**I want** to open a card from the Store front door and add my chosen variant,
**so that** I can buy without returning to the listing.

### grade10-site-store-e2e-US2-TC1-1: Merchandised card adds the chosen variant

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
* **Trace:** grade10-site-store-home-US-03, grade10-site-store-product-page-US-03

**Pre-conditions:**

* `<product>` is in the merchandised row for the first collection the catalogue lists.
* `<product>` has more than one variant for sale, including `<variant>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A product in the merchandised row with more than one variant for sale |
| `<variant>` | An available variant different from the variant selected on opening |

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the card for `<product>` in the merchandised row.
3. Choose `<variant>` on the product page.
4. Add the chosen variant to the cart.

**Expected Results:**

* The merchandised row offers no way into the cart.
* Step 2 opens `<product>`'s own product page.
* The cart holds `<variant>`, not the variant selected on opening, and the page remains at `<product>`'s address.

---

## grade10-site-store-e2e-US3: Collector checks a sold-out product from the front door

**As a** collector,
**I want** a sold-out card in the merchandised row to remain marked sold out
when I open it,
**so that** I can tell an unavailable card from a broken purchase page.

### grade10-site-store-e2e-US3-TC1-1: Sold-out card keeps its status on the product page

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

* `<product>` is in the merchandised row and all its variants are unavailable for sale.

**Test data:**

| Field | Value |
| --- | --- |
| `<product>` | A merchandised product with every variant unavailable for sale |

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the status shown for `<product>` in the merchandised row.
3. Open the card for `<product>`.
4. Check the purchase area on the product page.

**Expected Results:**

* The merchandised row marks `<product>` as sold out and offers no way into the cart.
* Step 3 opens `<product>`'s own product page.
* The product page keeps every variant priced, labels the purchase action sold out, and offers no control that adds the product.
