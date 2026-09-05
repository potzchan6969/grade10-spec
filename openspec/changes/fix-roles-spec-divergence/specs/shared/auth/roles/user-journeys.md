## User journeys

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
- `shared-auth-roles-SC-11` — Reading a case is not reading its identity document

### shared-auth-roles-US-03: Case work and money sit in different hands

**As an** operator,
**I want** the grants that run a case and the grants that pay against it to sit in different roles,
**so that** nobody provisioned to type bank references can open a customer's identity document.

**Accepted by:**

- `shared-auth-roles-SC-12` — Staff run a case and cannot pay against it
- `shared-auth-roles-SC-13` — A treasurer moves money and sees no identity document
