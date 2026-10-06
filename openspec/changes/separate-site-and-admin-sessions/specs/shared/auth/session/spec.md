# shared/auth/session — delta

## Purpose
Who a signed-in person is on either brand: what a product receives when it
reads the caller, that the site and the admin console each hold a session of
their own, that user id keys identity, that a surface already open keeps up
with its own session, and how analytics names a visitor. Which events a
product records belong to that product.

## Feature set

- Caller identity
  - Named person: a signed-in read reports user id, email, name, and roles
  - Signed-out empty: a signed-out read reports no person
- Brand scope
  - One brand: sign-in covers the brand's site and none of another brand
- Stable key
  - User id: account data and another person's identity are keyed by user id
- Analytics identity
  - Signed-in is the user: a signed-in event names the person; anonymous names the device
- Surface sessions
  - Console apart: signing in to the console does not sign the person in on the site, and signing in on the site does not open the console
  - Independent ends: the site's session and the console's session each last, expire and end on their own
  - Console recency: second factor and recent sign-in are read on the console's own session, never the site's
  - Surface check: the console checks which surface a session was made on, and refuses one made on the site
  - Release re-sign-in: the console stops honouring the site's session at release, and operators sign in to it once more
- Open tabs
  - Session arrives: a surface left open shows the person signed in
  - Session ends: a surface left open shows them signed out, whether they ended it or it ran out
  - Session becomes somebody else: the surface shows whoever is signed in now
  - Per-person data: what a surface shows about the person follows the person
  - Own surface: a tab follows its own surface's session and no other
  - Keeping up: no later than the person's return, and promptly on the same surface
  - Unreachable service: a surface that cannot tell goes on showing what it knew

## REMOVED Requirements

### Requirement: Sign-in covers the brand, not another brand

**Reason:** One sign-in no longer covers every site of the brand. The site and
the console each hold a session of their own, so the brand-wide rule and its
scenario shared-auth-session-SC-03 are wrong. The rule that a sign-in does
not cross brands is unchanged and is stated again, with a new id, in the
requirement that replaces this one.

**Migration:** `A sign-in covers the surface that made it, on its own brand`
below states what a sign-in covers. shared-auth-session-SC-04 is retired and
reissued as `shared-auth-session-SC-29`.

## RENAMED Requirements

- FROM: `### Requirement: Every open surface of the brand in this browser keeps up`
- TO: `### Requirement: Every open tab of a surface in this browser keeps up`

### Requirement: Every open tab of a surface in this browser keeps up

A session belongs to the browser and to one surface, the site or the console.
WHEN a session arrives, ends, or becomes another person on one surface, every
tab of that surface open in that browser SHALL keep up on the terms above — not
only the tab where the session changed, and not only the tab that asked for
it. A tab of the other surface SHALL NOT change who it shows as signed in. A
tab of another brand SHALL NOT change who it shows as signed in. A tab open in
another browser, or on another device, SHALL NOT change who it shows as signed
in.

<!-- trace:scenario id=g10.shared-session.SC-sqp rev=1 -->
#### Scenario: shared-auth-session-SC-16 - Every open surface of the brand keeps up, not only the one that asked
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** three tabs of one surface of a brand open in a browser, all signed
  out
- **WHEN** the person signs in on one of them and then returns to each of the
  other two
- **THEN** each of them shows them signed in as that person

<!-- trace:scenario id=g10.shared-session.SC-2te rev=1 -->
#### Scenario: shared-auth-session-SC-17 - Another brand's open surface does not keep up
**Serves:** Open tabs - a session on one brand leaves the other brand's open surface alone

- **GIVEN** a Grade10 tab and a ZZZ tab open in one browser, both signed out
- **WHEN** the person signs in on the Grade10 tab and then returns to the ZZZ
  tab
- **THEN** the ZZZ tab still shows them signed out

<!-- trace:scenario id=g10.shared-session.SC-kiw rev=1 -->
#### Scenario: shared-auth-session-SC-18 - Another browser's open surface does not keep up
**Serves:** Open tabs - a session reaches no further than the browser it was created in

- **GIVEN** a tab of a surface open and signed out in one browser
- **AND** a tab of the same surface open and signed out in another browser or
  on another device
- **WHEN** the person signs in to that surface in the first browser and then
  returns to the second
- **THEN** the second still shows them signed out

#### Scenario: shared-auth-session-SC-39 - A tab of the other surface does not keep up
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** a site tab and a console tab open in one browser, both signed out
- **WHEN** the person signs in on the site tab and then returns to the console
  tab
- **THEN** the console tab still shows them signed out

#### Scenario: shared-auth-session-SC-40 - A console tab follows the console's own session
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** a console tab open and signed out, and a site tab open and signed
  in
- **WHEN** the person signs in to the console elsewhere on this device and
  then returns to the console tab
- **THEN** the console tab shows them signed in
- **AND** the site tab is unchanged

## MODIFIED Requirements

### Requirement: A signed-in person is named by id, email, name, and roles

A signed-in read SHALL report the person's user id, email address, name,
and roles. A signed-out read SHALL report no person. A read SHALL answer for
the session of the surface it is made from, the site or the console.

<!-- trace:scenario id=g10.shared-session.SC-xll rev=1 -->
#### Scenario: shared-auth-session-SC-01 - Signed in
**Serves:** shared-auth-session-US-01 - Collector is named on every surface they use

- **GIVEN** a person signed in to a brand on one surface, the site or the
  console
- **WHEN** a product of that brand reads who is calling from that surface
- **THEN** it receives that person's user id, email, name, and roles

<!-- trace:scenario id=g10.shared-session.SC-yja rev=1 -->
#### Scenario: shared-auth-session-SC-02 - Signed out
**Serves:** shared-auth-session-US-01 - Collector is named on every surface they use

- **GIVEN** a caller who is not signed in on the surface they call from
- **WHEN** a product reads who is calling
- **THEN** it receives no person

### Requirement: An open surface keeps up with the session on this device

A tab already open SHALL show the session this device holds now for its own
surface, the site or the console. It SHALL do so whether the session arrived,
ended, or became another person while the tab sat unattended. A session that
ran out SHALL be shown as one the person ended. The tab SHALL change what it
shows without announcing that it changed.

WHEN the session of a tab's surface changed on another tab of that surface in
this browser, the tab SHALL keep up promptly, whether or not the person left
it. In every other case it SHALL keep up no later than when they return to it.
Keeping up only after the person reloads the tab SHALL NOT satisfy this.

<!-- trace:scenario id=g10.shared-session.SC-fnz rev=1 -->
#### Scenario: shared-auth-session-SC-11 - A session that arrived elsewhere reaches an open surface
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** a tab of a surface open and signed out
- **WHEN** the person signs in to that same surface elsewhere on this device
  and then returns to that tab
- **THEN** the tab shows them signed in as that person
- **AND** it does so without them reloading it

<!-- trace:scenario id=g10.shared-session.SC-n9f rev=1 -->
#### Scenario: shared-auth-session-SC-12 - A session ended elsewhere reaches an open surface
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** a tab of a surface open and signed in
- **WHEN** the person ends that surface's session elsewhere on this device
  and then returns to that tab
- **THEN** the tab shows them signed out
- **AND** it does so without them reloading it

<!-- trace:scenario id=g10.shared-session.SC-lp3 rev=1 -->
#### Scenario: shared-auth-session-SC-13 - A session that ran out reaches an open surface
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** a tab of a surface open and signed in
- **WHEN** that session runs out and the person returns to that tab
- **THEN** the tab shows them signed out
- **AND** it shows them signed out the same way as a session they ended
  themselves

<!-- trace:scenario id=g10.shared-session.SC-pyv rev=1 -->
#### Scenario: shared-auth-session-SC-14 - A session that became somebody else reaches an open surface
**Serves:** shared-auth-session-US-06 - Collector who signs in after somebody else sees their own things

- **GIVEN** a tab of a surface open and signed in as one person
- **WHEN** a different person signs in to that same surface elsewhere on this
  device and that tab is returned to
- **THEN** the tab shows the person signed in now
- **AND** it does not show the earlier person as signed in

<!-- trace:scenario id=g10.shared-session.SC-fmt rev=1 -->
#### Scenario: shared-auth-session-SC-15 - The surface does not announce that it kept up
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** a tab of a surface open and signed out
- **WHEN** the person signs in to that same surface elsewhere on this device
  and then returns to that tab
- **THEN** the tab shows them signed in
- **AND** no message on it announces that the session changed

<!-- trace:scenario id=g10.shared-session.SC-lgf rev=1 -->
#### Scenario: shared-auth-session-SC-22 - A surface the person never left keeps up anyway
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** two tabs of one surface open side by side and in view, both
  signed out
- **WHEN** the person signs in on one of them and does not leave the other
- **THEN** the other shows them signed in promptly
- **AND** they did not have to leave it and come back for that

<!-- trace:scenario id=g10.shared-session.SC-hc7 rev=1 -->
#### Scenario: shared-auth-session-SC-23 - The same person signing in again changes nothing on an open surface
**Serves:** shared-auth-session-US-04 - Collector returns to a tab they left and it knows they signed in

- **GIVEN** a tab of a surface open and signed in as one person
- **WHEN** that same person signs in to that same surface again elsewhere on
  this device and the tab is returned to
- **THEN** the tab still shows them signed in as that person
- **AND** it does not show them signed out at any point

### Requirement: What an open surface shows about the person follows the person

WHEN the session of a tab's surface becomes another person, that tab SHALL show
what it holds about the person signed in now — their cart, their watchlist,
their orders — and SHALL NOT show any of it for the person signed in before. A
sign-in on the other surface SHALL NOT change what the tab shows. WHEN the
session of a tab's surface ends, that tab SHALL stop showing what it held about
that person; ceasing to show is not the surface-owned cleanup a confirmed
sign-out runs, which stays `shared/auth/sign-out`'s. WHEN a tab needs a session
to have anything to show and its surface's session ends, it SHALL answer the
person exactly as it answers somebody arriving at it with no session.

<!-- trace:scenario id=g10.shared-session.SC-4mx rev=1 -->
#### Scenario: shared-auth-session-SC-19 - A surface shows the new person their own things
**Serves:** shared-auth-session-US-06 - Collector who signs in after somebody else sees their own things

- **GIVEN** a tab open and signed in as one person, showing that person's cart,
  watchlist and orders
- **WHEN** a different person signs in to that same surface of that brand
  elsewhere on this device and that tab is returned to
- **THEN** the tab shows the cart, watchlist and orders of the person signed in
  now

<!-- trace:scenario id=g10.shared-session.SC-ekp rev=1 -->
#### Scenario: shared-auth-session-SC-20 - A surface keeps none of the earlier person's things
**Serves:** shared-auth-session-US-06 - Collector who signs in after somebody else sees their own things

- **GIVEN** a tab open and signed in as one person, showing that person's cart,
  watchlist and orders
- **WHEN** a different person signs in to that same surface of that brand
  elsewhere on this device and that tab is returned to
- **THEN** nothing the earlier person had in their cart, watchlist or orders is
  shown on that tab

<!-- trace:scenario id=g10.shared-session.SC-etz rev=1 -->
#### Scenario: shared-auth-session-SC-21 - A surface whose session ended shows nobody's things
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** a tab open and signed in, showing that person's cart, watchlist and
  orders
- **WHEN** its surface's session ends and the person returns to that tab
- **THEN** the tab shows them signed out
- **AND** it no longer shows that person's cart, watchlist or orders

<!-- trace:scenario id=g10.shared-session.SC-bc8 rev=1 -->
#### Scenario: shared-auth-session-SC-24 - A surface that needs a session asks for one when the session ends
**Serves:** shared-auth-session-US-05 - Collector returns to a tab they left and it knows they signed out

- **GIVEN** a tab that needs a session to have anything to show
- **WHEN** its surface's session ends elsewhere on this device and the person
  returns to the tab
- **THEN** it answers them the same way it answers somebody who arrives at it
  with no session

## ADDED Requirements

### Requirement: A sign-in covers the surface that made it, on its own brand

A sign-in SHALL sign the person in on the surface it was made on, the site or
the console, and on that surface only. A sign-in on the site SHALL NOT sign
the person in to the console, and a sign-in to the console SHALL NOT sign
them in on the site. A sign-in on one brand SHALL NOT sign them in on another.

#### Scenario: shared-auth-session-SC-27 - A site sign-in does not open the console
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** an operator signed in on the site
- **WHEN** they open the console
- **THEN** the console shows them signed out

#### Scenario: shared-auth-session-SC-28 - A console sign-in does not sign the person in on the site
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** an operator signed in to the console
- **WHEN** they open the site
- **THEN** the site shows them signed out

#### Scenario: shared-auth-session-SC-29 - Sign-in does not cross brands
**Serves:** shared-auth-session-US-02 - Collector stays signed in across the brand

- **GIVEN** a person signed in on Grade10
- **WHEN** they open a ZZZ site
- **THEN** they are not signed in there

#### Scenario: shared-auth-session-SC-41 - A site sign-in covers the site's other pages
**Serves:** shared-auth-session-US-02 - Collector stays signed in across the brand

- **GIVEN** a person signed in on a page of a brand's site
- **WHEN** they open another page of that site
- **THEN** they are signed in there as the same person

### Requirement: The site session and the console session last and end on their own

A person SHALL be able to hold a site session and a console session at the
same time, as the same account or as different accounts. Each SHALL expire,
and SHALL end, without ending the other.

#### Scenario: shared-auth-session-SC-30 - Both sessions are held at once, as different accounts
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** a person signed in on the site as one account
- **WHEN** they sign in to the console as a different account
- **THEN** the site still shows the first account
- **AND** the console shows the second

#### Scenario: shared-auth-session-SC-31 - A console session that runs out leaves the site signed in
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** an operator signed in on the site and on the console
- **WHEN** the console session runs out
- **THEN** the console shows them signed out
- **AND** the site still shows them signed in

#### Scenario: shared-auth-session-SC-32 - A site session that runs out leaves the console signed in
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** an operator signed in on the site and on the console
- **WHEN** the site session runs out
- **THEN** the site shows them signed out
- **AND** the console still shows them signed in

### Requirement: The console accepts only a session the console made

A request from the console SHALL be answered on the console's own session. A
site session SHALL NOT be accepted for a console request, even when the
account holds a role that grants the action. The console SHALL NOT accept a
site session's credentials presented as its own.

#### Scenario: shared-auth-session-SC-33 - A site session that holds a role does not pass an operator action
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** an account that holds an operator role, signed in on the site and
  not on the console
- **WHEN** an operator action is requested from the console
- **THEN** the system refuses it as not signed in
- **AND** nothing changes

#### Scenario: shared-auth-session-SC-34 - A site session presented as the console's own is refused
**Serves:** Surface sessions - the console checks which surface a session was made on

- **GIVEN** the credentials of a site session, presented to the console as if
  they were the console's own
- **WHEN** the console reads who is calling
- **THEN** it receives no person

### Requirement: Second factor and recent sign-in are read on the console's own session

The second factor an operator action asks for, and the sign-in under 15
minutes old that setting up a second factor asks for, SHALL be measured on the
console session. A site sign-in SHALL NOT count as either.

#### Scenario: shared-auth-session-SC-35 - A site sign-in is not the recent sign-in
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** an operator with no second factor, signed in on the site a minute
  ago, and signed in to the console more than 15 minutes ago
- **WHEN** they set up a second factor on the console
- **THEN** the system refuses it and asks them to sign in to the console again

#### Scenario: shared-auth-session-SC-36 - A site sign-in does not stand in for the second factor
**Serves:** shared-auth-session-US-07 - Operator holds a console session apart from their site session

- **GIVEN** an operator with a second factor, signed in on the site and signed
  in to the console, and who has not proven the second factor on that console
  session
- **WHEN** they request an operator action on the console
- **THEN** the system refuses it and asks for the second factor

### Requirement: Release asks operators to sign in to the console once more

At release the console SHALL stop honouring the session the site holds. An
operator signed in before release SHALL sign in to the console again, with the
second factor as usual. Customer sessions SHALL be unchanged.

#### Scenario: shared-auth-session-SC-37 - A session made before release does not open the console
**Serves:** shared-auth-session-US-08 - Operator signs in to the console once more after release

- **GIVEN** an operator who was signed in before release and has not signed in
  to the console since
- **WHEN** they open the console after release
- **THEN** the console shows them signed out
- **AND** it asks for the sign-in and the second factor as for any operator

#### Scenario: shared-auth-session-SC-38 - A customer session made before release stays signed in
**Serves:** shared-auth-session-US-08 - Operator signs in to the console once more after release

- **GIVEN** a person who was signed in on the site before release
- **WHEN** they open the site after release
- **THEN** the site shows them signed in as the same account
