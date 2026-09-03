# grade10-site/auction/listing-page Specification

## Purpose
What one lot's address serves: the lot's own page, in the response before any
script runs, what a shared link unfurls as, and the refusal when the auction
holds no such lot.

A lot address names one lot by the id the catalogue already addresses it by.
Every requirement of `grade10-site/site/crawlable-pages` binds it — it is a public
surface, so its title, description, share metadata and sitemap treatment are
that capability's, per lot rather than per page. What a bid must clear and
when a close extends stay `grade10-site/auction/auction`'s.

## Feature set

- Lot address
  - Server-rendered lot page: the lot's name, description, sale and bidding
    standing are in the response HTML before any script runs
  - One lot per address: two lot addresses answer with their own lot, their own
    title, meta description and `og:url`
- Shared link preview
  - Open Graph per lot: `og:title`, `og:description` and `og:url` name that lot
    and its own canonical address rather than the auction catalogue
- Unknown lot refusal
  - Catalogue decides: whether an id names a published lot is asked of the
    catalogue at the moment the address is asked for
  - Not-found answer: an address naming no published lot answers 404 with the
    site's not-found surface, never an empty lot page
- Live lot handover
  - Served content persists: once scripts run the same lot is on screen and
    nothing it showed is replaced by a loading placeholder
  - Clock values carry on: a value that follows the clock continues from what
    was served rather than contradicting it
- Catalogue and sitemap
  - Opened from the catalogue: the catalogue reaches a lot's own address
    without a page load
  - No lot in the sitemap: which lots the auction publishes is unknown at build
    time, so no entry is a lot address

## Requirements
### Requirement: A lot answers at its own address

The site SHALL answer a lot's address with that lot's page: its name, its
description, the sale it runs under, and where its bidding stands — in the
response HTML without any script executing.

Two lot addresses SHALL answer with their own lot — the page a collector
reads is the one the address names, not the catalogue it was reached from.

#### Scenario: listing-page-SC-01 - A lot answers whole

- **WHEN** a lot address is fetched and no script executes
- **THEN** the response HTML contains that lot's name, its description, and
  where its bidding stands

#### Scenario: listing-page-SC-02 - Two lots, two pages

- **WHEN** two lot addresses are fetched
- **THEN** each response carries its own lot's name and standing, and its own
  title, meta description and `og:url`

### Requirement: A shared lot link unfurls as the lot

A lot address SHALL carry Open Graph title, description and URL naming that
lot and its own canonical address, readable without executing scripts. A
shared lot link SHALL NOT unfurl as the auction catalogue.

#### Scenario: listing-page-SC-03 - A preview fetcher reads a lot

- **WHEN** a lot address is fetched and no script executes
- **THEN** the response carries `og:title`, `og:description` and `og:url`
  naming that lot and its own address
- **AND** none of them names the auction catalogue in its place

### Requirement: An address that names no lot is refused

The catalogue SHALL be what decides whether an id names a published lot,
asked when the address is asked for. An address under the auction's lots
naming no published lot SHALL answer with status 404 and the site's not-found
surface, never an empty lot page and never the catalogue.

#### Scenario: listing-page-SC-04 - An id the catalogue publishes no lot for

- **WHEN** an address under the auction's lots naming no published lot is
  fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: listing-page-SC-05 - A lot the catalogue publishes answers

- **GIVEN** a lot the catalogue publishes
- **WHEN** its address is fetched
- **THEN** the response has status 200 and carries that lot's page

### Requirement: A served lot becomes live without blanking

A lot is live — bids move under it, and its close approaches while it is
read. The document served for a lot SHALL carry that lot as it stood when the
response was made, and once scripts run the same lot SHALL be on screen with
its served content still present. Nothing the document showed SHALL be
replaced by a loading placeholder, and a value that follows the clock SHALL
carry on from what was served rather than disagreeing with it.

#### Scenario: listing-page-SC-06 - The served lot stays on screen

- **GIVEN** a lot address served with that lot in the document
- **WHEN** scripts finish loading
- **THEN** the same lot is on screen with its served name, description and
  standing still present
- **AND** none of them is replaced by a loading placeholder

#### Scenario: listing-page-SC-07 - A value that follows the clock carries on

- **GIVEN** a lot whose page shows how long its bidding has left
- **WHEN** scripts finish loading
- **THEN** what is on screen continues from what the document carried, rather
  than contradicting it

### Requirement: A lot is reached from the catalogue

The catalogue SHALL open a lot's own address from that lot, without a page
load.

The sitemap lists the surfaces the build writes a document for, and a lot is
not one of them: which lots the auction publishes is not known when the site
is built.

#### Scenario: listing-page-SC-08 - A lot is opened from the catalogue

- **GIVEN** a collector reading the auction catalogue
- **WHEN** they open a lot it lists
- **THEN** that lot's address is what they are on, showing that lot's page

#### Scenario: listing-page-SC-09 - The sitemap names no lot

- **WHEN** the sitemap is fetched
- **THEN** no entry is a lot address
- **AND** none carries an unfilled parameter in place of one

