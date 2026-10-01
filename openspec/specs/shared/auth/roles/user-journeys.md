## User journeys

### shared-auth-roles-US-01: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

### shared-auth-roles-US-02: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

### shared-auth-roles-US-03: Case work and money are separate grants

**As an** operator,
**I want** the grants that run a case and the grants that pay against it to sit in different roles,
**so that** a person who only records payouts cannot open a customer's identity document.
