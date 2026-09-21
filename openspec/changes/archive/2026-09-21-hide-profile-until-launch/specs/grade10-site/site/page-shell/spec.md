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
  - Account menu: signed in, the icon opens My Auctions and Sign out; Profile
    joins first once the profile is carried, My Orders joins between Profile
    and My Auctions once Store answers; the profile also offers Sign out
    wherever it is carried
- Members-only cart
  - Sign-in before the cart: the Cart control opens sign-in while no session
    is signed in, and the drawer stays closed
  - The cart the ask was for: the drawer opens by itself once the session
    arrives, and nothing is left waiting when the ask is dismissed
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

## MODIFIED Requirements

### Requirement: Signed-in collectors open account destinations from the header menu

The account control of a signed-in collector opens a menu of destinations.

**The menu** - When the collector is signed in, activating the account
control SHALL open a menu of My Auctions and Sign out. Where the profile is
carried, Profile SHALL join first. Once Store answers, the menu SHALL also
offer My Orders, between Profile and My Auctions where Profile is offered,
or otherwise before My Auctions. Until Store answers, the menu SHALL NOT
offer My Orders. Where the profile is not carried, the menu SHALL NOT offer
Profile.

**Each item** - Activating Profile, where it is offered, SHALL take them to
the profile. Activating My Orders, where it is offered, SHALL take them to
My Orders. Activating My Auctions SHALL take them to My Auctions. Activating
Sign out SHALL start sign-out.

**Not offered** - The menu SHALL NOT offer KYC until it is in scope for the
header.

**Profile sign-out** - Wherever the profile is carried, it SHALL continue to
offer sign-out as well.

#### Scenario: grade10-site-site-page-shell-SC-17 - Account menu lists auction-first destinations
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is carried, and Store answers
- **WHEN** they activate the account control
- **THEN** the menu offers Profile, My Orders, My Auctions, and Sign out
- **AND** the menu does not offer KYC

#### Scenario: grade10-site-site-page-shell-SC-18 - Sign out from the menu
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign out
- **THEN** sign-out starts
- **AND** the profile still offers sign-out when they are signed in

#### Scenario: grade10-site-site-page-shell-SC-27 - Account menu omits My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is carried, and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu offers Profile, My Auctions, and Sign out
- **AND** the menu does not offer My Orders

#### Scenario: grade10-site-site-page-shell-SC-28 - Account menu omits Profile once Store answers
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is not carried, and Store answers
- **WHEN** they activate the account control
- **THEN** the menu offers My Orders, My Auctions, and Sign out
- **AND** the menu does not offer Profile

#### Scenario: grade10-site-site-page-shell-SC-29 - Account menu omits Profile and My Orders before Store answers
**Serves:** grade10-site-site-page-shell-US-03 - Collector reaches account destinations from the header

- **GIVEN** a signed-in collector, the profile is not carried, and Store does not yet answer
- **WHEN** they activate the account control
- **THEN** the menu offers My Auctions and Sign out
- **AND** the menu does not offer Profile or My Orders
