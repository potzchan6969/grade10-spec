## Purpose

What the store's own address serves: the marketing hero it answers with before
any script runs, the collections it offers as ways into the catalogue, the one
merchandised row of cards, and where each of them reaches.

The store address is a public surface, so every requirement of
`grade10-site/crawlable-pages` binds it — its title, description, share
metadata and sitemap entry are that capability's. What it says it is changes
here: the address that used to name the catalogue now names the front door.

## ADDED Requirements

### Requirement: The store answers with its front door

The site SHALL answer the store address with a marketing hero: an eyebrow, a
headline, a sentence of copy, an image, and two ways on — one to the browse
listing and one to the auction. All of it SHALL be in the response HTML with
no script executing.

The store address SHALL keep answering. A collector who holds a link to it
SHALL reach this surface rather than a refusal or a redirect.

#### Scenario: The front door answers whole

- **WHEN** the store address is fetched and no script executes
- **THEN** the response HTML contains the hero's headline and its copy

#### Scenario: The store and the listing are two surfaces

- **WHEN** the store address and the browse listing's address are compared
- **THEN** their titles differ and their meta descriptions differ

#### Scenario: The hero reaches the catalogue

- **WHEN** a collector activates the hero's shopping affordance
- **THEN** the browse listing renders, unscoped

#### Scenario: The hero reaches the auction

- **WHEN** a collector activates the hero's auction affordance
- **THEN** the auction surface renders

### Requirement: The front door offers collections as ways in

The front door SHALL show a grid of collection tiles, each naming one
collection and carrying an icon. Which collections appear, the order they
appear in, and which one occupies the grid's large cell SHALL be the
application's to state — the catalogue carries neither an icon nor a rank.

A collection's name SHALL come from the catalogue, so what a tile is called is
what the shop calls it.

A stated collection the catalogue does not carry SHALL be left out of the
grid rather than shown empty or named from the application's own words. When
the collection stated for the large cell is left out, the first remaining
collection SHALL take that cell, so the grid keeps its shape.

#### Scenario: The grid names the catalogue's collections

- **GIVEN** the application states an ordered set of collections for the front
  door
- **WHEN** the catalogue carries every one of them
- **THEN** each is a tile, in the stated order, labelled as the catalogue
  names it, and the stated one occupies the large cell

#### Scenario: A collection the shop no longer carries

- **GIVEN** the application states a collection the catalogue has nothing for
- **WHEN** the front door renders
- **THEN** that tile is absent and every other tile still renders

#### Scenario: The large cell is never empty

- **GIVEN** the collection stated for the large cell is one the catalogue has
  nothing for
- **WHEN** the front door renders
- **THEN** the first collection that remains occupies the large cell

#### Scenario: A tile opens its collection

- **WHEN** a collector activates a collection tile
- **THEN** the browse listing renders, scoped to that collection

### Requirement: The front door merchandises one collection

The front door SHALL show a row of cards from one collection the application
names, titled with that collection's own name from the catalogue, with a way
on to the listing scoped to it. Each card SHALL carry the card's name, its
image and its price.

The row SHALL be absent — heading and all — when the catalogue has nothing for
the named collection or the collection holds no cards, rather than rendering a
titled empty row.

#### Scenario: The row is the collection's first cards

- **GIVEN** the application names a collection to merchandise
- **WHEN** the front door renders and the catalogue carries it
- **THEN** the section is titled as the catalogue names that collection, and
  its cards are that collection's, each with a name, an image and a price

#### Scenario: A card opens its own page

- **WHEN** a collector activates a card in the row
- **THEN** that card's own page renders

#### Scenario: The row reaches the rest of the collection

- **WHEN** a collector activates the row's browse-all affordance
- **THEN** the browse listing renders, scoped to that collection

#### Scenario: Nothing to merchandise

- **GIVEN** the catalogue has nothing for the named collection
- **WHEN** the front door renders
- **THEN** neither the row nor its heading is on the page, and the rest of the
  surface renders

### Requirement: The front door stands without the catalogue

The hero SHALL render whether or not the catalogue answers. While a section's
read is in flight the front door SHALL say that section is loading rather than
show it empty; when a read fails it SHALL say so and offer to try again, and
trying again SHALL re-read without a page load.

#### Scenario: The hero does not wait

- **GIVEN** the catalogue has not answered
- **WHEN** the front door renders
- **THEN** the hero and its two ways on are on screen and usable

#### Scenario: A section says it is loading

- **WHEN** the collections read or the merchandised read is in flight
- **THEN** that section shows it is loading, and shows no empty grid or row

#### Scenario: A failed read can be retried

- **GIVEN** a section's read failed
- **WHEN** the collector takes the offer to try again
- **THEN** the read runs again and the section renders its result without a
  full document load

### Requirement: The chrome names the store on every store surface

The site chrome SHALL mark the store as the surface being viewed on the front
door and on the browse listing alike. Its store destination SHALL be the front
door; the destination it names for every collection SHALL be the browse
listing, unscoped.

#### Scenario: The listing is still the store

- **WHEN** a collector is on the browse listing
- **THEN** the chrome marks the store as the surface being viewed

#### Scenario: The chrome reaches the front door

- **WHEN** a collector follows the chrome's store destination
- **THEN** the front door renders

#### Scenario: The chrome reaches every collection

- **WHEN** a collector follows the chrome's all-collections destination
- **THEN** the browse listing renders, unscoped
