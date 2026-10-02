# grade10-site/vault/valuation-and-offer Specification

## Purpose

What the shop says the item is worth, what it will lend against it, and how
the collector answers.

The valuation is written on every case, because the custody agreement prints
it. The offer exists only on the financed lane, and every bound it is judged
against is the brand's own decision, held in one table and applied in one
gate. What the advance does afterwards is
`grade10-site/vault/loan-and-settlement`.

## Feature set

- The valuation
  - Every case valued: the paper prints what the item was worth when it came in
  - Appended, never edited: a re-valuation leaves both figures readable
  - Never below a live offer: one packet may not print a valuation under the
    loan on its next page
  - The slab beside the figure: grader, grade and cert read from the item
    register, corrected there and never on the valuation
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

## Requirements

### Requirement: Every case is valued before terms are agreed

Staff holding the vault approve grant SHALL record a valuation on any case
being valued or holding a live offer. A valuation SHALL carry an amount as an
integer count of minor units in the case's own currency and an optional note,
and SHALL be appended: an earlier valuation is never edited or removed.

A valuation below the principal of a live offer SHALL be refused by name.
Withdrawing the offer is the way down.

Terms SHALL NOT be agreed on either lane before a valuation exists.

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-x56 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-01 - A re-valuation is appended
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - Operator prices a loan against an item they have valued

- **GIVEN** a case valued at 10,000,000 HKD minor units
- **WHEN** staff record a second valuation of 8,000,000 HKD minor units
- **THEN** both figures are readable and the later one is what an offer is judged against

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-9uy rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-02 - A valuation under a live offer is refused
**Serves:** The valuation - a valuation under a live offer is refused

- **GIVEN** a case holding a live offer of 4,000,000 HKD minor units
- **WHEN** staff record a valuation of 3,000,000 HKD minor units
- **THEN** it is refused by name and the valuation is not written

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-ey2 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-03 - Terms need a valuation
**Serves:** grade10-site-vault-valuation-and-offer-US-03 - Collector who only wants storage agrees terms

- **GIVEN** a case nobody has valued
- **WHEN** an offer or custody terms are asked for
- **THEN** it is refused by name

### Requirement: An offer states the terms and carries no due date

An offer SHALL carry exactly these facts:

| Fact | Rule |
| --- | --- |
| Principal | integer minor units, at most the latest valuation and at most the brand's loan-to-value bound |
| Interest | basis points for the whole term, inside the brand's band |
| Term | whole days, one of the brand's presets where it names any |
| Expiry | an instant after now, no further off than the brand's offer-validity window |

An offer SHALL NOT carry a due date: the term runs from the day the money is
advanced, and nothing has been advanced when an offer is written.

Outside the brand's own bounds, the outermost limits SHALL be interest of 0 to
10,000 basis points and a term of 1 to 3,650 days.

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-jsc rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-04 - An offer above the valuation is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - Operator prices a loan against an item they have valued

- **GIVEN** a case valued at 10,000,000 HKD minor units
- **WHEN** an offer of 11,000,000 HKD minor units is written
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-bap rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-05 - An offer already expired is refused
**Serves:** Answering the offer - an offer already expired is refused

- **WHEN** an offer is written with an expiry that has already passed
- **THEN** it is refused by name

### Requirement: Every offer is judged against the brand's lending policy

One brand-level table SHALL hold every bound an offer is judged against, and
one gate SHALL apply all of them:

| Bound | Rule when set | Grade10 |
| --- | --- | --- |
| Loan to value | principal at most this share of the latest valuation | 4,000 basis points |
| Rate band | interest compared as `interest × 30 ÷ term days`, so one band judges every term | 150 to 250 basis points per 30 days |
| Term presets | the term is one of these | 30, 60, 90, 120 days |
| Offer validity | the expiry is no further off than this | 7 days |
| Grace | days past the due date before overdue interest starts | 0 |
| Accrual ceiling | interest of every kind together never passes this share of the principal | 10,000 basis points |
| Forfeiture notice | the cure period a written notice gives | 14 days |

A bound nobody has set SHALL allow everything outside production.

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-sgl rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-06 - A rate above the band is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - Operator prices a loan against an item they have valued

- **GIVEN** a brand whose band is 150 to 250 basis points per 30 days
- **WHEN** an offer of 600 basis points over a 60-day term is written
- **THEN** it is refused by name, because 600 over 60 days is 300 per 30 days

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-3m0 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-07 - One band judges every term
**Serves:** What the brand lends under - one band judges every term

- **GIVEN** the same brand
- **WHEN** an offer of 500 basis points over a 60-day term is written
- **THEN** it is accepted, because 500 over 60 days is 250 per 30 days

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-lyt rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-08 - A term the brand does not write is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - Operator prices a loan against an item they have valued

- **GIVEN** a brand whose presets are 30, 60, 90 and 120 days
- **WHEN** an offer over 45 days is written
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-33m rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-09 - An expiry past the validity window is refused
**Serves:** What the brand lends under - an expiry past the validity window is refused

- **GIVEN** a brand that leaves an offer open for 7 days
- **WHEN** an offer expiring in 30 days is written
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-valuation-and-offer-SC-30 - An offer at the loan-to-value bound is made and one unit past it is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - Operator prices a loan against an item they have valued

- **GIVEN** a brand that lends at most 4,000 basis points of the latest
  valuation, and an item whose latest valuation is 2,500,000 HKD minor units
- **WHEN** an offer of 1,000,000 HKD minor units is written, every other bound
  met
- **THEN** it is made
- **WHEN** an offer of 1,000,001 HKD minor units is written, every other bound
  met
- **THEN** it is refused by name, naming the loan-to-value bound

### Requirement: In production an unset bound or an unnamed lender refuses the offer

In production, an offer SHALL be refused by name while the brand has left any
bound but grace unset - loan to value, either end of the rate band, the term
presets, offer validity, the accrual ceiling or the forfeiture-notice period -
and separately while anything the loan it leads to prints is unset: the
lender's registered name, the trading name, the licence number, the licence
wording, the FPS id or the bank account. Each refusal SHALL name what is
missing.

Neither SHALL refuse a deploy, and neither SHALL refuse a storage case: a shop
whose lender is still being registered SHALL keep taking items into custody.

Outside production both SHALL be allowed, so that a brand can rehearse the
flow before its values are decided.

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-do8 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-10 - A production offer under a null bound is refused
**Serves:** What the brand lends under - a production offer under a null bound is refused

- **GIVEN** a brand in production with no loan-to-value bound set
- **WHEN** an offer is written
- **THEN** it is refused by name, naming the bound

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-xk5 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-11 - A production offer with no lender named is refused
**Serves:** What the brand lends under - a production offer with no lender named is refused

- **GIVEN** a brand in production whose lender has no registered name
- **WHEN** an offer is written
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-e9b rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-12 - Custody still opens
**Serves:** grade10-site-vault-valuation-and-offer-US-03 - Collector who only wants storage agrees terms

- **GIVEN** the same brand
- **WHEN** a storage case is taken through to the vault
- **THEN** nothing refuses it

#### Scenario: grade10-site-vault-valuation-and-offer-SC-31 - A production offer with no licence line is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - a production offer whose loan would print no licence is refused

- **GIVEN** a brand in production whose lender is named and whose licence number is unset
- **WHEN** an offer is written
- **THEN** it is refused by name, naming the licence number

#### Scenario: grade10-site-vault-valuation-and-offer-SC-32 - A production offer with nowhere to pay is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - a production offer whose loan would name nowhere to pay is refused

- **GIVEN** a brand in production with every bound and the licence line set and no FPS id
- **WHEN** an offer is written
- **THEN** it is refused by name, naming the FPS id

### Requirement: A case carries one live offer, and a counter-offer replaces it

A case SHALL carry at most one live offer. Writing another SHALL close the
live one and insert the new one in a single act, so the case is never left
with none and never with two.

An offer SHALL hold one of these states, and only the first is live:

| State | Reached by |
| --- | --- |
| open | being written |
| accepted | the collector or the counter accepting it |
| superseded | a counter-offer, or staff withdrawing it |
| declined by customer | the collector declining it |
| expired | its own expiry passing |

Staff withdrawing an offer, and the collector declining one, SHALL both return
the case to being valued with the request still open, so another offer may be
written.

An offer that reaches its expiry SHALL be closed, the collector SHALL be told,
and the case SHALL stay where it is.

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-r51 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-13 - A counter-offer replaces the first
**Serves:** grade10-site-vault-valuation-and-offer-US-01 - Operator prices a loan against an item they have valued

- **GIVEN** a case holding a live offer
- **WHEN** staff write another
- **THEN** the case holds exactly the new one and the first is superseded

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-pc4 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-14 - A declined offer leaves the request open
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a case holding a live offer
- **WHEN** its owner declines it
- **THEN** the offer is closed as declined by the collector, the case is being valued again, and another offer may be written

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-g0c rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-15 - A lapsed offer is closed and the case stays
**Serves:** Answering the offer - a lapsed offer is closed and the case stays

- **GIVEN** a case holding an offer whose expiry has passed
- **WHEN** the lapsed offers are swept
- **THEN** the offer is closed, the collector is told, and the case is still awaiting terms

### Requirement: The collector or the counter accepts, and an expired offer cannot be accepted

An offer SHALL be acceptable by the case's owner from their own case, and by
staff at the counter, with the same guards either way and the actor recorded.
Acceptance SHALL move the case to `accepted`.

Acceptance SHALL be refused by name when there is no live offer, and when the
offer's expiry has passed — judged when the acceptance lands, not when the
offer was read.

Accepting SHALL start nothing that costs the collector: no term begins and no
interest accrues until the advance is recorded.

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-08z rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-16 - A collector accepts from their own case
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a case holding a live offer
- **WHEN** its owner accepts it
- **THEN** the case is `accepted`, the offer is accepted, and the collector is recorded as the actor

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-sin rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-17 - An offer that lapsed cannot be accepted
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** a case whose offer expired an hour ago
- **WHEN** anyone accepts it
- **THEN** it is refused by name and the case stays where it is

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-w4b rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-18 - Accepting costs nothing yet
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - Collector answers an offer from their own phone

- **GIVEN** an offer accepted today for a 30-day term
- **WHEN** the money is advanced a week later
- **THEN** the term runs 30 days from the advance and the week costs the collector nothing

### Requirement: The storage lane agrees terms without an offer

A case on either lane SHALL move from being valued to `accepted` on custody
terms agreed at the counter, against a recorded valuation and with no offer, no
principal and no interest. A financed case stored this way SHALL sign the
custody agreement alone and SHALL never hold an advance or a balance, so a loan
request the shop is not yet lending against leaves valuation as stored rather
than only as declined or cancelled.

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-rll rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-19 - Storage terms need only the valuation
**Serves:** grade10-site-vault-valuation-and-offer-US-03 - Collector who only wants storage agrees terms

- **GIVEN** a valued storage case
- **WHEN** staff agree its custody terms
- **THEN** the case is `accepted` and no offer exists on it

<!-- trace:scenario id=g10.vault-valuation-and-offer.SC-6q6 rev=1 -->
#### Scenario: grade10-site-vault-valuation-and-offer-SC-20 - A loan request is stored while the shop is not lending
**Serves:** grade10-site-vault-valuation-and-offer-US-04 - Collector whose loan request the shop cannot yet price still gets the item stored

- **GIVEN** a valued financed case with no offer on the table
- **WHEN** staff agree its custody terms
- **THEN** the case is `accepted` with no offer, its packet holds the custody agreement alone, and nothing is ever advanced or owed on it

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
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector reads every figure they are being asked to agree to before they answer

- **GIVEN** a case valued at 10,000,000 HKD minor units holding a live offer of 4,000,000 HKD minor units over 60 days, with 160,000 HKD minor units of interest for the term
- **WHEN** its owner opens the case
- **THEN** the page names the 4,000,000 HKD minor units, the 60 days, the 160,000 HKD minor units of interest, the total of 4,160,000 HKD minor units, what a late day costs, the day to answer by and the 10,000,000 HKD minor units the offer was judged against
- **AND** Accept and Decline sit on the offer, which says that accepting it books no visit

#### Scenario: grade10-site-vault-valuation-and-offer-SC-22 - Accept is confirmed before it is sent
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector is shown what accepting costs before the answer goes

- **GIVEN** a case holding a live offer
- **WHEN** its owner presses Accept
- **THEN** a confirmation names the total to repay, what a late day costs and what will be signed, and the offer is not answered
- **AND** going back leaves the offer live

#### Scenario: grade10-site-vault-valuation-and-offer-SC-23 - Decline is confirmed before it is sent
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector who says no is told what they keep — the request and the visit

- **GIVEN** a case holding a live offer and a visit booked on it
- **WHEN** its owner presses Decline
- **THEN** a confirmation names that the request stays open and the visit stands, and the offer is not answered
- **AND** going back leaves the offer live

#### Scenario: grade10-site-vault-valuation-and-offer-SC-24 - An answer is sent once and the case is read again
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector who presses twice sends one answer and reads where the case stands

- **GIVEN** a collector reading the Accept confirmation on a live offer
- **WHEN** they confirm and press the confirmation again before the answer lands
- **THEN** one answer is sent, the confirmation stays until it lands, and the case is read again afterwards

#### Scenario: grade10-site-vault-valuation-and-offer-SC-25 - The day to answer by leaves with the offer
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector reads the day to answer by while it still means something

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
**Serves:** grade10-site-vault-valuation-and-offer-US-05 - the collector sees which offer is gone and which one is theirs to answer

- **GIVEN** a case whose offer of 3,000,000 HKD minor units was superseded yesterday by a live offer of 4,000,000 HKD minor units
- **WHEN** its owner opens the case
- **THEN** the page names the 3,000,000 HKD minor units as closed with the day it closed, and names the live offer's terms
- **AND** Accept and Decline sit on the 4,000,000 HKD minor units offer alone

#### Scenario: grade10-site-vault-valuation-and-offer-SC-27 - An answer naming the replaced offer is refused
**Serves:** grade10-site-vault-valuation-and-offer-US-05 - the collector’s answer never lands on the offer that was withdrawn

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
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector whose offer lapsed under them is told where they answered

- **GIVEN** a collector reading a case whose offer expired while the page was open
- **WHEN** they confirm Accept
- **THEN** the confirmation stays open naming that the offer ran out
- **AND** the case is read again and the page shows an offer that ran out

#### Scenario: grade10-site-vault-valuation-and-offer-SC-29 - A case that moved under the answer
**Serves:** grade10-site-vault-valuation-and-offer-US-02 - the collector whose case moved under them reads why the answer did not land

- **GIVEN** a collector reading the Accept confirmation on a live offer that the counter accepted a moment earlier
- **WHEN** they confirm
- **THEN** the confirmation stays open naming that the case moved under the answer
- **AND** the case is read again and the page shows where the case now stands

### Requirement: A valuation is read beside the item's grader, grade and cert

Recording a valuation SHALL show, above the amount, the item's grader, grade
and cert read from the item register, read-only, where the item has a grader,
and nothing where it has none. A valuation SHALL keep no grader, grade or cert
of its own: a correction SHALL be made on the register, from the Case tab's
Edit, and every later read SHALL show it.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-33 - A slab is valued beside its grader, grade and cert
**Serves:** grade10-site-vault-valuation-and-offer-US-06 - staff value the slab in their hand against what the register says it is

- **GIVEN** a case whose item the register holds as PSA, `10`, cert `12345678`
- **WHEN** staff open Record a valuation
- **THEN** a read-only line reads PSA, `10` and `12345678` above the amount

#### Scenario: grade10-site-vault-valuation-and-offer-SC-34 - An item with no grader shows no line
**Serves:** grade10-site-vault-valuation-and-offer-US-06 - staff value a watch nobody graded

- **GIVEN** a case whose item has no grader
- **WHEN** staff open Record a valuation
- **THEN** no grader, grade or cert line is shown

#### Scenario: grade10-site-vault-valuation-and-offer-SC-35 - A correction is made on the register and read everywhere
**Serves:** grade10-site-vault-valuation-and-offer-US-06 - staff find the slab says 9, not 10

- **GIVEN** a valuation recorded beside PSA `10`
- **WHEN** staff correct the grade to `9` from the Case tab's Edit and open Record a valuation again
- **THEN** the line reads `9`, and the valuation offers no field for a grade
