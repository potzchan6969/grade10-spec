# grade10-site/store/cart-validation Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-cart-validation-US1: Collector opens the cart and learns what moved

**As a** collector,
**I want** the cart to tell me, as it opens, which lines sold out, shrank, left
the store, or changed price,
**so that** I fix my cart before I try to pay rather than being refused at
checkout for something the store already knew.

<!-- trace:case id=g10.store-cart-validation.TC-00a rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC1-1: Lines wait unconfirmed until the open read returns

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a> and 1 of <product_b>, both for sale.
* The store's read of the cart answers 5 seconds late, by network manipulation.

**Steps:**

1. Open the cart drawer.
2. Read the lines, the estimated total and Proceed to Checkout during the delay.
3. Wait for the read to return.
4. Read the lines and Proceed to Checkout.

**Expected Results:**

* Step 2: both lines read unconfirmed, with no availability or price shown as current.
* Step 2: no current estimated total; Proceed to Checkout cannot be pressed.
* Step 4: each line shows the shop's current availability and price.
* Step 4: Proceed to Checkout can be pressed.

<!-- trace:case id=g10.store-cart-validation.TC-eu7 rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC2-1: Shop's live answer, not the browse copy, decides a line

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in.
* The cart holds 1 of <product_a>, added while the shop sold it.
* The shop no longer sells <product_a>.
* The catalogue copy the listing and product page read still answers <product_a> as available.

**Steps:**

1. Navigate to <product_a url>.
2. Read the purchase area.
3. Open the cart drawer.
4. Read <product_a>'s line.

**Expected Results:**

* Step 2: the page still reads available.
* Step 4: the line reads sold out.

<!-- trace:case id=g10.store-cart-validation.TC-jms rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC3-1: Line above the shop's count drops to what remains

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds the row's requested quantity of <product_a>, added while it was tracked at 10.
* Since then, <product_a> is tracked at the row's count in the staging shop's admin, not sold when out of stock.

**Test data:**

| Requested | Count | Line reads |
| --- | --- | --- |
| 3 | 2 | 2 |
| 5 | 2 | 2 |

**Steps:**

1. Open the cart drawer.
2. Read <product_a>'s line.

**Expected Results:**

* Step 2: the line reads the row's quantity, marked adjusted.
* Step 2: the line says the quantity changed to what the shop can fill.

<!-- trace:case id=g10.store-cart-validation.TC-yir rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC4-1: Sold-out line stays until the collector removes it

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 2 of <product_a> and 1 of <product_b>, both added while for sale.
* Since then, <product_a> is sold out by the recipe "Sell a card out".

**Steps:**

1. Open the cart drawer.
2. Read <product_a>'s line and Proceed to Checkout.
3. Click the remove control on <product_a>'s line.
4. Read the cart and Proceed to Checkout.

**Expected Results:**

* Step 2: the line is still in the cart, marked sold out.
* Step 2: Proceed to Checkout cannot be pressed.
* Step 4: <product_a>'s line is gone and <product_b>'s line is unchanged.
* Step 4: Proceed to Checkout can be pressed.

<!-- trace:case id=g10.store-cart-validation.TC-v2q rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC5-1: Reduced line is not grown back when stock returns

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 5 of <product_a>, added while it was tracked at 10.
* The cart holds 2 of <product_b>, tracked at 30.

**Steps:**

1. In the staging shop's admin, set <product_a> to inventory 2, not sold when out of stock.
2. Open the cart drawer.
3. Read <product_a>'s line.
4. Close the cart drawer.
5. In the staging shop's admin, set <product_a> to inventory 40.
6. Open the cart drawer.
7. Read both lines.

**Expected Results:**

* Step 3: <product_a>'s line reads 2, marked adjusted.
* Step 7: <product_a>'s line still reads 2, with no adjusted marking.
* Step 7: <product_b>'s line reads 2, with no marking.

<!-- trace:case id=g10.store-cart-validation.TC-71q rev=2 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC6-2: Withdrawn lines leave the cart under one notice; a sold-out line stays

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 each of <product_c>, <product_d>, <product_e> and <product_f>, all added while for sale.
* Since then, in the staging shop's admin: <product_c> and <product_d> are removed from the store's sales channel; the variant the <product_e> line holds is deleted; <product_f> is sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| <product_c> | A card with one variant |
| <product_d> | Another card with one variant |
| <product_e> | A card with two variants, its line holding the second |
| <product_f> | A card with one variant |

**Steps:**

1. Open the cart drawer.
2. Read the notice.
3. Read the lines left in the cart.

**Expected Results:**

* Step 2: one notice names <product_c>, <product_d> and <product_e>, and does not call them sold out.
* Step 3: no line for <product_c>, <product_d> or <product_e>.
* Step 3: <product_f>'s line is still in the cart, marked sold out, with a remove control.

<!-- trace:case id=g10.store-cart-validation.TC-sr7 rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC7-1: Price that rose or fell is shown and said alike

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>, with no promo code or points on the cart.
* The cart holds 1 of <product_a> and 1 of <product_b>, added at their recorded prices.
* Since then, each price is changed to its current price in the staging shop's admin.

**Test data:**

| Line | Recorded price | Current price |
| --- | --- | --- |
| <product_a> | HKD 105.00 (10500 minor units) | HKD 123.00 (12300 minor units) |
| <product_b> | HKD 123.00 (12300 minor units) | HKD 105.00 (10500 minor units) |
| Estimated total | | HKD 228.00 (22800 minor units) |

**Steps:**

1. Open the cart drawer.
2. Read each line's price and notice.
3. Read the estimated total.

**Expected Results:**

* Step 2: each line shows its current price.
* Step 2: each line says its price changed, the rise in the same way as the fall.
* Step 3: the estimated total is <product_a>'s current price plus <product_b>'s.

<!-- trace:case id=g10.store-cart-validation.TC-9nh rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC8-1: Price change is said once and carries to Shopify

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a>, added at HKD 105.00 (10500 minor units).
* Since then, <product_a>'s price is HKD 123.00 (12300 minor units) in the staging shop's admin.

**Steps:**

1. Open the cart drawer.
2. Read <product_a>'s line.
3. Close the cart drawer.
4. Open the cart drawer.
5. Read <product_a>'s line.
6. Click Proceed to Checkout.
7. Read <product_a>'s price on Shopify's checkout page.

**Expected Results:**

* Step 2: the line shows HKD 123.00 and says the price changed.
* Step 5: the line shows HKD 123.00, with no price-change notice.
* Step 6 opens Shopify's checkout page, with no line named as moved.
* Step 7: HKD 123.00.

<!-- trace:case id=g10.store-cart-validation.TC-hjs rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC9-1: Open read that fails leaves lines unchecked until Retry

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a> and 1 of <product_b>, both for sale.
* The store's read of the cart fails once as the row says, then answers.

**Test data:**

| Row | First read |
| --- | --- |
| Server error | Answers 500 |
| Connection lost | The connection drops before an answer |

**Steps:**

1. Open the cart drawer.
2. Wait for the read to fail.
3. Read the notice, both lines, the estimated total and Proceed to Checkout.
4. Click Retry.
5. Wait for the read to return.
6. Read both lines and Proceed to Checkout.

**Expected Results:**

* Step 3: a notice that stays names <product_a> and <product_b> as unchecked and offers Retry.
* Step 3: no line shows availability or price as current, and the estimated total reads unchecked.
* Step 3: Proceed to Checkout cannot be pressed.
* Step 6: each line shows the shop's current availability and price; Proceed to Checkout can be pressed.

<!-- trace:case id=g10.store-cart-validation.TC-tc5 rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC10-1: Cart that fails before its lines are known names no line

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a>.
* The store's first read of the cart's lines answers 500, then answers.

**Steps:**

1. Open the cart drawer.
2. Wait for the read to fail.
3. Read the drawer, the estimated total and Proceed to Checkout.
4. Click Retry.
5. Wait for the read to return.
6. Read the drawer.

**Expected Results:**

* Step 3: the drawer says the cart could not be checked, offers Retry, and names no line.
* Step 3: no current estimated total; Proceed to Checkout cannot be pressed.
* Step 6: <product_a>'s line shows the shop's current availability and price.

<!-- trace:case id=g10.store-cart-validation.TC-gtc rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC11-1: Lines that moved differently on one open each read their own outcome

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 3 of <product_a>, 1 each of <product_b>, <product_c> and <product_g>, all added while for sale.
* Since then, in the staging shop's admin: <product_a> is tracked at 1, not sold when out of stock; <product_b> is sold out by the recipe "Sell a card out"; <product_c>'s price is changed; <product_g> is unchanged.

**Steps:**

1. Open the cart drawer.
2. Read each line.

**Expected Results:**

* Step 2: <product_a> reads 1, marked adjusted.
* Step 2: <product_b> reads sold out.
* Step 2: <product_c> shows its new price and says the price changed.
* Step 2: <product_g> carries no marking.

<!-- trace:case id=g10.store-cart-validation.TC-o1l rev=1 covers=g10.store-cart-validation.SC-cl3,g10.store-cart-validation.SC-iwp,g10.store-cart-validation.SC-3ei,g10.store-cart-validation.SC-scy,g10.store-cart-validation.SC-3j7,g10.store-cart-validation.SC-cqz,g10.store-cart-validation.SC-hdi,g10.store-cart-validation.SC-c5i,g10.store-cart-validation.SC-gut,g10.store-cart-validation.SC-c5f,g10.store-cart-validation.SC-93m,g10.store-cart-validation.SC-it2,g10.store-cart-validation.SC-tuc,g10.store-cart-validation.SC-bi6,g10.store-cart-validation.SC-rsl,g10.store-cart-validation.SC-cj2,g10.store-cart-validation.SC-q4f -->
### grade10-site-store-cart-validation-US1-TC12-1: Line that shrank and was repriced on one read says both

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
* **Trace:** grade10-site-store-cart-validation-US-01

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>, with no promo code or points on the cart.
* The cart holds 5 of <product_a> at HKD 105.00 (10500 minor units), added while it was tracked at 10.
* Since then, in the staging shop's admin, <product_a> is tracked at 2, not sold when out of stock, and priced HKD 123.00 (12300 minor units).

**Steps:**

1. Open the cart drawer.
2. Read <product_a>'s line.
3. Read the estimated total.

**Expected Results:**

* Step 2: the line reads 2, marked adjusted, and says the quantity changed to what the shop can fill.
* Step 2: the line shows HKD 123.00 and says the price changed.
* Step 3: HKD 246.00 (24600 minor units).

---

## grade10-site-store-cart-validation-US2: Collector offers the cart for checkout

**As a** collector,
**I want** the store to check every line once more as I check out and to name
every line that moved,
**so that** I reach the shop's payment page only with a cart it can fill, and
when I cannot, I know exactly what to fix.

<!-- trace:case id=g10.store-cart-validation.TC-nrx rev=1 covers=g10.store-cart-validation.SC-nv7,g10.store-cart-validation.SC-5dk,g10.store-cart-validation.SC-eqa,g10.store-cart-validation.SC-rpy,g10.store-cart-validation.SC-bl4,g10.store-cart-validation.SC-das,g10.store-cart-validation.SC-6ed -->
### grade10-site-store-cart-validation-US2-TC1-1: Checkout reads every line again, then hands off to Shopify

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
* **Trace:** grade10-site-store-cart-validation-US-02

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a> and 1 of <product_b>, both for sale, each below its count.
* The cart's goods are under HKD 120,000.

**Steps:**

1. Open the cart drawer.
2. Open the browser's network panel.
3. Click Proceed to Checkout.
4. Read the network panel.
5. Read Shopify's checkout page.

**Expected Results:**

* Step 4: a read of both lines goes out after step 3 and before the browser leaves Grade10.
* Step 5: <product_a> and <product_b> at their current prices.

<!-- trace:case id=g10.store-cart-validation.TC-ckp rev=1 covers=g10.store-cart-validation.SC-nv7,g10.store-cart-validation.SC-5dk,g10.store-cart-validation.SC-eqa,g10.store-cart-validation.SC-rpy,g10.store-cart-validation.SC-bl4,g10.store-cart-validation.SC-das,g10.store-cart-validation.SC-6ed -->
### grade10-site-store-cart-validation-US2-TC2-1: Line sold out after the cart opened stops the handoff, named

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
* **Trace:** grade10-site-store-cart-validation-US-02

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 each of <product_a>, <product_b> and <product_c>, all for sale.

**Steps:**

1. Open the cart drawer.
2. In the staging shop's admin, set every variant of <product_b> to inventory 0, not sold when out of stock.
3. In the still-open drawer, click Proceed to Checkout.
4. Read the drawer.

**Expected Results:**

* Step 1: all three lines read current, with no marking.
* Step 3 leaves the browser on Grade10.
* Step 4: <product_b> is named sold out.
* Step 4: <product_a> and <product_c> are unchanged.

<!-- trace:case id=g10.store-cart-validation.TC-pwd rev=1 covers=g10.store-cart-validation.SC-nv7,g10.store-cart-validation.SC-5dk,g10.store-cart-validation.SC-eqa,g10.store-cart-validation.SC-rpy,g10.store-cart-validation.SC-bl4,g10.store-cart-validation.SC-das,g10.store-cart-validation.SC-6ed -->
### grade10-site-store-cart-validation-US2-TC3-1: Every line that moved at checkout is named together

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
* **Trace:** grade10-site-store-cart-validation-US-02

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 3 of <product_a>, 1 each of <product_b>, <product_c>, <product_d> and <product_g>, all for sale.

**Steps:**

1. Open the cart drawer.
2. In the staging shop's admin, set <product_a> to inventory 1, not sold when out of stock.
3. In the staging shop's admin, set every variant of <product_b> to inventory 0, not sold when out of stock.
4. In the staging shop's admin, change <product_c>'s price.
5. In the staging shop's admin, remove <product_d> from the store's sales channel.
6. In the still-open drawer, click Proceed to Checkout.
7. Read the drawer.

**Expected Results:**

* Step 6 leaves the browser on Grade10.
* Step 7: <product_a> is named adjusted, <product_b> sold out, <product_c> repriced and <product_d> unavailable, all at once.
* Step 7: <product_d>'s line has left the cart, and the removal notice names it.
* Step 7: <product_g> is not named.

<!-- trace:case id=g10.store-cart-validation.TC-emi rev=1 covers=none -->
### grade10-site-store-cart-validation-US2-TC4-1: Open-time read does not carry a later checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-validation-US-02

**Pre-conditions:**
The cart is open with every line confirmed by the open-time read; the shop
then sets one variant's inventory to 0 and stops selling it when out of
stock, and the cart is not reopened.

**Steps:**

1. Click the checkout button in the cart.
2. Check the cart.

**Expected Results:**

* No checkout order is created.
* That line is identified as out of stock.

<!-- trace:case id=g10.store-cart-validation.TC-1qb rev=1 covers=g10.store-cart-validation.SC-nv7,g10.store-cart-validation.SC-5dk,g10.store-cart-validation.SC-eqa,g10.store-cart-validation.SC-rpy,g10.store-cart-validation.SC-bl4,g10.store-cart-validation.SC-das,g10.store-cart-validation.SC-6ed -->
### grade10-site-store-cart-validation-US2-TC5-1: Price the browser supplies decides nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-validation-US-02

**Pre-conditions:**

* customer(member) is signed in.
* The cart holds 1 of <product_a>, priced <shop price> in the staging shop's admin.

**Test data:**

| Field | Value |
| --- | --- |
| <supplied price> | HKD 1.00 (100 minor units) |
| <shop price> | HKD 123.00 (12300 minor units) |

**Steps:**

1. Send the store's checkout request for the cart with <product_a>'s price set to <supplied price>.
2. Read the API response.
3. Open the checkout address the response names.

**Expected Results:**

* Step 3: Shopify's checkout page prices <product_a> at <shop price>.
* <supplied price> appears nowhere on the checkout.

<!-- trace:case id=g10.store-cart-validation.TC-cxb rev=1 covers=g10.store-cart-validation.SC-nv7,g10.store-cart-validation.SC-5dk,g10.store-cart-validation.SC-eqa,g10.store-cart-validation.SC-rpy,g10.store-cart-validation.SC-bl4,g10.store-cart-validation.SC-das,g10.store-cart-validation.SC-6ed -->
### grade10-site-store-cart-validation-US2-TC6-1: Line repriced at checkout is named, then goes at the new price

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
* **Trace:** grade10-site-store-cart-validation-US-02

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a> at HKD 105.00 (10500 minor units) and 1 of <product_b>, both for sale.

**Steps:**

1. Open the cart drawer.
2. In the staging shop's admin, change <product_a>'s price to HKD 123.00 (12300 minor units).
3. In the still-open drawer, click Proceed to Checkout.
4. Read the drawer.
5. Click Proceed to Checkout.
6. Read Shopify's checkout page.

**Expected Results:**

* Step 3 leaves the browser on Grade10.
* Step 4: <product_a> is named repriced, at HKD 123.00.
* Step 5 opens Shopify's checkout page without the lines being added again.
* Step 6: <product_a> at HKD 123.00 and <product_b> at its current price.

---

## grade10-site-store-cart-validation-US3: Collector meets the shop's own refusal

**As a** collector,
**I want** a refusal from the shop, or a check the store could not finish, told
to me with the line named,
**so that** a cart that passed the store's read and still failed is mine to
resolve, not a dead end.

<!-- trace:case id=g10.store-cart-validation.TC-70d rev=1 covers=g10.store-cart-validation.SC-wfj,g10.store-cart-validation.SC-14e,g10.store-cart-validation.SC-3zl -->
### grade10-site-store-cart-validation-US3-TC1-1: Shop refuses a line the store's read passed; the cart stays fixable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-validation-US-03

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a> and 1 of <product_b>, both for sale.
* The shop's checkout is mocked to refuse <product_a> as no longer for sale, after the store's read passes.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the drawer.
4. Click the remove control on <product_a>'s line.
5. Click Proceed to Checkout.

**Expected Results:**

* Step 2 leaves the browser on Grade10.
* Step 3: the message names <product_a>, and is neither a generic failure nor the collector's fault.
* Step 3: <product_b>'s line is unchanged.
* Step 5 opens Shopify's checkout page with <product_b> only.

<!-- trace:case id=g10.store-cart-validation.TC-44h rev=1 covers=g10.store-cart-validation.SC-wfj,g10.store-cart-validation.SC-14e,g10.store-cart-validation.SC-3zl -->
### grade10-site-store-cart-validation-US3-TC2-1: Cart the shop would fill short is refused, not sold short

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-validation-US-03

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 3 of <product_a>, for sale.
* The shop's checkout is mocked to accept only 2 of <product_a>, after the store's read passes.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the drawer.

**Expected Results:**

* Step 2 leaves the browser on Grade10, and no checkout for 2 opens.
* Step 3: the message names <product_a> and says the shop would fill 2.

<!-- trace:case id=g10.store-cart-validation.TC-87k rev=2 covers=g10.store-cart-validation.SC-wfj,g10.store-cart-validation.SC-14e,g10.store-cart-validation.SC-3zl -->
### grade10-site-store-cart-validation-US3-TC3-2: Checkout read that cannot finish blocks the handoff until Retry

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
* **Trace:** grade10-site-store-cart-validation-US-03

**Pre-conditions:**

* customer(member) is signed in and is on <grade10 store url>.
* The cart holds 1 of <product_a> and 1 of <product_b>, both for sale.
* The store's checkout read fails once as the row says, then answers.

**Test data:**

| Row | Checkout read |
| --- | --- |
| Server error | Answers 500 |
| Connection lost | The connection drops before an answer |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the message, both lines, the estimated total and Proceed to Checkout.
4. Click Retry.
5. Wait for the read to return.
6. Read both lines and Proceed to Checkout.

**Expected Results:**

* Step 2 leaves the browser on Grade10.
* Step 3: a message that stays names <product_a> and <product_b> as unchecked and offers Retry.
* Step 3: no line shows availability or price as current, the estimated total reads unchecked, and Proceed to Checkout cannot be pressed.
* Step 6: each line shows the shop's current availability and price; Proceed to Checkout can be pressed.

## Settled

- A line that shrank and was repriced on one read is told both: the reduced quantity and the price change.
- Proceed to Checkout stays unavailable while a sold-out line stays in the cart; a withdrawn line never stays.
- A withdrawn line the checkout read finds is named unavailable and leaves the cart under the removal notice, as on open.
- This capability states what a read does to a moved line; `grade10-site/store/checkout` applies the same rule at the handoff.

## Reconciliation

**Run:** QA2 on 2026-10-06, rerun in a fresh context after the rebase. Read
the anchors, these cases, the Dev scenarios at their current revisions,
`tech-design.md`, `ui-design.md`, `tasks.md`, `decisions.md`, the Cart
Validation page, the Store domain suite and Grade10's `CartDrawerHost`. Every
live case folds against SC-09 and SC-10 at rev 2 and the one failed-read rule
under **In flight**; no scenario is uncovered or contradicted. US1-TC1-1's
pending total matches Grade10, which shows the summary loading until the read
returns. SC-15 and SC-17 are also walked end to end by the Store domain
suite's US7-TC1-1, so no feature case repeats the remove-and-pay path. The
Settled line on a sold-out line holding checkout no longer says a withdrawn
line can stay. Nothing new was raised.

**Run:** Update on 2026-10-06, from the second acceptance review, after the
change was rebased on main. Each case keeps the `trace:case` id main or the
durable suite gave its number, its `rev` follows its heading, and its
`covers` names every scenario serving its journeys; a deprecated case covers
none. US1-TC11 and US1-TC12 take new ids, and SC-24 to SC-27 their scenario markers.
SC-09 and SC-10 moved to rev 2 for a withdrawn line leaving the cart. The
failed-read rule now sits once, under **In flight**, with Retry; no case
changed. QA2 reruns on this suite.

**Run:** QA2 on 2026-10-06, in a fresh context. Read the anchors, these cases,
the Dev scenarios, `tech-design.md`, `ui-design.md`, `tasks.md`,
`decisions.md`, the Cart Validation, Cart Drawer, Checkout and Product Status
pages, the store's checkout spec and journeys, and the Grade10 source the tech
design cites. Every live case folds. QA1's four questions on this capability
land as Q12 to Q15: Q13 and Q14 add SC-26 and SC-27, and QA2 adds US1-TC12 for
SC-24, which no case reached.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `grade10-site-store-cart-validation-US1-TC1-1` | Folded | SC-01, SC-03 |
| `grade10-site-store-cart-validation-US1-TC2-1` | Folded | SC-04 |
| `grade10-site-store-cart-validation-US1-TC3-1` | Folded | SC-05 |
| `grade10-site-store-cart-validation-US1-TC4-1` | Folded; steps 2 and 4 read Proceed to Checkout (Q13) | SC-06, SC-26 |
| `grade10-site-store-cart-validation-US1-TC5-1` | Folded | SC-07, SC-08 |
| `grade10-site-store-cart-validation-US1-TC6-2` | Folded | SC-09, SC-10, SC-25 |
| `grade10-site-store-cart-validation-US1-TC7-1` | Folded | SC-11, SC-12 |
| `grade10-site-store-cart-validation-US1-TC8-1` | Folded | SC-13 |
| `grade10-site-store-cart-validation-US1-TC9-1` | Folded | SC-22 |
| `grade10-site-store-cart-validation-US1-TC10-1` | Folded; the drawer's look for it is the designer's, Q9 | SC-23 |
| `grade10-site-store-cart-validation-US1-TC11-1` | Folded | SC-05, SC-06, SC-08, SC-11 |
| `grade10-site-store-cart-validation-US1-TC12-1` | Added by QA2 for QA1's question on a line that shrank and was repriced (Q12) | SC-24 |
| `grade10-site-store-cart-validation-US2-TC1-1` | Folded | SC-02 |
| `grade10-site-store-cart-validation-US2-TC2-1` | Folded | SC-15, SC-18 |
| `grade10-site-store-cart-validation-US2-TC3-1` | Folded; step 7 asserts the withdrawn line leaves the cart (Q14) | SC-16, SC-27 |
| `grade10-site-store-cart-validation-US2-TC4-1` | Deprecated: US2-TC2-1 walks the same open-then-checkout path | SC-18 |
| `grade10-site-store-cart-validation-US2-TC5-1` | Folded | SC-14 |
| `grade10-site-store-cart-validation-US2-TC6-1` | Folded | SC-13, SC-17 |
| `grade10-site-store-cart-validation-US3-TC1-1` | Folded | SC-17, SC-19 |
| `grade10-site-store-cart-validation-US3-TC2-1` | Folded | SC-20 |
| `grade10-site-store-cart-validation-US3-TC3-2` | Folded | SC-21 |

| Scenario | Cases |
| --- | --- |
| SC-01, SC-03 | US1-TC1 |
| SC-02 | US2-TC1 |
| SC-04 | US1-TC2 |
| SC-05 | US1-TC3, US1-TC11 |
| SC-06 | US1-TC4, US1-TC11 |
| SC-07, SC-08 | US1-TC5 |
| SC-09, SC-10, SC-25 | US1-TC6 |
| SC-11, SC-12 | US1-TC7 |
| SC-13 | US1-TC8, US2-TC6 |
| SC-14 | US2-TC5 |
| SC-15, SC-18 | US2-TC2 |
| SC-16 | US2-TC3 |
| SC-17 | US2-TC6, US3-TC1 |
| SC-19 | US3-TC1 |
| SC-20 | US3-TC2 |
| SC-21 | US3-TC3 |
| SC-22 | US1-TC9 |
| SC-23 | US1-TC10 |
| SC-24 | US1-TC12 |
| SC-26 | US1-TC4 |
| SC-27 | US2-TC3 |
| Uncovered | none |
| Contradicted | none |

| Raised | Disposition |
| --- | --- |
| Is a line that both shrank and changed price on one read told both? | Q12, settled by SC-24: both are told; US1-TC12 asserts it |
| Can Proceed to Checkout be pressed while a sold-out line stays? | Q13, folded: no, as Grade10 already does; the out-of-stock rule and SC-26 carry it, and US1-TC4 asserts it |
| Does the checkout read take a withdrawn line out of the cart? | Q14, folded: it is named unavailable and leaves under the removal notice; the withdrawn rule and SC-27 carry it, and US2-TC3 asserts it |
| Which capability names a line that moved at checkout? | Q15, settled: this one states the rule; `grade10-site/store/checkout`'s US-02 is the same moment at the handoff, and the Store domain suite's US7-TC1 walks both |

**Run:** Update on 2026-10-06, from the acceptance review. US1-TC6 now has the
withdrawn lines leave the cart and one notice name them, and US3-TC3 walks the
failed checkout read in the cart drawer, which is where checkout starts.

**Run:** Implementation update on 2026-09-25. Kept the existing case IDs,
draft statuses and review history. No case was marked automated; the end-to-end
walk decides that.

**Run:** 2026-09-18 · the blind suite and the change's scenario reading were
reconciled after the two read moments were settled.
