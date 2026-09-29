# zzz-site/site/navigation Specification

## Feature set

- Address resolution
  - An address per surface: home, sign-in, and the profile each answer at an
    address of their own, by link or by refresh
  - Deepest surface wins: a surface owns the addresses beneath it unless a
    nested surface names one
  - Not-found fallback: an address under no surface renders a not-found
    surface with a static title, description, and a way home — never naming
    it, never home
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

## MODIFIED Requirements

### Requirement: An address resolves to one surface

The site SHALL answer home, sign-in, and the profile each at an address of
its own, and SHALL resolve every address to at most one surface. A surface
SHALL own every address beneath its own, unless a nested surface names that
address, in which case the nested one renders; where more than one surface
could own an address, the deepest one naming it SHALL be the one that
renders. An address under no surface SHALL resolve to a not-found surface,
never to home. The not-found surface's title and description SHALL be static
text that never includes the failed address or any other dynamic content, and
it SHALL offer a control back to home.

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
- **THEN** the not-found surface renders, showing its static title and
  description

#### Scenario: zzz-site-site-navigation-SC-24 - Back to Home leaves the not-found surface for home
**Serves:** zzz-site-site-navigation-US-01 - Collector opens a ZZZ address directly

- **GIVEN** a collector on the not-found surface
- **WHEN** they choose Back to Home
- **THEN** home renders
