# Tasks

Groups 2 and 3 are claimable once group 1 lands; they do not need each
other. Group 4 needs groups 2 and 3. Group 5 is the store's manual and can
land in parallel with implementation. Frontend groups run against contracts
and fixtures, never a running backend. Design decisions:
[`tech-design.md`](tech-design.md).

## 1. Directory list contract (grade10) (owner: @rita-liu)

- [ ] 1.1 Add `users.listDirectory` input and success shapes (query, holds,
  standing, email, order, limit, offset → users + total) on the auth contracts
  / tRPC router types so `shared-auth-users-SC-19`–`SC-22` are expressible on
  the wire
- [ ] 1.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` on
  `@grade10/auth-contracts`

## 2. Directory list read (grade10) (owner: @rita-liu)

Needs group 1 landed.

- [ ] 2.1 Implement `users.listDirectory` (elevated `user:list`): name or email
  match without letter case, id open, AND of role / standing / verification
  filters, requested order with newest-first default
  (`shared-auth-users-SC-03`, `SC-04`, `SC-19`, `SC-20`, `SC-21`, `SC-22`;
  multi-role token match covered in repository tests)
- [ ] 2.2 Refuse callers without `user:list` and return no rows
  (`shared-auth-users-SC-02`); keep banned accounts in results
  (`shared-auth-users-SC-05`)
- [ ] 2.3 Verify: `pnpm run typecheck`, `pnpm run test:backend` for auth

## 3. Console directory panel and filters (grade10) (owner: @rita-liu)

Claimable against fixtures; no running backend.

- [ ] 3.1 Export `UserAccountPanel`, `UserDirectoryFilters`, and the types named
  in the delta (`shared-console-user-directory-SC-01`)
- [ ] 3.2 Make ban, unban, and sessions handler-gated; add row open
  (`shared-console-user-directory-SC-05`, `SC-14`, `SC-15`)
- [ ] 3.3 Panel sections, roles submit, ban reports out for moderation dialog
  (`shared-console-user-directory-SC-17`, `SC-18`, `SC-19`)
- [ ] 3.4 Grant rows with elevated mark and optional address; empty grants
  (`shared-console-user-directory-SC-20`, `SC-21`, `SC-22`)
- [ ] 3.5 Filters from consumer groups; clear one group
  (`shared-console-user-directory-SC-23`, `SC-24`)
- [ ] 3.6 Table reports order without reordering rows; standing shows
  consumer-supplied reason; session origin and expiry when supplied
  (`shared-console-user-directory-SC-16`, `SC-25`, `SC-26`)
- [ ] 3.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` for
  `@grade10/frontend-console`

## 4. Grade10 Users access desk (grade10) (owner: @rita-liu)

Needs groups 2 and 3 landed. Claimable against fixtures for the page shell;
list read against the contract.

- [ ] 4.1 Wire Users to `listDirectory`, filters, and sort; open the account
  panel beside the list (`grade10-admin-console-user-directory-SC-01`)
- [ ] 4.2 Pass row/panel handlers only for grants held
  (`grade10-admin-console-user-directory-SC-02`)
- [ ] 4.3 Sync `user`, search, filters, order, and page in the address
  (`grade10-admin-console-user-directory-SC-03`, `SC-04`)
- [ ] 4.4 Population / standing / verification narrowings
  (`grade10-admin-console-user-directory-SC-05`, `SC-06`)
- [ ] 4.5 Resolve effective grants from `ROLE_PERMISSIONS`; elevated mark;
  `?permission=` deep link on Roles & Permissions when `user:set-role`
  (`grade10-admin-console-user-directory-SC-07`, `SC-08`)
- [ ] 4.6 Loyalty hand-off for accounts with no operator role; audit hand-off
  when the session may read the trail
  (`grade10-admin-console-user-directory-SC-09`, `SC-10`)
- [ ] 4.7 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  admin build, `pnpm run check:frontend-layers`

## 5. Manual pages (grade10-spec) (owner: @rita-liu)

- [ ] 5.1 New page for `grade10-admin/console/user-directory`; update
  `shared/auth/users` and `shared/console/user-directory` for name search,
  narrowing, the panel, and the access-desk / loyalty-desk split; link from
  the console index
- [ ] 5.2 Verify: `pnpm check:manual`
