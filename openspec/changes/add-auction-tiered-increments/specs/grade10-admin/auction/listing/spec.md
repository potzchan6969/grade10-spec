# Admin listing — delta

## MODIFIED Requirements

### Requirement: Operator saves a listing as a draft

An authorized operator SHALL save an Auction listing as a draft from the
Grade10 auction admin section without filling every field. A successful draft
save SHALL persist the listing in `draft` and, on the first save, SHALL mint
a new auctionable unit that has no other live listing.

A draft SHALL allow every required field to be empty. Saving a draft SHALL
NOT refuse a missing title, slug, starting price, increment table, starts
at, scheduled close at, or media. A field the operator does send SHALL still
match that field's shape (a starting price that is present MUST be integer
minor units greater than zero; a slug that is present MUST be lower-case
words joined by hyphens; an increment table that is present MUST be valid
under `grade10-site/auction/bid-increments`).

A draft listing SHALL NOT be visible on the public catalogue.

A draft save from an operator who is not authorized to set an auction's
prices and window SHALL be refused.

#### Scenario: admin-listing-SC-01 - Operator saves an empty draft

- **GIVEN** an authorized operator on the Grade10 auction listings section
- **WHEN** they save a new listing with no title, no prices, and no window
- **THEN** Grade10 persists a draft listing with those fields empty
- **AND** the listing is absent from the public catalogue

#### Scenario: admin-listing-SC-02 - Operator saves a partial draft

- **GIVEN** an authorized operator
- **WHEN** they save a draft with a title and no starting price
- **THEN** Grade10 persists the title
- **AND** the listing remains a draft
- **AND** starting price stays empty

#### Scenario: admin-listing-SC-03 - Draft rejects a malformed price

- **GIVEN** a draft listing
- **WHEN** an operator sets starting price to a non-positive or non-integer
  amount
- **THEN** Grade10 refuses the write
- **AND** starting price is unchanged

#### Scenario: admin-listing-SC-04 - Draft rejects a malformed slug

- **GIVEN** a draft listing
- **WHEN** an operator sets slug to `Charizard PSA 9`
- **THEN** Grade10 refuses the write
- **AND** the slug is unchanged

#### Scenario: admin-listing-SC-05 - Unauthorized draft save is refused

- **GIVEN** a signed-in operator who may not set an auction's prices and window
- **WHEN** they save a new draft
- **THEN** Grade10 refuses the save
- **AND** it persists no listing

### Requirement: Create validates required fields on the form and the API

An authorized operator SHALL create a `draft` listing. Create is the
validation gate: it SHALL succeed only when every required field is present
and valid. A successful create SHALL move the listing to `created`. The
listing SHALL still be absent from the public catalogue.

Required at create:

- **Title** — trimmed, 1 to 200 characters
- **Slug** — trimmed, 1 to 64 characters, lower-case words joined by hyphens
  (`charizard-psa-9`). Unique among listings that currently hold a slug.
- **Starting price** — integer minor units greater than zero
- **Starts at** — the scheduled bidding open
- **Scheduled close at** — after starts at, and after the moment of create
- **Media** — at least one and at most eight images or videos

Optional fields, when omitted at create, take these defaults: currency
`HKD`; **increment table** — Grade10's house default table for the listing's
currency, copied onto the listing per `grade10-site/auction/bid-increments`;
sort index `0`; copy empty; no sale; no categories; extension window and extension
duration both `0` (extension off); no extension cap; no publish at; sandbox
`false`.

An increment table the operator does supply at create MUST be valid under
`grade10-site/auction/bid-increments`; an invalid one SHALL refuse the create.

The admin form SHALL prevent submitting create while a required field is
empty or invalid, and SHALL name the fields that fail. The API SHALL refuse
the same create independently of the form. A created listing SHALL reject a
later write that leaves a required field empty or invalid.

Create of a listing that is not `draft` SHALL be refused. Create from an
operator who is not authorized to set an auction's prices and window SHALL
be refused.

#### Scenario: admin-listing-SC-06 - Operator creates a filled draft

- **GIVEN** a draft listing with a title, slug `charizard-psa-9`, a starting
  price of 100000 minor units, no increment table of its own, currency
  `HKD`, a start in the future, a scheduled close at after that start, and
  one JPEG
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 moves it to `created`
- **AND** the listing holds Grade10's house default `HKD` increment table
- **AND** the listing is still absent from the public catalogue

#### Scenario: admin-listing-SC-07 - Create without a title is refused on the form and the API

- **GIVEN** a draft listing with no title and every other required field set
- **WHEN** the operator submits create
- **THEN** the admin form does not send create and names title as missing
- **AND** a create sent to the API without a title is refused
- **AND** the listing remains a draft

#### Scenario: admin-listing-SC-08 - Create without a slug is refused

- **GIVEN** a draft listing with every required field set except slug
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: admin-listing-SC-09 - Create without a starting price is refused

- **GIVEN** a draft listing with a title, a window, and no starting price
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: admin-listing-SC-10 - Create without media is refused

- **GIVEN** a draft listing with every required field set except media
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: admin-listing-SC-11 - Created listing cannot clear a required field

- **GIVEN** a created listing with a title
- **WHEN** an operator clears the title
- **THEN** Grade10 refuses the write
- **AND** the title is unchanged

#### Scenario: admin-listing-SC-12 - Create of a published listing is refused

- **GIVEN** a published listing
- **WHEN** an operator creates it
- **THEN** Grade10 refuses the create
- **AND** the listing remains published

### Requirement: Prices and window are writable before publish

While a listing is `draft` or `created`, an authorized operator SHALL be able
to set:

- **Currency** — an ISO 4217 three-letter code. Empty on draft is allowed.
  Omitted at create SHALL store Grade10's store currency (`HKD`).
- **Starting price** — integer minor units greater than zero when set. Empty
  is allowed only while `draft`.
- **Increment table** — the listing's own tiers, each a start amount and an
  increment in integer minor units, valid under
  `grade10-site/auction/bid-increments`. An operator MAY change any tier's range
  or increment, add a tier, or remove one. Empty is allowed only while
  `draft`; omitted at create it takes the house default for the listing's
  currency.
- **Starts at** — the scheduled bidding open. Empty is allowed only while
  `draft`.
- **Scheduled close at** — the published close. Empty is allowed only while
  `draft`. When both starts at and scheduled close at are set, scheduled
  close at MUST be after starts at. At create, scheduled close at MUST also
  be after now.
- **Extension window (seconds)** and **Extension duration (seconds)** —
  whole numbers ≥ 0, set together or both zero (extension off). A bid
  inside the extension window of the close moves the close to now plus the
  extension duration. The extension window MUST NOT be greater than the
  extension duration. Empty on draft is allowed. Omitted at create SHALL
  store both as `0`.
- **Extension cap (seconds)** — optional whole number ≥ 0, or absent for an
  uncapped listing. The close MUST NOT move past scheduled close at plus
  this cap. A cap below the extension duration is a hard final deadline,
  not an error.

A write of any of these fields on a `published`, `closed`, `settled`, or
`canceled` listing SHALL be refused. The effective close is not an operator
field: extension writes it, and this form SHALL NOT accept it.

**Sandbox** SHALL be writable only while `draft`. A sandbox listing runs on
test-mode payment credentials instead of live money, so the house can
rehearse a sale. A write of sandbox on a `created` or later listing SHALL
be refused.

#### Scenario: admin-listing-SC-24 - Operator corrects a created listing's starting price

- **GIVEN** a created listing with starting price 100000 minor units `HKD`
- **WHEN** an authorized operator sets starting price to 150000 minor units
- **THEN** Grade10 stores 150000 minor units `HKD`
- **AND** the listing remains created

#### Scenario: admin-listing-SC-25 - Published listing refuses a price change

- **GIVEN** a published listing with starting price 100000 minor units
- **WHEN** an operator sets starting price to 150000 minor units
- **THEN** Grade10 refuses the write
- **AND** the starting price remains 100000 minor units

#### Scenario: admin-listing-SC-26 - Scheduled close at in the past is refused at create

- **GIVEN** a draft listing whose scheduled close at is not after now
- **WHEN** the operator creates the listing
- **THEN** Grade10 refuses the create
- **AND** the listing remains a draft

#### Scenario: admin-listing-SC-27 - Extension window without a duration is refused

- **GIVEN** a created listing
- **WHEN** an operator sets an extension window of 1800 seconds and an
  extension duration of 0
- **THEN** Grade10 refuses the write
- **AND** the listing's extension settings are unchanged

#### Scenario: admin-listing-SC-28 - Sandbox cannot change after create

- **GIVEN** a created listing that was drafted as sandbox
- **WHEN** an operator clears sandbox
- **THEN** Grade10 refuses the write
- **AND** the listing remains sandbox

#### Scenario: admin-listing-SC-29 - Operator tunes a created listing's increment table

- **GIVEN** a created `HKD` listing holding the house default increment table
- **WHEN** an authorized operator sets the tier starting at 20000 minor units to an increment of 5000
- **THEN** Grade10 stores the changed table on that listing
- **AND** the house default table is unchanged

#### Scenario: admin-listing-SC-30 - Published listing refuses an increment table change

- **GIVEN** a published listing holding an increment table
- **WHEN** an operator changes any tier of it
- **THEN** Grade10 refuses the write
- **AND** the listing's table is unchanged
