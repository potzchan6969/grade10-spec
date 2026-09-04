## Feature set

- Account lifecycle
  - New-id create: a trusted product that creates a user id is on the trail as `created`
  - Verify flip: unverified becoming verified is on the trail
  - Account delete: removing an account is on the trail
  - Unchanged find: an already-unverified or already-verified find with no data change is not on the trail
- Second-factor writes
  - Factor enable: the factor first going live is on the trail; starting enrollment is not
  - Factor disable: removing the factor is on the trail
  - Recovery regen: replacing recovery codes is on the trail; the codes are not

## ADDED Requirements

### Requirement: Account create, verify-flip, and delete are recorded

WHEN a trusted product's create creates a new user id, the identity trail
SHALL append an entry for that write. The outcome SHALL be `created`. WHEN
a trusted product marks an unverified account verified, the identity trail
SHALL append an entry for that write. WHEN an account is deleted, the
identity trail SHALL append an entry for that write. For a trusted-product
create or verify, the actor SHALL be the system. The subject SHALL be the
user id. The entry SHALL NOT name an email.

#### Scenario: shared-auth-audit-SC-15 - A trusted product creating an account is on the trail

- **GIVEN** an email that has no account
- **WHEN** a trusted product creates an unverified account for that email
- **THEN** the identity trail records that write for the new user id
- **AND** the outcome is `created`

#### Scenario: shared-auth-audit-SC-18 - A trusted product creating a verified account is on the trail

- **GIVEN** an email that has no account
- **WHEN** a trusted product marks that email verified
- **THEN** the identity trail records that write for the new user id
- **AND** the outcome is `created`

#### Scenario: shared-auth-audit-SC-19 - A trusted product verifying an unverified account is on the trail

- **GIVEN** an unverified account
- **WHEN** a trusted product marks that email verified
- **THEN** the identity trail records that write for that user id

#### Scenario: shared-auth-audit-SC-20 - A product-write entry names the system and the user id

- **WHEN** a trusted product create or verify is recorded
- **THEN** the entry names the actor as the system
- **AND** names the subject by user id
- **AND** it does not name them by email

#### Scenario: shared-auth-audit-SC-25 - Deleting an account is on the trail

- **WHEN** an operator deletes an account
- **THEN** the identity trail records that actor, that subject, and the deletion

### Requirement: A no-change account find is not recorded

WHEN a trusted product's create or verify finds an account that already
existed and identity data does not change (`already-unverified` or
`already-verified`), the identity trail SHALL NOT append an entry for that
request.

#### Scenario: shared-auth-audit-SC-16 - A trusted product finding an unverified account is not on the trail

- **GIVEN** an unverified account
- **WHEN** a trusted product asks to create an unverified account for that same email
- **THEN** no identity trail entry is written for that request

#### Scenario: shared-auth-audit-SC-17 - A trusted product finding a verified account is not on the trail

- **GIVEN** a verified account
- **WHEN** a trusted product asks to create an unverified account for that same email
- **THEN** no identity trail entry is written for that request

#### Scenario: shared-auth-audit-SC-32 - A trusted product verifying an already-verified account is not on the trail

- **GIVEN** a verified account
- **WHEN** a trusted product marks that email verified
- **THEN** no identity trail entry is written for that request

### Requirement: Second-factor enable, disable, and recovery-code regenerate are recorded

WHEN a second factor first becomes active, the identity trail SHALL append
an entry for that write. Starting enrollment SHALL NOT be recorded as the
factor going live. WHEN a second factor is removed, the identity trail
SHALL append an entry for that write. WHEN recovery codes are regenerated,
the identity trail SHALL append an entry for that write. The actor and the
subject SHALL be named by user id. The entry SHALL NOT name an email. The
entry SHALL NOT keep the codes.

#### Scenario: shared-auth-audit-SC-21 - Regenerating recovery codes is on the trail

- **WHEN** an operator regenerates second-factor recovery codes
- **THEN** the identity trail records that actor, that subject, and the regenerate

#### Scenario: shared-auth-audit-SC-22 - Enabling a second factor is on the trail

- **WHEN** a second factor first becomes active for an account
- **THEN** the identity trail records that actor, that subject, and the enable

#### Scenario: shared-auth-audit-SC-23 - Starting enrollment is not the enable entry

- **WHEN** a person starts second-factor enrollment and the factor is not yet active
- **THEN** the identity trail does not record an enable for that start

#### Scenario: shared-auth-audit-SC-24 - Disabling a second factor is on the trail

- **WHEN** a second factor is removed from an account
- **THEN** the identity trail records that actor, that subject, and the disable

## MODIFIED Requirements

### Requirement: An entry keeps the reason, not secrets

A ban entry SHALL keep the operator's reason when one was given. An entry
SHALL NOT keep secrets, recovery codes, or fields that are not the reason
for the action. An entry SHALL NOT keep an email.

#### Scenario: shared-auth-audit-SC-08 - A ban reason is on the trail

- **WHEN** an operator bans an account with a reason
- **THEN** the trail entry keeps that reason

#### Scenario: shared-auth-audit-SC-09 - Secrets stay off the trail

- **WHEN** an identity action is recorded
- **THEN** the entry does not keep a secret

#### Scenario: shared-auth-audit-SC-26 - Recovery codes stay off the trail

- **WHEN** an operator regenerates second-factor recovery codes
- **THEN** the trail entry does not keep the codes

### Requirement: The trail is append-only and fail-closed

An identity trail entry SHALL NOT be edited or removed after it is written.
WHEN the trail cannot accept an entry for a write this capability records,
that write SHALL NOT take effect. Listing or searching the directory,
listing sessions, a trusted product reading whether an account exists or
reading a session, and collector sign-in or sign-out, SHALL NOT write an
entry.

#### Scenario: shared-auth-audit-SC-10 - An entry cannot be rewritten

- **GIVEN** an identity action already on the trail
- **WHEN** anyone tries to edit or remove that entry
- **THEN** the entry is unchanged

#### Scenario: shared-auth-audit-SC-11 - An unrecorded action does not run

- **WHEN** the identity trail cannot accept an entry for a ban
- **THEN** the account is not banned

#### Scenario: shared-auth-audit-SC-12 - A directory list is not on the trail

- **WHEN** an operator lists accounts
- **THEN** no identity trail entry is written for that list

#### Scenario: shared-auth-audit-SC-13 - A session list is not on the trail

- **WHEN** an operator lists a person's sessions
- **THEN** no identity trail entry is written for that list

#### Scenario: shared-auth-audit-SC-14 - An unrecorded revoke does not run

- **WHEN** the identity trail cannot accept an entry for a revoke
- **THEN** the session remains signed in

#### Scenario: shared-auth-audit-SC-27 - An unrecorded product create does not create the account

- **WHEN** the identity trail cannot accept an entry for a trusted product creating an account
- **THEN** no account is created from that request

#### Scenario: shared-auth-audit-SC-28 - An unrecorded verify does not mark the account verified

- **GIVEN** an unverified account
- **WHEN** the identity trail cannot accept an entry for a trusted product marking that email verified
- **THEN** the account remains unverified

#### Scenario: shared-auth-audit-SC-29 - An unrecorded regenerate does not replace the codes

- **WHEN** the identity trail cannot accept an entry for regenerating recovery codes
- **THEN** the recovery codes are unchanged

#### Scenario: shared-auth-audit-SC-30 - Collector sign-in is not on the trail

- **WHEN** a collector completes sign-in
- **THEN** no identity trail entry is written for that sign-in

#### Scenario: shared-auth-audit-SC-31 - A trusted-product account read is not on the trail

- **WHEN** a trusted product reads whether an account exists, or reads a session
- **THEN** no identity trail entry is written for that read

#### Scenario: shared-auth-audit-SC-33 - Collector sign-out is not on the trail

- **WHEN** a collector signs out
- **THEN** no identity trail entry is written for that sign-out

#### Scenario: shared-auth-audit-SC-34 - An unrecorded delete does not remove the account

- **WHEN** the identity trail cannot accept an entry for deleting an account
- **THEN** the account remains

#### Scenario: shared-auth-audit-SC-35 - An unrecorded enable does not make the factor live

- **WHEN** the identity trail cannot accept an entry for a second factor first becoming active
- **THEN** the factor is not active

#### Scenario: shared-auth-audit-SC-36 - An unrecorded disable does not remove the factor

- **WHEN** the identity trail cannot accept an entry for removing a second factor
- **THEN** the factor remains
