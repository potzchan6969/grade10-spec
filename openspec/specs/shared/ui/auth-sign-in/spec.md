# shared/ui/auth-sign-in Specification

## Purpose

The shared sign-in surface every application composes: a modal dialog over a scrim, with the body order the design draws. What a successful sign-in creates is `shared/auth/sign-in`.

## Feature set

- Sign-in surface contract
  - Sign-in exports: Name exactly what the shared UI package publishes for the sign-in surface, including the link-sent step, with no code step and no exit action.
  - Dialog shell: Render sign-in as a modal over a scrim, not as a page-level card.
  - Dismissal: Let the collector leave the dialog and land back where they were.
- Sign-in body composition
  - Provider before email: Order the body the way the design draws it.
  - Legal line: Carry the legal text the design draws as the body's last node.
- Link-sent step
  - Confirmation body: Show the consumer's lead line, the email on the next line, and a hugging secondary Resend.
  - Resend cooldown: Disable Resend while `resendCooldownRemaining` is above zero and show the countdown label.
  - No Back: Draw no control that returns to the entry step.
## Requirements
### Requirement: The sign-in surface exports

The shared UI package SHALL export, from its public entry, exactly these
components for the sign-in surface: `SignInCard`, `SignInEmailForm`,
`SignInLinkSent` — and exactly these types: `SignInCardCopy`,
`SignInCardProps`, `SignInEmailFormProps`, `SignInEmailFormCopy`,
`SignInLinkSentCopy`, `SignInLinkSentProps`.

The package SHALL NOT export `SignInCodeForm`, `SignInCodeFormProps`,
`SignInCodeFormCopy`, or `SignInCardAction`.

#### Scenario: shared-ui-auth-sign-in-SC-01 - An application imports the sign-in surface
**Serves:** Sign-in surface contract - an application imports the sign-in surface

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error

### Requirement: Sign-in renders as a modal dialog over a scrim

`SignInCard` SHALL render as a modal dialog layered over the page that
triggered it, and SHALL NOT render as a page-level card. The page beneath
SHALL remain mounted while the dialog is open.

Its visibility SHALL be controlled by the consumer through a required `open`
prop and a required `onOpenChange` callback. `SignInCard` SHALL NOT hold open
state of its own.

#### Scenario: shared-ui-auth-sign-in-SC-02 - The triggering page stays mounted
**Serves:** Sign-in surface contract - the triggering page stays mounted

- **GIVEN** a collector on a page that triggers sign-in
- **WHEN** the consumer sets `open` to `true`
- **THEN** the sign-in dialog renders over that page behind a scrim
- **AND** the page beneath remains mounted with its state intact

#### Scenario: shared-ui-auth-sign-in-SC-03 - Visibility is the consumer's
**Serves:** Sign-in surface contract - visibility is the consumer's

- **GIVEN** `SignInCard` rendered with `open` set to `false`
- **WHEN** nothing else changes
- **THEN** no dialog and no scrim are shown

---

### Requirement: The collector can leave the sign-in dialog

`SignInCard` SHALL be dismissible by a close control in its header, by the
Escape key, and by activating the scrim. Each SHALL call `onOpenChange` with
`false` and SHALL NOT navigate away from the page beneath.

Dismissal SHALL be the only way out of the dialog the block offers.
`SignInCard` SHALL NOT accept an exit action, and SHALL draw no control that
leaves the flow by any other route.

#### Scenario: shared-ui-auth-sign-in-SC-04 - Dismissing returns the collector to what they were doing
**Serves:** Sign-in surface contract - dismissing returns the collector to what they were doing

- **GIVEN** an open sign-in dialog over a page
- **WHEN** the collector activates the close control, presses Escape, or activates the scrim
- **THEN** `onOpenChange` is called with `false`
- **AND** the collector is left on the page beneath with its state intact

#### Scenario: shared-ui-auth-sign-in-SC-09 - The dialog offers no exit beside dismissal
**Serves:** Sign-in surface contract - the dialog offers no exit beside dismissal

- **GIVEN** `SignInCard` rendered with a step, a status message, and legal copy
- **WHEN** the dialog renders
- **THEN** no control that leaves the flow renders beside the header's close control

### Requirement: The provider slot renders above the divider

When `providerSlot` is supplied, `SignInCard` SHALL render it before the
divider, and SHALL render the active step after the divider. When
`providerSlot` is not supplied, `SignInCard` SHALL render neither the provider
slot nor the divider.

#### Scenario: shared-ui-auth-sign-in-SC-05 - A provider widget is supplied
**Serves:** Sign-in body composition - a provider widget is supplied

- **GIVEN** `SignInCard` with a `providerSlot` and a step as its children
- **WHEN** the dialog renders
- **THEN** the provider slot appears above the divider
- **AND** the step appears below the divider

#### Scenario: shared-ui-auth-sign-in-SC-06 - No provider widget
**Serves:** Sign-in body composition - no provider widget

- **GIVEN** `SignInCard` with no `providerSlot`
- **WHEN** the dialog renders
- **THEN** the step renders with no divider above it

---

### Requirement: The dialog carries a legal line the consumer supplies

`SignInCardCopy` SHALL accept an optional `legal` field. When it is supplied,
`SignInCard` SHALL render it as the last node of the dialog body, after the
step and after any status message. When it is absent, no legal node SHALL
render.

`SignInCard` SHALL NOT supply legal wording of its own — the block carries no
English.

#### Scenario: shared-ui-auth-sign-in-SC-07 - Legal copy is supplied
**Serves:** Sign-in body composition - legal copy is supplied

- **GIVEN** `SignInCard` whose `copy.legal` is set
- **WHEN** the dialog renders
- **THEN** that text renders as the last node in the dialog body

#### Scenario: shared-ui-auth-sign-in-SC-08 - Legal copy is omitted
**Serves:** Sign-in body composition - legal copy is omitted

- **GIVEN** `SignInCard` whose `copy.legal` is not set
- **WHEN** the dialog renders
- **THEN** no legal node renders

### Requirement: The link-sent step exports confirmation and Resend

The shared UI package SHALL export `SignInLinkSent`, `SignInLinkSentCopy`, and
`SignInLinkSentProps` from its public entry.

`SignInLinkSent` SHALL render the consumer-supplied lead confirmation line, the
`email` prop on the following line, and a Resend control that calls `onResend`.
Resend SHALL use the secondary button treatment and SHALL hug its label width.
`SignInLinkSent` SHALL NOT render a Back control, SHALL NOT accept `onBack`,
SHALL NOT send mail, and SHALL NOT hold product state. It SHALL carry no
English of its own.

WHEN `resendCooldownRemaining` is a number greater than zero, Resend SHALL be
disabled, SHALL NOT call `onResend`, and SHALL show `copy.resendCountdown`.
WHEN `resendCooldownRemaining` is absent or zero, Resend SHALL be enabled (unless
`resending` is true) and SHALL show `copy.resend`.

#### Scenario: shared-ui-auth-sign-in-SC-10 - An application imports the link-sent step
**Serves:** Sign-in surface contract - an application imports the link-sent step

- **WHEN** an application imports `SignInLinkSent`, `SignInLinkSentCopy`, or
  `SignInLinkSentProps` from the public entry
- **THEN** the import resolves without error

#### Scenario: shared-ui-auth-sign-in-SC-11 - Resend reports activation
**Serves:** Link-sent step - resend reports activation

- **GIVEN** `SignInLinkSent` rendered with confirmation copy, an email, and
  callbacks
- **AND** `resendCooldownRemaining` is absent or zero
- **WHEN** the person activates Resend
- **THEN** `onResend` is called

#### Scenario: shared-ui-auth-sign-in-SC-12 - The link-sent step has no Back control
**Serves:** Link-sent step - the link-sent step has no Back control

- **GIVEN** `SignInLinkSent` rendered with confirmation copy and an email
- **WHEN** the step renders
- **THEN** no Back control is shown
- **AND** the props type does not require `onBack`

#### Scenario: shared-ui-auth-sign-in-SC-13 - Confirmation puts the email on its own line
**Serves:** Link-sent step - confirmation puts the email on its own line

- **GIVEN** `SignInLinkSent` with a lead message and `email` set
- **WHEN** the step renders
- **THEN** the lead message is shown
- **AND** the email appears on the line below it
- **AND** the step supplies no wording of its own

#### Scenario: shared-ui-auth-sign-in-SC-14 - Resend is disabled during the cooldown
**Serves:** Link-sent step - resend is disabled during the cooldown

- **GIVEN** `SignInLinkSent` with `resendCooldownRemaining` set to a number
  greater than zero and `copy.resendCountdown` set
- **WHEN** the step renders
- **THEN** Resend is disabled
- **AND** it shows `copy.resendCountdown`
- **AND** activating it does not call `onResend`

#### Scenario: shared-ui-auth-sign-in-SC-15 - Resend uses the ready label when the cooldown is over
**Serves:** Link-sent step - resend uses the ready label when the cooldown is over

- **GIVEN** `SignInLinkSent` with `resendCooldownRemaining` set to zero
- **WHEN** the step renders
- **THEN** Resend is enabled
- **AND** it shows `copy.resend`

