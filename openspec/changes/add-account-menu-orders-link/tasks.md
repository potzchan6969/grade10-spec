## 1. Shared account-menu component and words (grade10-spec) (owner: @sean)

- [x] 1.1 Widen `SiteHeaderCopy` with `myOrders` and `SiteHeaderProps` with an
      optional `onMyOrders` handler; render My Orders between Profile and My
      Auctions only when it is supplied, and update the `AccountMenu` story's
      "no Orders" assertion and the component's doc comment to match — make
      `shared-ui-site-chrome-SC-17` and `shared-ui-site-chrome-SC-29` pass
- [x] 1.2 Make `shared-ui-site-chrome-US1-TC12-1` pass: activating My Orders
      invokes exactly its own handler, and no other account-menu handler
- [x] 1.3 Add `myOrders` to the Grade10 `en`, `zh-Hant`, and `zh-Hans` chrome
      catalogs (`packages/i18n/messages/grade10/*/chrome.json`)
- [x] 1.4 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run test:stories:ui`

## 2. Site shell wiring (grade10) (owner: @sean)

Needs group 1 merged to this store's `main` and the submodule pointer bumped
first — `SiteShell.tsx` cannot compile against the widened `SiteHeaderCopy`
until then.

- [x] 2.1 Bump the `external/grade10-spec` submodule pointer to the commit
      carrying group 1
- [x] 2.2 Wire `onMyOrders` in `SiteShell.tsx` to
      `config.gates.store ? () => onNavigate(ROUTES.orderHistory) : undefined`
      — the same `Gates["store"]` flag `navLinksFor` reads for the Store nav
      link — and pass `myOrders: tChrome("myOrders")`; update the existing
      account-menu test's assertions to expect My Orders when the store gate
      is on — make `grade10-site-site-page-shell-SC-17` pass
- [x] 2.3 Make `grade10-site-site-page-shell-US3-TC4-1` pass: activating My
      Orders takes a signed-in collector to `/profile/orders`
- [x] 2.4 Make `grade10-site-site-page-shell-SC-27` and
      `grade10-site-site-page-shell-US3-TC5-1` pass: the account menu omits
      My Orders when the store gate is off
- [x] 2.5 Verify: `pnpm run typecheck && pnpm run lint && pnpm run test`
