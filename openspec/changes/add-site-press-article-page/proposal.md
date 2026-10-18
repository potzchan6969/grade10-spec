**Author:** @tangconst - 2026-10-18

## Why

Every release row on `/press-releases` — and every Press Release link on
`/shows` — names a `/press-releases/{slug}` article the redesign has not
drawn yet: the list page ships the destinations, and the surface they
open does not exist on the design system. The restyle program rebuilds
the public pages on the design system — About, Shows and the Press
record landed; the article template the record leads to is next.

**Metric:** share of the public site's surfaces rendered on the design
system.

## What Changes

- **The press-release article template.** `/press-releases/{slug}`
  renders inside the same shell as every surface: a Press breadcrumb
  back to the record, the release's title with its publish date and
  location badges, the 1200:630 feature image that doubles as the
  article's OG image, and the article body — the elements an editor
  composes in the admin portal (paragraphs, headings, lists,
  blockquotes, images with or without captions) drawn in the template's
  own styles.
- **A fixed sidebar.** Three cards every article shares — About
  Grade10, About MemeStrategy, Media Enquiries — sticky beside the body
  on a wide viewport, after it on a narrow one.
- **A composed page in the workbench.** `apps/preview` carries the
  template under `Site/Press` as `Screens/Press Release` with one real
  article — the CARDJOY x Grade10 Guangzhou release — at a wide and a
  narrow viewport; the Press list's rows and the Shows page's
  press-release links open it.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/site/press`: the capability's surface grows the article
  each release leads to — the template's header, body and sidebar, and
  the breadcrumb's way back to the record.

## Impact

- `apps/preview/src/pages/site/press/` — the article page assembly, its
  content module, and its stories; the sample carries the live Guangzhou
  release verbatim with media hotlinked from `cdn.sanity.io`.
- `apps/preview/src/pages/workbench-story-nav.ts` —
  `/press-releases/{slug}` routes to the article screen.
- `docs/prds/products/grade10-site/site/press.md` — the capability's
  PRD page.
- The implementing site repo consumes the page through the shared
  chrome; no new component export, no routing, no data fetching.

## Follow-on changes

- The admin portal's article editing surface for the same template.
- Restyle of the remaining public pages on the same pattern.

## References

- [Press · The Page](../../../docs/prds/products/grade10-site/site/press.md#the-page)
