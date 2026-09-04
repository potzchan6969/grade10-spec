# Membership — delta

## Purpose

Connects a Grade10 member to the commerce provider and to the physical store:
the guaranteed commerce customer behind every member, the member card the
counter identifies by — on the site or in a phone wallet — and the staff till
session, points becoming discount codes either channel accepts, and
physical-store orders earning through attribution.

## Feature set

- The wallet pass
  - Added from the membership surface: carries name, tier, balance and a code
  - Rotating code: made on the device, current with no signal, used once
  - Ending one: immediate, by the member or an operator
  - Staying current: a change reaches it within **5 minutes**, a burst costs one update

## ADDED Requirements

### Requirement: A member carries their card in Google Wallet

The membership surface SHALL offer to add the member card to Google Wallet, and
the message that welcomes a new member SHALL carry the same offer. The pass
SHALL carry the member's display name, the tier they hold, the points they can
spend, and a scannable code.

The pass's code SHALL be made on the member's own device, so a pass identifies
with no network of its own, and SHALL change on a fixed period. A code SHALL be
accepted only inside its own period and one period either side of it, and SHALL
identify at most once — a second presentation of the same code SHALL be refused
whoever presents it.

Identifying from a pass SHALL open the same session on the same terms as the
card on the site, and removing a pass SHALL change nothing about the
membership.

#### Scenario: grade10-site-store-membership-SC-44 - A member adds their card to their wallet

- **WHEN** a member opens their card on the membership surface
- **THEN** they are offered the pass, and adding it carries their name, tier,
  points to spend and a scannable code

#### Scenario: grade10-site-store-membership-SC-45 - A pass identifies as the card does

- **WHEN** staff scan a member's pass
- **THEN** a session opens for that member on the same terms a scanned card opens

#### Scenario: grade10-site-store-membership-SC-46 - A photographed code is worth nothing

- **WHEN** a code copied from a member's pass is presented after its period
- **THEN** it identifies nobody
- **AND** a code presented twice inside its own period is refused the second time

#### Scenario: grade10-site-store-membership-SC-47 - A pass identifies with no signal

- **WHEN** a member with no network on their phone presents their pass
- **THEN** the code it shows is current and opens a session

#### Scenario: grade10-site-store-membership-SC-48 - Removing a pass leaves the membership intact

- **WHEN** a member deletes the pass from their wallet
- **THEN** their membership, balance, tier and member card are unchanged

### Requirement: A pass identification is recorded as its own kind

The programme SHALL record that a member was identified from a wallet pass,
apart from every other way a member reaches the counter, so how members arrive
is countable rather than inferred. A pass identification SHALL carry the same
rights as the card on the site, and SHALL be one of the ways that prove the
member's own device was present.

#### Scenario: grade10-site-store-membership-SC-49 - Arriving by pass is countable

- **WHEN** members are identified, some from a pass and some from the site's card
- **THEN** the two are counted apart
- **AND** each opens a session with the same rights

### Requirement: A member ends a pass, and ending it ends what it can do

A member SHALL be able to end a pass in one action, and an operator SHALL be
able to end it for a member who asks under the permission an elevated act
requires, recorded in the operator log like any other. An operator holding no
such permission SHALL see it refused, not hidden.

Ending SHALL take effect at once: every code the ended pass can make identifies
nobody, whether or not the pass is still on the member's phone. A member SHALL
be able to add a new pass afterwards.

#### Scenario: grade10-site-store-membership-SC-50 - An ended pass identifies nobody

- **WHEN** a member ends their pass and a code it makes is then presented
- **THEN** it identifies nobody
- **AND** the member can add a new pass that does

#### Scenario: grade10-site-store-membership-SC-51 - An operator ends a pass under the permission it requires

- **WHEN** an operator ends a member's pass
- **THEN** the act is recorded in the operator log with who and when
- **AND** an operator without that permission sees it refused, not hidden

### Requirement: A pass follows the member's standing within five minutes

Within **5 minutes** of a member's name, tier or points to spend changing, the
pass SHALL carry what they then are. This SHALL hold whether the change was
recorded — a spend, a redemption, an operator's correction — or happened on its
own, as points reaching their expiry and a tier term running out do.

Only a difference SHALL cost an update: a pass re-read and found unchanged
SHALL cost nothing, so several changes inside the interval cost one update
carrying what stands after the last of them.

When a member's phone shows an update SHALL be the phone's own affair, and
nothing SHALL be required of it. The pass SHALL say when what it shows was
current.

#### Scenario: grade10-site-store-membership-SC-52 - A recorded change reaches the pass

- **WHEN** staff spend a member's points
- **THEN** within 5 minutes the pass carries the points left after that spend

#### Scenario: grade10-site-store-membership-SC-53 - A change nobody recorded reaches the pass

- **WHEN** a member's points reach their expiry, or their tier term runs out,
  with nothing written
- **THEN** within 5 minutes the pass carries the tier and points the member's
  own surfaces now read

#### Scenario: grade10-site-store-membership-SC-54 - A burst costs one update

- **WHEN** a member's points change several times inside one interval
- **THEN** the pass is updated once
- **AND** it carries what stands after the last of those changes

#### Scenario: grade10-site-store-membership-SC-61 - A pass nobody marked due is still read

- **GIVEN** a member whose standing has not moved and nothing has marked their
  pass due
- **WHEN** a day has passed since it was last read
- **THEN** the pass is read again
- **AND** it is sent nothing if what it shows has not changed

#### Scenario: grade10-site-store-membership-SC-55 - A pass says how current it is

- **WHEN** a member opens their pass
- **THEN** it says when what it shows was current

### Requirement: Erasing a member erases their pass

Erasing a member SHALL strip every fact about them from the pass and put it
beyond use, SHALL be retried until the wallet confirms it, and SHALL be
reported as still owed until it is done. A pass already on a member's phone
SHALL identify nobody from the moment the erasure begins, whatever the phone
still shows.

#### Scenario: grade10-site-store-membership-SC-56 - An erased member's pass identifies nobody

- **WHEN** a member is erased and a code from their pass is presented
- **THEN** it identifies nobody

#### Scenario: grade10-site-store-membership-SC-57 - An erasure the wallet has not confirmed is still owed

- **WHEN** the wallet cannot be reached while a member is being erased
- **THEN** the erasure is retried until the wallet confirms it
- **AND** it is reported as still owed until then

### Requirement: The wallet pass's exports

The shared UI package SHALL export, from its public entry, exactly these
components for adding a pass — `WalletPassLinks` — with its props, copy, offer
and state types. It SHALL receive every word it shows and every address it
points at from its consumer, and SHALL hold no wallet, no member and no product
state of its own. Each offer SHALL carry its own whole label rather than a word
the component joins to a wallet's name, so a language that orders its verb
differently is not assembled out of order.

The consuming application is the Grade10 site.

#### Scenario: grade10-site-store-membership-SC-58 - The save action is offered beside the card

- **WHEN** a member opens their card on the membership surface
- **THEN** the action that adds the pass is offered beside it
- **AND** every word it shows came from the application

#### Scenario: grade10-site-store-membership-SC-59 - A deployment with no wallet offers nothing

- **WHEN** a member opens their card on a deployment that has no wallet issuer
- **THEN** no action to add a pass is offered
- **AND** nothing is asked of the wallet to find that out

#### Scenario: grade10-site-store-membership-SC-60 - A member who returns still finds the pass they hold

- **GIVEN** a member added a pass on an earlier visit
- **WHEN** they open their card again
- **THEN** the surface says they are carrying one
- **AND** the action that ends it is offered
