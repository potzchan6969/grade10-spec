# grade10-site/vault/collector-notifications Specification

## Purpose

What the vault tells a collector about their own case, and what happens to a
message that does not go out.

Everything that happens to a case decides one message or decides silence, in
writing; nothing reaches a collector by accident and nothing is dropped
quietly. The events themselves belong to the capability that writes them; this
is what the collector hears about them.

## Feature set

- What is sent
  - One decision per event: every event either names a message or is decided
    silent, so nothing can ship unnoticed
  - Twenty-three messages: one per thing worth telling, English, to the case's
    own address
  - The action link: every message opens the case at its own address
  - Twenty-four messages: one per thing worth telling, the identity-check
    invitation among them, English, to the case's own address
  - Silence on a draft staff opened: its expiry and its cancel send nothing
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

## Requirements

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

<!-- trace:scenario id=g10.vault-collector-notifications.SC-r3s rev=1 -->
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

### Requirement: A borrower is reminded before the due date and while it is overdue

A borrower with a live loan SHALL be sent a reminder 7 days and 1 day before
the due date, and one every 7 days after it while anything is outstanding. The
days SHALL be counted on the brand's calendar, so a week before a due date is
the seventh day before it however the hours fall, and no reminder SHALL be
sent before 09:00 on the brand's clock.

Each reminder SHALL name the balance at the reading and the due date, and the
overdue one SHALL say that interest keeps running at the same daily rate with
no fee.

At most one reminder SHALL be sent per case per pass, and it SHALL be the
newest offset the clock has reached that this case has not already had, so a
loan long overdue when the schedule first reaches it is sent one message
rather than one for every offset it has passed.

A reminder already sent for an offset SHALL never be sent again, whatever the
cadence of the passes.

The ladder SHALL stop at a forfeiture notice: once one stands on the case, no
further reminder SHALL be sent.

<!-- trace:scenario id=g10.vault-collector-notifications.SC-jys rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-05 - A week before, and the day before
**Serves:** grade10-site-vault-collector-notifications-US-01 - Borrower is warned before the due date and while it runs late

- **GIVEN** a live loan due in 7 days
- **WHEN** the reminders are swept
- **THEN** the borrower is sent one reminder naming the balance and the due date
- **AND** one more is sent the day before it

<!-- trace:scenario id=g10.vault-collector-notifications.SC-vqz rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-19 - The reminder waits for the morning
**Serves:** grade10-site-vault-collector-notifications-US-01 - Borrower is warned before the due date and while it runs late

- **GIVEN** a live loan whose 7-day offset the brand's calendar reaches at midnight
- **WHEN** the reminders are swept in the small hours
- **THEN** nothing is sent
- **AND** the first sweep after 09:00 on the brand's clock sends it

<!-- trace:scenario id=g10.vault-collector-notifications.SC-l19 rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-06 - A pass that runs twice sends once
**Serves:** Reminders - a pass that runs twice sends once

- **GIVEN** a loan whose 7-day reminder has been sent
- **WHEN** the reminders are swept again the same day
- **THEN** nothing further is sent

<!-- trace:scenario id=g10.vault-collector-notifications.SC-gdg rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-07 - A long-overdue loan is told once where it stands
**Serves:** grade10-site-vault-collector-notifications-US-01 - Borrower is warned before the due date and while it runs late

- **GIVEN** a loan 90 days overdue that has had no reminder
- **WHEN** the reminders are swept
- **THEN** one overdue reminder is sent, not one for every seventh day that has passed

<!-- trace:scenario id=g10.vault-collector-notifications.SC-3f7 rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-08 - The notice stops the reminders
**Serves:** grade10-site-vault-collector-notifications-US-01 - Borrower is warned before the due date and while it runs late

- **GIVEN** an overdue loan carrying a forfeiture notice
- **WHEN** the reminders are swept
- **THEN** nothing is sent

### Requirement: A failed send is owed, and retried on one ladder

A send that fails SHALL never fail the act it was about: the act stands and
the message SHALL be written down as still owed.

Every message the vault owes SHALL be retried on one ladder — at most five
attempts, backing off from five minutes to six hours. A message the ladder
runs out on SHALL be parked with the reason on it and SHALL leave the queue,
and its case SHALL be flagged for staff.

An operator holding the vault operate grant SHALL be able to hand every parked
message on a case back to the queue.

Every attempt SHALL give up at ten seconds, and a send that gives up SHALL be
a failed attempt like any other.

<!-- trace:scenario id=g10.vault-collector-notifications.SC-6iy rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-09 - The item is vaulted even though the mail failed
**Serves:** grade10-site-vault-collector-notifications-US-04 - Operator picks up a message that never went

- **GIVEN** a mail provider refusing every send
- **WHEN** an item is taken into the vault
- **THEN** the case is vaulted and the message is owed

<!-- trace:scenario id=g10.vault-collector-notifications.SC-qld rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-10 - Five attempts, then parked
**Serves:** grade10-site-vault-collector-notifications-US-04 - Operator picks up a message that never went

- **GIVEN** an owed message the provider keeps refusing
- **WHEN** the retries are swept until the ladder is spent
- **THEN** the message is parked with its reason, the case is flagged, and no further attempt is made

<!-- trace:scenario id=g10.vault-collector-notifications.SC-lzl rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-11 - An operator hands a parked message back
**Serves:** grade10-site-vault-collector-notifications-US-04 - Operator picks up a message that never went

- **GIVEN** a case carrying a parked message
- **WHEN** an operator sends it again
- **THEN** the message is back on the queue and the case's flag clears when it goes

<!-- trace:scenario id=g10.vault-collector-notifications.SC-qli rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-12 - A send that never answers gives up
**Serves:** When a send fails - a send that never answers gives up

- **GIVEN** a provider that accepts the request and never answers
- **WHEN** ten seconds pass
- **THEN** the attempt has failed and the message is owed

### Requirement: The signed set is delivered once, and its documents are read at the attempt

Every completed packet's sealed documents SHALL be mailed to the case's own
address exactly once, claimed per packet so that two overlapping passes cannot
mail one signer twice.

A delivery that fails SHALL join the same retry ladder as every other message,
carrying the packet it is for and nothing of the documents themselves. Each
attempt SHALL read the sealed documents from that packet again.

Where the documents cannot be attached — the set is over the mail's size cap,
a completed packet's document carries no seal, or the sealed bytes are not
where they should be — the fault SHALL be logged and the message SHALL still
go, with its link to the case, where the copies are.

<!-- trace:scenario id=g10.vault-collector-notifications.SC-r2t rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-13 - One signer, one set
**Serves:** grade10-site-vault-collector-notifications-US-03 - Signer leaves with the documents they signed

- **GIVEN** a sealed packet whose delivery has not run
- **WHEN** two passes read it at once
- **THEN** the signer is mailed the set once

<!-- trace:scenario id=g10.vault-collector-notifications.SC-lmz rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-14 - A retried delivery re-reads the documents
**Serves:** grade10-site-vault-collector-notifications-US-03 - Signer leaves with the documents they signed

- **GIVEN** a sealed set whose first send failed
- **WHEN** the retry runs hours later
- **THEN** the same documents are read again from the packet and attached

<!-- trace:scenario id=g10.vault-collector-notifications.SC-4ig rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-15 - A set too heavy to attach still tells the signer
**Serves:** grade10-site-vault-collector-notifications-US-03 - Signer leaves with the documents they signed

- **GIVEN** a sealed set over the mail's size cap
- **WHEN** the delivery runs
- **THEN** the message goes without the attachments, carrying the link to the case, and the fault is logged

### Requirement: The reader is read at the attempt, and a case with nobody to tell is counted

Everything about the reader — the address, the item's title, the currency —
SHALL be read from the case at the moment of the attempt, never stored on the
queue. What the queue holds SHALL be only what the case cannot answer later:
the amount that message named, the visit it named, and the packet whose
documents it carries.

A case with no address SHALL be counted as unreachable rather than mailed, and
SHALL leave the queue.

<!-- trace:scenario id=g10.vault-collector-notifications.SC-xyv rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-16 - A corrected address gets the retry
**Serves:** grade10-site-vault-collector-notifications-US-04 - Operator picks up a message that never went

- **GIVEN** an owed message and a collector who has since corrected their address
- **WHEN** the retry runs
- **THEN** it goes to the corrected address

<!-- trace:scenario id=g10.vault-collector-notifications.SC-ooy rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-17 - An erased case is not posted to
**Serves:** The reader - an erased case is not posted to

- **GIVEN** a case whose contact has been erased
- **WHEN** a message for it is attempted
- **THEN** nothing is sent, the message is counted as unreachable, and it is no longer owed

### Requirement: WhatsApp is a link staff press

The vault SHALL send nothing over WhatsApp or SMS. Where a case carries a
number, the console SHALL offer a click-to-chat link with prepared templates
for an operator to press, and there SHALL be no inbound channel.

A number SHALL be treated as unverified.

<!-- trace:scenario id=g10.vault-collector-notifications.SC-3y6 rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-18 - Nothing is sent to a phone
**Serves:** The reader - nothing is sent to a phone

- **WHEN** any event decides a message
- **THEN** it is sent by email alone

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

<!-- trace:scenario id=g10.vault-collector-notifications.SC-kz4 rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-20 - The invitation is one of the set
**Serves:** grade10-site-vault-collector-notifications-US-06 - the collector verifying at home before the visit they booked

- **GIVEN** a case with a visit booked and no identity to reuse
- **WHEN** its collector is invited to verify
- **THEN** the invitation is one of the twenty-four messages this table names, sent to the case's own address like any other

<!-- trace:scenario id=g10.vault-collector-notifications.SC-ayk rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-34 - The link opens the case the message is about
**Serves:** grade10-site-vault-collector-notifications-US-02 - the collector going straight from the message to the case rather than asking the shop

- **WHEN** a collector opens the action link on any message but the invitation to verify
- **THEN** the case the message is about opens at its own address

### Requirement: Every message carries the case line and the sender's footer

Every message ends the same way, whatever it is about.

- **The case line** — every message SHALL carry the case's reference and the item's title, directly above the footer.
- **The footer** — every message SHALL name the party it is from under that party's registered name, with the complaints contact; the lender's footer SHALL carry its licence line, and the custodian's none.
- **Which party** — a message naming an amount of money SHALL name the lender, and every other message SHALL name the custodian.

#### Scenario: grade10-site-vault-collector-notifications-SC-21 - The case line carries the reference
**Serves:** `grade10-site/vault/case-intake#grade10-site-vault-case-intake-US-05`, `grade10-site-vault-collector-notifications-US-05` - the collector reading their own reference off a message to type at the bank

- **WHEN** any message is sent about a case
- **THEN** it carries that case's reference and the item's title directly above the footer

<!-- trace:scenario id=g10.vault-collector-notifications.SC-3bq rev=1 -->
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

<!-- trace:scenario id=g10.vault-collector-notifications.SC-o0k rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-23 - The offer's message tables its terms
**Serves:** grade10-site-vault-collector-notifications-US-05 - the collector answering an offer from the message itself

- **GIVEN** an offer of 4,000,000 HKD minor units over 90 days
- **WHEN** the offer message is sent
- **THEN** it tables the loan, the term, the interest for the term, the total to repay, what a late day costs and the day the offer is open until
- **AND** no one of those figures is readable only inside a sentence

<!-- trace:scenario id=g10.vault-collector-notifications.SC-a2c rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-24 - The advance's message says where to send the money
**Serves:** grade10-site-vault-collector-notifications-US-05 - the borrower acting on the advance's message without opening the page

- **WHEN** an advance of 3,900,000 HKD minor units is recorded
- **THEN** its message tables the amount sent, the due date, the total to repay and what each day after the due date adds
- **AND** carries the same how-to-pay block the live loan shows

<!-- trace:scenario id=g10.vault-collector-notifications.SC-tgx rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-25 - The due-soon reminder tables what is owed
**Serves:** grade10-site-vault-collector-notifications-US-01 - the borrower reading what they owe before the due date

- **GIVEN** a live loan due in 7 days
- **WHEN** the due-soon reminder is sent
- **THEN** it tables what is owed at that reading, the due date and what each day from the day after the due date adds, with how to pay under them

<!-- trace:scenario id=g10.vault-collector-notifications.SC-3ke rev=1 -->
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

<!-- trace:scenario id=g10.vault-collector-notifications.SC-0ul rev=1 -->
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

<!-- trace:scenario id=g10.vault-collector-notifications.SC-sar rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-29 - The notice names its clause and the date to pay by
**Serves:** grade10-site-vault-collector-notifications-US-05 - the borrower reading the notice as the record it is

- **WHEN** a forfeiture notice is sent
- **THEN** it opens on the clause of the loan agreement it acts under
- **AND** tables the date to pay in full by, what is owed as at that reading, what each further day adds and the condition on which the item lapses

<!-- trace:scenario id=g10.vault-collector-notifications.SC-k1j rev=1 -->
#### Scenario: grade10-site-vault-collector-notifications-SC-30 - The notice says a person decides and nothing more will be sent
**Serves:** grade10-site-vault-collector-notifications-US-01 - the borrower learning the weekly warnings have stopped and why

- **WHEN** a forfeiture notice is sent
- **THEN** it says that taking the item is a person's decision, and that no further reminder follows it

### Requirement: The invitation to verify names the visit it prepares for

The one message the vault sends a collector who has no identity on file yet.

- **The facts** — the invitation SHALL table the visit's date and time, the shop it is at, and what to bring.
- **Where its link goes** — its action link SHALL open the identity check rather than the case.
- **The other ways** — the invitation SHALL say that the check can be done at the counter instead, and that a collector already verified need do nothing.

<!-- trace:scenario id=g10.vault-collector-notifications.SC-fcf rev=1 -->
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

<!-- trace:scenario id=g10.vault-collector-notifications.SC-tz5 rev=1 -->
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
