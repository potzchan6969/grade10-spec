# grade10-site/store/order-detail Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-08, tcs-rules r2

## grade10-site-store-order-detail-US1: Collector inspects one owned order

**As a** signed-in collector,
**I want** one trustworthy account of my Store order,
**so that** I can understand its items, money, fulfilment, refund, and tracking.

### grade10-site-store-order-detail-US1-TC1-3: Owned web order presents supplied settlement facts

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
The signed-in user owns <web order> with shop order number `#G10-10482`, quoted subtotal 10000, discount 500, shipping 1000, tax 700, and paid total 11200 minor units `HKD`. The order carries items, a complete shipping address, and a recognized Visa instrument with a masked number.

**Steps:**

1. Navigate to `/profile/orders/<web order id>`.
2. Check the order header, items, money summary, shipping address, and payment method.

**Expected Results:**

* <web order> appears with `#G10-10482`, its placed date, status, and items.
* Quoted subtotal shows 10000 minor units `HKD`.
* Discount shows 500 minor units `HKD` as a deduction, shipping shows 1000 minor units `HKD`, and tax shows 700 minor units `HKD`.
* Paid total remains 11200 minor units `HKD` separately.
* The supplied shipping address appears without a pickup claim.
* The Visa logo and masked number identify the supplied payment instrument.

### grade10-site-store-order-detail-US1-TC2-2: Missing and unowned ids share not-found

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

1. Navigate to `/profile/orders/<selected order id>`.
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

### grade10-site-store-order-detail-US1-TC10-1: Customer label keeps the Store route id

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with Store id <store order id> and the shop order number state named by **Test data**.

**Test data:**

| Run | Shop order number | Expected customer label |
| --- | --- | --- |
| 1 | `#G10-10482` | `#G10-10482` |
| 2 | null | <store order id> |
| 3 | empty | <store order id> |

**Steps:**

1. Navigate to `/profile/orders/<store order id>`.
2. Check the order header and browser address.

**Expected Results:**

* The header shows <expected customer label> and invents no other order number.
* The browser remains at `/profile/orders/<store order id>` in every run.

### grade10-site-store-order-detail-US1-TC11-1: Zero settlement rows differ from absent rows

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
The signed-in user owns two otherwise equivalent paid orders. <stated-zero order> supplies zero discount, shipping, and tax; <unstated order> supplies null for all three.

**Steps:**

1. Open <stated-zero order> and check its money summary.
2. Open <unstated order> and check its money summary.

**Expected Results:**

* Step 1 shows Discount, Shipping, and Tax as stated zeroes.
* Step 2 omits Discount, Shipping, and Tax.
* Each order's paid total remains the charge.

### grade10-site-store-order-detail-US1-TC12-1: Partial shipping address draws no blanks

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
The signed-in user owns an order whose shipping address supplies address line 1, city, and country, but no recipient, address line 2, province, postal code, or phone.

**Steps:**

1. Navigate to that order's detail address.
2. Check the address section.

**Expected Results:**

* The supplied address line 1, city, and country appear in postal order.
* No blank recipient, placeholder line, or pickup-address claim appears.

### grade10-site-store-order-detail-US1-TC13-1: Payment presentation preserves provider identity

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
* **Trace:** grade10-site-store-order-detail-US-01

**Pre-conditions:**
The signed-in user owns an order with the payment instrument named by **Test data**.

**Test data:**

| Run | Instrument | Expected presentation |
| --- | --- | --- |
| 1 | Visa company and masked card number | Visa logo and masked number |
| 2 | Apple Pay wallet, Mastercard company, and masked device-account number | Apple Pay identity and masked number together |
| 3 | Unrecognized `UnionPay` company and masked number | `UnionPay` text and masked number, with no unrelated logo |

**Steps:**

1. Navigate to that order's detail address.
2. Check the Payment Method section.

**Expected Results:**

* The section matches <expected presentation>.
* No card or wallet identity is inferred beyond the supplied instrument.

---

## grade10-site-store-order-detail-US2: Collector signs in to the requested order

**As a** signed-out collector,
**I want** sign-in to keep the order address I opened,
**so that** I can continue to that order after proving my account.

### grade10-site-store-order-detail-US2-TC1-2: Sign-in preserves the requested order address

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

1. Navigate to `/profile/orders/<requested order id>`.
2. Complete sign-in.

**Expected Results:**

* The sign-in surface opens without replacing the requested order address.
* Step 2 reads <requested order> at the same address.
