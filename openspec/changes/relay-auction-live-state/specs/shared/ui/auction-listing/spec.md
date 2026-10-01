## Feature set

- Surface exports
  - Named components: gallery, bid panel, and details from the package entry
  - Reusable parts: the gallery renders without the bid panel
- Gallery sources
  - Distinct addresses: thumbnail, main frame, and zoom each have their own source
  - Fallback to src: an omitted thumb or zoom uses the main source
- Gallery strip
  - Several items: more than one image shows a strip; one item does not
- Consumer labels
  - Supplied copy: accessible names come from the application
- Bid history
  - Accepted instants: bid rows retain the accepted time needed for formatting
  - Localized activity: recent and historical rows use the collector's locale and stated time zone
- Personal bid history
  - Named export: ListingUserBidHistory and its copy, props, and row types
  - Empty rows: the block renders nothing
  - Dialog: two peer tabs for bid-sequence and maximum rows, amount and time only, no bid-type column
  - Consumer composition: the bid card keeps the personal-bidding accessory beside recent bids
  - Supplied copy: the personal-bidding link, title, tabs, columns, and empty state come from the consumer
- Personal bidding dialog
  - Maximums tab: accepted configure and raise rows with amount and time
  - Bids tab: auto-bid sequence rows with amount and time
  - Consumer composition: the bid card keeps the personal-bidding accessory beside recent bids
  - Supplied copy: every user-visible string arrives through props
- Bid enrollment
  - Named exports: the enrollment setup blocks and the signal the bid card reads
  - Setup gates: continuing waits on a card and an attestation, and says which is missing
  - Enrollment signal: the bid card shows standing, or disables what a collector cannot yet do
- Bid card accessory
  - Optional recentBidsAccessory: trailing edge of the recent-bids header
- Buyer-fee disclosure
  - Inline rate: the bid panel names the 20% buyer fee under the bid action
  - No tooltip: the fee copy does not carry a buyer-fee tooltip slot
- Quick bids
  - Increment steps: three chips at 1×, 2×, and 4× the listing increment
  - Leader base: chips add those steps to the committed maximum
  - Field base: chips add those steps to the current public bid
  - Opening base: before any bid, chip 1x is the opening price, the next eligible bid
- Raise floor
  - Leader minimum: a typed raise starts at the maximum plus 100 minor units
  - Separate from chips: the first chip is not that typed minimum
- Lost standing
  - Badge only: Did not win remains; no authorization-release banner

## MODIFIED Requirements

### Requirement: Quick-bid chips step the listing increment

`ListingAuctionBidCard` SHALL offer three quick-bid amounts: 1×, 2×, and 4×
the listing increment supplied on the view.

When the viewer leads with a committed maximum, those amounts SHALL be that
maximum plus those multiples. When the viewer does not lead, they SHALL be
the current bid plus those multiples, except that before any bid the 1×
amount SHALL be the view's minimum bid, the opening price itself; the 2× and
4× amounts still add their multiples to the current bid on the view.

The first chip SHALL NOT be replaced by the typed raise floor.

<!-- trace:scenario id=g10.shared-auction-listing.SC-7o5 rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-35 - A leader's chips step from the committed max
**Serves:** Quick bids - a leader's chips step from the committed max

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer leads with a maximum of
  200000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 204000, 208000, and 216000 HKD minor units

<!-- trace:scenario id=g10.shared-auction-listing.SC-t9f rev=1 -->
#### Scenario: shared-ui-auction-listing-SC-36 - A collector who does not lead steps from the current bid
**Serves:** Quick bids - a collector who does not lead steps from the current bid

- **GIVEN** an HKD listing whose current bid is 120000 minor units, whose
  increment is 4000 minor units, and whose viewer has a maximum of 116000
  minor units and does not lead
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 124000, 128000, and 136000 HKD minor units

#### Scenario: shared-ui-auction-listing-SC-52 - Before any bid chip 1x is the opening price
**Serves:** Quick bids - a collector meets the chips on a lot nobody has bid on

- **GIVEN** an HKD listing with no accepted bid, whose view carries an
  opening price of 48000 minor units as both its minimum bid and its current
  bid, and an increment of 2000 minor units
- **WHEN** the bid card renders quick-bid chips
- **THEN** the three amounts are 48000, 52000, and 56000 HKD minor units
- **AND** the 48000 chip is captioned as the next eligible bid
