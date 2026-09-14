# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-listing-US9: Collector opens the listing at rest

**As a** collector,
**I want** the catalogue already ordered by latest product when I arrive,
**so that** I see new stock first without picking a sort.

### grade10-site-store-product-listing-US9-TC1-1: Listing opens ordered by latest product

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
* **Trace:** grade10-site-store-product-listing-US-09

**Pre-conditions:**

* Catalogue holds more cards than one page lists, added on different dates,
  and <the newest card> is the most recently added of them.
* Address names no order.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Check the first card listed.
3. Read the sort trigger.
4. Open the sort menu.

**Expected Results:**

* Step 2 lists <the newest card> first.
* Sort trigger reads `Sort by` followed by the latest product option's label.
* Latest product is marked as the option in force.

### grade10-site-store-product-listing-US9-TC2-1: Sort menu offers only orders the catalogue answers

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
Catalogue holds cards.

**Steps:**

1. Navigate to <grade10 browse listing url>, unscoped.
2. Open the sort menu and read every option it offers.

**Expected Results:**

* Latest product, lowest price and highest price are offered.
* No popularity option is offered.
* Every option offered is an order the catalogue can answer.

### grade10-site-store-product-listing-US9-TC3-1: Narrowed address carries no order at rest

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-product-listing-US-09

**Pre-conditions:**

* Catalogue names <a facet group> with <a facet choice> counted behind it.
* Collector is on <grade10 browse listing url>, unscoped, having chosen no
  order.

**Steps:**

1. Select <that facet choice> in the filter panel.
2. Check the address bar.
3. Open that address in a clean browser session.

**Expected Results:**

* Address names <that facet choice> and names no order.
* Step 3 lists the same narrowing ordered by latest product.

---

## grade10-site-store-product-listing-US11: Collector orders the collection they arrived in

**As a** collector who followed a front-door tile into a collection,
**I want** to order that collection without leaving it,
**so that** I can read it newest or cheapest first and still be in the
collection I came for.

### grade10-site-store-product-listing-US11-TC1-1: Collection opens ordered by latest product

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
* **Trace:** grade10-site-store-product-listing-US-11

**Pre-conditions:**

* <A collection> holds cards added on different dates, and <its newest card>
  is the most recently added of them.
* Address names <that collection> and names no order.

**Steps:**

1. Navigate to <that collection's listing url>.
2. Check the first card listed.
3. Read the sort trigger.
4. Open the sort menu.

**Expected Results:**

* Step 2 lists <its newest card> first.
* Sort trigger reads `Sort by` followed by the latest product option's label.
* Latest product is marked as the option in force.

### grade10-site-store-product-listing-US11-TC2-1: An order chosen in a collection keeps that collection

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
* **Trace:** grade10-site-store-product-listing-US-11

**Pre-conditions:**

* <A collection> holds more than one card, and <its cheapest card> costs less
  than the rest.
* Collector is on <that collection's listing url>, scoped to it.

**Steps:**

1. Order the listing by lowest price.
2. Check the first card listed and the narrowings in force.
3. Check the address bar.
4. Open that address in a clean browser session.

**Expected Results:**

* Step 2 lists <its cheapest card> first, and no card from outside <that
  collection>.
* <That collection> is still named among the narrowings in force.
* Address names <that collection> and the order.
* Step 4 lists the same cards in the same order.
