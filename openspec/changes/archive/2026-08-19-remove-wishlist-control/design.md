# Design: remove wishlist control

Capability specs:
[`shared/ui/site-chrome`](../../specs/shared/ui/site-chrome/spec.md),
[`shared/ui/store-product-listing`](../../specs/shared/ui/store-product-listing/spec.md),
[`grade10-site/site/page-shell`](../../specs/grade10-site/site/page-shell/spec.md).
See proposal.md for motivation.

## Context

`Nav` already omits a control with no handler; the preview storefront still
passes a no-op wishlist handler, so the heart shows. `ProductCard` always
draws the heart on an available tile, handler or not. Both export the
wishlist props as part of the public contract.

## Decisions

### Delete the props, do not gate them

Wishlist leaves the contract. Optional handlers on `Nav` would still let a
consumer draw a heart with nothing behind it, and `ProductCard` never gated
on a handler in the first place.

- *Rejected — keep `onWishlistClick` and hide when it is omitted.* That
  preserves a control no store answers, and the card would keep drawing an
  inert heart unless its rendering rule changed too.
- *Rejected — leave the props and stop passing them from grade10.* The tile
  would still show the heart; the shared contract would still name a
  wishlist action.

### One cut across chrome and listing

The header heart and the tile heart are the same product choice. Removing
only one would leave the other as a save that still does nothing.

- *Rejected — header only, or tile only.*

### Figma stays as published for this change

`Nav` (`4171:9937`) and `Product Card` (`4200:155`) still draw a heart. Code
Connect already omits wishlist props. This change records the mismatch;
republishing the sets without the heart is a separate design edit.

- *Rejected — editing the Figma sets in this change.* Publishing a library
  set is a human plugin step, and the Code Connect templates do not map the
  heart.

## Risks / Trade-offs

- [Figma still draws the heart] → Recorded in ui.md. A designer copying the
  frame will see a control Storybook no longer renders until the sets are
  republished.
- [Consumers still pass the old props] → Typecheck fails on the removed
  names. No runtime fallback.

## Migration Plan

Drop `onWishlistClick` and `wishlistLabel` from every `Nav` and
`ProductCard` call site, and `onProductWishlistClick` from `ProductList` /
`ProductBrowse`. Submodule bump in each consuming application. No data
migration.
