# grade10-site/grading/dropoff-booking Specification

## Purpose

The visit a submission's cards are handed in on: which service it books, the
batch the chosen day makes, and what moving, cancelling or missing it costs.

The diary that holds shops, services and slots is another service's
(`grade10-site/appointment/booking`); this capability is what a submission may
ask of it, what the submission keeps of the answer, and what it tells the
collector, because the diary tells them nothing for a product booking.

## Feature set

- The diary services
  - Three entries, no new diary logic: the drop-off bound to the submission,
    its longer Bulk variant, and the customer-bookable visit a walk-in books
  - The submission owns every message: the diary is given no address, so
    booked, moved, cancelled, missed and the day before are grading's own
  - The booking window: the service's own horizon, read from the diary
- Booking the visit
  - Where and when: the shop, a day inside the horizon, and a time in the
    shop's own zone
  - Sized by the list: twenty cards or more takes the longer visit, and so do
    two lists on one visit that pass twenty together, and a booked list edited
    past twenty
  - The diary refuses in its own words: a slot not offered, full, without its
    resource or already booked, and another day offered
- The batch a day makes
  - Read beside the day: hand in by the cut-off and the cards leave the next
    day
  - Past the cut-off: the next batch's close and ship days instead
  - The estimate runs from the ship day: not from the day the visit is booked
- The booked page
  - The visit as booked: the day, the time, the shop and its address, with a
    calendar file
  - Before you come: the cards sleeved, the list staff check against, the
    signature before the fee, and the day the cards leave
  - The vault on the same visit: a card not being graded can open a vault
    case, which asks for the identity check grading does not
- Moving, cancelling and missing
  - Any time before it starts: moved or cancelled from the submission page,
    and told either way
  - A missed visit closes the visit: the diary's console closes it and the
    submission reads the outcome within the hour
  - The list survives: a cancelled or missed visit keeps the cards and the
    estimate as they were, and another drop-off is booked from the page
- One visit, two submissions
  - The first submission owns it: a second joins that visit rather than
    booking its own
  - Read through the owner: the joiner's page shows the same day and time
  - Detached with the owner: a visit the owner cancels or misses leaves every
    joiner asked to book again
- The walk-in
  - Booked with a name and an email: the customer-bookable visit, with no list
  - Listed at the counter: the cards are written with the collector at the
    desk, and the visit carries no submission

## ADDED Requirements

### Requirement: Grading takes three diary services and owns every message about the visit

The shop's diary holds the shops, the services and the slots; grading takes
entries in it and adds no logic of its own.

**The three services** - the diary SHALL carry a Grading drop-off bound to a
submission and lasting about 20 minutes, a Bulk variant of it lasting about 45
minutes, and a customer-bookable Grading visit that carries no submission.

**Bound, so never listed** - the two drop-off services SHALL be reachable from
a submission alone, and the collector's own booking surface SHALL list the
Grading visit and neither drop-off.

**The booking window** - a drop-off SHALL offer only days inside the service's
own horizon as the diary holds it, seeded at 30 days. Grading SHALL hold no
setting of its own for it.

**Every message is the submission's** - the diary SHALL be given no address for
a drop-off and SHALL send nothing about it. The submission SHALL send the
booked, moved, cancelled, missed and day-before messages itself; what each one
carries is `grade10-site/grading/collector-notifications`.

#### Scenario: grade10-site-grading-dropoff-booking-SC-01 - The booking surface lists the visit and neither drop-off
**Serves:** grade10-site-grading-dropoff-booking-US-05 - a collector who books at the shop's own booking page rather than from a list

- **WHEN** a collector opens the shop's booking page
- **THEN** the Grading visit is listed
- **AND** neither the Grading drop-off nor its Bulk variant is offered there

#### Scenario: grade10-site-grading-dropoff-booking-SC-02 - The drop-off is booked and only grading writes to the collector
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector booking the visit their cards are handed in on

- **WHEN** a submission books its drop-off
- **THEN** the collector is sent the booked message by the submission
- **AND** the diary sends nothing about that visit

#### Scenario: grade10-site-grading-dropoff-booking-SC-03 - A day past the service's horizon is not offered
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector picking the day they will come in

- **GIVEN** a drop-off service whose horizon is 30 days
- **WHEN** the collector looks past the last day inside it
- **THEN** no day beyond the horizon can be picked

### Requirement: The collector books the drop-off from the submission

Booking is the collector's own act on the submission, and it SHALL run in these
steps:

1. Read the shops, and for the chosen shop the days and times the diary has
   free inside the service's horizon.
2. Take the service the list asks for: the Bulk drop-off at 20 cards or more,
   and the ordinary drop-off below that.
3. Ask the diary for the picked slot against this submission.
4. Write what the diary answered onto the submission, with the history entry
   that records it.
5. Send the collector the booked message with the visit's calendar file.

**The shop's clock** - days and times SHALL be shown in the shop's own zone,
`Asia/Hong_Kong`.

**A day with nothing free** - SHALL offer no times and SHALL say so, rather
than reading as a day that can be picked.

**The diary refuses in its own words** - a slot it does not offer, a slot
already full, a slot whose resource is not available and a day this collector
has already booked SHALL each be refused by name, another day SHALL be
offered, and the picked day's times SHALL be read again.

**Until the diary answers, and where it cannot** - no day SHALL read as free
while the read is outstanding, and a read that fails SHALL name the failure and
leave no day reading as free.

**Nothing is paid at booking** - booking SHALL take no payment, no deposit and
no card; every amount is taken at the counter after each card is checked and
the agreement is signed.

**A booked list that grows** - an edit that takes a booked submission's list,
or the lists on its visit, to 20 cards or more SHALL move the visit to the Bulk
drop-off at the same slot, in one move and without cancelling it first.

#### Scenario: grade10-site-grading-dropoff-booking-SC-04 - A collector books the drop-off from the plan
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector booking the visit their cards are handed in on

- **GIVEN** a submission of 6 cards priced on the sheet it was booked on
- **WHEN** the collector picks the shop, a day inside the horizon and one of
  that day's free times
- **THEN** the submission holds that visit with its day, time and shop
- **AND** the times were read in the shop's own zone
- **AND** nothing was paid, held or deposited

#### Scenario: grade10-site-grading-dropoff-booking-SC-05 - Twenty cards take the longer Bulk visit
**Serves:** grade10-site-grading-dropoff-booking-US-06 - a dealer bringing a long list to the desk

- **GIVEN** a submission of 20 cards
- **WHEN** the collector books its drop-off
- **THEN** the Bulk drop-off is the service booked
- **AND** the visit is named as taking about 45 minutes

#### Scenario: grade10-site-grading-dropoff-booking-SC-06 - A slot taken meanwhile is refused by name
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector picking the day they will come in

- **GIVEN** a collector who has picked a time the diary offered
- **WHEN** the diary answers that the slot is full
- **THEN** the refusal is shown in the diary's own words
- **AND** another day is offered and the picked day's times are read again
- **AND** the submission holds no visit

#### Scenario: grade10-site-grading-dropoff-booking-SC-07 - A day with nothing free offers no times
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector picking the day they will come in

- **WHEN** the collector opens a day the diary has nothing free on
- **THEN** no time is offered for it
- **AND** the day says it has nothing free

#### Scenario: grade10-site-grading-dropoff-booking-SC-08 - The diary cannot be read and no day reads as free
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector picking the day they will come in

- **WHEN** the read of the shops and slots fails
- **THEN** the failure is named
- **AND** no day reads as free and none can be picked

#### Scenario: grade10-site-grading-dropoff-booking-SC-30 - A booked list edited past twenty cards takes the longer visit at the same slot
**Serves:** grade10-site-grading-dropoff-booking-US-06 - a dealer whose list grew after the visit was booked

- **GIVEN** a booked drop-off of 15 cards on one submission
- **WHEN** the collector edits the list to 22 cards and saves it
- **THEN** the visit is the Bulk drop-off at the same day and time
- **AND** it was moved once and never cancelled

### Requirement: The chosen day names the batch the cards leave in

A submission's cards leave in the batch the drop-off day falls into, and the
collector reads that batch before booking.

**The cut-off** - a batch SHALL close at 19:00 on Thursday on the shop's clock,
and the cards in it SHALL leave the shop the next day.

**Beside the picked day** - the day the batch closes and the day the cards
leave SHALL be shown against the day being picked, and again on the booked
page.

**A day at or before the cut-off** - the cards SHALL leave on the day after
that week's cut-off.

**A day past the cut-off** - the next batch's close day and ship day SHALL be
shown instead.

**The estimate runs from the ship day** - the day the cards are expected back
SHALL be counted from the day the batch leaves the shop, never from the day the
visit is booked and never from the day of the visit.

#### Scenario: grade10-site-grading-dropoff-booking-SC-09 - A day before the cut-off names this week's batch
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector who wants to know which batch their cards join

- **GIVEN** a cut-off of Thursday 19:00 on the shop's clock
- **WHEN** the collector picks the Tuesday of that week
- **THEN** the batch named closes that Thursday at 19:00
- **AND** the cards are said to leave the Friday after it

#### Scenario: grade10-site-grading-dropoff-booking-SC-10 - A day past the cut-off names the next batch
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector who wants to know which batch their cards join

- **GIVEN** a cut-off of Thursday 19:00 on the shop's clock
- **WHEN** the collector picks the Friday of that week
- **THEN** the batch named closes the following Thursday
- **AND** the cards are said to leave the day after that

#### Scenario: grade10-site-grading-dropoff-booking-SC-25 - A visit at the cut-off instant is in that week's batch
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector picking the last slot before the cards leave

- **GIVEN** a cut-off of Thursday 19:00 on the shop's clock
- **WHEN** the collector picks that Thursday at 19:00 exactly
- **THEN** the batch named is the one closing at that same instant
- **AND** the cards are said to leave the Friday after it

#### Scenario: grade10-site-grading-dropoff-booking-SC-11 - The day back is counted from the day the cards leave
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector who wants to know when the cards come home

- **GIVEN** a level quoted at a number of weeks back
- **WHEN** the collector picks a drop-off day
- **THEN** the estimated day back is those weeks counted from the day the batch
  leaves the shop
- **AND** it is not counted from the day of the visit or the day it was booked

### Requirement: The booked page says what the visit is and what to bring

The booked page and the booked message carry the same facts, so a collector who
reads either arrives ready.

**The visit as booked** - the day, the time, the shop and its address, a
calendar file, and the ways to move or cancel it.

**How long it takes** - about 20 minutes, and about 45 minutes where the Bulk
drop-off was booked.

**Before you come** - four items, in this order:

1. **The cards, each in a sleeve** - nothing taped shut and nothing the
   collector wants back, because the grader keeps the sleeve.
2. **The list** - staff check each card against it, and it may still change
   until the cards are handed in.
3. **The signature, then the fee** - the agreement is signed on the shop's iPad
   once every card is checked, and only then is the fee paid at the counter,
   with the cover line beside it where the level carries one.
4. **The day the cards leave** - the ship day of the batch the visit falls
   into, and the estimated day back.

**The vault on the same visit** - a card that is not being graded, or one
coming back, SHALL be able to open a vault case at the same counter, and that
case SHALL take the identity check the vault asks for, which grading does not.

#### Scenario: grade10-site-grading-dropoff-booking-SC-12 - The booked page carries the visit, the four items and the calendar file
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector reading what to bring before the visit

- **GIVEN** a submission whose level carries a cover line
- **WHEN** the collector opens the booked page
- **THEN** the day, the time, the shop and its address are shown with a
  calendar file and the ways to move or cancel
- **AND** the four items before you come are shown in order
- **AND** the third item names the fee and the cover line beside it
- **AND** the fourth item names the day the cards leave and the estimated day
  back

#### Scenario: grade10-site-grading-dropoff-booking-SC-13 - A Bulk booking says the visit takes about 45 minutes
**Serves:** grade10-site-grading-dropoff-booking-US-06 - a dealer who needs the desk to have time for every card

- **GIVEN** a submission that booked the Bulk drop-off
- **WHEN** the collector opens the booked page
- **THEN** the visit is said to take about 45 minutes

#### Scenario: grade10-site-grading-dropoff-booking-SC-14 - A card that is not being graded can be vaulted on the same visit
**Serves:** grade10-site-grading-dropoff-booking-US-01 - a collector bringing one card to grade and one to vault

- **WHEN** the collector reads the booked page
- **THEN** it says a vault case can be opened at the same counter
- **AND** it says that case takes the identity check grading itself does not ask
  for

### Requirement: The visit is moved or cancelled any time before it starts

Moving and cancelling are the collector's own acts on the submission page, and
neither costs the list.

**Before it starts** - both SHALL be offered at any moment before the visit's
start time, and neither SHALL be offered once it has started.

**Told either way** - a moved visit and a cancelled one SHALL each send the
collector their own message.

**Moving is one act** - the visit SHALL be moved rather than cancelled and
booked again, so the submission is never left with no visit while it is being
moved.

**Never the visit's own slot** - the picker a move opens SHALL NOT offer back
the slot the visit already holds, since the diary counts that slot taken.

**The list survives a cancellation** - the cards, the sheet the plan was priced
on and the estimate SHALL stay as they were, and the page SHALL offer another
drop-off.

#### Scenario: grade10-site-grading-dropoff-booking-SC-15 - A visit is moved before it starts and the collector is told
**Serves:** grade10-site-grading-dropoff-booking-US-02 - a collector who cannot make the day they booked

- **GIVEN** a submission holding a booked visit that has not started
- **WHEN** the collector moves it to another free slot
- **THEN** the submission holds the new day and time
- **AND** the batch beside the new day is read again
- **AND** the collector is sent the moved message
- **AND** the submission held a visit throughout

#### Scenario: grade10-site-grading-dropoff-booking-SC-16 - A cancelled visit leaves the list as it was
**Serves:** grade10-site-grading-dropoff-booking-US-02 - a collector calling the visit off

- **GIVEN** a submission of 6 cards holding a booked visit
- **WHEN** the collector cancels it
- **THEN** the submission holds no visit and the collector is sent the
  cancelled message
- **AND** the 6 cards, the sheet the plan was priced on and the estimate are
  unchanged
- **AND** the page offers another drop-off

#### Scenario: grade10-site-grading-dropoff-booking-SC-17 - Neither move nor cancel is offered once the visit has started
**Serves:** grade10-site-grading-dropoff-booking-US-02 - a collector opening the page after the slot has begun

- **GIVEN** a booked visit whose start time has passed
- **WHEN** the collector opens the submission page
- **THEN** neither moving nor cancelling the visit is offered

#### Scenario: grade10-site-grading-dropoff-booking-SC-29 - A move never offers the visit's own current slot back
**Serves:** grade10-site-grading-dropoff-booking-US-02 - a collector moving a visit reads only slots other than the one they already hold

- **GIVEN** a submission holding a booked visit that has not started
- **WHEN** the collector opens the picker to move it
- **THEN** the slot the visit already holds is not offered
- **AND** every other free slot is offered as before

### Requirement: A missed visit is closed by the diary and costs nothing but the day

A visit nobody came to is the diary's fact, and the submission hears it rather
than deciding it.

**Grading tells the diary** - after the grace period, grading SHALL tell the
diary the collector did not come (`markOutcome(…, "no_show", …)`), the same
shape the vault's `sweepNoShows` already takes for consistency across
products; the shop's diary console may also close a visit nobody started,
and whichever side tells it first is the fact the other reads.

**Heard within the hour** - the submission SHALL read that outcome within an
hour of the close, drop the visit from the page and send the missed message.

**The list survives** - the cards, the sheet the plan was priced on and the
estimate SHALL stay exactly as they were, and a missed visit SHALL end no
submission and no plan.

**Book again** - the page SHALL offer another drop-off.

**The plan's clock restarts** - a visit that ends without a hand-in, missed
or cancelled, SHALL restart the plan's own clock from the day it ended, for
every submission the visit carried, a joined one too: `plan_expiry_days`
counted from there, never from the day the plan was first kept. A visit that
ends without a hand-in spends the slot, not the plan's own chance to book
again.

#### Scenario: grade10-site-grading-dropoff-booking-SC-18 - A visit nobody started is closed and the collector hears within the hour
**Serves:** grade10-site-grading-dropoff-booking-US-03 - a collector who did not make it to the shop

- **GIVEN** a booked visit whose start time has passed with nobody at the desk
- **WHEN** the shop's diary console closes it as missed
- **THEN** within the hour the submission holds no visit
- **AND** the collector is sent the missed message

#### Scenario: grade10-site-grading-dropoff-booking-SC-26 - The page reads the visit as booked until the diary answers
**Serves:** grade10-site-grading-dropoff-booking-US-03 - a collector opening the page in the hour after the slot they missed

- **GIVEN** a booked visit whose start time has passed and which the shop's
  diary console has not yet closed
- **WHEN** the collector opens the submission page
- **THEN** the submission still holds that visit
- **AND** no missed message has been sent

#### Scenario: grade10-site-grading-dropoff-booking-SC-19 - A missed visit leaves the list and the estimate as they were
**Serves:** grade10-site-grading-dropoff-booking-US-03 - a collector booking again after a missed day

- **GIVEN** a submission of 6 cards whose visit was missed
- **WHEN** the collector opens the submission page
- **THEN** the 6 cards, the sheet the plan was priced on and the estimate are
  unchanged
- **AND** another drop-off is offered

#### Scenario: grade10-site-grading-dropoff-booking-SC-28 - A missed visit restarts the plan's clock from the day of the miss
**Serves:** grade10-site-grading-dropoff-booking-US-03 - a collector who missed a visit weeks into their plan

- **GIVEN** a plan kept 25 days ago, `plan_expiry_days` 30, whose visit was
  missed today
- **WHEN** the plan expiry sweep runs 30 days after the plan was kept, 5 days
  from today
- **THEN** the plan has not expired
- **AND** it expires `plan_expiry_days` after today, not `plan_expiry_days`
  after the day it was first kept

#### Scenario: grade10-site-grading-dropoff-booking-SC-31 - A cancelled visit restarts the plan's clock from the day of the cancel
**Serves:** grade10-site-grading-dropoff-booking-US-02 - a collector who called the visit off weeks into their plan

- **GIVEN** a plan kept 25 days ago, `plan_expiry_days` 30, whose visit the
  collector cancelled today
- **WHEN** the plan expiry sweep runs 30 days after the plan was kept, 5 days
  from today
- **THEN** the plan has not expired
- **AND** it expires `plan_expiry_days` after today, not `plan_expiry_days`
  after the day it was first kept

### Requirement: One visit holds a second submission

A collector whose cards need two levels makes one trip: the first submission
owns the visit and the second is listed under it.

**The first owns it** - where the same collector already holds a booked
drop-off, a second submission SHALL join that visit rather than book its own,
and SHALL be offered no picker.

**Read through the owner** - the joining submission's page SHALL show the
owner's day, time and shop.

**Sized for both lists** - two lists that pass 20 cards together SHALL take the
Bulk drop-off, the owner's visit moved to that service at the same slot, in one
move and without being cancelled first.

**Detached with the owner** - a visit the owner cancels or misses SHALL leave
every joining submission with no visit, each told and each offered another
drop-off, with its cards and its estimate as they were.

#### Scenario: grade10-site-grading-dropoff-booking-SC-20 - A second submission joins the drop-off the first one booked
**Serves:** grade10-site-grading-dropoff-booking-US-04 - a collector whose cards need two levels on one trip

- **GIVEN** a collector holding a booked drop-off on one submission
- **WHEN** they reach the booking step on a second submission
- **THEN** no picker is offered and the second submission is listed under that
  visit
- **AND** its page shows the same day, time and shop

#### Scenario: grade10-site-grading-dropoff-booking-SC-21 - Two lists passing twenty cards take the longer visit at the same slot
**Serves:** grade10-site-grading-dropoff-booking-US-04 - a collector whose two lists fill the desk

- **GIVEN** a booked drop-off of 12 cards
- **WHEN** a second submission of 9 cards joins it
- **THEN** the visit is the Bulk drop-off at the same day and time
- **AND** it was moved once and never cancelled

#### Scenario: grade10-site-grading-dropoff-booking-SC-22 - The owner cancels and every joining submission is told
**Serves:** grade10-site-grading-dropoff-booking-US-04 - a collector who called off the submission that owned the visit

- **GIVEN** a visit owned by one submission and joined by another
- **WHEN** the owner cancels the visit
- **THEN** the joining submission holds no visit
- **AND** its collector is told and offered another drop-off
- **AND** its cards and its estimate are unchanged

#### Scenario: grade10-site-grading-dropoff-booking-SC-27 - The owner misses the visit and every joining submission is detached
**Serves:** grade10-site-grading-dropoff-booking-US-04 - a collector whose trip ended with the submission that owned the visit

- **GIVEN** a visit owned by one submission and joined by another
- **WHEN** the owner's visit is closed as missed
- **THEN** the joining submission holds no visit
- **AND** its collector is told and offered another drop-off
- **AND** its cards and its estimate are unchanged

### Requirement: A walk-in books the Grading visit and lists the cards at the counter

A collector who does not want to list cards on their phone still books a slot.

**Booked with a name and an email** - the customer-bookable Grading visit SHALL
be bookable from the shop's own booking page with a name and an email and no
list of cards.

**No submission on it** - that visit SHALL carry no submission; grading SHALL
neither read its outcome nor send any message about it.

**Listed at the counter** - the cards SHALL be written with the collector at
the desk, and the submission SHALL be created and handed in from there.

#### Scenario: grade10-site-grading-dropoff-booking-SC-23 - A walk-in books the Grading visit with a name and an email
**Serves:** grade10-site-grading-dropoff-booking-US-05 - a collector who books before listing anything

- **WHEN** a collector books the Grading visit with a name and an email
- **THEN** the visit is held with no list of cards
- **AND** it carries no submission

#### Scenario: grade10-site-grading-dropoff-booking-SC-24 - The walk-in's cards are listed at the desk and grading says nothing about the visit
**Serves:** grade10-site-grading-dropoff-booking-US-05 - a collector listing their cards with staff at the counter

- **GIVEN** a collector arriving on a booked Grading visit with no list
- **WHEN** staff write the cards with them at the desk
- **THEN** the submission is created there and handed in from there
- **AND** grading sent no booked, moved, cancelled or missed message about that
  visit
