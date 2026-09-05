# Admin listing — delta

## Feature set

- Fixed auction policy
  - Supported currencies: an operator selects USD, HKD, or JPY
  - No local override: the listing form has no minimum-increment control

## MODIFIED Requirements

### Requirement: Operator saves a listing as a draft

An authorized operator SHALL save an Auction listing as a draft without every
required field. A draft save SHALL NOT require title, slug, starting price,
currency, starts at, scheduled close at, or media. A supplied currency SHALL
be USD, HKD, or JPY; Grade10 SHALL refuse another currency and leave the draft
unchanged.

The draft form and write contract SHALL NOT offer or accept a listing-level
minimum increment.

#### Scenario: grade10-admin-auction-listing-SC-01 - Operator saves an empty draft

- **GIVEN** an authorized operator on the auction listings section
- **WHEN** they save a listing with no title, prices, or window
- **THEN** Grade10 persists a draft that is absent from the public catalogue

#### Scenario: grade10-admin-auction-listing-SC-02 - Operator saves a partial draft

- **GIVEN** an authorized operator
- **WHEN** they save a draft with a title and no starting price
- **THEN** Grade10 persists the title and leaves the listing a draft

#### Scenario: grade10-admin-auction-listing-SC-03 - Draft rejects a malformed price

- **GIVEN** a draft listing
- **WHEN** an operator sets its starting price to a non-positive or non-integer amount
- **THEN** Grade10 refuses the write and leaves the starting price unchanged

#### Scenario: grade10-admin-auction-listing-SC-04 - Draft rejects a malformed slug

- **GIVEN** a draft listing
- **WHEN** an operator sets its slug to `Charizard PSA 9`
- **THEN** Grade10 refuses the write and leaves the slug unchanged

#### Scenario: grade10-admin-auction-listing-SC-05 - Unauthorized draft save is refused

- **GIVEN** a signed-in operator without auction price-and-window permission
- **WHEN** they save a draft
- **THEN** Grade10 refuses and persists no listing

#### Scenario: grade10-admin-auction-listing-SC-56 - Draft rejects an unsupported currency

- **GIVEN** a draft listing
- **WHEN** an operator sets its currency to EUR
- **THEN** Grade10 refuses the write
- **AND** the currency is unchanged

### Requirement: Create validates required fields on the form and the API

Create SHALL require a title, slug, starting price, starts at, scheduled close
at, media, and one supported currency. When omitted, currency SHALL default to
HKD. The form and API SHALL reject an unsupported currency independently.

The form SHALL present USD, HKD, and JPY as its only currency choices and
SHALL NOT display a minimum-increment field. The selected currency's Grade10
schedule governs the listing's bid floor.

#### Scenario: grade10-admin-auction-listing-SC-06 - Operator creates a filled draft

- **GIVEN** a complete draft with currency JPY and no minimum-increment value
- **WHEN** an authorized operator creates the listing
- **THEN** Grade10 creates it
- **AND** its bid floor uses the JPY schedule

#### Scenario: grade10-admin-auction-listing-SC-07 - Create without a title is refused on the form and the API

- **GIVEN** a draft with every required field except title
- **WHEN** the operator creates it
- **THEN** the form and API refuse it and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-08 - Create without a slug is refused

- **GIVEN** a draft with every required field except slug
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-09 - Create without a starting price is refused

- **GIVEN** a draft with every required field except starting price
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-10 - Create without media is refused

- **GIVEN** a draft with every required field except media
- **WHEN** the operator creates it
- **THEN** Grade10 refuses and the listing remains a draft

#### Scenario: grade10-admin-auction-listing-SC-11 - Created listing cannot clear a required field

- **GIVEN** a created listing with a title
- **WHEN** an operator clears the title
- **THEN** Grade10 refuses and leaves the title unchanged

#### Scenario: grade10-admin-auction-listing-SC-12 - Create of a published listing is refused

- **GIVEN** a published listing
- **WHEN** an operator creates it
- **THEN** Grade10 refuses and leaves it published

#### Scenario: grade10-admin-auction-listing-SC-57 - Create refuses an unsupported currency on the form and API

- **GIVEN** a complete draft with currency EUR
- **WHEN** an operator creates the listing
- **THEN** the form prevents the request and names currency
- **AND** an API create with EUR is refused
- **AND** the listing remains a draft
