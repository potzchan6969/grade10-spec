## Screens

### About

- [Desktop frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7172-2923) — 1440 × 1363.
- [Small viewport frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7172-7233) — 390 × 2077.
- Workbench render: `Site/About/Screens/About` (`Default`, `Narrow`) in
  `apps/preview/src/pages/site/about/`.

The page body copy is tightened from the frames after a copywriting review;
the frames' wording is stale until design syncs it back.

## Components

- `SiteHeader` from `@grade10/ui` — the production auction-first chrome,
  rendered with no item marked current.
- `Footer` from `@grade10/design-system/components/layout/footer`.
- `Card` from `@grade10/design-system/components/display/card` — the
  milestone timeline, with `padding={false}` so the page sets the slot
  insets the frames specify (16px horizontal on the small viewport, 24/8 on
  the desktop).
- Inline links are plain anchors — the `Link` primitive renders
  `inline-flex` and cannot wrap mid-sentence; the anchors carry the accent
  color and underline the frames specify.
- `motion` is not required: page entry uses CSS transitions behind a
  reduced-motion fallback.

## States

### About

| State | Shows | Anchor |
| --- | --- | --- |
| Wide viewport | Two-column hero and statements; company paragraph beside the milestone timeline | `grade10-site-site-about-SC-02` |
| Narrow viewport | All sections stacked at the 20px page inset | `grade10-site-site-about-SC-03` |
| Entering | Sections reveal staggered on mount | **Out of suite:** the workbench stories' play pass, which waits on the reveal before asserting |
| Reduced motion | All content visible immediately, no transition | **Out of suite:** the workbench's `data-storybook-pause-motion` harness, which the page's `motion-reduce` fallback answers |
