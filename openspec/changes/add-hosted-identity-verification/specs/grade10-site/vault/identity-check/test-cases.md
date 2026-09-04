# grade10-site/vault/identity-check Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-04, tcs-rules r2

## grade10-site-vault-identity-check-US1: Operator opens a case for a collector who verified before arriving

**As a** vault operator meeting a collector for their intake visit,
**I want** the case to already hold a verified identity and to say who checked
it,
**so that** the appointment starts at the item, and I can see at a glance
whether a check is on file, still out, or refused.

### grade10-site-vault-identity-check-US1-TC1-1: Booking an intake visit invites the user

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
`<an unverified case>` holds no verified identity and has nothing to reuse, and carries an email address and a mobile number.

**Test data:**

| Field | Value |
| --- | --- |
| `<an unverified case>` | A pre-custody vault case with no verified identity and no earlier check to reuse |

**Steps:**

1. Book an intake visit for `<an unverified case>`.
2. Read the contact details the invitation went to.

**Expected Results:**

* The user is invited to verify.
* The invitation goes to the contact details the case holds.

### grade10-site-vault-identity-check-US1-TC2-1: Case with no contact details is reported, not left silently unchecked

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**
`<an unverified case>` holds neither an email address nor a mobile number.

**Steps:**

1. Book an intake visit for `<an unverified case>`.
2. Read the case at `<grade10 admin vault case url>` as the admin.

**Expected Results:**

* No check is raised.
* The admin is told the contact details are missing.
* The case does not read as a check nobody answered.

### grade10-site-vault-identity-check-US1-TC3-1: Collector already verified is not asked again

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
The user on `<an unverified case>` holds a verified identity that is still valid.

**Steps:**

1. Book an intake visit for `<an unverified case>`.
2. Read the case's identity at `<grade10 admin vault case url>`.
3. Read what was sent to the user.

**Expected Results:**

* That identity is bound to the case.
* No invitation is sent.

### grade10-site-vault-identity-check-US1-TC4-1: Verified case names who performed the check

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
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**
`<a verified case>` is bound to a verified identity, and the admin holds `kyc:read`.

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

### grade10-site-vault-identity-check-US1-TC5-1: Case with a check out is not shown as unverified, and nothing waits on it

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
`<an unverified case>` holds a hosted check that has been invited and not decided.

**Steps:**

1. Open `<an unverified case>` at `<grade10 admin vault case url>`.
2. Read what the case says about its identity.
3. Book it, value it, and move it through the pre-custody statuses.

**Expected Results:**

* The case shows the check as out, not as having no identity.
* Booking, valuing and every pre-custody move are allowed while the check is out.

### grade10-site-vault-identity-check-US1-TC6-1: Binding a verdict voids an outstanding packet

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**
`<a verified case>` has a signing packet still out, rendered from an earlier identity.

**Steps:**

1. Deliver an approved verdict that binds a new identity to that case.
2. Read the outstanding packet.
3. Try to sign from it.

**Expected Results:**

* The outstanding packet is void.
* Nothing can be signed from it.

### grade10-site-vault-identity-check-US1-TC7-1: Preparing documents without an identity is refused

**Classification:**

* **Severity:** blocker
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
`<an unverified case>` holds no verified identity.

**Steps:**

1. Prepare the case's signing documents.
2. Read the refusal.

**Expected Results:**

* The request is refused.
* The refusal names the missing identity check.

### grade10-site-vault-identity-check-US1-TC8-1: Prepared document carries the bound identity's name

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
* **Trace:** grade10-site-vault-identity-check-US-01

**Pre-conditions:**
`<a verified case>` is bound to a verified identity whose legal name differs from the name an admin typed on the case.

**Steps:**

1. Prepare the case's signing documents.
2. Read the name printed on them.

**Expected Results:**

* The name printed is the bound identity's.
* Nothing typed on the case reaches the paper.

### grade10-site-vault-identity-check-US1-TC9-1: Packet whose identity moved cannot be sealed

**Classification:**

* **Severity:** blocker
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
`<a verified case>` holds a rendered packet that has not been sealed.

**Steps:**

1. Replace the case's identity.
2. Seal the packet.

**Expected Results:**

* Sealing is refused.
* The refusal says the paper names a person the case no longer says it is about.

### grade10-site-vault-identity-check-US1-TC10-1: Case identity state reads without the identity grant, its details do not

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
`<a verified case>` is bound to a verified identity, and the admin holds `vault:read` and not `kyc:read`.

**Steps:**

1. Open `<a verified case>` at `<grade10 admin vault case url>`.
2. Read everything the case returns.

**Expected Results:**

* The case shows that an identity is on file and who performed the check.
* No name, birth date, masked number, document image or refusal reason is returned.

---

## grade10-site-vault-identity-check-US2: Operator records a check at the counter

**As a** vault operator whose collector arrives unverified,
**I want** to check the document in front of me and carry on,
**so that** a refused, lapsed or never-started check costs the visit nothing,
and a check that overrides a refusal says so on the case.

### grade10-site-vault-identity-check-US2-TC1-1: Operator asks for a check on a case that needs one

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
`<an unverified case>` holds no verified identity and no live check, and the admin holds `vault:operate`.

**Steps:**

1. Open `<an unverified case>` at `<grade10 admin vault case url>`.
2. Ask for an identity check.

**Expected Results:**

* The user is invited.

### grade10-site-vault-identity-check-US2-TC2-1: Staff verify a collector who arrives unverified

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
`<an unverified case>` has a user arriving with no verified identity, and the admin holds `vault:operate`.

**Steps:**

1. Open `<an unverified case>` at `<grade10 admin vault case url>`.
2. Record the identity check with the document in hand.
3. Move the case on to signing.

**Expected Results:**

* The case holds a verified identity.
* The case can proceed to signing.

### grade10-site-vault-identity-check-US2-TC3-1: Counter check is refused once the item is in custody

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
The case holds the status named by the row, and the admin holds `vault:operate`.

Runs once per row of **Test data**.

**Test data:**

| Case status |
| --- |
| `vaulted` |
| `active` |
| `repaid` |
| `released` |

**Steps:**

1. Record an identity check for the case.
2. Read the refusal.

**Expected Results:**

* Recording is refused.
* The refusal says a release reads the identity the executed agreement already holds.

### grade10-site-vault-identity-check-US2-TC4-1: Override of a refused check takes the approving grant

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-identity-check-US-02

**Pre-conditions:**
`<an unverified case>` is pre-custody and its last hosted check was Declined.

**Steps:**

1. Record a counter check as an admin holding `vault:operate` and not `vault:approve`.
2. Record it again as an admin holding `vault:approve`, giving a reason.
3. Read the case at `<grade10 admin vault case url>`.

**Expected Results:**

* Step 1 is refused.
* Step 2 is recorded.
* The reason shows on the case beside the declined check.

---

## grade10-site-vault-identity-check-US3: Operator settles a verdict that lands after the case has moved

**As a** vault operator on a case whose hosted verdict arrived late,
**I want** the case to keep the identity it already holds and to tell me what
landed,
**so that** nothing signed, vaulted or erased is disturbed by a check that
finished too late.

### grade10-site-vault-identity-check-US3-TC1-1: Verdict landing after custody begins is refused

**Classification:**

* **Severity:** blocker
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
The case holds the status named by the row and an identity it was vaulted under, and a hosted check raised while it was pre-custody is still out.

Runs once per row of **Test data**.

**Test data:**

| Case status |
| --- |
| `vaulted` |
| `active` |
| `repaid` |
| `released` |

**Steps:**

1. Deliver an approved verdict for that case.
2. Read the case's identity at `<grade10 admin vault case url>`.
3. Read what the admin was told.

**Expected Results:**

* The case keeps the identity it was vaulted under.
* The identity the verdict created is discarded.
* The admin is told the check landed and was refused, and why.

### grade10-site-vault-identity-check-US3-TC2-1: Verdict landing on sealed evidence is refused

**Classification:**

* **Severity:** blocker
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
The case holds a sealed signing packet and a hosted check that is still out.

**Steps:**

1. Deliver an approved verdict for that case.
2. Read the case's identity.

**Expected Results:**

* The case keeps the identity that evidence was executed under.
* The new identity is discarded.

### grade10-site-vault-identity-check-US3-TC3-1: Verdict landing on an erased case is refused

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-identity-check-US-03

**Pre-conditions:**
The case's personal data has been erased, and a hosted check raised before the erasure is still out.

**Steps:**

1. Deliver an approved verdict for that case.
2. Read the case's identity and the evidence store.

**Expected Results:**

* Nothing is bound.
* The identity the verdict created is discarded with its evidence.
* The erasure is not undone by the check that was in flight.

### grade10-site-vault-identity-check-US3-TC4-1: Verdict landing on a case verified elsewhere is refused

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
The case bound an identity at the counter after its hosted check was raised, and holds a packet rendered from it.

**Steps:**

1. Deliver the hosted check's approved verdict.
2. Read the case's identity and its packets.

**Expected Results:**

* The case keeps the identity the admin recorded.
* The verdict's identity is discarded.
* No packet is voided.

### grade10-site-vault-identity-check-US3-TC5-1: Displaced identity is settled rather than left behind

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
* **Trace:** grade10-site-vault-identity-check-US-03

**Pre-conditions:**
`<a verified case>` is bound to one identity and holds a hosted check that is still out.

**Steps:**

1. Deliver an approved verdict that binds another identity to the case.
2. Read the displaced identity before the vault settles it.
3. Read it again once the new binding stands.

**Expected Results:**

* The displaced identity is on file until the vault settles it.
* It is discarded once the new binding stands.
* No image of a document is left behind unbound.

### grade10-site-vault-identity-check-US3-TC6-1: Refused landing leaves no half-finished state

**Classification:**

* **Severity:** blocker
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
An approved verdict has been refused on landing.

**Steps:**

1. Read the case's identity.
2. Read the identity the verdict created and its evidence.
3. Read the check's state and reason.

**Expected Results:**

* The case's identity is the one it held before.
* The identity the verdict created is purged with its evidence.
* The check reads Declined with the reason recorded, and no identity is left bound to nothing.
