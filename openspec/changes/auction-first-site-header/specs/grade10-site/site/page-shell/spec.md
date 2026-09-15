## ADDED Requirements

### Requirement: Signed-in collectors open account destinations from the header menu

When the collector is signed in, activating the account control SHALL open a
menu of Profile, My Auctions, and Sign out. Activating Profile SHALL take them
to the profile. Activating My Auctions SHALL take them to My Auctions.
Activating Sign out SHALL start sign-out. The menu SHALL NOT offer Orders or
KYC until those surfaces are in scope for the header.

The profile SHALL continue to offer sign-out as well.

#### Scenario: grade10-site-site-page-shell-SC-17 - Account menu lists auction-first destinations

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** the menu offers Profile, My Auctions, and Sign out
- **AND** the menu does not offer Orders or KYC

#### Scenario: grade10-site-site-page-shell-SC-18 - Sign out from the menu

- **GIVEN** a signed-in collector with the account menu open
- **WHEN** they activate Sign out
- **THEN** sign-out starts
- **AND** the profile still offers sign-out when they are signed in

### Requirement: Compact viewports reach navigation through the menu drawer

At a viewport 375 CSS pixels wide, the site SHALL keep Account / Sign In and
Cart (when answered) reachable in the header bar. Primary navigation, utility
links, and search (when answered) SHALL be reachable from the left menu drawer.
Language SHALL be reachable through a nested drawer opened from that menu. The
menu panel SHALL leave a visible gutter rather than spanning the full viewport.
The shell SHALL NOT rely on a currency switch.

#### Scenario: grade10-site-site-page-shell-SC-20 - Compact menu reaches nav and language

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** the collector opens the header menu
- **THEN** primary navigation is reachable in the drawer
- **AND** language options are reachable from a nested drawer
- **AND** the account entry remains in the bar
- **AND** the menu panel leaves a visible gutter beside the viewport edge

## MODIFIED Requirements

### Requirement: The chrome does not wait for the session

The site SHALL render the header and the footer before the session has
resolved. The account entry's presentation and destination SHALL depend on the
session: signed out shows a primary Sign In button; signed in shows the account
icon that opens the account menu. What the Cart control opens SHALL depend on
it too, and nothing else in the chrome SHALL. No chrome control SHALL appear,
disappear, or move when the session arrives.

#### Scenario: grade10-site-site-page-shell-SC-04 - A first paint while the session resolves

- **WHEN** a collector opens the site and the session has not yet resolved
- **THEN** the header and the footer are already rendered
- **AND** the content region shows that the surface is loading

#### Scenario: grade10-site-site-page-shell-SC-05 - No layout shift when the session arrives

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

- **GIVEN** a signed-in collector
- **WHEN** they activate the account control
- **THEN** the account menu opens

#### Scenario: grade10-site-site-page-shell-SC-07 - Signed out

- **GIVEN** a collector who is not signed in
- **WHEN** they activate Sign In
- **THEN** they arrive at sign-in

#### Scenario: grade10-site-site-page-shell-SC-08 - Sign-out has one home

- **WHEN** any surface renders for a signed-in collector
- **THEN** the account menu offers Sign out
- **AND** the profile offers Sign out

### Requirement: The header shows only controls this site has surfaces for

The site SHALL supply the header a handler only for a control whose surface it
answers, so a control with nothing behind it does not render. Cart SHALL appear
on a Store surface and checkout, where the site answers the Store cart drawer,
and SHALL remain absent on every other surface. Search SHALL NOT appear until
the site answers it. Until Store answers as a navigable surface, the primary
navigation SHALL omit Store.

The locale control SHALL switch language among the brand's locales; it SHALL
NOT switch currency. On a wide viewport the language control SHALL appear in
the header bar. On a narrow viewport language SHALL be reachable from the
compact menu's nested language drawer. The account entry SHALL remain in the
bar at both widths once the session has resolved.

#### Scenario: grade10-site-site-page-shell-SC-09 - Absent surfaces are absent controls

- **GIVEN** a collector on a surface other than a Store surface or checkout,
  or while the site does not yet answer Store
- **WHEN** the header renders
- **THEN** the account entry is in the bar
- **AND** language is reachable (in the bar on a wide viewport; from the
  compact menu on a narrow viewport)
- **AND** no Store navigation item appears when Store does not answer
- **AND** no search or cart control appears

#### Scenario: grade10-site-site-page-shell-SC-16 - Store surfaces offer Cart

- **GIVEN** a collector on a Store surface or checkout
- **WHEN** the header renders
- **THEN** the Cart control appears
- **AND** no search control appears

#### Scenario: grade10-site-site-page-shell-SC-19 - Language switch, not currency

- **WHEN** the header's locale control is interactive
- **THEN** its options are the brand's languages
- **AND** none of its options is a currency
