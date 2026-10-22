# grade10-site/store Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-22, tcs-rules r6

## Background

**Shared test data:**

| Field | Value |
| --- | --- |
| `grade10 store url` | `<g10url>/store` |
| `store listing url` | `<g10url>/store/collections` |
| `product A` | A booster box for sale at HKD880, no site discount, at least 3 for sale. |
| `product B` | An elite trainer box for sale at HKD420, no site discount, at least 3 for sale. |

## Ungrouped

### g10.store-dmn.US1: Browse from a collection tile

**As a** customer,
**I want** to browse the collection I choose on the Main Page,
**so that** I can open a product from that collection.

<!-- trace:case id=g10.store-dmn.TC-2fr rev=1 -->
#### g10.store-dmn.US1-TC1: A Main Page tile opens its collection, a product, then the whole listing

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
* **Trace:** g10.store-landing.US2, g10.store-product-listing.US5, g10.store-product-page.US1

**Pre-conditions:**

* customer is signed out.
* The shop publishes `<chosen collection>`, holding `<collection product>` and not `<outside product>`.
* Both products are available; `<outside product>` is newer.

**Test data:**

| Field | Value |
| --- | --- |
| `chosen collection` | A published collection with a known name and handle. |
| `collection product` | An available product in `<chosen collection>`, with a known name, handle and price. |
| `outside product` | An available product outside `<chosen collection>`, newer than `<collection product>`. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Click the tile for `<chosen collection>`.
3. Read the listing's name, sort control and cards.
4. Click the name of `<collection product>`.
5. Press Back.
6. Dismiss the collection's name above the grid.

**Expected Results:**

* Step 2 opens `/store/collections?collection=<chosen collection handle>`.
* Step 3 names `<chosen collection>` and the latest product order.
* Step 3 lists `<collection product>` and not `<outside product>`.
* Step 4 opens `/store/products/<collection product handle>`, with its name and price.
* Step 5 returns to the collection listing, at the top.
* Step 6 lists `<outside product>` in the whole catalogue.

---

### g10.store-dmn.US2: Buy as a guest and find the order

**As a** customer,
**I want** to buy a card the Main Page shows without an account, and find the order later,
**so that** I can shop first and keep my purchase in one place after.

<!-- trace:case id=g10.store-dmn.TC-v5l rev=1 -->
#### g10.store-dmn.US2-TC1: A guest buys from the Main Page, then the order joins their account

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-landing.US3, g10.store-product-page.US2, g10.store-cart.US4, g10.store-order-detail.US3, g10.store-order-history.US2

**Pre-conditions:**

* customer(signed out) has an empty cart in this browser.
* `<row product>` is in the Main Page's merchandised row, by the recipe "Put a card in the Main Page's merchandised row".
* No account holds `<order email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `row product` | An available card with a known handle and price. |
| `order email` | A test mailbox no Grade10 account holds. |
| `test card` | The payment provider's published test card that succeeds. |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Click the card for `<row product>`.
3. Click Add to cart.
4. Click Check out as guest in the drawer.
5. Enter `<order email>` on Shopify's page.
6. Pay with `<test card>`.
7. Click Continue on Shopify's thank-you page.
8. Click Sign in on the toast.
9. Sign in by the magic link sent to `<order email>`.
10. Navigate to `/profile/orders`.

**Expected Results:**

* Step 2 opens `/store/products/<row product handle>`.
* Step 3 asks for no sign-in and opens the drawer with `<row product>`.
* Step 7 shows the order, with a receipt line naming `<order email>`.
* Step 9 says the order was added to the account.
* Step 10 lists the order, with no points earned on it.

---

### g10.store-dmn.US3: Compare a price across pages

**As a** customer,
**I want** a card's price to read the same wherever I meet it,
**so that** I trust the price I pay.

<!-- trace:case id=g10.store-dmn.TC-nuz rev=1 -->
#### g10.store-dmn.US3-TC1: A sale or product cut reads the same on every store page

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
* **Trace:** g10.store-landing.US2, g10.store-product-listing.US1, g10.store-product-page.US1, g10.store-cart.US1

**Pre-conditions:**

* `<priced product>` is for sale at HKD880 and in the Main Page's merchandised row.
* The shop holds only `<shop discount>` for it, saved at least 1 minute ago.
* customer has `<priced product>` in the cart.

**Test data:**

| Partition | `<shop discount>` | `<expected price>` | `<expected strike>` |
| --- | --- | --- | --- |
| Sale price | Compare-at HKD1,000. | HKD880 | HKD1,000 |
| Product cut, no minimum | 10% off this product. | HKD792 = HKD880 × 0.9 | HKD880 |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Read the card for `<priced product>` in the merchandised row.
3. Navigate to `<store listing url>`.
4. Read the card for `<priced product>`.
5. Click the card's name.
6. Read the price on the product page.
7. Click Cart in the site header and wait for the read.
8. Read the line for `<priced product>`.

**Expected Results:**

* Steps 2, 4, 6 and 8 each show `<expected price>`.
* Steps 2, 4 and 6 each strike `<expected strike>`.

---

### g10.store-dmn.US4: Meet a sold-out card the same way everywhere

**As a** customer,
**I want** a sold-out card to read sold out on every page and in my cart,
**so that** I never try to pay for something I cannot have.

<!-- trace:case id=g10.store-dmn.TC-mj0 rev=1 -->
#### g10.store-dmn.US4-TC1: A sold-out card reads sold out everywhere and holds checkout

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
* **Trace:** g10.store-landing.US2, g10.store-product-listing.US1, g10.store-product-page.US1, g10.store-cart.US1

**Pre-conditions:**

* customer(signed out) has `<gone product>` in the cart.
* `<gone product>` is in the Main Page's merchandised row, then sold out by the recipe "Sell a card out".

**Test data:**

| Field | Value |
| --- | --- |
| `gone product` | A card with a known handle and price, put in the merchandised row by the recipe "Put a card in the Main Page's merchandised row". |

**Steps:**

1. Navigate to `<grade10 store url>`.
2. Read the card for `<gone product>` in the merchandised row.
3. Navigate to `<store listing url>`.
4. Read the card for `<gone product>`.
5. Navigate to `/store/products/<gone product handle>`.
6. Read the page and its purchase controls.
7. Click Cart in the site header and wait for the read.
8. Read the line for `<gone product>` and the checkout control.

**Expected Results:**

* Steps 2 and 4 say `<gone product>` is sold out.
* Step 6 says it is sold out, shows its price, and cannot add it.
* Step 8 marks its line Sold out, with Proceed to Checkout unavailable.

---

### g10.store-dmn.US5: Buy with a code and points and find the order

**As a** customer,
**I want** the code and points I choose in my cart to reach the order I see after paying,
**so that** I know what I was charged and what I will earn.

<!-- trace:case id=g10.store-dmn.TC-eel rev=1 -->
#### g10.store-dmn.US5-TC1: A member's code and points carry from cart to order page

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-product-listing.US7, g10.store-cart.US2, g10.store-cart.US3, g10.store-cart.US4, g10.store-order-history.US1, g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) holds 600 points and `<member code>`, with an empty cart.
* `<product A>` is for sale at HKD880 with no site discount.

**Test data:**

| Field | Value |
| --- | --- |
| `member code` | A store code for HKD50 off any order, combining with order discounts. |
| `test card` | The payment provider's published test card that succeeds. |

**Steps:**

1. Navigate to `<store listing url>`.
2. Click Add to cart on the card for `<product A>`.
3. Click Cart in the site header and wait for the read.
4. Type `<member code>` in the promo code field and apply it.
5. Type 100 in the points field and click Apply.
6. Read the Estimated Total.
7. Click Proceed to Checkout.
8. Read Shopify's page.
9. Pay with `<test card>`.
10. Click the Grade10 Your Orders link on Shopify's thank-you page.
11. Click View Details on the new order.

**Expected Results:**

* Step 6 shows HKD730 = 880 − 50 − 100.
* Step 8 holds `<member code>` and the 100-point deduction.
* Step 10 lists the order under Active Orders.
* Step 11's summary shows `Points (100 pts)` after Discount.
* Step 11 shows Points to Earn.

---

### g10.store-dmn.US6: Carry a guest cart into a member's checkout

**As a** customer,
**I want** the cart I built before signing in to come with me,
**so that** I do not rebuild it to use my points.

<!-- trace:case id=g10.store-dmn.TC-ssm rev=1 -->
#### g10.store-dmn.US6-TC1: Cards added as a guest merge into the member's cart at sign-in

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
* **Trace:** g10.store-product-listing.US7, g10.store-product-page.US2, g10.store-cart.US4

**Pre-conditions:**

* customer(signed out) has an empty cart in this browser.
* `<member>` holds `<product A>` at quantity 2 in the store-kept cart, and 600 points.

**Test data:**

| Field | Value |
| --- | --- |
| `member` | A member account in the loyalty programme, with a known sign-in. |

**Steps:**

1. Navigate to `<store listing url>`.
2. Click Add to cart on the card for `<product A>`.
3. Navigate to `/store/products/<product B handle>`.
4. Click Add to cart.
5. Click the Sign in link under Check out as guest in the drawer.
6. Sign in as `<member>`.
7. Read the reopened drawer.

**Expected Results:**

* Step 7 shows `<product A>` at quantity 3 = 2 + 1.
* Step 7 shows `<product B>` at quantity 1.
* Step 7 offers points, with the member's codes.
* Step 7 offers Proceed to Checkout.

---

### g10.store-dmn.US7: Open a member's order from its email

**As a** customer,
**I want** my order email's link to bring me to my order in my account,
**so that** I read it with everything else I bought.

<!-- trace:case id=g10.store-dmn.TC-hbl rev=1 -->
#### g10.store-dmn.US7-TC1: A member's order link, opened signed out, leads into Your Orders

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
* **Trace:** g10.store-order-detail.US2, g10.store-order-detail.US1, g10.store-order-history.US1

**Pre-conditions:**

* customer(signed out) holds the View order link for `<member order>`, paid by their member account.

**Steps:**

1. Open the View order button in Shopify's order email for `<member order>`.
2. Read the page.
3. Click Sign in on the toast.
4. Sign in as the member.
5. Read the address bar and the page.
6. Navigate to `/profile/orders`.

**Expected Results:**

* Step 2 shows the order with no points or account details.
* Step 5's address is `/profile/orders/<member order id>`.
* Step 5 shows the order's points section.
* Step 6 lists `<member order>`.
