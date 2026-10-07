# shared/auth/audit Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-05, tcs-rules r4

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

* admin(holds `user:ban`) is on <grade10 admin users url>.
* <subject account> is unbanned.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An unbanned account holding `user` only |
| `<ban reason>` | Chargeback dispute open, any reason the operator states |

**Steps:**

1. Paste <subject account>'s user id into the search.
2. Choose Ban in the account's panel.
3. Enter <ban reason> and confirm.
4. As admin(holds `audit:read`), open <grade10 admin audit url>.
5. Filter by subject id <subject account>.
6. Expand the ban row.

**Expected Results:**

* Step 5 lists the ban, naming the operator and <subject account> by user id, not by email.
* Step 6 shows <ban reason> and no secret.

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
* <subject account> is unbanned.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An unbanned account holding `user` only |

**Steps:**

1. Send the users ban call, as <grade10 admin api docs url> lists it, for <subject account>.
2. As admin(holds `audit:read`), open <grade10 admin audit url>.
3. Filter by subject id <subject account>.

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

* admin(holds `session:list` and `session:revoke`) is on <grade10 admin users url>.
* <subject account> is signed in on one browser.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account signed in on one browser only |

**Steps:**

1. Paste <subject account>'s user id into the search.
2. Revoke the session in the account's panel.
3. As admin(holds `audit:read`), open <grade10 admin audit url>.
4. Filter by subject id <subject account>.

**Expected Results:**

* Step 4 lists the revoke, naming the operator and <subject account>.

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

* admin(holds `user:list` and `session:list`) is on <grade10 admin users url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account signed in on one browser |
| `<start time>` | The time just before step 1 |
| `<operator id>` | The signed-in operator's user id |

**Steps:**

1. Search the directory for <subject account>.
2. Read the sessions in <subject account>'s panel.
3. As admin(holds `audit:read`), open <grade10 admin audit url>.
4. Filter by actor id <operator id>, from <start time>.

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

* customer is not signed in on <grade10 store url>.
* An unused, unexpired sign-in link has been emailed to <collector email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<collector email>` | An inbox the tester reads, with an account holding `user` only |
| `<collector id>` | That account's user id |
| `<start time>` | The time just before step 1 |

**Steps:**

1. Follow the sign-in link emailed to <collector email>.
2. Sign out on <grade10 store url>.
3. As admin(holds `audit:read`), open <grade10 admin audit url>.
4. Filter by subject id <collector id>, from <start time>.
5. Filter by actor id <collector id>, from <start time>.

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

* <subject account> exists and is signed in on one browser.

**Test data:**

| Read sent by a trusted product | Outcome |
| --- | --- |
| Whether an account exists for <subject email> | No trail entry |
| The session of <subject account> | No trail entry |

| Field | Value |
| --- | --- |
| `<subject account>` | An account holding `user` only |
| `<subject email>` | That account's email |
| `<start time>` | The time just before step 1 |

**Steps:**

1. Send the row's read as a trusted product.
2. As admin(holds `audit:read`), open <grade10 admin audit url>.
3. Filter to the identity product, from <start time>.

**Expected Results:**

* Step 3 lists as the row's outcome states.

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

**Steps:**

1. Navigate to <grade10 admin audit url>.
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

* admin(holds `audit:read` only) is on <grade10 admin audit url>.

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

**Steps:**

1. Navigate to <grade10 admin audit url>.
2. Send the identity trail check call, as <grade10 admin api docs url> lists it.

**Expected Results:**

* Step 1 is refused.
* Step 2 is refused.

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

* An identity action, <trail entry>, is on the trail.

**Test data:**

| Field | Value |
| --- | --- |
| `<trail entry>` | A recorded ban, any recorded identity action |

**Steps:**

1. Send an edit of <trail entry> to the identity trail store.
2. Send a removal of <trail entry> to the identity trail store.
3. As admin(holds `audit:read`), read <trail entry> on <grade10 admin audit url>.

**Expected Results:**

* Step 3 shows <trail entry> unchanged.

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

* admin(holds `user:ban`) is on <grade10 admin users url>.
* <subject account> is unbanned.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An unbanned account holding `user` only |
| `<ban reason>` | Chargeback dispute open, any reason the operator states |

**Steps:**

1. Paste <subject account>'s user id into the search.
2. Choose Ban in the account's panel.
3. Enter <ban reason> and confirm.
4. Reload the account's panel.

**Expected Results:**

* Step 4 shows <subject account> not banned.

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

* admin(holds `session:list` and `session:revoke`) is on <grade10 admin users url>.
* <subject account> is signed in on <grade10 store url> in <subject browser>.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An account signed in on one browser only |
| `<subject browser>` | The browser holding that session |

**Steps:**

1. Paste <subject account>'s user id into the search.
2. Revoke the session in the account's panel.
3. Wait 70 seconds.
4. Reload <grade10 store url> in <subject browser>.

**Expected Results:**

* Step 4 shows <subject account> still signed in.

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

* customer is not signed in on <grade10 store url>.
* No account holds <new email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<new email>` | An inbox the tester reads, held by no account, for example new.buyer+20261007@example.com |
| `<product>` | Any in-stock product on <grade10 store url> |
| `<test card>` | The staging shop's test card that pays successfully |
| `<start time>` | The time just before step 1 |

**Steps:**

1. Add <product> to the cart on <grade10 store url>.
2. Check out as a guest with <new email>.
3. Pay with <test card>.
4. As admin(holds `audit:read`), open <grade10 admin audit url>.
5. Filter to the identity product, from <start time>.

**Expected Results:**

* Step 5 lists the write for a new user id, with outcome `created`.
* The entry names the system as actor and the subject by user id, not by <new email>.

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

* customer is not signed in on <grade10 store url>.
* An account holds <existing email>, in the row's standing.

**Test data:**

| Account at `<existing email>` | How it was made | Outcome |
| --- | --- | --- |
| Unverified | An earlier paid guest checkout with <existing email> | No trail entry |
| Verified | A sign-in with <existing email>, then a sign-out | No trail entry |

| Field | Value |
| --- | --- |
| `<existing email>` | An inbox the tester reads, holding the row's account |
| `<existing account id>` | That account's user id |
| `<product>` | Any in-stock product on <grade10 store url> |
| `<test card>` | The staging shop's test card that pays successfully |
| `<start time>` | The time just before step 1 |

**Steps:**

1. Add <product> to the cart on <grade10 store url>.
2. Check out as a guest with <existing email>.
3. Pay with <test card>.
4. As admin(holds `audit:read`), open <grade10 admin audit url>.
5. Filter by subject id <existing account id>, from <start time>.

**Expected Results:**

* Step 5 lists as the row's outcome states.

<!-- trace:case id=g10.shared-audit.TC-8lh rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC3-1: Verify flip and delete are on the trail

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

* <unverified email> holds an unverified account.
* <account to delete> exists.

**Test data:**

| Field | Value |
| --- | --- |
| `<unverified email>` | unverified.buyer@example.com, an unverified account |
| `<unverified account id>` | That account's user id |
| `<account to delete>` | An account holding `user` only |
| `<deleted account id>` | That account's user id |
| `<start time>` | The time just before step 1 |

**Steps:**

1. Send the trusted-product verify call for <unverified email>.
2. As admin(holds `user:delete`), delete <account to delete>.
3. As admin(holds `audit:read`), open <grade10 admin audit url>.
4. Filter by subject id <unverified account id>, from <start time>.
5. Filter by subject id <deleted account id>, from <start time>.

**Expected Results:**

* Step 4 lists the verify.
* Step 5 lists the deletion, naming the operator and <deleted account id>.

<!-- trace:case id=g10.shared-audit.TC-wuf rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC4-1: Trusted-product verify of a new email is on the trail as created

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

* No account holds <new verified email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<new verified email>` | verified.buyer@example.com, any address no account holds |
| `<start time>` | The time just before step 1 |

**Steps:**

1. Send the trusted-product verify call for <new verified email>.
2. As admin(holds `audit:read`), open <grade10 admin audit url>.
3. Filter to the identity product, from <start time>.

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

* A verified account holds <existing email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<existing email>` | existing.buyer@example.com, a verified account |
| `<existing account id>` | That account's user id |
| `<start time>` | The time just before step 1 |

**Steps:**

1. Send the trusted-product verify call for <existing email>.
2. As admin(holds `audit:read`), open <grade10 admin audit url>.
3. Filter by subject id <existing account id>, from <start time>.

**Expected Results:**

* Step 3 lists no entry for the request.

<!-- trace:case id=g10.shared-audit.TC-fvb rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC6-1: An unrecorded create, verify or delete does not land

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* The row's starting account exists, or does not.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Starting account | Write sent | Outcome |
| --- | --- | --- |
| None at <fresh email> | Trusted-product create for <fresh email> | No account holds <fresh email> |
| Unverified at <unverified email> | Trusted-product verify for <unverified email> | The account at <unverified email> is still unverified |
| <account to delete> | admin(holds `user:delete`) deletes <account to delete> | <account to delete> still exists |

| Field | Value |
| --- | --- |
| `<fresh email>` | fresh.buyer@example.com, any address no account holds |
| `<unverified email>` | unverified.buyer@example.com, an unverified account |
| `<account to delete>` | An account holding `user` only |

**Steps:**

1. Send the row's write.
2. Read the row's account.

**Expected Results:**

* Step 2 answers as the row's outcome states.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* <subject account> has no second factor and can enroll one.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An admin account with no second factor |

**Steps:**

1. Start second-factor enrollment for <subject account>, without completing it.
2. Complete the enrollment, so the factor first becomes active.
3. Regenerate the recovery codes.
4. Remove the second factor.
5. As admin(holds `audit:read`), filter <grade10 admin audit url> by subject id <subject account>.

**Expected Results:**

* Step 5 lists no enable entry for step 1.
* Step 5 lists the enable, the regenerate and the disable, by user id.
* The regenerate entry keeps no recovery code.

<!-- trace:case id=g10.shared-audit.TC-e15 rev=1 covers=g10.shared-audit.SC-nte,g10.shared-audit.SC-h1r,g10.shared-audit.SC-0sh,g10.shared-audit.SC-bgp,g10.shared-audit.SC-nr9,g10.shared-audit.SC-tl6,g10.shared-audit.SC-ccw,g10.shared-audit.SC-yjy,g10.shared-audit.SC-gkn -->
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

* <subject account>'s second factor is becoming active.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | An admin account mid-enrollment |

**Steps:**

1. Complete the enrollment for <subject account>.
2. Read <subject account>'s second-factor state.
3. Restore the identity trail.
4. Complete a later successful second-factor proof as <subject account>.
5. As admin(holds `audit:read`), filter <grade10 admin audit url> by subject id <subject account>.

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
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* <subject account> has an active second factor and recovery codes <current codes>.
* The identity trail is mocked to refuse a new entry.

**Test data:**

| Act | Outcome |
| --- | --- |
| Regenerate the recovery codes | The recovery codes are still <current codes> |
| Remove the second factor | The second factor is still active |

| Field | Value |
| --- | --- |
| `<subject account>` | An admin account with an active second factor |
| `<current codes>` | The recovery codes on file before step 1 |

**Steps:**

1. Send the row's act for <subject account>.
2. Read <subject account>'s second-factor state.

**Expected Results:**

* Step 2 answers as the row's outcome states.

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
