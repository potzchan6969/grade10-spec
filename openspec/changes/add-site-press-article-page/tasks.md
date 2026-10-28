## 1. The Press Release article in the workbench (grade10-spec)

- [x] 1.1 The `Site/Press/Screens/Press Release` stories' play pass
  asserts the breadcrumb's Press crumb and current label, the title,
  the date and location badges, the feature image, the body's headings
  and quotes, the three sidebar cards and both viewports
  (`g10.site-press.SC-06`..`SC-12`) — ticked last, in its own commit
  before the group's code
- [x] 1.2 Compose the page at `apps/preview/src/pages/site/press/`: the
  production chrome, the Press breadcrumb, the title with its badges,
  the 1200:630 feature image, the CMS block renderer over
  `press-article-content.ts`, the sticky sidebar of three fixed cards,
  and the wide/narrow layouts (`g10.site-press.SC-06`, `g10.site-press.SC-08`,
  `g10.site-press.SC-09`, `g10.site-press.SC-10`, `g10.site-press.SC-11`,
  `g10.site-press.SC-12`)
- [x] 1.3 Draw every body element at `Site/Press/Parts/Article Blocks` —
  paragraph runs, headings two through six, both list styles, the pull
  quote, and figures with and without captions
  (`g10.site-press.SC-09`, `g10.site-press.SC-10`)
- [x] 1.4 Route `/press-releases/{slug}` in `workbench-story-nav.ts` to
  the article screen, so a release row and the Shows page's links open
  it (`g10.site-press.SC-07`)
- [x] 1.5 Update the capability PRD
  `docs/prds/products/grade10-site/site/press.md` with the 🚧 lines this
  change delivers
- [x] 1.6 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run storybook:check`, `pnpm run check:manual`, and the
  press-article story tests

## 2. The walk (grade10-spec)

Uses draft `feature-tcs.md` as its planning input, and the groups it walks
landed. The interface the collector uses is the page itself, walked in the
workbench stories.

- [ ] 2.1 Walk `grade10-site-site-press-US-04` — open a release's article
  at a wide and a narrow viewport and read it top to bottom
- [ ] 2.2 Walk `grade10-site-site-press-US-05` — follow the breadcrumb's
  Press crumb back to the record
- [ ] 2.3 Flip the cases the walks decide with
  `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
  own commit; the ones that stay manual are named in the suite and in the
  walk's `rounds.md` row
- [ ] 2.4 Verify: `pnpm run tcs:validate`
