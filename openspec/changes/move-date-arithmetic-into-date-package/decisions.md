## Goals

- One package that reads, writes and counts a date, in the store and in the application
- A Worker, a test or a console imports date maths from `@grade10/date` and from nowhere else
- No function changes its answer and no printed string changes. The one text that changes is the prefix of the error thrown for a zone the arithmetic cannot read

## Non-Goals

- A new function or a changed answer: the eight move as they behave today, with their tests
- The reminder rule: `REMINDER_SEND_FROM_HOUR` and `sendableFromMorning` stay in `@grade10/utils/dates`. The 09:00 send-from hour is the application's rule and the store has no reminder spec
- `Clock`, the seam a service reads now through. It is neither a date nor a count
- The wall-clock fold in `@grade10/utils/zone`, which keeps its own reader of a typed day. That reader and `isCalendarDay` disagree on a day that does not exist (`2026-02-31`), and reconciling them is a fix of its own
- Countdowns, durations and relative labels (Q4 of `unify-date-formatting`)
- The manual viewer under `tools/`, which shows no collector or operator a date

## Decisions

The `Date formatters` row of [Dates and Times](../../../docs/prds/platform/shared/dates-and-times.md) carries Q1 and Q2.

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Does the package also count days, months and hours on a zone? | Yes: the eight functions move with their tests - decided by @seankcw | Counting stays in `@grade10/utils`, as the non-goal of `unify-date-formatting` says: a day is read in one package and counted in the other, and a call that starts from a typed day imports from both |
| Q2 | What stays in `@grade10/utils/dates`? | `Clock`, `REMINDER_SEND_FROM_HOUR` and `sendableFromMorning` - decided by @seankcw (recommended) | Everything leaves and the file is deleted: the store's package would own the 09:00 reminder rule and a clock seam, 31 more files would change, and the store has no spec for either |
| Q3 | Does the unused `elapsedDays` move? | No: it is deleted. Nothing imports it but its own test - decided by @seankcw (recommended) | Moving it: the package would carry an export nobody calls |
| Q4 | Where is the work recorded? | A follow-on change, because `unify-date-formatting` is done and its non-goal stays true of what it delivered - decided by @seankcw (recommended) | Amending `unify-date-formatting`: its acceptance would be superseded for a change it already delivered |

## Raised

<!-- Empty: this change carries no delta, so no blind pass ran on it. -->

| Capability | Raised | Landed |
| --- | --- | --- |
