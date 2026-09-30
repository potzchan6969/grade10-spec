# shared/auth/sessions Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-02, tcs-rules r1

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

### shared-auth-sessions-US2-TC6-1: A cached browse read closes on the very next read after a revoke

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-sessions-US-02

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`. <a subject user id> has two sessions, A and B; an ordinary browse read of A's signed-in state has already warmed its cache and is still within the cache window.

**Steps:**

1. Read A's signed-in state (an ordinary browse read, not a mutation or an elevated call).
2. Revoke session A only.
3. Immediately read A's and B's signed-in state, the same way as step 1.

**Expected Results:**

* Step 3 shows A as nobody signed in, even though step 1's read would otherwise have kept the cache answering "signed in" for up to five more minutes.
* Step 3 still shows B signed in — revoking A does not touch a session it did not name.

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

## Settled

- Whether a read already in flight when a revoke commits counts as "the next read" — no; only a read that starts after the revoke commits is guaranteed to see it (`shared/auth/sessions` decisions.md Q4).
- Which concrete endpoints are "cached browse reads" versus "elevated calls" is an implementation mapping for `tech-design.md`, not a suite-level question — rejected as a finding here.
- Whether a per-session or a per-user cache-version key could make TC6-1 flaky — checked: either keying satisfies TC6-1's expected results, since session B is genuinely still valid either way; rejected as a finding.

## Reconciliation

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, decisions.md (Raised included), the linked Sessions · Revoke PRD section, this suite for id continuity, and `shared/auth/domain-tcs.md` for id continuity, all with Reconciliation/Requirements stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose, Feature set and the domain suite, openspec/changes/archive/.

**Raised, folded into spec**

- The in-flight-read boundary — folded into the requirement text ("the next read that starts after the revoke") and into `shared-auth-sessions-SC-09`.

**Raised, rejected**

- Which endpoints count as cached versus elevated — tech-design's job, not a suite question.
- Per-session versus per-user invalidation keying — does not change any case's observable expected result.

**Raised, landed as decisions**

- The in-flight-read boundary — `shared/auth/sessions` decisions.md Q4.

**Uncovered anchors**

- Cross-account isolation (an admin action on one account must not touch another account's cache) is not observable through a black-box signed-in/not-signed-in read. **Out of suite:** the per-user cache-version helper's own unit test, added under this change's `tasks.md`.
- The 70-second bound at a location other than the one the revoke was made at (`decisions.md` Q5) is not observable on a single-location stack, where the revoke reaches the next read at once. **Out of suite:** the cache-version helper's settling-window unit test and the auth worker's before/after-race regression test, both under `tasks.md` group 3.
- All other scenarios under Revoke / US-02, including the new `SC-09`, are covered by `US2-TC1-1` through `US2-TC7-1` above.

**Verdicts (@sean, quick pass in chat, not a full `/tcs-review`)**

- `US2-TC6-1` — Approved (`actual`).
- `US2-TC7-1` — Retired (`deprecated`): its title claimed a caller without the revoke grant, but its steps never exercised that caller, and the refusal it gestured at is already covered by `US2-TC3-1`/`US2-TC4-1`.
