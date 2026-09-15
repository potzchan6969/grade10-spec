# shared/auth/audit Specification

## Purpose
How identity writes on either brand are recorded: operator acts, a trusted
product creating or verifying an account, second-factor changes, and account
deletion; what an entry names, that it cannot be rewritten, that a failed
write stops the action, and who may read or check the trail. Store, auction,
and loyalty trails belong to those products.

## Feature set

- Recorded actions
  - Ban, unban, set-role, revoke: success and refusal are on the trail, named by user id
- Auditor read
  - Trail and consistency: `audit:read` reads the trail and checks it is consistent, without the proof
- Integrity
  - No rewrite: an entry cannot be changed; an unrecorded action does not run

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

#### Scenario: shared-auth-audit-SC-01 - A ban is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator bans an account
- **THEN** the identity audit trail records that actor, that subject, and
  the ban

#### Scenario: shared-auth-audit-SC-02 - A refused ban is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** a caller who cannot ban tries to ban an account
- **THEN** the identity audit trail records that attempt
- **AND** records that it did not succeed

#### Scenario: shared-auth-audit-SC-03 - A revoke is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator revokes a session
- **THEN** the identity audit trail records that actor, that subject, and
  the revoke

#### Scenario: shared-auth-audit-SC-04 - A trail entry names people by user id
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an identity operator action is recorded
- **THEN** the entry names the actor and the subject by user id
- **AND** it does not name them by email

#### Scenario: shared-auth-audit-SC-05 - An auditor can read the trail
**Serves:** shared-auth-audit-US-02 - Auditor reads the identity trail

- **GIVEN** a person who holds `audit:read`
- **WHEN** they read the identity audit trail
- **THEN** they receive the recorded identity actions

#### Scenario: shared-auth-audit-SC-06 - An auditor can check the trail is consistent
**Serves:** shared-auth-audit-US-02 - Auditor reads the identity trail

- **GIVEN** a person who holds `audit:read`
- **WHEN** they check the identity audit trail
- **THEN** they receive whether it is internally consistent
- **AND** they do not receive the proof of that check

#### Scenario: shared-auth-audit-SC-07 - A caller without audit read is refused
**Serves:** shared-auth-audit-US-02 - Auditor reads the identity trail

- **GIVEN** a person who does not hold `audit:read`
- **WHEN** they try to read or check the identity audit trail
- **THEN** the system refuses the request

### Requirement: An entry keeps the reason, not secrets

A ban entry SHALL keep the operator's reason when one was given. An entry
SHALL NOT keep secrets or fields that are not the reason for the action.

#### Scenario: shared-auth-audit-SC-08 - A ban reason is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator bans an account with a reason
- **THEN** the trail entry keeps that reason

#### Scenario: shared-auth-audit-SC-09 - Secrets stay off the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an identity operator action is recorded
- **THEN** the entry does not keep a secret

### Requirement: The trail is append-only and fail-closed

An identity trail entry SHALL NOT be edited or removed after it is written.
WHEN the trail cannot accept an entry, the operator action SHALL NOT take
effect. Listing or searching the directory, and listing sessions, SHALL
NOT write an entry.

#### Scenario: shared-auth-audit-SC-10 - An entry cannot be rewritten
**Serves:** shared-auth-audit-US-03 - Operator cannot act off the trail

- **GIVEN** an identity action already on the trail
- **WHEN** anyone tries to edit or remove that entry
- **THEN** the entry is unchanged

#### Scenario: shared-auth-audit-SC-11 - An unrecorded action does not run
**Serves:** shared-auth-audit-US-03 - Operator cannot act off the trail

- **WHEN** the identity trail cannot accept an entry for a ban
- **THEN** the account is not banned

#### Scenario: shared-auth-audit-SC-12 - A directory list is not on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator lists accounts
- **THEN** no identity trail entry is written for that list

#### Scenario: shared-auth-audit-SC-13 - A session list is not on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator lists a person's sessions
- **THEN** no identity trail entry is written for that list

#### Scenario: shared-auth-audit-SC-14 - An unrecorded revoke does not run
**Serves:** shared-auth-audit-US-03 - Operator cannot act off the trail

- **WHEN** the identity trail cannot accept an entry for a revoke
- **THEN** the session remains signed in
