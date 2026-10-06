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

## grade10-admin-console-user-directory-US4: Admin creates an account from Users

**As an** admin holding `user:create`,
**I want** to create a passwordless Auth account from Users with name, email,
and roles, open the new account's panel when create succeeds, and open the
existing account when the email is already taken,
**so that** I can stand up elevated access before the person signs in without
leaving the access desk or using Override.

<!-- trace:case id=g10adm.console-user-directory.TC-2zn rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### grade10-admin-console-user-directory-US4-TC1-1: Create succeeds and opens the new panel

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`, `user:create`, and `user:set-role`). No Auth account holds <new email>.

**Test data:**

| Field | Value |
| --- | --- |
| <new name> | New Admin |
| <new email> | new.admin@example.com |
| <roles> | `admin` |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Choose Create.
3. Enter <new name>, <new email>, and <roles>, and confirm.
4. Confirm the review.
5. Read the open panel and the page address.

**Expected Results:**

* Step 2 offers Create.
* Step 3 shows a confirmation with the admin note and does not create.
* Step 4 creates the account.
* Step 5 opens that account's panel beside the list, addressed like picking a row.

<!-- trace:case id=g10adm.console-user-directory.TC-pp4 rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### grade10-admin-console-user-directory-US4-TC2-1: Create is not offered without user:create

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
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:set-role`, not `user:create`).

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Check whether Create is offered.

**Expected Results:**

* Create is not offered.

<!-- trace:case id=g10adm.console-user-directory.TC-p4u rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### grade10-admin-console-user-directory-US4-TC3-1: Duplicate email refuses on the form and opens the existing account

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
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list`, `user:create`, and `user:set-role`). Auth already holds <taken email> on <existing account>.

**Test data:**

| Field | Value |
| --- | --- |
| <taken email> | already.there@example.com |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Choose Create.
3. Enter a name, <taken email>, and a role, and confirm Create on the form.
4. Choose the way offered to open the existing account to change roles.

**Expected Results:**

* Step 3 stays on the create form, does not open the review, shows the duplicate refuse, and does not call Create.
* Step 4 opens <existing account>'s panel.
* No second Auth row holds <taken email>.

<!-- trace:case id=g10adm.console-user-directory.TC-7d6 rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### grade10-admin-console-user-directory-US4-TC4-1: Create with only user:create offers plain user

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
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:list` and `user:create`, not `user:set-role`). No Auth account holds <plain email>.

**Test data:**

| Field | Value |
| --- | --- |
| <plain name> | Desk User |
| <plain email> | desk.user@example.com |
| <roles> | `user` |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Choose Create.
3. Enter <plain name>, <plain email>, and <roles>, and confirm.
4. Confirm the review.

**Expected Results:**

* Create is offered.
* Step 3 shows a confirmation of the draft and does not create.
* The confirmation has no email note and no admin note.
* Step 4 succeeds and opens that account's panel with roles `user` only.

<!-- trace:case id=g10adm.console-user-directory.TC-poj rev=1 covers=g10adm.console-user-directory.SC-8z1,g10adm.console-user-directory.SC-v25,g10adm.console-user-directory.SC-dz7,g10adm.console-user-directory.SC-z2a,g10adm.console-user-directory.SC-dcl,g10adm.console-user-directory.SC-xr8 -->
### grade10-admin-console-user-directory-US4-TC5-1: Create review notes when the role is admin, and combines with an email check

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-user-directory-US-04

**Pre-conditions:**
Signed in as admin(holds `user:create` and `user:set-role`). Users create expects `@9gag.com` or `@memestrategy.com`. No Auth account holds <fine email> or <off-list email>.

**Test data:**

| Field | Value |
| --- | --- |
| <fine email> | someone@9gag.com |
| <off-list email> | someone@example.com |
| <roles> | `admin` |

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Choose Create.
3. Enter a name, <fine email>, and <roles>, and confirm.
4. Read the review and choose Back.
5. Confirm Create again, then confirm the review.
6. Repeat from Create with <off-list email> and <roles>, and confirm.

**Expected Results:**

* Step 3 shows a confirmation with the admin note and does not create.
* The note says `admin` cannot be removed once created; that role is in bold; there is no email note.
* Step 4 returns to the create form and creates nothing.
* Step 5 creates the account.
* Step 6 shows the email check and the admin note on the same confirmation.

## Settled

## Reconciliation

| Finding | Disposition |
| --- | --- |
| Suspension without a reason leaves no usable operator record | **Raised, folded into spec:** the reason requirement |
| Platform bans could be mistaken for auction standing | **Raised, folded into spec:** the separate standing requirement |
| A client-only grant gate could be bypassed | **Raised, folded into spec:** the server-side grant requirement |
| Run | Read the Users-panel feature set, journey, decisions, and User Directory PRD; denied requirement deltas and archived changes |

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, proposal.md, decisions.md (Raised included), linked Create Account PRD section, and this suite for id continuity with Reconciliation stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose and Feature set, openspec/changes/archive/.

**Raised, folded into spec**

- None beyond the journey: create opens panel, Create gated on `user:create`, duplicate opens existing, plain-user create with `user:create` alone — folded as a scenario through `scenario`.
- Review notes when the role is `admin`; email and admin on one confirmation — folded as a scenario.

**Uncovered anchors**

- a scenario, `scenario`, `scenario` — **Out of suite:** restated on MODIFIED access-desk requirement; verified in the durable `grade10-admin/console/user-directory` feature suite under US-01 / US-02.
