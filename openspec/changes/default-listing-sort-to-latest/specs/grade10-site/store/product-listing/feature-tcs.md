# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-listing-US9: Collector opens the listing at rest

**As a** collector,
**I want** the catalogue already ordered by latest product when I arrive,
**so that** I see new stock first without picking a sort.

### grade10-site-store-product-listing-US9-TC1-1: The listing opens ordered by latest product

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-09

**Pre-conditions:**

* A catalogue holding products added on different days.

**Steps:**

1. Open the listing at an address carrying no order.
2. Read the sort trigger.
3. Open the sort menu.

**Expected Results:**

* The cards are ordered by latest product.
* The trigger reads `Sort by` followed by the latest option's label.
* The latest option is marked selected in the menu.

### grade10-site-store-product-listing-US9-TC2-1: The menu offers only orders the catalogue can answer

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
* **Trace:** grade10-site-store-product-listing-US-09

**Pre-conditions:**

* None.

**Steps:**

1. Open the listing.
2. Open the sort menu and read every option it offers.

**Expected Results:**

* Latest product, lowest price and highest price are offered.
* Popularity is not offered, disabled or otherwise.
