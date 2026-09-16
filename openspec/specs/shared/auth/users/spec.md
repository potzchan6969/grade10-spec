# shared/auth/users Specification

## Purpose
How an operator on either brand lists people in the identity directory, bans
and unbans them, and changes their roles. Listing and ending their sessions
is `shared/auth/sessions`. Recording those actions is `shared/auth/audit`.
Auction bidder bans belong to auction, not here.

## Feature set

- Directory
  - Grant-gated list: only `user:list` sees accounts; search matches email or name without letter case; open by user id
  - Narrowed list: elevated or user population, a named elevated role, status, and verification combine; caller chooses order (newest first when none)
  - Banned remain: a banned account stays in the directory
- Ban and unban
  - Stops money and sign-in: a ban ends sessions and refuses new ones; unban restores sign-in
  - No ban of admin: no caller bans an account that holds `admin` (peers included); self-ban stays refused
- Role changes
  - Set-role edits: clearing operator roles leaves a user; own account included
  - Peer strip refused: an operator cannot remove `admin` from another admin
  - Self-strip: an admin may remove their own `admin` when not last

## Requirements

### Requirement: Only operators who can list users see the directory

The system SHALL let a caller list and search accounts only when they hold
`user:list`. A caller without that grant SHALL be refused and SHALL receive
no account records. Search SHALL match on email or name, case-insensitive.
An operator SHALL be able to open an account by user id. Results SHALL name
each account by user id; email is an attribute. A banned account SHALL
remain in the directory.

A caller SHALL be able to narrow the directory by role population or by a
named elevated role, by status, and by whether the email is verified, and
SHALL be able to ask for more than one at once; an account SHALL be returned
only when it satisfies every narrowing asked for. Role population is the
elevated set (any closed elevated role) or the user set (no elevated role).
A caller SHALL be able to ask for the order results come back in, by when the
account joined or by email, in either direction. Asked for no order, the
system SHALL return the newest account first.

#### Scenario: shared-auth-users-SC-01 - An operator with the grant lists accounts
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** a signed-in operator who holds `user:list`
- **WHEN** they open the users directory
- **THEN** they see accounts from this brand's identity system
- **AND** each account is named by user id

#### Scenario: shared-auth-users-SC-02 - A caller without the grant is refused
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** a signed-in person who does not hold `user:list`
- **WHEN** they try to list accounts
- **THEN** the system refuses the request
- **AND** returns no account records

#### Scenario: shared-auth-users-SC-03 - Search matches email without letter case
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** an operator who can list users
- **WHEN** they search the directory by an email fragment in a different
  letter case than the account
- **THEN** the results are accounts whose email contains that fragment

#### Scenario: shared-auth-users-SC-04 - An account opens by user id
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** an operator who can list users
- **WHEN** they open an account by its user id
- **THEN** they receive that account
- **AND** they do not receive a different account that shares an email
  attribute

#### Scenario: shared-auth-users-SC-05 - A banned account stays in the directory
**Serves:** shared-auth-users-US-01 - Operator lists people in the identity directory

- **GIVEN** a banned account
- **WHEN** an operator who can list users opens the directory
- **THEN** that account is still listed

#### Scenario: shared-auth-users-SC-19 - Search matches a name without letter case
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users, and an account whose name is not
  part of its email
- **WHEN** they search the directory by part of that name in a different
  letter case
- **THEN** that account is among the results

#### Scenario: shared-auth-users-SC-20 - The directory narrows to a role
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to accounts that hold `admin`
- **THEN** every account returned holds `admin`
- **AND** an account that holds no elevated role is not returned

#### Scenario: shared-auth-users-SC-21 - Two narrowings apply together
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to banned accounts that hold `support`
- **THEN** every account returned is banned and holds `support`
- **AND** a banned account that does not hold `support` is not returned

#### Scenario: shared-auth-users-SC-22 - The caller asks for an order
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they ask for the directory ordered by when the account joined,
  oldest first
- **THEN** the accounts come back in that order
- **AND** asking for no order returns the newest account first

#### Scenario: shared-auth-users-SC-23 - The directory narrows to elevated accounts
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to elevated accounts
- **THEN** every account returned holds at least one elevated role
- **AND** an account that holds none is not returned

#### Scenario: shared-auth-users-SC-24 - The directory narrows to users without elevated roles
**Serves:** shared-auth-users-US-04 - Operator finds the accounts they mean

- **GIVEN** an operator who can list users
- **WHEN** they narrow the directory to users
- **THEN** every account returned holds no elevated role
- **AND** an account that holds an elevated role is not returned

### Requirement: An operator who can ban can ban and unban

The system SHALL let a caller ban or unban an account only when they hold
`user:ban`. A ban SHALL last until an unban. After a ban, that person SHALL
NOT sign in, SHALL NOT be treated as signed in, and SHALL NOT complete a
money-moving action. A money-moving action SHALL re-check identity so a ban
cannot be ignored. The operator SHALL be able to include a reason on a ban.
A caller SHALL NOT ban their own account. A caller SHALL NOT ban an account
that holds `admin`, including when the caller also holds `admin`. The last
remaining `admin` SHALL NOT be banned. A caller without the grant SHALL be
refused, and the account SHALL be unchanged. Banning an already-banned
account SHALL leave it banned.

#### Scenario: shared-auth-users-SC-06 - A ban stops money-moving
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** an operator who holds `user:ban`
- **WHEN** they ban an account
- **THEN** that person cannot complete a money-moving action

#### Scenario: shared-auth-users-SC-07 - A banned person cannot sign in
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a banned account
- **WHEN** that person completes a sign-in method
- **THEN** they are not signed in

#### Scenario: shared-auth-users-SC-08 - A banned person is not signed in
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a person who signed in and is then banned
- **WHEN** a product reads who is calling
- **THEN** it reports no person

#### Scenario: shared-auth-users-SC-09 - An unban lets them sign in again
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a banned account
- **WHEN** an operator who can ban unbans it
- **THEN** that person can sign in again

#### Scenario: shared-auth-users-SC-10 - A caller who cannot ban is refused
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a signed-in operator who does not hold `user:ban`
- **WHEN** they try to ban an account
- **THEN** the system refuses the request
- **AND** the account remains unbanned

#### Scenario: shared-auth-users-SC-11 - An operator cannot ban themselves
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** an operator who holds `user:ban`
- **WHEN** they try to ban their own account
- **THEN** the system refuses the request
- **AND** their account remains unbanned

#### Scenario: shared-auth-users-SC-12 - Support cannot ban an admin
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a person whose operator role is `support`
- **WHEN** they try to ban an account that holds `admin`
- **THEN** the system refuses the request
- **AND** the account remains unbanned

#### Scenario: shared-auth-users-SC-13 - The last admin cannot be banned
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** the only account that holds `admin`
- **WHEN** an operator who can ban tries to ban it
- **THEN** the system refuses the request
- **AND** the account remains unbanned

#### Scenario: shared-auth-users-SC-25 - An admin cannot ban another admin
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** an operator who holds `admin` and `user:ban`
- **AND** another account that holds `admin`
- **WHEN** they try to ban that account
- **THEN** the system refuses the request
- **AND** the account remains unbanned

### Requirement: An operator who can set roles can change them

The system SHALL let a caller change an account's roles only when they hold
`user:set-role`. The new roles SHALL be from the closed set in
`shared/auth/roles`. Clearing every operator role SHALL leave the account as
`user`. A caller MAY change their own roles the same way they change another
account's. A caller SHALL NOT remove `admin` from another account that holds
`admin`. Removing their own `admin` SHALL succeed only when at least one other
account still holds `admin`. The last remaining `admin` SHALL NOT have `admin`
removed, by self or by another caller. A caller without the grant SHALL be
refused, and the roles SHALL be unchanged.

#### Scenario: shared-auth-users-SC-14 - Admin changes another person's roles
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who holds `user:set-role`
- **WHEN** they set another account to `staff`
- **THEN** that account's roles include `staff`

#### Scenario: shared-auth-users-SC-15 - Clearing operator roles leaves a user
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who can set roles
- **WHEN** they save another account with no operator role selected
- **THEN** that account's roles are `user` only

#### Scenario: shared-auth-users-SC-16 - Support cannot set roles
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who holds `user:ban` but not `user:set-role`
- **WHEN** they try to change another account's roles
- **THEN** the system refuses the request
- **AND** the roles are unchanged

#### Scenario: shared-auth-users-SC-17 - An operator may change their own roles
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** an operator who holds `user:set-role` and `admin`
- **WHEN** they save their own account with `staff` and still with `admin`
- **THEN** their account's roles include `staff` and `admin`

#### Scenario: shared-auth-users-SC-18 - The last admin keeps admin
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** the only account that holds `admin`
- **WHEN** that admin or another operator who can set roles saves it without `admin`
- **THEN** that account still holds `admin`

#### Scenario: shared-auth-users-SC-26 - An admin cannot remove admin from another admin
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** two or more accounts that hold `admin`
- **AND** an operator who holds `user:set-role`
- **WHEN** they save another admin without `admin`
- **THEN** the system refuses the request
- **AND** that account still holds `admin`

#### Scenario: shared-auth-users-SC-27 - An admin may strip their own admin
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** two or more accounts that hold `admin`
- **AND** an operator who holds `admin` and `user:set-role`
- **WHEN** they save their own account without `admin`
- **THEN** their account no longer holds `admin`
