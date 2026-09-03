## User journeys

### auth-user-directory-US-01: Operator opens the identity directory

**As an** operator,
**I want** the table to offer only the moves my console permits,
**so that** a banned account offers unban, and an account's joined date is the one the console supplied.

**Accepted by:**

- `auth-user-directory-SC-01` — An application imports the directory
- `auth-user-directory-SC-02` — A console offers its own role vocabulary
- `auth-user-directory-SC-04` — An account joined on a given day
- `auth-user-directory-SC-05` — An operator without elevated grants opens the directory
- `auth-user-directory-SC-06` — A banned account is shown

### auth-user-directory-US-02: Operator confirms a change to an account

**As an** operator,
**I want** roles, standing, and sessions behind a confirmation that reports what I chose,
**so that** an empty role list is submitted empty, a session is named without its secret, and a reason is collected only when the move needs one.

**Accepted by:**

- `auth-user-directory-SC-03` — A selection is submitted
- `auth-user-directory-SC-07` — An operator reads where an account is signed in
- `auth-user-directory-SC-08` — An account holds no sessions
- `auth-user-directory-SC-09` — A move that collects a reason is confirmed
- `auth-user-directory-SC-10` — A move that collects no reason is confirmed
