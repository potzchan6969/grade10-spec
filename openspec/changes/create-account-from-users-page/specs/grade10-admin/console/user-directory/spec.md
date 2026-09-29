## Purpose

The Grade10 admin page where an operator finds a person, creates a passwordless
Auth account for someone who has never signed in, and reads or changes their
access: which accounts the directory offers, how one account is addressed, the
grants it resolves for that account, and where it hands the operator on for
everything access is not.

## Feature set

- Create from Users
  - Create offered only with `user:create`
  - Success opens the new account's panel
  - Duplicate email opens the existing account
  - Review before create: every Create opens a confirmation of the trimmed draft; a note is added when the email is malformed or outside `9gag.com` and `memestrategy.com`, or when the role is `admin`

## ADDED Requirements

### Requirement: An operator creates an account from Users

Users offers Auth-only create for someone who has never signed in, gated on
the create grant.

**Who** - Users SHALL offer Create only when the signed-in session holds
`user:create`. A session without that grant SHALL NOT be offered Create.

**The move** - From Users:

1. The operator chooses Create.
2. They enter a name, an email, and roles from the closed set in a slim create
   dialog — no password field, no loyalty enroll, no opening points.
3. On success, that account's panel opens beside the list, the same as
   picking a row.
4. When the email is already taken, create is refused with a clear message and
   a way to open the existing account; choosing that way opens that account's
   panel. No second Auth row is created.
5. After Create, a confirmation always previews the trimmed name, email, and
   roles. Grade10 create expects `@9gag.com` or `@memestrategy.com` (exact host
   after the last `@`, without letter case). A malformed address or one outside
   those domains adds a note on that same confirmation. Confirming still
   creates. Going back returns to the create form and creates nothing. The
   server still accepts any email. A well-formed on-list email still shows the
   confirmation; confirming it then creates.
6. Creating `admin` adds a note on that same confirmation — that role cannot
   be removed once created; the role name is in bold. Confirming still creates.
   An email that also needs a check sits on the same confirmation. Name and
   email are trimmed before the confirmation and before create.

**Server** - Grade10 SHALL refuse create on the server when the session lacks
`user:create`, and SHALL refuse a non-`user` role when the session lacks
`user:set-role`, under the same rules as `shared/auth/users`.

#### Scenario: grade10-admin-console-user-directory-SC-20 - An operator creates an account and its panel opens
**Serves:** grade10-admin-console-user-directory-US-04 - Admin creates an account from Users

- **GIVEN** a signed-in operator who holds `user:list`, `user:create`, and `user:set-role`
- **AND** no Auth account holds the email
- **WHEN** they choose Create on Users, enter a name, that email, and role `admin`, and confirm
- **THEN** a confirmation is shown with the admin note
- **AND** confirming the review opens that account's panel beside the list
- **AND** the panel shows that name, email, and `admin`

#### Scenario: grade10-admin-console-user-directory-SC-21 - Create is not offered without user:create
**Serves:** grade10-admin-console-user-directory-US-04 - Admin creates an account from Users

- **GIVEN** a signed-in operator who holds `user:list` and `user:set-role` but not `user:create`
- **WHEN** they open Users
- **THEN** Create is not offered

#### Scenario: grade10-admin-console-user-directory-SC-22 - Duplicate email offers opening the existing account
**Serves:** grade10-admin-console-user-directory-US-04 - Admin creates an account from Users

- **GIVEN** a signed-in operator who holds `user:list` and `user:create`
- **AND** an Auth account already holds the email
- **WHEN** they choose Create, enter a name, that email, and role `user`, and confirm
- **THEN** create is refused with a clear message and a way to open the existing account
- **AND** choosing that way opens that account's panel
- **AND** no second Auth row holds that email

#### Scenario: grade10-admin-console-user-directory-SC-23 - Create with only user:create stands up a plain user
**Serves:** grade10-admin-console-user-directory-US-04 - Admin creates an account from Users

- **GIVEN** a signed-in operator who holds `user:list` and `user:create` but not `user:set-role`
- **AND** no Auth account holds the email
- **WHEN** they choose Create, enter a name, that email, and role `user`, and confirm
- **THEN** a confirmation is shown and no account is created yet
- **AND** confirming the review opens that account's panel beside the list
- **AND** the panel shows roles `user` only

#### Scenario: grade10-admin-console-user-directory-SC-24 - Users create review notes a malformed or off-list email
**Serves:** grade10-admin-console-user-directory-US-04 - Admin creates an account from Users

- **GIVEN** a signed-in operator who holds `user:create`
- **AND** Users create expects `@9gag.com` or `@memestrategy.com`
- **WHEN** they choose Create, enter a name and an email that is malformed or whose host is not those domains, and confirm
- **THEN** the confirmation shows the email note and no account is created
- **AND** confirming the review creates the account
- **AND** going back returns to the create form and creates nothing

#### Scenario: grade10-admin-console-user-directory-SC-25 - Users create review notes when the role is admin
**Serves:** grade10-admin-console-user-directory-US-04 - Admin creates an account from Users

- **GIVEN** a signed-in operator who holds `user:create`
- **WHEN** they choose Create, enter a name, an email that needs no email note, and role `admin`, and confirm
- **THEN** the confirmation is shown with the admin note and no account is created
- **AND** the note says `admin` cannot be removed once created, with that role in bold
- **AND** confirming the review creates the account
- **AND** an email that also needs a check sits on the same confirmation

## MODIFIED Requirements

### Requirement: Users is the console's access desk

The console SHALL offer a production page named Users, opened only by a
session holding `user:list`. It SHALL list the accounts that session may see,
offer the narrowing choices below, and open one account in a panel beside the
list without leaving the page.

The page SHALL offer a move on a row or in the panel only when the signed-in
session holds the grant that move needs: sessions and ending them with
`session:list` and `session:revoke`, ban and unban with `user:ban`, changing
roles with `user:set-role`, erasure with `user:delete`, and Create with
`user:create`. A move the session does not hold the grant for SHALL NOT be
offered. Changing roles SHALL be offered on the signed-in operator's own
account when they hold `user:set-role`, subject to the same refusals as
`shared/auth/users`.

#### Scenario: grade10-admin-console-user-directory-SC-01 - An operator opens an account beside the list
**Serves:** grade10-admin-console-user-directory-US-02 - Operator works one account from a single address

- **GIVEN** a signed-in operator who holds `user:list`
- **WHEN** they open Users and pick an account
- **THEN** that account opens in a panel beside the list
- **AND** the list they picked it from is still there

#### Scenario: grade10-admin-console-user-directory-SC-02 - A move the operator cannot make is not offered
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** a signed-in operator whose roles hold `user:list` and `user:ban` but not `user:set-role` or `user:delete`
- **WHEN** they open Users and an account
- **THEN** neither the row nor the panel offers changing roles or erasure
- **AND** both still offer ban or unban

#### Scenario: grade10-admin-console-user-directory-SC-15 - An operator may change their own roles
**Serves:** grade10-admin-console-user-directory-US-01 - Admin reviews who holds elevated grants

- **GIVEN** a signed-in operator who holds `user:set-role` and opens their own account
- **WHEN** they read the panel
- **THEN** the panel offers changing roles
