# grade10-site/vault/visit-booking Specification

## Purpose

The shop visit a case is worked at: who may book one and when, how it is moved
and called off, what a missed one costs, what closes it, and what the collector
is given once one stands.

The diary that holds shops and slots is another service's; this capability is
what a vault case is entitled to ask of it and what the case keeps of the
answer. Which statuses exist is `grade10-site/vault/case-lifecycle`.

## Feature set

- When a visit is bookable
  - Every live status but a draft: the shop values remotely and offers before
    the visit, so a case is bookable wherever it stands
  - One visit at a time: a case holds one live booking, and moving it is its
    own act
  - The lead case books: siblings need no visit of their own, because a case
    has never needed one to be vaulted
- Booking, moving, calling off
  - The collector or the counter: either may book, move or cancel, and the
    collector is told either way
  - A slot in the past: refused, because a visit is something somebody is
    coming to
  - Replay, not a second seat: asking again for the slot the case already
    holds changes nothing
  - One picker for both: a move picks from the shops and slots a first booking
    picks from, so another shop is as open to it as another time
  - Nothing free, already taken: the worker refuses the slot by name, and the
    shops and slots read again
- The diary and the copy
  - The diary is the authority: where the two disagree the case's copy is
    repaired and never acted on
  - One writer: a case's visit is moved on the case, so the copy and the diary
    have one author
- Missed and finished visits
  - A missed visit closes a visit: only a case with nothing else holding it
    ends with one
  - Completion on the first counter act: an act after the slot closes the
    visit, an act before it leaves the visit open
  - An ended case's visit: one still ahead is cancelled, and one already past
    on a forfeited case is a no-show
- The booked visit
  - The confirmation: the shop, the slot and what to do before the day — verify
    the identity, bring the item, sign at the counter
  - The calendar file: the visit as a file the collector's own calendar opens,
    served for the collector's own case and attached to the visit's own
    messages
  - One visit, one entry: a moved visit's file replaces the one before it and a
    cancelled visit's is withdrawn, so no stale day is left on a phone

## Requirements

### Requirement: A visit may be booked at every live status but a draft

A case SHALL be bookable in `submitted`, `under_valuation`, `offer_made`,
`accepted`, `signing`, `vaulted`, `active` and `repaid`. A case that is a
draft or that has ended SHALL be refused a visit by name.

A case SHALL hold at most one live booking. A collector with several items
SHALL be able to book one visit against one of their cases and bring the rest
with them; a sibling case SHALL NOT need a visit of its own to reach the
vault.

<!-- trace:scenario id=g10.vault-visit-booking.SC-arc rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-01 - A visit is booked after the offer
**Serves:** grade10-site-vault-visit-booking-US-01 - Collector books the visit they hand the item over at

- **GIVEN** a case holding a live offer
- **WHEN** its owner books a slot
- **THEN** the visit is held and the case names it

<!-- trace:scenario id=g10.vault-visit-booking.SC-96b rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-02 - A live loan books its pickup
**Serves:** grade10-site-vault-visit-booking-US-02 - Borrower books the visit they repay and collect on

- **GIVEN** a case with a running loan
- **WHEN** its owner books a slot to repay and collect
- **THEN** the visit is held

<!-- trace:scenario id=g10.vault-visit-booking.SC-uos rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-03 - A draft takes no visit
**Serves:** grade10-site-vault-visit-booking-US-01 - Collector books the visit they hand the item over at

- **GIVEN** a request that has not been sent in
- **WHEN** a slot is asked for
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-visit-booking.SC-79y rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-04 - A sibling case is vaulted without a visit
**Serves:** grade10-site-vault-visit-booking-US-01 - Collector books the visit they hand the item over at

- **GIVEN** two cases from one collector, one of which holds the visit
- **WHEN** both items are taken in at that visit
- **THEN** both cases reach the vault, and the second needed no booking

### Requirement: The collector or the counter books, moves and cancels the visit

Booking, moving and cancelling a visit SHALL each be available to the case's
owner and to staff holding the vault operate grant, and SHALL run in these
steps:

1. Read the shops and their free slots from the diary.
2. Take a slot for this case, refusing a slot that has already passed.
3. Write what the diary answered onto the case, with the history entry that
   records it.
4. Tell the collector, whoever made the move.

Asking again for the slot the case already holds SHALL answer with that
booking and tell the collector nothing. Asking for a different slot SHALL be
refused as a booking that already exists; moving the visit SHALL be its own
act.

Cancelling SHALL be idempotent: a case whose booking the diary no longer holds
SHALL end with no live visit rather than a refusal.

<!-- trace:scenario id=g10.vault-visit-booking.SC-dlg rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-05 - The same slot asked for twice is one visit
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a case holding a booked slot
- **WHEN** the same slot is asked for again
- **THEN** the case holds the one booking and no message is sent

<!-- trace:scenario id=g10.vault-visit-booking.SC-9i6 rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-06 - Staff move a visit and the collector hears
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a case holding a booked slot
- **WHEN** a member of staff moves it to another slot
- **THEN** the case names the new slot and the collector is told it moved

<!-- trace:scenario id=g10.vault-visit-booking.SC-ui2 rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-07 - A slot in the past is refused
**Serves:** grade10-site-vault-visit-booking-US-01 - Collector books the visit they hand the item over at

- **WHEN** a slot that has already passed is asked for
- **THEN** it is refused by name and the case's visit does not change

### Requirement: The diary is the authority and the case's copy is repaired

The case's copy of its booking SHALL be display only. Where the diary and the
copy disagree, the copy SHALL be corrected from the diary and the disagreement
SHALL NOT be acted on.

A clock that would end a case SHALL ask the diary first, and a case the diary
says holds a visit still ahead of it SHALL be left where it is. Where no diary
can be reached, no case SHALL be ended for want of a visit.

<!-- trace:scenario id=g10.vault-visit-booking.SC-pop rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-08 - A stale copy is repaired rather than acted on
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a case whose copy names no visit and a diary that holds one for next week
- **WHEN** the abandonment clocks are read
- **THEN** the case's copy is corrected and the case is left where it is

<!-- trace:scenario id=g10.vault-visit-booking.SC-etl rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-09 - No diary, no expiry
**Serves:** The diary and the copy - no diary, no expiry

- **GIVEN** a vault with no diary reachable
- **WHEN** the abandonment clocks are read
- **THEN** no case is ended

### Requirement: A missed visit closes the visit, and only a submitted case ends with it

Twenty-four hours after a slot nobody came to, the visit SHALL be closed as a
no-show and the collector SHALL be told.

A case that was still `submitted` SHALL end as `expired`, because nothing else
was holding it. A case in any other bookable status SHALL keep its status, its
item and its loan, and SHALL be free to book another visit.

<!-- trace:scenario id=g10.vault-visit-booking.SC-dnx rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-10 - A missed drop-off ends the request
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a submitted case whose slot passed 25 hours ago
- **WHEN** the missed visits are swept
- **THEN** the case is `expired` and the collector is told the visit was missed

<!-- trace:scenario id=g10.vault-visit-booking.SC-tyj rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-11 - A missed pickup keeps the case
**Serves:** grade10-site-vault-visit-booking-US-02 - Borrower books the visit they repay and collect on

- **GIVEN** a case with a running loan whose slot passed 25 hours ago
- **WHEN** the missed visits are swept
- **THEN** the visit is closed, the case is still running, and another visit may be booked

### Requirement: A visit completes on the first counter act after its slot

A visit SHALL be marked completed by the first act at the counter that happens
after its slot has started — the valuation being started, or the item being
taken into the vault. An act before the slot SHALL leave the visit open, and a
second act on a case whose visit is already closed SHALL change nothing.

A case that ends while holding a visit still ahead of it SHALL have that visit
cancelled in the diary. A case that is forfeited while holding a visit already
past SHALL have it recorded as a no-show, never as completed.

<!-- trace:scenario id=g10.vault-visit-booking.SC-63a rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-12 - A valuation from photographs leaves the visit open
**Serves:** Missed and finished visits - a valuation from photographs leaves the visit open

- **GIVEN** a case whose visit is booked for Friday
- **WHEN** staff start valuing it on Monday from its photographs
- **THEN** the visit is still open for Friday

<!-- trace:scenario id=g10.vault-visit-booking.SC-fxq rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-13 - Taking the item in closes the visit
**Serves:** grade10-site-vault-visit-booking-US-02 - Borrower books the visit they repay and collect on

- **GIVEN** a case whose slot started this morning
- **WHEN** staff take the item into the vault
- **THEN** the visit is recorded as completed

<!-- trace:scenario id=g10.vault-visit-booking.SC-2lq rev=1 -->
#### Scenario: grade10-site-vault-visit-booking-SC-14 - A forfeited case's past visit is not a completed one
**Serves:** Missed and finished visits - a forfeited case's past visit is not a completed one

- **GIVEN** an active case holding a slot that has already passed
- **WHEN** the item is forfeited
- **THEN** the visit is recorded as a no-show

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
