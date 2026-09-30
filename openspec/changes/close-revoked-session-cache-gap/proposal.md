**Author:** @sean - 2026-09-30

## Why

An operator revokes a session, bans an account, or changes a role expecting
it to act now. Reproduced live: revoking a session from the admin panel left
the browser holding it signed in and working normally for close to five
minutes. `shared/auth/sessions` and `shared/auth/users` already state this
flat, with no carve-out — a revoked session, and a banned account, SHALL NOT
be treated as signed in — but an ordinary browse read still answers from a
five-minute signed cookie cache that no admin action invalidates. Only a
mutation or an elevated call re-reads fresh today.

**Metric:** time between an admin's revoke, ban, or role change and the next
read (of any kind) no longer reflecting the old state — from up to ~5 minutes
today to no more than the next request.

## What Changes

- A revoked session's next read, browse or otherwise, no longer answers
  signed in. **BREAKING** — `docs/architecture/edge-cache.md` and
  `security.md` (grade10) currently document this five-minute browse-read
  window for sessions as accepted; this change closes it instead of keeping
  it.
- A banned account's next read, browse or otherwise, no longer answers
  signed in — the same closing, for the same reason.
- A role change's next ordinary (non-elevated) read reflects the new roles,
  matching what an elevated call already does.
- Every other caller's browse reads keep riding the fast cached path
  untouched — the closing is scoped to the account an admin action just
  touched, not a change to the cache's lifetime for anyone else.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shared/auth/sessions`: a revoked session closes on the next read, not
  only a mutation or an elevated call
- `shared/auth/users`: a ban, and a role change, close on the next read, not
  only a mutation or an elevated call

## Impact

- `packages/grade10-auth/backend/src/createAuth.ts` (grade10) — wires
  `session.cookieCache.version` to a per-user check, currently unset
- `packages/grade10-auth/backend/src/securityHooks.ts` (grade10) — the admin
  mutations (`ban-user`, `unban-user`, `revoke-user-session(s)`,
  `set-role`) that must invalidate it
- `packages/grade10-auth/backend/src/secondaryStorage.ts` (grade10) — where
  the per-user counter lives
- `docs/architecture/edge-cache.md`, `docs/architecture/security.md`
  (grade10) — correct the accepted-lag framing for these four actions

## Domain impact

No domain impact: `shared/auth/domain-tcs.md`'s `shared-auth-e2e-US3-TC1-1`
(ban) and `shared-auth-e2e-US4-TC1-1` (revoke) already walk the actions this
change tightens end to end; the new feature-level cases pin the cache-closing
timing precisely, and the domain smoke pass does not need its own edit for
that precision.

## References

- [Sessions · Revoke](../../../docs/prds/products/shared/auth/sessions.md#revoke)
- [Users · Ban and Unban](../../../docs/prds/products/shared/auth/users.md#ban-and-unban)
- [Users · Role Changes](../../../docs/prds/products/shared/auth/users.md#role-changes)

## Follow-on changes

- Account deletion shares the same stale-browse-read gap and could get the
  same closing once deletion is written down as a `shared/auth` capability
  in its own right — it is not specified as one today.
