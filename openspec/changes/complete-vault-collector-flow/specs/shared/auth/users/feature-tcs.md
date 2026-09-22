# shared/auth/users Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-22, tcs-rules r3.0

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
