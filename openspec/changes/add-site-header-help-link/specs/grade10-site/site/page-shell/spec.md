## Feature set

- Links only to real surfaces
  - Controls with surfaces behind them: search and cart stay absent until the
    site answers them
  - Reachable links only: a navigation, footer, or legal link appears only when
    its destination exists, except primary-nav Help may name the documentation
    host Product names
  - Current-surface marking: the navigation item owning the current address is
    marked, and none is when no item owns it
- Collector help
  - Header Help: primary nav lists Help after Store Locator when that item is
    present, and after Auction on auction-only nav; Help opens the
    documentation site in a new tab

## ADDED Requirements

### Requirement: Help opens the documentation site from the header

The site SHALL list Help in the primary navigation on a wide viewport, and in
the compact menu drawer on a narrow viewport, whenever the primary navigation
is auction-only or includes Store and other answered surfaces. When Store
Locator is present in the primary navigation, Help SHALL follow it; on
auction-only primary navigation, Help SHALL follow Auction. Help SHALL use the
same primary-nav link presentation as other primary items. Activating Help
SHALL open the documentation site Product names in a new browsing context. The
current site surface SHALL remain open.

Help SHALL use the shared chrome's external link behaviour so the new tab is
isolated from the opener.

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

## MODIFIED Requirements

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
