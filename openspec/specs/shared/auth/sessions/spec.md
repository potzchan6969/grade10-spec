# shared/auth/sessions Specification

## Purpose
How an operator on either brand lists a person's sessions and ends one or
all of them. Sign-out of the current surface is `shared/auth/sign-out`. A
ban still disables the whole account (`shared/auth/users`).

## Feature set

- Session list
  - One account: an operator with `session:list` lists sessions by user id, never the secret
- Revoke
  - One or all: a revoke ends that session; revoking every session is allowed; revoking the current one signs the operator out

## Requirements

### Requirement: Only operators who can list sessions see them

The system SHALL let a caller list a person's sessions only when they hold
`session:list`. The list SHALL be for one account, opened by user id. Each
session SHALL be named so the operator can tell it from the others, and
SHALL NOT include the secret that authenticates it. A caller without the
grant SHALL be refused and SHALL receive no sessions. A caller who does not
hold `admin` SHALL NOT list sessions of an account that holds `admin`.

#### Scenario: shared-auth-sessions-SC-01 - An operator with the grant lists one person's sessions
**Serves:** shared-auth-sessions-US-01 - Operator lists a person's sessions

- **GIVEN** a signed-in operator who holds `session:list`
- **WHEN** they list sessions for an account by user id
- **THEN** they see that account's sessions
- **AND** no session secret is in the result

#### Scenario: shared-auth-sessions-SC-02 - A caller without the grant is refused
**Serves:** shared-auth-sessions-US-01 - Operator lists a person's sessions

- **GIVEN** a signed-in person who does not hold `session:list`
- **WHEN** they try to list another person's sessions
- **THEN** the system refuses the request
- **AND** returns no sessions

#### Scenario: shared-auth-sessions-SC-03 - Support cannot list an admin's sessions
**Serves:** shared-auth-sessions-US-01 - Operator lists a person's sessions

- **GIVEN** a person whose operator role is `support`
- **WHEN** they try to list sessions of an account that holds `admin`
- **THEN** the system refuses the request
- **AND** returns no sessions

### Requirement: An operator who can revoke can end a session

The system SHALL let a caller revoke a session, or every session of an
account, only when they hold `session:revoke`. A revoked session SHALL NOT
be treated as signed in. A money-moving action on a revoked session SHALL
re-check identity and SHALL NOT complete. A caller SHALL NOT revoke a
session of an account that holds `admin` unless the caller holds `admin`. A
caller without the grant SHALL be refused, and the session SHALL remain.
WHEN the caller revokes the session they are using, they are signed out.

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
