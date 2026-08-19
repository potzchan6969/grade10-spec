## Purpose

Where the ZZZ site answers, what becomes of the address its storefront used
to hold, and which host the platform names when it issues a ZZZ link. This
capability binds the brand's addresses; `zzz/navigation` binds what each
path beneath them resolves to.

## ADDED Requirements

### Requirement: The ZZZ site answers at the brand's base domain

ZZZ SHALL run one site, served at its registrable base domain in every
environment, under no subdomain. The brand's base domain SHALL be the one
the site registry records, so no application, route, or document carries a
ZZZ hostname of its own.

#### Scenario: The site answers at the base domain

- **WHEN** a collector opens the ZZZ base domain for an environment
- **THEN** the ZZZ site renders

#### Scenario: The brand runs exactly one site

- **WHEN** the sites the brand runs are read from the registry
- **THEN** the base-domain site is the only entry, and it is the site the
  brand's shoppers are sent to

### Requirement: The retired storefront address forwards to the base domain

A request to the storefront subdomain the site used to answer at SHALL be
answered with a permanent redirect to the same path at the base domain,
preserving the path and the query string. The storefront subdomain SHALL
serve no application of its own.

#### Scenario: A saved storefront link still lands

- **GIVEN** a link a collector saved to the storefront subdomain
- **WHEN** they open it
- **THEN** they arrive at the base domain and the ZZZ site renders

#### Scenario: A deep link keeps its path and query

- **GIVEN** a link to a path with a query string under the storefront
  subdomain
- **WHEN** it is opened
- **THEN** the redirect target carries the same path and the same query
  string under the base domain

#### Scenario: The redirect is permanent

- **WHEN** the storefront subdomain is requested
- **THEN** the response is a permanent redirect, so a client and a crawler
  both record the base domain as the address

### Requirement: Every ZZZ address the platform issues names the base domain

An address ZZZ hands to a collector outside the browser — the link in a
sign-in mail, the destination a checkout returns to, and the subject a push
notification is signed with — SHALL be derived from the site registry, so it
names the base domain without any of them recording a host.

#### Scenario: A sign-in mail links to the base domain

- **WHEN** ZZZ sends a collector a sign-in mail
- **THEN** the link in it addresses the base domain

#### Scenario: A collector's session survives the move

- **GIVEN** a collector with a ZZZ session
- **WHEN** they open the base domain
- **THEN** they are still signed in, because the session cookie is held on
  the parent of every host the brand runs
