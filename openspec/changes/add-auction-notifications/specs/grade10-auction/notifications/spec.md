## Purpose

Which messages Grade10 sends a collector about an auction listing they
watched or bid on, what each one fires on, and who receives it. Every
message is transactional mail to their registered account email.

## Feature set

- Enrolment
  - Watch or bid: either action enrols the collector in that listing's mail
  - One copy: a collector who both watches and bids still gets one message
  - Unwatch ends watch mail: bidding enrolment survives unwatch
- Progress messages
  - Opens in 24 hours: sent 24 hours before the scheduled start
  - Bidding has opened: sent when bidding starts
  - Closes in 24 hours: keyed to the scheduled close, not the moved close
  - Extended bidding started: sent when the listing enters the extension window
- Bid-activity messages
  - New bid: other enrolled bidders hear about an accepted bid
  - Outbid: the collector who just lost the lead hears that, not also the new-bid
- Delivery
  - Registered email: every message goes to the account email
  - Call-off suppresses: a called-off listing sends nothing further
  - Send log: type, recipient email, listing, and Sent At — no body — filterable by email

## ADDED Requirements

### Enrolment
---------

### Requirement: A collector is enrolled by watching or by bidding

A collector SHALL:

1. Watch a listing, bid on it, or both.
2. Receive each message they are enrolled for at most once, however many
   reasons they have to receive it.
3. Unwatch to stop watcher enrolment. Bidding enrolment SHALL NOT end.

| Enrolment | How it starts | Mail it receives | How it ends |
| --- | --- | --- | --- |
| Watcher | The collector watches the listing | The four progress messages | Unwatch |
| Bidder | The collector has a committed bid on the listing | Closing warning, extended bidding, new-bid, outbid | Does not end on unwatch |

Bidding on a listing SHALL enrol the bidder in that listing's
bid-activity mail without requiring them to watch it.

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

### Progress messages
-----------------

### Requirement: Grade10 sends four messages about a lot's progress

Grade10 SHALL send each progress message once per listing per collector
to everyone enrolled for it. The closing warning SHALL use the listing's
**scheduled** close, not its current effective close.

| Message | When | Recipients |
| --- | --- | --- |
| Bidding opens in 24 hours | 24 hours before the listing's scheduled start | Watchers |
| Bidding has opened | When the listing's bidding starts | Watchers |
| Bidding closes in 24 hours | 24 hours before the listing's scheduled close | Watchers and bidders |
| Extended bidding has started | When the listing enters its extension window | Watchers and bidders |

Each message SHALL carry the listing's identity and the time it concerns.
Money and times SHALL follow `money-amounts` and `dates-and-times`.

#### Scenario: A watcher is told bidding opens tomorrow

- **GIVEN** a collector watching a lot whose scheduled start is 24 hours away
- **WHEN** Grade10 reaches that point
- **THEN** it sends them the bidding-opens-in-24-hours message

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

### Bid-activity messages
---------------------

### Requirement: Grade10 sends two messages about bid activity

Grade10 SHALL send bid-activity mail to every collector who has bid on
the listing. A collector SHALL NOT receive the new-bid message for their
own bid, including a bid Grade10 placed on their behalf. Where both
messages would go to the same collector for the same accepted bid,
Grade10 SHALL send the outbid message and SHALL NOT also send the new-bid
message.

| Message | When | Recipients |
| --- | --- | --- |
| A lot you bid on received a new bid | A bid is accepted on that listing | Every enrolled bidder other than the one whose bid it is |
| You have been outbid | A collector who was leading stops leading | That collector |

An outbid message SHALL carry the listing's current bid after the bid
that displaced them, and its effective close.

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

### Delivery
--------

### Requirement: Every message goes to the registered account email

Grade10 SHALL send every message in this capability to the recipient's
registered account email. Identity SHALL be the recipient's user id, per
`shared-auth/session`. Money and times SHALL follow `money-amounts` and
`dates-and-times`.

#### Scenario: Mail reaches the registered address

- **WHEN** Grade10 sends any message in this capability
- **THEN** it sends it to the recipient's registered account email

### Requirement: Operators can read a send log by type and email

Grade10 SHALL keep a log of every message it sends in this capability so
an operator can answer a collector who says they were not told. Each row
SHALL show the message type and SHALL NOT store or show the message body
or any other rendered content.

| Field | Meaning |
| --- | --- |
| Type | Which of the six messages |
| Sent to | The registered account email at send time |
| Sent At | When Grade10 sent it |
| Listing | Which lot |

An authorized operator SHALL be able to filter this log by the collector's
email. The filter SHALL match the address the message was sent to.

#### Scenario: An operator can see what was sent

- **GIVEN** a collector who says they were never told about a lot
- **WHEN** an authorized operator filters the send log by that collector's email
- **THEN** they see each message sent to that address: its type, the lot, and its Sent At

#### Scenario: The send log shows type, not content

- **GIVEN** a message Grade10 has sent
- **WHEN** an authorized operator reads its log row
- **THEN** the row shows the message type
- **AND** it does not show the body or any rendered content

#### Scenario: The send log is filterable by email

- **GIVEN** messages sent to two collectors on one or more lots
- **WHEN** an authorized operator filters the log by one collector's email
- **THEN** they see only rows sent to that address

### Requirement: A called-off lot stops its mail

Grade10 SHALL NOT send any message about a listing that has been called
off, from the moment it is called off. A message already sent SHALL NOT
be recalled; only messages not yet sent are suppressed.

#### Scenario: A called-off lot sends nothing further

- **GIVEN** a lot with collectors watching and bidding on it
- **WHEN** an operator calls it off
- **THEN** Grade10 sends no further message about that lot

#### Scenario: A scheduled message is suppressed by a call-off

- **GIVEN** a lot 25 hours from its scheduled close, with watchers enrolled
- **WHEN** an operator calls it off
- **AND** the 24-hours-before point arrives
- **THEN** Grade10 does not send the closing-in-24-hours message
