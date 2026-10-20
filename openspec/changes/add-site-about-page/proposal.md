**Author:** @tangconst - 2026-10-17

## Why

The collector who wants to know who is behind Grade10 — who backs it, what
it does, where it is going — lands on an `/about` page built outside the
design system, so it drifts from the rest of the site on type, color, and
spacing with every release. The restyle program rebuilds the public pages
on the design system, and About is the first of them.

**Metric:** share of the public site's surfaces rendered on the design
system.

## What Changes

- **The About surface on the design system.** `/about` renders inside the
  same shell as every surface and reads as one page: the brand heading and
  introduction, What we do and Where we're going side by side on a wide
  viewport and stacked on a narrow one, and a quiet parent-company panel
  with the MemeStrategy mark and its milestones newest first.
- **Links out of the page.** MemeStrategy, 9GAG and Grade10 AI open in a
  new tab, and the Grade10 mention in the milestones opens the front door.
  Vaulting services and Grade10 Finance are named as plain text until they
  launch.
- **A Market indexes section.** The four index pages — Hat Price Index,
  PTCG100, PTCG500, OPCG100 — are highlighted ahead of the parent-company
  panel, each opening its live index page in a new tab.
- **A composed page in the workbench.** `apps/preview` carries the page
  under `Site/About` at a wide and a narrow viewport, so the design system
  renders it before the site does.
- **Body copy tightened from the frame.** The Figma text was reviewed for
  filler and unsupported superlatives; the page carries the tightened
  wording, which diverges from the frame until design syncs it back.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/site/about`: the About surface — what the page presents, in
  what order, and where its links lead.

### Modified Capabilities

None.

## Impact

- `apps/preview/src/pages/site/about/` — the page assembly, its content
  module, its stories, and the MemeStrategy logo fixture.
- `docs/prds/products/grade10-site/site/about.md` — the capability's PRD
  page, already written.
- The implementing site repo consumes the page through the shared chrome;
  no new component export, no routing, no data fetching.

## Follow-on changes

- Restyle of the remaining public pages — press, shows, and the front door —
  on the same pattern.

## References

- [About · The Page](../../../docs/prds/products/grade10-site/site/about.md#the-page)
