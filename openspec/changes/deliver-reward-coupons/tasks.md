# Tasks

Group 1 lands the reward's contract shape; groups 2, 3 and 4 depend on it. Group 3 additionally depends on `mint-coupons-as-discount-codes` shipping its mint machinery, and on group 4's till path — see group 3's note. Group 5 is independent. Group 6 touches the same coupon-apply path `mint-coupons-as-discount-codes` rewrites and is sequenced after that change ships.

## 1. Reward definitions (grade10) (owner: @ecchochan)

- [x] 1.1 Extend the reward contract with a kind, a discount (fixed amount, or a percentage with a maximum) and a scope (named products or variants, a worlds-and-types filter, or the whole order), plus a gift's own minimum spend, so *A reward names a kind, a discount and a scope* passes
- [x] 1.2 Copy the definition onto the coupon a redemption issues, unchanged by a later edit to the reward
- [x] 1.3 Evaluate a coupon's discount from its own definition wherever it is applied, online and at the till, so *A fixed-amount coupon takes a set amount off its scope*, *A percentage coupon is capped at its maximum discount*, *A coupon scoped to a catalog filter matches worlds and types*, *A coupon scoped to the whole order applies across every line*, *A gift adds a free line for its own variant*, and *A gift below its minimum spend does not apply* pass
- [x] 1.4 Pin the points-basis invariant with a test rather than new arithmetic: a whole-order-scoped reward arrives as `lineCuts`, which `rewardCuts` already reads and the basis already subtracts, and a reward's `evaluation.orderCutMinor` is always zero because a reward's definition is a product coupon or a gift and only the `order` branch returns a non-zero order cut — the real hazard in that expression is `orderCodeMinor` being subtracted twice, which `mint-coupons-as-discount-codes` task 4.2 owns
- [ ] 1.5 Add a combine setting to the reward contract — product, order and shipping discounts each allowed or not, absent meaning the store default — copy it onto the coupon with the rest of the definition, and pass it to `mint-coupons-as-discount-codes`' `mintDiscountCode` as its `combinesWith` when the reward's code is minted, so *A reward's combine setting reaches its code* passes
- [x] 1.6 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 2. Console reward form (grade10) (owner: @ecchochan)

- [x] 2.1 Add kind, discount, scope and combine-setting fields to the loyalty-admin reward form, so *A reward with a definition is created from the console alone* passes, and drop the admin-API-only path for a reward carrying a definition
- [x] 2.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. Physical reward retires collection (grade10)

**Do not land 3.2 until all four preconditions hold.** The collection-confirm step being retired here is today's only guard against handing a physical reward over twice, and it is also the only enumeration of who is still owed one. Its replacement is loyalty's own single reservation and single-use coupon, delivered by 3.1 — not the Shopify code, which adds no second guard. What 3.2 waits on is that a reward coupon can reach a counter at all (group 4), that `mint-coupons-as-discount-codes` has shipped its mint machinery so the applied or presented code actually reaches the sale, that release gates 1, 5 and 10 are recorded with date and tester, and that no redemption is still awaiting collection.

- [ ] 3.1 Settle a physical reward's redemption as a 100%-off coupon on the reward's own variant instead of an item owed, so *A physical reward's coupon takes 100% off its own variant* passes
- [ ] 3.2 Once group 4 ships, `mint-coupons-as-discount-codes` has shipped, gates 1, 5 and 10 are recorded, and `select count(*) from redemptions where state='issued' and fulfillment_state='awaiting_collection'` reads zero, remove the fulfilment queue, the till's collection-confirm action, `waitingCollections` and the "waiting at the counter" list from the till session and the member surface
- [ ] 3.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run test`

## 4. A reward coupon reaches the counter (grade10)

Staff applying a coupon from the panel and the member presenting one from their own session are the same act: a plan on the till session, carrying the coupon's id, minted at once and reused on every later plan. Neither redeems a reward at the till; both spend one the member already holds.

- [ ] 4.1 Add the member's coupon wallet to `packages/grade10-store/frontend/src/features/account/` — what each coupon is for, its validity and whether it has been used — reading loyalty's `memberCoupons`; today that directory holds card, identity, notifications and profile and no coupon surface at all
- [ ] 4.2 Thread a reward coupon through the till: `posSalePlanInputSchema` gains a `couponId`, `planTillSale` forwards it to `promise.ts`'s `reserveRewardCoupon()`, the panel lists loyalty's `memberCoupons` beside the registry's `listSpendableCoupons` (both through `evaluateCouponsEligibility`, per `mint-coupons-as-discount-codes` task 7.1), and `CouponTender.reserve` takes the channel it is spent on instead of hardcoding `online`
- [ ] 4.3 Staff clicking a coupon in the panel is a plan on the session carrying that coupon's id; the store reserves it, mints its code at once through `mintOrderCodes` on the session's standing order row, and the extension applies the code with `addCartCodeDiscount`, so *Staff apply a member's coupon from the till session* passes
- [ ] 4.4 Hold the session's chosen benefits server-side, so a plan adds or removes one benefit and never replaces the set — staff applying points after a coupon was presented keeps the coupon on the row, and the reuse rule of `mint-coupons-as-discount-codes` task 2.4 mints no second code
- [ ] 4.5 Let a member whose till session is open pick a coupon in their own session: the same plan on the same session, made server-side, answered with a presentation in `mintPosHandle`'s shape — a QR carrying the minted code in Shopify's scannable discount form (`https://{shop}.myshopify.com/discount/{CODE}`) with the short code beneath it — so *A coupon reaches the counter by the member presenting it* passes; the till scans it natively, and nothing adopts it afterwards because settlement corroborates by the code already on the session's row
- [ ] 4.6 Offer neither path until the member is attached to the cart, and say so in the staff sentence and on the member's screen: a customer-scoped code refuses until then, and `host.onScan` routes every scan to `till.identify` while the modal is open, so the presentation is scanned with the modal closed
- [ ] 4.7 Show the minted code only as the presentation for that sale, never in the wallet as the coupon's identity — it is minted for one sale
- [ ] 4.8 Verify: `pnpm run typecheck`, `pnpm run test`, and a staging run of a counter sale spending a coupon each way — applied by staff, and presented by the member — end to end

## 5. Cancellation is its own permission (grade10) (owner: @ecchochan)

- [x] 5.1 Split cancelling a redemption into its own permission, apart from the point-movement permission it shares today, so *Moving points does not carry redemption cancellation* passes
- [x] 5.2 Keep a reversal to an unused coupon and drop the collection clause from its terms, so *A reversal voids the coupon*, *A used coupon cannot be reversed* and *A refunded sale does not return the coupon* pass — a refunded sale returns the goods, the money and any points spent as a discount on it, never the coupon
- [x] 5.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 6. Member disclosure and the staff-assisted notice (grade10)

**Sequence after `mint-coupons-as-discount-codes` ships, and after this change's own task 3.2** — 6.3 reads the same coupon-apply path that change rewrites, and also assumes the collection notice group 3 retires no longer fires; claiming 6.3 while 3.2 is still open reproduces the double-notification 6.3 exists to prevent.

- [ ] 6.1 Disclose a channel's own spending limit before points leave the balance, so *A channel's own limit is disclosed before the points go* passes — moved from `revise-loyalty-programme-rules`
- [ ] 6.2 Name the channel on every activity entry the member reads, so *An activity entry names its channel* passes — moved from `revise-loyalty-programme-rules`
- [ ] 6.3 Notify the member on **settlement** — the paid order, or the till's trim-to-what-landed pass (`discounts.md`'s POS step 9) — for every staff-assisted act, never at Apply, which is explicitly a re-plannable claim that can still be trimmed or walked away from while nothing is held; a benefit step 9 reported whose sale is then abandoned unpaid sends a correction notice, and a sale that never reaches step 9 sends nothing, so *The member's phone is the monitor* and *A landed notice is corrected if the sale never pays* both pass. Folds together with the collection notice group 3 retires and the notice moved from `add-shopify-membership-pos` (its task 5.2)
- [ ] 6.4 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 7. Manual pages (grade10-spec)

- [ ] 7.1 Clear the 🚧 lines this change delivers on `docs/prds/products/grade10-site/loyalty/rewards.md`, `docs/prds/products/grade10-site/loyalty/profile.md` and `docs/prds/products/grade10-site/loyalty/shopify-integration.md`, which no other change's task group claims
- [ ] 7.2 Retire `docs/prds/products/grade10-site/store/discounts.md`'s Collection section in the same commit as the fold — it states the counter handover as running, unmarked, on a page this change's specs do not touch, so no check catches it and it would simply become false
