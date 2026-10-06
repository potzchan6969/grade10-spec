## Screens

Storybook is the layout source of truth for this change. Figma cart frames remain
historical reference for the drawer chrome and sale-price line only.

### Cart drawer - site sale and promo code

| Surface | Storybook (SoT) | Figma (historical) |
| --- | --- | --- |
| A line on the site sale (sale price and struck list price) | [`Store Cart/CartItem` → Sale Price](?path=/story/store-cart-cartitem--sale-price) | [Cart Item](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4761-1494&m=dev) |
| A list price equal to the price, still struck through | [`Store Cart/CartItem` → Equal List Price](?path=/story/store-cart-cartitem--equal-list-price) | - |
| Site sale alone (two sale lines, one holding two, one line off the sale, one sold-out line; no code; no Store sale row) | [`Store Cart/CartDrawer/Auto Discount` → On Sale](?path=/story/store-cart-cartdrawer-auto-discount--on-sale) | [Cart Drawer](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4735-6493&m=dev) |
| Promo refused | [`Store Cart/CartDrawer/Auto Discount` → Refuse](?path=/story/store-cart-cartdrawer-auto-discount--refuse) | - |
| Promo stacked | [`Store Cart/CartDrawer/Auto Discount` → Stack](?path=/story/store-cart-cartdrawer-auto-discount--stack) | - |
| Promo replaces site sale | [`Store Cart/CartDrawer/Auto Discount` → Replace](?path=/story/store-cart-cartdrawer-auto-discount--replace) | - |
| Code removed, sale on the lines | [`Store Cart/CartDrawer/Auto Discount` → Fallback after remove](?path=/story/store-cart-cartdrawer-auto-discount--fallback-after-remove) | - |

Held inapplicable ticket (no Apply): [`Store Cart/PromoTicket` → Not Applicable](?path=/story/store-cart-promoticket--not-applicable) and the muted partition on Refuse.

## Components

- `CartDrawer`, `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`,
  `CartItem`, `CartPromoSheet`, `PromoTicket` from `@grade10/ui` - existing
  compound and parts; a site sale is `CartItemSummary.price` (sale price) and
  `originalPrice` (list price); stacked, replaced and refused codes use
  `PromoState`, and held codes `HeldPromoCode.applicable` and
  `inapplicableReason`.
- `TextInput`, `Button`, `Link` from `@grade10/design-system` - promo sheet
  field, Apply, Remove on an applied Discount row (already composed).

No new primitive, variant, token, or compound export. Do **not** add a footer
summary row whose only job is to name the site sale.

## States

| State | Anchor | Spec scenario |
| --- | --- | --- |
| Site sale on lines (sale price, struck list price); a line off the sale at its price alone; Subtotal = each line's price times its quantity, leaving out a sold-out one; no discount row | On sale, Subtotal · `shared-ui-store-cart-US-13` | `shared-ui-store-cart-SC-26`, `shared-ui-store-cart-SC-47` |
| Stacked code - lines keep the sale; one footer discount row for the code | Stacked · `shared-ui-store-cart-US-14` | `shared-ui-store-cart-SC-27` |
| Refused code, typed or picked from a held ticket - sale lines unchanged; sheet shows the refusal; no discount row | Refused · `shared-ui-store-cart-US-15` | `shared-ui-store-cart-SC-28` |
| Inapplicable held promo - muted ticket, reason, no Apply, listed apart from the applicable ones | Held, cannot apply · `shared-ui-store-cart-US-15` | `shared-ui-store-cart-SC-29`, `shared-ui-store-cart-SC-46` |
| Replacing code - each line it takes the sale from at its list price, nothing struck; one footer discount row for the code | Replaced · `shared-ui-store-cart-US-16` | `shared-ui-store-cart-SC-30` |
| Code removed - its discount row leaves; the sale is on the lines while it still runs | Removed · `shared-ui-store-cart-US-17` | `shared-ui-store-cart-SC-31` |

Open for the designer, in `decisions.md` Raised: where a picked held code's
ticket sits after the quote refuses it (R5), and how a screen reader tells the
struck list price from the price charged (R7).
