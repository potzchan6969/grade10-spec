# grade10-site/store/cart-drawer Test Cases

**Status:** pending-review · 0/43
**Drafts styled:** 2026-10-13, tcs-rules r5

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

<!-- trace:case id=g10.store-cart-drawer.TC-s5l rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-an9 rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-vix rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-gtt rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-zyo rev=1 covers=g10.store-cart-drawer.SC-cui -->
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
2. Inspect item, points, promo, disclosure, product/account and Checkout controls.
3. Attempt each action by pointer and keyboard, including the same points action again.
4. Complete the change with a usable quote.

**Expected Results:**

* All listed controls remain disabled and their attempts invoke no action callback, duplicate operation or navigation.
* Checkout remains disabled while the change is unresolved.
* No unaccepted saving replaces the accepted total.
* The completed summary uses the accepted quote.

<!-- trace:case id=g10.store-cart-drawer.TC-ncq rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-n5t rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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
* Another tab holds the same member cart and can save a later line edit.

**Steps:**

1. Change a cart line in another tab before the points response arrives.
2. Wait for the changed basket review and quote.
3. Deliver the earlier points response.
4. Inspect the points choice and summary.

**Expected Results:**

* The changed basket is reviewed and quoted again.
* Old-basket saving and total are not shown as current.
* Checkout stays unavailable until the current basket is resolved.
* The earlier response cannot replace the current basket summary.

<!-- trace:case id=g10.store-cart-drawer.TC-vxl rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-js3 rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-6uw rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-75a rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-lka rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-t22 rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
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

<!-- trace:case id=g10.store-cart-drawer.TC-kfu rev=2 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### grade10-site-store-cart-drawer-US06-TC05-2: A changed line found at creation is named in the drawer, not on a separate page

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
* Once the drawer's next read confirms every line the cart still holds, Proceed to Checkout can be pressed again without leaving the drawer; a line the read finds sold out holds it until the collector removes it.

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

## g10.store-cart-drawer.US7: Collector waits for the current drawer operation

**As a** signed-in collector whose cart drawer is reading, saving or starting checkout,
**I want** its actions to wait until that work finishes,
**so that** another cart change or checkout cannot start before its current answer is ready.

<!-- trace:case id=g10.store-cart-drawer.TC-zg3 rev=1 covers=g10.store-cart-drawer.SC-tmf -->
### g10.store-cart-drawer.US7-TC1: Every current drawer read blocks another action

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US7

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The member cart contains an available line and accepted tender.
* All drawer answers except `<held read>` can complete.
* The answer to `<held read>` is mocked to remain pending.
* Each read runs on first open and on a current background refresh with cached figures, separately.

**Test data:**

| held read |
| --- |
| Current cart lines |
| Current price and stock |
| Saved tender |
| Held promo-code eligibility |
| Member points and basket ceiling |
| Current basket quote |

**Steps:**

1. Open the cart drawer.
2. Wait for the other drawer reads to finish.
3. Attempt enabled-looking drawer actions by pointer and keyboard.
4. Read the current figures and browser destination.

**Expected Results:**

* Item, tender and navigation actions remain unavailable.
* No attempted action starts a write, checkout or navigation.
* Unconfirmed prices and stock remain unchecked.
* Existing loading treatments remain until the current answer arrives.

<!-- trace:case id=g10.store-cart-drawer.TC-sn0 rev=1 covers=g10.store-cart-drawer.SC-8et,g10.store-cart-drawer.SC-7zb,g10.store-cart-drawer.SC-25v -->
### g10.store-cart-drawer.US7-TC2: Sent writes keep all drawer actions unavailable

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US7

**Pre-conditions:**

* customer(member) has an open, successfully reviewed cart drawer.
* The drawer contains an available line and accepted tender.
* The selected `<operation>` is mocked to pause at `<held stage>`.
* Cart writes can finish while their confirming review and quote remain independently delayed.
* Tender rows run with their existing promo sheet open where applicable.

**Test data:**

| operation | held stage |
| --- | --- |
| Increase quantity | Cart write |
| Remove a line | Cart write |
| Apply a typed promo code | Tender quote |
| Pick a held code | Tender persistence |
| Remove the accepted code | Confirming refresh |
| Apply a new points amount | Tender quote |
| Use max | Tender persistence |
| Remove applied points | Confirming refresh |
| Proceed to Checkout | Checkout creation |

**Steps:**

1. Perform `<operation>` in the drawer.
2. Attempt a second action immediately in the same turn, then wait until `<held stage>` is pending.
3. Attempt item, tender, disclosure, product/account and Checkout actions by pointer and keyboard, including the open promo sheet where applicable.
4. Read the accepted figures and entered values.
5. For a cart write, complete the write while holding the confirming review and quote, and attempt those actions again.
6. Finish the remaining stages without starting another action.

**Expected Results:**

* All drawer actions wait while the selected stage runs.
* Attempts send no additional operation or navigation.
* The guard holds continuously after a cart write through its confirming review and quote.
* Accepted figures and entered values remain until an answer.
* During checkout creation, its pending treatment and submitted facts remain fixed.
* Finishing the stage replays no attempted action.

<!-- trace:case id=g10.store-cart-drawer.TC-xlq rev=1 -->
### g10.store-cart-drawer.US7-TC3: Unrelated page reads leave drawer actions available

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US7

**Pre-conditions:**

* customer(member) has an open, successfully reviewed cart drawer.
* All drawer operations have completed.
* An unrelated catalogue refresh is mocked to remain pending.

**Steps:**

1. Increase an available line from quantity 1 to 2.
2. Wait for the cart write and confirming review.
3. Read the updated drawer.

**Expected Results:**

* The quantity action starts despite the unrelated refresh.
* Current review shows quantity 2.
* The unrelated refresh does not hold drawer actions disabled.

## g10.store-cart-drawer.US8: Collector continues after a drawer operation ends

**As a** signed-in collector whose drawer operation succeeds or fails,
**I want** the drawer to offer the actions its current facts allow, including recovery when needed,
**so that** I can continue or retry without a completed request leaving the drawer stuck.

<!-- trace:case id=g10.store-cart-drawer.TC-voa rev=1 covers=g10.store-cart-drawer.SC-d60 -->
### g10.store-cart-drawer.US8-TC1: One completed read cannot unlock another pending read

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US8

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* Current cart review and member tender reads are independently delayed.
* All other drawer answers are available.
* An unrelated catalogue refresh remains active throughout the route.

**Test data:**

| first read | first outcome |
| --- | --- |
| Cart review | Success |
| Member tender | Success |
| Member tender | Failure |
| Member tender | Refusal |

**Steps:**

1. Open the cart drawer.
2. Finish `<first read>` with `<first outcome>`.
3. Attempt a drawer action before the other read finishes.
4. Finish the remaining read successfully.
5. Read available drawer actions without clicking them.

**Expected Results:**

* Actions remain unavailable after only the first answer.
* The attempted action starts no operation.
* Only currently permitted actions return after both reads end.
* No attempted action runs when the remaining read ends.
* The unrelated refresh does not keep the drawer pending after both drawer reads end.

<!-- trace:case id=g10.store-cart-drawer.TC-dvl rev=1 covers=g10.store-cart-drawer.SC-kqq -->
### g10.store-cart-drawer.US8-TC2: Failed reads end waiting and leave Retry usable

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US8

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* `<failed read>` is mocked to fail, with any saved tender already accepted.
* No other drawer operation remains pending.
* The next read can return current cart facts.

**Test data:**

| failed read |
| --- |
| First cart read, lines unknown |
| Price and stock review, held lines known |
| Saved tender read |
| Confirming cart or tender read after a successful write |

**Steps:**

1. Open the cart drawer.
2. Attempt a drawer action while the read waits, then deliver its failure.
3. Read error feedback and current-data availability without starting recovery yet.
4. Click Retry.
5. Wait for the successful current read.

**Expected Results:**

* The drawer shows its existing read failure feedback.
* Held facts do not become current after the failure.
* Retry is available after the failed request ends.
* No read, write or checkout starts automatically after failure.
* Unsupported actions stay unavailable; accepted same-basket tender remains only where its existing guards permit it, and successful persistence is not presented as rolled back.
* Retry starts one read and waits while it runs.
* Successful review restores currently permitted actions.

<!-- trace:case id=g10.store-cart-drawer.TC-w4l rev=1 covers=g10.store-cart-drawer.SC-kqq -->
### g10.store-cart-drawer.US8-TC3: Tender refusal releases waiting without replaying actions

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US8

**Pre-conditions:**

* customer(member) has an open, successfully reviewed cart drawer.
* An accepted code, points choice and total are present.
* The next tender change is mocked to return `<answer>`.
* All other drawer operations have completed.

**Test data:**

| answer |
| --- |
| Named tender refusal |
| Request failure |

**Steps:**

1. Apply a different points amount.
2. Attempt another drawer action before the answer.
3. Release `<answer>`.
4. Read the feedback, accepted tender and available actions.
5. Perform one currently permitted action deliberately.

**Expected Results:**

* No second action starts while the answer is pending.
* The existing refusal or failure feedback appears.
* The accepted same-basket tender and total remain.
* Currently permitted actions return without automatic replay.
* The deliberate action starts once.
* Existing Retry remains available where the failure offers it; unsupported actions stay unavailable under current-data guards.

## g10.store-cart-drawer.US9: Collector leaves a pending drawer

**As a** signed-in collector whose drawer is waiting for an operation,
**I want** Close, backdrop click and Escape to keep working,
**so that** I can return to the page without waiting for that operation to finish.

<!-- trace:case id=g10.store-cart-drawer.TC-sxn rev=1 -->
### g10.store-cart-drawer.US9-TC1: Pending reads allow dismissal and preserve the page

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US9

**Pre-conditions:**

* customer(member) is on `<grade10 store url>` at a recorded scroll position.
* The cart contains enough lines for drawer overflow.
* A current drawer read is mocked to remain pending.

**Test data:**

| dismissal |
| --- |
| Click Close |
| Click the dimmed backdrop |
| Press Escape |

**Steps:**

1. Open the cart drawer.
2. Scroll the drawer content.
3. Dismiss the drawer using `<dismissal>`.
4. Read the underlying page and browser address.

**Expected Results:**

* Drawer content scrolls while the read remains pending.
* The page behind the open drawer stays still.
* The selected dismissal closes the drawer immediately.
* The original address and page position remain.
* The underlying page can scroll after dismissal.

<!-- trace:case id=g10.store-cart-drawer.TC-hi9 rev=1 -->
### g10.store-cart-drawer.US9-TC2: Closing a pending write preserves its saved result

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US9

**Pre-conditions:**

* customer(member) has an open, successfully reviewed cart drawer.
* The next `<write>` is sent before its answer is held.
* The sent write is mocked to finish successfully after dismissal.

**Test data:**

| write |
| --- |
| Increase an available line from quantity 1 to 2 |
| Remove an available line |
| Apply a new valid points amount |

**Steps:**

1. Perform `<write>`.
2. Dismiss the drawer while its answer is pending.
3. Allow the sent write to complete.
4. Open the cart drawer again.
5. Wait for current authoritative reads.

**Expected Results:**

* The drawer closes immediately.
* Dismissal claims no cancellation or rollback.
* Reopening reads the current cart and saved tender.
* Current reads show the accepted sent change.
* No dismissed action is automatically repeated.

<!-- trace:case id=g10.store-cart-drawer.TC-n8k rev=2 -->
### g10.store-cart-drawer.US9-TC3: Pending checkout can close before its answer arrives

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US9

**Pre-conditions:**

* customer(member) has an open, successfully reviewed cart drawer.
* The checkout answer is mocked to remain pending after submission.

**Test data:**

| dismissal |
| --- |
| Click Close |
| Click the dimmed backdrop |
| Press Escape |

**Steps:**

1. Click Proceed to Checkout.
2. Dismiss the drawer using `<dismissal>`.
3. Read the underlying page before the answer arrives.
4. Release the successful hosted-invoice answer.
5. Read the browser destination.

**Expected Results:**

* The selected dismissal closes the drawer immediately.
* The original page remains visible before the answer arrives.
* The successful current reply then opens Shopify.
* Closing claims no invoice cancellation or rollback.
* The sent checkout request is not automatically repeated.
* Closing alone does not make its successful reply stale.

<!-- trace:case id=g10.store-cart-drawer.TC-n5c rev=1 covers=g10.store-cart-drawer.SC-p7g -->
### g10.store-cart-drawer.US9-TC4: Reopening waits for sent work and current reads

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
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US9

**Pre-conditions:**

* customer(member) has an open reviewed cart with accepted tender and overflowing content.
* The next `<operation>` can be sent, with its answer delayed.
* Fresh cart and tender reads after reopening can be held independently.
* `<sheet>` has a recorded opener for the existing focus behavior.

**Test data:**

| operation | sheet | Dismissal |
| --- | --- | --- |
| Quantity write | Closed | Close |
| Line removal write | Open before the write | Back on sheet, then Close |
| Points persistence | Open before the change | Backdrop on sheet, then backdrop on drawer |
| Points persistence | Open before the change | Escape on sheet, then Escape on drawer |

**Steps:**

1. Start `<operation>` and hold its sent answer.
2. Scroll the drawer and the open sheet, where applicable.
3. Use `<Dismissal>`, observing sheet-first dismissal and focus before closing the drawer.
4. Reopen for the same member while the operation still waits and hold fresh reads.
5. Attempt item, tender, navigation and Checkout actions.
6. Deliver the earlier operation's answer while fresh reads still wait.
7. Release current authoritative cart and tender reads.
8. Inspect saved values and available actions without activating one.

**Expected Results:**

* Scrolling works while pending; Back, backdrop and Escape close an open sheet first and preserve its existing focus behavior.
* Closing the drawer preserves the page address and cancels or rolls back no sent work.
* The reopened drawer holds actions for outstanding same-member work and then for fresh reads; the attempts start no additional operation.
* An older tender answer changes no reopened view while fresh reads wait.
* Current authoritative reads show the accepted sent write and restore only currently permitted actions.
* Clearing pending repeats no attempted or dismissed action.

## Reconciliation

### Pending QA2 - 2026-10-13

The cart and checkout independent readings use input identity
`abeb03776e73168b1195edf6e81a9de02e47599e33de48ebe02bf17cecaa40d0`.
QA2 compares their cases with this delta, Q14-Q16, the current technical design
and the checkout owner's Q35. The shared anchor restart changes no cart anchor.
This dated scope supersedes earlier coverage claims for revised SC23.

| Case | Disposition |
| --- | --- |
| `g10.store-cart-drawer.US7-TC1` / `TC-zg3` | Retain blind draft; add cached background refresh and quote row |
| `g10.store-cart-drawer.US7-TC2` / `TC-sn0` | Retain blind draft; sharpen same-turn guard, post-write review/quote, open-sheet attempts and fixed checkout presentation |
| `g10.store-cart-drawer.US7-TC3` / `TC-xlq` | Retain blind draft; independently proves unrelated page work does not hold the guard; no whole SC38 claim |
| `g10.store-cart-drawer.US8-TC1` / `TC-voa` | Retain blind draft; add refusal and unrelated page request to complete last-operation assertions |
| `g10.store-cart-drawer.US8-TC2` / `TC-dvl` | Retain blind draft; sharpen saved/confirming read failures, no replay and same-basket guards |
| `g10.store-cart-drawer.US8-TC3` / `TC-w4l` | Retain blind draft; sharpen Retry and current-data constraints for refusal/failure |
| `g10.store-cart-drawer.US9-TC1` / `TC-sxn` | Retain blind draft; dismissal and scrolling before the answer only; no whole SC40 claim |
| `g10.store-cart-drawer.US9-TC2` / `TC-hi9` | Retain blind draft; saved result after closing only; no whole SC40 claim |
| `g10.store-cart-drawer.US9-TC3` / `TC-n8k` | Retain source-patched rev2 draft; Q16/Q35 current success opens Shopify while closed; checkout's reopen case asserts its full scenario |
| `g10.store-cart-drawer.US9-TC4` / `TC-n5c` | New QA2 draft from uncovered reopen-before-answer and nested dismissal outcomes; allocated by trace CLI |
| `grade10-site-store-cart-drawer-US05-TC05-1` / `TC-zyo` | Retain draft and issued identity; complete revised SC23 action scope; remove unrelated inherited scenario claims |
| `grade10-site-store-cart-drawer-US05-TC07-1` / `TC-n5t` | Retain blind external-tab route repair; stale points answer scope unchanged |

| Source in `spec.md` | Complete asserting case |
| --- | --- |
| `grade10-site-store-cart-drawer-SC-23` (`SC-cui`) | `grade10-site-store-cart-drawer-US05-TC05-1` |
| `g10.store-cart-drawer.SC34` (`SC-tmf`) | `g10.store-cart-drawer.US7-TC1` |
| `g10.store-cart-drawer.SC35` (`SC-8et`) | `g10.store-cart-drawer.US7-TC2` |
| `g10.store-cart-drawer.SC36` (`SC-7zb`) | `g10.store-cart-drawer.US7-TC2` |
| `g10.store-cart-drawer.SC37` (`SC-25v`) | `g10.store-cart-drawer.US7-TC2` |
| `g10.store-cart-drawer.SC38` (`SC-d60`) | `g10.store-cart-drawer.US8-TC1` |
| `g10.store-cart-drawer.SC39` (`SC-kqq`) | `g10.store-cart-drawer.US8-TC2`, `g10.store-cart-drawer.US8-TC3` with their respective failure rows |
| `g10.store-cart-drawer.SC40` (`SC-p7g`) | `g10.store-cart-drawer.US9-TC4` |

- **Anchor coverage** - US7 covers actual reads/writes/tender/checkout and unrelated work; US8 covers overlaps, terminal failure, recovery and no replay; US9 covers scrolling, dismissal and current reads after reopening. Existing US05 retains tender guard and stale-answer ownership.
- **Overclaims** - Revised SC23 is removed from the 12 other active legacy cases whose narrower routes do not assert its whole THEN. Their identities, revisions, classifications and other coverage links remain. New partial-route cases remain anchor-covered without claiming an entire scenario.
- **Clarification** - QA1's after-close question lands in Cart Q16 and Checkout Q35, human option B on 2026-10-13. The successful current reply opens Shopify; genuine cart, tender, member or request changes still invalidate it. Checkout owns its request guard; tender-view answers retain opening guards.
- **Uncovered scenarios** - None in this increment. The obsolete open-Q16 technical-design paragraph was reported to the coordinator and repaired at its source before closure.
- **Lifecycle** - 43 active cases remain draft; the one QA2 addition is draft/manual. Historical cases and completed tasks are retained; this run grants no execution credit.

#### Manual

| Manual | Why |
| --- | --- |
| `g10.store-cart-drawer.US7-TC1` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US7-TC2` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US7-TC3` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US8-TC1` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US8-TC2` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US8-TC3` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC1` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC2` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC3` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC4` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `grade10-site-store-cart-drawer-US05-TC05-1` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `grade10-site-store-cart-drawer-US05-TC07-1` | To be walked in Cart Drawer Group 11.1 controlled host/hook fixtures and Group 12.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |



**Run:** Update on 2026-10-07, from `add-store-product-status`'s sixth
acceptance review. SC-29 moved to rev 2: it covers a provider that refuses or
fails to create the session after the store's read returned. A store read that
cannot complete follows `grade10-site/store/cart-validation`, which keeps
checkout unavailable until a later read returns, as `Drawer actions continue
to a product address or create checkout directly` now says. US06-TC06-1
already starts from a reviewed drawer and a Shopify refusal, so no case
changed. QA2 reruns on this suite.

**Run:** Update on 2026-10-06, from `add-store-product-status`'s fifth
acceptance review. `Drawer actions continue to a product address or create
checkout directly` now says the drawer adds no re-read before creating the
session, and reads the cart again when the recheck or the shop refuses the
checkout, as cart-validation's **Back to the cart** requires. No scenario and
no case changed. QA2 reruns on this suite.

**Run:** Update on 2026-10-06, from `add-store-product-status`'s acceptance
review. SC-28 moved to rev 2: after a refused checkout, Checkout is offered
again only once the cart holds lines the read confirmed, because a sold-out
line holds checkout under `grade10-site/store/cart-validation`. US06-TC05
moved to rev 2 to expect the same. QA2 reruns on this suite.

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
