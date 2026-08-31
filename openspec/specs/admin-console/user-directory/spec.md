# admin-console/user-directory Specification

## Purpose
The operator's view of the identity directory: the table of accounts, and the
three confirmations an operator passes through to change one — its roles, its
standing, and where it is signed in. Both brands' consoles render this
surface, so it is shared — from the console package, where admin UI lives.
What an operator is *allowed* to do is `shared-auth/users` and
`shared-auth/sessions`; this capability governs only what the components
render and the contract they expose. It carries the requirements of
`shared-ui/auth-user-directory` forward unchanged in behavior; only the home
moved.
## Requirements
### Requirement: The user directory exports

The console package SHALL export, from its public entry, exactly these
components for the user directory surface: `UserTable`, `UserRolesDialog`,
`UserModerationDialog`, `UserSessionsDialog` — and exactly these types:
`UserTableProps`, `UserTableCopy`, `UserRolesDialogProps`,
`UserRolesDialogCopy`, `UserModerationDialogProps`, `UserModerationDialogCopy`,
`UserModerationTone`, `UserSessionsDialogProps`, `UserSessionsDialogCopy`,
`UserDirectoryRow`, `UserRoleOption`, and `UserSessionRow`.

#### Scenario: user-directory-SC-01 - A console imports the directory

- **WHEN** an admin application imports any export named above from the console package's public entry
- **THEN** the import resolves without error

### Requirement: The directory carries no identity vocabulary of its own

These components SHALL receive the role vocabulary, each account's roles, and
every displayed date as props already resolved by the consumer. They SHALL NOT
name a role, parse a stored role value, or format a date. A role list submitted
by the roles dialog SHALL be ordered as the options were offered rather than as
they were selected, and an empty selection SHALL be submitted as an empty list,
leaving any default-role decision to the consumer.

#### Scenario: user-directory-SC-02 - A console offers its own role vocabulary

- **WHEN** a console renders the roles dialog with the roles its identity system defines
- **THEN** each role is offered with the label and permission summary the console supplied
- **AND THEN** no role the console did not supply is offered

#### Scenario: user-directory-SC-03 - A selection is submitted

- **WHEN** an operator changes which roles are selected and saves
- **THEN** the submitted list holds the selected roles in the order the options were offered
- **AND THEN** an operator who selected none submits an empty list

#### Scenario: user-directory-SC-04 - An account joined on a given day

- **WHEN** the table renders an account
- **THEN** it shows the joined date exactly as the consumer supplied it
- **AND THEN** two consoles supplying different formats each render their own

### Requirement: The table offers only the moves the console permits

`UserTable` SHALL offer the sessions action on every row. It SHALL offer the
roles action and the delete action only when the consumer supplies a handler
for each, so a console can withhold a move the operator's grants do not allow.
A row SHALL offer ban or unban according to whether the account is banned, and
never both.

#### Scenario: user-directory-SC-05 - An operator without elevated grants opens the directory

- **WHEN** a console renders the table without a roles handler or a delete handler
- **THEN** neither action appears on any row
- **AND THEN** the sessions action still appears on every row

#### Scenario: user-directory-SC-06 - A banned account is shown

- **WHEN** the table renders an account that is banned
- **THEN** that row offers unban and does not offer ban
- **AND THEN** a row for an account that is not banned offers ban and does not offer unban

### Requirement: A session is named without its secret

`UserSessionsDialog` SHALL identify each session by an identifier the consumer
supplies and SHALL NOT accept or render the secret that authenticates a
session. It SHALL report a revocation by that same identifier. When the account
holds no sessions, ending every session SHALL NOT be offered.

#### Scenario: user-directory-SC-07 - An operator reads where an account is signed in

- **WHEN** the dialog renders an account's sessions
- **THEN** each is named by its identifier
- **AND THEN** no authenticating secret is rendered

#### Scenario: user-directory-SC-08 - An account holds no sessions

- **WHEN** the dialog renders an account with no sessions
- **THEN** it says so
- **AND THEN** the control that ends every session is unavailable

### Requirement: One confirmation serves every moderation move

`UserModerationDialog` SHALL render one confirmation whose words, tone, and
whether it collects a reason are supplied by the consumer, and SHALL report the
confirmation with the reason collected — or with an empty reason where none was
collected — so a consumer reads one signature whichever move it asked for.

#### Scenario: user-directory-SC-09 - A move that collects a reason is confirmed

- **WHEN** an operator confirms a move the consumer said collects a reason
- **THEN** the dialog reports the reason that was typed

#### Scenario: user-directory-SC-10 - A move that collects no reason is confirmed

- **WHEN** an operator confirms a move the consumer said collects no reason
- **THEN** no reason field is rendered
- **AND THEN** the dialog reports an empty reason

