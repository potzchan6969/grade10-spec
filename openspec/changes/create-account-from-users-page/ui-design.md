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
| Create offered | Create control present when the session holds `user:create` and the console supplies a create handler | `grade10-admin-console-user-directory-SC-20` |
| Create withheld | No Create control when the session lacks `user:create`, or when the console supplies no create handler | `grade10-admin-console-user-directory-SC-21` |
| Success opens panel | After the review is confirmed, the new account's panel is open beside the list, same as picking a row | `grade10-admin-console-user-directory-SC-20` |
| Duplicate email opens existing | After the dialog's open-existing action, that account's panel is open beside the list; no second Auth row | `grade10-admin-console-user-directory-SC-22` |
| Create as plain user | Create with role `user` still opens the review; confirming it with Create succeeds with only `user:create`; panel shows `user` only | `grade10-admin-console-user-directory-SC-23` |
| Admin note | Creating `admin` adds a note on the review; confirming it with Create anyway proceeds; an email that also needs a check sits on the same confirmation | `grade10-admin-console-user-directory-SC-25` |

### Create account dialog

| State | Shows | Anchor |
| --- | --- | --- |
| Collecting | `FormDialog` open with name, email, and console role options; no password field; Confirm disabled until name, email, and at least one role are present | `shared-console-user-directory-SC-34` |
| Roles without `user:set-role` | Role options offer only `user` when the console's session lacks `user:set-role` | `grade10-admin-console-user-directory-SC-23` |
| Empty roles | No role selected; Create stays disabled | `shared-console-user-directory-SC-34` |
| Success — account identifier reported | Dialog reports the created account identifier; decides nothing about what shows next | `shared-console-user-directory-SC-35` |
| Submitting | Confirm busy while create is in flight; fields unchanged | **Out of suite:** `FormDialog` pending — shared shell, not a create scenario |
| Duplicate email refused | Clear refusal that the email is taken, plus an open-existing action in the dialog; choosing it calls `onOpenExisting` with the existing account identifier | `shared-console-user-directory-SC-36` |
| Review confirmation | After every Create, one second `FormDialog` shows a table of the trimmed draft. A clean draft uses Create, not destructive. A malformed or off-list email and/or a chosen locked role adds notes on that same confirmation and uses Create anyway, destructive; the typed email is in bold only for an email note; a locked role label is in bold only for a role note. Confirming proceeds with create; back returns to the create form with the trimmed values and creates nothing | `shared-console-user-directory-SC-37`, `shared-console-user-directory-SC-38`, `shared-console-user-directory-SC-39` |
| Elevated role without `user:set-role` | Stale or bypassed submit with a non-`user` role when the session lacks `user:set-role`; create refused in the dialog; no account created | `shared-auth-users-SC-31` |
| Create without `user:create` | Create refused in the dialog when the session no longer holds `user:create`; no account created | `shared-auth-users-SC-30` |
