# grade10-site/store/order-history Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-10-22, tcs-rules r6

## Walk 1: Read Your Orders

**Starting state:**

- customer(signed-in member) is on `<your orders url>` on staging.
- The member has `<shipped order>`, `<processing order>`, `<completed order>` and `<canceled order>`, placed on known dates.

**Shared test data:**

| Field | Value |
| --- | --- |
| `your orders url` | The staging site's `/profile/orders`. |
| `shipped order` | A paid web order, shipped, with a safe carrier address. |
| `processing order` | A paid web order, not yet shipped, newer than `<shipped order>`. |
| `completed order` | A completed web order. |
| `canceled order` | A canceled web order, newer than `<completed order>`. |

### Route

1. Read the two groups from top to bottom.
   - Record each order's group and order `g10.store-order-history.US1-TC1`
2. Click View Details on `<shipped order>`, then press Back.
   - Record the order's own page opening `g10.store-order-history.US1-TC3`
3. Click Track Order on `<shipped order>`.
   - Record the carrier's page opening `g10.store-order-history.US1-TC3`

## g10.store-order-history.US1: Find my orders

**As a** customer,
**I want** one place in my account that lists my Store purchases,
**so that** I can find and open any of them after checkout.

<!-- trace:case id=g10.store-order-history.TC-gdz rev=1 -->
### g10.store-order-history.US1-TC1: Active orders list above past ones, newest first in each

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-history.US1

**Pre-conditions:**

* customer(signed-in member) has `<order>` and `<newer order>` in the state its row describes, `<newer order>` placed later.

**Test data:**

| Partition | `<order state>` | `<expected group>` |
| --- | --- | --- |
| Processing | Paid, not shipped. | Active |
| Shipped | Shipped, not completed. | Active |
| Held | Held, whatever its refund. | Active |
| Partly refunded, items owed | Refunded in part, items still to send. | Active |
| Completed | Completed. | Past |
| Canceled | Canceled. | Past |
| Refunded in full | Refunded in full. | Past |
| Partly refunded, all sent | Refunded in part, every item fulfilled. | Past |

**Steps:**

1. Navigate to `<your orders url>`.
2. Read the Active Orders group, then the Past Orders group.

**Expected Results:**

* Active Orders lists above Past Orders.
* `<order>` and `<newer order>` list under `<expected group>`.
* `<newer order>` lists above `<order>`.

<!-- trace:case id=g10.store-order-history.TC-zbs rev=1 -->
### g10.store-order-history.US1-TC3: View Details opens the order; Track Order only when safe

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
* **Testability:** automation, manual
* **Trace:** g10.store-order-history.US1

**Pre-conditions:**

* customer(signed-in member) has `<order>` with `<carrier address>`.

**Test data:**

| Partition | `<carrier address>` | `<expected track>` |
| --- | --- | --- |
| Safe | A carrier's `https` tracking address. | Track Order opens it. |
| Not safe | A `javascript:` address. | No Track Order. |
| None | No tracking supplied. | No Track Order. |

**Steps:**

1. Navigate to `<your orders url>`.
2. Click View Details on `<order>`.
3. Return to `<your orders url>`.
4. Read `<order>`'s actions.

**Expected Results:**

* Step 2 opens `/profile/orders/<order id>`.
* Step 4 matches `<expected track>`.

---

## Ungrouped

### g10.store-order-history.US1: Find my orders

**As a** customer,
**I want** one place in my account that lists my Store purchases,
**so that** I can find and open any of them after checkout.

<!-- trace:case id=g10.store-order-history.TC-xzr rev=1 -->
#### g10.store-order-history.US1-TC2: Signing in from Your Orders comes back to it

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
* **Trace:** g10.store-order-history.US1

**Pre-conditions:**

* customer(signed out) holds a member account with orders.

**Steps:**

1. Navigate to `<your orders url>`.
2. Sign in.
3. Read the address bar and the page.

**Expected Results:**

* Step 1 asks the customer to sign in.
* Step 3's address is `<your orders url>`.
* Step 3 lists the member's orders.

<!-- trace:case id=g10.store-order-history.TC-ykc rev=1 -->
#### g10.store-order-history.US1-TC4: A web checkout lists only once the shop records the order

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
* **Trace:** g10.store-order-history.US1

**Pre-conditions:**

* customer(signed-in member) has opened Shopify's checkout for `<product A>`.

**Test data:**

| Partition | `<checkout end>` | `<expected list>` |
| --- | --- | --- |
| Paid | Pay with the payment provider's published test card that succeeds. | The new order, at the top of Active Orders. |
| Refused | Pay with the payment provider's published test card that is declined. | No new order. |
| Left to expire | Leave the invoice unpaid until it expires. | No new order. |

**Steps:**

1. Do `<checkout end>`.
2. Navigate to `<your orders url>`.
3. Read Active Orders.

**Expected Results:**

* Step 3 shows `<expected list>`.

<!-- trace:case id=g10.store-order-history.TC-svt rev=1 -->
#### g10.store-order-history.US1-TC5: Loading, a failed read with Retry, and empty stay distinct

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
* **Trace:** g10.store-order-history.US1

**Pre-conditions:**

* customer(signed-in member) has orders.
* The orders read is `<read state>`.

**Test data:**

| Partition | `<read state>` | `<expected page>` |
| --- | --- | --- |
| Pending | Held pending. | Loading, with no empty message. |
| Failed | Failing once, then answering. | A failure in the site's language, with Retry. |

**Steps:**

1. Navigate to `<your orders url>`.
2. Read the page.
3. Click Retry, where offered.
4. Read the page and the address bar.

**Expected Results:**

* Step 2 shows `<expected page>`.
* For the failed row, step 4 lists the orders.
* Step 4's address is `<your orders url>`.

<!-- trace:case id=g10.store-order-history.TC-cbg rev=1 -->
#### g10.store-order-history.US1-TC6: An account with no orders offers a way back to the Store

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
* **Trace:** g10.store-order-history.US1

**Pre-conditions:**

* customer(signed-in member) has no Store orders and no guest orders under the account's email.

**Steps:**

1. Navigate to `<your orders url>`.
2. Read the page.
3. Click Shop Now.

**Expected Results:**

* Step 2 says there are no orders yet.
* Step 3 opens the Store.

---

### g10.store-order-history.US2: Find the orders I placed as a guest

**As a** customer,
**I want** my guest orders listed in my account once it proves their email,
**so that** every purchase I made is in one place.

<!-- trace:case id=g10.store-order-history.TC-2qs rev=1 -->
#### g10.store-order-history.US2-TC1: A guest order joins the account that proves its email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-history.US2

**Pre-conditions:**

* customer(signed out) paid `<guest order A>` and `<guest order B>` as a guest under `<order email>`.
* `<account state>`.

**Test data:**

| Partition | `<account state>` | `<sign-in>` |
| --- | --- | --- |
| Account existed at payment | An account under `<order email>` existed when the orders were paid. | Any sign-in to that account. |
| Account made later, magic link | No account existed at payment. | A magic link sent to `<order email>`. |
| Account made later, Google | No account existed at payment. | A Google account under `<order email>`. |

**Steps:**

1. Sign in by `<sign-in>`.
2. Navigate to `<your orders url>`.
3. Read the list.

**Expected Results:**

* Step 3 lists `<guest order A>` and `<guest order B>`.

<!-- trace:case id=g10.store-order-history.TC-eq2 rev=1 -->
#### g10.store-order-history.US2-TC2: Guest orders under another email do not join

Runs once per row of **Test data**.

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
* **Trace:** g10.store-order-history.US2

**Pre-conditions:**

* `<member>`'s account holds `<account email>`.
* `<guest order>` was paid as a guest under `<order email>`.

**Test data:**

| Partition | `<order email>` | `<sign-in>` |
| --- | --- | --- |
| Another person's email | An email no account of `<member>` holds. | `<member>`'s own sign-in. |
| A changed Google email | The new email of `<member>`'s Google account, the account still holding the old one. | Google, as `<member>`. |

**Steps:**

1. Sign in by `<sign-in>`.
2. Navigate to `<your orders url>`.
3. Read the list.

**Expected Results:**

* Step 3 does not list `<guest order>`.

<!-- trace:case id=g10.store-order-history.TC-pea rev=1 -->
#### g10.store-order-history.US2-TC3: A joined guest order earns no points

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
* **Trace:** g10.store-order-history.US2

**Pre-conditions:**

* customer(signed-in member) holds a known points balance.
* `<guest order>` was paid as a guest under the member's email and has joined the account.

**Steps:**

1. Complete `<guest order>` in the staging shop's admin.
2. Read the member's points balance.
3. Open `<guest order>` from `<your orders url>`.

**Expected Results:**

* Step 2 is unchanged.
* Step 3 shows no points section.
