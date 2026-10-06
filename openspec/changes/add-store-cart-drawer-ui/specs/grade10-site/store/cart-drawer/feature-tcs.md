# grade10-site/store/cart-drawer Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-29, tcs-rules r3.0

## grade10-site-store-cart-drawer-US01: Signed-in collector opens the current cart over the page

**As a** signed-in collector,
**I want** my current cart to open over the page I am on with current facts,
**so that** I can review what the shop can sell without losing my place.

<!-- trace:case id=g10.store-cart-drawer.TC-5he rev=1 covers=g10.store-cart-drawer.SC-omn,g10.store-cart-drawer.SC-za5,g10.store-cart-drawer.SC-a52,g10.store-cart-drawer.SC-tv2,g10.store-cart-drawer.SC-ti9,g10.store-cart-drawer.SC-0og,g10.store-cart-drawer.SC-lrr,g10.store-cart-drawer.SC-8ln,g10.store-cart-drawer.SC-33u -->
### grade10-site-store-cart-drawer-US01-TC01-1: Drawer reviews the signed-in member cart

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-01

**Pre-conditions:**

* The current member cart and <other member cart> hold different available lines.
* A signed-in collector is on a Store surface.

**Test data:**

| `<expected cart>` | `<other cart>` |
| --- | --- |
| Current member cart | Another member cart |

**Steps:**

1. Activate **Cart** in the header.
2. Wait for the status-and-price read to finish.

**Expected Results:**

* One drawer opens over the current Store surface without changing its address.
* The drawer reviews and shows <expected cart>.
* No line belonging only to <other cart> is shown.

<!-- trace:case id=g10.store-cart-drawer.TC-unv rev=1 covers=g10.store-cart-drawer.SC-omn,g10.store-cart-drawer.SC-za5,g10.store-cart-drawer.SC-a52,g10.store-cart-drawer.SC-tv2,g10.store-cart-drawer.SC-ti9,g10.store-cart-drawer.SC-0og,g10.store-cart-drawer.SC-lrr,g10.store-cart-drawer.SC-8ln,g10.store-cart-drawer.SC-33u -->
### grade10-site-store-cart-drawer-US01-TC02-1: Pending read withholds stale facts and a later open reads again

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
* **Trace:** grade10-site-store-cart-drawer-US-01

**Pre-conditions:**

* The current cart holds <line> at a recorded price different from <current price>.
* The first status-and-price read can be held in flight.
* A signed-in collector is on a Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| `<line>` | An available cart line recorded at 220000 HKD minor units |
| `<current price>` | 249000 HKD minor units |

**Steps:**

1. Activate **Cart** in the header and hold the read in flight.
2. Inspect the line, subtotal, estimated total and Checkout.
3. Answer the read with <current price>.
4. Close the drawer and open it again.

**Expected Results:**

* While the read is in flight, loading shapes replace the recorded price and totals, and Checkout is unavailable.
* After step 3, <line> and the subtotal use <current price> as a count of minor units paired with HKD.
* Step 4 starts a second status-and-price read rather than reusing the first answer as current.

<!-- trace:case id=g10.store-cart-drawer.TC-i6a rev=1 covers=g10.store-cart-drawer.SC-omn,g10.store-cart-drawer.SC-za5,g10.store-cart-drawer.SC-a52,g10.store-cart-drawer.SC-tv2,g10.store-cart-drawer.SC-ti9,g10.store-cart-drawer.SC-0og,g10.store-cart-drawer.SC-lrr,g10.store-cart-drawer.SC-8ln,g10.store-cart-drawer.SC-33u -->
### grade10-site-store-cart-drawer-US01-TC03-1: Failed read reports once and reopening retries

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-01

**Pre-conditions:**

* The current cart holds a line with a recorded price.
* The first status-and-price read fails.
* A signed-in collector is on a Store surface.

**Steps:**

1. Activate **Cart** in the header.
2. Let the failed result be observed through repeated renders of the open drawer.
3. Close the drawer.
4. Make the read available and open the drawer again.

**Expected Results:**

* The first open shows exactly one notice that the cart could not be checked.
* The recorded price and availability are not presented as current, and Checkout remains unavailable.
* Step 4 starts a new read and shows reviewed facts when it succeeds.

<!-- trace:case id=g10.store-cart-drawer.TC-v2u rev=1 covers=g10.store-cart-drawer.SC-omn,g10.store-cart-drawer.SC-za5,g10.store-cart-drawer.SC-a52,g10.store-cart-drawer.SC-tv2,g10.store-cart-drawer.SC-ti9,g10.store-cart-drawer.SC-0og,g10.store-cart-drawer.SC-lrr,g10.store-cart-drawer.SC-8ln,g10.store-cart-drawer.SC-33u -->
### grade10-site-store-cart-drawer-US01-TC04-1: Summary makes no unsupported price claim

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
* **Trace:** grade10-site-store-cart-drawer-US-01

**Pre-conditions:**

* The current cart holds one available line and one sold-out line.
* The cart read supplies current line facts but no image or applied quote.
* A signed-in collector is on a Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| Available line | Quantity 2 at 125000 HKD minor units each |
| Sold-out line | Quantity 1 at 300000 HKD minor units |
| Reviewed subtotal | 250000 HKD minor units |

**Steps:**

1. Open the cart drawer and wait for the read to finish.
2. Inspect both lines and the footer.
3. Activate the closed promo-code row.

**Expected Results:**

* Both retained lines show their current title, confirmed quantity, current price and status.
* The subtotal is 250000 HKD minor units, excluding the sold-out line, and estimated total is the same amount.
* Shipping reads `Calculated at checkout`, no product image or points control appears, and no promotion or discount is applied.
* Step 3 accepts no code and leaves the summary unchanged.

<!-- trace:case id=g10.store-cart-drawer.TC-gd8 rev=1 covers=g10.store-cart-drawer.SC-omn,g10.store-cart-drawer.SC-za5,g10.store-cart-drawer.SC-a52,g10.store-cart-drawer.SC-tv2,g10.store-cart-drawer.SC-ti9,g10.store-cart-drawer.SC-0og,g10.store-cart-drawer.SC-lrr,g10.store-cart-drawer.SC-8ln,g10.store-cart-drawer.SC-33u -->
### grade10-site-store-cart-drawer-US01-TC05-1: Opening and closing preserve the current surface

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-01

**Pre-conditions:**

* A signed-in collector is on a Store surface at <surface address>.

**Test data:**

| Field | Value |
| --- | --- |
| `<surface address>` | The address of the Store surface beneath the drawer |

**Steps:**

1. Record <surface address>.
2. Activate **Cart** in the header.
3. Close the cart drawer.
4. Check the current address.

**Expected Results:**

* The cart drawer opens over <surface address> without navigation.
* After step 3, the collector remains at <surface address>.

---

## grade10-site-store-cart-drawer-US02: Signed-in collector edits the reviewed cart

**As a** signed-in collector,
**I want** to change or remove lines after the shop checks them,
**so that** the cart I continue with contains what I intend to buy.

<!-- trace:case id=g10.store-cart-drawer.TC-qhe rev=1 covers=g10.store-cart-drawer.SC-5bv,g10.store-cart-drawer.SC-7rs -->
### grade10-site-store-cart-drawer-US02-TC01-1: Quantity and removal update the opened cart

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
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-02

**Pre-conditions:**

* The current member cart holds <line> at quantity 1.
* The cart read confirms <line> as available.
* A signed-in collector is on a Store surface.

**Test data:**

| `<action>` | `<expected result>` |
| --- | --- |
| Increase quantity to 2 | The current member cart holds <line> at quantity 2 |
| Remove the line | The current member cart no longer holds <line> |

**Steps:**

1. Open the cart drawer and wait for the read to finish.
2. Perform <action> on <line>.
3. Read the current member cart again.

**Expected Results:**

* <expected result>.
* No other member cart is changed.

<!-- trace:case id=g10.store-cart-drawer.TC-biv rev=1 covers=g10.store-cart-drawer.SC-5bv,g10.store-cart-drawer.SC-7rs -->
### grade10-site-store-cart-drawer-US02-TC02-1: Delisted lines are removed once with one notice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-02

**Pre-conditions:**

* The current member cart holds two unavailable lines and one available line.
* A signed-in collector is on a Store surface.

**Steps:**

1. Open the cart drawer and finish the status-and-price read.
2. Let the open drawer render again without closing it.
3. Read the current member cart and the notices shown during that open.

**Expected Results:**

* Each unavailable line is removed exactly once and is never shown as a sold-out row.
* The available line remains.
* Exactly one unavailable-items notice appears during that open.

---

## grade10-site-store-cart-drawer-US03: Signed-in collector continues to a product from the cart drawer

**As a** signed-in collector,
**I want** the cart to take me to a product I select from it,
**so that** I can continue the shopping path I chose.

<!-- trace:case id=g10.store-cart-drawer.TC-hte rev=1 covers=g10.store-cart-drawer.SC-oqn -->
### grade10-site-store-cart-drawer-US03-TC01-1: Reviewed line opens its existing product address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-03

**Pre-conditions:**

* The current cart holds <product>, and its read has succeeded.
* The drawer is open over a Store surface other than <product>'s address.

**Steps:**

1. Activate <product>'s cart line.

**Expected Results:**

* The drawer closes.
* <product>'s existing Store product address opens.

---


## grade10-site-store-cart-drawer-US04: Signed-in collector reads tender choices for the reviewed basket

**As a** signed-in collector,
**I want** to see which promo codes and how many points the reviewed basket can take,
**so that** I can understand my available benefits before continuing to checkout.

<!-- trace:case id=g10.store-cart-drawer.TC-8h2 rev=1 covers=g10.store-cart-drawer.SC-bim,g10.store-cart-drawer.SC-44a,g10.store-cart-drawer.SC-3yf -->
### grade10-site-store-cart-drawer-US04-TC01-1: Coupon answers remain unselected and current

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-04

**Pre-conditions:**

* A signed-in collector's cart review has succeeded.
* The member holds one applicable promo code and one inapplicable code.
* The cart has no selected code or points.

**Steps:**

1. Open the cart drawer and wait for the review and promo-code read to finish.
2. Open the promo-code view.

**Expected Results:**

* Both current codes are shown.
* The applicable code is shown as usable and remains unselected.
* The inapplicable code shows the answer explaining why it cannot be used.
* No promo discount is shown in the drawer summary.

<!-- trace:case id=g10.store-cart-drawer.TC-4fy rev=1 covers=g10.store-cart-drawer.SC-bim,g10.store-cart-drawer.SC-44a,g10.store-cart-drawer.SC-3yf -->
### grade10-site-store-cart-drawer-US04-TC02-1: Points ceiling does not change the reviewed total

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-04

**Pre-conditions:**

* A signed-in collector's cart review has succeeded.
* The points read quotes a balance and a maximum for the reviewed goods.
* The cart has no selected code or points.

**Steps:**

1. Open the cart drawer and wait for the review and points read to finish.
2. Open the points view.

**Expected Results:**

* The balance, conversion rate, and maximum points and amount are shown.
* Opening the points view applies no points.
* The subtotal and estimated total remain the reviewed subtotal.

<!-- trace:case id=g10.store-cart-drawer.TC-it0 rev=2 covers=g10.store-cart-drawer.SC-bim,g10.store-cart-drawer.SC-44a,g10.store-cart-drawer.SC-3yf -->
### grade10-site-store-cart-drawer-US04-TC03-2: Unresolved reviews receive no tender facts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-04

**Pre-conditions:**

* The signed-in collector is on a Store surface in <review state>.

**Test data:**

| `<review state>` |
| --- |
| Signed-in collector with a pending cart review |
| Signed-in collector with a failed cart review |

**Steps:**

1. Open the cart drawer.
2. Wait for the drawer to render <review state>.

**Expected Results:**

* Member-only promo and points facts are not shown.
* No member-only tender read is required to render the cart review state.
* Points actions remain unavailable until a usable quote answers.

<!-- trace:case id=g10.store-cart-drawer.TC-q9l rev=1 covers=g10.store-cart-drawer.SC-bim,g10.store-cart-drawer.SC-44a,g10.store-cart-drawer.SC-3yf -->
### grade10-site-store-cart-drawer-US04-TC04-1: Latest basket replaces earlier tender facts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-04

**Pre-conditions:**

* A signed-in collector's drawer has shown promo and points facts for a reviewed basket.

**Test data:**

| `<refresh trigger>` |
| --- |
| The cart changes |
| The drawer closes and opens again |

**Steps:**

1. Perform <refresh trigger>.
2. Wait for the next successful cart review and tender reads.

**Expected Results:**

* The previous tender facts are not presented as current.
* The drawer shows only the successful reads for the latest reviewed basket.


---

## grade10-site-store-cart-drawer-US05: Signed-in collector chooses points before checkout

**As a** signed-in collector,
**I want** to apply, maximise or remove points against the reviewed cart and keep that choice at checkout,
**so that** I can see the accepted saving before leaving the page.

<!-- trace:case id=g10.store-cart-drawer.TC-s5l rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC01-1: Apply carries accepted points and the existing code to checkout

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
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* A usable quote supplies the live balance, rate and ceiling.
* The cart already holds an accepted code.

**Test data:**

| Field | Value |
| --- | --- |
| <points request> | A positive whole amount below the quoted ceiling |

**Steps:**

1. Open the points view.
2. Enter <points request> and click Apply.
3. Wait for the accepted quote.
4. Click Checkout.

**Expected Results:**

* The drawer shows accepted points and their quoted saving.
* The existing code and its accepted discount remain.
* Estimated total equals goods minus accepted code and points.
* Checkout retains the accepted code and points.
* Checkout reads current figures against the same cart.

<!-- trace:case id=g10.store-cart-drawer.TC-an9 rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC02-1: Use max applies the quoted ceiling after the code

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* A usable quote supplies <ceiling state>.

**Test data:**

| `<ceiling state>` |
| --- |
| Available points balance is less than qualifying goods after code |
| Qualifying goods after code are less than available points balance |

**Steps:**

1. Open the points view.
2. Click Use max.
3. Wait for the accepted quote.

**Expected Results:**

* Applied points equal the accepted ceiling for this basket.
* The ceiling accounts for balance, qualifying goods and existing code.
* The summary uses the accepted saving and estimated total.

<!-- trace:case id=g10.store-cart-drawer.TC-vix rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC03-1: Apply above the ceiling keeps only accepted points

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
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* A usable quote supplies a positive ceiling.

**Test data:**

| Field | Value |
| --- | --- |
| <points request> | One whole point above the current quoted ceiling |

**Steps:**

1. Enter <points request>.
2. Click Apply and wait for the accepted quote.

**Expected Results:**

* The accepted points are trimmed to the quoted ceiling.
* The summary shows only the accepted saving.
* Checkout carries the accepted choice.

<!-- trace:case id=g10.store-cart-drawer.TC-gtt rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC04-1: Remove clears points and preserves the existing code

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* The current cart holds accepted points and a code.

**Steps:**

1. Click Remove in the applied points section.
2. Wait for the accepted quote.
3. Click Checkout.

**Expected Results:**

* No points remain applied in the drawer or checkout.
* The existing code remains selected.
* The summary retains the accepted code discount.
* Estimated total excludes a points saving.

<!-- trace:case id=g10.store-cart-drawer.TC-zyo rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC05-1: Pending changes block duplicate actions and Checkout

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* The current basket has an accepted choice and total.
* The response to <points action> can be held in flight.

**Test data:**

| `<points action>` |
| --- |
| Apply a new points amount |
| Use max |
| Remove applied points |

**Steps:**

1. Perform <points action> and hold its response.
2. Inspect points controls and Checkout.
3. Attempt the same action again.
4. Complete the change with a usable quote.

**Expected Results:**

* Pending controls prevent duplicate tender changes.
* Checkout remains disabled while the change is unresolved.
* No unaccepted saving replaces the accepted total.
* The completed summary uses the accepted quote.

<!-- trace:case id=g10.store-cart-drawer.TC-ncq rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC06-1: Failed changes preserve the accepted same-basket choice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* The basket has an accepted points choice and total.
* The basket remains unchanged.
* The response to <points action> fails.

**Test data:**

| `<points action>` |
| --- |
| Apply a different points amount |
| Use max |
| Remove applied points |

**Steps:**

1. Perform <points action>.
2. Wait for the failure.
3. Inspect the error, applied choice and total.

**Expected Results:**

* A localized error explains the unsuccessful change.
* The last accepted same-basket points choice remains.
* The last accepted same-basket total remains.
* The existing code remains selected.

<!-- trace:case id=g10.store-cart-drawer.TC-n5t rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC07-1: A changed basket rejects an earlier points result

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
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* A points change against the original basket is pending.

**Steps:**

1. Change a cart line before the points response arrives.
2. Wait for the changed basket review and quote.
3. Deliver the earlier points response.
4. Inspect the points choice and summary.

**Expected Results:**

* The changed basket is reviewed and quoted again.
* Old-basket saving and total are not shown as current.
* Checkout stays unavailable until the current basket is resolved.
* The earlier response cannot replace the current basket summary.

<!-- trace:case id=g10.store-cart-drawer.TC-vxl rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC08-1: Reload and another device recover the accepted choice

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* The member has accepted points and a code in the drawer.

**Test data:**

| `<return route>` |
| --- |
| Reload the current page |
| Sign in as the same member on another device |

**Steps:**

1. Perform <return route>.
2. Open the drawer and wait for current review and quote.
3. Open Checkout.

**Expected Results:**

* The accepted code and points choice follow the member cart.
* Displayed figures come from a fresh quote.
* Checkout receives the same accepted choice.

<!-- trace:case id=g10.store-cart-drawer.TC-js3 rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC09-1: Unavailable points cannot be applied

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* The programme or quote is in <points state>.

**Test data:**

| `<points state>` |
| --- |
| Member is outside the programme |
| Programme has not answered |
| No usable quote is available |
| Available points balance is zero |

**Steps:**

1. Inspect the points section.
2. Attempt to apply points if a control is shown.

**Expected Results:**

* No enabled points action is available.
* No unaccepted points saving appears.

<!-- trace:case id=g10.store-cart-drawer.TC-6uw rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC10-1: A code covering all qualifying goods leaves no points to apply

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
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in programme member has opened a successfully reviewed drawer.
* The accepted code covers all qualifying goods.
* The programme has answered with the member balance.

**Steps:**

1. Open the points section.
2. Inspect the amount field and points actions.

**Expected Results:**

* The field explains that points have nothing left to pay.
* No positive points saving is applied.
* The accepted code remains selected.

<!-- trace:case id=g10.store-cart-drawer.TC-75a rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC11-1: Invalid amounts do not mutate points

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in member has a reviewed basket and accepted tender choice.

**Steps:**

1. Try empty, zero, negative, fractional, non-numeric and non-finite amounts.

**Expected Results:**

* No invalid amount is persisted; the accepted choice and total remain.

<!-- trace:case id=g10.store-cart-drawer.TC-lka rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC12-1: Closing or changing member rejects stale results

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in member has a reviewed basket and accepted tender choice.

**Steps:**

1. Start a points operation; close the drawer or change member before its response. Reopen after the response.

**Expected Results:**

* No stale result updates the view or starts a stale write. A write already sent remains scoped to its member; reopening reads current persisted intent.

<!-- trace:case id=g10.store-cart-drawer.TC-t22 rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-cui,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### grade10-site-store-cart-drawer-US05-TC13-1: Persistence success followed by refresh failure stays unresolved

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-05

**Pre-conditions:**

* A signed-in member has a reviewed basket and accepted tender choice.

**Steps:**

1. Save a points choice successfully, then fail the next basket refresh.

**Expected Results:**

* The UI does not claim rollback of the successful write. Stale totals remain unavailable and Checkout waits for authoritative reread.

---

## grade10-site-store-cart-drawer-US06: Signed-in collector completes checkout without leaving the drawer

**As a** signed-in collector,
**I want** to pay for my reviewed cart from the drawer itself,
**so that** I reach Shopify's hosted invoice without a second page.

<!-- trace:case id=g10.store-cart-drawer.TC-qvw rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC01-1: Proceed to Checkout creates the session from the reviewed basket and reaches Shopify's hosted invoice

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in collector has a successfully reviewed drawer holding an available line, an accepted code and accepted points.
* The collector's identity is verified, or the reviewed basket is under HKD 120,000.

**Steps:**

1. Press Proceed to Checkout.
2. Wait for the redirect.

**Expected Results:**

* A checkout session is created carrying the reviewed lines and the accepted code and points; no separate checkout-open read happens first.
* The drawer shows a redirecting state until the collector's browser reaches Shopify's hosted invoice for that session.

<!-- trace:case id=g10.store-cart-drawer.TC-28w rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC02-1: An unverified member's basket at the HKD 120,000 bar blocks Proceed to Checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in member whose identity is not verified has a successfully reviewed drawer holding a basket read at or above HKD 120,000 (gross goods, before any code or points).

**Steps:**

1. Inspect the drawer's checkout area.
2. Attempt to press Proceed to Checkout.

**Expected Results:**

* The drawer shows the same threshold message and account-page link that `CheckoutPage`'s verification panel shows today, in place of an available Proceed to Checkout.
* No checkout session is created.
* The link opens the member's account page; the drawer itself performs no verification.

<!-- trace:case id=g10.store-cart-drawer.TC-x28 rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC03-1: A basket under the bar, or a verified member's basket at or above it, proceeds without the gate

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in collector is in `<state>` with a successfully reviewed drawer eligible to check out.

**Test data:**

| `<state>` |
| --- |
| Identity not verified, basket read (gross goods) under HKD 120,000 |
| Identity verified, basket read (gross goods) at or above HKD 120,000 |

**Steps:**

1. Press Proceed to Checkout.

**Expected Results:**

* No verification message or account-page link is shown.
* A checkout session is created and the collector reaches Shopify's hosted invoice.

<!-- trace:case id=g10.store-cart-drawer.TC-uvd rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC04-1: The drawer holds a redirecting state until Shopify's hosted invoice is ready before leaving

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in collector has a successfully reviewed drawer eligible to check out.
* The checkout-creation response can be held in flight.

**Steps:**

1. Press Proceed to Checkout and hold the response.
2. Inspect the drawer while the response is pending.
3. Deliver the response and wait for the redirect.

**Expected Results:**

* While the response is pending, the drawer shows a redirecting state rather than closing or leaving the page.
* The collector's browser leaves for Shopify's hosted invoice only once the response arrives successfully.

<!-- trace:case id=g10.store-cart-drawer.TC-kfu rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC05-1: A changed line found at creation is named in the drawer, not on a separate page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in collector has a successfully reviewed drawer holding `<line>`.
* `<line>` changes price, stock or is delisted between the drawer's last read and the checkout-creation response.

**Steps:**

1. Press Proceed to Checkout.
2. Wait for the response naming the changed line.

**Expected Results:**

* The drawer names `<line>` as the reason Proceed to Checkout did not complete, in the drawer itself.
* No checkout session is created for the stale basket.
* The collector can review the current basket and press Proceed to Checkout again without leaving the drawer.

<!-- trace:case id=g10.store-cart-drawer.TC-kzn rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC06-1: A provider refusal is named in the drawer, not on a separate page

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in collector has a successfully reviewed drawer eligible to check out.
* Shopify refuses the checkout-creation request.

**Steps:**

1. Press Proceed to Checkout.
2. Wait for the refusal.

**Expected Results:**

* The drawer shows the provider's refusal in place of redirecting, without navigating to a separate page.
* No order or checkout session is left behind from the refused attempt.
* The reviewed basket and accepted tender remain as they were before the press.

<!-- trace:case id=g10.store-cart-drawer.TC-ool rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC07-1: A second press before the first resolves returns the same checkout, not a second one

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in collector has a successfully reviewed drawer eligible to check out.
* The first Proceed to Checkout request can be held in flight.

**Steps:**

1. Press Proceed to Checkout and hold the response.
2. Press Proceed to Checkout again before the first response arrives.
3. Let both responses resolve.

**Expected Results:**

* Exactly one checkout session is created for the reviewed basket.
* The collector reaches the same hosted invoice regardless of which response the drawer acts on.

**Note:** the idempotency guarantee this case exercises is `add-shopify-checkout-integration`'s (a server-side, cross-request fact), not this capability's own; **Covered at `grade10-site/store/checkout`** once that change's server-side requirement lands.

<!-- trace:case id=g10.store-cart-drawer.TC-a94 rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC08-1: The removed /checkout address no longer opens a checkout page

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-06

**Pre-conditions:**

* A signed-in collector has a browser session on the Store site.

**Steps:**

1. Navigate directly to the site's former `/checkout` address.

**Expected Results:**

* No checkout page opens at that address.
* Checkout is reachable only from Proceed to Checkout in the cart drawer.

## Reconciliation

**Run:** 2026-09-29. Independent scenario and blind test-design readings,
carried over from `move-checkout-into-cart-drawer` (folded here because
`grade10-site/store/cart-drawer` has no durable spec yet and this change is
its one owner) and reconciled together with the readings below. The
scenario reader saw the durable-equivalent baseline (this file's own prior
`spec.md`), the journeys, `decisions.md`, and the linked PRDs; the blind
suite reader saw only Purpose, Feature set, journeys, `decisions.md`, the
PRDs, the prior suite (for id continuity) and the domain suite - never a
`## Requirements` section or a scenario anywhere.

- **Uncovered anchor, folded into spec** - `US06-TC03-1` tested a boundary
  the scenario reading had not written: a verified member at or above the
  bar, and any member under it, proceeding without the gate. Folded as
  `grade10-site-store-cart-drawer-SC-32` and `grade10-site-store-cart-
  drawer-SC-33`.
- **Raised, escalated** - `US06-TC02-1`'s pre-condition assumption (the bar
  read against gross goods, not the total after code and points) and
  whether the gate replaces Checkout or sits disabled beside it were both
  raised as open questions. Landed as `decisions.md` Q6 and Q7 in
  `move-checkout-into-cart-drawer` (folded into this file per that
  change's own decisions record).
- **Joined** - `US03-TC01-1` ↔ `grade10-site-store-cart-drawer-SC-13`;
  `US06-TC01-1` and `US06-TC04-1` ↔ `grade10-site-store-cart-drawer-SC-15`;
  `US06-TC02-1` ↔ `grade10-site-store-cart-drawer-SC-30`; `US06-TC05-1` ↔
  `grade10-site-store-cart-drawer-SC-28`; `US06-TC06-1` ↔ `grade10-site-
  store-cart-drawer-SC-29`.
- **Retired** - the former `US03-TC03-1` ("Checkout opens the existing
  checkout surface") stated behaviour this change removes; replaced by the
  `US06` section above. This capability has not archived, so nothing durable
  names the retired case; no tombstone is owed.
- **Out of this capability's remit** - `US06-TC07-1` tests checkout-intent
  idempotency across a repeated press, which is `add-shopify-checkout-
  integration`'s Q6/Q13 (a server-side, cross-request fact), not a
  requirement this capability states on its own - left uncovered here,
  verified once that change's server-side requirement lands. `US06-TC08-1`
  tests that the removed `/checkout` address no longer serves a page, an
  infrastructure fact this change's proposal states under Impact rather than
  a capability behaviour a spec scenario names - verified by a routing-level
  check, not a scenario here.
- **Uncovered anchor, out of suite** - `grade10-site-store-cart-drawer-SC-31`
  (verifying itself happens on the account page, on the collector's own
  consent) is reached by no case in this suite, since the blind pass never
  reads `grade10-site/store/account-identity`'s own journeys. Out of suite:
  verified in that capability's own `feature-tcs.md`; the drawer-side half of
  the same walk (the link appearing and opening the account page) is
  exercised by `US06-TC02-1`.
- **No contradictions** between the two readings.

### Earlier Reconciliation (2026-09-22, points integration)

**Run:** 2026-09-22. Independent scenario and test-design readings used the
same points anchors. The blind reader received only `/tmp/cart-points-blind`:
purpose, feature set, journeys, decisions, points design, linked PRD and the
previous suite without reconciliation. Requirements, archives and tech design
were excluded. The coordinator supplied dispositions after both readings.

- **Preserved** — the prior US01–US03 cases and their original reconciliation below.
- **Aligned** — Apply, Use max, Remove, persistence and checkout map to
  `grade10-site-store-cart-drawer-SC-20`, `grade10-site-store-cart-drawer-SC-21`
  and `grade10-site-store-cart-drawer-SC-27`.
- **Boundary** — invalid input, zero and ceiling cases land in
  `grade10-site-store-cart-drawer-SC-22` and `grade10-site-store-cart-drawer-SC-26`.
- **Failure** — pending, failed, refreshed and stale operations land in
  `grade10-site-store-cart-drawer-SC-23` through `grade10-site-store-cart-drawer-SC-25`.
- **Out of suite:** `grade10-site-store-cart-drawer-SC-17` visual parity is
  verified by Group 5.4's Storybook comparison, keyboard and locale checks.

#### Earlier Reconciliation (2026-09-18, member cart)


**Run:** 2026-09-18 · the blind suite and the change's scenario reading were reconciled after the member-cart decision.

| Spec scenario | Suite coverage |
| --- | --- |
| grade10-site-store-cart-drawer-SC-01, SC-02 | US01-TC05-1 |
| grade10-site-store-cart-drawer-SC-04 | US01-TC01-1 |
| grade10-site-store-cart-drawer-SC-05, SC-06 | US01-TC02-1 |
| grade10-site-store-cart-drawer-SC-07, SC-08 | US01-TC03-1 |
| grade10-site-store-cart-drawer-SC-09, SC-10 | US01-TC04-1 |
| grade10-site-store-cart-drawer-SC-11 | US02-TC01-1 |
| grade10-site-store-cart-drawer-SC-12 | US02-TC02-1 |
| grade10-site-store-cart-drawer-SC-13 | US03-TC01-1 |
| grade10-site-store-cart-drawer-SC-15 | US03-TC03-1 |
| grade10-site-store-cart-drawer-SC-16 | US04-TC01-1 |
| grade10-site-store-cart-drawer-SC-17 | Group 5.4 visual verification; US04-TC02-1 retains opening-without-mutation coverage |
| grade10-site-store-cart-drawer-SC-18 | US04-TC03-2 |
| grade10-site-store-cart-drawer-SC-19 | US04-TC04-1 |
| Uncovered anchors | none |
| Contradicted readings | none |
