**Author:** @ecchochan - 2026-10-07

## Why

A sale line shows the struck list price beside the price charged, and a
screen reader hears two prices with nothing between them. It cannot tell the
shopper which one they pay. The same holds wherever a sale shows a discounted
price pair: the product tile, the product page, the order line and the cart. A
strike on a refunded or cancelled order line marks status rather than a sale;
its existing status badge already explains it.

The design-phase asks this change opened are answered as recommended
(decisions Q1-Q4): the drawer already ships each look. What is left to build
is the spoken labels.

**Metric:** struck prices a screen reader reads without saying which is
charged, down to none.

## What Changes

- **Spoken labels** - visually hidden words the application supplies, such
  as Sale price and Was, read before a discounted price pair. The Grade10 site
  supplies both words on every sale tile; the shared tile props remain
  optional. Status-only refunded or cancelled order-line strikes keep their
  existing status treatment. Nothing changes on screen.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/ui/store-cart`: the cart line's struck price
- `shared/ui/store-product-listing`: the product tile's struck price
- `grade10-site/store/product-page`: the product page's struck price

## Impact

- **`packages/ui`** - each block that strikes a price takes the labels as copy
- **`@grade10/i18n`** - the Sale price and Was labels
- **`apps/frontend/grade10`** - supplies the labels to each block

## References

- [Cart Drawer · Product Decisions](../../../docs/prds/products/shared/ui/store-cart.md)
- [Cart Drawer · Site Sale And Promo Codes](../../../docs/prds/products/shared/ui/store-cart.md#site-sale-and-promo-codes)
