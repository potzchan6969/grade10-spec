# grade10-admin/console/user-directory Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* Users is `<users>` on the admin console: a directory of accounts with search, Type, role and status narrowing and pages, an account opening in a panel beside the list. Each case names the grants the operator's roles hold.
* `<g10url>` is the Grade10 site. An account's moves on Users - roles, standing, sessions, create - are walked in `shared/auth/users` and `shared/auth/sessions`; this suite holds what Users offers beyond them.

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
