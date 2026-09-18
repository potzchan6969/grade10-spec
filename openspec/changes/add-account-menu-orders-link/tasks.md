## 1. Shared account-menu component and words (grade10-spec)

- [ ] 1.1 Widen `SiteHeaderCopy` with `myOrders` and `SiteHeaderProps` with a
      required `onMyOrders` handler, render My Orders between Profile and My
      Auctions in the signed-in menu, and update the `AccountMenu` story's
      "no Orders" assertion and the component's doc comment to match — make
      `shared-ui-site-chrome-SC-17` pass
- [ ] 1.2 Make `shared-ui-site-chrome-US1-TC12-1` pass: activating My Orders
      invokes exactly its own handler, and no other account-menu handler
- [ ] 1.3 Add `myOrders` to the Grade10 `en`, `zh-Hant`, and `zh-Hans` chrome
      catalogs (`packages/i18n/messages/grade10/*/chrome.json`)
- [ ] 1.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run test:stories:ui`

## 2. Site shell wiring (grade10)

Needs group 1 merged to this store's `main` and the submodule pointer bumped
first — `SiteShell.tsx` cannot compile against the widened, required
`onMyOrders` prop until then.

- [ ] 2.1 Bump the `external/grade10-spec` submodule pointer to the commit
      carrying group 1
- [ ] 2.2 Wire `onMyOrders` in `SiteShell.tsx` to `ROUTES.orderHistory` and
      pass `myOrders: tChrome("myOrders")`, updating the existing
      account-menu test's assertions to expect My Orders rather than its
      absence — make `grade10-site-site-page-shell-SC-17` pass
- [ ] 2.3 Make `grade10-site-site-page-shell-US3-TC4-1` pass: activating My
      Orders takes a signed-in collector to `/profile/orders`
- [ ] 2.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`
