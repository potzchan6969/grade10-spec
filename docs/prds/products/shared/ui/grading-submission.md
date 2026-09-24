---
title: Grading Blocks
spec: shared/ui/grading-submission
order: 13
---

The collector's grading pages, drawn once: the fee sheet, the card list in
its two forms, the paste sheet, the level picker, the review, the status rail
and the chip, the pickup card, the named person, the grade cards, the money
block and the uncollected ladder. A brand's site imports them and supplies
the words, the sheet, the submission and the callbacks; the drop-off itself
is [Booking Blocks](/p/shared/ui/appointment-booking).

## The Blocks

- 🚧 **`GradingFeeSheet`** — one sheet per grader: each level's ceiling,
  cards a submission, fee a card, cover rate where the level carries one and
  weeks; a tab per grader when there is more than one; a level nobody has
  priced listed with no figure where its price would be
- 🚧 **`GradingCardList`** — the list a collector edits before hand-in: a
  card matched in the reference or kept as typed, its declared value, its
  reference sales and a minimum grade; the cap, the count that closes a
  level, a card with no value and a card above a ceiling, each named on the
  list; a value is kept in its field until the field is left, and reopened
  from Edit to change it
- 🚧 **`GradingCardRecord`** — the list after hand-in, read only: intake
  id, the photograph pair, and the card's outcome as a badge with its line
  in the collector's words — refused, withdrawn, graded, moved up, ungraded,
  minimum grade not met, held, not returned, damaged, collected, vaulted
- 🚧 **`GradingPasteSheet`** — one card a line, and what the paste made of
  it: matched, kept as typed, without a value, above the ceiling, skipped;
  the Bulk line past 20 cards
- 🚧 **`GradingLevelPicker`** — the grader, then the levels: open with the
  ceiling, the fee and the weeks, or closed naming the card or the count that
  closes it; the estimate with its cover line
- 🚧 **`GradingReview`** — the schedule, the totals, the upcharge warning
  per card with both prices, the five good-to-know lines and the consent tick
  before booking
- 🚧 **`GradingStatusRail`** — Planned to Home in seven steps, the stage
  marked; an ended submission stays where it ended
- 🚧 **`GradingOwnershipChip`** — the status word and whose move it is, as
  one pair; the grader gets its own chip, so waiting on it never reads as
  waiting on the shop
- 🚧 **`GradingPickupCard`** — the code, the items, where and when, what is
  due, and whether to bring an ID: for the collector, for the named person
  too, or not at all
- 🚧 **`GradingNamedCollector`** — nobody named, or one person with the day
  they were named; change or remove
- 🚧 **`GradingGradeCards`** — one card per card: the grade in the grader's
  words, the cert, moved up a level, or ungraded with the grader's code and
  note
- 🚧 **`GradingMoneyBlock`** — the fee, the cover, what was paid and how,
  what moved up, what was waived, refunded or paid out, storage, what is due
  before collection
- 🚧 **`GradingUncollectedLadder`** — the reminder days, the storage day
  and the notice day, each dated; a passed rung marked

Every state is reachable from a story with props alone; the surface each
block lands on is [Grading](/p/grade10-site/grading), and every word reaches
a block through props.

::story{id="grading-submission-gradingfeesheet--one-grader" title="The fee sheet"}

::story{id="grading-submission-gradingcardlist--no-value" title="A card without a value"}

::story{id="grading-submission-gradingcardrecord--handed-in" title="A handed-in card, with its intake id"}

::story{id="grading-submission-gradingpastesheet--above-the-ceiling" title="A pasted line above the ceiling"}

::story{id="grading-submission-gradinglevelpicker--level-closed-by-a-value" title="A level closed by a declared value"}

::story{id="grading-submission-gradingreview--upcharge-warning" title="The upcharge warning"}

::story{id="grading-submission-gradingstatusrail--sent" title="The rail at Sent"}

::story{id="grading-submission-gradingownershipchip--running-late" title="Running late, with the grader"}

::story{id="grading-submission-gradingpickupcard--someone-named" title="The pickup card with someone named"}

::story{id="grading-submission-gradingnamedcollector--named" title="Somebody named to collect"}

::story{id="grading-submission-gradinggradecards--ungraded" title="A card returned ungraded"}

::story{id="grading-submission-gradingmoneyblock--due" title="An upcharge due before collection"}

::story{id="grading-submission-gradinguncollectedladder--notice" title="The written notice rung"}

:::detail{title="Product decisions" for="pm"}
The grading pages are one collector's submission read on a phone, and the
blocks are what draws them. The design record is the change's
`ui-design.md`; the product is [Grading](/p/grade10-site/grading).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Shared, not product-owned | Decided | The blocks live in `packages/ui` with a story per state: the workbench runs every state without a backend, the design record and the code are held together by the same stories, and a second brand imports the set rather than drawing it again. Drawing them inside `packages/grading/frontend` was rejected: no story would run outside the application, and a second brand would copy the set | Design |
| Two card lists | Decided | An editable planning list and a read-only record are two blocks, because one carries fields and callbacks the other never renders; a third for the visit is not needed, the booking set already ships it | Design |
| The drop-off is the diary's | Decided | The shop, the day, the time, the confirmation and the visit card are the appointment-booking exports unchanged; grading adds the batch line and its own three-step rail in the application | Design |
| The status word and the chip are one block | Decided | Every board draws them as one pair, and the status table pairs them, so one block keeps the two from disagreeing | Design |
| A page's title | ❓ Open | `Text` offers no `h1`, so a grading page's title is an `h2` with its sections `h3` under it, as vault's is; whether the design system adds an `h1` rung | Design |
| Story ids | Decided | `grading-submission-<component>--<state>`, the package's own `<Capability>/<Component>` title, the state being the design record's row in kebab-case | Design |
:::
