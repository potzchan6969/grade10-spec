# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-25, tcs-rules r1

## shared-auth-sign-in-US11: Collector is offered Google sign-in without opening the dialog

**As a** collector, signed out, on a brand that offers Google sign-in,
**I want** Google's own prompt to offer my account without me opening sign-in first,
**so that** I can sign in with a tap, and it never shows at the same time as a sign-in dialog I already opened.

### shared-auth-sign-in-US11-TC1-1: Signed-out visitor on a Google-enabled brand is shown the corner prompt unprompted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in.

**Steps:**

1. Navigate to a page of that brand, signed out, without opening sign-in.

**Expected Results:**

* Google's own corner prompt appears offering sign-in.
* No sign-in dialog is open.

### shared-auth-sign-in-US11-TC2-1: Brand without Google sign-in never shows the prompt

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that does not have Google sign-in.

**Steps:**

1. Navigate to a page of that brand, signed out.
2. Wait long enough for the prompt to have appeared on a Google-enabled brand.

**Expected Results:**

* No corner prompt appears.
* No Google sign-in control of any kind is shown.

### shared-auth-sign-in-US11-TC3-1: Signed-in collector never sees the prompt

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed in on `<brand>`.

**Test data:**

Runs once per row of **Test data**.

| `<brand>` | `<why chosen>` |
| --- | --- |
| A brand with Google sign-in | confirms the signed-in check withholds it, not just the brand rule |
| A brand without Google sign-in | confirms the brand rule alone already withholds it |

**Steps:**

1. Remain signed in on `<brand>`.
2. Wait long enough for the prompt to have appeared for a signed-out visitor.

**Expected Results:**

* No corner prompt appears on `<brand>`.

### shared-auth-sign-in-US11-TC4-1: Prompt does not appear while the sign-in dialog is already open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in, with the sign-in dialog open.

**Steps:**

1. Open the sign-in dialog.
2. Wait long enough for the prompt to have appeared had the dialog not been open.

**Expected Results:**

* No corner prompt appears while the dialog is open.
* The sign-in dialog remains the only sign-in ask on the page.

### shared-auth-sign-in-US11-TC5-1: Opening the sign-in dialog while the prompt is showing dismisses the prompt

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in, with the corner prompt already showing.

**Steps:**

1. Open the sign-in dialog.

**Expected Results:**

* The corner prompt is dismissed.
* Only the sign-in dialog remains as a sign-in ask.

### shared-auth-sign-in-US11-TC6-1: Completing the prompt signs the visitor in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* Google's own corner prompt is showing.

**Test data:**

Runs once per row of **Test data**.

| `<google account>` | `<outcome>` |
| --- | --- |
| A verified Google address with no account yet | an account is created for it and the collector is signed in as that account |
| A verified Google address with an account already created by an emailed sign-in link | the collector is signed in as that same account |
| A verified Google address with an account already created by the Google control | the collector is signed in as that same account |

**Steps:**

1. Complete the prompt's account chooser for `<google account>`.

**Expected Results:**

* The collector is signed in as `<outcome>` states.
* The corner prompt is gone.

### shared-auth-sign-in-US11-TC7-1: Prompt is offered on any page a signed-out collector visits, including checkout

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in.

**Test data:**

Runs once per row of **Test data**.

| `<page>` |
| --- |
| the brand home |
| a listing page |
| the checkout page |

**Steps:**

1. Navigate to `<page>`, signed out, without opening sign-in.

**Expected Results:**

* Google's own corner prompt appears on `<page>`.

### shared-auth-sign-in-US11-TC8-1: Ignoring the prompt leaves the page exactly as it was

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**
customer is signed out on a brand that has Google sign-in, with the corner prompt showing.

**Steps:**

1. Interact with the page underneath the prompt without tapping it or opening sign-in — scroll, and open a listing.
2. Read the page state.

**Expected Results:**

* The collector is not signed in.
* The interaction from step 1 completes exactly as it would with no prompt showing.
* No sign-in dialog opens.

### shared-auth-sign-in-US11-TC9-1: Declining the dialog suppresses the prompt for the rest of the visit

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* The corner prompt was showing, then opening the sign-in dialog dismissed it.

**Steps:**

1. Close the sign-in dialog without completing sign-in.
2. Navigate to another page of the same brand in the same visit.

**Expected Results:**

* The collector remains signed out.
* The corner prompt does not appear again on either page for the rest of the visit.

### shared-auth-sign-in-US11-TC10-1: Unverified Google account offered through the prompt does not sign in

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
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* The Google account chooser is stubbed to return `<unverified google email>` with its verified flag false.
* The corner prompt is showing.

**Steps:**

1. Complete the prompt's account chooser for `<unverified google email>`.

**Expected Results:**

* No account is created for `<unverified google email>`.
* The collector is not signed in.

### shared-auth-sign-in-US11-TC11-1: Prompt failing to initialize does not block the page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-11

**Pre-conditions:**

* customer is signed out on a brand that has Google sign-in.
* The browser or environment prevents Google's prompt from initializing (for example, third-party sign-in prompts are blocked).

**Steps:**

1. Navigate to a page of that brand, signed out.
2. Read the page state.

**Expected Results:**

* The page loads and behaves normally with no corner prompt shown.
* No error is shown to the collector.
* The sign-in dialog is still reachable and works as it always does.

## Settled

## Reconciliation

**Run:** the blind pass read `proposal.md`, `decisions.md`, this change's `user-journeys.md` and `spec.md` (the `## Feature set` delta only), the PRD's `Google One Tap` section and its `Product decisions` rows, the durable `user-journeys.md`, and this file's own header and classification conventions with `## Reconciliation` disregarded. It was denied every `spec.md`'s `## Requirements` section, anywhere, and everything under `openspec/changes/archive/`.

- **Raised, folded into spec** - the visible-on-arrival case (`TC1-1`), the brand-without-Google case (`TC2-1`), the dialog-suppresses-the-prompt case and its reverse (`TC4-1`, `TC5-1`), the completes-and-signs-in case (`TC6-1`), and the unverified-email case (`TC10-1`) all matched the independent scenario pass and are folded as `shared-auth-sign-in-SC-80` through `SC-85`. The suite pass also surfaced behaviour the scenario pass had not written: the signed-in visitor never sees it (`TC3-1`, folded as `SC-86`), every page including checkout (`TC7-1`, folded as `SC-87`), declining leaves the page unaffected (`TC8-1`, folded as `SC-88`), and a failed load keeps the page usable (`TC11-1`, folded as `SC-89`).
- **Raised, rejected** - an admin/operator case naming grade10-admin and zzz-admin sign-in: `decisions.md`'s Non-Goals already place admin and operator sign-in out of this change's scope, and this capability's delta does not wire the prompt into either admin app, so there is no requirement here for it to fail. Verified instead by the admin frontend package never invoking the prompt outside its rendered-button call.
- **Raised, escalated** - reappearance after a declined dialog (`TC9-1`): the interview had not settled whether declining suppresses the prompt for the rest of the visit or only the page it was dismissed on. Put to the author, decided as suppressed for the rest of the visit, and folded as `SC-90` (`decisions.md` Q5).
- **Uncovered anchors** - none; every scenario in this delta is reached by a case above.
