# Tasks: Who may act

Group 1 lands first. Groups 2, 3, and 4 depend on group 1, not on each
other. Group 5 depends on group 1 and can run beside 2–4 against fixtures.
Group 6 depends on groups 2 and 4. Later work (email change) appends a
group; it does not rename these.

## 1. Roles and grants (grade10) (owner: @rita-liu)

- [x] 1.1 Make `A collector is a user` and `An unknown role is dropped`
      pass: `user`, `staff`, `support`, `auditor`, `admin`.
- [x] 1.2 Make `Each role grants a fixed set of permissions` pass as the
      single permission map.
- [x] 1.3 Make `A user cannot act as an operator`, `Support cannot set
      roles`, `Staff cannot list or ban users`, `Staff can operate the
      store and auction catalog`, `Auditor reads the trail and nothing
      else`, `Combined roles stack`, `An unknown permission grants
      nothing`, and `An operator cannot widen a role's grants` pass.
- [x] 1.4 Run `pnpm run typecheck` on the auth contracts package.

## 2. The users directory (grade10) (owner: @rita-liu)

Depends on group 1.

- [x] 2.1 Make `An operator with the grant lists accounts`, `A caller
      without the grant is refused`, `Search matches email without letter
      case`, `An account opens by user id`, and `A banned account stays in
      the directory` pass.
- [x] 2.2 Make `A ban stops money-moving`, `A banned person cannot sign
      in`, `A banned person is not signed in`, `An unban lets them sign in
      again`, `A caller who cannot ban is refused`, `An operator cannot
      ban themselves`, `Support cannot ban an admin`, and `The last admin
      cannot be banned` pass.
- [x] 2.3 Make `Admin changes another person's roles`, `Clearing operator
      roles leaves a user`, `Support cannot set roles`, `An operator
      cannot change their own roles`, and `The last admin keeps admin`
      pass.
- [x] 2.4 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run
      test:backend`.

## 3. Sessions (grade10) (owner: @rita-liu)

Depends on group 1.

- [x] 3.1 Make `An operator with the grant lists one person's sessions`,
      `A caller without the grant is refused`, and `Support cannot list an
      admin's sessions` pass.
- [x] 3.2 Make `A revoked session is not signed in`, `Every session of an
      account can be revoked`, `A caller who cannot revoke is refused`,
      `Support cannot revoke an admin's session`, and `Revoking the
      current session signs the operator out` pass.
- [x] 3.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run
      test:backend`.

## 4. The identity trail (grade10) (owner: @rita-liu)

Depends on group 1.

- [x] 4.1 Make `A ban is on the trail`, `A refused ban is on the trail`,
      `A revoke is on the trail`, `A trail entry names people by user id`,
      `An auditor can read the trail`, `An auditor can check the trail is
      consistent`, and `A caller without audit read is refused` pass.
- [x] 4.2 Make `A ban reason is on the trail`, `Secrets stay off the
      trail`, `An entry cannot be rewritten`, `An unrecorded action does
      not run`, `A directory list is not on the trail`, `A session list is
      not on the trail`, and `An unrecorded revoke does not run` pass.
- [x] 4.3 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run
      test:backend`.

## 5. Operator consoles (grade10) (owner: @rita-liu)

Depends on group 1. Frontend against fixtures.

- [x] 5.1 Make `An operator with the grant lists accounts`, `A caller
      without the grant is refused`, `Search matches email without letter
      case`, and `An account opens by user id` pass on both admin users
      pages.
- [x] 5.2 Make `A ban stops money-moving`, `A banned person cannot sign
      in`, `An unban lets them sign in again`, `A caller who cannot ban is
      refused`, `An operator cannot ban themselves`, and `Support cannot
      ban an admin` pass.
- [x] 5.3 Make `Admin changes another person's roles`, `Clearing operator
      roles leaves a user`, `Support cannot set roles`, `An operator
      cannot change their own roles`, and `The last admin keeps admin`
      pass.
- [x] 5.4 Make `An operator with the grant lists one person's sessions`,
      `A revoked session is not signed in`, `Every session of an account
      can be revoked`, `A caller who cannot revoke is refused`, and
      `Support cannot revoke an admin's session` pass.
- [x] 5.5 Make `An auditor can read the trail`, `An auditor can check the
      trail is consistent`, and `A caller without audit read is refused`
      pass on both admin audit pages.
- [x] 5.6 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test`.

## 6. A ban stops money-moving (grade10) (owner: @rita-liu)

Depends on groups 2 and 4.

- [x] 6.1 Make `A ban stops money-moving` and `A banned person is not
      signed in` pass on every money-moving action in store, auction, and
      loyalty.
- [x] 6.2 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run
      test:backend`.

## 7. Archive when it has shipped (grade10)

- [x] 7.1 Verify every scenario in the four deltas, then run `openspec
      validate add-auth-access --strict` and `openspec validate --specs`.
- [x] 7.2 After rollout is confirmed, fold the accepted deltas into
      `openspec/specs/` and archive this change.

Implementation merged to grade10 `main` as `2ad3c0df` (#95) on 2026-08-26.
The last successful Deploy of `main` in GitHub Actions was `c8dfb774`,
which does not contain that merge. Archived on owner request.
