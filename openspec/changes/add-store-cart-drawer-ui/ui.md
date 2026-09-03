## Screens

### Cart drawer

- [Cart — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3831&m=dev)
- [Cart drawer node — Product / Cart / Cart Drawer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev)

### Cart empty

- [Cart (empty)](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6808&m=dev)
- [Cart empty drawer node — Product / Cart / Cart Drawer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6810&m=dev)

## Components

The application composes these existing exports; no new component or token is
required in `grade10-spec`:

- `Nav` from `@grade10/design-system` — global store-route entry point.
- `Toaster` from `@grade10/design-system` — one application-level toast host.
- `CartDrawer` from `@grade10/ui` — drawer composition and interaction owner.
- `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`, `CartItem`, and
  `CartItemSlot` from `@grade10/ui` — existing exports used by `CartDrawer`.
- `CartDrawerProps`, `CartDrawerCopy`, `CartItemSummary`, and `PromoState` from
  `@grade10/ui` — application adapter and copy types.

## States

States continue to be defined by the durable
[`shared-ui/store-cart` capability](../../specs/shared-ui/store-cart/spec.md):

- Open-time refresh loading and disabled checkout — `store-cart-SC-08`.
- Populated five-slot baseline and overflow — `store-cart-SC-02`,
  `store-cart-SC-03`, and `store-cart-SC-07`.
- Empty drawer with five placeholders, hidden badge, and hidden footer —
  `store-cart-SC-04`.
- Close button, backdrop, Escape, and scroll lock — `store-cart-SC-06`.
- Quantity edits, removals, and provisional checkout handoff —
  `store-cart-SC-09`.

The initial application refresh uses only the existing browser-cart projection;
live availability, repricing, and calculation states remain the future
backend adapter's responsibility.
