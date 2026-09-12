**Status note (2026-09-10 review):** tasks 1.1–3.1 were previously checked complete, but the code they describe was never written — `acceptAutomaticDiscounts` does not appear anywhere in the grade10 repository, so the staging-verification steps could not have run as recorded. Reopened as not started; the manual page's premature unmarked/"confirmed on staging" claims are reverted alongside this.

## 1. Draft order acceptance (grade10) (owner: @ecchochan)

- [ ] 1.1 Set `acceptAutomaticDiscounts: true` in `draftOrderVariables()` (`packages/shopify/backend/src/admin/draftOrders.ts`) — the one builder both `draftOrderCreate` and `draftOrderCalculate` use, so this alone covers both the online checkout and the POS simulator's draft input (`services/pos/simulator/basket.ts` builds a `ShopifyDraftOrderInput` and never sets wire fields itself) — `grade10-site-store-site-discounts-SC-01`, `SC-02`
- [ ] 1.2 Typecheck and run the shopify package's existing draft order tests

## 2. Staging verification (grade10) (owner: @ecchochan)

- [ ] 2.1 Create one test automatic discount in Shopify Admin (staging store) per named type — a product special sale, a buy-X-get-Y offer, and an order threshold — since one test discount cannot generalise across three classes; run a checkout on staging and confirm each cut applies and shows in `codeDiscountMinor`
- [ ] 2.2 Run the same product through a POS sale on staging and assert three things against a real automatic discount on the cart: it applies, Apply is not blocked (the extension's `foreignCartDiscount` reads false, which depends on how the Cart API reports a percentage automatic's type), and "Remove every discount" confirms rather than timing out — `grade10-site-store-site-discounts-SC-02`
- [ ] 2.3 Test a discount code of each class grade10 mints — an order coupon, a product coupon, a gift and a reward — against an automatic ORDER discount on staging, once with the code the larger cut and once the smaller, and record the actual outcome per class and how the draft-order response names the applied automatic when the code is dropped; this is the answer `present-cart-site-sale-promo-outcomes` depends on and what `mint-coupons-as-discount-codes` task 4.12 reads, and it extends release gate 4, which today is scoped to a staff manual discount rather than an automatic one. Clear this before any automatic discount is created in production, not after
- [ ] 2.4 Put points on one of those baskets: the points tender rides as an order-level `appliedDiscount` on the same builder this change adds the flag to, and nothing else here tests the two together

## 3. Manual page (grade10-spec) (owner: @ecchochan)

- [ ] 3.1 Once 2.1–2.4 genuinely verify (a real staging run, not a restatement of this file's prior text), remove the 🚧 marks this change delivers and resolve or restate the ❓ lines on `docs/prds/products/grade10-site/store/discounts.md` per what staging showed
- [ ] 3.2 At the fold, add a `::spec` block naming `grade10-site/store/site-discounts` to `docs/prds/products/grade10-site/store/discounts.md`'s Site discounts section — this change creates a capability no page names, which the manual fails as `unreferenced` once the spec is on disk, and the same block fails `check:manual` as naming no spec while it is only a delta, so it goes in with the fold and not before; `mint-coupons-as-discount-codes` task 9.2 names the same block, so whichever archives first adds it
