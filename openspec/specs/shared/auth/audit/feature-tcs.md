# shared/auth/audit Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.
* The trail is read on the console's identity audit trail page, filtered by subject or actor id, or to the identity product, from `<start time>`, the moment before a case's first step. Every entry names people by user id; no expanded entry shows an email address, a token or a secret.
* `<tester address>` is a fresh plus-tag of the collector; the staging test-endpoint workflow acts on it as `test-endpoint-workflow`.
* `<second-factor screen>` is ❓ the console screen where an operator enrols, regenerates and removes their second factor - the auth owner names it.

## Walk 1: An admin acts on an account and reads the trail

Starting state:

- admin(holds `user:list`, `user:ban`, `session:list`, `session:revoke` and `audit:read`) signed in on `<console url>`; `<subject account>` unbanned and signed in on one browser.

Shared test data:

| Field | Value |
| --- | --- |
| subject account | an account holding `user` only |

### Route

1. Search the directory for `<subject account>`, read its sessions, then ban it with reason Chargeback dispute open; filter the trail by its user id.
   - The ban is on the trail with its reason, and the search and the session read are not. `shared.auth-audit.US1-TC1`
2. Run the trail's consistency check.
   - It answers whether the chain holds, showing no hash. `shared.auth-audit.US2-TC1`

## shared.auth-audit.US1: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

<!-- trace:case id=g10.shared-audit.TC-63z rev=2 -->
### shared.auth-audit.US1-TC1: Each ban, unban, role change or revoke is one entry naming its actor, refused or not

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-01

**Pre-conditions:**

* admin(holds `user:ban`, `user:set-role`, `session:revoke` and `audit:read`) is signed in on `<console url>`; `<account>` is as the row says.

**Test data:**

| `<actor>` | `<act>` | `<account>` | `<entry>` |
| --- | --- | --- | --- |
| the admin, from the account's panel | ban, reason Chargeback dispute open | unbanned, holding `user` only | a ban with the reason, naming the admin |
| the admin | unban | banned, holding `user` only | an unban, naming the admin |
| the admin | give it `staff` | holding `user` only | a role change, naming the admin |
| the admin | revoke its session | signed in on one browser | a revoke, naming the admin |
| the admin | ban | another account holding `admin` | a ban marked not succeeded; the account not banned |
| the test-endpoint workflow | ban | `<tester address>` | one ban under `test-endpoint-workflow` |
| the test-endpoint workflow | grant `admin` | the admin-only tester | one grant under `test-endpoint-workflow` |
| the test-endpoint workflow | grant the scoped role `staff` | `<tester address>` | one grant under `test-endpoint-workflow` |
| the test-endpoint workflow | ban | an address that is no tester and holds no account | one ban marked not succeeded |

**Steps:**

1. Have `<actor>` do `<act>` on `<account>`.
2. Filter the trail by the account's user id, or to the identity product for the workflow, and expand the entry.

**Expected Results:**

* Step 2 shows exactly `<entry>`, naming the account by user id and never by address or token.

<!-- trace:case id=g10.shared-audit.TC-api rev=2 -->
### shared.auth-audit.US1-TC2: Reading accounts, signing in and out, and the test endpoint's reads write no entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Recorded actions

**Pre-conditions:**

* `<person>` is as the row says; admin(holds `audit:read`) has the trail open in another browser.

**Test data:**

| `<person>` | `<act>` | `<filtered by>` |
| --- | --- | --- |
| admin(holds `user:list` and `session:list`) on `<console url>` | search the directory and read an account's sessions | the admin's user id |
| customer(holds an order), signed in on `<g10url>` | open the orders, an order, then reload the profile | the customer's user id |
| customer, signed out, with an unused sign-in link | follow the link, then sign out | the customer's user id, as subject and as actor |
| the staging test-endpoint workflow | capture the collector's link, expire it, and clear the sign-in limits | the identity product |
| the staging QA token alone | ban the collector | the identity product |

**Steps:**

1. Do `<act>`.
2. Filter the trail by `<filtered by>`.

**Expected Results:**

* Step 2 lists no entry for the act.

---

## shared.auth-audit.US2: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

<!-- trace:case id=g10.shared-audit.TC-etr rev=3 -->
### shared.auth-audit.US2-TC1: An auditor reads the trail in UTC and checks it holds, without being shown the proof

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-02

**Pre-conditions:**

* auditor(holds `audit:read` only) is signed in on `<console url>`, on a machine set to America/New_York; the trail holds an operator's ban at 2026-10-07T01:30:00Z and a ban the test-endpoint workflow made.

**Steps:**

1. Open the trail, filtered to the identity product.
2. Run the consistency check.

**Expected Results:**

* Step 1 lists the actions; the workflow's ban names `test-endpoint-workflow` where a user id would stand, with no name or email; the operator's ban reads 01:30 on 7 Oct, UTC, never 09:30 or 21:30 on 6 Oct.
* Step 2 answers whether the chain is consistent, showing no hash or other proof.

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

* The navigation offers none; the address is refused, with no entry and no consistency check.

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
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-03

**Pre-conditions:**

* The identity trail is made to refuse its next entry; admin(holds `user:ban`, `session:revoke`, `user:list`, `user:delete` and `audit:read`) is signed in on `<console url>`.

**Test data:**

| `<act>` | `<afterwards>` |
| --- | --- |
| ban an unbanned account holding `user` only | its panel, reloaded, shows it not banned |
| revoke the session of an account signed in on one browser, then wait 70 seconds | the account still signed in |
| the test-endpoint workflow bans `<tester address>` | not banned, and no ban on the trail |
| the test-endpoint workflow grants `<tester address>` `staff` | no `staff` role, and no grant on the trail |
| a paid guest checkout on `<g10url>` with an address no account holds | still no account for that address |
| delete login from the erasure checklist of an account past its window, every product reporting nothing of it | the account still holds its address |
| the operator completes enrolling a second factor on `<second-factor screen>` | refused; once the trail is restored and the factor proved at sign-in, the trail lists exactly one enable |
| the operator regenerates their recovery codes | refused; the codes unchanged |
| the operator removes their second factor | refused; the factor still active |

**Steps:**

1. Do `<act>`.
2. Read the account in the user directory, or `<second-factor screen>`, and the trail from `<start time>`.

**Expected Results:**

* Step 2 shows `<afterwards>`.

---

## shared.auth-audit.US4: Auditor traces an account lifecycle write

**As an** auditor,
**I want** a new user id, a verify that flips, and an account deletion on the identity trail,
**so that** a dispute can name how that user id appeared or left, without the email.

<!-- trace:case id=g10.shared-audit.TC-p7y rev=2 -->
### shared.auth-audit.US4-TC1: An account's creation, verification and deletion are each one entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* `<starting account>`; admin(holds `user:list` and `audit:read`) is signed in on `<console url>`.

**Test data:**

| `<starting account>` | `<act>` | `<entry>` |
| --- | --- | --- |
| none for new.buyer+run@example.com | a guest checkout on `<g10url>` with it, paid with the staging test card | created, the system as actor |
| an unverified account from an earlier paid guest checkout | the hosted identity verification on `<g10url>` with its address | a verify, the system as actor |
| holding `user` only, past its erasure window, every product reporting nothing of it | an operator holding `user:delete` selects delete login on its erasure checklist | a deletion, naming the operator |
| none for `<tester address>` | the test-endpoint workflow bans it | one ban under `test-endpoint-workflow`; the directory finds it banned |
| `<tester address>`'s account from an earlier staging run | the next daily cleanup runs | one deletion under `test-endpoint-cleanup`; the directory finds none |

**Steps:**

1. Do `<act>`.
2. Filter the trail by the account's user id, or to the identity product for a new account.

**Expected Results:**

* Step 2 shows `<entry>`, naming the account by user id, never by address.

<!-- trace:case id=g10.shared-audit.TC-2mz rev=1 -->
### shared.auth-audit.US4-TC2: Checking out with an address that already has an account writes no entry

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-04

**Pre-conditions:**

* customer is signed out on `<g10url>`; `<account>` holds the address used; admin(holds `audit:read`) is signed in on `<console url>`.

**Test data:**

| `<account>` |
| --- |
| unverified, from an earlier paid guest checkout |
| verified, from a sign-in and a sign-out |

**Steps:**

1. Check out as a guest with the address, paying with the staging test card.
2. Filter the trail by the account's user id.

**Expected Results:**

* Step 2 lists no entry.

---

## shared.auth-audit.US5: Auditor traces a second-factor write

**As an** auditor,
**I want** enabling, disabling, or regenerating recovery codes on the identity trail,
**so that** a takeover of the second factor is a recorded write, without the codes.

<!-- trace:case id=g10.shared-audit.TC-kw1 rev=2 -->
### shared.auth-audit.US5-TC1: Turning the second factor on, regenerating its codes and turning it off are each on the trail

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-audit-US-05

**Pre-conditions:**

* admin(`<subject account>`, an operator with no second factor) is signed in on `<console url>`.

**Steps:**

1. On `<second-factor screen>`, start enrolling and stop before completing.
2. Complete the enrolment, regenerate the recovery codes, then remove the second factor.
3. As admin(holds `audit:read`), filter the trail by `<subject account>`'s user id.

**Expected Results:**

* Step 3 lists an enable, a regenerate and a disable, and nothing for step 1; the regenerate, expanded, shows no recovery code.

## Reconciliation

- **Covered at domain** - `shared.auth-dmn.US3-TC1`, `US4-TC1`, `US5-TC1` and `US6-TC1` each walk an operator's act, or a refusal, landing on the trail by user id
