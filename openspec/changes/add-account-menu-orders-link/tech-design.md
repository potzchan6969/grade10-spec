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

- **Required, not handler-gated.** `SiteHeaderProps` gains `onMyOrders: () => void`
  as a required prop, and `SiteHeaderCopy` gains `myOrders: string`, matching
  how Profile, My Auctions, and Sign out are already wired — never optional
  like `onSearchClick`/`onCartClick`. Matches `decisions.md` Q4. Rejected:
  making it optional like search/cart — that would let a consumer silently
  ship the menu without it, which is wrong for an item every signed-in
  collector should reach.
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

- [Risk] `onMyOrders` becoming a required prop breaks any consumer of
  `SiteHeaderProps` this change didn't find. → Mitigation: grep confirms
  `SiteShell.tsx` is the only consumer; each group's `typecheck` verification
  step catches any other one immediately.
- [Risk] The `external/grade10-spec` submodule pointer in `grade10` lags this
  store's merge, leaving `SiteShell.tsx` unable to compile against the new
  required prop. → Mitigation: group 2 opens with the submodule bump, before
  the wiring task.

## Migration Plan

No data migration. Delivery is: merge this store's change to `main`, then a
submodule-SHA bump PR in `grade10` (group 2's first task) that also wires
`SiteShell.tsx`.
