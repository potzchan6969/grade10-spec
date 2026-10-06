# shared/auth/users Test Cases

**Status:** approved
**Reviewed:** 2026-10-06, tcs-rules r4

## shared-auth-users-US1: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

### shared-auth-users-US1-TC1-1: Granted operator lists accounts by user id

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.

**Steps:**

1. Open <grade10 admin users url>.
2. Read the listed accounts.

**Expected Results:**

* The directory lists accounts from this brand.
* Each account is named by its user id.

### shared-auth-users-US1-TC2-1: Caller without the list grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(does not hold `user:list`) is signed in.

**Steps:**

1. Open <grade10 admin users url>.

**Expected Results:**

* The directory refuses the list.
* No account is shown.

### shared-auth-users-US1-TC3-1: Search matches email without letter case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.
* The directory holds <subject email>.

**Test data:**

| Field | Value |
| --- | --- |
| <subject email> | collector@example.com |
| <email fragment> | COLLECTOR |

**Steps:**

1. Open <grade10 admin users url>.
2. Search the directory for <email fragment>.

**Expected Results:**

* The account for <subject email> is listed.
* Every listed email contains that fragment, ignoring letter case.

### shared-auth-users-US1-TC4-1: Account opens by user id

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | The account to open |
| <other user id> | A different account that shares an email attribute with <subject user id> |

**Steps:**

1. Open <grade10 admin users url>.
2. Open the account for <subject user id>.

**Expected Results:**

* The account shown is <subject user id>.
* <other user id> is not the account shown.

### shared-auth-users-US1-TC5-1: Banned account stays in the directory

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.
* <subject user id> is banned.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | A banned account |

**Steps:**

1. Open <grade10 admin users url>.
2. Find <subject user id>.

**Expected Results:**

* <subject user id> is listed.
* The account is marked banned.

---

## shared-auth-users-US2: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, a mistaken ban is
reversible, and a compromised admin cannot lock peer admins out by ban.

### shared-auth-users-US2-TC1-1: Ban stops money-moving and sign-in

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:ban`) is signed in.
* <subject user id> is unbanned and signed in on <grade10 store url>.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | An unbanned account |
| <subject email> | That account's email |
| <ban reason> | Account closed after a ticket |

**Steps:**

1. On <grade10 admin users url>, ban <subject user id> with <ban reason> and confirm.
2. In the pre-ban store session, start a payment.
3. Sign in as <subject email> on <grade10 sign-in url>.
4. Reopen <grade10 store url> in the pre-ban session.

**Expected Results:**

* The payment does not complete.
* Sign-in does not start a session.
* The store shows nobody signed in.
* <subject user id> stays listed, marked banned.

### shared-auth-users-US2-TC2-1: Unban lets the person sign in again

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:ban`) is signed in.
* <subject user id> is banned.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | A banned account |
| <subject email> | That account's email |

**Steps:**

1. On <grade10 admin users url>, unban <subject user id>.
2. Complete sign-in as <subject email> on <grade10 sign-in url>.

**Expected Results:**

* <subject email> is signed in.

### shared-auth-users-US2-TC3-1: Caller without the ban grant is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(does not hold `user:ban`) is signed in.
* <subject user id> is unbanned.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | An unbanned account |

**Steps:**

1. On <grade10 admin users url>, try to ban <subject user id>.

**Expected Results:**

* The directory refuses the ban.
* <subject user id> stays unbanned.

### shared-auth-users-US2-TC4-1: Operator cannot ban themselves

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:ban`) is signed in.
* The signed-in account is unbanned.

**Steps:**

1. On <grade10 admin users url>, try to ban the signed-in account.

**Expected Results:**

* The directory refuses the ban.
* The signed-in account stays unbanned.

### shared-auth-users-US2-TC5-1: No caller bans an account that holds admin

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* The row's caller is signed in and holds `user:ban`.
* The row's subject holds `admin` and is unbanned.

**Test data:**

| Caller | Subject | Outcome |
| --- | --- | --- |
| admin(role `support`, holds `user:ban`) | <admin user id> | Ban is refused. The account stays unbanned. |
| admin(holds `admin` and `user:ban`) | <peer admin user id>, a different account | Ban is refused. The account stays unbanned. |

**Steps:**

1. On <grade10 admin users url>, try to ban the row's subject.

**Expected Results:**

* The directory answers as the row's outcome states.

### shared-auth-users-US2-TC6-1: Last admin cannot be banned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** none
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* Signed in as an operator who can ban. <an admin user id> is the only account that holds `admin`.

**Steps:**

1. Try to ban <an admin user id>.

**Expected Results:**

* The system refuses the request.
* The account remains unbanned.

### shared-auth-users-US2-TC7-1: A cached browse read of a banned account closes on the very next read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* admin(holds `user:ban`) is signed in.
* <subject user id> is unbanned, signed in, and an ordinary browse read of the store has already warmed its session cache.

**Steps:**

1. Read <subject user id>'s signed-in state on <grade10 store url> (an ordinary browse read).
2. On <grade10 admin users url>, ban <subject user id>.
3. Immediately read <subject user id>'s signed-in state, the same way as step 1.

**Expected Results:**

* Step 3 shows nobody signed in, even though step 1's read would otherwise have kept the cache answering "signed in" for up to five more minutes.
* <subject user id> stays listed, marked banned.

### shared-auth-users-US2-TC8-1: An operator's erasure filing bans the account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <a subject user id> holds no open erasure request and is unbanned.

**Steps:**

1. File an erasure request for <a subject user id> from the directory.
2. Complete a sign-in method as that person.

**Expected Results:**

* One open erasure request stands for that person.
* Completing a sign-in method does not sign them in.

### shared-auth-users-US2-TC9-1: Cancelling an operator's request lets the person back in

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <a subject user id> is banned by an operator's open erasure request, filed less than seven days ago, and was unbanned before it.

**Steps:**

1. Cancel that erasure request.
2. Complete a sign-in method as <a subject user id>.

**Expected Results:**

* The request closes as cancelled.
* That person can sign in again.

### shared-auth-users-US2-TC10-1: A cancel leaves a ban the filing did not apply

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
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <a subject user id> was banned for conduct before an operator's erasure request was filed over the account, and that request is open.

**Steps:**

1. Cancel that erasure request.
2. Complete a sign-in method as <a subject user id>.

**Expected Results:**

* The account is still banned.
* Completing a sign-in method does not sign them in.

### shared-auth-users-US2-TC11-1: An erasure request over an admin is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as an operator who holds `user:delete`. <an admin user id> holds `admin` and is unbanned.

**Steps:**

1. Try to file an erasure request for <an admin user id>.

**Expected Results:**

* The system refuses the filing.
* No erasure request is open for that account.
* That person can still sign in.

### shared-auth-users-US2-TC12-1: Ban and unban are refused while an erasure request is open

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**
Signed in as an operator who holds `user:ban` and `user:delete`. <a subject user id> holds the open erasure request and the standing named in **Test data**.

**Test data:**

| Request filed by | Standing | Act |
| --- | --- | --- |
| the account holder | unbanned | ban |
| an operator | banned by that filing | unban |

**Steps:**

1. Send the row's act for <a subject user id>.

**Expected Results:**

* The system refuses the act by name.
* The account's standing is unchanged.
* The erasure request is still open.

### shared-auth-users-US2-TC13-1: The last admin cannot be banned

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-02

**Pre-conditions:**

* operator(holds `user:ban`, does not hold `admin`) is on <grade10 admin users url>.
* Exactly one account holds `admin`: <only admin user id>, unbanned.

**Test data:**

| Field | Value |
| --- | --- |
| `<only admin user id>` | The one account holding `admin` |

**Steps:**

1. Paste <only admin user id> into the search.
2. Try to ban <only admin user id>.

**Expected Results:**

* Step 2 is refused.
* <only admin user id> stays unbanned.

---

## shared-auth-users-US3: Operator changes roles

**As an** admin,
**I want** to set roles on any account I can open — including my own — and to
strip my own `admin` when another admin remains, without stripping `admin`
from a peer,
**so that** ordinary grants and cooperative offboarding stay in the console and
peer lockout does not.

### shared-auth-users-US3-TC1-1: Admin sets another account to staff

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:set-role`) is signed in.
* <subject user id> does not hold `staff`.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | An account that does not hold `staff` |

**Steps:**

1. On <grade10 admin users url>, save <subject user id> with `staff` among its roles.

**Expected Results:**

* <subject user id> holds `staff`.

### shared-auth-users-US3-TC2-1: Clearing operator roles leaves a user

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:set-role`) is signed in.
* <subject user id> holds an operator role and does not hold `admin`.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | An account with an operator role and no `admin` |

**Steps:**

1. On <grade10 admin users url>, save <subject user id> with no operator role selected.

**Expected Results:**

* <subject user id> holds `user` only.

### shared-auth-users-US3-TC3-1: Support cannot set roles

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(role `support`, holds `user:ban`, does not hold `user:set-role`) is signed in.

**Test data:**

| Field | Value |
| --- | --- |
| <subject user id> | Another account |

**Steps:**

1. On <grade10 admin users url>, try to change <subject user id>'s roles.

**Expected Results:**

* The directory refuses the change.
* <subject user id>'s roles are unchanged.

### shared-auth-users-US3-TC4-1: Operator may change their own roles

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:set-role` and `admin`) is signed in.
* At least one other account holds `admin`.

**Test data:**

| Roles saved | Result |
| --- | --- |
| `staff` and `admin` | The account holds `staff` and `admin`. |
| no `admin` | The account does not hold `admin`. |

**Steps:**

1. On <grade10 admin users url>, save the signed-in account with the row's roles.

**Expected Results:**

* The account answers as the row's result states.

### shared-auth-users-US3-TC5-1: Last admin keeps admin

Runs once per row of **Test data**.

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
* **Trace:** shared-auth-users-US-03

**Pre-conditions:**

* Exactly one account holds `admin`.

**Test data:**

| Caller | Account saved |
| --- | --- |
| admin(holds `user:set-role`, does not hold `admin`) | <only admin user id> |
| admin(holds `admin` and `user:set-role`), the only admin | The signed-in account |

**Steps:**

1. On <grade10 admin users url>, save the row's account without `admin`.

**Expected Results:**

* That account still holds `admin`.

### shared-auth-users-US3-TC6-1: Peer admin keeps admin

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `admin` and `user:set-role`) is signed in.
* <peer admin user id> holds `admin` and is not the signed-in account.

**Test data:**

| Field | Value |
| --- | --- |
| <peer admin user id> | An admin other than the signed-in account |

**Steps:**

1. On <grade10 admin users url>, save <peer admin user id> without `admin`.

**Expected Results:**

* The directory refuses the save.
* <peer admin user id> still holds `admin`.

### shared-auth-users-US3-TC7-1: An ordinary read of the caller's own permissions reflects a role change on the very next read

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-03

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* The row's target is signed in, and an ordinary (non-elevated) browse read of its own current permissions has already warmed its session cache.

**Test data:**

| Target | Role change |
| --- | --- |
| Another account | `staff` granted, previously held no operator role |
| The signed-in admin's own account | Own `admin` stripped; another admin remains |

**Steps:**

1. Read the row's target's permissions on an ordinary, non-elevated browse surface.
2. An admin holding `user:set-role` saves the row's target with the row's role change.
3. Immediately read the row's target's permissions the same way as step 1.

**Expected Results:**

* Step 3 reflects the row's new roles, even though step 1's read would otherwise have kept the cache answering the old roles for up to five more minutes.

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
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.
* The directory holds <account name>, and that name is not part of the account's email.

**Test data:**

| Field | Value |
| --- | --- |
| <account name> | Alex Collector |
| <name fragment> | ALEX |
| <subject email> | collector@example.com |

**Steps:**

1. Open <grade10 admin users url>.
2. Search the directory for <name fragment>.

**Expected Results:**

* The account named <account name> is listed.

### shared-auth-users-US4-TC2-1: Directory narrows to a role

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.
* The directory holds an account with `admin` and an account with no elevated role.

**Steps:**

1. Open <grade10 admin users url>.
2. Narrow the directory to accounts that hold `admin`.

**Expected Results:**

* Every listed account holds `admin`.
* An account with no elevated role is not listed.

### shared-auth-users-US4-TC3-1: Two narrowings and chosen order apply

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.
* The directory holds banned and unbanned `support` accounts that joined on different days.

**Steps:**

1. Open <grade10 admin users url>.
2. Narrow to banned accounts that hold `support`.
3. Order by when the account joined, oldest first.
4. Clear the order.

**Expected Results:**

* Step 2 lists only banned accounts that hold `support`.
* Step 3 lists the oldest account first.
* Step 4 lists the newest account first.

### shared-auth-users-US4-TC4-1: Directory narrows to the user population

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auth/users.spec.ts`

**Pre-conditions:**

* admin(holds `user:list`) is signed in.
* The directory holds an account with `admin` and an account with no elevated role.

**Steps:**

1. Open <grade10 admin users url>.
2. Narrow the directory to the user population.

**Expected Results:**

* Every listed account holds no elevated role.
* An account that holds `admin` is not listed.

<!-- trace:case id=g10.shared-users.TC-htg rev=1 covers=g10.shared-users.SC-r7i,g10.shared-users.SC-1kr,g10.shared-users.SC-kly,g10.shared-users.SC-u7q,g10.shared-users.SC-aqk,g10.shared-users.SC-a4z -->
### shared-auth-users-US4-TC5-1: Directory narrows to elevated accounts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-04

**Pre-conditions:**

* admin(holds `user:list`) is on <grade10 admin users url>.
* The directory holds <elevated account> and <plain account>.

**Test data:**

| Field | Value |
| --- | --- |
| `<elevated account>` | An account holding `staff`, any elevated role |
| `<plain account>` | An account holding `user` only |

**Steps:**

1. Set Type to Elevated.
2. Read the listed accounts.

**Expected Results:**

* Every listed account holds at least one elevated role.
* <plain account> is not listed.

---

## shared-auth-users-US5: Operator creates an Auth account

**As an** operator holding `user:create`,
**I want** to create a passwordless Auth account with name, email, and roles
from the closed set for someone who has never signed in — and to be refused
when the email already exists —
**so that** access can be granted before first sign-in without loyalty enroll
or an invite mail, and a duplicate never becomes a second account.

### shared-auth-users-US5-TC1-1: Create passwordless Auth account with elevated role

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as operator(holds `user:create` and `user:set-role`). No Auth account holds <new email>.

**Test data:**

| Field | Value |
| --- | --- |
| <new name> | Ada Operator |
| <new email> | ada.operator@example.com |
| <roles> | `admin` |

**Steps:**

1. Create an Auth account with <new name>, <new email>, and <roles>.
2. Open the account named by <new email>.
3. Check that account's roles and whether a password was required at create.

**Expected Results:**

* Step 1 succeeds and creates one Auth account for <new email>.
* Step 2 opens that account with <new name> and roles including `admin`.
* Create collected no password.

### shared-auth-users-US5-TC2-1: Create plain user with only user:create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as operator(holds `user:create`, not `user:set-role`). No Auth account holds <plain email>.

**Test data:**

| Field | Value |
| --- | --- |
| <plain name> | Pat Collector |
| <plain email> | pat.collector@example.com |
| <roles> | `user` |

**Steps:**

1. Create an Auth account with <plain name>, <plain email>, and <roles>.
2. Open the account named by <plain email>.

**Expected Results:**

* Step 1 succeeds.
* Step 2 opens that account with roles `user` only.

### shared-auth-users-US5-TC3-1: Create without user:create is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as operator(holds `user:list` and `user:set-role`, not `user:create`). No Auth account holds <attempted email>.

**Test data:**

| Field | Value |
| --- | --- |
| <attempted email> | no.create@example.com |

**Steps:**

1. Try to create an Auth account with name, <attempted email>, and role `user`.

**Expected Results:**

* The system refuses the create.
* No Auth account holds <attempted email>.

### shared-auth-users-US5-TC4-1: Elevated role without user:set-role is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* operator(holds `user:create` and `user:list`, not `user:set-role`) is signed in to the console.
* No account holds <elevated email>.

**Test data:**

| `<elevated role>` | `<elevated name>` | `<elevated email>`, any address no account holds | Outcome |
| --- | --- | --- | --- |
| `staff` | Almost Staff | almost.staff@example.com | Refused; no account holds the address |
| `admin` | Almost Admin | almost.admin@example.com | Refused; no account holds the address |

**Steps:**

1. Send the users create call, as <grade10 admin api docs url> lists it, with <elevated name>, <elevated email> and <elevated role>.
2. Search <grade10 admin users url> for <elevated email>.

**Expected Results:**

* Step 1 is refused.
* Step 2 finds no account.

### shared-auth-users-US5-TC5-1: Duplicate email is refused

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* operator(holds `user:create`, `user:set-role` and `user:list`) is on <grade10 admin users url>.
* <existing account> holds <existing email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<existing account>` | An account that has signed in at least once |
| `<existing email>` | That account's email |
| `<new name>` | Second Taker, any name other than the existing account's |

**Steps:**

1. Click Create.
2. Enter <new name> and <existing email>, and select `user`.
3. Submit the form.
4. Search the directory for <existing email>.

**Expected Results:**

* Step 3 is refused.
* Step 4 lists exactly one account for <existing email>.

### shared-auth-users-US5-TC6-1: Create does not enroll loyalty or send invite mail

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* operator(holds `user:create`, `user:set-role` and `loyalty:read`) is on <grade10 admin users url>.
* No account holds <silent email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<silent name>` | Silent Create |
| `<silent email>` | An inbox the tester reads, held by no account |
| `<silent role>` | `staff`, any role from the closed set |

**Steps:**

1. Click Create.
2. Enter <silent name> and <silent email>, and select <silent role>.
3. Submit the form.
4. Click Confirm.
5. Open the inbox for <silent email>.
6. Search the loyalty Members page for <silent email>.

**Expected Results:**

* Step 4 creates the account.
* Step 5 holds no invite or sign-in mail from the create.
* Step 6 finds no member and no opening points.

### shared-auth-users-US5-TC7-1: Empty roles at create leave a user

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**

* operator(holds `user:create` and `user:list`) is signed in to the console.
* No account holds <empty-roles email>.

**Test data:**

| Field | Value |
| --- | --- |
| `<empty-roles name>` | No Role Pick |
| `<empty-roles email>` | no.role@example.com, any address no account holds |

**Steps:**

1. Send the users create call, as <grade10 admin api docs url> lists it, with <empty-roles name>, <empty-roles email> and an empty role list.
2. Search <grade10 admin users url> for <empty-roles email> and open the account.

**Expected Results:**

* Step 1 creates the account.
* Step 2 shows roles `user` only.

---

## shared-auth-users-US6: Account holder files their own request to be forgotten

**As an** account holder,
**I want** to file the request to be forgotten from my own account's Your data
page, and to cancel it there inside the seven days,
**so that** I need not ask an operator to file it, and can change my mind
before anything is erased.

### shared-auth-users-US6-TC1-1: Filing opens a seven-day erasure window

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. No erasure request is open for that account.

**Steps:**

1. Open Ask to be forgotten.
2. Confirm the request.

**Expected Results:**

* Step 1 opens a confirmation naming the seven-day window and that the request can be cancelled inside it.
* The account holds one open erasure request, filed today, that matures in seven days.

### shared-auth-users-US6-TC2-1: An open self-filed request leaves sign-in working

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> has filed their own erasure request. The seven-day window is still open.

**Steps:**

1. Complete a sign-in method as <a subject user id>.

**Expected Results:**

* That person signs in; the open request does not block it.

### shared-auth-users-US6-TC3-1: Cancelling inside the window closes the request

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> has an open self-filed erasure request, filed six days ago on the brand's own zone, so the day an erasure may run has not opened.

**Steps:**

1. Cancel the request.

**Expected Results:**

* The request no longer shows as open.
* The page offers Ask to be forgotten again.

### shared-auth-users-US6-TC4-1: A new request can be filed after cancelling

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>, on <Your data page>. <a subject user id> previously filed and then cancelled an erasure request.

**Steps:**

1. Open Ask to be forgotten.
2. Confirm the request.

**Expected Results:**

* A new open erasure request is created, filed today.

### shared-auth-users-US6-TC5-1: A second filing answers the already-open request

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> already has an open self-filed erasure request.

**Steps:**

1. File the request to be forgotten again.

**Expected Results:**

* No second request is created.
* The existing open request is unchanged, still maturing on its original date.

### shared-auth-users-US6-TC6-1: Cancelling with nothing open changes nothing

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
Signed in as <a subject user id>. <a subject user id> holds no open erasure request.

**Steps:**

1. Try to cancel the request to be forgotten.

**Expected Results:**

* Nothing changes.
* No erasure request exists for that account after the attempt.

### shared-auth-users-US6-TC7-1: Cancel is refused once the window has matured

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer is signed in as <subject user id> and on <grade10 your data url>.
* <subject user id> filed their own erasure request seven days ago, on the brand's zone, so today an erasure may run.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject user id>` | An account holding `user` only, with that request open |

**Steps:**

1. Read the erasure request on the page.
2. Look for a cancel control.

**Expected Results:**

* Step 1 reads the request as filed, the window passed.
* Step 2 finds no cancel offered.
* The request stays open.

### shared-auth-users-US6-TC8-1: An operator's filing bans and takes over the request

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> has an open self-filed erasure request, inside the seven-day window. An operator holding `user:delete` files an erasure request for <a subject user id> from the directory.

**Steps:**

1. Try to complete a sign-in method as <a subject user id>.

**Expected Results:**

* The request becomes the operator's, with a ban applied.
* Completing a sign-in method does not sign <a subject user id> in.

### shared-auth-users-US6-TC9-2: A taken-over request refuses the account holder's own cancel

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** shared-auth-users-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/your-data.spec.ts`

**Pre-conditions:**
<a subject user id> filed their own erasure request, and an operator holding `user:delete` then filed over it. The seven-day window has not passed.

**Steps:**

1. Send the account holder's own cancel as <a subject user id>.

**Expected Results:**

* The system refuses the cancel.
* The request stays open, filed by the operator.

### shared-auth-users-US6-TC10-1: A second cancel of an already-cancelled request changes nothing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** none
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** shared-auth-users-US-06

**Pre-conditions:**

* customer is signed in as <subject user id>.
* <subject user id> filed their own erasure request and cancelled it inside the window, on <first cancel day>.

**Test data:**

| Field | Value |
| --- | --- |
| `<subject user id>` | An unbanned account holding `user` only |
| `<first cancel day>` | The day of the first cancel |

**Steps:**

1. Send the erasure cancel call, as <grade10 admin api docs url> lists it, as <subject user id>.
2. Read the request.
3. Read <subject user id>'s standing.

**Expected Results:**

* Step 2 reads the request cancelled, closed on <first cancel day>.
* Step 3 reads unbanned, as before.

## Settled

- Empty role selection at create leaves the account as `user` only (Q13).
- Name and email are required on create (Q14).
- Email-verification standing of a newly created account is open on the PRD.
- A read already in flight when a ban or role change commits needs no rule of its own - the requirement is a 70-second bound, and such a read falls inside it.
- Which endpoints are cached browse reads and which are elevated calls is the implementation's mapping, not a suite question.
- Per-session versus per-account cache-version keying changes no case's expected result here.
- Once an operator's filing takes a self-filed request over, the request is the shop's: the account holder's own cancel is refused, and only the run or an operator's cancel ends it. No standing changes while an erasure request is open, so the ban that filing applied stands and the person does not reach their own data page.
- There is neither a limit nor a cool-down on filing and cancelling: a person may ask and change their mind as often as they like, one open request at a time.
- The cancel is refused from the first instant of the day an erasure may run, and the request stands until every product has erased what it holds. The guard that holds it to that day is the tech design's, raised there for engineering.

## Reconciliation

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, decisions.md (Raised included), the linked Users · Ban and Unban / Role Changes PRD sections, this suite for id continuity, and `shared/auth/domain-tcs.md` for id continuity, all with Reconciliation/Requirements stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose, Feature set and the domain suite, openspec/changes/archive/. (Change: `close-revoked-session-cache-gap`.)

**Raised, folded into spec**

- The in-flight-read boundary - first folded into both requirements as "the next read that starts after", then replaced by the 70-second bound.

**Raised, rejected**

- Which endpoints count as cached versus elevated — tech-design's job, not a suite question.
- Per-session versus per-user invalidation keying - does not change any case's observable expected result here.

**Raised, landed as decisions**

- Empty role selection — Q13.
- Name and email required — Q14.
- The in-flight-read boundary - `close-revoked-session-cache-gap` decisions.md Q4, superseded by Q5.

**Uncovered anchors**

- All scenarios under Account create / US-05 covered by US5-TC1 through TC7.
- Cross-account isolation on ban and role change (an admin action on one account must not touch another account's cache) is not observable through a black-box signed-in/permissions read. **Out of suite:** the per-user cache-version helper's own unit test in grade10.
- The 70-second bound at a location other than the one the ban or role change was made at is not observable on a single-location stack, where the change reaches the next read at once. **Out of suite:** grade10's cache-version settling-window unit test and the auth worker's before/after-race regression test.
- All other scenarios under Ban and unban / US-02 and Role changes / US-03, the 70-second closing and reflecting included, are covered by `US2-TC1-1` through `US2-TC7-1` and `US3-TC1-1` through `US3-TC7-1` above.

**Verdicts (@sean, quick pass in chat, not a full `/tcs-review`)**

- `US2-TC7-1` — Retired (`deprecated`), on writing its Playwright walk: `US2-TC1-1`'s own cached-read assertion (`store.page`'s pre-ban session, read with no `fresh` flag) already proves the same close once its `test.fail` placeholder for the then-unfixed cache is removed. A Case That Already Exists Is Not Written Twice.
- `US3-TC7-1` — Approved (`actual`).

**Run:** the blind pass read this capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, the change's `proposal.md` and `decisions.md` with its `## Raised` table, `ui-design.md` with the state dispositions stripped, and the PRD sections the proposal links. It was denied every `## Requirements` section, `openspec/specs/` and `openspec/changes/archive/` entirely, and `tech-design.md`. Fourteen cases came back over two journeys; the scenario pass issued a range of scenarios, a range of scenarios.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `shared-auth-users-US2-TC1-1` to `shared-auth-users-US2-TC7-1` | Carried | ban and unban behaviour the durable spec already states and this delta does not touch; the cases came across with the journey as the durable suite words them, and the erasure cases take the ids after them |
| `shared-auth-users-US6-TC1-1` | Joined | its scenario |
| `shared-auth-users-US6-TC2-1` | Joined | its scenario |
| `shared-auth-users-US6-TC3-1` | Joined | its scenario |
| `shared-auth-users-US6-TC4-1` | Joined | its scenario |
| `shared-auth-users-US6-TC5-1` | Joined | its scenario |
| `shared-auth-users-US6-TC6-1` | Joined | its scenario |
| `shared-auth-users-US6-TC7-1` | Joined | its scenario; the cancel is refused from the first instant of the day an erasure may run and the request stays open, which the author confirmed as Q50 |
| `shared-auth-users-US6-TC8-1` | Joined | its scenario; the take-over keeps the day an erasure may run, confirmed as Q51 |
| Raised: what the account holder sees once a filing takes their request over | Escalated, then folded, then corrected | settled as Q48 and Q65: the request is the shop's from the take-over on, and the account holder's own cancel is refused. Folded as its scenario. The first fold read the page after a lifted ban, which nothing reaches: no standing changes while an erasure request is open. its scenario now sends the own cancel instead, walked by `shared-auth-users-US6-TC9-2`, the case's version bumped because the requirement changed what it verifies |
| Raised: a limit or a cool-down on file-then-cancel cycles | Escalated, then settled | settled as Q49: there is neither. No scenario beyond the one that already lets a new request be filed once none is open |
| Raised: the maturity guard behind the cancel | Deferred | the behaviour stands in its scenario; the mechanism that enforces it is the tech design's cancel binding, raised for engineering in `decisions.md` |
| its scenario | Case added | `shared-auth-users-US6-TC10-1`, tracing `Erasure requests`, the group the scenario serves, so the group anchor is walked |
| its scenario | Case added | `shared-auth-users-US2-TC8-1` |
| its scenario | Case added | `shared-auth-users-US2-TC9-1` |
| its scenario | Case added | `shared-auth-users-US2-TC10-1` |
| its scenario | Folded, then walked | an erasure filed over an account that holds `admin` is refused by name, as a direct ban of one is, settled as Q52; walked by `shared-auth-users-US2-TC11-1` |
| its scenario | Written for a shipped rule, case added | The vault walk found auth refusing a ban or an unban by name while an erasure request is open, with only the console's hidden buttons in any spec. The rule now stands in `An operator's erasure request bans the account`, and `shared-auth-users-US2-TC12-1` walks it, a row per filer |
| Design: Ask available, Ask confirmation, Ask filed, Ask cancelled, Window passed | Closed on the row | `ui-design.md` under Your data now names the scenarios these states prove, beside the vault scenarios that state what the same rows render |

### Manual

| Manual | Why |
| --- | --- |
| `shared-auth-users-US6-TC1-1` | a person reads the confirmation: that it names the seven days and says the ask can be cancelled inside them |
| `shared-auth-users-US6-TC2-1` | a person signs in while their own request is open, through the method they would really use |
| `shared-auth-users-US6-TC3-1` | a person reads the page back to Ask available after the cancel |
| `shared-auth-users-US6-TC4-1` | a person walks the page from cancelled to a fresh ask |
| `shared-auth-users-US6-TC5-1` | a person asks a second time from the page and reads the same request back |
| `shared-auth-users-US6-TC7-1` | a person reads the window as passed and finds no cancel offered |
| `shared-auth-users-US6-TC8-1` | a person tries to sign in after the shop's filing takes the request over |
