## Screens

Storybook is the layout source of truth for this change. Figma cart frames that
still draw `Cart Item Slot` are historical reference only.

### Cart drawer

| Surface | Storybook (SoT) | Figma (historical) |
| --- | --- | --- |
| Populated | [`Store Cart/CartDrawer` → Default](?path=/story/store-cart-cartdrawer--default) | [Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3831&m=dev), [Cart Drawer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev) |
| Empty | [`Store Cart/CartDrawer` → Empty State](?path=/story/store-cart-cartdrawer--empty-state) | [Cart, empty](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6807&m=dev), [Cart Drawer, empty](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6810&m=dev) |
| Overflow | [`Store Cart/CartDrawer` → Overflow Items](?path=/story/store-cart-cartdrawer--overflow-items) | - |
| Empty, no description | [`Store Cart/CartDrawer` → Empty State Without Description](?path=/story/store-cart-cartdrawer--empty-state-without-description) | - |
| Loading with lines | [`Store Cart/CartDrawer` → Loading With Lines](?path=/story/store-cart-cartdrawer--loading-with-lines) | - |
| Loading, no lines | [`Store Cart/CartDrawer` → Loading No Lines](?path=/story/store-cart-cartdrawer--loading-no-lines) | - |
| Only delisted lines | [`Store Cart/CartDrawer` → Only Delisted Lines](?path=/story/store-cart-cartdrawer--only-delisted-lines) | - |
| Only sold-out lines | [`Store Cart/CartDrawer` → Only Sold Out Lines](?path=/story/store-cart-cartdrawer--only-sold-out-lines) | - |

Body-only empty: [`Store Cart/CartDrawerBody` → Empty](?path=/story/store-cart-cartdrawerbody--empty).

## Components

- `EmptyState` from `@grade10/design-system` - empty cart body; title and
  optional description; no `actions`.
- `ShoppingCart` from `@phosphor-icons/react` - the icon inside `EmptyState`,
  drawn on every empty cart.
- `CartDrawer`, `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`,
  `CartItem` from `@grade10/ui` - compound and parts after `CartItemSlot` is
  removed from the export set.
- `CartDrawerCopy.emptyTitle` / optional `emptyDescription` - consumer copy;
  `CartDrawerBodyProps` takes the same two fields.

No new primitive, variant, or token. `EmptyState` already exists.

## States

### Cart drawer

| State | Shows | Anchor |
| --- | --- | --- |
| Items only | The cart's rows; no placeholder rows | `shared-ui-store-cart-SC-23` |
| Overflow | Every row; the body scrolls with a fade at its edges | `shared-ui-store-cart-SC-24`, `shared-ui-store-cart-SC-07` |
| Empty | Cart icon, title, description where supplied; no action, no count badge, no footer | `shared-ui-store-cart-SC-25` |
| Empty, no description | Cart icon and title alone | `shared-ui-store-cart-SC-41` |
| Body alone, empty | Cart icon, title, description where supplied; no action | `shared-ui-store-cart-SC-44` |
| Loading with lines | Row, count badge and summary skeletons; Checkout disabled; no empty state | `shared-ui-store-cart-SC-08` |
| Loading, no lines | Blank body; count badge skeleton; no footer; no empty state | `shared-ui-store-cart-SC-40` |
| Not read yet | As Loading, no lines, while the consumer has never read the cart, its first read pending or failed | `shared-ui-store-cart-SC-48` |
| Only delisted lines | Empty state; one removal toast | `shared-ui-store-cart-SC-42` |
| Only sold-out lines | The lines, marked sold out; footer; no count badge; no empty state | `shared-ui-store-cart-SC-45` |
| Empty copy | `emptyTitle` and optional `emptyDescription` on drawer copy and body props | `shared-ui-store-cart-SC-22` |
