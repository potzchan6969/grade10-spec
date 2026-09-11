## User journeys

### grade10-admin-console-roles-and-permissions-US-01: Admin compares what roles can do

**As an** admin,
**I want** to open Roles & Permissions and read one grants matrix,
**so that** I can see which permissions each closed role is allowed and refused without reading authorization source.

**Accepted by:**

- `grade10-admin-console-roles-and-permissions-SC-01` — Sidebar lists the page under Users for admin
- `grade10-admin-console-roles-and-permissions-SC-03` — No create or edit role controls
- `grade10-admin-console-roles-and-permissions-SC-04` — Every closed role is a column
- `grade10-admin-console-roles-and-permissions-SC-05` — Staff grants read on the matrix
- `grade10-admin-console-roles-and-permissions-SC-06` — Support cannot set roles on the matrix
- `grade10-admin-console-roles-and-permissions-SC-07` — The page states that roles stack
- `grade10-admin-console-roles-and-permissions-SC-10` — A staff link highlights staff
- `grade10-admin-console-roles-and-permissions-SC-13` — Elevated roles are marked

### grade10-admin-console-roles-and-permissions-US-02: Admin reads the permission catalog

**As an** admin,
**I want** to open the Permissions tab,
**so that** I can see every permission's id, meaning, which roles hold it, and which elevated APIs ask for it when designing or reviewing access boundaries.

**Accepted by:**

- `grade10-admin-console-roles-and-permissions-SC-08` — Every permission appears with roles and APIs
- `grade10-admin-console-roles-and-permissions-SC-09` — Auditor's only grant is named in the catalog
- `grade10-admin-console-roles-and-permissions-SC-14` — Resource and API filters narrow the catalog
- `grade10-admin-console-roles-and-permissions-SC-11` — A changed mapping fails the check until regenerated
- `grade10-admin-console-roles-and-permissions-SC-12` — Reading the same source twice gives one view

### grade10-admin-console-roles-and-permissions-US-03: Non-admin is refused the page

**As a** person who is not `admin` (including a plain `user`),
**I want** the console to refuse Roles & Permissions,
**so that** the grant map stays an admin surface.

**Accepted by:**

- `grade10-admin-console-roles-and-permissions-SC-02` — Non-admin sessions cannot open the page
