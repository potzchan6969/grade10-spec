# grade10-site/store/store-locator Specification

## Purpose

What the Store Locator address serves: Location & Hours for Grade10's one
Hong Kong shop — map, name, street address and week hours — how a collector
reaches it from the chrome and from free pick-up, and how they reach Google
Maps from it.

The address is a public surface, so every requirement of
`grade10-site/site/crawlable-pages` binds it — its title, description, share
metadata and sitemap entry are that capability's. Which builds answer it is
`grade10-site/site/carried-surfaces`'s: it is carried with the store. Like
every grade10 address it carries the language prefix `shared/localization`
sets.

## Feature set

- Location & Hours
  - Supplied shop: the one Hong Kong shop's map, name, street address and week
    hours in the response, visible before any script runs
  - Brand copy: the heading and the store name are the brand's words in the
    collector's language; the name is the free pick-up claim's
  - Not a finder: no search, store list, distance, filter or store picker
  - Its own title: title and description differ from Store home, the listing
    and Product Details
- Map to Maps
  - One link: activating the map opens Google Maps for the shop's address in a
    new tab
  - No second control: no Get directions control beside the map
- Chrome reach
  - Header: Store Locator sits directly before Help, which ends the primary
    nav
  - Footer: Store Locator is the first link of the Help column, ahead of Docs
  - Current marking: the header marks Store Locator while the collector is on
    it
  - Carried with the store: a build without the store names no Store Locator
    in its header, its footer or its sitemap
- Narrow width
  - 375 CSS pixels: the page scrolls only vertically, and map, address, hours
    and chrome reflow rather than clip

## ADDED Requirements

### Requirement: Store Locator answers with Location & Hours

The page shows one shop's map, name, address and hours, and nothing that
finds a store.

**Location & Hours** - The site SHALL answer the Store Locator address with
Location & Hours for the Hong Kong Grade10 Store: a heading reading Location &
Hours, a map of the shop, the store name, the full street address, and the
week's opening hours — in the response HTML with no script executing,
visible before any script runs, and never hidden again once scripts run.

**Shop facts** - The shop facts SHALL be, in English:

| Fact | Value |
| --- | --- |
| Name | Hong Kong Grade10 Store |
| Address | 13 Pak Sha Road, Causeway Bay, Hong Kong |
| Hours | 11am – 9pm, every day |

**Brand copy** - The heading and the store name SHALL be the brand's words in
the collector's language. The store name SHALL be the same words the free
pick-up claim on a product page uses in that language.

**Not a finder** - The page SHALL NOT offer store search, a store list,
distance, filters, or a store picker.

**Its own title** - Store Locator's title and meta description SHALL differ
from Store home's, the browse listing's and a product page's, as
`grade10-site/site/crawlable-pages` binds every public surface.

<!-- trace:scenario id=g10.store-store-locator.SC-ny2 rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-01 - The page answers whole
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** the Store Locator address is fetched and no script executes
- **THEN** the response HTML contains the Location & Hours heading, the map,
  the store name, the street address, and the week's hours
- **AND** each of them is visible on the page with no script having run

<!-- trace:scenario id=g10.store-store-locator.SC-evn rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-11 - Scripts keep the page whole
**Serves:** grade10-site-store-store-locator-US-01 - the collector whose browser runs scripts sees no blank moment once the shop has shown

- **GIVEN** a collector whose browser runs scripts
- **WHEN** Store Locator loads and its scripts start
- **THEN** the map, the store name, the address and the hours, once shown,
  stay shown throughout

<!-- trace:scenario id=g10.store-store-locator.SC-t9d rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-02 - One shop, not a finder
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** a collector opens Store Locator
- **THEN** the page shows the one Hong Kong shop
- **AND** nothing offers search, a store list, distance, filters, or a store
  picker

<!-- trace:scenario id=g10.store-store-locator.SC-vb8 rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-10 - The page speaks the collector's language
**Serves:** grade10-site-store-store-locator-US-01 - the collector reading the site in Traditional Chinese meets the shop under the name the free pick-up claim gave it

- **GIVEN** a collector reading the site in Traditional Chinese
- **WHEN** they open Store Locator
- **THEN** the heading and the store name are the brand's Traditional Chinese
  words
- **AND** the store name reads exactly as the free pick-up claim on a product
  page reads in Traditional Chinese

<!-- trace:scenario id=g10.store-store-locator.SC-la1 rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-03 - Store Locator names itself
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **WHEN** the Store Locator address is compared with Store home, the browse
  listing and a product's page
- **THEN** its title differs from each of theirs, and so does its meta
  description

### Requirement: The map opens Google Maps

The map is the one way into Google Maps.

**Map** - The page SHALL show a map of the Hong Kong Grade10 Store. Activating
the map SHALL open Google Maps for that shop's address in a new tab, with no
script having run and whether or not the embedded map has loaded.

**No second control** - The page SHALL NOT offer a second Get directions
control beside the map.

<!-- trace:scenario id=g10.store-store-locator.SC-gk9 rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-04 - Activating the map opens Maps
**Serves:** grade10-site-store-store-locator-US-02 - Collector opens Google Maps from the page

- **WHEN** a collector activates the map on Store Locator
- **THEN** Google Maps opens in a new tab at 13 Pak Sha Road, Causeway Bay,
  Hong Kong

<!-- trace:scenario id=g10.store-store-locator.SC-ca5 rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-12 - The map opens Maps with no script
**Serves:** grade10-site-store-store-locator-US-02 - the collector whose scripts are off or not yet loaded still reaches Google Maps from the map

- **GIVEN** a collector whose browser runs no script
- **WHEN** they activate the map on Store Locator
- **THEN** Google Maps opens in a new tab for the shop's address

<!-- trace:scenario id=g10.store-store-locator.SC-91n rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-13 - The map opens Maps when Google's map does not load
**Serves:** grade10-site-store-store-locator-US-02 - the collector whose embedded map never loads still reaches Google Maps from its place

- **GIVEN** a collector on Store Locator whose embedded map does not load
- **WHEN** they activate the map's place
- **THEN** Google Maps opens in a new tab for the shop's address

<!-- trace:scenario id=g10.store-store-locator.SC-w6y rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-05 - No second directions control
**Serves:** grade10-site-store-store-locator-US-02 - Collector opens Google Maps from the page

- **WHEN** a collector reads Store Locator
- **THEN** the map is the way into Google Maps
- **AND** no separate Get directions control appears beside it

### Requirement: Chrome reaches Store Locator

Wherever the build carries Store Locator, the site chrome SHALL show Store
Locator in the header and the footer, each leading to that address. While a
collector is on Store Locator, the header SHALL mark Store Locator as the
current surface.

**Placement** - In the header, Store Locator SHALL sit directly before Help,
which ends the primary nav. In the footer, it SHALL be the first link of the
Help column, ahead of Docs.

<!-- trace:scenario id=g10.store-store-locator.SC-ux5 rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-06 - Header reaches Store Locator
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **GIVEN** a build that carries Store Locator
- **WHEN** a collector follows Store Locator in the header
- **THEN** Store Locator renders
- **AND** the item they followed sits directly before Help, which ends the
  primary nav

<!-- trace:scenario id=g10.store-store-locator.SC-1zq rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-07 - Footer reaches Store Locator
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **GIVEN** a build that carries Store Locator
- **WHEN** a collector follows Store Locator in the footer
- **THEN** Store Locator renders
- **AND** the link they followed is the first link of the Help column, ahead
  of Docs

<!-- trace:scenario id=g10.store-store-locator.SC-l9w rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-08 - The header marks Store Locator
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **GIVEN** a collector on Store Locator
- **WHEN** the header renders
- **THEN** Store Locator is marked as the current page
- **AND** no other navigation item is marked, Store included

### Requirement: Store Locator stays usable at a narrow width

The site SHALL render Store Locator without horizontal overflow at a viewport
375 CSS pixels wide. Map, address, hours, and chrome SHALL reflow rather than
be clipped.

<!-- trace:scenario id=g10.store-store-locator.SC-bfr rev=1 -->
#### Scenario: grade10-site-store-store-locator-SC-09 - A narrow viewport
**Serves:** grade10-site-store-store-locator-US-01 - Collector finds the Hong Kong shop from chrome

- **GIVEN** a viewport 375 CSS pixels wide
- **WHEN** Store Locator renders
- **THEN** the page scrolls vertically only, with no content clipped and no
  control unreachable
