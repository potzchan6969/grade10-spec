# grade10-site/store/cart-validation Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## cart-validation-US1: Collector opens the cart and learns what moved

**As a** collector,
**I want** the cart to tell me, as it opens, which lines sold out, shrank, left
the store, or changed price,
**so that** I fix my cart before I try to pay rather than being refused at
checkout for something the store already knew.

### cart-validation-US1-TC1-1: Cart re-reads every line as it opens

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart holds two lines; <the shop read endpoint> delayed 5 seconds by
network manipulation.

**Steps:**

1. Navigate to <grade10 store url>.
2. Open the cart and watch the network traffic.
3. Check the lines and the checkout button during the delay.
4. Wait for the read to return and check the lines again.

**Expected Results:**

* Step 2 issues a read for every line the cart holds.
* During the delay the lines show as loading, not as confirmed, and the
  checkout button is disabled.
* After the read each line shows its current availability and price.

### cart-validation-US1-TC2-1: Browse cache does not answer for a cart line

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart holds <a variant>; the shop then sets its inventory to 0 and stops
selling it when out of stock, and the listing tile still reads available from
the browse cache.

**Steps:**

1. Navigate to <grade10 browse listing url> and check that the tile still
   reads available.
2. Open the cart and check the line.

**Expected Results:**

* Line reads out of stock.

### cart-validation-US1-TC3-1: Line above the remaining count is reduced and marked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart holds 5 of <a variant>; the shop then sets its inventory count to 2.

**Test data:**

| Field | Value |
| --- | --- |
| Requested | 5 |
| Count | 2 |

**Steps:**

1. Open the cart.
2. Check the line's quantity and marking.

**Expected Results:**

* Line quantity is 2.
* Line is marked adjusted and says the quantity changed.

### cart-validation-US1-TC4-1: Sold-out line stays for the collector to remove

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart holds 5 of <a variant>; the shop then sets its inventory to 0 and
stops selling it when out of stock.

**Steps:**

1. Open the cart.
2. Check the line.
3. Click the line's remove control.

**Expected Results:**

* Line is still shown, marked out of stock, with its quantity not silently
  reduced to zero.
* Step 3 removes the line.

### cart-validation-US1-TC5-1: Line is never grown and a fillable line is untouched

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart holds 2 of <a variant whose count rose to 40> and 2 of <a variant
counted at 30>.

**Test data:**

| Line | Requested | Count |
| --- | --- | --- |
| <a variant whose count rose to 40> | 2 | 40 |
| <a variant counted at 30> | 2 | 30 |

**Steps:**

1. Open the cart.
2. Check both lines.

**Expected Results:**

* Both lines still request 2.
* Neither line carries an adjustment or a warning.

### cart-validation-US1-TC6-1: Withdrawn product is told apart from sold out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart holds <a variant the shop then stopped selling> and <a product the
shop then unpublished from the store's sales channel>, both added while on
sale.

**Steps:**

1. Open the cart.
2. Check the marking on each line.

**Expected Results:**

* The sold-out line reads out of stock.
* The unpublished product's line reads unavailable, not out of stock.
* The two markings differ.

### cart-validation-US1-TC7-1: Changed price is shown and disclosed, up or down

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart holds two lines added at the prices in the table; the shop then
changes each variant's price to the current value.

**Test data:**

| Line | Showing | Current |
| --- | --- | --- |
| <a variant repriced upward> | 10500 minor units HKD | 12300 minor units HKD |
| <a variant repriced downward> | 12300 minor units HKD | 10500 minor units HKD |

**Steps:**

1. Open the cart.
2. Check each line's price and marking.
3. Check the cart total.

**Expected Results:**

* Each line shows its current price.
* Each line says the price changed, the rise as plainly as the fall.
* Total is computed from the current prices only.

### cart-validation-US1-TC8-1: Disclosed price carries to checkout without a second notice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-01

**Pre-conditions:**
The cart was opened and a line was repriced to 12300 minor units HKD and
disclosed; the shop's price is unchanged since.

**Steps:**

1. Click the checkout button in the cart.
2. Check the line.

**Expected Results:**

* Line is confirmed at 12300 minor units HKD.
* No price change is reported again.

---

## cart-validation-US2: Collector offers the cart for checkout

**As a** collector,
**I want** the store to check every line once more as I check out and to name
every line that moved,
**so that** I reach the shop's payment page only with a cart it can fill, and
when I cannot, I know exactly what to fix.

### cart-validation-US2-TC1-1: Checkout re-reads every line before an order exists

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-02

**Pre-conditions:**
The cart holds two lines the shop offers, each below its inventory count.

**Steps:**

1. Open the cart.
2. Click the checkout button and watch the network traffic.

**Expected Results:**

* A read of every line goes out before any checkout order is created.
* The browser then goes to <the shop's checkout url>.

### cart-validation-US2-TC2-1: One moved line blocks the handoff until it is resolved

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-02

**Pre-conditions:**
The cart holds three lines and was opened with all three confirmed; the shop
then sets one variant's inventory to 0 and stops selling it when out of
stock.

**Steps:**

1. Click the checkout button in the cart.
2. Check the cart.
3. Click the remove control on the identified line.
4. Click the checkout button again.

**Expected Results:**

* Step 1 creates no checkout order; no order appears in <the store's order
  list>.
* Step 2 shows the cart with that one line identified as out of stock and the
  other two untouched.
* Step 4 creates the checkout order from the two remaining lines and the
  browser goes to <the shop's checkout url>.

### cart-validation-US2-TC3-1: Every contradicted line is named at once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-02

**Pre-conditions:**
The cart was opened with every line confirmed; the shop then unpublishes one
line's product from the store's sales channel and changes another line's
price.

**Steps:**

1. Click the checkout button in the cart.
2. Check the cart.

**Expected Results:**

* No checkout order is created.
* Both lines are identified, one as unavailable and one as repriced, in the
  same pass.

### cart-validation-US2-TC4-1: Open-time read does not carry a later checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-02

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

### cart-validation-US2-TC5-1: Supplied price decides nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** cart-validation-US-02

**Pre-conditions:**
A checkout request is prepared for <a variant> carrying a price lower than the
shop's current price.

**Test data:**

| Field | Value |
| --- | --- |
| Price in the request | 100 minor units HKD |
| Shop's current price | 12300 minor units HKD |

**Steps:**

1. Send the request to <the store checkout endpoint>.
2. Read the amount on the checkout order it creates.

**Expected Results:**

* The amount is 12300 minor units HKD, the store's own re-read price.
* The request's price is not used.

---

## cart-validation-US3: Collector meets the shop's own refusal

**As a** collector,
**I want** a refusal from the shop, or a check the store could not finish, told
to me with the line named,
**so that** a cart that passed the store's read and still failed is mine to
resolve, not a dead end.

### cart-validation-US3-TC1-1: Shop refuses a line the store's read had confirmed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-03

**Pre-conditions:**
The cart holds two lines the store's read confirms; <the shop's cart endpoint>
is mocked to refuse one of them as no longer sellable.

**Steps:**

1. Click the checkout button in the cart.
2. Check the message and the cart.

**Expected Results:**

* The message names the refused line.
* The message is not a generic failure and does not blame the collector.
* The other line is still in the cart, untouched.

### cart-validation-US3-TC2-1: Shop fills a line short

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-03

**Pre-conditions:**
The cart holds 3 of <a variant> the store's read confirms; <the shop's cart
endpoint> is mocked to accept only 2 of it.

**Test data:**

| Field | Value |
| --- | --- |
| Requested | 3 |
| Shop accepts | 2 |

**Steps:**

1. Click the checkout button in the cart.
2. Check the message and <the store's order list>.

**Expected Results:**

* No checkout order is created.
* The message names the line and says the shop would fill 2.

### cart-validation-US3-TC3-1: Read cannot be completed

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** cart-validation-US-03

**Pre-conditions:**
The cart holds two lines; <the shop read endpoint> is mocked to return a
`500 Internal Server Error`.

**Steps:**

1. Open the cart.
2. Click the checkout button.
3. Check the message, the lines and <the store's order list>.

**Expected Results:**

* No checkout order is created.
* The message says the check could not be completed.
* No line shows an availability or price as current.
