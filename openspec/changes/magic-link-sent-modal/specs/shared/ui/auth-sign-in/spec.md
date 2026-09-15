## Feature set

- Sign-in surface contract
  - Sign-in exports: Name exactly what the shared UI package publishes for the sign-in surface, including the link-sent step
- Link-sent step
  - Confirmation body: Show the consumer's confirmation, Resend, and Back
  - Resend cooldown: Disable Resend while `resendCooldownRemaining` is above zero and show the countdown label

## ADDED Requirements

### Requirement: The link-sent step exports confirmation, Resend, and Back

The shared UI package SHALL export `SignInLinkSent`, `SignInLinkSentCopy`, and
`SignInLinkSentProps` from its public entry.

`SignInLinkSent` SHALL render the consumer-supplied confirmation copy, a
Resend control that calls `onResend`, and a Back control that calls `onBack`.
It SHALL NOT send mail, hold product state, or own the address beyond what the
consumer puts in the copy. It SHALL carry no English of its own.

WHEN `resendCooldownRemaining` is a number greater than zero, Resend SHALL be
disabled, SHALL NOT call `onResend`, and SHALL show `copy.resendCountdown`.
WHEN `resendCooldownRemaining` is absent or zero, Resend SHALL be enabled (unless
`resending` is true) and SHALL show `copy.resend`.

#### Scenario: shared-ui-auth-sign-in-SC-10 - An application imports the link-sent step

- **WHEN** an application imports `SignInLinkSent`, `SignInLinkSentCopy`, or
  `SignInLinkSentProps` from the shared UI package's public entry
- **THEN** the import resolves without error

#### Scenario: shared-ui-auth-sign-in-SC-11 - Resend reports activation

- **GIVEN** `SignInLinkSent` rendered with confirmation copy and callbacks
- **AND** `resendCooldownRemaining` is absent or zero
- **WHEN** the person activates Resend
- **THEN** `onResend` is called

#### Scenario: shared-ui-auth-sign-in-SC-12 - Back reports activation

- **GIVEN** `SignInLinkSent` rendered with confirmation copy and callbacks
- **WHEN** the person activates Back
- **THEN** `onBack` is called

#### Scenario: shared-ui-auth-sign-in-SC-13 - Confirmation copy is the consumer's

- **GIVEN** `SignInLinkSent` whose copy carries confirmation text naming an
  address
- **WHEN** the step renders
- **THEN** that confirmation text is shown
- **AND** the step supplies no wording of its own

#### Scenario: shared-ui-auth-sign-in-SC-14 - Resend is disabled during the cooldown

- **GIVEN** `SignInLinkSent` with `resendCooldownRemaining` set to a number
  greater than zero and `copy.resendCountdown` set
- **WHEN** the step renders
- **THEN** Resend is disabled
- **AND** it shows `copy.resendCountdown`
- **AND** activating it does not call `onResend`

#### Scenario: shared-ui-auth-sign-in-SC-15 - Resend uses the ready label when the cooldown is over

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

- **WHEN** an application imports any export named above from the shared UI package's public entry
- **THEN** the import resolves without error
