# grade10-site/auction/bidding-history Specification

## Feature set

- Maximum-only actions
  - **Submission meaning:** treats every accepted bidder submission as an automatic maximum configuration or raise
  - **Refusal meaning:** a refused attempt is not a bid; it leaves no event, no
    index entry and no standing
- Ordered public records
  - **Automatic response:** logs the existing leader's automatic response after the challenger's accepted action; the history reads them in the opposite order
  - **Tie outcome:** accepts an equal maximum, logs the challenger before the earlier leader's automatic response at the same resolved amount, and keeps the earlier leader; the history reads the response above the challenger
  - **Outbid outcome:** records only the bidder who submits the higher maximum when no automatic response is placed for the displaced bidder
  - **History order:** the combined history reads by bid amount, higher on top;
    at one timestamp the automatic response reads above the challenger's
    record, a maximum set reads below the bid it causes, and a maximum raise
    that causes no bid reads by its own time, newer above older, whatever
    order the auction recorded them in
  - **Whole decisions per page:** a history page ends on a whole auction
    decision, never splitting one
- Boundary cases
  - **Resolved amounts:** fixes the eight outcomes around the current bid, increment, and leader maximum
- Lot personal bidding
  - **Maximum history:** accepted configure and raise caps the owner re-reads on the lot
  - **Bid sequence:** automatic bids Grade10 placed for the owner on that lot
  - **Account labels:** maximum set and raised wording matches the lot
- Privacy boundary
  - **Owner only:** lot lists never expose a rival maximum or identity
  - **Public recent bids:** unchanged public price movements and listing pseudonyms
  - **Public avatar letter:** one email-derived character on public bid rows; never the full email or a name

## MODIFIED Requirements

### Requirement: One listing history combines public movement and private meaning in whole decisions

For a listing on which the signed-in account has activity, Grade10 SHALL return
one stably ordered, cursor-paged history combining every retained accepted
public history record from the auction log with that account's private events
and standing transitions. An accepted public history record may represent a
bidder's accepted maximum-setting action at the amount submitted or a bid
Grade10 places automatically. The history SHALL follow bid amount order, the
higher amount above the lower, and every record one auction decision wrote
SHALL sort with that decision's highest public bid; a record whose decision
wrote no public bid, such as a maximum raise that causes none, SHALL sort by
its own time among the other records, the newer above the older. Public recent
bids are not part of this history and keep their order. Events with the same timestamp SHALL keep a
stable order that applies the rules below, so that later pages cannot reorder
them.

When one accepted maximum-setting action causes an automatic response, the
challenger's public record is the older of the two, so within the same
timestamp group the automatic response SHALL read above the challenger's public
record. A private maximum-setting event SHALL read below the bid it causes by
the same rule. This ordering SHALL also apply when the challenger maximum
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

<!-- trace:scenario id=g10.auction-bidding-history.SC-9ii rev=2 -->
#### Scenario: grade10-site-auction-bidding-history-SC-12 - An automatic response is attributed to You
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** a rival maximum-setting action causes the collector's automatic maximum to advance the public price
- **WHEN** the collector reads the combined history
- **THEN** the collector's resulting automatic movement appears above the rival's accepted action when they share a timestamp
- **AND** the resulting accepted movement is attributed to **You** and marked as automatic
- **AND** the private automatic event is not rendered as a contradictory second accepted bid

<!-- trace:scenario id=g10.auction-bidding-history.SC-m9q rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-54 - A maximum set reads below the bid it causes
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** a collector whose accepted maximum-setting action also placed their public bid at a stated amount
- **WHEN** the collector reads the combined history
- **THEN** the history reads that bid above the collector's maximum-set event when they share a timestamp, even where the maximum is the higher amount
- **AND** the history reads a higher amount above a lower one across timestamps

<!-- trace:scenario id=g10.auction-bidding-history.SC-d6n rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-55 - A rival's automatic response reads above the collector's bid
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** a collector's accepted maximum-setting action causes a rival's automatic response
- **WHEN** the collector reads the combined history
- **THEN** the rival's automatic response, under the listing pseudonym, reads above the collector's own bid when they share a timestamp
- **AND** where the two maximums are equal, both records show the same amount, the earlier leader remains leading, and the response still reads above the collector's bid

<!-- trace:scenario id=g10.auction-bidding-history.SC-y3v rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-56 - A maximum raise that causes no bid reads by its time
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** a collector leads a listing and raises their maximum, which causes no public bid
- **WHEN** the collector reads the combined history
- **THEN** the raise reads above every record older than it and below every record newer than it
- **AND** it reads above the maximum it raised and the bid that maximum caused

<!-- trace:scenario id=g10.auction-bidding-history.SC-k4s rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-14 - Full retained history remains pageable
**Serves:** grade10-site-auction-bidding-history-US-03 - Collector reads one listing's combined history

- **GIVEN** one listing has more public and private events than one page holds
- **WHEN** the collector follows every returned cursor while no new event is added
- **THEN** every retained event visible to that collector appears exactly once in stable order

<!-- trace:scenario id=g10.auction-bidding-history.SC-1rj rev=1 -->
#### Scenario: grade10-site-auction-bidding-history-SC-48 - A page never splits one auction decision
**Serves:** grade10-site-auction-bidding-history-US-03 - a collector paging a listing's history reads each decision as one step

- **GIVEN** a listing whose one auction decision wrote the collector's maximum,
  their accepted price of 30000 USD minor units, a rival's response at 31000 USD
  minor units, and the collector's outbid standing, between an older and a
  newer rival price
- **WHEN** the collector follows every cursor at a page size of 1
- **THEN** every record of that decision comes back on one page
- **AND** the walk reads the same records in the same order as one page of 50
