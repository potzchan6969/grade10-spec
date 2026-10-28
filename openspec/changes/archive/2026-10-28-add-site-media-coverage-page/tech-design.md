## Context

See [proposal.md](proposal.md#why) and [decisions.md](decisions.md); the
journeys sit beside the capability under `specs/`. Paths are
`grade10-spec`'s unless marked `grade10`.

The page is in two places and both already stand on `main`:

- **The block** - `MediaCoverageGrid` and `MediaCoverageCard` in
  `packages/ui/src/blocks/site-media-coverage/`, exported from
  `@grade10/ui` with `MediaCoverageContent`, `MediaCoverageCopy` and
  `MediaItem`. The grid is the eyebrow, `h1` and intro over a `ul` of
  cards: one column, two at `sm`, four at `lg`, a 400ms mount reveal that
  `motion-reduce` skips. The eyebrow is written sentence-case and drawn
  uppercase by `uppercase` (the PRD's "Eyebrow style" line). Each card is
  one `<a target="_blank" rel="noopener noreferrer">` around a `Card`
  carrying publication (`truncate`), title (`line-clamp-3`, four at `sm`)
  and the Read article row with `ArrowUpRight`.
- **The workbench page** - `apps/preview/src/pages/site/media-coverage/`:
  `media-coverage-page.tsx` composes `SiteHeader` (no item current),
  the grid and `Footer`; `media-coverage-content.ts` holds the copy and
  the live `grade10.com` record verbatim (Q1); the stories
  `Site/Media Coverage/Screens/Media Coverage` (`Default`, `Narrow`).
  `workbench-story-nav.ts` routes `/media-coverage` to the `Default` story.
- **The site** (`grade10`, commit `cbf7c212c4`) -
  `apps/frontend/grade10/src/routes/media-coverage.tsx` is a live
  surface (`surfaces.ts` `mediaCoverage`, kind `live`, address
  `/media-coverage`): its `loader` reads `readCoverage()` from
  `@grade10/press-frontend/coverage` on every request and maps it with
  `mediaCoverageOf` (`@grade10/press-frontend/article`) into `MediaItem`s,
  `null` giving `[]`. `pages/press/MediaCoveragePage.tsx` hands the items
  and the copy in `pages/press/pressContent.ts` to `MediaCoverageGrid`.
  The chrome is the site's shell, not the page's. The company site's old
  `/about/media-coverage/*` is withdrawn.

## Goals / Non-Goals

**Goals:**

- One block renders the page in the workbench and on the site; the site
  adds data, never layout
- A requirement is proven where it can be seen: layout and link behaviour
  in the stories, the published list and the served document in the site's
  tests

**Non-Goals:**

- Navigation placement, routing, share metadata, editing, filters - as in
  [Non-Goals](decisions.md#non-goals)
- A new component export: the three types and two components above are
  the contract, unchanged by this change

## Decisions

### The block is shared; the content source is not

The workbench carries the live record as a static list (Q1) so the design
system renders the page before the site does. The site never imports it:
its items are whatever the Admin Portal has published, read per request.
Both reach the same `MediaCoverageContent` shape, so a requirement stated
about cards holds for either source and no scenario names the source.

### Presentation lives in the card, not in tokens

The frame's card overrides (`rounded-3xl`, `min-h-48`/`sm:min-h-56`,
`p-5`/`sm:p-6`, hover lift, `border-strong`, weakened house shadow,
`secondary-foreground` label) are classes on `MediaCoverageCard`, because
the published `Card` binds `radius-2xl` and `gap-4`. They stay overrides
(Q6 in [decisions.md](decisions.md#decisions)); moving them is a block edit
that both surfaces pick up.

### Hover, clamp, reveal and reduced motion are CSS

Per [ui-design.md](ui-design.md#states) those states are out of suite. No
test asserts a pseudo-state; the stories' play pass waits for the reveal
before asserting, and the `motion-reduce` classes answer the harness's
paused-motion mode.

### Narrow and wide are read from the story viewport

The `Narrow` story sets `globals.viewport` to `mobile2`; wide is the
default 1440 frame. Layout is asserted from the rendered grid
(computed column count of the `ul`), not from class names.

## Compatibility

- No contract, route table, schema or export changes; the site's
  surface, loader and withdrawn addresses are as shipped.
- An unpublished list (`null`) renders the header with no cards and no
  message (Q8).

## Risks / Trade-offs

- The site's page and the workbench's page assemble the same block twice;
  a block change is covered by both suites, and the site's page test pins
  the items-to-cards path the stories cannot see.
- The e2e for the site seeds one entry and checks only its `target`; the
  rest of the link contract (`rel`, destination, whole-card activation) is
  asserted at component level, where it needs no seeded backend.

## Validation

- **Workbench** - `pnpm run storybook:check`, the story play pass for
  `Default` and `Narrow`, `typecheck`, `lint`, `check:manual`.
- **Site (`grade10`)** - a `MediaCoveragePage` test over the real block
  for the cards, columns and links; the existing `surfaces.test.ts` and
  `hydration.test.tsx` (served markup adopted by hydration) keep guarding
  the surface; `e2e/tests/site/company-pages.spec.ts` for the seeded
  story opening in a new tab.

## Migration Plan

None: the code is on `main` in both repositories. This change adds the
scenario-citing tests the requirements name and walks the result.

## Open Questions

None: the empty state, card order and language marking are settled as
Q8 to Q10 in [decisions.md](decisions.md).
