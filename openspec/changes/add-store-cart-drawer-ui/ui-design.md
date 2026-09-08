## Screens

### Cart drawer

[Cart — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3831&m=dev)

[Cart Drawer — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev)

### Cart empty

[Cart, empty — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6807&m=dev)

[Cart Drawer, empty — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4799-6810&m=dev)

## Components

- `Nav` from `@grade10/design-system` — Store-route Cart entry.
- `Toast` from `@grade10/design-system` — one application toast host.
- `CartDrawer` from `@grade10/ui` — drawer composition and interaction owner.
- `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`, `CartItem`, and
  `CartItemSlot` from `@grade10/ui` — existing parts composed by the compound.
- `CartDrawerProps`, `CartDrawerCopy`, `CartItemSummary`, and `PromoState` from
  `@grade10/ui` — existing application adapter and copy contracts.
- Existing shared `chrome.cartLabel` — navigation label; no new navigation
  copy key is required.

No new component, variant, primitive, or token is required.

## States

States combine the Grade10 product deltas with the durable
[`shared/ui/store-cart`](../../specs/shared/ui/store-cart/spec.md) contract:

- **Route-gated Cart control** — `grade10-site-site-page-shell-SC-09` and
  `grade10-site-site-page-shell-SC-16`.
- **Open live review** — `grade10-site-store-cart-drawer-SC-05` and
  `shared-ui-store-cart-SC-08`.
- **Pending and failed live review** —
  `grade10-site-store-cart-drawer-SC-06` through
  `grade10-site-store-cart-drawer-SC-08`.
- **Populated baseline and overflow** — `shared-ui-store-cart-SC-02`,
  `shared-ui-store-cart-SC-03`, and `shared-ui-store-cart-SC-07`.
- **Empty drawer** — `shared-ui-store-cart-SC-04`.
- **Unavailable cleanup and one toast** — `shared-ui-store-cart-SC-10`,
  `shared-ui-store-cart-SC-11`, and
  `grade10-site-store-cart-drawer-SC-12`.
- **Display-only promo and absent points** —
  `grade10-site-store-cart-drawer-SC-10`; the collapsed Figma promo control is
  visible, with no promo callbacks, points state, or calculation.
- **Current-contract item content** —
  `grade10-site-store-cart-drawer-SC-09` and
  `grade10-site-store-cart-drawer-SC-10`; reviewed title, quantity, price,
  status, and currency are mapped, while image fields remain absent.
- **Close, backdrop, Escape, and scroll lock** —
  `shared-ui-store-cart-SC-06`.
- **Quantity and removal actions** —
  `grade10-site-store-cart-drawer-SC-11` and the shared item callbacks.
- **Product, browse, and checkout actions** —
  `grade10-site-store-cart-drawer-SC-13` through
  `grade10-site-store-cart-drawer-SC-15`; the redirecting button remains
  `shared-ui-store-cart-SC-09`.
