# shared/auth/sessions Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## sessions-US1: Operator lists a person's sessions

**As an** operator who can list sessions,
**I want** to see one account's sessions without their secrets,
**so that** I can tell which device is signed in without becoming that person.

### sessions-US1-TC1-1: Granted operator lists one account's sessions without secrets

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** sessions-US-01

**Pre-conditions:**
Signed in as an operator who holds `session:list`. <a subject user id> has at least one session.

**Steps:**

1. Navigate to <grade10 admin sessions url> for <a subject user id>.
2. Check the listed sessions.

**Expected Results:**

* That account's sessions are listed.
* No session secret is in the result.

### sessions-US1-TC2-1: Caller without the list grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** sessions-US-01

**Pre-conditions:**
Signed in as a person who does not hold `session:list`.

**Steps:**

1. Try to list sessions for <a subject user id>.

**Expected Results:**

* The system refuses the request.
* No sessions are returned.

### sessions-US1-TC3-1: Support cannot list an admin's sessions

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** sessions-US-01

**Pre-conditions:**
Signed in as an operator whose role is `support`. <an admin user id> holds `admin`.

**Steps:**

1. Try to list sessions for <an admin user id>.

**Expected Results:**

* The system refuses the request.
* No sessions are returned.

---

## sessions-US2: Operator ends a session

**As an** operator who can revoke,
**I want** to end one session or every session of an account,
**so that** a stolen device is signed out, including my own if I revoke the current one.

### sessions-US2-TC1-1: Revoked session is no longer signed in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** sessions-US-02

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`. <a subject user id> has a session other than the operator's.

**Steps:**

1. Navigate to <grade10 admin sessions url> for <a subject user id>.
2. Revoke one of that account's sessions.
3. Check who is calling on the revoked session.

**Expected Results:**

* A product reading who is calling on that session reports no person.

### sessions-US2-TC2-1: Every session of an account can be revoked

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** sessions-US-02

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`. <a subject user id> has more than one session.

**Steps:**

1. Navigate to <grade10 admin sessions url> for <a subject user id>.
2. Revoke every session of that account.

**Expected Results:**

* None of that account's sessions is signed in.

### sessions-US2-TC3-1: Caller without the revoke grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** sessions-US-02

**Pre-conditions:**
Signed in as an operator who does not hold `session:revoke`. <a subject user id> has a live session.

**Steps:**

1. Try to revoke a session of <a subject user id>.

**Expected Results:**

* The system refuses the request.
* The session remains signed in.

### sessions-US2-TC4-1: Support cannot revoke an admin's session

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** sessions-US-02

**Pre-conditions:**
Signed in as an operator whose role is `support`. <an admin user id> holds `admin` and has a live session.

**Steps:**

1. Try to revoke a session of <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The session remains signed in.

### sessions-US2-TC5-1: Revoking the current session signs the operator out

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** sessions-US-02

**Pre-conditions:**
Signed in as an operator who holds `session:revoke`.

**Steps:**

1. Navigate to <grade10 admin sessions url> for the operator's own user id.
2. Revoke the session currently in use.

**Expected Results:**

* The operator is not signed in.
