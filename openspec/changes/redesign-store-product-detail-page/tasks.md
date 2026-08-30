## 1. Shared product copy (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Make `product-page-SC-13`, `product-page-SC-15`, and `product-page-SC-16` pass: add the product-detail labels and pluralized low-inventory copy to the shared English product/store catalogs, preserving fallback behavior for other locales
- [x] 1.2 Verify the i18n catalog resolution and type checks for the updated message vocabulary

## 2. Catalogue contracts and provider projection (grade10)

Depends on group 1 landing in the `grade10-spec` main branch and the
`external/grade10-spec` pointer being updated before frontend copy is consumed.

- [ ] 2.1 Make `product-page-SC-13` pass: carry nullable compare-at money from Shopify product variants through Shopify contracts, GraphQL selection, codecs, mappers, Store contracts, and Store API fixtures
- [ ] 2.2 Make `product-page-SC-15` pass: carry ordered `type`, `world`, and `language` product badges from Shopify product metadata using the documented tag prefixes, omitting absent metadata without inventing labels
- [ ] 2.3 Make `product-page-SC-13` and `product-page-SC-15` pass: extend provider and Store catalog tests so current price, compare-at price, optional badges, media, and availability remain decoded at the port
- [ ] 2.4 Verify with `pnpm run typecheck`, `pnpm run lint`, and the affected Shopify and Store backend/frontend package tests

## 3. Product-detail presentation (grade10)

Depends on group 2's contract and fixture fields being available.

- [ ] 3.1 Make `product-page-SC-13`, `product-page-SC-14`, and `product-page-SC-15` pass: compose the Figma product-detail layout with all media, honest no-image placeholder, breadcrumbs, price context, inventory message, badges, shipping/pickup facts, and SKU
- [ ] 3.2 Make `product-page-SC-16` pass: add the three-line description disclosure with a real button, stable region id, and `aria-expanded` / `aria-controls`
- [ ] 3.3 Make `product-page-SC-17` and existing `product-page-SC-07` through `product-page-SC-10` pass: add the design-system quantity stepper and pending/added states while preserving chosen-variant and cart-line behavior
- [ ] 3.4 Make `product-page-SC-18` and existing `product-page-SC-11` through `product-page-SC-12` pass: keep prices visible, mark unavailable variants, and disable the sold-out action
- [ ] 3.5 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and the product serving/hydration tests
