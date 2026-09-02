**Author:** @constancetang - 2026-08-28

## Why

Shoppers adding items from the product grid need to adjust quantity without
leaving the tile. The morphing cart control — a primary pill that expands into
an inline stepper on the card image — matches the pattern validated
in prototype and keeps cart edits on the listing surface.

## What Changes

- Replace the icon-only cart button and count badge on `ProductCardImage` with
  a morphing cart control: hover-revealed add affordance, inline stepper while
  focused, collapsed quantity pill when in cart.
- Report cart quantity changes through `onCartQuantityChange(quantity)` instead
  of a single `onCartClick`.
- Extend `ProductCardImageCopy` with stepper control labels supplied once per
  list.

## Non-Goals

- Figma variant axes for expanded/collapsed stepper states.
- Cart drawer or checkout wiring in consuming apps beyond quantity callbacks.

## Capabilities

### Modified Capabilities

- `shared/ui/store-product-listing`: morphing cart control on the product card
  image; quantity stepper overlay; `onCartQuantityChange` contract.

## Impact

- `@grade10/ui`: `ProductCardImage`, `ProductCard`, `ProductList`,
  `ProductBrowse`, `ProductResultsPanel`, stories, fixtures.
- `@grade10/preview`: product list page cart state loop.
- Consuming stores: replace `onProductAction` / `onCartClick` with
  `onProductCartQuantityChange` / `onCartQuantityChange`.
