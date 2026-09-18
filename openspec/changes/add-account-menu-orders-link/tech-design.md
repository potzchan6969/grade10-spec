## Context

`SiteHeader` lives once in `packages/ui/src/blocks/site-chrome/site-header.tsx`
and is consumed from source as `@grade10/ui` by `apps/frontend/grade10/src/chrome/SiteShell.tsx`.
Its signed-in account menu already wires Profile, My Auctions, and Sign out
unconditionally — none of the three is handler-gated, unlike search and cart.
`zzz`'s header (`apps/frontend/zzz/src/chrome/SiteHeader.tsx`) is its own
local component, not `@grade10/ui`'s, and is untouched by this change.

`/profile/orders` already exists as `ROUTES.orderHistory` in
`apps/frontend/grade10/src/surfaces.ts`, shipped by
`add-grade10-customer-order-pages`. This change only adds a menu entry that
reaches it.

## Decisions

- **Handler-gated, like Cart and search.** `SiteHeaderProps` gains an
  optional `onMyOrders?: () => void`, and `SiteHeaderCopy` gains `myOrders: string`.
  `SiteHeader` renders My Orders only when `onMyOrders` is supplied, the same
  mechanism as `onCartClick`/`onSearchClick`. `SiteShell.tsx` supplies it as
  `config.gates.store ? () => onNavigate(ROUTES.orderHistory) : undefined` —
  the same `Gates["store"]` flag `navLinksFor` already reads to gate the
  Store nav link in `apps/frontend/grade10/src/chrome/siteContent.ts`, and the
  same gate `ROUTES.orderHistory` itself carries in `surfaces.ts`. Matches
  `decisions.md` Q8, which supersedes Q4. Rejected: Q4's original "required,
  always-present" answer — that ships a menu item pointing at
  `/profile/orders` on a build where Store has not answered, which is a link
  to nothing.
- **Position.** My Orders renders between Profile and My Auctions, matching
  `decisions.md` Q3 and both modified scenarios' stated order.
- **Copy catalog placement.** `myOrders` lands in this store's Grade10 brand
  catalogs (`packages/i18n/messages/grade10/{en,zh-Hant,zh-Hans}/chrome.json`),
  not `shared/`, even though `profile` — an equally generic label — is
  `shared/`. `packages/i18n/src/resolution.test.ts`'s "answers every key for
  $brand in $locale" check builds each brand's vocabulary from every locale
  any `shared/` catalog carries, including `ko` (spoken only by `zzz`). `zzz`'s
  header doesn't consume `@grade10/ui`'s `SiteHeader`, and My Orders is out of
  scope for it, so a `shared/` placement would force a Korean translation
  nobody asked for. A Grade10-owned catalog needs the key only in the
  languages Grade10 speaks, and matches the proposal's stated Impact.
- **Existing coverage that states the old shape moves too.** The `AccountMenu`
  story's assertion that no "Orders" menu item exists, and `site-header.tsx`'s
  doc comment ("Orders and KYC are not in this menu"), both describe the menu
  this change retires — update them in the same task as the render change
  rather than leaving them describing a shape that no longer ships.

## Risks / Trade-offs

- [Risk] Gating My Orders on `config.gates.store` while wiring it independent
  of `onCartClick`'s own `cartEnabled` (page-scoped) logic could drift the two
  out of sync. → Mitigation: both read the same `Gates["store"]` flag off
  `config.gates`, not a derived per-page value, so a gate flip moves both
  together.
- [Risk] The `external/grade10-spec` submodule pointer in `grade10` lags this
  store's merge, leaving `SiteShell.tsx` unable to compile against the
  widened `SiteHeaderCopy`. → Mitigation: group 2 opens with the submodule
  bump, before the wiring task.

## Migration Plan

No data migration. Delivery is: merge this store's change to `main`, then a
submodule-SHA bump PR in `grade10` (group 2's first task) that also wires
`SiteShell.tsx`.
