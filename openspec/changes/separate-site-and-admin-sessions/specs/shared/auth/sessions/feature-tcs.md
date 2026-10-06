# shared/auth/sessions Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-auth-sessions-US2: Operator ends a session

**As an** operator who can revoke,
**I want** to end one session or every session of an account,
**so that** a stolen device is signed out, including my own if I revoke the current one.

### shared-auth-sessions-US2-TC8-1: Revoking one session leaves the account's other surface signed in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**

* admin(holds session:list and session:revoke) is on <grade10 admin sessions url> for <subject account>.
* <subject account> is signed in on <grade10 store url> in tab A and on <grade10 admin console url> in tab B, with the second factor proved.

**Test data:**

| <revoked session> | Tab that still shows <subject account> |
| --- | --- |
| The site session | Tab B, the console |
| The console session | Tab A, the site |

**Steps:**

1. Revoke <revoked session>.
2. Wait 70 seconds, the stated closing bound, then return to tab A.
3. Return to tab B.

**Expected Results:**

* The tab on the revoked surface shows nobody signed in.
* The other tab still shows <subject account> signed in.

---

## shared-auth-sessions-US3: Operator tells a console session from a site session

**As an** operator,
**I want** each listed session to say whether it is the site's or the console's,
**so that** I know what I am ending before I end it.

### shared-auth-sessions-US3-TC1-1: List names each session as site or console

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
* **Trace:** shared-auth-sessions-US-03

**Pre-conditions:**

* admin(holds session:list) is on <grade10 admin sessions url>.
* <subject account> has a site session on a desktop, a console session on the same desktop and a site session on a phone.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account holding console access, named by user id |

**Steps:**

1. List <subject account>'s sessions by user id.

**Expected Results:**

* The list shows three sessions.
* Two are named as site sessions and one as a console session, matching where each was signed in.
* No session secret is shown.

### shared-auth-sessions-US3-TC2-1: Account holding only a console session lists one console session

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-03

**Pre-conditions:**

* admin(holds session:list) is on <grade10 admin sessions url>.
* <subject account> is signed in on the console only.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account holding console access, named by user id |

**Steps:**

1. List <subject account>'s sessions by user id.

**Expected Results:**

* The list shows one session, named as a console session.
* No site session is listed.

### shared-auth-sessions-US3-TC3-1: Operator's own listing names the console session they are using

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-03

**Pre-conditions:**

* admin(holds session:list) is signed in on <grade10 admin console url> and on <grade10 store url>.
* admin is on <grade10 admin sessions url>.

**Steps:**

1. List the operator's own sessions by user id.

**Expected Results:**

* The list shows the console session in use, named as a console session.
* The list shows the site session, named as a site session.

### shared-auth-sessions-US3-TC4-1: Session made before release lists as a site session

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-03

**Pre-conditions:**

* admin(holds session:list) is on <grade10 admin sessions url>.
* <subject account> holds a session made before release, which carries no surface stamp.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account with a pre-release session, named by user id |

**Steps:**

1. List <subject account>'s sessions by user id.

**Expected Results:**

* The pre-release session is listed, named as a site session.
* No session secret is shown.

---

## shared-auth-sessions-US4: Operator ends every session of an account on both surfaces

**As an** operator,
**I want** ending every session of an account to close its site and console sessions together,
**so that** a person I have cut off keeps no live console session.

### shared-auth-sessions-US4-TC1-1: Revoking every session ends the site and the console sessions

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-04

**Pre-conditions:**

* admin(holds session:list and session:revoke) is on <grade10 admin sessions url> for <subject account>.
* <subject account> is signed in on <grade10 store url> in tab A and on <grade10 admin console url> in tab B, with the second factor proved.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account holding console access, named by user id |
| `<closing bound>` | 70 seconds (the stated closing bound) |

**Steps:**

1. Revoke every session of <subject account>.
2. Wait <closing bound>, then return to tab A.
3. Return to tab B.

**Expected Results:**

* Step 1 is accepted.
* Tab A shows nobody signed in.
* Tab B shows nobody signed in and not the console.

### shared-auth-sessions-US4-TC2-1: Ban ends the site and the console sessions

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-04

**Pre-conditions:**

* admin(holds user:ban) is on <admin users directory url>.
* <subject account> is not banned, and is signed in on <grade10 store url> in tab A and on <grade10 admin console url> in tab B, with the second factor proved.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account holding console access, named by user id |
| `<ban reason>` | Chargeback dispute open |
| `<closing bound>` | 70 seconds (the stated closing bound) |

**Steps:**

1. Open <subject account> by user id.
2. Ban it with <ban reason>.
3. Wait <closing bound>, then return to tab A.
4. Return to tab B.

**Expected Results:**

* Step 2 is accepted.
* Tab A shows nobody signed in.
* Tab B shows nobody signed in and not the console.

---

## Settled

* A session an operator held before release lists as a site session, and the account's other sessions are listed as they were: a session with no surface reads as the site (`shared-auth-session-SC-38`).
* A revoke of one session or of every session closes within the same 70-second bound on both surfaces: one per-account version token covers both, so no surface has a bound of its own.

## Reconciliation

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
