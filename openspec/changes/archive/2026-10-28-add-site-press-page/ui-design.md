## Screens

### Press

- [Desktop frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7201-9699) — 1440 × 945.
- [Press list item](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7201-10240) — the release row, default and hover.
- No small-viewport frame exists; the narrow layout derives from the
  About page's collapse convention.
- Workbench render: `Site/Press/Screens/Press` (`Default`, `Narrow`) in
  `apps/preview/src/pages/site/press/`.

## Components

- `SiteHeader` from `@grade10/ui` — the production auction-first chrome,
  rendered with no item marked current.
- `Footer` from `@grade10/design-system/components/layout/footer`.
- `Button` (`secondary`) — the filter trigger, trailing a chevron.
- `DropdownMenu`/`DropdownMenuTrigger`/`DropdownMenuContent`/
  `DropdownMenuRadioGroup`/`DropdownMenuRadioItem` — the year filter;
  the radio item's check is the selected indicator the frame draws.
- Plain anchors for the release rows — the whole row is the link; no new
  primitive.

## States

### Press

| State | Shows | Anchor |
| --- | --- | --- |
| Wide viewport | Filter bottom-right beside the intro; release rows in the frame's three-column grid | `grade10-site-site-press-SC-02` |
| Narrow viewport | Header and filter stacked; release rows stack date over title, no arrow | `grade10-site-site-press-SC-03` |
| Filtered to a year | Only that year's group and its releases show | `grade10-site-site-press-SC-05` |
| Release row hover | `Base/muted` fill over the row; the arrow centers in its hit area | **Out of suite:** a CSS pseudo-state of the row the link requirement already binds |
| Entering | Header and list reveal on mount | **Out of suite:** the workbench stories' play pass waits on the reveal before asserting |
| Reduced motion | All content visible immediately, no transition | **Out of suite:** the workbench's `data-storybook-pause-motion` harness, which the page's `motion-reduce` fallback answers |
