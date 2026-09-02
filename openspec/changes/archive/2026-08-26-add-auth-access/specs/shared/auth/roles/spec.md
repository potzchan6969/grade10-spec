## Purpose

The roles a person may hold on either brand, and which permissions each
role grants, so every product checks the same vocabulary. Grants are decided
by permission, never by comparing role names at the call site. Who holds a
role is data; what a role grants is not.

## ADDED Requirements

### Requirement: A person holds roles from a closed set

A signed-in person SHALL hold one or more of: `user`, `staff`, `support`,
`auditor`, `admin`. A person with no operator role SHALL hold `user` only.
Unknown role names SHALL be ignored.

#### Scenario: A collector is a user

- **GIVEN** a person who has never been granted an operator role
- **WHEN** a product reads who is calling
- **THEN** their roles are `user` only

#### Scenario: An unknown role is dropped

- **GIVEN** a person whose roles include a name that is not in the closed set
- **WHEN** a product reads who is calling
- **THEN** that unknown name is not among the roles

### Requirement: Grants are checked by permission

A product SHALL allow an action only when the caller holds a role that
grants the permission for that action. It SHALL NOT allow an action because
the caller holds a particular role name. A person whose only role is `user`
SHALL hold no operator permission. A permission name that is not in the
vocabulary SHALL grant nothing.

#### Scenario: A user cannot act as an operator

- **GIVEN** a person whose only role is `user`
- **WHEN** that person requests an operator action
- **THEN** the system refuses it

#### Scenario: Support cannot set roles

- **GIVEN** a person whose operator role is `support`
- **WHEN** that person tries to set another person's roles
- **THEN** the system refuses it
- **AND** they can still list users, ban, and list and revoke sessions

#### Scenario: Staff cannot list or ban users

- **GIVEN** a person whose operator role is `staff`
- **WHEN** that person tries to list or ban users
- **THEN** the system refuses it

#### Scenario: An unknown permission grants nothing

- **GIVEN** a product that checks a permission name that is not in the
  vocabulary
- **WHEN** any person requests that action
- **THEN** the system refuses it

### Requirement: Each role grants a fixed set of permissions

The mapping from role to permissions SHALL be:

- `user`: none
- `staff`: `store:read`, `store:write`, `loyalty:read`, `auction:read`,
  `auction:write`, `auction:operate`
- `support`: `user:list`, `user:ban`, `session:list`, `session:revoke`
- `auditor`: `audit:read`
- `admin`: every permission any role grants, including `user:set-role`,
  `loyalty:adjust`, `loyalty:invite`, `loyalty:catalog`, `loyalty:finance`,
  `auction:reserve`, `auction:moderate`, and `auction:settle`

A person who holds several operator roles SHALL receive the union of those
roles' grants. Operators SHALL change who holds a role, and SHALL NOT change
what a role grants.

#### Scenario: Staff can operate the store and auction catalog

- **GIVEN** a person with the `staff` role
- **WHEN** they take a store write or an auction operate action
- **THEN** the system allows it

#### Scenario: Auditor reads the trail and nothing else

- **GIVEN** a person whose only operator role is `auditor`
- **WHEN** they read the audit trail
- **THEN** the system allows it
- **AND** a ban, a store write, or a role change is refused

#### Scenario: Combined roles stack

- **GIVEN** a person holding `support` and `staff`
- **WHEN** they list users and write to the store
- **THEN** both actions are allowed

#### Scenario: An operator cannot widen a role's grants

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they use the users directory
- **THEN** they can change who holds a role
- **AND** they cannot change what that role grants
