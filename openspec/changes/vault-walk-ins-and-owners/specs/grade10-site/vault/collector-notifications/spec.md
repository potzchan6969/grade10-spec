# grade10-site/vault/collector-notifications Specification

## Feature set

- What is sent
  - One decision per event: every event either names a message or is decided
    silent, so nothing can ship unnoticed
  - The action link: every message opens the case at its own address
  - Silence on a draft staff opened: its expiry and its cancel send nothing
  - Twenty-four messages: one per thing worth telling, the identity-check
    invitation among them, English, to the case's own address
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
    message is from under its registered name, the lender's licence line on a
    money message, and the complaints contact
  - A value nobody has set: bracketed outside production, and in production the
    act that would print one refuses before it commits, so nothing is written
    that cannot be sent

## MODIFIED Requirements

### Requirement: Every event decides its message, or decides silence

Every kind of thing that can happen to a case SHALL be mapped to the message
it sends the collector, or to silence. The map SHALL be exhaustive: a new kind
of event SHALL NOT be shippable until somebody has decided which of the two it
is.

What a collector hears SHALL be a property of what happened, not of who did
it, so the same event tells the same message whether the collector, the
counter or a sweep caused it.

Where one event has several true meanings, the act that writes it SHALL name
the message: a request that ran out untouched, one that ran out unbooked, and
one closed after a missed visit are three messages, not one.

A draft staff opened at the counter SHALL end in silence: its expiry and its
cancel, whoever cancels it, SHALL send nothing and owe nothing, because its
address was typed at the counter and nobody has shown it is theirs.

<!-- trace:scenario id=g10.vault-collector-notifications.SC-fp2 rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-01 - Every event is decided
**Serves:** grade10-site-vault-collector-notifications-US-02 - Collector hears about everything that happens to their case

- **WHEN** the map from events to messages is read
- **THEN** every kind of event names a message or names silence, and none is unanswered

<!-- trace:scenario id=g10.vault-collector-notifications.SC-03a rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-02 - Three endings, three messages
**Serves:** grade10-site-vault-collector-notifications-US-02 - Collector hears about everything that happens to their case

- **GIVEN** three cases ended by an untouched draft, by nobody booking, and by a missed visit
- **THEN** each collector is told the true one of the three, not one shared wording

#### Scenario: grade10-site-vault-collector-notifications-SC-35 - An unsent walk-in that runs out tells nobody
**Serves:** What is sent - the sweep ending a draft staff opened that nobody sent

- **GIVEN** a draft staff opened at the counter and untouched for 8 days
- **WHEN** the clocks end it
- **THEN** no message is sent about it and none is owed

#### Scenario: grade10-site-vault-collector-notifications-SC-36 - A cancelled walk-in tells nobody
**Serves:** grade10-site/vault/case-lifecycle#grade10-site-vault-case-lifecycle-US-06 - the operator cancels a draft opened under the wrong address

- **GIVEN** a draft staff opened at the counter
- **WHEN** staff cancel it, or the collector cancels it
- **THEN** no message is sent about it and none is owed
