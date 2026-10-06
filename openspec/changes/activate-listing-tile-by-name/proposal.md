**Author:** @tangconst - 2026-09-11

## Why

Collectors open a product from the listing by tapping the photo. The name
under the photo looks like a title, not a second way in, so many try the name
first and nothing happens. The surface already reports tile activation; only
the photo was wired.

Metric: share of listing → product-detail navigations that start from the
name control, and drop-off after a name tap that previously did nothing.

## What Changes

- **Name activates** — when the consumer supplies tile activation and the
  product is not sold out, the product name reports the same activation as
  the photo
- **One stop to open** — the name is the tile's only keyboard stop for
  opening the product and the one control a screen reader announces for it;
  the photo opens on a pointer press only
- **Plain when inert** — a name that does not open takes no underline and no
  focus
- **Inert without a way in** — no name or photo control when a sold-out
  product sits on a tile that sells, or when the tile has neither an
  activation callback nor its product's address; a tile given an address
  alone is a link to it
- **A sold-out tile opens where it does not sell** — on a tile given no cart
  handler, a sold-out product's name and photo open it, sold-out treatment and
  all; the tile requirement is the rule's one home, and
  `add-store-cross-sell`'s requirement of its own leaves that change
- **The listing opens a card from its name** — on the Grade10 listing, a
  card's name and photo open its own product page; a sold-out card opens
  neither, because the listing sells
- **The product page defers to the surface** — the product page's rule that
  the storefront opens a card's own address holds for a card that opens; the
  listing and the front door say which cards open
- **No new export** — still `ProductCard` / list `onProductClick`; no new
  public name

## Non-Goals

- **Navigation inside the package** — the consumer still decides route or
  modal
- **Always-visible link chrome** — hover / focus underline is the affordance;
  Figma Product Card layout stays the photo + plain name frame
- **Changing cart or price behaviour**
- **Adaptive Filter chrome** — `adapt-listing-filter-drawer`

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/store-product-listing`: product name is a tile activation target
  alongside the photo; a tile opens with either a callback or an address
- `grade10-site/store/product-listing`: a card on the listing opens its own
  product page from its name and its photo
- `grade10-site/store/product-page`: the storefront opens a card's own
  address only where the card opens; which cards open is the surface's rule

## Impact

- **`@grade10/ui`** — `ProductCard` keeps the photo out of the tab order and
  the accessibility tree inside a card; a `ProductCardImage` used alone keeps
  its own control. Stories that change: `product-card.stories.tsx`
  (`NamedOnce`, `SoldOut`, `OpensAsALink`, `SoldOutOpensWhereNothingSells`,
  `SoldOutOpensAsALink`, and new `Inert`, `AddressOnly` and
  `NamedOnceNotSelling`), `product-list.stories.tsx` and
  `store-product-related-rail.stories.tsx`
- **Grade10 site** — already supplies `onProductClick`; no new props. Test
  helpers and specs that read the photo as a named control read it by its
  slot: `e2e/helpers/storefront.ts`, `e2e/tests/store/cart-count.spec.ts`,
  `ProductListingPage.test.tsx`, `ProductPage.test.tsx`, `hydration.test.tsx`
  and `StoreHomePage.test.tsx`; one walk on the listing presses a card's
  name
- **Manual** — Product Listing and Product Listing Blocks Product Tile
- **Order** — read after `add-store-cross-sell`, whose requirement that a
  tile given an address is a link to it says how the address this change's
  tile requirement names behaves
- **Overlap** - `add-store-cross-sell` Q29 settled the sold-out rule this
  change states; that change's SC-91 states it too, on the rail's tile

## Open questions

- none - Q1 to Q8 are in `decisions.md`

## References

- [Product Listing · Product Tile](../../../docs/prds/products/grade10-site/store/product-listing.md#product-tile)
- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
