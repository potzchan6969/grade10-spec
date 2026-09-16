## User journeys

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

### shared-auth-users-US-02: Operator bans and unbans an account

**As an** operator who can ban,
**I want** a ban to stop money-moving and sign-in without locking peer admins out,
**so that** standing moves stay safe when the actor also holds `admin`.

**Accepted by:**

- `shared-auth-users-SC-25` — An admin cannot ban another admin

### shared-auth-users-US-03: Operator changes roles

**As an** admin,
**I want** to set roles on any account I can open — including my own — and to
strip my own `admin` when another admin remains, without stripping `admin`
from a peer,
**so that** peer lockout does not happen from the console.

**Accepted by:**

- `shared-auth-users-SC-17` — An operator may change their own roles
- `shared-auth-users-SC-26` — An admin cannot remove admin from another admin
- `shared-auth-users-SC-27` — An admin may strip their own admin
