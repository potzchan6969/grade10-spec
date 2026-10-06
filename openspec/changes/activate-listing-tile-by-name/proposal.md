**Author:** @tangconst - 2026-09-11

## Why

Collectors read a product's name before its photo. `add-store-cross-sell`
wired the name: a tile's name opens the product wherever the photo does, and
stays plain text where it does not. The listing passes its activation, so a
listing card already opens from its name. No requirement states any of it,
and the photo is still its own keyboard stop named for the product, so a Tab
user passes two stops per tile and a screen reader announces each product
twice.

Metric: ❓ product manager confirms (R2) - the share of listing-to-product
opens that start from the name rather than the photo, which nothing records
today.

## What Changes

The name, the inert name and a sold-out tile that opens where it does not
sell already run; this change states them as requirements and proves them.
It builds two outcomes: one stop to open, and a photo used on its own that
opens by the tile's rule.

- **Name activates** — when the tile opens - a callback or an address,
  unless sold out on a tile that sells - the name reports the same activation
  as the photo
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
  listing, the front door and the rail under a card say which cards open
- **The image alone opens by the same rule** — a `ProductCardImage` used
  without a card opens where a tile would, and is named by the product name
  it is given
- **No new export** — still `ProductCard` / list `onProductClick`; no new
  public name

## Non-Goals

- **Navigation inside the package** — the consumer still decides route or
  modal
- **Always-visible link chrome** — the underline on hover and on keyboard
  focus is the affordance;
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
  its own control and opens under the tile's rule, which both now compute in
  one place. Stories that change: `product-card.stories.tsx` (`NamedOnce`,
  `SoldOut`, `OpensAsALink`, `SoldOutOpensWhereNothingSells`,
  `SoldOutOpensAsALink`, and new `Inert`, `AddressOnly` and
  `NamedOnceNotSelling`), `product-card-image.stories.tsx` (new `OpensAlone`
  and `SoldOutWhereItSells`, and `SoldOutWithHandler`'s doc), `product-list.stories.tsx` and
  `store-product-related-rail.stories.tsx`
- **Grade10 site** — already supplies `onProductClick`; no new props. Test
  helpers and specs that read the photo as a named control read it by its
  slot: `e2e/helpers/storefront.ts`, `e2e/tests/store/cart-count.spec.ts`,
  `ProductListingPage.test.tsx`, `ProductPage.test.tsx`, `hydration.test.tsx`
  and `StoreHomePage.test.tsx`; one walk on the listing presses a card's
  name, and `e2e/tests/store/home.spec.ts` and
  `e2e/tests/store/cross-sell.spec.ts` assert that opening a card does not
  reload the page
- **Manual** — Product Listing Blocks Product Tile: **One stop to open**
  and **Photo on its own** carry the 🚧; **Name opens the product** there and
  on Product Listing, and **Opens where it does not sell**, run unmarked (Q13)
- **Order** — accepted after `add-store-cross-sell`, whose requirement that
  a tile given an address is a link to it defines the address this change's
  tile requirement names; the two land as a stack, that change first, and are
  accepted back to back from one tree, where `add-store-cross-sell`'s delta
  carries no sold-out requirement or scenario of its own (Q9)
- **Overlap** - this change alone states that a sold-out tile opens where it
  does not sell (Q9); `add-store-cross-sell` carries no requirement for it, and
  its US1-TC1 walks `shared-ui-store-product-listing-SC-97`, which resolves
  once this change folds

## Open questions

- **Map** - ❓ whether Responsive layout and Load more stay their own
  Feature set groups (Q11, R1)
- **Metric** - ❓ what to measure (R2)

## References

- [Product Listing · Product Tile](../../../docs/prds/products/grade10-site/store/product-listing.md#product-tile)
- [Product Listing Blocks · Product Tile](../../../docs/prds/products/shared/ui/store-product-listing.md#product-tile)
