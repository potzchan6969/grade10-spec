# localization Specification

## MODIFIED Requirements

### Requirement: One vocabulary, and every brand answers all of it

The strings of every user-facing surface SHALL be named by one shared
vocabulary of message keys. The vocabulary SHALL carry a brand-neutral value
for every key in every locale any brand speaks; a brand's catalogs SHALL
supply only the keys that brand says differently.

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
