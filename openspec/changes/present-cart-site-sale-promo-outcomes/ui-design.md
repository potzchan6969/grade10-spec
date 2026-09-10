## Screens

Storybook is the layout source of truth for this change. Figma cart frames remain
historical reference for the drawer chrome and sale-price line only.

### Cart drawer — site sale × promo

| Surface | Storybook (SoT) | Figma (historical) |
| --- | --- | --- |
| Site sale alone (sale + compare-at on lines; no Store sale footer row) | [`Store Cart/CartDrawer/Auto Discount` → Refuse](?path=/story/store-cart-cartdrawer-auto-discount--refuse) (pre-apply) | [Cart Drawer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev), [Cart Item](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4761-1494&m=dev) |
| Promo refused | [`Store Cart/CartDrawer/Auto Discount` → Refuse](?path=/story/store-cart-cartdrawer-auto-discount--refuse) | — |
| Promo stacked | [`Store Cart/CartDrawer/Auto Discount` → Stack](?path=/story/store-cart-cartdrawer-auto-discount--stack) | — |
| Promo replaces site sale | [`Store Cart/CartDrawer/Auto Discount` → Replace](?path=/story/store-cart-cartdrawer-auto-discount--replace) | — |
| Site sale restored after remove | [`Store Cart/CartDrawer/Auto Discount` → Fallback after remove](?path=/story/store-cart-cartdrawer-auto-discount--fallback-after-remove) | — |

Line-only sale + compare-at (no promo): [`Store Cart/CartItem` → Sale Price](?path=/story/store-cart-cartitem--sale-price).

Held inapplicable ticket (no Apply): [`Store Cart/PromoTicket` → Not Applicable](?path=/story/store-cart-promoticket--not-applicable) and the muted partition on Refuse.

## Components

- `CartDrawer`, `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`,
  `CartItem`, `CartPromoSheet`, `PromoTicket` from `@grade10/ui` — existing
  compound and parts; site sale is `CartItemSummary.price` +
  `originalPrice`; stacked/replaced/refused codes use `PromoState` and held
  `HeldPromoCode.applicable` / `inapplicableReason`.
- `TextInput`, `Button`, `Link` from `@grade10/design-system` — promo sheet
  field, Apply, Remove on an applied Discount row (already composed).

No new primitive, variant, token, or compound export. Do **not** add a footer
summary row whose only job is to name the site sale.

## States

| State | Spec scenarios |
| --- | --- |
| Site sale on lines (sale + compare-at); Subtotal = line sum; no Store sale footer row | `shared-ui-store-cart-SC-26` |
| Stacked code — lines keep sale + compare-at; footer `Discount (<code>)` only | `shared-ui-store-cart-SC-27` |
| Refused code — sale lines unchanged; sheet error; no applied Discount row | `shared-ui-store-cart-SC-28` |
| Inapplicable held promo — muted ticket, reason, no Apply | `shared-ui-store-cart-SC-29` |
| Replacing code — list line prices, no compare-at; footer Discount only | `shared-ui-store-cart-SC-30` |
| Remove promo — site-sale lines return when the sale still applies | `shared-ui-store-cart-SC-31` |
