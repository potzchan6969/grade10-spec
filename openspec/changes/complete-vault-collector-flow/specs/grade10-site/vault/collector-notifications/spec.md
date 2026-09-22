# grade10-site/vault/collector-notifications Specification

## Feature set

- What is sent
  - One decision per event: every event either names a message or is decided
    silent, so nothing can ship unnoticed
  - Twenty-four messages: one per thing worth telling, the identity-check
    invitation among them, English, to the case's own address
  - The action link: every message opens the case at its own address
- Reminders
  - Before the due date: a week's warning and one the day before
  - While it is overdue: one every seventh day, naming the balance and that
    the same daily rate is running
  - Stopping at the notice: a written forfeiture notice says something
    stronger, so the ladder stops
- When a send fails
  - Owed, not lost: a failure is written down as still owed and never fails
    the thing it was about
  - One ladder: five attempts from five minutes to six hours, for every
    message the vault owes
  - Parked with a reason: the case is flagged for staff and an operator can
    hand every parked message back to the queue
  - A hanging send: an attempt gives up at ten seconds
- The signed set
  - Delivered once: a claim per packet, so two passes cannot mail one signer
    twice
  - Read again at each attempt: the documents come from the packet, never from
    the queue
  - What cannot be attached: the message still goes, with the link to the case
- The reader
  - Read at the attempt: the address, the item's title and the currency come
    from the case as it stands
  - Nobody to tell: a case with no address is counted rather than mailed
  - WhatsApp: a link staff press, with no automation and no inbound channel
- What a message carries
  - Figures as a table: a money message tables the amount, the dates and what a
    late day costs rather than writing them into a sentence
  - How to pay, in the message: a money message carries the block the live loan
    carries, so the borrower need not open the case to pay
  - The reminder schedule: when the borrower will hear from us next, and that a
    reminder costs nothing
  - The forfeiture notice: the clause it acts under, the date to pay by, what
    each further day adds, the condition the item lapses on, and that taking it
    is a person's decision
  - The case line and the footer: the reference and the item, the party the
    message is from under its registered name, the licence line and the
    complaints contact
  - A value nobody has set: bracketed outside production, and in production the
    act that would print one refuses before it commits, so nothing is written
    that cannot be sent
