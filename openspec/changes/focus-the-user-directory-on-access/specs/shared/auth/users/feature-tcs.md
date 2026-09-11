# shared/auth/users Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## shared-auth-users-US4: Operator finds the accounts they mean

**As an** operator who can list users,
**I want** to search by the name I was given and narrow the directory to the
accounts I mean,
**so that** I can reach one person from a ticket, and answer who holds a role,
without reading every account.

### shared-auth-users-US4-TC1-1: Search matches a name without letter case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory holds <account whose name is not in its email>.

**Test data:**

| Field | Value |
| --- | --- |
| <name fragment> | Part of that account's name, different letter case |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Search with <name fragment>.

**Expected Results:**

* That account is among the results.

### shared-auth-users-US4-TC2-1: Directory narrows to a role

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
* **Trace:** shared-auth-users-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory holds accounts with and without `admin`.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Narrow to accounts that hold `admin`.

**Expected Results:**

* Every listed account holds `admin`.
* An account that holds no operator role is not listed.

### shared-auth-users-US4-TC3-1: Two narrowings and chosen order apply

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory holds banned and unbanned `support` accounts, and accounts that joined on different days.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Narrow to banned accounts that hold `support`.
3. Order by when the account joined, oldest first.
4. Clear the order choice.

**Expected Results:**

* After step 2 every listed account is banned and holds `support`.
* After step 3 accounts are oldest first.
* After step 4 accounts are newest first.
