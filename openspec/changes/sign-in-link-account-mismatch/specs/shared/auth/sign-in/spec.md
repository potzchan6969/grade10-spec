## Feature set

- Emailed link
  - Signed-in mismatch: a link follow while signed in as a different account offers Switch or Stay instead of replacing the session

## ADDED Requirements

### Requirement: A signed-in mismatch prompts Switch or Stay instead of replacing the session

A collector who is already signed in and follows a valid sign-in link for a
different account meets a choice instead of an automatic session swap.

- **Trigger** — WHEN a signed-in collector follows a valid sign-in link for a
  different account, the system SHALL NOT replace the current session on its
  own and SHALL show a warning toast offering Switch and Stay.
- **Toast content** — The toast's title SHALL state that they are signed in
  with a different account. Its description SHALL name the link's email and
  SHALL NOT name the current session's email.
- **Switch** — SHALL end the current session and enter the link's account.
- **Stay** — SHALL keep the current session and SHALL NOT enter the link's
  account.
- **Dismiss** — Dismissing the toast SHALL have the same effect as Stay.
- **Persistence** — The toast SHALL remain until Switch, Stay, or dismiss is
  chosen.

#### Scenario: shared-auth-sign-in-SC-63 - A signed-in mismatch does not auto-switch
**Serves:** shared-auth-sign-in-US-09 - a collector already signed in follows a link meant for another account

- **GIVEN** a collector is signed in as one account
- **WHEN** they follow a valid sign-in link for a different account
- **THEN** the current session stays in place
- **AND** no session is created for the link's account

#### Scenario: shared-auth-sign-in-SC-64 - The different-account toast names the mismatch and the link's email
**Serves:** shared-auth-sign-in-US-09 - a collector reads the choice a mismatched link offers

- **GIVEN** a collector is signed in as one account
- **WHEN** they follow a valid sign-in link for a different account
- **THEN** a warning toast appears
- **AND** its title states they are signed in with a different account
- **AND** its description names the link's email
- **AND** its description does not name the current session's email

#### Scenario: shared-auth-sign-in-SC-65 - Switch enters the link's account
**Serves:** shared-auth-sign-in-US-09 - a collector chooses to leave their account for the link's

- **GIVEN** the different-account toast is showing
- **WHEN** the collector chooses Switch
- **THEN** the current session ends
- **AND** the link's account is entered

#### Scenario: shared-auth-sign-in-SC-66 - Stay keeps the current session
**Serves:** shared-auth-sign-in-US-09 - a collector chooses to keep the account they were using

- **GIVEN** the different-account toast is showing
- **WHEN** the collector chooses Stay
- **THEN** the current session continues
- **AND** the link's account is not entered

#### Scenario: shared-auth-sign-in-SC-67 - Dismissing the toast keeps the current session, same as Stay
**Serves:** shared-auth-sign-in-US-09 - a collector closes the toast without choosing

- **GIVEN** the different-account toast is showing
- **WHEN** the collector dismisses the toast
- **THEN** the current session continues
- **AND** the link's account is not entered

#### Scenario: shared-auth-sign-in-SC-68 - The different-account toast waits for a choice rather than auto-dismissing
**Serves:** shared-auth-sign-in-US-09 - a collector takes time to decide between Switch and Stay

- **GIVEN** the different-account toast is showing
- **WHEN** no choice is made
- **THEN** the toast remains visible
- **AND** the current session is unaffected

#### Scenario: shared-auth-sign-in-SC-69 - A link for the signed-in account itself shows no mismatch toast
**Serves:** shared-auth-sign-in-US-09 - a collector's own link is not treated as a mismatch

- **GIVEN** a collector is signed in as one account
- **WHEN** they follow a valid sign-in link for that same account
- **THEN** no different-account toast is shown
