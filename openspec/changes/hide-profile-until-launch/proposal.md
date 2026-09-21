**Author:** @sean - 2026-09-21

## Why

`add-account-profile` is still mid-build — the account page a signed-in
collector reaches today carries no avatar and a placeholder display name,
four of its six task groups unclaimed. Every build of the site carries it
anyway, so a collector on `grade10.com` reaches an account page nobody is
ready to show them, and the header's account menu, the checkout, and every
order page name it as if it were finished.

**Metric:** `/profile` requests the public lanes answer with not-found.
Expected to rise from zero the day this ships, and fall back toward zero once
`add-account-profile` reopens the gate.

## What Changes

- **The profile joins the waiting products.** `/profile` is carried in
  development and staging, and on no lane the public reaches — the same rule
  that already withholds the store, the vault and booking a visit. **BREAKING**:
  reverses the carried-surfaces PRD's decision that "the profile stays"
  carried everywhere.
- **An uncarried `/profile` is not found** — a public lane answers the
  not-found surface and a 404 at `/profile`, the same as any withheld address
- **Order history keeps its own gate** — `/profile/orders` and
  `/profile/orders/:orderId` stay behind the store's gate alone, unaffected by
  the profile's; a mailed order link still answers wherever the store is
  carried
- **Nothing names it** — the header's account menu drops the Profile entry
  where the gate is shut, the same handler-gated way My Orders already joins
  it; every in-app link back to the profile (checkout, order detail, order
  history, the auction winner's order) is absent the same way rather than
  pointing at a withheld page
- **The account menu's Profile item becomes handler-gated** — `SiteHeader`
  offers Profile only when the application supplies an `onProfile` handler,
  the same contract My Orders, Cart and search already carry. Today it is
  unconditional

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/site/carried-surfaces`: the profile joins the store, the
  vault and booking as a fourth product that waits for its own launch
- `grade10-site/site/page-shell`: the account menu's Profile item is
  handler-gated, and the menu's order when it is absent
- `shared/ui/site-chrome`: `SiteHeader`'s `onProfile` becomes an optional
  handler, matching My Orders, Cart and search

## Impact

- **`apps/frontend/grade10`** — `src/surfaces.ts` gains a `profile` gate,
  `src/routes.ts`, `react-router.config.ts` and the crawler files withhold it
  the same way they already withhold the store; `src/chrome/SiteShell.tsx`
  stops supplying `onProfile` unconditionally; every in-app link to
  `ROUTES.profile` (checkout, order detail, order history, auction winner
  order breadcrumbs) becomes conditional
- **`packages/ui`** (`@grade10/ui`) — `SiteHeader`'s `onProfile` prop becomes
  optional; the account menu omits Profile when it is not supplied
- **Staging and development** — unchanged; the account page and its menu
  entry answer exactly as they do today
- **`add-account-profile`** — unaffected in scope; this change only decides
  which lanes carry `/profile` while that one finishes it

## Follow-on changes

- Open the profile: production and preview start carrying it again, once
  `add-account-profile` ships

## References

- [Carried Surfaces](../../../docs/prds/products/grade10-site/site/carried-surfaces.md#what-each-lane-carries)
- [Page Shell · Account Menu](../../../docs/prds/products/grade10-site/site/page-shell.md#account-menu)
- [Site Header and Footer · Account Entry](../../../docs/prds/products/shared/ui/site-chrome.md#account-entry)
