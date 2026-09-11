## Screens

### Auction-first site header (signed out)

Layout SoT: Storybook `site-chrome-siteheader-auction-first--signed-out`.

Figma `Nav` (`4171:9937`) is an early reference only — do not treat its HKD
currency control as authoritative.

### Auction-first site header (signed in)

Layout SoT: Storybook `site-chrome-siteheader-auction-first--signed-in` and
`site-chrome-siteheader-auction-first--account-menu`.

### Compact menu (375px)

Layout SoT: Storybook `components-nav-layout--narrow`,
`components-nav-layout--menu-open`, and
`site-chrome-siteheader-layout--narrow-signed-out`.

Hamburger left opens a left inset drawer: primary nav, then utilities in the
same link style, then language via a nested drawer. Account / Sign In and Cart
stay on the trailing edge. Compact drawers leave a visible gutter.

### Design-system Nav primitives

Layout SoT: Storybook under `Components/Nav/` —
`components-nav-overview--all-controls`, `components-nav-account--sign-in`,
`components-nav-language--switch-language`.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Nav` | `@grade10/design-system` | Primitive chrome: logo, nav items, language locale, optional search/cart, account presentation or slot, compact left menu drawer |
| `Footer` | `@grade10/design-system` | Unchanged footer |
| `SiteHeader` | `@grade10/ui` | Compound header: `Nav` + session-aware Sign In / account menu |

Missing work already landed in this repository for Storybook SoT: `Nav`
`accountPresentation` / `accountSlot`, language locale icon, compact menu
drawer, and `SiteHeader`. Application wiring of session and destinations
remains delivery work.

## States

| State | Spec scenario |
| --- | --- |
| Signed out, Sign In button | `shared-ui-site-chrome-SC-16`, `grade10-site-site-page-shell-SC-07` |
| Signed in, account menu closed | `grade10-site-site-page-shell-SC-06` |
| Signed in, account menu open | `shared-ui-site-chrome-SC-17`, `grade10-site-site-page-shell-SC-17` |
| Sign out from menu | `grade10-site-site-page-shell-SC-18` |
| Language locale menu | `grade10-site-site-page-shell-SC-19`, `shared-ui-site-chrome-SC-07` (wide, label only); compact nested drawer via `SC-20` |
| Narrow viewport | `grade10-site-site-page-shell-SC-15`; Storybook `site-chrome-siteheader-layout--narrow-signed-out` |
| Compact menu open | `shared-ui-site-chrome-SC-20`, `grade10-site-site-page-shell-SC-20`; Storybook `components-nav-layout--menu-open`, `components-nav-layout--language-nested` |
| Wide bar layout | `shared-ui-site-chrome-SC-21` |
| No cart / no Store (language reachable) | `shared-ui-site-chrome-SC-18`, `grade10-site-site-page-shell-SC-09` |
