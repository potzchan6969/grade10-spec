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
  - Session-aware destination: leads to the profile when signed in, to
    sign-in when not
  - Sign-out on the profile: the header offers no way to sign out, so there is
    one place to do it
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

#### Scenario: grade10-site-site-page-shell-SC-01 - Every address is wrapped
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **WHEN** a collector opens any address the site answers, including one it
  does not recognize
- **THEN** the header and the footer are present, with the surface between them

#### Scenario: grade10-site-site-page-shell-SC-02 - The shell is not a page
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **WHEN** a surface renders inside the content region
- **THEN** the shell adds no heading, no copy, and no spacing decision of its
  own to that surface's content

#### Scenario: grade10-site-site-page-shell-SC-03 - The page has one of each landmark
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **WHEN** any surface renders
- **THEN** the page carries exactly one banner, one main, and one contentinfo
  landmark, and the surface's content is inside main

### Requirement: The chrome does not wait for the session

The site SHALL render the header and the footer before the session has
resolved. The account entry's presentation and destination SHALL depend on the
session: signed out shows a primary Sign In button; signed in shows the account
icon that opens the account menu. What the Cart control opens SHALL depend on
it too, and nothing else in the chrome SHALL. No chrome control SHALL appear,
disappear, or move when the session arrives.

#### Scenario: grade10-site-site-page-shell-SC-04 - A first paint while the session resolves
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

#### Scenario: grade10-site-site-page-shell-SC-05 - No layout shift when the session arrives
**Serves:** grade10-site-site-page-shell-US-02 - Collector sees the chrome before the session resolves

- **GIVEN** a page rendered while the session was resolving
- **WHEN** the session resolves
- **THEN** the account entry matches the session (Sign In when signed out,
  account icon when signed in)
- **AND** no other chrome control appears, disappears, or moves

### Requirement: The account control leads where the collector can go

The site SHALL show an account entry in the header at all times once the
session has resolved. When the collector is signed out, it SHALL be a primary
Sign In button that leads to sign-in. When the collector is signed in, it SHALL
be the account icon that opens the account menu.

Signing out SHALL be offered from the account menu and on the profile.

#### Scenario: grade10-site-site-page-shell-SC-06 - Signed in
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** the account menu opens

#### Scenario: grade10-site-site-page-shell-SC-07 - Signed out
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a collector who is not signed in
- **WHEN** they activate Sign In
- **THEN** they arrive at sign-in

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

#### Scenario: grade10-site-site-page-shell-SC-09 - Absent surfaces are absent controls
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **GIVEN** the site does not yet answer the Store cart drawer
- **WHEN** the header renders
- **THEN** the account entry is in the bar
- **AND** language is reachable (in the bar on a wide viewport; from the
  compact menu on a narrow viewport)
- **AND** no Store navigation item appears when Store does not answer
- **AND** no search or cart control appears

#### Scenario: grade10-site-site-page-shell-SC-16 - Cart is global once Store answers
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **GIVEN** the site answers the Store cart drawer, and a collector on any
  surface including Auction
- **WHEN** the header renders
- **THEN** the Cart control appears
- **AND** no search control appears

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

#### Scenario: grade10-site-site-page-shell-SC-10 - Navigation lists real surfaces
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the header renders
- **THEN** every navigation item other than Help leads to a surface the site
  answers
- **AND** Help, when present, leads to the documentation host Product names

#### Scenario: grade10-site-site-page-shell-SC-11 - The footer drops what it cannot reach
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the footer renders
- **THEN** every link leads to a surface the site answers, and a column left
  with no reachable link is absent entirely

#### Scenario: grade10-site-site-page-shell-SC-12 - The promo bar and utility row wait for their pages
**Serves:** grade10-site-site-page-shell-US-04 - Collector follows only links the site answers

- **WHEN** the header renders and the site answers none of its on-site utility
  destinations
- **THEN** neither the promotional bar nor the utility row appears

### Requirement: The header marks the surface being viewed

The site SHALL mark the navigation item matching the current surface, and
SHALL mark none when the current address belongs to no navigation item.

#### Scenario: grade10-site-site-page-shell-SC-13 - A collector is on a listed surface
**Serves:** grade10-site-site-page-shell-US-05 - Collector locates the current surface in the navigation

- **GIVEN** a collector on a surface the navigation lists, or on any address beneath it
- **WHEN** the header renders
- **THEN** that navigation item is marked as the current page

#### Scenario: grade10-site-site-page-shell-SC-14 - A collector is on an unlisted surface
**Serves:** grade10-site-site-page-shell-US-05 - Collector locates the current surface in the navigation

- **GIVEN** a collector on the profile, sign-in, or an unrecognized address
- **WHEN** the header renders
- **THEN** no navigation item is marked as the current page

### Requirement: The shell stays usable at small widths

The site SHALL render the shell without horizontal overflow at a viewport 375
CSS pixels wide, on every surface. Chrome and content SHALL reflow rather than
be clipped, and every control SHALL remain reachable.

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

#### Scenario: grade10-site-site-page-shell-SC-25 - Help on auction-only and full nav
**Serves:** grade10-site-site-page-shell-US-07 - Collector opens Help from the header

- **GIVEN** a wide viewport and a header whose primary nav is auction-only, or
  one that also lists Store and other answered surfaces
- **WHEN** the header renders
- **THEN** Help appears in the primary navigation after Auction on auction-only
  nav, or after Store Locator when that item is present
- **AND** activating it opens the documentation site in a new browsing context

#### Scenario: grade10-site-site-page-shell-SC-26 - Help in the compact menu
**Serves:** grade10-site-site-page-shell-US-07 - Collector opens Help from the header

- **GIVEN** a viewport 375 CSS pixels wide with Help supplied in primary nav
- **WHEN** the collector opens the header menu
- **THEN** Help is reachable in the drawer among the primary items after Auction
  on auction-only nav, or after Store Locator when that item is present
- **AND** activating it opens the documentation site in a new browsing context

### Requirement: Signed-in collectors open account destinations from the header menu

The account control of a signed-in collector opens a menu of three
destinations.

**The menu** - When the collector is signed in, activating the account control
SHALL open a menu of Profile, My Auctions, and Sign out.

**Each item** - Activating Profile SHALL take them to the profile. Activating
My Auctions SHALL take them to My Auctions. Activating Sign out SHALL start
sign-out.

**Not offered** - The menu SHALL NOT offer Orders or KYC until those surfaces
are in scope for the header.

**Profile sign-out** - The profile SHALL continue to offer sign-out as well.

#### Scenario: grade10-site-site-page-shell-SC-17 - Account menu lists auction-first destinations
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** the menu offers Profile, My Auctions, and Sign out
- **AND** the menu does not offer Orders or KYC

#### Scenario: grade10-site-site-page-shell-SC-18 - Sign out from the menu
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign out
- **THEN** sign-out starts
- **AND** the profile still offers sign-out when they are signed in

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

#### Scenario: grade10-site-site-page-shell-SC-20 - Compact menu reaches nav and language
**Serves:** grade10-site-site-page-shell-US-01 - Collector opens any surface inside the site shell

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** the collector opens the header menu
- **THEN** primary navigation is reachable in the drawer
- **AND** language options are reachable from a nested drawer
- **AND** the account entry remains in the bar
- **AND** the menu panel leaves a visible gutter beside the viewport edge
