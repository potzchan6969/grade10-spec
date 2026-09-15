# grade10-site/auction/notifications Specification

## Purpose
Which messages Grade10 sends a collector about an auction listing they
watched or bid on with email alerts on, what each one fires on, and who
receives it. Every message is transactional mail to their registered
account email. Watching a listing is list membership; email alerts are a
separate preference — see `grade10-site/auction/watchlist`.

## Feature set

- Enrolment
  - Watch or bid with alerts on: either relationship enrols mail when
    email alerts are on for that listing
  - One copy: a collector who both watches and bids still gets one message
  - Mute ends mail: turning email alerts off stops mail without unwatching
    or ending the bid; unwatch also turns alerts off
  - Account master: an account-level auction email alerts control can stop
    all auction mail without clearing watches or bids
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
  - Shared letter: subject, preheader, heading, body, lot block (one primary image when available), listing action, footer; brand mark opens the storefront home; outbound links carry campaign tags
  - Stop email alerts: letters say alerts are on for the lot, then **Manage alerts** → My Auctions (sign-in first when signed out)
  - Failed send: a temporary failure is retried; a permanent one stops; a false statement is not sent
  - Call-off suppresses: a called-off listing sends nothing further
  - Send log: type, recipient email, listing, and Sent At — no body — filterable by email

## Requirements

### Requirement: A collector is enrolled by watching or by bidding with email alerts on

A collector SHALL:

1. Watch a listing, bid on it, or both.
2. Receive each message they are enrolled for at most once, however many
   reasons they have to receive it.
3. Receive that mail only while email alerts are on for that listing and
   the account-level auction email alerts control is on.
4. Mute email alerts for a listing without unwatching and without ending
   the bid. Unwatching SHALL turn email alerts off for that listing.
   Bidding enrolment SHALL NOT end on unwatch or mute.

| Relationship | How it starts | Mail it can receive (alerts on) | How mail stops |
| --- | --- | --- | --- |
| Watcher | The collector watches the listing | The four progress messages | Mute email alerts, unwatch, or account master off |
| Bidder | The collector has a committed bid on the listing | Closing warning, extended bidding, new-bid, outbid | Mute email alerts or account master off; not by unwatch alone |

Watching a listing SHALL default email alerts **on** for that listing.
Bidding on a listing SHALL enrol the bidder in that listing's
bid-activity mail without requiring them to watch it, with email alerts
default **on**. A collector who watches after a progress window has
already opened, while they are still enrolled for that message, SHALL
still receive it when alerts are on.

#### Scenario: grade10-site-auction-notifications-SC-01 - Bidding enrols without watching
**Serves:** grade10-site-auction-notifications-US-04 - Collector hears a new bid on a lot they bid on

- **GIVEN** a collector who has bid on a lot and does not watch it
- **AND** email alerts are on for that lot
- **WHEN** another collector bids on that lot
- **THEN** Grade10 sends them the new-bid message

#### Scenario: grade10-site-auction-notifications-SC-02 - A watcher who also bids receives one copy

- **GIVEN** a collector who both watches a lot and has bid on it
- **AND** email alerts are on for that lot
- **WHEN** a message about that lot is sent
- **THEN** they receive exactly one copy of it

#### Scenario: grade10-site-auction-notifications-SC-03 - Unwatching does not end bidder enrolment

- **GIVEN** a collector who watched a lot and has bid on it
- **AND** email alerts remain on for that lot after they unwatch
- **WHEN** they unwatch it
- **AND** another collector bids on that lot
- **THEN** Grade10 still sends them the new-bid message

#### Scenario: grade10-site-auction-notifications-SC-04 - Unwatching ends watcher mail
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector who watches a lot and has never bid on it
- **WHEN** they unwatch it
- **AND** bidding opens on that lot
- **THEN** Grade10 does not send them the bidding-has-opened message

#### Scenario: grade10-site-auction-notifications-SC-32 - Muting stops mail while watching continues
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector who watches a lot with email alerts on
- **WHEN** they turn email alerts off for that lot
- **AND** bidding opens on that lot
- **THEN** the lot remains on their Watching list
- **AND** Grade10 does not send them the bidding-has-opened message

#### Scenario: grade10-site-auction-notifications-SC-33 - Muting stops bidder mail without ending the bid
**Serves:** grade10-site-auction-notifications-US-03 - Collector raises after being outbid

- **GIVEN** a collector who has bid on a lot with email alerts on
- **WHEN** they turn email alerts off for that lot
- **AND** another collector bids on that lot
- **THEN** their bid enrolment is unchanged
- **AND** Grade10 does not send them the new-bid message

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

#### Scenario: grade10-site-auction-notifications-SC-05 - A watcher is told bidding opens tomorrow
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector watching a lot whose scheduled start is 24 hours away
- **WHEN** Grade10 reaches that point
- **THEN** it sends them the bidding-opens-in-24-hours message

#### Scenario: grade10-site-auction-notifications-SC-06 - A watcher added inside the window still hears
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a published listing whose scheduled start is 6 hours away
- **WHEN** a collector watches that listing
- **THEN** they are emailed that bidding opens in 24 hours
- **AND** the message names the actual start instant, not a stale 24-hour remainder

#### Scenario: grade10-site-auction-notifications-SC-07 - A watcher is told bidding has opened
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector watching a lot
- **WHEN** its bidding starts
- **THEN** Grade10 sends them the bidding-has-opened message

#### Scenario: grade10-site-auction-notifications-SC-08 - The closing warning uses the scheduled close
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a lot whose scheduled close is 24 hours away and whose effective close has already been moved later by an extension
- **WHEN** Grade10 reaches 24 hours before the scheduled close
- **THEN** it sends the closing-in-24-hours message
- **AND** it does not recalculate that point from the moved close

#### Scenario: grade10-site-auction-notifications-SC-09 - Extended bidding announces itself to watchers and bidders
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a lot with one collector watching it and a different collector who has bid on it
- **WHEN** the lot enters extended bidding
- **THEN** Grade10 sends both of them the extended-bidding-has-started message

#### Scenario: grade10-site-auction-notifications-SC-10 - A progress message is sent once per lot
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector who has received the bidding-has-opened message for a lot
- **WHEN** Grade10 evaluates that lot's mail again
- **THEN** it does not send them that message a second time

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
that displaced them, and its effective close. When their standing bid
amount at the displacement is supplied, the message SHALL name that
amount as well. It SHALL NOT name their maximum.

A collector SHALL NOT receive the outbid message when a competing
maximum is accepted but they still lead. Grade10 is still bidding for
them; the current bid rising is not losing the lead. That case is
`grade10-site/auction/auto-bidding` (a challenger below the leader's
maximum raises the price only).

Grade10 SHALL NOT send a new-bid message for every increment in a short
span. A collector owed a new-bid message SHALL be told about the current
leading bid they have not yet been told about; several accepted bids
before that message goes out SHALL produce one new-bid message, not one
per bid.

Grade10 SHALL NOT send a new-bid or outbid message that invites a bid on
a listing that has stopped taking bids.

#### Scenario: grade10-site-auction-notifications-SC-11 - A bidder hears about someone else's bid
**Serves:** grade10-site-auction-notifications-US-04 - Collector hears a new bid on a lot they bid on

- **GIVEN** two collectors who have each bid on a lot
- **WHEN** Grade10 accepts a bid from one of them
- **THEN** it sends the new-bid message to the other
- **AND** it does not send it to the bidder whose bid it was

#### Scenario: grade10-site-auction-notifications-SC-12 - A collector is told they have been outbid
**Serves:** grade10-site-auction-notifications-US-03 - Collector raises after being outbid

- **GIVEN** a collector leading a lot
- **WHEN** Grade10 accepts a bid that takes the lead from them
- **THEN** it sends them the outbid message
- **AND** the message carries the lot's current bid and its effective close
- **AND** when their standing bid amount is supplied, the message names that amount as well (not their maximum)

#### Scenario: grade10-site-auction-notifications-SC-13 - An outbid collector gets one message, not two
**Serves:** grade10-site-auction-notifications-US-03 - Collector raises after being outbid

- **GIVEN** a collector leading a lot who is also enrolled as a bidder on it
- **WHEN** an accepted bid takes the lead from them
- **THEN** Grade10 sends them the outbid message
- **AND** it does not also send them the new-bid message for that same bid

#### Scenario: grade10-site-auction-notifications-SC-14 - A bid placed on a collector's behalf is still their own bid
**Serves:** grade10-site-auction-notifications-US-04 - Collector hears a new bid on a lot they bid on

- **GIVEN** a collector on whose behalf Grade10 raises a bid
- **WHEN** that bid is accepted
- **THEN** Grade10 does not send them the new-bid message for it

#### Scenario: grade10-site-auction-notifications-SC-15 - Losing the lead without a new bid is not an outbid
**Serves:** grade10-site-auction-notifications-US-03 - Collector raises after being outbid

- **GIVEN** a collector leading a lot
- **WHEN** the lot is called off
- **THEN** Grade10 does not send them the outbid message

#### Scenario: grade10-site-auction-notifications-SC-31 - A challenge that leaves them leading is not an outbid

- **GIVEN** a collector leading a lot whose committed maximum still exceeds a challenger's
- **WHEN** Grade10 accepts that competing maximum and they still lead
- **THEN** Grade10 does not send them the outbid message
- **AND** Grade10 does not send them the new-bid message for the bid it placed on their behalf

#### Scenario: grade10-site-auction-notifications-SC-16 - A snipe war does not mail every increment
**Serves:** grade10-site-auction-notifications-US-04 - Collector hears a new bid on a lot they bid on

- **GIVEN** a collector who has bid on a listing and is not the leader
- **AND** three further bids are accepted before Grade10 sends due bid-activity messages
- **WHEN** those messages go out
- **THEN** that collector receives one new-bid message
- **AND** that message is about the current leading bid

### Requirement: Every message goes to the registered account email

Grade10 SHALL send every message in this capability to the recipient's
registered account email. Identity SHALL be the recipient's user id, per
`shared/auth/session`. Money and times SHALL follow `money-amounts` and
`dates-and-times`.

#### Scenario: grade10-site-auction-notifications-SC-17 - Mail reaches the registered address
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **WHEN** Grade10 sends any message in this capability
- **THEN** it sends it to the recipient's registered account email

### Requirement: Every auction letter shares one shape

Every auction email Grade10 sends SHALL use one layout: a subject, a
preheader, a heading, a body, a lot block, a single action that opens
the listing, and a footer. Kinds SHALL differ in their words and in
whether a way to stop further mail is present, not in a second layout.

The letter SHALL show the storefront's brand mark. Activating that mark
SHALL open that storefront's home page — the same brand the collector bid
or watched on.

The lot block SHALL carry the listing's identity and the times or
amounts that kind requires. When the listing has a primary image, the
lot block SHALL show exactly one picture of that item — not a gallery.
When no primary image is available, Grade10 SHALL omit the picture and
SHALL still send the letter with the text facts and listing action.
That picture, when shown, MAY link to the same listing URL as the
listing action.

A kind whose words name the reader's own bid amount SHALL NOT print if
that amount was not supplied. Copy and listing links SHALL follow the
storefront the collector bid or watched on.

Every outbound link in the letter — brand mark, listing action, lot-block
links to the listing, and **Manage alerts** when present — SHALL carry
campaign tags as query parameters:

- `utm_source` = `email`
- `utm_medium` = `auction_notification`
- `utm_campaign` = the letter kind (`bidding_opens_in_24h`,
  `bidding_has_opened`, `bidding_closes_in_24h`, `extended_bidding`,
  `new_bid`, or `outbid`)
- `utm_content` = the control (`logo`, `cta`, `lot_image`, `lot_title`, or
  `manage_alerts`)

Grade10 SHALL NOT require `utm_term`. The destination path SHALL stay the
same; only these query parameters are added.

#### Scenario: grade10-site-auction-notifications-SC-18 - Two kinds share the layout
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** an outbid letter and an open-bidding-has-started letter about the same listing
- **WHEN** both are rendered
- **THEN** both have a subject, a preheader, a heading, a body, a lot block, one listing action, and a footer
- **AND** they differ in their words, not in a second structure

#### Scenario: grade10-site-auction-notifications-SC-35 - The brand mark opens the storefront home
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** any auction letter in this capability for the Grade10 storefront
- **WHEN** the collector activates the Grade10 brand mark
- **THEN** the Grade10 website home opens

#### Scenario: grade10-site-auction-notifications-SC-36 - Outbound links carry campaign tags
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** an outbid letter with email alerts on
- **WHEN** the letter is rendered
- **THEN** the brand mark URL carries `utm_source=email`,
  `utm_medium=auction_notification`, `utm_campaign=outbid`, and
  `utm_content=logo`
- **AND** the listing action URL carries the same source and medium with
  `utm_campaign=outbid` and `utm_content=cta`
- **AND** the **Manage alerts** URL carries the same source and medium with
  `utm_campaign=outbid` and `utm_content=manage_alerts`

#### Scenario: grade10-site-auction-notifications-SC-29 - The lot block shows one primary image
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a listing with a primary image
- **WHEN** Grade10 renders any message in this capability about that listing
- **THEN** the lot block shows exactly one picture of that item
- **AND** it does not show a second image or a gallery

#### Scenario: grade10-site-auction-notifications-SC-30 - A listing without an image still mails
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a listing with no primary image
- **WHEN** Grade10 renders a message about that listing
- **THEN** the letter has no lot picture
- **AND** it still carries the lot identity, the kind's required facts, and the listing action

### Requirement: Letters can be stopped by muting email alerts

A letter Grade10 sends about a listing SHALL include a way to stop further
letters about that listing by turning email alerts off for it. The footer
SHALL state that email alerts are on for that lot and SHALL offer a link
**Manage alerts** to the **My Auctions** page, where the collector mutes that
listing's Email alerts control. A signed-out collector who activates
**Manage alerts** SHALL be sent through the existing Grade10 sign-in flow
and, on success, SHALL open **My Auctions**. That way out SHALL NOT claim
that an unauthenticated request will stop the letters, and SHALL NOT send
the collector to the account-wide Auction email alerts master as the primary
mute for this letter. Muting SHALL NOT remove a watch and SHALL NOT end a
bid.

The control SHALL be offered on progress letters and on bid-activity
letters (outbid and new-bid) whenever the recipient has email alerts on
for that listing.

#### Scenario: grade10-site-auction-notifications-SC-19 - A start letter can be stopped
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a collector who watched a listing with email alerts on
- **WHEN** they receive the start-soon or has-started letter
- **THEN** the letter includes **Manage alerts**
- **AND** activating it opens My Auctions when the collector is signed in
- **AND** that way is not an unauthenticated one-click stop

#### Scenario: grade10-site-auction-notifications-SC-20 - An outbid letter can be stopped by muting
**Serves:** grade10-site-auction-notifications-US-03 - Collector raises after being outbid

- **GIVEN** a collector who was just overtaken
- **AND** email alerts are on for that listing
- **WHEN** they receive the outbid letter
- **THEN** the letter includes **Manage alerts**
- **AND** activating it opens My Auctions when the collector is signed in

#### Scenario: grade10-site-auction-notifications-SC-34 - Manage alerts from a letter when signed out

- **GIVEN** a collector who receives a letter with email alerts on for that listing
- **AND** they are signed out of Grade10
- **WHEN** they activate **Manage alerts**
- **THEN** the Grade10 site starts its existing sign-in flow
- **AND** successful sign-in opens My Auctions

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

#### Scenario: grade10-site-auction-notifications-SC-21 - A rate limit is retried
**Serves:** grade10-site-auction-notifications-US-01 - Collector hears a watched lot is opening

- **GIVEN** a start-soon letter owed to a watcher
- **AND** the email provider rejects the send as a temporary rate limit
- **WHEN** Grade10 next sends due listing letters after backoff
- **THEN** it attempts that letter again
- **AND** it has not remembered the letter as sent

#### Scenario: grade10-site-auction-notifications-SC-22 - A refused address parks without burning the budget
**Serves:** grade10-site-auction-notifications-US-05 - Operator looks up what a collector was sent

- **GIVEN** a letter owed to an address the provider permanently refuses
- **WHEN** the send fails for that reason
- **THEN** Grade10 stops retrying that letter
- **AND** an operator can put it back on the ladder
- **AND** other owed letters in the same pass are still attempted

#### Scenario: grade10-site-auction-notifications-SC-23 - A close that landed under the send is not mailed late
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

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

#### Scenario: grade10-site-auction-notifications-SC-24 - An operator can see what was sent
**Serves:** grade10-site-auction-notifications-US-05 - Operator looks up what a collector was sent

- **GIVEN** a collector who says they were never told about a lot
- **WHEN** an authorized operator filters the send log by that collector's email
- **THEN** they see each message sent to that address: its type, the lot, and its Sent At

#### Scenario: grade10-site-auction-notifications-SC-25 - The send log shows type, not content
**Serves:** grade10-site-auction-notifications-US-05 - Operator looks up what a collector was sent

- **GIVEN** a message Grade10 has sent
- **WHEN** an authorized operator reads its log row
- **THEN** the row shows the message type
- **AND** it does not show the body or any rendered content

#### Scenario: grade10-site-auction-notifications-SC-26 - The send log is filterable by email
**Serves:** grade10-site-auction-notifications-US-05 - Operator looks up what a collector was sent

- **GIVEN** messages sent to two collectors on one or more lots
- **WHEN** an authorized operator filters the log by one collector's email
- **THEN** they see only rows sent to that address

### Requirement: A called-off lot stops its mail

Grade10 SHALL NOT send any message about a listing that has been called
off, from the moment it is called off. A message already sent SHALL NOT
be recalled; only messages not yet sent are suppressed.

#### Scenario: grade10-site-auction-notifications-SC-27 - A called-off lot sends nothing further
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a lot with collectors watching and bidding on it
- **WHEN** an operator calls it off
- **THEN** Grade10 sends no further message about that lot

#### Scenario: grade10-site-auction-notifications-SC-28 - A scheduled message is suppressed by a call-off
**Serves:** grade10-site-auction-notifications-US-02 - Collector returns before a lot closes

- **GIVEN** a lot 25 hours from its scheduled close, with watchers enrolled
- **WHEN** an operator calls it off
- **AND** the 24-hours-before point arrives
- **THEN** Grade10 does not send the closing-in-24-hours message
