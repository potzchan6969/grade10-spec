## Purpose

What a public address of the grade10 site serves before any script runs: the
page's own title, description, and content in the first response, the share
metadata a link preview reads, the directory that tells crawlers what to
fetch, and an honest status for an address the site does not answer.

A public surface is one a collector reaches with no session — today the
marketing page, the store, and the auction. Every requirement here binds each
public surface the site answers, including ones added after this change. The
profile and sign-in are session-shaped and out of scope throughout.

## ADDED Requirements

### Requirement: A public surface answers without scripts

The site SHALL answer a fetch of any public address with HTML that already
contains that surface's title, meta description, headline, and static copy,
without any script executing. Content that comes from a live service — the
store's listings, the auction's sales — MAY still arrive by script.

Once scripts run, the surface SHALL be the same one the HTML carried: the
served content stays, and the page becomes interactive without rendering from
blank.

#### Scenario: The marketing page answers whole

- **WHEN** the marketing address is fetched and no script executes
- **THEN** the response HTML contains the marketing page's title, meta
  description, headline, and its static copy

#### Scenario: A catalogue answers its identity

- **WHEN** the store or auction address is fetched and no script executes
- **THEN** the response HTML contains that surface's title, meta description,
  headline, and static copy
- **AND** the listings themselves may be absent until scripts run

#### Scenario: Scripts only add to the page

- **GIVEN** a public surface served with its content in the HTML
- **WHEN** scripts finish loading
- **THEN** the same surface is on screen with its served content still
  present, and every interactive behavior the surface specifies works

### Requirement: Each public surface names itself

Each public surface SHALL carry its own title and meta description, distinct
from every other surface's. The document title SHALL follow client-side
navigation, including a navigation the session forces.

#### Scenario: Two surfaces, two names

- **WHEN** any two public surfaces are compared
- **THEN** their titles differ and their meta descriptions differ

#### Scenario: The title follows navigation

- **GIVEN** a collector on one public surface
- **WHEN** they navigate to another without a page load
- **THEN** the document title becomes the destination's

### Requirement: A shared link unfurls

Each public surface SHALL carry Open Graph title, description, and URL
matching that surface, readable without executing scripts.

#### Scenario: A preview fetcher reads the surface

- **WHEN** a public address is fetched and no script executes
- **THEN** the response HTML carries `og:title`, `og:description`, and
  `og:url` naming that surface and its canonical address

### Requirement: Crawlers are told what to fetch

The site SHALL serve a robots.txt that permits the public surfaces and names
a sitemap. The sitemap SHALL list exactly the public surfaces, as absolute
URLs of the environment serving it, and no session-gated address.

#### Scenario: robots points at the sitemap

- **WHEN** robots.txt is fetched
- **THEN** it permits crawling the public surfaces and names the sitemap's
  absolute URL

#### Scenario: The sitemap is exact

- **WHEN** the sitemap is fetched
- **THEN** it lists every public surface and nothing else, each as an
  absolute URL of the serving environment
- **AND** neither the profile nor sign-in appears

### Requirement: An address answers with its true status

An address nested under a public surface SHALL answer with status 200 and
that surface's identity. An address the site does not answer SHALL return
status 404, while still showing the site's not-found surface to a collector.

#### Scenario: A nested address belongs to its surface

- **WHEN** an address beneath the auction — such as a mailed lot link — is
  fetched
- **THEN** the response has status 200 and carries the auction's identity

#### Scenario: An unknown address is refused honestly

- **WHEN** an address under no surface the site answers is fetched
- **THEN** the response has status 404
- **AND** a collector opening it still sees the site's not-found surface
  inside the shell
