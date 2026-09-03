# grade10-site/store/product-page Specification

## Purpose
What one card's address serves: the card's own page, in the response before
any script runs, and the refusal when the catalogue holds no such card.

A product address names one card by its handle — the key the catalogue
already addresses a product by. Every requirement of
`grade10-site/site/crawlable-pages` binds it — it is a public surface, so its
title, description, share metadata and sitemap entry are that capability's,
per card rather than per page.

## Feature set

- Card page
  - Server-rendered card: name, description and every variant's price in the
    response HTML before any script runs
  - One address, one card: two product addresses answer with their own card,
    title and share metadata
- Unknown handles
  - Catalogue decides: whether a handle is a card is asked of the catalogue
    when the address is asked for
  - Not-found refusal: an address naming no card answers 404 and the site's
    not-found surface, never an empty page
- Reaching a card
  - Grid entry: the storefront opens a card's own address from that card,
    without a page load
  - Sitemap honesty: the sitemap lists only addresses a collector can fetch,
    never an unfilled pattern
- Buying from the page
  - Variant choice: the page opens on the variant it prices and adds whichever
    one the collector chose
  - Add in place: the collector stays on that card and what the site says the
    cart holds accounts for the add
  - One line per variant: adding the same variant again carries the quantity on
    one line
- Sold-out cards
  - Per-variant availability: each variant reads as for sale or sold out on its
    own, and only the ones for sale can be added
  - Priced but unbuyable: a card nobody can buy keeps its prices and offers
    nothing to press

## Requirements
### Requirement: A card answers at its own address

The site SHALL answer a product address with that card's page: its name, its
description, what each variant it lists costs, and which of them can be
bought — in the response HTML without any script executing.

Two product addresses SHALL answer with their own card — the page a collector
reads is the one the address names, not the catalogue it came from.

#### Scenario: product-page-SC-01 - A card answers whole

- **WHEN** a product address is fetched and no script executes
- **THEN** the response HTML contains that card's name, its description, and
  a price for every variant it lists

#### Scenario: product-page-SC-02 - Two cards, two pages

- **WHEN** two product addresses are fetched
- **THEN** each response carries its own card's name and price, and its own
  title, meta description and `og:url`

### Requirement: An address that names no card is refused

The catalogue SHALL be what decides whether a handle is a card, asked when the
address is asked for. An address under the store's products that names no
card in the catalogue SHALL answer with status 404 and the site's not-found
surface, never an empty product page.

#### Scenario: product-page-SC-03 - A handle the catalogue has nothing for

- **WHEN** an address under the store's products naming no card is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: product-page-SC-04 - A card added to the catalogue answers

- **GIVEN** a card the catalogue holds
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that card's page

### Requirement: A card is reached from the storefront

The storefront SHALL open a card's own address from that card in the grid,
without a page load.

The sitemap lists the surfaces the build writes a document for, and a card is
not one of them: which addresses the catalogue answers is not known when the
site is built. It SHALL never list an address carrying an unfilled parameter
in place of them.

#### Scenario: product-page-SC-05 - A card is opened from the grid

- **GIVEN** a collector on the storefront
- **WHEN** they open a card in the grid
- **THEN** that card's address is what they are on, showing that card's page

#### Scenario: product-page-SC-06 - The sitemap names no pattern

- **WHEN** the sitemap is fetched
- **THEN** every entry is an address a collector can fetch
- **AND** none of them carries an unfilled parameter

### Requirement: A card is added to the cart from its own page

A card's page SHALL let a collector add a variant it lists to the storefront's
cart, without leaving the page and without returning to the grid.

The page SHALL open with the variant it prices already chosen, so a card
listing one thing to buy needs no choice made. A collector SHALL be able to
choose any other variant the page lists, and what is added SHALL be the one
chosen — never whichever the catalogue listed first.

After a card is added the collector SHALL still be on that card, and what the
site says the cart holds SHALL account for what was added.

#### Scenario: product-page-SC-07 - A collector adds the grade they chose

- **GIVEN** a card whose page lists more than one variant for sale
- **WHEN** a collector chooses one that is not the one the page opened with,
  and adds it
- **THEN** the cart holds that variant, and not the one the page opened with

#### Scenario: product-page-SC-08 - A card with one thing to buy needs no choice

- **GIVEN** a card whose page lists one variant for sale
- **WHEN** a collector adds it without choosing anything
- **THEN** the cart holds that variant

#### Scenario: product-page-SC-09 - The collector keeps their place

- **WHEN** a collector adds a card from its page
- **THEN** they are still on that card's address, reading that card
- **AND** what the site says the cart holds has changed to account for it

#### Scenario: product-page-SC-10 - The same card twice

- **GIVEN** a collector who has already added a variant from a card's page
- **WHEN** they add the same variant again
- **THEN** the cart holds the quantity they added, as one line rather than two

### Requirement: A card nobody can buy says so where the buying happens

A card the catalogue lists with nothing for sale SHALL say so on its page, in
the place a collector would otherwise buy from. It SHALL NOT show a control
that cannot be used, and it SHALL NOT hide the price it lists — a sold-out
card still costs what it costs, and a page with nothing where the buying goes
reads as a page that failed rather than a card that sold.

A card listing some variants for sale and others not SHALL offer the ones for
sale and refuse the ones not, each said per variant. A variant that cannot be
bought SHALL NOT become what is added by being chosen.

#### Scenario: product-page-SC-11 - Nothing on the card is for sale

- **GIVEN** a card the catalogue lists with no variant for sale
- **WHEN** a collector opens its page
- **THEN** the page says the card cannot be bought
- **AND** every variant it lists is still priced
- **AND** there is nothing to press that would add it

#### Scenario: product-page-SC-12 - One grade sold, another still for sale

- **GIVEN** a card listing one variant for sale and one sold out
- **WHEN** a collector opens its page
- **THEN** each variant reads as for sale or sold out on its own
- **AND** adding is offered for the one for sale
- **AND** choosing the sold-out one offers no add

