## Purpose

The diary every brand and every product books into: what a service is, where
a visit happens and what it occupies, when a shop is open, how a bookable
moment is derived from those rules, how a booking takes and keeps its place,
what a product may ask over its binding, and what a booking tells its owner.
It binds the appointment service of both brands and every product that books
a visit; the collector's surface is `grade10-site/appointment/booking` and the
operator's is `grade10-admin/appointment/diary`.

## Feature set

- What a collector books
  - Service: names the visit, how long it takes, the pauses around it, the notice it needs, how far ahead it opens, and who may book it
  - Product-bound service: a visit only the product that owns a case may book, never a collector directly
  - Questions: what a service asks at booking, answered once and kept on the booking
- Where a booking happens
  - Shop: a place with an address and one time zone every wall-clock rule is read in
  - Resource: a desk, a room or a device a booking occupies, so a shop's capacity is its free resources rather than a typed number
  - Assignment: which resources a service runs on, so a shop offers a service only where a resource can take it
- When a shop is open
  - Opening rules: a weekly pattern per shop, and per resource where one keeps its own hours
  - Special dates: a date closed or run on other hours, for a shop or one resource
  - Blocks: a span closed for a shop or a resource, with the reason on record
- How a slot is derived
  - Derived, never stored: a slot is computed from the rules and the bookings at read time
  - Grid and fit: starts fall on the service's increment, inside a window the whole visit fits
  - Notice and horizon: nothing sooner than the service's notice or later than its horizon
  - Buffers: a booking occupies its resource for its visit and the service's pauses around it
  - One clock per shop: wall clocks are read in the shop's zone, and a daylight-saving change never doubles or loses a slot
- How a booking is held
  - One resource per booking: a booking takes one free resource under its shop's lock
  - Lifecycle: booked is the only live state; cancelled, completed and no-show close it
  - Replay and refusal: the same request answers with the same booking, and a conflicting one is refused as data
  - Reschedule: a live booking moves to another slot, or another shop, in one step
- What a product may ask
  - Binding surface: a product lists, books, moves, cancels, closes out and reads its own case's visits, naming the service
  - Product isolation: a product reaches no other product's bookings and no service not bound to it
- What a booking says
  - Record: who is coming, what they answered, how the booking was made, and every transition since
  - Mail: a booking with an address is told of its confirmation, its changes and its reminder, each with a calendar file
- Erasure
  - Anonymization: a person's bookings lose the person and keep the occupancy

## ADDED Requirements

### Requirement: A service names what a collector books

A service SHALL carry the fields below. A service is offered at a shop only
while it is active and at least one active resource of that shop is assigned
to it. Retiring a service SHALL offer it nowhere from that moment and SHALL
leave every booking that names it readable.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Slug | Unique, lowercase letters, digits and hyphens, 1 to 64 characters; the segment a public address carries |
| Name | Trimmed, 1 to 120 characters |
| Description | Trimmed text, may be empty |
| Product | `vault`, `finance`, or none; a service with a product is product-bound |
| Customer bookable | `true` or `false`; a product-bound service is never customer bookable |
| Duration | Minutes the visit takes, **5 to 1440**, a multiple of 5 |
| Increment | Minutes between candidate starts, **5 to 1440**, a multiple of 5 |
| Buffer before | Minutes the resource stays free before the visit, **0 to 1440**, a multiple of 5 |
| Buffer after | Minutes the resource stays free after the visit, **0 to 1440**, a multiple of 5 |
| Minimum notice | Minutes between now and the earliest bookable start, **0 to 43200** |
| Booking horizon | Calendar days from today a booking may reach, **1 to 365** |
| Reminder lead | Minutes before the visit the reminder goes out, **0 to 43200**, or none for no reminder |
| Questions | Zero to **10** questions, in the order they are asked |
| Active | `true` while the service is offered |
| Sort order | Integer; ties sort by name |

#### Scenario: shared-appointment-scheduling-SC-01 - A service is created with its shape
**Serves:** What a collector books - a service is created with its shape

- **WHEN** a service is created with a name, a slug, a duration of 30, an increment of 15, buffers of 0 and 10, a minimum notice of 120, a horizon of 60 and customer bookable `true`
- **THEN** the diary persists it with a new id, active, and offers it at no shop until a resource is assigned

#### Scenario: shared-appointment-scheduling-SC-02 - A service outside its bounds is refused
**Serves:** What a collector books - a service outside its bounds is refused

- **WHEN** a service is created with a duration of 0, or an increment of 7, or a horizon of 400
- **THEN** the diary refuses the create
- **AND** no service is persisted

#### Scenario: shared-appointment-scheduling-SC-03 - A retired service is offered nowhere and its bookings remain
**Serves:** What a collector books - a retired service is offered nowhere and its bookings remain

- **GIVEN** an active service with one live booking
- **WHEN** the service is retired
- **THEN** no shop lists a slot for it
- **AND** the live booking still reads with the service's name and keeps its resource

#### Scenario: shared-appointment-scheduling-SC-04 - A product-bound service is never customer bookable
**Serves:** What a collector books - a product-bound service is never customer bookable

- **WHEN** a service is created with product `vault` and customer bookable `true`
- **THEN** the diary refuses the create

### Requirement: A service asks its questions once

A question SHALL carry the fields below. Booking a service SHALL supply an
answer to every required question and SHALL be refused otherwise. A `choice`
answer SHALL be one of the question's options. Answers SHALL be kept on the
booking as given, keyed by question id, and SHALL NOT change when the service's
questions later change.

| Field | Rules |
| --- | --- |
| Id | Unique within the service, immutable once a booking has answered it |
| Label | Trimmed, 1 to 200 characters |
| Kind | `text` or `choice` |
| Options | For `choice`: 2 to 20 trimmed, distinct options; absent for `text` |
| Required | `true` or `false` |

#### Scenario: shared-appointment-scheduling-SC-05 - A required question left unanswered refuses the booking
**Serves:** What a collector books - a required question left unanswered refuses the booking

- **GIVEN** a service asking one required `text` question
- **WHEN** a booking is requested without an answer to it
- **THEN** the diary refuses the booking with `ANSWERS_INVALID`
- **AND** nothing is written

#### Scenario: shared-appointment-scheduling-SC-06 - A choice outside the options refuses the booking
**Serves:** What a collector books - a choice outside the options refuses the booking

- **GIVEN** a service asking a `choice` question with options `Raw` and `Slabbed`
- **WHEN** a booking answers it `Loose`
- **THEN** the diary refuses the booking with `ANSWERS_INVALID`

#### Scenario: shared-appointment-scheduling-SC-07 - Answers stay on the booking as given
**Serves:** What a collector books - answers stay on the booking as given

- **GIVEN** a booking that answered a question `Slabbed`
- **WHEN** the service's question is later relabelled or removed
- **THEN** the booking still reads the answer `Slabbed` under the question's id

### Requirement: A shop is a place with one time zone

A shop SHALL carry the fields below. Every wall-clock rule of a shop and of
its resources SHALL be read in the shop's time zone. Retiring a shop SHALL
offer no slot at it from that moment and SHALL leave every booking that names
it readable.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Slug | Unique, lowercase letters, digits and hyphens, 1 to 64 characters |
| Name | Trimmed, 1 to 120 characters |
| Time zone | An IANA zone name the platform recognizes |
| Address | Trimmed, 1 to 500 characters |
| Phone | Trimmed, may be absent |
| Active | `true` while the shop takes bookings |
| Sort order | Integer; ties sort by name |

#### Scenario: shared-appointment-scheduling-SC-08 - A wall clock is read in the shop's zone
**Serves:** Where a booking happens - a wall clock is read in the shop's zone

- **GIVEN** a shop in `Asia/Hong_Kong` open Tuesdays 09:00 to 18:00
- **WHEN** slots are listed for a Tuesday
- **THEN** the first slot starts at 01:00 UTC that day and the last visit ends at 10:00 UTC

#### Scenario: shared-appointment-scheduling-SC-09 - A retired shop offers nothing and keeps its bookings
**Serves:** Where a booking happens - a retired shop offers nothing and keeps its bookings

- **GIVEN** an active shop with one live booking
- **WHEN** the shop is retired
- **THEN** no slot is listed for it
- **AND** the live booking still reads with the shop's name and address

### Requirement: A resource is what a booking occupies

A resource SHALL carry the fields below and SHALL belong to exactly one shop.
A booking SHALL occupy exactly one resource. A shop's capacity for a service
at an instant SHALL be the number of active resources of that shop assigned to
the service whose diary offers that instant and that hold no overlapping
occupation. Retiring a resource SHALL offer no slot on it from that moment
and SHALL leave its bookings in place.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Shop | The shop it stands in, immutable |
| Name | Trimmed, 1 to 120 characters, unique within the shop |
| Kind | `desk`, `room` or `device` |
| Active | `true` while it takes bookings |
| Sort order | Integer; the order a free resource is assigned in, ties by name |

#### Scenario: shared-appointment-scheduling-SC-10 - Capacity is the count of free assigned resources
**Serves:** Where a booking happens - capacity is the count of free assigned resources

- **GIVEN** a shop with two active desks assigned to a service and one live booking on the first desk at 10:00
- **WHEN** slots are listed for that day
- **THEN** the 10:00 slot reads a capacity of 2 and a remaining of 1

#### Scenario: shared-appointment-scheduling-SC-11 - A service is offered only where a resource can take it
**Serves:** Where a booking happens - a service is offered only where a resource can take it

- **GIVEN** a shop whose only resource assigned to a service is retired
- **WHEN** the shops offering that service are listed
- **THEN** the shop is not among them

#### Scenario: shared-appointment-scheduling-SC-12 - A retired resource keeps its bookings and takes no more
**Serves:** Where a booking happens - a retired resource keeps its bookings and takes no more

- **GIVEN** a desk with one live booking tomorrow
- **WHEN** the desk is retired
- **THEN** the booking still names the desk
- **AND** no slot is listed on that desk from now on

### Requirement: Opening rules and special dates describe a diary

An opening rule SHALL name a shop, optionally one resource of it, a weekday,
and a start and end minute of the day where `0 <= start < end <= 1440`. A
special date SHALL name a shop, optionally one resource of it, a calendar
date, and either `closed` or a start and end minute that replace every rule
for that date. A shop or a resource SHALL hold at most one special date per
calendar date.

The effective windows of a resource on a date SHALL be derived in this order:

1. *Diary* — **Take the shop's windows**: its special date for that date if
   one exists, otherwise its rules for that weekday
2. *Diary* — **Take the resource's own windows** the same way; a resource with
   no rule and no special date of its own follows the shop's windows
3. *Diary* — **Intersect the two**: a resource is open only where both are
4. *Diary* — **Subtract every block** that covers the shop or the resource

#### Scenario: shared-appointment-scheduling-SC-13 - A weekly rule opens that weekday
**Serves:** When a shop is open - a weekly rule opens that weekday

- **GIVEN** a shop with one rule, Mondays 10:00 to 14:00, and one desk assigned to a 60-minute service
- **WHEN** slots are listed for the coming Monday and Tuesday
- **THEN** Monday offers starts from 10:00 to 13:00 on the service's increment
- **AND** Tuesday offers nothing

#### Scenario: shared-appointment-scheduling-SC-14 - A closed date offers nothing
**Serves:** When a shop is open - a closed date offers nothing

- **GIVEN** a shop open Mondays and a special date `closed` on the coming Monday
- **WHEN** slots are listed for that Monday
- **THEN** nothing is offered

#### Scenario: shared-appointment-scheduling-SC-15 - A special date replaces the rules for that date
**Serves:** When a shop is open - a special date replaces the rules for that date

- **GIVEN** a shop open Mondays 10:00 to 18:00 and a special date on the coming Monday of 12:00 to 15:00
- **WHEN** slots are listed for that Monday
- **THEN** every offered start falls between 12:00 and the last start whose visit ends by 15:00

#### Scenario: shared-appointment-scheduling-SC-16 - A resource with its own hours is open only inside both
**Serves:** When a shop is open - a resource with its own hours is open only inside both

- **GIVEN** a shop open Mondays 10:00 to 18:00 and a room of it with its own rule Mondays 08:00 to 13:00
- **WHEN** slots are listed on that room for a Monday
- **THEN** starts are offered from 10:00 and the last visit ends by 13:00

#### Scenario: shared-appointment-scheduling-SC-17 - A second special date on one date is refused
**Serves:** When a shop is open - a second special date on one date is refused

- **GIVEN** a shop holding a special date on the coming Monday
- **WHEN** another special date is set for the shop on that Monday
- **THEN** the diary replaces the first rather than holding two

### Requirement: A block closes a span

A block SHALL name a shop, optionally one resource of it, a start and an end
instant where the end is after the start, and a trimmed reason of 1 to 200
characters. While a block covers a resource, the diary SHALL offer no slot
whose visit overlaps the block on that resource. A block SHALL NOT cancel or
move a booking already inside its span.

#### Scenario: shared-appointment-scheduling-SC-18 - A shop block closes every resource
**Serves:** When a shop is open - a shop block closes every resource

- **GIVEN** a shop with two desks open all Monday
- **WHEN** the shop is blocked from 12:00 to 14:00 on Monday
- **THEN** no slot whose visit overlaps 12:00 to 14:00 is offered on either desk

#### Scenario: shared-appointment-scheduling-SC-19 - A resource block closes that resource alone
**Serves:** When a shop is open - a resource block closes that resource alone

- **GIVEN** a shop with two desks open all Monday
- **WHEN** the first desk is blocked from 12:00 to 14:00 on Monday
- **THEN** the 12:00 slot reads a capacity of 1 and is still offered on the second desk

#### Scenario: shared-appointment-scheduling-SC-20 - A block over a booking leaves the booking in place
**Serves:** When a shop is open - a block over a booking leaves the booking in place

- **GIVEN** a live booking at 12:00 on a desk
- **WHEN** the desk is blocked from 11:00 to 15:00 that day
- **THEN** the booking is still live on that desk
- **AND** the day's diary shows both the block and the booking

### Requirement: A slot is derived at read time

The diary SHALL derive a service's slots at a shop from the rules and the
bookings when they are read, and SHALL store no slot. Within an effective
window a candidate start SHALL be the window's start plus a whole number of
the service's increment; a candidate is offered only when the whole visit,
from the start to the start plus the service's duration, fits inside one
window of at least one free assigned resource. A listing SHALL answer each
offered slot with its start, its end, its capacity and its remaining count,
and SHALL cover at most **62 days**.

#### Scenario: shared-appointment-scheduling-SC-21 - Starts fall on the increment inside the window
**Serves:** How a slot is derived - starts fall on the increment inside the window

- **GIVEN** a shop open 09:00 to 18:00 and a 45-minute service with a 15-minute increment
- **WHEN** slots are listed for that day
- **THEN** the starts are 09:00, 09:15 and every 15 minutes up to 17:15
- **AND** 17:30 is not offered because its visit would end after 18:00

#### Scenario: shared-appointment-scheduling-SC-22 - A listing wider than 62 days is refused
**Serves:** How a slot is derived - a listing wider than 62 days is refused

- **WHEN** slots are listed for a range of 63 days
- **THEN** the diary refuses the listing with `INVALID_RANGE`

#### Scenario: shared-appointment-scheduling-SC-23 - A slot nobody can take is not listed
**Serves:** How a slot is derived - a slot nobody can take is not listed

- **GIVEN** a shop with one desk and a live booking at 10:00 for a 60-minute service
- **WHEN** slots are listed for that day
- **THEN** no start between 09:05 and 10:55 is offered on that desk

### Requirement: Notice and horizon bound the diary

The diary SHALL offer no start earlier than now plus the service's minimum
notice, and no start on a calendar date, in the shop's zone, later than today
plus the service's booking horizon. A booking requested at an instant the
rules place but the notice or the horizon excludes SHALL be refused with
`SLOT_NOT_OFFERED`.

#### Scenario: shared-appointment-scheduling-SC-24 - Nothing sooner than the notice
**Serves:** How a slot is derived - nothing sooner than the notice

- **GIVEN** a service with a minimum notice of 120 minutes and a shop open now
- **WHEN** slots are listed for today at 10:00
- **THEN** no start before 12:00 is offered

#### Scenario: shared-appointment-scheduling-SC-25 - Nothing beyond the horizon
**Serves:** How a slot is derived - nothing beyond the horizon

- **GIVEN** a service with a booking horizon of 30 days
- **WHEN** slots are listed for the 31st day from today
- **THEN** nothing is offered

#### Scenario: shared-appointment-scheduling-SC-26 - A start the notice excludes cannot be booked
**Serves:** How a slot is derived - a start the notice excludes cannot be booked

- **GIVEN** a service with a minimum notice of 120 minutes
- **WHEN** a booking is requested for a start 30 minutes from now
- **THEN** the diary refuses it with `SLOT_NOT_OFFERED`

### Requirement: Buffers keep visits apart

A booking SHALL occupy its resource from its start minus its service's buffer
before to its end plus its service's buffer after. Two occupations on one
resource SHALL never overlap. A buffer SHALL NOT need to fit inside an opening
window: only the visit itself must.

#### Scenario: shared-appointment-scheduling-SC-27 - A buffer after holds the resource
**Serves:** How a slot is derived - a buffer after holds the resource

- **GIVEN** a 30-minute service with a buffer after of 15 minutes and a shop with one desk
- **WHEN** a visit is booked at 10:00
- **THEN** 10:30 is not offered on that desk
- **AND** 10:45 is offered

#### Scenario: shared-appointment-scheduling-SC-28 - The first visit of the day may start at opening
**Serves:** How a slot is derived - the first visit of the day may start at opening

- **GIVEN** a 30-minute service with a buffer before of 15 minutes and a shop opening at 09:00
- **WHEN** slots are listed for that day
- **THEN** 09:00 is offered

### Requirement: A daylight-saving change never doubles or loses a slot

A wall-clock start that the spring-forward gap swallows SHALL be dropped. A
wall-clock start the fall-back hour reads twice SHALL be offered once, at its
earlier instant. A day's offered starts SHALL be strictly increasing instants.

#### Scenario: shared-appointment-scheduling-SC-29 - The spring-forward gap drops its starts
**Serves:** How a slot is derived - the spring-forward gap drops its starts

- **GIVEN** a shop in a zone that skips 02:00 to 03:00 on a given date, open 01:00 to 05:00
- **WHEN** slots are listed for that date
- **THEN** no start reads 02:00 to 02:59
- **AND** the offered instants are strictly increasing

#### Scenario: shared-appointment-scheduling-SC-30 - The fall-back hour is offered once
**Serves:** How a slot is derived - the fall-back hour is offered once

- **GIVEN** a shop in a zone that repeats 01:00 to 02:00 on a given date, open 00:00 to 04:00
- **WHEN** slots are listed for that date
- **THEN** each wall-clock start between 01:00 and 01:59 is offered once, at its earlier instant

### Requirement: A booking takes one resource under the shop's lock

A booking SHALL be written in this order, inside one transaction.

1. *Diary* — **Refuse what has written nothing**: an unknown or retired
   service or shop, a service not offered at the shop, a start in the past,
   invalid answers, or a customer booking with no name or address
2. *Diary* — **Replay or refuse the identity**: a live booking of the same
   service for the same identity answers as a replay when it names the same
   shop and start, and refuses otherwise
3. *Diary* — **Take the shop's lock**, so every booking at one shop is
   written one at a time
4. *Diary* — **Derive the slot again** under the lock and refuse a start the
   diary no longer offers
5. *Diary* — **Assign a resource**: the requested one when the request names
   one, otherwise the free assigned resource with the lowest sort order; none
   free refuses with `SLOT_FULL`
6. *Diary* — **Write the booking** and its first event

The identity in step 2 is the case for a product booking and the attendee's
email address for a direct booking; an operator booking that carries no
address has no identity, so it neither replays nor conflicts.

| Refusal | Means |
| --- | --- |
| `SERVICE_NOT_FOUND` | No such service, it is retired, or the caller may not book it |
| `LOCATION_NOT_FOUND` | No such shop |
| `LOCATION_INACTIVE` | The shop is retired |
| `SERVICE_NOT_OFFERED` | The shop has no resource for the service |
| `SLOT_IN_THE_PAST` | The start is earlier than now |
| `SLOT_NOT_OFFERED` | The rules, the notice or the horizon put no slot there |
| `SLOT_FULL` | Every resource that could take it is occupied |
| `RESOURCE_NOT_AVAILABLE` | The named resource is not assigned, retired, closed or occupied |
| `ANSWERS_INVALID` | A required question is unanswered or a choice is not an option |
| `ALREADY_BOOKED` | The identity holds a live booking of this service elsewhere; the refusal carries that booking's start as `heldSlotStart`, so a screen can word the clash |

#### Scenario: shared-appointment-scheduling-SC-31 - Two requests for the last resource resolve to one booking
**Serves:** How a booking is held - two requests for the last resource resolve to one booking

- **GIVEN** a slot with one free resource
- **WHEN** two bookings for it are requested at the same instant
- **THEN** exactly one is booked
- **AND** the other is refused with `SLOT_FULL`

#### Scenario: shared-appointment-scheduling-SC-32 - The free resource with the lowest sort order is assigned
**Serves:** How a booking is held - the free resource with the lowest sort order is assigned

- **GIVEN** a shop with desks sorted 1, 2 and 3, all free, all assigned to the service
- **WHEN** a booking is requested without naming a desk
- **THEN** it occupies desk 1

#### Scenario: shared-appointment-scheduling-SC-33 - A named resource is that one or nothing
**Serves:** How a booking is held - a named resource is that one or nothing

- **GIVEN** a shop whose desk 1 is occupied at 10:00 and whose desk 2 is free
- **WHEN** a booking at 10:00 names desk 1
- **THEN** the diary refuses it with `RESOURCE_NOT_AVAILABLE`
- **AND** desk 2 stays free

#### Scenario: shared-appointment-scheduling-SC-34 - A start in the past is refused before anything is written
**Serves:** How a booking is held - a start in the past is refused before anything is written

- **WHEN** a booking is requested for a start one minute ago
- **THEN** the diary refuses it with `SLOT_IN_THE_PAST`
- **AND** no lock is taken and nothing is written

### Requirement: A booking has one live state

A booking SHALL be in exactly one of the states below. `booked` is the only
live state. Cancelling a live booking SHALL free its resource from that
moment. Recording an outcome SHALL close a live booking as `completed` or
`no_show`. A closed booking SHALL refuse every further move, cancellation or
outcome with `BOOKING_CLOSED`, except that repeating the same cancellation or
the same outcome SHALL answer with the booking unchanged.

| State | Live | Means |
| --- | --- | --- |
| `booked` | yes | The visit is expected; the resource is held |
| `cancelled` | no | Called off before it happened; the resource is free |
| `completed` | no | The visit happened |
| `no_show` | no | The visit was expected and nobody came |

#### Scenario: shared-appointment-scheduling-SC-35 - Cancelling frees the resource
**Serves:** How a booking is held - cancelling frees the resource

- **GIVEN** a live booking on the only desk at 10:00
- **WHEN** it is cancelled
- **THEN** its state is `cancelled`
- **AND** 10:00 is offered on that desk again

#### Scenario: shared-appointment-scheduling-SC-36 - A closed booking refuses a move
**Serves:** How a booking is held - a closed booking refuses a move

- **GIVEN** a booking in `completed`
- **WHEN** a reschedule is requested for it
- **THEN** the diary refuses it with `BOOKING_CLOSED`

#### Scenario: shared-appointment-scheduling-SC-37 - Repeating an outcome answers the same booking
**Serves:** How a booking is held - repeating an outcome answers the same booking

- **GIVEN** a booking already in `no_show`
- **WHEN** `no_show` is recorded for it again
- **THEN** the diary answers with the booking unchanged and records no second event

### Requirement: The same request answers with the same booking

A booking request naming the same service, shop and start as a live booking
of the same identity SHALL answer with that booking and `created: false`. A
request for the same service and identity at another shop or start SHALL be
refused with `ALREADY_BOOKED`, carrying the live booking's start as
`heldSlotStart`, while that booking is live, and SHALL be accepted once it
has closed.

#### Scenario: shared-appointment-scheduling-SC-38 - A repeated request replays
**Serves:** How a booking is held - a repeated request replays

- **GIVEN** a live booking for a service, shop and start
- **WHEN** the same identity requests the same service, shop and start again
- **THEN** the diary answers with the existing booking and `created: false`

#### Scenario: shared-appointment-scheduling-SC-39 - A second live booking of one service is refused
**Serves:** How a booking is held - a second live booking of one service is refused

- **GIVEN** a live booking for a service tomorrow at 10:00
- **WHEN** the same identity requests the same service the day after
- **THEN** the diary refuses it with `ALREADY_BOOKED`, naming tomorrow at 10:00 as `heldSlotStart`

#### Scenario: shared-appointment-scheduling-SC-40 - A closed booking no longer blocks a new one
**Serves:** How a booking is held - a closed booking no longer blocks a new one

- **GIVEN** a booking for a service in `cancelled`
- **WHEN** the same identity requests the same service at another start
- **THEN** a new booking is written

### Requirement: A live booking moves in one step

Rescheduling SHALL take a live booking to another start, at the same shop or
another, in one transaction: the target is judged exactly as a new booking is,
the old resource is released and the new one taken together, and the booking
keeps its id, its attendee, its answers and its notes. When the target is at
another shop, both shops' locks SHALL be taken in one fixed order. A target
the diary cannot give SHALL leave the booking where it was.

#### Scenario: shared-appointment-scheduling-SC-41 - A booking moves within its shop
**Serves:** How a booking is held - a booking moves within its shop

- **GIVEN** a live booking at 10:00 on desk 1
- **WHEN** it is rescheduled to 14:00
- **THEN** it is live at 14:00 with the same id and answers
- **AND** 10:00 is offered on desk 1 again

#### Scenario: shared-appointment-scheduling-SC-42 - A booking moves to another shop
**Serves:** How a booking is held - a booking moves to another shop

- **GIVEN** a live booking at shop A
- **WHEN** it is rescheduled to a start at shop B
- **THEN** it is live at shop B on one of B's resources
- **AND** the resource it held at shop A is free

#### Scenario: shared-appointment-scheduling-SC-43 - A full target leaves the booking where it was
**Serves:** How a booking is held - a full target leaves the booking where it was

- **GIVEN** a live booking at 10:00 and a target start whose every resource is occupied
- **WHEN** a reschedule to that target is requested
- **THEN** the diary refuses it with `SLOT_FULL`
- **AND** the booking is still live at 10:00

### Requirement: A product books its own case's visits over its binding

A product SHALL reach the diary only through the entrypoint named for it, and
through it SHALL list the services bound to it, list the shops offering one,
list a service's slots, book a visit for a case naming the service, move it,
cancel it, record its outcome, and read the case's latest booking. A product
SHALL NOT reach a booking of another product or of a collector, and SHALL NOT
book a service not bound to it. A case SHALL hold at most one live booking,
and MAY book again once that one has closed. Every refusal SHALL travel as
data the product can act on.

#### Scenario: shared-appointment-scheduling-SC-44 - A product sees only its own services and bookings
**Serves:** What a product may ask - a product sees only its own services and bookings

- **GIVEN** a service bound to `vault` and a customer-bookable grading service, each with a live booking
- **WHEN** the vault lists its services and reads bookings
- **THEN** it sees the vault service and its own booking only

#### Scenario: shared-appointment-scheduling-SC-45 - A product cannot book a service not bound to it
**Serves:** What a product may ask - a product cannot book a service not bound to it

- **WHEN** the vault requests a booking naming the grading service
- **THEN** the diary refuses it with `SERVICE_NOT_FOUND`

#### Scenario: shared-appointment-scheduling-SC-46 - A case holds one live booking at a time
**Serves:** What a product may ask - a case holds one live booking at a time

- **GIVEN** a case with a live booking
- **WHEN** the product requests a booking for that case at another start
- **THEN** the diary refuses it with `ALREADY_BOOKED`

### Requirement: A booking records who, what and how

A booking SHALL carry the fields below, and every transition SHALL append one
event naming the transition, the instant and the actor. Events SHALL never be
edited or removed.

| Field | Rules |
| --- | --- |
| Id | Unique, system-minted, immutable |
| Service, shop, resource | The service booked, the shop and the resource it occupies |
| Start, end | Instants; the end is the start plus the service's duration at booking |
| State | One of the four states |
| Attendee name | Trimmed, 1 to 120 characters; required on a customer or operator booking, absent on a product booking that carries none |
| Attendee email | Lowercased, a valid address; required on a customer booking, may be absent on an operator or product booking |
| Attendee phone | Trimmed, may be absent |
| Notes | Trimmed text, at most 1000 characters, may be empty |
| Answers | One answer per question answered, keyed by question id |
| Source | `customer`, `operator` or `product` |
| Product, case | Set on a product booking, absent otherwise |
| User | The signed-in account that booked, when there was one; cleared by erasure |
| Locale | The locale the booking was made in |
| Booked by | The operator on an operator booking, absent otherwise |
| Created at, updated at | Set on create; updated on every transition |

| Event | Actor |
| --- | --- |
| `booked` | The collector, the operator or the product |
| `rescheduled` | Who moved it, with the start it left |
| `cancelled` | Who cancelled it |
| `completed`, `no_show` | The operator or the product that recorded it |
| `reminder_sent` | The diary |

#### Scenario: shared-appointment-scheduling-SC-47 - Every transition leaves an event
**Serves:** What a booking says - every transition leaves an event

- **GIVEN** a booking made, moved once and then cancelled
- **WHEN** its events are read
- **THEN** they are `booked`, `rescheduled` and `cancelled`, in that order, each with its actor and instant

#### Scenario: shared-appointment-scheduling-SC-48 - An operator booking names the operator
**Serves:** What a booking says - an operator booking names the operator

- **WHEN** an operator books a visit for a collector at the counter
- **THEN** the booking's source is `operator`, its booked-by is that operator, and its `booked` event names them

### Requirement: A booking with an address is told

The diary SHALL send, to a booking's attendee email address, a confirmation
when it is booked, an update when it is moved, and a cancellation when it is
cancelled, and SHALL send one reminder at the service's reminder lead before
the start while the booking is live. A booking without an address SHALL be
told nothing. A booking made or moved inside its reminder lead SHALL get no
reminder. Every mail SHALL carry a calendar file naming the service, the
shop and its address, the start and the end, and SHALL state the start in the
shop's zone naming that zone, as `shared/dates-and-times` requires of a sent
message. A mail answering a request that carried a direct booking's manage
secret - the confirmation, and a move or cancellation made from the link -
SHALL carry the link that manages it. The diary SHALL keep only a hash of the
secret, so a reminder and a mail about a change an operator made SHALL carry
no link.

#### Scenario: shared-appointment-scheduling-SC-49 - A confirmation carries a calendar file
**Serves:** What a booking says - a confirmation carries a calendar file

- **WHEN** a booking with an address is written
- **THEN** one confirmation is sent to that address, carrying a calendar file whose event runs from the booking's start to its end at the shop's address

#### Scenario: shared-appointment-scheduling-SC-50 - One reminder goes out at the lead
**Serves:** What a booking says - one reminder goes out at the lead

- **GIVEN** a live booking with an address and a service with a reminder lead of 1440 minutes
- **WHEN** the diary runs its reminders at 1440 minutes before the start, and again an hour later
- **THEN** exactly one reminder is sent and one `reminder_sent` event is recorded

#### Scenario: shared-appointment-scheduling-SC-51 - A booking without an address is told nothing
**Serves:** What a booking says - a booking without an address is told nothing

- **GIVEN** a product booking carrying no attendee
- **WHEN** it is booked, moved and cancelled
- **THEN** no mail is sent

#### Scenario: shared-appointment-scheduling-SC-52 - A booking inside its lead gets no reminder
**Serves:** What a booking says - a booking inside its lead gets no reminder

- **GIVEN** a service with a reminder lead of 1440 minutes
- **WHEN** a visit is booked for a start 60 minutes from now
- **THEN** a confirmation is sent and no reminder ever is

#### Scenario: shared-appointment-scheduling-SC-53 - A cancelled booking gets no reminder
**Serves:** What a booking says - a cancelled booking gets no reminder

- **GIVEN** a live booking with an address, cancelled before its reminder lead
- **WHEN** the lead arrives
- **THEN** no reminder is sent

### Requirement: Erasure keeps the diary and drops the person

Erasing a person SHALL clear the attendee name, email address and phone, the
notes, the answers and the account from every booking of theirs, SHALL stop
the booking's manage link from answering, and SHALL keep the booking's
service, shop, resource, start, end, state and events. The address's booking
attempts are `grade10-site/appointment/booking`'s rows, and that capability
says how erasure and retention treat them.

#### Scenario: shared-appointment-scheduling-SC-54 - An erased person's booking keeps its occupancy
**Serves:** Erasure - an erased person's booking keeps its occupancy

- **GIVEN** a completed booking last week under a person's address
- **WHEN** that person is erased
- **THEN** the booking still reads its shop, desk, start and `completed`
- **AND** it carries no name, address, phone, notes or answers
- **AND** its manage link answers not found
