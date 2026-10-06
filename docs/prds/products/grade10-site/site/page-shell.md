---
title: Page Shell
spec: grade10-site/site/page-shell
order: 1
reviewed: 2026-09-21
---

One wrapper renders every surface of the site, not-found included, so no
surface can ship without the site around it. It gives the page exactly one
banner, one main and one contentinfo landmark, and adds no heading, copy or
spacing of its own — everything a collector reads comes from the surface
inside it.

The chrome does not wait for the session. Header and footer render on the first
paint. When the session arrives, the account entry changes between a Sign In
primary button (signed out) and the account icon with its menu (signed in); other
controls do not appear, disappear, or move.

Controls exist only when there is something behind them. Search still waits for
a search surface, and no link points to a page the site does not hold. The
header marks the item that owns the current address, and marks nothing when no
item owns it.

**Auction-first chrome** — until Store launches, the primary nav lists
Auction (and the other surfaces that answer) without a Store entrance, and the
cart stays absent

**Global cart** — once Store answers the cart drawer, the Cart control stays
in the header on every surface — including Auction and other non-Store pages —
so a collector can reach checkout without returning to Store

**Store Locator** — once that page answers and the shop is open, header and
footer Store Locator lead there; until then the destination stays out of the
chrome, including on auction-first launch.

## Account Menu

**Account menu** - signed in, an initial avatar sits above the email, above
the items: My Auctions and Sign Out on auction launch; My Orders and My
Auctions once Store answers, with Sign Out always last. KYC stays out.

**Withheld pages** - the menu never offers an item whose page the site
withholds: My Orders, Profile or Membership

**My Orders** - ahead of My Auctions once Store answers, opening
`/profile/orders`, and omitted until then on the same gate as Cart

❓ **Membership** - after My Auctions; Product (@tangconst) confirms whether
it joins wherever the membership page is carried, by the same rule as
Profile, or waits for the loyalty programme's own launch -
[Carried Surfaces](/p/grade10-site/site/carried-surfaces)

❓ **Profile** - Product (@tangconst) confirms whether Profile joins first
wherever the account page is carried, or the menu never offers it -
[Carried Surfaces](/p/grade10-site/site/carried-surfaces)

**Sign Out on the account page** - the account page offers Sign Out as well,
wherever it is carried

## Help

Primary nav lists Help for auction-only and full nav (wide bar and compact
menu). When Store Locator is in the chrome, Help follows it; on auction-first,
Help follows Auction. It opens the documentation site in a new tab.

**Compact menu** — below a 896px-wide container, the leading menu opens a left
inset drawer for primary navigation and utilities; language opens a nested
drawer (not in the compact bar); Account / Sign In and Cart stay in the bar.

## Cart

🚧 **Cart count** - the header shows a member the same active-line count as the
cart drawer title, with the drawer open or closed

🚧 **No count** - an empty or unknown cart and a signed-out session show no
count; the Cart control stays where it is

🚧 **During a refresh** - the last verified count stays while the same member's
cart is checked, including after a failed change, and disappears if that check
fails

🚧 **What counts** - each distinct line counts once, whatever its quantity;
adjusted lines count, sold-out and unavailable lines do not

🚧 **Member change** - signing out or changing member clears the count at once

🚧 **Updates** - the count refreshes when the member's cart loads, when a cart
change finishes, saved or failed, when the drawer opens, and on Retry, with the
drawer open or closed; a change made on another device shows after the next of
these, not live

**Members-only cart** - for a collector with no session, the Cart control
opens sign-in instead of the drawer; the drawer opens by itself on that
surface once they sign in, and dismissing the dialog leaves them signed out
with nothing waiting. A signed-in collector gets the drawer directly. There is
no cart to show someone signed out.

::figma{url="https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4171-9653" title="Footer — the site footer"}

::story{id="site-chrome-siteheader-auction-first--signed-out" title="Auction first — signed out"}

::story{id="site-chrome-siteheader-auction-first--signed-in" title="Auction first — signed in"}

::story{id="site-chrome-siteheader-auction-first--account-menu" title="Auction first — account menu open"}

::story{id="site-chrome-siteheader-auction-store-account-menu--open" title="Account menu — Auction & Store"}

::story{id="components-nav-layout--narrow" title="Nav — narrow (375px)"}

::story{id="components-nav-layout--menu-open" title="Nav — menu open (375px)"}

::story{id="components-nav-layout--language-nested" title="Nav — language nested (375px)"}

::story{id="site-chrome-siteheader-layout--narrow-signed-out" title="SiteHeader — narrow signed out"}

::story{id="site-chrome-siteheader-auction-store-surfaces--cart-on-auction" title="Cart on Auction"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Collector help | ❓ Open | Help sits in the primary nav (wide and compact), after Store Locator when that item is present and after Auction on auction-first. Opens in a new tab. Provisional host is Mintlify at `https://grade10.mintlify.io/`; confirm the host. | Product |
| Global cart | Decided | Once Store launches, Cart stays in the header on every surface (including Auction) to cut checkout friction. Absent only while the Store cart drawer does not answer (auction-first). Cart visibility does not depend on session state — the control follows the answered Store capability, and its activation follows `require-sign-in-from-nav-cart`; rejected hiding Cart from signed-out collectors or making the shared header own the session rule. | Product |
| Cart count meaning | Decided | One per distinct active line, whatever its quantity — the same number as the drawer title. Rejected the quantity total, which counts multiples and unavailable lines, and checkout-eligible lines alone, which drop adjusted lines the drawer still shows. The planning round decided it from the drawer-title match on this page. | Product |
| Cart count updates | Decided | The count refreshes when the member's cart loads, when a cart change finishes, saved or failed, when the drawer opens, and on Retry, with the drawer open or closed; a change made on another device shows after the next of these. Rejected updating only when the drawer opens, and rejected polling or live updates from another device. The planning round decided it from the closed-drawer count on this page. | Product |
| Cart count during a refresh | Decided | The last verified count for the same member stays while a refresh checks the cart, including after a failed cart update, and hides if that check fails. A first count still unknown stays hidden. Rejected hiding a verified count on every refresh, and keeping a failed or another member's count. | Product |
| My Orders label and place | Decided | "My Orders", ahead of My Auctions once Store answers; rejected "Your Orders" (parallels the page title instead of My Auctions naming) and appending after My Auctions, before Sign Out. | Product |
| My Orders gating | Decided | Handler-gated like Cart and search, supplied only once Store answers — the same gate `/profile/orders` and Cart already carry. Rejected keeping it required and always-present regardless of Store: that leaves a menu item pointing at a page gated shut on any build where Store has not answered. | Product |
| My Auction Orders in the menu | Decided | Not offered. A winner opens each order from its Won row on My Auctions; rejected a second orders item beside My Auctions. | Product |
| Profile in the menu | ❓ Open | Two menus are on the table. Profile joins first wherever the account page is carried ([Carried Surfaces](/p/grade10-site/site/carried-surfaces)), so it shows only where that page does and `add-account-profile` opens it with the page; or the menu never offers Profile, and collectors reach the account page through the Account breadcrumbs on My Auctions and the order pages. Recommended: join wherever carried, because the header is the one route that stays put on every surface. | Product (@tangconst) |
| Signed-in email | Decided | The menu shows the sign-in email above the items, in place of an "Account" heading, with the same small initial avatar the bidding panel uses for that address. | Product |
| Membership | ❓ Open | The membership page at `/membership` is carried behind its own gate, as the account page is behind its own ([Carried Surfaces](/p/grade10-site/site/carried-surfaces)). Membership either joins after My Auctions wherever that page is carried, by the rule Profile follows, or waits for the loyalty programme's own launch. Recommended: one rule for both account pages, decided with Profile. | Product (@tangconst) |
:::
