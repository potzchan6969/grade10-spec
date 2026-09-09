## Feature set

- Merchandised row
  - Card status: a card says whether it is sold out and whether it is marked down, as the listing does
  - Opens, never sells: the row leads to a product's page and offers no cart it cannot honour

## MODIFIED Requirements

### Requirement: The front door merchandises its first collection

The front door SHALL show a row of cards from the first collection the
catalogue lists — the one the grid features — titled with that collection's
own name, with a way on to the listing scoped to it. Each card SHALL carry the
card's name, its image and its price, whether the shop has sold it out, and
what it used to cost where the shop has marked it down.

The row merchandises rather than sells: a card SHALL open the product's own
page and SHALL NOT offer a way into the cart. A control a surface cannot
honour is worse than no control — it takes a collector's press and answers
with nothing.

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

#### Scenario: grade10-site-store-home-SC-21 - A card the shop has sold out

- **GIVEN** the merchandised collection leads with a card nothing is left to buy of
- **WHEN** the front door renders
- **THEN** that card is shown sold out, the way the browse listing shows one
- **AND** no way into the cart is offered on it

#### Scenario: grade10-site-store-home-SC-22 - A card the shop has marked down

- **GIVEN** a card in the row the shop prices below what it compares it at
- **WHEN** the front door renders
- **THEN** the card shows what it costs now and what it used to cost
- **AND** a card the shop has not marked down shows one price only

#### Scenario: grade10-site-store-home-SC-23 - The row does not sell

- **WHEN** a collector reads the merchandised row
- **THEN** no card offers a way into the cart
- **AND** activating a card opens that product's own page
