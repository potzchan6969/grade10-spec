# grade10-site/page-shell Specification

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
    only when its destination exists
  - Current-surface marking: the navigation item owning the current address is
    marked, and none is when no item owns it
- Small-width resilience
  - No horizontal overflow: the shell reflows at 375 CSS pixels with every
    control still reachable

## User journeys

### page-shell-US-01: Collector opens any surface inside the site shell

**As a** collector,
**I want** every address the site answers to render its surface between the
header and the footer, at the width I browse at,
**so that** I get the site around whatever I opened, and never a surface that
shipped without it.

**Accepted by:**

- `page-shell-SC-01` — Every address is wrapped
- `page-shell-SC-02` — The shell is not a page
- `page-shell-SC-03` — The page has one of each landmark
- `page-shell-SC-15` — A narrow viewport

### page-shell-US-02: Collector sees the chrome before the session resolves

**As a** collector,
**I want** the header and the footer rendered before the session has resolved,
and unchanged once it does,
**so that** I can start navigating immediately without the chrome shifting
under me.

**Accepted by:**

- `page-shell-SC-04` — A first paint while the session resolves
- `page-shell-SC-05` — No layout shift when the session arrives

### page-shell-US-03: Collector reaches their account from the header

**As a** collector,
**I want** an account control that leads to my profile when I am signed in and
to sign-in when I am not,
**so that** one control in the header always takes me where I can go, and
signing out has a single home.

**Accepted by:**

- `page-shell-SC-06` — Signed in
- `page-shell-SC-07` — Signed out
- `page-shell-SC-08` — Sign-out has one home

### page-shell-US-04: Collector follows only links the site answers

**As a** collector,
**I want** the chrome to show a control or a link only when the site answers
its destination,
**so that** nothing in the header or the footer leads me to a not-found page.

**Accepted by:**

- `page-shell-SC-09` — Absent surfaces are absent controls
- `page-shell-SC-10` — Navigation lists real surfaces
- `page-shell-SC-11` — The footer drops what it cannot reach
- `page-shell-SC-12` — The promo bar and utility row wait for their pages

### page-shell-US-05: Collector locates the current surface in the navigation

**As a** collector,
**I want** the navigation item owning the address I am on to be marked, and
none marked when no item owns it,
**so that** I can tell where I am in the site without guessing.

**Accepted by:**

- `page-shell-SC-13` — A collector is on a listed surface
- `page-shell-SC-14` — A collector is on an unlisted surface

## Requirements
### Requirement: Every surface renders inside the shell

The site SHALL render the header above and the footer below every surface it
answers, including not-found and the state while the session is resolving. A
surface SHALL render into a single content region between them.

The shell SHALL hold no opinion about what a surface renders inside that
region.

#### Scenario: page-shell-SC-01 - Every address is wrapped

- **WHEN** a collector opens any address the site answers, including one it
  does not recognize
- **THEN** the header and the footer are present, with the surface between them

#### Scenario: page-shell-SC-02 - The shell is not a page

- **WHEN** a surface renders inside the content region
- **THEN** the shell adds no heading, no copy, and no spacing decision of its
  own to that surface's content

#### Scenario: page-shell-SC-03 - The page has one of each landmark

- **WHEN** any surface renders
- **THEN** the page carries exactly one banner, one main, and one contentinfo
  landmark, and the surface's content is inside main

### Requirement: The chrome does not wait for the session

The site SHALL render the header and the footer before the session has
resolved. Only the account control's destination SHALL depend on the session.

#### Scenario: page-shell-SC-04 - A first paint while the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

#### Scenario: page-shell-SC-05 - No layout shift when the session arrives

- **GIVEN** a page rendered while the session was resolving
- **WHEN** the session resolves
- **THEN** no chrome control appears, disappears, or moves

### Requirement: The account control leads where the collector can go

The site SHALL show an account control in the header at all times. It SHALL
lead to the profile when the collector is signed in, and to sign-in when they
are not.

Signing out SHALL be offered on the profile, not in the header.

#### Scenario: page-shell-SC-06 - Signed in

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** they arrive at their profile

#### Scenario: page-shell-SC-07 - Signed out

- **GIVEN** a collector who is not signed in
- **WHEN** they activate the account control
- **THEN** they arrive at sign-in

#### Scenario: page-shell-SC-08 - Sign-out has one home

- **WHEN** any surface renders
- **THEN** the header offers no way to sign out
- **AND** a signed-in collector can sign out from their profile

### Requirement: The header shows only controls this site has surfaces for

The site SHALL supply the header a handler only for a control whose surface it
answers, so a control with nothing behind it does not render. Search and cart
SHALL NOT appear until the site answers them.

#### Scenario: page-shell-SC-09 - Absent surfaces are absent controls

- **WHEN** the header renders
- **THEN** it shows the locale label and the account control
- **AND** no search or cart control appears

### Requirement: A link is present only when the site answers it

The site SHALL show a navigation, utility, footer, or legal link only when its
destination is an address the site answers. A destination that does not exist
yet SHALL be omitted rather than linked to a not-found page.

#### Scenario: page-shell-SC-10 - Navigation lists real surfaces

- **WHEN** the header renders
- **THEN** every navigation item leads to a surface the site answers

#### Scenario: page-shell-SC-11 - The footer drops what it cannot reach

- **WHEN** the footer renders
- **THEN** every link leads to a surface the site answers, and a column left
  with no reachable link is absent entirely

#### Scenario: page-shell-SC-12 - The promo bar and utility row wait for their pages

- **WHEN** the header renders and the site answers none of the utility
  destinations
- **THEN** neither the promotional bar nor the utility row appears

### Requirement: The header marks the surface being viewed

The site SHALL mark the navigation item matching the current surface, and
SHALL mark none when the current address belongs to no navigation item.

#### Scenario: page-shell-SC-13 - A collector is on a listed surface

- **GIVEN** a collector on a surface the navigation lists, or on any address beneath it
- **WHEN** the header renders
- **THEN** that navigation item is marked as the current page

#### Scenario: page-shell-SC-14 - A collector is on an unlisted surface

- **GIVEN** a collector on the profile, sign-in, or an unrecognized address
- **WHEN** the header renders
- **THEN** no navigation item is marked as the current page

### Requirement: The shell stays usable at small widths

The site SHALL render the shell without horizontal overflow at a viewport 375
CSS pixels wide, on every surface. Chrome and content SHALL reflow rather than
be clipped, and every control SHALL remain reachable.

#### Scenario: page-shell-SC-15 - A narrow viewport

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** any surface renders
- **THEN** the page scrolls vertically only, with no content clipped and no
  control unreachable

