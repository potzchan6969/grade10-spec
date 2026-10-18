## Screens

### Media Coverage

- [Desktop frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7204-11244) — 1440 wide: the header block over the four-column card grid.
- [Media card](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7204-11432) — the card, default and hover.
- No small-viewport frame exists; the narrow layout derives from the
  About page's collapse convention.
- Workbench render: `Site/Media Coverage/Screens/Media Coverage`
  (`Default`, `Narrow`) in `apps/preview/src/pages/site/media-coverage/`.

## Components

- `SiteHeader` from `@grade10/ui` — the production auction-first chrome,
  rendered with no item marked current.
- `Footer` from `@grade10/design-system/components/layout/footer`.
- `Card` — the media card's shell, restyled at the page level to the
  instance's bindings: `radius-3xl`, `gap-6` padding, `size-56` minimum
  height, and `border-strong` with a soft shadow and 4px lift on hover.
  The published set binds `radius-2xl`/`gap-4`; the override is recorded
  in `decisions.md`.
- `ArrowUpRight` from `@phosphor-icons/react` — the affordance's icon.
- Plain anchors for the cards — the whole card is the link; no new
  primitive.

## States

### Media Coverage

| State | Shows | Anchor |
| --- | --- | --- |
| Wide viewport | The header block, then the cards four across in the frame's grid | `grade10-site-site-media-coverage-SC-02` |
| Narrow viewport | Header stacked over a single column of slimmer cards — `p-5`, `min-h-48`, `text-base` title | `grade10-site-site-media-coverage-SC-03` |
| Media card hover | The card lifts 4px — 200ms smooth-out in, a springier 350ms return — draws a soft shadow, and its border strengthens to `border-strong` | **Out of suite:** a CSS pseudo-state of the card the link requirement already binds |
| Long entry | The publication truncates to one line, the title clamps — three lines on small viewports, four at `sm`; every card holds one height | **Out of suite:** CSS truncation on the card the coverage requirement already binds |
| Entering | Header and grid reveal on mount | **Out of suite:** the workbench stories' play pass waits on the reveal before asserting |
| Reduced motion | All content visible immediately, no transition | **Out of suite:** the workbench's `data-storybook-pause-motion` harness, which the page's `motion-reduce` fallback answers |
