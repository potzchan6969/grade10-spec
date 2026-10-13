# grade10-site/grading/submission-plan Specification

## Purpose

What a submission holds and what it costs, worked out on a collector's phone
before anything is booked: the cards and their declared values, the grader and
the level those values leave open, the estimate, and the review the collector
agrees to.

A plan needs no account: it lives under the email given and is priced on the
fee sheet it is booked on. The visit it is handed in on is
`grade10-site/grading/dropoff-booking`; what happens to it after hand-in is
`grade10-site/grading/submission-lifecycle`.

## Feature set

- The home and fee sheet
  - What grading is: the four steps, and the two ways in — start a submission,
    or book a drop-off without a list
  - One sheet per grader: each level's ceiling, cards a submission, fee a
    card, cover rate where it carries one, and the weeks back
  - Above the top ceiling: a card worth more than any level takes is sent to
    the counter rather than priced
- Listing the cards
  - Matched or kept as typed: a card is matched in the shop's card price
    reference, or kept in the collector's own words with no reference
  - The declared value: asked for on every card, because it is what picks the
    level and what the cover is bought against
  - Reference sales beside it: recent sales at ungraded, PSA 9 and PSA 10, as
    a reference and never a valuation
  - A minimum grade: a card the collector will not have slabbed below a grade,
    the fee applying either way
  - The reference out of reach: the list is still written and the value still
    asked for, so an outage delays nothing
- Pasting a list
  - One card a line: name, set and number, then the value
  - What the paste made of each line: matched, kept as typed, without a value,
    above the ceiling, or skipped as a card already listed
  - Nothing silently dropped: every line is accounted for before it is added
- Caps and a second submission
  - Cards a submission: a column of the fee sheet, not a rule of its own
  - Bulk's floor and ceiling: the level a long list takes, and the count that
    closes every other one
  - A second submission: a card above the level's ceiling goes in another
    submission on the same drop-off, rather than closing the list
- The grader and the level
  - One grader, one level: every card in a submission goes to the same one
  - Open, or closed with its reason: the named card declared above the
    ceiling, or the count that closes it
  - The estimate: cards times the fee a card, the cover line per card where
    the level carries one, and the return date counted from the day the batch
    leaves
  - Levels as data: a grader whose figures nobody has supplied still shows its
    levels
- The review before booking
  - The schedule: every card as it will be handed in, with its declared value
    and its cover line
  - The totals: declared in total, the fee at the counter, and the cover
    beside it
  - The upcharge warning: per card, the level the grader would move it to, the
    sheet's difference due at the counter, and what the higher level costs now
  - Good to know: the five lines the agreement will later print, read before
    booking rather than on the iPad
  - The consent: the collection statement, ticked before the drop-off is
    booked
  - The tick kept with the plan: a plan kept from a ticked review is asked
    nothing more, and one saved unticked is asked for it on its page before a
    drop-off is picked or joined
  - The level kept with the plan: a plan kept before a level is picked is
    offered no drop-off, and is asked for a level through the list's edit
- Priced at booking
  - The sheet is pinned: a plan is priced on the sheet it was booked on, and
    the agreement prints those figures
  - A changed sheet: reaches plans not yet booked and no others
- Keeping the plan
  - Under the email given: the plan is kept there and its link is mailed once
    by the daily sweep while it stays unbooked
  - Any device, no account: the link opens the plan wherever it is read
  - Signing in lists them all: the same email and no password lists every
    submission, open and closed
  - Nudged, then let go: one reminder, then the plan expires with nothing paid
    and nothing owed

## ADDED Requirements

### Requirement: The grading home says what grading is and offers two ways in

The first page of grading, read by a collector with no account and by one who
has signed in.

**What grading is** - the home SHALL state the four steps of a submission,
plan, drop-off, grading and collection, above everything else.

**The sheet** - the home SHALL show the fee sheet of every grader whose levels
are active.

**Two ways in** - the home SHALL offer starting a submission and booking a
drop-off without a list, and SHALL offer neither behind an account.

**Signed in** - the home SHALL additionally list every submission planned
under the signed-in collector's email, open and closed, each opening its own
page, and SHALL say that there is none where the collector has planned none.

**Still reading** - the home SHALL list nothing while it is still reading, and
SHALL NOT read as having none.

**Unreadable** - where the submissions cannot be read the home SHALL say so in
its own words and list nothing.

<!-- trace:scenario id=g10.grading-submission-plan.SC-yns rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-01 - The first visit prices grading before a name is given
**Serves:** grade10-site-grading-submission-plan-US-01 - a collector who has never used the shop reads the price before giving a name

- **WHEN** a collector who is not signed in opens the grading home
- **THEN** the four steps, the fee sheet, Start a submission and Book a
  drop-off without a list are all shown
- **AND** neither way in asks for an account

<!-- trace:scenario id=g10.grading-submission-plan.SC-90m rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-02 - A home still reading says nothing about how many there are
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector opening the home to find a plan they left

- **WHEN** a signed-in collector opens the home and their submissions have not
  been read yet
- **THEN** no submission is listed
- **AND** the page does not say they have none

<!-- trace:scenario id=g10.grading-submission-plan.SC-p75 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-03 - A home that cannot read the submissions says so
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector opening the home to find a plan they left

- **WHEN** a signed-in collector opens the home and their submissions cannot be
  read
- **THEN** the failure is shown in the page's own words
- **AND** no submission is listed

<!-- trace:scenario id=g10.grading-submission-plan.SC-hpb rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-46 - A collector who has planned nothing is told so
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector signing in to find a submission they have never made

- **GIVEN** a signed-in collector with no submission under their email
- **WHEN** they open the grading home
- **THEN** the home says they have none
- **AND** starting a submission is offered

<!-- trace:scenario id=g10.grading-submission-plan.SC-z5h rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-47 - Every grader with active levels shows its own sheet
**Serves:** grade10-site-grading-submission-plan-US-01 - a collector comparing what two graders charge before starting anything

- **GIVEN** three graders whose levels are active
- **WHEN** a collector reads the fee sheet on the home
- **THEN** all three graders are offered
- **AND** the sheet read is the levels of the grader chosen

### Requirement: One fee sheet per grader, one row per level

The sheet is what a submission is priced on. It is a record per grader and
level that the console holds, and the pages read it rather than carrying
figures of their own.

**Columns** - each level SHALL carry the declared value it takes up to, the
cards a submission it allows, the fee a card, a cover rate or none, and the
weeks back.

**Cover** - a level carrying a cover rate SHALL price cover per card as that
rate of the card's declared value, rounded half-up to the minor unit; a level
carrying none SHALL show no cover line anywhere.

**Currency** - every figure on the sheet SHALL be HKD.

**Levels as data** - a grader whose figures nobody has supplied SHALL still
show its levels, marked as carrying no figures, and SHALL NOT be offered for a
submission.

**Above the top ceiling** - a card declared above every level's ceiling SHALL
be sent to the counter rather than priced.

**Wherever the sheet is read** - the note that such a card is asked about at
the counter or on WhatsApp SHALL be part of the sheet and SHALL be shown
wherever the sheet is shown, the signed-out home included.

The sheet opens on these figures, in HKD minor units:

| Level | Declared value up to | Cards a submission | Fee a card | Cover a card | Back in about |
| --- | --- | --- | --- | --- | --- |
| Value | 390000 | 20 | 25000 | none | 8 weeks |
| Regular | 1170000 | 20 | 60000 | none | 5 weeks |
| Express | 1950000 | 20 | 120000 | 150 basis points of the declared value | 3 weeks |
| Super Express | 3900000 | 20 | 240000 | 150 basis points of the declared value | 2 weeks |
| Bulk | 150000 | 20 to 100 | 18000 | none | 10 weeks |

<!-- trace:scenario id=g10.grading-submission-plan.SC-d03 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-04 - The sheet reads as a row per level
**Serves:** grade10-site-grading-submission-plan-US-01 - a collector reading the price sheet before starting anything

- **WHEN** a collector reads the fee sheet of a grader whose figures are
  supplied
- **THEN** every level shows its declared value up to, its cards a submission,
  its fee a card and its weeks back

<!-- trace:scenario id=g10.grading-submission-plan.SC-48z rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-05 - Only Express and Super Express carry a cover rate
**Serves:** grade10-site-grading-submission-plan-US-01 - a collector reading what the cover line costs before starting anything

- **WHEN** a collector reads the sheet that opens on the figures above
- **THEN** Express and Super Express show a cover rate of 150 basis points of
  the declared value
- **AND** Value, Regular and Bulk show no cover line

<!-- trace:scenario id=g10.grading-submission-plan.SC-6qn rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-06 - A grader nobody has priced still shows its levels
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector picking between graders

- **GIVEN** a grader whose levels carry no figures
- **WHEN** a collector reads its sheet
- **THEN** its levels are listed and marked as carrying no figures
- **AND** none of them can be picked for a submission

<!-- trace:scenario id=g10.grading-submission-plan.SC-a00 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-07 - A card worth more than any level takes goes to the counter
**Serves:** grade10-site-grading-submission-plan-US-01 - a collector with a card worth more than the sheet prices

- **WHEN** a collector declares a card above every level's ceiling
- **THEN** the card is not priced
- **AND** the collector is told to ask at the counter

<!-- trace:scenario id=g10.grading-submission-plan.SC-e76 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-48 - The signed-out home's sheet names the counter for a card above the top ceiling
**Serves:** grade10-site-grading-submission-plan-US-01 - a collector with a card worth more than the sheet prices, reading the home before giving a name

- **WHEN** a collector who is not signed in reads the fee sheet on the grading
  home
- **THEN** the sheet says a card declared above the top level's ceiling is
  asked about at the counter or on WhatsApp
- **AND** the same note is shown wherever the sheet is read

### Requirement: A collector plans a submission in three steps

A submission is planned on a phone, in three steps, and nothing is paid or
signed in any of them.

1. The cards: the collector's name, email and phone, then one block per card
   with its name, its set, its declared value and any minimum grade.
2. The service: one grader and one level for the whole list, with the estimate
   the level gives.
3. Book: the schedule, the totals, the upcharge warning, the good-to-know
   lines and the consent, then the drop-off is booked or the plan is kept for
   later.

**The rail** - the three steps SHALL be shown throughout, with the step in
progress marked, the steps behind it marked done and the steps ahead marked as
still to come.

**Contact details** - a signed-in collector's name, email and phone SHALL be
filled in from their account and SHALL remain changeable for this submission
alone; a collector who is not signed in SHALL be asked for them.

**Starting** - starting a submission SHALL open the cards step with no card on
it, offering both adding a card and pasting a list.

**Removing a card** - a card on the list SHALL be removable, and the cards left
SHALL be unchanged.

<!-- trace:scenario id=g10.grading-submission-plan.SC-prc rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-08 - The wizard shows which step the collector is on
**Serves:** grade10-site-grading-submission-plan-US-02 - a collector working through the three steps with a handful of cards

- **WHEN** a collector reaches the service step
- **THEN** the cards step reads as done, the service step reads as in progress
  and the book step reads as still to come

#### Scenario: grade10-site-grading-submission-plan-SC-09 - Contact details are filled in for a signed-in collector
**Serves:** `grade10-site-grading-submission-plan-US-02`, `grade10-site-grading-submission-plan-US-06` - a collector starting the list signed in, and one starting it without an account

- **WHEN** a signed-in collector opens the cards step
- **THEN** their name, email and phone are filled in from their account and can
  be changed for this submission alone
- **AND** a collector who is not signed in is asked for all three

<!-- trace:scenario id=g10.grading-submission-plan.SC-ku6 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-49 - Starting a submission opens the cards step with nothing on it
**Serves:** grade10-site-grading-submission-plan-US-02 - a collector starting their list from the home

- **WHEN** a collector starts a submission from the home
- **THEN** the cards step opens with no card listed
- **AND** adding a card and pasting a list are both offered

<!-- trace:scenario id=g10.grading-submission-plan.SC-7xf rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-50 - A card removed leaves the rest of the list alone
**Serves:** grade10-site-grading-submission-plan-US-02 - a collector taking a card back off the list they are writing

- **GIVEN** a list of two cards
- **WHEN** the collector removes one of them
- **THEN** that card is off the list
- **AND** the other card is listed as it was

### Requirement: A card is matched in the card price reference or kept in the collector's own words

Each card is named against the shop's card price reference, and a card the
reference does not answer for is still listed.

**Matched** - a matched card SHALL carry the reference's name for it, which
names its set, and SHALL show recent sales at ungraded, PSA 9 and PSA 10
beside it; its set and number stay as the collector typed them.

**Reference sales** - those sales SHALL be shown as a reference and SHALL never
be described as a valuation of the card.

**Kept as typed** - a card the reference does not answer for SHALL be kept in
the name the collector typed, with no reference sales beside it.

**However the card arrived** - a card added by hand and a card read from a
paste SHALL be matched the same way and SHALL carry the same outcomes: matched,
kept as typed, or without a value.

**The reference out of reach** - where the reference cannot be asked at all,
every card SHALL be kept as typed and marked as unasked rather than unmatched,
the declared value SHALL still be asked for, and no step SHALL wait on the
reference.

<!-- trace:scenario id=g10.grading-submission-plan.SC-bph rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-10 - A matched card carries the reference's name and its sales
**Serves:** grade10-site-grading-submission-plan-US-02 - a collector adding a card by name and reading what it sells for

- **WHEN** a collector types a name the card price reference answers for
- **THEN** the card carries the reference's name for it, and the set and
  number the collector typed
- **AND** recent sales at ungraded, PSA 9 and PSA 10 are shown beside it as a
  reference and not as a valuation

<!-- trace:scenario id=g10.grading-submission-plan.SC-r4q rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-11 - A name the reference does not answer for is kept
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector listing a card the catalogue does not hold

- **WHEN** a collector types a name the card price reference does not answer for
- **THEN** the card is listed in the name as typed
- **AND** no reference sales are shown for it

<!-- trace:scenario id=g10.grading-submission-plan.SC-0wj rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-12 - The reference out of reach delays nothing
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector listing cards while the catalogue cannot be asked

- **GIVEN** the card price reference cannot be asked
- **WHEN** a collector adds cards
- **THEN** every card is kept as typed and marked as unasked rather than
  unmatched
- **AND** the declared value is still asked for and the list can be finished

<!-- trace:scenario id=g10.grading-submission-plan.SC-w4r rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-51 - A card added by hand is matched the way a pasted line is
**Serves:** grade10-site-grading-submission-plan-US-02 - a collector adding by hand a card the reference does not answer for

- **WHEN** a collector adds a card by hand under a name the reference does not
  answer for
- **THEN** the card is kept in the name as typed, as a pasted line would be
- **AND** its declared value is asked for on the card

### Requirement: Every card carries a declared value, and may carry a minimum grade

The declared value is what picks the level and what cover is bought against, so
no card goes without one.

**Asked on every card** - a declared value SHALL be asked for on every card, as
an integer count of HKD minor units.

**No cards, no step** - leaving the cards step SHALL be refused while the list
holds no card.

**No value, no step** - leaving the cards step SHALL be refused while any card
carries no declared value, and the refusal SHALL name how many cards are
without one.

**Minimum grade** - a card MAY carry a minimum grade, meaning it is not to be
encapsulated below that grade.

**The fee either way** - a minimum grade SHALL NOT change what the card costs,
and this SHALL be said where the minimum grade is set.

**Carried to the review** - a card's minimum grade SHALL be shown beside it on
the review's schedule.

<!-- trace:scenario id=g10.grading-submission-plan.SC-fik rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-13 - A card with no declared value holds the step
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector whose pasted lines came in without values

- **GIVEN** a list of four cards, one of which carries no declared value
- **WHEN** the collector tries to leave the cards step
- **THEN** it is refused
- **AND** the refusal names that one card is without a value

<!-- trace:scenario id=g10.grading-submission-plan.SC-7h7 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-14 - A minimum grade is carried and costs nothing
**Serves:** grade10-site-grading-submission-plan-US-02 - a collector who will not have a card slabbed below PSA 9

- **WHEN** a collector sets a minimum grade of PSA 9 on a card
- **THEN** the card carries that minimum grade on the review's schedule
- **AND** the fee for that card is the level's fee a card, unchanged

<!-- trace:scenario id=g10.grading-submission-plan.SC-fp6 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-52 - A list with no card on it holds the step
**Serves:** grade10-site-grading-submission-plan-US-02 - a collector who opens the wizard and lists nothing

- **GIVEN** a plan whose list holds no card
- **WHEN** the collector tries to leave the cards step
- **THEN** it is refused

### Requirement: A pasted list accounts for every line

A long list is pasted one card a line - name, set and number, then the value -
and the collector is told what became of every line before any card is added.

**Five outcomes** - each line SHALL report as exactly one of: matched in the
reference, kept as typed, without a value, above the level's ceiling, or
skipped because the card is already listed.

**Counted back** - the lines read SHALL equal the five outcomes' counts added
together, and the counts SHALL be shown before the cards are added.

**Without a value** - a line read without a value SHALL be added and its value
asked for on the card, never discarded.

**Skipped** - a line naming a card already on the list SHALL be skipped and
counted as skipped.

**Over twenty lines** - a paste of more than 20 lines SHALL say that Bulk is
the only level that will be open, with its fee a card, its ceiling, its weeks
back, its cap of 100 cards and the longer drop-off it takes.

**The reference out of reach** - where the reference cannot be asked, every
line SHALL be marked as unasked and the cards SHALL still be addable.

**Nothing read** - a paste holding no line SHALL report no outcome and SHALL
offer nothing to add.

**Which ceiling** - the ceiling a line is read against SHALL be the highest
ceiling still open to the list: the grader's top ceiling, or Bulk's where the
count has already left Bulk the only open level.

**Above the top ceiling** - a line declared above the grader's top ceiling
SHALL be sent to the counter rather than named for a second submission.

<!-- trace:scenario id=g10.grading-submission-plan.SC-j6g rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-15 - A paste reports what became of every line
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector pasting many cards at once

- **WHEN** a collector pastes a list
- **THEN** each line is reported as matched, kept as typed, without a value,
  above the level's ceiling, or skipped
- **AND** the counts are shown before the cards are added

<!-- trace:scenario id=g10.grading-submission-plan.SC-40a rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-16 - A line naming a card already listed is skipped
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector pasting a list that repeats a card they already added

- **GIVEN** a list already holding one card
- **WHEN** a paste names that same card again
- **THEN** the line is skipped and counted as skipped
- **AND** the card appears once on the list

#### Scenario: grade10-site-grading-submission-plan-SC-17 - Nothing is dropped between the paste and the list
**Serves:** Pasting a list - every line a collector pastes is counted back to them before any card is added

- **WHEN** a paste of 30 lines is read
- **THEN** the matched, kept as typed, without a value, above the ceiling and
  skipped counts add up to 30

<!-- trace:scenario id=g10.grading-submission-plan.SC-34a rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-18 - A paste still works while the reference is out of reach
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector pasting a list while the catalogue cannot be asked

- **GIVEN** the card price reference cannot be asked
- **WHEN** a collector pastes a list
- **THEN** every line is marked as unasked rather than kept as typed
- **AND** the cards can still be added

<!-- trace:scenario id=g10.grading-submission-plan.SC-22f rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-19 - A paste over twenty lines names Bulk and its visit
**Serves:** grade10-site-grading-submission-plan-US-04 - a dealer pasting a box of cards

- **WHEN** a collector pastes 40 lines
- **THEN** the paste says Bulk is the only level that will be open, at 18000
  HKD minor units a card, up to 150000 HKD minor units a card declared, back in
  about 10 weeks, up to 100 cards
- **AND** it says the drop-off takes the longer visit

<!-- trace:scenario id=g10.grading-submission-plan.SC-oiv rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-53 - A paste with nothing in it adds nothing
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector who opens the paste and pastes nothing

- **GIVEN** a paste holding no line
- **WHEN** the collector reads it
- **THEN** no outcome is reported and nothing is offered to add

<!-- trace:scenario id=g10.grading-submission-plan.SC-ful rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-54 - A pasted line above every level's ceiling goes to the counter
**Serves:** grade10-site-grading-submission-plan-US-03 - a collector pasting a card worth more than the sheet prices, before a level is picked

- **GIVEN** a grader whose top ceiling is 3900000 HKD minor units
- **WHEN** a line declaring 4200000 HKD minor units is pasted
- **THEN** the line reports above the ceiling
- **AND** the collector is told to ask at the counter rather than named a
  second submission

### Requirement: Cards a submission is a column of the fee sheet

How many cards one submission holds is the level's own figure, not a rule of
its own.

**The column** - the cards a submission a level allows SHALL be read from the
fee sheet's cards-a-submission column for that level.

**The floor** - a level whose column names a floor SHALL close while the list
holds fewer cards than that floor.

**More than twenty** - a list of more than 20 cards SHALL leave Bulk as the
only open level, because every other level's column tops out at 20; a list of
exactly 20 SHALL leave every level open.

**The ceiling** - a card added past the highest cards-a-submission any level
allows SHALL be refused, and the refusal SHALL say that the rest go in a second
submission on another day.

<!-- trace:scenario id=g10.grading-submission-plan.SC-g1c rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-20 - The twenty-first card leaves Bulk the only level open
**Serves:** grade10-site-grading-submission-plan-US-04 - a dealer whose box passes twenty cards

- **GIVEN** a list of 20 cards
- **WHEN** a twenty-first card is added
- **THEN** Value, Regular, Express and Super Express are closed by the count
- **AND** Bulk is open

<!-- trace:scenario id=g10.grading-submission-plan.SC-rjw rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-21 - The card past the cap is refused, not dropped from a list
**Serves:** grade10-site-grading-submission-plan-US-04 - a dealer with more cards than one submission takes

- **GIVEN** a list of 100 cards at Bulk
- **WHEN** a hundred and first card is added
- **THEN** it is refused
- **AND** the refusal says the rest go in a second submission on another day

<!-- trace:scenario id=g10.grading-submission-plan.SC-8gr rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-55 - Twenty cards leave every level open
**Serves:** grade10-site-grading-submission-plan-US-04 - a dealer whose list stops at the twenty the sheet allows

- **GIVEN** a list of 20 cards, none declared above any level's ceiling
- **WHEN** the collector reads the levels
- **THEN** Value, Regular, Express, Super Express and Bulk are all open

<!-- trace:scenario id=g10.grading-submission-plan.SC-diu rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-56 - The hundredth card is added at Bulk's cap
**Serves:** grade10-site-grading-submission-plan-US-04 - a dealer filling one submission to the cap

- **GIVEN** a list of 99 cards at Bulk
- **WHEN** a hundredth card is added
- **THEN** it is added to the list
- **AND** nothing is said about a second submission

### Requirement: A card above the level's ceiling goes in a second submission on the same drop-off

A card worth more than the level takes does not close the list; it is named and
moved.

**Named** - a card declared above the chosen level's ceiling SHALL be named,
with its declared value, wherever the list is shown.

**The same visit** - the collector SHALL be told that the named card goes in a
second submission handed in on the same drop-off.

**The rest carry on** - the remaining cards SHALL stay on the list at the
chosen level.

<!-- trace:scenario id=g10.grading-submission-plan.SC-46m rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-22 - A card above Bulk's ceiling is moved, not refused
**Serves:** grade10-site-grading-submission-plan-US-04 - a dealer whose box holds one card worth more than Bulk takes

- **GIVEN** a list of 40 cards at Bulk
- **WHEN** one of them is declared at 400000 HKD minor units, above Bulk's
  ceiling of 150000 HKD minor units
- **THEN** that card is named with its declared value
- **AND** the collector is told it goes in a second submission on the same
  drop-off
- **AND** the other 39 cards stay on the list at Bulk

### Requirement: One submission is one grader and one level

Every card in a submission goes to the same grader at the same level, because
that is what the shop can send and the grader can invoice as one.

**One of each** - a submission SHALL carry exactly one grader and exactly one
level for every card on it.

**Open** - a level SHALL be open when every declared value on the list is at or
below its ceiling and the card count is inside its cards-a-submission column.

**What an open level reads** - an open level SHALL read its ceiling, its fee a
card, its weeks back, and its cover rate where it carries one.

**Closed by a value** - a level closed because a card is declared above its
ceiling SHALL name that card.

**Closed by a count** - a level closed because the list is too long or too
short SHALL name the count that closes it.

**All closed** - where every level is closed by a card above the top ceiling,
the collector SHALL be told to ask at the counter and SHALL NOT be able to
leave the service step.

**None picked** - no level picked SHALL show no estimate and SHALL NOT let the
collector leave the service step.

<!-- trace:scenario id=g10.grading-submission-plan.SC-a3o rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-23 - One grader and one level cover the whole list
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector picking the grader and the level for their list

- **WHEN** a collector picks PSA at Regular for a list of four cards
- **THEN** all four cards are on that submission at PSA Regular
- **AND** no card on it carries another grader or another level

<!-- trace:scenario id=g10.grading-submission-plan.SC-9yc rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-24 - A level closed by a declared value names the card
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector working out why a level is not offered

- **GIVEN** a list of four cards whose highest declared value is 850000 HKD
  minor units
- **WHEN** the collector reads the levels
- **THEN** Value is closed and names the card declared above its ceiling of
  390000 HKD minor units
- **AND** Regular is open

<!-- trace:scenario id=g10.grading-submission-plan.SC-wfm rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-25 - A level closed by the count names the count
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector working out why Bulk is not offered

- **GIVEN** a list of four cards
- **WHEN** the collector reads the levels
- **THEN** Bulk is closed and names that it starts at 20 cards and the list
  holds four

<!-- trace:scenario id=g10.grading-submission-plan.SC-bzg rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-26 - Every level closed sends the collector to the counter
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector whose card is worth more than every level takes

- **GIVEN** a list holding a card declared at 5000000 HKD minor units
- **WHEN** the collector reads the levels
- **THEN** every level is closed
- **AND** the collector is told to ask at the counter and cannot leave the
  service step

<!-- trace:scenario id=g10.grading-submission-plan.SC-xoj rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-27 - No level picked, no estimate
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector who has not yet picked a level

- **WHEN** a collector has picked a grader but no level
- **THEN** no estimate is shown
- **AND** the collector cannot leave the service step

<!-- trace:scenario id=g10.grading-submission-plan.SC-qbf rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-57 - An open level reads its ceiling, its fee and its weeks back
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector reading what each open level takes and costs

- **GIVEN** a list of four cards whose highest declared value is 850000 HKD
  minor units
- **WHEN** the collector reads the open levels
- **THEN** Regular reads its ceiling of 1170000 HKD minor units, its fee of
  60000 HKD minor units a card and its 5 weeks back
- **AND** Express reads its cover rate beside the same three

### Requirement: The estimate is the fee a card times the cards, with the cover line where the level carries one

The estimate is what the collector will pay at the counter, and the date the
cards are expected back.

**The fee** - the estimate SHALL be the number of cards times the level's fee a
card.

**The cover line** - where the level carries a cover rate, the estimate SHALL
carry a cover line per card, that rate of the card's declared value rounded
half-up to the minor unit, and SHALL add the cover lines to the total.

**No cover** - where the level carries no cover rate, the estimate SHALL carry
no cover line.

**The return date** - the estimate SHALL give the level's weeks back, counted
from the day the batch leaves and never from the day the plan is made.

**Where it is paid** - the estimate SHALL say that everything on it is paid at
the counter.

<!-- trace:scenario id=g10.grading-submission-plan.SC-vy8 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-28 - Four cards at Regular estimate at four times the fee
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector reading what their list will cost

- **GIVEN** a list of four cards at PSA Regular
- **WHEN** the estimate is read
- **THEN** it reads 240000 HKD minor units, being 4 times 60000 HKD minor units
- **AND** it carries no cover line

<!-- trace:scenario id=g10.grading-submission-plan.SC-w4u rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-29 - A covered level prices cover per card on the declared value
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector reading what cover adds at Express

- **GIVEN** one card declared at 850000 HKD minor units at PSA Express
- **WHEN** the estimate is read
- **THEN** the cover line for that card is 12750 HKD minor units
- **AND** the total is 132750 HKD minor units

<!-- trace:scenario id=g10.grading-submission-plan.SC-w6e rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-30 - The weeks back are counted from the day the cards leave
**Serves:** grade10-site-grading-submission-plan-US-05 - a collector reading when the cards come back

- **WHEN** a collector reads the estimate for PSA Regular
- **THEN** it says about 5 weeks
- **AND** it says the 5 weeks are counted from the day the batch leaves the
  shop

### Requirement: The review states the schedule, the totals and the upcharge before anything is booked

The last step of the wizard is the whole submission read back, so the collector
agrees to the terms here rather than meeting them on the counter's iPad.

**The schedule** - the review SHALL list every card as it will be handed in,
with its declared value, its minimum grade where it carries one, and its cover
line where the level carries cover.

**The totals** - the review SHALL total the declared value, the fee due at the
counter, and the cover beside it where the level carries cover.

**The upcharge warning** - for each card whose PSA 10 reference sale is above
the chosen level's ceiling, the review SHALL name the card, the level the
grader would move it to, the difference between the two levels' fees on this
sheet due at the counter before collection, and what the higher level would
cost for that card now.

**One figure** - the difference quoted here SHALL be the figure charged at the
counter.

**The reference rate** - the card price reference's PSA 10 sale is in USD and
the ceilings are in HKD, so the warning SHALL read the sale in HKD at the
reference rate staff set, rounded half-up to the cent, and SHALL compare that
figure with the ceiling. A rate nobody has written SHALL refuse the read that
needs it by name, and no rate SHALL be assumed in its place.

**No warning** - a list with no card whose PSA 10 reference is above the
ceiling SHALL carry no upcharge warning at all.

**Good to know** - the review SHALL state these five lines before the drop-off
is booked:

1. A fee is charged on a card that comes back ungraded; a card the grader would
   not take is refused at the counter and never charged.
2. A card can move up a level, and the difference is told before collection.
3. The return date is an estimate.
4. Nothing is paid or signed before staff have checked each card with the
   collector.
5. Slabs are not shipped back: the collector, or one person they name,
   collects.

**The consent** - the collector SHALL tick the personal information collection
statement, and booking the drop-off SHALL be refused until they have.

**Saving for later** - the statement SHALL gate booking the drop-off alone;
keeping the plan for later SHALL be offered with it unticked, and the plan
SHALL be kept unticked.

**The plan carries its tick** - a kept plan SHALL hold whether its statement
was ticked, and a plan kept from a review whose statement is ticked SHALL be
kept ticked, so its page asks for nothing more. For a plan held unticked, its page SHALL ask for the statement, in
the review's words, before a drop-off is picked or joined, and the booking or
the join SHALL carry that tick and write it on the plan in the same step. A
booking or a join that neither finds the plan ticked nor carries the tick SHALL
be refused by name.

**The plan carries its level** - a plan kept with no level SHALL be offered no
drop-off on its page, which SHALL ask for a level through the list's edit
instead. A booking or a join sent for a plan with no level SHALL be refused by
name before the diary is asked, so no visit is taken and the plan holds no
drop-off.

<!-- trace:scenario id=g10.grading-submission-plan.SC-h3s rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-31 - The review totals the declared value, the fee and the cover
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector reading the whole submission back before booking

- **GIVEN** two cards declared at 850000 and 400000 HKD minor units at PSA
  Express
- **WHEN** the review is read
- **THEN** the declared total reads 1250000 HKD minor units
- **AND** the fee reads 240000 HKD minor units
- **AND** the cover reads 18750 HKD minor units

<!-- trace:scenario id=g10.grading-submission-plan.SC-6u8 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-32 - A card that could grade above the ceiling is warned about per card
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector choosing a level knowing what a high grade would cost

- **GIVEN** a card at PSA Regular whose PSA 10 reference sale is 1500000 HKD
  minor units, above Regular's ceiling of 1170000 HKD minor units
- **WHEN** the review is read
- **THEN** the card is named with Express as the level the grader would move it
  to
- **AND** the difference of 60000 HKD minor units is named as due at the counter
  before collection
- **AND** Express at 120000 HKD minor units a card is named as what the higher
  level would cost now

<!-- trace:scenario id=g10.grading-submission-plan.SC-21y rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-33 - No card above the ceiling, no warning
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector whose cards are all inside the level they picked

- **GIVEN** a list where no card's PSA 10 reference sale is above the chosen
  level's ceiling
- **WHEN** the review is read
- **THEN** no upcharge warning is shown

<!-- trace:scenario id=g10.grading-submission-plan.SC-hym rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-60 - A USD sale is read in HKD at the rate staff set
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector choosing a level knowing what a high grade would cost

- **GIVEN** the reference rate set at 784 HKD minor units to 1 USD
- **AND** a card at PSA Regular whose PSA 10 reference sale is 150000 USD minor
  units
- **WHEN** the review is read
- **THEN** the sale reads 1176000 HKD minor units, above Regular's ceiling of
  1170000 HKD minor units
- **AND** the card is named with Express as the level the grader would move it
  to, and the difference of 60000 HKD minor units as due at the counter before
  collection

<!-- trace:scenario id=g10.grading-submission-plan.SC-8zk rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-34 - The five good-to-know lines are read before booking
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector meeting the agreement's terms before the counter

- **WHEN** a collector reads the review
- **THEN** all five good-to-know lines are shown, in the order above

<!-- trace:scenario id=g10.grading-submission-plan.SC-i18 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-35 - Booking is refused until the statement is ticked
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector agreeing to the collection statement before a visit is taken

- **GIVEN** a review whose collection statement is not ticked
- **WHEN** the collector tries to book the drop-off
- **THEN** it is refused
- **AND** booking is offered again once the statement is ticked

<!-- trace:scenario id=g10.grading-submission-plan.SC-93c rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-58 - Saving the plan for later needs no tick
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector who reads the review and leaves without booking

- **GIVEN** a review whose collection statement is not ticked
- **WHEN** the collector saves the plan to book later
- **THEN** the plan is kept with the statement unticked
- **AND** booking the drop-off is the only thing that was refused

<!-- trace:scenario id=g10.grading-submission-plan.SC-rsr rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-61 - A plan kept unticked asks for the statement before its drop-off
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector picking a plan back up to book its visit

- **GIVEN** a plan saved for later with the collection statement unticked
- **WHEN** the collector opens its page to book the drop-off
- **THEN** the statement is asked for, in the review's words, before any day
  is offered
- **AND** a booking or a join sent for the plan carrying no tick is refused by
  name, and the plan holds no drop-off
- **AND** once the statement is ticked the days are offered, and the booking
  made carries the tick, so the plan holds its drop-off and its tick together

<!-- trace:scenario id=g10.grading-submission-plan.SC-vqr rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-63 - A plan kept with no level asks for one before its drop-off
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector picking up a plan kept before a level was picked

- **GIVEN** a plan kept part way through the wizard, with no level picked
- **WHEN** the collector opens its page to book the drop-off
- **THEN** a level is asked for through the list's edit, and no day and no
  join are offered
- **AND** a booking or a join sent for the plan is refused by name before the
  diary is asked, so no visit is taken and the plan holds no drop-off
- **AND** once the list is saved with a level, the level is no longer asked
  for, and the page asks for the statement before any day, as for any plan
  kept unticked

<!-- trace:scenario id=g10.grading-submission-plan.SC-s0l rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-62 - A plan kept from a ticked review opens on the picker with nothing asked
**Serves:** grade10-site-grading-submission-plan-US-07 - a collector who ticked the statement on the review is not asked again

- **GIVEN** a review whose collection statement is ticked
- **WHEN** the collector books the drop-off from it
- **THEN** the plan is kept ticked
- **AND** its page opens on the drop-off picker with no statement asked for

### Requirement: A plan is priced on the fee sheet it was booked on

A quoted figure does not move under a collector who has already booked a visit
for it.

**Pinned at booking** - the fee sheet in force when the drop-off is booked
SHALL be kept with the submission, and every figure the submission shows and
its agreement prints SHALL be read from that kept sheet.

**Not yet booked** - a plan with no drop-off booked SHALL be priced on the
sheet in force when it is read.

**No reach backwards** - a change to the fee sheet SHALL reach no submission
that already has a drop-off booked.

#### Scenario: grade10-site-grading-submission-plan-SC-36 - A sheet changed after booking leaves the submission's figures alone
**Serves:** Priced at booking - the figures a collector was quoted are the ones their counter and their agreement use

- **GIVEN** a submission booked at PSA Regular at 60000 HKD minor units a card
- **WHEN** the fee sheet's Regular fee is changed to 70000 HKD minor units
- **THEN** that submission still reads 60000 HKD minor units a card

#### Scenario: grade10-site-grading-submission-plan-SC-37 - A sheet changed before booking reaches the plan
**Serves:** Priced at booking - a plan with no visit taken yet is quoted on the sheet in force today

- **GIVEN** a plan with no drop-off booked, made while Regular was 60000 HKD
  minor units a card
- **WHEN** the fee sheet's Regular fee is changed to 70000 HKD minor units and
  the collector reopens the plan
- **THEN** the estimate reads 70000 HKD minor units a card

### Requirement: A plan lives under the email given and needs no account

A collector can plan a submission, leave, and come back to it on another device
without ever making an account.

**Under the email** - a plan SHALL be kept under the email given on the cards
step, and that email SHALL be asked for before the plan is kept where the
collector has given none.

**The link** - a link to the plan SHALL be emailed once, by the daily sweep,
to a plan kept with no drop-off booked, never on the collector leaving the
page, and SHALL open the plan on any device with no account and no password.

**What a reopened plan shows** - a plan reopened SHALL show its cards, its
estimate, the day it is kept until, and the offer to book the drop-off.

**Signing in** - signing in with the same email and no password SHALL list
every submission under that email, open and closed.

<!-- trace:scenario id=g10.grading-submission-plan.SC-3d2 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-38 - Leaving the wizard keeps the plan and the daily sweep mails its link
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector who stops halfway and wants to finish another day

- **GIVEN** a collector part way through the wizard who has given their email
- **WHEN** they leave without booking, and the daily sweep runs
- **THEN** the plan is kept
- **AND** a link to it is emailed to that address once, by the sweep

<!-- trace:scenario id=g10.grading-submission-plan.SC-hk7 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-39 - The emailed link opens the plan on another device
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector finishing on a second device

- **WHEN** the emailed link is opened on a device that has never signed in
- **THEN** the plan opens
- **AND** no account and no password are asked for

<!-- trace:scenario id=g10.grading-submission-plan.SC-ad7 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-40 - A plan cannot be kept without an email
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector who asks to finish later before giving an address

- **GIVEN** a collector who has given no email
- **WHEN** they ask to finish later
- **THEN** the email is asked for
- **AND** the plan is kept once it is given

<!-- trace:scenario id=g10.grading-submission-plan.SC-r30 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-41 - Signing in lists every submission under that email
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector finding an old submission without a second list

- **GIVEN** three submissions planned under one email, one of them collected
- **WHEN** the collector signs in with that email and no password
- **THEN** all three are listed, open and closed
- **AND** each one opens its own page

<!-- trace:scenario id=g10.grading-submission-plan.SC-xnp rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-42 - A reopened plan reads back its list and what it costs
**Serves:** grade10-site-grading-submission-plan-US-06 - a collector picking a plan back up to book its visit

- **WHEN** a collector reopens a plan with no drop-off booked
- **THEN** its cards and its estimate are shown
- **AND** the day it is kept until is shown
- **AND** booking the drop-off is offered

### Requirement: A plan with no drop-off booked is nudged, then expires

An old list is priced on a stale sheet and referenced against stale sales, so a
plan nobody books is let go rather than kept.

**The clock's start** - the plan's clock SHALL start on the later of the day it
was kept and the day its last visit ended without a hand-in, cancelled or
missed; both days below SHALL be counted from that start, on the
Asia/Hong_Kong day.

**The nudge** - a plan with no drop-off booked SHALL be nudged once per clock
start, 21 days after it, with the link to it, so a plan whose clock restarts
never expires unwarned.

**The expiry** - a plan with no drop-off booked SHALL expire 30 days after its
clock's start, and the collector SHALL be told.

**Nothing owed** - an expired plan SHALL leave nothing paid and nothing owed,
and SHALL offer starting a submission again.

**Booking an expired plan** - booking a drop-off for a plan that has expired
SHALL be refused by name, and SHALL NOT be retried against the expired plan.

<!-- trace:scenario id=g10.grading-submission-plan.SC-e27 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-43 - A plan nobody has booked is nudged once at twenty-one days
**Serves:** grade10-site-grading-submission-plan-US-08 - a collector who planned a submission and booked nothing

- **GIVEN** a plan kept 21 Asia/Hong_Kong days ago with no drop-off booked
- **WHEN** the day turns
- **THEN** the collector is nudged once, with the link to the plan
- **AND** the plan says the day it is kept until

<!-- trace:scenario id=g10.grading-submission-plan.SC-vzu rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-44 - A plan nobody has booked expires at thirty days owing nothing
**Serves:** grade10-site-grading-submission-plan-US-08 - a collector who never came back to the list they made

- **GIVEN** a plan kept 30 Asia/Hong_Kong days ago with no drop-off booked
- **WHEN** the day turns
- **THEN** the plan expires and the collector is told
- **AND** the plan says nothing was paid and nothing is owed
- **AND** starting a submission again is offered

<!-- trace:scenario id=g10.grading-submission-plan.SC-tuf rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-45 - Booking a plan that expired meanwhile is refused by name
**Serves:** grade10-site-grading-submission-plan-US-08 - a collector booking from a review left open past the expiry

- **GIVEN** a review left open on a plan that has since expired
- **WHEN** the collector books the drop-off
- **THEN** it is refused by name
- **AND** the collector is offered starting a submission again

<!-- trace:scenario id=g10.grading-submission-plan.SC-5af rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-59 - A plan with a drop-off booked does not expire
**Serves:** grade10-site-grading-submission-plan-US-08 - a collector whose visit is booked weeks ahead of the day it falls due

- **GIVEN** a plan kept 30 Asia/Hong_Kong days ago with a drop-off booked
- **WHEN** the day turns
- **THEN** the plan does not expire
- **AND** no nudge and no expiry message is sent

<!-- trace:scenario id=g10.grading-submission-plan.SC-l55 rev=1 -->
#### Scenario: grade10-site-grading-submission-plan-SC-64 - A cancelled visit restarts the plan's clock and its nudge
**Serves:** grade10-site-grading-submission-plan-US-08 - a collector who booked, then cancelled, is warned again before the plan lets go

- **GIVEN** a plan kept on 1 March, nudged on 22 March, then booked and its visit cancelled on 25 March
- **WHEN** the days turn
- **THEN** the plan is nudged again on 15 April and expires on 24 April, not on 31 March
