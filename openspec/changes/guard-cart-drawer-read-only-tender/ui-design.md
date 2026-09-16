## Screens

### Store Cart drawer

| Surface | Layout source | Figma |
| --- | --- | --- |
| Cart Drawer with promo and points disclosures | Existing `Store Cart/CartDrawer` and `Store Cart/CartDrawerFooter` Storybook compositions; extend them with the states below | [Historical Cart Drawer frame](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev) |

No new frame or layout is introduced. Storybook remains the review source for
the callback-presence variants; the historical Figma frame is reference only.

## Components

- `CartDrawer`, `CartDrawerFooter`, `CartPromoSheet`, and `PromoTicket` from
  `@grade10/ui` — existing shared Store Cart exports whose visible actions are
  being callback-gated.
- `CartDrawerProps`, `CartDrawerFooterProps`, `CartPromoSheetProps`,
  `CartDrawerCopy`, and `CartDrawerFooterCopy` from `@grade10/ui` — existing
  prop and copy contracts; no new prop is introduced.
- `Button`, `Link`, `TextInput`, `NumberInput`, `IconButton`, `Badge`, `HStack`,
  and `VStack` from `@grade10/design-system` — existing primitives used by the
  drawer and promo sheet.

No new primitive, variant, token, compound export, or Figma component set is
required.

## States

| State | Spec scenarios | Storybook source |
| --- | --- | --- |
| Promo context with no typed-apply or held-code callback; supplied code details and refusal remain visible | `shared-ui-store-cart-SC-32` | `Store Cart/CartDrawerFooter` and `Store Cart/CartDrawer` read-only interaction coverage |
| Promo context with typed-apply and held-code callbacks | `shared-ui-store-cart-SC-33` | `Store Cart/CartDrawerFooter` and `Store Cart/CartDrawer` interactive interaction coverage |
| Points context with no points-apply or Use max callback; supplied balance, ceiling, and rate remain visible | `shared-ui-store-cart-SC-34` | `Store Cart/CartDrawerFooter` read-only interaction coverage |
| Points context with points-apply and Use max callbacks | `shared-ui-store-cart-SC-35` | `Store Cart/CartDrawerFooter` interactive interaction coverage |
| Partial callback matrix; only the action owned by a missing callback is absent | `shared-ui-store-cart-SC-36` | `Store Cart/CartDrawerFooter` and `Store Cart/CartDrawer` callback-matrix interaction coverage |
