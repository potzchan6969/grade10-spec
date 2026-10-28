---
title: Store Order History Test Cases
---

# grade10-site/store/order-history Test Cases

**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/order-history, grade10-site/store/checkout

## Background

* `<your orders url>` is `<g10url>/profile/orders`.

## Walk 1: Read Your Orders

**Starting state:**

- customer(signed-in member) on `<your orders url>`, with `<shipped order>`, `<processing order>`, `<completed order>` and `<canceled order>`, placed on known dates

**Shared test data:**

| Field | Value |
| --- | --- |
| `<shipped order>` | a paid web order, shipped, with an `https` carrier address |
| `<processing order>` | a paid web order, not yet shipped, newer than `<shipped order>` |
| `<completed order>` | a completed web order |
| `<canceled order>` | a canceled web order, newer than `<completed order>` |

### Route

1. Read the two groups from top to bottom.
   - Each order sits in its group, newest first `g10.store-order-history.TC1`
2. Select View Details on `<shipped order>`, go back, then select Track Order.
   - The order's page opens, then the carrier's page `g10.store-order-history.TC2`

## order-history#orders: Orders

<!-- trace:case id=g10.store-order-history.TC-gdz rev=1 -->
### g10.store-order-history.TC1: Active orders list above past ones, newest first in each

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has `<order>` and `<newer order>` in the row's state, `<newer order>` placed later.

**Test data:**

| Both orders | Group |
| --- | --- |
| paid, not shipped | Active |
| shipped, not completed | Active |
| held, whatever its refund | Active |
| refunded in part, items still to send | Active |
| completed | Past |
| canceled | Past |
| refunded in full | Past |
| refunded in part, every item fulfilled | Past |

**Steps:**

1. Open `<your orders url>`.
2. Read Active Orders, then Past Orders.

**Expected Results:**

* Active Orders lists above Past Orders, UI matching store-order-history-screens-order-history--filled.
* Both orders list under the row's group, `<newer order>` above `<order>`; the other group shows no heading, and no empty message shows.

<!-- trace:case id=g10.store-order-history.TC-zbs rev=2 -->
### g10.store-order-history.TC2: View Details opens the order, and Track Order opens a safe carrier page

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has `<shipped order>`, whose carrier address is an `https` tracking address.

**Steps:**

1. On `<your orders url>`, select View Details on `<shipped order>`, then go back.
2. Select Track Order on `<shipped order>`.

**Expected Results:**

* Step 1 opens `/profile/orders/<order id>`, and Back returns to `<your orders url>`.
* Step 2 opens the carrier's tracking page, UI matching store-order-history-blocks-orderhistorycardheader--with-track-order.

---

## Ungrouped

### order-history#orders: Orders

#### g10.store-order-history.TC3: An order with no carrier address offers no Track Order

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has `<completed order>`, for which the shop supplied no tracking address.

**Steps:**

1. On `<your orders url>`, read `<completed order>`'s actions.

**Expected Results:**

* View Details only, and no Track Order, UI matching store-order-history-blocks-orderhistorycard--completed-without-track.

<!-- trace:case id=g10.store-order-history.TC-xzr rev=1 -->
#### g10.store-order-history.TC4: Signing in from Your Orders comes back to it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed out) holds a member account with orders.

**Steps:**

1. Open `<your orders url>`.
2. Sign in.

**Expected Results:**

* Step 1 asks the customer to sign in.
* Step 2 returns to `<your orders url>`, listing the member's orders.

<!-- trace:case id=g10.store-order-history.TC-ykc rev=2 -->
#### g10.store-order-history.TC5: A paid web checkout lists once the shop records the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has opened Shopify's checkout for `<product A>`.

**Steps:**

1. Pay with the payment provider's published test card that succeeds.
2. Open `<your orders url>`.

**Expected Results:**

* Step 2 lists the new order at the top of Active Orders.

#### g10.store-order-history.TC6: A checkout that fails or expires never lists

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has opened Shopify's checkout for `<product A>`.

**Test data:**

| Checkout ends |
| --- |
| paid with the provider's published test card that is declined |
| left unpaid until the invoice expires |

**Steps:**

1. End the checkout as the row says.
2. Open `<your orders url>`.

**Expected Results:**

* Step 2 lists no new order.

<!-- trace:case id=g10.store-order-history.TC-svt rev=2 -->
#### g10.store-order-history.TC7: While the orders load, the page shows loading, never empty

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has orders; the orders read is held in flight.

**Steps:**

1. Open `<your orders url>`.

**Expected Results:**

* The page shows it is loading, with no empty message, UI matching store-order-history-screens-order-history--loading.

#### g10.store-order-history.TC8: A failed read says so, and Retry lists the orders at the same address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has orders; the orders read fails once, then answers.

**Steps:**

1. Open `<your orders url>`.
2. Select Retry.

**Expected Results:**

* Step 1: a failure message in the site's language, with Retry, UI matching store-order-history-screens-order-history--recoverable-failure.
* Step 2 lists the orders, and the address is still `<your orders url>`.

<!-- trace:case id=g10.store-order-history.TC-cbg rev=1 -->
#### g10.store-order-history.TC9: An account with no orders offers a way back to the Store

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has no Store orders and no guest orders under the account's email.

**Steps:**

1. Open `<your orders url>`.
2. Select Shop Now.

**Expected Results:**

* Step 1 says there are no orders yet, with no Active or Past heading, UI matching store-order-history-blocks-orderhistory--empty.
* Step 2 opens the Store.

<!-- trace:case id=g10.store-order-history.TC-sw9 rev=1 -->
#### g10.store-order-history.TC10: Each order shows the badge for its status

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#orders

**Pre-conditions:**

* customer(signed-in member) has `<order>` in the row's state.

**Test data:**

| `<order>` | Badge |
| --- | --- |
| paid, not yet fulfilled | Processing |
| on hold, refunded in part | Processing |
| some items fulfilled, paid in full | Shipped |
| every item fulfilled, not paid in full | Shipped |
| every item fulfilled and paid in full | Completed |
| canceled | Canceled |
| refunded in part, not on hold or scheduled | Refunded |
| refunded in full | Refunded |
| a pick-up order, paid, not yet fulfilled | Processing, and no pick-up badge |

**Steps:**

1. On `<your orders url>`, read `<order>`'s badge.
2. Select View Details and read the badge there.

**Expected Results:**

* Both read the row's badge, UI matching store-order-history-blocks-orderhistorystatus--all-statuses.

---

### order-history#product-pictures: Product Pictures

#### g10.store-order-history.TC11: Order items show their current product pictures, or a placeholder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-history#product-pictures

**Pre-conditions:**

* customer(signed-in member) has an order holding the row's item.

**Test data:**

| Item | Shown |
| --- | --- |
| a product whose picture has changed since the purchase | its current picture, as the cart shows it |
| a product with no picture | the placeholder, UI matching store-order-history-blocks-orderhistorylineitem--without-image, with the order still readable |
| more items than fit across the order's card | every item reached by scrolling across, faded at the edge it continues past, UI matching store-order-history-blocks-orderhistorycard--overflowing-lines |

**Steps:**

1. On `<your orders url>`, read the order's items.

**Expected Results:**

* The row's picture; each item shows its name and total beside it.

---

### checkout#guest-checkout: Guest Checkout

<!-- trace:case id=g10.store-order-history.TC-2qs rev=1 -->
#### g10.store-order-history.TC12: A guest order joins the account that proves its email, and earns no points

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#guest-checkout

**Pre-conditions:**

* customer(signed out) paid `<guest order A>` and `<guest order B>` as a guest under `<order email>`; the member's points balance is known.

**Test data:**

| Account | Signs in by |
| --- | --- |
| existed under `<order email>` when the orders were paid | any sign-in to it |
| made later | a sign-in link sent to `<order email>` |
| made later | a Google account under `<order email>` |

**Steps:**

1. Sign in as the row says.
2. Open `<your orders url>`.
3. Complete `<guest order A>` in the shop's admin, then read the points balance and open the order.

**Expected Results:**

* Step 2 lists both orders, UI matching store-order-history-screens-order-history--with-guest-orders.
* Step 3: the balance is unchanged, and the order shows no points section.

<!-- trace:case id=g10.store-order-history.TC-eq2 rev=1 -->
#### g10.store-order-history.TC13: A guest order under another email does not join

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#guest-checkout

**Pre-conditions:**

* `<member>`'s account holds `<account email>`; `<guest order>` was paid as a guest under the row's email.

**Test data:**

| Order email | Signs in by |
| --- | --- |
| an email no account of `<member>` holds | `<member>`'s own sign-in |
| the new email of `<member>`'s Google account, the account still holding the old one | Google, as `<member>` |

**Steps:**

1. Sign in as the row says.
2. Open `<your orders url>`.

**Expected Results:**

* `<guest order>` is not listed.
