## User journeys

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
