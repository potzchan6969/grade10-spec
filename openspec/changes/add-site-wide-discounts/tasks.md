## 1. Draft order acceptance (grade10) (owner: @ecchochan)

- [ ] 1.1 Set `acceptAutomaticDiscounts: true` in `draftOrderVariables()` (`packages/shopify/backend/src/admin/draftOrders.ts`), covering `grade10-site-store-site-discounts-SC-01`
- [ ] 1.2 Add `platformDiscounts` to `DRAFT_ORDER_FIELDS` and `DRAFT_ORDER_CALCULATE`; derive `automaticDiscountMinor` and `codeDiscountMinor` from it on `ShopifyDraftOrderPricing`, replacing the `totalDiscountsSet` subtraction (tech-design.md Decisions) — grep every existing reader of `codeDiscountMinor` first and confirm none breaks under the new derivation
- [ ] 1.3 Same `acceptAutomaticDiscounts: true` on the POS simulator's draft input (`packages/grade10-store/backend/src/services/pos/simulator/basket.ts`), covering `grade10-site-store-site-discounts-SC-02`
- [ ] 1.4 Typecheck and run the shopify package's existing draft order tests

## 2. Staging verification (grade10)

- [ ] 2.1 Create one test automatic discount in Shopify Admin (staging store), run a checkout on staging, confirm the cut applies and `platformDiscounts` reports it correctly (tech-design.md Migration Plan)
- [ ] 2.2 Run the same product through a POS sale on staging, confirm parity — `grade10-site-store-site-discounts-SC-02`
- [ ] 2.3 Test one discount code together with the automatic discount on staging; record the actual refuse/stack/replace outcome against the spec's open combine-rule question

## 3. Manual page (grade10-spec)

- [ ] 3.1 Once 2.1–2.3 verify, remove the 🚧 marks this change delivers and resolve or restate the ❓ lines on `docs/prds/products/grade10-site/store/discounts.md` per what staging showed
