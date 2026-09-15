# grade10-admin/vault/money-book Specification

## Purpose

The three cross-case money reads an operator works from: the register of every
money record in a period, the position the loan book stands at, and the loans
in arrears.

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
- The position
  - Folded from the same arithmetic: principal, interest and repayments across
    live and settled loans
  - One unit: a book holding a second currency is refused by name rather than
    summed
- The arrears
  - Longest overdue first: judged on the due date the advance fixed
  - Its own cursor: paged over the due date and the case, so nothing is hidden
    behind a page
- Who reads what
  - The book is the firm's: the register and the position sit behind the money
    grant
  - One case's balance is the counter's: what a case owes, and a quote for a
    date, stay on the read grant

## Requirements

### Requirement: The register lists every money record in a period

An operator holding the vault payout grant SHALL be able to read every
advance, repayment and correction in a period, narrowable to one case and to
one repayment method, each row carrying:

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

Narrowing to a repayment method SHALL narrow to repayments, because an advance
and a correction have no method to be one of.

#### Scenario: grade10-admin-vault-money-book-SC-01 - The register is ordered by when it was written
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **GIVEN** a repayment recorded today against a value date last week
- **WHEN** the register for today is read
- **THEN** the row is in it, at today's position

#### Scenario: grade10-admin-vault-money-book-SC-02 - A correction names the record it takes back
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **WHEN** a correction is read in the register
- **THEN** it names the kind and the record it reverses

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

#### Scenario: grade10-admin-vault-money-book-SC-03 - Totals do not move as the reader pages
**Serves:** grade10-admin-vault-money-book-US-01 - Controller ties a month's money to the bank statement

- **GIVEN** a range of three pages of records
- **WHEN** each page is read in turn
- **THEN** every page reports the same totals for the range

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

#### Scenario: grade10-admin-vault-money-book-SC-05 - The position agrees with the case screens
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** three live loans
- **WHEN** the position is read
- **THEN** its outstanding is the sum of what each case's own screen says it owes at that instant

#### Scenario: grade10-admin-vault-money-book-SC-06 - A second currency is refused, not summed
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** live loans in two currencies
- **WHEN** the position is read
- **THEN** it is refused by name

#### Scenario: grade10-admin-vault-money-book-SC-11 - A past instant replays the book as it stood
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** a loan advanced in June, settled in July and its item released in August
- **WHEN** the position is read as at the end of June, as at the end of July, and now
- **THEN** June carries the loan with its whole term outstanding, July carries it settled, and now carries no such loan
- **AND** a position as at a future instant is refused

### Requirement: The arrears list every live loan past its due date

An operator holding the vault read grant SHALL be able to read every live loan
past its due date, longest overdue first, each row carrying the due date, the
days overdue, what is outstanding, and the currency it is outstanding in, so
that a book holding two currencies prints each row in its own unit.

The list SHALL be judged on the due date the advance fixed, and SHALL page on
a cursor over that due date and the case, so that no loan can hide behind a
page boundary. Whether more remain SHALL be read rather than inferred from the
page being full.

The arrears SHALL be their own read: a page limit shared with any other
worklist SHALL never let one hide the other.

#### Scenario: grade10-admin-vault-money-book-SC-07 - The arrears resume after the row the last page stopped at
**Serves:** grade10-admin-vault-money-book-US-03 - Operator works the loans that are running late

- **GIVEN** three loans in arrears and a page size of two
- **WHEN** the second page is read
- **THEN** it begins after the row the first stopped at, and says there is nothing behind it

#### Scenario: grade10-admin-vault-money-book-SC-08 - A corrected advance leaves the arrears
**Serves:** grade10-admin-vault-money-book-US-03 - Operator works the loans that are running late

- **GIVEN** a loan in arrears whose advance is taken back
- **WHEN** the arrears are read
- **THEN** the case is not in them

#### Scenario: grade10-admin-vault-money-book-SC-12 - A two-currency book prints each row in its own currency

- **GIVEN** loans in arrears in two different currencies
- **WHEN** the arrears are read
- **THEN** each row carries its own currency, and no row is read in the book's default currency

### Requirement: The book sits behind the money grant, and one case's balance does not

The register and the position SHALL require the vault payout grant, because a
ledger and a position across every case are the firm's accounts.

What one case owes, the quote for a date, its own money records and the
arrears SHALL sit on the vault read grant, because they are what the counter
needs in front of a customer.

Staff and treasurer SHALL share no money grant; an admin SHALL hold both.

#### Scenario: grade10-admin-vault-money-book-SC-09 - A staff operator reads the case but not the book
**Serves:** grade10-admin-vault-money-book-US-03 - Operator works the loans that are running late

- **GIVEN** an operator holding the staff grants
- **WHEN** they open a case and then the register
- **THEN** the case's balance is shown and the register is refused by name

#### Scenario: grade10-admin-vault-money-book-SC-10 - A treasurer reads the book
**Serves:** grade10-admin-vault-money-book-US-02 - Treasurer reads what the loan book stands at

- **GIVEN** an operator holding the vault payout grant
- **WHEN** they read the register and the position
- **THEN** both answer
