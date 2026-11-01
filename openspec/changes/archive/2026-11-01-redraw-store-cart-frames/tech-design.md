## Context

A struck list price sits beside the price charged on four surfaces: the cart
line (`packages/ui/src/blocks/store-cart/cart-drawer.tsx`), the product tile
(`store-product-listing/product-card.tsx`), the product page header
(`store-product/store-product-header.tsx`) and the order line
(`store-order-detail/order-details-order-item.tsx`). A screen reader reads both
amounts with nothing between them.

## Decisions

### Hidden words before each price, supplied as copy

Each block reads a `sr-only` word before the price charged and another before
the struck list price, inside the same element, so the visible layout is
untouched. The words are copy: `salePriceLabel` and `listPriceLabel` on
`CartItemCopy` and `StoreProductHeaderCopy` (required), and on
`ProductCardCopy` (optional, so the tile's many compositions are not forced to
change at once). The shared store catalogue carries them as
`store.salePriceLabel` and `store.listPriceLabel` in every language; the
Grade10 site supplies them to the cart drawer, the product page, its rail, the
listing and the home tiles.

**Rejected - a strike element with no words.** Screen readers read `<s>` and
`<del>` inconsistently, so it does not say reliably which price is charged.

### The order line keeps its strike as it is

The order line strikes its amounts when the line is refunded or cancelled; it
never shows a list price beside a sale price. Its status badge already says
why the amounts are struck, so Sale price and Was would say something untrue.

## Risks / Trade-offs

- **[Risk] A tile consumer omits the words.** → The tile reads its prices as
  before; the Grade10 site supplies them on every tile it draws.
