# shared/ui/grading-submission Specification

## Purpose

The collector's grading blocks, drawn once and imported rather than rebuilt:
the fee sheet and the level picker, the card list in its two forms, the paste
sheet, the review, the status rail and the ownership chip, the pickup card,
the named collector, the grade cards, the money block and the uncollected
ladder.

Every word, figure and callback reaches them through props, so a second brand
imports the set rather than drawing it again. The drop-off's own blocks are
`shared/ui/appointment-booking`, reused unchanged.

## Feature set

- The export contract
  - Named components: the grading submission blocks and their prop and copy
    types from the package entry
  - The booking set is not redrawn: the drop-off composes the
    appointment-booking exports, and grading adds only its batch line and its
    own wizard rail
  - Nothing console-shaped: the operator's views are the application's, never
    this package's
- Reading what it costs
  - One sheet per grader: every level's ceiling, cards a submission, fee a
    card, cover rate where it carries one, and the weeks back
  - Open or closed, with the reason: a level names the card declared above its
    ceiling, or the count that closes it
  - The estimate belongs to the pick: the cards times the fee, the cover line
    per card, the total and the return date
  - Two drawings of one sheet: the sheet and the picker read the same figures,
    so they cannot disagree
- Listing the cards
  - The editable list: a card matched or kept as typed, its declared value,
    its reference sales and its minimum grade
  - The caps on the list: the cap named, a card with no value named, and a
    card above a ceiling named
  - The paste and what it made: matched, kept as typed, without a value, above
    the ceiling, skipped, and the line a long list triggers
- Reviewing before booking
  - The schedule and the totals: every card as it will be handed in, declared,
    fee and cover
  - The upcharge warning per card: the level it would move to, the difference
    due, and what the higher level costs now
  - Before it can be booked: the good-to-know lines and the consent tick
- Where the submission stands
  - The status word and whose move it is: one pair, so the two can never
    disagree
  - The rail: the stages with the one reached marked, an ended submission
    staying where it ended
- The cards after hand-in
  - The read-only record: intake id, the photograph pair, and the outcome as a
    badge with its line in the collector's words
  - The grades: one card per card with the grade in the grader's words and its
    cert, or the grader's code and note where it came back raw
- Collecting the cards
  - The pickup card: the code, the items, where and when, what is due, and
    whether to bring an ID
  - Naming somebody: nobody named, or one person with the day they were named,
    changed or removed
- What is paid and due
  - One place for the lines: the fee, the cover, what was paid and how, what
    moved up, what was waived, refunded or paid out, storage, and what is due
    before collection
  - The due line reads as due: the block leads with what the collector must
    settle
- If nobody collects
  - The rungs, each dated: the reminders, the day storage starts, and the
    notice with the days it gives
  - A passed rung is marked: the collector reads how far it has gone
- Content through props
  - Consumer-owned words: every string, figure and callback arrives through
    props, and callbacks are named for the event
  - No application inside: no fetching, mutation, routing, storage or app
    state
  - Money and time as given: minor units with a currency code, and a day or an
    instant formatted in the locale and zone supplied
  - Every state from props: a story reaches each state with no application
    behind it

## ADDED Requirements

### Requirement: The grading submission exports

The blocks a collector-facing grading page composes, named once so every brand
imports the same set.

**Components** - the shared UI package SHALL export from its public entry
exactly these components for the grading submission surface:
`GradingFeeSheet`, `GradingCardList`, `GradingCardRecord`,
`GradingPasteSheet`, `GradingLevelPicker`, `GradingReview`,
`GradingStatusRail`, `GradingOwnershipChip`, `GradingPickupCard`,
`GradingNamedCollector`, `GradingGradeCards`, `GradingMoneyBlock` and
`GradingUncollectedLadder`.

**Types** - each component SHALL carry a `<Name>Props` and a `<Name>Copy`
type exported beside it.

**The booking set is not redrawn** - the package SHALL NOT export a grading
shop picker, day and time picker, details form, confirmation or manage card;
a grading drop-off composes `BookingLocationPicker`, `BookingSlotPicker`,
`BookingDetailsForm`, `BookingConfirmation` and `BookingManageCard`
unchanged.

**The wizard rail and the batch line are the application's** - the package
SHALL export neither.

**Nothing console-shaped** - the package SHALL export no block drawing the
operator's queue, runbooks, batches, receiving or settings.

**Copy filling** - the package SHALL export `fillGradingCopy` and
`GradingLocaleProps` from its public entry. `fillGradingCopy(template,
values)` SHALL replace every `{name}` in a catalogue template with
`values[name]`, and SHALL throw an error naming the placeholder where
`values` carries no value for it, so no consumer shows a literal placeholder.
This is the one filler for a flat template; a template that also carries a
`{count, plural, …}` clause is outside its reach and is the consumer's own
ICU translator's to fill.

#### Scenario: shared-ui-grading-submission-SC-01 - An application imports the grading blocks
**Serves:** The export contract - a brand builds its grading pages from one set rather than drawing its own

- **WHEN** an application imports any component or type named above from the
  shared UI package's public entry
- **THEN** the import resolves
- **AND** no other component is exported for this surface

#### Scenario: shared-ui-grading-submission-SC-02 - The drop-off composes the booking blocks
**Serves:** The export contract - a brand builds its drop-off page from the blocks the diary already ships

- **WHEN** an application builds a grading drop-off page
- **THEN** `BookingLocationPicker`, `BookingSlotPicker`, `BookingDetailsForm`,
  `BookingConfirmation` and `BookingManageCard` resolve from the package's
  public entry
- **AND** no grading-named shop picker, day and time picker, details form,
  confirmation or manage card is exported

#### Scenario: shared-ui-grading-submission-SC-71 - A template missing a value refuses by name
**Serves:** The export contract - a consumer never shows a collector a literal placeholder

- **WHEN** a consumer fills a template naming `{shop}` with no `shop` value
- **THEN** the fill throws naming `{shop}`
- **AND** no text is returned

### Requirement: The fee sheet draws every grader's levels

What a submission costs, read before a collector gives a name.

**One sheet a grader** - `GradingFeeSheet` SHALL render one sheet per grader
it is given, mark the selected one, and report a pick by its id.

**One grader** - where it is given one grader the sheet SHALL render that
sheet with no grader control.

**The columns** - each level row SHALL show the declared value the level takes
up to, the cards a submission it allows, the fee a card, the cover rate where
the level carries one, and the weeks back.

**No cover rate, no cover** - a level carrying none SHALL show none.

**Above the top** - the sheet SHALL show the line it is given for a card worth
more than any level takes, and SHALL price no such card.

**A level with no figures** - a level given no ceiling and no fee a card SHALL
read the no-figure word it is given in those columns, and SHALL NOT read as a
price of nought.

**The title's rung** - the sheet's title SHALL take the heading rung it is
given, a second-rung heading where it is given none.

**The figures are given** - the sheet SHALL render the fee sheet record it is
given and SHALL carry no figure of its own, so it and `GradingLevelPicker`
cannot disagree.

#### Scenario: shared-ui-grading-submission-SC-03 - One grader's levels read in full
**Serves:** Reading what it costs - a collector reads the price on the grading home before giving a name

- **WHEN** `GradingFeeSheet` renders one grader with four levels
- **THEN** each level shows its ceiling, its cards a submission, its fee a
  card and its weeks back
- **AND** no grader control is drawn

#### Scenario: shared-ui-grading-submission-SC-04 - Cover reads only where the level carries it
**Serves:** Reading what it costs - a collector reads what the cover adds before picking a level

- **GIVEN** a sheet whose Express and Super Express levels carry a cover rate
  and whose Value level carries none
- **WHEN** `GradingFeeSheet` renders it
- **THEN** the two levels show their cover rate
- **AND** the Value level shows none

#### Scenario: shared-ui-grading-submission-SC-05 - A grader is picked by id
**Serves:** Reading what it costs - a collector compares the graders the shop sends to

- **GIVEN** three graders rendered in `GradingFeeSheet`
- **WHEN** the collector activates the second
- **THEN** the sheet reports that grader's id and marks it selected

#### Scenario: shared-ui-grading-submission-SC-68 - A level with no figures reads the no-figure word, not nought
**Serves:** Reading what it costs - a collector reads a grader nobody has priced yet

- **GIVEN** a grader whose levels carry no ceiling and no fee
- **WHEN** `GradingFeeSheet` renders it
- **THEN** each level's ceiling and fee columns read the no-figure word it
  was given
- **AND** no column reads as HK$0

#### Scenario: shared-ui-grading-submission-SC-69 - The title takes the rung it is given
**Serves:** Reading what it costs - a collector reads the sheet under whatever heading the page draws above it

- **GIVEN** `GradingFeeSheet` given a third-rung heading
- **WHEN** it renders
- **THEN** its title reads as a third-rung heading
- **AND** given none it reads as a second-rung heading

#### Scenario: shared-ui-grading-submission-SC-59 - The sheet and the picker each render the sheet they were given
**Serves:** Reading what it costs - a collector reads one set of figures wherever the page draws them

- **GIVEN** one fee sheet record passed to both `GradingFeeSheet` and
  `GradingLevelPicker`
- **WHEN** each renders
- **THEN** each shows that record's figures and no figure of its own
- **AND** neither block reads, checks or reports on the other's figures

### Requirement: The level picker opens a level or names what closed it

The grader and the level for the whole list, and the estimate that follows.

**Grader then level** - `GradingLevelPicker` SHALL render the graders it is
given, mark the selected one and report a pick by its id, then render that
grader's levels.

**Open** - an open level SHALL show its name, the declared value it takes up
to, the fee a card, the cover line where the level carries one, and the weeks
back, and SHALL report a pick by its id.

**Closed** - a closed level SHALL report no pick and SHALL name what closes
it: the card declared above its ceiling, or the count of cards against the
level's floor.

**Every level closed** - where no level is open the picker SHALL show the
counter line it is given and report no pick.

**The highest declared** - the picker SHALL show the highest declared value it
is given, so a closed level reads against a figure.

**The estimate** - where it is given an estimate the picker SHALL show the
cards times the fee a card, the cover line per card where the level carries
one, the total and the weeks back; where it is given none it SHALL show none.
It SHALL compute no estimate of its own.

**The upcharge notice** - the picker SHALL show the notice it is given that a
card moved up a level is charged the difference before collection.

**Levels as data** - a grader whose figures nobody has supplied SHALL still
render its levels, with the line it is given about them.

#### Scenario: shared-ui-grading-submission-SC-60 - The picker names the graders and the highest declared value
**Serves:** Reading what it costs - a collector reads which grader they are pricing and the figure the levels are read against

- **GIVEN** `GradingLevelPicker` given three graders, the second selected, and
  a highest declared value
- **WHEN** it renders
- **THEN** the three graders are shown with the second marked, and that
  grader's levels are rendered
- **AND** the highest declared value is shown as given
- **AND** activating the third reports that grader's id

#### Scenario: shared-ui-grading-submission-SC-06 - An open level is picked by id
**Serves:** Reading what it costs - a collector picks the level their cards leave on

- **GIVEN** an open level carrying a cover rate, rendered in
  `GradingLevelPicker` with no level picked and no estimate
- **WHEN** the collector activates it
- **THEN** the picker reports that level's id and marks it selected
- **AND** before the pick the level showed its cover line and the picker showed
  no estimate

#### Scenario: shared-ui-grading-submission-SC-07 - A level closed by a declared value names the card
**Serves:** Reading what it costs - a collector reads why the level they wanted is shut

- **GIVEN** a level closed by a card declared above its ceiling
- **WHEN** `GradingLevelPicker` renders it
- **THEN** the level reads as unavailable, naming that card
- **AND** activating it reports nothing

#### Scenario: shared-ui-grading-submission-SC-08 - A level closed by a count names the count
**Serves:** Reading what it costs - a collector with a long list reads which level a count leaves open

- **GIVEN** a level closed by the count of cards listed
- **WHEN** `GradingLevelPicker` renders it
- **THEN** the level reads as unavailable, naming the count it needs and the
  count listed
- **AND** activating it reports nothing

#### Scenario: shared-ui-grading-submission-SC-09 - Every level closed sends the collector to the counter
**Serves:** Reading what it costs - a collector holding a card worth more than any level takes

- **GIVEN** a picker whose levels are all closed
- **WHEN** it renders
- **THEN** the counter line it was given is shown
- **AND** no estimate is shown

#### Scenario: shared-ui-grading-submission-SC-10 - The estimate reads the fee, the cover and the weeks
**Serves:** Reading what it costs - a collector reads the total before booking anything

- **GIVEN** an estimate of 4 cards at 25000 HKD minor units a card, a cover
  line of 3000 HKD minor units a card, a total of 112000 HKD minor units and
  six weeks back
- **WHEN** `GradingLevelPicker` renders it
- **THEN** all four read as given, in the locale the picker was given
- **AND** the picker computes none of them

#### Scenario: shared-ui-grading-submission-SC-11 - The picker names what a card moved up would cost
**Serves:** Reading what it costs - a collector told before booking that a card graded higher costs more

- **WHEN** `GradingLevelPicker` renders the upcharge notice it was given
- **THEN** the notice reads that a card moved up a level is charged the
  difference before collection

#### Scenario: shared-ui-grading-submission-SC-12 - A grader whose figures are examples still lists its levels
**Serves:** Reading what it costs - a collector comparing a grader nobody has priced yet

- **GIVEN** a grader whose levels carry example figures and the line saying so
- **WHEN** `GradingLevelPicker` renders that grader
- **THEN** its levels are listed
- **AND** the line about the figures is shown

### Requirement: The editable card list carries a card and what is missing on it

The list a collector edits before hand-in, one card a row.

**A card** - `GradingCardList` SHALL show each card's name, its set line
where one is given, whether it was matched in the reference or kept as typed,
its declared value where one is given, its reference sales where they are
given, and its minimum grade where one is set. A card matched with no set and
no number of its own SHALL read as matched, from its name alone.

**Searching** - the list SHALL take the matches as loading, empty, error or
ready and report each search; a name that matches nothing SHALL be kept as
typed.

**No value** - a card with no declared value SHALL be named on the list.

**The value field** - a card with no declared value, or one given as being
edited, SHALL carry a field for it; what is typed SHALL stay in the field and
SHALL be reported once, when the field is left or Enter is pressed, and an
empty field SHALL report nothing. A card being edited SHALL show the value it
holds in the empty field.

**Above the ceiling** - a card declared above the level's ceiling SHALL be
named with the second-submission line it is given.

**The cap** - the list SHALL show the cap it is given and the level the count
closes, and SHALL report no add past the cap, showing the line it is given
instead; a cap given as none SHALL refuse no add.

**Empty** - with no card the list SHALL offer adding a card and pasting a
list, and nothing else.

**The reference out of reach** - where the matches read as an error every card
SHALL read as kept as typed with the line it is given rather than the
kept-as-typed one, and the declared value SHALL still be asked for.

**Acts** - adding, editing, removing, declaring a value, setting a minimum
grade and opening the paste sheet SHALL each report through a callback of its
own.

#### Scenario: shared-ui-grading-submission-SC-13 - A matched card reads its reference sales
**Serves:** Listing the cards - a collector lists a card the shop's reference knows

- **GIVEN** a card matched in the reference with three reference sales, a
  declared value and a minimum grade
- **WHEN** `GradingCardList` renders it
- **THEN** the card reads as matched, with its set line, its declared value
  and the three sales
- **AND** the minimum grade reads on the card, with the line that the fee
  applies either way

#### Scenario: shared-ui-grading-submission-SC-65 - A matched card names no set or number of its own
**Serves:** Listing the cards - a collector lists a card the reference matched by name alone

- **GIVEN** a card matched in the reference, carrying no set and no number
  (`Q109`: the reference names neither)
- **WHEN** `GradingCardList` renders it
- **THEN** the card reads as matched, from its name alone
- **AND** rendering it raises no error

#### Scenario: shared-ui-grading-submission-SC-14 - A name that matches nothing is kept as typed
**Serves:** Listing the cards - a collector lists a card in their own words

- **GIVEN** a search whose matches read as empty
- **WHEN** the collector adds the name they typed
- **THEN** the card is reported with that name
- **AND** it reads as kept as typed, with no reference row

#### Scenario: shared-ui-grading-submission-SC-15 - A card with no declared value is named
**Serves:** Listing the cards - a collector who has not said what a card is worth

- **GIVEN** a list of three cards, one with no declared value
- **WHEN** `GradingCardList` renders it
- **THEN** that card is named as still needing a value

#### Scenario: shared-ui-grading-submission-SC-66 - The value field commits once, on leaving it or Enter
**Serves:** Listing the cards - a collector typing what a card is worth

- **GIVEN** a card carrying the value field, empty or reopened for editing
- **WHEN** the collector types a figure and leaves the field, or presses Enter
- **THEN** the field reports that figure once, through its own callback
- **AND** what was typed stays in the field as it is typed
- **AND** leaving the field untouched reports nothing

#### Scenario: shared-ui-grading-submission-SC-16 - The cap refuses the card past it
**Serves:** Listing the cards - a dealer listing more cards than one submission takes

- **GIVEN** a list at its cap of 100 cards
- **WHEN** the collector adds one more
- **THEN** nothing is reported
- **AND** the line about a second submission on another day is shown

#### Scenario: shared-ui-grading-submission-SC-67 - A cap given as none refuses no add
**Serves:** Listing the cards - a collector building a list against a level that takes any count

- **GIVEN** a list given no cap
- **WHEN** the collector adds a card
- **THEN** the add is reported
- **AND** no card is ever refused for being past a cap

#### Scenario: shared-ui-grading-submission-SC-17 - The reference out of reach keeps the list working
**Serves:** Listing the cards - a collector listing cards while the shop's catalogue cannot be asked

- **WHEN** `GradingCardList` renders with its matches in error
- **THEN** every card reads with the catalogue-unavailable line rather than the
  kept-as-typed one
- **AND** the declared value is still asked for on each card

#### Scenario: shared-ui-grading-submission-SC-18 - An empty list offers the two ways to start
**Serves:** Listing the cards - a collector opening the wizard with nothing listed yet

- **WHEN** `GradingCardList` renders with no card
- **THEN** adding a card and pasting a list are both offered
- **AND** no card row is drawn

#### Scenario: shared-ui-grading-submission-SC-19 - A card above the ceiling is named on the list
**Serves:** Listing the cards - a collector listing one card worth more than the level takes

- **GIVEN** a list of 22 cards, one declared above the level's ceiling
- **WHEN** `GradingCardList` renders it
- **THEN** that card is named as above the ceiling
- **AND** the line about a second submission on the same drop-off is shown

#### Scenario: shared-ui-grading-submission-SC-61 - Each act on the list reports through its own callback
**Serves:** Listing the cards - a collector building the list a card at a time

- **GIVEN** a list carrying one card
- **WHEN** the collector adds a card, edits that card, declares a value on it,
  sets a minimum grade on it, removes it, and opens the paste sheet
- **THEN** each act reports through the callback of its own
- **AND** the list carries none of them out itself

#### Scenario: shared-ui-grading-submission-SC-62 - The cap reads with the level the count closes
**Serves:** Listing the cards - a collector reading how many cards this submission takes and which level a longer list leaves

- **GIVEN** a list given a cap of 20 cards and 22 cards listed
- **WHEN** `GradingCardList` renders it
- **THEN** the cap it was given is shown
- **AND** the level the count closes is named as it was given

### Requirement: The paste sheet accounts for every line

A pasted list, one card a line, and what the paste made of each.

**Reading** - `GradingPasteSheet` SHALL show the count of lines read as the
text changes, and report each change.

**Not yet** - with nothing read, and while the result reads as loading, the
sheet SHALL report no add.

**What it made** - the sheet SHALL show one row per outcome with its count and
the lines behind it: matched, kept as typed, without a value, above the
ceiling, and skipped as a card already listed.

**Nothing dropped** - the five counts SHALL account for every line read.

**Bulk** - where the lines pass the count the sheet is given for Bulk it SHALL
show the Bulk line it is given: the level, its fee, its ceiling, its weeks,
the longer drop-off and the cards it takes.

**The reference out of reach** - where the result reads as an error every line
SHALL carry the catalogue-unavailable line rather than the kept-as-typed one,
and the add SHALL stay offered.

**Acts** - changing the text and closing the sheet SHALL each report through a
callback of its own, and adding the cards SHALL report through `onApply`
carrying the cards the paste made - matched, kept as typed and the rest - which
the composing page feeds to `GradingCardList`'s `cards`.

#### Scenario: shared-ui-grading-submission-SC-20 - Nothing read, nothing added
**Serves:** Listing the cards - a collector who opens the paste sheet and pastes nothing

- **WHEN** `GradingPasteSheet` renders with an empty text and no result
- **THEN** the lines-read count reads none
- **AND** activating the add reports nothing
- **AND** a sheet whose result reads as loading reports nothing either

#### Scenario: shared-ui-grading-submission-SC-21 - Every pasted line is accounted for
**Serves:** Listing the cards - a dealer pasting a list and reading what became of it

- **GIVEN** a result of 12 matched, 3 kept as typed, 2 without a value, 1 above
  the ceiling and 2 skipped, from 20 lines read
- **WHEN** `GradingPasteSheet` renders it
- **THEN** each of the five rows shows its count and names the lines behind it
- **AND** the counts read against the 20 lines

#### Scenario: shared-ui-grading-submission-SC-22 - A long list reads the Bulk line
**Serves:** Listing the cards - a dealer pasting more cards than the shorter visit takes

- **GIVEN** a sheet given a Bulk line and a result of 34 lines
- **WHEN** it renders
- **THEN** the Bulk line is shown with its level, fee, ceiling, weeks and the
  longer drop-off

#### Scenario: shared-ui-grading-submission-SC-23 - A line above the ceiling is named
**Serves:** Listing the cards - a collector pasting a card worth more than the level takes

- **GIVEN** a result with one line above the ceiling
- **WHEN** `GradingPasteSheet` renders it
- **THEN** that row names the card and its declared value
- **AND** the second-submission line it was given is shown

#### Scenario: shared-ui-grading-submission-SC-63 - The paste reports its cards through onApply
**Serves:** Listing the cards - a dealer whose pasted list becomes the list they then edit

- **GIVEN** a result of matched, kept-as-typed and valueless cards
- **WHEN** the collector activates the add
- **THEN** `onApply` reports those cards
- **AND** the sheet adds none of them to any list itself

### Requirement: The review shows the schedule, the totals and what a card could cost

The last page before the drop-off is booked.

**The schedule** - `GradingReview` SHALL show one row per card with its name,
its set line, its minimum grade where one is set, its declared value and its
cover where the level carries one.

**The totals** - it SHALL show the declared total, the fee, and the cover
beside it where the level carries one.

**The upcharge warning** - for each card it is given a warning for, it SHALL
show the level the grader would move the card to, the difference due before
collection, and what the higher level costs a card now; where it is given
none it SHALL show no warning at all.

**Good to know** - it SHALL show the lines it is given, in the order given.

**The consent** - it SHALL report a booking only once the collection statement
is ticked, and SHALL offer no booking until then; the tick SHALL report
through its own callback.

**While booking** - it SHALL offer neither booking nor saving for later while
it reads as pending.

**Refused** - it SHALL show the refusal it is given, and report no booking.

**Acts** - editing the list, saving for later and booking SHALL each report
through a callback of its own.

#### Scenario: shared-ui-grading-submission-SC-24 - The review reads the schedule and the totals
**Serves:** Reviewing before booking - a collector reads every card as it will be handed in

- **GIVEN** a review of 4 cards, one carrying a minimum grade, with a declared
  total of 800000 HKD minor units, a fee of 100000 HKD minor units and a cover
  of 12000 HKD minor units
- **WHEN** `GradingReview` renders it
- **THEN** one row per card is shown, the minimum grade beside its card
- **AND** the three totals read as given
- **AND** the good-to-know lines read in the order they were given

#### Scenario: shared-ui-grading-submission-SC-25 - A card that could move up is named with both prices
**Serves:** Reviewing before booking - a collector reads what a card graded higher would cost

- **GIVEN** one card carrying a warning: the level it would move to, a
  difference of 30000 HKD minor units, and the higher level's fee of 55000 HKD
  minor units
- **WHEN** `GradingReview` renders it
- **THEN** that card names the level, the difference due before collection and
  the higher level's fee now

#### Scenario: shared-ui-grading-submission-SC-26 - No card above a ceiling, no warning
**Serves:** Reviewing before booking - a collector whose cards all sit inside the level

- **WHEN** `GradingReview` renders with no upcharge warning
- **THEN** no warning is shown anywhere on the review

#### Scenario: shared-ui-grading-submission-SC-27 - Nothing is booked before the statement is ticked
**Serves:** Reviewing before booking - a collector agreeing to how the cards are collected

- **GIVEN** a review whose consent is unticked
- **WHEN** the collector activates the booking
- **THEN** nothing is reported
- **AND** once the statement is ticked the booking reports through its callback
- **AND** while the review reads as pending neither booking nor saving for
  later is offered

#### Scenario: shared-ui-grading-submission-SC-28 - A refused booking reads the refusal it was given
**Serves:** Reviewing before booking - a collector booking a plan the shop has since let go

- **WHEN** `GradingReview` renders with a refusal saying the plan expired
- **THEN** that refusal is shown
- **AND** no booking is reported

### Requirement: The status word and whose move it is are one pair

One block draws both, so the two can never disagree.

**The pair** - `GradingOwnershipChip` SHALL render the status word and the
chip it is given together, each with the tone it is given.

**Whose move** - the chip SHALL read the words it is given for whoever the
submission waits on, so a submission waiting on the grader never reads as
waiting on the shop.

**No chip** - where it is given none the block SHALL render the status word
alone.

**Derived nowhere** - the block SHALL derive neither the word nor the chip
from the other, and SHALL carry no status vocabulary of its own.

#### Scenario: shared-ui-grading-submission-SC-29 - Each pair reads as it was given
**Serves:** Where the submission stands - a collector reading who holds their cards today

- **GIVEN** the pairs for a submission waiting on the collector, one booked for
  a drop-off, one with the shop, one with the grader, one on its way back and
  one collected
- **WHEN** `GradingOwnershipChip` renders each
- **THEN** each status word and its chip are shown as one pair, in the words
  and tones they were given
- **AND** the pair for cards with the grader names the grader

#### Scenario: shared-ui-grading-submission-SC-30 - A closed submission shows the word alone
**Serves:** Where the submission stands - a collector opening a submission that ended

- **WHEN** `GradingOwnershipChip` renders a cancelled submission with no chip
- **THEN** the status word is shown
- **AND** no chip is drawn

#### Scenario: shared-ui-grading-submission-SC-31 - Running late is the words it is given
**Serves:** Where the submission stands - a collector reading a submission past its estimate

- **WHEN** `GradingOwnershipChip` renders a running-late chip with its tone
- **THEN** the chip reads those words in that tone
- **AND** the block computes nothing from a date

### Requirement: The rail marks the stage a submission reached

Seven steps, one marked.

**The stages** - `GradingStatusRail` SHALL render Planned, Booked, Handed in,
Sent, Graded, Back and Home, in that order, with the words it is given.

**The one reached** - the stage it is given SHALL read as the one reached,
every earlier stage as done and every later stage as still to come.

**Ended** - where the submission ended the rail SHALL leave it at the stage it
ended on, and no later stage SHALL read as reached.

#### Scenario: shared-ui-grading-submission-SC-32 - The reached stage is marked and the rest read against it
**Serves:** Where the submission stands - a collector reading how far a submission has gone

- **WHEN** `GradingStatusRail` renders with the stage Sent
- **THEN** Planned, Booked and Handed in read as done
- **AND** Sent reads as the one reached
- **AND** Graded, Back and Home read as still to come

#### Scenario: shared-ui-grading-submission-SC-33 - An ended submission stays where it ended
**Serves:** Where the submission stands - a collector reading a submission that was cancelled before hand-in

- **WHEN** `GradingStatusRail` renders as ended at Planned
- **THEN** Planned reads as the stage it ended on
- **AND** no later stage reads as reached

### Requirement: The record after hand-in reads as the cards were handed in

The read-only list the submission page carries once the cards are with the
shop.

**Read only** - `GradingCardRecord` SHALL draw no control that changes a card.

**Each card** - it SHALL show the card's name, its set line, its declared
value, its minimum grade where one is set, its intake id where one was issued,
the photograph pair where one was taken, the slab photograph where one was
taken, and the certificate with the lookup address it is given where one was
issued.

**The outcome** - each card SHALL carry one badge with its line in the
collector's words, from this set. The consumer SHALL supply the outcome and
the line, and the block SHALL read the badge's tone from the outcome through
one map of its own, taking no tone from the consumer:

| Outcome | What the card reads beside the badge |
| --- | --- |
| Listed | the card as planned, with no intake id |
| Handed in | the intake id and the photograph pair |
| Refused at the counter | the staff's words as typed, and that it was never charged |
| Withdrawn | the refund |
| Graded | the grade in the grader's words and the certificate |
| Moved up a level | the difference due before collection |
| Ungraded | the grader's code and note, and that the fee stands |
| Minimum grade not met | that the card comes back raw, and that the fee stands |
| Held by the grader | the day it is expected |
| Not returned | the payout |
| Damaged | the payout |
| Collected | the grade, the grader, the certificate and the slab photograph |
| Vaulted | the vault case it opened |

#### Scenario: shared-ui-grading-submission-SC-34 - A handed-in card reads its intake id and photographs
**Serves:** The cards after hand-in - a collector checking the shop holds what they brought

- **GIVEN** a card with an intake id and a front and back photograph
- **WHEN** `GradingCardRecord` renders it
- **THEN** the intake id and both photographs are shown
- **AND** a card carrying a minimum grade shows it on its set line
- **AND** no control that changes the card is drawn

#### Scenario: shared-ui-grading-submission-SC-35 - Every outcome reads its badge and its line
**Serves:** The cards after hand-in - a collector reading what became of each card

- **GIVEN** one card in each outcome of the table above, each with the badge
  and the line it was given
- **WHEN** `GradingCardRecord` renders them
- **THEN** each card shows that badge and that line
- **AND** a card still listed shows no intake id

#### Scenario: shared-ui-grading-submission-SC-64 - The badge's tone comes from the outcome
**Serves:** The cards after hand-in - a collector reads the same outcome dressed the same way on every grading page

- **GIVEN** cards carrying the outcomes of the table above, with their words
  and lines and no tone
- **WHEN** `GradingCardRecord` renders them
- **THEN** each badge reads in the tone the block's map gives that outcome
- **AND** an outcome's tone is the same on every page that renders it

#### Scenario: shared-ui-grading-submission-SC-36 - A certificate reads against the address it was given
**Serves:** The cards after hand-in - a collector looking a slab up with the grader

- **GIVEN** a graded card with a certificate and a lookup address
- **WHEN** `GradingCardRecord` renders it
- **THEN** the certificate is shown against that address
- **AND** the block builds no address of its own

### Requirement: The grade cards read the grader's words

One card a card, once the grades are in.

**Graded** - `GradingGradeCards` SHALL show the grade, its label word, the
grader, the card's name and the certificate where one was issued, and SHALL
show the photograph taken at hand-back where the consumer gives one — the
same photograph shape `GradingCardRecord`'s own slab photograph takes. This
is the collected page's own record: `grade10-site`'s submission page is the
export's one consumer for it.

**Ungraded** - a card returned ungraded SHALL show no grade, and SHALL show
the grader's code and note, drawn apart from a graded card.

**The rest** - a card moved up a level, held by the grader, below its minimum
grade, not returned or damaged SHALL show the badge it is given, and SHALL
show no grade where none was issued.

**Its own payout** - a card carrying a payout line SHALL show it, and SHALL
show no such line where it carries none — the one reading
`GradingCardRecord`'s own outcome line shares, so a card that never came back
still carries its settlement, or its reversal, once the submission is
collected (`grade10-site-grading-submission-lifecycle-SC-41`, `SC-43`).

**Given, not derived** - the block SHALL show the words the grader's reading
gave it, and SHALL translate or re-word none of them.

#### Scenario: shared-ui-grading-submission-SC-37 - A graded card reads grade, grader and certificate
**Serves:** The cards after hand-in - a collector reading the grades the day they post

- **WHEN** `GradingGradeCards` renders a card with a grade, its label word, the
  grader and a certificate
- **THEN** all four are shown, in the grader's words

#### Scenario: shared-ui-grading-submission-SC-70 - A collected slab carries its hand-back photograph
**Serves:** The cards after hand-in - a collector on `grade10-site`'s submission page checking the slab is theirs

- **WHEN** `GradingGradeCards` renders a graded card with the photograph
  taken at hand-back
- **THEN** the photograph is shown beside its grade, grader and certificate
- **AND** a card given no photograph shows none

#### Scenario: shared-ui-grading-submission-SC-38 - An ungraded card reads the code and the note
**Serves:** The cards after hand-in - a collector reading why one card came back raw

- **WHEN** `GradingGradeCards` renders a card returned ungraded with the
  grader's code and note
- **THEN** no grade is shown
- **AND** the code and the note are shown, drawn apart from the graded cards

#### Scenario: shared-ui-grading-submission-SC-39 - A card with no grade shows its badge and no grade
**Serves:** The cards after hand-in - a collector reading a card the grader did not grade

- **GIVEN** cards moved up a level, held by the grader, below their minimum
  grade, not returned and damaged, each with the badge it was given
- **WHEN** `GradingGradeCards` renders them
- **THEN** each shows its badge
- **AND** no grade is shown on a card the grader issued none for

### Requirement: The pickup card says what to bring

What the collector reads when the cards are ready.

**The code** - `GradingPickupCard` SHALL show the pickup code it is given.

**The items** - it SHALL show the slabs and the raw cards to be collected.

**Where and when** - it SHALL show the shop, its address and the hours it is
given, in the zone it is given. Given no hours - the shop names no rule - it
SHALL show the shop and its address alone, never an hours row with nothing
after it. It SHALL say that no booking is needed.

**What is due** - where something is due it SHALL show one figure with the
line that dresses it; where nothing is due it SHALL say so. It SHALL total
nothing: the lines behind the figure are `GradingMoneyBlock`'s.

**What to bring** - where it is given an identity line it SHALL show it,
naming the collector or the person they named; where it is given none it SHALL
say nothing beyond the code is needed.

#### Scenario: shared-ui-grading-submission-SC-40 - A pickup above the threshold asks for an identity document
**Serves:** Collecting the cards - a collector coming in for cards worth more than the shop releases on a code alone

- **GIVEN** a pickup card given the identity line for the collector
- **WHEN** it renders
- **THEN** the code, the items, the shop and its hours are shown
- **AND** the identity line names the collector
- **AND** a card given the line for the person they named names that person
  instead

#### Scenario: shared-ui-grading-submission-SC-41 - A pickup below the threshold asks for nothing more
**Serves:** Collecting the cards - a collector coming in for a short submission

- **WHEN** `GradingPickupCard` renders with no identity line
- **THEN** it says nothing beyond the code is needed

#### Scenario: shared-ui-grading-submission-SC-72 - A shop naming no hours shows no Open row
**Serves:** Collecting the cards - a collector reading where and when to come, at a shop the diary names no weekly rule for

- **WHEN** `GradingPickupCard` renders with `open` left out
- **THEN** the shop and its address are shown
- **AND** no Open row renders

#### Scenario: shared-ui-grading-submission-SC-73 - A card that never came back keeps its settlement on the collected page
**Serves:** The cards after hand-in - a collector reading what happened to a card's money once the rest of the submission is home

- **GIVEN** a card carrying a payout line, or none
- **WHEN** `GradingGradeCards` renders it
- **THEN** the card given a line shows it
- **AND** the card given none shows no such line

#### Scenario: shared-ui-grading-submission-SC-42 - One figure to settle, or none
**Serves:** Collecting the cards - a collector reading what they must pay at the counter

- **GIVEN** a pickup card given 33000 HKD minor units to settle and the line
  that dresses it
- **WHEN** it renders
- **THEN** that one figure and that line are shown
- **AND** a card given nothing to settle says nothing is due

### Requirement: One person can be named to collect

Nobody named, or one person with the day they were named.

**Nobody named** - `GradingNamedCollector` SHALL ask for a name, and SHALL
report no save while the name is empty.

**Named** - it SHALL show the named person and the day they were named, and
SHALL offer changing and removing them, each reporting through a callback of
its own.

**One person** - it SHALL show one named person at a time.

**While saving** - it SHALL offer no save while it reads as pending.

**Refused** - it SHALL show the refusal it is given, and report nothing
further.

#### Scenario: shared-ui-grading-submission-SC-43 - An empty name reports nothing
**Serves:** Collecting the cards - a collector who opens the card and types nothing

- **WHEN** the collector activates the save with an empty name
- **THEN** nothing is reported
- **AND** a card that reads as pending offers no save at all

#### Scenario: shared-ui-grading-submission-SC-44 - A named person reads with the day they were named
**Serves:** Collecting the cards - a collector sending somebody else to the counter

- **GIVEN** one named person with the day they were named
- **WHEN** `GradingNamedCollector` renders
- **THEN** the name and that day are shown, with a change and a remove
- **AND** activating each reports through its own callback

#### Scenario: shared-ui-grading-submission-SC-45 - A refused naming reads the refusal it was given
**Serves:** Collecting the cards - a collector naming somebody after the cards have gone home

- **WHEN** `GradingNamedCollector` renders with a refusal saying the cards were
  already collected
- **THEN** that refusal is shown under the field
- **AND** no saving is reported

### Requirement: One place for the money lines

The fee, what was paid, what changed and what is still due, in one block.

**The lines** - `GradingMoneyBlock` SHALL show, in this order and only where
it is given each: the fee as the cards times the fee a card with its total,
the cover, what was paid with its method, instant and till reference, a card
moved up a level, what was waived, storage, what was refunded, what was paid
out with its route, what was settled, and what is due at the counter.

**The lead** - where something is due the block SHALL open with the settle
line it is given, so what the collector must pay reads first.

**Includes and footnote** - it SHALL show the includes line and the footnote
it is given.

**Given, never worked out** - every figure and every word SHALL be the one it
was given; the block SHALL total, price and convert nothing.

#### Scenario: shared-ui-grading-submission-SC-46 - An estimate reads as unpaid
**Serves:** What is paid and due - a collector reading what the counter will charge before they hand the cards in

- **GIVEN** a fee line of 4 cards at 25000 HKD minor units a card with a total
  of 100000 HKD minor units, and the line saying it is paid at the counter once
  every card is checked
- **WHEN** `GradingMoneyBlock` renders it
- **THEN** the fee line and that line are shown
- **AND** a block given a cover of 12000 HKD minor units shows it under the fee
- **AND** no paid line is shown

#### Scenario: shared-ui-grading-submission-SC-47 - A block with something due leads with it
**Serves:** What is paid and due - a collector reading what stands between them and their slabs

- **GIVEN** a block given a settle lead, a moved-up-a-level line, a storage
  line of 3000 HKD minor units a card a month and 30000 HKD minor units due at
  the counter
- **WHEN** it renders
- **THEN** the settle lead reads first
- **AND** the moved-up line, the storage line and the due figure are all shown

#### Scenario: shared-ui-grading-submission-SC-48 - A card paid out reads its route beside the refunded fee
**Serves:** What is paid and due - a collector whose card did not come back

- **GIVEN** a payout of 600000 HKD minor units with its route and a refunded
  fee of 25000 HKD minor units
- **WHEN** `GradingMoneyBlock` renders them
- **THEN** both lines are shown, the payout naming its route

#### Scenario: shared-ui-grading-submission-SC-49 - A settled block leads with nothing
**Serves:** What is paid and due - a collector reading a submission they have already collected

- **WHEN** `GradingMoneyBlock` renders a waived upcharge and a settled line
  with its till reference, and no due line
- **THEN** both lines are shown
- **AND** no settle lead is shown

#### Scenario: shared-ui-grading-submission-SC-50 - What was paid reads how it was paid
**Serves:** What is paid and due - a collector checking the counter took what it said it would

- **WHEN** `GradingMoneyBlock` renders a paid line of 100000 HKD minor units
  with its method, its instant and its till reference
- **THEN** all four read as given

### Requirement: The uncollected ladder dates every rung

What happens to cards nobody collects, read before it does.

**The rungs** - `GradingUncollectedLadder` SHALL show the reminder rungs, the
rung where storage starts with the fee a card a month, and the notice rung,
each with the day it falls on.

**The notice** - once the notice is posted the rung SHALL show the posting day
and the days the notice gives from it.

**Passed** - a rung already reached SHALL read as passed, and the rungs after
it SHALL not.

**The cards held** - the block SHALL show the ready day and the count of cards
held it is given, and SHALL count nothing itself, so a card withdrawn, paid
out or vaulted is out of the count before it arrives.

**The vault line** - it SHALL show the line it is given about moving a slab
into a vault case instead.

#### Scenario: shared-ui-grading-submission-SC-51 - Three rungs, each with its day
**Serves:** If nobody collects - a collector reading what happens if the cards stay at the shop

- **GIVEN** reminder rungs at 30 and 60 days, storage from day 90 at 3000 HKD
  minor units a card a month, and the notice at day 180, none of them reached
- **WHEN** `GradingUncollectedLadder` renders
- **THEN** each rung is shown with its day
- **AND** the ready day and the count of cards held read as they were given
- **AND** no rung reads as passed

#### Scenario: shared-ui-grading-submission-SC-52 - A reached rung reads as passed
**Serves:** If nobody collects - a collector reading how far the shop has gone

- **GIVEN** a ladder whose reminder and storage rungs are reached
- **WHEN** it renders
- **THEN** those two rungs read as passed
- **AND** the notice rung does not

#### Scenario: shared-ui-grading-submission-SC-53 - The posted notice reads its posting day
**Serves:** If nobody collects - a collector whose cards have been written to about

- **GIVEN** a notice rung posted on a given day, giving 30 days from it
- **WHEN** `GradingUncollectedLadder` renders
- **THEN** the posting day and the 30 days are shown

### Requirement: Every word, figure and act arrives through props

What holds the set portable: a block says only what it was given, and does
nothing else.

**Words** - each block SHALL render only the words of its `copy` prop, and
SHALL carry no wording of its own in any language.

**Acts** - every act SHALL report through a callback named for the event, and
no block SHALL carry the act out itself.

**Nothing outside** - no block SHALL fetch, write, route, read or write a
browser store, read an application store, a feature flag or analytics.

**Money** - an amount SHALL be a count of minor units with an ISO 4217 code,
rendered in the locale it is given; no block SHALL total, convert or round
one.

**Days and instants** - a day or an instant SHALL read in the locale and the
zone it is given.

**Async regions** - a region read asynchronously SHALL render its loading,
empty, error and ready conditions distinctly, each in the words it is given,
and an error SHALL never read as empty.

**Every state from props** - each block SHALL reach every state named in this
capability from props alone, and SHALL carry a story for each.

#### Scenario: shared-ui-grading-submission-SC-54 - The consumer's words are the only words
**Serves:** Content through props - a second brand draws the grading pages in its own language

- **WHEN** a consumer renders `GradingReview` with a `copy` in Traditional
  Chinese
- **THEN** every label, line and control reads that copy and nothing else

#### Scenario: shared-ui-grading-submission-SC-55 - An amount reads as it was given
**Serves:** Content through props - a collector reading a figure their brand formatted

- **WHEN** a block renders 100000 HKD minor units in the locale it was given
- **THEN** that amount reads in that locale with its currency
- **AND** the block derives no other amount from it

#### Scenario: shared-ui-grading-submission-SC-56 - An instant reads in the zone it was given
**Serves:** Content through props - a collector reading a drop-off time in the shop's day

- **WHEN** a block renders an instant with the zone `Asia/Hong_Kong`
- **THEN** the time reads in that zone

#### Scenario: shared-ui-grading-submission-SC-57 - An error is not an empty
**Serves:** Content through props - a collector meeting a page whose catalogue could not be asked

- **WHEN** `GradingPasteSheet` renders its result in error with the consumer's
  message
- **THEN** that message is shown
- **AND** nothing reads as a list that matched nothing

#### Scenario: shared-ui-grading-submission-SC-58 - Every state renders with no application behind it
**Serves:** Content through props - a designer and an engineer reading a state in the workbench

- **WHEN** each block is rendered from its story with props alone
- **THEN** every state this capability names is reached
- **AND** no block asks for data, a route or a store
