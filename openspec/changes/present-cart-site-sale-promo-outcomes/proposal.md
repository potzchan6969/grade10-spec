**Author:** @tangconst - 2026-09-10

## Why

A site sale and a typed promo code can meet on one cart, and the shop's
combine rules then stack the code on the sale, refuse it, or let it replace the
sale. A consumer that prices a site sale in the shared cart drawer needs one
presentation per outcome, so the shopper can tell which cut priced each line
and whether removing the code brings the sale back. Grade10 prices the shop's
sale at the invoice, so the shared block is the one place these outcomes are
shown.

**Metric:** the CartItem Sale Price story and the five Store Cart /
CartDrawer / Auto Discount stories each show their outcome, and their play
tests pass.

## What Changes

- The shared cart drawer presents each site sale and promo code outcome one
  way:
  - **On sale** — the sale price and the struck list price on each line it
    cuts; no Store sale row in the summary
  - **Subtotal** — the sum of the lines as shown, leaving out a sold-out
    line, in every outcome
  - **Stacked** — the lines keep the sale; the summary shows only the code's
    discount
  - **Refused** — the lines and totals stay on the sale; the promo sheet names
    the refusal
  - **Replaced** — each line the code takes the sale from shows the list
    price with nothing struck through; the summary shows only the code's
    discount
  - **Removed** — the code's discount leaves; where the code had replaced the
    sale, the sale returns to the lines while it still runs
  - **Held, cannot apply** — a held code that cannot apply is listed apart
    from the ones that can, muted with its reason and no Apply
- The consumer supplies a site sale only on the lines, never as `PromoState`,
  and a promo code only as `PromoState`, never as a line's `couponCode`
- The drawer strikes any list price it is given and compares no amounts
- The story proofs under `Store Cart/CartDrawer/Auto Discount` assert each
  outcome; a new On Sale canvas shows the sale lines beside a line off the
  sale and a sold-out line, with no code
- Manual page [Cart Drawer](/p/shared/ui/store-cart) carries the 🚧 outcomes,
  the story cards and the product decisions

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `shared/ui/store-cart` — the presentation contract for site sale lines and
  promo code outcomes on the shared drawer

## Impact

- `@grade10/ui` `packages/ui/src/blocks/store-cart/` — the block on `main`
  already renders these outcomes from consumer-supplied props (76dcd5d15,
  88120beff); this change specifies them and tightens the story proofs
- Consuming apps supply each outcome as line `price` and `originalPrice`,
  `subtotal` and `PromoState`, and add no summary row for the site sale
- The exports requirement is `cart-drawer-empty-state`'s: its MODIFIED block
  lists what `packages/ui/src/index.ts` exports for the cart, including
  `CartPromoSheet`, `CartPromoSheetProps`, `PromoTicket`, `PromoTicketProps`,
  `HeldPromoCode`, `PointsState` and `PromoNotice`, which this change relies
  on. This change carries no exports delta, since two changes folding one
  requirement revert each other, and waits on no other change

## Open Questions

None for this change. R1, which price a Grade10 cart line strikes through
when it is both repriced and on sale, belongs to the follow-on change -
[decisions.md](decisions.md#decisions), Q6.

## Follow-on changes

- A Grade10 change that reopens the Cart Drawer page's Shipping and sale
  decision, if the shop's sale is to be priced in that drawer; it settles
  the page's Struck price on a line row

## References

- [Cart Drawer · Site Sale And Promo Codes](../../../docs/prds/products/shared/ui/store-cart.md#site-sale-and-promo-codes)
- [Discounts · One discount at a time](../../../docs/prds/products/grade10-site/store/discounts.md#one-discount-at-a-time)
- [Cart Drawer (Grade10) · Rules](../../../docs/prds/products/grade10-site/store/cart.md#rules)
- `grade10-site/store/site-discounts`, from the archived `add-site-wide-discounts`
- `acceptAutomaticDiscounts: true` on Grade10's draft orders,
  `packages/shopify/backend/src/admin/draftOrders.ts:179` in the application
  repository
