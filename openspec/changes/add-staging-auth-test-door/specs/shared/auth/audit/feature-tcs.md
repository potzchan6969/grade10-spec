# shared/auth/audit Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-19, tcs-rules r6

## shared-auth-audit-US-01: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

### shared-auth-audit-US-01-TC1: Test door ban writes a ban entry naming the caller's kind

Runs once per row of **Test data**.

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

* The test door accepts a ban from the caller kind in the row.
* A tester account exists with user id `<tester user id>` and is not banned.

**Test data:**

| Caller kind | Reason |
| --- | --- |
| `test-door-workflow` | `<operator reason>` |
| `test-door-qa-token` | `<operator reason>` |

**Steps:**

1. Call the test door's ban action for user id `<tester user id>` with the caller kind and reason from the row.
2. Open the identity trail as an auditor.

**Expected Results:**

* The tester account is banned.
* The trail holds one new ban entry.
* The entry names the target account by user id.
* The entry names the caller kind from the row in place of a user id.
* The entry keeps the reason from the row.

### shared-auth-audit-US-01-TC2: Test door scoped role writes a set-role entry naming the caller's kind

Runs once per row of **Test data**.

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

* The test door accepts a scoped role change from the caller kind in the row.
* A tester account exists with user id `<tester user id>` and holds no scoped role.

**Test data:**

| Caller kind | Scoped role | Reason |
| --- | --- | --- |
| `test-door-workflow` | `<scoped role>` | `<operator reason>` |
| `test-door-qa-token` | `<scoped role>` | `<operator reason>` |

**Steps:**

1. Call the test door's set-role action for user id `<tester user id>` with the scoped role, caller kind and reason from the row.
2. Open the identity trail as an auditor.

**Expected Results:**

* The tester account holds the scoped role from the row.
* The trail holds one new set-role entry.
* The entry names the target account by user id.
* The entry names the caller kind from the row in place of a user id.
* The entry keeps the reason from the row.

### shared-auth-audit-US-01-TC3: Test door capture, age and clear write no entry

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

* The identity trail holds a known number of entries, recorded before the step.
* The test door accepts the action named in the row for the caller kind `test-door-workflow`.

**Test data:**

| Door action |
| --- |
| Capture |
| Age |
| Clear |

**Steps:**

1. Record the number of entries on the identity trail.
2. Call the test door action named in the row.
3. Open the identity trail as an auditor and count the entries.

**Expected Results:**

* The door action returns its normal result.
* The entry count is unchanged from step 1.
* No entry names the test door caller kind.

### shared-auth-audit-US-01-TC4: Entries written by the test door carry no token, address or email

Runs once per row of **Test data**.

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

* A tester account exists with user id `<tester user id>`, and the tester address `<tester address>` and a session token are known to the tester.

**Test data:**

| Door action that writes |
| --- |
| Ban |
| Scoped role |
| Prepare |
| Create account for `<tester address>` |

**Steps:**

1. Call the door action named in the row with the caller kind `test-door-qa-token`.
2. Open the identity trail as an auditor and read the new entry.

**Expected Results:**

* The new entry names the account by user id.
* The entry holds no session token, no recovery code, no password and no address.
* The entry does not contain `<tester address>`.

### shared-auth-audit-US-01-TC5: A refused test door ban is recorded naming the caller's kind

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* No account holds user id `<unknown user id>`.
* The test door accepts the caller kind `test-door-workflow`.

**Test data:**

| Field | Value |
| --- | --- |
| Target user id | `<unknown user id>` |
| Caller kind | `test-door-workflow` |
| Reason | `<operator reason>` |

**Steps:**

1. Call the test door's ban action with the target user id, caller kind and reason from the test data.
2. Open the identity trail as an auditor.

**Expected Results:**

* The door refuses the ban.
* The trail holds one new entry recording the refused ban.
* The entry names the caller kind in place of a user id.
* The entry keeps the reason.

---

## shared-auth-audit-US-02: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

### shared-auth-audit-US-02-TC1: Auditor reads test door entries and the consistency check passes without the proof

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* The identity trail holds at least one test door entry from each caller kind.
* The auditor holds the read grant and no other grant.

**Test data:**

| Field | Value |
| --- | --- |
| Auditor | `<auditor account>` |

**Steps:**

1. Sign in as the auditor.
2. Open the identity trail and read the entries.
3. Run the consistency check on the trail.

**Expected Results:**

* The auditor reads the test door entries.
* The entries show the caller kind in place of a user id.
* The consistency check reports the trail as consistent.
* The auditor is not shown the proof.
* The auditor sees no names and no emails in the entries.

### shared-auth-audit-US-02-TC2: Auditor reading test door entries leaves no entry

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* The identity trail holds a known number of entries, recorded before the step.
* The auditor holds the read grant and no other grant.

**Test data:**

| Field | Value |
| --- | --- |
| Auditor | `<auditor account>` |

**Steps:**

1. Record the number of entries on the identity trail.
2. Sign in as the auditor.
3. Open the identity trail and list the entries.
4. Run the consistency check on the trail.
5. Open the directory and the sessions list.
6. Count the entries on the identity trail again.

**Expected Results:**

* The entry count after step 6 is the same as in step 1.
* No entry records the auditor's reads or listings.

---

## shared-auth-audit-US-03: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

### shared-auth-audit-US-03-TC1: Test door action the trail cannot record does not run

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

* A tester account exists with user id `<tester user id>` in a known state.
* The identity trail cannot take a new entry for the duration of the step. How the write is made to fail is the test environment's to choose, and the tester records it.

**Test data:**

| Door action | Known state before |
| --- | --- |
| Ban | Account not banned |
| Scoped role | Account holds no scoped role |
| Prepare | Account not prepared |
| Create account | No account for `<tester address>` |

**Steps:**

1. Record the account's state for the row.
2. Call the test door action named in the row with caller kind `test-door-workflow`.
3. Read the account's state again.
4. Open the identity trail as an auditor.

**Expected Results:**

* The door action is refused.
* The account's state is unchanged from step 1.
* The trail holds no new entry for the refused action.

### shared-auth-audit-US-03-TC2: A test door entry on the trail cannot be changed

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* The identity trail holds a test door ban entry with reason `<operator reason>`.

**Test data:**

| Field | Value |
| --- | --- |
| Change to attempt | Reason set to `<other reason>` |

**Steps:**

1. Open the identity trail and read the test door ban entry.
2. Attempt to change the entry's reason to the value in the test data.
3. Read the entry again.

**Expected Results:**

* The change is refused.
* The entry keeps the reason `<operator reason>`.

---

## shared-auth-audit-US-04: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

### shared-auth-audit-US-04-TC1: Test door prepare writes an entry naming the caller's kind

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

* A tester account exists with user id `<tester user id>` in the state the prepare must change.

**Test data:**

| Caller kind | Prepare target |
| --- | --- |
| `test-door-workflow` | `<tester user id>` |
| `test-door-qa-token` | `<tester user id>` |

**Steps:**

1. Call the test door's prepare action for the prepare target and caller kind from the row.
2. Open the identity trail as an auditor.

**Expected Results:**

* The tester account is prepared.
* The trail holds one new entry for the prepare.
* The entry names the caller kind from the row in place of a user id.
* The entry names the account by user id.
* The entry carries no email.

### shared-auth-audit-US-04-TC2: Test door creates a tester account and writes a created entry naming the caller's kind

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

**Test data:**

| Caller kind | Tester address |
| --- | --- |
| `test-door-workflow` | `<tester address>` |
| `test-door-qa-token` | `<tester address>` |

**Steps:**

1. Call the test door's create action with the tester address and caller kind from the row.
2. Open the identity trail as an auditor.

**Expected Results:**

* An account exists for the tester address with a new user id.
* The trail holds one new entry with state `created`.
* The entry names the new user id.
* The entry names the caller kind from the row in place of a user id.
* The entry does not contain `<tester address>`.

### shared-auth-audit-US-04-TC3: Test door prepare on an account already in its state writes no entry

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

* A tester account exists with user id `<tester user id>` in the state named in the row.
* The identity trail holds a known number of entries, recorded before the step.

**Test data:**

| Account state before |
| --- |
| Already unverified |
| Already verified |

**Steps:**

1. Record the number of entries on the identity trail.
2. Call the test door's prepare action for `<tester user id>` with caller kind `test-door-workflow`.
3. Open the identity trail as an auditor and count the entries.

**Expected Results:**

* The prepare returns the account in the state named in the row.
* The entry count is unchanged from step 1.
* No entry is written for the find.
