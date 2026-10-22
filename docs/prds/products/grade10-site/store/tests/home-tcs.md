# grade10-site/store/home Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-22, tcs-rules r6

## Walk 1: Read the Shop Window

**Starting state:**

- customer is on `<grade10 store url>` with JavaScript enabled.
- The catalogue has answered `[<first collection>, <second collection>]`; both have distinct products.
- `<displayed product>` is available in the first collection and appears in the merchandised row.

**Shared test data:**

| Field | Value |
| --- | --- |
| `<first collection>` | Collection A, with a known name, handle and product handles. |
| `<second collection>` | Collection B, with a known name, handle and distinct product handles. |
| `<displayed product>` | An available product in the first collection, with a known handle. |

### Route

1. Read the collection grid from first tile to last.
   - Record the multiple-collection row's exact set and order for `g10.store-home.US2-TC1`.
2. Read every card in the merchandised row.
   - Record the first-order row's cards and collection membership for `g10.store-home.US2-TC3`.
3. Inspect the merchandised cards for cart controls.
   - Record that no card offers a cart action for `g10.store-home.US3-TC1`.
4. Click the card for `<displayed product>`.
   - Record its product address for the available-product row of `g10.store-home.US3-TC1`.

## g10.store-home.US2: Browse the shop catalogue sections

**As a** customer,
**I want** to see the collections and products the shop leads with,
**so that** I can choose what to browse.

<!-- trace:case id=g10.store-home.TC-w79 rev=1 -->
### g10.store-home.US2-TC1: Homepage shows every collection once, in catalogue order

Runs once per row of **Test data**.

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
* **Trace:** [Main Page / Collection grid](../home.md) / Browse the shop catalogue sections

**Pre-conditions:**

* The catalogue returns `<collection order>`, with distinct collection names and handles.

**Test data:**

| Partition | `<collection order>` |
| --- | --- |
| One collection | [<first collection>]; the smallest non-empty grid. |
| Multiple collections | [<first collection>, <second collection>]; 2 represents multiple collections, not a display limit. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the collection grid to finish loading.
3. Read the tiles from first to last.

**Expected Results:**

* The grid shows exactly 1 tile per returned collection.
* The tile order equals `<collection order>`.

<!-- trace:case id=g10.store-home.TC-q4t rev=1 -->
### g10.store-home.US2-TC3: Homepage product row shows products from the first collection

Runs once per row of **Test data**.

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
* **Trace:** [Main Page / Merchandised row](../home.md) / Browse the shop catalogue sections

**Pre-conditions:**

* The catalogue returns `[<first collection>, <second collection>]`.
* The first collection has products; the second has different products.

**Test data:**

| Partition | `<first collection>` | `<second collection>` |
| --- | --- | --- |
| First order | Collection A, with known product handles. | Collection B, with a disjoint set of product handles. |
| Reversed order | Collection B, with known product handles. | Collection A, with a disjoint set of product handles. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the catalogue sections to finish loading.
3. Read every card in the merchandised row.

**Expected Results:**

* The merchandised row contains product cards.
* Every row card belongs to `<first collection>`.
* No product exclusive to `<second collection>` appears in the row.

---

## g10.store-home.US3: Open a merchandised product

**As a** customer,
**I want** to open the product I choose in the row,
**so that** I can read its own page before buying.

<!-- trace:case id=g10.store-home.TC-egn rev=1 -->
### g10.store-home.US3-TC1: Homepage product cards open details and have no Add to cart

Runs once per row of **Test data**.

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
* **Trace:** [Main Page / Opens, never sells](../home.md) / Open a merchandised product

**Pre-conditions:**

* The first catalogue collection contains `<displayed product>`, shown in the Main Page row.
* The catalogue has answered the availability state in the selected data row.

**Test data:**

| Partition | `<displayed product>` |
| --- | --- |
| Available | A product offered for sale, with a known handle. |
| Sold out | A product with no variant offered for sale, with a known handle. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Inspect the merchandised cards for a cart action.
3. Click the card for `<displayed product>`.

**Expected Results:**

* Step 2 finds no cart action on any merchandised card.
* Step 3 opens `/store/products/<displayed product handle>`.

---

## Ungrouped

### g10.store-home.US1: Read the store front door

**As a** customer,
**I want** to read the hero before scripts or the catalogue answer,
**so that** I can understand the shop as soon as its response arrives.

<!-- trace:case id=g10.store-home.TC-5i5 rev=1 -->
#### g10.store-home.US1-TC1: Homepage hero appears before JavaScript, even if the catalogue fails

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** [Main Page / Hero](../home.md) / Read the store front door

**Pre-conditions:**

* customer uses a browser with page JavaScript disabled.
* The catalogue read uses `<catalogue state>`.

**Test data:**

| Partition | `<catalogue state>` |
| --- | --- |
| Ready | A successful catalogue response containing collections and products. |
| Waiting | A catalogue response held pending while the page response arrives. |
| Failed | A catalogue read that fails. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Inspect the initial document response in browser developer tools.
3. Read the hero on the page without enabling JavaScript.

**Expected Results:**

* The document arrives for the selected catalogue state.
* The response HTML contains the hero label, headline, copy and image.
* The response HTML contains both hero navigation controls.
* The hero is visible before any page script runs.

---

### g10.store-home.US2: Browse the shop catalogue sections

**As a** customer,
**I want** to see the collections and products the shop leads with,
**so that** I can choose what to browse.

<!-- trace:case id=g10.store-home.TC-usm rev=1 -->
#### g10.store-home.US2-TC2: New shop collections appear on homepage without a site deployment

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
* **Trace:** [Main Page / Collection grid](../home.md) / Browse the shop catalogue sections

**Pre-conditions:**

* customer can read `<grade10 store url>`.
* admin has access to the test shop catalogue.
* The catalogue publishes `<existing collection>`; `<new collection>` is not yet published.
* The site deployment stays fixed throughout this run.

**Test data:**

| Field | Value |
| --- | --- |
| existing collection | A published collection with a known name and handle. |
| new collection | A new collection with a distinct name and handle, ready to publish in the test shop. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Read the collection grid.
3. Publish `<new collection>` in the test shop catalogue.
4. Wait until the shop catalogue returns `<new collection>`.
5. Reload `<grade10 store url>` after its catalogue read answers the updated collection set.
6. Read the collection grid again.

**Expected Results:**

* Step 2 shows `<existing collection>` and no `<new collection>`.
* Step 6 shows exactly 1 tile for `<new collection>`.
* The grid preserves the updated catalogue collection order.
* The new collection appears on the same site deployment.

<!-- trace:case id=g10.store-home.TC-aw0 rev=1 -->
#### g10.store-home.US2-TC4: Homepage sections show loading until collections or products are ready

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
* **Testability:** automation
* **Trace:** [Main Page / Catalogue sections](../home.md) / Browse the shop catalogue sections

**Pre-conditions:**

* The catalogue read for `<section>` is held pending until the tester releases it.
* Releasing the read returns `<successful content>`.

**Test data:**

| `<section>` | `<successful content>` |
| --- | --- |
| Collection grid | 2 collections with known names and handles, in catalogue order. |
| Merchandised row | A first collection containing products with known handles. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Read `<section>` while its catalogue read is pending.
3. Release the pending catalogue read.
4. Read `<section>` after its catalogue response arrives.

**Expected Results:**

* Step 2 identifies `<section>` as loading.
* Step 4 shows `<successful content>` for `<section>`.
* The completed section no longer indicates loading.

<!-- trace:case id=g10.store-home.TC-9ds rev=1 -->
#### g10.store-home.US2-TC5: Retry loads failed homepage sections without refreshing the page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** [Main Page / Catalogue sections](../home.md) / Browse the shop catalogue sections

**Pre-conditions:**

* The first catalogue read for `<section>` fails.
* The next read triggered by retry returns `<successful content>`.
* The test environment records document navigation requests.

**Test data:**

| `<section>` | `<successful content>` |
| --- | --- |
| Collection grid | 2 collections with known names and handles, in catalogue order. |
| Merchandised row | A first collection containing products with known handles. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the catalogue read for `<section>` to fail.
3. Read the failed section.
4. Clear the browser network log.
5. Click the failed section's retry control.
6. Read the section after its successful response arrives.

**Expected Results:**

* Step 3 explains that the section could not be read.
* The failed section offers a retry control.
* Step 6 shows `<successful content>` for `<section>`.
* The failure indication is replaced by the section content.
* Retry issues no new document navigation request.

<!-- trace:case id=g10.store-home.TC-05u rev=1 -->
#### g10.store-home.US2-TC6: Empty homepage sections and their headings are hidden

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
* **Testability:** automation
* **Trace:** [Main Page / Catalogue sections](../home.md) / Browse the shop catalogue sections

**Pre-conditions:**

* The catalogue successfully returns `<empty content>` for `<section>`.

**Test data:**

| `<section>` | `<empty content>` |
| --- | --- |
| Collection grid | No collections. |
| Merchandised row | A first collection containing no products; no other collection supplies products. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the catalogue read to finish.
3. Inspect the area where `<section>` would appear.

**Expected Results:**

* The empty section is absent.
* No heading remains above an empty section.
* The successful empty read is not shown as loading or failed.

<!-- trace:case id=g10.store-home.TC-l20 rev=1 -->
#### g10.store-home.US2-TC7: Homepage product cards show availability and strike through higher original prices

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** [Main Page / Card status](../home.md) / Browse the shop catalogue sections; [Product Listing / Availability and Sale](../product-listing.md); [Discounts / Sale price](../discounts.md#kinds-of-discount)

**Pre-conditions:**

* The first collection contains `<status product>`, shown in the Main Page row.
* The catalogue supplies the selected row's variant and price facts.
* No automatic discount or code changes `<status product>`'s price.

**Test data:**

| Partition | `<status product>` | `<current price>` | `<compare-at price>` | `<expected availability>` | `<expected strike>` |
| --- | --- | --- | --- | --- | --- |
| Available, no sale | 1 variant offered for sale. | HKD880 | Absent | Available | None |
| Mixed availability | First variant unavailable; another offered for sale at the same price. | HKD880 | Absent | Available | None |
| Sold out | No variant offered for sale. | HKD880 | Absent | Sold out | None |
| Compare-at above price | Offered for sale. | HKD880 | HKD1,000 | Available | HKD1,000 struck |
| Compare-at at the limit | Offered for sale. | HKD880 | HKD880 | Available | None |
| Compare-at below price | Offered for sale. | HKD880 | HKD800 | Available | None |
| Sold-out sale | No variant offered for sale. | HKD880 | HKD1,000 | Sold out | HKD1,000 struck |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the merchandised row to finish loading.
3. Read the card for `<status product>`.

**Expected Results:**

* The card shows `<current price>`.
* Its availability reads `<expected availability>`.
* Its higher-price treatment matches `<expected strike>`.

<!-- trace:case id=g10.store-home.TC-2jx rev=1 -->
#### g10.store-home.US2-TC8: Homepage prices reflect discounts that do not depend on a basket

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** [Main Page / Card status](../home.md) / Browse the shop catalogue sections; [Product Listing / Site discounts on the tile](../product-listing.md); [Discounts / Where Each Shows](../discounts.md#where-each-shows)

**Pre-conditions:**

* The first collection contains `<discount product>`, shown in the Main Page row.
* The product is available at HKD880 with no compare-at price.
* The shop has only the selected row's `<automatic discount>` for this product.

**Test data:**

| Partition | `<discount product>` | `<automatic discount>` | `<expected price>` | `<expected strike>` |
| --- | --- | --- | --- | --- |
| Product cut without a minimum | An eligible product with a known handle. | 10% off this product, no minimum. | HKD792 = HKD880 × 0.9 | HKD880 struck |
| Order cut without a minimum | An eligible product with a known handle. | 10% off the order, no minimum. | HKD792 = HKD880 × 0.9 | HKD880 struck |
| Product cut with a quantity minimum | An eligible product with a known handle. | 10% off after buying 2 units. | HKD880 | None |
| Order cut with a spend minimum | An eligible product with a known handle. | Spend HKD1,000, save HKD100. | HKD880 | None |
| Fixed cut across the order | An eligible product with a known handle. | HKD100 off once across the order, no minimum. | HKD880 | None |
| Buy X get Y | The trigger product with a known handle. | Buy 2 units, get a third free. | HKD880 | None |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the merchandised row to finish loading.
3. Read the card for `<discount product>`.

**Expected Results:**

* The card price equals `<expected price>`.
* Its higher-price treatment matches `<expected strike>`.
