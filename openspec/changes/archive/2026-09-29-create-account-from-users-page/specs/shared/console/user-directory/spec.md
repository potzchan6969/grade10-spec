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
  - Duplicate open-existing: when the email is taken, the dialog refuses on the create form before review and offers `onOpenExisting` to change roles; post-create refuse remains a safety net
  - Create review: after Create on a free email (or when lookup is skipped or fails open), a confirmation previews the trimmed draft; a malformed or off-list email, or a chosen locked role, adds a note on that same confirmation; a clean draft still shows the confirmation; Back returns to the form; confirming then creates

## ADDED Requirements

### Requirement: The directory offers create only with a handler

Create is a console-gated move: the components collect the fields and report
the result; the console decides what opens next.

**Only with a handler** - The directory SHALL offer Create only when the
consumer supplies a create handler. Without that handler, Create SHALL NOT
appear.

**The dialog** - `UserCreateDialog` SHALL collect a name, an email, and roles
from the role vocabulary the consumer supplied. It SHALL NOT offer a password
field. Confirm SHALL stay disabled until name and email are present after
trim, and at least one role is present. A submitted role list SHALL keep the
offered order and SHALL NOT be empty.

**Success** - On a successful create the dialog SHALL report the created
account's identifier to the consumer. It SHALL decide nothing about what is
shown next.

**Duplicate** - When an account already holds the trimmed email and the
consumer supplies that account's identifier (via an optional email lookup
before review, or from a create refuse as a safety net), the dialog SHALL
offer an open-existing action that steers the operator to change roles on
that account. Choosing that action SHALL call `onOpenExisting` with that
identifier. A taken email found by lookup SHALL refuse on the create form
and SHALL NOT open the review confirmation. The dialog SHALL decide nothing
about what is shown next.

**Review** - `UserCreateDialog` SHALL show a confirmation that previews the
trimmed draft before calling the create handler, when Create runs on a free
email — or when the optional email lookup is omitted or fails open. Name and
email SHALL be trimmed before the confirmation and before create; Confirm
SHALL stay disabled when either trims to empty. The confirmation SHALL
preview the trimmed name, email, and chosen roles in a table. Email and
locked-role notes SHALL appear on the same confirmation when they apply: the
consumer supplies a non-empty list of allowed email domains and the email is
malformed or the host after the last `@` is not on that list (compared
without letter case); or any chosen role id is on the consumer-supplied
locked-role list. Empty or omitted locked-role list SHALL skip the role note.
The typed email SHALL be shown in bold only when there is an email note. A
locked role label SHALL be shown in bold only when that role is in the note.
An email note SHALL name the email issue and SHALL list the allowed domains.
A locked-role note SHALL name each locked role. Confirming the review SHALL
call the create handler. The review dismiss control SHALL read Back; choosing
it SHALL return to the create form with the trimmed values and SHALL NOT call
the create handler. A well-formed email whose host is on the list, with no
chosen locked role, SHALL still show the confirmation when the email is free;
confirming that review SHALL then call the create handler.

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
- **AND THEN** Confirm stays disabled until name, email, and at least one role are present

#### Scenario: shared-console-user-directory-SC-35 - Create success reports the account
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler
- **WHEN** create succeeds
- **THEN** the dialog reports the created account's identifier
- **AND THEN** the dialog decides nothing about what is shown next

#### Scenario: shared-console-user-directory-SC-36 - Taken email refuses on the form before review
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and an email lookup
- **AND** an account already holds the email
- **WHEN** the operator confirms Create on the form
- **THEN** the dialog stays on the create form and does not open the review
- **AND THEN** it shows the duplicate refuse and the open-existing action
- **AND THEN** choosing open-existing calls `onOpenExisting` with that identifier
- **AND THEN** the create handler has not run

#### Scenario: shared-console-user-directory-SC-37 - Review notes when the email is malformed or off the console list
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and a non-empty list of allowed email domains
- **WHEN** an operator confirms Create with a malformed email, or a well-formed email whose host is not on that list
- **THEN** the dialog shows a confirmation with the email notes and does not call the create handler
- **AND THEN** the confirmation previews the typed values, shows the typed email in bold, and lists the allowed domains
- **AND THEN** confirming the review calls the create handler
- **AND THEN** Back from the confirmation returns to the create form and creates nothing

#### Scenario: shared-console-user-directory-SC-38 - Review notes when a locked role is selected
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and a locked-role list
- **WHEN** an operator confirms Create with a chosen role on that list and an email that needs no email note
- **THEN** the dialog shows a confirmation with the locked-role note and does not call the create handler
- **AND THEN** the confirmation shows the locked role label in bold and a note that the role cannot be removed once created
- **AND THEN** confirming the review calls the create handler
- **AND THEN** when the email also needs a note, email and locked-role notes appear on the same confirmation

#### Scenario: shared-console-user-directory-SC-39 - Review opens when the email is free
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and a non-empty list of allowed email domains
- **AND** no account holds the email (or the email lookup is omitted or fails open)
- **WHEN** an operator confirms Create with a well-formed email whose host is on that list and no locked role
- **THEN** the confirmation opens and the create handler has not run
- **AND THEN** confirming the review calls the create handler
- **AND THEN** Back from the confirmation returns to the create form and creates nothing

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
