## Purpose

The Appointments section of the admin console: where an operator sets up the
services, shops, resources and hours the diary runs on, closes a room or a
day, reads a shop's day by resource, and books, moves, cancels and closes out
a visit on a collector's behalf. Every rule it applies is
`shared/appointment/scheduling`'s; every block it renders is
`shared/console/blocks`'. The anonymous-write gate — the challenge and the
budget in front of a booking nobody signs in to make — is
`grade10-site/appointment/booking`'s, not this capability's: every diary
surface is authenticated.

## Feature set

- Setting up
  - Services: create, edit and retire a service, its questions, and the resources it runs on
  - Shops: create, edit and retire a shop
  - Resources: add, edit and retire a shop's desks, rooms and devices
  - Hours: weekly rules and special dates, for a shop or for one resource
- Closing time
  - Blocks: close a resource or a whole shop for a span, with the reason on record
- The day
  - Day view: one shop's day laid out by resource, every booking and block in its lane
  - Bookings list: every booking across shops, narrowed by shop, service, state and date
- On a collector's behalf
  - Counter booking: a customer-bookable service booked for a collector who walked in or called
  - Move and cancel: a direct booking moved or cancelled from the console
  - Close out: completed or no-show recorded on the day
  - Product bookings are read-only: a visit a product owns is moved from the product
- Grants and audit
  - Read and manage: the read grant sees everything, the manage grant writes
  - Every write recorded: elevated, on a fresh session, into the audit chain

## ADDED Requirements

### Requirement: An operator opens a shop for bookings

The console SHALL let an operator holding the manage grant make a shop
bookable in this order, and the diary SHALL offer the shop's first slot the
moment the last step lands.

1. *Operator* — **Create the shop** with its name, slug, time zone, address
   and phone
2. *Operator* — **Add its resources**: each desk, room or device, with its
   kind and sort order
3. *Operator* — **Set its hours**: a weekly rule per open weekday, and a rule
   of its own for any resource that keeps different hours
4. *Operator* — **Assign a service** to the resources that can take it

#### Scenario: grade10-admin-appointment-diary-SC-01 - A new shop offers its first slot
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** an active customer-bookable service
- **WHEN** an operator creates a shop, adds one desk, sets a rule for Monday 10:00 to 14:00, and assigns the service to the desk
- **THEN** the collector's picker offers the shop's Monday times for that service

#### Scenario: grade10-admin-appointment-diary-SC-02 - A shop with no assigned resource lists nothing
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** a shop with hours and a desk but no service assigned
- **WHEN** a collector picks any service
- **THEN** the shop is not among those offered

#### Scenario: grade10-admin-appointment-diary-SC-03 - Retiring a shop keeps its day readable
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** a shop with a live booking tomorrow
- **WHEN** an operator retires it
- **THEN** the collector's picker no longer offers it
- **AND** the operator still opens its day and sees tomorrow's booking

### Requirement: An operator sets a service up

The console SHALL let an operator holding the manage grant create a service
with every field `shared/appointment/scheduling` names, edit it, add and
order its questions, assign per shop the resources it runs on, and retire it.
A retired service SHALL stay listed under its own filter so its bookings can
be read.

#### Scenario: grade10-admin-appointment-diary-SC-04 - A service is created with its shape
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **WHEN** an operator creates a service named Grading with a 30-minute duration, a 15-minute increment, a 10-minute buffer after, 2 hours of notice, a 60-day horizon, a reminder a day ahead, and customer bookable on
- **THEN** the service appears in the services list, active, with those values

#### Scenario: grade10-admin-appointment-diary-SC-05 - Resources are assigned per shop
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** a service and two shops each holding two desks
- **WHEN** an operator assigns the service to both desks of the first shop and one desk of the second
- **THEN** the first shop offers the service with a capacity of 2 and the second with a capacity of 1

#### Scenario: grade10-admin-appointment-diary-SC-06 - A service is retired
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** an active service with a live booking
- **WHEN** an operator retires it
- **THEN** the collector's list no longer offers it
- **AND** the booking still reads under the service's name in the bookings list

#### Scenario: grade10-admin-appointment-diary-SC-07 - Questions are added in order
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **WHEN** an operator adds a required `choice` question with options Raw and Slabbed and then a `text` question to a service
- **THEN** the collector's details step asks them in that order

### Requirement: An operator shapes a shop's hours

The console SHALL let an operator holding the manage grant add, edit and
remove weekly rules and special dates for a shop, and for one of its
resources, each shown on the shop's own clock.

#### Scenario: grade10-admin-appointment-diary-SC-08 - A weekly rule is set
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **WHEN** an operator adds a rule for a shop, Tuesdays 09:00 to 18:00
- **THEN** the rule is listed under Tuesday and the diary offers Tuesday times

#### Scenario: grade10-admin-appointment-diary-SC-09 - A date is closed
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** a shop open Mondays
- **WHEN** an operator closes the coming Monday with a special date
- **THEN** that Monday is listed as closed and offers nothing

#### Scenario: grade10-admin-appointment-diary-SC-10 - A date runs on other hours
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** a shop open Mondays 10:00 to 18:00
- **WHEN** an operator sets a special date on the coming Monday to 12:00 to 15:00
- **THEN** that Monday offers times between 12:00 and 15:00 only

#### Scenario: grade10-admin-appointment-diary-SC-11 - A resource keeps its own hours
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** a shop open Mondays 10:00 to 18:00 and a room of it
- **WHEN** an operator adds a rule on the room for Mondays 10:00 to 13:00
- **THEN** the room's lane offers times ending by 13:00 and the other lanes still run to 18:00

### Requirement: An operator closes a span

The console SHALL let an operator holding the manage grant block a resource
or a whole shop from one instant to another with a reason, list the blocks
in force, and remove one.

#### Scenario: grade10-admin-appointment-diary-SC-12 - A resource is blocked with a reason
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **WHEN** an operator blocks a desk from 12:00 to 14:00 tomorrow with the reason Maintenance
- **THEN** the day view shows the block in that desk's lane with its reason
- **AND** no time in that span is offered on that desk

#### Scenario: grade10-admin-appointment-diary-SC-13 - The whole shop is blocked
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **WHEN** an operator blocks the shop from 09:00 to 18:00 tomorrow with the reason Stocktake
- **THEN** every lane shows the block and the collector's picker shows tomorrow as unavailable

#### Scenario: grade10-admin-appointment-diary-SC-14 - A block is removed
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **GIVEN** a block on a desk tomorrow
- **WHEN** an operator removes it
- **THEN** the desk's times in that span are offered again

### Requirement: The day reads by resource

The console SHALL show one shop's day as one lane per resource, laid out on
the shop's clock, holding every booking and block in the lane it occupies,
and SHALL let the operator step to the previous and next day and pick a date.
A product booking SHALL show its product and its case reference and SHALL
offer no move or cancellation from the console.

#### Scenario: grade10-admin-appointment-diary-SC-15 - The day lays out lanes
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **GIVEN** a shop with two desks, a booking at 10:00 on the first and a block at 14:00 on the second
- **WHEN** an operator opens that day
- **THEN** the first lane shows the booking at 10:00 and the second shows the block at 14:00, both in the shop's zone

#### Scenario: grade10-admin-appointment-diary-SC-16 - A product booking is read-only
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **GIVEN** a vault visit booked over the binding
- **WHEN** an operator opens it from the day
- **THEN** it shows the product and the case reference
- **AND** offers neither a move nor a cancellation

#### Scenario: grade10-admin-appointment-diary-SC-17 - The operator steps between days
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **GIVEN** an operator on a shop's day
- **WHEN** they step to the next day
- **THEN** the lanes show that day's bookings and blocks and the date shown moves with them

### Requirement: An operator books on a collector's behalf

The console SHALL let an operator holding the manage grant book a
customer-bookable service for a collector, naming the shop, the time, the
resource if they choose, the attendee's name, an email address if the
collector has one, and the service's answers; move a direct booking; and
cancel one after a confirmation. Every refusal the diary answers SHALL be
shown by name.

#### Scenario: grade10-admin-appointment-diary-SC-18 - A walk-in is booked at the counter
**Serves:** grade10-admin-appointment-diary-US-03 - Operator books a visit for a collector at the counter

- **WHEN** an operator books the grading service at 10:00 tomorrow for a collector giving a name and no address
- **THEN** the booking is live with source `operator`, booked by that operator, and no mail is sent

#### Scenario: grade10-admin-appointment-diary-SC-19 - The operator names the desk
**Serves:** grade10-admin-appointment-diary-US-03 - Operator books a visit for a collector at the counter

- **GIVEN** a shop with two free desks at 10:00
- **WHEN** an operator books a visit at 10:00 naming the second desk
- **THEN** the booking occupies the second desk

#### Scenario: grade10-admin-appointment-diary-SC-20 - A direct booking is moved
**Serves:** grade10-admin-appointment-diary-US-03 - Operator books a visit for a collector at the counter

- **GIVEN** a live direct booking at 10:00
- **WHEN** an operator moves it to 14:00
- **THEN** it is live at 14:00 with the same attendee and answers

#### Scenario: grade10-admin-appointment-diary-SC-21 - A direct booking is cancelled after confirmation
**Serves:** grade10-admin-appointment-diary-US-03 - Operator books a visit for a collector at the counter

- **GIVEN** a live direct booking
- **WHEN** an operator chooses to cancel it and confirms
- **THEN** it is `cancelled` and its resource is offered again

#### Scenario: grade10-admin-appointment-diary-SC-22 - A full time is refused by name
**Serves:** grade10-admin-appointment-diary-US-03 - Operator books a visit for a collector at the counter

- **GIVEN** a time whose every resource is occupied
- **WHEN** an operator books a visit at it
- **THEN** the console says the time is full and writes nothing

### Requirement: An operator closes out a visit

The console SHALL let an operator holding the manage grant record a live
booking as completed or as a no-show, from the day and from the bookings
list, and SHALL offer no further action on a closed booking.

#### Scenario: grade10-admin-appointment-diary-SC-23 - A visit is marked completed
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **GIVEN** a live booking this morning
- **WHEN** an operator marks it completed
- **THEN** its state is `completed` and the day shows it so

#### Scenario: grade10-admin-appointment-diary-SC-24 - A visit is marked a no-show
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **GIVEN** a live booking whose start has passed
- **WHEN** an operator marks it a no-show
- **THEN** its state is `no_show`

#### Scenario: grade10-admin-appointment-diary-SC-25 - A closed booking offers no action
**Serves:** grade10-admin-appointment-diary-US-02 - Operator runs a shop's day from the diary

- **GIVEN** a booking in `cancelled`
- **WHEN** an operator opens it
- **THEN** no move, cancellation or outcome is offered

### Requirement: The bookings list finds a visit

The console SHALL list every booking across shops, newest start first,
narrowed by shop, service, state and a date range, and searched by attendee
name or email address, and SHALL open any of them.

#### Scenario: grade10-admin-appointment-diary-SC-26 - The list narrows and searches
**Serves:** grade10-admin-appointment-diary-US-03 - Operator books a visit for a collector at the counter

- **GIVEN** bookings at two shops for two services in every state
- **WHEN** an operator narrows to one shop, one service and `booked`, and searches an attendee's name
- **THEN** only that attendee's live bookings of that service at that shop are listed

### Requirement: Every write is elevated and audited

The console SHALL show the Appointments section to an operator holding the
read grant and SHALL render no write control to one without the manage
grant. Every write SHALL be performed on a fresh session and SHALL record one
audit entry naming the operator, the action and the record.

#### Scenario: grade10-admin-appointment-diary-SC-27 - The read grant sees and cannot write
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **GIVEN** an operator holding the read grant and not the manage grant
- **WHEN** they open the Appointments section
- **THEN** they see the shops, services, days and bookings
- **AND** no control that creates, edits, retires, blocks, books, moves, cancels or closes out is rendered

#### Scenario: grade10-admin-appointment-diary-SC-28 - Every write lands an audit entry
**Serves:** grade10-admin-appointment-diary-US-01 - Operator opens a shop for bookings

- **WHEN** an operator creates a shop, blocks a desk and books a visit
- **THEN** the audit trail holds three entries, each naming the operator, the action and the record it touched
