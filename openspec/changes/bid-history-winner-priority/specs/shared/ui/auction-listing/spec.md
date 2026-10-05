# shared/ui/auction-listing Specification

## Feature set

- Public bid history outcome
  - Winner crown: closed sold winning row shows a primary crown after the amount
  - Equal-max tip: same-price non-leading row shows an Info tip in the amount tone
  - Live lots: no winner crown

## ADDED Requirements

### Requirement: Public bid history marks the closed winner and equal-max priority

Public Recent bids on the listing surface SHALL make the closed outcome and
equal-max priority readable without opening personal bidding.

**Winner flag** - `ListingBidHistoryRow` MAY carry `isWinner?: boolean`. The
consumer sets it on the winning public row when the lot is closed and sold.
Live lots SHALL NOT set `isWinner`.

**Equal-max flag** - `ListingBidHistoryRow` MAY carry
`samePricePriority?: boolean`. The consumer sets it on a public row whose
amount matches a row ranked above it, which leads because its maximum came
first. The list decides nothing about priority.

**Winner crown** - When `row.isWinner` is true and `copy.winner` is supplied,
`ListingBidHistoryList` SHALL render a small filled crown icon in the primary
color after the amount (and after any equal-max Info control), before the
**You** badge when present. The crown SHALL use `copy.winner` as its
accessible name; the list supplies no name of its own.

**Equal-max tip** - When `row.samePricePriority` is true and
`copy.samePricePriorityTip` is supplied, the list SHALL show an Info control
whose tooltip content is that tip, with the icon inheriting the amount text
tone. The tip SHALL state that when maximums match, the earlier one
leads.

**Bid card copy** - `ListingAuctionBidCard` `bidHistory` copy MAY include
`winner` and `samePricePriorityTip` and SHALL thread them to
`ListingBidHistoryList`.

#### Scenario: shared-ui-auction-listing-SC-50 - Closed sold Recent bids show a winner crown
**Serves:** Public bid history outcome - closed sold Recent bids show a winner crown

- **GIVEN** a closed sold bid card whose leading public history row has
  `isWinner` true, and winner copy `Winner` supplied
- **WHEN** the Recent bids list renders
- **THEN** that row shows a primary crown after the amount with accessible
  name Winner
- **AND** no live bid card history row shows a winner crown without
  `isWinner`

#### Scenario: shared-ui-auction-listing-SC-51 - Equal-max non-leader shows earlier-leads tip
**Serves:** Public bid history outcome - equal-max non-leader shows earlier-leads tip

- **GIVEN** a bid card history row with `samePricePriority` true and
  equal-max tip copy supplied
- **WHEN** the collector activates the Info control on that row
- **THEN** the tooltip states that when maximums match, the earlier one
  leads
