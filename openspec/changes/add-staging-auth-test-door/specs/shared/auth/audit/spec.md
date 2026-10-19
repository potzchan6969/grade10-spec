# shared/auth/audit Specification

## Feature set

- Test-endpoint writes
  - Ban, grant, scoped role: one entry each, as `test-endpoint-workflow` in place of a user id; capture, expire and clear write none
  - Plus-tag cleanup: the daily removal of a generated plus-tag's account is a deletion entry, as `test-endpoint-cleanup`

## ADDED Requirements

### Requirement: The test endpoint's identity writes are on the trail

A ban, a grant and a scoped-role grant the test endpoint makes SHALL each be
recorded on the identity audit trail as one entry, the same as the operator's
own identity writes. When the action creates the account for an address that
never signed in, that one entry SHALL name the action and the new user id, and
the creation SHALL NOT write an entry of its own. Only the test endpoint's own
workflow can make these writes, and it has no user id and holds no role, so the
entry SHALL name its kind, `test-endpoint-workflow`, in place of the actor's
user id and roles. The entry SHALL keep
the action, the subject's user id, whether it succeeded, and when — a refused
entry for an address that holds no account names no subject — and SHALL NOT
carry the token, the address, or an email. A ban, grant or scoped role the
endpoint refuses after its access check admitted the call SHALL be recorded as
refused. The access check is the caller, the environment's actions and, for
the QA token, its own three actions; a call it refuses SHALL NOT write an
entry. The daily cleanup that removes a generated plus-tag's account SHALL
record that deletion as any account deletion is, naming
`test-endpoint-cleanup` in place of the actor's user id. Capture, expire, and clear change no account and no role, so they
SHALL NOT write an entry. An action the trail cannot record SHALL NOT run, the
same as any identity write.

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
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the workflow grants `admin` to a tester address
- **THEN** the trail holds one entry naming `test-endpoint-workflow`, the grant, and the subject's user id
- **AND** the entry carries no email and no token

#### Scenario: shared-auth-audit-SC-41 - A test-endpoint scoped role is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the workflow sets a scoped role on a generated plus-tag
- **THEN** the trail holds one entry naming `test-endpoint-workflow`, the role, and the subject's user id

#### Scenario: shared-auth-audit-SC-42 - An account the test endpoint creates is on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **WHEN** a ban or a grant creates the account for an address that never signed in
- **THEN** the trail holds one entry, naming the caller's kind, the action, and the new user id
- **AND** no separate entry records the account's creation

#### Scenario: shared-auth-audit-SC-43 - A refused test-endpoint ban is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the test endpoint's workflow asks to ban an address that is not a tester and holds no account, and the endpoint refuses it
- **THEN** the trail holds one entry naming `test-endpoint-workflow`, the ban, and the refusal
- **AND** the entry names no subject and carries no address

#### Scenario: shared-auth-audit-SC-46 - A call the access check refuses writes no entry
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** a call carrying only the QA token asks to ban a tester address, and the endpoint refuses it
- **THEN** the trail holds no entry for the call

#### Scenario: shared-auth-audit-SC-47 - The cleanup's removal of a plus-tag account is on the trail
**Serves:** shared-auth-audit-US-04 - Auditor traces an account lifecycle write

- **GIVEN** a generated plus-tag whose account a staging run left behind
- **WHEN** the daily cleanup removes that account
- **THEN** the trail holds one deletion entry naming `test-endpoint-cleanup` and the removed user id
- **AND** the entry carries no email

#### Scenario: shared-auth-audit-SC-44 - A grant that changes nothing is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **GIVEN** an address that already holds `admin`
- **WHEN** the workflow grants `admin` again
- **THEN** the trail holds one entry for the grant, as the requirement states

#### Scenario: shared-auth-audit-SC-45 - Expire and clear write no entry
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the QA token expires a link or clears the sign-in limits
- **THEN** the trail holds no entry for the call

