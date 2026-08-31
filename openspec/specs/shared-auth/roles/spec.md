# shared-auth/roles Specification

## Purpose
The roles a person may hold on either brand, and which permissions each
role grants, so every product checks the same vocabulary. Grants are decided
by permission, never by comparing role names at the call site. Who holds a
role is data; what a role grants is not.

## Feature set

- Closed role set
  - Named roles: user, staff, support, auditor, admin; unknown names are dropped
- Permission checks
  - Grants not names: a product checks permission, never the role string at the call site
  - Stacking: combined roles stack; an operator cannot widen what a role grants

## User journeys

### roles-US-01: Collector holds the user role only

**As a** collector who has never been granted an operator role,
**I want** my roles to be `user` only,
**so that** I cannot act as staff by accident.

**Accepted by:**

- `roles-SC-01` — A collector is a user
- `roles-SC-02` — An unknown role is dropped
- `roles-SC-03` — A user cannot act as an operator

### roles-US-02: Operator's grants follow the closed vocabulary

**As an** operator,
**I want** each action allowed only when my role grants that permission,
**so that** support cannot set roles, staff cannot ban, and an unknown permission grants nothing.

**Accepted by:**

- `roles-SC-04` — Support cannot set roles
- `roles-SC-05` — Staff cannot list or ban users
- `roles-SC-06` — An unknown permission grants nothing
- `roles-SC-07` — Staff can operate the store and auction catalog
- `roles-SC-08` — Auditor reads the trail and nothing else
- `roles-SC-09` — Combined roles stack
- `roles-SC-10` — An operator cannot widen a role's grants

## Requirements

### Requirement: A person holds roles from a closed set

A signed-in person SHALL hold one or more of: `user`, `staff`, `support`,
`auditor`, `admin`. A person with no operator role SHALL hold `user` only.
Unknown role names SHALL be ignored.

#### Scenario: roles-SC-01 - A collector is a user

- **GIVEN** a person who has never been granted an operator role
- **WHEN** a product reads who is calling
- **THEN** their roles are `user` only

#### Scenario: roles-SC-02 - An unknown role is dropped

- **GIVEN** a person whose roles include a name that is not in the closed set
- **WHEN** a product reads who is calling
- **THEN** that unknown name is not among the roles

### Requirement: Grants are checked by permission

A product SHALL allow an action only when the caller holds a role that
grants the permission for that action. It SHALL NOT allow an action because
the caller holds a particular role name. A person whose only role is `user`
SHALL hold no operator permission. A permission name that is not in the
vocabulary SHALL grant nothing.

#### Scenario: roles-SC-03 - A user cannot act as an operator

- **GIVEN** a person whose only role is `user`
- **WHEN** that person requests an operator action
- **THEN** the system refuses it

#### Scenario: roles-SC-04 - Support cannot set roles

- **GIVEN** a person whose operator role is `support`
- **WHEN** that person tries to set another person's roles
- **THEN** the system refuses it
- **AND** they can still list users, ban, and list and revoke sessions

#### Scenario: roles-SC-05 - Staff cannot list or ban users

- **GIVEN** a person whose operator role is `staff`
- **WHEN** that person tries to list or ban users
- **THEN** the system refuses it

#### Scenario: roles-SC-06 - An unknown permission grants nothing

- **GIVEN** a product that checks a permission name that is not in the
  vocabulary
- **WHEN** any person requests that action
- **THEN** the system refuses it

### Requirement: Each role grants a fixed set of permissions

The mapping from role to permissions SHALL be:

- `user`: none
- `staff`: `store:read`, `store:write`, `loyalty:read`, `auction:read`,
  `auction:catalog`, `auction:operate`
- `support`: `user:list`, `user:ban`, `session:list`, `session:revoke`
- `auditor`: `audit:read`
- `admin`: every permission any role grants, including `user:set-role`,
  `loyalty:adjust`, `loyalty:invite`, `loyalty:catalog`, `loyalty:finance`,
  `auction:reserve`, `auction:moderate`, and `auction:settle`

A person who holds several operator roles SHALL receive the union of those
roles' grants. Operators SHALL change who holds a role, and SHALL NOT change
what a role grants.

#### Scenario: roles-SC-07 - Staff can operate the store and auction catalog

- **GIVEN** a person with the `staff` role
- **WHEN** they take a store write or an auction operate action
- **THEN** the system allows it

#### Scenario: roles-SC-08 - Auditor reads the trail and nothing else

- **GIVEN** a person whose only operator role is `auditor`
- **WHEN** they read the audit trail
- **THEN** the system allows it
- **AND** a ban, a store write, or a role change is refused

#### Scenario: roles-SC-09 - Combined roles stack

- **GIVEN** a person holding `support` and `staff`
- **WHEN** they list users and write to the store
- **THEN** both actions are allowed

#### Scenario: roles-SC-10 - An operator cannot widen a role's grants

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they use the users directory
- **THEN** they can change who holds a role
- **AND** they cannot change what that role grants
