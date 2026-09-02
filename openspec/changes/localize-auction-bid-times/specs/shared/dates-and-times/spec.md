## ADDED Requirements

### Requirement: A relative rendering uses platform tiers

A **relative** rendering SHALL turn a past instant into a short label using
platform-owned tier thresholds and copy from the shared `dates` namespace.

- **justNow** — elapsed `< 45 seconds`
- **seconds** — `45s` through `59s`
- **minutes** — `1` through `59` whole minutes
- **hours** — `1` through `23` whole hours
- **days** — `1` through `6` whole days

The `locale` argument SHALL be a shipped platform locale. Callers on collector
surfaces MUST resolve unsupported browser languages to the brand default before
invoking.

#### Scenario: dates-and-times-SC-21 - Just now does not show zero seconds

- **GIVEN** an instant 30 seconds in the past
- **WHEN** it is rendered as relative activity time in English
- **THEN** the label is `Just now`

#### Scenario: dates-and-times-SC-22 - An unsupported browser language reads English

- **GIVEN** a collector whose browser prefers Thai and whose site locale resolved to English
- **WHEN** a relative activity time renders
- **THEN** its words are English

### Requirement: A local moment renders for collectors without naming UTC

A **local moment** SHALL render an instant on collector-facing surfaces in the
reader's stated `timeZone` with shape `DD Mon YYYY, HH:MM`, month names from
`locale`, and no zone suffix.

Operator tables, admin surfaces, and sent messages SHALL continue to use the UTC
moment and deadline shapes that name the zone.

#### Scenario: dates-and-times-SC-23 - Two zones read different clocks

- **GIVEN** the same instant rendered for readers in `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each reads it as a local moment in English
- **THEN** the clock values differ
- **AND** neither string contains `UTC`

### Requirement: Activity time composes relative and local moment

**Activity time** SHALL apply relative tiers when elapsed is less than seven
days and SHALL fall back to local moment otherwise.

## MODIFIED Requirements

### Requirement: The platform states the format, and can be told the language

A date's ordering and punctuation SHALL be the format the platform states,
identical for every reader, so no surface's output depends on how a browser
happens to be configured.

The language a date's words are drawn from SHALL be an input every rendering
accepts. Where a caller names none, the rendering SHALL use English.

Collector-facing activity time and local moment renderings SHALL accept a
shipped platform locale only; unsupported browser languages SHALL be resolved
to the brand default before formatting.

#### Scenario: dates-and-times-SC-06 - A month name in another language

- **GIVEN** a date rendered with a language named by the caller
- **WHEN** it is rendered
- **THEN** the month's wording is drawn from that language
- **AND** the ordering and punctuation are unchanged from the platform's format

#### Scenario: dates-and-times-SC-07 - No language named

- **GIVEN** a date rendered with no language named by the caller
- **WHEN** it is rendered
- **THEN** its words are English

#### Scenario: dates-and-times-SC-08 - A language the platform does not ship

- **WHEN** a low-level operator or message formatter is called with a language the platform has no words for
- **THEN** the rendering fails with an error naming that language
