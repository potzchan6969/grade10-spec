## Context

Nineteen date renderings exist in `grade10`, listed in the proposal. None is
wrong the way a fixed `÷100` was wrong for money — the calendar arithmetic is
correct everywhere — so this change is about agreement, about the one thing
nothing decides for you (whether a rendering names its zone), and about
moving from nineteen hand-written option objects onto a library the platform
states its formats in.

Constraints the approach has to respect:

- Dates cross every layer, exactly as money does. The same rendering runs in a
  Worker composing an email, in a browser painting a table, and in a demo
  running neither, so the module cannot depend on a runtime, a design system,
  or a brand.
- `@grade10/utils` already holds `money`, which this change deliberately
  mirrors — same home, same shape-per-audience idea, same guard. A reader who
  has seen one should need no second explanation. It does not mirror money's
  formatter cache: `format` is a function call, not an object to build, so
  there is nothing to memoize.
- The grade10 admin's `src/dates.ts` is correct and covered by
  `src/dates.test.ts`. Its behaviour is preserved exactly; its hand-rolled
  string math is not.
- `date-fns ^4.0.0` and `@date-fns/tz ^1.2.0` are already the versions this
  dependency graph anticipates: `@base-ui/react ^1.6.0`, which the design
  system depends on, declares both as optional peers for its date components.
  Neither is installed today — the peers are optional and nothing has needed
  them.
- Requirements: [`dates-and-times`](specs/dates-and-times/spec.md).

## Goals / Non-Goals

**Goals:**

- One place an instant becomes text, reachable from every layer.
- A shape chosen by what the reader is doing, not by what the last author
  typed.
- A deadline that cannot be rendered without its zone.
- A format the platform states, identical on every reader's machine.
- A language a caller can pass, before a second one needs to be shown.
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

*Rejected — a `packages/dates` on top of date-fns:* the library is the
dependency; the module is four functions and a bridge. Same argument.

### date-fns v4, with `@date-fns/tz` for the zone

The module is a thin layer over `format` from `date-fns`, with `tz` from
`@date-fns/tz` supplying the zone through v4's `in` option.

Three reasons this beats hand-written `Intl.DateTimeFormatOptions`:

- **A format the platform states.** `Intl`'s `dateStyle: "medium"` means
  whatever the reader's ICU data says it means — the source of half the
  divergence in the proposal's table, since a surface cannot state a format
  even when it wants to. A date-fns pattern is one string, and it renders the
  same everywhere.
- **A stated format is testable.** `format(at, "d MMM yyyy, HH:mm")` asserts
  as a literal. The `Intl` equivalent has to be asserted against a
  reconstruction of itself, or against an ICU version.
- **An invalid date fails.** `format` throws `RangeError: Invalid time value`;
  `Intl` renders the string `Invalid Date` into the page. Failing loudly on a
  bad instant is the repository's stated principle, and it is the reason the
  spec now has a requirement for it.

`@date-fns/tz` is the v4-native companion — `tz("UTC")` passed as `{ in }` —
not the older `date-fns-tz`, whose `formatInTimeZone` belongs to v2/v3. The
optional peer `@base-ui/react` declares is `@date-fns/tz ^1.2.0`, so the two
halves of the dependency graph agree.

*Rejected — `Intl.DateTimeFormat` directly:* what the repository has now. It
cannot state a format, silently renders `Invalid Date`, and makes every test
assert against ICU rather than against a string.

*Rejected — `Temporal`:* not in the Workers runtime the auction email
renders in, and a polyfill is heavier than date-fns for formatting alone.

*Rejected — `date-fns-tz`:* the v3-era package. `formatInTimeZone` would work,
but it pairs with the version of date-fns this graph is not on.

### Four named shapes, not an options object

```ts
formatDay(at: Date, opts?: DateFormat): string       // 19 Aug 2026
formatMoment(at: Date, opts?: DateFormat): string    // 19 Aug 2026, 22:00
formatEvent(at: Date, opts?: DateFormat): string     // 19 Aug 2026, 22:00:14
formatDeadline(at: Date, opts?: DateFormat): string  // 19 Aug 2026, 22:00 GMT+8

type DateFormat = { locale?: Locale; timeZone?: string };  // Locale from date-fns
```

One pattern per shape, and the patterns are the module's whole vocabulary:

| Shape | Pattern |
| --- | --- |
| `formatDay` | `d MMM yyyy` |
| `formatMoment` | `d MMM yyyy, HH:mm` |
| `formatEvent` | `d MMM yyyy, HH:mm:ss` |
| `formatDeadline` | `d MMM yyyy, HH:mm zzz` |

`HH` rather than `hh a`: a 24-hour clock is unambiguous at a glance, needs no
locale to disambiguate, and is what an operator table wants in a fixed-width
column. The outputs above are verified, not assumed.

The shapes are named for the reader's task, not for their pattern, because
the choice a call site has to make is "what is this reader doing with this
date" and not "which format string did the last table use". A name a reviewer
can check against the surrounding code is the whole mechanism: three of the
nineteen sites carry `timeStyle: "medium"` where every neighbour is `"short"`,
and no reviewer could have caught that. Exporting the patterns instead would
reproduce the problem in a new alphabet.

*Rejected — `formatDate(at, style, opts)` with a `style` union:* one export,
but the call site reads `formatDate(order.createdAt, "moment")` — a string
argument that has to be looked up, where `formatMoment(order.createdAt)` says
it. `money` took the option-object route for `currencyDisplay` because there
the two shapes differ by one `Intl` option with an `Intl` name; here the four
differ in which fields exist at all.

*Rejected — exporting a `format(at, pattern, opts)` passthrough:* that is the
status quo with a nicer import. Nothing would stop the twentieth shape, and
the guard in group 5 exists precisely to make a raw pattern unreachable.

### `formatDeadline` renders the zone name, always

It is the one shape whose zone is not optional, and the requirement that makes
it worth having. The `zzz` token gives the specific non-location name:
`GMT+8` in Hong Kong, `GMT-4` in New York, `GMT+0` in UTC. `zzzz` would give
`GMT+08:00` and cost a table column.

This changes the auction email's close from `Aug 19, 2026, 02:00 PM UTC` to
`19 Aug 2026, 14:00 GMT+0` — same instant, platform format, and the label
date-fns emits for UTC. Named in the proposal's Impact.

*Rejected — special-casing UTC to the literal `UTC`:* nicer in mail, and a
per-zone exception inside a formatter is exactly how a formatter grows a
second shape. `GMT+0` is unambiguous, which is all the requirement asks for.

The auction page passes no zone and renders in the reader's own, named.

### `locale` is a date-fns `Locale`, and English is the default

date-fns has no notion of "the runtime's locale": a locale is an imported
object, and `format` falls back to `enUS` when given none. So the module's
`locale` takes a date-fns `Locale` and defaults to English.

This is the one place adopting the library changes behaviour rather than
consolidating it, and it changes it deliberately. Today a date's ordering is
whatever the reader's browser is set to, which is half of why the nineteen
renderings diverge; after this, ordering and punctuation are the platform's
in every browser, and only the *words* follow a locale someone passes. The
`@grade10/i18n` catalogs are where that language will come from when a second
one ships — importing `date-fns/locale/de` beside the German catalog is the
whole wiring, and it is out of scope here.

The proposal's Impact names what a non-English operator sees change.

*Rejected — mapping a BCP-47 string to a date-fns locale inside the module:*
a registry of every locale the platform might ever want, statically imported
into every bundle that formats a date, to serve callers that do not exist
yet. The `Locale` object is date-fns's own currency; the caller that has a
language has the import.

### `timeZone` is a zone name, applied through `@date-fns/tz`

`timeZone` takes an IANA name and reaches `format` as `{ in: tz(name) }`.
Omitted, it renders in the runtime's zone — which is what every browser
surface wants and what they all do today.

The email worker passes `timeZone: "UTC"`, because a message composed once and
read anywhere has no reader's zone to inherit. The demos pass an explicit
`timeZone` and `locale` so their assertions do not depend on the machine
running them — a real trap, since the store and auction demo suites run in CI
and on laptops in different zones.

### Audit logs keep their seconds; every other operator table stops at the minute

The inconsistency the proposal names is settled rather than flattened. An
audit log exists to order and correlate records, which is what `formatEvent`
is for; an order table is read for its rows and not its ordering, so
`formatMoment` is right there. Both are now a named choice a reviewer can
disagree with, instead of a difference nobody chose.

### The calendar-day bridge moves in, and its string math goes

`startOfDay`, `endOfDay`, and `dayValue` move from
`apps/admin/grade10/src/dates.ts` into the module, keeping their names,
signatures, and behaviour — and losing their hand-rolled bodies. Today they
build a `Date` from an interpolated template string and pad month and day
with `padStart`; on date-fns they are `startOfDay(parseISO(day))`,
`endOfDay(parseISO(day))`, and `format(at, "yyyy-MM-dd")`.

The output is identical, verified across the zone boundary that matters: a
`2026-08-19` typed in Hong Kong yields `2026-08-18T16:00:00.000Z` and
`2026-08-19T15:59:59.999Z` either way. The existing `dates.test.ts` moves
with them and is the proof — this is a refactor under a passing suite, which
is why it is one task rather than three.

They belong here because they are the same subject — the seam between a
calendar day and an instant, differing only in direction. Left app-local, the
zzz panel copies them the first time it grows a date filter, which is the
mechanism that produced all nineteen renderings.

*Rejected — moving them to a `packages/utils/src/calendarDay.ts`:* a second
module for three functions, split from the formatting they sit beside on every
screen that has a date filter.

### A check keeps the twentieth copy out

`scripts/check-dates.mjs`, wired into `pnpm run check:libs` beside
`check-money.mjs`, fails when `Intl.DateTimeFormat`, `toLocaleDateString`,
`toLocaleTimeString`, or `toLocaleString` appears outside
`packages/utils/src/dates.ts` — and equally when `date-fns` or `@date-fns/tz`
is imported outside it.

The second half is what makes the first half hold. A library in the
dependency tree is easier to reach for than four lines of `Intl` were, so
adopting date-fns without guarding the import would trade nineteen hand-rolled
renderings for nineteen `format(at, "dd/MM/yy")` calls and no way to see them.
The module owns the patterns; nothing else names one.

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

- **Every date loses the reader's locale ordering.** The largest visible
  consequence of the library, deliberate and covered above: a German-locale
  operator reads `19 Aug 2026, 22:00` where `19.08.2026, 22:00` shows today.
  Consistency across the platform is bought with a browser preference nobody
  set on purpose.
- **The auction close changes shape for collectors.** Intended, and the
  reason the change is worth making. `Closes 8/19/2026, 10:00:00 PM` becomes
  `Closes 19 Aug 2026, 22:00 GMT+8`.
- **The auction email's zone label changes** from `UTC` to `GMT+0`. Same
  instant, uglier word. Decided above rather than special-cased.
- **`zzz` reads as an offset, not an abbreviation.** `GMT+8`, not `HKT` —
  neither date-fns nor ICU publishes a Hong Kong abbreviation. Correct and
  unambiguous, but an operator expecting one may report it as a bug. Named
  here so the answer is on record.
- **Two new dependencies in every bundle that shows a date**, including the
  auction email Worker. Both are pure ESM and tree-shakeable, and the module
  imports `format`, `parseISO`, `startOfDay`, `endOfDay` and `tz` by name —
  but this is weight the repository did not carry before, and the first
  measurement belongs in the group that lands it.
- **A table gains a column's worth of width** wherever `formatDeadline`
  replaces a bare moment. Only the auction page does that today.
- **The guard's patterns are broad**, and `toLocaleString` in particular is a
  `Date` method a non-date object could plausibly have. If the false positives
  are noisy, narrow the pattern rather than adding exemptions — exemptions are
  the thing that erodes a guard.
- **One shared module is one shared blast radius.** Mitigated by the module
  being pure, total, and covered per shape with an explicit locale and zone.

## Migration Plan

The module lands first; nothing else depends on the order after that. Each
call site moves with its own tests, and the file it empties is deleted in the
same task — no compatibility period, since every caller is in this repository.

1. `date-fns` and `@date-fns/tz` added to `@grade10/utils`, then
   `@grade10/utils/dates`: the four shapes, plus the day bridge moved in from
   the grade10 admin with its tests.
2. Auction email repointed at `formatDeadline` with `timeZone: "UTC"` — the
   rendered close changes text, and its suite's expectation changes with it.
3. Both admin panels: thirteen inline formatters removed, the day bridge's
   two callers repointed, `apps/admin/grade10/src/dates.ts` deleted.
4. Auction page and the three demos repointed; the auction close gains its
   zone.
5. The check that keeps the copies from coming back, plus the convention note
   and the handbook.
