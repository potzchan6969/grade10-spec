**Author:** @cursor-agent - 2026-09-14

## Why

When Store is open, collectors with items in the cart have no count on the
header cart icon — they must open the drawer to learn how many lines they hold.
The drawer title already shows that active-item count; the icon should match it
so the header and the drawer agree.

**Metric:** share of Store sessions where the header cart count matches the
drawer title badge on open (target: 100% of sessions with a cart control).

**Acceptance signal:** with active lines, the cart icon shows a round brand
count equal to the drawer title badge; with none, the badge is absent.

## What Changes

- `SiteHeader` owns the cart count badge: it accepts `cartItemCount` (the same
  active-line count the cart drawer title badge uses) and composes a
  design-system `StatusIndicator` (`type="count"`, `variant="brand"`) on the
  cart control when the count is greater than zero.
- Design-system `Nav` stays count-agnostic. It gains an optional `cartSlot` so
  a compound header can replace the built-in cart control (same pattern as
  `accountSlot`).
- Storybook covers empty (no badge), one item, multi-item, and a large count
  (no truncation) on `SiteHeader`.
- Manual page for site chrome gains a 🚧 cart-count line.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/ui/site-chrome` — `SiteHeader` cart count indicator matching the cart
  drawer title count; `Nav` `cartSlot` for compound cart ownership.

## Impact

- `@grade10/ui` `SiteHeader` props and cart control composition.
- `@grade10/design-system` `Nav` gains `cartSlot` (no count API).
- Consumers that show a cart control on `SiteHeader` SHOULD supply
  `cartItemCount` from the same active-line derivation as `CartDrawer` /
  `CartDrawerHeader` `itemCount`.

## Open Questions

None — count meaning stays with store-cart (exclude sold-out); `SiteHeader`
only displays the supplied number; hide when empty, omitted, or unknown;
signed-out has no guest cart and no badge; ownership on `SiteHeader` (not
`Nav`) is the product choice.

## References

- [Site Header and Footer · Cart Count](../../../docs/prds/products/shared/ui/site-chrome.md#cart-count)
- [Cart Drawer](../../../docs/prds/products/shared/ui/store-cart.md)
