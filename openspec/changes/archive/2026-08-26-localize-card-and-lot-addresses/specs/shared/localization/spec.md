## ADDED Requirements

### Requirement: Every grade10 public address names its language

Every public surface SHALL answer at one address per locale: the default
locale at the address it has today, Traditional Chinese under the `/tc`
prefix, and Simplified Chinese under `/sc`. This binds a surface whose
document the build writes and a surface whose document is rendered when its
address is asked for alike — under a prefix, a card and a lot answer as
themselves in that language rather than as the surface above them, and refuse
an address the catalogue holds nothing for exactly as their unprefixed
addresses do. Everything the crawlable-pages capability requires of a public
address — its content without scripts, its self-naming, its share metadata,
its honest statuses — SHALL hold at every one of these addresses, in that
address's language.

Each variant SHALL declare every language variant of itself, including the
default, readable without executing scripts. The sitemap SHALL list every
address it names once per locale.

The address SHALL win over the remembered choice: a prefixed address renders
its own language, and navigation from it to another public surface stays in
that language. A collector whose remembered locale is not the default SHALL
end at that locale's address when they open an unprefixed public address. An
unprefixed public address SHALL render the brand default when the request
carries no remembered locale, so a crawler is answered in the default locale
deterministically. Session-shaped surfaces SHALL stay unprefixed and render
the remembered locale.

#### Scenario: A Chinese address answers whole

- **WHEN** the Traditional Chinese store address is fetched and no script executes
- **THEN** the response HTML carries the store's title, meta description, headline, and static copy in Traditional Chinese

#### Scenario: A card answers under a prefix as itself

- **WHEN** the Traditional Chinese address of a card the catalogue holds is fetched and no script executes
- **THEN** the response has status 200 and carries that card's own name, description, and prices
- **AND** the platform's own copy around it is Traditional Chinese
- **AND** the storefront's page is not what answered

#### Scenario: A lot answers under a prefix as itself

- **WHEN** the Simplified Chinese address of a lot the auction holds is fetched and no script executes
- **THEN** the response has status 200 and carries that lot's own identity
- **AND** the platform's own copy around it is Simplified Chinese

#### Scenario: A prefixed address naming nothing is refused

- **WHEN** a Simplified Chinese address under the store's cards naming no card in the catalogue is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the not-found surface in Simplified Chinese

#### Scenario: A variant declares its alternates

- **WHEN** any public address is fetched and no script executes
- **THEN** the response names each language variant of that surface and its address, the default among them

#### Scenario: The sitemap lists every variant

- **WHEN** the sitemap is fetched
- **THEN** each address the sitemap names appears once per grade10 locale
- **AND** no session-shaped address appears

#### Scenario: A crawler reads an unprefixed address in the default locale

- **WHEN** an unprefixed public address is fetched carrying no remembered locale and no script executes
- **THEN** the response's own copy is English and the document declares it

#### Scenario: The address wins over the memory

- **GIVEN** a collector whose remembered locale is Simplified Chinese
- **WHEN** they open a `/tc` address
- **THEN** the page is Traditional Chinese

#### Scenario: A prefixed visit stays in its language

- **GIVEN** a collector on the Traditional Chinese store address
- **WHEN** they navigate to the auction
- **THEN** they arrive at the auction's Traditional Chinese address

#### Scenario: A prefixed catalogue opens a prefixed card

- **GIVEN** a collector on the Traditional Chinese store address
- **WHEN** they open a card from the grid
- **THEN** they arrive at that card's Traditional Chinese address

#### Scenario: The memory redirects an unprefixed arrival

- **GIVEN** a collector whose remembered locale is Traditional Chinese
- **WHEN** they open the unprefixed marketing address, and then an unprefixed card address
- **THEN** they end at the Traditional Chinese address of each

#### Scenario: An unknown prefixed address is refused honestly

- **WHEN** an address under a locale prefix that matches no surface is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the not-found surface in that locale

## REMOVED Requirements

### Requirement: A grade10 public address names its language

**Reason:** It exempted a surface whose document is rendered when its address
is asked for, and that exemption is what this change removes. Its rule is
restated over every public surface by "Every grade10 public address names its
language", which keeps each of its scenarios that still holds.

**Migration:** The unprefixed card and lot addresses keep answering and become
the English canonical, so no link already shared breaks. A collector whose
remembered locale is not the default now ends at that locale's address on them
rather than reading them in that language at the unprefixed one.
