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
only makes the Hong Kong Grade10 Store name in free pick-up open Store
Locator; it does not redraw the product page.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `StoreLocator` | `@grade10/ui` | **Missing** — Location & Hours compound: map embed, name, address lines, hours rows, Maps destination through props. Storybook currently composes the page in `apps/preview` from primitives |
| `SiteHeader` | `@grade10/ui` | Existing chrome; Store Locator item current when on the page |
| `Footer` | `@grade10/design-system` | Existing footer; Store Locator link when the surface answers |
| `VStack` | `@grade10/design-system` | Existing stack for details column |

Missing work in this repository: the `StoreLocator` block under
`packages/ui/src/blocks/store-locator/` (compound component). No new design-system
primitive variant or token. Application route, sitemap, and `addressHead` remain
delivery work in grade10.

## States

| State | Spec scenario |
| --- | --- |
| Default Location & Hours (map + name + address + hours) | `grade10-site-store-store-locator-SC-01`, `SC-02`; Storybook `pages-store-locator-page--default` |
| Map opens Google Maps | `grade10-site-store-store-locator-SC-04`, `SC-05` |
| Header / footer reach the page; current marking | `grade10-site-store-store-locator-SC-06`, `SC-07`, `SC-08` |
| Narrow viewport | `grade10-site-store-store-locator-SC-09`; Storybook `pages-store-locator-page--narrow` |
| Distinct title / description (crawlable-pages) | `grade10-site-store-store-locator-SC-03` |
| Free pick-up opens Store Locator | `grade10-site-store-product-page-SC-25` |
| Empty hours omit the hours section (block) | `shared-ui-store-locator-SC-04` |
