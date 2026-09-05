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
  - Google's code: made on the device, current with no signal, used once
  - Apple's code: made by the programme, durable, and identifies only —
    it spends nothing and collects nothing
  - One pass per wallet: ending or adding in one leaves the other alone
  - Ending one: immediate, by the member or an operator
  - Staying current: one sweep behind, sweeps **5 minutes** apart at most; a burst costs one update
  - In the phone's language: the surface's own words, in every language it speaks

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

### Requirement: A member carries their card in Apple Wallet

The membership surface SHALL offer to add the member card to Apple Wallet, and
the message that welcomes a new member SHALL carry the same offer. The pass
SHALL carry the member's display name, the tier they hold, the points they can
spend, and a scannable code.

The pass's code SHALL be made by the programme and carried on the pass, so a
pass identifies with no network of its own and needs nothing of the phone at
the counter. The code SHALL be durable: it does not change, a second
presentation is not refused, and a member's tenth visit scans as their first.

Because the code is durable, it SHALL identify and nothing more. A session
opened from an Apple pass SHALL read the member's panel and SHALL NOT spend
points or collect a reward, whoever presents it. A member who wants either
SHALL be served by the card on the site, as they are today.

Removing a pass SHALL change nothing about the membership.

#### Scenario: grade10-site-store-membership-SC-63 - A member adds their card to Apple Wallet

- **WHEN** a member opens their card on the membership surface
- **THEN** they are offered the pass, and adding it carries their name, tier,
  points to spend and a scannable code

#### Scenario: grade10-site-store-membership-SC-64 - An Apple pass identifies every time

- **GIVEN** a member whose phone has no network
- **WHEN** they present the same pass on two visits
- **THEN** a session opens both times

#### Scenario: grade10-site-store-membership-SC-65 - An Apple pass cannot move value

- **WHEN** a session is opened from an Apple pass
- **THEN** the member's panel is read
- **AND** spending points and collecting a reward are refused, not hidden

### Requirement: A member holds one pass per wallet

A member SHALL hold at most one live pass in each wallet. Adding or ending a
pass in one wallet SHALL leave what they hold in the other untouched, and the
membership surface SHALL say which passes they are carrying.

#### Scenario: grade10-site-store-membership-SC-66 - Adding one wallet's pass leaves the other alive

- **GIVEN** a member carrying a pass in one wallet
- **WHEN** they add a pass in the other
- **THEN** both identify them

#### Scenario: grade10-site-store-membership-SC-67 - Ending one wallet's pass leaves the other alive

- **GIVEN** a member carrying a pass in each wallet
- **WHEN** they end one
- **THEN** the other still identifies them
- **AND** the surface still offers the action that ends it

### Requirement: A pass speaks the languages the membership surface does

The words a pass carries beside the member's facts SHALL be the membership
surface's own, offered in every language the surface speaks. A phone set to one
of those languages SHALL be shown it; a phone set to any other SHALL read the
surface's default.

#### Scenario: grade10-site-store-membership-SC-71 - A pass speaks the phone's language

- **GIVEN** a member whose phone is set to a language the membership surface
  speaks
- **WHEN** they add a pass
- **THEN** the words beside their name, tier and points are in that language
- **AND** a phone set to a language the surface does not speak reads them in
  the surface's default

### Requirement: A pass identification is recorded as its own kind

The programme SHALL record that a member was identified from a wallet pass,
apart from every other way a member reaches the counter, so how members arrive
is countable rather than inferred, and SHALL record which wallet it came from.

A pass whose code the member's own device made SHALL carry the same rights as
the card on the site, and SHALL be one of the ways that prove the member's own
device was present. A pass whose code the programme made SHALL prove only that
the pass reached a device once, and SHALL be neither.

#### Scenario: grade10-site-store-membership-SC-49 - Arriving by pass is countable

- **WHEN** members are identified, some from a pass and some from the site's card
- **THEN** the two are counted apart
- **AND** a pass identification says which wallet it came from

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

### Requirement: A pass follows the member's standing, one sweep behind

A member's standing is their name, their tier and the points they can spend.
The sweep SHALL run at least every **5 minutes**, and by the end of the first
sweep beginning after a member's standing moves, the wallet SHALL hold what
they then are. This SHALL hold whether the change was recorded — a spend, a
redemption, an operator's correction — or happened on its own, as points
reaching their expiry, a tier term running out and an invitation lapsing do.

The wallet's copy is what this bounds. When a member's phone shows an update
SHALL be the wallet's affair and the phone's, and nothing SHALL be required of
either. The pass SHALL say when what it shows was current.

A change nobody records SHALL name the instant it happens at, and the pass
SHALL be due at that instant rather than on the daily floor. Every clock that
can move a shown fact SHALL name its own instant, and the earliest of them
SHALL be the one the pass waits on.

Every live pass SHALL be read at least once a day whatever else marked it due,
and a sweep with more due than it reads SHALL report how far behind its oldest
due pass is.

Only a difference SHALL cost an update: a pass re-read and found unchanged
SHALL cost nothing, so several changes between two reads cost one update
carrying what stands after the last of them.

#### Scenario: grade10-site-store-membership-SC-52 - A recorded change reaches the wallet on the next sweep

- **WHEN** staff spend a member's points
- **THEN** the first sweep beginning after that spend sends the wallet the
  points left after it
- **AND** it does so whether or not the spend itself marked the pass due

#### Scenario: grade10-site-store-membership-SC-53 - A change nobody recorded is due at the instant it happens

- **WHEN** a member's points reach their expiry, their earned tier term runs
  out, or an invitation holding their tier lapses, with nothing written
- **THEN** the pass is due at that instant rather than on the daily floor
- **AND** the first sweep after it sends the wallet the tier and points the
  member's own surfaces then read

#### Scenario: grade10-site-store-membership-SC-70 - A sweep that has fallen behind says so

- **GIVEN** more passes due than one sweep reads
- **WHEN** the sweep runs
- **THEN** it reports the age of its oldest due pass

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
beyond use. A pass already on a member's phone SHALL identify nobody from the
moment the erasure begins, whatever the phone still shows.

What discharges the erasure SHALL follow the wallet. A wallet that keeps its
own copy SHALL be retried until it confirms, and SHALL be reported as still
owed until it does. A wallet that keeps none SHALL be discharged by the pass
identifying nobody and the devices it was sent to being forgotten, with no
acknowledgement to wait for.

#### Scenario: grade10-site-store-membership-SC-56 - An erased member's pass identifies nobody

- **WHEN** a member is erased and a code from their pass is presented
- **THEN** it identifies nobody

#### Scenario: grade10-site-store-membership-SC-57 - An erasure the wallet has not confirmed is still owed

- **GIVEN** a wallet that keeps its own copy of the pass
- **WHEN** it cannot be reached while a member is being erased
- **THEN** the erasure is retried until the wallet confirms it
- **AND** it is reported as still owed until then

#### Scenario: grade10-site-store-membership-SC-62 - An erasure with no wallet to confirm it is still discharged

- **GIVEN** a wallet that keeps no copy, holding only what a member's own
  device was sent
- **WHEN** a member is erased
- **THEN** the pass identifies nobody and the devices it was sent to are forgotten
- **AND** nothing is reported as owed, because there is nothing left to ask

### Requirement: The wallet pass's exports

The shared UI package SHALL export, from its public entry, exactly these
components for adding a pass — `WalletPassLinks` — with its props, copy, wallet
and state types. It SHALL receive every word it shows and every address it
points at from its consumer, and SHALL hold no wallet, no member and no product
state of its own. Each wallet SHALL carry its own whole labels rather than words
the component joins to a wallet's name, so a language that orders its verb
differently is not assembled out of order. Each SHALL be named to the component
by an identifier the consumer owns and the component never shows, so an action
is answered by identity rather than by a display name a translation moves.

A wallet the member holds SHALL NOT hide what is offered in another, and an
address already answered SHALL stand until the member has used it — a pass
recorded is not a pass installed.

An offer SHALL carry its label and its address together, so an address with no
words to name it cannot be expressed. Whether an act is in flight, and whether
one did not complete, SHALL both be stated per wallet: one status for the whole
component cannot say that a member is adding in one wallet while ending in
another, and a failure it cannot attribute is one an unrelated success erases.
A standing the component could not read SHALL be said out loud rather than
drawn as an empty offer, which a member reads as carrying nothing.

The consuming application is the Grade10 site.

#### Scenario: grade10-site-store-membership-SC-58 - The save action is offered beside the card

- **WHEN** a member opens their card on the membership surface
- **THEN** the action that adds the pass is offered beside it
- **AND** every word it shows came from the application

#### Scenario: grade10-site-store-membership-SC-68 - A failure names the wallet it belongs to

- **GIVEN** a member carrying a pass in each of two wallets
- **WHEN** ending one fails and an act on the other then succeeds
- **THEN** the failure is still shown, and it names the wallet it belongs to

#### Scenario: grade10-site-store-membership-SC-69 - A standing that could not be read says so

- **GIVEN** a member who carries a pass
- **WHEN** the surface cannot read what they hold
- **THEN** it says so, and the control that ends the pass is not taken away

#### Scenario: grade10-site-store-membership-SC-59 - A deployment offers only the wallets it carries

- **WHEN** a member opens their card on a deployment configured for one wallet
  and not the other
- **THEN** only the configured wallet is offered
- **AND** nothing is asked of either wallet to find that out

#### Scenario: grade10-site-store-membership-SC-60 - A member who returns still finds the passes they hold

- **GIVEN** a member added a pass on an earlier visit
- **WHEN** they open their card again
- **THEN** the surface says which wallets they are carrying a pass in
- **AND** the action that ends each is offered
