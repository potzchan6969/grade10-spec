# grade10-admin/console/roles-and-permissions Specification

## Purpose

The Grade10 admin page that shows what each closed role grants and what each
permission means, derived from the shipped role-to-permission mapping so
operators and reviewers never read authorization source to learn the boundary.

## Feature set

- Roles & Permissions page
  - Where it sits: production console entry under Users in the sidebar
  - Who opens it: `admin` only (gated on `user:set-role`); other operator
    roles and a plain `user` do not
  - Read-only: shows the mapping; never edits roles or grants
- Roles tab
  - One matrix: every permission as a row; every closed role (including `user`)
    as a column
  - Elevated mark: every closed role except `user` is marked elevated
  - Cell states: Allowed or Not allowed for that role and permission
  - Stacking note: combined roles take the union of grants
- Permissions tab
  - Catalog: every permission with id, description, the closed roles that hold
    it, and the elevated APIs that ask for it
  - Narrowing: filter by resource id and by API path prefix; matching API
    prefixes are highlighted in the row
- Derived record
  - One source: content from the shipped vocabulary and role-to-permission
    mapping; API names from the committed procedure documents
  - Drift refused: a committed view that disagrees with the mapping source
    fails a repository check

## Requirements

### Requirement: The page sits under Users for admin only

The Roles & Permissions surface SHALL be a production console page at its own
address. The sidebar SHALL list it directly under Users when the signed-in
session holds `user:set-role` (only `admin` in the closed map). Opening it
SHALL require that grant. A person whose roles do not include that grant —
including every non-admin operator and a plain `user` — SHALL NOT open it.

#### Scenario: grade10-admin-console-roles-and-permissions-SC-01 - Sidebar lists the page under Users for admin
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **WHEN** an `admin` who can open the console signs in
- **THEN** the sidebar lists Roles & Permissions directly under Users
- **AND** opening it shows the surface

#### Scenario: grade10-admin-console-roles-and-permissions-SC-02 - Non-admin sessions cannot open the page
**Serves:** grade10-admin-console-roles-and-permissions-US-03 - Non-admin is refused the page

- **GIVEN** a person whose roles do not include `user:set-role` (for example
  `staff`, `support`, `auditor`, or only `user`)
- **WHEN** they request the Roles & Permissions address
- **THEN** the console refuses the page the same way it refuses other surfaces
  they cannot open

### Requirement: The surface is read-only

The page SHALL NOT offer controls that create a role, edit a role, or change
what a role grants. Who holds a role remains the Users directory; what a role
grants remains the shipped mapping.

#### Scenario: grade10-admin-console-roles-and-permissions-SC-03 - No create or edit role controls
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **WHEN** an operator opens Roles & Permissions
- **THEN** the page offers no control that creates a role or edits a role's grants

### Requirement: The Roles tab is one grants matrix

The Roles tab SHALL show one table whose rows are every permission in the
vocabulary (grouped by resource) and whose columns are every role in the closed
set from `shared/auth/roles`, including `user`. A cell SHALL read Allowed when
that role grants that permission, and Not allowed otherwise. The page SHALL
state that a person who holds several roles receives the union of those roles'
grants. The table SHALL NOT fan permissions out across View / Create / Edit /
Delete / Manage columns. Every closed role except `user` SHALL be marked
elevated on its column; `user` SHALL NOT be marked elevated.

#### Scenario: grade10-admin-console-roles-and-permissions-SC-04 - Every closed role is a column
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **WHEN** an operator opens the Roles tab
- **THEN** the table names every role in the closed set as a column, including
  `user`

#### Scenario: grade10-admin-console-roles-and-permissions-SC-05 - Staff grants read on the matrix
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **GIVEN** the Roles tab
- **WHEN** the operator reads the `store:read` row
- **THEN** the `staff` cell reads Allowed
- **AND** a permission `staff` does not hold reads Not allowed in the `staff`
  cell

#### Scenario: grade10-admin-console-roles-and-permissions-SC-06 - Support cannot set roles on the matrix
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **GIVEN** the Roles tab
- **WHEN** the operator reads the `user:set-role` row
- **THEN** the `support` cell reads Not allowed

#### Scenario: grade10-admin-console-roles-and-permissions-SC-07 - The page states that roles stack
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **WHEN** an operator opens the Roles tab
- **THEN** the page states that a person with several roles receives the union of those roles' grants

#### Scenario: grade10-admin-console-roles-and-permissions-SC-13 - Elevated roles are marked
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **WHEN** an operator opens the Roles tab
- **THEN** the `staff` column is marked elevated
- **AND** the `user` column is not marked elevated

### Requirement: The Permissions tab is the vocabulary catalog with roles and APIs

The Permissions tab SHALL list every permission in the vocabulary. Each row
SHALL carry the permission id (`resource:action`), a short description of what
the permission allows, every closed role that holds that permission in the
shipped mapping, and the elevated procedures that require that permission,
named from the committed API documents. The row SHALL NOT show separate
Resource and Action columns.

#### Scenario: grade10-admin-console-roles-and-permissions-SC-08 - Every permission appears with roles and APIs
**Serves:** grade10-admin-console-roles-and-permissions-US-02 - Admin reads the permission catalog

- **WHEN** an operator opens the Permissions tab
- **THEN** every permission in the vocabulary appears once
- **AND** each row shows id, description, the roles that hold it (or an empty
  mark when none do), and the APIs that ask for it (or an empty mark when none
  do)

#### Scenario: grade10-admin-console-roles-and-permissions-SC-09 - Auditor's only grant is named in the catalog
**Serves:** grade10-admin-console-roles-and-permissions-US-02 - Admin reads the permission catalog

- **WHEN** an operator opens the Permissions tab
- **THEN** `audit:read` appears with its description
- **AND** at least one elevated procedure that requires `audit:read` is listed
  on that row

### Requirement: The Permissions tab narrows by resource and API prefix

The Permissions tab SHALL offer a filter on permission resource (the id before
the colon) and a filter on API path that matches a prefix. When an API prefix
filter is set, each matching API label on a row SHALL highlight the matched
prefix. Clearing either filter SHALL restore the full catalog for that
dimension.

#### Scenario: grade10-admin-console-roles-and-permissions-SC-14 - Resource and API filters narrow the catalog
**Serves:** grade10-admin-console-roles-and-permissions-US-02 - Admin reads the permission catalog

- **WHEN** an operator opens the Permissions tab and filters to one resource
- **THEN** only permissions of that resource remain listed
- **AND** filtering APIs by a prefix leaves only rows whose APIs match that
  prefix and highlights the matched span on those labels

### Requirement: A deep link highlights the named role on the Roles tab

When the page is opened with a role from the closed set identified, the Roles
tab SHALL open with that role's column highlighted. An unknown role name SHALL
fall back to the Roles tab without inventing a role.

#### Scenario: grade10-admin-console-roles-and-permissions-SC-10 - A staff link highlights staff
**Serves:** grade10-admin-console-roles-and-permissions-US-01 - Admin compares what roles can do

- **WHEN** an operator opens Roles & Permissions identifying the `staff` role
- **THEN** the Roles tab is shown with the `staff` column highlighted

### Requirement: The document is read from the shipped mapping

The page's role columns, grant cells, and permission catalog SHALL be produced
from the shipped closed role set, permission vocabulary, and role-to-permission
mapping that `shared/auth/roles` requires products to enforce. API names on the
Permissions tab SHALL come from the committed procedure documents. No part of
the role or permission content is authored by hand on the page. A committed
roles-and-permissions view that disagrees with the mapping source SHALL fail a
repository check until regenerated. Producing the view SHALL be deterministic:
the same source gives byte-identical output.

#### Scenario: grade10-admin-console-roles-and-permissions-SC-11 - A changed mapping fails the check until regenerated
**Serves:** grade10-admin-console-roles-and-permissions-US-02 - Admin reads the permission catalog

- **GIVEN** a committed Roles & Permissions view
- **WHEN** the shipped role-to-permission mapping changes and the view is not regenerated
- **THEN** the repository's check fails
- **AND** regenerating the view makes the check pass

#### Scenario: grade10-admin-console-roles-and-permissions-SC-12 - Reading the same source twice gives one view
**Serves:** grade10-admin-console-roles-and-permissions-US-02 - Admin reads the permission catalog

- **WHEN** the view is produced twice from an unchanged mapping and vocabulary
- **THEN** the two views are identical byte for byte
