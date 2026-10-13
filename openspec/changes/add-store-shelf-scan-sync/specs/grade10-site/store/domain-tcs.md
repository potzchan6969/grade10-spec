# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.store-dmn.US11: Shopkeeper scans a shelf product and opens its store page

**As a** shopkeeper,
**I want** the product the scanner names to open on its store page with the
same title, price and availability,
**so that** what I tell a customer at the shelf is what the store sells them
online.

<!-- trace:case id=g10.store-dmn.TC-xk6 rev=1 -->
### g10.store-dmn.US11-TC1: Scanned product opens its own page with the same answer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-shelf-scanning.US1, g10.store-shelf-scanning.US2, g10.store-shelf-scanning.US3, g10.store-shelf-scanning.US4, grade10-site-store-product-page-US-01, grade10-site-store-product-page-US-04

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* admin(shopkeeper) has the shop's scanner link open on a phone.
* `<product>` is published to the store and on the scanner since its last change.

**Test data:**

| `<product>` | `<availability>` |
| --- | --- |
| A raw card with its one item for sale | Available |
| A card with nothing for sale | Sold out |
| One slab of a card the store lists as two or more slabs, each naming its inventory item | Available |

**Steps:**

1. Point the camera at `<product>` on the shelf.
2. Read the title, price and availability the scan shows.
3. Open the store page link on the scan.
4. Read the title, price and purchase area on the page.

**Expected Results:**

* Step 2 names `<product>` and reads `<availability>`, with no stock count.
* Step 2 shows grade and cert for the slab row only.
* Step 3 opens `<product>`'s own store page, not another copy's.
* Step 4's title and price match step 2's.
* Step 4's purchase area reads `<availability>`.
