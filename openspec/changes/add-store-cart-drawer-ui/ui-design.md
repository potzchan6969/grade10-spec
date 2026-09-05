## Screens

### Cart drawer

[Cart — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3831&m=dev)

[Cart Drawer — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev)

### Cart empty

[Cart, empty — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6808&m=dev)

[Cart Drawer, empty — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6810&m=dev)

## Components

- `Nav` from `@grade10/design-system` — Store-route Cart entry.
- `Toaster` from `@grade10/design-system` — one application toast host.
- `CartDrawer` from `@grade10/ui` — drawer composition and interaction owner.
- `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`, `CartItem`, and
  `CartItemSlot` from `@grade10/ui` — existing parts composed by the compound.
- `CartDrawerProps`, `CartDrawerCopy`, `CartItemSummary`, and `PromoState` from
  `@grade10/ui` — existing application adapter and copy contracts.

No new component, variant, primitive, or token is required.

## States

States remain defined by
[`shared/ui/store-cart`](../../specs/shared/ui/store-cart/spec.md):

- **Open live review** — `shared-ui-store-cart-SC-08`.
- **Failed live review** — `grade10-site-store-cart-validation-SC-21`.
- **Populated baseline and overflow** — `shared-ui-store-cart-SC-02`,
  `shared-ui-store-cart-SC-03`, and `shared-ui-store-cart-SC-07`.
- **Empty drawer** — `shared-ui-store-cart-SC-04`.
- **Unavailable cleanup and one toast** — `shared-ui-store-cart-SC-11` and
  `shared-ui-store-cart-SC-12`.
- **Close, backdrop, Escape, and scroll lock** —
  `shared-ui-store-cart-SC-06`.
- **Quantity, removal, product, browse, and checkout actions** —
  `shared-ui-store-cart-SC-09`.
