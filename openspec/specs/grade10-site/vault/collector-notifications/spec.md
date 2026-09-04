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

#### Scenario: grade10-site-vault-collector-notifications-SC-01 - Every event is decided

- **WHEN** the map from events to messages is read
- **THEN** every kind of event names a message or names silence, and none is unanswered

#### Scenario: grade10-site-vault-collector-notifications-SC-02 - Three endings, three messages

- **GIVEN** three cases ended by an untouched draft, by nobody booking, and by a missed visit
- **THEN** each collector is told the true one of the three, not one shared wording

### Requirement: The vault sends twenty-three messages, each about the case it names

The messages SHALL be exactly these, in English, addressed to the case's own
address, each carrying an action link to the case:

| Group | Messages |
| --- | --- |
| The visit | booked, moved, cancelled, missed |
| The offer | made, expired |
| Custody | item vaulted, item released, item forfeited |
| The loan | advance recorded with its due date, repayment recorded, advance corrected, repayment corrected, loan repaid |
| Falling due | due soon, overdue, forfeiture notice with its cure date |
| The end of a case | declined, cancelled, request untouched, request unbooked, request closed after a missed visit |
| The paper | the signed documents, attached |

#### Scenario: grade10-site-vault-collector-notifications-SC-03 - The advance names the due date

- **WHEN** an advance is recorded
- **THEN** the collector is sent a message naming the amount and the calendar date the loan is repayable by

#### Scenario: grade10-site-vault-collector-notifications-SC-04 - A correction reaches the borrower

- **WHEN** a money record is taken back
- **THEN** the collector is told, with the amount and what the case now stands at, and never with who recorded it

### Requirement: A borrower is reminded before the due date and while it is overdue

A borrower with a live loan SHALL be sent a reminder 7 days and 1 day before
the due date, and one every 7 days after it while anything is outstanding.

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

#### Scenario: grade10-site-vault-collector-notifications-SC-05 - A week before, and the day before

- **GIVEN** a live loan due in 7 days
- **WHEN** the reminders are swept
- **THEN** the borrower is sent one reminder naming the balance and the due date
- **AND** one more is sent the day before it

#### Scenario: grade10-site-vault-collector-notifications-SC-06 - A pass that runs twice sends once

- **GIVEN** a loan whose 7-day reminder has been sent
- **WHEN** the reminders are swept again the same day
- **THEN** nothing further is sent

#### Scenario: grade10-site-vault-collector-notifications-SC-07 - A long-overdue loan is told once where it stands

- **GIVEN** a loan 90 days overdue that has had no reminder
- **WHEN** the reminders are swept
- **THEN** one overdue reminder is sent, not one for every seventh day that has passed

#### Scenario: grade10-site-vault-collector-notifications-SC-08 - The notice stops the reminders

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

#### Scenario: grade10-site-vault-collector-notifications-SC-09 - The item is vaulted even though the mail failed

- **GIVEN** a mail provider refusing every send
- **WHEN** an item is taken into the vault
- **THEN** the case is vaulted and the message is owed

#### Scenario: grade10-site-vault-collector-notifications-SC-10 - Five attempts, then parked

- **GIVEN** an owed message the provider keeps refusing
- **WHEN** the retries are swept until the ladder is spent
- **THEN** the message is parked with its reason, the case is flagged, and no further attempt is made

#### Scenario: grade10-site-vault-collector-notifications-SC-11 - An operator hands a parked message back

- **GIVEN** a case carrying a parked message
- **WHEN** an operator sends it again
- **THEN** the message is back on the queue and the case's flag clears when it goes

#### Scenario: grade10-site-vault-collector-notifications-SC-12 - A send that never answers gives up

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

#### Scenario: grade10-site-vault-collector-notifications-SC-13 - One signer, one set

- **GIVEN** a sealed packet whose delivery has not run
- **WHEN** two passes read it at once
- **THEN** the signer is mailed the set once

#### Scenario: grade10-site-vault-collector-notifications-SC-14 - A retried delivery re-reads the documents

- **GIVEN** a sealed set whose first send failed
- **WHEN** the retry runs hours later
- **THEN** the same documents are read again from the packet and attached

#### Scenario: grade10-site-vault-collector-notifications-SC-15 - A set too heavy to attach still tells the signer

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

#### Scenario: grade10-site-vault-collector-notifications-SC-16 - A corrected address gets the retry

- **GIVEN** an owed message and a collector who has since corrected their address
- **WHEN** the retry runs
- **THEN** it goes to the corrected address

#### Scenario: grade10-site-vault-collector-notifications-SC-17 - An erased case is not posted to

- **GIVEN** a case whose contact has been erased
- **WHEN** a message for it is attempted
- **THEN** nothing is sent, the message is counted as unreachable, and it is no longer owed

### Requirement: WhatsApp is a link staff press

The vault SHALL send nothing over WhatsApp or SMS. Where a case carries a
number, the console SHALL offer a click-to-chat link with prepared templates
for an operator to press, and there SHALL be no inbound channel.

A number SHALL be treated as unverified.

#### Scenario: grade10-site-vault-collector-notifications-SC-18 - Nothing is sent to a phone

- **WHEN** any event decides a message
- **THEN** it is sent by email alone
