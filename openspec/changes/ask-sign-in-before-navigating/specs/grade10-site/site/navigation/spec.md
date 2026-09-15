# grade10-site/site/navigation Specification

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

## ADDED Requirements

### Requirement: Every session-shaped surface says what it does without a session

Each surface that has nothing on it for a collector without a session SHALL
declare one of two answers, and the site SHALL behave as declared wherever the
collector reaches it from.

| Surface | Without a session |
| --- | --- |
| Checkout, the vault, one vault case, the profile, bidding history, the auction watchlist, a won lot's order, membership, joining the programme | Asks for sign-in |
| A booking's private link, a collector's own visits, the signing ceremony, the identity check, the sign-in address | Opens as asked |

A surface that opens as asked SHALL do so whether or not the collector has a
session: its link carries the secret that opens it, or the surface invites
sign-in in its own words, and an ask in front of it would hide what it is for.

#### Scenario: grade10-site-site-navigation-SC-15 - A surface that answers the signed-out opens as asked

- **GIVEN** a collector who is not signed in
- **WHEN** they follow a link to their own visits
- **THEN** that surface renders at its own address, inviting them to sign in
- **AND** no sign-in dialog opens in front of it

#### Scenario: grade10-site-site-navigation-SC-16 - A secret in the link opens its surface

- **GIVEN** the holder of a booking's private link who has no account on the
  site
- **WHEN** they open it
- **THEN** the surface that link names renders
- **AND** they are not asked to sign in before it

---

### Requirement: A surface that asks for sign-in asks before it is entered

When a collector without a session takes a navigation inside the site to a
surface that asks for sign-in, the site SHALL NOT change the address. The
sign-in dialog SHALL open over the surface the collector is already on, and
that surface SHALL remain rendered with its state intact.

Dismissing the dialog SHALL leave the collector on that surface and SHALL NOT
navigate anywhere. The navigation they were stopped on SHALL be dropped, and
no history entry SHALL be left for it.

A session arriving while the dialog is open SHALL close it and take the
collector to the surface they asked for, with no further action from them.

#### Scenario: grade10-site-site-navigation-SC-17 - A signed-out collector follows a link to a surface that asks

- **GIVEN** a collector who is not signed in, reading the store
- **WHEN** they follow a link to the vault
- **THEN** the sign-in dialog opens over the store
- **AND** the address still reads as the store

#### Scenario: grade10-site-site-navigation-SC-18 - Dismissing leaves the collector where they were

- **GIVEN** a signed-out collector asked to sign in after following a link to
  the vault from the store
- **WHEN** they dismiss the dialog
- **THEN** they are left on the store with its state intact
- **AND** the address still reads as the store

#### Scenario: grade10-site-site-navigation-SC-19 - Signing in finishes the navigation

- **GIVEN** a signed-out collector asked to sign in after following a link to
  the vault
- **WHEN** their session arrives while that dialog is open
- **THEN** the dialog closes
- **AND** the vault renders at its own address, with nothing else to press

#### Scenario: grade10-site-site-navigation-SC-20 - The dropped navigation leaves no entry behind

- **GIVEN** a signed-out collector who dismissed the ask after following a link
  to the vault from the store
- **WHEN** they go back
- **THEN** they arrive wherever they were before the store, never at the vault

---

### Requirement: Arriving without a session is answered on the surface

A collector who arrives at a surface that asks for sign-in — by opening its
address directly, by following a link from outside the site, or by going back
or forward to it — SHALL land on that address. The site SHALL NOT correct the
address to another surface.

The surface SHALL show nothing of its own, and the sign-in dialog SHALL open
over it once the session has answered that there is none. A session arriving
SHALL render the surface there, with no navigation in between.

Dismissing that dialog SHALL take the collector to the brand home, replacing
the entry the surface holds so that going back leads where they came from
rather than to the surface asking again. This is the one difference from a
collector stopped before an in-app navigation, who still has the surface they
were reading and is left on it.

#### Scenario: grade10-site-site-navigation-SC-21 - A signed-out collector opens the address itself

- **GIVEN** a collector who is not signed in
- **WHEN** they open the vault's address directly
- **THEN** the sign-in dialog opens over it
- **AND** the address still reads as the vault

#### Scenario: grade10-site-site-navigation-SC-22 - The session arrives and the surface renders

- **GIVEN** a signed-out collector asked to sign in at the vault's own address
- **WHEN** their session arrives
- **THEN** the vault renders at that same address, with no navigation in
  between

#### Scenario: grade10-site-site-navigation-SC-23 - Back onto a surface that asks is answered there

- **GIVEN** a signed-out collector who was signed in on the vault and has since
  signed out on another surface
- **WHEN** they go back to the vault
- **THEN** the address reads as the vault and the sign-in dialog opens over it

#### Scenario: grade10-site-site-navigation-SC-25 - Leaving the ask at the address goes to the brand home

- **GIVEN** a signed-out collector asked to sign in at the vault's own address
- **WHEN** they dismiss the dialog
- **THEN** the brand home renders and the address reads as the brand home
- **AND** going back leads where they came from, never to the vault

---

### Requirement: Only a surface that needs a session waits for one

A public surface SHALL render before the session has answered. Waiting for it
SHALL be confined to the surfaces that have nothing to show without one.

#### Scenario: grade10-site-site-navigation-SC-24 - A public surface does not wait

- **GIVEN** the session has not yet answered
- **WHEN** a collector opens any public surface
- **THEN** that surface renders without waiting for it

## REMOVED Requirements

### Requirement: The session corrects a session-decided address

**Reason:** Sign-in is a dialog over what the collector was already reading,
not a surface, so there is nothing to correct an address to and no corrected
entry to replace. The profile address stays the profile address and is asked
over; the sign-in address is an old bookmark that sends its reader to the brand
home with the dialog open. The requirements above replace this one, the last of
them carrying forward the rule it stated that still holds: only a surface
needing a session waits for one.

**Migration:** None for a collector — nothing they can reach behaves as this
requirement described. `grade10-site-site-navigation-SC-07` through `-SC-10`
are retired and their ids are not reissued; `-SC-10` is restated as `-SC-24`.
`grade10-site-site-navigation-US-03` is retired with them, and the cases
tracing it leave the suite.
