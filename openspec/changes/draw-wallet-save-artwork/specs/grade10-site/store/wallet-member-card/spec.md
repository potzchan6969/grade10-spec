# grade10-site/store/wallet-member-card Specification

## MODIFIED Requirements

### Requirement: A member carries their card in Apple Wallet

The membership surface SHALL offer to add the member card to Apple Wallet. The
pass SHALL carry the member's name, the tier they hold, the points they can
spend, and a scannable code. A deployment missing any of the Apple pass type
identifier, the signing certificate, the push credential or
`WALLET_PASS_AUTH_KEY` SHALL NOT offer the pass, since the worker could not
sign it, answer it or push to it. The offer, for Apple and for Google alike,
SHALL be drawn as that wallet's own artwork, unaltered, its whole label read
as the control's name.

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

<!-- trace:scenario id=g10.store-wallet-member-card.SC-dw1 rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-76 - The save action is each wallet's own artwork
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **WHEN** a member is offered a wallet on the membership surface
- **THEN** the offer is that wallet's own artwork, as the vendor publishes it
- **AND** a screen reader names it with the whole label, as before

<!-- trace:scenario id=g10.store-wallet-member-card.SC-dw2 rev=1 -->
#### Scenario: grade10-site-store-wallet-member-card-SC-77 - A half-configured Apple wallet offers nothing
**Serves:** grade10-site-store-wallet-member-card-US-06 - Member carries their card in a phone wallet

- **GIVEN** a deployment holding the Apple pass identifier and certificate but no push credential or no `WALLET_PASS_AUTH_KEY`
- **WHEN** a member opens their card on the membership surface
- **THEN** no Apple Wallet offer is drawn
