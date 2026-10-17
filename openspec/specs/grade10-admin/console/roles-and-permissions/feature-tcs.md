# grade10-admin/console/roles-and-permissions Test Cases

**Status:** pending-review · 0/12
**Drafts styled:** 2026-10-16, tcs-rules r6

## grade10-admin-console-roles-and-permissions-US1: Admin compares what roles can do

**As an** admin,
**I want** to open Roles & Permissions and read one grants matrix,
**so that** I can see which permissions each closed role is allowed and refused without reading authorization source.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-61b rev=1 covers=g10adm.console-roles-and-permissions.SC-n42 -->
### grade10-admin-console-roles-and-permissions-US1-TC1-1: Roles & Permissions sits directly under Users and opens for an admin

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.

**Steps:**

1. Read the sidebar.
2. Click Roles & Permissions.

**Expected Results:**

* Step 1 lists Roles & Permissions directly under Users.
* Step 2 opens the page on its own address, showing the Roles tab.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-wmn rev=1 covers=g10adm.console-roles-and-permissions.SC-dk1,g10adm.console-roles-and-permissions.SC-rth -->
### grade10-admin-console-roles-and-permissions-US1-TC2-1: The Roles tab names every closed role as a column and marks the elevated ones

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.
* The page is open on the Roles tab.

**Steps:**

1. Read the matrix's column headers.
2. Read the mark on the `staff` and `user` columns.

**Expected Results:**

* Step 1 names every role in the closed set, `user` included, one column each.
* `staff` is marked elevated; `user` is not.
* Every column other than `user` is marked elevated.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-gyp rev=1 covers=g10adm.console-roles-and-permissions.SC-gev,g10adm.console-roles-and-permissions.SC-kbi -->
### grade10-admin-console-roles-and-permissions-US1-TC3-1: A cell reads Allowed or Not allowed from the shipped mapping

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.
* The page is open on the Roles tab.

**Test data:**

| Row | Column | The cell reads |
| --- | --- | --- |
| `store:read` | `staff` | Allowed |
| `user:set-role` | `support` | Not allowed |
| `user:set-role` | `admin` | Allowed |

**Steps:**

1. Find the row's permission in the matrix.
2. Read the cell under the row's column.

**Expected Results:**

* Step 2 reads as the row states.
* The matrix carries one row per permission, grouped by resource, and no View, Create, Edit, Delete or Manage columns.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-lp9 rev=1 covers=g10adm.console-roles-and-permissions.SC-xau -->
### grade10-admin-console-roles-and-permissions-US1-TC4-1: The page says several roles combine as the union of their grants

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.
* The page is open on the Roles tab.

**Steps:**

1. Read the text around the matrix.

**Expected Results:**

* The page states that a person holding several roles receives the union of those roles' grants.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-c0q rev=1 covers=g10adm.console-roles-and-permissions.SC-ama -->
### grade10-admin-console-roles-and-permissions-US1-TC5-1: The page offers no way to create or edit a role

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
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.
* The page is open.

**Steps:**

1. Read the Roles tab, its columns and cells.
2. Open the Permissions tab and read its rows.

**Expected Results:**

* Neither tab offers a control that creates a role, edits a role, or changes what a role grants.
* Clicking a cell changes nothing it shows.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-acq rev=1 covers=g10adm.console-roles-and-permissions.SC-7mf -->
### grade10-admin-console-roles-and-permissions-US1-TC6-1: A link naming a role opens the Roles tab with its column highlighted

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-01

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.

**Test data:**

| The address names | The page opens |
| --- | --- |
| `staff` | On the Roles tab, the `staff` column highlighted |
| `not-a-role` | On the Roles tab, no column highlighted and no column added |

**Steps:**

1. Open Roles & Permissions on the address naming the row's role.

**Expected Results:**

* Step 1 opens as the row states.

---

## grade10-admin-console-roles-and-permissions-US2: Admin reads the permission catalog

**As an** admin,
**I want** to open the Permissions tab,
**so that** I can see every permission's id, meaning, which roles hold it, and which elevated APIs ask for it when designing or reviewing access boundaries.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-66a rev=1 covers=g10adm.console-roles-and-permissions.SC-d44 -->
### grade10-admin-console-roles-and-permissions-US2-TC1-1: Every permission appears once with its id, meaning, roles and APIs

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-02

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.
* The page is open on the Permissions tab.

**Steps:**

1. Read every row of the catalog.
2. Compare the rows with the shipped permission vocabulary.

**Expected Results:**

* Every permission in the vocabulary appears exactly once.
* Each row shows the `resource:action` id, a description, the roles that hold it, and the APIs that ask for it; an empty mark stands where none do.
* No row splits the id into separate Resource and Action columns.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-rof rev=1 covers=g10adm.console-roles-and-permissions.SC-hou -->
### grade10-admin-console-roles-and-permissions-US2-TC2-1: The auditor's only grant names an elevated API that asks for it

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-02

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.
* The page is open on the Permissions tab.

**Steps:**

1. Find the `audit:read` row.

**Expected Results:**

* The row carries its description, `auditor` among its roles, and at least one elevated API that requires `audit:read`.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-37o rev=1 covers=g10adm.console-roles-and-permissions.SC-rj6 -->
### grade10-admin-console-roles-and-permissions-US2-TC3-1: The resource and API filters narrow the catalog and clear back to it

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-02

**Pre-conditions:**

* admin(admin) is signed in to <grade10 admin url>.
* The page is open on the Permissions tab.

**Test data:**

| Field | Value |
| --- | --- |
| Resource | `store` |
| API prefix | `<api prefix>`, the opening of an API path one `store` permission's row lists |

**Steps:**

1. Filter by the resource from **Test data**.
2. Filter APIs by the prefix from **Test data**.
3. Clear the API filter.
4. Clear the resource filter.

**Expected Results:**

* Step 1 leaves only `store:` permissions.
* Step 2 leaves only rows whose APIs match the prefix, with the matched span highlighted on each matching API label.
* Step 3 restores every `store:` row.
* Step 4 restores the full catalog.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-gwl rev=1 covers=g10adm.console-roles-and-permissions.SC-hc3 -->
### grade10-admin-console-roles-and-permissions-US2-TC4-1: A mapping change without a regenerated view fails the repository check

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-02

**Pre-conditions:**

* A clean checkout of the application repository whose committed roles-and-permissions view matches the shipped mapping.

**Steps:**

1. Grant `staff` one permission it does not hold in the role-to-permission mapping, without regenerating the view.
2. Run the repository's check.
3. Regenerate the view.
4. Run the check again.

**Expected Results:**

* Step 2 fails, naming the view as out of date.
* Step 4 passes.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-bkf rev=1 covers=g10adm.console-roles-and-permissions.SC-fgw -->
### grade10-admin-console-roles-and-permissions-US2-TC5-1: Producing the view twice from one source gives identical bytes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-roles-and-permissions-US-02

**Pre-conditions:**

* A clean checkout of the application repository.

**Steps:**

1. Produce the roles-and-permissions view.
2. Produce it again without changing the mapping or the vocabulary.
3. Compare the two outputs.

**Expected Results:**

* The two outputs are identical byte for byte.

---

## grade10-admin-console-roles-and-permissions-US3: Non-admin is refused the page

**As a** person who is not `admin` (including a plain `user`),
**I want** the console to refuse Roles & Permissions,
**so that** the grant map stays an admin surface.

<!-- trace:case id=g10adm.console-roles-and-permissions.TC-i3a rev=1 covers=g10adm.console-roles-and-permissions.SC-gmv -->
### grade10-admin-console-roles-and-permissions-US3-TC1-1: A session without the set-role grant is refused the page and does not see it listed

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-console-roles-and-permissions-US-03

**Pre-conditions:**

* admin(`<role>`) is signed in to <grade10 admin url>, or customer(user) for the `user` row.

**Test data:**

| `<role>` |
| --- |
| `staff` |
| `support` |
| `auditor` |
| `user` |

**Steps:**

1. Read the sidebar.
2. Open the Roles & Permissions address directly.

**Expected Results:**

* Step 1 does not list Roles & Permissions.
* Step 2 is refused the way the console refuses any surface the session cannot open; no role or permission content is shown.
