# grade10-site/store/cart-drawer Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-store-cart-drawer-US01: Signed-in collector opens the current cart over the page

**As a** signed-in collector,
**I want** my current cart to open over the page I am on with current facts,
**so that** I can review what the shop can sell without losing my place.

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

## grade10-site-store-cart-drawer-US03: Signed-in collector continues from the cart drawer

**As a** signed-in collector,
**I want** the cart to take me to a product or checkout,
**so that** I can continue the shopping path I chose.

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

### grade10-site-store-cart-drawer-US03-TC03-1: Checkout opens the existing checkout surface

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-cart-drawer-US-03

**Pre-conditions:**

* The current cart holds an available line.
* The cart drawer's status-and-price read has succeeded.

**Steps:**

1. Activate **Checkout** in the cart drawer.

**Expected Results:**

* The drawer closes.
* The site's existing `/checkout` surface opens.
* The drawer creates no checkout; the checkout surface performs its own read and handoff.

---

## grade10-site-store-cart-drawer-US04: Signed-in collector reads tender choices for the reviewed basket

**As a** signed-in collector,
**I want** to see which promo codes and how many points the reviewed basket can take,
**so that** I can understand my available benefits before continuing to checkout.

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

**Steps:**

1. Open the cart drawer and wait for the review and promo-code read to finish.
2. Open the promo-code view.

**Expected Results:**

* Both current codes are shown.
* The applicable code is shown as usable and remains unselected.
* The inapplicable code shows the answer explaining why it cannot be used.
* No promo discount is shown in the drawer summary.

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

**Steps:**

1. Open the cart drawer and wait for the review and points read to finish.
2. Open the points view.

**Expected Results:**

* The balance, conversion rate, and maximum points and amount are shown.
* No points amount is applied.
* The subtotal and estimated total remain the reviewed subtotal.

### grade10-site-store-cart-drawer-US04-TC03-1: Unresolved reviews receive no tender facts

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

## Reconciliation

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
| grade10-site-store-cart-drawer-SC-17 | US04-TC02-1 |
| grade10-site-store-cart-drawer-SC-18 | US04-TC03-1 |
| grade10-site-store-cart-drawer-SC-19 | US04-TC04-1 |
| Uncovered anchors | none |
| Contradicted readings | none |
