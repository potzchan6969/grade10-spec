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
  - Stable layout: no chrome control appears or disappears when the session
    arrives; only the account entry's own change in width moves the language
    and search controls on the wide header
  - Account placeholder: until the session first answers, the account entry
    is a placeholder the size of the account icon, with nothing to press; a
    first read that fails shows Sign In, and a later read keeps the entry
    shown unless it finds a different session
- Account control
  - Session-aware entry: a primary Sign In button when signed out, the
    account icon when signed in
  - Account menu: signed in, the sign-in email with its avatar - the profile
    image, else the email's initial - above My Auctions and Sign Out; Profile
    joins first wherever the account page is carried, and My Orders ahead of
    My Auctions once Store answers; Sign Out stays last; KYC and any item whose
    page the site withholds stay out
  - Account page sign-out: the account page offers Sign Out wherever it is
    carried
- Cart for anyone
  - One press to the cart: the Cart control opens the drawer whether or not a
    session is signed in, on a member's cart or the cart this browser holds
  - Active-line count: header and drawer agree without opening the drawer; an
    unknown count stays hidden
- Links only to real surfaces
  - Controls with surfaces behind them: search and cart stay absent until the
    site answers them
  - Reachable links only: a navigation, utility, footer, or legal link appears
    only when its destination exists; the exceptions are the named external
    entries — primary-nav Help naming the documentation host, and primary-nav
    Index and the footer Index column naming the Grade10 Index hosts
  - Current-surface marking: the navigation item owning the current address is
    marked, and none is when no item owns it
- Company pages in the chrome
  - Primary-nav Shows: the primary navigation lists Shows once the site
    answers `/shows`, ahead of Index and Help; the item marks current on
    `/shows` and the addresses beneath
  - Footer Company column: the footer lists the company pages the site
    answers under a Company column ahead of Help and Legal: About, Shows,
    Press Releases, Media Coverage
- Index pages in the chrome
  - Primary-nav Index: the primary navigation lists Index ahead of Help,
    after Shows and the physical destinations; the item opens the Grade10
    Index hub in a new tab, carries the external-link glyph, and is never
    marked current
  - Footer Index column: the footer lists the four index pages under an
    Index column ahead of Help and Legal — Hat Price Index, PTCG100,
    PTCG500, OPCG100 — each opening its external page in a new tab
- Collector help
  - Header Help: primary nav lists Help last — after Index when that item
    is present, else Shows, else Store Locator, else Auction on auction-only
    nav; Help opens the documentation site in a new tab
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
session: before it first answers the account entry is the placeholder; signed
out shows a primary Sign In button; signed in shows the account icon that opens
the account menu. Whose cart the Cart control opens and counts SHALL depend on
the session too, and nothing else in the chrome SHALL.

When the session arrives, no other chrome control SHALL appear or disappear.
The only controls that SHALL move are those to the account entry's left - the
language control, and search where the site answers it, on the wide header -
and only by the account entry's own change in width. The Cart control SHALL
NOT move. The cart count badge SHALL NOT change the presence or position of
the Cart control.

<!-- trace:scenario id=g10.site-page-shell.SC-9ud rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-04 - A first paint while the session resolves
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

<!-- trace:scenario id=g10.site-page-shell.SC-yxt rev=3 -->
#### Scenario: grade10-site-site-page-shell-SC-05 - No layout shift when the session arrives
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **GIVEN** a page rendered while the session was resolving
- **WHEN** the session resolves
- **THEN** the account entry matches the session (Sign In when signed out,
  account icon when signed in), in the placeholder's place
- **AND** no other chrome control appears or disappears
- **AND** the Cart control stays where it was
- **AND** on a wide viewport the language control, and search where the site
  answers it, move left by the account entry's change in width: not at all
  for the account icon, and by Sign In's width less 40 CSS pixels for Sign In
- **AND** every other control, the primary navigation and the compact bar's
  controls included, stays where it was
- **AND** a cart count badge that later appears for a signed-in member leaves
  the Cart control where it was

### Requirement: The account control leads where the collector can go

The site SHALL show an account entry in the header at all times once the
session has resolved. When the collector is signed out, it SHALL be a primary
Sign In button that leads to sign-in. When the collector is signed in, it SHALL
be the account icon that opens the account menu.

Signing out SHALL be offered from the account menu, and on the account page
wherever the site carries it.

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

<!-- trace:scenario id=g10.site-page-shell.SC-e9z rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-08 - Sign-out has one home
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector on a build that carries the account page
- **WHEN** they open the account menu, and then the account page
- **THEN** the account menu offers Sign Out
- **AND** the account page offers Sign Out

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
destination is an address the site answers. The named external entries are
the exceptions: primary-nav Help MAY name the documentation host Product
names, and primary-nav Index and the footer Index column MAY name the
Grade10 Index hosts. A destination that does not exist yet SHALL be omitted
rather than linked to a not-found page.

Utility links SHALL follow the same rule for destinations on this site. An
unanswered site utility destination SHALL stay omitted. The promotional bar
SHALL wait for a page the site answers.

<!-- trace:scenario id=g10.site-page-shell.SC-7p3 rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-10 - Navigation lists real surfaces
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the header renders
- **THEN** every navigation item other than Help and Index leads to a surface
  the site answers
- **AND** Help, when present, leads to the documentation host Product names
- **AND** Index, when present, leads to the Grade10 Index hub

<!-- trace:scenario id=g10.site-page-shell.SC-fmx rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-11 - The footer drops what it cannot reach
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the footer renders
- **THEN** every internal link leads to a surface the site answers, the Index
  column's links lead to their external index pages, and a column left with
  no reachable link is absent entirely

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

<!-- trace:scenario id=g10.site-page-shell.SC-xiu rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-14 - A collector is on an unlisted surface
**Serves:** grade10-site-site-page-shell-US-05 - Collector locates the current surface in the navigation

- **GIVEN** a collector on the account page, sign-in, or an unrecognized address
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

**Its place** - Help SHALL be the last primary-navigation item: it SHALL
follow Index when that item is present, else Shows, else Store Locator when
that item is present, else Auction on auction-only primary navigation.

**Presentation** - Help SHALL use the same primary-nav link presentation as
other primary items, carrying the shared external-link glyph after its
label like every external primary item.

**New tab** - Activating Help SHALL open the documentation site Product names
in a new browsing context. The current site surface SHALL remain open.

**Isolated from the opener** - Help SHALL use the shared chrome's external link
behaviour so the new tab is isolated from the opener.

<!-- trace:scenario id=g10.site-page-shell.SC-o1e rev=3 -->
#### Scenario: grade10-site-site-page-shell-SC-25 - Help on auction-only and full nav
**Serves:** grade10-site-site-page-shell-US-07 - Collector opens Help from the header

- **GIVEN** a wide viewport and a header whose primary nav is auction-only, or
  one that also lists Store and other answered surfaces
- **WHEN** the header renders
- **THEN** Help appears as the last item in the primary navigation — after
  Index when that item is present, else Shows, else Store Locator when
  present, else Auction on auction-only nav
- **AND** activating it opens the documentation site in a new browsing context

<!-- trace:scenario id=g10.site-page-shell.SC-53q rev=3 -->
#### Scenario: grade10-site-site-page-shell-SC-26 - Help in the compact menu
**Serves:** grade10-site-site-page-shell-US-07 - Collector opens Help from the header

- **GIVEN** a viewport 375 CSS pixels wide with Help supplied in primary nav
- **WHEN** the collector opens the header menu
- **THEN** Help is reachable in the drawer as the last primary item — after
  Index when that item is present, else Shows, else Store Locator when
  present, else Auction on auction-only nav
- **AND** activating it opens the documentation site in a new browsing context

### Requirement: Index opens the Grade10 Index hub from the header

Index sits in the primary navigation and opens the Grade10 Index hub in a
new tab.

**Header Index** - The site SHALL list Index in the primary navigation on a
wide viewport, and in the compact menu drawer on a narrow viewport. It SHALL
follow Shows and the physical destinations and SHALL precede Help.

**Hub, not pages** - The primary-nav Index item SHALL name the Grade10 Index
hub, from which the individual index pages are reached. The four index
pages SHALL be listed directly only in the footer Index column, ahead of
Help and Legal.

**New tab** - Activating Index, in the navigation or the footer, SHALL open
its external destination in a new browsing context. The current site surface
SHALL remain open.

**Presentation** - Index SHALL use the same primary-nav link presentation as
other primary items, carrying the shared external-link glyph after its
label — the mark every external primary item, Help included, wears.

**Never current** - Index names no surface this site answers, so it SHALL
NOT be marked current on any surface.

<!-- trace:scenario id=g10.site-page-shell.SC-ixn rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-27 - Index in the primary nav
**Serves:** grade10-site-site-page-shell-US-07 - Collector opens Help from the header

- **GIVEN** a header whose primary nav lists Index
- **WHEN** the header renders on a wide viewport, or the compact menu opens
  on a narrow viewport
- **THEN** Index appears after Shows and before Help
- **AND** activating it opens the Grade10 Index hub in a new browsing
  context
- **AND** Index carries the external-link glyph after its label, as Help
  does
- **AND** Index is never the current item

<!-- trace:scenario id=g10.site-page-shell.SC-ixf rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-28 - Index in the footer
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the footer renders
- **THEN** an Index column lists Hat Price Index, PTCG100, PTCG500, and
  OPCG100 ahead of Help and Legal
- **AND** each link opens its external index page in a new browsing context

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

### Requirement: The Cart control opens the cart for anyone

Activating the Cart control SHALL open the cart drawer and SHALL NOT ask for
sign-in. A signed-in member's drawer SHALL show their cart; a signed-out
collector's drawer SHALL show the cart this browser holds.

<!-- trace:scenario id=g10.site-page-shell.SC-g63 rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-21 - A signed-out collector presses Cart
**Serves:** grade10-site-site-page-shell-US-06 - Collector opens their cart from the header

- **GIVEN** a signed-out collector on a surface whose header offers Cart, and
  a line in the cart this browser holds
- **WHEN** they activate the Cart control
- **THEN** the cart drawer opens and shows that line
- **AND** no sign-in dialog opens

<!-- trace:scenario id=g10.site-page-shell.SC-tj7 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-24 - A member presses Cart
**Serves:** grade10-site-site-page-shell-US-06 - Collector opens their cart from the header

- **GIVEN** a signed-in collector on a surface whose header offers Cart
- **WHEN** they activate the Cart control
- **THEN** the cart drawer opens
- **AND** no sign-in dialog opens

### Requirement: The header shows the current cart's reviewed active-line count

On every surface whose header offers Cart, the site SHALL supply the header
and drawer title with the same active-line count from the current cart's
reviewed basket: the signed-in member's, or the cart this browser holds.
Each distinct active line SHALL count once, irrespective of quantity. Active
lines include `default` and `adjusted` lines and exclude `soldOut` and
`unavailable` lines. Checkout eligibility alone SHALL NOT
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

The site SHALL review the current basket on cart hydration and after settled
cart mutations, with the drawer open or closed, and when the drawer opens and
on retry after a failed review. Once review succeeds, the header SHALL reflect
that reviewed basket without requiring the collector to open the drawer.

Before the current cart has a verified count, pending hydration or review
SHALL show no badge. During a later review of the same cart, the header SHALL
retain that cart's last verified count until the review completes, including
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

### Requirement: The cart count belongs only to the current cart

The site SHALL omit the count while the session is unresolved. A signed-out
collector's count SHALL be that of the cart this browser holds. When session
ownership changes, the site SHALL clear the previous count immediately and
await the current cart's reviewed basket. A late response for a previous
session SHALL NOT restore or replace the current count.

<!-- trace:scenario id=g10.site-page-shell.SC-b9m rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-50 - An unresolved session has no count, and a guest counts this browser's cart
**Serves:** grade10-site-site-page-shell-US-08 - Collector sees the cart count without opening the drawer

- **GIVEN** a surface whose header offers Cart, and `2` active lines in the
  cart this browser holds
- **WHEN** its session is unresolved
- **THEN** the header displays no count badge
- **AND** once the session resolves signed out, the badge displays `2`
- **AND** the Cart control stays available throughout

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

### Requirement: Signed-in collectors open what the build carries from the account menu

The account control of a signed-in collector opens a menu of destinations.

**The menu** - When the collector is signed in, activating the account
control SHALL open a menu that shows the small avatar of the collector, then
their sign-in email, above the items. Wherever the site carries the account
page, the avatar SHALL show the image the collector chose on their profile;
it SHALL show the initial of their sign-in email where they have chosen none
or the image fails to load. The menu SHALL offer My
Auctions and Sign Out, with Sign Out last. Once Store answers, the menu SHALL
also offer My Orders, immediately before My Auctions. Wherever the site
carries the account page, the menu SHALL also offer Profile, as its first
item.

**Withheld pages** - The menu SHALL NOT offer an item whose page the site
withholds: My Orders until Store answers, Profile where the account page is
withheld, and Membership where the membership page is withheld.

**Each item** - Activating Profile SHALL take them to the account page.
Activating My Orders SHALL take them to My Orders at `/profile/orders`.
Activating My Auctions SHALL take them to My Auctions. Activating Sign Out
SHALL start sign-out.

**Sign Out label** - The menu's sign-out item SHALL read "Sign Out".

**Not offered** - The menu SHALL NOT offer KYC.

<!-- trace:scenario id=g10.site-page-shell.SC-y2l rev=3 -->
#### Scenario: grade10-site-site-page-shell-SC-56 - Account menu once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu once Store answers

- **GIVEN** a signed-in collector and Store answers
- **WHEN** they activate the account control
- **THEN** My Orders comes immediately before My Auctions
- **AND** Sign Out is the last item
- **AND** the menu does not offer KYC

<!-- trace:scenario id=g10.site-page-shell.SC-04a rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-57 - Sign out from the menu
**Serves:** grade10-site-site-page-shell-US-03 - leaving the session from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign Out
- **THEN** sign-out starts

<!-- trace:scenario id=g10.site-page-shell.SC-u71 rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-58 - Account menu omits My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu before Store answers

- **GIVEN** a signed-in collector and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu offers My Auctions, and Sign Out as the last item
- **AND** the menu does not offer My Orders

<!-- trace:scenario id=g10.site-page-shell.SC-agf rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-59 - Account menu omits Profile where the account page is withheld
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build without the account page

- **GIVEN** a signed-in collector, Store answers, and the site withholds the account page
- **WHEN** they activate the account control
- **THEN** the menu opens on My Orders
- **AND** the menu does not offer Profile

<!-- trace:scenario id=g10.site-page-shell.SC-n9c rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-60 - The auction-launch account menu
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on auction launch

- **GIVEN** a signed-in collector on a build that withholds Store, the account
  page and the membership page, as the auction launch does
- **WHEN** they activate the account control
- **THEN** the menu offers My Auctions and Sign Out, in that order, and no other item

<!-- trace:scenario id=g10.site-page-shell.SC-3y1 rev=2 -->
#### Scenario: grade10-site-site-page-shell-SC-61 - Account menu shows the sign-in email and avatar
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector who has chosen no profile image
- **WHEN** they activate the account control
- **THEN** the menu shows the small initial avatar of their sign-in email, then the email, above the items

<!-- trace:scenario id=g10.site-page-shell.SC-m6b rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-62 - Sign Out reads in Title Case
**Serves:** grade10-site-site-page-shell-US-03 - leaving the session from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they view the menu
- **THEN** the last item reads "Sign Out"

<!-- trace:scenario id=g10.site-page-shell.SC-th1 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-63 - Account menu omits Membership where the membership page is withheld
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build without the membership page

- **GIVEN** a signed-in collector, Store answers, and the site withholds the membership page
- **WHEN** they activate the account control
- **THEN** the menu does not offer Membership

<!-- trace:scenario id=g10.site-page-shell.SC-70a rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-64 - My Orders opens order history
**Serves:** grade10-site-site-page-shell-US-03 - reaching order history from the header

- **GIVEN** a signed-in collector, Store answers, and the account menu is open
- **WHEN** they activate My Orders
- **THEN** they arrive at My Orders at `/profile/orders`

<!-- trace:scenario id=g10.site-page-shell.SC-lcs rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-65 - My Auctions opens My Auctions
**Serves:** grade10-site-site-page-shell-US-03 - reaching My Auctions from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate My Auctions
- **THEN** they arrive at My Auctions

<!-- trace:scenario id=g10.site-page-shell.SC-79q rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-66 - Account menu opens on Profile where the account page is carried
**Serves:** grade10-site-site-page-shell-US-03 - the collector's account menu on a build with the account page

- **GIVEN** a signed-in collector on a build that carries the account page
- **WHEN** they activate the account control
- **THEN** Profile is the first item

<!-- trace:scenario id=g10.site-page-shell.SC-o1v rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-67 - Profile opens the account page
**Serves:** grade10-site-site-page-shell-US-03 - reaching the account page from the header

- **GIVEN** a signed-in collector on a build that carries the account page, with the account menu open
- **WHEN** they activate Profile
- **THEN** they arrive at the account page

<!-- trace:scenario id=g10.site-page-shell.SC-saj rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-79 - Account menu shows the profile image
**Serves:** grade10-site-site-page-shell-US-03 - identifying the signed-in collector at the top of the menu

- **GIVEN** a signed-in collector who chose a profile image
- **WHEN** they activate the account control
- **THEN** the menu's avatar shows that image, then the email, above the items
- **AND** once they remove the image, the menu's avatar shows their email's initial

### Requirement: The account entry holds its place until the session first answers

Until the session first answers, the header SHALL hold the account entry's
place with a placeholder, so a signed-in collector is never offered Sign In.
The account entry SHALL be in one of these states:

| State | When | Shows |
| --- | --- | --- |
| Placeholder | From the first paint until the session first answers, including in a page the site writes before anybody's session is read | A round placeholder 40 CSS pixels across, the account icon's footprint, in the account entry's place; nothing to focus or press, and nothing read aloud |
| Account icon | The latest read that did not fail returned a signed-in session | The account icon that opens the account menu |
| Sign In | The latest read that did not fail returned no session, or every read so far has failed | The primary Sign In button |

**First answer** - The session first answers when its first read since the
page loaded returns a signed-in session, returns no session, or fails. A read
that answers that the collector has no session, including a refusal saying
they are not signed in, returns no session; a read fails only when it returns
neither a session nor that answer. Moving between surfaces SHALL NOT bring the
placeholder back; a reload SHALL start over at it, with no session remembered
from before.

**Both widths** - The placeholder SHALL be the same size on a wide viewport
and in the compact bar, where it SHALL sit beside Cart when the header offers
Cart.

**Once** - After the first answer the account entry SHALL NOT return to the
placeholder. While the session is read again, the header SHALL keep the entry
already shown until that read returns a session other than the one shown. A
later read that fails SHALL keep the entry already shown; a later read that
returns no session SHALL show Sign In.

**No timer** - The site SHALL NOT replace the placeholder after a time of its
own; the placeholder SHALL show until the session answers.

<!-- trace:scenario id=g10.site-page-shell.SC-3s6 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-68 - The account entry is a placeholder until the session answers
**Serves:** grade10-site-site-page-shell-US-09 - a collector opening the site before their session has answered

- **GIVEN** a viewport at the wide breakpoint, or 375 CSS pixels wide
- **WHEN** a collector opens any surface the shell wraps and the session has
  not yet answered
- **THEN** the account entry's place in the header bar holds a round
  placeholder 40 CSS pixels across, beside Cart in the compact bar when the
  header offers Cart
- **AND** neither Sign In nor the account icon appears

<!-- trace:scenario id=g10.site-page-shell.SC-gua rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-75 - The placeholder cannot be focused or pressed
**Serves:** grade10-site-site-page-shell-US-09 - a collector who reaches the placeholder by pointer or keyboard

- **GIVEN** a header showing the placeholder
- **WHEN** the collector clicks it, or moves focus through the header with the
  keyboard
- **THEN** nothing opens and the address does not change
- **AND** focus never lands on the placeholder

<!-- trace:scenario id=g10.site-page-shell.SC-0lr rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-76 - Assistive technology reads nothing for the placeholder
**Serves:** grade10-site-site-page-shell-US-09 - a collector using a screen reader before their session has answered

- **GIVEN** a header showing the placeholder
- **WHEN** assistive technology reads the header
- **THEN** it reads nothing for the placeholder, and announces no loading

<!-- trace:scenario id=g10.site-page-shell.SC-tah rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-69 - A page written before any session is read shows the placeholder
**Serves:** grade10-site-site-page-shell-US-09 - a collector whose browser shows the written page before the site's scripts run

- **GIVEN** a page the site writes before anybody's session is read
- **WHEN** a browser shows that page before the site's scripts have taken it
  over
- **THEN** the account entry is the placeholder
- **AND** Sign In does not appear

<!-- trace:scenario id=g10.site-page-shell.SC-i26 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-77 - The placeholder stays when the scripts take a written page over
**Serves:** grade10-site-site-page-shell-US-09 - a collector whose browser shows the written page before the site's scripts run

- **GIVEN** a written page showing the placeholder
- **WHEN** the site's scripts take the page over before the session answers
- **THEN** the placeholder stays in the account entry's place
- **AND** Sign In does not appear before the session answers

<!-- trace:scenario id=g10.site-page-shell.SC-31a rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-70 - A signed-in collector goes straight to the account icon
**Serves:** grade10-site-site-page-shell-US-09 - a returning collector who is already signed in

- **GIVEN** a collector who is signed in
- **WHEN** they open the site and their session answers
- **THEN** the account icon takes the placeholder's place
- **AND** Sign In does not appear at any point from the first paint to the
  account icon

<!-- trace:scenario id=g10.site-page-shell.SC-qnl rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-71 - A failed session read shows Sign In
**Serves:** grade10-site-site-page-shell-US-09 - a visitor whose session cannot be read

- **GIVEN** a header showing the placeholder
- **WHEN** the session's first read fails
- **THEN** Sign In takes the placeholder's place
- **AND** activating Sign In leads to sign-in

<!-- trace:scenario id=g10.site-page-shell.SC-gmi rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-72 - A re-read keeps the entry already shown
**Serves:** grade10-site-site-page-shell-US-09 - a collector coming back to the tab after the session has answered

- **GIVEN** a header showing Sign In, or the account icon, after the session
  first answered
- **WHEN** the collector moves to another surface, or the session is read
  again, as when they come back to the tab
- **THEN** the header keeps showing that entry while the read is under way
- **AND** the placeholder does not return
- **AND** the entry changes only when that read returns a session other than
  the one shown

<!-- trace:scenario id=g10.site-page-shell.SC-uqh rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-73 - A slow session read keeps the placeholder
**Serves:** grade10-site-site-page-shell-US-09 - a signed-in collector on a slow connection

- **GIVEN** a signed-in collector whose header shows the placeholder
- **WHEN** a minute passes and the session read has neither answered nor
  failed
- **THEN** the header still shows the placeholder, and Sign In has not
  appeared
- **AND** moving to another surface while the read is under way keeps the
  placeholder
- **AND** when the read then answers, the account icon takes the
  placeholder's place

<!-- trace:scenario id=g10.site-page-shell.SC-ra1 rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-74 - A later read that fails keeps the entry already shown
**Serves:** grade10-site-site-page-shell-US-09 - a signed-in collector whose connection drops after the session has answered

- **GIVEN** a header showing the account icon after the session first answered
- **WHEN** a later read of the session fails without returning a session
- **THEN** the account icon stays, and neither Sign In nor the placeholder
  appears
- **AND** when a later read returns no session, as after signing out
  elsewhere, Sign In takes the account icon's place

<!-- trace:scenario id=g10.site-page-shell.SC-nuz rev=1 -->
#### Scenario: grade10-site-site-page-shell-SC-78 - Signing in or out after the first answer does not bring the placeholder back
**Serves:** grade10-site-site-page-shell-US-09 - a collector who signs in or out after the session has answered

- **GIVEN** a header showing Sign In, or the account icon, after the session
  first answered
- **WHEN** the collector signs in from Sign In, or signs out from the account
  menu, on that page
- **THEN** the account entry changes straight to the account icon, or to Sign
  In
- **AND** the placeholder does not show at any point
