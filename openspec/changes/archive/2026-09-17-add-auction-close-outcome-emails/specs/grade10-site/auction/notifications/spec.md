## Feature set

- Enrolment
  - Watch or bid with alerts on: either relationship enrols mail when
    email alerts are on for that listing
  - Close-outcome mail: enrolled watchers and non-winners hear when the lot
    stops taking bids; the winner does not get these letters
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
- Close-outcome messages
  - Lot closed, did not win: enrolled bidder when someone else won
  - Lot ended, watched: enrolled watch-only collector when the lot closes —
    Sold for when a winning bid is supplied; Ended-only when the lot closed
    with no bids (never a non-sale or Highest bid disclosure; not a bidder
    letter)
- Delivery
  - Registered email: every message goes to the account email
  - Shared letter: subject, preheader, heading, body, lot block (one primary image when available), listing action, footer; brand mark opens the storefront home; outbound links carry campaign tags
  - Stop email alerts: letters say alerts are on for the lot, then **Manage alerts** → My Auctions (sign-in first when signed out)
  - Failed send: a temporary failure is retried; a permanent one stops; a false statement is not sent
  - Call-off suppresses: a called-off listing sends nothing further
  - Send log: type, recipient email, listing, and Sent At — no body — filterable by email

## ADDED Requirements

### Requirement: Grade10 sends close-outcome messages when a lot stops taking bids

Grade10 SHALL send each close-outcome message once per listing per collector
to everyone enrolled for it when the listing stops taking bids, while email
alerts are on for that listing and the account-level auction email alerts
control is on.

| Message | When | Recipients | Campaign |
| --- | --- | --- | --- |
| This lot closed — you did not win | The lot closes with a winner who is not this collector | Enrolled bidders other than the winner | `lot_closed_didnt_win` |
| This lot has ended (watched) | The lot closes | Enrolled watchers who did not bid on it and are not the winner | `lot_ended_watched` |

A collector who both watches and bids SHALL receive the bidder close-outcome
letter for that close and SHALL NOT also receive the watched letter. The
winner of the lot SHALL NOT receive any close-outcome letter from this
capability; winning mail is `grade10-site/auction/notifications-order`.

When the lot closes with a winner, the non-winner letter SHALL name the
winning bid and the recipient's own bid amount when those amounts are
supplied. The watched letter SHALL name the winning bid as **Sold for** when
that amount is supplied.

When the lot closes with **no bids**, enrolled watchers with alerts on SHALL
receive the watched ended letter (campaign `lot_ended_watched`) with no
winning amount. That letter SHALL state that the lot has **ended** (or that
bidding has ended or closed). At close-email time, no bids means nobody won —
not a later winner default after a win. Grade10 SHALL NOT send a bidder
close-outcome letter for a no-bids close: nobody bid. Grade10 SHALL NOT send
campaign `lot_ended`. A collector SHALL receive at most one close-outcome
letter for that close. The watched letter SHALL NOT carry a **Sold for**,
**Winning bid**, or **Highest bid** highlight.

Subject, preheader and body of a no-bids close-outcome letter SHALL NOT use
the words or phrases **unsold**, **did not sell**, **didn't sell**, **no
sale**, or **no bids**.

Each message SHALL carry the listing's identity and the close time it
concerns. Money and times SHALL follow `money-amounts` and `dates-and-times`.
Close-outcome letters SHALL use the shared letter shape and mute control this
capability already defines.

#### Scenario: grade10-site-auction-notifications-SC-37 - A losing bidder is told the lot closed
**Serves:** grade10-site-auction-notifications-US-06 - Collector who lost hears the lot closed

- **GIVEN** a collector who bid on a lot with email alerts on
- **AND** another collector is the winner
- **WHEN** the lot closes
- **THEN** Grade10 sends the losing bidder the did-not-win letter (campaign
  `lot_closed_didnt_win`)
- **AND** when the winning bid and their bid amounts are supplied, the letter
  names both

#### Scenario: grade10-site-auction-notifications-SC-38 - A watch-only collector is told a sold lot ended
**Serves:** grade10-site-auction-notifications-US-07 - Watcher hears a sold lot ended

- **GIVEN** a collector who watches a lot with email alerts on and has never
  bid on it
- **AND** the lot closes with a winner
- **WHEN** Grade10 sends close-outcome mail for that lot
- **THEN** it sends them the watched ended letter (campaign
  `lot_ended_watched`)
- **AND** when the winning bid is supplied, the letter names it as Sold for

#### Scenario: grade10-site-auction-notifications-SC-39 - A watcher on a no-bids close hears ended only
**Serves:** grade10-site-auction-notifications-US-08 - Collector hears a no-bids close as ended only

- **GIVEN** a collector who watches a lot with email alerts on and has never
  bid on it
- **AND** the lot closes with no bids
- **WHEN** Grade10 sends close-outcome mail for that lot
- **THEN** it sends them the watched ended letter (campaign
  `lot_ended_watched`) with no winning amount
- **AND** the subject, preheader and body say the lot has ended or bidding
  has closed
- **AND** they do not contain unsold, did not sell, didn't sell, no sale, or
  no bids
- **AND** the letter carries no Sold for, Winning bid, or Highest bid
  highlight

#### Scenario: grade10-site-auction-notifications-SC-40 - No-bids close skips bidder mail and retires lot_ended
**Serves:** grade10-site-auction-notifications-US-08 - Collector hears a no-bids close as ended only

- **GIVEN** a lot that closes with no bids
- **AND** at least one enrolled watcher with email alerts on
- **WHEN** Grade10 sends close-outcome mail for that lot
- **THEN** it sends no bidder close-outcome letter
- **AND** it sends no letter with campaign `lot_ended`
- **AND** each enrolled watcher receives the watched ended letter (campaign
  `lot_ended_watched`) with no winning amount
- **AND** that letter carries no Sold for, Winning bid, or Highest bid
  highlight
- **AND** its subject, preheader and body do not contain unsold, did not
  sell, didn't sell, no sale, or no bids

#### Scenario: grade10-site-auction-notifications-SC-41 - A watcher who also bid gets one close letter
**Serves:** grade10-site-auction-notifications-US-06 - Collector who lost hears the lot closed

- **GIVEN** a collector who both watches a lot and has bid on it, with email
  alerts on
- **AND** the lot closes with a winner who is not that collector
- **WHEN** Grade10 sends close-outcome mail for that lot
- **THEN** they receive exactly one close-outcome letter
- **AND** it is the did-not-win letter (campaign `lot_closed_didnt_win`)
- **AND** they do not also receive the watched ended letter

#### Scenario: grade10-site-auction-notifications-SC-42 - The winner does not get a close-outcome letter
**Serves:** grade10-site-auction-notifications-US-06 - Collector who lost hears the lot closed

- **GIVEN** a collector who is the winner of a lot
- **AND** they also watch it with email alerts on
- **WHEN** the lot closes
- **THEN** Grade10 does not send them a close-outcome letter from this
  capability

#### Scenario: grade10-site-auction-notifications-SC-43 - Muted alerts stop close-outcome mail
**Serves:** grade10-site-auction-notifications-US-07 - Watcher hears a sold lot ended

- **GIVEN** a collector who watches a lot with email alerts off
- **WHEN** the lot closes with a winner
- **THEN** Grade10 does not send them the watched ended letter

## MODIFIED Requirements

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
| Watcher | The collector watches the listing | The four progress messages; close-outcome when they did not bid and did not win | Mute email alerts, unwatch, or account master off |
| Bidder | The collector has a committed bid on the listing | Closing warning, extended bidding, new-bid, outbid; close-outcome when they did not win | Mute email alerts or account master off; not by unwatch alone |

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
**Serves:** `grade10-site-auction-notifications-US-01`, `grade10-site-auction-notifications-US-02` - a watcher who also bids receives one copy

- **GIVEN** a collector who both watches a lot and has bid on it
- **AND** email alerts are on for that lot
- **WHEN** a message about that lot is sent
- **THEN** they receive exactly one copy of it

#### Scenario: grade10-site-auction-notifications-SC-03 - Unwatching does not end bidder enrolment
**Serves:** `grade10-site-auction-notifications-US-02`, `grade10-site-auction-notifications-US-04` - unwatching does not end bidder enrolment

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
  `new_bid`, `outbid`, `lot_closed_didnt_win`, or `lot_ended_watched`)
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

The control SHALL be offered on progress letters, on bid-activity
letters (outbid and new-bid), and on close-outcome letters whenever the
recipient has email alerts on for that listing.

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
**Serves:** `grade10-site-auction-notifications-US-01`, `grade10-site-auction-notifications-US-03` - manage alerts from a letter when signed out

- **GIVEN** a collector who receives a letter with email alerts on for that listing
- **AND** they are signed out of Grade10
- **WHEN** they activate **Manage alerts**
- **THEN** the Grade10 site starts its existing sign-in flow
- **AND** successful sign-in opens My Auctions

### Requirement: Operators can read a send log by type and email

Grade10 SHALL keep a log of every message it sends in this capability so
an operator can answer a collector who says they were not told. Each row
SHALL show the message type and SHALL NOT store or show the message body
or any other rendered content.

| Field | Meaning |
| --- | --- |
| Type | Which message kind was sent |
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
