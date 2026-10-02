# grade10-admin/auction/listing Specification

## Feature set

- Draft save
  - Incomplete listing: an authorized operator saves without filling every field
  - First save mints a unit: the first draft creates an auctionable unit with no other live listing
- Create and catalogue
  - Required fields at create: title, slug, starting price, window, and media are checked on the form and the API
  - Slug as public key: collectors open a listing by slug; collisions and reuse follow the listing's state
  - Catalogue fields: an operator may write copy and taxonomy before publish
- Prices and window
  - Writable before publish: starting price, close, extension duration, and cap can change until the listing is live
  - Starting price of 0: a draft and create accept 0 in USD, HKD and JPY; a negative, non-whole or empty price is refused, and empty is never stored as 0
- Publish
  - Now or scheduled: a created listing publishes immediately or at a set time
- Call off
  - Before close: an operator withdraws a listing that has not closed
  - Closed is frozen: a closed listing cannot be rewritten here
- Gallery
  - One to eight uploads: images or videos, stored as uploaded, ordered, first item as the catalogue card
  - Combined sources: selected product assets and listing-only uploads form one ordered gallery
  - Saved snapshot: a selected product asset becomes listing media on Save, unaffected by later product-media edits, reordering, or deletion
- Independent create
  - Listings create: an authorized operator starts a listing from the
    Listings section with no campaign selected
  - Empty campaign through lifecycle: draft, create, and publish all succeed
    with no campaign; public slug lookup returns the listing
  - Listings table unattached label: a row with no campaign shows "-"
- Test fixture standalone seed
  - Listings tab: a developer selects fixture ids and seeds them with no
    campaign, product reserved, media attached
  - Drop standalone fixtures: a developer removes standalone fixture listings
    and releases their inventory holds from the same tab
- Inventory unit
  - Explicit choice: product selection is paired with a Cert ID or `No Cert ID`
  - Unit hold: a selected Cert ID is held as one physical unit
- Listing lifecycle
  - Draft save: validates and preserves the selected unit
  - Create: requires the saved unit choice and matching inventory hold
- Product display
  - Selected identity: public fields resolve through Inventory
  - Unnumbered stock: `No Cert ID` displays no certificate row
- Listings Stats
  - Watchers in Stats: opening Stats shows how many collectors watch the lot, so an operator judges interest beside the bidder count
  - No table column: the Listings table does not show the watch count
- Unsold close
  - Stock released: a listing that closes with no winner releases its inventory hold at the close, with no operator step
  - Released note: an Unsold listing says its stock was released, and when
  - Relist: an Unsold listing's row in the Listings table opens a new draft with the same product, quantity and catalogue copy, once its stock is released, outside a campaign and once per listing
  - Earlier holds freed: holds left by earlier Unsold closes are released once

## MODIFIED Requirements

### Requirement: Operator saves a listing as a draft

An authorized operator SHALL save an Auction listing as a draft without every
required field. A draft save SHALL NOT require title, slug, starting price,
currency, starts at, scheduled close at, or media. A supplied currency SHALL
be USD, HKD, or JPY; Grade10 SHALL refuse another currency and leave the draft
unchanged.

The draft form and write contract SHALL NOT offer or accept a listing-level
minimum increment.

<!-- trace:scenario id=g10adm.auction-listing.SC-xue rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-01 - Operator saves an empty draft
**Serves:** grade10-admin-auction-listing-US-01 - Operator saves an unfinished listing and comes back to it

- **GIVEN** an authorized operator on the auction listings section
- **WHEN** they save a listing with no title, prices, or window
- **THEN** Grade10 persists a draft that is absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-vnl rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-02 - Operator saves a partial draft
**Serves:** grade10-admin-auction-listing-US-01 - Operator saves an unfinished listing and comes back to it

- **GIVEN** an authorized operator
- **WHEN** they save a draft with a title and no starting price
- **THEN** Grade10 persists the title and leaves the listing a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-r6p rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-03 - Draft rejects a malformed price
**Serves:** grade10-admin-auction-listing-US-01 - Operator saves an unfinished listing and comes back to it

- **GIVEN** a draft listing
- **WHEN** an operator sets its starting price to a negative or non-integer amount
- **THEN** Grade10 refuses the write and leaves the starting price unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-2pj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-04 - Draft rejects a malformed slug
**Serves:** grade10-admin-auction-listing-US-01 - Operator saves an unfinished listing and comes back to it

- **GIVEN** a draft listing
- **WHEN** an operator sets its slug to `Charizard PSA 9`
- **THEN** Grade10 refuses the write and leaves the slug unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-bso rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-05 - Unauthorized draft save is refused
**Serves:** grade10-admin-auction-listing-US-01 - Operator saves an unfinished listing and comes back to it

- **GIVEN** a signed-in operator without auction price-and-window permission
- **WHEN** they save a draft
- **THEN** Grade10 refuses and persists no listing

<!-- trace:scenario id=g10adm.auction-listing.SC-2ij rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-56 - Draft rejects an unsupported currency
**Serves:** Draft save - draft rejects an unsupported currency

- **GIVEN** a draft listing
- **WHEN** an operator sets its currency to EUR
- **THEN** Grade10 refuses the write
- **AND** the currency is unchanged

#### Scenario: grade10-admin-auction-listing-SC-124 - Draft saves a starting price of 0
**Serves:** grade10-admin-auction-listing-US-01 - Operator prices an unfinished no-reserve lot at nothing

- **GIVEN** a draft listing in `USD`
- **WHEN** an operator sets its starting price to 0 minor units
- **THEN** Grade10 stores a starting price of 0 minor units `USD`
- **AND** the draft reads back 0, not an empty price
- **AND** the listing remains a draft

### Requirement: Prices and window are writable before publish

While a listing is `draft` or `created`, an authorized operator SHALL be able
to set:

- **Currency** — an operator chooses an ISO 4217 three-letter code from the
  platform's supported currency list. Omitted at create SHALL store Grade10's
  store currency (`HKD`).
- **Starting price** — integer minor units, 0 or greater, when set. 0 is a
  set starting price and satisfies create; it is not an empty one. Empty is
  allowed only while `draft`.
- **Minimum increment** — integer minor units greater than zero when set.
  Empty is allowed only while `draft`.
- The form SHALL show each entered minor-unit price as a separately formatted
  decimal amount in the selected currency, so an operator can verify its
  decimal placement before saving.
- **Starts at** — the scheduled bidding open. Empty is allowed only while
  `draft`.
- **Scheduled close at** — the published close. Empty is allowed only while
  `draft`. When both starts at and scheduled close at are set, scheduled
  close at MUST be after starts at. At create, scheduled close at MUST also
  be after now.
- **Extension duration (seconds)** — how long extended bidding runs after the
  scheduled close, and after each bid during it, per
  `grade10-site/auction/auction`. A whole number ≥ 0. Zero turns extended
  bidding off. Empty on draft is allowed. Omitted at create SHALL store
  `1800`.
- **Extension cap (seconds)** — optional whole number ≥ 0, or absent for an
  uncapped listing. The close MUST NOT move past scheduled close at plus
  this cap. A cap below the extension duration is a hard final deadline,
  not an error.

A listing SHALL carry no extension window, and this form SHALL NOT offer one.

Scenario `grade10-admin-auction-listing-SC-27` keeps its title with its id. The
title is historical: any extension window is now refused, with or without a
duration.

A write of any of these fields on a `published`, `closed`, `settled`, or
`canceled` listing SHALL be refused. The effective close is not an operator
field: extended bidding writes it, and this form SHALL NOT accept it.

**Sandbox** SHALL be writable only while `draft`. A sandbox listing runs on
test-mode payment credentials instead of live money, so the house can
rehearse a sale. A write of sandbox on a `created` or later listing SHALL
be refused.

<!-- trace:scenario id=g10adm.auction-listing.SC-rj8 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-24 - Operator corrects a created listing's starting price
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing with starting price 100000 minor units `HKD`
- **WHEN** an authorized operator sets starting price to 150000 minor units
- **THEN** Grade10 stores 150000 minor units `HKD`
- **AND** the listing remains created

<!-- trace:scenario id=g10adm.auction-listing.SC-o1z rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-25 - Published listing refuses a price change
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing with starting price 100000 minor units
- **WHEN** an operator sets starting price to 150000 minor units
- **THEN** Grade10 refuses the write
- **AND** the starting price remains 100000 minor units

<!-- trace:scenario id=g10adm.auction-listing.SC-yly rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-26 - Scheduled close at in the past is refused at create
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft listing whose scheduled close at is not after now
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-zr3 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-27 - Extension window without a duration is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing
- **WHEN** an operator submits an extension window of 1800 seconds
- **THEN** Grade10 refuses the write
- **AND** the listing's extension settings are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-bvf rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-27a - Omitted extension fields default to 30 minutes
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft listing with every required field set and no extension
  duration supplied
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 stores an extension duration of 1800 seconds

<!-- trace:scenario id=g10adm.auction-listing.SC-ynn rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-28 - Sandbox cannot change after create
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing that was drafted as sandbox
- **WHEN** an operator clears sandbox
- **THEN** Grade10 refuses the write
- **AND** the listing remains sandbox

<!-- trace:scenario id=g10adm.auction-listing.SC-8on rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-70 - A negative extension duration is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing
- **WHEN** an operator sets an extension duration of -60 seconds
- **THEN** Grade10 refuses the write
- **AND** the listing's extension settings are unchanged

#### Scenario: grade10-admin-auction-listing-SC-125 - Create accepts a starting price of 0
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a no-reserve lot that opens at nothing

- **GIVEN** three drafts complete except for price, in `USD`, `HKD`, and `JPY`
- **WHEN** an authorized operator sets each starting price to 0 minor units and creates each listing
- **THEN** the form and the API accept each create
- **AND** each listing is created with a starting price of 0 minor units in its currency

#### Scenario: grade10-admin-auction-listing-SC-125a - Create with 0 and no currency stores HKD 0
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft complete except for price, with no currency chosen
- **WHEN** a create is sent to the API with a starting price of 0 minor units
- **THEN** the listing is created with a starting price of 0 minor units `HKD`

#### Scenario: grade10-admin-auction-listing-SC-126 - Create refuses a negative starting price on the API
**Serves:** grade10-admin-auction-listing-US-03 - A script cannot create what the form refuses

- **GIVEN** a draft complete except for price, in `HKD`
- **WHEN** a create is sent straight to the API with a starting price of -1 minor unit
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-127 - An empty starting price is not stored as 0 at create
**Serves:** grade10-admin-auction-listing-US-03 - An operator who forgot the price cannot create a free lot

- **GIVEN** a draft complete except for price, in `USD`
- **WHEN** a create is sent to the API with the starting price absent, null, or an empty string
- **THEN** Grade10 refuses the create
- **AND** the draft's starting price stays empty, not 0

#### Scenario: grade10-admin-auction-listing-SC-128 - Operator lowers a created listing's starting price to 0
**Serves:** grade10-admin-auction-listing-US-03 - Operator turns a priced lot into a no-reserve one before it goes live

- **GIVEN** a created listing with a starting price of 1000000 minor units `JPY`
- **WHEN** an authorized operator sets its starting price to 0 minor units
- **THEN** Grade10 stores 0 minor units `JPY`
- **AND** the listing remains created

#### Scenario: grade10-admin-auction-listing-SC-129 - A listing starting at 0 publishes
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a no-reserve lot in front of collectors

- **GIVEN** a created listing with a starting price of 0 minor units `USD`
- **WHEN** an authorized operator publishes it now
- **THEN** the listing is published
- **AND** its slug opens the public listing
