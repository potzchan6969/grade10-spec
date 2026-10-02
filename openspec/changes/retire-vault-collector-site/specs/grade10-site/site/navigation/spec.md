# grade10-site/site/navigation Specification

## MODIFIED Requirements

### Requirement: Every session-shaped surface says what it does without a session

Each surface that has nothing on it for a collector without a session SHALL
declare one of two answers, and the site SHALL behave as declared wherever the
collector reaches it from.

| Surface | Without a session |
| --- | --- |
| Checkout, the profile, bidding history, the auction watchlist, a won lot's order, membership, joining the programme | Asks for sign-in |
| A booking's private link, a collector's own visits, the signing ceremony, the sign-in address | Opens as asked |

A surface that opens as asked SHALL do so whether or not the collector has a
session: its link carries the secret that opens it, or the surface invites
sign-in in its own words, and an ask in front of it would hide what it is for.

<!-- trace:scenario id=g10.site-navigation.SC-clu rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-15 - A surface that answers the signed-out opens as asked
**Serves:** grade10-site-site-navigation-US-08 - Collector opens a surface that asks nothing of them

- **GIVEN** a collector who is not signed in
- **WHEN** they follow a link to their own visits
- **THEN** that surface renders at its own address, inviting them to sign in
- **AND** no sign-in dialog opens in front of it

<!-- trace:scenario id=g10.site-navigation.SC-wnv rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-16 - A secret in the link opens its surface
**Serves:** grade10-site-site-navigation-US-08 - Collector opens a surface that asks nothing of them

- **GIVEN** the holder of a booking's private link who has no account on the
  site
- **WHEN** they open it
- **THEN** the surface that link names renders
- **AND** they are not asked to sign in before it

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

<!-- trace:scenario id=g10.site-navigation.SC-ceg rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-17 - A signed-out collector follows a link to a surface that asks
**Serves:** grade10-site-site-navigation-US-06 - Collector follows a link to a surface that needs an account

- **GIVEN** a collector who is not signed in, reading the store
- **WHEN** they follow a link to their bidding history
- **THEN** the sign-in dialog opens over the store
- **AND** the address still reads as the store

<!-- trace:scenario id=g10.site-navigation.SC-32w rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-18 - Dismissing leaves the collector where they were
**Serves:** grade10-site-site-navigation-US-06 - Collector follows a link to a surface that needs an account

- **GIVEN** a signed-out collector asked to sign in after following a link to
  their bidding history from the store
- **WHEN** they dismiss the dialog
- **THEN** they are left on the store with its state intact
- **AND** the address still reads as the store

<!-- trace:scenario id=g10.site-navigation.SC-jzp rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-19 - Signing in finishes the navigation
**Serves:** grade10-site-site-navigation-US-06 - Collector follows a link to a surface that needs an account

- **GIVEN** a signed-out collector asked to sign in after following a link to
  their bidding history
- **WHEN** their session arrives while that dialog is open
- **THEN** the dialog closes
- **AND** their bidding history renders at its own address, with nothing else to press

<!-- trace:scenario id=g10.site-navigation.SC-rrx rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-20 - The dropped navigation leaves no entry behind
**Serves:** grade10-site-site-navigation-US-06 - Collector follows a link to a surface that needs an account

- **GIVEN** a signed-out collector who dismissed the ask after following a link
  to their bidding history from the store
- **WHEN** they go back
- **THEN** they arrive wherever they were before the store, never at their bidding history

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

<!-- trace:scenario id=g10.site-navigation.SC-b18 rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-21 - A signed-out collector opens the address itself
**Serves:** grade10-site-site-navigation-US-07 - Collector opens a surface that needs an account at its own address

- **GIVEN** a collector who is not signed in
- **WHEN** they open their bidding history's address directly
- **THEN** the sign-in dialog opens over it
- **AND** the address still reads as their bidding history

<!-- trace:scenario id=g10.site-navigation.SC-yjb rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-22 - The session arrives and the surface renders
**Serves:** grade10-site-site-navigation-US-07 - Collector opens a surface that needs an account at its own address

- **GIVEN** a signed-out collector asked to sign in at their bidding history's own address
- **WHEN** their session arrives
- **THEN** their bidding history renders at that same address, with no navigation in
  between

<!-- trace:scenario id=g10.site-navigation.SC-pih rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-23 - Back onto a surface that asks is answered there
**Serves:** grade10-site-site-navigation-US-07 - Collector opens a surface that needs an account at its own address

- **GIVEN** a signed-out collector who was signed in on their bidding history and has since
  signed out on another surface
- **WHEN** they go back to their bidding history
- **THEN** the address reads as their bidding history and the sign-in dialog opens over it

<!-- trace:scenario id=g10.site-navigation.SC-1vk rev=1 -->
#### Scenario: grade10-site-site-navigation-SC-25 - Leaving the ask at the address goes to the brand home
**Serves:** grade10-site-site-navigation-US-07 - Collector opens a surface that needs an account at its own address

- **GIVEN** a signed-out collector asked to sign in at their bidding history's own address
- **WHEN** they dismiss the dialog
- **THEN** the brand home renders and the address reads as the brand home
- **AND** going back leads where they came from, never to their bidding history
