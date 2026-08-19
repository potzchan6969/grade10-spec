## Context

Nineteen date renderings exist in `grade10`, listed in the proposal. None is
wrong the way a fixed `÷100` was wrong for money — `Intl.DateTimeFormat` gets
the calendar right — so this change is about agreement and about the one thing
`Intl` will not decide for you: whether a rendering names its zone.

Constraints the approach has to respect:

- Dates cross every layer, exactly as money does. The same rendering runs in a
  Worker composing an email, in a browser painting a table, and in a demo
  running neither, so the module cannot depend on a runtime, a design system,
  or a brand.
- `@grade10/utils` already holds `money`, which this change deliberately
  mirrors — same home, same memoization, same guard. A reader who has seen one
  should need no second explanation.
- The grade10 admin's `src/dates.ts` is correct and covered by
  `src/dates.test.ts`. It moves; it is not rewritten.
- Requirements: [`dates-and-times`](specs/dates-and-times/spec.md).

## Goals / Non-Goals

**Goals:**

- One place an instant becomes text, reachable from every layer.
- A shape chosen by what the reader is doing, not by what the last author
  typed.
- A deadline that cannot be rendered without its zone.
- A locale a caller can pass, before a second language needs one.
- A twentieth copy fails a check rather than passing review.

**Non-Goals:**

- Relative time, countdowns, durations.
- Zone arithmetic, or recording a reader's zone.
- Date parsing from external systems.
- A `Timestamp` value type through the wire contracts.

## Decisions

### One module at `@grade10/utils/dates`

A single file plus its tests, beside `money.ts`.

The same three reasons hold as for money: `utils` is the flat brand-neutral
lib whose subpaths each name a concern, every consumer already depends on it
or can in one line, and a formatter is data rather than presentation, so the
package rule against importing a design system is not in tension.

*Rejected — a `dates.ts` per app:* the shape the repository has today. Two
admin panels already disagree, and the site, the demos, and the email worker
are outside any of them. Three owners cannot be guarded; one can.

*Rejected — a new `packages/dates`:* a hundred lines arriving with a
`package.json`, a tsconfig, a vitest config, and a workspace entry. The layout
convention reserves a flat package for a role with something to own.

*Rejected — `date-fns` or `Temporal`:* nothing here needs arithmetic.
`Intl.DateTimeFormat` already does the formatting, correctly, in every runtime
the platform targets; a dependency would add weight to a Worker bundle to
wrap it.

### Four named shapes, not an options object

```ts
formatDay(at: Date, opts?: DateFormat): string       // 19 Aug 2026
formatMoment(at: Date, opts?: DateFormat): string    // 19 Aug 2026, 22:00
formatEvent(at: Date, opts?: DateFormat): string     // 19 Aug 2026, 22:00:14
formatDeadline(at: Date, opts?: DateFormat): string  // 19 Aug 2026, 22:00 GMT+8

type DateFormat = { locale?: string; timeZone?: string };
```

The shapes are named for the reader's task, not for their `Intl` options,
because the choice a call site has to make is "what is this reader doing with
this date" and not "which `timeStyle` did the last table use". A name a
reviewer can check against the surrounding code is the whole mechanism: three
of the nineteen sites are `dateStyle: "medium", timeStyle: "medium"` where
every neighbour is `"short"`, and no reviewer could have caught that.

*Rejected — `formatDate(at, style, opts)` with a `style` union:* one export,
but the call site reads `formatDate(order.createdAt, "moment")` — a string
argument that has to be looked up, where `formatMoment(order.createdAt)` says
it. `money` took the option-object route for `currencyDisplay` because there
the two shapes differ by one `Intl` option with an `Intl` name; here the four
differ in which fields exist at all.

*Rejected — passing `Intl.DateTimeFormatOptions` through:* that is the status
quo with an import in front of it. Nothing would stop the twentieth shape.

### `formatDeadline` renders the zone name, always

It is the one shape whose zone is not optional, and the requirement that makes
it worth having. Its `timeZoneName: "short"` is what ICU has: `UTC` for UTC,
`GMT+8` for Hong Kong — ICU publishes no `HKT` abbreviation. Unambiguous
either way, which is the point; `"long"` would give "Hong Kong Standard Time"
and cost a table column.

The auction email passes `timeZone: "UTC"` and `locale: "en"` and keeps
rendering exactly as it does today. The auction page passes neither and
renders in the reader's own zone, named.

### `locale` and `timeZone` are options, defaulting to the runtime's

Both default to `undefined`, which is `Intl`'s own "use the runtime's", so
every browser surface behaves as it does today until something has a locale
to pass. The email worker passes both, because a message has no reader to
inherit from — the same reason `formatMoney` is called with `locale: "en"`
there.

The demos pass an explicit `locale` and `timeZone` so their assertions do not
depend on the machine running them. This is a real trap: the store and auction
demo suites run in CI and on laptops in different zones.

### Audit logs keep their seconds; every other operator table stops at the minute

The inconsistency the proposal names is settled rather than flattened. An
audit log exists to order and correlate records, which is what `formatEvent`
is for; an order table is read for its rows and not its ordering, so
`formatMoment` is right there. Both are now a named choice a reviewer can
disagree with, instead of a difference nobody chose.

### The calendar-day bridge moves in unchanged

`startOfDay`, `endOfDay`, and `dayValue` move from
`apps/admin/grade10/src/dates.ts` into the module with their tests, keeping
their names and bodies.

They are the same subject — the seam between a calendar day and an instant —
and the direction is the only thing that differs. Leaving them app-local means
the zzz panel copies them the first time it grows a date filter, which is the
mechanism that produced all nineteen renderings.

*Rejected — moving them to a `packages/utils/src/calendarDay.ts`:* a second
module for three functions, split from the formatting they sit beside on every
screen that has a date filter.

### A check keeps the twentieth copy out

`scripts/check-dates.mjs`, wired into `pnpm run check:libs` beside
`check-money.mjs`, fails when `Intl.DateTimeFormat`, `toLocaleDateString`,
`toLocaleTimeString`, or `toLocaleString` appears outside
`packages/utils/src/dates.ts`.

One exemption, declared in the script with its reason:
`packages/loyalty/backend/src/utils/time.ts` builds an
`Intl.DateTimeFormat` to read wall-clock *parts* through `formatToParts` and
compute a program's period boundaries in its zone. It renders nothing to a
reader. Exempting it by path — rather than by pattern — keeps the exemption
visible and reviewable; a second file wanting the same treatment has to argue
for it in a diff.

*Rejected — exempting `formatToParts` by pattern:* a display formatter is one
`.format()` away from a `formatToParts` that looks exempt, and the guard would
stop meaning what it says.

### The capability sits at the top level of `specs/`

`dates-and-times` binds storefronts, admin panels, demos, and email across
both brands rather than belonging to one product, so it sits beside the
product directories the way `money-amounts` does.

### No `ui.md`

No screen is added or laid out, and no design-system or `@grade10/ui` export
changes. The one collector-visible delta — the auction close gaining its zone
— is text inside an existing `Text` node, named in the proposal's Impact and
in the migration plan below.

## Risks / Trade-offs

- **The auction close changes shape for collectors.** Intended, and the
  reason the change is worth making. `Closes 8/19/2026, 10:00:00 PM` becomes
  `Closes 19 Aug 2026, 22:00 GMT+8`.
- **`timeZoneName: "short"` reads as an offset in some zones.** `GMT+8`, not
  `HKT`. Correct and unambiguous, but an operator expecting an abbreviation
  may report it as a bug. Named here so the answer is on record.
- **A table gains a column's worth of width** wherever `formatDeadline`
  replaces a bare moment. Only the auction page does that today.
- **The guard's four patterns are broad**, and `toLocaleString` in particular
  is a `Date` method a non-date object could plausibly have. If the false
  positives are noisy, narrow the pattern rather than adding exemptions —
  exemptions are the thing that erodes a guard.
- **One shared module is one shared blast radius.** Mitigated by the module
  being pure, total, and covered per shape with an explicit locale and zone.

## Migration Plan

The module lands first; nothing else depends on the order after that. Each
call site moves with its own tests, and the file it empties is deleted in the
same task — no compatibility period, since every caller is in this repository.

1. `@grade10/utils/dates`: the four shapes, plus the day bridge moved in from
   the grade10 admin with its tests.
2. Auction email repointed at `formatDeadline` with `timeZone: "UTC"`,
   `locale: "en"` — same output, one fewer formatter.
3. Both admin panels: thirteen inline formatters removed, the day bridge's
   two callers repointed, `apps/admin/grade10/src/dates.ts` deleted.
4. Auction page and the three demos repointed; the auction close gains its
   zone.
5. The check that keeps the copies from coming back, plus the convention note
   and the handbook.
