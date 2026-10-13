**Author:** @cursor-agent - 2026-09-14

## Why

When Store is open, collectors with items in the cart have no count on the
header cart icon — they must open the drawer to learn how many lines they hold.
The drawer title already shows that active-line count; the icon should match it
so the header and the drawer agree.

**Metric:** share of Store sessions where the header cart count matches the
drawer title badge on open (target: 100% of sessions with a cart control).

**Acceptance signal:** with active lines, the cart icon shows a round brand
count equal to the drawer title badge; with none, the badge is absent.

## What Changes

- **Header count** — `SiteHeader` takes `cartItemCount` and shows it on the
  cart control as a design-system `StatusIndicator` (`type="count"`,
  `variant="brand"`) when it is above zero, in full; the control's accessible
  name carries the count
- **Cart slot** — design-system `Nav` stays count-agnostic and takes an
  optional `cartSlot` that replaces the built-in cart control, as
  `accountSlot` does for account
- **Member count** — grade10-site supplies the signed-in member's active-line
  count from the same reviewed basket as the drawer, on every surface that
  offers Cart, including while the drawer is closed
- **Hidden count** — an unknown count, an empty cart and a signed-out session
  show no badge and keep the Cart control; a member change clears the count at
  once

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `grade10-site/site/page-shell` — the member count: what counts, when it
  refreshes, and who it belongs to
- `shared/ui/site-chrome` — `SiteHeader` cart count indicator and `Nav`
  `cartSlot`

## Impact

- **`@grade10/ui`** — `SiteHeader` `cartItemCount`: new to the contract,
  already present in the package
- **`@grade10/design-system`** — `Nav` `cartSlot`: new to the contract,
  already present in the package; no count API
- **grade10** — cart feature, root composition, `SiteShell` and
  `CartDrawerHost` supply the count; no backend contract changes
- **Archive** — after the application is deployed and the header and drawer
  are seen to agree, not after the shared stories alone

## References

- [Page Shell · Cart](../../../docs/prds/products/grade10-site/site/page-shell.md#cart)
- [Site Header and Footer · Cart Count](../../../docs/prds/products/shared/ui/site-chrome.md#cart-count)
- [Cart Drawer](../../../docs/prds/products/shared/ui/store-cart.md)
