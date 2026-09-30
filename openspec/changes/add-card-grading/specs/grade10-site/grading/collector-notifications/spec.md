# grade10-site/grading/collector-notifications Specification

## Purpose

What grading tells a collector about their own submission, what it decides to
say nothing about, and what happens to a message that does not go out.

Every event either names a message or is decided silent, in writing, so
nothing reaches a collector by accident and nothing is dropped quietly. The
events themselves belong to the capability that writes them; this is what the
collector hears about them.

## Feature set

- What is sent
  - One decision per event: every event names a message or is decided silent,
    so a new event cannot ship unnoticed
  - One channel, one language: email, in English, to the address the
    submission was planned under
  - The action link: every message opens the submission at its own address,
    which needs no account
  - What each message carries: the facts the collector would otherwise have to
    ask for, and the documents where a document exists
- Silence on purpose
  - Told at the counter: a card refused in front of the collector sends no
    message
  - Told on the page: naming a collector is logged in the submission's history
    and sends none either
- The drop-off's messages
  - Sent by the submission: booked, moved, cancelled, missed and the day
    before, because the diary sends nothing for a product booking
  - What they carry: the visit, what to bring, the list and the fee, the day
    the cards leave, and a calendar file on a booking
- Reminders and the notice
  - While the cards sit ready: a reminder at each rung, costing nothing
  - The storage fee: told the day it starts, with what is due and the notice
    day
  - The written notice: sent the day staff post it, saying what is due, the
    days it gives and the clause behind it
  - Stopping at the notice: nothing stronger follows it in this release
- When a send fails
  - Owed, not lost: a failure is written down as still owed and never fails
    the thing it was about
  - One ladder: the vault's, for every message grading owes
  - Parked with a reason: the submission is flagged for staff, and an operator
    can send it again
- The footer
  - The submission's own line: its id and what it holds, under every message
  - Who is writing: the custodian's registered name trading as Grade10, the
    shop and its address, and the complaints contact
  - The clock: dates and times are the shop's
  - Nothing bracketed in production: a fact the footer prints is set before
    any message goes

## ADDED Requirements

### Requirement: Every event decides its message, or decides silence

Everything that can happen to a submission is answered once, in writing, before
it can ship.

- **The map** — every kind of event on a submission SHALL name the message it sends the collector, or name silence, and the map SHALL be exhaustive.
- **Nothing unanswered** — a new kind of event SHALL NOT be shippable until somebody has decided which of the two it is.
- **The event, not the actor** — what a collector hears SHALL be a property of what happened, so the same event sends the same message whether the collector, the counter or a sweep caused it.

#### Scenario: grade10-site-grading-collector-notifications-SC-01 - Every event is decided
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector who never has to ask the shop what stage the cards are at

- **WHEN** the map from events to messages is read
- **THEN** every kind of event on a submission names a message or names silence, and none is unanswered

#### Scenario: grade10-site-grading-collector-notifications-SC-02 - The same event tells the same message
**Serves:** What is sent - one wording for an event however it came about

- **GIVEN** two submissions, each with a drop-off booked
- **WHEN** one collector cancels their visit on the page and staff cancel the other at the counter
- **THEN** both collectors are sent the same cancelled message, and neither is told who cancelled it

### Requirement: Grading sends nineteen messages, each about the submission it names

The messages SHALL be exactly these nineteen, in English, to the address the
submission was planned under, each carrying an action link to the submission:

| Group | Messages |
| --- | --- |
| The plan | the list saved with its link, the nudge on the nudge day, the plan expired |
| The drop-off | booked, moved, cancelled, missed, the visit closed by the submission that owned it, the day before |
| The counter | handed in, the hand-back receipt for a card withdrawn and for the cards collected |
| The batch | on its way to the grader, re-estimated |
| The grades | the grades posted, a card not back with the box |
| Waiting to be collected | ready to collect, still here, the storage fee started, the written notice |

- **One channel, one language** — every message SHALL be sent by email, in English, whatever language the collector reads the pages in, and grading SHALL send nothing on any other channel.
- **The link** — every message's action link SHALL open the submission at its own address, which SHALL need no account.
- **What it names** — every message SHALL state the facts it is about rather than only linking to them, and SHALL leave out a paragraph whose fact does not stand for this submission.
- **Not back with the box** — a card recorded held by the grader, not returned or damaged SHALL be told in the message for a card not back with the box, sent the day it is recorded; a held card SHALL be named with the day the grader holds it until.
- **What it attaches** — the handed-in message SHALL carry the intake receipt and the signed agreement, the hand-back receipt SHALL carry the signed receipt, and the drop-off booked message SHALL carry a calendar file.

#### Scenario: grade10-site-grading-collector-notifications-SC-03 - The link opens the submission with no account
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector going straight from the message to the page rather than signing in

- **WHEN** a collector opens the action link on any message
- **THEN** the submission the message is about opens at its own address, with no account asked for

#### Scenario: grade10-site-grading-collector-notifications-SC-04 - A message says only what is true of this submission
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector reading a message that raises nothing they do not owe

- **GIVEN** a submission whose grades are posted with nothing to settle and no ungraded card
- **WHEN** the grades message is sent
- **THEN** it carries each card's grade and neither the paragraph about settling nor the paragraph about an ungraded card

#### Scenario: grade10-site-grading-collector-notifications-SC-05 - Handed in carries the papers
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector leaving the counter with the record of what they paid and signed

- **WHEN** the cards are handed in
- **THEN** the collector is sent a message stating what was paid and the cards taken in, with the intake receipt and the signed agreement attached
- **AND** where the level carries cover, what was paid names the cover beside the fee

#### Scenario: grade10-site-grading-collector-notifications-SC-23 - One channel, one language
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector reading every message in one inbox, in one language

- **GIVEN** a collector reading the pages in Traditional Chinese
- **WHEN** the cards are handed in
- **THEN** the handed-in message is sent by email, in English, and nothing is sent on any other channel

#### Scenario: grade10-site-grading-collector-notifications-SC-24 - A message with no document attaches nothing
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector reading a short message where there is no document to keep

- **WHEN** a message other than the handed-in message, the hand-back receipt and the drop-off booked message is sent
- **THEN** it carries no attachment

### Requirement: A card refused at the counter and a collector named on the page send no message

Two events are decided silent, because the collector has already been told.

- **Refused at the counter** — a card refused in front of the collector SHALL send no message; the page SHALL badge that card as refused in the staff's words as typed, and the receipt SHALL carry it.
- **Naming a collector** — naming the person who may collect, or changing them, SHALL send no message; the submission's history SHALL log it.
- **Decided, not forgotten** — both SHALL stand in the map as silence, so neither reads as an event nobody answered.

#### Scenario: grade10-site-grading-collector-notifications-SC-06 - A refused card is told at the counter, not by email
**Serves:** grade10-site-grading-collector-notifications-US-02 - the collector who watched the card be refused and needs no email about it

- **WHEN** staff refuse a card in front of the collector
- **THEN** no message is sent, and the card carries its refused badge and the staff's words on the submission page

#### Scenario: grade10-site-grading-collector-notifications-SC-07 - Naming somebody to collect sends nothing
**Serves:** grade10-site-grading-collector-notifications-US-02 - the collector naming a friend on the page and seeing it logged there

- **WHEN** a collector names somebody else to collect the cards
- **THEN** no message is sent, and the submission's history logs it

### Requirement: The submission sends the drop-off's messages, and the collector hears from nobody else

The drop-off is a visit in the shop's diary, and everything the collector hears
about it comes from the submission.

- **The set** — booked, moved, cancelled, missed, the day before, and the visit closed by the submission that owned it SHALL each be sent by the submission.
- **One sender** — the collector SHALL receive no second message about the same visit from the diary.
- **What they carry** — each SHALL name the visit's day, time and shop, what to bring, the cards listed and the fee, and the day the cards leave for the grader.
- **Booked** — the booked message SHALL carry a calendar file.
- **The day before** — a reminder SHALL be sent the day before the visit.
- **Missed** — the missed message SHALL follow the diary closing a visit nobody started, within the hour, and SHALL carry the line to book another drop-off with the list and the estimate as they stood.

#### Scenario: grade10-site-grading-collector-notifications-SC-08 - Booked once, from the submission
**Serves:** grade10-site/grading/dropoff-booking#grade10-site-grading-dropoff-booking-US-01 - the collector booking the drop-off from the plan and putting it in their calendar

- **WHEN** a collector books the drop-off
- **THEN** the submission sends one booked message naming the visit's day, time and shop, what to bring, the cards and the fee, and the day the cards leave, with a calendar file attached
- **AND** no second message about that visit reaches the collector from the diary

#### Scenario: grade10-site-grading-collector-notifications-SC-09 - The reminder comes the day before
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector turning up with the right cards on the right day

- **GIVEN** a drop-off booked for tomorrow
- **WHEN** the day before the visit comes
- **THEN** the collector is sent one reminder naming the visit and what to bring

#### Scenario: grade10-site-grading-collector-notifications-SC-10 - A missed visit is told within the hour
**Serves:** grade10-site/grading/dropoff-booking#grade10-site-grading-dropoff-booking-US-03 - the collector who missed the visit booking another

- **GIVEN** a booked drop-off the collector never started
- **WHEN** the diary closes the visit as missed
- **THEN** the collector is sent the missed message within the hour, carrying the line to book another drop-off and the list and the estimate as they stood

### Requirement: Cards waiting to be collected are told at each rung, and nothing follows the notice

A collector who leaves the cards hears at each rung of the uncollected ladder,
and the release stops at the written notice.

- **The rungs** — a submission whose cards are ready and uncollected SHALL be sent a reminder on each reminder day, a message the day the storage fee starts, and the written notice the day staff post it.
- **The days** — the reminder days, the storage day and the notice day SHALL be the settings the console holds, seeded at 30 and 60 days, day 90 and day 180 from the day the cards became ready, and counted on the shop's clock.
- **A reminder costs nothing** — every reminder SHALL name the pickup code, what is due, the storage day and the notice day, and SHALL say that the reminder itself adds nothing.
- **The storage message** — it SHALL name the fee for each card for each month, what is due now, and the notice day.
- **The notice** — it SHALL name what is due that day, the pickup code, the days it gives from the posting date, the notice period pinned at signing, and the clause it acts under.
- **Once per rung** — a rung already told SHALL never be told again, whatever the cadence of the passes.
- **The ladder stops** — nothing stronger than the written notice SHALL be sent, and no message SHALL follow it.

#### Scenario: grade10-site-grading-collector-notifications-SC-11 - The first reminder names what it costs to be reminded
**Serves:** grade10-site/grading/submission-lifecycle#grade10-site-grading-submission-lifecycle-US-08 - the collector who left the cards being told before any money starts

- **GIVEN** a submission ready and uncollected for 30 days
- **WHEN** the reminders are swept
- **THEN** the collector is sent a reminder naming the pickup code, what is due, the storage day and the notice day, and saying the reminder adds nothing

#### Scenario: grade10-site-grading-collector-notifications-SC-12 - The storage fee is told the day it starts
**Serves:** grade10-site/grading/submission-lifecycle#grade10-site-grading-submission-lifecycle-US-08 - the collector learning the cards have begun to cost on the day they do

- **GIVEN** a submission ready and uncollected for 90 days
- **WHEN** the storage day comes
- **THEN** the collector is sent a message naming the fee for each card for each month, what is due now and the notice day

#### Scenario: grade10-site-grading-collector-notifications-SC-13 - The notice runs its days from the posting date
**Serves:** grade10-site/grading/submission-lifecycle#grade10-site-grading-submission-lifecycle-US-08 - the collector reading the notice as the record it is

- **WHEN** staff record the written notice as posted
- **THEN** the collector is sent it that day, naming what is due, the pickup code, the days it gives from the posting date as pinned at signing, and the clause it acts under

#### Scenario: grade10-site-grading-collector-notifications-SC-14 - A rung told twice is told once
**Serves:** Reminders and the notice - the collector not told twice on a day the sweep ran twice

- **GIVEN** a submission whose 30-day reminder has been sent
- **WHEN** the reminders are swept again the same day
- **THEN** nothing further is sent

#### Scenario: grade10-site-grading-collector-notifications-SC-15 - Nothing follows the notice
**Serves:** grade10-site/grading/submission-lifecycle#grade10-site-grading-submission-lifecycle-US-08 - the collector hearing the ladder stop where the notice stands

- **GIVEN** a submission carrying a posted written notice
- **WHEN** the sweeps run over it afterwards
- **THEN** no further message is sent about the cards being uncollected

### Requirement: A failed send is owed, and rides the vault's ladder

A message that does not go out is written down rather than lost, and never
takes the act it was about down with it.

- **The act stands** — a send that fails SHALL never fail the act it was about: the act stands and the message SHALL be written down as still owed.
- **One ladder** — every message grading owes SHALL be retried on the ladder `grade10-site/vault/collector-notifications` defines, instantiated for grading.
- **Parked** — a message the ladder runs out on SHALL be parked with its reason and SHALL leave the queue, and its submission SHALL be flagged for staff on the queue and on the submission itself.
- **Sent again** — an operator holding the grading operate grant SHALL be able to send a parked message again, and the flag SHALL clear when it goes.

#### Scenario: grade10-site-grading-collector-notifications-SC-16 - The cards are handed in though the mail failed
**Serves:** grade10-site-grading-collector-notifications-US-03 - the operator whose counter keeps working through a provider outage

- **GIVEN** a mail provider refusing every send
- **WHEN** the cards are handed in
- **THEN** the hand-in stands and the message is owed

#### Scenario: grade10-site-grading-collector-notifications-SC-17 - The ladder spent, parked and flagged
**Serves:** grade10-site-grading-collector-notifications-US-03 - the operator finding out a collector was never told

- **GIVEN** an owed message the provider keeps refusing
- **WHEN** the retries run until the ladder is spent
- **THEN** the message is parked with its reason, its submission is flagged for staff, and no further attempt is made

#### Scenario: grade10-site-grading-collector-notifications-SC-18 - An operator sends a parked message again
**Serves:** grade10-site-grading-collector-notifications-US-03 - the operator clearing the flag by getting the message out

- **GIVEN** a submission carrying a parked message
- **WHEN** an operator holding the grading operate grant sends it again
- **THEN** the message is back on the queue and the submission's flag clears when it goes

#### Scenario: grade10-site-grading-collector-notifications-SC-25 - The flag clears when the channel accepts the send
**Serves:** grade10-site-grading-collector-notifications-US-03 - the operator watching the flag come off the submission they just sent again

- **GIVEN** a parked message an operator has sent again
- **WHEN** the channel accepts the send
- **THEN** the parked message closes and the submission's flag clears, with nothing waiting on a later delivery check

### Requirement: Every message ends with the submission's line and the shop's footer

Every message closes the same way, whatever it is about.

- **The submission's line** — every message SHALL carry the submission's id and what it holds — the cards, the grader and the level — directly above the footer.
- **Who is writing** — the footer SHALL name the custodian under its registered name trading as Grade10, the shop and its address, and the complaints contact.
- **The clock** — every date and time in a message SHALL be stated on the shop's clock, `Asia/Hong_Kong`, and the footer SHALL say so.

#### Scenario: grade10-site-grading-collector-notifications-SC-19 - The footer names the submission and who is writing
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector reading their own submission id off a message to quote at the shop

- **WHEN** any message is sent about a submission
- **THEN** it carries that submission's id, its cards, grader and level directly above a footer naming the custodian under its registered name trading as Grade10, the shop and its address, and the complaints contact

#### Scenario: grade10-site-grading-collector-notifications-SC-20 - Every date is the shop's
**Serves:** grade10-site-grading-collector-notifications-US-01 - the collector abroad reading a date they can turn up on

- **WHEN** a message names a date or a time
- **THEN** it is stated on the shop's clock, `Asia/Hong_Kong`, and the footer says so

### Requirement: A value nobody has set is bracketed outside production and refuses the act in production

Legal owes the custodian's registered name and the complaints contact, so no
message goes out with a blank where one of them belongs.

- **Outside production** — a message SHALL print a marked placeholder naming the unset value in its place, and SHALL still be sent.
- **In production** — an act that would print an unset value SHALL be refused by name, and SHALL commit nothing.
- **Rendered before it commits** — an act that sends a message SHALL render that message before its own record is written, so no record stands describing a message that cannot be sent.

#### Scenario: grade10-site-grading-collector-notifications-SC-21 - A value Legal has not set prints in brackets outside production
**Serves:** The footer - the shop reading its own letters on staging before Legal has answered

- **GIVEN** an environment that is not production and no complaints contact set
- **WHEN** any message is sent
- **THEN** it goes, printing a marked placeholder naming the unset value where the complaints contact belongs

#### Scenario: grade10-site-grading-collector-notifications-SC-22 - In production the act refuses rather than send a blank
**Serves:** grade10-admin/grading/counter#grade10-admin-grading-counter-US-02 - the operator handing a list in whose message would print a blank where the custodian belongs

- **GIVEN** production and no custodian registered name set
- **WHEN** the cards are handed in
- **THEN** the act is refused by name, nothing is written, and no message is owed
