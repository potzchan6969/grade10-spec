# grade10-site/vault/loan-and-settlement Specification

## Purpose

The loan itself: the advance that starts it, what it owes at any instant, how
repayments are allocated, how a wrong record is taken back, and the two acts
that end it — settlement and forfeiture.

Nothing here moves money. A person made the transfer at a bank and a person
writes down that it moved, and when. What the loan was agreed to be is
`grade10-site/vault/valuation-and-offer`; what the borrower is told about it
is `grade10-site/vault/collector-notifications`.

## Feature set

- The advance
  - Two people: the person who priced the loan is not the person who sends its
    money
  - The paper first: the value date is on or after the day the signed set was
    sealed, and the item is in the vault
  - The term starts here: the due date is fixed from the value date and
    confirmed to the borrower in writing
- What is owed
  - Computed at every read: never stored, never a status, never below zero
  - Whole-term interest: owed from the first day, so redeeming early buys the
    item back rather than the interest
  - Overdue accrual: the term's own daily rate on the principal still
    outstanding — no fee, no compounding, no higher rate
  - One rounding: the total is principal plus interest exactly
- Recording money
  - Value date and provenance: what the arithmetic follows, and who wrote it
    down when
  - The quote holds or it refuses: a figure that moved is refused by name
    rather than recorded as a partial payment
  - The recorder's key: the same transfer cannot land twice
  - No over-repayment: a payment that would put the loan over what it owed on
    its own day is refused
- Corrections
  - A whole record, once: an append that takes one back, by a second money
    holder who is not its recorder
  - Nothing re-dates: the arithmetic becomes what it would have been had the
    record never been written
- Ending the loan
  - Settlement: the recording that leaves nothing owed at its own value date
  - Forfeiture: past due, a written notice, its cure period elapsed, and a
    person's decision
  - Release: refused while anything is outstanding

## Requirements

### Requirement: The advance is recorded by a second person and starts the term

A person holding the vault payout grant SHALL record the advance against a
case whose item is in the vault. The record SHALL carry:

| Fact | Rule |
| --- | --- |
| Amount | integer minor units, equal to the accepted offer's principal |
| Bank reference | required, shown to staff only |
| Value date | the day the money left; not in the future, and not before the signed set was sealed |

It SHALL be refused by name when: an advance already stands on the case; there
is no completed signed set covering the case's lane; the item is not in
custody; there is no accepted offer; the amount differs from the principal;
the value date is in the future or earlier than the seal; or the recorder is
the person who made the offer being paid out.

The term SHALL run from the value date: the loan falls due at the last moment
of the calendar day the brand's zone puts `term days` after it, and that due
date SHALL be fixed when the advance is recorded and SHALL NOT move with a
later correction of another record.

The case SHALL become `active` in the same act, and the borrower SHALL be told
the calendar date in writing.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-01 - The offer's maker may not pay it out
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** an accepted offer written by one operator
- **WHEN** that same operator records the advance
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-02 - A value date before the signature is refused
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** a case whose signed set was sealed on the 10th
- **WHEN** an advance is recorded with a value date of the 9th
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-03 - The term runs from the advance
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** an offer of a 30-day term accepted on 1 September
- **WHEN** the advance is recorded with a value date of 15 September
- **THEN** the loan falls due at the end of 15 October on the brand's own calendar

#### Scenario: grade10-site-vault-loan-and-settlement-SC-04 - An amount that is not the principal is refused
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** an accepted principal of 4,000,000 HKD minor units
- **WHEN** an advance of 3,900,000 HKD minor units is recorded
- **THEN** it is refused by name

### Requirement: What a loan owes is computed at every read

What a loan owes SHALL be derived, at the instant asked about, from the
accepted offer, the money valued at or before that instant, and the brand's
accrual bounds. It SHALL never be stored, never be a status, and never be
below zero. Every surface, guard and report that names an amount owed SHALL
answer from the same derivation, so no two can disagree.

| Rule | Value |
| --- | --- |
| Term interest | principal × the term's rate, owed in full from the first day; early repayment earns no rebate |
| Due instant | the last moment of the calendar day the brand's zone puts `term days` after the advance's value date |
| Overdue interest | one `term days`th of the term's interest for each started day of the brand's calendar after the due date plus the brand's grace days, charged on the principal still outstanding, simple |
| No other charge | no late fee, no stepped rate and no compounding is ever added |
| Ceiling | term and overdue interest together never pass the brand's accrual ceiling |
| Rounding | one half-up rounding of the exact figure; the total is principal plus interest exactly |
| Settlement | the recording that leaves nothing owed at its own value date; interest stops there and never restarts |

Worked at a principal of 10,000,000 HKD minor units, 300 basis points for a
30-day term, no grace, advanced on 1 September and so due on 1 October:

- repaid on day 10 — 10,300,000 owed, the whole term's interest included
- repaid 10 days late — 10,400,000 owed, at 10,000 for each started day
- 9,000,000 repaid on day 10 and the rest 10 days late — 1,313,000 still owed

#### Scenario: grade10-site-vault-loan-and-settlement-SC-05 - Early repayment owes the whole term's interest
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** the worked loan above
- **WHEN** it is quoted for day 10
- **THEN** it owes 10,300,000 HKD minor units

#### Scenario: grade10-site-vault-loan-and-settlement-SC-06 - Overdue days charge the term's own daily rate
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** the worked loan above
- **WHEN** it is quoted for 10 days past the due date
- **THEN** it owes 10,400,000 HKD minor units, and no fee has been added

#### Scenario: grade10-site-vault-loan-and-settlement-SC-07 - Interest stops at settlement
**Serves:** What is owed - interest stops at settlement

- **GIVEN** a loan settled in full on its due date
- **WHEN** it is quoted a month later
- **THEN** it owes nothing, and nothing accrued after the settlement

#### Scenario: grade10-site-vault-loan-and-settlement-SC-08 - Interest never passes the ceiling
**Serves:** What is owed - interest never passes the ceiling

- **GIVEN** a brand whose accrual ceiling is 10,000 basis points
- **WHEN** a loan nobody repaid is quoted far past its due date
- **THEN** the interest is at most the principal

### Requirement: Money is allocated interest first, in value-date order

Repayments SHALL be walked in value-date order, each judged at its own value
date. Each SHALL clear the interest accrued to that date before it touches the
principal, and overdue interest after it SHALL accrue on the principal still
outstanding.

A recording valued after the instant being asked about SHALL be left out of
that answer rather than subtracted from it.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-09 - A part payment cuts the arrears it runs on
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** the worked loan above
- **WHEN** 9,000,000 HKD minor units are repaid on day 10 and the loan is quoted 10 days past due
- **THEN** it owes 1,313,000 HKD minor units, the arrears having run on the 1,300,000 of principal left

#### Scenario: grade10-site-vault-loan-and-settlement-SC-10 - A payment takes its place in the walk
**Serves:** Recording money - a payment takes its place in the walk

- **GIVEN** a loan carrying a repayment valued on the 20th
- **WHEN** a repayment valued on the 5th is recorded afterwards
- **THEN** the answer is the same as if they had been recorded in date order

#### Scenario: grade10-site-vault-loan-and-settlement-SC-11 - A quote for a past date ignores later money
**Serves:** Recording money - a quote for a past date ignores later money

- **GIVEN** a loan repaid in full on the 30th
- **WHEN** it is quoted for the 20th
- **THEN** the answer is what stood on the 20th

### Requirement: A repayment is recorded against a quote and the day the money arrived

A person holding the vault payout grant SHALL record a repayment against an
active financed case. The record SHALL carry:

| Fact | Rule |
| --- | --- |
| Amount | integer minor units in the case's currency |
| Method | bank transfer, cash or card |
| Bank reference | required for a bank transfer, shown to staff only |
| Value date | the day the money reached us; not in the future and not before the advance's value date |
| Quoted balance | what the recorder was looking at, for that value date |
| Recorder's key | the caller's own name for this transfer, unique per case |

It SHALL be refused by name when: the case is a storage case; the case is not
active; the value date is in the future or before the advance; the quoted
balance is not what the loan owes at that value date; or the money, walked
into its place in value-date order, would put the loan over what it owed on
any of those days.

A repayment repeated under the same key SHALL answer with the recording
already made rather than writing a second. A key naming a recording that a
correction has taken back SHALL be refused by name.

A repayment that leaves nothing owed at its own value date SHALL settle the
loan and move the case to `repaid`.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-12 - A stale quote is refused rather than part-paid
**Serves:** Recording money - a stale quote is refused rather than part-paid

- **GIVEN** a quote taken before the loan stepped overdue
- **WHEN** the repayment is recorded against that quote
- **THEN** it is refused by name and nothing is written

#### Scenario: grade10-site-vault-loan-and-settlement-SC-13 - The same transfer cannot land twice
**Serves:** Recording money - the same transfer cannot land twice

- **WHEN** a repayment is recorded twice under one key
- **THEN** the case carries one repayment and the second answers with the first

#### Scenario: grade10-site-vault-loan-and-settlement-SC-14 - A payment above the balance is refused
**Serves:** Recording money - a payment above the balance is refused

- **GIVEN** a loan owing 1,000,000 HKD minor units at a value date
- **WHEN** 1,200,000 HKD minor units are recorded against it at that date
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-15 - Settling moves the case
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** an active loan
- **WHEN** a repayment leaves nothing owed at its value date
- **THEN** the case is `repaid` and the borrower is told

### Requirement: A correction takes one whole record back

A person holding the vault payout grant SHALL be able to take back one whole
advance or repayment, with a reason, by appending a correction. Nothing SHALL
be edited or deleted to do it.

It SHALL be refused by name when: the record is not one this case still counts
— a correction has already taken it back; the person recording the correction
is the person who recorded the row; the case is neither active nor repaid; or
the advance is being taken back while repayments still stand against it.

A correction SHALL restore the arithmetic to what it would have been had the
row never been written; nothing SHALL be re-dated. The borrower SHALL be told.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-16 - Nobody takes back their own record
**Serves:** grade10-site-vault-loan-and-settlement-US-03 - Treasurer takes back a record the bank rejected

- **GIVEN** a repayment recorded by one operator
- **WHEN** that same operator tries to take it back
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-17 - The repayments come off before the advance
**Serves:** grade10-site-vault-loan-and-settlement-US-03 - Treasurer takes back a record the bank rejected

- **GIVEN** an active loan carrying two repayments
- **WHEN** the advance is taken back
- **THEN** it is refused by name until both repayments have been

#### Scenario: grade10-site-vault-loan-and-settlement-SC-18 - A correction does not re-date the loan
**Serves:** grade10-site-vault-loan-and-settlement-US-03 - Treasurer takes back a record the bank rejected

- **GIVEN** a loan whose repayment is taken back
- **WHEN** it is quoted afterwards
- **THEN** the answer is what it would have been had that repayment never been recorded, on the same due date

### Requirement: Forfeiture needs a written notice whose cure period has passed

Staff holding the vault approve grant SHALL be able to send the borrower a
written notice that the item may be taken to settle the debt. It SHALL be
refused by name unless the case carries an advance that is past its due date,
and unless the brand has set a notice period.

The notice SHALL name what is owed and a cure date — the last moment of the
calendar day the brand's zone puts the notice period after it — and SHALL be
recorded on the case. Sending it SHALL move nothing.

Forfeiting SHALL be refused by name unless the loan is past due, a notice
stands, and the cure date that notice named has passed. The cure date SHALL be
read from the notice the borrower was sent, never recomputed from the brand's
current notice period.

Forfeiting SHALL be a person's act. On it the item SHALL leave custody, the
figure the item settled SHALL reach the case's audit trail, and the collector
SHALL be told.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-19 - Nothing is taken without a notice
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a loan a month past its due date and no notice on the record
- **WHEN** staff try to forfeit it
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-20 - Nothing is taken inside the cure period
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a notice sent three days ago naming a cure date 14 days on
- **WHEN** staff try to forfeit the item
- **THEN** it is refused by name, and the refusal names the earliest date it becomes possible

#### Scenario: grade10-site-vault-loan-and-settlement-SC-21 - A shortened notice period does not bring the date forward
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a notice naming a cure date, and a brand that afterwards shortens its notice period
- **WHEN** staff try to forfeit before the date the borrower was given
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-22 - Forfeiture settles the debt with the item
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a loan past due whose notice period has elapsed
- **WHEN** staff forfeit it
- **THEN** the case is `forfeited`, the item has left custody, the figure it settled is on the case's audit trail, and the collector is told

### Requirement: The item is released only when nothing is outstanding

The item SHALL be released only when the case owes nothing and no signing
packet is open, and only against a signed release document. A storage case
SHALL owe nothing, because storage carries no fee.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-23 - A loan still owing keeps the item
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** an active loan with a balance outstanding
- **WHEN** staff try to release the item
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-24 - A storage case owes nothing
**Serves:** Ending the loan - a storage case owes nothing

- **GIVEN** a storage case in the vault
- **WHEN** its release is prepared
- **THEN** nothing is outstanding to refuse it

### Requirement: Every money record keeps who wrote it and when

Every advance, repayment and correction SHALL keep who recorded it and the
instant they did, beside the value date the money moved on. The arithmetic
SHALL follow the value date; a reader SHALL be able to see both.

A bank reference SHALL be kept on the money record and SHALL NOT be written
into the case's history or its audit trail, and SHALL be shown to staff only.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-25 - Two clocks on one record

- **GIVEN** a transfer that arrived on Friday and was written down on Monday
- **WHEN** the record is read
- **THEN** it names Friday as the value date and Monday as when it was recorded, and the balance follows Friday

#### Scenario: grade10-site-vault-loan-and-settlement-SC-26 - The bank reference stays out of the trail

- **WHEN** a repayment carrying a bank reference is recorded
- **THEN** the case's audit trail carries the case, the amount and the method, and not the reference
