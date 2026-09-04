# shared/dates-and-times Specification

## Purpose
How a stored instant becomes text a person reads, and how a calendar day a
person types becomes an instant.

Every date the platform holds is an instant — a single point in time, with no
zone of its own. This capability governs what happens between that instant
and a reader: which shape it takes, whether the shape names a time zone, and
which language words it. It binds every Grade10 surface that shows a date:
storefront pages, admin panels, demos, and the messages the platform sends.
It also governs the one place the traffic runs the other way — a calendar day
an operator types into a date field, which carries no time and no zone and
has to become instants before a worker can store it.

Collector-facing activity time and local moments use the reader's stated zone.
Operator tables, admin surfaces, and sent messages use the platform's UTC zone,
so a stored instant has one stable operator and message representation.

## Feature set

- Reading shapes
  - Platform shapes: a day, a moment, an event, and a deadline, one per the reader's task
  - Collector shapes: relative activity time and local moment for recent and historical activity
  - Shape consistency: two surfaces showing one instant in one shape show identical text
- Format and language
  - Platform format: ordering and punctuation are the platform's, not a browser's configuration
  - Named language: every rendering accepts the language its words are drawn from, English where none is named
- One stated zone
  - UTC for operators and messages: administrative and sent text states Coordinated Universal Time
  - Reader zone for collectors: activity time and local moments use the stated reader time zone
  - Named deadlines: an instant a reader is expected to act before names the zone it is stated in
- Refusals
  - Unshipped language: a language the platform has no words for fails rather than degrading quietly
  - Invalid instant: an instant that is not a valid point in time fails rather than rendering placeholder text
- Sent messages
  - English wording: a message is composed once and read anywhere, so no reader's language words it
  - Stated zone: a date in a message names its zone, so every recipient reads the same time
- Typed calendar days
  - Whole-day windows: a typed day becomes the instants it begins and ends, so a window includes both days entirely
  - Read-back symmetry: an instant shown back in a date field is the day that was typed, from any machine
  - Empty field: a date field left empty produces no instant at all

## Requirements

### Requirement: A date takes a platform-defined shape

The platform SHALL render an instant in a platform-defined shape, and every
surface SHALL use the shape its reader's task calls for. No surface SHALL
produce a date by its own local formatting.

- A **day** — a calendar date with no time — where the time of day carries no
  meaning for the reader: when a member joined, when a reward window opens,
  when an invitation expires.
- A **moment** — a date and a time to the minute — where the reader needs to
  place an event in the day: when an order was placed, when a bid landed.
- An **event** — a date and a time to the second — where the reader is
  ordering or correlating records that can fall in the same minute.
- A **deadline** — a date, a time to the minute, and the name of the zone it
  is in — where the reader will act before the time arrives.

#### Scenario: shared-dates-and-times-SC-01 - Two operator tables show one moment the same way

- **GIVEN** an order table and a member ledger table each showing the same instant
- **WHEN** each row is rendered for the same reader
- **THEN** both show identical text

#### Scenario: shared-dates-and-times-SC-02 - The same shape across both brands

- **GIVEN** the same instant shown in the grade10 admin panel and the zzz admin panel
- **WHEN** each is rendered for the same reader
- **THEN** both show identical text

#### Scenario: shared-dates-and-times-SC-03 - A day carries no time

- **GIVEN** a surface showing when a member joined
- **WHEN** it is rendered
- **THEN** it shows the calendar date
- **AND** it shows no time of day

#### Scenario: shared-dates-and-times-SC-04 - An audit entry is ordered to the second

- **GIVEN** two audit entries recorded eleven seconds apart in the same minute
- **WHEN** the log is rendered
- **THEN** the two entries show different times

#### Scenario: shared-dates-and-times-SC-05 - One reader, two browsers

- **GIVEN** the same date rendered for one reader on two browsers configured for different locales
- **WHEN** each renders it
- **THEN** both show identical text

### Requirement: The platform states the format, and can be told the language

A date's ordering and punctuation SHALL be the format the platform states,
identical for every reader, so no surface's output depends on how a browser
happens to be configured.

The language a date's words are drawn from SHALL be an input every rendering
accepts. Where a caller names none, the rendering SHALL use English.

Collector-facing activity time and local moment renderings SHALL accept a
shipped platform locale only; unsupported browser languages SHALL be resolved
to the brand default before formatting.

#### Scenario: shared-dates-and-times-SC-06 - A month name in another language

- **GIVEN** a date rendered with a language named by the caller
- **WHEN** it is rendered
- **THEN** the month's wording is drawn from that language
- **AND** the ordering and punctuation are unchanged from the platform's format

#### Scenario: shared-dates-and-times-SC-07 - No language named

- **GIVEN** a date rendered with no language named by the caller
- **WHEN** it is rendered
- **THEN** its words are English

#### Scenario: shared-dates-and-times-SC-08 - A language the platform does not ship

- **WHEN** a low-level operator or message formatter is called with a language the platform has no words for
- **THEN** the rendering fails with an error naming that language

### Requirement: A date that is not a date stops the render

An attempt to render an instant that is not a valid point in time SHALL fail
with an error. No surface SHALL render placeholder text in place of a date.

#### Scenario: shared-dates-and-times-SC-09 - An invalid instant

- **WHEN** a surface renders an instant that is not a valid point in time
- **THEN** the rendering fails with an error
- **AND** no placeholder date text is shown to the reader

### Requirement: Each rendering states the zone its surface requires

Operator tables, admin surfaces, and sent messages SHALL render instants in
Coordinated Universal Time. Collector-facing activity time and local moments
SHALL render instants in the reader's stated `timeZone`. No rendering SHALL
use the zone the reader's machine is set to without that zone being supplied as
the reader's stated zone.

#### Scenario: shared-dates-and-times-SC-10 - Operator readers in different zones

- **GIVEN** the same instant rendered for a reader whose machine is set east of UTC and one set west of it
- **WHEN** each renders it in an operator table
- **THEN** both show identical text

#### Scenario: shared-dates-and-times-SC-11 - An operator instant near midnight

- **GIVEN** an instant that falls on one calendar date in UTC and the next in the reader's own zone
- **WHEN** it is rendered as a day in an operator table
- **THEN** the day shown is the UTC one

### Requirement: A deadline names its time zone

Any rendering of an instant a reader is expected to act before SHALL name the
time zone it is stated in. An auction's close is such an instant on every
surface that shows it.

#### Scenario: shared-dates-and-times-SC-12 - The auction page shows a close

- **GIVEN** a listing open for bids
- **WHEN** its close time is rendered on the auction page
- **THEN** the rendering names the zone it is stated in
- **AND** a reader whose machine is set to another zone sees that same name

#### Scenario: shared-dates-and-times-SC-13 - A page and a message agree

- **GIVEN** the same listing's close shown on the auction page and in an auction email
- **WHEN** both are rendered
- **THEN** both name the zone they are stated in
- **AND** both use the deadline shape

#### Scenario: shared-dates-and-times-SC-14 - A closed listing

- **GIVEN** a listing that has already closed
- **WHEN** its close time is rendered
- **THEN** the rendering names the time zone it is stated in

### Requirement: A message the platform sends states one zone

A date rendered into a message the platform sends — an email, a notification
— SHALL name the zone it is stated in, and SHALL be worded in English
regardless of where the message is opened.

A message is composed once and read anywhere, so it has no reader whose
language could be used, and the zone it states is the platform's.

#### Scenario: shared-dates-and-times-SC-15 - An auction email states its zone

- **GIVEN** an auction email carrying a close time
- **WHEN** the message is rendered
- **THEN** the time is stated in one fixed zone
- **AND** the rendering names that zone

#### Scenario: shared-dates-and-times-SC-16 - Two recipients read one time

- **GIVEN** two recipients of the same auction email in different countries and different zones
- **WHEN** each opens the message
- **THEN** both read the same text for the close time

### Requirement: A typed calendar day covers that whole day

A calendar day a person types into a date field SHALL become the instant that
day begins and the instant it ends, both in the platform's zone, so a window
stated as two days includes every moment of both.

An instant shown back in such a field SHALL be the calendar day that instant
falls on in the platform's zone, so a day typed in and read back is the same
day, from any machine.

#### Scenario: shared-dates-and-times-SC-17 - A window includes the last moment of its final day

- **GIVEN** a window typed as beginning and ending on stated calendar days
- **WHEN** it is stored
- **THEN** an event in the final second of the final day falls inside the window

#### Scenario: shared-dates-and-times-SC-18 - A day reads back as it was typed

- **GIVEN** a calendar day typed into a date field and stored
- **WHEN** the stored instant is shown in that field again
- **THEN** the field shows the day that was typed

#### Scenario: shared-dates-and-times-SC-19 - A day typed from a machine set to another zone

- **GIVEN** the same calendar day typed by one person whose machine is set east of UTC and one set west of it
- **WHEN** each is stored
- **THEN** both produce the same pair of instants

#### Scenario: shared-dates-and-times-SC-20 - An empty date field

- **GIVEN** a date field left empty
- **WHEN** the form is read
- **THEN** no instant is produced for it

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

#### Scenario: shared-dates-and-times-SC-21 - Just now does not show zero seconds

- **GIVEN** an instant 30 seconds in the past
- **WHEN** it is rendered as relative activity time in English
- **THEN** the label is `Just now`

#### Scenario: shared-dates-and-times-SC-22 - An unsupported browser language reads English

- **GIVEN** a collector whose browser prefers Thai and whose site locale resolved to English
- **WHEN** a relative activity time renders
- **THEN** its words are English

### Requirement: A local moment renders for collectors without naming UTC

A **local moment** SHALL render an instant on collector-facing surfaces in the
reader's stated `timeZone` with shape `DD Mon YYYY, HH:MM`, month names from
`locale`, and no zone suffix.

Operator tables, admin surfaces, and sent messages SHALL continue to use the UTC
moment and deadline shapes that name the zone.

#### Scenario: shared-dates-and-times-SC-23 - Two zones read different clocks

- **GIVEN** the same instant rendered for readers in `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each reads it as a local moment in English
- **THEN** the clock values differ
- **AND** neither string contains `UTC`

### Requirement: Activity time composes relative and local moment

**Activity time** SHALL apply relative tiers when elapsed is less than seven
days and SHALL fall back to local moment otherwise.

#### Scenario: shared-dates-and-times-SC-24 - Older activity uses a local moment

- **GIVEN** one instant two minutes in the past and another instant eight days in the past
- **WHEN** both are rendered as activity time in English for `Asia/Hong_Kong`
- **THEN** the recent instant uses the relative minutes tier
- **AND** the older instant uses the local moment shape `DD Mon YYYY, HH:MM`
