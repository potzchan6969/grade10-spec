# grade10-site/vault/visit-booking Specification

## Feature set

- Booking, moving, calling off
  - One picker for both: a move picks from the shops and slots a first booking
    picks from, so another shop is as open to it as another time
  - Nothing free, already taken: the worker refuses the slot by name, and the
    shops and slots read again
- The booked visit
  - The calendar file: the visit as a file the collector's own calendar opens,
    served for the collector's own case and attached to the visit's own
    messages

## RENAMED Requirements

- FROM: `### Requirement: A booked visit is confirmed with the shop, the slot and what to do before the day`
- TO: `### Requirement: A booked visit is read back with its shop and slot`
- FROM: `### Requirement: The picker offers the same shops and slots to a first booking and to a move`
- TO: `### Requirement: A move takes from the shops and slots a first booking takes from`
- FROM: `### Requirement: A sibling case reads the visit its lead holds and offers no picker of its own`
- TO: `### Requirement: A sibling case reads the visit its lead holds`

### Requirement: A booked visit is read back with its shop and slot

The answer to a booking, and the case read back for as long as the visit
stands.

**The booking's answer** - a booking SHALL answer with the visit taken: its
shop and its slot. The collector is told by mail, as "The collector or the
counter books, moves and cancels the visit" states.

**Read back** - the owner's read of a case holding a live visit SHALL carry
the booking, the shop and the slot, and the shop's address is read from the
diary's shops; the slot SHALL be read in the shop's own zone.

**Calling it off** - cancelling the visit SHALL leave the case's status, item
and loan where they are, and the case SHALL take another booking.

**Where the identity stands** - the owner's read of the case SHALL carry
whether the collector's identity is verified, so a visit can be read beside
it.

#### Scenario: grade10-site-vault-visit-booking-SC-15 - The confirmation takes the picker's place
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector who has just booked reads the shop and the slot where the picker stood

- **WHEN** a collector takes a free slot for their case
- **THEN** the answer names the shop and the slot taken
- **AND** the collector is told by mail

#### Scenario: grade10-site-vault-visit-booking-SC-16 - A financed case is told the money follows
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector on the financed lane reads that the money follows the signing

- **GIVEN** a case on the financed lane holding a booked visit
- **WHEN** its owner reads the case
- **THEN** it carries the visit and the amount asked for, so the lane is read as financed

#### Scenario: grade10-site-vault-visit-booking-SC-17 - A storage case is told about the custody agreement alone
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector on the storage lane is promised no money their case never carries

- **GIVEN** a case on the storage lane holding a booked visit
- **WHEN** its owner reads the case
- **THEN** it carries the visit and no amount asked for, so the lane is read as storage

#### Scenario: grade10-site-vault-visit-booking-SC-18 - An unverified collector is offered the check
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector who is not verified is offered the check before the day

- **GIVEN** a collector whose identity is not verified holding a booked visit
- **WHEN** they read the case
- **THEN** it carries the visit and that the identity is not verified

#### Scenario: grade10-site-vault-visit-booking-SC-19 - A verified collector is asked for the item alone
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector who is verified already is asked for nothing but the item

- **GIVEN** a collector whose identity is verified holding a booked visit
- **WHEN** they read the case
- **THEN** it carries the visit and that the identity is verified

#### Scenario: grade10-site-vault-visit-booking-SC-20 - A standing visit reads the same on the case
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector coming back to the case reads the visit they booked

- **GIVEN** a case whose booked slot is still ahead of it
- **WHEN** its owner reads the case
- **THEN** it carries the booking, the shop and the slot
- **AND** its calendar file is served, and the visit may be moved or called off

#### Scenario: grade10-site-vault-visit-booking-SC-21 - Calling the visit off leaves the case standing
**Serves:** grade10-site-vault-visit-booking-US-03 - the collector who calls a visit off keeps the case they booked it for

- **GIVEN** a case holding a booked visit
- **WHEN** its owner cancels the visit
- **THEN** the case keeps its status, its item and its loan, and takes another booking

### Requirement: A move takes from the shops and slots a first booking takes from

What the collector chooses from, and what the worker answers when the slot
they chose cannot be taken.

**The same shops and slots** - the shops and slots read for a move SHALL be
those read for a first booking, and a move SHALL take another shop as readily
as another day and time.

**Never the visit's own slot** - the slots read for a move SHALL NOT include
the slot the visit already holds, since the diary counts that slot taken.

**Nothing free** - a window the diary holds no free slot in SHALL be answered
with no slot.

**A slot already taken** - a slot taken between the read and the take SHALL be
refused by name, and the slots read again SHALL not include it.

#### Scenario: grade10-site-vault-visit-booking-SC-27 - A move picks another shop
**Serves:** grade10-site-vault-visit-booking-US-03 - the collector who cannot reach the shop they picked moves the visit to another

- **GIVEN** a case holding a booked visit
- **WHEN** its owner moves the visit to a free slot at another shop
- **THEN** the case holds the visit at that shop and slot

#### Scenario: grade10-site-vault-visit-booking-SC-28 - A window with nothing free says so and offers the next
**Serves:** grade10-site-vault-visit-booking-US-01 - the collector reading a window with nothing free is told so and offered the next

- **GIVEN** a shop whose window holds no free slot
- **WHEN** its slots for that window are read
- **THEN** no slot is answered

#### Scenario: grade10-site-vault-visit-booking-SC-29 - A slot taken while the collector chose is refused
**Serves:** grade10-site-vault-visit-booking-US-01 - the collector who lost the slot while choosing is told and reads the rest

- **GIVEN** a collector who has read a free slot
- **WHEN** somebody else takes that slot before they book it
- **THEN** the booking is refused by name and the slots read again do not include it

#### Scenario: grade10-site-vault-visit-booking-SC-31 - A move never offers the visit's own current slot back
**Serves:** grade10-site-vault-visit-booking-US-03 - the collector moving a visit reads only slots other than the one they already hold

- **GIVEN** a case holding a booked visit
- **WHEN** its owner reads the slots to move it
- **THEN** the slot the visit already holds is not among them
- **AND** every other free slot is answered as before

### Requirement: A sibling case reads the visit its lead holds

Where a collector's other case already holds the visit both items come in on.

**The collector's own cases** - each case on the collector's own cases SHALL
carry its own visit, so a case holding none is read beside the live visit its
lead holds, with that visit's shop and slot.

#### Scenario: grade10-site-vault-visit-booking-SC-30 - A sibling case shows the lead's visit
**Serves:** grade10-site-vault-visit-booking-US-01 - the collector bringing two items in books the visit once

- **GIVEN** a collector holding a live booking on one of their cases and none on another
- **WHEN** they read their own cases
- **THEN** the lead case carries its visit, with its shop and slot, and the other carries none

## MODIFIED Requirements

### Requirement: The visit is one calendar entry the collector's own calendar opens

What the calendar file serves, and what keeps one visit to one day on a phone.

**The file** - a case's owner SHALL be able to fetch its visit as a calendar
file naming the shop, its address and the slot. Anyone who does not own the
case SHALL be refused it.

**One entry** - every file served for one case's visit SHALL name the same
entry, so a file served after the visit moved SHALL update the day already on
the collector's calendar rather than add a second.

**A called-off visit** - the file SHALL still be served after the visit is
called off, as a cancellation of that same entry, so opening it takes the day
off the calendar.

**The messages** - the message telling the collector a visit was booked, moved
or called off SHALL carry that visit's file with it.

**No visit** - a case the diary holds no visit for SHALL be refused the file
by name, as not found, and no file SHALL be served.

#### Scenario: grade10-site-vault-visit-booking-SC-22 - Add to calendar serves the visit
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector takes the visit into the calendar they keep their days in

- **GIVEN** a case holding a booked visit
- **WHEN** its owner asks for the visit's calendar file
- **THEN** a calendar file naming the shop, its address and the slot is served

#### Scenario: grade10-site-vault-visit-booking-SC-23 - The file is the case owner's alone
**Serves:** The booked visit - the file is served off the case, so only the person the visit belongs to reads it

- **WHEN** somebody who does not own a case asks for that case's visit as a
  calendar file
- **THEN** it is refused and no file is served

#### Scenario: grade10-site-vault-visit-booking-SC-24 - A moved visit changes the day already on the calendar
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector who moved a visit is left one day on their phone

- **GIVEN** a collector who has added their booked visit to their calendar
- **WHEN** the visit is moved to another slot and the file is opened again
- **THEN** the day already on the calendar reads the new slot and no second day
  is added

#### Scenario: grade10-site-vault-visit-booking-SC-25 - A called-off visit is taken off the calendar
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector who called a visit off is left none

- **GIVEN** a collector who has added their booked visit to their calendar
- **WHEN** the visit is called off and the file is opened again
- **THEN** the file is served as a cancellation of that day and the day is taken
  off the calendar

#### Scenario: grade10-site-vault-visit-booking-SC-26 - The visit's messages carry the file
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector reads the day off the message without opening the case

- **WHEN** the collector is told their visit was booked, moved or called off
- **THEN** that message carries the visit's calendar file

#### Scenario: grade10-site-vault-visit-booking-SC-32 - A case never booked is refused the file
**Serves:** grade10-site-vault-visit-booking-US-04 - the collector who asks for a visit that was never booked is told there is none rather than handed an empty day

- **GIVEN** a case the diary never booked a visit for
- **WHEN** its owner asks for the visit's calendar file
- **THEN** it is refused by name as not found and no file is served
