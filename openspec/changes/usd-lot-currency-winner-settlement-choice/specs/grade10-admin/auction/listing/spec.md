# grade10-admin/auction/listing Specification

## Purpose

Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos from product assets or direct uploads, frozen when saved,
chosen for the selected physical unit with deliberate cross-Cert additions,
call one off while it has not closed, and get a lot's stock back, with a
one-step Relist, when its listing closes with no winner. Named image sizes and
optional alt live in `grade10-site/auction/listing-media`.

## Feature set

- Listing currency
  - USD only: the listing form offers no currency choice and stores USD when none is supplied
  - Earlier lots: HKD or JPY listing currencies are overwritten to USD with amounts and history unchanged
  - Other currencies refused: HKD, JPY or any other currency is refused on a draft, create or update, by the form and API
- Prices and window
  - Starting price of 0: a draft and create accept 0 in USD; a negative, non-whole or empty price is refused, and empty is never stored as 0

## ADDED Requirements

### Requirement: A listing is priced in USD and no earlier listing keeps another currency

Every Auction listing SHALL carry the currency `USD`, the bid currency. The
listing form SHALL offer no currency choice, and the API SHALL accept no
currency other than `USD` on a draft, a create or an update. When a write
omits the currency, Grade10 SHALL store `USD`.

Once, before this change is live, Grade10 SHALL overwrite the currency of every
listing that holds `HKD` or `JPY` with `USD`. The overwrite SHALL leave every
amount, bid, auto-bid maximum, status and date unchanged and SHALL convert
nothing. Every such listing is test data.

<!-- trace:scenario id=g10adm.auction-listing.SC-zzf rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-159 - The form offers no currency choice
**Serves:** grade10-admin-auction-listing-US-74 - Operator prices a listing in USD

- **GIVEN** an authorized operator on a new listing
- **WHEN** they open the listing form
- **THEN** the form states the currency as USD and offers no other choice
- **AND** no currency control can be changed

<!-- trace:scenario id=g10adm.auction-listing.SC-28a rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-160 - A create without a currency stores USD
**Serves:** grade10-admin-auction-listing-US-74 - Operator prices a listing in USD

- **GIVEN** a draft complete except for currency
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 creates it with currency `USD`

<!-- trace:scenario id=g10adm.auction-listing.SC-et0 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-161 - An HKD or JPY write is refused by the API
**Serves:** grade10-admin-auction-listing-US-74 - Operator prices a listing in USD

- **GIVEN** a created listing in `USD`
- **WHEN** an update sent straight to the API sets its currency to HKD, then
  to JPY
- **THEN** Grade10 refuses each write
- **AND** the listing's currency and amounts are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-adx rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-162 - An earlier HKD listing is overwritten to USD with its amounts unchanged
**Serves:** Listing currency - an earlier HKD or JPY listing is overwritten to USD with nothing converted

- **GIVEN** a created listing in `HKD` with a starting price of 100000 minor
  units
- **AND** a published listing in `JPY` with a current bid of 150000 minor units
- **WHEN** the one-time currency overwrite runs
- **THEN** the first reads a starting price of 100000 minor units `USD`
- **AND** the second reads a current bid of 150000 minor units `USD`
- **AND** each listing's status, bids and dates are unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-c58 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-163 - The overwrite touches only HKD and JPY listings
**Serves:** Listing currency - an earlier HKD or JPY listing is overwritten to USD with nothing converted

- **GIVEN** a listing in `USD` with a current bid of 20000 minor units
- **WHEN** the one-time currency overwrite runs
- **THEN** the listing is unchanged


## MODIFIED Requirements

### Requirement: Operator saves a listing as a draft

An authorized operator SHALL save an Auction listing as a draft without every
required field. A draft save SHALL NOT require title, slug, starting price,
currency, starts at, scheduled close at, or media. A supplied currency SHALL
be USD. Grade10 SHALL refuse another currency, HKD and JPY included, and
leave the draft unchanged.

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

<!-- trace:scenario id=g10adm.auction-listing.SC-a6f rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-124 - Draft saves a starting price of 0
**Serves:** grade10-admin-auction-listing-US-01 - Operator prices an unfinished no-reserve lot at nothing

- **GIVEN** a draft listing in `USD`
- **WHEN** an operator sets its starting price to 0 minor units
- **THEN** Grade10 stores a starting price of 0 minor units `USD`
- **AND** the draft reads back 0, not an empty price
- **AND** the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-h88 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-164 - Draft rejects HKD and JPY
**Serves:** grade10-admin-auction-listing-US-74 - Operator prices a listing in USD

- **GIVEN** a draft listing in `USD`
- **WHEN** an operator sets its currency to HKD, then to JPY
- **THEN** Grade10 refuses each write
- **AND** the currency is unchanged

### Requirement: Create validates required fields on the form and the API

Create SHALL require a title, slug, starting price, starts at, scheduled close
at, media, and a currency of USD. When omitted, currency SHALL default to USD.
The form and API SHALL reject any other currency independently.

The form SHALL state USD and offer no currency choice, and SHALL NOT display
a minimum-increment field. Grade10's USD schedule governs the listing's bid
floor.

SC-57 retains its historical title and id. Its body requires the API to
refuse a non-USD create; the form offers no currency control.

<!-- trace:scenario id=g10adm.auction-listing.SC-mmr rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-06 - Operator creates a filled draft
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a complete draft with currency USD and no minimum-increment value
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 creates it
- **AND** its bid floor uses the USD schedule

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

<!-- trace:scenario id=g10adm.auction-listing.SC-dal rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-57 - Create refuses an unsupported currency on the form and API
**Serves:** Create and catalogue - create refuses an unsupported currency on the form and API

- **GIVEN** a complete draft with currency EUR
- **WHEN** an operator creates the listing
- **THEN** the API refuses the create
- **AND** the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-ja8 rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-165 - Create refuses HKD and JPY through the API
**Serves:** grade10-admin-auction-listing-US-74 - Operator prices a listing in USD

- **GIVEN** a complete draft with currency HKD, and another with currency JPY
- **WHEN** an operator creates each listing
- **THEN** the API refuses both creates
- **AND** each listing remains a draft

### Requirement: Prices and window are writable before publish

While a listing is `draft` or `created`, an authorized operator SHALL be able
to set:

- **Currency** — `USD`, the only value accepted. Omitted at create SHALL store
  `USD`. Any other value SHALL be refused on the form and on the API.
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
- A write that sets starts at or scheduled close at to a time not after now
  SHALL be refused on the admin form and on the API. A value left as stored,
  compared to the minute, SHALL NOT be refused, so a listing whose opening has
  passed still saves its other fields.
- The admin form SHALL show each of these refusals under its field while the
  operator types, before Save.
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
duration. Scenario `grade10-admin-auction-listing-SC-125a` keeps its title
with its id too: the title is historical, and the stored currency is `USD`.

A write of any of these fields on a `published`, `closed`, `settled`, or
`canceled` listing SHALL be refused. The effective close is not an operator
field: extended bidding writes it, and this form SHALL NOT accept it.

**Sandbox** SHALL be writable only while `draft`. A sandbox listing runs on
test-mode payment credentials instead of live money, so the house can
rehearse a sale. A write of sandbox on a `created` or later listing SHALL
be refused.

<!-- trace:scenario id=g10adm.auction-listing.SC-rj8 rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-24 - Operator corrects a created listing's starting price
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing with starting price 100000 minor units `USD`
- **WHEN** an authorized operator sets starting price to 150000 minor units
- **THEN** Grade10 stores 150000 minor units `USD`
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

<!-- trace:scenario id=g10adm.auction-listing.SC-rhp rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-125 - Create accepts a starting price of 0
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a no-reserve lot that opens at nothing

- **GIVEN** a draft complete except for price, in `USD`
- **WHEN** an authorized operator sets its starting price to 0 minor units and creates the listing
- **THEN** the form and the API accept the create
- **AND** the listing is created with a starting price of 0 minor units in `USD`

<!-- trace:scenario id=g10adm.auction-listing.SC-v2q rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-125a - Create with 0 and no currency stores HKD 0
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft complete except for price, with no currency chosen
- **WHEN** a create is sent to the API with a starting price of 0 minor units
- **THEN** the listing is created with a starting price of 0 minor units `USD`

<!-- trace:scenario id=g10adm.auction-listing.SC-hze rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-126 - Create refuses a negative starting price on the API
**Serves:** grade10-admin-auction-listing-US-03 - A script cannot create what the form refuses

- **GIVEN** a draft complete except for price, in `USD`
- **WHEN** a create is sent straight to the API with a starting price of -1 minor unit
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

<!-- trace:scenario id=g10adm.auction-listing.SC-zho rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-127 - An empty starting price is not stored as 0 at create
**Serves:** grade10-admin-auction-listing-US-03 - An operator who forgot the price cannot create a free lot

- **GIVEN** a draft complete except for price, in `USD`
- **WHEN** a create is sent to the API with the starting price absent, null, or an empty string
- **THEN** Grade10 refuses the create
- **AND** the draft's starting price stays empty, not 0

<!-- trace:scenario id=g10adm.auction-listing.SC-rfu rev=2 -->
#### Scenario: grade10-admin-auction-listing-SC-128 - Operator lowers a created listing's starting price to 0
**Serves:** grade10-admin-auction-listing-US-03 - Operator turns a priced lot into a no-reserve one before it goes live

- **GIVEN** a created listing with a starting price of 1000000 minor units `USD`
- **WHEN** an authorized operator sets its starting price to 0 minor units
- **THEN** Grade10 stores 0 minor units `USD`
- **AND** the listing remains created

<!-- trace:scenario id=g10adm.auction-listing.SC-fcs rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-129 - A listing starting at 0 publishes
**Serves:** grade10-admin-auction-listing-US-04 - Operator puts a no-reserve lot in front of collectors

- **GIVEN** a created listing with a starting price of 0 minor units `USD`
- **WHEN** an authorized operator publishes it now
- **THEN** the listing is published
- **AND** its slug opens the public listing

<!-- trace:scenario id=g10adm.auction-listing.SC-bcv rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-149 - Moving starts at into the past is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a draft listing whose starts at is tomorrow
- **WHEN** an operator sets starts at to a time not after now and saves
- **THEN** the admin form shows the refusal under Starts at before Save
- **AND** the API refuses the same write
- **AND** the stored starts at is unchanged

<!-- trace:scenario id=g10adm.auction-listing.SC-d7l rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-150 - Moving scheduled close at into the past is refused
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing whose scheduled close at is next week
- **WHEN** an operator sets scheduled close at to a time not after now
- **THEN** the admin form shows the refusal under Close before Save
- **AND** the API refuses the same write
- **AND** the listing remains created with its stored close

<!-- trace:scenario id=g10adm.auction-listing.SC-s0s rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-151 - A starts at left as stored saves after it passes
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a created listing whose stored starts at has passed
- **WHEN** an operator changes its title and saves without touching starts at
- **THEN** Grade10 stores the new title
- **AND** starts at is unchanged


## REMOVED Requirements

None.
