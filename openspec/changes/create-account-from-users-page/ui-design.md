## Screens

### Users — Grade10 admin (`/users`)

No Figma frame. Admin is outside the design file; this change does not add
one. Layout stays the existing Users section — list, filters, and account
panel — with Create offered beside the directory chrome when the session
holds `user:create`. Create opens the slim Auth-only dialog below.

Behavior:
[grade10-admin/console/user-directory](./specs/grade10-admin/console/user-directory/spec.md)
and
[shared/console/user-directory](./specs/shared/console/user-directory/spec.md).

ZZZ admin is out of scope; it supplies no create handler until it chooses.

### Create account dialog

No Figma frame. Layout follows the console's existing `FormDialog` shell and
the role-option pattern already used by `UserRolesDialog` — name, email, and
roles only. Not Override's `CreateMemberDialog` (Q9).

Behavior:
[shared/console/user-directory](./specs/shared/console/user-directory/spec.md)
(create dialog contract) and
[shared/auth/users](./specs/shared/auth/users/spec.md) (who may create, what
is collected, duplicate email).

## Components

Compose `@grade10/frontend-console`. Admin does not import
`@grade10/design-system` or `@grade10/ui` for this surface. **No new work in
grade10-spec packages** — the create dialog lands in the application repo's
console package, named by
[shared/console/user-directory](./specs/shared/console/user-directory/spec.md).

### Existing (unchanged contract)

| Role | Export |
| --- | --- |
| Dialog shell | `FormDialog` |
| Create control | `Button` |
| Role options | `UserRoleOption` — same multi-select pattern as `UserRolesDialog` |
| Account beside the list | `UserAccountPanel` |
| Page chrome | `SectionHeader`, `Stack`, `Panel`, `Text` |

### New in `@grade10/frontend-console` (grade10 application)

| Export | Role |
| --- | --- |
| `UserCreateDialog` | Slim create: name, email, and roles from console-supplied vocabulary; no password field |
| Types | `UserCreateDialogProps`, `UserCreateDialogCopy` |

**`UserCreateDialogProps`** — open state; role options; create handler; on success
reports the created account identifier; on duplicate email reports the existing
account identifier via `onOpenExisting` when the operator chooses that action.

**`UserCreateDialogCopy`** — consumer-owned title, field labels, actions,
refusal copy, and the open-existing action label (same consumer-owned pattern
as `UserRolesDialogCopy`). No new keys in `packages/i18n`.

### Not used

Override's `CreateMemberDialog` — loyalty enroll and opening points (Q9).

## States

### Users — Grade10 admin (`/users`)

| State | Shows | Anchor |
| --- | --- | --- |
| Create offered | Create control present when the session holds `user:create` and the console supplies a create handler | `grade10-admin-console-user-directory-US-04` |
| Create withheld | No Create control when the session lacks `user:create`, or when the console supplies no create handler | `grade10-admin-console-user-directory-US-04` |
| Success opens panel | New account's panel open beside the list, same as picking a row | `grade10-admin-console-user-directory-US-04` |
| Duplicate email opens existing | After the dialog's open-existing action, that account's panel is open beside the list; no second Auth row | `grade10-admin-console-user-directory-US-04` |
| Create as plain user | Create with role `user` (or empty selection) succeeds with only `user:create`; panel shows `user` only | `grade10-admin-console-user-directory-US-04` |

### Create account dialog

| State | Shows | Anchor |
| --- | --- | --- |
| Collecting | `FormDialog` open with name, email, and console role options; no password field; Confirm disabled until name and email are both present | `shared-console-user-directory-US-06` |
| Roles without `user:set-role` | Role options offer only `user` when the console's session lacks `user:set-role` | `shared-auth-users-US-05` |
| Empty roles | No role selected; submit sends an empty list | `shared-console-user-directory-US-06` |
| Success — account identifier reported | Dialog reports the created account identifier; decides nothing about what shows next | `shared-console-user-directory-US-06` |
| Submitting | Confirm busy while create is in flight; fields unchanged | `shared-console-user-directory-US-06` |
| Duplicate email refused | Clear refusal that the email is taken, plus an open-existing action in the dialog; choosing it calls `onOpenExisting` with the existing account identifier | `shared-auth-users-US-05` |
| Elevated role without `user:set-role` | Stale or bypassed submit with a non-`user` role when the session lacks `user:set-role`; create refused in the dialog; no account created | `shared-auth-users-US-05` |
| Create without `user:create` | Create refused in the dialog when the session no longer holds `user:create`; no account created | `shared-auth-users-US-05` |
