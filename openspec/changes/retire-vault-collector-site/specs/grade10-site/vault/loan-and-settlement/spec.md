# grade10-site/vault/loan-and-settlement Specification

## Feature set

- What is owed
  - Each repayment, on the case: the borrower's read of their live loan carries
    its value date, its method and what the balance was after it
  - What is coming: the borrower's read carries the dates the reminders go,
    until a notice stops them
- Ending the loan
  - The notice, on the case: the borrower's read carries the day it was
    written, the date to pay by, and that nothing can be taken before that date
- How to pay

## MODIFIED Requirements

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
