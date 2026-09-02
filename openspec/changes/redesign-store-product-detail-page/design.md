# Design — redesign-store-product-detail-page

## Context

The archived `grade10-site/store/product-page` change already supplies a
server-rendered product route, a catalogue-backed product read, variant
selection, and cart-line semantics. The current `ProductPage` only composes a
vertical title, one image, a price, and the existing buy box. The supplied
Figma frame (`4098:2423`) is a visual redesign of that same surface rather
than a new address or a new checkout boundary.

The design system already publishes the components used by the frame:
`Breadcrumbs`, `BreadcrumbItem`, `BreadcrumbSeparator`, `Badge`, `Button`,
`Link`, `Stepper`, `HStack`, and `VStack`. `Nav` and `Footer` already belong to
the application shell. No design-system gap requires a new component or
token.

## Decisions

### Keep the route and the shell seams

`apps/frontend/grade10/src/routes/store-product.tsx` remains the route and
continues to load the product before rendering. `ProductPage` remains the
page-owned composition root, and `ProductBuyBox` remains the shared store
feature's purchase view. The shell continues to own `Nav` and `Footer`, so the
page adds only the Figma frame's content between those landmarks.

The alternative is to move the full layout into the shared package. Rejected:
the page owns locale-aware breadcrumbs, shipping destinations, and brand copy,
while the shared feature should remain free of application routing and brand
decisions.

### Use the existing catalogue path for display metadata

Shopify remains the source of product facts. The Shopify catalogue contract
will add a nullable compare-at money value to each variant and an ordered
product-badge list. The Store contract carries the same display-ready shape.
The Shopify adapter reads `productType` and display tags using these explicit
tag prefixes:

- `world:<label>` supplies the world/IP badge.
- `language:<label>` supplies the TCG language badge.

The Shopify product type supplies the product-type badge. Missing values are
omitted; the UI never guesses a badge from the title, handle, collection, or
variant name. The provider and Store fixtures carry the sample values needed
to exercise the Figma state.

The alternative is to make the page parse arbitrary tags or infer labels from
titles. Rejected: it would make presentation copy depend on undocumented
catalogue strings and could show a false product facet.

### Preserve variant semantics while matching the single-variant frame

The Figma frame shows one general quantity stepper, while the existing product
capability supports multiple graded variants. The page keeps the existing
variant chooser for products that have more than one variant, but does not
render that extra choice for a single-variant product. The price and inventory
context follow the variant the page prices; the selected variant passed to the
buy box still follows the existing rules.

The stepper uses the design-system `Stepper` with a minimum of one and a
finite maximum when the selected variant exposes a positive quantity. The
buy box passes the chosen quantity to the existing cart use case. Pending,
success, and cart quantity are observed from the existing mutation/query
state rather than duplicated in storage.

### Make the page deterministic and accessible

The media column renders all supplied images in order, using the product's
alternative text, and renders a gradient placeholder with an accessible name
when the list is empty. The details rail is sticky on wide containers and
stacks below the media column on narrow containers. All layout values use the
existing Tailwind/theme tokens and utilities.

The description starts collapsed and uses a real button with
`aria-expanded` and `aria-controls`; the visible region owns a stable local
id from `useId`. No browser-only API is read during render, and the initial
collapsed state is identical in the server render and browser hydration.

The alternative is a CSS-only truncation with an anchor. Rejected: it cannot
report disclosure state accessibly and would turn an in-place interaction into
a navigation seam.

### Keep copy in the shared catalogs

The new labels (`Shop`, `About This Item`, `Shipping & Pickup`, `Shipping
calculated at checkout`, `Free pick-up at`, `Only X left`, `Show more`,
`Show less`, `Adding...`, `Added to cart`, and `Sold out`) are added to the
shared product/store message catalog. Other locales fall back through the
existing catalog-resolution mechanism until translations are supplied.

## Data model

No database tables or columns change. The display facts remain in Shopify and
cross the existing catalogue wire:

| Field | Shape | Owner |
| --- | --- | --- |
| `ProductVariant.compareAtPrice` | nullable money: integer minor units plus ISO currency code | Shopify catalogue |
| `Product.badges` | ordered list of `{ kind, label }`, where kind is `type`, `world`, or `language` | Shopify catalogue metadata |

The Store API schema accepts absent badge data as an empty list for backward
compatibility with a bundle or fixture that predates the field. It never
accepts a fabricated default label.

## Contracts

- `packages/shopify/contracts/src/catalog.ts` adds the provider-neutral
  compare-at and badge shapes.
- `packages/shopify/backend/src/wire/queries.ts`, codecs, mappers, and
  catalog fixtures carry the fields from Shopify.
- `packages/grade10-store/contracts/src/schemas.ts` exposes them through the
  Store catalogue response.
- `packages/grade10-store/frontend/src/features/products/product` carries
  the same decoded values to `ProductPage`.

## Risks / Trade-offs

- Shopify stores that have not adopted the display-tag convention show fewer
  badges, but the page remains honest and usable.
- The sticky rail changes only layout; it does not create a second scroll
  container, so the whole page remains vertically scrollable as the Figma
  annotation requires.
- The old multi-variant product tests need updated queries around the new
  visual hierarchy, but their variant/cart assertions remain required.
- The page uses local display state for disclosure and the existing cart query
  for add state; neither is server-authoritative and neither enters checkout
  pricing.

## Migration Plan

1. Land the shared product copy in the `grade10-spec` main branch.
2. Bump `external/grade10-spec` in `grade10`.
3. Add the provider and Store contract fields with fixture coverage.
4. Replace the page composition and buy-box controls, then run the serving,
   hydration, package, and application gates.

## Open Questions

None. Badge source and omission behavior, variant compatibility, route
ownership, and validation boundaries were settled before implementation.
