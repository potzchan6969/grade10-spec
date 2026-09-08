## 1. Grade10 Cart Drawer UI copy (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Add and register a Grade10 brand `store` catalog overlay for `en`, `zh-Hant`, and `zh-Hans` with the `CartDrawerCopy` header, item, footer, and cleanup vocabulary, while reusing the existing shared `chrome.cartLabel` for navigation.
- [x] 1.2 Make catalog resolution prove the Cart Drawer vocabulary for every supported Grade10 locale, including existing shared fallback behavior; verify with the affected `@grade10/i18n` tests, typecheck, and build.

## 2. Cart Drawer UI and existing Store integration (grade10) (owner: @kinisworking)

This group depends on the landed catalog commit and integrates the UI with the
existing typed Store cart/review backend boundary. It makes no backend changes
and tests against typed fixtures rather than a running backend.

- [ ] 2.1 Advance `external/grade10-spec` to the landed catalog commit while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [ ] 2.2 Add backwards-compatible `enabled` and `removeUnavailable` options to `useCartReview`; when the drawer disables removal, preserve unavailable lines for `CartDrawer`, while checkout defaults remain unchanged. Make the open-controlled review, single cleanup owner, scope change, failure, and post-write invalidation scenarios pass in focused hook tests.
- [ ] 2.3 Add one Store-route-gated root host with `Nav.onCartClick`, one `Toast`, the current scoped cart, controlled live-review loading, and one localized failure toast per open; keep stale values unresolved and Checkout disabled. Make `shared-ui-store-cart-SC-08`, `shared-ui-store-cart-SC-02`, `shared-ui-store-cart-SC-03`, `shared-ui-store-cart-SC-04`, `shared-ui-store-cart-SC-06`, `shared-ui-store-cart-SC-07`, and `grade10-site-store-cart-validation-SC-21` pass in focused shell tests.
- [ ] 2.4 Map reviewed lines and minor-unit subtotal into the existing drawer contract, omit images and unsupported calculation fields, render shipping as localized `TBD`, use subtotal as estimated total, and let `CartDrawer` own unavailable cleanup and its one toast so `shared-ui-store-cart-SC-11` and `shared-ui-store-cart-SC-12` pass without duplicate writes.
- [ ] 2.5 Wire quantity and removal actions to the scoped cart, product and Browse More actions to existing Store addresses, Checkout to `/checkout`, and the promo affordance with no redemption callbacks; make `shared-ui-store-cart-SC-09` pass without changing cart persistence, backend contracts, or checkout creation.
- [ ] 2.6 Verify the affected Grade10 app with focused cart, shell, route, and locale tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`; do not run `pnpm run test:backend` because this change has no backend files.
