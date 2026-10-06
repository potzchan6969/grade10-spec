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
vault timeline stamp stays UTC. Operator tables and admin surfaces state UTC. A
message, invoice (the application's invoice page included), receipt or terms
page states the brand's zone as GMT+8. A calendar day the business judges is
always judged on the brand's own zone, because a day is a fact about where the
business stands rather than about where its reader does. The day a collector
deadline shows is not judged this way: it is the day in the viewer's zone.

## Feature set

- Reading shapes
  - Platform shapes: a day, a moment, an event, and a deadline, one per the reader's task
  - Collector shapes: relative activity time and local moment for recent and historical activity
  - Shape consistency: two surfaces showing one instant in one shape show identical text
- Format and language
  - Platform format: ordering and punctuation are the platform's, not a browser's configuration
  - Named language: every rendering accepts the language its words are drawn from, English where none is named
- Stated zones
  - UTC for operators: operator tables and admin surfaces state Coordinated Universal Time
  - Reader zone for collectors: activity time and local moments use the viewer's local time zone
  - Documents as GMT+8: invoices, including the invoice page, receipts, terms and emails state Asia/Hong_Kong as GMT+8
  - The brand's day: a calendar judgement — a contract's date, a due date, a "today" queue, an age, a document's expiry, a report's month — is made on the brand's zone
  - Named deadlines: a collector deadline that shows a clock names the viewer's zone, a closed lot's close time included; a deadline that shows only a day reads that day in the viewer's zone and names none
  - Supplied, not read: a collector clock uses the zone it is given, so one instant reads the same text on any machine
  - Name by the instant: a deadline names the viewer's short zone as it stands at that instant, EDT in summer and EST in winter
  - Shop's clock: a page that books or confirms a visit, or a vault or signing page, keeps the shop's clock and is outside the viewer-zone rule; how those pages name their zone is not set here, and vault timeline stamps stay UTC
  - Offset names: where US English has no short name for a zone, it reads as its offset in English, `GMT+9` for Seoul, in every language
- Refusals
  - Unshipped language: a language the platform has no words for fails rather than degrading quietly
  - Invalid instant: an instant that is not a valid point in time fails rather than rendering placeholder text
  - Unrecognised zone: a zone the platform does not recognise fails with an error naming it, rather than reading as UTC or as the machine's
- Sent messages
  - English wording: a message is composed once and read anywhere, so no reader's language words it
  - Stated zone: a time in a message names GMT+8, after the time or once in a footer that says so, so every recipient reads the same time
  - A day with no clock: a calendar day stated without a time names no zone
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

<!-- trace:scenario id=g10.shared-dates-and-times.SC-z12 rev=1 -->
#### Scenario: shared-dates-and-times-SC-01 - Two operator tables show one moment the same way
**Serves:** Reading shapes - two surfaces show one instant the same way

- **GIVEN** an order table and a member ledger table each showing the same instant
- **WHEN** each row is rendered for the same reader
- **THEN** both show identical text

<!-- trace:scenario id=g10.shared-dates-and-times.SC-7tx rev=1 -->
#### Scenario: shared-dates-and-times-SC-02 - The same shape across both brands
**Serves:** Reading shapes - one shape across both brands

- **GIVEN** the same instant shown in the grade10 admin panel and the zzz admin panel
- **WHEN** each is rendered for the same reader
- **THEN** both show identical text

<!-- trace:scenario id=g10.shared-dates-and-times.SC-8no rev=1 -->
#### Scenario: shared-dates-and-times-SC-03 - A day carries no time
**Serves:** Reading shapes - a day carries no time

- **GIVEN** a surface showing when a member joined
- **WHEN** it is rendered
- **THEN** it shows the calendar date
- **AND** it shows no time of day

<!-- trace:scenario id=g10.shared-dates-and-times.SC-fwr rev=1 -->
#### Scenario: shared-dates-and-times-SC-04 - An audit entry is ordered to the second
**Serves:** Reading shapes - an audit entry ordered to the second

- **GIVEN** two audit entries recorded eleven seconds apart in the same minute
- **WHEN** the log is rendered
- **THEN** the two entries show different times

<!-- trace:scenario id=g10.shared-dates-and-times.SC-e9f rev=1 -->
#### Scenario: shared-dates-and-times-SC-05 - One reader, two browsers
**Serves:** Reading shapes - the platform's shape, not the browser's

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

<!-- trace:scenario id=g10.shared-dates-and-times.SC-yw4 rev=1 -->
#### Scenario: shared-dates-and-times-SC-06 - A month name in another language
**Serves:** Format and language - a month name in a named language

- **GIVEN** a date rendered with a language named by the caller
- **WHEN** it is rendered
- **THEN** the month's wording is drawn from that language
- **AND** the ordering and punctuation are unchanged from the platform's format

<!-- trace:scenario id=g10.shared-dates-and-times.SC-3iq rev=1 -->
#### Scenario: shared-dates-and-times-SC-07 - No language named
**Serves:** Format and language - English where no language is named

- **GIVEN** a date rendered with no language named by the caller
- **WHEN** it is rendered
- **THEN** its words are English

<!-- trace:scenario id=g10.shared-dates-and-times.SC-dfo rev=1 -->
#### Scenario: shared-dates-and-times-SC-08 - A language the platform does not ship
**Serves:** Refusals - an unshipped language fails rather than degrading

- **WHEN** a low-level operator or message formatter is called with a language the platform has no words for
- **THEN** the rendering fails with an error naming that language

### Requirement: A date that is not a date stops the render

An attempt to render an instant that is not a valid point in time SHALL fail
with an error. No surface SHALL render placeholder text in place of a date.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-d40 rev=1 -->
#### Scenario: shared-dates-and-times-SC-09 - An invalid instant
**Serves:** Refusals - an invalid instant fails rather than rendering placeholder text

- **WHEN** a surface renders an instant that is not a valid point in time
- **THEN** the rendering fails with an error
- **AND** no placeholder date text is shown to the reader

### Requirement: Each rendering states the zone its surface requires

Every instant the platform renders SHALL be stated in one named zone.
Collector-facing activity time, local moments, and collector deadlines SHALL
use the viewer's local zone, supplied as `timeZone` (the zone the reader's
environment is in), except on a document, which states Asia/Hong_Kong, and on a
page that books or confirms a visit, or a vault or signing page, which keeps the
shop's clock; a vault timeline stamp on those pages stays in Coordinated
Universal Time. Operator tables and admin surfaces SHALL state Coordinated
Universal Time. The invoice page, invoice and receipt PDFs, terms, and emails
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

### Requirement: A brand judges a calendar day on its own zone

Every judgement about which calendar day an instant falls on SHALL be made on
the zone of the brand the judgement belongs to. This binds, at least: when a
loan term ends, when a written notice's cure period ends, which cases count as
visited today, whether a person has reached an age, whether an identity
document has expired, the day a document is dated, and the month a report is
cut to.

The brand's zone SHALL be held once, per brand, and passed explicitly by the
code that means a calendar day. It SHALL NOT be read from a reader's machine,
and SHALL NOT be stored on a record: a record holds an instant, and which day
it falls on is a question asked when it is read.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-4pe rev=1 -->
#### Scenario: shared-dates-and-times-SC-25 - A term ends at the borrower's midnight
**Serves:** Stated zones - the brand's day ends at its own midnight

- **GIVEN** a loan advanced on a day at a brand's shop
- **WHEN** its term ends
- **THEN** the due instant is the last moment of that calendar day in the brand's zone

<!-- trace:scenario id=g10.shared-dates-and-times.SC-egt rev=1 -->
#### Scenario: shared-dates-and-times-SC-26 - A queue cut in the morning
**Serves:** Stated zones - a queue cut on the brand's day

- **GIVEN** a visit booked for later today at the shop, read at seven in the morning there
- **WHEN** the day's queue is cut
- **THEN** the visit is in it, though UTC's date is still yesterday's

<!-- trace:scenario id=g10.shared-dates-and-times.SC-34o rev=1 -->
#### Scenario: shared-dates-and-times-SC-27 - A birthday at the counter
**Serves:** Stated zones - an age judged on the brand's day

- **GIVEN** a person whose eighteenth birthday is today at the shop and yesterday's date in UTC
- **WHEN** their identity is judged
- **THEN** they are an adult

<!-- trace:scenario id=g10.shared-dates-and-times.SC-xyg rev=1 -->
#### Scenario: shared-dates-and-times-SC-28 - A document expiring today
**Serves:** Stated zones - an expiry judged on the brand's day

- **GIVEN** a document whose expiry day has ended at the shop but not in UTC
- **WHEN** it is judged
- **THEN** it is expired

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
and an older activity row are not deadlines and SHALL name none. A vault
timeline stamp stays in Coordinated Universal Time, and how a page that keeps
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

### Requirement: A typed calendar day covers that whole day

A calendar day a person types into a date field SHALL become the instant that
day begins and the instant it ends, both in the zone the surface states, which
on a brand's own surface is the brand's, so a window stated as two days
includes every moment of both.

An instant shown back in such a field SHALL be the calendar day that instant
falls on in the zone the surface states, so a day typed in and read back is the
same day, from any machine.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-9og rev=1 -->
#### Scenario: shared-dates-and-times-SC-17 - A window includes the last moment of its final day
**Serves:** Typed calendar days - a window includes both days entirely

- **GIVEN** a window typed as beginning and ending on stated calendar days
- **WHEN** it is stored
- **THEN** an event in the final second of the final day falls inside the window

<!-- trace:scenario id=g10.shared-dates-and-times.SC-s90 rev=1 -->
#### Scenario: shared-dates-and-times-SC-18 - A day reads back as it was typed
**Serves:** Typed calendar days - read-back symmetry

- **GIVEN** a calendar day typed into a date field and stored
- **WHEN** the stored instant is shown in that field again
- **THEN** the field shows the day that was typed

<!-- trace:scenario id=g10.shared-dates-and-times.SC-1v2 rev=1 -->
#### Scenario: shared-dates-and-times-SC-19 - A day typed from a machine set to another zone
**Serves:** Typed calendar days - read-back from another machine

- **GIVEN** the same calendar day typed by one person whose machine is set east of UTC and one set west of it
- **WHEN** each is stored
- **THEN** both produce the same pair of instants

<!-- trace:scenario id=g10.shared-dates-and-times.SC-2zt rev=1 -->
#### Scenario: shared-dates-and-times-SC-20 - An empty date field
**Serves:** Typed calendar days - an empty field produces no instant

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

<!-- trace:scenario id=g10.shared-dates-and-times.SC-7mm rev=1 -->
#### Scenario: shared-dates-and-times-SC-21 - Just now does not show zero seconds
**Serves:** Reading shapes - relative activity time tiers

- **GIVEN** an instant 30 seconds in the past
- **WHEN** it is rendered as relative activity time in English
- **THEN** the label is `Just now`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-plq rev=1 -->
#### Scenario: shared-dates-and-times-SC-22 - An unsupported browser language reads English
**Serves:** Format and language - English where the browser names no shipped language

- **GIVEN** a collector whose browser prefers Thai and whose site locale resolved to English
- **WHEN** a relative activity time renders
- **THEN** its words are English

### Requirement: A local moment renders for collectors without naming UTC

A **local moment** SHALL render an instant on collector-facing surfaces in the
viewer's `timeZone` with shape `DD Mon YYYY, HH:MM`, month names from
`locale`, and no `UTC` or `HKT` suffix.

Operator tables and admin surfaces SHALL continue to use the UTC moment shape.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-uu7 rev=1 -->
#### Scenario: shared-dates-and-times-SC-23 - Two zones read different clocks
**Serves:** Stated zones - a collector reads their local zone

- **GIVEN** the same instant rendered for readers in `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each reads it as a local moment in English
- **THEN** the clock values differ
- **AND** neither string contains `UTC` or `HKT`

### Requirement: Activity time composes relative and local moment

**Activity time** SHALL apply relative tiers when elapsed is less than seven
days and SHALL fall back to local moment otherwise.

<!-- trace:scenario id=g10.shared-dates-and-times.SC-bhn rev=1 -->
#### Scenario: shared-dates-and-times-SC-24 - Older activity uses a local moment
**Serves:** Reading shapes - activity time falls back to a local moment

- **GIVEN** one instant two minutes in the past and another instant eight days in the past
- **WHEN** both are rendered as activity time in English for `Asia/Hong_Kong`
- **THEN** the recent instant uses the relative minutes tier
- **AND** the older instant uses the local moment shape `DD Mon YYYY, HH:MM`

<!-- trace:scenario id=g10.shared-dates-and-times.SC-loc rev=1 -->
#### Scenario: shared-dates-and-times-SC-29 - Two collectors read different collector clocks
**Serves:** Stated zones - collector surfaces use the viewer's zone

- **GIVEN** the same instant rendered for collectors in `Asia/Hong_Kong` and `America/New_York`
- **WHEN** each reads it as a collector deadline
- **THEN** the clock values differ
- **AND** the Hong Kong string names `HKT`
- **AND** the New York string names `EDT` and does not contain `HKT`
