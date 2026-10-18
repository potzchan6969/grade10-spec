## 1. The Media Coverage page in the workbench (grade10-spec)

- [ ] 1.1 The `Site/Media Coverage/Screens/Media Coverage` stories' play
  pass asserts the heading, the media cards' publications and titles,
  the external link destinations and both viewports
  (`g10.site-media-coverage.SC-zem`, `g10.site-media-coverage.SC-20b`,
  `g10.site-media-coverage.SC-npo`, `g10.site-media-coverage.SC-ozy`) —
  ticked last, in its own commit before the group's code
- [ ] 1.2 Compose the page at `apps/preview/src/pages/site/media-coverage/`:
  the production chrome, the heading block, the coverage as a grid of
  media cards, each card the external link to its story, and the
  wide/narrow layouts (`g10.site-media-coverage.SC-zem`,
  `g10.site-media-coverage.SC-20b`, `g10.site-media-coverage.SC-npo`,
  `g10.site-media-coverage.SC-ozy`)
- [ ] 1.3 Update the capability PRD
  `docs/prds/products/grade10-site/site/media-coverage.md` with the 🚧
  lines this change delivers
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run storybook:check`, `pnpm run check:manual`, and the
  media-coverage-page story tests

## 2. The walk (grade10-spec)

Uses draft `feature-tcs.md` as its planning input, and the groups it walks
landed. The interface the collector uses is the page itself, walked in the
workbench stories.

- [ ] 2.1 Walk `grade10-site-site-media-coverage-US-01` — open the page at
  a wide and a narrow viewport and read it top to bottom
- [ ] 2.2 Walk `grade10-site-site-media-coverage-US-02` — follow a media
  card and confirm the destination it names
- [ ] 2.3 Flip the cases the walks decide with
  `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
  own commit; the ones that stay manual are named in the suite and in the
  walk's `rounds.md` row
- [ ] 2.4 Verify: `pnpm run tcs:validate`
