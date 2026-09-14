## Feature set

- One address per thing
  - One item, one address: the channel an item sells in is fixed at first
    publication, and no second channel answers with it
  - Shared identity: a seller or a shop answers at one address, the same from
    every channel
- Narrowing without a new address
  - Paths stop at the top-level category: anything narrower rides the query
  - Canonical without the narrowing: every narrowed reading names the channel's
    own address as the one to keep
- Replaced addresses
  - Permanent redirect: a replaced address sends the reader to what replaced it
  - Named nowhere: no link, no canonical tag, no sitemap entry names it

## ADDED Requirements

### Requirement: An item answers at one address

A **sales channel** is a public surface of the site that offers items for sale;
the store and the auction are the two it answers today, and every rule here
binds each channel the site answers, including ones added later.

An item offered for sale SHALL answer at exactly one public address. The
channel that offers it SHALL be fixed when the item is first published and
SHALL NOT change while it is published. An address of any other channel naming
that item SHALL answer with status 404, as an address the site does not hold.

#### Scenario: grade10-site-site-crawlable-pages-SC-16 - One item, one address

- **GIVEN** an item published to one sales channel
- **WHEN** every public address the site answers with that item is collected
- **THEN** exactly one address answers with it
- **AND** it is an address of the channel the item was published to

#### Scenario: grade10-site-site-crawlable-pages-SC-17 - Another channel does not hold it

- **GIVEN** an item published to one sales channel
- **WHEN** an address of another sales channel naming that item is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the site's not-found surface

#### Scenario: grade10-site-site-crawlable-pages-SC-18 - The sitemap names it once

- **GIVEN** an item published to one sales channel
- **WHEN** the sitemap is fetched
- **THEN** the item is named at one address per language the site answers it in
- **AND** no address of another channel names it

### Requirement: A channel's paths stop at its top-level category

A sales channel's public addresses SHALL go no deeper than its top-level
category. A narrower reading — a subcategory, a publisher, a brand, a theme, a
grade, a year, a seller's items, or the order the results are in — SHALL be
carried in the query of the channel's own address, and SHALL NOT have a path of
its own.

Every narrowed reading SHALL name the channel address without that query as its
canonical address and as its `og:url`. The sitemap SHALL name no narrowed
reading.

#### Scenario: grade10-site-site-crawlable-pages-SC-19 - A narrowing has no path of its own

- **WHEN** an address nesting a subcategory, a brand, a grade, a year, a seller
  or an order under a sales channel is fetched
- **THEN** the response carries no narrowed reading of that channel
- **AND** it answers as the deepest surface naming that address

#### Scenario: grade10-site-site-crawlable-pages-SC-20 - Two narrowings name one address to keep

- **GIVEN** two narrowings of one channel, each fetched at the channel's
  address with its own query
- **WHEN** each response is read
- **THEN** both carry the same canonical address and the same `og:url`
- **AND** that address is the channel's own, without a query

#### Scenario: grade10-site-site-crawlable-pages-SC-21 - The sitemap names no narrowing

- **WHEN** the sitemap is fetched
- **THEN** no entry carries a query

### Requirement: One identity address, shared by every channel

A person or a shop the site names — a seller among them — SHALL answer at
exactly one public address, and every sales channel SHALL link to that address.
A channel SHALL NOT answer an identity address of its own.

#### Scenario: grade10-site-site-crawlable-pages-SC-22 - A channel holds no identity address of its own

- **GIVEN** a seller the site names at its shared address
- **WHEN** an identity address nested under a sales channel naming that seller
  is fetched
- **THEN** the response has status 404
- **AND** the shared address answers that seller with status 200

### Requirement: A replaced address redirects permanently

An address the site has replaced SHALL answer with status 301 and the address
that replaced it, in one hop. The site SHALL NOT name a replaced address in a
link it renders, in a canonical or `og:url` tag, or in a sitemap entry.

#### Scenario: grade10-site-site-crawlable-pages-SC-23 - A replaced address sends the reader on

- **WHEN** an address the site has replaced is fetched
- **THEN** the response has status 301
- **AND** it names the address that replaced it
- **AND** fetching that address answers with status 200

#### Scenario: grade10-site-site-crawlable-pages-SC-24 - Nothing names a replaced address

- **WHEN** the sitemap, every rendered link, and every canonical and `og:url`
  tag the site serves are collected
- **THEN** none of them names a replaced address
