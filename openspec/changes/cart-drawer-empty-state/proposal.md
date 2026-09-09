**Author:** @tangconst - 2026-09-09

## Why

The shared cart drawer fills empty rows with dashed `CartItemSlot`
placeholders so the panel keeps a five-row shape. Collectors read those
slots as actions; empty carts look unfinished rather than empty. The
design-system already has `EmptyState` for no-data surfaces. Slot-driven
Browse More also forces every store host to invent a catalogue handoff the
empty state should not own.

**Metric:** share of empty-drawer opens where the collector dismisses without
attempting a slot or browse action they cannot complete. First delivery sets
the baseline against Storybook empty-state stories.

**Acceptance signal:** an empty cart shows `EmptyState` with consumer title
(and optional description), no action button, no item slots; a cart with
items lists only those items.

## What Changes

- Remove `CartItemSlot` (and `CartItemSlotProps`) from the shared store-cart
  export contract.
- Stop filling a five-row baseline with placeholder slots.
- When the cart is empty and not loading, show design-system `EmptyState`
  with consumer `emptyTitle` / optional `emptyDescription` and no actions.
- Keep header badge and footer hidden on empty (unchanged).
- Treat colocated Storybook stories as the layout source of truth for this
  surface; leave existing Figma cart frames as historical reference only.
- Update the shared cart manual page to match.

## Non-Goals

- Grade10 Store host wiring, route-gated Cart chrome, or live cart review —
  that stays on `add-store-cart-drawer-ui`, which consumes this change.
- Wiring promo apply, held codes, or points tender (shared affordances may
  already exist; this change does not expand them).
- Changing Figma files or design-sync mappings for `Cart Item Slot`.
- A dedicated `/cart` route or checkout creation from the drawer.
- Brand-specific empty copy beyond the shared copy contract fields.

## Capabilities

### Modified Capabilities

- `shared/ui/store-cart` — export set, empty-cart presentation, and item-list
  baseline (no placeholder slots).

## Impact

- `@grade10/ui` store-cart block and its Storybook stories.
- Consumers that imported `CartItemSlot` or passed `onBrowseMore` /
  `emptySlotCount` must drop those.
- `CartDrawerCopy` gains required `emptyTitle` (optional `emptyDescription`).
- Active `add-store-cart-drawer-ui` must stop requiring Browse More once it
  consumes this change.

## Open Questions

None — empty state has no action button; Storybook is layout SoT; Figma stays
historical. Confirmed with the author when splitting this from
`add-store-cart-drawer-ui`.
