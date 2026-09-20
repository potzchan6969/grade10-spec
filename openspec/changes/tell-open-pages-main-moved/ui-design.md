Drawn from [Change Stages · Surfaces](../../../docs/prds/products/shared/planning/change-stages.md#surfaces) and the journeys. The manual has no Figma file; the layout's source of truth is the blueprint's own screens (`stage-changes-and-notify-hands` decisions Q11), and every state below is one the page or a journey already names.

## Screens

### Banner on the hosted manual

[Delivery workflow blueprint · Screens](../../../docs/references/delivery-workflow-blueprint.md#screens). One notice between the header and the reading column, above the page heading, in the shell rather than on a page: every page of the manual is read from one snapshot, so one banner answers all of them. It reads `main` moved 2 minutes ago — <subject>. This site rebuilds in a few minutes and refreshes on its own. and carries one link, Refresh now, which reloads the page for a reader who does not want to wait.

The banner takes the full width of the reading column and pushes the page down; it never floats over the reading line, and it never covers the header's search. It goes when the page has the new snapshot, and no second notice says so.

### Banner on the locally run manual

The same place and the same shape, with the checkout's own words: Your checkout is 3 commits behind `main`. and a Pull button beside them. Pull is the only control here; the refusal replaces it with one line naming what is in the way - uncommitted work in the tree, or commits the checkout holds that `main` does not - so the teammate reads what to do rather than what failed.

## Components

The notice sits in the manual's shell as `FixtureNotice` does today, inside the 896px reading column and above `PageHeading`.

Design-system primitives, from `@grade10/design-system/components/`:

| Export | Where |
| --- | --- |
| `Alert` (`layout="inline"`, `status="default"`) | The banner itself, on both variants; `role="status"` so a reader on a screen reader hears it without the page moving under them |
| `Text` (`sm`, `secondary`) | The banner's line, the commit's subject and the refusal's reason |
| `Button` (`sm`, `outline`) | Pull, on the locally run manual |
| `Skeleton` | Nothing: the banner is absent until there is something to say, never a placeholder |

The manual's own blocks, in `tools/manual/src/shell/`, kept: `Header`, `AppShell`, `FixtureNotice`, `SnapshotFooter`, whose commit line is the value the banner is read against.

New in `tools/manual`, work in grade10-spec: `MainMoved` in `src/shell/main-moved.tsx` - both variants, one component reading one hook - and `useMainHead` in `src/api/head.ts`. The manual carries its own English strings and imports no catalog, so no `packages/i18n` key is owed.

## States

### Banner on the hosted manual

| State | Shows | Anchor |
| --- | --- | --- |
| Behind | The banner naming the commit's subject and how long ago it landed, with Refresh now | `shared-planning-change-stages-SC-72` |
| Caught up | No banner: the page has taken the new snapshot and shows what landed | `shared-planning-change-stages-SC-72` |
| A reader typing | The banner stays and nothing reloads while a text field has focus | `shared-planning-change-stages-SC-72` |
| No relay | No banner, and nothing is polled | `shared-planning-change-stages-SC-75` |

### Banner on the locally run manual

| State | Shows | Anchor |
| --- | --- | --- |
| Behind | The banner naming how many commits behind `main` the checkout is, with Pull | `shared-planning-change-stages-SC-73` |
| Caught up | No banner, and no count | `shared-planning-change-stages-SC-73` |
| Dirty tree | The banner, no Pull, and one line naming the uncommitted work | `shared-planning-change-stages-SC-74` |
| Ahead of `main` | The banner, no Pull, and one line naming the commits `main` does not hold | `shared-planning-change-stages-SC-74` |
