## Context

The [shared delta](specs/shared/ui/site-chrome/spec.md) owns presentation. The [application delta](specs/grade10-site/site/page-shell/spec.md) owns the member count lifecycle. Both are already built ahead of acceptance: the shared stories landed in PR #561, and grade10 supplies the count (`apps/frontend/grade10/src/root.tsx:173`) from `useCartPresentation` in the cart feature. The work left is verification and the scenarios no test cites yet.

Source inspection used grade10-spec `50ada1cda` and grade10 `d38e0e7e93` on 2026-10-06. Shared stories live in `site-header.auction-store.cart-count.stories.tsx` and `nav.overview.stories.tsx`.

| Surface | Current Constraint |
| --- | --- |
| `apps/frontend/grade10/src/root.tsx` | Composes shell and drawer as siblings under one `useCartPresentation`; passes `cartItemCount` only while Cart is enabled. `cartEnabled` (line 304) holds Cart to Store addresses, so Auction drops Cart and its count, against the settled `grade10-site-site-page-shell-SC-16` |
| `apps/frontend/grade10/src/chrome/SiteShell.tsx` | Passes the optional `cartItemCount` through to `SiteHeader` |
| `apps/frontend/grade10/src/chrome/CartDrawerHost.tsx` | Takes basket and review from the shared hook and refreshes both on open; quotes, tender disclosure and retry belong to this drawer |
| `packages/grade10-store/frontend/src/features/orders/cart/` | Scope-keyed intent/review cache and mutation invalidation; `useCartPresentation` keeps the member's last verified count; `itemCount` still sums quantities; `MAX_CART_LINES` caps a cart at 50 lines |
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

- **Nav** — verify the existing slot replacement story beside the built-in handler and absent-handler cases
- **SiteHeader** — verify the existing count stories (0, 1, 3, 123, a positive count without a cart handler) for count/brand presentation, the accessible name carrying the count, and callback checks. Three gaps stay open at `50ada1cda`: no story omits the count, no step asserts the indicator is hidden from assistive technology, and `NoCartHandler` cites `shared-ui-site-chrome-SC-04` where it proves `shared-ui-site-chrome-SC-41`
- **Drawer agreement** — render `SiteHeader` and exported `CartDrawerHeader` from one controlled active-count fixture with value 3. Assert both visible counts; this proves prop-level agreement, not live cart derivation
- **Layout** — inspect positive counts in wide and compact containers using existing layout conventions. Preserve full digits, the cart hit target, and account/menu placement

### Share the Reviewed Basket at the Application Boundary

The application requirement governs one member's current basket. One cart presentation hook in the cart feature, `useCartPresentation`, exported through its public surface, is composed once above the shell and drawer within the existing query/session providers. Its count goes to `SiteShell` and its basket/review state to `CartDrawerHost`; the shared UI stays controlled by props.

- **Eligibility** — enable member reads only once the session resolves to a member and Store cart is available. Hydrate intent before reviewing it. Do not start guest reads from the header
- **Projection** — count reviewed active lines, including price/quantity-adjusted lines, once each. Exclude sold-out/unavailable. Before a verified result exists, withhold the count for loading intent or checking review. Keep the last verified count in member-scoped presentation state during subsequent checks; replace it only from a settled review with no unreviewed lines. Clear it on intent/review failure or ownership change. A settled `blocked` review can still contain active lines: checkout readiness is not badge eligibility
- **Invalidation** — reuse scope-keyed review invalidation after settled mutations, including failed writes after their existing rollback/refetch. Keep the observer mounted while the drawer is closed. Drawer open still triggers its required fresh review; an explicit drawer retry refreshes the same observer; do not add polling, window-focus refetch, a second cache, a count endpoint, or per-route observers. A change made on another device therefore shows on the next hydration, mutation, drawer open or retry
- **Ownership** — immediately withhold the count when the authenticated member and observed cart scope differ. Never use previous-member placeholder data; late responses remain under their original scope key
- **Drawer** — reuse the same mapped reviewed lines for its count. Keep quote, coupon, points, removal announcements, and open/close effects drawer-gated. Use `removeUnavailable: false` so mounting the header does not silently delete cart lines. The existing review may reconcile prices/quantities in the intent cache; it must not submit checkout or tender writes
- **Stable controls** — pass an optional count through `SiteShell`; keep existing cart click/sign-in behavior. Do not condition the cart control on count readiness or positivity
- **Every surface** — the observer sits above the routes, so moving between surfaces keeps the verified count with no new review. The count rides Cart wherever Cart is offered; restoring Cart on Auction (`grade10-site-site-page-shell-SC-16`) is a `fix` commit with its regression test, landed before Group 5 verifies `grade10-site-site-page-shell-SC-55`. That fix gates Cart on the build's Store gate, which already selects `SiteWithCart`, rather than on the current route: `SiteWithCart` always supplies the handler, `useCartPresentation` stays enabled across navigation, and the route-driven `cartEnabled` and its drawer-closing effect go. A route-driven `enabled` would reset the verified count on every Store → Auction move. The two tests that assert Cart absent on Auction while citing `grade10-site-site-page-shell-SC-47` (`CartDrawer.test.tsx:328`, the tail of `cart-count.spec.ts:177`) are corrected with it

Reject `useCart().itemCount` because it totals units, and reject `review.items.length` because checkout filtering can discard adjusted lines that the drawer still counts. Do not lift tender quoting into the shell just to obtain a count.

### Verify the Application Path

Keep component stories as presentation evidence. Application tests must render the real shell/cart composition against injected cart ports and the existing query/session providers, exercising hydration and mutation invalidation rather than passing a literal count to a mocked header. Use local browser fixtures for Store and Auction routes, a review response changed between reviews to stand for another device, 375px and wide viewports, and opening the drawer after a closed-drawer cart update. The full-count browser check fills a real cart to its 50-line cap rather than a 123-line response fixture.

## Risks / Trade-offs

- **Review on every page causes extra requests** → One observer per member shell; gate hydration and Store availability; reuse cache invalidation, without polling
- **Adjusted lines disappear from the count** → Test distinct-line projection independently from quantity totals and checkout eligibility
- **A late response leaks the previous member count** → Scope-keyed queries plus current-session identity checks; test A → signed-out → B while A's request is pending
- **Mounting chrome mutates the cart** → Disable unavailable-line removal in the shared observer; leave drawer cleanup and tender behavior at their existing boundary
- **Concurrent edits invalidate a settled review** → Retain only the last verified same-member count while checking; do not publish unreviewed lines or a late pre-mutation answer as a new verified result. Clear on failure; test delayed responses
- **Cart stays Store-only** → Group 5 depends on the `grade10-site-site-page-shell-SC-16` fix; `grade10-site-site-page-shell-SC-55` fails until it lands
- **A green story is mistaken for delivery** → Record application integration and deployed acceptance separately from package checks

## Migration Plan

1. Accept the change; retain the existing shared badge API.
2. Claim with `pnpm plan claim`, then verify each group's existing code against its scenarios and add the tests no scenario has yet. No database or wire migration and no new production dependency.
3. Record each verified group through `pnpm plan implementation`.
4. Run application checks and local browser acceptance. Deploy through grade10's release workflow only when authorized. Archive after deployed header/drawer agreement is verified; revert the application integration normally if rollback is needed.
