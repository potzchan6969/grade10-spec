# shared-auth/audit Specification

## Purpose
How identity operator actions on either brand are recorded: what an entry
names, that it cannot be rewritten, that a failed write stops the action,
and who may read or check the trail. Store, auction, and loyalty trails
belong to those products.

## Requirements

### Requirement: Ban, unban, set-role, and revoke are recorded

A successful or refused ban, unban, set-role, or session revoke SHALL be
recorded on the identity audit trail. Each entry SHALL name the actor's
user id, the roles the actor held at the time, the action, the subject's
user id, whether it succeeded, and when. An entry SHALL identify people by
user id, never by email. A caller who holds `audit:read` SHALL be able to
read that trail and to check whether it is internally consistent. That
check SHALL report whether the trail is consistent, and SHALL NOT return
the proof. A caller without that grant SHALL NOT.

#### Scenario: A ban is on the trail

- **WHEN** an operator bans an account
- **THEN** the identity audit trail records that actor, that subject, and
  the ban

#### Scenario: A refused ban is on the trail

- **WHEN** a caller who cannot ban tries to ban an account
- **THEN** the identity audit trail records that attempt
- **AND** records that it did not succeed

#### Scenario: A revoke is on the trail

- **WHEN** an operator revokes a session
- **THEN** the identity audit trail records that actor, that subject, and
  the revoke

#### Scenario: A trail entry names people by user id

- **WHEN** an identity operator action is recorded
- **THEN** the entry names the actor and the subject by user id
- **AND** it does not name them by email

#### Scenario: An auditor can read the trail

- **GIVEN** a person who holds `audit:read`
- **WHEN** they read the identity audit trail
- **THEN** they receive the recorded identity actions

#### Scenario: An auditor can check the trail is consistent

- **GIVEN** a person who holds `audit:read`
- **WHEN** they check the identity audit trail
- **THEN** they receive whether it is internally consistent
- **AND** they do not receive the proof of that check

#### Scenario: A caller without audit read is refused

- **GIVEN** a person who does not hold `audit:read`
- **WHEN** they try to read or check the identity audit trail
- **THEN** the system refuses the request

### Requirement: An entry keeps the reason, not secrets

A ban entry SHALL keep the operator's reason when one was given. An entry
SHALL NOT keep secrets or fields that are not the reason for the action.

#### Scenario: A ban reason is on the trail

- **WHEN** an operator bans an account with a reason
- **THEN** the trail entry keeps that reason

#### Scenario: Secrets stay off the trail

- **WHEN** an identity operator action is recorded
- **THEN** the entry does not keep a secret

### Requirement: The trail is append-only and fail-closed

An identity trail entry SHALL NOT be edited or removed after it is written.
WHEN the trail cannot accept an entry, the operator action SHALL NOT take
effect. Listing or searching the directory, and listing sessions, SHALL
NOT write an entry.

#### Scenario: An entry cannot be rewritten

- **GIVEN** an identity action already on the trail
- **WHEN** anyone tries to edit or remove that entry
- **THEN** the entry is unchanged

#### Scenario: An unrecorded action does not run

- **WHEN** the identity trail cannot accept an entry for a ban
- **THEN** the account is not banned

#### Scenario: A directory list is not on the trail

- **WHEN** an operator lists accounts
- **THEN** no identity trail entry is written for that list

#### Scenario: A session list is not on the trail

- **WHEN** an operator lists a person's sessions
- **THEN** no identity trail entry is written for that list

#### Scenario: An unrecorded revoke does not run

- **WHEN** the identity trail cannot accept an entry for a revoke
- **THEN** the session remains signed in
