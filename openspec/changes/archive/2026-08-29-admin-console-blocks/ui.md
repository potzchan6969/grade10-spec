# UI — admin-console-blocks

## Screens

The admin surfaces have no Figma frames — the admin ships without a designer,
which is this change's premise — and this change adds no screen. Every page
keeps its current rendering; the code as it stands is the layout's source of
truth. The visible deltas are exactly the spec's fixes:

- A refused read renders in the error tone (`console-blocks-SC-06`) — both
  brands' store dashboards change from secondary-tone text.
- Irreversible auction post-sale moves and the settings deactivation confirm
  in a dialog instead of the browser's native confirm
  (`console-blocks-SC-08`, `console-blocks-SC-09`).
- Panel switches render as tabs and row filters as segmented controls
  (`console-blocks-SC-10`, `console-blocks-SC-11`) on the seven surveyed
  sites.
- The auction bidders queue gains a working pager where it now dead-ends
  (`console-blocks-SC-14`).

## Components

Console package (`@grade10/frontend-console`) exports — existing: `Table`,
`Row`, `Cell`, `At`, `Money`, `Status`, `FormDialog`, `useDebounced`; added:
`SectionHeader`, `StatusBadge`, `Figure`, `OperatorIdentity`, `CursorPager`,
the refusal keeper, and the money formatter; moved in from `@grade10/ui`:
`UserTable`, `UserRolesDialog`, `UserModerationDialog`, `UserSessionsDialog`
with their prop and copy types.

Design-system exports the blocks compose — all existing, nothing new is
needed in grade10-spec: `Table`, `TableHeader`, `TableBody`, `TableRow`,
`TableHead`, `TableCell` (new to grade10 only via the submodule bump),
`Pagination`, `PaginationPrevious`, `PaginationNext`, `Tabs`, `TabsList`,
`TabsTrigger`, `TabsContent`, `SegmentedControl`, `SegmentedControlItem`,
`Select`, `Dialog`, `Badge`, `Text`, `HStack`, `VStack`.

`@grade10/ui` keeps `TwoFactorVerifyForm`, `TwoFactorEnrollment`, and
`parseTotpUri` — the admin apps continue importing those
(`console-blocks-SC-04`).

## States

- Loading — `console-blocks-SC-05`: secondary-tone loading line, no rows, no
  empty message.
- Failed — `console-blocks-SC-06`: error-tone message, distinguishable from
  empty at a glance.
- Empty — `console-blocks-SC-07`: secondary-tone "nothing here" line, no
  error.
- Confirmation open/cancelled — `console-blocks-SC-08`: cancel reports
  nothing and returns to the surface.
- Paged — `console-blocks-SC-14`: older offered when more rows exist, newest
  offered from an older page.
- Directory states carry over unchanged — `user-directory-SC-05` (gated
  actions), `user-directory-SC-06` (ban/unban), `user-directory-SC-08` (no
  sessions).
