Groups 0 and 1 land the shared mint machinery and the schema it needs; every
other group depends on them. Group 3 also covers a reward coupon as one
case of `grade10-site-store-discounts-SC-04` — this change is the sole
owner of the one-discount-code rule end to end, across both the
code-resolved path and a reward's own `couponId` path.
`deliver-reward-coupons` dropped its own draft scenario for the same rule
(`grade10-site-loyalty-programme-SC-163`) in favor of this one; see that
change's tasks.md.

## 0. Schema migration (grade10)

- [ ] 0.1 Rewrite `ck_coupons_shape`'s CHECK constraint (`packages/grade10-store/backend/src/db/schema/coupons.ts`) to allow a non-null `shopify_node_id` for `kind = 'product'` and `kind = 'gift'`, not just `order`
- [ ] 0.2 Add the `coupon_mints` table (or equivalent columns on `order_coupons`) recording `{ orderId, couponId, nodeId, code }`, written before `createDraftOrder` runs, that both mint call sites in group 1/2 read for idempotent retry
- [ ] 0.3 Schema-level test asserting a `product`/`gift` row with `shopifyNodeId` set is accepted, alongside the existing `test/schema/couponPersistence.test.ts` coverage

## 1. Shared mint machinery (grade10)

- [ ] 1.1 Extract `create.ts`'s existing generate-code/retry/compensate loop into `mintDiscountCode(deps, params) -> outcome`, called from `createCoupon()`'s redemption branch unchanged in behavior
- [ ] 1.2 Add `canMintAtRedemption(definition): boolean` beside `evaluateCoupon` in `@grade10/coupons-contracts`; `create.ts`'s minting branch and the checkout-submit path (group 2) both branch on it instead of re-deriving kind/benefit-shape independently
- [ ] 1.3 Extend `createCoupon()`'s Shopify-minting branch to also cover `gift` and a fixed-amount `product` coupon (`canMintAtRedemption() === true`), reusing `codeScope`, `shopTarget`, `COMBINES_WITH` — except `codeScope`, which for `product`/`gift` always scopes to the member's paired Shopify customer, never `{kind:'all'}` — covers `grade10-site-store-discounts-SC-01` (fixed-amount case), `grade10-site-store-discounts-SC-02`
- [ ] 1.4 Look up the gift variant's current catalog price in `resolveDefinition()`'s gift branch, and mint its code with that amount as the fixed value
- [ ] 1.5 Persist the `coupon_mints` row (or equivalent) in the same transaction as the local insert, for every redemption-time mint
- [ ] 1.6 Unit tests: a gift and a fixed-amount product coupon each mint a real, customer-scoped Shopify Discount at redemption and compensate on a failed insert, mirroring the existing `order` coupon tests
- [ ] 1.7 Backfill script: mint a real Shopify Discount for every currently-live `product`/`gift` coupon row that predates this change (`shopifyNodeId` null), idempotent and logged; run once at deploy

## 2. Checkout-time minting for percentage coupons (grade10)

- [ ] 2.1 Add `mintComputedCouponCode()` per tech-design.md's Service Interfaces — takes an idempotency key (`orderId` + `couponId`), checks `coupon_mints` before minting, calls `mintDiscountCode()` (group 1.1), and is called only from the checkout-submit path
- [ ] 2.2 Wire it into the final checkout submission for a percentage-with-ceiling product coupon ride (`canMintAtRedemption() === false`), immediately before `createDraftOrder`, persisting the `coupon_mints` row in the same transaction, with compensation on a subsequent failure
- [ ] 2.3 Confirm `calculateDraftOrder` (price preview) never calls it — the local evaluator number stays what the preview shows
- [ ] 2.4 Extend `orders/retire.ts`'s `supersedePromisedOrders` (and any other path that cancels/expires an order carrying an unspent mint) to deactivate the recorded `coupon_mints` node
- [ ] 2.5 Pin POS's equivalent of "submit" to Tender, not Apply, for this coupon shape specifically — Apply keeps showing the local evaluator's number; define whether/how a basket change between Apply and Tender invalidates a stale mint
- [ ] 2.6 Unit tests covering `grade10-site-store-discounts-SC-05`, `grade10-site-store-discounts-SC-06`, plus: submit-abandon-resubmit with the same coupon mints and settles exactly one code; a canceled/superseded order deactivates its unspent mint

## 3. One discount-code slot, owned end to end (grade10)

- [ ] 3.1 `resolveCoupons()` (`packages/grade10-store/backend/src/services/coupons/apply.ts`) refuses `requested.length > 1`, replacing the narrower `order`-only check — covers `grade10-site-store-discounts-SC-04`
- [ ] 3.2 `orders/promise.ts`'s `reserveRewardCoupon()` gains the same refusal against `facts.discountCodes`/any other open discount code on the basket, so a reward coupon and a typed code or store coupon refuse each other — the reward-coupon case of `grade10-site-store-discounts-SC-04`, replacing `deliver-reward-coupons`' dropped draft scenario for the same rule
- [ ] 3.3 Take a `SELECT ... FOR UPDATE` on the requested coupon rows (or add a DB-level partial unique constraint on "one open ride per coupon id") inside the transaction that inserts `order_coupons`, closing `openRiders()`'s plain-read race before any mint runs
- [ ] 3.4 Replace `CheckoutCouponFacts`'s `orderCodes` / `lineDiscounts` split with `discountCodes: readonly string[]` and `couponDiscountMinor` per tech-design.md; update every reader — `checkout.ts`, `checkoutRequest.ts`, order-item and order-coupon writers, **`orders/promise.ts`'s points-basis calculation**, and **`pos/sale/sale.ts`'s `weldsOf()`** — the last two read `couponDiscountMinor` in place of summing `lineDiscounts`
- [ ] 3.5 Update `shopifyProvider.ts`'s `createDraftCheckout()` to place the resolved `discountCodes` (product coupon, gift, order coupon, or a typed code — whichever one rode) onto the draft order's `discountCodes`, never `appliedDiscount`, for anything but points
- [ ] 3.6 Unit and integration tests: a basket eligible for two coupons at once (including a reward coupon alongside a typed code) is refused before evaluation; `test/services/checkout.test.ts` (~line 503, `couponCodes: ['cut-aaa', 'gift-bbb']`) and `test/services/pos/sale/sale.test.ts` (~line 478) — both currently combine a product coupon and a gift and assert the combined cut — are updated to the new refusal, not left contradicting it; a test asserting the points cap still equals goods minus every coupon/code's value after this change, online and at the till

## 4. POS parity, including the real till extension (grade10)

- [ ] 4.1 `packages/grade10-store/backend/src/services/pos/simulator/basket.ts` and `sale.ts` carry the same one-code rule and the same discount-code transport for a product coupon and a gift — covers `grade10-site-store-discounts-SC-07`
- [ ] 4.2 `integrations/shopify-pos/grade10` (`src/acts/flow.ts`, `src/host/port.ts`, the gateway plan builder) converts its gift/product-coupon weld path (`setLineItemDiscount`) to the discount-code transport (`addCartCodeDiscount`) — the real staff-facing till, not just the backend simulator
- [ ] 4.3 POS undo (Clear / Remove every discount) targets a product-coupon or gift discount code the same way it already targets an order coupon's, since neither is a welded line anymore
- [ ] 4.4 Rewrite `confirmTillSale`'s `product`-kind landing detection (`pos/sale/sale.ts`) to match by code, the same way `order` already is, instead of falling through to `orderCouponCuts` weld rows — a landed product-coupon-as-code ride must not be misclassified as dropped
- [ ] 4.5 Widen `settle.ts`'s `adoptUnreportedCodes()` kind filter (currently `eq(coupons.kind, "order")`) to cover `product`/`gift` codes too, so a code a till honored with no matching promise is adopted and marked spent rather than silently unreconciled
- [ ] 4.6 POS settlement correlates a landed sale's coupon by its own code among the codes the sale carried, for every coupon kind uniformly, in `settle.ts`'s `corroborates()`
- [ ] 4.7 Tests: a landed product-coupon-as-code ride confirms and settles correctly; an unpromised product/gift code a till honored is adopted and counted

## 5. Collector picks one (grade10)

- [ ] 5.1 Write `ui-design.md` for the choice surface: a server-side eligibility precheck (dry-run `evaluateCoupon` against the basket) computes which of a collector's coupons would actually pass, before presenting the choice — neither `tillPanelCoupon()` nor `listSpendableCoupons()` filters on basket eligibility today
- [ ] 5.2 Cart / checkout UI: when a basket qualifies for more than one coupon, present the precomputed choice and apply only the one the collector picks, rather than combining, auto-selecting, or refuse-and-retry — covers `grade10-site-store-discounts-SC-03`
- [ ] 5.3 POS UI extension: same choice, from the member's panel

Sequence 3.1/3.6's backend refusal to ship together with 5.2, not ahead of it — an untouched frontend would otherwise turn a working product+gift basket into an unexplained refusal.

## 6. Staging verification (grade10)

- [ ] 6.1 Redeem one product coupon (fixed-amount) and one gift on staging; confirm each mints a real, customer-scoped Shopify Discount at redemption and a checkout settles by it
- [ ] 6.2 Redeem a percentage-with-ceiling product coupon on staging; confirm no code mints during price preview, one mints at submit, and the amount matches the local preview's number
- [ ] 6.3 Attempt two coupons on one basket on staging, including a reward coupon alongside a typed code; confirm the collector is asked to choose, and only one code reaches the draft order
- [ ] 6.4 Run a POS sale on staging spending a product coupon through the real till extension (not the simulator); confirm settlement, Undo, and unreported-code adoption match 4.2–4.6
- [ ] 6.5 Exercise a backfilled pre-change coupon (group 1.7) against the post-change checkout
- [ ] 6.6 Submit, abandon, and resubmit the same checkout carrying the same percentage-with-ceiling coupon; confirm only one live code ever exists

## 7. Manual page (grade10-spec)

- [ ] 7.1 Once 6.1–6.6 verify, remove the 🚧 marks this change delivers on `docs/prds/products/grade10-site/store/discounts.md` and `docs/prds/products/grade10-site/loyalty/coupons.md`
