## User journeys

### grade10-admin-console-roles-and-permissions-US-01: Admin compares what roles can do

**As an** admin,
**I want** to open Roles & Permissions and read one grants matrix,
**so that** I can see which permissions each closed role is allowed and refused without reading authorization source.

### grade10-admin-console-roles-and-permissions-US-02: Admin reads the permission catalog

**As an** admin,
**I want** to open the Permissions tab,
**so that** I can see every permission's id, meaning, which roles hold it, and which elevated APIs ask for it when designing or reviewing access boundaries.

### grade10-admin-console-roles-and-permissions-US-03: Non-admin is refused the page

**As a** person who is not `admin` (including a plain `user`),
**I want** the console to refuse Roles & Permissions,
**so that** the grant map stays an admin surface.
