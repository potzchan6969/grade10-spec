## Screens

Storybook is the layout source of truth for this change. Figma cart frames that
still draw `Cart Item Slot` are historical reference only.

### Cart drawer

| Surface | Storybook (SoT) | Figma (historical) |
| --- | --- | --- |
| Populated | [`Store Cart/CartDrawer` → Default](?path=/story/store-cart-cartdrawer--default) | [Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3831&m=dev), [Cart Drawer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev) |
| Empty | [`Store Cart/CartDrawer` → Empty State](?path=/story/store-cart-cartdrawer--empty-state) | [Cart, empty](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6807&m=dev), [Cart Drawer, empty](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6810&m=dev) |
| Overflow | [`Store Cart/CartDrawer` → Overflow Items](?path=/story/store-cart-cartdrawer--overflow-items) | — |
| Loading | [`Store Cart/CartDrawer` → Fetching On Open](?path=/story/store-cart-cartdrawer--fetching-on-open) | — |

Body-only empty: [`Store Cart/CartDrawerBody` → Empty](?path=/story/store-cart-cartdrawerbody--empty).

## Components

- `EmptyState` from `@grade10/design-system` — empty cart body; title and
  optional description; no `actions`.
- `CartDrawer`, `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`,
  `CartItem` from `@grade10/ui` — compound and parts after `CartItemSlot` is
  removed from the export set.
- `CartDrawerCopy.emptyTitle` / optional `emptyDescription` — consumer copy.

No new primitive, variant, or token. `EmptyState` already exists.

## States

| State | Spec scenarios |
| --- | --- |
| Items only — no placeholder slots | `shared-ui-store-cart-SC-02` |
| Overflow scroll | `shared-ui-store-cart-SC-03`, `shared-ui-store-cart-SC-07` |
| Empty — `EmptyState`, no action, no badge, no footer | `shared-ui-store-cart-SC-04` |
| Loading — skeletons; empty state hidden | `shared-ui-store-cart-SC-08` |
| Copy carries `emptyTitle` | `shared-ui-store-cart-SC-22` |
