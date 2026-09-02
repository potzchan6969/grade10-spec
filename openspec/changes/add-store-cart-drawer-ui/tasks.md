## 1. Grade10 locale vocabulary (grade10-spec)

- [ ] 1.1 Add the Cart Drawer header, item, footer, refresh-placeholder, empty-state, and toast copy under the existing Grade10 `store` catalog for `en`, `zh-Hant`, and `zh-Hans`, preserving the shared `CartDrawerCopy` shape and existing catalog fallback rules.
- [ ] 1.2 Make the catalog resolution suite prove the new Cart Drawer vocabulary resolves for every supported Grade10 locale; verify with the affected `@grade10/i18n` tests and typecheck.

## 2. Store Cart Drawer host (grade10)

- [ ] 2.1 Advance `external/grade10-spec` to the landed catalog commit, preserving unrelated nested checkout changes, and make the submodule boundary pass with `pnpm run check:submodules`.
- [ ] 2.2 Add the route-gated root composition that supplies the localized `chrome.cartLabel`, `Nav.onCartClick`, and one application-level `Toaster` only on store home, store collections, store product, and checkout surfaces; make the navigation entry and route visibility behavior pass the relevant store shell tests.
- [ ] 2.3 Implement the app-owned Cart Drawer refresh adapter and display snapshot from the existing browser cart: call it through `CartDrawer.onFetchStatusAndPrice` on every open, project current lines with minor-unit formatting and provisional totals, and keep the promise boundary replaceable for future live status/calculation data; make `store-cart-SC-08`, `store-cart-SC-02`, `store-cart-SC-03`, `store-cart-SC-04`, and `store-cart-SC-07` pass in focused tests.
- [ ] 2.4 Wire Cart Drawer quantity changes and removals to the existing cart feature, product-item navigation to the existing product route, and checkout to provisional navigation at `/checkout`; make `store-cart-SC-06` and `store-cart-SC-09` pass without changing the persisted cart schema.
- [ ] 2.5 Verify the affected Grade10 app with focused Cart Drawer and shell tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`.
