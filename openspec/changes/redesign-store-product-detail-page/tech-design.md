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

The remaining delivery work has two boundaries:

- **Optional facts** — group 4 waits for the Store contract owner to expose
  typed shipping guidance and pickup location fields; the page does not parse
  provider metadata or invent a location
- **Description disclosure** — group 5 replaces the character-count estimate
  with a post-layout overflow decision while keeping server rendering and
  hydration deterministic

The stock ceiling and remaining-count behavior in the frontend completion plan
belongs to `hold-cart-quantity-to-stock`, groups 3 and 5. This change consumes
that change's landed product-model and buy-box boundary; it does not introduce
a second stock threshold or duplicate its presentation task.

## Goals / Non-Goals

**Goals**

- **Typed product facts** — render supplied shipping guidance and pickup
  location through the existing product read and frontend boundary
- **Layout-aware disclosure** — decide whether the description needs a control
  from its rendered three-line region, not from a character budget
- **Stable purchase contract** — keep route ownership, variant choice, cart
  mutation, and stock authority at their existing boundaries

**Non-Goals**

- **Provider work** — no Shopify query, API, database, webhook, or deployment
  change for the remaining frontend groups
- **Stock-policy work** — no new ceiling or scarcity rule; those belong to
  `hold-cart-quantity-to-stock`
- **Design-system work** — no new export, variant, or token

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

### Measure description overflow after layout

The page renders the description in its collapsed three-line state during the
server render and the first client render. It keeps the disclosure control
usable while the browser measures the collapsed region, then hides the control
only when the rendered content fits. A `ResizeObserver` or equivalent layout
signal rechecks the decision when the container width or active locale changes.
Expanding the description removes the clamp; collapsing it restores the
measured state without changing the product address.

The alternative is to keep the fixed character budget in the product model.
Rejected: line wrapping changes with width, font, and locale, so the model
cannot decide whether the rendered region exceeds three lines.

### Wait for typed optional facts

The frontend facts group starts only after the Store contract owner supplies
typed optional shipping guidance and pickup location fields. The page reads
those values through the existing decoded product repository boundary, omits
absent values, and uses catalog copy for platform labels. It does not infer a
location from tags, title, product type, or shipping checkout text.

The alternative is to parse the current provider metadata in the page.
Rejected: it moves provider vocabulary into the application and would make an
absent fact indistinguishable from a guessed one.

### Consume stock-limit ownership from its own change

The product page and buy box share the quantity state and stock feedback
defined by `hold-cart-quantity-to-stock`. Its product-model group owns the
finite ceiling and single scarcity rule; its product-page group owns the
remaining-count presentation. The redesign keeps its existing quantity and
cart scenarios and does not add parallel helpers or thresholds.

The alternative is to add a second stock helper to this change. Rejected: two
rules for the same shop count would let the stepper and the message disagree.

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
- `packages/shopify/backend/src/catalog/{queries,codecs,mappers}.ts` and the
  catalog fixtures carry the fields from Shopify.
- `packages/grade10-store/contracts/src/schemas.ts` exposes them through the
  Store catalogue response.
- `packages/grade10-store/frontend/src/features/products/product` carries
  the same decoded values to `ProductPage`.
- The remaining product-facts group adds no new endpoint. It consumes the
  typed optional fields supplied by the Store contract owner once that
  contract lands.

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
- An upstream facts contract can arrive after the frontend plan is written →
  keep group 4 blocked until the typed fields and supplied/absent fixtures
  exist; do not substitute provider parsing.
- Layout measurement can briefly precede the overflow decision → keep the
  control in the SSR-safe initial render and hide it only after a measured
  collapsed region proves that no disclosure is needed.
- A stock change can land beside this redesign → keep the stock model and
  threshold in `hold-cart-quantity-to-stock`, and consume its shared boundary
  rather than adding a second rule here.

## Migration Plan

1. Land the shared product copy in the `grade10-spec` main branch.
2. Bump `external/grade10-spec` in `grade10`.
3. Land the typed optional shipping and pickup facts contract before claiming
   the frontend facts group.
4. Complete the description disclosure group with layout measurement and
   serving, hydration, package, and application coverage.
5. Land the stock model and product-page work through
   `hold-cart-quantity-to-stock`, without duplicating its helpers here.
6. Run the remaining product-page acceptance checks on the chosen integration
   build.

## Open Questions

None. Badge source and omission behavior, variant compatibility, route
ownership, and validation boundaries were settled before implementation.
