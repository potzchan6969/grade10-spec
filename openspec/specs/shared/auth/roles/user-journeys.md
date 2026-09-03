## User journeys

### shared-auth-roles-US-01: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

**Accepted by:**

- `shared-auth-roles-SC-01` — A collector is a user
- `shared-auth-roles-SC-02` — An unknown role is dropped
- `shared-auth-roles-SC-03` — A user cannot act as an operator

### shared-auth-roles-US-02: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

**Accepted by:**

- `shared-auth-roles-SC-04` — Support cannot set roles
- `shared-auth-roles-SC-05` — Staff cannot list or ban users
- `shared-auth-roles-SC-06` — An unknown permission grants nothing
- `shared-auth-roles-SC-07` — Staff can operate the store and auction catalog
- `shared-auth-roles-SC-07a` — Staff can write the auction catalogue
- `shared-auth-roles-SC-08` — Auditor reads the trail and nothing else
- `shared-auth-roles-SC-09` — Combined roles stack
- `shared-auth-roles-SC-10` — An operator cannot widen a role's grants
