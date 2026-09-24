## Context

See `proposal.md`. Deltas: `shared/auth/users`,
`shared/console/user-directory`, `grade10-admin/console/user-directory`.
Screens and exports: `ui-design.md`.

Today Grade10 Users lists and moderates accounts through
`UserDirectorySection` (`@grade10/auth-admin-frontend`) composing
`@grade10/frontend-console`. Create is not offered there. Auth-only create
already exists as BetterAuth `admin.createUser`, gated in
`packages/grade10-auth/backend/src/securityHooks.ts` on `user:create` (and
today also `user:set-role` whenever `role` is present). The admin-frontend
already exposes `useCreateUser` → `BetterAuthUserDirectoryRepository.create`
(password optional). Override's `CreateMemberDialog` /
`ProvisionMember` remains the non-prod loyalty path and is not reused.

## Goals / Non-Goals

**Goals:** passwordless Auth create from Grade10 Users; grant rules matching
the auth delta; slim `UserCreateDialog` in the console package; success and
duplicate both open the account panel beside the list.

**Non-Goals:** loyalty enroll / opening points; changing Override create;
invite or magic-link mail; password field; ZZZ wiring; schema migrations;
new auth tRPC procedures; email-verification standing (❓ on the PRD).

## Decisions

### Spec already governs

Who may create, passwordless Auth-only fields, empty roles → `user`,
duplicate refuse, Create gated on `user:create`, panel open on success /
open-existing, and the `UserCreateDialog` export contract — all in the three
deltas. This design picks where they land.

### Auth create: reuse BetterAuth `createUser`, fix the grant gate

Call the existing BetterAuth admin path through `useCreateUser` /
`repository.create`. Omit `password`. Do not enroll Loyalty, do not send mail
(BetterAuth create already does neither on this path).

**`neededGrants` today** requires `user:set-role` whenever `body.role` is
defined — including `role: ["user"]` and `role: []`. That refuses
`shared-auth-users-SC-29` / `SC-33`. Change it so `user:set-role` is required
only when the role list names any non-`user` role; empty or `user`-only needs
`user:create` alone. Keep fail-closed audit on refuse and success-after for
create.

_Rejected:_ a new tRPC `users.create` — BetterAuth already creates the Auth
row and is what Override and auction test accounts call.
_Rejected:_ routing Users create through `ProvisionMember` — that path enrolls
and funds points (Q1 / Q9).

### Duplicate email → existing id for open-existing

BetterAuth refuses with `USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL` and does not
return the existing id. Extend the directory repository create outcome so a
duplicate refusal carries `existingUserId` after an exact-email lookup
(`listDirectory` with the submitted email, or the existing better-auth email
contains list + exact match — same idea Override uses in
`findExactEmail`, without importing provisioning). The dialog never searches;
it receives the id from the create outcome and calls `onOpenExisting`.

_Rejected:_ changing BetterAuth's create response shape.
_Rejected:_ leaving the operator to search the list alone (Q4).

### Empty roles on the wire

`UserCreateDialog` submits an empty list when nothing is selected
(`shared-console-user-directory`). The repository maps empty → Auth
`role: ["user"]` before `createUser`, so BetterAuth always receives a closed
role and SC-33 still holds. Grant check uses the pre-map / post-map rule
above (no non-`user` → no `user:set-role`).

### Console: new `UserCreateDialog`, reuse FormDialog + role checkboxes

Land in `@grade10/frontend-console` beside `UserRolesDialog`:

| Piece | Land |
| --- | --- |
| Shell | Existing `FormDialog` |
| Fields | Name + email `TextField`s; role checkboxes via `UserRoleOption` (same pattern as `UserRolesDialog`) |
| Valid | Confirm disabled until name and email are both non-empty (Q15) |
| Password | Absent |
| Success | Report created id via `onCreated` (name as ui-design / props dictate) |
| Duplicate | Refusal copy + open-existing control → `onOpenExisting(existingUserId)` |
| Copy | `UserCreateDialogCopy` — consumer-owned; no `@grade10/i18n` keys |

Export `UserCreateDialog`, `UserCreateDialogProps`, `UserCreateDialogCopy` from
the package public entry (`shared-console-user-directory-SC-01`).

_Rejected:_ a `mode` flag on Override's `CreateMemberDialog` (Q9).
_Rejected:_ building the dialog in `grade10-spec` packages — ui-design places
it in the application console package.

### Grade10 wiring: section + page grants

| Choice | Land |
| --- | --- |
| Create control | `UserDirectorySection`: optional create when `canCreate` (from `user:create`) — same handler-gate pattern as ban / roles |
| Role vocabulary | Full closed set when `canSetRoles`; only `user` when not (Q16). Server still refuses elevated without `user:set-role` |
| Mutation | `useCreateUser` inside the section (or a thin create dialog host it owns) |
| Success | Set directory `view.user` to the new id (same as picking a row) |
| Duplicate open-existing | Same `view.user` write from `onOpenExisting` |
| Route | `users.tsx` passes `canCreate={hasPermission(roles, "user:create")}` through `UsersPage` |
| ZZZ | Supplies no create handler / `canCreate`; Create stays hidden |

### Not touched

`CreateMemberDialog`, `ProvisionMember`, loyalty Override page, auction test
account password create (keeps its own passworded `useCreateUser` calls).

## Service Interfaces

No new service procedure. Create stays BetterAuth `/admin/create-user`.

| | |
| --- | --- |
| Entrypoint | BetterAuth admin `createUser` |
| Grant | `user:create`; plus `user:set-role` only when any submitted role is not `user` |
| Input | `{ email, name, role: Role[], password?: omitted }` |
| Success | `{ user }` — client opens panel by `user.id` |
| Refusal | missing grant (403 + audit); duplicate email (existing code); invalid input |
| Side effects | Auth row only; audit `auth.admin.create-user`; no loyalty, no mail |

| Boundary | Responsibility |
| --- | --- |
| `securityHooks.neededGrants` | Fail-closed grant list for create (narrowed as above) |
| `BetterAuthUserDirectoryRepository.create` | Omit password; map empty roles → `["user"]`; on duplicate code, resolve `existingUserId` |
| `useCreateUser` | Unchanged mutation shell; outcome type gains optional `existingUserId` on failure |
| `UserCreateDialog` | Collect fields; report ids; no navigation |
| `UserDirectorySection` / Users route | Gate Create; open panel from reported ids |

Idempotent only in the duplicate sense: a second create with the same email
refuses and never inserts a second row. No multi-table transaction.

## Risks / Trade-offs

- [Duplicate lookup races a rename / delete] → exact email match after
  BetterAuth's refuse; if lookup misses, show refuse without open-existing
  rather than inventing an id.
- [`neededGrants` change loosens create-with-role] → covered by auth security
  specs: elevated without `user:set-role` still refused; plain / empty covered
  by SC-29 / SC-33.
- [Passwordless BetterAuth create edge cases] → already used by Override
  provisioning (no password on that create); Users omits the field the same
  way. Auth integration tests assert no password collected and account exists.
- [ZZZ compiles without Create] → optional `canCreate` / omitted handler;
  export additive only.

## Migration Plan

1. Auth hook grant fix + create outcome / repository duplicate lookup + backend
   tests.
2. `UserCreateDialog` + exports + console package tests.
3. `UserDirectorySection` + Grade10 Users route/page wiring.
4. Manual 🚧 lines already on the PRDs; archive after deploy.

## Open Questions

None that change the plan. Email-verification standing stays ❓ on
[Users · Create Account](../../../docs/prds/products/shared/auth/users.md#create-account);
implementation leaves BetterAuth's default and does not invent a verified flag.
