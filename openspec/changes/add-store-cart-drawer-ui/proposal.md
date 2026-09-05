**Author:** @kinisworking - 2026-09-03

## Why

The Grade10 storefront already has scoped guest and member carts, live cart
review, and a working checkout page, but its navigation does not expose the
designed Cart Drawer. Collectors must leave the page they are browsing before
they can see whether held lines changed.

Success is that a collector can open the drawer from every Store surface,
review the current scoped cart against live Store data, edit it, and continue
to the existing checkout without leaving the page first.

## What Changes

- Compose the existing `@grade10/ui` Cart Drawer in the Grade10 application
  shell and expose it from navigation on Store-facing routes.
- Read the current cart through `@grade10/store-frontend`: browser storage for
  a guest and the server cart for a signed-in collector.
- Run the existing live cart review whenever the drawer opens, showing the
  shared loading state until current availability and price settle.
- Keep stale values and Checkout disabled when review fails, report the failure
  once, and retry on the next open.
- Let the drawer remove unavailable lines once, report that cleanup once, and
  keep quantity changes and removals on the current scoped cart.
- Map reviewed lines, current subtotal, product links, and cart actions into
  the shared drawer without a local placeholder snapshot.
- Send Checkout to the existing signed-in `/checkout` surface, which owns live
  checkout review and the hosted checkout handoff.
- Add the navigation and Cart Drawer copy to the Grade10 English, Traditional
  Chinese, and Simplified Chinese catalogs.

## Non-Goals

- Changing `shared/ui/store-cart` behavior or rebuilding its components.
- Adding or changing Store backend procedures, provider reads, database data,
  cart persistence, checkout creation, or hosted payment behavior.
- Adding discount, shipping, tax, or promotion behavior to the drawer.
- Exposing the Cart control on auction, profile, membership, marketing, or
  other non-Store routes.
- Changing Figma annotations, components, or tokens.

## Capabilities

### New Capabilities

None. `shared/ui/store-cart` already defines the Cart Drawer behavior and
public component contract.

### Modified Capabilities

None. This change composes existing Store cart, review, checkout, and shared UI
contracts without changing their durable requirements.

## Impact

- `apps/frontend/grade10`: route-gated navigation trigger, one drawer host,
  reviewed-line mapping, scoped cart actions, and focused tests.
- `packages/grade10-store/frontend`: a small review option that lets the drawer
  own unavailable-line cleanup while checkout keeps its current behavior.
- Grade10 catalogs in `grade10-spec`: navigation and Cart Drawer copy for `en`,
  `zh-Hant`, and `zh-Hans`.

No backend, database, admin, deployment, or new production dependency is part
of this change.
