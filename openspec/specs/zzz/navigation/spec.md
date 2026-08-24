# zzz/navigation Specification

## Purpose
How the ZZZ site answers an address once it is running in the browser: which
surface an address resolves to, how the session corrects an address it
decides, what a navigation preserves, and what code a surface costs. The
site's surfaces are home — the signed-out landing — sign-in, and the profile;
this capability binds them and every surface the site adds after them.

The site is served as one shell for every address, so what a response says
before scripts run is not this capability's — the day ZZZ has a public
surface, whatever specs that owns it.
## Requirements
### Requirement: An address resolves to one surface

The site SHALL answer home, sign-in, and the profile each at an address of
its own, and SHALL resolve every address to at most one surface. A surface
SHALL own every address beneath its own, unless a nested surface names that
address, in which case the nested one renders; where more than one surface
could own an address, the deepest one naming it SHALL be the one that
renders. An address under no surface SHALL resolve to a not-found surface
that names the address, never to home.

#### Scenario: Each view has an address

- **WHEN** the sign-in or profile address is opened directly, by link or by
  refresh
- **THEN** that surface renders at that address

#### Scenario: A refresh keeps the collector's place

- **GIVEN** a collector who moved from home to sign-in
- **WHEN** they refresh
- **THEN** sign-in renders, not home

#### Scenario: An unknown address resolves to not-found

- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders, naming the address that failed

### Requirement: The session corrects a session-decided address

Home, sign-in, and the profile SHALL each answer with what the session
allows: home and sign-in answer the profile for a signed-in collector, and
the profile answers sign-in for a collector without a session. A correction
SHALL move the address to the surface shown, replacing the history entry it
corrects. Only these session-decided addresses SHALL wait for the session
to resolve.

#### Scenario: A signed-in collector lands on home

- **GIVEN** a signed-in collector
- **WHEN** they open the home address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: A signed-in collector asks for sign-in

- **GIVEN** a signed-in collector
- **WHEN** they open the sign-in address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: A signed-out collector asks for the profile

- **GIVEN** a collector who is not signed in
- **WHEN** they open the profile address
- **THEN** the sign-in surface renders and the address reads as sign-in

#### Scenario: Back never returns to a corrected address

- **GIVEN** a collector whose navigation was just corrected
- **WHEN** they go back
- **THEN** they arrive where they were before asking, never at the address
  that corrected them forward

#### Scenario: Not-found does not wait

- **GIVEN** the session has not yet resolved
- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders without waiting for it

### Requirement: In-app navigation stays in the page

Moving between the site's surfaces SHALL happen without a full document
load, and the browser's history SHALL step back through it. A click the
collector modifies, a link that opens elsewhere by its own declaration, and
a destination on another origin SHALL be left to the browser untouched.

#### Scenario: Sign-in opens in place

- **GIVEN** a collector on home
- **WHEN** they choose to sign in
- **THEN** the sign-in surface renders at its address without a full
  document load

#### Scenario: Back steps back into the site

- **GIVEN** a collector who moved from home to sign-in
- **WHEN** they go back
- **THEN** home renders, still without a full document load

#### Scenario: A modified click is the browser's

- **WHEN** a collector clicks an in-app link with a modifier held, such as
  the one that opens a new tab
- **THEN** the browser's own behavior happens, unaltered

#### Scenario: Another origin is the browser's

- **WHEN** a collector clicks a link to another origin
- **THEN** the browser follows it as a normal page load

### Requirement: Navigation keeps the collector's place

Going back or forward SHALL return the collector to the scroll position
they left that entry at. A navigation to a new entry SHALL start at the
top.

#### Scenario: Back returns to where they were

- **GIVEN** a collector who scrolled partway down a surface and navigated
  from there
- **WHEN** they go back
- **THEN** the surface is scrolled to where they left it

#### Scenario: A new surface starts at the top

- **GIVEN** a collector scrolled partway down a surface
- **WHEN** they navigate to another surface
- **THEN** the destination renders scrolled to the top

### Requirement: A surface loads only its own code

Opening a surface SHALL NOT download another surface's page code.
Navigating to a surface SHALL load that surface's code then.

#### Scenario: The first visit pays for one surface

- **WHEN** a collector opens home cold
- **THEN** no script containing the profile's or sign-in's page code is
  downloaded

#### Scenario: The destination loads on arrival

- **GIVEN** a collector on home
- **WHEN** they move to sign-in
- **THEN** sign-in's page code loads and sign-in renders

