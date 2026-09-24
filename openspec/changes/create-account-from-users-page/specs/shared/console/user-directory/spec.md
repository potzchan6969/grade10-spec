## Purpose

The operator's view of the identity directory: the table of accounts, the
filters the console offers, an account panel beside the list, a create dialog
when the console supplies a create handler, and the dialogs that confirm
irreversible moves. Both brands' consoles render this surface from the console
package, where admin UI lives. What an operator is *allowed* to do is
`shared/auth/users` and `shared/auth/sessions`; this capability governs only
what the components render and the contract they expose. It carries the
requirements of `shared-ui/auth-user-directory` forward; only the home moved.

## Feature set

- Create from the directory
  - Create gated: create appears only when the console supplies a create handler
  - Create dialog: collects name, email, and roles from the console-supplied vocabulary
  - Success reports the created account: the components decide nothing about what shows next

## ADDED Requirements

### Requirement: The directory offers create only with a handler

Create is a console-gated move: the components collect the fields and report
the result; the console decides what opens next.

**Only with a handler** - The directory SHALL offer Create only when the
consumer supplies a create handler. Without that handler, Create SHALL NOT
appear.

**The dialog** - `UserCreateDialog` SHALL collect a name, an email, and roles
from the role vocabulary the consumer supplied. It SHALL NOT offer a password
field. A submitted role list SHALL keep the offered order, and an empty
selection SHALL be submitted as an empty list.

**Success** - On a successful create the dialog SHALL report the created
account's identifier to the consumer. It SHALL decide nothing about what is
shown next.

#### Scenario: shared-console-user-directory-SC-33 - Create appears only with a create handler
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **WHEN** a console renders the directory without a create handler
- **THEN** Create is not offered
- **AND THEN** a console that supplies a create handler is offered Create

#### Scenario: shared-console-user-directory-SC-34 - The create dialog collects console vocabulary
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and its role vocabulary
- **WHEN** an operator opens Create
- **THEN** the dialog offers name, email, and only the roles the console supplied
- **AND THEN** the dialog offers no password field

#### Scenario: shared-console-user-directory-SC-35 - Create success reports the account
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler
- **WHEN** create succeeds
- **THEN** the dialog reports the created account's identifier
- **AND THEN** the dialog decides nothing about what is shown next

## MODIFIED Requirements

### Requirement: The user directory exports

The console package SHALL export, from its public entry, exactly these
components for the user directory surface: `UserTable`, `UserRolesDialog`,
`UserModerationDialog`, `UserSessionsDialog`, `UserAccountPanel`,
`UserDirectoryFilters`, `UserCreateDialog` — and exactly these types:
`UserTableProps`, `UserTableCopy`, `UserRolesDialogProps`,
`UserRolesDialogCopy`, `UserModerationDialogProps`,
`UserModerationDialogCopy`, `UserModerationTone`, `UserSessionsDialogProps`,
`UserSessionsDialogCopy`, `UserAccountPanelProps`, `UserAccountPanelCopy`,
`UserAccountRelatedLink`, `UserAccountTimeline`, `UserTimelineEvent`,
`UserDirectoryFiltersProps`, `UserDirectoryFiltersCopy`, `UserDirectoryRow`,
`UserRoleOption`, `UserSessionRow`, `UserFilterGroup`, `UserFilterOption`,
`UserGrantRow`, `UserDirectoryOrder`, `UserCreateDialogProps`, and
`UserCreateDialogCopy`.

#### Scenario: shared-console-user-directory-SC-01 - A console imports the directory
**Serves:** The directory contract - a console imports the directory

- **WHEN** an admin application imports any export named above from the console package's public entry
- **THEN** the import resolves without error
