# grade10-admin/auction/listing Specification

## Purpose

Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos from product assets or direct uploads, frozen when saved,
call one off while it has not closed, and get a lot's stock back, with a
one-step Relist, when its listing closes with no winner. Named image sizes and
optional alt live in `grade10-site/auction/listing-media`.

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

## Requirements

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

### Requirement: Create validates required fields on the form and the API

Create SHALL require a title, slug, starting price, starts at, scheduled close
at, media, and one supported currency. When omitted, currency SHALL default to
HKD. The form and API SHALL reject an unsupported currency independently.

The form SHALL present USD, HKD, and JPY as its only currency choices and
SHALL NOT display a minimum-increment field. The selected currency's Grade10
schedule governs the listing's bid floor.

<!-- trace:scenario id=g10adm.auction-listing.SC-mmr rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-06 - Operator creates a filled draft
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a complete draft with currency JPY and no minimum-increment value
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 creates it
- **AND** its bid floor uses the JPY schedule

<!-- trace:scenario id=g10adm.auction-listing.SC-jr4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-07 - Create without a title is refused on the form and the API
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with every required field except title
- **WHEN** the operator creates it
- **THEN** the form and API refuse it and the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-9v7 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-08 - Create without a slug is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with every required field except slug
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-gm3 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-09 - Create without a starting price is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with every required field except starting price
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-neb rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-10 - Create without media is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with every required field except media
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-jne rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-11 - Created listing cannot clear a required field
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing with a title
- **WHEN** an operator clears the title
- **THEN** Grade10 refuses and leaves the title unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-86p rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-12 - Create of a published listing is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a published listing
- **WHEN** an operator creates it
- **THEN** Grade10 refuses and leaves it published

<!-- trace:scenario id=g10adm.auction-listing.SC-dal rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-57 - Create refuses an unsupported currency on the form and API
**Serves:** Create and catalogue - create refuses an unsupported currency on the form and API

- **GIVEN** a complete draft with currency EUR
- **WHEN** an operator creates the listing
- **THEN** the form prevents the request and names currency
- **AND** an API create with EUR is refused
- **AND** the listing remains a draft

### Requirement: Catalogue fields an operator may write

While a listing is `draft`, `created`, or `published`, an authorized operator
SHALL be able to set these catalogue fields. Each write SHALL replace the
stored value; an omitted field on an update SHALL leave the stored value
unchanged.

- **Title** — required at create; trimmed, 1 to 200 characters when set. Empty
  is allowed only while `draft`.
- **Copy** — optional, at most 4000 characters, empty allowed.
- **Sort index** — optional whole number ≥ 0. Empty on draft SHALL store
  nothing until create, which stores `0` when omitted.
- **Sale** — optional. Omit or clear for a listing sold on its own. A listing
  SHALL join only a sale that is `draft` or `published`. A canceled sale
  SHALL be refused.
- **Categories** — optional set of existing categories. At most one category
  per taxonomy. An update that names categories SHALL replace the listing's
  whole set, including to empty.

An operator who may catalogue a listing and not operate its window SHALL
still be able to write these fields on an existing editable listing.

<!-- trace:scenario id=g10adm.auction-listing.SC-30a rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-13 - Operator updates copy on a published listing
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing titled "Charizard 1st Edition"
- **WHEN** an authorized operator changes its copy to a new description
- **THEN** Grade10 stores the new copy
- **AND** a collector reading the listing sees the new copy
- **AND** the title, prices, and window are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-9fl rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-14 - Two categories from one taxonomy are refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a taxonomy with categories Pokémon and Sport
- **WHEN** an operator assigns both to the same listing
- **THEN** Grade10 refuses the write
- **AND** the listing's categories are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-23q rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-15 - Canceled sale cannot receive a listing
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a canceled sale
- **WHEN** an operator attaches a draft listing to it
- **THEN** Grade10 refuses the write
- **AND** the listing's sale is unchanged

### Requirement: Slug is the listing's public lookup key

An authorized operator SHALL set a **Slug** that is the lookup key of the
listing's public address `/auction/listings/<slug>`.

- Trimmed, 1 to 64 characters, lower-case words joined by hyphens
  (`charizard-psa-9`). Empty is allowed only while `draft`. A slug that is
  present and does not match that shape SHALL be refused. The 1-to-64 length
  bound applies to a slug an operator writes.
- A slug SHALL be unique among listings that currently hold that value. No
  two listings SHALL share a slug. A draft with no slug does not occupy one.
  Setting or creating a slug that another listing already holds SHALL be
  refused, including when the other listing is `closed` or `settled`. A
  listing rewriting its own slug to the same value is not a collision. A
  `canceled` listing SHALL NOT keep the slug it held before cancel: that
  original value is free for another listing.
- Slug SHALL be writable while `draft` or `created`. A write of slug on a
  `published`, `closed`, `settled`, or `canceled` listing SHALL be refused,
  except the rewrite Grade10 applies when the listing is canceled.
- A collector SHALL receive a `published`, `closed`, or `settled` listing by
  opening `/auction/listings/<slug>`. A slug that names no such listing
  SHALL be not found. A `draft`, `created`, or `canceled` listing SHALL NOT
  answer at that address.

<!-- trace:scenario id=g10adm.auction-listing.SC-9oe rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-16 - Collector opens a listing by slug
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing whose slug is `charizard-psa-9`
- **WHEN** a collector opens `/auction/listings/charizard-psa-9`
- **THEN** Grade10 returns that listing

<!-- trace:scenario id=g10adm.auction-listing.SC-4f0 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-17 - Unknown slug is not found
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** no published, closed, or settled listing with slug `no-such-lot`
- **WHEN** a collector opens `/auction/listings/no-such-lot`
- **THEN** Grade10 answers as not found

<!-- trace:scenario id=g10adm.auction-listing.SC-ng3 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-18 - Duplicate slug is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a listing that is not canceled whose slug is `charizard-psa-9`
- **WHEN** an operator sets another listing's slug to `charizard-psa-9`
- **THEN** Grade10 refuses the write
- **AND** the second listing's slug is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-g0h rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-19 - Two drafts cannot share a slug
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft whose slug is `charizard-psa-9`
- **WHEN** an operator sets another draft's slug to `charizard-psa-9`
- **THEN** Grade10 refuses the write
- **AND** the second draft's slug is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-hp2 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-20 - Empty slugs on drafts are not a collision
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft with no slug
- **WHEN** an operator saves another draft with no slug
- **THEN** Grade10 accepts the save
- **AND** neither draft occupies a slug

<!-- trace:scenario id=g10adm.auction-listing.SC-jx5 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-21 - Create can reuse a canceled listing's original slug
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a canceled listing that previously used slug `charizard-psa-9`
- **AND** a draft with every required field set, including slug
  `charizard-psa-9`
- **WHEN** the operator creates the draft
- **THEN** Grade10 moves the draft to `created`
- **AND** the canceled listing still does not hold `charizard-psa-9`

<!-- trace:scenario id=g10adm.auction-listing.SC-4kw rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-22 - Create cannot reuse a closed listing's slug
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a closed listing whose slug is `charizard-psa-9`
- **AND** a draft with every required field set, including slug
  `charizard-psa-9`
- **WHEN** the operator creates the draft
- **THEN** Grade10 refuses the create
- **AND** the draft remains a draft
- **AND** `/auction/listings/charizard-psa-9` still returns the closed listing

<!-- trace:scenario id=g10adm.auction-listing.SC-2d5 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-23 - Published slug cannot change
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing whose slug is `charizard-psa-9`
- **WHEN** an operator sets slug to `charizard-psa-9-copy`
- **THEN** Grade10 refuses the write
- **AND** `/auction/listings/charizard-psa-9` still returns that listing

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

### Requirement: Publish happens now or at a scheduled time

An authorized operator SHALL publish a `created` listing. Publish SHALL move
it to `published` and SHALL make it visible on the public catalogue.

An authorized operator SHALL be able to set **Publish at**, an optional
timestamp that MUST be after now.

- While `draft` or `created`, publish at SHALL be writable when the value is
  after now, and SHALL be clearable. A write of publish at on a `published`
  or later listing SHALL be refused.
- A publish at that is not after now SHALL be refused on the admin form and
  on the API. Create SHALL refuse if publish at is set and not after now.
- When publish at is unset, the listing SHALL stay `created` until an
  operator publishes it.
- When publish at arrives and the listing is `created`, Grade10 SHALL
  publish it without a further operator action.
- A `draft` listing SHALL NOT be published, by hand or when publish at
  arrives. Publish of a listing that is not `created` SHALL be refused.

<!-- trace:scenario id=g10adm.auction-listing.SC-del rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-29 - Operator publishes a created listing immediately
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a created listing with no publish at
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** a collector can read it on the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-7xn rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-30 - Created listing publishes at the scheduled time
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a created listing whose publish at is in the future
- **WHEN** that time arrives
- **THEN** Grade10 moves it to `published`
- **AND** a collector can read it on the public catalogue
- **AND** no further operator action was required

<!-- trace:scenario id=g10adm.auction-listing.SC-kr8 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-31 - A publish at in the past is refused
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a created listing
- **WHEN** an operator sets publish at to a time that is not after now
- **THEN** Grade10 refuses the write
- **AND** the listing remains created and unpublished

<!-- trace:scenario id=g10adm.auction-listing.SC-cdt rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-32 - Create with a past publish at is refused
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a draft listing with every required field set and publish at in
  the past
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft
- **AND** it stays absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-yrj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-33 - Draft is not published when publish at arrives
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a draft listing with a publish at that has arrived and a missing
  title
- **WHEN** that time is reached
- **THEN** Grade10 does not publish the listing
- **AND** it remains a draft
- **AND** it stays absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-83t rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-34 - Manual publish of a draft is refused
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a draft listing
- **WHEN** an operator publishes it
- **THEN** Grade10 refuses the publish
- **AND** the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-usa rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-35 - Publish at cannot change after publish
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing
- **WHEN** an operator sets a new publish at
- **THEN** Grade10 refuses the write
- **AND** the listing remains published

### Requirement: Operator may call off a listing that has not closed

An operator authorized to call a listing off SHALL cancel a listing that is
`draft`, `created`, or `published`. Cancel SHALL move the listing to
`canceled` and SHALL release every live authorization standing against it.

Cancel SHALL be refused when the listing is `closed`, `settled`, or already
`canceled`. A closed or settled listing's outcome is absolute and SHALL NOT
be reopened by cancel. Cancel of a listing that does not exist SHALL be
refused.

Cancel of a `published` listing SHALL be allowed whether or not bidding has
opened and whether or not it has accepted bids. Cancel of a `created`
listing SHALL be allowed even when a publish at is still in the future;
Grade10 SHALL NOT later publish a listing that was canceled.

When the listing has a slug, cancel SHALL rewrite that slug in the same
step: the stored slug becomes the previous slug, then `-cancelled-`, then
the listing's id from the seventh character onward (after the first six
characters). That rewrite SHALL be stored even when the result is longer
than 64 characters. A listing with no slug SHALL stay without one. After
the rewrite, the previous slug SHALL be free for another listing, and the
canceled listing SHALL NOT answer at `/auction/listings/<previous slug>`.

The same rewrite SHALL apply when Grade10 cancels the listing because its
sale was canceled.

Cancel from an operator who is not authorized to call a listing off SHALL
be refused, and the listing and slug SHALL be unchanged.

<!-- trace:scenario id=g10adm.auction-listing.SC-pfl rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-36 - Operator calls off a draft
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a draft listing
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** it stays absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-2px rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-37 - Operator calls off a created listing before publish at
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a created listing with a publish at still in the future
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** when that publish at arrives, Grade10 does not publish it
- **AND** it stays absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-oc9 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-38 - Operator calls off a published listing that has bids
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing with accepted bids and live authorizations
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** it releases every live authorization standing against it
- **AND** it is absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-e1b rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-39 - Closed listing cannot be called off
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains closed

<!-- trace:scenario id=g10adm.auction-listing.SC-f4v rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-40 - Settled listing cannot be called off
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a settled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains settled

<!-- trace:scenario id=g10adm.auction-listing.SC-j48 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-41 - Already canceled listing cannot be called off again
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a canceled listing
- **WHEN** an operator calls it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains canceled

<!-- trace:scenario id=g10adm.auction-listing.SC-ysx rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-42 - Cancel rewrites the slug and frees the original
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing whose id is
  `auc_550e8400-e29b-41d4-a716-446655440000` and whose slug is
  `charizard-psa-9`
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 stores slug
  `charizard-psa-9-cancelled-0e8400-e29b-41d4-a716-446655440000`
- **AND** `/auction/listings/charizard-psa-9` does not return that listing
- **AND** a later listing may be created with slug `charizard-psa-9`

<!-- trace:scenario id=g10adm.auction-listing.SC-lj7 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-43 - Cancel of a draft with no slug does not invent one
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a draft listing with no slug
- **WHEN** an authorized operator calls it off
- **THEN** Grade10 moves it to `canceled`
- **AND** the listing still has no slug

<!-- trace:scenario id=g10adm.auction-listing.SC-tjj rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-44 - Unauthorized cancel is refused
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a published listing
- **AND** a signed-in operator who may not call a listing off
- **WHEN** they call it off
- **THEN** Grade10 refuses the cancel
- **AND** the listing remains published
- **AND** its slug is unchanged

### Requirement: A closed listing cannot be rewritten here

A listing in `closed`, `settled`, or `canceled` SHALL reject every catalogue,
price, window, sandbox, publish at, and media write from this form. Its facts
are the record of what was offered and sold.

<!-- trace:scenario id=g10adm.auction-listing.SC-ztg rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-45 - Closed listing rejects a title edit
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing
- **WHEN** an operator changes its title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

### Requirement: Listing media is an ordered gallery of one to eight uploads

While a listing is `draft`, `created`, or `published`, an authorized operator
SHALL be able to attach, replace, remove, and reorder direct uploads and
selected assets from the listing's product.

A listing SHALL hold at most eight media items across direct uploads and
selected product assets. A ninth item SHALL be refused and SHALL leave the
gallery unchanged. Direct uploads and selected product assets SHALL share one
operator-controlled display order.

A listing MAY select only assets from its selected product. A selected product
asset SHALL be available at Save time. If its latest source asset is absent at
Save time, Grade10 SHALL refuse the save.

On a successful Save, Grade10 SHALL snapshot every selected product asset into
the listing gallery. Later replacement, removal, reordering, or other changes
to the product gallery SHALL NOT alter the saved listing gallery.

A draft SHALL be allowed to have zero media. Create SHALL require at least one
media item. A `created` or `published` listing SHALL reject a remove that would
leave zero items.

Each direct upload is one file, either an image or a video. Accepted image
types are JPEG, PNG, WebP, and AVIF. Accepted video types are MP4, WebM, and
QuickTime. Any other type or an empty file SHALL be refused. Each direct upload
SHALL be at most 104857600 bytes; a larger file SHALL be refused.

The first item SHALL be the catalogue card a browse list shows. A collector
reading a published listing SHALL receive the gallery in its display order.

<!-- trace:scenario id=g10adm.auction-listing.SC-slk rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-46 - Operator uploads an eighth file
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing with seven media items
- **WHEN** the operator uploads an eighth JPEG
- **THEN** Grade10 stores eight media items in the operator's order

<!-- trace:scenario id=g10adm.auction-listing.SC-51l rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-47 - A ninth file is refused
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing with eight media items
- **WHEN** the operator uploads a ninth file
- **THEN** Grade10 refuses the upload
- **AND** the gallery still has eight items

<!-- trace:scenario id=g10adm.auction-listing.SC-md4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-48 - Mixed images and videos are accepted
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing with no media
- **WHEN** an operator uploads a JPEG, an MP4, and a WebP
- **THEN** Grade10 stores three media items in that order

<!-- trace:scenario id=g10adm.auction-listing.SC-v8v rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-49 - Upload is stored without processing
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing
- **WHEN** an operator uploads a JPEG
- **THEN** Grade10 stores and serves that same body and type as the item's original

<!-- trace:scenario id=g10adm.auction-listing.SC-qna rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-50 - Unsupported type is refused
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing
- **WHEN** an operator uploads an unsupported file
- **THEN** Grade10 refuses the upload

<!-- trace:scenario id=g10adm.auction-listing.SC-vg4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-51 - File over 100 mebibytes is refused
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a draft listing
- **WHEN** an operator uploads a file larger than 104857600 bytes
- **THEN** Grade10 refuses the upload

<!-- trace:scenario id=g10adm.auction-listing.SC-gj3 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-52 - First item is the catalogue card
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a listing in front of collectors

- **GIVEN** a published listing whose gallery starts with a video
- **WHEN** a collector opens the Auction catalogue
- **THEN** that listing's card uses the first gallery item

<!-- trace:scenario id=g10adm.auction-listing.SC-h2e rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-53 - Operator reorders and removes media
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a published listing with three images in order A, B, C
- **WHEN** an operator moves C first and removes B
- **THEN** the gallery is C, A

<!-- trace:scenario id=g10adm.auction-listing.SC-49k rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-54 - Last media item cannot be removed after create
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a published listing with one JPEG
- **WHEN** an operator removes that JPEG
- **THEN** Grade10 refuses the remove

<!-- trace:scenario id=g10adm.auction-listing.SC-8zz rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-55 - Closed listing rejects a media upload
**Serves:** grade10-admin-auction-listing-US-05 - Operator calls a listing off before it closes

- **GIVEN** a closed listing
- **WHEN** an operator uploads an image
- **THEN** Grade10 refuses the upload

#### Scenario: grade10-admin-auction-listing-SC-95 - Operator combines direct uploads and product assets
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing with a selected product that has reusable assets
- **WHEN** an authorized operator adds direct uploads and selects product assets in an interleaved order
- **THEN** Grade10 saves one listing gallery in that order

#### Scenario: grade10-admin-auction-listing-SC-96 - Listing selection is limited to its product assets
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing with a selected product and another product with assets
- **WHEN** an authorized operator attempts to select an asset from the other product
- **THEN** Grade10 refuses the selection
- **AND** the listing gallery is unchanged

#### Scenario: grade10-admin-auction-listing-SC-97 - The combined gallery cannot exceed eight items
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing whose direct uploads and selected product assets total eight items
- **WHEN** an authorized operator adds or selects another item
- **THEN** Grade10 refuses the operation
- **AND** the gallery still has eight items

#### Scenario: grade10-admin-auction-listing-SC-98 - Saving snapshots selected product assets
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a selected product asset available to a listing editor
- **WHEN** an authorized operator selects it and saves the listing
- **THEN** Grade10 stores that asset in the listing gallery as saved media

#### Scenario: grade10-admin-auction-listing-SC-99 - A missing source asset refuses Save
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** an operator has selected a product asset for a listing
- **AND** the asset is absent from the product gallery before Save
- **WHEN** the operator saves the listing
- **THEN** Grade10 refuses the save

#### Scenario: grade10-admin-auction-listing-SC-100 - A saved listing does not follow later product-gallery changes
**Serves:** grade10-admin-auction-listing-US-02 - Operator puts a gallery on a listing

- **GIVEN** a listing saved with a selected product asset
- **WHEN** the product asset is replaced, removed, or reordered later
- **THEN** the saved listing gallery remains unchanged

### Requirement: Listing editor exposes optional campaign selection

The Grade10 auction listing editor SHALL let an authorized operator pick at
most one **Campaign** for the listing, or clear the campaign so the listing
stands alone. The picker SHALL list only campaigns that are `draft` or
`created`. A `published` or `canceled` campaign SHALL NOT appear as a
selectable option. Operator-visible labels for this control SHALL say
**Campaign**, not **Sale**.

Selecting a campaign SHALL persist when the operator clicks explicit **Save**
alongside other catalogue fields. **`listings.create`** does not write campaign
or inventory fields — only verifies holds when product and quantity are set.
On an editable listing, **`listings.setAuction`** MAY attach or clear the
campaign after create. Clearing the campaign SHALL store no campaign.
Attaching a `published` or `canceled` campaign through the API SHALL be refused.

An operator who may catalogue a listing SHALL be able to set or clear the
campaign. The picker SHALL NOT block create or publish when no campaign is
chosen.

<!-- trace:scenario id=g10adm.auction-listing.SC-j23 rev=1 -->
#### Scenario: Operator attaches a draft listing to a draft campaign

- **GIVEN** a draft listing and a draft campaign titled "September Slabs"
- **WHEN** an authorized operator selects that campaign in the listing
  editor and clicks Save
- **THEN** Grade10 stores the listing under that campaign
- **AND** the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-c5u rev=1 -->
#### Scenario: Operator attaches a listing to a created campaign

- **GIVEN** a created listing and a created campaign
- **WHEN** an authorized operator selects that campaign in the listing
  editor and clicks Save
- **THEN** Grade10 stores the listing under that campaign

<!-- trace:scenario id=g10adm.auction-listing.SC-98c rev=1 -->
#### Scenario: Operator clears the campaign on a listing

- **GIVEN** a draft listing attached to a draft campaign
- **WHEN** an authorized operator clears the campaign in the listing editor
  and clicks Save
- **THEN** Grade10 stores the listing with no campaign
- **AND** the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-u98 rev=1 -->
#### Scenario: Published and canceled campaigns are not offered in the picker

- **GIVEN** a published campaign, a canceled campaign, and a draft campaign
- **WHEN** an authorized operator opens the campaign picker on the listing
  editor
- **THEN** the draft campaign is offered
- **AND** the published campaign is not offered
- **AND** the canceled campaign is not offered

<!-- trace:scenario id=g10adm.auction-listing.SC-6hq rev=1 -->
#### Scenario: Published campaign cannot receive a listing

- **GIVEN** a draft listing and a published campaign
- **WHEN** an authorized operator attempts to attach that campaign
- **THEN** Grade10 refuses the attach
- **AND** the listing’s campaign is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-b6z rev=1 -->
#### Scenario: Listing without a campaign still creates

- **GIVEN** a draft listing with every required create field set and no
  campaign
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no campaign

<!-- trace:scenario id=g10adm.auction-listing.SC-3xw rev=1 -->
#### Scenario: Listing editor campaign field is labeled Campaign

- **GIVEN** an authorized operator on the listing editor
- **WHEN** they view the optional campaign control
- **THEN** the control is labeled Campaign
- **AND** it is not labeled Sale

### Requirement: Listing editor product selection uses inventory eligibility

The Grade10 auction listing editor SHALL let an authorized operator select
the catalogue **product** the listing reserves against from Grade10
inventory ([`add-grade10-inventory`](../../../../../add-grade10-inventory/proposal.md)).
The product picker SHALL list only inventory products whose **`status` is
`created`** (not `draft`) and that have **available greater than zero**.

A `draft` inventory product SHALL NOT appear in the picker. A `created`
product with zero available SHALL NOT appear unless it is the listing's
currently stored product and this listing already holds units of that product
(see effective-available save rule). Product ids that are not eligible SHALL
be refused on explicit draft-save. Create verifies an existing hold rather
than re-validating picker eligibility.

Campaign covers do **not** select a product — only listings do.

<!-- trace:scenario id=g10adm.auction-listing.SC-m9b rev=1 -->
#### Scenario: Product picker omits draft inventory products

- **GIVEN** a draft inventory product with available stock and a created
  inventory product with available stock
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the created product is offered
- **AND** the draft product is not offered

<!-- trace:scenario id=g10adm.auction-listing.SC-pvl rev=1 -->
#### Scenario: Product picker omits out-of-stock inventory products

- **GIVEN** a created inventory product with available zero and another
  created inventory product with available at least one
- **WHEN** an authorized operator opens the product picker on the listing
  editor
- **THEN** the in-stock created product is offered
- **AND** the out-of-stock product is not offered

<!-- trace:scenario id=g10adm.auction-listing.SC-uec rev=1 -->
#### Scenario: Draft product id is refused on listing save

- **GIVEN** a draft listing and a draft inventory product id
- **WHEN** an authorized operator attempts to save that product id on the
  listing
- **THEN** Grade10 refuses the write
- **AND** the listing's product id is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-7zy rev=1 -->
#### Scenario: Out-of-stock product id is refused on listing save

- **GIVEN** a draft listing with quantity one and a created inventory
  product whose available is zero and no active hold for this listing
- **WHEN** an authorized operator attempts to save that product id on the
  listing
- **THEN** Grade10 refuses the save
- **AND** the listing's product id is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-tvb rev=1 -->
#### Scenario: Current product remains selectable when this listing holds the last units

- **GIVEN** a draft listing with an active inventory hold of quantity three
  on a created product whose global available is zero
- **WHEN** an authorized operator opens the product picker on that listing
- **THEN** the current product is offered
- **AND** other out-of-stock products are not offered

### Requirement: Listing editor saves catalogue fields only on explicit Save

The Grade10 auction listing editor SHALL NOT persist catalogue fields —
including **product**, **quantity**, and **campaign** — until an authorized
operator clicks an explicit **Save** control. Changing a field in the form
SHALL update local editor state only and SHALL NOT call `listings.saveDraft`,
inventory reserve, adjust, release, or product-change mutations.

Auto-save, debounced save, or save-on-blur for catalogue fields SHALL NOT
be used on the listing editor.

<!-- trace:scenario id=g10adm.auction-listing.SC-22a rev=1 -->
#### Scenario: Picking a product does not reserve stock until Save

- **GIVEN** a draft listing with no active inventory hold
- **WHEN** an authorized operator selects a created inventory product in the
  editor but has not clicked Save
- **THEN** Grade10 has not created an inventory reservation
- **AND** the listing's stored product id is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-kil rev=1 -->
#### Scenario: Changing quantity does not adjust the hold until Save

- **GIVEN** a draft listing with an active inventory hold of quantity two
- **WHEN** an authorized operator changes quantity to five in the editor but
  has not clicked Save
- **THEN** the hold remains quantity two
- **AND** the listing's stored quantity is unchanged

### Requirement: Listing quantity defaults when a product is chosen

The listing editor SHALL expose a **quantity** field — a whole number from
**1 to 500**, the same bounds as inventory reservations.

When an operator selects a catalogue product and quantity is empty, the
editor SHALL default quantity to **1** in local form state. Quantity MAY
remain empty only while no product is selected.

On explicit Save with both **productId** and **quantity** set, Grade10 SHALL
synchronize inventory as defined below. Save with a product and no quantity
SHALL NOT create or change an inventory hold.

<!-- trace:scenario id=g10adm.auction-listing.SC-5ci rev=1 -->
#### Scenario: Product selection defaults quantity to one in the form

- **GIVEN** a draft listing with no product selected and empty quantity
- **WHEN** an authorized operator selects a created inventory product
- **THEN** the editor shows quantity one in the form
- **AND** no inventory reservation exists until Save

### Requirement: Draft save synchronizes an active inventory reservation

When an authorized operator explicitly saves a draft listing with both
**productId** and **quantity** set, Grade10 SHALL synchronize inventory
**before** persisting the listing fields:

1. Validate the product is inventory **`status` `created`**. Refuse draft
   inventory products.
2. Compute **effective available** for the requested product: global
   `available` plus this listing's **remaining** on an active hold for the
   same product, if any. Refuse when requested quantity exceeds effective
   available.
3. If no active hold exists for this listing → call
   `AuctionInventoryService.reserve` with `holderReference` = listing id,
   the product, and quantity. The reservation SHALL be **`active`**.
4. If an active hold exists on the **same** product with a different
   quantity → call `adjustReservation` to the new quantity. Decreasing
   quantity SHALL decrease inventory **`reserved`** without increasing
   reservation **`released`**.
5. If an active hold exists on a **different** product → call
   `changeReservationProduct` on that reservation with the new product and
   quantity in one inventory transaction.
6. Persist listing **productId** and **quantity** only after inventory
   succeeds. On inventory refusal, listing fields SHALL be unchanged.

Clearing **productId** or **quantity** on Save SHALL release any active hold
for this listing (full release of remaining) before persisting the cleared
field(s).

<!-- trace:scenario id=g10adm.auction-listing.SC-v4t rev=1 -->
#### Scenario: First explicit save with product and quantity reserves stock

- **GIVEN** a draft listing with no active inventory hold
- **AND** a created inventory product with available at least three
- **WHEN** an authorized operator sets product and quantity three and clicks
  Save
- **THEN** Grade10 creates an active reservation of quantity three keyed by
  the listing id
- **AND** the product's inventory **reserved** increases by three
- **AND** the listing stores product id and quantity three

<!-- trace:scenario id=g10adm.auction-listing.SC-1t5 rev=1 -->
#### Scenario: Save increases quantity adjusts the same reservation

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product A has available at least two
- **WHEN** an authorized operator changes quantity to five and clicks Save
- **THEN** the same reservation id stays active with quantity five
- **AND** product A **reserved** increases by two
- **AND** reservation **released** is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-un6 rev=1 -->
#### Scenario: Save decreases quantity frees stock without release counter

- **GIVEN** a draft listing with an active hold of quantity five
- **WHEN** an authorized operator changes quantity to two and clicks Save
- **THEN** the same reservation id stays active with quantity two
- **AND** inventory **reserved** decreases by three
- **AND** reservation **released** remains zero

<!-- trace:scenario id=g10adm.auction-listing.SC-9zc rev=1 -->
#### Scenario: Save changes product moves the hold atomically

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product B is **created** with available at least three
- **WHEN** an authorized operator selects product B, keeps quantity three,
  and clicks Save
- **THEN** Grade10 moves the hold to product B with quantity three in one
  inventory transaction
- **AND** product A **reserved** decreases by three
- **AND** product B **reserved** increases by three
- **AND** the listing stores product B

<!-- trace:scenario id=g10adm.auction-listing.SC-z0g rev=1 -->
#### Scenario: Save refused when quantity exceeds effective available

- **GIVEN** a draft listing with an active hold of quantity three on product A
- **AND** product A available is one
- **WHEN** an authorized operator changes quantity to five and clicks Save
- **THEN** Grade10 refuses the save
- **AND** the hold and listing fields are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-mp6 rev=1 -->
#### Scenario: Clearing product on Save releases the hold

- **GIVEN** a draft listing with an active hold on a product
- **WHEN** an authorized operator clears the product and clicks Save
- **THEN** Grade10 releases the hold
- **AND** inventory **reserved** decreases by the hold's remaining
- **AND** the listing stores no product id

<!-- trace:scenario id=g10adm.auction-listing.SC-m8a rev=1 -->
#### Scenario: Clearing quantity on Save releases the hold

- **GIVEN** a draft listing with an active hold of quantity three
- **WHEN** an authorized operator clears quantity and clicks Save
- **THEN** Grade10 releases the hold
- **AND** inventory **reserved** decreases by three
- **AND** the listing stores no quantity

<!-- trace:scenario id=g10adm.auction-listing.SC-i8l rev=1 -->
#### Scenario: Save with product but no quantity creates no hold

- **GIVEN** a draft listing with no active hold
- **WHEN** an authorized operator sets a created product but clears quantity
  and clicks Save
- **THEN** Grade10 persists the product id
- **AND** no inventory reservation is created

### Requirement: Create verifies an existing inventory hold

`listings.create` SHALL move a listing from **`draft`** to **`created`** only
when every other create requirement is met **and**, when the listing stores
both **productId** and **quantity**, an **active** inventory reservation
exists for that listing with the same product and quantity.

Create SHALL **not** call inventory reserve, adjust, or product-change
mutations. The operator MUST have saved the draft with product and quantity
first so the hold already exists.

<!-- trace:scenario id=g10adm.auction-listing.SC-mj9 rev=1 -->
#### Scenario: Create succeeds when hold matches saved product and quantity

- **GIVEN** a draft listing stored with product A and quantity three
- **AND** an active inventory hold of quantity three on product A for this
  listing
- **WHEN** an authorized operator creates the listing with every other
  required field set
- **THEN** Grade10 moves the listing to **created**
- **AND** the hold remains active with quantity three

<!-- trace:scenario id=g10adm.auction-listing.SC-f82 rev=1 -->
#### Scenario: Create refused when no hold exists

- **GIVEN** a draft listing stored with product A and quantity three
- **AND** no active inventory hold for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

<!-- trace:scenario id=g10adm.auction-listing.SC-nf9 rev=1 -->
#### Scenario: Create refused when hold quantity mismatches

- **GIVEN** a draft listing stored with quantity five
- **AND** an active hold of quantity three for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

<!-- trace:scenario id=g10adm.auction-listing.SC-tgf rev=1 -->
#### Scenario: Create refused when hold product mismatches

- **GIVEN** a draft listing stored with product B and quantity three
- **AND** an active hold of quantity three on product A for this listing
- **WHEN** an authorized operator attempts create
- **THEN** Grade10 refuses the create
- **AND** the listing remains **draft**

### Requirement: Product change warns before moving an existing hold

When an operator changes the catalogue **product** on a listing that already
has an **active** inventory reservation from a prior explicit Save, the
editor SHALL show a confirmation dialog before applying the new product to
local form state. The dialog SHALL state that confirming and clicking Save
will move the hold to the new product and free reserved stock on the prior
product.

The dialog SHALL NOT appear when:

- the listing has never had an active hold (first product selection on a
  new or never-saved draft), or
- the listing has no active hold (draft saved without product or quantity,
  or hold already released).

Canceling the dialog SHALL leave the selected product unchanged in the form.

<!-- trace:scenario id=g10adm.auction-listing.SC-bb3 rev=1 -->
#### Scenario: Product change prompts when a hold already exists

- **GIVEN** a draft listing with an active hold on product A from a prior Save
- **WHEN** an authorized operator selects product B in the picker
- **THEN** the editor shows a confirmation dialog that Save will move the
  hold to product B and free reserved stock on product A
- **AND** no inventory mutation runs until Save

<!-- trace:scenario id=g10adm.auction-listing.SC-68h rev=1 -->
#### Scenario: First product selection does not prompt

- **GIVEN** a draft listing with no active hold
- **WHEN** an authorized operator selects product A
- **THEN** no confirmation dialog is shown
- **AND** quantity defaults to one in the form

<!-- trace:scenario id=g10adm.auction-listing.SC-rr1 rev=1 -->
#### Scenario: Canceling the product-change dialog keeps the prior product

- **GIVEN** a draft listing with an active hold on product A
- **WHEN** an authorized operator selects product B and cancels the
  confirmation dialog
- **THEN** the form still shows product A
- **AND** the hold on product A is unchanged

### Requirement: Product-change save failure surfaces an editor error

When Save calls `changeReservationProduct` and inventory refuses — for example
insufficient stock on the new product, a draft target product, or quantity
below the settled floor — the listing editor SHALL show an operator-visible
error. The listing's stored **productId** and **quantity** SHALL remain the
values from before that Save attempt, and the hold on the prior product SHALL
be unchanged.

<!-- trace:scenario id=g10adm.auction-listing.SC-x6v rev=1 -->
#### Scenario: Save shows error when new product has insufficient stock

- **GIVEN** a draft listing with an active hold on product A
- **AND** product B available is less than the requested quantity
- **WHEN** an authorized operator selects product B and clicks Save
- **THEN** Grade10 refuses the save
- **AND** the editor shows an error naming insufficient stock
- **AND** the listing still stores product A with the prior quantity
- **AND** the hold on product A is unchanged

### Requirement: Listing cancel releases inventory hold

When a listing is canceled through operator call-off or campaign fan-out,
Grade10 SHALL release any **active** inventory reservation for that listing
(full release of remaining) before or as part of the cancel transition.

<!-- trace:scenario id=g10adm.auction-listing.SC-cj4 rev=1 -->
#### Scenario: Cancel releases remaining stock

- **GIVEN** a created listing with an active hold of quantity three and
  remaining three
- **WHEN** an authorized operator cancels the listing
- **THEN** the reservation becomes **closed**
- **AND** inventory **reserved** decreases by three
- **AND** the listing moves to **canceled**

### Requirement: Listings section creates an independent listing

An authorized operator SHALL start a new Auction listing from the Grade10
auction **Listings** section. The Listings section SHALL expose a **Create
listing** action for an operator who holds the `auction:operate` grant.

Activating Create listing SHALL open the listing editor with **no Campaign**
selected. The operator SHALL NOT be required to choose a campaign before
saving a draft, creating, or publishing. Campaign attachment remains optional.

A listing saved, created, or published with no campaign SHALL persist with
`campaign_id` null. A collector SHALL open that listing by its slug on the
public catalogue. The Listings table SHALL show "-" in the campaign column
when a row has no campaign.

An operator without the `auction:operate` grant SHALL NOT be offered Create
listing. A draft save sent without that grant SHALL be refused.

<!-- trace:scenario id=g10adm.auction-listing.SC-yhm rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-68 - Create listing is offered on the Listings section
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

- **GIVEN** an authorized operator on the Grade10 auction Listings section
- **WHEN** they read the section heading row
- **THEN** a Create listing action is present

<!-- trace:scenario id=g10adm.auction-listing.SC-s6o rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-69 - Listing editor opens with no campaign selected
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

- **GIVEN** an authorized operator who activates Create listing on the
  Listings section
- **WHEN** the listing editor opens
- **THEN** the Campaign control has no campaign selected

<!-- trace:scenario id=g10adm.auction-listing.SC-44k rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-58 - Draft saves with the campaign left empty
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

- **GIVEN** a new listing opened from the Listings section with no campaign
- **WHEN** an authorized operator saves a draft with a title and no campaign
- **THEN** Grade10 persists a draft listing with no campaign
- **AND** the listing is absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-toy rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-59 - Listing creates with no campaign
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

- **GIVEN** a draft listing with every required create field set and no campaign
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing has no campaign
- **AND** it is still absent from the public catalogue

<!-- trace:scenario id=g10adm.auction-listing.SC-8pr rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-60 - Listing publishes with no campaign
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

- **GIVEN** a created listing with no campaign and no publish at
- **WHEN** an authorized operator publishes it
- **THEN** Grade10 moves it to `published`
- **AND** the listing still has no campaign

<!-- trace:scenario id=g10adm.auction-listing.SC-5oo rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-61 - Collector opens the published listing by slug
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

- **GIVEN** a published listing with no campaign whose slug is
  `standalone-lot-1`
- **WHEN** a collector opens `/auction/listings/standalone-lot-1`
- **THEN** Grade10 returns that listing

<!-- trace:scenario id=g10adm.auction-listing.SC-ssk rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-62 - Listings table shows an unattached listing
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

- **GIVEN** a listing with no campaign
- **WHEN** an authorized operator reads the Listings section table
- **THEN** that row's campaign column shows "-"
- **AND** it does not display a campaign id as a label

<!-- trace:scenario id=g10adm.auction-listing.SC-2ir rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-63 - Create listing is not offered to an unauthorized operator
**Serves:** grade10-admin-auction-listing-US-06 - Operator creates and publishes a listing with no campaign

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

<!-- trace:scenario id=g10adm.auction-listing.SC-wkl rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-64 - Listings tab is present in the Test panel
**Serves:** Test fixture standalone seed - listings tab is present in the Test panel

- **GIVEN** the Grade10 auction Test panel with `LOCAL_FIXTURES_ENABLED` true
- **WHEN** a developer opens the Test panel
- **THEN** a Listings tab is present beside the Campaign tab

<!-- trace:scenario id=g10adm.auction-listing.SC-41t rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-65 - Developer seeds fixture listings with no campaign
**Serves:** Test fixture standalone seed - developer seeds fixture listings with no campaign

- **GIVEN** the Listings tab in the Test panel
- **WHEN** a developer selects one or more fixture ids and clicks Add listings
- **THEN** Grade10 creates each selected fixture as a listing with no campaign
- **AND** each listing has a reserved inventory product and a media item
- **AND** the instance counts on the tab update

<!-- trace:scenario id=g10adm.auction-listing.SC-nec rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-66 - Seeded standalone listings appear in the Listings section with no campaign
**Serves:** Test fixture standalone seed - seeded standalone listings appear in the Listings section with no campaign

- **GIVEN** a fixture listing seeded from the Test panel Listings tab
- **WHEN** an authorized operator reads the Listings section
- **THEN** that listing appears in the table
- **AND** its campaign column shows "-"

<!-- trace:scenario id=g10adm.auction-listing.SC-6q8 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-67 - Developer drops standalone fixture listings
**Serves:** Test fixture standalone seed - developer drops standalone fixture listings

- **GIVEN** one or more standalone fixture listings seeded from the Listings tab
- **WHEN** a developer selects one and clicks Drop listing
- **THEN** Grade10 removes that listing and releases its inventory hold
- **AND** the listing no longer appears in the Listings section

### Requirement: Listing creation requires an explicit inventory-unit choice

A listing that reserves a product names the unit it takes: one Cert ID, or
none.

**Explicit choice** - An Auction listing that reserves a product SHALL carry
an explicit inventory unit choice. The choice SHALL be either one available
Cert ID owned by the selected product inventory or the literal choice
`No Cert ID`.

**Unnumbered stock** - A product with no Cert ID records SHALL remain listable
through `No Cert ID`.

**Stored and required** - The choice SHALL be stored with the listing and
SHALL be required at create even when the selected product has no Cert ID.

<!-- trace:scenario id=g10adm.auction-listing.SC-t4s rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-84 - Product with Cert IDs offers an explicit choice
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created inventory product with available units and Cert IDs `PSA-123` and `BGS-456`
- **WHEN** an authorized operator opens the listing product picker
- **THEN** the editor offers `PSA-123`, `BGS-456`, and `No Cert ID` as explicit choices
- **AND** no blank or implicit certificate choice is used

<!-- trace:scenario id=g10adm.auction-listing.SC-6ov rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-71 - Product without Cert IDs offers No Cert ID
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created inventory product with available stock and no Cert ID records
- **WHEN** an authorized operator selects that product
- **THEN** the editor offers `No Cert ID`
- **AND** the operator can create a listing after selecting it

<!-- trace:scenario id=g10adm.auction-listing.SC-ea4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-72 - Changing products clears the prior unit choice
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a draft listing with product A and Cert ID `PSA-123`
- **WHEN** an authorized operator selects product B
- **THEN** the Cert ID choice is cleared until the operator chooses a unit for product B
- **AND** the listing cannot be created with product B and product A's Cert ID

### Requirement: Inventory validates and holds a selected Cert ID

Inventory checks that a chosen Cert ID belongs to the product and is free,
then holds it as one unit.

**Verified by Inventory** - When a listing selects a Cert ID, Auction SHALL
ask Inventory to verify that the record belongs to the selected product and
is not already held by another active Auction listing.

**Quantity one** - A selected Cert ID SHALL represent exactly one listed unit,
so its listing quantity SHALL be one.

**Unit hold** - Inventory SHALL reserve that unit and the aggregate product
inventory in the same logical save operation.

**No Cert ID** - The `No Cert ID` choice SHALL use the existing product-level
quantity and reservation rules without allocating a certificate record.

<!-- trace:scenario id=g10adm.auction-listing.SC-31p rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-73 - Wrong-product Cert ID is refused
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created product A and a Cert ID owned by product B
- **WHEN** an authorized operator tries to save product A with product B's Cert ID
- **THEN** Grade10 refuses the save
- **AND** the listing and inventory holds are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-z7s rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-74 - A Cert ID cannot be held twice
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** an active Auction listing holds Cert ID `PSA-123`
- **WHEN** another listing tries to save the same Cert ID
- **THEN** Grade10 refuses the save
- **AND** the existing listing's hold remains unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-cew rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-75 - No Cert ID uses aggregate reservation
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created product with available stock and no Cert ID records
- **WHEN** an authorized operator chooses `No Cert ID` and quantity three
- **THEN** the listing reserves quantity three through the product inventory
- **AND** no Cert ID record is allocated

### Requirement: Listing create verifies the saved inventory-unit choice

Create checks the saved choice against a live inventory hold and never
guesses one.

**Create** - Create SHALL refuse a listing whose saved product and quantity do
not have a matching active inventory hold. When a Cert ID is selected, the
hold SHALL also match that record and quantity one.

**No inferred choice** - Create SHALL not mint or infer a certificate choice.

**Editing** - Editing a listing SHALL preserve its selected Cert ID when the
listing's own active hold makes that unit unavailable to other listings.

<!-- trace:scenario id=g10adm.auction-listing.SC-xtc rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-76 - Create succeeds with a saved Cert ID hold
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a draft listing saved with product A, Cert ID `PSA-123`, and quantity one
- **AND** an active hold for that listing matches product A and `PSA-123`
- **WHEN** an authorized operator creates the listing with every other required field set
- **THEN** Grade10 moves the listing to `created`
- **AND** the selected Cert ID remains held by that listing

<!-- trace:scenario id=g10adm.auction-listing.SC-wkt rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-77 - Create succeeds with No Cert ID
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a draft listing saved with a product, `No Cert ID`, and quantity three
- **AND** an active product-level hold of quantity three matches that listing
- **WHEN** an authorized operator creates the listing with every other required field set
- **THEN** Grade10 moves the listing to `created`
- **AND** no Cert ID is stored for the listing

<!-- trace:scenario id=g10adm.auction-listing.SC-muy rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-78 - Create without an explicit unit choice is refused
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a draft listing with a product and quantity but no Cert ID choice
- **WHEN** an authorized operator attempts to create it
- **THEN** the form and API refuse the create
- **AND** the listing remains `draft`

### Requirement: Listing display resolves the selected inventory identity

The public listing shows the chosen unit's Cert ID from Inventory, and no
certificate row when none was chosen.

**Selected identity** - When a listing's selected product schema includes
Cert ID in Displayed Attributes, the public listing response SHALL resolve and
include the selected Cert ID through the Inventory display boundary.

**Unnumbered stock** - If the listing selected `No Cert ID`, the response
SHALL omit the Cert ID row.

**Not from product metadata** - Product metadata SHALL NOT be returned as an
alternative product display source.

<!-- trace:scenario id=g10adm.auction-listing.SC-dqc rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-79 - Public listing displays selected Cert ID
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a published listing with Cert ID `PSA-123` and a schema that displays Cert ID
- **WHEN** a collector opens the listing
- **THEN** the listing displays `PSA-123` in the configured product-field position
- **AND** it displays typed product attributes through the same product display

<!-- trace:scenario id=g10adm.auction-listing.SC-hch rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-80 - Public listing hides No Cert ID
**Serves:** grade10-admin-auction-listing-US-71 - Operator creates and presents the selected unit

- **GIVEN** a published listing with the explicit `No Cert ID` choice
- **WHEN** a collector opens the listing
- **THEN** no Cert ID row is displayed
- **AND** no product metadata fallback is returned

### Requirement: Distinct certified units can have separate live listings

A created product with multiple available Cert IDs SHALL allow a separate live
listing for each distinct Cert ID. One Cert ID SHALL belong to no more than one
live listing at a time.

<!-- trace:scenario id=g10adm.auction-listing.SC-6gt rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-85 - Distinct copies of one product can be listed separately
**Serves:** grade10-admin-auction-listing-US-70 - Operator attaches one inventory unit to a listing

- **GIVEN** a created product has available Cert IDs `PSA-123` and `BGS-456`
- **WHEN** an authorized operator saves one live listing for each Cert ID
- **THEN** both listings hold their selected unit for that same product
- **AND** another listing cannot hold either already selected Cert ID

### Requirement: The Listings Stats dialog shows the listing's watchers

Opening Stats on a listing that offers it shows how many collectors watch the
listing, to every operator who may open Stats.

**Watchers in Stats** - The Listings Stats dialog SHALL show the watch count
`grade10-site/auction/watchlist` defines for that listing: every watch across
both brands, as of when Stats loaded.

**Nobody watching** - A listing nobody watches SHALL show 0.

**What it does not say** - The dialog SHALL name no watcher and SHALL NOT
present the count as expected bidders.

**Who sees it** - Every operator who may open Stats SHALL see the count; it
needs no further grant.

<!-- trace:scenario id=g10adm.auction-listing.SC-qlf rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-81 - Stats shows a listing's watchers
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** a listing that offers Stats, watched by two collectors on one brand and one collector on the other
- **WHEN** an authorized operator opens Stats for that listing
- **THEN** Stats shows 3 watchers

<!-- trace:scenario id=g10adm.auction-listing.SC-7qf rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-82 - An unwatched listing shows zero in Stats
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** a listing that offers Stats and nobody watches
- **WHEN** an authorized operator opens Stats for that listing
- **THEN** Stats shows 0 watchers

<!-- trace:scenario id=g10adm.auction-listing.SC-sil rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-83 - A closed listing keeps its watchers in Stats
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** a closed listing that offers Stats and is still watched by two collectors
- **WHEN** an authorized operator opens Stats for that listing
- **THEN** Stats shows 2 watchers

### Requirement: The Listings table does not show a Watchers column

The Listings table SHALL NOT show a Watchers column. The watch count SHALL
reach the operator only through Stats.

<!-- trace:scenario id=g10adm.auction-listing.SC-de9 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-86 - The Listings table has no Watchers column
**Serves:** grade10-admin-auction-listing-US-08 - Operator checks a listing's watchers

- **GIVEN** an authorized operator on the Listings table
- **WHEN** the table renders
- **THEN** there is no Watchers column

### Requirement: An Unsold close releases the listing's inventory hold

When a listing closes with no winner, Grade10 SHALL release the listing's whole remaining
inventory hold at that close and SHALL NOT wait for an operator.

- A failed release SHALL be retried until it succeeds and SHALL NOT delay or
  reverse the close.
- A listing that closes with a winner SHALL NOT release under this rule; its
  hold moves to sold as before.

#### Scenario: grade10-admin-auction-listing-SC-130 - A close with no bids releases the hold
**Serves:** grade10-admin-auction-listing-US-09 - the operator finds the stock back without a step

- **GIVEN** a published listing of a created product with an active hold of
  three units, and no bids
- **WHEN** the listing closes
- **THEN** the listing is Unsold and its hold is released in full
- **AND** the product's available rises by three

#### Scenario: grade10-admin-auction-listing-SC-132 - A close with a winner keeps its hold for the sale
**Serves:** Unsold close - a sold listing's hold is settled by the sale, not released

- **GIVEN** a published listing with an active hold of one unit and a top bid
- **WHEN** the listing closes
- **THEN** no release is written for the hold
- **AND** the hold stays active until the sale moves it to sold

#### Scenario: grade10-admin-auction-listing-SC-133 - A failed release is retried and the close stands
**Serves:** Unsold close - the close never waits on the inventory release

- **GIVEN** a published listing with an active hold whose release fails at the
  close
- **WHEN** the listing closes
- **THEN** the listing is Unsold at its close time
- **AND** the release is retried until it succeeds, and then the reservation is
  closed once

#### Scenario: grade10-admin-auction-listing-SC-146 - A close with only outbid bids releases the hold
**Serves:** grade10-admin-auction-listing-US-09 - the operator finds the stock back without a step

- **GIVEN** a published listing with an active hold of two units whose bids
  are all `outbid`, its top bid demoted before the close
- **WHEN** the listing closes
- **THEN** the listing is Unsold and its hold is released in full
- **AND** the product's available rises by two

### Requirement: An Unsold listing says its stock was released

The admin page of a listing that closed with no winner SHALL show that its stock
was released, with the date and time of the release, once the release has
completed.

#### Scenario: grade10-admin-auction-listing-SC-134 - An Unsold listing shows the release date
**Serves:** grade10-admin-auction-listing-US-09 - the operator sees the stock is back

- **GIVEN** a listing that closed Unsold and whose hold was released
- **WHEN** an operator opens the listing
- **THEN** it says the stock was released, with the release date and time

### Requirement: Relist opens a new draft from an Unsold listing

The Listings table row of an Unsold listing SHALL offer **Relist** when every
condition holds, and SHALL NOT show it otherwise; no other row SHALL offer it:

| Condition | Rule |
| --- | --- |
| Stock | The listing's stock release has completed |
| Campaign | The listing sits in no campaign |
| Relisted | No listing has yet been saved from this listing's Relist |
| Operator | Holds the `auction:operate` grant |

1. Relist SHALL open the listing editor filled in with the Unsold listing's
   product, quantity, Cert ID choice, title, copy, starting price, currency and
   gallery.
2. The editor SHALL start with no slug, listing code or window; every other
   field SHALL start as on any new draft.
3. Nothing SHALL be stored and no stock SHALL be held until the operator saves.
   Relist activated again SHALL open another unsaved editor.
4. Save SHALL be an ordinary draft save that records which listing it was
   relisted from, and the Unsold listing SHALL NOT change.

The gallery SHALL be copied into the new listing, so later edits to either
gallery do not change the other.

Save SHALL be refused, storing nothing and holding no stock, when the source
listing:

| Refused when the source | Refusal |
| --- | --- |
| Does not exist | Listing not found |
| Did not close with no winner | Not Unsold |
| Sits in a campaign | In a campaign |
| Has no completed stock release | Stock not released |
| Already has a listing saved from its Relist | Already relisted |

The editor SHALL show the refusal's name inline.

Every refusal of an ordinary draft save, such as available stock below the
quantity, SHALL apply as well.

#### Scenario: grade10-admin-auction-listing-SC-135 - Relist opens the editor with the lot filled in
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock was released, with a
  product, a Cert ID choice, quantity three, a title, copy, a starting price, a
  currency and a two-item gallery
- **WHEN** an operator holding `auction:operate` activates Relist on its row in
  the Listings table
- **THEN** the editor shows the same product, Cert ID choice, quantity, title,
  copy, starting price, currency and both gallery items
- **AND** it has no window, slug or listing code yet

#### Scenario: grade10-admin-auction-listing-SC-136 - Relist stores nothing until Save
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** the editor opened by Relist on a listing of a product with
  available five and quantity three
- **WHEN** the operator leaves without saving
- **THEN** no listing is stored and available is unchanged
- **AND** when the operator instead saves, a new draft holds three units,
  available falls by three and the Unsold listing is unchanged

#### Scenario: grade10-admin-auction-listing-SC-137 - Relist shows on the row of a released Unsold listing only
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** listings in no campaign: an Unsold listing whose stock was
  released, a listing with a winner, a live listing and a called-off listing
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** only the Unsold listing's row offers Relist

#### Scenario: grade10-admin-auction-listing-SC-138 - An operator without the grant is not offered Relist
**Serves:** grade10-admin-auction-listing-US-09 - only an operator who can operate auctions relists

- **GIVEN** an Unsold listing in no campaign whose stock was released, and an
  operator without `auction:operate`
- **WHEN** they open the Listings table
- **THEN** the listing's row shows no Relist

#### Scenario: grade10-admin-auction-listing-SC-141 - Relist waits for the stock release
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in no campaign whose stock release has not yet
  completed
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist
- **AND** once the release completes, the row offers Relist

#### Scenario: grade10-admin-auction-listing-SC-142 - A listing in a campaign offers no Relist
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing in a campaign whose stock was released
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the listing's row shows no Relist

#### Scenario: grade10-admin-auction-listing-SC-143 - Relist is hidden once the listing is relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** an Unsold listing whose Relist editor was saved as a new draft
- **WHEN** an operator holding `auction:operate` opens the Listings table
- **THEN** the Unsold listing's row shows no Relist

#### Scenario: grade10-admin-auction-listing-SC-144 - Only the first of two Relist editors saves
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** two editors opened by Relist on the same Unsold listing, of a
  product with available five and quantity three
- **WHEN** the operator saves the first and then the second
- **THEN** the first stores a draft holding three units
- **AND** the second is refused as already relisted, stores nothing and
  available stays two

#### Scenario: grade10-admin-auction-listing-SC-145 - Save refuses a source that cannot be relisted
**Serves:** grade10-admin-auction-listing-US-09 - the unsold lot goes back on sale in one move

- **GIVEN** a listing with a winner, an Unsold listing in a campaign, and an
  Unsold listing whose stock release has not completed
- **WHEN** a relist save names each as its source
- **THEN** each is refused, as not Unsold, in a campaign and stock not released
  in turn
- **AND** no listing is stored and available is unchanged

### Requirement: Holds left by earlier Unsold closes are released once

Grade10 SHALL provide one release that frees every active hold whose listing
closed with no winner before this rule shipped. Each such reservation SHALL
close as released, and the listing SHALL show the release note dated by the
release. A hold of a listing with a winner, of a live listing, of a called-off
listing, or already released SHALL be left as it is. Running it again SHALL
change nothing.

#### Scenario: grade10-admin-auction-listing-SC-139 - The clean-up frees each stuck hold
**Serves:** Unsold close - stock held by earlier Unsold closes is freed

- **GIVEN** two listings that closed Unsold earlier and still hold five and one
  units, a live listing holding two, and a listing with a winner holding one
- **WHEN** the one-off release runs
- **THEN** the two Unsold holds are closed as released and available rises by
  five and one
- **AND** the live listing's and the winner's holds are unchanged

#### Scenario: grade10-admin-auction-listing-SC-140 - Running the clean-up again changes nothing
**Serves:** Unsold close - the clean-up is safe to run twice

- **GIVEN** the one-off release has already run
- **WHEN** it runs again
- **THEN** no reservation, count or history entry changes
