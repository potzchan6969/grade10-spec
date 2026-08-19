## Purpose

How a stored instant becomes text a person reads, and how a calendar day a
person types becomes an instant.

Every date the platform holds is an instant — a single point in time, with no
zone of its own. This capability governs what happens between that instant
and a reader: which shape it takes, whether the shape names a time zone, and
which locale decides its wording. It binds every Grade10 surface that shows a
date: storefront pages, admin panels, demos, and the messages the platform
sends. It also governs the one place the traffic runs the other way — a
calendar day an operator types into a date field, which carries no time and
no zone and has to become instants before a worker can store it.

Which zone a reader is in, and whether the platform ever records one, are
decided elsewhere and unchanged here.

## ADDED Requirements

### Requirement: A date takes one of four shapes

The platform SHALL render an instant in exactly four shapes, and every
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

#### Scenario: Two operator tables show one moment the same way

- **GIVEN** an order table and a member ledger table each showing the same instant
- **WHEN** each row is rendered for the same reader
- **THEN** both show identical text

#### Scenario: The same shape across both brands

- **GIVEN** the same instant shown in the grade10 admin panel and the zzz admin panel
- **WHEN** each is rendered for the same reader
- **THEN** both show identical text

#### Scenario: A day carries no time

- **GIVEN** a surface showing when a member joined
- **WHEN** it is rendered
- **THEN** it shows the calendar date
- **AND** it shows no time of day

#### Scenario: An audit entry is ordered to the second

- **GIVEN** two audit entries recorded eleven seconds apart in the same minute
- **WHEN** the log is rendered
- **THEN** the two entries show different times

#### Scenario: A reader reads their own locale

- **GIVEN** two readers of the same date whose locales order and word dates differently
- **WHEN** the date is rendered for each
- **THEN** each sees their own locale's ordering and wording

### Requirement: A deadline names its time zone

Any rendering of an instant a reader is expected to act before SHALL name the
time zone it is stated in. An auction's close is such an instant on every
surface that shows it.

#### Scenario: The auction page shows a close

- **GIVEN** a listing open for bids
- **WHEN** its close time is rendered on the auction page
- **THEN** the rendering names the time zone it is stated in

#### Scenario: A page and a message agree

- **GIVEN** the same listing's close shown on the auction page and in an auction email
- **WHEN** both are rendered
- **THEN** both name the zone they are stated in
- **AND** both use the deadline shape

#### Scenario: A closed listing

- **GIVEN** a listing that has already closed
- **WHEN** its close time is rendered
- **THEN** the rendering names the time zone it is stated in

### Requirement: A message the platform sends states one zone

A date rendered into a message the platform sends — an email, a notification
— SHALL be stated in a single fixed zone, named in the rendering, and SHALL
be worded in English regardless of any reader's locale.

A message is composed once and read anywhere, so it has no reader whose zone
or language could be used.

#### Scenario: An auction email states its zone

- **GIVEN** an auction email carrying a close time
- **WHEN** the message is rendered
- **THEN** the time is stated in one fixed zone
- **AND** the rendering names that zone

#### Scenario: Two recipients read one time

- **GIVEN** two recipients of the same auction email in different locales and different zones
- **WHEN** each opens the message
- **THEN** both read the same text for the close time

### Requirement: A typed calendar day covers that whole day

A calendar day a person types into a date field SHALL become the instant that
day begins and the instant it ends, both in that person's own zone, so a
window stated as two days includes every moment of both.

An instant shown back in such a field SHALL be the calendar day that instant
falls on in that person's own zone, so a day typed in and read back is the
same day.

#### Scenario: A window includes the last moment of its final day

- **GIVEN** a window typed as beginning and ending on stated calendar days
- **WHEN** it is stored
- **THEN** an event in the final second of the final day falls inside the window

#### Scenario: A day reads back as it was typed

- **GIVEN** a calendar day typed into a date field and stored
- **WHEN** the stored instant is shown in that field again
- **THEN** the field shows the day that was typed

#### Scenario: An empty date field

- **GIVEN** a date field left empty
- **WHEN** the form is read
- **THEN** no instant is produced for it
