## MODIFIED Requirements

### Requirement: Extension explanation copy reflects the listing policy

`ListingAuctionBidCard` and `ListingAuctionCardSidebar` SHALL receive extension
explanation copy from the consumer. They SHALL NOT hardcode extension duration
minutes.

When extension is armed on a listing, the consumer SHALL supply copy for the
Time left explanation and any extended-bidding row that names that listing's
**extension duration** (and optional extension cap). The copy SHALL NOT name an
extension window. The shared components SHALL render the supplied strings as
given.

When the listing is in extended bidding, consumer copy for the Time left label
SHALL be **Time left (extended)** (or the locale equivalent).

#### Scenario: shared-ui-auction-listing-SC-14 - Extension copy comes from the consumer

- **GIVEN** a live listing whose extension duration is 1800 seconds
- **WHEN** an application renders the bid card with copy naming a 30-minute
  post-close timer restart and no extension window
- **THEN** the Time left explanation shows that duration-only wording
- **AND** no hardcoded "30 minutes" window, and no extension-window minutes,
  appear in that slot

#### Scenario: shared-ui-auction-listing-SC-14a - Extended label while in extended bidding

- **GIVEN** a live listing in extended bidding
- **WHEN** an application renders the bid card with `extended` on and the
  Time left label copy **Time left (extended)**
- **THEN** that label is visible beside the countdown
