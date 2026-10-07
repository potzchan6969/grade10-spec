# grade10-site/store/checkout Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-07, tcs-rules r4

**Out of suite:** grade10-site-store-checkout-SC-07, grade10-site-store-checkout-SC-08, grade10-site-store-checkout-SC-44

## grade10-site-store-checkout-US5: Collector resumes one purchase safely

**As a** signed-in collector who repeats Pay, reloads or loses an answer,
**I want** the store to return my existing invoice or purchase state,
**so that** I do not accidentally create or pay for a second purchase.

<!-- trace:case id=g10.store-checkout.TC-x86 rev=1 covers=g10.store-checkout.SC-5x2 -->
### grade10-site-store-checkout-US5-TC1-1: Pending Pay disables another submission on the same surface

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The drawer has current lines and accepted tender.
* The payment answer is delayed.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Click the checkout control again before the answer.
4. Release the hosted-invoice answer.

**Expected Results:**

* Pay shows loading until the answer arrives.
* The surface sends one submission.
* The supplied hosted invoice opens.

<!-- trace:case id=g10.store-checkout.TC-a8o rev=1 covers=g10.store-checkout.SC-i09,g10.store-checkout.SC-dwk -->
### grade10-site-store-checkout-US5-TC2-1: Repeated Pay resumes the saved invoice after current review

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* An unpaid invoice exists for the unchanged purchase.
* The current basket and tender still pass review.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the opened invoice.
4. Read the member's orders.

**Expected Results:**

* Pay makes a fresh payment decision.
* The saved invoice opens for the same purchase.
* Exactly one matching order and payable invoice exist.

<!-- trace:case id=g10.store-checkout.TC-fnc rev=1 covers=g10.store-checkout.SC-dwk -->
### grade10-site-store-checkout-US5-TC3-1: Same-session reload retains the existing purchase

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* An unpaid invoice exists for the unchanged purchase.

**Steps:**

1. Reload the Grade10 page.
2. Open the cart drawer.
3. Wait for the current review.
4. Click Proceed to Checkout.
5. Read the opened invoice.

**Expected Results:**

* Reload restores the current cart and accepted tender.
* Pay returns the existing invoice or truthful lifecycle.
* No second order or payable invoice is created.

<!-- trace:case id=g10.store-checkout.TC-03q rev=1 covers=g10.store-checkout.SC-8hm -->
### grade10-site-store-checkout-US5-TC4-1: A lost payment answer recovers the existing purchase

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The store created the purchase before its answer was lost.
* The unchanged cart and tender remain available.

**Test data:**

| Field | Value |
| --- | --- |
| lost answer | Transport drops the completed payment answer |
| lost answer | The completed payment answer cannot be decoded |

**Steps:**

1. Open the cart drawer.
2. Read the failure feedback.
3. Click Proceed to Checkout when current facts are ready.
4. Read the returned purchase.

**Expected Results:**

* Failure feedback does not claim no invoice exists.
* The existing purchase is recovered or remains visibly settling.
* No second order or payable invoice is created.

<!-- trace:case id=g10.store-checkout.TC-9sb rev=1 covers=g10.store-checkout.SC-v95 -->
### grade10-site-store-checkout-US5-TC5-1: Settling answers show and poll the known purchase

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The payment decision returns the known purchase as settling.
* Order reads keep that purchase pending before returning paid.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the opened order.
4. Wait for its paid read.

**Expected Results:**

* The known pending purchase remains visible.
* Existing order labels describe the returned state.
* Pending order reads continue until payment is observed.
* Paid observation refreshes authoritative cart and tender.

<!-- trace:case id=g10.store-checkout.TC-cvz rev=1 covers=g10.store-checkout.SC-s19,g10.store-checkout.SC-v95 -->
### grade10-site-store-checkout-US5-TC6-1: Terminal replay retains the existing purchase outcome

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
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The same purchase has `<terminal outcome>`.
* The terminal order is returned by the payment decision.
* The test harness retains the submitted intent key and immutable acknowledged context, including when payment already converted the cart.

**Test data:**

| terminal outcome |
| --- |
| Paid |
| Refunded |
| Failed |
| Canceled |
| Expired |

**Steps:**

1. Replay the saved purchase through the signed-in checkout API harness using its original key and acknowledged context.
2. Deliver that authoritative answer through the mounted checkout result handler; use the harness when an empty converted cart has no Pay control.
3. Read the existing order.
4. Observe subsequent order reads.

**Expected Results:**

* The existing order shows its truthful terminal outcome.
* No new payable invoice or replacement order is created.
* Terminal orders are not polled as open purchases.

<!-- trace:case id=g10.store-checkout.TC-zhh rev=1 covers=g10.store-checkout.SC-g88 -->
### grade10-site-store-checkout-US5-TC7-1: Concurrent tabs converge on one purchase and invoice

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) has the same current cart in two tabs.
* Both tabs hold the unchanged basket and accepted tender.
* The tabs submit distinct opaque browser keys for the same member cart id, version and accepted tender.
* Payment answers are delayed until both submissions arrive.

**Steps:**

1. Click Proceed to Checkout in the first tab.
2. Click Proceed to Checkout in the second tab.
3. Release both payment answers.
4. Read the returned purchases and invoice count.

**Expected Results:**

* Both answers identify the same purchase.
* Each returns the saved invoice or truthful settling state.
* Exactly one payable invoice exists.

<!-- trace:case id=g10.store-checkout.TC-q5v rev=1 covers=g10.store-checkout.SC-t20 -->
### grade10-site-store-checkout-US5-TC8-1: Interruption before payment dispatch permits safe recovery

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) has one prepared purchase.
* The checkout service stops before any invoice request is sent.

**Steps:**

1. Retry Pay for the unchanged purchase.
2. Read the API response.
3. Read the order and invoice records.

**Expected Results:**

* Recovery returns the same purchase.
* Only one order and payable invoice are created.

<!-- trace:case id=g10.store-checkout.TC-8c2 rev=1 covers=g10.store-checkout.SC-u21,g10.store-checkout.SC-v95 -->
### grade10-site-store-checkout-US5-TC9-1: Ambiguous dispatch blocks another invoice until recovery

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* Payment dispatch may have created an invoice.
* Recovery cannot determine whether that invoice exists.
* The backend returns recovery-required for the known purchase.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the recovery feedback.
4. Open the known order through the offered action.
5. Try Pay again.

**Expected Results:**

* Existing failure/support feedback names the unresolved purchase.
* The known purchase remains visible and recoverable.
* Repeated Pay cannot dispatch another payable invoice.

<!-- trace:case id=g10.store-checkout.TC-gtu rev=1 covers=g10.store-checkout.SC-j10 -->
### grade10-site-store-checkout-US5-TC10-1: Response loss at Shopify recovers one existing invoice

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) owns a purchase.
* Shopify creates its invoice but the store loses Shopify's answer.

**Steps:**

1. Retry Pay for the unchanged purchase.
2. Read the API response.
3. Read the order and invoice records.

**Expected Results:**

* The existing purchase is recovered or remains settling.
* The existing invoice is retained.
* No replacement order or payable invoice is created.

<!-- trace:case id=g10.store-checkout.TC-nxk rev=1 covers=g10.store-checkout.SC-5ie -->
### grade10-site-store-checkout-US5-TC11-1: Conflict refreshes current intent without automatic payment

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
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* A concurrent tab changed the active basket or tender.
* The payment decision returns conflict for the stale purchase.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the refreshed basket and tender.
4. Observe the browser destination.

**Expected Results:**

* Current basket and tender replace stale facts.
* Conflict does not redirect to the older hosted invoice.
* No automatic replacement Pay or invoice creation starts.

---

<!-- trace:case id=g10.store-checkout.TC-tdy rev=1 covers=g10.store-checkout.SC-0al -->
### grade10-site-store-checkout-US5-TC12-1: Missing compatible checkout protocol prevents unsafe fallback

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression, release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-05

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The checkout context or payment answer is mocked with `<protocol condition>`.

**Test data:**

| protocol condition | Expected treatment |
| --- | --- |
| Required checkout context procedure is unavailable | Existing localized failure/support feedback |
| Checkout context returns malformed purchase context | Existing localized failure/support feedback |
| Required Pay protocol is unavailable after current context read | Existing localized failure/support feedback |

**Steps:**

1. Open the cart drawer.
2. Wait for the checkout context read.
3. Activate Proceed to Checkout if the current context permits the action.
4. Read the drawer feedback and checkout request log.

**Expected Results:**

* Existing localized failure/support feedback appears for the incompatible protocol.
* No hosted payment URL opens.
* No legacy checkout creation request is sent as fallback.
* No new order or payable invoice is created by the incompatible request.

## grade10-site-store-checkout-US6: Collector keeps the cart built after Pay

**As a** signed-in collector who changes the cart or tender after starting payment,
**I want** the older invoice retired and my later cart preserved when payment settles,
**so that** a delayed purchase cannot remove my later choices.

<!-- trace:case id=g10.store-checkout.TC-ec6 rev=1 covers=g10.store-checkout.SC-k11,g10.store-checkout.SC-o8s,g10.store-checkout.SC-2jt -->
### grade10-site-store-checkout-US6-TC1-1: Persisted edits retire the older unpaid invoice

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-06

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* An unpaid invoice fixes the earlier basket and tender.
* The current drawer holds that basket and accepted tender.

**Test data:**

| cart edit |
| --- |
| Increase variant A from quantity 1 to 2 |
| Add available variant B to variant A |
| Remove variant B from a two-line basket |
| Replace the accepted code with another fitting code |
| Change accepted points from 10 to 20, both valid |

**Steps:**

1. Open the cart drawer.
2. Make `<cart edit>`.
3. Wait for the accepted write and current review.
4. Click Proceed to Checkout.
5. Read the new invoice.
6. Read the older order.

**Expected Results:**

* Pay uses the persisted changed basket and accepted tender.
* The new invoice fixes the changed purchase.
* Retirement prevents two payable invoices.
* Only backend order facts show the older order canceled.

<!-- trace:case id=g10.store-checkout.TC-0a2 rev=1 covers=g10.store-checkout.SC-o8s -->
### grade10-site-store-checkout-US6-TC2-1: Retirement uncertainty preserves edits and truthful order state

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
* **Trace:** grade10-site-store-checkout-US-06

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* An older invoice is unpaid.
* The next cart edit commits but invoice retirement remains unresolved.

**Steps:**

1. Open the cart drawer.
2. Increase an available line from quantity 1 to 2.
3. Wait for the accepted cart write.
4. Open the older order.
5. Try Pay for the edited cart.

**Expected Results:**

* The committed quantity change remains in the active cart.
* Edit success alone does not label the older order canceled.
* Open order reads continue while retirement remains unresolved.
* No replacement payable invoice starts before safe backend permission.

<!-- trace:case id=g10.store-checkout.TC-cde rev=1 covers=g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US6-TC3-1: Late basket or tender answers cannot redirect edited intent

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
* **Trace:** grade10-site-store-checkout-US-06

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The hosted-invoice answer for the submitted purchase is delayed.

**Test data:**

| later edit |
| --- |
| Increase variant A from quantity 1 to 2 |
| Change accepted points from 10 to 20, both valid |
| Replace the accepted code with another fitting code |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Make `<later edit>` before the answer arrives.
4. Release the earlier hosted-invoice answer.
5. Read the current drawer and browser destination.

**Expected Results:**

* The earlier answer cannot open its stale invoice.
* Current drawer facts reflect the later committed choices.
* The later cart and tender remain intact.

<!-- trace:case id=g10.store-checkout.TC-suh rev=1 covers=g10.store-checkout.SC-2n2,g10.store-checkout.SC-xu2 -->
### grade10-site-store-checkout-US6-TC4-1: Payment of an older version preserves later cart choices

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
* **Testability:** automation
* **Trace:** grade10-site-store-checkout-US-06

**Pre-conditions:**

* customer(member) is on `<grade10 orders url>`.
* The invoice fixes variant A, quantity 1, and its original tender.
* The active cart now holds `<later cart>` with `<later tender>`.
* Payment wins the race with retirement of the older invoice.

**Test data:**

| later cart | later tender |
| --- | --- |
| Variant A, quantity 2, with added variant B | Different fitting code and accepted points |
| Rebuilt cart containing variant A, quantity 1 | Different fitting code and accepted points |
| Same variant A, quantity 1, with changed tender | Different fitting code and accepted points |

**Steps:**

1. Open the older purchase detail.
2. Wait for its paid read.
3. Read the purchased lines.
4. Open the cart drawer.
5. Read its current lines and tender.

**Expected Results:**

* The paid order retains the original purchase and tender.
* Authoritative reads show `<later cart>` and `<later tender>`.
* No later line is deleted or quantity subtracted.
* Later tender choices are preserved.

<!-- trace:case id=g10.store-checkout.TC-uni rev=1 covers=g10.store-checkout.SC-15p -->
### grade10-site-store-checkout-US6-TC5-1: Invoice facts remain fixed while later edits persist

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
* **Trace:** grade10-site-store-checkout-US-06

**Pre-conditions:**

* customer(member) is on an unpaid hosted invoice.
* A separate Grade10 tab holds the same member cart.

**Steps:**

1. Increase variant A from quantity 1 to 2 in Grade10.
2. Change accepted points from 10 to 20 in Grade10.
3. Read the original hosted invoice.
4. Reload the Grade10 tab.
5. Read the cart drawer.

**Expected Results:**

* The original invoice retains its submitted lines and tender.
* Reload shows later persisted cart and tender choices.

---

## grade10-site-store-checkout-US1: Collector sends a current cart to hosted payment

**As a** signed-in collector,
**I want** to review my current cart and send its accepted tender to Shopify,
**so that** I pay for the lines and choices I just saw.

<!-- trace:case id=g10.store-checkout.TC-uke rev=2 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-e05 -->
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

* customer(member) is on `<grade10 store url>`.
* The cart holds `<reviewed basket>` and `<accepted tender>`.

**Test data:**

| Field | Value |
| --- | --- |
| reviewed basket | Two available variants, quantities 1 and 2; representative positive quantities |
| accepted tender | One accepted store code and accepted points choice |

**Steps:**

1. Open the cart drawer.
2. Read the reviewed lines and accepted tender.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice.

**Expected Results:**

* The drawer shows current quantities, prices and accepted tender.
* Pay checks current facts separately from the opening review.
* The bound order carries `<reviewed basket>` and `<accepted tender>`.
* The returned hosted URL opens directly from the drawer.
* The invoice shows the reviewed basket and accepted tender.
* Shopify collects the shipping address and payment.

<!-- trace:case id=g10.store-checkout.TC-m23 rev=1 covers=g10.store-checkout.SC-b02 -->
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

* customer(member) is on `<grade10 store url>`.
* The cart holds available goods and accepted tender.

**Steps:**

1. Open the cart drawer.
2. Read the estimated total.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice totals.

**Expected Results:**

* The drawer labels the total as an estimate.
* The estimate excludes final shipping and tax.
* The estimate is goods minus code minus accepted points.
* Shopify calculates final shipping, tax and payable amount.

<!-- trace:case id=g10.store-checkout.TC-jze rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-1yv rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-gwn rev=2 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC5-2: Edited basket and tender reach a fresh submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Q15/Q16 supersede ignoring older invoices after edits.

**Replaced by:** `grade10-site-store-checkout-US6-TC1-1`.

<!-- trace:case id=g10.store-checkout.TC-kd3 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-7s9 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-13i rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-3dr rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-jje rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-s9e rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-t16 rev=2 covers=g10.store-checkout.SC-ecp -->
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

* customer(member, unverified buyer) is on `<grade10 store url>`.
* The cart holds available goods worth `<gross goods>`.

**Test data:**

| Field | Value |
| --- | --- |
| gross goods | HKD 119,999.99, one minor unit below HKD 120,000 |

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice.

**Expected Results:**

* The account-verification gate does not replace checkout.
* The returned hosted URL opens.

<!-- trace:case id=g10.store-checkout.TC-vil rev=2 covers=g10.store-checkout.SC-vsd,g10.store-checkout.SC-ecp -->
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

* customer(member, unverified buyer) is on `<grade10 store url>`.
* The cart holds `<gross goods>`, with `<accepted tender>`.

**Test data:**

| gross goods | `<accepted tender>` | Expected checkout |
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

<!-- trace:case id=g10.store-checkout.TC-0je rev=2 covers=g10.store-checkout.SC-ecp -->
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

* customer(member, verified buyer) is on `<grade10 store url>`.
* The cart holds available goods worth `<gross goods>`.

**Test data:**

| gross goods | Expected checkout |
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

<!-- trace:case id=g10.store-checkout.TC-doe rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-vk1 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-3ft rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-sp5 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-1bl rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-81s rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-qog rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-2p2 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC22-1: A pending request prevents another frontend submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** The pending-control run belongs to the new safe-resumption journey.

**Replaced by:** `grade10-site-store-checkout-US5-TC1-1`.

<!-- trace:case id=g10.store-checkout.TC-w15 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC23-1: A later Pay creates a fresh submission

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Q6 supersedes creating another invoice for unchanged Pay.

**Replaced by:** `grade10-site-store-checkout-US5-TC2-1`.

<!-- trace:case id=g10.store-checkout.TC-mnx rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC24-1: Reload does not require an earlier invoice to close

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Q11 requires purchase reuse after same-session reload.

**Replaced by:** `grade10-site-store-checkout-US5-TC3-1`.

<!-- trace:case id=g10.store-checkout.TC-urs rev=1 covers=g10.store-checkout.SC-xy2 -->
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

* customer(member) is on `<grade10 store url>`.
* The current cart review returns no lines.

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Read the empty drawer.

**Expected Results:**

* The existing empty state is displayed.
* No checkout action starts an empty purchase.
* The frontend sends no checkout creation request.

<!-- trace:case id=g10.store-checkout.TC-5g0 rev=1 covers=g10.store-checkout.SC-vsd -->
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

* customer(member) is on `<grade10 store url>`.
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

<!-- trace:case id=g10.store-checkout.TC-zrz rev=1 covers=g10.store-checkout.SC-14a -->
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

* customer(member) is on `<grade10 store url>`.
* The drawer shows an available basket and accepted tender.
* The next `<write>` is mocked to remain pending.

**Test data:**

| write | Drawer action |
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

<!-- trace:case id=g10.store-checkout.TC-8yn rev=1 covers=g10.store-checkout.SC-t83 -->
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

* customer(member) is on `<grade10 store url>`.
* The drawer holds accepted points of 10.
* Changing points to 20 is mocked to fail.
* The current quote for the retained choice becomes ready.

**Test data:**

| Field | Value |
| --- | --- |
| requested points | 20, different from the accepted 10; both valid choices in the fixture |

**Steps:**

1. Open the cart drawer.
2. Enter `<requested points>` in the points control.
3. Wait for the failed change and current quote.
4. Read the accepted tender.
5. Click Proceed to Checkout in the drawer.

**Expected Results:**

* Existing failure feedback appears.
* The retained accepted points choice remains 10.
* Pay uses the retained choice with its ready quote.

<!-- trace:case id=g10.store-checkout.TC-pa7 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-dwk,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
### grade10-site-store-checkout-US1-TC29-1: A settling response opens the existing order surface

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
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

**Deprecated:** The settling response belongs to the new safe-resumption journey.

**Replaced by:** `grade10-site-store-checkout-US5-TC5-1`.

<!-- trace:case id=g10.store-checkout.TC-09q rev=1 covers=g10.store-checkout.SC-q17 -->
### grade10-site-store-checkout-US1-TC30-1: Served destinations match carrier and store preview rates

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

* customer(member) has a current basket.
* The carrier rule serves `<served destination>`.
* The carrier request supplies the configured valid token.

**Test data:**

| Field | Value |
| --- | --- |
| served destination | A destination served by the configured carrier rule |
| configured rate | Exact rate and currency configured for that destination |

**Steps:**

1. Read the store shipping preview for `<served destination>`.
2. Request carrier rates for the same basket and destination.
3. Read the API responses.
4. Read the member cart and orders.

**Expected Results:**

* Preview and carrier answer have identical rate and currency.
* Both use the configured destination rate.
* The request changes no cart and creates no order.

<!-- trace:case id=g10.store-checkout.TC-d1x rev=1 covers=g10.store-checkout.SC-r18 -->
### grade10-site-store-checkout-US1-TC31-1: Unsupported destinations receive no usable carrier rate

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

* customer(member) has a current basket.
* The carrier request has the configured valid token.

**Test data:**

| Field | Value |
| --- | --- |
| unsupported destination | A destination outside configured served destinations |

**Steps:**

1. Request carrier rates for `<unsupported destination>`.
2. Read the API response.
3. Read the member cart and orders.

**Expected Results:**

* No usable rate is offered for the unsupported destination.
* The request changes no cart and creates no order.

<!-- trace:case id=g10.store-checkout.TC-6tn rev=1 covers=g10.store-checkout.SC-cbs -->
### grade10-site-store-checkout-US1-TC32-1: Carrier token refusal has no purchase side effects

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
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) has a current basket.
* The carrier rule serves `<served destination>`.
* The carrier request has `<token condition>`.

**Test data:**

| token condition | served destination |
| --- | --- |
| Missing token | A configured served destination |
| Token different from configured token | The same configured served destination |

**Steps:**

1. Request rates for `<served destination>`.
2. Read the API response.
3. Read the member cart and orders.

**Expected Results:**

* The token gate returns no usable rate.
* The request changes no cart and creates no order.

<!-- trace:case id=g10.store-checkout.TC-7tm rev=1 covers=g10.store-checkout.SC-e05 -->
### grade10-site-store-checkout-US1-TC33-1: Hosted handoff follows saved order and provider facts

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

* customer(member) has a current basket and accepted tender.

**Steps:**

1. Submit Pay for the reviewed purchase.
2. Read the API response.
3. Read the owned order response.

**Expected Results:**

* The hosted answer identifies the saved purchase.
* The order is bound to that same invoice.
* Owned order facts retain submitted lines and accepted tender.

<!-- trace:case id=g10.store-checkout.TC-q6z rev=1 covers=g10.store-checkout.SC-ecp -->
### grade10-site-store-checkout-US1-TC34-1: Gross goods gate protects direct Pay at the limit

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

* customer(member, unverified buyer) has available gross goods of HKD 120,000.
* Accepted code and points reduce the estimate below HKD 120,000.

**Steps:**

1. Submit Pay for the reviewed purchase.
2. Read the API response.
3. Read the order and invoice records.

**Expected Results:**

* The response requires account verification.
* No order or hosted invoice is created.

---

## grade10-site-store-checkout-US2: Collector repairs a changed cart line

**As a** collector whose cart changes before the payment decision,
**I want** the changed line named before I pay,
**so that** I fix the basket instead of paying for stale goods.

<!-- trace:case id=g10.store-checkout.TC-q0v rev=2 covers=g10.store-checkout.SC-c03 -->
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

* customer(member) is on `<grade10 store url>`.
* The cart review is mocked to identify `<changed line>`.

**Test data:**

| Field | Value |
| --- | --- |
| changed line | A cart variant reported unavailable by current review |
| changed line | A cart variant repriced by current review |
| changed line | A cart variant reduced by current review |

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Read the named-line feedback.
4. Try the drawer checkout action.

**Expected Results:**

* The feedback names the changed line.
* Checkout remains unavailable until the basket is ready.
* The frontend sends no checkout creation request.

<!-- trace:case id=g10.store-checkout.TC-uuk rev=2 covers=g10.store-checkout.SC-d04 -->
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

* customer(member) is on `<grade10 store url>`.
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

<!-- trace:case id=g10.store-checkout.TC-njp rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-g07,g10.store-checkout.SC-8hm -->
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

<!-- trace:case id=g10.store-checkout.TC-zm4 rev=2 covers=g10.store-checkout.SC-c03 -->
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

* customer(member) is on `<grade10 store url>`.
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
* The later Pay checks the repaired basket before handoff.

<!-- trace:case id=g10.store-checkout.TC-dny rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-g07,g10.store-checkout.SC-8hm -->
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

<!-- trace:case id=g10.store-checkout.TC-u81 rev=2 covers=g10.store-checkout.SC-5tt -->
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

* customer(member) is on `<grade10 store url>`.
* The current cart review is mocked to remain pending.

**Steps:**

1. Open the cart drawer.
2. Read the drawer while review is pending.
3. Try the drawer checkout action.

**Expected Results:**

* Held facts are not shown as a completed current review.
* Checkout remains unavailable while the review is pending.
* The frontend sends no checkout creation request.

<!-- trace:case id=g10.store-checkout.TC-97f rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-g07,g10.store-checkout.SC-8hm -->
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

<!-- trace:case id=g10.store-checkout.TC-dtv rev=1 covers=g10.store-checkout.SC-8hm -->
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

* customer(member) is on `<grade10 store url>`.
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
* A later click retains the purchase identity.
* Only the backend permits continuation; no duplicate invoice starts.

<!-- trace:case id=g10.store-checkout.TC-q9i rev=1 covers=g10.store-checkout.SC-5tt -->
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

* customer(member) is on `<grade10 store url>`.
* The drawer reads are mocked with `<read condition>`.

**Test data:**

| read condition | Expected checkout |
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

<!-- trace:case id=g10.store-checkout.TC-5i0 rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-d04,g10.store-checkout.SC-g07,g10.store-checkout.SC-8hm -->
### grade10-site-store-checkout-US2-TC10-1: Lost creation responses offer a fresh retry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Q13 supersedes treating response loss as permission to create again.

**Replaced by:** `grade10-site-store-checkout-US5-TC4-1`.

<!-- trace:case id=g10.store-checkout.TC-59c rev=1 covers=g10.store-checkout.SC-4av,g10.store-checkout.SC-jmi -->
### grade10-site-store-checkout-US2-TC11-1: Reused invoices still require a current Pay decision

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

* customer(member) is on `<grade10 store url>`.
* An unpaid invoice exists for the unchanged purchase.
* Opening review passes, then `<current refusal>` occurs before Pay.

**Test data:**

| current refusal |
| --- |
| Variant A price changes after opening review |
| Variant A becomes sold out after opening review |
| Variant A requested quantity becomes unavailable after opening review |
| Previously accepted code no longer fits the current basket |
| Previously accepted points are refused by the current decision |

**Steps:**

1. Open the cart drawer.
2. Wait for the passing opening review.
3. Apply `<current refusal>` in the checkout test fixture.
4. Click Proceed to Checkout.
5. Read the refusal feedback.

**Expected Results:**

* Pay checks the changed live facts despite the saved invoice.
* The affected line or refused tender is identified.
* The saved hosted invoice does not open.
* No replacement order or payable invoice is created.

<!-- trace:case id=g10.store-checkout.TC-ubu rev=1 covers=g10.store-checkout.SC-zu1 -->
### grade10-site-store-checkout-US2-TC12-1: Withdrawn and sold-out lines remain distinct on review

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

* customer(member) is on `<grade10 store url>`.
* The cart has one available line and `<unavailable line>`.

**Test data:**

| unavailable line |
| --- |
| Variant B withdrawn from the sales channel |
| Variant B still on the channel but sold out |

**Steps:**

1. Open the cart drawer.
2. Wait for current review.
3. Read the unavailable-items feedback.
4. Read the current cart lines.

**Expected Results:**

* Feedback names the affected line.
* Withdrawn lines are removed with the unavailable-items notice.
* Sold-out lines remain visible for the collector to remove.

<!-- trace:case id=g10.store-checkout.TC-pw9 rev=1 covers=g10.store-checkout.SC-d04 -->
### grade10-site-store-checkout-US2-TC13-1: Unknown cart reads show Retry without invented line names

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
* **Trace:** grade10-site-store-checkout-US-02

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The cart read fails before any lines are known.
* Retry subsequently returns one available line and current tender.

**Steps:**

1. Open the cart drawer.
2. Read the failed cart summary.
3. Click Retry.
4. Wait for the current review.
5. Read the drawer checkout control.

**Expected Results:**

* The cart is unchecked without invented affected-line names.
* Pay stays unavailable until Retry completes current facts.
* Retry restores current lines and makes ready checkout available.

<!-- trace:case id=g10.store-checkout.TC-gm5 rev=1 covers=g10.store-checkout.SC-jmi -->
### grade10-site-store-checkout-US2-TC14-1: Refused tender cannot disappear into a payable invoice

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

* customer(member) is on `<grade10 store url>`.
* The drawer shows an accepted code and points.
* The current Pay decision refuses the accepted tender.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the tender refusal.
4. Correct the refused choice using its drawer control.
5. Wait for persisted tender and current review.
6. Click Proceed to Checkout.

**Expected Results:**

* The first Pay names the tender refusal.
* No invoice silently omits the refused choice.
* The corrected Pay uses persisted accepted tender.

---

## grade10-site-store-checkout-US3: Collector finds the paid order after Shopify

**As a** signed-in collector who paid on Shopify,
**I want** to return to Grade10, find the order while it settles and see the current cart,
**so that** I trust the store kept my purchase and later choices.

<!-- trace:case id=g10.store-checkout.TC-a1c rev=2 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-o15 -->
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
* The order displays its existing pending-settlement treatment.
* Pending order reads continue while settlement is unresolved.
* Order detail shows the same purchase.
* Return alone does not clear the cart or tender.

<!-- trace:case id=g10.store-checkout.TC-09w rev=3 covers=g10.store-checkout.SC-m13,g10.store-checkout.SC-5sl -->
### grade10-site-store-checkout-US3-TC2-3: Observed payment clears only the unchanged bought cart

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

* customer(member) is on `<grade10 orders url>`.
* Existing order reads transition the matching purchase from pending to paid.
* The bought active cart has not changed since Pay.
* The resulting authoritative cart read is empty with default tender.

**Steps:**

1. Open the matching order detail.
2. Wait for the existing read to show paid.
3. Open the cart drawer.
4. Read its refreshed lines and tender.

**Expected Results:**

* The matching order displays the returned paid state and total.
* The cart refresh reflects the existing paid-transition result.
* The bought unchanged cart is empty.
* Cart tender returns to its default choice.

<!-- trace:case id=g10.store-checkout.TC-nds rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-ub1 rev=1 covers=g10.store-checkout.SC-o15 -->
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

* customer(member) is on `<confirmation surface>`.
* The matching purchase is returned by existing Grade10 order reads.

**Test data:**

| confirmation surface | Expected destination |
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

<!-- trace:case id=g10.store-checkout.TC-b6s rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-mue rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-8yq rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-t9f rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-qkv rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-9a1 rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
### grade10-site-store-checkout-US3-TC10-1: Cart edits do not change the invoice purchase

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Q8/Q16 supersede deleting matching variants and later tender.

**Replaced by:** `grade10-site-store-checkout-US6-TC4-1`.

<!-- trace:case id=g10.store-checkout.TC-mw4 rev=1 covers=g10.store-checkout.SC-vor -->
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
* The existing orders read is mocked with `<orders condition>`.

**Test data:**

| orders condition | Expected surface | Existing action |
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

<!-- trace:case id=g10.store-checkout.TC-s7d rev=1 covers=g10.store-checkout.SC-n14 -->
### grade10-site-store-checkout-US3-TC12-1: Missed payment notification converges through authoritative recovery

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

* customer(member) owns an invoice paid at Shopify.
* The payment notification is withheld; Grade10 still shows pending.

**Steps:**

1. Read the owned order detail.
2. Run the payment reconciliation test walk.
3. Read the API response and payment facts.

**Expected Results:**

* The existing purchase converges to paid.
* Shopify's paid total, shipping and tax are retained.
* No second purchase or invoice is created.

<!-- trace:case id=g10.store-checkout.TC-7l8 rev=1 covers=g10.store-checkout.SC-m13 -->
### grade10-site-store-checkout-US3-TC13-1: Repeated payment signals preserve one settled purchase

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

* customer(member) owns a paid Shopify invoice.
* Its Grade10 order remains pending with an unchanged bought cart.

**Steps:**

1. Deliver the verified payment notification in the test harness.
2. Deliver the same notification again.
3. Run the reconciliation test walk.
4. Read the owned order and current cart.

**Expected Results:**

* The same purchase reaches paid once.
* Repeated signals retain the paid purchase facts.
* The unchanged bought cart converts once.

<!-- trace:case id=g10.store-checkout.TC-8l7 rev=1 covers=g10.store-checkout.SC-p16 -->
### grade10-site-store-checkout-US3-TC14-1: Invalid payment notifications cannot settle another purchase

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

* customer(member) owns an unpaid order.
* The notification has `<invalid condition>`.

**Test data:**

| invalid condition |
| --- |
| Unknown invoice reference |
| A shop different from the order's shop |
| Invalid notification signature |

**Steps:**

1. Deliver the notification through the checkout test harness.
2. Read the owned order response.
3. Read the current cart and tender.

**Expected Results:**

* The unpaid order does not become paid.
* The member cart and tender remain unchanged.
* No replacement order is created.

<!-- trace:case id=g10.store-checkout.TC-g2o rev=1 covers=g10.store-checkout.SC-vor -->
### grade10-site-store-checkout-US3-TC15-1: Another member cannot discover or settle the owned purchase

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

* customer A(member) owns a pending purchase.
* customer B(member) has a separate signed-in session.

**Steps:**

1. Request customer A's order detail as customer B.
2. Read the API response.
3. Read customer A's order and cart through A's session.

**Expected Results:**

* Customer B receives no owned purchase details.
* Customer A's order and cart remain unchanged.

---

## grade10-site-store-checkout-US4: Signed-out collector is asked to sign in

**As a** collector who is not signed in,
**I want** checkout to explain the identity requirement,
**so that** I sign in before an order or payment is started.

<!-- trace:case id=g10.store-checkout.TC-nos rev=2 covers=g10.store-checkout.SC-f06 -->
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

* customer is signed out on `<grade10 store url>`.

**Steps:**

1. Open the cart drawer or its sign-in action.
2. Read the sign-in surface.

**Expected Results:**

* The frontend explains the signed-in requirement.
* The existing sign-in action is offered.
* No guest basket or public typed-email checkout is offered.
* The frontend sends no checkout creation request.

<!-- trace:case id=g10.store-checkout.TC-hi4 rev=2 covers=g10.store-checkout.SC-rpf -->
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

* customer(member) is on `<grade10 store url>`.
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

<!-- trace:case id=g10.store-checkout.TC-44q rev=1 covers=g10.store-checkout.SC-f06 -->
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

<!-- trace:case id=g10.store-checkout.TC-wi7 rev=1 covers=g10.store-checkout.SC-f06 -->
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

<!-- trace:case id=g10.store-checkout.TC-bvr rev=1 covers=g10.store-checkout.SC-f06 -->
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

<!-- trace:case id=g10.store-checkout.TC-81w rev=1 covers=g10.store-checkout.SC-cc7 -->
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

* customer A(member) is on `<grade10 store url>`.
* The current basket and accepted tender are ready.
* Customer A's creation response is mocked to remain pending.

**Test data:**

| session change | Current collector |
| --- | --- |
| Sign out | Signed-out customer |
| Switch to customer B | Customer B(member), separate basket |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Make `<session change>` before the response arrives.
4. Release customer A's hosted URL response.
5. Read the current surface and browser destination.

**Expected Results:**

* Customer A's late response does not redirect the current collector.
* It does not show customer A's order or checkout outcome.
* The current collector keeps their existing session surface.

<!-- trace:case id=g10.store-checkout.TC-o06 rev=1 covers=g10.store-checkout.SC-i5j -->
### grade10-site-store-checkout-US4-TC7-1: Typed email cannot replace storefront member authorization

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

* customer has `<session condition>` on the public storefront.
* The supplied typed email belongs to a ready buyer.

**Test data:**

| session condition |
| --- |
| Signed out |
| Signed-in member without elevated operator access |

**Steps:**

1. Submit typed-email checkout through the test harness.
2. Read the API response.
3. Read the order and invoice records.

**Expected Results:**

* Typed email does not authorize public checkout.
* No purchase or invoice is created.

<!-- trace:case id=g10.store-checkout.TC-sw1 rev=1 covers=g10.store-checkout.SC-i5j -->
### grade10-site-store-checkout-US4-TC8-1: Authorized sandbox operator retains the existing typed-email gate

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
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
2. Read the API response.

**Expected Results:**

* The authorized sandbox procedure accepts the buyer identity.
* The response identifies the reviewed buyer purchase.

<!-- trace:case id=g10.store-checkout.TC-avn rev=1 covers=g10.store-checkout.SC-i5j -->
### grade10-site-store-checkout-US4-TC9-1: Production refuses operator typed-email checkout before purchase creation

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

* admin(holds store:write) has an authenticated production-context test fixture.
* The typed email identifies a buyer with a ready basket.

**Steps:**

1. Submit typed-email checkout through the test harness.
2. Read the API response.
3. Read the order and invoice records.

**Expected Results:**

* The production gate refuses typed-email checkout.
* No purchase or invoice is created.

## Settled

- Q17/Q20 supersede the earlier frontend-only scope and require the complete checkout contract.
- Q6/Q11/Q13 supersede fresh creation on repeat, reload or response loss; the same purchase returns its saved invoice or lifecycle.
- Q8/Q15/Q16 supersede ignored invoices and matching-variant cleanup; retire older unpaid invoices and preserve later cart choices.
- Existing shared order labels remain; this change adds no badge.
- No matching purchase uses existing orders states and actions.
- **Terminal purchase** - Replaying the same completed or closed purchase returns its existing outcome. A changed purchase uses a new identity. A new same-basket reorder action is outside this amendment.

## Reconciliation

- **Run** - QA1 read only the frozen outline, six journeys, proposal, decisions, undispositioned UI states, linked PRDs, prior suite with reconciliation stripped, domain suite and included conventions. Requirements, technical design, application code, archive and coverage metadata were denied. QA1 later read the unchanged durable Purpose in an isolated non-anchor supplement (qa1-purpose-report.md); it changed no cases, domain-impact disposition or frozen anchors. QA2 read the resulting blind suite beside the complete current delta and unchanged durable requirements, then reconciled each case, scenario, task and UI state below.
- **Anchors** - All six journeys and five roots remain unchanged. Current basket/tender is US1/US2; hosted handoff is US1/US4; safe repetition/recovery is US5/US6; settlement/return is US3/US6; carrier rates are US1. No domain case is credited: the Store domain suite does not assert these checkout outcomes. No product/platform composed path changes.
- **Folded** - Blind reads of empty/current readiness, persistence gating, accepted tender failure/refusal, fresh authentication, existing operator gates, verification boundaries and carrier token refusal land as adjacent scenarios from existing decided sources. The source scenarios SC49-60 record the reconciled outcomes; the cases remain draft.
- **Rejected** - A deliberate same-basket reorder after terminal replay is outside this amendment. Exact terminal replay preserves the existing order; changed submitted context requires a new identity. Q6/Q11 and the unchanged terminal replay contract settle this. No new reorder action, copy, invoice creation or badge is authorized.
- **Preserved** - All deprecated historical cases and retired task addresses remain. Earlier frontend-only results are historical evidence, not waivers of backend guarantees.
- **Out of suite** - SC07 Shopify's actual named-line refusal is verified by the authorized real-shop walk in task12.4, including a line whose stock changes on the hosted invoice. Frontend fixtures do not decide provider stock enforcement. Add this explicit observation to task12.4; retain the original scenario.
- **Out of suite** - SC08 transaction/provider ordering is verified by apps/backend/grade10/store/test/db/checkoutAsMember.spec.ts and packages/grade10-store/backend/test/services/checkout.test.ts under tasks8.1/8.3. Force failure between order and line insert, assert rollback, and assert provider call after commit plus saved reference before URL. US1 TC33 covers visible binding, not internal atomicity.
- **Out of suite** - SC44 old-bundle safety is verified by packages/grade10-store/backend/test/trpc/checkoutAliases.test.ts, apps/backend/grade10/store/test/db/checkoutRouter.spec.ts and apps/backend/zzz/store/test/db/checkoutRouter.spec.ts under tasks7.1/9.1/9.4. Assert actual legacy codec decoding and zero additional provider dispatch for existing/ambiguous/mismatched purchases. Existing paths are planned verifier locations, not execution claims.
- **Out of suite** - The internal recovery deadline, exact shop/member/fingerprint correlation, search pagination, ambiguous/missing candidate handling, durable edit+retirement atomicity and once-only transition are backend verifier obligations in Groups8-10. The feature cases observe the resulting purchase safety; they do not alone prove those internal mechanisms.
- **Existing surfaces** - Missing returned-order and order-ownership cases remain governed by existing order-page verifiers. Their reference trace is SC59, which delegates to the actual shared history capability and existing authenticated detail boundary; no unrelated checkout scenario receives credit.
- **Coverage** - SC46 is covered by US5 TC12. Known-order settling, terminal and recovery states are US5 TC5/TC6/TC9. Authoritative conversion and later-cart protection are US3 TC1/TC2 and US6 TC4. Every active scenario has exact case coverage or a named out-of-suite verifier; execution remains pending.

### Case Dispositions

| Case | Disposition | Numbered Scenarios |
| --- | --- | --- |
| `grade10-site-store-checkout-US5-TC1-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-34` |
| `grade10-site-store-checkout-US5-TC2-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-33` |
| `grade10-site-store-checkout-US5-TC3-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-33` |
| `grade10-site-store-checkout-US5-TC4-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US5-TC5-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-48` |
| `grade10-site-store-checkout-US5-TC6-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-48` |
| `grade10-site-store-checkout-US5-TC7-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-40` |
| `grade10-site-store-checkout-US5-TC8-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-20` |
| `grade10-site-store-checkout-US5-TC9-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-48` |
| `grade10-site-store-checkout-US5-TC10-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-10` |
| `grade10-site-store-checkout-US5-TC11-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-41` |
| `grade10-site-store-checkout-US6-TC1-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-42`, `grade10-site-store-checkout-SC-43` |
| `grade10-site-store-checkout-US6-TC2-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-42` |
| `grade10-site-store-checkout-US6-TC3-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US6-TC4-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-45` |
| `grade10-site-store-checkout-US6-TC5-1` | Folded invoice-immutability route; SC60 | `grade10-site-store-checkout-SC-60` |
| `grade10-site-store-checkout-US1-TC1-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-05` |
| `grade10-site-store-checkout-US1-TC2-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-02` |
| `grade10-site-store-checkout-US1-TC3-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC4-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC5-2` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC6-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC7-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC8-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC9-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC10-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC11-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC12-2` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US1-TC13-2` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US1-TC14-2` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US1-TC15-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC16-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC17-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC18-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC19-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC20-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC21-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC22-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC23-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC24-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC25-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-49` |
| `grade10-site-store-checkout-US1-TC26-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-37` |
| `grade10-site-store-checkout-US1-TC27-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-58` |
| `grade10-site-store-checkout-US1-TC28-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-50` |
| `grade10-site-store-checkout-US1-TC29-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US1-TC30-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-17` |
| `grade10-site-store-checkout-US1-TC31-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-18` |
| `grade10-site-store-checkout-US1-TC32-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-56` |
| `grade10-site-store-checkout-US1-TC33-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-05` |
| `grade10-site-store-checkout-US1-TC34-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US2-TC1-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-03` |
| `grade10-site-store-checkout-US2-TC2-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-04` |
| `grade10-site-store-checkout-US2-TC3-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US2-TC4-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-03` |
| `grade10-site-store-checkout-US2-TC5-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US2-TC6-2` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-53` |
| `grade10-site-store-checkout-US2-TC7-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US2-TC8-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US2-TC9-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-53` |
| `grade10-site-store-checkout-US2-TC10-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US2-TC11-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-39`, `grade10-site-store-checkout-SC-51` |
| `grade10-site-store-checkout-US2-TC12-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-52` |
| `grade10-site-store-checkout-US2-TC13-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-04` |
| `grade10-site-store-checkout-US2-TC14-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-51` |
| `grade10-site-store-checkout-US3-TC1-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-15` |
| `grade10-site-store-checkout-US3-TC2-3` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-47` |
| `grade10-site-store-checkout-US3-TC3-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US3-TC4-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-15` |
| `grade10-site-store-checkout-US3-TC5-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US3-TC6-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US3-TC7-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US3-TC8-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US3-TC9-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US3-TC10-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US3-TC11-1` | Existing order-surface reference; SC59 reference retained | `grade10-site-store-checkout-SC-59` |
| `grade10-site-store-checkout-US3-TC12-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-14` |
| `grade10-site-store-checkout-US3-TC13-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-13` |
| `grade10-site-store-checkout-US3-TC14-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-16` |
| `grade10-site-store-checkout-US3-TC15-1` | Existing order-surface reference; SC59 reference retained | `grade10-site-store-checkout-SC-59` |
| `grade10-site-store-checkout-US4-TC1-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-06` |
| `grade10-site-store-checkout-US4-TC2-2` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-54` |
| `grade10-site-store-checkout-US4-TC3-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US4-TC4-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US4-TC5-1` | Preserved deprecated history; no active credit | None; history or owning-verifier repair |
| `grade10-site-store-checkout-US4-TC6-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US4-TC7-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-55` |
| `grade10-site-store-checkout-US4-TC8-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-55` |
| `grade10-site-store-checkout-US4-TC9-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-55` |

| `grade10-site-store-checkout-US5-TC12-1` | Reconciled draft; unavailable/malformed protocol blocks handoff and legacy fallback | `grade10-site-store-checkout-SC-46` |

### Scenario Dispositions

| Scenario | Disposition | Cases / Verifier |
| --- | --- | --- |
| `grade10-site-store-checkout-SC-01` | Reconciled draft behavior | `grade10-site-store-checkout-US1-TC1-2` |
| `grade10-site-store-checkout-SC-02` | Reconciled draft behavior | `grade10-site-store-checkout-US1-TC2-1` |
| `grade10-site-store-checkout-SC-03` | Reconciled draft behavior | `grade10-site-store-checkout-US2-TC1-2`, `grade10-site-store-checkout-US2-TC4-2` |
| `grade10-site-store-checkout-SC-04` | Reconciled draft behavior | `grade10-site-store-checkout-US2-TC2-2`, `grade10-site-store-checkout-US2-TC13-1` |
| `grade10-site-store-checkout-SC-05` | Reconciled draft behavior | `grade10-site-store-checkout-US1-TC1-2`, `grade10-site-store-checkout-US1-TC33-1` |
| `grade10-site-store-checkout-SC-06` | Reconciled draft behavior | `grade10-site-store-checkout-US4-TC1-2` |
| `grade10-site-store-checkout-SC-07` | Out of suite / explicit verifier | Authorized provider stock-change walk, task12.4 |
| `grade10-site-store-checkout-SC-08` | Out of suite / explicit verifier | DB rollback/provider ordering only, tasks8.1/8.3 |
| `grade10-site-store-checkout-SC-09` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC2-1` |
| `grade10-site-store-checkout-SC-10` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC10-1` |
| `grade10-site-store-checkout-SC-11` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC1-1` |
| `grade10-site-store-checkout-SC-12` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC1-2` |
| `grade10-site-store-checkout-SC-13` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC2-3`, `grade10-site-store-checkout-US3-TC13-1` |
| `grade10-site-store-checkout-SC-14` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC12-1` |
| `grade10-site-store-checkout-SC-15` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC1-2`, `grade10-site-store-checkout-US3-TC4-1` |
| `grade10-site-store-checkout-SC-16` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC14-1` |
| `grade10-site-store-checkout-SC-17` | Reconciled draft behavior | `grade10-site-store-checkout-US1-TC30-1` |
| `grade10-site-store-checkout-SC-18` | Reconciled draft behavior | `grade10-site-store-checkout-US1-TC31-1` |
| `grade10-site-store-checkout-SC-19` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC6-1` |
| `grade10-site-store-checkout-SC-20` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC8-1` |
| `grade10-site-store-checkout-SC-21` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC9-1` |
| `grade10-site-store-checkout-SC-33` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC2-1`, `grade10-site-store-checkout-US5-TC3-1` |
| `grade10-site-store-checkout-SC-34` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC1-1` |
| `grade10-site-store-checkout-SC-35` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC3-1`, `grade10-site-store-checkout-US4-TC6-1` |
| `grade10-site-store-checkout-SC-36` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC4-1` |
| `grade10-site-store-checkout-SC-37` | Reconciled draft behavior | `grade10-site-store-checkout-US1-TC13-2`, `grade10-site-store-checkout-US1-TC26-1` |
| `grade10-site-store-checkout-SC-38` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC4-1`, `grade10-site-store-checkout-US2-TC8-1` |
| `grade10-site-store-checkout-SC-39` | Reconciled draft behavior | `grade10-site-store-checkout-US2-TC11-1` |
| `grade10-site-store-checkout-SC-40` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC7-1` |
| `grade10-site-store-checkout-SC-41` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC11-1` |
| `grade10-site-store-checkout-SC-42` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC1-1`, `grade10-site-store-checkout-US6-TC2-1` |
| `grade10-site-store-checkout-SC-43` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC1-1` |
| `grade10-site-store-checkout-SC-44` | Out of suite / explicit verifier | Old/new codec plus engine dispatch counters, tasks7.1/9.1/9.4 |
| `grade10-site-store-checkout-SC-45` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC4-1` |
| `grade10-site-store-checkout-SC-46` | Out of suite / explicit verifier | Append US5 TC12; canonical port/drawer, tasks7.1/11.1/11.2 |
| `grade10-site-store-checkout-SC-47` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC2-3` |
| `grade10-site-store-checkout-SC-48` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC5-1`, `grade10-site-store-checkout-US5-TC6-1`, `grade10-site-store-checkout-US5-TC9-1` |
| `grade10-site-store-checkout-SC-59` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC11-1`, `grade10-site-store-checkout-US3-TC15-1`; Truthful delegation; actual shared history and guarded detail sources |

| `grade10-site-store-checkout-SC-49` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US1-TC25-1` |
| `grade10-site-store-checkout-SC-50` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US1-TC28-1` |
| `grade10-site-store-checkout-SC-51` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US2-TC11-1`, `grade10-site-store-checkout-US2-TC14-1` |
| `grade10-site-store-checkout-SC-52` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US2-TC12-1` |
| `grade10-site-store-checkout-SC-53` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US2-TC6-2`, `grade10-site-store-checkout-US2-TC9-1` |
| `grade10-site-store-checkout-SC-54` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US4-TC2-2` |
| `grade10-site-store-checkout-SC-55` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US4-TC7-1`, `grade10-site-store-checkout-US4-TC8-1`, `grade10-site-store-checkout-US4-TC9-1` |
| `grade10-site-store-checkout-SC-56` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US1-TC32-1` |
| `grade10-site-store-checkout-SC-57` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US1-TC12-2`, `grade10-site-store-checkout-US1-TC13-2`, `grade10-site-store-checkout-US1-TC14-2`, `grade10-site-store-checkout-US1-TC34-1` |
| `grade10-site-store-checkout-SC-58` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US1-TC27-1` |
| `grade10-site-store-checkout-SC-60` | Reconciled draft behavior; current source | `grade10-site-store-checkout-US6-TC5-1` |

### Task Dispositions

| Task | Disposition |
| --- | --- |
| 1.1 | Planning source/trace/contract gate; no implementation claim |
| 1.2 | Planning source/trace/contract gate; no implementation claim |
| 1.3 | Planning source/trace/contract gate; no implementation claim |
| 4.1 | Preserved historical completed claim; no current-contract credit |
| 4.4 | Preserved historical completed claim; no current-contract credit |
| 4.5 | Preserved historical completed claim; no current-contract credit |
| 4.8 | Preserved historical completed claim; no current-contract credit |
| 4.9 | Preserved historical completed claim; no current-contract credit |
| 4.10 | Preserved historical completed claim; no current-contract credit |
| 4.11 | Preserved historical completed claim; no current-contract credit |
| 5.5 | Preserved historical completed claim; no current-contract credit |
| 5.6 | Readiness/provider gate; explicit staging authority and observed evidence required |
| 5.7 | Readiness/provider gate; explicit staging authority and observed evidence required |
| 6.1 | Real actor walk and evidence classification; no approved/actual cases during planning |
| 6.2 | Real actor walk and evidence classification; no approved/actual cases during planning |
| 6.3 | Real actor walk and evidence classification; no approved/actual cases during planning |
| 7.1 | Required current delivery work; tests precede implementation; focused verification retained; include SC46 refusal and adjacent wire/UI cases |
| 7.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 7.3 | Required current delivery work; tests precede implementation; focused verification retained |
| 8.1 | Required current delivery work; tests precede implementation; focused verification retained; SC08 rollback/ordering and canonical different-key race assertions |
| 8.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 8.3 | Required current delivery work; tests precede implementation; focused verification retained; SC08 rollback/ordering and canonical different-key race assertions |
| 8.4 | Required current delivery work; tests precede implementation; focused verification retained |
| 9.1 | Required current delivery work; tests precede implementation; focused verification retained; include recovery deadline, multiple/missing/wrong-owner drafts and changed-request blockade |
| 9.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 9.3 | Required current delivery work; tests precede implementation; focused verification retained |
| 9.4 | Required current delivery work; tests precede implementation; focused verification retained |
| 9.5 | Required current delivery work; tests precede implementation; focused verification retained |
| 10.1 | Required current delivery work; tests precede implementation; focused verification retained; include token refusal SC56 and both reconcile and owned-detail repair |
| 10.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 10.3 | Required current delivery work; tests precede implementation; focused verification retained |
| 10.4 | Required current delivery work; tests precede implementation; focused verification retained |
| 11.1 | Required current delivery work; tests precede implementation; focused verification retained; include SC46 refusal and adjacent wire/UI cases |
| 11.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 11.3 | Required current delivery work; tests precede implementation; focused verification retained |
| 11.4 | Required current delivery work; tests precede implementation; focused verification retained; two return surfaces and existing labels |
| 12.1 | Required current delivery work; tests precede implementation; focused verification retained |
| 12.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 12.3 | Readiness/provider gate; explicit staging authority and observed evidence required |
| 12.4 | Readiness/provider gate; explicit staging authority and observed evidence required; retained SC07 hosted stock refusal required by task12.4 |
| 12.5 | Readiness/provider gate; explicit staging authority and observed evidence required |
| 13.1 | Real actor walk and evidence classification; no approved/actual cases during planning |
| 13.2 | Real actor walk and evidence classification; no approved/actual cases during planning |
| 13.3 | Real actor walk and evidence classification; no approved/actual cases during planning |

### UI Dispositions

| UI State | Disposition / Cases |
| --- | --- |
| Opening/resumed | US1 TC1, US5 TC3; fresh current facts plus restored identity |
| Ready basket | US1 TC1/TC2; accepted tender and estimate |
| Pending persistence/decision | US1 TC27, US2 TC6/TC9; readiness SC58/SC53 |
| Pending Pay | US5 TC1; synchronous and rendered guards, SC34 |
| Changed line/failed read | US2 TC1/TC2/TC4/TC9/TC11/TC13/TC14; Retry and no stale handoff |
| Verification required | US1 TC12/TC13/TC14/TC26/TC34; threshold partitions SC57 plus feedback SC37 |
| Hosted invoice ready | US1 TC1/TC33, US5 TC2; context-matching redirect, binding ordering verifier |
| Settling/terminal | US5 TC5/TC6; existing labels; poll only moving states |
| Changed context/conflict | US6 TC3, US4 TC6, US5 TC11; Serves anchors reconciled |
| Recovery required | US5 TC9; support/known order; backend blockade and deadline verifier |
| Paid unchanged cart | US3 TC2/TC13; authoritative empty/default tender |
| Paid older/rebuilt cart | US6 TC4; same variants/quantity and tender-only rows retained |
| Retired older invoice | US6 TC1/TC2; authoritative cancellation, durable due work |
| Signed out | US4 TC1/TC2/TC7; no public creation |
| Shopify confirmation | US3 TC4; Thank You and Order status, static Your Orders |
| Loading/error/empty orders | Existing OrderHistoryPage test verifier; US3 TC11 preserved; no invented order |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-store-checkout-US5-TC1-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC2-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC3-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC4-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC5-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC6-1` | to be walked through immutable-context terminal Pay API replay and known-order display in the Group8/13 replay walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC7-1` | to be walked through two browser tabs with distinct keys and real DB/provider-call counts in the Group12 concurrency walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC8-1` | to be walked through worker interruption before dispatch, API retry and real DB/provider-call counts in the Group9/12 fault walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC9-1` | to be walked through ambiguous dispatch, support/known-order navigation and blocked retry in the Group9/13 recovery walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC10-1` | to be walked through lost Shopify answer, provider lookup, Pay retry and invoice counts in the Group9/12 recovery walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC11-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US6-TC1-1` | to be walked through drawer edits, provider retirement and both old/new order reads in the authorized Group12 retirement walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US6-TC2-1` | to be walked through committed drawer edit, unresolved retirement and blocked Pay in the Group9/13 retirement walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US6-TC3-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US6-TC4-1` | to be walked through older paid-order observation and later cart/tender reads in the Group10/13 cart-protection walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US6-TC5-1` | to be walked through an open hosted invoice and separate editing/reloading Grade10 tab in the authorized Group12 invoice walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC1-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC2-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC12-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC13-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC14-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC25-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC26-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC27-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC28-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC30-1` | to be walked through Shopify carrier/preview API requests and persisted cart/order reads in the authorized Group12 carrier walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC31-1` | to be walked through unsupported-destination carrier API request and persisted cart/order reads in the authorized Group12 carrier walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC32-1` | to be walked through missing/wrong-token carrier API requests and cart/order side-effect reads in the Group10 verifier and authorized Group12 carrier walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC33-1` | to be walked through Pay API response, saved order and provider binding inspection in the Group12 purchase walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US1-TC34-1` | to be walked through direct Pay API at gross-goods verification boundary and order/invoice counts in the Group8 verifier; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC1-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC2-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC4-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC6-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC8-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC9-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC11-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC12-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC13-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US2-TC14-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US3-TC1-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US3-TC2-3` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US3-TC4-1` | Walk both Shopify Thank You and Order status static Your Orders links and the matching purchase in the authorized Group12 return walk; execution remains pending |
| `grade10-site-store-checkout-US3-TC11-1` | Drive order-history loading/error/Retry/empty/Shop now fixtures in Group13; execution remains pending |
| `grade10-site-store-checkout-US3-TC12-1` | to be walked through owned-detail read and forced reconcile with withheld webhook in the Group10 verifier and authorized Group12 recovery walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US3-TC13-1` | to be walked through duplicate verified webhook delivery and reconciliation plus DB/cart reads in the Group10 verifier; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US3-TC14-1` | to be walked through unknown-reference/wrong-shop/invalid-signature delivery and DB/cart reads in the Group10 verifier; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US3-TC15-1` | to be walked through two authenticated sessions and other-member detail API request in the Group10 ownership verifier; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US4-TC1-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US4-TC2-2` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US4-TC6-1` | to be walked through cart drawer, existing feedback/actions and order reads with the case's seeded or delayed boundary in the Group13 actor walk; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US4-TC7-1` | to be walked through typed-email API calls without elevated authorization and order/invoice counts in the Group7/8 gate verifier; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US4-TC8-1` | to be walked through existing authorized development/staging operator checkout procedure in the Group7 adapter verifier; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US4-TC9-1` | to be walked through production-context typed-email API gate fixture and zero creation counts in the Group7 adapter verifier; planning grants no automated acceptance or execution credit |
| `grade10-site-store-checkout-US5-TC12-1` | to be walked through the drawer with unavailable/malformed context and Pay protocol fixtures, support feedback and zero legacy fallback request assertions in Group11/13; no automated acceptance or execution credit yet |
