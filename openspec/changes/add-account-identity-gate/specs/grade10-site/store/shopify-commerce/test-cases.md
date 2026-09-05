# grade10-site/store/shopify-commerce Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-05, tcs-rules r2

## grade10-site-store-shopify-commerce-US6: Shopper meets the identity bar at checkout

**As a** shopper buying goods worth the bar or more,
**I want** to be told before paying that a verified identity is needed, and where to get one,
**so that** I am not charged for an order the store cannot complete, and I know what to do next.

### grade10-site-store-shopify-commerce-US6-TC1-1: Verified buyer checks out at the bar as any other

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
* **Trace:** grade10-site-store-shopify-commerce-US-06

**Pre-conditions:**

* The user is signed in on `<a verified account>`.
* The user's cart holds `<basket at the bar>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified account>` | An account whose standing is `verified` on the day of the checkout |
| `<bar>` | 12000000 HKD minor units (HKD 120,000.00), the bar Grade10 sets on an order's goods |
| `<basket at the bar>` | A basket whose goods are worth exactly `<bar>` |

**Steps:**

1. Open the cart drawer.
2. Click the checkout button.

**Expected Results:**

* The checkout proceeds as any other: the browser is handed to Shopify's checkout page.
* No refusal names `<bar>`.

### grade10-site-store-shopify-commerce-US6-TC2-1: Buyer without a verified standing is sent to verify at and above the bar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-shopify-commerce-US-06

**Pre-conditions:**

* The user is signed in on an account whose standing is the one the row names.
* The user's cart holds goods worth the value the row names.

**Test data:**

| Standing | Goods' value | Outcome |
| --- | --- | --- |
| `unverified` | 12000000 minor units, exactly `<bar>` | Refused; sent to the account to verify |
| `unverified` | 12500000 minor units, above `<bar>` | Refused; sent to the account to verify |
| `expired` | 12000000 minor units, exactly `<bar>` | Refused; sent to the account to verify |
| `expired` | 12500000 minor units, above `<bar>` | Refused; sent to the account to verify |

**Steps:**

1. Open the cart drawer.
2. Click the checkout button.
3. Read the checkout page.
4. Follow the way to the account it offers.
5. Navigate to `<grade10 order history url>`.

**Expected Results:**

* The checkout is refused, naming `<bar>` and the goods' value.
* Step 4 opens `<grade10 account page url>`.
* No order was made for the checkout — none appears at `<grade10 order history url>`.

### grade10-site-store-shopify-commerce-US6-TC3-1: Basket below the bar asks nothing of any buyer

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-shopify-commerce-US-06

**Pre-conditions:**

* The user is signed in on an account whose standing is the one the row names.
* The user's cart holds goods worth the value the row names.

**Test data:**

| Standing | Goods' value | Outcome |
| --- | --- | --- |
| `unverified` | 480000 minor units, below `<bar>` | Proceeds as any other; no standing read |
| `expired` | 480000 minor units, below `<bar>` | Proceeds as any other; no standing read |
| `verified` | 480000 minor units, below `<bar>` | Proceeds as any other; no standing read |

**Steps:**

1. Open the cart drawer.
2. Click the checkout button.
3. Read the calls the run made to the identity store.

**Expected Results:**

* The checkout proceeds as any other: the browser is handed to Shopify's checkout page.
* No standing was read.

### grade10-site-store-shopify-commerce-US6-TC4-1: Guest at the bar is asked to sign in and no order is made

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-shopify-commerce-US-06

**Pre-conditions:**

* No user is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| `<bar>` | 12000000 HKD minor units (HKD 120,000.00), the bar Grade10 sets on an order's goods |
| `<basket at the bar>` | A basket whose goods are worth exactly `<bar>` |
| `<a typed email>` | An email address belonging to no Grade10 account |

**Steps:**

1. Request checkout for `<basket at the bar>` with `<a typed email>`, holding no session.
2. Read the checkout outcome.
3. Read the orders the store holds for that checkout.

**Expected Results:**

* The checkout is refused, and the buyer is asked to sign in.
* No order is made.
