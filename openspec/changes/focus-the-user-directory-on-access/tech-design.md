## Context

See `proposal.md`. Deltas: `shared/auth/users`,
`shared/console/user-directory`, `grade10-admin/console/user-directory`.

Today the Users page reads better-auth `admin.listUsers` through
`SearchDirectory` — one search field or one filter field per call, never both
name and email in one page, never role ∧ standing ∧ verification together.
Ban and Sessions buttons are always rendered; only Roles and Erase are
handler-gated. `?user=` seeds the search box and does not open an account.
Session IP / user-agent / expiry and `banReason` already return from the API
and are dropped on the floor.

The loyalty finder already prefix-matches name or email via
`admin.identity.search`, but that RPC is capped at 25 rows and returns only
`id` / `email` / `name` — wrong shape for a browsable directory.

Effective grants resolve from `@grade10/auth-contracts` (`ROLE_PERMISSIONS`,
`parseRoles`, `ADMIN_ROLES`) — the same map the Roles & Permissions page
derives from. No new source of truth.

## Goals / Non-Goals

**Goals:** auth-owned directory list that matches name and email and ANDs
filters; shared panel + filters; Grade10 Users as the addressable access desk;
permission-honest row actions; session and ban-reason detail.

**Non-Goals:** ZZZ wiring; schema migrations; changing ban / set-role /
session / erasure mutations; timed bans; impersonation; merging with
`/members`.

## Decisions

### Spec already governs

Search matching, narrowing, order, the panel's sections, handler-gated moves,
URL-addressable account and view, grant resolution from the shipped map, and
the loyalty / audit hand-offs — all in the three deltas. This design picks
where they land.

### Directory read: new auth tRPC list

Add `users.listDirectory` on the existing auth `usersRouter` (elevated on
`user:list`). Drizzle over `users` — reuse `idx_users_email_prefix` /
`idx_users_name_prefix` where the query is a prefix; email *contains* stays a
`ilike` to match today's better-auth behaviour. Return
`{ users, total }` with the fields the table and panel need (`role`,
`banned`, `banReason`, `emailVerified`, `twoFactorEnabled`, `createdAt`, …).

Role filter: account holds the named closed role (token match on the
comma-separated `role` column, or `parseRoles`-equivalent SQL), or "any
operator role" / "no operator role" against `ADMIN_ROLES`.

_Rejected:_ extending `listUsers` alone — one `searchField` and one
`filterField` cannot OR name+email or AND three narrowings in one page.
_Rejected:_ extending `identity.search` — capped finder for loyalty, wrong
payload, wrong home.

Ban / set-role / sessions / revoke stay on better-auth. Erasure stays on
tRPC. `SearchDirectory` and the better-auth list path are replaced for the
Users page read; keep the client methods that mutations still need.

### Shared components in `frontend-console`

| Export | Land |
| --- | --- |
| `UserAccountPanel` | Props-only sections; roles submit under the roles-dialog contract; ban / unban / erase report out for `UserModerationDialog` |
| `UserDirectoryFilters` | Consumer-supplied groups/options; report selection; no role vocabulary inside |
| `UserTable` | Optional `onBan` / `onUnban` / `onSessions` / `onOpen` (same gate as roles/delete); optional ban reason; sortable headings report order, do not reorder rows |
| `UserSessionRow` | Optional display-ready `origin` and `expires` (extend copy headings); still never a secret |
| `UserRolesDialog` / `UserSessionsDialog` | Stay exported; panel is the Grade10 path |

Reuse `TableFilters` / `SortableHeading` vocabulary for interaction shape;
do not route the directory through `useClientTable` (in-memory only).

### Grade10 page wiring

| Choice | Land |
| --- | --- |
| Home | `apps/admin/grade10/src/pages/users/` + existing `UserDirectorySection` (or thin rewrite that owns URL + grants) |
| URL | Audit-style `useSearchParams`: `user` opens the panel; `q`, filter keys, `order`, `offset` survive a paste; `{ replace: true }` on filter edits |
| Grants | Union of `ROLE_PERMISSIONS[role]` for `parseRoles(account.role)`; elevated when the permission is held only by roles in `ADMIN_ROLES` (or the same mark `RBAC_DOCS_VIEW` uses) |
| Grant href | `/roles-and-permissions?permission=<id>` — Permissions tab highlight (additive query on that page; omit href when session lacks `user:set-role`) |
| Loyalty | `memberAddress(userId)` when the account holds no operator role |
| Audit | `/audit?actor=<id>` (and subject when the trail filter supports it) when session holds audit list |
| Action gates | Pass handlers only for grants held: `user:ban`, `session:list` / `session:revoke`, `user:set-role`, `user:delete` |

### Search semantics

One query string: if it equals a user id, return that account; otherwise match
accounts whose email **or** name contains the fragment, case-insensitive
(satisfies `shared-auth-users-SC-03` and `SC-19` without a double round-trip).

## Service Interfaces

### `users.listDirectory`

| | |
| --- | --- |
| Entrypoint | auth tRPC `users.listDirectory` |
| Grant | `user:list` (elevated procedure) |
| Input | `{ query?: string, holds?: "operator" \| "none" \| <closed role>, standing?: "banned" \| "active", email?: "verified" \| "unverified", orderBy?: "createdAt" \| "email", order?: "asc" \| "desc", limit: number, offset: number }` |
| Success | `{ users: DirectoryListUser[], total: number }` |
| Refusal | missing grant; invalid input |

`DirectoryListUser` carries every field the table and panel render from the
list read (including `banReason`, `emailVerified`). No nested grants — the
console resolves those from `ROLE_PERMISSIONS` client-side.

| Boundary | Responsibility |
| --- | --- |
| Entrypoint | Auth, grant check, zod parse |
| Service / repository | Build WHERE (AND of supplied filters; OR of name/email when querying), ORDER, LIMIT/OFFSET, COUNT |
| Persistence | `users` table; no write |

Idempotent read. No transaction beyond the single SELECT + COUNT. Faults:
adapter / DB errors surface as procedure failure (same tone as other auth
reads).

Mutations unchanged: better-auth ban / unban / setRole / listUserSessions /
revoke*; tRPC `users.requestErasure`.

## Contracts

| Change | Shape |
| --- | --- |
| **New** `users.listDirectory` | Auth tRPC; request/response as above |
| **Additive** Roles & Permissions address | Optional `?permission=<id>` selects Permissions tab and highlights that row |
| **Additive** console package exports | `UserAccountPanel`, `UserDirectoryFilters`, and the types named in the delta |
| **Breaking for consumers that type-narrow** | `UserTable` ban/sessions handlers become optional (runtime default: omit = hide) |

Unchanged wire: better-auth admin mutation paths; erasure procedures;
`admin.identity.search` / `lookup`.

## Risks / Trade-offs

- [Role stored as comma-separated string → fragile `contains`] → match with
  token boundaries (split / `parseRoles`-equivalent), covered by repository
  tests for multi-role accounts.
- [Email contains on a large table] → keep page size 20; prefix indexes help
  name/email prefix paths; measure if contains scans become hot.
- [Grant href needs Roles & Permissions `?permission=`] → small additive on
  that page; if the page is not yet shipped, panel omits grant hrefs until
  the address exists (grants still render).
- [ZZZ still on listUsers + always-on ban/sessions] → optional handlers keep
  ZZZ compiling; it adopts the panel when it chooses.

## Migration Plan

1. Contracts + `listDirectory` + repository tests.
2. Console package: optional handlers, session/ban-reason fields, filters,
   panel.
3. Grade10 Users page: URL state, filters, panel, grant resolution, hand-offs;
   Roles & Permissions `?permission=` if not already present.
4. Manual pages; archive after deploy.

## Open Questions

None — the loyalty hand-off follows the delta (`SC-09`: no operator role).
If staff who also shop need the link, that is a spec change, not an
implementation fork.
