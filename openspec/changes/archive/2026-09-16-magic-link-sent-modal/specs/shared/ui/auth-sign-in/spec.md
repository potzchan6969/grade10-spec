## Feature set

- Sign-in surface contract
  - Sign-in exports: Name exactly what the shared UI package publishes for the sign-in surface, including the link-sent step
- Link-sent step
  - Confirmation body: Show the consumer's lead line, the email on the next line, and a hugging secondary Resend
  - Resend cooldown: Disable Resend while `resendCooldownRemaining` is above zero and show the countdown label
  - No Back: Draw no control that returns to the entry step

## ADDED Requirements

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

## MODIFIED Requirements

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
