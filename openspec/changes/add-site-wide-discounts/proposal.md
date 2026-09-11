**Author:** @ecchochan - 2026-09-10

## Why

A draft order can now accept Shopify's own automatic discounts during pricing and creation (`acceptAutomaticDiscounts`), an API field Shopify shipped after this capability was first proposed. A merchandiser's product special sale, buy-X-get-Y offer, or order threshold no longer needs a discount engine of grade10's own to reach a real sale — Shopify's own automatic discounts, authored in Shopify Admin, reach it directly once the draft order accepts them. Success looks like a merchandiser publishing a site discount in Shopify Admin and it charging on the next online or POS sale, with no grade10 admin screen and no grade10-authored eligibility or combine logic in between.

## What Changes

- Every draft order this store creates accepts Shopify's automatic discounts during pricing and creation. At the till there is no draft order — Shopify POS rings the sale on its own cart, where the shop's automatics already apply — so grade10's part there is leaving them alone rather than turning them off.
- A product special sale, a buy-X-get-Y offer, and an order threshold cut are authored in Shopify Admin as Shopify's own automatic discounts, not a grade10 admin screen.
- Whether a site discount refuses, stacks with, or replaces the order's one discount code, and whether one site discount excludes another on the same product, is Shopify's own combine-rule configuration on each discount. Grade10 reimplements none of that evaluation; it does state one half of it, since every code it mints carries its own combine setting.

## Non-Goals

- No admin screen in grade10 for authoring site discounts.
- No grade10-side eligibility, allocation, or combine-rule engine — that is now entirely Shopify's own configuration.
- Not covering member-specific loyalty rewards or coupons, or how they reach the draft order as a Shopify discount code — that is `mint-coupons-as-discount-codes`.
- Not specifying which combine rule a merchandiser should pick for a given promotion — that is a Shopify Admin authoring decision each time, not a requirement here.

## Capabilities

### New Capabilities
- `grade10-site/store/site-discounts`: every draft order this store creates accepts Shopify's own automatic discounts, and the till leaves the shop's own alone, so a merchandiser's site discount — authored in Shopify Admin — reaches a real sale online and at the counter.

### Modified Capabilities

(none — no existing capability specifies checkout or draft-order discount behavior yet)

## Impact

- `packages/shopify/backend/src/admin/draftOrders.ts` — `acceptAutomaticDiscounts: true` on the draft order create and calculate input.
- Accepted risk, shared with `mint-coupons-as-discount-codes`: points-basis is computed before the shop's own automatic-discount allocation is known (the order row is written before the draft-order provider call returns `totalDiscountsSet`), so a site-wide discount stacking with points is not accounted for in the points-basis deduction. See that change's tech-design.md Decisions for the accepted-risk record; not resolved by either change.

- Accepted risk: a non-combinable automatic discount does not degrade a coupon checkout, it fails it — `shopifyProvider` deletes the draft and refuses when a requested code does not land. Availability, not mispricing, and it covers every coupon shape once `mint-coupons-as-discount-codes` ships. Task 2.3 is the gate that settles it before any automatic discount is created in production.

Note: the only production callers of `createDraftOrder` are the web checkout's provider and the admin console's till simulator. `simulatorDraftInput()` builds an abstract POS sale-input shape with no `acceptAutomaticDiscounts` wire field, and the real staff-facing till creates no draft order at all — so this flag reaches the online checkout and the simulator, and the counter's automatics are Shopify POS's own behaviour throughout.

## References

- [Discounts · Site discounts](../../../docs/prds/products/grade10-site/store/discounts.md#site-discounts)
