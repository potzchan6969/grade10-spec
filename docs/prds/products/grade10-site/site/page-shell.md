---
title: Page Shell
spec: grade10-site/site/page-shell
order: 1
---

One wrapper renders every surface of the site, not-found included, so no
surface can ship without the site around it. It gives the page exactly one
banner, one main and one contentinfo landmark, and adds no heading, copy or
spacing of its own — everything a collector reads comes from the surface
inside it.

The chrome does not wait for the session. Header and footer render on the first
paint. 🚧 When the session arrives, the account entry changes between a Sign In
primary button (signed out) and the account icon with its menu (signed in); other
controls do not appear, disappear, or move.

🚧 **Account menu** — signed in, the account icon opens Profile, My Auctions,
and Sign out. Sign-out is offered there as well as on the profile. Orders and
KYC are not in the menu for auction-first launch.

Controls exist only when there is something behind them. Search still waits for
a search surface, and no link points to a page the site does not hold. The
header marks the item that owns the current address, and marks nothing when no
item owns it.

🚧 **Auction-first chrome** — until Store launches, the primary nav lists
Auction (and the other surfaces that answer) without a Store entrance, and the
cart stays absent

🚧 **Global cart** — once Store answers the cart drawer, the Cart control stays
in the header on every surface — including Auction and other non-Store pages —
so a collector can reach checkout without returning to Store

🚧 **Store Locator** — once that page answers and the shop is open, header and
footer Store Locator lead there; until then the destination stays out of the
chrome, including on auction-first launch.

## Help

🚧 **Help** — primary nav lists Help for auction-only and full nav (wide bar
and compact menu). When Store Locator is in the chrome, Help follows it; on
auction-first, Help follows Auction. It opens the documentation site in a new
tab.

🚧 **Compact menu** — below a 896px-wide container, the leading menu opens a left
inset drawer for primary navigation and utilities; language opens a nested
drawer (not in the compact bar); Account / Sign In and Cart stay in the bar.

## Cart

🚧 **Members-only cart** — the Cart control opens sign-in for a collector
with no session, and the cart drawer opens by itself once they sign in. There
is no cart to show someone signed out.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653" title="Footer — the site footer"}

::story{id="site-chrome-siteheader-auction-first--signed-out" title="Auction first — signed out"}

::story{id="site-chrome-siteheader-auction-first--signed-in" title="Auction first — signed in"}

::story{id="site-chrome-siteheader-auction-first--account-menu" title="Account menu open"}

::story{id="components-nav-layout--narrow" title="Nav — narrow (375px)"}

::story{id="components-nav-layout--menu-open" title="Nav — menu open (375px)"}

::story{id="components-nav-layout--language-nested" title="Nav — language nested (375px)"}

::story{id="site-chrome-siteheader-layout--narrow-signed-out" title="SiteHeader — narrow signed out"}

::story{id="site-chrome-siteheader-cart--on-auction-surface" title="Cart on auction surface (post-store)"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Collector help | ❓ Open | Help sits in the primary nav (wide and compact), after Store Locator when that item is present and after Auction on auction-first. Opens in a new tab. Provisional host is Mintlify at `https://grade10.mintlify.io/`; confirm the host. | Product |
| Global cart | Decided | Once Store launches, Cart stays in the header on every surface (including Auction) to cut checkout friction. Absent only while the Store cart drawer does not answer (auction-first). | Product |
:::
