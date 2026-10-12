# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/7
**Drafts styled:** 2026-10-13, tcs-rules r5

## g10.shared-store-cart.US19: Shopper waits before another drawer action

**As a** shopper whose drawer is waiting for an answer,
**I want** the item controls, tender controls and navigation actions to wait together,
**so that** no remaining control can start a conflicting action.

<!-- trace:case id=g10.shared-store-cart.TC-cxw rev=1 -->
### shared-ui-store-cart-US18-TC1-1: Pending tender blocks every entry point

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-store-cart.US19

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with draft points 120, accepted total and selected code. Exercise both applied and unapplied points and an already-open promo sheet. Set tenderPending true and attempt click and Enter on every tender action and Checkout.

**Expected Results:**

* Points and promo inputs, Apply, Use max, both Remove actions, held-code selection and Checkout are disabled and invoke no callbacks. Accepted figures and draft 120 persist.

<!-- trace:case id=g10.shared-store-cart.TC-ja3 rev=1 -->
### g10.shared-store-cart.US19-TC1: Pending blocks item, tender and navigation controls

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-store-cart.US19

**Test data:**

| Field | Value |
| --- | --- |
| drawer | Controlled shared drawer with an active line, editable quantity, accepted figures, points draft and selected promo code; each listed callback supplied and recorded |
| points_state | Applied points with Remove; unapplied points with Apply and Use max, run separately |
| item_actions | Quantity decrease, quantity increase, line removal and product link |
| tender_actions | Existing points input, points disclosure, Apply, Use max, points Remove, promo disclosure and selected-code Remove |
| navigation_actions | Existing account or loyalty link and Checkout |

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<drawer>` is open with the consumer pending input false.
* Each action is otherwise available in its `<points_state>` row.

**Steps:**

1. Record the visible accepted figures and entered points.
2. Set the consumer pending input true.
3. Attempt each listed action with the pointer.
4. Attempt each listed action with the keyboard.
5. Inspect the displayed values and callback record.

**Expected Results:**

* Item, tender and navigation actions are disabled while pending.
* The points input cannot change its entered value.
* Quantity, selected code and accepted figures remain unchanged.
* No listed action invokes its callback.
* Disclosures remain closed; links and Checkout start no navigation.

<!-- trace:case id=g10.shared-store-cart.TC-cpt rev=1 -->
### g10.shared-store-cart.US19-TC2: Pending protects editing in an open promo sheet

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-store-cart.US19

**Test data:**

| Field | Value |
| promo_sheet | Existing open promo sheet with an entered code, eligible held codes and enough content to scroll; supplied callbacks recorded |
| sheet_actions | Promo input, typed-code Apply and held-code selection |
| dismissal | Sheet Close, sheet backdrop click and Escape, run separately |

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<promo_sheet>` is open with the consumer pending input false.
* Each `<sheet_actions>` control is otherwise available.

**Steps:**

1. Record the entered code and accepted drawer figures.
2. Set the consumer pending input true.
3. Attempt each sheet action with the pointer.
4. Attempt each sheet action with the keyboard.
5. Scroll the sheet content.
6. Use `<dismissal>`.

**Expected Results:**

* The promo input cannot change its entered code.
* Apply and held-code selection remain disabled.
* No sheet action invokes its callback.
* Entered code and accepted figures remain unchanged.
* The sheet content scrolls while pending.
* Each dismissal route closes the existing sheet.

<!-- trace:case id=g10.shared-store-cart.TC-d72 rev=1 -->
### g10.shared-store-cart.US19-TC3: Pending allows reading, scrolling and drawer dismissal

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-store-cart.US19, shared-ui-store-cart-US-04

**Test data:**

| Field | Value |
| drawer | Open shared drawer with accepted cart content exceeding its viewport and recorded action and dismissal callbacks |
| dismissal | Drawer Close, drawer backdrop click and Escape, run separately |

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<drawer>` has its consumer pending input true.

**Steps:**

1. Read the visible cart content.
2. Scroll the drawer to its remaining lines.
3. Use `<dismissal>`.
4. Inspect the dismissal and action callback records.

**Expected Results:**

* Accepted cart content remains readable while pending.
* The drawer content scrolls while pending.
* Each dismissal route closes the drawer.
* Dismissal invokes its callback once.
* No item, tender or navigation callback runs through dismissal.

## g10.shared-store-cart.US20: Shopper resumes after the drawer receives an answer

**As a** shopper whose drawer is no longer waiting,
**I want** only currently available actions to return without repeating an earlier action,
**so that** I decide what happens next from the accepted cart or its failure feedback.

<!-- trace:case id=g10.shared-store-cart.TC-sxg rev=1 -->
### shared-ui-store-cart-US18-TC2-1: Clearing pending restores guarded availability

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-store-cart.US20

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Clear tenderPending on the same surfaces and attempt actions with supplied or absent callbacks, invalid code and zero input.

**Expected Results:**

* Clearing itself invokes no callbacks. Existing callback-presence and validation constraints still apply. Available actions work; draft and accepted figures stay unchanged.

<!-- trace:case id=g10.shared-store-cart.TC-swe rev=1 -->
### shared-ui-store-cart-US18-TC3-1: Omitting pending preserves consumer behavior

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-store-cart.US20

**Test data:**

| Field | Value |
| pending_inputs | Consumer pending input omitted and tenderPending omitted; consumer pending input false and tenderPending false, run separately |
| interactive | Full drawer and standalone footer with their existing action callbacks supplied |
| existing_guards | Read-only, verifying, redirecting, loading and checkoutDisabled states, run separately on the applicable existing surface |

**Pre-conditions:**

* The tester is on the existing shared consumer fixtures.
* The consumer supplies its existing drawer content and optional callbacks.

**Steps:**

1. Open each `<interactive>` surface with `<pending_inputs>`.
2. Inspect its existing appearance and available controls.
3. Activate available item, tender and navigation actions separately.
4. Inspect callback counts after each activation.
5. Open each surface with its applicable `<existing_guards>`.
6. Attempt its guarded controls by pointer and keyboard.

**Expected Results:**

* Existing appearance and availability remain.
* Available item, tender and navigation actions invoke their callbacks once.
* Explicit false overrides none of the existing disabled reasons.
* Existing guarded controls remain unavailable and invoke no callbacks.
<!-- trace:case id=g10.shared-store-cart.TC-wru rev=1 -->
### g10.shared-store-cart.US20-TC1: Clearing pending restores only currently permitted actions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.shared-store-cart.US20

**Test data:**

| Field | Value |
| drawer | Controlled shared drawer with accepted figures, entered values and recorded callbacks |
| available | Supplied item, tender and navigation callbacks; editable quantity and valid tender inputs |
| quantity_limit | An active line at its consumer-supplied maximum; decrease permitted |
| unavailable_action | Missing action callback, invalid promo code, zero points, or existing loading, verifying, redirecting or checkout-disabled state; run each relevant control separately |
| legacy_pending | Existing tenderPending true when the consumer pending input clears |

**Pre-conditions:**

* The tester is on the shared drawer fixture.
* `<drawer>` is open with the consumer pending input true.
* The consumer supplies the current availability in each test-data row.

**Steps:**

1. Record accepted figures, entered values and callback counts.
2. Set the consumer pending input false.
3. Inspect values, callbacks and action availability.
4. Attempt the row's blocked actions by pointer and keyboard.
5. Activate each currently permitted action separately.
6. Inspect callback counts after each activation.

**Expected Results:**

* Clearing pending invokes no action callback.
* Accepted figures and entered values persist until explicit interaction.
* Each `<unavailable_action>` remains unavailable and invokes no callback.
* At `<quantity_limit>`, increase stays disabled; decrease becomes available.
* With `<legacy_pending>`, tender actions and Checkout remain disabled.
* Each currently permitted action invokes its callback once when activated.

## Reconciliation

**Run:** 2026-09-22. The coordinator independently derived the three acceptance
cases from the approved pending-state brief, without reading this shared delta.
The spec worker independently wrote the requirement and scenarios. Earlier
independent points QA supplies the consumer pending-operation coverage.

- **Aligned** — disabled entry points, restored availability and omitted-state
  compatibility map to `shared-ui-store-cart-SC-37`,
  `shared-ui-store-cart-SC-38` and `shared-ui-store-cart-SC-39` respectively.
- **Strengthened** — the coordinator explicitly covered Enter, both points
  states, open promo sheet, standalone footer, and existing disabled reasons.
  These test existing guard semantics under the optional prop, adding no new
  product behavior.
- **Raised** — no unanswered product decision; this is a missing presentation
  prop for the approved pending behavior, with default-false compatibility.
