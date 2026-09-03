# grade10-site/store/product-listing Specification

## Purpose

Where the browse listing answers, and how an address narrows it to one
collection — so a way into the catalogue can be linked to, shared and
bookmarked rather than clicked into.

The listing is a public surface, so every requirement of
`grade10-site/site/crawlable-pages` binds it. What the listing shows, filters and
sorts is unchanged by this capability; only its address is.

## Feature set

- Listing address
  - Own address: the listing answers beneath the store, distinct from the store
  - Own metadata: title, meta description and share metadata belong to the listing
  - Crawlable document: a document is written for it in every language and named in the sitemap
  - Unchanged listing: what the listing shows and does does not change with the move
- Collection in the address
  - Named collection: an address naming a collection the catalogue carries opens already narrowed
  - No collection: an address naming none lists the whole catalogue
  - Unknown collection: an address naming a collection the catalogue has nothing for lists the whole catalogue as itself
  - Same document: which collection is named does not change which document the address serves
  - Page narrowing: narrowing from within the page writes that collection into the address
  - Back restores: going back returns the listing to the previous narrowing

## Requirements

### Requirement: The browse listing answers at its own address

The browse listing SHALL answer at an address of its own beneath the store,
distinct from the store's own address, and SHALL carry its own title, meta
description and share metadata there. It SHALL be one of the surfaces the
build writes a document for, in every language the site answers, and SHALL
appear in the sitemap as such.

Nothing the listing shows or does SHALL change with the move.

#### Scenario: product-listing-SC-01 - The listing answers at its address

- **WHEN** the browse listing's address is fetched and no script executes
- **THEN** the response HTML contains the listing's title, meta description
  and static copy

#### Scenario: product-listing-SC-02 - The listing is offered to crawlers

- **WHEN** the sitemap is fetched
- **THEN** it names the browse listing's address in every language the site
  answers, beside the store's own

### Requirement: An address can scope the listing to one collection

The listing SHALL read the collection to scope itself to from the address it
was opened at, and SHALL render narrowed to that collection without the
collector touching a control. An address naming no collection SHALL render the
whole catalogue.

Which collection an address names SHALL NOT change which document the address
serves: the cards themselves already arrive by script, and a collection is a
narrowing of the listing rather than a surface of its own.

An address naming a collection the catalogue has nothing for SHALL render the
whole catalogue rather than an empty listing or a refusal, since a collection
is a way of narrowing what is listed and not a surface of its own.

Narrowing the listing from within the page SHALL be reflected in the address,
so the collector can link to what they are looking at, and going back SHALL
return the listing to the previous narrowing.

#### Scenario: product-listing-SC-03 - An address opens the listing narrowed

- **WHEN** a collector opens the listing at an address naming a collection the
  catalogue carries
- **THEN** the listing renders showing that collection's cards, with that
  collection shown as the narrowing in force

#### Scenario: product-listing-SC-04 - No collection named

- **WHEN** a collector opens the listing at an address naming no collection
- **THEN** the whole catalogue is listed

#### Scenario: product-listing-SC-05 - A collection the catalogue has nothing for

- **WHEN** a collector opens the listing at an address naming a collection the
  catalogue has nothing for
- **THEN** the whole catalogue is listed and the surface answers as itself,
  not as not-found

#### Scenario: product-listing-SC-06 - Narrowing in the page is linkable

- **GIVEN** a collector on the unscoped listing
- **WHEN** they narrow it to one collection from within the page
- **THEN** the address becomes one naming that collection, and opening that
  address afresh renders the same narrowing

#### Scenario: product-listing-SC-07 - Back undoes a narrowing

- **GIVEN** a collector who narrowed the listing to a collection from within
  the page
- **WHEN** they go back
- **THEN** the listing is unscoped again
