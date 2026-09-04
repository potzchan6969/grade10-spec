# grade10-site/store/product-status Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## grade10-site-store-product-status-US1: Collector sees whether a card can be bought

**As a** collector,
**I want** every surface to tell me the same thing about whether a variant can
be bought,
**so that** a card I saw as available on the listing is available on its page
and in my cart, and nothing on the way to buying it turns out to be for show.

### grade10-site-store-product-status-US1-TC1-1: Offered variant reads available and adds to the cart

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, <a variant> is offered for sale with an inventory count of 12.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Check the tile of the card holding that variant.
3. Open the card's page.
4. Click add to cart for that variant.

**Expected Results:**

* Tile reads available.
* Page reads the variant as available.
* Step 4 adds the variant to the cart.

### grade10-site-store-product-status-US1-TC2-1: Variant the shop stopped offering reads out of stock

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, <a single-variant card> has inventory 0 and stops selling when
out of stock.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Check that card's tile.
3. Open the card's page.
4. Look for an add to cart control on the variant.

**Expected Results:**

* Tile reads out of stock.
* Page reads the variant as out of stock.
* No usable add to cart control is offered.

### grade10-site-store-product-status-US1-TC3-1: Variant sold past zero stays available

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, <a variant> has inventory 0 and continues selling when out of
stock.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Check the tile of the card holding that variant.
3. Open the card's page.
4. Click add to cart for that variant.

**Expected Results:**

* Tile and page read the variant as available, with the same treatment as a
  variant with inventory 12.
* Step 4 adds the variant to the cart.

### grade10-site-store-product-status-US1-TC4-1: Variant with untracked inventory stays available

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, <a variant> is offered for sale and its inventory is not tracked.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Open the page of the card holding that variant.
3. Click add to cart for that variant.

**Expected Results:**

* Page reads the variant as available.
* Step 3 adds the variant to the cart.

### grade10-site-store-product-status-US1-TC5-1: Scarce and plentiful variants are offered alike

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, <a variant with inventory 1> and <a variant with inventory 400>
are both offered for sale.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Compare the two cards' tiles.
3. Open each card's page and compare the variant rows.

**Expected Results:**

* Both tiles read available with the same treatment and controls.
* Both pages read the variant as available with the same treatment and
  controls.
* No remaining count or scarcity label appears on either tile or page.

### grade10-site-store-product-status-US1-TC6-1: Tile rolls up while the page answers per variant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, <a two-variant card> has one variant offered for sale and one it
stopped offering.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Check that card's tile.
3. Open the card's page.

**Expected Results:**

* Tile reads available.
* Page reads the offered variant as available and the other as out of stock.

### grade10-site-store-product-status-US1-TC7-1: Card with every variant out of stock keeps its prices

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, every variant of <a two-variant card> has inventory 0 and stops
selling when out of stock.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Check that card's tile.
3. Open the card's page.
4. Look for an add to cart control on each variant.

**Expected Results:**

* Tile reads out of stock.
* Each variant on the page is still priced.
* No usable add to cart control is offered for either variant.

### grade10-site-store-product-status-US1-TC8-1: Listing, page and cart agree on a variant that stopped selling

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
The cart holds <a variant>; the shop then sets its inventory to 0 and stops
selling it when out of stock, and the browse cache has been invalidated.

**Steps:**

1. Navigate to <grade10 browse listing url> and check the card's tile.
2. Open the card's page and check the variant.
3. Open the cart and check the line.

**Expected Results:**

* Tile reads out of stock.
* Page reads the variant as out of stock.
* Cart line reads out of stock.

### grade10-site-store-product-status-US1-TC9-1: Unpublished product is absent from the listing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-01

**Pre-conditions:**
On the shop, <a product> is not published to the store's sales channel.

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Look for a tile for that product, including under any unavailable
   treatment.
3. Check the treatment of every tile that appears.

**Expected Results:**

* No tile for that product appears.
* Every tile reads available or out of stock.

---

## grade10-site-store-product-status-US2: Collector asks for more than the shop can fill

**As a** collector,
**I want** the store to tell me when it can fill only part of what I asked
for, and how much,
**so that** a request the shop cannot meet is a stated answer I can act on
rather than a refusal at checkout.

### grade10-site-store-product-status-US2-TC1-1: Request within the count is fillable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-02

**Pre-conditions:**
On the shop, <a variant> is offered for sale with an inventory count of 12.

**Test data:**

| Requested | Count | Answer |
| --- | --- | --- |
| 3 | 12 | fillable |
| 12 | 12 | fillable |

**Steps:**

1. Open the card's page and add the variant to the cart with the quantity in
   the row.
2. Open the cart and check the line.

**Expected Results:**

* Line keeps the requested quantity in each row.
* No adjustment and no out-of-stock marking on the line.

### grade10-site-store-product-status-US2-TC2-1: Request above the count is filled in part

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-02

**Pre-conditions:**
On the shop, <a variant> is offered for sale with an inventory count of 2.

**Test data:**

| Field | Value |
| --- | --- |
| Requested | 5 |
| Count | 2 |

**Steps:**

1. Open the card's page and add the variant to the cart with quantity 5.
2. Open the cart and check the line.
3. Return to the card's page and check the variant.

**Expected Results:**

* Line says the shop can fill 2.
* Page still reads the variant as available.

### grade10-site-store-product-status-US2-TC3-1: Request of an out-of-stock variant is not fillable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-02

**Pre-conditions:**
The cart holds 5 of <a variant>; the shop then sets its inventory to 0 and
stops selling it when out of stock.

**Steps:**

1. Open the cart.
2. Check the line for that variant.

**Expected Results:**

* Line reads out of stock.
* No quantity is offered as fillable.

### grade10-site-store-product-status-US2-TC4-1: Unbounded variants fill any request

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-status-US-02

**Pre-conditions:**
On the shop, <an untracked variant> is offered for sale with no inventory
count, and <a continue-selling variant> is offered for sale with inventory 0.

**Test data:**

| Variant | Requested |
| --- | --- |
| <an untracked variant> | 50 |
| <a continue-selling variant> | 50 |

**Steps:**

1. Add each variant to the cart with the quantity in its row.
2. Open the cart and check both lines.

**Expected Results:**

* Both lines keep 50.
* No adjustment and no out-of-stock marking on either line.
