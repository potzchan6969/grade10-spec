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

- `Nav` / `SiteHeader` — Cart in the header on every surface once the Store
  cart drawer answers (durable `grade10-site/site/page-shell`; layout SoT
  `site-chrome-siteheader-cart--on-auction-surface`).
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

No new primitive, variant, or token. Optional `tenderPending` extends the existing props. This increment preserves existing promo editing and wires existing points actions
to the accepted basket quote.

**Depends on:** `cart-drawer-empty-state` for the shared empty-state export
contract.

## States

States combine this change's Grade10 scenarios with durable
`shared/ui/store-cart` (after `cart-drawer-empty-state`).

| State | Spec scenarios |
| --- | --- |
| Cart absent until drawer answers; then global (incl. Auction) | `grade10-site-site-page-shell-SC-09`, `grade10-site-site-page-shell-SC-16`; Storybook `site-chrome-siteheader-cart--on-auction-surface` |
| Opens over surface; close keeps address | `grade10-site-store-cart-drawer-SC-01`, `grade10-site-store-cart-drawer-SC-02` |
| Signed-in member cart; signed-out access is gated before the drawer | `grade10-site-store-cart-drawer-SC-04`; `grade10-site-site-page-shell-SC-21`–`SC-24` |
| Every open starts a fresh read | `grade10-site-store-cart-drawer-SC-05` |
| Pending / failed review | `grade10-site-store-cart-drawer-SC-06`–`grade10-site-store-cart-drawer-SC-08`; loading bones `shared-ui-store-cart-SC-08` |
| Reviewed summary; quoted total; existing promo behavior and interactive points | `grade10-site-store-cart-drawer-SC-09`, `grade10-site-store-cart-drawer-SC-10`, `grade10-site-store-cart-drawer-SC-16`–`grade10-site-store-cart-drawer-SC-19` |
| Empty drawer (shared EmptyState) | `shared-ui-store-cart-SC-04` |
| Unavailable cleanup | `grade10-site-store-cart-drawer-SC-12`; `shared-ui-store-cart-SC-10`, `shared-ui-store-cart-SC-11` |
| Quantity / remove | `grade10-site-store-cart-drawer-SC-11` |
| Line → product; Checkout → `/checkout` | `grade10-site-store-cart-drawer-SC-13`, `grade10-site-store-cart-drawer-SC-15`; redirecting `shared-ui-store-cart-SC-09` |
| Close / backdrop / Escape | `shared-ui-store-cart-SC-06` |

Browse More is out of scope for this host: the shared surface no longer exposes
slot or empty-state browse actions (`cart-drawer-empty-state`).

## Points Reference

[Storybook Default](https://storybook.grade10-stg.com/?path=/story/store-cart-cartdrawer--default)
is the requested layout reference. Reuse `CartDrawer` and its existing rounded
amount input, `pt` suffix, Apply, rate/balance text, Use max and applied Remove
action. Supply localized live data; do not copy the story's sample balance.
No new token, primitive or layout override is required.

### Points

| State | Shows | Anchor |
| --- | --- | --- |
| Ready | Existing expandable points controls and live balance/rate | `grade10-site-store-cart-drawer-SC-17` |
| Applied | Accepted points credit and Remove | `grade10-site-store-cart-drawer-SC-20` |
| Pending | Disabled tender actions and Checkout | `grade10-site-store-cart-drawer-SC-23` |
| Failed | Localized error and last accepted same-basket summary | `grade10-site-store-cart-drawer-SC-24` |
| Unavailable | No enabled points action until a usable quote answers | `grade10-site-store-cart-drawer-SC-26` |

### Shared Pending Tender

The existing Default story remains the layout reference. `CartDrawer` and
`CartDrawerFooter` gain only optional `tenderPending`; their pending stories
exercise the existing controls with accepted values retained.

| State | Shows | Anchor |
| --- | --- | --- |
| Pending tender | Existing points/promo inputs, tender actions and Checkout disabled, accepted figures retained | `shared-ui-store-cart-SC-37` |
| Resolved tender | Existing callback-gated availability restored | `shared-ui-store-cart-SC-38` |
| Pending omitted | Existing appearance and interaction | `shared-ui-store-cart-SC-39` |
