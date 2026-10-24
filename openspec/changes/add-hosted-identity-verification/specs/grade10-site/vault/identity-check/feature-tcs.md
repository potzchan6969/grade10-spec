# grade10-site/vault/identity-check Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-09-04, tcs-rules r2

## grade10-site-vault-identity-check-US1: Operator opens a case for a collector who verified before arriving

**As a** vault operator meeting a collector for their intake visit,
**I want** the case to already hold a verified identity and to say who checked
it,
**so that** the appointment starts at the item, and I can see at a glance
whether a check is on file, still out, or refused.

<!-- trace:case id=g10.vault-identity-check.TC-90f rev=2 covers=g10.vault-identity-check.SC-m0i,g10.vault-identity-check.SC-ryc,g10.vault-identity-check.SC-9le,g10.vault-identity-check.SC-fp3,g10.vault-identity-check.SC-fai,g10.vault-identity-check.SC-t29,g10.vault-identity-check.SC-8g9,g10.vault-identity-check.SC-2ye,g10.vault-identity-check.SC-74a,g10.vault-identity-check.SC-ic9 -->
### grade10-site-vault-identity-check-US1-TC1-2: Booking an intake visit invites the user

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a case with no check>` holds no verified identity and has nothing to reuse.
* The case holds `<the case's email address>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with no check>` | A pre-custody vault case with no verified identity, nothing to reuse and no live check |
| `<the case's email address>` | The email address the case holds for its user |

**Steps:**

1. Book an intake visit for `<a case with no check>`.
2. Read where the invitation was sent.

**Expected Results:**

* The user is invited to verify.
* The invitation goes to `<the case's email address>`.

<!-- trace:case id=g10.vault-identity-check.TC-7kk rev=2 covers=g10.vault-identity-check.SC-m0i,g10.vault-identity-check.SC-ryc,g10.vault-identity-check.SC-9le,g10.vault-identity-check.SC-fp3,g10.vault-identity-check.SC-fai,g10.vault-identity-check.SC-t29,g10.vault-identity-check.SC-8g9,g10.vault-identity-check.SC-2ye,g10.vault-identity-check.SC-74a,g10.vault-identity-check.SC-ic9 -->
### grade10-site-vault-identity-check-US1-TC2-2: Case nobody can be invited on is reported

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
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* A pre-custody vault case holds no verified identity and is missing what the row names.

**Test data:**

| What the case is missing | Outcome |
| --- | --- |
| It names no person | No check is raised; the admin is told why |
| It holds no email address | No check is raised; the admin is told why |

**Steps:**

1. Book an intake visit for that case.
2. Read the case at `<grade10 admin vault case url>` as the admin.

**Expected Results:**

* No check is raised.
* The admin is told why it could not be raised.
* The case does not read as a check nobody answered.

<!-- trace:case id=g10.vault-identity-check.TC-6vt rev=1 covers=g10.vault-identity-check.SC-m0i,g10.vault-identity-check.SC-ryc,g10.vault-identity-check.SC-9le,g10.vault-identity-check.SC-fp3,g10.vault-identity-check.SC-fai,g10.vault-identity-check.SC-t29,g10.vault-identity-check.SC-8g9,g10.vault-identity-check.SC-2ye,g10.vault-identity-check.SC-74a,g10.vault-identity-check.SC-ic9 -->
### grade10-site-vault-identity-check-US1-TC3-1: User already verified is not asked again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a case whose user is verified>` holds no bound identity.
* Its user holds a verified identity that is still valid.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case whose user is verified>` | A pre-custody vault case with no bound identity, whose user holds a valid verified identity |

**Steps:**

1. Book an intake visit for `<a case whose user is verified>`.
2. Read the case's identity at `<grade10 admin vault case url>`.
3. Read what was sent to the user.

**Expected Results:**

* That identity is bound to the case.
* No invitation is sent.

<!-- trace:case id=g10.vault-identity-check.TC-nwd rev=1 covers=g10.vault-identity-check.SC-m0i,g10.vault-identity-check.SC-ryc,g10.vault-identity-check.SC-9le,g10.vault-identity-check.SC-fp3,g10.vault-identity-check.SC-fai,g10.vault-identity-check.SC-t29,g10.vault-identity-check.SC-8g9,g10.vault-identity-check.SC-2ye,g10.vault-identity-check.SC-74a,g10.vault-identity-check.SC-ic9 -->
### grade10-site-vault-identity-check-US1-TC4-1: Verified case names who performed the check

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a verified case>` is bound to a verified identity.
* The admin holds `kyc:read`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified case>` | A pre-custody vault case bound to an identity a provider verified |

**Steps:**

1. Open `<a verified case>` at `<grade10 admin vault case url>`.
2. Read what the case says about its identity.

**Expected Results:**

* The case shows whether Grade10 staff or a provider performed the check.
* The case shows when it was performed and what the provider found.

<!-- trace:case id=g10.vault-identity-check.TC-n6f rev=2 covers=g10.vault-identity-check.SC-m0i,g10.vault-identity-check.SC-ryc,g10.vault-identity-check.SC-9le,g10.vault-identity-check.SC-fp3,g10.vault-identity-check.SC-fai,g10.vault-identity-check.SC-t29,g10.vault-identity-check.SC-8g9,g10.vault-identity-check.SC-2ye,g10.vault-identity-check.SC-74a,g10.vault-identity-check.SC-ic9 -->
### grade10-site-vault-identity-check-US1-TC5-2: Case with a check out is not shown as unverified

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a case with a check out>` holds a hosted check that has been invited and not decided.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with a check out>` | A pre-custody vault case whose hosted check is Invited and undecided |

**Steps:**

1. Open `<a case with a check out>` at `<grade10 admin vault case url>`.
2. Read what the case says about its identity.
3. Book an intake visit for it.
4. Record a valuation on it.
5. Move it through the pre-custody statuses.

**Expected Results:**

* The case shows the check as out, not as having no identity.
* The case can be booked, valued and moved exactly as a case with no check out.

---

## grade10-site-vault-identity-check-US2: Operator records a check at the counter

**As a** vault operator whose collector arrives unverified,
**I want** to check the document in front of me and carry on,
**so that** a refused, lapsed or never-started check costs the visit nothing,
and a check that overrides a refusal says so on the case.

<!-- trace:case id=g10.vault-identity-check.TC-me8 rev=1 covers=g10.vault-identity-check.SC-qcf,g10.vault-identity-check.SC-9xs,g10.vault-identity-check.SC-q5q,g10.vault-identity-check.SC-3wt -->
### grade10-site-vault-identity-check-US2-TC1-1: Admin asks for a check on a case that needs one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-02

**Pre-conditions:**

* `<a case with no check>` holds no verified identity and no live check.
* The admin holds `vault:operate`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with no check>` | A pre-custody vault case with no verified identity, nothing to reuse and no live check |

**Steps:**

1. Open `<a case with no check>` at `<grade10 admin vault case url>`.
2. Ask for an identity check.

**Expected Results:**

* The user is invited.
* The case shows the check as out.

<!-- trace:case id=g10.vault-identity-check.TC-wtn rev=1 covers=g10.vault-identity-check.SC-qcf,g10.vault-identity-check.SC-9xs,g10.vault-identity-check.SC-q5q,g10.vault-identity-check.SC-3wt -->
### grade10-site-vault-identity-check-US2-TC2-1: Admin verifies a user who arrives unverified

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-02

**Pre-conditions:**

* `<a case with no check>` has a user arriving with no verified identity.
* The admin holds `vault:operate`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with no check>` | A pre-custody vault case with no verified identity, nothing to reuse and no live check |

**Steps:**

1. Open `<a case with no check>` at `<grade10 admin vault case url>`.
2. Record the identity check with the document in hand.
3. Move the case on to signing.

**Expected Results:**

* The case holds a verified identity.
* The case can proceed to signing.

<!-- trace:case id=g10.vault-identity-check.TC-saw rev=2 covers=g10.vault-identity-check.SC-qcf,g10.vault-identity-check.SC-9xs,g10.vault-identity-check.SC-q5q,g10.vault-identity-check.SC-3wt -->
### grade10-site-vault-identity-check-US2-TC4-2: Override of a refused check carries a reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-02

**Pre-conditions:**

* `<a case declined>` is pre-custody and its last hosted check was Declined.
* The admin holds `vault:operate` and is on `<grade10 admin vault case url>` for that case.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case declined>` | A pre-custody vault case whose last hosted check was Declined |
| `<the override reason>` | The reason the admin gives for checking the document at the counter |

**Steps:**

1. Record a counter check giving no reason.
2. Record the same counter check giving `<the override reason>`.
3. Read the case at `<grade10 admin vault case url>`.

**Expected Results:**

* The check offered with no reason is refused.
* The check carrying `<the override reason>` is recorded, naming the admin who gave it.
* `<the override reason>` is recorded on the case's history, and the case shows the counter check standing over the declined check.

---

## grade10-site-vault-identity-check-US3: Operator settles a verdict that lands after the case has moved

**As a** vault operator on a case whose hosted verdict arrived late,
**I want** the case to keep the identity it already holds and to tell me what
landed,
**so that** nothing signed, vaulted or erased is disturbed by a check that
finished too late.
