# shared/localization — delta

## Purpose

Which languages each brand speaks and how a page ends up in one of them: where
every user-facing string comes from, how the grade10 site decides a
collector's locale and remembers a choice, how a public address names its
language for search and shared links, and which language the login email
arrives in. It binds the user-facing sites of both brands and the messages
they send; admin panels are out of scope throughout.

Content that arrives from a live service — product titles, auction lot names,
anything a merchant or seller typed — renders in its source language, except an auction listing's title and description, which render in the page's language where the operator wrote one. This
capability governs the platform's own copy.

## Feature set

- Source-language content
  - Auction listing exception: an auction listing's title and description render in the page's language where the operator wrote one

## ADDED Requirements

### Requirement: An auction listing's title and description read in the page's language

An auction listing's title and description SHALL render in the active locale
where an operator wrote them in that locale, and as authored in English
otherwise, per text. This is the one exception to the rule that anything a
merchant or seller typed renders as authored: every other typed text, a store
product's name and description included, still renders as authored, and the
platform translates nothing at read time. A locale an operator has no field for
reads English, and one Chinese is never shown in place of the other.

<!-- trace:scenario id=g10.shared-localization.SC-2lw rev=1 -->
#### Scenario: shared-localization-SC-40 - A Traditional Chinese page reads a listing in Traditional Chinese
**Serves:** Source-language content - auction listing exception

- **GIVEN** an auction listing whose title and description an operator wrote in English and in Traditional Chinese
- **WHEN** it renders on a Traditional Chinese page
- **THEN** the listing's title and description render in Traditional Chinese

<!-- trace:scenario id=g10.shared-localization.SC-4ko rev=1 -->
#### Scenario: shared-localization-SC-41 - A listing nobody translated renders as authored
**Serves:** Source-language content - auction listing exception

- **GIVEN** an auction listing whose title and description exist in English only
- **WHEN** it renders on a Traditional Chinese page and on a Simplified Chinese page
- **THEN** both render the title and description as authored

<!-- trace:scenario id=g10.shared-localization.SC-w2h rev=1 -->
#### Scenario: shared-localization-SC-42 - A store product still renders as authored
**Serves:** Source-language content - auction listing exception

- **GIVEN** a store product authored in English, whose inventory record also holds a Traditional Chinese name and description
- **WHEN** its card renders on a Traditional Chinese page
- **THEN** the page's own copy is Traditional Chinese
- **AND** the product's name and description render as authored
