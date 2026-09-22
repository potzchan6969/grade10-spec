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
- The caps
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
- Priced at booking
  - The sheet is pinned: a plan is priced on the sheet it was booked on, and
    the agreement prints those figures
  - A changed sheet: reaches plans not yet booked and no others
- Keeping the plan
  - Under the email given: the plan is kept there and its link is mailed the
    moment the collector leaves
  - Any device, no account: the link opens the plan wherever it is read
  - Signing in lists them all: the same email and no password lists every
    submission, open and closed
  - Nudged, then let go: one reminder, then the plan expires with nothing paid
    and nothing owed
