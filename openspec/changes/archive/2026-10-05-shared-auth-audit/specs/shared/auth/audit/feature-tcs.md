# shared/auth/audit Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-05, tcs-rules r4

**Out of suite:** shared-auth-audit-SC-30, shared-auth-audit-SC-31, shared-auth-audit-SC-33 — collector sign-in/out and trusted-product account reads stay off the trail; held by identityTrail.spec negatives in grade10

## shared-auth-audit-US4: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

### shared-auth-audit-US4-TC1-1: Trusted-product create is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**
An email that has no account.

**Steps:**

1. A trusted product creates an unverified account for that email.
2. Read the identity trail as an auditor.

**Expected Results:**

* The trail records the write for the new user id with outcome `created`.
* The actor is the system and the subject is the user id, not the email.

### shared-auth-audit-US4-TC2-1: Already-existed find is not on the trail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**
An unverified account already exists for an email.

**Steps:**

1. A trusted product asks to create an unverified account for that same email.
2. Read the identity trail as an auditor.

**Expected Results:**

* No identity trail entry is written for that request.

### shared-auth-audit-US4-TC3-1: Verify flip and delete are on the trail; unrecorded writes do not land

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**
An unverified account exists. The identity trail can accept entries.

**Steps:**

1. A trusted product marks that email verified.
2. An operator deletes the account.
3. Repeat a create and a verify while the trail refuses inserts.

**Expected Results:**

* The verify flip and the deletion are on the trail.
* When the trail refuses, no account is created and an unverified account stays unverified; a delete does not remove the account.

## shared-auth-audit-US5: Auditor traces a second-factor write

**As an** auditor,
**I want** enabling, disabling, or regenerating recovery codes on the identity trail,
**so that** a takeover of the second factor is a recorded write, without the codes.

### shared-auth-audit-US5-TC1-1: Enable, disable, and regenerate are on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**
An account that can enroll a second factor.

**Steps:**

1. Start enrollment without completing enable.
2. Complete enable so the factor first becomes active.
3. Regenerate recovery codes.
4. Disable the factor.

**Expected Results:**

* Enrollment start has no enable entry.
* Enable, regenerate, and disable are on the trail by user id.
* The regenerate entry does not keep the codes.

### shared-auth-audit-US5-TC2-1: Failed enable record leaves the factor; later proof writes the missing enable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**
A second factor is becoming active and the trail cannot accept the enable entry.

**Steps:**

1. Complete the enable while the trail refuses inserts.
2. Restore the trail and complete a later successful proof.

**Expected Results:**

* The factor remains active and the enable request does not succeed.
* The later proof records exactly one enable for that going live.

## Reconciliation

**Run:** 2026-10-05 · blind cases for US-04 and US-05 reconciled against the scenario pass after identity-trail code shipped in grade10#219.

| Spec scenario or anchor | Suite coverage |
| --- | --- |
| shared-auth-audit-SC-15, SC-18, SC-20 | US4-TC1-1 |
| shared-auth-audit-SC-16, SC-17, SC-32 | US4-TC2-1 |
| shared-auth-audit-SC-19, SC-25, SC-27, SC-28, SC-34 | US4-TC3-1 |
| shared-auth-audit-SC-21, SC-22, SC-23, SC-24, SC-26 | US5-TC1-1 |
| shared-auth-audit-SC-29, SC-35, SC-36, SC-37 | US5-TC2-1 |
| shared-auth-audit-SC-30, SC-31, SC-33 | Out of suite — collector sign-in/out and trusted-product reads stay off the trail; covered by identityTrail.spec negatives |
| Uncovered anchors | none |
| Contradicted readings | none |

### Manual

None — identityTrail.spec.ts and security.spec.ts hold the automated coverage for these cases.
