# grade10-site/commerce/commerce Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-09-05, tcs-rules r2

## g10.commerce-commerce.US1: Checkout and identity

**As a** shopper checking out a basket of any value,
**I want** to pay without being asked who I am,
**so that** a large basket checks out like any other.

<!-- trace:case id=g10.commerce-commerce.TC-cb7 rev=2 covers=g10.commerce-commerce.SC-7mb -->
### g10.commerce-commerce.US1-TC3: A checkout at any value asks nothing about identity

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
* **Trace:** Checkout and identity

**Pre-conditions:**

* The buyer is the one the row names.
* The cart holds goods worth the value the row names.

**Test data:**

| Buyer | Goods' value | Outcome |
| --- | --- | --- |
| Signed in, standing `unverified` | 480000 minor units | Proceeds as any other; no standing read |
| Signed in, standing `unverified` | 12500000 minor units | Proceeds as any other; no standing read |
| Signed in, standing `expired` | 12000000 minor units | Proceeds as any other; no standing read |
| Signed in, standing `verified` | 12500000 minor units | Proceeds as any other; no standing read |
| Guest, no session | 12500000 minor units | Proceeds as any other; not asked to sign in |

**Steps:**

1. Open the cart drawer.
2. Click the checkout button.
3. Read the calls the run made to the identity store.

**Expected Results:**

* The checkout proceeds as any other: the browser is handed to Shopify's checkout page.
* No standing was read, and no refusal or sign-in ask names the goods' value.

<!-- trace:case id=g10.commerce-commerce.TC-s62 rev=1 covers=none -->
### g10.commerce-commerce.US1-TC1: Verified buyer checks out at the bar as any other

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-commerce-US-06

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

<!-- trace:case id=g10.commerce-commerce.TC-01a rev=1 covers=none -->
### g10.commerce-commerce.US1-TC2: Buyer without a verified standing is sent to verify at and above the bar

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-commerce-commerce-US-06

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

<!-- trace:case id=g10.commerce-commerce.TC-u8b rev=2 covers=none -->
### g10.commerce-commerce.US1-TC4: Guest at the bar is asked to sign in and no order is made

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-commerce-commerce-US-06

**Pre-conditions:**

* No user is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| `<bar>` | 12000000 HKD minor units (HKD 120,000.00), the bar Grade10 sets on an order's goods |
| `<basket at the bar>` | A basket whose goods are worth exactly `<bar>` |
| `<a typed email>` | An email address belonging to no Grade10 account |

| `<way>` |
| --- |
| as a guest, with the basket alone |
| with `<a typed email>` |

**Steps:**

1. Request checkout for `<basket at the bar>` `<way>`, holding no session.
2. Read the checkout outcome.
3. Read the orders the store holds for that checkout.

**Expected Results:**

* The checkout is refused, and the buyer is asked to sign in.
* No order is made.

## Settled

- The checkout compares live goods value before creating an order.
- A checkout asks nothing about identity at any value; the identity bar applies to a bid alone.

## Reconciliation

Run: durable carry for add-account-identity-gate; the feature set, journey and suite were reconciled against the carried requirements.

- **Uncovered anchors:** none.
- **Deprecated** - `g10.commerce-commerce.US1-TC1`, `g10.commerce-commerce.US1-TC2` and `g10.commerce-commerce.US1-TC4`: the identity bar at checkout was dropped on 2026-10-13, so no scenario states them; they are kept `deprecated` with `covers=none`
- **Rewritten** - `g10.commerce-commerce.US1-TC3` covers `grade10-site-commerce-commerce-SC-28` at any value, guests included
- **One section** - nobody walks the capability once `grade10-site-commerce-commerce-US-06` is retired, so the suite carries `g10.commerce-commerce.US1`; each case keeps its number and its trace id: `grade10-site-commerce-commerce-US6-TC1`, `grade10-site-commerce-commerce-US6-TC2`, `grade10-site-commerce-commerce-US6-TC3` and `grade10-site-commerce-commerce-US6-TC4` are now `g10.commerce-commerce.US1-TC1` to `g10.commerce-commerce.US1-TC4`
