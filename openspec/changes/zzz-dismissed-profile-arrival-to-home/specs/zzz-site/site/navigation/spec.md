# zzz-site/site/navigation Specification

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

## ADDED Requirements

### Requirement: Home and sign-in answer with what the session allows

Home and sign-in SHALL each answer with what the session allows: both answer
the profile for a signed-in collector. A correction SHALL move the address to
the surface shown, replacing the history entry it corrects. Only these
session-decided addresses, and the profile, SHALL wait for the session to
resolve.

#### Scenario: zzz-site-site-navigation-SC-17 - A signed-in collector lands on home

- **GIVEN** a signed-in collector
- **WHEN** they open the home address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: zzz-site-site-navigation-SC-18 - A signed-in collector asks for sign-in

- **GIVEN** a signed-in collector
- **WHEN** they open the sign-in address
- **THEN** their profile renders and the address reads as the profile

#### Scenario: zzz-site-site-navigation-SC-19 - Back never returns to a corrected address

- **GIVEN** a collector whose navigation was just corrected
- **WHEN** they go back
- **THEN** they arrive where they were before asking, never at the address
  that corrected them forward

#### Scenario: zzz-site-site-navigation-SC-20 - Not-found does not wait

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

- **GIVEN** a collector who is not signed in
- **WHEN** they open the profile address directly
- **THEN** the sign-in dialog opens over it
- **AND** the address still reads as the profile

#### Scenario: zzz-site-site-navigation-SC-22 - The session arrives and the profile renders

- **GIVEN** a signed-out collector asked to sign in at the profile's own
  address
- **WHEN** their session arrives
- **THEN** the profile renders at that same address, with no navigation in
  between

#### Scenario: zzz-site-site-navigation-SC-23 - Leaving the ask at the profile's address goes home

- **GIVEN** a signed-out collector asked to sign in at the profile's own
  address
- **WHEN** they dismiss the dialog
- **THEN** home renders and the address reads as home
- **AND** going back leads where they came from, never to the profile

## REMOVED Requirements

### Requirement: The session corrects a session-decided address

**Reason:** This requirement was wrong the day it was written for one of its
three addresses: it has always said a signed-out profile visit is corrected
to the sign-in address, and the site has never done that — the address stays
`/profile` and the dialog opens over it. Splitting it is what a correct
statement needs: home and sign-in still correct exactly as before, restated
above; the profile gets its own requirement for what it has actually always
done, plus the one behavior it never had — leaving the ask goes home instead
of stranding the collector on a blank page.

**Migration:** None for a collector: nothing they can reach behaves as this
requirement described, and nothing that was true stops being true. Home and
sign-in's rules carry forward unchanged under new ids —
`zzz-site-site-navigation-SC-04` becomes `-SC-17`, `-SC-05` becomes `-SC-18`,
`-SC-07` becomes `-SC-19`, `-SC-08` becomes `-SC-20`. `-SC-06` retires outright
and is not reissued: nothing the site does matches what it described.
`zzz-site-site-navigation-US-02` is restated under the same id with the
narrowed set of scenarios.
