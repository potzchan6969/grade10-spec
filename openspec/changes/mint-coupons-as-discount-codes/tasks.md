Groups 0 and 1 land the shared mint machinery and the schema it needs; every
other group depends on them. Group 3 also covers a reward coupon as one
case of `grade10-site-store-discounts-SC-04` — this change is the sole
owner of the one-discount-code rule end to end, across both the
code-resolved path and a reward's own `couponId` path, and is the change
that actually mints a real Shopify code for a reward's coupon (`deliver-reward-coupons`
task group 3 depends on task 3.7 below for its own guard).
`deliver-reward-coupons` dropped its own draft scenario for the same rule
(`grade10-site-loyalty-programme-SC-163`) in favor of this one; see that
change's tasks.md.

Group 3's backend refusal must not reach production ahead of group 5's
picker UI — see tech-design.md's Risks.

## 0. Schema migration (grade10)

- [ ] 0.1 Rewrite `ck_coupons_shape`'s CHECK constraint (`packages/grade10-store/backend/src/db/schema/coupons.ts`) to the exact predicate in tech-design.md's Migration Plan: `shopify_node_id` required non-null for `kind = 'gift'` and for `kind = 'product' and benefit_kind = 'fixed'`; still required null for `kind = 'product' and benefit_kind = 'percentage'`. Add with `NOT VALID`; run `VALIDATE CONSTRAINT` in a separate migration after 1.7's backfill completes, not in the same deploy
- [ ] 0.2 Add the `coupon_mints` table: `orderId`, `couponId` (plain text, no foreign key — holds either a store `coupons.id` or a loyalty `couponInstances.id`), `nodeId`, `code`, `origin` (`'store_coupon' | 'reward_coupon'`), a unique constraint on `(orderId, couponId)`
- [ ] 0.3 Schema-level tests: a `gift`/fixed-`product` row with `shopifyNodeId` set is accepted; a percentage-`product` row with `shopifyNodeId` still null is accepted (this must keep passing after 0.1, not just before it); a `coupon_mints` insert with a non-UUID `couponId` (a loyalty coupon id) is accepted

## 1. Shared mint machinery (grade10)

- [ ] 1.1 Extract `create.ts`'s existing generate-code/retry/compensate loop into `mintDiscountCode(deps, params) -> outcome`, kept inside `packages/grade10-store/backend`, called from `createCoupon()`'s redemption branch unchanged in behavior
- [ ] 1.2 Add `canMintAtRedemption(definition): boolean` beside `evaluateCoupon` in `@grade10/coupons-contracts`; `create.ts`'s minting branch and the checkout-submit path (group 2) both branch on it instead of re-deriving kind/benefit-shape independently. It answers only for store-table coupons — a reward's coupon (group 3) is always order-keyed, never a redemption-time mint, so it is not a third value of this function
- [ ] 1.3 Extend `createCoupon()`'s Shopify-minting branch to also cover `gift` and a fixed-amount `product` coupon (`canMintAtRedemption() === true`), reusing `codeScope`, `shopTarget`, `COMBINES_WITH` — except `codeScope`, which for `product`/`gift` always scopes to the member's paired Shopify customer, never `{kind:'all'}`, and refuses the mint if the member has no paired customer — covers `grade10-site-store-discounts-SC-01` (fixed-amount case), `grade10-site-store-discounts-SC-02`
- [ ] 1.4 Look up the gift variant's current catalog price in `resolveDefinition()`'s gift branch, and mint its code with that amount as the fixed value
- [ ] 1.5 Write `shopify_node_id` directly onto the `coupons` row for every redemption-time mint (order/gift/fixed-product), in the same transaction as the insert — no `coupon_mints` row for this case; `coupon_mints` is reserved for the two order-keyed shapes in groups 2 and 3
- [ ] 1.6 Unit tests: a gift and a fixed-amount product coupon each mint a real, customer-scoped Shopify Discount at redemption and compensate on a failed insert, mirroring the existing `order` coupon tests; a member with no paired Shopify customer is refused rather than minted unscoped
- [ ] 1.7 Backfill script: for every currently-live `product`/`gift` coupon row with `shopifyNodeId` null, call `mintDiscountCode()` and write `shopify_node_id` back in the same transaction as the mint — safe to re-run after a crash, since an already-backfilled row is simply skipped and a failed mint is compensated the same way any other failed mint is; run once at deploy, before 0.1's `VALIDATE CONSTRAINT` step

## 2. Checkout-time minting for percentage coupons (grade10)

- [ ] 2.1 Add `mintComputedCouponCode()` per tech-design.md's Service Interfaces — takes an idempotency key (`orderId` + `couponId`), the member's paired Shopify `customerId` for a customer-scoped `codeScope`, checks `coupon_mints` before minting, calls `mintDiscountCode()` (group 1.1), and is called only from the checkout-submit path; refuses (does not mint unscoped) when the caller has no `customerId`
- [ ] 2.2 Wire it into the final checkout submission for a percentage-with-ceiling product coupon ride (`canMintAtRedemption() === false`), immediately before `createDraftOrder`, persisting the `coupon_mints` row (`origin: "store_coupon"`) in the same transaction, with compensation on a subsequent failure
- [ ] 2.3 Confirm `calculateDraftOrder` (price preview) never calls it — the local evaluator number stays what the preview shows
- [ ] 2.4 Extend `orders/retire.ts`'s `supersedePromisedOrders` (and any other path that cancels/expires an order carrying an unspent mint) to deactivate the recorded `coupon_mints` node
- [ ] 2.5 POS: mint at Apply, the same as every other POS coupon shape — `integrations/shopify-pos/grade10`'s extension has no lifecycle hook at Tender to pin a later mint to (confirmed against `src/host/port.ts`/`src/acts/flow.ts`/`src/acts/spend.ts`). A re-plan that re-submits the same coupon reuses the same `coupon_mints` row via the idempotency key; a re-plan that drops or changes the coupon's eligible lines deactivates the prior mint the same way any other trimmed benefit is handled at POS step 9, and mints fresh on the next Apply that still carries it
- [ ] 2.6 Unit tests covering `grade10-site-store-discounts-SC-05`, `grade10-site-store-discounts-SC-06`, plus: submit-abandon-resubmit with the same coupon mints and settles exactly one code; a canceled/superseded order deactivates its unspent mint; a re-plan that drops the coupon between two Applies deactivates the stale mint and a later re-plan that re-adds it mints fresh

## 3. One discount-code slot, owned end to end (grade10)

- [ ] 3.1 `resolveCoupons()` (`packages/grade10-store/backend/src/services/coupons/apply.ts`) refuses `requested.length > 1`, replacing the narrower `order`-only check — covers `grade10-site-store-discounts-SC-04`
- [ ] 3.2 `orders/promise.ts`'s `reserveRewardCoupon()` gains the same refusal against `facts.discountCodes`/any other open discount code on the basket, checked before loyalty's `coupons.reserve()` is even called — the reward-coupon case of `grade10-site-store-discounts-SC-04`, replacing `deliver-reward-coupons`' dropped draft scenario for the same rule
- [ ] 3.3 Take a `SELECT ... FOR UPDATE` on the requested coupon rows (or add a DB-level partial unique constraint on "one open ride per coupon id") inside the transaction that inserts `order_coupons`, closing `openRiders()`'s plain-read race before any mint runs
- [ ] 3.4 Replace `CheckoutCouponFacts`'s `orderCodes` / `lineDiscounts` split with `discountCodes: readonly string[]` and `couponDiscountMinor` per tech-design.md; update every reader — `checkout.ts`, `checkoutRequest.ts`, order-item and order-coupon writers, **`orders/promise.ts`'s points-basis calculation**, and **`pos/sale/sale.ts`'s `weldsOf()`** — the last two read `couponDiscountMinor` in place of summing `lineDiscounts`; repoint `order_items.discountMinor`'s per-line attribution at each ride's own `evaluation.lineCuts` summed by `variantId`
- [ ] 3.5 Update `shopifyProvider.ts`'s `createDraftCheckout()` to place the resolved `discountCodes` (product coupon, gift, order coupon, reward coupon, or a typed code — whichever one rode) onto the draft order's `discountCodes`, never `appliedDiscount`, for anything but points
- [ ] 3.6 Widen `checkoutRequest.ts`'s `buildCheckoutRequest()` `discountCodes` filter from `coupon.kind === "order"` to every kind that rides as a code (`order`, `product`, `gift`), **and** add a second source: when `order.loyaltyCouponId` is set, include the code from the `coupon_mints` row keyed `(order.id, order.loyaltyCouponId)` — this is a separate lookup, not a widened `order_coupons` filter, since a reward coupon has no `order_coupons` row (see 3.7/3.8). Without this, a successfully-minted product/gift/reward coupon's code never reaches the draft order's `discountCodes` and the shop prices the basket undiscounted while the local system believes it rode
- [ ] 3.7 `reserveRewardCoupon()` mints a real, customer-scoped Shopify Discount code for a reward's coupon once loyalty's reservation succeeds — calling `mintDiscountCode()` keyed by `(orderId, args.couponId)`, persisting the `coupon_mints` row (`origin: "reward_coupon"`), and releasing the loyalty reservation (`releaseReward`) and refusing the promise if the mint fails. This is the mechanism `deliver-reward-coupons` task group 3 depends on for its collection-guard replacement — do not consider that change unblocked until this task ships
- [ ] 3.8 `orders/eventSink.ts`'s `ownedEvent()` stops hardcoding `kind: "draft_line_discount"` for a reward coupon's `providerArtifact`: look up the `coupon_mints` row for `(order.id, order.loyaltyCouponId)` and report `kind: "discount_code"` with its `nodeId`/`code` when one exists; only a reward settled before this change shipped still falls back to `draft_line_discount`
- [ ] 3.9 Unit and integration tests: a basket eligible for two coupons at once (including a reward coupon alongside a typed code) is refused before evaluation; `test/services/checkout.test.ts` (~line 503, `couponCodes: ['cut-aaa', 'gift-bbb']`) and `test/services/pos/sale/sale.test.ts` (~line 478) — both currently combine a product coupon and a gift and assert the combined cut — are updated to the new refusal, not left contradicting it; a test asserting the points cap still equals goods minus every coupon/code's value after this change, online and at the till; a reward coupon's redemption mints a code, settles reporting `kind: "discount_code"`, and a mint failure leaves the coupon back in the member's wallet rather than stuck `reserved`

## 4. POS parity, including the real till extension (grade10)

- [ ] 4.1 `packages/grade10-store/backend/src/services/pos/simulator/basket.ts` and `sale.ts` carry the same one-code rule and the same discount-code transport for a product coupon and a gift — covers `grade10-site-store-discounts-SC-07`
- [ ] 4.2 `integrations/shopify-pos/grade10` (`src/acts/flow.ts`, `src/host/port.ts`, the gateway plan builder) converts its gift/product-coupon weld path (`setLineItemDiscount`) to the discount-code transport (`addCartCodeDiscount`) — the real staff-facing till, not just the backend simulator. Verify on staging (task 6.4) that a customer-scoped, product-fixed code applied cart-wide entitles correctly when the same variant appears on two lines (one paid, one meant free), before relying on this in production; record whether the per-unit-across-split-lines model and `weldPartialSentence` survive, are retired, or need a code-transport equivalent
- [ ] 4.3 POS undo (Clear / Remove every discount) targets a product-coupon or gift discount code the same way it already targets an order coupon's, since neither is a welded line anymore. This inherits order-coupon's existing "codes stay, use Remove All" limitation — a gift/product coupon loses today's clean single-tap removal. Accepted trade-off, recorded here rather than left implicit — no task in this change builds a single-code removal path
- [ ] 4.4 Rewrite `confirmTillSale`'s `product`-kind landing detection (`pos/sale/sale.ts`) to match by code, the same way `order` already is, instead of falling through to `orderCouponCuts` weld rows — a landed product-coupon-as-code ride must not be misclassified as dropped; a reward-coupon ride matches by its `coupon_mints` code the same way, since it never had an `orderCouponCuts` row either
- [ ] 4.5 Widen `settle.ts`'s `adoptUnreportedCodes()` kind filter (currently `eq(coupons.kind, "order")`) to cover `product`/`gift` codes too, so a code a till honored with no matching promise is adopted and marked spent rather than silently unreconciled
- [ ] 4.6 POS settlement correlates a landed sale's coupon by its own code among the codes the sale carried, for every coupon kind uniformly, in `settle.ts`'s `corroborates()`
- [ ] 4.7 Tests: a landed product-coupon-as-code ride confirms and settles correctly; an unpromised product/gift code a till honored is adopted and counted

## 5. Collector picks one (grade10)

- [ ] 5.1 Write `ui-design.md` for the choice surface
- [ ] 5.2 Add `evaluateCouponsEligibility(basket, coupons) -> EligibilityResult[]` (a dry-run `evaluateCoupon` against the basket for each candidate) to tech-design.md's Service Interfaces; `tillPanelCoupon()` and `listSpendableCoupons()` both call it instead of listing every live coupon unfiltered
- [ ] 5.3 Cart / checkout UI: when a basket qualifies for more than one coupon, present the precomputed choice and apply only the one the collector picks, rather than combining, auto-selecting, or refuse-and-retry — covers `grade10-site-store-discounts-SC-03`
- [ ] 5.4 POS UI extension: same choice, from the member's panel

Do not deploy group 3's backend refusal to production ahead of group 5 — hold it behind a flag, or ship both in the same deploy, so an untouched frontend never turns a working product+gift basket into an unexplained refusal.

## 6. Staging verification (grade10)

- [ ] 6.1 Redeem one product coupon (fixed-amount) and one gift on staging; confirm each mints a real, customer-scoped Shopify Discount at redemption and a checkout settles by it
- [ ] 6.2 Redeem a percentage-with-ceiling product coupon on staging; confirm no code mints during price preview, one mints at submit, and the amount matches the local preview's number
- [ ] 6.3 Redeem a reward coupon on staging; confirm it mints at order-promise time, settles reporting `kind: "discount_code"` (not the old `draft_line_discount`), and a POS Apply mints the same way
- [ ] 6.4 Attempt two coupons on one basket on staging, including a reward coupon alongside a typed code; confirm the collector is asked to choose, and only one code reaches the draft order
- [ ] 6.5 Run a POS sale on staging spending a product coupon through the real till extension (not the simulator); confirm settlement, Undo, and unreported-code adoption match 4.2–4.6, and specifically confirm the split-line entitlement question flagged in 4.2
- [ ] 6.6 Exercise a backfilled pre-change coupon (group 1.7) against the post-change checkout
- [ ] 6.7 Submit, abandon, and resubmit the same checkout carrying the same percentage-with-ceiling coupon; confirm only one live code ever exists

## 7. Manual page (grade10-spec)

- [ ] 7.1 Once 6.1–6.7 verify, remove the 🚧 marks this change delivers on `docs/prds/products/grade10-site/store/discounts.md` and `docs/prds/products/grade10-site/loyalty/coupons.md`
