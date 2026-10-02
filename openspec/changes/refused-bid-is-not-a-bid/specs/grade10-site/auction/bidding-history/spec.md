# grade10-site/auction/bidding-history Specification

## Feature set

- Maximum-only actions
  - **Refusal meaning:** a refused attempt is not a bid; it leaves no event, no
    index entry and no standing
- Ordered public records
  - **Whole decisions per page:** a history page ends on a whole auction
    decision, never splitting one
- Lot personal bidding
  - **Account labels:** maximum set and raised wording matches the lot

## RENAMED Requirements

- FROM: `### Requirement: A storefront account has one retained bidding index`
- TO: `### Requirement: A storefront account has one index of the listings it bid on`

- FROM: `### Requirement: One listing history combines public movement and private meaning`
- TO: `### Requirement: One listing history combines public movement and private meaning in whole decisions`

- FROM: `### Requirement: Every server-evaluated maximum action leaves a private event`
- TO: `### Requirement: Every accepted maximum action leaves a private event`

- FROM: `### Requirement: Account bidding chronology labels maximum events as maximums`
- TO: `### Requirement: Account bidding chronology labels the maximums set and raised`

### Requirement: A storefront account has one index of the listings it bid on

Grade10 SHALL give a signed-in collector a private index containing every
listing on which that storefront account placed a bid Grade10 accepted, either
a maximum the collector set or a bid Grade10 placed for them automatically. A
refused attempt is not a bid and SHALL add no listing to the index. A listing
SHALL appear once, ordered by its latest bidding activity, with its title,
image when available, current or final price, currency, latest activity time,
and the collector's current standing.

The standing SHALL be exactly one of these.

| Standing | When |
| --- | --- |
| Leading | The collector's bid is the highest valid bid |
| Outbid | A higher valid bid stands, while the listing is open or after it closes |
| Won | The listing closed with the collector's bid on top |
| Canceled | The listing was called off |

Only the bids a collector placed SHALL move their standing: a close or a
call-off SHALL move the standing of each collector who placed a bid on the
listing, and SHALL add no listing to the index of anyone who did not. Amounts
SHALL be integer counts of minor units paired with an ISO 4217 currency code.

The index SHALL be cursor-paged without duplicates or omissions. It SHALL offer
an **Active** filter for listings whose bidding remains open and a **Completed**
filter for listings whose bidding has ended or been canceled. Retained entries
SHALL have no account control to delete or hide them.

<!-- trace:scenario id=g10.auction-bidding-history.SC-sg5 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-01 - Repeated activity is grouped under one listing
**Serves:** grade10-site-auction-bidding-history-US-01 - Collector reads their bidding index

- **GIVEN** a collector has configured an automatic maximum and raised that maximum on one listing
- **WHEN** the collector reads their bidding index
- **THEN** that listing appears once at the position of its latest activity
- **AND** its summary carries the collector's current standing rather than one row per action

<!-- trace:scenario id=g10.auction-bidding-history.SC-nt1 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-03 - Active and completed activity separate cleanly
**Serves:** grade10-site-auction-bidding-history-US-01 - Collector reads their bidding index

- **GIVEN** a signed-in collector has activity on one open listing, one closed listing, and one canceled listing
- **WHEN** the collector selects **Active**
- **THEN** only the open listing appears
- **WHEN** the collector selects **Completed**
- **THEN** the closed and canceled listings appear

<!-- trace:scenario id=g10.auction-bidding-history.SC-70a rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-04 - Paging does not repeat or skip a listing
**Serves:** grade10-site-auction-bidding-history-US-01 - Collector reads their bidding index

- **GIVEN** a collector has more bidding listings than one page holds
- **WHEN** the collector follows every returned cursor while no newer activity is added
- **THEN** every matching listing appears exactly once in latest-activity order

<!-- trace:scenario id=g10.auction-bidding-history.SC-cpz rev=2 -->
#### Scenario: grade10-site-auction-bidding-history-SC-05 - An account with no bidding activity has an empty index
**Serves:** grade10-site-auction-bidding-history-US-01 - Collector reads their bidding index

- **GIVEN** a signed-in storefront account that has placed no bid
- **WHEN** the collector reads their bidding index
- **THEN** Grade10 returns an empty result rather than another account's or another storefront's activity

#### Scenario: grade10-site-auction-bidding-history-SC-47 - A call-off moves only the collectors who placed a bid
**Serves:** grade10-site-auction-bidding-history-US-01 - a collector reads a called-off listing on their index only when they bid on it

- **GIVEN** an open listing on which collector A placed a bid and collector B
  placed none
- **WHEN** an operator calls the listing off
- **THEN** A's index lists it under **Completed** with standing Canceled
- **AND** B's index has no entry for it and B's history gains no event

### Requirement: One listing history combines public movement and private meaning in whole decisions

For a listing on which the signed-in account has activity, Grade10 SHALL return
one stably ordered, cursor-paged chronology combining every retained accepted
public history record from the auction log with that account's private events
and standing transitions. An accepted public history record may represent a
bidder's accepted maximum-setting action at the amount submitted or a bid
Grade10 places automatically. Events with the same timestamp SHALL keep a
stable auction-defined order so that later pages cannot reorder them.

When one accepted maximum-setting action causes an automatic response, the
challenger's public record SHALL precede the automatic response in the same
timestamp group. This ordering SHALL also apply when the challenger maximum
equals the earlier leader's maximum: both records SHALL show the same resolved
amount, and the earlier leader SHALL remain leading. A public record SHALL show
the listing pseudonym and resolved public amount, while a private
maximum-setting event MAY show its owner's maximum only in that owner's
history. A bidder who is outbid without submitting a new maximum SHALL receive
the standing transition and any existing outbid notification, but SHALL NOT
receive a new bid record for the other bidder's action.

The combined history SHALL render the account's auction pseudonym as **You**
and every rival only by that listing's pseudonym. It SHALL merge two facts from
one auction decision into one understandable step rather than presenting
contradictory duplicates. A page SHALL end on a whole auction decision: every
record one decision wrote SHALL fall on the same page, so a page MAY run past
the requested size by the rest of its last decision.

<!-- trace:scenario id=g10.auction-bidding-history.SC-pbt rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-11 - A competing bid visibly causes an outbid state
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** the collector is leading a listing
- **WHEN** a rival's accepted public history record displaces the collector
- **THEN** the combined history shows that rival under its listing pseudonym
- **AND** the same step marks **You were outbid** at the resulting public price
- **AND** it reveals neither account's still-hidden private maximum

<!-- trace:scenario id=g10.auction-bidding-history.SC-9ii rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-12 - An automatic response is attributed to You
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** a rival maximum-setting action causes the collector's automatic maximum to advance the public price
- **WHEN** the collector reads the combined history
- **THEN** the rival's accepted action appears before the collector's resulting automatic movement when they share a timestamp
- **AND** the resulting accepted movement is attributed to **You** and marked as automatic
- **AND** the private automatic event is not rendered as a contradictory second accepted bid

<!-- trace:scenario id=g10.auction-bidding-history.SC-k4s rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-14 - Full retained history remains pageable
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** one listing has more public and private events than one page holds
- **WHEN** the collector follows every returned cursor while no new event is added
- **THEN** every retained event visible to that collector appears exactly once in stable order

#### Scenario: grade10-site-auction-bidding-history-SC-48 - A page never splits one auction decision
**Serves:** grade10-site-auction-bidding-history-US-03 - a collector paging a listing's history reads each decision as one step

- **GIVEN** a listing whose one auction decision wrote the collector's maximum,
  their accepted price of 30000 USD minor units, a rival's response at 31000 USD
  minor units, and the collector's outbid standing, between an older and a
  newer rival price
- **WHEN** the collector follows every cursor at a page size of 1
- **THEN** every record of that decision comes back on one page
- **AND** the walk reads the same records in the same order as one page of 50

### Requirement: Every accepted maximum action leaves a private event

Grade10 SHALL retain a timestamped private event when the Auction authority
accepts a signed-in account's automatic maximum configuration or raise, or
places an automatic bid for that account. A configured or raised maximum event
SHALL carry the account's resulting private maximum. An automatic-bid event
SHALL distinguish an engine-placed bid from a maximum-setting action. Every bid
a collector places SHALL be a maximum; there SHALL be no manual bid request
and no manual bid event.

A refused attempt SHALL NOT be a bid. It SHALL leave no event, no index entry
and no standing, and SHALL change no entry's standing or latest activity; the
bid form shows why it was refused, per `grade10-site/auction/auction`. Input
rejected only inside the browser before a request reaches Auction SHALL NOT
become an Auction history event.

The retained action-log type vocabulary SHALL contain exactly:

- `automatic_max_configured` — the account configured its first automatic maximum for the listing;
- `automatic_max_raised` — the account raised its existing automatic maximum;
- `automatic_bid_accepted` — the engine placed an accepted bid for the account;
- `accepted_price` — an accepted public price movement occurred; and
- `standing_changed` — the account's standing on the listing changed.

#### Scenario: grade10-site-auction-bidding-history-SC-51 - Every bid is a maximum, never a manual bid
**Serves:** grade10-site-auction-bidding-history-US-02 - Collector audits every maximum Grade10 accepted

- **WHEN** a collector places a bid of 50000 USD minor units that Grade10 accepts
- **THEN** their history records it as an automatic maximum of 50000 USD minor units
- **AND** no manual bid event is retained

<!-- trace:scenario id=g10.auction-bidding-history.SC-vd5 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-39 - Browser-only validation creates no Auction event
**Serves:** grade10-site-auction-bidding-history-US-02 - Collector audits every maximum Grade10 accepted

- **GIVEN** a collector enters a malformed maximum that the browser refuses to submit
- **WHEN** the collector later reads the listing's history
- **THEN** that local validation failure is absent from the Auction history

<!-- trace:scenario id=g10.auction-bidding-history.SC-qhu rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-40 - An automatic maximum is configured and raised
**Serves:** grade10-site-auction-bidding-history-US-02 - Collector audits every maximum Grade10 accepted

- **WHEN** a collector configures an automatic maximum and later raises it
- **THEN** the collector's private history records both resulting maximums in order
- **AND** neither maximum appears in any rival's history or anonymous read while it remains hidden

<!-- trace:scenario id=g10.auction-bidding-history.SC-qvv rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-41 - The engine bids for the collector
**Serves:** grade10-site-auction-bidding-history-US-02 - Collector audits every maximum Grade10 accepted

- **GIVEN** a collector has an active automatic maximum
- **WHEN** the automatic-bidding engine places a bid for that account
- **THEN** the collector's private history labels the action as automatic
- **AND** the accepted public price movement remains subject to the auction's existing pseudonym rules

#### Scenario: grade10-site-auction-bidding-history-SC-49 - A refused first bid leaves no trace in the record
**Serves:** grade10-site-auction-bidding-history-US-01 - a collector whose only attempt was refused finds no listing in their index

- **GIVEN** an open listing on which the collector has placed no bid
- **WHEN** Grade10 refuses their bid of 9999 USD minor units twice as below the
  minimum
- **THEN** their index has no entry for that listing
- **AND** no event for that listing is retained in their history or in the
  public auction log

#### Scenario: grade10-site-auction-bidding-history-SC-50 - A refused raise leaves the entry as it was
**Serves:** grade10-site-auction-bidding-history-US-02 - a refused raise adds nothing to what the collector audits

- **GIVEN** an open listing on which the collector is Outbid
- **WHEN** Grade10 refuses their raise as below the minimum
- **THEN** the listing keeps standing Outbid with the latest activity it had
  before the refusal
- **AND** its history gains no event

### Requirement: Account bidding chronology labels the maximums set and raised

On the Grade10 `/bids` combined listing chronology, Grade10 SHALL present
private automatic maximum configuration and raise events with collector-facing
labels that name them as a maximum set or a maximum raised. The page SHALL NOT
add a new tab, filter, or maximums-only route for this distinction. ZZZ SHALL
NOT gain a screen from this requirement.

<!-- trace:scenario id=g10.auction-bidding-history.SC-9ua rev=2 -->
#### Scenario: grade10-site-auction-bidding-history-SC-46 - Account chronology names maximum set and raise
**Serves:** grade10-site-auction-bidding-history-US-08 - Collector reads clearer maximum labels on /bids

- **GIVEN** a signed-in collector whose listing chronology includes an accepted
  automatic maximum configuration and a later accepted raise
- **WHEN** they expand that listing on `/bids`
- **THEN** those events read as a maximum set and a maximum raised
- **AND** no new account tab or maximums-only route is offered

## MODIFIED Requirements

### Requirement: Private bidding history follows the storefront identity boundary

Only an authenticated storefront backend acting through its storefront-pinned
Auction entrypoint SHALL read an account's bidding index or combined listing
history. The history SHALL match both the pinned storefront and the signed-in
account id. A matching account id from another storefront SHALL NOT grant
access.

Anonymous Auction reads SHALL continue to expose only accepted public price
movements and listing pseudonyms. They SHALL NOT expose automatic maximums,
private event kinds, payment facts, or the identity behind a pseudonym.
Reading history SHALL NOT place a bid or change any auction fact.

<!-- trace:scenario id=g10.auction-bidding-history.SC-onh rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-15 - A storefront account reads its own history
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **GIVEN** a Grade10 storefront session for account A
- **WHEN** its backend requests A's bidding history through the Grade10-pinned
  Auction entrypoint
- **THEN** Auction returns only A's Grade10 activity and the public movements
  that belong in its combined histories

<!-- trace:scenario id=g10.auction-bidding-history.SC-2pg rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-16 - The same account id on another storefront is unrelated
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **GIVEN** Grade10 and ZZZ each have an account with the same account id
- **WHEN** the ZZZ account reads its bidding history
- **THEN** it receives only activity created through the ZZZ-pinned entrypoint
- **AND** no Grade10 private event or maximum is returned

<!-- trace:scenario id=g10.auction-bidding-history.SC-uu5 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-17 - An anonymous reader cannot read private history
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **WHEN** a request without a storefront session attempts to read an account
  index or combined history
- **THEN** Grade10 refuses the request
- **AND** the anonymous public auction response gains no private field

<!-- trace:scenario id=g10.auction-bidding-history.SC-izn rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-18 - Reading history is inert
**Serves:** grade10-site-auction-bidding-history-US-04 - Collector's bidding history stays on their storefront account

- **GIVEN** any retained bidding history
- **WHEN** an authorized collector reads or pages it
- **THEN** no bid, maximum, listing standing, or auction close changes

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

<!-- trace:scenario id=g10.auction-bidding-history.SC-dtm rev=2 -->
#### Scenario: grade10-site-auction-bidding-history-SC-29 - A maximum below the next bid is refused
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 450 minor units
- **THEN** Auction refuses the submission because it is below the current bid plus one increment, 500 minor units
- **AND** the public history remains at 400 minor units with A leading
- **AND** B's history gains no event for the refused maximum

<!-- trace:scenario id=g10.auction-bidding-history.SC-uqt rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-30 - A matching minimum creates challenger and response records
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 500 minor units
- **THEN** the public history records B leading at 500 minor units
- **AND** the same timestamp group then records A's automatic response leading at 600 minor units
- **AND** B's private history retains the submitted maximum of 500 minor units

<!-- trace:scenario id=g10.auction-bidding-history.SC-kwx rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-31 - A lower maximum below A's cap creates two ordered records
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 700 minor units
- **THEN** the public history records B leading at 700 minor units
- **AND** the same timestamp group then records A's automatic response leading at 800 minor units
- **AND** B's private history retains the submitted maximum of 700 minor units

<!-- trace:scenario id=g10.auction-bidding-history.SC-09w rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-32 - A maximum one increment below A's cap stops at A's maximum
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 950 minor units
- **THEN** the public history records B leading at 950 minor units
- **AND** the same timestamp group then records A's automatic response leading at 1000 minor units
- **AND** A's response does not exceed A's maximum

<!-- trace:scenario id=g10.auction-bidding-history.SC-usg rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-33 - An equal maximum creates two records for the earlier leader
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 1000 minor units
- **THEN** Auction accepts the maximum
- **AND** the public history records B first at 1000 minor units
- **AND** the public history then records A's automatic response at 1000 minor units
- **AND** A remains the leader at 1000 minor units
- **AND** both records belong to the same timestamp group
- **AND** B's accepted maximum remains private

<!-- trace:scenario id=g10.auction-bidding-history.SC-oyw rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-34 - A maximum just above A's cap takes the lead
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 1001 minor units
- **THEN** the public history records B leading at 1001 minor units
- **AND** A receives the existing outbid standing transition and notification without a new A bid record
- **AND** B's private history retains the submitted maximum of 1001 minor units

<!-- trace:scenario id=g10.auction-bidding-history.SC-4lm rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-35 - A maximum equal to the next increment takes the lead once
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 1100 minor units
- **THEN** the public history records B leading at 1100 minor units
- **AND** A receives the existing outbid standing transition and notification without a new A bid record
- **AND** no intermediate public records are created

<!-- trace:scenario id=g10.auction-bidding-history.SC-vc4 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-36 - A higher maximum is capped at one increment above A's cap
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **WHEN** bidder B submits an automatic maximum of 1120 minor units
- **THEN** the public history records B leading at 1100 minor units, which is one increment above A's 1000-minor-unit maximum
- **AND** B's private history retains the submitted maximum of 1120 minor units
- **AND** A receives the existing outbid standing transition and notification without a new A bid record

### Requirement: The lot personal bidding dialog separates maximum history from bids placed

For a signed-in storefront account that has retained personal bidding activity
on a listing, Grade10 SHALL let that owner open a lot personal bidding dialog
that shows:

1. A **Bid placed** list of every automatic bid Grade10 placed for that
   account on that listing, newest first, each carrying the accepted public
   amount and time. That list SHALL NOT include a bid-type column.
2. A **Your maximums** list of every accepted automatic maximum configuration
   or raise for that account on that listing, newest first, each carrying the
   resulting private maximum amount and its accepted time only. The list SHALL
   NOT show a Set, Raised, or other status word on the row.

The dialog SHALL present the tabs in that order — **Bid placed**, then
**Your maximums** — and SHALL default to **Bid placed** even when that list
is empty (showing an empty bids state). The two lists SHALL appear as peer
tabs (or an equivalent single-pane switch), not as one merged table and not as
two full tables stacked in one scroll. Title, description, and tab list SHALL
stay fixed while only the active list scrolls. The dialog SHALL NOT show a
sticky current-maximum summary; the live private maximum remains on the lot bid
panel only.

The lot dialog SHALL include only accepted configure and raise maximum events
and automatic bids for that owner. A refused attempt SHALL appear in neither
the lot dialog nor the account combined chronology. Reading either lot list
SHALL NOT place a bid or change any auction fact. Neither lot list SHALL expose
another account's maximum, identity, or payment facts. Anonymous and rival
reads of the listing SHALL continue to see only the existing public
recent-bids contract.

Amounts SHALL be integer counts of minor units paired with an ISO 4217 currency
code.

<!-- trace:scenario id=g10.auction-bidding-history.SC-mx5 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-42 - Collector opens maximum history on the lot
**Serves:** grade10-site-auction-bidding-history-US-07 - Collector reviews bids Grade10 placed on the lot

- **GIVEN** a signed-in collector with an accepted automatic maximum on a listing
  and no automatic bid placed for them yet
- **WHEN** they open the lot personal bidding dialog
- **THEN** the default tab is **Bid placed** and shows that no bids have been
  placed for them yet
- **AND** **Your maximums** lists that accepted maximum amount and time
- **AND** the tab order is **Bid placed**, then **Your maximums**
- **AND** the dialog shows no sticky current-maximum summary

<!-- trace:scenario id=g10.auction-bidding-history.SC-u76 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-43 - Bid placed remains the default when bids exist
**Serves:** grade10-site-auction-bidding-history-US-07 - Collector reviews bids Grade10 placed on the lot

- **GIVEN** a signed-in collector with at least one automatic bid Grade10 placed
  for them on a listing and at least one accepted maximum on that listing
- **WHEN** they open the lot personal bidding dialog
- **THEN** the default tab is **Bid placed**
- **AND** **Your maximums** still lists every accepted configure or raise for
  that owner on that listing, newest first

<!-- trace:scenario id=g10.auction-bidding-history.SC-roe rev=2 -->
#### Scenario: grade10-site-auction-bidding-history-SC-44 - Raised maximums appear on the lot without refusals
**Serves:** grade10-site-auction-bidding-history-US-06 - Collector reviews maximum history on the lot

- **GIVEN** a signed-in collector who configured a maximum, later raised it, and
  had a further raise refused on the same listing
- **WHEN** they open the lot personal bidding dialog
- **THEN** **Your maximums** lists only the accepted configure and raise amounts
  with times, newest first
- **AND** the refused raise is absent from both lot lists
- **AND** the refused raise is absent from that listing's account combined
  chronology at `/bids`

<!-- trace:scenario id=g10.auction-bidding-history.SC-g01 rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-45 - Lot personal bidding stays private and inert
**Serves:** grade10-site-auction-bidding-history-US-07 - Collector reviews bids Grade10 placed on the lot

- **GIVEN** a signed-in collector viewing a listing where a rival also has a
  private maximum
- **WHEN** the collector opens the lot personal bidding dialog
- **THEN** neither list shows the rival's maximum, identity, or payment facts
- **AND** the public recent-bids list on the lot is unchanged
- **AND** no bid, maximum, listing standing, or auction close changes
