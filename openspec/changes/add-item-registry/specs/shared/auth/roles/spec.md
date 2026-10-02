# shared/auth/roles Specification

## Feature set

- What a role holds
  - Moving an item: a grant of its own beside reading and writing stock,
    held by staff and admin, and the treasurer holds no inventory grant

## MODIFIED Requirements

### Requirement: Each role grants a fixed set of permissions

The mapping from role to permissions SHALL be:

| Role | Grants |
| --- | --- |
| `user` | none |
| `staff` | `store:read`, `store:write`, `loyalty:read`, `auction:read`, `auction:write`, `auction:operate`, `auction:shipment`, `auction:refund`, `vault:read`, `vault:operate`, `vault:approve`, `grading:read`, `grading:operate`, `grading:approve`, `kyc:read`, `appointment:read`, `appointment:manage`, `inventory:read`, `inventory:write`, `inventory:transfer` |
| `support` | `user:list`, `user:ban`, `session:list`, `session:revoke` |
| `finance` | `auction:read`, `auction:payment` |
| `treasurer` | `auction:read`, `auction:payment`, `vault:read`, `vault:payout` |
| `auditor` | `audit:read` |
| `admin` | every permission in the vocabulary |

`staff` and `treasurer` SHALL share only `auction:read` and `vault:read`:
`staff` runs a vault case and sets what it costs, and only `treasurer`
records the vault money that moves. `treasurer` SHALL NOT hold `kyc:read`,
because reading a case to record its money is no reason to see the person's
identity document. `treasurer` SHALL hold no `inventory` grant: reading a
case's money is no reason to read who owns which item.

A person who holds several operator roles SHALL receive the union of those
roles' grants. A person holding `staff` and `treasurer` therefore holds both
sides of the vault split, and the pair SHALL NOT be refused. Operators SHALL
change who holds a role, and SHALL NOT change what a role grants.

<!-- trace:scenario id=g10.shared-roles.SC-xb7 rev=1 -->
#### Scenario: shared-auth-roles-SC-07 - Staff can operate the store and auction catalog
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person with the `staff` role
- **WHEN** they take a store write or an auction operate action
- **THEN** the system allows it

<!-- trace:scenario id=g10.shared-roles.SC-pvk rev=1 -->
#### Scenario: shared-auth-roles-SC-07a - Staff can write the auction catalogue
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person with the `staff` role
- **WHEN** they take an auction write action
- **THEN** the system allows it

<!-- trace:scenario id=g10.shared-roles.SC-qv7 rev=1 -->
#### Scenario: shared-auth-roles-SC-08 - Auditor reads the trail and nothing else
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person whose only operator role is `auditor`
- **WHEN** they read the audit trail
- **THEN** the system allows it
- **AND** a ban, a store write, or a role change is refused

<!-- trace:scenario id=g10.shared-roles.SC-yjl rev=1 -->
#### Scenario: shared-auth-roles-SC-09 - Combined roles stack
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person holding `support` and `staff`
- **WHEN** they list users and write to the store
- **THEN** both actions are allowed

<!-- trace:scenario id=g10.shared-roles.SC-bye rev=1 -->
#### Scenario: shared-auth-roles-SC-10 - An operator cannot widen a role's grants
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they use the users directory
- **THEN** they can change who holds a role
- **AND** they cannot change what that role grants

#### Scenario: shared-auth-roles-SC-12 - Staff run a vault case and cannot move its money
**Serves:** shared-auth-roles-US-03 - Case work and money are separate grants

- **GIVEN** a person whose only operator role is `staff`
- **WHEN** they start a valuation and make an offer on a vault case, then try
  to record its payout, record a repayment, read the vault money book, or
  record an auction payment
- **THEN** starting the valuation and making the offer are allowed
- **AND** the payout, the repayment, the money book and the auction payment
  are refused

#### Scenario: shared-auth-roles-SC-13 - A treasurer moves vault money and sees no identity document
**Serves:** shared-auth-roles-US-03 - Case work and money are separate grants

- **GIVEN** a person whose only operator role is `treasurer`
- **WHEN** they read a vault case and record its payout
- **THEN** both are allowed
- **AND** opening the identity document behind that case, starting a
  valuation on it, and making it an offer are refused

#### Scenario: shared-auth-roles-SC-16 - Finance collects auction payment and nothing else
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person whose only operator role is `finance`
- **WHEN** they read an auction order and record its payment
- **THEN** both are allowed
- **AND** recording its shipment, an auction operate action, an auction write
  action, and reading a vault case are refused

#### Scenario: shared-auth-roles-SC-18 - Admin holds the whole vocabulary
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **WHEN** the role matrix is read for `admin`
- **THEN** it holds every permission the vocabulary declares, in the
  vocabulary's order, `vault:payout`, `kyc:read` and `grading:approve`
  included

#### Scenario: shared-auth-roles-SC-19 - Staff run the grading counter, bookings and stock
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person whose only operator role is `staff`
- **WHEN** they run a grading counter act, approve a grading request another
  person raised, change a booking, and change inventory stock
- **THEN** each action is allowed

#### Scenario: shared-auth-roles-SC-23 - Staff move items and the treasurer holds no inventory grant
**Serves:** shared-auth-roles-US-02 - the operator's grants follow the closed vocabulary

- **WHEN** the role matrix is read for `staff`, `admin` and `treasurer`
- **THEN** `staff` and `admin` each hold `inventory:read`, `inventory:write` and `inventory:transfer`
- **AND** `treasurer` holds none of the three

### Requirement: The permission vocabulary is a closed set of resources and actions

Every permission is one resource and one action from a list every product
shares.

**Resources and actions** - A permission SHALL be a resource and an action,
written `resource:action`, drawn from this list and no other.

| Resource | Actions |
| --- | --- |
| `user` | `create`, `list`, `ban`, `set-role`, `delete` |
| `session` | `list`, `revoke` |
| `store` | `read`, `write` |
| `loyalty` | `read`, `adjust`, `invite`, `catalog`, `finance`, `demote`, `cancel` |
| `auction` | `read`, `write`, `operate`, `reserve`, `moderate`, `settle`, `payment`, `refund`, `shipment` |
| `vault` | `read`, `operate`, `approve`, `payout` |
| `kyc` | `read` |
| `grading` | `read`, `operate`, `approve` |
| `appointment` | `read`, `manage` |
| `inventory` | `read`, `write`, `transfer` |
| `audit` | `read` |

Lending is the vault's financed lane, so its cases and money sit under
`vault`; there SHALL be no `finance` resource.

**Split by cost** - `vault` SHALL split its actions by what they can cost,
this way:

| Runs the flow | Sets what it costs | Moves money |
| --- | --- | --- |
| `operate` | `approve` - recording a valuation, offer terms, decline, forfeiture | `payout` - payout, repayment, reversal, the money book and the finance position |

`payout` SHALL be the only `vault` action that moves money.

**Moving an item** - `inventory:transfer` SHALL be the only grant that moves
an item to a new owner or opens the proof of a move; `inventory:write` SHALL
NOT reach either.

**Identity documents** - `kyc:read` SHALL be a resource of its own rather than
an action on the product that collected the document. The identity capture
and the signed document printed from it outlive the case and are the same
evidence whichever product holds them, so `vault:read` SHALL NOT reach them.

**No `kyc:write`** - There SHALL be no `kyc:write`; recording a verification
stays with the flow that needs it.

#### Scenario: shared-auth-roles-SC-11 - Reading a case is not reading its identity document
**Serves:** shared-auth-roles-US-03 - Case work and money are separate grants

- **GIVEN** a person holding `vault:read` and not `kyc:read`
- **WHEN** they open a vault case and ask for the identity capture or the
  signed document behind it
- **THEN** the case is shown and both documents are refused

#### Scenario: shared-auth-roles-SC-21 - The vocabulary is exactly the listed set
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **WHEN** the declared vocabulary is read
- **THEN** it holds exactly the eleven resources and their actions in the
  table, in that order
- **AND** it holds no `finance` resource and no `kyc:write`

#### Scenario: shared-auth-roles-SC-24 - Writing the register is not moving an item
**Serves:** shared-auth-roles-US-02 - the operator's grants follow the closed vocabulary

- **GIVEN** a person holding `inventory:read` and `inventory:write` and not `inventory:transfer`
- **WHEN** they edit an item, then try to move it and to open a move's proof
- **THEN** the edit is allowed
- **AND** the move and the proof are refused
