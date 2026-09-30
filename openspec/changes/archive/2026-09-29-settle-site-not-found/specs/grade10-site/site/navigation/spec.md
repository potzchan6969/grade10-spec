# grade10-site/site/navigation Specification

## Feature set

- Address resolution
  - One surface per address: every address resolves to at most one surface
  - Nested ownership: a surface owns the addresses beneath it unless a nested
    surface names one, and the deepest one naming it renders
  - Not-found fallback: an address under no surface renders the not-found
    surface with a static title, description, and a way home — never naming
    the address
- In-page navigation
  - No document load: a link from one surface to another, the chrome's
    included, navigates without reloading the document
  - The browser's own clicks: a modified click, a link that opens elsewhere by
    its own declaration, and another origin are left untouched
- Surfaces that need an account
  - What each surface does without one: every session-shaped surface either
    asks for sign-in or opens as asked
  - Asked before the move: an in-app navigation to one that asks does not
    change the address, and the dialog opens over where the collector is
  - Carried on: a session arriving while that dialog is open finishes the
    navigation it interrupted
  - Answered on arrival: an address opened from outside the site lands on the
    surface, which asks there and is never corrected to another
  - Nothing else waits: a public surface renders before the session answers
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

The site SHALL resolve every address to at most one surface. A surface SHALL
own every address beneath its own, so a deeper address answers as that
surface — unless a nested surface names that address, in which case the
nested one renders. Where more than one surface could own an address, the
deepest one naming it SHALL be the one that renders. An address under no
surface SHALL resolve to the not-found surface. The not-found surface's title
and description SHALL be static text that never includes the failed address
or any other dynamic content, and it SHALL offer a control back to home.

#### Scenario: grade10-site-site-navigation-SC-01 - A nested address answers as its surface
**Serves:** grade10-site-site-navigation-US-01 - Collector reaches the surface an address names

- **WHEN** a collector opens an address beneath a surface that no surface of
  its own names, such as an address beneath the store
- **THEN** that surface renders

#### Scenario: grade10-site-site-navigation-SC-02 - A nested surface renders for itself
**Serves:** grade10-site-site-navigation-US-01 - Collector reaches the surface an address names

- **WHEN** a collector opens an address a nested surface names, such as a
  mailed lot link beneath the auction
- **THEN** the nested surface renders, not the surface above it

#### Scenario: grade10-site-site-navigation-SC-03 - An unknown address resolves to not-found
**Serves:** grade10-site-site-navigation-US-01 - Collector reaches the surface an address names

- **WHEN** a collector opens an address under no surface the site answers
- **THEN** the not-found surface renders, showing its static title and
  description

#### Scenario: grade10-site-site-navigation-SC-26 - Back to Home leaves the not-found surface for the brand home
**Serves:** grade10-site-site-navigation-US-01 - Collector reaches the surface an address names

- **GIVEN** a collector on the not-found surface
- **WHEN** they choose Back to Home
- **THEN** the brand home renders
