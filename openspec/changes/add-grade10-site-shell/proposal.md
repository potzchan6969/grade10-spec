# The grade10 site shell

**Author:** @seankcw - 2026-08-18

## Why

Every page of grade10.com renders inside a header the design does not have and
no footer at all. `SiteHeader` in the application arranges design-system
primitives by hand — a wordmark, two links, a sign-in button — while the
published `Nav` set has a promo bar, a utility row, centred navigation, a
locale control and four account controls, and the published `Footer` set has a
brand block, link columns and a legal bar. A collector who lands anywhere on
the site sees neither.

The application knows it. `SiteHeader` carries a comment explaining that the
design system's header "ships search, wishlist, cart and locale controls this
site has no surface for; four buttons that do nothing would be worse than
arranging the primitives it is itself built from. It takes over the moment
those surfaces exist." That is the whole blocker: the shared header cannot be
adopted because it renders controls unconditionally, so adopting it would ship
three dead controls to every page.

Nothing about the shell is written down either, so the first application to
render `Nav` and `Footer` decides everything about them — and no capability
says what a page of this site is made of.

**Metric:** share of the site's surfaces rendering the published chrome —
zero today, every surface once this lands, and the number that has to stay at
100% as surfaces are added.

## What Changes

- **A control with nothing behind it is not rendered.** `Nav` renders its
  search, account, wishlist and cart controls only where the consumer supplies
  a handler, so a store with no cart shows no cart. The controls that remain
  are the ones that work.
- **The grade10 application gets a page shell.** Header, a content region, and
  footer wrap every surface — `/`, `/store`, `/auction`, `/profile`, `/login`,
  and not-found — composed from `Nav` and `Footer` rather than from primitives.
- **Content stays where it is.** The shell defines the region and holds no
  opinion about what fills it; every page renders as it does today.
- **The account control replaces the header's session row.** It leads to the
  profile when signed in and to sign-in when not; signing out moves onto the
  profile page.
- **A link appears only when its destination exists.** The promo bar and the
  utility row are absent until there are pages behind them, and the footer
  carries only the columns whose destinations the site answers.

## Non-Goals

- **Search, wishlist and cart.** No surface exists behind any of them; this
  change is why their absence is now visible rather than faked.
- **A designed mobile navigation.** The shell must stay usable at small widths,
  but no mobile frame exists, and inventing one is design's decision, not
  engineering's.
- **Rebuilding any page.** The hero, collections and product grid in the
  reference frame are the store page's content, not the shell's.
- **The locale control's behavior.** It displays the site's one locale; a
  region or currency switcher is its own change.
- **`zzz-store`.** It gains the same shell when someone plans it.

## Capabilities

### New Capabilities
- `grade10-site/page-shell`: what every page of the grade10 site is wrapped
  in — the chrome, the content region, and which controls and links a surface
  may show.
- `shared-ui/site-chrome`: what the shared `Nav` and `Footer` components
  render and what the application supplies, so both storefronts inherit one
  contract.

### Modified Capabilities

None. No existing capability's requirements change.

## Impact

- **grade10 SPA** — `App.tsx` renders the shell; `SiteHeader` is replaced by a
  composition of `Nav` and `Footer` and deleted. Sign-out moves to the profile
  page. No page's own content changes.
- **Design system (`@grade10/design-system`)** — `Nav` stops rendering
  handler-less controls. `Footer` is unchanged. This is work in the
  grade10-spec repository and lands before the application can consume it.
- **Preview app** — `product-list-page.stories.tsx` is the only current
  consumer of either component and is checked against the change.
- **Backends** — none.
- **Spec store** — adds the `grade10-site` product directory, and widens the
  `shared-ui` description to cover both shared component packages rather than
  `packages/ui` alone.
