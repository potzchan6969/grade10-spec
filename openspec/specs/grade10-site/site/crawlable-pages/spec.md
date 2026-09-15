# grade10-site/site/crawlable-pages Specification

## Purpose
What a public address of the grade10 site serves before any script runs: the
page's own title, description, and content in the first response, the share
metadata a link preview reads, the directory that tells crawlers what to
fetch, and an honest status for an address the site does not answer.

A public surface is one a collector reaches with no session — today the
marketing page, the store, and the auction. Every requirement here binds each
public surface the site answers, including ones added later. The profile and
sign-in are session-shaped and out of scope throughout.

## Feature set

- Script-free first response
  - Served content: title, description, headline and static copy are in the
    first response, before any script runs
  - Script handover: scripts make the served surface interactive rather than
    re-rendering it from blank
- Per-surface identity
  - Distinct naming: each public surface carries a title and description no
    other surface carries
  - Title follows navigation: the document title becomes the destination's on
    a navigation with no page load
- Share metadata
  - Open Graph tags: a link preview reads a surface's title, description, and
    canonical address without executing scripts
- Crawler directory
  - robots.txt: permits the public surfaces and names where the sitemap lives
  - Catalogue-driven sitemap: read when fetched rather than when built, so a
    card the catalogue gains is listed with no deploy
  - Sitemap honesty: no session-gated address, no unfilled parameter, and
    every entry answers
- Honest address status
  - Deepest surface answers: an address nested under a surface answers 200 as
    the deepest surface naming it
  - Refusal with a surface: an address the site does not hold returns 404 and
    still shows the not-found surface

## Requirements
### Requirement: A public surface answers without scripts

The site SHALL answer a fetch of any public address with HTML that already
contains that surface's title, meta description, headline, and static copy,
without any script executing. Content that comes from a live service — the
store's listings, the auction's sales — MAY still arrive by script.

Once scripts run, the surface SHALL be the same one the HTML carried: the
served content stays, and the page becomes interactive without rendering from
blank.

#### Scenario: grade10-site-site-crawlable-pages-SC-01 - The marketing page answers whole
**Serves:** grade10-site-site-crawlable-pages-US-01 - Collector reads a public surface before scripts run

- **WHEN** the marketing address is fetched and no script executes
- **THEN** the response HTML contains the marketing page's title, meta
  description, headline, and its static copy

#### Scenario: grade10-site-site-crawlable-pages-SC-02 - A catalogue answers its identity
**Serves:** grade10-site-site-crawlable-pages-US-01 - Collector reads a public surface before scripts run

- **WHEN** the store or auction address is fetched and no script executes
- **THEN** the response HTML contains that surface's title, meta description,
  headline, and static copy
- **AND** the listings themselves may be absent until scripts run

#### Scenario: grade10-site-site-crawlable-pages-SC-03 - Scripts only add to the page
**Serves:** grade10-site-site-crawlable-pages-US-01 - Collector reads a public surface before scripts run

- **GIVEN** a public surface served with its content in the HTML
- **WHEN** scripts finish loading
- **THEN** the same surface is on screen with its served content still
  present, and every interactive behavior the surface specifies works

### Requirement: Each public surface names itself

Each public surface SHALL carry its own title and meta description, distinct
from every other surface's. The document title SHALL follow client-side
navigation, including a navigation the session forces.

#### Scenario: grade10-site-site-crawlable-pages-SC-04 - Two surfaces, two names
**Serves:** grade10-site-site-crawlable-pages-US-02 - Collector tells one surface from another by name

- **WHEN** any two public surfaces are compared
- **THEN** their titles differ and their meta descriptions differ

#### Scenario: grade10-site-site-crawlable-pages-SC-05 - The title follows navigation
**Serves:** grade10-site-site-crawlable-pages-US-02 - Collector tells one surface from another by name

- **GIVEN** a collector on one public surface
- **WHEN** they navigate to another without a page load
- **THEN** the document title becomes the destination's

### Requirement: A shared link unfurls

Each public surface SHALL carry Open Graph title, description, and URL
matching that surface, readable without executing scripts.

#### Scenario: grade10-site-site-crawlable-pages-SC-06 - A preview fetcher reads the surface
**Serves:** grade10-site-site-crawlable-pages-US-03 - Preview fetcher unfurls a shared link

- **WHEN** a public address is fetched and no script executes
- **THEN** the response HTML carries `og:title`, `og:description`, and
  `og:url` naming that surface and its canonical address

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

#### Scenario: grade10-site-site-crawlable-pages-SC-07 - robots points at the sitemap
**Serves:** grade10-site-site-crawlable-pages-US-04 - Crawler discovers every public address

- **WHEN** robots.txt is fetched
- **THEN** it permits crawling the public surfaces and names the sitemap's
  absolute URL

#### Scenario: grade10-site-site-crawlable-pages-SC-08 - The sitemap is exact
**Serves:** grade10-site-site-crawlable-pages-US-04 - Crawler discovers every public address

- **WHEN** the sitemap is fetched
- **THEN** it lists every public surface the build writes a document for, and
  every card and lot the catalogue holds, each as an absolute URL of the
  serving environment
- **AND** neither the profile nor sign-in appears

#### Scenario: grade10-site-site-crawlable-pages-SC-09 - The sitemap names no pattern
**Serves:** grade10-site-site-crawlable-pages-US-04 - Crawler discovers every public address

- **WHEN** the sitemap is fetched
- **THEN** every entry is an address a collector can fetch
- **AND** none of them carries an unfilled parameter in place of a card or a
  lot

#### Scenario: grade10-site-site-crawlable-pages-SC-10 - The catalogue decides what is listed
**Serves:** grade10-site-site-crawlable-pages-US-04 - Crawler discovers every public address

- **GIVEN** a card the catalogue did not hold when the site was built
- **WHEN** the sitemap is fetched after the catalogue gains it
- **THEN** that card's address appears, with no deploy in between

#### Scenario: grade10-site-site-crawlable-pages-SC-11 - Every listed address answers
**Serves:** grade10-site-site-crawlable-pages-US-04 - Crawler discovers every public address

- **WHEN** each address the sitemap names is fetched
- **THEN** each response has status 200

### Requirement: An address answers with its true status

An address nested under a public surface SHALL answer with status 200 and
that surface's identity, unless a nested surface names that address, in which
case it answers as the nested surface — the deepest surface naming an address
is the one that answers it. A surface whose address names something the site
holds SHALL answer 404 when it holds no such thing. An address the site does
not answer SHALL return status 404, while still showing the site's not-found
surface to a collector.

#### Scenario: grade10-site-site-crawlable-pages-SC-12 - A nested address belongs to its surface
**Serves:** grade10-site-site-crawlable-pages-US-05 - Collector opens an address the site may not hold

- **WHEN** an address beneath the store — one no surface of its own names — is
  fetched
- **THEN** the response has status 200 and carries the store's identity

#### Scenario: grade10-site-site-crawlable-pages-SC-13 - A nested surface answers for itself
**Serves:** grade10-site-site-crawlable-pages-US-05 - Collector opens an address the site may not hold

- **WHEN** an address beneath the auction that a lot surface names — a mailed
  lot link — is fetched
- **THEN** the response has status 200 and carries that lot's identity, not
  the auction's

#### Scenario: grade10-site-site-crawlable-pages-SC-14 - A surface refuses an address of its own
**Serves:** grade10-site-site-crawlable-pages-US-05 - Collector opens an address the site may not hold

- **WHEN** an address beneath a surface that names one thing is fetched, and
  the site holds no such thing
- **THEN** the response has status 404
- **AND** a collector opening it still sees the site's not-found surface

#### Scenario: grade10-site-site-crawlable-pages-SC-15 - An unknown address is refused honestly
**Serves:** grade10-site-site-crawlable-pages-US-05 - Collector opens an address the site may not hold

- **WHEN** an address under no surface the site answers is fetched
- **THEN** the response has status 404
- **AND** a collector opening it still sees the site's not-found surface

