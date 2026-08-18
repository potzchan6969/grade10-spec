# grade10-site/navigation Specification

## Purpose
How the grade10 site answers an address once it is running in the browser:
which surface an address resolves to, how the session corrects an address it
decides, what an in-page navigation preserves, and what code a surface
costs. `page-shell` owns what wraps every surface; `crawlable-pages` owns
what an address serves before scripts run; this capability owns what
navigating between surfaces does.
## Requirements
### Requirement: An address resolves to one surface

The site SHALL resolve every address to at most one surface. A surface SHALL
own every address beneath its own, so a deeper address answers as that
surface. An address under no surface SHALL resolve to the not-found surface.

#### Scenario: A nested address answers as its surface

- **WHEN** a collector opens an address beneath a surface, such as a mailed
  lot link beneath the auction
- **THEN** that surface renders

#### Scenario: An unknown address resolves to not-found

- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders, naming the address that failed

### Requirement: In-app navigation stays in the page

A link from one surface to another — including a link the site chrome
renders — SHALL navigate without a full document load. A click the collector
modifies, a link that opens elsewhere by its own declaration, and a
destination on another origin SHALL be left to the browser untouched.

#### Scenario: A chrome link navigates in place

- **GIVEN** a collector on any surface
- **WHEN** they click a header or footer link to another surface
- **THEN** the destination surface renders without a full document load

#### Scenario: A modified click is the browser's

- **WHEN** a collector clicks an in-app link with a modifier held, such as
  the one that opens a new tab
- **THEN** the browser's own behavior happens, unaltered

#### Scenario: Another origin is the browser's

- **WHEN** a collector clicks a link to another origin
- **THEN** the browser follows it as a normal page load

### Requirement: The session corrects a session-decided address

The profile and sign-in addresses SHALL answer with what the session allows:
the profile address answers sign-in for a collector without a session, and
the sign-in address answers the profile for a collector with one. The
correction SHALL move the address to the surface shown, replacing the
history entry it corrects. Only these two addresses SHALL wait for the
session to resolve.

#### Scenario: A signed-out collector asks for the profile

- **GIVEN** a collector who is not signed in
- **WHEN** they open the profile address
- **THEN** the sign-in surface renders and the address reads as sign-in

#### Scenario: Back never returns to a corrected address

- **GIVEN** a collector whose navigation was just corrected
- **WHEN** they go back
- **THEN** they arrive where they were before asking, never at the address
  that corrected them forward

#### Scenario: A signed-in collector asks for sign-in

- **GIVEN** a signed-in collector
- **WHEN** they open the sign-in address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: A public surface does not wait

- **GIVEN** the session has not yet resolved
- **WHEN** a collector opens any address other than the profile or sign-in
- **THEN** that surface renders without waiting for it

### Requirement: Navigation keeps the collector's place

Going back or forward SHALL return the collector to the scroll position they
left that entry at. A navigation to a new entry SHALL start at the top.

#### Scenario: Back returns to where they were

- **GIVEN** a collector who scrolled partway down a surface and followed a
  link from there
- **WHEN** they go back
- **THEN** the surface is scrolled to where they left it

#### Scenario: A new surface starts at the top

- **GIVEN** a collector scrolled partway down a surface
- **WHEN** they follow a link to another surface
- **THEN** the destination renders scrolled to the top

### Requirement: A surface loads only its own code

Opening a surface SHALL NOT download another surface's page code. Navigating
to a surface SHALL load that surface's code then.

#### Scenario: The first visit pays for one surface

- **WHEN** a collector opens the marketing page cold
- **THEN** no script containing the store's or the auction's page code is
  downloaded

#### Scenario: The destination loads on arrival

- **GIVEN** a collector on the marketing page
- **WHEN** they navigate to the store
- **THEN** the store's page code loads and the store renders

