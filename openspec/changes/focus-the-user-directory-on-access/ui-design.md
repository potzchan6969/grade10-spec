## Screens

### Users — Grade10 admin (`/users`)

No Figma frame. Admin is outside the design file; this change does not add
one. Layout stays the Users section of `apps/admin/grade10`, extended with
filters above the table and an account panel on the right when a row is
open.

Behavior: [grade10-admin/console/user-directory](./specs/grade10-admin/console/user-directory/spec.md)
and [shared/console/user-directory](./specs/shared/console/user-directory/spec.md).
Wire and URL: [tech-design.md](tech-design.md).

ZZZ admin is out of scope; it keeps the existing directory until it adopts
the panel.

## Components

Compose `@grade10/frontend-console`. Admin does not import
`@grade10/design-system` or `@grade10/ui` for this surface. **No new work in
grade10-spec** — missing exports land in the application repo's console
package (already tasked in groups 3–4 of [tasks.md](tasks.md)).

### Existing (unchanged contract)

| Role | Export |
| --- | --- |
| Page chrome | `SectionHeader`, `Stack`, `Panel`, `Text`, `Button`, `Search` |
| Table furniture | `Table`, `Row`, `Cell`, `Badge` |
| Async | `Status` (loading / error / empty) |
| Roles edit (retained) | `UserRolesDialog` |
| Irreversible confirm | `UserModerationDialog` |
| Sessions (retained) | `UserSessionsDialog` |
| Sort control pattern | `SortableHeading` (report only; console applies order) |
| Filter interaction pattern | `TableFilters` vocabulary — not wired through `useClientTable` |

### New in `@grade10/frontend-console` (grade10)

Named by [shared/console/user-directory](./specs/shared/console/user-directory/spec.md):

| Export | Role |
| --- | --- |
| `UserAccountPanel` | Right-hand account: identity, grants, standing, sessions; roles in-panel; ban / unban / erase report out |
| `UserDirectoryFilters` | Consumer-supplied filter groups; reports selection |
| Types | `UserAccountPanelProps`, `UserAccountPanelCopy`, `UserDirectoryFiltersProps`, `UserDirectoryFiltersCopy`, `UserFilterGroup`, `UserFilterOption`, `UserGrantRow`, `UserDirectoryOrder` |

### Modified in `@grade10/frontend-console` (grade10)

| Export | Change |
| --- | --- |
| `UserTable` | Optional `onBan` / `onUnban` / `onSessions` / `onOpen`; optional ban reason; sortable headings report order |
| `UserSessionRow` | Optional display-ready `origin` and `expires` |

## States

Tied to the three deltas. Loading / refused / empty list stay the page's
existing async tones ([shared/console/blocks](../../specs/shared/console/blocks/spec.md)).

| State | When | Scenario |
| --- | --- | --- |
| List loading | directory read in flight | existing Users loading copy |
| List refused | directory read fails | existing error tone |
| List empty | read succeeds, no rows | existing empty copy |
| Name search hit | fragment matches a name | `shared-auth-users-SC-19` |
| Narrowed to a role | Holds = named role | `shared-auth-users-SC-20`, `grade10-admin-console-user-directory-SC-05` |
| Combined narrowings | role ∧ standing (and any other set) | `shared-auth-users-SC-21`, `grade10-admin-console-user-directory-SC-06` |
| Ordered oldest-first | operator chose joined ascending | `shared-auth-users-SC-22` |
| Ordered newest-first | no order asked | `shared-auth-users-SC-22` |
| Panel open beside list | row opened / `?user=` | `shared-console-user-directory-SC-15`, `SC-17`; `grade10-admin-console-user-directory-SC-01`, `SC-03` |
| Address restores view | paste of search + filters + page + user | `grade10-admin-console-user-directory-SC-04` |
| Grants shown | mapping rows supplied | `shared-console-user-directory-SC-20`; `grade10-admin-console-user-directory-SC-07` |
| Elevated grant marked | mapping marks elevated | `shared-console-user-directory-SC-20`; `grade10-admin-console-user-directory-SC-07` |
| Grant link | address supplied and operator may open Roles & Permissions | `shared-console-user-directory-SC-21`; `grade10-admin-console-user-directory-SC-08` |
| No grants | empty grant list | `shared-console-user-directory-SC-22` |
| Ban reason shown | console supplied a reason | `shared-console-user-directory-SC-26` |
| Session origin / expiry | console supplied them | `shared-console-user-directory-SC-16` |
| Sessions / ban withheld | no handler | `shared-console-user-directory-SC-14` |
| Roles / erase withheld | session lacks grant | `grade10-admin-console-user-directory-SC-02` |
| Roles saved in panel | selection submitted | `shared-console-user-directory-SC-18` |
| Ban awaiting confirm | started in panel, dialog open | `shared-console-user-directory-SC-19` |
| Loyalty hand-off | account holds no operator role | `grade10-admin-console-user-directory-SC-09` |
| Audit hand-off | operator may read the trail | `grade10-admin-console-user-directory-SC-10` |
