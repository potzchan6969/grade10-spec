# grade10-site/store/checkout Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-03, tcs-rules r4

## grade10-site-store-checkout-US1: Collector sends a current cart to hosted payment

**As a** signed-in collector,
**I want** to review my current cart and send its accepted tender to Shopify,
**so that** I pay for the lines and choices I just saw.

### grade10-site-store-checkout-US1-TC1-2: Current drawer basket and tender reach hosted payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The cart holds <reviewed basket> and <accepted tender>.

**Test data:**

| Field | Value |
| --- | --- |
| <reviewed basket> | Two available variants, quantities 1 and 2; representative positive quantities |
| <accepted tender> | One accepted store code and accepted points choice |

**Steps:**

1. Open the cart drawer.
2. Read the reviewed lines and accepted tender.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice.

**Expected Results:**

* The drawer shows current quantities, prices and accepted tender.
* Checkout sends <reviewed basket> with <accepted tender>.
* The returned hosted URL opens directly from the drawer.
* The invoice shows the reviewed basket and accepted tender.
* Shopify collects the shipping address and payment.

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

* customer(member) is on <grade10 store url>.
* The cart holds available goods and accepted tender.

**Steps:**

1. Open the cart drawer.
2. Read the estimated total.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice totals.

**Expected Results:**

* The drawer labels the total as an estimate.
* The estimate excludes final shipping and tax.
* Shopify calculates final shipping and tax.

### grade10-site-store-checkout-US1-TC6-1: A served destination receives the store preview rate

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC12-2: Unverified goods below the limit reach hosted payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
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
2. Wait for the current review.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice.

**Expected Results:**

* The account-verification gate does not replace checkout.
* The returned hosted URL opens.

### grade10-site-store-checkout-US1-TC14-2: Verified goods at the limit reach hosted payment

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
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member, verified buyer) is on <grade10 store url>.
* The cart holds available goods worth <gross goods>.

**Test data:**

| <gross goods> | Expected checkout |
| --- | --- |
| HKD 120,000.00, the verification limit | Available to the verified buyer |
| HKD 120,000.01, one minor unit above the limit | Available to the verified buyer |

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice.

**Expected Results:**

* The verified buyer can use the checkout action.
* The returned hosted URL opens.

### grade10-site-store-checkout-US1-TC3-1: Concurrent Pay requests retain one payable invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC4-1: A lost provider response recovers the same invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC5-2: Edited basket and tender reach a fresh submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* An earlier hosted invoice remains payable.
* The drawer holds <changed basket> and <changed tender>.
* The current basket review and accepted tender are ready.

**Test data:**

| Field | Value |
| --- | --- |
| <changed basket> | Earlier quantity 1 is now 2; an available second variant is added |
| <changed tender> | Earlier code removed; a different accepted points choice |

**Steps:**

1. Open the cart drawer.
2. Read the current basket and accepted tender.
3. Click Proceed to Checkout in the drawer.
4. Read the returned hosted invoice.

**Expected Results:**

* The submission carries the current basket and accepted tender.
* Existing creation is called again.
* The returned hosted URL opens.
* The earlier invoice is ignored, without cancellation or reuse.

### grade10-site-store-checkout-US1-TC8-1: Terminal intent replay retains its existing outcome

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC9-1: A worker stop before dispatch permits safe recovery

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC10-1: An unresolved dispatch requires operator recovery

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC7-1: Unsupported destinations receive no carrier rate

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC11-1: Same-session reload retains the reviewed checkout intent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC13-2: Unverified goods at the limit require account verification

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
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member, unverified buyer) is on <grade10 store url>.
* The cart holds <gross goods>, with <accepted tender>.

**Test data:**

| <gross goods> | <accepted tender> | Expected checkout |
| --- | --- | --- |
| HKD 120,000.00, the verification limit | Accepted points reducing the estimate below HKD 120,000 | Existing verification feedback and account action |
| HKD 120,000.01, one minor unit above the limit | Accepted points reducing the estimate below HKD 120,000 | Existing verification feedback and account action |

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Read the verification feedback.
4. Activate the account verification action.

**Expected Results:**

* The verification message and account action are shown.
* Gross goods trigger the gate despite the lower estimate.
* The account action opens account verification.
* The frontend sends no checkout creation request.

### grade10-site-store-checkout-US1-TC15-1: Carrier requests without permission return no usable rate

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC16-1: Provider binding precedes the hosted response

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC17-1: A changed request conflicts with its existing intent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has an intent bound to reviewed basket and tender.
* The repeated request changes its quantity or tender choice.

**Steps:**

1. Submit the changed request with the existing intent key.
2. Read the checkout response and reservation records.

**Expected Results:**

* Intent conflict identifies the original Grade10 order.
* No new reservation, order or Shopify invoice is created.

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC18-1: Terminal replay survives changed catalog and verification facts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC19-1: Customer refusal cannot create another invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has a dispatched checkout.
* Shopify refuses its paired customer.

**Steps:**

1. Complete the checkout refusal handling.
2. Read the response and provider creation records.

**Expected Results:**

* The response reports refusal or recovery.
* No automatic invoice without the customer replaces this intent.

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC20-1: An unresolved dispatch blocks a changed purchase

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC21-1: Gross-goods verification refuses Pay despite reduced tender

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US1-TC22-1: A pending request prevents another frontend submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket review and accepted tender are ready.
* The checkout creation response is mocked to remain pending.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Try the checkout control again while awaiting its response.
4. Release the response with the existing hosted URL outcome.

**Expected Results:**

* Checkout is unavailable while its request is pending.
* The frontend sends only the first creation request.
* The returned hosted URL opens when the response arrives.

### grade10-site-store-checkout-US1-TC23-1: A later Pay creates a fresh submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket review and accepted tender are ready.
* An earlier invoice exists for this unchanged basket.
* Checkout creation is mocked to return a different hosted URL.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the opened payment destination.

**Expected Results:**

* The frontend calls existing creation again.
* The newly returned hosted URL opens.
* The earlier invoice does not block or replace this submission.

### grade10-site-store-checkout-US1-TC24-1: Reload does not require an earlier invoice to close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* An earlier invoice remains payable for the current basket.

**Steps:**

1. Reload <grade10 store url>.
2. Open the cart drawer.
3. Wait for the current review.
4. Click Proceed to Checkout in the drawer.

**Expected Results:**

* The drawer uses current basket and accepted tender.
* Pay calls existing creation again.
* The frontend does not wait for the earlier invoice.

### grade10-site-store-checkout-US1-TC25-1: An empty basket offers no hosted payment

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current cart review returns no lines.

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Read the empty drawer.

**Expected Results:**

* The existing empty state is displayed.
* No checkout action starts an empty purchase.
* The frontend sends no checkout creation request.

### grade10-site-store-checkout-US1-TC26-1: Checkout verification response shows existing account feedback

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket review and accepted tender are ready.
* Checkout creation is mocked to return the existing verification-required outcome.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the account-verification feedback.
4. Activate the account verification action.

**Expected Results:**

* The existing threshold message and account action are shown.
* No hosted payment destination opens.
* The account action opens verification.

---

### grade10-site-store-checkout-US1-TC27-1: Pending cart and tender writes prevent payment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The drawer shows an available basket and accepted tender.
* The next <write> is mocked to remain pending.

**Test data:**

| <write> | Drawer action |
| --- | --- |
| Cart quantity | Increase an available line's quantity |
| Tender choice | Change the accepted points choice |

**Steps:**

1. Open the cart drawer.
2. Make the drawer action in Test data.
3. Try the checkout control while the write is pending.
4. Release the write and its current quote.
5. Read the checkout control.

**Expected Results:**

* Checkout is unavailable during the pending write.
* No creation request starts with the earlier facts.
* Checkout becomes available after current review and quote are ready.

### grade10-site-store-checkout-US1-TC28-1: Failed tender changes preserve the accepted choice

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The drawer holds accepted points of 10.
* Changing points to 20 is mocked to fail.
* The current quote for the retained choice becomes ready.

**Test data:**

| Field | Value |
| --- | --- |
| <requested points> | 20, different from the accepted 10; both valid choices in the fixture |

**Steps:**

1. Open the cart drawer.
2. Enter <requested points> in the points control.
3. Wait for the failed change and current quote.
4. Read the accepted tender.
5. Click Proceed to Checkout in the drawer.

**Expected Results:**

* Existing failure feedback appears.
* The retained accepted points choice remains 10.
* Pay uses the retained choice with its ready quote.

### grade10-site-store-checkout-US1-TC29-1: A settling response opens the existing order surface

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket and accepted tender are ready.
* Creation is mocked to return the existing settling outcome.
* The existing order read returns that pending purchase.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the opened order surface.
4. Open the cart drawer.

**Expected Results:**

* The existing order surface shows the pending purchase.
* No hosted URL or paid result is invented.
* The cart and tender remain until observed payment.

## grade10-site-store-checkout-US2: Collector repairs a changed cart line

**As a** collector whose cart changed while the cart drawer was open,
**I want** the changed line named before I pay,
**so that** I can fix the basket instead of paying for stale goods.

### grade10-site-store-checkout-US2-TC1-2: Changed drawer lines block payment before handoff

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
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The cart review is mocked to identify <changed line>.

**Test data:**

| Field | Value |
| --- | --- |
| <changed line> | A cart variant reported unavailable by current review |
| <changed line> | A cart variant repriced by current review |
| <changed line> | A cart variant reduced by current review |

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Read the named-line feedback.
4. Try the drawer checkout action.

**Expected Results:**

* The feedback names the changed line.
* Checkout remains unavailable until the basket is ready.
* The frontend sends no checkout creation request.

### grade10-site-store-checkout-US2-TC2-2: Failed drawer reads keep held facts unchecked

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current cart review is mocked to fail.

**Steps:**

1. Open the cart drawer.
2. Wait for the failed review.
3. Read the drawer summary.
4. Try the drawer checkout action.

**Expected Results:**

* Held prices and availability are not presented as current.
* The drawer displays the existing failed-review state.
* The existing review retry is offered.
* Checkout is unavailable.
* The frontend sends no checkout creation request.

### grade10-site-store-checkout-US2-TC3-1: Shopify names a line refused during hosted payment

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US2-TC4-2: A named-line checkout refusal permits basket repair

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket review and accepted tender are ready.
* Checkout creation is mocked to return its existing named-line refusal.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the refused line.
4. Repair the named line using drawer quantity or removal.
5. Wait for the current review.
6. Click Proceed to Checkout when the basket is ready.

**Expected Results:**

* The existing refusal identifies the affected line.
* No hosted payment destination opens on refusal.
* The repaired basket receives a current review.
* The later submission uses existing creation again.

### grade10-site-store-checkout-US2-TC5-1: Incomplete or contradictory reads cannot authorize payment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US2-TC6-2: An unfinished live review cannot enable payment

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current cart review is mocked to remain pending.

**Steps:**

1. Open the cart drawer.
2. Read the drawer while review is pending.
3. Try the drawer checkout action.

**Expected Results:**

* Held facts are not shown as a completed current review.
* Checkout remains unavailable while the review is pending.
* The frontend sends no checkout creation request.

### grade10-site-store-checkout-US2-TC7-1: Uncertain gift cleanup cannot replace the invoice

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US2-TC8-1: Checkout failure releases the pending control for retry

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket review and accepted tender are ready.
* Checkout creation is mocked to return its existing failure outcome.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the failure feedback.
4. Click Proceed to Checkout once the basket is ready.

**Expected Results:**

* The drawer shows existing failure feedback.
* No hosted URL opens for the failed outcome.
* Checkout becomes available when the request ends and basket is ready.
* A later click calls existing creation again.

---

### grade10-site-store-checkout-US2-TC9-1: Contradictory reviews and failed quotes prevent payment

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The drawer reads are mocked with <read condition>.

**Test data:**

| <read condition> | Expected checkout |
| --- | --- |
| Current review has contradictory line facts | Unavailable |
| Current tender quote fails | Unavailable |
| Current tender quote remains pending | Unavailable |
| Current tender quote contradicts reviewed basket | Unavailable |

**Steps:**

1. Open the cart drawer.
2. Wait for the current reads.
3. Read the drawer feedback.
4. Try the checkout control.

**Expected Results:**

* Existing feedback shows the unresolved read condition.
* Checkout is unavailable.
* The frontend sends no creation request.

### grade10-site-store-checkout-US2-TC10-1: Lost creation responses offer a fresh retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket and accepted tender are ready.
* Creation is mocked with <response failure>.
* A later creation returns a hosted URL.

**Test data:**

| <response failure> | Expected treatment |
| --- | --- |
| Response lost in transport | Existing failure feedback |
| Response cannot be decoded | Existing failure feedback |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the failure feedback.
4. Click Proceed to Checkout once the basket is ready.
5. Read the opened destination.

**Expected Results:**

* Failure feedback ends the pending submission.
* It does not promise recovery or absence of an invoice.
* The later click invokes creation again.
* The newly returned hosted URL opens.

## grade10-site-store-checkout-US3: Collector finds the paid order after Shopify

**As a** signed-in collector who paid on Shopify,
**I want** to return to Grade10 and find the order while it settles,
**so that** I can trust the store did not lose my purchase.

### grade10-site-store-checkout-US3-TC1-2: A pending purchase remains visible after Shopify return

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) is on Shopify confirmation.
* The existing orders read is mocked to return the matching pending purchase.
* The member cart still holds the invoice variants.

**Steps:**

1. Click Grade10 Your Orders on Shopify.
2. Read the matching order in Your Orders.
3. Open its existing order detail.
4. Open the Grade10 cart drawer.

**Expected Results:**

* Your Orders shows the matching pending purchase.
* The order surface displays its existing settling state.
* Order detail shows the same purchase.
* Return alone does not clear the cart or tender.

### grade10-site-store-checkout-US3-TC2-2: Observed payment refreshes the existing cart cleanup

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) is on <grade10 orders url>.
* Existing order reads transition the matching purchase from pending to paid.
* The resulting cart read excludes paid variants and clears tender.

**Steps:**

1. Open the matching order detail.
2. Wait for the existing read to show paid.
3. Open the cart drawer.
4. Read its refreshed lines and tender.

**Expected Results:**

* The matching order displays the returned paid state and total.
* The cart refresh reflects the existing paid-transition result.
* Whole matching variant lines are absent.
* Cart tender choices are cleared.

### grade10-site-store-checkout-US3-TC4-1: Both Shopify confirmation surfaces offer Grade10 Your Orders

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
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) is on <confirmation surface>.
* The matching purchase is returned by existing Grade10 order reads.

**Test data:**

| <confirmation surface> | Expected destination |
| --- | --- |
| Shopify Thank You | Grade10 Your Orders |
| Shopify Order status | Grade10 Your Orders |

**Steps:**

1. Read the Grade10 Your Orders link.
2. Click Grade10 Your Orders.
3. Read the matching purchase.

**Expected Results:**

* The static link opens Grade10 Your Orders.
* The matching purchase appears there.
* The link works independently of native Continue shopping.

### grade10-site-store-checkout-US3-TC3-1: Reconciliation repairs a missed Shopify payment event

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US3-TC5-1: Invalid payment events cannot settle a purchase

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US3-TC6-1: Owned detail reads repair missed payment settlement

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US3-TC7-1: Repeated settlement signals release paid lines once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US3-TC8-1: Another member cannot read the matching order detail

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US3-TC9-1: The orders list reads stored purchases without repairing each row

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US3-TC10-1: Cart edits do not change the invoice purchase

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) is on an existing hosted invoice.
* The Grade10 cart is edited during payment to <edited cart>.
* Existing order reads return <invoice purchase> as paid.
* Existing cart reads return whole matching variants removed and tender cleared.

**Test data:**

| Field | Value |
| --- | --- |
| <invoice purchase> | Variant A, quantity 1, fixed on the invoice |
| <edited cart> | Variant A increased to quantity 2; unrelated variant B added |

**Steps:**

1. Return to Grade10 Your Orders.
2. Open the matching order detail.
3. Read the purchased lines.
4. Open the cart drawer.

**Expected Results:**

* The order shows <invoice purchase>, unchanged by later edits.
* The cart refresh reflects existing whole matching-variant removal.
* The unrelated variant remains as returned by the cart read.
* Cart tender choices are cleared.

---

### grade10-site-store-checkout-US3-TC11-1: Missing purchases retain the existing orders surface

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) is on Shopify confirmation.
* The existing orders read is mocked with <orders condition>.

**Test data:**

| <orders condition> | Expected surface | Existing action |
| --- | --- | --- |
| Loading | Loading state | None while loading |
| Failed read | Error state | Retry reads orders again |
| Empty list | Empty state | Shop now opens the store |
| Other purchases, none matching | Existing order list | Existing order actions |

**Steps:**

1. Click Grade10 Your Orders on Shopify.
2. Read the orders surface.
3. Use the existing action when Test data names one.

**Expected Results:**

* The existing surface matches the returned read condition.
* Its existing action works as Test data states.
* No matching purchase or return-specific recovery is invented.

## grade10-site-store-checkout-US4: Signed-out collector is asked to sign in

**As a** collector who is not signed in,
**I want** checkout to explain the identity requirement,
**so that** I can sign in before an order or payment is started.

### grade10-site-store-checkout-US4-TC1-2: The public cart drawer requires a member session

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* customer is signed out on <grade10 store url>.

**Steps:**

1. Open the cart drawer or its sign-in action.
2. Read the sign-in surface.

**Expected Results:**

* The frontend explains the signed-in requirement.
* The existing sign-in action is offered.
* No guest basket or public typed-email checkout is offered.
* The frontend sends no checkout creation request.

### grade10-site-store-checkout-US4-TC2-2: An expired session shows the existing sign-in outcome

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* customer(member) is on <grade10 store url>.
* The current basket review and accepted tender are ready.
* Checkout creation is mocked to reject an expired member session.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the existing sign-in feedback.

**Expected Results:**

* The frontend presents the existing sign-in outcome.
* No hosted payment destination opens.
* The request no longer leaves checkout marked pending.

### grade10-site-store-checkout-US4-TC3-1: Typed email remains restricted to elevated operator tests

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US4-TC4-1: An authorized sandbox operator retains typed-email checkout

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US4-TC5-1: Production refuses typed-email checkout before identity lookup

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

**Deprecated:** Superseded scope; this frontend integration adds no backend, provider, carrier, permission or recovery behavior.

### grade10-site-store-checkout-US4-TC6-1: Late responses cannot redirect a different member

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
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-04

**Pre-conditions:**

* customer A(member) is on <grade10 store url>.
* The current basket and accepted tender are ready.
* Customer A's creation response is mocked to remain pending.

**Test data:**

| <session change> | Current collector |
| --- | --- |
| Sign out | Signed-out customer |
| Switch to customer B | Customer B(member), separate basket |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Make <session change> before the response arrives.
4. Release customer A's hosted URL response.
5. Read the current surface and browser destination.

**Expected Results:**

* Customer A's late response does not redirect the current collector.
* It does not show customer A's order or checkout outcome.
* The current collector keeps their existing session surface.

## Settled

- Frontend only; backend behavior is unchanged.
- Each new Pay uses existing creation; older invoices are ignored.
- The invoice fixes the purchase; existing paid cart cleanup is unchanged.
- No matching purchase uses the existing orders states and actions.

## Reconciliation

- **Run** - Fresh QA2 after frontend-only QA1 and Dev completed independently. QA1 read the frozen bundle `/tmp/grade10-checkout-frontend.QNPBSW`: anchors, proposal, decisions, journeys, UI design, checkout/cart PRDs, context, existing cases without reconciliation and domain cases. Requirements, technical design, application source, acceptance and archive material were denied to QA1. QA2 read both reports, final requirements, technical design, tasks and Q18's existing orders-surface clarification. Dev's final strict validator passed before reconciliation.
- **Anchors** - All 4 journeys and 4 feature roots are covered. The domain suite asserts no checkout handoff or return outcome; no case is delegated to it and no domain amendment is needed.
- **Scope** - Q15–Q17 replace invoice reuse/recovery with fresh frontend creation and fixed invoices. Backend, permissions, settlement and carrier behavior are unchanged dependencies. No backend test, engineering task or execution claim is added.
- **Raised** - QA1's absent matching purchase question lands in Q18. US3 TC11 folds the existing list/loading/error Retry/empty Shop now treatment. Purchase discovery, recovery and a new missing-order message are rejected under Q17–Q18. The answer is retained in Settled without scenario ids.
- **Added** - QA2 adds frontend boundaries missing from the blind set: pending writes, failed tender retention, settling creation, contradictory/failed quotes, lost/undecodable responses, existing absent-purchase states and late responses after member change. All remain draft/manual. Existing US2 TC2 now explicitly checks availability and retry; this clarifies its existing failed-read run.
- **Follow-up** - QA2 re-read the review findings against the shipped drawer checkout and acceptance fold. The feature-set removal directive retires the withdrawn recovery group, and Q19 records reuse of the existing verification feedback because the shared drawer has no verification slot. Anchors are unchanged; draft cases remain draft.

### Active Cases

Each row folds a blind case or an added frontend case into the accepted anchors. Scenario identifiers here are temporary reconciliation links only.

| Case | Disposition | Requirement Coverage |
| --- | --- | --- |
| `grade10-site-store-checkout-US1-TC1-2` | Folded: reviewed basket, accepted tender and hosted handoff | SC-01, SC-02, SC-05 |
| `grade10-site-store-checkout-US1-TC2-1` | Folded: estimate and Shopify final charges | SC-02 |
| `grade10-site-store-checkout-US1-TC5-2` | Folded: changed basket/tender use fresh creation | SC-33, SC-35 |
| `grade10-site-store-checkout-US1-TC12-2` | Folded: below-limit gate boundary | SC-01, SC-37 |
| `grade10-site-store-checkout-US1-TC13-2` | Folded: gross boundary despite accepted points | SC-37 |
| `grade10-site-store-checkout-US1-TC14-2` | Folded: verified boundary | SC-01, SC-37 |
| `grade10-site-store-checkout-US1-TC22-1` | Folded: current request guard | SC-34 |
| `grade10-site-store-checkout-US1-TC23-1` | Folded: same basket can create another invoice | SC-33 |
| `grade10-site-store-checkout-US1-TC24-1` | Folded: reload uses current creation | SC-33 |
| `grade10-site-store-checkout-US1-TC25-1` | Folded: existing empty drawer prevents checkout | Current basket and tender; SC-01 ready-basket condition |
| `grade10-site-store-checkout-US1-TC26-1` | Folded: existing verification feedback and account action | SC-37; existing verification outcome |
| `grade10-site-store-checkout-US1-TC27-1` | Added: cart/tender writes block stale Pay | Review requirement; SC-01, SC-02 |
| `grade10-site-store-checkout-US1-TC28-1` | Added: failed edit can retain ready accepted tender | Review requirement; SC-02 |
| `grade10-site-store-checkout-US1-TC29-1` | Added: existing settling response navigation | Handoff Outcomes; SC-12 |
| `grade10-site-store-checkout-US2-TC1-2` | Folded: changed-line review prevents handoff | SC-03 |
| `grade10-site-store-checkout-US2-TC2-2` | Folded: failed review keeps facts unchecked and offers retry | SC-04 |
| `grade10-site-store-checkout-US2-TC4-2` | Folded: named refusal, refresh and repair | SC-07, SC-03 |
| `grade10-site-store-checkout-US2-TC6-2` | Folded: pending review blocks Pay | Review requirement; SC-01 |
| `grade10-site-store-checkout-US2-TC8-1` | Folded: resolved failure restores ready retry | Handoff Outcomes; SC-38 failure treatment |
| `grade10-site-store-checkout-US2-TC9-1` | Added: contradictory review/quote and failed quote | Review requirement; SC-03, SC-04 |
| `grade10-site-store-checkout-US2-TC10-1` | Added: transport/decode failures promise no recovery | SC-38 |
| `grade10-site-store-checkout-US3-TC1-2` | Folded: returned pending purchase and unchanged cart | SC-12 |
| `grade10-site-store-checkout-US3-TC2-2` | Folded: observed pending-to-paid read refreshes cart/tender | SC-12, SC-13 |
| `grade10-site-store-checkout-US3-TC4-1` | Folded: both static confirmation links | SC-15 |
| `grade10-site-store-checkout-US3-TC10-1` | Folded: fixed invoice and returned whole-line cleanup | SC-35, SC-36 |
| `grade10-site-store-checkout-US3-TC11-1` | Added: Q18 uses existing orders states/actions | Return requirement; Q18 |
| `grade10-site-store-checkout-US4-TC1-2` | Folded: signed-out frontend sends no creation | SC-06 |
| `grade10-site-store-checkout-US4-TC2-2` | Folded: expired session uses existing sign-in outcome | SC-06; Handoff Outcomes |
| `grade10-site-store-checkout-US4-TC6-1` | Added: originating session prevents stale UI effects | Member checkout anchor; technical design Service Interfaces |

### Scenarios

| Scenario | Case Coverage |
| --- | --- |
| SC-01 | US1 TC1, TC12, TC14, TC25, TC27; US2 TC6 |
| SC-02 | US1 TC1, TC2, TC27, TC28 |
| SC-03 | US2 TC1, TC4, TC9 |
| SC-04 | US2 TC2, TC9 |
| SC-05 | US1 TC1 |
| SC-06 | US4 TC1, TC2 |
| SC-07 | US2 TC4 |
| SC-12 | US1 TC29; US3 TC1, TC2 |
| SC-13 | US3 TC2 |
| SC-15 | US3 TC4 |
| SC-33 | US1 TC5, TC23, TC24 |
| SC-34 | US1 TC22 |
| SC-35 | US1 TC5; US3 TC10 |
| SC-36 | US3 TC10 |
| SC-37 | US1 TC12, TC13, TC14, TC26 |
| SC-38 | US2 TC8, TC10 |

- **Out of suite** - Unchanged carrier SC-17 and SC-18 are verified by the existing carrier cases in the current durable `openspec/specs/grade10-site/store/checkout/feature-tcs.md` and the application's existing carrier/shipping lane. This frontend change adds no carrier tests or tasks. Their durable requirement is preserved.
- **Out of suite** - Exhaustive compatibility mapping for settled, terminal, intent-conflict and recovery-required vocabulary is verified in the application repository's existing `packages/grade10-store/frontend/src/features/orders/checkout/domain/models/CheckoutResolution.test.ts` and the focused fixture gate in tasks 4.8/4.11. This is frontend mapping only; it does not require backend emission or recovery.
- **Retired scenarios** - SC-08, SC-14 and SC-16 retire through explicit replacement of their broader requirements. SC-09, SC-10, SC-11, SC-19, SC-20 and SC-21 retire with intent repetition. Earlier draft SC-22–SC-32 retire with backend/recovery scope. No retired id is reused or treated as uncovered active work.
- **Tasks** - Groups 2 and 3 contain no active checkbox. Retired addresses in groups 2–5 remain non-checkbox history and are not falsely completed. Active groups contain frontend tests, implementation, focused verification and later authorized staging/manual walks.

### Deprecated Cases

All 27 retain their original issued number, revision and historical behavior. Their disposition rejects the former delivery obligation under Q17; it does not claim the unchanged backend stops working.

| Case | Scope Reason |
| --- | --- |
| `grade10-site-store-checkout-US1-TC3-1` | Backend intent reuse withdrawn |
| `grade10-site-store-checkout-US1-TC4-1` | Backend/provider response recovery withdrawn |
| `grade10-site-store-checkout-US1-TC6-1` | Existing carrier dependency, no frontend delivery |
| `grade10-site-store-checkout-US1-TC7-1` | Existing carrier refusal dependency, no frontend delivery |
| `grade10-site-store-checkout-US1-TC8-1` | Backend terminal replay withdrawn |
| `grade10-site-store-checkout-US1-TC9-1` | Backend pre-dispatch recovery withdrawn |
| `grade10-site-store-checkout-US1-TC10-1` | Backend ambiguous-dispatch recovery withdrawn |
| `grade10-site-store-checkout-US1-TC11-1` | Intent persistence/reload reuse withdrawn |
| `grade10-site-store-checkout-US1-TC15-1` | Existing carrier token gate unchanged, no frontend delivery |
| `grade10-site-store-checkout-US1-TC16-1` | Existing provider persistence unchanged, no backend delivery |
| `grade10-site-store-checkout-US1-TC17-1` | Backend intent fingerprint conflict withdrawn |
| `grade10-site-store-checkout-US1-TC18-1` | Backend terminal replay despite changed facts withdrawn |
| `grade10-site-store-checkout-US1-TC19-1` | Backend refusal/deduplication guarantee withdrawn |
| `grade10-site-store-checkout-US1-TC20-1` | Backend unresolved-dispatch blockade withdrawn |
| `grade10-site-store-checkout-US1-TC21-1` | Backend gross-goods enforcement unchanged; frontend covered by US1 TC13 |
| `grade10-site-store-checkout-US2-TC3-1` | Shopify/provider hosted-payment refusal unchanged, no frontend implementation |
| `grade10-site-store-checkout-US2-TC5-1` | Backend validation/creation guarantee unchanged, not frontend work |
| `grade10-site-store-checkout-US2-TC7-1` | Backend uncertain invoice cancellation withdrawn |
| `grade10-site-store-checkout-US3-TC3-1` | Existing reconciliation unchanged, no backend delivery |
| `grade10-site-store-checkout-US3-TC5-1` | Existing event validation unchanged, no backend delivery |
| `grade10-site-store-checkout-US3-TC6-1` | Existing order-read repair unchanged, no backend delivery |
| `grade10-site-store-checkout-US3-TC7-1` | Existing settlement idempotency unchanged, no backend delivery |
| `grade10-site-store-checkout-US3-TC8-1` | Existing backend ownership unchanged, no permission migration |
| `grade10-site-store-checkout-US3-TC9-1` | Existing list/detail repair behavior unchanged |
| `grade10-site-store-checkout-US4-TC3-1` | Existing backend typed-email permission unchanged |
| `grade10-site-store-checkout-US4-TC4-1` | Existing operator sandbox authorization unchanged |
| `grade10-site-store-checkout-US4-TC5-1` | Existing operator production gate unchanged |

### Manual

No case is credited to an executed test. Fixture walks are to be walked in the application's mounted Playwright checkout integration under tasks 4.1/4.8/4.11; real-shop walks require the separately authorized staging work in group 5.

| Manual | Why |
| --- | --- |
| `grade10-site-store-checkout-US1-TC1-2` | Hosted invoice basket/tender and address/payment are to be walked in the authorized staging checkout |
| `grade10-site-store-checkout-US1-TC2-1` | Estimate and Shopify address-aware totals are to be walked in authorized staging |
| `grade10-site-store-checkout-US1-TC5-2` | Current edited basket and ignored invoice are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC12-2` | Below-limit action is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC13-2` | Gross-limit verification and account action are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC14-2` | Verified-limit action is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC22-1` | Pending control is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC23-1` | Fresh unchanged-basket creation is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC24-1` | Reload without intent reuse is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC25-1` | Empty drawer action is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC26-1` | Existing verification feedback and account action are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC27-1` | Pending write guards are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC28-1` | Failed edit with retained tender is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US1-TC29-1` | Settling navigation is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US2-TC1-2` | Changed-line control is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US2-TC2-2` | Failed read and retry are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US2-TC4-2` | Named refusal and repair are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US2-TC6-2` | Pending review is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US2-TC8-1` | Resolved failure retry is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US2-TC9-1` | Invalid review/quote gating is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US2-TC10-1` | Transport/decode failure copy and retry are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US3-TC1-2` | Pending purchase/cart visibility is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US3-TC2-2` | Observed paid refresh is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US3-TC4-1` | Actual Thank You/Order status extension placement is to be walked in authorized staging |
| `grade10-site-store-checkout-US3-TC10-1` | Fixed purchase and returned cleanup are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US3-TC11-1` | Existing orders states/actions are to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US4-TC1-2` | Signed-out surface is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US4-TC2-2` | Expired session feedback is to be walked in the mounted fixture integration |
| `grade10-site-store-checkout-US4-TC6-1` | Late response across member changes is to be walked in the mounted fixture integration |
