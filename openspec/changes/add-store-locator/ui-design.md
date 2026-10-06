## Screens

### Store Locator (Location & Hours)

Layout SoT: Storybook `pages-store-locator-page--default` and
`pages-store-locator-page--narrow`.

No dedicated Figma frame for this page yet — Mobbin-style Location & Hours
references and the Storybook assembly are the layout source until a Grade10
frame lands. Do not invent a Figma URL.

### Product Details — free pick-up claim

Layout SoT: remains
`redesign-store-product-detail-page` / Product Details stories. This change
makes the Hong Kong Grade10 Store name in free pick-up open Store Locator and
draws Shipping fee as text; it does not redraw the product page.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `StoreLocator` | `@grade10/ui` | **Missing** — Location & Hours compound: map embed, name, address lines, hours rows, Maps destination through props. Storybook currently composes the page in `apps/preview` from primitives |
| `SiteHeader` | `@grade10/ui` | Existing chrome; Store Locator is the last primary-nav item, directly before Help, and current when on the page |
| `Footer` | `@grade10/design-system` | Existing footer; Store Locator is the first link of the Help column, ahead of Docs, where the build carries the store |
| `VStack` | `@grade10/design-system` | Existing stack for details column |

Missing work in this repository: the `StoreLocator` block under
`packages/ui/src/blocks/store-locator/` (compound component). No new design-system
primitive variant or token. Application route, sitemap, and `addressHead` remain
delivery work in grade10.

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Default | Location & Hours heading, map, store name, address lines and hours rows (one per day in the story, Q16); Storybook `pages-store-locator-page--default` | `grade10-site-store-store-locator-SC-01`, `shared-ui-store-locator-SC-02` |
| Map link | The whole map is one link, named for the shop, opening Google Maps in a new tab; the embedded map takes no focus | `grade10-site-store-store-locator-SC-04`, `shared-ui-store-locator-SC-05` |
| Chrome on Store Locator | Header marks Store Locator; footer Help column leads with it | `grade10-site-store-store-locator-SC-06`, `grade10-site-store-store-locator-SC-07`, `grade10-site-store-store-locator-SC-08` |
| Narrow | Map above the details, one column, no sideways scroll; Storybook `pages-store-locator-page--narrow` | `grade10-site-store-store-locator-SC-09` |
| Free pick-up link | The store name in the claim is a link to Store Locator | `grade10-site-store-product-page-SC-25` |
| Shipping fee, no page | ❓ Text, not a link; whether it keeps the redesign's underline is the designer's, recommended plain like the text around it (Q22) | `grade10-site-store-product-page-SC-33` |
| Map not loaded | ❓ The map's place still opens Google Maps; its look is the designer's, recommended its size and muted background with no message (Q19) | `grade10-site-store-store-locator-SC-13` |
| Empty hours (block) | ❓ The hours section is left out; no story yet, pending the designer (Q15) | **Out of suite:** stated nowhere until the designer answers Q15 in `decisions.md`; no requirement takes a side before then |
