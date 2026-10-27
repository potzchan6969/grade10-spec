**Author:** @kinisworking - 2026-10-27

## Why

Collectors can miss a usable cart promotion that is about to lapse while
choosing between several codes. The designer and PM confirmed that the
cart picker should make the existing expiry detail easier to notice; success
is measured by the selection rate of live near-expiry codes before they
expire, without changing the picker’s copy.

## What Changes

- The Store cart picker makes a live promo code’s `Use by` detail stand out
  when its expiry is within the last 14 days.
- The picker keeps the discount title and the expiry/conditions detail in
  their separate slots; it does not replace either slot or introduce new
  wording.
- The shared Store cart ticket contract records the consumer-owned detail
  emphasis state, and the Grade10 application derives that state from the
  existing coupon expiry supplied by the quote.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/cart-drawer`: make the cart picker’s near-expiry detail
  visible without changing promo copy or the discount title.
- `shared/ui/store-cart`: make the promo-ticket detail emphasis an explicit
  consumer-supplied contract.

## Impact

- Grade10 frontend mapping and tests will pass the existing quote
  `expiresAt` through the `HeldPromoCode` presentation shape.
- The pinned `external/grade10-spec` submodule will need the accepted shared
  UI contract before the application can consume the field.
- No backend, database, wire/API, or translation-catalog change is required;
  the Store quote already supplies nullable expiry data for member, wallet,
  and public codes.

## References

- [Grade10 Cart · Promo Code](../../../docs/prds/products/grade10-site/store/cart.md#promo-code)
- [Shared Cart Drawer · Site Sale and Promo Codes](../../../docs/prds/products/shared/ui/store-cart.md#site-sale-and-promo-codes)
