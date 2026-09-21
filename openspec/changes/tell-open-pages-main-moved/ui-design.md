Drawn from [Change Stages · Surfaces](../../../docs/prds/products/shared/planning/change-stages.md#surfaces) and the journeys. The manual has no Figma file; the layout's source of truth is the blueprint's own screens (`stage-changes-and-notify-hands` decisions Q11), and every state below is one the page or a journey already names.

## Screens

### Banner on the hosted manual

[Delivery workflow blueprint · Screens](../../../docs/references/delivery-workflow-blueprint.md#screens). One notice between the header and the reading column, above the page heading, in the shell rather than on a page: every page of the manual is read from one snapshot, so one banner answers all of them. It reads “`main` moved 2 minutes ago — <subject>. This site rebuilds in a few minutes and refreshes on its own.” and carries Refresh now beside the words, which re-reads the store for a reader who does not want to wait. Ten minutes after the page was told, the last sentence becomes “This site has not caught up yet.”

The banner takes the full width of the reading column and pushes the page down; it never floats over the reading line, and it never covers the header's search. It goes when the page has the new snapshot, and no second notice says so.

### Banner on the locally run manual

The same place and the same shape, with the checkout's own words: “Your checkout is 3 commits behind `main`.” and a Pull button beside them. Pull is the only control here; where the pull is refused, its place holds one line in the banner's own register - “Your checkout has uncommitted work.” or “Your checkout holds 1 commit `main` does not.” - so the teammate reads what is in the way rather than what failed. Two lines, not three: a checkout with no `origin` shows no banner at all, so no third line says there was nothing to pull from (decisions Q6).

## Components

The notice sits in the manual's shell as `FixtureNotice` does today, inside the 896px reading column and above `PageHeading`. Its shape is the manual's own notice chrome: one bordered container carrying `role="status"`, composing the `Text` rows, so a reader on a screen reader hears it without the page moving under them. Both notices render inside that one shell, so a page that is behind and on the bundled fixture reads as one notice rather than two borders.

Design-system primitives, from `@grade10/design-system/components/`:

| Export | Where |
| --- | --- |
| `Text` (`sm`, `secondary`) | The banner's line, the commit's subject and the refusal's line |
| `Button` (`sm`, `outline`) | Refresh now on the hosted manual, Pull on the locally run one |
| `Alert` | Not used, and why: `layout="inline"` draws an icon and a title and no description, and the banner's words are a sentence rather than a title; it is dismissible by default, and a notice saying the page is behind is not a reader's to dismiss |
| `Skeleton` | Nothing: the banner is absent until there is something to say, never a placeholder |

The manual's own blocks, in `tools/manual/src/shell/`, kept: `Header`, `AppShell`, `FixtureNotice`, `SnapshotFooter`, whose commit line is the value the banner is read against.

New in `tools/manual`, work in grade10-spec: `MainMoved` in `src/shell/main-moved.tsx` - both variants in one component, over the two readings that sit beside each other in `src/api/head.ts`. `useMainHead` answers where `main` is, from the relay. `useCheckout` answers how the checkout stands, takes the pull and holds the refusal it was given, and answers nothing at all on the hosted site. The manual carries its own English strings and imports no catalog, so no `packages/i18n` key is owed.

## States

### Banner on the hosted manual

| State | Shows | Anchor |
| --- | --- | --- |
| Behind | The banner naming the commit's subject and how long ago it landed, with Refresh now | `shared-planning-change-stages-SC-72` |
| Caught up | No banner: the page has taken the new snapshot and shows what landed | `shared-planning-change-stages-SC-72` |
| Still behind | Ten minutes after the page was told, the banner’s last sentence replaced and its promise to refresh gone with it, Refresh now unchanged | `shared-planning-change-stages-SC-72` |
| A reader typing | The banner stays and nothing reloads while a text field has focus, and the page takes the refresh the moment focus leaves | `shared-planning-change-stages-SC-72` |
| No relay | No banner, and nothing is polled | `shared-planning-change-stages-SC-75` |

### Banner on the locally run manual

| State | Shows | Anchor |
| --- | --- | --- |
| Behind | The banner naming how many commits behind `main` the checkout is, with Pull | `shared-planning-change-stages-SC-73` |
| Caught up | No banner and no count, whether the checkout is level with `main` or has nothing to compare against; after a Pull, the page showing what those commits landed | `shared-planning-change-stages-SC-73` |
| A fetch that failed | The counts as they last were, with the time `origin` was read beside them, and Pull as that reading leaves it (decisions Q6) | `shared-planning-change-stages-SC-73` |
| Dirty tree | The banner, no Pull, and one line naming the uncommitted work | `shared-planning-change-stages-SC-74` |
| Ahead of `main` | The banner, no Pull, and one line naming the commits `main` does not hold | `shared-planning-change-stages-SC-74` |
