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
    served from the case and attached to the visit's own messages
  - One visit, one entry: a moved visit's file replaces the one before it and a
    cancelled visit's is withdrawn, so no stale day is left on a phone

## ADDED Requirements

### Requirement: A booked visit is confirmed with the shop, the slot and what to do before the day

The screen a collector lands on once a slot is taken, and the same visit read
back on the case for as long as it stands.

**Where it shows** - the confirmation SHALL replace the shops and slots as soon
as the booking is taken, and a case holding a live visit SHALL read the same
shop, address, slot and acts wherever the case is opened.

**The slot** - the confirmation SHALL name the shop, its address, and the day
and time in the shop's own zone, and SHALL say the same has been sent by email.

**The acts** - the confirmation SHALL offer the visit's calendar file, moving
the visit, and calling it off. Calling it off SHALL name what it does before it
runs, SHALL leave the case's status, item and loan where they are, and SHALL
offer the shops and slots again.

**Before the day** - the confirmation SHALL list what the collector does before
the day: have their identity verified, bring the item, and sign at the counter.
On the financed lane it SHALL add that the money follows the signing; on the
storage lane the signing item SHALL name the custody agreement alone and no
money line SHALL be listed.

**The identity item** - where the collector's identity is not verified the item
SHALL offer the check and SHALL say it may be done at the counter instead;
where it is verified the item SHALL read verified and SHALL ask for nothing but
the item.

#### Scenario: grade10-site-vault-visit-booking-SC-15 - The confirmation takes the picker's place
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **WHEN** a collector takes a free slot for their case
- **THEN** the shops and slots are replaced by a confirmation naming the shop,
  its address and the day and time in the shop's own zone, and saying the same
  has been sent by email

#### Scenario: grade10-site-vault-visit-booking-SC-16 - A financed case is told the money follows
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a case on the financed lane holding a booked visit
- **WHEN** its owner reads the confirmation
- **THEN** it lists having the identity verified, bringing the item, signing at
  the counter, and that the money follows the signing

#### Scenario: grade10-site-vault-visit-booking-SC-17 - A storage case is told about the custody agreement alone
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a case on the storage lane holding a booked visit
- **WHEN** its owner reads the confirmation
- **THEN** the signing item names the custody agreement and no money line is
  listed

#### Scenario: grade10-site-vault-visit-booking-SC-18 - An unverified collector is offered the check
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a collector whose identity is not verified holding a booked visit
- **WHEN** they read the confirmation
- **THEN** the identity item offers the check and says it may be done at the
  counter instead

#### Scenario: grade10-site-vault-visit-booking-SC-19 - A verified collector is asked for the item alone
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a collector whose identity is verified holding a booked visit
- **WHEN** they read the confirmation
- **THEN** the identity item reads verified and nothing but the item is asked
  for

#### Scenario: grade10-site-vault-visit-booking-SC-20 - A standing visit reads the same on the case
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a case whose booked slot is still ahead of it
- **WHEN** its owner opens the case
- **THEN** the shop, its address and the slot are named, and the calendar file,
  moving the visit and calling it off are offered

#### Scenario: grade10-site-vault-visit-booking-SC-21 - Calling the visit off leaves the case standing
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a case holding a booked visit
- **WHEN** its owner calls the visit off from the confirmation and confirms
- **THEN** the case keeps its status, its item and its loan, and the shops and
  slots are offered again

### Requirement: The visit is one calendar entry the collector's own calendar opens

What add to calendar serves, and what keeps one visit to one day on a phone.

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

#### Scenario: grade10-site-vault-visit-booking-SC-22 - Add to calendar serves the visit
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a case holding a booked visit
- **WHEN** its owner asks for the visit's calendar file
- **THEN** a calendar file naming the shop, its address and the slot is served

#### Scenario: grade10-site-vault-visit-booking-SC-23 - The file is the case owner's alone
**Serves:** The booked visit - the file is served off the case, so only the person the visit belongs to reads it

- **WHEN** somebody who does not own a case asks for that case's visit as a
  calendar file
- **THEN** it is refused and no file is served

#### Scenario: grade10-site-vault-visit-booking-SC-24 - A moved visit changes the day already on the calendar
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a collector who has added their booked visit to their calendar
- **WHEN** the visit is moved to another slot and the file is opened again
- **THEN** the day already on the calendar reads the new slot and no second day
  is added

#### Scenario: grade10-site-vault-visit-booking-SC-25 - A called-off visit is taken off the calendar
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **GIVEN** a collector who has added their booked visit to their calendar
- **WHEN** the visit is called off and the file is opened again
- **THEN** the file is served as a cancellation of that day and the day is taken
  off the calendar

#### Scenario: grade10-site-vault-visit-booking-SC-26 - The visit's messages carry the file
**Serves:** grade10-site-vault-visit-booking-US-04 - Collector puts the visit in their calendar

- **WHEN** the collector is told their visit was booked, moved or called off
- **THEN** that message carries the visit's calendar file
