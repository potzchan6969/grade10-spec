**Author:** @kin - 2026-08-30

## Why

The Store's product address currently renders a minimal vertical page even
though the approved Grade10 Store design defines a media-led detail surface
with purchase context, shipping information, and a clear sold-out state. This
gap makes the product page harder to scan and leaves important catalogue facts
such as compare-at pricing and product facets unavailable at the point of
purchase.

The intended outcome is a higher product-detail add rate by product, without
changing which product item or price the Store accepts. This change adds no
analytics instrumentation; the existing event contract does not support
device-width segmentation.

## What Changes

- Rebuild the Grade10 Store product-detail surface to match the supplied Figma
  frame across desktop and narrow layouts.
- Display all product media, compare-at pricing, availability and sold-out
  state with no remaining count, optional product badges, static shipping and
  pickup guidance, and SKU data.
- Add the Figma quantity stepper and in-place add states for the product's one
  sellable item, with no size, option or variant choice on the page.
- Keep the underlying Shopify sale identifier for cart-line merging and
  sold-out refusal, without exposing it as a product choice or display label.
- Remove multi-item product fixtures and copy that imply a product has sizes,
  options or variants.
- Extend the catalogue contract and Shopify projection with optional
  compare-at pricing and ordered product badges. Shopify remains authoritative
  and absent metadata remains absent in the UI.
- Add the product-detail copy required by the surface to the shared message
  catalogs.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/product-page`: add the Figma-aligned product-detail
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
- Existing SSR, hydration, catalogue-authority, single-item cart, and sold-out
  tests remain required validation gates.
