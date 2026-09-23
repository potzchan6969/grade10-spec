## Feature set

- Permission checks
  - Refund permission: separates refund processing from payment settlement

## ADDED Requirements

### Requirement: Refund permission follows the closed role vocabulary

The permission vocabulary SHALL include `auction:refund`. `staff` and
`admin` SHALL receive it; `finance` SHALL not receive it; and a role without
the grant SHALL be refused when recording a refund. Reading refund records
remains available wherever the existing auction read grant allows it.

#### Scenario: shared-auth-roles-SC-14 - Staff and admin can record refunds
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **WHEN** the role matrix is read for `staff` and `admin`
- **THEN** both roles include `auction:refund`

#### Scenario: shared-auth-roles-SC-15 - Finance cannot record refunds
**Serves:** shared-auth-roles-US-02 - Operator's grants follow the closed vocabulary

- **WHEN** finance attempts to record a refund
- **THEN** Grade10 refuses the mutation
- **AND** finance can still read a recorded refund
