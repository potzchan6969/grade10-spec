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

#### Scenario: grade10-site-vault-valuation-and-offer-SC-01 - A re-valuation is appended

- **GIVEN** a case valued at 10,000,000 HKD minor units
- **WHEN** staff record a second valuation of 8,000,000 HKD minor units
- **THEN** both figures are readable and the later one is what an offer is judged against

#### Scenario: grade10-site-vault-valuation-and-offer-SC-02 - A valuation under a live offer is refused

- **GIVEN** a case holding a live offer of 4,000,000 HKD minor units
- **WHEN** staff record a valuation of 3,000,000 HKD minor units
- **THEN** it is refused by name and the valuation is not written

#### Scenario: grade10-site-vault-valuation-and-offer-SC-03 - Terms need a valuation

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

#### Scenario: grade10-site-vault-valuation-and-offer-SC-04 - An offer above the valuation is refused

- **GIVEN** a case valued at 10,000,000 HKD minor units
- **WHEN** an offer of 11,000,000 HKD minor units is written
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-valuation-and-offer-SC-05 - An offer already expired is refused

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

#### Scenario: grade10-site-vault-valuation-and-offer-SC-06 - A rate above the band is refused

- **GIVEN** a brand whose band is 150 to 250 basis points per 30 days
- **WHEN** an offer of 600 basis points over a 60-day term is written
- **THEN** it is refused by name, because 600 over 60 days is 300 per 30 days

#### Scenario: grade10-site-vault-valuation-and-offer-SC-07 - One band judges every term

- **GIVEN** the same brand
- **WHEN** an offer of 500 basis points over a 60-day term is written
- **THEN** it is accepted, because 500 over 60 days is 250 per 30 days

#### Scenario: grade10-site-vault-valuation-and-offer-SC-08 - A term the brand does not write is refused

- **GIVEN** a brand whose presets are 30, 60, 90 and 120 days
- **WHEN** an offer over 45 days is written
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-valuation-and-offer-SC-09 - An expiry past the validity window is refused

- **GIVEN** a brand that leaves an offer open for 7 days
- **WHEN** an offer expiring in 30 days is written
- **THEN** it is refused by name

### Requirement: In production an unset bound or an unnamed lender refuses the offer

In production, an offer SHALL be refused by name while the brand has set no
loan-to-value bound, no rate ceiling, no offer-validity window or no
forfeiture-notice period, and separately while the lender's registered name is
unset. Both refusals SHALL name what is missing.

Neither SHALL refuse a deploy, and neither SHALL refuse a storage case: a shop
whose lender is still being registered SHALL keep taking items into custody.

Outside production both SHALL be allowed, so that a brand can rehearse the
flow before its values are decided.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-10 - A production offer under a null bound is refused

- **GIVEN** a brand in production with no loan-to-value bound set
- **WHEN** an offer is written
- **THEN** it is refused by name, naming the bound

#### Scenario: grade10-site-vault-valuation-and-offer-SC-11 - A production offer with no lender named is refused

- **GIVEN** a brand in production whose lender has no registered name
- **WHEN** an offer is written
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-valuation-and-offer-SC-12 - Custody still opens

- **GIVEN** the same brand
- **WHEN** a storage case is taken through to the vault
- **THEN** nothing refuses it

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

#### Scenario: grade10-site-vault-valuation-and-offer-SC-13 - A counter-offer replaces the first

- **GIVEN** a case holding a live offer
- **WHEN** staff write another
- **THEN** the case holds exactly the new one and the first is superseded

#### Scenario: grade10-site-vault-valuation-and-offer-SC-14 - A declined offer leaves the request open

- **GIVEN** a case holding a live offer
- **WHEN** its owner declines it
- **THEN** the offer is closed as declined by the collector, the case is being valued again, and another offer may be written

#### Scenario: grade10-site-vault-valuation-and-offer-SC-15 - A lapsed offer is closed and the case stays

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

#### Scenario: grade10-site-vault-valuation-and-offer-SC-16 - A collector accepts from their own case

- **GIVEN** a case holding a live offer
- **WHEN** its owner accepts it
- **THEN** the case is `accepted`, the offer is accepted, and the collector is recorded as the actor

#### Scenario: grade10-site-vault-valuation-and-offer-SC-17 - An offer that lapsed cannot be accepted

- **GIVEN** a case whose offer expired an hour ago
- **WHEN** anyone accepts it
- **THEN** it is refused by name and the case stays where it is

#### Scenario: grade10-site-vault-valuation-and-offer-SC-18 - Accepting costs nothing yet

- **GIVEN** an offer accepted today for a 30-day term
- **WHEN** the money is advanced a week later
- **THEN** the term runs 30 days from the advance and the week costs the collector nothing

### Requirement: The storage lane agrees terms without an offer

A storage case SHALL move from being valued to `accepted` on custody terms
agreed at the counter, against a recorded valuation and with no offer, no
principal and no interest.

#### Scenario: grade10-site-vault-valuation-and-offer-SC-19 - Storage terms need only the valuation

- **GIVEN** a valued storage case
- **WHEN** staff agree its custody terms
- **THEN** the case is `accepted` and no offer exists on it
