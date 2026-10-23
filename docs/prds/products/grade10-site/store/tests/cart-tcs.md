---
title: Store Cart Test Cases
---

# grade10-site/store/cart Test Cases

**Status:** pending-review · 0/38
**Drafts styled:** 2026-10-22, tcs-rules r6

## Background

**Shared test data:**

| Field | Value |
| --- | --- |
| `store listing url` | `<g10url>/store/collections` |
| `product A` | A booster box for sale at HKD880, no site discount, at least 3 for sale. |
| `product B` | An elite trainer box for sale at HKD420, no site discount, at least 3 for sale. |
| `product C` | Booster packs for sale at HKD60, no site discount. |
| `product D` | Sleeves for sale at HKD210, no site discount. |
| `member code` | A store code minted to the member: HKD50 off any order, combining with order discounts. |
| `public code` | A public Shopify code, tagged `public`: HKD20 off the order. |
| `spend code` | A code: HKD200 off, spend HKD1,000 or more. |
| `test card` | The payment provider's published test card that succeeds. |

## Walk 1: A Member's Code and Points to Checkout

**Starting state:**

- customer(signed-in member) is on `<store listing url>`, a member of the loyalty programme with `<points balance>`.
- The cart holds `<product A>` and `<product B>`; no code or points are chosen.
- The member's wallet holds `<member code>`; the shop has `<public code>` open to everyone.

**Shared test data:**

| Field | Value |
| --- | --- |
| `store listing url` | `<g10url>/store/collections` |
| `product A` | A booster box for sale at HKD880, no site discount. |
| `product B` | An elite trainer box for sale at HKD420, no site discount. |
| `points balance` | 600 points. |
| `member code` | A store code for HKD50 off any order, combining with order discounts, not yet used. |
| `public code` | A public Shopify code, tagged `public`, for HKD20 off the order. |

### Route

1. Click Cart in the site header and wait for the read.
   - Record the drawer over the page with current lines `g10.store-cart.US1-TC1`
2. Open the code list.
   - Record the member's codes beside the public ones, in order `g10.store-cart.US2-TC2`
3. Pick `<member code>`.
   - Record the code's row and the total at once `g10.store-cart.US2-TC1`
4. Click Use max on points.
   - Record the points row at the ceiling `g10.store-cart.US3-TC1`
5. Reload the page and open Cart again.
   - Record the code and the points still chosen `g10.store-cart.US3-TC4`
6. Click Proceed to Checkout.
   - Record Shopify's page with the same code and points `g10.store-cart.US4-TC1`

## g10.store-cart.US1: Review the cart

**As a** customer,
**I want** to open my cart over the page I am on and see current facts,
**so that** I can trust the total before I pay.

<!-- trace:case id=g10.store-cart-checkout.TC-q5a rev=1 -->
### g10.store-cart.US1-TC1: Cart opens over the page and waits for the shop's read

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer is on `<page>`, with `<product A>` in the cart.

**Test data:**

| Partition | `<page>` |
| --- | --- |
| A store page | `<store listing url>`. |
| Outside the store | The auction listings page. |

**Steps:**

1. Click Cart in the site header.
2. Read the drawer while its read is pending.
3. Wait for the read to finish.
4. Read the lines and the totals.

**Expected Results:**

* Step 1 opens the drawer over `<page>`.
* Step 2 shows the lines, totals and Checkout waiting.
* Step 4 shows `<product A>` at the shop's current price.
* Step 4 shows Subtotal, Shipping as calculated at checkout, and Estimated Total.

---

## g10.store-cart.US2: Use a promo code

**As a** customer,
**I want** to type or pick one promo code against my cart,
**so that** I see what it takes off before I pay.

<!-- trace:case id=g10.store-cart-checkout.TC-bzv rev=1 -->
### g10.store-cart.US2-TC1: A known code cuts the total; a refused one stays with its reason

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(`<actor state>`) has `<product A>` and `<product B>` in the cart, no code chosen.

**Test data:**

| Partition | `<actor state>` | `<code>` | `<expected>` |
| --- | --- | --- | --- |
| Member's code | signed-in member | `<member code>`, HKD50 off. | `Discount (<member code>)` −HKD50; total HKD1,250 = 1,300 − 50. |
| Public code, guest | signed out | `<public code>`, HKD20 off. | `Discount (<public code>)` −HKD20; total HKD1,280 = 1,300 − 20. |
| Unknown code | signed-in member | `NOPE-00000000`, minted by nobody. | The field keeps it with a refusal; total HKD1,300. |
| Member code, guest | signed out | Another member's `<member code>`. | The same refusal as the unknown code; total HKD1,300. |

**Steps:**

1. Click Cart in the site header and wait for the read.
2. Type `<code>` in the promo code field.
3. Apply it.
4. Read the footer and the field.

**Expected Results:**

* Step 4 shows `<expected>`.

<!-- trace:case id=g10.store-cart-checkout.TC-t4a rev=1 -->
### g10.store-cart.US2-TC2: The code list shows what fits first, soonest to expire first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(`<actor state>`) has a cart of HKD1,300.
* The member holds `<code 1>` (fits, expires later) and `<code 2>` (fits, expires sooner).
* The shop has `<public code>` (fits, expires latest) and `<spend code>` (spend HKD5,000 or more).

**Test data:**

| Partition | `<actor state>` | `<expected list>` |
| --- | --- | --- |
| Member | signed-in member | `<code 2>`, `<code 1>`, `<public code>`; then `<spend code>` apart, with its reason. |
| Guest | signed out | `<public code>`; then `<spend code>` apart, with its reason. No member code. |

**Steps:**

1. Click Cart in the site header and wait for the read.
2. Open the code list.
3. Read the codes in order.
4. Pick the first code that fits.

**Expected Results:**

* Step 3 shows `<expected list>`.
* Step 4 applies the code the same way a typed one applies.

---

## g10.store-cart.US3: Pay with points

**As a** customer,
**I want** to put my points against what the code leaves,
**so that** I pay less money at checkout.

<!-- trace:case id=g10.store-cart-checkout.TC-4o0 rev=1 -->
### g10.store-cart.US3-TC1: Points apply after the code, trimmed to the ceiling

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US3

**Pre-conditions:**

* customer(signed-in member) holds `<points balance>` and has `<product A>` and `<product B>` in the cart.
* `<member code>` is applied, HKD50 off.

**Test data:**

| Partition | `<points balance>` | `<points action>` | `<expected points>` | `<expected total>` |
| --- | --- | --- | --- | --- |
| Use max under the ceiling | 600 | Use max. | −HKD600 | HKD650 = 1,300 − 50 − 600 |
| Ask past the ceiling | 2,000 | Type 2,000 and Apply. | −HKD1,250, trimmed to what the code leaves | HKD0 = 1,300 − 50 − 1,250 |
| A part | 600 | Type 100 and Apply. | −HKD100 | HKD1,150 = 1,300 − 50 − 100 |

**Steps:**

1. Click Cart in the site header and wait for the read.
2. Read the points field.
3. Do `<points action>`.
4. Read the footer.
5. Remove the points.
6. Read the footer.

**Expected Results:**

* Step 2 shows `<points balance>`, the rate and the most this cart takes.
* Step 4 shows a Points row of `<expected points>`, below the code's row.
* Step 4's Estimated Total is `<expected total>`.
* Step 6 shows no Points row, the code still applied.

<!-- trace:case id=g10.store-cart-checkout.TC-34g rev=1 -->
### g10.store-cart.US3-TC4: The chosen code and points survive a reload and another device

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US3

**Pre-conditions:**

* customer(signed-in member) has `<member code>` and 100 points chosen on the cart.

**Steps:**

1. Reload the page.
2. Open Cart and read the footer.
3. Sign in as the same member in another browser.
4. Open Cart there and read the footer.

**Expected Results:**

* Step 2 shows `<member code>` and 100 points chosen.
* Step 4 shows `<member code>` and 100 points chosen.
* Both totals are read again, not held.

---

## g10.store-cart.US4: Check out

**As a** customer,
**I want** to send my reviewed cart to Shopify's checkout and pay,
**so that** I place my order.

<!-- trace:case id=g10.store-cart-checkout.TC-md9 rev=1 -->
### g10.store-cart.US4-TC1: Proceed to Checkout sends the lines, code and points to Shopify

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed-in member) has `<product A>`, `<member code>` and 100 points on the cart, read current.

**Steps:**

1. Click Proceed to Checkout.
2. Read Shopify's page.
3. Return to the store without paying.
4. Open Cart.

**Expected Results:**

* Step 2 opens under `checkout.grade10.com`.
* Step 2 lists `<product A>`, `<member code>` and the 100-point deduction.
* Step 2 adds shipping, so its charge is not the cart's subtotal.
* Step 4 still holds `<product A>`, the code and the points.

---

## Ungrouped

### g10.store-cart.US1: Review the cart

**As a** customer,
**I want** to open my cart over the page I am on and see current facts,
**so that** I can trust the total before I pay.

<!-- trace:case id=g10.store-cart-checkout.TC-wf5 rev=1 -->
#### g10.store-cart.US1-TC2: The drawer stays dismissible while it waits

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer has `<product A>` in the cart.
* The drawer's `<pending operation>` is held pending.

**Test data:**

| Partition | `<pending operation>` | `<dismissal>` |
| --- | --- | --- |
| Opening read | The read on open. | The close button. |
| Quantity save | A quantity change. | A click on the backdrop. |
| Starting checkout | Proceed to Checkout. | Escape. |

**Steps:**

1. Open Cart and start `<pending operation>`.
2. Try to change a quantity, a code, the points and a product link.
3. Use `<dismissal>`.

**Expected Results:**

* Step 2 changes nothing.
* Step 3 closes the drawer.

<!-- trace:case id=g10.store-cart-checkout.TC-1mg rev=1 -->
#### g10.store-cart.US1-TC3: Quantity and removal in the drawer change the cart and total

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer has `<product A>` at quantity 2 and `<product B>` at quantity 1 in the cart; the shop has at least 3 of each.

**Test data:**

| Partition | `<edit>` | `<expected subtotal>` |
| --- | --- | --- |
| Increase | Increase `<product A>` to 3. | HKD3,060 = 880 × 3 + 420 |
| Decrease | Decrease `<product A>` to 1. | HKD1,300 = 880 + 420 |
| Remove | Remove `<product B>`. | HKD1,760 = 880 × 2 |
| Remove the last | Remove both lines. | None; the drawer shows an empty cart. |

**Steps:**

1. Open Cart and wait for the read.
2. Do `<edit>`.
3. Read the lines and the footer.
4. Close the drawer and reload the page.
5. Open Cart again.

**Expected Results:**

* Step 3 shows `<expected subtotal>`.
* Step 5 shows the same lines as step 3.

<!-- trace:case id=g10.store-cart-checkout.TC-gcg rev=1 -->
#### g10.store-cart.US1-TC4: Each line shows the product's current first picture

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* `<product A>` is in the cart.
* admin has since changed `<product A>`'s first image in the shop's admin, and 1 minute has passed.

**Steps:**

1. Open Cart and wait for the read.
2. Read the line for `<product A>`.

**Expected Results:**

* Step 2 shows `<product A>`'s new first image.

<!-- trace:case id=g10.store-cart-checkout.TC-c56 rev=1 -->
#### g10.store-cart.US1-TC5: The total is the shop's price, or the store's own past 2.5 s

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* The cart holds `<product A>` twice, HKD1,760; the shop has the order discount Spend HKD1,000, save HKD100.
* The shop's price answer comes `<shop answer>`.

**Test data:**

| Partition | `<shop answer>` | `<expected footer>` |
| --- | --- | --- |
| In time | Within 2.5 seconds. | `Discount (Spend HKD1,000, save HKD100)` −HKD100; Estimated Total HKD1,660. |
| Late | After 2.5 seconds (fixed). | No site discount row; Estimated Total HKD1,760, the store's own figure. |
| Never | Not at all. | No site discount row; Estimated Total HKD1,760, the store's own figure. |

**Steps:**

1. Open Cart.
2. Wait 3 seconds past the store's read.
3. Read the footer.

**Expected Results:**

* Step 3 shows `<expected footer>`.

<!-- trace:case id=g10.store-cart-checkout.TC-g2h rev=1 -->
#### g10.store-cart.US1-TC6: A member's drawer closes when the session ends elsewhere

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(`<actor state>`) has the drawer open, its read finished, in tab 1.

**Test data:**

| Partition | `<actor state>` | `<session event>` | `<expected drawer>` |
| --- | --- | --- | --- |
| Signed out elsewhere | signed-in member | Sign out in tab 2 of this site. | Closed, with no message. |
| Session expired | signed-in member | The session expires. | Closed, with no message. |
| Guest | signed out | Sign in and out in tab 2. | Open. |

**Steps:**

1. Do `<session event>`.
2. Return to tab 1 and read it.
3. Sign in again in tab 1.
4. Read tab 1.

**Expected Results:**

* Step 2 shows `<expected drawer>`.
* Step 4 does not reopen a closed drawer.

<!-- trace:case id=g10.store-cart-checkout.TC-wkm rev=1 -->
#### g10.store-cart.US1-TC7: A guest cart is kept in this browser, a member's at the store

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(`<actor state>`) has `<product A>` in the cart in browser 1.

**Test data:**

| Partition | `<actor state>` | `<browser 2>` | `<expected browser 2 cart>` |
| --- | --- | --- | --- |
| Guest | signed out | Another browser, signed out. | Empty. |
| Member | signed-in member | Another browser, signed in as the same member. | `<product A>`. |

**Steps:**

1. Reload browser 1 and open Cart.
2. Open Cart in `<browser 2>`.

**Expected Results:**

* Step 1 shows `<product A>`.
* Step 2 shows `<expected browser 2 cart>`.

<!-- trace:case id=g10.store-product-listing.TC-4ry rev=1 -->
#### g10.store-cart.US1-TC8: A line the shop repriced or fills short says so on open

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(signed out) is on `<store listing url>`, with `<moved product>` in the cart, quantity 2, at HKD880.
* admin has changed `<moved product>` in the shop's admin as its row describes, and 1 minute has passed.

**Test data:**

| Partition | `<shop change>` | `<expected line>` |
| --- | --- | --- |
| Fewer than asked | 1 left for sale. | Quantity 1, saying the store changed it. |
| More than asked | 5 for sale. | Quantity 2; it never grows. |
| Price rise | Repriced to HKD950. | HKD950, saying the price changed. |
| Price fall | Repriced to HKD800. | HKD800, saying the price changed. |

**Steps:**

1. Click Cart in the site header.
2. Wait for the drawer's read to finish.
3. Read the line for `<moved product>`.

**Expected Results:**

* Step 3 shows `<expected line>`.
* The total follows the line's quantity times its price.

<!-- trace:case id=g10.store-product-listing.TC-4ba rev=1 -->
#### g10.store-cart.US1-TC9: A sold-out line holds checkout until it is removed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(signed out) is on `<store listing url>`, with `<sold-out product>` and `<product A>` in the cart.
* `<sold-out product>` has since sold out, by the recipe "Sell a card out"; the shop still lists its variant.

**Steps:**

1. Click Cart in the site header.
2. Wait for the drawer's read to finish.
3. Read the lines and the checkout control.
4. Remove `<sold-out product>`.
5. Read the checkout control.

**Expected Results:**

* Step 3 shows `<sold-out product>` marked Sold out.
* Step 3's Proceed to Checkout is unavailable.
* Step 5's Proceed to Checkout is available.

<!-- trace:case id=g10.store-product-listing.TC-2fl rev=1 -->
#### g10.store-cart.US1-TC10: Lines whose product left the shop leave with one notice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(signed out) is on `<store listing url>`, with `<gone lines>` and `<product A>` in the cart.
* admin has taken `<gone lines>` away as their row describes, and 1 minute has passed.

**Test data:**

| Partition | `<gone lines>` |
| --- | --- |
| One line off the channel | `<product A>`, unpublished from the store's sales channel. |
| Two lines, two causes | `<product A>` unpublished, and `<product B>`'s variant deleted. |

**Steps:**

1. Click Cart in the site header.
2. Wait for the drawer's read to finish.
3. Read the lines and the notice.

**Expected Results:**

* Step 3 lists no line from `<gone lines>`.
* Step 3 shows one notice naming every line in `<gone lines>`.
* `<product A>` stays in the cart.

<!-- trace:case id=g10.store-product-listing.TC-j18 rev=1 -->
#### g10.store-cart.US1-TC11: A read that cannot finish shows unchecked lines and Retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(signed out) is on `<store listing url>`, with `<product A>` in the cart.
* The cart read fails as `<failure>` describes; the read after Retry answers.

**Test data:**

| Partition | `<failure>` | `<expected drawer>` |
| --- | --- | --- |
| Check cannot finish | The lines load, but the shop's check fails. | Every line unchecked; no price, availability or total. |
| Cart never loaded | The cart itself cannot be read. | No line named; never says the cart is empty. |

**Steps:**

1. Click Cart in the site header.
2. Read the drawer.
3. Click Retry.
4. Read the drawer after the read answers.

**Expected Results:**

* Step 2 shows `<expected drawer>`.
* Step 2 offers Retry; checkout is unavailable.
* Step 4 shows `<product A>` checked, with checkout available.

<!-- trace:case id=g10.store-cart.TC-x4l rev=1 -->
#### g10.store-cart.US1-TC12: A cart line strikes the price a site discount took off

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* The cart holds `<cart lines>`.
* The shop holds only `<shop discount>`, saved at least 1 minute ago.

**Test data:**

| Partition | `<shop discount>` | `<cart lines>` | `<expected line>` | `<expected footer>` |
| --- | --- | --- | --- | --- |
| Product cut, no minimum | 10% off `<product A>`. | `<product A>` × 1. | HKD792, HKD880 struck. | Subtotal HKD792 = 880 × 0.9; no discount row. |
| Buy X get Y | Buy 2 packs, get 1 free. | `<product C>` × 3. | HKD40 a pack, HKD60 struck. | Subtotal HKD120 = 60 × 3 − 60; no discount row. |
| Sale price | `<product A>` compare-at HKD1,000. | `<product A>` × 1. | HKD880, HKD1,000 struck. | Subtotal HKD880; no discount row. |
| Order cut, no minimum | 10% off each item in the order. | `<product A>` × 1. | HKD880, nothing struck. | `Discount (<order discount title>)` −HKD88 = 880 × 0.1. |

**Steps:**

1. Open Cart and wait for the read.
2. Read the line.
3. Read the footer.

**Expected Results:**

* Step 2 shows `<expected line>`.
* Step 3 shows `<expected footer>`.

<!-- trace:case id=g10.store-cart.TC-bkm rev=1 -->
#### g10.store-cart.US1-TC13: Footer rows keep their order; an order discount shows once its minimum is met

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(signed-in member) holds 600 points and `<member code>`.
* The shop has the order discount Spend HKD1,000, save HKD100.
* The cart holds `<cart lines>`; `<member code>` and 100 points are applied.
* The minimum is read on the goods after the code.

**Test data:**

| Partition | `<cart lines>` | `<expected discount row>` | `<expected total>` |
| --- | --- | --- | --- |
| Below the minimum | `<product A>` and `<product C>`: HKD940; HKD890 after the code. | None. | HKD790 = 940 − 50 − 100 |
| At the limit | `<product B>` × 2 and `<product D>`: HKD1,050; HKD1,000 after the code (fixed: the minimum). | `Discount (Spend HKD1,000, save HKD100)` −HKD100. | HKD800 = 1,050 − 100 − 50 − 100 |
| Above the minimum | `<product A>` × 2: HKD1,760. | `Discount (Spend HKD1,000, save HKD100)` −HKD100. | HKD1,510 = 1,760 − 100 − 50 − 100 |

**Steps:**

1. Open Cart and wait for the read.
2. Read the footer rows from top to bottom.

**Expected Results:**

* Step 2 lists Subtotal, `<expected discount row>`, the code, Points, Shipping, then Estimated Total.
* The order discount row has no Remove; the code and Points rows do.
* Step 2's Estimated Total is `<expected total>`.

<!-- trace:case id=g10.store-cart.TC-7wv rev=1 -->
#### g10.store-cart.US1-TC14: An empty cart says so and offers no checkout

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US1

**Pre-conditions:**

* customer(`<actor state>`) has an empty cart.

**Test data:**

| Partition | `<actor state>` |
| --- | --- |
| Guest | signed out |
| Member | signed-in member |

**Steps:**

1. Click Cart in the site header.
2. Read the drawer.

**Expected Results:**

* Step 2 says the cart is empty.
* Step 2 shows no lines, no footer and no Proceed to Checkout.
* The drawer's header shows no item count.

---

### g10.store-cart.US2: Use a promo code

**As a** customer,
**I want** to type or pick one promo code against my cart,
**so that** I see what it takes off before I pay.

<!-- trace:case id=g10.store-cart-checkout.TC-nst rev=1 -->
#### g10.store-cart.US2-TC3: A second code replaces the first

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) has a HKD1,300 cart with `<member code>` applied, HKD50 off.

**Steps:**

1. Apply `<public code>`, HKD20 off.
2. Read the footer.

**Expected Results:**

* Step 2 shows `Discount (<public code>)` −HKD20 alone.
* Step 2 shows no row for `<member code>`.
* Estimated Total is HKD1,280 = 1,300 − 20.

<!-- trace:case id=g10.store-cart-checkout.TC-xm3 rev=1 -->
#### g10.store-cart.US2-TC4: A code that cannot stack gives way to a larger site discount

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) has `<product A>` and `<product B>` in the cart, HKD1,300.
* The shop has the order discount Spend HKD1,000, save HKD100.
* The member holds `<order code>`, set not to combine with order discounts.

**Test data:**

| Partition | `<order code>` | `<expected rows>` | `<expected total>` |
| --- | --- | --- | --- |
| Site discount larger | HKD80 off the order. | `Discount (Spend HKD1,000, save HKD100)` −HKD100; the code's field says the site discount applies instead. | HKD1,200 = 1,300 − 100 |
| Code larger | HKD150 off the order. | `Discount (<order code>)` −HKD150; no order discount row. | HKD1,150 = 1,300 − 150 |

**Steps:**

1. Open Cart and wait for the read.
2. Apply `<order code>`.
3. Read the footer and the code's field.
4. Open the code list.

**Expected Results:**

* Step 3 shows `<expected rows>`.
* Step 3's Estimated Total is `<expected total>`.
* For the site-discount row, step 4 still lists `<order code>`.

<!-- trace:case id=g10.store-cart-checkout.TC-7r3 rev=1 -->
#### g10.store-cart.US2-TC5: A code the shop refuses for this basket is listed with its reason

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) has `<product A>` in the cart.
* The member holds `<product code>`, a coupon off `<product B>` only.

**Steps:**

1. Open Cart and wait for the read.
2. Open the code list.
3. Read `<product code>`'s entry.
4. Read the Estimated Total.

**Expected Results:**

* Step 3 lists `<product code>` apart, with the shop's reason.
* Step 4 is unchanged by `<product code>`.

<!-- trace:case id=g10.store-cart-checkout.TC-zqw rev=1 -->
#### g10.store-cart.US2-TC6: Removing a code, or an edit it no longer fits, puts it back

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) has `<product A>` × 2, HKD1,760, with `<spend code>` applied: HKD200 off, spend HKD1,000 or more.

**Test data:**

| Partition | `<action>` | `<expected notice>` |
| --- | --- | --- |
| Remove | Click Remove on the code's row. | None. |
| Edit below the minimum | Decrease `<product A>` to 1, HKD880. | A notice that the code was taken off. |

**Steps:**

1. Do `<action>`.
2. Read the footer.
3. Open the code list.

**Expected Results:**

* Step 2 shows no code row, and `<expected notice>`.
* Step 3 lists `<spend code>` again.

<!-- trace:case id=g10.store-cart-checkout.TC-ty5 rev=1 -->
#### g10.store-cart.US2-TC7: The codes still work when the rewards wallet does not answer

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) holds `<member code>` and a reward coupon.
* The programme's rewards read fails.

**Steps:**

1. Open Cart and wait for the read.
2. Open the code list.
3. Type `<public code>` and apply it.

**Expected Results:**

* Step 2 says the programme's rewards could not be read.
* Step 2 still lists `<member code>`.
* Step 3 applies `<public code>`.

<!-- trace:case id=g10.store-cart-checkout.TC-jeb rev=1 -->
#### g10.store-cart.US2-TC8: A gift code adds a free line; removing the line puts the code back

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) has goods past `<gift code>`'s threshold in the cart.
* The member holds `<gift code>`, giving `<gift product>` at 100% off.

**Steps:**

1. Apply `<gift code>`.
2. Read the lines and the footer.
3. Remove the `<gift product>` line.
4. Read the footer and the code list.

**Expected Results:**

* Step 2 shows `<gift product>` as a line at no charge.
* Step 2's total is unchanged by the gift line.
* Step 4 shows no code row, and `<gift code>` listed again.

<!-- trace:case id=g10.store-cart.TC-ikv rev=1 -->
#### g10.store-cart.US2-TC9: A code stacks with an order discount while the goods still clear its minimum

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) holds `<reward>`, a reward off Pokémon goods that combines with order discounts.
* The shop has the order discount Spend HKD1,000, save HKD100.
* The cart holds `<cart lines>`, all Pokémon goods.

**Test data:**

| Partition | `<cart lines>` | `<reward>` | `<expected rows>` | `<expected total>` |
| --- | --- | --- | --- | --- |
| Both apply | `<product A>` and `<product B>`: HKD1,300. | HKD50 off. | Order discount −HKD100; `Discount (<reward>)` −HKD50. | HKD1,150 = 1,300 − 100 − 50 |
| Under the minimum after the code, code larger | `<product B>` × 2 and `<product D>`: HKD1,050. | HKD120 off. | `Discount (<reward>)` −HKD120; no order discount row. | HKD930 = 1,050 − 120 |
| Under the minimum after the code, order discount larger | `<product B>` × 2 and `<product D>`: HKD1,050. | HKD60 off. | Order discount −HKD100; the code's field says the site discount applies instead. | HKD950 = 1,050 − 100 |

**Steps:**

1. Open Cart and wait for the read.
2. Apply `<reward>`.
3. Read the footer and the code's field.

**Expected Results:**

* Step 3 shows `<expected rows>`.
* Step 3's Estimated Total is `<expected total>`.

<!-- trace:case id=g10.store-cart.TC-9px rev=1 -->
#### g10.store-cart.US2-TC10: A percentage code takes what Shopify's checkout takes, rounded the shop's way

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US2

**Pre-conditions:**

* customer(signed-in member) holds `<percent code>`.
* The cart holds `<odd product>` × 1, and no site discount applies.

**Test data:**

| Field | Value |
| --- | --- |
| `percent code` | A store code for 10% off the order. |
| `odd product` | A product priced HKD99.95, so 10% is HKD9.995 before rounding. |

**Steps:**

1. Open Cart and wait for the read.
2. Apply `<percent code>`.
3. Read the code's row and the Estimated Total.
4. Click Proceed to Checkout.
5. Read the discount and subtotal on Shopify's page.

**Expected Results:**

* Step 3's code row equals step 5's discount.
* Step 3's Estimated Total equals HKD99.95 less step 5's discount.

---

### g10.store-cart.US3: Pay with points

**As a** customer,
**I want** to put my points against what the code leaves,
**so that** I pay less money at checkout.

<!-- trace:case id=g10.store-cart-checkout.TC-7st rev=1 -->
#### g10.store-cart.US3-TC2: Points are not offered to a guest or a non-member

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US3

**Pre-conditions:**

* customer(`<actor state>`) has `<product A>` in the cart.

**Test data:**

| Partition | `<actor state>` |
| --- | --- |
| Guest | signed out |
| Outside the programme | signed in, not in the loyalty programme |
| Programme not answering | signed-in member; the programme's read fails |

**Steps:**

1. Open Cart and wait for the read.
2. Read the footer.

**Expected Results:**

* Step 2 offers no points.
* Step 2 still offers the promo code field.

<!-- trace:case id=g10.store-cart-checkout.TC-cew rev=1 -->
#### g10.store-cart.US3-TC3: A code that takes all the goods leaves points nothing to pay

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US3

**Pre-conditions:**

* customer(signed-in member) holds 600 points and `<product C>` at HKD60 in the cart.
* `<member code>` for HKD100 off is applied.

**Steps:**

1. Open Cart and wait for the read.
2. Read the points field.

**Expected Results:**

* Step 2 says there is nothing left for points to pay.

---

### g10.store-cart.US4: Check out

**As a** customer,
**I want** to send my reviewed cart to Shopify's checkout and pay,
**so that** I place my order.

<!-- trace:case id=g10.store-cart-checkout.TC-lib rev=1 -->
#### g10.store-cart.US4-TC2: A guest checks out from the guest button; signing in merges the cart

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed out) has `<product A>` at quantity 1 and `<public code>` on this browser's cart.
* `<member>` holds `<member cart>` at the store.

**Test data:**

| Partition | `<route>` | `<member cart>` | `<expected>` |
| --- | --- | --- | --- |
| Check out as guest | Click Check out as guest. | Not used. | Shopify's page asks for an email; no sign-in. |
| Sign in, member cart without a code | Click the Sign in link under the button. | `<product B>`, no code. | Drawer reopens: `<product A>`, `<product B>`, `<public code>`, points offered. |
| Sign in, member cart with a code | Click the Sign in link under the button. | `<product B>` with `<member code>`. | Drawer reopens: both lines, `<member code>` kept. |
| Sign in, same product in both carts | Click the Sign in link under the button. | `<product A>` at quantity 2. | Drawer reopens: one `<product A>` line at quantity 3 = 1 + 2. |

**Steps:**

1. Open Cart and wait for the read.
2. Read the checkout controls.
3. Follow `<route>`, signing in as `<member>` where asked.
4. Read the page or drawer that opens.

**Expected Results:**

* Step 2's primary button is Check out as guest, a Sign in link under it.
* Step 4 shows `<expected>`.

<!-- trace:case id=g10.store-cart-checkout.TC-mih rev=1 -->
#### g10.store-cart.US4-TC3: A Pay in flight holds the drawer; closing does not cancel it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed-in member) has `<product A>` on a current cart.
* The store's checkout answer is held pending, then answers with an invoice.

**Steps:**

1. Click Proceed to Checkout.
2. Try to change the quantity and the code.
3. Close the drawer.
4. Release the checkout answer.

**Expected Results:**

* Step 2 changes nothing.
* Step 3 closes the drawer.
* Step 4 opens Shopify's page for the cart sent at step 1.

<!-- trace:case id=g10.store-cart-checkout.TC-mvl rev=1 -->
#### g10.store-cart.US4-TC4: An unchanged purchase reopens its invoice; a changed one starts anew

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed-in member) pressed Proceed to Checkout on `<product A>` and left Shopify's page unpaid as `<first invoice>`.

**Test data:**

| Partition | `<before the second Pay>` | `<expected>` |
| --- | --- | --- |
| Reload | Reload the page. | `<first invoice>` opens again. |
| Second tab | Open the site in a second tab. | `<first invoice>` opens again. |
| Member's own edit | Increase `<product A>` to 2. | A new invoice for 2; `<first invoice>` no longer payable. |

**Steps:**

1. Do `<before the second Pay>`.
2. Open Cart and click Proceed to Checkout.
3. Read Shopify's page.
4. Open `<first invoice>`'s address.

**Expected Results:**

* Step 3 shows `<expected>`.
* For the edit row, step 4 cannot be paid.

<!-- trace:case id=g10.store-cart-checkout.TC-vun rev=1 -->
#### g10.store-cart.US4-TC5: Paying clears the cart it bought, not a cart changed after

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(`<actor state>`) pressed Proceed to Checkout on `<product A>` and is on Shopify's page.

**Test data:**

| Partition | `<actor state>` | `<on Shopify's page>` | `<expected cart>` |
| --- | --- | --- | --- |
| Member pays | signed-in member | Pay with a test card. | Empty. |
| Member edits, then pays | signed-in member | Add `<product B>` in another tab, then pay. | `<product A>` and `<product B>`. |
| Guest leaves unpaid | signed out | Leave without paying. | `<product A>`. |
| Guest pays | signed out | Pay with a test card. | Empty, once this browser reads the order paid. |

**Steps:**

1. Do `<on Shopify's page>`, using `<test card>` where paying.
2. Return to `<store listing url>`.
3. Open Cart.

**Expected Results:**

* Step 3 shows `<expected cart>`.

<!-- trace:case id=g10.store-cart-checkout.TC-rbr rev=1 -->
#### g10.store-cart.US4-TC6: Shopify refuses an item that sold out after the drawer's read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed-in member) is on Shopify's page for `<product A>`.
* admin then sells `<product A>` out, by the recipe "Sell a card out".

**Steps:**

1. Fill in the shipping address and `<test card>`.
2. Pay.
3. Read Shopify's page.

**Expected Results:**

* Step 3 refuses the payment, naming `<product A>`.
* No order is placed.

<!-- trace:case id=g10.store-cart-checkout.TC-k2d rev=1 -->
#### g10.store-cart.US4-TC7: Shopify's thank-you page leads to Your Orders with the purchase

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed-in member) is on Shopify's page for `<product A>`.

**Steps:**

1. Pay with `<test card>`.
2. Read Shopify's thank-you page.
3. Click its Grade10 Your Orders link.
4. Read the list.

**Expected Results:**

* Step 2 offers a Grade10 Your Orders link.
* Step 4 lists the order for `<product A>` within seconds.

<!-- trace:case id=g10.store-cart-checkout.TC-b0s rev=1 -->
#### g10.store-cart.US4-TC8: An uncertain payment hand-off opens no second invoice

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed-in member) pressed Proceed to Checkout; the hand-off's answer was lost.

**Steps:**

1. Open Cart.
2. Click Proceed to Checkout again.

**Expected Results:**

* Step 1 keeps the purchase visible.
* Step 2 opens the same invoice, or waits; never a second payable one.

<!-- trace:case id=g10.store-product-listing.TC-jdu rev=1 -->
#### g10.store-cart.US4-TC9: Checkout's own read names moved lines and refuses a short fill

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(signed out) has opened Cart from `<store listing url>`; its read shows `<product A>` and `<product B>` current, quantity 2 each.
* After that read, admin changes the shop as `<shop change>` describes, and 1 minute passes.

**Test data:**

| Partition | `<shop change>` | `<expected drawer>` |
| --- | --- | --- |
| Two lines repriced | `<product A>` and `<product B>` each repriced. | One notice naming both lines and their new prices. |
| One line filled short | 1 left of `<product A>`. | Checkout refused, naming `<product A>` and 1 the shop would fill. |

**Steps:**

1. Click Proceed to Checkout.
2. Read the drawer.

**Expected Results:**

* Step 1 does not leave for the shop's checkout.
* Step 2 stays open and shows `<expected drawer>`.
* Each line shows the shop's current answer.

<!-- trace:case id=g10.store-cart.TC-mhq rev=1 -->
#### g10.store-cart.US4-TC10: A declined payment places no order and keeps the cart for another try

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart.US4

**Pre-conditions:**

* customer(`<actor state>`) pressed Proceed to Checkout on `<product A>` and is on Shopify's page.

**Test data:**

| Partition | `<actor state>` |
| --- | --- |
| Guest | signed out |
| Member | signed-in member |

**Steps:**

1. Pay with the payment provider's published test card that is declined.
2. Read Shopify's page.
3. Return to `<store listing url>` and open Cart.
4. Click Proceed to Checkout and pay with `<test card>`.
5. Read the orders for this purchase.

**Expected Results:**

* Step 2 refuses the payment and places no order.
* ❓ Step 3 still holds `<product A>`.
* ❓ Step 4 places the order.
* ❓ Step 5 holds exactly one order for `<product A>`.
