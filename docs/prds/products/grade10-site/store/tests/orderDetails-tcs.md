---
title: Store Order Detail Test Cases
---

# grade10-site/store/order-detail Test Cases

**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/order-detail

## Walk 1: A guest back from checkout

**Starting state:**

- customer(signed out) with `<guest product>` in this browser's cart, no account under `<order email>`, reading mail at `<order email>`

**Shared test data:**

| Field | Value |
| --- | --- |
| `<guest product>` | a card for sale |
| `<order email>` | a test mailbox no Grade10 account holds |

### Route

1. Check out as a guest under `<order email>`, pay with the payment provider's published test card that succeeds, then select Continue on Shopify's thank-you page.
   - The private order page opens `g10.store-order-detail.TC12`
2. Read the placed-on line and the toast.
   - The receipt line and the account ask `g10.store-order-detail.TC13`
3. Select Sign in on the toast and sign in by the link sent to `<order email>`.
   - The toast says the order was added, with a way to it `g10.store-order-detail.TC15`
4. Open View order in Shopify's order email, in a private window.
   - The order page signed out, with no points, wallet or account facts `g10.store-order-detail.TC8`

## order-detail#order-link: Order Link

<!-- trace:case id=g10.store-order-detail.TC-4hw rev=2 -->
### g10.store-order-detail.TC8: Signed out, a link holder sees the order, a sign-in ask, and no account facts

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/signed-out, order-detail#order-link/no-account-facts

**Pre-conditions:**

* customer(signed out) holds the View order link for `<order>` from Shopify's order email.

**Test data:**

| `<order>` | Toast |
| --- | --- |
| paid as a guest under `<order email>` | asks to add this order to an account, UI matching store-order-detail-screens-order-link--guest-order |
| paid by a member, earning points, 100 points put toward it | asks to sign in to see it, UI matching store-order-detail-screens-order-link--member-order-signed-out |

**Steps:**

1. Open the View order link.
2. Close the toast and reload.

**Expected Results:**

* Step 1: the address is `/orders/<order id>` with its secret after `#`; the items, totals and a placed-on line naming the receipt's email; the row's toast with one Sign in action.
* Step 1 shows no Points to Earn, no Points Earned, no Points row, and no wallet or account details.
* Step 2 shows no toast for this order.

<!-- trace:case id=g10.store-order-detail.TC-frp rev=2 -->
### g10.store-order-detail.TC13: Signed out, an order page shows the receipt line and the account toast

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/receipt-line, order-detail#order-link/account-toast, order-detail#order-link/joined-at-payment, order-detail#order-link/signed-out-only

**Pre-conditions:**

* `<order>` was paid as a guest under `<order email>`, in the row's state; customer is signed out.

**Test data:**

| `<order>` | Opened | Toast |
| --- | --- | --- |
| no account under `<order email>` | back from checkout | asks to add this order to an account |
| an account under `<order email>` existed at payment | back from checkout | asks to sign in to see it |
| no account under `<order email>` | from the order email a day later | asks to add this order to an account |

**Steps:**

1. Open `<order>`'s page as the row says.
2. Close the toast and reload.

**Expected Results:**

* Step 1: `Placed on <date>. Receipt sent to <order email>.`, and the row's toast with one Sign in action.
* Step 2 shows no toast for this order.

<!-- trace:case id=g10.store-order-detail.TC-qu5 rev=1 -->
### g10.store-order-detail.TC15: A sign-in that proves the order's email adds the order to the account

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/added

**Pre-conditions:**

* customer(signed out) is on `<order>`'s page after a guest checkout under `<order email>`.

**Test data:**

| Signs in by |
| --- |
| the sign-in link to `<order email>`, in this browser |
| the sign-in link to `<order email>`, on another device |
| a Google account under `<order email>` |

**Steps:**

1. Select Sign in on the toast and sign in as the row says.
2. Follow the toast's way to the order, on the device that signed in.

**Expected Results:**

* Step 1: the toast says the order was added to the account.
* Step 2 opens `/profile/orders/<order id>`.

---

## order-detail#back-from-checkout: Back From Checkout

<!-- trace:case id=g10.store-order-detail.TC-0pz rev=1 -->
### g10.store-order-detail.TC12: Continue opens the order this browser just paid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#back-from-checkout/latest-order, order-detail#back-from-checkout/guest, order-detail#back-from-checkout/member

**Pre-conditions:**

* customer, as the row says, has just paid `<order>` on Shopify's page in this browser.

**Test data:**

| Customer | Opens |
| --- | --- |
| signed out | `/orders/<order id>`, with its secret, UI matching store-order-detail-screens-order-link--just-paid |
| signed-in member | `/profile/orders/<order id>` |

**Steps:**

1. Select Continue on Shopify's thank-you page.

**Expected Results:**

* The address passes through `/orders/latest`, then shows the row's page with `<order>`.

---

## Ungrouped

### order-detail#order: Order

<!-- trace:case id=g10.store-order-detail.TC-tb1 rev=1 -->
#### g10.store-order-detail.TC1: The owner sees the order's supplied facts, and no group for a missing one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order/known-facts

**Pre-conditions:**

* customer(signed-in member) owns `<order>`, holding the row's facts.

**Test data:**

| `<order>` supplies | Shown |
| --- | --- |
| items, totals, a refund, fulfilment, an estimate, tracking, address and payment | each of those, UI matching store-order-detail-screens-order-details--filled |
| identity, items and totals only | those, and no empty group for the rest, UI matching store-order-detail-blocks-orderdetails--no-optional-groups |

**Steps:**

1. Open `/profile/orders/<order id>`.

**Expected Results:**

* The order number and the row's groups.

<!-- trace:case id=g10.store-order-detail.TC-f9c rev=1 -->
#### g10.store-order-detail.TC2: Another collector's order and an unknown order look the same

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order/owner-only-address

**Pre-conditions:**

* customer(signed-in member A) is signed in.

**Test data:**

| Order id |
| --- |
| one member B owns |
| one no order has |

**Steps:**

1. Open `/profile/orders/<row's id>`.

**Expected Results:**

* The not-found state with no order facts, the same for both rows, UI matching store-order-detail-screens-order-details--not-found-without-disclosure.

<!-- trace:case id=g10.store-order-detail.TC-ek8 rev=1 -->
#### g10.store-order-detail.TC3: Signing in from an order's address comes back to it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order/owner-only-address

**Pre-conditions:**

* customer(signed out) owns `<order>` through a member account.

**Steps:**

1. Open `/profile/orders/<order id>` and sign in.

**Expected Results:**

* The address is `/profile/orders/<order id>`, showing `<order>`.

<!-- trace:case id=g10.store-order-detail.TC-j3h rev=2 -->
#### g10.store-order-detail.TC4: While the order loads, the page shows loading, not not-found

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** order-detail#order/read-states

**Pre-conditions:**

* customer(signed-in member) owns `<order>`; the order read is held in flight.

**Steps:**

1. Open `/profile/orders/<order id>`.

**Expected Results:**

* Loading, UI matching store-order-detail-screens-order-details--loading, and not the not-found state.

#### g10.store-order-detail.TC5: A failed read says so, and Retry shows the order at the same address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** order-detail#order/read-states

**Pre-conditions:**

* customer(signed-in member) owns `<order>`; the order read fails once, then answers.

**Steps:**

1. Open `/profile/orders/<order id>`.
2. Select Retry.

**Expected Results:**

* Step 1: a failure in the site's language, with Retry, UI matching store-order-detail-screens-order-details--recoverable-failure, and not the not-found state.
* Step 2 shows `<order>`, and the address is unchanged.

---

### order-detail#delivery-status: Delivery Status

<!-- trace:case id=g10.store-order-detail.TC-rup rev=2 -->
#### g10.store-order-detail.TC6: Delivery Status shows how far the order has come, and Track Order follows a shipped one

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#delivery-status/steps, order-detail#delivery-status/order-placed, order-detail#delivery-status/shipping, order-detail#delivery-status/completed, order-detail#delivery-status/status-badge, order-detail#delivery-status/step-not-reached, order-detail#delivery-status/track-order

**Pre-conditions:**

* customer(signed-in member) owns `<order>`, a delivery order, in the row's state.

**Test data:**

| `<order>` | Badge | Steps |
| --- | --- | --- |
| ❓ paid, not yet fulfilled - design confirms | Processing | Order Placed reached, with its date; Shipping and Completed with no date |
| ❓ fulfilled with an `https` carrier address, not completed - design confirms | Shipped | Order Placed and Shipping (in progress) reached, each with its date; Track Order opens the carrier's page |
| completed | Completed | all three reached |

**Steps:**

1. Open `/profile/orders/<order id>` and read the badge and Delivery Status.
2. Select Track Order, where offered.

**Expected Results:**

* The row's badge and steps, UI matching store-order-detail-blocks-orderdetailsdeliverystatus--shipped-delivery for the shipped row.

---

### order-detail#items: Items

#### g10.store-order-detail.TC7: Order items show their current product pictures, or a placeholder

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#items/product-picture

**Pre-conditions:**

* `<order>` holds the row's item.

**Test data:**

| Item | Opened as | Shown |
| --- | --- | --- |
| a product whose picture changed since the purchase | the owner, at `/profile/orders/<order id>` | its current picture |
| the same product | anyone, from the order's View order link | its current picture |
| a product with no picture | the owner | the placeholder, and the order still opens |

**Steps:**

1. Open the order as the row says and read its items.

**Expected Results:**

* The row's picture.

---

### order-detail#order-link: Order Link

<!-- trace:case id=g10.store-order-detail.TC-roq rev=1 -->
#### g10.store-order-detail.TC9: Signed in, the owner moves to their profile and anyone else sees the link page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/owner-signed-in, order-detail#order-link/someone-else-signed-in

**Pre-conditions:**

* `<order>` belongs to member A; customer opens its View order link signed in as the row's member.

**Test data:**

| Signed in as | Shown |
| --- | --- |
| member A | `/profile/orders/<order id>` |
| member B | the same public link page anyone holding the link sees |

**Steps:**

1. Open the View order link.

**Expected Results:**

* The row's page.

<!-- trace:case id=g10.store-order-detail.TC-5lm rev=1 -->
#### g10.store-order-detail.TC10: A wrong link shows not found, with a way to the store

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/wrong-link

**Pre-conditions:**

* customer is signed out.

**Test data:**

| Link |
| --- |
| `/orders/<an id no order has>#<any secret>` |
| `/orders/<a real order id>#<a different secret>` |

**Steps:**

1. Open the row's link.

**Expected Results:**

* The not-found state with no order facts, UI matching store-order-detail-screens-order-link--not-found; its way out leads to the store, not My Orders.

<!-- trace:case id=g10.store-order-detail.TC-ogu rev=1 -->
#### g10.store-order-detail.TC11: Shopify's order email carries the View order link

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** checkout#guest-checkout/order-link, order-detail#order-link/link, order-detail#order-link/secret, order-detail#order-link/signed-out

**Pre-conditions:**

* customer, as the row says, has `<product A>` in the cart and reads mail at the row's email.

**Test data:**

| Customer | Email |
| --- | --- |
| signed out | a test mailbox no Grade10 account holds |
| signed-in member | the member's own |

**Steps:**

1. Check out and pay with the payment provider's published test card that succeeds.
2. Open Shopify's order confirmation and select View order in a private window.
3. Read the mailbox after 5 minutes.

**Expected Results:**

* Step 2: the button's address is `/orders/<order id>` with its secret after `#`, and it opens the order page signed out.
* Step 3 holds no other order email from Grade10.

#### g10.store-order-detail.TC14: Signed in, the owner sees neither the receipt line nor the toast

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/signed-out-only

**Pre-conditions:**

* customer(signed-in member) owns `<order>`, a guest order joined to the account.

**Steps:**

1. Open `/profile/orders/<order id>`.

**Expected Results:**

* No receipt line and no toast.

<!-- trace:case id=g10.store-order-detail.TC-psy rev=1 -->
#### g10.store-order-detail.TC16: A Google sign-in under another email does not add the order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-link/another-email

**Pre-conditions:**

* customer(signed out) is on `<order>`'s page after a guest checkout under `<order email>`; `<google email>` is a Google account under another email.

**Steps:**

1. Select Sign in on the toast and sign in with `<google email>`.
2. Select the toast's action.

**Expected Results:**

* Step 1 signs the customer in; the toast says the order was not added, as it was placed with `<order email>`.
* Step 2 says a sign-in link was sent to `<order email>`.

---

### order-detail#back-from-checkout: Back From Checkout

<!-- trace:case id=g10.store-order-detail.TC-gn1 rev=1 -->
#### g10.store-order-detail.TC17: With no order remembered, the latest address opens the order list or the store

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#back-from-checkout/nothing-remembered, order-detail#back-from-checkout/one-day, order-detail#back-from-checkout/another-device

**Pre-conditions:**

* customer, as the row says, in a browser that remembers no order for the row's reason.

**Test data:**

| Why nothing is remembered | Customer | Opens |
| --- | --- | --- |
| no checkout from this browser | signed-in member | My Orders |
| the last checkout was more than a day ago | signed out | the store |
| Continue already opened the last order once | signed out | the store |
| the order was paid on another device | signed out | the store |

**Steps:**

1. Open `/orders/latest`.

**Expected Results:**

* The row's page.

---

### order-detail#order-summary: Order Summary

<!-- trace:case id=g10.store-order-detail.TC-d7b rev=1 -->
#### g10.store-order-detail.TC18: Summary amounts read $ with two decimals, a bare $0, and an HK$ total

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-summary/amount-marks

**Pre-conditions:**

* customer(signed-in member) owns `<order>`: subtotal HKD1,759.50, refund HKD105, shipping HKD50, tax HKD0.

**Steps:**

1. Open `/profile/orders/<order id>` and read the summary.

**Expected Results:**

* Subtotal `$1,759.50`, Refund `−$105.00`, Shipping `$50.00`, Tax `$0`, Total `HK$1,704.50` = 1,759.50 − 105 + 50.

<!-- trace:case id=g10.store-order-detail.TC-zph rev=2 -->
#### g10.store-order-detail.TC19: An order that earns or named a points discount shows its points

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-summary/points, order-detail#order-summary/points-to-earn

**Pre-conditions:**

* customer(signed-in member) owns `<order>`, in the row's state.

**Test data:**

| `<order>` | Shown |
| --- | --- |
| the shop named a 100-point discount; it earns, not yet completed | a `Points (100 pts)` credit after Discount, in the success style, UI matching store-order-detail-screens-order-details--points-credit-applied; and Points to Earn |
| completed, earned on completion, no points discount | no Points row; Points Earned |

**Steps:**

1. Open `/profile/orders/<order id>` and read the summary and the points section.

**Expected Results:**

* The row's points.

#### g10.store-order-detail.TC20: An order with no named points discount, or that will not earn, shows no points

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-summary/no-points-row, order-detail#order-summary/no-points-section

**Pre-conditions:**

* customer(signed-in member) owns `<order>`, in the row's state.

**Test data:**

| `<order>` | Shown |
| --- | --- |
| points debited from the applied total; the shop named no points discount | no Points row |
| canceled | no points section |
| refunded in full | no points section |
| a guest order joined to the account | no points section |

**Steps:**

1. Open `/profile/orders/<order id>` and read the summary and the points section.

**Expected Results:**

* The row's absence.

<!-- trace:case id=g10.store-order-detail.TC-wxh rev=2 -->
#### g10.store-order-detail.TC22: Refunded goods take back the points they earned

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-summary/points-to-earn

**Pre-conditions:**

* customer(signed-in member) owns `<order>`: `<product A>`, `<product B>` and delivery, completed, with points earned on both goods; the balance is known.

**Steps:**

1. Refund `<product B>` in the shop's admin.
2. Wait 60 seconds, then read the member's points balance.

**Expected Results:**

* The balance is lower by the points `<product B>` earned.

#### g10.store-order-detail.TC23: A delivery-only refund leaves the points as they were

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-summary/points-to-earn

**Pre-conditions:**

* customer(signed-in member) owns `<order>`: goods and delivery, completed, with points earned on the goods; the balance is known.

**Steps:**

1. Refund the delivery fee alone in the shop's admin.
2. Wait 60 seconds, then read the member's points balance.

**Expected Results:**

* The balance is unchanged.

<!-- trace:case id=g10.store-order-detail.TC-fbs rev=1 -->
#### g10.store-order-detail.TC21: A refund shows its amount beside what was paid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** order-detail#order-summary/full-refund

**Pre-conditions:**

* customer(signed-in member) owns `<order>`: `<product A>` HKD780 and `<product B>` HKD105, paid HKD885; admin refunded the row's lines in the shop's admin.

**Test data:**

| Refunded | Summary |
| --- | --- |
| `<product B>`, HKD105 | Total HKD885; a Refund row of −HKD105, UI matching store-order-detail-screens-order-details--partial-refund |
| ❓ both lines, HKD885 - design confirms | Total HKD885; a Refund row of −HKD885 |

**Steps:**

1. Open `/profile/orders/<order id>` and read the summary and the badge.

**Expected Results:**

* The row's summary, and the badge Refunded.
