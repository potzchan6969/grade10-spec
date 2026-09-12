## Feature set

- Lot personal bidding
  - Maximum history: accepted configure and raise caps the owner re-reads on the lot
  - Bid sequence: automatic bids Grade10 placed for the owner on that lot
  - Account labels: maximum set, raised, and refused wording matches the lot
- Privacy boundary
  - Owner only: lot lists never expose a rival maximum or identity
  - Public recent bids: unchanged public price movements and listing pseudonyms

## ADDED Requirements

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
and automatic bids for that owner. A refused maximum attempt SHALL remain on
the account combined chronology only and SHALL NOT appear in the lot dialog.
Reading either lot list SHALL NOT place a bid or change any auction fact.
Neither lot list SHALL expose another account's maximum, identity, or payment
facts. Anonymous and rival reads of the listing SHALL continue to see only the
existing public recent-bids contract.

Amounts SHALL be integer counts of minor units paired with an ISO 4217 currency
code.

#### Scenario: grade10-site-auction-bidding-history-SC-42 - Collector opens maximum history on the lot

- **GIVEN** a signed-in collector with an accepted automatic maximum on a listing
  and no automatic bid placed for them yet
- **WHEN** they open the lot personal bidding dialog
- **THEN** the default tab is **Bid placed** and shows that no bids have been
  placed for them yet
- **AND** **Your maximums** lists that accepted maximum amount and time
- **AND** the tab order is **Bid placed**, then **Your maximums**
- **AND** the dialog shows no sticky current-maximum summary

#### Scenario: grade10-site-auction-bidding-history-SC-43 - Bid placed remains the default when bids exist

- **GIVEN** a signed-in collector with at least one automatic bid Grade10 placed
  for them on a listing and at least one accepted maximum on that listing
- **WHEN** they open the lot personal bidding dialog
- **THEN** the default tab is **Bid placed**
- **AND** **Your maximums** still lists every accepted configure or raise for
  that owner on that listing, newest first

#### Scenario: grade10-site-auction-bidding-history-SC-44 - Raised maximums appear on the lot without refusals

- **GIVEN** a signed-in collector who configured a maximum, later raised it, and
  also has a retained refused maximum attempt on the same listing
- **WHEN** they open the lot personal bidding dialog
- **THEN** **Your maximums** lists only the accepted configure and raise amounts
  with times, newest first
- **AND** the refused attempt is absent from both lot lists
- **AND** the refused attempt remains readable in that listing's account
  combined chronology at `/bids`

#### Scenario: grade10-site-auction-bidding-history-SC-45 - Lot personal bidding stays private and inert

- **GIVEN** a signed-in collector viewing a listing where a rival also has a
  private maximum
- **WHEN** the collector opens the lot personal bidding dialog
- **THEN** neither list shows the rival's maximum, identity, or payment facts
- **AND** the public recent-bids list on the lot is unchanged
- **AND** no bid, maximum, hold, listing standing, or auction close changes

### Requirement: Account bidding chronology labels maximum events as maximums

On the Grade10 `/bids` combined listing chronology, Grade10 SHALL present
private automatic maximum configuration, raise, and refusal events with
collector-facing labels that name them as a maximum set, a maximum raised, or a
maximum refused. The page SHALL NOT add a new tab, filter, or maximums-only
route for this distinction. ZZZ SHALL NOT gain a screen from this requirement.

#### Scenario: grade10-site-auction-bidding-history-SC-46 - Account chronology names maximum set, raise, and refusal

- **GIVEN** a signed-in collector whose listing chronology includes an accepted
  automatic maximum configuration, a later accepted raise, and a retained
  refused maximum attempt
- **WHEN** they expand that listing on `/bids`
- **THEN** those events read as a maximum set, a maximum raised, and a maximum
  refused
- **AND** no new account tab or maximums-only route is offered
