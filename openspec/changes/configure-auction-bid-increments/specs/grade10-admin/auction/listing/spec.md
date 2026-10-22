# grade10-admin/auction/listing Specification

## Purpose

Lets an authorized Grade10 operator draft, create, and publish an Auction
listing — incomplete saves first, required fields enforced at create, publish
now or at a future scheduled time — with an ordered gallery of one to eight
images or videos from product assets or direct uploads, frozen when saved,
chosen for the selected physical unit with deliberate cross-Cert additions,
call one off while it has not closed, and get a lot's stock back, with a
one-step Relist, when its listing closes with no winner. Named image sizes and
optional alt live in `grade10-site/auction/listing-media`. An operator also writes a listing's title and description in English, Traditional Chinese and Simplified Chinese, reads each back on the detail page, and finds a listing by a title in any language.

## Feature set

- Prices and window
  - Whole-dollar starting price: a draft save, a create and an update of a starting price with cents are refused on the form and the API, naming the rule; a starting price already stored with cents is not rewritten

## MODIFIED Requirements

### Requirement: Prices and window are writable before publish

While a listing is `draft` or `created`, an authorized operator SHALL be able
to set:

- **Currency** — `USD`, the only value accepted. Omitted at create SHALL store
  `USD`. Any other value SHALL be refused on the form and on the API.
- **Starting price** — a whole-dollar amount in integer minor units, 0 or
  greater, when set: a multiple of one major unit of `USD`, taken from the USD
  exponent of the money module. A starting price with cents SHALL be refused on
  the form and on the API, on a draft save, a create and an update, naming the
  whole-dollar rule, and the listing SHALL stay unchanged. 0 is a set starting
  price and satisfies create; it is not an empty one. Empty is allowed only
  while `draft`. A starting price already stored with cents is not rewritten
  by this rule.
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

<!-- trace:scenario id=g10adm.auction-listing.SC-qd4 rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-221 - A draft save refuses a starting price with cents
**Serves:** grade10-admin-auction-listing-US-01 - Operator saves an unfinished listing and comes back to it

- **GIVEN** a draft listing in `USD` with a starting price of S minor units, a whole-dollar amount
- **WHEN** an authorized operator saves it with a starting price of S plus one minor unit, on the form and then straight to the API
- **THEN** Grade10 refuses each write and names the whole-dollar rule
- **AND** the listing remains a draft with a starting price of S minor units

<!-- trace:scenario id=g10adm.auction-listing.SC-h3z rev=1 -->
#### Scenario: grade10-admin-auction-listing-SC-222 - A create or an update refuses a starting price with cents
**Serves:** grade10-admin-auction-listing-US-03 - Operator creates a listing that is ready to sell

- **GIVEN** a complete draft in `USD`, and a created listing with a starting price of S minor units, a whole-dollar amount
- **WHEN** an authorized operator creates the draft with a starting price of S plus one minor unit, and then sets the created listing's starting price to S plus one minor unit
- **THEN** Grade10 refuses each write and names the whole-dollar rule
- **AND** the draft is not created, and the created listing keeps a starting price of S minor units
