# shared/auth/audit Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

**Out of suite:** shared-auth-audit-SC-30, shared-auth-audit-SC-31, shared-auth-audit-SC-33 — collector sign-in/out and trusted-product account reads stay off the trail; held by identityTrail.spec negatives in grade10

## shared-auth-audit-US1: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

<!-- trace:case id=g10.shared-audit.TC-63y rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->

### shared-auth-audit-US1-TC1-1: Successful ban is on the trail by user id

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Suites:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation, manual
- **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as an operator who can ban. <a subject user id> is unbanned.

**Steps:**

1. Ban <a subject user id> with <a ban reason>.
2. Read the identity audit trail as an auditor.

**Expected Results:**

- The trail records that actor, that subject, and the ban.
- The entry names actor and subject by user id, not email.
- The entry keeps the ban reason and keeps no secret.

<!-- trace:case id=g10.shared-audit.TC-cci rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->

### shared-auth-audit-US1-TC2-1: Refused ban is on the trail as unsuccessful

**Classification:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as a caller who cannot ban.

**Steps:**

1. Try to ban <a subject user id>.
2. Read the identity audit trail as an auditor.

**Expected Results:**

- The trail records that attempt.
- It records that it did not succeed.

<!-- trace:case id=g10.shared-audit.TC-psr rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->

### shared-auth-audit-US1-TC3-1: Session revoke is on the trail

**Classification:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as an operator who can revoke. <a subject user id> has a live session.

**Steps:**

1. Revoke a session of <a subject user id>.
2. Read the identity audit trail as an auditor.

**Expected Results:**

- The trail records that actor, that subject, and the revoke.

<!-- trace:case id=g10.shared-audit.TC-aph rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->

### shared-auth-audit-US1-TC4-1: Directory and session lists write no trail entry

**Classification:**

- **Severity:** major
- **Priority:** medium
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-01

**Pre-conditions:**
Signed in as an operator who can list users and sessions.

**Steps:**

1. List accounts in the users directory.
2. List sessions for <a subject user id>.
3. Read the identity audit trail as an auditor.

**Expected Results:**

- No identity trail entry is written for the directory list.
- No identity trail entry is written for the session list.

---

## shared-auth-audit-US2: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

<!-- trace:case id=g10.shared-audit.TC-etq rev=1 covers=g10.shared-audit.SC-31z,g10.shared-audit.SC-ren,g10.shared-audit.SC-2ig -->

### shared-auth-audit-US2-TC1-1: Auditor with the grant reads recorded identity actions

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Suites:** smoke
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation, manual
- **Trace:** shared-auth-audit-US-02

**Pre-conditions:**
Signed in as a person who holds `audit:read`. At least one identity action is already on the trail.

**Steps:**

1. Navigate to <grade10 admin audit trail url>.
2. Read the identity audit trail.

**Expected Results:**

- They receive the recorded identity actions.

<!-- trace:case id=g10.shared-audit.TC-afw rev=1 covers=g10.shared-audit.SC-31z,g10.shared-audit.SC-ren,g10.shared-audit.SC-2ig -->

### shared-auth-audit-US2-TC2-1: Consistency check reports without returning the proof

**Classification:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-02

**Pre-conditions:**
Signed in as a person who holds `audit:read`.

**Steps:**

1. Check the identity audit trail for consistency.

**Expected Results:**

- They receive whether it is internally consistent.
- They do not receive the proof of that check.

<!-- trace:case id=g10.shared-audit.TC-u47 rev=1 covers=g10.shared-audit.SC-31z,g10.shared-audit.SC-ren,g10.shared-audit.SC-2ig -->

### shared-auth-audit-US2-TC3-1: Caller without audit read is refused

**Classification:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-02

**Pre-conditions:**
Signed in as a person who does not hold `audit:read`.

**Steps:**

1. Try to read or check the identity audit trail.

**Expected Results:**

- The system refuses the request.

---

## shared-auth-audit-US3: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

<!-- trace:case id=g10.shared-audit.TC-74z rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1 -->

### shared-auth-audit-US3-TC1-1: Trail entry cannot be rewritten or removed

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** security
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-03

**Pre-conditions:**
An identity action is already on the trail.

**Steps:**

1. Try to edit or remove that entry.

**Expected Results:**

- The entry is unchanged.

<!-- trace:case id=g10.shared-audit.TC-2cz rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1 -->

### shared-auth-audit-US3-TC2-1: Unrecorded ban does not take effect

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-03

**Pre-conditions:**
Signed in as an operator who can ban. The identity trail cannot accept an entry.

**Steps:**

1. Try to ban <a subject user id>.

**Expected Results:**

- The account is not banned.

<!-- trace:case id=g10.shared-audit.TC-vf9 rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1 -->

### shared-auth-audit-US3-TC3-1: Unrecorded revoke does not take effect

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Layer:** e2e
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-03

**Pre-conditions:**
Signed in as an operator who can revoke. <a subject user id> has a live session. The identity trail cannot accept an entry.

**Steps:**

1. Try to revoke that session.

**Expected Results:**

- The session remains signed in.

---

## shared-auth-audit-US4: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

### shared-auth-audit-US4-TC1-1: Trusted-product create is on the trail

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Suites:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-04

**Pre-conditions:**
An email that has no account.

**Steps:**

1. A trusted product creates an unverified account for that email.
2. Read the identity trail as an auditor.

**Expected Results:**

- The trail records the write for the new user id with outcome `created`.
- The actor is the system and the subject is the user id, not the email.

### shared-auth-audit-US4-TC2-1: Already-existed find is not on the trail

**Classification:**

- **Severity:** major
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Suites:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-04

**Pre-conditions:**
An unverified account already exists for an email.

**Steps:**

1. A trusted product asks to create an unverified account for that same email.
2. Read the identity trail as an auditor.

**Expected Results:**

- No identity trail entry is written for that request.

### shared-auth-audit-US4-TC3-1: Verify flip and delete are on the trail; unrecorded writes do not land

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Suites:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-04

**Pre-conditions:**
An unverified account exists. The identity trail can accept entries.

**Steps:**

1. A trusted product marks that email verified.
2. An operator deletes the account.
3. Repeat a create and a verify while the trail refuses inserts.

**Expected Results:**

- The verify flip and the deletion are on the trail.
- When the trail refuses, no account is created and an unverified account stays unverified; a delete does not remove the account.

---

## shared-auth-audit-US5: Auditor traces a second-factor write

**As an** auditor,
**I want** enabling, disabling, or regenerating recovery codes on the identity trail,
**so that** a takeover of the second factor is a recorded write, without the codes.

### shared-auth-audit-US5-TC1-1: Enable, disable, and regenerate are on the trail

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** positive
- **Type:** functional
- **Suites:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-05

**Pre-conditions:**
An account that can enroll a second factor.

**Steps:**

1. Start enrollment without completing enable.
2. Complete enable so the factor first becomes active.
3. Regenerate recovery codes.
4. Disable the factor.

**Expected Results:**

- Enrollment start has no enable entry.
- Enable, regenerate, and disable are on the trail by user id.
- The regenerate entry does not keep the codes.

### shared-auth-audit-US5-TC2-1: Failed enable record leaves the factor; later proof writes the missing enable

**Classification:**

- **Severity:** critical
- **Priority:** high
- **Status:** draft
- **Behaviour:** negative
- **Type:** functional
- **Suites:** regression
- **Layer:** api
- **Automation status:** manual
- **Testability:** automation
- **Trace:** shared-auth-audit-US-05

**Pre-conditions:**
A second factor is becoming active and the trail cannot accept the enable entry.

**Steps:**

1. Complete the enable while the trail refuses inserts.
2. Restore the trail and complete a later successful proof.

**Expected Results:**

- The factor remains active and the enable request does not succeed.
- The later proof records exactly one enable for that going live.

## Reconciliation

**Run:** 2026-10-05 · blind cases for US-04 and US-05 reconciled against the scenario pass after identity-trail code shipped in grade10#219.

| Spec scenario or anchor                             | Suite coverage                                                                                                             |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| shared-auth-audit-SC-15, SC-18, SC-20               | US4-TC1-1                                                                                                                  |
| shared-auth-audit-SC-16, SC-17, SC-32               | US4-TC2-1                                                                                                                  |
| shared-auth-audit-SC-19, SC-25, SC-27, SC-28, SC-34 | US4-TC3-1                                                                                                                  |
| shared-auth-audit-SC-21, SC-22, SC-23, SC-24, SC-26 | US5-TC1-1                                                                                                                  |
| shared-auth-audit-SC-29, SC-35, SC-36, SC-37        | US5-TC2-1                                                                                                                  |
| shared-auth-audit-SC-30, SC-31, SC-33               | Out of suite — collector sign-in/out and trusted-product reads stay off the trail; covered by identityTrail.spec negatives |
| Uncovered anchors                                   | none                                                                                                                       |
| Contradicted readings                               | none                                                                                                                       |

### Manual

None — identityTrail.spec.ts and security.spec.ts hold the automated coverage for these cases.
