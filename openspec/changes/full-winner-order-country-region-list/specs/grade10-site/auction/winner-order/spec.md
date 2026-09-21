## Feature set

- Country or region picker
  - Complete A–Z catalogue: delivery Add Address lists every country and region, not a short designated set
  - Letter typeahead scroll: any typed letter moves the highlight to the next matching name and scrolls it into the popup
  - Field label Country/Region: the picker reads Country/Region

## ADDED Requirements

### Requirement: Delivery Add Address Country/Region picker

On Winner Order setup, delivery Add Address names the destination country or
region through a Country/Region picker.

**Label** — The field SHALL read Country/Region.

**Catalogue** — The Country/Region Select popup SHALL list every country and
region in A–Z order, not a short designated set.

**Typeahead** — While the Select popup is open, any typed letter SHALL move
the highlight to the next name that starts with that letter and SHALL scroll
that name into view in the popup.

**Empty country or region** — Confirming with Country/Region empty SHALL be
refused with a field refusal beside Country/Region, as for other empty
required address fields.

#### Scenario: winner-order-SC-174 - Delivery Add Address lists every country and region
**Serves:** winner-order-US-01 - choosing where the lot ships on delivery Add Address

- **GIVEN** a winner on Winner Order setup delivery Add Address
- **WHEN** the winner opens the Country/Region Select popup
- **THEN** the popup lists every country and region in A–Z order

#### Scenario: winner-order-SC-175 - A typed letter highlights and scrolls the next match
**Serves:** winner-order-US-01 - finding a country or region by letter on delivery Add Address

- **GIVEN** a winner with the Country/Region Select popup open on delivery Add Address
- **WHEN** the winner types a letter
- **THEN** the highlight moves to the next name that starts with that letter
- **AND** that name is scrolled into view in the popup

#### Scenario: winner-order-SC-178 - Typing the same letter again advances to the next match
**Serves:** winner-order-US-01 - stepping through same-letter countries on delivery Add Address

- **GIVEN** a winner with the Country/Region Select popup open and at least two catalogue names that start with the same letter
- **WHEN** the winner types that letter twice
- **THEN** the first press highlights the first matching name and scrolls it into view
- **AND** the second press moves the highlight to the next matching name and scrolls that name into view

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
