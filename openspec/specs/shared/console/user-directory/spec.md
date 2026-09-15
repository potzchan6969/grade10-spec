# shared/console/user-directory Specification

## Purpose
The operator's view of the identity directory: the table of accounts, the
filters the console offers, an account panel beside the list, and the dialogs
that confirm irreversible moves. Both brands' consoles render this surface
from the console package, where admin UI lives. What an operator is *allowed*
to do is `shared/auth/users` and `shared/auth/sessions`; this capability
governs only what the components render and the contract they expose. It
carries the requirements of `shared-ui/auth-user-directory` forward; only the
home moved.

## Feature set

- The directory contract
  - Console-package exports: the directory components and their types ship from the console package's public entry
- One account, open beside the list
  - Account panel: identity and actions, roles and grants, and timeline with sessions — each area only when the console supplies it
  - Roles in the panel: the selection is changed where the account is read, under the roles dialog's contract
  - Confirmations stay dialogs: a move that cannot be undone is reported, never confirmed in the panel
- What an account can do
  - Grant rows: the grants the console resolved, elevated ones marked once for the account
  - Actions together: hand-offs and standing moves the console offered, hand-offs before ban, unban, or erase
  - Standing with its reason: a banned account shows why in the panel when the console supplies it; the table Status cell stays one line
  - Timeline: when the account joined, and that it is banned when it is, without inventing a time the console did not supply
  - Session detail: where a session was raised and when it ends, never what authenticates it
- Narrowing and order
  - Fixed filter shape: Type, Roles, Status and Email — labels and option words from the consumer; no role vocabulary inside the component
  - Exclusive Type: Elevated or Users; Roles is choosable only for Elevated
  - Any on Status and Email: choosing Any reports that narrowing as cleared
  - Reported order: the table marks the columns that order the list and reports the choice; the console applies it
- Permitted moves only
  - Every move gated: sessions, ban and unban join roles and delete in appearing only with a handler
- Role names
  - Plain in the list: the table's Roles cell is never a link
  - Linked on the account: a role name on identity may open the address the console supplied for that role
- Consumer-owned vocabulary
  - Roles as props: the role vocabulary, each account's roles, filter options, grant rows, and every date arrive already resolved by the console
  - Ordered submission: a submitted role list keeps the offered order, and an empty selection submits as an empty list
- Confirmations and sessions
  - One moderation signature: one confirmation serves every irreversible move, reason collected or empty
  - No secrets: a session is named by a consumer-supplied identifier, never by what authenticates it

## Requirements
### Requirement: The user directory exports

The console package SHALL export, from its public entry, exactly these
components for the user directory surface: `UserTable`, `UserRolesDialog`,
`UserModerationDialog`, `UserSessionsDialog`, `UserAccountPanel`,
`UserDirectoryFilters` — and exactly these types: `UserTableProps`,
`UserTableCopy`, `UserRolesDialogProps`, `UserRolesDialogCopy`,
`UserModerationDialogProps`, `UserModerationDialogCopy`,
`UserModerationTone`, `UserSessionsDialogProps`, `UserSessionsDialogCopy`,
`UserAccountPanelProps`, `UserAccountPanelCopy`, `UserAccountRelatedLink`,
`UserAccountTimeline`, `UserTimelineEvent`, `UserDirectoryFiltersProps`,
`UserDirectoryFiltersCopy`, `UserDirectoryRow`, `UserRoleOption`,
`UserSessionRow`, `UserFilterGroup`, `UserFilterOption`, `UserGrantRow`, and
`UserDirectoryOrder`.

#### Scenario: shared-console-user-directory-SC-01 - A console imports the directory

- **WHEN** an admin application imports any export named above from the console package's public entry
- **THEN** the import resolves without error

### Requirement: The directory carries no identity vocabulary of its own

These components SHALL receive the role vocabulary, each account's roles, and
every displayed date as props already resolved by the consumer. They SHALL NOT
name a role, parse a stored role value, or format a date. A role list submitted
by the roles dialog SHALL be ordered as the options were offered rather than as
they were selected, and an empty selection SHALL be submitted as an empty list,
leaving any default-role decision to the consumer.

#### Scenario: shared-console-user-directory-SC-02 - A console offers its own role vocabulary
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** a console renders the roles dialog with the roles its identity system defines
- **THEN** each role is offered with the label and permission summary the console supplied
- **AND THEN** no role the console did not supply is offered

#### Scenario: shared-console-user-directory-SC-03 - A selection is submitted
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** an operator changes which roles are selected and saves
- **THEN** the submitted list holds the selected roles in the order the options were offered
- **AND THEN** an operator who selected none submits an empty list

#### Scenario: shared-console-user-directory-SC-04 - An account joined on a given day

- **WHEN** the table renders an account
- **THEN** it shows the joined date exactly as the consumer supplied it
- **AND THEN** two consoles supplying different formats each render their own

### Requirement: The table offers only the moves the console permits

`UserTable` SHALL offer a row's moves — opening the account, sessions, roles,
ban, unban, and delete — only when the consumer supplies a handler for that
move, so a console can withhold a move the operator's grants do not allow. A
row SHALL offer ban or unban according to whether the account is banned, and
never both.

#### Scenario: shared-console-user-directory-SC-05 - An operator without elevated grants opens the directory
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** a console renders the table without a roles handler or a delete handler
- **THEN** neither action appears on any row
- **AND THEN** every move the console did supply a handler for still appears

#### Scenario: shared-console-user-directory-SC-06 - A banned account is shown
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** the table renders an account that is banned
- **THEN** that row offers unban and does not offer ban
- **AND THEN** a row for an account that is not banned offers ban and does not offer unban

#### Scenario: shared-console-user-directory-SC-14 - A console withholds sessions and moderation
**Serves:** shared-console-user-directory-US-05 - Operator changes an account's access from the panel

- **WHEN** a console renders the table without a sessions handler and without a moderation handler
- **THEN** no row offers sessions
- **AND THEN** no row offers ban or unban

#### Scenario: shared-console-user-directory-SC-15 - A row opens its account
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

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
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **WHEN** the dialog renders an account's sessions
- **THEN** each is named by its identifier
- **AND THEN** no authenticating secret is rendered

#### Scenario: shared-console-user-directory-SC-08 - An account holds no sessions
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **WHEN** the dialog renders an account with no sessions
- **THEN** it says so
- **AND THEN** the control that ends every session is unavailable

#### Scenario: shared-console-user-directory-SC-16 - A session says where it was raised
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** a session the consumer supplied with where it was raised and when it ends
- **WHEN** that session renders
- **THEN** both are shown as the consumer supplied them
- **AND THEN** a session supplied with neither shows its identifier alone

### Requirement: One confirmation serves every moderation move

`UserModerationDialog` SHALL render one confirmation whose words, tone, and
whether it collects a reason are supplied by the consumer, and SHALL report the
confirmation with the reason collected — or with an empty reason where none was
collected — so a consumer reads one signature whichever move it asked for.

#### Scenario: shared-console-user-directory-SC-09 - A move that collects a reason is confirmed
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** an operator confirms a move the consumer said collects a reason
- **THEN** the dialog reports the reason that was typed

#### Scenario: shared-console-user-directory-SC-10 - A move that collects no reason is confirmed
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** an operator confirms a move the consumer said collects no reason
- **THEN** no reason field is rendered
- **AND THEN** the dialog reports an empty reason


### Requirement: A role chip may link to that role's grants page

When the console supplies a per-role address, `UserAccountPanel` SHALL render
each matching role name on the account's identity as a link to that address.
`UserTable` SHALL show role names without links, so opening a row always opens
the account and never navigates away. When the console supplies no per-role
address, identity role names SHALL render without links.

#### Scenario: shared-console-user-directory-SC-11 - A role name on the account opens its address
**Serves:** shared-console-user-directory-US-03 - Operator opens a role from the account

- **GIVEN** a console that supplies an address for `staff` on an account that holds it
- **WHEN** the operator activates the `staff` name on the account's identity
- **THEN** navigation uses the address supplied for `staff`

#### Scenario: shared-console-user-directory-SC-12 - The directory's Roles cell is never a link
**Serves:** shared-console-user-directory-US-03 - Operator opens a role from the account

- **GIVEN** a console that supplies per-role addresses
- **WHEN** the table renders a row that holds those roles
- **THEN** each role name is shown
- **AND THEN** none of those names is a link

#### Scenario: shared-console-user-directory-SC-13 - Roles without addresses stay plain
**Serves:** shared-console-user-directory-US-03 - Operator opens a role from the account

- **GIVEN** a console that supplies no per-role addresses
- **WHEN** the panel renders identity roles
- **THEN** each role name is shown
- **AND** none of those names is a link

### Requirement: An account opens beside the directory

`UserAccountPanel` SHALL render one account under these areas, each only when
the console supplies it: who the account is and the actions offered for it;
the roles and grants it holds; the account's timeline milestones and its
sessions. Whether the panel is open, which account it holds, and every value
it renders SHALL arrive as props; it SHALL NOT fetch, navigate, or decide
which account is open. It SHALL report closing through a callback.

Actions SHALL gather the hand-offs and standing moves the console offered —
audit, loyalty, and the like before ban, unban, or erase — and SHALL NOT
confirm a move that cannot be undone: ban, unban and delete are reported to
the console, which confirms them in `UserModerationDialog`.

The panel SHALL offer changing the account's roles, submitting the selection
under the same contract as `UserRolesDialog` — ordered as the options were
offered, and an empty selection as an empty list. When the console marks the
account's roles as blocked, the panel SHALL show that mark and SHALL NOT
offer changing roles.

#### Scenario: shared-console-user-directory-SC-17 - An operator reads one account whole
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** a console renders the panel for an account
- **THEN** who the account is, its actions, the grants it holds, its timeline, and its sessions each render from what the console supplied
- **AND THEN** an area the console supplied nothing for is not rendered

#### Scenario: shared-console-user-directory-SC-18 - Roles are saved from the panel
**Serves:** shared-console-user-directory-US-05 - Operator changes an account's access from the panel

- **WHEN** an operator changes which roles are selected in the panel and saves
- **THEN** the submitted list holds the selected roles in the order the options were offered
- **AND THEN** an operator who selected none submits an empty list

#### Scenario: shared-console-user-directory-SC-29 - Roles stay blocked when the console marks them
**Serves:** shared-console-user-directory-US-05 - Operator changes an account's access from the panel

- **GIVEN** a console that marks the account's roles as blocked
- **WHEN** the panel renders
- **THEN** it shows that mark
- **AND THEN** it does not offer changing roles

#### Scenario: shared-console-user-directory-SC-19 - A ban started in the panel is confirmed outside it
**Serves:** shared-console-user-directory-US-05 - Operator changes an account's access from the panel

- **WHEN** an operator starts a ban from the panel
- **THEN** the panel reports the move and collects no confirmation of its own
- **AND THEN** nothing is reported as confirmed until the moderation dialog reports it

### Requirement: The panel shows the grants an account holds

The panel SHALL render the grants an account holds from rows the consumer
supplies, each carrying the fields below. It SHALL NOT derive a grant from a
role, name a grant of its own, or decide which grant is elevated. A row marked
elevated SHALL be distinguishable from one that is not. When any grant is
elevated, that mark SHALL appear once for the account rather than once per
grant. A grant row SHALL NOT be a link; where the console offers a hand-off
into Roles & Permissions, it does so through a role name on identity.

| Field | Meaning |
| --- | --- |
| Id | What the console's identity system calls the grant |
| Label | What the console shows for it |
| Elevated | Whether the console marks it elevated |

#### Scenario: shared-console-user-directory-SC-20 - The grants an account holds are shown
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** the panel renders the grant rows a console supplied
- **THEN** each is shown with the label that console gave it
- **AND THEN** a row the console marked elevated is distinguishable from one it did not
- **AND THEN** the elevated mark appears at most once for the account

#### Scenario: shared-console-user-directory-SC-21 - A grant is not a link
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** the panel renders grant rows
- **THEN** none of those grant labels is a link

#### Scenario: shared-console-user-directory-SC-22 - An account holds no grants
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** the panel renders an account the console supplied no grant rows for
- **THEN** it says the account holds none
- **AND THEN** it names no grant of its own

### Requirement: The account's timeline is shown with its sessions

Where the panel shows activity, it SHALL render the timeline milestones the
consumer supplied — each a label, and optionally when it happened and a
detail — before the sessions list when both are supplied. It SHALL NOT invent
a time or a milestone the consumer did not supply. A milestone without a time
SHALL still render its label (and detail when supplied).

#### Scenario: shared-console-user-directory-SC-27 - Timeline milestones are shown as supplied
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** a console that supplies a joined milestone with a time, and a banned milestone with a reason and no time
- **WHEN** the panel renders activity for that account
- **THEN** both milestones are shown with the labels and detail the console supplied
- **AND THEN** the banned milestone shows no invented time

### Requirement: The directory narrows by Type, Roles, Status and Email

`UserDirectoryFilters` SHALL offer Type, Roles, Status and Email as single
choices. It SHALL take its visible labels and option words from the consumer,
and SHALL NOT invent a role name, a status, or an email state of its own.
Type SHALL be Elevated or Users. When Type is Users, Roles SHALL show the
consumer's user label and SHALL NOT be choosable. When Type is Elevated, Roles
SHALL offer the consumer's any-elevated option plus each elevated role option
the consumer supplied. Status and Email SHALL each offer an Any choice that
reports that narrowing as cleared, plus the options the consumer supplied.

#### Scenario: shared-console-user-directory-SC-23 - A console supplies the filter words
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** a console renders the filters with its Type, Roles, Status and Email copy and options
- **THEN** each control uses the labels and options that console supplied
- **AND THEN** no option that console did not supply is offered

#### Scenario: shared-console-user-directory-SC-24 - An operator clears Status or Email
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** an operator who has narrowed Status or Email away from Any
- **WHEN** they choose Any on that control
- **THEN** the reported selection for it is cleared
- **AND THEN** the other controls' selections are unchanged

#### Scenario: shared-console-user-directory-SC-28 - Roles is locked under Users
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** Type set to Users
- **WHEN** the filters render
- **THEN** Roles shows the consumer's user label
- **AND THEN** Roles is not choosable

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

`UserAccountPanel` SHALL render the ban reason the consumer supplied with the
account's standing, and SHALL show the standing alone when the consumer
supplied none. `UserTable` SHALL show banned or erasing standing on the row
without the ban reason, so the row stays one line. Neither SHALL supply a
reason of its own. When the consumer marks a row as erasing, the table SHALL
show that standing and SHALL NOT offer unban for that row.

#### Scenario: shared-console-user-directory-SC-26 - A banned account says why
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** one banned account the console supplied a reason for, and one it did not
- **WHEN** both render in the panel
- **THEN** the first shows the reason the console supplied
- **AND THEN** the second shows that it is banned and no reason
- **AND THEN** the table's Status cell for a banned row shows banned without that reason
