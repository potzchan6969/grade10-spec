# grade10-site/store/landing Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-22, tcs-rules r6

## Walk 1: Read the Shop Window

**Starting state:**

- customer is on `<grade10 store url>`, with JavaScript enabled.
- The catalogue has answered `[<first collection>, <second collection>]`; both have distinct products.
- `<displayed product>`, `<sold-out product>` and `<marked-down product>` are in the first collection and appear in the merchandised row, by the recipe "Put a card in the Main Page's merchandised row".

**Shared test data:**

| Field | Value |
| --- | --- |
| `first collection` | Collection A, with a known name, handle and product handles. |
| `second collection` | Collection B, with a known name, handle and distinct product handles. |
| `displayed product` | An available product in the first collection, with a known handle and no earlier price. |
| `sold-out product` | A product in the first collection with nothing offered for sale, by the recipe "Sell a card out". |
| `marked-down product` | An available product in the first collection the shop has marked down from a higher earlier price. |

### Route

1. Read the collection grid from first tile to last.
   - Record the multiple-collection row's exact set and order `g10.store-landing.US2-TC1`
2. Read every card in the merchandised row.
   - Record the first-order row's cards and collection membership `g10.store-landing.US2-TC3`
3. Read the cards for `<displayed product>`, `<sold-out product>` and `<marked-down product>`.
   - Record each card's status on the Main Page for its row `g10.store-landing.US2-TC7`
4. Inspect the merchandised cards for cart controls.
   - Record that no card offers a cart action `g10.store-landing.US3-TC1`
5. Click the card for `<displayed product>`.
   - Record its product address for the available-product row `g10.store-landing.US3-TC1`

## g10.store-landing.US2: Browse the shop catalogue sections

**As a** customer,
**I want** to see the collections and products the shop leads with,
**so that** I can choose what to browse.

<!-- trace:case id=g10.store-home.TC-w79 rev=1 -->
### g10.store-landing.US2-TC1: Main Page shows every collection once, in catalogue order

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
* **Trace:** g10.store-landing.US2

**Pre-conditions:**

* The catalogue returns `<collection order>`, with distinct collection names and handles.

**Test data:**

| Partition | `<collection order>` |
| --- | --- |
| One collection | [`<first collection>`]; the smallest grid with a tile. |
| Multiple collections | [`<first collection>`, `<second collection>`]; 2 stands for many, not a display limit. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the collection grid to finish loading.
3. Read the tiles from first to last.

**Expected Results:**

* The grid shows exactly 1 tile per returned collection.
* The tile order equals `<collection order>`.

<!-- trace:case id=g10.store-home.TC-q4t rev=1 -->
### g10.store-landing.US2-TC3: Main Page row shows products from the first collection

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
* **Trace:** g10.store-landing.US2

**Pre-conditions:**

* The catalogue returns `[<first collection>, <second collection>]`, in that order.
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
* No product only in `<second collection>` appears in the row.

<!-- trace:case id=g10.store-home.TC-l20 rev=1 -->
### g10.store-landing.US2-TC7: Main Page cards show sold out and the price before a markdown

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
* **Testability:** automation, manual
* **Trace:** g10.store-landing.US2

**Pre-conditions:**

* `<status product>` is in the Main Page's merchandised row, by the recipe "Put a card in the Main Page's merchandised row".
* The shop holds `<status product>` in the state its row describes.

**Test data:**

| Partition | `<status product>` | `<expected status>` |
| --- | --- | --- |
| For sale, full price | Offered for sale; the shop sets no earlier price. | Not sold out; one price, no earlier price. |
| Sold out | Nothing offered for sale, by the recipe "Sell a card out". | Sold out. |
| Marked down | Offered for sale; the shop has marked it down from a higher earlier price. | Not sold out; the earlier price beside the current one. |
| Sold out and marked down | Nothing offered for sale; marked down from a higher earlier price. | Sold out; the earlier price beside the current one. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the merchandised row to finish loading.
3. Read the card for `<status product>`.

**Expected Results:**

* Step 3 shows `<expected status>` on the Main Page card.

---

## g10.store-landing.US3: Open a merchandised product

**As a** customer,
**I want** to open the product I choose in the row,
**so that** I can read its own page before buying.

<!-- trace:case id=g10.store-home.TC-egn rev=1 -->
### g10.store-landing.US3-TC1: Main Page cards open the product page and offer no cart

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
* **Trace:** g10.store-landing.US3

**Pre-conditions:**

* `<displayed product>` is in the Main Page's merchandised row, by the recipe "Put a card in the Main Page's merchandised row".
* The shop holds `<displayed product>` in the state its row describes.

**Test data:**

| Partition | `<displayed product>` |
| --- | --- |
| Available | A product offered for sale, with a known handle. |
| Sold out | A product with nothing offered for sale, by the recipe "Sell a card out", with a known handle. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Inspect every merchandised card for a cart action.
3. Click the card for `<displayed product>`.

**Expected Results:**

* Step 2 finds no cart action on any merchandised card.
* Step 3 opens `<displayed product>`'s own product page.

---

## Ungrouped

### g10.store-landing.US1: Read the store front door

**As a** customer,
**I want** to read the hero before scripts or the catalogue answer,
**so that** I can understand the shop as soon as its response arrives.

<!-- trace:case id=g10.store-home.TC-5i5 rev=1 -->
#### g10.store-landing.US1-TC1: Main Page hero arrives before scripts, whatever the catalogue does

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
* **Trace:** g10.store-landing.US1

**Pre-conditions:**

* customer uses a browser with page JavaScript disabled.
* The catalogue read is in `<catalogue state>`.

**Test data:**

| Partition | `<catalogue state>` |
| --- | --- |
| Ready | The catalogue answers with collections and products. |
| Waiting | The catalogue answer is held pending while the page response arrives. |
| Failed | The catalogue read fails. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Inspect the document response in browser developer tools.
3. Read the hero on the page.

**Expected Results:**

* Step 2's response HTML holds the hero's label, headline, copy and image.
* Step 2's response HTML holds both of the hero's ways on.
* Step 3 shows the hero with no page script run.

<!-- trace:case id=g10.store-landing.TC-0gm rev=1 -->
#### g10.store-landing.US1-TC2: A store link people already hold lands on the Main Page

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
* **Trace:** g10.store-landing.US1

**Pre-conditions:**

* customer is on a lane that carries the store.

**Test data:**

| Partition | `<held store link>` |
| --- | --- |
| The front door's own address | `<grade10 store url>`, as a bookmark or a shared link. |
| An earlier store address | ❓ Which earlier addresses still land here; the Main Page PRD does not name them. |

**Steps:**

1. Navigate to `<held store link>`.
2. Read the page that opens.

**Expected Results:**

* Step 2 shows the Main Page, its hero first.
* The address bar reads `<grade10 store url>`.

---

### g10.store-landing.US2: Browse the shop catalogue sections

**As a** customer,
**I want** to see the collections and products the shop leads with,
**so that** I can choose what to browse.

<!-- trace:case id=g10.store-home.TC-usm rev=1 -->
#### g10.store-landing.US2-TC2: New shop collections appear on Main Page without a site deployment

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
* **Trace:** g10.store-landing.US2

**Pre-conditions:**

* customer can read `<grade10 store url>`.
* admin has access to the shop's admin.
* The catalogue publishes `<existing collection>`; `<new collection>` is not yet published.
* The site deployment stays fixed throughout this run.

**Test data:**

| Field | Value |
| --- | --- |
| `existing collection` | A published collection with a known name and handle. |
| `new collection` | A new collection with a distinct name and handle, ready to publish in the shop. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Read the collection grid.
3. Publish `<new collection>` in the shop's admin.
4. Wait 60 seconds past the publish.
5. Reload `<grade10 store url>`.
6. Read the collection grid again.

**Expected Results:**

* Step 2 shows `<existing collection>` and no `<new collection>`.
* Step 6 shows exactly 1 tile for `<new collection>`.
* The grid keeps the shop's updated collection order.
* No site deployment ran between steps 2 and 6.

<!-- trace:case id=g10.store-home.TC-aw0 rev=1 -->
#### g10.store-landing.US2-TC4: Main Page sections say they are loading until the catalogue answers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-landing.US2

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

* Step 2 shows `<section>` as loading.
* Step 4 shows `<successful content>` for `<section>`.
* Step 4 no longer shows `<section>` as loading.

<!-- trace:case id=g10.store-home.TC-9ds rev=1 -->
#### g10.store-landing.US2-TC5: Retry loads a failed Main Page section without a page reload

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
* **Trace:** g10.store-landing.US2

**Pre-conditions:**

* The first catalogue read for `<section>` fails.
* The next read, made by retry, returns `<successful content>`.
* The browser records document navigation requests.

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
6. Read the section after its response arrives.

**Expected Results:**

* Step 3 says the section could not be read.
* Step 3 shows a retry control in the section.
* Step 6 shows `<successful content>` in place of the failure.
* The network log shows no new document navigation.

<!-- trace:case id=g10.store-home.TC-05u rev=1 -->
#### g10.store-landing.US2-TC6: Empty Main Page sections are absent, with no heading

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-landing.US2

**Pre-conditions:**

* The catalogue answers `<empty content>` for `<section>`.

**Test data:**

| `<section>` | `<empty content>` |
| --- | --- |
| Collection grid | No collections. |
| Merchandised row | A first collection with no products. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Wait for the catalogue read to finish.
3. Inspect the area where `<section>` would appear.

**Expected Results:**

* `<section>` is absent.
* No heading for `<section>` remains.
* Nothing shows `<section>` as loading or failed.

---

### g10.store-landing.US4: Meet the store only where it is open

**As a** customer,
**I want** the store to appear only on the lanes where it is open,
**so that** I never start shopping somewhere I cannot buy.

<!-- trace:case id=g10.store-landing.TC-n1y rev=1 -->
#### g10.store-landing.US4-TC1: Store address answers only on lanes that carry the store

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression, prod
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-landing.US4

**Pre-conditions:**

* customer is signed out on `<lane>`.

**Test data:**

| Partition | `<lane>` | `<lane store url>` | `<expected status>` | `<expected answer>` |
| --- | --- | --- | --- | --- |
| Carried, not public | Staging | `<g10url>/store` | 200 | The Main Page, its hero first. |
| Public | Production | `<g10url>/store` | 404 | The site's not-found page. |

**Steps:**

1. Navigate to `<lane store url>`.
2. Inspect the document response in browser developer tools.
3. Read the page that opens.

**Expected Results:**

* Step 2's response status is `<expected status>`.
* Step 3 shows `<expected answer>`.
