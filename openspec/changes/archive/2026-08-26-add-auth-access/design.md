# Design: Who may act

Capability deltas:
[`shared-auth/roles`](specs/shared-auth/roles/spec.md),
[`shared-auth/users`](specs/shared-auth/users/spec.md),
[`shared-auth/sessions`](specs/shared-auth/sessions/spec.md),
[`shared-auth/audit`](specs/shared-auth/audit/spec.md).
Motivation: [proposal.md](proposal.md) — Why.

## Context

One identity worker per brand. Constraints: `docs/architecture/account-data.md`,
`docs/architecture/security.md`. Who a signed-in person is: `add-auth-session`.

## Goals / Non-Goals

- **Goal:** one permission vocabulary, both brands; a ban stops sign-in and
  money-moving; an operator can end another person's sessions.
- **Non-goal:** a second factor, passwords, deletion, timed bans — proposal
  Non-Goals.

## Decisions

### Grants live in one vocabulary, and the mapping is not data

Roles `user`, `staff`, `support`, `auditor`, `admin`. Products check a
permission, never a role name. An unknown permission name grants nothing.
Who holds a role is data; what a role grants is not. The operator directory
is `user:list` only. Listing a person's sessions is `session:list`; ending
them is `session:revoke`.

*Alternatives:* per-product role lists — rejected. Operators edit what a
role grants — rejected, a compromised admin would widen grants
(`security.md`).

### A ban is an account disable

A banned person cannot sign in, is not signed in, and cannot complete a
money-moving action. A ban lasts until an unban. A money-moving action
re-checks identity so a ban cannot be ignored. How that re-check is stored
is not part of the spec. The directory still lists a banned account so an
operator can unban it. Search is case-insensitive on email; an account
opens by user id.

*Alternatives:* money-moving only while they stay signed in — rejected, a
banned person is not signed in. A ban that expires on a clock — rejected, a
silent unban would fail the metric. Waiting for a cached read to expire —
rejected. Email as the directory key — rejected (`account-data.md`).

### An operator can end another person's sessions

Support lists one account's sessions by user id and revokes one or all of
them. The list does not include the secret that authenticates a session.
Sign-out of the current surface stays with `shared-auth/sign-out`. Support
cannot list or revoke an admin's sessions. Revoke is recorded; list is not.

*Alternatives:* only a ban ends sessions — rejected, a stolen device should
not disable the account. Returning the session secret to the operator —
rejected. Support revokes an admin — rejected, same door as banning an
admin.

### Operators cannot close the last door

An operator cannot ban themselves or change their own roles. Support cannot
ban an admin. The last remaining admin cannot be banned or lose `admin`.

*Alternatives:* support can ban anyone — rejected, a compromised support
account would lock every admin out. An operator demotes themselves —
rejected, that is a lockout. Removing the last admin through the directory
— rejected; the first admin is a one-time bootstrap (`security.md`).

### The identity trail is append-only and fail-closed

Ban, unban, set-role, and session revoke append to the identity trail. A
write that cannot land refuses the action. Details keep the operator's
reason and withhold secrets. Entries name people by user id, never email.
A consistency check reports yes or no and does not return the proof. How
the trail proves consistency is not part of the spec.

*Alternatives:* best-effort logging after the action — rejected, an
unrecorded ban is an unaccountable ban. Returning the proof to the reader
— rejected (`security.md`).

## Risks / Trade-offs

- **The operator library is wider than this spec** → impersonate,
  delete-user, and set-password stay off the console.

## Migration Plan

Roles and grants, then the users directory, sessions, and the trail, then
operator consoles, then a ban stops money-moving in every product.

## Open Questions

None.
