## Feature set

- Country or region picker
  - Complete A–Z catalogue: delivery Add Address lists every country and region, not a short designated set
  - Searchable filter: typing in Country/Region narrows the list to matching names
  - Field label Country/Region: the picker reads Country/Region

## ADDED Requirements

### Requirement: Delivery Add Address Country/Region picker

On Winner Order setup, delivery Add Address names the destination country or
region through a Country/Region picker.

**Label** — The field SHALL read Country/Region.

**Catalogue** — The Country/Region popup SHALL list every country and
region in A–Z order, not a short designated set.

**Search** — While the Country/Region picker is open, typing SHALL filter the
list to names that match the typed query.

**No match** — A typed query that matches no catalogue name SHALL leave the
list empty; confirming without a selected catalogue country or region SHALL
be refused as an empty Country/Region.

**Empty country or region** — Confirming with Country/Region empty SHALL be
refused with a field refusal beside Country/Region, as for other empty
required address fields.

#### Scenario: winner-order-SC-174 - Delivery Add Address lists every country and region
**Serves:** winner-order-US-01 - choosing where the lot ships on delivery Add Address

- **GIVEN** a winner on Winner Order setup delivery Add Address
- **WHEN** the winner opens the Country/Region picker
- **THEN** the popup lists every country and region in A–Z order

#### Scenario: winner-order-SC-175 - Typing filters the list to matching names
**Serves:** winner-order-US-01 - finding a country or region by search on delivery Add Address

- **GIVEN** a winner with the Country/Region picker open on delivery Add Address
- **WHEN** the winner types a query that matches one or more catalogue names
- **THEN** the list shows only names that match that query
- **AND** names that do not match are not shown

#### Scenario: winner-order-SC-178 - A query with no match leaves the list empty
**Serves:** winner-order-US-01 - searching for a country or region that is not in the catalogue

- **GIVEN** a winner with the Country/Region picker open on delivery Add Address
- **WHEN** the winner types a query that matches no catalogue name
- **THEN** the list shows no country or region options

#### Scenario: winner-order-SC-176 - The field reads Country/Region
**Serves:** winner-order-US-01 - naming the destination on delivery Add Address

- **WHEN** a winner is on Winner Order setup delivery Add Address
- **THEN** the picker field label reads Country/Region

#### Scenario: winner-order-SC-177 - An empty Country/Region is refused
**Serves:** winner-order-US-01 - confirming delivery Add Address without a country or region

- **GIVEN** a winner on delivery Add Address with Country/Region empty
- **WHEN** the winner confirms the address
- **THEN** Grade10 refuses applying the address
- **AND** a field refusal shows beside Country/Region
