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
  - Each repayment, on the case: its value date, its method and what the
    balance was after it, so a borrower reads the month without adding it up
  - What is coming: the dates the reminders go, until a notice stops them
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
  - The notice, on the case: the day it was written, the date to pay by, and
    that nothing can be taken before that date
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

## ADDED Requirements

### Requirement: A live loan lists each repayment and what it left owing

The borrower reads the money already returned on their own case, without
adding a month of messages up.

- **Each repayment** — every repayment the case still counts SHALL be listed
  with its amount, its method, the day the money reached us, the day it was
  recorded, and what the loan owed after it.
- **The balance after** — SHALL be what the loan owed at that repayment's own
  value date, from the same derivation every other surface answers from.
- **Order** — value-date order, earliest first, whatever order the recordings
  were written in.
- **A record taken back** — a repayment a correction has taken back SHALL NOT
  be listed, and the balances beside the repayments still counted SHALL read
  as if it had never been recorded.
- **None yet** — a live loan carrying no repayment SHALL say that each one
  will appear there with the day it arrived and the balance after it.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-27 - A repayment reads with the day it arrived and what was left
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower opens the case to see what a payment did

- **GIVEN** a live loan of 10,000,000 HKD minor units of principal at 300
  basis points over a 30-day term, with 9,000,000 HKD minor units repaid by
  bank transfer on day 10
- **WHEN** the borrower reads the case
- **THEN** the repayment is listed as 9,000,000 HKD minor units by bank
  transfer, naming day 10 as the day it reached us and the day it was
  recorded, and 1,300,000 HKD minor units as what was owed after it

#### Scenario: grade10-site-vault-loan-and-settlement-SC-28 - A loan nobody has repaid says so
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower checks the case before their first payment

- **GIVEN** a live loan with no repayment recorded
- **WHEN** the borrower reads the case
- **THEN** it says each repayment will appear with the day it arrived and the
  balance after it, and lists none

#### Scenario: grade10-site-vault-loan-and-settlement-SC-29 - A repayment taken back leaves the list
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower reads the case after the bank sent a payment back

- **GIVEN** a live loan carrying two repayments, the earlier of which a
  correction has taken back
- **WHEN** the borrower reads the case
- **THEN** only the later repayment is listed, and the balance beside it is
  what would have been owed had the earlier one never been recorded

### Requirement: A live loan names the reminders still to come

The borrower reads which reminders are still ahead of them, and what ends
them.

- **The dates ahead** — a live loan SHALL name the day each remaining
  reminder goes, derived at the read from the due date and the schedule
  `grade10-site/vault/collector-notifications` sets.
- **Only ahead** — a reminder already sent SHALL NOT be named as coming.
- **A notice ends them** — once a forfeiture notice stands on the case, no
  reminder date SHALL be named and the case SHALL say no further reminder
  will be sent.
- **Past due** — while a loan is past due and no notice stands, the case
  SHALL name the reminders already sent with their days and the next weekly
  one by its date, and SHALL say a written notice naming a date to pay by may
  follow, promising no day for it.
- **A reminder costs nothing** — the case SHALL say a reminder adds nothing
  to what is owed.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-30 - Only the reminders still ahead are named
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower plans when to pay from what is still coming

- **GIVEN** a live loan whose first reminder has already been sent
- **WHEN** the borrower reads the case
- **THEN** the reminder already sent is not named as coming, the remaining
  reminders are named by their dates, and the case says a reminder adds
  nothing to what is owed

#### Scenario: grade10-site-vault-loan-and-settlement-SC-31 - A notice ends the reminder dates
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower who has had the final notice stops being promised more mail

- **GIVEN** a past-due loan carrying a forfeiture notice
- **WHEN** the borrower reads the case
- **THEN** no reminder date is named and the case says no further reminder
  will be sent

#### Scenario: grade10-site-vault-loan-and-settlement-SC-48 - Past due, the case names what comes next
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower past due reads what comes next

- **GIVEN** a past-due loan with two weekly reminders sent and no notice
  standing
- **WHEN** the borrower reads the case
- **THEN** both reminders sent are named with their days, the next weekly
  reminder is named by its date, and the case says a written notice naming a
  date to pay by may follow, naming no day for it

### Requirement: The forfeiture notice reads on the borrower's case

A borrower who has been sent the final notice reads it where they read the
loan, not only in their mail.

- **What it shows** — the day the notice was written, the date to pay by it
  named, that nothing can be taken before that date, and the reminders
  already sent.
- **The date shown** — SHALL be the date the notice named, never one
  recomputed from the brand's notice period as it now stands.
- **No notice** — a loan past its due date with no notice standing SHALL show
  none, and SHALL say nothing about a date to pay by.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-32 - The notice reads with its date to pay by
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower reads how long is left to pay

- **GIVEN** a past-due loan sent a notice on 1 November naming 15 November as
  the date to pay by
- **WHEN** the borrower reads the case
- **THEN** it names 1 November as the day the notice was written, 15 November
  as the date to pay by, and says nothing can be taken before that date

#### Scenario: grade10-site-vault-loan-and-settlement-SC-33 - A shortened notice period does not move the date shown
**Serves:** grade10-site-vault-loan-and-settlement-US-04 - the borrower is held to the date staff gave them, not a later rule

- **GIVEN** a notice naming a date to pay by, and a brand that afterwards
  shortens its notice period
- **WHEN** the borrower reads the case
- **THEN** the date shown is the one the notice named

#### Scenario: grade10-site-vault-loan-and-settlement-SC-34 - A past-due loan with no notice shows none
**Serves:** grade10-site-vault-loan-and-settlement-US-06 - the borrower running late has had no notice yet

- **GIVEN** a loan past its due date with no notice on the record
- **WHEN** the borrower reads the case
- **THEN** no notice and no date to pay by is shown

### Requirement: How to pay is one block wherever an amount owed is named

A borrower is told where to send the money in the same words on the page and
in every message about money.

| Field | Value |
| --- | --- |
| Payee | the lender's registered name already on file |
| FPS id | the lender's FPS id |
| Bank account | the lender's bank account, under that payee name |
| Transfer reference | the case reference, so a treasurer matches an arrived transfer to its case by what the borrower typed |
| At the counter | card or cash |

- **Where it appears** — under what is owed on a live loan, and in every
  message that names an amount owed or an amount received. A case with no
  live loan SHALL show no such block.
- **One set** — the page and every message SHALL name the same values, so no
  two can disagree.
- **The figure holds** — the block SHALL say the amount owed holds until the
  due instant, and what each further started day after it adds.
- **A value nobody has set** — outside production the block SHALL print a
  marked placeholder in place of the unset value. In production an unset FPS
  id or bank account SHALL NOT be printed: the block SHALL NOT be shown, and
  in its place the live loan SHALL show the counter line alone — pay by card
  or cash at the counter. The act that would send a
  message carrying an unset value is refused by
  `grade10-site/vault/collector-notifications`, which states that rule.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-35 - The block names the account and the case reference
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower pays at their own bank without asking the shop where

- **GIVEN** a live loan on a brand whose FPS id and bank account are set
- **WHEN** the borrower reads the case
- **THEN** the block names the lender's registered name as payee, its FPS id,
  its bank account, the case reference as the transfer reference, and card or
  cash at the counter
- **AND** it says the amount owed holds until the due instant and what each
  further started day after it adds

#### Scenario: grade10-site-vault-loan-and-settlement-SC-36 - A money message carries the same block
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower pays from the message without opening the site

- **GIVEN** the same live loan
- **WHEN** a message naming an amount owed or an amount received is sent
- **THEN** it carries the same values as the block on the case

#### Scenario: grade10-site-vault-loan-and-settlement-SC-37 - A case with no live loan names no account
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower whose item is only stored is not asked to pay

- **GIVEN** a storage case in the vault
- **WHEN** the collector reads the case
- **THEN** no block naming an account or a reference is shown

#### Scenario: grade10-site-vault-loan-and-settlement-SC-38 - An unset value prints bracketed outside production
**Serves:** How to pay - the shop reads a staging case before Finance has answered

- **GIVEN** a brand outside production whose FPS id is unset
- **WHEN** the block is printed
- **THEN** it shows a marked placeholder in place of the FPS id

#### Scenario: grade10-site-vault-loan-and-settlement-SC-47 - Production shows the counter line in place of the block
**Serves:** grade10-site-vault-loan-and-settlement-US-05 - the borrower on a brand whose account is not set yet is still told where to pay

- **GIVEN** a production brand whose live loan was advanced while its FPS id
  and bank account were set, both since cleared
- **WHEN** the borrower reads that live loan
- **THEN** no payee, no FPS id, no bank account and no transfer reference is
  shown, and the case shows the counter line alone — pay by card or cash at
  the counter

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
- **A bound nobody has set** — outside production the dialog SHALL say the
  bound is not set and the act SHALL go through; in production the dialog
  SHALL name the refusal before the operator sends.
- **The worker still refuses** — what a dialog states SHALL stand in for no
  guard. Every refusal this capability names SHALL be raised again at the
  recording.

#### Scenario: grade10-site-vault-loan-and-settlement-SC-40 - The offer dialog derives the figures from the terms entered
**Serves:** grade10-site-vault-loan-and-settlement-US-07 - the operator prices a loan knowing what it will cost the borrower

- **WHEN** an operator enters a principal of 10,000,000 HKD minor units at
  300 basis points for a 30-day term
- **THEN** the dialog states 300,000 HKD minor units of interest, 10,300,000
  HKD minor units to repay, 10,000 HKD minor units for a late day, and an
  annualised rate of 36.5%, alongside the valuation, the cap and the presets

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

## MODIFIED Requirements

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
| Annualised rate | the term's interest ÷ the principal × 365 ÷ the term's days, as a percentage rounded to one decimal place; the rate the loan agreement prints simple per annum, and the one figure every surface naming an annualised rate answers from |
| Settlement | the recording that leaves nothing owed at its own value date; interest stops there and never restarts |

Worked at a principal of 10,000,000 HKD minor units, 300 basis points for a
30-day term, no grace, advanced on 1 September and so due on 1 October:

- repaid on day 10 — 10,300,000 owed, the whole term's interest included
- repaid 10 days late — 10,400,000 owed, at 10,000 for each started day
- 9,000,000 repaid on day 10 and the rest 10 days late — 1,313,000 still owed
- annualised — 36.5%

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
