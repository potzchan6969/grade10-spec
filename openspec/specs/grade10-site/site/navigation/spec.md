# grade10-site/site/navigation Specification

## Purpose
How the grade10 site answers an address once it is running in the browser:
which surface an address resolves to, how the session corrects an address it
decides, what an in-page navigation preserves, and what code a surface
costs. `page-shell` owns what wraps every surface; `crawlable-pages` owns
what an address serves before scripts run; this capability owns what
navigating between surfaces does.

## Feature set

- Address resolution
  - One surface per address: every address resolves to at most one surface
  - Nested ownership: a surface owns the addresses beneath it unless a nested
    surface names one, and the deepest one naming it renders
  - Not-found fallback: an address under no surface renders the not-found
    surface, naming the address that failed
- In-page navigation
  - No document load: a link from one surface to another, the chrome's
    included, navigates without reloading the document
  - The browser's own clicks: a modified click, a link that opens elsewhere by
    its own declaration, and another origin are left untouched
- Session-decided addresses
  - Profile and sign-in correction: each answers with what the session allows
  - History replacement: a correction replaces the entry it corrects, so back
    never returns to it
  - Everything else does not wait: only these two addresses wait for the
    session to resolve
- Scroll restoration
  - Restored position: back or forward returns the collector to the scroll
    position they left that entry at
  - New entry at the top: a navigation to a new entry starts at the top
- Per-surface code
  - Nothing paid up front: opening a surface downloads no other surface's page
    code
  - Loaded on arrival: a surface's code loads when the collector navigates to
    it

## Requirements
### Requirement: An address resolves to one surface

The site SHALL resolve every address to at most one surface. A surface SHALL
own every address beneath its own, so a deeper address answers as that
surface — unless a nested surface names that address, in which case the
nested one renders. Where more than one surface could own an address, the
deepest one naming it SHALL be the one that renders. An address under no
surface SHALL resolve to the not-found surface.

#### Scenario: grade10-site-site-navigation-SC-01 - A nested address answers as its surface

- **WHEN** a collector opens an address beneath a surface that no surface of
  its own names, such as an address beneath the store
- **THEN** that surface renders

#### Scenario: grade10-site-site-navigation-SC-02 - A nested surface renders for itself

- **WHEN** a collector opens an address a nested surface names, such as a
  mailed lot link beneath the auction
- **THEN** the nested surface renders, not the surface above it

#### Scenario: grade10-site-site-navigation-SC-03 - An unknown address resolves to not-found

- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders, naming the address that failed

### Requirement: In-app navigation stays in the page

A link from one surface to another — including a link the site chrome
renders — SHALL navigate without a full document load. A click the collector
modifies, a link that opens elsewhere by its own declaration, and a
destination on another origin SHALL be left to the browser untouched.

#### Scenario: grade10-site-site-navigation-SC-04 - A chrome link navigates in place

- **GIVEN** a collector on any surface
- **WHEN** they click a header or footer link to another surface
- **THEN** the destination surface renders without a full document load

#### Scenario: grade10-site-site-navigation-SC-05 - A modified click is the browser's

- **WHEN** a collector clicks an in-app link with a modifier held, such as
  the one that opens a new tab
- **THEN** the browser's own behavior happens, unaltered

#### Scenario: grade10-site-site-navigation-SC-06 - Another origin is the browser's

- **WHEN** a collector clicks a link to another origin
- **THEN** the browser follows it as a normal page load

### Requirement: The session corrects a session-decided address

The profile and sign-in addresses SHALL answer with what the session allows:
the profile address answers sign-in for a collector without a session, and
the sign-in address answers the profile for a collector with one. The
correction SHALL move the address to the surface shown, replacing the
history entry it corrects. Only these two addresses SHALL wait for the
session to resolve.

#### Scenario: grade10-site-site-navigation-SC-07 - A signed-out collector asks for the profile

- **GIVEN** a collector who is not signed in
- **WHEN** they open the profile address
- **THEN** the sign-in surface renders and the address reads as sign-in

#### Scenario: grade10-site-site-navigation-SC-08 - Back never returns to a corrected address

- **GIVEN** a collector whose navigation was just corrected
- **WHEN** they go back
- **THEN** they arrive where they were before asking, never at the address
  that corrected them forward

#### Scenario: grade10-site-site-navigation-SC-09 - A signed-in collector asks for sign-in

- **GIVEN** a signed-in collector
- **WHEN** they open the sign-in address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: grade10-site-site-navigation-SC-10 - A public surface does not wait

- **GIVEN** the session has not yet resolved
- **WHEN** a collector opens any address other than the profile or sign-in
- **THEN** that surface renders without waiting for it

### Requirement: Navigation keeps the collector's place

Going back or forward SHALL return the collector to the scroll position they
left that entry at. A navigation to a new entry SHALL start at the top.

#### Scenario: grade10-site-site-navigation-SC-11 - Back returns to where they were

- **GIVEN** a collector who scrolled partway down a surface and followed a
  link from there
- **WHEN** they go back
- **THEN** the surface is scrolled to where they left it

#### Scenario: grade10-site-site-navigation-SC-12 - A new surface starts at the top

- **GIVEN** a collector scrolled partway down a surface
- **WHEN** they follow a link to another surface
- **THEN** the destination renders scrolled to the top

### Requirement: A surface loads only its own code

Opening a surface SHALL NOT download another surface's page code. Navigating
to a surface SHALL load that surface's code then.

#### Scenario: grade10-site-site-navigation-SC-13 - The first visit pays for one surface

- **WHEN** a collector opens the marketing page cold
- **THEN** no script containing the store's or the auction's page code is
  downloaded

#### Scenario: grade10-site-site-navigation-SC-14 - The destination loads on arrival

- **GIVEN** a collector on the marketing page
- **WHEN** they navigate to the store
- **THEN** the store's page code loads and the store renders

