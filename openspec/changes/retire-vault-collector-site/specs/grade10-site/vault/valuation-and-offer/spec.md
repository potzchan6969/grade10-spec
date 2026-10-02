# grade10-site/vault/valuation-and-offer Specification

## Feature set

- Answering the offer
  - Answered from the case: the collector accepts or declines the live offer
    as an act on their own case, and the signature is still what binds
  - The refusal reaches the reader: an offer that ran out or a case that moved
    under the answer is refused by name to whoever gave it

## RENAMED Requirements

- FROM: `### Requirement: A collector answers the live offer from the case page`
- TO: `### Requirement: A collector answers the live offer on their own case`
- FROM: `### Requirement: A refused answer is named where the answer was given`
- TO: `### Requirement: A refused answer is named to whoever gave it`

## MODIFIED Requirements

### Requirement: A collector answers the live offer on their own case

The collector answers the offer their case holds as an act on that case, and
the signature is still what binds.

1. **Read the offer** - the owner's read of the case SHALL carry, for the
   live offer, the principal, the term in days, the interest for the whole
   term, the total to repay, what a late day costs and the day to answer by,
   beside the valuation the offer was judged against.
2. **Answer it** - an accept or a decline SHALL name the offer it answers and
   the instant the case was read at, and SHALL be judged against both when it
   lands.
3. **Read where it stands** - the answer SHALL be the case as it then stands.

**Once** - an answer that lands SHALL close the offer; the same answer sent
again SHALL be refused by name and SHALL change nothing.

**Answer by** - each case on the collector's own cases SHALL carry the live
offer's expiry while an offer is open, and none once no offer is open; the
day to answer by SHALL be read only while that expiry is after the instant of
the read.

**The visit stands apart** - accepting SHALL book no visit and SHALL leave a
booked visit as it was.

**Declining keeps the request** - a decline SHALL close the offer as declined
by the collector, return the case to `under_valuation`, and leave a booked
visit standing.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-21 - The offer reads with its terms and its valuation
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector reads every figure they are being asked to agree to before they answer

- **GIVEN** a case valued at 10,000,000 HKD minor units holding a live offer of 4,000,000 HKD minor units over 60 days, with 160,000 HKD minor units of interest for the term
- **WHEN** its owner reads the case
- **THEN** the read carries the 4,000,000 HKD minor units, the 60 days, the 160,000 HKD minor units of interest, the total of 4,160,000 HKD minor units, what a late day costs, the day to answer by and the 10,000,000 HKD minor units the offer was judged against

#### Scenario: grade10-site-vault-valuation-and-offer-SC-22 - Accept is confirmed before it is sent
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector is shown what accepting costs before the answer goes

- **GIVEN** a case holding a live offer and a booked visit
- **WHEN** its owner accepts it, naming the offer and the instant they read it at
- **THEN** the case is `accepted` and the answer carries the case as it now stands
- **AND** the booked visit is as it was, and no visit is booked by the answer

#### Scenario: grade10-site-vault-valuation-and-offer-SC-23 - Decline is confirmed before it is sent
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector who says no is told what they keep - the request and the visit

- **GIVEN** a case holding a live offer and a visit booked on it
- **WHEN** its owner declines it
- **THEN** the offer is closed as declined by the collector and the case is `under_valuation`
- **AND** the booked visit stands

#### Scenario: grade10-site-vault-valuation-and-offer-SC-24 - An answer is sent once and the case is read again
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector who presses twice sends one answer and reads where the case stands

- **GIVEN** a case holding a live offer
- **WHEN** its owner accepts it, and the same accept arrives again
- **THEN** the first lands and answers the case as `accepted`
- **AND** the second is refused by name and changes nothing

#### Scenario: grade10-site-vault-valuation-and-offer-SC-25 - The day to answer by leaves with the offer
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector reads the day to answer by while it still means something

- **GIVEN** a collector whose case holds a live offer expiring on a stated day
- **WHEN** they read their own cases before that day and again after the offer has lapsed
- **THEN** the first read gives the day to answer by and the second gives none

### Requirement: Only the offer that stands takes an answer

A case that has been counter-offered carries both offers and answers the live
one.

**What the read carries** - the owner's read SHALL carry every offer the case
was made, each with its principal and its status, so the live offer is the
one open and every other reads as closed.

**A closed offer** - an offer that was superseded, declined, accepted or
expired SHALL take no answer, and the case's history SHALL carry the day it
closed.

**An answer to a closed offer** - SHALL be refused by name, and SHALL leave
the live offer open and unanswered.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-26 - A replaced offer reads as closed beside the new one
**Serves:** grade10-site-vault-valuation-and-offer-US-05 - the collector sees which offer is gone and which one is theirs to answer

- **GIVEN** a case whose offer of 3,000,000 HKD minor units was superseded yesterday by a live offer of 4,000,000 HKD minor units
- **WHEN** its owner reads the case
- **THEN** the read carries the 3,000,000 HKD minor units offer as superseded and the 4,000,000 HKD minor units offer as open, with its terms
- **AND** the case's history carries the day the first closed

#### Scenario: grade10-site-vault-valuation-and-offer-SC-27 - An answer naming the replaced offer is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-05 - the collector's answer never lands on the offer that was withdrawn

- **GIVEN** the same case
- **WHEN** an answer names the superseded offer
- **THEN** it is refused by name and the live offer is still open and unanswered

### Requirement: A refused answer is named to whoever gave it

An offer can run out, and a case can move, between the collector reading it
and their answer landing.

**What it names** - a refused answer SHALL say which happened: the offer ran
out, the offer was replaced, or the case moved under the answer.

**Nothing moves** - a refused answer SHALL leave the case and its offers as
they were, so the next read shows where the case now stands.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-28 - An offer that ran out under the reader
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector whose offer lapsed under them is told where they answered

- **GIVEN** a collector who read a case whose offer then expired
- **WHEN** they accept it
- **THEN** the answer is refused by name as an offer that ran out
- **AND** the next read reads an offer that ran out

#### Scenario: grade10-site-vault-valuation-and-offer-SC-29 - A case that moved under the answer
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector whose case moved under them reads why the answer did not land

- **GIVEN** a collector who read a live offer that the counter accepted a moment later
- **WHEN** they accept it, naming the instant they read it at
- **THEN** the answer is refused by name as a case that moved under the answer
- **AND** the next read reads where the case now stands
