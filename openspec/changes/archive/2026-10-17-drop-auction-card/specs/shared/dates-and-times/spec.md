# shared/dates-and-times Specification

## MODIFIED Requirements

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
