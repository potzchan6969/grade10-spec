# shared/auth/sessions Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-auth-sessions-US1: Operator lists a person's sessions

**As an** operator who can list sessions,
**I want** to see one account's sessions without their secrets,
**so that** I can tell which device is signed in without becoming that person.

<!-- trace:case id=g10.shared-sessions.TC-jes rev=1 covers=g10.shared-sessions.SC-h95,g10.shared-sessions.SC-bo7,g10.shared-sessions.SC-jz2 -->
### shared-auth-sessions-US1-TC1-1: Granted operator lists one account's sessions without secrets

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-01

**Pre-conditions:**
Signed in as an operator who holds `session:list`. <a subject user id> has at least one session.

**Steps:**

1. Navigate to <grade10 admin sessions url> for <a subject user id>.
2. Check the listed sessions.

**Expected Results:**

* That account's sessions are listed.
* No session secret is in the result.

<!-- trace:case id=g10.shared-sessions.TC-7dr rev=1 covers=g10.shared-sessions.SC-h95,g10.shared-sessions.SC-bo7,g10.shared-sessions.SC-jz2 -->
### shared-auth-sessions-US1-TC2-1: Caller without the list grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sessions-US-01

**Pre-conditions:**
Signed in as a person who does not hold `session:list`.

**Steps:**

1. Try to list sessions for <a subject user id>.

**Expected Results:**

* The system refuses the request.
* No sessions are returned.

<!-- trace:case id=g10.shared-sessions.TC-97h rev=1 covers=g10.shared-sessions.SC-h95,g10.shared-sessions.SC-bo7,g10.shared-sessions.SC-jz2 -->
### shared-auth-sessions-US1-TC3-1: Support cannot list an admin's sessions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sessions-US-01

**Pre-conditions:**
Signed in as an operator whose role is `support`. <an admin user id> holds `admin`.

**Steps:**

1. Try to list sessions for <an admin user id>.

**Expected Results:**

* The system refuses the request.
* No sessions are returned.

---

## shared-auth-sessions-US2: Operator ends a session

**As an** operator who can revoke,
**I want** to end one session or every session of an account,
**so that** a stolen device is signed out, including my own if I revoke the current one.

<!-- trace:case id=g10.shared-sessions.TC-ffj rev=1 covers=g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots -->
### shared-auth-sessions-US2-TC1-1: Revoked session is no longer signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`. <a subject user id> has a session other than the operator's.

**Steps:**

1. Navigate to <grade10 admin sessions url> for <a subject user id>.
2. Revoke one of that account's sessions.
3. Check who is calling on the revoked session.

**Expected Results:**

* A product reading who is calling on that session reports no person.

<!-- trace:case id=g10.shared-sessions.TC-oys rev=1 covers=g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots -->
### shared-auth-sessions-US2-TC2-1: Every session of an account can be revoked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`. <a subject user id> has more than one session.

**Steps:**

1. Navigate to <grade10 admin sessions url> for <a subject user id>.
2. Revoke every session of that account.

**Expected Results:**

* None of that account's sessions is signed in.

<!-- trace:case id=g10.shared-sessions.TC-eau rev=1 covers=g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots -->
### shared-auth-sessions-US2-TC3-1: Caller without the revoke grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**
Signed in as an operator who does not hold `session:revoke`. <a subject user id> has a live session.

**Steps:**

1. Try to revoke a session of <a subject user id>.

**Expected Results:**

* The system refuses the request.
* The session remains signed in.

<!-- trace:case id=g10.shared-sessions.TC-cuz rev=1 covers=g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots -->
### shared-auth-sessions-US2-TC4-1: Support cannot revoke an admin's session

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**
Signed in as an operator whose role is `support`. <an admin user id> holds `admin` and has a live session.

**Steps:**

1. Try to revoke a session of <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The session remains signed in.

<!-- trace:case id=g10.shared-sessions.TC-i70 rev=1 covers=g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots -->
### shared-auth-sessions-US2-TC5-1: Revoking the current session signs the operator out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`.

**Steps:**

1. Navigate to <grade10 admin sessions url> for the operator's own user id.
2. Revoke the session currently in use.

**Expected Results:**

* The operator is not signed in.

<!-- trace:case id=g10.shared-sessions.TC-g0e rev=1 covers=g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots,g10.shared-sessions.SC-bui -->
### shared-auth-sessions-US2-TC6-1: A cached browse read closes on the very next read after a revoke

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/sessions.spec.ts`

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`. <a subject user id> has two sessions, A and B; an ordinary browse read of A's signed-in state has already warmed its cache and is still within the cache window.

**Steps:**

1. Read A's signed-in state (an ordinary browse read, not a mutation or an elevated call).
2. Revoke session A only.
3. Immediately read A's and B's signed-in state, the same way as step 1.

**Expected Results:**

* Step 3 shows A as nobody signed in, even though step 1's read would otherwise have kept the cache answering "signed in" for up to five more minutes.
* Step 3 still shows B signed in — revoking A does not touch a session it did not name.

<!-- trace:case id=g10.shared-sessions.TC-f08 rev=1 covers=g10.shared-sessions.SC-4af,g10.shared-sessions.SC-lr6,g10.shared-sessions.SC-txa,g10.shared-sessions.SC-bcq,g10.shared-sessions.SC-ots,g10.shared-sessions.SC-bui -->
### shared-auth-sessions-US2-TC7-1: A caller without the revoke grant cannot force a stale read either

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**
<a subject user id> has a live, cache-warmed session. No revoke has happened.

**Steps:**

1. Read the session's signed-in state.

**Expected Results:**

* The session still shows signed in — nothing about this change causes a session to close on its own, absent a revoke.

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
