# shared/ui/store-locator Specification

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
  - One way to the map: the map is one keyboard stop, named from the supplied copy, and the only control that opens the Maps destination, in a new tab

## ADDED Requirements

### Requirement: The store locator surface exports

The package exports one component and three types, and everything the
component renders arrives as props.

**Named component** - The shared UI package SHALL export, from its public
entry, exactly these names for the store locator surface — `StoreLocator` —
and exactly these types: `StoreLocatorProps`, `StoreLocatorCopy`, and
`StoreLocatorHoursRow`.

**Props-only content** - `StoreLocator` SHALL take the words it renders in a
single `copy` prop of `StoreLocatorCopy`. Shop name, address lines, hours
rows, map embed source, and Maps destination SHALL reach it through props. It
SHALL NOT fetch, route, or read application stores.

#### Scenario: shared-ui-store-locator-SC-01 - An application imports the surface
**Serves:** Surface exports - an application imports the surface

- **WHEN** an application imports `StoreLocator`, `StoreLocatorProps`,
  `StoreLocatorCopy`, and `StoreLocatorHoursRow` from the shared UI package's
  public entry
- **THEN** every import resolves
- **AND** no other component or type is exported for this surface

### Requirement: StoreLocator shows supplied Location & Hours

The block shows the facts it is given and opens the Maps destination from the
map alone.

**Supplied facts** - `StoreLocator` SHALL display a supplied map embed, the
supplied store name, each supplied address line, and each supplied hours row
(day label and hours text).

**One way to the map** - The map SHALL be one keyboard-reachable link, named
from the supplied copy, to the supplied Maps destination, opening in a new
browsing context; the embedded map itself SHALL take no focus. The block SHALL
NOT render a separate Get directions control.

**Required map** - The map embed source and the Maps destination SHALL be
required props: a `StoreLocator` missing either SHALL NOT type-check.

#### Scenario: shared-ui-store-locator-SC-02 - Supplied shop facts render
**Serves:** Location & Hours - an application passes its shop and sees it drawn as given

- **GIVEN** a StoreLocator with name, address lines, hours rows, map embed,
  and Maps destination
- **WHEN** it renders
- **THEN** the name, each address line, and each hours row appear
- **AND** the map link uses the supplied Maps destination
- **AND** no word or shop fact appears that the props did not supply

#### Scenario: shared-ui-store-locator-SC-03 - No separate directions control
**Serves:** Location & Hours - the map stays the one way to Google Maps

- **WHEN** StoreLocator renders
- **THEN** the map is the only control that opens the Maps destination
- **AND** no separate Get directions control appears

#### Scenario: shared-ui-store-locator-SC-05 - The map is one keyboard stop
**Serves:** Location & Hours - a keyboard user tabbing through the block reaches Google Maps once, by the map's own name

- **GIVEN** a StoreLocator with a map embed, a Maps destination and copy
  naming the map's link
- **WHEN** a keyboard user tabs through the block
- **THEN** focus stops once on the map, on a link named by the supplied copy
- **AND** activating it opens the supplied Maps destination in a new browsing
  context
- **AND** nothing inside the embedded map takes focus

#### Scenario: shared-ui-store-locator-SC-06 - A map with no destination does not build
**Serves:** Location & Hours - an application cannot draw a map that leads nowhere

- **WHEN** an application renders `StoreLocator` without a map embed source
  or without a Maps destination
- **THEN** its type check refuses it
