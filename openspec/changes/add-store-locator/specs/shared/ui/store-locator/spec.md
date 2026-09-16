## Purpose

The shared Location & Hours block a Store Locator page assembles between site
chrome: map, store name, street address, and week hours. Every store
application that shows this surface renders it from one component source,
supplying its own copy, shop facts, map embed, and Maps destination.

## Feature set

- Surface exports
  - Named component: `StoreLocator` and its types from the package entry
  - Props-only content: copy, shop facts, map embed and Maps destination arrive as props
- Location & Hours
  - Supplied facts: name, address lines and hours rows are displayed as given
  - One way to the map: the map is the only control that opens the Maps destination
  - Empty hours: the section is absent rather than titled and empty

## ADDED Requirements

### Requirement: The store locator surface exports

The shared UI package SHALL export, from its public entry, exactly these
names for the store locator surface — `StoreLocator` — and exactly these
types: `StoreLocatorProps`, `StoreLocatorCopy`, and `StoreLocatorHoursRow`.

`StoreLocator` SHALL take the words it renders in a single `copy` prop of
`StoreLocatorCopy`. Shop name, address lines, hours rows, map embed source,
and Maps destination SHALL reach it through props. It SHALL NOT fetch, route,
or read application stores.

#### Scenario: shared-ui-store-locator-SC-01 - An application imports the surface
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports `StoreLocator`, `StoreLocatorProps`,
  `StoreLocatorCopy`, and `StoreLocatorHoursRow` from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

### Requirement: StoreLocator shows supplied Location & Hours

`StoreLocator` SHALL display a supplied map embed, the supplied store name,
each supplied address line, and each supplied hours row (day label and hours
text). Activating the map SHALL report through a link to the supplied Maps
destination (opens in a new browsing context). The block SHALL NOT render a
separate Get directions control.

When hours rows are empty, the hours section SHALL be absent rather than
titled and empty.

#### Scenario: shared-ui-store-locator-SC-02 - Supplied shop facts render
**Serves:** Location & Hours - supplied shop facts render

- **GIVEN** a StoreLocator with name, address lines, hours rows, map embed,
  and Maps destination
- **WHEN** it renders
- **THEN** the name, each address line, and each hours row appear
- **AND** the map link uses the supplied Maps destination

#### Scenario: shared-ui-store-locator-SC-03 - No separate directions control
**Serves:** Location & Hours - no separate directions control

- **WHEN** StoreLocator renders
- **THEN** the map is the only control that opens the Maps destination
- **AND** no separate Get directions control appears

#### Scenario: shared-ui-store-locator-SC-04 - Empty hours omit the section
**Serves:** Location & Hours - empty hours omit the section

- **GIVEN** a StoreLocator with no hours rows
- **WHEN** it renders
- **THEN** no hours heading or empty hours list appears
- **AND** the name and address still appear
