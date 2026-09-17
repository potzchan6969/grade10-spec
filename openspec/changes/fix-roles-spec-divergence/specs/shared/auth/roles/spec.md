## Feature set

- Closed role set
  - Named roles: user, staff, support, treasurer, auditor, admin; unknown names are dropped
- Permission checks
  - Grants not names: a product checks permission, never the role string at the call site
  - Stacking: combined roles stack; an operator cannot widen what a role grants
- The vocabulary
  - Resources and actions: a closed list every product shares, so a permission nobody declared grants nothing
- What a role holds
  - Split by cost: whoever agrees what something costs is not whoever moves the money
  - Identity documents: reached by a grant of their own, never by running a flow

## MODIFIED Requirements

### Requirement: A person holds roles from a closed set

A signed-in person SHALL hold one or more of: `user`, `staff`, `support`,
`treasurer`, `auditor`, `admin`. A person with no operator role SHALL hold
`user` only. Unknown role names SHALL be ignored.

#### Scenario: shared-auth-roles-SC-01 - A collector is a user
**Serves:** shared-auth-roles-US-01 - Collector holds the user role only

- **GIVEN** a person who has never been granted an operator role
- **WHEN** a product reads who is calling
- **THEN** their roles are `user` only

#### Scenario: shared-auth-roles-SC-02 - An unknown role is dropped
**Serves:** shared-auth-roles-US-01 - Collector holds the user role only

- **GIVEN** a person whose roles include a name that is not in the closed set
- **WHEN** a product reads who is calling
- **THEN** that unknown name is not among the roles

### Requirement: Each role grants a fixed set of permissions

The mapping from role to permissions SHALL be:

| Role | Grants |
| --- | --- |
| `user` | none |
| `staff` | `store:read`, `store:write`, `loyalty:read`, `auction:read`, `auction:write`, `auction:operate`, `auction:shipment`, `vault:read`, `vault:operate`, `vault:approve`, `finance:read`, `finance:operate`, `finance:approve`, `kyc:read`, `appointment:read`, `appointment:manage`, `inventory:read`, `inventory:write` |
| `support` | `user:list`, `user:ban`, `session:list`, `session:revoke` |
| `treasurer` | `auction:read`, `auction:payment`, `vault:read`, `vault:payout`, `finance:read`, `finance:payout` |
| `auditor` | `audit:read` |
| `admin` | every permission in the vocabulary |

`staff` and `treasurer` SHALL be disjoint on every action that moves money.
`treasurer` SHALL NOT hold `kyc:read`: a person provisioned to type bank
references has no business in a customer's identity document.

A person who holds several operator roles SHALL receive the union of those
roles' grants, and `admin` holds every grant, so the disjointness above is what
provisioning keeps apart rather than something the vocabulary enforces.
Operators SHALL change who holds a role, and SHALL NOT change what a role
grants.

#### Scenario: shared-auth-roles-SC-07 - Staff can operate the store and auction catalog
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person with the `staff` role
- **WHEN** they take a store write or an auction operate action
- **THEN** the system allows it

#### Scenario: shared-auth-roles-SC-07a - Staff can write the auction catalogue
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person with the `staff` role
- **WHEN** they take an auction write action
- **THEN** the system allows it

#### Scenario: shared-auth-roles-SC-08 - Auditor reads the trail and nothing else
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person whose only operator role is `auditor`
- **WHEN** they read the audit trail
- **THEN** the system allows it
- **AND** a ban, a store write, or a role change is refused

#### Scenario: shared-auth-roles-SC-09 - Combined roles stack
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person holding `support` and `staff`
- **WHEN** they list users and write to the store
- **THEN** both actions are allowed

#### Scenario: shared-auth-roles-SC-10 - An operator cannot widen a role's grants
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they use the users directory
- **THEN** they can change who holds a role
- **AND** they cannot change what that role grants

#### Scenario: shared-auth-roles-SC-12 - Staff run a case and cannot pay against it
**Serves:** shared-auth-roles-US-03 - Case work and money sit in different hands

- **GIVEN** a person whose only operator role is `staff`
- **WHEN** they run a vault or lending case and then try to record a payout, a
  repayment, or an auction payment
- **THEN** the case actions are allowed and every money action is refused

#### Scenario: shared-auth-roles-SC-13 - A treasurer moves money and sees no identity document
**Serves:** shared-auth-roles-US-03 - Case work and money sit in different hands

- **GIVEN** a person whose only operator role is `treasurer`
- **WHEN** they read a vault case and record its payout
- **THEN** both are allowed
- **AND** the identity document behind that case, and running the case itself,
  are refused

## ADDED Requirements

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
| `loyalty` | `read`, `adjust`, `invite`, `catalog`, `finance` |
| `auction` | `read`, `write`, `operate`, `reserve`, `moderate`, `settle`, `payment`, `shipment` |
| `vault` | `read`, `operate`, `approve`, `payout` |
| `finance` | `read`, `operate`, `approve`, `payout` |
| `kyc` | `read` |
| `appointment` | `read`, `manage` |
| `inventory` | `read`, `write` |
| `audit` | `read` |

**Split by cost** - Where a product splits its actions by what one can cost,
`operate` SHALL run the flow, `approve` SHALL set what something costs, and
`payout` SHALL be the only action that moves money.

**Identity documents** - `kyc:read` SHALL be a resource of its own rather than
an action on the product that collected the document: an identity document and
the agreement printed from it outlive the case, they are the same evidence
whichever product holds them, and reading a case SHALL NOT be a reason to see
them.

**No `kyc:write`** - There SHALL be no `kyc:write` — recording a verification
stays with the flow that needs it.

#### Scenario: shared-auth-roles-SC-11 - Reading a case is not reading its identity document
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **GIVEN** a person holding `vault:read` and not `kyc:read`
- **WHEN** they open a vault case and ask for the identity document behind it
- **THEN** the case is shown and the document is refused
