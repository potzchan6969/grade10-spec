**Author:** @kinisworking - 2026-08-18

## Why

A shopper browsing a category is about to meet product tiles that do not match
the published design. The listing frame in Figma
([4098:1868](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868))
draws a photo, a SALE or SOLD OUT overlay, an optional cart control with a
count, a row of badges, a name, and a price. The shared tile still draws a
category line, a description, a full-width Add button, a wishlist heart, and a
quantity stepper — and it fills in `Add`, `Sold Out`, and `Add to wishlist`
when the consumer supplies nothing. Those three strings are not in the Figma
set; they are defaults in
`packages/ui/src/blocks/store-product-listing/product-card.tsx`, left over from
the first listing-surface change, which mapped older `isSoldOut` /
`isAddedToCart` axes onto controls Figma no longer draws.

The first store to ship a listing will copy that tile, and the second will
inherit it. The published `Product / Product Card Image` set (`4274:10074`)
also has no code file, so the overlay Figma actually designed cannot be reused
on a search result or a merchandising rail.

**Metric:** number of listing tiles in this repository that match the published
`Product / Product Card` and `Product / Product Card Image` sets — from zero
(today's stories and preview page) to every story that renders a tile.

## What Changes

- **A new `ProductCardImage` export** in `@grade10/ui`, matching Figma set
  `Product / Product Card Image`. Independently renderable. Photo, optional
  sale label, sold-out treatment, hover/focus cart control, in-cart count.
- **BREAKING rewrite of `ProductCard` and `ProductSummary`.** The tile becomes
  the image, a consumer-supplied badge slot, the name, and the prices. Category,
  description, Add, wishlist, and the quantity stepper go away. Cart lives on
  the image. `addedToCart` is renamed `inCart`.
- **`ProductList` and `ProductBrowse` follow the new tile.** They stop
  forwarding wishlist and quantity-stepper callbacks. Column count is
  unchanged.
- **`StatusIndicator` lands in `@grade10/design-system`**, at
  `src/components/display/` next to `Badge` — the common primitive path, not
  the listing block. The in-cart count is Figma's `count` / `brand` rung of
  that set (`4174:37`).
- **`IconButton` gains the Figma rungs the cart control uses** (`secondary`,
  `md`). Existing `ghost` / `xs` stay; other surfaces still use them.

## Non-Goals

- **The rest of the listing page.** `FilterPanel`, `ProductListHeader`,
  `CollectionBanner`, pagination, and the `ProductBrowse` layout stay as they
  are. The page-level filter tree is an unpublished local frame; the header
  pills mix sort and filter with no confirmed selection model.
- **Wishlist on the listing tile.** Figma does not draw it here. A later
  surface can add it if the design does.
- **Filtering, sorting, pagination, or cart logic.** The tile reports a cart
  action and displays the supplied count. What is in the cart is the
  application's.
- **A PRD.** Aligning a published Figma set is not a merchandising judgment a
  requirement cannot hold.
- **Publishing Code Connect to the shared Figma file.** Templates are written
  here; the publish step stays attended.
- **Removing `IconButton`'s `xs` rung.** Figma's set now lists `md` / `sm`;
  reconciling a dropped `xs` is a separate primitive change. Nav still uses it.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared-ui/store-product-listing`: add `ProductCardImage`; rewrite the tile
  contract to the published card and card-image sets; drop category,
  description, Add, wishlist, and quantity-stepper from the tile.

## Impact

- **Shared UI (`@grade10/ui`)** — this repository. New `ProductCardImage`.
  Breaking prop changes on `ProductCard`, `ProductList`, `ProductBrowse`, and
  `ProductSummary`. Code Connect templates for the card and the new image.
  Stories and fixtures updated. Preview page fixtures updated so the assembled
  listing still compiles.
- **Design system (`@grade10/design-system`)** — this repository.
  `StatusIndicator` is a new primitive. `IconButton` adds `secondary` and `md`.
- **grade10 SPA / zzz-store** — no production import of these exports yet. They
  pick up the new contract on the next submodule bump that builds a listing.
- **Filter panel, list header, collection banner, browse layout** — untouched.
