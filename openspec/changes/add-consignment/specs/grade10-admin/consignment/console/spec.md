# grade10-admin/consignment/console Specification

## Purpose

The Consignment section of the admin console: a queue of consignments cut
by what each one waits for, one consignment's page and the acts and flags
on it, the treasurer's payouts, and the settings and grants behind every
act.

The consignment itself is `grade10-site/consignment/lifecycle`; the money
it moves is `grade10-site/consignment/payout`.

## Feature set

- The queue
  - Cut by what waits: every consignment sits in exactly one view - New, To
    price, To sign, To list, On sale, Sold, Payout due, Ended unsold,
    Returning, Closed
  - Rows that explain: the consignor, each item's label code, the channel,
    the price, days on sale and a badge naming why it waits
  - Counts: each view carries its count, and every view adds up to all
- One consignment
  - The parts: the header, the items, the channel, the terms, the
    documents, the money and the timeline
  - Acts: receive - recording where it was taken, the channel and each
    item's market value and rates - set terms, prepare the agreement, list,
    change the price, take off sale, return, extend, move to the other
    channel or the vault
  - The rule first: a dialog states the rule before the act
  - Withheld in words: an act not offered says why
  - Flags: sold twice, out of step, cannot apply, price moved, amount
    differs, refund in part - dismissed once dealt with, raised again on a
    changed fact
- Payouts
  - The due list: every payout past its window, oldest first, with what it
    is made of
  - Recorded: the amount, the bank reference and the day the money left,
    with the statement to the consignor
  - Corrected: a second holder of the payout grant, never the one who
    recorded it
  - Exported: a period's payouts as a CSV, on the audit chain
- Settings
  - Every figure a setting: commission by channel and price band, the
    incentive, the minimum, fees, the term, the windows, when a consignor
    is paid, identity, ending soon
  - Pinned at the agreement: a change reaches the next agreement prepared;
    one waiting for a signature keeps its schedule
  - Unset refuses: an agreement is not prepared while a figure it prints is
    unset
- Who may act
  - Six grants: read, operate, approve, payout, display, settings - and two
    people for money, staff and treasurer sharing none
  - Second factor and audit: required in production, and every act filed
    under its consignment

## ADDED Requirements

### Requirement: Intake records where, who in law and each item's market value

The counter's intake SHALL ask where the consignment is taken, the counter
or an event named, whether the consignor is an individual or a company with
its registered office, and the channel; it SHALL register each item only
with its grade, cert and market value. A consignor SHALL be found in the
account directory or among past consignors: one with no Grade10 account is
added in People first, so every consignment is linked to an account.

#### Scenario: grade10-admin-consignment-console-SC-01 - The counter asks the facts before it opens
**Serves:** grade10-admin-consignment-console-US-03 - staff receive a consignment at intake

- **GIVEN** staff opening a consignment for a company at an event
- **WHEN** they leave the event's name or the company's registered office blank
- **THEN** opening is withheld, naming what is missing

### Requirement: Payouts list the incentives due and record one

The Payouts section SHALL list every incentive owed beside the payouts,
oldest first, each with its consignment, its consignor, the amount and the
day it fell due, and SHALL record one under the payout grant as a payout is
recorded, filed on the audit chain under its consignment.

#### Scenario: grade10-admin-consignment-console-SC-02 - A treasurer records an incentive from the due list
**Serves:** grade10-admin-consignment-console-US-05 - the treasurer works the payout due list

- **GIVEN** a consignment owing an incentive since its seal
- **WHEN** the treasurer records it with the bank's reference and the day the money left
- **THEN** it leaves the list and the consignment reads it paid

### Requirement: The incentive's rate is a setting pinned at the agreement

The incentive's rate SHALL be a setting an admin changes, unset until one
does, pinned to a consignment when its agreement is prepared like every
other figure the agreement prints.

#### Scenario: grade10-admin-consignment-console-SC-03 - A later rate reaches only the next agreement
**Serves:** grade10-admin-consignment-console-US-06 - an admin changes a setting

- **GIVEN** a consignment prepared under a 5% incentive
- **WHEN** an admin saves 4% afterwards
- **THEN** that consignment still owes 5% of its market values, and the next agreement prepared prints 4%
