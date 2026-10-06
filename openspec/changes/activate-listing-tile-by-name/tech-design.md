## Context

- **The name already opens** — `ProductCard` computes `opens` once (a
  callback or an address, and not sold out where a cart handler is given)
  and draws the name as `ProductCardActivation` where it holds, plain text
  where it does not; landed with `add-store-cross-sell`
- **The photo is a second stop** — `ProductCardImage` draws its own
  `ProductCardActivation`, named for the product by `aria-label`, ahead of
  the name in document order; Tab inside a selling tile goes photo, cart
  control, name
- **The listing gives a callback, no address** — `ProductListingPage` passes
  `onProductClick`, which navigates to `cardAddress(handle)`; its names are
  buttons, and giving its tiles their addresses is the listing's own round
  ([Product Listing Blocks](../../../docs/prds/products/shared/ui/store-product-listing.md),
  Product decisions, Tile as a link)
- **Tests find the photo by role** — the grade10 helpers and four unit test
  files read the photo as a control named for the product

## Goals / Non-Goals

**Goals**

- **One rule, one place** — whether a tile opens stays `ProductCard`'s one
  computation; the photo and the name never decide it apart
- **No contract change** — `ProductCardProps`, `ProductCardImageProps` and
  the package entry's exports stay as they are

**Non-Goals**

- **Addresses on the listing** — the listing keeps its callback
- **The image used alone** — a `ProductCardImage` outside a card is not a
  tile, so it keeps its named, focusable control

## Decisions

### Inside a card, the photo is a pointer target

The spec governs which control is the stop and what is announced. The
implementation:

- **`ProductCardImageWell`** — the body of `product-card-image.tsx`, taking
  `ProductCardImageProps` and `pointerOnly`, exported from the module and not
  from the package entry, as `ProductCardActivation` already is
- **`ProductCardImage`** — renders the well with `pointerOnly={false}`;
  unchanged for every consumer
- **`ProductCard`** — renders the well with `pointerOnly`
- **`ProductCardActivation`** gains `pointerOnly` — sets `tabIndex={-1}` and
  `aria-hidden`, and the well drops its `aria-label`; the link keeps its
  `href`, so a modifier press and a copied address still work from the photo
- **Rejected: a `pointerOnly` prop on `ProductCardImageProps`** — widens the
  export contract for a bit only the card sets
- **Rejected: a context from `ProductCard`** — a second, implicit path for one
  value the card already passes as a prop
- **Rejected: the name as a stretched link over the whole tile** — the focus
  ring would outline the card, which the design does not draw, and the cart
  control and badges inside the photo would have to stack above the link's
  overlay

### Tab order inside a selling tile is cart control, then name

Document order keeps the photo well, with its cart control, ahead of the
name, as Figma draws them. With the photo out of the order, the cart control
is the first stop and its own focus reveals it through the well's
`:focus-within`, so the keyboard reveal holds without the photo.

- **Rejected: reordering the DOM or a positive `tabIndex`** — the visual and
  reading order would part

### The grade10 tests read the photo by its slot

A tile now carries one control named for its product, so a role query finds
the name alone.

- **`listingCardTitle`** — the one control named for the product, with no
  `img` filter
- **`listingCardPhoto`** — `[data-slot="product-card-image"] a,
  [data-slot="product-card-image"] button` inside the
  `[data-slot="product-card"]` that holds the title control
- **`cart-count.spec.ts`** — reads cards by `[data-slot="product-card"]` in
  the Products region rather than climbing from the photo button
- **Rejected: a test id on the photo** — the slot already names it

## Risks / Trade-offs

- **[Risk] The submodule bump breaks every grade10 test that reads the photo
  by role** → the bump and the slot-reading fixes land in one commit; group
  3's verify runs the e2e specs that use the helpers and the unit suite
- **[Risk] `aria-hidden` on a link a pointer can focus** → `tabIndex={-1}`
  keeps it out of the sequential order, so no keyboard or reading-cursor path
  lands on a hidden control; the a11y addon's `aria-hidden-focus` rule checks
  the card stories
- **[Trade-off] A touch screen-reader user cannot reach the photo** → the
  name is the announced control by decision Q6, and it opens the same
  product

## Migration Plan

- **Deploy** — the store's groups land; grade10 bumps `external/grade10-spec`
  with group 3 in the same pull request
- **Rollback** — revert the bump; no data moves
