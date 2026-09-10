**Author:** @ecchochan - 2026-09-10

## Why

A product coupon and a gift currently reach the draft order as a custom discount welded onto the order's own lines, never a Shopify Discount — the only reward shape that is a real Shopify Discount today is the order coupon. That leaves two mechanisms doing the same job: a reward's own weld, and a Shopify Discount code for everything else (a typed discount code, an order coupon). Minting a product coupon and a gift as an ephemeral Shopify Discount too — single-use, minted once the basket qualifies, spent once — collapses that to one mechanism, and lets every code-shaped discount share Shopify's own one-code accounting instead of grade10 enforcing the "one discount at a time" rule on top of two different transports. Success looks like a product coupon and a gift settling exactly the way an order coupon already does — by the Shopify Discount code the paid order carried.

## What Changes

- A product coupon and a gift ride onto the draft order as an ephemeral, single-use Shopify Discount, minted once the basket qualifies — the same mechanism an order coupon already uses. Grade10 no longer welds a custom discount for either.
- A draft order carries at most one discount code, wherever it came from — a typed discount code, an order coupon, a product coupon, or a gift. A checkout eligible for more than one has the collector choose exactly one to apply.
- A live cart price is estimated locally as the collector edits it; the coupon's Shopify Discount is minted only once the checkout is submitted, never on an earlier price preview.
- Applies to both the online checkout and the POS till.

## Non-Goals

- Not changing how a product coupon or a gift is redeemed, held, or priced against the basket — only how the cut reaches the draft order.
- Not changing points or free shipping — points stays the order's own custom discount, outside the one discount-code count.
- Not changing site discounts or their combine rule with the order's one discount code — that is `add-site-wide-discounts`.
- Not specifying the exact minting, compensation, or POS undo mechanics — deferred to tech-design.

## Capabilities

### New Capabilities

- `grade10-site/store/discounts`: how a discount code reaches the draft order — a typed discount code, an order coupon, a product coupon, or a gift all ride as one Shopify Discount, one at a time. No existing capability specifies checkout or draft-order discount behavior yet (`add-site-wide-discounts` establishes the sibling `grade10-site/store/site-discounts` capability the same way).

### Modified Capabilities

- `grade10-site/loyalty/programme`: this change is the sole owner of "a coupon is the order's one discount" end to end, including a reward's own `couponId` path, via `grade10-site-store-discounts-SC-04` — `deliver-reward-coupons` dropped its own draft scenario for the same rule (`grade10-site-loyalty-programme-SC-163`) rather than duplicate it. This change also mints the reward's own coupon as a real Shopify Discount code (`reserveRewardCoupon()`), which `deliver-reward-coupons` task group 3 depends on.

## Impact

- `packages/shopify/backend/src/admin/draftOrders.ts`, `packages/shopify/backend/src/admin/discounts.ts` — mint a product-coupon, gift, or reward-coupon discount code the same way an order coupon's is minted, customer-scoped.
- `packages/grade10-store/backend/src/services/coupons/` — product coupon and gift stop welding a line discount; mint and apply a code instead; a shared mint helper and a `coupon_mints` idempotency record back every order-keyed mint.
- `packages/grade10-store/backend/src/db/schema/coupons.ts` — `ck_coupons_shape` migration; new `coupon_mints` table.
- `packages/grade10-store/backend/src/services/orders/promise.ts` — `reserveRewardCoupon()` gains the one-discount-code check and mints a real Shopify code for the reward's own coupon; points-basis calculation reads `couponDiscountMinor` instead of `lineDiscounts`.
- `packages/grade10-store/backend/src/services/orders/checkoutRequest.ts`, `eventSink.ts` — `buildCheckoutRequest()`'s discount-code filter widens past `order`-kind; `providerArtifact` construction for a reward coupon reports `kind: "discount_code"` once one is minted, replacing the hardcoded `draft_line_discount`.
- `packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts` — draft order construction carries at most one discount code.
- `packages/grade10-store/backend/src/services/pos/simulator/basket.ts`, `sale.ts` — same conversion for the POS simulator; `confirmTillSale`, `settle.ts`'s `corroborates()`/`adoptUnreportedCodes()` reconcile a minted `product`/`gift`/reward code by kind uniformly.
- `integrations/shopify-pos/grade10` — the real staff-facing till extension's gift/product-coupon weld (`setLineItemDiscount`) converts to the discount-code transport; not just the backend simulator.
- `packages/grade10-store/admin-frontend`, cart and checkout UI — a checkout eligible for more than one coupon lets the collector choose one, from a server-precomputed eligible set.

## References

- [Discounts](../../../docs/prds/products/grade10-site/store/discounts.md)
- [Coupons · Applying one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#applying-one)
