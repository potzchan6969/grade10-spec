## Screens

### Site header with cart count

Layout SoT: Storybook `site-chrome-siteheader-auction-store-cart-count--empty-no-badge`,
`site-chrome-siteheader-auction-store-cart-count--count-1`,
`site-chrome-siteheader-auction-store-cart-count--count-3`,
`site-chrome-siteheader-auction-store-cart-count--count-123`, and
`site-chrome-siteheader-auction-store-cart-count--compact-count-3`.

Figma `Nav` (`4171:9937`) remains an early chrome reference only — Storybook
is the layout source of truth for the cart count overlay (same rule as
auction-first site header).

### Design-system Nav cart slot

Layout SoT: Storybook under `Components/Nav/` for the built-in cart control
without a count. Compound headers that need a count replace that control via
`cartSlot` — composition lives on `SiteHeader`, not on `Nav`.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Nav` | `@grade10/design-system` | Primitive chrome; optional `cartSlot` replaces the built-in cart control (same pattern as `accountSlot`). Count-agnostic. |
| `IconButton` | `@grade10/design-system` | Cart control host inside `SiteHeader`'s `cartSlot` |
| `StatusIndicator` | `@grade10/design-system` | Round count overlay on the cart icon — `type="count"`, `variant="brand"` |
| `SiteHeader` | `@grade10/ui` | Owns `cartItemCount` and composes the badged cart control into `Nav`'s `cartSlot` |

Nothing missing in this repository: `StatusIndicator` (`count` / `brand`),
`Nav.cartSlot`, and `SiteHeader.cartItemCount` already exist. No new i18n keys
for the badge digits.

**Not `Badge`.** The cart drawer title uses `Badge` `variant="brand"` as an
inline label beside the title. The header overlay uses `StatusIndicator`
`type="count"` — the design-system count pip meant for notification overlays
(ringed, min circular size). Do not swap one for the other on this surface.

## States

### Site header with cart count

| State | Shows | Anchor |
| --- | --- | --- |
| Empty or omitted count | Cart control present; no count indicator | `shared-ui-site-chrome-SC-23` |
| Count `1` | `StatusIndicator` brand count `1` on the cart icon | `shared-ui-site-chrome-SC-24` |
| Count `3` | `StatusIndicator` brand count `3` (same active-line count as the drawer title) | `shared-ui-site-chrome-SC-25` |
| Count `12` | Full digits `12`; no `99+` truncation | `shared-ui-site-chrome-SC-26` |
| Cart slot composition | Badged cart control rendered through `Nav`'s `cartSlot` | `shared-ui-site-chrome-SC-22` |
| Cart handler absent | No cart control | **Out of suite:** existing handler-gated cart (`shared-ui-site-chrome-SC-04`) / auction-first pre-Store omission |
| Signed-out (no guest cart) | Cart control may be present; no badge | **Out of suite:** same treatment as empty/omitted (`shared-ui-site-chrome-SC-23`); no guest count |
| Count unknown (hydrating) | No badge until the host supplies `cartItemCount > 0` | **Out of suite:** host omits the prop or passes `0`; no loading API on `SiteHeader` |

### Application Cart Count

The application reuses the existing Auction & Store cart-count stories and shared components. No new token, variant, translation, or layout is introduced.

| State | Shows | Anchor |
| --- | --- | --- |
| Settled member basket | Same active-line count as the drawer, including adjusted lines | `grade10-site-site-page-shell-SC-30` |
| Empty or all excluded | Cart control without badge | `grade10-site-site-page-shell-SC-31` |
| Wide and 375px | Full digits and reachable controls | `grade10-site-site-page-shell-SC-32` |
| Cart unavailable | Neither control nor badge | `grade10-site-site-page-shell-SC-33` |
| Closed drawer after a cart update | Current reviewed count without opening | `grade10-site-site-page-shell-SC-35` |
| Initial loading or failed review | No badge or badge skeleton; cart control remains | `grade10-site-site-page-shell-SC-36`, `grade10-site-site-page-shell-SC-37` |
| Signed out or switching members | No previous-member count | `grade10-site-site-page-shell-SC-38`, `grade10-site-site-page-shell-SC-40` |
| Same-member refresh | Last verified count stays until success; failure hides it | `grade10-site-site-page-shell-SC-41` |
