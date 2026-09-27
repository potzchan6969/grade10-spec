**Author:** @tangconst - 2026-09-09

## Why

On a phone the listing's Add to cart stays hidden until something is already
in the cart — fine-pointer hover never happens — so the only tap is the
product page. The same gap shows up in a narrow Storybook or tablet width on
a desktop mouse: hover is available, but there is no hover over a crowded
one-column grid the way there is on a wide desktop tile.

## What Changes

- **Phone and narrow cart always visible** — where the surface sells, the
  round cart control stays visible on coarse pointers, when hover is
  unavailable, and below the wide listing breakpoint; fine-pointer hover and
  keyboard focus reveal stay as they are on a wide viewport

## Non-Goals

- **Photo fit / multiply** — sibling listing changes
- **Sort defaults** — `default-listing-sort-to-latest`
- **Selling without a quantity handler** — still opt-in
- **Adaptive Filter drawer** — `adapt-listing-filter-drawer`

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: coarse / no-hover pointers and narrow
  viewports keep the cart control visible

## Impact

- **`@grade10/ui`** — `ProductCardImage` cart reveal media queries
- **Scenario ids** — SC-65 (coarse / no-hover), SC-66 (narrow viewport)
- **Overlap** — fine-pointer hover behaviour on a wide viewport stays; this
  change narrows only the coarse and narrow-viewport cases

## Open questions

- none

## References

- [Product Listing Blocks](../../../docs/prds/products/shared/ui/store-product-listing.md)
- [Product Listing](../../../docs/prds/products/grade10-site/store/product-listing.md)
