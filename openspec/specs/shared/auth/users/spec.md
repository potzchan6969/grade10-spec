# shared/auth/users Specification

## Purpose
How an operator on either brand lists people in the identity directory, bans
and unbans them, and changes their roles. Listing and ending their sessions
is `shared/auth/sessions`. Recording those actions is `shared/auth/audit`.
Auction bidder bans belong to auction, not here.

## Feature set

- Directory
  - Grant-gated list: only `user:list` sees accounts; search matches email without letter case
  - Banned remain: a banned account stays in the directory
- Ban and unban
  - Stops money and sign-in: a ban ends sessions and refuses new ones; unban restores sign-in
  - Last admin protected: an operator cannot ban themselves or the last admin
- Role changes
  - Admin sets others: clearing operator roles leaves a user; an operator cannot change their own

## Requirements

### Requirement: Only operators who can list users see the directory

The system SHALL let a caller list and search accounts only when they hold
`user:list`. A caller without that grant SHALL be refused and SHALL receive
no account records. Search SHALL match on email, case-insensitive. An
operator SHALL be able to open an account by user id. Results SHALL name
each account by user id; email is an attribute. A banned account SHALL
remain in the directory.

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

### Requirement: An operator who can ban can ban and unban

The system SHALL let a caller ban or unban an account only when they hold
`user:ban`. A ban SHALL last until an unban. After a ban, that person SHALL
NOT sign in, SHALL NOT be treated as signed in, and SHALL NOT complete a
money-moving action. A money-moving action SHALL re-check identity so a ban
cannot be ignored. The operator SHALL be able to include a reason on a ban.
A caller SHALL NOT ban their own account. A caller who does not hold
`admin` SHALL NOT ban an account that holds `admin`. The last remaining
`admin` SHALL NOT be banned. A caller without the grant SHALL be refused,
and the account SHALL be unchanged. Banning an already-banned account SHALL
leave it banned.

#### Scenario: shared-auth-users-SC-06 - A ban stops money-moving

- **GIVEN** an operator who holds `user:ban`
- **WHEN** they ban an account
- **THEN** that person cannot complete a money-moving action

#### Scenario: shared-auth-users-SC-07 - A banned person cannot sign in

- **GIVEN** a banned account
- **WHEN** that person completes a sign-in method
- **THEN** they are not signed in

#### Scenario: shared-auth-users-SC-08 - A banned person is not signed in

- **GIVEN** a person who signed in and is then banned
- **WHEN** a product reads who is calling
- **THEN** it reports no person

#### Scenario: shared-auth-users-SC-09 - An unban lets them sign in again

- **GIVEN** a banned account
- **WHEN** an operator who can ban unbans it
- **THEN** that person can sign in again

#### Scenario: shared-auth-users-SC-10 - A caller who cannot ban is refused

- **GIVEN** a signed-in operator who does not hold `user:ban`
- **WHEN** they try to ban an account
- **THEN** the system refuses the request
- **AND** the account remains unbanned

#### Scenario: shared-auth-users-SC-11 - An operator cannot ban themselves

- **GIVEN** an operator who holds `user:ban`
- **WHEN** they try to ban their own account
- **THEN** the system refuses the request
- **AND** their account remains unbanned

#### Scenario: shared-auth-users-SC-12 - Support cannot ban an admin

- **GIVEN** a person whose operator role is `support`
- **WHEN** they try to ban an account that holds `admin`
- **THEN** the system refuses the request
- **AND** the account remains unbanned

#### Scenario: shared-auth-users-SC-13 - The last admin cannot be banned

- **GIVEN** the only account that holds `admin`
- **WHEN** an operator who can ban tries to ban it
- **THEN** the system refuses the request
- **AND** the account remains unbanned

### Requirement: An operator who can set roles can change them

The system SHALL let a caller change an account's roles only when they hold
`user:set-role`. The new roles SHALL be from the closed set in
`shared/auth/roles`. Clearing every operator role SHALL leave the account as
`user`. A caller SHALL NOT change their own roles. The last remaining
`admin` SHALL NOT have `admin` removed. A caller without the grant SHALL be
refused, and the roles SHALL be unchanged.

#### Scenario: shared-auth-users-SC-14 - Admin changes another person's roles

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they set another account to `staff`
- **THEN** that account's roles include `staff`

#### Scenario: shared-auth-users-SC-15 - Clearing operator roles leaves a user

- **GIVEN** an operator who can set roles
- **WHEN** they save another account with no operator role selected
- **THEN** that account's roles are `user` only

#### Scenario: shared-auth-users-SC-16 - Support cannot set roles

- **GIVEN** an operator who holds `user:ban` but not `user:set-role`
- **WHEN** they try to change another account's roles
- **THEN** the system refuses the request
- **AND** the roles are unchanged

#### Scenario: shared-auth-users-SC-17 - An operator cannot change their own roles

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they try to change their own roles
- **THEN** the system refuses the request
- **AND** their roles are unchanged

#### Scenario: shared-auth-users-SC-18 - The last admin keeps admin

- **GIVEN** the only account that holds `admin`
- **WHEN** an operator who can set roles saves it without `admin`
- **THEN** that account still holds `admin`
