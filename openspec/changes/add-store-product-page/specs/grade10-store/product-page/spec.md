## Purpose

What one card's address serves: the card's own page, in the response before
any script runs, and the refusal when the catalogue holds no such card.

A product address names one card by its slug. Every requirement of
`grade10-site/crawlable-pages` binds it — it is a public surface, so its
title, description, share metadata and sitemap entry are that capability's,
per card rather than per page.

## ADDED Requirements

### Requirement: A card answers at its own address

The site SHALL answer a product address with that card's page: its name, its
grade, its certificate, its price, and its description, in the response HTML
without any script executing.

Two product addresses SHALL answer with their own card — the page a collector
reads is the one the address names, not the catalogue it came from.

#### Scenario: A card answers whole

- **WHEN** a product address is fetched and no script executes
- **THEN** the response HTML contains that card's name, grade, certificate,
  price and description

#### Scenario: Two cards, two pages

- **WHEN** two product addresses are fetched
- **THEN** each response carries its own card's name and price, and its own
  title, meta description and `og:url`

### Requirement: An address that names no card is refused

The catalogue SHALL be what decides whether a slug is a card, asked when the
address is asked for. An address under the store's products that names no
card in the catalogue SHALL answer with status 404 and the site's not-found
surface, never an empty product page.

#### Scenario: A slug the catalogue has nothing for

- **WHEN** an address under the store's products naming no card is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: A card added to the catalogue answers

- **GIVEN** a card the catalogue holds
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that card's page

### Requirement: Every card is offered to a crawler

The sitemap SHALL list one address per card the catalogue holds, and no
address carrying a slug placeholder.

#### Scenario: The sitemap names the cards

- **WHEN** the sitemap is fetched
- **THEN** it lists each card's absolute address, alongside the site's other
  public surfaces
- **AND** no entry carries an unfilled parameter
