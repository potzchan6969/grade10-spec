## User journeys

### audit-US-01: Operator's identity action is recorded

**As an** operator,
**I want** a ban, unban, set-role, or revoke — including a refusal — on the identity trail,
**so that** a dispute can name who did what, by user id, without secrets.

**Accepted by:**

- `audit-SC-01` — A ban is on the trail
- `audit-SC-02` — A refused ban is on the trail
- `audit-SC-03` — A revoke is on the trail
- `audit-SC-04` — A trail entry names people by user id
- `audit-SC-08` — A ban reason is on the trail
- `audit-SC-09` — Secrets stay off the trail
- `audit-SC-12` — A directory list is not on the trail
- `audit-SC-13` — A session list is not on the trail

### audit-US-02: Auditor reads the identity trail

**As an** auditor,
**I want** to read the trail and check it is consistent,
**so that** I can answer whether the record holds without being shown the proof.

**Accepted by:**

- `audit-SC-05` — An auditor can read the trail
- `audit-SC-06` — An auditor can check the trail is consistent
- `audit-SC-07` — A caller without audit read is refused

### audit-US-03: Operator cannot act off the trail

**As an** operator,
**I want** an action that cannot be recorded to be refused,
**so that** the trail is not a best-effort log of what already happened.

**Accepted by:**

- `audit-SC-10` — An entry cannot be rewritten
- `audit-SC-11` — An unrecorded action does not run
- `audit-SC-14` — An unrecorded revoke does not run
