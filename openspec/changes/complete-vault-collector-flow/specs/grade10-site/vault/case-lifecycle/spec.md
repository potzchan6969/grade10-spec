# grade10-site/vault/case-lifecycle Specification

## Purpose

The case machine: fourteen statuses, two lanes through them, the clocks that
end a case nobody came back to, the exits that are not a release, and the facts
a case is read as meeting without any of them becoming a status.

One case is one item and one collector. Which lane it walks was decided at
intake (`grade10-site/vault/case-intake`); what each move needs before it may
run is stated by the capability that owns the move — the visit
(`grade10-site/vault/visit-booking`), the offer
(`grade10-site/vault/valuation-and-offer`), the paper
(`grade10-site/vault/documents-and-signing`), the money
(`grade10-site/vault/loan-and-settlement`).

## Feature set

- The statuses
  - One status column: a case holds exactly one status, and it is the only
    thing a move writes
  - Two lanes, one machine: the financed lane adds the offer and the loan, and
    nothing else forks
  - What is not a status: a booking and an overdue loan are answers to
    questions, not states
- Moving a case
  - Guarded moves: a move runs only from the statuses it names, and a case
    that moved under the caller is refused by name
  - One history: every move and every plain record appends to the case's own
    history, in the move's own transaction
  - Actor on the record: each entry names who acted — the collector, a member
    of staff, or a sweep
  - Taken from the collector's own page: the moves that are theirs — calling
    the request off, and asking for the item back — run from the case, each
    behind a confirmation naming what it closes
- Clocks
  - Abandonment clocks: a case nobody came back to ends on its own clock and
    never on a missed visit
  - No clock on a settled loan: a repaid case waits for its owner, because
    storage is free
- The exits
  - Ends that are not a release: declined, cancelled, expired, forfeited
  - Cancel before custody: the case's owner may call it off until the item is
    in the vault
  - Nothing unwinds past a live advance: once money stands, the ways out are
    repayment and forfeiture
  - Two moves back: a corrected advance and a corrected repayment each put the
    case where the money leaves it
  - Read in the collector's words: an ended case says the reason staff gave,
    who called it off, which clock ran out, or the figure the item settled
    and the dates of the notice behind it
- Derived at the read
  - The fact the case meets: a lapsed, declined or superseded offer, a visit
    closed as missed and an ask for the item back, each with the one thing to
    do next
  - A lapsed offer reads as lapsed: the offer's own expiry decides it at the
    read, and the case stays where it was, open for another offer
  - Where the case stands: the stage on the lane the case walks, read from the
    status and never stored
  - Whose the item is: one word from the status, the offer and the due date
  - No status for any of it: nothing derived is written down, so a fact can
    never disagree with the case it was read from
