## Context

The proposal's motivation is in `proposal.md`. The durable
`shared/ui/store-cart` capability and `@grade10/ui` already own the drawer's
visual states, dismissal, slot baseline, item statuses, and interaction
contract. The Grade10 application currently has no drawer host or
`Nav.onCartClick` handler.

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

## Goals / Non-Goals

**Goals:**

- Compose one route-gated drawer host at the application root.
- Integrate the drawer with the existing scoped cart and typed live review.
- Preserve checkout's current review and unavailable-line behavior.
- Match the supplied populated, loading, failure, unavailable, and empty UI
  states using existing shared components and tokens.
- Provide localized Grade10 drawer copy through the existing catalog resolver.

**Non-Goals:**

- Any backend implementation or wire-contract change.
- A second cart store, local review snapshot, or product-image enrichment read.
- Promotion redemption, shipping calculation, tax calculation, or discount
  calculation. The shared promo affordance is rendered in its collapsed,
  display-only form with no promo callbacks.
- A dedicated `/cart` route or changes to the existing checkout page.
- Changes to the shared `CartDrawer`, design tokens, Figma files, or other
  brands' behavior.

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
existing product-address helper, and Browse More uses the current Store
collections address.

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
| shipping | copy only | Omit `shippingEstimate` so the localized `TBD` copy renders. |
| estimated total | reviewed subtotal | Use the same formatted amount as subtotal; no shipping/tax/discount calculation. |
| image | unavailable | Do not populate `imageSrc` or `imageAlt`; the current reviewed contract does not provide them. |

The Figma promo affordance is passed a collapsed `PromoState` with no promo
callbacks. It can be seen but cannot claim to apply a code or calculate a
discount in this change.

**Alternative rejected:** infer images, shipping, or totals from product-page
or held-cart data. Those values are not part of the existing reviewed backend
contract and would reintroduce stale or invented facts.

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

The drawer's item callback uses the current product-address helper. Browse More
closes the drawer and opens the Store collections address. Checkout closes the
drawer and navigates to `ROUTES.checkout`; the checkout page remains responsible
for session gating, its own live review, and checkout handoff.

**Alternative rejected:** create checkout or a new cart route from the drawer.
That would duplicate existing application behavior and expand the surface
beyond the supplied design.

### Verify at the frontend integration boundary

Tests use typed cart/review fixtures and existing DI harnesses. They do not
require a running backend because no backend code changes. Coverage must prove:

- `useCartReview` defaults preserve checkout behavior while drawer options
  disable removal, preserve unavailable rows, and follow `open`.
- The root exposes Cart only on Store surfaces and checkout, with one drawer and
  one `Toast`.
- Pending and failed reviews keep stale values unresolved and Checkout disabled.
- The shared drawer owns one unavailable cleanup and one toast.
- Scoped quantity/removal writes, product links, Browse More, Checkout, empty
  state, and locale resolution use the existing contracts.

## Risks / Trade-offs

- **[Risk] A cart write lands while review is in flight.** → Keep both queries
  scope-keyed, use serialized cart writes, and invalidate review after each
  settled write.
- **[Risk] Guest-to-member scope changes while the drawer is open.** → Derive
  review from the same `useCart` scope and let the query key move with it.
- **[Risk] Review failure leaves old values visible.** → Keep controlled loading
  true, emit one failure toast per open, and recheck on reopen.
- **[Risk] The drawer's no-image and display-only promo decisions differ from
  a future richer backend contract.** → Keep those fields optional in the
  adapter and add them only with a separate approved contract change.
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
