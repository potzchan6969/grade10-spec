# grade10-site/auction/listing-page Specification

## Feature set

- Close and result
  - Existing words only: Extended bidding for an extension, and a bid refused
    past the close in the bid form's own words

## RENAMED Requirements

- FROM: `### Requirement: A lot shows its result only once the close is recorded`
- TO: `### Requirement: A lot reads Closed until its close is recorded, then its result`

### Requirement: A lot reads Closed until its close is recorded, then its result

Past the lot's effective close and until its close is recorded, the page SHALL
show the existing Closed state with no result, the current bid as it stood,
and the bid controls disabled. It SHALL NOT work out a result from its own
clock. Once the close is recorded, the page SHALL show the recorded result.
When a later recorded close arrives instead, the page SHALL return to Extended
bidding.

| Viewer | Recorded result | Shows |
| --- | --- | --- |
| The winner | Sold | Won |
| Another bidder | Sold | Did not win |
| Anyone else | Sold | The winning bid |
| Anyone | No winner | Ended, with No bids under it |

The page SHALL use only existing words for the moments around the close:

| Moment | Words |
| --- | --- |
| A bid refused as placed at or after the close | Your bid did not go through. - the bid form's own words for that refusal, under the bid action |
| A price-moving bid extends the lot | Extended bidding |

#### Scenario: grade10-site-auction-listing-page-SC-37 - The winner reads Closed, then Won
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder leading a lot on its page
- **WHEN** the effective close passes and the close is recorded later
- **THEN** until it is recorded the page shows Closed with no result, and
  never Ended or Did not win
- **AND** once it is recorded the page shows Won, without a reload

#### Scenario: grade10-site-auction-listing-page-SC-38 - A losing bidder reads Did not win from the record
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder who was outbid on a lot whose page they have open
- **WHEN** the close is recorded with another winner
- **THEN** the page shows Did not win, without a reload

#### Scenario: grade10-site-auction-listing-page-SC-40 - No new state appears between the close and the result
**Serves:** `Close and result` - the page between the effective close and the recorded close

- **GIVEN** a lot page past the effective close with the close not yet
  recorded
- **WHEN** the page shows the lot
- **THEN** its status reads Closed with no result, and no label names a
  closing or final-deadline state

#### Scenario: grade10-site-auction-listing-page-SC-42 - A later close returns the page to Extended bidding
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a lot page showing Closed with no result past the deadline it
  counted to
- **WHEN** a later recorded close arrives for that lot
- **THEN** the page shows Extended bidding and counts to the later close
- **AND** its bid controls are enabled again

#### Scenario: grade10-site-auction-listing-page-SC-45 - A bid at the close reads only that it did not go through
**Serves:** grade10-site-auction-listing-page-US-14 - Bidder waits on a closed lot for its result

- **GIVEN** a bidder on the page of a lot whose effective close has just passed,
  before the page has disabled its bid controls
- **WHEN** they place a bid and Grade10 refuses it as past the close
- **THEN** the bid form shows Your bid did not go through. under the bid
  action, and no other words about the bid

#### Scenario: grade10-site-auction-listing-page-SC-47 - A lot nobody bid on reads Ended with No bids
**Serves:** grade10-site-auction-listing-page-US-14 - a collector with the page open waits on a lot that took no bid

- **GIVEN** a lot with no accepted bid, its page open
- **WHEN** the close is recorded with no winner
- **THEN** the page shows Closed, then Ended with No bids under it, without a
  reload
- **AND** it shows neither Won nor Did not win
