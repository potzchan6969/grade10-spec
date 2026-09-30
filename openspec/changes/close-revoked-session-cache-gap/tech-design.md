## Context

`packages/grade10-auth/backend/src/createAuth.ts` (grade10) enables
better-auth's `session.cookieCache` (`maxAge: 5 * 60`). While a request's
signed `session_data` cookie is within that window, better-auth answers
straight from the cookie payload — no KV or Postgres read at all
(`better-auth/dist/api/routes/session.mjs`). The admin mutations that should
end that answer — `/admin/ban-user`, `/admin/revoke-user-session(s)`,
`/admin/set-role` — go through `securityHooks.ts`'s `before`/`after` hooks
and better-auth's admin plugin, which deletes the session's KV entry or
rewrites every session entry of the account (`refreshUserSessions`), but
never touches the cookie cache.

better-auth's `cookieCache.version` option runs on every cached read and at
cache-mint time, taking the cached `(session, user)` and returning a string.
A mismatch against the version baked into the cookie falls through to
`findSession` — a KV read — and, when the session is still there, re-mints
the cookie with the version current at that moment.

Sessions live in edge KV (`secondaryStorage.ts`). A write is visible at once
where it was made and within 60 seconds elsewhere
(`docs/architecture/edge-cache.md`). The admin who acts and the person whose
session it is are usually at different locations.

## Goals / Non-Goals

**Goals:**
- A cached read compares the cookie's baked-in version with a cheap lookup,
  so a version bumped after the cookie was minted is caught on that
  location's next request.
- Every location converges within 70 seconds (`decisions.md` Q5), including
  one that sees the new version before it sees the change itself.
- One mechanism covers ban, revoke (single or every session), and set-role.

**Non-Goals:** as `decisions.md` already states — no change to `maxAge`, no
per-session invalidation, no account-deletion wiring, no sessions off KV.

## Decisions

**A per-user, opaque version token in KV, stamped with when it was bumped.**

- `secondaryStorage.ts` gains `bumpSessionVersion(storage, userId)`, which
  writes `session-version:<userId>` as `{ token: crypto.randomUUID(),
  bumpedAt }`, and `currentSessionVersion(storage, userId)`, which reads it,
  defaulting to `"0"` when unset. **Rejected: a numeric counter** — KV has no
  atomic increment, and the check is equality, never ordering.
- **Keyed by user, not by session.** Revoking one session revalidates every
  session of that account. **Rejected: a per-session version** — a key per
  session for a cost that is already harmless: a sibling session is still
  valid, so it still answers signed in, through one fresh check
  (`shared-auth-sessions-SC-09`).
- `createAuth.ts` wires `session.cookieCache.version` to
  `currentSessionVersion`.

**Bump in the `after` hook, once the mutation succeeded, with the target
resolved in `before`.**

`before` already resolves the target `userId` for all four paths:
`body.userId` for `ban-user`, `revoke-user-sessions` and `set-role`;
`userIdForSessionToken` for `revoke-user-session`. It holds that id in a
per-request slot inside `createSecurityHooks`, and `after` bumps it when
the call did not fail. `createAuth()` runs once per request, so the slot is
this request's alone — the same invariant `sentWatchId` already relies on
between `sendMagicLink` and `after`.

**Rejected: bump in `before`.** It opens a race: a read landing between the
bump and the mutation falls through on the new version, finds the session
still as it was, and re-mints the cookie with the new version and the old
data. Once the mutation completes, that cookie matches and is trusted for
the rest of the five minutes (code review on grade10#705). Bumping only
after a successful mutation also means a request better-auth refuses —
last admin, peer admin, self-ban — bumps nothing.

**Rejected: resolving the target in `after`.** `revoke-user-session`
deletes the session's KV entry and its `id:<sessionId>` pointer inside the
endpoint, so there is nothing left to resolve by then. **Rejected: carrying
it on the rewritten body** — better-auth's zod parse strips unknown keys.

**For 70 seconds after a bump, the version rotates every 10 seconds.**

`currentSessionVersion` returns `<token>.<floor(now / 10s)>` while
`now - bumpedAt < 70s`, and `<token>` after. A location that sees the new
version before the change itself has reached its copy of the session
re-mints stale data — but under a version that expires with its 10-second
bucket. The session store settles within 60 seconds, so any mint after that
reads the change, and at 70 seconds the version drops its bucket and every
cookie minted in between revalidates once more.

**Rejected: the invalidation signal in Postgres.** It puts identity
Postgres back on every cached read, which `edge-cache.md` keeps off the
per-request path, and does not close the window: revalidation still reads
the session from KV, so a location with the new signal and an old session
entry re-caches stale data under the new version. **Rejected: re-bumping
once KV has settled** — it needs a scheduler (an alarm, a delayed queue
message) for what a time bucket in the version gives statelessly.

## Risks / Trade-offs

- **Every cached read now costs one extra KV get** (the version check), for
  every account → a single keyed lookup, not a session refetch; the fresh
  read stays off every account an admin did not touch.
- **An account an admin just acted on revalidates up to every 10 seconds
  for 70 seconds** → bounded to that one account, once per action.
- **The 70-second bound rests on KV's documented 60-second propagation** →
  it is the same bound every KV-backed session read already carries,
  money-moving fresh reads included. A slower propagation stretches it the
  same way it stretches theirs.
- **Clock skew between locations moves a bucket boundary** → a mismatch
  only ever forces a revalidation, never trusts a stale cookie.
- **A failed bump after a committed mutation** throws from `after`, so the
  admin sees an error for an action that took effect → every one of the
  four actions is idempotent, so the retry bumps; the failure is loud rather
  than a silently reopened five-minute window.

## Migration Plan

No schema or data migration. The version key is created lazily on first
bump, with a 30-day TTL — past the 7-day session lifetime. Ship the
`cookieCache.version` wiring and the four bump call sites in one deploy.
Correct `docs/architecture/edge-cache.md` and `docs/architecture/security.md`
(grade10) in the same pull request: both describe the five-minute browse
window as what a ban leaves open.
