---
title: Planning a Submission
spec: grade10-site/grading/submission-plan
order: 1
---

A submission is planned on the phone in three steps — the cards, the service,
the drop-off — and nothing is paid or signed until the cards are checked at
the counter.

## Fee Sheet

Every fee is a card, in HKD, and includes the grader's fee and insured
shipping both ways; it is paid at the counter once the cards are checked.

- ❓ **Commercial** — every figure below is an example modelled on PSA's
  sheet; one sheet per grader and level, and CGC and BGS need their own

| Level | Cards up to | Fee a card | Cover | Back in about |
| --- | --- | --- | --- | --- |
| Value | HKD 3,900 | HKD 250 | — | 8 weeks |
| Regular | HKD 11,700 | HKD 600 | — | 5 weeks |
| Express | HKD 19,500 | HKD 1,200 | + 1.5% of declared value | 3 weeks |
| Super Express | HKD 39,000 | HKD 2,400 | + 1.5% of declared value | 2 weeks |
| Bulk, 20 cards or more | HKD 1,500 | HKD 180 | — | 10 weeks |

## Caps and Clocks

| Rule | Value | Confirms |
| --- | --- | --- |
| Cards a submission | ❓ 20 from Value to Super Express, 100 at Bulk | Operations |
| Bulk | ❓ from 20 cards, and the longer drop-off | Operations |
| Above the top ceiling | ❓ a card worth more than HKD 39,000: ask at the counter or WhatsApp the shop first | Commercial |
| Cover | ❓ 1.5% of declared value at Express and Super Express | Commercial |
| Turnaround | ❓ the grader's published time plus two weeks, counted from the day the batch leaves | Commercial |
| Nudge | ❓ 21 days, a plan with no drop-off booked | Operations |
| Expiry | ❓ 30 days, a plan with no drop-off booked | Operations |
| Fee policy | ❓ the fee stands on a card returned ungraded; a card refused at the counter is never charged; a card withdrawn before its batch closes is refunded at the till | Commercial |

## The Wizard

:::flow{title="Planning a submission"}
## *Collector* — **The cards**
Name, email and phone, filled from the account when signed in; then one block
per card: the name and set matched in the catalogue, the declared value, and
the recent sales at ungraded, PSA 9 and PSA 10 as a reference, not a
valuation. A card may carry a minimum grade, only encapsulate at PSA 9 or
above, the fee applying either way.

## *Collector* — **The service**
The grader — PSA, CGC or BGS — then the level. A level is open when every
declared value is inside its ceiling and the count fits; a closed one names
the card or the count that closes it. The estimate is cards × the fee a card,
with the return date.

## *Collector* — **Book**
The schedule, the totals, the upcharge warning per card, the five good-to-know
lines and the consent line; then the drop-off is booked, or the plan is saved
to book later.
:::

- 🚧 **One grader, one level** — every card goes to one grader at one level;
  a card that needs another level goes in a second submission on the same
  drop-off
- 🚧 **Paste a list** — one card a line, name, set and number, then the
  value; each line reports as matched in the catalogue, kept as typed with no
  reference, without a value and asked for before continuing, or above the
  level's ceiling and moved to a second submission on the same drop-off; a
  line naming a card already listed is skipped
- 🚧 **Level availability** — a level closes with its reason: a named card
  declared above its ceiling, or Bulk with fewer than 20 cards; more than 20
  cards leaves Bulk the only level open
- 🚧 **The estimate** — cards × the fee a card, the level, and the return
  date counted from the Friday the batch leaves
- 🚧 **The review's totals** — declared value in total, and the fee at the
  counter
- 🚧 **The upcharge warning** — for each card whose PSA 10 reference is above
  the level's ceiling: the level the grader moves it to, the difference due
  at the counter before collection, and what the higher level would cost now
- 🚧 **Good to know** — five lines before booking: a fee is charged on a card
  that comes back ungraded, and a card the grader would not take is refused at
  the counter and never charged; a card can move up a level and the difference
  is told before collection; the return date is an estimate; nothing is paid
  or signed before staff have checked each card with the collector; slabs are
  not shipped back, the collector or a person they name collects
- 🚧 **Consent** — the personal information collection statement, read and
  ticked before booking
- 🚧 **Finish later** — the plan is kept under the email given and its link
  is emailed the moment the collector leaves; it opens on any device with no
  account, and signing in with the same email, no password, lists every
  submission
- 🚧 **Signed out** — the first visit shows what grading is, the four steps
  and the price sheet, and starts a submission or books a drop-off without a
  list

<!-- story: the three wizard steps, the paste sheet's four results, the estimate card -->

:::example{title="5TW8HN's estimate and upcharge"}
| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Lists | 4 cards, the highest declared $8,500: Value closes on it, Regular is the level | | 0 |
| Estimates | 4 × $600 at PSA Regular, back in about 5 weeks | +2400 | 2400 |
| Warns | Umbreon VMAX at PSA 10 is worth about $15,000, above Regular's $11,700: Express, and $600 more only if it grades 10 | | 2400 |
| Grades | PSA 10, moved up a level; the difference is due at the counter before collection | +600 | 3000 |

Express for the card now would be $1,200; Regular is $600, plus $600 only on a
10. The balance is what the collector pays in all.
:::

:::detail{title="Code map" for="engineer"}
- **Slices** — `packages/grading/frontend/src/features/plan`; the pages in
  the grade10 SPA under `pages/grading`
- **Contracts** — the fee sheet, the caps and the clocks in
  `packages/grading/contracts`, read from the settings the console holds
- **Diary** — `packages/appointment` over its per-product entrypoint
- **Architecture** —
  [grading.md](https://github.com/9gag/grade10/blob/main/docs/architecture/grading.md)
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| The declared value picks the level | Decided | The level is the most any one card is worth; the value never sways the grade, and the reference sales are a reference | Product |
| The upcharge is shown per card before booking | Decided | The review step names each card that could move up, the difference, and what the higher level costs now, so the collector chooses knowing both | Design |
| No account needed | Decided | The plan lives under the email given and the emailed link opens it; signing in with the same email lists every submission, with no password | Product |
| A plan lapses | ❓ Open | Nudged at 21 days and expired at 30 with no drop-off booked, told by a short email; prices and references move, so an old list is not kept | Operations |
| Bulk cap | ❓ Open | 100 cards a submission at Bulk from a pasted list, 20 at every other level; above it a second submission on another day. Revisited once dealer volume is known | Operations |
| Fee sheet | ❓ Open | Example figures modelled on PSA's; Commercial supplies one sheet per grader and level, ceiling, fee, cover line and estimate | Commercial |
| Fee policies | ❓ Open | The fee stands on an ungraded card, a refused card is never charged, a withdrawn card is refunded at the till; told on the review step and in clause 3 | Commercial |
:::
