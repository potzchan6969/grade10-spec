# Who may act

**Author:** @rita-liu - 2026-08-20

## Why

The operator who bans a collector sits in the same identity system as that
collector, yet who may grant what, how an operator lists or bans an
account, and how those actions are recorded have no contract. A ban that
still lets money move would not fail a spec.

**Metric:** banned collectors who still complete a money-moving action
stays at zero.

## What Changes

- Roles `user`, `staff`, `support`, `auditor`, and `admin`. Grants are
  checked by permission, never by role name at the call site. Who holds a
  role is data; what a role grants is not.
- Operators list and search people, ban and unban, and set roles. Search
  is case-insensitive on email; an account opens by user id. Auction
  bidder bans stay with auction.
- Operators list a person's sessions and revoke one or all of them. The
  list does not include the session secret. Support cannot list or revoke
  an admin's sessions. Sign-out of the current surface stays with
  `shared/auth/sign-out`.
- A ban lasts until an unban. The banned person cannot sign in, is not
  signed in, and cannot complete a money-moving action. Money-moving
  re-checks identity. An operator cannot ban themselves; support cannot
  ban an admin; the last admin cannot be banned or lose `admin`; an
  operator cannot change their own roles.
- Ban, unban, set-role, and session revoke are recorded. An entry names
  actor, subject, action, and whether it succeeded, by user id. It cannot
  be rewritten. A failed write stops the action. A consistency check is
  yes or no, not the proof.

## Related

| Owner | Governs |
| --- | --- |
| `add-auth-session` | Who a signed-in person is |
| `shared/auth/sign-out` | Ending the current surface's session |
| `shared/dates-and-times` | Audit entries ordered to the second |

## Non-Goals

- Who a signed-in person is, how they sign in — `add-auth-session`.
- Sign-out of the current surface — `shared/auth/sign-out`.
- A second factor.
- Account deletion, email change.
- Passwords, impersonation, operator-created passwords.
- A ban that expires on a clock.
- Store, auction, and loyalty trails — those products.

## Capabilities

### New Capabilities

- `shared/auth/roles`: roles and permission grants.
- `shared/auth/users`: the users directory — list, ban, unban, set-role.
- `shared/auth/sessions`: list and revoke a person's sessions.
- `shared/auth/audit`: the identity trail.

### Modified Capabilities

None.

## Impact

- Identity worker and admin panels of both brands.
- Every product worker: a ban stops money-moving.
- No new `@grade10/ui` export. No Figma or design-system change.
