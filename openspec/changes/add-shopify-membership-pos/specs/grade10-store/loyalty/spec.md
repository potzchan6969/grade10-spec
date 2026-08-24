# Loyalty — delta

## Purpose

The redemption mechanics the physical shop needs: a reward priced per unit, and
a physical reward that waits to be collected in person.

## ADDED Requirements

### Requirement: A per-unit reward redeems in a chosen quantity

The reward menu MAY price a reward per unit. Redeeming such a reward SHALL take
a quantity, cost exactly the unit price times the quantity in one recorded
redemption, and remember both the unit price and the quantity so repricing never
changes what it cost.

A programme offering a per-unit reward SHALL carry a per-redemption quantity
bound and a per-member daily bound, both greater than zero, and SHALL be refused
at boot when either is missing. A quantity above either bound SHALL be refused
naming the bound it broke — never silently clipped.

#### Scenario: One redemption, one debit

- **WHEN** a member redeems a per-unit reward at quantity five
- **THEN** exactly one redemption records five times the unit price
- **AND** the balance falls by exactly that amount

#### Scenario: A quantity above the bound is refused

- **WHEN** a redemption asks for more than the programme's per-redemption
  bound allows
- **THEN** it is refused naming the bound and nothing is recorded

### Requirement: A physical reward waits to be collected in person

Redeeming a physical reward SHALL park the redemption as awaiting
collection — paid, not yet delivered — and waiting SHALL NOT be treated
as a failure by any retry or alarm. Completing it SHALL require an
explicit confirmation at the point of handover, recording when and who
confirmed, and SHALL notify the member. A second completion SHALL be
refused naming when and where the first happened. A collection window
passing moves the redemption to expired under the artifact-expiry rule;
an operator cancellation refunds per the reversal rules.

#### Scenario: Collection completes once

- **WHEN** two tills confirm the same pending collection
- **THEN** exactly one completion is recorded
- **AND** the second is refused naming when and where the first happened

#### Scenario: Waiting is not failing

- **WHEN** a redemption awaits collection for days
- **THEN** no retry runs against it and no failure alarm counts it

#### Scenario: The member hears about the handover

- **WHEN** a pending collection is confirmed
- **THEN** the member is notified that their reward was collected
