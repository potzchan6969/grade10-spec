# grade10-site/vault/identity-check Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-04, tcs-rules r2

## grade10-site-vault-identity-check-US1: Operator opens a case for a collector who verified before arriving

**As a** vault operator meeting a collector for their intake visit,
**I want** the case to already hold a verified identity and to say who checked
it,
**so that** the appointment starts at the item, and I can see at a glance
whether a check is on file, still out, or refused.

### grade10-site-vault-identity-check-US1-TC1-2: Booking an intake visit invites the user

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-vault-identity-check-US1-TC2-2: Case nobody can be invited on is reported

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-vault-identity-check-US1-TC3-1: User already verified is not asked again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-vault-identity-check-US1-TC4-1: Verified case names who performed the check

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
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

### grade10-site-vault-identity-check-US1-TC5-2: Case with a check out is not shown as unverified

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-vault-identity-check-US1-TC6-1: Binding a verdict voids an outstanding packet

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a verified case with a packet out>` has a signing packet still out, rendered from an earlier identity.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified case with a packet out>` | A pre-custody vault case bound to an earlier identity, its signing packet still out |

**Steps:**

1. Deliver an approved verdict that binds a new identity to that case.
2. Read the outstanding packet.
3. Try to sign from it.

**Expected Results:**

* The outstanding packet is void.
* Nothing can be signed from it.

### grade10-site-vault-identity-check-US1-TC7-1: Preparing documents without an identity is refused

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
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a case with no check>` holds no verified identity.

**Test data:**

| Field | Value |
| --- | --- |
| `<a case with no check>` | A pre-custody vault case with no verified identity, nothing to reuse and no live check |

**Steps:**

1. Prepare the case's signing documents.
2. Read the refusal.

**Expected Results:**

* The request is refused.
* The refusal names the missing identity check.

### grade10-site-vault-identity-check-US1-TC8-1: Prepared document carries the bound identity's name

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a verified case with a typed name>` is bound to a verified identity whose legal name differs from the name an admin typed on the case.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified case with a typed name>` | A pre-custody vault case bound to a verified identity whose legal name differs from the name typed on the case |

**Steps:**

1. Prepare the case's signing documents.
2. Read the name printed on them.

**Expected Results:**

* The name printed is the bound identity's.
* Nothing typed on the case reaches the paper.

### grade10-site-vault-identity-check-US1-TC9-1: Packet whose identity moved cannot be sealed

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a verified case with a rendered packet>` holds a rendered packet that has not been sealed.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified case with a rendered packet>` | A pre-custody vault case bound to a verified identity, holding a rendered packet that is not sealed |

**Steps:**

1. Replace the case's identity.
2. Seal the packet.

**Expected Results:**

* Sealing is refused.
* The packet is not sealed.

### grade10-site-vault-identity-check-US1-TC10-2: Case identity state reads without the identity grant, its details do not

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**

* `<a verified case>` is bound to a verified identity.
* The admin holds `vault:read` and not `kyc:read`.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified case>` | A pre-custody vault case bound to an identity a provider verified |

**Steps:**

1. Request `<a verified case>` as that admin.
2. Read every field the case returns.

**Expected Results:**

* The case shows that an identity is on file and who performed the check.
* No name, birth date, masked number, document image, provider finding or refusal reason is returned.

---

## grade10-site-vault-identity-check-US2: Operator records a check at the counter

**As a** vault operator whose collector arrives unverified,
**I want** to check the document in front of me and carry on,
**so that** a refused, lapsed or never-started check costs the visit nothing,
and a check that overrides a refusal says so on the case.

### grade10-site-vault-identity-check-US2-TC1-1: Admin asks for a check on a case that needs one

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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

### grade10-site-vault-identity-check-US2-TC2-1: Admin verifies a user who arrives unverified

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
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

### grade10-site-vault-identity-check-US2-TC3-2: Counter check is refused once the item is in custody

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
* **Trace:** grade10-site-vault-identity-check-US-02

**Pre-conditions:**

* A vault case holds the status named by the row.
* The admin holds `vault:operate`.

**Test data:**

| Case status | Outcome |
| --- | --- |
| `vaulted` | Refused; the case's identity is unchanged |
| `active` | Refused; the case's identity is unchanged |
| `repaid` | Refused; the case's identity is unchanged |
| `released` | Refused; the case's identity is unchanged |
| `declined` | Refused; the case's identity is unchanged |
| `cancelled` | Refused; the case's identity is unchanged |
| `expired` | Refused; the case's identity is unchanged |
| `forfeited` | Refused; the case's identity is unchanged |

**Steps:**

1. Record an identity check for the case.
2. Read the refusal.

**Expected Results:**

* Recording is refused.
* The case's identity is unchanged.

### grade10-site-vault-identity-check-US2-TC4-2: Override of a refused check carries a reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
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
* `<the override reason>` shows on the case beside the declined check.

---

## grade10-site-vault-identity-check-US3: Operator settles a verdict that lands after the case has moved

**As a** vault operator on a case whose hosted verdict arrived late,
**I want** the case to keep the identity it already holds and to tell me what
landed,
**so that** nothing signed, vaulted or erased is disturbed by a check that
finished too late.

### grade10-site-vault-identity-check-US3-TC1-2: Verdict landing on a case that has moved is refused

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
* **Trace:** grade10-site-vault-identity-check-US-03

**Pre-conditions:**

* A vault case is in the condition the row names.
* A hosted check raised before the case moved is still out.

**Test data:**

| Landing condition | Outcome |
| --- | --- |
| Past recording — `vaulted`, `active`, `repaid`, `released`, `declined`, `cancelled`, `expired` or `forfeited` | The case keeps the identity it was vaulted under, and the admin is told |
| A sealed signing packet on the case | The case keeps the identity that evidence was executed under |
| The case's personal data erased | Nothing is bound, and the erasure is not undone |
| An identity bound at the counter since the check was raised | The case keeps the identity the admin recorded, and no packet is voided |

**Steps:**

1. Deliver an approved verdict for that case.
2. Read the case's identity.
3. Read the identity the verdict created and its evidence.
4. Read the check's state and what the admin was told.

**Expected Results:**

* The row's outcome holds.
* The case's identity is the one it held before, and the identity the verdict created is purged with its evidence.
* The check reads Declined with the reason recorded, and no identity is left bound to nothing.

### grade10-site-vault-identity-check-US3-TC5-1: Displaced identity is settled rather than left behind

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-03

**Pre-conditions:**

* `<a verified case with a check out>` is bound to one identity and holds a hosted check that is still out.

**Test data:**

| Field | Value |
| --- | --- |
| `<a verified case with a check out>` | A pre-custody vault case bound to one identity, its hosted check still out |

**Steps:**

1. Deliver an approved verdict that binds another identity to the case.
2. Read the displaced identity before the vault settles it.
3. Read it again once the new binding stands.

**Expected Results:**

* The displaced identity is on file until the vault settles it.
* It is discarded once the new binding stands.
* No image of a document is left behind unbound.
