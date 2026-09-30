## 1. Close the session-cache gap on revoke, ban, and set-role (grade10) (owner: @sean)

- [x] 1.1 Write the regression tests: a revoked session's next ordinary read
  reports no person even with a warmed cookie cache, and a sibling session
  it did not name stays signed in (`shared-auth-sessions-SC-09`); a banned
  account's next read closes the same way (`shared-auth-users-SC-34`); a
  role change reflects on the next ordinary read (`shared-auth-users-SC-35`);
  and a unit test on the per-user version helper proving a bump for one user
  never changes another user's current version (the cross-account isolation
  case named `**Out of suite:**` in `specs/shared/auth/sessions/feature-tcs.md`
  and `specs/shared/auth/users/feature-tcs.md`)
- [x] 1.2 Add `bumpSessionVersion` and `currentSessionVersion` to
  `packages/grade10-auth/backend/src/secondaryStorage.ts` (an opaque
  per-user token, not a counter — `tech-design.md`); wire
  `session.cookieCache.version` to `currentSessionVersion` in
  `packages/grade10-auth/backend/src/createAuth.ts`; call
  `bumpSessionVersion` from `securityHooks.ts`'s `before` hook, once the
  permission check passes, for `/admin/ban-user`, `/admin/revoke-user-session`,
  `/admin/revoke-user-sessions`, and `/admin/set-role` — making
  `shared-auth-sessions-SC-09`, `shared-auth-users-SC-34`, and
  `shared-auth-users-SC-35` pass
- [x] 1.3 Verify: `pnpm --filter @grade10/auth-backend exec vitest run`,
  `pnpm run typecheck --all`, `pnpm run lint`

## 2. The walk (grade10-spec) (owner: @sean)

Needs `feature-tcs.md` reviewed (`/tcs-review close-revoked-session-cache-gap`)
as its input, and group 1 landed.

- [x] 2.1 Walk `shared-auth-sessions-US-02` (revoke) and `shared-auth-users-US-02`
  (ban) and `shared-auth-users-US-03` (role changes) end to end through the
  admin console, each with a browse read on the collector site warmed
  beforehand, confirming the next read closes without waiting on the
  five-minute cache
- [ ] 2.2 Flip the cases the walks decide with
  `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walks'
  own commit; name any case that stays manual in the suite and in the
  walk's `rounds.md` row
- [ ] 2.3 Verify: `pnpm run tcs:validate`, `pnpm run validate:changes close-revoked-session-cache-gap`

## 3. Bound the close to 70 seconds everywhere (grade10) (owner: @sean)

Code review on grade10#705 found group 1's `before`-hook bump racy and its
"next read" unreachable beyond the location that made the change;
`decisions.md` Q5 and `tech-design.md` hold the revised design.

- [x] 3.1 Write the regression tests: a read landing between the admin
  call's authorization and its mutation must not leave a cookie that is
  still trusted after the mutation, for `revoke-user-session`, `ban-user`
  and `set-role` (`shared-auth-sessions-SC-09`, `shared-auth-users-SC-34`,
  `shared-auth-users-SC-35`); and a unit test on the version helper that,
  for 70 seconds after a bump, the version changes every 10 seconds, and
  after that it holds still (the 70-second bound named `**Out of suite:**`
  in both feature suites)
- [x] 3.2 Move the bump into `securityHooks.ts`'s `after` hook, only when
  the call succeeded, carrying the target resolved in `before` through a
  per-request slot; store `{ token, bumpedAt }` and rotate the version per
  10-second bucket for 70 seconds after a bump — making the 3.1 tests pass
- [x] 3.3 Correct `docs/architecture/edge-cache.md` and
  `docs/architecture/security.md`: an admin ban, revoke or role change now
  reaches a cached read within 70 seconds, not after the cookie cache's five
  minutes
- [x] 3.4 Verify: `pnpm --filter @grade10/auth-backend exec vitest run`,
  `pnpm --filter @grade10/auth-worker exec vitest run`,
  `pnpm run typecheck --all`, `pnpm run lint`, and the affected isolated
  E2E files (`e2e/tests/auth/sessions.spec.ts`, `e2e/tests/auth/users.spec.ts`)
