## User journeys

### shared-auth-sessions-US-01: Operator lists a person's sessions

**As an** operator who can list sessions,
**I want** to see one account's sessions without their secrets,
**so that** I can tell which device is signed in without becoming that person.

**Accepted by:**

- `shared-auth-sessions-SC-01` — An operator with the grant lists one person's sessions
- `shared-auth-sessions-SC-02` — A caller without the grant is refused
- `shared-auth-sessions-SC-03` — Support cannot list an admin's sessions

### shared-auth-sessions-US-02: Operator ends a session

**As an** operator who can revoke,
**I want** to end one session or every session of an account,
**so that** a stolen device is signed out, including my own if I revoke the current one.

**Accepted by:**

- `shared-auth-sessions-SC-04` — A revoked session is not signed in
- `shared-auth-sessions-SC-05` — Every session of an account can be revoked
- `shared-auth-sessions-SC-06` — A caller who cannot revoke is refused
- `shared-auth-sessions-SC-07` — Support cannot revoke an admin's session
- `shared-auth-sessions-SC-08` — Revoking the current session signs the operator out
