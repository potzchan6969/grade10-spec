**Author:** @constancetang - 2026-08-18

## Why

The header and every product tile currently offer a heart that saves nothing.
No store answers a wishlist surface, so the control is either absent (the
header, when no handler is passed) or present and inert (every available
product tile, which draws the heart even without one). A collector who taps
it gets no save, no confirmation, and no way to find the product again.
Removing the control stops that dead end; the share of listing taps that go
to a working action should rise as a result.

## What Changes

- **`Nav` drops the wishlist control.** **BREAKING:** `onWishlistClick` and
  `wishlistLabel` are removed. Search, account, and cart remain handler-gated.
- **`ProductCard` drops the wishlist control.** **BREAKING:** `onWishlistClick`
  and `wishlistLabel` are removed from the card, from `ProductSummary`, and
  from the list and browse callbacks that forwarded them. The heart is gone
  from every tile, including sold-out ones that already hid it.
- **The grade10 shell stops naming wishlist as a deferred header control.**
  Search and cart remain the controls that wait for a surface.

## Capabilities

- **New Capabilities:** none
- **Modified Capabilities:**
  - `shared/ui/site-chrome`: wishlist is no longer a header control
  - `shared/ui/store-product-listing`: a product tile has no wishlist action
  - `grade10-site/site/page-shell`: the header's deferred-control list no longer
    includes wishlist

## Impact

- `@grade10/design-system`: `Nav` / `NavProps`, stories.
- `@grade10/ui`: `ProductCard`, `ProductList`, `ProductBrowse`,
  `ProductSummary`, fixtures, and stories.
- `apps/preview`: drop the wishlist handler and label from the storefront
  assembly.
- Consuming applications must stop passing `onWishlistClick`,
  `wishlistLabel`, and `onProductWishlistClick`. Typecheck catches leftovers.

## Non-goals

- Adding a wishlist surface, saved-items page, or later reintroduction of
  the control.
- Changing search, account, cart, or locale in the header.
- Changing the product tile's cart action, quantity stepper, or sold-out
  treatment.
- Republishing the Figma `Nav` and `Product Card` sets. Those frames still
  draw a heart; this change records that mismatch rather than editing the
  file.
