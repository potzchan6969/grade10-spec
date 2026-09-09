**Author:** @tangconst - 2026-09-09

## Why

On a phone the listing's Add to cart stays hidden until something is already
in the cart — fine-pointer hover never happens — so the only tap is the
product page.

## What Changes

- **Phone cart always visible** — where the surface sells, the round cart
  control stays visible on coarse pointers and when hover is unavailable;
  fine-pointer hover and keyboard focus reveal stay as they are

## Non-Goals

- **Photo fit / multiply** — sibling listing changes
- **Sort defaults** — `default-listing-sort-to-latest`
- **Selling without a quantity handler** — still opt-in

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: coarse / no-hover pointers keep the cart
  control visible

## Impact

- **`@grade10/ui`** — `ProductCardImage` cart reveal media queries
- **Scenario id** — SC-65
- **Overlap** — fine-pointer hover behaviour in the durable image requirement
  stays; this change narrows only the coarse case

## Open questions

- none
