## 1. Mint at redemption (grade10)

- [ ] 1.1 Extend `createCoupon()`'s Shopify-minting branch (`packages/grade10-store/backend/src/services/coupons/create.ts`) to also cover `gift` and a fixed-amount `product` coupon, reusing `codeScope`, `shopTarget`, `COMBINES_WITH`, `compensateMint` unchanged — covers `grade10-site-store-discounts-SC-01` (fixed-amount case), `grade10-site-store-discounts-SC-02`
- [ ] 1.2 Look up the gift variant's current catalog price in `resolveDefinition()`'s gift branch, and mint its code with that amount as the fixed value
- [ ] 1.3 Unit tests: a gift and a fixed-amount product coupon each mint a real Shopify Discount at redemption and compensate on a failed insert, mirroring the existing `order` coupon tests

## 2. Checkout-time minting for percentage coupons (grade10)

- [ ] 2.1 Add `mintComputedCouponCode()` per tech-design.md's Service Interfaces, called only from the checkout-submit path
- [ ] 2.2 Wire it into the final checkout submission for a percentage-with-ceiling product coupon ride, immediately before `createDraftOrder`, with compensation on a subsequent failure
- [ ] 2.3 Confirm `calculateDraftOrder` (price preview) never calls it — the local evaluator number stays what the preview shows
- [ ] 2.4 Unit tests covering `grade10-site-store-discounts-SC-05`, `grade10-site-store-discounts-SC-06`

## 3. One discount-code slot (grade10)

- [ ] 3.1 `resolveCoupons()` (`packages/grade10-store/backend/src/services/coupons/apply.ts`) refuses `requested.length > 1`, replacing the narrower `order`-only check — covers `grade10-site-store-discounts-SC-04`
- [ ] 3.2 Replace `CheckoutCouponFacts`'s `orderCodes` / `lineDiscounts` split with `discountCodes: readonly string[]` per tech-design.md; update every reader (`checkout.ts`, `checkoutRequest.ts`, order-item and order-coupon writers)
- [ ] 3.3 Update `shopifyProvider.ts`'s `createDraftCheckout()` to place the resolved `discountCodes` (product coupon, gift, order coupon, or a typed code — whichever one rode) onto the draft order's `discountCodes`, never `appliedDiscount`, for anything but points
- [ ] 3.4 Unit and integration tests: a basket eligible for two coupons at once is refused before evaluation; an existing test or fixture asserting the old combining behavior is found and updated, not left contradicting the new rule

## 4. POS parity (grade10)

- [ ] 4.1 `packages/grade10-store/backend/src/services/pos/simulator/basket.ts` and `sale.ts` carry the same one-code rule and the same discount-code transport for a product coupon and a gift — covers `grade10-site-store-discounts-SC-07`
- [ ] 4.2 POS undo (Clear / Remove every discount) targets a product-coupon or gift discount code the same way it already targets an order coupon's, since neither is a welded line anymore
- [ ] 4.3 POS settlement correlates a landed sale's coupon by its own code among the codes the sale carried, for every coupon kind uniformly

## 5. Collector picks one (grade10)

- [ ] 5.1 Cart / checkout UI: when a basket qualifies for more than one coupon, present the choice and apply only the one the collector picks, rather than combining or auto-selecting — covers `grade10-site-store-discounts-SC-03`
- [ ] 5.2 POS UI extension: same choice, from the member's panel

## 6. Staging verification (grade10)

- [ ] 6.1 Redeem one product coupon (fixed-amount) and one gift on staging; confirm each mints a real Shopify Discount at redemption and a checkout settles by it
- [ ] 6.2 Redeem a percentage-with-ceiling product coupon on staging; confirm no code mints during price preview, one mints at submit, and the amount matches the local preview's number
- [ ] 6.3 Attempt two coupons on one basket on staging; confirm the collector is asked to choose, and only one code reaches the draft order
- [ ] 6.4 Run a POS sale on staging spending a product coupon; confirm settlement and Undo behavior match 4.2–4.3

## 7. Manual page (grade10-spec)

- [ ] 7.1 Once 6.1–6.4 verify, remove the 🚧 marks this change delivers on `docs/prds/products/grade10-site/store/discounts.md` and `docs/prds/products/grade10-site/loyalty/coupons.md`
