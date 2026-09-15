## 1. Catalog and story (grade10-spec) (owner: @sean)

- [x] 1.1 Add `signIn.titleAddToCart` to the Grade10 catalogs in en, zh-Hans and zh-Hant, holding **Sign In to Add to Cart**
- [x] 1.2 Add a **From add to cart** story to `Auth Sign In/SignInCard` showing the dialog under that title
- [x] 1.3 Mark Product Tile and Buy with the title a collector meets when Add to cart opens sign-in
- [x] 1.4 Verify: `pnpm run typecheck && pnpm check:manual && pnpm run test:stories:ui`

## 2. The title through the overlay (grade10) (owner: @sean)

- [x] 2.1 Carry the title as the sign-in dialog's subject, so an ask that names one opens under it and an ask that names none opens under the catalog title
- [x] 2.2 Take a `title` on `SignInFlow`, read in place of `tSignIn("title")` when the flow translates
- [x] 2.3 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs auth-frontend`

## 3. Add to cart names why (grade10)

Needs the title seam from group 2, and the dialog that
[`require-sign-in-to-add-to-cart`](../require-sign-in-to-add-to-cart/tasks.md)
opens from Add to cart — until that change lands there is nothing to title.

- [ ] 3.1 Bump the `external/grade10-spec` submodule to the commit carrying `signIn.titleAddToCart`
- [ ] 3.2 Title the dialog **Sign In to Add to Cart** when the listing's cart control opens it (grade10-site-store-product-listing-SC-47)
- [ ] 3.3 Title the dialog **Sign In to Add to Cart** when the product page's Add to cart opens it (grade10-site-store-product-page-SC-29)
- [ ] 3.4 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs web-spa`
