# shared/console/user-directory Specification

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

- The directory contract
  - Console-package exports: the directory components and their types ship from the console package's public entry
- One account, open beside the list
  - Account panel: identity and actions, roles and grants, and timeline with sessions — each area only when the console supplies it
  - Roles in the panel: the selection is changed where the account is read, under the roles dialog's contract
  - Confirmations stay dialogs: a move that cannot be undone is reported, never confirmed in the panel
- One account open
  - Auction standing: suspend from auctions and reinstate appear only with a handler, and confirm in the moderation dialog
- What an account can do
  - Grant rows: the grants the console resolved, elevated ones marked once for the account
  - Actions together: hand-offs and standing moves the console offered, hand-offs before ban, unban, or erase
  - Standing with its reason: a banned account shows why in the panel when the console supplies it; the table Status cell stays one line
  - Timeline: when the account joined, and that it is banned when it is, without inventing a time the console did not supply
  - Session detail: where a session was raised, when it ends, and which surface it belongs to, never what authenticates it
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
- Create from the directory
  - Create gated: create appears only when the console supplies a create handler
  - Create dialog: collects name, email, and roles from the console-supplied vocabulary
  - Success reports the created account: the components decide nothing about what shows next
  - Duplicate open-existing: when the email is taken, the dialog refuses on the create form before review and offers `onOpenExisting` to change roles; post-create refuse remains a safety net
  - Create review: after Create on a free email (or when lookup is skipped or fails open), a confirmation previews the trimmed draft; a malformed or off-list email, or a chosen locked role, adds a note on that same confirmation; a clean draft still shows the confirmation; Back returns to the form; confirming then creates

## Requirements

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

### Requirement: The directory carries no identity vocabulary of its own

These components SHALL receive the role vocabulary, each account's roles, and
every displayed date as props already resolved by the consumer. They SHALL NOT
name a role, parse a stored role value, or format a date. A role list submitted
by the roles dialog SHALL be ordered as the options were offered rather than as
they were selected, and an empty selection SHALL be submitted as an empty list,
leaving any default-role decision to the consumer.

<!-- trace:scenario id=g10.shared-user-directory.SC-x9v rev=1 -->
#### Scenario: shared-console-user-directory-SC-02 - A console offers its own role vocabulary
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** a console renders the roles dialog with the roles its identity system defines
- **THEN** each role is offered with the label and permission summary the console supplied
- **AND THEN** no role the console did not supply is offered

<!-- trace:scenario id=g10.shared-user-directory.SC-7uu rev=1 -->
#### Scenario: shared-console-user-directory-SC-03 - A selection is submitted
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** an operator changes which roles are selected and saves
- **THEN** the submitted list holds the selected roles in the order the options were offered
- **AND THEN** an operator who selected none submits an empty list

<!-- trace:scenario id=g10.shared-user-directory.SC-uu6 rev=1 -->
#### Scenario: shared-console-user-directory-SC-04 - An account joined on a given day
**Serves:** Consumer-owned vocabulary - an account joined on a given day

- **WHEN** the table renders an account
- **THEN** it shows the joined date exactly as the consumer supplied it
- **AND THEN** two consoles supplying different formats each render their own

### Requirement: The table offers only the moves the console permits

`UserTable` SHALL offer a row's moves — opening the account, sessions, roles,
ban, unban, and delete — only when the consumer supplies a handler for that
move, so a console can withhold a move the operator's grants do not allow. A
row SHALL offer ban or unban according to whether the account is banned, and
never both.

<!-- trace:scenario id=g10.shared-user-directory.SC-l3n rev=1 -->
#### Scenario: shared-console-user-directory-SC-05 - An operator without elevated grants opens the directory
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** a console renders the table without a roles handler or a delete handler
- **THEN** neither action appears on any row
- **AND THEN** every move the console did supply a handler for still appears

<!-- trace:scenario id=g10.shared-user-directory.SC-lga rev=1 -->
#### Scenario: shared-console-user-directory-SC-06 - A banned account is shown
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** the table renders an account that is banned
- **THEN** that row offers unban and does not offer ban
- **AND THEN** a row for an account that is not banned offers ban and does not offer unban

<!-- trace:scenario id=g10.shared-user-directory.SC-pff rev=1 -->
#### Scenario: shared-console-user-directory-SC-14 - A console withholds sessions and moderation
**Serves:** shared-console-user-directory-US-05 - Operator changes an account's access from the panel

- **WHEN** a console renders the table without a sessions handler and without a moderation handler
- **THEN** no row offers sessions
- **AND THEN** no row offers ban or unban

<!-- trace:scenario id=g10.shared-user-directory.SC-xmw rev=1 -->
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
it ends without a revocation, where it was raised, and which surface it
belongs to, the site or the console — each supplied by the consumer already in
words, each rendered when supplied and omitted when not.

<!-- trace:scenario id=g10.shared-user-directory.SC-uz8 rev=1 -->
#### Scenario: shared-console-user-directory-SC-07 - An operator reads where an account is signed in
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **WHEN** the dialog or the account panel renders an account's sessions
- **THEN** each is named by its identifier
- **AND THEN** no authenticating secret is rendered

<!-- trace:scenario id=g10.shared-user-directory.SC-6bz rev=1 -->
#### Scenario: shared-console-user-directory-SC-08 - An account holds no sessions
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **WHEN** the dialog or the account panel renders an account with no sessions
- **THEN** it says so
- **AND THEN** the control that ends every session is unavailable

<!-- trace:scenario id=g10.shared-user-directory.SC-4vh rev=1 -->
#### Scenario: shared-console-user-directory-SC-16 - A session says where it was raised
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** a session the consumer supplied with where it was raised and when it ends
- **WHEN** that session renders
- **THEN** both are shown as the consumer supplied them
- **AND THEN** a session supplied with neither shows no place and no end time,
  only its identifier and whatever else it was supplied, such as its surface

#### Scenario: shared-console-user-directory-SC-40 - A session says which surface it belongs to
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **GIVEN** two sessions of one account, the consumer supplying the site as one's surface and the console as the other's
- **WHEN** the dialog and the account panel each render them
- **THEN** each view shows the surface the consumer supplied beside each session
- **AND THEN** the two sessions read as different surfaces in both views

#### Scenario: shared-console-user-directory-SC-41 - Ending one session leaves the other's surface standing
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **GIVEN** two sessions of one account, the consumer supplying the site as one's surface and the console as the other's
- **WHEN** the operator ends one of them from the dialog or from the account panel's sessions area
- **THEN** that view reports the ended session by its own identifier
- **AND THEN** the session the consumer still supplies shows its own surface, in the dialog and in the panel

#### Scenario: shared-console-user-directory-SC-42 - A session supplied no surface shows none
**Serves:** shared-console-user-directory-US-02 - Operator reviews where an account is signed in

- **GIVEN** two sessions of one account, the consumer supplying the console as one's surface and none for the other
- **WHEN** the dialog and the account panel each render them
- **THEN** the first shows the console as its surface
- **AND THEN** the other shows no surface, neither the site's nor the console's, beside whatever else it was supplied

### Requirement: One confirmation serves every moderation move

`UserModerationDialog` SHALL render one confirmation whose words, tone, and
whether it collects a reason are supplied by the consumer, and SHALL report the
confirmation with the reason collected — or with an empty reason where none was
collected — so a consumer reads one signature whichever move it asked for.

<!-- trace:scenario id=g10.shared-user-directory.SC-12o rev=1 -->
#### Scenario: shared-console-user-directory-SC-09 - A move that collects a reason is confirmed
**Serves:** shared-console-user-directory-US-01 - Operator moderates an account from the directory

- **WHEN** an operator confirms a move the consumer said collects a reason
- **THEN** the dialog reports the reason that was typed

<!-- trace:scenario id=g10.shared-user-directory.SC-lps rev=1 -->
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

<!-- trace:scenario id=g10.shared-user-directory.SC-0qx rev=1 -->
#### Scenario: shared-console-user-directory-SC-11 - A role name on the account opens its address
**Serves:** shared-console-user-directory-US-03 - Operator opens a role from the account

- **GIVEN** a console that supplies an address for `staff` on an account that holds it
- **WHEN** the operator activates the `staff` name on the account's identity
- **THEN** navigation uses the address supplied for `staff`

<!-- trace:scenario id=g10.shared-user-directory.SC-ryc rev=1 -->
#### Scenario: shared-console-user-directory-SC-12 - The directory's Roles cell is never a link
**Serves:** shared-console-user-directory-US-03 - Operator opens a role from the account

- **GIVEN** a console that supplies per-role addresses
- **WHEN** the table renders a row that holds those roles
- **THEN** each role name is shown
- **AND THEN** none of those names is a link

<!-- trace:scenario id=g10.shared-user-directory.SC-u5f rev=1 -->
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

<!-- trace:scenario id=g10.shared-user-directory.SC-2r3 rev=1 -->
#### Scenario: shared-console-user-directory-SC-17 - An operator reads one account whole
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** a console renders the panel for an account
- **THEN** who the account is, its actions, the grants it holds, its timeline, and its sessions each render from what the console supplied
- **AND THEN** an area the console supplied nothing for is not rendered

<!-- trace:scenario id=g10.shared-user-directory.SC-1iw rev=1 -->
#### Scenario: shared-console-user-directory-SC-18 - Roles are saved from the panel
**Serves:** shared-console-user-directory-US-05 - Operator changes an account's access from the panel

- **WHEN** an operator changes which roles are selected in the panel and saves
- **THEN** the submitted list holds the selected roles in the order the options were offered
- **AND THEN** an operator who selected none submits an empty list

<!-- trace:scenario id=g10.shared-user-directory.SC-kmj rev=1 -->
#### Scenario: shared-console-user-directory-SC-29 - Roles stay blocked when the console marks them
**Serves:** shared-console-user-directory-US-05 - Operator changes an account's access from the panel

- **GIVEN** a console that marks the account's roles as blocked
- **WHEN** the panel renders
- **THEN** it shows that mark
- **AND THEN** it does not offer changing roles

<!-- trace:scenario id=g10.shared-user-directory.SC-z5x rev=1 -->
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

<!-- trace:scenario id=g10.shared-user-directory.SC-mne rev=1 -->
#### Scenario: shared-console-user-directory-SC-20 - The grants an account holds are shown
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** the panel renders the grant rows a console supplied
- **THEN** each is shown with the label that console gave it
- **AND THEN** a row the console marked elevated is distinguishable from one it did not
- **AND THEN** the elevated mark appears at most once for the account

<!-- trace:scenario id=g10.shared-user-directory.SC-g8w rev=1 -->
#### Scenario: shared-console-user-directory-SC-21 - A grant is not a link
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** the panel renders grant rows
- **THEN** none of those grant labels is a link

<!-- trace:scenario id=g10.shared-user-directory.SC-jnf rev=1 -->
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

<!-- trace:scenario id=g10.shared-user-directory.SC-my2 rev=1 -->
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

<!-- trace:scenario id=g10.shared-user-directory.SC-58a rev=1 -->
#### Scenario: shared-console-user-directory-SC-23 - A console supplies the filter words
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **WHEN** a console renders the filters with its Type, Roles, Status and Email copy and options
- **THEN** each control uses the labels and options that console supplied
- **AND THEN** no option that console did not supply is offered

<!-- trace:scenario id=g10.shared-user-directory.SC-uwn rev=1 -->
#### Scenario: shared-console-user-directory-SC-24 - An operator clears Status or Email
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** an operator who has narrowed Status or Email away from Any
- **WHEN** they choose Any on that control
- **THEN** the reported selection for it is cleared
- **AND THEN** the other controls' selections are unchanged

<!-- trace:scenario id=g10.shared-user-directory.SC-eo0 rev=1 -->
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

<!-- trace:scenario id=g10.shared-user-directory.SC-fyc rev=1 -->
#### Scenario: shared-console-user-directory-SC-25 - An operator asks for a different order
**Serves:** Narrowing and order - an operator asks for a different order

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

<!-- trace:scenario id=g10.shared-user-directory.SC-geg rev=1 -->
#### Scenario: shared-console-user-directory-SC-26 - A banned account says why
**Serves:** shared-console-user-directory-US-04 - Operator reads one account beside the directory

- **GIVEN** one banned account the console supplied a reason for, and one it did not
- **WHEN** both render in the panel
- **THEN** the first shows the reason the console supplied
- **AND THEN** the second shows that it is banned and no reason
- **AND THEN** the table's Status cell for a banned row shows banned without that reason

### Requirement: The panel offers auction suspension only with a handler

The panel shows the moves and the standing the console supplies, and confirms
nothing itself.

**Only with a handler** - `UserAccountPanel` SHALL offer suspending the account
from auctions only when the consumer supplies a handler for it, and reinstating
only when the consumer supplies a handler for that.

**One move at a time** - It SHALL offer suspend or reinstate according to the
auction standing the consumer supplies, and never both.

**Auction standing** - The panel SHALL render auction standing, and the reason
the consumer supplied with it, apart from the account's platform standing.

**Confirmed outside** - It SHALL NOT confirm either move itself: it reports the
move to the console, which confirms it in `UserModerationDialog`.

**Exports** - No export is added or renamed.

<!-- trace:scenario id=g10.shared-user-directory.SC-icf rev=1 -->
#### Scenario: shared-console-user-directory-SC-30 - Auction suspension appears only with a handler
**Serves:** One account open - auction suspension appears only with a handler

- **WHEN** a console renders the panel without a suspend handler or a reinstate handler
- **THEN** the panel offers neither move
- **AND THEN** a console that supplies both sees suspend for an account not suspended and reinstate for one that is, never both

<!-- trace:scenario id=g10.shared-user-directory.SC-x0r rev=1 -->
#### Scenario: shared-console-user-directory-SC-31 - Auction standing shows apart from a ban
**Serves:** One account open - auction standing shows apart from a ban

- **GIVEN** an account the console supplies as suspended from auctions with a reason, and not banned
- **WHEN** the panel renders
- **THEN** it shows the auction suspension and its reason
- **AND THEN** it shows the account as not banned

<!-- trace:scenario id=g10.shared-user-directory.SC-mzm rev=1 -->
#### Scenario: shared-console-user-directory-SC-32 - A suspension started in the panel is confirmed outside it
**Serves:** One account open - a suspension started in the panel is confirmed outside it

- **WHEN** an operator starts suspending an account from auctions in the panel
- **THEN** the panel reports the move and collects no confirmation of its own
- **AND THEN** nothing is reported as confirmed until the moderation dialog reports it

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

<!-- trace:scenario id=g10.shared-user-directory.SC-3w0 rev=1 -->
#### Scenario: shared-console-user-directory-SC-33 - Create appears only with a create handler
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **WHEN** a console renders the directory without a create handler
- **THEN** Create is not offered
- **AND THEN** a console that supplies a create handler is offered Create

<!-- trace:scenario id=g10.shared-user-directory.SC-uox rev=1 -->
#### Scenario: shared-console-user-directory-SC-34 - The create dialog collects console vocabulary
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and its role vocabulary
- **WHEN** an operator opens Create
- **THEN** the dialog offers name, email, and only the roles the console supplied
- **AND THEN** the dialog offers no password field
- **AND THEN** Confirm stays disabled until name, email, and at least one role are present

<!-- trace:scenario id=g10.shared-user-directory.SC-bm5 rev=1 -->
#### Scenario: shared-console-user-directory-SC-35 - Create success reports the account
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler
- **WHEN** create succeeds
- **THEN** the dialog reports the created account's identifier
- **AND THEN** the dialog decides nothing about what is shown next

<!-- trace:scenario id=g10.shared-user-directory.SC-d4y rev=1 -->
#### Scenario: shared-console-user-directory-SC-36 - Taken email refuses on the form before review
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and an email lookup
- **AND** an account already holds the email
- **WHEN** the operator confirms Create on the form
- **THEN** the dialog stays on the create form and does not open the review
- **AND THEN** it shows the duplicate refuse and the open-existing action
- **AND THEN** choosing open-existing calls `onOpenExisting` with that identifier
- **AND THEN** the create handler has not run

<!-- trace:scenario id=g10.shared-user-directory.SC-8ij rev=1 -->
#### Scenario: shared-console-user-directory-SC-37 - Review notes when the email is malformed or off the console list
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and a non-empty list of allowed email domains
- **WHEN** an operator confirms Create with a malformed email, or a well-formed email whose host is not on that list
- **THEN** the dialog shows a confirmation with the email notes and does not call the create handler
- **AND THEN** the confirmation previews the typed values, shows the typed email in bold, and lists the allowed domains
- **AND THEN** confirming the review calls the create handler
- **AND THEN** Back from the confirmation returns to the create form and creates nothing

<!-- trace:scenario id=g10.shared-user-directory.SC-iqr rev=1 -->
#### Scenario: shared-console-user-directory-SC-38 - Review notes when a locked role is selected
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and a locked-role list
- **WHEN** an operator confirms Create with a chosen role on that list and an email that needs no email note
- **THEN** the dialog shows a confirmation with the locked-role note and does not call the create handler
- **AND THEN** the confirmation shows the locked role label in bold and a note that the role cannot be removed once created
- **AND THEN** confirming the review calls the create handler
- **AND THEN** when the email also needs a note, email and locked-role notes appear on the same confirmation

<!-- trace:scenario id=g10.shared-user-directory.SC-aan rev=1 -->
#### Scenario: shared-console-user-directory-SC-39 - Review opens when the email is free
**Serves:** shared-console-user-directory-US-06 - Operator creates an account from the directory

- **GIVEN** a console that supplies a create handler and a non-empty list of allowed email domains
- **AND** no account holds the email (or the email lookup is omitted or fails open)
- **WHEN** an operator confirms Create with a well-formed email whose host is on that list and no locked role
- **THEN** the confirmation opens and the create handler has not run
- **AND THEN** confirming the review calls the create handler
- **AND THEN** Back from the confirmation returns to the create form and creates nothing
