## Feature set

- The wallet pass
  - One name: the name the member chose for the shop, else their account name, else the address before the `@`
  - A name the account service cannot give: the pass stays as it was and is refreshed later
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

A refresh that cannot get the account name SHALL fail and be retried on a
later lap, leaving the pass as it was; it SHALL NOT blank the name or guess
one. A member with a name chosen for the shop SHALL need no account name, so
their pass SHALL be refreshed with that name while the account service cannot
answer, whichever other members the same lap refreshes.

A name the member saves on their profile SHALL reach the pass on the next lap.
The prompt that brings the pass forward is best effort, so a name whose prompt
is lost SHALL still reach the pass within the daily floor. A change to the
account name SHALL reach the pass within the daily floor.

<!-- trace:scenario id=g10.store-wallet-member-card.SC-nmv rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-39 - An unreachable account service leaves a pass as it was
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass and no name chosen for the shop
- **WHEN** a refresh of their pass cannot reach the account service
- **THEN** the pass is left as it was, name included
- **AND** the pass is refreshed again on a later lap

<!-- trace:scenario id=g10.store-wallet-member-card.SC-gvk rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-40 - A name saved on the profile reaches the pass on the next lap
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass
- **WHEN** they save a new display name on their profile
- **THEN** by the end of the next lap the pass shows the new name

<!-- trace:scenario id=g10.store-wallet-member-card.SC-vzv rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-41 - A changed account name reaches the pass within a day
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass and no name chosen for the shop
- **WHEN** their account name changes
- **THEN** the pass shows the new name within 24 hours of the change

<!-- trace:scenario id=g10.store-wallet-member-card.SC-92j rev=2 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-42 - A name chosen for the shop reaches the pass through an outage
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a member with a live pass and a name chosen for the shop
- **WHEN** their pass is refreshed while the account service cannot be
  reached, on a lap that also refreshes a member with no name chosen for the
  shop
- **THEN** their pass is refreshed and shows the name chosen for the shop
- **AND** the other member's pass is left as it was, to be refreshed on a
  later lap

<!-- trace:scenario id=g10.store-wallet-member-card.SC-4hb rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-43 - A long name reaches the pass whole
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
