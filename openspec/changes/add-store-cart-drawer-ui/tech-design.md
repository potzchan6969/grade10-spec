## Context

The proposal's motivation is in `proposal.md`. The
[Cart Drawer](specs/grade10-site/store/cart-drawer/spec.md) and
[page-shell delta](specs/grade10-site/site/page-shell/spec.md) own the Grade10
behavior. The durable `shared/ui/store-cart` capability and `@grade10/ui`
already own the drawer's visual states, dismissal, empty state, item
statuses, and interaction contract. The Grade10 application now has one
route-gated drawer host and `Nav.onCartClick` handler. That host currently
stops at the reviewed lines and subtotal.

The existing frontend integration already reaches the Store backend boundary:
`useCart` selects the guest browser cart or the signed-in member cart, and its
typed `ReviewCart` port performs the live review. `/checkout` already owns its
own review and checkout handoff. This change consumes those paths; it adds no
Worker, API, provider, database, persistence, or checkout service work.

Two current contracts shape the adapter:

- `useCartReview` currently always runs its query, removes unavailable lines,
  and filters them from its returned lines.
- The shared drawer requires display-ready `CartItemSummary` values, reviewed
  subtotal and estimated total, and `CartDrawerCopy`. The current reviewed
  line contract has no image URL, shipping, tax, discount, or promotion data.

The rebased backend can price a points amount for a named member and can accept
coupon and points inputs when checkout is created. Those are checkout
capabilities, not a drawer quote: they do not return one applied cart view with
promotion, points, shipping, tax, and total, and the current drawer hands off
to `/checkout` instead of creating checkout itself.

The checkout feature nevertheless already exposes two read-only member reads:
the held promo codes answered against checkout items and the points quote for
those items. The drawer can consume those reads after its cart review succeeds,
provided it treats them as optional context rather than as a tender selection.

## Goals / Non-Goals

**Goals:**

- Compose one route-gated drawer host at the application root.
- Integrate the drawer with the existing scoped cart and typed live review.
- Preserve checkout's current review and unavailable-line behavior.
- Match the supplied populated, loading, failure, unavailable, and empty UI
  states using existing shared components and tokens.
- Show signed-in members' held promo-code answers and points ceiling for the
  reviewed basket without presenting either as applied tender.
- Provide localized Grade10 drawer copy through the existing catalog resolver.
- Keep the new product scenarios traceable to the shared drawer and
  cart-validation contracts they consume.

**Non-Goals:**

- Any backend implementation or wire-contract change.
- A second cart store, local review snapshot, or product-image enrichment read.
- Promotion redemption, shipping calculation, tax calculation, or discount
  calculation. The drawer has no applied quote, and its subtotal and estimated
  total remain the reviewed subtotal.
- Tender selection or checkout creation. The drawer may show the results of
  the existing member-only reads, but it supplies no promo or points mutation
  callbacks and `/checkout` remains the owner of checkout creation.
- A dedicated `/cart` route or changes to the existing checkout page.
- No new `CartDrawer` visual variant, design-token, or Figma work. If the
  current optional-callback behavior exposes a mutation control without a
  callback, the shared component receives only the minimal callback-presence
  guard needed for this read-only path.

## Decisions

### Compose one route-gated host at the application root

The root derives a Cart-enabled condition for the existing Store surface
relation plus checkout. It passes `Nav.onCartClick` only there and mounts one
`CartDrawer` host beside `SiteShell`, so navigation does not duplicate or reset
cart state. Leaving the enabled surface closes the drawer.

**Alternative rejected:** mount one drawer per page. That would duplicate cart
wiring and unmount the current drawer during navigation.

### Reuse the existing scoped cart and backend integration

The host calls `useCart` and uses its scope, lines, item count, currency, and
serialized writes. It never reads browser storage directly, decides guest vs
member, or introduces a new backend call. Quantity and removal callbacks use
the existing optimistic scope-keyed writes. Product activation uses the
existing product-address helper. Checkout uses the current checkout route.

**Alternative rejected:** retain a browser-only adapter. It would diverge from
the member cart after sign-in and bypass the existing backend-backed cart
integration.

### Make live review open-controlled without changing checkout defaults

Extend the frontend hook signature to
`useCartReview(basket, options?)` with these defaults:

| Option | Drawer | Existing checkout |
| --- | --- | --- |
| `enabled` | `open` | `true` |
| `removeUnavailable` | `false` | `true` |

When `removeUnavailable` is `false`, the hook must both skip its removal
effect and preserve `unavailable` lines in its returned `lines`; otherwise the
shared drawer cannot own the cleanup contract. The drawer receives every
reviewed status and invokes the existing scoped removal callback once per
unavailable line. Checkout retains the default removal effect and its existing
returned-line behavior.

Closing disables the review query. Reopening performs a fresh review because
the review query is open-controlled, scope-keyed, and has zero garbage
collection time. Cart writes continue invalidating the scope-keyed review.

**Alternative rejected:** let both the hook and drawer remove unavailable
lines. Two owners could issue duplicate writes and duplicate the one-toast
contract.

### Keep unresolved review visibly unresolved

The host passes the review's fetching state as controlled `CartDrawer.loading`.
While pending, the adapter may provide unreviewed line shape for the shared
skeleton treatment, but it must not present held prices or availability as
confirmed. On review failure, the host keeps `loading` true, emits exactly one
localized failure toast for that open, and leaves Checkout disabled. Closing
and reopening starts the next review attempt.

On success, the drawer receives reviewed title, quantity, current unit price,
currency, available quantity, previous price, and status. Adjusted and sold-out
rows remain visible according to the shared component contract; unavailable
rows are removed by `CartDrawer` after loading and produce its one cleanup
toast.

**Alternative rejected:** paint a local intent snapshot while review is
pending or failed. That would make stale values look confirmed at the moment
the drawer exists to recheck them.

### Map only data the existing contract provides

The adapter maps the reviewed line contract into `CartItemSummary` without
adding a backend enrichment read:

| Drawer value | Source | Rule |
| --- | --- | --- |
| id, name, quantity, status | reviewed line | Use the reviewed variant, title, quantity, and status. |
| price, original price | reviewed minor-unit amounts | Format with the reviewed ISO currency; omit original price when absent. |
| max quantity | reviewed available quantity | Pass it when present; the shared item owns the warning/stepper treatment. |
| subtotal | reviewed lines | Sum current minor-unit price × quantity, excluding sold-out and unavailable lines. |
| shipping | copy only | Omit `shippingEstimate` so the localized `Calculated at checkout` copy renders. |
| estimated total | reviewed subtotal | Use the same formatted amount as subtotal; no shipping/tax/discount calculation. |
| image | unavailable | Do not populate `imageSrc` or `imageAlt`; the current reviewed contract does not provide them. |

The host keeps `PromoState` as local disclosure state, not applied tender. It
passes held codes only after a successful member review, leaves
`selectedHeldPromoId` null, and supplies no promo-application or points-apply
callbacks. The points state is likewise only the drawer's collapsed/expanded
disclosure state; it never becomes `applied`. The shared UI must hide or make
inert any action control whose mutation callback is absent, so the read-only
surface cannot present a no-op Apply action.

**Alternative rejected:** infer images, shipping, or totals from product-page
or held-cart data. Those values are not part of the existing reviewed backend
contract and would reintroduce stale or invented facts.

### Read the existing member context only after the cart review

Call `useSpendableCoupons(review.items)` and `usePointsTender(review.items)`
only when the drawer is open, the scoped cart is a member cart, the review is
successful and ready, and it has at least one reviewed item. Add an `enabled`
option to both hooks with the current `true` default so Checkout keeps its
existing behavior while the drawer can avoid guest, empty, pending, and failed
reads. The query keys remain the reviewed item list, so a quantity or review
change asks again for the basket in front of the member.

Map a successful coupon read to `HeldPromoCode`: the coupon code is both the
stable id and label, the definition title remains the ticket title, the cut
and expiry use the existing checkout promo vocabulary, and a refusal is shown
as the inapplicable reason. A pending, failed, guest, or unavailable read maps
to `null`, not to an empty successful list, so the drawer never turns an
unanswered wallet into “no promo codes”.

Map a successful quoted points read to `pointsState={{ status: "collapsed" }}`
and a localized `pointsBalanceLabel` containing the balance and basket
ceiling. The existing `CartDrawerCopy.footer.pointsRateLabel` supplies the
conversion-rate copy. A points `unavailable` answer maps to `null`. Format the
ceiling from its integer minor-unit amount and ISO currency with the existing
money utility; do not derive it from the cart subtotal in the host.

The drawer still uses the reviewed subtotal for both subtotal and estimated
total. Applying a code, choosing a held code, applying points, recalculating a
total, or creating checkout remains outside this decision.

A later combined-quote contract must define invalidation after cart edits,
guest and member behavior, refusal copy, applied line and footer amounts, and
the exact handoff to checkout before interactive promo or points callbacks are
supplied.

**Alternative rejected:** wire the merged endpoints one control at a time.
That would expose selectable tender without an authoritative combined total or
a drawer-owned checkout handoff.

### Keep copy in a Grade10 `store` catalog overlay

Add a new brand-owned `store` namespace for `en`, `zh-Hant`, and `zh-Hans`,
register it in `packages/i18n/src/catalogs.ts`, and add only the keys needed to
construct `CartDrawerCopy` (for example, `cartDrawer.header`, `cartDrawer.item`,
`cartDrawer.footer`, and `cartDrawer.unavailableItemsRemoved`). The existing
shared `chrome.cartLabel` supplies the navigation label and is not duplicated.

This follows the resolver's two-layer model: generic store listing words remain
in shared `store`, while this Grade10 surface's supplied drawer vocabulary is
owned by the Grade10 overlay. Existing locale fallback remains in force.

**Alternative rejected:** add Grade10 drawer words to shared `store` without
deciding ownership. That would make a brand-specific surface part of every
brand's shared vocabulary and leave the current catalog boundary ambiguous.

### Navigate through existing application addresses

The drawer's item callback uses the current product-address helper. Checkout
closes the drawer and navigates to `ROUTES.checkout`; the checkout page remains
responsible for session gating, its own live review, and checkout handoff.

**Alternative rejected:** create checkout or a new cart route from the drawer.
That would duplicate existing application behavior and expand the surface
beyond the supplied design.

### Verify at the frontend integration boundary

Tests use typed cart/review fixtures and existing DI harnesses. They do not
require a running backend because no backend code changes. Coverage must prove:

- `grade10-site-store-cart-drawer-SC-03` through `SC-08`: review defaults
  preserve checkout behavior while the drawer follows `open`, keeps the right
  scope, preserves unavailable rows for its cleanup owner, and withholds stale
  facts.
- `grade10-site-site-page-shell-SC-09` and `SC-16`: one root host exposes Cart
  only on Store surfaces and checkout.
- `grade10-site-store-cart-drawer-SC-09` through `SC-12`: reviewed facts,
  neutral totals, scoped writes, and one unavailable cleanup remain honest.
- `grade10-site-store-cart-drawer-SC-13` and `SC-15`: product and Checkout use
  existing addresses and close the drawer first.
- `grade10-site-store-cart-drawer-SC-16` through `SC-19`: member-only tender
  reads follow the latest reviewed basket, show current eligibility and the
  points ceiling, and never become applied tender or stale guest data.
- The shared empty, loading, dismissal, overflow, cleanup, and redirecting
  behaviors remain covered by `shared/ui/store-cart`.

## Risks / Trade-offs

- **[Risk] A cart write lands while review is in flight.** → Keep both queries
  scope-keyed, use serialized cart writes, and invalidate review after each
  settled write.
- **[Risk] Guest-to-member scope changes while the drawer is open.** → Derive
  review from the same `useCart` scope and let the query key move with it.
- **[Risk] Review failure leaves old values visible.** → Keep controlled loading
  true, emit one failure toast per open, and recheck on reopen.
- **[Risk] The drawer's no-image and display-only tender decisions differ from
  a future applied quote contract.** → Keep images absent, keep tender reads
  optional, and add applied values only through a separate approved quote
  change.
- **[Risk] An optional read fails after the cart review succeeds.** → Treat
  promo and points context as non-blocking; pass `null`, keep the reviewed
  subtotal, and let Checkout perform its own reads.
- **[Risk] A query result from an earlier basket remains visible after an edit
  or scope change.** → Gate props on the current successful review and query
  item key; reset disclosure state on close and never carry a selected promo
  id across a review.
- **[Risk] The shared drawer renders a mutation affordance without its
  callback.** → Add or verify callback-presence guards in the shared drawer so
  read-only mode exposes facts but no no-op action.
- **[Risk] The read-only context is mistaken for an applied quote.** → Keep
  `PromoState` un-applied, keep points out of applied state, and derive both
  displayed totals only from the reviewed cart.
- **[Risk] The spec-store pointer overlaps unrelated nested work.** → Advance
  only the parent gitlink after the catalog commit lands, preserve nested work,
  and run the submodule check.

## Migration Plan

1. Add and validate the Grade10 catalog overlay in `grade10-spec`.
2. Advance `external/grade10-spec` to that landed catalog commit while
   preserving unrelated nested work.
3. Add the backwards-compatible review options and root UI integration in
   `grade10`.
4. Roll back by removing the host and reverting the parent gitlink; existing
   scoped cart, backend integration, and `/checkout` behavior remain unchanged.
   No data or backend migration is involved.
