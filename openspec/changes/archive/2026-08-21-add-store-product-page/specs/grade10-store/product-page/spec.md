## Purpose

What one card's address serves: the card's own page, in the response before
any script runs, and the refusal when the catalogue holds no such card.

A product address names one card by its handle — the key the catalogue
already addresses a product by. Every requirement of
`grade10-site/crawlable-pages` binds it — it is a public surface, so its
title, description, share metadata and sitemap entry are that capability's,
per card rather than per page.

## ADDED Requirements

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
