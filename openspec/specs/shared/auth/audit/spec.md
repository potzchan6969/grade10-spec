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
- Account lifecycle
  - New-id create: a trusted product that creates a user id is on the trail as `created`
  - Verify flip: unverified becoming verified is on the trail
  - Account delete: removing an account is on the trail
  - Unchanged find: an already-unverified or already-verified find with no data change is not on the trail
- Second-factor writes
  - Factor enable: the factor first going live is on the trail; starting enrollment is not; a failed record leaves the factor active and a later proof writes the missing enable
  - Factor disable: removing the factor is on the trail
  - Recovery regen: replacing recovery codes is on the trail; the codes are not

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

<!-- trace:scenario id=g10.shared-audit.SC-s5y rev=1 -->
#### Scenario: shared-auth-audit-SC-01 - A ban is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator bans an account
- **THEN** the identity audit trail records that actor, that subject, and
  the ban

<!-- trace:scenario id=g10.shared-audit.SC-hya rev=1 -->
#### Scenario: shared-auth-audit-SC-02 - A refused ban is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** a caller who cannot ban tries to ban an account
- **THEN** the identity audit trail records that attempt
- **AND** records that it did not succeed

<!-- trace:scenario id=g10.shared-audit.SC-6pa rev=1 -->
#### Scenario: shared-auth-audit-SC-03 - A revoke is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator revokes a session
- **THEN** the identity audit trail records that actor, that subject, and
  the revoke

<!-- trace:scenario id=g10.shared-audit.SC-pgv rev=1 -->
#### Scenario: shared-auth-audit-SC-04 - A trail entry names people by user id
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an identity operator action is recorded
- **THEN** the entry names the actor and the subject by user id
- **AND** it does not name them by email

<!-- trace:scenario id=g10.shared-audit.SC-31z rev=1 -->
#### Scenario: shared-auth-audit-SC-05 - An auditor can read the trail
**Serves:** shared-auth-audit-US-02 - Auditor reads the identity trail

- **GIVEN** a person who holds `audit:read`
- **WHEN** they read the identity audit trail
- **THEN** they receive the recorded identity actions

<!-- trace:scenario id=g10.shared-audit.SC-ren rev=1 -->
#### Scenario: shared-auth-audit-SC-06 - An auditor can check the trail is consistent
**Serves:** shared-auth-audit-US-02 - Auditor reads the identity trail

- **GIVEN** a person who holds `audit:read`
- **WHEN** they check the identity audit trail
- **THEN** they receive whether it is internally consistent
- **AND** they do not receive the proof of that check

<!-- trace:scenario id=g10.shared-audit.SC-2ig rev=1 -->
#### Scenario: shared-auth-audit-SC-07 - A caller without audit read is refused
**Serves:** shared-auth-audit-US-02 - Auditor reads the identity trail

- **GIVEN** a person who does not hold `audit:read`
- **WHEN** they try to read or check the identity audit trail
- **THEN** the system refuses the request

### Requirement: An entry keeps the reason, not secrets

A ban entry SHALL keep the operator's reason when one was given. An entry
SHALL NOT keep secrets, recovery codes, or fields that are not the reason
for the action. An entry SHALL NOT keep an email.

<!-- trace:scenario id=g10.shared-audit.SC-m8q rev=1 -->
#### Scenario: shared-auth-audit-SC-08 - A ban reason is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator bans an account with a reason
- **THEN** the trail entry keeps that reason

<!-- trace:scenario id=g10.shared-audit.SC-qhl rev=1 -->
#### Scenario: shared-auth-audit-SC-09 - Secrets stay off the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an identity action is recorded
- **THEN** the entry does not keep a secret

<!-- trace:scenario id=g10.shared-audit.SC-nte rev=1 -->
#### Scenario: shared-auth-audit-SC-26 - Recovery codes stay off the trail
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** an operator regenerates second-factor recovery codes
- **THEN** the trail entry does not keep the codes

### Requirement: The trail is append-only and fail-closed

An identity trail entry SHALL NOT be edited or removed after it is written.
WHEN the trail cannot accept an entry for a write this capability records,
that write SHALL NOT take effect, except a second factor becoming active:
the factor SHALL remain active, the request SHALL fail, and a later
successful proof SHALL record the enable if it is still missing. Listing
or searching the directory, listing sessions, a trusted product reading
whether an account exists or reading a session, and collector sign-in or
sign-out, SHALL NOT write an entry.

<!-- trace:scenario id=g10.shared-audit.SC-r7d rev=1 -->
#### Scenario: shared-auth-audit-SC-10 - An entry cannot be rewritten
**Serves:** shared-auth-audit-US-03 - Operator cannot act off the trail

- **GIVEN** an identity action already on the trail
- **WHEN** anyone tries to edit or remove that entry
- **THEN** the entry is unchanged

<!-- trace:scenario id=g10.shared-audit.SC-1rb rev=1 -->
#### Scenario: shared-auth-audit-SC-11 - An unrecorded action does not run
**Serves:** shared-auth-audit-US-03 - Operator cannot act off the trail

- **WHEN** the identity trail cannot accept an entry for a ban
- **THEN** the account is not banned

<!-- trace:scenario id=g10.shared-audit.SC-r4t rev=1 -->
#### Scenario: shared-auth-audit-SC-12 - A directory list is not on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator lists accounts
- **THEN** no identity trail entry is written for that list

<!-- trace:scenario id=g10.shared-audit.SC-jbf rev=1 -->
#### Scenario: shared-auth-audit-SC-13 - A session list is not on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** an operator lists a person's sessions
- **THEN** no identity trail entry is written for that list

<!-- trace:scenario id=g10.shared-audit.SC-ci1 rev=1 -->
#### Scenario: shared-auth-audit-SC-14 - An unrecorded revoke does not run
**Serves:** shared-auth-audit-US-03 - Operator cannot act off the trail

- **WHEN** the identity trail cannot accept an entry for a revoke
- **THEN** the session remains signed in

<!-- trace:scenario id=g10.shared-audit.SC-06a rev=1 -->
#### Scenario: shared-auth-audit-SC-27 - An unrecorded product create does not create the account
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **WHEN** the identity trail cannot accept an entry for a trusted product creating an account
- **THEN** no account is created from that request

<!-- trace:scenario id=g10.shared-audit.SC-88n rev=1 -->
#### Scenario: shared-auth-audit-SC-28 - An unrecorded verify does not mark the account verified
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** an unverified account
- **WHEN** the identity trail cannot accept an entry for a trusted product marking that email verified
- **THEN** the account remains unverified

<!-- trace:scenario id=g10.shared-audit.SC-h1r rev=1 -->
#### Scenario: shared-auth-audit-SC-29 - An unrecorded regenerate does not replace the codes
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** the identity trail cannot accept an entry for regenerating recovery codes
- **THEN** the recovery codes are unchanged

<!-- trace:scenario id=g10.shared-audit.SC-7ql rev=1 -->
#### Scenario: shared-auth-audit-SC-30 - Collector sign-in is not on the trail
**Serves:** Recorded actions - collector sign-in is not on the trail

- **WHEN** a collector completes sign-in
- **THEN** no identity trail entry is written for that sign-in

<!-- trace:scenario id=g10.shared-audit.SC-bks rev=1 -->
#### Scenario: shared-auth-audit-SC-31 - A trusted-product account read is not on the trail
**Serves:** Recorded actions - a trusted-product account read is not on the trail

- **WHEN** a trusted product reads whether an account exists, or reads a session
- **THEN** no identity trail entry is written for that read

<!-- trace:scenario id=g10.shared-audit.SC-hkt rev=1 -->
#### Scenario: shared-auth-audit-SC-33 - Collector sign-out is not on the trail
**Serves:** Recorded actions - collector sign-out is not on the trail

- **WHEN** a collector signs out
- **THEN** no identity trail entry is written for that sign-out

<!-- trace:scenario id=g10.shared-audit.SC-2og rev=1 -->
#### Scenario: shared-auth-audit-SC-34 - An unrecorded delete does not remove the account
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **WHEN** the identity trail cannot accept an entry for deleting an account
- **THEN** the account remains

<!-- trace:scenario id=g10.shared-audit.SC-0sh rev=1 -->
#### Scenario: shared-auth-audit-SC-35 - A failed enable record leaves the factor active
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** the identity trail cannot accept an entry for a second factor first becoming active
- **THEN** the factor remains active
- **AND** the request does not succeed

<!-- trace:scenario id=g10.shared-audit.SC-bgp rev=1 -->
#### Scenario: shared-auth-audit-SC-36 - An unrecorded disable does not remove the factor
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** the identity trail cannot accept an entry for removing a second factor
- **THEN** the factor remains

### Requirement: Account create, verify-flip, and delete are recorded

WHEN a trusted product's create creates a new user id, the identity trail
SHALL append an entry for that write. The outcome SHALL be `created`. WHEN
a trusted product marks an unverified account verified, the identity trail
SHALL append an entry for that write. WHEN an account is deleted, the
identity trail SHALL append an entry for that write. For a trusted-product
create or verify, the actor SHALL be the system. The subject SHALL be the
user id. The entry SHALL NOT name an email.

<!-- trace:scenario id=g10.shared-audit.SC-fa1 rev=1 -->
#### Scenario: shared-auth-audit-SC-15 - A trusted product creating an account is on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** an email that has no account
- **WHEN** a trusted product creates an unverified account for that email
- **THEN** the identity trail records that write for the new user id
- **AND** the outcome is `created`

<!-- trace:scenario id=g10.shared-audit.SC-f32 rev=1 -->
#### Scenario: shared-auth-audit-SC-18 - A trusted product creating a verified account is on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** an email that has no account
- **WHEN** a trusted product marks that email verified
- **THEN** the identity trail records that write for the new user id
- **AND** the outcome is `created`

<!-- trace:scenario id=g10.shared-audit.SC-osr rev=1 -->
#### Scenario: shared-auth-audit-SC-19 - A trusted product verifying an unverified account is on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** an unverified account
- **WHEN** a trusted product marks that email verified
- **THEN** the identity trail records that write for that user id

<!-- trace:scenario id=g10.shared-audit.SC-ubk rev=1 -->
#### Scenario: shared-auth-audit-SC-20 - A product-write entry names the system and the user id
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **WHEN** a trusted product create or verify is recorded
- **THEN** the entry names the actor as the system
- **AND** names the subject by user id
- **AND** it does not name them by email

<!-- trace:scenario id=g10.shared-audit.SC-tej rev=1 -->
#### Scenario: shared-auth-audit-SC-25 - Deleting an account is on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **WHEN** an operator deletes an account
- **THEN** the identity trail records that actor, that subject, and the deletion

### Requirement: A no-change account find is not recorded

WHEN a trusted product's create or verify finds an account that already
existed and identity data does not change (`already-unverified` or
`already-verified`), the identity trail SHALL NOT append an entry for that
request.

<!-- trace:scenario id=g10.shared-audit.SC-oue rev=1 -->
#### Scenario: shared-auth-audit-SC-16 - A trusted product finding an unverified account is not on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** an unverified account
- **WHEN** a trusted product asks to create an unverified account for that same email
- **THEN** no identity trail entry is written for that request

<!-- trace:scenario id=g10.shared-audit.SC-7no rev=1 -->
#### Scenario: shared-auth-audit-SC-17 - A trusted product finding a verified account is not on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** a verified account
- **WHEN** a trusted product asks to create an unverified account for that same email
- **THEN** no identity trail entry is written for that request

<!-- trace:scenario id=g10.shared-audit.SC-5fv rev=1 -->
#### Scenario: shared-auth-audit-SC-32 - A trusted product verifying an already-verified account is not on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** a verified account
- **WHEN** a trusted product marks that email verified
- **THEN** no identity trail entry is written for that request

### Requirement: Second-factor enable, disable, and recovery-code regenerate are recorded

WHEN a second factor first becomes active, the identity trail SHALL append
an entry for that write. Starting enrollment SHALL NOT be recorded as the
factor going live. WHEN a second factor is active and the trail has no
enable after the last disable for that account (or no enable at all), a
successful proof SHALL append that enable. WHEN the trail already has an
enable after the last disable, a successful proof SHALL NOT append another.
WHEN a second factor is removed, the identity trail SHALL append an entry
for that write. WHEN recovery codes are regenerated, the identity trail
SHALL append an entry for that write. The actor and the subject SHALL be
named by user id. The entry SHALL NOT name an email. The entry SHALL NOT
keep the codes. A failed enable record SHALL NOT reverse the factor.

<!-- trace:scenario id=g10.shared-audit.SC-nr9 rev=1 -->
#### Scenario: shared-auth-audit-SC-21 - Regenerating recovery codes is on the trail
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** an operator regenerates second-factor recovery codes
- **THEN** the identity trail records that actor, that subject, and the regenerate

<!-- trace:scenario id=g10.shared-audit.SC-tl6 rev=1 -->
#### Scenario: shared-auth-audit-SC-22 - Enabling a second factor is on the trail
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** a second factor first becomes active for an account
- **THEN** the identity trail records that actor, that subject, and the enable

<!-- trace:scenario id=g10.shared-audit.SC-ccw rev=1 -->
#### Scenario: shared-auth-audit-SC-23 - Starting enrollment is not the enable entry
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** a person starts second-factor enrollment and the factor is not yet active
- **THEN** the identity trail does not record an enable for that start

<!-- trace:scenario id=g10.shared-audit.SC-yjy rev=1 -->
#### Scenario: shared-auth-audit-SC-24 - Disabling a second factor is on the trail
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **WHEN** a second factor is removed from an account
- **THEN** the identity trail records that actor, that subject, and the disable

<!-- trace:scenario id=g10.shared-audit.SC-gkn rev=1 -->
#### Scenario: shared-auth-audit-SC-37 - A later proof records a missing enable
**Serves:** shared-auth-audit-US-05 - Auditor traces a second-factor write

- **GIVEN** a second factor is active
- **AND** the identity trail has no enable after the last disable for that account
- **WHEN** a later successful proof completes
- **THEN** the identity trail records exactly one enable for that going live
