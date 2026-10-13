# grade10-site/store/checkout Test Cases

**Status:** pending-review · 0/13
**Drafts styled:** 2026-10-10, tcs-rules r4

## grade10-site-store-checkout-US1: Collector sends a current cart to hosted payment

**As a** signed-in collector,
**I want** to review my current cart and send its accepted tender to Shopify,
**so that** I pay for the lines and choices I just saw.

<!-- trace:case id=g10.store-checkout.TC-jze rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-1yv rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-w18 rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-3dr rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-jje rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

<!-- trace:case id=g10.store-checkout.TC-s9e rev=1 covers=g10.store-checkout.SC-a01,g10.store-checkout.SC-b02,g10.store-checkout.SC-e05,g10.store-checkout.SC-i09,g10.store-checkout.SC-j10,g10.store-checkout.SC-s19,g10.store-checkout.SC-k11,g10.store-checkout.SC-t20,g10.store-checkout.SC-u21,g10.store-checkout.SC-q17,g10.store-checkout.SC-r18,g10.store-checkout.SC-vsd,g10.store-checkout.SC-5x2,g10.store-checkout.SC-cc7 -->
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

## grade10-site-store-checkout-US7: Collector starts one payment at a time

**As a** signed-in collector who presses Pay again or changes the cart while a payment is starting,
**I want** the drawer to accept one Pay at a time and open only the answer for my current cart,
**so that** I do not leave for a payment I did not mean to start.

<!-- trace:case id=g10.store-checkout.TC-a8o rev=1 covers=g10.store-checkout.SC-i09 -->
### grade10-site-store-checkout-US7-TC2-1: Repeated Pay resumes the saved invoice after current review

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
* **Trace:** grade10-site-store-checkout-US-07

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

<!-- trace:case id=g10.store-checkout.TC-cvz rev=1 covers=g10.store-checkout.SC-s19 -->
### grade10-site-store-checkout-US7-TC6-1: Terminal replay retains the existing purchase outcome

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
* **Trace:** grade10-site-store-checkout-US-07

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

<!-- trace:case id=g10.store-checkout.TC-q5v rev=1 covers=g10.store-checkout.SC-t20 -->
### grade10-site-store-checkout-US7-TC8-1: Interruption before payment dispatch permits safe recovery

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
* **Trace:** grade10-site-store-checkout-US-07

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

<!-- trace:case id=g10.store-checkout.TC-8c2 rev=1 covers=g10.store-checkout.SC-u21 -->
### grade10-site-store-checkout-US7-TC9-1: Ambiguous dispatch blocks another invoice until recovery

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
* **Trace:** grade10-site-store-checkout-US-07

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
### grade10-site-store-checkout-US7-TC10-1: Response loss at Shopify recovers one existing invoice

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
* **Trace:** grade10-site-store-checkout-US-07

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

## grade10-site-store-checkout-US8: Collector keeps the cart built after Pay

**As a** signed-in collector who changes the cart or tender after starting payment,
**I want** my later cart and choices kept when the earlier payment settles,
**so that** a delayed purchase cannot remove my later choices.

<!-- trace:case id=g10.store-checkout.TC-ec6 rev=1 covers=g10.store-checkout.SC-k11 -->
### grade10-site-store-checkout-US8-TC1-1: Persisted edits retire the older unpaid invoice

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
* **Trace:** grade10-site-store-checkout-US-08

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

## Reconciliation

- **Handoff** - The owner requested these backend purchase-safety cases as active drafts. Six scenario-specific cases and seven legacy backend cases move together. Their IDs, revisions, scenario coverage markers, journey traces and expected results are preserved from add-shopify-checkout-integration, except US1-TC5-1, which is retained verbatim from the published durable suite. The unaccepted US1-TC5-2 tested ignoring an older invoice and is not restored as a safety case. No case is approved or executed.
- **Deferred planning** - Backend design, delivery order and owner remain awaiting artifacts under Q2. The handoff chooses none of them.
- **Durable contract** - The seven legacy cases keep their existing broad coverage markers; the six scenario-specific cases assert the six retained safety outcomes. The delta carries the published safe-repeat requirement without changing its text or scenario identities. Backend design, tasks and further requirement refinements remain pending.
- **Acceptance order** - Frontend acceptance keeps the existing durable safety cases by omitting their deprecation overrides. Later acceptance of this suite merges the moved drafts by case ID and keeps those durable cases. No acceptance order may retire unchanged safety assertions.

| Scenario | Active draft |
| --- | --- |
| grade10-site-store-checkout-SC-09 | `grade10-site-store-checkout-US7-TC2-1` |
| grade10-site-store-checkout-SC-10 | `grade10-site-store-checkout-US7-TC10-1` |
| grade10-site-store-checkout-SC-11 | `grade10-site-store-checkout-US8-TC1-1` |
| grade10-site-store-checkout-SC-19 | `grade10-site-store-checkout-US7-TC6-1` |
| grade10-site-store-checkout-SC-20 | `grade10-site-store-checkout-US7-TC8-1` |
| grade10-site-store-checkout-SC-21 | `grade10-site-store-checkout-US7-TC9-1` |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-store-checkout-US7-TC2-1` | To be walked through the checkout and provider test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US7-TC6-1` | To be walked through the checkout and provider test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US7-TC8-1` | To be walked through the checkout and provider test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US7-TC9-1` | To be walked through the checkout and provider test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US7-TC10-1` | To be walked through the checkout and provider test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US8-TC1-1` | To be walked through the checkout and provider test harness after backend design and implementation; no execution credit |

| `grade10-site-store-checkout-US1-TC3-1` | To be walked through the checkout test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US1-TC4-1` | To be walked through the checkout test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US1-TC5-1` | To be walked through the checkout test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US1-TC8-1` | To be walked through the checkout test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US1-TC9-1` | To be walked through the checkout test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US1-TC10-1` | To be walked through the checkout test harness after backend design and implementation; no execution credit |
| `grade10-site-store-checkout-US1-TC11-1` | To be walked through the checkout test harness after backend design and implementation; no execution credit |
