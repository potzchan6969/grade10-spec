## Screens

Grade10 hosts the shared drawer; layout for the compound itself is owned by
[`cart-drawer-empty-state`](../cart-drawer-empty-state/ui-design.md) (Storybook
SoT). This change only adds the Store overlay context.

### Store Cart overlay

Historical Figma (not layout SoT):

[Cart — Product / Cart](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4674-3831&m=dev)

Storybook composition under test once the host lands: Store page assemblies in
`apps/preview` that mount `CartDrawer` (for example product listing with cart).

## Components

- `Nav` from `@grade10/design-system` — Store-route Cart entry.
- `Toast` from `@grade10/design-system` — one application toast host (review
  failure; unavailable cleanup via the shared drawer).
- `CartDrawer` from `@grade10/ui` — as specified by `shared/ui/store-cart`
  after `cart-drawer-empty-state` (no `CartItemSlot`; empty uses `EmptyState`).
- `CartDrawerHeader`, `CartDrawerBody`, `CartDrawerFooter`, `CartItem` from
  `@grade10/ui` — parts composed by the compound.
- `CartDrawerProps`, `CartDrawerCopy` (including `emptyTitle` /
  `emptyDescription`), `CartItemSummary`, `PromoState` from `@grade10/ui`.
- Grade10 `store.cartDrawer` catalog overlay — localized copy.
- Shared `chrome.cartLabel` — navigation label.

No new primitive, variant, or token. This host does **not** wire promo apply
callbacks or points state — collapsed display-only promo, points omitted —
until a later applied-quote capability.

**Depends on:** `cart-drawer-empty-state` for the shared empty-state export
contract.

## States

States combine this change's Grade10 scenarios with durable
`shared/ui/store-cart` (after `cart-drawer-empty-state`).

| State | Spec scenarios |
| --- | --- |
| Route-gated Cart control | `grade10-site-site-page-shell-SC-09`, `grade10-site-site-page-shell-SC-16` |
| Opens over surface; close keeps address | `grade10-site-store-cart-drawer-SC-01`, `SC-02` |
| Guest vs member scoped cart | `SC-03`, `SC-04` |
| Every open starts a fresh read | `SC-05` |
| Pending / failed review | `SC-06`–`SC-08`; loading bones `shared-ui-store-cart-SC-08` |
| Reviewed summary; neutral shipping/total; display-only promo; no points | `SC-09`, `SC-10` |
| Empty drawer (shared EmptyState) | `shared-ui-store-cart-SC-04` |
| Unavailable cleanup | `SC-12`; `shared-ui-store-cart-SC-10`, `SC-11` |
| Quantity / remove | `SC-11` |
| Line → product; Checkout → `/checkout` | `SC-13`, `SC-15`; redirecting `shared-ui-store-cart-SC-09` |
| Close / backdrop / Escape | `shared-ui-store-cart-SC-06` |

Browse More is out of scope for this host: the shared surface no longer exposes
slot or empty-state browse actions (`cart-drawer-empty-state`).
