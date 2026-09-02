## MODIFIED Requirements

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

#### Scenario: roles-SC-07 - Staff can operate the store and auction catalog

- **GIVEN** a person with the `staff` role
- **WHEN** they take a store write or an auction operate action
- **THEN** the system allows it

#### Scenario: roles-SC-07a - Staff can write the auction catalogue

- **GIVEN** a person with the `staff` role
- **WHEN** they take an auction write action
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
