**Author:** @tangconst - 2026-10-18

## Why

The journalist, partner, or collector checking Grade10's record lands on
a `/press-releases` page built outside the design system, so it drifts
from the rest of the site on type, color, and spacing with every release.
The restyle program rebuilds the public pages on the design system —
About and Shows landed; Press is next.

**Metric:** share of the public site's surfaces rendered on the design
system.

## What Changes

- **The Press surface on the design system.** `/press-releases` renders
  inside the same shell as every surface and reads as one page: a PRESS
  eyebrow over "Press Releases" and the official-record intro, a year
  filter, and the releases grouped by year newest first.
- **A year filter.** An All Time dropdown over the list narrows the
  record to one year; the menu carries an option per year the record
  holds.
- **Releases as links.** Each release row — date, title, arrow — is the
  link to its `/press-releases/{slug}` article. The article surface is
  still work in progress — this change ships the destinations, not the
  articles.
- **A composed page in the workbench.** `apps/preview` carries the page
  under `Site/Press` at a wide and a narrow viewport, so the design
  system renders it before the site does.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/site/press`: the Press surface — what the page presents,
  how the filter narrows it, and where its links lead.

### Modified Capabilities

None.

## Impact

- `apps/preview/src/pages/site/press/` — the page assembly, its content
  module, and its stories. The release list mirrors the live
  `grade10.com/press-releases` record; no fixture files are added.
- `docs/prds/products/grade10-site/site/press.md` — the capability's PRD
  page.
- The implementing site repo consumes the page through the shared chrome;
  no new component export, no routing, no data fetching.

## Follow-on changes

- The press-release article surfaces this page links to.
- Restyle of the remaining public pages on the same pattern.

## References

- [Press · The Page](../../../docs/prds/products/grade10-site/site/press.md#the-page)
