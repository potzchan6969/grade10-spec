**Author:** @kinisworking - 2026-09-03

## Why

Collectors can add products to the browser cart, but the Grade10 storefront
does not currently expose the designed Cart Drawer from its navigation. The
Cart and Cart (empty) Figma frames define the missing review surface, including
dismissal, open-time refresh, and the five-slot empty baseline.

The success signal is that a collector can open the cart from every store
surface, review the current browser cart or its empty state, and dismiss it
without leaving the page; the refresh seam must be ready for live status and
price data when the backend is available.

## What Changes

- Compose the existing `@grade10/ui` Cart Drawer in the Grade10 application
  shell and expose it from the global navigation on store-facing routes.
- Keep the drawer's open-time refresh callback as the single app-owned seam;
  initially refresh a deterministic local presentation snapshot on every open
  while showing the shared loading state during the async operation.
- Map the current browser cart into the drawer's display-ready rows and local
  subtotal, preserving the existing stored cart record as the source for the
  placeholder implementation.
- Wire drawer quantity changes and removals back to the existing cart feature,
  and use the existing `CartDrawer` behavior for empty slots, dismissal,
  scroll lock, and transitions.
- Add localized Grade10 catalog copy for the navigation control and all Cart
  Drawer labels in English, Traditional Chinese, and Simplified Chinese.
- Keep checkout application-owned and provisional: the drawer callback
  navigates to `/checkout` until the final checkout handoff is confirmed.

## Non-Goals

- Changing the established `shared-ui/store-cart` requirements or rebuilding
  its existing `@grade10/ui` components.
- Adding backend status, repricing, discount, shipping, tax, or checkout-session
  APIs; the refresh adapter is the replacement boundary for those later.
- Changing the persisted browser cart schema or moving cart ownership to a
  server cart.
- Exposing the Cart control on auction, profile, membership, marketing, or
  other non-store routes.
- Changing the Figma annotations or annotation baseline as part of this plan.

## Capabilities

### New Capabilities

None. The shared `shared-ui/store-cart` capability already defines the Cart
Drawer behavior and public component contract.

### Modified Capabilities

None. This change delivers an existing capability into the Grade10 application
without changing its durable requirements.

## Impact

- `grade10` application shell and storefront composition: navigation trigger,
  drawer state, display snapshot adapter, cart callbacks, route gating, and
  focused tests.
- Grade10 locale catalogs in `external/grade10-spec` for navigation and Cart
  Drawer copy across the three supported locales, plus the parent submodule
  pointer if its commit advances. Korean is not included because it is
  currently a ZZZ-only locale.
- No backend, database, wire contract, or new production dependency.
