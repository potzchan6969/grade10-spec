## Feature set

- Finding a person
  - Name or email: search matches either without letter case, so the name on a ticket is enough to start
  - Narrowed directory: role, standing and verification each narrow the list, and combine
  - Chosen order: the caller asks for the order accounts come back in; newest first when it asks for none

## MODIFIED Requirements

### Requirement: Only operators who can list users see the directory

The system SHALL let a caller list and search accounts only when they hold
`user:list`. A caller without that grant SHALL be refused and SHALL receive
no account records. Search SHALL match on email or name, case-insensitive.
An operator SHALL be able to open an account by user id. Results SHALL name
each account by user id; email is an attribute. A banned account SHALL
remain in the directory.

A caller SHALL be able to narrow the directory by role, by standing, and by
whether the email is verified, and SHALL be able to ask for more than one at
once; an account SHALL be returned only when it satisfies every narrowing
asked for. A caller SHALL be able to ask for the order results come back in,
by when the account joined or by email, in either direction. Asked for no
order, the system SHALL return the newest account first.

#### Scenario: shared-auth-users-SC-01 - An operator with the grant lists accounts

- **GIVEN** a signed-in operator who holds `user:list`
- **WHEN** they open the users directory
- **THEN** they see accounts from this brand's identity system
- **AND** each account is named by user id

#### Scenario: shared-auth-users-SC-02 - A caller without the grant is refused

- **GIVEN** a signed-in person who does not hold `user:list`
- **WHEN** they try to list accounts
- **THEN** the system refuses the request
- **AND** returns no account records

#### Scenario: shared-auth-users-SC-03 - Search matches email without letter case

- **GIVEN** an operator who can list users
- **WHEN** they search the directory by an email fragment in a different
  letter case than the account
- **THEN** the results are accounts whose email contains that fragment

#### Scenario: shared-auth-users-SC-04 - An account opens by user id

- **GIVEN** an operator who can list users
- **WHEN** they open an account by its user id
- **THEN** they receive that account
- **AND** they do not receive a different account that shares an email
  attribute

#### Scenario: shared-auth-users-SC-05 - A banned account stays in the directory

- **GIVEN** a banned account
- **WHEN** an operator who can list users opens the directory
- **THEN** that account is still listed

#### Scenario: shared-auth-users-SC-19 - Search matches a name without letter case

- **GIVEN** an operator who can list users, and an account whose name is not
  part of its email
- **WHEN** they search the directory by part of that name in a different
  letter case
- **THEN** that account is among the results

#### Scenario: shared-auth-users-SC-20 - The directory narrows to a role

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to accounts that hold `admin`
- **THEN** every account returned holds `admin`
- **AND** an account that holds no operator role is not returned

#### Scenario: shared-auth-users-SC-21 - Two narrowings apply together

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to banned accounts that hold `support`
- **THEN** every account returned is banned and holds `support`
- **AND** a banned account that does not hold `support` is not returned

#### Scenario: shared-auth-users-SC-22 - The caller asks for an order

- **GIVEN** an operator who can list users
- **WHEN** they ask for the directory ordered by when the account joined,
  oldest first
- **THEN** the accounts come back in that order
- **AND** asking for no order returns the newest account first
