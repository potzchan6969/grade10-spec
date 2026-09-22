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
