# shared/auth/roles Specification

## Purpose
The roles a person may hold on either brand, and which permissions each
role grants, so every product checks the same vocabulary. Grants are decided
by permission, never by comparing role names at the call site. Who holds a
role is data; what a role grants is not.

## Feature set

- Closed role set
  - Named roles: user, staff, support, finance, treasurer, auditor, admin; unknown names are dropped
- Permission checks
  - Refund permission: separates refund processing from payment settlement
  - Grants not names: a product checks permission, never the role string at the call site
  - Stacking: combined roles stack; an operator cannot widen what a role grants
- The vocabulary
  - Resources and actions: a closed list every product shares, so a permission nobody declared grants nothing
- What a role holds
  - Split by cost: in the vault, running a case, setting what it costs and moving its money are separate actions; staff and treasurer share no vault money grant
  - Identity documents: reached by a grant of their own, never by running a flow
  - Two people on an approval: one person may hold staff and treasurer, and nobody approves an act they recorded

## Requirements

### Requirement: A person holds roles from a closed set

A signed-in person SHALL hold one or more of: `user`, `staff`, `support`,
`finance`, `treasurer`, `auditor`, `admin`. A person with no operator role
SHALL hold `user` only. Unknown role names SHALL be ignored.

<!-- trace:scenario id=g10.shared-roles.SC-z89 rev=1 -->
#### Scenario: shared-auth-roles-SC-01 - A collector is a user
**Serves:** shared-auth-roles-US-01 - Collector holds the user role only

- **GIVEN** a person who has never been granted an operator role
- **WHEN** a product reads who is calling
- **THEN** their roles are `user` only

<!-- trace:scenario id=g10.shared-roles.SC-dqm rev=1 -->
#### Scenario: shared-auth-roles-SC-02 - An unknown role is dropped
**Serves:** shared-auth-roles-US-01 - Collector holds the user role only

- **GIVEN** a person whose roles include a name that is not in the closed set
- **WHEN** a product reads who is calling
- **THEN** that unknown name is not among the roles

#### Scenario: shared-auth-roles-SC-20 - Finance and treasurer are kept as roles
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person whose roles are `finance` and `treasurer`
- **WHEN** a product reads who is calling
- **THEN** their roles are `finance` and `treasurer`, and neither is dropped

### Requirement: Grants are checked by permission

A product SHALL allow an action only when the caller holds a role that
grants the permission for that action. It SHALL NOT allow an action because
the caller holds a particular role name. A person whose only role is `user`
SHALL hold no operator permission. A permission name that is not in the
vocabulary SHALL grant nothing.

<!-- trace:scenario id=g10.shared-roles.SC-s2f rev=1 -->
#### Scenario: shared-auth-roles-SC-03 - A user cannot act as an operator
**Serves:** shared-auth-roles-US-01 - Collector holds the user role only

- **GIVEN** a person whose only role is `user`
- **WHEN** that person requests an operator action
- **THEN** the system refuses it

<!-- trace:scenario id=g10.shared-roles.SC-pq2 rev=1 -->
#### Scenario: shared-auth-roles-SC-04 - Support cannot set roles
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person whose operator role is `support`
- **WHEN** that person tries to set another person's roles
- **THEN** the system refuses it
- **AND** they can still list users, ban, and list and revoke sessions

<!-- trace:scenario id=g10.shared-roles.SC-s22 rev=1 -->
#### Scenario: shared-auth-roles-SC-05 - Staff cannot list or ban users
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person whose operator role is `staff`
- **WHEN** that person tries to list or ban users
- **THEN** the system refuses it

<!-- trace:scenario id=g10.shared-roles.SC-q3k rev=1 -->
#### Scenario: shared-auth-roles-SC-06 - An unknown permission grants nothing
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a product that checks a permission name that is not in the
  vocabulary
- **WHEN** any person requests that action
- **THEN** the system refuses it

### Requirement: Each role grants a fixed set of permissions

The mapping from role to permissions SHALL be:

| Role | Grants |
| --- | --- |
| `user` | none |
| `staff` | `store:read`, `store:write`, `loyalty:read`, `auction:read`, `auction:write`, `auction:operate`, `auction:shipment`, `auction:refund`, `vault:read`, `vault:operate`, `vault:approve`, `grading:read`, `grading:operate`, `grading:approve`, `kyc:read`, `appointment:read`, `appointment:manage`, `inventory:read`, `inventory:write` |
| `support` | `user:list`, `user:ban`, `session:list`, `session:revoke` |
| `finance` | `auction:read`, `auction:payment` |
| `treasurer` | `auction:read`, `auction:payment`, `vault:read`, `vault:payout` |
| `auditor` | `audit:read` |
| `admin` | every permission in the vocabulary |

`staff` and `treasurer` SHALL share only `auction:read` and `vault:read`:
`staff` runs a vault case and sets what it costs, and only `treasurer`
records the vault money that moves. `treasurer` SHALL NOT hold `kyc:read`,
because reading a case to record its money is no reason to see the person's
identity document.

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

### Requirement: Refund permission follows the closed role vocabulary

The permission vocabulary SHALL include `auction:refund`. `staff` and
`admin` SHALL receive it; `finance` SHALL not receive it; and a role without
the grant SHALL be refused when recording a refund. Reading refund records
remains available wherever the existing auction read grant allows it.

<!-- trace:scenario id=g10.shared-roles.SC-eny rev=1 -->
#### Scenario: shared-auth-roles-SC-14 - Staff and admin can record refunds
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **WHEN** the role matrix is read for `staff` and `admin`
- **THEN** both roles include `auction:refund`

<!-- trace:scenario id=g10.shared-roles.SC-xss rev=1 -->
#### Scenario: shared-auth-roles-SC-15 - Finance cannot record refunds
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **WHEN** finance attempts to record a refund
- **THEN** Grade10 refuses the mutation
- **AND** finance can still read a recorded refund

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
| `inventory` | `read`, `write` |
| `audit` | `read` |

Lending is the vault's financed lane, so its cases and money sit under
`vault`; there SHALL be no `finance` resource.

**Split by cost** - `vault` SHALL split its actions by what they can cost,
this way:

| Runs the flow | Sets what it costs | Moves money |
| --- | --- | --- |
| `operate` | `approve` - recording a valuation, offer terms, decline, forfeiture | `payout` - payout, repayment, reversal, the money book and the finance position |

`payout` SHALL be the only `vault` action that moves money.

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

### Requirement: Nobody approves an act they recorded

One person MAY hold both `staff` and `treasurer`. An act that approves
another act SHALL NOT be taken by the person who recorded that act, whatever
roles they hold, so a step that needs two people still needs two:

| Act | Refused to |
| --- | --- |
| Recording a vault payout | the person who made the offer it pays out |
| Reversing a vault money row | the person who recorded that row |
| Approving a grading waiver, payout, payout reversal, setting or fee-sheet row | the person who asked for it |

#### Scenario: shared-auth-roles-SC-22 - One person holding staff and treasurer cannot approve their own act
**Serves:** shared-auth-roles-US-03 - Case work and money are separate grants

- **GIVEN** a person holding `staff` and `treasurer`
- **WHEN** they make an offer on a vault case and then try to record its payout
- **THEN** the offer is made and the payout is refused
- **AND** a second person holding `vault:payout` may record that payout
