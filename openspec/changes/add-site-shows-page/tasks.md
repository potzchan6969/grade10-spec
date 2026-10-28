## 1. The Shows page in the workbench (grade10-spec)

- [ ] 1.1 The `Site/Shows/Screens/Shows` stories' play pass asserts the
  sections, the link destinations, the video swap, the carousel paging and
  both viewports (`g10.site-shows.SC-01`..`SC-07`, `SC-09`, `SC-10`, `SC-13`) — ticked last, in its
  own commit before the group's code
- [ ] 1.2 Feed the shared `ShowsPageBody` block (`packages/ui/src/blocks/site-shows`) at
  `apps/preview/src/pages/site/shows/` with the hardcoded content and copy,
  ZZZ and NOV 2025 settled, the block's embed started on one click (Q19; `autoplay=1` and
  `allow="autoplay"` in `shows-event-video.tsx`): the production chrome, the four sections in order, the upcoming-shows card,
  the statistic cards, the sticky chapter tab list as jump navigation, the
  poster-first video containers, the edition carousels, the
  press-release destinations table, the records in frame order, and the
  wide/narrow layouts (`g10.site-shows.SC-01`, `g10.site-shows.SC-02`,
  `g10.site-shows.SC-03`, `g10.site-shows.SC-04`, `g10.site-shows.SC-05`,
  `g10.site-shows.SC-06`, `SC-07`, `SC-09`, `SC-10` and `SC-13`)
- [ ] 1.3 Update the capability PRD
  `docs/prds/products/grade10-site/site/shows.md` with the 🚧 lines this
  change delivers
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run storybook:check`, `pnpm run check:manual`, and the shows-page
  story tests
- [ ] 1.5 Name the evidence for the scenarios the site serves and the
  workbench cannot show (`g10.site-shows.SC-08`, `SC-11`, `SC-12` and `SC-14`..`SC-18`: the
  Hong Kong month filter, the unpublished release and chapter link, nothing
  published, the reader's language, the base-text fallback): the site's
  `showsPageOf` mapper tests, and route loader tests for the not-found answer
  and the Hong Kong clock (`dayValue(new Date(), config.timeZone)`) where
  none exists yet, linked from the group's landing summary

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
