**Author:** @tangconst - 2026-10-18

## Why

The journalist, partner, or collector checking what the press says about
Grade10 lands on a `/media-coverage` page built outside the design
system, so it drifts from the rest of the site on type, color, and
spacing with every entry. The restyle program rebuilds the public pages
on the design system — About, Shows and Press landed; Media Coverage is
next.

**Metric:** share of the public site's surfaces rendered on the design
system.

## What Changes

- **The Media Coverage surface on the design system.** `/media-coverage`
  renders inside the same shell as every surface and reads as one page:
  an IN THE NEWS eyebrow over "Media Coverage" and the external-reporting
  intro, then the coverage as a grid of media cards.
- **Coverage as links.** Each media card — publication, title, Read
  article affordance — is the link to its story on the publisher's site,
  opened in a new tab.
- **A composed page in the workbench.** `apps/preview` carries the page
  under `Site/Media Coverage` at a wide and a narrow viewport, so the
  design system renders it before the site does.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/site/media-coverage`: the Media Coverage surface — what
  the page presents, and where its cards lead.

### Modified Capabilities

None.

## Impact

- `apps/preview/src/pages/site/media-coverage/` — the page assembly, its
  content module, and its stories. The card list mirrors the live
  `grade10.com/media-coverage` record; no fixture files are added.
- `apps/preview/src/pages/workbench-story-nav.ts` — the `/media-coverage`
  route row.
- `docs/prds/products/grade10-site/site/media-coverage.md` — the
  capability's PRD page.
- The implementing site repo consumes the page through the shared chrome;
  no new component export, no routing, no data fetching. Entries are
  edited in the Admin Portal like any CMS list.

## Follow-on changes

- Restyle of the remaining public pages on the same pattern.

## References

- [Media Coverage · The Page](../../../docs/prds/products/grade10-site/site/media-coverage.md#the-page)
