## Screens

### Press Release

- [Desktop frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=7204-10315) — 1440 × 3296.
- No small-viewport frame exists; the narrow layout derives from the
  About page's collapse convention, with the sidebar cards stacking
  after the body — decided by the designer.
- Workbench render: `Site/Press/Screens/Press Release` (`Default`,
  `Narrow`) in `apps/preview/src/pages/site/press/`; every element the
  body can carry is drawn at `Site/Press/Parts/ArticleBlocks`.
- The sample carries the live CARDJOY x Grade10 Guangzhou release
  verbatim — the frame was drafted over it — with media hotlinked from
  the site's `cdn.sanity.io` assets.

## Components

- `SiteHeader` from `@grade10/ui` — the production auction-first chrome,
  rendered with no item marked current.
- `Footer` from `@grade10/design-system/components/layout/footer`.
- `Breadcrumbs`/`BreadcrumbItem`/`BreadcrumbSeparator` — the Press crumb
  back to `/press-releases`, the current crumb the fixed label "Press
  Release".
- `Badge` — the publish date with `CalendarBlank` and the location with
  `MapPin`, default variant.
- `Card` (`padding={false}`, `p-6`) — the three fixed sidebar cards:
  About Grade10, About MemeStrategy, Media Enquiries.
- `Link` — the enquiries card's `mailto:` line.
- Plain anchors for inline body links — the frame binds
  `Custom/primary-border` (#C4903D, the `orange-400`
  `Base/accent-foreground` resolves to) at regular weight with a resting
  underline; `Link` is `inline-flex` and cannot wrap mid-sentence.
- `border-primary-border` — the blockquote's left rule, the frame's
  `Custom/primary-border` binding.
- Body blocks are the feature's own renderer over the content model in
  `press-article-content.ts` — the CMS-shaped blocks an editor composes;
  no new primitive or block.

## States

### Press Release

| State | Shows | Anchor |
| --- | --- | --- |
| Wide viewport | Body in the 2fr column; the three cards sticky in the 1fr column beside the feature image and body | `grade10-site-site-press-SC-11` |
| Narrow viewport | One column: breadcrumb, title, badges, feature image, body, then the cards | `grade10-site-site-press-SC-12` |
| Figure with caption | Image over its caption in `Base/secondary-foreground` — the frame's first figure binds `muted-foreground`, the rest `secondary-foreground`; the majority binding wins | `grade10-site-site-press-SC-09` |
| Figure without caption | The image alone, nothing below | `grade10-site-site-press-SC-10` |
| Entering | Breadcrumb, header, image, body and cards reveal on mount in staggered order | **Out of suite:** the workbench stories' play pass waits on the reveal before asserting |
| Reduced motion | All content visible immediately, no transition | **Out of suite:** the workbench's `data-storybook-pause-motion` harness, which the page's `motion-reduce` fallback answers |
