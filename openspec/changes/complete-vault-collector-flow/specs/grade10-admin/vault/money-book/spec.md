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
