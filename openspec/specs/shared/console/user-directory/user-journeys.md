## User journeys

### shared-console-user-directory-US-01: Operator moderates an account from the directory

**As an** operator
**I want** to change an account's roles or standing through a confirmation that speaks my console's words
**so that** every change is deliberate and my console's own vocabulary is what I act in.

**Accepted by:**

- `shared-console-user-directory-SC-02` — A console offers its own role vocabulary
- `shared-console-user-directory-SC-03` — A selection is submitted
- `shared-console-user-directory-SC-05` — An operator without elevated grants opens the directory
- `shared-console-user-directory-SC-06` — A banned account is shown
- `shared-console-user-directory-SC-09` — A move that collects a reason is confirmed
- `shared-console-user-directory-SC-10` — A move that collects no reason is confirmed

### shared-console-user-directory-US-02: Operator reviews where an account is signed in

**As an** operator
**I want** to see and end an account's sessions without ever seeing what authenticates them
**so that** I can act on a compromised account without the console itself becoming the leak.

**Accepted by:**

- `shared-console-user-directory-SC-07` — An operator reads where an account is signed in
- `shared-console-user-directory-SC-08` — An account holds no sessions

### shared-console-user-directory-US-03: Operator opens a role from the account

**As an** operator,
**I want** a role name on the open account to open that role on the grants page
when the console supplies an address,
**so that** I move from who holds a role to what it can do without the list
navigating away when I meant to open the account.

**Accepted by:**

- `shared-console-user-directory-SC-11` — A role name on the account opens its address
- `shared-console-user-directory-SC-12` — The directory's Roles cell is never a link
- `shared-console-user-directory-SC-13` — Roles without addresses stay plain

### shared-console-user-directory-US-04: Operator reads one account beside the directory

**As an** operator,
**I want** an account's identity and actions, the grants it holds, when it
joined, and where it is signed in to open together beside the list,
**so that** I judge the account from one reading instead of three
confirmations that never meet.

**Accepted by:**

- `shared-console-user-directory-SC-15` — A row opens its account
- `shared-console-user-directory-SC-16` — A session says where it was raised
- `shared-console-user-directory-SC-17` — An operator reads one account whole
- `shared-console-user-directory-SC-20` — The grants an account holds are shown
- `shared-console-user-directory-SC-21` — A grant is not a link
- `shared-console-user-directory-SC-22` — An account holds no grants
- `shared-console-user-directory-SC-26` — A banned account says why
- `shared-console-user-directory-SC-27` — Timeline milestones are shown as supplied
- `shared-console-user-directory-SC-23` — A console supplies the filter words
- `shared-console-user-directory-SC-24` — An operator clears Status or Email
- `shared-console-user-directory-SC-28` — Roles is locked under Users

### shared-console-user-directory-US-05: Operator changes an account's access from the panel

**As an** operator,
**I want** to change roles where I read the account, and still be stopped for
a confirmation on a move I cannot undo,
**so that** an ordinary change costs one step and a ban never happens by
accident.

**Accepted by:**

- `shared-console-user-directory-SC-14` — A console withholds sessions and moderation
- `shared-console-user-directory-SC-18` — Roles are saved from the panel
- `shared-console-user-directory-SC-19` — A ban started in the panel is confirmed outside it
- `shared-console-user-directory-SC-29` — Roles stay blocked when the console marks them
