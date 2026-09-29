# Tasks

Groups 2 and 3 are claimable in parallel once group 1's store lines are
settled; they do not need each other. Group 4 needs groups 2 and 3. Group 5
is the walk. Frontend groups run against contracts and fixtures, never a
running backend. Design decisions: [`tech-design.md`](tech-design.md).

## 1. Manual pages (grade10-spec)

- [x] 1.1 Confirm Create Account / Moves 🚧 lines on
  `docs/prds/products/shared/auth/users.md`,
  `docs/prds/products/shared/console/user-directory.md`, and
  `docs/prds/products/grade10-admin/console/user-directory.md` still match the
  deltas — including duplicate open-existing / `onOpenExisting` on the shared
  console Moves line
- [x] 1.2 Verify: `pnpm check:manual`

## 2. Auth create grants and create outcome (grade10)

- [x] 2.1 The tests this group's scenario ids name, in their own commit before
  its code; ticked last (`shared-auth-users-SC-28`, `shared-auth-users-SC-29`,
  `shared-auth-users-SC-30`, `shared-auth-users-SC-31`,
  `shared-auth-users-SC-32`, `shared-auth-users-SC-33`)
- [x] 2.2 Narrow `neededGrants` for `/admin/create-user` so `user:set-role` is
  required only when any submitted role is not `user`; empty or `user`-only
  needs `user:create` alone (`shared-auth-users-SC-29`,
  `shared-auth-users-SC-31`, `shared-auth-users-SC-33`)
- [x] 2.3 Keep refuse without `user:create`, passwordless Auth-only create
  (no loyalty enroll, no invite mail), and duplicate refuse with exactly one
  Auth row (`shared-auth-users-SC-28`, `shared-auth-users-SC-30`,
  `shared-auth-users-SC-32`)
- [x] 2.4 On duplicate BetterAuth code, resolve `existingUserId` by exact-email
  lookup in the directory repository create outcome; map an empty role list to
  Auth `role: ["user"]` before `createUser`; omit password
  (`shared-auth-users-SC-32`, `shared-auth-users-SC-33`)
- [x] 2.5 Verify: `pnpm run typecheck`, `pnpm run test:backend` for auth

## 3. UserCreateDialog (grade10)

Claimable against fixtures; no running backend.

- [x] 3.1 The tests this group's scenario ids name, in their own commit before
  its code; ticked last (`shared-console-user-directory-SC-01`,
  `shared-console-user-directory-SC-33`, `shared-console-user-directory-SC-34`,
  `shared-console-user-directory-SC-35`, `shared-console-user-directory-SC-36`)
- [x] 3.2 Export `UserCreateDialog`, `UserCreateDialogProps`, and
  `UserCreateDialogCopy` from `@grade10/frontend-console`
  (`shared-console-user-directory-SC-01`)
- [x] 3.3 Dialog collects name, email, and console-supplied roles on
  `FormDialog`; Confirm disabled until name, email, and at least one role
  are present; no password field; no empty submit
  (`shared-console-user-directory-SC-34`)
- [x] 3.4 Success reports the created account identifier; duplicate refusal
  offers open-existing that calls `onOpenExisting` with the existing id; the
  dialog decides nothing about what shows next
  (`shared-console-user-directory-SC-35`, `shared-console-user-directory-SC-36`)
- [x] 3.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` for
  `@grade10/frontend-console`

## 4. Grade10 Users create wiring (grade10)

Needs groups 2 and 3 landed. Claimable against fixtures for the page shell.

- [x] 4.1 The tests this group's scenario ids name, in their own commit before
  its code; ticked last (`grade10-admin-console-user-directory-SC-20`,
  `grade10-admin-console-user-directory-SC-21`,
  `grade10-admin-console-user-directory-SC-22`,
  `grade10-admin-console-user-directory-SC-23`,
  `shared-console-user-directory-SC-33`)
- [x] 4.2 Pass `canCreate` from `user:create` through the Users route and page
  into `UserDirectorySection`; withhold Create without that grant or without a
  create handler (`grade10-admin-console-user-directory-SC-21`,
  `shared-console-user-directory-SC-33`)
- [x] 4.3 Wire Create to `UserCreateDialog` + `useCreateUser`; role options are
  the closed set when `canSetRoles`, otherwise only `user`; success opens the
  new account's panel via directory `view.user`
  (`grade10-admin-console-user-directory-SC-20`,
  `grade10-admin-console-user-directory-SC-23`)
- [x] 4.4 On duplicate, surface the refuse and open-existing; choosing it opens
  that account's panel; no second Auth row
  (`grade10-admin-console-user-directory-SC-22`)
- [x] 4.5 Leave Override `CreateMemberDialog` / `ProvisionMember` unchanged
- [x] 4.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`,
  admin build, `pnpm run check:frontend-layers`

## 5. The walk (grade10)

Needs `feature-tcs.md` reviewed (`/tcs-review create-account-from-users-page`)
as its input, and groups 2–4 landed.

<!-- Disposition (2026-09-24 review): leave unchecked. Walk awaits
     `/tcs-review` + a real e2e pass — do not invent e2e theater. Groups 2–4
     already cover the named SC scenarios with unit/integration tests. -->

- [ ] 5.1 One walk per journey of every capability this change specifies, end to
  end through the interface its actor uses, kept as the change's end-to-end
  suite (`shared-auth-users-US-05`, `shared-console-user-directory-US-06`,
  `grade10-admin-console-user-directory-US-04`)
- [ ] 5.2 Flip the cases the walks decide with
  `pnpm run tcs:automated <case…> --decided-by <walk path>`, in the walks' own
  commit; the ones that stay manual are named in the suite and named in the
  walk's `rounds.md` row
- [ ] 5.3 Verify: `pnpm run test` for the auth admin / console packages covering
  the walk, and the admin e2e lane when this walk lands there
