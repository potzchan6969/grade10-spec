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
  - Shared letter: heading, body, listing action, footer
  - Stop watch mail: watch-driven letters offer a signed-in way to unwatch
  - Failed send: a temporary failure is retried; a permanent one stops; a false statement is not sent
  - Call-off suppresses: a called-off listing sends nothing further
  - Send log: type, recipient email, listing, and Sent At — no body — filterable by email

## User journeys

### notifications-US-01: Hear a watched lot is opening

As a collector, I want to be emailed as a watched lot opens, so that I
can come back and bid without sitting on the page.

**Accepted by:** `notifications-SC-02`, `notifications-SC-04`,
`notifications-SC-05`, `notifications-SC-06`, `notifications-SC-07`,
`notifications-SC-10`, `notifications-SC-17`, `notifications-SC-18`,
`notifications-SC-19`, `notifications-SC-21`

### notifications-US-02: Come back before a lot closes

As a collector, I want to be emailed when a lot I watch or bid on is a
day from its scheduled close, so that a moving deadline does not pass
without me.

**Accepted by:** `notifications-SC-02`, `notifications-SC-03`,
`notifications-SC-08`, `notifications-SC-09`, `notifications-SC-23`,
`notifications-SC-27`, `notifications-SC-28`

### notifications-US-03: Raise after being outbid

As a collector, I want to be emailed when I lose the lead on a lot I
bid on, so that I can raise my maximum while the lot still takes bids.

**Accepted by:** `notifications-SC-12`, `notifications-SC-13`,
`notifications-SC-15`, `notifications-SC-20`

### notifications-US-04: Hear a new bid on a lot I bid on

As a collector, I want to be emailed when someone else bids on a lot I
already bid on, so that I know the lot moved without being mailed on
every increment.

**Accepted by:** `notifications-SC-01`, `notifications-SC-03`,
`notifications-SC-11`, `notifications-SC-14`, `notifications-SC-16`

### notifications-US-05: Look up what a collector was sent

As an auction operator, I want to filter sent auction mail by a
collector's email, so that I can answer a collector who says they were
never told.

**Accepted by:** `notifications-SC-22`, `notifications-SC-24`,
`notifications-SC-25`, `notifications-SC-26`

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
bid-activity mail without requiring them to watch it. A collector who
watches after a progress window has already opened, while they are
still enrolled for that message, SHALL still receive it.

#### Scenario: notifications-SC-01 - Bidding enrols without watching

- **GIVEN** a collector who has bid on a lot and does not watch it
- **WHEN** another collector bids on that lot
- **THEN** Grade10 sends them the new-bid message

#### Scenario: notifications-SC-02 - A watcher who also bids receives one copy

- **GIVEN** a collector who both watches a lot and has bid on it
- **WHEN** a message about that lot is sent
- **THEN** they receive exactly one copy of it

#### Scenario: notifications-SC-03 - Unwatching does not end bidder enrolment

- **GIVEN** a collector who watched a lot and has bid on it
- **WHEN** they unwatch it
- **AND** another collector bids on that lot
- **THEN** Grade10 still sends them the new-bid message

#### Scenario: notifications-SC-04 - Unwatching ends watcher enrolment

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

The existing one-hour closing reminder to watchers is a separate
message. This requirement does not remove it or change who receives it.

#### Scenario: notifications-SC-05 - A watcher is told bidding opens tomorrow

- **GIVEN** a collector watching a lot whose scheduled start is 24 hours away
- **WHEN** Grade10 reaches that point
- **THEN** it sends them the bidding-opens-in-24-hours message

#### Scenario: notifications-SC-06 - A watcher added inside the window still hears

- **GIVEN** a published listing whose scheduled start is 6 hours away
- **WHEN** a collector watches that listing
- **THEN** they are emailed that bidding opens in 24 hours
- **AND** the message names the actual start instant, not a stale 24-hour remainder

#### Scenario: notifications-SC-07 - A watcher is told bidding has opened

- **GIVEN** a collector watching a lot
- **WHEN** its bidding starts
- **THEN** Grade10 sends them the bidding-has-opened message

#### Scenario: notifications-SC-08 - The closing warning uses the scheduled close

- **GIVEN** a lot whose scheduled close is 24 hours away and whose effective close has already been moved later by an extension
- **WHEN** Grade10 reaches 24 hours before the scheduled close
- **THEN** it sends the closing-in-24-hours message
- **AND** it does not recalculate that point from the moved close

#### Scenario: notifications-SC-09 - Extended bidding announces itself to watchers and bidders

- **GIVEN** a lot with one collector watching it and a different collector who has bid on it
- **WHEN** the lot enters extended bidding
- **THEN** Grade10 sends both of them the extended-bidding-has-started message

#### Scenario: notifications-SC-10 - A progress message is sent once per lot

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

Grade10 SHALL NOT send a new-bid message for every increment in a short
span. A collector owed a new-bid message SHALL be told about the current
leading bid they have not yet been told about; several accepted bids
before that message goes out SHALL produce one new-bid message, not one
per bid.

Grade10 SHALL NOT send a new-bid or outbid message that invites a bid on
a listing that has stopped taking bids.

#### Scenario: notifications-SC-11 - A bidder hears about someone else's bid

- **GIVEN** two collectors who have each bid on a lot
- **WHEN** Grade10 accepts a bid from one of them
- **THEN** it sends the new-bid message to the other
- **AND** it does not send it to the bidder whose bid it was

#### Scenario: notifications-SC-12 - A collector is told they have been outbid

- **GIVEN** a collector leading a lot
- **WHEN** Grade10 accepts a bid that takes the lead from them
- **THEN** it sends them the outbid message
- **AND** the message carries the lot's current bid and its effective close

#### Scenario: notifications-SC-13 - An outbid collector gets one message, not two

- **GIVEN** a collector leading a lot who is also enrolled as a bidder on it
- **WHEN** an accepted bid takes the lead from them
- **THEN** Grade10 sends them the outbid message
- **AND** it does not also send them the new-bid message for that same bid

#### Scenario: notifications-SC-14 - A bid placed on a collector's behalf is still their own bid

- **GIVEN** a collector on whose behalf Grade10 raises a bid
- **WHEN** that bid is accepted
- **THEN** Grade10 does not send them the new-bid message for it

#### Scenario: notifications-SC-15 - Losing the lead without a new bid is not an outbid

- **GIVEN** a collector leading a lot
- **WHEN** the lot is called off
- **THEN** Grade10 does not send them the outbid message

#### Scenario: notifications-SC-16 - A snipe war does not mail every increment

- **GIVEN** a collector who has bid on a listing and is not the leader
- **AND** three further bids are accepted before Grade10 sends due bid-activity messages
- **WHEN** those messages go out
- **THEN** that collector receives one new-bid message
- **AND** that message is about the current leading bid

### Delivery
--------

### Requirement: Every message goes to the registered account email

Grade10 SHALL send every message in this capability to the recipient's
registered account email. Identity SHALL be the recipient's user id, per
`shared-auth/session`. Money and times SHALL follow `money-amounts` and
`dates-and-times`.

#### Scenario: notifications-SC-17 - Mail reaches the registered address

- **WHEN** Grade10 sends any message in this capability
- **THEN** it sends it to the recipient's registered account email

### Requirement: Every auction letter shares one shape

Every auction email Grade10 sends SHALL use one layout: a heading, a
body, a single action that opens the listing, and a footer. Kinds SHALL
differ in their words and in whether a way to stop further mail is
present, not in a second layout.

A kind whose words name the reader's own bid amount SHALL NOT print if
that amount was not supplied. Copy and listing links SHALL follow the
storefront the collector bid or watched on.

#### Scenario: notifications-SC-18 - Two kinds share the layout

- **GIVEN** an outbid letter and an open-bidding-has-started letter about the same listing
- **WHEN** both are rendered
- **THEN** both have a heading, a body, one listing action, and a footer
- **AND** they differ in their words, not in a second structure

### Requirement: Watch-driven letters can be stopped; bid-activity letters cannot

A letter Grade10 sends because the collector watched the listing SHALL
include a way to stop further letters about that listing, pointing at a
signed-in storefront page where they can unwatch. That way out SHALL NOT
claim that an unauthenticated request will stop the letters.

A letter Grade10 sends because of the collector's own bid — outbid or
new bid — SHALL NOT offer a way to stop further letters. Stopping a
watch SHALL NOT stop those letters.

The close-in-24-hours and extended-bidding letters are owed to
participants even after they unwatch, so they SHALL NOT offer a way to
stop that Grade10 cannot honour for a bidder. They SHALL offer the way
out only when the collector is owed them solely as a watcher.

#### Scenario: notifications-SC-19 - A start letter can be stopped

- **GIVEN** a collector who watched a listing and never bid
- **WHEN** they receive the start-soon or has-started letter
- **THEN** the letter includes a way to stop further letters about that listing
- **AND** that way is a signed-in storefront page, not an unauthenticated one-click stop

#### Scenario: notifications-SC-20 - An outbid letter cannot be stopped

- **GIVEN** a collector who was just overtaken
- **WHEN** they receive the outbid letter
- **THEN** the letter does not include a way to stop further letters

### Requirement: A temporary send failure is retried; a permanent one stops; a false letter is not sent

Grade10 SHALL treat an auction email as owed until a send is confirmed
or the statement would be false. It SHALL retry a temporary failure from
the email provider with bounded backoff, and SHALL give up after a fixed
number of attempts so one failing address cannot occupy the work forever.

A permanent failure (the provider refuses the address or the message as
invalid) SHALL stop retries for that letter without waiting out the full
attempt budget. An operator SHALL be able to put a given-up letter back
on the ladder.

A confirmed send SHALL be remembered so the same letter is not owed
again. A crash after a confirmed send and before that memory is written
MAY send the letter a second time. Grade10 SHALL prefer that duplicate
over dropping the letter.

When the listing's state has made the owed statement false between the
decision to send and the send itself, Grade10 SHALL NOT send the letter,
and SHALL remember it as resolved so it is not retried as a late truth.

An environment with no email provider configured SHALL NOT remember a
letter as sent.

#### Scenario: notifications-SC-21 - A rate limit is retried

- **GIVEN** a start-soon letter owed to a watcher
- **AND** the email provider rejects the send as a temporary rate limit
- **WHEN** Grade10 next sends due listing letters after backoff
- **THEN** it attempts that letter again
- **AND** it has not remembered the letter as sent

#### Scenario: notifications-SC-22 - A refused address parks without burning the budget

- **GIVEN** a letter owed to an address the provider permanently refuses
- **WHEN** the send fails for that reason
- **THEN** Grade10 stops retrying that letter
- **AND** an operator can put it back on the ladder
- **AND** other owed letters in the same pass are still attempted

#### Scenario: notifications-SC-23 - A close that landed under the send is not mailed late

- **GIVEN** a close-in-24-hours letter claimed while the listing still took bids
- **AND** the listing has stopped taking bids before the send
- **WHEN** Grade10 would send it
- **THEN** the collector is not emailed that open bidding closes soon
- **AND** that letter is not owed again

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

An authorized operator SHALL be able to filter this log by the
collector's email. The filter SHALL match the address the message was
sent to.

#### Scenario: notifications-SC-24 - An operator can see what was sent

- **GIVEN** a collector who says they were never told about a lot
- **WHEN** an authorized operator filters the send log by that collector's email
- **THEN** they see each message sent to that address: its type, the lot, and its Sent At

#### Scenario: notifications-SC-25 - The send log shows type, not content

- **GIVEN** a message Grade10 has sent
- **WHEN** an authorized operator reads its log row
- **THEN** the row shows the message type
- **AND** it does not show the body or any rendered content

#### Scenario: notifications-SC-26 - The send log is filterable by email

- **GIVEN** messages sent to two collectors on one or more lots
- **WHEN** an authorized operator filters the log by one collector's email
- **THEN** they see only rows sent to that address

### Requirement: A called-off lot stops its mail

Grade10 SHALL NOT send any message about a listing that has been called
off, from the moment it is called off. A message already sent SHALL NOT
be recalled; only messages not yet sent are suppressed.

#### Scenario: notifications-SC-27 - A called-off lot sends nothing further

- **GIVEN** a lot with collectors watching and bidding on it
- **WHEN** an operator calls it off
- **THEN** Grade10 sends no further message about that lot

#### Scenario: notifications-SC-28 - A scheduled message is suppressed by a call-off

- **GIVEN** a lot 25 hours from its scheduled close, with watchers enrolled
- **WHEN** an operator calls it off
- **AND** the 24-hours-before point arrives
- **THEN** Grade10 does not send the closing-in-24-hours message
