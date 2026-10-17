## 1. The About page in the workbench (grade10-spec)

- [ ] 1.1 The `Site/About/Screens/About` stories' play pass asserts the
  sections, the link destinations and both viewports
  (`g10.site-about.SC-01`..`SC-06`) — ticked last, in its own commit before
  the group's code
- [ ] 1.2 Compose the page at `apps/preview/src/pages/site/about/`: the
  production chrome, the four sections in order, the link destinations
  table, the milestone card newest first with Coming soon, and the
  wide/narrow layouts (`g10.site-about.SC-01`, `g10.site-about.SC-02`,
  `g10.site-about.SC-03`, `g10.site-about.SC-04`, `g10.site-about.SC-05`,
  `g10.site-about.SC-06`)
- [ ] 1.3 Update the capability PRD
  `docs/prds/products/grade10-site/site/about.md` with the 🚧 lines this
  change delivers
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run storybook:check`, `pnpm run check:manual`, and the about-page
  story tests

## 2. The walk (grade10-spec)

Uses draft `feature-tcs.md` as its planning input, and the groups it walks
landed. The interface the collector uses is the page itself, walked in the
workbench stories.

- [ ] 2.1 Walk `grade10-site-site-about-US-01` — open the page at a wide
  and a narrow viewport and read it top to bottom
- [ ] 2.2 Walk `grade10-site-site-about-US-02` — follow every link on the
  page and confirm the destination and the tab behavior it names
- [ ] 2.3 Flip the cases the walks decide with
  `pnpm run tcs:automated <case…> --decided-by <walk path>` in the walks'
  own commit; the ones that stay manual are named in the suite and in the
  walk's `rounds.md` row
- [ ] 2.4 Verify: `pnpm run tcs:validate`
