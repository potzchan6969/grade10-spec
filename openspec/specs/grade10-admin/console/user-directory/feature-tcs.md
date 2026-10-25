# grade10-admin/console/user-directory Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Users is `<users>` on the admin console: a directory of accounts with search, Type, role and status narrowing and pages, an account opening in a panel beside the list. Each case names the grants the operator's roles hold.

## g10adm.console-user-directory.US1: Admin reviews who holds elevated grants

**As an** admin,
**I want** to narrow Users to the accounts holding a role and read what each
of those accounts can actually do,
**so that** I can review the elevated access in the console without reading
authorization source or asking an engineer.

<!-- trace:case id=g10adm.console-user-directory.TC-dac rev=1 covers=g10adm.console-user-directory.SC-s3c,g10adm.console-user-directory.SC-fjy,g10adm.console-user-directory.SC-2zy,g10adm.console-user-directory.SC-8pc,g10adm.console-user-directory.SC-0vu,g10adm.console-user-directory.SC-4l4,g10adm.console-user-directory.SC-w5y,g10adm.console-user-directory.SC-fy9,g10adm.console-user-directory.SC-k2t -->
### g10adm.console-user-directory.US1-TC1: An admin narrows Users to a role and reads an account's grants from the mapping

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**

* An admin holding `user:list` and `user:set-role`; the directory holds a `support` account, a banned customer, and accounts that do not hold `admin`.

**Steps:**

1. Open `<users>` with no role narrowing in the address.
2. Narrow to `admin`, then to banned accounts under Users.
3. Open the `support` account, and its activity.
4. Open `support` from the account's identity.
5. Open the admin's own account.

**Expected Results:**

* Step 1 lists elevated accounts, none without an elevated role.
* Step 2 lists only `admin` accounts with their count, then only banned accounts holding no elevated role.
* Step 3 shows exactly the grants the mapping gives `support`, each elevated one marked once, and when the account joined.
* Step 4 opens Roles & Permissions on `support`.
* Step 5's panel offers changing roles.

<!-- trace:case id=g10adm.console-user-directory.TC-k1h rev=1 covers=g10adm.console-user-directory.SC-s3c,g10adm.console-user-directory.SC-fjy,g10adm.console-user-directory.SC-2zy,g10adm.console-user-directory.SC-8pc,g10adm.console-user-directory.SC-0vu,g10adm.console-user-directory.SC-4l4,g10adm.console-user-directory.SC-w5y,g10adm.console-user-directory.SC-fy9,g10adm.console-user-directory.SC-k2t -->
### g10adm.console-user-directory.US1-TC2: A move the operator cannot make is not offered, nor ban on an account being erased

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**

* An operator holding `user:list` and `user:ban`, not `user:set-role` or `user:delete`, opens `<account>`.

**Test data:**

| `<account>` | `<not offered>` | `<still offered>` |
| --- | --- | --- |
| a customer | changing roles or erasure | ban or unban |
| an account with an erasure filed | ban or unban | the erasure shown as requested |

**Steps:**

1. Read the row's and the panel's moves.

**Expected Results:**

* Neither offers `<not offered>`; `<still offered>` stands.

---

## g10adm.console-user-directory.US2: Operator works one account from a single address

**As an** operator,
**I want** one address that opens the account I was sent to and carries on to
whatever it points at,
**so that** a colleague's link, a trail entry and my own bookmark all land me
in the same place, and I never hunt for the person twice.

<!-- trace:case id=g10adm.console-user-directory.TC-ww8 rev=1 covers=g10adm.console-user-directory.SC-kyo,g10adm.console-user-directory.SC-pix,g10adm.console-user-directory.SC-thq,g10adm.console-user-directory.SC-akc,g10adm.console-user-directory.SC-wee,g10adm.console-user-directory.SC-xy1 -->
### g10adm.console-user-directory.US2-TC1: An address opens one account, and a view pasted to a colleague opens the same

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An operator holding `user:list`; a colleague holds the same grants.

**Steps:**

1. Search, narrow, page past the first, and open a known account.
2. Copy the address; open it in the colleague's session.
3. Search for a query that matches only in the other Type, and follow the link offered.

**Expected Results:**

* Step 1 opens the panel beside the list, the list still there.
* Step 2 shows the same search, narrowing, page and open panel, nothing searched again.
* Step 3's empty list offers the query in the other Type, and following it keeps the query.

<!-- trace:case id=g10adm.console-user-directory.TC-uh8 rev=1 covers=g10adm.console-user-directory.SC-kyo,g10adm.console-user-directory.SC-pix,g10adm.console-user-directory.SC-thq,g10adm.console-user-directory.SC-akc,g10adm.console-user-directory.SC-wee,g10adm.console-user-directory.SC-xy1 -->
### g10adm.console-user-directory.US2-TC2: The panel hands off to the loyalty record and to what the account has done

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**

* An operator holding `user:list`, who may read the trail, opens `<account>`.

**Test data:**

| `<account>` | `<offers>` |
| --- | --- |
| a customer holding no elevated role | the loyalty record and what the account has done, ahead of ban, unban or erase |
| an elevated account | what the account has done, ahead of ban, unban or erase, and no loyalty record |

**Steps:**

1. Read the panel's actions.

**Expected Results:**

* It offers `<offers>`.

---

## g10adm.console-user-directory.US3: Operator suspends an account from auctions

**As an** operator holding `auction:moderate`,
**I want** to suspend an account from auctions from its panel on Users, and
reinstate it later,
**so that** I can stop a bidder I have reason to stop without banning them
from the whole platform.

<!-- trace:case id=g10adm.console-user-directory.TC-3ua rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### g10adm.console-user-directory.US3-TC1: An operator suspends an account from auctions with a reason, and reinstates one

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**

* An operator holding `user:list` and `auction:moderate`; one account is active and unbanned, another suspended for a missed payment deadline.

**Steps:**

1. Open the active account, choose suspend from auctions, enter Suspected shill bidding, and confirm.
2. Open the deadline-suspended account, choose reinstate, and confirm.

**Expected Results:**

* Step 1's panel shows it suspended from auctions with the reason, who and when, offering reinstate, the account still not banned.
* Step 2's panel shows it not suspended, offering suspend.

<!-- trace:case id=g10adm.console-user-directory.TC-ed0 rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### g10adm.console-user-directory.US3-TC2: Suspending cannot be confirmed without a reason

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**

* An operator holding `user:list` and `auction:moderate` opens an active account.

**Steps:**

1. Choose suspend from auctions, and try to confirm with the reason empty.

**Expected Results:**

* It cannot be confirmed; the account is not suspended.

<!-- trace:case id=g10adm.console-user-directory.TC-a2x rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### g10adm.console-user-directory.US3-TC4: An operator without the grant is offered neither move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**

* An operator holding `user:list`, not `auction:moderate`; one account is suspended, another not.

**Steps:**

1. Open each account's panel.

**Expected Results:**

* Neither offers suspend or reinstate.

---

## g10adm.console-user-directory.US4: Admin creates an account from Users

**As an** admin holding `user:create`,
**I want** to create a passwordless Auth account from Users with name, email,
and roles, open the new account's panel when create succeeds, and open the
existing account when the email is already taken,
**so that** I can stand up elevated access before the person signs in without
leaving the access desk or using Override.

<!-- trace:case id=g10adm.console-user-directory.TC-2zn rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### g10adm.console-user-directory.US4-TC1: Create reviews the draft, then opens the new account's panel

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**

* An operator holding `user:list` and `<grants>`; no account holds `<email>`. Users create expects `@9gag.com` or `@memestrategy.com`.

**Test data:**

| `<grants>` | `<email>` | `<role>` | `<review notes>` |
| --- | --- | --- | --- |
| `user:create` and `user:set-role` | someone@9gag.com | `admin` | the admin note: `admin`, in bold, cannot be removed once created; no email note |
| `user:create` and `user:set-role` | someone@example.com | `admin` | the email check and the admin note together |
| `user:create` alone | desk.user@9gag.com | `user` | neither note |

**Steps:**

1. Choose Create, enter a name, `<email>` and `<role>`, and confirm.
2. Choose Back, confirm again, and confirm the review.
3. Read the open panel and the address.

**Expected Results:**

* Step 1 shows a review with `<review notes>`, creating nothing; Back returns to the form, creating nothing.
* Step 2 creates the account; step 3 opens its panel beside the list, holding `<role>` alone, addressed as picking its row is.

<!-- trace:case id=g10adm.console-user-directory.TC-pp4 rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### g10adm.console-user-directory.US4-TC2: Create is not offered without user:create

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**

* An operator holds `user:list` and `user:set-role`, not `user:create`.

**Steps:**

1. Open `<users>`, and look for Create.

**Expected Results:**

* Create is not offered.

<!-- trace:case id=g10adm.console-user-directory.TC-p4u rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### g10adm.console-user-directory.US4-TC3: A taken email is refused on the form and opens the existing account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**

* An operator holding `user:list`, `user:create` and `user:set-role`; an account already holds already.there@example.com.

**Steps:**

1. Choose Create, enter a name, already.there@example.com and a role, and confirm on the form.
2. Choose the way offered to open the existing account.

**Expected Results:**

* Step 1 stays on the form with the duplicate refusal, opening no review and creating nothing.
* Step 2 opens the existing account's panel; no second account holds the email.

---

## g10adm.console-user-directory.US5: Admin asks an account to verify

**As an** admin holding `kyc:request`,
**I want** to read an account's identity on its panel and require it to verify
its person or its business, with a reason,
**so that** the account's bids wait until Grade10 knows who stands behind it.

<!-- trace:case id=g10adm.console-user-directory.TC-6k8 rev=1 -->
### g10adm.console-user-directory.US5-TC1: An admin requires a business from the panel, and can drop it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-05

**Pre-conditions:**

* An admin holding `user:list`, `kyc:read` and `kyc:request`; an account has no identity request.

**Steps:**

1. Open its panel, choose Require KYB, enter a reason, and confirm.

**Expected Results:**

* The Identity card shows a `business` request with that reason, and offers Drop on it.

<!-- trace:case id=g10adm.console-user-directory.TC-j95 rev=1 -->
### g10adm.console-user-directory.US5-TC2: Without kyc:read the panel shows no identity

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-05

**Pre-conditions:**

* An operator holds `user:list`, not `kyc:read`.

**Steps:**

1. Open an account's panel.

**Expected Results:**

* No Identity card is shown.
