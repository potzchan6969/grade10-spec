## Context

The [shared delta](specs/shared/ui/site-chrome/spec.md) owns presentation. The [application delta](specs/grade10-site/site/page-shell/spec.md) owns the member count lifecycle. The shared coverage landed in PR #561; the application still passes only the cart handler.

Source inspection used grade10-spec `70d824c99` and grade10 `d1f25145f` on 2026-09-21. Shared stories now live in `site-header.auction-store.cart-count.stories.tsx`.

| Surface | Current Constraint |
| --- | --- |
| `apps/frontend/grade10/src/root.tsx` | Composes shell and drawer as siblings; cart availability and session already live here |
| `apps/frontend/grade10/src/chrome/SiteShell.tsx` | Supplies `onCartClick` without `cartItemCount` |
| `apps/frontend/grade10/src/chrome/CartDrawerHost.tsx` | Enables cart/review only while open; quotes and tender disclosure belong to this drawer |
| `packages/grade10-store/frontend/src/features/orders/cart/` | Scope-keyed intent/review cache and mutation invalidation already exist; `itemCount` sums quantities |
| `packages/ui/src/blocks/store-cart/cart-drawer.tsx` | Counts visible lines excluding sold-out and unavailable, including adjusted lines |

## Decisions

### Keep the Existing Composition

The spec assigns count presentation to `SiteHeader` and slot replacement to `Nav`. Retain both optional props and the existing `IconButton` / `StatusIndicator` composition; change implementation only where scenario verification exposes a mismatch.

- **Slot precedence** — exercise a supplied slot alongside `onCartClick`, proving that only the slot renders and its activation never invokes the unused built-in callback. Retain omitted-slot fallback coverage
- **Count ownership** — pass the supplied number through without local cart state, subscriptions, persistence, or line filtering. Teaching `Nav` to count, or deriving cart state in `SiteHeader`, crosses the established package boundary
- **Indicator** — retain count/brand `StatusIndicator`, the accessible button name containing the count, and the decorative indicator hidden from assistive technology. A drawer `Badge` overlay, a loading API, or `99+` formatting contradicts the settled contract
- **Session** — signed-out and unknown-count fixtures omit the count or supply zero. Guest-cart behavior and session-driven data clearing belong to the host; this change adds no session or cart service

### Verify Through Existing Stories

Use the packages' Storybook Vitest browser lane, with scenario IDs in assertions or named test steps. Extend existing stories rather than creating another test harness.

- **Nav** — add slot replacement coverage beside the existing Nav stories, retaining built-in handler and absent-handler cases
- **SiteHeader** — strengthen the current count stories with count/brand assertions and callback checks. Add a positive count without a cart handler and a value above 99; retain the specified 12 case
- **Drawer agreement** — render `SiteHeader` and exported `CartDrawerHeader` from one controlled active-count fixture with value 3. Assert both visible counts; this proves prop-level agreement, not live cart derivation
- **Layout** — inspect positive counts in wide and compact containers using existing layout conventions. Preserve full digits, the cart hit target, and account/menu placement

### Share the Reviewed Basket at the Application Boundary

The application requirement governs one member's current basket. Add a small cart presentation hook in the existing cart feature, exported through its public surface, and compose it once above the shell and drawer within the existing query/session providers. Pass its count to `SiteShell` and its basket/review state to `CartDrawerHost`; keep the shared UI controlled by props.

- **Eligibility** — enable member reads only once the session resolves to a member and Store cart is available. Hydrate intent before reviewing it. Do not start guest reads from the header
- **Projection** — count reviewed active lines, including price/quantity-adjusted lines, once each. Exclude sold-out/unavailable. Before a verified result exists, withhold the count for loading intent or checking review. Keep the last verified count in member-scoped presentation state during subsequent checks; replace it only from a settled review with no unreviewed lines. Clear it on intent/review failure or ownership change. A settled `blocked` review can still contain active lines: checkout readiness is not badge eligibility
- **Invalidation** — reuse scope-keyed review invalidation after settled mutations, including failed writes after their existing rollback/refetch. Keep the observer mounted while the drawer is closed. Drawer open still triggers its required fresh review; an explicit drawer retry refreshes the same observer; do not add polling, a second cache, a count endpoint, or per-route observers
- **Ownership** — immediately withhold the count when the authenticated member and observed cart scope differ. Never use previous-member placeholder data; late responses remain under their original scope key
- **Drawer** — reuse the same mapped reviewed lines for its count. Keep quote, coupon, points, removal announcements, and open/close effects drawer-gated. Use `removeUnavailable: false` so mounting the header does not silently delete cart lines. The existing review may reconcile prices/quantities in the intent cache; it must not submit checkout or tender writes
- **Stable controls** — pass an optional count through `SiteShell`; keep existing cart click/sign-in behavior. Do not condition the cart control on count readiness or positivity

Reject `useCart().itemCount` because it totals units, and reject `review.items.length` because checkout filtering can discard adjusted lines that the drawer still counts. Do not lift tender quoting into the shell just to obtain a count.

### Verify the Application Path

Keep component stories as presentation evidence. Application tests must render the real shell/cart composition against injected cart ports and the existing query/session providers, exercising hydration and mutation invalidation rather than passing a literal count to a mocked header. Use local browser fixtures for Store and Auction routes, 375px and wide viewports, and opening the drawer after a closed-drawer cart update.

## Risks / Trade-offs

- **Review on every page causes extra requests** → One observer per member shell; gate hydration and Store availability; reuse cache invalidation, without polling
- **Adjusted lines disappear from the count** → Test distinct-line projection independently from quantity totals and checkout eligibility
- **A late response leaks the previous member count** → Scope-keyed queries plus current-session identity checks; test A → signed-out → B while A's request is pending
- **Mounting chrome mutates the cart** → Disable unavailable-line removal in the shared observer; leave drawer cleanup and tender behavior at their existing boundary
- **Concurrent edits invalidate a settled review** → Retain only the last verified same-member count while checking; do not publish unreviewed lines or a late pre-mutation answer as a new verified result. Clear on failure; test delayed responses
- **A green story is mistaken for delivery** → Record application integration and deployed acceptance separately from package checks

## Migration Plan

1. Merge this planning extension; retain the existing shared badge API and ownership of the claimed Groups 1 and 2.
2. In grade10, pin a reviewed merged store revision if needed. The old pin already accepts `cartItemCount`; a bump alone does not implement the feature. Inspect intervening header API changes and preserve the application's current account-menu behavior.
3. Implement the cart observer/projection, then shell and drawer integration, with no database or wire migration and no new production dependency.
4. Run application checks and local browser acceptance. Deploy through grade10's release workflow only when authorized. Archive after deployed header/drawer agreement is verified; revert the application integration normally if rollback is needed.
