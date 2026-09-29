**Author:** @rita-liu - 2026-09-24

## Why

An operator who needs an elevated account for someone who has never signed in
has no production path on Users. The archived access-desk change
(`focus-the-user-directory-on-access`) ruled create out — "Creating an account
here; provisioning stays where it is" — so Override's Create user and member
remains the only create surface, and it is a non-prod loyalty provision (Auth +
enroll + opening points), not the access desk.

Ordinary account creation is Auth-only. Granting an elevated role afterwards is
set-role. Production Users should offer that same pair for someone who has never
signed in: create the Auth row with name, email, and roles, then open the
account — without Loyalty enroll, opening points, invite mail, or a password.

**BREAKING** against the archived non-goal: create lands on the Users access
desk. Override stays for non-prod loyalty provisioning.

**Metrics:** elevated accounts that must wait for a first self-serve sign-in
before an operator can grant roles — expected to drop; Override create used for
production Auth-only access — expected to drop.

## What Changes

- An operator holding `user:create` can create a passwordless Auth account from
  Grade10 Users — name, email, and roles from the closed set, elevated roles
  included — for someone who has never signed in.
- Create is offered only with `user:create`. Choosing a non-`user` role also
  requires `user:set-role`.
- A duplicate email is refused, with a way to open the existing account.
- After success, the new account's panel opens.
- A slim Auth-only create dialog (name, email, role) — not a mode flag on
  Override's `CreateMemberDialog`.
- Silent, passwordless create — no invite or magic-link email, no password
  field.
- Shared Auth rules and shared directory components grow as needed; Grade10
  wires the page. ZZZ is not wired in this change.

## Non-Goals

See [decisions.md](./decisions.md).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/auth/users`: an operator holding `user:create` may create a
  passwordless Auth account with name, email, and roles from the closed set;
  duplicate email refused; non-`user` roles also require `user:set-role`; no
  loyalty enroll or invite mail.
- `grade10-admin/console/user-directory`: Users offers Create when the session
  holds `user:create`; success opens the new account's panel; duplicate email
  offers a way to open the existing account.
- `shared/console/user-directory`: create is handler-gated; the create dialog
  collects name, email, and roles from console-supplied vocabulary; success
  reports the created account for the console to open.

**Depends on** `fix-roles-spec-divergence`, which already names `user:create`
in the user resource vocabulary. This change uses that grant and does not
restate the roles table.

**Coexists with** `keep-suspended-bidder-standing-bids`, which also modifies
`grade10-admin/console/user-directory` and `shared/console/user-directory`
(auction suspend / reinstate). Do not double those requirements; journey ids on
the admin page continue from `US-04` so they do not collide with that change's
`US-03`.

**Reverses** the archived non-goal from `focus-the-user-directory-on-access`:
creating an account on Users.

## Impact

- **Admin console:** Grade10 Users gains Create and a slim create dialog;
  server checks `user:create` (and `user:set-role` when a non-`user` role is
  chosen).
- **Auth:** passwordless `createUser` with roles; no invite send on create.
- **Component exports:** shared directory components may gain a create dialog
  and a create handler; Override's `CreateMemberDialog` is unchanged.
- **Consumer apps:** `grade10-admin` wires create. `zzz-admin` needs no change
  in this change — it supplies no create handler until it chooses.
- **Loyalty / Override:** untouched.

## Open Questions

None.

## References

- [Users (access desk) · Create Account](../../../docs/prds/products/grade10-admin/console/user-directory.md#create-account)
- [Users · Create Account](../../../docs/prds/products/shared/auth/users.md#create-account)
- [User Directory · Moves](../../../docs/prds/products/shared/console/user-directory.md#moves)
