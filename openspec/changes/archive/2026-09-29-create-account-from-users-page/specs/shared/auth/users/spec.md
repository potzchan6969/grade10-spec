## Purpose

How an operator on either brand lists people in the identity directory, creates
a passwordless Auth account for someone who has never signed in, bans and
unbans them, and changes their roles. Listing and ending their sessions is
`shared/auth/sessions`. Recording those actions is `shared/auth/audit`.
Auction bidder bans belong to auction, not here.

## Feature set

- Account create
  - Grant-gated create: only `user:create` creates; a non-`user` role also needs `user:set-role`
  - Passwordless Auth row: name, email, and roles from the closed set; no loyalty enroll, invite mail, or password
  - Duplicate email refused: never a second Auth row for an email that already exists

## ADDED Requirements

### Requirement: An operator who can create may create a passwordless Auth account

An operator holding the create grant stands up an Auth account before the
person signs in.

**Who** - The system SHALL let a caller create an Auth account only when they
hold `user:create`. A caller without that grant SHALL be refused, and no
account SHALL be created.

**What** - Create SHALL accept a name, an email, and roles from the closed set
in `shared/auth/roles`. Name and email SHALL be required. Create SHALL NOT
accept a password. Create SHALL NOT enroll the account in loyalty, SHALL NOT
set opening points, and SHALL NOT send an invite or magic-link email.

**Roles** - Creating with only `user` SHALL require `user:create` alone.
Creating with any non-`user` role SHALL also require `user:set-role`; without
it the system SHALL refuse and create no account. An empty role selection
SHALL leave the account as `user` only.

**Duplicate email** - When an Auth account already holds that email, the
system SHALL refuse create and SHALL NOT create a second Auth row.

#### Scenario: shared-auth-users-SC-28 - An operator creates a passwordless Auth account
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create` and `user:set-role`
- **AND** no Auth account holds the email
- **WHEN** they create an account with a name, that email, and role `admin`
- **THEN** one Auth account exists for that email with that name and `admin`
- **AND** create collected no password
- **AND** the account is not enrolled in loyalty from create
- **AND** no invite or magic-link email is sent from create

#### Scenario: shared-auth-users-SC-29 - Create as plain user needs only user:create
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create` but not `user:set-role`
- **AND** no Auth account holds the email
- **WHEN** they create an account with a name, that email, and role `user`
- **THEN** one Auth account exists for that email with roles `user` only

#### Scenario: shared-auth-users-SC-30 - Create without user:create is refused
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:set-role` but not `user:create`
- **WHEN** they try to create an account with a name, an unused email, and role `user`
- **THEN** the system refuses the request
- **AND** no Auth account holds that email

#### Scenario: shared-auth-users-SC-31 - Elevated create without user:set-role is refused
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create` but not `user:set-role`
- **WHEN** they try to create an account with a name, an unused email, and role `admin`
- **THEN** the system refuses the request
- **AND** no Auth account holds that email

#### Scenario: shared-auth-users-SC-32 - Duplicate email is refused
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create`
- **AND** an Auth account already holds the email
- **WHEN** they try to create an account with a name, that email, and role `user`
- **THEN** the system refuses the request
- **AND** exactly one Auth account holds that email

#### Scenario: shared-auth-users-SC-33 - Empty roles at create leave a user
**Serves:** shared-auth-users-US-05 - Operator creates an Auth account before first sign-in

- **GIVEN** an operator who holds `user:create`
- **AND** no Auth account holds the email
- **WHEN** they create an account with a name, that email, and no role selected
- **THEN** one Auth account exists for that email with roles `user` only
