# zzz-site/site/navigation Specification

## Purpose
How the ZZZ site answers an address once it is running in the browser: which
surface an address resolves to, how the session corrects an address it
decides, what a navigation preserves, and what code a surface costs. The
site's surfaces are home — the signed-out landing — sign-in, and the profile;
this capability binds them and every surface the site adds after them.

The site is served as one shell for every address, so what a response says
before scripts run is not this capability's — the day ZZZ has a public
surface, whatever specs that owns it.

## Feature set

- Address resolution
  - An address per surface: home, sign-in, and the profile each answer at an
    address of their own, by link or by refresh
  - Deepest surface wins: a surface owns the addresses beneath it unless a
    nested surface names one
  - Not-found fallback: an address under no surface renders a not-found
    surface naming it, never home
- Session-decided addresses
  - Session correction: home, sign-in, and the profile each answer with what
    the session allows
  - History replacement: a correction replaces the entry it corrects, so back
    never returns to it
  - Everything else does not wait: only the session-decided addresses wait for
    the session to resolve
- In-app navigation
  - No document load: moving between the site's surfaces stays in the page,
    and history steps back through it
  - The browser's own clicks: a modified click, a link that opens elsewhere by
    its own declaration, and another origin are left untouched
- Scroll restoration
  - Restored position: back or forward returns the collector to the scroll
    position they left that entry at
  - New entry at the top: a navigation to a new entry starts at the top
- Per-surface code
  - Nothing paid up front: opening a surface downloads no other surface's page
    code
  - Loaded on arrival: a surface's code loads when the collector navigates to
    it

## User journeys

### navigation-US-01: Collector opens a ZZZ address directly

**As a** collector,
**I want** sign-in and the profile to answer at addresses of their own, and an
address under no surface to answer as not-found,
**so that** a link or a refresh puts me back on the surface I was on rather
than at home.

**Accepted by:**

- `navigation-SC-01` — Each view has an address
- `navigation-SC-02` — A refresh keeps the collector's place
- `navigation-SC-03` — An unknown address resolves to not-found

### navigation-US-02: Collector asks for a session-decided address

**As a** collector,
**I want** home, sign-in, and the profile to answer with what my session
allows, replacing the entry they correct,
**so that** I land on the surface I am actually allowed, and going back never
bounces me forward again.

**Accepted by:**

- `navigation-SC-04` — A signed-in collector lands on home
- `navigation-SC-05` — A signed-in collector asks for sign-in
- `navigation-SC-06` — A signed-out collector asks for the profile
- `navigation-SC-07` — Back never returns to a corrected address
- `navigation-SC-08` — Not-found does not wait

### navigation-US-03: Collector moves between surfaces without a page load

**As a** collector,
**I want** movement between the site's surfaces to stay in the page, with
history stepping back through it and my own click modifiers left alone,
**so that** moving around the site is immediate without taking away the
browser behavior I asked for.

**Accepted by:**

- `navigation-SC-09` — Sign-in opens in place
- `navigation-SC-10` — Back steps back into the site
- `navigation-SC-11` — A modified click is the browser's
- `navigation-SC-12` — Another origin is the browser's

### navigation-US-04: Collector resumes a surface where they left it

**As a** collector,
**I want** back and forward to return me to the scroll position I left an
entry at, and a new entry to start at the top,
**so that** I keep my place in a surface I return to instead of finding it
from the beginning.

**Accepted by:**

- `navigation-SC-13` — Back returns to where they were
- `navigation-SC-14` — A new surface starts at the top

### navigation-US-05: Collector downloads only the surface they open

**As a** collector,
**I want** a surface to cost only its own page code, loaded when I move to it,
**so that** opening one surface does not make me pay for the ones I did not
open.

**Accepted by:**

- `navigation-SC-15` — The first visit pays for one surface
- `navigation-SC-16` — The destination loads on arrival

## Requirements
### Requirement: An address resolves to one surface

The site SHALL answer home, sign-in, and the profile each at an address of
its own, and SHALL resolve every address to at most one surface. A surface
SHALL own every address beneath its own, unless a nested surface names that
address, in which case the nested one renders; where more than one surface
could own an address, the deepest one naming it SHALL be the one that
renders. An address under no surface SHALL resolve to a not-found surface
that names the address, never to home.

#### Scenario: navigation-SC-01 - Each view has an address

- **WHEN** the sign-in or profile address is opened directly, by link or by
  refresh
- **THEN** that surface renders at that address

#### Scenario: navigation-SC-02 - A refresh keeps the collector's place

- **GIVEN** a collector who moved from home to sign-in
- **WHEN** they refresh
- **THEN** sign-in renders, not home

#### Scenario: navigation-SC-03 - An unknown address resolves to not-found

- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders, naming the address that failed

### Requirement: The session corrects a session-decided address

Home, sign-in, and the profile SHALL each answer with what the session
allows: home and sign-in answer the profile for a signed-in collector, and
the profile answers sign-in for a collector without a session. A correction
SHALL move the address to the surface shown, replacing the history entry it
corrects. Only these session-decided addresses SHALL wait for the session
to resolve.

#### Scenario: navigation-SC-04 - A signed-in collector lands on home

- **GIVEN** a signed-in collector
- **WHEN** they open the home address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: navigation-SC-05 - A signed-in collector asks for sign-in

- **GIVEN** a signed-in collector
- **WHEN** they open the sign-in address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: navigation-SC-06 - A signed-out collector asks for the profile

- **GIVEN** a collector who is not signed in
- **WHEN** they open the profile address
- **THEN** the sign-in surface renders and the address reads as sign-in

#### Scenario: navigation-SC-07 - Back never returns to a corrected address

- **GIVEN** a collector whose navigation was just corrected
- **WHEN** they go back
- **THEN** they arrive where they were before asking, never at the address
  that corrected them forward

#### Scenario: navigation-SC-08 - Not-found does not wait

- **GIVEN** the session has not yet resolved
- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders without waiting for it

### Requirement: In-app navigation stays in the page

Moving between the site's surfaces SHALL happen without a full document
load, and the browser's history SHALL step back through it. A click the
collector modifies, a link that opens elsewhere by its own declaration, and
a destination on another origin SHALL be left to the browser untouched.

#### Scenario: navigation-SC-09 - Sign-in opens in place

- **GIVEN** a collector on home
- **WHEN** they choose to sign in
- **THEN** the sign-in surface renders at its address without a full
  document load

#### Scenario: navigation-SC-10 - Back steps back into the site

- **GIVEN** a collector who moved from home to sign-in
- **WHEN** they go back
- **THEN** home renders, still without a full document load

#### Scenario: navigation-SC-11 - A modified click is the browser's

- **WHEN** a collector clicks an in-app link with a modifier held, such as
  the one that opens a new tab
- **THEN** the browser's own behavior happens, unaltered

#### Scenario: navigation-SC-12 - Another origin is the browser's

- **WHEN** a collector clicks a link to another origin
- **THEN** the browser follows it as a normal page load

### Requirement: Navigation keeps the collector's place

Going back or forward SHALL return the collector to the scroll position
they left that entry at. A navigation to a new entry SHALL start at the
top.

#### Scenario: navigation-SC-13 - Back returns to where they were

- **GIVEN** a collector who scrolled partway down a surface and navigated
  from there
- **WHEN** they go back
- **THEN** the surface is scrolled to where they left it

#### Scenario: navigation-SC-14 - A new surface starts at the top

- **GIVEN** a collector scrolled partway down a surface
- **WHEN** they navigate to another surface
- **THEN** the destination renders scrolled to the top

### Requirement: A surface loads only its own code

Opening a surface SHALL NOT download another surface's page code.
Navigating to a surface SHALL load that surface's code then.

#### Scenario: navigation-SC-15 - The first visit pays for one surface

- **WHEN** a collector opens home cold
- **THEN** no script containing the profile's or sign-in's page code is
  downloaded

#### Scenario: navigation-SC-16 - The destination loads on arrival

- **GIVEN** a collector on home
- **WHEN** they move to sign-in
- **THEN** sign-in's page code loads and sign-in renders

