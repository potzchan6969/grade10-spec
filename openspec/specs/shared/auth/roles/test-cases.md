# shared/auth/roles Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## roles-US1: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

### roles-US1-TC1-1: Collector without an operator grant is user only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** roles-US-01

**Pre-conditions:**
Signed in as a collector who has never been granted an operator role.

**Steps:**

1. Ask a product of this brand who is calling.

**Expected Results:**

* The caller's roles are `user` only.

### roles-US1-TC2-1: Unknown role name is dropped

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** roles-US-01

**Pre-conditions:**
A signed-in person whose stored roles include a name that is not in the closed set.

**Steps:**

1. Ask a product of this brand who is calling.

**Expected Results:**

* That unknown name is not among the roles.

### roles-US1-TC3-1: User role cannot take an operator action

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** roles-US-01

**Pre-conditions:**
Signed in as a person whose only role is `user`.

**Steps:**

1. Request an operator action.

**Expected Results:**

* The system refuses it.

---

## roles-US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

### roles-US2-TC1-1: Support cannot set roles but can still list and ban

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** roles-US-02

**Pre-conditions:**
Signed in as an operator whose role is `support`.

**Steps:**

1. Try to set another person's roles.
2. List users, ban an account that is not admin, and list and revoke a non-admin session.

**Expected Results:**

* Setting roles is refused.
* Listing users, banning, and listing and revoking sessions still work.

### roles-US2-TC2-1: Staff cannot list or ban users

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** roles-US-02

**Pre-conditions:**
Signed in as an operator whose role is `staff`.

**Steps:**

1. Try to list users.
2. Try to ban an account.

**Expected Results:**

* Both requests are refused.

### roles-US2-TC3-1: Unknown permission grants nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** roles-US-02

**Pre-conditions:**
A product checks a permission name that is not in the vocabulary.

**Steps:**

1. Request that action as any signed-in person.

**Expected Results:**

* The system refuses it.

### roles-US2-TC4-1: Staff can write the store and operate the auction catalog

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** roles-US-02

**Pre-conditions:**
Signed in as an operator whose role is `staff`.

**Steps:**

1. Take a store write action.
2. Take an auction operate action.

**Expected Results:**

* Both actions are allowed.

### roles-US2-TC5-1: Auditor reads the trail and nothing else

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** roles-US-02

**Pre-conditions:**
Signed in as a person whose only operator role is `auditor`.

**Steps:**

1. Read the identity audit trail.
2. Try a ban, a store write, and a role change.

**Expected Results:**

* Reading the trail is allowed.
* The ban, store write, and role change are refused.

### roles-US2-TC6-1: Combined roles stack their grants

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** roles-US-02

**Pre-conditions:**
Signed in as a person holding `support` and `staff`.

**Steps:**

1. List users.
2. Write to the store.

**Expected Results:**

* Both actions are allowed.

### roles-US2-TC7-1: Operator cannot widen what a role grants

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** roles-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:set-role`.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Check what can be changed for another account.

**Expected Results:**

* Who holds a role can be changed.
* What that role grants cannot be changed.
