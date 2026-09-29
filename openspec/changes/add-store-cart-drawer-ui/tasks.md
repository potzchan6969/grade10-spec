## 1. Grade10 Cart Drawer UI copy (grade10-spec) (owner: @kinisworking)

- [x] 1.1 Add and register a Grade10 brand `store` catalog overlay for `en`, `zh-Hant`, and `zh-Hans` with the `CartDrawerCopy` header, item, footer, and cleanup vocabulary, while reusing the existing shared `chrome.cartLabel` for navigation.
- [x] 1.2 Make catalog resolution prove the Cart Drawer vocabulary for every supported Grade10 locale, including existing shared fallback behavior; verify with the affected `@grade10/i18n` tests, typecheck, and build.

## 2. Cart Drawer UI and existing Store integration (grade10) (owner: @kinisworking)

This group depends on the landed catalog commit and integrates the UI with the
existing typed Store cart/review backend boundary. It makes no backend changes
and tests against typed fixtures rather than a running backend.

- [x] 2.1 Advance `external/grade10-spec` to the landed catalog commit while preserving unrelated nested work, and make `pnpm run check:submodules` pass.
- [x] 2.2 Add backwards-compatible `enabled` and `removeUnavailable` options to `useCartReview`; when the drawer disables removal, preserve unavailable lines for `CartDrawer`, while checkout defaults remain unchanged. Make `grade10-site-store-cart-drawer-SC-04` through `grade10-site-store-cart-drawer-SC-08` pass in focused hook tests without changing the `grade10-site/store/cart-validation` meaning of an open-time read.
- [x] 2.3 Add one root host for the signed-in member drawer with `Nav.onCartClick`, one `Toast`, the current member cart, controlled live-review loading, and one localized failure toast per open. Make `grade10-site-store-cart-drawer-SC-01`, `SC-02`, and `SC-04` through `SC-08` pass in focused shell tests. Cart availability cases `grade10-site-site-page-shell-SC-09` and `SC-16` belong to durable `grade10-site/site/page-shell`.
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

- [x] 4.1 Add an optional `enabled` condition to `useSpendableCoupons` and `usePointsTender` with their current enabled behavior preserved for Checkout; gate the drawer reads to an open, signed-in, non-empty cart whose current review is successful and ready, so `grade10-site-store-cart-drawer-SC-18` cannot trigger member-only reads while the review is unresolved. Signed-out access is covered by `require-sign-in-from-nav-cart`.
- [x] 4.2 In `CartDrawerHost`, key both reads from `review.items`, map successful coupon answers to held promo-code display data with localized value/expiry text and refusal reasons, map a quoted points answer to the existing collapsed points state plus a localized balance/ceiling label while reusing the existing rate copy, and pass `selectedHeldPromoId={null}` with no apply/select callbacks; make `grade10-site-store-cart-drawer-SC-16` and `grade10-site-store-cart-drawer-SC-17` pass while subtotal and estimated total remain the reviewed subtotal.
- [x] 4.3 Reset disclosure state and suppress prior read results on close, scope changes, cart edits, review refetches, and optional-read failures; prove that only the latest successful reviewed basket supplies tender context for `grade10-site-store-cart-drawer-SC-18` and `grade10-site-store-cart-drawer-SC-19` in focused hook and shell tests.
- [x] 4.4 Verify the affected Grade10 frontend with the focused Cart Drawer and checkout-hook tests, `pnpm run typecheck`, `pnpm run lint`, and `pnpm run build`; do not run `pnpm run test:backend` because this group adds no backend files.

## 5. Interactive Cart Drawer points (grade10)

This user-approved increment supersedes Group 4's read-only points behavior.
Group 5 depends on Group 7 landing and its shared package being available.
Preserve completed task ids and existing promo editing; this points increment
neither adds nor removes promo callbacks. Existing Group 3.2
waits for archive and is outside this implementation increment.

- [ ] 5.1 Make `grade10-site-store-cart-drawer-SC-20`, `grade10-site-store-cart-drawer-SC-23`, and `grade10-site-store-cart-drawer-SC-24` pass by exposing accepted completion, pending and failure from `useCartTender`, preserving existing callers and coupon choice. Include focused hook tests.
- [ ] 5.2 Make `grade10-site-store-cart-drawer-SC-17` and `grade10-site-store-cart-drawer-SC-20` through `grade10-site-store-cart-drawer-SC-26` pass in the host with Apply, Use max, Remove, current quotes, persisted choice, pending guards and stale-result rejection. Pass Group 7's `tenderPending` across quote and persistence for points and existing promo actions. Include focused integration tests and supported-locale copy checks.
- [ ] 5.3 Make `grade10-site-store-cart-drawer-SC-27` pass through reload and checkout handoff; preserve the selected code, re-quote and submit accepted spendPoints. Include checkout integration tests.
- [ ] 5.4 Verify focused affected tests, repository typecheck, lint, test and build; compare the integrated drawer against the Default story at narrow and desktop widths with keyboard and locale checks. Record unavailable browser verification separately from passing local checks.

## 6. Interactive points product record (grade10-spec)

Follows Group 5 delivery; Group 7 is the shared prerequisite, not a later phase.

- [ ] 6.1 Keep the Cart Points and Checkout product record aligned with Group 5 delivery; validate the change, feature suite and manual. Preserve construction marks until deployment acceptance; do not archive as part of this increment.

## 7. Shared pending tender contract (grade10-spec) (owner: @kinisworking)

Prerequisite for Group 5; appended to preserve existing task ids.

- [x] 7.1 Make `shared-ui-store-cart-SC-37` through `shared-ui-store-cart-SC-39` pass with optional `tenderPending` on `CartDrawerProps` and `CartDrawerFooterProps`, forwarding it through the compound and disabling existing tender inputs/actions and Checkout, including an open promo sheet. Preserve callback absence guards and existing appearance; add focused component tests and pending stories in `cart-drawer.stories.tsx` and `cart-drawer-footer.stories.tsx`.
- [x] 7.2 Verify the affected shared component tests, typecheck and UI Storybook build; keep the shared Tender Actions product record aligned and validate this change and its suites before Group 5 consumes the shared package.

## 8. Checkout creation in the drawer (grade10) (owner: @sean)

Folded in from `move-checkout-into-cart-drawer` (2026-09-29): `grade10-site/
store/cart-drawer` has no durable spec yet, so that change's requirements
landed here rather than under a second owner. Supersedes Group 2's task 2.5
routing of Checkout to `/checkout` — `2.5` is left as the historical record
of what shipped then; this group replaces that wiring, not that task's text.
Independent of Groups 5–7 (points/promo editing is unaffected by this scope).

- [x] 8.1 In `CartDrawerHost`, replace `handleCheckout`'s navigation to
  `ROUTES.checkout` with a call to `useCreateCheckout` carrying the drawer's
  current reviewed `items`, accepted `quoted` tender (coupon, points) and
  `deviceId`. On success, show the shared component's `checkoutRedirecting`
  state and hand off to the returned hosted URL; the drawer performs no
  second live re-read of its own. Make `grade10-site-store-cart-drawer-SC-15`
  pass.
- [x] 8.2 Handle a checkout-creation refusal: when a line is named, show it
  in the drawer and offer retry with no order created; when no line is
  named, restore Checkout and show `checkoutFailed`. Make
  `grade10-site-store-cart-drawer-SC-28` and
  `grade10-site-store-cart-drawer-SC-29` pass.
- [x] 8.3 Add the verification-bar gate: when the reviewed basket's goods
  value meets or exceeds the bar (12000000 HKD minor units) and the member's
  standing is not verified, replace the Checkout action's area with the same
  threshold-and-link presentation `CheckoutPage`'s `VerifyPanel` renders
  today (linking to `addressOf("profile")` when `config.gates.profile` is
  set); a verified member or a basket under the bar proceeds without the
  gate. Start no identity check from the drawer itself. Make
  `grade10-site-store-cart-drawer-SC-30` through
  `grade10-site-store-cart-drawer-SC-33` pass.
- [x] 8.4 Remove `src/routes/checkout.tsx`, `src/pages/checkout/
  CheckoutPage.tsx`, the `/checkout` route and surface entry from
  `src/surfaces.ts` and `src/routes.ts`, and `e2e/tests/store/
  checkout.spec.ts`, folding its coverage into cart-drawer tests. Confirm no
  remaining reference to `addressOf("checkout")` or the `checkout` surface.
- [x] 8.5 Verify the affected Grade10 frontend with focused cart-drawer,
  route and e2e tests, `pnpm run typecheck`, `pnpm run lint`, and
  `pnpm run build`; do not run `pnpm run test:backend` because this group
  adds no backend files.

## 9. Checkout product record (grade10-spec)

- [x] 9.1 Mark the Cart Drawer and Checkout PRDs for direct checkout
  creation from the drawer — `docs/prds/products/grade10-site/store/cart.md`
  (`Carried to checkout` rule, `Checkout` section, `Checkout creation`
  decision row) and `docs/prds/products/grade10-site/store/checkout.md`
  (`Integration readiness`) — and validate with `pnpm check:manual`.
