---
title: Store Cart Test Cases
---

# grade10-site/store/cart Test Cases

**Status:** pending-review · 0/47
**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/cart-drawer, grade10-site/store/checkout, grade10-site/store/discounts

## Background

**Shared test data:**

| Field | Value |
| --- | --- |
| `<listing url>` | `<g10url>/store/collections` |
| `<product A>` | a booster box for sale at HKD880, no site discount, at least 3 for sale |
| `<product B>` | an elite trainer box for sale at HKD420, no site discount, at least 3 for sale |
| `<product C>` | booster packs for sale at HKD60, no site discount |
| `<product D>` | sleeves for sale at HKD210, no site discount |
| `<member code>` | a store code minted to the member: HKD50 off any order, combining with order discounts |
| `<public code>` | a public Shopify code, tagged `public`: HKD20 off the order |
| `<spend code>` | a code: HKD200 off, spend HKD1,000 or more |

## Walk 1: A member's code and points to checkout

**Starting state:**

- customer(signed-in member) on `<listing url>`, in the loyalty programme with 600 points; the cart holds `<product A>` and `<product B>`, no code or points chosen; the wallet holds `<member code>`, unused; the shop has `<public code>`

### Route

1. Select Cart in the site header and wait for the read.
   - The drawer over the page, with current lines `g10.store-cart.TC1`
2. Open the code list.
   - The member's codes beside the public one, in order `g10.store-cart.TC21`
3. Pick `<member code>`.
   - The code's row, and the total at once `g10.store-cart.TC19`
4. Select Use max on points.
   - A Points row at the ceiling `g10.store-cart.TC30`
5. Reload and open Cart again.
   - The code and the points still chosen `g10.store-cart.TC31`
6. Select Proceed to Checkout.
   - Shopify's page with the same code and points `g10.store-cart.TC34`

## cart#reviewing-the-cart: Reviewing the Cart

<!-- trace:case id=g10.store-cart-checkout.TC-q5a rev=1 -->
### g10.store-cart.TC1: The cart opens over the page and waits for the shop's read

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer is on the row's page, with `<product A>` in the cart.

**Test data:**

| Page |
| --- |
| `<listing url>` |
| the auction listings page |

**Steps:**

1. Select Cart in the site header.
2. Read the drawer while its read is pending, then once it finishes.

**Expected Results:**

* Step 1 opens the drawer over the row's page.
* While pending, the lines, totals and checkout wait; then `<product A>` at the shop's current price, with Subtotal, Shipping as calculated at checkout, and Estimated Total.

---

## cart#promo-code: Promo Code

<!-- trace:case id=g10.store-cart-checkout.TC-bzv rev=2 -->
### g10.store-cart.TC19: A code the store knows takes its cut off the total

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer, as the row says, has `<product A>` and `<product B>` in the cart, HKD1,300, no code chosen.

**Test data:**

| Customer | Code | Footer |
| --- | --- | --- |
| signed-in member | `<member code>` | `Discount (<member code>)` −HKD50; total HKD1,250 = 1,300 − 50 |
| signed out | `<public code>` | `Discount (<public code>)` −HKD20; total HKD1,280 = 1,300 − 20 |

**Steps:**

1. Open Cart, wait for the read, type the row's code and apply it.

**Expected Results:**

* The row's discount row and total.

<!-- trace:case id=g10.store-cart-checkout.TC-t4a rev=1 -->
### g10.store-cart.TC21: The code list shows what fits first, soonest to expire first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer, as the row says, has a HKD1,300 cart; the member holds `<code 1>` (fits, expires later) and `<code 2>` (fits, expires sooner); the shop has `<public code>` (fits, expires latest) and `<spend code>`, set to spend HKD5,000 or more.

**Test data:**

| Customer | List |
| --- | --- |
| signed-in member | `<code 2>`, `<code 1>`, `<public code>`; then `<spend code>` apart, with its reason |
| signed out | `<public code>`; then `<spend code>` apart, with its reason; no member code |

**Steps:**

1. Open Cart, wait for the read, open the code list and read it in order.
2. Pick the first code that fits.

**Expected Results:**

* Step 1: the row's list.
* Step 2 applies it as a typed one applies.

---

## cart#points: Points

<!-- trace:case id=g10.store-cart-checkout.TC-4o0 rev=1 -->
### g10.store-cart.TC30: Points apply after the code, trimmed to what the cart can take

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#points

**Pre-conditions:**

* customer(signed-in member) holds the row's balance, with `<product A>` and `<product B>` in the cart and `<member code>` applied, HKD50 off.

**Test data:**

| Balance | Action | Points | Estimated Total |
| --- | --- | --- | --- |
| 600 | Use max | −HKD600 | HKD650 = 1,300 − 50 − 600 |
| 2,000 | type 2,000 and Apply | −HKD1,250, trimmed to what the code leaves | HKD0 = 1,300 − 50 − 1,250 |
| 600 | type 100 and Apply | −HKD100 | HKD1,150 = 1,300 − 50 − 100 |

**Steps:**

1. Open Cart, wait for the read, and read the points field.
2. Do the row's action and read the footer.
3. Remove the points.

**Expected Results:**

* Step 1: the balance, the rate and the most this cart takes.
* Step 2: a Points row of the row's points, below the code's, and the row's total.
* Step 3: no Points row, the code still applied.

<!-- trace:case id=g10.store-cart-checkout.TC-34g rev=1 -->
### g10.store-cart.TC31: The chosen code and points survive a reload and another device

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#points

**Pre-conditions:**

* customer(signed-in member) has `<member code>` and 100 points chosen on the cart.

**Steps:**

1. Reload, open Cart and read the footer.
2. Sign in as the same member in another browser, open Cart and read the footer.

**Expected Results:**

* Both show `<member code>` and 100 points chosen, with totals read again, not held.

---

## cart#checkout: Checkout

<!-- trace:case id=g10.store-cart-checkout.TC-md9 rev=1 -->
### g10.store-cart.TC34: Proceed to Checkout sends the lines, the code and the points to Shopify

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#checkout

**Pre-conditions:**

* customer(signed-in member) has `<product A>`, `<member code>` and 100 points on a current cart.

**Steps:**

1. Select Proceed to Checkout and read Shopify's page.
2. Return to the store without paying, and open Cart.

**Expected Results:**

* Step 1 opens under `checkout.grade10.com`, listing `<product A>`, `<member code>` and the 100-point deduction, and adds shipping.
* Step 2 still holds `<product A>`, the code and the points.

---

## Ungrouped

### cart#reviewing-the-cart: Reviewing the Cart

<!-- trace:case id=g10.store-cart-checkout.TC-wf5 rev=1 -->
#### g10.store-cart.TC2: The drawer stays closable while it waits, and takes no other action

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer has `<product A>` in the cart; the row's operation is held pending.

**Test data:**

| Operation | Closed by |
| --- | --- |
| the read on open | the close button |
| a quantity change | a click on the backdrop |
| Proceed to Checkout | Escape |

**Steps:**

1. Open Cart and start the row's operation.
2. Try to change a quantity, a code, the points and a product link.
3. Close the drawer the row's way.

**Expected Results:**

* Step 2 changes nothing.
* Step 3 closes the drawer.

<!-- trace:case id=g10.store-cart-checkout.TC-1mg rev=1 -->
#### g10.store-cart.TC3: Changing a quantity or removing a line changes the cart and its total

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer has `<product A>` at 2 and `<product B>` at 1 in the cart; the shop has at least 3 of each.

**Test data:**

| Edit | Subtotal |
| --- | --- |
| increase `<product A>` to 3 | HKD3,060 = 880 × 3 + 420 |
| decrease `<product A>` to 1 | HKD1,300 = 880 + 420 |
| remove `<product B>` | HKD1,760 = 880 × 2 |
| remove both lines | none; the drawer shows an empty cart |

**Steps:**

1. Open Cart, wait for the read, and do the row's edit.
2. Close the drawer, reload, and open Cart again.

**Expected Results:**

* Step 1: the row's subtotal.
* Step 2: the same lines as step 1.

<!-- trace:case id=g10.store-cart-checkout.TC-gcg rev=1 -->
#### g10.store-cart.TC4: Each line shows the product's current first picture

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* `<product A>` is in the cart; admin has since changed its first image in the shop's admin, and a minute has passed.

**Steps:**

1. Open Cart, wait for the read, and read `<product A>`'s line.

**Expected Results:**

* The new first image.

<!-- trace:case id=g10.store-cart-checkout.TC-c56 rev=2 -->
#### g10.store-cart.TC5: A shop answer within 2.5 seconds brings the site discount into the total

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* The cart holds `<product A>` × 2, HKD1,760; the shop has the order discount Spend HKD1,000, save HKD100, and answers within 2.5 seconds.

**Steps:**

1. Open Cart and wait 3 seconds past the store's read.

**Expected Results:**

* `Discount (Spend HKD1,000, save HKD100)` −HKD100, and Estimated Total HKD1,660.

#### g10.store-cart.TC6: Past 2.5 seconds without the shop, the total is the store's own figure

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* The cart holds `<product A>` × 2, HKD1,760; the shop has the order discount Spend HKD1,000, save HKD100; its price answer comes as the row says.

**Test data:**

| Shop's answer |
| --- |
| after 2.5 seconds |
| never |

**Steps:**

1. Open Cart and wait 3 seconds past the store's read.

**Expected Results:**

* No site discount row; Estimated Total HKD1,760.

<!-- trace:case id=g10.store-cart-checkout.TC-g2h rev=2 -->
#### g10.store-cart.TC7: A member's open drawer closes when the session ends elsewhere

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed-in member) has the drawer open, its read finished, in tab 1.

**Test data:**

| Session ends by |
| --- |
| signing out in tab 2 |
| expiring |

**Steps:**

1. End the session the row's way, then return to tab 1.
2. Sign in again in tab 1.

**Expected Results:**

* Step 1: the drawer is closed, with no message.
* Step 2 does not reopen it.

#### g10.store-cart.TC8: A guest's open drawer stays open when another tab signs in and out

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed out) has the drawer open, its read finished, in tab 1.

**Steps:**

1. Sign in and out in tab 2, then return to tab 1.

**Expected Results:**

* The drawer is still open.

<!-- trace:case id=g10.store-cart-checkout.TC-wkm rev=2 -->
#### g10.store-cart.TC9: A member's cart is kept at the store and follows them to another browser

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed-in member) has `<product A>` in the cart in browser 1.

**Steps:**

1. Reload browser 1 and open Cart.
2. Sign in as the same member in browser 2 and open Cart.

**Expected Results:**

* Both show `<product A>`.

#### g10.store-cart.TC10: A guest's cart is kept in this browser only

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed out) has `<product A>` in the cart in browser 1.

**Steps:**

1. Reload browser 1 and open Cart.
2. Open Cart in browser 2, signed out.

**Expected Results:**

* Step 1 shows `<product A>`; step 2 an empty cart.

<!-- trace:case id=g10.store-product-listing.TC-4ry rev=1 -->
#### g10.store-cart.TC11: A line the shop repriced or fills short shows the shop's answer on open

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed out) has `<moved product>` in the cart, at 2 and HKD880; admin has since changed it as the row says, and a minute has passed.

**Test data:**

| Shop's change | Line |
| --- | --- |
| 1 left for sale | quantity 1, saying the store changed it |
| 5 for sale | quantity 2; it never grows |
| repriced to HKD950 | HKD950, saying the price changed |
| repriced to HKD800 | HKD800, saying the price changed |

**Steps:**

1. Open Cart, wait for the read, and read `<moved product>`'s line.

**Expected Results:**

* The row's line, and a total that follows its quantity times its price.

<!-- trace:case id=g10.store-product-listing.TC-4ba rev=1 -->
#### g10.store-cart.TC12: A sold-out line holds checkout until it is removed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed out) has `<sold-out product>` and `<product A>` in the cart; `<sold-out product>` has since sold out, by the recipe "Sell a card out", its variant still listed.

**Steps:**

1. Open Cart, wait for the read, and read the lines and the checkout control.
2. Remove `<sold-out product>`.

**Expected Results:**

* Step 1: `<sold-out product>` marked Sold out, and Proceed to Checkout unavailable.
* Step 2: Proceed to Checkout available.

<!-- trace:case id=g10.store-product-listing.TC-2fl rev=1 -->
#### g10.store-cart.TC13: Lines whose product left the shop leave the cart, with one notice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed out) has the row's lines and `<product A>` in the cart; admin has taken the row's lines away, and a minute has passed.

**Test data:**

| Taken away |
| --- |
| `<product B>`, unpublished from the store's channel |
| `<product B>` unpublished, and `<product C>`'s variant deleted |

**Steps:**

1. Open Cart, wait for the read, and read the lines and the notice.

**Expected Results:**

* No line of the row's is listed; one notice names them all; the remaining line stays.

<!-- trace:case id=g10.store-product-listing.TC-j18 rev=1 -->
#### g10.store-cart.TC14: A read that cannot finish shows unchecked lines and Retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer(signed out) has `<product A>` in the cart; the cart read fails as the row says, and the read after Retry answers.

**Test data:**

| Failure | Drawer |
| --- | --- |
| the lines load, the shop's check fails | every line unchecked; no price, availability or total |
| the cart itself cannot be read | no line named; never says the cart is empty |

**Steps:**

1. Open Cart and read the drawer.
2. Select Retry.

**Expected Results:**

* Step 1: the row's drawer, Retry offered and checkout unavailable.
* Step 2: `<product A>` checked, with checkout available.

<!-- trace:case id=g10.store-cart.TC-7wv rev=1 -->
#### g10.store-cart.TC15: An empty cart says so and offers no checkout

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#reviewing-the-cart

**Pre-conditions:**

* customer, as the row says, has an empty cart.

**Test data:**

| Customer |
| --- |
| signed out |
| signed-in member |

**Steps:**

1. Open Cart and read the drawer.

**Expected Results:**

* It says the cart is empty, with no lines, footer, item count or Proceed to Checkout.

---

### discounts#struck-price-on-a-cart-line: Struck Price on a Cart Line

<!-- trace:case id=g10.store-cart.TC-x4l rev=1 -->
#### g10.store-cart.TC16: A cart line strikes the price a site discount took off

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#struck-price-on-a-cart-line

**Pre-conditions:**

* The cart holds the row's lines; the shop holds only the row's discount, saved at least a minute ago.

**Test data:**

| Discount | Lines | Line | Footer |
| --- | --- | --- | --- |
| 10% off `<product A>` | `<product A>` × 1 | HKD792, HKD880 struck | Subtotal HKD792 = 880 × 0.9; no discount row |
| buy 2 packs, get 1 free | `<product C>` × 3 | HKD40 a pack, HKD60 struck | Subtotal HKD120 = 60 × 3 − 60; no discount row |
| `<product A>` compare-at HKD1,000 | `<product A>` × 1 | HKD880, HKD1,000 struck | Subtotal HKD880; no discount row |
| 10% off each item in the order | `<product A>` × 1 | HKD880, nothing struck | `Discount (<order discount title>)` −HKD88 = 880 × 0.1 |

**Steps:**

1. Open Cart, wait for the read, and read the line and the footer.

**Expected Results:**

* The row's line and footer.

---

### discounts#cart-footer: Cart Footer

<!-- trace:case id=g10.store-cart.TC-bkm rev=2 -->
#### g10.store-cart.TC17: Once its minimum is met, the order discount takes its place among the footer rows

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#cart-footer

**Pre-conditions:**

* customer(signed-in member) holds 600 points and `<member code>`; the shop has the order discount Spend HKD1,000, save HKD100, read on the goods after the code; the cart holds the row's lines, with `<member code>` and 100 points applied.

**Test data:**

| Lines | Estimated Total |
| --- | --- |
| `<product B>` × 2 and `<product D>`: HKD1,050, HKD1,000 after the code, the minimum | HKD800 = 1,050 − 100 − 50 − 100 |
| `<product A>` × 2: HKD1,760 | HKD1,510 = 1,760 − 100 − 50 − 100 |

**Steps:**

1. Open Cart, wait for the read, and read the footer rows from top to bottom.

**Expected Results:**

* Subtotal, `Discount (Spend HKD1,000, save HKD100)` −HKD100, the code, Points, Shipping, then Estimated Total; the order discount row has no Remove, the code and Points rows do.
* Estimated Total is the row's.

#### g10.store-cart.TC18: Below its minimum, the order discount shows no row

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#cart-footer

**Pre-conditions:**

* As above, with `<product A>` and `<product C>` in the cart: HKD940, HKD890 after the code.

**Steps:**

1. Open Cart, wait for the read, and read the footer.

**Expected Results:**

* No order discount row; Estimated Total HKD790 = 940 − 50 − 100.

---

### cart#promo-code: Promo Code

#### g10.store-cart.TC20: A code the store cannot honour stays typed, with a reason in the reader's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer, as the row says, on the row's language, has `<product A>` and `<product B>` in the cart, HKD1,300, no code chosen.

**Test data:**

| Customer | Language | Code |
| --- | --- | --- |
| signed-in member | English | `NOPE-00000000`, minted by nobody |
| signed out | English | another member's `<member code>` |
| signed-in member | Traditional Chinese | `NOPE-00000000` |

**Steps:**

1. Open Cart, wait for the read, type the row's code and apply it.

**Expected Results:**

* The field keeps the code, with a refusal in the row's language; the total stays HKD1,300.
* The guest's row reads the same refusal as the unknown code.

<!-- trace:case id=g10.store-cart-checkout.TC-nst rev=1 -->
#### g10.store-cart.TC22: A second code replaces the first

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer(signed-in member) has a HKD1,300 cart with `<member code>` applied, HKD50 off.

**Steps:**

1. Apply `<public code>` and read the footer.

**Expected Results:**

* `Discount (<public code>)` −HKD20 alone, no `<member code>` row, and Estimated Total HKD1,280 = 1,300 − 20.

<!-- trace:case id=g10.store-cart-checkout.TC-7r3 rev=1 -->
#### g10.store-cart.TC23: A code the shop refuses for this basket is listed apart, with its reason

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer(signed-in member) has `<product A>` in the cart and holds `<product code>`, a coupon off `<product B>` only.

**Steps:**

1. Open Cart, wait for the read, open the code list and read `<product code>`'s entry and the total.

**Expected Results:**

* `<product code>` is apart, with the shop's reason; the total is unchanged by it.

<!-- trace:case id=g10.store-cart-checkout.TC-zqw rev=1 -->
#### g10.store-cart.TC24: Removing a code, or an edit it no longer fits, puts it back in the list

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer(signed-in member) has `<product A>` × 2, HKD1,760, with `<spend code>` applied: HKD200 off, spend HKD1,000 or more.

**Test data:**

| Action | Notice |
| --- | --- |
| select Remove on the code's row | none |
| decrease `<product A>` to 1, HKD880 | that the code was taken off |

**Steps:**

1. Do the row's action and read the footer.
2. Open the code list.

**Expected Results:**

* Step 1: no code row, and the row's notice.
* Step 2 lists `<spend code>` again.

<!-- trace:case id=g10.store-cart-checkout.TC-ty5 rev=1 -->
#### g10.store-cart.TC25: The codes still work when the rewards wallet does not answer

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer(signed-in member) holds `<member code>` and a reward coupon; the programme's rewards read fails.

**Steps:**

1. Open Cart, wait for the read, and open the code list.
2. Type `<public code>` and apply it.

**Expected Results:**

* Step 1 says the programme's rewards could not be read, and still lists `<member code>`.
* Step 2 applies `<public code>`.

<!-- trace:case id=g10.store-cart-checkout.TC-jeb rev=1 -->
#### g10.store-cart.TC26: A gift code adds a free line, and removing the line puts the code back

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#promo-code

**Pre-conditions:**

* customer(signed-in member) has goods past `<gift code>`'s threshold in the cart; the member holds `<gift code>`, giving `<gift product>` at 100% off.

**Steps:**

1. Apply `<gift code>` and read the lines and the footer.
2. Remove the `<gift product>` line, then read the footer and the code list.

**Expected Results:**

* Step 1: `<gift product>` as a line at no charge, and the total unchanged by it.
* Step 2: no code row, and `<gift code>` listed again.

---

### discounts#one-discount-at-a-time: One Discount at a Time

<!-- trace:case id=g10.store-cart-checkout.TC-xm3 rev=1 -->
#### g10.store-cart.TC27: Where a code cannot stack, the larger of it and the site discount applies

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#one-discount-at-a-time

**Pre-conditions:**

* customer(signed-in member) has `<product A>` and `<product B>` in the cart, HKD1,300; the shop has the order discount Spend HKD1,000, save HKD100; the member holds `<order code>`, set not to combine with order discounts.

**Test data:**

| `<order code>` | Rows | Estimated Total |
| --- | --- | --- |
| HKD80 off the order | `Discount (Spend HKD1,000, save HKD100)` −HKD100; the code's field says the site discount applies instead | HKD1,200 = 1,300 − 100 |
| HKD150 off the order | `Discount (<order code>)` −HKD150; no order discount row | HKD1,150 = 1,300 − 150 |

**Steps:**

1. Open Cart, wait for the read, and apply `<order code>`.
2. Read the footer and the code's field, then open the code list.

**Expected Results:**

* The row's rows and total.
* Where the site discount applies, the list still offers `<order code>`.

---

### discounts#order-of-application: Order of Application

<!-- trace:case id=g10.store-cart.TC-ikv rev=1 -->
#### g10.store-cart.TC28: A code stacks with an order discount while the goods still clear its minimum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#order-of-application

**Pre-conditions:**

* customer(signed-in member) holds `<reward>`, off Pokémon goods, combining with order discounts; the shop has the order discount Spend HKD1,000, save HKD100; the cart holds the row's Pokémon goods.

**Test data:**

| Lines | `<reward>` | Rows | Estimated Total |
| --- | --- | --- | --- |
| `<product A>` and `<product B>`: HKD1,300 | HKD50 off | order discount −HKD100; `Discount (<reward>)` −HKD50 | HKD1,150 = 1,300 − 100 − 50 |
| `<product B>` × 2 and `<product D>`: HKD1,050 | HKD120 off | `Discount (<reward>)` −HKD120; no order discount row | HKD930 = 1,050 − 120 |
| `<product B>` × 2 and `<product D>`: HKD1,050 | HKD60 off | order discount −HKD100; the code's field says the site discount applies instead | HKD950 = 1,050 − 100 |

**Steps:**

1. Open Cart, wait for the read, apply `<reward>`, and read the footer and the code's field.

**Expected Results:**

* The row's rows and total.

<!-- trace:case id=g10.store-cart.TC-9px rev=1 -->
#### g10.store-cart.TC29: A percentage code takes what Shopify's checkout takes, rounded the shop's way

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** discounts#order-of-application

**Pre-conditions:**

* customer(signed-in member) holds `<percent code>`, 10% off the order; the cart holds `<odd product>` × 1, priced HKD99.95, and no site discount applies.

**Steps:**

1. Open Cart, wait for the read, apply `<percent code>`, and read its row and the total.
2. Select Proceed to Checkout and read the discount on Shopify's page.

**Expected Results:**

* Step 1's code row equals step 2's discount, and the total is HKD99.95 less it.

---

### cart#points: Points

<!-- trace:case id=g10.store-cart-checkout.TC-7st rev=1 -->
#### g10.store-cart.TC32: Points are not offered to a guest, a non-member, or when the programme does not answer

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#points

**Pre-conditions:**

* customer, as the row says, has `<product A>` in the cart.

**Test data:**

| Customer |
| --- |
| signed out |
| signed in, not in the loyalty programme |
| signed-in member; the programme's read fails |

**Steps:**

1. Open Cart, wait for the read, and read the footer.

**Expected Results:**

* No points are offered; the promo code field still is.

<!-- trace:case id=g10.store-cart-checkout.TC-cew rev=1 -->
#### g10.store-cart.TC33: A code that takes all the goods leaves points nothing to pay

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#points

**Pre-conditions:**

* customer(signed-in member) holds 600 points and `<product C>` at HKD60 in the cart, with a HKD100-off `<member code>` applied.

**Steps:**

1. Open Cart, wait for the read, and read the points field.

**Expected Results:**

* It says there is nothing left for points to pay.

---

### cart#checkout: Checkout

<!-- trace:case id=g10.store-cart-checkout.TC-mvl rev=2 -->
#### g10.store-cart.TC35: An unchanged purchase reopens its invoice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#checkout

**Pre-conditions:**

* customer(signed-in member) pressed Proceed to Checkout on `<product A>` and left Shopify's page unpaid as `<first invoice>`.

**Test data:**

| Step |
| --- |
| reload the page |
| open the site in a second tab |

**Steps:**

1. Do the row's step.
2. Open Cart, select Proceed to Checkout and read Shopify's page.

**Expected Results:**

* `<first invoice>` opens again.

#### g10.store-cart.TC36: A changed or refused purchase starts a new invoice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#checkout

**Pre-conditions:**

* customer(signed-in member) pressed Proceed to Checkout on `<product A>` and left Shopify's page unpaid as `<first invoice>`.

**Test data:**

| Step |
| --- |
| increase `<product A>` to 2 |
| admin cancels the purchase's order in the shop's admin |

**Steps:**

1. Do the row's step.
2. Open Cart, select Proceed to Checkout and read Shopify's page.
3. Open `<first invoice>`'s address.

**Expected Results:**

* Step 2: a new invoice for the row's cart.
* Step 3 cannot be paid.

<!-- trace:case id=g10.store-cart-checkout.TC-vun rev=2 -->
#### g10.store-cart.TC37: Paying clears the cart it bought

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#checkout

**Pre-conditions:**

* customer, as the row says, pressed Proceed to Checkout on `<product A>` and is on Shopify's page.

**Test data:**

| Customer |
| --- |
| signed-in member |
| signed out |

**Steps:**

1. Pay with the payment provider's published test card that succeeds.
2. Return to `<listing url>` and open Cart.

**Expected Results:**

* Step 2: an empty cart, for a guest once this browser reads the order paid.

#### g10.store-cart.TC38: A cart left unpaid, or changed after Proceed to Checkout, stays

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#checkout

**Pre-conditions:**

* customer, as the row says, pressed Proceed to Checkout on `<product A>` and is on Shopify's page.

**Test data:**

| Customer | Step | Cart afterwards |
| --- | --- | --- |
| signed-in member | add `<product B>` in another tab, then pay | `<product A>` and `<product B>` |
| signed out | leave without paying | `<product A>` |

**Steps:**

1. Do the row's step.
2. Return to `<listing url>` and open Cart.

**Expected Results:**

* Step 2: the row's cart.

<!-- trace:case id=g10.store-cart-checkout.TC-b0s rev=1 -->
#### g10.store-cart.TC39: An uncertain payment hand-off opens no second invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** cart#checkout

**Pre-conditions:**

* customer(signed-in member) pressed Proceed to Checkout; the hand-off's answer was lost.

**Steps:**

1. Open Cart.
2. Select Proceed to Checkout again.

**Expected Results:**

* Step 1 keeps the purchase visible.
* Step 2 opens the same invoice, or asks to try again after about 6 seconds; never a second payable one.

---

#### g10.store-cart.TC47: A checkout of any value asks nothing about who the buyer is

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** cart#checkout

**Pre-conditions:**

* `<buyer>` has goods worth `<value>` in the cart.

**Test data:**

| `<buyer>` | `<value>` |
| --- | --- |
| A member whose identity is unverified | HKD4,800 |
| A member whose identity is unverified | HKD125,000 |
| A member whose verification has expired | HKD120,000 |
| A member whose identity is verified | HKD125,000 |
| A guest, signed out | HKD125,000 |

**Steps:**

1. Open Cart and proceed to checkout.

**Expected Results:**

* Shopify's checkout page opens as for any basket; no refusal, verification ask or sign-in ask names the value.

### checkout#guest-checkout: Guest Checkout

<!-- trace:case id=g10.store-cart-checkout.TC-lib rev=2 -->
#### g10.store-cart.TC40: A guest checks out from Check out as guest, with no sign-in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#guest-checkout

**Pre-conditions:**

* customer(signed out) has `<product A>` and `<public code>` on this browser's cart.

**Steps:**

1. Open Cart, wait for the read, and read the checkout controls.
2. Select Check out as guest.

**Expected Results:**

* Step 1: the primary button is Check out as guest, with a Sign in link under it.
* Step 2: Shopify's page asks for an email, with no sign-in.

#### g10.store-cart.TC41: Signing in from the cart brings the guest cart into the member's

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#guest-checkout

**Pre-conditions:**

* customer(signed out) has `<product A>` at 1 and `<public code>` on this browser's cart; `<member>` holds the row's cart at the store.

**Test data:**

| Member's cart | Drawer |
| --- | --- |
| `<product B>`, no code | `<product A>`, `<product B>`, `<public code>`, and points offered |
| `<product B>` with `<member code>` | both lines, `<member code>` kept |
| ❓ `<product A>` at 2 - product confirms | one `<product A>` line at 3 = 1 + 2 |

**Steps:**

1. Open Cart and select the Sign in link under the button, signing in as `<member>`.

**Expected Results:**

* The drawer reopens as the row says.

---

### cart#pending-operations: Pending Operations

<!-- trace:case id=g10.store-cart-checkout.TC-mih rev=1 -->
#### g10.store-cart.TC42: A Pay in flight holds the drawer, and closing does not cancel it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart#pending-operations

**Pre-conditions:**

* customer(signed-in member) has `<product A>` on a current cart; the store's checkout answer is held pending, then answers with an invoice.

**Steps:**

1. Select Proceed to Checkout, then try to change the quantity and the code.
2. Close the drawer, then release the checkout answer.

**Expected Results:**

* Step 1 changes nothing.
* Step 2 closes the drawer, then opens Shopify's page for the cart sent at step 1.

---

### checkout#store--read-every-line-live: Store — Read every line live

<!-- trace:case id=g10.store-cart-checkout.TC-rbr rev=1 -->
#### g10.store-cart.TC43: Shopify refuses an item that sold out after the drawer's read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#store--read-every-line-live

**Pre-conditions:**

* customer(signed-in member) is on Shopify's page for `<product A>`; admin then sells it out, by the recipe "Sell a card out".

**Steps:**

1. Fill in the shipping address and the test card that succeeds, and pay.

**Expected Results:**

* The payment is refused, naming `<product A>`, and no order is placed.

<!-- trace:case id=g10.store-product-listing.TC-jdu rev=1 -->
#### g10.store-cart.TC44: Checkout's own read names moved lines and refuses a short fill

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#store--read-every-line-live

**Pre-conditions:**

* customer(signed out) opened Cart; its read showed `<product A>` and `<product B>` current, at 2 each; after it, admin changed the shop as the row says, and a minute has passed.

**Test data:**

| Shop's change | Drawer |
| --- | --- |
| both repriced | one notice naming both lines and their new prices |
| 1 left of `<product A>` | checkout refused, naming `<product A>` and the 1 the shop would fill |

**Steps:**

1. Select Proceed to Checkout and read the drawer.

**Expected Results:**

* It does not leave for Shopify; it stays open with the row's drawer, each line showing the shop's current answer.

---

### checkout#collector--open-your-orders-in-grade10: Collector — Open Your Orders in Grade10

<!-- trace:case id=g10.store-cart-checkout.TC-k2d rev=1 -->
#### g10.store-cart.TC45: Shopify's thank-you page leads to Your Orders with the purchase

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#collector--open-your-orders-in-grade10

**Pre-conditions:**

* customer(signed-in member) is on Shopify's page for `<product A>`.

**Steps:**

1. Pay with the test card that succeeds and read the thank-you page.
2. Select its Grade10 Your Orders link.

**Expected Results:**

* Step 1 offers a Grade10 Your Orders link.
* Step 2 lists the order for `<product A>` within seconds.

---

### checkout#shopify--take-the-payment: Shopify — Take the payment

<!-- trace:case id=g10.store-cart.TC-mhq rev=1 -->
#### g10.store-cart.TC46: A declined payment places no order and keeps the cart for another try

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#shopify--take-the-payment

**Pre-conditions:**

* customer, as the row says, pressed Proceed to Checkout on `<product A>` and is on Shopify's page.

**Test data:**

| Customer |
| --- |
| signed out |
| signed-in member |

**Steps:**

1. Pay with the payment provider's published test card that is declined.
2. Return to `<listing url>`, open Cart, select Proceed to Checkout and pay with the test card that succeeds.
3. Read the orders for this purchase.

**Expected Results:**

* Step 1 refuses the payment and places no order.
* ❓ Step 2: the cart still holds `<product A>`, and paying places the order - product confirms.
* ❓ Step 3: exactly one order for `<product A>`.
