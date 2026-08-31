**Author:** @constancetang - 2026-08-26

## Why

When stock forces a cart quantity down, collectors see “Low stock. Quantity
adjusted” so they understand a change they did not make. Once they edit that
quantity themselves, the explanation has done its job — leaving it on the row
turns a one-time acknowledgment into lasting noise. Clearing it on the next
quantity change should reduce repeated attention to a warning they already
understood (qualitative: fewer “why is this still yellow?” support notes).

## What Changes

- `CartItem` hides the low-stock adjustment warning after the shopper changes
  that line’s quantity (or removes the line).
- The warning shows again only when the line’s status becomes `adjusted`
  again (a new system adjustment), not for the remainder of the same
  acknowledgment.
- Document that consumers clear `adjusted` → `default` when the shopper edits
  quantity, and may clear it when the drawer closes after the warning was
  shown, so a later open does not re-litigate an already-seen adjustment.

## Non-Goals

- Time-based auto-dismiss of the warning.
- Changing sold-out treatment or unavailable-item cleanup.
- New copy, Figma frames, or toast chrome for low stock.
- Inferring stock levels inside the shared component.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `shared-ui/store-cart`: Low-stock adjustment warning lifecycle on `CartItem`
  — show while `adjusted` until the shopper changes quantity; re-show only on
  a new `adjusted` status.

## Impact

- `@grade10/ui` `CartItem` presentation behavior and Storybook coverage.
- Consuming store apps: clear `status: "adjusted"` when handling
  `onQuantityChange` / remove for that line (and optionally on drawer close
  after the warning was shown) so a remount does not re-show a spent
  acknowledgment. No export or prop shape change.
