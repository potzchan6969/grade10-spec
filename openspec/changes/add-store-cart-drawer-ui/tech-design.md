## Context

The durable `shared/ui/store-cart` capability and `@grade10/ui` already own the
Cart Drawer states and interactions. The Grade10 app has no drawer host or
navigation callback.

The live data path now exists. `useCart` selects browser storage for a guest and
the member cart for a signed-in collector. `useCartReview` calls the typed live
review, applies current quantity and price to the cart, removes unavailable
lines, and exposes reviewed lines and readiness. `/checkout` already rechecks
the cart and creates the hosted checkout handoff.

## Goals / Non-Goals

**Goals:**

- Compose one route-gated drawer host without duplicating shared UI behavior.
- Run live review only for an open drawer and keep cleanup ownership singular.
- Reuse the current scoped cart, product routes, and checkout route.

**Non-Goals:**

- Adding a local review snapshot or a second cart store.
- Calling a backend procedure from the application layer.
- Moving hosted checkout creation into the drawer.

## Decisions

### Keep one route-gated host at the application root

The root derives a Cart-enabled condition with the existing surface relation:
every surface within Store, plus checkout. It passes `Nav.onCartClick` only on
those surfaces and mounts one drawer host beside the shell so navigation does
not duplicate or reset cart state. Leaving those surfaces closes the drawer.

**Alternative rejected:** mount one drawer per page. Navigation would unmount
the current drawer and repeat cart wiring on every Store route.

### Drive the drawer from the scoped cart

The host calls `useCart` and maps its current scope, item count, lines, writes,
and currency into the drawer adapter. It does not read browser storage, call a
procedure, or decide whether the collector is a guest or member.

Quantity and removal callbacks use the existing optimistic, scope-keyed cart
writes. Product activation uses the existing product-address helper. Browse
More opens the current Store collections route.

**Alternative rejected:** preserve the old browser-only adapter. It would show
a different cart after sign-in and bypass the member cart already implemented.

### Let open state enable live review

Extend `useCartReview` with backwards-compatible options:

| Option | Drawer | Existing checkout |
| --- | --- | --- |
| `enabled` | Drawer open state | Default `true` |
| `removeUnavailable` | `false` | Default `true` |

When the drawer opens, the enabled query performs a fresh Store review and the
host passes review fetching as controlled `CartDrawer.loading`. The host maps
every reviewed status, including unavailable, into `CartItemSummary`. The
shared drawer then invokes the scoped removal callback and emits its single
toast; the hook does not race it. Closing disables the observer, and reopening
rechecks because the review result is stale and has zero garbage-collection
time.

Checkout keeps the default behavior: its hook removes unavailable lines and
reports them in the checkout page. Cart writes continue invalidating the
scope-keyed review so the next open cannot reuse a pre-write answer.

If the open review fails, the host emits one localized failure toast for that
open and keeps the drawer in its controlled loading treatment, so stale lines
are not presented as confirmed and Checkout stays disabled. Closing and
reopening starts another review.

**Alternative rejected:** let both the hook and drawer remove unavailable
lines. Two cleanup owners can issue duplicate writes and split the one-toast
contract.

### Map only reviewed Store facts

The adapter maps reviewed title, quantity, current unit price, currency, and
status. It computes subtotal from reviewed minor-unit values and uses the same
amount as the pre-hosted-checkout estimate. Shipping, tax, discount, promotion,
and unavailable imagery are omitted rather than guessed.

The drawer never treats the cart's recorded display price as current while a
review is pending. A failed review remains visibly unresolved; Checkout still
opens `/checkout`, whose existing review blocks a handoff until it succeeds.

**Alternative rejected:** keep a deterministic local display snapshot while
live review is available. That would present stale availability and price at
the moment this surface exists to recheck them.

### Navigate to the existing checkout surface

The drawer's Checkout callback closes the drawer and navigates to
`ROUTES.checkout`. The checkout page remains responsible for session gating,
its own current review, points, and the hosted provider redirect.

**Alternative rejected:** create checkout from the drawer. It would duplicate
the established checkout page and mix a payment side effect into shared cart
review.

### Keep copy in Grade10 catalogs

Add the application-supplied drawer and navigation vocabulary to the `store`
catalog for `en`, `zh-Hant`, and `zh-Hans`. Continue using the existing Grade10
locale fallback and one root `Toaster`. Korean remains a ZZZ-only locale.

## Risks / Trade-offs

- **[Risk] A cart write lands while review is in flight.** → Keep both queries
  scope-keyed, use the cart feature's serialized writes, and invalidate review
  after every settled write.
- **[Risk] Guest-to-member scope changes while the drawer is open.** → Derive
  review from the same `useCart` scope and let the query key move with it.
- **[Risk] Review failure leaves old values visible.** → Keep the drawer in
  controlled loading, emit one failure toast per open, and recheck on reopen.
- **[Risk] The spec-store pointer overlaps unrelated nested work.** → Advance
  only the parent gitlink after the catalog commit lands and run the submodule
  check.

## Migration Plan

1. Land Grade10 catalog additions in `grade10-spec`.
2. Advance `external/grade10-spec` to that landed commit.
3. Add the review options, root host, routes, and focused tests in `grade10`.
4. Roll back by removing the host and gitlink advancement; the existing scoped
   cart and `/checkout` page remain unchanged. No data or backend migration is
   involved.
