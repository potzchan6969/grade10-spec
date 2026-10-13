# UI Design

## Screens

- **Cart Drawer · promo sheet** — the picker's list gains the codes open to
  everyone, listed with the member's under one "Promo codes" heading before
  "Not valid for this order". Composes `CartDrawer` (`CartPromoSheet`,
  `PromoTicket`) with the `publicPromoCodes` prop and
  `copy.publicPromoCodes` heading added by `add-store-guest-checkout`'s
  footer work. ❓ TBC — Figma frames pending.

## Components

- `CartPromoSheet` / `CartDrawer` (`CartPromoSheetProps`,
  `CartDrawerFooterCopy`) — the `publicPromoCodes` list merged with held
  codes under one "Promo codes" heading, before "Not valid for this order";
  `heldPromoCodes: null` hides the member empty state and loyalty CTA for a
  guest.
- `PromoTicket` — the shared row for public and held codes alike.
- Design reference (workbench):
  `store-cart-blocks-cartdrawerfooter-guest--guest-with-public-code`,
  `store-cart-blocks-cartdrawerfooter-guest--member-with-public-codes`

## States

### Cart Drawer · promo sheet

| State | Shows | Anchor |
| --- | --- | --- |
| Guest With Public Code | The merged list — no empty state or loyalty CTA | `g10.store-cart-drawer.US12` |
| Member With Public Codes | Held and public codes under one "Promo codes" heading, before "Not valid for this order" | `g10.store-cart-drawer.US13` |
