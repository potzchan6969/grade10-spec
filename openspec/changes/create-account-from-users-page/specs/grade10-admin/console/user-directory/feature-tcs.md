# grade10-admin/console/user-directory Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-24, tcs-rules r3.0

## grade10-admin-console-user-directory-US4: Admin creates an account from Users

**As an** admin holding `user:create`,
**I want** to create a passwordless Auth account from Users with name, email,
and roles, open the new account's panel when create succeeds, and open the
existing account when the email is already taken,
**so that** I can stand up elevated access before the person signs in without
leaving the access desk or using Override.

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

### grade10-admin-console-user-directory-US4-TC3-1: Duplicate email refuses and opens the existing account

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
3. Enter a name, <taken email>, and role `user`, and confirm.
4. Confirm the review.
5. Choose the way offered to open the existing account.

**Expected Results:**

* Step 3 shows a confirmation of the draft and does not create.
* Step 4 is refused with a clear message and a way to open the existing account.
* Step 5 opens <existing account>'s panel.
* No second Auth row holds <taken email>.

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
4. Read the review and go back.
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

**Run:** Blind pass read Purpose, Feature set, user-journeys.md, proposal.md, decisions.md (Raised included), linked Create Account PRD section, and this suite for id continuity with Reconciliation stripped. Denied: every Requirements section, openspec/specs/ beyond Purpose and Feature set, openspec/changes/archive/.

**Raised, folded into spec**

- None beyond the journey: create opens panel, Create gated on `user:create`, duplicate opens existing, plain-user create with `user:create` alone — folded as `grade10-admin-console-user-directory-SC-20` through `SC-23`.
- Review notes when the role is `admin`; email and admin on one confirmation — folded as `grade10-admin-console-user-directory-SC-25`.

**Uncovered anchors**

- `grade10-admin-console-user-directory-SC-01`, `SC-02`, `SC-15` — **Out of suite:** restated on MODIFIED access-desk requirement; verified in the durable `grade10-admin/console/user-directory` feature suite under US-01 / US-02.
