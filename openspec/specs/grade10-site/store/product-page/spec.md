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
- Held to the shop's count
  - Ceiling from the shop: the page stops a collector at what the shop has of the chosen variant
  - Silent where unknown: a shop exposing no count puts no ceiling on the page
- Said when it is news
  - Few left: the page says how many remain once the shop is nearly out
  - All of them asked for: the page says the same when the collector has taken the last one
## Requirements
### Requirement: A card answers at its own address

The site SHALL answer a product address with that card's page: its name, its
description, what each variant it lists costs, and which of them can be
bought — in the response HTML without any script executing.

Two product addresses SHALL answer with their own card — the page a collector
reads is the one the address names, not the catalogue it came from.

#### Scenario: grade10-site-store-product-page-SC-01 - A card answers whole
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** a product address is fetched and no script executes
- **THEN** the response HTML contains that card's name, its description, and
  a price for every variant it lists

#### Scenario: grade10-site-store-product-page-SC-02 - Two cards, two pages
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** two product addresses are fetched
- **THEN** each response carries its own card's name and price, and its own
  title, meta description and `og:url`

### Requirement: An address that names no card is refused

The catalogue SHALL be what decides whether a handle is a card, asked when the
address is asked for. An address under the store's products that names no
card in the catalogue SHALL answer with status 404 and the site's not-found
surface, never an empty product page.

#### Scenario: grade10-site-store-product-page-SC-03 - A handle the catalogue has nothing for
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

- **WHEN** an address under the store's products naming no card is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: grade10-site-store-product-page-SC-04 - A card added to the catalogue answers
**Serves:** grade10-site-store-product-page-US-01 - Collector reads a card at its own address

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

#### Scenario: grade10-site-store-product-page-SC-05 - A card is opened from the grid
**Serves:** grade10-site-store-product-page-US-02 - Collector opens a card from the storefront

- **GIVEN** a collector on the storefront
- **WHEN** they open a card in the grid
- **THEN** that card's address is what they are on, showing that card's page

#### Scenario: grade10-site-store-product-page-SC-06 - The sitemap names no pattern
**Serves:** grade10-site-store-product-page-US-02 - Collector opens a card from the storefront

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

#### Scenario: grade10-site-store-product-page-SC-07 - A collector adds the grade they chose
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a card whose page lists more than one variant for sale
- **WHEN** a collector chooses one that is not the one the page opened with,
  and adds it
- **THEN** the cart holds that variant, and not the one the page opened with

#### Scenario: grade10-site-store-product-page-SC-08 - A card with one thing to buy needs no choice
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **GIVEN** a card whose page lists one variant for sale
- **WHEN** a collector adds it without choosing anything
- **THEN** the cart holds that variant

#### Scenario: grade10-site-store-product-page-SC-09 - The collector keeps their place
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

- **WHEN** a collector adds a card from its page
- **THEN** they are still on that card's address, reading that card
- **AND** what the site says the cart holds has changed to account for it

#### Scenario: grade10-site-store-product-page-SC-10 - The same card twice
**Serves:** grade10-site-store-product-page-US-03 - Collector adds a variant to the cart

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

#### Scenario: grade10-site-store-product-page-SC-11 - Nothing on the card is for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a card with nothing for sale

- **GIVEN** a card the catalogue lists with no variant for sale
- **WHEN** a collector opens its page
- **THEN** the page says the card cannot be bought
- **AND** every variant it lists is still priced
- **AND** there is nothing to press that would add it

#### Scenario: grade10-site-store-product-page-SC-12 - One grade sold, another still for sale
**Serves:** grade10-site-store-product-page-US-04 - Collector meets a card with nothing for sale

- **GIVEN** a card listing one variant for sale and one sold out
- **WHEN** a collector opens its page
- **THEN** each variant reads as for sale or sold out on its own
- **AND** adding is offered for the one for sale
- **AND** choosing the sold-out one offers no add

### Requirement: A card's page holds a collector to the shop's count

The page SHALL NOT let a collector ask for more of the chosen variant than the
shop has left of it. Where the shop exposes no count for that variant, the
page SHALL put no ceiling on what a collector asks for.

The ceiling is what the shop last said, so it is advisory: the cart's own
review remains what decides a quantity, and goes on reducing a line the shop
can no longer fill.

Choosing a different variant SHALL bring that variant's ceiling with it, since
one grade of a card selling out says nothing about another.

#### Scenario: grade10-site-store-product-page-SC-19 - The page stops at what the shop has
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has three of
- **WHEN** a collector raises the quantity past three
- **THEN** the quantity stays at three

#### Scenario: grade10-site-store-product-page-SC-20 - A shop that counts nothing stops nothing
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop exposes no count for
- **WHEN** a collector raises the quantity above three
- **THEN** the quantity rises as asked

#### Scenario: grade10-site-store-product-page-SC-21 - Another grade brings its own ceiling
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card listing one variant the shop has two of and another it has ten of
- **WHEN** a collector chooses the one the shop has ten of and raises the quantity to ten
- **THEN** the quantity rises to ten

### Requirement: A card's page says how many are left when that is news

The page SHALL say how many the shop has left of the chosen variant when the
shop has three or fewer of it, and when the collector has asked for every one
there is. It SHALL say nothing about what is left at any other time.

Three or fewer is what counts as nearly out across this store, and the page
SHALL NOT hold its own number.

#### Scenario: grade10-site-store-product-page-SC-22 - Nearly out is said on the page
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has three of
- **WHEN** the page renders
- **THEN** the page says three are left

#### Scenario: grade10-site-store-product-page-SC-23 - Asking for the last one is answered
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has forty-one of
- **WHEN** a collector raises the quantity to forty-one
- **THEN** the page says forty-one are left
- **AND** the quantity does not rise past forty-one

#### Scenario: grade10-site-store-product-page-SC-24 - A well-stocked card says nothing
**Serves:** grade10-site-store-product-page-US-05 - Collector takes the last of a grade from its page

- **GIVEN** a card whose chosen variant the shop has forty-one of
- **WHEN** the page renders
- **THEN** the page says nothing about how many are left

