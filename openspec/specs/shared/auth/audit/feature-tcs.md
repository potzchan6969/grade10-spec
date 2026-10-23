# shared/auth/audit Test Cases

**Status:** approved · 12/12
**Reviewed:** 2026-10-23, tcs-rules r7
**Out of suite (api):** shared-auth-audit-SC-29, shared-auth-audit-SC-35, shared-auth-audit-SC-36, shared-auth-audit-SC-37

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

<!-- trace:case id=g10.shared-audit.TC-pss rev=1 covers=g10.shared-audit.SC-s5y,g10.shared-audit.SC-hya,g10.shared-audit.SC-6pa,g10.shared-audit.SC-pgv,g10.shared-audit.SC-m8q,g10.shared-audit.SC-qhl,g10.shared-audit.SC-r4t,g10.shared-audit.SC-jbf -->
### shared-auth-audit-US1-TC3-1: Session revoke is on the trail

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

---

## shared-auth-audit-US3: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

<!-- trace:case id=g10.shared-audit.TC-2d0 rev=1 covers=g10.shared-audit.SC-r7d,g10.shared-audit.SC-1rb,g10.shared-audit.SC-ci1 -->
### shared-auth-audit-US3-TC2-1: Unrecorded ban does not take effect

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

<!-- trace:case id=g10.shared-audit.TC-36y rev=1 covers=g10.shared-audit.SC-06a,g10.shared-audit.SC-88n,g10.shared-audit.SC-2og,g10.shared-audit.SC-fa1,g10.shared-audit.SC-f32,g10.shared-audit.SC-osr,g10.shared-audit.SC-ubk,g10.shared-audit.SC-tej,g10.shared-audit.SC-oue,g10.shared-audit.SC-7no,g10.shared-audit.SC-5fv -->
### shared-auth-audit-US4-TC7-1: Deleting an account is on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
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

---

## shared-auth-audit-US5: Auditor traces a second-factor write

**As an** auditor,
**I want** enabling, disabling, or regenerating recovery codes on the identity trail,
**so that** a takeover of the second factor is a recorded write, without the codes.

## Reconciliation

**Run:** 2026-10-05 · blind cases for US-04 and US-05 reconciled against the scenario pass after identity-trail code shipped in grade10#219. Reviewed 2026-10-07.

| Case | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-auth-audit-US4-TC1-1`, `shared-auth-audit-US4-TC2-1` | Joined | their scenarios; walked in review through a guest checkout, which reaches the trusted-product create |
| `shared-auth-audit-US4-TC3-1` | Joined, then split | the blind case held the verify flip, the unrecorded writes and the delete; review split it into the verify flip, `shared-auth-audit-US4-TC6-1` for the unrecorded create, verify or delete, and `shared-auth-audit-US4-TC7-1` for the delete through the console erasure checklist |
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
