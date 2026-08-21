## MODIFIED Requirements

### Requirement: Crawlers are told what to fetch

The site SHALL serve a robots.txt that permits the public surfaces and names
a sitemap. The sitemap SHALL list exactly the public surfaces the build writes
a document for, as absolute URLs of the environment serving it, and no
session-gated address.

A public surface whose document is rendered when its address is asked for
SHALL NOT be listed: which addresses it answers is the catalogue's to say, not
the build's. The sitemap SHALL never list an address carrying an unfilled
parameter in place of them.

#### Scenario: robots points at the sitemap

- **WHEN** robots.txt is fetched
- **THEN** it permits crawling the public surfaces and names the sitemap's
  absolute URL

#### Scenario: The sitemap is exact

- **WHEN** the sitemap is fetched
- **THEN** it lists every public surface the build writes a document for and
  nothing else, each as an absolute URL of the serving environment
- **AND** neither the profile nor sign-in appears

#### Scenario: The sitemap names no pattern

- **WHEN** the sitemap is fetched
- **THEN** every entry is an address a collector can fetch
- **AND** none of them carries an unfilled parameter in place of a card or a
  lot

### Requirement: An address answers with its true status

An address nested under a public surface SHALL answer with status 200 and
that surface's identity, unless a nested surface names that address, in which
case it answers as the nested surface — the deepest surface naming an address
is the one that answers it. A surface whose address names something the site
holds SHALL answer 404 when it holds no such thing. An address the site does
not answer SHALL return status 404, while still showing the site's not-found
surface to a collector.

#### Scenario: A nested address belongs to its surface

- **WHEN** an address beneath the store — one no surface of its own names — is
  fetched
- **THEN** the response has status 200 and carries the store's identity

#### Scenario: A nested surface answers for itself

- **WHEN** an address beneath the auction that a lot surface names — a mailed
  lot link — is fetched
- **THEN** the response has status 200 and carries that lot's identity, not
  the auction's

#### Scenario: A surface refuses an address of its own

- **WHEN** an address beneath a surface that names one thing is fetched, and
  the site holds no such thing
- **THEN** the response has status 404
- **AND** a collector opening it still sees the site's not-found surface

#### Scenario: An unknown address is refused honestly

- **WHEN** an address under no surface the site answers is fetched
- **THEN** the response has status 404
- **AND** a collector opening it still sees the site's not-found surface
