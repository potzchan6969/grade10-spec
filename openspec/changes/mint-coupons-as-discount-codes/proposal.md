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

### Modified Capabilities

- `grade10-site/store/discounts`: how a discount code reaches the draft order — a typed discount code, an order coupon, a product coupon, or a gift all ride as one Shopify Discount, one at a time.

## Impact

- `packages/shopify/backend/src/admin/draftOrders.ts`, `packages/shopify/backend/src/admin/discounts.ts` — mint a product-coupon or gift discount code the same way an order coupon's is minted.
- `packages/grade10-store/backend/src/services/coupons/` — product coupon and gift stop welding a line discount; mint and apply a code instead.
- `packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts` — draft order construction carries at most one discount code.
- `packages/grade10-store/backend/src/services/pos/simulator/basket.ts` — same conversion for the POS simulator.
- `packages/grade10-store/admin-frontend`, cart and checkout UI — a checkout eligible for more than one coupon lets the collector choose one.

## References

- [Discounts](../../../docs/prds/products/grade10-site/store/discounts.md)
- [Coupons · Applying one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#applying-one)
