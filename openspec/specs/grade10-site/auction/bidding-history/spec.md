# grade10-site/auction/bidding-history Specification

## Purpose
Lets a collector audit every retained bidding interaction on their own
storefront account and understand how public auction activity changed their
standing without exposing private bidding facts.

## Feature set

- Maximum-only actions
  - **Submission meaning:** treats every accepted bidder submission as an automatic maximum configuration or raise
  - **Refusal meaning:** keeps a below-minimum maximum attempt private and out of public history
- Ordered public records
  - **Automatic response:** places the existing leader's automatic response after the challenger's accepted action
  - **Tie outcome:** accepts an equal maximum without adding a challenger record, keeping one resolved record for the earlier leader
  - **Outbid outcome:** records only the bidder who submits the higher maximum when no automatic response is placed for the displaced bidder
- Boundary cases
  - **Resolved amounts:** fixes the eight outcomes around the current bid, increment, and leader maximum

## Requirements

### Requirement: A storefront account has one retained bidding index

Grade10 SHALL give a signed-in collector a private index containing every
listing on which that storefront account has a retained maximum attempt or
automatic-bid activity. A listing SHALL appear once, ordered by its latest
bidding activity, with its title, image when available, current or final price,
currency, latest activity time, and the collector's current standing.

The standing SHALL distinguish pending, leading, outbid, won, lost, canceled,
and failed-only participation. Failed-only means the account has one or more
failed maximum attempts on the listing and no accepted automatic maximum or
automatic bid. Amounts SHALL be integer counts of minor units paired with an
ISO 4217 currency code.

The index SHALL be cursor-paged without duplicates or omissions. It SHALL offer
an **Active** filter for listings whose bidding remains open and a **Completed**
filter for listings whose bidding has ended or been canceled. Retained entries
SHALL have no account control to delete or hide them.

#### Scenario: grade10-site-auction-bidding-history-SC-01 - Repeated activity is grouped under one listing

- **GIVEN** a collector has configured an automatic maximum and raised that maximum on one listing
- **WHEN** the collector reads their bidding index
- **THEN** that listing appears once at the position of its latest activity
- **AND** its summary carries the collector's current standing rather than one row per action

#### Scenario: grade10-site-auction-bidding-history-SC-02 - A failed-only listing remains explainable

- **GIVEN** a collector's server-evaluated maximum attempts on a listing all failed
- **AND** no automatic maximum or automatic bid was accepted for that account
- **WHEN** the collector reads their bidding index
- **THEN** the listing appears with failed-only standing
- **AND** the collector can open its history to read each safe failure reason

#### Scenario: grade10-site-auction-bidding-history-SC-03 - Active and completed activity separate cleanly

- **GIVEN** a signed-in collector has activity on one open listing, one closed listing, and one canceled listing
- **WHEN** the collector selects **Active**
- **THEN** only the open listing appears
- **WHEN** the collector selects **Completed**
- **THEN** the closed and canceled listings appear

#### Scenario: grade10-site-auction-bidding-history-SC-04 - Paging does not repeat or skip a listing

- **GIVEN** a collector has more bidding listings than one page holds
- **WHEN** the collector follows every returned cursor while no newer activity is added
- **THEN** every matching listing appears exactly once in latest-activity order

#### Scenario: grade10-site-auction-bidding-history-SC-05 - An account with no bidding activity has an empty index

- **GIVEN** a signed-in storefront account with no retained maximum attempt or automatic-bid activity
- **WHEN** the collector reads their bidding index
- **THEN** Grade10 returns an empty result rather than another account's or another storefront's activity

### Requirement: One listing history combines public movement and private meaning

For a listing on which the signed-in account has activity, Grade10 SHALL return
one stably ordered, cursor-paged chronology combining every retained accepted
public history record from the auction log with that account's private events
and standing transitions. An accepted public history record may represent a
bidder's accepted maximum-setting action at the amount submitted or a bid
Grade10 places automatically. Events with the same timestamp SHALL keep a
stable auction-defined order so that later pages cannot reorder them.

When one accepted maximum-setting action causes an automatic response, the
challenger's public record SHALL precede the automatic response in the same
timestamp group. A public record SHALL show the listing pseudonym and resolved
public amount, while a private maximum-setting event MAY show its owner's
maximum only in that owner's history. A bidder who is outbid without
submitting a new maximum SHALL receive the standing transition and any
existing outbid notification, but SHALL NOT receive a new bid record for the
other bidder's action.

The combined history SHALL render the account's auction pseudonym as **You**
and every rival only by that listing's pseudonym. It SHALL merge two facts from
one auction decision into one understandable step rather than presenting
contradictory duplicates.

#### Scenario: grade10-site-auction-bidding-history-SC-11 - A competing bid visibly causes an outbid state

- **GIVEN** the collector is leading a listing
- **WHEN** a rival's accepted public history record displaces the collector
- **THEN** the combined history shows that rival under its listing pseudonym
- **AND** the same step marks **You were outbid** at the resulting public price
- **AND** it reveals neither account's still-hidden private maximum

#### Scenario: grade10-site-auction-bidding-history-SC-12 - An automatic response is attributed to You

- **GIVEN** a rival maximum-setting action causes the collector's automatic maximum to advance the public price
- **WHEN** the collector reads the combined history
- **THEN** the rival's accepted action appears before the collector's resulting automatic movement when they share a timestamp
- **AND** the resulting accepted movement is attributed to **You** and marked as automatic
- **AND** the private automatic event is not rendered as a contradictory second accepted bid

#### Scenario: grade10-site-auction-bidding-history-SC-13 - A failed attempt sits beside the unchanged auction state

- **GIVEN** a collector's maximum attempt fails while another bidder remains leading
- **WHEN** the collector reads the combined history
- **THEN** the failed private event appears at its authoritative time with its safe reason
- **AND** the auction's accepted price and leading pseudonym remain unchanged

#### Scenario: grade10-site-auction-bidding-history-SC-14 - Full retained history remains pageable

- **GIVEN** one listing has more public and private events than one page holds
- **WHEN** the collector follows every returned cursor while no new event is added
- **THEN** every retained event visible to that collector appears exactly once in stable order

### Requirement: Private bidding history follows the storefront identity boundary

Only an authenticated storefront backend acting through its storefront-pinned
Auction entrypoint SHALL read an account's bidding index or combined listing
history. The history SHALL match both the pinned storefront and the signed-in
account id. A matching account id from another storefront SHALL NOT grant
access.

Anonymous Auction reads SHALL continue to expose only accepted public price
movements and listing pseudonyms. They SHALL NOT expose failed attempts,
automatic maximums, private event kinds, payment facts, or the identity behind
a pseudonym. Reading history SHALL NOT place a bid or change any auction fact.

#### Scenario: grade10-site-auction-bidding-history-SC-15 - A storefront account reads its own history

- **GIVEN** a Grade10 storefront session for account A
- **WHEN** its backend requests A's bidding history through the Grade10-pinned
  Auction entrypoint
- **THEN** Auction returns only A's Grade10 activity and the public movements
  that belong in its combined histories

#### Scenario: grade10-site-auction-bidding-history-SC-16 - The same account id on another storefront is unrelated

- **GIVEN** Grade10 and ZZZ each have an account with the same account id
- **WHEN** the ZZZ account reads its bidding history
- **THEN** it receives only activity created through the ZZZ-pinned entrypoint
- **AND** no Grade10 private event or maximum is returned

#### Scenario: grade10-site-auction-bidding-history-SC-17 - An anonymous reader cannot read private history

- **WHEN** a request without a storefront session attempts to read an account
  index or combined history
- **THEN** Grade10 refuses the request
- **AND** the anonymous public auction response gains no private field

#### Scenario: grade10-site-auction-bidding-history-SC-18 - Reading history is inert

- **GIVEN** any retained bidding history
- **WHEN** an authorized collector reads or pages it
- **THEN** no bid, maximum, hold, listing standing, or auction close changes

### Requirement: Grade10 presents bidding history at the account's bids address

The Grade10 site SHALL serve the signed-in bidding index at `/bids` inside the
existing site chrome. A signed-out visitor SHALL be sent through the existing
sign-in flow with `/bids` as the return destination. ZZZ SHALL NOT gain a screen
from this change.

The page SHALL default to **Active**, offer **Active** and **Completed** filters,
and show each listing as a summary that can expand its combined history without
leaving the page. An open listing on which the collector can bid again SHALL
offer a route back to that listing. Opening the listing or moving between
history pages SHALL use application navigation without a document reload.

The page SHALL format money from minor units and currency, and dates and times
in the reader's locale. It SHALL distinguish initial loading, empty Active,
empty Completed, page failure, history loading, history failure, and further
pages without blanking summaries that are already available.

#### Scenario: grade10-site-auction-bidding-history-SC-19 - A signed-in collector opens active bids

- **GIVEN** a signed-in Grade10 collector with active and completed bidding
  activity
- **WHEN** the collector opens `/bids`
- **THEN** the page shows the Active summaries inside the existing site chrome
- **AND** the collector can switch to Completed without a document reload

#### Scenario: grade10-site-auction-bidding-history-SC-20 - An outbid summary leads to its explanation and listing

- **GIVEN** an open listing on which the collector is outbid
- **WHEN** the collector expands that summary
- **THEN** the combined history identifies the public movement that outbid
  **You**
- **AND** the page offers a route to the still-open listing

#### Scenario: grade10-site-auction-bidding-history-SC-21 - A signed-out visitor preserves the destination

- **WHEN** a signed-out visitor opens `/bids`
- **THEN** the Grade10 site starts its existing sign-in flow
- **AND** successful sign-in returns the collector to `/bids`

#### Scenario: grade10-site-auction-bidding-history-SC-22 - An empty filter is explicit

- **GIVEN** a signed-in collector with no entries in the selected filter
- **WHEN** the filter finishes loading
- **THEN** the page names that the selected bidding history is empty
- **AND** it does not show a loading placeholder or failure message

#### Scenario: grade10-site-auction-bidding-history-SC-23 - Initial loading reserves the bidding list

- **GIVEN** a signed-in collector opening `/bids`
- **WHEN** the selected index page has not answered yet
- **THEN** the page shows a labeled bidding-history loading state inside the
  site chrome
- **AND** it does not claim that the selected filter is empty or failed

#### Scenario: grade10-site-auction-bidding-history-SC-24 - An index failure is retryable

- **GIVEN** a signed-in collector opening `/bids`
- **WHEN** the selected index page fails to load
- **THEN** the page shows a retryable bidding-history error
- **AND** it does not claim that the selected filter is empty

#### Scenario: grade10-site-auction-bidding-history-SC-25 - Expanding history preserves its summary while loading

- **GIVEN** a visible bidding summary
- **WHEN** the collector expands it and its combined history has not answered
  yet
- **THEN** that summary stays visible with a labeled history-loading state
- **AND** the page does not show an empty history or failure message

#### Scenario: grade10-site-auction-bidding-history-SC-26 - Loading more preserves entries already shown

- **GIVEN** a visible index or combined history page with a further cursor
- **WHEN** the collector requests the next page
- **THEN** the entries already shown remain visible while the next page loads
- **AND** the control cannot submit the same next-page request twice

#### Scenario: grade10-site-auction-bidding-history-SC-27 - A history failure preserves the listing summary

- **GIVEN** the bidding index is visible
- **WHEN** one expanded listing history fails to load
- **THEN** that summary remains visible with a retryable history error
- **AND** other summaries and their histories remain usable

#### Scenario: grade10-site-auction-bidding-history-SC-28 - ZZZ receives no bidding-history page

- **WHEN** this change is delivered
- **THEN** the ZZZ storefront has no new bidding-history route or screen
- **AND** its authenticated backend remains compatible with the shared history
  contract

### Requirement: Every server-evaluated maximum action leaves a private event

Grade10 SHALL retain a timestamped private event when the Auction authority
receives a signed-in account's automatic maximum configuration or raise,
refuses that maximum attempt, or places an automatic bid for that account. A
configured or raised maximum event SHALL carry the account's resulting private
maximum. An automatic-bid event SHALL distinguish an engine-placed bid from a
maximum-setting action. Manual bid requests SHALL NOT be accepted or retained
as bidding-history events.

A refused maximum attempt SHALL retain a stable, collector-safe reason covering
the applicable category: the bidding window, minimum amount, account
eligibility, payment authorization, stale competing price, or unavailable
bidding capability. It SHALL NOT expose a payment-provider message, card data,
secret, another account's maximum, or another account's identity. Input
rejected only inside the browser before a request reaches Auction SHALL NOT
become an Auction history event.

The retained action-log type vocabulary SHALL contain exactly:

- `automatic_max_configured` — the account configured its first automatic maximum for the listing;
- `automatic_max_raised` — the account raised its existing automatic maximum;
- `automatic_max_refused` — Auction refused the account's maximum attempt;
- `automatic_bid_accepted` — the engine placed an accepted bid for the account;
- `accepted_price` — an accepted public price movement occurred; and
- `standing_changed` — the account's standing on the listing changed.

The safe failure-code vocabulary SHALL contain exactly:

- `window` — the listing is outside its bidding window;
- `minimum` — the attempted maximum does not meet the current minimum;
- `account` — the account is not eligible to bid;
- `payment` — payment authorization did not succeed;
- `stale_price` — a competing price made the evaluated request stale; and
- `unavailable` — bidding could not be evaluated because the capability was unavailable.

#### Scenario: grade10-site-auction-bidding-history-SC-37 - A manual bid is not accepted

- **WHEN** a collector submits a manual bid request
- **THEN** Auction refuses it because bidding accepts automatic maximums only
- **AND** no manual bid event is retained
- **AND** the collector is directed to submit an automatic maximum instead

#### Scenario: grade10-site-auction-bidding-history-SC-38 - A server-evaluated maximum fails

- **WHEN** Auction refuses a collector's maximum attempt after evaluating it
- **THEN** the collector's history records the attempted amount, failure time, and safe reason category
- **AND** the failed attempt does not appear in the anonymous auction log or accepted bid count

#### Scenario: grade10-site-auction-bidding-history-SC-39 - Browser-only validation creates no Auction event

- **GIVEN** a collector enters a malformed maximum that the browser refuses to submit
- **WHEN** the collector later reads the listing's history
- **THEN** that local validation failure is absent from the Auction history

#### Scenario: grade10-site-auction-bidding-history-SC-40 - An automatic maximum is configured and raised

- **WHEN** a collector configures an automatic maximum and later raises it
- **THEN** the collector's private history records both resulting maximums in order
- **AND** neither maximum appears in any rival's history or anonymous read while it remains hidden

#### Scenario: grade10-site-auction-bidding-history-SC-41 - The engine bids for the collector

- **GIVEN** a collector has an active automatic maximum
- **WHEN** the automatic-bidding engine places a bid for that account
- **THEN** the collector's private history labels the action as automatic
- **AND** the accepted public price movement remains subject to the auction's existing pseudonym rules

### Requirement: Maximum-only bidding records resolve the boundary cases

For the scenarios below, the listing is an open auction in `USD`, all amounts
are integer minor units, bidder A has an accepted automatic maximum of 1000,
the current public bid is 400, and the applicable bid increment is 100. Each
accepted submission by bidder B is an automatic maximum-setting action, not a
manual bid. Grade10 SHALL apply one resolution to the submission and SHALL NOT
create intermediate increments.

The public history SHALL show the resolved public amount and the bidder's
listing pseudonym. The account history SHALL retain B's submitted maximum. When
B is immediately outbid while A remains ahead, the public history SHALL show B
first at B's submitted maximum and A second at the resulting amount. When B
leads, the public history SHALL show B once at the resolved public amount. A
notification or standing transition for A SHALL NOT create an A bid record
unless A submits a new maximum or Grade10 places an automatic bid for A.

#### Scenario: grade10-site-auction-bidding-history-SC-29 - A maximum below the next bid is refused

- **WHEN** bidder B submits an automatic maximum of 450 minor units
- **THEN** Auction refuses the submission because it is below the current bid plus one increment, 500 minor units
- **AND** the public history remains at 400 minor units with A leading
- **AND** B's private history records the refused maximum with the `minimum` reason

#### Scenario: grade10-site-auction-bidding-history-SC-30 - A matching minimum creates challenger and response records

- **WHEN** bidder B submits an automatic maximum of 500 minor units
- **THEN** the public history records B leading at 500 minor units
- **AND** the same timestamp group then records A's automatic response leading at 600 minor units
- **AND** B's private history retains the submitted maximum of 500 minor units

#### Scenario: grade10-site-auction-bidding-history-SC-31 - A lower maximum below A's cap creates two ordered records

- **WHEN** bidder B submits an automatic maximum of 700 minor units
- **THEN** the public history records B leading at 700 minor units
- **AND** the same timestamp group then records A's automatic response leading at 800 minor units
- **AND** B's private history retains the submitted maximum of 700 minor units

#### Scenario: grade10-site-auction-bidding-history-SC-32 - A maximum one increment below A's cap stops at A's maximum

- **WHEN** bidder B submits an automatic maximum of 950 minor units
- **THEN** the public history records B leading at 950 minor units
- **AND** the same timestamp group then records A's automatic response leading at 1000 minor units
- **AND** A's response does not exceed A's maximum

#### Scenario: grade10-site-auction-bidding-history-SC-33 - An equal maximum is accepted without changing the earlier leader

- **WHEN** bidder B submits an automatic maximum of 1000 minor units
- **THEN** Auction accepts the maximum
- **AND** the public history contains one record for A at 1000 minor units
- **AND** A remains the leader at 1000 minor units
- **AND** B's accepted maximum remains private and does not create a separate public record

#### Scenario: grade10-site-auction-bidding-history-SC-34 - A maximum just above A's cap takes the lead

- **WHEN** bidder B submits an automatic maximum of 1001 minor units
- **THEN** the public history records B leading at 1001 minor units
- **AND** A receives the existing outbid standing transition and notification without a new A bid record
- **AND** B's private history retains the submitted maximum of 1001 minor units

#### Scenario: grade10-site-auction-bidding-history-SC-35 - A maximum equal to the next increment takes the lead once

- **WHEN** bidder B submits an automatic maximum of 1100 minor units
- **THEN** the public history records B leading at 1100 minor units
- **AND** A receives the existing outbid standing transition and notification without a new A bid record
- **AND** no intermediate public records are created

#### Scenario: grade10-site-auction-bidding-history-SC-36 - A higher maximum is capped at one increment above A's cap

- **WHEN** bidder B submits an automatic maximum of 1120 minor units
- **THEN** the public history records B leading at 1100 minor units, which is one increment above A's 1000-minor-unit maximum
- **AND** B's private history retains the submitted maximum of 1120 minor units
- **AND** A receives the existing outbid standing transition and notification without a new A bid record
