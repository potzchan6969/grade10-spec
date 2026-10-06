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
  - Closes within 70 seconds: even a cached browse read stops answering signed in, not only a mutation or an elevated call
  - Both surfaces: ending every session, like a ban, closes the site and the console sessions together
- Surface named
  - Site or console: each listed session says which surface it belongs to

## Requirements

### Requirement: Only operators who can list sessions see them

The system SHALL let a caller list a person's sessions only when they hold
`session:list`. The list SHALL be for one account, opened by user id. Each
session SHALL be named so the operator can tell it from the others, SHALL say
whether it belongs to the site or the console, and SHALL NOT include the
secret that authenticates it. A caller without the grant SHALL be refused and
SHALL receive no sessions. A caller who does not hold `admin` SHALL NOT list
sessions of an account that holds `admin`.

<!-- trace:scenario id=g10.shared-sessions.SC-h95 rev=1 -->
#### Scenario: shared-auth-sessions-SC-01 - An operator with the grant lists one person's sessions
**Serves:** shared-auth-sessions-US-01 - Operator lists a person's sessions

- **GIVEN** a signed-in operator who holds `session:list`
- **WHEN** they list sessions for an account by user id
- **THEN** they see that account's sessions
- **AND** no session secret is in the result

<!-- trace:scenario id=g10.shared-sessions.SC-bo7 rev=1 -->
#### Scenario: shared-auth-sessions-SC-02 - A caller without the grant is refused
**Serves:** shared-auth-sessions-US-01 - Operator lists a person's sessions

- **GIVEN** a signed-in person who does not hold `session:list`
- **WHEN** they try to list another person's sessions
- **THEN** the system refuses the request
- **AND** returns no sessions

<!-- trace:scenario id=g10.shared-sessions.SC-jz2 rev=1 -->
#### Scenario: shared-auth-sessions-SC-03 - Support cannot list an admin's sessions
**Serves:** shared-auth-sessions-US-01 - Operator lists a person's sessions

- **GIVEN** a person whose operator role is `support`
- **WHEN** they try to list sessions of an account that holds `admin`
- **THEN** the system refuses the request
- **AND** returns no sessions

#### Scenario: shared-auth-sessions-SC-10 - Each listed session says which surface it belongs to
**Serves:** shared-auth-sessions-US-03 - Operator tells a console session from a site session

- **GIVEN** an account with a site session and a console session
- **AND** an operator who holds `session:list`
- **WHEN** they list that account's sessions
- **THEN** one listed session says it is the site's
- **AND** the other says it is the console's

#### Scenario: shared-auth-sessions-SC-14 - A session with no surface stamp is listed as the site's
**Serves:** shared-auth-sessions-US-03 - Operator tells a console session from a site session

- **GIVEN** an account with a session made before release, which carries no
  surface stamp
- **AND** an operator who holds `session:list`
- **WHEN** they list that account's sessions
- **THEN** that session is listed as the site's

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
they are using, they are signed out. Revoking one session SHALL leave the
account's session on the other surface signed in. Revoking every session of an
account SHALL end its site and console sessions alike, and so SHALL a ban of
that account.

<!-- trace:scenario id=g10.shared-sessions.SC-4af rev=1 -->
#### Scenario: shared-auth-sessions-SC-04 - A revoked session is not signed in
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **WHEN** they revoke one session of an account
- **THEN** a product reading who is calling on that session reports no
  person

<!-- trace:scenario id=g10.shared-sessions.SC-lr6 rev=1 -->
#### Scenario: shared-auth-sessions-SC-05 - Every session of an account can be revoked
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **WHEN** they revoke every session of an account
- **THEN** none of that account's sessions is signed in

<!-- trace:scenario id=g10.shared-sessions.SC-txa rev=1 -->
#### Scenario: shared-auth-sessions-SC-06 - A caller who cannot revoke is refused
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** a signed-in operator who does not hold `session:revoke`
- **WHEN** they try to revoke a session
- **THEN** the system refuses the request
- **AND** the session remains signed in

<!-- trace:scenario id=g10.shared-sessions.SC-bcq rev=1 -->
#### Scenario: shared-auth-sessions-SC-07 - Support cannot revoke an admin's session
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** a person whose operator role is `support`
- **WHEN** they try to revoke a session of an account that holds `admin`
- **THEN** the system refuses the request
- **AND** the session remains signed in

<!-- trace:scenario id=g10.shared-sessions.SC-ots rev=1 -->
#### Scenario: shared-auth-sessions-SC-08 - Revoking the current session signs the operator out
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **WHEN** they revoke the session they are using
- **THEN** they are not signed in

<!-- trace:scenario id=g10.shared-sessions.SC-bui rev=1 -->
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

#### Scenario: shared-auth-sessions-SC-11 - Revoking every session ends the site and the console together
**Serves:** shared-auth-sessions-US-04 - Operator ends every session of an account on both surfaces

- **GIVEN** an operator who holds `session:revoke`
- **AND** an account signed in on the site and on the console
- **WHEN** they revoke every session of that account
- **THEN** the site reports no person for that account
- **AND** the console reports no person for that account

#### Scenario: shared-auth-sessions-SC-12 - A ban ends the site and the console together
**Serves:** shared-auth-sessions-US-04 - Operator ends every session of an account on both surfaces

- **GIVEN** an operator who holds `user:ban`
- **AND** an account signed in on the site and on the console
- **WHEN** they ban that account
- **THEN** the site reports no person for that account
- **AND** the console reports no person for that account

#### Scenario: shared-auth-sessions-SC-13 - Revoking one session leaves the other surface signed in
**Serves:** shared-auth-sessions-US-02 - Operator ends a session

- **GIVEN** an operator who holds `session:revoke`
- **AND** an account signed in on the site and on the console
- **WHEN** they revoke that account's console session
- **THEN** the console reports no person for that account
- **AND** the site still reports that account signed in
