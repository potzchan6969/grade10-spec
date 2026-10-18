## 1. The Press page in the workbench (grade10-spec)

- [x] 1.1 The `Site/Press/Screens/Press` stories' play pass asserts the
  heading, the year groups, the link destinations, the year filter and
  both viewports (`g10.site-press.SC-01`..`SC-05`) — ticked last, in its
  own commit before the group's code
- [x] 1.2 Compose the page at `apps/preview/src/pages/site/press/`: the
  production chrome, the heading block, the All Time year filter, the
  releases grouped by year newest first, each row the link to its
  article, and the wide/narrow layouts (`g10.site-press.SC-01`,
  `g10.site-press.SC-02`, `g10.site-press.SC-03`, `g10.site-press.SC-04`,
  `g10.site-press.SC-05`)
- [x] 1.3 Update the capability PRD
  `docs/prds/products/grade10-site/site/press.md` with the 🚧 lines this
  change delivers
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run storybook:check`, `pnpm run check:manual`, and the press-page
  story tests

## 2. The walk (grade10-spec)

Uses draft `feature-tcs.md` as its planning input, and the groups it walks
landed. The interface the collector uses is the page itself, walked in the
workbench stories.

- [ ] 2.1 Walk `grade10-site-site-press-US-01` — open the page at a wide
  and a narrow viewport and read it top to bottom
- [ ] 2.2 Walk `grade10-site-site-press-US-02` — follow a release row and
  confirm the destination it names
- [ ] 2.3 Walk `grade10-site-site-press-US-03` — filter to a year and back
  to All Time, confirming the groups shown
- [ ] 2.4 Flip the cases the walks decide with
  `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
  own commit; the ones that stay manual are named in the suite and in the
  walk's `rounds.md` row
- [ ] 2.5 Verify: `pnpm run tcs:validate`
