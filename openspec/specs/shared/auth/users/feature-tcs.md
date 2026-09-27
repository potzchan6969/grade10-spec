# shared/auth/users Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## shared-auth-users-US1: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

<!-- trace:case id=g10.shared-users.TC-oy8 rev=1 covers=g10.shared-users.SC-cv3,g10.shared-users.SC-k1h,g10.shared-users.SC-0qd,g10.shared-users.SC-s50,g10.shared-users.SC-pik -->
### shared-auth-users-US1-TC1-1: Granted operator lists accounts by user id

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-01

**Pre-conditions:**
Signed in as an operator who holds `user:list`.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Check the listed accounts.

**Expected Results:**

* Accounts from this brand's identity system are listed.
* Each account is named by user id.

<!-- trace:case id=g10.shared-users.TC-caj rev=1 covers=g10.shared-users.SC-cv3,g10.shared-users.SC-k1h,g10.shared-users.SC-0qd,g10.shared-users.SC-s50,g10.shared-users.SC-pik -->
### shared-auth-users-US1-TC2-1: Caller without the list grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-01

**Pre-conditions:**
Signed in as a person who does not hold `user:list`.

**Steps:**

1. Try to list accounts.

**Expected Results:**

* The system refuses the request.
* No account records are returned.

<!-- trace:case id=g10.shared-users.TC-2wn rev=1 covers=g10.shared-users.SC-cv3,g10.shared-users.SC-k1h,g10.shared-users.SC-0qd,g10.shared-users.SC-s50,g10.shared-users.SC-pik -->
### shared-auth-users-US1-TC3-1: Search matches email without letter case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-01

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

<!-- trace:case id=g10.shared-users.TC-b3k rev=1 covers=g10.shared-users.SC-cv3,g10.shared-users.SC-k1h,g10.shared-users.SC-0qd,g10.shared-users.SC-s50,g10.shared-users.SC-pik -->
### shared-auth-users-US1-TC4-1: Account opens by user id

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-01

**Pre-conditions:**
Signed in as an operator who can list users.

**Steps:**

1. Open the account for <a subject user id>.

**Expected Results:**

* That account is received.
* A different account that shares an email attribute is not received.

<!-- trace:case id=g10.shared-users.TC-jkd rev=1 covers=g10.shared-users.SC-cv3,g10.shared-users.SC-k1h,g10.shared-users.SC-0qd,g10.shared-users.SC-s50,g10.shared-users.SC-pik -->
### shared-auth-users-US1-TC5-1: Banned account stays in the directory

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-01

**Pre-conditions:**
<a subject user id> is banned. Signed in as an operator who can list users.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Check whether that account is listed.

**Expected Results:**

* That account is still listed.

---

## shared-auth-users-US2: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, and a mistaken ban is reversible.

<!-- trace:case id=g10.shared-users.TC-lde rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y -->
### shared-auth-users-US2-TC1-1: Ban stops money-moving and sign-in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

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

<!-- trace:case id=g10.shared-users.TC-v0p rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y -->
### shared-auth-users-US2-TC2-1: Unban lets the person sign in again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
<a subject user id> is banned. Signed in as an operator who can ban.

**Steps:**

1. Unban <a subject user id>.
2. Complete a sign-in method as that person.

**Expected Results:**

* That person can sign in again.

<!-- trace:case id=g10.shared-users.TC-hx1 rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y -->
### shared-auth-users-US2-TC3-1: Caller without the ban grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who does not hold `user:ban`. <a subject user id> is unbanned.

**Steps:**

1. Try to ban <a subject user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

<!-- trace:case id=g10.shared-users.TC-3i2 rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y -->
### shared-auth-users-US2-TC4-1: Operator cannot ban themselves

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:ban`.

**Steps:**

1. Try to ban the operator's own account.

**Expected Results:**

* The system refuses the request.
* Their account remains unbanned.

<!-- trace:case id=g10.shared-users.TC-wwa rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y -->
### shared-auth-users-US2-TC5-1: Support cannot ban an admin

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator whose role is `support`. <an admin user id> holds `admin`.

**Steps:**

1. Try to ban <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

<!-- trace:case id=g10.shared-users.TC-ka8 rev=1 covers=g10.shared-users.SC-bc9,g10.shared-users.SC-1m7,g10.shared-users.SC-57f,g10.shared-users.SC-qss,g10.shared-users.SC-s2t,g10.shared-users.SC-dbb,g10.shared-users.SC-v7f,g10.shared-users.SC-uoq,g10.shared-users.SC-y5y -->
### shared-auth-users-US2-TC6-1: Last admin cannot be banned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who can ban. <an admin user id> is the only account that holds `admin`.

**Steps:**

1. Try to ban <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

---

## shared-auth-users-US3: Operator changes another person's roles

**As an** admin,
**I want** to set another person's roles without changing my own or stranding the last admin,
**so that** grants stay a closed set I cannot widen from the call site.

<!-- trace:case id=g10.shared-users.TC-g0n rev=1 covers=g10.shared-users.SC-cg2,g10.shared-users.SC-3pf,g10.shared-users.SC-3br,g10.shared-users.SC-a8m,g10.shared-users.SC-xhl,g10.shared-users.SC-m57,g10.shared-users.SC-jw6 -->
### shared-auth-users-US3-TC1-1: Admin sets another account to staff

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
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**
Signed in as an operator who holds `user:set-role`.

**Steps:**

1. Navigate to <grade10 admin users url> for <a subject user id>.
2. Set that account to `staff`.

**Expected Results:**

* That account's roles include `staff`.

<!-- trace:case id=g10.shared-users.TC-3wy rev=1 covers=g10.shared-users.SC-cg2,g10.shared-users.SC-3pf,g10.shared-users.SC-3br,g10.shared-users.SC-a8m,g10.shared-users.SC-xhl,g10.shared-users.SC-m57,g10.shared-users.SC-jw6 -->
### shared-auth-users-US3-TC2-1: Clearing operator roles leaves a user

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**
Signed in as an operator who can set roles. <a subject user id> holds an operator role.

**Steps:**

1. Save that account with no operator role selected.

**Expected Results:**

* That account's roles are `user` only.

<!-- trace:case id=g10.shared-users.TC-g3z rev=1 covers=g10.shared-users.SC-cg2,g10.shared-users.SC-3pf,g10.shared-users.SC-3br,g10.shared-users.SC-a8m,g10.shared-users.SC-xhl,g10.shared-users.SC-m57,g10.shared-users.SC-jw6 -->
### shared-auth-users-US3-TC3-1: Support cannot set roles

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**
Signed in as an operator who holds `user:ban` but not `user:set-role`.

**Steps:**

1. Try to change another account's roles.

**Expected Results:**

* The system refuses the request.
* The roles are unchanged.

<!-- trace:case id=g10.shared-users.TC-j1l rev=1 covers=g10.shared-users.SC-cg2,g10.shared-users.SC-3pf,g10.shared-users.SC-3br,g10.shared-users.SC-a8m,g10.shared-users.SC-xhl,g10.shared-users.SC-m57,g10.shared-users.SC-jw6 -->
### shared-auth-users-US3-TC4-1: Operator may change their own roles

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**
Signed in as an operator who holds `user:set-role` and `admin`. At least one other account holds `admin`.

**Steps:**

1. Save the operator's own account with `staff` and still with `admin`.

**Expected Results:**

* Their account's roles include `staff` and `admin`.

<!-- trace:case id=g10.shared-users.TC-60a rev=1 covers=g10.shared-users.SC-cg2,g10.shared-users.SC-3pf,g10.shared-users.SC-3br,g10.shared-users.SC-a8m,g10.shared-users.SC-xhl,g10.shared-users.SC-m57,g10.shared-users.SC-jw6 -->
### shared-auth-users-US3-TC5-1: Last admin keeps admin

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**
Signed in as an operator who can set roles. <an admin user id> is the only account that holds `admin`.

**Steps:**

1. Save that account without `admin`.

**Expected Results:**

* That account still holds `admin`.

## shared-auth-users-US4: Operator finds the accounts they mean

**As an** operator who can list users,
**I want** to search by the name I was given and narrow the directory to the
accounts I mean,
**so that** I can reach one person from a ticket, and answer who holds a role,
without reading every account.

<!-- trace:case id=g10.shared-users.TC-axp rev=1 covers=g10.shared-users.SC-r7i,g10.shared-users.SC-1kr,g10.shared-users.SC-kly,g10.shared-users.SC-u7q,g10.shared-users.SC-aqk,g10.shared-users.SC-a4z -->
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

<!-- trace:case id=g10.shared-users.TC-1nn rev=1 covers=g10.shared-users.SC-r7i,g10.shared-users.SC-1kr,g10.shared-users.SC-kly,g10.shared-users.SC-u7q,g10.shared-users.SC-aqk,g10.shared-users.SC-a4z -->
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
* An account that holds no elevated role is not listed.

<!-- trace:case id=g10.shared-users.TC-xq6 rev=1 covers=g10.shared-users.SC-r7i,g10.shared-users.SC-1kr,g10.shared-users.SC-kly,g10.shared-users.SC-u7q,g10.shared-users.SC-aqk,g10.shared-users.SC-a4z -->
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
