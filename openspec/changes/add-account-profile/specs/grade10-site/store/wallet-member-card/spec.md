## Feature set

- The wallet pass
  - One name: the name the member chose for the shop, else their account name, else the address before the `@`
  - An unreachable account service: a pass with no name chosen for the shop stays as it was and is refreshed later
  - A saved name: needs no account service, so the pass refreshes with it through an outage, whoever else its lap holds
  - Whole: the pass carries the name uncut, and the wallet app lays it out
  - A new name: one saved on the profile reaches the pass on the next lap; an account-name change within the daily floor

## ADDED Requirements

### Requirement: A pass shows the member's name the way the store resolves it

A pass SHALL show the same name the member's profile, the till and the
membership surface show, resolved in this order:

1. The name the member chose for the shop.
2. Their account name.
3. The part of their email address before the `@`.

The pass SHALL carry the name whole, uncut by the store; the wallet app lays
it out.

A refresh for a member with no name chosen for the shop SHALL fail and be
retried on a later lap, leaving the pass as it was, when the account service
cannot be reached or does not answer for them; it SHALL NOT blank the name or
guess one. A member with a name chosen for the shop SHALL need no account
name, so their pass SHALL be refreshed with that name while the account service
cannot be reached, whichever other members the same lap refreshes.

<!-- trace:scenario id=g10.store-wallet-member-card.SC-gtj rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-60 - A pass names the member by the store's one rule
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member adds a pass, or their pass is refreshed
- **THEN** it shows the name the member chose for the shop
- **AND** for a member with none, their account name; with neither, the part
  of their email address before the `@`
- **AND** a member whose record holds the placeholder name older records carry
  is named as one with no name chosen for the shop

<!-- trace:scenario id=g10.store-wallet-member-card.SC-nmv rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-39 - An unreachable account service leaves a pass as it was
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass and no name chosen for the shop
- **WHEN** a refresh of their pass cannot reach the account service
- **THEN** the pass is left as it was, name included
- **AND** the pass is refreshed again on a later lap

<!-- trace:scenario id=g10.store-wallet-member-card.SC-92j rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-58 - A name chosen for the shop reaches the pass through an outage
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass and a name chosen for the shop
- **WHEN** their pass is refreshed while the account service cannot be
  reached, on a lap that also refreshes a member with no name chosen for the
  shop
- **THEN** their pass is refreshed and shows the name chosen for the shop
- **AND** the other member's pass is left as it was, to be refreshed on a
  later lap

<!-- trace:scenario id=g10.store-wallet-member-card.SC-4hb rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-59 - A long name reaches the pass whole
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass whose name chosen for the shop is 80
  characters long
- **WHEN** their pass is refreshed
- **THEN** the store sends the pass all 80 characters of the name

## MODIFIED Requirements

### Requirement: A member carries their card in Google Wallet

The membership surface SHALL offer to add the member card to Google Wallet.
The pass SHALL carry the member's name, the tier they hold, the points they
can spend, and a scannable code. A deployment with no Google issuer
configured SHALL NOT offer the pass.

The pass's code SHALL be made on the member's own device, so a pass identifies
with no network of its own, and SHALL change on a fixed period. A code SHALL be
accepted only inside its own period and one period either side of it, and SHALL
identify at most once — a second presentation of the same code SHALL be refused
whoever presents it.

Identifying from a pass SHALL open the same session on the same terms as the
card on the site, and removing a pass SHALL change nothing about the
membership.

<!-- trace:scenario id=g10.store-wallet-member-card.SC-4q3 rev=2 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-13 - A member adds their card to their wallet
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member opens their card on the membership surface
- **THEN** they are offered the pass, and adding it carries the name the
  membership surface shows for them, their tier, points to spend and a
  scannable code

<!-- trace:scenario id=g10.store-wallet-member-card.SC-7wr rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-14 - A pass identifies as the card does
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** staff scan a member's pass
- **THEN** a session opens for that member on the same terms a scanned card opens

<!-- trace:scenario id=g10.store-wallet-member-card.SC-jmq rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-15 - A photographed code is worth nothing
**Serves:** grade10-site-store-wallet-member-card-US-07 - Member ends a pass they no longer want

- **WHEN** a code copied from a member's pass is presented after its period
- **THEN** it identifies nobody
- **AND** a code presented twice inside its own period is refused the second time

<!-- trace:scenario id=g10.store-wallet-member-card.SC-xeb rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-16 - A pass identifies with no signal
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member with no network on their phone presents their pass
- **THEN** the code it shows is current and opens a session

<!-- trace:scenario id=g10.store-wallet-member-card.SC-e3j rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-17 - Removing a pass leaves the membership intact
**Serves:** grade10-site-store-wallet-member-card-US-07 - Member ends a pass they no longer want

- **WHEN** a member deletes the pass from their wallet
- **THEN** their membership, balance, tier and member card are unchanged

### Requirement: A member carries their card in Apple Wallet

The membership surface SHALL offer to add the member card to Apple Wallet. The
pass SHALL carry the member's name, the tier they hold, the points they can
spend, and a scannable code. A deployment with no Apple pass type identifier
and certificate configured SHALL NOT offer the pass.

The pass's code SHALL be made by the programme and carried on the pass, so a
pass identifies with no network of its own and needs nothing of the phone at
the counter. The code SHALL be durable: it does not change, a second
presentation is not refused, and a member's tenth visit scans as their first.

Because the code is durable, it SHALL identify and nothing more. A session
opened from an Apple pass SHALL read the member's panel and SHALL NOT spend
points or collect a reward, whoever presents it. A member who wants either
SHALL be served by the card on the site, as they are today.

Removing a pass SHALL change nothing about the membership.

<!-- trace:scenario id=g10.store-wallet-member-card.SC-fjc rev=2 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-18 - A member adds their card to Apple Wallet
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member opens their card on the membership surface
- **THEN** they are offered the pass, and adding it carries the name the
  membership surface shows for them, their tier, points to spend and a
  scannable code

<!-- trace:scenario id=g10.store-wallet-member-card.SC-95t rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-19 - An Apple pass identifies every time
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member whose phone has no network
- **WHEN** they present the same pass on two visits
- **THEN** a session opens both times

<!-- trace:scenario id=g10.store-wallet-member-card.SC-g3f rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-20 - An Apple pass cannot move value
**Serves:** grade10-site-store-wallet-member-card-US-08 - Member spends points when the pass they carry cannot

- **WHEN** a session is opened from an Apple pass
- **THEN** the member's panel is read
- **AND** spending points and collecting a reward are refused, not hidden

### Requirement: The pass follows the member's standing, one sweep behind

Points and tier SHALL move with no row written to the pass anywhere; a sweep
SHALL be the only mechanism that catches a pass up. Four arms SHALL mark a
row due: its own next-change instant, a daily floor, a kick from the
programme's ledger and tier logs read once a lap, and a kick from a profile
save. A lap SHALL claim at most
a fixed limit of due passes, ordered by due instant, and SHALL back a
failure off on its own curve.

By the end of the first sweep beginning after a member's standing moves, the
wallet SHALL hold what they then are — whether the change was recorded, as a
spend, a redemption or an operator's correction is, or happened on its own,
as points reaching their expiry, a tier term running out and an invitation
lapsing do. A change nobody records SHALL name the instant it happens at, and
the pass SHALL be due at that instant rather than on the daily floor.

Only a difference SHALL cost an update: a pass re-read and found unchanged
SHALL cost nothing, so several changes between two reads cost one update
carrying what stands after the last of them. The pass SHALL say when what it
shows was current, and a sweep with more due than it reads SHALL report how
far behind its oldest due pass is.

A name the member saves on their profile SHALL reach the pass on the next lap.
The prompt that brings the pass forward is best effort, so a name whose prompt
is lost SHALL still reach the pass within the daily floor. A change to the
account name SHALL reach the pass within the daily floor.

<!-- trace:scenario id=g10.store-wallet-member-card.SC-bj5 rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-05 - A member whose balance moved is current by the end of the next lap
**Serves:** grade10-site-store-wallet-member-card-US-02 - Member scans at the counter after their balance moved

- **GIVEN** a member whose balance changed and whose pass is due
- **WHEN** the next sweep lap runs
- **THEN** the pass renders the new balance

<!-- trace:scenario id=g10.store-wallet-member-card.SC-jfa rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-06 - A dormant member's pass is read once a day and sends nothing
**Serves:** grade10-site-store-wallet-member-card-US-05 - Operator reads what the sweep costs

- **GIVEN** a member with no activity and a pass with nothing due sooner
- **WHEN** a day passes
- **THEN** the pass is read once by the daily floor and no push is sent if nothing changed

<!-- trace:scenario id=g10.store-wallet-member-card.SC-hqf rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-25 - A recorded change reaches the wallet on the next sweep
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** staff spend a member's points
- **THEN** the first sweep beginning after that spend sends the wallet the
  points left after it
- **AND** it does so whether or not the spend itself marked the pass due

<!-- trace:scenario id=g10.store-wallet-member-card.SC-szm rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-26 - A change nobody recorded is due at the instant it happens
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member's points reach their expiry, their earned tier term runs
  out, or an invitation holding their tier lapses, with nothing written
- **THEN** the pass is due at that instant rather than on the daily floor
- **AND** the first sweep after it sends the wallet the tier and points the
  member's own surfaces then read

<!-- trace:scenario id=g10.store-wallet-member-card.SC-41b rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-27 - A sweep that has fallen behind says so
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** more passes due than one sweep reads
- **WHEN** the sweep runs
- **THEN** it reports the age of its oldest due pass

<!-- trace:scenario id=g10.store-wallet-member-card.SC-wl0 rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-28 - A burst costs one update
**Serves:** One sweep behind - a burst costs one update

- **WHEN** a member's points change several times inside one interval
- **THEN** the pass is updated once
- **AND** it carries what stands after the last of those changes

<!-- trace:scenario id=g10.store-wallet-member-card.SC-3bj rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-29 - A pass says how current it is
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member opens their pass
- **THEN** it says when what it shows was current

<!-- trace:scenario id=g10.store-wallet-member-card.SC-gvk rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-56 - A name saved on the profile reaches the pass on the next lap
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass
- **WHEN** they save a new display name on their profile
- **THEN** by the end of the next lap the pass shows the new name

<!-- trace:scenario id=g10.store-wallet-member-card.SC-vzv rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-57 - A changed account name reaches the pass within a day
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass and no name chosen for the shop
- **WHEN** their account name changes
- **THEN** the pass shows the new name within 24 hours of the change
