## Screens

### Site header with cart count

Layout SoT: Storybook `site-chrome-siteheader-cart--empty-cart`,
`site-chrome-siteheader-cart--one-item`,
`site-chrome-siteheader-cart--multi-item`,
`site-chrome-siteheader-cart--large-count`, and
`site-chrome-siteheader-cart--count-omitted`.

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

Nothing new is missing in this repository: `StatusIndicator` (`count` / `brand`)
and `SiteHeader` already exist. `Nav` gains `cartSlot` only (no count API).

**Not `Badge`.** The cart drawer title uses `Badge` `variant="brand"` as an
inline label beside the title. The header overlay uses `StatusIndicator`
`type="count"` — the design-system count pip meant for notification overlays
(ringed, min circular size). Do not swap one for the other on this surface.

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Cart present, count `0` or omitted — no indicator | `shared-ui-site-chrome-SC-23` | `site-chrome-siteheader-cart--empty-cart`, `site-chrome-siteheader-cart--count-omitted` |
| Cart present, count `1` | `shared-ui-site-chrome-SC-24` | `site-chrome-siteheader-cart--one-item` |
| Cart present, count `3` (matches drawer title count) | `shared-ui-site-chrome-SC-25` | `site-chrome-siteheader-cart--multi-item` |
| Cart present, count `12` — full digits, no truncation | `shared-ui-site-chrome-SC-26` | `site-chrome-siteheader-cart--large-count` |
| `cartSlot` replaces built-in cart | `shared-ui-site-chrome-SC-22` | Covered by every `SiteHeader` cart story (slot composition) |
| Cart handler absent — no cart control | Existing handler-gated cart rule (`shared-ui-site-chrome-SC-04` / auction-first omit) | Auction-first SiteHeader stories |
