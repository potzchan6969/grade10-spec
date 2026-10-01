# grade10-admin/vault/money-book Specification

## Purpose

The three cross-case money reads an operator works from: the register of every
money record in a period, the position the loan book stands at, and the loans
in arrears — each summed where the list cannot be read without adding it up,
and the register taken out of the console as a file.

Every case screen answers one case; these answer the business. What a money
record means and how it is guarded is
`grade10-site/vault/loan-and-settlement`.

## Feature set

- The register
  - Every record in a period: advances, repayments and corrections, in one
    order
  - Ordered by provenance: what was written down between two instants, so a
    backdated value date moves no row somebody has already paged past
  - One answer: the page and the totals over the whole range are read together
  - A correction names its row: the reader nets a pair without a second query
  - Narrowed by kind: payouts, repayments or corrections beside the method,
    so one kind reads against one line of the statement
  - Net out of the business: payouts less repayments over the range, per
    currency, a correction netting the row it took back once
- The position
  - Folded from the same arithmetic: principal, interest and repayments across
    live and settled loans
  - One unit: a book holding a second currency is refused by name rather than
    summed
- The arrears
  - Longest overdue first: judged on the due date the advance fixed
  - Its own cursor: paged over the due date and the case, so nothing is hidden
    behind a page
  - Summed above the list: what is outstanding across the arrears and how
    many carry no notice, so the list is not added up by hand
  - Rows that can be chased: the borrower, how to reach them, the notice and
    the last reminder sent
- Who reads what
  - The book is the firm's: the register and the position sit behind the money
    grant
  - One case's balance is the counter's: what a case owes, and a quote for a
    date, stay on the read grant
- The export
  - The range as filtered: the file answers what the reader is looking at and
    nothing wider
  - Bounded: no more rows than the list itself pages
  - Recorded like a search: who asked, when, the filter and how many rows —
    never the rows themselves

## Requirements

### Requirement: The register lists every money record in a period

An operator holding the vault payout grant SHALL be able to read every
advance, repayment and correction in a period, narrowable to one case, to one
kind of record and to one repayment method, each row carrying:

| Field | What it says |
| --- | --- |
| Kind | advance, repayment or correction |
| Case | the case it belongs to |
| Amount and currency | integer minor units, in the case's own currency |
| Method | how a repayment reached us; none on an advance or a correction |
| Bank reference | where one was given, shown to staff only |
| Recorded by, recorded at | who wrote it down and when |
| Value date | the day the money moved; an advance and a repayment always state one, a correction none |
| Takes back | the kind and record a correction reverses; none otherwise |

Rows SHALL be ordered by when they were recorded, not by their value date, so
that a row already paged past cannot move.

Narrowing to a kind SHALL answer advances, repayments or corrections alone, and
SHALL be applied together with the case and the method narrowings, so a register
narrowed to repayments by transfer answers no advance and no repayment taken in
cash.

Narrowing to a repayment method SHALL narrow to repayments, because an advance
and a correction have no method to be one of.

A range as narrowed in which nothing was recorded SHALL answer no rows and SHALL
say that nothing remains behind them.

<!-- trace:scenario id=g10adm.vault-money-book.SC-wbb rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-01 - The register is ordered by when it was written
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **GIVEN** a repayment recorded today against a value date last week
- **WHEN** the register for today is read
- **THEN** the row is in it, at today's position

<!-- trace:scenario id=g10adm.vault-money-book.SC-n97 rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-02 - A correction names the record it takes back
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **WHEN** a correction is read in the register
- **THEN** it names the kind and the record it reverses

#### Scenario: grade10-admin-vault-money-book-SC-25 - One kind is read against one line of the statement
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** a range holding advances, repayments and corrections
- **WHEN** the register is narrowed to advances
- **THEN** every row is an advance, and no repayment and no correction is listed

#### Scenario: grade10-admin-vault-money-book-SC-26 - The kind and the method narrow together
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** a range holding repayments by transfer, repayments in cash and
  advances
- **WHEN** the register is narrowed to repayments and to transfer
- **THEN** every row is a repayment taken by transfer

#### Scenario: grade10-admin-vault-money-book-SC-27 - A range with nothing recorded in it says so
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **GIVEN** a range in which nothing was recorded
- **WHEN** the register is read
- **THEN** no row is listed and nothing remains behind them

### Requirement: The register pages on a cursor, and its totals answer the whole range

The register SHALL page on a cursor over what the page stopped reading, and
SHALL say whether more remain.

Its totals SHALL be given per kind, per method, per the kind a correction
reverses, and per currency, over the whole range and never over the page, so
that a total does not change as somebody pages. Each total SHALL carry the
currency it is in and SHALL be shown in that unit; no total SHALL be a bare
number.

The page and the totals SHALL be read as one answer, so a record landing
between them cannot put the totals outside the range they claim.

<!-- trace:scenario id=g10adm.vault-money-book.SC-l0b rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-03 - Totals do not move as the reader pages
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **GIVEN** a range of three pages of records
- **WHEN** each page is read in turn
- **THEN** every page reports the same totals for the range

<!-- trace:scenario id=g10adm.vault-money-book.SC-2gi rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-04 - A book in two currencies totals in each
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **GIVEN** records in two currencies inside one range
- **WHEN** the register is read
- **THEN** each currency has its own totals, each shown in its own unit

### Requirement: The position is folded from the same arithmetic every screen reads

The position SHALL answer, at an instant — now unless a past one is named, and
never a future one: how many loans were on the book, and their principal,
interest, total, repaid and outstanding, together with how many were overdue
and by how much.

A loan SHALL be on the book from its advance's value date until the item left
custody, released or forfeited, judged at the instant asked about and not by
the status the case holds when the question is asked.

It SHALL be derived from the same arithmetic a case screen answers with, so no
two surfaces can disagree, and it SHALL be stored nowhere.

It SHALL state one currency. Where the book holds loans in more than one, it
SHALL be refused by name rather than summed.

<!-- trace:scenario id=g10adm.vault-money-book.SC-eog rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-05 - The position agrees with the case screens
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** three live loans
- **WHEN** the position is read
- **THEN** its outstanding is the sum of what each case's own screen says it owes at that instant

<!-- trace:scenario id=g10adm.vault-money-book.SC-7yp rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-06 - A second currency is refused, not summed
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** live loans in two currencies
- **WHEN** the position is read
- **THEN** it is refused by name

<!-- trace:scenario id=g10adm.vault-money-book.SC-cd9 rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-11 - A past instant replays the book as it stood
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** a loan advanced in June, settled in July and its item released in August
- **WHEN** the position is read as at the end of June, as at the end of July, and now
- **THEN** June carries the loan with its whole term outstanding, July carries it settled, and now carries no such loan
- **AND** a position as at a future instant is refused

### Requirement: The arrears list every live loan past its due date

An operator holding the vault read grant SHALL be able to read every live loan
past its due date, longest overdue first, each row carrying:

| Field | What it says |
| --- | --- |
| Case | the case, by the reference a person can read out |
| Item | what is held against the loan |
| Borrower | who owes it, named by the case reference and the contact the case holds; the vault copies no name |
| How to reach them | the phone number and the email address the case holds |
| Due date | the day the advance fixed |
| Days overdue | how far past that day the loan has run |
| Outstanding | integer minor units, in the loan's own currency |
| Notice | the day the forfeiture notice was sent and the day it gives to pay by; none where none has been sent |
| Last reminder | the day the last reminder was sent; none where none has been sent |

A book holding two currencies SHALL print each row in its own unit.

The list SHALL be judged on the due date the advance fixed, and SHALL page on
a cursor over that due date and the case, so that no loan can hide behind a
page boundary. Whether more remain SHALL be read rather than inferred from the
page being full.

The arrears SHALL be their own read: a page limit shared with any other
worklist SHALL never let one hide the other.

<!-- trace:scenario id=g10adm.vault-money-book.SC-2p3 rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-07 - The arrears resume after the row the last page stopped at
**Serves:** grade10-admin-vault-money-book-US-03 - Operator works the loans that are running late

- **GIVEN** three loans in arrears and a page size of two
- **WHEN** the second page is read
- **THEN** it begins after the row the first stopped at, and says there is nothing behind it

<!-- trace:scenario id=g10adm.vault-money-book.SC-shu rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-08 - A corrected advance leaves the arrears
**Serves:** grade10-admin-vault-money-book-US-03 - Operator works the loans that are running late

- **GIVEN** a loan in arrears whose advance is taken back
- **WHEN** the arrears are read
- **THEN** the case is not in them

<!-- trace:scenario id=g10adm.vault-money-book.SC-k1b rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-12 - A two-currency book prints each row in its own currency
**Serves:** The arrears - a two-currency book prints each row in its own currency

- **GIVEN** loans in arrears in two different currencies
- **WHEN** the arrears are read
- **THEN** each row carries its own currency, and no row is read in the book's default currency

#### Scenario: grade10-admin-vault-money-book-SC-28 - A row carries what it takes to chase the borrower
**Serves:** grade10-admin-vault-money-book-US-05 - shop staff pick who to chase first before working the list

- **GIVEN** a loan in arrears whose borrower has been reminded twice and sent a
  forfeiture notice
- **WHEN** the arrears are read
- **THEN** its row names the case reference, the item and the contact — the
  phone number and the email address the case holds — the day the notice was
  sent with the day it gives to pay by, and the day the last reminder was sent,
  and no name

#### Scenario: grade10-admin-vault-money-book-SC-29 - The loan behind longest is read first
**Serves:** grade10-admin-vault-money-book-US-03 - shop staff open the list and chase the borrower who has run latest

- **GIVEN** live loans past their due date by different numbers of days
- **WHEN** the arrears are read
- **THEN** they are ordered longest overdue first, judged on the due date the
  advance fixed

#### Scenario: grade10-admin-vault-money-book-SC-30 - Two loans due the same day both survive the page boundary
**Serves:** grade10-admin-vault-money-book-US-03 - shop staff page to the end of the list without losing a borrower

- **GIVEN** more live loans past their due date than one page holds, two of them
  sharing a due date
- **WHEN** every page is read in turn
- **THEN** each loan is listed exactly once, and neither of the two sharing a due
  date is skipped or repeated

#### Scenario: grade10-admin-vault-money-book-SC-31 - Without a vault grant the arrears are refused
**Serves:** grade10-admin-vault-money-book-US-03 - shop staff reach the list on the grant the counter already holds

- **GIVEN** an operator holding no vault grant
- **WHEN** they ask for the arrears
- **THEN** it is refused by name, and no row and no figure is given

### Requirement: The book sits behind the money grant, and one case's balance does not

The register and the position SHALL require the vault payout grant, because a
ledger and a position across every case are the firm's accounts.

What one case owes, the quote for a date, its own money records and the
arrears SHALL sit on the vault read grant, because they are what the counter
needs in front of a customer.

Staff and treasurer SHALL share no money grant; an admin SHALL hold both.

<!-- trace:scenario id=g10adm.vault-money-book.SC-h9j rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-09 - A staff operator reads the case but not the book
**Serves:** grade10-admin-vault-money-book-US-03 - Operator works the loans that are running late

- **GIVEN** an operator holding the staff grants
- **WHEN** they open a case and then the register
- **THEN** the case's balance is shown and the register is refused by name

<!-- trace:scenario id=g10adm.vault-money-book.SC-yco rev=1 -->
#### Scenario: grade10-admin-vault-money-book-SC-10 - A treasurer reads the book
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** an operator holding the vault payout grant
- **WHEN** they read the register and the position
- **THEN** both answer

### Requirement: The register answers what the range took out of the business

One figure over the range the reader is looking at, so a controller reads what
the vault paid out net of what came back without adding the register up.

**The fold** - the register SHALL answer, over the whole range and never over
the page, total advances less total repayments, positive when money is out of
the business.

**A correction** - a correction SHALL net the record it takes back once and no
more, so a range holding an advance and the correction that reverses it answers
nothing out.

**One unit each** - the figure SHALL be given per currency, each in its own
unit, and SHALL never be summed across currencies.

**What it answers over** - the figure SHALL answer the range as narrowed, so a
register narrowed to one case answers that case alone.

#### Scenario: grade10-admin-vault-money-book-SC-13 - What the range took out is advances less repayments
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** a range holding advances of 500000 HKD minor units and repayments
  of 200000 HKD minor units
- **WHEN** the register is read
- **THEN** it answers 300000 HKD minor units out of the business

#### Scenario: grade10-admin-vault-money-book-SC-14 - A corrected advance nets to nothing
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** a range holding an advance of 500000 HKD minor units and the
  correction that takes it back
- **WHEN** the register is read
- **THEN** it answers 0 HKD minor units out of the business

#### Scenario: grade10-admin-vault-money-book-SC-15 - Two currencies answer one figure each
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** a range holding records in two currencies
- **WHEN** the register is read
- **THEN** each currency answers its own figure in its own unit, and no figure
  covers both

### Requirement: The arrears are summed above the list

The numbers the list cannot answer without being added up by hand, read above
the rows the operator is about to work.

**The figures** - the arrears SHALL be read with what is outstanding across the
loans in arrears and how many of them carry no forfeiture notice, beside the
count of the Overdue cut, which `grade10-admin/vault/operator-queue` states.

**One instant** - the two sums and the Overdue cut's count SHALL be answered
from one read over the same loans the list holds, so a figure and the rows
below it cannot disagree.

**One unit each** - what is outstanding SHALL be given per currency, each in its
own unit, and SHALL never be summed across currencies.

**Nothing late** - where no live loan is past its due date, the two sums and the
count SHALL read zero and the list SHALL hold no row.

**Who reads them** - the figures SHALL sit on the vault read grant, with the
list they sum.

#### Scenario: grade10-admin-vault-money-book-SC-16 - The arrears are counted, summed and counted again for the notice
**Serves:** grade10-admin-vault-money-book-US-05 - shop staff pick who to chase first before working the list

- **GIVEN** four live loans past their due date, one of which carries a
  forfeiture notice
- **WHEN** the arrears are read
- **THEN** they are read with four loans in arrears, the outstanding summed
  across the four, and three carrying no notice

#### Scenario: grade10-admin-vault-money-book-SC-17 - What is outstanding is summed in each currency
**Serves:** grade10-admin-vault-money-book-US-05 - shop staff pick who to chase first before working the list

- **GIVEN** loans in arrears in two currencies
- **WHEN** the arrears are read
- **THEN** what is outstanding is given per currency, each in its own unit, and
  no figure covers both

#### Scenario: grade10-admin-vault-money-book-SC-18 - Nothing late reads zero
**Serves:** grade10-admin-vault-money-book-US-03 - shop staff open the list on a day when nobody is behind

- **GIVEN** no live loan past its due date
- **WHEN** the arrears are read
- **THEN** the loans in arrears, what is outstanding and how many carry no
  notice all read zero, and no row is listed

### Requirement: The register is taken out of the console as a file

The range a controller is looking at, served as a file they can open beside the
bank statement.

**Who** - an operator holding the vault payout grant SHALL be able to take the
register out as a file, and an operator without it SHALL be refused by name.

**What it holds** - the file SHALL hold the register as narrowed - the same
range, case, kind and repayment method the reader is looking at - each record
carrying the fields the register's rows carry, with every amount as integer
minor units beside its ISO 4217 currency, and no record outside that narrowing.

**Bounded** - the file SHALL hold no more records than one page of the register
itself, and a request for more SHALL be refused by name.

**Nothing to take** - where the range as narrowed holds no record, no file SHALL
be offered.

**Recorded** - every file served SHALL append one record to the audit chain
naming who asked for it, when, the narrowing they asked under, and how many
records were served, and SHALL never write the records themselves.

#### Scenario: grade10-admin-vault-money-book-SC-20 - The file answers the range as narrowed
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** a register narrowed to repayments in a range
- **WHEN** the controller takes it out as a file
- **THEN** the file holds those repayments and no advance and no correction

#### Scenario: grade10-admin-vault-money-book-SC-21 - The file stops where the register's page stops
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **WHEN** more records are asked for in one file than the register pages in one
  read
- **THEN** it is refused by name and no file is served

#### Scenario: grade10-admin-vault-money-book-SC-22 - A range holding nothing offers no file
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** a range as narrowed holding no record
- **WHEN** the register is read
- **THEN** no file is offered

#### Scenario: grade10-admin-vault-money-book-SC-23 - Taking the range out is written down like a search
**Serves:** The export - whoever reviews the audit chain later reads who took the firm's money records out and under what narrowing

- **WHEN** a file of the register is served
- **THEN** one audit record names who asked, when, the narrowing and how many
  records were served, and holds none of the records

#### Scenario: grade10-admin-vault-money-book-SC-24 - Staff cannot take the register out
**Serves:** grade10-admin-vault-money-book-US-04 - the controller reads the period against the statement before taking it out of the console

- **GIVEN** an operator holding the vault read grant and not the vault payout
  grant
- **WHEN** they ask for the register as a file
- **THEN** it is refused by name and no file is served
