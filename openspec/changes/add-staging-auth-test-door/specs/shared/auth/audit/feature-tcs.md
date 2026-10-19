# shared/auth/audit Test Cases

**Status:** pending-review · 0/10
**Drafts styled:** 2026-10-19, tcs-rules r6

## shared-auth-audit-US1: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

### shared-auth-audit-US1-TC7-1: Test-endpoint ban, grant and scoped role are on the trail under the caller's kind

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

**QA2 disposition:** kept with a note. Repaired: the `test-endpoint-qa-token` rows are removed, because Q50 lets the token capture, expire and clear only. The case does not assert the subject's user id or the absence of an email or token, so it fully covers no scenario; see TC3.

**QA2 covers:** none

**Pre-conditions:**

* The caller holds the test-endpoint kind `<caller kind>`.
* `<tester address>` is a unique plus-tag of the collector whose account is not banned and holds no `<scope>` role.

**Test data:**

| Action | Caller kind |
| --- | --- |
| ban | test-endpoint-workflow |
| grant | test-endpoint-workflow |
| scoped role | test-endpoint-workflow |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to `<action>` `<tester address>` as `<caller kind>`.
3. Read the identity trail.

**Expected Results:**

* Step 2 succeeds.
* The trail holds one more entry than in Step 1.
* The new entry records `<action>`.
* The new entry names `<caller kind>` in place of a user id.

### shared-auth-audit-US1-TC8-1: Test-endpoint capture, expire and clear write no entry

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

**QA2 disposition:** kept. The QA-token rows fully assert SC-39 and SC-45. The workflow rows rest on the requirement sentence that capture, expire and clear write no entry, and on Q45.

**QA2 covers:** shared-auth-audit-SC-39, shared-auth-audit-SC-45

**Pre-conditions:**

* The caller holds the test-endpoint kind `<caller kind>`.

**Test data:**

| Action | Caller kind |
| --- | --- |
| capture | test-endpoint-workflow |
| capture | QA token |
| expire | test-endpoint-workflow |
| expire | QA token |
| clear | test-endpoint-workflow |
| clear | QA token |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to `<action>` for `<tester address>` as `<caller kind>`.
3. Read the number of entries on the identity trail.

**Expected Results:**

* Step 2 succeeds.
* The trail holds the same number of entries as in Step 1.

### shared-auth-audit-US1-TC9-1: Test-endpoint entries carry no token, address or email

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

**QA2 disposition:** kept with a note. Repaired: the caller changes from `test-endpoint-qa-token` to `test-endpoint-workflow`, because Q50 refuses the token any ban or grant; the create step is removed, because Q47 gives the endpoint no create action; the entries are counted as two. The case asserts the no-token, no-address and no-email clauses of SC-38 and SC-40, not their naming or action clauses, so it fully covers no scenario.

**QA2 covers:** none

**Pre-conditions:**

* The caller holds the test-endpoint kind `test-endpoint-workflow`.
* `<tester address>` is a unique plus-tag of the collector whose account is not banned.

**Test data:**

| Field | Value |
| --- | --- |
| Tester address | `<tester address>` |
| QA token | `<qa token>` |

**Steps:**

1. Call the test endpoint to ban `<tester address>`.
2. Call the test endpoint to grant `<scope>` to `<tester address>`.
3. Read the two entries written by Steps 1 and 2.

**Expected Results:**

* Each of the two entries names `test-endpoint-workflow` in place of a user id.
* No field of either entry holds the QA token.
* No field of either entry holds the tester address.
* No field of either entry holds an email address.

### shared-auth-audit-US1-TC10-1: A refused test-endpoint ban is on the trail under the caller's kind

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

**QA2 disposition:** kept. A workflow ban on an address that is no tester is refused after the access check, so it is on the trail (Q46).

**QA2 covers:** shared-auth-audit-SC-43

**Pre-conditions:**

* The caller holds the test-endpoint kind `test-endpoint-workflow`.
* `<other address>` is not a tester address of the environment.

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to ban `<other address>` as `test-endpoint-workflow`.
3. Read the identity trail.

**Expected Results:**

* Step 2 is refused.
* The trail holds one more entry than in Step 1.
* The new entry records a refused ban and names `test-endpoint-workflow` in place of a user id.
* No field of the new entry holds `<other address>`.


### shared-auth-audit-US1-TC11-1: A ban the access check refuses writes no entry

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

**QA2 disposition:** kept. A QA-token ban is refused by the access check, which writes no entry.

**QA2 covers:** shared-auth-audit-SC-46

**Pre-conditions:**

* The caller carries only the staging QA token.
* `<tester address>` is a tester address on staging.

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to ban `<tester address>` with only the QA token.
3. Read the identity trail.

**Expected Results:**

* Step 2 is refused.
* The trail holds the same number of entries as in Step 1.

---

## shared-auth-audit-US2: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

### shared-auth-audit-US2-TC4-1: An auditor reads test-endpoint entries and the consistency check passes

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

**QA2 disposition:** over-claimed. The clause "The auditor sees no names" is stated by no scenario or decision; see Raised. The rest rests on the durable read and consistency scenarios and names the workflow's entry, which SC-38 states only in part.

**QA2 covers:** none

**Pre-conditions:**

* The caller performs one test-endpoint ban of `<tester address>` as `test-endpoint-workflow`.
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

## shared-auth-audit-US3: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

### shared-auth-audit-US3-TC4-1: A test-endpoint action the trail cannot record does not run

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

**QA2 disposition:** kept with a note. Repaired: the `test-endpoint-qa-token` grant and account-create rows are removed (Q50 and Q47), and the account-create wording is removed from Steps 1 and 3. The ban and scoped-role rows rest on the requirement sentence that an action the trail cannot record does not run; no scenario states it.

**QA2 covers:** none

**Pre-conditions:**

* The test environment makes the identity trail refuse its next write.
* The caller holds the test-endpoint kind `<caller kind>`.
* `<tester address>` is a unique plus-tag of the collector whose account is not banned and holds no `<scope>` role.

**Test data:**

| Action | Caller kind |
| --- | --- |
| ban | test-endpoint-workflow |
| scoped role | test-endpoint-workflow |

**Steps:**

1. Read the state of `<tester address>`.
2. Call the test endpoint to `<action>` for `<tester address>` as `<caller kind>`.
3. Read the state of `<tester address>`, and read the identity trail.

**Expected Results:**

* Step 2 is refused.
* The state read in Step 3 is the same as the state read in Step 1.
* The identity trail holds no new entry.

### shared-auth-audit-US3-TC5-1: A test-endpoint entry cannot be rewritten

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

**QA2 disposition:** kept with a note. It rests on the durable append-only requirement, which the delta makes apply to test-endpoint entries as identity writes. No delta scenario states it.

**QA2 covers:** none

**Pre-conditions:**

* The caller performs one test-endpoint ban of `<tester address>` as `test-endpoint-workflow`.

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

## shared-auth-audit-US4: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

### shared-auth-audit-US4-TC8-1: A ban that creates an account is one ban entry under the caller's kind

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

**QA2 disposition:** kept with a note. Repaired: the `test-endpoint-qa-token` row is removed (Q50). The create step is now a ban, because Q47 gives the endpoint no create action and Q20 has a ban create the account. The expected action is `ban`, not `created`; that choice is raised. The case names no new user id, so it fully covers no scenario.

**QA2 covers:** none

**Pre-conditions:**

* No account exists for `<tester address>`.
* The caller holds the test-endpoint kind `<caller kind>`.

**Test data:**

| Caller kind |
| --- |
| test-endpoint-workflow |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to ban `<tester address>` as `<caller kind>`, which creates its account.
3. Read the newest entry on the identity trail.

**Expected Results:**

* Step 2 creates an account for `<tester address>`.
* The trail holds one more entry than in Step 1.
* The new entry records `ban`.
* The new entry names `<caller kind>` in place of a user id.

### shared-auth-audit-US4-TC9-1: The daily cleanup's removal of a plus-tag account is one deletion entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-audit-US-04

**QA2 disposition:** kept.

**QA2 covers:** shared-auth-audit-SC-47

**Pre-conditions:**

* A staging run generated `<tester address>`, a unique plus-tag of the collector, and banned it, so it has an account.

**Steps:**

1. Note `<tester address>`'s user id and the number of entries on the identity trail.
2. Wait for the next daily cleanup to finish.
3. Read the identity trail.

**Expected Results:**

* The trail holds one more entry than in Step 1.
* The new entry records a deletion of the user id from Step 1 and names `test-endpoint-cleanup` in place of a user id.
* No field of the new entry holds `<tester address>`.

---

## Reconciliation

**Run:** QA2, fresh context, then refreshed on 2026-10-19 after the user settled Q50, Q41 and Q53. Read: this file, the change's `specs/shared/auth/audit/spec.md` delta, the durable `openspec/specs/shared/auth/audit/spec.md` for the requirements the cases cite, and the change's `decisions.md`.

**Covers:** Delta scenarios SC-38 to SC-47. Fully covered: SC-39 and SC-45 by US1-TC8-1, SC-43 by US1-TC10-1, SC-46 by US1-TC11-1, SC-47 by US4-TC9-1.

**Scenarios no case covers in full:**

* shared-auth-audit-SC-38 and shared-auth-audit-SC-40: naming and action are asserted, but no case asserts the subject's user id, and the no-secret clause sits in TC9 only.
* shared-auth-audit-SC-41: no case asserts the role or the subject's user id.
* shared-auth-audit-SC-42: US4-TC8-1 asserts the one `ban` entry but not the new user id.
* shared-auth-audit-SC-44: no case grants `admin` to an address that already holds it.

**Over-claimed cases:** US2-TC4-1 (the "no names" clause; Q52 settles it as user ids only).

**Outcomes no scenario states:** US1-TC8-1's workflow rows (Q45), US3-TC4-1 and US3-TC5-1 (the requirement sentence and the durable append-only rule).

**Contradictions:** none open. Q50 removed the QA-token write rows; Q47 and Q53 make an account-creating ban one `ban` entry; Q54 retired the create-or-find case.

**Raised:** none open. Q52, Q53 and Q54 are settled in `decisions.md`.
