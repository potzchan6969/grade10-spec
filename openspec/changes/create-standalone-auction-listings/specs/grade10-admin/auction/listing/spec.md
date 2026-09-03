# grade10-admin/auction/listing Delta

## Feature set

- Independent create
  - Listings create: an authorized operator starts a listing from the
    Listings section with no campaign selected
  - Empty campaign through lifecycle: draft, create, and publish all succeed
    with no campaign; public slug lookup returns the listing
  - Listings table unattached label: a row with no campaign shows it stands
    on its own
- Test fixture standalone seed
  - Listings tab: a developer selects fixture ids and seeds them with no
    campaign, product reserved, media attached
  - Drop standalone fixtures: a developer removes standalone fixture listings
    and releases their inventory holds from the same tab

## ADDED Requirements

### Requirement: Listings section creates an independent listing

An authorized operator SHALL start a new Auction listing from the Grade10
auction **Listings** section. The Listings section SHALL expose a **Create
listing** action for an operator who holds the `auction:operate` grant.

Activating Create listing SHALL open the listing editor with **no Campaign**
selected. The operator SHALL NOT be required to choose a campaign before
saving a draft, creating, or publishing. Campaign attachment remains optional.

A listing saved, created, or published with no campaign SHALL persist with
`campaign_id` null. A collector SHALL open that listing by its slug on the
public catalogue. The Listings table SHALL show that such a row stands on its
own when it has no campaign.

An operator without the `auction:operate` grant SHALL NOT be offered Create
listing. A draft save sent without that grant SHALL be refused.

#### Scenario: grade10-admin-auction-listing-SC-68 - Create listing is offered on the Listings section

- **GIVEN** an authorized operator on the Grade10 auction Listings section
- **WHEN** they read the section heading row
- **THEN** a Create listing action is present

#### Scenario: grade10-admin-auction-listing-SC-69 - Listing editor opens with no campaign selected

- **GIVEN** an authorized operator who activates Create listing on the
  Listings section
- **WHEN** the listing editor opens
- **THEN** the Campaign control has no campaign selected

#### Scenario: grade10-admin-auction-listing-SC-58 - Draft saves with the campaign left empty

- **GIVEN** a new listing opened from the Listings section with no campaign
- **WHEN** an authorized operator saves a draft with a title and no campaign
- **THEN** Grade10 persists a draft listing with no campaign
- **AND** the listing is absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-59 - Listing creates with no campaign

- **GIVEN** a draft listing with every required create field set and no campaign
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no campaign
- **AND** it is still absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-60 - Listing publishes with no campaign

- **GIVEN** a created listing with no campaign and no publish at
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** the listing still has no campaign

#### Scenario: grade10-admin-auction-listing-SC-61 - Collector opens the published listing by slug

- **GIVEN** a published listing with no campaign whose slug is
  `standalone-lot-1`
- **WHEN** a collector opens `/auction/listings/standalone-lot-1`
- **THEN** Grade10 returns that listing

#### Scenario: grade10-admin-auction-listing-SC-62 - Listings table shows an unattached listing

- **GIVEN** a listing with no campaign
- **WHEN** an authorized operator reads the Listings section table
- **THEN** that row's campaign column shows the listing stands on its own
- **AND** it does not display a campaign id as a label

#### Scenario: grade10-admin-auction-listing-SC-63 - Create listing is not offered to an unauthorized operator

- **GIVEN** a signed-in operator without the `auction:operate` grant
- **WHEN** they read the Grade10 auction Listings section
- **THEN** Create listing is not offered
- **AND** a draft save sent for a new listing is refused

### Requirement: Test panel seeds and drops standalone fixture listings

The Grade10 auction **Test** panel (visible only when `LOCAL_FIXTURES_ENABLED`
is true) SHALL expose a **Listings** tab beside the existing **Campaign** tab.

The Listings tab SHALL let a developer select one or more fixture ids from the
same list used by the Campaign tab, then seed those fixtures as standalone
listings with no campaign. Each seeded listing SHALL receive:

- An inventory product with reserved stock (quantity 1), via the same
  inventory seed path the Campaign tab uses.
- A media item attached, via the same upload path.
- `campaign_id` null — no campaign is created or attached.

The tab SHALL show how many instances of each fixture have been seeded. A
**Drop listings** control SHALL let the developer select a standalone fixture
listing from the existing ones and remove it along with any hold on its
inventory product. The drop removes only listings whose slug matches the
standalone fixture slug pattern and whose `campaign_id` is null.

This surface and its backend procedures SHALL NOT be reachable outside a
locally enabled dev environment (`assertDevEndpointsAllowed`).

#### Scenario: grade10-admin-auction-listing-SC-64 - Listings tab is present in the Test panel

- **GIVEN** the Grade10 auction Test panel with `LOCAL_FIXTURES_ENABLED` true
- **WHEN** a developer opens the Test panel
- **THEN** a Listings tab is present beside the Campaign tab

#### Scenario: grade10-admin-auction-listing-SC-65 - Developer seeds fixture listings with no campaign

- **GIVEN** the Listings tab in the Test panel
- **WHEN** a developer selects one or more fixture ids and clicks Add listings
- **THEN** Grade10 creates each selected fixture as a listing with no campaign
- **AND** each listing has a reserved inventory product and a media item
- **AND** the instance counts on the tab update

#### Scenario: grade10-admin-auction-listing-SC-66 - Seeded standalone listings appear in the Listings section with no campaign

- **GIVEN** a fixture listing seeded from the Test panel Listings tab
- **WHEN** an authorized operator reads the Listings section
- **THEN** that listing appears in the table
- **AND** its campaign column shows it stands on its own

#### Scenario: grade10-admin-auction-listing-SC-67 - Developer drops standalone fixture listings

- **GIVEN** one or more standalone fixture listings seeded from the Listings tab
- **WHEN** a developer selects one and clicks Drop listing
- **THEN** Grade10 removes that listing and releases its inventory hold
- **AND** the listing no longer appears in the Listings section
