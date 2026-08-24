# Auction email notifications — delta

## Purpose

Which messages Grade10 sends a collector about an auction lot, what each one
fires on, and who receives it. Every message here is transactional mail about
a lot the collector chose to engage with, by watching it or by bidding on it,
and every one goes to their registered account email.

## ADDED Requirements

### Requirement: A collector is enrolled by watching or by bidding

Grade10 SHALL treat a collector as enrolled in a lot's mail when they watch
that lot, when they have committed a bid on it, or both.

Bidding on a lot SHALL enrol the bidder in that lot's bid-activity mail without
requiring them to watch it. Unwatching a lot SHALL end enrolment that came from
watching, and SHALL NOT end enrolment that came from bidding.

Grade10 SHALL send a collector at most one copy of a given message about a
given lot, however many reasons they have to receive it.

#### Scenario: Bidding enrols without watching

- **GIVEN** a collector who has bid on a lot and does not watch it
- **WHEN** another collector bids on that lot
- **THEN** Grade10 sends them the new-bid message

#### Scenario: A watcher who also bids receives one copy

- **GIVEN** a collector who both watches a lot and has bid on it
- **WHEN** a message about that lot is sent
- **THEN** they receive exactly one copy of it

#### Scenario: Unwatching does not end bidder enrolment

- **GIVEN** a collector who watched a lot and has bid on it
- **WHEN** they unwatch it
- **AND** another collector bids on that lot
- **THEN** Grade10 still sends them the new-bid message

#### Scenario: Unwatching ends watcher enrolment

- **GIVEN** a collector who watches a lot and has never bid on it
- **WHEN** they unwatch it
- **AND** bidding opens on that lot
- **THEN** Grade10 does not send them the bidding-has-opened message

### Requirement: Grade10 sends four messages about a lot's progress

Grade10 SHALL send each of the following to every collector watching the lot,
once per lot per collector:

- **Bidding opens in 24 hours** — 24 hours before the lot's scheduled start.
- **Bidding has opened** — when the lot's bidding starts.
- **Bidding closes in 24 hours** — 24 hours before the lot's **scheduled**
  close, not its current effective close.
- **Extended bidding has started** — when the lot enters its extension window.

The last two SHALL also go to every collector who has bid on the lot.

Each message SHALL carry the lot's identity and the time it concerns. A time
SHALL name the zone it is stated in and SHALL match the same instant shown on
the lot's page.

#### Scenario: A watcher is told bidding opens tomorrow

- **GIVEN** a collector watching a lot whose scheduled start is 24 hours away
- **WHEN** Grade10 reaches that point
- **THEN** it sends them the bidding-opens-in-24-hours message
- **AND** the message names the zone its time is stated in

#### Scenario: A watcher is told bidding has opened

- **GIVEN** a collector watching a lot
- **WHEN** its bidding starts
- **THEN** Grade10 sends them the bidding-has-opened message

#### Scenario: The closing warning uses the scheduled close

- **GIVEN** a lot whose scheduled close is 24 hours away and whose effective close has already been moved later by an extension
- **WHEN** Grade10 reaches 24 hours before the scheduled close
- **THEN** it sends the closing-in-24-hours message
- **AND** it does not recalculate that point from the moved close

#### Scenario: Extended bidding announces itself to watchers and bidders

- **GIVEN** a lot with one collector watching it and a different collector who has bid on it
- **WHEN** the lot enters extended bidding
- **THEN** Grade10 sends both of them the extended-bidding-has-started message

#### Scenario: A progress message is sent once per lot

- **GIVEN** a collector who has received the bidding-has-opened message for a lot
- **WHEN** Grade10 evaluates that lot's mail again
- **THEN** it does not send them that message a second time

### Requirement: Grade10 sends two messages about bid activity

Grade10 SHALL send to every collector who has bid on a lot:

- **A lot you bid on received a new bid** — when a bid is accepted on that lot,
  to every enrolled bidder other than the one whose bid it is.
- **You have been outbid** — when a collector who was leading the lot stops
  leading it, to that collector.

A collector SHALL NOT receive the new-bid message for their own bid, including
a bid Grade10 placed on their behalf.

Where both messages would go to the same collector for the same accepted bid,
Grade10 SHALL send the outbid message and SHALL NOT also send the new-bid
message.

An outbid message SHALL carry the lot's current bid after the bid that
displaced them, and its effective close.

#### Scenario: A bidder hears about someone else's bid

- **GIVEN** two collectors who have each bid on a lot
- **WHEN** Grade10 accepts a bid from one of them
- **THEN** it sends the new-bid message to the other
- **AND** it does not send it to the bidder whose bid it was

#### Scenario: A collector is told they have been outbid

- **GIVEN** a collector leading a lot
- **WHEN** Grade10 accepts a bid that takes the lead from them
- **THEN** it sends them the outbid message
- **AND** the message carries the lot's current bid and its effective close

#### Scenario: An outbid collector gets one message, not two

- **GIVEN** a collector leading a lot who is also enrolled as a bidder on it
- **WHEN** an accepted bid takes the lead from them
- **THEN** Grade10 sends them the outbid message
- **AND** it does not also send them the new-bid message for that same bid

#### Scenario: A bid placed on a collector's behalf is still their own bid

- **GIVEN** a collector on whose behalf Grade10 raises a bid
- **WHEN** that bid is accepted
- **THEN** Grade10 does not send them the new-bid message for it

#### Scenario: Losing the lead without a new bid is not an outbid

- **GIVEN** a collector leading a lot
- **WHEN** the lot is called off
- **THEN** Grade10 does not send them the outbid message

### Requirement: A called-off lot stops its mail

Grade10 SHALL NOT send any message about a lot that has been called off,
from the moment it is called off.

A message already sent SHALL NOT be recalled by this rule; only messages not
yet sent are suppressed.

#### Scenario: A called-off lot sends nothing further

- **GIVEN** a lot with collectors watching and bidding on it
- **WHEN** an operator calls it off
- **THEN** Grade10 sends no further message about that lot

#### Scenario: A scheduled message is suppressed by a call-off

- **GIVEN** a lot 25 hours from its scheduled close, with watchers enrolled
- **WHEN** an operator calls it off
- **AND** the 24-hours-before point arrives
- **THEN** Grade10 does not send the closing-in-24-hours message

### Requirement: Every message goes to the registered account email

Grade10 SHALL send every message in this capability to the recipient's
registered account email, and SHALL identify the recipient by user id.

Every message SHALL be rendered in English regardless of the recipient's
locale. Money in a message SHALL be an integer count of minor units and an ISO
4217 currency code rendered in the platform's sent-message shape. A time SHALL
name the zone it is stated in.

Grade10 SHALL record what it sent, to whom, and when, so an operator can
answer a collector who says they were not told.

#### Scenario: Mail reaches the registered address

- **WHEN** Grade10 sends any message in this capability
- **THEN** it sends it to the recipient's registered account email
- **AND** it resolves the recipient by user id, not by email

#### Scenario: A message reads in English whatever the reader's locale

- **GIVEN** two enrolled collectors whose locales differ
- **WHEN** Grade10 sends them the same message carrying an amount
- **THEN** both messages are rendered in English
- **AND** both show the amount in the platform's sent-message money shape

#### Scenario: A message and the page agree on the close

- **GIVEN** a message carrying a lot's close
- **WHEN** it is compared with that lot's page
- **THEN** both name the zone the close is stated in
- **AND** both state the same instant

#### Scenario: An operator can see what was sent

- **GIVEN** a collector who says they were never told about a lot
- **WHEN** an authorized operator reads that lot's sent messages
- **THEN** they see each message sent, its recipient, and when it was sent
