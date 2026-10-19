# shared/auth/audit Test Cases

**Status:** reopened · 22/32
**Reviewed:** 2026-10-07, tcs-rules r4, lapsed 2026-10-19
**Drafts styled:** 2026-10-19, tcs-rules r6

## shared-auth-audit-US1: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

<!-- trace:case id=g10.shared-audit.TC-63z rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
### shared-auth-audit-US1-TC1-1: Successful ban is on the trail by user id

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:ban`) is on `<grade10 admin users url>`.
* `<subject account>` is unbanned.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An unbanned account holding `user` only |
| ban reason | Chargeback dispute open, any reason the operator states |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Paste `<subject account>`'s user id into the search.
2. Choose Ban in the account's panel.
3. Enter `<ban reason>` and confirm.
4. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
5. Filter by subject id `<subject account>`.
6. Expand the ban row.

**Expected Results:**

* Step 5 lists the ban, naming the operator and `<subject account>` by user id, not by email.
* Step 6 shows `<ban reason>` and no secret.

<!-- trace:case id=g10.shared-audit.TC-ccj rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
### shared-auth-audit-US1-TC2-1: Refused ban is on the trail as unsuccessful

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* admin(does not hold `user:ban`) is signed in to the console.
* `<subject account>` is unbanned.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An unbanned account holding `user` only |

| Field | Value |
| --- | --- |
| grade10 admin api docs url | The Grade10 operator API documentation URL in the test environment; bind its URL only |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Send the users ban call, as `<grade10 admin api docs url>` lists it, for `<subject account>`.
2. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
3. Filter by subject id `<subject account>`.

**Expected Results:**

* Step 3 lists the ban attempt.
* The attempt is marked as not succeeded.

<!-- trace:case id=g10.shared-audit.TC-pss rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
### shared-auth-audit-US1-TC3-1: Session revoke is on the trail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `session:list` and `session:revoke`) is on `<grade10 admin users url>`.
* `<subject account>` is signed in on one browser.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An account signed in on one browser only |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Paste `<subject account>`'s user id into the search.
2. Revoke the session in the account's panel.
3. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
4. Filter by subject id `<subject account>`.

**Expected Results:**

* Step 4 lists the revoke, naming the operator and `<subject account>`.

<!-- trace:case id=g10.shared-audit.TC-api rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
### shared-auth-audit-US1-TC4-1: Directory and session lists write no trail entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:list` and `session:list`) is on `<grade10 admin users url>`.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An account signed in on one browser |
| start time | The time just before step 1 |
| operator id | The signed-in operator's user id |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Search the directory for `<subject account>`.
2. Read the sessions in `<subject account>`'s panel.
3. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
4. Filter by actor id `<operator id>`, from `<start time>`.

**Expected Results:**

* Step 4 lists no entry for the directory list.
* Step 4 lists no entry for the session list.

<!-- trace:case id=g10.shared-audit.TC-1g2 rev=1 covers=g10.shared-audit.SC-7ql,g10.shared-audit.SC-bks,g10.shared-audit.SC-hkt -->
### shared-auth-audit-US1-TC5-1: Collector sign-in and sign-out write no trail entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Recorded actions

**Pre-conditions:**

* customer is not signed in on `<grade10 store url>`.
* An unused, unexpired sign-in link has been emailed to `<collector email>`.

**Test data:**

| Field | Value |
| --- | --- |
| collector email | An inbox the tester reads, with an account holding `user` only |
| collector id | That account's user id |
| start time | The time just before step 1 |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |
| grade10 store url | The Grade10 storefront URL in the test environment; bind its URL only |

**Steps:**

1. Follow the sign-in link emailed to `<collector email>`.
2. Sign out on `<grade10 store url>`.
3. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
4. Filter by subject id `<collector id>`, from `<start time>`.
5. Filter by actor id `<collector id>`, from `<start time>`.

**Expected Results:**

* Step 4 lists no entry for the sign-in or the sign-out.
* Step 5 lists no entry for the sign-in or the sign-out.

<!-- trace:case id=g10.shared-audit.TC-6ic rev=1 covers=g10.shared-audit.SC-7ql,g10.shared-audit.SC-bks,g10.shared-audit.SC-hkt -->
### shared-auth-audit-US1-TC6-1: A trusted-product account or session read writes no trail entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Recorded actions

**Pre-conditions:**

* `<subject account>` exists and is signed in on one browser.

**Test data:**

| `<read request>` | `<expected outcome>` |
| --- | --- |
| Whether an account exists for `<subject email>` | No trail entry |
| The session of `<subject account>` | No trail entry |

| Field | Value |
| --- | --- |
| subject account | An account holding `user` only |
| subject email | That account's email |
| start time | The time just before step 1 |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Send `<read request>` as a trusted product.
2. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
3. Filter to the identity product, from `<start time>`.

**Expected Results:**

* Step 3 lists this outcome: `<expected outcome>`.

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

* The caller is `<caller>`.
* `<tester address>` is a tester address on staging.

**Test data:**

| Action | Caller |
| --- | --- |
| capture | the workflow |
| capture | QA token |
| expire | the workflow |
| expire | QA token |
| clear | the workflow |
| clear | QA token |

**Steps:**

1. Note the number of entries on the identity trail.
2. Call the test endpoint to `<action>` for `<tester address>` as `<caller>`.
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
* `<other address>` is not a tester address of the environment and holds no account.

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

<!-- trace:case id=g10.shared-audit.TC-etr rev=1 covers=g10.shared-audit.SC-31z,g10.shared-audit.SC-ren,g10.shared-audit.SC-2ig -->
### shared-auth-audit-US2-TC1-1: Auditor with the grant reads recorded identity actions

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* admin(holds `audit:read` only) is signed in to the console.
* At least one identity action is on the trail.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 admin audit url>`.
2. Filter to the identity product.

**Expected Results:**

* Step 2 lists the recorded identity actions.

<!-- trace:case id=g10.shared-audit.TC-afx rev=1 covers=g10.shared-audit.SC-31z,g10.shared-audit.SC-ren,g10.shared-audit.SC-2ig -->
### shared-auth-audit-US2-TC2-1: Consistency check reports without returning the proof

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* admin(holds `audit:read` only) is on `<grade10 admin audit url>`.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Run the verification on the identity chain.

**Expected Results:**

* Step 1 answers whether the chain is internally consistent.
* No proof of the check, such as a hash, is shown.

<!-- trace:case id=g10.shared-audit.TC-u48 rev=1 covers=g10.shared-audit.SC-31z,g10.shared-audit.SC-ren,g10.shared-audit.SC-2ig -->
### shared-auth-audit-US2-TC3-1: Caller without audit read is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* admin(holds `user:list`, does not hold `audit:read`) is signed in to the console.

**Test data:**

| Field | Value |
| --- | --- |
| grade10 admin api docs url | The Grade10 operator API documentation URL in the test environment; bind its URL only |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Navigate to `<grade10 admin audit url>`.
2. Send the identity trail check call, as `<grade10 admin api docs url>` lists it.

**Expected Results:**

* Step 1 is refused.
* Step 2 is refused.

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

**QA2 disposition:** over-claimed. The clause "The auditor sees no names" goes beyond Q52, which settles that the auditor sees user ids. The rest rests on the durable read and consistency scenarios and names the workflow's entry, which SC-38 states only in part.

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

<!-- trace:case id=g10.shared-audit.TC-75a rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1 -->
### shared-auth-audit-US3-TC1-1: Trail entry cannot be rewritten or removed

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* An identity action, `<trail entry>`, is on the trail.

**Test data:**

| Field | Value |
| --- | --- |
| trail entry | A recorded ban, any recorded identity action |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Send an edit of `<trail entry>` to the identity trail store.
2. Send a removal of `<trail entry>` to the identity trail store.
3. As admin(holds `audit:read`), read `<trail entry>` on `<grade10 admin audit url>`.

**Expected Results:**

* Step 3 shows `<trail entry>` unchanged.

<!-- trace:case id=g10.shared-audit.TC-2d0 rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1 -->
### shared-auth-audit-US3-TC2-1: Unrecorded ban does not take effect

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* admin(holds `user:ban`) is on `<grade10 admin users url>`.
* `<subject account>` is unbanned.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An unbanned account holding `user` only |
| ban reason | Chargeback dispute open, any reason the operator states |

| Field | Value |
| --- | --- |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Paste `<subject account>`'s user id into the search.
2. Choose Ban in the account's panel.
3. Enter `<ban reason>` and confirm.
4. Reload the account's panel.

**Expected Results:**

* Step 4 shows `<subject account>` not banned.

<!-- trace:case id=g10.shared-audit.TC-vfa rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1 -->
### shared-auth-audit-US3-TC3-1: Unrecorded revoke does not take effect

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* admin(holds `session:list` and `session:revoke`) is on `<grade10 admin users url>`.
* `<subject account>` is signed in on `<grade10 store url>` in `<subject browser>`.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An account signed in on one browser only |
| subject browser | The browser holding that session |

| Field | Value |
| --- | --- |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |
| grade10 store url | The Grade10 storefront URL in the test environment; bind its URL only |

**Steps:**

1. Paste `<subject account>`'s user id into the search.
2. Revoke the session in the account's panel.
3. Wait 70 seconds.
4. Reload `<grade10 store url>` in `<subject browser>`.

**Expected Results:**

* Step 4 shows `<subject account>` still signed in.

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

<!-- trace:case id=g10.shared-audit.TC-p7y rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC1-1: Trusted-product create is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* customer is not signed in on `<grade10 store url>`.
* No account holds `<new email>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| new email | new.buyer+20261007@example.com | An inbox the tester reads, held by no account |
| product | Any in-stock product on `<grade10 store url>` | · |
| test card | The staging shop's test card that pays successfully | · |
| start time | The time just before step 1 | · |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |
| grade10 store url | The Grade10 storefront URL in the test environment; bind its URL only |

**Steps:**

1. Add `<product>` to the cart on `<grade10 store url>`.
2. Check out as a guest with `<new email>`.
3. Pay with `<test card>`.
4. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
5. Filter to the identity product, from `<start time>`.

**Expected Results:**

* Step 5 lists the write for a new user id, with outcome `created`.
* The entry names the system as actor and the subject by user id, not by `<new email>`.

<!-- trace:case id=g10.shared-audit.TC-2mz rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC2-1: Already-existed find is not on the trail

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* customer is not signed in on `<grade10 store url>`.
* An account holds `<existing email>`, with standing `<account standing>`, created through `<account origin>`.

**Test data:**

| `<account standing>` | `<account origin>` | `<expected outcome>` |
| --- | --- | --- |
| Unverified | An earlier paid guest checkout with `<existing email>` | No trail entry |
| Verified | A sign-in with `<existing email>`, then a sign-out | No trail entry |

| Field | Value |
| --- | --- |
| existing email | An inbox the tester reads, holding the account in `<account standing>` |
| existing account id | That account's user id |
| product | Any in-stock product on `<grade10 store url>` |
| test card | The staging shop's test card that pays successfully |
| start time | The time just before step 1 |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |
| grade10 store url | The Grade10 storefront URL in the test environment; bind its URL only |

**Steps:**

1. Add `<product>` to the cart on `<grade10 store url>`.
2. Check out as a guest with `<existing email>`.
3. Pay with `<test card>`.
4. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
5. Filter by subject id `<existing account id>`, from `<start time>`.

**Expected Results:**

* Step 5 lists this outcome: `<expected outcome>`.

<!-- trace:case id=g10.shared-audit.TC-8lh rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC3-1: Verify flip is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* `<unverified email>` holds an unverified account.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| unverified email | unverified.buyer@example.com | an unverified account |
| unverified account id | That account's user id | · |
| start time | The time just before step 1 | · |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Send the trusted-product verify call for `<unverified email>`.
2. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
3. Filter by subject id `<unverified account id>`, from `<start time>`.

**Expected Results:**

* Step 3 lists the verify.

<!-- trace:case id=g10.shared-audit.TC-wuf rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC4-1: Trusted-product verify of a new email is on the trail as created

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* No account holds `<new verified email>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| new verified email | verified.buyer@example.com | any address no account holds |
| start time | The time just before step 1 | · |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Send the trusted-product verify call for `<new verified email>`.
2. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
3. Filter to the identity product, from `<start time>`.

**Expected Results:**

* Step 3 lists the write for the new user id, with outcome `created`.

<!-- trace:case id=g10.shared-audit.TC-jo4 rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC5-1: Trusted-product verify of an already-verified account is not on the trail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* A verified account holds `<existing email>`.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| existing email | existing.buyer@example.com | a verified account |
| existing account id | That account's user id | · |
| start time | The time just before step 1 | · |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Send the trusted-product verify call for `<existing email>`.
2. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
3. Filter by subject id `<existing account id>`, from `<start time>`.

**Expected Results:**

* Step 3 lists no entry for the request.

<!-- trace:case id=g10.shared-audit.TC-fvb rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC6-1: An unrecorded create, verify or delete does not land

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* The directory is seeded as follows: `<starting account>`.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| `<starting account>` | `<write request>` | `<expected outcome>` |
| --- | --- | --- |
| None at `<fresh email>` | Trusted-product create for `<fresh email>` | No account holds `<fresh email>` |
| Unverified at `<unverified email>` | Trusted-product verify for `<unverified email>` | The account at `<unverified email>` is still unverified |
| `<account to delete>` | admin(holds `user:delete`) deletes `<account to delete>` | `<account to delete>` still exists |

| Field | Value | Fixture notes |
| --- | --- | --- |
| fresh email | fresh.buyer@example.com | any address no account holds |
| unverified email | unverified.buyer@example.com | an unverified account |
| account to delete | An account holding `user` only | · |

**Steps:**

1. Send `<write request>`.
2. Read the directory for `<starting account>`.

**Expected Results:**

* Step 2 answers with this outcome: `<expected outcome>`.

<!-- trace:case id=g10.shared-audit.TC-36y rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC7-1: Deleting an account is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* admin(holds `user:delete`) is on `<grade10 admin users url>`.
* An operator's erasure request for `<account to delete>` has passed its seven-day window, and every product reports holding nothing of it.

**Test data:**

| Field | Value |
| --- | --- |
| account to delete | An account holding `user` only |
| deleted account id | That account's user id |
| start time | The time just before step 1 |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |
| grade10 admin users url | The Grade10 operator user-directory URL in the test environment; bind its URL only |

**Steps:**

1. Paste `<deleted account id>` into the search.
2. Open the erasure checklist in the account's panel.
3. Click delete login and confirm.
4. As admin(holds `audit:read`), open `<grade10 admin audit url>`.
5. Filter by subject id `<deleted account id>`, from `<start time>`.

**Expected Results:**

* Step 5 lists the deletion, naming the operator and `<deleted account id>`.

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

**QA2 disposition:** kept with a note. Repaired: the `test-endpoint-qa-token` row is removed (Q50). The create step is now a ban, because Q47 gives the endpoint no create action and Q20 has a ban create the account. The expected action is `ban`, not `created`, as Q53 settles. The case names no new user id, so it fully covers no scenario.

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

## shared-auth-audit-US5: Auditor traces a second-factor write

**As an** auditor,
**I want** enabling, disabling, or regenerating recovery codes on the identity trail,
**so that** a takeover of the second factor is a recorded write, without the codes.

<!-- trace:case id=g10.shared-audit.TC-kw1 rev=1 covers=g10.shared-audit.SC-nte,g10.shared-audit.SC-h1r,g10.shared-audit.SC-0sh,g10.shared-audit.SC-bgp,g10.shared-audit.SC-nr9,g10.shared-audit.SC-tl6,g10.shared-audit.SC-ccw,g10.shared-audit.SC-yjy,g10.shared-audit.SC-gkn -->
### shared-auth-audit-US5-TC1-1: Enable, disable, and regenerate are on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* `<subject account>` has no second factor and can enroll one.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An admin account with no second factor |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Start second-factor enrollment for `<subject account>`, without completing it.
2. Complete the enrollment, so the factor first becomes active.
3. Regenerate the recovery codes.
4. Remove the second factor.
5. As admin(holds `audit:read`), filter `<grade10 admin audit url>` by subject id `<subject account>`.

**Expected Results:**

* Step 5 lists no enable entry for step 1.
* Step 5 lists the enable, the regenerate and the disable, by user id.
* The regenerate entry keeps no recovery code.

<!-- trace:case id=g10.shared-audit.TC-e15 rev=1 covers=g10.shared-audit.SC-nte,g10.shared-audit.SC-h1r,g10.shared-audit.SC-0sh,g10.shared-audit.SC-bgp,g10.shared-audit.SC-nr9,g10.shared-audit.SC-tl6,g10.shared-audit.SC-ccw,g10.shared-audit.SC-yjy,g10.shared-audit.SC-gkn -->
### shared-auth-audit-US5-TC2-1: Failed enable record leaves the factor; later proof writes the missing enable

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* `<subject account>`'s second factor is becoming active.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| subject account | An admin account mid-enrollment |

| Field | Value |
| --- | --- |
| grade10 admin audit url | The Grade10 operator identity audit-trail URL in the test environment; bind its URL only |

**Steps:**

1. Complete the enrollment for `<subject account>`.
2. Read `<subject account>`'s second-factor state.
3. Restore the identity trail.
4. Complete a later successful second-factor proof as `<subject account>`.
5. As admin(holds `audit:read`), filter `<grade10 admin audit url>` by subject id `<subject account>`.

**Expected Results:**

* Step 1 does not succeed.
* Step 2 shows the factor active.
* Step 5 lists exactly one enable for that going live.

<!-- trace:case id=g10.shared-audit.TC-g5c rev=1 covers=g10.shared-audit.SC-nte,g10.shared-audit.SC-h1r,g10.shared-audit.SC-0sh,g10.shared-audit.SC-bgp,g10.shared-audit.SC-nr9,g10.shared-audit.SC-tl6,g10.shared-audit.SC-ccw,g10.shared-audit.SC-yjy,g10.shared-audit.SC-gkn -->
### shared-auth-audit-US5-TC3-1: An unrecorded regenerate or disable leaves the second factor as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* `<subject account>` has an active second factor and recovery codes `<current codes>`.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| `<act>` | `<expected outcome>` |
| --- | --- |
| Regenerate the recovery codes | The recovery codes are still `<current codes>` |
| Remove the second factor | The second factor is still active |

| Field | Value |
| --- | --- |
| subject account | An admin account with an active second factor |
| current codes | The recovery codes on file before step 1 |

**Steps:**

1. Send `<act>` for `<subject account>`.
2. Read `<subject account>`'s second-factor state.

**Expected Results:**

* Step 2 answers with this outcome: `<expected outcome>`.

## Reconciliation

**Run:** 2026-10-05 · blind cases for US-04 and US-05 reconciled against the scenario pass after identity-trail code shipped in grade10#219. Reviewed 2026-10-07.

| Case | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-auth-audit-US4-TC1-1`, `shared-auth-audit-US4-TC2-1` | Joined | their scenarios; walked in review through a guest checkout, which reaches the trusted-product create |
| `shared-auth-audit-US4-TC3-1` | Joined, then split | the blind case held the verify flip, the unrecorded writes and the delete; review split it into the verify flip, `shared-auth-audit-US4-TC6-1` for the unrecorded create, verify or delete, and `shared-auth-audit-US4-TC7-1` for the delete through the console erasure checklist |
| `shared-auth-audit-US4-TC4-1`, `shared-auth-audit-US4-TC5-1` | Case added | the verify of a new email recorded as created, and the verify of an already-verified account left off the trail |
| `shared-auth-audit-US5-TC1-1`, `shared-auth-audit-US5-TC2-1` | Joined | their scenarios |
| `shared-auth-audit-US5-TC3-1` | Case added | an unrecorded regenerate or disable leaves the second factor as it was |
| `shared-auth-audit-US1-TC5-1`, `shared-auth-audit-US1-TC6-1` | Case added in review | collector sign-in and sign-out, and trusted-product reads, stay off the trail. The run had left them out of suite on grade10's `identityTrail.spec`, which names no test for them |
| Uncovered anchors | none | |
| Contradicted readings | none | |

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

### Manual

None — every case runs as an automated test; the ones whose Testability names manual can also be walked by hand.
