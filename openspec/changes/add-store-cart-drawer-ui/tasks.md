## 1. Grade10 Cart Drawer UI copy (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Add and register a Grade10 brand `store` catalog overlay for `en`, `zh-Hant`, and `zh-Hans` with the `CartDrawerCopy` header, item, footer, and cleanup vocabulary, while reusing the existing shared `chrome.cartLabel` for navigation.
- [x] 1.2 Make catalog resolution prove the Cart Drawer vocabulary for every supported Grade10 locale, including existing shared fallback behavior; verify with the affected `@grade10/i18n` tests, typecheck, and build.

## 2. Cart Drawer UI and existing Store integration (grade10) (owner: @kinisworking)

This group depends on the landed catalog commit and integrates the UI with the
existing typed Store cart/review backend boundary. It makes no backend changes
and tests against typed fixtures rather than a running backend.

- [x] 2.1 Advance `external/grade10-spec` to the landed catalog commit while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [x] 2.2 Add backwards-compatible `enabled` and `removeUnavailable` options to `useCartReview`; when the drawer disables removal, preserve unavailable lines for `CartDrawer`, while checkout defaults remain unchanged. Make `grade10-site-store-cart-drawer-SC-03` through `grade10-site-store-cart-drawer-SC-08` pass in focused hook tests without changing the `grade10-site/store/cart-validation` meaning of an open-time read.
- [x] 2.3 Add one Store-route-gated root host with `Nav.onCartClick`, one `Toast`, the current scoped cart, controlled live-review loading, and one localized failure toast per open. Make `grade10-site-site-page-shell-SC-09`, `grade10-site-site-page-shell-SC-16`, and `grade10-site-store-cart-drawer-SC-01` through `grade10-site-store-cart-drawer-SC-08` pass in focused shell tests.
- [x] 2.4 Map reviewed lines and the minor-unit subtotal into the existing drawer contract (after `cart-drawer-empty-state`), omit images and unsupported calculation fields, render shipping as localized `Calculated at checkout`, use subtotal as estimated total, supply `emptyTitle` / `emptyDescription`, and supply no points state or promo callbacks. Let `CartDrawer` own unavailable cleanup and its one toast so `grade10-site-store-cart-drawer-SC-09`, `grade10-site-store-cart-drawer-SC-10`, `grade10-site-store-cart-drawer-SC-12`, `shared-ui-store-cart-SC-10`, and `shared-ui-store-cart-SC-11` pass without duplicate writes.
- [x] 2.5 Wire quantity and removal actions to the scoped cart, product line activation to existing Store product addresses, and Checkout to `/checkout`. Make `grade10-site-store-cart-drawer-SC-11`, `grade10-site-store-cart-drawer-SC-13`, and `grade10-site-store-cart-drawer-SC-15` pass without changing cart persistence, backend contracts, or checkout creation.
- [x] 2.6 Verify the affected Grade10 app with focused cart, shell, route, and locale tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`; do not run `pnpm run test:backend` because this change has no backend files.

## 3. Cart Drawer product record (grade10-spec) (owner: @kinisworking)

This group was appended to preserve the claimed group and task ids above. Land
it before publishing the final Grade10 gitlink.

- [x] 3.1 Publish the Cart Drawer manual page and update the page-shell and cart-validation records to match `grade10-site-store-cart-drawer-SC-01` through `grade10-site-store-cart-drawer-SC-13`, `grade10-site-store-cart-drawer-SC-15` through `grade10-site-store-cart-drawer-SC-19`, `grade10-site-site-page-shell-SC-09`, and `grade10-site-site-page-shell-SC-16`; make `pnpm check:manual` pass.
- [ ] 3.2 Add the Cart Drawer acceptance shelf once its spec is durable, so the approved suite is reachable from the page.
- [ ] 3.3 Re-verify `openspec validate add-store-cart-drawer-ui --strict` and
  `pnpm run tcs:validate` after the Cart Drawer feature suite represents the
  new US-04 journey; the current suite predates that journey.

## 4. Cart Drawer read-only tender context (grade10) (owner: @kinisworking)

This group consumes the existing Checkout read hooks and shared Cart Drawer
props. It does not add a combined quote, mutate a promo or points balance, or
change checkout creation. If the shared component renders a mutation control
when its callback is absent, stop and raise that as a separate shared UI
contract change rather than hiding it in the application adapter.

- [x] 4.1 Add an optional `enabled` condition to `useSpendableCoupons` and `usePointsTender` with their current enabled behavior preserved for Checkout; gate the drawer reads to an open, signed-in, non-empty cart whose current review is successful and ready, so `grade10-site-store-cart-drawer-SC-18` cannot trigger member-only reads for guests or unresolved reviews.
- [x] 4.2 In `CartDrawerHost`, key both reads from `review.items`, map successful coupon answers to held promo-code display data with localized value/expiry text and refusal reasons, map a quoted points answer to the existing collapsed points state plus a localized balance/ceiling label while reusing the existing rate copy, and pass `selectedHeldPromoId={null}` with no apply/select callbacks; make `grade10-site-store-cart-drawer-SC-16` and `grade10-site-store-cart-drawer-SC-17` pass while subtotal and estimated total remain the reviewed subtotal.
- [x] 4.3 Reset disclosure state and suppress prior read results on close, scope changes, cart edits, review refetches, and optional-read failures; prove that only the latest successful reviewed basket supplies tender context for `grade10-site-store-cart-drawer-SC-18` and `grade10-site-store-cart-drawer-SC-19` in focused hook and shell tests.
- [x] 4.4 Verify the affected Grade10 frontend with the focused Cart Drawer and checkout-hook tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`; do not run `pnpm run test:backend` because this group adds no backend files.
