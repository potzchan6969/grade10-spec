# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/3
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## shared-ui-store-cart-US18: Shopper waits for an accepted tender choice

**As a** shopper,
**I want** accepted figures held while tender finishes,
**so that** I cannot submit conflicting changes or continue unresolved.

<!-- trace:case id=g10.shared-store-cart.TC-cxw rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
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
* **Trace:** shared-ui-store-cart-US-18

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with draft points 120, accepted total and selected code. Exercise both applied and unapplied points and an already-open promo sheet. Set tenderPending true and attempt click and Enter on every tender action and Checkout.

**Expected Results:**

* Points and promo inputs, Apply, Use max, both Remove actions, held-code selection and Checkout are disabled and invoke no callbacks. Accepted figures and draft 120 persist.

<!-- trace:case id=g10.shared-store-cart.TC-sxg rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
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
* **Trace:** shared-ui-store-cart-US-18

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Clear tenderPending on the same surfaces and attempt actions with supplied or absent callbacks, invalid code and zero input.

**Expected Results:**

* Clearing itself invokes no callbacks. Existing callback-presence and validation constraints still apply. Available actions work; draft and accepted figures stay unchanged.

<!-- trace:case id=g10.shared-store-cart.TC-swe rev=1 covers=g10.shared-store-cart.SC-9yi,g10.shared-store-cart.SC-nty,g10.shared-store-cart.SC-x24 -->
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
* **Trace:** shared-ui-store-cart-US-18

**Pre-conditions:**

* A consumer supplies the existing drawer content and optional action callbacks.

**Steps:**

1. Open the full-drawer and standalone-footer stories with tenderPending omitted and false, in interactive, read-only, verifying, redirecting, loading and checkoutDisabled states.

**Expected Results:**

* Existing appearance and availability remain. Explicit false overrides none of the existing disabled reasons.

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
