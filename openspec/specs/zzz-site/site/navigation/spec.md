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
  - Session correction: home and sign-in each answer with what the session
    allows
  - History replacement: a correction replaces the entry it corrects, so back
    never returns to it
  - Everything else does not wait: only the session-decided addresses and the
    profile wait for the session to resolve
- The profile without a session
  - Answered on its own address: arriving signed out asks there, uncorrected
  - Carried on: a session arriving renders the profile there, with no
    navigation in between
  - Leaving goes home: dismissing takes the collector to home, replacing the
    entry the profile holds
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

## Requirements

### Requirement: An address resolves to one surface

The site SHALL answer home, sign-in, and the profile each at an address of
its own, and SHALL resolve every address to at most one surface. A surface
SHALL own every address beneath its own, unless a nested surface names that
address, in which case the nested one renders; where more than one surface
could own an address, the deepest one naming it SHALL be the one that
renders. An address under no surface SHALL resolve to a not-found surface
that names the address, never to home.

#### Scenario: zzz-site-site-navigation-SC-01 - Each view has an address
**Serves:** zzz-site-site-navigation-US-01 - Collector opens a ZZZ address directly

- **WHEN** the sign-in or profile address is opened directly, by link or by
  refresh
- **THEN** that surface renders at that address

#### Scenario: zzz-site-site-navigation-SC-02 - A refresh keeps the collector's place
**Serves:** zzz-site-site-navigation-US-01 - Collector opens a ZZZ address directly

- **GIVEN** a collector who moved from home to sign-in
- **WHEN** they refresh
- **THEN** sign-in renders, not home

#### Scenario: zzz-site-site-navigation-SC-03 - An unknown address resolves to not-found
**Serves:** zzz-site-site-navigation-US-01 - Collector opens a ZZZ address directly

- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders, naming the address that failed

### Requirement: In-app navigation stays in the page

Moving between the site's surfaces SHALL happen without a full document
load, and the browser's history SHALL step back through it. A click the
collector modifies, a link that opens elsewhere by its own declaration, and
a destination on another origin SHALL be left to the browser untouched.

#### Scenario: zzz-site-site-navigation-SC-09 - Sign-in opens in place
**Serves:** zzz-site-site-navigation-US-03 - Collector moves between surfaces without a page load

- **GIVEN** a collector on home
- **WHEN** they choose to sign in
- **THEN** the sign-in surface renders at its address without a full
  document load

#### Scenario: zzz-site-site-navigation-SC-10 - Back steps back into the site
**Serves:** zzz-site-site-navigation-US-03 - Collector moves between surfaces without a page load

- **GIVEN** a collector who moved from home to sign-in
- **WHEN** they go back
- **THEN** home renders, still without a full document load

#### Scenario: zzz-site-site-navigation-SC-11 - A modified click is the browser's
**Serves:** zzz-site-site-navigation-US-03 - Collector moves between surfaces without a page load

- **WHEN** a collector clicks an in-app link with a modifier held, such as
  the one that opens a new tab
- **THEN** the browser's own behavior happens, unaltered

#### Scenario: zzz-site-site-navigation-SC-12 - Another origin is the browser's
**Serves:** zzz-site-site-navigation-US-03 - Collector moves between surfaces without a page load

- **WHEN** a collector clicks a link to another origin
- **THEN** the browser follows it as a normal page load

### Requirement: Navigation keeps the collector's place

Going back or forward SHALL return the collector to the scroll position
they left that entry at. A navigation to a new entry SHALL start at the
top.

#### Scenario: zzz-site-site-navigation-SC-13 - Back returns to where they were
**Serves:** zzz-site-site-navigation-US-04 - Collector resumes a surface where they left it

- **GIVEN** a collector who scrolled partway down a surface and navigated
  from there
- **WHEN** they go back
- **THEN** the surface is scrolled to where they left it

#### Scenario: zzz-site-site-navigation-SC-14 - A new surface starts at the top
**Serves:** zzz-site-site-navigation-US-04 - Collector resumes a surface where they left it

- **GIVEN** a collector scrolled partway down a surface
- **WHEN** they navigate to another surface
- **THEN** the destination renders scrolled to the top

### Requirement: A surface loads only its own code

Opening a surface SHALL NOT download another surface's page code.
Navigating to a surface SHALL load that surface's code then.

#### Scenario: zzz-site-site-navigation-SC-15 - The first visit pays for one surface
**Serves:** zzz-site-site-navigation-US-05 - Collector downloads only the surface they open

- **WHEN** a collector opens home cold
- **THEN** no script containing the profile's or sign-in's page code is
  downloaded

#### Scenario: zzz-site-site-navigation-SC-16 - The destination loads on arrival
**Serves:** zzz-site-site-navigation-US-05 - Collector downloads only the surface they open

- **GIVEN** a collector on home
- **WHEN** they move to sign-in
- **THEN** sign-in's page code loads and sign-in renders

### Requirement: Home and sign-in answer with what the session allows

Home and sign-in SHALL each answer with what the session allows: both answer
the profile for a signed-in collector. A correction SHALL move the address to
the surface shown, replacing the history entry it corrects. Only these
session-decided addresses, and the profile, SHALL wait for the session to
resolve.

#### Scenario: zzz-site-site-navigation-SC-17 - A signed-in collector lands on home
**Serves:** zzz-site-site-navigation-US-02 - Collector asks for a session-decided address

- **GIVEN** a signed-in collector
- **WHEN** they open the home address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: zzz-site-site-navigation-SC-18 - A signed-in collector asks for sign-in
**Serves:** zzz-site-site-navigation-US-02 - Collector asks for a session-decided address

- **GIVEN** a signed-in collector
- **WHEN** they open the sign-in address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: zzz-site-site-navigation-SC-19 - Back never returns to a corrected address
**Serves:** zzz-site-site-navigation-US-02 - Collector asks for a session-decided address

- **GIVEN** a collector whose navigation was just corrected
- **WHEN** they go back
- **THEN** they arrive where they were before asking, never at the address
  that corrected them forward

#### Scenario: zzz-site-site-navigation-SC-20 - Not-found does not wait
**Serves:** zzz-site-site-navigation-US-02 - Collector asks for a session-decided address

- **GIVEN** the session has not yet resolved
- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders without waiting for it

---

### Requirement: The profile answers on its own address, and leaving it goes home

A collector who arrives at the profile address without a session — directly,
by bookmark, or by going back or forward to it — SHALL land on that address.
The site SHALL NOT correct it to another surface. The sign-in dialog SHALL
open over it once the session has answered that there is none. A session
arriving SHALL render the profile there, with no navigation in between.

Dismissing that dialog SHALL take the collector to home, replacing the entry
the profile holds so that going back leads where they came from rather than
to the profile asking again.

#### Scenario: zzz-site-site-navigation-SC-21 - A signed-out collector opens the profile address
**Serves:** zzz-site-site-navigation-US-06 - Collector opens the profile with no session

- **GIVEN** a collector who is not signed in
- **WHEN** they open the profile address directly
- **THEN** the sign-in dialog opens over it
- **AND** the address still reads as the profile

#### Scenario: zzz-site-site-navigation-SC-22 - The session arrives and the profile renders
**Serves:** zzz-site-site-navigation-US-06 - Collector opens the profile with no session

- **GIVEN** a signed-out collector asked to sign in at the profile's own
  address
- **WHEN** their session arrives
- **THEN** the profile renders at that same address, with no navigation in
  between

#### Scenario: zzz-site-site-navigation-SC-23 - Leaving the ask at the profile's address goes home
**Serves:** zzz-site-site-navigation-US-06 - Collector opens the profile with no session

- **GIVEN** a signed-out collector asked to sign in at the profile's own
  address
- **WHEN** they dismiss the dialog
- **THEN** home renders and the address reads as home
- **AND** going back leads where they came from, never to the profile
