# shared/localization Specification

## Purpose
Which languages each brand speaks and how a page ends up in one of them: where
every user-facing string comes from, how the grade10 site decides a
collector's locale and remembers a choice, how a public address names its
language for search and shared links, and which language the login email
arrives in. It binds the user-facing sites of both brands and the messages
they send; admin panels are out of scope throughout.

Content that arrives from a live service — product titles, auction lot names,
anything a merchant or seller typed — renders in its source language. This
capability governs the platform's own copy.

## Feature set

- Brand language sets
  - Stated locales: names which locales each brand's site renders and which one is its default
  - Catalog-only copy: every user-facing string comes from a brand's catalogs, so no surface carries its own
  - Source-language content: what a merchant or seller typed renders as authored, not translated
- Shared message vocabulary
  - One key vocabulary: one shared set of keys names the strings of every user-facing surface
  - Brand answers: a brand states only what says something about itself; the vocabulary answers the rest
  - Build-time completeness: a key left unanswered fails the build, before anything ships
  - Locale fallback: a non-default locale missing a value renders the brand default rather than a raw key
- Locale resolution
  - Browser preferences: a first visit resolves the locale from the languages the browser states
  - Remembered choice: an explicit pick applies immediately and wins on every return visit
  - Single-locale brands: a brand speaking one language labels it rather than inviting a switch
- Localized public addresses
  - Per-locale addresses: every public surface answers at one address per locale
  - Alternate declarations: each variant names every language variant of itself, readable without scripts
  - Sitemap coverage: the sitemap lists each address it names once per locale
  - Address precedence: a prefixed address decides the language, and navigation from it stays in that language
  - Honest statuses: a prefixed address naming nothing is refused in its own locale
- Language beyond the page
  - Document language: every page declares the active locale, so assistive technology follows the screen
  - Sign-in email: the email arrives in the locale of the page the sign-in started from
  - Localized dates: a date takes the active locale as the language input dates-and-times accepts

## Requirements
### Requirement: Each brand speaks its stated languages

The platform SHALL state, per brand, the set of locales its site renders and
which of them is the default: for grade10, English (`en`, the default),
Traditional Chinese (`zh-Hant`), and Simplified Chinese (`zh-Hans`); for ZZZ,
Korean (`ko`) alone.

Every user-facing string a brand's site renders SHALL come from that brand's
message catalogs in the active locale. No surface SHALL carry its own
hardcoded copy, including the surfaces both brands share.

#### Scenario: shared-localization-SC-01 - A shared surface renders each brand's language
**Serves:** Brand language sets - a shared surface renders each brand's language

- **GIVEN** the store surface rendered on the grade10 site in Traditional Chinese and on the ZZZ site
- **WHEN** each page renders
- **THEN** the grade10 page's copy is Traditional Chinese
- **AND** the ZZZ page's copy is Korean

#### Scenario: shared-localization-SC-02 - Every ZZZ surface is Korean
**Serves:** Brand language sets - every ZZZ surface is Korean

- **WHEN** any page of the ZZZ site renders
- **THEN** its copy is Korean

#### Scenario: shared-localization-SC-03 - Commerce content stays in its source language
**Serves:** Brand language sets - commerce content stays in its source language

- **GIVEN** a product listing whose title was authored in English
- **WHEN** it renders on a Traditional Chinese page
- **THEN** the page's own copy is Traditional Chinese
- **AND** the listing's title renders as authored

### Requirement: One vocabulary, and every brand answers all of it

The strings of every user-facing surface SHALL be named by one shared
vocabulary of message keys. A key SHALL be answered brand-neutrally wherever
no brand claims it, and by a brand wherever one does — between them they SHALL
answer every key of the vocabulary, in every locale that brand speaks. No key
SHALL be answered brand-neutrally with a value written to be overridden: a
name a brand must state is the brand's to state.

A key a brand does not answer SHALL render the vocabulary's own value in the
locale being read. A key a brand does answer SHALL render that brand's value,
and the brand SHALL answer it in every locale that brand speaks — so a page
never renders one brand's words inside another language's sentence. A missing
value on either side SHALL fail the build, before anything ships.

For a brand with several locales, a non-default locale MAY omit a key it
answers elsewhere, and the rendered string SHALL then be that brand's default
locale's value. A raw message key SHALL never render.

#### Scenario: shared-localization-SC-04 - A brand says nothing of its own
**Serves:** Shared message vocabulary - a brand says nothing of its own

- **GIVEN** a key no brand states a value for
- **WHEN** a page of any brand renders it in any of that brand's locales
- **THEN** the vocabulary's own value in that locale renders

#### Scenario: shared-localization-SC-05 - A brand names itself
**Serves:** Shared message vocabulary - a brand names itself

- **GIVEN** a key one brand states its own value for
- **WHEN** that brand's page renders it
- **THEN** the brand's value renders
- **AND** every other brand's page renders the vocabulary's value

#### Scenario: shared-localization-SC-06 - A brand leaves a key unanswered
**Serves:** Shared message vocabulary - a brand leaves a key unanswered

- **GIVEN** a key no brand-neutral value answers
- **WHEN** a brand that does not answer it either is built
- **THEN** the build fails naming the brand, the key, and the language

#### Scenario: shared-localization-SC-07 - A brand's own words are missing a language
**Serves:** Shared message vocabulary - a brand's own words are missing a language

- **GIVEN** a brand that answers a key in one of its locales and not another
- **WHEN** the build runs
- **THEN** it fails naming the brand, the key, and the language

#### Scenario: shared-localization-SC-08 - A single-locale brand is missing a string
**Serves:** Shared message vocabulary - a single-locale brand is missing a string

- **GIVEN** the shared vocabulary gains a key with no Korean value
- **WHEN** the build runs
- **THEN** it fails naming the gap, and no page ever renders it

#### Scenario: shared-localization-SC-09 - A partial translation falls back key by key
**Serves:** Shared message vocabulary - a partial translation falls back key by key

- **GIVEN** a key whose Simplified Chinese value is absent
- **WHEN** a grade10 page renders it in Simplified Chinese
- **THEN** the English value renders in its place
- **AND** every key with a Simplified Chinese value still renders it

#### Scenario: shared-localization-SC-10 - No raw key on screen
**Serves:** Shared message vocabulary - no raw key on screen

- **WHEN** any page of either brand renders in any of its locales
- **THEN** no message key renders as visible text

#### Scenario: shared-localization-SC-11 - A new brand answers only for itself
**Serves:** Shared message vocabulary - a new brand answers only for itself

- **GIVEN** a brand added to the platform
- **WHEN** it states what it calls itself and nothing more
- **THEN** every other string on its pages renders from the vocabulary in the
  locales that brand speaks

### Requirement: grade10 resolves the locale, then remembers a choice

On a collector's first visit, the grade10 site SHALL choose the locale from
the browser's stated language preferences: a Chinese preference of Taiwan,
Hong Kong, or Macau resolves to Traditional Chinese; of China or Singapore to
Simplified Chinese; any preference outside the brand's set resolves to the
default.

An explicit pick in the site's locale switcher SHALL apply immediately,
follow the collector across the site, and win over the browser's preferences
on every return visit until they pick again.

#### Scenario: shared-localization-SC-12 - A Hong Kong browser arrives
**Serves:** Locale resolution - a Hong Kong browser arrives

- **GIVEN** a first visit from a browser preferring `zh-HK`
- **WHEN** the site renders
- **THEN** the page is Traditional Chinese

#### Scenario: shared-localization-SC-13 - An explicit pick outlives the visit
**Serves:** Locale resolution - an explicit pick outlives the visit

- **GIVEN** a collector whose browser prefers `zh-HK` and who picked Simplified Chinese
- **WHEN** they return to the site later
- **THEN** the page is Simplified Chinese

#### Scenario: shared-localization-SC-14 - An unsupported language falls to the default
**Serves:** Locale resolution - an unsupported language falls to the default

- **GIVEN** a first visit from a browser preferring only Japanese
- **WHEN** the site renders
- **THEN** the page is English

#### Scenario: shared-localization-SC-15 - One language needs no switcher
**Serves:** Locale resolution - one language needs no switcher

- **WHEN** the ZZZ site's header renders
- **THEN** its locale label displays Korean and invites no interaction

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

#### Scenario: shared-localization-SC-16 - A Chinese address answers whole
**Serves:** Localized public addresses - a Chinese address answers whole

- **WHEN** the Traditional Chinese store address is fetched and no script executes
- **THEN** the response HTML carries the store's title, meta description, headline, and static copy in Traditional Chinese

#### Scenario: shared-localization-SC-17 - A card answers under a prefix as itself
**Serves:** Localized public addresses - a card answers under a prefix as itself

- **WHEN** the Traditional Chinese address of a card the catalogue holds is fetched and no script executes
- **THEN** the response has status 200 and carries that card's own name, description, and prices
- **AND** the platform's own copy around it is Traditional Chinese
- **AND** the storefront's page is not what answered

#### Scenario: shared-localization-SC-18 - A lot answers under a prefix as itself
**Serves:** Localized public addresses - a lot answers under a prefix as itself

- **WHEN** the Simplified Chinese address of a lot the auction holds is fetched and no script executes
- **THEN** the response has status 200 and carries that lot's own identity
- **AND** the platform's own copy around it is Simplified Chinese

#### Scenario: shared-localization-SC-19 - A prefixed address naming nothing is refused
**Serves:** Localized public addresses - a prefixed address naming nothing is refused

- **WHEN** a Simplified Chinese address under the store's cards naming no card in the catalogue is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the not-found surface in Simplified Chinese

#### Scenario: shared-localization-SC-20 - A variant declares its alternates
**Serves:** Localized public addresses - a variant declares its alternates

- **WHEN** any public address is fetched and no script executes
- **THEN** the response names each language variant of that surface and its address, the default among them

#### Scenario: shared-localization-SC-21 - The sitemap lists every variant
**Serves:** Localized public addresses - the sitemap lists every variant

- **WHEN** the sitemap is fetched
- **THEN** each address the sitemap names appears once per grade10 locale
- **AND** no session-shaped address appears

#### Scenario: shared-localization-SC-22 - A crawler reads an unprefixed address in the default locale
**Serves:** Localized public addresses - a crawler reads an unprefixed address in the default locale

- **WHEN** an unprefixed public address is fetched carrying no remembered locale and no script executes
- **THEN** the response's own copy is English and the document declares it

#### Scenario: shared-localization-SC-23 - The address wins over the memory
**Serves:** Localized public addresses - the address wins over the memory

- **GIVEN** a collector whose remembered locale is Simplified Chinese
- **WHEN** they open a `/tc` address
- **THEN** the page is Traditional Chinese

#### Scenario: shared-localization-SC-24 - A prefixed visit stays in its language
**Serves:** Localized public addresses - a prefixed visit stays in its language

- **GIVEN** a collector on the Traditional Chinese store address
- **WHEN** they navigate to the auction
- **THEN** they arrive at the auction's Traditional Chinese address

#### Scenario: shared-localization-SC-25 - A prefixed catalogue opens a prefixed card
**Serves:** Localized public addresses - a prefixed catalogue opens a prefixed card

- **GIVEN** a collector on the Traditional Chinese store address
- **WHEN** they open a card from the grid
- **THEN** they arrive at that card's Traditional Chinese address

#### Scenario: shared-localization-SC-26 - The memory redirects an unprefixed arrival
**Serves:** Localized public addresses - the memory redirects an unprefixed arrival

- **GIVEN** a collector whose remembered locale is Traditional Chinese
- **WHEN** they open the unprefixed marketing address, and then an unprefixed card address
- **THEN** they end at the Traditional Chinese address of each

#### Scenario: shared-localization-SC-27 - An unknown prefixed address is refused honestly
**Serves:** Localized public addresses - an unknown prefixed address is refused honestly

- **WHEN** an address under a locale prefix that matches no surface is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the not-found surface in that locale

### Requirement: The document declares its language

Every page of either brand SHALL declare the active locale as the document's
language, so assistive technology and text rendering follow the language on
screen.

#### Scenario: shared-localization-SC-28 - A Chinese page says so
**Serves:** Language beyond the page - a Chinese page says so

- **WHEN** a grade10 page renders in Traditional Chinese
- **THEN** the document declares `zh-Hant`

#### Scenario: shared-localization-SC-29 - The ZZZ document is Korean
**Serves:** Language beyond the page - the ZZZ document is Korean

- **WHEN** any ZZZ page renders
- **THEN** the document declares `ko`

### Requirement: The login email arrives in the page's language

A sign-in email SHALL render in the locale of the page the sign-in started
from, falling back to the brand's default locale when none was carried. The
message vocabulary's email strings SHALL be answered in every locale of both
brands.

#### Scenario: shared-localization-SC-30 - A Chinese sign-in gets a Chinese email
**Serves:** Language beyond the page - a Chinese sign-in gets a Chinese email

- **GIVEN** a collector on a Traditional Chinese grade10 page
- **WHEN** they request a sign-in email
- **THEN** the email's subject and body are Traditional Chinese

#### Scenario: shared-localization-SC-31 - The ZZZ email is Korean
**Serves:** Language beyond the page - the ZZZ email is Korean

- **WHEN** a collector requests a sign-in email on the ZZZ site
- **THEN** the email's subject and body are Korean

### Requirement: Dates on a localized page speak its language

Every date rendered on a localized page SHALL name the active locale as the
language input the dates-and-times capability accepts, and nothing else about
that capability changes: the shapes, the format, and the zone stay as
specified there.

#### Scenario: shared-localization-SC-32 - A month in Traditional Chinese
**Serves:** Language beyond the page - a month in Traditional Chinese

- **GIVEN** a date shown on a Traditional Chinese page
- **WHEN** it renders
- **THEN** its words are Traditional Chinese
- **AND** its ordering and punctuation are the platform's stated format

