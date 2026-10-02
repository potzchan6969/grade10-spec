# grade10-site/store/checkout Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-03, tcs-rules r4

## grade10-site-store-checkout-US1: Collector sends a current cart to hosted payment

**As a** signed-in collector,
**I want** to review my current cart and send its accepted tender to Shopify,
**so that** I pay for the lines and choices I just saw.

### grade10-site-store-checkout-US1-TC1-1: Current drawer lines reach one hosted invoice

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

* customer(member) is on <grade10 store url> with one available cart line.

**Steps:**

1. Open the cart drawer.
2. Wait for the live line review.
3. Click Pay in the drawer.
4. Read the Shopify hosted invoice page.

**Expected Results:**

* The drawer shows current title, quantity, price and availability.
* Pay is available only after the live review is ready.
* The drawer shows accepted tender.
* One pending Grade10 order holds the reviewed variants and quantities.
* One Shopify hosted invoice opens for the reviewed line.
* Grade10 shows no embedded payment form.
* Shopify asks for address, shipping and payment.

### grade10-site-store-checkout-US1-TC2-1: The drawer estimate leaves final charges to Shopify

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

* customer(member) has a cart line and accepted promo and points choices.
* customer(member) is on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| <served shipping address> | An address served by the configured carrier rule |

**Steps:**

1. Open the cart drawer.
2. Read the subtotal and accepted tender.
3. Click Pay in the drawer.
4. Enter <served shipping address> on Shopify.
5. Read shipping and tax before payment.

**Expected Results:**

* The drawer shows the subtotal and accepted tender in store currency.
* The estimate does not present shipping or tax as final.
* The invoice carries the reviewed basket and accepted tender.
* Shopify calculates shipping and tax after address entry.

### grade10-site-store-checkout-US1-TC6-1: A served destination receives the store preview rate

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has a reviewed basket.
* The carrier rule serves <served destination>.

**Test data:**

| Field | Value |
| --- | --- |
| <served destination> | A destination served by the configured carrier rule |

**Steps:**

1. Read the store shipping preview for <served destination>.
2. Request Shopify carrier rates for <served destination>.
3. Read both responses.

**Expected Results:**

* Both responses show the same configured rate and currency.
* The carrier request creates no order and changes no cart.

### grade10-site-store-checkout-US1-TC12-1: Unverified goods below the limit reach hosted payment

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
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member, unverified buyer) is on <grade10 store url>.
* The cart holds available goods worth <gross goods>.

**Test data:**

| Field | Value |
| --- | --- |
| <gross goods> | HKD 119,999.99, one minor unit below HKD 120,000 |

**Steps:**

1. Open the cart drawer.
2. Wait for the live line review.
3. Click Pay in the drawer.
4. Read the payment destination.

**Expected Results:**

* The verification requirement does not replace the checkout action.
* One Shopify hosted invoice opens.

### grade10-site-store-checkout-US1-TC14-1: Verified goods at the limit reach hosted payment

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
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member, verified buyer) is on <grade10 store url>.
* The cart holds available goods worth <gross goods>.

**Test data:**

| Field | Value |
| --- | --- |
| <gross goods> | HKD 120,000.00, the verification limit |

**Steps:**

1. Open the cart drawer.
2. Wait for the live line review.
3. Click Pay in the drawer.
4. Read the payment destination.

**Expected Results:**

* The verification requirement does not block this verified buyer.
* One Shopify hosted invoice opens.

### grade10-site-store-checkout-US1-TC3-1: Concurrent Pay requests retain one payable invoice

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

* customer(member) has an unchanged reviewed checkout intent.
* The first Pay response is delayed.

**Steps:**

1. Submit Pay for the reviewed intent.
2. Submit Pay again before the first response.
3. Read both responses.

**Expected Results:**

* Both responses identify the same Grade10 order.
* The repeat returns the existing invoice or settling state.
* Only one Shopify invoice is payable.

### grade10-site-store-checkout-US1-TC4-1: A lost provider response recovers the same invoice

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

* customer(member) has a checkout intent.
* Shopify creates its invoice, but its response is lost.

**Steps:**

1. Retry Pay with the unchanged intent.
2. Read the checkout response.

**Expected Results:**

* The existing invoice is recovered by provider read or reference.
* The response returns that invoice or its settling state.
* No replacement Shopify invoice is created.

### grade10-site-store-checkout-US1-TC5-1: Basket and tender edits start a new intent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-01

**Blocked:** @kinisworking to settle Q15 for an earlier known payable invoice; intent invalidation is settled.

**Pre-conditions:**

* customer(member) has an open checkout intent.
* customer(member) is on <grade10 store url>.
* The cart and tender permit <edit>.

**Test data:**

| Field | Value |
| --- | --- |
| <edit> | Change an available line quantity from 1 to 2 |
| <edit> | Replace an accepted promo with a different accepted promo |
| <edit> | Change the accepted points quantity to a different valid quantity |

**Steps:**

1. Open the cart drawer.
2. Apply <edit> in the drawer.
3. Wait for the updated live review.
4. Click Pay in the drawer.
5. Read the checkout response.

**Expected Results:**

* The edit invalidates the earlier intent.
* The changed purchase uses a new intent and fingerprint.
* The old invoice is not returned for the changed purchase.

### grade10-site-store-checkout-US1-TC8-1: Terminal intent replay retains its existing outcome

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has an unchanged checkout intent.
* Its order has <terminal status>.

**Test data:**

| Field | Value |
| --- | --- |
| <terminal status> | paid |
| <terminal status> | refunded |
| <terminal status> | failed |
| <terminal status> | canceled |
| <terminal status> | expired |

**Steps:**

1. Submit Pay with the unchanged intent.
2. Read the checkout response.

**Expected Results:**

* The response identifies the existing order and terminal outcome.
* No second Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US1-TC9-1: A worker stop before dispatch permits safe recovery

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

* customer(member) has a checkout order ready for provider dispatch.
* The worker is stopped before sending any Shopify request.

**Steps:**

1. Retry the unchanged checkout intent.
2. Read the checkout response.

**Expected Results:**

* The ready request can be claimed again.
* The retry identifies the same Grade10 order.
* Only one Shopify invoice is created.

### grade10-site-store-checkout-US1-TC10-1: An unresolved dispatch requires operator recovery

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

* customer(member) has a dispatched checkout with no provider reference.
* Provider reads find no unique matching draft.

**Steps:**

1. Run recovery through the configured deadline.
2. Retry Pay with the unchanged intent.
3. Read the checkout response.

**Expected Results:**

* The order enters manual_review with recovery required.
* No replacement Shopify invoice is created.
* The member cannot start a new purchase until an operator binds or cancels the draft.

### grade10-site-store-checkout-US1-TC7-1: Unsupported destinations receive no carrier rate

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

* customer(member) has a reviewed basket.
* The carrier rule does not serve <unsupported destination>.

**Test data:**

| Field | Value |
| --- | --- |
| <unsupported destination> | A destination outside the configured served destinations |

**Steps:**

1. Request Shopify carrier rates for <unsupported destination>.
2. Read the carrier response.

**Expected Results:**

* The response contains no carrier rate.
* No order is created and the cart is unchanged.

### grade10-site-store-checkout-US1-TC11-1: Same-session reload retains the reviewed checkout intent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has an open unchanged checkout intent.
* customer(member) is on <grade10 store url> in its active session.

**Steps:**

1. Reload the Grade10 page in the same session.
2. Open the cart drawer.
3. Wait for the live review.
4. Click Pay in the drawer.
5. Read the checkout response.

**Expected Results:**

* The active checkout retains its intent and reviewed fingerprint.
* Pay returns the existing order and invoice or settling state.
* No second Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US1-TC13-1: Unverified goods at the limit require account verification

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
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member, unverified buyer) is on <grade10 store url>.
* The cart holds available goods worth <gross goods>.
* Accepted tender reduces the estimated total below HKD 120,000.

**Test data:**

| Field | Value |
| --- | --- |
| <gross goods> | HKD 120,000.00, the verification limit |
| <gross goods> | HKD 120,000.01, one minor unit above the limit |

**Steps:**

1. Open the cart drawer.
2. Wait for the live review.
3. Read the verification message.
4. Click the account verification link.

**Expected Results:**

* The inline threshold message replaces the checkout action.
* The gate uses gross goods before promo and points deductions.
* The link opens account verification.
* No Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US1-TC15-1: Carrier requests without permission return no usable rate

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
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* The carrier request supplies <token condition>.

**Test data:**

| Field | Value |
| --- | --- |
| <token condition> | No configured token supplied |
| <token condition> | A token different from the configured token |
| <served destination> | A destination served by the configured carrier rule |

**Steps:**

1. Request rates for <served destination>.
2. Read the carrier response.

**Expected Results:**

* The token gate refuses the request.
* No usable carrier rate is returned.
* No order is created and no cart is changed.

### grade10-site-store-checkout-US1-TC16-1: Provider binding precedes the hosted response

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Hosted Shopify handoff

**Pre-conditions:**

* customer(member) has a ready reviewed basket.
* Provider and transaction calls are observable in the checkout harness.

**Steps:**

1. Submit Pay for the reviewed basket.
2. Read the checkout response and recorded call sequence.

**Expected Results:**

* The order and lines commit before Shopify is called.
* No database transaction remains open during the provider call.
* The provider reference is stored before the hosted URL returns.

### grade10-site-store-checkout-US1-TC17-1: A changed request conflicts with its existing intent

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
* **Trace:** Safe repetition and recovery

**Pre-conditions:**

* customer(member) has an intent bound to reviewed basket and tender.
* The repeated request changes its quantity or tender choice.

**Steps:**

1. Submit the changed request with the existing intent key.
2. Read the checkout response and reservation records.

**Expected Results:**

* Intent conflict identifies the original Grade10 order.
* No new reservation, order or Shopify invoice is created.

### grade10-site-store-checkout-US1-TC18-1: Terminal replay survives changed catalog and verification facts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has a settled unchanged checkout intent.
* Catalog price and buyer verification facts have since changed.

**Steps:**

1. Submit Pay with fresh authentication and the unchanged intent.
2. Read the response and provider call records.

**Expected Results:**

* The existing terminal outcome is returned.
* New live-money and verification gates do not block replay.
* No new purchase or provider creation starts.

### grade10-site-store-checkout-US1-TC19-1: Customer refusal cannot create another invoice

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
* **Trace:** Safe repetition and recovery

**Pre-conditions:**

* customer(member) has a dispatched checkout.
* Shopify refuses its paired customer.

**Steps:**

1. Complete the checkout refusal handling.
2. Read the response and provider creation records.

**Expected Results:**

* The response reports refusal or recovery.
* No automatic invoice without the customer replaces this intent.

### grade10-site-store-checkout-US1-TC20-1: An unresolved dispatch blocks a changed purchase

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

* customer(member) has a dispatched checkout with unresolved provider state.
* The basket or tender has changed.

**Steps:**

1. Submit Pay with a new intent for the edited purchase.
2. Read the checkout response and provider creation records.

**Expected Results:**

* The unresolved order receives settling or recovery-required handling.
* No new invoice is created before verified payment or cancellation.

### grade10-site-store-checkout-US1-TC21-1: Gross-goods verification refuses Pay despite reduced tender

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
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member, unverified buyer) has gross goods worth HKD 120,000.
* Accepted promo or points reduce the estimate below HKD 120,000.

**Steps:**

1. Submit Pay for the reviewed basket.
2. Read the checkout response.

**Expected Results:**

* Gross goods trigger the account-verification requirement.
* No Grade10 order or Shopify invoice is created.

---

## grade10-site-store-checkout-US2: Collector repairs a changed cart line

**As a** collector whose cart changed while the cart drawer was open,
**I want** the changed line named before I pay,
**so that** I can fix the basket instead of paying for stale goods.

### grade10-site-store-checkout-US2-TC1-1: Changed drawer lines block payment before handoff

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

* customer(member) is on <grade10 store url> with <changed line>.
* The live shop read returns <line change> while the drawer opens.

**Test data:**

| Field | Value |
| --- | --- |
| <changed line> | One named line previously held in the member cart |
| <line change> | The line's current price differs from its held price |
| <line change> | The line is no longer available |
| <line change> | Available quantity falls below the held quantity |

**Steps:**

1. Open the cart drawer.
2. Wait for the live review.
3. Read the changed line notice.
4. Try the drawer payment action.

**Expected Results:**

* The notice names <changed line> and its current shop answer.
* Pay is unavailable until the basket is repaired.
* No Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US2-TC2-1: Failed drawer reads keep held facts unchecked

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url> with a held cart line.
* The live shop read fails.

**Steps:**

1. Open the cart drawer.
2. Wait for the failed live review.
3. Read the drawer summary.
4. Try the drawer payment action.
5. Click the review retry control.

**Expected Results:**

* Held price and availability are not presented as current.
* Pay remains unavailable after the failed read.
* A retry is offered without creating an order or invoice.

### grade10-site-store-checkout-US2-TC3-1: Shopify names a line refused during hosted payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on a Shopify invoice with one sellable line.
* Shopify makes that line unavailable before payment.

**Steps:**

1. Continue to payment on the Shopify invoice.
2. Read the refusal.
3. Return to <grade10 store url>.
4. Open the cart drawer.

**Expected Results:**

* Shopify names the unavailable line.
* The Grade10 order remains recoverable and unpaid.
* The member cart remains available for repair and retry.

### grade10-site-store-checkout-US2-TC4-1: Pay rechecks changes after the drawer review

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) has a successful current drawer review.
* Shopify changes one reviewed line before Pay is received.

**Steps:**

1. Submit Pay with the reviewed basket.
2. Read the checkout response.

**Expected Results:**

* The changed line is named before an order is created.
* No Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US2-TC5-1: Incomplete or contradictory reads cannot authorize payment

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) has a reviewed basket.
* The Pay-time live shop response has <invalid facts>.

**Test data:**

| Field | Value |
| --- | --- |
| <invalid facts> | A requested line is absent from the response |
| <invalid facts> | Conflicting current answers describe the same requested line |

**Steps:**

1. Submit Pay with the reviewed basket.
2. Read the checkout response.

**Expected Results:**

* The incomplete or contradictory review blocks payment.
* No Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US2-TC6-1: An unfinished live review cannot enable payment

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url> with a held cart line.
* The live shop read is delayed.

**Steps:**

1. Open the cart drawer.
2. Read the summary while the review is pending.
3. Try the drawer payment action.

**Expected Results:**

* The held facts are not presented as a completed current review.
* Pay remains unavailable while the live review is pending.
* No Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US2-TC7-1: Uncertain gift cleanup cannot replace the invoice

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) has an invoice charging an unsupported gift.
* Invoice cancellation fails or its result is uncertain.

**Steps:**

1. Complete checkout cleanup handling.
2. Read the response and stored payable facts.
3. Read the provider creation records.

**Expected Results:**

* The mismatched invoice is withheld from handoff.
* Original payable facts remain available for recovery or settlement.
* No replacement invoice is created for the intent.

---

## grade10-site-store-checkout-US3: Collector finds the paid order after Shopify

**As a** signed-in collector who paid on Shopify,
**I want** to return to Grade10 and find the order while it settles,
**so that** I can trust the store did not lose my purchase.

### grade10-site-store-checkout-US3-TC1-1: A pending purchase remains visible while payment settles

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

* customer(member) has returned from Shopify.
* The matching Grade10 order remains pending.

**Steps:**

1. Open Your Orders on Grade10.
2. Read the matching purchase.
3. Wait for its next status update.

**Expected Results:**

* The matching purchase appears among active orders.
* Pending is shown as settling, not an empty result.
* The page polls until settlement or a retryable failure.

### grade10-site-store-checkout-US3-TC2-1: Paid settlement releases the purchased cart lines

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-03

**Blocked:** @kinisworking to settle Q16 when quantity increases during payment; unchanged-cart settlement is settled.

**Pre-conditions:**

* customer(member) is on a Shopify invoice for their Grade10 cart.

**Steps:**

1. Complete the invoice payment on Shopify.
2. Return to <grade10 store url>.
3. Open the cart drawer.
4. Open Your Orders.
5. Open the matching order detail.

**Expected Results:**

* The order shows paid with Shopify's paid total.
* The cart no longer contains the paid lines.
* Your Orders shows the matching paid purchase.
* The matching order detail opens.

### grade10-site-store-checkout-US3-TC4-1: Both Shopify confirmation surfaces offer Grade10 Your Orders

Runs once per row of **Test data**.

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

* customer(member) has paid a Shopify invoice.
* customer(member) is on <confirmation surface>.

**Test data:**

| Field | Value |
| --- | --- |
| <confirmation surface> | Shopify Thank You page |
| <confirmation surface> | Shopify Order status page |

**Steps:**

1. Click Grade10 Your Orders in the Shopify extension.
2. Read the Grade10 destination.

**Expected Results:**

* The static link opens Grade10 Your Orders.
* The matching purchase appears there.
* The link works independently of native Continue shopping.

### grade10-site-store-checkout-US3-TC3-1: Reconciliation repairs a missed Shopify payment event

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

* customer(member) has a paid Shopify invoice.
* Its payment webhook is not delivered to Grade10.

**Steps:**

1. Run payment reconciliation.
2. Read the owned order response.

**Expected Results:**

* The existing invoice is found without creating another.
* The Grade10 order moves to paid once.
* Shopify's paid total and shipping and tax facts are retained.

### grade10-site-store-checkout-US3-TC5-1: Invalid payment events cannot settle a purchase

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) has an unpaid Grade10 order.
* A payment event has <invalid event condition>.

**Test data:**

| Field | Value |
| --- | --- |
| <invalid event condition> | An unknown provider reference |
| <invalid event condition> | A shop different from the order's shop |
| <invalid event condition> | An invalid signature |

**Steps:**

1. Deliver the payment event to Grade10.
2. Read the order response.

**Expected Results:**

* The order does not move to paid.
* The event is recorded for diagnosis.
* No replacement order is created.

### grade10-site-store-checkout-US3-TC6-1: Owned detail reads repair missed payment settlement

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

* customer(member) has a paid Shopify invoice.
* The matching Grade10 order is pending after a missed webhook.

**Steps:**

1. Request the member's matching order detail.
2. Read the owned order response.

**Expected Results:**

* The owned detail read discovers the existing paid invoice.
* The order converges to paid through the guarded transition.
* No second invoice is created.

### grade10-site-store-checkout-US3-TC7-1: Repeated settlement signals release paid lines once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) has a paid Shopify invoice.
* The matching Grade10 order has not yet settled.

**Steps:**

1. Deliver its verified payment event.
2. Deliver the same payment event again.
3. Run payment reconciliation.
4. Read the owned order response.

**Expected Results:**

* The order reaches paid once.
* Repeated signals preserve the settled payment facts.
* The paid cart lines are released once.

### grade10-site-store-checkout-US3-TC8-1: Another member cannot read the matching order detail

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
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer A(member) owns a checkout order.
* customer B(member) has a separate authenticated session.

**Steps:**

1. Request customer A's order detail as customer B.
2. Read the order response.

**Expected Results:**

* Customer B receives no owned order detail.
* No provider read or payment repair is triggered.
* Customer A's order and cart remain unchanged.

### grade10-site-store-checkout-US3-TC9-1: The orders list reads stored purchases without repairing each row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) owns several pending checkout orders.
* Provider repair calls are observable in the test harness.

**Steps:**

1. Request the member orders list.
2. Read the response and provider call records.
3. Request one owned pending order detail.

**Expected Results:**

* The list shows the stored orders.
* Listing triggers no provider repair for each row.
* Owned detail retains its provider repair path.

---

## grade10-site-store-checkout-US4: Signed-out collector is asked to sign in

**As a** collector who is not signed in,
**I want** checkout to explain the identity requirement,
**so that** I can sign in before an order or payment is started.

### grade10-site-store-checkout-US4-TC1-1: The public cart drawer requires a member session

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

* customer is signed out on <grade10 store url> with a cart line.

**Steps:**

1. Open the cart drawer.
2. Try to continue to payment.
3. Read the sign-in outcome.

**Expected Results:**

* Checkout explains the signed-in requirement.
* The sign-in surface is shown.
* No Grade10 order or Shopify invoice is created.
* Typed email is not public identity proof.

### grade10-site-store-checkout-US4-TC2-1: An expired member session cannot start hosted payment

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
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* customer(member) has a successful drawer review.
* The member session expires before Pay is received.

**Steps:**

1. Submit Pay for the reviewed basket.
2. Read the checkout response.

**Expected Results:**

* A fresh signed-in session is required.
* No Grade10 order or Shopify invoice is created.

### grade10-site-store-checkout-US4-TC3-1: Typed email remains restricted to elevated operator tests

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* customer is on the public storefront with <session condition>.

**Test data:**

| Field | Value |
| --- | --- |
| <session condition> | No signed-in session |
| <session condition> | A signed-in member without elevated operator access |

**Steps:**

1. Submit a typed-email checkout request.
2. Read the checkout response.

**Expected Results:**

* Typed email cannot authorize public checkout.
* No identity lookup, order creation or provider call occurs.

### grade10-site-store-checkout-US4-TC4-1: An authorized sandbox operator retains typed-email checkout

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
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* admin(holds store:write) has an authenticated sandbox session.
* The environment is development or staging.
* The typed email identifies a buyer with a ready basket.

**Steps:**

1. Submit typed-email checkout through the operator test procedure.
2. Read the checkout response.

**Expected Results:**

* The authorized operator bench flow accepts the buyer identity.
* Its reviewed basket reaches the existing checkout result mapping.

### grade10-site-store-checkout-US4-TC5-1: Production refuses typed-email checkout before identity lookup

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
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* admin(holds store:write) has an authenticated production session.
* Identity and provider calls are observable in the test harness.

**Steps:**

1. Submit a typed-email checkout request.
2. Read the response and call records.

**Expected Results:**

* The production boundary refuses typed-email checkout.
* No identity lookup, order creation or provider call occurs.

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

**Run:** 2026-10-03, fresh QA2 after independent QA1 and Dev readings. QA1 read only the frozen `/tmp/grade10-checkout-planning.q9RjMf` bundle: anchors, proposal, decisions, journeys, stripped design, checkout PRD, context, stripped existing suite and domain suite; requirements, technical design, reconciliation, acceptance and archive were denied. QA2 read that bundle, both reports and the current proposal, decisions, journeys, UI design, technical design, scenarios and tasks. Non-anchor drawer, tender, fingerprint/replay and pending-policy clarifications were reread; frozen journey and feature-root anchors remain unchanged.

### Blind Cases

All 32 blind cases are retained at version 1, draft/manual. The joins below are by journey or named feature root; scenario ids appear only in this reconciliation.

| Blind Case | Anchor | Scenario Join | Disposition |
| --- | --- | --- | --- |
| `grade10-site-store-checkout-US1-TC1-1` | Current basket and tender; Hosted Shopify handoff | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-05` | Folded: current line fields, ready-only Pay and local order/no embedded form made explicit. |
| `grade10-site-store-checkout-US1-TC2-1` | Current basket and tender | `grade10-site-store-checkout-SC-02` | Folded: store currency, accepted tender and Shopify final charges. |
| `grade10-site-store-checkout-US1-TC3-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-09` | Folded: concurrency retains one order and payable invoice. |
| `grade10-site-store-checkout-US1-TC4-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-10` | Folded: lost response recovers the original invoice. |
| `grade10-site-store-checkout-US1-TC5-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-11` | Raised Q15: invalidation is covered; known payable old-invoice policy remains unanswered. |
| `grade10-site-store-checkout-US1-TC6-1` | Carrier rates | `grade10-site-store-checkout-SC-17` | Folded: shared rate/currency and stateless callback. |
| `grade10-site-store-checkout-US1-TC7-1` | Carrier rates | `grade10-site-store-checkout-SC-18` | Folded: unsupported destination, no rate or mutation. |
| `grade10-site-store-checkout-US1-TC8-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-19` | Folded: every terminal-status partition replays without creation. |
| `grade10-site-store-checkout-US1-TC9-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-20` | Folded: ready recovery retains the order and one dispatch. |
| `grade10-site-store-checkout-US1-TC10-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-21` | Folded: accepted manual_review already blocks every new member purchase; false Blocked removed. |
| `grade10-site-store-checkout-US1-TC11-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-23` | Folded: same-session reload retains the intent. |
| `grade10-site-store-checkout-US1-TC12-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-05` | Folded: accepted below-limit verification partition, not a new threshold. |
| `grade10-site-store-checkout-US1-TC13-1` | Current basket and tender; Hosted Shopify handoff | `grade10-site-store-checkout-SC-32` | Folded: gross-goods at/above boundary and inline account action; server refusal added separately. |
| `grade10-site-store-checkout-US1-TC14-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-05` | Folded: accepted verified-at-limit partition. |
| `grade10-site-store-checkout-US1-TC15-1` | Carrier rates | `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18` | Folded: existing token-gated requirement, not an invented carrier outcome. |
| `grade10-site-store-checkout-US2-TC1-1` | Current basket and tender | `grade10-site-store-checkout-SC-03` | Folded: quantity reduction added beside price and availability partitions. |
| `grade10-site-store-checkout-US2-TC2-1` | Current basket and tender | `grade10-site-store-checkout-SC-04` | Folded: failed read keeps facts unchecked and retry available. |
| `grade10-site-store-checkout-US2-TC3-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-07` | Folded: hosted refusal retains named unpaid, recoverable purchase. |
| `grade10-site-store-checkout-US2-TC4-1` | Current basket and tender | `grade10-site-store-checkout-SC-22` | Folded: Pay rechecks after the drawer quote. |
| `grade10-site-store-checkout-US2-TC5-1` | Current basket and tender | `grade10-site-store-checkout-SC-22` | Folded into existing no-stale-handoff requirement: incomplete/contradictory facts refuse without creation; no new UX. |
| `grade10-site-store-checkout-US2-TC6-1` | Current basket and tender | `grade10-site-store-checkout-SC-01` | Folded into ready-only Pay/review requirement: pending read cannot authorize payment. |
| `grade10-site-store-checkout-US3-TC1-1` | Order settlement and return | `grade10-site-store-checkout-SC-12` | Folded: pending purchase remains visible and polls. |
| `grade10-site-store-checkout-US3-TC2-1` | Order settlement and return | `grade10-site-store-checkout-SC-13` | Raised Q16: unchanged-cart release covered; added-quantity removal policy remains unanswered. |
| `grade10-site-store-checkout-US3-TC3-1` | Order settlement and return | `grade10-site-store-checkout-SC-14` | Folded: reconcile repairs missed payment and retains paid facts. |
| `grade10-site-store-checkout-US3-TC4-1` | Order settlement and return | `grade10-site-store-checkout-SC-15` | Folded: both hosted confirmation surfaces use static Your Orders link. |
| `grade10-site-store-checkout-US3-TC5-1` | Order settlement and return | `grade10-site-store-checkout-SC-16` | Folded: unknown reference/wrong shop/invalid signature do not settle. |
| `grade10-site-store-checkout-US3-TC6-1` | Order settlement and return | `grade10-site-store-checkout-SC-14` | Folded into settlement requirement: owned detail repair uses guarded transition; no new journey. |
| `grade10-site-store-checkout-US3-TC7-1` | Order settlement and return | `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14` | Folded: duplicate and reconcile convergence releases once. |
| `grade10-site-store-checkout-US3-TC8-1` | Order settlement and return | `grade10-site-store-checkout-SC-29` | Folded: ownership refusal now asserts no provider repair. |
| `grade10-site-store-checkout-US4-TC1-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-06` | Folded: public signed-in boundary. |
| `grade10-site-store-checkout-US4-TC2-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-06` | Folded: fresh authentication at Pay covers expired session. |
| `grade10-site-store-checkout-US4-TC3-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-31` | Folded: unauthorized typed email refuses before lookup or side effects. |

### Uncovered Scenarios

The independent draft exposed the following missing claims. Each now has a bounded API draft; none is exempted as a technical detail or delegated to an unrelated domain case.

| Added Case | Anchor | Scenario Join | Disposition |
| --- | --- | --- | --- |
| `grade10-site-store-checkout-US1-TC16-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-08` | Added: transaction/provider/bind sequencing. |
| `grade10-site-store-checkout-US1-TC17-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-24` | Added: changed fingerprint under same key; no new reservation. |
| `grade10-site-store-checkout-US1-TC18-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-25` | Added: unchanged terminal replay precedes later catalog/KYC gates. |
| `grade10-site-store-checkout-US1-TC19-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-26` | Added: customer-refusal fallback cannot create again. |
| `grade10-site-store-checkout-US1-TC20-1` | Safe repetition and recovery | `grade10-site-store-checkout-SC-28` | Added: unresolved dispatch blocks edited/new intent before deadline. |
| `grade10-site-store-checkout-US1-TC21-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-32` | Added: direct server refusal despite reduced tender. |
| `grade10-site-store-checkout-US2-TC7-1` | Hosted Shopify handoff; Safe repetition and recovery | `grade10-site-store-checkout-SC-27` | Added: uncertain gift cleanup withholds URL, retains original payable facts. |
| `grade10-site-store-checkout-US3-TC9-1` | Order settlement and return | `grade10-site-store-checkout-SC-30` | Added: list remains a stored projection; detail retains repair. |
| `grade10-site-store-checkout-US4-TC4-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-31` | Added: authorized sandbox bench remains available. |
| `grade10-site-store-checkout-US4-TC5-1` | Hosted Shopify handoff | `grade10-site-store-checkout-SC-31` | Added: production operator refusal precedes identity lookup. |

### Scenario Coverage

| Scenario | Cases Asserting Its Outcome | Disposition |
| --- | --- | --- |
| `grade10-site-store-checkout-SC-01` | `grade10-site-store-checkout-US1-TC1-1`, `grade10-site-store-checkout-US2-TC6-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-02` | `grade10-site-store-checkout-US1-TC2-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-03` | `grade10-site-store-checkout-US2-TC1-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-04` | `grade10-site-store-checkout-US2-TC2-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-05` | `grade10-site-store-checkout-US1-TC1-1`, `grade10-site-store-checkout-US1-TC12-1`, `grade10-site-store-checkout-US1-TC14-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-06` | `grade10-site-store-checkout-US4-TC1-1`, `grade10-site-store-checkout-US4-TC2-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-07` | `grade10-site-store-checkout-US2-TC3-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-08` | `grade10-site-store-checkout-US1-TC16-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-09` | `grade10-site-store-checkout-US1-TC3-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-10` | `grade10-site-store-checkout-US1-TC4-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-11` | `grade10-site-store-checkout-US1-TC5-1` | Raised Q15 at the old-invoice policy boundary; stated invalidation covered. |
| `grade10-site-store-checkout-SC-12` | `grade10-site-store-checkout-US3-TC1-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-13` | `grade10-site-store-checkout-US3-TC2-1`, `grade10-site-store-checkout-US3-TC7-1` | Raised Q16 for added quantity; stated unchanged-cart settlement covered. |
| `grade10-site-store-checkout-SC-14` | `grade10-site-store-checkout-US3-TC3-1`, `grade10-site-store-checkout-US3-TC6-1`, `grade10-site-store-checkout-US3-TC7-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-15` | `grade10-site-store-checkout-US3-TC4-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-16` | `grade10-site-store-checkout-US3-TC5-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-17` | `grade10-site-store-checkout-US1-TC6-1`, `grade10-site-store-checkout-US1-TC15-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-18` | `grade10-site-store-checkout-US1-TC7-1`, `grade10-site-store-checkout-US1-TC15-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-19` | `grade10-site-store-checkout-US1-TC8-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-20` | `grade10-site-store-checkout-US1-TC9-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-21` | `grade10-site-store-checkout-US1-TC10-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-22` | `grade10-site-store-checkout-US2-TC4-1`, `grade10-site-store-checkout-US2-TC5-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-23` | `grade10-site-store-checkout-US1-TC11-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-24` | `grade10-site-store-checkout-US1-TC17-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-25` | `grade10-site-store-checkout-US1-TC18-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-26` | `grade10-site-store-checkout-US1-TC19-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-27` | `grade10-site-store-checkout-US2-TC7-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-28` | `grade10-site-store-checkout-US1-TC20-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-29` | `grade10-site-store-checkout-US3-TC8-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-30` | `grade10-site-store-checkout-US3-TC9-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-31` | `grade10-site-store-checkout-US4-TC3-1`, `grade10-site-store-checkout-US4-TC4-1`, `grade10-site-store-checkout-US4-TC5-1` | Folded; all stated outcomes asserted. |
| `grade10-site-store-checkout-SC-32` | `grade10-site-store-checkout-US1-TC13-1`, `grade10-site-store-checkout-US1-TC21-1` | Folded; all stated outcomes asserted. |

### Questions

- **Rejected recovery question** — accepted published checkout already states that unresolved `manual_review` blocks every new purchase by the member. This was missing from QA1's limited input, not an unanswered policy; TC10 is unblocked without inventing a rule.
- **Raised Q15** — a known bound unpaid invoice after an edit has no settled cancel-or-remain-payable policy. TC5 stays draft and Blocked at that boundary; SC-11 states invalidation only. The ❓ Changed purchase entry in the checkout PRD and decisions Raised table await @kinisworking.
- **Raised Q16** — increased current quantity during hosted payment has no settled release amount. TC2 stays draft and Blocked at that boundary; SC-13 covers the unchanged basket. The ❓ Added quantity entry in the checkout PRD and decisions Raised table await @kinisworking.
- **Rejected empty-cart question** — the shared store-cart contract already hides the entire footer for zero items and renders its empty slots; the cart PRD names the empty story. Checkout does not invent a zero-line payment flow. Cart-drawer/shared component suites own that appearance.
- **Rejected account-switch question** — shared auth/session requires current-person identity and per-person data keyed by user id; the cart PRD has one member scope and no signed-out lines or guest merge. The technical design clears member/shop-scoped intent storage on logout/switch. Another member cannot reuse the first member's cart, intent or order; checkout adds no account-switch UX.
- **Remaining anchors** — every frozen journey and root is reached. No scenario is Out of suite; no domain case is credited. Q15 and Q16 remain unanswered product boundaries, not rejected cases or deferred delivery authorization. Acceptance must wait for their source decisions and the dependent reconciliation.

### Manual

All rows await implementation and human QA; none records an observed execution or automated proof. API rows name a harness run, not a new operator product surface.

| Manual | Why |
| --- | --- |
| `grade10-site-store-checkout-US1-TC1-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC2-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC3-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC4-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC5-1` | to be walked in Group 6 The walk after Q15 is settled; changed-invoice policy |
| `grade10-site-store-checkout-US1-TC6-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC7-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC8-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC9-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC10-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC11-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC12-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC13-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC14-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC15-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US2-TC1-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US2-TC2-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US2-TC3-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US2-TC4-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US2-TC5-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US2-TC6-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US3-TC1-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US3-TC2-1` | to be walked in Group 6 The walk after Q16 is settled; added-quantity release |
| `grade10-site-store-checkout-US3-TC3-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US3-TC4-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US3-TC5-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US3-TC6-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US3-TC7-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US3-TC8-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US4-TC1-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US4-TC2-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US4-TC3-1` | to be walked in Group 6 The walk; drawer, hosted payment or API harness outcome |
| `grade10-site-store-checkout-US1-TC16-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US1-TC17-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US1-TC18-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US1-TC19-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US1-TC20-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US1-TC21-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US2-TC7-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US3-TC9-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US4-TC4-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
| `grade10-site-store-checkout-US4-TC5-1` | to be walked in Group 6 The walk; Shopify/provider or API harness outcome |
