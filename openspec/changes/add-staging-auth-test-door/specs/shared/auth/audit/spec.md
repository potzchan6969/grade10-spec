# shared/auth/audit Specification

## ADDED Requirements

### Requirement: The test endpoint's identity writes are on the trail

A ban, a grant, a scoped-role grant, and the creation of an account the test endpoint
makes for an address that never signed in SHALL each be recorded on the
identity audit trail, the same as the operator's own identity writes. The
endpoint has no user id, so its entry SHALL name the caller's kind in place of an
actor's user id: `test-endpoint-workflow` for the test endpoint's own workflow, or
`test-endpoint-qa-token` for the QA agent. The entry SHALL keep the action, the
subject's user id, whether it succeeded, and when, and SHALL NOT carry the
token, the address, or an email. Capture, expire, and clear change no account
and no role, so they SHALL NOT write an entry. An action the trail cannot record
SHALL NOT run, the same as any identity write.

#### Scenario: shared-auth-audit-SC-38 - A test-endpoint ban is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the test endpoint's workflow bans a tester address
- **THEN** the trail holds one entry naming `test-endpoint-workflow`, the ban, and the subject's user id
- **AND** the entry carries no email and no token

#### Scenario: shared-auth-audit-SC-39 - A capture writes no entry
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the QA token captures a tester's last sign-in mail
- **THEN** the trail holds no entry for the call

#### Scenario: shared-auth-audit-SC-40 - A test-endpoint grant of admin is on the trail
**Serves:** Identity writes - a grant of admin

- **WHEN** the workflow grants `admin` to a tester address
- **THEN** the trail holds one entry naming `test-endpoint-workflow`, the grant, and the subject's user id
- **AND** the entry carries no email and no token

#### Scenario: shared-auth-audit-SC-41 - A test-endpoint scoped role is on the trail
**Serves:** Identity writes - a scoped role

- **WHEN** the workflow sets a scoped role on a generated plus-tag
- **THEN** the trail holds one entry naming `test-endpoint-workflow`, the role, and the subject's user id

#### Scenario: shared-auth-audit-SC-42 - An account the test endpoint creates is on the trail
**Serves:** Identity writes - an account created for a tester

- **WHEN** a ban or a grant creates the account for an address that never signed in
- **THEN** the trail holds one entry naming the caller's kind and the new user id

#### Scenario: shared-auth-audit-SC-43 - A refused test-endpoint ban is on the trail
**Serves:** Refusals - a refused ban is recorded

- **WHEN** the QA token attempts a ban and the endpoint refuses it
- **THEN** the trail holds one entry naming `test-endpoint-qa-token` and the refusal

#### Scenario: shared-auth-audit-SC-44 - A grant that changes nothing is on the trail
**Serves:** Identity writes - every grant is recorded

- **GIVEN** an address that already holds `admin`
- **WHEN** the workflow grants `admin` again
- **THEN** the trail holds one entry for the grant, as the requirement states

#### Scenario: shared-auth-audit-SC-45 - Expire and clear write no entry
**Serves:** Identity writes - no entry for expire or clear

- **WHEN** the QA token expires a link or clears the sign-in limits
- **THEN** the trail holds no entry for the call

