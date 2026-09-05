# grade10-site/store/order-detail Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-05, tcs-rules r2

## grade10-site-store-order-detail-US1: Collector inspects one owned order

**As a** signed-in collector,
**I want** one trustworthy account of my Store order,
**so that** I can understand its items, money, fulfilment, refund, and tracking.

### grade10-site-store-order-detail-US1-TC1-1: Owned web order preserves quoted and paid totals

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns <web order>, quoted at 10000 minor units `HKD` and paid at 11200 minor units `HKD`.

**Steps:**

1. Navigate to `/store/orders/<web order id>`.
2. Check the order header, items, and money summary.

**Expected Results:**

* <web order> appears with its id, placed date, status, and items.
* Quoted subtotal shows 10000 minor units `HKD`.
* Paid total shows 11200 minor units `HKD` separately.

### grade10-site-store-order-detail-US1-TC2-1: Missing and unowned ids share not-found

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The user is signed in; the selected order id is in the state named by **Test data**.

**Test data:**

| Run | Order id state |
| --- | --- |
| 1 | <unknown order id> names no order |
| 2 | <unowned order id> names an order owned by another account |

**Steps:**

1. Navigate to `/store/orders/<selected order id>`.
2. Check the rendered page.

**Expected Results:**

* The same not-found treatment appears in both runs.
* The page does not say whether the selected id exists.

### grade10-site-store-order-detail-US1-TC3-1: Partial refund stays separate from the charge

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order paid at 11200 minor units `HKD` and refunded by 2000 minor units `HKD`.

**Steps:**

1. Navigate to that order's detail address.
2. Check the money summary.

**Expected Results:**

* Paid total remains 11200 minor units `HKD`.
* Refund shows 2000 minor units `HKD` separately.

### grade10-site-store-order-detail-US1-TC4-1: Point-of-sale order invents no web facts

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns a point-of-sale order with a paid total but no quoted subtotal or line items.

**Steps:**

1. Navigate to that order's detail address.
2. Check the item area and summary.

**Expected Results:**

* Paid total appears.
* No zero subtotal or empty product row appears.
* No payment method or shipping address is invented.

### grade10-site-store-order-detail-US1-TC5-1: Missing optional facts leave no placeholders

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with no payment method, address, discount, shipping charge, tax, product image, or loyalty amount.

**Steps:**

1. Navigate to that order's detail address.
2. Check the order facts and optional sections.

**Expected Results:**

* Available order facts appear.
* Unavailable sections and rows are omitted.
* No placeholder is presented as a known order fact.

### grade10-site-store-order-detail-US1-TC6-1: Delivery estimate and safe tracking stay distinct

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an undelivered order with an estimated delivery date and <safe carrier tracking url>, an absolute `https` URL carrying no credentials.

**Steps:**

1. Navigate to that order's detail address.
2. Check fulfilment progress.
3. Click Track Order.

**Expected Results:**

* The date is identified as an estimate and delivery is not completed.
* <safe carrier tracking url> opens in a new browser context.
* The carrier page has no access to the Grade10 page.

### grade10-site-store-order-detail-US1-TC7-1: Tracking data without a safe URL stays inactive

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with a carrier and tracking number but no safe carrier URL.

**Steps:**

1. Navigate to that order's detail address.
2. Check the fulfilment actions.

**Expected Results:**

* Track Order does not appear.

### grade10-site-store-order-detail-US1-TC8-1: First detail read remains loading

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The owned-order read is delayed by network manipulation.

**Steps:**

1. Navigate to that order's detail address.
2. Check the page before the read settles.

**Expected Results:**

* A loading state appears.
* The page does not claim the order is missing.

### grade10-site-store-order-detail-US1-TC9-1: Failed detail read retries at the same address

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The first owned-order read is made to fail and the next read is allowed to complete.

**Steps:**

1. Navigate to that order's detail address.
2. Click Retry after the failure appears.

**Expected Results:**

* A localized error and Retry action appear after the first read.
* Step 2 reads the same order again without changing its address.

---

## grade10-site-store-order-detail-US2: Collector signs in to the requested order

**As a** signed-out collector,
**I want** sign-in to keep the order address I opened,
**so that** I can continue to that order after proving my account.

### grade10-site-store-order-detail-US2-TC1-1: Sign-in preserves the requested order address

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
* **Trace:** grade10-site-store-order-detail-US-02

**Pre-conditions:**
The user has no signed-in session and owns <requested order>.

**Steps:**

1. Navigate to `/store/orders/<requested order id>`.
2. Complete sign-in.

**Expected Results:**

* The sign-in surface opens without replacing the requested order address.
* Step 2 reads <requested order> at the same address.
