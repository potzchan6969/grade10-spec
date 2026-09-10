## Context

`packages/loyalty/backend/src/services/rewards` issues a coupon with today's flat-amount default; `packages/grade10-store/backend/src/services/coupons` prices and applies whatever definition a coupon carries. This change gives the reward its real definition shape and unifies physical-reward settlement onto the coupon mechanism — but two of its decisions turn on state owned by `mint-coupons-as-discount-codes`, a sibling change also under review, so they are pinned here rather than left to an implementer's inference.

## Decisions

**Retiring the till's collection-confirm step (task 3.2) depends on `mint-coupons-as-discount-codes` task group 1 having shipped.** Today, `discounts.md`'s Collection section describes the only guard against handing a physical reward over twice: "staff verify and confirm, once. A second till is told when and by whom it was already given." Task 3.1 settles a physical reward as a 100%-off `gift` coupon; the guard this change substitutes for collection-confirm is the real, `usageLimit: 1` Shopify Discount code that `mint-coupons-as-discount-codes` mints for a `gift` coupon at redemption — Shopify itself refuses a second redemption of that code, the same way today's QR/short-code presentation is consumed once. Until that mint exists, a `gift` coupon still only welds a local line with no shop-side single-use enforcement, so removing collection-confirm ahead of it would leave no guard at all. Task 3.1 can land independently (settling as a coupon is correct either way); task 3.2 (removing the guard) waits.

**The staff-assisted notification (task 6.3) fires on settlement, not on Apply.** `discounts.md` states plainly that "nothing is held" until an order is paid, and that Apply is an explicitly re-plannable claim ("a claim, bounded later by what the shop takes") that the store later "trims... to what landed." A notification that fires at Apply can tell a member a benefit was used and then have it trimmed or the whole sale abandoned, with nothing correcting the record — the opposite of "the member's phone is the monitor." The trigger is the paid order (online) or the till's trim-to-landed pass (POS, `discounts.md` step 9). A benefit already notified at Apply that is later trimmed sends a correction notice; a sale that never lands sends none.

## Risks / Trade-offs

- **The physical-reward collection guard has a gap between 3.1 and the mint-coupons-as-discount-codes dependency landing** → Closed by sequencing (task 3.2 waits), not by a redesign in this change. If `mint-coupons-as-discount-codes` ships its concurrency fix for `resolveCoupons()`'s open-checkout race (its own tech-design's Risks section) after this change's 3.2 lands, a narrow window remains where two near-simultaneous redemptions of the same reward could each mint their own single-use code before either settles — accepted for now as bounded by that change's own mitigation plan, not re-solved here.
- **No tech-design existed for this change before this review** — the two decisions above were previously implicit in tasks.md's task text alone; recorded here so a later reader does not have to infer them from task wording.

## Migration Plan

Additive: a reward's contract gains fields it did not carry before (kind, discount, scope), and a physical reward's redemption changes shape (coupon instead of an item-owed record) only for redemptions issued after this change ships. No backfill of already-issued physical-reward redemptions is in scope; they settle under the collection-confirm path already in place until task 3.2 lands.
