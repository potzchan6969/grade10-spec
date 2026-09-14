## 1. Shared product copy (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Make `grade10-site-store-product-page-SC-13`, `grade10-site-store-product-page-SC-15`, and `grade10-site-store-product-page-SC-16` pass: add the product-detail labels and pluralized low-inventory copy to the shared English product/store catalogs, preserving fallback behavior for other locales
- [x] 1.2 Verify the i18n catalog resolution and type checks for the updated message vocabulary

## 2. Catalogue contracts and provider projection (grade10) (owner: @kinisworking)

Depends on group 1 landing in the `grade10-spec` main branch and the
`external/grade10-spec` pointer being updated before frontend copy is consumed.

- [x] 2.1 Make `grade10-site-store-product-page-SC-13` pass: carry nullable compare-at money from Shopify product variants through Shopify contracts, GraphQL selection, codecs, mappers, Store contracts, and Store API fixtures
- [x] 2.2 Make `grade10-site-store-product-page-SC-15` pass: carry ordered `type`, `world`, and `language` product badges from Shopify product metadata using the documented tag prefixes, omitting absent metadata without inventing labels
- [x] 2.3 Make `grade10-site-store-product-page-SC-13` and `grade10-site-store-product-page-SC-15` pass: extend provider and Store catalog tests so current price, compare-at price, optional badges, media, and availability remain decoded at the port
- [x] 2.4 Verify with `pnpm run typecheck`, `pnpm run lint`, and the affected Shopify and Store backend/frontend package tests

## 3. Product-detail presentation (grade10) (owner: @kinisworking)

Depends on group 2's contract and fixture fields being available.

- [ ] 3.1 Make `grade10-site-store-product-page-SC-13`, `grade10-site-store-product-page-SC-14`, and `grade10-site-store-product-page-SC-15` pass: compose the Figma product-detail layout with all media, honest no-image placeholder, breadcrumbs, price context, inventory message, contract-backed badges, static fulfilment guidance, and SKU
- [x] 3.2 Make `grade10-site-store-product-page-SC-16` pass: add the three-line description disclosure with a real button, stable region id, and `aria-expanded` / `aria-controls`
- [x] 3.3 Make `grade10-site-store-product-page-SC-17` and existing `grade10-site-store-product-page-SC-07` through `grade10-site-store-product-page-SC-10` pass: add the design-system quantity stepper and pending/added states for the product's one sellable item without rendering a size, option, or variant choice
- [x] 3.4 Make `grade10-site-store-product-page-SC-18` and existing `grade10-site-store-product-page-SC-11` pass: keep the product price visible and disable the sold-out action when its one item is unavailable
- [x] 3.5 Verify with `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and the product serving/hydration tests

## 5. Description disclosure (grade10) (owner: @kinisworking)

- [x] 5.1 Make `grade10-site-store-product-page-SC-16` hold across narrow and wide layouts and supported locales: replace character-count overflow estimation with a disclosure decision based on actual rendered overflow, keeping the first server and client render identical and retaining a usable disclosure while layout is measured
- [x] 5.2 Verify short, long, narrow, resized and expanded descriptions with focused page/browser coverage, serving and hydration tests, `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`

The stock ceiling and remaining-count work described by the frontend completion
plan is delivered by `hold-cart-quantity-to-stock`, groups 3 and 5. Do not add
a second stock helper or threshold to this change.

## 6. Product manual (grade10-spec)

Depends on the remaining frontend groups landing and on the stock-limit change's
manual task coordinating any overlapping product-page edits.

- [ ] 6.1 Update `docs/prds/products/grade10-site/store/product-page.md` to describe the shipped product-detail surface and its product decisions without duplicating requirements; verify with `pnpm check:manual`
