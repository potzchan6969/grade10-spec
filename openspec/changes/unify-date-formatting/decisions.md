## Goals

- One package that an app, a Worker or a story imports date text from, in both repositories
- Every string a page, letter or document prints today stays the same
- A check in each repository keeps the date formatters in that one package

## Non-Goals

- A new shape or a changed string: the invoice PDF's `September 24, 2026, 12:30 GMT+8`, the preview intake date and the slot picker's `Sep 3, Thurs` move as they print today
- Countdowns, durations and relative labels that surfaces write themselves
- The four defects the survey found - UTC days on the customer site, UTC rows in the vault console, English words on localized pages, and two spec and doc drifts - each is a `fix` commit after the move
- The date arithmetic Workers use (`addDays`, `startOfDayAfter`, `calendarDaysBetween`) and the wall-clock maths in `utils/zone.ts`
- The POS shell's copy of Shopify's till screens, which keeps its exemption from the check
- Archiving `align-collector-times-to-local-zone`

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where do the formatters live? | A standalone `packages/date` in this store, as @seankcw asked - decided by the round | A subpath of `@grade10/i18n`: no new package, but the catalog package would carry date-fns |
| Q2 | Does the package also turn a typed calendar day into instants? | Yes: `startOfDay`, `endOfDay`, `dayValue` and `isCalendarDay` move with the formatters - decided by the round | Formatters only: the package would need a private copy of the parse. All date code: loan and reminder rules would live in this store |
| Q3 | Do shapes no platform rule names change in this move? | No: they move as they print today - decided by the round | Align them now: printed invoices would change inside a refactor |
| Q4 | Do countdowns and durations join? | No: a follow-on change - decided by the round | Include now: the change roughly doubles, and each new shape needs its own decision |

## Raised

<!-- Empty: this change carries no delta, so no blind pass ran on it. -->

| Capability | Raised | Landed |
| --- | --- | --- |
