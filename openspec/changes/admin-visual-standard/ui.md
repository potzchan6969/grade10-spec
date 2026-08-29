# UI — admin-visual-standard

## Screens

No screen is added, moved, or re-laid-out. There are no Figma frames for the
admin — shipping without a designer is this change's premise, and
`admin-console-blocks` established the same — so the code as it stands remains
the layout's source of truth, and this change swaps what renders it.

Every admin surface is in scope: the seven `packages/*/admin-frontend`
consoles, the 23 pages of `apps/admin/grade10` and the 9 of `apps/admin/zzz`,
and both application shells. The visible delta on each is the vocabulary, not
the arrangement — same facts, same order, same page.

Two surfaces change in a way an operator can point at:

- **Both admin shells** move from the design system's layout to Astryx's
  `AppShell` and `SideNav`. Navigation keeps its current entries and order.
- **The two two-factor pages** (`apps/admin/*/src/pages/security/TwoFactorPage.tsx`)
  render the unchanged `@grade10/ui` block against the brand palette the admin
  theme also carries, so it reads as part of the console rather than as a
  visitor from the storefront (`visual-standard-SC-03`).

## Components

**Astryx (`@astryxdesign/core`, pinned `0.5.0`)** — the admin's only
vocabulary. Verified present at that version. Per-component subpath exports,
as the openspec-viewer imports them:

`AppShell`, `SideNav`, `TopNav`, `Heading`, `Text`, `Badge`, `Banner`,
`Button`, `IconButton`, `Card`, `Dialog`, `AlertDialog`, `Table`, `TabList`,
`SegmentedControl`, `Pagination`, `Spinner`, `Skeleton`, `EmptyState`,
`StatusDot`, `TextInput`, `NumberInput`, `SearchInput` via `PowerSearch`,
`Selector`, `RadioList`, `CheckboxInput`, `Switch`, `Tooltip`, `Link`,
`Timestamp`, `HStack`, `VStack`, `Grid`, `Center`, `Divider`,
`VisuallyHidden`, and `Theme` from `@astryxdesign/core/theme`.

**Console package (`@grade10/frontend-console`)** — the same exports as today,
re-implemented on Astryx. The public entry does not change shape, which is
what keeps the revert route open:

`Table`, `Row`, `Cell`, `At`, `Money`, `Status`, `FormDialog`,
`SectionHeader`, `StatusBadge`, `Figure`, `OperatorIdentity`, `CursorPager`,
`UserTable`, `UserRolesDialog`, `UserModerationDialog`, `UserSessionsDialog`,
`keepRefusal`, `formatMinor`, `useDebounced`, and their prop and copy types.

Added by this change: only whatever `visual-standard-SC-02` turns up — a
control an admin surface needs that Astryx does not offer is added here,
composed from Astryx. None is known in advance; the migration groups find
them.

**`@grade10/ui`** — unchanged, and importantly so. `TwoFactorEnrollment`,
`TwoFactorVerifyForm`, and `parseTotpUri` keep one definition serving both the
admin and customer surfaces.

**`@grade10/design-system`** — no longer the admin's supplier. Nothing is
added, removed, or restyled for the admin; its primitives reach admin pixels
only underneath the two-factor block.

**New in grade10 (not grade10-spec):** `packages/admin-theme`, exporting
`grade10AdminTheme` built with `defineTheme`.

**Nothing in this change is work in grade10-spec.** No design-system
component, variant, or token is added or altered — every export named above
already exists, and the vocabulary being adopted is a third-party package.
That is why `tasks.md` carries no grade10-spec group and no submodule bump.

## States

The async, confirmation, and selection states are the ones
`admin-console-blocks` established. They do not change; this change is
accountable for them surviving. Each is owned by a console-package block, so
each is re-established once rather than per surface.

- **Loading** — `visual-standard-SC-06`: `Status` renders a loading line
  distinguishable from both empty and refused.
- **Refused** — `visual-standard-SC-06`: `Status` renders the failure in the
  error tone, distinguishable from the empty state at a glance.
- **Empty** — `visual-standard-SC-06`: `Status` renders the nothing-here line
  in a non-error tone.
- **Panel switch** — `visual-standard-SC-07`: announced as tabs, active panel
  announced as selected.
- **Row filter** — `visual-standard-SC-07`: announced as one segmented choice,
  selected option announced as selected.
- **Confirmation, open and cancelled** — `visual-standard-SC-08`: `FormDialog`
  renders the confirmation; the platform's own confirm is not invoked, and
  cancelling reports nothing and returns to the surface.
- **Tabular amount** — carried by `Money` and `formatMinor`: an amount names
  its ISO 4217 code.
- **Queue longer than its page** — carried by `CursorPager`: the way on and
  the way back are both offered.
- **Brand** — `visual-standard-SC-04`: the same console under the two brands
  differs only by the applied Astryx theme; no block carries a brand value.
