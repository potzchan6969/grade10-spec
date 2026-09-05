## 1. Grade10 Cart Drawer copy (grade10-spec)

- [ ] 1.1 Add the Cart Drawer header, item, footer, empty-state, loading, unresolved-review, and unavailable-removal copy under the Grade10 `store` catalog for `en`, `zh-Hant`, and `zh-Hans`, preserving `CartDrawerCopy` and existing fallback rules.
- [ ] 1.2 Make catalog resolution prove the Cart Drawer vocabulary for every supported Grade10 locale; verify with the affected `@grade10/i18n` tests, typecheck, and build.

## 2. Live Cart Drawer integration (grade10)

This group uses the landed catalog change and tests the Store frontend against
typed fixtures rather than a running backend.

- [ ] 2.1 Advance `external/grade10-spec` to the landed catalog commit while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [ ] 2.2 Add backwards-compatible `enabled` and `removeUnavailable` options to `useCartReview`, keeping checkout defaults unchanged; make one open review, one cleanup owner, scope changes, review failure, and post-write invalidation pass in focused hook tests.
- [ ] 2.3 Add the Store-route-gated root host with `Nav.onCartClick`, one `Toaster`, the current scoped cart, controlled live-review loading, and one localized failure toast per open while stale values and Checkout stay disabled; make `shared-ui-store-cart-SC-08`, `shared-ui-store-cart-SC-02`, `shared-ui-store-cart-SC-03`, `shared-ui-store-cart-SC-04`, `shared-ui-store-cart-SC-07`, and `grade10-site-store-cart-validation-SC-21` pass in focused shell tests.
- [ ] 2.4 Map reviewed lines and minor-unit subtotal into the drawer, leave unsupported calculation fields absent, and let `CartDrawer` own unavailable removal and its one toast so `shared-ui-store-cart-SC-11` and `shared-ui-store-cart-SC-12` pass without duplicate writes.
- [ ] 2.5 Wire quantity and removal actions to the scoped cart, product and Browse More actions to existing Store addresses, and Checkout to the existing `/checkout` route; make `shared-ui-store-cart-SC-06` and `shared-ui-store-cart-SC-09` pass without changing cart persistence or checkout creation.
- [ ] 2.6 Verify the affected Grade10 app with focused cart, shell, and route tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`.
