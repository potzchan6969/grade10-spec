# grade10-site/store/checkout Test Cases

**Status:** pending-review · 0/48
**Drafts styled:** 2026-10-09, tcs-rules r4

**Out of suite:** grade10-site-store-checkout-SC-08

## grade10-site-store-checkout-US5: Collector starts one payment at a time

**As a** signed-in collector whose payment is starting,
**I want** the drawer to accept one Pay at a time and open only the answer for my current cart,
**so that** I do not leave for a payment I did not mean to start.

<!-- trace:case id=g10.store-checkout.TC-x86 rev=2 covers=g10.store-checkout.SC-5x2 -->
### grade10-site-store-checkout-US5-TC1-2: A pending Pay accepts no second Pay in the drawer

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
* The checkout answer is mocked to stay pending.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Attempt Proceed to Checkout again by pointer and keyboard.
4. Attempt item, tender, disclosure and product/account navigation actions by pointer and keyboard before the answer.
5. Release the hosted-invoice answer.

**Expected Results:**

* Proceed to Checkout shows loading until the answer arrives.
* The drawer sends one checkout request.
* Item, tender, disclosure and navigation actions remain disabled during Pay.
* Attempting those actions starts no write or navigation.
* The supplied hosted invoice opens.


<!-- trace:case id=g10.store-checkout.TC-fnc rev=1 covers=none -->
### grade10-site-store-checkout-US5-TC3-1: Same-session reload retains the existing purchase

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

**Deprecated:** Q29 makes Pay after reload a new request the backend decides; keeping one purchase across reload is add-checkout-purchase-safety (Q24).

<!-- trace:case id=g10.store-checkout.TC-03q rev=1 covers=g10.store-checkout.SC-8hm -->
### grade10-site-store-checkout-US5-TC4-1: A lost payment answer recovers the existing purchase

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

**Deprecated:** Q27 limits the drawer to failure feedback without retry; recovering the purchase behind a lost answer is add-checkout-purchase-safety (Q24). Replaced by `grade10-site-store-checkout-US5-TC13-2`.

<!-- trace:case id=g10.store-checkout.TC-9sb rev=1 covers=g10.store-checkout.SC-cbb -->
### grade10-site-store-checkout-US5-TC5-1: A settling answer opens Your Orders and polls the purchase

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
* The checkout answer is mocked as settling for the submitted purchase.
* Order reads keep that purchase pending before returning paid.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the matching order in Your Orders.
4. Wait for its paid read.
5. Open the cart drawer.

**Expected Results:**

* Step 2 opens Your Orders, not a hosted payment page.
* The matching pending purchase is visible.
* Existing order labels describe its state.
* Pending order reads continue until paid is read.
* After the paid read, the drawer shows freshly read cart and tender.


<!-- trace:case id=g10.store-checkout.TC-zhh rev=1 covers=none -->
### grade10-site-store-checkout-US5-TC7-1: Concurrent tabs converge on one purchase and invoice

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
4. Read both returned purchases and hosted URLs.
5. Read the member's matching order.
6. Read the returned invoices' current provider state.

**Expected Results:**

* Both answers identify the same persisted purchase and order.
* Each returns its saved invoice or truthful settling state.
* Exactly one matching order and payable invoice exist.
* Every returned hosted URL belongs to that payable invoice.
* Neither answer returns a canceled or superseded invoice URL.
* A canceled or superseded invoice never opens from either tab.

**Deprecated:** Q29 moves concurrent tabs converging on one purchase to add-checkout-purchase-safety.


<!-- trace:case id=g10.store-checkout.TC-nxk rev=1 covers=none -->
### grade10-site-store-checkout-US5-TC11-1: Conflict refreshes current intent without automatic payment

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

**Deprecated:** Q29 moves concurrent-tab conflicts to add-checkout-purchase-safety; the stale-answer outcome is `grade10-site-store-checkout-US6-TC3-1` and `grade10-site-store-checkout-US4-TC6-1`.

<!-- trace:case id=g10.store-checkout.TC-tdy rev=1 covers=none -->
### grade10-site-store-checkout-US5-TC12-1: Missing compatible checkout protocol prevents unsafe fallback

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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

**Deprecated:** Q25 sends the existing checkout request with no context read or protocol envelope, so there is no protocol to fall back from.

<!-- trace:case id=g10.store-checkout.TC-yly rev=2 covers=g10.store-checkout.SC-8hm -->
### grade10-site-store-checkout-US5-TC13-2: A lost Pay answer ends the pending Pay without retry

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
* The current basket review and accepted tender are ready.
* The checkout answer is mocked as `<lost answer>`.

**Test data:**

| lost answer |
| --- |
| The connection drops before the answer arrives |
| The answer arrives but cannot be read |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Wait for Proceed to Checkout to stop loading.
4. Read the drawer feedback.
5. Click Proceed to Checkout once the basket is ready.

**Expected Results:**

* Proceed to Checkout stops loading after the lost answer.
* Currently permitted drawer actions return after the request ends.
* The drawer shows the existing failure feedback.
* The feedback says neither that no invoice exists nor that one was canceled.
* No hosted payment page opens.
* No checkout request is sent again before step 5.
* Step 5 sends one new checkout request.

---

<!-- trace:case id=g10.store-checkout.TC-iux rev=1 covers=g10.store-checkout.SC-4e3 -->
### g10.store-checkout.US5-TC14: A reopened drawer waits for its current Pay

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

* customer(member) has a reviewed drawer with accepted tender.
* The checkout answer can be held after the request is sent.
* The member, cart and tender stay unchanged; fresh reopening reads can complete without changing the submitted intent.

**Test data:**

| dismissal | After dismissal |
| --- | --- |
| Close | Leave closed |
| Backdrop | Leave closed |
| Escape | Leave closed |
| Close | Reopen before answer |
| Backdrop | Reopen before answer |
| Escape | Reopen before answer |

**Steps:**

1. Click Proceed to Checkout and hold its answer.
2. Use `<dismissal>`.
3. For a reopen row, open the same-member drawer and let its current reads finish while Pay still waits.
4. Attempt Pay by pointer and keyboard if the drawer is open.
5. Release the current successful hosted-invoice answer.
6. Inspect the browser destination and checkout request record.

**Expected Results:**

* Each dismissal closes immediately and cancels no sent request.
* A reopened same-member drawer keeps Pay disabled while the sent request waits; attempts send no second request.
* The current hosted-invoice answer opens Shopify from both the closed and reopened drawer states.
* Closing or reopening alone does not make the answer stale, and no Pay is replayed automatically.

<!-- trace:case id=g10.store-checkout.TC-5c1 rev=1 covers=g10.store-checkout.SC-87t -->
### g10.store-checkout.US5-TC15: Finishing Pay leaves another drawer operation pending

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

* customer(member) has a reviewed drawer with accepted tender.
* Pay and a current drawer refresh can be held independently.
* A separate tab can save a cart edit before a successful older Pay answer, leaving that answer stale.

**Test data:**

| Pay answer | Context before answer |
| --- | --- |
| Success with hosted URL | Separate tab saved a later cart edit; current refresh waits |
| Refusal | Current refresh waits |
| Failure | Current refresh waits |

**Steps:**

1. Send Pay and hold its answer.
2. Start and hold a current refresh, saving the separate-tab edit for the success row.
3. Release `<Pay answer>` while the refresh waits.
4. Attempt item, tender, disclosure, navigation and Pay actions.
5. Finish the refresh and wait for ready current review and quote.
6. Inspect actions and request counts without activating them.

**Expected Results:**

* Pay ends, but the active refresh keeps every non-dismissal drawer action disabled.
* No attempted edit, navigation or second Pay starts while the refresh waits.
* A new Pay becomes available only after refresh ends and the current review and tender facts permit it.
* Completion starts no new Pay automatically; the successful older reply opens no hosted page.

## grade10-site-store-checkout-US6: Collector keeps the cart built after Pay

**As a** signed-in collector who changes the cart or tender in another tab or after leaving hosted payment,
**I want** my later cart and choices kept when the earlier payment settles,
**so that** a delayed purchase cannot remove my later choices.


<!-- trace:case id=g10.store-checkout.TC-0a2 rev=1 covers=none -->
### grade10-site-store-checkout-US6-TC2-1: Retirement uncertainty preserves edits and truthful order state

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

**Deprecated:** Q24 moves invoice retirement and its uncertainty to add-checkout-purchase-safety.

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
* The drawer holds variant A, quantity 1, an accepted code and 10 accepted points.
* The checkout answer for that cart is mocked to stay pending.
* Another tab holds the same member cart and can save `<later edit>`.

**Test data:**

| later edit |
| --- |
| Increase variant A from quantity 1 to 2 |
| Change accepted points from 10 to 20, both valid |
| Replace the accepted code with another fitting code |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Make `<later edit>` in another tab before the answer arrives.
4. Wait for the edit to be saved.
5. Release the earlier hosted-invoice answer.
6. Read the current drawer and browser destination.
7. Wait for all current drawer work and current review and quote to finish.
8. Click Proceed to Checkout deliberately and inspect the new request.

**Expected Results:**

* The earlier answer opens no hosted page; the browser stays on Grade10.
* The drawer shows the later saved choices, not the earlier answer.
* The later cart and tender remain intact.
* No new checkout request starts by itself.
* The later deliberate Pay sends the current reviewed lines and accepted tender as a new request, after all current drawer work ends.

<!-- trace:case id=g10.store-checkout.TC-suh rev=1 covers=g10.store-checkout.SC-xu2,g10.store-checkout.SC-2n2 -->
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
* The older purchase is paid after the later choices were saved.

**Test data:**

| later cart | later tender |
| --- | --- |
| Variant A increased from quantity 1 to 2 | Original accepted tender |
| Variant A, quantity 1, with added available variant B | Original accepted tender |
| Rebuilt cart containing variant A, quantity 1 | Original accepted tender |
| Same variant A, quantity 1 | Original code with accepted points changed from 10 to 20; both valid |
| Same variant A, quantity 1 | Original points choice with a different fitting code |
| Variant A, quantity 2, with added available variant B | Different fitting code and accepted points |

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

<!-- trace:case id=g10.store-checkout.TC-uni rev=2 covers=g10.store-checkout.SC-15p -->
### grade10-site-store-checkout-US6-TC5-2: Later edits never rewrite the sent invoice

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
* The invoice was sent with variant A, quantity 1, and 10 accepted points.
* A separate Grade10 tab holds the same member cart.

**Steps:**

1. Increase variant A from quantity 1 to 2 in Grade10.
2. Change accepted points from 10 to 20 in Grade10.
3. Reload the original hosted invoice.
4. Read its lines and tender, or its closed notice.
5. Reload the Grade10 tab.
6. Read the cart drawer.

**Expected Results:**

* The invoice shows its sent lines and tender, or is closed.
* The invoice never shows quantity 2 or 20 points.
* Reload shows later persisted cart and tender choices.

<!-- trace:case id=g10.store-checkout.TC-iey rev=1 covers=none -->
### grade10-site-store-checkout-US6-TC6-1: An older order shows canceled only when its read says so

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-store-checkout-US-06

**Pre-conditions:**

* customer(member) is on `<grade10 orders url>`.
* An unpaid older order holds variant A, quantity 1.
* The member then saved variant A at quantity 2 in the cart.
* The older order's read is mocked to report `<order read>`.

**Test data:**

| order read | Expected order state |
| --- | --- |
| Canceled | Existing canceled label |
| Still pending | Existing pending label, never canceled |

**Steps:**

1. Open the older order in Your Orders.
2. Read its order state.
3. Open the cart drawer.
4. Read its current lines.

**Expected Results:**

* The older order shows the expected order state from **Test data**.
* The saved edit alone never shows the older order canceled.
* The drawer still shows variant A at quantity 2.

**Deprecated:** Q32 leaves a canceled older order to the existing order-status labels; when the backend cancels it is add-checkout-purchase-safety, and this change's suite does not test it.

---

## grade10-site-store-checkout-US1: Collector sends a current cart to hosted payment

**As a** signed-in collector,
**I want** to review my current cart and send its accepted tender to Shopify,
**so that** I pay for the lines and choices I just saw.

<!-- trace:case id=g10.store-checkout.TC-tb9 rev=2 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-e05,g10.store-checkout.SC-uzw -->
### grade10-site-store-checkout-US1-TC1-2: Current drawer basket and tender reach hosted payment

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
* **Testability:** automation, manual
* **Trace:** grade10-site-store-checkout-US-01

**Pre-conditions:**

* customer(member) is on `<grade10 store url>`.
* The cart holds `<reviewed basket>` and `<accepted tender>`.

**Test data:**

| Field | Value |
| --- | --- |
| reviewed basket | Two available variants, quantities 1 and 2; representative positive quantities |

| accepted tender |
| --- |
| No store code; no points spent |
| One accepted store code; no points spent |
| No store code; a valid positive points choice |
| No store code; 1 point, the smallest positive choice |
| One accepted store code; a valid positive points choice |

**Steps:**

1. Open the cart drawer.
2. Read the reviewed lines and accepted tender.
3. Click Proceed to Checkout in the drawer.
4. Read the hosted invoice.

**Expected Results:**

* The drawer shows current quantities, prices and accepted tender.
* Proceed to Checkout checks current facts separately from the opening review.
* The bound order carries `<reviewed basket>` and `<accepted tender>`.
* The returned hosted URL opens directly from the drawer.
* The invoice shows the reviewed basket and accepted tender.
* No points spent reaches hosted payment without a points refusal.
* With no points spent, the invoice has no points deduction.
* Shopify collects the shipping address and payment.

<!-- trace:case id=g10.store-checkout.TC-sew rev=1 covers=g10.store-checkout.SC-b02 -->
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


<!-- trace:case id=g10.store-checkout.TC-ldd rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-inp rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

* No verification feedback appears.
* The returned hosted URL opens.

<!-- trace:case id=g10.store-checkout.TC-vil rev=3 covers=g10.store-checkout.SC-vsd,g10.store-checkout.SC-ecp -->
### grade10-site-store-checkout-US1-TC13-3: Unverified goods at the limit require account verification

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
* The site's profile page is enabled.

**Test data:**

| gross goods | `<accepted tender>` | Expected checkout |
| --- | --- | --- |
| HKD 120,000.00, the verification limit | Accepted points reducing the estimate below HKD 120,000 | Existing verification feedback and account action |
| HKD 120,000.01, one minor unit above the limit | Accepted points reducing the estimate below HKD 120,000 | Existing verification feedback and account action |

**Steps:**

1. Open the cart drawer.
2. Wait for the current review.
3. Click Proceed to Checkout in the drawer.
4. Read the verification feedback.
5. Click the account action.

**Expected Results:**

* The verification message and account action are shown.
* Gross goods trigger the gate despite the lower estimate.
* No hosted payment page opens.
* The account action opens account verification.

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

<!-- trace:case id=g10.store-checkout.TC-doe rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-vk1 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-3ft rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-sp5 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-1bl rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-81s rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-qog rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-2p2 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

**Replaced by:** `grade10-site-store-checkout-US5-TC1-2`.

<!-- trace:case id=g10.store-checkout.TC-w15 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-mnx rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-5g0 rev=2 covers=g10.store-checkout.SC-vsd -->
### grade10-site-store-checkout-US1-TC26-2: Checkout verification response shows existing account feedback

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

* customer(member) is on `<grade10 store url>`.
* The current basket review and accepted tender are ready.
* Checkout creation is mocked to return the existing verification-required outcome.
* The site's profile page is `<profile page>`.

**Test data:**

| profile page | Account action |
| --- | --- |
| enabled | Shown; opens account verification |
| disabled | Not shown |

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout in the drawer.
3. Read the account-verification feedback.
4. Click the account action, where shown.

**Expected Results:**

* The existing threshold message is shown.
* No hosted payment destination opens.
* The account action appears as the `<profile page>` row states.
* Where shown, the account action opens account verification.

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
* The checkout request uses the retained choice with its ready quote.

<!-- trace:case id=g10.store-checkout.TC-pa7 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

1. Send the checkout request for the reviewed purchase.
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

1. Send the checkout request for the reviewed purchase.
2. Read the API response.
3. Read the order and invoice records.

**Expected Results:**

* The response requires account verification.
* No order or hosted invoice is created.

<!-- trace:case id=g10.store-checkout.TC-12c rev=1 covers=g10.store-checkout.SC-e05,g10.store-checkout.SC-uzw -->
### grade10-site-store-checkout-US1-TC35-1: A Pay after saved edits sends the edited basket and tender

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

* customer(member) is on `<grade10 store url>`.
* The cart holds variant A, quantity 1, with 10 accepted points.
* An earlier checkout for that cart opened a hosted invoice, left unpaid.

**Test data:**

| Field | Value |
| --- | --- |
| edited quantity | 2, different from the 1 already sent |
| edited points | 20, different from the 10 already sent; both valid in the fixture |

**Steps:**

1. Open the cart drawer.
2. Increase variant A to `<edited quantity>`.
3. Wait for the quantity write and current review.
4. Apply `<edited points>` through the points control.
5. Wait for the tender write and current quote.
6. Click Proceed to Checkout in the drawer.
7. Read the opened hosted invoice.

**Expected Results:**

* The drawer shows variant A at `<edited quantity>` and `<edited points>` accepted.
* The opened invoice shows variant A at `<edited quantity>`.
* The opened invoice deducts `<edited points>`, not the 10 sent before.

---

## grade10-site-store-checkout-US2: Collector repairs a changed cart line

**As a** collector whose cart changes before the payment decision,
**I want** the changed line named before I pay,
**so that** I fix the basket instead of paying for stale goods.

<!-- trace:case id=g10.store-checkout.TC-kpm rev=2 covers=g10.store-checkout.SC-c03 -->
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

<!-- trace:case id=g10.store-checkout.TC-b5w rev=2 covers=g10.store-checkout.SC-d04 -->
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
* The second Proceed to Checkout checks the repaired basket before handoff.

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

<!-- trace:case id=g10.store-checkout.TC-dtv rev=1 covers=g10.store-checkout.SC-f6v -->
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
* No checkout request is sent again until the collector clicks.
* Step 4 sends one new checkout request.

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

<!-- trace:case id=g10.store-checkout.TC-59c rev=1 covers=g10.store-checkout.SC-c03,g10.store-checkout.SC-jmi -->
### grade10-site-store-checkout-US2-TC11-1: Pay refuses a basket or tender changed after the opening review

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
* Opening review passes, then `<current refusal>` occurs before Proceed to Checkout.

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

* The checkout decides on the current basket and tender, not the opening review.
* The affected line or refused tender is identified.
* No hosted payment page opens.

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
* Proceed to Checkout stays unavailable until Retry completes current facts.
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
* The current checkout decision refuses the accepted tender.

**Steps:**

1. Open the cart drawer.
2. Click Proceed to Checkout.
3. Read the tender refusal.
4. Correct the refused choice using its drawer control.
5. Wait for persisted tender and current review.
6. Click Proceed to Checkout.

**Expected Results:**

* The first Proceed to Checkout names the tender refusal.
* No invoice silently omits the refused choice.
* The second Proceed to Checkout uses the persisted accepted tender.

---

<!-- trace:case id=g10.store-checkout.TC-u6z rev=1 covers=g10.store-checkout.SC-0mn -->
### g10.store-checkout.US2-TC15: Failed Pay restores only currently permitted drawer actions

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

* customer(member) has a reviewed drawer with accepted tender.
* Its sent Pay answer can fail or become unreadable.
* No other drawer work remains active when the failure arrives.
* Fixtures supply either ready current facts or terminally failed current review/quote, with applicable action callbacks supplied or absent.

**Test data:**

| Pay answer | Current facts |
| --- | --- |
| Failure | Ready review and quote |
| Unreadable answer | Ready review and quote |
| Failure | Review failed; no current review |
| Unreadable answer | Quote failed; no current quote |

**Steps:**

1. Send Pay and hold its answer.
2. Attempt item, tender, navigation and Pay actions while it waits.
3. Deliver `<Pay answer>` with `<Current facts>` and no remaining work.
4. Inspect existing feedback, values, available actions and callback records.
5. Attempt actions withheld by current facts or absent callbacks, then deliberately activate a permitted action.

**Expected Results:**

* Pay is no longer pending and existing failure feedback appears without a hosted handoff.
* No attempted action replays and no new request starts automatically.
* Item, tender and navigation actions return only where current state and supplied callbacks permit them; withheld actions invoke no callback.
* Pay still requires current review and quote, so it remains unavailable in failed-data rows.
* The deliberate permitted action starts once.

## grade10-site-store-checkout-US3: Collector finds the paid order after Shopify

**As a** signed-in collector who paid on Shopify,
**I want** to return to Grade10, find the order while it settles and see the current cart,
**so that** I trust the store kept my purchase and later choices.

<!-- trace:case id=g10.store-checkout.TC-wam rev=2 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-o15 -->
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

<!-- trace:case id=g10.store-checkout.TC-xym rev=3 covers=g10.store-checkout.SC-m13,g10.store-checkout.SC-5sl,g10.store-checkout.SC-jab -->
### grade10-site-store-checkout-US3-TC2-3: Observed payment clears the cart without later member edits

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
* **Trace:** grade10-site-store-checkout-US-03

**Pre-conditions:**

* customer(member) is on `<grade10 orders url>`.
* A pending purchase fixes the bought cart and tender.
* The member has neither edited nor rebuilt the cart since checkout.
* Before the paid read, the active cart receives `<shop review>`.
* The payment fixture can settle the existing pending purchase.

**Test data:**

| shop review |
| --- |
| No intervening stock or price change |
| A shop review persists a changed price for a bought line |
| A shop review persists reduced stock for a bought line |

**Steps:**

1. Open the matching order detail.
2. Settle the matching payment in the checkout fixture.
3. Wait for the existing read to show paid.
4. Open the cart drawer.
5. Read its refreshed lines and tender.

**Expected Results:**

* The matching order shows paid and the original purchase total.
* Authoritative cart refresh returns no bought-cart lines.
* Cart tender returns to its default choice.
* Shop review alone does not preserve the paid cart.

<!-- trace:case id=g10.store-checkout.TC-nds rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-dno rev=1 covers=g10.store-checkout.SC-o15 -->
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

<!-- trace:case id=g10.store-checkout.TC-ce0 rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-mue rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-8yq rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-t9f rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-qkv rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-9a1 rev=1 covers=g10.store-checkout.SC-l12,g10.store-checkout.SC-m13,g10.store-checkout.SC-n14,g10.store-checkout.SC-o15,g10.store-checkout.SC-2n2 -->
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

<!-- trace:case id=g10.store-checkout.TC-81w rev=1 -->
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

- Q24 keeps this change to the frontend against the current backend. The published requirement "A checkout intent is safe to repeat" stays durable and is delivered by `add-checkout-purchase-safety`, not by this change.
- The drawer sends the existing checkout request: reviewed lines with seen prices, the accepted coupon, positive points or no points field, and no purchase key, cart id or version (Q25).
- One Pay at a time per drawer. Pay for an edited cart returns only when the pending answer ends, and an answer for an older cart, tender or member opens nothing (Q28, Q31).
- A lost or unreadable answer ends the pending Pay with the existing failure feedback and no automatic retry; it claims neither that no invoice exists nor that one was canceled (Q27).
- A Pay from another tab or after a reload is a new request the backend decides; the browser holds no purchase identity (Q29). Until `add-checkout-purchase-safety` lands, a second Pay after a lost answer can leave two orders with one payable invoice (Q30).
- Paid conversion is the backend's member-edit guard. The frontend reads the cart and tender again and deletes no line (Q8).
- A canceled older order reads through the existing order-status labels; when the backend cancels it belongs to `add-checkout-purchase-safety`, and this suite does not test it (Q32).
- Settlement, notification and ownership cases stay in this suite (Q33).
- Existing shared order labels remain; this change adds no badge.
- No matching purchase uses existing orders states and actions.
- **Terminal purchase** - Terminal replay belongs to `add-checkout-purchase-safety` (Q24), and the drawer maps no terminal answer (Q34). A new same-basket reorder action is outside this change.

## Reconciliation

### Pending QA2 - 2026-10-13

This fresh increment compares the blind pending cases with the settled
Q31/Q35 request lifetime, the current checkout technical design and SC34,
SC35 and SC66-SC68 in `spec.md`. The earlier ledger is retained for historical
scope; this section supersedes its coverage claims for the revised scenarios.

| Case | Disposition |
| --- | --- |
| `grade10-site-store-checkout-US5-TC1-2` / `TC-x86` | Retain blind draft; include disclosure and pointer/keyboard actions in the full pending guard |
| `grade10-site-store-checkout-US6-TC3-1` / `TC-cde` | Retain blind external-tab edit rows; add deliberate later Pay after all work and current facts to complete revised SC35 |
| `grade10-site-store-checkout-US4-TC6-1` / `TC-81w` | Retain member-change draft and identity; remove whole SC35 link because it does not run a deliberate later Pay |
| `grade10-site-store-checkout-US5-TC13-2` / `TC-yly` | Retain blind recovery assertion after lost answer and existing exact SC38 link |
| `grade10-site-store-checkout-US1-TC35-1` / `TC-12c` | Retain blind sequential waits; saved-edit request purpose unchanged |
| `g10.store-checkout.US5-TC14` / `TC-iux` | New QA2 draft from uncovered close/reopen-before-answer and Q35 still-current successful reply; trace CLI allocated |
| `g10.store-checkout.US5-TC15` / `TC-5c1` | New QA2 draft from uncovered checkout/refresh overlap; success made stale by external edit so the drawer can observe the remaining refresh |
| `g10.store-checkout.US2-TC15` / `TC-u6z` | New QA2 draft from uncovered failure recovery under current-data and callback guards; trace CLI allocated |

| Source in `spec.md` | Complete asserting case |
| --- | --- |
| `grade10-site-store-checkout-SC-34` (`SC-5x2`) | `grade10-site-store-checkout-US5-TC1-2` |
| `grade10-site-store-checkout-SC-35` (`SC-cc7`) | `grade10-site-store-checkout-US6-TC3-1`; US4-TC6 retains the additional member-change boundary without claiming the full scenario |
| `grade10-site-store-checkout-SC-66` (`SC-87t`) | `g10.store-checkout.US5-TC15` |
| `grade10-site-store-checkout-SC-67` (`SC-4e3`) | `g10.store-checkout.US5-TC14` |
| `grade10-site-store-checkout-SC-68` (`SC-0mn`) | `g10.store-checkout.US2-TC15` |

- **Anchor coverage** - US05 covers one pending Pay, last-operation lifetime, dismissal and current hosted navigation; US06 retains external edits and deliberate later Pay. US02 covers deliberate recovery under data guards; US04 retains stale-member rejection.
- **Overclaims** - The partial member-change route no longer claims all of SC35. Cart US9-TC3 remains the closed-only reply case; it is not used as complete SC67 coverage because it does not reopen before the answer.
- **Clarification** - Q35 settles QA1's question: a still-current successful hosted reply opens Shopify after Close, backdrop or Escape, whether closed or reopened. The current request excludes the tender-view opening guard.
- **Uncovered scenarios** - None in this increment. No unresolved product choice or contradiction remains. Earlier unrelated backend/provider coverage dispositions are unchanged.
- **Lifecycle** - 48 active cases, all draft; the three QA2 additions are draft/manual. Deprecated identities and snapshots remain untouched. No execution, acceptance or publication is claimed.

#### Pending Manual

| Manual | Why |
| --- | --- |
| `grade10-site-store-checkout-US5-TC1-2` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |
| `grade10-site-store-checkout-US6-TC3-1` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |
| `grade10-site-store-checkout-US4-TC6-1` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |
| `grade10-site-store-checkout-US5-TC13-2` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |
| `grade10-site-store-checkout-US1-TC35-1` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |
| `g10.store-checkout.US5-TC14` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |
| `g10.store-checkout.US5-TC15` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |
| `g10.store-checkout.US2-TC15` | To be walked in Checkout Group 15.1 request-lifetime fixtures and Group 16.1 pending Pay actor walk, with controlled refreshes, external-tab edits, current/older replies and callback records. Existing Group 13 ownership remains. No test or walk has executed in this planning run. |



### Frontend Scope Run - 2026-10-09

- **Run** - QA1 read the frozen outline, six journeys, proposal, decisions with Q24-Q34, undispositioned UI states, linked PRDs and the prior suite with its reconciliation stripped; requirements, technical design and coverage metadata were denied. Dev rewrote the delta, technical design and tasks for the frontend scope. QA2 read both beside the current delta and the unchanged durable requirements, and reconciled every case, scenario, task and UI state below.
- **Anchors** - The six journeys and five feature roots are unchanged. No domain case is credited; no product or platform path changes.
- **Durable safety coverage** - The six scenario-specific cases for SC-09, SC-10, SC-11, SC-19, SC-20 and SC-21 move to `add-checkout-purchase-safety` as active drafts with their case IDs, revisions and traces unchanged. This delta omits the safety deprecation overrides, so acceptance keeps the published US1-TC3, TC4, TC5, TC8, TC9 and TC10 assertions active. Delivery remains outside this frontend change.
- **Deprecated** - QA1's twelve deprecations (US5 TC2-TC4, TC6-TC12; US6 TC1, TC2) are confirmed with their Q24, Q25, Q27, Q29 and Q34 reasons. QA2 deprecates QA1's new US6-TC6-1: Q32 keeps a canceled older order out of this suite. No case is deleted or renumbered.
- **Folded** - QA1's US5-TC13-1 (lost answer, SC-38) and US1-TC35-1 (edited request, SC-05 and SC-63) are folded as drafts with trace-CLI markers. Two draft cases verified behaviour the ADDED requirement states but no scenario of their journey did: QA2 folds SC-64 (settling answer, US-05, for US5-TC5-1) and SC-65 (failed answer, US-02, for US2-TC8-1) from its Answers paragraph.
- **Re-pointed** - US1-TC1-2 takes SC-63 for dropped SC-61; US2-TC11-1 takes SC-03 for dropped SC-39; US6-TC4-1 drops SC-62, which serves US-03 only. Revisions are unchanged: only coverage moved.
- **Rejected** - None. No reading contradicts the delta; no question is raised.
- **Out of suite** - SC-07: Shopify enforces stock on its own invoice; the Grade10 side, an unpaid order and a retained basket, is tested by tasks 11.6 and 11.7. SC-08: transaction and provider ordering are backend facts this change does not modify; task 11.10 links their existing tests, and a missing one goes to `add-checkout-purchase-safety`. SC-44 left the header with its scenario, and SC-07 left it in the rerun below.
- **Coverage** - Every scenario in the delta has an active case or a named Out of suite verifier. Execution remains pending.
- **History** - The 2026-10-08 ledger below is kept as history; its scenario, task and group references predate Q24.
- **Rerun after acceptance review, 2026-10-09** - A fresh QA2 read the review of `217e6d6c` and the planning owner's source repairs, and changed only the suite, the UI dispositions and the planning record:
  - **SC-60 rev 2 (B2)** - US6-TC5-1 becomes US6-TC5-2. It asserts that the sent invoice never shows the later lines or tender, and no longer that it stays open or payable. Whether it stays payable is the store's answer
  - **Verification (B1, F4)** - US1-TC13-2 becomes US1-TC13-3: the gate now answers a click on Proceed to Checkout, with the profile page enabled. US1-TC26-1 becomes US1-TC26-2, with rows for the profile page enabled and disabled; the account action appears only where it is enabled (SC-37 rev 3, SC-57 rev 2). Each marker `rev` moves with its case
  - **Pay naming (F5)** - E2e steps and results name the control Proceed to Checkout, and say "checkout request" for what it sends; api cases US1-TC33-1 and US1-TC34-1 send the checkout request. US1-TC12-2 now reads "No verification feedback appears". Revisions are unchanged: wording only
  - **SC-63 rev 2** - No case asserted the removed purchase key, cart id and version line, so no case changes
  - **Durable-only scenarios (F2)** - The 2026-10-10 handoff below replaces the journey-only coverage claim. Acceptance retains active durable cases that assert each outcome; the safety change owns the moved draft cases.
  - **Feature set (F1, N4)** - The roots are unchanged. The fold merges the Feature set by label, so the durable leaves for provider binding, intent, recovery and changed intent stay without being restated in the delta. SC-08 stays Out of suite with task 11.10; the durable-only scenarios are owed as above. No case traces a feature set group
  - **Records (F9)** - Tasks 11.6 and 11.7 now name SC-64 and SC-65, and the Task Dispositions table says so
  - **SC-07** - A check of the folded store shows the same anchor join reaches SC-07 through the active US-02 cases, so it leaves the `**Out of suite:**` header. Its verifier stays tasks 11.6 and 11.7. SC-08 serves a feature set group, which no case traces, and stays Out of suite with task 11.10
  - **SC-16** - SC-16 rev 2 serves US-03 (bea3f808), so US3-TC14-1 reaches it after the fold

### Case Dispositions - 2026-10-09

| Case | Status | Disposition | Scenarios |
| --- | --- | --- | --- |
| `grade10-site-store-checkout-US5-TC1-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-34` |
| `grade10-site-store-checkout-US5-TC2-1` | deprecated | QA1 deprecation confirmed: Q24 invoice reuse; dropped ids removed from covers | `grade10-site-store-checkout-SC-09` |
| `grade10-site-store-checkout-US5-TC3-1` | deprecated | QA1 deprecation confirmed: Q29 reload is a new request; dropped ids removed from covers | None |
| `grade10-site-store-checkout-US5-TC4-1` | deprecated | QA1 deprecation confirmed: Q27 lost answer has no recovery in the drawer; replaced by US5-TC13-1; dropped ids removed from covers | `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US5-TC5-1` | draft | Covers re-pointed from dropped SC-48 to folded SC-64 (settling answer, US-05) | `grade10-site-store-checkout-SC-64` |
| `grade10-site-store-checkout-US5-TC6-1` | deprecated | QA1 deprecation confirmed: Q24/Q34 terminal replay; dropped ids removed from covers | `grade10-site-store-checkout-SC-19` |
| `grade10-site-store-checkout-US5-TC7-1` | deprecated | QA1 deprecation confirmed: Q29 concurrent tabs; dropped ids removed from covers | None |
| `grade10-site-store-checkout-US5-TC8-1` | deprecated | QA1 deprecation confirmed: Q24 dispatch recovery; dropped ids removed from covers | `grade10-site-store-checkout-SC-20` |
| `grade10-site-store-checkout-US5-TC9-1` | deprecated | QA1 deprecation confirmed: Q24/Q34 ambiguous dispatch; dropped ids removed from covers | `grade10-site-store-checkout-SC-21` |
| `grade10-site-store-checkout-US5-TC10-1` | deprecated | QA1 deprecation confirmed: Q24 lost Shopify answer recovery; dropped ids removed from covers | `grade10-site-store-checkout-SC-10` |
| `grade10-site-store-checkout-US5-TC11-1` | deprecated | QA1 deprecation confirmed: Q29/Q34 conflict; stale answer is US6-TC3-1 and US4-TC6-1; dropped ids removed from covers | None |
| `grade10-site-store-checkout-US5-TC12-1` | deprecated | QA1 deprecation confirmed: Q25 no protocol to fall back from; dropped ids removed from covers | None |
| `grade10-site-store-checkout-US5-TC13-2` | draft | QA1 new case folded; marker allocated | `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US6-TC1-1` | deprecated | QA1 deprecation confirmed: Q24 invoice retirement; edited request is US1-TC35-1; dropped ids removed from covers | `grade10-site-store-checkout-SC-11` |
| `grade10-site-store-checkout-US6-TC2-1` | deprecated | QA1 deprecation confirmed: Q24 retirement uncertainty; dropped ids removed from covers | None |
| `grade10-site-store-checkout-US6-TC3-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US6-TC4-1` | draft | SC-62 removed: it serves US-03, where US3-TC2-3 covers it | `grade10-site-store-checkout-SC-45`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US6-TC5-2` | draft | Bumped from TC5-1 on 2026-10-09 for SC-60 rev 2: asserts the sent invoice never shows the later lines or tender, and no longer that it stays open | `grade10-site-store-checkout-SC-60` |
| `grade10-site-store-checkout-US6-TC6-1` | deprecated | QA1 new case deprecated: Q32 keeps canceled older orders out of this suite; marker allocated with covers=none | None |
| `grade10-site-store-checkout-US1-TC1-2` | draft | Dropped SC-61 replaced by SC-63; visible lines and tender only; request shape by task 11.6 | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-63` |
| `grade10-site-store-checkout-US1-TC2-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-02` |
| `grade10-site-store-checkout-US1-TC3-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC4-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC5-2` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC6-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC7-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC8-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC9-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC10-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC11-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC12-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US1-TC13-3` | draft | Bumped from TC13-2 on 2026-10-09: the gate answers Proceed to Checkout (B1), with the profile page enabled (SC-37 rev 3, SC-57 rev 2) | `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US1-TC14-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US1-TC15-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC16-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC17-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC18-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC19-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC20-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC21-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC22-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC23-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC24-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC25-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-49` |
| `grade10-site-store-checkout-US1-TC26-2` | draft | Bumped from TC26-1 on 2026-10-09 for SC-37 rev 3: profile page enabled and disabled rows | `grade10-site-store-checkout-SC-37` |
| `grade10-site-store-checkout-US1-TC27-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-58` |
| `grade10-site-store-checkout-US1-TC28-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-50` |
| `grade10-site-store-checkout-US1-TC29-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-02`, `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-09`, `grade10-site-store-checkout-SC-10`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-11`, `grade10-site-store-checkout-SC-20`, `grade10-site-store-checkout-SC-21`, `grade10-site-store-checkout-SC-17`, `grade10-site-store-checkout-SC-18`, `grade10-site-store-checkout-SC-37`, `grade10-site-store-checkout-SC-34`, `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US1-TC30-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-17` |
| `grade10-site-store-checkout-US1-TC31-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-18` |
| `grade10-site-store-checkout-US1-TC32-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-56` |
| `grade10-site-store-checkout-US1-TC33-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-05` |
| `grade10-site-store-checkout-US1-TC34-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-57` |
| `grade10-site-store-checkout-US1-TC35-1` | draft | QA1 new case folded; marker allocated; edited request and new invoice | `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-63` |
| `grade10-site-store-checkout-US2-TC1-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-03` |
| `grade10-site-store-checkout-US2-TC2-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-04` |
| `grade10-site-store-checkout-US2-TC3-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US2-TC4-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-03` |
| `grade10-site-store-checkout-US2-TC5-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US2-TC6-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-53` |
| `grade10-site-store-checkout-US2-TC7-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US2-TC8-1` | draft | Covers re-pointed from SC-38 (now US-05 only) to folded SC-65 (failed answer, US-02) | `grade10-site-store-checkout-SC-65` |
| `grade10-site-store-checkout-US2-TC9-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-53` |
| `grade10-site-store-checkout-US2-TC10-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-07`, `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US2-TC11-1` | draft | Dropped SC-39 replaced by SC-03; current named-line and tender refusal at Pay | `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-51` |
| `grade10-site-store-checkout-US2-TC12-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-52` |
| `grade10-site-store-checkout-US2-TC13-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-04` |
| `grade10-site-store-checkout-US2-TC14-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-51` |
| `grade10-site-store-checkout-US3-TC1-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-15` |
| `grade10-site-store-checkout-US3-TC2-3` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-62` |
| `grade10-site-store-checkout-US3-TC3-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US3-TC4-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-15` |
| `grade10-site-store-checkout-US3-TC5-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US3-TC6-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US3-TC7-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US3-TC8-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US3-TC9-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US3-TC10-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-14`, `grade10-site-store-checkout-SC-15`, `grade10-site-store-checkout-SC-36` |
| `grade10-site-store-checkout-US3-TC11-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-59` |
| `grade10-site-store-checkout-US3-TC12-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-14` |
| `grade10-site-store-checkout-US3-TC13-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-13` |
| `grade10-site-store-checkout-US3-TC14-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-16` |
| `grade10-site-store-checkout-US3-TC15-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-59` |
| `grade10-site-store-checkout-US4-TC1-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-06` |
| `grade10-site-store-checkout-US4-TC2-2` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-54` |
| `grade10-site-store-checkout-US4-TC3-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-06` |
| `grade10-site-store-checkout-US4-TC4-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-06` |
| `grade10-site-store-checkout-US4-TC5-1` | deprecated | Historical deprecated; dropped SC-33 removed from covers | `grade10-site-store-checkout-SC-06` |
| `grade10-site-store-checkout-US4-TC6-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US4-TC7-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-55` |
| `grade10-site-store-checkout-US4-TC8-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-55` |
| `grade10-site-store-checkout-US4-TC9-1` | draft | Kept draft; covers verified against the frontend delta | `grade10-site-store-checkout-SC-55` |

### Scenario Dispositions - 2026-10-09

| Scenario | Disposition | Cases / Verifier |
| --- | --- | --- |
| `grade10-site-store-checkout-SC-01` | Covered by active cases | `grade10-site-store-checkout-US1-TC1-2` |
| `grade10-site-store-checkout-SC-02` | Covered by active cases | `grade10-site-store-checkout-US1-TC2-1` |
| `grade10-site-store-checkout-SC-03` | Covered by active cases | `grade10-site-store-checkout-US2-TC1-2`, `grade10-site-store-checkout-US2-TC4-2`, `grade10-site-store-checkout-US2-TC11-1` |
| `grade10-site-store-checkout-SC-04` | Covered by active cases | `grade10-site-store-checkout-US2-TC2-2`, `grade10-site-store-checkout-US2-TC13-1` |
| `grade10-site-store-checkout-SC-49` | Covered by active cases | `grade10-site-store-checkout-US1-TC25-1` |
| `grade10-site-store-checkout-SC-50` | Covered by active cases | `grade10-site-store-checkout-US1-TC28-1` |
| `grade10-site-store-checkout-SC-51` | Covered by active cases | `grade10-site-store-checkout-US2-TC11-1`, `grade10-site-store-checkout-US2-TC14-1` |
| `grade10-site-store-checkout-SC-52` | Covered by active cases | `grade10-site-store-checkout-US2-TC12-1` |
| `grade10-site-store-checkout-SC-53` | Covered by active cases | `grade10-site-store-checkout-US2-TC6-2`, `grade10-site-store-checkout-US2-TC9-1` |
| `grade10-site-store-checkout-SC-05` | Covered by active cases | `grade10-site-store-checkout-US1-TC1-2`, `grade10-site-store-checkout-US1-TC33-1`, `grade10-site-store-checkout-US1-TC35-1` |
| `grade10-site-store-checkout-SC-06` | Covered by active cases | `grade10-site-store-checkout-US4-TC1-2` |
| `grade10-site-store-checkout-SC-07` | Off the Out of suite list since the 2026-10-09 rerun: after the fold, `check:manual` reaches it through the active US-02 cases and refuses the listing. No active case asserts its THEN; Shopify enforces stock on its own invoice, and tasks 11.6 and 11.7 test the unpaid order and retained basket | None |
| `grade10-site-store-checkout-SC-08` | Out of suite: existing backend tests linked by task 11.10; a scenario with no test is reported to add-checkout-purchase-safety | None |
| `grade10-site-store-checkout-SC-54` | Covered by active cases | `grade10-site-store-checkout-US4-TC2-2` |
| `grade10-site-store-checkout-SC-55` | Covered by active cases | `grade10-site-store-checkout-US4-TC7-1`, `grade10-site-store-checkout-US4-TC8-1`, `grade10-site-store-checkout-US4-TC9-1` |
| `grade10-site-store-checkout-SC-12` | Covered by active cases | `grade10-site-store-checkout-US3-TC1-2` |
| `grade10-site-store-checkout-SC-13` | Covered by active cases | `grade10-site-store-checkout-US3-TC2-3`, `grade10-site-store-checkout-US3-TC13-1` |
| `grade10-site-store-checkout-SC-14` | Covered by active cases | `grade10-site-store-checkout-US3-TC12-1` |
| `grade10-site-store-checkout-SC-15` | Covered by active cases | `grade10-site-store-checkout-US3-TC1-2`, `grade10-site-store-checkout-US3-TC4-1` |
| `grade10-site-store-checkout-SC-16` | Covered by active cases | `grade10-site-store-checkout-US3-TC14-1` |
| `grade10-site-store-checkout-SC-45` | Covered by active cases | `grade10-site-store-checkout-US6-TC4-1` |
| `grade10-site-store-checkout-SC-62` | Covered by active cases | `grade10-site-store-checkout-US3-TC2-3` |
| `grade10-site-store-checkout-SC-59` | Covered by active cases | `grade10-site-store-checkout-US3-TC11-1`, `grade10-site-store-checkout-US3-TC15-1` |
| `grade10-site-store-checkout-SC-17` | Covered by active cases | `grade10-site-store-checkout-US1-TC30-1` |
| `grade10-site-store-checkout-SC-18` | Covered by active cases | `grade10-site-store-checkout-US1-TC31-1` |
| `grade10-site-store-checkout-SC-56` | Covered by active cases | `grade10-site-store-checkout-US1-TC32-1` |
| `grade10-site-store-checkout-SC-63` | Covered at the visible boundary; rev 2 dropped its purchase key, cart id and version line, which no case asserted; request shape by task 11.6 tests | `grade10-site-store-checkout-US1-TC1-2`, `grade10-site-store-checkout-US1-TC35-1` |
| `grade10-site-store-checkout-SC-58` | Covered by active cases | `grade10-site-store-checkout-US1-TC27-1` |
| `grade10-site-store-checkout-SC-34` | Covered by active cases | `grade10-site-store-checkout-US5-TC1-2` |
| `grade10-site-store-checkout-SC-35` | Covered by active cases | `grade10-site-store-checkout-US6-TC3-1`, `grade10-site-store-checkout-US4-TC6-1` |
| `grade10-site-store-checkout-SC-38` | Covered by active cases | `grade10-site-store-checkout-US5-TC13-2` |
| `grade10-site-store-checkout-SC-64` | Folded by QA2 from the ADDED requirement Answers paragraph | `grade10-site-store-checkout-US5-TC5-1` |
| `grade10-site-store-checkout-SC-65` | Folded by QA2 from the ADDED requirement Answers paragraph | `grade10-site-store-checkout-US2-TC8-1` |
| `grade10-site-store-checkout-SC-37` | Covered by active cases | `grade10-site-store-checkout-US1-TC13-3`, `grade10-site-store-checkout-US1-TC26-2` |
| `grade10-site-store-checkout-SC-57` | Covered by active cases | `grade10-site-store-checkout-US1-TC12-2`, `grade10-site-store-checkout-US1-TC13-3`, `grade10-site-store-checkout-US1-TC14-2`, `grade10-site-store-checkout-US1-TC34-1` |
| `grade10-site-store-checkout-SC-36` | Covered by active cases | `grade10-site-store-checkout-US6-TC4-1` |
| `grade10-site-store-checkout-SC-47` | Covered by active cases | `grade10-site-store-checkout-US3-TC2-3` |
| `grade10-site-store-checkout-SC-60` | Covered by active cases | `grade10-site-store-checkout-US6-TC5-2` |
| `grade10-site-store-checkout-SC-09` | Durable requirement unchanged (Q24). Active draft moved to add-checkout-purchase-safety; acceptance keeps its existing durable assertion | None |
| `grade10-site-store-checkout-SC-10` | Durable requirement unchanged (Q24). Active draft moved to add-checkout-purchase-safety; acceptance keeps its existing durable assertion | None |
| `grade10-site-store-checkout-SC-11` | Durable requirement unchanged (Q24). Active draft moved to add-checkout-purchase-safety; acceptance keeps its existing durable assertion | None |
| `grade10-site-store-checkout-SC-19` | Durable requirement unchanged (Q24). Active draft moved to add-checkout-purchase-safety; acceptance keeps its existing durable assertion | None |
| `grade10-site-store-checkout-SC-20` | Durable requirement unchanged (Q24). Active draft moved to add-checkout-purchase-safety; acceptance keeps its existing durable assertion | None |
| `grade10-site-store-checkout-SC-21` | Durable requirement unchanged (Q24). Active draft moved to add-checkout-purchase-safety; acceptance keeps its existing durable assertion | None |
| SC-33 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-39 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-40 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-41 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-42 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-43 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-44 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-46 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-48 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |
| SC-61 (dropped) | Dropped by Dev (Q24/Q25/Q29/Q34); no active case covers it | None |

### Task Dispositions - 2026-10-09

| Task | Disposition |
| --- | --- |
| 1.1 | Open; scoped artifact checks |
| 1.2 | Retired; moved to add-checkout-purchase-safety |
| 1.3 | Retired; moved to add-checkout-purchase-safety |
| 1.4 | Open; PRD Integration readiness for the frontend outcomes |
| 1.5 | Open; check:manual and strict validation |
| 4.1 | Historical completed claim; no current-contract credit |
| 4.4 | Historical completed claim; no current-contract credit |
| 4.5 | Historical completed claim; no current-contract credit |
| 4.8 | Historical completed claim; its dropped SC-33 citation removed 2026-10-09; no current-contract credit |
| 4.9 | Historical completed claim; its dropped SC-33 citation removed 2026-10-09; no current-contract credit |
| 4.10 | Historical completed claim; no current-contract credit |
| 4.11 | Historical completed claim; no current-contract credit |
| 5.5 | Historical completed claim; no current-contract credit |
| 5.6 | Open; authorized staging observation of the drawer, Your Orders and both return links; decides US3-TC4-1 on the live shop |
| 5.7 | Open; verifies 5.6 against this delta |
| 6.1-6.3 | Retired; Group 13 holds the walk |
| 7.1-7.4 | Completed then removed by app commit `306a68624`; never reused |
| 8.1-8.4 | Moved to add-checkout-purchase-safety (Q24) |
| 9.1-9.5 | Moved to add-checkout-purchase-safety (Q24) |
| 10.1-10.5 | Moved to add-checkout-purchase-safety (Q24) |
| 11.1-11.5 | Retired; never reused |
| 11.6 | Open; failing tests for every frontend scenario it names, including the SC-63 request shape and folded SC-64 and SC-65 |
| 11.7 | Open; drawer through `checkout.createCheckout`; names folded SC-64 and SC-65 |
| 11.8 | Open; removes unreachable answer kinds (Q34) |
| 11.9 | Open; polling, paid refresh and return links |
| 11.10 | Open; links existing backend tests for SC-08, 14, 16, 17, 18, 55 and 56; verifier for Out of suite SC-08 |
| 11.11 | Open; focused suites and change-sensitive checks |
| 12.1-12.5 | Moved to add-checkout-purchase-safety (Q24) |
| 13.1 | Open; one actor walk per journey; the planning input for every manual row below |
| 13.2 | Open; flips only cases the walks decide |
| 13.3 | Open; separates Playwright from staging evidence |

### UI Dispositions - 2026-10-09

| UI State | Disposition / Cases |
| --- | --- |
| Opening drawer | SC-01, SC-49; US1-TC1-2, US1-TC25-1 |
| Ready basket | SC-02, SC-50, SC-63; US1-TC1-2, US1-TC2-1, US1-TC28-1, US1-TC35-1 |
| Pending cart or tender write | SC-53, SC-58; US1-TC27-1, US2-TC6-2, US2-TC9-1 |
| Pending Pay response | SC-34, SC-38; US5-TC1-1, US5-TC13-1 |
| Changed line or failed read | SC-03, SC-04, SC-51, SC-52, SC-53; US2 TC1, TC2, TC4, TC6, TC9, TC11, TC12, TC13, TC14 |
| Verification required | SC-37, SC-57; US1 TC12, TC13, TC14, TC26, TC34 |
| Hosted invoice ready | SC-05, SC-35; US1-TC1-2, US1-TC33-1, US6-TC3-1, US4-TC6-1 |
| Settling | SC-12, SC-64; US5-TC5-1, US3-TC1-2 |
| Changed cart during Pay | SC-35, SC-60; US6-TC3-1, US6-TC5-2 |
| Paid cart without later member edits | SC-13, SC-47, SC-62; US3-TC2-3, US3-TC13-1 |
| Paid older cart version | SC-36, SC-45; US6-TC4-1 |
| Canceled older invoice | Out of suite (Q32); US6-TC6-1 deprecated |
| Signed-out collector | SC-06, SC-54, SC-55; US4 TC1, TC2, TC7, TC8, TC9 |
| Shopify confirmation | SC-15; US3-TC1-2, US3-TC4-1 |
| Loading, failed or empty orders | Out of suite: existing order-page contract; SC-59 cases US3-TC11-1 and US3-TC15-1 observe it |

### Merged Backend Run - 2026-10-08 (historical)

- **Run** - QA1 read only the frozen outline, six journeys, proposal, decisions, undispositioned UI states, linked PRDs, prior suite with reconciliation stripped, domain suite and included conventions. Requirements, technical design, application code, archive and coverage metadata were denied. QA1 later read the unchanged durable Purpose in an isolated non-anchor supplement (qa1-purpose-report.md); it changed no cases, domain-impact disposition or frozen anchors. QA2 read the resulting blind suite beside the complete current delta and unchanged durable requirements, then reconciled each case, scenario, task and UI state below.
- **Anchors** - All six journeys and five roots remain unchanged. Current basket/tender is US1/US2; hosted handoff is US1/US4; safe repetition/recovery is US5/US6; settlement/return is US3/US6; carrier rates are US1. No domain case is credited: the Store domain suite does not assert these checkout outcomes. No product/platform composed path changes.
- **Clarification** - On 2026-10-08, independent blind QA1 proposed five bounded draft updates from Q8/Q22 with unchanged anchors. QA2 folds all five: US1 TC1 adds zero-points rows; US3 TC2 observes shop-review-only conversion; US6 TC4 separates member basket, rebuilt-cart and tender edits; US5 TC7 checks canonical payable URLs; US2 TC11 checks current decision before reuse. All 89 issued case headings, marker identities, revisions and classifications remain, including 34 deprecated cases. No new case is derived from Dev scenarios.
- **Revisions** - The [same-run draft assertion rule](../../../../../../../docs/governance/specs-to-test-cases.md#a-case-that-already-exists-is-not-written-twice) keeps each draft's revision when a new assertion joins its existing run. US1 TC1's zero-points rows, US3 TC2's review partitions and US5 TC7's canonical URL assertions expand existing draft runs. US6 TC4 separates partitions under its unchanged preservation results; US2 TC11 sharpens its existing current-before-reuse ordering. None changes a human-reviewed case. Still-stated earlier outcomes receive no synthetic deprecated copies.
- **Wire boundary** - SC61's legacy omission and missing, negative, fractional or above-limit v2 points, plus required per-line `seenUnitPriceMinor` bounds and missing fields for SC39, belong to Group7 codec and adapter tests at `packages/grade10-store/backend/test/trpc/checkoutAliases.test.ts`, `apps/backend/grade10/store/test/db/checkoutRouter.spec.ts` and `apps/backend/zzz/store/test/db/checkoutRouter.spec.ts`, alongside the shared codec tests required by task7.1. Tasks7.1/7.4 fail before 7.2 implements them; task7.3 verifies them. US1 TC1 proves ordinary zero-points handoff only. US2 TC11 proves visible current-price refusal before reuse, not untrusted codec decoding.
- **Version guards** - General cart revision still protects Pay, invoice association and stale frontend responses under SC39/SC41/SC35. Tasks8.1/8.3 and 11.1/11.5 verify those guards; tasks10.1/10.5/10.2 separately prove conversion uses the saved member-edit counter. US3 TC2 observes review-only cleanup and US6 TC4 observes preserved member edits; neither alone proves internal counter updates.
- **Folded** - Blind reads of empty/current readiness, persistence gating, accepted tender failure/refusal, fresh authentication, existing operator gates, verification boundaries and carrier token refusal land as adjacent scenarios from existing decided sources. The source scenarios SC49-60 record the reconciled outcomes; the cases remain draft.
- **Rejected** - A deliberate same-basket reorder after terminal replay is outside this amendment. Exact terminal replay preserves the existing order; changed submitted context requires a new identity. Q6/Q11 and the unchanged terminal replay contract settle this. No new reorder action, copy, invoice creation or badge is authorized.
- **Preserved** - All deprecated historical cases and retired task addresses remain. Earlier frontend-only results are historical evidence, not waivers of backend guarantees.
- **Out of suite** - SC07 Shopify's actual named-line refusal is verified by the authorized real-shop walk in task12.4, including a line whose stock changes on the hosted invoice. Frontend fixtures do not decide provider stock enforcement. Add this explicit observation to task12.4; retain the original scenario.
- **Out of suite** - SC08 transaction/provider ordering is verified by apps/backend/grade10/store/test/db/checkoutAsMember.spec.ts and packages/grade10-store/backend/test/services/checkout.test.ts under tasks8.1/8.3. Force failure between order and line insert, assert rollback, and assert provider call after commit plus saved reference before URL. US1 TC33 covers visible binding, not internal atomicity.
- **Out of suite** - SC44 old-bundle safety is verified by packages/grade10-store/backend/test/trpc/checkoutAliases.test.ts, apps/backend/grade10/store/test/db/checkoutRouter.spec.ts and apps/backend/zzz/store/test/db/checkoutRouter.spec.ts under tasks7.1/9.1/9.4. Assert actual legacy codec decoding and zero additional provider dispatch for existing/ambiguous/mismatched purchases. Existing paths are planned verifier locations, not execution claims.
- **Out of suite** - The internal recovery deadline, exact shop/member/fingerprint correlation, search pagination, ambiguous/missing candidate handling, durable edit+retirement atomicity and once-only transition are backend verifier obligations in Groups8-10. The feature cases observe the resulting purchase safety; they do not alone prove those internal mechanisms.
- **Existing surfaces** - Missing returned-order and order-ownership cases remain governed by existing order-page verifiers. Their reference trace is SC59, which delegates to the actual shared history capability and existing authenticated detail boundary; no unrelated checkout scenario receives credit.
- **Coverage** - SC46 is covered by US5 TC12. Known-order settling, terminal and recovery states are US5 TC5/TC6/TC9. Authoritative conversion and later-cart protection are US3 TC1/TC2 and US6 TC4. Every active scenario has exact case coverage or a named out-of-suite verifier; execution remains pending.

### Case Dispositions - 2026-10-08 (historical)

| Case | Disposition | Numbered Scenarios |
| --- | --- | --- |
| `grade10-site-store-checkout-US5-TC1-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-34` |
| `grade10-site-store-checkout-US5-TC2-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-09`, SC-33 (dropped) |
| `grade10-site-store-checkout-US5-TC3-1` | Reconciled draft; exact observed outcome only | SC-33 (dropped) |
| `grade10-site-store-checkout-US5-TC4-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-38` |
| `grade10-site-store-checkout-US5-TC5-1` | Reconciled draft; exact observed outcome only | SC-48 (dropped) |
| `grade10-site-store-checkout-US5-TC6-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-19`, SC-48 (dropped) |
| `grade10-site-store-checkout-US5-TC7-1` | Folded blind canonical purchase and payable URL assertions; provider state observed through fixture/shop tooling | SC-40 (dropped) |
| `grade10-site-store-checkout-US5-TC8-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-20` |
| `grade10-site-store-checkout-US5-TC9-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-21`, SC-48 (dropped) |
| `grade10-site-store-checkout-US5-TC10-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-10` |
| `grade10-site-store-checkout-US5-TC11-1` | Reconciled draft; exact observed outcome only | SC-41 (dropped) |
| `grade10-site-store-checkout-US6-TC1-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-11`, SC-42 (dropped), SC-43 (dropped) |
| `grade10-site-store-checkout-US6-TC2-1` | Reconciled draft; exact observed outcome only | SC-42 (dropped) |
| `grade10-site-store-checkout-US6-TC3-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-35` |
| `grade10-site-store-checkout-US6-TC4-1` | Folded blind basket-only, rebuilt-cart and tender-only partitions; later choices observed | `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-45`, `grade10-site-store-checkout-SC-62` |
| `grade10-site-store-checkout-US6-TC5-1` | Folded invoice-immutability route; SC60 | `grade10-site-store-checkout-SC-60` |
| `grade10-site-store-checkout-US1-TC1-2` | Folded blind zero-points rows; visible handoff only | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-05`, SC-61 (dropped) |
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
| `grade10-site-store-checkout-US2-TC11-1` | Folded blind current-decision-before-reuse ordering; price and tender refusals retained | SC-39 (dropped), `grade10-site-store-checkout-SC-51` |
| `grade10-site-store-checkout-US2-TC12-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-52` |
| `grade10-site-store-checkout-US2-TC13-1` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-04` |
| `grade10-site-store-checkout-US2-TC14-1` | Folded from decided source; scenario added | `grade10-site-store-checkout-SC-51` |
| `grade10-site-store-checkout-US3-TC1-2` | Reconciled draft; exact observed outcome only | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-15` |
| `grade10-site-store-checkout-US3-TC2-3` | Folded blind shop-review rows; authoritative conversion observed | `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-62` |
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
| `grade10-site-store-checkout-US5-TC12-1` | Reconciled draft; unavailable/malformed protocol blocks handoff and legacy fallback | SC-46 (dropped) |

### Scenario Dispositions - 2026-10-08 (historical)

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
| SC-33 (dropped) | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC2-1`, `grade10-site-store-checkout-US5-TC3-1` |
| `grade10-site-store-checkout-SC-34` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC1-2` |
| `grade10-site-store-checkout-SC-35` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC3-1`, `grade10-site-store-checkout-US4-TC6-1` |
| `grade10-site-store-checkout-SC-36` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC4-1` |
| `grade10-site-store-checkout-SC-37` | Reconciled draft behavior | `grade10-site-store-checkout-US1-TC13-2`, `grade10-site-store-checkout-US1-TC26-1` |
| `grade10-site-store-checkout-SC-38` | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC4-1`, `grade10-site-store-checkout-US2-TC8-1` |
| SC-39 (dropped) | Reconciled draft behavior | `grade10-site-store-checkout-US2-TC11-1` |
| SC-40 (dropped) | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC7-1` |
| SC-41 (dropped) | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC11-1` |
| SC-42 (dropped) | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC1-1`, `grade10-site-store-checkout-US6-TC2-1` |
| SC-43 (dropped) | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC1-1` |
| SC-44 (dropped) | Out of suite / explicit verifier | Old/new codec plus engine dispatch counters, tasks7.1/9.1/9.4 |
| `grade10-site-store-checkout-SC-45` | Reconciled draft behavior | `grade10-site-store-checkout-US6-TC4-1` |
| SC-46 (dropped) | Out of suite / explicit verifier | Append US5 TC12; canonical port/drawer, tasks7.1/11.1/11.2 |
| `grade10-site-store-checkout-SC-47` | Reconciled draft behavior | `grade10-site-store-checkout-US3-TC2-3` |
| SC-48 (dropped) | Reconciled draft behavior | `grade10-site-store-checkout-US5-TC5-1`, `grade10-site-store-checkout-US5-TC6-1`, `grade10-site-store-checkout-US5-TC9-1` |
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
| SC-61 (dropped) | Folded blind zero-points handoff; wire partitions out of suite | `grade10-site-store-checkout-US1-TC1-2`; Group7 codec and legacy adapter tests under tasks7.1/7.4, verified by 7.3 |
| `grade10-site-store-checkout-SC-62` | Folded blind review-only cleanup and independent member-edit partitions; internal counters out of suite | `grade10-site-store-checkout-US3-TC2-3`, `grade10-site-store-checkout-US6-TC4-1`; Group10 member-edit/general-revision tests under tasks10.1/10.5/10.2 |

### Task Dispositions - 2026-10-08 (historical)

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
| 7.4 | Codec/legacy verifier for SC61 zero, omission, missing v2 choice and integer bounds; SC39 required per-line seen-price fields and bounds; fail before 7.2, verify in 7.3 |
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
| 10.5 | SC62 internal conversion guard regression; shop review changes general revision only, member edits/rebuilt cart remain protected; fail before 10.2 |
| 11.1 | Required current delivery work; tests precede implementation; focused verification retained; include SC46 refusal and adjacent wire/UI cases |
| 11.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 11.3 | Required current delivery work; tests precede implementation; focused verification retained |
| 11.4 | Required current delivery work; tests precede implementation; focused verification retained; two return surfaces and existing labels |
| 11.5 | Visible zero-points handoff, immutable price acknowledgement and review-only conversion tests before 11.3; supports US1 TC1, US2 TC11 and US3 TC2 without codec credit |
| 12.1 | Required current delivery work; tests precede implementation; focused verification retained |
| 12.2 | Required current delivery work; tests precede implementation; focused verification retained |
| 12.3 | Readiness/provider gate; explicit staging authority and observed evidence required |
| 12.4 | Readiness/provider gate; explicit staging authority and observed evidence required; retained SC07 hosted stock refusal required by task12.4 |
| 12.5 | Readiness/provider gate; explicit staging authority and observed evidence required |
| 13.1 | Real actor walk and evidence classification; no approved/actual cases during planning |
| 13.2 | Real actor walk and evidence classification; no approved/actual cases during planning |
| 13.3 | Real actor walk and evidence classification; no approved/actual cases during planning |

### UI Dispositions - 2026-10-08 (historical)

| UI State | Disposition / Cases |
| --- | --- |
| Opening/resumed | US1 TC1, US5 TC3; fresh current facts plus restored identity |
| Ready basket | US1 TC1/TC2; accepted tender including zero points and estimate; SC61 |
| Pending persistence/decision | US1 TC27, US2 TC6/TC9; readiness SC58/SC53 |
| Pending Pay | US5 TC1; synchronous and rendered guards, SC34 |
| Changed line/failed read | US2 TC1/TC2/TC4/TC9/TC11/TC13/TC14; Retry and no stale handoff |
| Verification required | US1 TC12/TC13/TC14/TC26/TC34; threshold partitions SC57 plus feedback SC37 |
| Hosted invoice ready | US1 TC1/TC33, US5 TC2/TC7; context-matching redirect and canonical payable URL only, binding ordering verifier |
| Settling/terminal | US5 TC5/TC6; existing labels; poll only moving states |
| Changed context/conflict | US6 TC3, US4 TC6, US5 TC11; Serves anchors reconciled |
| Recovery required | US5 TC9; support/known order; backend blockade and deadline verifier |
| Paid cart without later member edits | US3 TC2/TC13; authoritative empty/default tender including shop-review-only changes; SC62 |
| Paid older/rebuilt cart | US6 TC4; same variants/quantity and tender-only rows retained |
| Retired older invoice | US6 TC1/TC2; authoritative cancellation, durable due work |
| Signed out | US4 TC1/TC2/TC7; no public creation |
| Shopify confirmation | US3 TC4; Thank You and Order status, static Your Orders |
| Loading/error/empty orders | Existing OrderHistoryPage test verifier; US3 TC11 preserved; no invented order |

### Purchase Safety Case Handoff - 2026-10-10

- **Moved drafts** - Seven legacy backend cases (US1-TC3, TC4, TC5, TC8, TC9, TC10 and TC11) move as active drafts with retained IDs and traces. TC5 uses the published revision 1; its unaccepted revision 2 ignores an older invoice and is not restored. US5-TC2-1, US5-TC6-1, US5-TC8-1, US5-TC9-1, US5-TC10-1 and US6-TC1-1 live in `add-checkout-purchase-safety/specs/grade10-site/store/checkout/feature-tcs.md`. Their permanent IDs, revisions, coverage markers and journey traces are unchanged.
- **Acceptance** - Published US1-TC3, TC4, TC5, TC8, TC9 and TC10 remain active in the durable suite through the existing case merge. No deprecated override replaces them. The follow-up suite is not required to be accepted first.
- **History** - Earlier deprecation and journey-only coverage dispositions below are superseded by this handoff. Cases whose removed v2 behavior no longer exists remain deprecated.

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-store-checkout-US5-TC1-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US5-TC5-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US5-TC13-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US6-TC3-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US6-TC4-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US6-TC5-2` | to be walked with an unpaid hosted invoice beside a second Grade10 tab in the Group 13 walk and task 5.6; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC1-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC2-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC12-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC13-3` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC14-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC25-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC26-2` | to be walked in the Group 13 actor walk through the cart drawer with the case's mocked answer, once with the profile page enabled and once disabled; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC27-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC28-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC30-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC31-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC32-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC33-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC34-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US1-TC35-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC1-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC2-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC4-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC6-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC8-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC9-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC11-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC12-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC13-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US2-TC14-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC1-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC2-3` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC4-1` | to be walked on both Shopify confirmation surfaces in the authorized staging observation, task 5.6; planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC11-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC12-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC13-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC14-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US3-TC15-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US4-TC1-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US4-TC2-2` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US4-TC6-1` | to be walked in the Group 13 actor walk through the cart drawer and Your Orders with the case's mocked or delayed answer; planning grants no execution credit |
| `grade10-site-store-checkout-US4-TC7-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US4-TC8-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
| `grade10-site-store-checkout-US4-TC9-1` | to be walked in the Group 13 walk through the API and the order and cart reads; the existing backend tests linked by task 11.10 support it, and planning grants no execution credit |
