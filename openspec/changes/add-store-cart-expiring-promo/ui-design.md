## Screens

### Store cart promo picker

No new Figma frame is required for this confirmed state. The existing
[Store Cart PromoTicket ExpiringSoon Storybook story](https://storybook.grade10-stg.com/?path=/story/store-cart-blocks-promoticket--expiring-soon)
is the visual reference: the ticket keeps the discount title and the `Use by`
detail in separate slots, with only the detail rendered in the emphasised
treatment.

## Components

- `CartDrawer` — existing shared cart surface.
- `CartPromoSheet` — existing promo picker surface composed by the drawer.
- `PromoTicket` — existing ticket renderer; its existing detail emphasis
  treatment is the state being consumed.
- `HeldPromoCode` — existing exported data shape; `detailEmphasis` is the
  consumer-owned boolean used by the ticket.
- Existing design-system typography and accent-foreground tokens — no new
  token or variant.
- Existing `@grade10/i18n` promo and expiry messages — no new or changed
  message key.

## States

### Store cart promo picker

| State | Shows | Anchor |
| --- | --- | --- |
| Live promo outside the last 14 days | Discount title, plain expiry/conditions detail, code and existing Apply affordance | `g10.store-cart-drawer.US4`, `g10.store-cart-drawer.SC60` |
| Live promo inside the last 14 days | The same discount title, code and Apply affordance; the existing `Use by` detail slot uses the emphasised treatment | `g10.store-cart-drawer.US4`, `g10.store-cart-drawer.SC59` |
| Live promo without an expiry | Discount title, any existing conditions detail, code and existing Apply affordance; no expiry emphasis | `g10.store-cart-drawer.US4`, `g10.store-cart-drawer.SC60` |
| Live public promo in the picker | The public code remains in the existing merged picker list; its title and detail slots follow the same expiry state | `g10.store-cart-drawer.US12`, `g10.store-cart-drawer.SC61`, `g10.store-cart-drawer.SC62` |
| Live held promo that cannot apply | Existing muted refusal treatment and no Apply affordance; any supplied expiry detail remains in its own slot | `g10.store-cart-drawer.US13`, `g10.store-cart-drawer.SC63`, `g10.shared-store-cart.SC72` |
| Live public promo that cannot apply | Existing muted refusal treatment and no Apply affordance; the public code keeps its title and expiry/conditions detail, with only the detail slot emphasised | `g10.store-cart-drawer.US12`, `g10.store-cart-drawer.SC64` |
