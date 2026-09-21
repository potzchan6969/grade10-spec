---
title: Site Header and Footer
spec: shared/ui/site-chrome
order: 2
reviewed: 2026-09-21
---

Two components make the chrome: a site header and a site footer. Each is usable
on its own, and between them they are what every storefront page sits inside.

A header control appears only when the application supplies a handler for it, so
nothing on screen is dead — no search box that searches nothing, no cart icon
over a store with no cart. A region of the header with nothing in it is absent
rather than empty, and a footer section with no content is dropped the same way.

The chrome can mark which surface is being viewed, and it invents no copy: every
word and every destination comes from the application. That is what lets the
same header wear another brand's words without a fork.

**Language, not currency** — the locale control switches language (English,
Traditional Chinese, Simplified Chinese for Grade10). It does not switch
currency.

## Account Entry

🚧 **`SiteHeader`** — a compound header wraps the design-system `Nav` with
session-aware account entry: Sign In as a primary button when signed out; the
account icon and a menu when signed in, with an initial avatar above the
sign-in email, then My Auctions and Sign Out. Once Store answers, My Orders
joins ahead of My Auctions and Membership joins after it. The menu does not
list Profile. KYC stays out of the menu

🚧 **My Orders** — ahead of My Auctions once Store answers, opening the Store
order history surface, and omitted until then

**Membership** — ❓ after My Auctions once Store answers; the destination is
unconfirmed

**Compact menu** — below a 896px-wide container, a leading menu control opens a
left inset drawer with primary navigation, then utility links in the same
style, then language through a nested drawer (the language label is not in the
compact bar). Account / Sign In and Cart stay in the bar; search moves into the
drawer when it is answered.

## External Links

A `NavLink` marked `external` opens in a new tab with
`rel="noopener noreferrer"`, in primary nav (wide and compact) and in the
utility strip / compact utility list.

## Cart Count

🚧 When the cart control is present and the cart holds active lines, `SiteHeader`
shows a round count on the cart icon — the same number as the cart drawer title
badge. An empty, omitted, or unknown count hides it. Signed-out visitors have
no guest cart, so they receive no count. Design-system `Nav` stays
count-agnostic.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9937" title="Nav — the site header (reference; Storybook is SoT)"}

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653" title="Footer — the site footer"}

::story{id="components-nav-overview--all-controls" title="Nav — all controls"}

::story{id="site-chrome-siteheader-auction-store-cart-count--empty-no-badge" title="Cart count — empty, no badge"}

::story{id="site-chrome-siteheader-auction-store-cart-count--count-1" title="Cart count — 1 item"}

::story{id="site-chrome-siteheader-auction-store-cart-count--count-3" title="Cart count — 3 items"}

::story{id="site-chrome-siteheader-auction-store-cart-count--count-123" title="Cart count — 123 items"}

::story{id="site-chrome-siteheader-auction-store-surfaces--cart-on-auction" title="Cart on Auction"}

::story{id="site-chrome-siteheader-auction-store-account-menu--open" title="Account menu — Auction & Store"}

::story{id="components-nav-account--sign-in" title="Nav — Sign In button"}

::story{id="components-nav-layout--narrow" title="Nav — narrow (375px)"}

::story{id="components-nav-layout--menu-open" title="Nav — menu open (375px)"}

::story{id="components-nav-layout--language-nested" title="Nav — language nested (375px)"}

::story{id="site-chrome-siteheader-auction-first--signed-out" title="Auction first — signed out"}

::story{id="site-chrome-siteheader-auction-first--signed-in" title="Auction first — signed in"}

::story{id="site-chrome-siteheader-auction-first--account-menu" title="Auction first — account menu open"}

::story{id="components-nav-overview--another-brand" title="Nav — another brand"}

::story{id="components-footer--column-with-no-links" title="A footer section with nothing to link to stays empty"}

The site's own rules for what the shell must do — the landmarks, the session
timing, the small-width reflow — are [the page shell's](/p/grade10-site/site/page-shell).
This capability is the component contract underneath it.
