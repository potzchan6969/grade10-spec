# grade10-site/store/product-listing Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-product-listing-US12: Collector sees the shop as it is now

**As a** collector,
**I want** the listing to show what the shop sells right now — what is new,
what is gone, what it costs and how many are left,
**so that** I never open a product that has gone or reach for a price the shop
has left behind.

### grade10-site-store-product-listing-US12-TC1-1: A published product is listed within seconds

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* The listing answers and its count reads <N>.
* <a product> exists in the shop, not published to the store's channel, with a world and a type.

**Steps:**

1. In the shop, publish <a product> to the store's channel.
2. Within 10 seconds, open <grade10 browse listing url> from two locations.
3. Read the count above the grid and the counts beside <a product>'s world and type.

**Expected Results:**

* Step 2 lists <a product> at both locations.
* Step 3 reads <N + 1> above the grid, and each of <a product>'s facets counts one more.

### grade10-site-store-product-listing-US12-TC2-1: A product taken down leaves within seconds

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* The listing lists <a product> and its count reads <N>.

**Steps:**

1. In the shop, take <a product> off the store's channel.
2. Within 10 seconds, open <grade10 browse listing url> from two locations.
3. Read the count above the grid and the counts beside <a product>'s world and type.

**Expected Results:**

* Step 2 lists <a product> at neither location.
* Step 3 reads <N − 1> above the grid, and each of <a product>'s facets counts one fewer.

### grade10-site-store-product-listing-US12-TC3-1: A card follows the shop's price and stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* The listing lists <a product> at <old price>, and the card stops at <old count>.

**Steps:**

1. In the shop, set <a product>'s price to <new price> and its count to <new count>.
2. Within 10 seconds, open <grade10 browse listing url> ordered by lowest price.
3. Read <a product>'s card and raise its quantity past <new count>.

**Expected Results:**

* Step 3 shows <new price> on the card and the quantity stops at <new count>.
* Step 2 places <a product> where <new price> falls in the order.

### grade10-site-store-product-listing-US12-TC4-1: A change the shop never reported is caught by the re-read

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-store-product-listing-US-12

**Pre-conditions:**

* The listing's sidebar names <a world> by its label.
* The store receives no report when a world's label changes.

**Steps:**

1. In the shop, rename <a world>'s label to <new label>.
2. Wait 5 minutes.
3. Open <grade10 browse listing url> and read the sidebar.

**Expected Results:**

* Step 3 names the world <new label>.

## grade10-site-store-product-listing-US13: Collector browses while the shop is unreachable

**As a** collector,
**I want** the listing to keep answering when the shop's own service is down,
**so that** I can go on browsing and come back to buy when it is up.

### grade10-site-store-product-listing-US13-TC1-1: The listing lists while the shop is down

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-listing-US-13

**Pre-conditions:**

* The listing answered while the shop could be read, listing <N> products.
* The shop's storefront reads now fail.

**Steps:**

1. Open <grade10 browse listing url> from a location that has served the listing, and from one that has not.
2. Read the grid, the count above it and the sidebar.
3. Open <a product>'s page.

**Expected Results:**

* Step 2 lists the same <N> products, count and sidebar at both locations, with no message about the shop.
* Step 3 is what fails or waits, not the listing.

**Out of suite:**

- `grade10-site-store-product-listing-SC-46` — No journey lists it: the read-back guard is the store's own ordering rule, walked by the worker lane's tests rather than by a collector.
