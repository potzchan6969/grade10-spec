# shared/auth/audit Specification

## ADDED Requirements

### Requirement: The test door's identity writes are on the trail

A ban, a prepare, a scoped-role grant, and the creation of an account the door
makes for an address that never signed in SHALL each be recorded on the
identity audit trail, the same as the operator's own identity writes. The
door has no user id, so its entry SHALL name the caller's kind in place of an
actor's user id: `test-door-workflow` for the door's own workflow, or
`test-door-qa-token` for the QA agent. The entry SHALL keep the move, the
subject's user id, whether it succeeded, and when, and SHALL NOT carry the
token, the address, or an email. Capture, age, and clear change no account
and no role, so they SHALL NOT write an entry. A move the trail cannot record
SHALL NOT run, the same as any identity write.

#### Scenario: shared-auth-audit-SC-38 - A test-door ban is on the trail
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the door's workflow bans a tester address
- **THEN** the trail holds one entry naming `test-door-workflow`, the ban, and the subject's user id
- **AND** the entry carries no email and no token

#### Scenario: shared-auth-audit-SC-39 - A capture writes no entry
**Serves:** shared-auth-audit-US-01 - Operator's identity action is recorded

- **WHEN** the QA token captures a tester's last sign-in mail
- **THEN** the trail holds no entry for the call
