# grade10-site/site/page-shell Specification

## Purpose
What every page of the grade10 site is wrapped in: the header a collector
navigates from, the region a surface renders into, and the footer that closes
the page. One shell for the marketing page, the store, the auction, the
profile, sign-in, and not-found, so no surface can ship without the site around
it.

## Feature set

- Shell around every surface
  - Header, region, footer: one wrapper the site renders every surface into,
    not-found included
  - Landmark structure: exactly one banner, one main, and one contentinfo on
    the page, with the surface inside main
  - No opinion on content: the shell adds no heading, copy, or spacing of its
    own to what a surface renders
- Session-independent chrome
  - Chrome before the session: the header and the footer render before the
    session has resolved
  - Stable layout: no chrome control appears, disappears, or moves when the
    session arrives
- Account control
  - Session-aware entry: a primary Sign In button when signed out, the
    account icon when signed in
  - Account menu: signed in, the icon opens Profile, My Auctions, and Sign
    out; My Orders joins between Profile and My Auctions once Store answers;
    the profile also offers Sign out
- Members-only cart
  - Sign-in before the cart: the Cart control opens sign-in while no session
    is signed in, and the drawer stays closed
  - The cart the ask was for: the drawer opens by itself once the session
    arrives, and nothing is left waiting when the ask is dismissed
  - Active-line count: header and drawer agree without opening the drawer; unknown and signed-out counts stay hidden
- Links only to real surfaces
  - Controls with surfaces behind them: search and cart stay absent until the
    site answers them
  - Reachable links only: a navigation, utility, footer, or legal link appears
    only when its destination exists, except primary-nav Help may name the
    documentation host Product names
  - Current-surface marking: the navigation item owning the current address is
    marked, and none is when no item owns it
- Collector help
  - Header Help: primary nav lists Help after Store Locator when that item is
    present, and after Auction on auction-only nav; Help opens the
    documentation site in a new tab
- Small-width resilience
  - No horizontal overflow: the shell reflows at 375 CSS pixels with every
    control still reachable

## Requirements

### Requirement: Every surface renders inside the shell

The site SHALL render the header above and the footer below every surface it
answers, including not-found and the state while the session is resolving. A
surface SHALL render into a single content region between them.

The shell SHALL hold no opinion about what a surface renders inside that
region.

<!-- trace:scenario id=g10.site-page-shell.SC-tme rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-01 - Every address is wrapped
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **WHEN** a collector opens any address the site answers, including one it
  does not recognize
- **THEN** the header and the footer are present, with the surface between them

<!-- trace:scenario id=g10.site-page-shell.SC-qm2 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-02 - The shell is not a page
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **WHEN** a surface renders inside the content region
- **THEN** the shell adds no heading, no copy, and no spacing decision of its
  own to that surface's content

<!-- trace:scenario id=g10.site-page-shell.SC-kxh rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-03 - The page has one of each landmark
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **WHEN** any surface renders
- **THEN** the page carries exactly one banner, one main, and one contentinfo
  landmark, and the surface's content is inside main

### Requirement: The chrome does not wait for the session

The site SHALL render the header and the footer before the session has
resolved. The account entry's presentation and destination SHALL depend on the
session: signed out shows a primary Sign In button; signed in shows the account
icon that opens the account menu. What the Cart control opens and whether its
count badge appears SHALL depend on the session too, and nothing else in the
chrome SHALL. No chrome control SHALL appear, disappear, or move when the
session arrives. The cart count badge SHALL NOT change the presence or
position of the Cart control.

<!-- trace:scenario id=g10.site-page-shell.SC-9ud rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-04 - A first paint while the session resolves
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

<!-- trace:scenario id=g10.site-page-shell.SC-yxt rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-05 - No layout shift when the session arrives
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **GIVEN** a page rendered while the session was resolving
- **WHEN** the session resolves
- **THEN** the account entry matches the session (Sign In when signed out,
  account icon when signed in)
- **AND** no other chrome control appears, disappears, or moves
- **AND** a cart count badge that later appears for a signed-in member leaves
  the Cart control where it was

### Requirement: The account control leads where the collector can go

The site SHALL show an account entry in the header at all times once the
session has resolved. When the collector is signed out, it SHALL be a primary
Sign In button that leads to sign-in. When the collector is signed in, it SHALL
be the account icon that opens the account menu.

Signing out SHALL be offered from the account menu and on the profile.

<!-- trace:scenario id=g10.site-page-shell.SC-m3w rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-06 - Signed in
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** the account menu opens

<!-- trace:scenario id=g10.site-page-shell.SC-0ao rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-07 - Signed out
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a collector who is not signed in
- **WHEN** they activate Sign In
- **THEN** they arrive at sign-in

<!-- trace:scenario id=g10.site-page-shell.SC-e9z rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-08 - Sign-out has one home
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **WHEN** any surface renders for a signed-in collector
- **THEN** the account menu offers Sign out
- **AND** the profile offers Sign out

### Requirement: The header shows only controls this site has surfaces for

The site SHALL supply the header a handler only for a control whose surface it
answers, so a control with nothing behind it does not render. Once the site
answers the Store cart drawer, Cart SHALL appear on every surface, including
Auction and other non-Store pages. Until then, Cart SHALL remain absent.
Search SHALL NOT appear until the site answers it. Until Store answers as a
navigable surface, the primary navigation SHALL omit Store.

The locale control SHALL switch language among the brand's locales; it SHALL
NOT switch currency. On a wide viewport the language control SHALL appear in
the header bar. On a narrow viewport language SHALL be reachable from the
compact menu's nested language drawer. The account entry SHALL remain in the
bar at both widths once the session has resolved.

<!-- trace:scenario id=g10.site-page-shell.SC-ovr rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-09 - Absent surfaces are absent controls
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **GIVEN** the site does not yet answer the Store cart drawer
- **WHEN** the header renders
- **THEN** the account entry is in the bar
- **AND** language is reachable (in the bar on a wide viewport; from the
  compact menu on a narrow viewport)
- **AND** no Store navigation item appears when Store does not answer
- **AND** no search or cart control appears

<!-- trace:scenario id=g10.site-page-shell.SC-ql0 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-16 - Cart is global once Store answers
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **GIVEN** the site answers the Store cart drawer, and a collector on any
  surface including Auction
- **WHEN** the header renders
- **THEN** the Cart control appears
- **AND** no search control appears

<!-- trace:scenario id=g10.site-page-shell.SC-ond rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-19 - Language switch, not currency
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the header's locale control is interactive
- **THEN** its options are the brand's languages
- **AND** none of its options is a currency

### Requirement: A link is present only when the site answers it

The site SHALL show a navigation, footer, or legal link only when its
destination is an address the site answers, except primary-nav Help which MAY
name the documentation host Product names. A destination that does not exist
yet SHALL be omitted rather than linked to a not-found page.

Utility links SHALL follow the same rule for destinations on this site. An
unanswered site utility destination SHALL stay omitted. The promotional bar
SHALL wait for a page the site answers.

<!-- trace:scenario id=g10.site-page-shell.SC-7p3 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-10 - Navigation lists real surfaces
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the header renders
- **THEN** every navigation item other than Help leads to a surface the site
  answers
- **AND** Help, when present, leads to the documentation host Product names

<!-- trace:scenario id=g10.site-page-shell.SC-fmx rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-11 - The footer drops what it cannot reach
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the footer renders
- **THEN** every link leads to a surface the site answers, and a column left
  with no reachable link is absent entirely

<!-- trace:scenario id=g10.site-page-shell.SC-cex rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-12 - The promo bar and utility row wait for their pages
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the header renders and the site answers none of its on-site utility
  destinations
- **THEN** neither the promotional bar nor the utility row appears

### Requirement: The header marks the surface being viewed

The site SHALL mark the navigation item matching the current surface, and
SHALL mark none when the current address belongs to no navigation item.

<!-- trace:scenario id=g10.site-page-shell.SC-q3w rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-13 - A collector is on a listed surface
**Serves:** grade10-site-site-page-shell-US-05 - Collector locates the current surface in the navigation

- **GIVEN** a collector on a surface the navigation lists, or on any address beneath it
- **WHEN** the header renders
- **THEN** that navigation item is marked as the current page

<!-- trace:scenario id=g10.site-page-shell.SC-xiu rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-14 - A collector is on an unlisted surface
**Serves:** grade10-site-site-page-shell-US-05 - Collector locates the current surface in the navigation

- **GIVEN** a collector on the profile, sign-in, or an unrecognized address
- **WHEN** the header renders
- **THEN** no navigation item is marked as the current page

### Requirement: The shell stays usable at small widths

The site SHALL render the shell without horizontal overflow at a viewport 375
CSS pixels wide, on every surface. Chrome and content SHALL reflow rather than
be clipped, and every control SHALL remain reachable.

<!-- trace:scenario id=g10.site-page-shell.SC-o0j rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-15 - A narrow viewport
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** any surface renders
- **THEN** the page scrolls vertically only, with no content clipped and no
  control unreachable

### Requirement: Help opens the documentation site from the header

Help sits in the primary navigation and opens the documentation site in a new
tab.

**Header Help** - The site SHALL list Help in the primary navigation on a wide
viewport, and in the compact menu drawer on a narrow viewport, whenever the
primary navigation is auction-only or includes Store and other answered
surfaces.

**Its place** - When Store Locator is present in the primary navigation, Help
SHALL follow it; on auction-only primary navigation, Help SHALL follow Auction.

**Presentation** - Help SHALL use the same primary-nav link presentation as
other primary items.

**New tab** - Activating Help SHALL open the documentation site Product names
in a new browsing context. The current site surface SHALL remain open.

**Isolated from the opener** - Help SHALL use the shared chrome's external link
behaviour so the new tab is isolated from the opener.

<!-- trace:scenario id=g10.site-page-shell.SC-o1e rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-25 - Help on auction-only and full nav
**Serves:** grade10-site-site-page-shell-US-07 - Collector opens Help from the header

- **GIVEN** a wide viewport and a header whose primary nav is auction-only, or
  one that also lists Store and other answered surfaces
- **WHEN** the header renders
- **THEN** Help appears in the primary navigation after Auction on auction-only
  nav, or after Store Locator when that item is present
- **AND** activating it opens the documentation site in a new browsing context

<!-- trace:scenario id=g10.site-page-shell.SC-53q rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-26 - Help in the compact menu
**Serves:** grade10-site-site-page-shell-US-07 - Collector opens Help from the header

- **GIVEN** a viewport 375 CSS pixels wide with Help supplied in primary nav
- **WHEN** the collector opens the header menu
- **THEN** Help is reachable in the drawer among the primary items after Auction
  on auction-only nav, or after Store Locator when that item is present
- **AND** activating it opens the documentation site in a new browsing context

### Requirement: Signed-in collectors open account destinations from the header menu

The account control of a signed-in collector opens a menu of destinations.

**The menu** - When the collector is signed in, activating the account
control SHALL open a menu that shows their sign-in email with its small
initial avatar above the items, falling back to the account label when no
email is available. The menu SHALL offer My Auctions and Sign Out. Where the
profile is carried, Profile SHALL join first. Once Store answers, the menu
SHALL also offer My Orders, between Profile and My Auctions where Profile is
offered, or otherwise before My Auctions, and Membership after My Auctions.
Until Store answers, the menu SHALL NOT offer My Orders or Membership.

**Each item** - Activating Profile, where it is offered, SHALL take them to
the profile. Activating My Orders, where it is offered, SHALL take them to
My Orders. Activating My Auctions SHALL take them to My Auctions. Activating
Membership, where it is offered, SHALL invoke Membership's handler and SHALL
NOT navigate to a membership address the site withholds. Activating Sign Out
SHALL start sign-out.

**Sign Out label** - The menu's sign-out item SHALL read "Sign Out".

**Not offered** - The menu SHALL NOT offer KYC until it is in scope for the
header.

**Profile sign-out** - Wherever the profile is carried, it SHALL continue to
offer sign-out as well.

<!-- trace:scenario id=g10.site-page-shell.SC-y2l rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-17 - Account menu lists auction-first destinations
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu once Store answers

- **GIVEN** a signed-in collector, the profile is carried, and Store answers
- **WHEN** they activate the account control
- **THEN** the menu shows their sign-in email with its small initial avatar above the items
- **AND** the menu offers Profile, My Orders, My Auctions, Membership, and Sign Out, in that order
- **AND** the menu does not offer KYC

<!-- trace:scenario id=g10.site-page-shell.SC-04a rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-18 - Sign out from the menu
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign Out
- **THEN** sign-out starts
- **AND** the profile still offers sign-out when they are signed in

<!-- trace:scenario id=g10.site-page-shell.SC-u71 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-27 - Account menu omits My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu before Store answers

- **GIVEN** a signed-in collector, the profile is carried, and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu shows their sign-in email with its small initial avatar above the items
- **AND** the menu offers Profile, My Auctions, and Sign Out, in that order
- **AND** the menu does not offer My Orders or Membership

<!-- trace:scenario id=g10.site-page-shell.SC-agf rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-28 - Account menu omits Profile once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is not carried, and Store answers
- **WHEN** they activate the account control
- **THEN** the menu offers My Orders, My Auctions, Membership, and Sign Out
- **AND** the menu does not offer Profile

<!-- trace:scenario id=g10.site-page-shell.SC-n9c rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-29 - Account menu omits Profile and My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is not carried, and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu offers My Auctions and Sign Out
- **AND** the menu does not offer Profile, My Orders, or Membership

<!-- trace:scenario id=g10.site-page-shell.SC-3y1 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-30 - Account menu shows the sign-in email and avatar
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector with a sign-in email
- **WHEN** they activate the account control
- **THEN** the menu shows their sign-in email with its small initial avatar above the items

<!-- trace:scenario id=g10.site-page-shell.SC-qby rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-31 - Account menu falls back to the account label without a sign-in email
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector whose sign-in email is not available
- **WHEN** they activate the account control
- **THEN** the menu shows the account label above the items in place of an email

<!-- trace:scenario id=g10.site-page-shell.SC-q9i rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-32 - Account menu offers Membership after My Auctions once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - reaching Membership from the same menu once Store answers

- **GIVEN** a signed-in collector and Store answers
- **WHEN** they activate the account control
- **THEN** Membership appears after My Auctions and before Sign Out

<!-- trace:scenario id=g10.site-page-shell.SC-m6b rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-33 - Sign Out reads in Title Case
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they view the menu
- **THEN** the last item reads "Sign Out"

<!-- trace:scenario id=g10.site-page-shell.SC-x1n rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-34 - Activating Membership invokes its handler without a withheld route
**Serves:** grade10-site-site-page-shell-US-03 - reaching Membership from the same menu once Store answers

- **GIVEN** a signed-in collector, Store answers, and Membership is offered
- **WHEN** they activate Membership
- **THEN** the supplied Membership handler is invoked
- **AND** the browser does not navigate to a membership address the site withholds

### Requirement: Compact viewports reach navigation through the menu drawer

On a narrow viewport the bar keeps the account and cart, and the menu drawer
holds the rest.

**In the bar** - At a viewport 375 CSS pixels wide, the site SHALL keep Account
/ Sign In and Cart (when answered) reachable in the header bar.

**In the drawer** - Primary navigation, utility links, and search (when
answered) SHALL be reachable from the left menu drawer.

**Language** - Language SHALL be reachable through a nested drawer opened from
that menu.

**Gutter** - The menu panel SHALL leave a visible gutter rather than spanning
the full viewport.

**No currency switch** - The shell SHALL NOT rely on a currency switch.

<!-- trace:scenario id=g10.site-page-shell.SC-oq6 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-20 - Compact menu reaches nav and language
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** the collector opens the header menu
- **THEN** primary navigation is reachable in the drawer
- **AND** language options are reachable from a nested drawer
- **AND** the account entry remains in the bar
- **AND** the menu panel leaves a visible gutter beside the viewport edge

### Requirement: The Cart control asks for sign-in before it opens the cart

While no session is signed in, activating the Cart control SHALL open the
site's sign-in dialog and SHALL NOT open the cart drawer. A session that is
still resolving counts as none, so the control asks.

When sign-in succeeds and the collector remains on the surface they asked
from, the site SHALL open the cart drawer they pressed for. When they dismiss
the dialog without signing in, they SHALL remain signed out with no drawer
open, and the site SHALL NOT open one later.

While a session is signed in, activating the Cart control SHALL open the cart
drawer.

<!-- trace:scenario id=g10.site-page-shell.SC-g63 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-21 - A signed-out collector presses Cart
**Serves:** grade10-site-site-page-shell-US-06 - Collector opens their cart from the header

- **GIVEN** a signed-out collector on a surface whose header offers Cart
- **WHEN** they activate the Cart control
- **THEN** the sign-in dialog opens over the surface
- **AND** the cart drawer does not open

<!-- trace:scenario id=g10.site-page-shell.SC-ew2 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-22 - Sign-in opens the cart they asked for
**Serves:** grade10-site-site-page-shell-US-06 - Collector opens their cart from the header

- **GIVEN** a signed-out collector who opened sign-in from the Cart control
- **WHEN** they sign in successfully and remain on that surface
- **THEN** the cart drawer opens
- **AND** the sign-in dialog is closed

<!-- trace:scenario id=g10.site-page-shell.SC-d19 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-23 - Dismissing sign-in opens nothing
**Serves:** grade10-site-site-page-shell-US-06 - Collector opens their cart from the header

- **GIVEN** a signed-out collector who opened sign-in from the Cart control
- **WHEN** they dismiss the dialog without signing in
- **THEN** they remain signed out on that surface
- **AND** no cart drawer is open

<!-- trace:scenario id=g10.site-page-shell.SC-tj7 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-24 - A member presses Cart
**Serves:** grade10-site-site-page-shell-US-06 - Collector opens their cart from the header

- **GIVEN** a signed-in collector on a surface whose header offers Cart
- **WHEN** they activate the Cart control
- **THEN** the cart drawer opens
- **AND** no sign-in dialog opens

### Requirement: The header shows the member cart's reviewed active-line count

On every surface whose header offers Cart, the site SHALL supply the header
and drawer title with the same active-line count from the current member's
reviewed basket. Each distinct active line SHALL count once, irrespective of
quantity. Active lines include `default` and `adjusted` lines and exclude
`soldOut` and `unavailable` lines. Checkout eligibility alone SHALL NOT
determine the count.

The header SHALL show the full positive count in wide and compact layouts.
It SHALL show no count badge when the reviewed basket has no active lines.
The count SHALL NOT introduce a Cart control on a surface that omits it.

<!-- trace:scenario id=g10.site-page-shell.SC-6jx rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-42 - Active lines count once
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector on a surface whose header offers Cart
- **AND** their reviewed basket has a `default` line with quantity `3`, an
  `adjusted` line with quantity `2`, a `soldOut` line, and an `unavailable` line
- **WHEN** the header displays the reviewed count
- **THEN** the header badge displays `2`
- **AND** the drawer title displays `2` when showing that same reviewed basket

<!-- trace:scenario id=g10.site-page-shell.SC-awn rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-43 - No active lines means no badge
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector on a surface whose header offers Cart
- **WHEN** their basket review succeeds with an empty basket or only sold-out
  and unavailable lines
- **THEN** the header has no count badge
- **AND** the Cart control remains available

<!-- trace:scenario id=g10.site-page-shell.SC-8v4 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-44 - The full count survives a compact header
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose reviewed basket has `50` active lines
- **WHEN** a surface whose header offers Cart renders at a wide viewport or
  at `375` CSS pixels wide
- **THEN** its Cart badge displays `50`, without truncation
- **AND** the Cart control remains reachable without horizontal overflow

<!-- trace:scenario id=g10.site-page-shell.SC-e9p rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-45 - A count does not add an unanswered Cart control
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** an auction-first build, whose header offers no Cart because Store
  does not answer the cart drawer
- **WHEN** a signed-in member whose cart holds active lines opens any surface
- **THEN** the header displays neither a Cart control nor its count badge

<!-- trace:scenario id=g10.site-page-shell.SC-rae rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-55 - The count follows the collector to another surface
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose Store header shows `2` active lines
- **WHEN** they move to Auction, whose header offers Cart once Store answers
- **THEN** the Auction header's Cart badge displays `2`
- **AND** showing it needs neither a new review nor opening the drawer

### Requirement: The cart count refreshes without opening the drawer

The site SHALL review the member's basket on cart hydration and after settled
cart mutations, with the drawer open or closed, and when the drawer opens and
on retry after a failed review. Once review succeeds, the header SHALL reflect
that reviewed basket without requiring the collector to open the drawer.

Before the member has a verified count, pending hydration or review SHALL
show no badge. During a later review for the same member, the header SHALL
retain that member's last verified count until the review completes, including
when the refresh follows a failed cart update. A failed review SHALL hide the
badge; a successful review SHALL replace it with the newly verified count.
The header SHALL NOT show a badge skeleton or invent a count from unreviewed lines.

The site SHALL NOT poll for, or subscribe to, cart changes made elsewhere.
A change made on another device SHALL appear after the next review.

<!-- trace:scenario id=g10.site-page-shell.SC-r0e rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-46 - Hydration supplies the count with the drawer closed
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose cart has not finished hydration
- **AND** the cart drawer stays closed
- **WHEN** hydration and basket review complete with `2` active lines
- **THEN** the header badge displays `2` without opening the drawer

<!-- trace:scenario id=g10.site-page-shell.SC-7el rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-47 - Settled mutations refresh the closed drawer's count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector with `2` reviewed active lines
- **AND** the cart drawer is closed
- **WHEN** a cart mutation settles and the resulting basket is reviewed
- **THEN** adding a distinct active line changes the header count to `3`
- **AND** removing one of the original active lines instead changes it to `1`
- **AND** changing only an active line's quantity instead keeps it at `2`
- **AND** none of these outcomes requires opening the drawer

<!-- trace:scenario id=g10.site-page-shell.SC-mzr rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-48 - An unknown count has no badge
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a surface whose header offers Cart
- **WHEN** the current member has no verified count and cart hydration or
  basket review is pending
- **THEN** the header displays no count badge or badge skeleton
- **AND** the Cart control remains available in the same position

<!-- trace:scenario id=g10.site-page-shell.SC-79p rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-49 - Failed review clears the count until review succeeds
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose header showed `2` active lines
- **WHEN** review of their current basket fails
- **THEN** the header displays no count badge
- **AND** a later review, on opening the drawer or on retry, that succeeds
  with `1` active line restores a badge displaying `1`
- **AND** the Cart control stays available throughout

<!-- trace:scenario id=g10.site-page-shell.SC-k7b rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-53 - Same-member refresh retains the verified count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** the current member's header shows a verified count of `2`
- **WHEN** another review starts, including after a failed cart update
- **THEN** the badge keeps showing `2` while that review is pending
- **AND** a successful review replaces it with the resulting active-line count
- **AND** a failed review hides the badge instead
- **AND** switching members or signing out still clears the count immediately

<!-- trace:scenario id=g10.site-page-shell.SC-o8b rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-54 - A change from another device shows after the next review
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in collector whose header shows `2` active lines
- **AND** the same member adds a distinct line from another device
- **WHEN** no review of the basket runs on this device
- **THEN** the header keeps showing `2`
- **AND** opening the drawer reviews the basket, and the header and the drawer
  title both display `3`

### Requirement: The cart count belongs only to the current member

The site SHALL omit the count while the session is unresolved or signed out.
When session ownership changes, it SHALL clear the previous member's count
immediately and await the current member's reviewed basket. A late response
for a previous session SHALL NOT restore or replace the current count.

<!-- trace:scenario id=g10.site-page-shell.SC-b9m rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-50 - Signed-out and unresolved sessions have no count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a surface whose header offers Cart
- **WHEN** its session is unresolved or signed out
- **THEN** the header displays no count badge
- **AND** the Cart control remains available under its existing sign-in rule

<!-- trace:scenario id=g10.site-page-shell.SC-z8c rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-51 - Signing out clears the previous member's count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a signed-in member whose header displays `2` active lines
- **WHEN** they sign out
- **THEN** the badge disappears immediately
- **AND** a late basket response from that signed-in session cannot restore it

<!-- trace:scenario id=g10.site-page-shell.SC-kfr rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-52 - Another member never inherits a count
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** member A's header showed `2` active lines and their review is pending
- **WHEN** session ownership changes to member B
- **THEN** the header omits the badge until member B's own basket is reviewed
- **AND** a successful review of B's basket with `1` active line displays `1`
- **AND** a late response from A cannot replace B's count before or after that review
