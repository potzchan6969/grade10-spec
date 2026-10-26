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

**Store Locator** — in the header and footer only where the build carries
[Store Locator](/p/grade10-site/store/store-locator), which waits with the
store; auction-first chrome has none

**Shows** — the primary nav lists Shows once the site answers `/shows`,
after Store Locator when that item is present and after Auction on
auction-first, ahead of Index and Help; the header marks it current on
`/shows` and the addresses beneath

**Company column** — the footer lists the company pages the site answers
under a Company column ahead of Help and Legal: About, Shows, Press
Releases, Media Coverage

**Index** — the primary nav lists Index after Shows and ahead of Help,
opening the Grade10 Index hub in a new tab and carrying the external-link
glyph that marks every external primary item; the footer lists the four
index pages under an Index column ahead of Help and Legal: Hat Price
Index, PTCG100, PTCG500, OPCG100

**Copyright** — the footer's bottom bar reads the brand's copyright line in
the page's language, with no year: "© Grade10. All rights reserved." in English,
"© Grade10。保留所有權利。" in Simplified Chinese, "© Grade10。版權所有。" in
Traditional Chinese; on ZZZ, "© ZZZ. All rights reserved."

**Email footers** — every email ends its footer with its brand's copyright line
in the letter's language, with no year, as the site footer does.

## Session

The chrome does not wait for the session. Header and footer render on the first
paint. When the session arrives, the account entry changes between a Sign In
primary button (signed out) and the account icon with its menu (signed in); other
controls do not appear or disappear.

**Before the session answers** - the account entry is a placeholder the size of
the account icon, with nothing to press and nothing read aloud, so a signed-in
collector never sees Sign In first

**First answer only** - the placeholder shows until the session first answers,
and a first read that fails shows Sign In; a later read that fails keeps the
entry already shown, and one that finds a different session changes it

**Controls beside it** - only the account entry's own change in width moves the
language and search controls to its left; the Cart control stays where it is

## Account Menu

**Account menu** - signed in, an avatar sits above the email, above
the items: My Auctions and Sign Out on auction launch; My Orders and My
Auctions once Store answers, with Sign Out always last. KYC stays out.

**Menu avatar** - the image the collector chose on their
[Profile](/p/grade10-site/account/profile), and their email's initial where
they chose none

**Withheld pages** - the menu never offers an item whose page the site
withholds: My Orders, Profile or Membership

**Profile** - first, opening the account page, wherever the account page is
carried - [Carried Surfaces](/p/grade10-site/site/carried-surfaces)

**My Orders** - ahead of My Auctions once Store answers, opening
`/profile/orders`, and omitted until then on the same gate as Cart

**Membership** - after My Auctions wherever the membership page is carried,
by the rule Profile follows; a later change offers it, and until then the
menu leaves it out

**Sign Out on the account page** - the account page offers Sign Out as well,
wherever it is carried

## Help

Primary nav lists Help for auction-only and full nav (wide bar and compact
menu). Help is the last primary item — it follows Index when that item is
present, else Shows, else Store Locator, else Auction. It opens the
documentation site in a new tab.

**Compact menu** — below a 896px-wide container, the leading menu opens a left
inset drawer for primary navigation and utilities; language opens a nested
drawer (not in the compact bar); Account / Sign In and Cart stay in the bar.

## Cart

🚧 **Cart count** - the header shows a member the same active-line count as the
cart drawer title, with the drawer open or closed

🚧 **No count** - an empty or unknown cart shows no count; the Cart control
stays where it is

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

**Cart for anyone** - the Cart control opens the drawer whether or not the
collector is signed in; a guest's drawer and count show the cart this browser
holds - [Cart Drawer](/p/grade10-site/store/cart)

::story{id="site-page-shell-blocks-siteheader-auction-first--signed-out" title="Auction first — signed out"}

::story{id="site-page-shell-blocks-siteheader-auction-first--signed-in" title="Auction first — signed in"}

::story{id="site-page-shell-blocks-siteheader-auction-first--account-menu" title="Auction first — account menu open"}

::story{id="site-page-shell-blocks-siteheader-auction-store-account-menu--open" title="Account menu — Auction & Store"}

::story{id="design-system-layout-nav-layout--narrow" title="Nav — narrow (375px)"}

::story{id="design-system-layout-nav-layout--menu-open" title="Nav — menu open (375px)"}

::story{id="design-system-layout-nav-layout--language-nested" title="Nav — language nested (375px)"}

::story{id="site-page-shell-blocks-siteheader-layout--narrow-signed-out" title="SiteHeader — narrow signed out"}

::story{id="site-page-shell-blocks-siteheader-layout--narrow-pending" title="SiteHeader — narrow pending session"}

::story{id="site-page-shell-blocks-siteheader-auction-store-surfaces--cart-on-auction" title="Cart on Auction"}

::story{id="site-page-shell-blocks-siteheader-auction-store-surfaces--pending" title="Auction & Store — pending session"}

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Collector help | ❓ Open | Help sits in the primary nav (wide and compact), after Store Locator when that item is present and after Auction on auction-first. Opens in a new tab. Provisional host is Mintlify at `https://grade10.mintlify.io/`; confirm the host. | Product |
| Global cart | Decided | Once Store launches, Cart stays in the header on every surface (including Auction) to cut checkout friction. Absent only while the Store cart drawer does not answer (auction-first). Cart visibility does not depend on session state — the control follows the answered Store capability and opens the drawer for a guest too; rejected hiding Cart from signed-out collectors or making the shared header own the session rule. | Product |
| Cart count meaning | Decided | One per distinct active line, whatever its quantity — the same number as the drawer title. Rejected the quantity total, which counts multiples and unavailable lines, and checkout-eligible lines alone, which drop adjusted lines the drawer still shows. The planning round decided it from the drawer-title match on this page. | Product |
| Cart count updates | Decided | The count refreshes when the member's cart loads, when a cart change finishes, saved or failed, when the drawer opens, and on Retry, with the drawer open or closed; a change made on another device shows after the next of these. Rejected updating only when the drawer opens, and rejected polling or live updates from another device. The planning round decided it from the closed-drawer count on this page. | Product |
| Cart count during a refresh | Decided | The last verified count for the same member stays while a refresh checks the cart, including after a failed cart update, and hides if that check fails. A first count still unknown stays hidden. Rejected hiding a verified count on every refresh, and keeping a failed or another member's count. | Product |
| My Orders label and place | Decided | "My Orders", ahead of My Auctions once Store answers; rejected "Your Orders" (parallels the page title instead of My Auctions naming) and appending after My Auctions, before Sign Out. | Product |
| My Orders gating | Decided | Handler-gated like Cart and search, supplied only once Store answers — the same gate `/profile/orders` and Cart already carry. Rejected keeping it required and always-present regardless of Store: that leaves a menu item pointing at a page gated shut on any build where Store has not answered. | Product |
| Profile in the menu | Decided | Profile joins first wherever the account page is carried ([Carried Surfaces](/p/grade10-site/site/carried-surfaces)), so it shows only where that page does and `add-account-profile` opens it with the page. The header is the one route to the account page that stays put on every surface. Rejected never offering Profile, which leaves the Account breadcrumbs on My Auctions and the order pages as the only way in. | Product (@tangconst) |
| Signed-in email | Decided | The menu shows the sign-in email above the items, in place of an "Account" heading, with the same small initial avatar the bidding panel uses for that address. | Product |
| Membership | Decided | Membership joins after My Auctions wherever the membership page at `/membership` is carried ([Carried Surfaces](/p/grade10-site/site/carried-surfaces)), by the rule Profile follows, so the menu never offers an address a lane withholds. A later change offers it. Rejected waiting for the loyalty programme's own launch, which leaves two rules for two gated account pages. | Product (@tangconst) |
| Copyright line | Decided | Every footer, on the site and in every email, reads its brand's copyright line in the page or letter language, with no year. The line comes from the brand's chrome catalog, so a ZZZ footer names ZZZ. Rejected a year, whether fixed or following the clock, and one English line in every language. | Product |
| Before the session answers | Decided | The account entry is a placeholder the size of the account icon, with nothing to press and nothing read aloud, on a written page and in the browser alike, so a signed-in collector never sees Sign In first. Rejected a pill the size of Sign In, which a returning collector would see shrink to the icon, and an announced label, which adds a message in every language. | Product |
| After the first answer | Decided | The placeholder does not come back. A later read keeps the entry already shown, a later read that fails keeps it too, and one that returns no session shows Sign In. Rejected showing the placeholder on every re-read, which turns a signed-out visitor's Sign In into the placeholder each time they return to the tab, and Sign In on any failed later read, which a signed-in collector on a weak connection would see. | Product |
| A read that never answers | Decided | A first read that fails shows Sign In. The site sets no timer; the transport ends every read of the session two minutes after it starts, as a failed read, so no wait on it lasts for ever. Rejected a site timer, which could show Sign In to a slow but healthy read, no deadline, and a limit at each wait. | Product |
| Controls beside the account entry | Decided | Only the language and search controls on the wide header move, by the change in the account entry's width; primary navigation, Cart and the compact bar stay. Rejected reserving Sign In's width, which would show the account icon in a wider space. | Product |
| Company pages in the chrome | Decided | Shows joins the primary nav ahead of Index and Help — after Store Locator when present, after Auction on auction-first — and the header marks it current on `/shows` and beneath; About, Shows, Press Releases and Media Coverage form the footer's Company column ahead of Help and Legal. Rejected primary-nav seats for the three corporate pages — the bar stays task surfaces — and a grouped nav item, which the flat item list does not carry. | Product (@tangconst) |
| Index entry points | Decided | A single external Index item joins the primary nav after Shows, ahead of Help, opening the `index.grade10.com` hub in a new tab; the footer's Index column carries all four index pages — Hat Price Index, PTCG100, PTCG500, OPCG100 — each external. External primary items carry the arrow-up-right glyph after their label as the new-tab cue — Index and Help alike. Rejected four nav seats or a grouped item — the bar stays flat — and the Company column, since Index is a product, not a company page. | Product (@tangconst) |
:::
