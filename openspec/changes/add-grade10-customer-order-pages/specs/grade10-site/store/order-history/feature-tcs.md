# grade10-site/store/order-history Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-09-08, tcs-rules r2

## grade10-site-store-order-history-US1: Collector reviews active and past orders

**As a** signed-in collector,
**I want** my newest active and past Store orders in one place,
**so that** I can understand an order and decide whether to open it.

<!-- trace:case id=g10.store-order-history.TC-1mb rev=2 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j -->
### grade10-site-store-order-history-US1-TC1-2: Owned orders group and open newest first

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns active and past Store orders with different creation times; one order has different quoted and paid totals.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check both order groups and their order.
3. Check the order with different quoted and paid totals.
4. Click View Details for that order.

**Expected Results:**

* Only the signed-in user's orders appear, with Active above Past and each group newest first.
* The selected summary shows the paid total, not the quoted subtotal.
* Step 4 opens `/profile/orders/<order-id>` for the selected order.

<!-- trace:case id=g10.store-order-history.TC-lty rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j -->
### grade10-site-store-order-history-US1-TC2-1: Unknown total stays pending

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns a Store order with no paid amount and no quoted subtotal.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check that order's total.

**Expected Results:**

* The order says its total is pending.
* No zero amount is shown for that order.

<!-- trace:case id=g10.store-order-history.TC-k8f rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j -->
### grade10-site-store-order-history-US1-TC3-1: Safe carrier link opens in isolation

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns a Store order with <safe carrier tracking url>, an absolute `https` URL carrying no credentials.

**Steps:**

1. Navigate to `/profile/orders`.
2. Click Track Order for that order.

**Expected Results:**

* Track Order is present for that order.
* <safe carrier tracking url> opens in a new browser context.
* The carrier page has no access to the Grade10 page.

<!-- trace:case id=g10.store-order-history.TC-hve rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j -->
### grade10-site-store-order-history-US1-TC4-1: Tracking number alone creates no action

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns a Store order with a carrier and tracking number but no safe carrier URL.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check that order's actions.

**Expected Results:**

* Track Order is absent for that order.

<!-- trace:case id=g10.store-order-history.TC-7ws rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j -->
### grade10-site-store-order-history-US1-TC5-1: First order read remains loading

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The order read is delayed by network manipulation.

**Steps:**

1. Navigate to `/profile/orders`.
2. Check the page before the order read settles.

**Expected Results:**

* A loading state appears.
* The page does not claim the account has no orders.

<!-- trace:case id=g10.store-order-history.TC-uom rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j -->
### grade10-site-store-order-history-US1-TC6-1: Failed order read retries in place

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user's first order read is made to fail and the next read is allowed to complete.

**Steps:**

1. Navigate to `/profile/orders`.
2. Click Retry after the failure appears.

**Expected Results:**

* A localized error and Retry action appear after the first read.
* Step 2 reads the orders again at `/profile/orders`.

<!-- trace:case id=g10.store-order-history.TC-h4e rev=1 covers=g10.store-order-history.SC-u2y,g10.store-order-history.SC-zre,g10.store-order-history.SC-4i0,g10.store-order-history.SC-fun,g10.store-order-history.SC-yhz,g10.store-order-history.SC-3eo,g10.store-order-history.SC-71g,g10.store-order-history.SC-raj,g10.store-order-history.SC-ab2,g10.store-order-history.SC-dta,g10.store-order-history.SC-g9j -->
### grade10-site-store-order-history-US1-TC7-1: Customer label keeps the Store action id

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-order-history-US-01

**Pre-conditions:**
The signed-in user owns an order with Store id <store order id> and the shop order number state named by **Test data**.

**Test data:**

| Run | Shop order number | Expected customer label |
| --- | --- | --- |
| 1 | `#G10-10482` | `#G10-10482` |
| 2 | null | <store order id> |
| 3 | empty | <store order id> |

**Steps:**

1. Navigate to `/profile/orders`.
2. Check the selected order's customer label.
3. Click View Details for that order.

**Expected Results:**

* Step 2 shows <expected customer label> and invents no other order number.
* Step 3 opens `/profile/orders/<store order id>` in every run.

---

## grade10-site-store-order-history-US2: Collector signs in to the intended order page

**As a** signed-out collector,
**I want** sign-in to keep the Your Orders address,
**so that** I arrive at the orders I asked to see after proving my account.

<!-- trace:case id=g10.store-order-history.TC-xb7 rev=1 covers=g10.store-order-history.SC-si2 -->
### grade10-site-store-order-history-US2-TC1-1: Sign-in preserves Your Orders address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-02

**Pre-conditions:**
The user has no signed-in session and has an account with Store orders.

**Steps:**

1. Navigate to `/profile/orders`.
2. Complete sign-in.

**Expected Results:**

* The sign-in surface opens without replacing `/profile/orders`.
* Step 2 reveals that user's orders at `/profile/orders`.

---

## grade10-site-store-order-history-US3: Collector starts shopping from an empty account

**As a** signed-in collector with no Store orders,
**I want** an empty state that returns me to the Store,
**so that** I can begin a purchase instead of reaching a dead end.

<!-- trace:case id=g10.store-order-history.TC-2ez rev=1 covers=g10.store-order-history.SC-li6 -->
### grade10-site-store-order-history-US3-TC1-1: Empty account returns to the Store

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-history-US-03

**Pre-conditions:**
The signed-in user owns no Store orders.

**Steps:**

1. Navigate to `/profile/orders`.
2. Click Shop Now in the empty state.

**Expected Results:**

* The designed empty state appears after the order read succeeds.
* Step 2 opens `/store`.

## Reconciliation

**Run:** 2026-09-28. The existing order-history feature suite was reconciled
against the current order-history scenarios and the updated technical boundary.
The suite keeps customer-facing labels, navigation, tracking and read states at
the application boundary.

| Spec scenario | Suite coverage |
| --- | --- |
| `grade10-site-store-order-history-SC-01`, `SC-03`, `SC-04` | US1-TC1-2 |
| `grade10-site-store-order-history-SC-02` | US2-TC1-1 |
| `grade10-site-store-order-history-SC-05` | US1-TC2-1 |
| `grade10-site-store-order-history-SC-06` | US1-TC1-2 |
| `grade10-site-store-order-history-SC-07` | US1-TC3-1 |
| `grade10-site-store-order-history-SC-08` | US1-TC4-1 |
| `grade10-site-store-order-history-SC-09` | US1-TC5-1 |
| `grade10-site-store-order-history-SC-10` | US1-TC6-1 |
| `grade10-site-store-order-history-SC-11` | US3-TC1-1 |
| `grade10-site-store-order-history-SC-12`, `SC-13` | US1-TC7-1 |
| Uncovered scenarios | none |
| Contradicted readings | none |
