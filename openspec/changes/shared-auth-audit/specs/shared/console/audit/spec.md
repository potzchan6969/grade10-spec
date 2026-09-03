## Purpose

The auditor's merged trail on both brands' consoles: how they filter, sort,
inspect, and jump to a break, without email or hashes.

## Feature set

- Merged trail table
  - Subject column: a row names the subject user id when there is one
  - Readable action: a name a person can read; the recorded identity remains
  - Time order: newest-first by default; oldest-first as a choice
- Trail filters
  - Combinable filters: product, action, actor id, subject id, result, date range
  - Location restores: opening a location restores filters and sort
  - Empty matches: filters that match nothing are distinct from an empty trail
- Row inspection
  - Expand details: actor roles and recorded details; no hashes, email, or recovery codes
  - Copy user id: actor and subject ids can be copied
  - Directory link: actor and subject link to the account only when the operator can open the directory
- Chain navigation
  - Quiet strip: when every requested chain is reading and internally consistent, one line says so
  - Issue strip: a chain that is not names itself in a notice; a break still jumps
  - Jump to break: a chain broken at a position opens that product at that position

## User journeys

### console-audit-US-01: Auditor isolates writes on the merged trail

**As an** auditor,
**I want** the merged trail filtered and ordered by time,
**so that** I can see one person's writes without paging past other products.

**Accepted by:**

- `console-audit-SC-01` — Filters combine
- `console-audit-SC-02` — A date range covers both calendar days
- `console-audit-SC-03` — Newest-first is the default
- `console-audit-SC-04` — Oldest-first orders by time
- `console-audit-SC-05` — Audit offers no email filter
- `console-audit-SC-06` — The trail never returns an email
- `console-audit-SC-07` — The location restores filters and sort
- `console-audit-SC-08` — No matches is not an empty trail
- `console-audit-SC-09` — One product's silence does not hold a filtered page

### console-audit-US-02: Auditor inspects a trail row

**As an** auditor,
**I want** subject, a readable action, roles, and details on a row,
**so that** I can name who was acted on without email or hashes.

**Accepted by:**

- `console-audit-SC-10` — A row names the subject user id
- `console-audit-SC-11` — The action has a readable name
- `console-audit-SC-12` — Expanding shows roles and details
- `console-audit-SC-13` — Actor and subject ids can be copied
- `console-audit-SC-14` — Directory links only when the operator can open Users
- `console-audit-SC-15` — Email and hashes stay off the row

### console-audit-US-03: Auditor jumps to a chain break

**As an** auditor,
**I want** a chain broken at a position to open that row,
**so that** I land on the break instead of paging to it.

**Accepted by:**

- `console-audit-SC-16` — A broken chain opens at that position

### console-audit-US-04: Auditor sees chain health without a product list

**As an** auditor,
**I want** one line when every chain is reading, and a notice only when one is not,
**so that** the trail is not buried under seven identical rows.

**Accepted by:**

- `console-audit-SC-17` — A quiet trail is one line; an issue is a notice

## ADDED Requirements

### Requirement: The trail table names subject, action, and time order

Both brands' Audit sections SHALL show one merged trail of every product
chain the operator can read. Each row SHALL name when, which product, the
position on that product's chain, the actor's user id, the subject's user id
when there is one, the action, and whether it succeeded. A row with no
subject SHALL still render, without inventing a subject.

The action SHALL be shown as a readable name. The recorded action identity
SHALL remain available on the row. The trail SHALL order by time: newest-first
unless the auditor chooses oldest-first. Newest-first SHALL be the default.

#### Scenario: console-audit-SC-10 - A row names the subject user id

- **GIVEN** a recorded write whose subject is a user id
- **WHEN** the auditor opens the Audit section
- **THEN** that row names that subject user id
- **AND** it does not name them by email

#### Scenario: console-audit-SC-11 - The action has a readable name

- **WHEN** a trail row is shown
- **THEN** the action is shown as a readable name
- **AND** the recorded action identity is still available on the row

#### Scenario: console-audit-SC-03 - Newest-first is the default

- **WHEN** the auditor opens the Audit section with no sort chosen
- **THEN** later writes appear before earlier writes

#### Scenario: console-audit-SC-04 - Oldest-first orders by time

- **WHEN** the auditor chooses oldest-first
- **THEN** earlier writes appear before later writes

### Requirement: The trail filters by product, action, people, result, and days

The auditor SHALL be able to filter the merged trail by product, recorded
action identity, actor user id, subject user id, result (succeeded or
failed), and a date range. Filters SHALL combine: a row remains only when it
matches every filter that is set. Clearing a filter SHALL stop applying it.

A date range SHALL be two calendar days the auditor types — a start day and
an end day. Each day SHALL cover that whole day in the platform's zone, as
`dates-and-times` requires of a typed calendar day. A start day after the
end day SHALL NOT apply. A bound left empty SHALL NOT constrain that side.

WHEN the auditor filters to one product, a different product that does not
answer SHALL NOT hold paging. WHEN no product filter is set, a chain that
does not answer SHALL still hold paging, as it does today.

The Audit section SHALL NOT offer an email filter, SHALL NOT read the
directory for an email, and SHALL NOT search the trail by email. The list
SHALL NOT accept an email field and SHALL NOT return one. Filter by actor
or subject user id.

The current filters and sort SHALL be in the location. Opening that location
SHALL restore them.

WHEN a filtered read succeeds and matches no rows, the surface SHALL say
there are no matches, distinct from a trail that has no writes.

#### Scenario: console-audit-SC-01 - Filters combine

- **GIVEN** writes on more than one product, for more than one subject
- **WHEN** the auditor filters to one product and one subject user id
- **THEN** only rows for that product and that subject remain

#### Scenario: console-audit-SC-02 - A date range covers both calendar days

- **GIVEN** a write in the final second of a calendar day
- **WHEN** the auditor sets a date range whose end day is that day
- **THEN** that write remains

#### Scenario: console-audit-SC-05 - Audit offers no email filter

- **GIVEN** an operator who holds `user:list`
- **WHEN** they open the Audit section
- **THEN** they are not offered an email filter
- **AND** they can still filter by actor or subject user id

#### Scenario: console-audit-SC-06 - The trail never returns an email

- **WHEN** the auditor lists the trail
- **THEN** no row has an email field
- **AND** the list input has no email field

#### Scenario: console-audit-SC-07 - The location restores filters and sort

- **GIVEN** filters and oldest-first sort applied
- **WHEN** the auditor opens that same location
- **THEN** the same filters and sort are applied

#### Scenario: console-audit-SC-08 - No matches is not an empty trail

- **GIVEN** a trail that has writes
- **WHEN** the auditor applies filters that match none of them
- **THEN** the surface says there are no matches
- **AND** that message is distinct from a trail with no writes

#### Scenario: console-audit-SC-09 - One product's silence does not hold a filtered page

- **GIVEN** one product that does not answer
- **WHEN** the auditor filters to a different product that does answer
- **THEN** they can page that product's rows

### Requirement: A row expands without secrets, and ids can be copied or opened

The auditor SHALL be able to expand a row and see the actor's roles at the
time of the write and the recorded details. Expanding SHALL NOT show a
hash, an email, or recovery codes.

The auditor SHALL be able to copy the actor user id and, when present, the
subject user id.

WHEN the operator can open an account in the users directory, the actor user
id and the subject user id SHALL be links to that account. WHEN they cannot,
the ids SHALL be shown and SHALL NOT link.

#### Scenario: console-audit-SC-12 - Expanding shows roles and details

- **WHEN** the auditor expands a row that has recorded details
- **THEN** they see the actor's roles at the time of the write
- **AND** they see those details

#### Scenario: console-audit-SC-13 - Actor and subject ids can be copied

- **WHEN** a row names an actor user id and a subject user id
- **THEN** the auditor can copy each id

#### Scenario: console-audit-SC-14 - Directory links only when the operator can open Users

- **GIVEN** an operator who can open an account in the users directory
- **WHEN** they read a row that names a subject user id
- **THEN** that subject user id is a link to that account
- **AND** an operator who cannot open the directory sees the id and no link

#### Scenario: console-audit-SC-15 - Email and hashes stay off the row

- **WHEN** the auditor expands a row
- **THEN** the row does not show an email
- **AND** it does not show a hash

### Requirement: The chain strip stays quiet until a product fails

WHEN every requested chain is reading and internally consistent, the Audit
section SHALL say so in one line under the section description, above the
filters, and SHALL NOT list each product. WHEN a
requested chain is refused, unreachable, unreadable, unverified, or broken,
the section SHALL name that product in a notice and SHALL NOT list the
products that answered. A broken chain SHALL still offer a jump to that
position. A chain that does not answer the page SHALL still say paging is
held.

#### Scenario: console-audit-SC-17 - A quiet trail is one line; an issue is a notice

- **GIVEN** every requested chain is reading and internally consistent
- **WHEN** the auditor opens the Audit section
- **THEN** the strip is one line that says the chains are internally consistent
- **AND** that line sits under the section description and above the filters
- **AND** it does not name each product

- **GIVEN** a requested chain is refused, unreachable, unreadable, unverified, or broken
- **WHEN** the auditor opens the Audit section
- **THEN** that product is named in a notice
- **AND** products that answered are not listed on the strip

#### Scenario: console-audit-SC-16 - A broken chain opens at that position

- **GIVEN** a product chain reported broken at a position
- **WHEN** the auditor jumps to that break
- **THEN** they are on that product's trail
- **AND** the row at that position is shown
