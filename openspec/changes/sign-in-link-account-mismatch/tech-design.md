## Context

`shared/auth/sign-in`'s magic-link verify route already redirects a collector
to the brand home with a failure reason when a followed link cannot create a
session (expired, invalid, or banned), read before better-auth's magic-link
plugin ever consumes the token:

- `signInLinkFailure(db, token)` and `signInLinkFailureUrl(target, failure)`
  in `packages/grade10-auth/backend/src/signInLinkFollow.ts`
- the `before` hook's `SIGN_IN_LINK_FOLLOW_PATH` branch in
  `packages/grade10-auth/backend/src/securityHooks.ts`, which throws
  `ctx.redirect(...)` instead of letting better-auth run
- `SignInLinkFailure` in `packages/grade10-auth/contracts/src/signIn.ts`
- `SignInLinkFailure` (the component) in
  `apps/frontend/grade10/src/chrome/SignInLinkFailure.tsx`, mounted in
  `apps/frontend/grade10/src/root.tsx`, reading the reason once and firing
  `useAnnounceSignInLinkFailure`'s `toast.error`

This change is the same mechanism for a link that is otherwise valid but
followed while a *different* account's session is already active. It does
not touch grade10-admin, zzz-site, or zzz-admin; zzz-site does not mount the
sibling `SignInLinkFailure` component today either, so this keeps the same
scope.

## Goals / Non-Goals

**Goals:**
- Detect, before better-auth consumes the token, that a followed link's
  account differs from the signed-in session's account.
- Redirect to the brand home carrying what the client needs to show the
  choice and to complete Switch, without creating or ending any session
  server-side.
- Wire the warning toast (Switch / Stay / dismiss) from that redirect.

**Non-Goals:**
- Changing the expired/invalid/banned redirect or its precedence
  (`decisions.md`'s non-goal already rules this out).
- A new backend endpoint or a second one-time-credential type for Switch —
  see Decisions.
- zzz-site wiring, matching the existing failure-toast pattern's scope.

## Decisions

### Detection order: the existing failure check runs first, unchanged

`decisions.md`'s non-goal rules out changing expired/dead/banned toasts, so
the mismatch check only runs when `signInLinkFailure` finds nothing wrong. An
expired link followed by someone signed in as a different account still
shows "expired" — it never reaches the mismatch check. This is not a new
choice; it falls out of the existing non-goal, and closes the blind pass's
Raised question about which toast wins (`decisions.md` Q7).

### No consuming, no new credential — the token is untouched on a mismatch redirect

**Rejected alternative:** mint a short-lived "pending switch" token
server-side and add a dedicated `/sign-in/complete-switch` endpoint, so the
original magic-link token can be burned the moment it is read as a mismatch.
Rejected because it adds a second one-time-credential type and a new
authenticated endpoint for one edge case, with nothing in `decisions.md`
requiring early consumption, against the "deterministic, stateless" and
"reuse a mechanism" principles the sibling failure path already follows.

**Chosen:** on a mismatch, the `before` hook redirects to the brand home
without letting better-auth's magic-link plugin run at all — exactly as it
already does for expired/invalid/banned. The redirect carries the link's
email plus the original `token` and `callbackURL`.

- **Switch** replays the original link: the client signs out, then
  navigates the browser back to
  `${authApiUrl}/magic-link/verify?token=<preserved>&callbackURL=<preserved>`.
  With no session left, the same `before` hook finds no mismatch and
  better-auth completes the sign-in exactly as an ordinary follow does.
- **Stay or dismiss** does nothing further. The token is exactly as unused
  as before the follow and expires on its own schedule. This closes
  `decisions.md` Q8: the link is not consumed, because nothing in this
  design ever reads it as spent.
- **A second link followed while a toast is showing** replaces it: every
  follow is a full-page redirect to the brand home, so the previous page's
  toast state cannot survive to conflict with the new one. This closes
  `decisions.md` Q9.

### Detect by account, not by raw email string

`shared-auth-sign-in-SC-19` already requires letter-case addresses to be the
same account. Resolve the link's target the same way
`signInLinkFailure`'s banned check already resolves it (a `users` table
lookup), and compare the resulting account against `session.user.id` —
never a string compare of the two emails as submitted.

### Contract shape mirrors `SignInLinkFailure`

A parallel set of query params, distinct from `SIGN_IN_LINK_FAILURE_PARAM` so
the two redirects never collide, carrying the link's email and the two
values needed to retry it. Defined beside `SignInLinkFailure` in
`packages/grade10-auth/contracts/src/signIn.ts`, with the same
encode/decode-at-the-edge shape that contract already uses.

## Service Interfaces

- `signInLinkFollow.ts` gains one read shared by both checks instead of two
  separate token reads: resolve the verification row once, answer the
  existing `SignInLinkFailure | null`, and — only when that is `null` —
  also hand back the row's resolved account, so the `before` hook has both
  answers from one query.
- The `before` hook's existing `SIGN_IN_LINK_FOLLOW_PATH` branch grows one
  more case: when the failure check passes and a session is present
  (`getSessionFromCtx(ctx)`, already used elsewhere in this hook) whose
  account differs from the link's resolved account, redirect with the
  mismatch params instead of falling through to better-auth.

## API Contracts

The `/magic-link/verify` redirect to the brand home gains a second, additive
shape beside the existing `?error=link_expired|link_invalid|link_banned`:
`?mismatch=<email>&token=<preserved>&callbackURL=<preserved>` — new query
params only, the existing failure shape and the ordinary success path are
unchanged.

## Risks / Trade-offs

- [Risk] The mismatch redirect's query string carries the original token in
  plaintext (browser URL, history, referrer). → Mitigation: identical
  exposure already exists for the emailed link itself, which carries the
  same token; the redirect target is same-origin, and the token is still
  bound to its original five-minute TTL and single-use consumption, so a
  captured redirect URL grants no more than the captured original link
  already did.
- [Risk] A collector replays the mismatch redirect URL after Switching once.
  → Mitigation: none needed beyond the token's own TTL and better-auth's
  existing single-use enforcement — a replay either signs them in again
  (still unused, still valid) or hits the existing expired/invalid checks,
  exactly as replaying the original email link does today.

## Migration Plan

No data migration. `packages/i18n`'s new catalog keys land in `grade10-spec`
first; `grade10` bumps the submodule pin before the contracts, backend and
frontend groups, which are additive only — no breaking change to
`/magic-link/verify`'s existing behaviour for a signed-out collector.
