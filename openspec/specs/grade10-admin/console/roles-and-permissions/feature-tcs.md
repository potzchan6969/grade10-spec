# grade10-admin/console/roles-and-permissions Test Cases

**Status:** pending-review · 0/5
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## g10adm.console-roles-and-permissions.US1: Admin compares what roles can do

**As an** admin,
**I want** to open Roles & Permissions and read one grants matrix,
**so that** I can see which permissions each closed role is allowed and refused without reading authorization source.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-61b rev=1 covers=g10adm.console-roles-and-permissions.SC-n42,g10adm.console-roles-and-permissions.SC-dk1,g10adm.console-roles-and-permissions.SC-rth,g10adm.console-roles-and-permissions.SC-gev,g10adm.console-roles-and-permissions.SC-kbi,g10adm.console-roles-and-permissions.SC-xau,g10adm.console-roles-and-permissions.SC-ama -->
### g10adm.console-roles-and-permissions.US1-TC1: The Roles tab reads one grants matrix, every closed role a column, with nothing to edit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* An admin is signed in to the admin console.

**Steps:**

1. Read the sidebar, and click Roles & Permissions.
2. Read the matrix's columns, their marks and the text around it.
3. Read the `store:read` row under `staff`, and the `user:set-role` row under `support` and `admin`.
4. Look for a way to create or edit a role on either tab, and click a cell.

**Expected Results:**

* Step 1 lists Roles & Permissions directly under Users, opening on its own address at the Roles tab.
* Step 2 names every closed role a column, `user` included, every one but `user` marked elevated, one row per permission grouped by resource; the page says several roles combine as the union of their grants.
* Step 3 reads Allowed, Not allowed and Allowed.
* Step 4 finds nothing to create or edit a role or its grants, and the cell changes nothing.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-acq rev=1 covers=g10adm.console-roles-and-permissions.SC-7mf -->
### g10adm.console-roles-and-permissions.US1-TC6: A link naming a role opens the Roles tab with its column highlighted

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* An admin is signed in to the admin console.

**Steps:**

1. Open Roles & Permissions on the address naming `staff`.
2. Open it on the address naming `not-a-role`.

**Expected Results:**

* Step 1 opens the Roles tab with the `staff` column highlighted.
* Step 2 opens it with no column highlighted and none added.

---

## g10adm.console-roles-and-permissions.US2: Admin reads the permission catalog

**As an** admin,
**I want** to open the Permissions tab,
**so that** I can see every permission's id, meaning, which roles hold it, and which elevated APIs ask for it when designing or reviewing access boundaries.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-66a rev=1 covers=g10adm.console-roles-and-permissions.SC-d44,g10adm.console-roles-and-permissions.SC-hou -->
### g10adm.console-roles-and-permissions.US2-TC1: Every permission appears once with its id, meaning, roles and APIs

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-roles-and-permissions-US-02

**Pre-conditions:**

* An admin has the Permissions tab open.

**Steps:**

1. Read every row against the shipped permission vocabulary, and the `audit:read` row.

**Expected Results:**

* Every permission appears exactly once, its `resource:action` id whole, with a description, the roles that hold it and the APIs that ask for it, an empty mark where none do.
* `audit:read` carries its description, `auditor` among its roles, and at least one elevated API that requires it.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-37o rev=1 covers=g10adm.console-roles-and-permissions.SC-rj6 -->
### g10adm.console-roles-and-permissions.US2-TC3: The resource and API filters narrow the catalog and clear back to it

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-roles-and-permissions-US-02

**Pre-conditions:**

* An admin has the Permissions tab open.

**Steps:**

1. Filter to the `store` resource.
2. Filter APIs by the opening of an API path one `store` row lists.
3. Clear the API filter, then the resource filter.

**Expected Results:**

* Step 1 leaves only `store:` permissions.
* Step 2 leaves only rows whose APIs match, the matched span highlighted.
* Step 3 restores every `store:` row, then the full catalog.

---

## g10adm.console-roles-and-permissions.US3: Non-admin is refused the page

**As a** person who is not `admin` (including a plain `user`),
**I want** the console to refuse Roles & Permissions,
**so that** the grant map stays an admin surface.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-i3a rev=1 covers=g10adm.console-roles-and-permissions.SC-gmv -->
### g10adm.console-roles-and-permissions.US3-TC1: A session without the set-role grant is refused the page and does not see it listed

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
* **Trace:** grade10-admin-console-roles-and-permissions-US-03

**Pre-conditions:**

* `<role>` is signed in.

**Test data:**

| `<role>` |
| --- |
| admin(staff) |
| admin(support) |
| admin(auditor) |
| customer(user) |

**Steps:**

1. Read the sidebar.
2. Open the Roles & Permissions address directly.

**Expected Results:**

* Step 1 does not list it.
* Step 2 is refused as the console refuses any surface the session cannot open, showing no role or permission.
