# shared/auth/sign-in Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-15, tcs-rules r3.0

## Background

* Every tab a case names is open in one browser on one device, unless the case names another device.
* A tab is returned to as the person left it, never reloaded.

## shared-auth-sign-in-US8: Collector follows the link and the tab that asked carries on

**As a** collector who asked for a sign-in link and followed it in another tab,
**I want** the tab I asked from to finish what it stopped me doing,
**so that** I am not sent back to press the same thing a second time.

### shared-auth-sign-in-US8-TC1-1: Asking tab closes the dialog and shows the collector signed in

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, with tab A on <grade10 store url> showing Check Your Email.
* Tab A is in the background.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in, unreloaded.
* The Check Your Email dialog is gone.

### shared-auth-sign-in-US8-TC2-1: Asking tab completes what the collector was refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <refused action>'s surface in tab A.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |
| `<lot>` | a live auction lot open to bid on |
| `<bid amount>` | the lowest bid the lot accepts |
| `<signed-in-only page>` | the collector's orders list, which only they may read |

| `<refused action>` | What must have happened |
| --- | --- |
| add <listing> to the cart | <listing> is in the collector's cart |
| bid <bid amount> on <lot> | the bid stands on <lot> |
| open <signed-in-only page> | tab A is on <signed-in-only page> |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.

**Expected Results:**

* <refused action> is done in tab A.
* The collector is not asked to do it again.

### shared-auth-sign-in-US8-TC3-1: Tab that asked for nothing completes no action

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, with tab A on <grade10 store url> showing Check Your Email.
* Tab C is open on <listing>, where nothing was asked for and nothing was refused.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab C.

**Expected Results:**

* Tab C shows the collector signed in.
* Tab C adds nothing to the cart and places no bid.

### shared-auth-sign-in-US8-TC4-1: Failed link follow leaves the asking tab as it was

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
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

| `<failed link>` | What it is |
| --- | --- |
| expired | a link older than sixty seconds |
| already used | a link followed once already |
| banned | a link for an account that is banned |

**Steps:**

1. Follow the <failed link> in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows nobody signed in.
* <listing> is in no cart.
* Tab A says nothing about the link.

### shared-auth-sign-in-US8-TC5-1: Asking tab moved on before the link was followed

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Dismiss the dialog in tab A and navigate to <grade10 store url>.
2. Follow the unused, unexpired link from that email in tab B.
3. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.
* The add is not carried out: dismissing the ask dropped it.
* The cart holds no line for <listing>.

### shared-auth-sign-in-US8-TC6-1: Refused action is done once, not twice

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A, and confirm <listing> is in the cart once.
3. Leave tab A and return to it again, without touching the add control.

**Expected Results:**

* The cart still holds one line for <listing>, not a doubled line.
* Returning a second time carries the add out no further times.

### shared-auth-sign-in-US8-TC7-1: Asking tab on another site of the brand carries on

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <lot> in tab A, refused the bid.
* Tab A shows Check Your Email after asking for a link at <collector email>.
* The link lands on <grade10 store url>, another site of the brand.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<lot>` | a live auction lot open to bid on |
| `<bid amount>` | the lowest bid the lot accepts |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in, unreloaded.
* The bid of <bid amount> stands on <lot>.

### shared-auth-sign-in-US8-TC8-1: Another brand's dialog does not close

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on both brands.
* Tab A is on <zzz store url> showing Check Your Email for a ZZZ link.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired Grade10 link in tab B.
2. Return to tab A.

**Expected Results:**

* Tab A still shows Check Your Email.
* Tab A shows nobody signed in.

### shared-auth-sign-in-US8-TC9-1: Two tabs asked for a link before either was followed

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, refused the add to the cart on <listing> in tab A.
* customer is refused the bid on <lot> in tab C.
* Both tabs show Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control |
| `<lot>` | a live auction lot open to bid on |

**Steps:**

1. Follow the newest link from that address in tab B.
2. Return to tab A, then to tab C.

**Expected Results:**

* Both tabs show the collector signed in.
* Tab A carries out its add and tab C carries out its bid: each surface that asked completes its own refusal, whether or not its own link was the one that worked.

### shared-auth-sign-in-US8-TC10-1: Refused action that can no longer be done is refused, not skipped

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out on <listing> in tab A, refused the add to the cart.
* Tab A shows Check Your Email after asking for a link at <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |
| `<listing>` | a card listing with an add-to-cart control, of which one remains |

**Steps:**

1. Sell the last <listing> so it can no longer be added.
2. Follow the unused, unexpired link from that email in tab B.
3. Return to tab A.

**Expected Results:**

* Tab A shows the collector signed in.
* Tab A reports the refusal an add is ordinarily refused with when the listing is gone.
* Tab A does not pass the add over in silence.

### shared-auth-sign-in-US8-TC11-1: Dialog on a tab that asked for nothing closes too

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
* **Trace:** shared-auth-sign-in-US-08

**Pre-conditions:**

* customer is signed out, with tabs A and C open on the same brand, each showing the sign-in dialog.
* A sign-in link was asked for in tab A only.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | collector@example.com, an address with an account |

**Steps:**

1. Follow the unused, unexpired link from that email in tab B.
2. Return to tab A, then to tab C.

**Expected Results:**

* Neither tab still shows the sign-in dialog.
* Both tabs show the collector signed in.

---

## Raised

* **Which asking tab carries on** — two tabs can each be showing Check Your Email for the same address, and only the newest link works. Nothing says whether the tab whose link died also completes what it was refused, or only the tab that asked last.
* **A refused action whose surface is gone** — the input says the tab completes the add, the bid or the navigation it was stopped before. Nothing says what happens when the collector dismissed the dialog or navigated away in that tab first, or how long the refused action is remembered.
* **Completing more than once** — nothing says the completion is done once. Two tabs holding the same refused add, or a person pressing the control again on their return, are both routes to a doubled cart line or a second bid.
* **A refused action that can no longer be done** — the lot closed, the listing sold out or the price moved while the collector was in their inbox. Nothing places that on either side: complete and fail, or do not attempt.
* **What the asking tab shows on a failed follow** — the input says the failure toasts on the brand home and is announced in no other tab. It does not say whether the asking tab keeps its dialog, keeps its Resend countdown, or returns to the email step.
* **A console tab that asked** — the operator console proves the second factor before it shows anything. Nothing says whether a refused action in a console tab is carried on afterwards.

## Reconciliation

**Run:** 2026-09-15 · two independent readings of the same anchors · the suite pass read no `## Requirements`, no `openspec/specs/` beyond Purpose and Feature set, and nothing under `openspec/changes/archive/`.

* **Raised, escalated → folded into spec** — *A refused action that can no longer be done*. Nobody had decided it. The author settled it: the action is attempted and refused the ordinary way, never passed over in silence. Folded as `shared-auth-sign-in-SC-56`; walked by `shared-auth-sign-in-US8-TC10-1`, added by this reconciliation.
* **Raised, escalated → folded into spec** — *Completing more than once*. Nobody had decided it. Settled as at most once per refusal per surface, and folded as `shared-auth-sign-in-SC-57`. `US8-TC6-1` was rewritten: it had tested the person pressing add again themselves, which is an ordinary add and must increment the cart, so as written it would have failed a correct implementation.
* **Raised, escalated → folded into spec** — *Which asking tab carries on*. Settled as each surface that asked completing its own refusal, whether or not its own link was the one that worked. `US8-TC9-1` gained that expectation; no new scenario, as `SC-52` and `SC-57` together decide it.
* **Raised, rejected** — *A refused action whose surface is gone*. Not undecided: `shared/auth/sign-in`'s durable overlay contract already drops what was refused when the collector dismisses the ask, because they said no to the thing and not only to the dialog. `US8-TC5-1` was unblocked and given that expectation rather than a new scenario.
* **Raised, rejected** — *What the asking tab shows on a failed follow*. Both readings independently reached the same answer — the dialog stays and nothing is announced — so nothing was undecided. Stated by `shared-auth-sign-in-SC-55` and walked by `US8-TC4-1`.
* **Raised, out of scope** — *A console tab that asked*. Whether a console carries on a refused action after its second factor belongs to the console's own capability, which specifies no second factor at all today. Recorded as a non-goal on the proposal rather than specified here with nowhere to fold.
* **Uncovered anchors** — none. Every scenario this change adds to `shared/auth/sign-in` is walked by at least one case, `SC-51` by `US8-TC11-1` and `SC-56` by `US8-TC10-1`, both added here.
* **Contradicted** — none.
