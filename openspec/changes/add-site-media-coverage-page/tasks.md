## 1. The Media Coverage page in the workbench (grade10-spec) (owner: @seankcw)

The block, the page and the stories landed with the restyle program; what
this group owes is the tests that cite the scenarios.

- [x] 1.1 The `Site/Media Coverage/Screens/Media Coverage` stories' play
  pass names each scenario it proves: `Default` asserts the `h1`, every
  card's publication and title, the four-across grid and each link's
  `target`, `rel` and `https` destination; `Narrow` asserts the single
  column and the same cards; the cards keep the content module's order
  and a story with a language marks it
  (`g10.site-media-coverage.SC-zem`, `g10.site-media-coverage.SC-20b`,
  `g10.site-media-coverage.SC-npo`, `g10.site-media-coverage.SC-ozy`,
  `g10.site-media-coverage.SC-h4k`, `g10.site-media-coverage.SC-w2d`)
- [x] 1.2 Confirm the shipped page at
  `apps/preview/src/pages/site/media-coverage/` and the block in
  `packages/ui/src/blocks/site-media-coverage/` meet the tests; repair
  only what 1.1 fails
  (`g10.site-media-coverage.SC-zem`, `g10.site-media-coverage.SC-20b`,
  `g10.site-media-coverage.SC-npo`, `g10.site-media-coverage.SC-ozy`)
- [x] 1.3 Verify: `pnpm run typecheck`, `pnpm run lint`,
  `pnpm run storybook:check`, `pnpm run check:manual`, and the
  media-coverage story tests

## 2. The Media Coverage page on the site (grade10) (owner: @seankcw)

The route, loader, page and copy landed in `cbf7c212c4`; the tests below
come first and the implementation is only repaired if they fail.

- [x] 2.1 Add `MediaCoveragePage.test.tsx` beside the page: published
  items render as cards naming publication and title under the heading
  block, each card one `a` with `target="_blank"` and
  `rel="noopener noreferrer"` to its `href`; the cards run in the items'
  order; a story with a `lang` marks it on the link; no items draws the
  heading block, no cards and no message
  (`g10.site-media-coverage.SC-zem`, `g10.site-media-coverage.SC-ozy`,
  `g10.site-media-coverage.SC-h4k`, `g10.site-media-coverage.SC-q7m`,
  `g10.site-media-coverage.SC-w2d`)
- [x] 2.2 Extend `e2e/tests/site/company-pages.spec.ts`: the seeded story
  opens its destination in a new tab, and the layout is one column at a
  narrow viewport and four across at a wide one
  (`g10.site-media-coverage.SC-20b`, `g10.site-media-coverage.SC-npo`,
  `g10.site-media-coverage.SC-ozy`)
- [x] 2.3 Repair `routes/media-coverage.tsx` and
  `pages/press/MediaCoveragePage.tsx` if 2.1 or 2.2 fails
- [x] 2.4 Verify: the package's typecheck and lint, `surfaces.test.ts`,
  `hydration.test.tsx`, and the new tests

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input, and the groups it walks
landed. Walks the site at `/media-coverage`.

- [ ] 3.1 Walk `grade10-site-site-media-coverage-US-01` - open the page at
  a wide and a narrow viewport and read it top to bottom
- [ ] 3.2 Walk `grade10-site-site-media-coverage-US-02` - follow a media
  card and confirm the destination it names
- [ ] 3.3 Flip the cases the walks decide with
  `pnpm run tcs:automated <case...> --decided-by <walk path>`; the ones
  that stay manual are named in the suite and in the walk's `rounds.md` row
- [ ] 3.4 Verify: `pnpm run tcs:validate`
