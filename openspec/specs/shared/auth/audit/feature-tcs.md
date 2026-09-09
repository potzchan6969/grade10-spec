# shared/auth/audit Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## shared-auth-audit-US1: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

### shared-auth-audit-US1-TC1-1: Successful ban is on the trail by user id

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
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as an operator who can ban. <a subject user id> is unbanned.

**Steps:**

1. Ban <a subject user id> with <a ban reason>.
2. Read the identity audit trail as an auditor.

**Expected Results:**

* The trail records that actor, that subject, and the ban.
* The entry names actor and subject by user id, not email.
* The entry keeps the ban reason and keeps no secret.

### shared-auth-audit-US1-TC2-1: Refused ban is on the trail as unsuccessful

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as a caller who cannot ban.

**Steps:**

1. Try to ban <a subject user id>.
2. Read the identity audit trail as an auditor.

**Expected Results:**

* The trail records that attempt.
* It records that it did not succeed.

### shared-auth-audit-US1-TC3-1: Session revoke is on the trail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as an operator who can revoke. <a subject user id> has a live session.

**Steps:**

1. Revoke a session of <a subject user id>.
2. Read the identity audit trail as an auditor.

**Expected Results:**

* The trail records that actor, that subject, and the revoke.

### shared-auth-audit-US1-TC4-1: Directory and session lists write no trail entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as an operator who can list users and sessions.

**Steps:**

1. List accounts in the users directory.
2. List sessions for <a subject user id>.
3. Read the identity audit trail as an auditor.

**Expected Results:**

* No identity trail entry is written for the directory list.
* No identity trail entry is written for the session list.

---

## shared-auth-audit-US2: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

### shared-auth-audit-US2-TC1-1: Auditor with the grant reads recorded identity actions

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
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**
Signed in as a person who holds `audit:read`. At least one identity action is already on the trail.

**Steps:**

1. Navigate to <grade10 admin audit trail url>.
2. Read the identity audit trail.

**Expected Results:**

* They receive the recorded identity actions.

### shared-auth-audit-US2-TC2-1: Consistency check reports without returning the proof

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**
Signed in as a person who holds `audit:read`.

**Steps:**

1. Check the identity audit trail for consistency.

**Expected Results:**

* They receive whether it is internally consistent.
* They do not receive the proof of that check.

### shared-auth-audit-US2-TC3-1: Caller without audit read is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**
Signed in as a person who does not hold `audit:read`.

**Steps:**

1. Try to read or check the identity audit trail.

**Expected Results:**

* The system refuses the request.

---

## shared-auth-audit-US3: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

### shared-auth-audit-US3-TC1-1: Trail entry cannot be rewritten or removed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**
An identity action is already on the trail.

**Steps:**

1. Try to edit or remove that entry.

**Expected Results:**

* The entry is unchanged.

### shared-auth-audit-US3-TC2-1: Unrecorded ban does not take effect

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**
Signed in as an operator who can ban. The identity trail cannot accept an entry.

**Steps:**

1. Try to ban <a subject user id>.

**Expected Results:**

* The account is not banned.

### shared-auth-audit-US3-TC3-1: Unrecorded revoke does not take effect

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**
Signed in as an operator who can revoke. <a subject user id> has a live session. The identity trail cannot accept an entry.

**Steps:**

1. Try to revoke that session.

**Expected Results:**

* The session remains signed in.
