# UI: Site not-found

Layout SoT: Storybook page assembly under **Pages/Not Found** — no Figma
frame. The Site index callout already allows shell-adjacent surfaces settled
in Storybook rather than Figma.

## Screens

### Not found

::story{id="pages-not-found--default" title="Not found"}

Site header (auction-first chrome; no nav item current), centred static
title and description from shared `notFound` catalogs, primary Back to Home
(`common.backToHome`), footer.

## Components

| Export / file | Package | Notes |
| --- | --- | --- |
| `SiteHeader` | `@grade10/ui` | Preview supplies auction-first chrome; no item marked current |
| `Footer` | `@grade10/design-system` | Auction footer fixture |
| `Button` | `@grade10/design-system` | Back to Home |
| `VStack` | `@grade10/design-system` | Centred body stack |
| `not-found-page.tsx` | `apps/preview` | Page assembly only — not a `@grade10/ui` export |
| `not-found-content.ts` | `apps/preview` | English fixture matching shared catalogs |

No new design-system primitive or `@grade10/ui` block. Words live in shared
`notFound` and `common.backToHome`.

## Copy

| Element | English |
| --- | --- |
| Title | Nothing is here |
| Description | The link may be wrong, or the page may have moved. |
| CTA | Back to Home |

No pathname or other dynamic content on the surface.

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Unknown address | Static title, description, Back to Home inside the shell | `grade10-site-site-navigation-SC-03`, `grade10-site-site-navigation-SC-26`, `zzz-site-site-navigation-SC-03`, `zzz-site-site-navigation-SC-24` |
| Unlisted surface | No primary nav item marked current | **Out of suite:** already covered by the shell's current-surface rule, `grade10-site-site-page-shell-SC-14` |
