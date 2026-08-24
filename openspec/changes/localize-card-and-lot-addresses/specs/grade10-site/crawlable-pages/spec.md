## MODIFIED Requirements

### Requirement: Crawlers are told what to fetch

The site SHALL serve a robots.txt that permits the public surfaces and names
a sitemap. The sitemap SHALL list every public address the site answers, as
absolute URLs of the environment serving it, and no session-gated address.

A public surface whose document is rendered when its address is asked for
SHALL be listed at each address the catalogue says it answers, read when the
sitemap is fetched rather than when the site is built — so a card the
catalogue gains is listed without a deploy, and one it no longer holds stops
being listed. The sitemap SHALL never list an address carrying an unfilled
parameter in place of a card or a lot, and SHALL name no address the site
would refuse.

#### Scenario: robots points at the sitemap

- **WHEN** robots.txt is fetched
- **THEN** it permits crawling the public surfaces and names the sitemap's
  absolute URL

#### Scenario: The sitemap is exact

- **WHEN** the sitemap is fetched
- **THEN** it lists every public surface the build writes a document for, and
  every card and lot the catalogue holds, each as an absolute URL of the
  serving environment
- **AND** neither the profile nor sign-in appears

#### Scenario: The sitemap names no pattern

- **WHEN** the sitemap is fetched
- **THEN** every entry is an address a collector can fetch
- **AND** none of them carries an unfilled parameter in place of a card or a
  lot

#### Scenario: The catalogue decides what is listed

- **GIVEN** a card the catalogue did not hold when the site was built
- **WHEN** the sitemap is fetched after the catalogue gains it
- **THEN** that card's address appears, with no deploy in between

#### Scenario: Every listed address answers

- **WHEN** each address the sitemap names is fetched
- **THEN** each response has status 200
