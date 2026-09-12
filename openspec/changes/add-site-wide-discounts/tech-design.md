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

**The code's combine setting is the coupon's own, and grade10 accepts what the shop priced.** `COMBINES_WITH` is a module constant on every minted code today, so a merchandiser cannot author an order-threshold automatic that stacks with a member's coupon whatever they set in Shopify Admin. `mint-coupons-as-discount-codes` makes it a mint parameter sourced from the coupon's definition, with today's value as the default, so a merchandiser and a reward author together decide what stacks. Shopify's documented rule for two discounts that cannot combine is that the better one applies and the other is dropped; that change's tasks 4.12–4.13 turn a dropped code into a completed sale with the coupon returned. Task 2.3 records what the draft-order response shows for the applied automatic, which is what that split reads.

## Risks / Trade-offs

- **Until the replaced-code split ships, a non-combinable automatic discount that beats a coupon fails the checkout.** `shopifyProvider` compares every requested code against the codes the created draft actually landed and answers `couponRefused` for any the draft skipped, which the checkout turns into a failed order. That check is good design — it is why the web path can settle a coupon without corroboration — but Shopify's documented rule is that the better of two discounts that cannot combine applies and the other is dropped, so the first automatic discount a merchandiser creates in production stops every coupon checkout it beats, one member at a time. `mint-coupons-as-discount-codes` tasks 4.12–4.13 answer a dropped code as replaced rather than refused; no automatic discount goes live in production before they ship or task 2.3 shows the outcome differs.
- **Whether Shopify's own combine-rule configuration reproduces a product special sale's line-only exclusivity** (open in the spec) → Shopify Admin configuration, not code. Verify empirically on staging with a real automatic discount and a real coupon before merchandising relies on it; record the answer on the manual page's ❓ line.
- **The points tender rides as an order-level `appliedDiscount` on the very builder this flag is added to**, and no task here puts points on a basket. If Shopify ignores or refuses the flag when `appliedDiscount` is set, this change either does nothing for the baskets that matter or breaks every points checkout.
- **Accepted risk, shared with `mint-coupons-as-discount-codes`**: grade10 prices every benefit it computes locally — the points basis, and a percentage benefit's base and ceiling — against a basket the shop may discount further, because the order row is written before the draft-order call returns `totalDiscountsSet`. The product record already decides the combination itself ("Points always redeem, even on a product special sale"); what is unresolved is the allocation, which task 2.3 records.

## Migration Plan

Purely additive to the GraphQL input — no schema, no data migration, no new query field. No flag is needed, because deleting the automatic discount in Shopify Admin is itself a kill switch requiring no deploy — but this is not "safe to ship unguarded": until a merchandiser creates an automatic discount nothing changes, and the moment one exists the combine-rule outcome above is live for every coupon checkout. So task 2.3 is a gate to clear on staging before any automatic discount is created in production, not a verification trailing the ship.
