## Goals

- An empty cart shows the design-system empty state: consumer title, optional
  description, no action button, no item slots.
- A cart with items lists only those items. The drawer does not fill empty
  rows with placeholders.

## Non-Goals

- Grade10 Store host wiring, route-gated Cart chrome, or live cart review.
- Wiring promo apply, held codes, or points tender.
- Changing Figma files or design-sync mappings for Cart Item Slot.
- A dedicated `/cart` route or checkout creation from the drawer.
- Brand-specific empty copy beyond the shared copy contract fields.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does an empty cart show? | Design-system EmptyState with consumer title and optional description, no action button - decided by the round | Placeholder CartItemSlot rows and a Browse More handoff |
| Q2 | What keeps the drawer shape when the cart has few items? | Nothing — list the items only; overflow scrolls - decided by the round | A five-row baseline of slots |
| Q3 | Where is layout source of truth? | Colocated Storybook stories. Existing Figma cart frames stay historical - decided by the round | Updating Figma Cart Item Slot or design-sync mappings in this change |
| Q4 | Does this change wire the Grade10 host? | No — host, Cart chrome and live review stay on `add-store-cart-drawer-ui` - decided by the round | Expanding this change into the Store host |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
