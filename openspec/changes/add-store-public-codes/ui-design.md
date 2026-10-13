# UI Design

## Screens

- **Cart Drawer · promo sheet** — the picker's held list gains a Public
  section. Composes `CartDrawer` (`CartPromoSheet`, `PromoTicket`) with the
  `publicPromoCodes` prop and `copy.publicPromoCodes` heading added by
  `add-store-guest-checkout`'s footer work. ❓ TBC — Figma frames pending.

## Components

- `CartPromoSheet` / `CartDrawer` (`CartPromoSheetProps`,
  `CartDrawerFooterCopy`) — the `publicPromoCodes` list under its own
  heading, after the member's sections; `heldPromoCodes: null` hides the
  member section for a guest.
- `PromoTicket` — the shared row for public and held codes alike.
- Design reference (workbench):
  `store-cart-blocks-cartdrawerfooter-guest--guest-with-public-code`,
  `store-cart-blocks-cartdrawerfooter-guest--member-with-public-codes`

## States

### Cart Drawer · promo sheet

| State | Shows | Anchor |
| --- | --- | --- |
| Guest With Public Code | Only the Public section — no member section, empty state or loyalty CTA | `g10.store-cart-drawer.US12` |
| Member With Public Codes | Public section after the member's held and not-valid sections | `g10.store-cart-drawer.US13` |
