# grade10-site/vault/visit-booking Specification

## Purpose

The shop visit a case is worked at: who may book one and when, how it is
moved and called off, what a missed one costs, and what closes it.

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

## Requirements

### Requirement: A visit may be booked at every live status but a draft

A case SHALL be bookable in `submitted`, `under_valuation`, `offer_made`,
`accepted`, `signing`, `vaulted`, `active` and `repaid`. A case that is a
draft or that has ended SHALL be refused a visit by name.

A case SHALL hold at most one live booking. A collector with several items
SHALL be able to book one visit against one of their cases and bring the rest
with them; a sibling case SHALL NOT need a visit of its own to reach the
vault.

#### Scenario: grade10-site-vault-visit-booking-SC-01 - A visit is booked after the offer
**Serves:** grade10-site-vault-visit-booking-US-01 - Collector books the visit they hand the item over at

- **GIVEN** a case holding a live offer
- **WHEN** its owner books a slot
- **THEN** the visit is held and the case names it

#### Scenario: grade10-site-vault-visit-booking-SC-02 - A live loan books its pickup
**Serves:** grade10-site-vault-visit-booking-US-02 - Borrower books the visit they repay and collect on

- **GIVEN** a case with a running loan
- **WHEN** its owner books a slot to repay and collect
- **THEN** the visit is held

#### Scenario: grade10-site-vault-visit-booking-SC-03 - A draft takes no visit
**Serves:** grade10-site-vault-visit-booking-US-01 - Collector books the visit they hand the item over at

- **GIVEN** a request that has not been sent in
- **WHEN** a slot is asked for
- **THEN** it is refused by name

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

#### Scenario: grade10-site-vault-visit-booking-SC-05 - The same slot asked for twice is one visit
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a case holding a booked slot
- **WHEN** the same slot is asked for again
- **THEN** the case holds the one booking and no message is sent

#### Scenario: grade10-site-vault-visit-booking-SC-06 - Staff move a visit and the collector hears
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a case holding a booked slot
- **WHEN** a member of staff moves it to another slot
- **THEN** the case names the new slot and the collector is told it moved

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

#### Scenario: grade10-site-vault-visit-booking-SC-08 - A stale copy is repaired rather than acted on
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a case whose copy names no visit and a diary that holds one for next week
- **WHEN** the abandonment clocks are read
- **THEN** the case's copy is corrected and the case is left where it is

#### Scenario: grade10-site-vault-visit-booking-SC-09 - No diary, no expiry

- **GIVEN** a vault with no diary reachable
- **WHEN** the abandonment clocks are read
- **THEN** no case is ended

### Requirement: A missed visit closes the visit, and only a submitted case ends with it

Twenty-four hours after a slot nobody came to, the visit SHALL be closed as a
no-show and the collector SHALL be told.

A case that was still `submitted` SHALL end as `expired`, because nothing else
was holding it. A case in any other bookable status SHALL keep its status, its
item and its loan, and SHALL be free to book another visit.

#### Scenario: grade10-site-vault-visit-booking-SC-10 - A missed drop-off ends the request
**Serves:** grade10-site-vault-visit-booking-US-03 - Collector moves a visit they cannot make

- **GIVEN** a submitted case whose slot passed 25 hours ago
- **WHEN** the missed visits are swept
- **THEN** the case is `expired` and the collector is told the visit was missed

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

#### Scenario: grade10-site-vault-visit-booking-SC-12 - A valuation from photographs leaves the visit open

- **GIVEN** a case whose visit is booked for Friday
- **WHEN** staff start valuing it on Monday from its photographs
- **THEN** the visit is still open for Friday

#### Scenario: grade10-site-vault-visit-booking-SC-13 - Taking the item in closes the visit
**Serves:** grade10-site-vault-visit-booking-US-02 - Borrower books the visit they repay and collect on

- **GIVEN** a case whose slot started this morning
- **WHEN** staff take the item into the vault
- **THEN** the visit is recorded as completed

#### Scenario: grade10-site-vault-visit-booking-SC-14 - A forfeited case's past visit is not a completed one

- **GIVEN** an active case holding a slot that has already passed
- **WHEN** the item is forfeited
- **THEN** the visit is recorded as a no-show
