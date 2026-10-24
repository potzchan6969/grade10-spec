# shared/auth/audit Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-24, tcs-rules r7
**Reviewed:** 2026-10-23, tcs-rules r7, lapsed 2026-10-24

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.
* The trail is read on the console's identity audit trail page, filtered by subject or actor id from `<start time>`, the time just before the case's first step. Every entry names people by user id; no field of an expanded entry shows an email address, a token or a secret.
* `<tester address>` is a fresh plus-tag of the collector; the staging test-endpoint workflow acts on it as `test-endpoint-workflow`.

## Walk 1: An admin acts on an account and reads the trail

**Starting state:**

- admin(holds `user:list`, `user:ban`, `session:list`, `session:revoke` and `audit:read`) signed in on `<console url>`; `<subject account>` unbanned and signed in on one browser

**Shared test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | an account holding `user` only |

### Route

1. Search the directory for `<subject account>`, read its sessions, then ban it with reason `Chargeback dispute open`.
   - The ban is on the trail with its reason `shared.auth-audit.US1-TC1`
   - The search and the session read are not `shared.auth-audit.US1-TC2`
2. Run the trail's consistency check.
   - It answers whether the chain holds, showing no hash `shared.auth-audit.US2-TC1`

## shared.auth-audit.US1: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

<!-- trace:case id=g10.shared-audit.TC-63z rev=2 -->
### shared.auth-audit.US1-TC1: An operator's ban, unban, role change or revoke is on the trail, refused or not

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:ban`, `user:set-role`, `session:revoke` and `audit:read`) is signed in on `<console url>`.
* The row's account is in the row's state.

**Test data:**

| Act, from the account's panel in the user directory | Account | Trail entry |
| --- | --- | --- |
| ban, reason `Chargeback dispute open` | unbanned, holding `user` only | a ban, showing the reason |
| unban | banned, holding `user` only | an unban |
| give the account `staff` | holding `user` only | a role change |
| revoke its session | signed in on one browser | a revoke |
| ban | another account holding `admin` | a ban, marked not succeeded; the account is not banned |

**Steps:**

1. Do the row's act.
2. On the audit trail page, filter by the account's user id and expand the entry.

**Expected Results:**

* Step 2: the row's entry, naming the admin and the account by user id.

<!-- trace:case id=g10.shared-audit.TC-api rev=2 -->
### shared.auth-audit.US1-TC2: Reading accounts, signing in and out, and the test endpoint's reads write no entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Recorded actions

**Pre-conditions:**

* The row's person is in the row's place.
* admin(holds `audit:read`) can open the audit trail page in another browser.

**Test data:**

| Person | Act | Filtered by |
| --- | --- | --- |
| admin(holds `user:list` and `session:list`) on `<console url>` | search the directory for an account and read its sessions | the admin's user id |
| customer(holds an order), signed in on `<g10url>` | open `<g10url>/profile/orders`, open an order, then reload `<g10url>/profile` | the customer's user id |
| customer, signed out on `<g10url>`, with an unused sign-in link in their inbox | follow the link, then sign out | the customer's user id, as subject and as actor |
| the staging test-endpoint workflow | capture the collector's sign-in link, expire it, and clear the sign-in limits | the identity product |
| the staging QA token alone | ban the collector | the identity product |

**Steps:**

1. Do the row's act.
2. On the audit trail page, filter as the row says.

**Expected Results:**

* Step 2 lists no entry for the act.

### shared.auth-audit.US1-TC3: The test endpoint's writes are one entry each, under the caller's kind

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* The staging test-endpoint workflow has run the row's act at `<action time>`.
* admin(holds `audit:read`) is signed in on `<console url>`.

**Test data:**

| Act | Address | Trail entry |
| --- | --- | --- |
| ban | `<tester address>` | one ban |
| grant `admin` | the admin-only tester | one grant |
| grant the scoped role `staff` | `<tester address>` | one grant |
| ban | an address that is no tester and holds no account | one ban, marked not succeeded |

**Steps:**

1. On the audit trail page, filter to the identity product from `<action time>` and expand each entry.

**Expected Results:**

* The row's entry, naming `test-endpoint-workflow` where a user id would stand, and no address or token.

---

## shared.auth-audit.US2: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

<!-- trace:case id=g10.shared-audit.TC-etr rev=3 -->
### shared.auth-audit.US2-TC1: An auditor reads the trail and checks it holds, without being shown the proof

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* auditor(holds `audit:read` only) is signed in on `<console url>`.
* The trail holds an operator's ban and a ban the test-endpoint workflow made.

**Steps:**

1. Open the audit trail page and filter to the identity product.
2. Run the consistency check.

**Expected Results:**

* Step 1 lists the recorded actions; the workflow's ban names `test-endpoint-workflow` where a user id would stand, with no name or email address.
* Step 2 answers whether the chain is consistent, and shows no hash or other proof.

<!-- trace:case id=g10.shared-audit.TC-u48 rev=2 -->
### shared.auth-audit.US2-TC2: An operator without audit read is refused the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* staff(holds `user:list`, not `audit:read`) is signed in on `<console url>`.

**Steps:**

1. Look for the audit trail in the navigation, then open its address.

**Expected Results:**

* The navigation offers no audit trail; its address is refused, with no entry and no consistency check shown.

---

## shared.auth-audit.US3: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

<!-- trace:case id=g10.shared-audit.TC-2d0 rev=2 -->
### shared.auth-audit.US3-TC1: An act the trail cannot record does not take effect

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* The identity trail is made to refuse its next entry.
* admin(holds `user:ban`, `session:revoke`, `user:list` and `audit:read`) is signed in on `<console url>`.

**Test data:**

| Act | Afterwards |
| --- | --- |
| ban an unbanned account holding `user` only, from its panel | the panel, reloaded, shows it not banned |
| revoke the session of an account signed in on one browser, then wait 70 seconds | the account is still signed in on that browser |
| the test-endpoint workflow bans `<tester address>` | the account is not banned, and the trail lists no ban |
| the test-endpoint workflow grants `<tester address>` the scoped role `staff` | the account holds no `staff` role, and the trail lists no grant |

**Steps:**

1. Do the row's act.
2. Open the account in the user directory, and the audit trail page from `<start time>`.

**Expected Results:**

* Step 2: the row's outcome.

---

## shared.auth-audit.US4: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

<!-- trace:case id=g10.shared-audit.TC-p7y rev=2 -->
### shared.auth-audit.US4-TC1: An account's creation, verification and deletion are each on the trail

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* The row's starting account.
* admin(holds `user:list` and `audit:read`) is signed in on `<console url>`.

**Test data:**

| Starting account | Act | Trail entry |
| --- | --- | --- |
| none for `new.buyer+<run>@example.com` | a guest checkout on `<g10url>` with that address, paid with the staging shop's test card | `created`, the system as actor |
| an unverified account, from an earlier paid guest checkout | the hosted identity verification (e-KYC) on `<g10url>` with its address | a verify, the system as actor |
| an account holding `user` only, whose erasure window has passed and that every product reports holding nothing of | an operator holding `user:delete` selects delete login on its erasure checklist | a deletion, naming the operator |
| none for `<tester address>` | the test-endpoint workflow bans `<tester address>` | one ban under `test-endpoint-workflow`; the directory finds the account, banned |
| `<tester address>`'s account, from an earlier staging run | the next daily cleanup runs | one deletion under `test-endpoint-cleanup`; the directory finds no account |

**Steps:**

1. Do the row's act.
2. On the audit trail page, filter by the account's user id, or to the identity product for a new account, from `<start time>`.

**Expected Results:**

* Step 2: the row's entry, naming the account by user id and never by its address.

<!-- trace:case id=g10.shared-audit.TC-2mz rev=1 -->
### shared.auth-audit.US4-TC2: Finding an account that already exists writes no entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* customer is signed out on `<g10url>`; the row's account holds `<existing email>`.
* admin(holds `audit:read`) is signed in on `<console url>`.

**Test data:**

| Account |
| --- |
| unverified, from an earlier paid guest checkout with `<existing email>` |
| verified, from a sign-in with `<existing email>` then a sign-out |

**Steps:**

1. Check out as a guest on `<g10url>` with `<existing email>`, paying with the staging shop's test card.
2. On the audit trail page, filter by the account's user id from `<start time>`.

**Expected Results:**

* Step 2 lists no entry.

<!-- trace:case id=g10.shared-audit.TC-fvb rev=2 -->
### shared.auth-audit.US4-TC3: A creation or deletion the trail cannot record does not land

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* The identity trail is made to refuse its next entry.
* admin(holds `user:list`) is signed in on `<console url>`.

**Test data:**

| Act | Starting account | Afterwards |
| --- | --- | --- |
| a paid guest checkout on `<g10url>` with `<email>` | none holds `<email>` | still none holds `<email>` |
| delete login from the erasure checklist | holds `<email>`, past its erasure window, every product reporting nothing of it | it still holds `<email>` |

**Steps:**

1. Do the row's act.
2. Search the user directory for `<email>`.

**Expected Results:**

* Step 2: the row's outcome.

---

## shared.auth-audit.US5: Auditor traces a second-factor write

**As an** auditor,
**I want** enabling, disabling, or regenerating recovery codes on the identity trail,
**so that** a takeover of the second factor is a recorded write, without the codes.

<!-- trace:case id=g10.shared-audit.TC-kw1 rev=2 -->
### shared.auth-audit.US5-TC1: Turning the second factor on, regenerating its codes and turning it off are on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* admin(`<subject account>`) has no second factor and is signed in on `<console url>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject account>` | an operator account with no second factor |
| `<second-factor screen>` | ❓ the console screen where an operator enrols, regenerates and removes their second factor - the auth owner names it |

**Steps:**

1. On `<second-factor screen>`, start enrolment and stop before completing it.
2. Complete the enrolment, regenerate the recovery codes, then remove the second factor.
3. As admin(holds `audit:read`), filter the audit trail page by `<subject account>`'s user id from `<start time>`.

**Expected Results:**

* Step 3 lists an enable, a regenerate and a disable, and nothing for step 1.
* The regenerate, expanded, shows no recovery code.

<!-- trace:case id=g10.shared-audit.TC-e15 rev=2 -->
### shared.auth-audit.US5-TC2: A second-factor change the trail cannot record leaves the factor as it was

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* admin(`<subject account>`) is signed in on `<console url>`, with the row's factor before.
* The identity trail is made to refuse its next entry.

**Test data:**

| Factor before | Act | Factor afterwards |
| --- | --- | --- |
| enrolment started, not completed | complete the enrolment | active, with the enable not recorded |
| active, recovery codes `<current codes>` | regenerate the recovery codes | active, codes still `<current codes>` |
| active | remove the second factor | active |

**Steps:**

1. On `<second-factor screen>`, do the row's act.
2. Read the factor's state on `<second-factor screen>`.
3. For the first row: restore the trail, prove the second factor once at sign-in, then filter the audit trail page by `<subject account>`'s user id.

**Expected Results:**

* Step 1 is refused.
* Step 2: the row's factor afterwards.
* Step 3 lists exactly one enable.

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
