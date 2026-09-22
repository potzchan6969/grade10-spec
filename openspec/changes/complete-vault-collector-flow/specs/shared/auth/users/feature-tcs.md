# shared/auth/users Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

## shared-auth-users-US1: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

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

---

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
* An account that holds no elevated role is not listed.

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

---

## shared-auth-users-US5: Account holder files their own request to be forgotten

**As an** account holder,
**I want** to file the request to be forgotten from my own account's Your data
page, and to cancel it there inside the seven days,
**so that** I need not ask an operator to file it, and can change my mind
before anything is erased.

### shared-auth-users-US5-TC1-1: Filing opens a seven-day erasure window

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. No erasure request is open for that account.

**Steps:**

1. Open Ask to be forgotten.
2. Confirm the request.

**Expected Results:**

* Step 1 opens a confirmation naming the seven-day window and that the request can be cancelled inside it.
* The account holds one open erasure request, filed today, that matures in seven days.

### shared-auth-users-US5-TC2-1: An open self-filed request leaves sign-in working

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
<a subject user id> has filed their own erasure request. The seven-day window is still open.

**Steps:**

1. Complete a sign-in method as <a subject user id>.

**Expected Results:**

* That person signs in; the open request does not block it.

### shared-auth-users-US5-TC3-1: Cancelling inside the window closes the request

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> has an open self-filed erasure request, filed within the last seven days.

**Steps:**

1. Cancel the request.

**Expected Results:**

* The request no longer shows as open.
* The page offers Ask to be forgotten again.

### shared-auth-users-US5-TC4-1: A new request can be filed after cancelling

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> previously filed and then cancelled an erasure request.

**Steps:**

1. Open Ask to be forgotten.
2. Confirm the request.

**Expected Results:**

* A new open erasure request is created, filed today.

### shared-auth-users-US5-TC5-1: A second filing answers the already-open request

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
<a subject user id> already has an open self-filed erasure request.

**Steps:**

1. File the request to be forgotten again.

**Expected Results:**

* No second request is created.
* The existing open request is unchanged, still maturing on its original date.

### shared-auth-users-US5-TC6-1: Cancelling with nothing open changes nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as <a subject user id>. <a subject user id> holds no open erasure request.

**Steps:**

1. Try to cancel the request to be forgotten.

**Expected Results:**

* Nothing changes.
* No erasure request exists for that account after the attempt.

### shared-auth-users-US5-TC7-1: Cancel is refused once the window has matured

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> filed their own erasure request more than seven days ago; the window has matured.

**Steps:**

1. Try to cancel the request.

**Expected Results:**

* The page reads the request as filed, with the window passed, and offers no cancel.
* The request stays open for each product's own erasure to run.

### shared-auth-users-US5-TC8-1: An operator's filing bans and takes over the request

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
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
<a subject user id> has an open self-filed erasure request, inside the seven-day window. An operator holding `user:delete` files an erasure request for <a subject user id> from the directory.

**Steps:**

1. Try to complete a sign-in method as <a subject user id>.

**Expected Results:**

* The request becomes the operator's, with a ban applied.
* Completing a sign-in method does not sign <a subject user id> in.
