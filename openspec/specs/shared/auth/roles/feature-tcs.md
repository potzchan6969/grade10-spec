# shared/auth/roles Test Cases

**Status:** approved
**Reviewed:** 2026-10-01, tcs-rules r4

## shared-auth-roles-US1: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

### shared-auth-roles-US1-TC1-1: Collector without an operator grant is user only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(has never been granted an operator role) is signed in on <grade10 store url>.

**Steps:**

1. Read who is calling.

**Expected Results:**

* The caller's roles are `user` only.

### shared-auth-roles-US1-TC2-1: Unknown role name is dropped

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(stored roles include <unknown role>) is signed in on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| <unknown role> | intern |

**Steps:**

1. Read who is calling.

**Expected Results:**

* `intern` is not among the caller's roles.

### shared-auth-roles-US1-TC3-1: User role cannot take an operator action

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(roles are `user` only) is signed in.

**Steps:**

1. On <grade10 admin users url>, try to ban an account.

**Expected Results:**

* The ban is refused.

### shared-auth-roles-US1-TC4-1: Admin console rejects a user sign-in

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** exploratory
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-roles-US-01

**Pre-conditions:**

* customer(roles are `user` only) is signed out.

**Test data:**

| Field | Value |
| --- | --- |
| <collector email> | collector@example.com, an address whose roles are `user` only |

**Steps:**

1. Sign in as <collector email> on <grade10 admin url>.

**Expected Results:**

* The admin console rejects the sign-in.

---

## shared-auth-roles-US2: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

### shared-auth-roles-US2-TC1-1: Support cannot set roles but can still list and ban

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `support`) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | An account that does not hold `admin` |
| <subject session> | A session of an account that does not hold `admin` |

**Steps:**

1. On <grade10 admin users url>, try to change another account's roles.
2. List the accounts.
3. Ban <subject user id>.
4. End <subject session>.

**Expected Results:**

* The role change is refused.
* Listing accounts, the ban, and ending the session are allowed.

### shared-auth-roles-US2-TC2-1: Staff cannot list or ban users

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `staff`) is signed in.

**Steps:**

1. On <grade10 admin users url>, try to list accounts.
2. Try to ban an account.

**Expected Results:**

* The list is refused.
* The ban is refused.

### shared-auth-roles-US2-TC3-1: Unknown permission grants nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* A signed-in person is on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| <unknown permission> | store:explode |

**Steps:**

1. Request an action that requires <unknown permission>.

**Expected Results:**

* The action is refused.

### shared-auth-roles-US2-TC4-1: Staff can write the store and operate the auction catalog

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `staff`) is signed in.

**Steps:**

1. Write a store record on <grade10 admin url>.
2. Operate the auction catalog on <grade10 admin auction catalog url>.

**Expected Results:**

* The store write is allowed.
* The auction operate action is allowed.

### shared-auth-roles-US2-TC5-1: Auditor reads the trail and nothing else

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(only operator role is `auditor`) is signed in.

**Steps:**

1. Read the identity audit trail on <grade10 admin audit url>.
2. On <grade10 admin users url>, try to ban an account.
3. Try a store write on <grade10 admin url>.
4. Try to change another account's roles.

**Expected Results:**

* Reading the trail is allowed.
* The ban, the store write, and the role change are refused.

### shared-auth-roles-US2-TC6-1: Combined roles stack their grants

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
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(holds `support` and `staff`) is signed in.

**Steps:**

1. List accounts on <grade10 admin users url>.
2. Write a store record on <grade10 admin url>.

**Expected Results:**

* The list is allowed.
* The store write is allowed.

### shared-auth-roles-US2-TC7-1: Operator cannot widen what a role grants

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(holds `user:set-role`) is signed in.

**Steps:**

1. Open another account on <grade10 admin users url>.
2. Read what can be changed for that account.

**Expected Results:**

* Who holds a role can be changed.
* What that role grants cannot be changed.

### shared-auth-roles-US2-TC8-1: Admin can record a refund

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `admin`) is signed in.

**Steps:**

1. Request a refund, which requires `auction:refund`, on <grade10 admin auction url>.

**Expected Results:**

* The refund is allowed.

### shared-auth-roles-US2-TC9-1: Settlement permission is not required for a refund

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-roles-US-02

**Pre-conditions:**

* admin(role `staff`) is signed in.
* That caller holds refund processing and does not hold payment settlement.

**Steps:**

1. Request a refund, which requires `auction:refund`, on <grade10 admin auction url>.
2. Read the caller's grants.

**Expected Results:**

* The refund is allowed.
* The caller does not hold `auction:settle`.
