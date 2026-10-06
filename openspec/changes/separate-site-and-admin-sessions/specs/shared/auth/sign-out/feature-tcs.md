# shared/auth/sign-out Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-auth-sign-out-US1: Collector or operator signs out and lands signed out

**As a** signed-in person,
**I want** the control to show the request in flight and, on success, leave the signed-in surface,
**so that** I know the tap registered and I am not still looking at my account.

### shared-auth-sign-out-US1-TC4-1: Console sign-out control is busy until the request settles

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-out-US-01

**Pre-conditions:**

* admin is signed in on <grade10 admin console url> with the second factor proved.
* Network manipulation holds the sign-out request in flight.

**Steps:**

1. Navigate to <grade10 admin console url>.
2. Activate the sign-out control.
3. Activate the sign-out control again while the request is still running.

**Expected Results:**

* The control shows a busy state until the auth service answers.
* The second activation starts no second request.

---

## shared-auth-sign-out-US3: Operator signs out of the console and stays signed in on the site

**As an** operator,
**I want** signing out of one surface to end that surface's session only,
**so that** I do not lose my cart or watchlist by closing the console, nor leave the console open by leaving the site.

### shared-auth-sign-out-US3-TC1-1: Console sign-out leaves the site session and the console stays out

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
* **Trace:** shared-auth-sign-out-US-03

**Pre-conditions:**

* <operator account> is signed in on <grade10 admin console url> in tab A, with the second factor proved.
* <site account> is signed in on <grade10 store url> in tab B, with <cart item> in its cart.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding console access |
| `<site account>` | <operator account>, or a different account |
| `<cart item>` | A card in <site account>'s cart |

**Steps:**

1. In tab A, activate the sign-out control and wait for the auth service to confirm.
2. Reload tab A.
3. Return to tab B.

**Expected Results:**

* Step 1 shows the console's sign-in page.
* Step 2 still shows the console's sign-in page.
* Tab B still names <site account>, with <cart item> in its cart.
* Tab B shows no signed-out message.

### shared-auth-sign-out-US3-TC2-1: Site sign-out leaves the console session open

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
* **Trace:** shared-auth-sign-out-US-03

**Pre-conditions:**

* <operator account> is signed in on <grade10 store url> in tab A.
* <operator account> is signed in on <grade10 admin console url> in tab B, with the second factor proved.

**Test data:**

| Field | Value |
| --- | --- |
| `<operator account>` | An account holding console access |

**Steps:**

1. In tab A, activate the sign-out control and wait for the auth service to confirm.
2. Return to tab B without reloading it.
3. Reload tab B.

**Expected Results:**

* Step 1 shows the site returned to marketing.
* Step 2 shows the console open as <operator account>, with no signed-out message.
* Step 3 still shows the console open as <operator account>.

---

## Settled

* A console sign-out leaves the site's cart alone: the cart is emptied by the surface that signed out, and only on its own confirmed sign-out, so the site's session and cart are as they were.
* A site sign-out leaves a console tab showing the console until it reads its own session; a tab follows its own surface's session and no other (decisions Q11).

## Reconciliation

**Run:** QA2, 2026-10-06, in a fresh context. QA1's blind pass read the Purpose and Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` (its `## Raised` was empty), the Sign-Out page, the durable suite for id continuity and `shared/auth/domain-tcs.md`, and was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read both readings, `decisions.md`, `tech-design.md`, `tasks.md`, the delta and the durable suite. It is a statement, not proof. No case of this change has been accepted or published, so a draft keeps its `<v>` when it is reworded.

- **Agreed** - `shared-auth-sign-out-US3-TC1-1` with `shared-auth-sign-out-SC-06`; `shared-auth-sign-out-US3-TC2-1` with `shared-auth-sign-out-SC-07`; `shared-auth-sign-out-US1-TC4-1` with the durable busy-control rule the delta keeps, read on the console, whose `shared-auth-sign-out-SC-02` it shares a surface with
- **Adjusted, by QA2** - `shared-auth-sign-out-US3-TC1-1` and `shared-auth-sign-out-US3-TC2-1` each gained the assertion that the other tab raises no signed-out message, which decisions Q11 settles and `shared-auth-session-US7-TC7-1`'s reconciliation had already placed here
- **Raised, folded into spec** - none: every case asserts what `shared-auth-sign-out-SC-06`, `shared-auth-sign-out-SC-07` or the retained requirement states
- **Raised, rejected** - none
- **Raised, settled by the artifacts** - whether a console sign-out empties the site's cart, and whether a site tab reacts to a console sign-out (the requirement's surface-owned cleanup, and decisions Q11). Both are in `## Settled`; none goes to `decisions.md`
- **Raised, escalated** - none
- **Left to the durable cases** - `shared-auth-sign-out-SC-02` and `shared-auth-sign-out-SC-03`, whose wording only gained the session of the surface it was made on: `US1-TC1-1` to `US1-TC3-1` still verify them and are left as they are; the refused sign-out of `US2-TC1-1` and `US2-TC2-1`, which the delta does not touch
- **Covered at domain** - a site sign-out clearing the collector is walked by `shared-auth-e2e-US1-TC1-1`, which still holds; one surface signed out while the other stays signed in is walked by the draft domain case `shared-auth-e2e-US8-TC1-1` in this change's `domain-tcs.md`, step 5
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-auth-sign-out-US-03` has `US3-TC1-1` and `US3-TC2-1`; `shared-auth-sign-out-US-01` has `US1-TC4-1` beside the durable `US1-TC1-1` to `US1-TC3-1`; `shared-auth-sign-out-SC-06` and `shared-auth-sign-out-SC-07` are reached
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk
