# grade10-site/store/order-detail Test Cases

**Status:** pending-review · 0/21
**Drafts styled:** 2026-10-22, tcs-rules r6

## Walk 1: A Guest Back From Checkout

**Starting state:**

- customer(signed out) has `<guest product>` in this browser's cart on staging, and no account under `<order email>`.
- The customer can read mail sent to `<order email>`.

**Shared test data:**

| Field | Value |
| --- | --- |
| `guest product` | An available card. |
| `order email` | A test mailbox no Grade10 account holds. |
| `test card` | The payment provider's published test card that succeeds. |

### Route

1. Check out as a guest under `<order email>`, pay with `<test card>`, then click Continue on Shopify's thank-you page.
   - Record the private order page opening `g10.store-order-detail.US3-TC1`
2. Read the placed-on line and the toast.
   - Record the receipt email and the account ask `g10.store-order-detail.US3-TC3`
3. Click Sign in on the toast and sign in by a magic link to `<order email>`.
   - Record the toast saying the order was added, with a way to it `g10.store-order-detail.US3-TC4`
4. Open the View order button in Shopify's order email, in a private window.
   - Record the order page opening signed out, with no account facts `g10.store-order-detail.US2-TC1`
   - Record the absent points and wallet `g10.store-order-detail.US2-TC4`

## g10.store-order-detail.US2: Open an order from its link

**As a** customer,
**I want** the link in my order email to open my order,
**so that** I can check it without an account.

<!-- trace:case id=g10.store-order-detail.TC-4hw rev=1 -->
### g10.store-order-detail.US2-TC1: A signed-out link holder sees the order and a sign-in ask

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US2

**Pre-conditions:**

* customer(signed out) holds the View order link for `<order>` from Shopify's order email.

**Test data:**

| Partition | `<order>` | `<expected toast>` |
| --- | --- | --- |
| Guest order | Paid as a guest under `<order email>`. | Asks to add this order to an account. |
| Member order | Paid by a signed-in member. | Asks to sign in to see it. |

**Steps:**

1. Open the View order link.
2. Read the address bar, the page and the toast.
3. Close the toast and reload.

**Expected Results:**

* Step 2's address is `/orders/<order id>`, its secret after `#`.
* Step 2 shows `<order>`'s items and totals.
* Step 2's placed-on line names the email the receipt went to.
* Step 2 shows `<expected toast>`, with one Sign in action.
* Step 3 shows no toast for this order.

<!-- trace:case id=g10.store-order-detail.TC-w94 rev=1 -->
### g10.store-order-detail.US2-TC4: The link page shows no points, wallet or account details

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
* **Trace:** g10.store-order-detail.US2

**Pre-conditions:**

* customer(signed out) holds the View order link for `<order>`.

**Test data:**

| Partition | `<order>` |
| --- | --- |
| Guest order | Paid as a guest. |
| Member order paid with points | Paid by a member with 100 points and earning points. |

**Steps:**

1. Open the View order link.
2. Read the page and its order summary.

**Expected Results:**

* Step 2 shows no Points to Earn and no Points Earned.
* Step 2's summary has no Points row.
* Step 2 shows no wallet or account details.

---

## g10.store-order-detail.US3: Come back from checkout to my order

**As a** customer,
**I want** Shopify's Continue button to bring me to the order I just paid,
**so that** I see it and can add it to my account.

<!-- trace:case id=g10.store-order-detail.TC-0pz rev=1 -->
### g10.store-order-detail.US3-TC1: Continue opens the order this browser just paid

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-order-detail.US3

**Pre-conditions:**

* customer(`<actor state>`) has just paid `<order>` on Shopify's page in this browser.

**Test data:**

| Partition | `<actor state>` | `<expected address>` |
| --- | --- | --- |
| Guest | signed out | `/orders/<order id>`, with its secret. |
| Member | signed-in member | `/profile/orders/<order id>`. |

**Steps:**

1. Click Continue on Shopify's thank-you page.
2. Read the address bar and the page.

**Expected Results:**

* Step 1 passes through `/orders/latest`.
* Step 2's address is `<expected address>`.
* Step 2 shows `<order>`.

<!-- trace:case id=g10.store-order-detail.TC-frp rev=1 -->
### g10.store-order-detail.US3-TC3: The receipt line and toast show only when signed out

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
* **Trace:** g10.store-order-detail.US3

**Pre-conditions:**

* `<order>` was paid as a guest under `<order email>`.
* customer views `<order>` as `<viewer>`.

**Test data:**

| Partition | `<order>` | `<viewer>` | `<expected>` |
| --- | --- | --- | --- |
| Guest order, no account | No account under `<order email>`. | Signed out, back from checkout. | Receipt line naming `<order email>`; toast asks to add this order to an account. |
| Joined at payment | An account under `<order email>` existed at payment. | Signed out, back from checkout. | Receipt line; toast asks to sign in to see it. |
| Opened later | No account under `<order email>`. | Signed out, from the order email a day later. | Receipt line; toast asks to add this order to an account. |
| Owner signed in | Joined to the member's account. | Signed in as that member. | No receipt line and no toast. |

**Steps:**

1. Open `<order>`'s page as `<viewer>`.
2. Read the placed-on line and the toast.

**Expected Results:**

* Step 2 shows `<expected>`.

<!-- trace:case id=g10.store-order-detail.TC-qu5 rev=1 -->
### g10.store-order-detail.US3-TC4: A sign-in that proves the order's email adds the order

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
* **Testability:** manual
* **Trace:** g10.store-order-detail.US3

**Pre-conditions:**

* customer(signed out) is on `<order>`'s page after a guest checkout under `<order email>`.

**Test data:**

| Partition | `<sign-in>` |
| --- | --- |
| Magic link, same device | Open the magic link to `<order email>` in this browser. |
| Magic link, another device | Open the magic link to `<order email>` on another device. |
| Google under the order's email | A Google account under `<order email>`. |

**Steps:**

1. Click Sign in on the toast.
2. Sign in by `<sign-in>`.
3. Read the toast on the device that signed in.
4. Follow the toast's way to the order.

**Expected Results:**

* Step 3 says the order was added to the account.
* Step 4 opens `/profile/orders/<order id>`.

---

## Ungrouped

### g10.store-order-detail.US1: Read one of my orders

**As a** customer,
**I want** to open one of my Store orders and see what it holds,
**so that** I know what I paid, what was refunded and where it is.

<!-- trace:case id=g10.store-order-detail.TC-tb1 rev=1 -->
#### g10.store-order-detail.US1-TC1: The owner sees the order's supplied facts, and nothing missing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`.

**Test data:**

| Partition | `<order>` | `<expected groups>` |
| --- | --- | --- |
| All facts supplied | Items, totals, a refund, fulfilment, an estimate, tracking, address and payment. | Each of those shows. |
| Only identity, items and totals | No refund, fulfilment, tracking, address or payment supplied. | Identity, items and totals; no empty group for the rest. |

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the page.

**Expected Results:**

* Step 2 shows `<expected groups>`.
* Step 2 shows the order number.

<!-- trace:case id=g10.store-order-detail.TC-f9c rev=1 -->
#### g10.store-order-detail.US1-TC2: Another collector's order and an unknown order look the same

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
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member A) is signed in.

**Test data:**

| Partition | `<order id>` |
| --- | --- |
| Another member's order | An order member B owns. |
| Unknown order | An id no order has. |

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the page.

**Expected Results:**

* Step 2 shows the not-found state.
* Both rows show the same page, with no order facts.

<!-- trace:case id=g10.store-order-detail.TC-ek8 rev=1 -->
#### g10.store-order-detail.US1-TC3: Signing in from an order's address comes back to it

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
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed out) owns `<order>` through a member account.

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Sign in.
3. Read the address bar and the page.

**Expected Results:**

* Step 3's address is `/profile/orders/<order id>`.
* Step 3 shows `<order>`.

<!-- trace:case id=g10.store-order-detail.TC-j3h rev=1 -->
#### g10.store-order-detail.US1-TC4: Loading, a failed read with Retry, and not found stay distinct

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
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`.
* The order read is `<read state>`.

**Test data:**

| Partition | `<read state>` | `<expected page>` |
| --- | --- | --- |
| Pending | Held pending. | Loading. |
| Failed | Failing once, then answering. | A failure in the site's language, with Retry. |

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the page.
3. Click Retry, where offered.
4. Read the page and the address bar.

**Expected Results:**

* Step 2 shows `<expected page>`, not the not-found state.
* For the failed row, step 4 shows `<order>`.
* Step 4's address is unchanged.

<!-- trace:case id=g10.store-order-detail.TC-ivx rev=1 -->
#### g10.store-order-detail.US1-TC5: Delivery status reads Shipping (in progress); Track Order when safe

Runs once per row of **Test data**.

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
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`, shipped, with `<carrier address>`.

**Test data:**

| Partition | `<carrier address>` | `<expected track>` |
| --- | --- | --- |
| Safe | A carrier's `https` tracking address. | Track Order opens it. |
| Not safe | A `javascript:` address. | No Track Order. |

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the status badge and the delivery steps.
3. Read the tracking action.

**Expected Results:**

* Step 2's badge reads Shipped.
* Step 2's delivery step reads Shipping (in progress).
* Step 3 matches `<expected track>`.

<!-- trace:case id=g10.store-order-detail.TC-d7b rev=1 -->
#### g10.store-order-detail.US1-TC6: Summary amounts use $ with two decimals, bare $0, and HK$ total

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
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`: subtotal HKD1,759.50, refund HKD105, shipping HKD50, tax HKD0.

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the order summary.

**Expected Results:**

* Subtotal reads `$1,759.50`.
* Refund reads `−$105.00`.
* Shipping reads `$50.00`.
* Tax reads `$0`.
* Total reads `HK$1,704.50` = 1,759.50 − 105 + 50.

<!-- trace:case id=g10.store-order-detail.TC-zph rev=1 -->
#### g10.store-order-detail.US1-TC7: Points show only on an order that earns or named a points discount

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
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`.

**Test data:**

| Partition | `<order>` | `<expected points>` |
| --- | --- | --- |
| Paid with 100 points, not completed | The shop names a 100-point discount; the order earns. | `Points (100 pts)` credit after Discount; Points to Earn. |
| Completed | Earned on completion; no points discount. | No Points row; Points Earned. |
| Points debited, not named | Points debited from the applied total; the shop names no points discount. | No Points row. |
| Canceled | Canceled. | No points section. |
| Refunded in full | Refunded in full. | No points section. |
| Joined guest order | Paid as a guest, joined to the account. | No points section. |

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the order summary and the points section.

**Expected Results:**

* Step 2 shows `<expected points>`.

<!-- trace:case id=g10.store-order-detail.TC-rup rev=1 -->
#### g10.store-order-detail.US1-TC8: Delivery steps move from Order Placed through Shipping to Completed

Runs once per row of **Test data**.

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
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`, a delivery order, in the state its row describes.

**Test data:**

| Partition | `<order>` | `<expected steps>` |
| --- | --- | --- |
| Placed | Paid, not yet fulfilled. | Order Placed reached, with its date; Shipping and Completed not reached. |
| Sent | Fulfilled, not completed. | Order Placed and Shipping (in progress) reached, each with its date; Completed not reached. |
| Done | Completed. | All three steps reached. |

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the Delivery Status steps.

**Expected Results:**

* Step 2 shows `<expected steps>`.

<!-- trace:case id=g10.store-order-detail.TC-fbs rev=1 -->
#### g10.store-order-detail.US1-TC9: A refund shows its amount beside what was paid

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
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`: `<product A>` HKD780 and `<product B>` HKD105, paid HKD885.
* admin refunded `<refund>` in the staging shop's admin.

**Test data:**

| Partition | `<refund>` | `<expected summary>` | `<expected badge>` |
| --- | --- | --- | --- |
| One line | `<product B>`, HKD105. | Total HKD885; a Refund row of −HKD105. | The order's status before the refund. |
| Everything | Both lines, HKD885. | Total HKD885; a Refund row of −HKD885. | Refunded |

**Steps:**

1. Navigate to `/profile/orders/<order id>`.
2. Read the order summary and the status badge.

**Expected Results:**

* Step 2 shows `<expected summary>`.
* Step 2's badge reads `<expected badge>`.

<!-- trace:case id=g10.store-order-detail.TC-wxh rev=1 -->
#### g10.store-order-detail.US1-TC10: Refunded goods take back the points they earned

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US1

**Pre-conditions:**

* customer(signed-in member) owns `<order>`: goods `<product A>` and `<product B>` plus delivery, completed, with points earned on both goods.
* The member's points balance is known.

**Test data:**

| Partition | `<refund>` | `<expected balance>` |
| --- | --- | --- |
| One line of goods | `<product B>`. | Lower by the points `<product B>` earned. |
| Delivery only | The delivery fee alone. | Unchanged. |

**Steps:**

1. Refund `<refund>` in the staging shop's admin.
2. Wait 60 seconds.
3. Read the member's points balance.

**Expected Results:**

* Step 3 is `<expected balance>`.

---

### g10.store-order-detail.US2: Open an order from its link

**As a** customer,
**I want** the link in my order email to open my order,
**so that** I can check it without an account.

<!-- trace:case id=g10.store-order-detail.TC-roq rev=1 -->
#### g10.store-order-detail.US2-TC2: Signed-in owners move to their profile; others see the link page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US2

**Pre-conditions:**

* `<order>` belongs to member A.
* customer opens its View order link signed in as `<viewer>`.

**Test data:**

| Partition | `<viewer>` | `<expected>` |
| --- | --- | --- |
| Owner | member A | Sent to `/profile/orders/<order id>`. |
| Someone else | member B | The same public link page anyone holding the link sees. |

**Steps:**

1. Open the View order link.
2. Read the address bar and the page.

**Expected Results:**

* Step 2 shows `<expected>`.

<!-- trace:case id=g10.store-order-detail.TC-5lm rev=1 -->
#### g10.store-order-detail.US2-TC3: A wrong link shows not found, with a way to the store

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
* **Trace:** g10.store-order-detail.US2

**Pre-conditions:**

* customer is signed out.

**Test data:**

| Partition | `<link>` |
| --- | --- |
| Unknown order | `/orders/<an id no order has>#<any secret>`. |
| Wrong secret | `/orders/<a real order id>#<a different secret>`. |

**Steps:**

1. Open `<link>`.
2. Read the page.

**Expected Results:**

* Step 2 shows the not-found state, with no order facts.
* Its way out leads to the store, not Your Orders.

<!-- trace:case id=g10.store-order-detail.TC-nq4 rev=1 -->
#### g10.store-order-detail.US2-TC5: Order link and latest-order addresses tell search engines not to index

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-order-detail.US2

**Pre-conditions:**

* `<order>` exists.

**Test data:**

| Partition | `<address>` |
| --- | --- |
| Order link | `/orders/<order id>`. |
| Back from checkout | `/orders/latest`. |

**Steps:**

1. Read the API response for `<address>`.

**Expected Results:**

* The response tells search engines not to index the address.

<!-- trace:case id=g10.store-order-detail.TC-ogu rev=1 -->
#### g10.store-order-detail.US2-TC6: Shopify's order email carries the View order link

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
* **Testability:** manual
* **Trace:** g10.store-order-detail.US2

**Pre-conditions:**

* customer(`<actor state>`) has `<product A>` in the cart on staging.
* The customer can read mail sent to `<order email>`.

**Test data:**

| Partition | `<actor state>` | `<order email>` |
| --- | --- | --- |
| Guest | signed out | A test mailbox no Grade10 account holds. |
| Member | signed-in member | The member's own email. |

**Steps:**

1. Check out and pay with the payment provider's published test card that succeeds.
2. Open the order confirmation email at `<order email>`.
3. Read its View order button's address.
4. Click View order in a private window.
5. Read the mailbox after 5 minutes.

**Expected Results:**

* Step 2 is Shopify's order confirmation.
* Step 3 is `/orders/<order id>`, its secret after `#`.
* Step 4 opens the order's page signed out.
* Step 5 holds no other order email from Grade10.

---

### g10.store-order-detail.US3: Come back from checkout to my order

**As a** customer,
**I want** Shopify's Continue button to bring me to the order I just paid,
**so that** I see it and can add it to my account.

<!-- trace:case id=g10.store-order-detail.TC-gn1 rev=1 -->
#### g10.store-order-detail.US3-TC2: With no order remembered, latest opens the order list or the store

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
* **Testability:** automation, manual
* **Trace:** g10.store-order-detail.US3

**Pre-conditions:**

* customer is `<viewer>`, and this browser remembers no order because of `<reason>`.

**Test data:**

| Partition | `<reason>` | `<viewer>` | `<expected>` |
| --- | --- | --- | --- |
| No checkout here | No checkout from this browser. | signed-in member | Your Orders. |
| A day later | The last checkout was more than a day ago. | signed out | The store. |
| Already used | Continue already opened the last order once. | signed out | The store. |
| Paid on another device | The order was paid on another device. | signed out | The store. |

**Steps:**

1. Navigate to `/orders/latest`.
2. Read the page.

**Expected Results:**

* Step 2 shows `<expected>`.

<!-- trace:case id=g10.store-order-detail.TC-psy rev=1 -->
#### g10.store-order-detail.US3-TC5: A Google sign-in under another email does not add the order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-order-detail.US3

**Pre-conditions:**

* customer(signed out) is on `<order>`'s page after a guest checkout under `<order email>`.
* `<google email>` is a Google account under another email.

**Steps:**

1. Click Sign in on the toast.
2. Sign in with `<google email>`.
3. Read the toast.
4. Click the toast's action to send a sign-in link.

**Expected Results:**

* Step 2 signs the customer in.
* Step 3 says the order was not added, as it was placed with `<order email>`.
* Step 4 says a sign-in link was sent to `<order email>`.
