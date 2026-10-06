## Feature set

- Stated zones
  - Reader zone for collectors: activity time and local moments use the viewer's local time zone
  - Documents as GMT+8: invoices, receipts, terms and emails state Asia/Hong_Kong as GMT+8
- Sent messages
  - Stated zone: a date in a message names its zone, so every recipient reads the same time

## MODIFIED Requirements

### Requirement: Each rendering states the zone its surface requires

Every instant the platform renders SHALL be stated in one named zone.
Collector-facing activity time, local moments, and collector deadlines SHALL
use the viewer's local zone, supplied as `timeZone` (the zone the reader's
environment is in). Operator tables and admin surfaces SHALL state Coordinated
Universal Time. Invoice and receipt PDFs, terms, and emails SHALL state
Asia/Hong_Kong.

A surface that judges a calendar day for the business SHALL keep using the
brand's zone, so the day it shows is the day the brand's own counter, paper
and records are on.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-q9t rev=1 -->
#### Scenario: shared-dates-and-times-SC-10 - Operator readers in different zones
**Serves:** Stated zones - operator surfaces state UTC

- **GIVEN** the same instant rendered for a reader whose machine is set east of UTC and one set west of it
- **WHEN** each renders it in an operator table
- **THEN** both show identical text

<!-- trace:scenario id=g10.shared-dates-and-times.SC-4ud rev=1 -->
#### Scenario: shared-dates-and-times-SC-11 - An instant near midnight
**Serves:** Stated zones - a stated zone near midnight

- **GIVEN** an instant that falls on one calendar date in UTC and the next in the brand's zone
- **WHEN** it is rendered as a day on that brand's surface
- **THEN** the day shown is the brand's
- **AND** every surface of that brand shows the same one

<!-- trace:scenario id=g10.shared-dates-and-times.SC-nes rev=1 -->
#### Scenario: shared-dates-and-times-SC-29 - Two collectors read different collector clocks
**Serves:** Stated zones - collector surfaces use the viewer's zone

- **GIVEN** the same instant rendered for collectors in `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each reads it as a collector deadline
- **THEN** the clock values differ
- **AND** the Hong Kong string names `HKT`
- **AND** the New York string names `EDT` and does not contain `HKT`

### Requirement: A deadline names its time zone

A deadline on a collector surface SHALL use the viewer's local zone. When it
names the zone, the name SHALL be that viewer's short name at that instant
(`HKT`, `EDT`). It SHALL NOT pin `HKT` for every reader. Relative remaining
time SHALL carry no zone.

A deadline on an invoice, receipt, terms page, or email SHALL be stated in
Asia/Hong_Kong and SHALL name **GMT+8**.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-jjm rev=1 -->
#### Scenario: shared-dates-and-times-SC-12 - The auction page shows a close
**Serves:** Stated zones - a collector deadline follows the viewer

- **GIVEN** a listing open for bids
- **WHEN** its close time is rendered on the auction page for two viewers in different zones
- **THEN** each rendering uses that viewer's local clock
- **AND** each names that viewer's short zone
- **AND** the New York rendering is not suffixed `HKT`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-h8g rev=1 -->
#### Scenario: shared-dates-and-times-SC-13 - A page and a message disagree on the zone name
**Serves:** Stated zones - mail names GMT+8; the page follows the viewer

- **GIVEN** the same listing's close shown on the auction page and in an auction email
- **WHEN** both are rendered
- **THEN** the email states Asia/Hong_Kong as GMT+8
- **AND** the page states the viewer's local moment

<!-- trace:scenario id=g10.shared-dates-and-times.SC-upj rev=1 -->
#### Scenario: shared-dates-and-times-SC-14 - A closed listing
**Serves:** Stated zones - a closed listing follows the viewer

- **GIVEN** a listing that has already closed
- **WHEN** its close time is rendered on a collector surface
- **THEN** the rendering uses the viewer's local clock
- **AND** it names that viewer's short zone

### Requirement: A message the platform sends states one zone

A date rendered into a message the platform sends — an email, a notification —
SHALL be stated in Asia/Hong_Kong, SHALL name **GMT+8**, and SHALL be worded in
English regardless of where the message is opened.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-ec5 rev=1 -->
#### Scenario: shared-dates-and-times-SC-15 - An auction email states GMT+8
**Serves:** Sent messages - a message states GMT+8

- **GIVEN** an auction email carrying a close time
- **WHEN** the message is rendered
- **THEN** the time is stated in Asia/Hong_Kong
- **AND** the rendering names `GMT+8`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-ufo rev=1 -->
#### Scenario: shared-dates-and-times-SC-16 - Two recipients read one time
**Serves:** Sent messages - two recipients read one time

- **GIVEN** two recipients of the same auction email in different countries and different zones
- **WHEN** each opens the message
- **THEN** both read the same text for the close time
- **AND** that text names `GMT+8`

### Requirement: A local moment renders for collectors without naming UTC

A **local moment** SHALL render an instant on collector-facing surfaces in the
viewer's `timeZone` with shape `DD Mon YYYY, HH:MM`, month names from
`locale`, and no `UTC` or `HKT` suffix.

Operator tables and admin surfaces SHALL continue to use the UTC moment shape.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-uu8 rev=1 -->
#### Scenario: shared-dates-and-times-SC-23 - Two zones read different clocks
**Serves:** Stated zones - a collector reads their local zone

- **GIVEN** the same instant rendered for readers in `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each reads it as a local moment in English
- **THEN** the clock values differ
- **AND** neither string contains `UTC` or `HKT`
