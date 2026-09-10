**Status note (2026-09-10 review):** tasks 1.1–3.1 were previously checked complete, but the code they describe was never written — `acceptAutomaticDiscounts` does not appear anywhere in the grade10 repository, so the staging-verification steps could not have run as recorded. Reopened as not started; the manual page's premature unmarked/"confirmed on staging" claims are reverted alongside this.

## 1. Draft order acceptance (grade10) (owner: @ecchochan)

- [ ] 1.1 Set `acceptAutomaticDiscounts: true` in `draftOrderVariables()` (`packages/shopify/backend/src/admin/draftOrders.ts`) — the one builder both `draftOrderCreate` and `draftOrderCalculate` use, so this alone covers both the online checkout and the POS simulator's draft input (`services/pos/simulator/basket.ts` builds a `ShopifyDraftOrderInput` and never sets wire fields itself) — `grade10-site-store-site-discounts-SC-01`, `SC-02`
- [ ] 1.2 Typecheck and run the shopify package's existing draft order tests

## 2. Staging verification (grade10) (owner: @ecchochan)

- [ ] 2.1 Create one test automatic discount in Shopify Admin (staging store), run a checkout on staging, confirm the cut applies and shows in `codeDiscountMinor` (tech-design.md Migration Plan)
- [ ] 2.2 Run the same product through a POS sale on staging, confirm parity — `grade10-site-store-site-discounts-SC-02`
- [ ] 2.3 Test one discount code together with the automatic discount on staging; record the actual refuse/stack/replace outcome against the spec's open combine-rule question — this is the answer `present-cart-site-sale-promo-outcomes` depends on; do not skip or shortcut it

## 3. Manual page (grade10-spec) (owner: @ecchochan)

- [ ] 3.1 Once 2.1–2.3 genuinely verify (a real staging run, not a restatement of this file's prior text), remove the 🚧 marks this change delivers and resolve or restate the ❓ lines on `docs/prds/products/grade10-site/store/discounts.md` per what staging showed
