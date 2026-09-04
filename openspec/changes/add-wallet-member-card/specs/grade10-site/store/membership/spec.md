# Membership — delta

## Purpose

Turns the member card from a minted, single-use code into one durable code the
member holds, replaces when it leaks, and carries in Apple Wallet and Google
Wallet. Identification at the counter, the till session and everything a
session may do are unchanged.

## Feature set

- The card
  - One durable code: the same value every scan, rendered scannable and typed
  - Replacement: the member or an operator kills a card in one act
  - Use history: every identification is on the member's own card
- The wallet
  - Two passes: added from the membership surface, scanned like the card
  - Currency: a change reaches every pass within a stated interval, a burst costs one refresh
- The counter
  - Card spending: a switch the owner withdraws without a deploy

## ADDED Requirements

### Requirement: The member card carries one durable code the member can replace

The member card SHALL carry exactly one identification code per member — the
same value on every presentation, across sessions and devices — rendered both
scannable and as a typed form of that same value, grouped so it can be read
aloud. The code SHALL be drawn from a space of at least **2^50** codes and
SHALL carry no member fact anyone can read out of it.

A member SHALL be able to replace their card in one action, and an operator
SHALL be able to replace it for them under the permission an elevated act
requires, recorded in the operator log like any other. An operator holding no
such permission SHALL see it refused, not hidden. Replacement SHALL take
effect at once: the replaced code identifies nobody, and the refusal SHALL say
the card was replaced rather than that no member was found.

The code SHALL NOT appear in a notification, an operator's view of a member, an
audit record, or a log. What those record is the member and the arm.

#### Scenario: grade10-site-store-membership-SC-28 - A card identifies the same member every time

- **WHEN** the same card is scanned at two shops on two days
- **THEN** each scan opens a session for that member
- **AND** neither scan refuses the other

#### Scenario: grade10-site-store-membership-SC-29 - A replaced card identifies nobody

- **WHEN** a member replaces their card and the previous code is then scanned
- **THEN** it is refused, saying the card was replaced
- **AND** the code the replacement issued opens a session

#### Scenario: grade10-site-store-membership-SC-30 - An operator replaces a card under the permission it requires

- **WHEN** an operator replaces a member's card
- **THEN** the act is recorded in the operator log with who and when
- **AND** an operator without that permission sees it refused, not hidden

#### Scenario: grade10-site-store-membership-SC-31 - The code stays out of every record anyone reads

- **WHEN** a card identifies a member and points are spent
- **THEN** no notification, operator view, audit record or log carries the code
- **AND** each of them names the member and how they were identified

### Requirement: The card records where it was used

The member's own card SHALL show its recent uses — the place and the instant of
each — and SHALL offer the replacement beside them. A use SHALL be recorded
whether or not any act followed it.

#### Scenario: grade10-site-store-membership-SC-32 - A use the member did not make is on their card

- **WHEN** a member's card is used at a counter they were not at
- **THEN** their card shows that use with its place and instant
- **AND** the replacement is offered beside it

#### Scenario: grade10-site-store-membership-SC-33 - A lookup that spent nothing is still a use

- **WHEN** a card opens a session that ends with no spend and no collection
- **THEN** the use is still on the member's card

### Requirement: The card is carried in Apple Wallet and Google Wallet

The membership surface SHALL offer to add the card to Apple Wallet and to
Google Wallet, on any device and whichever the member is holding, and the
message that welcomes a new member SHALL carry both. A pass SHALL carry the
member's display name, tier, redeemable balance, and the same code the card
shows, scannable and in its typed form.

A pass SHALL identify a member exactly as the card does, and removing a pass
SHALL change nothing about the membership.

#### Scenario: grade10-site-store-membership-SC-34 - A member adds their card to either wallet

- **WHEN** a member opens their card
- **THEN** both wallets are offered whatever device they are on

#### Scenario: grade10-site-store-membership-SC-35 - A pass carries what the card carries

- **WHEN** a member opens a pass they added
- **THEN** it shows their name, tier, redeemable balance and code
- **AND** the code reads the same as the one on their card

#### Scenario: grade10-site-store-membership-SC-36 - A pass scans exactly as the card does

- **WHEN** staff scan a member's pass
- **THEN** a session opens for that member on the same terms a scanned card opens

#### Scenario: grade10-site-store-membership-SC-37 - Removing a pass leaves the membership intact

- **WHEN** a member deletes a pass from their wallet
- **THEN** their membership, balance, tier and card are unchanged

### Requirement: A pass stays current, and a burst of changes costs one refresh

A change to a member's name, tier, balance or code SHALL reach every pass they
hold within **15 minutes** of being recorded. Several changes inside that
interval SHALL cost one refresh, not one for each.

A replacement SHALL reach every pass the same way. Until a pass carries the
replacement, the code it still shows SHALL be refused saying the card was
replaced.

#### Scenario: grade10-site-store-membership-SC-38 - A spend at the till reaches the pass

- **WHEN** staff spend a member's points
- **THEN** every pass that member holds shows the new balance within 15 minutes

#### Scenario: grade10-site-store-membership-SC-39 - A burst of changes costs one refresh

- **WHEN** a member's balance changes several times inside one interval
- **THEN** their passes are refreshed once
- **AND** the balance they show is the one after the last change

#### Scenario: grade10-site-store-membership-SC-40 - A replaced card reaches the pass

- **WHEN** a member replaces their card
- **THEN** every pass they hold carries the replacement within 15 minutes
- **AND** a pass still showing the replaced code is refused saying so

### Requirement: Spending on a scanned card is a switch the programme can withdraw

Identification by the card SHALL authorize the terminal to read and act for
that member for the session. The programme SHALL be able to withdraw spending
from card identification without a deploy, leaving lookup and collection
working — the same switch every other identification arm already carries. What
a session may do SHALL be settled when the member is identified.

#### Scenario: grade10-site-store-membership-SC-41 - Withdrawing card spending leaves the rest working

- **WHEN** card spending is switched off and a member is identified by their card
- **THEN** staff read the member's standing and confirm a collection
- **AND** spending is refused, not hidden

#### Scenario: grade10-site-store-membership-SC-42 - A switch flipped mid-session is settled at the next identification

- **WHEN** card spending is switched off while a session opened on a card is live
- **THEN** that session keeps what it was opened with
- **AND** the next identification opens without spending

### Requirement: The member card's exports

`@grade10/ui` SHALL export `MemberCard`, taking the code, its typed form, the
recent uses, the two wallet links and the replacement action, and receiving
every word it shows from its consumer. It SHALL NOT take a countdown, an
expiry, a used state or a refresh.

The consuming application is the Grade10 site.

#### Scenario: grade10-site-store-membership-SC-43 - The card offers the wallets, the history and the replacement

- **WHEN** a member opens their card
- **THEN** it shows the scannable code, its typed form, both wallet actions, the recent uses and the replacement
- **AND** it shows no countdown, no expiry and no refresh
