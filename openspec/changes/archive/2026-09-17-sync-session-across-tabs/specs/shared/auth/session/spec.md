## Purpose
Who a signed-in person is on either brand: what a product receives when it
reads the caller, that sign-in is brand-wide, that user id keys identity, that
a surface already open keeps up with the session, and how analytics names a
visitor. Which events a product records belong to that product.

## Feature set

- Open tabs
  - Session arrives: a surface left open shows the person signed in
  - Session ends: a surface left open shows them signed out, whether they ended it or it ran out
  - Session becomes somebody else: the surface shows whoever is signed in now
  - Per-person data: what a surface shows about the person follows the person
  - Keeping up: no later than the person's return, and promptly on the same site
  - Unreachable service: a surface that cannot tell goes on showing what it knew

## ADDED Requirements

### Requirement: An open surface keeps up with the session on this device

A surface already open SHALL show the session this device holds now. It SHALL
do so whether the session arrived, ended, or became another person while the
surface sat unattended. A session that ran out SHALL be shown as one the
person ended. The surface SHALL change what it shows without announcing that
it changed.

WHEN the session changed on another surface of the same site in this browser,
the surface SHALL keep up promptly, whether or not the person left it. In
every other case it SHALL keep up no later than when they return to it.
Keeping up only after the person reloads the surface SHALL NOT satisfy this.

#### Scenario: shared-auth-session-SC-11 - A session that arrived elsewhere reaches an open surface
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** a surface of a brand open and signed out
- **WHEN** the person signs in to that brand elsewhere on this device and then
  returns to that surface
- **THEN** the surface shows them signed in as that person
- **AND** it does so without them reloading it

#### Scenario: shared-auth-session-SC-12 - A session ended elsewhere reaches an open surface
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** a surface of a brand open and signed in
- **WHEN** the person ends that session elsewhere on this device and then
  returns to that surface
- **THEN** the surface shows them signed out
- **AND** it does so without them reloading it

#### Scenario: shared-auth-session-SC-13 - A session that ran out reaches an open surface
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** a surface of a brand open and signed in
- **WHEN** that session runs out and the person returns to that surface
- **THEN** the surface shows them signed out
- **AND** it shows them signed out the same way as a session they ended
  themselves

#### Scenario: shared-auth-session-SC-14 - A session that became somebody else reaches an open surface
**Serves:** shared-auth-session-US-06 - Collector who signs in after somebody else sees their own things

- **GIVEN** a surface of a brand open and signed in as one person
- **WHEN** a different person signs in to that brand elsewhere on this device
  and that surface is returned to
- **THEN** the surface shows the person signed in now
- **AND** it does not show the earlier person as signed in

#### Scenario: shared-auth-session-SC-15 - The surface does not announce that it kept up
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** a surface of a brand open and signed out
- **WHEN** the person signs in to that brand elsewhere on this device and then
  returns to that surface
- **THEN** the surface shows them signed in
- **AND** no message on it announces that the session changed

#### Scenario: shared-auth-session-SC-22 - A surface the person never left keeps up anyway
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** two surfaces of one site open side by side and in view, both
  signed out
- **WHEN** the person signs in on one of them and does not leave the other
- **THEN** the other shows them signed in promptly
- **AND** they did not have to leave it and come back for that

#### Scenario: shared-auth-session-SC-23 - The same person signing in again changes nothing on an open surface
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** a surface of a brand open and signed in as one person
- **WHEN** that same person signs in to that brand again elsewhere on this
  device and the surface is returned to
- **THEN** the surface still shows them signed in as that person
- **AND** it does not show them signed out at any point

### Requirement: Every open surface of the brand in this browser keeps up

A session belongs to the browser, not to one surface of it. WHEN a session
arrives, ends, or becomes another person, every surface of that brand open in
that browser SHALL keep up on the terms above — not only the surface where the
session changed, and not only the surface that asked for it. A surface of
another brand SHALL NOT change who it shows as signed in. A surface open in
another browser, or on another device, SHALL NOT change who it shows as
signed in.

#### Scenario: shared-auth-session-SC-16 - Every open surface of the brand keeps up, not only the one that asked
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** three surfaces of one brand open in a browser, all signed out
- **WHEN** the person signs in on one of them and then returns to each of the
  other two
- **THEN** each of them shows them signed in as that person

#### Scenario: shared-auth-session-SC-17 - Another brand's open surface does not keep up
**Serves:** Open tabs - a session on one brand leaves the other brand's open surface alone

- **GIVEN** a Grade10 surface and a ZZZ surface open in one browser, both
  signed out
- **WHEN** the person signs in on the Grade10 surface and then returns to the
  ZZZ surface
- **THEN** the ZZZ surface still shows them signed out

#### Scenario: shared-auth-session-SC-18 - Another browser's open surface does not keep up
**Serves:** Open tabs - a session reaches no further than the browser it was created in

- **GIVEN** a surface of a brand open and signed out in one browser
- **AND** a surface of the same brand open and signed out in another browser
  or on another device
- **WHEN** the person signs in to that brand in the first browser and then
  returns to the second
- **THEN** the second still shows them signed out

### Requirement: What an open surface shows about the person follows the person

WHEN the session on an open surface becomes another person, that surface SHALL
show what it holds about the person signed in now — their cart, their
watchlist, their orders — and SHALL NOT show any of it for the person signed
in before. WHEN the session on an open surface ends, that surface SHALL stop
showing what it held about that person; ceasing to show is not the
surface-owned cleanup a confirmed sign-out runs, which stays
`shared/auth/sign-out`'s. WHEN an open surface needs a session to have
anything to show and its session ends, it SHALL answer the person exactly as
it answers somebody arriving at it with no session.

#### Scenario: shared-auth-session-SC-19 - A surface shows the new person their own things
**Serves:** shared-auth-session-US-06 - Collector who signs in after somebody else sees their own things

- **GIVEN** a surface open and signed in as one person, showing that person's
  cart, watchlist and orders
- **WHEN** a different person signs in to that brand elsewhere on this device
  and that surface is returned to
- **THEN** the surface shows the cart, watchlist and orders of the person
  signed in now

#### Scenario: shared-auth-session-SC-20 - A surface keeps none of the earlier person's things
**Serves:** shared-auth-session-US-06 - Collector who signs in after somebody else sees their own things

- **GIVEN** a surface open and signed in as one person, showing that person's
  cart, watchlist and orders
- **WHEN** a different person signs in to that brand elsewhere on this device
  and that surface is returned to
- **THEN** nothing the earlier person had in their cart, watchlist or orders
  is shown on that surface

#### Scenario: shared-auth-session-SC-21 - A surface whose session ended shows nobody's things
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** a surface open and signed in, showing that person's cart,
  watchlist and orders
- **WHEN** the session ends and the person returns to that surface
- **THEN** the surface shows them signed out
- **AND** it no longer shows that person's cart, watchlist or orders

#### Scenario: shared-auth-session-SC-24 - A surface that needs a session asks for one when the session ends
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** an open surface that needs a session to have anything to show
- **WHEN** that session ends elsewhere on this device and the person returns
  to the surface
- **THEN** it answers them the same way it answers somebody who arrives at it
  with no session

### Requirement: A surface that cannot read the session keeps what it showed

WHEN a surface tries to read the session and gets no answer — the service
cannot be reached, or the device is offline — it SHALL go on showing what it
last knew, and SHALL ask again later. Only an answer that the caller is not
signed in SHALL make a surface show them signed out.

#### Scenario: shared-auth-session-SC-25 - A read that fails leaves the surface as it was
**Serves:** Open tabs - a surface that cannot reach the service shows what it last knew

- **GIVEN** an open surface showing a signed-in person
- **WHEN** it tries to read the session and cannot reach the service
- **THEN** it still shows that person signed in
- **AND** it does not show them signed out

#### Scenario: shared-auth-session-SC-26 - A read answering that nobody is signed in signs the surface out
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** an open surface showing a signed-in person
- **WHEN** it reads the session and the answer is that nobody is signed in
- **THEN** it shows them signed out
