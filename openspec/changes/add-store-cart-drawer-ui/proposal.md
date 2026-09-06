**Author:** @kinisworking - 2026-09-03

## Why

The Grade10 storefront already has scoped guest and member carts, live cart
review, and a working checkout page, but its navigation does not expose the
designed Cart Drawer. Collectors must leave the page they are browsing before
they can see whether held lines changed.

Success is that a collector can open the drawer from every Store surface,
review the current scoped cart through the existing Store backend integration,
edit it, and continue to the existing checkout without leaving the page first.

## What Changes

- Compose the existing `@grade10/ui` Cart Drawer in the Grade10 application
  shell and expose it from navigation on Store-facing routes.
- Connect the UI to the existing `@grade10/store-frontend` cart integration:
  browser storage for a guest and the server cart for a signed-in collector.
- Run the existing live cart review whenever the drawer opens, showing the
  shared loading state until current availability and price settle.
- Keep stale values and Checkout disabled when review fails, report the failure
  once, and retry on the next open.
- Let the drawer remove unavailable lines once, report that cleanup once, and
  keep quantity changes and removals on the current scoped cart.
- Map reviewed lines, current subtotal, product links, and cart actions into
  the shared drawer without a local placeholder snapshot.
- Send Checkout to the existing `/checkout` surface, which owns its own live
  review and checkout handoff.
- Add the drawer copy to a Grade10 brand `store` catalog overlay for English,
  Traditional Chinese, and Simplified Chinese. Reuse the existing shared
  navigation Cart label.

## Non-Goals

- Changing `shared/ui/store-cart` behavior or rebuilding its components.
- Any backend implementation or contract change: no Worker, API procedure,
  provider read, database/schema, webhook, persistence, or checkout-creation
  work.
- Calculating discount, shipping, tax, or promotion values in the drawer. The
  existing promo affordance remains display-only because promotion behavior is
  not part of this change.
- Exposing the Cart control on auction, profile, membership, marketing, or
  other non-Store routes.
- Changing Figma annotations, components, or tokens.
- Adding a dedicated `/cart` route or changing the existing checkout page.

## Capabilities

### New Capabilities

None. `shared/ui/store-cart` already defines the Cart Drawer behavior and
public component contract.

### Modified Capabilities

None. This change composes existing Store cart, review, checkout, and shared UI
contracts without changing their durable requirements.

## Impact

- `apps/frontend/grade10`: route-gated navigation trigger, one drawer host,
  reviewed-line mapping, existing backend-backed cart actions, and focused
  tests.
- `packages/grade10-store/frontend`: a small review option that lets the drawer
  own unavailable-line cleanup while checkout keeps its current behavior.
- Grade10 catalogs in `grade10-spec`: Cart Drawer copy for `en`, `zh-Hant`, and
  `zh-Hans`, registered as a brand `store` overlay.

No backend implementation, database, admin, deployment, or new production
dependency is part of this change; the frontend consumes the existing typed
Store integration.
