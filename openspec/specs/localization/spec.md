# localization Specification

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
## Requirements
### Requirement: Each brand speaks its stated languages

The platform SHALL state, per brand, the set of locales its site renders and
which of them is the default: for grade10, English (`en`, the default),
Traditional Chinese (`zh-Hant`), and Simplified Chinese (`zh-Hans`); for ZZZ,
Korean (`ko`) alone.

Every user-facing string a brand's site renders SHALL come from that brand's
message catalogs in the active locale. No surface SHALL carry its own
hardcoded copy, including the surfaces both brands share.

#### Scenario: A shared surface renders each brand's language

- **GIVEN** the store surface rendered on the grade10 site in Traditional Chinese and on the ZZZ site
- **WHEN** each page renders
- **THEN** the grade10 page's copy is Traditional Chinese
- **AND** the ZZZ page's copy is Korean

#### Scenario: Every ZZZ surface is Korean

- **WHEN** any page of the ZZZ site renders
- **THEN** its copy is Korean

#### Scenario: Commerce content stays in its source language

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

#### Scenario: A brand says nothing of its own

- **GIVEN** a key no brand states a value for
- **WHEN** a page of any brand renders it in any of that brand's locales
- **THEN** the vocabulary's own value in that locale renders

#### Scenario: A brand names itself

- **GIVEN** a key one brand states its own value for
- **WHEN** that brand's page renders it
- **THEN** the brand's value renders
- **AND** every other brand's page renders the vocabulary's value

#### Scenario: A brand leaves a key unanswered

- **GIVEN** a key no brand-neutral value answers
- **WHEN** a brand that does not answer it either is built
- **THEN** the build fails naming the brand, the key, and the language

#### Scenario: A brand's own words are missing a language

- **GIVEN** a brand that answers a key in one of its locales and not another
- **WHEN** the build runs
- **THEN** it fails naming the brand, the key, and the language

#### Scenario: A single-locale brand is missing a string

- **GIVEN** the shared vocabulary gains a key with no Korean value
- **WHEN** the build runs
- **THEN** it fails naming the gap, and no page ever renders it

#### Scenario: A partial translation falls back key by key

- **GIVEN** a key whose Simplified Chinese value is absent
- **WHEN** a grade10 page renders it in Simplified Chinese
- **THEN** the English value renders in its place
- **AND** every key with a Simplified Chinese value still renders it

#### Scenario: No raw key on screen

- **WHEN** any page of either brand renders in any of its locales
- **THEN** no message key renders as visible text

#### Scenario: A new brand answers only for itself

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

#### Scenario: A Hong Kong browser arrives

- **GIVEN** a first visit from a browser preferring `zh-HK`
- **WHEN** the site renders
- **THEN** the page is Traditional Chinese

#### Scenario: An explicit pick outlives the visit

- **GIVEN** a collector whose browser prefers `zh-HK` and who picked Simplified Chinese
- **WHEN** they return to the site later
- **THEN** the page is Simplified Chinese

#### Scenario: An unsupported language falls to the default

- **GIVEN** a first visit from a browser preferring only Japanese
- **WHEN** the site renders
- **THEN** the page is English

#### Scenario: One language needs no switcher

- **WHEN** the ZZZ site's header renders
- **THEN** its locale label displays Korean and invites no interaction

### Requirement: A grade10 public address names its language

Each public surface the build writes a document for SHALL answer at one
address per locale: the default locale at the address it has today,
Traditional Chinese under the `/tc` prefix, and Simplified Chinese under
`/sc`. Everything the crawlable-pages capability requires of a public
address — its content without scripts, its self-naming, its share metadata,
its honest statuses — SHALL hold at every one of these addresses, in that
address's language.

Each variant SHALL declare every language variant of itself, including the
default, readable without executing scripts, and the sitemap SHALL list every
variant of every surface it names.

A public surface whose document is rendered when its address is asked for
SHALL carry no address of its own per locale: the address it answers at stays
as it is, and the sitemap keeps naming none of them — which addresses it
answers is the catalogue's to say, not the build's. It SHALL render the
platform's own copy in the locale the request carries and declare that
locale, falling back to the brand default when the request carries none, so
a crawler is answered in the default locale deterministically.

The address SHALL win over the remembered choice: a prefixed address renders
its own language, and navigation from it to another public surface stays in
that language. A collector whose remembered locale is not the default SHALL
end at that locale's address when they open an unprefixed public address that
has one. Session-shaped surfaces SHALL stay unprefixed and render the
remembered locale.

#### Scenario: A Chinese address answers whole

- **WHEN** the Traditional Chinese store address is fetched and no script executes
- **THEN** the response HTML carries the store's title, meta description, headline, and static copy in Traditional Chinese

#### Scenario: A variant declares its alternates

- **WHEN** any public address that has a variant per locale is fetched and no script executes
- **THEN** the response names each language variant of that surface and its address, the default among them

#### Scenario: The sitemap lists every variant

- **WHEN** the sitemap is fetched
- **THEN** each public surface the sitemap names appears once per grade10 locale
- **AND** no session-shaped address appears
- **AND** no address of a surface rendered when it is asked for appears

#### Scenario: A rendered surface keeps its one address

- **GIVEN** a collector whose remembered locale is Traditional Chinese
- **WHEN** they open a public surface whose document is rendered when its address is asked for
- **THEN** the address carries no locale prefix
- **AND** the platform's own copy on the page is Traditional Chinese

#### Scenario: A crawler reads a rendered surface in the default locale

- **WHEN** such an address is fetched carrying no remembered locale and no script executes
- **THEN** the response's own copy is English and the document declares it

#### Scenario: The address wins over the memory

- **GIVEN** a collector whose remembered locale is Simplified Chinese
- **WHEN** they open a `/tc` address
- **THEN** the page is Traditional Chinese

#### Scenario: A prefixed visit stays in its language

- **GIVEN** a collector on the Traditional Chinese store address
- **WHEN** they navigate to the auction
- **THEN** they arrive at the auction's Traditional Chinese address

#### Scenario: The memory redirects an unprefixed arrival

- **GIVEN** a collector whose remembered locale is Traditional Chinese
- **WHEN** they open the unprefixed marketing address
- **THEN** they end at the marketing page's Traditional Chinese address

#### Scenario: An unknown prefixed address is refused honestly

- **WHEN** an address under a locale prefix that matches no surface is fetched
- **THEN** the response has status 404
- **AND** a collector opening it sees the not-found surface in that locale

### Requirement: The document declares its language

Every page of either brand SHALL declare the active locale as the document's
language, so assistive technology and text rendering follow the language on
screen.

#### Scenario: A Chinese page says so

- **WHEN** a grade10 page renders in Traditional Chinese
- **THEN** the document declares `zh-Hant`

#### Scenario: The ZZZ document is Korean

- **WHEN** any ZZZ page renders
- **THEN** the document declares `ko`

### Requirement: The login email arrives in the page's language

A sign-in email SHALL render in the locale of the page the sign-in started
from, falling back to the brand's default locale when none was carried. The
message vocabulary's email strings SHALL be answered in every locale of both
brands.

#### Scenario: A Chinese sign-in gets a Chinese email

- **GIVEN** a collector on a Traditional Chinese grade10 page
- **WHEN** they request a sign-in email
- **THEN** the email's subject and body are Traditional Chinese

#### Scenario: The ZZZ email is Korean

- **WHEN** a collector requests a sign-in email on the ZZZ site
- **THEN** the email's subject and body are Korean

### Requirement: Dates on a localized page speak its language

Every date rendered on a localized page SHALL name the active locale as the
language input the dates-and-times capability accepts, and nothing else about
that capability changes: the shapes, the format, and the zone stay as
specified there.

#### Scenario: A month in Traditional Chinese

- **GIVEN** a date shown on a Traditional Chinese page
- **WHEN** it renders
- **THEN** its words are Traditional Chinese
- **AND** its ordering and punctuation are the platform's stated format

