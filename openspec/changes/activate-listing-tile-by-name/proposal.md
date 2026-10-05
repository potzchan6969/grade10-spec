**Author:** @tangconst - 2026-09-11

## Why

Collectors open a product from the listing by tapping the photo. The name
under the photo looks like a title, not a second way in, so many try the name
first and nothing happens. The surface already reports tile activation; only
the photo was wired.

Metric: share of listing → product-detail navigations that start from the
name control, and drop-off after a name tap that previously did nothing.

## What Changes

- **Name activates** — when the consumer supplies tile activation and the
  product is not sold out, the product name reports the same activation as
  the photo
- **Sold out where the tile sells stays inert** — no name control when sold
  out and a cart handler is supplied, or when no activation callback is
  supplied. A sold-out tile that still opens (no cart handler) is
  `add-store-cross-sell`
- **No new export** — still `ProductCard` / list `onProductClick`; no new
  public name

## Non-Goals

- **Navigation inside the package** — the consumer still decides route or
  modal
- **Always-visible link chrome** — hover / focus underline is the affordance;
  Figma Product Card layout stays the photo + plain name frame
- **Changing cart or price behaviour**
- **Adaptive Filter chrome** — `adapt-listing-filter-drawer`

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: product name is a tile activation target
  alongside the photo

## Impact

- **`@grade10/ui`** — `ProductCard` name control; browse / list / results
  stories supply activation so the name is reachable in Storybook
- **Grade10 site / ZZZ** — already supply `onProductClick`; no new props
- **Manual** — Product Listing and Product Listing Blocks Product Tile
- **Overlap** — `add-store-cross-sell` Q29: this change's sold-out name is
  inert only where a cart handler is supplied; SC-91 owns a sold-out tile
  that still opens

## Open questions

- none — Q1–Q3 are in `decisions.md`

## References

- [Product Listing · Product Tile](../../../docs/prds/products/grade10-site/store/product-listing.md#product-tile)
- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
