**Author:** @seankcw - 2026-10-08

Product context: [Dates and Times](../../../docs/prds/platform/shared/dates-and-times.md).

## Why

Two modules turn an instant into text. `@grade10/ui` holds the collector formatters in this store. `@grade10/utils/dates` holds the application's, about 270 frontend call sites and every sent letter, document and mail. Both export `formatDay`, `formatMoment`, `formatEvent` and `formatDeadline`, with different arguments and different output: the store's always print `UTC`, the application's name the zone. The application checks that nothing formats a date outside its module; nothing checks the store, so a third and fourth copy exist there (the invoice PDF and the emails).

**Metric:** the number of modules an app can import a date formatter from drops from 2 to 1, and the number of formatters left in `@grade10/ui` and `@grade10/utils` drops to 0. Every string a page, letter or document prints today is unchanged.

## What Changes

- **Support one date package** - `@grade10/date` (`packages/date`) holds every date and time formatter, with no React and no DOM, so a Worker imports it as well as a browser
- **BREAKING - the store's formatters leave `@grade10/ui`** - `formatDay`, `formatMoment`, `formatEvent`, `formatDeadline`, the `formatLocal*`, `formatZoned*`, `formatCollectorDeadline`, `formatViewerZoneName`, `formatCalendarDayLabel`, `formatRelativeAt`, `formatActivityAt` and their helpers are no longer exported; the application imports them from `@grade10/date`
- **The application's formatters move** - the text half of `@grade10/utils/dates` moves to the package; the date arithmetic workers use stays
- **The store's other copies move** - the invoice PDF, the emails and the design-system calendar format through the package
- **A check in each repository** - an import or call that formats a date outside the package fails CI, in the store as it already does in the application

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. `skip_specs: true`: every printed string stays the same, and no durable spec names a formatter export.

## Impact

- `grade10-spec`: new `packages/date`; `packages/ui` loses `src/lib/format-datetime.ts` and its exports; `apps/preview`, `apps/emails`, the invoice PDF blocks and the design-system calendar change imports; `AGENTS.md` and `PRODUCT.md` name the fourth package; a Dates and Times decision row records it
- `grade10`: about 20 files import the store's formatters and about 270 import `@grade10/utils/dates`; `check-dates.mjs`, `check-lanes.mjs` and two conventions pages follow
- Both lockfiles gain the package; date-fns and `@date-fns/tz` stay at their locked versions

## Follow-on changes

- Countdowns, durations and relative labels that surfaces still write themselves become shapes of the same package
