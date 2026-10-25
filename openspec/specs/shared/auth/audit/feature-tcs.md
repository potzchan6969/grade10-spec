# shared/auth/audit Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* `<g10url>` is the Grade10 site and `<console url>` the Grade10 console of the environment under test.
* The trail is read on the console's identity audit trail page, filtered by subject or actor id, or to the identity product, from `<start time>`, the moment before a case's first step. Every entry names people by user id; no expanded entry shows an email address, a token or a secret.
* An operator's acts on the Users page, an auditor's reading of Audit, and who may open it are walked in the console's own suites; these cases hold the trail's rules that span the site, the checkout and the console.
* `<second-factor screen>` is ❓ the console screen where an operator enrols, regenerates and removes their second factor - the auth owner names it.

## shared.auth-audit.US1: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

<!-- trace:case id=g10.shared-audit.TC-api rev=2 -->
### shared.auth-audit.US1-TC2: A collector reading their orders, or signing in and out, writes no entry

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
| customer(holds an order), signed in on `<g10url>` | open the orders, an order, then reload the profile | the customer's user id |
| customer, signed out, with an unused sign-in link | follow the link, then sign out | the customer's user id, as subject and as actor |

**Steps:**

1. Do `<act>`.
2. Filter the trail by `<filtered by>`.

**Expected Results:**

* Step 2 lists no entry for the act.

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

**Steps:**

1. Do `<act>`.
2. Filter the trail by the account's user id.

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

