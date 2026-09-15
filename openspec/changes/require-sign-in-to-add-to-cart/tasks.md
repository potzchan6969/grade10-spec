## 1. Manual (grade10-spec)

- [ ] 1.1 Mark Product Tile with what Add to cart does for a collector with no session: sign-in opens, the tile gains nothing, and the add completes after a sign-in taken on the listing
- [ ] 1.2 Mark Buy with the same outcome on the product page
- [ ] 1.3 State on Reviewing the Cart and on Checkout that the cart is members only and there is no guest checkout
- [ ] 1.4 Verify: `pnpm check:manual`

## 2. Cart sign-in gate (grade10) (owner: @sean)

- [ ] 2.1 Refuse a cart write while the scope is a guest and report the ask to the consumer's `onSignInRequired`, writing no line (grade10-site-store-product-listing-SC-44, grade10-site-store-product-page-SC-26)
- [ ] 2.2 Perform an armed intent once the scope becomes a member, leaving a line the store refuses on the store's refusal path and dropping the intent when the surface goes (grade10-site-store-product-listing-SC-46, grade10-site-store-product-page-SC-28)
- [ ] 2.3 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs store-frontend`

## 3. Product page Add to cart (grade10) (owner: @sean)

Needs the gate from group 2 landed.

- [ ] 3.1 Open sign-in from a signed-out Add to cart on the product page, adding nothing (grade10-site-store-product-page-SC-26)
- [ ] 3.2 Leave the cart unchanged and the collector signed out when the dialog is dismissed (grade10-site-store-product-page-SC-27)
- [ ] 3.3 Complete the intended variant and quantity into the member cart when sign-in succeeds on the page (grade10-site-store-product-page-SC-28)
- [ ] 3.4 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs store-frontend web-spa`

## 4. Product listing Add to cart (grade10) (owner: @sean)

Needs the gate from group 2 landed; claimable beside group 3.

- [ ] 4.1 Open sign-in from a signed-out tile cart control on the listing, adding nothing (grade10-site-store-product-listing-SC-44)
- [ ] 4.2 Leave the cart unchanged and the collector signed out when the dialog is dismissed (grade10-site-store-product-listing-SC-45)
- [ ] 4.3 Complete the intended card and quantity into the member cart when sign-in succeeds on the listing (grade10-site-store-product-listing-SC-46)
- [ ] 4.4 Verify: `pnpm run typecheck && pnpm run lint && node scripts/test.mjs web-spa`
