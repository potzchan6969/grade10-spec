# shared/auth/users Test Cases

**Status:** reopened
**Reviewed:** 2026-09-29, tcs-rules r4, lapsed 2026-09-29
**Drafts styled:** 2026-09-29, tcs-rules r3.0

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create` and `user:set-role`). No Auth account holds <new email>.

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
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create`, not `user:set-role`). No Auth account holds <plain email>.

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
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:set-role`, not `user:create`). No Auth account holds <attempted email>.

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
Signed in as admin(holds `user:create`, not `user:set-role`). No Auth account holds <elevated email>.

**Test data:**

| Field | Value |
| --- | --- |
| <elevated email> | almost.admin@example.com |
| <roles> | `admin` |

**Steps:**

1. Try to create an Auth account with a name, <elevated email>, and <roles>.

**Expected Results:**

* The system refuses the create.
* No Auth account holds <elevated email>.

### shared-auth-users-US5-TC5-1: Duplicate email is refused

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create` and `user:set-role`). Auth already holds <existing email> on <existing account>.

**Test data:**

| Field | Value |
| --- | --- |
| <existing email> | taken@example.com |

**Steps:**

1. Try to create an Auth account with a new name, <existing email>, and role `user`.
2. Count Auth accounts whose email is <existing email>.

**Expected Results:**

* Step 1 is refused.
* Step 2 still counts exactly one account for <existing email>.

### shared-auth-users-US5-TC6-1: Create does not enroll loyalty or send invite mail

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create` and `user:set-role`). No Auth account holds <silent email>. No outbound mail is queued for <silent email>.

**Test data:**

| Field | Value |
| --- | --- |
| <silent name> | Silent Create |
| <silent email> | silent.create@example.com |
| <roles> | `staff` |

**Steps:**

1. Create an Auth account with <silent name>, <silent email>, and <roles>.
2. Check loyalty enrollment for that account.
3. Check outbound mail for <silent email>.

**Expected Results:**

* Step 1 succeeds.
* Step 2 shows no loyalty enroll and no opening points from create.
* Step 3 shows no invite or magic-link mail from create.

### shared-auth-users-US5-TC7-1: Empty roles at create leave a user

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared-auth-users-US-05

**Pre-conditions:**
Signed in as admin(holds `user:create`). No Auth account holds <empty-roles email>.

**Test data:**

| Field | Value |
| --- | --- |
| <empty-roles name> | No Role Pick |
| <empty-roles email> | no.role@example.com |

**Steps:**

1. Create an Auth account with <empty-roles name>, <empty-roles email>, and no role selected.
2. Open the account named by <empty-roles email>.

**Expected Results:**

* Step 1 succeeds.
* Step 2 opens that account with roles `user` only.

## Settled

- Empty role selection at create leaves the account as `user` only (Q13).
- Name and email are required on create (Q14).
- Email-verification standing of a newly created account is open on the PRD.
- A read already in flight when a ban or role change commits needs no rule of its own - the requirement is a 70-second bound, and such a read falls inside it.
- Which endpoints are cached browse reads and which are elevated calls is the implementation's mapping, not a suite question.
- Per-session versus per-account cache-version keying changes no case's expected result here.

## Reconciliation

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, decisions.md (Raised included), the linked Users · Ban and Unban / Role Changes PRD sections, this suite for id continuity, and `shared/auth/domain-tcs.md` for id continuity, all with Reconciliation/Requirements stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose, Feature set and the domain suite, openspec/changes/archive/. (Change: `close-revoked-session-cache-gap`.)

**Raised, folded into spec**

- The in-flight-read boundary — folded into both requirement's text ("the next read that starts after") and into `shared-auth-users-SC-34` and `SC-35`.

**Raised, rejected**

- Which endpoints count as cached versus elevated — tech-design's job, not a suite question.
- Per-session versus per-user invalidation keying — checked against `shared-auth-users-US2-TC7-1`'s equivalent in `shared/auth/sessions`; does not change any case's observable expected result here.

**Raised, landed as decisions**

- Empty role selection — Q13.
- Name and email required — Q14.
- The in-flight-read boundary — `close-revoked-session-cache-gap` decisions.md Q4.

**Uncovered anchors**

- All scenarios under Account create / US-05 covered by US5-TC1 through TC7.
- Cross-account isolation on ban and role change (an admin action on one account must not touch another account's cache) is not observable through a black-box signed-in/permissions read. **Out of suite:** the per-user cache-version helper's own unit test, added under `close-revoked-session-cache-gap`'s `tasks.md`.
- The 70-second bound at a location other than the one the ban or role change was made at (`close-revoked-session-cache-gap` `decisions.md` Q5) is not observable on a single-location stack, where the change reaches the next read at once. **Out of suite:** the cache-version helper's settling-window unit test and the auth worker's before/after-race regression test, both under that change's `tasks.md` group 3.
- All other scenarios under Ban and unban / US-02 and Role changes / US-03, including the new `SC-34` and `SC-35`, are covered by `US2-TC1-1` through `US2-TC7-1` and `US3-TC1-1` through `US3-TC7-1` above.

**Verdicts (@sean, quick pass in chat, not a full `/tcs-review`)**

- `US2-TC7-1` — Retired (`deprecated`), on writing its Playwright walk: `US2-TC1-1`'s own cached-read assertion (`store.page`'s pre-ban session, read with no `fresh` flag) already proves the same close once its `test.fail` placeholder for the then-unfixed cache is removed. A Case That Already Exists Is Not Written Twice.
- `US3-TC7-1` — Approved (`actual`).
