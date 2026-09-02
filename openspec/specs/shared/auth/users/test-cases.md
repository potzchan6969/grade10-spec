# shared/auth/users Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## users-US1: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

### users-US1-TC1-1: Granted operator lists accounts by user id

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** users-US-01

**Pre-conditions:**
Signed in as an operator who holds `user:list`.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Check the listed accounts.

**Expected Results:**

* Accounts from this brand's identity system are listed.
* Each account is named by user id.

### users-US1-TC2-1: Caller without the list grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-01

**Pre-conditions:**
Signed in as a person who does not hold `user:list`.

**Steps:**

1. Try to list accounts.

**Expected Results:**

* The system refuses the request.
* No account records are returned.

### users-US1-TC3-1: Search matches email without letter case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** users-US-01

**Pre-conditions:**
Signed in as an operator who can list users. An account email is known.

**Test data:**

| Field | Value |
| --- | --- |
| Search fragment | <email fragment in a different letter case than the account> |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Search the directory with that fragment.

**Expected Results:**

* Results are accounts whose email contains that fragment.

### users-US1-TC4-1: Account opens by user id

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-01

**Pre-conditions:**
Signed in as an operator who can list users.

**Steps:**

1. Open the account for <a subject user id>.

**Expected Results:**

* That account is received.
* A different account that shares an email attribute is not received.

### users-US1-TC5-1: Banned account stays in the directory

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-01

**Pre-conditions:**
<a subject user id> is banned. Signed in as an operator who can list users.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Check whether that account is listed.

**Expected Results:**

* That account is still listed.

---

## users-US2: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, and a mistaken ban is reversible.

### users-US2-TC1-1: Ban stops money-moving and sign-in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:ban`. <a subject user id> is unbanned and signed in.

**Steps:**

1. Ban <a subject user id>.
2. Try a money-moving action as that person.
3. Complete a sign-in method as that person.
4. Ask a product who is calling on that person's existing session.

**Expected Results:**

* That person cannot complete a money-moving action.
* Completing a sign-in method does not sign them in.
* A product reading who is calling reports no person.

### users-US2-TC2-1: Unban lets the person sign in again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** users-US-02

**Pre-conditions:**
<a subject user id> is banned. Signed in as an operator who can ban.

**Steps:**

1. Unban <a subject user id>.
2. Complete a sign-in method as that person.

**Expected Results:**

* That person can sign in again.

### users-US2-TC3-1: Caller without the ban grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-02

**Pre-conditions:**
Signed in as an operator who does not hold `user:ban`. <a subject user id> is unbanned.

**Steps:**

1. Try to ban <a subject user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

### users-US2-TC4-1: Operator cannot ban themselves

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:ban`.

**Steps:**

1. Try to ban the operator's own account.

**Expected Results:**

* The system refuses the request.
* Their account remains unbanned.

### users-US2-TC5-1: Support cannot ban an admin

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-02

**Pre-conditions:**
Signed in as an operator whose role is `support`. <an admin user id> holds `admin`.

**Steps:**

1. Try to ban <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

### users-US2-TC6-1: Last admin cannot be banned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-02

**Pre-conditions:**
Signed in as an operator who can ban. <an admin user id> is the only account that holds `admin`.

**Steps:**

1. Try to ban <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

---

## users-US3: Operator changes another person's roles

**As an** admin,
**I want** to set another person's roles without changing my own or stranding the last admin,
**so that** grants stay a closed set I cannot widen from the call site.

### users-US3-TC1-1: Admin sets another account to staff

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** users-US-03

**Pre-conditions:**
Signed in as an operator who holds `user:set-role`.

**Steps:**

1. Navigate to <grade10 admin users url> for <a subject user id>.
2. Set that account to `staff`.

**Expected Results:**

* That account's roles include `staff`.

### users-US3-TC2-1: Clearing operator roles leaves a user

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-03

**Pre-conditions:**
Signed in as an operator who can set roles. <a subject user id> holds an operator role.

**Steps:**

1. Save that account with no operator role selected.

**Expected Results:**

* That account's roles are `user` only.

### users-US3-TC3-1: Support cannot set roles

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-03

**Pre-conditions:**
Signed in as an operator who holds `user:ban` but not `user:set-role`.

**Steps:**

1. Try to change another account's roles.

**Expected Results:**

* The system refuses the request.
* The roles are unchanged.

### users-US3-TC4-1: Operator cannot change their own roles

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-03

**Pre-conditions:**
Signed in as an operator who holds `user:set-role`.

**Steps:**

1. Try to change the operator's own roles.

**Expected Results:**

* The system refuses the request.
* Their roles are unchanged.

### users-US3-TC5-1: Last admin keeps admin

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** users-US-03

**Pre-conditions:**
Signed in as an operator who can set roles. <an admin user id> is the only account that holds `admin`.

**Steps:**

1. Save that account without `admin`.

**Expected Results:**

* That account still holds `admin`.
