## Screens

### Auction-first site header with Help

Layout SoT: Storybook `site-chrome-siteheader-auction-first--signed-out`
(asserts Help after Auction, no Store Locator, with href, `target="_blank"`,
`rel="noopener noreferrer"`).

Figma `Nav` (`4171:9937`) remains an early chrome reference only — Storybook
is the layout source of truth for Help as a primary nav item.

### Compact menu with Help

Layout SoT: Storybook `site-chrome-siteheader-layout--narrow-signed-out`
(auction-first: Help after Auction), `components-nav-layout--menu-open`
(full nav: Help after Store Locator with external attributes), and
`components-nav-layout--narrow`.

Wide vs compact switches at container `@4xl` (896px) so a full primary nav
(Store, Auction, Store Locator, Help) plus language and trailing controls do
not overlap. Below that width the hamburger menu carries primary nav.
Auction-first has fewer primary items and still uses the same breakpoint.

### Full primary nav with Help

Layout SoT: design-system `Components/Nav/Layout` and `Components/Nav/Overview`
fixtures that list Help after Store Locator; preview store chrome assemblies
mirror the same primary-nav Help.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Nav` | `@grade10/design-system` | Renders primary nav and utilities; honours `NavLink.external` |
| `NavLink` / `NavItem` | `@grade10/design-system` | Destination types; optional `external` |
| `NavigationLink` | `@grade10/design-system` | Primary (and compact) nav control; receives `target` / `rel` when external |
| `Link` | `@grade10/design-system` | Wide utility-strip control; receives `target` / `rel` when external |
| `SiteHeader` | `@grade10/ui` | Passes application `navItems` through to `Nav` |

Nothing new is missing in this repository: `NavLink.external` and the Help
fixtures already land with this change. Application wiring of the confirmed
host remains delivery work.

## States

| State | Spec scenario | Story |
| --- | --- | --- |
| Wide auction-only — Help external | `grade10-site-site-page-shell-SC-25`, `shared-ui-site-chrome-SC-27` | `site-chrome-siteheader-auction-first--signed-out` |
| Narrow — Help in compact menu | `grade10-site-site-page-shell-SC-26`, `shared-ui-site-chrome-SC-27` | `site-chrome-siteheader-layout--narrow-signed-out`, `components-nav-layout--menu-open` |
| Full primary nav including Help | `grade10-site-site-page-shell-SC-25` | `components-nav-layout--menu-open`, `components-nav-overview--all-controls`, preview store chrome |
| Compact below `@4xl` | — | `components-nav-layout--compact-at-800` |
| Same-tab utility (no `external`) | `shared-ui-site-chrome-SC-28` | Sibling utilities in `UTILITY_LINKS` (Shipping & Delivery, Orders & Returns) |
