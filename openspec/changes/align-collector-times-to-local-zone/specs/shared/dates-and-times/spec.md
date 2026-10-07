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

The collector clock is the zone the page is given for the viewer, never read
from the machine: an instant on a collector surface is stated in the viewer's
local zone, and a deadline that shows a clock names it. A page that books or
confirms a visit, or a vault or signing page, keeps the shop's clock instead and
is outside that rule: how those pages name their zone is not set here, and a
collector's vault timeline stamp stays UTC. Operator tables, admin surfaces and
the records a machine reads state UTC, except an admin surface whose own spec
keeps a shop's clock, as the vault console and the appointments diary do. A
message, invoice (the application's invoice page included), receipt or terms
page states the brand's zone as GMT+8. A calendar day the business judges is
always judged on the brand's own zone, because a day is a fact about where the
business stands rather than about where its reader does. The day a collector
deadline shows is not judged this way: it is the day in the viewer's zone.

## Feature set

- Stated zones
  - UTC for operators: operator tables, admin surfaces and the records a machine reads, an export or the audit trail, state Coordinated Universal Time, except an admin surface whose own spec keeps a shop's clock, as the vault console and the appointments diary do
  - Documents as GMT+8: invoices, including the invoice page, receipts, terms and emails state Asia/Hong_Kong as GMT+8
  - Supplied, not read: a collector clock uses the zone it is given, so one instant reads the same text on any machine
  - Name by the instant: a deadline names the viewer's short zone as it stands at that instant, EDT in summer and EST in winter
  - Named deadlines: a collector deadline that shows a clock names the viewer's zone, a closed lot's close time included; a deadline that shows only a day reads that day in the viewer's zone and names none
  - Shop's clock: a page that books or confirms a visit, or a vault or signing page, keeps the shop's clock and is outside the viewer-zone rule; how those pages name their zone is not set here, and a collector's vault timeline stamps stay UTC
  - Offset names: where US English has no short name for a zone, it reads as its offset in English, `GMT+9` for Seoul, in every language
- Refusals
  - Unrecognised zone: a zone the platform does not recognise fails with an error naming it, rather than reading as UTC or as the machine's
- Sent messages
  - Stated zone: a time in a message names GMT+8, after the time or once in a footer that says so, so every recipient reads the same time
  - A day with no clock: a calendar day stated without a time names no zone

## MODIFIED Requirements

### Requirement: Each rendering states the zone its surface requires

Every instant the platform renders SHALL be stated in one named zone.
Collector-facing activity time, local moments, and collector deadlines SHALL
use the viewer's local zone, supplied as `timeZone` (the zone the reader's
environment is in), except on a document, which states Asia/Hong_Kong, and on a
page that books or confirms a visit, or a vault or signing page, which keeps the
shop's clock; a collector's vault timeline stamp on those pages stays in
Coordinated Universal Time. Operator tables, admin surfaces and the records a
machine reads, an export or the audit trail, SHALL state Coordinated Universal
Time, except an admin surface whose own spec keeps a shop's clock, as the vault
console and the appointments diary do. The invoice page, invoice and receipt PDFs, terms, and emails
are documents and SHALL state Asia/Hong_Kong. How a page that keeps the shop's
clock names its zone is not set here.

A zone name the platform does not recognise SHALL stop the render with an
error naming it, as an instant that is not a valid point in time does.

A surface that judges a calendar day for the business (a due date, an expiry, a
queue, an age, a document's expiry, a report's month) SHALL keep using the
brand's zone, so the day it shows is the day the brand's own counter, paper and
records are on. The day a collector deadline shows is not judged for the
business: it SHALL be the day in the viewer's zone, unless the surface's own
spec fixes its zone, which it keeps.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-q9s rev=1 -->
#### Scenario: shared-dates-and-times-SC-10 - Operator readers in different zones
**Serves:** Stated zones - operator surfaces state UTC

- **GIVEN** the same instant rendered for a reader whose machine is set east of UTC and one set west of it
- **WHEN** each renders it in an operator table
- **THEN** both show identical text

<!-- trace:scenario id=g10.shared-dates-and-times.SC-4uc rev=2 -->
#### Scenario: shared-dates-and-times-SC-11 - An instant near midnight
**Serves:** Stated zones - a stated zone near midnight

- **GIVEN** an instant that falls on one calendar date in UTC and the next in the brand's zone
- **WHEN** it is rendered as a day the business judges (a due date, an expiry, a queue, an age, a document's expiry, a report's month) on that brand's surface
- **THEN** the day shown is the brand's
- **AND** every surface of that brand shows the same one

<!-- trace:scenario id=g10.shared-dates-and-times.SC-hy6 rev=1 -->
#### Scenario: shared-dates-and-times-SC-31 - A collector clock ignores the machine's zone
**Serves:** Stated zones - a collector clock is supplied and never read from the machine

- **GIVEN** the same instant and the same supplied `timeZone`, rendered on one machine set east of UTC and one set west of it
- **WHEN** each renders it as a local moment and as a collector deadline
- **THEN** both show identical text for each

<!-- trace:scenario id=g10.shared-dates-and-times.SC-fe1 rev=1 -->
#### Scenario: shared-dates-and-times-SC-34 - An unrecognised zone stops the render
**Serves:** Refusals - an unrecognised zone fails rather than reading as UTC or as the machine's

- **GIVEN** a collector clock supplied with a zone name the platform does not recognise
- **WHEN** an instant is rendered on it as a local moment or as a collector deadline
- **THEN** the render fails with an error naming that zone
- **AND** no time is shown in UTC or in the machine's zone instead

<!-- trace:scenario id=g10.shared-dates-and-times.SC-gkv rev=1 -->
#### Scenario: shared-dates-and-times-SC-39 - An admin surface whose own spec keeps a shop's clock
**Serves:** `Stated zones` - one instant is walked through an operator table and the vault console

- **GIVEN** an instant at 2026-10-07T06:00:00Z on a vault case kept at a shop on `Asia/Hong_Kong`
- **WHEN** it is rendered in an operator table whose spec keeps no shop's clock, and on that case's page in the vault console
- **THEN** the operator table reads it at `06:00` in Coordinated Universal Time
- **AND** the vault console reads it at `14:00` on the shop's clock

<!-- trace:scenario id=g10.shared-dates-and-times.SC-msf rev=1 -->
#### Scenario: shared-dates-and-times-SC-40 - The collector's vault history stays in Coordinated Universal Time
**Serves:** `Stated zones` - one timeline entry is walked through the collector's vault history and the vault console

- **GIVEN** a timeline entry at 2026-10-07T06:00:14Z on a vault case kept at a shop on `Asia/Hong_Kong`
- **WHEN** it is rendered on the collector's vault history and on the vault console's timeline
- **THEN** the collector's vault history reads it at `06:00:14` in Coordinated Universal Time
- **AND** the vault console reads it at `14:00:14`

### Requirement: A deadline names its time zone

A deadline on a collector surface SHALL use the viewer's local zone, except on a
page that books or confirms a visit, or a vault or signing page, which keeps the
shop's clock and is outside this rule. A closed lot's close time is a deadline on
a collector surface. Relative remaining time SHALL carry no zone.

A deadline in the viewer's zone that shows a clock SHALL name that zone. One
that shows only a day SHALL name none, because a zone belongs to a clock, and
SHALL state that day in the viewer's zone, unless the surface's own spec fixes
its zone, which it keeps. The name SHALL be that viewer's short name at that
instant (`HKT`, `EDT`), and SHALL NOT pin `HKT` for every reader. A local moment
and an older activity row are not deadlines and SHALL name none. A
collector's vault timeline stamp stays in Coordinated Universal Time, and how a page that keeps
the shop's clock names its zone is not set here.

A viewer's zone name SHALL be the zone's short name in US English, whatever
language the reader uses, and Hong Kong SHALL read `HKT`. Where US English has
no short name for the zone, the name SHALL be the offset in English at that
instant (`GMT+9` for Seoul, `GMT+5:30` for Kolkata, `GMT-2:30` for Newfoundland
in summer). A zone at zero offset SHALL read `GMT`: a viewer in UTC reads `GMT`,
and one in London in winter reads `GMT`.

Until the browser reports the viewer's zone, a collector deadline MAY read in
UTC and name it `GMT`, and SHALL switch to the viewer's zone once it is known.

A deadline on an invoice, receipt, terms page, or email SHALL be stated in
Asia/Hong_Kong, and one that shows a clock SHALL name **GMT+8**. The
application's invoice page is an invoice: it SHALL state Asia/Hong_Kong as
**GMT+8**, as the PDF does, and not the viewer's zone.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-jjl rev=2 -->
#### Scenario: shared-dates-and-times-SC-12 - The auction page shows a close
**Serves:** Stated zones - a collector deadline follows the viewer

- **GIVEN** a listing open for bids
- **WHEN** its close time is rendered on the auction page for two viewers in different zones, once each viewer's zone is known
- **THEN** each rendering uses that viewer's local clock
- **AND** each names that viewer's short zone
- **AND** the New York rendering is not suffixed `HKT`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-k76 rev=2 -->
#### Scenario: shared-dates-and-times-SC-13 - A page and a message disagree on the zone name
**Serves:** Stated zones - mail names GMT+8; the page follows the viewer

- **GIVEN** the same listing's close shown on the auction page and in an auction email
- **WHEN** both are rendered, once the viewer's zone is known
- **THEN** the email states Asia/Hong_Kong as GMT+8
- **AND** the page states the close as the viewer's deadline, in the viewer's zone and naming it

<!-- trace:scenario id=g10.shared-dates-and-times.SC-upi rev=2 -->
#### Scenario: shared-dates-and-times-SC-14 - A closed listing
**Serves:** Stated zones - a closed listing follows the viewer

- **GIVEN** a listing that has already closed
- **WHEN** its close time is rendered with a clock on a collector surface, once the viewer's zone is known
- **THEN** the rendering uses the viewer's local clock
- **AND** it names that viewer's short zone

<!-- trace:scenario id=g10.shared-dates-and-times.SC-apa rev=1 -->
#### Scenario: shared-dates-and-times-SC-38 - A deadline that shows only a day names no zone
**Serves:** Stated zones - a deadline that shows only a day names no zone

- **GIVEN** a listing that closed at 2027-09-01T23:30:00Z and whose opening time is not known, shown on the lot page at full width, where the closed block shows its time column, to a viewer in `Asia/Hong_Kong` and to one in `America/New_York`
- **WHEN** each lot page's closed block renders the close as a day alone, once the viewer's zone is known
- **THEN** each reads the close day in that viewer's zone, the 2nd of September in Hong Kong and the 1st in New York
- **AND** no zone name follows either day

<!-- trace:scenario id=g10.shared-dates-and-times.SC-pi9 rev=1 -->
#### Scenario: shared-dates-and-times-SC-30 - A short zone name follows the date of the instant
**Serves:** Stated zones - the name a collector reads is the one in force at the close

- **GIVEN** a viewer in `America/New_York` and two closes, one on 1 September 2026 and one on 15 January 2027
- **WHEN** each is rendered as a collector deadline in English
- **THEN** the September close names `EDT`
- **AND** the January close names `EST`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-n43 rev=1 -->
#### Scenario: shared-dates-and-times-SC-32 - A relative remaining time carries no zone
**Serves:** Stated zones - a relative remaining time names no zone

- **GIVEN** an open listing whose close is some hours away, shown to a viewer in `America/New_York`
- **WHEN** its remaining time is rendered on the lot page
- **THEN** it reads the time left
- **AND** it names no zone

<!-- trace:scenario id=g10.shared-dates-and-times.SC-hl5 rev=1 -->
#### Scenario: shared-dates-and-times-SC-33 - A zone with no regional short name reads as its offset
**Serves:** Stated zones - a zone with no regional short name reads as its offset

- **GIVEN** a viewer in `Asia/Seoul` and a close at 2027-09-01T12:00:00Z
- **WHEN** it is rendered as a collector deadline in English and in Korean
- **THEN** the clock reads 21:00 in both
- **AND** both name `GMT+9`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-r3c rev=1 -->
#### Scenario: shared-dates-and-times-SC-37 - The invoice page states GMT+8 for every viewer
**Serves:** Stated zones - the invoice page reads one clock for every viewer

- **GIVEN** an invoice with a payment deadline at 2026-09-19T09:00:00Z, opened on the invoice page by a viewer in `Asia/Hong_Kong` and by one in `America/New_York`
- **WHEN** each page renders the payment deadline
- **THEN** both state it in Asia/Hong_Kong, at 17:00
- **AND** both name `GMT+8`
- **AND** neither names `HKT` or `EDT`

### Requirement: A local moment renders for collectors without naming UTC

A **local moment** SHALL render an instant on collector-facing surfaces in the
viewer's `timeZone` with shape `DD Mon YYYY, HH:MM`, month names from
`locale`, and no `UTC` or `HKT` suffix.

Operator tables and admin surfaces SHALL continue to use the UTC moment shape,
except an admin surface whose own spec keeps a shop's clock.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-uu7 rev=1 -->
#### Scenario: shared-dates-and-times-SC-23 - Two zones read different clocks
**Serves:** Stated zones - a collector reads their local zone

- **GIVEN** the same instant rendered for readers in `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each reads it as a local moment in English
- **THEN** the clock values differ
- **AND** neither string contains `UTC` or `HKT`

### Requirement: A message the platform sends states one zone

A date and time rendered into a message the platform sends (an email, a
notification) SHALL be stated in Asia/Hong_Kong, SHALL name **GMT+8**, and SHALL
be worded in English regardless of where the message is opened. The message
names GMT+8 after the time or, where every date and time in it is on that
clock, once in its footer.

A calendar day stated with no clock SHALL name no zone: a zone belongs to a
clock, and the day is the brand's.

A message is composed once and read anywhere, so it has no reader whose
language could be used, and the zone it states is the brand's, so every
recipient reads the same Hong Kong clock labelled GMT+8.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-v5n rev=1 -->
#### Scenario: shared-dates-and-times-SC-15 - An auction email states GMT+8
**Serves:** Sent messages - a message states GMT+8

- **GIVEN** an auction email carrying a close time
- **WHEN** the message is rendered
- **THEN** the time is stated in Asia/Hong_Kong
- **AND** the rendering names `GMT+8`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-ufn rev=1 -->
#### Scenario: shared-dates-and-times-SC-16 - Two recipients read one time
**Serves:** Sent messages - two recipients read one time

- **GIVEN** two recipients of the same auction email in different countries and different zones
- **WHEN** each opens the message
- **THEN** both read the same text for the close time
- **AND** that text names `GMT+8`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-6rx rev=1 -->
#### Scenario: shared-dates-and-times-SC-35 - A letter's footer names GMT+8
**Serves:** Sent messages - a message states GMT+8

- **GIVEN** a grading letter or a vault letter that states a date and a time, or only a calendar day
- **WHEN** the letter is rendered
- **THEN** any time it states is stated in Asia/Hong_Kong
- **AND** the footer of a grading letter reads `Dates and times are Hong Kong time (GMT+8).`
- **AND** the footer of a vault letter reads `Dates and times are in Hong Kong time (GMT+8).`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-7pr rev=1 -->
#### Scenario: shared-dates-and-times-SC-36 - A day with no clock names no zone
**Serves:** Sent messages - a day with no clock names no zone

- **GIVEN** a message that states a calendar day with no time
- **WHEN** the message is rendered
- **THEN** the day is the Hong Kong calendar day
- **AND** no zone name follows it
