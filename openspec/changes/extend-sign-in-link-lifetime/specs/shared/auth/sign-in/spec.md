## Feature set

- Emailed link
  - Link lifetime: a sign-in link lasts five minutes, and the email carrying it says five minutes

## ADDED Requirements

### Requirement: A sign-in link lasts five minutes

A sign-in link's time to live SHALL be five minutes from the send. A link
followed five minutes or more after its send SHALL NOT create a session, and
the lifetime SHALL be measured on our own clock. The lifetime SHALL be
independent of the resend wait: the wait running out SHALL NOT end the life of
the link already sent.

#### Scenario: shared-auth-sign-in-SC-58 - A link followed inside five minutes signs in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused sign-in link sent four minutes ago
- **AND** no later sign-in-link email has gone to that address
- **WHEN** the person follows that link
- **THEN** they are signed in as the account for that address

#### Scenario: shared-auth-sign-in-SC-59 - A link five minutes old does not sign in
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link sent five minutes ago
- **WHEN** anyone follows that link
- **THEN** no session is created

#### Scenario: shared-auth-sign-in-SC-60 - The resend wait running out leaves the link alive
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** an unused sign-in link sent more than sixty seconds ago
- **AND** the resend wait for that address has run out with no second send
- **WHEN** the person follows that link
- **THEN** they are signed in as the account for that address

#### Scenario: shared-auth-sign-in-SC-62 - A device clock does not revive an expired link
**Serves:** shared-auth-sign-in-US-01 - Collector asks for and follows a sign-in link

- **GIVEN** a sign-in link whose five minutes have run out
- **WHEN** anyone follows it from a device whose clock reads inside those five
  minutes
- **THEN** no session is created

### Requirement: The sign-in email states how long the link lasts

The sign-in-link email SHALL state that the link lasts five minutes, in every
language it is sent in, and SHALL NOT name another lifetime.

#### Scenario: shared-auth-sign-in-SC-61 - The sign-in email says five minutes
**Serves:** Emailed link - what the email promises about the link it carries

- **WHEN** a sign-in-link email is sent
- **THEN** its body states that the link lasts five minutes
- **AND** it names no other lifetime
- **AND** it says so in the language the email is written in

## REMOVED Requirements

### Requirement: A sign-in link lasts sixty seconds

**Reason**: Sixty seconds is shorter than ordinary mail delivery, so a
collector who asks on one device and reads the mail on another meets a dead
link through no fault of their own. Both the requirement's name and
`shared-auth-sign-in-SC-49`'s title state sixty seconds, so neither survives an
edit. `shared-auth-sign-in-SC-49` retires with it and its id is never reissued.

**Migration**: Replaced by "A sign-in link lasts five minutes", whose
`shared-auth-sign-in-SC-59` carries the refusal `shared-auth-sign-in-SC-49`
stated. The sixty-second resend wait, the one-email-a-minute cap, one-time use,
and newest-mail-wins are all unchanged.
