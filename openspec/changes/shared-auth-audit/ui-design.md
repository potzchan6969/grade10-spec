## Screens

### Audit — both brands (`/audit`)

No Figma frame. Admin is outside the design file; the proposal forbids a new
Figma, design-system, or Astryx export. Layout stays the existing Audit
section on `apps/admin/grade10` and `apps/admin/zzz` (same composition after
the lift into `@grade10/audit-admin-frontend`).

Order on the page: title and description, then chain health, then filters,
then the table. Chain health sits under the description because both are
about the trail as a whole; filters cut the table that follows.

Users directory is unchanged except it reads `user` from the location so a
trail id can open that account (`shared-console-audit-SC-14`).

## Components

Compose existing `@grade10/frontend-console` exports. The console package is
the admin vocabulary (Astryx underneath); product admin-frontends do not
import `@astryxdesign/*` or `@grade10/design-system`. None of this is new
work in grade10-spec.

| Role | Export |
| --- | --- |
| Page stack | `Stack`, `Inline` |
| Copy | `Text` |
| Product / result chips | `Badge` (`default` / `error`) |
| Newest / Older | `CursorPager` |
| Jump | `Button` |
| Product, action, result | `Select` |
| Actor id, subject id | `Search` |
| Date range (two calendar days) | two `DateField` — one start day, one end day |
| Copy user id | `IconButton` + clipboard |
| Directory link | `Link` when `user:list`; otherwise `Text` |
| Chain strip (all reading) | `Text` — one line |
| Chain strip (issue) | `Notice` per failing product; `Button` to jump a break |
| Rows | `Table`, `Row`, `Cell` |
| Loading / error / empty | `Status` |
| Expand | native `<details>` / `<summary>` — the console has no collapsible |

No `@grade10/ui` audit block. Readable action labels are copy in
`@grade10/audit-admin-frontend`, not i18n catalogs.

## States

Tied to [shared/console/audit](./specs/shared/console/audit/spec.md). Loading
and a refused/unreachable chain are already the section's; they stay.

| State | When | Scenario |
| --- | --- | --- |
| Loading | first page in flight | existing pending copy (console loading, not a new scenario) |
| Error | a requested chain's list throws in a way the merge cannot absorb as strip state | existing error `Text` |
| Empty trail | no filters, no rows (genesis-only may still show the genesis row) | distinct from no-matches |
| No matches | filters applied, zero rows, trail has writes | `shared-console-audit-SC-08` |
| Filtered page | product + subject (and any other set filter) | `shared-console-audit-SC-01` |
| Date range includes the last instant of the end day | `from`/`to` via `startOfDay`/`endOfDay` | `shared-console-audit-SC-02` |
| Newest-first default | no `order` in the location | `shared-console-audit-SC-03` |
| Oldest-first | `order=oldest` | `shared-console-audit-SC-04` |
| No email filter | even with `user:list` | `shared-console-audit-SC-05` |
| No email on the list | list input and rows have no email field | `shared-console-audit-SC-06` |
| Location restore | opening the same search string reapplies filters and sort | `shared-console-audit-SC-07` |
| Product filter, other chain silent | paging enabled on the selected chain | `shared-console-audit-SC-09` |
| Subject column | every row with a subject id | `shared-console-audit-SC-10` |
| Readable action | label shown; recorded identity still on the row | `shared-console-audit-SC-11` |
| Expanded row | roles + details; no hash, email, or codes | `shared-console-audit-SC-12`, `shared-console-audit-SC-15` |
| Copy ids | `IconButton` on actor and subject | `shared-console-audit-SC-13` |
| Directory link vs plain id | `Link` iff `user:list` | `shared-console-audit-SC-14` |
| All chains reading | one `Text` line; products not listed | `shared-console-audit-SC-17` |
| Chain issue | `Notice` names the failing product; answering products stay off the strip | `shared-console-audit-SC-17` |
| Jump | chain strip “broken at N” sets product + `atSeq` | `shared-console-audit-SC-16` |
| Incomplete freeze (unfiltered) | a named chain does not answer; Older disabled; freeze copy is a `Notice` | existing merge behaviour, still required when no product filter |
