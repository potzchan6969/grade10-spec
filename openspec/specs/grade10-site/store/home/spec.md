# grade10-site/store/home Specification

## Purpose

What the store's own address serves: the marketing hero it answers with before
any script runs, the collections it offers as ways into the catalogue, the one
merchandised row of cards, and where each of them reaches.

The store address is a public surface, so every requirement of
`grade10-site/site/crawlable-pages` binds it — its title, description, share
metadata and sitemap entry are that capability's. What it says it is changes
here: the address that used to name the catalogue now names the front door.

## Feature set

- Front door
  - Marketing hero: eyebrow, headline, copy, image, and two ways on in the HTML
  - Stable address: the store address keeps answering; old links still reach it
- Collection ways in
  - Collection grid: one tile per catalogue collection, in catalogue order
  - Shop-driven: collections reach the front door by being in the shop
- Merchandised row
  - First-collection cards: a row titled with the first collection's name
  - Shop-driven lead: which collection leads follows the catalogue
- Catalogue resilience
  - Hero first: the hero renders whether or not the catalogue has answered
  - Load and retry: sections say they are loading or failed, and offer retry
- Store chrome
  - Store marked: chrome marks the store on the front door and the listing
  - Chrome destinations: store goes to the front door; all-collections to the listing

## Requirements

### Requirement: The store answers with its front door

The site SHALL answer the store address with a marketing hero: an eyebrow, a
headline, a sentence of copy, an image, and two ways on — one to the browse
listing and one to the auction. All of it SHALL be in the response HTML with
no script executing.

The store address SHALL keep answering. A collector who holds a link to it
SHALL reach this surface rather than a refusal or a redirect.

#### Scenario: grade10-site-store-home-SC-01 - The front door answers whole

- **WHEN** the store address is fetched and no script executes
- **THEN** the response HTML contains the hero's headline and its copy

#### Scenario: grade10-site-store-home-SC-02 - The store and the listing are two surfaces

- **WHEN** the store address and the browse listing's address are compared
- **THEN** their titles differ and their meta descriptions differ

#### Scenario: grade10-site-store-home-SC-03 - The hero reaches the catalogue

- **WHEN** a collector activates the hero's shopping affordance
- **THEN** the browse listing renders, unscoped

#### Scenario: grade10-site-store-home-SC-04 - The hero reaches the auction

- **WHEN** a collector activates the hero's auction affordance
- **THEN** the auction surface renders

### Requirement: The front door offers collections as ways in

The front door SHALL show a grid of tiles, one for every collection the
catalogue lists, in the order the catalogue lists them. Each tile SHALL carry
that collection's own name and its own artwork, and the first SHALL occupy the
grid's large cell.

Nothing about which collections appear, their order, or which is featured
SHALL be stated by the application: a collection is on the front door by being
in the shop, so one added there reaches the front door with no deploy.

A collection the catalogue lists without artwork SHALL still be a tile,
identified by its name, rather than being left out or shown with a gap where
the artwork goes.

#### Scenario: grade10-site-store-home-SC-05 - The grid is the shop's collections

- **WHEN** the front door renders and the catalogue lists collections
- **THEN** each is a tile, in the order the catalogue listed them, carrying
  that collection's name and artwork
- **AND** the first occupies the large cell

#### Scenario: grade10-site-store-home-SC-06 - A collection added to the shop

- **GIVEN** a collection the catalogue did not list before
- **WHEN** the catalogue lists it and the front door renders
- **THEN** it is a tile, with no application change

#### Scenario: grade10-site-store-home-SC-07 - A collection with no artwork

- **GIVEN** the catalogue lists a collection carrying no artwork
- **WHEN** the front door renders
- **THEN** that tile renders and names the collection

#### Scenario: grade10-site-store-home-SC-08 - Nothing to offer

- **WHEN** the catalogue lists no collections at all
- **THEN** neither the grid nor its heading is on the page, and the rest of
  the surface renders

#### Scenario: grade10-site-store-home-SC-09 - A tile opens its collection

- **WHEN** a collector activates a collection tile
- **THEN** the browse listing renders, scoped to that collection

### Requirement: The front door merchandises its first collection

The front door SHALL show a row of cards from the first collection the
catalogue lists — the one the grid features — titled with that collection's
own name, with a way on to the listing scoped to it. Each card SHALL carry the
card's name, its image and its price.

Which collection this is SHALL follow the catalogue rather than the
application, so the shop decides what the front door leads with by deciding
what it lists first.

The row SHALL be absent — heading and all — when the catalogue lists no
collections or that collection holds no cards, rather than rendering a titled
empty row.

#### Scenario: grade10-site-store-home-SC-10 - The row is the first collection's cards

- **WHEN** the front door renders and the catalogue lists a collection holding
  cards
- **THEN** the section is titled as the catalogue names that collection, and
  its cards are that collection's, each with a name, an image and a price

#### Scenario: grade10-site-store-home-SC-11 - The row follows the shop

- **GIVEN** the catalogue lists a different collection first than it did
- **WHEN** the front door renders
- **THEN** the row is that collection's, with no application change

#### Scenario: grade10-site-store-home-SC-12 - A card opens its own page

- **WHEN** a collector activates a card in the row
- **THEN** that card's own page renders

#### Scenario: grade10-site-store-home-SC-13 - The row reaches the rest of the collection

- **WHEN** a collector activates the row's browse-all affordance
- **THEN** the browse listing renders, scoped to that collection

#### Scenario: grade10-site-store-home-SC-14 - Nothing to merchandise

- **GIVEN** the catalogue lists no collection holding cards
- **WHEN** the front door renders
- **THEN** neither the row nor its heading is on the page, and the rest of the
  surface renders

### Requirement: The front door stands without the catalogue

The hero SHALL render whether or not the catalogue answers. While a section's
read is in flight the front door SHALL say that section is loading rather than
show it empty; when a read fails it SHALL say so and offer to try again, and
trying again SHALL re-read without a page load.

#### Scenario: grade10-site-store-home-SC-15 - The hero does not wait

- **GIVEN** the catalogue has not answered
- **WHEN** the front door renders
- **THEN** the hero and its two ways on are on screen and usable

#### Scenario: grade10-site-store-home-SC-16 - A section says it is loading

- **WHEN** the collections read or the merchandised read is in flight
- **THEN** that section shows it is loading, and shows no empty grid or row

#### Scenario: grade10-site-store-home-SC-17 - A failed read can be retried

- **GIVEN** a section's read failed
- **WHEN** the collector takes the offer to try again
- **THEN** the read runs again and the section renders its result without a
  full document load

### Requirement: The chrome names the store on every store surface

The site chrome SHALL mark the store as the surface being viewed on the front
door and on the browse listing alike. Its store destination SHALL be the front
door; the destination it names for every collection SHALL be the browse
listing, unscoped.

#### Scenario: grade10-site-store-home-SC-18 - The listing is still the store

- **WHEN** a collector is on the browse listing
- **THEN** the chrome marks the store as the surface being viewed

#### Scenario: grade10-site-store-home-SC-19 - The chrome reaches the front door

- **WHEN** a collector follows the chrome's store destination
- **THEN** the front door renders

#### Scenario: grade10-site-store-home-SC-20 - The chrome reaches every collection

- **WHEN** a collector follows the chrome's all-collections destination
- **THEN** the browse listing renders, unscoped
