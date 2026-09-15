# Tasks

Groups 2 and 3 are claimable once group 1 lands; they do not need each
other. Group 4 needs groups 2 and 3. Group 5 is the store's manual and can
land in parallel with implementation. Frontend groups run against contracts
and fixtures, never a running backend. Design decisions:
[`tech-design.md`](tech-design.md).

## 1. Directory list contract (grade10) (owner: @rita-liu)

- [x] 1.1 Add `users.listDirectory` input and success shapes (query, roles,
  status, email, order, limit, offset → users + total) on the auth contracts
  / tRPC router types so `shared-auth-users-SC-19`–`SC-24` are expressible on
  the wire
- [x] 1.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` on
  `@grade10/auth-contracts`

## 2. Directory list read (grade10) (owner: @rita-liu)

Needs group 1 landed.

- [x] 2.1 Implement `users.listDirectory` (elevated `user:list`): name or email
  match without letter case, id open, AND of role / status / verification
  filters, requested order with newest-first default
  (`shared-auth-users-SC-03`, `SC-04`, `SC-19`, `SC-20`, `SC-21`, `SC-22`,
  `SC-23`, `SC-24`; multi-role token match covered in repository tests)
- [x] 2.2 Refuse callers without `user:list` and return no rows
  (`shared-auth-users-SC-02`); keep banned accounts in results
  (`shared-auth-users-SC-05`)
- [x] 2.3 Verify: `pnpm run typecheck`, `pnpm run test:backend` for auth

## 3. Console directory panel and filters (grade10) (owner: @rita-liu)

Claimable against fixtures; no running backend.

- [x] 3.1 Export `UserAccountPanel`, `UserDirectoryFilters`, and the types named
  in the delta (`shared-console-user-directory-SC-01`)
- [x] 3.2 Make ban, unban, and sessions handler-gated; add row open
  (`shared-console-user-directory-SC-05`, `SC-14`, `SC-15`)
- [x] 3.3 Panel sections, roles submit, ban reports out for moderation dialog
  (`shared-console-user-directory-SC-17`, `SC-18`, `SC-19`)
- [x] 3.4 Grant rows with elevated mark; empty grants
  (`shared-console-user-directory-SC-20`, `SC-21`, `SC-22`)
- [x] 3.5 Type / Roles / Status / Email selects; Roles locked under Users;
  Any clears Status or Email
  (`shared-console-user-directory-SC-23`, `SC-24`, `SC-28`)
- [x] 3.6 Table reports order without reordering rows; standing shows
  consumer-supplied reason; session origin and expiry when supplied
  (`shared-console-user-directory-SC-16`, `SC-25`, `SC-26`)
- [x] 3.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` for
  `@grade10/frontend-console`

## 4. Grade10 Users access desk (grade10) (owner: @rita-liu)

Needs groups 2 and 3 landed. Claimable against fixtures for the page shell;
list read against the contract.

- [x] 4.1 Wire Users to `listDirectory`, filters, and sort; open the account
  panel beside the list (`grade10-admin-console-user-directory-SC-01`)
- [x] 4.2 Pass row/panel handlers only for grants held
  (`grade10-admin-console-user-directory-SC-02`)
- [x] 4.3 Sync `user`, search, filters, order, and page in the address
  (`grade10-admin-console-user-directory-SC-03`, `SC-04`); default `roles`
  to elevated when absent (`SC-12`)
- [x] 4.4 Type / Roles / Status / Email narrowings
  (`grade10-admin-console-user-directory-SC-05`, `SC-06`)
- [x] 4.5 Resolve effective grants from `ROLE_PERMISSIONS`; elevated mark;
  `?role=` deep link on Roles & Permissions when `user:set-role`
  (`grade10-admin-console-user-directory-SC-07`, `SC-08`)
- [x] 4.6 Loyalty hand-off for accounts with no elevated role; audit hand-off
  when the session may read the trail
  (`grade10-admin-console-user-directory-SC-09`, `SC-10`)
- [x] 4.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  admin build, `pnpm run check:frontend-layers`
- [x] 4.8 Empty search offers the other Type as a link that keeps the query
  (`grade10-admin-console-user-directory-SC-13`); withhold ban and unban
  while erasure is filed (`SC-14`)

## 5. Manual pages (grade10-spec) (owner: @rita-liu)

- [x] 5.1 New page for `grade10-admin/console/user-directory`; update
  `shared/auth/users` and `shared/console/user-directory` for name search,
  narrowing, the panel, and the access-desk / loyalty-desk split; link from
  the console index
- [x] 5.2 Verify: `pnpm check:manual`

## 6. Peer admin lockout (grade10) (owner: @rita-liu)

- [x] 6.1 Refuse ban of any account that holds `admin`, including when the
  caller holds `admin` (`shared-auth-users-SC-25`); keep support refusal
  (`SC-12`)
- [x] 6.2 Refuse removing `admin` from another admin
  (`shared-auth-users-SC-26`); allow self-strip of `admin` when not last
  (`SC-27`); allow other self-role edits (`SC-17`)
- [x] 6.3 Withhold ban on admin rows / panel; refuse peer demote on Users;
  allow an admin to edit and strip their own roles on Users
- [x] 6.4 Verify: `pnpm run typecheck`, `pnpm run test:backend` for auth
  directory policy
