## Context

- **One element draws every tile's photo** — the `<img>` in
  `ProductCardImage` (`packages/ui/src/blocks/store-product-listing/product-card-image.tsx`),
  inside a well that is a square, rounded, `overflow-hidden` box painted with
  the gray-50 → gray-100 gradient. `ProductCard` composes it; nothing else
  draws a tile photo
- **Three surfaces compose the tile** — the store listing
  (`apps/frontend/grade10/src/pages/store/ProductListingPage.tsx`), the store
  home row (`StoreHomePage.tsx` beside it) and You May Also Like
  (`packages/grade10-store/frontend/src/features/products/product/presentation/views/ProductRelatedRail.tsx`).
  They pass the photo's address and nothing about its shape
- **The address keeps the photo's shape** — `productSummary` passes the
  shop's own photo, or the rail's resized by width alone
  (`packages/grade10-store/frontend/src/features/products/product/presentation/mappers/productSummary.ts:48`),
  so the shop's CDN never crops or pads it; the well alone decides the fit
- **The code already holds the fit** — b632582fe set `object-contain` ahead
  of acceptance, and the application's pin carries it. What is missing is a
  test that fails without it, and a story that shows a photo that is not
  square

## Decisions

The spec governs what the shopper sees: the whole photo, centred, and the well
filling the rest. This file decides where that lives and how it is held.

### The well owns the fit, in CSS on the one element

- **`object-contain` on the `<img>`** — scales the photo, up or down, until it
  meets the two edges along its longer side, centred on the other axis, its
  default `object-position`. The well's gradient shows in the space the photo
  leaves
- **No prop** — the fit is not a consumer choice; a prop would let one
  surface crop again. The three surfaces take the change by submodule bump
  with no code change
- **Rejected: pad the photo square at the CDN** — `pad_color` on the address
  would bake one well colour into the photo, and the gradient would show a
  seam against it
- **Rejected: measure the photo and switch fit in script** — the browser
  already does it from the photo's own size, deterministically, before
  paint

### Tests read the painted photo, not the class

- **Geometry, not class names** — a play test waits for the photo to decode,
  then computes the painted box from `naturalWidth`, `naturalHeight` and the
  element's box under its computed `object-fit` and `object-position`. It
  passes when the painted box lies inside the well on every side, meets the
  well's two edges along the photo's longer side, and is centred on the
  other axis; it fails on `object-cover`, `object-fill`, `object-scale-down`,
  an off-centre position or an inset that clips. On each Non Square Photo
  well it also checks that the space the photo leaves on each side is at least
  the well's computed corner radius, so a fixture cannot drift into the
  corners that `shared-ui-store-product-listing-SC-63a` governs
- **Six wells, and the square on `Default`** — `ProductCardImage` → Non
  Square Photo renders, side by side, a portrait photo in available, on-sale,
  sold-out and in-cart wells, then an available landscape photo and an
  available portrait photo smaller than the well. Its play test checks each
  well. The small photo is how the test holds the enlargement:
  `object-scale-down` leaves it short of the well's edges and fails. The four
  single-status stories keep their square photo, and `Default` takes the same
  play test: its painted box meets all four of the well's edges, and the
  well's computed `overflow` is `hidden` with a corner radius above zero, so
  the photo's corners round with the well's and nothing else of it is cut
- **Fixtures beside `product-card.fixture.png`** —
  `product-card.portrait.fixture.png`, shot on white;
  `product-card.landscape.fixture.png`; `product-card.small.fixture.png`, a
  portrait smaller than the well at every story width. All three are far
  enough from square that their corners clear the well's rounded corners
- **The walk reads the same fit in the application** — on each of the
  three surfaces, with every catalogue photo answered by a portrait or a
  landscape image, so a surface that wraps or restyles the tile is caught

### Hover, position and corners stay as shipped

`decisions.md` Q4, Q5 and Q6 keep the `<img>` as it is: `object-contain`
scales the photo, up or down, until it meets the two edges along its longer
side, centred on the other axis; it carries the well's radius, and `scale-105`
still grows it on hover. The test reads the photo at rest.

## Risks / Trade-offs

- **[Risk] A photo shot on white now shows its own edge against the gray
  well** → the well's gradient and border stay as drawn; a catalogue that
  wants a seamless tile ships photos on a transparent or matching ground.
  The story's portrait fixture is shot on white so the designer sees it
- **[Risk] Hover grows a whole photo past the well** → Q4 accepts it while
  the pointer stays; the test reads the photo at rest
- **[Risk] The application's walk cannot load the catalogue's photos** —
  `cdn.shop.test` resolves nowhere → the walk routes every request to it to
  one portrait or landscape image, so the photo's shape is the walk's own
- **[Risk] The boneyard skeleton was captured before the fit** → a
  non-goal; it is captured from a square fixture photo, which fits and fills
  the well the same either way

## Migration Plan

Nothing to migrate. The code is already on `main` and inside the
application's pin. Rollback is reverting b632582fe in this store and bumping the pin.
