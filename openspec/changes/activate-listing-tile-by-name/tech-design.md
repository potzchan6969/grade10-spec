## Context

- **The name already opens** - `ProductCard` computes `opens` once (a
  callback or an address, and not sold out where a cart handler is given)
  and draws the name as `ProductCardActivation` where it holds, plain text
  where it does not; landed with `add-store-cross-sell`
- **The image alone has a second rule** - `ProductCardImage` opens wherever
  it is given a callback or an address (`product-card-image.tsx:92`), sold
  out with a cart handler included; inside a card this never shows, because
  the card passes neither to a tile that does not open
- **The photo is a second stop** - `ProductCardImage` draws its own
  `ProductCardActivation`, named for the product by `aria-label`, ahead of
  the name in document order; Tab inside a selling tile goes photo, cart
  control, name
- **The listing gives a callback, no address** - `ProductListingPage` passes
  `onProductClick`, which navigates to `cardAddress(handle)`; its names are
  buttons, and giving its tiles their addresses is the listing's own round
  ([Product Listing Blocks](../../../docs/prds/products/shared/ui/store-product-listing.md),
  Product decisions, Tile as a link)
- **Every surface opens without a page load** - the listing and the front
  door's row navigate in their callbacks
  (`apps/frontend/grade10/src/pages/store/ProductListingPage.tsx:575`,
  `StoreHomePage.tsx:226`), and `useInAppLinks`
  (`apps/frontend/grade10/src/chrome/useInAppLinks.ts`, mounted in
  `root.tsx:259`) takes a plain press on the rail's links as a router
  navigation, so the product page's rule needs no code
- **Tests find the photo by role** - the grade10 helpers and four unit test
  files read the photo as a control named for the product

## Goals / Non-Goals

**Goals**

- **One rule, one place** - whether a product opens is one function, which
  `ProductCard` and `ProductCardImage` both call; the photo, the name and the
  image used alone never decide it apart
- **No type change** - `ProductCardProps`, `ProductCardImageProps` and the
  package entry's exports stay as they are; `ProductCardImage` used alone
  changes behaviour only for a sold-out product given a cart handler, which
  no consumer renders

**Non-Goals**

- **Addresses on the listing** - the listing keeps its callback
- **A pointer target outside a card** - a `ProductCardImage` used alone is
  not a tile, so it keeps its named, focusable control

## Decisions

### One function decides when a product opens

- **`productCardOpens`** - in `product-card-activation.tsx` beside
  `ProductCardActivation`, exported from the module and not from the package
  entry: true given `onClick` or `href`, unless `soldOut` and
  `onCartQuantityChange` are both given
- **`ProductCard`** - calls it for the name, and passes `onClick` and `href`
  to the photo's well unchanged
- **`ProductCardImageWell`** - the well both the image alone and the card
  draw (next section) calls it in place of `onClick != null || href != null`,
  so the photo never decides apart from the name; `ProductCardImage`'s
  `onClick`, `href` and `name` docs drop the claim that the card filters
  them, and say the image applies the tile's rule and names its control by
  `name`
- **Rejected: `name` required on `ProductCardImageProps`** - Figma's Product
  Card Image set carries no name, so its Code Connect example would stop
  compiling, and a well that does not open names nothing; the requirement
  names the control by the name supplied with it, as Q10 makes the name a
  supplied fact, and the prop's doc says the image that opens needs it
- **Rejected: the card filtering what it passes, as now** - the image used
  alone would keep its own rule
- **Stories** - `SoldOutWithHandler`, the image alone sold out with no cart
  handler, still opens; its doc says the image applies the tile's rule, not
  that the card decides

### Inside a card, the photo is a pointer target

The spec governs which control is the stop and what is announced. The
implementation:

- **`ProductCardImageWell`** - the body of `product-card-image.tsx`, which
  decides whether the photo opens by `productCardOpens`, taking
  `ProductCardImageProps` and `pointerOnly`, exported from the module and not
  from the package entry, as `ProductCardActivation` already is
- **`ProductCardImage`** - renders the well with `pointerOnly={false}`;
  unchanged for every consumer
- **`ProductCard`** - renders the well with `pointerOnly`
- **`ProductCardActivation`** gains `pointerOnly` - sets `tabIndex={-1}` and
  `aria-hidden`, and the well drops its `aria-label`; the link keeps its
  `href`, so a modifier press and a copied address still work from the photo
- **Rejected: a `pointerOnly` prop on `ProductCardImageProps`** - widens the
  export contract for a bit only the card sets
- **Rejected: a context from `ProductCard`** - a second, implicit path for one
  value the card already passes as a prop
- **Rejected: the name as a stretched link over the whole tile** - the focus
  ring would outline the card, which the design does not draw, and the cart
  control and badges inside the photo would have to stack above the link's
  overlay

### Tab order inside a selling tile is cart control, then name

Document order keeps the photo well, with its cart control, ahead of the
name, as Figma draws them. With the photo out of the order, the cart control
is the first stop and its own focus reveals it through the well's
`:focus-within`, so the keyboard reveal holds without the photo.

- **Rejected: reordering the DOM or a positive `tabIndex`** - the visual and
  reading order would part

### The grade10 tests read the photo by its slot

A tile now carries one control named for its product, so a role query finds
the name alone.

- **`listingCardTitle`** - the one control named for the product, with no
  `img` filter
- **`listingCardPhoto`** - `[data-slot="product-card-image"] a,
  [data-slot="product-card-image"] button` inside the
  `[data-slot="product-card"]` that holds the title control
- **`cart-count.spec.ts`** - reads cards by `[data-slot="product-card"]` in
  the Products region rather than climbing from the photo button
- **Rejected: a test id on the photo** - the slot already names it

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

- **Deploy** - the store's groups land; grade10 bumps `external/grade10-spec`
  with group 3 in the same pull request
- **Rollback** - revert the bump; no data moves
