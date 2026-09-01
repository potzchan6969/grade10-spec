## 1. Design-system toast export (grade10-spec)

- [x] 1.1 Re-export `toast` from the Sonner overlay module beside `Toaster` so consumers import the primitive from `@grade10/design-system`
- [x] 1.2 Verify: `pnpm run typecheck` for the design-system package (or workspace typecheck covering it)

## 2. Cart drawer unavailable cleanup (grade10-spec)

Depends on group 1 for the `toast` import path.

- [x] 2.1 Make *Status values are the four named states* and *Drawer copy carries the unavailable-removal toast message* pass — extend `CartItemStatus` with `unavailable` and add `unavailableItemsRemoved` on `CartDrawerCopy` / fixtures
- [x] 2.2 Make *Delisted items clear after loading with one toast* and *No unavailable items means no removal toast* pass — after open loading ends, call `onRemoveItem` for each `unavailable` line without rendering those rows, and show one design-system toast when any were cleared
- [x] 2.3 Add a `CartDrawer` story that opens with a mix of active and unavailable lines after fetch, asserts unavailable rows are gone, remaining rows stay, and the toast message appears at bottom-right
- [x] 2.4 Verify: `pnpm run test:stories:ui` (cart drawer stories) and `openspec validate cart-drawer-unavailable-items --strict`
