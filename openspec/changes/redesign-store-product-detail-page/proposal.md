**Author:** @kin - 2026-08-30

## Why

The Store's product address currently renders a minimal vertical page even
though the approved Grade10 Store design defines a media-led detail surface
with purchase context, shipping information, and clear inventory states. This
gap makes the product page harder to scan and leaves important catalogue facts
such as compare-at pricing, low inventory, and product facets unavailable at
the point of purchase.

The metric is the percentage of product-detail sessions that add an item to
the cart, segmented by product and device width; the redesign should improve
that rate without changing which variant or price the Store accepts.

## What Changes

- Rebuild the Grade10 Store product-detail surface to match the supplied Figma
  frame across desktop and narrow layouts.
- Display all product media, compare-at pricing, low-inventory context,
  optional product badges, shipping and pickup information, and SKU data.
- Add the Figma quantity stepper and in-place add states while preserving
  existing variant selection, cart-line merging, sold-out refusal, and
  server-rendered product content.
- Extend the catalogue contract and Shopify projection with optional
  compare-at pricing and ordered product badges. Shopify remains authoritative
  and absent metadata remains absent in the UI.
- Add the product-detail copy required by the surface to the shared message
  catalogs.

## Non-Goals

- New product routes, checkout flows, wishlist behavior, image zoom, or a
  lightbox.
- A product or inventory mirror in Postgres.
- Inventing product type, world, language, shipping fee, or store-locator
  values when the catalogue does not provide them.
- New design-system components, variants, or tokens.
- Changes to the archived product-page routing, sitemap, or not-found
  behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-store/product-page`: add the Figma-aligned product-detail
  presentation, metadata, gallery, quantity control, and accessible
  description states while preserving the existing page and cart contract.

## Impact

- `packages/shopify/contracts` and `packages/shopify/backend` gain the
  provider-facing compare-at and product-badge fields.
- `packages/grade10-store/contracts`, `packages/grade10-store/backend`, and
  their fixtures expose the display-ready catalogue data.
- `packages/grade10-store/frontend` and
  `apps/frontend/grade10/src/pages/store` change the shared buy box and the
  Grade10 page composition.
- `external/grade10-spec/packages/i18n` gains shared product-detail copy;
  the application submodule must be bumped after that commit lands.
- Existing SSR, hydration, catalog-authority, variant-choice, and cart tests
  remain required validation gates.
