## Feature set

- One account, open beside the list
  - Account panel: identity, grants, standing and sessions in one place, so an account is read whole
  - Roles in the panel: the selection is changed where the account is read, under the roles dialog's contract
  - Confirmations stay dialogs: a move that cannot be undone is reported, never confirmed in the panel
- What an account can do
  - Grant rows: the grants the console resolved, elevated ones marked, each optionally addressable
  - Standing with its reason: a banned account shows why, when the console supplies it
  - Session detail: where a session was raised and when it ends, never what authenticates it
- Narrowing and order
  - Consumer-offered filters: the narrowing choices are the console's vocabulary, never the component's
  - Reported order: the table marks the columns that order the list and reports the choice; the console applies it
- Permitted moves only
  - Every move gated: sessions, ban and unban join roles and delete in appearing only with a handler

## MODIFIED Requirements

### Requirement: The user directory exports

The console package SHALL export, from its public entry, exactly these
components for the user directory surface: `UserTable`, `UserRolesDialog`,
`UserModerationDialog`, `UserSessionsDialog`, `UserAccountPanel`,
`UserDirectoryFilters` — and exactly these types: `UserTableProps`,
`UserTableCopy`, `UserRolesDialogProps`, `UserRolesDialogCopy`,
`UserModerationDialogProps`, `UserModerationDialogCopy`,
`UserModerationTone`, `UserSessionsDialogProps`, `UserSessionsDialogCopy`,
`UserAccountPanelProps`, `UserAccountPanelCopy`, `UserDirectoryFiltersProps`,
`UserDirectoryFiltersCopy`, `UserDirectoryRow`, `UserRoleOption`,
`UserSessionRow`, `UserFilterGroup`, `UserFilterOption`, `UserGrantRow`, and
`UserDirectoryOrder`.

#### Scenario: shared-console-user-directory-SC-01 - A console imports the directory

- **WHEN** an admin application imports any export named above from the console package's public entry
- **THEN** the import resolves without error

### Requirement: The table offers only the moves the console permits

`UserTable` SHALL offer a row's moves — opening the account, sessions, roles,
ban, unban, and delete — only when the consumer supplies a handler for that
move, so a console can withhold a move the operator's grants do not allow. A
row SHALL offer ban or unban according to whether the account is banned, and
never both.

#### Scenario: shared-console-user-directory-SC-05 - An operator without elevated grants opens the directory

- **WHEN** a console renders the table without a roles handler or a delete handler
- **THEN** neither action appears on any row
- **AND THEN** every move the console did supply a handler for still appears

#### Scenario: shared-console-user-directory-SC-06 - A banned account is shown

- **WHEN** the table renders an account that is banned
- **THEN** that row offers unban and does not offer ban
- **AND THEN** a row for an account that is not banned offers ban and does not offer unban

#### Scenario: shared-console-user-directory-SC-14 - A console withholds sessions and moderation

- **WHEN** a console renders the table without a sessions handler and without a moderation handler
- **THEN** no row offers sessions
- **AND THEN** no row offers ban or unban

#### Scenario: shared-console-user-directory-SC-15 - A row opens its account

- **GIVEN** a console that supplies a handler for opening an account
- **WHEN** an operator opens a row's account
- **THEN** the table reports that account's identifier
- **AND THEN** the table decides nothing about what is shown next

### Requirement: A session is named without its secret

Wherever this surface renders an account's sessions — `UserSessionsDialog` and
`UserAccountPanel` alike — each session SHALL be identified by an identifier
the consumer supplies, and the secret that authenticates a session SHALL NOT
be accepted or rendered. A revocation SHALL be reported by that same
identifier. When the account holds no sessions, ending every session SHALL NOT
be offered.

A session SHALL be able to carry, beside its identifier, when it began, when
it ends without a revocation, and where it was raised — each supplied by the
consumer already in words, each rendered when supplied and omitted when not.

#### Scenario: shared-console-user-directory-SC-07 - An operator reads where an account is signed in

- **WHEN** the dialog renders an account's sessions
- **THEN** each is named by its identifier
- **AND THEN** no authenticating secret is rendered

#### Scenario: shared-console-user-directory-SC-08 - An account holds no sessions

- **WHEN** the dialog renders an account with no sessions
- **THEN** it says so
- **AND THEN** the control that ends every session is unavailable

#### Scenario: shared-console-user-directory-SC-16 - A session says where it was raised

- **GIVEN** a session the consumer supplied with where it was raised and when it ends
- **WHEN** that session renders
- **THEN** both are shown as the consumer supplied them
- **AND THEN** a session supplied with neither shows its identifier alone

## ADDED Requirements

### Requirement: An account opens beside the directory

`UserAccountPanel` SHALL render one account in four sections, in this order:
who the account is, the grants it holds, its standing, and its sessions.
Whether the panel is open, which account it holds, and every value it renders
SHALL arrive as props; it SHALL NOT fetch, navigate, or decide which account
is open. It SHALL report closing through a callback, and SHALL omit a section
the consumer supplied nothing for.

The panel SHALL offer changing the account's roles, submitting the selection
under the same contract as `UserRolesDialog` — ordered as the options were
offered, and an empty selection as an empty list. It SHALL NOT confirm a move
that cannot be undone: ban, unban and delete are reported to the console,
which confirms them in `UserModerationDialog`.

#### Scenario: shared-console-user-directory-SC-17 - An operator reads one account whole

- **WHEN** a console renders the panel for an account
- **THEN** who the account is, the grants it holds, its standing, and its sessions each render from what the console supplied
- **AND THEN** a section the console supplied nothing for is not rendered

#### Scenario: shared-console-user-directory-SC-18 - Roles are saved from the panel

- **WHEN** an operator changes which roles are selected in the panel and saves
- **THEN** the submitted list holds the selected roles in the order the options were offered
- **AND THEN** an operator who selected none submits an empty list

#### Scenario: shared-console-user-directory-SC-19 - A ban started in the panel is confirmed outside it

- **WHEN** an operator starts a ban from the panel
- **THEN** the panel reports the move and collects no confirmation of its own
- **AND THEN** nothing is reported as confirmed until the moderation dialog reports it

### Requirement: The panel shows the grants an account holds

The panel SHALL render the grants an account holds from rows the consumer
supplies, each carrying the fields below. It SHALL NOT derive a grant from a
role, name a grant of its own, or decide which grant is elevated. A row marked
elevated SHALL be distinguishable from one that is not.

| Field | Meaning |
| --- | --- |
| Id | What the console's identity system calls the grant |
| Label | What the console shows for it |
| Elevated | Whether the console marks it elevated |
| Address | Optional; where the console sends an operator who opens it |

#### Scenario: shared-console-user-directory-SC-20 - The grants an account holds are shown

- **WHEN** the panel renders the grant rows a console supplied
- **THEN** each is shown with the label that console gave it
- **AND THEN** a row the console marked elevated is distinguishable from one it did not

#### Scenario: shared-console-user-directory-SC-21 - A grant with an address opens it

- **GIVEN** a grant row the console supplied with an address, and one it supplied without
- **WHEN** the panel renders both
- **THEN** activating the first uses the address the console supplied
- **AND THEN** the second is shown without being a link

#### Scenario: shared-console-user-directory-SC-22 - An account holds no grants

- **WHEN** the panel renders an account the console supplied no grant rows for
- **THEN** it says the account holds none
- **AND THEN** it names no grant of its own

### Requirement: The directory narrows by what the console offers

`UserDirectoryFilters` SHALL render the narrowing choices from groups the
consumer supplies — each group an id, a label, and its options; each option an
id and a label — and SHALL NOT name a role, a standing, or any other value of
its own. It SHALL report the selection through a callback, holding the groups
in the order they were offered, and SHALL report a group an operator cleared
as having nothing selected.

#### Scenario: shared-console-user-directory-SC-23 - A console offers its own narrowing choices

- **WHEN** a console renders the filters with the groups its identity system defines
- **THEN** each group is offered with the label and options that console supplied
- **AND THEN** no group and no option the console did not supply is offered

#### Scenario: shared-console-user-directory-SC-24 - An operator clears a choice

- **GIVEN** an operator who has narrowed the directory by one group
- **WHEN** they clear that group
- **THEN** the reported selection holds nothing for it
- **AND THEN** the other groups' selections are unchanged

### Requirement: The operator chooses the order and the console applies it

`UserTable` SHALL mark which of its columns order the directory, SHALL show
the column and direction the consumer supplied as the one in force, and SHALL
report an operator's change to it. It SHALL NOT reorder the rows it was given.

#### Scenario: shared-console-user-directory-SC-25 - An operator asks for a different order

- **GIVEN** a table showing the column and direction the console supplied
- **WHEN** an operator asks to order by another column that the table marks as ordering
- **THEN** the table reports that column and direction
- **AND THEN** the rows it renders are the rows it was given, in the order it was given them

### Requirement: An account's standing shows why it was set

Where `UserTable` and `UserAccountPanel` show an account's standing, they SHALL
render the reason the consumer supplied with it, and SHALL show the standing
alone when the consumer supplied none. Neither SHALL supply a reason of its
own.

#### Scenario: shared-console-user-directory-SC-26 - A banned account says why

- **GIVEN** one banned account the console supplied a reason for, and one it did not
- **WHEN** both render
- **THEN** the first shows the reason the console supplied
- **AND THEN** the second shows that it is banned and no reason
