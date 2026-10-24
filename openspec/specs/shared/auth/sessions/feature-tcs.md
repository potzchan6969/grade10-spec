# shared/auth/sessions Test Cases

**Status:** pending-review · 0/6
**Drafts styled:** 2026-10-24, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.
* An account's sessions are on its Sessions page in the console, opened by user id.

## Walk 1: An admin reads and ends one account's sessions

**Starting state:**

- admin(holds session:list and session:revoke) on `<subject account>`'s Sessions page; `<subject account>` signed in on `<g10url>` in tab A and on `<console url>` in tab B, with the second factor proved

**Shared test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | an account holding console access |

### Route

1. Read the list.
   - Each session names its surface, with no secret shown `shared.auth-sessions.US3-TC1`
2. Revoke the console session, wait 70 seconds, then look at tabs A and B.
   - Tab B is signed out; tab A is still signed in `shared.auth-sessions.US2-TC1`
3. Revoke every session, wait 70 seconds, then look at tab A.
   - Tab A is signed out too `shared.auth-sessions.US4-TC1`

## shared.auth-sessions.US1: Operator lists a person's sessions

**As an** operator who can list sessions,
**I want** to see one account's sessions without their secrets,
**so that** I can tell which device is signed in without becoming that person.

<!-- trace:case id=g10.shared-sessions.TC-jes rev=1 -->
### shared.auth-sessions.US1-TC1: An operator with the list grant sees one account's sessions, never their secrets

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-01

**Pre-conditions:**

* staff(holds session:list) is signed in on `<console url>`.
* `<subject account>` is signed in on two devices.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | an account with no `admin` role |

**Steps:**

1. Open `<subject account>`'s Sessions page.

**Expected Results:**

* Two sessions are listed, and no session secret or token is shown.

<!-- trace:case id=g10.shared-sessions.TC-7dr rev=2 -->
### shared.auth-sessions.US1-TC2: An operator who may not list an account's sessions sees none

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-01

**Pre-conditions:**

* The row's operator is signed in on `<console url>`.
* The row's account has a live session.

**Test data:**

| Operator | Account |
| --- | --- |
| staff without `session:list` | an account with no `admin` role |
| support | an account holding `admin` |

**Steps:**

1. Open the row's account's Sessions page.

**Expected Results:**

* No session is listed, and the console says the operator may not see them.

---

## shared.auth-sessions.US2: Operator ends a session

**As an** operator who can revoke,
**I want** to end one session or every session of an account,
**so that** a stolen device is signed out, including my own if I revoke the current one.

<!-- trace:case id=g10.shared-sessions.TC-ffj rev=2 -->
### shared.auth-sessions.US2-TC1: A revoked session is signed out within 70 seconds, and no other session is

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**

* admin(holds session:list and session:revoke) is signed in on `<console url>`.
* The row's sessions are open, each in its own tab, and each tab has just been opened, so its signed-in state is fresh.

**Test data:**

| Sessions | Revoked | Afterwards |
| --- | --- | --- |
| `<subject account>` on `<g10url>` on two devices | the first device's | the first signed out; the second still signed in |
| `<subject account>` on `<g10url>` and on `<console url>` | the site's | the site signed out; the console still signed in |
| `<subject account>` on `<g10url>` and on `<console url>` | the console's | the console signed out; the site still signed in |
| the admin's own, on `<console url>` | the one in use | the admin signed out of the console |

**Steps:**

1. Open the Sessions page of the row's account and revoke the row's session.
2. Wait 70 seconds, then open a page in each tab.

**Expected Results:**

* Step 2: the row's outcome.

<!-- trace:case id=g10.shared-sessions.TC-eau rev=2 -->
### shared.auth-sessions.US2-TC2: An operator who may not revoke a session is offered no revoke

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**

* The row's operator is signed in on `<console url>`.
* The row's account is signed in on `<g10url>` in another tab.

**Test data:**

| Operator | Account |
| --- | --- |
| staff holding `session:list` without `session:revoke` | an account with no `admin` role |
| support | an account holding `admin` |

**Steps:**

1. Open the row's account's Sessions page.
2. Wait 70 seconds, then open a page in the account's tab.

**Expected Results:**

* Step 1: no revoke control is offered.
* Step 2: the account is still signed in.

---

## shared.auth-sessions.US3: Operator tells a console session from a site session

**As an** operator,
**I want** each listed session to say whether it is the site's or the console's,
**so that** I know what I am ending before I end it.

### shared.auth-sessions.US3-TC1: Each listed session says whether it is the site's or the console's

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sessions-US-03

**Pre-conditions:**

* admin(holds session:list) is signed in on `<console url>`.
* The row's account holds the row's sessions.

**Test data:**

| Account | Sessions | Listed |
| --- | --- | --- |
| `<subject account>` | the site on a desktop, the console on the same desktop, the site on a phone | two site sessions and one console session |
| `<subject account>` | the console only | one console session |
| the admin's own | the console in use and the site | one console session and one site session |
| an account with a session made before release | that session | one site session |

**Steps:**

1. Open the row's account's Sessions page.

**Expected Results:**

* The row's list, each session named as the site's or the console's, with no secret shown.

---

## shared.auth-sessions.US4: Operator ends every session of an account on both surfaces

**As an** operator,
**I want** ending every session of an account to close its site and console sessions together,
**so that** a person I have cut off keeps no live console session.

### shared.auth-sessions.US4-TC1: Ending every session, or a ban, signs the account out of the site and the console

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-04

**Pre-conditions:**

* admin(holds session:revoke and user:ban) is signed in on `<console url>`.
* `<subject account>` is not banned, and is signed in on `<g10url>` in tab A and on `<console url>` in tab B, with the second factor proved.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | an account holding console access |

| Action |
| --- |
| revoke every session on `<subject account>`'s Sessions page |
| ban `<subject account>` from the user directory, reason `Chargeback dispute open` |

**Steps:**

1. Do the row's action.
2. Wait 70 seconds, then open a page in tab A and in tab B.

**Expected Results:**

* Step 1 is accepted.
* Step 2: tab A is signed out, and tab B shows the console's sign-in page.

## Settled

- A read already in flight when a revoke commits needs no rule of its own - the requirement is a 70-second bound, and such a read falls inside it.
- Which endpoints are cached browse reads and which are elevated calls is the implementation's mapping, not a suite question.
- Per-session versus per-account cache-version keying changes no case's expected result - a sibling session is still valid either way.
* A session an operator held before release lists as a site session, and the account's other sessions are listed as they were: a session with no surface reads as the site (`shared-auth-session-SC-38`).
* A revoke of one session or of every session closes within the same 70-second bound on both surfaces: one per-account version token covers both, so no surface has a bound of its own.

## Reconciliation

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, decisions.md (Raised included), the linked Sessions · Revoke PRD section, this suite for id continuity, and `shared/auth/domain-tcs.md` for id continuity, all with Reconciliation/Requirements stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose, Feature set and the domain suite, openspec/changes/archive/.

**Raised, folded into spec**

- The in-flight-read boundary - first folded in as "the next read that starts after the revoke", then replaced by the 70-second bound.

**Raised, rejected**

- Which endpoints count as cached versus elevated — tech-design's job, not a suite question.
- Per-session versus per-user invalidation keying — does not change any case's observable expected result.

**Raised, landed as decisions**

- The in-flight-read boundary - `close-revoked-session-cache-gap` decisions.md Q4, superseded by Q5.

**Uncovered anchors**

- Cross-account isolation (an admin action on one account must not touch another account's cache) is not observable through a black-box signed-in/not-signed-in read. **Out of suite:** the per-user cache-version helper's own unit test in grade10.
- The 70-second bound at a location other than the one the revoke was made at is not observable on a single-location stack, where the revoke reaches the next read at once. **Out of suite:** grade10's cache-version settling-window unit test and the auth worker's before/after-race regression test.
- All other scenarios under Revoke / US-02, the 70-second closing included, are covered by `US2-TC1-1` through `US2-TC7-1` above.

**Verdicts (@sean, quick pass in chat, not a full `/tcs-review`)**

- `US2-TC6-1` — Approved (`actual`).
- `US2-TC7-1` — Retired (`deprecated`): its title claimed a caller without the revoke grant, but its steps never exercised that caller, and the refusal it gestured at is already covered by `US2-TC3-1`/`US2-TC4-1`.

**Run:** QA2, 2026-10-06, in a fresh context. QA1's blind pass read the Purpose and Feature set, `user-journeys.md`, `proposal.md`, `decisions.md` (its `## Raised` was empty), the Sessions page, the durable suite for id continuity and `shared/auth/domain-tcs.md`, and was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and `openspec/changes/archive/`. QA2 read both readings, `decisions.md`, `tech-design.md`, `tasks.md`, the delta and the durable suite. It is a statement, not proof. No case of this change has been accepted or published, so a draft keeps its `<v>` when it is reworded.

- **Agreed** - `shared-auth-sessions-US3-TC1-1` with `shared-auth-sessions-SC-10`; `shared-auth-sessions-US3-TC2-1` with `shared-auth-sessions-SC-10`, an account holding the console's session alone; `shared-auth-sessions-US3-TC3-1` with `shared-auth-sessions-SC-10`; `shared-auth-sessions-US3-TC4-1` with `shared-auth-sessions-SC-14`, a session with no surface stamp; `shared-auth-sessions-US4-TC1-1` with `shared-auth-sessions-SC-11`; `shared-auth-sessions-US4-TC2-1` with `shared-auth-sessions-SC-12`; `shared-auth-sessions-US2-TC8-1` with `shared-auth-sessions-SC-13`, run once per row for the site session and the console session
- **Adjusted, by QA2** - `shared-auth-sessions-US2-TC8-1` waits the 70-second closing bound before it returns to either tab, as `US4-TC1-1` and `US4-TC2-1` do, since `shared-auth-sessions-SC-09` bounds a cached read of the surface that was left and the case read it at once
- **Raised, folded into spec** - none: every case asserts what a scenario of the delta states
- **Raised, rejected** - none
- **Raised, settled by the artifacts** - how a session held before release is listed, and whether the two surfaces share one closing bound (`shared-auth-session-SC-38`, `shared-auth-sessions-SC-09`). Both are in `## Settled`; none goes to `decisions.md`
- **Raised, escalated** - none
- **Left to the durable cases** - `shared-auth-sessions-SC-01` to `shared-auth-sessions-SC-03`, whose requirement only gained the surface in its wording: `US1-TC1-1` to `US1-TC3-1` still verify them; `shared-auth-sessions-SC-04` to `shared-auth-sessions-SC-09`: `US2-TC1-1` to `US2-TC6-1` still verify them, `US2-TC7-1` stays retired, and every `actual` one is left `actual` because the wording moved nothing they assert
- **Covered at domain** - a revoke of one session leaving the device signed out is walked by `shared-auth-e2e-US4-TC1-1`, which still holds; ending both surfaces at once is walked by the draft domain case `shared-auth-e2e-US8-TC1-1` in this change's `domain-tcs.md`, step 7; a ban ending both stays with the capability's own cases
- **Contradicted** - none
- **Uncovered anchors** - none: `shared-auth-sessions-US-03` has `US3-TC1-1` to `US3-TC4-1`; `shared-auth-sessions-US-04` has `US4-TC1-1` and `US4-TC2-1`; `shared-auth-sessions-US-02` has `US2-TC8-1` beside the durable `US2-TC1-1` to `US2-TC6-1`; every scenario from `shared-auth-sessions-SC-10` to `shared-auth-sessions-SC-14` is reached
- **Trace markers** - the new scenarios and cases carry none yet; the trace CLI allocates them with the walk
