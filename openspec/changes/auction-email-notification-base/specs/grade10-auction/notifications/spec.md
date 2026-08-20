# Grade10 Auction notifications — delta

## Purpose

Grade10 emails a collector about an auction listing they watched or bid on:
when open bidding is about to start, when it has started, when it closes in
a day, when extended bidding has started, when that listing received a new
bid, and when they have been outbid. Every letter shares one shape, and a
send that fails temporarily is retried until the statement would be false or
the failure is permanent.

## ADDED Requirements

### Requirement: Open-bidding start letters go to watchers

When a published listing is within 24 hours of its scheduled start and that
start is still in the future, Grade10 SHALL email each collector who has
actively watched that listing that open bidding starts soon, naming the
listing and the start instant.

When a published listing’s scheduled start has arrived and open bidding is
still running (the scheduled close has not passed), Grade10 SHALL email each
collector who has actively watched that listing that open bidding has
started, naming the listing.

Grade10 SHALL send each of those letters at most once per watcher per
listing. It SHALL NOT send either letter to a collector who has not watched
the listing. It SHALL NOT send a start-soon letter after the start has
arrived, or a has-started letter before the start or after the scheduled
close. It SHALL NOT send either letter for a listing that is not published
or that has been called off.

A collector who watches after the 24-hour start window has opened, but
before the start, SHALL still receive the start-soon letter. A collector who
watches after the start, while open bidding is still running, SHALL still
receive the has-started letter. A collector who watches only after the
scheduled close SHALL receive neither.

#### Scenario: A watcher is told open bidding starts in 24 hours

- **GIVEN** a published listing whose scheduled start is 20 hours away
- **AND** a collector has watched that listing
- **WHEN** Grade10 sends due listing letters
- **THEN** that collector is emailed that open bidding starts soon
- **AND** the letter names the listing and the start instant
- **AND** a second pass does not send that letter again

#### Scenario: A watcher added inside the 24-hour window still hears

- **GIVEN** a published listing whose scheduled start is 6 hours away
- **WHEN** a collector watches that listing
- **THEN** they are emailed that open bidding starts soon
- **AND** the letter names the actual start instant, not a stale 24-hour
  remainder

#### Scenario: A watcher is told open bidding has started

- **GIVEN** a published listing whose scheduled start has arrived
- **AND** its scheduled close is still in the future
- **AND** a collector has watched that listing
- **WHEN** Grade10 sends due listing letters
- **THEN** that collector is emailed that open bidding has started
- **AND** a collector who never watched the listing is not

#### Scenario: Start-soon is not sent when it would be false

- **GIVEN** a listing that is still a draft, or has been called off, or
  whose scheduled start has already passed
- **WHEN** Grade10 would send the start-soon letter
- **THEN** it sends no start-soon letter for that listing
- **AND** it does not owe that letter later

#### Scenario: Has-started is not sent when it would be false

- **GIVEN** a listing whose scheduled start has not arrived, or whose
  scheduled close has passed, or that is no longer published
- **WHEN** Grade10 would send the has-started letter
- **THEN** it sends no has-started letter for that listing

#### Scenario: A non-watcher is not emailed at start

- **GIVEN** a published listing entering its start window
- **AND** a collector has never watched it and has never bid on it
- **WHEN** Grade10 sends due listing letters
- **THEN** that collector receives neither start letter

### Requirement: Close-in-24-hours and extended-bidding letters go to watchers or participants

When a published listing is within 24 hours of its scheduled close and that
scheduled close is still in the future, Grade10 SHALL email each collector
who has watched the listing or placed a bid on it that open bidding closes
soon, naming the listing and the scheduled close.

When a published listing’s recorded close has moved past its scheduled close
because a late bid extended it, and the listing still takes bids, Grade10
SHALL email each collector who has watched the listing or placed a bid on it
that extended bidding has started, naming the listing and the recorded
close.

Grade10 SHALL send each of those letters at most once per collector per
listing. A collector who unwatched after bidding SHALL still receive both.
A collector who only watched, then unwatched, and never bid SHALL receive
neither after they unwatch.

The scheduled close SHALL be the anchor for the 24-hour close letter: an
extension SHALL NOT make Grade10 send that letter again. Grade10 SHALL NOT
send the close-in-24-hours letter after the listing has stopped taking bids.
It SHALL NOT send the extended-bidding letter for a listing that has not
been extended, or that has stopped taking bids.

The existing one-hour closing reminder to watchers is a separate letter.
This requirement does not remove it or change who receives it.

#### Scenario: A watcher is told open bidding closes in 24 hours

- **GIVEN** a published listing whose scheduled close is 20 hours away
- **AND** a collector has watched it and never bid
- **WHEN** Grade10 sends due listing letters
- **THEN** that collector is emailed that open bidding closes soon
- **AND** the letter names the listing and the scheduled close
- **AND** a later extension does not send that letter again

#### Scenario: A participant who unwatched still hears the close

- **GIVEN** a published listing whose scheduled close is 20 hours away
- **AND** a collector placed a bid on it and then unwatched it
- **WHEN** Grade10 sends due listing letters
- **THEN** that collector is still emailed that open bidding closes soon

#### Scenario: Unwatching without a bid stops the close letter

- **GIVEN** a published listing whose scheduled close is 20 hours away
- **AND** a collector watched it, never bid, and then unwatched it
- **WHEN** Grade10 sends due listing letters
- **THEN** that collector is not emailed the close-in-24-hours letter

#### Scenario: Extended bidding is announced once

- **GIVEN** a published listing whose recorded close has moved past its
  scheduled close
- **AND** the listing still takes bids
- **AND** a collector has watched it or placed a bid on it
- **WHEN** Grade10 sends due listing letters
- **THEN** that collector is emailed that extended bidding has started
- **AND** the letter names the recorded close
- **AND** a further extension does not send that letter again

#### Scenario: A close or extension letter is dropped when bidding has stopped

- **GIVEN** a listing that has closed, settled, or been called off
- **WHEN** Grade10 would send the close-in-24-hours or extended-bidding
  letter
- **THEN** it sends neither
- **AND** it does not owe that letter later

### Requirement: Bid-activity letters go to bidders

When Grade10 accepts a bid that overtakes the leading bidder, it SHALL email
that previous leader that they have been outbid, naming the listing, their
own bid amount, and the new leading amount, while the listing still takes
bids.

When Grade10 accepts a bid on a listing, it SHALL email each other collector
who has placed a bid on that listing — except the new leader, and except the
collector owed the outbid letter for that overtake — that the listing
received a new bid, naming the listing.

Grade10 SHALL NOT send a new-bid letter for every increment in a short span.
A collector who is owed a new-bid letter SHALL be told about the current
leading bid they have not yet been told about; several accepted bids before
that letter goes out SHALL produce one new-bid letter, not one per bid.

Grade10 SHALL NOT email the collector who just became the leader a new-bid
letter for their own bid. It SHALL NOT email a collector who never bid.
It SHALL NOT send a new-bid or outbid letter that invites a bid on a listing
that has stopped taking bids.

#### Scenario: The previous leader is told they were outbid

- **GIVEN** collector A is the leading bidder on a listing that still takes
  bids
- **WHEN** Grade10 accepts a higher bid from collector B
- **THEN** collector A is emailed that they have been outbid
- **AND** the letter names A’s amount and the new leading amount
- **AND** collector A does not also receive a new-bid letter for that
  overtake

#### Scenario: An earlier bidder is told the lot received a new bid

- **GIVEN** collectors A then B then C have each had the lead on a listing
  that still takes bids
- **AND** A has already been emailed that they were outbid
- **WHEN** Grade10 accepts C’s bid
- **THEN** collector A is emailed that the listing received a new bid
- **AND** collector B is emailed that they have been outbid
- **AND** collector C is not emailed a new-bid letter for their own bid

#### Scenario: A snipe war does not mail every increment

- **GIVEN** a collector who has bid on a listing and is not the leader
- **AND** three further bids are accepted before Grade10 sends due
  bid-activity letters
- **WHEN** those letters go out
- **THEN** that collector receives one new-bid letter
- **AND** that letter is about the current leading bid

#### Scenario: Bid-activity mail is not sent after close

- **GIVEN** a listing that has stopped taking bids
- **WHEN** Grade10 would send a new-bid or outbid letter
- **THEN** it sends neither as an invitation to bid again

### Requirement: Every auction letter shares one shape

Every auction email Grade10 sends SHALL use one layout: a heading, a body, a
single action that opens the listing, and a footer. Kinds SHALL differ in
their words and in whether a way to stop further mail is present, not in a
second layout.

A kind whose words name the reader’s own bid amount SHALL NOT print if that
amount was not supplied. A kind whose words name a start or close instant
SHALL state that instant in the platform’s one zone, in English, the same
way other auction emails already must.

Copy and listing links SHALL follow the storefront the collector bid or
watched on. A storefront with no copy of its own SHALL NOT be sent another
storefront’s words.

#### Scenario: Two kinds share the layout

- **GIVEN** an outbid letter and an open-bidding-has-started letter about
  the same listing
- **WHEN** both are rendered
- **THEN** both have a heading, a body, one listing action, and a footer
- **AND** they differ in their words, not in a second structure

#### Scenario: A letter that names an amount is not sent blank

- **GIVEN** an outbid letter whose words name the reader’s own bid
- **WHEN** that amount is not available
- **THEN** Grade10 does not send a letter with a missing amount

#### Scenario: A start letter states one zone

- **GIVEN** an open-bidding-starts-soon letter carrying a start instant
- **WHEN** the letter is rendered
- **THEN** the start is stated in one fixed zone
- **AND** the rendering names that zone
- **AND** two recipients in different zones read the same text for it

### Requirement: Watch-driven letters can be stopped; bid-activity letters cannot

A letter Grade10 sends because the collector watched the listing SHALL
include a way to stop further letters about that listing, pointing at the
storefront’s signed-in alerts page for that listing. That way out SHALL NOT
claim that an unauthenticated request will stop the letters.

A letter Grade10 sends because of the collector’s own bid — outbid or new
bid — SHALL NOT offer a way to stop further letters. Stopping a watch SHALL
NOT stop those letters.

The close-in-24-hours and extended-bidding letters are owed to participants
even after they unwatch, so they SHALL NOT offer a way to stop that Grade10
cannot honour for a bidder. They SHALL offer the way out only when the
collector is owed them solely as a watcher.

#### Scenario: A start letter can be stopped

- **GIVEN** a collector who watched a listing and never bid
- **WHEN** they receive the start-soon or has-started letter
- **THEN** the letter includes a way to stop further letters about that
  listing
- **AND** that way is a signed-in storefront page for the listing, not an
  unauthenticated one-click stop

#### Scenario: An outbid letter cannot be stopped

- **GIVEN** a collector who was just overtaken
- **WHEN** they receive the outbid letter
- **THEN** the letter does not include a way to stop further letters

### Requirement: A temporary send failure is retried; a permanent one stops; a false letter is not sent

Grade10 SHALL treat an auction email as owed until a send is confirmed or
the statement would be false. It SHALL retry a temporary failure from the
email provider (an outage, a rate limit, a missing confirmation) with
bounded backoff, and SHALL give up after a fixed number of attempts so one
failing address cannot occupy the work forever.

A permanent failure (the provider refuses the address or the message as
invalid) SHALL stop retries for that letter without waiting out the full
attempt budget. An operator SHALL be able to put a given-up letter back on
the ladder.

A confirmed send SHALL be remembered so the same letter is not owed again.
A crash after a confirmed send and before that memory is written MAY send
the letter a second time. Grade10 SHALL prefer that duplicate over dropping
the letter.

When the listing’s state has made the owed statement false between the
decision to send and the send itself, Grade10 SHALL NOT send the letter, and
SHALL remember it as resolved so it is not retried as a late truth.

A listing’s watchers SHALL NOT each cost a separate provider request for a
letter that is the same for all of them: Grade10 SHALL send that letter in
batches so a popular listing can be mailed in one pass.

An environment with no email provider configured SHALL NOT remember a letter
as sent.

#### Scenario: A rate limit is retried

- **GIVEN** a start-soon letter owed to a watcher
- **AND** the email provider rejects the send as a temporary rate limit
- **WHEN** Grade10 next sends due listing letters after backoff
- **THEN** it attempts that letter again
- **AND** it has not remembered the letter as sent

#### Scenario: A refused address parks without burning the budget

- **GIVEN** a letter owed to an address the provider permanently refuses
- **WHEN** the send fails for that reason
- **THEN** Grade10 stops retrying that letter
- **AND** an operator can put it back on the ladder
- **AND** other owed letters in the same pass are still attempted

#### Scenario: A close that landed under the send is not mailed late

- **GIVEN** a close-in-24-hours letter claimed while the listing still took
  bids
- **AND** the listing has stopped taking bids before the send
- **WHEN** Grade10 would send it
- **THEN** the collector is not emailed that open bidding closes soon
- **AND** that letter is not owed again

#### Scenario: Watchers of one listing share one rendering

- **GIVEN** fifty collectors watching the same listing, all owed the same
  has-started letter
- **WHEN** Grade10 sends that letter
- **THEN** each collector receives their own message
- **AND** the provider is not called once per collector for that listing
