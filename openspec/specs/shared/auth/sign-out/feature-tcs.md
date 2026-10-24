# shared/auth/sign-out Test Cases

**Status:** pending-review · 0/4
**Reviewed:** 2026-09-23, tcs-rules r3.0, lapsed 2026-10-06
**Drafts styled:** 2026-10-24, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.

## Walk 1: An operator signs out of each side in turn

**Starting state:**

- staff(operator) signed in on `<console url>` in tab A, with the second factor proved, and on `<g10url>` in tab B, with `<cart item>` in the cart

**Shared test data:**

| Field | Value |
| --- | --- |
| `<cart item>` | a card in the operator's cart |

### Route

1. In tab A, select sign out and wait for it to finish.
   - The console shows its sign-in page `shared.auth-sign-out.US1-TC2`
2. Return to tab B.
   - Tab B is still signed in, with `<cart item>` in the cart and no signed-out message `shared.auth-sign-out.US3-TC1`
3. In tab B, open the profile and select sign out.
   - The site shows the marketing page `shared.auth-sign-out.US1-TC2`

## shared.auth-sign-out.US1: Collector or operator signs out and lands signed out

**As a** signed-in person,
**I want** the control to show the request in flight and, on success, leave the signed-in surface,
**so that** I know the tap registered and I am not still looking at my account.

<!-- trace:case id=g10.shared-sign-out.TC-lsq rev=2 -->
### shared.auth-sign-out.US1-TC1: The sign-out control is busy until the request finishes

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-out-US-01

**Pre-conditions:**

* The row's person is signed in on the row's page.
* The sign-out request is held in flight.

**Test data:**

| Person | Page |
| --- | --- |
| customer(collector) | `<g10url>/profile` |
| admin | `<console url>`, with the second factor proved |

**Steps:**

1. Open the row's page and select sign out.
2. Select sign out again while the request is still running.

**Expected Results:**

* Step 1: the control shows it is busy until the request finishes.
* Step 2: no second request starts.

<!-- trace:case id=g10.shared-sign-out.TC-p3n rev=2 -->
### shared.auth-sign-out.US1-TC2: A confirmed sign-out leaves the signed-in page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-01

**Pre-conditions:**

* The row's person is signed in on the row's page.

**Test data:**

| Person | Page | Afterwards |
| --- | --- | --- |
| customer(collector) | `<g10url>/profile` | the marketing page |
| admin | `<console url>` | the console's sign-in page |

**Steps:**

1. Open the row's page, select sign out and wait for it to finish.
2. Reload the page.

**Expected Results:**

* Step 1: the row's page shows.
* Step 2: still the row's page; nobody is signed in.

---

## shared.auth-sign-out.US2: Collector or operator retries a refused sign-out

**As a** signed-in person,
**I want** a refused sign-out named as a failure I can retry,
**so that** a network miss does not leave me signed in with no explanation.

<!-- trace:case id=g10.shared-sign-out.TC-d61 rev=2 -->
### shared.auth-sign-out.US2-TC1: A refused sign-out is reported, and a retry clears it and signs out

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sign-out-US-02

**Pre-conditions:**

* The row's person is signed in on the row's page.
* The first sign-out request is made to fail; the next one succeeds.

**Test data:**

| Person | Page | After the retry |
| --- | --- | --- |
| customer(collector) | `<g10url>/profile` | the marketing page |
| admin | `<console url>` | the console's sign-in page |

**Steps:**

1. Open the row's page and select sign out.
2. Select sign out again.

**Expected Results:**

* Step 1: still signed in, with a failure message beside the sign-out control.
* Step 2: the failure message clears, then the row's page shows.

---

## shared.auth-sign-out.US3: Operator signs out of the console and stays signed in on the site

**As an** operator,
**I want** signing out of one surface to end that surface's session only,
**so that** I do not lose my cart or watchlist by closing the console, nor leave the console open by leaving the site.

<!-- trace:case id=g10.shared-sign-out.TC-vnx rev=2 -->
### shared.auth-sign-out.US3-TC1: Signing out of one side leaves the other signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sign-out-US-03

**Pre-conditions:**

* staff(operator) is signed in on `<console url>` with the second factor proved, and on `<g10url>` as `<site account>` with `<cart item>` in the cart, each in its own tab.

**Test data:**

| Field | Value |
| --- | --- |
| `<site account>` | the operator's own account, or another account |
| `<cart item>` | a card in `<site account>`'s cart |

| Signed out of | The other tab |
| --- | --- |
| the console | the site, still `<site account>`, `<cart item>` in the cart |
| the site | the console, still the operator |

**Steps:**

1. In the row's tab, select sign out and wait for it to finish.
2. Return to the other tab without reloading it, then reload it.

**Expected Results:**

* Step 2: the other tab shows the row's outcome both times, with no signed-out message.

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
