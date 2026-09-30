## Feature set

- Session list
  - One account: an operator with `session:list` lists sessions by user id, never the secret
- Revoke
  - One or all: a revoke ends that session; revoking every session is allowed; revoking the current one signs the operator out
  - Closes within 70 seconds: even a cached browse read stops answering signed in, not only a mutation or an elevated call

## MODIFIED Requirements

### Requirement: An operator who can revoke can end a session

The system SHALL let a caller revoke a session, or every session of an
account, only when they hold `session:revoke`. A revoked session SHALL NOT
be treated as signed in. A revoked session SHALL NOT be treated as signed
in on an ordinary cached read either, not only on a mutation or an elevated
call; this SHALL hold for every read that starts 70 seconds or more after
the revoke. A
money-moving action on a revoked session SHALL re-check identity and SHALL
NOT complete. A caller SHALL NOT revoke a session of an account that holds
`admin` unless the caller holds `admin`. A caller without the grant SHALL be
refused, and the session SHALL remain. WHEN the caller revokes the session
they are using, they are signed out.

#### Scenario: shared-auth-sessions-SC-04 - A revoked session is not signed in
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **WHEN** they revoke one session of an account
- **THEN** a product reading who is calling on that session reports no
  person

#### Scenario: shared-auth-sessions-SC-05 - Every session of an account can be revoked
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **WHEN** they revoke every session of an account
- **THEN** none of that account's sessions is signed in

#### Scenario: shared-auth-sessions-SC-06 - A caller who cannot revoke is refused
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** a signed-in operator who does not hold `session:revoke`
- **WHEN** they try to revoke a session
- **THEN** the system refuses the request
- **AND** the session remains signed in

#### Scenario: shared-auth-sessions-SC-07 - Support cannot revoke an admin's session
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** a person whose operator role is `support`
- **WHEN** they try to revoke a session of an account that holds `admin`
- **THEN** the system refuses the request
- **AND** the session remains signed in

#### Scenario: shared-auth-sessions-SC-08 - Revoking the current session signs the operator out
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **WHEN** they revoke the session they are using
- **THEN** they are not signed in

#### Scenario: shared-auth-sessions-SC-09 - A cached read closes within 70 seconds of a revoke
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **AND** a signed-in session whose signed cookie cache has not yet expired
- **WHEN** they revoke that session
- **THEN** an ordinary browse read that starts 70 seconds or more after the
  revoke reports no person, even though the cookie cache would not have
  expired
- **AND** a session of that account they did not revoke keeps answering
  signed in
