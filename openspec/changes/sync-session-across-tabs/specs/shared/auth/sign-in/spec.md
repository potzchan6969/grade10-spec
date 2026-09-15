## Feature set

- Emailed link
  - One-time session: an unused unexpired link signs in once
  - Followed elsewhere: the surface that asked carries on once the session arrives

## ADDED Requirements

### Requirement: A sign-in dialog closes when the session arrives

WHEN a session arrives for a surface that is showing the sign-in dialog, that
surface SHALL close the dialog and SHALL show the person signed in, on the
terms `shared/auth/session` sets for keeping up. The person SHALL NOT have to
dismiss the dialog or reload the surface. Nothing SHALL announce the close.

#### Scenario: shared-auth-sign-in-SC-50 - The dialog on the surface that asked closes
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a surface showing the sign-in dialog after a sign-in link was
  asked for there
- **WHEN** the collector follows that link elsewhere on this device and
  returns to the surface that asked
- **THEN** the sign-in dialog is gone
- **AND** the surface shows them signed in
- **AND** no message on it announces that the session arrived

#### Scenario: shared-auth-sign-in-SC-51 - A dialog on a surface that did not ask closes too
**Serves:** Emailed link - a session arriving leaves no sign-in dialog open on the brand

- **GIVEN** two surfaces of one brand open in a browser, each showing the
  sign-in dialog, and a sign-in link asked for on only one of them
- **WHEN** the collector follows that link elsewhere on this device and
  returns to each surface
- **THEN** the sign-in dialog is gone from both
- **AND** both show them signed in

### Requirement: The surface that asked completes the action it refused

WHEN a session arrives for a surface where the person was refused an action
and sign-in was asked of them, that surface SHALL carry out that action — the
add, the bid, the navigation they were stopped before — without the person
activating it again, and SHALL carry it out at most once. The action SHALL be
attempted against the world as it stands: one that can no longer be done SHALL
be refused the way that action is ordinarily refused, and SHALL NOT be passed
over in silence. WHEN nothing was refused on that surface, it SHALL carry out
nothing beyond closing the dialog.

#### Scenario: shared-auth-sign-in-SC-52 - The refused action is carried out
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped from adding an item to their cart and
  asked for a sign-in link on that surface
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** that item is in their cart
- **AND** they did not activate the add a second time

#### Scenario: shared-auth-sign-in-SC-53 - The refused navigation is carried out
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped before a page that needs a session and
  asked for a sign-in link on that surface
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** that surface is on the page they were stopped before

#### Scenario: shared-auth-sign-in-SC-54 - A dialog with nothing behind it only closes
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who opened sign-in from a sign-in control, with no
  action refused behind it, and asked for a link there
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** the sign-in dialog is gone
- **AND** the surface shows them signed in
- **AND** no action is carried out on their behalf

#### Scenario: shared-auth-sign-in-SC-55 - A link that creates no session leaves the asking surface as it was
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a surface showing the sign-in dialog after a sign-in link was
  asked for there
- **WHEN** that link is followed elsewhere on this device and creates no
  session
- **THEN** the surface that asked still shows the sign-in dialog
- **AND** the action it refused is not carried out
- **AND** nothing on it announces that the follow failed

#### Scenario: shared-auth-sign-in-SC-56 - An action that can no longer be done is refused, not skipped
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped from adding an item to their cart and
  asked for a sign-in link on that surface
- **AND** that item can no longer be added by the time they return
- **WHEN** they follow that link elsewhere on this device and return to the
  surface that asked
- **THEN** the surface reports the refusal that action is ordinarily refused
  with
- **AND** it does not pass the action over in silence

#### Scenario: shared-auth-sign-in-SC-57 - The refused action is carried out once, not once per return
**Serves:** shared-auth-sign-in-US-08 - Collector follows the link and the tab that asked carries on

- **GIVEN** a collector who was stopped from adding an item to their cart,
  asked for a sign-in link on that surface, and had the add carried out when
  the session arrived
- **WHEN** they leave that surface and return to it again
- **THEN** the add is not carried out a second time
- **AND** their cart holds that item once
