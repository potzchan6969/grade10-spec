## Screens

### Shows

- [Desktop frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7180-7423) — 1440 × 7267.
- No small-viewport frame exists; the narrow layout derives from the About
  page's collapse convention.
- [Event Card block](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7180-8647) — the edition carousel card.
- [Event Record block](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7193-9607) — the timeline row.
- Workbench render: `Site/Shows/Screens/Shows` (`Default`, `Narrow`) in
  `apps/preview/src/pages/site/shows/`.

## Components

- `ShowsPageBody` from `@grade10/ui` (`packages/ui/src/blocks/site-shows`)
  — the page body: hero, event scale, chapters, editions, records. It takes
  the page's `content` (what the admin publishes) and `copy` (words in code).
- `SiteHeader` from `@grade10/ui` — the production auction-first chrome;
  it marks Shows current on `/shows` (`page-shell`).
- `Footer` from `@grade10/design-system/components/layout/footer`.
- `Card` from `@grade10/design-system/components/display/card` — the
  Upcoming Shows card and the stat cards, with `padding={false}` where
  the frames hand the slot insets to the content.
- The block's own pill link list — anchors styled as the pill track, the
  sticky chapter list driven as jump navigation over stacked sections
  rather than as panels.
- `IconButton` (`secondary`) — carousel arrows and the video play
  affordance.
- `Badge` — the edition label on each video poster.
- `Button` — hero actions (`default`, `outline`), chapter press release
  (`ghost`), edition press releases (`secondary`, `md`, trailing arrow).
- `CarouselProgress`/`CarouselProgressItem` — edition photo dots, static
  (no `durationMs`).
- Plain `<img>` for posters/photos and `<iframe>` for the YouTube embed —
  no new primitive.

## States

### Shows

| State | Shows | Anchor |
| --- | --- | --- |
| Wide viewport | Two-column hero (card beside it while it shows), stats beside the photo, editions side by side, records 320px-media rows | `grade10-site-site-shows-SC-02` |
| No upcoming show | The hero keeps its heading and actions with no Upcoming Shows card and no empty frame | `grade10-site-site-shows-SC-12` |
| Narrow viewport | Everything stacked at the page inset; records image-over-text; every chapter stays reachable from the list | `grade10-site-site-shows-SC-03` |
| Entering | Hero reveals on mount; lower sections reveal as they scroll into view | **Out of suite:** the workbench stories' play pass waits on the reveal before asserting |
| Video playing | The poster and play affordance swap for the YouTube embed in place | `grade10-site-site-shows-SC-05` |
| Reduced motion | All content visible immediately, no transition | **Out of suite:** the workbench's `data-storybook-pause-motion` harness, which the page's `motion-reduce` fallback answers |
