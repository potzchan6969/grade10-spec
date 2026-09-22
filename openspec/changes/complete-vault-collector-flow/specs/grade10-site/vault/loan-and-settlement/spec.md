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
