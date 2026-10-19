# grade10-site/store/cart-drawer Test Cases

**Status:** pending-review · 0/63
**Drafts styled:** 2026-10-13, tcs-rules r5

**Out of suite:** grade10-site-store-cart-drawer-SC-36 - reordered, removed and unconfirmed variant-ID joins and quantity guards in Grade10 Group 4.1 frontend runtime tests; grade10-site-store-cart-drawer-SC-39 - guest/member review, basket quote and checkout response compatibility with current and previous production decoders in Grade10 Groups 2.1 and 3.1 runtime tests; grade10-site-store-cart-drawer-SC-40 - malformed picture-field refusal by the current production decoder in Grade10 Group 2.1 contract tests; grade10-site-store-cart-drawer-SC-43 - unavailable-variant field omission and drawer cleanup in Grade10 Group 5.3 review/drawer runtime tests

## Walk 1: Sign-out in another tab, then what the collector does next

**Starting state:**

- customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
- A second tab 2 of the same browser is open on any Store surface.

**Shared test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |
| settle_wait | 10 seconds, longer than a routine session read |

### Route

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
   - The drawer and its backdrop are gone, no toast, notice or sign-in prompt appeared, and tab 1 is still at `<surface_address>`. `g10.store-cart-drawer.US14-TC1`
4. Take one branch from the state after step 3.
   a. Click Cart in the header, then wait `<settle_wait>`.
      - One guest drawer opens over `<surface_address>`, shows no `<member_line>`, and is still open after the wait. `g10.store-cart-drawer.US14-TC2`
   b. From the starting state, repeat steps 1 to 3, sign in as the same customer through the header's Sign In control, wait for the header to show the signed-in state, then click Cart.
      - No drawer opened while signing in, and Cart opens one drawer that shows `<member_line>`. `g10.store-cart-drawer.US14-TC3`

## Background

* <grade10 store url> is the Grade10 storefront under test.

## g10.store-cart-drawer.US1: Signed-in collector opens the current cart over the page

**As a** signed-in collector,
**I want** my current cart to open over the page I am on with current facts,
**so that** I can review what the shop can sell without losing my place.

<!-- trace:case id=g10.store-cart-drawer.TC-5he rev=1 covers=g10.store-cart-drawer.SC-omn,g10.store-cart-drawer.SC-za5,g10.store-cart-drawer.SC-a52,g10.store-cart-drawer.SC-tv2,g10.store-cart-drawer.SC-ti9,g10.store-cart-drawer.SC-0og,g10.store-cart-drawer.SC-lrr,g10.store-cart-drawer.SC-8ln,g10.store-cart-drawer.SC-33u -->
### g10.store-cart-drawer.US1-TC1: Drawer reviews the signed-in member cart

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
* **Trace:** g10.store-cart-drawer.US1

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
### g10.store-cart-drawer.US1-TC2: Pending read withholds stale facts and a later open reads again

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
* **Trace:** g10.store-cart-drawer.US1

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
### g10.store-cart-drawer.US1-TC3: Failed read reports once and reopening retries

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
* **Trace:** g10.store-cart-drawer.US1

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
### g10.store-cart-drawer.US1-TC4: Summary makes no unsupported price claim

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
* **Trace:** g10.store-cart-drawer.US1

**Pre-conditions:**

* The current cart holds one available line and one sold-out line.
* The cart read supplies current line facts but no applied quote.
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
* Shipping reads `Calculated at checkout`, no points control appears, and no promotion or discount is applied.
* Step 3 accepts no code and leaves the summary unchanged.

<!-- trace:case id=g10.store-cart-drawer.TC-gd8 rev=1 covers=g10.store-cart-drawer.SC-omn,g10.store-cart-drawer.SC-za5,g10.store-cart-drawer.SC-a52,g10.store-cart-drawer.SC-tv2,g10.store-cart-drawer.SC-ti9,g10.store-cart-drawer.SC-0og,g10.store-cart-drawer.SC-lrr,g10.store-cart-drawer.SC-8ln,g10.store-cart-drawer.SC-33u -->
### g10.store-cart-drawer.US1-TC5: Opening and closing preserve the current surface

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
* **Trace:** g10.store-cart-drawer.US1

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

## g10.store-cart-drawer.US2: Signed-in collector edits the reviewed cart

**As a** signed-in collector,
**I want** to change or remove lines after the shop checks them,
**so that** the cart I continue with contains what I intend to buy.

<!-- trace:case id=g10.store-cart-drawer.TC-qhe rev=1 covers=g10.store-cart-drawer.SC-5bv,g10.store-cart-drawer.SC-7rs -->
### g10.store-cart-drawer.US2-TC1: Quantity and removal update the opened cart

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
* **Trace:** g10.store-cart-drawer.US2

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
### g10.store-cart-drawer.US2-TC2: Delisted lines are removed once with one notice

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
* **Trace:** g10.store-cart-drawer.US2

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

## g10.store-cart-drawer.US3: Signed-in collector continues to a product from the cart drawer

**As a** signed-in collector,
**I want** the cart to take me to a product I select from it,
**so that** I can continue the shopping path I chose.

<!-- trace:case id=g10.store-cart-drawer.TC-hte rev=1 covers=g10.store-cart-drawer.SC-oqn -->
### g10.store-cart-drawer.US3-TC1: Reviewed line opens its existing product address

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
* **Trace:** g10.store-cart-drawer.US3

**Pre-conditions:**

* The current cart holds <product>, and its read has succeeded.
* The drawer is open over a Store surface other than <product>'s address.

**Steps:**

1. Activate <product>'s cart line.

**Expected Results:**

* The drawer closes.
* <product>'s existing Store product address opens.

---

## g10.store-cart-drawer.US4: Signed-in collector reads tender choices for the reviewed basket

**As a** signed-in collector,
**I want** to see which promo codes and how many points the reviewed basket can take,
**so that** I can understand my available benefits before continuing to checkout.

<!-- trace:case id=g10.store-cart-drawer.TC-8h2 rev=1 covers=g10.store-cart-drawer.SC-bim,g10.store-cart-drawer.SC-44a,g10.store-cart-drawer.SC-3yf -->
### g10.store-cart-drawer.US4-TC1: Coupon answers remain unselected and current

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
* **Trace:** g10.store-cart-drawer.US4

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
### g10.store-cart-drawer.US4-TC2: Points ceiling does not change the reviewed total

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
* **Trace:** g10.store-cart-drawer.US4

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
### g10.store-cart-drawer.US4-TC3: Unresolved reviews receive no tender facts

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
* **Trace:** g10.store-cart-drawer.US4

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
### g10.store-cart-drawer.US4-TC4: Latest basket replaces earlier tender facts

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
* **Trace:** g10.store-cart-drawer.US4

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

## g10.store-cart-drawer.US5: Signed-in collector chooses points before checkout

**As a** signed-in collector,
**I want** to apply, maximise or remove points against the reviewed cart and keep that choice at checkout,
**so that** I can see the accepted saving before leaving the page.

<!-- trace:case id=g10.store-cart-drawer.TC-s5l rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### g10.store-cart-drawer.US5-TC1: Apply carries accepted points and the existing code to checkout

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC2: Use max applies the quoted ceiling after the code

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC3: Apply above the ceiling keeps only accepted points

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC4: Remove clears points and preserves the existing code

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC5: Pending changes block duplicate actions and Checkout

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC6: Failed changes preserve the accepted same-basket choice

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC7: A changed basket rejects an earlier points result

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC8: Reload and another device recover the accepted choice

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC9: Unavailable points cannot be applied

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC10: A code covering all qualifying goods leaves no points to apply

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
* **Trace:** g10.store-cart-drawer.US5

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
### g10.store-cart-drawer.US5-TC11: Invalid amounts do not mutate points

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
* **Trace:** g10.store-cart-drawer.US5

**Pre-conditions:**

* A signed-in member has a reviewed basket and accepted tender choice.

**Steps:**

1. Try empty, zero, negative, fractional, non-numeric and non-finite amounts.

**Expected Results:**

* No invalid amount is persisted; the accepted choice and total remain.

<!-- trace:case id=g10.store-cart-drawer.TC-lka rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### g10.store-cart-drawer.US5-TC12: Closing or changing member rejects stale results

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
* **Trace:** g10.store-cart-drawer.US5

**Pre-conditions:**

* A signed-in member has a reviewed basket and accepted tender choice.

**Steps:**

1. Start a points operation; close the drawer or change member before its response. Reopen after the response.

**Expected Results:**

* No stale result updates the view or starts a stale write. A write already sent remains scoped to its member; reopening reads current persisted intent.

<!-- trace:case id=g10.store-cart-drawer.TC-t22 rev=1 covers=g10.store-cart-drawer.SC-xhn,g10.store-cart-drawer.SC-k73,g10.store-cart-drawer.SC-tio,g10.store-cart-drawer.SC-qit,g10.store-cart-drawer.SC-puc,g10.store-cart-drawer.SC-pi9,g10.store-cart-drawer.SC-34h,g10.store-cart-drawer.SC-fwv -->
### g10.store-cart-drawer.US5-TC13: Persistence success followed by refresh failure stays unresolved

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
* **Trace:** g10.store-cart-drawer.US5

**Pre-conditions:**

* A signed-in member has a reviewed basket and accepted tender choice.

**Steps:**

1. Save a points choice successfully, then fail the next basket refresh.

**Expected Results:**

* The UI does not claim rollback of the successful write. Stale totals remain unavailable and Checkout waits for authoritative reread.

---

## g10.store-cart-drawer.US6: Signed-in collector completes checkout without leaving the drawer

**As a** signed-in collector,
**I want** to pay for my reviewed cart from the drawer itself,
**so that** I reach Shopify's hosted invoice without a second page.

<!-- trace:case id=g10.store-cart-drawer.TC-qvw rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### g10.store-cart-drawer.US6-TC1: Proceed to Checkout creates the session from the reviewed basket and reaches Shopify's hosted invoice

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
* **Trace:** g10.store-cart-drawer.US6

**Pre-conditions:**

* A signed-in collector has a successfully reviewed drawer holding an available line, an accepted code and accepted points.

**Steps:**

1. Press Proceed to Checkout.
2. Wait for the redirect.

**Expected Results:**

* A checkout session is created carrying the reviewed lines and the accepted code and points; no separate checkout-open read happens first.
* The drawer shows a redirecting state until the collector's browser reaches Shopify's hosted invoice for that session.

<!-- trace:case id=g10.store-cart-drawer.TC-uvd rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### g10.store-cart-drawer.US6-TC4: The drawer holds a redirecting state until Shopify's hosted invoice is ready before leaving

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
* **Trace:** g10.store-cart-drawer.US6

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
### g10.store-cart-drawer.US6-TC5: A changed line found at creation is named in the drawer, not on a separate page

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
* **Trace:** g10.store-cart-drawer.US6

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
### g10.store-cart-drawer.US6-TC6: A provider refusal is named in the drawer, not on a separate page

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
* **Trace:** g10.store-cart-drawer.US6

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
### g10.store-cart-drawer.US6-TC7: A second press before the first resolves returns the same checkout, not a second one

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
* **Trace:** g10.store-cart-drawer.US6

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
### g10.store-cart-drawer.US6-TC8: The removed /checkout address no longer opens a checkout page

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
* **Trace:** g10.store-cart-drawer.US6

**Pre-conditions:**

* A signed-in collector has a browser session on the Store site.

**Steps:**

1. Navigate directly to the site's former `/checkout` address.

**Expected Results:**

* No checkout page opens at that address.
* Checkout is reachable only from Proceed to Checkout in the cart drawer.

<!-- trace:case id=g10.store-cart-drawer.TC-28w rev=1 covers=g10.store-cart-drawer.SC-xbm,g10.store-cart-drawer.SC-5pn,g10.store-cart-drawer.SC-t6r,g10.store-cart-drawer.SC-f0v,g10.store-cart-drawer.SC-7lx,g10.store-cart-drawer.SC-pqf -->
### g10.store-cart-drawer.US6-TC2: An unverified member's basket at the HKD 120,000 bar blocks Proceed to Checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US6

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
### g10.store-cart-drawer.US6-TC3: A basket under the bar, or a verified member's basket at or above it, proceeds without the gate

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US6

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

---

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

---

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

---

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

---

## g10.store-cart-drawer.US10: Collector recognises products in the reviewed cart

**As a** collector reviewing the current cart,
**I want** its retained lines to show their current product pictures,
**so that** I can recognise what I am buying before I continue.

<!-- trace:case id=g10.store-cart-drawer.TC-q4m rev=1 covers=g10.store-cart-drawer.SC-0d6,g10.store-cart-drawer.SC-0wy -->
### g10.store-cart-drawer.US10-TC1: Member lines show their matching current product pictures

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with 3 retained lines: 2 variants of one product and 1 variant of another.
* The current catalogue has several pictures per product. Each first picture has a distinct URL with query parameters.

**Test data:**

| First product's catalogue alt text | Expected first-line alt attribute |
| --- | --- |
| Card front | Card front |
| two spaces | two spaces |
| absent | The first line's current item name |
| null | The first line's current item name |
| empty string | The first line's current item name |

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review to finish.
3. Inspect each retained line's picture, image URL and alt attribute.
4. Inspect catalogue requests made for this review.
5. Read the line amounts and checkout control.

**Expected Results:**

* Step 3 shows each product's first current picture on its own line.
* Both variants of the same product show its first product picture.
* Each image URL retains its catalogue query parameter.
* No line shows another product's picture.
* The first line's image has **Expected first-line alt attribute**. The other product's supplied non-empty alt text is unchanged.
* Step 4 shows one existing batched live review with no separate product request per line.
* Step 5 keeps reviewed amounts and checkout readiness.

<!-- trace:case id=g10.store-cart-drawer.TC-f9s rev=1 -->
### g10.store-cart-drawer.US10-TC9: Guest lines show their matching current product pictures

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(guest) is on <grade10 store url> with 2 retained cart lines for different products.
* Each product has a distinct first current catalogue picture.

**Steps:**

1. Click Cart in the site header.
2. Wait for the guest cart review to finish.
3. Inspect both retained lines and the checkout control.

**Expected Results:**

* Step 3 shows each first current picture on its matching line.
* No line shows the other product's picture.
* Picture enrichment leaves guest checkout readiness unchanged.

<!-- trace:case id=g10.store-cart-drawer.TC-v8r rev=1 covers=g10.store-cart-drawer.SC-vq6 -->
### g10.store-cart-drawer.US10-TC2: A product without a picture keeps its cart facts

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with <cart_2>.
* The product in <cart_2> has no catalogue picture. A controlled review of the same cart without picture enrichment supplies the comparison facts.

**Test data:**

| Field | Value |
| --- | --- |
| <cart_2> | One retained, available product with a reviewed price and quantity |

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review to finish.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 shows the existing picture placeholder.
* Quantity, status, prices and subtotal match the comparison review.
* The badge count and checkout readiness also match that review.

<!-- trace:case id=g10.store-cart-drawer.TC-p6k rev=1 -->
### g10.store-cart-drawer.US10-TC3: Member legacy review remains usable without picture fields

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with one retained line.
* The member cart review returns a valid legacy response without picture fields.

**Steps:**

1. Click Cart in the site header.
2. Wait for the legacy review response.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 shows the existing picture placeholder.
* The line's price, quantity and status remain from the review.
* The cart total and checkout readiness remain from the review.

<!-- trace:case id=g10.store-cart-drawer.TC-t5x rev=1 -->
### g10.store-cart-drawer.US10-TC10: Guest legacy review remains usable without picture fields

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(guest) is on <grade10 store url> with one retained cart line.
* The guest cart review returns a valid legacy response without picture fields.

**Steps:**

1. Click Cart in the site header.
2. Wait for the legacy review response.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 shows the existing picture placeholder.
* The line's price, quantity and status remain from the review.
* The cart total and checkout readiness remain from the review.
<!-- trace:case id=g10.store-cart-drawer.TC-d9w rev=1 covers=g10.store-cart-drawer.SC-4fw -->
### g10.store-cart-drawer.US10-TC4: Restored cart reads the current picture again

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with one retained product in the cart.
* A controlled catalogue returns <picture_1> on the first review and <picture_2> after reload.

**Test data:**

| Field | Value |
| --- | --- |
| <picture_1> | The product's first current picture before reload |
| <picture_2> | A different first current picture for the same product after the catalogue changes |

**Steps:**

1. Click Cart in the site header.
2. Wait for review and note the line's picture.
3. Check that the saved member cart intent contains no picture URL or alt text.
4. Reload <grade10 store url>.
5. Click Cart in the site header.
6. Wait for the fresh live review and inspect the line.

**Expected Results:**

* Step 2 shows <picture_1>.
* Step 3 finds variant and quantity intent without picture metadata.
* Step 6 shows <picture_2>, not the earlier picture.
* The retained cart line remains present after reload.

<!-- trace:case id=g10.store-cart-drawer.TC-j2f rev=1 covers=g10.store-cart-drawer.SC-8ty -->
### g10.store-cart-drawer.US10-TC5: Picture facts stay out of cart write intent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* The **Cart owner** is on <grade10 store url> with a retained cart line whose image-free intent receives a picture URL and alt text in its current review.
* The cart line's quantity can be increased.

**Test data:**

| Cart owner | Stored intent |
| --- | --- |
| customer(member) | Member cart |
| customer(guest) | Guest browser cart |

**Steps:**

1. Click Cart in the site header.
2. Wait for review and read the line's picture facts.
3. Increase the line's quantity.
4. Inspect the cart write input, persisted **Stored intent** and the reviewed display facts.
5. Review the cart again.

**Expected Results:**

* Step 2 includes optional picture facts in the reviewed line.
* Step 4 keeps variant and quantity in write input and persisted intent without picture URL or alt text; picture facts appear only in the reviewed display facts.
* Step 5 obtains picture facts from the current review, rather than stored intent.

<!-- trace:case id=g10.store-cart-drawer.TC-c7t rev=1 covers=g10.store-cart-drawer.SC-gzj -->
### g10.store-cart-drawer.US10-TC6: Sold-out line keeps its picture and status

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with a sold-out cart line.
* The product has a current catalogue picture.

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review to finish.
3. Inspect the sold-out line and cart footer.

**Expected Results:**

* Step 3 shows the product's first current picture on its matching sold-out line.
* The line keeps its existing sold-out treatment.
* Prices, quantity, status, count, totals and checkout readiness match the same review without picture enrichment; the picture does not make the line available for checkout.

<!-- trace:case id=g10.store-cart-drawer.TC-h5b rev=1 covers=g10.store-cart-drawer.SC-lbo -->
### g10.store-cart-drawer.US10-TC7: Unresolved review does not present pictures as current

Runs once per row of **Test data**.

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
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with a cart line last reviewed with a picture.
* The next cart review has the **Review outcome** in **Test data**.

**Test data:**

| Review outcome | Expected presentation |
| --- | --- |
| Pending | Existing loading presentation |
| Failed catalogue read | Existing unresolved presentation |

**Steps:**

1. Click Cart in the site header.
2. Inspect the drawer before a successful review.
3. For a failed catalogue read, inspect Retry and try Checkout.

**Expected Results:**

* Step 2 shows **Expected presentation**, not the old picture as current.
* Cart amounts and checkout readiness stay unresolved; no unavailable-product result replaces the failed review.
* For the failed catalogue-read row, Step 3 retains the existing Retry behavior and Checkout guard.

<!-- trace:case id=g10.store-cart-drawer.TC-m3n rev=1 covers=g10.store-cart-drawer.SC-h93 -->
### g10.store-cart-drawer.US10-TC8: Failed picture resource leaves accepted cart facts intact

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US10

**Pre-conditions:**

* customer(member) is on <grade10 store url> with one retained reviewed line.
* The line's supplied picture URL returns a failed image resource.

**Steps:**

1. Click Cart in the site header.
2. Wait for the cart review and picture request.
3. Inspect the retained line and cart footer.

**Expected Results:**

* Step 3 keeps the reviewed line, quantity, status and amount.
* The cart total and checkout readiness remain from the accepted review; the browser image failure does not change cart review into a failure.

---

## g10.store-cart-drawer.US14: Collector returns to a tab whose session ended with the cart open

**As a** collector,
**I want** the cart drawer I left open to be gone when I come back to a tab whose session has ended,
**so that** I am not left looking at an empty cart beside a header that says Sign In.

<!-- trace:case id=g10.store-cart-drawer.TC-uzt rev=1 covers=g10.store-cart-drawer.SC-jq7,g10.store-cart-drawer.SC-53j -->
### g10.store-cart-drawer.US14-TC1: Drawer closes without a message after sign-out in another tab

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.

**Expected Results:**

* Step 3 shows Sign In in the header, with no cart drawer open beside it.
* The drawer's backdrop is gone from the page.
* No toast, notice or sign-in prompt appears in steps 2 and 3.
* Tab 1 is still at `<surface_address>`.

<!-- trace:case id=g10.store-cart-drawer.TC-79i rev=1 -->
### g10.store-cart-drawer.US14-TC2: Cart opens a guest drawer after the session ended elsewhere

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* The customer's cart holds `<member_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
4. Click Cart in the header.
5. Wait `<settle_wait>`.

**Expected Results:**

* Step 4 opens one drawer over `<surface_address>`, with no sign-in dialog.
* The drawer shows no `<member_line>` and offers no points.
* The drawer is still open after step 5.

<!-- trace:case id=g10.store-cart-drawer.TC-8ud rev=1 covers=g10.store-cart-drawer.SC-gey -->
### g10.store-cart-drawer.US14-TC3: Signing in again does not reopen the closed drawer

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* The customer's cart holds `<member_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
4. Sign in as the same customer through the header's Sign In control.
5. Wait for the header to show the signed-in state.
6. Click Cart in the header.

**Expected Results:**

* No cart drawer is open at any point in steps 4 and 5.
* Step 6 opens one drawer that shows `<member_line>`.

---

## Ungrouped

### g10.store-cart-drawer.US14: Collector returns to a tab whose session ended with the cart open

<!-- trace:case id=g10.store-cart-drawer.TC-xgb rev=1 covers=g10.store-cart-drawer.SC-7ep,g10.store-cart-drawer.SC-53j -->
#### g10.store-cart-drawer.US14-TC4: Drawer closes without a message when the session expires

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The environment can end the customer's session on the server without a sign-out press in any tab.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. Switch to tab 2.
2. End the customer's session by expiry.
3. Switch to tab 1.
4. Wait for the header to show Sign In.

**Expected Results:**

* Step 4 shows Sign In in the header, with no cart drawer open beside it.
* The drawer's backdrop is gone from the page.
* No toast, notice or sign-in prompt appears in steps 3 and 4.
* Tab 1 is still at `<surface_address>`.

<!-- trace:case id=g10.store-cart-drawer.TC-g4z rev=2 -->
#### g10.store-cart-drawer.US14-TC5: A guest's open drawer stays open across later session reads

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(guest) has tab 1 open at `<surface_address>`, with `<guest_line>` in this browser's cart.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| guest_line | An available product line in this browser's guest cart |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. Click Cart in the header.
2. Wait `<settle_wait>`.
3. Switch to tab 2.
4. Switch back to tab 1.
5. Wait `<settle_wait>`.

**Expected Results:**

* Step 1 opens one drawer over `<surface_address>`.
* The drawer is still open after step 2.
* The drawer is still open after step 5, showing `<guest_line>`.
* No toast or notice appears in steps 1 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-7jq rev=2 covers=g10.store-cart-drawer.SC-jq7,g10.store-cart-drawer.SC-gey -->
#### g10.store-cart-drawer.US14-TC6: Switching member closes the drawer; Cart then opens the new cart

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer A(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open on `<member_a_line>`.
* customer B(member) can sign in and holds a cart with `<member_b_line>` and no `<member_a_line>`.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_a_line | An available product line in customer A's cart only |
| member_b_line | An available product line in customer B's cart only |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1 and wait, for at most `<settle_wait>`, until its header shows Sign In.
3. In tab 2, sign in as customer B through the header's Sign In control.
4. Switch to tab 1.
5. Wait `<settle_wait>`.
6. Click Cart in the header.
7. Wait `<settle_wait>`.

**Expected Results:**

* Step 2 shows tab 1's header with Sign In and no cart drawer, before customer B signs in.
* Step 5 shows no cart drawer and no drawer backdrop, with tab 1 still at `<surface_address>`.
* No toast, notice or sign-in prompt appears in steps 2, 4 and 5.
* Step 6 opens one drawer over `<surface_address>`.
* The drawer shows no `<member_a_line>` at any point from step 6 on.
* The drawer shows `<member_b_line>` after step 7.

<!-- trace:case id=g10.store-cart-drawer.TC-2iv rev=1 covers=g10.store-cart-drawer.SC-dd4 -->
#### g10.store-cart-drawer.US14-TC7: A session read in flight leaves the drawer open

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The next session read of tab 1 can be held in flight and then answered with the customer's own session.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. Switch to tab 2.
2. Switch back to tab 1, holding the session read in flight.
3. Look at tab 1.
4. Answer the session read with the same customer's session.
5. Look at tab 1.

**Expected Results:**

* Step 3 shows the drawer still open over `<surface_address>`.
* Step 5 shows the drawer still open.
* No toast, notice or sign-in prompt appears in steps 2 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-d71 rev=1 -->
#### g10.store-cart-drawer.US14-TC8: A drawer with a read in flight still closes with the session

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open and its cart read held in flight.
* A second tab 2 of the same browser is open on any Store surface.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |

**Steps:**

1. In tab 2, sign out.
2. Switch to tab 1.
3. Wait for the header to show Sign In.
4. Answer the held cart read.
5. Look at tab 1.

**Expected Results:**

* Step 3 shows no cart drawer open, with the cart read still unanswered.
* Step 5 shows no cart drawer open and the page still at `<surface_address>`.
* No toast, notice or sign-in prompt appears in steps 2 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-vcl rev=2 covers=g10.store-cart-drawer.SC-w1i,g10.store-cart-drawer.SC-gey -->
#### g10.store-cart-drawer.US14-TC9: Checkout meeting an expired session leaves the drawer closed

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open on `<member_line>`.
* The customer's session ended on the server after tab 1 last read it, so tab 1 still shows the member's drawer.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_line | An available product line in the signed-in customer's cart |

**Steps:**

1. Click the member's checkout button in the drawer.
2. Close whatever checkout shows over the page, if anything.
3. Wait for the header to show Sign In.
4. Sign in as the same customer through the header's Sign In control.
5. Wait for the header to show the signed-in state.

**Expected Results:**

* Step 3 shows Sign In in the header, with no cart drawer open beside it.
* No cart drawer is open at any point in steps 4 and 5.
* What checkout asks of the collector after step 1 is checkout's to say and is not checked here.

<!-- trace:case id=g10.store-cart-drawer.TC-e57 rev=1 covers=g10.store-cart-drawer.SC-fg7 -->
#### g10.store-cart-drawer.US14-TC10: Reading a new member directly keeps the drawer open on their cart

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer A(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open on `<member_a_line>`.
* customer B(member) holds a cart with `<member_b_line>` and no `<member_a_line>`.
* A second tab 2 of the same browser is open on any Store surface.
* The next session read of tab 1 can be held in flight and then answered with customer B's session, so tab 1 reads customer A and then customer B with no reading of nobody between.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| member_a_line | An available product line in customer A's cart only |
| member_b_line | An available product line in customer B's cart only |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. Switch to tab 2.
2. Switch back to tab 1, holding the session read in flight.
3. Answer the session read with customer B's session.
4. Wait up to `<settle_wait>` for the drawer to show `<member_b_line>`.

**Expected Results:**

* The drawer stays open over `<surface_address>` throughout steps 2 to 4.
* Step 4 shows `<member_b_line>` in the drawer.
* The drawer shows no `<member_a_line>` at any point after step 3.
* No toast, notice or sign-in prompt appears in steps 2 to 4.

<!-- trace:case id=g10.store-cart-drawer.TC-p9t rev=1 covers=g10.store-cart-drawer.SC-l85 -->
#### g10.store-cart-drawer.US14-TC11: A guest's drawer stays open when the first session read answers nobody

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(guest) has tab 1 open at `<surface_address>`, with `<guest_line>` in this browser's cart.
* The first session read of tab 1 after a reload can be held in flight and then answered with nobody signed in.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| guest_line | An available product line in this browser's guest cart |
| settle_wait | 10 seconds, longer than a routine session read |

**Steps:**

1. Reload tab 1, holding its first session read in flight.
2. Click Cart in the header.
3. Look at tab 1.
4. Answer the held session read with nobody signed in.
5. Wait `<settle_wait>`.

**Expected Results:**

* Step 2 opens one drawer over `<surface_address>`.
* Step 3 shows the drawer still open.
* Step 5 shows the drawer still open, showing `<guest_line>`.
* No toast or notice appears in steps 1 to 5.

<!-- trace:case id=g10.store-cart-drawer.TC-38f rev=1 covers=g10.store-cart-drawer.SC-tpw -->
#### g10.store-cart-drawer.US14-TC12: A failed session read leaves a member's drawer open

Runs once per row of **Test data**.

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
* **Trace:** g10.store-cart-drawer.US14

**Pre-conditions:**

* customer(signed-in member) has tab 1 open at `<surface_address>`, with the cart drawer open.
* A second tab 2 of the same browser is open on any Store surface.
* The next session request of tab 1 can be made to fail with `<session_failure>`, by blocking it or by answering it with an error.

**Test data:**

| Field | Value |
| --- | --- |
| surface_address | `<grade10 store url>`, the Store front door, a public page that asks for no session |
| settle_wait | 10 seconds, longer than a routine session read |

| `<session_failure>` |
| --- |
| the service unreachable |
| a 500 error answer |

**Steps:**

1. Switch to tab 2.
2. Switch back to tab 1, making its session request fail with `<session_failure>`.
3. Wait `<settle_wait>`.

**Expected Results:**

* Step 2's session request fails with `<session_failure>`.
* Step 3 shows the drawer still open over `<surface_address>`.

## Settled

- **When the close shows** - the drawer is gone once the tab shows the person signed out, which is when its header shows Sign In. A tab keeps up promptly with a sign-out in another tab of this browser, and no later than the person's return in every other case, such as expiry; the drawer is never open beside that header (Q6)
- **A sign-out and a sign-in between** - the drawer follows what the open tab reads: any reading of nobody closes it, and one member read and then another with none between leaves it open on the new member's cart; the same member signing out and in follows the same rule. A person who switches member by signing out and in elsewhere finds the drawer closed, because the open tab keeps up promptly and reads nobody between (Q4, Q7)
- **A session read that fails** - not the end of a session; the drawer stays open (Q8)
- **A guest who becomes a member in another tab** - the guest's drawer stays open and shows the member's cart once the tab shows the member (Q9)
- **Work in flight at the close** - the drawer closes like any other close; the request already sent ends as it would, and its late answer changes nothing in a drawer opened afterwards (Q10)
- **Signing in from the guest drawer** - a sign-in started from the drawer's own Sign in link reopens the drawer; a sign-in the collector does not start from an open drawer leaves it closed (Q11)
- **Every surface** - the close holds on every surface the drawer opens over; a surface that itself needs a session makes its own sign-in ask (Q12)
- **What checkout asks next** - when a tab whose session has ended presses Proceed to Checkout, the drawer closes; whether the collector then meets a sign-in dialog or checks out as a guest is checkout's to say, not this suite's (Q14)
- **Reading the expired-checkout case** - the case reads the drawer and the header only where the tab stays on its surface; on a path that takes the tab to the hosted invoice there is no drawer to read (Q15)

## Reconciliation

**Run:** 2026-10-13. QA1 drafted the ten cases from the frozen `/tmp/add-store-cart-thumbnails-qa1` anchor bundle without requirements, scenarios, technical design or archive material. QA2 compared them with this change's requirements, decisions Q1-Q8, UI design, approved thumbnail reference, technical design and tasks. The case dispositions were decided before the scenario links were added.

| Case | Disposition |
| --- | --- |
| `g10.store-cart-drawer.US10-TC1` / `TC-q4m` | Retain the blind member route. Add one batch/request check, several catalogue pictures per product and alt partitions supported by the current-product Feature set and Q2/Q7. Fully asserts SC-34 and SC-41. |
| `g10.store-cart-drawer.US10-TC9` / `TC-f9s` | Retain the blind guest route under Q5. It checks guest picture pairing and readiness, but does not claim all of SC-34's first-image, URL and batch assertions. |
| `g10.store-cart-drawer.US10-TC2` / `TC-v8r` | Retain the blind missing-picture route. Compare quantity, status, prices, subtotal, badge and readiness with the same review without enrichment. Fully asserts SC-35. |
| `g10.store-cart-drawer.US10-TC3` / `TC-p6k` | Retain the blind member legacy-response route. Its rendered fallback is narrower than SC-39's complete transport and decoder matrix, assigned to runtime tests. |
| `g10.store-cart-drawer.US10-TC10` / `TC-t5x` | Retain the blind guest legacy-response route under Q5. Its rendered fallback is narrower than SC-39's complete transport and decoder matrix, assigned to runtime tests. |
| `g10.store-cart-drawer.US10-TC4` / `TC-d9w` | Retain the blind restore route. Check image-free member intent and the second current picture after reload and fresh review. Fully asserts SC-37. |
| `g10.store-cart-drawer.US10-TC5` / `TC-j2f` | Retain the blind intent route. Group member and guest storage partitions under the same review/edit/check, then verify write inputs and persisted intent remain image-free. Fully asserts SC-44. |
| `g10.store-cart-drawer.US10-TC6` / `TC-c7t` | Retain the blind sold-out route. Check first picture, existing treatment and unchanged money, quantity, count, status, totals and readiness. Fully asserts SC-42. |
| `g10.store-cart-drawer.US10-TC7` / `TC-h5b` | Retain the blind pending/failed partition. Add failed-read Retry, Checkout and no-unavailable-result checks. The failed row fully asserts SC-38; the pending row remains an anchor check. |
| `g10.store-cart-drawer.US10-TC8` / `TC-m3n` | Retain the blind browser resource-failure route. Check that review stays accepted and cart facts and readiness do not change. Fully asserts SC-45. |

| Source in `spec.md` | Complete asserting case or verifier |
| --- | --- |
| `grade10-site-store-cart-drawer-SC-34` (`SC-0d6`) | `g10.store-cart-drawer.US10-TC1` |
| `grade10-site-store-cart-drawer-SC-35` (`SC-vq6`) | `g10.store-cart-drawer.US10-TC2` |
| `grade10-site-store-cart-drawer-SC-36` (`SC-toh`) | Grade10 Group 4.1 frontend runtime tests - variant-ID join, removed and unconfirmed lines, quantity and checkout guards |
| `grade10-site-store-cart-drawer-SC-37` (`SC-4fw`) | `g10.store-cart-drawer.US10-TC4` |
| `grade10-site-store-cart-drawer-SC-42` (`SC-gzj`) | `g10.store-cart-drawer.US10-TC6` |
| `grade10-site-store-cart-drawer-SC-43` (`SC-3lt`) | Grade10 Group 5.3 review/drawer runtime tests - picture-field omission and unavailable-line cleanup |
| `grade10-site-store-cart-drawer-SC-44` (`SC-8ty`) | `g10.store-cart-drawer.US10-TC5` |
| `grade10-site-store-cart-drawer-SC-38` (`SC-lbo`) | `g10.store-cart-drawer.US10-TC7`, failed-read row |
| `grade10-site-store-cart-drawer-SC-45` (`SC-h93`) | `g10.store-cart-drawer.US10-TC8` |
| `grade10-site-store-cart-drawer-SC-39` (`SC-ier`) | Grade10 Groups 2.1 and 3.1 production-decoder and response-path runtime tests - both schema versions and all four response paths |
| `grade10-site-store-cart-drawer-SC-40` (`SC-2yu`) | Grade10 Group 2.1 current production-decoder contract tests - null and non-string picture fields |
| `grade10-site-store-cart-drawer-SC-41` (`SC-0wy`) | `g10.store-cart-drawer.US10-TC1` |

- **Anchor coverage** - All ten cases trace the collector's current-cart journey and Product pictures Feature set. The guest cases follow the existing guest transport journey, without changing drawer access policy.
- **Out of suite runtime verification** - SC-36, SC-39, SC-40 and SC-43 are named above because their full decoder, serializer, join or cleanup assertions require runtime tests. Partial browser cases do not receive those scenario links. Groups 2.1, 3.1, 4.1 and 5.3 own the respective evidence.
- **Overclaims** - The original member and guest legacy cases establish visible fallback but not the full SC-39 compatibility matrix. The guest picture case does not assert all SC-34 terms. They remain anchor-covered without those links. The thumbnail's `aria-hidden` frame means the member alt check reads the DOM attribute, not an accessible image name.
- **Uncovered scenarios** - None after the four explicit runtime verifiers. No opposite case/scenario behavior or further product decision was found.
- **Lifecycle** - All ten cases remain draft/manual. No tests, browser walk, deployment or human QA classification occurred in this planning pass.

### Pending QA2 - 2026-10-13

The cart and checkout independent readings use input identity
`abeb03776e73168b1195edf6e81a9de02e47599e33de48ebe02bf17cecaa40d0`.
QA2 compares their cases with this delta, Q20-Q22, the current technical design
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
| `g10.store-cart-drawer.US9-TC3` / `TC-n8k` | Retain source-patched rev2 draft; Q22/Q35 current success opens Shopify while closed; checkout's reopen case asserts its full scenario |
| `g10.store-cart-drawer.US9-TC4` / `TC-n5c` | New QA2 draft from uncovered reopen-before-answer and nested dismissal outcomes; allocated by trace CLI |
| `g10.store-cart-drawer.US5-TC5` / `TC-zyo` | Retain draft and issued identity; complete revised SC23 action scope; remove unrelated inherited scenario claims |
| `g10.store-cart-drawer.US5-TC7` / `TC-n5t` | Retain blind external-tab route repair; stale points answer scope unchanged |

| Source in `spec.md` | Complete asserting case |
| --- | --- |
| `grade10-site-store-cart-drawer-SC-23` (`SC-cui`) | `g10.store-cart-drawer.US5-TC5` |
| `g10.store-cart-drawer.SC34` (`SC-tmf`) | `g10.store-cart-drawer.US7-TC1` |
| `g10.store-cart-drawer.SC35` (`SC-8et`) | `g10.store-cart-drawer.US7-TC2` |
| `g10.store-cart-drawer.SC36` (`SC-7zb`) | `g10.store-cart-drawer.US7-TC2` |
| `g10.store-cart-drawer.SC37` (`SC-25v`) | `g10.store-cart-drawer.US7-TC2` |
| `g10.store-cart-drawer.SC38` (`SC-d60`) | `g10.store-cart-drawer.US8-TC1` |
| `g10.store-cart-drawer.SC39` (`SC-kqq`) | `g10.store-cart-drawer.US8-TC2`, `g10.store-cart-drawer.US8-TC3` with their respective failure rows |
| `g10.store-cart-drawer.SC40` (`SC-p7g`) | `g10.store-cart-drawer.US9-TC4` |

- **Anchor coverage** - US7 covers actual reads/writes/tender/checkout and unrelated work; US8 covers overlaps, terminal failure, recovery and no replay; US9 covers scrolling, dismissal and current reads after reopening. Existing US05 retains tender guard and stale-answer ownership.
- **Overclaims** - Revised SC23 is removed from the 12 other active legacy cases whose narrower routes do not assert its whole THEN. Their identities, revisions, classifications and other coverage links remain. New partial-route cases remain anchor-covered without claiming an entire scenario.
- **Clarification** - QA1's after-close question lands in Cart Q22 and Checkout Q35, human option B on 2026-10-13. The successful current reply opens Shopify; genuine cart, tender, member or request changes still invalidate it. Checkout owns its request guard; tender-view answers retain opening guards.
- **Uncovered scenarios** - None in this increment. The obsolete open-Q22 technical-design paragraph was reported to the coordinator and repaired at its source before closure.
- **Lifecycle** - 43 pending-scope cases remain draft. The one pending QA2 addition is draft/manual. Historical cases and completed tasks are retained; this run grants no execution credit.

#### Manual

| Manual | Why |
| --- | --- |
| `g10.store-cart-drawer.US7-TC1` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US7-TC2` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US7-TC3` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US8-TC1` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US8-TC2` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US8-TC3` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC1` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC2` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC3` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US9-TC4` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US5-TC5` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |
| `g10.store-cart-drawer.US5-TC7` | To be walked in Cart Drawer Group 16.1 controlled host/hook fixtures and Group 17.1 pending drawer actor walk with delayed answers, callback records and external-tab edits. No test or walk has executed in this planning run. |

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
  SC-32 (dropped 2026-10-14) and SC-33 (dropped 2026-10-14).
- **Raised, escalated** - `US06-TC02-1`'s pre-condition assumption (the bar
  read against gross goods, not the total after code and points) and
  whether the gate replaces Checkout or sits disabled beside it were both
  raised as open questions. Landed as `decisions.md` Q6 and Q7 in
  `move-checkout-into-cart-drawer` (folded into this file per that
  change's own decisions record).
- **Joined** - `US03-TC01-1` ↔ `grade10-site-store-cart-drawer-SC-13`;
  `US06-TC01-1` and `US06-TC04-1` ↔ `grade10-site-store-cart-drawer-SC-15`;
  `US06-TC02-1` ↔ SC-30 (dropped 2026-10-14); `US06-TC05-1` ↔
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
- **Uncovered anchor, out of suite** - SC-31 (dropped 2026-10-14)
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

**Run:** QA1, 2026-10-16, as the planning run reports it. The blind pass wrote `g10.store-cart-drawer.US14-TC1` to `g10.store-cart-drawer.US14-TC9` from the Feature set, the journey, the proposal, `decisions.md` as it stood before Q6 and the Cart Drawer page; it was denied every `## Requirements` section, `tech-design.md` and `tasks.md`. Its seven raised questions landed as Q6 to Q12. A narrow refresh followed, as the planning run reports it: it bound the shared address to a page that asks for no session, rewrote `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC9` at rev 2 and added `g10.store-cart-drawer.US14-TC10` to `g10.store-cart-drawer.US14-TC12`; its one raised row landed as Q15. Both are statements, not proof.

**Run:** QA2, 2026-10-16, first pass, in a fresh context. Read the nine cases, the delta `spec.md`, `decisions.md`, `tech-design.md`, `tasks.md`, the proposal, the journey and the Cart Drawer page, and for context the durable `shared/auth/session`, `grade10-site/store/cart-drawer` and `grade10-site/store/checkout` specs, the Checkout page and the in-flight `add-shopify-checkout-integration` delta. It read no application code and wrote no case and no scenario. Dev saw QA1's seven raised rows through `pnpm check:manual` after it wrote its three artifacts and says it changed nothing in response.

**Run:** QA2, 2026-10-16, delta pass at `28a522a99`, in a fresh context. Reconciled the diff of the change and the Checkout page since the first pass against the twelve cases, the scenarios and `decisions.md` through Q15. Moved: the requirement's second paragraph and the scenario for checkout meeting an expired session no longer name a sign-in dialog (Q14); the switch scenario's WHEN is the tab's next reading being a different member with no reading of nobody between; Q6 follows `shared/auth/session`, Q7 adds that a two-step switch is met by a closed drawer, and Q14 and Q15 landed; the cases changed as the QA1 refresh above says.

**Run:** QA2, 2026-10-16, final read at `2c054fa00` with the uncommitted edits to `spec.md`, `tasks.md` and the Cart page, in a fresh context. Re-read what the acceptance review's repairs moved against the cases and every `covers` link, and wrote no case and no scenario. Moved: the requirement says a tab reads a direct switch and keeps the drawer open, and a tab that reads nobody between two members closes it (Q4 and Q7, option A); the second paragraph gives a close for a session end precedence over the redirecting state and the failed state that restores Checkout, names no sign-in dialog, and keeps "without having opened the cart since"; the trigger is another tab of this site in this browser; the header stamp is the durable `tcs-rules r5`; `g10.store-cart-drawer.US14-TC6` waits for Sign In in tab 1 and links the sign-out and no-reopen scenarios; tasks 3.1, 3.2 and 4.1 assert no dialog. The scenarios and the Feature set are unchanged. `## Walk 1` is unchanged except that its shared address is the front door.

| Case | Disposition | Scenarios |
| --- | --- | --- |
| `g10.store-cart-drawer.US14-TC1` | Joined: the close on a sign-out in another tab, Sign In in the header with no drawer beside it, no message. The address is a page that asks for no session, so the result is read on the surface the silent-close scenario names | `g10.store-cart-drawer.SC46`, `g10.store-cart-drawer.SC48` |
| `g10.store-cart-drawer.US14-TC2` | Kept `draft`, no link: a drawer opened after the close is a guest's with nothing of the member's. That rests on the durable rule that a signed-out Cart press opens the same drawer and on `shared/auth/session`; the acceptance review rules no scenario is owed here | none |
| `g10.store-cart-drawer.US14-TC3` | Joined: signing in again through the header, with the cart not opened between, leaves the drawer closed; its last step is beyond the scenario | `g10.store-cart-drawer.SC53` |
| `g10.store-cart-drawer.US14-TC4` | Joined: the same close when the session expires, no message, on the same page | `g10.store-cart-drawer.SC47`, `g10.store-cart-drawer.SC48` |
| `g10.store-cart-drawer.US14-TC5` (rev 2) | Kept `draft`, no link: claims only a guest's drawer staying open through later reads, which the requirement's sentence on a collector with no session states; the first-read state moved to `g10.store-cart-drawer.US14-TC11`. No scenario is owed | none |
| `g10.store-cart-drawer.US14-TC6` (rev 2) | Joined, and in line with Q7 option A: the two-step switch closes the drawer. Step 2 waits until tab 1's header shows Sign In, so the sign-out scenario's close and header result are asserted before the second member signs in. Steps 3 to 5 then assert that signing in again opens no drawer; the sign-in is by a second customer in the other tab, which the no-reopen scenario does not distinguish from "the collector signs in again", and the result it states, the drawer stays closed, is the one asserted. Cart opening the new member's cart rests on `shared/auth/session` | `g10.store-cart-drawer.SC46`, `g10.store-cart-drawer.SC53` |
| `g10.store-cart-drawer.US14-TC7` | Joined: the drawer stays open while the read is held and after it answers | `g10.store-cart-drawer.SC50` |
| `g10.store-cart-drawer.US14-TC8` | Kept `draft`: real in part (Q10), with no scenario and no task | none |
| `g10.store-cart-drawer.US14-TC9` (rev 2) | Joined: checkout meeting an expired session leaves no drawer beside Sign In, and signing in through the header leaves it closed. It asserts no dialog or guest checkout, matching the reworded scenarios | `g10.store-cart-drawer.SC52`, `g10.store-cart-drawer.SC53` |
| `g10.store-cart-drawer.US14-TC10` (new) | Joined, and in line with Q7 option A: the tab reads one member and then another with no reading of nobody between, so the drawer stays open and shows only the new member's lines | `g10.store-cart-drawer.SC51` |
| `g10.store-cart-drawer.US14-TC11` (new) | Joined: Cart pressed while the first session read is held, the read answers nobody, the drawer stays open on the browser's cart | `g10.store-cart-drawer.SC49` |
| `g10.store-cart-drawer.US14-TC12` (new) | Joined, both rows: a read that fails, by an unreachable service or a 500 answer, leaves the drawer open | `g10.store-cart-drawer.SC54` |

| Scenario | Cases |
| --- | --- |
| `g10.store-cart-drawer.SC46` | `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC6` |
| `g10.store-cart-drawer.SC47` | `g10.store-cart-drawer.US14-TC4` |
| `g10.store-cart-drawer.SC48` | `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` |
| `g10.store-cart-drawer.SC49` | `g10.store-cart-drawer.US14-TC11` |
| `g10.store-cart-drawer.SC50` | `g10.store-cart-drawer.US14-TC7` |
| `g10.store-cart-drawer.SC51` | `g10.store-cart-drawer.US14-TC10` |
| `g10.store-cart-drawer.SC52` | `g10.store-cart-drawer.US14-TC9` |
| `g10.store-cart-drawer.SC53` | `g10.store-cart-drawer.US14-TC3`, `g10.store-cart-drawer.US14-TC6`, `g10.store-cart-drawer.US14-TC9` |
| `g10.store-cart-drawer.SC54` | `g10.store-cart-drawer.US14-TC12` |
| Uncovered | none |

- **Anchors** - the journey `g10.store-cart-drawer.US14` is traced by all twelve cases. The Feature set group Session end has a case under each leaf: Member signed out by `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC9`; Silent close by `g10.store-cart-drawer.US14-TC1` and `g10.store-cart-drawer.US14-TC4`; Drawer kept by `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` and `g10.store-cart-drawer.US14-TC12`. No leaf names a session still being read or unreadable, so `g10.store-cart-drawer.SC50` and `g10.store-cart-drawer.SC54` sit under Drawer kept by reading. The leaf also reads "a drawer open across a switch from one member to another, stay open" without the requirement's qualifier: it is true of the direct reading `g10.store-cart-drawer.US14-TC10` walks, and `g10.store-cart-drawer.US14-TC6` walks the two-step switch the requirement closes. An anchor edit would restart both readings, so the wording is left alone
- **Uncovered scenarios** - none. Each link holds because the case reaches the state the scenario names: `g10.store-cart-drawer.US14-TC10` and `g10.store-cart-drawer.US14-TC11` hold the read in flight, `g10.store-cart-drawer.US14-TC12` makes the request fail, `g10.store-cart-drawer.US14-TC6` waits for Sign In before the second member signs in, and `g10.store-cart-drawer.US14-TC1` and `g10.store-cart-drawer.US14-TC4` sit on a page that asks for no session
- **Beyond the scenarios** - assertions no scenario of this change states:
  - `g10.store-cart-drawer.US14-TC2` in full: backed by the durable rule that a signed-out Cart press opens the same drawer, by `shared/auth/session` (a surface whose session ended shows nobody's things), by Q10 and by the last clause of task 2.1
  - `g10.store-cart-drawer.US14-TC5` in full: backed by the requirement's "no session stays open"; no scenario walks a later read
  - `g10.store-cart-drawer.US14-TC6` in part: Cart opening the new member's cart after signing in rests on `shared/auth/session` (a surface keeps none of the earlier person's things); the closed drawer is stated by the requirement's clause that a tab reading nobody between two members closes it, carried through the sign-out and no-reopen scenarios
  - `g10.store-cart-drawer.US14-TC8` in full: Q10 backs "closes like any other close"; that a late answer does not bring the drawer back is implied, not decided, and the clause Q10 does state, a late answer reaching a drawer opened afterwards, no case walks
  - `g10.store-cart-drawer.US14-TC3` Step 6: Cart opening the member's cart after signing in rests on the durable cart-open rules
  - `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` and `g10.store-cart-drawer.US14-TC8`: "still at `<surface_address>`" rests on the durable rule that closing keeps the address; "the backdrop is gone" in `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC4` and `g10.store-cart-drawer.US14-TC6` sharpens "the drawer closes"
- **Contradicted** - none remains. Resolved since the first pass:
  - the unpinned surface against Q12: the address is a page that asks for no session
  - the switch case against Q6, Q7 and `shared/auth/session`: `g10.store-cart-drawer.US14-TC6` waits for Sign In in tab 1 before the second member signs in, so it expects the closed drawer Q7 option A states, and `g10.store-cart-drawer.US14-TC10` expects the open drawer only for the direct reading
  - the expired-checkout dialog against the durable checkout: the requirement and the scenario name no dialog, and tasks 3.1, 3.2 and 4.1 assert none
  - task 4.1 citing the direct-switch scenario for the two-step route: it cites it no longer
  - the two-step switch stated by no scenario: the requirement's first paragraph now states it, and `g10.store-cart-drawer.US14-TC6` carries it through the sign-out and no-reopen scenarios
  - the durable "remain open until the hosted invoice" against the close at checkout: the requirement's second paragraph now gives a close for a session end precedence over it and over the failed state
  - no contradiction: `g10.store-cart-drawer.US14-TC3` against "has not opened the cart since", and `g10.store-cart-drawer.US14-TC9` against the reworded scenarios. A sign-in from the drawer's own Sign in link (Q11) is walked by no case
- **Weak points** - `g10.store-cart-drawer.US14-TC9` Step 2 says to close "whatever checkout shows over the page, if anything" and does not exclude the drawer, so a tester who finds the drawer still open could close it there and Step 3 would pass wrongly. Q15 limits the case to a path where the tab stays on its surface, and nothing in its steps says what to do on a path that leaves it. Task 4.1's two-step route does not say to wait for Sign In in tab 1 before the second member signs in, as `g10.store-cart-drawer.US14-TC6` does, so a quick walk can meet the direct reading, which keeps the drawer open and conforms to Q7. Both are wording for the next pass
- **Raised, escalated** - QA1's seven rows landed as Q6 to Q12; the refresh's row landed as Q15; the two rows QA2 raised in the first pass landed as Q6, which now follows `shared/auth/session`, and Q14, which is an open row in the Checkout page's decisions block for its owner. Q13 came from a Dev question. The answers are in `## Settled`
- **Raised by this pass** - none
- **Decisions with no scenario** - Q9 (a guest who becomes a member in another tab), Q10 (work in flight), the reopen of Q11 (stated on the Cart Drawer page and in `add-store-guest-checkout`, in no scenario here), Q12 (the requirement names no surface; the only scenario that does qualifies it, so no case closes a drawer on a surface that needs a session or on Auction). Q13 changes nothing, and Q14 and Q15 limit what the suite reads
- **Automation only** - `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC8`, `g10.store-cart-drawer.US14-TC9`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` and `g10.store-cart-drawer.US14-TC12` plan `automation` alone: each needs a state a person cannot make (a session ended on the server, a read held in flight or made to fail, a session that ended after the tab last read it), as `tcs-conventions` asks. None is eligible for a manual run. Task 4.1's walk names routes for `g10.store-cart-drawer.US14-TC1`, `g10.store-cart-drawer.US14-TC2`, `g10.store-cart-drawer.US14-TC3`, `g10.store-cart-drawer.US14-TC4`, `g10.store-cart-drawer.US14-TC6` and `g10.store-cart-drawer.US14-TC9`, and none for `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC8`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` or `g10.store-cart-drawer.US14-TC12`. Task 2.1's component tests cover the scenarios behind `g10.store-cart-drawer.US14-TC7`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` and `g10.store-cart-drawer.US14-TC12`, and those cases are layer `e2e`. Nothing in the tasks decides `g10.store-cart-drawer.US14-TC5` or `g10.store-cart-drawer.US14-TC8`. Task 4.2 flips only what the walk decides, so the rest stay `manual` in Automation status, which is the backlog the governance names
- **Manual** - no `### Manual` table is written: no test exists to credit, and task 4.2 owes the rows after the walk
- **Domain suite** - leaves nothing to a domain case: `grade10-site/store/domain-tcs.md` traces no cart drawer journey, so no domain case walks this path
- **Out of suite** - none
- **Tasks and requirement** - every scenario is named in a task, and every clause of the requirement has a scenario except one. Not covered: the second paragraph's precedence of a session-end close over the redirecting state and the failed state is walked only on the path where checkout answers nobody, by `g10.store-cart-drawer.SC52` and `g10.store-cart-drawer.US14-TC9`; a session that ends in another tab while checkout creation is in flight, or after a refusal restored Checkout, has no scenario, case or task; Q9, Q10, Q12 and the reopen of Q11 have no scenario and no task of their own, and only `g10.store-cart-drawer.US14-TC8` touches Q10; the last clause of task 2.1 (Cart pressed again after the close starts a fresh review on the browser's cart) has no scenario and only `g10.store-cart-drawer.US14-TC2` behind it; tasks 4.1 and 4.2 name no decider for `g10.store-cart-drawer.US14-TC5`, `g10.store-cart-drawer.US14-TC8`, `g10.store-cart-drawer.US14-TC10`, `g10.store-cart-drawer.US14-TC11` or `g10.store-cart-drawer.US14-TC12` beyond the component tests; tasks 1.1 to 1.3 are documents and make no scenario pass

### Manual

| Manual | Why |
| --- | --- |
| `g10.store-cart-drawer.US10-TC1` | To be walked in Group 5.1's seeded browser regression after Groups 2-4 land; the batch and decoder assertions also need Groups 2.1 and 3.1 runtime tests. |
| `g10.store-cart-drawer.US10-TC9` | To be walked in Group 5.4's signed-out drawer check and guest transport tests. |
| `g10.store-cart-drawer.US10-TC2` | To be walked in Group 5.1's seeded browser regression with Group 3.1's unchanged-facts test. |
| `g10.store-cart-drawer.US10-TC3` | To be walked with the member legacy fixture in Group 4.1 and the production decoders in Group 2.1. |
| `g10.store-cart-drawer.US10-TC10` | To be walked with the guest legacy fixture in Group 4.1 and the production decoders in Group 2.1. |
| `g10.store-cart-drawer.US10-TC4` | To be walked in Group 5.1's restored-cart browser regression and Group 3.1's image-free intent test. |
| `g10.store-cart-drawer.US10-TC5` | To be walked in Group 3.1's member/guest intent and write-input tests. |
| `g10.store-cart-drawer.US10-TC6` | To be walked in Group 5.1's sold-out browser regression and Group 3.1's unchanged-facts test. |
| `g10.store-cart-drawer.US10-TC7` | To be walked in Group 5.1's failed-review browser regression and Group 4.1's pending/failure fixture tests. |
| `g10.store-cart-drawer.US10-TC8` | To be walked in Group 5.3's failed-image browser check after an accepted review. |
