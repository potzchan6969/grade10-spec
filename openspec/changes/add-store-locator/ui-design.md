## Screens

### Store Locator (Location & Hours)

Layout SoT: Storybook `pages-store-locator-page--default` and
`pages-store-locator-page--narrow`.

No Figma frame draws this page. The Storybook assembly is the agreed look
(Q14) until a frame lands in draw-store-locator-page. Do not invent a Figma
URL.

### Product Details — free pick-up claim

Layout SoT: remains
`redesign-store-product-detail-page` / Product Details stories. This change
makes the Hong Kong Grade10 Store name in free pick-up open Store Locator and
draws Shipping fee as text; it does not redraw the product page.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `StoreLocator` | `@grade10/ui` | **Missing** — Location & Hours compound: map embed, name, address lines, hours rows, Maps destination through props. Storybook currently composes the page in `apps/preview` from primitives |
| `SiteHeader` | `@grade10/ui` | Existing chrome; Store Locator sits directly before Help, which ends the primary nav, and is current when on the page |
| `Footer` | `@grade10/design-system` | Existing footer; Store Locator is the first link of the Help column, ahead of Docs, where the build carries the store |
| `VStack` | `@grade10/design-system` | Existing stack for details column |

Missing work in this repository: the `StoreLocator` block under
`packages/ui/src/blocks/store-locator/` (compound component). No new design-system
primitive variant or token. Application route, sitemap, and `addressHead` remain
delivery work in grade10.

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Default | Location & Hours heading, map, store name, address lines and hours rows, one per day, Monday first (Q16); Storybook `pages-store-locator-page--default` | `grade10-site-store-store-locator-SC-01`, `shared-ui-store-locator-SC-02` |
| Map link | The whole map is one link, named from the map's link copy, opening Google Maps in a new tab; the embedded map takes no focus | `grade10-site-store-store-locator-SC-04`, `shared-ui-store-locator-SC-05` |
| Chrome on Store Locator | Header marks Store Locator; footer Help column leads with it | `grade10-site-store-store-locator-SC-06`, `grade10-site-store-store-locator-SC-07`, `grade10-site-store-store-locator-SC-08` |
| Narrow | Map above the details, one column, no sideways scroll; Storybook `pages-store-locator-page--narrow` | `grade10-site-store-store-locator-SC-09` |
| Free pick-up link | The store name in the claim is a link to Store Locator | `grade10-site-store-product-page-SC-25` |
| Shipping fee, no page | Text, not a link, plain like the text around it, with no underline (Q22) | `grade10-site-store-product-page-SC-38` |
| Map not loaded | The map's place still opens Google Maps; the box keeps its size and muted background, with no message (Q19) | `grade10-site-store-store-locator-SC-13` |
| Empty hours (block) | Not a state: the hours are a required non-empty list, as the Maps destination is required (Q15) | `shared-ui-store-locator-SC-07` |
