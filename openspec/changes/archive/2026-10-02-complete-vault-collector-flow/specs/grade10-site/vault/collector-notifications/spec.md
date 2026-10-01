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
    message is from under its registered name, the lender's licence line on a
    money message, and the complaints contact
  - A value nobody has set: bracketed outside production, and in production the
    act that would print one refuses before it commits, so nothing is written
    that cannot be sent

## RENAMED Requirements

- FROM: `### Requirement: The vault sends twenty-three messages, each about the case it names`
- TO: `### Requirement: The vault sends twenty-four messages, each about the case it names`

### Requirement: The vault sends twenty-four messages, each about the case it names

The messages SHALL be exactly these twenty-four, in English, addressed to the
case's own address, each carrying an action link to the case — except the
invitation to verify, whose link opens the identity check:

| Group | Messages |
| --- | --- |
| The visit | booked, moved, cancelled, missed |
| The offer | made, expired |
| Custody | item vaulted, item released, item forfeited |
| The loan | advance recorded with its due date, repayment recorded, advance corrected, repayment corrected, loan repaid |
| Falling due | due soon, overdue, forfeiture notice with its cure date |
| The end of a case | declined, cancelled, request untouched, request unbooked, request closed after a missed visit |
| The paper | the signed documents, attached |
| The identity check | the invitation to verify before the visit |

<!-- trace:scenario id=g10.vault-collector-notifications.SC-nte rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-03 - The advance names the due date
**Serves:** grade10-site-vault-collector-notifications-US-02 - Collector hears about everything that happens to their case

- **WHEN** an advance is recorded
- **THEN** the collector is sent a message naming the amount and the calendar date the loan is repayable by

<!-- trace:scenario id=g10.vault-collector-notifications.SC-2ff rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-04 - A correction reaches the borrower
**Serves:** grade10-site-vault-collector-notifications-US-02 - Collector hears about everything that happens to their case

- **WHEN** a money record is taken back
- **THEN** the collector is told, with the amount and what the case now stands at, and never with who recorded it

#### Scenario: grade10-site-vault-collector-notifications-SC-20 - The invitation is one of the set
**Serves:** grade10-site-vault-collector-notifications-US-06 - the collector verifying at home before the visit they booked

- **GIVEN** a case with a visit booked and no identity to reuse
- **WHEN** its collector is invited to verify
- **THEN** the invitation is one of the twenty-four messages this table names, sent to the case's own address like any other

#### Scenario: grade10-site-vault-collector-notifications-SC-34 - The link opens the case the message is about
**Serves:** grade10-site-vault-collector-notifications-US-02 - the collector going straight from the message to the case rather than asking the shop

- **WHEN** a collector opens the action link on any message but the invitation to verify
- **THEN** the case the message is about opens at its own address

## ADDED Requirements

### Requirement: Every message carries the case line and the sender's footer

Every message ends the same way, whatever it is about.

- **The case line** — every message SHALL carry the case's reference and the item's title, directly above the footer.
- **The footer** — every message SHALL name the party it is from under that party's registered name, with the complaints contact; the lender's footer SHALL carry its licence line, and the custodian's none.
- **Which party** — a message naming an amount of money SHALL name the lender, and every other message SHALL name the custodian.

#### Scenario: grade10-site-vault-collector-notifications-SC-21 - The case line carries the reference
**Serves:** `grade10-site/vault/case-intake#grade10-site-vault-case-intake-US-05`, `grade10-site-vault-collector-notifications-US-05` - the collector reading their own reference off a message to type at the bank

- **WHEN** any message is sent about a case
- **THEN** it carries that case's reference and the item's title directly above the footer

#### Scenario: grade10-site-vault-collector-notifications-SC-22 - A message with no money names the custodian
**Serves:** grade10-site-vault-collector-notifications-US-02 - the collector hearing that their item is now in the vault

- **WHEN** the item-vaulted message is sent
- **THEN** its footer names the custodian under its registered name, with the complaints contact, and names neither the lender nor a licence line

### Requirement: A money message tables its figures and carries how to pay

A message that names money states its figures where a reader can find them, and
says where the money goes.

- **The figures** — every money message SHALL state its figures as a table of label and value, and SHALL NOT leave a figure readable only inside a sentence.
- **What each one tables** — the rows SHALL be these:

| Message | Rows |
| --- | --- |
| The offer | the loan, the term, the interest for the term, the total to repay, what a late day costs, and the day the offer is open until |
| The advance | the amount sent, the due date, the total to repay, and what each day after the due date adds |
| Due soon | what is owed at that reading, the due date, and what each day from the day after the due date adds |
| Overdue | what is owed at that reading, the date it was due, how much of that is late interest, and what each further day adds |
| A repayment recorded, a record taken back, a loan repaid, an item forfeited | the figures that event names, and what the case owes after it |

- **How to pay** — a money message sent while a balance is still owed SHALL carry the same how-to-pay block the live loan shows, which `grade10-site/vault/loan-and-settlement` defines, so a borrower can pay without opening the case. A money message naming no balance owed SHALL carry none: the offer, because nothing has been advanced yet, and a loan repaid or an item forfeited, because the case owes nothing after it.
- **The currency** — every amount SHALL be stated in the case's own currency.

#### Scenario: grade10-site-vault-collector-notifications-SC-23 - The offer's message tables its terms
**Serves:** grade10-site-vault-collector-notifications-US-05 - the collector answering an offer from the message itself

- **GIVEN** an offer of 4,000,000 HKD minor units over 90 days
- **WHEN** the offer message is sent
- **THEN** it tables the loan, the term, the interest for the term, the total to repay, what a late day costs and the day the offer is open until
- **AND** no one of those figures is readable only inside a sentence

#### Scenario: grade10-site-vault-collector-notifications-SC-24 - The advance's message says where to send the money
**Serves:** grade10-site-vault-collector-notifications-US-05 - the borrower acting on the advance's message without opening the page

- **WHEN** an advance of 3,900,000 HKD minor units is recorded
- **THEN** its message tables the amount sent, the due date, the total to repay and what each day after the due date adds
- **AND** carries the same how-to-pay block the live loan shows

#### Scenario: grade10-site-vault-collector-notifications-SC-25 - The due-soon reminder tables what is owed
**Serves:** grade10-site-vault-collector-notifications-US-01 - the borrower reading what they owe before the due date

- **GIVEN** a live loan due in 7 days
- **WHEN** the due-soon reminder is sent
- **THEN** it tables what is owed at that reading, the due date and what each day from the day after the due date adds, with how to pay under them

#### Scenario: grade10-site-vault-collector-notifications-SC-26 - The overdue reminder separates the late interest
**Serves:** grade10-site-vault-collector-notifications-US-01 - the borrower reading what a late week has cost

- **GIVEN** a loan 14 days past its due date
- **WHEN** the overdue reminder is sent
- **THEN** it tables what is owed at that reading, the date it was due, how much of that is late interest and what each further day adds

#### Scenario: grade10-site-vault-collector-notifications-SC-27 - A recorded repayment says what is left
**Serves:** grade10-site/vault/loan-and-settlement#grade10-site-vault-loan-and-settlement-US-05 - the borrower who paid at their own bank checking the money arrived

- **WHEN** a repayment is recorded
- **THEN** its message tables the amount recorded and what the case owes after it
- **AND** carries how to pay while anything is still outstanding

### Requirement: A message naming a due date says when the borrower will hear next

A borrower told a date is told at the same time when the vault will write again.

- **The schedule** — the advance's message and every reminder SHALL name the dates the borrower will next hear from the vault, as the reminder schedule fixes them.
- **What it costs** — the schedule SHALL say that a reminder adds nothing to what is owed.
- **Once a notice stands** — a message sent after a forfeiture notice SHALL say that no further reminder follows rather than name a next date.

#### Scenario: grade10-site-vault-collector-notifications-SC-28 - The advance names the reminder dates
**Serves:** grade10-site-vault-collector-notifications-US-01 - the borrower knowing when the warnings will come before the loan falls due

- **WHEN** an advance is recorded
- **THEN** its message names the dates the borrower will next hear from the vault and says that a reminder adds nothing to what is owed

### Requirement: The forfeiture notice states what it acts under and what follows it

The written notice is evidence, so it carries more than a reminder does.

- **The clause** — the notice SHALL open by naming the clause of the loan agreement it acts under.
- **The figures** — the notice SHALL table the date to pay in full by, what is owed as at that reading, what each further day adds, the condition on which the item lapses, and what follows a balance left unpaid.
- **A person decides** — the notice SHALL say that taking the item is a person's decision and never an automatic one.
- **The last of them** — the notice SHALL say that no further reminder follows it.
- **How to pay** — the notice SHALL carry the how-to-pay block like any other money message.

#### Scenario: grade10-site-vault-collector-notifications-SC-29 - The notice names its clause and the date to pay by
**Serves:** grade10-site-vault-collector-notifications-US-05 - the borrower reading the notice as the record it is

- **WHEN** a forfeiture notice is sent
- **THEN** it opens on the clause of the loan agreement it acts under
- **AND** tables the date to pay in full by, what is owed as at that reading, what each further day adds and the condition on which the item lapses

#### Scenario: grade10-site-vault-collector-notifications-SC-30 - The notice says a person decides and nothing more will be sent
**Serves:** grade10-site-vault-collector-notifications-US-01 - the borrower learning the weekly warnings have stopped and why

- **WHEN** a forfeiture notice is sent
- **THEN** it says that taking the item is a person's decision, and that no further reminder follows it

### Requirement: The invitation to verify names the visit it prepares for

The one message the vault sends a collector who has no identity on file yet.

- **The facts** — the invitation SHALL table the visit's date and time, the shop it is at, and what to bring.
- **Where its link goes** — its action link SHALL open the identity check rather than the case.
- **The other ways** — the invitation SHALL say that the check can be done at the counter instead, and that a collector already verified need do nothing.

#### Scenario: grade10-site-vault-collector-notifications-SC-31 - The invitation names the visit and opens the check
**Serves:** grade10-site-vault-collector-notifications-US-06 - the collector verifying at home and turning up prepared

- **GIVEN** a case with a visit booked and no identity on file
- **WHEN** its collector is invited to verify
- **THEN** the message tables the visit's date and time, the shop and what to bring
- **AND** its action link opens the identity check rather than the case

### Requirement: A value nobody has set is bracketed outside production and refuses the act in production

Legal owes the licence wording and the complaints contact and Finance owes the
FPS id and the bank account; no message goes out with a blank where one belongs.

- **Outside production** — a message SHALL print a marked placeholder naming the unset value in its place, and SHALL still be sent.
- **In production** — an act that would print an unset value SHALL be refused by name, and SHALL commit nothing.
- **Rendered before it commits** — an act that sends a message SHALL render that message before its own record is written, so no record stands describing a message that cannot be sent.

#### Scenario: grade10-site-vault-collector-notifications-SC-32 - A value Finance has not set prints in brackets outside production
**Serves:** What a message carries - a shop reading its own letters on staging before Finance has answered

- **GIVEN** an environment that is not production and no bank account set for the lender
- **WHEN** a money message is sent
- **THEN** it goes, printing a marked placeholder naming the unset value where the bank account belongs

#### Scenario: grade10-site-vault-collector-notifications-SC-33 - In production the act refuses rather than post a blank
**Serves:** `grade10-site/vault/loan-and-settlement#grade10-site-vault-loan-and-settlement-US-01`, `grade10-site-vault-collector-notifications-US-05` - the treasurer recording the advance whose letter would have nowhere to pay on it

- **GIVEN** production and no FPS id set for the lender
- **WHEN** an advance is recorded
- **THEN** the act is refused by name, no money record is written, and no message is owed
