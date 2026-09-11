# grade10-admin/console/user-directory Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-11, tcs-rules r3.0

## grade10-admin-console-user-directory-US1: Admin reviews who holds elevated grants

**As an** admin,
**I want** to narrow Users to the accounts holding a role and read what each
of those accounts can actually do,
**so that** I can review the elevated access in the console without reading
authorization source or asking an engineer.

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
4. Narrow to banned accounts that hold no operator role.
5. Open <support account> and check its grants.
6. Open one grant from the panel.

**Expected Results:**

* Step 2 lists only `admin` accounts; step 3 states how many.
* Step 4 lists only banned accounts with no operator role.
* Step 5 shows exactly the grants the mapping gives `support`, elevated ones marked.
* Step 6 opens Roles & Permissions on that grant.

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
Signed in as admin(holds `user:list` and may read the audit trail). Directory lists <customer account with no operator role> and <operator account>.

**Steps:**

1. Navigate to <grade10 admin users url>.
2. Open <customer account with no operator role>.
3. Open <operator account>.

**Expected Results:**

* Step 2 panel offers that person's loyalty record and what the account has done.
* Step 3 panel offers what the account has done and does not offer a loyalty record.
