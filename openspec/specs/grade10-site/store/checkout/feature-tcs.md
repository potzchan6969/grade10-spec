# grade10-site/store/checkout Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-28, tcs-rules r4

## grade10-site-store-checkout-US1: Collector sends a current cart to hosted payment

**As a** signed-in collector,
**I want** to review my current cart and send its accepted tender to Shopify,
**so that** I pay for the lines and choices I just saw.

<!-- trace:case id=g10.store-checkout.TC-tb9 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC1-1: Current lines reach one hosted checkout

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on the Grade10 checkout page with one available cart line

**Steps:**

1. Wait for the current line review to finish.
2. Click Pay.
3. Read the Shopify hosted checkout page.

**Expected Results:**

* The line shown on the Grade10 page is the line sent to Shopify.
* One hosted Shopify checkout opens.
* The checkout asks for shipping and payment on Shopify.

<!-- trace:case id=g10.store-checkout.TC-sew rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC2-1: The estimate leaves final charges to Shopify

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on Grade10 checkout with a selected promo or points choice

**Steps:**

1. Read the basket summary before payment.
2. Click Pay.
3. Enter a served shipping address on Shopify.

**Expected Results:**

* The Grade10 summary shows the reviewed subtotal and accepted tender choice.
* The Grade10 summary does not call shipping or tax final.
* Shopify shows the address-aware shipping and tax values before payment.

<!-- trace:case id=g10.store-checkout.TC-jze rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC3-1: A repeated Pay uses the same checkout

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has one unchanged checkout intent whose first Pay request is delayed

**Steps:**

1. Submit Pay a second time before the first result is shown.
2. Read the checkout outcome.

**Expected Results:**

* Both requests identify one Grade10 order.
* One Shopify checkout is payable.
* The second request returns the existing checkout or its settling state.
* No second order or second payable invoice is created.

<!-- trace:case id=g10.store-checkout.TC-1yv rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC4-1: A lost response is safe to retry

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has a checkout intent whose Shopify response was lost after the provider created the checkout

**Steps:**

1. Retry the same checkout intent.
2. Read the checkout outcome.

**Expected Results:**

* The existing order is recovered through its recorded provider reference or provider read.
* The retry returns the existing hosted checkout or settling state.
* No new Shopify invoice is created.

<!-- trace:case id=g10.store-checkout.TC-gwn rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC5-1: A changed basket starts a new intent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has an open checkout intent

**Steps:**

1. Change the basket quantity or tender choice.
2. Submit Pay for the changed basket.

**Expected Results:**

* The changed request has a new intent fingerprint.
* The old open checkout is not returned as the changed purchase.

<!-- trace:case id=g10.store-checkout.TC-w18 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC8-1: A terminal intent is replayed safely

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has an unchanged intent whose Grade10 order is paid, refunded, failed, canceled or expired

**Steps:**

1. Submit Pay again with the same intent.
2. Read the checkout outcome.

**Expected Results:**

* The existing order's terminal outcome is returned.
* No second Grade10 order or Shopify invoice is created.
* A new intent is required before a changed basket can be paid.

<!-- trace:case id=g10.store-checkout.TC-3dr rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC9-1: A crash before dispatch can retry

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has an order claimed for checkout while its provider-dispatch state is `ready`

**Steps:**

1. Stop the worker before it sends the Shopify request.
2. Run reconciliation.
3. Read the checkout outcome.

**Expected Results:**

* The order can be dispatched once after the lease is reclaimed.
* The retry creates no second order or invoice.

<!-- trace:case id=g10.store-checkout.TC-jje rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC10-1: An ambiguous dispatch requires operator recovery

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has an order marked `dispatched` with no provider reference and no unique matching draft

**Steps:**

1. Run reconciliation through the recovery deadline.
2. Read the checkout outcome.

**Expected Results:**

* The order enters `manual_review` and returns a recovery-required result.
* No replacement Shopify invoice is created.
* The member cannot start a new purchase until an operator binds or cancels the provider draft.

<!-- trace:case id=g10.store-checkout.TC-ldd rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC6-1: A served destination receives the preview rate

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
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has a reviewed basket and a destination served by the carrier rule

**Steps:**

1. Read the store shipping preview.
2. Continue to Shopify and enter the same destination.

**Expected Results:**

* The preview and Shopify show the same configured rate and currency.
* The carrier callback does not create an order or mutate the cart.

<!-- trace:case id=g10.store-checkout.TC-inp rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC7-1: An unsupported destination receives no rate

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has a reviewed basket and a destination outside the carrier rule

**Steps:**

1. Ask the Shopify carrier callback for rates.

**Expected Results:**

* No carrier rate is returned.
* No order is created and the cart is unchanged.

## grade10-site-store-checkout-US2: Collector repairs a changed cart line

**As a** collector whose cart changed while checkout was opening,
**I want** the changed line named before I pay,
**so that** I can fix the basket instead of paying for stale goods.

<!-- trace:case id=g10.store-checkout.TC-kpm rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-g07,g10.store-checkout.SC-8hm -->
### grade10-site-store-checkout-US2-TC1-1: A changed line blocks payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on Grade10 checkout with a line whose price or availability changes during the checkout read

**Steps:**

1. Wait for the checkout read to answer.
2. Read the changed line notice.

**Expected Results:**

* The changed line is named with its current shop answer.
* Pay is unavailable until the collector fixes or removes the line.
* No Shopify checkout or Grade10 order is created by the failed read.

<!-- trace:case id=g10.store-checkout.TC-b5w rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-g07,g10.store-checkout.SC-8hm -->
### grade10-site-store-checkout-US2-TC2-1: A failed read keeps held facts unchecked

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on Grade10 checkout and the live shop read fails

**Steps:**

1. Read the checkout summary.
2. Try to pay.

**Expected Results:**

* The last held price and availability are not presented as current.
* Pay remains unavailable.
* Retry is offered without creating an order.

<!-- trace:case id=g10.store-checkout.TC-njp rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-g07,g10.store-checkout.SC-8hm -->
### grade10-site-store-checkout-US2-TC3-1: Shopify names a line refused at payment

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) has opened a Shopify checkout while one line is still sellable
* Shopify makes that line unavailable before payment

**Steps:**

1. Continue to payment on Shopify.
2. Read the provider refusal.

**Expected Results:**

* Shopify names the unavailable line.
* The Grade10 order is not marked paid.
* The collector can return to the same basket and retry after fixing it.

## grade10-site-store-checkout-US3: Collector finds the paid order after Shopify

**As a** signed-in collector who paid on Shopify,
**I want** to return to Grade10 and find the order while it settles,
**so that** I can trust the store did not lose my purchase.

<!-- trace:case id=g10.store-checkout.TC-wam rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
### grade10-site-store-checkout-US3-TC1-1: A pending order is visible while payment settles

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) has returned from Shopify with a newly created order still pending

**Steps:**

1. Open Your Orders.
2. Read the newly created order while payment is still pending.

**Expected Results:**

* The order appears in the active orders section.
* The page presents pending as a settling state, not an empty result or an error.
* The page polls until the order settles or exposes a retryable failure.

<!-- trace:case id=g10.store-checkout.TC-xym rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
### grade10-site-store-checkout-US3-TC2-1: Paid settlement releases the member cart

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) has left a Grade10 cart for a Shopify checkout

**Steps:**

1. Complete payment on Shopify.
2. Return to Grade10.
3. Open the cart and Your Orders.

**Expected Results:**

* The order shows paid with the provider's paid total.
* The member cart no longer contains the paid lines.
* The paid order appears in Your Orders and can open its detail page.

<!-- trace:case id=g10.store-checkout.TC-nds rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
### grade10-site-store-checkout-US3-TC3-1: Reconcile repairs a missed payment event

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) has a Shopify invoice that was paid but its webhook was not delivered

**Steps:**

1. Run payment reconciliation.
2. Read the order.

**Expected Results:**

* Reconciliation finds the existing provider checkout.
* The order moves to paid once without creating another invoice.
* Shopify's paid total and supplied shipping/tax facts are retained.

<!-- trace:case id=g10.store-checkout.TC-dno rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
### grade10-site-store-checkout-US3-TC4-1: Shopify confirmation returns to the Grade10 order

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) has completed payment on a Shopify invoice

**Steps:**

1. Activate the Grade10 Your Orders link in the Shopify Thank You or Order status extension.
2. Read the destination.

**Expected Results:**

* The Grade10 orders surface opens and shows the matching purchase.
* The link does not require the native Continue shopping button or open a native Shopify account page.

<!-- trace:case id=g10.store-checkout.TC-ce0 rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
### grade10-site-store-checkout-US3-TC5-1: An invalid payment event stays unpaid

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* the payment event has an unknown provider reference, wrong shop or invalid signature

**Steps:**

1. Deliver the event to the store.
2. Read the affected order.

**Expected Results:**

* No order moves to paid.
* The event is recorded for diagnosis and no replacement order is created.

## grade10-site-store-checkout-US4: Signed-out collector is asked to sign in

**As a** collector who is not signed in,
**I want** checkout to explain the identity requirement,
**so that** I can sign in before an order or payment is started.

<!-- trace:case id=g10.store-checkout.TC-nos rev=1 covers=g10.store-checkout.SC-f06 -->
### grade10-site-store-checkout-US4-TC1-1: Public checkout requires a member session

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* customer is signed out on the public checkout route

**Steps:**

1. Try to continue to payment.
2. Read the sign-in outcome.

**Expected Results:**

* The sign-in surface is shown.
* No public Grade10 order or Shopify checkout is created.
* A typed email is not accepted as public identity proof.

## Settled

- Shopify is the hosted payment page; Grade10 is the order of record.
- The public storefront is signed-in-member only; typed email remains an
  operator test path in development and staging.
- Shipping and tax are calculated by Shopify after address entry.
- One checkout intent owns repeated Pay, reload and response-loss recovery.
- A paid transition, not the provider return, releases the member cart.
- The configured carrier callback is token-gated, stateless and shared with
  the store preview.

## Reconciliation

This is the blind feature pass for the new capability. It was assembled from
the purpose and feature set, proposal, decisions, user journeys, PRD and the
linked storefront/commerce architecture before reading the requirements.

- US-01 covers the current review, estimate, hosted handoff, repeated Pay,
  changed-intent and carrier-rate journeys.
- US-02 covers stale/failed reads and provider refusal after draft creation.
- US-03 covers pending visibility, paid settlement, cart release, reconciliation,
  confirmation return and invalid-event rejection.
- US-04 covers the public signed-in boundary.
- Q11, Q12, Q13 and Q14 from the blind reading are folded into SC-09 through
  SC-11, SC-19 through SC-21 and SC-07/SC-10; no journey remains uncovered.
- The suite does not rely on the Requirements section or any archived change.
