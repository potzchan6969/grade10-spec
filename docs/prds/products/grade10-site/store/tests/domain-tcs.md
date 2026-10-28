---
title: Store Test Cases
---

# grade10-site/store Test Cases

**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/home, grade10-site/store/product-listing, grade10-site/store/product-page, grade10-site/store/cart-drawer, grade10-site/store/checkout, grade10-site/store/order-detail, grade10-site/store/order-history

## Background

**Shared test data:**

| Field | Value |
| --- | --- |
| `<store url>` | `<g10url>/store` |
| `<listing url>` | `<g10url>/store/collections` |
| `<product A>` | a booster box for sale at HKD880, no site discount, at least 3 for sale |
| `<product B>` | an elite trainer box for sale at HKD420, no site discount, at least 3 for sale |

## Ungrouped

### home: Main Page

<!-- trace:case id=g10.store-dmn.TC-2fr rev=1 -->
#### g10.store-dmn.TC1: A Main Page tile opens its collection, then a product, then the whole listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home, product-listing, product-page

**Pre-conditions:**

* customer(guest) has no Grade10 session.
* The shop publishes `<chosen collection>`, holding `<collection product>` and not `<outside product>`, which is newer; both are for sale.

**Steps:**

1. Open `<store url>` and select `<chosen collection>`'s tile.
2. Select `<collection product>`'s name, then go back.
3. Dismiss `<chosen collection>`'s name above the grid.

**Expected Results:**

* Step 1 opens `/store/collections?collection=<chosen collection handle>`, named for it, ordered by latest product, listing `<collection product>` and not `<outside product>`.
* Step 2 opens `/store/products/<collection product handle>` with its name and price, then returns to the collection listing at the top.
* Step 3 lists `<outside product>` in the whole catalogue, and the address names no collection.

<!-- trace:case id=g10.store-dmn.TC-v5l rev=1 -->
#### g10.store-dmn.TC2: A guest buys from the Main Page, and the order joins the account that proves its email

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home, product-page#buy, cart#checkout/guest, order-detail#back-from-checkout/added, order-detail#back-from-checkout/order-confirmed, order-detail#back-from-checkout/create-an-account, checkout#guest-checkout/joining-an-account, checkout#guest-checkout/post-checkout-account, checkout#guest-checkout/no-points

**Pre-conditions:**

* customer(guest) has an empty cart in this browser; `<row product>` is in the merchandised row, by the recipe "Put a card in the Main Page's merchandised row"; no account holds `<order email>`, a test mailbox.

**Steps:**

1. Open `<store url>`, select `<row product>`'s card, then Add to cart.
2. Select Check out as guest, enter `<order email>` on Shopify's page, and pay with the payment provider's published test card that succeeds.
3. Select Continue on Shopify's thank-you page.
4. Select Sign in on the toast and sign in by the link sent to `<order email>`.
5. Open `/profile/orders`.

**Expected Results:**

* Step 1 opens `/store/products/<row product handle>`, then the drawer with `<row product>`, asking for no sign-in.
* Step 3 shows the order, with a receipt line naming `<order email>`.
* Step 4 says the order was added to the account.
* Step 5 lists the order, with no points earned on it.

<!-- trace:case id=g10.store-dmn.TC-nuz rev=1 -->
#### g10.store-dmn.TC3: A sale or a product cut reads the same on every store page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home, product-listing, product-page, cart#reviewing-the-cart/current-read

**Pre-conditions:**

* `<priced product>` is for sale at HKD880, in the merchandised row and in the cart; the shop holds only the row's discount for it, saved at least a minute ago.

**Test data:**

| Discount | Price | Struck |
| --- | --- | --- |
| compare-at HKD1,000 | HKD880 | HKD1,000 |
| 10% off this product | HKD792 = HKD880 × 0.9 | HKD880 |

**Steps:**

1. Read `<priced product>`'s card on `<store url>`, then on `<listing url>`.
2. Select its name and read the price.
3. Open Cart, wait for the read, and read its line.

**Expected Results:**

* Each shows the row's price; the two cards and the product page strike the row's struck price.

<!-- trace:case id=g10.store-dmn.TC-mj0 rev=1 -->
#### g10.store-dmn.TC4: A sold-out card reads sold out on every page and holds checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home, product-listing, product-page, cart#reviewing-the-cart/lines-whose-product-left-the-shop, cart#reviewing-the-cart/current-read

**Pre-conditions:**

* customer(guest) has `<gone product>` in the cart; it was put in the merchandised row, by the recipe "Put a card in the Main Page's merchandised row", then sold out, by the recipe "Sell a card out".

**Steps:**

1. Read `<gone product>`'s card on `<store url>`, then on `<listing url>`.
2. Open `/store/products/<gone product handle>` and read the page and its purchase controls.
3. Open Cart, wait for the read, and read its line and the checkout control.

**Expected Results:**

* Step 1: both cards say sold out.
* Step 2 says sold out, shows its price, and cannot add it.
* Step 3 marks the line Sold out, with Proceed to Checkout unavailable.

---

### product-listing#products-display: Products Display

<!-- trace:case id=g10.store-dmn.TC-eel rev=1 -->
#### g10.store-dmn.TC5: A member's code and points carry from the cart to the order page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#products-display/cart-button, cart#promo-code/picked, cart#points/applied, cart#checkout/sent, cart#checkout/created-from-the-drawer, order-history#orders, order-detail#order

**Pre-conditions:**

* customer(member) holds 600 points and `<member code>`, HKD50 off any order, combining with order discounts, with an empty cart; `<product A>` is for sale at HKD880, no site discount.

**Steps:**

1. On `<listing url>`, select Add to cart on `<product A>`'s card.
2. Open Cart, wait for the read, apply `<member code>`, then type 100 in the points field and Apply.
3. Select Proceed to Checkout, read Shopify's page, and pay with the published test card that succeeds.
4. Select the Grade10 Your Orders link on the thank-you page, then View Details on the new order.

**Expected Results:**

* Step 2's Estimated Total is HKD730 = 880 − 50 − 100.
* Step 3's page holds `<member code>` and the 100-point deduction.
* Step 4 lists the order under Active Orders, and its summary shows `Points (100 pts)` after Discount, and Points to Earn.

<!-- trace:case id=g10.store-dmn.TC-ssm rev=1 -->
#### g10.store-dmn.TC6: Cards added as a guest come into the member's cart at sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** product-listing#products-display/signed-out, product-page#buy, cart#checkout/guest

**Pre-conditions:**

* customer(guest) has an empty cart in this browser; `<member>`, in the loyalty programme with points, holds `<product A>` at 2 in the store-kept cart.

**Steps:**

1. On `<listing url>`, select Add to cart on `<product A>`'s card.
2. Open `/store/products/<product B handle>` and select Add to cart.
3. Select the Sign in link under Check out as guest, and sign in as `<member>`.

**Expected Results:**

* The drawer reopens with `<product B>` at 1, points and the member's codes offered, and Proceed to Checkout.
* ❓ `<product A>` reads 3 = 2 + 1, on one line - product confirms how a product in both carts combines.

---

### order-detail#order-link: Order Link

<!-- trace:case id=g10.store-dmn.TC-hbl rev=1 -->
#### g10.store-dmn.TC7: A member's order link, opened signed out, leads into Your Orders

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/owner-signed-in, order-detail#order-link/signed-out, order-detail#order-link/no-account-facts, order-detail#order, order-history#orders

**Pre-conditions:**

* customer(member) is signed out, holding the View order link for `<member order>`, which they paid for.

**Steps:**

1. Open View order in Shopify's order email.
2. Select Sign in on the toast and sign in as the member.
3. Open `/profile/orders`.

**Expected Results:**

* Step 1 shows the order with no points or account details.
* Step 2 opens `/profile/orders/<member order id>`, with the order's points section.
* Step 3 lists `<member order>`.
