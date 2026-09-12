**Author:** @ecchochan - 2026-09-10

## Why

A product coupon and a gift currently reach the draft order as a custom discount welded onto the order's own lines, never a Shopify Discount — the only coupon shape that is a real Shopify Discount today is the order coupon. That leaves two mechanisms doing the same job, and it puts a ceiling on what a coupon can be scoped to: a coupon targeted at a catalogue facet, such as one IP world, can only be priced by grade10's own evaluator welding lines, because Shopify knows nothing of the platform's facets. Minting every coupon as an ephemeral, single-use Shopify Discount — created when an order claims the coupon, against the lines that basket actually holds — collapses the two transports into one and lets every coupon share Shopify's own one-code accounting. Success looks like every coupon settling the way an order coupon already does: by the Shopify Discount code the paid order carried.

## What Changes

- A coupon is the durable record; its Shopify Discount code is an intention to spend it on one basket, minted when an order claims that coupon and spent once.
- A product coupon, a gift, and a loyalty reward's own coupon all ride onto the order as that code. Grade10 no longer welds a custom discount for any of them.
- A coupon scoped to a catalogue facet — a world, a type — has its target resolved against the claiming basket, and its code names the variants that basket holds.
- A draft order carries at most one discount code, wherever it came from. A checkout eligible for more than one has the collector choose exactly one.
- Every minted code is scoped to the member it was minted for, so a code that escapes cannot be spent by anyone else.
- Every minted code carries its own coupon's combine setting — a reward's definition, or the operator's mint of a store coupon — and Shopify's own combine rules decide the outcome beside a site discount.
- A site discount the shop applies in place of the coupon's code keeps the sale: the order completes at the shop's price, the coupon returns to the member's wallet unused, and the member is told the sale beat their coupon. Only a code the shop refuses outright fails the checkout.
- A live cart price is estimated locally as the collector edits it; nothing mints until an order claims the coupon.
- Applies to both the online checkout and the POS till.

## Non-Goals

- Not changing how a coupon is redeemed, held, or priced against the basket — only how its cut reaches the order.
- Not changing points or free shipping — points stays the order's own custom discount, outside the one discount-code count.
- Not changing site discounts themselves — that is `add-site-wide-discounts`. This change carries each coupon's own combine setting onto its code, since it is the side that mints, and never re-evaluates Shopify's combine rules itself.
- Not building a single-code removal path at the till; "Remove every discount" stays the documented fallback.
- Not specifying the exact minting, compensation, or POS undo mechanics — deferred to tech-design.

## Capabilities

### New Capabilities

- `grade10-site/store/discounts`: how a discount code reaches the order — a typed discount code, an order coupon, a product coupon, a gift, and a reward's own coupon all ride as one ephemeral Shopify Discount, one at a time, minted against the basket claiming it. No existing capability specifies checkout or draft-order discount behaviour yet (`add-site-wide-discounts` establishes the sibling `grade10-site/store/site-discounts` capability the same way).

### Modified Capabilities

- `grade10-site/loyalty/programme`: this change is the sole owner of "a coupon is the order's one discount" end to end, including a reward's own `couponId` path, via `grade10-site-store-discounts-SC-04` — `deliver-reward-coupons` dropped its own draft scenario for the same rule (`grade10-site-loyalty-programme-SC-163`) rather than duplicate it. This change also mints a reward's own coupon as a real Shopify Discount code, which `deliver-reward-coupons` builds on.

## Impact

- `packages/coupons/contracts/src/` — a new `codeTargetFor()` beside `eligibleLines()`, projecting a coupon's target onto what a Shopify code can express, against one basket.
- `packages/shopify/backend/src/admin/discounts.ts` — every coupon shape mints through the same call, customer-scoped, with `endsAt` a parameter rather than a constant; `combinesWith` already comes from the coupon's own definition, defaulting to `DEFAULT_COMBINES_WITH`.
- `packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts`, `services/orders/checkout.ts` — a requested code the draft did not land is answered as replaced, not refused, where the draft carries an automatic discount instead; the checkout completes, the coupon is released and the member is told.
- `packages/grade10-store/backend/src/services/coupons/` — a product coupon and a gift stop welding a line discount; `createCoupon()` stops minting; one shared mint helper, with a code derived from the order and coupon ids so a retry recovers rather than duplicates.
- `packages/grade10-store/backend/src/db/schema/coupons.ts`, `orders.ts` — a relaxing `ck_coupons_shape` edit, a new `coupon_mints` table with real foreign keys, and two nullable code columns on `orders` for a reward's mint.
- `packages/grade10-store/backend/src/services/orders/checkout.ts`, `promise.ts` — every mint happens after the order row commits and keys on that row's own id; `reserveRewardCoupon()` gains the one-discount-code check and mints nothing itself.
- `packages/grade10-store/backend/src/services/orders/checkoutRequest.ts`, `eventSink.ts` — the discount-code filter widens past `order`-kind and adds the reward's code; per-line discounts are sent net of every cut whose code is in the request; `providerArtifact` reports `kind: "discount_code"`.
- `packages/grade10-store/backend/src/services/coupons/settle.ts`, `pos/sale/sale.ts` — reconciliation matches a minted code by kind uniformly, adopts an unreported code under its own kind, and keeps a gift corroborated by its line.
- `integrations/shopify-pos/grade10` — the real staff-facing till extension's product-coupon weld converts to the discount-code transport; the gift keeps its weld there; "Remove every discount" is fixed to confirm beside the shop's own automatic discounts.
- `packages/grade10-store/admin-frontend`, cart and checkout UI — a checkout eligible for more than one coupon lets the collector choose one, from a server-precomputed eligible set.

## References

- [Discounts](../../../docs/prds/products/grade10-site/store/discounts.md)
- [Coupons · Applying one](../../../docs/prds/products/grade10-site/loyalty/coupons.md#applying-one)
- [Shopify membership and POS · How points become a discount](../../../docs/references/shopify-membership-pos.md)
