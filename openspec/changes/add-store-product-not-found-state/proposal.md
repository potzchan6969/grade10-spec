**Author:** @kin - 2026-10-23

## Why

A collector who follows a stale or mistyped Store product link currently sees
the generic site not-found page, even though the Store Product Detail
workbench already defines a product-specific unknown-address state. That
disconnect makes a failed product link look like an unrelated site failure
and sends the collector toward Home instead of back to the catalogue.

**Metric:** click-through from unknown product 404s to the product listing,
with the share of those sessions that leave through the generic Home action
as the regression signal.

## What Changes

- Keep the product route's 404 response when the catalogue has no product for
  the requested handle, but render the Store product page's unknown-product
  surface inside the existing site shell.
- Match the supplied Storybook state: product-specific not-found copy, a
  `Browse the store` action to the product listing, and no product or cart
  controls in the failed state.
- Localize the product-specific copy through the Grade10 message catalogs
  while leaving the generic site-wide not-found words unchanged.
- Add the product-page requirement and regression coverage for the missing
  product state, using the existing Storybook story as the visual reference.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/product-page`: replace the generic site not-found
  treatment for a missing product handle with the Store-specific 404 state
  and product-listing recovery action.

## Impact

- The Grade10 product route and its server-rendered not-found boundary need a
  product-owned page assembly that preserves the existing `SiteShell`.
- `@grade10/i18n` gains the product-specific title, description and browse
  action for every Grade10 locale; the generic `notFound` catalog remains
  unchanged.
- The product-page serving/regression tests cover both the 404 status and the
  Store-specific content, with no new `@grade10/ui` export, design token or
  provider contract.
- The existing Storybook `UnknownProductAddress` state is the design
  reference; it does not require a new screen or shared block.

## References

- [Product Details PRD](../../../docs/prds/products/grade10-site/store/product-page.md)
- [Product Detail · Unknown Product Address](https://storybook.grade10-stg.com/?path=/story/store-product-page-screens-product-detail--unknown-product-address)
- [Site Navigation · One Address, One Surface](../../../docs/prds/products/grade10-site/site/navigation.md#one-address-one-surface)
- [Completed Product Detail Redesign](../redesign-store-product-detail-page/proposal.md)
