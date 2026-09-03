## User journeys

### users-US-01: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

**Accepted by:**

- `users-SC-01` — An operator with the grant lists accounts
- `users-SC-02` — A caller without the grant is refused
- `users-SC-03` — Search matches email without letter case
- `users-SC-04` — An account opens by user id
- `users-SC-05` — A banned account stays in the directory

### users-US-02: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, and a mistaken ban is reversible.

**Accepted by:**

- `users-SC-06` — A ban stops money-moving
- `users-SC-07` — A banned person cannot sign in
- `users-SC-08` — A banned person is not signed in
- `users-SC-09` — An unban lets them sign in again
- `users-SC-10` — A caller who cannot ban is refused
- `users-SC-11` — An operator cannot ban themselves
- `users-SC-12` — Support cannot ban an admin
- `users-SC-13` — The last admin cannot be banned

### users-US-03: Operator changes another person's roles

**As an** admin,
**I want** to set another person's roles without changing my own or stranding the last admin,
**so that** grants stay a closed set I cannot widen from the call site.

**Accepted by:**

- `users-SC-14` — Admin changes another person's roles
- `users-SC-15` — Clearing operator roles leaves a user
- `users-SC-16` — Support cannot set roles
- `users-SC-17` — An operator cannot change their own roles
- `users-SC-18` — The last admin keeps admin
