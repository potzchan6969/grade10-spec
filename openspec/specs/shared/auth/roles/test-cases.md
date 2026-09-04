# shared/auth/roles Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-04, tcs-rules r2

## shared-auth-roles-US1: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

### shared-auth-roles-US1-TC1-2: Collector without an operator grant is user only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**
Signed in as a collector who has never been granted an operator role.

**Steps:**

1. Ask a product of this brand who is calling.

**Expected Results:**

* The caller's roles are `user` only.

### shared-auth-roles-US1-TC2-2: Unknown role name is dropped

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**
A signed-in person whose stored roles include a name that is not in the closed set.

**Steps:**

1. Ask a product of this brand who is calling.

**Expected Results:**

* That unknown name is not among the roles.

### shared-auth-roles-US1-TC3-2: User role cannot take an operator action

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**
Signed in as a person whose only role is `user`.

**Steps:**

1. Request an operator action.

**Expected Results:**

* The system refuses it.

---

## shared-auth-roles-US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

### shared-auth-roles-US2-TC1-2: Support cannot set roles but can still list and ban

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as an operator whose role is `support`.

**Steps:**

1. Try to set another person's roles.
2. List users, ban an account that is not admin, and list and revoke a non-admin session.

**Expected Results:**

* Setting roles is refused.
* Listing users, banning, and listing and revoking sessions still work.

### shared-auth-roles-US2-TC2-2: Staff cannot list or ban users

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as an operator whose role is `staff`.

**Steps:**

1. Try to list users.
2. Try to ban an account.

**Expected Results:**

* Both requests are refused.

### shared-auth-roles-US2-TC3-2: Unknown permission grants nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
A product checks a permission name that is not in the vocabulary.

**Steps:**

1. Request that action as any signed-in person.

**Expected Results:**

* The system refuses it.

### shared-auth-roles-US2-TC4-2: Staff can write the store and operate the auction catalog

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as an operator whose role is `staff`.

**Steps:**

1. Take a store write action.
2. Take an auction operate action.
3. Take an auction write action.

**Expected Results:**

* All three actions are allowed.

### shared-auth-roles-US2-TC5-2: Auditor reads the trail and nothing else

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as a person whose only operator role is `auditor`.

**Steps:**

1. Read the identity audit trail.
2. Try a ban, a store write, and a role change.

**Expected Results:**

* Reading the trail is allowed.
* The ban, store write, and role change are refused.

### shared-auth-roles-US2-TC6-2: Combined roles stack their grants

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as a person holding `support` and `staff`.

**Steps:**

1. List users.
2. Write to the store.

**Expected Results:**

* Both actions are allowed.

### shared-auth-roles-US2-TC7-2: Operator cannot widen what a role grants

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:set-role`.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Check what can be changed for another account.

**Expected Results:**

* Who holds a role can be changed.
* What that role grants cannot be changed.

### shared-auth-roles-US2-TC8-1: Reading a case is not reading its identity document

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**
Signed in as an operator holding `vault:read` and not `kyc:read`, on a vault case bound to an identity document.

**Steps:**

1. Open the vault case.
2. Ask for the identity document behind it.

**Expected Results:**

* The case is shown.
* The document is refused.

---

## shared-auth-roles-US3: Treasurer records the money a case owes and nothing else

**As a** treasurer,
**I want** to read a case and record its money and no more,
**so that** a payout takes two people, and nobody provisioned to type bank
references can open a customer's identity document.

### shared-auth-roles-US3-TC1-1: Staff run a case and cannot pay against it

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
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**
Signed in as an operator whose only role is `staff`.

**Steps:**

1. Run a vault case and a lending case.
2. Record a payout.
3. Record a repayment.
4. Record an auction payment.

**Expected Results:**

* The case actions are allowed.
* The payout, the repayment and the auction payment are all refused.

### shared-auth-roles-US3-TC2-1: Treasurer moves money and sees no identity document

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
* **Trace:** shared-auth-roles-US-03

**Pre-conditions:**
Signed in as an operator whose only role is `treasurer`, on a vault case bound to an identity document.

**Steps:**

1. Read the vault case.
2. Record its payout.
3. Ask for the identity document behind it.
4. Take a vault operate action on the case.

**Expected Results:**

* Reading the case and recording its payout are allowed.
* The identity document is refused.
* Running the case is refused.

---

## shared-auth-roles-US4: Shopkeeper spends a member's points at the till

**As a** shopkeeper working a till,
**I want** the till to identify a member and spend their points at the counter,
**so that** a member is served without anybody signing into an admin panel to do
it for them.

### shared-auth-roles-US4-TC1-1: No role holds a machine's grant

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
* **Trace:** shared-auth-roles-US-04

**Pre-conditions:**
Signed in as a person holding `admin`.

**Steps:**

1. Request an action a service principal is granted.

**Expected Results:**

* The system refuses it, because the grant is in no role's set.

### shared-auth-roles-US4-TC2-1: Till acts for a member without being one

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
* **Trace:** shared-auth-roles-US-04

**Pre-conditions:**
A till authenticated as a service principal, and a member holding a points balance.

**Steps:**

1. Identify the member at the till.
2. Spend that member's points at the counter.
3. Take the same two actions as a signed-in person.

**Expected Results:**

* The till's actions are allowed.
* The same actions are refused to every signed-in person.
