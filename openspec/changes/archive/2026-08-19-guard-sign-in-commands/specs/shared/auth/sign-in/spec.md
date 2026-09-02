## ADDED Requirements

### Requirement: A sign-in command in flight cannot be duplicated

WHILE a sign-in command's request is running, activating the same command
again SHALL NOT start another request: at most one request per command
reaches the auth service, and every activation settles with that one
request's outcome. Input edited during the flight SHALL NOT be sent — the
running request's input stands until it settles.

#### Scenario: Activating again during flight does nothing

- **GIVEN** a sign-in command whose request is in flight
- **WHEN** the person activates the same command again
- **THEN** no second request reaches the auth service
- **AND** both activations settle with the one request's outcome

### Requirement: The email step runs one command at a time

The email step offers two ways to sign in — an emailed link and an emailed
code. WHILE either request is in flight, the step SHALL refuse activation of
both, and only the command that is running SHALL show its busy state.

#### Scenario: One sign-in email per intent

- **GIVEN** a collector on the email step whose send-link request is in
  flight
- **WHEN** they activate the send-code control
- **THEN** no code request starts and no second email is sent

#### Scenario: Only the running command looks busy

- **GIVEN** a collector on the email step whose send-code request is in
  flight
- **THEN** the send-code control shows its busy state
- **AND** the send-link control is refusing activation without looking busy

#### Scenario: A settled request frees the step

- **GIVEN** an email step whose in-flight request has settled
- **WHEN** the collector activates either control
- **THEN** that command starts normally
