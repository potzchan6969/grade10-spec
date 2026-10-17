**Author:** @tangconst - 2026-10-18

## Why

The collector deciding whether a Grade10 show is worth the trip lands on a
`/shows` page built outside the design system, so it drifts from the rest
of the site on type, color, and spacing with every release. The restyle
program rebuilds the public pages on the design system — About went first;
Shows is next.

**Metric:** share of the public site's surfaces rendered on the design
system.

## What Changes

- **The Shows surface on the design system.** `/shows` renders inside the
  same shell as every surface and reads as one page: the hero beside a
  Latest Shows card, an event-scale section with three statistic cards,
  three event-format chapters under a sticky pill tab list — Hong Kong,
  Overseas Partnership, Chinese Mainland — each carrying a video or photo
  presentation and edition cards, and an event-records timeline newest
  first.
- **Edition cards with carousels.** Each edition pages through the live
  show's photo set with arrows and progress dots, and links to its
  press-release article at `/press-releases/{slug}`.
- **Poster-first video containers.** Two chapters carry a YouTube
  presentation that shows the event poster and a play affordance; clicking
  swaps the embed into the same container.
- **Links out of the page.** The hero Press Releases button opens
  `/press-releases`; every Press Release link opens the edition's article.
  Both surfaces are still work in progress — this change ships the
  destinations, not the articles.
- **A composed page in the workbench.** `apps/preview` carries the page
  under `Site/Shows` at a wide and a narrow viewport, so the design system
  renders it before the site does.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/site/shows`: the Shows surface — what the page presents,
  in what order, and where its links lead.

### Modified Capabilities

None.

## Impact

- `apps/preview/src/pages/site/shows/` — the page assembly, its content
  module, and its stories. Media hotlinks the live `grade10.com` assets;
  no fixture files are added.
- `docs/prds/products/grade10-site/site/shows.md` — the capability's PRD
  page.
- The implementing site repo consumes the page through the shared chrome;
  no new component export, no routing, no data fetching.

## Follow-on changes

- The `/press-releases` index and the press-release article surfaces this
  page links to.
- Restyle of the remaining public pages — press, and the front door — on
  the same pattern.

## References

- [Shows · The Page](../../../docs/prds/products/grade10-site/site/shows.md#the-page)
