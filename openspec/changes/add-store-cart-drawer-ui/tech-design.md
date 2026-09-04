## Context

The existing `shared-ui/store-cart` capability already defines the Cart Drawer
contract and the `@grade10/ui` package already exports `CartDrawer`, its
subcomponents, and the required states. The Grade10 application has the
browser-owned cart feature and an existing `/checkout` route, but its root
shell currently supplies no cart handler to `Nav` and renders no drawer.

The browser cart stores variant id, product handle, title, display price,
currency, and quantity. It does not yet store enriched product imagery,
availability, live prices, discounts, shipping, or tax. Grade10 currently
speaks English, Traditional Chinese, and Simplified Chinese; Korean belongs
to the separate ZZZ brand.

## Goals / Non-Goals

**Goals:**

- Make the existing Cart Drawer reachable from the navigation on store home,
  product listing, product detail, and checkout surfaces.
- Preserve the shared drawer's dismissal, transition, empty-baseline,
  loading, scroll-lock, and cart-edit behavior.
- Call one refresh method whenever the drawer opens and keep its result behind
  a replaceable application boundary.
- Localize all application-supplied drawer and navigation copy in every
  supported Grade10 locale.

**Non-Goals:**

- Changing the `shared-ui/store-cart` requirements or the existing shared UI
  component implementation.
- Adding backend reads, repricing, availability, promotion, shipping, tax, or
  checkout-session APIs.
- Changing the persisted browser cart model or making it server-owned.
- Defining the final checkout handoff beyond navigating to `/checkout`.

## Decisions

### Route-gated root composition

The application root remains the composition owner. It derives a
`cartSurface` condition from the current route: store, store collections,
store product, and checkout opt in; unrelated surfaces do not. The root
passes an optional `onCartClick` and translated cart label to `SiteShell`, and
renders one Cart Drawer host alongside the shell while the same providers and
cart query remain mounted.

This uses the existing `Nav.onCartClick` seam and keeps the drawer available
across store navigation. A page-local trigger is rejected because the drawer
would disappear during navigation and would need duplicate wiring. Supplying
the handler on every site surface is rejected because auction, profile,
membership, and marketing routes have not opted into the store cart.

### Existing shared drawer owns interaction behavior

The host composes the existing `@grade10/ui` `CartDrawer` and mounts the
existing `@grade10/design-system` `Toaster` once at the application root. It
passes the existing callbacks for quantity changes, removals, product links,
and checkout. It does not reproduce the overlay, Escape listener, body scroll
lock, five-slot baseline, or drawer transition in application code.

Rebuilding an application-specific overlay is rejected because it would split
the `shared-ui/store-cart` contract from its tested implementation and make
the Figma interaction drift likely.

### Open-time refresh adapter

The host keeps a display snapshot separate from the persisted cart record. It
passes one app-owned `refresh` method to `CartDrawer.onFetchStatusAndPrice`.
The shared drawer already calls this callback from its open effect and holds
its loading state until the returned promise settles, so the app does not add
a second open effect.

The initial method projects the current browser cart into the drawer's
display-ready shape:

| Drawer value | Initial source | Future replacement |
| --- | --- | --- |
| item id, title, quantity | browser cart line | backend-enriched line |
| unit price and currency | browser cart line | current backend price |
| status | `default` placeholder | availability/stock result |
| subtotal | local minor-unit sum | backend calculation |
| estimated total | local subtotal placeholder | backend calculation |
| shipping, discount, tax | omitted or existing provisional copy | backend calculation |
| image | omitted until enrichment exists | backend product image |

The method updates the snapshot before resolving and is the only place that
will later call the backend refresh. Cart mutations update the browser cart
through the existing `useCart` feature and refresh the local snapshot so the
drawer does not display stale quantity or subtotal values. A production delay
is not introduced merely to make skeletons visible; stories and focused tests
control an unresolved refresh promise when they need to assert loading.

An app-level refresh method is preferred over a new data package or an effect
that watches `open`: the shared component already owns the lifecycle, while
the application owns the source of the data.

### Provisional checkout handoff

The host supplies `onCheckout` that navigates to `ROUTES.checkout`. The shared
drawer remains responsible for its redirecting button state, while the app
owns navigation. The callback is deliberately isolated so the final checkout
session flow can replace it without changing the drawer contract.

Calling a new backend checkout endpoint from the drawer is rejected because
the final payment/session handling is not confirmed and the existing route is
already the application boundary.

### Localized application copy

Add a nested Cart Drawer vocabulary to the existing Grade10 `store` catalog
for `en`, `zh-Hant`, and `zh-Hans`, and pass the resolved strings into the
shared `CartDrawerCopy` shape. Keep the existing `chrome.cartLabel` for the
navigation control unless catalog validation shows it is missing in a
supported locale.

Adding literals in the host is rejected because collector-facing strings must
come through `@grade10/i18n`, and adding Korean is rejected because it is not a
Grade10 locale.

## Risks / Trade-offs

- **[Risk]** The placeholder can be mistaken for live availability or price.
  **Mitigation:** keep it in a named refresh adapter, use explicit provisional
  totals/copy, and document the backend replacement boundary in the host.
- **[Risk]** A cart mutation can race an open refresh and briefly restore an
  older snapshot. **Mitigation:** the host updates the snapshot from the
  mutation result/current cart after each mutation, and the refresh method
  reads the latest cart value captured for that open.
- **[Risk]** The drawer is mounted outside a store route after navigation.
  **Mitigation:** close the drawer when the route leaves `cartSurface` and do
  not pass a navigation handler on non-store surfaces.
- **[Risk]** Advancing the spec submodule could disturb unrelated nested work.
  **Mitigation:** advance only the parent gitlink after the spec-store commit
  is available and run the repository submodule check; preserve unrelated
  nested checkout changes.

## Migration Plan

1. Land the Grade10 catalog additions in the standalone `grade10-spec` store.
2. Advance the Grade10 application's `external/grade10-spec` gitlink to that
   store commit without touching unrelated nested work.
3. Land the root shell Cart Drawer host and focused application tests.
4. Later replace only the host's refresh adapter with the backend status and
   calculation call, then add the confirmed checkout handoff. No persisted
   cart migration is required.
5. Roll back by removing the route-gated host and gitlink advancement; the
   existing browser cart and checkout route remain usable.
