## Context

`packages/shopify/backend/src/admin/draftOrders.ts` builds every `DraftOrderInput` through one function, `draftOrderVariables()`, shared by `draftOrderCreate` and `draftOrderCalculate`. Neither call sets `acceptAutomaticDiscounts` today, so Shopify's own automatic discounts never reach a draft order — see proposal.md.

`ShopifyDraftOrderPricing.codeDiscountMinor` is already documented for exactly this day: "What the codes and any automatic promotion took off, together." It is derived as `totalDiscountsSet - weldedDiscountMinor`, which already folds an automatic discount's amount in once one exists — no field or derivation change needed here.

## Goals / Non-Goals

**Goals:**
- Every draft order this store creates accepts Shopify's automatic discounts.

**Non-Goals:**
- Authoring, editing, or listing site discounts from grade10 — that stays entirely in Shopify Admin.
- Reproducing Shopify's own combine-rule evaluation locally.
- Separating an automatic discount's amount from a code's in the pricing result — `codeDiscountMinor` already covers both by design; splitting it is a later change if a caller ever needs the breakdown, not this one.

## Decisions

**`acceptAutomaticDiscounts: true` is unconditional, not input-configurable.** There is no caller today that wants a draft priced without automatic discounts — a draft order carrying a customer's own coupon or code is still priced correctly whether or not an automatic discount also happens to apply, since acceptance only matters when one exists and is eligible. Alternative considered: thread a flag through `ShopifyDraftOrderInput`; rejected as a parameter nothing will ever set to `false`.

**The till is not a draft-order channel.** Shopify POS rings a sale on its own cart and the paid order arrives by webhook; the only production callers of `createDraftOrder` are the web checkout's provider and the admin console's till simulator. So `acceptAutomaticDiscounts` reaches the online checkout and the simulator, and nothing else — at a real counter the automatics are the POS cart's own, already on, and the only thing grade10 controls is whether it turns them off. It does not: `removeAllDiscounts(false)` preserves them deliberately. That is what the requirement states for the till, in place of a draft-order property no till has.

**Grade10 states the code's own half of the combine rule.** `COMBINES_WITH` is a module constant on every minted code, so a merchandiser cannot author an order-threshold automatic that stacks with a member's coupon whatever they set in Shopify Admin. `mint-coupons-as-discount-codes` makes it a mint parameter with today's value as the default, so the answer task 2.3 records has somewhere to land. Change no value before that run reports.

## Risks / Trade-offs

- **A non-combinable automatic discount does not degrade a coupon checkout, it fails it.** `shopifyProvider` compares every requested code against the codes the created draft actually landed and answers `couponRefused` for any the draft skipped, which the checkout turns into a failed order. That check is good design — it is why the web path can settle a coupon without corroboration — but it means the first automatic discount a merchandiser creates in production stops every coupon checkout, one member at a time, if Shopify resolves the combination as "replace" rather than "refuse". This is availability, not mispricing, and after `mint-coupons-as-discount-codes` it covers gifts, product coupons and every reward rather than order coupons alone.
- **Whether Shopify's own combine-rule configuration reproduces a product special sale's line-only exclusivity** (open in the spec) → Shopify Admin configuration, not code. Verify empirically on staging with a real automatic discount and a real coupon before merchandising relies on it; record the answer on the manual page's ❓ line.
- **The points tender rides as an order-level `appliedDiscount` on the very builder this flag is added to**, and no task here puts points on a basket. If Shopify ignores or refuses the flag when `appliedDiscount` is set, this change either does nothing for the baskets that matter or breaks every points checkout.
- **Accepted risk, shared with `mint-coupons-as-discount-codes`**: grade10 prices every benefit it computes locally — the points basis, and a percentage benefit's base and ceiling — against a basket the shop may discount further, because the order row is written before the draft-order call returns `totalDiscountsSet`. The product record already decides the combination itself ("Points always redeem, even on a product special sale"); what is unresolved is the allocation, which task 2.3 records.

## Migration Plan

Purely additive to the GraphQL input — no schema, no data migration, no new query field. No flag is needed, because deleting the automatic discount in Shopify Admin is itself a kill switch requiring no deploy — but this is not "safe to ship unguarded": until a merchandiser creates an automatic discount nothing changes, and the moment one exists the combine-rule outcome above is live for every coupon checkout. So task 2.3 is a gate to clear on staging before any automatic discount is created in production, not a verification trailing the ship.
