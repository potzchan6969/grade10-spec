## Purpose

What the Store Locator address serves: Location & Hours for Grade10's one
Hong Kong shop — map, name, street address, week hours — and how a collector
reaches Google Maps and the page from chrome and free pick-up.

The address is a public surface, so every requirement of
`grade10-site/site/crawlable-pages` binds it — its title, description, share
metadata and sitemap entry are that capability's. Exact title and description
strings remain unsettled on the PRD until Product names them; they SHALL still
be distinct from every other public surface.

## ADDED Requirements

### Requirement: Store Locator answers with Location & Hours

The site SHALL answer the Store Locator address with Location & Hours for the
Hong Kong Grade10 Store: a map of the shop, the store name, the full street
address, and the week's opening hours — in the response HTML with no script
executing.

The shop facts SHALL be:

| Fact | Value |
| --- | --- |
| Name | Hong Kong Grade10 Store |
| Address | 13 Pak Sha Road, Causeway Bay, Hong Kong |
| Hours | 11am – 9pm each day of the week |

The page SHALL NOT offer store search, a store list, distance, filters, or a
store picker.

#### Scenario: grade10-site-store-store-locator-SC-01 - The page answers whole
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** the Store Locator address is fetched and no script executes
- **THEN** the response HTML contains the Location & Hours headline, the
  store name, the street address, and the week's hours

#### Scenario: grade10-site-store-store-locator-SC-02 - One shop, not a finder
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** a collector opens Store Locator
- **THEN** the page shows the one Hong Kong shop
- **AND** nothing offers search, a store list, distance, filters, or a store
  picker

#### Scenario: grade10-site-store-store-locator-SC-03 - Store Locator names itself
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** the Store Locator address and any other public surface are compared
- **THEN** their titles differ and their meta descriptions differ

### Requirement: The map opens Google Maps

The page SHALL show a map of the Hong Kong Grade10 Store. Activating the map
SHALL open Google Maps for that shop's address. The page SHALL NOT offer a
second Get directions control beside the map.

#### Scenario: grade10-site-store-store-locator-SC-04 - Activating the map opens Maps
**Serves:** grade10-site-store-store-locator-US-02 - Collector opens Google Maps from the page

- **WHEN** a collector activates the map on Store Locator
- **THEN** Google Maps opens for Hong Kong Grade10 Store at 13 Pak Sha Road,
  Causeway Bay, Hong Kong

#### Scenario: grade10-site-store-store-locator-SC-05 - No second directions control
**Serves:** grade10-site-store-store-locator-US-02 - Collector opens Google Maps from the page

- **WHEN** a collector reads Store Locator
- **THEN** the map is the way into Google Maps
- **AND** no separate Get directions control appears beside it

### Requirement: Chrome reaches Store Locator

Once the site answers the Store Locator address, the site chrome SHALL show
Store Locator in the header and the footer, each leading to that address. While
a collector is on Store Locator, the chrome SHALL mark Store Locator as the
current surface.

#### Scenario: grade10-site-store-store-locator-SC-06 - Header reaches Store Locator
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** a collector follows Store Locator in the header
- **THEN** Store Locator renders

#### Scenario: grade10-site-store-store-locator-SC-07 - Footer reaches Store Locator
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** a collector follows Store Locator in the footer
- **THEN** Store Locator renders

#### Scenario: grade10-site-store-store-locator-SC-08 - Chrome marks Store Locator
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **GIVEN** a collector on Store Locator
- **WHEN** the header renders
- **THEN** Store Locator is marked as the current page

### Requirement: Store Locator stays usable at a narrow width

The site SHALL render Store Locator without horizontal overflow at a viewport
375 CSS pixels wide. Map, address, hours, and chrome SHALL reflow rather than
be clipped.

#### Scenario: grade10-site-store-store-locator-SC-09 - A narrow viewport
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** Store Locator renders
- **THEN** the page scrolls vertically only, with no content clipped and no
  control unreachable
