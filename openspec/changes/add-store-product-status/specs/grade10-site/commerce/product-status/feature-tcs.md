# grade10-site/commerce/product-status Test Cases

**Status:** pending-review · 0/16
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-commerce-product-status-US1: Collector sees whether a card can be bought

**As a** collector,
**I want** the listing tile to report whether any item on the card can be
bought, and the product page and cart to report the same internal sale item,
**so that** the availability I see before adding matches the item in my cart.

<!-- trace:case id=g10.commerce-product-status.TC-c3l rev=2 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC1-2: Item for sale reads available on tile, page and cart line

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

* customer(member) is signed in with an empty cart.
* <product_1> has one variant, for sale, tracked at <count_1>.

**Test data:**

| Field | Value |
| --- | --- |
| <product_1> | A card on the store's sales channel with one variant |
| <count_1> | 5 (any count above 0) |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_1>'s name in the listing search and press Enter.
3. Read <product_1>'s tile.
4. Click the tile's photo.
5. Read the purchase area.
6. Click the add control in the purchase area.
7. Open the cart drawer if the add did not open it.
8. Read <product_1>'s line.

**Expected Results:**

* Step 3: the tile reads available and its add control can be pressed.
* Step 5: the page shows the item's price and reads available.
* Step 8: the line is <product_1>, quantity 1, with no sold-out, adjusted or unchecked marking.

<!-- trace:case id=g10.commerce-product-status.TC-wjo rev=2 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC2-2: Single-item card the shop stops selling reads sold out, still priced

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

* <product_2> has one variant, priced <price_2>.
* <product_2> is sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| <product_2> | A card on the store's sales channel with one variant |
| <price_2> | Its price, for example HKD 88.00 (8800 minor units) |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_2>'s name in the listing search and press Enter.
3. Read <product_2>'s tile.
4. Navigate to <product_2 url>.
5. Read the purchase area.

**Expected Results:**

* Step 3: the tile reads sold out, shows <price_2>, and offers no add control that can be pressed.
* Step 5: the page shows <price_2> and reads sold out.
* Step 5: nothing that adds <product_2> can be pressed.

<!-- trace:case id=g10.commerce-product-status.TC-01e rev=1 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC3-1: Item the shop still sells at no count reads available

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
* **Trace:** grade10-site-commerce-product-status-US-01

**Pre-conditions:**

* <product_3> has one variant, for sale, set up in the staging shop's admin as the row says.
* 60 seconds have passed since the setup was saved.

**Test data:**

| Row | <product_3>'s variant in the staging shop's admin |
| --- | --- |
| Sells past zero | Inventory tracked at 0, Continue selling when out of stock on |
| Not counted | Track quantity off |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_3>'s name in the listing search and press Enter.
3. Read <product_3>'s tile.
4. Navigate to <product_3 url>.
5. Read the purchase area.

**Expected Results:**

* Step 3: the tile reads available and its add control can be pressed.
* Step 5: the page reads available and its add control can be pressed.
* Neither surface marks the item differently from an item tracked above 0.

<!-- trace:case id=g10.commerce-product-status.TC-gpj rev=1 covers=none -->
### grade10-site-commerce-product-status-US1-TC4-1: Offered item with no inventory count stays available

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

<!-- trace:case id=g10.commerce-product-status.TC-0ay rev=1 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC5-1: Browse surfaces say nothing about how many remain

Runs once per row of **Test data**.

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

* <product_4> has one variant, for sale, tracked at the row's count.
* 60 seconds have passed since the count was saved.

**Test data:**

| Row | Count |
| --- | --- |
| Last one | 1 |
| Well stocked | 400 |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_4>'s name in the listing search and press Enter.
3. Read <product_4>'s tile.
4. Navigate to <product_4 url>.
5. Read the purchase area.

**Expected Results:**

* Step 3: the tile reads available, with no remaining count and no scarcity cue.
* Step 5: the page shows the item's price and reads available.
* Step 5: no remaining count and no scarcity cue.

<!-- trace:case id=g10.commerce-product-status.TC-vpr rev=2 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC6-2: Tile with one variant for sale reads available; page takes that variant

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

* <product_6>'s first listed variant is sold out by the recipe "Sell a card out", applied to that variant only.
* <product_6>'s second listed variant is for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product_6> | A card with two variants, priced differently |
| <price_6a> | The first listed variant's price, for example HKD 50.00 (5000 minor units) |
| <price_6b> | The second listed variant's price, for example HKD 70.00 (7000 minor units) |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_6>'s name in the listing search and press Enter.
3. Read <product_6>'s tile.
4. Navigate to <product_6 url>.
5. Read the purchase area.

**Expected Results:**

* Step 3: the tile reads available, at <price_6b>.
* Step 5: the page shows <price_6b>, not <price_6a>, and reads available.
* Step 5: no size, option or variant choice, and no variant name.

<!-- trace:case id=g10.commerce-product-status.TC-f39 rev=2 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC7-2: Tile reads sold out only when every variant is; page prices the first listed

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

* Every variant of <product_7> is sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| <product_7> | A card with two variants, priced differently |
| <price_7a> | The first listed variant's price, above the second's, for example HKD 70.00 (7000 minor units) |
| <price_7b> | The second listed variant's price, for example HKD 50.00 (5000 minor units) |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_7>'s name in the listing search and press Enter.
3. Read <product_7>'s tile.
4. Navigate to <product_7 url>.
5. Read the purchase area.

**Expected Results:**

* Step 3: the tile reads sold out, shows <price_7a>, and offers no add control that can be pressed.
* Step 5: the page shows <price_7a>, not <price_7b>, and reads sold out.
* Step 5: no variant choice or variant name, and nothing that adds <product_7> can be pressed.

<!-- trace:case id=g10.commerce-product-status.TC-gsh rev=2 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC8-2: Item sold out after it was added reads sold out everywhere

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

* customer(member) is signed in.
* The cart holds 1 of <product_8>, added while the shop sold it.
* Since then, <product_8> is sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| <product_8> | A card with one variant, priced <price_8> |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_8>'s name in the listing search and press Enter.
3. Read <product_8>'s tile.
4. Navigate to <product_8 url>.
5. Read the purchase area.
6. Open the cart drawer.
7. Read <product_8>'s line.

**Expected Results:**

* Step 3: the tile reads sold out.
* Step 5: the page shows <price_8> and reads sold out, and nothing that adds <product_8> can be pressed.
* Step 7: the line is still in the cart, marked sold out.

<!-- trace:case id=g10.commerce-product-status.TC-rza rev=2 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
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

* <product_9> is removed from the store's sales channel in the staging shop's admin.
* 5 minutes have passed since the removal was saved.

**Test data:**

| Field | Value |
| --- | --- |
| <product_9> | A card that was on the store's sales channel, with a name no other card shares |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_9>'s name in the listing search and press Enter.
3. Read the grid.
4. Navigate to <product_9 url>.

**Expected Results:**

* Step 3: no tile for <product_9>, sold out or otherwise.
* Step 4 answers 404 with the site's not-found page.

<!-- trace:case id=g10.commerce-product-status.TC-vrz rev=1 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC10-1: Listing and page add the same item of a several-variant card

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

* customer(member) is signed in with an empty cart.
* <product_10>'s first listed variant is sold out by the recipe "Sell a card out", applied to that variant only.
* <product_10>'s second and third listed variants are for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product_10> | A card with three variants, priced differently |
| <price_10b> | The second listed variant's price, for example HKD 70.00 (7000 minor units) |
| <price_10c> | The third listed variant's price, below the second's, for example HKD 30.00 (3000 minor units) |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_10>'s name in the listing search and press Enter.
3. Click the add control on <product_10>'s tile.
4. Navigate to <product_10 url>.
5. Click the add control in the purchase area.
6. Open the cart drawer if the add did not open it.
7. Read the lines.

**Expected Results:**

* Step 7: one line for <product_10>, quantity 2, at <price_10b>, with no sold-out, adjusted or unchecked marking.
* Step 7: no line at <price_10c>.

<!-- trace:case id=g10.commerce-product-status.TC-tjt rev=1 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC11-1: Card with every variant for sale takes its first listed, not its cheapest

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

* customer(member) is signed in with an empty cart.
* Every variant of <product_15> is for sale.

**Test data:**

| Field | Value |
| --- | --- |
| <product_15> | A card with two variants, both for sale |
| <price_15a> | The first listed variant's price, above the second's, for example HKD 70.00 (7000 minor units) |
| <price_15b> | The second listed variant's price, for example HKD 50.00 (5000 minor units) |

**Steps:**

1. Navigate to <grade10 browse listing url>.
2. Type <product_15>'s name in the listing search and press Enter.
3. Read <product_15>'s tile.
4. Navigate to <product_15 url>.
5. Read the purchase area.
6. Click the add control in the purchase area.
7. Open the cart drawer if the add did not open it.
8. Read the lines.

**Expected Results:**

* Step 3: the tile reads available, at <price_15a>, not <price_15b>.
* Step 5: the page shows <price_15a>, with no size, option or variant choice.
* Step 8: one line for <product_15>, quantity 1, at <price_15a>.

<!-- trace:case id=g10.commerce-product-status.TC-1kh rev=1 covers=g10.commerce-product-status.SC-zdl,g10.commerce-product-status.SC-dvw,g10.commerce-product-status.SC-jwx,g10.commerce-product-status.SC-w6q,g10.commerce-product-status.SC-my5,g10.commerce-product-status.SC-oaw,g10.commerce-product-status.SC-h7u,g10.commerce-product-status.SC-uei,g10.commerce-product-status.SC-ns0,g10.commerce-product-status.SC-5rs,g10.commerce-product-status.SC-77x,g10.commerce-product-status.SC-g9e -->
### grade10-site-commerce-product-status-US1-TC12-1: Line keeps its item after the card's one item moves

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

* customer(member) is signed in.
* <product_17>'s first listed variant is sold out by the recipe "Sell a card out", applied to that variant only, and its second is for sale.
* The cart holds 1 of <product_17>, added from <product_17 url>, at <price_17b>.
* Since then, the second listed variant is sold out by the recipe "Sell a card out", applied to that variant only, and the first listed variant's inventory is set to 5 in the staging shop's admin.
* 60 seconds have passed since the last change was saved.

**Test data:**

| Field | Value |
| --- | --- |
| <product_17> | A card with two variants, priced differently |
| <price_17a> | The first listed variant's price, for example HKD 70.00 (7000 minor units) |
| <price_17b> | The second listed variant's price, for example HKD 50.00 (5000 minor units) |

**Steps:**

1. Open the cart drawer.
2. Read <product_17>'s line.
3. Navigate to <product_17 url>.
4. Read the purchase area.
5. Click the add control in the purchase area.
6. Open the cart drawer if the add did not open it.
7. Read the lines.

**Expected Results:**

* Step 2: the line is still in the cart at <price_17b>, marked sold out.
* Step 4: the page reads available, at <price_17a>, with no size, option or variant choice.
* Step 7: two lines for <product_17>: the earlier line at <price_17b>, still marked sold out, and a new line of 1 at <price_17a>, with no marking.
* Step 7: each line names the variant it holds, so the two read apart.

---

## grade10-site-commerce-product-status-US2: Collector asks for more than the shop can fill

**As a** collector,
**I want** the store to tell me when it can fill only part of what I asked
for, and how much,
**so that** a request the shop cannot meet is a stated answer I can act on
rather than a refusal at checkout.

<!-- trace:case id=g10.commerce-product-status.TC-kxe rev=2 covers=g10.commerce-product-status.SC-csg,g10.commerce-product-status.SC-fhg,g10.commerce-product-status.SC-l64,g10.commerce-product-status.SC-jj1,g10.commerce-product-status.SC-2mz,g10.commerce-product-status.SC-0pg -->
### grade10-site-commerce-product-status-US2-TC1-2: Request at or below the shop's count is filled whole

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

* customer(member) is signed in with an empty cart.
* <product_11> has one variant, for sale, tracked at the row's count, not sold when out of stock.

**Test data:**

| Surface | Count | Requested | Add | Line reads |
| --- | --- | --- | --- | --- |
| <product_11>'s tile on <grade10 browse listing url>, found by searching its name | 3 | 3 | Click the tile's add control, then raise the tile's stepper to 3 | 3 |
| <product_11 url> | 3 | 2 | Set the page's stepper to 2, then click Add to cart | 2 |

**Steps:**

1. Navigate to the row's surface.
2. Add the row's requested quantity as the row's **Add** says.
3. Open the cart drawer if the add did not open it.
4. Read <product_11>'s line.

**Expected Results:**

* Step 2: the stepper holds the requested quantity.
* Step 4: the line reads the row's quantity, with no adjusted or sold-out marking.

<!-- trace:case id=g10.commerce-product-status.TC-huo rev=2 covers=g10.commerce-product-status.SC-csg,g10.commerce-product-status.SC-fhg,g10.commerce-product-status.SC-l64,g10.commerce-product-status.SC-jj1,g10.commerce-product-status.SC-2mz,g10.commerce-product-status.SC-0pg -->
### grade10-site-commerce-product-status-US2-TC2-2: Request above the shop's count is filled in part, naming how many

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

* customer(member) is signed in with an empty cart.
* <product_12> has one variant, for sale, tracked at the row's count, with the row's out-of-stock setting in the staging shop's admin.
* 60 seconds have passed since the setup was saved.

**Test data:**

| Surface | Count | When out of stock | Requested | Add | Line reads |
| --- | --- | --- | --- | --- | --- |
| <product_12>'s tile on <grade10 browse listing url>, found by searching its name | 2 | Not sold | 3 | Click the tile's add control, then raise the tile's stepper to 3 | 2 |
| <product_12 url> | 2 | Not sold | 5 | Set the page's stepper to 5, then click Add to cart | 2 |
| <product_12 url> | 2 | Continue selling when out of stock on | 5 | Set the page's stepper to 5, then click Add to cart | 2 |

**Steps:**

1. Navigate to the row's surface.
2. Add the row's requested quantity as the row's **Add** says.
3. Open the cart drawer if the add did not open it.
4. Read <product_12>'s line.

**Expected Results:**

* Step 2: the stepper holds the requested quantity, with no ceiling and no remaining count shown.
* Step 4: the line reads the row's quantity, marked adjusted.
* Step 4: the line says the shop can fill only that many.

<!-- trace:case id=g10.commerce-product-status.TC-m97 rev=2 covers=g10.commerce-product-status.SC-csg,g10.commerce-product-status.SC-fhg,g10.commerce-product-status.SC-l64,g10.commerce-product-status.SC-jj1,g10.commerce-product-status.SC-2mz,g10.commerce-product-status.SC-0pg -->
### grade10-site-commerce-product-status-US2-TC3-2: Request for an item the shop stopped selling is not filled

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

* customer(member) is signed in.
* The cart holds 2 of <product_13>, added while the shop sold it.
* Since then, <product_13> is sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| <product_13> | A card with one variant |

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the cart drawer.
3. Read <product_13>'s line.

**Expected Results:**

* Step 3: the line is marked sold out, not adjusted.
* Step 3: the line offers no quantity as one the shop can fill.

<!-- trace:case id=g10.commerce-product-status.TC-oia rev=2 covers=g10.commerce-product-status.SC-csg,g10.commerce-product-status.SC-fhg,g10.commerce-product-status.SC-l64,g10.commerce-product-status.SC-jj1,g10.commerce-product-status.SC-2mz,g10.commerce-product-status.SC-0pg -->
### grade10-site-commerce-product-status-US2-TC4-2: No count, or a count of 0 the shop sells past, bounds no request

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

* customer(member) is signed in with an empty cart.
* <product_14> has one variant, for sale, set up in the staging shop's admin as the row says.
* 60 seconds have passed since the setup was saved.

**Test data:**

| Row | <product_14>'s variant in the staging shop's admin | Requested | Line reads |
| --- | --- | --- | --- |
| Sells past zero | Inventory tracked at 0, Continue selling when out of stock on | 5 | 5 |
| Not counted | Track quantity off | 5 | 5 |

**Steps:**

1. Navigate to <product_14 url>.
2. Set the add control's quantity to 5.
3. Click the add control.
4. Open the cart drawer if the add did not open it.
5. Read <product_14>'s line.

**Expected Results:**

* Step 5: the line reads 5, with no adjusted or sold-out marking.

<!-- trace:case id=g10.commerce-product-status.TC-htg rev=1 covers=g10.commerce-product-status.SC-csg,g10.commerce-product-status.SC-fhg,g10.commerce-product-status.SC-l64,g10.commerce-product-status.SC-jj1,g10.commerce-product-status.SC-2mz,g10.commerce-product-status.SC-0pg -->
### grade10-site-commerce-product-status-US2-TC5-1: Second add that takes the line past the shop's count is filled in part

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
* **Trace:** grade10-site-commerce-product-status-US-02

**Pre-conditions:**

* customer(member) is signed in.
* <product_16> has one variant, for sale, tracked at 3, not sold when out of stock.
* The cart holds 2 of <product_16>, with no marking.

**Test data:**

| Field | Value |
| --- | --- |
| <product_16> | A card with one variant |
| Added | 2, so the line asks for 4 against a count of 3 |

**Steps:**

1. Navigate to <product_16 url>.
2. Set the quantity to 2.
3. Click the add control.
4. Open the cart drawer if the add did not open it.
5. Read <product_16>'s lines.

**Expected Results:**

* Step 2: the stepper holds 2, with no ceiling and no remaining count shown.
* Step 5: one line for <product_16>, reading 3, marked adjusted.
* Step 5: the line says the shop can fill only that many.

## Settled

- The front door's merchandised row reads a card's sold-out status as the listing tile does and offers no add, so the one-item add does not arise there.
- A listing tile shows the price of the card's one item: the first variant for sale, or the first listed when none is.
- A sold-out item keeps its price, its quantity stepper and a Sold out button, both disabled: nothing that adds it can be pressed.
- A cart line keeps the variant it was added as and names it; once the card's one item moves to another variant, a page add puts that variant on a line of its own.
- A request above a count above zero fills in part even when the shop sells the variant past zero.

## Reconciliation

**Run:** QA2 on 2026-10-07, in a fresh context after the sixth acceptance
review's update and QA1's blind re-run. Read the anchors, these cases, the
scenarios at their current revisions, `tech-design.md`, `tasks.md`,
`decisions.md`, the Product Status page and Grade10's line title. US1-TC12-1
folds against SC-18 at rev 2: step 7 reads each line's variant name, which
`lineTitle` gives a card listing more than one. QA1 changed no case here and
raised nothing. Every live case folds, the tables of the earlier QA2 run
stand, and no scenario is uncovered or contradicted.

**Run:** Update on 2026-10-07, from the sixth acceptance review. The rule
**One answer** is renamed **One item per card**, the name the page and the
feature set give it, and now has a cart line name its variant where the card
lists more than one (Q19). SC-18 moved to rev 2 to say each line names its
variant, and US1-TC12-1 expects it at step 7; the draft, not yet accepted,
keeps its revision. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, in a fresh context after QA1's blind re-run.
Read the anchors, these cases, the scenarios at their current revisions,
`tech-design.md`, `ui-design.md`, `tasks.md`, `decisions.md`, the Product
Status page and Grade10's cart model and line classification. Every live case
folds. QA1's two questions land as Q19 and Q20, decided by the round from the
rules and what Grade10 builds. Q19 sharpens **One item per card** and adds SC-18;
QA2 adds US1-TC12-1 to walk it, and every US1 case now covers it. Q20 needs no
scenario: **Count as bound** and **No second derivation** already fill the
request at the count, and US2-TC2-2's third row walks it. US1-TC11-1 proves
the **One item per card** rule's order, the first listed rather than the cheapest,
which SC-12 and SC-14 state; US1-TC6, US1-TC7 and US1-TC10 now price the item
the page skips below the one it shows, so the cheapest never passes by
accident.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `grade10-site-commerce-product-status-US1-TC1-2` | Folded | SC-01, SC-14 |
| `grade10-site-commerce-product-status-US1-TC2-2` | Folded | SC-02, SC-13, SC-15 |
| `grade10-site-commerce-product-status-US1-TC3-1` | Folded | SC-03, SC-04 |
| `grade10-site-commerce-product-status-US1-TC4-1` | Deprecated: the Not counted row of US1-TC3-1 | SC-04 |
| `grade10-site-commerce-product-status-US1-TC5-1` | Folded | SC-10, SC-11 |
| `grade10-site-commerce-product-status-US1-TC6-2` | Folded; the skipped sold-out variant is the cheaper | SC-12 |
| `grade10-site-commerce-product-status-US1-TC7-2` | Folded; the first listed is the dearer | SC-13, SC-15 |
| `grade10-site-commerce-product-status-US1-TC8-2` | Folded | SC-02, SC-15 |
| `grade10-site-commerce-product-status-US1-TC9-2` | Folded | SC-16 |
| `grade10-site-commerce-product-status-US1-TC10-1` | Folded; the third variant is the cheapest | SC-14 |
| `grade10-site-commerce-product-status-US1-TC11-1` | Folded: every variant for sale, the first listed is the dearer and is the one item | SC-12, SC-14 |
| `grade10-site-commerce-product-status-US1-TC12-1` | Added by QA2 for QA1's question on a line whose item moved (Q19) | SC-18 |
| `grade10-site-commerce-product-status-US2-TC1-2` | Folded | SC-05, SC-06 |
| `grade10-site-commerce-product-status-US2-TC2-2` | Folded; its third row is a count the shop sells past (Q20) | SC-07, SC-17 |
| `grade10-site-commerce-product-status-US2-TC3-2` | Folded | SC-08 |
| `grade10-site-commerce-product-status-US2-TC4-2` | Folded | SC-09 |
| `grade10-site-commerce-product-status-US2-TC5-1` | Folded: a second page add joins the line and asks past the count | SC-07, SC-17; `grade10-site-store-product-page-SC-36`, `grade10-site-store-cart-validation-SC-05` |

| Scenario | Cases |
| --- | --- |
| SC-01 | US1-TC1 |
| SC-02 | US1-TC2, US1-TC8 |
| SC-03, SC-04 | US1-TC3 |
| SC-05, SC-06 | US2-TC1 |
| SC-07 | US2-TC2, US2-TC5 |
| SC-08 | US2-TC3 |
| SC-09 | US2-TC4 |
| SC-10, SC-11 | US1-TC5 |
| SC-12 | US1-TC6, US1-TC11 |
| SC-13 | US1-TC2, US1-TC7 |
| SC-14 | US1-TC1, US1-TC10, US1-TC11 |
| SC-15 | US1-TC2, US1-TC7, US1-TC8 |
| SC-16 | US1-TC9 |
| SC-17 | US2-TC2, US2-TC5 |
| SC-18 | US1-TC12 |
| Uncovered | none |
| Contradicted | none |

| Raised | Disposition |
| --- | --- |
| Does a line keep its variant once the card's one item moves, and does a page add start a second line? | Q19, decided: yes to both, as Grade10 keys a line on its variant; **One item per card** and SC-18 carry it, and US1-TC12 walks it |
| Is a request above a count filled in part when the shop sells past zero? | Q20, decided: yes, at the count, since the store never reads the inventory policy; US2-TC2's third row walks it |

**Run:** Update on 2026-10-06, from the fifth acceptance review. The tile has
no quantity before its first add, and its first press adds 1 (Q18), so
US2-TC1-2 and US2-TC2-2 now add on each surface in its own order, under a new
**Add** column: the tile's add control and then its stepper, or the page's
stepper and then Add to cart. What each case asserts is unchanged, so both
keep rev 2. A case that reads the cart after a page add opens the drawer only
if the add did not open it, because Product Details' Buy opens it. QA2 reruns
on this suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the fourth
acceptance review, which moved nothing in this capability. Settled now carries
Q16. Every live case folds, the tables of the earlier QA2 run stand, and
nothing was raised.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the third
acceptance review. Read the anchors, these cases, the scenarios at their
current revisions, `tech-design.md`, `ui-design.md`, `tasks.md`,
`decisions.md`, the Product Status page and Grade10's purchase panel. The
**Priced but unbuyable** anchor changed its words, not what a case sees: every
case already expected that nothing adding a sold-out item can be pressed, so
QA1's reading stands. US1-TC8-2's step 5 now says it in those words, because
the page shows a disabled Sold out button (Q16). Every live case folds, the
tables of the earlier QA2 run stand, no scenario is uncovered or contradicted,
and nothing was raised.

**Run:** Update on 2026-10-06, from the third acceptance review. **Priced but
unbuyable** now reads that nothing that adds an out-of-stock variant can be
pressed, as the built page shows a disabled Sold out button (Q16). The
scenarios already said so, and no case changed. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the rebase. Read
the anchors, these cases, the Dev scenarios at their current revisions,
`tech-design.md`, `ui-design.md`, `tasks.md`, `decisions.md`, the Product
Status, Product Listing, Product Details and Cart Validation pages and the
Grade10 tile price mapper. Every live case folds against SC-12, SC-13 and
SC-14 at rev 2, and no scenario is uncovered or contradicted. US1-TC10-1 now
asserts the one line carries no marking, as SC-14 says it reads available.
Nothing new was raised.

**Run:** Update on 2026-10-06, from the second acceptance review, after the
change was rebased on main. Each case keeps the `trace:case` id main or the
durable suite gave its number, its `rev` follows its heading, and its
`covers` names every scenario serving its journeys; a deprecated case covers
none. US1-TC10 takes a new id. SC-12, SC-13 and SC-14 moved to rev 2 for the tile's
price, its sold-out status and the listing add. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, in a fresh context. Read the anchors, these cases,
the Dev scenarios, `tech-design.md`, `ui-design.md`, `tasks.md`,
`decisions.md`, the Product Status, Product Listing, Product Details and Cart
Validation pages, the store's home and checkout specs, and the Grade10 source
the tech design cites. Every live case folds. QA1's two questions on this
capability land as Q10 and Q11; Q11 adds the tile's price to the one-item rule
and its scenario. Cases that read a cart line after a browse add now open the
cart drawer, since no rule here says an add opens it.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `grade10-site-commerce-product-status-US1-TC1-2` | Folded; step 7 opens the cart drawer | SC-01, SC-14 |
| `grade10-site-commerce-product-status-US1-TC2-2` | Folded | SC-02, SC-13, SC-15 |
| `grade10-site-commerce-product-status-US1-TC3-1` | Folded | SC-03, SC-04 |
| `grade10-site-commerce-product-status-US1-TC4-1` | Deprecated: the Not counted row of US1-TC3-1 | SC-04 |
| `grade10-site-commerce-product-status-US1-TC5-1` | Folded | SC-10, SC-11 |
| `grade10-site-commerce-product-status-US1-TC6-2` | Folded; step 3 asserts the tile's price (Q11) | SC-12 |
| `grade10-site-commerce-product-status-US1-TC7-2` | Folded; step 3 asserts the tile keeps the first listed price | SC-13, SC-15 |
| `grade10-site-commerce-product-status-US1-TC8-2` | Folded | SC-02, SC-15; the cart line is `grade10-site/store/cart-validation`'s out-of-stock rule |
| `grade10-site-commerce-product-status-US1-TC9-2` | Folded | SC-16 |
| `grade10-site-commerce-product-status-US1-TC10-1` | Folded; step 6 opens the cart drawer | SC-14 |
| `grade10-site-commerce-product-status-US2-TC1-2` | Folded; step 4 opens the cart drawer | SC-05, SC-06 |
| `grade10-site-commerce-product-status-US2-TC2-2` | Folded; step 4 opens the cart drawer | SC-07, SC-17 |
| `grade10-site-commerce-product-status-US2-TC3-2` | Folded | SC-08 |
| `grade10-site-commerce-product-status-US2-TC4-2` | Folded; step 4 opens the cart drawer | SC-09 |

| Scenario | Cases |
| --- | --- |
| SC-01 | US1-TC1 |
| SC-02 | US1-TC2, US1-TC8 |
| SC-03, SC-04 | US1-TC3 |
| SC-05, SC-06 | US2-TC1 |
| SC-07 | US2-TC2 |
| SC-08 | US2-TC3 |
| SC-09 | US2-TC4 |
| SC-10, SC-11 | US1-TC5 |
| SC-12 | US1-TC6 |
| SC-13 | US1-TC2, US1-TC7 |
| SC-14 | US1-TC1, US1-TC10 |
| SC-15 | US1-TC2, US1-TC7, US1-TC8 |
| SC-16 | US1-TC9 |
| SC-17 | US2-TC2 |
| Uncovered | none |
| Contradicted | none |

| Raised | Disposition |
| --- | --- |
| Does the tile rollup and the one-item rule hold on the front door's tiles? | Q10, settled from `grade10-site/store/home`: its row reads a card's status as the listing does and never sells; the Store domain suite's US2-TC2 and US3-TC1 walk it |
| Which price does a tile show for a card priced differently by variant? | Q11, folded: the one item's price, as Grade10 already shows; the rule and SC-12 carry it, and US1-TC6 and US1-TC7 assert it |

**Run:** Update on 2026-10-06, from the acceptance review. Moved the browse add
that keeps a quantity above the shop's count from the listing suite, as rows of
US2-TC1 and US2-TC2 on the tile and the page. Renamed US1-TC7 and US2-TC3 so
`unavailable` is kept for a withdrawn cart line.

**Run:** Implementation update on 2026-09-25. Kept the existing 13 case IDs,
draft statuses and review history. Confirmed the reference implementation
covers availability without browse counts, the one internal sale identity with
no shopper-facing choice, unbounded browse quantity requests, and the zero or
missing-count paths. No case was marked automated; the end-to-end walk decides
that in task 4.2.

**Run:** Blind feature-TCS pass on 2026-09-24. Read the caller-supplied exact Purpose and Feature set for grade10-site/commerce/product-status; openspec/changes/add-store-product-status/proposal.md and decisions.md including Raised; ui-design.md state descriptions without following their scenario references; this change-local user-journeys.md; docs/prds/products/grade10-site/store/index.md, store/product-page.md, store/product-listing.md, commerce/index.md and commerce/product-status.md; openspec/config.yaml context; this change-local suite through its cases; docs/governance/specs-to-test-cases.md; and the current-major approved suite corpus (14 actual cases from shared/auth/sign-out and grade10-site/auction/bid-increments). No durable product-status feature suite existed. Retained all 13 case IDs and draft statuses; bumped behavior versions for US1-TC1, TC2, TC6–TC9 and US2-TC1–TC4.

**Excluded:** Every spec.md file, all requirements and scenarios in openspec/specs/ and openspec/changes/add-store-product-status/specs/, and the archive tree. The Purpose and Feature set came from the caller; no spec file was opened. No scenario reference in ui-design was followed.

**Run:** 2026-10-06, QA1 blind re-run in a fresh context. Read: the capability's Purpose and Feature set, its user-journeys.md, the change's proposal.md, decisions.md with its Raised table, ui-design.md with its Anchor column set aside, the linked PRD pages, openspec/config.yaml's context, this suite above its Reconciliation, its Settled included, and the change's Store domain suite above its Reconciliation. Denied: every Requirements section, the scenarios, tech-design.md, tasks.md, QA2 material and openspec/changes/archive/. One row of this Reconciliation, a case id beside two scenario numbers and no scenario text, was printed by a search.
