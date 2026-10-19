# shared/auth/audit Test Cases

**Status:** pending-review · 0/9
**Drafts styled:** 2026-10-19, tcs-rules r6

## shared-auth-audit-US-01: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

### shared-auth-audit-US-01-TC1: Test-endpoint ban, grant and scoped role are on the trail under the caller's kind

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* The caller holds the test-endpoint kind `<caller kind>`.
* `<target user id>` is an account that is not banned and holds no `<scope>` role.

**Test data:**

| Action | Caller kind |
| --- | --- |
| ban | test-endpoint-workflow |
| ban | test-endpoint-qa-token |
| grant | test-endpoint-workflow |
| grant | test-endpoint-qa-token |
| scoped role | test-endpoint-workflow |
| scoped role | test-endpoint-qa-token |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to `<action>` `<target user id>` as `<caller kind>`.
3. Read the identity trail.

**Expected Results:**

* Step 2 succeeds.
* The trail holds one more entry than in Step 1.
* The new entry records `<action>`.
* The new entry names `<caller kind>` in place of a user id.

### shared-auth-audit-US-01-TC2: Test-endpoint capture, expire and clear write no entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* The caller holds the test-endpoint kind `<caller kind>`.

**Test data:**

| Action | Caller kind |
| --- | --- |
| capture | test-endpoint-workflow |
| capture | test-endpoint-qa-token |
| expire | test-endpoint-workflow |
| expire | test-endpoint-qa-token |
| clear | test-endpoint-workflow |
| clear | test-endpoint-qa-token |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to `<action>` as `<caller kind>`.
3. Read the number of entries on the identity trail.

**Expected Results:**

* Step 2 succeeds.
* The trail holds the same number of entries as in Step 1.

### shared-auth-audit-US-01-TC3: Test-endpoint entries carry no token, address or email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* The caller holds the test-endpoint kind `test-endpoint-qa-token`, presented with the QA token `<qa token>`.
* `<target user id>` is an account that is not banned.

**Test data:**

| Field | Value |
| --- | --- |
| Tester address | `<tester address>` |
| QA token | `<qa token>` |

**Steps:**

1. Call the test endpoint to ban `<target user id>`.
2. Call the test endpoint to grant `<scope>` to `<target user id>`.
3. Call the test endpoint to create an account for the tester address.
4. Read the three entries written by Steps 1 to 3.

**Expected Results:**

* Each of the three entries names `test-endpoint-qa-token` in place of a user id.
* No field of any of the three entries holds the QA token.
* No field of any of the three entries holds the tester address.
* No field of any of the three entries holds an email address.

### shared-auth-audit-US-01-TC4: A refused test-endpoint ban is on the trail under the caller's kind

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* The caller holds the test-endpoint kind `test-endpoint-workflow`.
* `<target user id>` is already banned, so a further ban is refused.

**Steps:**

1. Note the number of entries on the identity trail and the state of `<target user id>`.
2. Call the test endpoint to ban `<target user id>` as `test-endpoint-workflow`.
3. Read the identity trail and the state of `<target user id>`.

**Expected Results:**

* Step 2 is refused.
* The trail holds one more entry than in Step 1.
* The new entry records a refused ban and names `test-endpoint-workflow` in place of a user id.
* The state of `<target user id>` is the same as in Step 1.

---

## shared-auth-audit-US-02: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

### shared-auth-audit-US-02-TC1: An auditor reads test-endpoint entries and the consistency check passes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* The caller performs one test-endpoint ban of `<target user id>` as `test-endpoint-workflow`.
* An auditor holds the audit read grant and nothing else.

**Steps:**

1. Sign in as the auditor.
2. Open the identity trail.
3. Read the entry for the ban in Pre-conditions.
4. Run the consistency check on the identity trail.

**Expected Results:**

* The entry for the ban is listed and names `test-endpoint-workflow` in place of a user id.
* The consistency check reports the trail as consistent.
* The auditor sees no proof.
* The auditor sees no names and no email addresses.

---

## shared-auth-audit-US-03: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

### shared-auth-audit-US-03-TC1: A test-endpoint action the trail cannot record does not run

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* The test environment makes the identity trail refuse its next write.
* The caller holds the test-endpoint kind `<caller kind>`.
* `<target user id>` is an account that is not banned and holds no `<scope>` role.

**Test data:**

| Action | Caller kind |
| --- | --- |
| ban | test-endpoint-workflow |
| grant | test-endpoint-qa-token |
| scoped role | test-endpoint-workflow |
| account create for `<tester address>` | test-endpoint-qa-token |

**Steps:**

1. Read the state of `<target user id>`, or for an account create, confirm that no account exists for `<tester address>`.
2. Call the test endpoint to `<action>` as `<caller kind>`.
3. Read the state of `<target user id>`, or for an account create, confirm that no account exists for `<tester address>`, and read the identity trail.

**Expected Results:**

* Step 2 is refused.
* The state read in Step 3 is the same as the state read in Step 1.
* The identity trail holds no new entry.

### shared-auth-audit-US-03-TC2: A test-endpoint entry cannot be rewritten

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* The caller performs one test-endpoint ban of `<target user id>` as `test-endpoint-workflow`.

**Steps:**

1. Read the entry written by the ban in Pre-conditions and note its content.
2. Attempt to change the entry's content through the identity trail's write interface.
3. Attempt to delete the entry through the identity trail's write interface.
4. Read the entry again.

**Expected Results:**

* Step 2 is refused.
* Step 3 is refused.
* The entry read in Step 4 has the same content as the entry read in Step 1.

---

## shared-auth-audit-US-04: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

### shared-auth-audit-US-04-TC1: A test-endpoint account create is on the trail as created under the caller's kind

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* No account exists for `<tester address>`.
* The caller holds the test-endpoint kind `<caller kind>`.

**Test data:**

| Caller kind |
| --- |
| test-endpoint-workflow |
| test-endpoint-qa-token |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to create an account for `<tester address>` as `<caller kind>`.
3. Read the newest entry on the identity trail.

**Expected Results:**

* Step 2 creates an account for `<tester address>`.
* The trail holds one more entry than in Step 1.
* The new entry records `created`.
* The new entry names `<caller kind>` in place of a user id.

### shared-auth-audit-US-04-TC2: A test-endpoint find of an existing account with no change writes no entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* An account for `<tester address>` already exists and is `<verification status>`.
* The caller holds the test-endpoint kind `test-endpoint-workflow`.

**Test data:**

| Verification status |
| --- |
| verified |
| unverified |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to create or find the account for `<tester address>` as `test-endpoint-workflow`.
3. Read the number of entries on the identity trail, and read the account's verification status.

**Expected Results:**

* Step 2 returns the existing account.
* The trail holds the same number of entries as in Step 1.
* The account's verification status is the same as before Step 2.
