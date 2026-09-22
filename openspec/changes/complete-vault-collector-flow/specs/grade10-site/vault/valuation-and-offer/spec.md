# grade10-site/vault/valuation-and-offer Specification

## Feature set

- The valuation
  - Every case valued: the paper prints what the item was worth when it came in
  - Appended, never edited: a re-valuation leaves both figures readable
  - Never below a live offer: one packet may not print a valuation under the
    loan on its next page
- The offer
  - What an offer states: a principal, the interest for the whole term, a term
    in days and an expiry — and no due date, because nothing is lent yet
  - One live offer: a counter-offer supersedes and inserts in one act
  - Bounded by the valuation: the principal is at most what the item was
    valued at
- What the brand lends under
  - One policy table: loan to value, the rate band, the term presets, offer
    validity, grace, the accrual ceiling and the notice period, per brand
  - A null bound: allows everything outside production, and refuses the offer
    in production
  - The lender named: no offer in production while the lender's registered
    name is unset
- Answering the offer
  - The collector or the counter: either may accept, and the signature is what
    binds
  - Declining keeps the request: the offer closes and staff may write another
  - An expired offer: cannot be accepted, and the case stays where it is
  - Answered from the case: Accept and Decline sit on the offer itself, each
    behind a confirmation naming the total, what a late day costs and what
    will be signed
  - Only the offer that stands: a superseded offer reads as closed and takes
    no answer, so the collector answers the live one
  - The refusal reaches the reader: an offer that ran out or a case that
    moved under the answer is named where the answer was given
- The storage lane
  - Terms with no offer: custody terms are agreed against the valuation alone

## ADDED Requirements

### Requirement: A collector answers the live offer from the case page

Accept and Decline sit on the offer the case holds, and each is confirmed
before it is sent.

A collector SHALL answer in these steps:

1. **Read the offer** — the case page SHALL name the principal, the term in
   days, the interest for the whole term, the total to repay, what a late day
   costs and the day to answer by, beside the valuation the offer was judged
   against.
2. **Press Accept or Decline** — both SHALL sit on the live offer itself, and
   neither SHALL answer the offer on its own.
3. **Read the confirmation** — Accept's confirmation SHALL name the total to
   repay, what a late day costs and what will be signed. Decline's SHALL name
   that the request stays open and a booked visit stands. Each SHALL offer
   going back, which SHALL leave the offer live and nothing answered.
4. **Confirm** — the answer SHALL be sent once, the confirmation SHALL stay
   until the answer lands, and the case SHALL be read again afterwards so the
   collector reads where the case now stands.

**Answer by** — wherever a case holding a live offer is listed, the listing
SHALL name the day to answer by, and SHALL name none once that offer is no
longer live.

**The visit stands apart** — the offer SHALL say that accepting it books no
visit.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-21 - The offer reads with its terms and its valuation
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a case valued at 10,000,000 HKD minor units holding a live offer of 4,000,000 HKD minor units over 60 days, with 160,000 HKD minor units of interest for the term
- **WHEN** its owner opens the case
- **THEN** the page names the 4,000,000 HKD minor units, the 60 days, the 160,000 HKD minor units of interest, the total of 4,160,000 HKD minor units, what a late day costs, the day to answer by and the 10,000,000 HKD minor units the offer was judged against
- **AND** Accept and Decline sit on the offer, which says that accepting it books no visit

#### Scenario: grade10-site-vault-valuation-and-offer-SC-22 - Accept is confirmed before it is sent
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a case holding a live offer
- **WHEN** its owner presses Accept
- **THEN** a confirmation names the total to repay, what a late day costs and what will be signed, and the offer is not answered
- **AND** going back leaves the offer live

#### Scenario: grade10-site-vault-valuation-and-offer-SC-23 - Decline is confirmed before it is sent
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a case holding a live offer and a visit booked on it
- **WHEN** its owner presses Decline
- **THEN** a confirmation names that the request stays open and the visit stands, and the offer is not answered
- **AND** going back leaves the offer live

#### Scenario: grade10-site-vault-valuation-and-offer-SC-24 - An answer is sent once and the case is read again
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a collector reading the Accept confirmation on a live offer
- **WHEN** they confirm and press the confirmation again before the answer lands
- **THEN** one answer is sent, the confirmation stays until it lands, and the case is read again afterwards

#### Scenario: grade10-site-vault-valuation-and-offer-SC-25 - The day to answer by leaves with the offer
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a collector whose case holds a live offer expiring on a stated day
- **WHEN** they read their cases before that day and again after the offer has lapsed
- **THEN** the case names the day to answer by the first time and names none the second

### Requirement: Only the offer that stands takes an answer

A case that has been counter-offered shows both offers and answers the live
one.

**Where the answer sits** — Accept and Decline SHALL be offered on the live
offer alone.

**A closed offer** — an offer that was superseded, declined, accepted or
expired SHALL read as closed, naming its principal and the day it closed, and
SHALL offer no answer.

**An answer to a closed offer** — SHALL be refused by name, and SHALL leave
the live offer open and unanswered.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-26 - A replaced offer reads as closed beside the new one
**Serves:** grade10-site-vault-valuation-and-offer-US-05 - Collector reads and answers an offer that replaced the last

- **GIVEN** a case whose offer of 3,000,000 HKD minor units was superseded yesterday by a live offer of 4,000,000 HKD minor units
- **WHEN** its owner opens the case
- **THEN** the page names the 3,000,000 HKD minor units as closed with the day it closed, and names the live offer's terms
- **AND** Accept and Decline sit on the 4,000,000 HKD minor units offer alone

#### Scenario: grade10-site-vault-valuation-and-offer-SC-27 - An answer naming the replaced offer is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-05 - Collector reads and answers an offer that replaced the last

- **GIVEN** the same case
- **WHEN** an answer names the superseded offer
- **THEN** it is refused by name and the live offer is still open and unanswered

### Requirement: A refused answer is named where the answer was given

An offer can run out, and a case can move, while the collector is reading it.

**In place** — a refused answer SHALL be named in the confirmation the
collector answered from, which SHALL stay open.

**What it names** — the refusal SHALL say which happened: the offer ran out,
or the case moved under the answer.

**Read again** — the case SHALL be read again after a refused answer, so the
page shows where the case now stands rather than the offer that was answered.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-28 - An offer that ran out under the reader
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a collector reading a case whose offer expired while the page was open
- **WHEN** they confirm Accept
- **THEN** the confirmation stays open naming that the offer ran out
- **AND** the case is read again and the page shows an offer that ran out

#### Scenario: grade10-site-vault-valuation-and-offer-SC-29 - A case that moved under the answer
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a collector reading the Accept confirmation on a live offer that the counter accepted a moment earlier
- **WHEN** they confirm
- **THEN** the confirmation stays open naming that the case moved under the answer
- **AND** the case is read again and the page shows where the case now stands
