## Feature set

- Directory
  - Grant-gated list: only `user:list` sees accounts; search matches email or name without letter case; open by user id
  - Narrowed list: elevated or user population, a named elevated role, status, and verification combine; caller chooses order (newest first when none)
  - Banned remain: a banned account stays in the directory
- Ban and unban
  - Stops money and sign-in: a ban ends sessions and refuses new sign-ins; unban restores sign-in
  - No ban of admin: no caller bans an account that holds `admin` (peers included); self-ban stays refused
  - Closes within 70 seconds: even a cached browse read stops answering signed in, not only a mutation or an elevated call
- Role changes
  - Set-role edits: clearing operator roles leaves a user; own account included
  - Peer strip refused: an operator cannot remove `admin` from another admin
  - Self-strip: an admin may remove their own `admin` when not last
  - Reflects within 70 seconds: even a cached browse read reflects the new roles, not only an elevated call
- Account create
  - Grant-gated create: only `user:create` creates; a non-`user` role also needs `user:set-role`
  - Passwordless Auth row: name, email, and roles from the closed set; no loyalty enroll, invite mail, or password
  - Duplicate email refused: never a second Auth row for an email that already exists

## MODIFIED Requirements

### Requirement: An operator who can ban can ban and unban

The system SHALL let a caller ban or unban an account only when they hold
`user:ban`. A ban SHALL last until an unban. After a ban, that person SHALL
NOT sign in, SHALL NOT be treated as signed in, and SHALL NOT complete a
money-moving action. That person SHALL NOT be treated as signed in on an
ordinary cached read either, not only on a mutation or an elevated call; this
SHALL hold for every read that starts 70 seconds or more after the ban. A
money-moving
action SHALL re-check identity so a ban cannot be ignored. The operator
SHALL be able to include a reason on a ban. A caller SHALL NOT ban their own
account. A caller SHALL NOT ban an account that holds `admin`, including
when the caller also holds `admin`. The last remaining `admin` SHALL NOT be
banned. A caller without the grant SHALL be refused, and the account SHALL
be unchanged. Banning an already-banned account SHALL leave it banned.

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

#### Scenario: shared-auth-users-SC-34 - A ban closes a cached read within 70 seconds
**Serves:** shared-auth-users-US-02 - Operator bans and unbans an account

- **GIVEN** a person who signed in and holds a signed cookie cache that has
  not yet expired
- **WHEN** an operator who can ban bans that account
- **THEN** an ordinary browse read that starts 70 seconds or more after the
  ban reports no person, even though the cookie cache would not have expired

### Requirement: An operator who can set roles can change them

The system SHALL let a caller change an account's roles only when they hold
`user:set-role`. The new roles SHALL be from the closed set in
`shared/auth/roles`. Clearing every operator role SHALL leave the account as
`user`. A caller MAY change their own roles the same way they change another
account's. A caller SHALL NOT remove `admin` from another account that holds
`admin`. Removing their own `admin` SHALL succeed only when at least one other
account still holds `admin`. The last remaining `admin` SHALL NOT have `admin`
removed, by self or by another caller. A caller without the grant SHALL be
refused, and the roles SHALL be unchanged. A role change SHALL be reflected
in an ordinary cached read as well as in a mutation or an elevated call, in
every read that starts 70 seconds or more after the change.

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

#### Scenario: shared-auth-users-SC-35 - A role change reaches a cached read within 70 seconds
**Serves:** shared-auth-users-US-03 - Operator changes roles

- **GIVEN** a signed-in account whose signed cookie cache has not yet
  expired
- **WHEN** an operator who can set roles changes that account's roles
- **THEN** an ordinary browse read that starts 70 seconds or more after the
  change reflects the new roles, even though the cookie cache would not have
  expired
