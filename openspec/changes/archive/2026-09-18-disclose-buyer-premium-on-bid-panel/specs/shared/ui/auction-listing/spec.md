## Purpose

Shared auction listing blocks disclose the buyer's premium on the bid panel
before a collector commits a maximum. They are the shared listing product-page
blocks every auction storefront composes: the media gallery, the bid panel,
the bid history, and the details section. The bid history carries accepted
instants so collector activity can be localized without changing the listing's
authoritative event data.

## Feature set

- Buyer-fee disclosure
  - Inline rate: always-on secondary copy under the bid action names the 20%
    buyer fee on top of the winning bid
  - No tooltip: the bid card copy type does not carry a buyer-fee tooltip slot

## ADDED Requirements

### Requirement: Bid card discloses the buyer fee inline

The bid card names the buyer fee under the bid action, in plain sight, to a
signed-in collector.

**Inline rate** - `ListingAuctionBidCard` SHALL render always-on secondary copy
under the primary bid action that states a 20% buyer fee is added on top of
the winning bid.

**Consumer copy** - The string SHALL come from consumer copy (`buyerFeeHint`).

**No tooltip** - The copy type SHALL NOT include a `buyerFeeTooltip` field, and
the card SHALL NOT gate that rate behind an info tooltip.

**Signed out** - When `bidEnrollment` is `signed-out`, the fee line SHALL be
omitted with the bid action.

#### Scenario: shared-ui-auction-listing-SC-44 - Buyer fee shows inline at 20%
**Serves:** Buyer-fee disclosure - the buyer fee shows inline at 20%

- **GIVEN** a signed-in collector on an open listing bid card
- **WHEN** the bid panel footer renders
- **THEN** secondary copy under the bid action states that a 20% buyer fee is
  added on top of the winning bid
- **AND** no buyer-fee info tooltip is present

#### Scenario: shared-ui-auction-listing-SC-45 - Signed-out panel omits the fee line
**Serves:** Buyer-fee disclosure - a signed-out panel omits the fee line

- **GIVEN** a bid card with `bidEnrollment` `signed-out`
- **WHEN** it renders
- **THEN** the buyer-fee line is absent
