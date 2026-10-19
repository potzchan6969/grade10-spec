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

**QA2 disposition:** kept with a note. The workflow row asserts the ban entry, the caller kind and the user id. The no-email and no-token clause is not asserted on this route (see Reconciliation).

**Blocked:** product manager, on the QA-token question in `decisions.md` under Raised. The QA-token row is held.

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

**QA2 disposition:** kept with a note. The workflow row asserts the scoped-role entry. The change has no scenario for the scoped-role entry, so Dev folds one into `spec.md`. The QA-token row is held. The tester account must be a unique plus tag of the collector, per Q42 in `decisions.md`, not a named tester.

**Blocked:** product manager, on the QA-token question in `decisions.md` under Raised. The QA-token row is held.

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

**QA2 disposition:** kept with a note. The no-entry result for capture, age and clear is asserted on the workflow route only. The QA-token capture the change names is not asserted (see Reconciliation).

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

**QA2 disposition:** kept with a note. The Create account row is over-claimed: the door has no create move (Q47 in `decisions.md`). The Ban, Scoped role and Prepare rows are kept, and every row runs on the QA-token route.

**Blocked:** product manager, on the QA-token question in `decisions.md` under Raised. The QA-token rows are held.

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

**QA2 disposition:** kept with a note. A refused door ban is on the trail (Q46 in `decisions.md`). The change has no scenario for it, so Dev folds one into `spec.md`.

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

**QA2 disposition:** kept as-is.

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

**QA2 disposition:** kept as-is.

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

**QA2 disposition:** kept with a note. The Create account row is over-claimed: the door has no create move (Q47 in `decisions.md`). The Ban, Scoped role and Prepare rows are kept.

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

**QA2 disposition:** kept as-is.

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

**QA2 disposition:** kept with a note. The workflow row is kept. The QA-token row is held by the QA-token question.

**Blocked:** product manager, on the QA-token question in `decisions.md` under Raised. The QA-token row is held.

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

**QA2 disposition:** over-claimed. The door has no create action; an account for an address that never signed in is made by ban or prepare (Q47 in `decisions.md`). The author rewrites this case onto ban or prepare of an unsigned address, or drops it.

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

**QA2 disposition:** held as a contradiction. The change's requirement says every door prepare is recorded; this case expects no entry for a prepare that changes nothing.

**Blocked:** product manager, on the unchanged-prepare question in `decisions.md` under Raised.

## Settled

- A refused door ban is on the trail, naming the caller's kind in place of a user id (Q46).
- The door has no create move. An account for an address that never signed in is made by ban or prepare (Q47).

## Reconciliation

Run: QA2 on 2026-10-19 read this suite's blind cases; the change's `spec.md` (requirement text and its scenarios); the durable `openspec/specs/shared/auth/audit/spec.md`, for the requirements the cases cite; `decisions.md`; the PRD `docs/prds/products/grade10-site/account/audit.md`; `docs/governance/specs-to-test-cases.md`; and planning-dev step 3. Not read: `tech-design.md`, `tasks.md`, `proposal.md`, and the archive.

### Covered Scenarios

None linked. The draft holds no `trace:case` markers, so there is no marker to carry a `covers` list. The trace command issues the markers, and the links follow from this reconciliation.

### Uncovered Scenarios

- **shared-auth-audit-SC-38** (a test-door ban is on the trail): no single case asserts its whole THEN. `US-01-TC1`, workflow row, asserts the ban entry, the caller kind and the user id. The no-email and no-token clause is asserted only on the QA-token route, by `US-01-TC4`. Disposition: a scenario no case reaches. Add a workflow-route check for the no-token clause, or name a verifier under Out of suite.
- **shared-auth-audit-SC-39** (a capture writes no entry): no case asserts it on the QA-token route. `US-01-TC3` asserts no entry for capture, age and clear, on the workflow route only. Disposition: add a QA-token row to `US-01-TC3`, or name a verifier under Out of suite.
- **Behaviour the change's requirement states with no scenario** (real; Dev folds these into `spec.md`): the scoped-role entry, the prepare entry, the entry for an account the door creates, the no-entry result for age and clear, the no-secret clause for non-ban writes, and the refused door ban.
- **Durable scenarios**: the cases also cite durable behaviour that the change does not restate, such as the read and check outcomes and the no-change rules. No delta scenario covers them. Nothing is linked to them here.

### Over-claimed Cases

- `US-04-TC2`: calls a create action the door does not have (Q47).
- `US-01-TC4` and `US-03-TC1`, the Create account row: same claim (Q47).

### Contradictions

1. `US-04-TC3` against the requirement: this case expects no entry for a prepare that changes nothing; the requirement says every prepare is recorded. Held as the unchanged-prepare question in `decisions.md` under Raised.
2. The QA-token rows of `US-01-TC1`, `US-01-TC2`, `US-01-TC4` and `US-04-TC1` have the token ban, set a scoped role and prepare. Q39 says the token never bans or prepares; Q43 and Q44 say the shipped code accepts it for any staging tester except the admin-only one. Held as the QA-token question in `decisions.md` under Raised.

No case claims an entry for capture, age or clear, other than the no-entry result in `US-01-TC3`.
