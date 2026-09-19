## Context

The [delta](specs/shared/ui/site-chrome/spec.md) governs the slot and count contract. The [decisions](decisions.md) exclude live cart wiring in grade10-site. Delivery here closes component verification and documentation in grade10-spec.

Source inspection on 2026-09-19 used grade10-spec main at `e3b036436` and grade10 at `24423e15e`.

| Surface | Existing Implementation | Remaining Evidence |
| --- | --- | --- |
| `packages/design-system/src/components/layout/nav.tsx` | Optional `cartSlot` takes precedence over the handler-gated built-in control | A story proving replacement and callback isolation |
| `packages/ui/src/blocks/site-chrome/site-header.tsx` | Optional `cartItemCount`; `StatusIndicator` composed through the slot; handler and positive-count guards | Absent-handler coverage with a positive count; brand and activation assertions |
| `packages/ui/src/blocks/site-chrome/site-header.cart.stories.tsx` | Empty, omitted, 1, 3, and 12 stories with play assertions | Shared header/drawer fixture; count above 99; compact rendering evidence |
| `docs/prds/products/shared/ui/site-chrome.md` | Cart Count outcome marked 🚧 and story links | Omitted/unknown and signed-out wording aligned with settled decisions |

The inspected grade10 `apps/frontend/grade10/src/chrome/SiteShell.tsx` passes the cart handler but no count. Its submodule pin is `361c33e88094030bf91e08e11e0e51d10ee161f9`. This is a deferred application integration, not another task group in this change. Source inspection does not establish browser acceptance or production delivery.

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

## Risks / Trade-offs

- **Existing code mistaken for acceptance** → Leave tasks unchecked until the claimed group has published changes and recorded browser verification
- **A hard-coded header assertion misses drawer disagreement** → Render both shared components against the same controlled fixture
- **A 12-only story permits a future 99 cap** → Keep 12 and add an above-99 regression value
- **Package evidence mistaken for live behavior** → Keep grade10 wiring outside this plan and record package checks separately from application acceptance
- **Story tooling prerequisites** → Use Node `24.14.1`, pnpm `11.21.0`, and the repository's Chromium setup for implementation verification

## Migration Plan

1. Land Nav verification, then the SiteHeader acceptance and PRD updates in grade10-spec. Both APIs already exist; no schema, wire contract, dependency, or translation migration is needed.
2. A separately scoped application delivery pins a verified store revision and supplies the drawer's active count to the header. This plan neither schedules nor claims that work.
3. Archive only after delivery is confirmed under the owning change's release workflow. Merging or passing Storybook alone does not establish deployment. A regression in these package changes is reverted through a normal corrective commit.
