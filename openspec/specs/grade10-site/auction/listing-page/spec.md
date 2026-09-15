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
- Watching a lot
  - Watch from the page: a collector marks the lot they are reading, and nothing else on the page moves
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

#### Scenario: grade10-site-auction-listing-page-SC-01 - A lot answers whole
**Serves:** grade10-site-auction-listing-page-US-01 - Collector opens a lot at its own address

- **WHEN** a lot address is fetched and no script executes
- **THEN** the response HTML contains that lot's name, its description, and
  where its bidding stands

#### Scenario: grade10-site-auction-listing-page-SC-02 - Two lots, two pages
**Serves:** grade10-site-auction-listing-page-US-01 - Collector opens a lot at its own address

- **WHEN** two lot addresses are fetched
- **THEN** each response carries its own lot's name and standing, and its own
  title, meta description and `og:url`

### Requirement: A shared lot link unfurls as the lot

A lot address SHALL carry Open Graph title, description and URL naming that
lot and its own canonical address, readable without executing scripts. A
shared lot link SHALL NOT unfurl as the auction catalogue.

#### Scenario: grade10-site-auction-listing-page-SC-03 - A preview fetcher reads a lot
**Serves:** grade10-site-auction-listing-page-US-02 - Collector shares a lot link

- **WHEN** a lot address is fetched and no script executes
- **THEN** the response carries `og:title`, `og:description` and `og:url`
  naming that lot and its own address
- **AND** none of them names the auction catalogue in its place

### Requirement: An address that names no lot is refused

The catalogue SHALL be what decides whether an id names a published lot,
asked when the address is asked for. An address under the auction's lots
naming no published lot SHALL answer with status 404 and the site's not-found
surface, never an empty lot page and never the catalogue.

#### Scenario: grade10-site-auction-listing-page-SC-04 - An id the catalogue publishes no lot for
**Serves:** grade10-site-auction-listing-page-US-03 - Collector opens an address that names no lot

- **WHEN** an address under the auction's lots naming no published lot is
  fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: grade10-site-auction-listing-page-SC-05 - A lot the catalogue publishes answers
**Serves:** `grade10-site-auction-listing-page-US-01`, `grade10-site-auction-listing-page-US-03` - a lot the catalogue publishes answers

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

#### Scenario: grade10-site-auction-listing-page-SC-06 - The served lot stays on screen
**Serves:** grade10-site-auction-listing-page-US-04 - Collector reads a live lot while scripts load

- **GIVEN** a lot address served with that lot in the document
- **WHEN** scripts finish loading
- **THEN** the same lot is on screen with its served name, description and
  standing still present
- **AND** none of them is replaced by a loading placeholder

#### Scenario: grade10-site-auction-listing-page-SC-07 - A value that follows the clock carries on
**Serves:** grade10-site-auction-listing-page-US-04 - Collector reads a live lot while scripts load

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

#### Scenario: grade10-site-auction-listing-page-SC-08 - A lot is opened from the catalogue
**Serves:** grade10-site-auction-listing-page-US-05 - Collector reaches a lot from the catalogue

- **GIVEN** a collector reading the auction catalogue
- **WHEN** they open a lot it lists
- **THEN** that lot's address is what they are on, showing that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-09 - The sitemap names no lot
**Serves:** grade10-site-auction-listing-page-US-05 - Collector reaches a lot from the catalogue

- **WHEN** the sitemap is fetched
- **THEN** no entry is a lot address
- **AND** none carries an unfilled parameter in place of one

### Requirement: A lot's page offers to watch it

A lot's page SHALL offer a signed-in collector a control that watches and
unwatches that lot, and SHALL show whether they currently watch it. The
control SHALL act on the lot the address names and no other.

Watching from this page SHALL NOT navigate away from the lot, and SHALL NOT
change the lot's bidding standing, its close, or anything else the page
carries.

What a watch is, who may hold one, how many, and where watched lots are read
belong to `grade10-site/auction/account-record`.

Scenario ids in this capability start at `grade10-site-auction-listing-page-SC-10`: the nine
scenarios this capability already carries were written before ids were
required, and `grade10-site-auction-listing-page-SC-01` through `grade10-site-auction-listing-page-SC-09` are reserved
for them.

#### Scenario: grade10-site-auction-listing-page-SC-10 - A collector watches the lot they are reading
**Serves:** Watching a lot - a collector watches the lot they are reading

- **GIVEN** a signed-in collector on a published lot's own page who does not
  watch it
- **WHEN** they use the watch control
- **THEN** the page shows the lot as watched
- **AND** they are still on that lot's page

#### Scenario: grade10-site-auction-listing-page-SC-11 - The control acts on the addressed lot
**Serves:** Watching a lot - the control acts on the addressed lot

- **GIVEN** two published lots with their own addresses
- **WHEN** a collector watches the lot from one of those addresses
- **THEN** only the lot that address names is watched

#### Scenario: grade10-site-auction-listing-page-SC-12 - Watching changes nothing else on the page
**Serves:** Watching a lot - watching changes nothing else on the page

- **GIVEN** a signed-in collector on a live lot's page
- **WHEN** they watch it
- **THEN** the lot's bidding standing and its close are unchanged
