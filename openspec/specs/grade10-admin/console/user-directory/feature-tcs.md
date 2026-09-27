# grade10-admin/console/user-directory Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-admin-console-user-directory-US1: Admin reviews who holds elevated grants

**As an** admin,
**I want** to narrow Users to the accounts holding a role and read what each
of those accounts can actually do,
**so that** I can review the elevated access in the console without reading
authorization source or asking an engineer.

<!-- trace:case id=g10adm.console-user-directory.TC-dac rev=1 covers=g10adm.console-user-directory.SC-s3c,g10adm.console-user-directory.SC-fjy,g10adm.console-user-directory.SC-2zy,g10adm.console-user-directory.SC-8pc,g10adm.console-user-directory.SC-0vu,g10adm.console-user-directory.SC-4l4,g10adm.console-user-directory.SC-w5y,g10adm.console-user-directory.SC-fy9,g10adm.console-user-directory.SC-k2t -->
### grade10-admin-console-user-directory-US1-TC1-1: Narrow to a role and read mapping grants

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
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:set-role`). Directory holds <support account> and accounts that do not hold `admin`.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Narrow to accounts that hold `admin`.
3. Note the stated count.
4. Narrow to banned accounts under Users.
5. Open <support account> and check its grants.
6. Open `support` from the account's identity.

**Expected Results:**

* Step 2 lists only `admin` accounts; step 3 states how many.
* Step 4 lists only banned accounts with no elevated role.
* Step 5 shows exactly the grants the mapping gives `support`, elevated ones marked once.
* Step 6 opens Roles & Permissions on that role.

<!-- trace:case id=g10adm.console-user-directory.TC-k1h rev=1 covers=g10adm.console-user-directory.SC-s3c,g10adm.console-user-directory.SC-fjy,g10adm.console-user-directory.SC-2zy,g10adm.console-user-directory.SC-8pc,g10adm.console-user-directory.SC-0vu,g10adm.console-user-directory.SC-4l4,g10adm.console-user-directory.SC-w5y,g10adm.console-user-directory.SC-fy9,g10adm.console-user-directory.SC-k2t -->
### grade10-admin-console-user-directory-US1-TC2-1: Ungranted moves are not offered

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-01

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:ban`, not `user:set-role` or `user:delete`). Directory lists an account.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open an account.
3. Check row and panel actions.

**Expected Results:**

* Changing roles and erasure are not offered.
* Ban or unban is still offered.

---

## grade10-admin-console-user-directory-US2: Operator works one account from a single address

**As an** operator,
**I want** one address that opens the account I was sent to and carries on to
whatever it points at,
**so that** a colleague's link, a trail entry and my own bookmark all land me
in the same place, and I never hunt for the person twice.

<!-- trace:case id=g10adm.console-user-directory.TC-ww8 rev=1 covers=g10adm.console-user-directory.SC-kyo,g10adm.console-user-directory.SC-pix,g10adm.console-user-directory.SC-thq,g10adm.console-user-directory.SC-akc,g10adm.console-user-directory.SC-wee,g10adm.console-user-directory.SC-xy1 -->
### grade10-admin-console-user-directory-US2-TC1-1: Address opens the panel; view survives a paste

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
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**
Signed in as admin(holds `user:list`). Directory holds <known account>.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Search, narrow, and move past the first page; open <known account>.
3. Copy the address.
4. Open that address in another session that holds the same grants.

**Expected Results:**

* Step 2 opens the account panel beside the list.
* Step 4 shows the same search, narrowing, page, and open panel without searching again.

<!-- trace:case id=g10adm.console-user-directory.TC-uh8 rev=1 covers=g10adm.console-user-directory.SC-kyo,g10adm.console-user-directory.SC-pix,g10adm.console-user-directory.SC-thq,g10adm.console-user-directory.SC-akc,g10adm.console-user-directory.SC-wee,g10adm.console-user-directory.SC-xy1 -->
### grade10-admin-console-user-directory-US2-TC2-1: Panel offers loyalty and audit hand-offs

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
* **Trace:** grade10-admin-console-user-directory-US-02

**Pre-conditions:**
Signed in as admin(holds `user:list` and may read the audit trail). Directory lists <customer account with no elevated role> and <elevated account>.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <customer account with no elevated role>.
3. Open <elevated account>.

**Expected Results:**

* Step 2 panel offers that person's loyalty record and what the account has done among its actions, ahead of ban, unban, or erase.
* Step 3 panel offers what the account has done among its actions and does not offer a loyalty record.

---

## grade10-admin-console-user-directory-US3: Operator suspends an account from auctions

**As an** operator holding `auction:moderate`,
**I want** to suspend an account from auctions from its panel on Users, and
reinstate it later,
**so that** I can stop a bidder I have reason to stop without banning them
from the whole platform.

<!-- trace:case id=g10adm.console-user-directory.TC-3ua rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### grade10-admin-console-user-directory-US3-TC1-1: Suspend an account from its panel with a reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list` and `auction:moderate`). <active account>
is not suspended and not banned.

**Test data:**

| Field | Value |
| --- | --- |
| <operator reason> | Suspected shill bidding |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <active account>.
3. Choose suspend from auctions.
4. Enter <operator reason> and confirm.

**Expected Results:**

* Panel shows suspended from auctions, with <operator reason>, who, and when.
* Panel offers reinstate, not suspend.
* Account still shows as not banned.

<!-- trace:case id=g10adm.console-user-directory.TC-ed0 rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### grade10-admin-console-user-directory-US3-TC2-1: Suspension cannot be confirmed without a reason

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list` and `auction:moderate`). <active account>
is not suspended.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <active account>.
3. Choose suspend from auctions.
4. Try to confirm with the reason left empty.

**Expected Results:**

* The suspension cannot be confirmed.
* Panel still shows <active account> as not suspended.

<!-- trace:case id=g10adm.console-user-directory.TC-14a rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### grade10-admin-console-user-directory-US3-TC3-1: Reinstate an account suspended for a missed deadline

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list` and `auction:moderate`). <deadline-suspended
account> is suspended for a missed payment deadline.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <deadline-suspended account>.
3. Choose reinstate and confirm.

**Expected Results:**

* Panel shows not suspended from auctions.
* Panel offers suspend, not reinstate.

<!-- trace:case id=g10adm.console-user-directory.TC-a2x rev=1 covers=g10adm.console-user-directory.SC-8ll,g10adm.console-user-directory.SC-e0b,g10adm.console-user-directory.SC-gn2,g10adm.console-user-directory.SC-25v -->
### grade10-admin-console-user-directory-US3-TC4-1: Operator without auction:moderate sees neither move

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-user-directory-US-03

**Pre-conditions:**
Signed in as admin(holds `user:list`, not `auction:moderate`).
<deadline-suspended account> is suspended; <active account> is not.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <deadline-suspended account>.
3. Open <active account>.

**Expected Results:**

* Neither panel offers suspend or reinstate.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suspension without a reason leaves no usable operator record | **Raised, folded into spec:** the reason requirement |
| Platform bans could be mistaken for auction standing | **Raised, folded into spec:** the separate standing requirement |
| A client-only grant gate could be bypassed | **Raised, folded into spec:** the server-side grant requirement |
| Run | Read the Users-panel feature set, journey, decisions, and User Directory PRD; denied requirement deltas and archived changes |
