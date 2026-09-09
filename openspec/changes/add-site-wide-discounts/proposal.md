**Author:** @ecchochan - 2026-09-09

## Why

Shopify's own automatic discounts never reach a real sale: every online checkout and every POS sale rides a draft order our backend creates, and a draft order never evaluates Shopify's automatic discounts — only a staff member editing a draft by hand in Shopify Admin does. A merchandiser who sets up "50% off this product" as a Shopify automatic discount today believes it is live storewide; it silently does nothing for every collector who actually buys the product online or at the till. Site-wide promotions need a home inside grade10's own discount engine instead. Success looks like zero manual draft edits needed to make an advertised site promotion actually apply.

## What Changes

- New capability: automatic, admin-configured site discounts that weld onto a basket the same way points and coupons already do, with no Shopify Discounts dependency.
- Three discount types:
  - **Product special sale** — a percentage or fixed cut off one or more chosen products. Exclusive against every other site discount and coupon on that product's line; a member's points can still redeem on top, since points is a payment method rather than a merchandising discount.
  - **Buy X Get Y on special products** — a reward product discounted or free after buying a trigger quantity. Combines freely with coupons and points; no exclusivity.
  - **Order threshold discount** — a percentage off the whole order once spend clears a minimum, defined as a tier ladder (e.g. 5% at $1,000, 10% at $2,000) inside one active promotion. A basket gets whichever tier it qualifies for. Combines normally with points and coupons; its base and its own cut both exclude goods already carved out by an active Product special sale.
- Applies to both online checkout and POS/till sales.

## Non-Goals

- Not migrating or reusing Shopify's native Discounts feature (automatic discounts, price rules) in any way.
- Not covering member-specific loyalty rewards or coupons — those stay in the loyalty programme capability.
- Not specifying the exact admin authoring UI, rounding/allocation mechanics for splitting an order-wide cut across per-line welds, or concurrent-promotion conflict handling (e.g. a product targeted by two types at once) — deferred to tech-design.
- Not defining more than one order threshold promotion active at a time.

## Capabilities

### New Capabilities
- `grade10-site/store/site-discounts`: admin-configured, automatically-applied site-wide discounts (product special sale, buy-X-get-Y, order threshold) that weld onto an online or POS basket without depending on Shopify's native Discounts feature.

### Modified Capabilities

(none — no existing capability specifies checkout or draft-order discount behavior yet)

## Impact

- `packages/grade10-store/backend/src/services/coupons/` and `pricing.ts` — new discount evaluation alongside existing coupon logic.
- `packages/shopify/backend/src/admin/draftOrders.ts`, `packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts` — per-line weld construction for the order threshold discount's exclusion behavior.
- `packages/grade10-store/backend/src/services/pos/simulator/basket.ts` — same discount evaluation for POS.
- `packages/grade10-store/admin-frontend` — new screen(s) to author the three discount types.
