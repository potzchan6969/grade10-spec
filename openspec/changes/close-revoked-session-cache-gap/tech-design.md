## Context

`packages/grade10-auth/backend/src/createAuth.ts` (grade10) enables
better-auth's `session.cookieCache` (`maxAge: 5 * 60`) with no `version`
configured. While a request's signed `session_data` cookie is within that
window, better-auth answers straight from the cookie payload — no KV or
Postgres read at all (`better-auth/dist/api/routes/session.mjs`,
`cookies/index.mjs`). The admin mutations that should end that answer —
`/admin/ban-user`, `/admin/revoke-user-session(s)`, `/admin/set-role` — go
through `securityHooks.ts`'s `before`/`after` hooks and better-auth's own
admin plugin, which deletes the session's KV row (`internalAdapter.deleteSession`)
or updates the user row, but never touches the cookie cache. The two settled
requirements this closes: `shared/auth/sessions`, revoke; `shared/auth/users`,
ban and set-role — all in the spec's `## MODIFIED Requirements`.

better-auth's `cookieCache.version` option is unused today. It runs on every
cached read (`cookies/index.mjs`) and at cache-mint time
(`api/routes/session.mjs`), taking the cached `(session, user)` and returning
a string; a mismatch against what is baked into the cookie forces a real
`getSession` — KV, then Postgres if needed — instead of answering from the
cookie.

## Goals / Non-Goals

**Goals:**
- A cached read answers the cookie's baked-in version against a fresh,
  cheap lookup, so a version bumped after the cookie was minted is caught on
  the very next request.
- One mechanism covers ban, revoke (single or every session), and set-role.

**Non-Goals:** as `decisions.md` already states — no change to `maxAge`, no
per-session invalidation granularity, no account-deletion wiring in this
change.

## Decisions

**A per-user, opaque version token in KV — not a numeric counter, not a
per-session key.**

- `packages/grade10-auth/backend/src/secondaryStorage.ts` gains two
  functions: `bumpSessionVersion(storage, userId)` writes
  `session-version:<userId>` to a fresh `crypto.randomUUID()`; **rejected:
  a numeric counter** — Cloudflare KV has no atomic increment, and an opaque
  token needs none: the check is equality, not ordering.
- `currentSessionVersion(storage, userId)` reads that key, defaulting to a
  constant (`"0"`) when unset, so an account nobody has ever banned/revoked/
  set-role'd mints its first cookie against the same default every time.
- **Keyed by user, not by session.** Revoking one session of an account
  bumps every session's cache for that account. **Rejected: a per-session
  version** — it would need its own key per session, doubling the surface
  for one mechanism, for a cost that is already harmless: a sibling session
  forced to revalidate is still genuinely valid, so it still answers signed
  in — just via a fresh check instead of the cookie, once
  (`shared-auth-sessions-SC-09`).
- `createAuth.ts` wires
  `session.cookieCache.version: (session, user) => currentSessionVersion(secondaryStorage, user.id)`.

**Bump in the `before` hook, right after the permission check passes — not
in `after`, and not by threading a value between them.**

`securityHooks.ts`'s `before` hook already resolves the target `userId` for
all four paths before it authorizes the call: `body.userId` directly for
`/admin/ban-user`, `/admin/revoke-user-sessions`, `/admin/set-role`; via
`userIdForSessionToken` for `/admin/revoke-user-session` (the single-session
path, resolving the list's id to the real token). Bump there, once the
`FAIL_CLOSED_PERMISSION` grant check passes.

**Rejected: bump in the `after` hook**, gated on `!failed`, closer to how
audit logging already works there. Two reasons it does not survive:
- `/admin/revoke-user-session` deletes the session's KV row — and, in
  `secondaryStorage.ts`'s wrapped `delete()`, the `id:<sessionId>` pointer
  alongside it — inside the endpoint call itself. By the time `after` runs,
  `userIdForSessionToken` can no longer resolve anything: the very data
  needed to know who to bump is already gone.
- Passing the resolved `userId` forward by stashing an extra field on the
  rewritten body does not survive better-auth's own zod parsing of that
  body inside the endpoint, which strips unknown keys by default.

Bumping in `before`, before better-auth's own business-rule refusals run
(last admin, peer admin, self-ban), means a request refused for one of
those reasons still bumps its target's version. Accepted: a spurious bump
costs one harmless extra fresh check on that account's next request: no
data exposure, no incorrect access, and no decided requirement promises an
untouched account's cache stays untouched by an *attempted* action.

## Risks / Trade-offs

- **Every cached read now costs one extra KV get** (the version check),
  even for an account nobody has touched → a single small keyed lookup, not
  a session refetch; this is the "existing cost" `decisions.md`'s goals
  refer to, not the fresh-read cost this change deliberately keeps off
  every other account.
- **KV's own propagation window** (`docs/architecture/edge-cache.md`: ≤60s
  across colos) still applies to the version key itself → accepted; this
  change closes the cookie-cache gap specifically, not KV's general
  eventual consistency, which the store has already priced elsewhere.
- **A spurious bump on a refused admin action** (see Decisions) → accepted
  as harmless; not mitigated further.

## Migration Plan

No schema or data migration. The version key is created lazily on first
bump; an account with no key reads the shared default. Ship the
`cookieCache.version` wiring and the four bump call sites in the same
deploy — either alone is a no-op, and there is no meaningful intermediate
state to stage.

## Open Questions

- Exact TTL on the `session-version:<userId>` KV key (a working default:
  30 days, comfortably past the 7-day session lifetime) — does not change
  the approach or the tasks below.
