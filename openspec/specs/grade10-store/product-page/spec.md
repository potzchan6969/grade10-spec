# grade10-store/product-page Specification

## Purpose
What one card's address serves: the card's own page, in the response before
any script runs, and the refusal when the catalogue holds no such card.

A product address names one card by its handle — the key the catalogue
already addresses a product by. Every requirement of
`grade10-site/crawlable-pages` binds it — it is a public surface, so its
title, description, share metadata and sitemap entry are that capability's,
per card rather than per page.
## Requirements
### Requirement: A card answers at its own address

The site SHALL answer a product address with that card's page: its name, its
description, what each variant it lists costs, and which of them can be
bought — in the response HTML without any script executing.

Two product addresses SHALL answer with their own card — the page a collector
reads is the one the address names, not the catalogue it came from.

#### Scenario: A card answers whole

- **WHEN** a product address is fetched and no script executes
- **THEN** the response HTML contains that card's name, its description, and
  a price for every variant it lists

#### Scenario: Two cards, two pages

- **WHEN** two product addresses are fetched
- **THEN** each response carries its own card's name and price, and its own
  title, meta description and `og:url`

### Requirement: An address that names no card is refused

The catalogue SHALL be what decides whether a handle is a card, asked when the
address is asked for. An address under the store's products that names no
card in the catalogue SHALL answer with status 404 and the site's not-found
surface, never an empty product page.

#### Scenario: A handle the catalogue has nothing for

- **WHEN** an address under the store's products naming no card is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: A card added to the catalogue answers

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

#### Scenario: A card is opened from the grid

- **GIVEN** a collector on the storefront
- **WHEN** they open a card in the grid
- **THEN** that card's address is what they are on, showing that card's page

#### Scenario: The sitemap names no pattern

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

#### Scenario: A collector adds the grade they chose

- **GIVEN** a card whose page lists more than one variant for sale
- **WHEN** a collector chooses one that is not the one the page opened with,
  and adds it
- **THEN** the cart holds that variant, and not the one the page opened with

#### Scenario: A card with one thing to buy needs no choice

- **GIVEN** a card whose page lists one variant for sale
- **WHEN** a collector adds it without choosing anything
- **THEN** the cart holds that variant

#### Scenario: The collector keeps their place

- **WHEN** a collector adds a card from its page
- **THEN** they are still on that card's address, reading that card
- **AND** what the site says the cart holds has changed to account for it

#### Scenario: The same card twice

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

#### Scenario: Nothing on the card is for sale

- **GIVEN** a card the catalogue lists with no variant for sale
- **WHEN** a collector opens its page
- **THEN** the page says the card cannot be bought
- **AND** every variant it lists is still priced
- **AND** there is nothing to press that would add it

#### Scenario: One grade sold, another still for sale

- **GIVEN** a card listing one variant for sale and one sold out
- **WHEN** a collector opens its page
- **THEN** each variant reads as for sale or sold out on its own
- **AND** adding is offered for the one for sale
- **AND** choosing the sold-out one offers no add

