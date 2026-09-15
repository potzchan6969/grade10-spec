## User journeys

### shared-auth-users-US-01: Operator lists people in the identity directory

**As an** operator who can list users,
**I want** to search and open accounts by user id,
**so that** I can find a person without seeing records I am not granted.

**Accepted by:**

- `shared-auth-users-SC-01` — An operator with the grant lists accounts
- `shared-auth-users-SC-02` — A caller without the grant is refused
- `shared-auth-users-SC-03` — Search matches email without letter case
- `shared-auth-users-SC-04` — An account opens by user id
- `shared-auth-users-SC-05` — A banned account stays in the directory

### shared-auth-users-US-02: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in, and an unban to restore them,
**so that** a person who must leave cannot keep acting, a mistaken ban is
reversible, and a compromised admin cannot lock peer admins out by ban.

**Accepted by:**

- `shared-auth-users-SC-06` — A ban stops money-moving
- `shared-auth-users-SC-07` — A banned person cannot sign in
- `shared-auth-users-SC-08` — A banned person is not signed in
- `shared-auth-users-SC-09` — An unban lets them sign in again
- `shared-auth-users-SC-10` — A caller who cannot ban is refused
- `shared-auth-users-SC-11` — An operator cannot ban themselves
- `shared-auth-users-SC-12` — Support cannot ban an admin
- `shared-auth-users-SC-13` — The last admin cannot be banned
- `shared-auth-users-SC-25` — An admin cannot ban another admin

### shared-auth-users-US-03: Operator changes roles

**As an** admin,
**I want** to set roles on any account I can open — including my own — and to
strip my own `admin` when another admin remains, without stripping `admin`
from a peer,
**so that** ordinary grants and cooperative offboarding stay in the console and
peer lockout does not.

**Accepted by:**

- `shared-auth-users-SC-14` — Admin changes another person's roles
- `shared-auth-users-SC-15` — Clearing operator roles leaves a user
- `shared-auth-users-SC-16` — Support cannot set roles
- `shared-auth-users-SC-17` — An operator may change their own roles
- `shared-auth-users-SC-18` — The last admin keeps admin
- `shared-auth-users-SC-26` — An admin cannot remove admin from another admin
- `shared-auth-users-SC-27` — An admin may strip their own admin

### shared-auth-users-US-04: Operator finds the accounts they mean

**As an** operator who can list users,
**I want** to search by the name I was given and narrow the directory to the
accounts I mean,
**so that** I can reach one person from a ticket, and answer who holds a role,
without reading every account.

**Accepted by:**

- `shared-auth-users-SC-19` — Search matches a name without letter case
- `shared-auth-users-SC-20` — The directory narrows to a role
- `shared-auth-users-SC-21` — Two narrowings apply together
- `shared-auth-users-SC-22` — The caller asks for an order
- `shared-auth-users-SC-23` — The directory narrows to elevated accounts
- `shared-auth-users-SC-24` — The directory narrows to users without elevated roles
