## 1. The Shows page in the workbench (grade10-spec)

- [x] 1.1 The `Site/Shows/Screens/Shows` stories' play pass asserts the
  sections, the link destinations, the video swap, the carousel paging and
  both viewports (`g10.site-shows.SC-01`..`SC-07`) — ticked last, in its
  own commit before the group's code
- [x] 1.2 Compose the page at `apps/preview/src/pages/site/shows/`: the
  production chrome, the four sections in order, the latest-shows card,
  the statistic cards, the sticky chapter tab list as jump navigation, the
  poster-first video containers, the edition carousels, the
  press-release destinations table, the records in frame order, and the
  wide/narrow layouts (`g10.site-shows.SC-01`, `g10.site-shows.SC-02`,
  `g10.site-shows.SC-03`, `g10.site-shows.SC-04`, `g10.site-shows.SC-05`,
  `g10.site-shows.SC-06`, `g10.site-shows.SC-07`)
- [x] 1.3 Update the capability PRD
  `docs/prds/products/grade10-site/site/shows.md` with the 🚧 lines this
  change delivers
- [x] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run storybook:check`, `pnpm run check:manual`, and the shows-page
  story tests

## 2. The walk (grade10-spec)

Uses draft `feature-tcs.md` as its planning input, and the groups it walks
landed. The interface the collector uses is the page itself, walked in the
workbench stories.

- [ ] 2.1 Walk `grade10-site-site-shows-US-01` — open the page at a wide
  and a narrow viewport and read it top to bottom
- [ ] 2.2 Walk `grade10-site-site-shows-US-02` — follow every press-release
  link on the page and confirm the destination it names
- [ ] 2.3 Walk `grade10-site-site-shows-US-03` — activate both chapter
  videos and confirm the embed replaces the poster in place
- [ ] 2.4 Flip the cases the walks decide with
  `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
  own commit; the ones that stay manual are named in the suite and in the
  walk's `rounds.md` row
- [ ] 2.5 Verify: `pnpm run tcs:validate`
