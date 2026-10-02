# grade10-site/vault/loan-and-settlement Specification

## Purpose

The loan itself: the advance that starts it, what it owes at any instant, how
repayments are allocated, how a wrong record is taken back, where the borrower
sends the money, and the two acts that end it — settlement and forfeiture.

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
  - The annualised rate: the term's interest read as a simple yearly rate, the
    figure the loan agreement prints
  - Each repayment, on the case: the borrower's read of their live loan carries
    its value date, its method and what the balance was after it
  - What is coming: the borrower's read carries the dates the reminders go,
    until a notice stops them
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
  - The notice, on the case: the borrower's read carries the day it was
    written, the date to pay by, and that nothing can be taken before that date
- How to pay
  - One block, wherever money is named: the same set on the live loan and in
    every money message
  - What it names: the lender's FPS id, its bank account under the lender's
    registered name, the case reference as the transfer reference, and card or
    cash at the counter
  - The reference ties the transfer: a treasurer matches what arrived to the
    case by the reference the borrower typed
  - A value nobody has set: bracketed outside production, and refused in
    production rather than sent blank
- The rule before the act
  - Said before it is sent: the offer, the vaulting and the payout each state
    their bounds and preconditions on the way in, not in the refusal after
  - The offer's figures: the cap, the term presets, and the interest, total,
    late-day and annualised figures the terms derive
  - The vaulting's preconditions: what must already stand before an item is
    confirmed into the vault
  - The payout's consequences: the two people it needs, and the due date and
    reminder dates its value date fixes
  - The worker still refuses: a stated rule teaches the operator and stands in
    for no guard

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

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-3g8 rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-01 - The offer's maker may not pay it out
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** an accepted offer written by one operator
- **WHEN** that same operator records the advance
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-72r rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-02 - A value date before the signature is refused
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** a case whose signed set was sealed on the 10th
- **WHEN** an advance is recorded with a value date of the 9th
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-6zm rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-03 - The term runs from the advance
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** an offer of a 30-day term accepted on 1 September
- **WHEN** the advance is recorded with a value date of 15 September
- **THEN** the loan falls due at the end of 15 October on the brand's own calendar

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-0as rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-04 - An amount that is not the principal is refused
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** an accepted principal of 4,000,000 HKD minor units
- **WHEN** an advance of 3,900,000 HKD minor units is recorded
- **THEN** it is refused by name

#### Scenario: grade10-site-vault-loan-and-settlement-SC-49 - An advance with no bank reference is refused
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** a case in the vault with an accepted offer
- **WHEN** an advance equal to its principal is recorded with no bank reference
- **THEN** it is refused by name
- **AND** the case stays in the vault with no advance recorded

#### Scenario: grade10-site-vault-loan-and-settlement-SC-50 - A second advance on the same case is refused
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** a case whose advance is already recorded
- **WHEN** another advance is recorded against it
- **THEN** it is refused by name
- **AND** the advance already recorded is unchanged

#### Scenario: grade10-site-vault-loan-and-settlement-SC-51 - An advance before the item is in custody is refused
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - Treasurer records the advance that starts the loan

- **GIVEN** a case with an accepted offer whose signed set is not yet sealed
  and whose item is not in the vault
- **WHEN** an advance is recorded against it
- **THEN** it is refused by name
- **AND** the case has not moved

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
| Annualised rate | the term's interest ÷ the principal × 365 ÷ the term's days, as a percentage rounded half-up to one decimal place; the rate the loan agreement prints simple per annum, and the one figure every surface naming an annualised rate answers from |
| Settlement | the recording that leaves nothing owed at its own value date; interest stops there and never restarts |

Worked at a principal of 10,000,000 HKD minor units, 300 basis points for a
30-day term, no grace, advanced on 1 September and so due on 1 October:

- repaid on day 10 — 10,300,000 owed, the whole term's interest included
- repaid 10 days late — 10,400,000 owed, at 10,000 for each started day
- 9,000,000 repaid on day 10 and the rest 10 days late — 1,313,000 still owed
- annualised — 36.5%

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-t4w rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-05 - Early repayment owes the whole term's interest
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** the worked loan above
- **WHEN** it is quoted for day 10
- **THEN** it owes 10,300,000 HKD minor units

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-3d7 rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-06 - Overdue days charge the term's own daily rate
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** the worked loan above
- **WHEN** it is quoted for 10 days past the due date
- **THEN** it owes 10,400,000 HKD minor units, and no fee has been added

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-xhh rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-07 - Interest stops at settlement
**Serves:** What is owed - interest stops at settlement

- **GIVEN** a loan settled in full on its due date
- **WHEN** it is quoted a month later
- **THEN** it owes nothing, and nothing accrued after the settlement

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-pdz rev=1 -->
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

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-1wl rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-09 - A part payment cuts the arrears it runs on
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** the worked loan above
- **WHEN** 9,000,000 HKD minor units are repaid on day 10 and the loan is quoted 10 days past due
- **THEN** it owes 1,313,000 HKD minor units, the arrears having run on the 1,300,000 of principal left

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-xmt rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-10 - A payment takes its place in the walk
**Serves:** Recording money - a payment takes its place in the walk

- **GIVEN** a loan carrying a repayment valued on the 20th
- **WHEN** a repayment valued on the 5th is recorded afterwards
- **THEN** the answer is the same as if they had been recorded in date order

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-o54 rev=1 -->
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

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-ceb rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-12 - A stale quote is refused rather than part-paid
**Serves:** Recording money - a stale quote is refused rather than part-paid

- **GIVEN** a quote taken before the loan stepped overdue
- **WHEN** the repayment is recorded against that quote
- **THEN** it is refused by name and nothing is written

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-z8d rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-13 - The same transfer cannot land twice
**Serves:** Recording money - the same transfer cannot land twice

- **WHEN** a repayment is recorded twice under one key
- **THEN** the case carries one repayment and the second answers with the first

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-wnm rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-14 - A payment above the balance is refused
**Serves:** Recording money - a payment above the balance is refused

- **GIVEN** a loan owing 1,000,000 HKD minor units at a value date
- **WHEN** 1,200,000 HKD minor units are recorded against it at that date
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-epv rev=1 -->
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

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-9ey rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-16 - Nobody takes back their own record
**Serves:** grade10-site-vault-loan-and-settlement-US-03 - Treasurer takes back a record the bank rejected

- **GIVEN** a repayment recorded by one operator
- **WHEN** that same operator tries to take it back
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-pbr rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-17 - The repayments come off before the advance
**Serves:** grade10-site-vault-loan-and-settlement-US-03 - Treasurer takes back a record the bank rejected

- **GIVEN** an active loan carrying two repayments
- **WHEN** the advance is taken back
- **THEN** it is refused by name until both repayments have been

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-nfc rev=1 -->
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

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-4xb rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-19 - Nothing is taken without a notice
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a loan a month past its due date and no notice on the record
- **WHEN** staff try to forfeit it
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-6xk rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-20 - Nothing is taken inside the cure period
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a notice sent three days ago naming a cure date 14 days on
- **WHEN** staff try to forfeit the item
- **THEN** it is refused by name, and the refusal names the earliest date it becomes possible

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-u4f rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-21 - A shortened notice period does not bring the date forward
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a notice naming a cure date, and a brand that afterwards shortens its notice period
- **WHEN** staff try to forfeit before the date the borrower was given
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-ii8 rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-22 - Forfeiture settles the debt with the item
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - Operator takes the collateral only after warning the borrower

- **GIVEN** a loan past due whose notice period has elapsed
- **WHEN** staff forfeit it
- **THEN** the case is `forfeited`, the item has left custody, the figure it settled is on the case's audit trail, and the collector is told

### Requirement: The item is released only when nothing is outstanding

The item SHALL be released only when the case owes nothing and no signing
packet is open, and only against a signed release document. A storage case
SHALL owe nothing, because storage carries no fee.

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-yni rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-23 - A loan still owing keeps the item
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - Borrower repays and takes the item home

- **GIVEN** an active loan with a balance outstanding
- **WHEN** staff try to release the item
- **THEN** it is refused by name

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-l3s rev=1 -->
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

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-pj0 rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-25 - Two clocks on one record
**Serves:** Recording money - two clocks on one record

- **GIVEN** a transfer that arrived on Friday and was written down on Monday
- **WHEN** the record is read
- **THEN** it names Friday as the value date and Monday as when it was recorded, and the balance follows Friday

<!-- trace:scenario id=g10.vault-loan-and-settlement.SC-mri rev=1 -->
#### Scenario: grade10-site-vault-loan-and-settlement-SC-26 - The bank reference stays out of the trail
**Serves:** Recording money - the bank reference stays out of the trail

- **WHEN** a repayment carrying a bank reference is recorded
- **THEN** the case's audit trail carries the case, the amount and the method, and not the reference

### Requirement: A live loan lists each repayment and what it left owing

The borrower's read of their own live loan carries the money already
returned, without a month of messages to add up.

- **Each repayment** - the read SHALL carry every repayment the case still
  counts, with its amount, its method, the day the money reached us, the day
  it was recorded, and what the loan owed after it.
- **The balance after** - SHALL be what the loan owed at that repayment's own
  value date, from the same derivation every other read answers from.
- **Order** - value-date order, earliest first, whatever order the recordings
  were written in.
- **A record taken back** - a repayment a correction has taken back SHALL NOT
  be carried, and the balances beside the repayments still counted SHALL read
  as if it had never been recorded.
- **None yet** - a live loan carrying no repayment SHALL carry an empty list.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-27 - A repayment reads with the day it arrived and what was left
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower opens the case to see what a payment did

- **GIVEN** a live loan of 10,000,000 HKD minor units of principal at 300
  basis points over a 30-day term, with 9,000,000 HKD minor units repaid by
  bank transfer on day 10
- **WHEN** the borrower reads the case
- **THEN** the read carries the repayment as 9,000,000 HKD minor units by bank
  transfer, naming day 10 as the day it reached us and the day it was
  recorded, and 1,300,000 HKD minor units as what was owed after it

#### Scenario: grade10-site-vault-loan-and-settlement-SC-28 - A loan nobody has repaid says so
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower checks the case before their first payment

- **GIVEN** a live loan with no repayment recorded
- **WHEN** the borrower reads the case
- **THEN** the read carries no repayment

#### Scenario: grade10-site-vault-loan-and-settlement-SC-29 - A repayment taken back leaves the list
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower reads the case after the bank sent a payment back

- **GIVEN** a live loan carrying two repayments, the earlier of which a
  correction has taken back
- **WHEN** the borrower reads the case
- **THEN** the read carries only the later repayment, and the balance beside
  it is what would have been owed had the earlier one never been recorded

### Requirement: A live loan names the reminders still to come

The borrower's read carries which reminders they have had, which are still
ahead of them, and what ends them.

- **The dates ahead** - the read of a live loan SHALL carry the day each
  remaining reminder goes, derived at the read from the due date and the
  schedule `grade10-site/vault/collector-notifications` sets.
- **Sent and ahead** - a reminder already sent SHALL be carried with the day
  it was sent, and SHALL NOT be carried as still to come.
- **A notice ends them** - once a forfeiture notice stands on the case, no
  reminder SHALL be carried as still to come.
- **Past due** - while a loan is past due and no notice stands, the read SHALL
  carry the reminders already sent with their days and the next weekly one
  by its date.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-30 - Only the reminders still ahead are named
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower plans when to pay from what is still coming

- **GIVEN** a live loan whose first reminder has already been sent
- **WHEN** the borrower reads the case
- **THEN** the reminder already sent is carried with the day it was sent and
  not as coming, and the remaining reminders are carried by their dates

#### Scenario: grade10-site-vault-loan-and-settlement-SC-31 - A notice ends the reminder dates
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower who has had the final notice stops being promised more mail

- **GIVEN** a past-due loan carrying a forfeiture notice
- **WHEN** the borrower reads the case
- **THEN** no reminder is carried as still to come

#### Scenario: grade10-site-vault-loan-and-settlement-SC-48 - Past due, the case names what comes next
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower past due reads what comes next

- **GIVEN** a past-due loan with two weekly reminders sent and no notice
  standing
- **WHEN** the borrower reads the case
- **THEN** both reminders sent are carried with their days, and the next
  weekly reminder is carried by its date

### Requirement: The forfeiture notice reads on the borrower's case

A borrower who has been sent the final notice reads it on their own case, not
only in their mail.

- **What the read carries** - the day the notice was written and the date to
  pay by it named, beside the reminders already sent. Nothing can be taken
  before that date, as "Forfeiture needs a written notice whose cure period
  has passed" states.
- **The date carried** - SHALL be the date the notice named, never one
  recomputed from the brand's notice period as it now stands.
- **No notice** - a loan past its due date with no notice standing SHALL carry
  none, and no date to pay by.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-32 - The notice reads with its date to pay by
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower reads how long is left to pay

- **GIVEN** a past-due loan sent a notice on 1 November naming 15 November as
  the date to pay by
- **WHEN** the borrower reads the case
- **THEN** the read carries 1 November as the day the notice was written and
  15 November as the date to pay by

#### Scenario: grade10-site-vault-loan-and-settlement-SC-33 - A shortened notice period does not move the date shown
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - the borrower is held to the date staff gave them, not a later rule

- **GIVEN** a notice naming a date to pay by, and a brand that afterwards
  shortens its notice period
- **WHEN** the borrower reads the case
- **THEN** the date carried is the one the notice named

#### Scenario: grade10-site-vault-loan-and-settlement-SC-34 - A past-due loan with no notice shows none
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower running late has had no notice yet

- **GIVEN** a loan past its due date with no notice on the record
- **WHEN** the borrower reads the case
- **THEN** no notice and no date to pay by is carried

### Requirement: How to pay is one block wherever an amount owed is named

A borrower is told where to send the money in the same values on their read
of a live loan and in every message about money.

| Field | Value |
| --- | --- |
| Payee | the lender's registered name already on file |
| FPS id | the lender's FPS id |
| Bank account | the lender's bank account, under that payee name |
| Transfer reference | the case reference, so a treasurer matches an arrived transfer to its case by what the borrower typed |
| At the counter | card or cash |

- **Where it appears** - on the borrower's read of a live loan, and in every
  message that names an amount owed or an amount received. The read of a
  case with no live loan SHALL carry no such block.
- **One set** - the read and every message SHALL carry the same values, so no
  two can disagree.
- **The figure holds** - the read SHALL carry the due instant, the instant the
  read was made at and what each further started day adds, so until when the
  amount owed holds - the due instant before it, the end of the day started
  after it - is read from it. The late-day figure SHALL be the rounded total a
  day past the reading less the rounded total at it, so it never disagrees
  with what the loan will owe.
- **A value nobody has set** - outside production the block SHALL carry a
  marked placeholder in place of the unset value. In production an unset
  payee name, FPS id or bank account SHALL NOT be carried: the read SHALL
  carry no block, and the borrower pays by card or cash at the counter. Until
  the value is set again, the counter SHALL record only a repayment that
  settles the loan; one leaving anything owed SHALL be refused by name, since
  its message would carry how to pay. The act that would send a message
  carrying an unset value is refused by
  `grade10-site/vault/collector-notifications`, which states that rule.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-35 - The block names the account and the case reference
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower pays at their own bank without asking the shop where

- **GIVEN** a live loan on a brand whose FPS id and bank account are set
- **WHEN** the borrower reads the case
- **THEN** the block carries the lender's registered name as payee, its FPS
  id, its bank account and the case reference as the transfer reference
- **AND** the read carries the due instant, the instant it was made at and
  what each further started day adds

#### Scenario: grade10-site-vault-loan-and-settlement-SC-36 - A money message carries the same block
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower pays from the message without opening the site

- **GIVEN** the same live loan
- **WHEN** a message naming an amount owed or an amount received is sent
- **THEN** it carries the same values as the block on the case

#### Scenario: grade10-site-vault-loan-and-settlement-SC-37 - A case with no live loan names no account
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower whose item is only stored is not asked to pay

- **GIVEN** a storage case in the vault
- **WHEN** the collector reads the case
- **THEN** the read carries no block naming an account or a reference

#### Scenario: grade10-site-vault-loan-and-settlement-SC-38 - An unset value prints bracketed outside production
**Serves:** How to pay - the shop reads a staging case before Finance has answered

- **GIVEN** a brand outside production whose FPS id is unset
- **WHEN** the block is printed
- **THEN** it shows a marked placeholder in place of the FPS id

#### Scenario: grade10-site-vault-loan-and-settlement-SC-47 - Production shows the counter line in place of the block
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower on a brand whose account is not set yet is still told where to pay

- **GIVEN** a production brand whose live loan was advanced while its FPS id
  and bank account were set, its FPS id since cleared
- **WHEN** the borrower reads that live loan
- **THEN** the read carries no payee, no FPS id, no bank account and no
  transfer reference

#### Scenario: grade10-site-vault-loan-and-settlement-SC-52 - A part payment at the counter is refused while nowhere to pay is set
**Serves:** grade10-site-vault-loan-and-settlement-US-02 - the borrower is never sent a balance with no way to pay it

- **GIVEN** that loan, its FPS id still cleared
- **WHEN** a repayment leaving anything owed is recorded at the counter
- **THEN** it is refused by name, naming the unset value
- **AND** nothing is written, and a repayment that settles the loan is still
  recorded

### Requirement: The console states the rule before the operator acts

An operator reads the bound, the precondition and what the recording fixes in
the dialog, before they send it.

| Dialog | States before the send |
| --- | --- |
| Make an offer | the latest valuation, the brand's loan-to-value cap and the amount asked for; the term presets; the interest, the total to repay, what a late day costs and the annualised rate the arithmetic derives, all from the terms entered; the date the offer runs out; each bound the offer must meet, met or unmet |
| Put the item in the vault | the two preconditions it needs: the signed packet executed and the identity bound; no visit slot, since a sibling case reaches the vault with no visit of its own |
| Record the payout | the two people it needs; the amount equal to the accepted principal; the value-date bounds; the due date and the reminder dates the value date fixes |

- **Derived live** — every figure SHALL re-derive as the operator changes
  what it depends on.
- **Unmet** — the dialog SHALL name which bound or precondition is unmet and
  what it requires, and SHALL leave the act's own control in place.
- **A bound the offer is refused without** (every one but grace, which unset
  reads as none) — outside production the dialog SHALL say the
  bound is not set and the act SHALL go through; in production the dialog
  SHALL name the refusal before the operator sends.
- **The worker still refuses** — what a dialog states SHALL stand in for no
  guard. Every refusal this capability names SHALL be raised again at the
  recording.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-40 - The offer dialog derives the figures from the terms entered
**Serves:** grade10-site-vault-loan-and-settlement-US-07 - the operator prices a loan knowing what it will cost the borrower

- **WHEN** an operator enters a principal of 10,000,000 HKD minor units at
  250 basis points for a 30-day term
- **THEN** the dialog states 250,000 HKD minor units of interest, 10,250,000
  HKD minor units to repay, 8,333 HKD minor units for a late day, and an
  annualised rate of 30.4%, alongside the valuation, the cap and the presets

#### Scenario: grade10-site-vault-loan-and-settlement-SC-41 - A bound the offer fails is named before the send
**Serves:** grade10-site-vault-loan-and-settlement-US-07 - the operator sees the cap before the worker teaches it

- **GIVEN** a valuation whose loan-to-value cap puts the principal at
  4,000,000 HKD minor units
- **WHEN** an operator enters a principal of 5,000,000 HKD minor units
- **THEN** the dialog names that bound as unmet and what it requires, and the
  control that makes the offer is still there

#### Scenario: grade10-site-vault-loan-and-settlement-SC-42 - The vault dialog names the precondition that is missing
**Serves:** grade10-site-vault-loan-and-settlement-US-07 - the operator at the counter learns what the vaulting still needs

- **GIVEN** a case whose signed packet is executed, with no identity bound
- **WHEN** an operator opens the dialog that puts the item in the vault
- **THEN** it names the executed packet as met and the identity as unmet,
  asks for no visit slot, and the control that confirms the vaulting is still
  there

#### Scenario: grade10-site-vault-loan-and-settlement-SC-43 - The payout dialog names the two people it needs
**Serves:** grade10-site-vault-loan-and-settlement-US-01 - the treasurer sees why they may not pay out their own offer

- **GIVEN** an operator who made the offer being paid out
- **WHEN** that operator opens the dialog that records the payout
- **THEN** it names the two-people rule as unmet and what it requires

#### Scenario: grade10-site-vault-loan-and-settlement-SC-44 - The due date and the reminder dates follow the value date
**Serves:** grade10-site-vault-loan-and-settlement-US-07 - the treasurer sees what the date they type fixes for the borrower

- **GIVEN** the payout dialog open on a 30-day term
- **WHEN** the operator changes the value date from 15 September to 16
  September
- **THEN** the due date it states moves from 15 October to 16 October and the
  reminder dates it states move with it

#### Scenario: grade10-site-vault-loan-and-settlement-SC-45 - A bound nobody has set refuses in production and passes outside it
**Serves:** grade10-site-vault-loan-and-settlement-US-07 - the operator on a shop that lends nothing yet reads why

- **GIVEN** a brand whose loan-to-value cap is unset
- **WHEN** an operator opens the dialog that makes an offer
- **THEN** outside production the dialog says the bound is not set and the
  offer goes through, and in production it names the refusal before the
  operator sends

#### Scenario: grade10-site-vault-loan-and-settlement-SC-46 - The recording refuses what the dialog let through
**Serves:** The rule before the act - an operator who sends past a dialog still meets the recording's own guard

- **GIVEN** a dialog that shows every bound as met
- **WHEN** the state it was drawn from has since moved and the recording is
  sent
- **THEN** the recording is refused by name
