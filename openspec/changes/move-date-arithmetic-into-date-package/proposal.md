**Author:** @seankcw - 2026-10-09

Product context: [Dates and Times](../../../docs/prds/platform/shared/dates-and-times.md).

## Why

A calendar day is read and written in `@grade10/date` and counted in `@grade10/utils/dates`. A call that starts from a typed day imports from both. `listing-media.spec.ts` took `dayValue` from the wrong one and failed typecheck on the change that moved the formatters. The application's date check names two owners of date maths where one would do.

**Metric:** the modules a Worker, a test or a console imports date maths from drop from 2 to 1, and the exports of `@grade10/utils/dates` drop from 12 to 3. No function changes its answer.

## What Changes

- **Support one home for date maths** - `@grade10/date` counts days, months and hours on a zone: `addDays`, `startOfDayAfter`, `endOfDayAfter`, `atOrBefore`, `calendarDaysBetween`, `wholeMonthsBetween`, `firstOfMonth` and `hourOf`, with their tests
- **BREAKING - the arithmetic leaves `@grade10/utils/dates`** - the application imports the eight from `@grade10/date`. The unused `elapsedDays` is deleted. This reverses the rule that date arithmetic stays in `@grade10/utils` (Q2 and the non-goals of `unify-date-formatting`)
- **Utils keeps what is the application's** - `Clock` and the 09:00 reminder rule, which reads the hour from the package
- **The checks follow** - `check-dates` names the package as the one owner of date maths, and `check-lanes` keeps the non-UTC timezone pin on every suite that reaches it

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. `skip_specs: true`: no function changes its answer and no durable spec names an arithmetic export.

## Impact

- `grade10-spec`: `packages/date` gains an arithmetic module and its test, and the barrel exports the eight; `AGENTS.md` and the Dates and Times decision row name the package as the owner of date maths
- `grade10`: 56 files import a moved function, 4 of them beside `Clock` or the reminder rule; `packages/utils` drops `date-fns` and `@date-fns/tz`; `check-dates.mjs`, `check-lanes.mjs`, 13 vitest comments, the date lines of two conventions pages and the handbook's `/dates` entry follow
- Lockfile: `packages/utils` loses two dependencies and `packages/coupons/contracts`, `packages/grade10-auth/backend` and `packages/vault/frontend` gain `@grade10/date`; `date-fns` and `@date-fns/tz` stay at their locked versions in `packages/date`
